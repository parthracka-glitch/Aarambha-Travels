import { z } from 'zod';

export const createDestinationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().default('India'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const createPackageSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  durationDays: z.number().min(1),
  durationNights: z.number().min(0),
  basePrice: z.number().min(0),
  depositPrice: z.number().min(0),
  destinationId: z.string().optional(),
  images: z.array(z.string()).optional(),
  inclusions: z.array(z.string()).optional(),
  itineraries: z.array(z.object({
    dayNumber: z.number(),
    title: z.string(),
    description: z.string(),
    meals: z.string().optional(),
    stayDetails: z.string().optional(),
  })).optional(),
});

export const createTourInquirySchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(1),
  packageId: z.string().optional(),
  travelDate: z.string().optional(),
  paxCount: z.number().default(1),
  notes: z.string().optional(),
});
