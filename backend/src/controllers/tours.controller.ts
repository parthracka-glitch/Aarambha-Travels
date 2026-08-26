import { Request, Response, NextFunction } from 'express';
import { ToursService } from '../services/tours.service';
import { extractOptionalAuth } from '../middlewares/auth.middleware';

export class ToursController {
  // Destinations
  static async createDestination(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dest = await ToursService.createDestination(req.body);
      res.status(201).json(dest);
    } catch (err) {
      next(err);
    }
  }

  static async listDestinations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await ToursService.listDestinations();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  // Packages
  static async createPackage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pkg = await ToursService.createPackage(req.body);
      res.status(201).json(pkg);
    } catch (err) {
      next(err);
    }
  }

  static async listPackages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await ToursService.listPackages();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  static async getPackageBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pkg = await ToursService.getPackageBySlugOrId(req.params.slug);
      res.json(pkg);
    } catch (err) {
      next(err);
    }
  }

  static async updatePackage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pkg = await ToursService.updatePackage(req.params.id, req.body);
      res.json(pkg);
    } catch (err) {
      next(err);
    }
  }

  static async deletePackage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ToursService.deletePackage(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  // Inquiries
  static async createInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inquiry = await ToursService.createInquiry(req.body);
      res.status(201).json(inquiry);
    } catch (err) {
      next(err);
    }
  }

  static async listInquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await ToursService.listInquiries();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  static async updateInquiryStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetStatus = req.body.new_status || req.body.status;
      const result = await ToursService.updateInquiryStatus(req.params.id, targetStatus);
      res.json(result);
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
      const booking = await ToursService.createBooking(req.body, req.ip);
      res.status(201).json(booking);
    } catch (err) {
      next(err);
    }
  }

  static async syncBookingStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { codes, email } = req.body;
      const authUser = (req as any).user || extractOptionalAuth(req);
      const list = await ToursService.syncBookingStatus(codes, email, authUser);
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  static async listBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await ToursService.listBookings();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  static async verifyBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, rejectionReason, rejection_reason } = req.body;
      const adminName = (req as any).adminUser?.name || 'Admin';
      const reason = rejectionReason || rejection_reason;
      const booking = await ToursService.verifyBooking(
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
      const result = await ToursService.deleteBooking(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async deleteInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await ToursService.deleteInquiry(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
