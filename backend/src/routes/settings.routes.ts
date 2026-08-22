import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { authenticateAdmin, requireSuperAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Public settings route (Website)
router.get('/public', SettingsController.getPublicSettings);

// Protected Admin routes
router.use(authenticateAdmin);

router.get('/', SettingsController.getSettings);
router.post('/', requireSuperAdmin, SettingsController.updateSettings);

export default router;
