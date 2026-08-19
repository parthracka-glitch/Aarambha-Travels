import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuditLog } from '../models/shared.model';

const JWT_SECRET = process.env.SECRET_KEY || 'aarambha-super-secret-key-change-in-production-2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
    sub?: string;
    name?: string;
  };
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};

export const createToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ detail: 'Not authenticated' });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ detail: 'Invalid or expired token' });
    return;
  }

  req.user = { ...decoded, id: decoded.sub };
  next();
};

export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'superadmin') {
    res.status(403).json({ detail: 'Forbidden: superadmin access required' });
    return;
  }
  next();
};

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
