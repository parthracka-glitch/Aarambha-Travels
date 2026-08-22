'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, Car, Sparkles, Star, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CompanyLocationSection from '@/components/home/CompanyLocationSection';
import { FLEET_VEHICLES, SHARED_CAR_CONTACT } from '@/constants/carsData';
import { getFleetVehicles } from '@/services/fleet.service';

export default function CarRentalSubsectionPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [fleetList, setFleetList] = useState<any[]>(FLEET_VEHICLES);

  useEffect(() => {
    getFleetVehicles().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map(v => ({
          id: v._id || v.id,
          name: v.name,
          category: v.specs?.bodyType || (v.categoryId?.name) || 'Hatchback',
          pricePerDay: v.dailyRate || 2500,
          image: Array.isArray(v.images) && v.images[0] ? v.images[0] : '/images/fleet/wagonr_vxi_2025.jpg',
          description: `${v.name} self-drive rental vehicle with full insurance and doorstep pickup.`,
          specs: {
            transmission: v.specs?.transmission || 'Manual',
            fuelType: v.specs?.fuel || 'Petrol',
            passengers: v.specs?.seats || 5,
          },
        }));
        setFleetList(formatted);
      }
    }).catch(() => {});
  }, []);

  const categories = ['all', 'Hatchback', 'Sedan', 'SUV', '7-Seater MPV'];

  const filteredFleet = selectedCategory === 'all'
    ? fleetList
    : fleetList.filter(v => (v.category || '').toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-[#5266EB] selection:text-white">
      <Navbar vertical="fleet" />

      {/* HEADER */}
      <section className="bg-[#111111] text-white py-10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-4">
          <Link
            href="/bus-rentals"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#5266EB]" /> Back to Bus Rentals
          </Link>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5266EB] bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              SELF-DRIVE FLEET
            </span>
            <h1 className="font-syne text-3xl sm:text-5xl font-extrabold text-white mt-2">
              Car Rental
            </h1>
            <p className="text-sm text-gray-400 mt-2 max-w-xl">
              Self-drive luxury cars, hatchbacks, sedans, and 4x4 SUVs with zero deposit friction and doorstep delivery across Pune.
            </p>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER */}
      <section className="bg-white border-b border-gray-200 sticky top-[64px] z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#5266EB] text-white shadow-md'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All Cars' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CAR FLEET GRID */}
      <section className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFleet.map((car) => (
              <div
                key={car.id}
                className="group bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                    {car.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-green-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                    ₹{Number(car.pricePerDay).toLocaleString('en-IN')}/day
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-syne text-xl font-extrabold text-gray-900 group-hover:text-[#5266EB] transition-colors">
                      {car.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{car.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-semibold uppercase">Daily Fare</span>
                      <span className="font-syne text-lg font-bold text-gray-900">
                        ₹{Number(car.pricePerDay).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Link
                      href={`/car-rentals/cars/${car.id}`}
                      className="px-5 py-2.5 rounded-full bg-[#5266EB] hover:bg-[#3E51D4] text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5"
                    >
                      <span>Rent Car</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CompanyLocationSection />
      <Footer />
    </div>
  );
}
