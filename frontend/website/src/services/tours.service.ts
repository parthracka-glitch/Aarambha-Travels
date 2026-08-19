import { apiFetch } from './api-client';

export const getTourPackages = () => apiFetch<any[]>('/api/tours/packages');
export const getTourPackageBySlug = (slug: string) => apiFetch<any>(`/api/tours/packages/${slug}`);
export const createTourInquiry = (data: any) =>
  apiFetch('/api/tours/inquiries', { method: 'POST', body: JSON.stringify(data) });
