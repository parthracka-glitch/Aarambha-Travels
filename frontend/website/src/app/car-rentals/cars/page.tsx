'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Car, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';
import { FLEET_VEHICLES, SIDEBAR_POPULAR_CARS, CATEGORIES_LIST, TAGS_LIST, CarVehicle } from '@/constants/carsData';
import { fetchLiveFleetVehicles } from '@/services/fleet.service';

export default function CarsCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeCarId, setActiveCarId] = useState('wagonr-vxi-2025');
  const [carsList, setCarsList] = useState<CarVehicle[]>(FLEET_VEHICLES);

  useEffect(() => {
    fetchLiveFleetVehicles().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setCarsList(data);
      }
    });
  }, []);

  const filteredCars = carsList.filter((car) => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? car.category.toLowerCase() === selectedCategory.toLowerCase() : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#493B34] flex flex-col font-sans">
      
      <Navbar vertical="fleet" />

      {/* ─── 1. BREADCRUMB & HEADER BANNER ─────────────────────────── */}
      <section className="relative pt-24 pb-12 bg-[#2D1F18] text-white border-b border-[#EDE2D0]/20 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/luxury_fleet_vehicles.jpg"
            alt="Self-Drive Cars Background"
            className="w-full h-full object-cover opacity-35 filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D1F18] via-[#2D1F18]/70 to-[#2D1F18]/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-center">
          
          <div className="text-xs font-bold text-[#E8B9A5] uppercase tracking-wider">
            Home / Self-Drive Cars
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Verified Self-Drive Fleet
          </h1>

          <p className="text-xs sm:text-sm text-[#EDE2D0]/90 max-w-xl mx-auto">
            Unlimited kilometers, sanitized hatchbacks, sedans, and 7-seater SUVs available with instant doorstep delivery in Pune.
          </p>

        </div>
      </section>

      {/* ─── 2. SEARCH & SORTING FILTER BAR ───────────────────────── */}
      <section className="py-4 bg-white border-b border-[#EDE2D0] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="text-[#756B63] font-medium">
            Showing {filteredCars.length} available self-drive vehicles
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search car model (e.g. Swift, Ertiga, Scorpio)..."
                className="w-full bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl px-3.5 py-2 pr-8 text-xs text-[#493B34] placeholder:text-[#756B63]/60 focus:outline-none focus:border-[#C65A2E] focus:bg-white transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#756B63] absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

        </div>
      </section>

      {/* ─── 3. CATALOG GRID & SIDEBAR SECTION ────────────────────── */}
      <section className="py-12 bg-[#FCFAF6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 9-Car Grid */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCars.slice(0, 9).map((car) => {
                  const isActive = car.id === activeCarId;
                  return (
                    <div
                      key={car.id}
                      onClick={() => setActiveCarId(car.id)}
                      className={`rounded-2xl bg-white overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-2xs ${
                        isActive
                          ? 'border-2 border-[#C65A2E] shadow-md'
                          : 'border border-[#EDE2D0] hover:border-[#E8B9A5] hover:shadow-sm'
                      }`}
                    >
                      {/* Clean Studio Image Header */}
                      <div className="relative h-40 bg-[#FCFAF6] overflow-hidden flex items-center justify-center p-3">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#493B34] text-white text-[9px] font-bold uppercase tracking-wider">
                          {car.category || 'Self-Drive'}
                        </div>
                      </div>

                      <div className="p-4 space-y-2.5">
                        <h3 className="font-serif text-sm font-bold text-[#493B34] leading-tight">
                          {car.name}
                        </h3>

                        <div className="flex items-center justify-between pt-2 border-t border-[#EDE2D0]">
                          <div>
                            <span className="text-[10px] text-[#756B63] block font-medium">Daily Fare</span>
                            <span className="font-serif text-base font-bold text-[#493B34]">
                              ₹{car.pricePerDay.toLocaleString('en-IN')}<span className="text-xs font-normal text-[#756B63]">/day</span>
                            </span>
                          </div>

                          <Link
                            href={`/car-rentals/cars/${car.id}`}
                            className="text-xs font-bold px-4 py-2 rounded-xl bg-[#C65A2E] hover:bg-[#B24E25] text-white transition-all shadow-xs"
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Popular Cars Widget */}
              <div className="bg-white border border-[#EDE2D0] rounded-2xl p-5 space-y-3 shadow-2xs">
                <h3 className="font-serif text-xs font-bold text-[#493B34] uppercase tracking-wider">
                  Popular Self-Drive Choices
                </h3>

                <div className="space-y-2">
                  {SIDEBAR_POPULAR_CARS.map((popCar) => (
                    <Link
                      key={popCar.id}
                      href={`/car-rentals/cars/${popCar.id}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F8EFEA] transition-colors group"
                    >
                      <img
                        src={popCar.image}
                        alt={popCar.name}
                        className="w-12 h-10 rounded-lg object-cover bg-[#FCFAF6] flex-shrink-0 border border-[#EDE2D0]"
                      />
                      <div className="space-y-0.5">
                        <h4 className="font-serif font-bold text-xs text-[#493B34] group-hover:text-[#C65A2E] transition-colors">
                          {popCar.name}
                        </h4>
                        <span className="text-[10px] font-semibold text-[#756B63]">{popCar.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories Widget */}
              <div className="bg-white border border-[#EDE2D0] rounded-2xl p-5 space-y-3 shadow-2xs">
                <h3 className="font-serif text-xs font-bold text-[#493B34] uppercase tracking-wider">
                  Filter by Category
                </h3>

                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs font-medium text-[#756B63]">
                  {CATEGORIES_LIST.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`text-left hover:text-[#C65A2E] transition-colors py-0.5 cursor-pointer ${
                        selectedCategory === cat ? 'text-[#C65A2E] font-bold' : ''
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─── 4. CAR RENTAL TERMS & CONDITIONS ──────────────────────── */}
      <TermsConditionsSection mode="cars" />

      <Footer />

    </div>
  );
}
