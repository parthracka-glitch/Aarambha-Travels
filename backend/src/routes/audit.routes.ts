import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller';
import { authenticateAdmin, requireSuperAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateAdmin);
router.get('/audit-logs', requireSuperAdmin, AuditController.listAuditLogs);

export default router;
