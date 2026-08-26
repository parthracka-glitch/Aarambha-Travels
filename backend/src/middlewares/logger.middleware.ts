import { Request, Response, NextFunction } from 'express';
import { recordAudit } from './auth.middleware';

// ─────────────────────────────────────────────────────────────────────────────
// Structured JSON Request Logger
// Logs method, path, status, response time, IP, and user agent for every request
// ─────────────────────────────────────────────────────────────────────────────

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const clientIp = (req.ip || req.socket?.remoteAddress || 'unknown').replace('::ffff:', '');
  const userAgent = req.get('User-Agent') || 'unknown';
  const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // Attach request ID for tracing
  (req as any).requestId = requestId;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const logLevel = status >= 500 ? 'ERROR' : status >= 400 ? 'WARN' : 'INFO';

    const logEntry = {
      level: logLevel,
      timestamp: new Date().toISOString(),
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: status,
      durationMs: duration,
      ip: clientIp,
      userAgent: userAgent.substring(0, 150), // Truncate long UAs
      contentLength: res.get('Content-Length') || 0,
    };

    if (logLevel === 'ERROR') {
      console.error('[REQ]', JSON.stringify(logEntry));
    } else if (logLevel === 'WARN') {
      console.warn('[REQ]', JSON.stringify(logEntry));
    } else {
      console.log('[REQ]', JSON.stringify(logEntry));
    }

    // Log slow requests (>2s) as warnings
    if (duration > 2000) {
      console.warn('[SLOW_REQUEST]', JSON.stringify({ ...logEntry, warning: 'Response time exceeded 2000ms' }));
    }
  });

  next();
};

// ─────────────────────────────────────────────────────────────────────────────
// Authentication Attempt Logger
// Records login success/failure events with structured metadata
// ─────────────────────────────────────────────────────────────────────────────

