'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Bus, Car, ArrowRight, Check, Info, Sparkles, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BUS_RULES_AND_GUIDELINES } from '@/constants/busData';
import { fetchLiveBusRates, formatBusDataFromApi } from '@/services/bus.service';

type Tab = 'pune-mumbai' | 'package-ac' | 'package-nonac' | 'perkm';

export default function BusRentalOutstationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('pune-mumbai');
  const [ratesData, setRatesData] = useState<any>(formatBusDataFromApi(null));
  const router = useRouter();

  useEffect(() => {
    fetchLiveBusRates().then(data => {
      if (data) {
        setRatesData(formatBusDataFromApi(data));
      }
    });
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'pune-mumbai', label: 'Pune–Mumbai (Cabs & Buses)' },
    { id: 'package-ac', label: 'AC Bus Outstation' },
    { id: 'package-nonac', label: 'Non-AC Bus Outstation' },
    { id: 'perkm', label: 'Urbania Per KM' },
  ];

  const handleBook = (busType: string, seats: number, acType: string, route: string, price: number) => {
    const params = new URLSearchParams({
      type: busType,
      seats: String(seats),
      ac: acType,
      route,
      price: String(price),
      service: 'outstation',
    });
    router.push(`/bus-rentals/bus-rental/book?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-[#5266EB] selection:text-white">
      <Navbar vertical="fleet" />

      {/* HEADER */}
      <section className="bg-[#111111] text-white py-8 sm:py-10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-3 sm:space-y-4">
          <Link
            href="/bus-rentals"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#5266EB]" /> Back to Bus Rentals
          </Link>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5266EB] bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              OUTSTATION HIRE & PUNE-MUMBAI CABS
            </span>
            <h1 className="font-syne text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-2">
              Bus & Chauffeur Fleet Rentals
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-xl">
              Pune → Mumbai (5s/7s Cabs, Urbania & Buses) & Outstation trips to Mahabaleshwar, Goa, and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* TAB SWITCHER */}
      <section className="bg-white border-b border-gray-200 sticky top-[64px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#5266EB] text-white shadow-md'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="flex-1 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-8">

          {/* TAB 1: PUNE -> MUMBAI CABS & BUSES */}
          {activeTab === 'pune-mumbai' && (
            <div className="space-y-8">
              
              {/* 5-Seater & 7-Seater Cab Packages with Driver */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#5266EB]" />
                  <div>
                    <h2 className="font-syne text-lg sm:text-xl font-extrabold">Pune → Mumbai 5-Seater & 7-Seater Cabs with Driver</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {(ratesData?.puneMumbaiCabs || []).map((cab: any) => (
                    <div key={cab.id} className="bg-gradient-to-br from-white to-blue-50/40 rounded-3xl border border-blue-100 shadow-sm p-5 sm:p-6 space-y-4 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#5266EB]/10 flex items-center justify-center text-[#5266EB] shrink-0">
                            <Car className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-[#5266EB] bg-blue-100 px-2 py-0.5 rounded-full uppercase">Chauffeur Driven</span>
                            <h3 className="font-syne font-extrabold text-sm sm:text-base text-gray-900 mt-0.5">{cab.busType}</h3>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-500">{cab.seats} Seats • AC</span>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        {cab.description}
                      </p>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-gray-100">
                          <span className="text-gray-400 text-[10px] block">Package Rate</span>
                          <span className="font-bold text-[#5266EB] text-sm sm:text-base">₹{cab.packageRate.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-gray-100">
                          <span className="text-gray-400 text-[10px] block">Included KM</span>
                          <span className="font-bold text-gray-800 text-xs">{cab.kmIncluded} KM</span>
                        </div>
                        <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-gray-100">
                          <span className="text-gray-400 text-[10px] block">Extra KM</span>
                          <span className="font-bold text-gray-800 text-xs">₹{cab.extraKmRate}/km</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBook(cab.busType, cab.seats, 'AC', 'Pune → Mumbai Cab', cab.packageRate)}
                        className="w-full py-3 rounded-xl bg-[#5266EB] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#3E51D4] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      >
                        Book Cab Package <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Force Urbania Pune -> Mumbai Packages */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Bus className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h2 className="font-syne text-lg sm:text-xl font-extrabold">Force Urbania Pune → Mumbai Packages</h2>
                    <p className="text-xs text-gray-500">Luxury Executive Urbania Vans (350 KM Included)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {(ratesData?.urbaniaPuneMumbai || []).map((rate: any) => (
                    <div key={rate.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-4 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Bus className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Executive Urbania</span>
                            <h3 className="font-syne font-extrabold text-sm sm:text-base text-gray-900 mt-0.5">{rate.busType}</h3>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-500">{rate.seats} Seats</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="bg-gray-50 rounded-xl p-2.5">
                          <span className="text-gray-500 block mb-0.5 text-[10px]">Package Rate</span>
                          <span className="font-bold text-sm sm:text-base text-emerald-700">₹{rate.packageRate.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-2.5">
                          <span className="text-gray-500 block mb-0.5 text-[10px]">KM Included</span>
                          <span className="font-bold text-xs sm:text-sm">{rate.kmIncluded} KM</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-2.5">
                          <span className="text-gray-500 block mb-0.5 text-[10px]">Extra KM</span>
                          <span className="font-bold text-xs sm:text-sm">{rate.extraKmRate}/km</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-2.5">
                          <span className="text-gray-500 block mb-0.5 text-[10px]">DA / Tolls</span>
                          <span className="font-bold text-xs sm:text-sm">{rate.tollNote}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBook(rate.busType, rate.seats, 'AC', 'Pune → Mumbai', rate.packageRate)}
                        className="w-full py-3 rounded-xl bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      >
                        Book Now <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: AC BUS OUTSTATION */}
          {activeTab === 'package-ac' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-[#5266EB]" />
                  <h2 className="font-syne text-lg sm:text-xl font-extrabold">AC Bus & Tempo Traveller Outstation Rates</h2>
                </div>
                <p className="text-xs text-gray-500">Mumbai (up to 350 KM) & Mahabaleshwar (up to 300 KM)</p>
              </div>

              {/* MOBILE CARDS VIEW (< 768px) */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {(ratesData?.outstationAcRates || []).map((rate: any) => (
                  <div key={rate.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Bus className="w-4 h-4 text-[#5266EB]" />
                        <h3 className="font-syne font-bold text-sm text-gray-900">{rate.busType}</h3>
                      </div>
                      <span className="text-xs font-bold bg-blue-50 text-[#5266EB] px-2.5 py-0.5 rounded-full border border-blue-200">
                        {rate.seats} Seats
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] text-gray-500 block font-semibold">Mumbai Rate</span>
                        <span className="font-bold text-emerald-700 text-sm">₹{rate.mumbaiRate.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                        <span className="text-[10px] text-gray-500 block font-semibold">Mahabaleshwar Rate</span>
                        <span className="font-bold text-[#5266EB] text-sm">₹{rate.mahabaleshwarRate.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl">
                      <span>Extra KM: <strong>₹{rate.extraKmRate}/km</strong></span>
                      <span>Permit: <strong className="text-amber-700">₹{rate.specialPermit}</strong></span>
                    </div>

                    <button
                      onClick={() => handleBook(rate.busType, rate.seats, 'AC', 'Mumbai', rate.mumbaiRate)}
                      className="w-full py-2.5 rounded-xl bg-[#5266EB] hover:bg-[#3E51D4] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Book Mumbai Trip</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* DESKTOP TABLE VIEW (>= 768px) */}
              <div className="hidden md:block overflow-x-auto no-scrollbar rounded-2xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#111111] text-white uppercase text-[10px] tracking-wider font-syne font-bold">
                    <tr>
                      <th className="py-4 px-4">Bus Type</th>
                      <th className="py-4 px-4">Seats</th>
                      <th className="py-4 px-4">Mumbai Rate</th>
                      <th className="py-4 px-4">Mahabaleshwar Rate</th>
                      <th className="py-4 px-4">Extra KM</th>
                      <th className="py-4 px-4">Special Permit</th>
                      <th className="py-4 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {(ratesData?.outstationAcRates || []).map((rate: any) => (
                      <tr key={rate.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-2">
                          <Bus className="w-4 h-4 text-[#5266EB]" />
                          <span>{rate.busType}</span>
                        </td>
                        <td className="py-4 px-4 font-semibold">{rate.seats} Seater</td>
                        <td className="py-4 px-4 font-bold text-emerald-600">₹{rate.mumbaiRate.toLocaleString('en-IN')}</td>
                        <td className="py-4 px-4 font-bold text-[#5266EB]">₹{rate.mahabaleshwarRate.toLocaleString('en-IN')}</td>
                        <td className="py-4 px-4">₹{rate.extraKmRate}/km</td>
                        <td className="py-4 px-4 font-medium text-amber-700">₹{rate.specialPermit}</td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleBook(rate.busType, rate.seats, 'AC', 'Mumbai', rate.mumbaiRate)}
                            className="px-4 py-2 rounded-xl bg-[#5266EB] hover:bg-[#3E51D4] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                          >
                            Book Mumbai
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: NON-AC BUS OUTSTATION */}
          {activeTab === 'package-nonac' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-[#5266EB]" />
                  <h2 className="font-syne text-lg sm:text-xl font-extrabold">Non-AC Bus Outstation Rates</h2>
                </div>
                <p className="text-xs text-gray-500">Mumbai (up to 350 KM) & Mahabaleshwar (up to 300 KM)</p>
              </div>

              {/* MOBILE CARDS VIEW (< 768px) */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {(ratesData?.outstationNonAcRates || []).map((rate: any) => (
                  <div key={rate.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Bus className="w-4 h-4 text-gray-700" />
                        <h3 className="font-syne font-bold text-sm text-gray-900">{rate.busType}</h3>
                      </div>
                      <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full">
                        {rate.seats} Seats
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                        <span className="text-[10px] text-gray-500 block font-semibold">Mumbai Rate</span>
                        <span className="font-bold text-emerald-700 text-sm">₹{rate.mumbaiRate.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                        <span className="text-[10px] text-gray-500 block font-semibold">Mahabaleshwar Rate</span>
                        <span className="font-bold text-[#5266EB] text-sm">₹{rate.mahabaleshwarRate.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl">
                      <span>Extra KM: <strong>₹{rate.extraKmRate}/km</strong></span>
                      <span>Permit: <strong className="text-amber-700">₹{rate.specialPermit}</strong></span>
                    </div>

                    <button
                      onClick={() => handleBook(rate.busType, rate.seats, 'Non-AC', 'Mumbai', rate.mumbaiRate)}
                      className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Book Mumbai Trip</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* DESKTOP TABLE VIEW (>= 768px) */}
              <div className="hidden md:block overflow-x-auto no-scrollbar rounded-2xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#111111] text-white uppercase text-[10px] tracking-wider font-syne font-bold">
                    <tr>
                      <th className="py-4 px-4">Bus Type</th>
                      <th className="py-4 px-4">Seats</th>
                      <th className="py-4 px-4">Mumbai Rate</th>
                      <th className="py-4 px-4">Mahabaleshwar Rate</th>
                      <th className="py-4 px-4">Extra KM</th>
                      <th className="py-4 px-4">Special Permit</th>
                      <th className="py-4 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {(ratesData?.outstationNonAcRates || []).map((rate: any) => (
                      <tr key={rate.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-2">
                          <Bus className="w-4 h-4 text-gray-600" />
                          <span>{rate.busType}</span>
                        </td>
                        <td className="py-4 px-4 font-semibold">{rate.seats} Seater</td>
                        <td className="py-4 px-4 font-bold text-emerald-600">₹{rate.mumbaiRate.toLocaleString('en-IN')}</td>
                        <td className="py-4 px-4 font-bold text-[#5266EB]">₹{rate.mahabaleshwarRate.toLocaleString('en-IN')}</td>
                        <td className="py-4 px-4">₹{rate.extraKmRate}/km</td>
                        <td className="py-4 px-4 font-medium text-amber-700">₹{rate.specialPermit}</td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleBook(rate.busType, rate.seats, 'Non-AC', 'Mumbai', rate.mumbaiRate)}
                            className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                          >
                            Book Mumbai
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: URBANIA PER KM */}
          {activeTab === 'perkm' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-[#5266EB]" />
                  <h2 className="font-syne text-lg sm:text-xl font-extrabold">Urbania Per-Day Outstation Rates</h2>
                </div>
                <p className="text-xs text-gray-500">300 KM/day minimum running requirement</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {(ratesData?.urbaniaPerKmRates || ratesData?.urbaniaPerDayRates || []).map((urbania: any) => (
                  <div key={urbania.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-[#5266EB] flex items-center justify-center shrink-0">
                          <Bus className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                          <h3 className="font-syne font-extrabold text-sm sm:text-base text-gray-900">{urbania.busType}</h3>
                          <p className="text-xs text-gray-500">{urbania.seats} Seats • Pushback AC Urbania</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100">
                        <span className="text-gray-500 block text-[10px]">Per KM Rate</span>
                        <span className="font-bold text-base text-[#5266EB]">₹{urbania.acPerKmRate}/km</span>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <span className="text-gray-500 block text-[10px]">Min Running</span>
                        <span className="font-bold text-xs sm:text-sm">{urbania.minKmPerDay} KM/day</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 text-xs">
                      <span className="text-gray-400 text-[10px] block">Driver DA / Toll</span>
                      <span className="font-bold text-gray-800">{urbania.tollNote}</span>
                    </div>

                    <button
                      onClick={() => handleBook(urbania.busType, urbania.seats, 'AC', 'Outstation Per KM', urbania.acPerKmRate * 300)}
                      className="w-full py-3 rounded-xl bg-[#5266EB] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#3E51D4] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      Book Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RULES & GUIDELINES */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-900 font-syne font-bold text-sm sm:text-base">
              <Info className="w-4 h-4 text-[#5266EB]" />
              <span>Rules & Guidelines</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-gray-600">
              {BUS_RULES_AND_GUIDELINES.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
