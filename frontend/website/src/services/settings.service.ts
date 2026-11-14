import { apiFetch } from './api-client';

export interface PublicSettings {
  business_name?: string;
  contact_phone?: string;
  contact_email?: string;
  upi_id?: string;
  upi_payee_name?: string;
  verification_timeframe?: string;
}

export const DEFAULT_PUBLIC_SETTINGS: PublicSettings = {
  business_name: 'Aarambha Tours & Travels',
  contact_phone: '+91 90676 17451',
  contact_email: 'info@aarambhatravels.in',
  upi_id: '8208211478@ybl',
  upi_payee_name: 'Aarambh Travels',
  verification_timeframe: '2-4 hours',
};

let cachedSettings: PublicSettings | null = null;

export async function fetchLivePublicSettings(forceFresh: boolean = false): Promise<PublicSettings> {
  if (cachedSettings && !forceFresh) {
    return cachedSettings;
  }

  try {
    const data = await apiFetch<PublicSettings>('/api/settings/public', {
      cache: 'no-store',
      bypassCache: forceFresh,
    });
    if (data && typeof data === 'object') {
      cachedSettings = {
        ...DEFAULT_PUBLIC_SETTINGS,
        ...data,
      };
      return cachedSettings;
    }
  } catch (err) {
    console.warn('[SettingsService] Failed to load public settings from API, using defaults.', err);
  }

  return cachedSettings || DEFAULT_PUBLIC_SETTINGS;
}

