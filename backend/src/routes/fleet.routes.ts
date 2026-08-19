import { Router } from 'express';
import { FleetController } from '../controllers/fleet.controller';
import { authenticateAdmin, requireSuperAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Public routes (Website & Customer booking)
router.get('/categories', FleetController.listCategories);
router.get('/vehicles', FleetController.listVehicles);
router.get('/vehicles/:id', FleetController.getVehicleById);
router.post('/inquiries', FleetController.createInquiry);
router.post('/bookings', FleetController.createBooking);

// Protected Admin routes
router.use(authenticateAdmin);

// Admin Vehicle & Category Management (SuperAdmin only)
router.post('/categories', requireSuperAdmin, FleetController.createCategory);
router.post('/vehicles', requireSuperAdmin, FleetController.createVehicle);
router.put('/vehicles/:id', requireSuperAdmin, FleetController.updateVehicle);
router.delete('/vehicles/:id', requireSuperAdmin, FleetController.deleteVehicle);
router.delete('/inquiries/:id', requireSuperAdmin, FleetController.deleteInquiry);
router.get('/inquiries', FleetController.listInquiries);

// Admin Bookings — GET open to viewer; write status actions superadmin only
router.get('/bookings', FleetController.listBookings);
router.put('/bookings/:id/pickup', requireSuperAdmin, FleetController.markPickedUp);
router.put('/bookings/:id/return', requireSuperAdmin, FleetController.markReturned);
router.put('/bookings/:id/refund', requireSuperAdmin, FleetController.refundDeposit);
router.delete('/bookings/:id', requireSuperAdmin, FleetController.deleteBooking);

export default router;
