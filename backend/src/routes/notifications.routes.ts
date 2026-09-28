import { Router } from 'express';
import { NotificationsController } from '../controllers/notifications.controller';
import { authenticateAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateAdmin);

router.get('/', NotificationsController.listNotifications);
router.patch('/mark-all-read', NotificationsController.markAllRead);
router.patch('/:id/read', NotificationsController.markRead);

export default router;
