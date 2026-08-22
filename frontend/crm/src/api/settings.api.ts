import { apiFetch } from './client';

export const getSettings = () => apiFetch('/api/settings');

export const updateSettings = (settings: Record<string, any>) =>
  apiFetch('/api/settings', {
    method: 'POST',
    body: JSON.stringify({ settings }),
  });
