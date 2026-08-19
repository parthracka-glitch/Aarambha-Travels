import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { authenticateAdmin, requireSuperAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateAdmin);

router.get('/', SettingsController.getSettings);
router.post('/', requireSuperAdmin, SettingsController.updateSettings);

export default router;
