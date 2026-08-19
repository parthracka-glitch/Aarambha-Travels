import { apiFetch } from './client';

export const getPromoCodes = () => apiFetch('/api/finance/promo-codes');

export const createPromoCode = (data: any) =>
  apiFetch('/api/finance/promo-codes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
