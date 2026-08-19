import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { token } = await AuthService.login(email, password, req.ip);

      res.cookie('access_token', `Bearer ${token}`, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
      });

      res.json({ access_token: token, token_type: 'bearer' });
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const admin = await AuthService.getMe(req.user?.id || '');
      res.json(admin);
    } catch (err) {
      next(err);
    }
  }
}
