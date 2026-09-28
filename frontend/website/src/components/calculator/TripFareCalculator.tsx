'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calculator, MapPin, Calendar, Users, Fuel, ShieldCheck, 
  ArrowRight, MessageSquare, Sparkles, CheckCircle2, Info, ChevronDown
} from 'lucide-react';

interface RoutePreset {
  id: string;
  name: string;
  roundTripKm: number;
  recommendedDays: number;
  badge?: string;
  description: string;
}

const POPULAR_ROUTES: RoutePreset[] = [
  {
    id: 'shirdi',
    name: 'Pune ↔ Shirdi & Shani Shingnapur',
    roundTripKm: 450,
    recommendedDays: 2,
    badge: 'Most Popular Yatra',
    description: 'Sai Baba Samadhi Mandir darshan, Shani Shingnapur temple visit.'
  },
  {
    id: 'mahabaleshwar',
    name: 'Pune ↔ Mahabaleshwar & Panchgani',
    roundTripKm: 260,
    recommendedDays: 2,
    badge: 'Weekend Hillstation',
    description: 'Scenic ghat roads, Venna Lake, Pratapgad Fort & strawberry farms.'
  },
  {
    id: 'goa',
    name: 'Pune ↔ North/South Goa Roadtrip',
    roundTripKm: 950,
    recommendedDays: 4,
    badge: 'Beach Vacation',
    description: 'Comfortable coastal highway cruise via Amboli Ghat with luggage room.'
  },
  {
    id: 'jyotirlinga',
    name: 'Pune ↔ 3 Jyotirlinga (Trimbak - Grishneshwar - Bhimashankar)',
    roundTripKm: 850,
    recommendedDays: 3,
    badge: 'Sacred Pilgrimage',
    description: 'Nashik Trimbakeshwar, Aurangabad Grishneshwar, and Bhimashankar.'
  },
  {
    id: 'ashtavinayak',
    name: 'Pune ↔ Complete Ashtavinayak (8 Ganpati Temples)',
    roundTripKm: 750,
    recommendedDays: 3,
    badge: 'Devotional Circuit',
    description: 'Mayureshwar, Siddhivinayak, Ballaleshwar, Varadvinayak, Chintamani, Girijatmaj, Vighnahar, Mahaganapati.'
  },
  {
    id: 'lonavala',
    name: 'Pune ↔ Lonavala & Khandala Day Trip',
    roundTripKm: 160,
    recommendedDays: 1,
    badge: 'Day Picnic',
    description: 'Tiger Point, Bhushi Dam, Karla Caves & expressway drive.'
  },
  {
    id: 'custom',
    name: 'Custom Destination / Custom Route',
    roundTripKm: 300,
    recommendedDays: 1,
    description: 'Specify your own custom kilometers and number of travel days.'
  }
];

interface FleetOption {
  id: string;
  name: string;
  category: string;
  seats: number;
  ratePerKm: number;
  minKmPerDay: number;
  driverAllowancePerDay: number;
  image: string;
  highlight: string;
}

