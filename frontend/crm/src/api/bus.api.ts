import { apiFetch } from './client';

export const getBusRates = () =>
  apiFetch('/api/fleet/buses')
    .then(res => (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])))
    .catch(() => []);

export const createBusRate = (data: any) =>
  apiFetch('/api/fleet/buses', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateBusRate = (id: string, data: any) =>
  apiFetch(`/api/fleet/buses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteBusRate = (id: string) =>
  apiFetch(`/api/fleet/buses/${id}`, { method: 'DELETE' });
