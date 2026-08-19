import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../services/audit.service';

export class AuditController {
  static async listAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await AuditService.listAuditLogs(limit);
      res.json(logs);
    } catch (err) {
      next(err);
    }
  }
}
