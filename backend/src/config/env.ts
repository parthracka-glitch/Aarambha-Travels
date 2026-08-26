import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

// ─────────────────────────────────────────────────────────────────────────────
// Environment Variable Schema
//
// In production: SECRET_KEY and MONGODB_URI are REQUIRED and must not use
// the development placeholder values — server startup will fail fast if missing.
//
// In development/test: safe defaults are used so the project works out of the box.
// ─────────────────────────────────────────────────────────────────────────────

const UNSAFE_SECRET_DEFAULTS = [
  'aarambha-super-secret-key-change-in-production-2026',
  'change-me',
  'secret',
  'your_secret_here',
];

const envSchema = z.object({
  PORT: z.string().default('8000'),
  NODE_ENV: z.string().default('development'),

  // MongoDB URI — required in production
  MONGODB_URI: isProd
    ? z.string().min(10, 'MONGODB_URI is required in production')
    : z.string().optional(),

  // JWT Secret — required in production, must not be a known-weak default
  SECRET_KEY: isProd
    ? z.string().min(32, 'SECRET_KEY must be at least 32 characters in production')
    : z.string().default('aarambha-super-secret-key-change-in-production-2026'),

  // CORS Origin — strongly recommended in production
  CORS_ORIGIN: z.string().optional(),

  // Razorpay Keys — optional (app falls back to mock payments without them)
  RAZORPAY_TOURS_KEY_ID: z.string().default('rzp_test_tours_key'),
  RAZORPAY_TOURS_KEY_SECRET: z.string().default('rzp_test_tours_secret'),
  RAZORPAY_FLEET_KEY_ID: z.string().default('rzp_test_fleet_key'),
  RAZORPAY_FLEET_KEY_SECRET: z.string().default('rzp_test_fleet_secret'),

  // Google OAuth — optional
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);

// ─── Production Secret Safety Checks (Fail-Fast at Startup) ──────────────────
if (isProd) {
  // Reject weak/default JWT secrets in production
  if (UNSAFE_SECRET_DEFAULTS.includes(env.SECRET_KEY)) {
    throw new Error(
      '[SECURITY] SECRET_KEY is set to a known-unsafe default value. ' +
      'Set a strong, random SECRET_KEY (min 32 chars) in your production environment variables before deploying.'
    );
  }

  // Warn if Razorpay keys are still using test/placeholder values
  if (env.RAZORPAY_TOURS_KEY_SECRET === 'rzp_test_tours_secret' ||
      env.RAZORPAY_FLEET_KEY_SECRET === 'rzp_test_fleet_secret') {
    console.warn(
      '[SECURITY WARNING] Razorpay keys are still using test/placeholder values in production. ' +
      'Set real RAZORPAY_TOURS_KEY_SECRET and RAZORPAY_FLEET_KEY_SECRET in your production environment.'
    );
  }

  // Warn if CORS_ORIGIN is not configured
  if (!env.CORS_ORIGIN) {
    console.warn(
      '[SECURITY WARNING] CORS_ORIGIN is not set in production. ' +
      'Set CORS_ORIGIN to your allowed frontend origins (e.g., https://aarambhatravels.in,https://admin.aarambhatravels.in).'
    );
  }
}
