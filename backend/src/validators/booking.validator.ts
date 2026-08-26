import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared field validators used across booking schemas
// ─────────────────────────────────────────────────────────────────────────────

// Valid Indian/International phone: optional spaces/dashes, 7-15 digits
const phoneSchema = z
  .string()
  .trim()
  .min(7, 'Phone number must be at least 7 digits')
  .max(20, 'Phone number must not exceed 20 characters')
  .regex(/^[+\d][\d\s\-().]{6,18}$/, 'Phone number contains invalid characters');

// Customer name: letters, spaces, basic punctuation only — no HTML/script chars
const customerNameSchema = z
  .string()
  .trim()
  .min(2, 'Customer name must be at least 2 characters')
  .max(100, 'Customer name must not exceed 100 characters')
  .regex(/^[a-zA-Z\u0900-\u097F\s'.,-]+$/, 'Customer name contains invalid characters');

// Notes/special requests: free text, but capped at 1000 chars
const notesSchema = z
  .string()
  .trim()
  .max(1000, 'Notes must not exceed 1000 characters')
  .optional();

// UTR/transaction number: alphanumeric, 6-30 chars
const utrSchema = z
  .string()
  .trim()
  .min(6, 'UTR number must be at least 6 characters')
  .max(30, 'UTR number must not exceed 30 characters')
  .regex(/^[a-zA-Z0-9\-_]+$/, 'UTR number must be alphanumeric')
  .optional();

// MongoDB ObjectId or booking code format
const bookingCodeSchema = z
  .string()
  .trim()
  .min(3, 'Booking code is too short')
  .max(50, 'Booking code must not exceed 50 characters')
  .regex(/^[a-zA-Z0-9\-_]+$/, 'Booking code contains invalid characters');

// ─────────────────────────────────────────────────────────────────────────────
// Tour Booking — POST /api/tours/bookings
// ─────────────────────────────────────────────────────────────────────────────

export const createTourBookingSchema = z.object({
  // Customer identity
  customerName: customerNameSchema,
  customerEmail: z
    .string()
    .trim()
    .email('Please provide a valid email address')
    .max(254, 'Email address is too long')
    .toLowerCase(),
  customerPhone: phoneSchema,

  // Package/booking details
  packageId: z
    .string()
    .trim()
    .max(100, 'Package ID is too long')
    .optional(),
  package_id: z
    .string()
    .trim()
    .max(100, 'Package ID is too long')
    .optional(),
  travelDate: z
    .string()
    .trim()
    .max(50, 'Travel date is too long')
    .optional(),
  travel_date: z
    .string()
    .trim()
    .max(50, 'Travel date is too long')
    .optional(),
  paxCount: z
    .number()
    .int('Passenger count must be a whole number')
    .min(1, 'At least 1 passenger is required')
    .max(100, 'Passenger count cannot exceed 100')
    .optional(),
  pax_count: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional(),

  // Payment fields
  utrNumber: utrSchema,
  utr_number: utrSchema,
  depositAmount: z.number().min(0).max(10_000_000).optional(),
  deposit_amount: z.number().min(0).max(10_000_000).optional(),
  totalAmount: z.number().min(0).max(10_000_000).optional(),
  total_amount: z.number().min(0).max(10_000_000).optional(),

  // Razorpay payment (online checkout)
  razorpay_order_id: z.string().trim().max(100).optional(),
  razorpay_payment_id: z.string().trim().max(100).optional(),
  razorpay_signature: z.string().trim().max(200).optional(),

  // Additional fields
  specialRequests: notesSchema,
  special_requests: notesSchema,
  notes: notesSchema,
  agreementAccepted: z.boolean().optional(),
  agreement_accepted: z.boolean().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Fleet/Self-Drive Booking — POST /api/fleet/bookings
// ─────────────────────────────────────────────────────────────────────────────

export const createFleetBookingSchema = z.object({
  // Customer identity
  customerName: customerNameSchema.optional(),
  customer_name: customerNameSchema.optional(),
  customerEmail: z
    .string()
    .trim()
    .email('Please provide a valid email address')
    .max(254, 'Email address is too long')
    .toLowerCase()
    .optional(),
  customer_email: z
    .string()
    .trim()
    .email()
    .max(254)
    .toLowerCase()
    .optional(),
  customerPhone: phoneSchema.optional(),
  customer_phone: phoneSchema.optional(),

  // Vehicle/booking details
  vehicleId: z.string().trim().max(100, 'Vehicle ID is too long').optional(),
  vehicle_id: z.string().trim().max(100).optional(),
  busId: z.string().trim().max(100).optional(),
  bus_id: z.string().trim().max(100).optional(),
  serviceType: z.enum(['fleet', 'bus']).optional(),
  service_type: z.enum(['fleet', 'bus']).optional(),

  // Dates and license
  pickupDatetime: z.string().trim().max(50).optional(),
  pickup_datetime: z.string().trim().max(50).optional(),
  dropoffDatetime: z.string().trim().max(50).optional(),
  dropoff_datetime: z.string().trim().max(50).optional(),
  licenseNumber: z
    .string()
    .trim()
    .max(30, 'License number must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9\-\s]+$/, 'License number contains invalid characters')
    .optional(),
  license_number: z
    .string()
    .trim()
    .max(30)
    .regex(/^[a-zA-Z0-9\-\s]+$/)
    .optional(),

  // Payment fields
  utrNumber: utrSchema,
  utr_number: utrSchema,
  depositAmount: z.number().min(0).max(10_000_000).optional(),
  deposit_amount: z.number().min(0).max(10_000_000).optional(),
  totalRentalAmount: z.number().min(0).max(10_000_000).optional(),
  total_rental_amount: z.number().min(0).max(10_000_000).optional(),

  // Razorpay payment (online checkout)
  razorpay_order_id: z.string().trim().max(100).optional(),
  razorpay_payment_id: z.string().trim().max(100).optional(),
  razorpay_signature: z.string().trim().max(200).optional(),

  // Additional
  specialRequests: notesSchema,
  special_requests: notesSchema,
  notes: notesSchema,
  agreementAccepted: z.boolean().optional(),
  agreement_accepted: z.boolean().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Booking Status Sync — POST /api/tours/bookings/sync-status
//                        POST /api/fleet/bookings/sync-status
// ─────────────────────────────────────────────────────────────────────────────

export const syncStatusSchema = z.object({
  // Either codes or email must be present (or both)
  codes: z
    .array(bookingCodeSchema)
    .max(20, 'Cannot request status for more than 20 bookings at once')
    .optional(),
  email: z
    .string()
    .trim()
    .email('Please provide a valid email address')
    .max(254)
    .toLowerCase()
    .optional(),
}).refine(
  (data) => (data.codes && data.codes.length > 0) || data.email,
  { message: 'Either booking codes or email is required to sync status' }
);
