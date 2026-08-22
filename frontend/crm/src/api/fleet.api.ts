import { apiFetch } from './client';

export const getFleetBookings = () => apiFetch('/api/fleet/bookings').catch(() => []);
export const getFleetInquiries = () => apiFetch('/api/fleet/inquiries').catch(() => []);
export const getFleetVehicles = () => apiFetch('/api/fleet/vehicles').catch(() => []);
export const getFleetCategories = () => apiFetch('/api/fleet/categories').catch(() => []);

export const createVehicle = (data: any) =>
  apiFetch('/api/fleet/vehicles', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateVehicle = (id: string, data: any) =>
  apiFetch(`/api/fleet/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteVehicle = (id: string) =>
  apiFetch(`/api/fleet/vehicles/${id}`, { method: 'DELETE' });

export const createFleetBooking = (data: any) =>
  apiFetch('/api/fleet/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const deleteFleetBooking = (id: string) =>
  apiFetch(`/api/fleet/bookings/${id}`, { method: 'DELETE' });

export const deleteFleetInquiry = (id: string) =>
  apiFetch(`/api/fleet/inquiries/${id}`, { method: 'DELETE' });

export const createFleetInquiry = (data: any) =>
  apiFetch('/api/fleet/inquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const pickupFleetBooking = (id: string, paymentMethod = 'Cash') =>
  apiFetch(`/api/fleet/bookings/${id}/pickup`, {
    method: 'PUT',
    body: JSON.stringify({ pickup_payment_method: paymentMethod }),
  });

export const returnFleetBooking = (id: string) =>
  apiFetch(`/api/fleet/bookings/${id}/return`, { method: 'PUT' });

export const refundFleetBooking = (id: string) =>
  apiFetch(`/api/fleet/bookings/${id}/refund`, { method: 'PUT' });

export const verifyFleetBooking = (id: string, status: 'Confirmed' | 'Deposit Paid' | 'Rejected', rejectionReason?: string) =>
  apiFetch(`/api/fleet/bookings/${id}/verify`, {
    method: 'PUT',
    body: JSON.stringify({ status, rejectionReason }),
  });
