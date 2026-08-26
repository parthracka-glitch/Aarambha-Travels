import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Fleet Category
// ─────────────────────────────────────────────────────────────────────────────

export const createFleetCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Category name is required')
    .max(100, 'Category name must not exceed 100 characters'),
  description: z
    .string()
    .trim()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Vehicle
// ─────────────────────────────────────────────────────────────────────────────

export const createVehicleSchema = z.object({
  name: z.string().trim().min(1, 'Vehicle name is required').max(100, 'Name must not exceed 100 characters'),
  regNumber: z
    .string()
    .trim()
    .max(20, 'Registration number must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9\s\-]+$/, 'Registration number contains invalid characters')
    .optional(),
  reg_number: z
    .string()
    .trim()
    .max(20)
    .regex(/^[a-zA-Z0-9\s\-]+$/)
    .optional(),
  categoryId: z.string().trim().max(100).optional(),
  category_id: z.string().trim().max(100).optional(),
  vehicleType: z.enum(['car', 'bike']).optional(),
  vehicle_type: z.enum(['car', 'bike']).optional(),
  dailyRate: z.number().min(0, 'Daily rate must be non-negative').max(1_000_000).optional(),
  daily_rate: z.number().min(0).max(1_000_000).optional(),
  securityDeposit: z.number().min(0).max(1_000_000).optional(),
  security_deposit: z.number().min(0).max(1_000_000).optional(),
  images: z.array(z.string().trim().url('Each image must be a valid URL').max(500)).max(20).optional(),
  specs: z.record(z.union([z.string().max(500), z.number(), z.boolean()])).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Fleet Inquiry
// ─────────────────────────────────────────────────────────────────────────────

export const createFleetInquirySchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, 'Customer name is required')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\u0900-\u097F\s'.,-]+$/, 'Name contains invalid characters'),
  customerEmail: z
    .string()
    .trim()
    .email('Please provide a valid email address')
    .max(254)
    .toLowerCase(),
  customerPhone: z
    .string()
    .trim()
    .min(7, 'Phone number must be at least 7 digits')
    .max(20)
    .regex(/^[+\d][\d\s\-().]{6,18}$/, 'Phone number contains invalid characters'),
  vehicleId: z.string().trim().max(100).optional(),
  pickupDate: z.string().trim().max(50).optional(),
  dropoffDate: z.string().trim().max(50).optional(),
  notes: z.string().trim().max(1000, 'Notes must not exceed 1000 characters').optional(),
});
