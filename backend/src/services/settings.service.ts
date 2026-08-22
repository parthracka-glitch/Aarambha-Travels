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
    if (!settingsDict['upi_id']) settingsDict['upi_id'] = '8208211478@ybl';
    if (!settingsDict['upi_payee_name']) settingsDict['upi_payee_name'] = 'Aarambh Travels';
    if (!settingsDict['verification_timeframe']) settingsDict['verification_timeframe'] = '2-4 hours';

    return settingsDict;
  }

  static async getPublicSettings() {
    const settings = await this.getSettings();
    return {
      business_name: settings.business_name,
      contact_phone: settings.contact_phone,
      contact_email: settings.contact_email,
      upi_id: settings.upi_id || '8208211478@ybl',
      upi_payee_name: settings.upi_payee_name || 'Aarambh Travels',
      verification_timeframe: settings.verification_timeframe || '2-4 hours',
    };
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
