import { Request, Response, NextFunction } from 'express';
import { Notification } from '../models/shared.model';

export class NotificationsController {
  /**
   * List recent notifications with unread count
   */
  static async listNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [notifications, unreadCount] = await Promise.all([
        Notification.find().sort({ createdAt: -1 }).limit(50).lean(),
        Notification.countDocuments({ isRead: false }),
      ]);

      res.json({
        notifications,
        unreadCount,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Mark a single notification as read
   */
  static async markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const notification = await Notification.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );
      if (!notification) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }
      res.json(notification);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Mark all notifications as read
   */
  static async markAllRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await Notification.updateMany({ isRead: false }, { isRead: true });
      res.json({ message: 'All notifications marked as read', success: true });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Internal helper to create a notification
   */
  static async pushNotification(data: {
    title: string;
    message: string;
    type?: 'booking' | 'payment' | 'inquiry' | 'system';
    link?: string;
  }) {
    try {
      return await Notification.create({
        title: data.title,
        message: data.message,
        type: data.type || 'system',
        link: data.link,
      });
    } catch (err) {
      console.warn('Failed to push notification:', err);
    }
  }
}