export const logAuthAttempt = async (opts: {
  email: string;
  success: boolean;
  reason?: string;
  ip: string;
  userAgent?: string;
  userType?: 'admin' | 'customer';
}): Promise<void> => {
  const action = opts.success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED';
  const logEntry = {
    level: opts.success ? 'INFO' : 'WARN',
    timestamp: new Date().toISOString(),
    event: action,
    email: opts.email,
    userType: opts.userType || 'unknown',
    ip: opts.ip,
    userAgent: opts.userAgent?.substring(0, 150),
    reason: opts.reason,
  };

  if (opts.success) {
    console.log('[AUTH]', JSON.stringify(logEntry));
  } else {
    console.warn('[AUTH]', JSON.stringify(logEntry));
  }

  // Persist to audit log in DB
  await recordAudit({
    actorName: opts.email,
    action,
    targetType: 'auth_session',
    ipAddress: opts.ip,
    details: { userType: opts.userType, reason: opts.reason },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// API Error Structured Logger
// Captures 4xx/5xx with sanitized context — never exposes stack in production
// ─────────────────────────────────────────────────────────────────────────────

export const logApiError = async (err: any, req: Request): Promise<void> => {
  const clientIp = (req.ip || req.socket?.remoteAddress || 'unknown').replace('::ffff:', '');
  const isProd = process.env.NODE_ENV === 'production';
  const statusCode = err.status || err.statusCode || 500;

  const logEntry: Record<string, any> = {
    level: statusCode >= 500 ? 'ERROR' : 'WARN',
    timestamp: new Date().toISOString(),
    requestId: (req as any).requestId,
    event: 'API_ERROR',
    method: req.method,
    path: req.originalUrl,
    statusCode,
    ip: clientIp,
    message: err.message || 'Unknown error',
    // Stack trace only in non-production for developer debugging
    ...(isProd ? {} : { stack: err.stack }),
  };

  if (statusCode >= 500) {
    console.error('[API_ERROR]', JSON.stringify(logEntry));

    // Persist 500-level errors to audit log
    await recordAudit({
      actorName: (req as any).user?.email || 'Anonymous',
      action: 'SERVER_ERROR_500',
      targetType: 'api_endpoint',
      targetId: req.originalUrl,
      ipAddress: clientIp,
      details: { method: req.method, statusCode, message: err.message },
    });
  } else {
    console.warn('[API_ERROR]', JSON.stringify(logEntry));
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Suspicious Traffic Detector
// Flags path traversal, SQL injection probes, scanner bots, and oversized payloads
// ─────────────────────────────────────────────────────────────────────────────

// Common attack probe patterns
const SUSPICIOUS_PATTERNS = [
  /\.\.\//,                          // Path traversal
  /\.\.\\/,                          // Windows path traversal
  /<script\b/i,                      // XSS probe in URL
  /union\s+select/i,                 // SQL injection probe
  /exec\s*\(/i,                      // Command injection probe
  /\/etc\/passwd/i,                  // LFI probe
  /\/wp-admin/i,                     // WordPress scanner
  /\.php(\?|$)/i,                    // PHP scanner on non-PHP app
  /\/\.env(\?|$)/,                   // .env file exposure attempt
  /\/actuator/i,                     // Spring Boot scanner
  /\/config\.json/i,                 // Config file exposure
  /eval\s*\(/i,                      // JS injection probe
];

// Suspicious user agents (known bot/scanner signatures)
const SCANNER_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /masscan/i,
  /nmap/i,
  /zgrab/i,
  /dirbuster/i,
  /gobuster/i,
  /wfuzz/i,
  /burpsuite/i,
  /hydra/i,
];

export const suspiciousTrafficDetector = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const clientIp = (req.ip || req.socket?.remoteAddress || 'unknown').replace('::ffff:', '');
  const userAgent = req.get('User-Agent') || '';
  const path = req.originalUrl;
  const suspicionReasons: string[] = [];

  // Check for suspicious URL patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(path)) {
      suspicionReasons.push(`Suspicious URL pattern: ${pattern.toString()}`);
      break;
    }
  }

  // Check for scanner user agents
  for (const uaPattern of SCANNER_USER_AGENTS) {
    if (uaPattern.test(userAgent)) {
      suspicionReasons.push(`Known scanner user-agent: ${userAgent.substring(0, 80)}`);
      break;
    }
  }

  // Flag unusually large Content-Length headers (beyond our 15mb app limit)
  const contentLength = parseInt(req.get('Content-Length') || '0', 10);
  if (contentLength > 15 * 1024 * 1024) {
    suspicionReasons.push(`Oversized payload: ${contentLength} bytes`);
  }

  // Flag missing or suspicious HTTP methods
  const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];
  if (!allowedMethods.includes(req.method)) {
    suspicionReasons.push(`Unusual HTTP method: ${req.method}`);
  }

  if (suspicionReasons.length > 0) {
    const logEntry = {
      level: 'WARN',
      timestamp: new Date().toISOString(),
      event: 'SUSPICIOUS_TRAFFIC_DETECTED',
      ip: clientIp,
      method: req.method,
      path,
      userAgent: userAgent.substring(0, 150),
      reasons: suspicionReasons,
    };
    console.warn('[SECURITY]', JSON.stringify(logEntry));

    // Persist to audit log for known scanner probes
    await recordAudit({
      actorName: 'Unknown (Suspicious)',
      action: 'SUSPICIOUS_TRAFFIC_DETECTED',
      targetType: 'api_endpoint',
      targetId: path,
      ipAddress: clientIp,
      details: { reasons: suspicionReasons, method: req.method, userAgent: userAgent.substring(0, 150) },
    });

    // Block scanner bots outright
    const isKnownScanner = suspicionReasons.some(r => r.includes('scanner user-agent'));
    if (isKnownScanner) {
      res.status(403).json({ detail: 'Forbidden' });
      return;
    }
  }

  next();
};
