'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, 
  Bus, 
  Users, 
  Fuel, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Search, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  Check, 
  MapPin, 
  Calendar, 
  Clock, 
  Calculator, 
  BadgePercent,
  ChevronRight,
  Shield,
  Zap
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';
import BookingModal, { BookingModalItem } from '@/components/booking/BookingModal';
import { FLEET_VEHICLES, CarVehicle } from '@/constants/carsData';
import { fetchLiveFleetVehicles } from '@/services/fleet.service';
import { createRentalBookingWhatsAppUrl, AARAMBHA_HOTLINE_PHONE } from '@/utils/whatsapp';

export default function UnifiedRentalsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'self-drive' | 'urbania' | 'buses'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingItem, setSelectedBookingItem] = useState<BookingModalItem | null>(null);
  const [fleetList, setFleetList] = useState<CarVehicle[]>(FLEET_VEHICLES);
  
  // Quick Tariff Calculator State
  const [calcTripType, setCalcTripType] = useState<'local' | 'outstation'>('local');
  const [calcDays, setCalcDays] = useState(1);
  const [calcVehicleType, setCalcVehicleType] = useState<'hatchback' | 'suv' | 'urbania' | 'bus'>('suv');

  useEffect(() => {
    fetchLiveFleetVehicles().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setFleetList(data);
      }
    });
  }, []);

  // Urbania & Bus Specific Preset Data
  const urbaniaFleet = [
    {
      id: 'urbania-9s',
      name: 'Force Urbania Luxury (9 Seater)',
      category: 'Force Urbania',
      seats: '9+D Captain Seats',
      fuel: 'Diesel',
      rate: '₹32/km (Outstation) or ₹4,500/day',
      image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=800&auto=format&fit=crop',
      features: ['Reclining Pushback Seats', 'Individual AC Vents', 'Air Suspension Ride', 'USB Fast Chargers'],
      type: 'urbania'
    },
    {
      id: 'urbania-13s',
      name: 'Force Urbania Executive (13 Seater)',
      category: 'Force Urbania',
      seats: '13+D Executive Seats',
      fuel: 'Diesel',
      rate: '₹36/km (Outstation) or ₹5,500/day',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop',
      features: ['Panoramic View Windows', 'Rear Luggage Boot', 'Surround Sound Audio', 'LED Ambient Lighting'],
      type: 'urbania'
    },
    {
      id: 'urbania-17s',
      name: 'Force Urbania VIP Lounge (17 Seater)',
      category: 'Force Urbania',
      seats: '17+D Luxury Seating',
      fuel: 'Diesel',
      rate: '₹40/km (Outstation) or ₹6,800/day',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop',
      features: ['Ultra-wide legroom', 'Dual High-Capacity Chill AC', 'Mic & PA System', 'Premium Leather Upholstery'],
      type: 'urbania'
    },
  ];

  const busFleet = [
    {
      id: 'bus-25s',
      name: '25 Seater Luxury Tourist Coach',
      category: 'Luxury Bus',
      seats: '25+1 Pushback Seats',
      fuel: 'Diesel',
      rate: '₹42/km (Outstation local 8hr/80km: ₹7,000)',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
      features: ['2x2 Pushback Soft Seating', 'Roof Luggage Carrier', 'Air Suspension', 'Chilled Climate AC'],
      type: 'buses'
    },
    {
      id: 'bus-35s',
      name: '35 Seater Executive Cruiser',
      category: 'Luxury Bus',
      seats: '35+1 High-Deck Seats',
      fuel: 'Diesel',
      rate: '₹48/km (Outstation local 8hr/80km: ₹9,500)',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop',
      features: ['HD Entertainment Screen', 'Ample Underbelly Storage', 'Experienced Highway Captain', 'First Aid & GPS Tracking'],
      type: 'buses'
    },
    {
      id: 'bus-50s',
      name: '50-55 Seater Super Luxury Multi-Axle Coach',
      category: 'Luxury Bus',
      seats: '50-55 Pushback Seats',
      fuel: 'Diesel',
      rate: '₹60/km (Outstation weddings / pilgrimages)',
      image: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=800&auto=format&fit=crop',
      features: ['Dual LCD Screens', 'Individual Reading Lights', 'Emergency Exits & Fire Safety', 'Massive Luggage Capacity'],
      type: 'buses'
    },
  ];

  const filteredSelfDrive = fleetList.filter((car) =>
    car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Estimate calculation
  const getEstimatedCost = () => {
    let basePerDay = 2500;
    if (calcVehicleType === 'hatchback') basePerDay = 1800;
    if (calcVehicleType === 'suv') basePerDay = 3500;
    if (calcVehicleType === 'urbania') basePerDay = 5500;
    if (calcVehicleType === 'bus') basePerDay = 9000;

    const multiplier = calcTripType === 'outstation' ? 1.25 : 1.0;
    return Math.round(basePerDay * calcDays * multiplier);
  };

  return (
    <div className="min-h-screen bg-[#0E0F15] text-white flex flex-col font-sans selection:bg-[#FF3B30] selection:text-white">
      <Navbar vertical="fleet" />

      {/* ─── 1. LUXURY RENTAL HERO ─────────────────────────────────── */}
      <section className="relative pt-12 pb-20 px-6 lg:px-12 overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#141622] via-[#0E0F15] to-[#0A0B0E]">
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Unified Fleet Booking Portal</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-syne text-white max-w-4xl mx-auto leading-tight">
            Self-Drive Cars, Force Urbania & <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-300">Luxury Buses</span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Doorstep vehicle delivery in Pune, transparent per-KM billing, zero hidden charges, and sanitized top-tier vehicles for family trips, corporate commutes, and weddings.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4 text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-2xl font-extrabold text-white">50+</div>
              <div className="text-xs text-gray-400">Available Vehicles</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-2xl font-extrabold text-emerald-400">₹500</div>
              <div className="text-xs text-gray-400">Instant Advance Lock</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-2xl font-extrabold text-amber-400">4.9 ★</div>
              <div className="text-xs text-gray-400">Google Verified Rating</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-2xl font-extrabold text-red-400">24/7</div>
              <div className="text-xs text-gray-400">On-Road Assistance</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. TAB CONTROLS & SEARCH ─────────────────────────────── */}
      <section className="sticky top-[69px] z-40 bg-[#12131C]/95 backdrop-blur-xl border-b border-white/10 py-4 px-6 lg:px-12 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Segmented Filter Pills */}
          <div className="flex items-center bg-black/40 p-1.5 rounded-full border border-white/10 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeTab === 'all'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Fleets
            </button>
            <button
              onClick={() => setActiveTab('self-drive')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'self-drive'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Self-Drive Cars ({fleetList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('urbania')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'urbania'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Force Urbania (9-17s)</span>
            </button>
            <button
              onClick={() => setActiveTab('buses')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'buses'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              <span>Luxury Buses (20-55s)</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Thar, Fortuner, Urbania..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

        </div>
      </section>

      {/* ─── 3. VEHICLE CATALOGUE GRID ────────────────────────────── */}
      <section className="py-12 px-6 lg:px-12 flex-1 max-w-7xl mx-auto w-full space-y-12">

        {/* ─── 3A. SELF DRIVE CARS ─── */}
        {(activeTab === 'all' || activeTab === 'self-drive') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-bold font-syne text-white flex items-center gap-2">
                  <Car className="w-6 h-6 text-red-500" />
                  <span>Self-Drive Luxury Cars</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Zero security deposit options, unlimited KM packages, doorstep delivery.</p>
              </div>
              <span className="text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                {filteredSelfDrive.length} Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSelfDrive.map((car) => {
                const carPrice = car.pricePerDay || (car as any).price24h || 2200;
                const carImg = car.image || car.gallery?.[0] || (car as any).images?.[0] || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=800&auto=format&fit=crop';
                const fuel = car.specs?.fuelType || (car as any).fuel || 'Petrol';
                const seats = car.specs?.passengers || (car as any).seats || 5;
                const transmission = car.specs?.transmission || (car as any).transmission || 'Manual';

                const whatsappUrl = createRentalBookingWhatsAppUrl({
                  vehicleName: car.name,
                  category: 'self-drive',
                  tariffPerDay: carPrice,
                  pickupLocation: 'Pune, Maharashtra'
                });

                return (
                  <div
                    key={car.id}
                    className="rounded-2xl bg-[#151722] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-red-500/40 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 group"
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="relative h-48 bg-[#1B1D2C] overflow-hidden">
                        <img
                          src={carImg}
                          alt={car.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white border border-white/10">
                          {car.category}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-red-600 px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-lg">
                          ₹{carPrice}/day
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="font-syne text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                            {car.name}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                            <span className="flex items-center gap-1">
                              <Fuel className="w-3.5 h-3.5 text-gray-400" />
                              {fuel}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              {seats} Seats
                            </span>
                            <span>•</span>
                            <span>{transmission}</span>
                          </div>
                        </div>

                        {/* Specs / Features Pills */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                            {car.specs?.bodyType || 'Fastag Ready'}
                          </span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                            Zero Deposit
                          </span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                            Sanitized
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() =>
                          setSelectedBookingItem({
                            id: car.id,
                            title: car.name,
                            type: 'car',
                            price: carPrice,
                            deposit: 500,
                            image: carImg,
                          })
                        }
                        className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20"
                      >
                        <span>Book Online</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── 3B. FORCE URBANIA SECTION ─── */}
        {(activeTab === 'all' || activeTab === 'urbania') && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-bold font-syne text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-amber-400" />
                  <span>Force Urbania Luxury Executive Fleet (9 to 17 Seater)</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Ultra-luxury business class travel for corporate events, family getaways, and VIP airport transits.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {urbaniaFleet.map((van) => {
                const whatsappUrl = createRentalBookingWhatsAppUrl({
                  vehicleName: van.name,
                  category: 'urbania',
                  pickupLocation: 'Pune / Mumbai'
                });

                return (
                  <div
                    key={van.id}
                    className="rounded-2xl bg-[#151722] border border-amber-500/20 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div>
                      <div className="relative h-48 bg-[#1B1D2C] overflow-hidden">
                        <img
                          src={van.image}
                          alt={van.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-amber-500/90 text-black px-3 py-1 rounded-full text-[11px] font-extrabold">
                          {van.seats}
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="font-syne text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                            {van.name}
                          </h3>
                          <div className="text-xs font-semibold text-amber-300 mt-1">
                            {van.rate}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          {van.features.map((feat, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                              <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Reserve Urbania on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── 3C. LUXURY BUSES SECTION ─── */}
        {(activeTab === 'all' || activeTab === 'buses') && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-bold font-syne text-white flex items-center gap-2">
                  <Bus className="w-6 h-6 text-blue-400" />
                  <span>Luxury AC Tourist Buses (20 to 55 Seater)</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Spacious pushback AC coaches for wedding parties, pilgrimage yatras, and outstation tours.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {busFleet.map((bus) => {
                const whatsappUrl = createRentalBookingWhatsAppUrl({
                  vehicleName: bus.name,
                  category: 'bus',
                  pickupLocation: 'Pune, Maharashtra'
                });

                return (
                  <div
                    key={bus.id}
                    className="rounded-2xl bg-[#151722] border border-blue-500/20 overflow-hidden flex flex-col justify-between hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div>
                      <div className="relative h-48 bg-[#1B1D2C] overflow-hidden">
                        <img
                          src={bus.image}
                          alt={bus.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-[11px] font-extrabold">
                          {bus.seats}
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="font-syne text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                            {bus.name}
                          </h3>
                          <div className="text-xs font-semibold text-blue-300 mt-1">
                            {bus.rate}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          {bus.features.map((feat, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                              <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Get Custom Bus Quote</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── 4. TARIFF & ESTIMATOR CALCULATOR ───────────────────────── */}
        <section className="rounded-3xl bg-gradient-to-r from-[#171926] to-[#1F2233] border border-white/10 p-8 lg:p-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Calculator className="w-4 h-4" />
                <span>Instant Estimator</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-syne text-white">
                Trip Cost & Tariff Calculator
              </h3>
              <p className="text-xs text-gray-400 mt-1">Get an instant realistic estimation before talking to our desk.</p>
            </div>

            <div className="text-right bg-white/5 p-4 rounded-2xl border border-white/10 shrink-0">
              <div className="text-xs text-gray-400">Estimated Total Rate</div>
              <div className="text-3xl font-extrabold text-white font-syne">
                ₹{getEstimatedCost().toLocaleString('en-IN')}*
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold">*Excludes tolls & state taxes</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            {/* Trip Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">Trip Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCalcTripType('local')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    calcTripType === 'local'
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  Local Pune
                </button>
                <button
                  onClick={() => setCalcTripType('outstation')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    calcTripType === 'outstation'
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  Outstation
                </button>
              </div>
            </div>

            {/* Vehicle Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">Vehicle Category</label>
              <select
                value={calcVehicleType}
                onChange={(e) => setCalcVehicleType(e.target.value as any)}
                className="w-full py-2.5 px-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="hatchback" className="bg-[#151722]">Hatchback / Sedan (WagonR, Swift, Baleno)</option>
                <option value="suv" className="bg-[#151722]">SUV & 4x4 (Thar, Fortuner, Scorpio)</option>
                <option value="urbania" className="bg-[#151722]">Force Urbania (9 to 17 Seater)</option>
                <option value="bus" className="bg-[#151722]">Luxury Tourist Bus (25 to 55 Seater)</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300">Duration (Days): {calcDays}</label>
              <input
                type="range"
                min="1"
                max="15"
                value={calcDays}
                onChange={(e) => setCalcDays(parseInt(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>1 Day</span>
                <span>7 Days</span>
                <span>15 Days</span>
              </div>
            </div>
          </div>
        </section>

      </section>

      {/* ─── 5. BOOKING MODAL ─────────────────────────────────────── */}
      {selectedBookingItem && (
        <BookingModal
          item={selectedBookingItem}
          isOpen={true}
          onClose={() => setSelectedBookingItem(null)}
        />
      )}

      {/* ─── 6. TERMS & FOOTER ────────────────────────────────────── */}
      <TermsConditionsSection />
      <Footer />
    </div>
  );
}
