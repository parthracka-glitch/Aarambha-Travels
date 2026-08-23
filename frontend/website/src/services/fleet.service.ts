import { apiFetch } from './api-client';
import { FLEET_VEHICLES, CarVehicle } from '@/constants/carsData';

export function formatVehicleFromApi(apiVeh: any, fallback?: CarVehicle): CarVehicle {
  const match = fallback || FLEET_VEHICLES.find(c => c.id === apiVeh.id || c.id === apiVeh._id || c.name.toLowerCase() === (apiVeh.name || '').toLowerCase()) || FLEET_VEHICLES[0];
  const pricePerDay = Number(apiVeh.dailyRate ?? apiVeh.daily_rate ?? match.pricePerDay);

  return {
    ...match,
    id: apiVeh._id || apiVeh.id || match.id,
    name: apiVeh.name || match.name,
    category: apiVeh.specs?.bodyType || apiVeh.categoryId?.name || match.category || 'Hatchback',
    pricePerDay,
    featured: match.featured ?? true,
    image: (Array.isArray(apiVeh.images) && apiVeh.images[0]) || apiVeh.image || match.image,
    gallery: (Array.isArray(apiVeh.images) && apiVeh.images.length > 0) ? apiVeh.images : match.gallery,
    specs: {
      bodyType: apiVeh.specs?.bodyType || match.specs?.bodyType || 'Hatchback',
      transmission: apiVeh.specs?.transmission || match.specs?.transmission || 'Manual',
      engine: apiVeh.specs?.engine || match.specs?.engine || '1.2L Advanced',
      passengers: Number(apiVeh.specs?.seats || apiVeh.specs?.passengers || match.specs?.passengers || 5),
      horsepower: Number(apiVeh.specs?.horsepower || match.specs?.horsepower || 85),
      fuelType: apiVeh.specs?.fuel || apiVeh.specs?.fuelType || match.specs?.fuelType || 'Petrol',
    },
    availableColors: match.availableColors || ['#FF3B30', '#18181B', '#FFFFFF'],
    features: match.features || [],
    description: apiVeh.description || match.description || `${apiVeh.name} self-drive rental vehicle in Pune with zero deposit and doorstep delivery.`,
  };
}

export function formatVehiclesFromApi(liveList: any[] | null): CarVehicle[] {
  if (!Array.isArray(liveList) || liveList.length === 0) {
    return FLEET_VEHICLES;
  }

  // Match static vehicles with live counterparts
  const matched = FLEET_VEHICLES.map(staticCar => {
    const apiMatch = liveList.find(a => a._id === staticCar.id || a.id === staticCar.id || (a.name && a.name.toLowerCase() === staticCar.name.toLowerCase()));
    return apiMatch ? formatVehicleFromApi(apiMatch, staticCar) : staticCar;
  });

  // Add any new vehicles added from CRM
  const newOnes = liveList
    .filter(a => !FLEET_VEHICLES.some(s => s.id === a._id || s.id === a.id || (a.name && s.name.toLowerCase() === a.name.toLowerCase())))
    .map(a => formatVehicleFromApi(a));

  return [...matched, ...newOnes];
}

export async function fetchLiveFleetVehicles(): Promise<CarVehicle[]> {
  try {
    const res = await apiFetch<any>('/api/fleet/vehicles');
    const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : null);
    if (Array.isArray(data) && data.length > 0) {
      return formatVehiclesFromApi(data);
    }
  } catch (e) {
    console.warn('[FleetService] Failed to fetch live fleet vehicles from API, using default static list.', e);
  }
  return FLEET_VEHICLES;
}

export async function fetchLiveVehicleById(id: string): Promise<CarVehicle> {
  const fallback = FLEET_VEHICLES.find(c => c.id === id) || FLEET_VEHICLES[0];
  try {
    const res = await apiFetch<any>(`/api/fleet/vehicles/${id}`);
    const data = res?.data || res;
    if (data && (data._id || data.name)) {
      return formatVehicleFromApi(data, fallback);
    }
  } catch (e) {
    console.warn(`[FleetService] Failed to fetch live vehicle (${id}), using default static vehicle.`, e);
  }
  return fallback;
}

export const getFleetVehicles = () => apiFetch<any[]>('/api/fleet/vehicles');
export const getVehicleById = (id: string) => apiFetch<any>(`/api/fleet/vehicles/${id}`);
export const createFleetInquiry = (data: any) =>
  apiFetch('/api/fleet/inquiries', { method: 'POST', body: JSON.stringify(data) });

