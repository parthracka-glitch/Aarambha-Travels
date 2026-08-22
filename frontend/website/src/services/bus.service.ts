import { apiFetch } from './api-client';
import {
  LOCAL_AC_RATES,
  LOCAL_NON_AC_RATES,
  OUTSTATION_AC_RATES,
  OUTSTATION_NON_AC_RATES,
  URBANIA_PER_DAY_RATES,
  URBANIA_LOCAL_PACKAGE,
  URBANIA_PUNE_MUMBAI,
  PUNE_MUMBAI_CAB_PACKAGES,
} from '@/constants/busData';

export async function fetchLiveBusRates() {
  try {
    const data = await apiFetch<any[]>('/api/fleet/buses');
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn('[BusService] Failed to fetch live bus rates from API, using default static rate card.', e);
  }
  return null;
}

export function formatBusDataFromApi(liveBuses: any[] | null) {
  if (!liveBuses || liveBuses.length === 0) {
    return {
      localAcRates: LOCAL_AC_RATES,
      localNonAcRates: LOCAL_NON_AC_RATES,
      outstationAcRates: OUTSTATION_AC_RATES,
      outstationNonAcRates: OUTSTATION_NON_AC_RATES,
      urbaniaPerDayRates: URBANIA_PER_DAY_RATES,
      urbaniaLocalPackage: URBANIA_LOCAL_PACKAGE,
      urbaniaPuneMumbai: URBANIA_PUNE_MUMBAI,
      puneMumbaiCabs: PUNE_MUMBAI_CAB_PACKAGES,
    };
  }

  const localAcRates = liveBuses
    .filter(b => b.category === 'local_ac' && b.status !== 'Inactive')
    .map(b => ({
      id: b._id || b.busId,
      busType: b.busType,
      seats: b.seats,
      baseRate: b.baseRate,
      extraKmRate: b.extraKmRate,
      extraHourRate: b.extraHourRate,
      isUrbania: b.isUrbania,
      acType: b.acType,
    }));

  const localNonAcRates = liveBuses
    .filter(b => b.category === 'local_nonac' && b.status !== 'Inactive')
    .map(b => ({
      id: b._id || b.busId,
      busType: b.busType,
      seats: b.seats,
      baseRate: b.baseRate,
      extraKmRate: b.extraKmRate,
      extraHourRate: b.extraHourRate,
      acType: b.acType,
    }));

  const outstationAcRates = liveBuses
    .filter(b => b.category === 'outstation_ac' && b.status !== 'Inactive')
    .map(b => ({
      id: b._id || b.busId,
      busType: b.busType,
      seats: b.seats,
      mumbaiRate: b.mumbaiRate,
      mahabaleshwarRate: b.mahabaleshwarRate,
      extraKmRate: b.extraKmRate,
      specialPermit: b.specialPermit,
      acType: b.acType,
      isUrbania: b.isUrbania,
    }));

  const outstationNonAcRates = liveBuses
    .filter(b => b.category === 'outstation_nonac' && b.status !== 'Inactive')
    .map(b => ({
      id: b._id || b.busId,
      busType: b.busType,
      seats: b.seats,
      mumbaiRate: b.mumbaiRate,
      mahabaleshwarRate: b.mahabaleshwarRate,
      extraKmRate: b.extraKmRate,
      specialPermit: b.specialPermit,
      acType: b.acType,
    }));

  const urbaniaPerDayRates = liveBuses
    .filter(b => b.category === 'urbania_per_day' && b.status !== 'Inactive')
    .map(b => ({
      id: b._id || b.busId,
      busType: b.busType,
      seats: b.seats,
      minKmPerDay: b.minKmPerDay || 300,
      acPerKmRate: b.acPerKmRate || 35,
      tollParkingDriverDA: b.tollParkingDriverDA || 400,
      tollNote: b.tollNote || '₹400 or Food Extra',
    }));

  const urbaniaLocalPackage = liveBuses
    .filter(b => b.category === 'urbania_local' && b.status !== 'Inactive')
    .map(b => ({
      id: b._id || b.busId,
      busType: b.busType,
      seats: b.seats,
      packageRate: b.packageRate || b.baseRate,
      kmIncluded: b.kmIncluded || 80,
      extraKmRate: b.extraKmRate || 37,
      hoursIncluded: b.hoursIncluded || 8,
      extraHourRate: b.extraHourRate || 500,
    }));

  const urbaniaPuneMumbai = liveBuses
    .filter(b => b.category === 'urbania_pune_mumbai' && b.isUrbania && b.status !== 'Inactive')
    .map(b => ({
      id: b._id || b.busId,
      busType: b.busType,
      seats: b.seats,
      packageRate: b.packageRate,
      kmIncluded: b.kmIncluded || 350,
      extraKmRate: b.extraKmRate || 38,
      tollParkingDriverDA: b.tollParkingDriverDA || 400,
      tollNote: b.tollNote || '₹400 or Food Extra',
    }));

  const puneMumbaiCabs = liveBuses
    .filter(b => b.category === 'urbania_pune_mumbai' && !b.isUrbania && b.status !== 'Inactive')
    .map(b => ({
      id: b._id || b.busId,
      busType: b.busType,
      seats: b.seats,
      packageRate: b.packageRate,
      kmIncluded: b.kmIncluded || 350,
      extraKmRate: b.extraKmRate || 18,
      acType: b.acType || 'AC',
      description: `Pune → Mumbai / Airport drop in comfortable ${b.seats}-seater AC vehicle with driver`,
    }));

  return {
    localAcRates: localAcRates.length ? localAcRates : LOCAL_AC_RATES,
    localNonAcRates: localNonAcRates.length ? localNonAcRates : LOCAL_NON_AC_RATES,
    outstationAcRates: outstationAcRates.length ? outstationAcRates : OUTSTATION_AC_RATES,
    outstationNonAcRates: outstationNonAcRates.length ? outstationNonAcRates : OUTSTATION_NON_AC_RATES,
    urbaniaPerDayRates: urbaniaPerDayRates.length ? urbaniaPerDayRates : URBANIA_PER_DAY_RATES,
    urbaniaLocalPackage: urbaniaLocalPackage.length ? urbaniaLocalPackage : URBANIA_LOCAL_PACKAGE,
    urbaniaPuneMumbai: urbaniaPuneMumbai.length ? urbaniaPuneMumbai : URBANIA_PUNE_MUMBAI,
    puneMumbaiCabs: puneMumbaiCabs.length ? puneMumbaiCabs : PUNE_MUMBAI_CAB_PACKAGES,
  };
}
