import { Router } from 'express';
import { FleetController } from '../controllers/fleet.controller';
import { BusController } from '../controllers/bus.controller';
import { authenticateAdmin, requireSuperAdmin } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  bookingCreationLimiter,
  inquiryCreationLimiter,
  syncStatusLimiter,
} from '../middlewares/rateLimit.middleware';
import {
  createFleetCategorySchema,
  createVehicleSchema,
  createFleetInquirySchema,
} from '../validators/fleet.validator';
import {
  createFleetBookingSchema,
  syncStatusSchema,
} from '../validators/booking.validator';

const router = Router();

// Public routes (Website & Customer booking)
router.get('/categories', FleetController.listCategories);
router.get('/vehicles', FleetController.listVehicles);
router.get('/vehicles/:id', FleetController.getVehicleById);
router.get('/buses', BusController.listBuses);
router.get('/buses/:id', BusController.getBusById);
router.post('/inquiries', inquiryCreationLimiter, validateRequest(createFleetInquirySchema), FleetController.createInquiry);
router.post('/bookings', bookingCreationLimiter, validateRequest(createFleetBookingSchema), FleetController.createBooking);
router.post('/bookings/sync-status', syncStatusLimiter, validateRequest(syncStatusSchema), FleetController.syncBookingStatus);

// Protected Admin routes
router.use(authenticateAdmin);

// Admin Bus Rental Management (SuperAdmin only)
router.post('/buses', requireSuperAdmin, BusController.createBus);
router.put('/buses/:id', requireSuperAdmin, BusController.updateBus);
router.delete('/buses/:id', requireSuperAdmin, BusController.deleteBus);

// Admin Vehicle & Category Management (SuperAdmin only)
router.post('/categories', requireSuperAdmin, validateRequest(createFleetCategorySchema), FleetController.createCategory);
router.post('/vehicles', requireSuperAdmin, validateRequest(createVehicleSchema), FleetController.createVehicle);
router.put('/vehicles/:id', requireSuperAdmin, validateRequest(createVehicleSchema.partial()), FleetController.updateVehicle);
router.delete('/vehicles/:id', requireSuperAdmin, FleetController.deleteVehicle);
router.delete('/inquiries/:id', requireSuperAdmin, FleetController.deleteInquiry);
router.get('/inquiries', FleetController.listInquiries);

// Admin Bookings — GET open to viewer; write status actions superadmin only
router.get('/bookings', FleetController.listBookings);
router.put('/bookings/:id/verify', requireSuperAdmin, FleetController.verifyBooking);
router.put('/bookings/:id/pickup', requireSuperAdmin, FleetController.markPickedUp);
router.put('/bookings/:id/return', requireSuperAdmin, FleetController.markReturned);
router.put('/bookings/:id/refund', requireSuperAdmin, FleetController.refundDeposit);
router.delete('/bookings/:id', requireSuperAdmin, FleetController.deleteBooking);

export default router;
