import { Router } from 'express';
import { FinanceController } from '../controllers/finance.controller';
import { authenticateAdmin, requireSuperAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Public promo code validation during customer checkout
router.post('/promo-codes/validate', FinanceController.validatePromoCode);

// Protected Admin routes
router.use(authenticateAdmin);

router.post('/promo-codes', requireSuperAdmin, FinanceController.createPromoCode);
router.get('/promo-codes', FinanceController.listPromoCodes);

export default router;