const FLEET_OPTIONS: FleetOption[] = [
  {
    id: 'urbania-13',
    name: 'Force Urbania (13-Seater VIP)',
    category: 'VIP Recliner Van',
    seats: 13,
    ratePerKm: 35,
    minKmPerDay: 300,
    driverAllowancePerDay: 500,
    image: '/images/urbania_fleet.jpg',
    highlight: 'Plush Captain Seats, Individual AC Vents & Panoramic Windows'
  },
  {
    id: 'urbania-17',
    name: 'Force Urbania (17-Seater Luxury)',
    category: 'Executive Coach',
    seats: 17,
    ratePerKm: 36,
    minKmPerDay: 300,
    driverAllowancePerDay: 500,
    image: '/images/urbania_fleet.jpg',
    highlight: 'Full Airplane-style Reading Lights, Quiet Cabin & Massive Boot'
  },
  {
    id: 'traveller-20',
    name: '20-Seater Tempo Traveller',
    category: 'Mini Tourist Bus',
    seats: 20,
    ratePerKm: 32,
    minKmPerDay: 300,
    driverAllowancePerDay: 500,
    image: '/images/hero_luxury_fleet.jpg',
    highlight: 'Cost-Effective Group Travel, 2x1 Pushback Seating & LED TV'
  },
  {
    id: 'coach-32',
    name: '32-Seater Luxury AC Coach',
    category: 'Commercial Bus',
    seats: 32,
    ratePerKm: 45,
    minKmPerDay: 300,
    driverAllowancePerDay: 600,
    image: '/images/luxury_fleet_vehicles.jpg',
    highlight: 'Air Suspension, Large Luggage Bays & Highway Comfort'
  },
  {
    id: 'coach-50',
    name: '50-Seater Grand Tourist Coach',
    category: 'Large Fleet Coach',
    seats: 50,
    ratePerKm: 65,
    minKmPerDay: 300,
    driverAllowancePerDay: 800,
    image: '/images/luxury_fleet_vehicles.jpg',
    highlight: 'Ideal for Weddings, Corporate Outings & Mass Yatras'
  }
];

