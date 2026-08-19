import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('8000'),
  NODE_ENV: z.string().default('development'),
  MONGODB_URI: z.string().optional(),
  SECRET_KEY: z.string().default('aarambha-super-secret-key-change-in-production-2026'),
  RAZORPAY_TOURS_KEY_ID: z.string().default('rzp_test_tours_key'),
  RAZORPAY_TOURS_KEY_SECRET: z.string().default('rzp_test_tours_secret'),
  RAZORPAY_FLEET_KEY_ID: z.string().default('rzp_test_fleet_key'),
  RAZORPAY_FLEET_KEY_SECRET: z.string().default('rzp_test_fleet_secret'),
});

export const env = envSchema.parse(process.env);
