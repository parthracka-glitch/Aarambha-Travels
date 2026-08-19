import { apiFetch } from './api-client';

export const getFleetVehicles = () => apiFetch<any[]>('/api/fleet/vehicles');
export const getVehicleById = (id: string) => apiFetch<any>(`/api/fleet/vehicles/${id}`);
export const createFleetInquiry = (data: any) =>
  apiFetch('/api/fleet/inquiries', { method: 'POST', body: JSON.stringify(data) });
