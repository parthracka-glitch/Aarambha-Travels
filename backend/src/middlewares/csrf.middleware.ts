import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const CSRF_SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

/**
 * Generate cryptographically secure CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate if an origin is a trusted Aarambha origin
 */
function isTrustedOrigin(origin?: string): boolean {
  if (!origin) return true;
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) return true;
  if (origin.includes('aarambhatravels.in')) return true;
  if (origin.includes('vercel.app')) return true;
  const envOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim());
  if (envOrigins.includes(origin) || envOrigins.includes('*')) return true;
  return false;
}

/**
 * CSRF Protection Middleware
 * - Exempts safe read-only methods (GET, HEAD, OPTIONS)
 * - Exempts authentication & public webhook endpoints
 * - Validates trusted origins and Sec-Fetch-Site for browser state-modifying requests
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction): void => {
  if (CSRF_SAFE_METHODS.includes(req.method)) {
    return next();
  }

  const path = req.path || req.originalUrl;
  
  // Exempt health, auth login/register/refresh, webhooks, and realtime stream
  if (
    path.startsWith('/api/health') ||
    path.startsWith('/api/auth/login') ||
    path.startsWith('/api/auth/register') ||
    path.startsWith('/api/auth/refresh') ||
    path.startsWith('/api/v1/auth/login') ||
    path.startsWith('/api/v1/auth/register') ||
    path.startsWith('/api/payments/webhook') ||
    path.startsWith('/api/realtime')
  ) {
    return next();
  }

  const origin = req.get('Origin') || req.get('Referer');
  const customHeader = req.get('X-Requested-With') || req.get('X-CSRF-Token') || req.get('Authorization');
  const secFetchSite = req.get('Sec-Fetch-Site');

  // If request comes from a trusted origin (localhost, crm, website, aarambhatravels domain), allow
  if (isTrustedOrigin(origin)) {
    return next();
  }

  // Block untrusted cross-site forged state-modifying requests that lack explicit auth/headers
  if (secFetchSite === 'cross-site' && !customHeader) {
    res.status(403).json({
      detail: 'Cross-Site Request Forgery detected. Request blocked.',
      code: 'CSRF_BLOCKED',
    });
    return;
  }

  next();
};
