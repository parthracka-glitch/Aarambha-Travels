import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';

export class PaymentController {
  static getRazorpayKey(req: Request, res: Response): void {
    res.json(PaymentService.getRazorpayKey());
  }

  static async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { service_type, reference_id } = req.body;
      const order = await PaymentService.createOrder(service_type, reference_id);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  }

  static async verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const booking = await PaymentService.verifyPaymentAndCreateBooking(req.body, req.ip);
      res.status(201).json(booking);
    } catch (err) {
      next(err);
    }
  }
}
