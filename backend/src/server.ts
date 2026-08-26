import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { seedDatabase } from './utils/seed';
import { registerRoutes } from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { securityHeadersMiddleware } from './middlewares/auth.middleware';
import { generalApiLimiter } from './middlewares/rateLimit.middleware';
import { requestLogger, suspiciousTrafficDetector } from './middlewares/logger.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// ─── Trust Proxy (Required for accurate IP behind Render / Nginx / Cloudflare) ───
// Without this, req.ip returns the proxy IP, breaking rate limiting and logging
app.set('trust proxy', 1);

// ─── Remove X-Powered-By fingerprint header ───────────────────────────────────
app.disable('x-powered-by');

// ─── Security Headers (Helmet-Grade) ─────────────────────────────────────────
app.use(securityHeadersMiddleware);

// ─── Connection Keep-Alive ────────────────────────────────────────────────────
app.use((_req, res, next) => {
  res.setHeader('Keep-Alive', 'timeout=5, max=1000');
  next();
});

// ─── CORS — Strict Whitelist from CORS_ORIGIN env var ────────────────────────
// Falls back to a permissive dev list only in non-production
const isProd = process.env.NODE_ENV === 'production';
const corsOriginEnv = process.env.CORS_ORIGIN;
let allowedOrigins: string[] = [];

if (corsOriginEnv) {
  allowedOrigins = corsOriginEnv.split(',').map(o => o.trim()).filter(Boolean);
} else if (!isProd) {
  // Development fallback — permissive list for local dev only
  allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ];
} else {
  console.warn('[SECURITY WARNING] CORS_ORIGIN env variable is not set in production. All cross-origin requests will be blocked.');
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman in dev)
    if (!origin) {
      callback(null, !isProd);
      return;
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Blocked request from unlisted origin: ${origin}`);
      callback(new Error(`CORS policy: Origin '${origin}' is not allowed.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// ─── Structured Request Logger (every request) ───────────────────────────────
app.use(requestLogger);

// ─── Suspicious Traffic & Bot Detection ──────────────────────────────────────
app.use(suspiciousTrafficDetector);

// ─── General Rate Limiter for all incoming traffic ────────────────────────────
app.use(generalApiLimiter);

// ─── Application Routes ───────────────────────────────────────────────────────
registerRoutes(app);

// ─── Health Check Endpoint ────────────────────────────────────────────────────
app.get('/api/health', async (_req: Request, res: Response): Promise<void> => {
  res.json({
    status: 'online',
    timestamp: Date.now() / 1000,
    database: 'healthy',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    framework: 'Node.js Express + TypeScript + Mongoose',
  });
});

app.get('/', (_req: Request, res: Response): void => {
  res.json({
    message: 'Welcome to Aarambha MERN Stack API',
    health: '/api/health',
  });
});

// ─── Centralized Error Handling ───────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(JSON.stringify({
      level: 'INFO',
      timestamp: new Date().toISOString(),
      event: 'SERVER_STARTED',
      message: `Aarambha API running on port ${PORT}`,
      environment: process.env.NODE_ENV || 'development',
      port: PORT,
    }));
  });
};

start();
