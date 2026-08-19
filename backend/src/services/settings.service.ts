import { Setting } from '../models';
import { recordAudit } from '../middlewares/auth.middleware';

export class SettingsService {
  static async getSettings() {
    const list = await Setting.find();
    const settingsDict: Record<string, any> = {};
    list.forEach((s) => {
      settingsDict[s.key] = s.value;
    });

    if (!settingsDict['business_name']) settingsDict['business_name'] = 'Aarambha Tours & Travels + Self-Drive Rentals';
    if (!settingsDict['contact_phone']) settingsDict['contact_phone'] = '+91 82082 11478';
    if (!settingsDict['contact_email']) settingsDict['contact_email'] = 'info@aarambhatravels.in';

    return settingsDict;
  }

  static async updateSettings(settings: Record<string, any>, ipAddress?: string) {
    if (settings && typeof settings === 'object') {
      for (const [key, value] of Object.entries(settings)) {
        await Setting.findOneAndUpdate({ key }, { value, updatedAt: new Date() }, { upsert: true });
      }
    }

    await recordAudit({
      actorName: 'Admin',
      action: 'UPDATE_SETTINGS',
      targetType: 'settings',
      details: settings || {},
      ipAddress,
    });

    return { message: 'Settings updated successfully' };
  }
}
