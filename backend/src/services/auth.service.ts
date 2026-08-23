import { AdminUser } from '../models';
import { comparePassword, hashPassword, createToken, recordAudit } from '../middlewares/auth.middleware';

export class AuthService {
  static async login(email: string, password: string, ipAddress?: string) {
    const admin = await AdminUser.findOne({ email });

    if (!admin || !(await comparePassword(password, admin.hashedPassword))) {
      const error: any = new Error('Incorrect email or password');
      error.statusCode = 401;
      throw error;
    }

    if (!admin.isActive) {
      const error: any = new Error('Account disabled');
      error.statusCode = 403;
      throw error;
    }

    const token = createToken({ sub: admin._id, email: admin.email, name: admin.name, role: admin.role });

    await recordAudit({
      actorName: admin.name,
      action: 'LOGIN_SUCCESS',
      targetType: 'admin_user',
      targetId: String(admin._id),
      ipAddress,
    });

    return { token, admin };
  }

  static async getMe(adminId: string) {
    const admin = await AdminUser.findById(adminId).select('-hashedPassword');
    if (!admin) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return admin;
  }

  static async updateProfile(
    adminId: string,
    data: { name?: string; email?: string; currentPassword?: string; newPassword?: string },
    ipAddress?: string
  ) {
    const admin = await AdminUser.findById(adminId);
    if (!admin) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Email update & uniqueness validation
    if (data.email && data.email.trim().toLowerCase() !== admin.email.toLowerCase()) {
      const cleanEmail = data.email.trim().toLowerCase();
      const existing = await AdminUser.findOne({ email: cleanEmail, _id: { $ne: adminId } });
      if (existing) {
        const error: any = new Error('Email address is already in use by another account');
        error.statusCode = 400;
        throw error;
      }
      admin.email = cleanEmail;
    }

    // Display Name update
    if (data.name && data.name.trim()) {
      admin.name = data.name.trim();
    }

    // Password change verification & hashing
    if (data.newPassword) {
      if (!data.currentPassword) {
        const error: any = new Error('Current password is required to set a new password');
        error.statusCode = 400;
        throw error;
      }
      const isMatch = await comparePassword(data.currentPassword, admin.hashedPassword);
      if (!isMatch) {
        const error: any = new Error('Current password does not match');
        error.statusCode = 400;
        throw error;
      }
      if (data.newPassword.length < 6) {
        const error: any = new Error('New password must be at least 6 characters long');
        error.statusCode = 400;
        throw error;
      }
      admin.hashedPassword = await hashPassword(data.newPassword);
    }

    await admin.save();

    // Generate fresh JWT token with updated profile information
    const token = createToken({ sub: admin._id, email: admin.email, name: admin.name, role: admin.role });

    await recordAudit({
      actorName: admin.name,
      action: 'PROFILE_UPDATED',
      targetType: 'admin_user',
      targetId: String(admin._id),
      ipAddress,
      details: {
        nameChanged: !!data.name,
        emailChanged: !!data.email,
        passwordChanged: !!data.newPassword,
      },
    });

    return {
      message: 'Profile updated successfully',
      access_token: token,
      user: {
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  }
}
