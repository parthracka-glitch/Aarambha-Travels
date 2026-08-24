import { Router } from 'express';
import { ToursController } from '../controllers/tours.controller';
import { authenticateAdmin, requireSuperAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Public routes (Website & Customer booking)
router.get('/destinations', ToursController.listDestinations);
router.get('/packages', ToursController.listPackages);
router.get('/packages/:slug', ToursController.getPackageBySlug);
router.post('/inquiries', ToursController.createInquiry);
router.post('/bookings', ToursController.createBooking);
router.post('/bookings/sync-status', ToursController.syncBookingStatus);

// Protected Admin routes
router.use(authenticateAdmin);

// Admin Package & Destination Management (SuperAdmin only)
router.post('/destinations', requireSuperAdmin, ToursController.createDestination);
router.post('/packages', requireSuperAdmin, ToursController.createPackage);
router.put('/packages/:id', requireSuperAdmin, ToursController.updatePackage);
router.delete('/packages/:id', requireSuperAdmin, ToursController.deletePackage);
router.get('/inquiries', ToursController.listInquiries);
router.put('/inquiries/:id/status', requireSuperAdmin, ToursController.updateInquiryStatus);
router.delete('/inquiries/:id', requireSuperAdmin, ToursController.deleteInquiry);

// Admin Bookings — GET open to viewer; write status actions superadmin only
router.get('/bookings', ToursController.listBookings);
router.put('/bookings/:id/verify', requireSuperAdmin, ToursController.verifyBooking);
router.delete('/bookings/:id', requireSuperAdmin, ToursController.deleteBooking);

export default router;
