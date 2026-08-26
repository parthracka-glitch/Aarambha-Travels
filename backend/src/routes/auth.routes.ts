import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateUser } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  authRateLimiter,
  registrationRateLimiter,
  passwordResetRateLimiter,
  emailVerificationRateLimiter,
} from '../middlewares/rateLimit.middleware';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  updateProfileSchema,
} from '../validators/auth.validator';

const router = Router();

// Authentication Endpoints with Brute-Force Rate Limiting
router.post('/login', authRateLimiter, validateRequest(loginSchema), AuthController.login);
// Registration uses BOTH per-IP registration limiter AND general auth limiter
router.post('/register', registrationRateLimiter, authRateLimiter, validateRequest(registerSchema), AuthController.register);

// Email Verification Endpoints
router.post('/verify-email', emailVerificationRateLimiter, validateRequest(verifyEmailSchema), AuthController.verifyEmail);
router.post('/resend-verification', emailVerificationRateLimiter, validateRequest(forgotPasswordSchema), AuthController.resendVerification);

// Password Reset Endpoints
router.post('/forgot-password', passwordResetRateLimiter, validateRequest(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', passwordResetRateLimiter, validateRequest(resetPasswordSchema), AuthController.resetPassword);

// Authenticated Profile Endpoints
router.get('/me', authenticateUser, AuthController.getMe);
router.put('/profile', authenticateUser, validateRequest(updateProfileSchema), AuthController.updateProfile);

export default router;
