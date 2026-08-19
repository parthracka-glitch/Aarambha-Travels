import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services/settings.service';

export class SettingsController {
  static async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await SettingsService.getSettings();
      res.json(settings);
    } catch (err) {
      next(err);
    }
  }

  static async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await SettingsService.updateSettings(req.body.settings, req.ip);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
