'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Bus, ArrowRight, Check, Info, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BUS_RULES_AND_GUIDELINES } from '@/constants/busData';
import { fetchLiveBusRates, formatBusDataFromApi } from '@/services/bus.service';

type Tab = 'local-ac' | 'local-nonac' | 'local-urbania';

export default function BusRentalLocalTripsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('local-ac');
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
    { id: 'local-ac', label: 'Local AC Buses (8h/80km)' },
    { id: 'local-nonac', label: 'Local Non-AC Buses (8h/80km)' },
    { id: 'local-urbania', label: 'Urbania Local Package' },
  ];

  const handleBook = (busType: string, seats: number, acType: string, price: number) => {
    const params = new URLSearchParams({
      type: busType,
      seats: String(seats),
      ac: acType,
      price: String(price),
      service: 'local',
    });
    router.push(`/bus-rentals/local-trips/book?${params.toString()}`);
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
              PUNE LOCAL TRIPS
            </span>
            <h1 className="font-syne text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-2">
              Local Rental Trips
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-xl">
              Local AC & Non-AC bus rentals in Pune for corporate events, weddings, city sightseeing, and family functions. Standard package includes 8 Hours / 80 KM.
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

          {/* TABLE A: Local AC Bus Rates */}
          {activeTab === 'local-ac' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-[#5266EB]" />
                  <h2 className="font-syne text-lg sm:text-xl font-extrabold">Local AC Bus Rates</h2>
                </div>
                <p className="text-xs text-gray-500">Includes 8 Hours & 80 KM within Pune city limits</p>
              </div>

              {/* MOBILE CARDS VIEW (< 768px) */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {ratesData.localAcRates.map((rate: any) => (
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

                    <div className="grid grid-cols-3 gap-2 text-xs text-center">
                      <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                        <span className="text-[10px] text-gray-500 block font-semibold">Base (8h/80k)</span>
                        <span className="font-bold text-[#5266EB] text-sm">₹{rate.baseRate.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="bg-gray-50 p-2.5 rounded-xl">
                        <span className="text-[10px] text-gray-500 block font-semibold">Extra KM</span>
                        <span className="font-bold text-gray-800 text-xs">₹{rate.extraKmRate}/km</span>
                      </div>
                      <div className="bg-gray-50 p-2.5 rounded-xl">
                        <span className="text-[10px] text-gray-500 block font-semibold">Extra Hour</span>
                        <span className="font-bold text-gray-800 text-xs">₹{rate.extraHourRate}/hr</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBook(rate.busType, rate.seats, 'AC', rate.baseRate)}
                      className="w-full py-2.5 rounded-xl bg-[#5266EB] hover:bg-[#3E51D4] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Book Local Trip</span>
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
                      <th className="py-4 px-4">Base Rate (8h/80km)</th>
                      <th className="py-4 px-4">Extra KM</th>
                      <th className="py-4 px-4">Extra Hour</th>
                      <th className="py-4 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {ratesData.localAcRates.map((rate: any) => (
                      <tr key={rate.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-2">
                          <Bus className="w-4 h-4 text-[#5266EB]" />
                          <span>{rate.busType}</span>
                        </td>
                        <td className="py-4 px-4 font-semibold">{rate.seats} Seater</td>
                        <td className="py-4 px-4 font-bold text-[#5266EB] text-sm">₹{rate.baseRate.toLocaleString('en-IN')}</td>
                        <td className="py-4 px-4">₹{rate.extraKmRate}/km</td>
                        <td className="py-4 px-4">₹{rate.extraHourRate}/hr</td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleBook(rate.busType, rate.seats, 'AC', rate.baseRate)}
                            className="px-4 py-2 rounded-xl bg-[#5266EB] hover:bg-[#3E51D4] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                          >
                            Book Local
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABLE B: Local Non-AC Bus Rates */}
          {activeTab === 'local-nonac' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-[#5266EB]" />
                  <h2 className="font-syne text-lg sm:text-xl font-extrabold">Local Non-AC Bus Rates</h2>
                </div>
                <p className="text-xs text-gray-500">Includes 8 Hours & 80 KM within Pune city limits</p>
              </div>

              {/* MOBILE CARDS VIEW (< 768px) */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {ratesData.localNonAcRates.map((rate: any) => (
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

                    <div className="grid grid-cols-3 gap-2 text-xs text-center">
                      <div className="bg-gray-100 p-2.5 rounded-xl">
                        <span className="text-[10px] text-gray-500 block font-semibold">Base (8h/80k)</span>
                        <span className="font-bold text-gray-900 text-sm">₹{rate.baseRate.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="bg-gray-50 p-2.5 rounded-xl">
                        <span className="text-[10px] text-gray-500 block font-semibold">Extra KM</span>
                        <span className="font-bold text-gray-800 text-xs">₹{rate.extraKmRate}/km</span>
                      </div>
                      <div className="bg-gray-50 p-2.5 rounded-xl">
                        <span className="text-[10px] text-gray-500 block font-semibold">Extra Hour</span>
                        <span className="font-bold text-gray-800 text-xs">₹{rate.extraHourRate}/hr</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBook(rate.busType, rate.seats, 'Non-AC', rate.baseRate)}
                      className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Book Local Trip</span>
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
                      <th className="py-4 px-4">Base Rate (8h/80km)</th>
                      <th className="py-4 px-4">Extra KM</th>
                      <th className="py-4 px-4">Extra Hour</th>
                      <th className="py-4 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {ratesData.localNonAcRates.map((rate: any) => (
                      <tr key={rate.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-bold text-gray-900 flex items-center gap-2">
                          <Bus className="w-4 h-4 text-gray-600" />
                          <span>{rate.busType}</span>
                        </td>
                        <td className="py-4 px-4 font-semibold">{rate.seats} Seater</td>
                        <td className="py-4 px-4 font-bold text-gray-900 text-sm">₹{rate.baseRate.toLocaleString('en-IN')}</td>
                        <td className="py-4 px-4">₹{rate.extraKmRate}/km</td>
                        <td className="py-4 px-4">₹{rate.extraHourRate}/hr</td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleBook(rate.busType, rate.seats, 'Non-AC', rate.baseRate)}
                            className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                          >
                            Book Local
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABLE F: Urbania Local Package */}
          {activeTab === 'local-urbania' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-[#5266EB]" />
                  <h2 className="font-syne text-lg sm:text-xl font-extrabold">Urbania Local Package</h2>
                </div>
                <p className="text-xs text-gray-500">80 KM / 8 Hours included in Pune city limits</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {ratesData.urbaniaLocalRates.map((rate: any) => (
                  <div key={rate.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-[#5266EB] flex items-center justify-center shrink-0">
                          <Bus className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div>
                          <h3 className="font-syne font-extrabold text-sm sm:text-base text-gray-900">{rate.busType}</h3>
                          <p className="text-xs text-gray-500">{rate.seats} Seats • AC Urbania</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-blue-50/60 rounded-xl p-2.5 sm:p-3 border border-blue-100">
                        <span className="text-gray-500 block text-[10px]">Package Rate</span>
                        <span className="font-bold text-sm sm:text-base text-[#5266EB]">₹{rate.packageRate.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2.5 sm:p-3">
                        <span className="text-gray-500 block text-[10px]">Extra KM</span>
                        <span className="font-bold text-xs sm:text-sm">₹{rate.extraKmRate}/km</span>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2.5 sm:p-3">
                        <span className="text-gray-500 block text-[10px]">Extra Hour</span>
                        <span className="font-bold text-xs sm:text-sm">₹{rate.extraHourRate}/hr</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBook(rate.busType, rate.seats, 'AC', rate.packageRate)}
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
