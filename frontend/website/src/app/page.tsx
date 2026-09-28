'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Compass,
  Bus,
  Car,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Users,
  Check,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import EpicHeroShowcase from '@/components/home/EpicHeroShowcase';
import type { BookingModalItem } from '@/components/booking/BookingModal';
import { FLEET_VEHICLES, CarVehicle } from '@/constants/carsData';
import { TOUR_PACKAGES, TourPackage, SHARED_TOUR_CONTACT } from '@/constants/toursData';
import { fetchLiveTourPackages } from '@/services/tours.service';
import { fetchLiveFleetVehicles } from '@/services/fleet.service';

const BookingModal = dynamic(() => import('@/components/booking/BookingModal'), {
  ssr: false,
});

export default function MainLandingPage() {
  const [bookingModalItem, setBookingModalItem] = useState<BookingModalItem | null>(null);
  const [spotlightTab, setSpotlightTab] = useState<'all' | 'tours' | 'cars'>('all');
  const [famousTours, setFamousTours] = useState<TourPackage[]>(TOUR_PACKAGES.slice(0, 3));
  const [famousCars, setFamousCars] = useState<CarVehicle[]>([
    FLEET_VEHICLES.find((c) => c.id === 'swift-black-2026') || FLEET_VEHICLES[2],
    FLEET_VEHICLES.find((c) => c.id === 'thar-diesel-2023') || FLEET_VEHICLES[6],
    FLEET_VEHICLES.find((c) => c.id === 'fortuner-2017') || FLEET_VEHICLES[7],
  ]);

  useEffect(() => {
    fetchLiveTourPackages().then((tours) => {
      if (Array.isArray(tours) && tours.length > 0) {
        setFamousTours(tours.slice(0, 3));
      }
    });

    fetchLiveFleetVehicles().then((cars) => {
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
    <div className="min-h-screen bg-[#FCFAF6] text-[#493B34] flex flex-col font-sans select-none">
      {/* Top Navigation */}
      <Navbar vertical="home" />

      {/* 1. HERO SHOWCASE WITH COMPACT RESILIENT VIEWPORT FIT */}
      <EpicHeroShowcase />

      {/* 2. FEATURED EXPERIENCES SECTION */}
      <section className="py-14 sm:py-16 bg-[#FCFAF6] border-b border-[#EDE2D0]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Section Header & Tab Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EDE2D0] pb-6">
            <div>
              <span className="text-xs font-bold text-[#C65A2E] uppercase tracking-wider block mb-1">
                Featured Packages &amp; Fleet
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#493B34] tracking-tight">
                Top Spiritual Yatras &amp; Self-Drive Cars
              </h2>
              <p className="text-sm text-[#756B63] mt-1 font-normal">
                Handpicked pilgrimage tours and top-rated self-drive vehicles available in Pune.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center bg-[#EDE2D0]/40 p-1 rounded-xl border border-[#EDE2D0] text-xs shrink-0 self-start md:self-auto">
              <button
                onClick={() => setSpotlightTab('all')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  spotlightTab === 'all'
                    ? 'bg-white text-[#C65A2E] shadow-2xs font-semibold'
                    : 'text-[#756B63] hover:text-[#493B34]'
                }`}
              >
                All Options (6)
              </button>
              <button
                onClick={() => setSpotlightTab('tours')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  spotlightTab === 'tours'
                    ? 'bg-white text-[#C65A2E] shadow-2xs font-semibold'
                    : 'text-[#756B63] hover:text-[#C65A2E]'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#C65A2E]" />
                <span>Tours (3)</span>
              </button>
              <button
                onClick={() => setSpotlightTab('cars')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  spotlightTab === 'cars'
                    ? 'bg-white text-[#C65A2E] shadow-2xs font-semibold'
                    : 'text-[#756B63] hover:text-[#C65A2E]'
                }`}
              >
                <Car className="w-3.5 h-3.5 text-[#C65A2E]" />
                <span>Cars (3)</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* ─── TOURS SPOTLIGHT CARDS ─── */}
            {(spotlightTab === 'all' || spotlightTab === 'tours') &&
              famousTours.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#EDE2D0] shadow-sm hover:shadow-md hover:border-[#E8B9A5] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-52 w-full overflow-hidden bg-[#FDFBF7]">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg bg-[#C65A2E] text-white text-xs font-semibold shadow-xs">
                          {pkg.durationLabel || `${pkg.durationDays}D / ${pkg.durationNights}N`}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C65A2E]">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{pkg.destination}, {pkg.state}</span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-[#493B34] leading-snug">
                        {pkg.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#756B63] line-clamp-2 leading-relaxed">
                        {pkg.overview || pkg.subtitle}
                      </p>

                      {/* Inclusions pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2 py-0.5 rounded-md bg-[#FCFAF6] text-[#756B63] text-[11px] border border-[#EDE2D0]">
                          AC Hotel Stay
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#FCFAF6] text-[#756B63] text-[11px] border border-[#EDE2D0]">
                          Satvik Meals
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#FCFAF6] text-[#756B63] text-[11px] border border-[#EDE2D0]">
                          Temple Darshan Pass
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-[#EDE2D0] mt-4 space-y-4">
                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <span className="text-[11px] text-[#756B63] block">Starting from</span>
                        <span className="text-lg sm:text-xl font-bold text-[#493B34]">
                          {pkg.priceDisplay || `₹${pkg.basePrice.toLocaleString('en-IN')}`}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium text-[#C65A2E] bg-[#F8EFEA] border border-[#E8B9A5]/50 px-2.5 py-1 rounded-lg">
                          ₹{pkg.depositPrice} Advance Reserve
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <Link
                        href={`/tours-travels/${pkg.slug}`}
                        className="h-10 rounded-xl border border-[#EDE2D0] text-[#493B34] hover:text-[#C65A2E] hover:border-[#C65A2E] hover:bg-[#F8EFEA]/40 text-xs font-semibold flex items-center justify-center transition-all"
                      >
                        Itinerary
                      </Link>
                      <Link
                        href={`/tours-travels/${pkg.slug}`}
                        className="h-10 rounded-xl bg-[#C65A2E] hover:bg-[#B24E25] text-white text-xs font-semibold flex items-center justify-center transition-all shadow-xs"
                      >
                        Book Trip
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

            {/* ─── CARS SPOTLIGHT CARDS ─── */}
            {(spotlightTab === 'all' || spotlightTab === 'cars') &&
              famousCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#EDE2D0] shadow-sm hover:shadow-md hover:border-[#E8B9A5] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-52 w-full overflow-hidden bg-[#FDFBF7] flex items-center justify-center p-4">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg bg-[#493B34] text-white text-xs font-semibold shadow-xs">
                          {car.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="font-serif text-lg font-bold text-[#493B34]">
                        {car.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#756B63]">
                        {car.specs.passengers} Seater • {car.specs.transmission} • {car.specs.fuelType}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2 py-0.5 rounded-md bg-[#F8EFEA] text-[#C65A2E] border border-[#E8B9A5]/40 text-[11px] font-medium">
                          Zero Security Deposit
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#FCFAF6] text-[#756B63] text-[11px] border border-[#EDE2D0]">
                          Doorstep Delivery
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-[#EDE2D0] mt-4 space-y-4">
                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <span className="text-[11px] text-[#756B63] block">Daily Rate</span>
                        <span className="text-lg sm:text-xl font-bold text-[#493B34]">
                          ₹{car.pricePerDay.toLocaleString('en-IN')}{' '}
                          <span className="text-xs text-[#756B63]">/day</span>
                        </span>
                      </div>
                      <span className="text-xs font-medium text-[#C65A2E] bg-[#F8EFEA] border border-[#E8B9A5]/50 px-2.5 py-1 rounded-lg">
                        Instant Confirm
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <Link
                        href={`/car-rentals`}
                        className="h-10 rounded-xl border border-[#EDE2D0] text-[#493B34] hover:text-[#C65A2E] hover:border-[#C65A2E] hover:bg-[#F8EFEA]/40 text-xs font-semibold flex items-center justify-center transition-all"
                      >
                        Specs
                      </Link>
                      <button
                        onClick={() =>
                          setBookingModalItem({
                            type: 'car',
                            id: car.id,
                            title: car.name,
                            subtitle: `${car.specs.passengers} Seater • ${car.specs.fuelType}`,
                            image: car.image,
                            price: car.pricePerDay,
                            deposit: 500,
                          })
                        }
                        className="h-10 rounded-xl bg-[#C65A2E] hover:bg-[#B24E25] text-white text-xs font-semibold flex items-center justify-center transition-all shadow-xs cursor-pointer"
                      >
                        Rent Car
                      </button>
                    </div>
                  </div>
                </div>
              ))}

          </div>

          {/* Bottom Explore Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/tours-travels"
              className="inline-flex items-center gap-2 px-6 h-11 rounded-xl bg-[#F8EFEA] border border-[#E8B9A5]/60 text-[#C65A2E] text-xs sm:text-sm font-semibold hover:bg-[#F2C6A0]/30 transition-all shadow-2xs"
            >
              <Compass className="w-4 h-4 text-[#C65A2E]" />
              <span>View All Tour Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/bus-rentals"
              className="inline-flex items-center gap-2 px-6 h-11 rounded-xl bg-white border border-[#EDE2D0] text-[#493B34] text-xs sm:text-sm font-semibold hover:border-[#C65A2E] hover:text-[#C65A2E] transition-all shadow-2xs"
            >
              <Bus className="w-4 h-4 text-[#C65A2E]" />
              <span>View Bus Rental Rates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. BUS FLEET & URBANIA HIGHLIGHT */}
      <section className="py-14 sm:py-16 bg-white border-b border-[#EDE2D0]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#C65A2E] uppercase tracking-wider block mb-1">
              Executive Bus Fleet
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#493B34] tracking-tight">
              Force Urbania, Travellers &amp; Luxury Coaches
            </h2>
            <p className="text-sm text-[#756B63] mt-1 font-normal">
              Pune to anywhere in India — Corporate outings, family weddings, and pilgrimage yatras.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-[#FCFAF6] border border-[#EDE2D0] space-y-4 hover:border-[#E8B9A5] transition-all shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-[#C65A2E] text-white text-xs font-semibold shadow-2xs">
                  17 Seater
                </span>
                <span className="text-sm text-[#493B34] font-bold">₹28 / KM</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#493B34]">Force Urbania (Luxury AC)</h3>
              <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed">
                Reclining leather seats, panoramic windows, ambient lighting, dual AC, and spacious luggage bay.
              </p>
              <div className="pt-2">
                <Link href="/bus-rentals" className="text-xs sm:text-sm font-semibold text-[#C65A2E] hover:underline inline-flex items-center gap-1">
                  <span>Calculate Trip Fare</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FCFAF6] border border-[#EDE2D0] space-y-4 hover:border-[#E8B9A5] transition-all shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-[#C65A2E] text-white text-xs font-semibold shadow-2xs">
                  26 Seater
                </span>
                <span className="text-sm text-[#493B34] font-bold">₹32 / KM</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#493B34]">Force Traveller (Executive)</h3>
              <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed">
                2x1 pushback seats, individual AC vents, charging points, and experienced highway driver.
              </p>
              <div className="pt-2">
                <Link href="/bus-rentals" className="text-xs sm:text-sm font-semibold text-[#C65A2E] hover:underline inline-flex items-center gap-1">
                  <span>Calculate Trip Fare</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FCFAF6] border border-[#EDE2D0] space-y-4 hover:border-[#E8B9A5] transition-all shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-[#C65A2E] text-white text-xs font-semibold shadow-2xs">
                  32 - 45 Seater
                </span>
                <span className="text-sm text-[#493B34] font-bold">₹42 - ₹55 / KM</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#493B34]">BharatBenz Luxury Coach</h3>
              <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed">
                Air suspension, pneumatic pushback seats, surround audio system, and clean curtain interiors.
              </p>
              <div className="pt-2">
                <Link href="/bus-rentals" className="text-xs sm:text-sm font-semibold text-[#C65A2E] hover:underline inline-flex items-center gap-1">
                  <span>Calculate Trip Fare</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. WHY CHOOSE AARAMBHA & 24/7 SUPPORT */}
      <section className="py-14 sm:py-16 bg-[#FCFAF6] border-b border-[#EDE2D0]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#C65A2E] uppercase tracking-wider block">
              Reliable &amp; Transparent
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#493B34] tracking-tight">
              Why Travelers Choose आरंभ
            </h2>
            <p className="text-sm text-[#756B63]">
              Clean vehicles, upfront pricing with no hidden charges, and round-the-clock dedicated customer assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-white border border-[#EDE2D0] space-y-3 hover:border-[#E8B9A5] transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#F8EFEA] text-[#C65A2E] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#493B34]">Verified AC Stays &amp; Fleet</h3>
              <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed">
                Clean hotel rooms, pure satvik meals on tours, and fully sanitized vehicles with insurance cover.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EDE2D0] space-y-3 hover:border-[#E8B9A5] transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#F8EFEA] text-[#C65A2E] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#493B34]">Doorstep Delivery in Pune</h3>
              <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed">
                Self-drive cars delivered right to your location, Pune Railway Station, or Pune International Airport.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EDE2D0] space-y-3 hover:border-[#E8B9A5] transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#F8EFEA] text-[#C65A2E] flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#493B34]">₹500 Deposit Reserve</h3>
              <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed">
                Reserve your batch date or vehicle with a small advance deposit and pay the remainder on boarding.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EDE2D0] space-y-3 hover:border-[#E8B9A5] transition-all shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#F8EFEA] text-[#C65A2E] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#493B34]">24x7 Customer Support</h3>
              <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed">
                Direct WhatsApp assistance and live tour coordinators available throughout your journey.
              </p>
            </div>

          </div>

          {/* Enterprise Support Banner */}
          <div className="rounded-2xl bg-[#493B34] p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#EDE2D0]/20 shadow-lg">
            <div className="space-y-2 text-center md:text-left max-w-xl">
              <span className="text-xs font-semibold text-[#E8B9A5] uppercase tracking-wider block">
                Direct Booking Helpline
              </span>
              <h3 className="font-serif text-2xl sm:text-[28px] font-bold text-white leading-tight">
                Have custom itinerary or corporate bus rental requirements?
              </h3>
              <p className="text-xs sm:text-sm text-[#EDE2D0]/80">
                Speak directly with our reservation team for instant quotes and group discounts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <a
                href="https://wa.me/919067617451?text=Hello%20Aarambha%20Travels,%20I%20want%20to%20inquire%20about%20a%20booking"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 h-11 rounded-xl bg-[#C65A2E] hover:bg-[#B24E25] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>

              <a
                href={`tel:${SHARED_TOUR_CONTACT.phone1 || '+919067617451'}`}
                className="w-full sm:w-auto px-6 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border border-white/20 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>+91 90676 17451</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 5. FOOTER */}
      <Footer />

      {/* Dynamic Booking Modal Triggered from Top Picks */}
      {bookingModalItem && (
        <BookingModal
          item={bookingModalItem}
          isOpen={!!bookingModalItem}
          onClose={() => setBookingModalItem(null)}
        />
      )}
    </div>
  );
}
