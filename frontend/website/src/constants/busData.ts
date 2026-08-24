// ─────────────────────────────────────────────────────────────────────────────
// Bus Rentals — Pricing Data, Types & Carousel Images
// Tables A–G from the client's official rate card + rules/guidelines
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ────────────────────────────────────────────────────────────────────

export interface LocalBusRate {
  id: string;
  busType: string;
  seats: number;
  baseRate: number;       // 8 Hrs / 80 KM included
  extraKmRate: number;
  extraHourRate: number;
  isUrbania?: boolean;
  acType: 'AC' | 'Non-AC';
}

export interface OutstationPackageRate {
  id: string;
  busType: string;
  seats: number;
  mumbaiRate: number;           // Mumbai up to 350 KM
  mahabaleshwarRate: number;    // Mahabaleshwar up to 300 KM
  extraKmRate: number;
  specialPermit: number;
  acType: 'AC' | 'Non-AC';
  isUrbania?: boolean;
}

export interface UrbaniaPerDayRate {
  id: string;
  busType: string;
  seats: number;
  minKmPerDay: number;
  acPerKmRate: number;
  tollParkingDriverDA: number;
  tollNote: string;
}

export interface UrbaniaLocalPackage {
  id: string;
  busType: string;
  seats: number;
  packageRate: number;
  kmIncluded: number;
  extraKmRate: number;
  hoursIncluded: number;
  extraHourRate: number;
}

export interface UrbaniaPuneMumbai {
  id: string;
  busType: string;
  seats: number;
  packageRate: number;
  kmIncluded: number;
  extraKmRate: number;
  tollParkingDriverDA: number;
  tollNote: string;
}

export interface BusCarouselImage {
  src: string;
  alt: string;
  label: string;
}

// ── Table A: Local AC Bus Rates (8 Hrs / 80 KM included) ────────────────────

export const LOCAL_AC_RATES: LocalBusRate[] = [
  { id: 'local-ac-13', busType: '13 Seater', seats: 13, baseRate: 6000, extraKmRate: 24, extraHourRate: 300, acType: 'AC' },
  { id: 'local-ac-13u', busType: '13 Seater Urbania', seats: 13, baseRate: 8000, extraKmRate: 37, extraHourRate: 500, isUrbania: true, acType: 'AC' },
  { id: 'local-ac-17', busType: '17 Seater', seats: 17, baseRate: 7000, extraKmRate: 28, extraHourRate: 300, acType: 'AC' },
  { id: 'local-ac-17u', busType: '17 Seater Urbania', seats: 17, baseRate: 8500, extraKmRate: 37, extraHourRate: 500, isUrbania: true, acType: 'AC' },
  { id: 'local-ac-20', busType: '20 Seater', seats: 20, baseRate: 7500, extraKmRate: 30, extraHourRate: 300, acType: 'AC' },
  { id: 'local-ac-27', busType: '27 Seater', seats: 27, baseRate: 9500, extraKmRate: 45, extraHourRate: 500, acType: 'AC' },
  { id: 'local-ac-35', busType: '35 Seater', seats: 35, baseRate: 12000, extraKmRate: 55, extraHourRate: 700, acType: 'AC' },
  { id: 'local-ac-41', busType: '41 Seater', seats: 41, baseRate: 14000, extraKmRate: 60, extraHourRate: 700, acType: 'AC' },
  { id: 'local-ac-45', busType: '45 Seater', seats: 45, baseRate: 15000, extraKmRate: 65, extraHourRate: 800, acType: 'AC' },
];

// ── Table B: Local Non-AC Bus Rates (8 Hrs / 80 KM included) ────────────────

export const LOCAL_NON_AC_RATES: LocalBusRate[] = [
  { id: 'local-nonac-17', busType: '17 Seater', seats: 17, baseRate: 5500, extraKmRate: 22, extraHourRate: 300, acType: 'Non-AC' },
  { id: 'local-nonac-20', busType: '20 Seater', seats: 20, baseRate: 6000, extraKmRate: 25, extraHourRate: 300, acType: 'Non-AC' },
  { id: 'local-nonac-32', busType: '32 Seater', seats: 32, baseRate: 7500, extraKmRate: 33, extraHourRate: 500, acType: 'Non-AC' },
  { id: 'local-nonac-35', busType: '35 Seater', seats: 35, baseRate: 8000, extraKmRate: 36, extraHourRate: 500, acType: 'Non-AC' },
  { id: 'local-nonac-40', busType: '40 Seater', seats: 40, baseRate: 8500, extraKmRate: 41, extraHourRate: 500, acType: 'Non-AC' },
  { id: 'local-nonac-45', busType: '45 Seater (2×2)', seats: 45, baseRate: 10000, extraKmRate: 50, extraHourRate: 800, acType: 'Non-AC' },
  { id: 'local-nonac-49', busType: '49 Seater (3×2)', seats: 49, baseRate: 10000, extraKmRate: 49, extraHourRate: 800, acType: 'Non-AC' },
];

