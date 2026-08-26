import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
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
  }
}
