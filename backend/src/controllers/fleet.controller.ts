import { Request, Response, NextFunction } from 'express';
import { FleetService } from '../services/fleet.service';

export class FleetController {
  // Categories
  static async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cat = await FleetService.createCategory(req.body);
      res.status(201).json(cat);
    } catch (err) {
      next(err);
    }
  }

  static async listCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await FleetService.listCategories();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  // Vehicles
  static async createVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const veh = await FleetService.createVehicle(req.body);
      res.status(201).json(veh);
    } catch (err) {
      next(err);
    }
  }

  static async listVehicles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await FleetService.listVehicles();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  static async getVehicleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const veh = await FleetService.getVehicleById(req.params.id);
      res.json(veh);
    } catch (err) {
      next(err);
    }
  }

  static async updateVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const veh = await FleetService.updateVehicle(req.params.id, req.body);
      res.json(veh);
    } catch (err) {
      next(err);
    }
  }

  static async deleteVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await FleetService.deleteVehicle(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  // Inquiries
  static async createInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inquiry = await FleetService.createInquiry(req.body);
      res.status(201).json(inquiry);
    } catch (err) {
      next(err);
    }
  }

  static async listInquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await FleetService.listInquiries();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  // Bookings
  static async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isTermsAccepted = req.body.termsAccepted === true || req.body.terms_accepted === true || req.body.agreementAccepted === true;
      if (!isTermsAccepted) {
        res.status(400).json({
          error: 'Please accept the terms & conditions to proceed with booking.',
          message: 'Terms & Conditions acceptance is mandatory for booking.',
          code: 'TERMS_NOT_ACCEPTED',
        });
        return;
      }
      const booking = await FleetService.createBooking(req.body, req.ip);
      res.status(201).json(booking);
    } catch (err) {
      next(err);
    }
  }

  static async listBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await FleetService.listBookings();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  static async markPickedUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { pickup_payment_method, pickupPaymentMethod } = req.body;
      const method = pickup_payment_method || pickupPaymentMethod;
      const booking = await FleetService.markPickedUp(req.params.id, method, req.ip);
      res.json(booking);
    } catch (err) {
      next(err);
    }
  }

  static async markReturned(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const booking = await FleetService.markReturned(req.params.id);
      res.json(booking);
    } catch (err) {
      next(err);
    }
  }

  static async refundDeposit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const booking = await FleetService.refundDeposit(req.params.id, req.ip);
      res.json(booking);
    } catch (err) {
      next(err);
    }
  }

  static async verifyBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, rejectionReason, rejection_reason } = req.body;
      const adminName = (req as any).adminUser?.name || 'Admin';
      const reason = rejectionReason || rejection_reason;
      const booking = await FleetService.verifyBooking(
        req.params.id,
        status || 'Confirmed',
        reason,
        adminName,
        req.ip
      );
      res.json(booking);
    } catch (err) {
      next(err);
    }
  }

  static async deleteBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await FleetService.deleteBooking(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async deleteInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await FleetService.deleteInquiry(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
