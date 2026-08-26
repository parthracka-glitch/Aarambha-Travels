import { Request, Response, NextFunction } from 'express';
import { logApiError } from './logger.middleware';

export const errorHandler = async (err: any, req: Request, res: Response, _next: NextFunction): Promise<void> => {
  // Structured error logging — no raw stacks in production
  await logApiError(err, req);

  const status = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  // In production, never expose internal error details or stack traces
  const message = isProd && status >= 500
    ? 'An internal server error occurred. Please try again later.'
    : err.message || 'Internal Server Error';

  res.status(status).json({ detail: message });
};
