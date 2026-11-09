import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';

export class PaymentController {
  static getRazorpayKey(req: Request, res: Response): void {
    const serviceType = (req.query.service_type as string) || 'tours';
    res.json(PaymentService.getRazorpayKey(serviceType));
  }

  static async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await PaymentService.createOrder(req.body);
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

  static async getBookingDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const details = await PaymentService.getBookingDetailsByCode(req.params.code);
      res.json(details);
    } catch (err) {
      next(err);
    }
  }
}
