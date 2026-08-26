import { Request, Response, NextFunction } from 'express';
import { recordAudit } from './auth.middleware';

interface RateLimitStore {
  count: number;
  resetTime: number;
  firstRequestTime: number;
}

interface RateLimitOptions {
  windowMs: number;       // Time window in milliseconds
  maxRequests: number;    // Maximum allowed requests in window
  message?: string;       // Custom error message
  keyGenerator?: (req: Request) => string;
  auditAction?: string;   // Optional audit action to record when rate limited
}

/**
 * High-performance sliding-window in-memory rate limiter with automated memory cleanup
 */
export function createRateLimiter(options: RateLimitOptions) {
  const store = new Map<string, RateLimitStore>();
  const windowMs = options.windowMs;
  const maxRequests = options.maxRequests;
  const message = options.message || 'Too many requests. Please try again later.';

  // Automated garbage collection every 5 minutes to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref();

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const now = Date.now();
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    
    // Generate unique key (IP + optional identifier like email from body)
    let key: string;
    if (options.keyGenerator) {
      key = options.keyGenerator(req);
    } else {
      const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
      key = email ? `${clientIp}:${email}` : clientIp;
    }

    let record = store.get(key);

    if (!record || now > record.resetTime) {
      // New window
      record = {
        count: 1,
        resetTime: now + windowMs,
        firstRequestTime: now,
      };
      store.set(key, record);
    } else {
      // Existing window
      record.count += 1;
    }

    const remaining = Math.max(0, maxRequests - record.count);
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);

    // Standard RateLimit headers
    res.setHeader('RateLimit-Limit', maxRequests);
    res.setHeader('RateLimit-Remaining', remaining);
    res.setHeader('RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > maxRequests) {
      res.setHeader('Retry-After', retryAfterSec);

      // Record security audit log on brute force attempts
      if (options.auditAction) {
        await recordAudit({
          actorName: req.body?.email || 'Unknown Client',
          action: options.auditAction,
          targetType: 'security_rate_limit',
          targetId: key,
          ipAddress: clientIp,
          details: {
            requestCount: record.count,
            limit: maxRequests,
            windowMs,
            path: req.originalUrl,
          },
        });
      }

      res.status(429).json({
        statusCode: 429,
        error: 'Too Many Requests',
        message,
        retryAfter: `${retryAfterSec} seconds`,
      });
      return;
    }

    next();
  };
}

/**
 * Strict authentication rate limiter:
 * Max 5 failed/total login attempts per 15 minutes per IP & Email
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Too many login attempts from this device or account. For security, please wait 15 minutes before trying again.',
  auditAction: 'LOGIN_RATE_LIMITED_BRUTE_FORCE_PREVENTED',
});

/**
 * Password Reset rate limiter:
 * Max 3 password reset requests per 15 minutes
 */
export const passwordResetRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 3,
  message: 'Too many password reset requests. Please wait 15 minutes before requesting another reset link.',
  auditAction: 'PASSWORD_RESET_RATE_LIMITED',
});

/**
 * Email Verification rate limiter:
 * Max 5 verification attempts per 15 minutes
 */
export const emailVerificationRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  message: 'Too many email verification attempts. Please wait 15 minutes before trying again.',
});

/**
 * General Public API rate limiter:
 * Max 120 requests per minute
 */
export const generalApiLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 120,
  keyGenerator: (req) => req.ip || 'unknown',
  message: 'Rate limit exceeded. Please slow down your requests.',
});
