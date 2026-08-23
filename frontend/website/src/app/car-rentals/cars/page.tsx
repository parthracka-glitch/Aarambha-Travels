'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-[#FF3B30] selection:text-white">
      
      <Navbar vertical="fleet" />

      {/* ─── 1. BREADCRUMB & HEADER BANNER ─────────────────────────── */}
      <section className="pt-8 pb-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-4 text-center">
          
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-syne">
            HOME/CARS
          </div>

          <h1 className="font-syne text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight">
            Our Impressive Fleet
          </h1>

          <div className="relative w-full h-[220px] sm:h-[300px] rounded-2xl overflow-hidden bg-[#111111]">
            <img
              src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1600&auto=format&fit=crop"
              alt="Red Smoke Car Header"
              className="w-full h-full object-cover opacity-85"
            />
          </div>

        </div>
      </section>

      {/* ─── 2. SEARCH & SORTING FILTER BAR ───────────────────────── */}
      <section className="py-4 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="text-gray-500 font-medium">
            Showing 1-{filteredCars.length} of 24 results
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="bg-[#F8F9FA] border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 font-medium flex items-center gap-2 cursor-pointer">
              <span>Default Sorting</span>
              <span className="text-[10px]">▼</span>
            </div>

            <div className="relative flex-1 sm:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Your Pick Car...."
                className="w-full bg-[#F8F9FA] border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-xs text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-[#FF3B30]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

        </div>
      </section>

      {/* ─── 3. CATALOG GRID & SIDEBAR SECTION ────────────────────── */}
      <section className="py-12 bg-[#FAFAFC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 9-Car Grid */}
            <div className="lg:col-span-8 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.slice(0, 9).map((car) => {
                  const isActive = car.id === activeCarId;
                  return (
                    <div
                      key={car.id}
                      onClick={() => setActiveCarId(car.id)}
                      className={`rounded-2xl bg-white overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                        isActive
                          ? 'border-2 border-[#FF3B30] shadow-lg shadow-red-500/10'
                          : 'border border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      {/* Clean Studio Image Header */}
                      <div className="relative h-44 bg-[#F4F5F7] overflow-hidden flex items-center justify-center">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-amber-400/30 text-[9px] font-extrabold font-syne uppercase tracking-wider">
                          {car.category || 'Luxury Fleet'}
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <h3 className={`font-syne text-sm font-bold leading-tight transition-colors ${isActive ? 'text-[#FF3B30]' : 'text-[#111111] group-hover:text-[#FF3B30]'}`}>
                          {car.name}
                        </h3>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div>
                            <span className="text-[9px] text-gray-400 block">Starting at</span>
                            <span className="font-syne text-base font-bold text-[#111111]">
                              ₹{car.pricePerDay.toLocaleString('en-IN')}<span className="text-xs font-normal text-gray-500">/day</span>
                            </span>
                          </div>

                          <Link
                            href={`/car-rentals/cars/${car.id}`}
                            className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${
                              isActive
                                ? 'bg-[#FF3B30] text-white hover:bg-[#E03126] shadow-md shadow-red-600/20'
                                : 'btn-red-pill'
                            }`}
                          >
                            Rent
                          </Link>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 pt-2 text-xs font-bold text-gray-400">
                <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-[#111111]" />
                <span className="w-7 h-7 rounded-full border border-[#FF3B30] text-[#FF3B30] flex items-center justify-center">1</span>
                <span className="w-7 h-7 rounded-full flex items-center justify-center hover:text-[#111111] cursor-pointer">2</span>
                <span className="w-7 h-7 rounded-full flex items-center justify-center hover:text-[#111111] cursor-pointer">3</span>
                <ChevronRight className="w-4 h-4 cursor-pointer hover:text-[#111111]" />
              </div>

            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Popular Cars Widget */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                <h3 className="font-syne text-xs font-bold text-[#111111] uppercase tracking-wider">
                  POPULAR CARS
                </h3>

                <div className="space-y-2.5">
                  {SIDEBAR_POPULAR_CARS.map((popCar) => (
                    <Link
                      key={popCar.id}
                      href={`/car-rentals/cars/${popCar.id}`}
                      className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <img
                        src={popCar.image}
                        alt={popCar.name}
                        className="w-12 h-10 rounded-md object-cover bg-gray-100 flex-shrink-0"
                      />
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs text-[#111111] group-hover:text-[#FF3B30] transition-colors">
                          {popCar.name}
                        </h4>
                        <span className="text-[10px] font-semibold text-gray-500 font-syne">{popCar.price}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories Widget */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                <h3 className="font-syne text-xs font-bold text-[#111111] uppercase tracking-wider">
                  CATEGORIES
                </h3>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs font-medium text-gray-600">
                  {CATEGORIES_LIST.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`text-left hover:text-[#FF3B30] transition-colors py-0.5 ${
                        selectedCategory === cat ? 'text-[#FF3B30] font-bold' : ''
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Widget */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                <h3 className="font-syne text-xs font-bold text-[#111111] uppercase tracking-wider">
                  TAGS
                </h3>

                <div className="flex flex-wrap gap-1.5 text-xs font-medium">
                  {TAGS_LIST.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`px-3 py-1 rounded-full border transition-colors ${
                        selectedTag === tag
                          ? 'bg-[#FF3B30] text-white border-[#FF3B30]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─── 4. CTA BANNER ────────────────────────────────────────── */}
      <section className="py-10 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="relative rounded-2xl overflow-hidden min-h-[240px] flex items-center justify-center p-8 text-center bg-[#111111]">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop"
              alt="Explore Fleet Background"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />

            <div className="relative z-10 space-y-3 max-w-xl text-white">
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider block font-syne">
                FIND YOUR PERFECT RIDE
              </span>
              <h2 className="font-syne text-2xl sm:text-4xl font-extrabold tracking-tight">
                Explore Our Fleet and Book Your Dream Car Today!
              </h2>
              <div className="pt-1">
                <Link
                  href="/car-rentals/cars"
                  className="btn-red-pill text-xs font-semibold px-6 py-2.5 rounded-full bg-[#FF3B30] text-white hover:bg-[#E03126] transition-colors"
                >
                  Let&apos;s Drive with Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. CAR RENTAL TERMS & CONDITIONS ──────────────────────── */}
      <TermsConditionsSection mode="cars" />

      <Footer />

    </div>
  );
}
