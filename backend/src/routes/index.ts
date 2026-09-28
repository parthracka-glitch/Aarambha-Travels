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
import notificationsRoutes from './notifications.routes';

export const registerRoutes = (app: Express): void => {
  // Primary Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tours', toursRoutes);
  app.use('/api/fleet', fleetRoutes);
  app.use('/api/finance', financeRoutes);
  app.use('/api/cms', cmsRoutes);
  app.use('/api/analytics', auditRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/realtime', realtimeRoutes);
  app.use('/api/notifications', notificationsRoutes);

  // Versioned v1 Aliases for Forward Compatibility
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/tours', toursRoutes);
  app.use('/api/v1/fleet', fleetRoutes);
  app.use('/api/v1/finance', financeRoutes);
  app.use('/api/v1/cms', cmsRoutes);
  app.use('/api/v1/analytics', auditRoutes);
  app.use('/api/v1/settings', settingsRoutes);
  app.use('/api/v1/payments', paymentRoutes);
  app.use('/api/v1/realtime', realtimeRoutes);
  app.use('/api/v1/notifications', notificationsRoutes);
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
  notificationsRoutes,
};

