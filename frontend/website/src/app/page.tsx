'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Compass, Car, ArrowRight, Sparkles, Star, MapPin, ShieldCheck, CheckCircle2, Check, Clock, Award, CreditCard } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EpicHeroShowcase from '@/components/home/EpicHeroShowcase';
import CompanyLocationSection from '@/components/home/CompanyLocationSection';
import type { BookingModalItem } from '@/components/booking/BookingModal';
import { FLEET_VEHICLES, CarVehicle } from '@/constants/carsData';
import { TOUR_PACKAGES, TourPackage } from '@/constants/toursData';
import { fetchLiveTourPackages } from '@/services/tours.service';
import { fetchLiveFleetVehicles } from '@/services/fleet.service';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const BookingModal = dynamic(() => import('@/components/booking/BookingModal'), {
  ssr: false,
});

function PortalContent() {
  const [bookingModalItem, setBookingModalItem] = useState<BookingModalItem | null>(null);
  const [spotlightTab, setSpotlightTab] = useState<'all' | 'tours' | 'cars'>('all');
  const [famousTours, setFamousTours] = useState<TourPackage[]>(TOUR_PACKAGES.slice(0, 3));
  const [famousCars, setFamousCars] = useState<CarVehicle[]>([
    FLEET_VEHICLES.find((c) => c.id === 'swift-black-2026') || FLEET_VEHICLES[2],
    FLEET_VEHICLES.find((c) => c.id === 'thar-diesel-2023') || FLEET_VEHICLES[6],
    FLEET_VEHICLES.find((c) => c.id === 'fortuner-2017') || FLEET_VEHICLES[7],
  ]);
  const spotlightRef = useRef<HTMLElement>(null);
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'tours') {
      setSpotlightTab('tours');
    } else if (view === 'cars') {
      setSpotlightTab('cars');
    }
  }, [searchParams]);

  React.useEffect(() => {
    fetchLiveTourPackages().then(tours => {
      if (Array.isArray(tours) && tours.length > 0) {
        setFamousTours(tours.slice(0, 3));
      }
    });

    fetchLiveFleetVehicles().then(cars => {
      if (Array.isArray(cars) && cars.length > 0) {
        setFamousCars([
          cars.find((c) => c.id === 'swift-black-2026') || cars[2] || cars[0],
          cars.find((c) => c.id === 'thar-diesel-2023') || cars[6] || cars[1],
          cars.find((c) => c.id === 'fortuner-2017') || cars[7] || cars[2],
        ]);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-[#5266EB] selection:text-white">
      
      <Navbar vertical="home" />

      {/* ─── EPIC GAMES STYLE HERO SHOWCASE ─────────────────────────── */}
      <EpicHeroShowcase />

      {/* ─── 3. TRUST HIGHLIGHT BAR ────────────────────────────────── */}
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAFAFC] border border-gray-200">
              <ShieldCheck className="w-5 h-5 text-[#5266EB] flex-shrink-0" />
              <div>
                <h4 className="font-bold text-[#000000] text-xs font-syne">100% Verified Stays & Cars</h4>
                <p className="text-[11px] text-gray-500">Zero dep insurance & certified guides.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAFAFC] border border-gray-200">
              <MapPin className="w-5 h-5 text-[#5266EB] flex-shrink-0" />
              <div>
                <h4 className="font-bold text-[#000000] text-xs font-syne">Doorstep Delivery in Pune</h4>
                <p className="text-[11px] text-gray-500">Green Hills Soc Katraj, Pune Airport & doorstep.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAFAFC] border border-gray-200">
              <Star className="w-5 h-5 text-[#9CB4E8] flex-shrink-0 fill-[#9CB4E8]" />
              <div>
                <h4 className="font-bold text-[#000000] text-xs font-syne">₹500 Deposit Reserve</h4>
                <p className="text-[11px] text-gray-500">Lock your booking with 100% refund policy.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAFAFC] border border-gray-200">
              <Sparkles className="w-5 h-5 text-[#AFB2CE] flex-shrink-0" />
              <div>
                <h4 className="font-bold text-[#000000] text-xs font-syne">24/7 Dedicated Support</h4>
                <p className="text-[11px] text-gray-500">Round-the-clock helpline & WhatsApp.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 4. SPOTLIGHT EXPERIENCES SECTION (3 FAMOUS TOURS & 3 FAMOUS CARS) ─── */}
      <section ref={spotlightRef} className="py-16 bg-[#FAFAFC] content-defer border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
          
          {/* Header & Filter Switcher */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200/80 pb-6">
            <div>
              <span className="text-xs font-black text-[#5266EB] uppercase tracking-widest block font-syne mb-1">
                SPOTLIGHT GLIMPSE
              </span>
              <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#000000] tracking-tight">
                Famous Tour Packages & Bus/Car Fleet
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-normal">
                Discover top-rated departure packages and popular luxury self-drive cars.
              </p>
            </div>

            {/* Filter Segmented Pill */}
            <div className="flex items-center bg-white p-1 rounded-full border border-gray-200 shadow-sm text-xs font-bold shrink-0 self-start md:self-auto">
              <button
                onClick={() => setSpotlightTab('all')}
                className={`px-5 py-2 rounded-full transition-all ${
                  spotlightTab === 'all'
                    ? 'bg-[#171721] text-[#EDEDF3] shadow-md'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                All Glimpse (6)
              </button>
              <button
                onClick={() => setSpotlightTab('tours')}
                className={`px-5 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                  spotlightTab === 'tours'
                    ? 'bg-[#5266EB] text-white shadow-md'
                    : 'text-gray-500 hover:text-[#5266EB]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>3 Tour Packages</span>
              </button>
              <button
                onClick={() => setSpotlightTab('cars')}
                className={`px-5 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                  spotlightTab === 'cars'
                    ? 'bg-[#5266EB] text-white shadow-md'
                    : 'text-gray-500 hover:text-[#5266EB]'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>3 Famous Cars</span>
              </button>
            </div>
          </div>

          {/* ─── 4A. FAMOUS TOUR PACKAGES GLIMPSE (TOP 3) ────────────────── */}
          {(spotlightTab === 'all' || spotlightTab === 'tours') && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#5266EB]/10 text-[#5266EB] border border-[#5266EB]/20">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-syne text-xl font-bold text-[#000000]">
                      Famous Tour Packages
                    </h3>
                    <p className="text-xs text-gray-500">Handpicked curated departure batches with 4.8+ ratings.</p>
                  </div>
                </div>

                <Link
                  href="/tours-travels"
                  className="text-xs font-bold text-[#5266EB] hover:text-[#3E51D4] flex items-center gap-1 hover:underline"
                >
                  <span>Explore All Tours</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {famousTours.map((tour) => {
                  const whatsappMsg = `*AARAMBHA TOUR INQUIRY*%0A🧭 *Package:* ${tour.title}%0A📅 *Dates:* ${tour.datesLabel}%0A💰 *Price:* ${tour.priceDisplay}%0A🔖 *Advance:* ${tour.advanceLabel}%0APlease share seat availability.`;
                  const whatsappUrl = `https://wa.me/919067617451?text=${encodeURIComponent(whatsappMsg)}`;

                  return (
                    <div
                      key={tour.id}
                      className="rounded-2xl bg-white border border-gray-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group"
                    >
                      {/* Full Bleed Image Header */}
                      <div className="relative h-52 bg-gray-900 overflow-hidden">
                        <img
                          src={tour.image}
                          alt={tour.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-80" />
                        
                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#171721]/90 backdrop-blur-md text-[#9CB4E8] border border-[#9CB4E8]/30 text-[10px] font-black font-syne uppercase tracking-wider flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-[#9CB4E8]" />
                          <span>{tour.durationLabel}</span>
                        </div>

                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#5266EB] text-[#EDEDF3] text-[10px] font-bold shadow-md flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{tour.advanceLabel}</span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[#EDEDF3] text-[10px] font-bold bg-[#171721]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                          <span className="text-[#AFB2CE]">📅 {tour.datesLabel}</span>
                          <span className="flex items-center gap-1 text-[#9CB4E8]">
                            <Star className="w-3 h-3 fill-[#9CB4E8] text-[#9CB4E8]" /> {tour.rating} ({tour.reviewsCount})
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5266EB] block">
                            {tour.destination} • {tour.sites.length} Holy Sites
                          </span>
                          <h4 className="font-syne text-base font-bold text-[#000000] group-hover:text-[#5266EB] transition-colors line-clamp-1">
                            <Link href={`/tours-travels/${tour.slug}`}>{tour.title}</Link>
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {tour.subtitle}
                          </p>
                        </div>

                        {/* Footer Price & CTA Buttons */}
                        <div className="space-y-3 pt-3 border-t border-gray-100">
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-[10px] text-gray-400 block uppercase font-semibold">Tour Fare</span>
                              <span className="font-syne text-base font-bold text-[#000000]">
                                {tour.priceDisplay}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#171721] font-bold bg-[#9CB4E8]/20 px-2 py-0.5 rounded border border-[#9CB4E8]/40">
                              {tour.advanceLabel}
                            </span>
                          </div>

                          {/* Primary Book Now CTA */}
                          <button
                            onClick={() =>
                              setBookingModalItem({
                                id: tour.id,
                                type: 'tour',
                                title: tour.title,
                                subtitle: `${tour.durationLabel} • ${tour.datesLabel}`,
                                image: tour.image,
                                price: tour.basePrice,
                                deposit: tour.depositPrice || 2999,
                                batchDates: tour.batchDates,
                              })
                            }
                            className="w-full py-2.5 rounded-xl bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Book Now ({tour.advanceLabel})</span>
                          </button>

                          <div className="grid grid-cols-3 gap-2">
                            <a
                              href="tel:+919067617451"
                              className="flex items-center justify-center gap-1 py-2 px-1 rounded-xl bg-[#171721] hover:bg-[#272735] text-[#EDEDF3] font-bold text-xs transition-colors text-center"
                            >
                              <span>Call</span>
                            </a>

                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1 py-2 px-1 rounded-xl bg-[#272735] hover:bg-[#171721] text-[#9CB4E8] font-bold text-xs transition-colors text-center border border-[#9CB4E8]/30"
                            >
                              <span>WhatsApp</span>
                            </a>

                            <Link
                              href={`/tours-travels/${tour.slug}`}
                              className="flex items-center justify-center gap-1 py-2 px-1 rounded-xl bg-[#171721] hover:bg-[#5266EB] text-[#EDEDF3] font-bold text-xs transition-colors text-center"
                            >
                              <span>Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── 4B. FAMOUS SELF-DRIVE FLEET GLIMPSE (TOP 3) ─────────────── */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-t border-gray-200/60 pt-8">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#5266EB]/10 text-[#5266EB] border border-[#5266EB]/20">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-syne text-xl font-bold text-[#000000]">
                    Famous Self-Drive Fleet (Top 3)
                  </h3>
                  <p className="text-xs text-gray-500">Pair your tour or travel independently with top-requested self-drive cars.</p>
                </div>
              </div>

              <Link
                href="/bus-rentals"
                className="text-xs font-bold text-[#5266EB] hover:text-[#3E51D4] flex items-center gap-1 hover:underline"
              >
                <span>Explore Bus & Fleet Rentals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {famousCars.map((car) => {
                  const priceINR = car.pricePerDay;
                  return (
                    <div
                      key={car.id}
                      className="rounded-2xl bg-white border border-gray-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group"
                    >
                      {/* Clean Studio Image Header */}
                      <div className="relative h-52 bg-[#F4F5F7] overflow-hidden flex items-center justify-center">
                        <img
                          src={car.image}
                          alt={car.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-amber-400/30 text-[10px] font-black font-syne uppercase tracking-wider">
                          {car.category || 'Luxury Fleet'}
                        </div>

                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                          Zero Security Deposit
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-syne text-base font-bold text-[#111111] group-hover:text-[#FF3B30] transition-colors">
                              {car.name}
                            </h4>
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              {car.specs?.transmission || 'Automatic'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <span className="bg-gray-100 px-2.5 py-1 rounded-md font-medium">
                              {car.specs?.fuelType || 'Petrol'}
                            </span>
                            <span className="bg-gray-100 px-2.5 py-1 rounded-md font-medium">
                              {car.specs?.passengers || 5} Seats
                            </span>
                            <span className="bg-gray-100 px-2.5 py-1 rounded-md font-medium">
                              Full Insurance
                            </span>
                          </div>
                        </div>

                        {/* Footer Price & Action */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div>
                            <span className="text-[10px] text-gray-400 block uppercase font-semibold">Starting at</span>
                            <span className="font-syne text-lg font-bold text-[#111111]">
                              ₹{priceINR.toLocaleString('en-IN')}<span className="text-xs font-normal text-gray-500"> / day</span>
                            </span>
                          </div>

                          <Link
                            href={`/car-rentals/cars/${car.id}`}
                            className="btn-red-pill text-xs font-bold px-5 py-2.5 rounded-full shadow-md shadow-red-600/20 hover:scale-105 transition-all inline-flex items-center gap-1"
                          >
                            <span>Rent Car</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

        </div>
      </section>

      {bookingModalItem && (
        <BookingModal
          isOpen={!!bookingModalItem}
          onClose={() => setBookingModalItem(null)}
          item={bookingModalItem}
        />
      )}

      {/* ─── 5. COMPANY LOCATION & CONTACT SECTION ──────────────────── */}
      <CompanyLocationSection />

      <Footer />

    </div>
  );
}

export default function AestheticPortalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFC]" />}>
      <PortalContent />
    </Suspense>
  );
}

