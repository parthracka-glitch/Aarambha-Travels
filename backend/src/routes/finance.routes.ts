import { Router } from 'express';
import { FinanceController } from '../controllers/finance.controller';
import { authenticateAdmin, requireSuperAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateAdmin);

router.post('/promo-codes', requireSuperAdmin, FinanceController.createPromoCode);
router.get('/promo-codes', FinanceController.listPromoCodes);
router.post('/promo-codes/validate', FinanceController.validatePromoCode);

export default router;
