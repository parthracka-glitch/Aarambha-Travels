import { BusRate, IBusRate } from '../models/bus.model';

const DEFAULT_BUS_RATES: Partial<IBusRate>[] = [
  // Local AC
  { busId: 'local-ac-13', busType: '13 Seater', category: 'local_ac', seats: 13, acType: 'AC', isUrbania: false, baseRate: 6000, extraKmRate: 24, extraHourRate: 300, status: 'Active' },
  { busId: 'local-ac-13u', busType: '13 Seater Urbania', category: 'local_ac', seats: 13, acType: 'AC', isUrbania: true, baseRate: 8000, extraKmRate: 37, extraHourRate: 500, status: 'Active' },
  { busId: 'local-ac-17', busType: '17 Seater', category: 'local_ac', seats: 17, acType: 'AC', isUrbania: false, baseRate: 7000, extraKmRate: 28, extraHourRate: 300, status: 'Active' },
  { busId: 'local-ac-17u', busType: '17 Seater Urbania', category: 'local_ac', seats: 17, acType: 'AC', isUrbania: true, baseRate: 8500, extraKmRate: 37, extraHourRate: 500, status: 'Active' },
  { busId: 'local-ac-20', busType: '20 Seater', category: 'local_ac', seats: 20, acType: 'AC', isUrbania: false, baseRate: 7500, extraKmRate: 30, extraHourRate: 300, status: 'Active' },
  { busId: 'local-ac-27', busType: '27 Seater', category: 'local_ac', seats: 27, acType: 'AC', isUrbania: false, baseRate: 9500, extraKmRate: 45, extraHourRate: 500, status: 'Active' },
  { busId: 'local-ac-35', busType: '35 Seater', category: 'local_ac', seats: 35, acType: 'AC', isUrbania: false, baseRate: 12000, extraKmRate: 55, extraHourRate: 700, status: 'Active' },
  { busId: 'local-ac-41', busType: '41 Seater', category: 'local_ac', seats: 41, acType: 'AC', isUrbania: false, baseRate: 14000, extraKmRate: 60, extraHourRate: 700, status: 'Active' },
  { busId: 'local-ac-45', busType: '45 Seater', category: 'local_ac', seats: 45, acType: 'AC', isUrbania: false, baseRate: 15000, extraKmRate: 65, extraHourRate: 800, status: 'Active' },

  // Local Non-AC
  { busId: 'local-nonac-17', busType: '17 Seater', category: 'local_nonac', seats: 17, acType: 'Non-AC', isUrbania: false, baseRate: 5500, extraKmRate: 22, extraHourRate: 300, status: 'Active' },
  { busId: 'local-nonac-20', busType: '20 Seater', category: 'local_nonac', seats: 20, acType: 'Non-AC', isUrbania: false, baseRate: 6000, extraKmRate: 25, extraHourRate: 300, status: 'Active' },
  { busId: 'local-nonac-32', busType: '32 Seater', category: 'local_nonac', seats: 32, acType: 'Non-AC', isUrbania: false, baseRate: 7500, extraKmRate: 33, extraHourRate: 500, status: 'Active' },
  { busId: 'local-nonac-35', busType: '35 Seater', category: 'local_nonac', seats: 35, acType: 'Non-AC', isUrbania: false, baseRate: 8000, extraKmRate: 36, extraHourRate: 500, status: 'Active' },
  { busId: 'local-nonac-40', busType: '40 Seater', category: 'local_nonac', seats: 40, acType: 'Non-AC', isUrbania: false, baseRate: 8500, extraKmRate: 41, extraHourRate: 500, status: 'Active' },
  { busId: 'local-nonac-45', busType: '45 Seater (2×2)', category: 'local_nonac', seats: 45, acType: 'Non-AC', isUrbania: false, baseRate: 10000, extraKmRate: 50, extraHourRate: 800, status: 'Active' },
  { busId: 'local-nonac-49', busType: '49 Seater (3×2)', category: 'local_nonac', seats: 49, acType: 'Non-AC', isUrbania: false, baseRate: 10000, extraKmRate: 49, extraHourRate: 800, status: 'Active' },

  // Outstation AC
  { busId: 'out-ac-13', busType: '13 Seater', category: 'outstation_ac', seats: 13, acType: 'AC', isUrbania: false, mumbaiRate: 10500, mahabaleshwarRate: 10500, extraKmRate: 24, specialPermit: 500, status: 'Active' },
  { busId: 'out-ac-13u', busType: '13 Seater Urbania', category: 'outstation_ac', seats: 13, acType: 'AC', isUrbania: true, mumbaiRate: 15000, mahabaleshwarRate: 10800, extraKmRate: 35, specialPermit: 500, status: 'Active' },
  { busId: 'out-ac-17', busType: '17 Seater', category: 'outstation_ac', seats: 17, acType: 'AC', isUrbania: false, mumbaiRate: 11500, mahabaleshwarRate: 11500, extraKmRate: 28, specialPermit: 500, status: 'Active' },
  { busId: 'out-ac-17u', busType: '17 Seater Urbania', category: 'outstation_ac', seats: 17, acType: 'AC', isUrbania: true, mumbaiRate: 15000, mahabaleshwarRate: 10800, extraKmRate: 36, specialPermit: 500, status: 'Active' },
  { busId: 'out-ac-20', busType: '20 Seater', category: 'outstation_ac', seats: 20, acType: 'AC', isUrbania: false, mumbaiRate: 12500, mahabaleshwarRate: 12500, extraKmRate: 30, specialPermit: 700, status: 'Active' },
  { busId: 'out-ac-27', busType: '27 Seater', category: 'outstation_ac', seats: 27, acType: 'AC', isUrbania: false, mumbaiRate: 17000, mahabaleshwarRate: 16000, extraKmRate: 45, specialPermit: 700, status: 'Active' },
  { busId: 'out-ac-35', busType: '35 Seater', category: 'outstation_ac', seats: 35, acType: 'AC', isUrbania: false, mumbaiRate: 21500, mahabaleshwarRate: 19500, extraKmRate: 55, specialPermit: 700, status: 'Active' },
  { busId: 'out-ac-41', busType: '41 Seater', category: 'outstation_ac', seats: 41, acType: 'AC', isUrbania: false, mumbaiRate: 24000, mahabaleshwarRate: 22000, extraKmRate: 60, specialPermit: 800, status: 'Active' },
  { busId: 'out-ac-45', busType: '45 Seater', category: 'outstation_ac', seats: 45, acType: 'AC', isUrbania: false, mumbaiRate: 26000, mahabaleshwarRate: 24000, extraKmRate: 65, specialPermit: 800, status: 'Active' },

  // Outstation Non-AC
  { busId: 'out-nonac-17', busType: '17 Seater', category: 'outstation_nonac', seats: 17, acType: 'Non-AC', isUrbania: false, mumbaiRate: 9000, mahabaleshwarRate: 8500, extraKmRate: 22, specialPermit: 500, status: 'Active' },
  { busId: 'out-nonac-20', busType: '20 Seater', category: 'outstation_nonac', seats: 20, acType: 'Non-AC', isUrbania: false, mumbaiRate: 10500, mahabaleshwarRate: 9500, extraKmRate: 25, specialPermit: 500, status: 'Active' },
  { busId: 'out-nonac-32', busType: '32 Seater', category: 'outstation_nonac', seats: 32, acType: 'Non-AC', isUrbania: false, mumbaiRate: 13500, mahabaleshwarRate: 12500, extraKmRate: 33, specialPermit: 700, status: 'Active' },
  { busId: 'out-nonac-35', busType: '35 Seater', category: 'outstation_nonac', seats: 35, acType: 'Non-AC', isUrbania: false, mumbaiRate: 14500, mahabaleshwarRate: 13500, extraKmRate: 36, specialPermit: 700, status: 'Active' },
  { busId: 'out-nonac-40', busType: '40 Seater', category: 'outstation_nonac', seats: 40, acType: 'Non-AC', isUrbania: false, mumbaiRate: 15500, mahabaleshwarRate: 14500, extraKmRate: 41, specialPermit: 700, status: 'Active' },
  { busId: 'out-nonac-45', busType: '45 Seater (2×2)', category: 'outstation_nonac', seats: 45, acType: 'Non-AC', isUrbania: false, mumbaiRate: 19000, mahabaleshwarRate: 18000, extraKmRate: 50, specialPermit: 800, status: 'Active' },
  { busId: 'out-nonac-49', busType: '49 Seater (3×2)', category: 'outstation_nonac', seats: 49, acType: 'Non-AC', isUrbania: false, mumbaiRate: 20000, mahabaleshwarRate: 17000, extraKmRate: 49, specialPermit: 800, status: 'Active' },

  // Urbania Per-Day
  { busId: 'urb-day-13', busType: '13 Seater Urbania', category: 'urbania_per_day', seats: 13, acType: 'AC', isUrbania: true, minKmPerDay: 300, acPerKmRate: 35, tollParkingDriverDA: 400, tollNote: '₹400 or Food Extra', status: 'Active' },
  { busId: 'urb-day-17', busType: '17 Seater Urbania', category: 'urbania_per_day', seats: 17, acType: 'AC', isUrbania: true, minKmPerDay: 300, acPerKmRate: 36, tollParkingDriverDA: 400, tollNote: '₹400 or Food Extra', status: 'Active' },

  // Urbania Local Package
  { busId: 'urb-local-13', busType: '13 Seater AC Urbania', category: 'urbania_local', seats: 13, acType: 'AC', isUrbania: true, packageRate: 8000, kmIncluded: 80, extraKmRate: 37, hoursIncluded: 8, extraHourRate: 500, status: 'Active' },
  { busId: 'urb-local-17', busType: '17 Seater AC Urbania', category: 'urbania_local', seats: 17, acType: 'AC', isUrbania: true, packageRate: 8500, kmIncluded: 80, extraKmRate: 37, hoursIncluded: 8, extraHourRate: 500, status: 'Active' },

  // Urbania Pune to Mumbai
  { busId: 'urb-mum-13', busType: '13 Seater AC Urbania', category: 'urbania_pune_mumbai', seats: 13, acType: 'AC', isUrbania: true, packageRate: 14000, kmIncluded: 350, extraKmRate: 38, tollParkingDriverDA: 400, tollNote: '₹400 or Food Extra', status: 'Active' },
  { busId: 'urb-mum-17', busType: '17 Seater AC Urbania', category: 'urbania_pune_mumbai', seats: 17, acType: 'AC', isUrbania: true, packageRate: 15000, kmIncluded: 350, extraKmRate: 38, tollParkingDriverDA: 400, tollNote: '₹400 or Food Extra', status: 'Active' },

  // Pune to Mumbai 5-Seater & 7-Seater Cab with Driver
  { busId: 'pune-mum-5s', busType: '5-Seater Sedan with Driver', category: 'urbania_pune_mumbai', seats: 5, acType: 'AC', isUrbania: false, packageRate: 3500, kmIncluded: 350, extraKmRate: 18, status: 'Active' },
  { busId: 'pune-mum-7s', busType: '7-Seater MPV with Driver', category: 'urbania_pune_mumbai', seats: 7, acType: 'AC', isUrbania: false, packageRate: 4500, kmIncluded: 350, extraKmRate: 22, status: 'Active' },
];


export async function getAllBuses(): Promise<IBusRate[]> {
  const count = await BusRate.countDocuments();
  if (count < DEFAULT_BUS_RATES.length) {
    console.log('[BusService] Syncing default bus rates into MongoDB database...');
    for (const busData of DEFAULT_BUS_RATES) {
      const exists = await BusRate.findOne({ busId: busData.busId });
      if (!exists) {
        await BusRate.create(busData);
      }
    }
  }
  return BusRate.find().sort({ category: 1, seats: 1 });
}


export async function getBusById(id: string): Promise<IBusRate | null> {
  await getAllBuses();
  return BusRate.findOne({ _id: id });
}

export async function createBus(data: Partial<IBusRate>): Promise<IBusRate> {
  const busId = data.busId || `bus-${Date.now()}`;
  const newBus = new BusRate({ ...data, busId });
  return newBus.save();
}

export async function updateBusRate(id: string, data: Partial<IBusRate>): Promise<IBusRate | null> {
  data.updatedAt = new Date();
  return BusRate.findByIdAndUpdate(id, { $set: data }, { new: true });
}

export async function deleteBus(id: string): Promise<boolean> {
  const res = await BusRate.findByIdAndDelete(id);
  return !!res;
}
