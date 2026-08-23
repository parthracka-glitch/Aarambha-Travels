import { Express } from 'express';
import authRoutes from './auth.routes';
import toursRoutes from './tours.routes';
import fleetRoutes from './fleet.routes';
import financeRoutes from './finance.routes';
import cmsRoutes from './cms.routes';
import auditRoutes from './audit.routes';
import settingsRoutes from './settings.routes';
import paymentRoutes from './payment.routes';
import realtimeRoutes from './realtime.routes';

export const registerRoutes = (app: Express): void => {
  app.use('/api/auth', authRoutes);
  app.use('/api/tours', toursRoutes);
  app.use('/api/fleet', fleetRoutes);
  app.use('/api/finance', financeRoutes);
  app.use('/api/cms', cmsRoutes);
  app.use('/api/analytics', auditRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/realtime', realtimeRoutes);
};

export {
  authRoutes,
  toursRoutes,
  fleetRoutes,
  financeRoutes,
  cmsRoutes,
  auditRoutes,
  settingsRoutes,
  paymentRoutes,
  realtimeRoutes,
};
