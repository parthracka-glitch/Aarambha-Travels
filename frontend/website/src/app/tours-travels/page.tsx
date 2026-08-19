'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, ArrowUpRight, Sparkles, Globe, MessageCircle, Share2, Compass, Phone, Calendar, ShieldCheck, Check, Info, CreditCard, Car, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';
import FAQSection from '@/components/home/FAQSection';
import WhatsAppEnquiryForm from '@/components/home/WhatsAppEnquiryForm';
import CompanyLocationSection from '@/components/home/CompanyLocationSection';
import BookingModal, { BookingModalItem } from '@/components/booking/BookingModal';
import { TOUR_PACKAGES, SHARED_TOUR_CONTACT } from '@/constants/toursData';
import { FLEET_VEHICLES } from '@/constants/carsData';

export default function ToursCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedBookingTour, setSelectedBookingTour] = useState<BookingModalItem | null>(null);

  const filteredPackages = TOUR_PACKAGES.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.sites.some((site) => site.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedDuration === 'short') return matchesSearch && pkg.durationDays <= 3;
    if (selectedDuration === 'long') return matchesSearch && pkg.durationDays > 3;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      
      <Navbar vertical="tours" />

      {/* ─── 1. FULL-SCREEN HERO SECTION ──────────────────────────── */}
      <section className="relative min-h-[75vh] lg:min-h-[80vh] flex items-center justify-center text-center overflow-hidden bg-gray-950 text-white border-b border-gray-800">
        
        {/* Full-bleed background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/tours_travels_bg.jpg?v=2"
            alt="Scenic Pilgrimage Departure - Aarambha Tours & Travels"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-center scale-105 filter brightness-110 contrast-105"
          />
          {/* Lightened gradient overlay for a bright, clear scenery background */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
        </div>

        {/* Hero Content Overlay (Centered) */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 w-full flex flex-col items-center justify-center text-center">
          <div className="max-w-3xl space-y-5 flex flex-col items-center justify-center text-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-400/30 text-xs font-semibold text-emerald-300 tracking-wide shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> SACRED PILGRIMAGE DEPARTURES 2026
            </div>

            <h1 className="font-syne text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
              Aarambha Pilgrimage Tour Packages
            </h1>

            <p className="text-xs sm:text-sm text-gray-200 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow">
              Experience sanctified Yatra departures across India’s most revered Jyotirlingas, Shaktipeeths, and Krishna Bhoomi temples. Complete with New Urbania Pushback AC comfort, verified hotel stays, pure veg meals, and 24/7 assistance.
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#packages-catalog"
                className="btn-emerald-pill text-xs font-bold px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105 transition-all inline-flex items-center gap-2 shadow-2xl shadow-emerald-600/40"
              >
                <span>View All 3 Yatra Packages</span>
                <Compass className="w-4 h-4" />
              </a>

              <a
                href={`tel:+91${SHARED_TOUR_CONTACT.phone1}`}
                className="text-xs font-bold px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md transition-all inline-flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call {SHARED_TOUR_CONTACT.phone1Display}</span>
              </a>
            </div>

            {/* Quick Contact & Instagram Strip */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-300">
              <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/10">
                <Phone className="w-3 h-3 text-emerald-400" /> Helpline: {SHARED_TOUR_CONTACT.phone1Display} / {SHARED_TOUR_CONTACT.phone2Display}
              </span>
              <a
                href={SHARED_TOUR_CONTACT.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-black/40 hover:bg-pink-900/40 px-3 py-1 rounded-full border border-white/10 hover:border-pink-400/40 text-pink-300 transition-colors"
              >
                <Globe className="w-3 h-3 text-pink-400" /> Follow @aarambha_tours_travels
              </a>
            </div>

          </div>
        </div>

      </section>

      {/* ─── 2. SEARCH & DURATION FILTER BAR ───────────────────────── */}
      <section id="packages-catalog" className="py-4 bg-white border-b border-gray-200 sticky top-16 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="text-gray-600 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Showing {filteredPackages.length} Sacred Pilgrimage Packages
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Duration Selector Pills */}
            <div className="flex items-center gap-1 bg-[#F8F9FA] p-1 rounded-full border border-gray-200 font-medium">
              <button
                onClick={() => setSelectedDuration('all')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  selectedDuration === 'all' ? 'bg-emerald-600 text-white font-bold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Yatras
              </button>
              <button
                onClick={() => setSelectedDuration('short')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  selectedDuration === 'short' ? 'bg-emerald-600 text-white font-bold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                3 Days Yatra
              </button>
              <button
                onClick={() => setSelectedDuration('long')}
                className={`px-3 py-1 rounded-full transition-colors ${
                  selectedDuration === 'long' ? 'bg-emerald-600 text-white font-bold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                6 Days Yatra
              </button>
            </div>

            {/* Search Input Box */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search temples, Jyotirlinga, city..."
                className="w-full bg-[#F8F9FA] border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-xs text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-emerald-600"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

        </div>
      </section>

      {/* ─── 3. CATALOG PACKAGES GRID ─────────────────────────────── */}
      <section className="py-12 bg-[#FAFAFC] content-defer">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredPackages.map((pkg) => {
              const whatsappText = `*AARAMBHA TOUR INQUIRY*%0A━━━━━━━━━━━━━━━━━━━━%0A🧭 *Package:* ${pkg.title}%0A📅 *Dates:* ${pkg.datesLabel}%0A💰 *Price:* ${pkg.priceDisplay}%0A🔖 *Advance:* ${pkg.advanceLabel}%0A━━━━━━━━━━━━━━━━━━━━%0APlease share available seats & booking details.`;
              const whatsappUrl = `https://wa.me/${SHARED_TOUR_CONTACT.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
              const callUrl = `tel:+91${SHARED_TOUR_CONTACT.phone1}`;

              return (
                <div
                  key={pkg.id}
                  className="rounded-2xl bg-white border border-gray-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <div>
                    {/* Image Header with Badges */}
                    <div className="relative h-56 bg-gray-900 overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

                      {/* Duration Badge (Top-Left) */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#111111]/90 backdrop-blur-md text-white text-[11px] font-bold font-syne uppercase border border-white/20">
                        {pkg.durationLabel}
                      </div>

                      {/* Advance Amount Badge (Top-Right) */}
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold font-syne shadow-md flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{pkg.advanceLabel}</span>
                      </div>

                      {/* Travel Dates Ribbon (Bottom) */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                        <span className="flex items-center gap-1.5 text-amber-300">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" /> {pkg.datesLabel}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-300">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {pkg.rating} ({pkg.reviewsCount})
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3.5">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {pkg.destination}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                          {pkg.sites.length} Sacred Sites
                        </span>
                      </div>

                      <h3 className="font-syne text-base font-bold text-[#111111] leading-tight group-hover:text-emerald-700 transition-colors">
                        <Link href={`/tours-travels/${pkg.slug}`}>{pkg.title}</Link>
                      </h3>
                      
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-normal">
                        {pkg.subtitle}
                      </p>

                      {/* Sites Covered Highlight Tags */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-syne">
                          Key Temples & Sites ({pkg.sites.length} Total):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {pkg.sites.slice(0, 4).map((site, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] text-emerald-800 font-medium border border-emerald-100">
                              ✓ {site}
                            </span>
                          ))}
                          {pkg.sites.length > 4 && (
                            <span className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] text-gray-600 font-semibold">
                              +{pkg.sites.length - 4} more sites
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Inclusions Highlights */}
                      <div className="space-y-1 pt-1 border-t border-gray-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block font-syne">
                          Package Inclusions:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {pkg.inclusions.slice(0, 3).map((inc, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] text-gray-700">
                              {inc}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Card Footer: Price & Direct CTA Action Buttons */}
                  <div className="px-5 pb-5 pt-3 border-t border-gray-100 bg-[#FAFAFC] space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold uppercase">Tour Fare</span>
                        <span className="font-syne text-base sm:text-lg font-extrabold text-[#111111]">
                          {pkg.priceDisplay}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-700 font-bold block bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {pkg.advanceLabel}
                        </span>
                      </div>
                    </div>

                    {/* Primary Online Booking CTA */}
                    <button
                      onClick={() =>
                        setSelectedBookingTour({
                          id: pkg.id,
                          type: 'tour',
                          title: pkg.title,
                          subtitle: `${pkg.durationLabel} • ${pkg.datesLabel}`,
                          image: pkg.image,
                          price: pkg.basePrice,
                          deposit: pkg.depositPrice || 2999,
                        })
                      }
                      className="w-full py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-99 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Book Now Online ({pkg.advanceLabel})</span>
                    </button>

                    {/* Secondary CTA Buttons: Call + WhatsApp + View Details */}
                    <div className="grid grid-cols-3 gap-2 pt-0.5">
                      {/* Call CTA */}
                      <a
                        href={callUrl}
                        className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-sm"
                        title={`Call ${SHARED_TOUR_CONTACT.phone1Display}`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>

                      {/* WhatsApp CTA */}
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#0D1912] hover:bg-[#152B1E] text-emerald-300 font-bold text-xs transition-colors shadow-sm border border-emerald-500/30"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      {/* Detail CTA */}
                      <Link
                        href={`/tours-travels/${pkg.slug}`}
                        className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-[#111111] hover:bg-gray-800 text-white font-bold text-xs transition-colors shadow-sm"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

          {/* ─── 3B. POPULAR 3-CAR SELF-DRIVE FLEET COMPANION ─────────────── */}
          <div className="pt-12 mt-12 border-t border-gray-200/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#FF3B30] border border-red-200 text-[10px] font-bold uppercase tracking-wider font-syne">
                  <Car className="w-3.5 h-3.5" /> SELF-DRIVE FLEET
                </div>
                <h3 className="font-syne text-xl sm:text-2xl font-extrabold text-[#111111] tracking-tight">
                  Prefer a Private Roadtrip? Explore Top 3 Self-Drive Cars
                </h3>
                <p className="text-xs text-gray-500 font-normal">
                  Drive to your pilgrimage or holiday destination on your own schedule with zero security deposit friction.
                </p>
              </div>

              <Link
                href="/car-rentals/cars"
                className="btn-red-pill text-xs font-bold px-6 py-2.5 rounded-full shadow-md shadow-red-600/20 hover:scale-105 transition-all inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <span>Explore All 8 Cars</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                FLEET_VEHICLES.find((c) => c.id === 'swift-black-2026') || FLEET_VEHICLES[2],
                FLEET_VEHICLES.find((c) => c.id === 'thar-diesel-2023') || FLEET_VEHICLES[6],
                FLEET_VEHICLES.find((c) => c.id === 'fortuner-2017') || FLEET_VEHICLES[7],
              ].map((car) => {
                const priceINR = car.pricePerDay;
                return (
                  <div
                    key={car.id}
                    className="rounded-2xl bg-white border border-gray-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Clean Studio Image Header */}
                    <div className="relative h-48 bg-[#F4F5F7] overflow-hidden flex items-center justify-center">
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
                          className="btn-red-pill text-xs font-bold px-5 py-2 rounded-full shadow-md shadow-red-600/20 hover:scale-105 transition-all inline-flex items-center gap-1"
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

      {/* ─── 4. SHARED DEDICATED PILGRIMAGE CONTACT BLOCK ─────────── */}
      <section className="py-12 bg-white border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="rounded-3xl bg-gradient-to-br from-[#0D1912] to-[#12251A] text-white p-8 sm:p-10 border border-emerald-500/20 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-syne uppercase tracking-wider inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Official Travel Assistance Desk
              </span>
              <h3 className="font-syne text-2xl sm:text-3xl font-extrabold text-white">
                Book Your Sacred Yatra With Aarambha
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                Speak directly with our pilgrimage travel desk to confirm batch dates, seat allocation in 2x2 AC coaches/Urbania, and advance receipt verification.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-300">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> {SHARED_TOUR_CONTACT.phone1Display} / {SHARED_TOUR_CONTACT.phone2Display}
                </span>
                <span className="flex items-center gap-1.5 text-gray-400">
                  <MapPin className="w-3.5 h-3.5 text-red-400" /> Katraj, Pune, Maharashtra
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <a
                href={`https://wa.me/${SHARED_TOUR_CONTACT.whatsappNumber}?text=Hi%20Aarambha%20Tours,%20I%20want%20to%20inquire%20about%20Pilgrimage%20Tour%20Packages.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Booking</span>
              </a>

              <a
                href={`tel:+91${SHARED_TOUR_CONTACT.phone1}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#FF3B30] hover:bg-[#E03126] text-white font-bold text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 transition-all hover:scale-105"
              >
                <Phone className="w-4 h-4" />
                <span>Call {SHARED_TOUR_CONTACT.phone1Display}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedBookingTour && (
        <BookingModal
          isOpen={!!selectedBookingTour}
          onClose={() => setSelectedBookingTour(null)}
          item={selectedBookingTour}
        />
      )}

      {/* ─── 5. DEDICATED TOURS & TRAVELS FAQS ────────────────────── */}
      <FAQSection mode="tours" />

      {/* ─── 6. DEDICATED TOURS & TRAVELS WHATSAPP INQUIRY FORM ───── */}
      <WhatsAppEnquiryForm mode="tours" />

      {/* ─── 7. TOURS & TRAVELS LOCATION & CONTACT ────────────────── */}
      <CompanyLocationSection mode="tours" />

      {/* ─── 8. DEDICATED TOUR PACKAGES TERMS & CONDITIONS ─────────── */}
      <TermsConditionsSection mode="tours" />

      <Footer />

    </div>
  );
}
