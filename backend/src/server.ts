import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { seedDatabase } from './utils/seed';
import { registerRoutes } from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { securityHeadersMiddleware } from './middlewares/auth.middleware';
import { generalApiLimiter } from './middlewares/rateLimit.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Security and Performance Headers
app.use(securityHeadersMiddleware);
app.use((_req, res, next) => {
  res.setHeader('Keep-Alive', 'timeout=5, max=1000');
  next();
});

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// General Rate Limiter for all incoming traffic
app.use(generalApiLimiter);

// Routes Registration
registerRoutes(app);

// Health Check Endpoint
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

// Centralized Error Handling
app.use(errorHandler);

// Start Server
const start = async () => {
  await connectDB();
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`[Aarambha Server] MERN Express TypeScript API running on http://127.0.0.1:${PORT}`);
  });
};

start();
