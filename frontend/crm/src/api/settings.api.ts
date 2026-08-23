import { apiFetch } from './client';

export const getSettings = () => apiFetch('/api/settings');

export const updateSettings = (settings: Record<string, any>) =>
  apiFetch('/api/settings', {
    method: 'POST',
    body: JSON.stringify({ settings }),
  });

export const getAdminProfile = () => apiFetch('/api/auth/me');

export const updateAdminProfile = (data: {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) =>
  apiFetch('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

