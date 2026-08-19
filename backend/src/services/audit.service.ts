import { AuditLog } from '../models';

export class AuditService {
  static async listAuditLogs(limitCount = 50) {
    return AuditLog.find().sort({ createdAt: -1 }).limit(limitCount);
  }
}