// ── Table C: Outstation AC Bus & Tempo Traveller Rates ───────────────────────
// (Mumbai up to 350 KM / Mahabaleshwar up to 300 KM)

export const OUTSTATION_AC_RATES: OutstationPackageRate[] = [
  { id: 'out-ac-13', busType: '13 Seater', seats: 13, mumbaiRate: 10500, mahabaleshwarRate: 10500, extraKmRate: 24, specialPermit: 500, acType: 'AC' },
  { id: 'out-ac-13u', busType: '13 Seater Urbania', seats: 13, mumbaiRate: 15000, mahabaleshwarRate: 10800, extraKmRate: 35, specialPermit: 500, acType: 'AC', isUrbania: true },
  { id: 'out-ac-17', busType: '17 Seater', seats: 17, mumbaiRate: 11500, mahabaleshwarRate: 11500, extraKmRate: 28, specialPermit: 500, acType: 'AC' },
  { id: 'out-ac-17u', busType: '17 Seater Urbania', seats: 17, mumbaiRate: 15000, mahabaleshwarRate: 10800, extraKmRate: 36, specialPermit: 500, acType: 'AC', isUrbania: true },
  { id: 'out-ac-20', busType: '20 Seater', seats: 20, mumbaiRate: 12500, mahabaleshwarRate: 12500, extraKmRate: 30, specialPermit: 700, acType: 'AC' },
  { id: 'out-ac-27', busType: '27 Seater', seats: 27, mumbaiRate: 17000, mahabaleshwarRate: 16000, extraKmRate: 45, specialPermit: 700, acType: 'AC' },
  { id: 'out-ac-35', busType: '35 Seater', seats: 35, mumbaiRate: 21500, mahabaleshwarRate: 19500, extraKmRate: 55, specialPermit: 700, acType: 'AC' },
  { id: 'out-ac-41', busType: '41 Seater', seats: 41, mumbaiRate: 24000, mahabaleshwarRate: 22000, extraKmRate: 60, specialPermit: 800, acType: 'AC' },
  { id: 'out-ac-45', busType: '45 Seater', seats: 45, mumbaiRate: 26000, mahabaleshwarRate: 24000, extraKmRate: 65, specialPermit: 800, acType: 'AC' },
];

// ── Table D: Outstation Non-AC Bus & Tempo Traveller Rates ───────────────────
// (Mumbai up to 350 KM / Mahabaleshwar up to 300 KM)

export const OUTSTATION_NON_AC_RATES: OutstationPackageRate[] = [
  { id: 'out-nonac-17', busType: '17 Seater', seats: 17, mumbaiRate: 9000, mahabaleshwarRate: 8500, extraKmRate: 22, specialPermit: 500, acType: 'Non-AC' },
  { id: 'out-nonac-20', busType: '20 Seater', seats: 20, mumbaiRate: 10500, mahabaleshwarRate: 9500, extraKmRate: 25, specialPermit: 500, acType: 'Non-AC' },
  { id: 'out-nonac-32', busType: '32 Seater', seats: 32, mumbaiRate: 13500, mahabaleshwarRate: 12500, extraKmRate: 33, specialPermit: 700, acType: 'Non-AC' },
  { id: 'out-nonac-35', busType: '35 Seater', seats: 35, mumbaiRate: 14500, mahabaleshwarRate: 13500, extraKmRate: 36, specialPermit: 700, acType: 'Non-AC' },
  { id: 'out-nonac-40', busType: '40 Seater', seats: 40, mumbaiRate: 15500, mahabaleshwarRate: 14500, extraKmRate: 41, specialPermit: 700, acType: 'Non-AC' },
  { id: 'out-nonac-45', busType: '45 Seater (2×2)', seats: 45, mumbaiRate: 19000, mahabaleshwarRate: 18000, extraKmRate: 50, specialPermit: 800, acType: 'Non-AC' },
  { id: 'out-nonac-49', busType: '49 Seater (3×2)', seats: 49, mumbaiRate: 20000, mahabaleshwarRate: 17000, extraKmRate: 49, specialPermit: 800, acType: 'Non-AC' },
];

// ── Table E: Urbania Per-Day Outstation Rates (300 KM minimum/day) ───────────