export default function TripFareCalculator() {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('shirdi');
  const [customKm, setCustomKm] = useState<number>(300);
  const [days, setDays] = useState<number>(2);
  const [selectedFleetId, setSelectedFleetId] = useState<string>('urbania-17');
  const [pickupCity, setPickupCity] = useState<string>('Pune (Any Location)');

  const selectedRoute = useMemo(() => {
    return POPULAR_ROUTES.find(r => r.id === selectedRouteId) || POPULAR_ROUTES[0];
  }, [selectedRouteId]);

  const selectedFleet = useMemo(() => {
    return FLEET_OPTIONS.find(f => f.id === selectedFleetId) || FLEET_OPTIONS[1];
  }, [selectedFleetId]);

  // Total Actual Kilometers
  const actualKm = selectedRouteId === 'custom' ? customKm : selectedRoute.roundTripKm;

  // Commercial Minimum Billing Rule: Math.max(actualKm, days * minKmPerDay)
  const minimumBillableKm = days * selectedFleet.minKmPerDay;
  const billableKm = Math.max(actualKm, minimumBillableKm);

  // Fare Computations
  const runningFare = billableKm * selectedFleet.ratePerKm;
  const driverBatta = days * selectedFleet.driverAllowancePerDay;
  const nightHalt = days > 1 ? (days - 1) * 300 : 0;
  const estimatedTollTaxes = Math.round(actualKm * 2.2); // Typical Maharashtra toll estimate ~₹2-2.5/km
  const totalEstimatedCost = runningFare + driverBatta + nightHalt;
  const perPersonCost = Math.round(totalEstimatedCost / selectedFleet.seats);

  // WhatsApp Pre-filled message
  const handleWhatsAppQuote = () => {
    const routeName = selectedRouteId === 'custom' ? `Custom Route (${customKm} Km)` : selectedRoute.name;
    const msg = 
      `*Aarambha Travels — Instant Trip Fare Quote Request*\n\n` +
      `📍 *Route:* ${routeName}\n` +
      `🏙️ *Pickup:* ${pickupCity}\n` +
      `🚐 *Vehicle:* ${selectedFleet.name} (${selectedFleet.seats} Seats)\n` +
      `⏱️ *Duration:* ${days} Day${days > 1 ? 's' : ''}\n` +
      `📏 *Estimated Distance:* ${actualKm} km (Billable: ${billableKm} km @ ₹${selectedFleet.ratePerKm}/km)\n` +
      `--------------------------------\n` +
      `💰 *Estimated Total:* ~₹${totalEstimatedCost.toLocaleString('en-IN')}\n` +
      `👥 *Per-Person Cost:* ~₹${perPersonCost.toLocaleString('en-IN')} (for ${selectedFleet.seats} pax)\n` +
      `--------------------------------\n` +
      `Please confirm vehicle availability and final all-inclusive package pricing.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/919067617451?text=${encoded}`, '_blank');
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-[#EDE2D0] shadow-xl p-6 sm:p-8 lg:p-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE2D0]/70 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8EFEA] border border-[#E8B9A5]/60 text-xs font-bold text-[#C65A2E] mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Instant Fare & Distance Estimator</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3B2E27]">
            Transparent Trip Quote Calculator
          </h2>
          <p className="text-xs sm:text-sm text-[#756B63] mt-1 max-w-xl">
            Get instant, honest pricing for Force Urbania & luxury coaches with driver allowance and minimum billing transparency.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#FCFAF6] border border-[#EDE2D0] p-3 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-xs">
            100%
          </div>
          <div>
            <span className="text-xs font-bold text-[#3B2E27] block">Zero Hidden Tariffs</span>
            <span className="text-[11px] text-[#756B63]">Commercial Permits & GST Invoice</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Destination / Route Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#493B34] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C65A2E]" />
              <span>Select Destination / Pilgrimage Circuit</span>
            </label>
            <div className="relative">
              <select
                value={selectedRouteId}
                onChange={(e) => {
                  setSelectedRouteId(e.target.value);
                  const matched = POPULAR_ROUTES.find(r => r.id === e.target.value);
                  if (matched && e.target.value !== 'custom') {
                    setDays(matched.recommendedDays);
                  }
                }}
                className="w-full h-12 pl-4 pr-10 bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl text-sm font-semibold text-[#3B2E27] focus:outline-none focus:border-[#C65A2E] focus:ring-2 focus:ring-[#C65A2E]/10 cursor-pointer appearance-none transition-all"
              >
                {POPULAR_ROUTES.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.name} ({route.roundTripKm} Km approx)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#756B63] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {selectedRouteId !== 'custom' ? (
              <p className="text-xs text-[#756B63] italic pl-1">
                ℹ️ {selectedRoute.description}
              </p>
            ) : (
              <div className="pt-2">
                <label className="text-xs font-semibold text-[#756B63] block mb-1">
                  Enter Estimated Round-Trip Kilometers:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="100"
                    max="2500"
                    step="50"
                    value={customKm}
                    onChange={(e) => setCustomKm(Number(e.target.value))}
                    className="flex-1 accent-[#C65A2E] cursor-pointer"
                  />
                  <div className="w-24 text-center font-bold text-sm bg-[#FCFAF6] border border-[#EDE2D0] py-1.5 rounded-lg text-[#3B2E27]">
                    {customKm} KM
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Vehicle Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#493B34] uppercase tracking-wider flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-[#C65A2E]" />
              <span>Select Fleet Vehicle</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FLEET_OPTIONS.map(fleet => (
                <div
                  key={fleet.id}
                  onClick={() => setSelectedFleetId(fleet.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedFleetId === fleet.id
                      ? 'bg-[#F8EFEA] border-[#C65A2E] shadow-sm'
                      : 'bg-[#FCFAF6] border-[#EDE2D0] hover:border-[#E8B9A5]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-[#3B2E27]">{fleet.name}</h4>
                      <span className="text-[11px] text-[#756B63] block">{fleet.category}</span>
                    </div>
                    <span className="text-xs font-black text-[#C65A2E] bg-white px-2 py-0.5 rounded-md border border-[#E8B9A5]">
                      ₹{fleet.ratePerKm}/km
                    </span>
                  </div>
                  <p className="text-[11px] text-[#756B63] mt-2 line-clamp-1">
                    {fleet.highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Duration & Pickup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#493B34] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C65A2E]" />
                <span>Trip Duration</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      days === d
                        ? 'bg-[#C65A2E] text-white shadow-xs'
                        : 'bg-[#FCFAF6] border border-[#EDE2D0] text-[#493B34] hover:bg-[#F8EFEA]'
                    }`}
                  >
                    {d} Day{d > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#493B34] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C65A2E]" />
                <span>Boarding Hub</span>
              </label>
              <div className="relative">
                <select
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  className="w-full h-10 pl-3 pr-8 bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl text-xs font-semibold text-[#3B2E27] focus:outline-none focus:border-[#C65A2E] cursor-pointer appearance-none"
                >
                  <option value="Pune (Swargate / Shivaji Nagar)">Pune (Swargate / Shivaji Nagar)</option>
                  <option value="Pune (Wakad / Hinjewadi / Baner)">Pune (Wakad / Hinjewadi / Baner)</option>
                  <option value="Pune (Viman Nagar / Airport / Kharadi)">Pune (Viman Nagar / Airport)</option>
                  <option value="Pune (PCMC / Nigdi / Bhosari)">Pune (PCMC / Nigdi / Bhosari)</option>
                  <option value="Mumbai (Dadar / Thane / Navi Mumbai)">Mumbai (Dadar / Thane / Navi Mumbai)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#756B63] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

        </div>

        {/* Right Output Quotation Card (5 Cols) */}
        <div className="lg:col-span-5 bg-[#FCFAF6] rounded-2xl border border-[#EDE2D0] p-6 sm:p-7 flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE2D0]">
              <span className="text-xs font-bold text-[#756B63] uppercase tracking-wider">Estimated Fare Summary</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Commercial Permit Fleet
              </span>
            </div>

            {/* Price Large Display */}
            <div className="mt-4 mb-4 text-center bg-white p-4 rounded-2xl border border-[#EDE2D0] shadow-xs">
              <span className="text-xs text-[#756B63] block font-medium">Estimated Total Trip Fare</span>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-[#C65A2E] mt-1">
                ₹{totalEstimatedCost.toLocaleString('en-IN')}
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mt-2 border border-emerald-200">
                <Users className="w-3.5 h-3.5" />
                <span>Just ₹{perPersonCost.toLocaleString('en-IN')} / person ({selectedFleet.seats} seats)</span>
              </div>
            </div>

            {/* Line Item Breakdown */}
            <div className="space-y-2.5 text-xs text-[#5D5047] border-t border-[#EDE2D0] pt-4">
              <div className="flex justify-between items-center">
                <span>Distance Calculation:</span>
                <span className="font-semibold text-[#3B2E27]">
                  {actualKm} km (Billable: {billableKm} km)
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Base Running Fare (@ ₹{selectedFleet.ratePerKm}/km):</span>
                <span className="font-semibold text-[#3B2E27]">
                  ₹{runningFare.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Driver Daily Batta ({days} days @ ₹{selectedFleet.driverAllowancePerDay}):</span>
                <span className="font-semibold text-[#3B2E27]">
                  ₹{driverBatta.toLocaleString('en-IN')}
                </span>
              </div>

              {nightHalt > 0 && (
                <div className="flex justify-between items-center">
                  <span>Night Halt Allowance ({days - 1} night):</span>
                  <span className="font-semibold text-[#3B2E27]">
                    ₹{nightHalt.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-[11px] text-[#756B63] pt-2 border-t border-dashed border-[#EDE2D0]">
                <span>Toll &amp; Parking (Paid on Actuals):</span>
                <span>~₹{estimatedTollTaxes.toLocaleString('en-IN')} (approx)</span>
              </div>
            </div>

            {/* Commercial Minimum Notice */}
            {minimumBillableKm > actualKm && (
              <div className="mt-4 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  Standard commercial rule: Minimum 300 km/day applies ({days * 300} km billed).
                </span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleWhatsAppQuote}
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Get Instant WhatsApp Quote</span>
            </button>

            <a
              href={`/bus-rentals#vehicles`}
              className="w-full py-3 px-4 rounded-xl bg-[#C65A2E] hover:bg-[#B24E25] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-center"
            >
              <span>Reserve {selectedFleet.name} Online</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
