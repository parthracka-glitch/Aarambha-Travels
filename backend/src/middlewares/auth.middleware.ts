import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AdminUser, User, AuditLog } from '../models/shared.model';

// ─── JWT Secret — Must come from environment, never hardcoded ────────────────
// In production the app will refuse to start if SECRET_KEY is missing.
// In development a fallback is used only to ease local setup.
const _JWT_SECRET_RAW = process.env.SECRET_KEY;
if (!_JWT_SECRET_RAW && process.env.NODE_ENV === 'production') {
  throw new Error(
    '[SECURITY] SECRET_KEY environment variable is not set. ' +
    'Server refuses to start without a valid JWT secret in production.'
  );
}
const JWT_SECRET = _JWT_SECRET_RAW || 'aarambha-super-secret-key-change-in-production-2026';

const BCRYPT_SALT_ROUNDS = 12; // Enterprise-grade password hashing work factor
const TOKEN_EXPIRY = '24h';    // Strict 24-hour access token lifetime

export interface AuthRequest extends Request {
  user?: {
    id: string;
    sub?: string;
    email: string;
    role?: string;
    name?: string;
    tokenVersion?: number;
    userType?: 'admin' | 'customer';
  };
}

/**
 * Enterprise-grade Bcrypt Password Hashing (12 salt rounds)
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Constant-time safe password comparison
 */
export const comparePassword = async (plain: string, hashed: string): Promise<boolean> => {
  if (!plain || !hashed) return false;
  return bcrypt.compare(plain, hashed);
};

/**
 * Signs a JWT with user payload and expiration
 */
export const createToken = (payload: object, expiresIn: string = TOKEN_EXPIRY): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
};

/**
 * Verifies JWT signature and expiry
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

/**
 * Extracts optional auth user payload from request without throwing 401
 */
export const extractOptionalAuth = (req: Request): { id?: string; email?: string; role?: string } | undefined => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies?.access_token) {
    const cookieToken = req.cookies.access_token;
    token = cookieToken.startsWith('Bearer ') ? cookieToken.split(' ')[1] : cookieToken;
  }

  if (!token) return undefined;
  const decoded = verifyToken(token);
  return decoded ? { id: decoded.sub, email: decoded.email, role: decoded.role } : undefined;
};

/**
 * Express Middleware: Authenticate Admin with Token & Token Version Invalidation
 */
export const authenticateAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies?.access_token) {
    const cookieToken = req.cookies.access_token;
    token = cookieToken.startsWith('Bearer ') ? cookieToken.split(' ')[1] : cookieToken;
  }

  if (!token) {
    res.status(401).json({ detail: 'Authentication required. No bearer token provided.' });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.sub) {
    res.status(401).json({ detail: 'Invalid or expired session token. Please log in again.' });
    return;
  }

  try {
    const admin = await AdminUser.findById(decoded.sub).select('+tokenVersion +isActive');
    if (!admin) {
      res.status(401).json({ detail: 'Admin account not found.' });
      return;
    }

    if (!admin.isActive) {
      res.status(403).json({ detail: 'Admin account has been deactivated.' });
      return;
    }

    // Token revocation check via tokenVersion
    if (typeof decoded.tokenVersion === 'number' && decoded.tokenVersion !== admin.tokenVersion) {
      res.status(401).json({ detail: 'Session has been invalidated due to password change or logout. Please log in again.' });
      return;
    }

    req.user = {
      ...decoded,
      id: String(admin._id),
      sub: String(admin._id),
      email: admin.email,
      role: admin.role,
      name: admin.name,
      userType: 'admin',
    };
    next();
  } catch (err) {
    res.status(500).json({ detail: 'Authentication verification failed.' });
  }
};

/**
 * Express Middleware: Authenticate Customer / Web User with Token
 */
export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies?.access_token) {
    const cookieToken = req.cookies.access_token;
    token = cookieToken.startsWith('Bearer ') ? cookieToken.split(' ')[1] : cookieToken;
  }

  if (!token) {
    res.status(401).json({ detail: 'Authentication required.' });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.sub) {
    res.status(401).json({ detail: 'Invalid or expired token.' });
    return;
  }

  try {
    const user = await User.findById(decoded.sub).select('+tokenVersion');
    if (!user) {
      // Fallback: check if admin token
      const admin = await AdminUser.findById(decoded.sub);
      if (admin && admin.isActive) {
        req.user = {
          ...decoded,
          id: String(admin._id),
          sub: String(admin._id),
          email: admin.email,
          role: admin.role,
          name: admin.name,
          userType: 'admin',
        };
        return next();
      }
      res.status(401).json({ detail: 'User account not found.' });
      return;
    }

    if (typeof decoded.tokenVersion === 'number' && decoded.tokenVersion !== user.tokenVersion) {
      res.status(401).json({ detail: 'Session expired. Please log in again.' });
      return;
    }

    req.user = {
      ...decoded,
      id: String(user._id),
      sub: String(user._id),
      email: user.email,
      role: user.role,
      name: user.name,
      userType: 'customer',
    };
    next();
  } catch (err) {
    res.status(500).json({ detail: 'Authentication check failed.' });
  }
};

/**
 * Superadmin Role Guard
 */
export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'superadmin') {
    res.status(403).json({ detail: 'Forbidden: Super Admin privileges required.' });
    return;
  }
  next();
};

/**
 * Security HTTP Headers Middleware (Helmet-Grade Protection + CSP)
 */
export const securityHeadersMiddleware = (_req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), payment=(self)');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://accounts.google.com https://apis.google.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "img-src 'self' data: blob: https:; " +
    "connect-src 'self' https: http://localhost:* http://127.0.0.1:* wss: ws: https://lumberjack.razorpay.com https://api.razorpay.com; " +
    "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://accounts.google.com; " +
    "object-src 'none'; " +
    "base-uri 'self';"
  );
  next();
};

/**
 * Record Security Audit Event in Database
 */
export const recordAudit = async (opts: {
  actorName: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
}): Promise<void> => {
  try {
    await AuditLog.create({
      actorName: opts.actorName || 'System',
      action: opts.action,
      targetType: opts.targetType,
      targetId: opts.targetId,
      details: opts.details || {},
      ipAddress: opts.ipAddress,
    });
  } catch (err) {
    console.error('[Audit Log Failed]', err);
  }
};