export const URBANIA_PER_DAY_RATES: UrbaniaPerDayRate[] = [
  { id: 'urb-day-13', busType: '13 Seater Urbania', seats: 13, minKmPerDay: 300, acPerKmRate: 35, tollParkingDriverDA: 400, tollNote: '₹400 or Food Extra' },
  { id: 'urb-day-17', busType: '17 Seater Urbania', seats: 17, minKmPerDay: 300, acPerKmRate: 36, tollParkingDriverDA: 400, tollNote: '₹400 or Food Extra' },
];

// ── Table F: Urbania Pune Local Package (80 KM / 8 Hours minimum) ────────────

export const URBANIA_LOCAL_PACKAGE: UrbaniaLocalPackage[] = [
  { id: 'urb-local-13', busType: '13 Seater AC Urbania', seats: 13, packageRate: 8000, kmIncluded: 80, extraKmRate: 37, hoursIncluded: 8, extraHourRate: 500 },
  { id: 'urb-local-17', busType: '17 Seater AC Urbania', seats: 17, packageRate: 8500, kmIncluded: 80, extraKmRate: 37, hoursIncluded: 8, extraHourRate: 500 },
];

// ── Table G: Urbania Pune to Mumbai (350 KM/day minimum) ─────────────────────

export const URBANIA_PUNE_MUMBAI: UrbaniaPuneMumbai[] = [
  { id: 'urb-mum-13', busType: '13 Seater AC Urbania', seats: 13, packageRate: 14000, kmIncluded: 350, extraKmRate: 38, tollParkingDriverDA: 400, tollNote: '₹400 or Food Extra' },
  { id: 'urb-mum-17', busType: '17 Seater AC Urbania', seats: 17, packageRate: 15000, kmIncluded: 350, extraKmRate: 38, tollParkingDriverDA: 400, tollNote: '₹400 or Food Extra' },
];

// ── Table H: Pune to Mumbai 5-Seater & 7-Seater Cab with Driver ───────────────

export interface PuneMumbaiCabPackage {
  id: string;
  busType: string;
  seats: number;
  packageRate: number;
  kmIncluded: number;
  extraKmRate: number;
  acType: 'AC';
  description: string;
}

export const PUNE_MUMBAI_CAB_PACKAGES: PuneMumbaiCabPackage[] = [
  { id: 'pune-mum-5s', busType: '5-Seater Sedan with Driver', seats: 5, packageRate: 3500, kmIncluded: 350, extraKmRate: 18, acType: 'AC', description: 'Pune → Mumbai / Airport drop in comfortable 5-seater AC Sedan (Dzire / Etios)' },
  { id: 'pune-mum-7s', busType: '7-Seater MPV with Driver', seats: 7, packageRate: 4500, kmIncluded: 350, extraKmRate: 22, acType: 'AC', description: 'Pune → Mumbai / Airport drop in spacious 7-seater AC MPV (Ertiga / Rumion)' },
];


// ── Rules & Guidelines ───────────────────────────────────────────────────────

export const BUS_RULES_AND_GUIDELINES: string[] = [
  'Driver allowance charged extra.',
  'Cab/bus running is limited to 300 KM per day.',
  'Time starts 6:00 AM to 10:00 PM; night charges apply from 12:00 AM to 6:00 AM, extra charges apply after 10:00 PM.',
  'Time and KM are calculated from office to office.',
  'Interstate taxes, toll taxes, parking, and service tax are charged as actuals.',
  'Extra charges apply for extra KM and extra hours.',
  'Government taxes charged as per government rules.',
  'Quoted prices are based on current fuel prices; any fuel price hike will result in a variation in rates.',
];

export const BUS_CAROUSEL_IMAGES: BusCarouselImage[] = [
  { src: '/images/bus_rental_client_hero.jpg', alt: 'Aarambha Premium Bus Rental Fleet', label: 'Luxury Bus Fleet' },
  { src: '/images/fleet/bus_25_seater.jpg', alt: '25-Seater Luxury Bus', label: '25-Seater Bus' },
  { src: '/images/fleet/bus_35_seater.jpg', alt: '35-Seater AC Coach', label: '35-Seater Coach' },
  { src: '/images/fleet/bus_45_seater.jpg', alt: '45-Seater Premium Bus', label: '45-Seater Bus' },
  { src: '/images/fleet/bus_urbania.jpg', alt: 'Force Urbania Tempo Traveller', label: 'Urbania' },
];

// ── Contact Info for Bus Rentals ───────────────────────────────────────────

export const SHARED_BUS_CONTACT = {
  callPhone: '9067617451',
  callPhoneDisplay: '+91 90676 17451',
  whatsappPhone: '9021878717',
  whatsappPhoneDisplay: '+91 90218 78717',
  address: 'Green Hills Society, Near Mastan Hotel, Mangdewadi, Katraj, Pune - 411046, Maharashtra',
};
