import { Response } from 'express';

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200, message?: string): Response => {
  if (message) {
    return res.status(statusCode).json({ success: true, message, data });
  }
  return res.status(statusCode).json(data);
};

export const sendError = (res: Response, message: string, statusCode = 400, details?: any): Response => {
  return res.status(statusCode).json({ detail: message, ...(details ? { details } : {}) });
};
