import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared Constraints
// ─────────────────────────────────────────────────────────────────────────────

const safeName = (label: string, min = 1, max = 200) =>
  z.string().trim().min(min, `${label} is required`).max(max, `${label} must not exceed ${max} characters`);

const safeText = (max = 2000) =>
  z.string().trim().max(max, `Text must not exceed ${max} characters`).optional();

const safeUrl = z.string().trim().url('Must be a valid URL').max(500).optional();

// ─────────────────────────────────────────────────────────────────────────────
// Destination
// ─────────────────────────────────────────────────────────────────────────────

export const createDestinationSchema = z.object({
  name: safeName('Name').max(100, 'Destination name must not exceed 100 characters'),
  state: safeName('State').max(100, 'State must not exceed 100 characters'),
  country: z.string().trim().max(100).default('India'),
  description: safeText(2000),
  imageUrl: safeUrl,
});

// ─────────────────────────────────────────────────────────────────────────────
// Package
// ─────────────────────────────────────────────────────────────────────────────

export const createPackageSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(150, 'Slug must not exceed 150 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title must not exceed 200 characters'),
  description: z.string().trim().min(1, 'Description is required').max(5000, 'Description must not exceed 5000 characters'),
  durationDays: z.number().int().min(1, 'Duration must be at least 1 day').max(365),
  durationNights: z.number().int().min(0).max(365),
  basePrice: z.number().min(0, 'Base price must be non-negative').max(10_000_000),
  depositPrice: z.number().min(0, 'Deposit price must be non-negative').max(10_000_000),
  datesLabel: z.string().trim().max(200).optional(),
  destinationId: z.string().trim().max(100).optional(),
  images: z.array(z.string().trim().url('Each image must be a valid URL').max(500)).max(20).optional(),
  inclusions: z.array(z.string().trim().max(300)).max(50).optional(),
  batchDates: z.array(z.any()).max(100).optional(),
  itineraries: z.array(z.object({
    dayNumber: z.number().int().min(1).max(365),
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(3000),
    meals: z.string().trim().max(200).optional(),
    stayDetails: z.string().trim().max(500).optional(),
  })).max(365).optional(),
});

export const updatePackageSchema = createPackageSchema.partial();

// ─────────────────────────────────────────────────────────────────────────────
// Tour Inquiry
// ─────────────────────────────────────────────────────────────────────────────

export const createTourInquirySchema = z.object({
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
  packageId: z.string().trim().max(100).optional(),
  travelDate: z.string().trim().max(50).optional(),
  paxCount: z.number().int().min(1).max(100).default(1),
  notes: z.string().trim().max(1000, 'Notes must not exceed 1000 characters').optional(),
});
