import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AuthController {
  /**
   * User & Admin Login
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password, req.ip);

      // Secure HTTP-Only Cookie with SameSite protection
      res.cookie('access_token', `Bearer ${token}`, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      res.json({
        access_token: token,
        token_type: 'bearer',
        expires_in: '24h',
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Customer User Registration
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body, req.ip);

      res.cookie('access_token', `Bearer ${result.token}`, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Email Verification
   */
  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      const result = await AuthService.verifyEmail(token, req.ip);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Resend Email Verification
   */
  static async resendVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const result = await AuthService.resendVerification(email);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Forgot Password - Request Reset Link
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email, req.ip);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Reset Password with Expiring Token
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password } = req.body;
      const result = await AuthService.resetPassword(token, password, req.ip);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get Current Authenticated Profile
   */
  static async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id || req.user?.sub || '';
      const profile = await AuthService.getMe(userId);
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update Profile & Password
   */
  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id || req.user?.sub || '';
      const result = await AuthService.updateProfile(userId, req.body, req.ip);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
