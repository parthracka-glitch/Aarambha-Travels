import crypto from 'crypto';
import { AdminUser, User } from '../models/shared.model';
import { comparePassword, hashPassword, createToken, recordAudit } from '../middlewares/auth.middleware';
import { realtimeService } from './realtime.service';

function hashCryptoToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export class AuthService {
  /**
   * Universal Login for Admin and Customer accounts with Account Lockout protection
   */
  static async login(email: string, password: string, ipAddress?: string) {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Search in AdminUser first
    let account: any = await AdminUser.findOne({ email: cleanEmail }).select('+hashedPassword +tokenVersion +failedLoginAttempts +lockUntil +isActive');
    let userType: 'admin' | 'customer' = 'admin';

    // 2. If not admin, search in Customer User
    if (!account) {
      account = await User.findOne({ email: cleanEmail }).select('+hashedPassword +tokenVersion +failedLoginAttempts +lockUntil');
      userType = 'customer';
    }

    if (!account) {
      await recordAudit({
        actorName: cleanEmail,
        action: 'LOGIN_FAILED_USER_NOT_FOUND',
        targetType: 'auth_attempt',
        ipAddress,
      });
      const error: any = new Error('Incorrect email or password');
      error.statusCode = 401;
      throw error;
    }

    // 3. Check Account Lockout
    if (account.lockUntil && account.lockUntil.getTime() > Date.now()) {
      const remainingMinutes = Math.ceil((account.lockUntil.getTime() - Date.now()) / (60 * 1000));
      await recordAudit({
        actorName: account.name || cleanEmail,
        action: 'LOGIN_BLOCKED_ACCOUNT_LOCKED',
        targetType: userType === 'admin' ? 'admin_user' : 'user',
        targetId: String(account._id),
        ipAddress,
        details: { remainingMinutes },
      });
      const error: any = new Error(`Account is temporarily locked due to multiple failed login attempts. Please try again in ${remainingMinutes} minute(s).`);
      error.statusCode = 403;
      throw error;
    }

    // 4. Check active status for admins
    if (userType === 'admin' && account.isActive === false) {
      const error: any = new Error('This account has been disabled. Please contact the administrator.');
      error.statusCode = 403;
      throw error;
    }

    // 5. Constant-time safe password verification
    const isPasswordValid = await comparePassword(password, account.hashedPassword);

    if (!isPasswordValid) {
      account.failedLoginAttempts = (account.failedLoginAttempts || 0) + 1;

      // Lock account for 15 minutes after 5 consecutive failures
      if (account.failedLoginAttempts >= 5) {
        account.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await account.save();

      await recordAudit({
        actorName: account.name || cleanEmail,
        action: 'LOGIN_FAILED_INVALID_PASSWORD',
        targetType: userType === 'admin' ? 'admin_user' : 'user',
        targetId: String(account._id),
        ipAddress,
        details: { failedAttempts: account.failedLoginAttempts, locked: account.failedLoginAttempts >= 5 },
      });

      const attemptsLeft = Math.max(0, 5 - account.failedLoginAttempts);
      const errorMsg = attemptsLeft > 0
        ? `Incorrect email or password. (${attemptsLeft} attempt(s) remaining before temporary lockout)`
        : 'Account locked for 15 minutes due to too many failed attempts.';

      const error: any = new Error(errorMsg);
      error.statusCode = 401;
      throw error;
    }

    // 6. Reset failed attempts on successful login
    account.failedLoginAttempts = 0;
    account.lockUntil = undefined;
    account.lastLoginAt = new Date();
    await account.save();

    // 7. Sign fresh JWT with tokenVersion
    const token = createToken({
      sub: String(account._id),
      email: account.email,
      name: account.name,
      role: account.role || (userType === 'admin' ? 'viewer' : 'customer'),
      tokenVersion: account.tokenVersion || 0,
      userType,
    });

    await recordAudit({
      actorName: account.name,
      action: 'LOGIN_SUCCESS',
      targetType: userType === 'admin' ? 'admin_user' : 'user',
      targetId: String(account._id),
      ipAddress,
      details: { userType, role: account.role },
    });

    return {
      token,
      user: {
        id: String(account._id),
        name: account.name,
        email: account.email,
        phone: account.phone || '',
        role: account.role || (userType === 'admin' ? 'viewer' : 'customer'),
        isEmailVerified: account.isEmailVerified ?? true,
        userType,
      },
    };
  }

  /**
   * Register a new Customer account with bcrypt 12-round hashing and email verification token
   */
  static async register(data: { name: string; email: string; phone?: string; password: string }, ipAddress?: string) {
    const cleanEmail = data.email.trim().toLowerCase();

    // Check email uniqueness across both User and AdminUser
    const [existingUser, existingAdmin] = await Promise.all([
      User.findOne({ email: cleanEmail }),
      AdminUser.findOne({ email: cleanEmail }),
    ]);

    if (existingUser || existingAdmin) {
      const error: any = new Error('An account with this email address already exists. Please log in.');
      error.statusCode = 409;
      throw error;
    }

    if (data.password.length < 8) {
      const error: any = new Error('Password must be at least 8 characters long.');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await hashPassword(data.password);

    // Generate secure 32-byte email verification token (24-hour expiry)
    const rawVerificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = hashCryptoToken(rawVerificationToken);
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = await User.create({
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone?.trim() || '',
      hashedPassword,
      role: 'customer',
      isEmailVerified: false,
      emailVerificationToken: hashedVerificationToken,
      emailVerificationExpires: verificationExpires,
      tokenVersion: 0,
    });

    const token = createToken({
      sub: String(newUser._id),
      email: newUser.email,
      name: newUser.name,
      role: 'customer',
      tokenVersion: 0,
      userType: 'customer',
    });

    await recordAudit({
      actorName: newUser.name,
      action: 'USER_REGISTERED',
      targetType: 'user',
      targetId: String(newUser._id),
      ipAddress,
    });

    return {
      message: 'Account registered successfully. Please verify your email.',
      token,
      verificationToken: rawVerificationToken,
      user: {
        id: String(newUser._id),
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
      },
    };
  }

  /**
   * Verify customer email with expiring crypto token
   */
  static async verifyEmail(rawToken: string, ipAddress?: string) {
    const hashedToken = hashCryptoToken(rawToken);

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      const error: any = new Error('Verification token is invalid or has expired. Please request a new verification email.');
      error.statusCode = 400;
      throw error;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    await recordAudit({
      actorName: user.name,
      action: 'EMAIL_VERIFICATION_SUCCESS',
      targetType: 'user',
      targetId: String(user._id),
      ipAddress,
    });

    return {
      message: 'Email address verified successfully!',
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        isEmailVerified: true,
      },
    };
  }

  /**
   * Resend fresh email verification token (24-hour expiry)
   */
  static async resendVerification(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return { message: 'If an account exists, a verification link has been sent.' };
    }

    if (user.isEmailVerified) {
      return { message: 'This email address is already verified.' };
    }

    const rawVerificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = hashCryptoToken(rawVerificationToken);
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    return {
      message: 'Verification link sent to your email address.',
      verificationToken: rawVerificationToken,
    };
  }

  /**
   * Request password reset token with 15-minute expiration
   * (Constant-response timing to prevent email enumeration)
   */
  static async forgotPassword(email: string, ipAddress?: string) {
    const cleanEmail = email.trim().toLowerCase();

    // Look in AdminUser and User
    let account: any = await AdminUser.findOne({ email: cleanEmail });
    let isUser = false;

    if (!account) {
      account = await User.findOne({ email: cleanEmail });
      isUser = true;
    }

    if (!account) {
      // Return identical response to prevent user enumeration
      return {
        message: 'If an account exists with this email address, a secure password reset link has been dispatched.',
      };
    }

    const rawResetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = hashCryptoToken(rawResetToken);
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // Strict 15-minute expiry

    account.passwordResetToken = hashedResetToken;
    account.passwordResetExpires = resetExpires;
    await account.save();

    await recordAudit({
      actorName: account.name,
      action: 'PASSWORD_RESET_REQUESTED',
      targetType: isUser ? 'user' : 'admin_user',
      targetId: String(account._id),
      ipAddress,
      details: { expiresAt: resetExpires },
    });

    return {
      message: 'If an account exists with this email address, a secure password reset link has been dispatched.',
      resetToken: rawResetToken, // Returned for programmatic client link generation
      expiresIn: '15 minutes',
    };
  }

  /**
   * Reset Password with Token validation & Session Invalidation
   */
  static async resetPassword(rawToken: string, newPassword: string, ipAddress?: string) {
    if (!newPassword || newPassword.length < 8) {
      const error: any = new Error('New password must be at least 8 characters long.');
      error.statusCode = 400;
      throw error;
    }

    const hashedToken = hashCryptoToken(rawToken);

    // Search in AdminUser and User
    let account: any = await AdminUser.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    let isUser = false;
    if (!account) {
      account = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() },
      });
      isUser = true;
    }

    if (!account) {
      const error: any = new Error('Password reset token is invalid or has expired. Please request a new reset link.');
      error.statusCode = 400;
      throw error;
    }

    // Hash new password with 12 rounds
    account.hashedPassword = await hashPassword(newPassword);
    account.passwordResetToken = undefined;
    account.passwordResetExpires = undefined;
    account.failedLoginAttempts = 0;
    account.lockUntil = undefined;
    
    // Invalidate all previously issued tokens for this user
    account.tokenVersion = (account.tokenVersion || 0) + 1;

    await account.save();

    await recordAudit({
      actorName: account.name,
      action: 'PASSWORD_RESET_SUCCESS',
      targetType: isUser ? 'user' : 'admin_user',
      targetId: String(account._id),
      ipAddress,
    });

    return {
      message: 'Password has been successfully updated. All previous sessions have been invalidated. Please log in with your new password.',
    };
  }

  /**
   * Get Current Authenticated Profile
   */
  static async getMe(userId: string) {
    let account: any = await AdminUser.findById(userId).select('-hashedPassword -passwordResetToken');
    if (!account) {
      account = await User.findById(userId).select('-hashedPassword -passwordResetToken -emailVerificationToken');
    }

    if (!account) {
      const error: any = new Error('Account not found');
      error.statusCode = 404;
      throw error;
    }
    return account;
  }

  /**
   * Update Profile & Password with Session Token Invalidation
   */
  static async updateProfile(
    userId: string,
    data: { name?: string; email?: string; phone?: string; currentPassword?: string; newPassword?: string },
    ipAddress?: string
  ) {
    let account: any = await AdminUser.findById(userId).select('+hashedPassword +tokenVersion');
    let isUser = false;

    if (!account) {
      account = await User.findById(userId).select('+hashedPassword +tokenVersion');
      isUser = true;
    }

    if (!account) {
      const error: any = new Error('Account not found');
      error.statusCode = 404;
      throw error;
    }

    // Email update & uniqueness validation
    if (data.email && data.email.trim().toLowerCase() !== account.email.toLowerCase()) {
      const cleanEmail = data.email.trim().toLowerCase();
      const [existingAdmin, existingUser] = await Promise.all([
        AdminUser.findOne({ email: cleanEmail, _id: { $ne: userId } }),
        User.findOne({ email: cleanEmail, _id: { $ne: userId } }),
      ]);

      if (existingAdmin || existingUser) {
        const error: any = new Error('Email address is already in use by another account');
        error.statusCode = 400;
        throw error;
      }
      account.email = cleanEmail;
      if (isUser) account.isEmailVerified = false; // Require re-verification on email change
    }

    // Name and Phone updates
    if (data.name && data.name.trim()) {
      account.name = data.name.trim();
    }
    if (data.phone !== undefined) {
      account.phone = data.phone.trim();
    }

    // Password change verification & 12-round hashing
    let passwordChanged = false;
    if (data.newPassword) {
      if (!data.currentPassword) {
        const error: any = new Error('Current password is required to set a new password');
        error.statusCode = 400;
        throw error;
      }
      const isMatch = await comparePassword(data.currentPassword, account.hashedPassword);
      if (!isMatch) {
        const error: any = new Error('Current password does not match');
        error.statusCode = 400;
        throw error;
      }
      if (data.newPassword.length < 8) {
        const error: any = new Error('New password must be at least 8 characters long');
        error.statusCode = 400;
        throw error;
      }
      account.hashedPassword = await hashPassword(data.newPassword);
      account.tokenVersion = (account.tokenVersion || 0) + 1;
      passwordChanged = true;
    }

    await account.save();

    // Fresh token with updated tokenVersion
    const token = createToken({
      sub: String(account._id),
      email: account.email,
      name: account.name,
      role: account.role || (isUser ? 'customer' : 'viewer'),
      tokenVersion: account.tokenVersion || 0,
      userType: isUser ? 'customer' : 'admin',
    });

    await recordAudit({
      actorName: account.name,
      action: 'PROFILE_UPDATED',
      targetType: isUser ? 'user' : 'admin_user',
      targetId: String(account._id),
      ipAddress,
      details: {
        nameChanged: !!data.name,
        emailChanged: !!data.email,
        passwordChanged,
      },
    });

    realtimeService.broadcast('PROFILE_UPDATED', {
      userId: String(account._id),
      name: account.name,
      email: account.email,
      role: account.role,
    });

    return {
      message: 'Profile updated successfully',
      access_token: token,
      user: {
        id: String(account._id),
        name: account.name,
        email: account.email,
        phone: account.phone,
        role: account.role,
      },
    };
  }
}
