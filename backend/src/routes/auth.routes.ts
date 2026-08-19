import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateAdmin } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { loginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/login', validateRequest(loginSchema), AuthController.login);
router.get('/me', authenticateAdmin, AuthController.getMe);

export default router;
