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

// ─── CORS — Comprehensive Production Whitelist with Vercel & Custom Domain Support ───
const isProd = process.env.NODE_ENV === 'production';
const corsOriginEnv = process.env.CORS_ORIGIN;
let allowedOrigins: string[] = [];

if (corsOriginEnv) {
  allowedOrigins = corsOriginEnv.split(',').map(o => o.trim()).filter(Boolean);
}

// Built-in standard allowed origins
const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'https://aarambhatravels.in',
  'https://www.aarambhatravels.in',
  'https://admin.aarambhatravels.in',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server pings, Postman)
    if (!origin) {
      callback(null, true);
      return;
    }

    const isWildcard = allowedOrigins.includes('*');
    const isExplicit = allowedOrigins.includes(origin) || defaultAllowedOrigins.includes(origin);
    
    // Strict domain matching preventing subdomain spoofing (e.g. evil-aarambhatravels.in)
    let isAarambhaDomain = false;
    let isVercelDomain = false;
    let isLocal = false;

    try {
      const parsed = new URL(origin);
      const host = parsed.hostname.toLowerCase();
      isAarambhaDomain = host === 'aarambhatravels.in' || host.endsWith('.aarambhatravels.in');
      isVercelDomain = host.endsWith('.vercel.app');
      isLocal = host === 'localhost' || host === '127.0.0.1';
    } catch {
      isAarambhaDomain = false;
      isVercelDomain = false;
      isLocal = false;
    }

    if (isWildcard || isExplicit || isVercelDomain || isAarambhaDomain || isLocal) {
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

// ─── Health Check & Root Endpoints (Exempt from rate limits & suspicious detector) ───
app.get('/api/health', async (_req: Request, res: Response): Promise<void> => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { getDbStorageType } = await import('./config/db');
  res.json({
    status: 'online',
    timestamp: Date.now() / 1000,
    database: 'healthy',
    storage: getDbStorageType(),
    storageLabel: getDbStorageType() === 'Atlas' ? 'MongoDB Atlas (Persistent Cloud)' : getDbStorageType() === 'Local' ? 'Local MongoDB' : 'In-Memory RAM (Demo Mode - Temporary)',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    framework: 'Node.js Express + TypeScript + Mongoose',
  });
});

app.get('/', (_req: Request, res: Response): void => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    message: 'Welcome to Aarambha MERN Stack API',
    health: '/api/health',
  });
});

// ─── Structured Request Logger (every request) ───────────────────────────────
app.use(requestLogger);

// ─── Suspicious Traffic & Bot Detection ──────────────────────────────────────
app.use(suspiciousTrafficDetector);

// ─── General Rate Limiter for all incoming traffic ────────────────────────────
app.use(generalApiLimiter);

// ─── Application Routes ───────────────────────────────────────────────────────
registerRoutes(app);

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

    // Auto keep-alive self-ping for free-tier cloud hosting (Render)
    const keepAliveUrl = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL;
    if (keepAliveUrl) {
      const pingIntervalMs = 12 * 60 * 1000; // Every 12 minutes (Render sleeps at 15 min)
      setInterval(() => {
        const pingUrl = `${keepAliveUrl.replace(/\/$/, '')}/api/health`;
        fetch(pingUrl).catch(() => {});
      }, pingIntervalMs);
    }
  });
};

start();

