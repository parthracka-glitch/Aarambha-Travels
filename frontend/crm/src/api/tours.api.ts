import { apiFetch } from './client';

export const getToursBookings = () => apiFetch('/api/tours/bookings').catch(() => []);
export const getToursInquiries = () => apiFetch('/api/tours/inquiries').catch(() => []);
export const getToursPackages = () => apiFetch('/api/tours/packages').catch(() => []);
export const getToursDestinations = () => apiFetch('/api/tours/destinations').catch(() => []);

export const createPackage = (data: any) =>
  apiFetch('/api/tours/packages', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updatePackage = (id: string, data: any) =>
  apiFetch(`/api/tours/packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deletePackage = (id: string) =>
  apiFetch(`/api/tours/packages/${id}`, { method: 'DELETE' });

export const createToursBooking = (data: any) =>
  apiFetch('/api/tours/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const deleteToursBooking = (id: string) =>
  apiFetch(`/api/tours/bookings/${id}`, { method: 'DELETE' });

export const deleteToursInquiry = (id: string) =>
  apiFetch(`/api/tours/inquiries/${id}`, { method: 'DELETE' });

export const createToursInquiry = (data: any) =>
  apiFetch('/api/tours/inquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  });
