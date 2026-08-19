import { z } from 'zod';

export const createFleetCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
});

export const createVehicleSchema = z.object({
  name: z.string().min(1, 'Vehicle name is required'),
  regNumber: z.string().optional(),
  reg_number: z.string().optional(),
  categoryId: z.string().optional(),
  category_id: z.string().optional(),
  vehicleType: z.enum(['car', 'bike']).optional(),
  vehicle_type: z.enum(['car', 'bike']).optional(),
  dailyRate: z.number().optional(),
  daily_rate: z.number().optional(),
  securityDeposit: z.number().optional(),
  security_deposit: z.number().optional(),
  images: z.array(z.string()).optional(),
  specs: z.record(z.any()).optional(),
});

export const createFleetInquirySchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(1),
  vehicleId: z.string().optional(),
  pickupDate: z.string().optional(),
  dropoffDate: z.string().optional(),
  notes: z.string().optional(),
});
