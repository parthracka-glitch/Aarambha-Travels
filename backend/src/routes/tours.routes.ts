import { Router } from 'express';
import { ToursController } from '../controllers/tours.controller';
import { authenticateAdmin, requireSuperAdmin } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  bookingCreationLimiter,
  inquiryCreationLimiter,
  syncStatusLimiter,
} from '../middlewares/rateLimit.middleware';
import {
  createTourInquirySchema,
  createDestinationSchema,
  createPackageSchema,
  updatePackageSchema,
} from '../validators/tours.validator';
import {
  createTourBookingSchema,
  syncStatusSchema,
} from '../validators/booking.validator';

const router = Router();

// Public routes (Website & Customer booking)
router.get('/destinations', ToursController.listDestinations);
router.get('/packages', ToursController.listPackages);
router.get('/packages/:slug', ToursController.getPackageBySlug);
router.post('/inquiries', inquiryCreationLimiter, validateRequest(createTourInquirySchema), ToursController.createInquiry);
router.post('/bookings', bookingCreationLimiter, validateRequest(createTourBookingSchema), ToursController.createBooking);
router.post('/bookings/sync-status', syncStatusLimiter, validateRequest(syncStatusSchema), ToursController.syncBookingStatus);

// Protected Admin routes
router.use(authenticateAdmin);

// Admin Package & Destination Management (SuperAdmin only)
router.post('/destinations', requireSuperAdmin, validateRequest(createDestinationSchema), ToursController.createDestination);
router.post('/packages', requireSuperAdmin, validateRequest(createPackageSchema), ToursController.createPackage);
router.put('/packages/:id', requireSuperAdmin, validateRequest(updatePackageSchema), ToursController.updatePackage);
router.delete('/packages/:id', requireSuperAdmin, ToursController.deletePackage);
router.get('/inquiries', ToursController.listInquiries);
router.put('/inquiries/:id/status', requireSuperAdmin, ToursController.updateInquiryStatus);
router.delete('/inquiries/:id', requireSuperAdmin, ToursController.deleteInquiry);

// Admin Bookings — GET open to viewer; write status actions superadmin only
router.get('/bookings', ToursController.listBookings);
router.put('/bookings/:id/verify', requireSuperAdmin, ToursController.verifyBooking);
router.delete('/bookings/:id', requireSuperAdmin, ToursController.deleteBooking);

export default router;
