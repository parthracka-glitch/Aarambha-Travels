import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';

const router = Router();

router.get('/key', PaymentController.getRazorpayKey);
router.post('/create-order', PaymentController.createOrder);
router.post('/verify', PaymentController.verifyPayment);
router.get('/booking/:code', PaymentController.getBookingDetails);

export default router;
