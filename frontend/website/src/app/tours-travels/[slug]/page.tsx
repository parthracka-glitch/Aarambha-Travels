'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, ShieldCheck, ArrowLeft, Calendar, Phone, MessageCircle, MapPin, Sparkles, AlertCircle, Info, Star, CreditCard, User, Car, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';
import BookingModal, { BookingModalItem } from '@/components/booking/BookingModal';
import { TOUR_PACKAGES, SHARED_TOUR_CONTACT } from '@/constants/toursData';
import { FLEET_VEHICLES } from '@/constants/carsData';

export default function TourPackageDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const tour = TOUR_PACKAGES.find((t) => t.slug === slug || t.id === slug) || TOUR_PACKAGES[0];

  const [selectedImage, setSelectedImage] = useState(tour.image);
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const modalItem: BookingModalItem = {
    id: tour.id,
    type: 'tour',
    title: tour.title,
    subtitle: `${tour.durationLabel} • ${tour.datesLabel}`,
    image: tour.image,
    price: tour.basePrice,
    deposit: tour.depositPrice || 2999,
  };

  const toggleDay = (dayNum: number) => {
    setOpenDay(openDay === dayNum ? null : dayNum);
  };

  const whatsappBookingMessage = `*AARAMBHA PILGRIMAGE BOOKING INQUIRY*%0A━━━━━━━━━━━━━━━━━━━━%0A🧭 *Tour Package:* ${tour.title}%0A📅 *Travel Dates:* ${tour.datesLabel}%0A⏱ *Duration:* ${tour.durationLabel}%0A💰 *Fare:* ${tour.priceDisplay}%0A🔖 *Advance Deposit:* ${tour.advanceLabel}%0A━━━━━━━━━━━━━━━━━━━━%0AName:%20%0ANumber of Travelers:%20%0APlease confirm booking availability and seat allotment.`;
  const whatsappUrl = `https://wa.me/${SHARED_TOUR_CONTACT.whatsappNumber}?text=${encodeURIComponent(whatsappBookingMessage)}`;
  const callUrl1 = `tel:+91${SHARED_TOUR_CONTACT.phone1}`;
  const callUrl2 = `tel:+91${SHARED_TOUR_CONTACT.phone2}`;

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      
      <Navbar vertical="tours" />

      {/* ─── 1. BREADCRUMB & HERO HEADER ──────────────────────────── */}
      <section className="relative bg-[#0D1912] text-white py-12 overflow-hidden border-b border-gray-800">
        <img
          src={tour.image}
          alt={tour.title}
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-30 filter brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1912] via-black/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/tours-travels"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white font-syne transition-colors bg-white/10 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Pilgrimage Tours
            </Link>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" /> Book Now Online ({tour.advanceLabel})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 font-semibold font-syne">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {tour.durationLabel}
            </span>
            <span className="flex items-center gap-1 text-amber-300 bg-black/50 px-2.5 py-0.5 rounded-full border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> {tour.datesLabel}
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> {tour.rating} ({tour.reviewsCount} Pilgrim Reviews)
            </span>
          </div>

          <h1 className="font-syne text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {tour.title}
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed font-normal">
            {tour.subtitle}
          </p>
        </div>
      </section>

      {/* ─── 2. MAIN OVERVIEW & BOOKING CARD GRID ─────────────────── */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Image & Gallery */}
              <div className="space-y-3">
                <div className="bg-gray-100 rounded-2xl h-[300px] sm:h-[400px] overflow-hidden border border-gray-200 shadow-sm relative">
                  <img
                    src={selectedImage}
                    alt={tour.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-bold font-syne">
                    {tour.destination}
                  </div>
                </div>

                {tour.gallery.length > 1 && (
                  <div className="grid grid-cols-3 gap-3">
                    {tour.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`rounded-xl h-20 sm:h-24 overflow-hidden border transition-all ${
                          selectedImage === img
                            ? 'border-2 border-emerald-600 ring-2 ring-emerald-600/30'
                            : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Pilgrimage Overview */}
              <div className="rounded-2xl bg-[#FAFAFC] border border-gray-200 p-6 space-y-3">
                <h2 className="font-syne text-lg font-bold text-[#111111] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> Sacred Yatra Overview
                </h2>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                  {tour.overview}
                </p>
              </div>

              {/* Complete Holy Sites / Temples List (Card / Grid) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <h2 className="font-syne text-xl font-bold text-[#111111] tracking-tight">
                      Sacred Sites & Temples Covered
                    </h2>
                    <p className="text-xs text-gray-500 font-normal">
                      Complete list of all {tour.sites.length} auspicious places included in this departure
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {tour.sites.length} Holy Sites
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {tour.sites.map((site, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-[#FAFAFC] border border-gray-200 flex items-start gap-2.5 hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-xs font-semibold text-gray-800 leading-snug">
                        {site}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day-by-Day Detailed Itinerary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <h2 className="font-syne text-xl font-bold text-[#111111] tracking-tight">
                    Day-by-Day Tour Itinerary
                  </h2>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {tour.durationLabel}
                  </span>
                </div>

                <div className="space-y-3 font-sans">
                  {tour.itinerary.map((item) => {
                    const isOpen = openDay === item.day;
                    return (
                      <div
                        key={item.day}
                        className={`rounded-2xl border transition-all overflow-hidden ${
                          isOpen
                            ? 'border-emerald-600 bg-emerald-50/20 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <button
                          onClick={() => toggleDay(item.day)}
                          className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-syne font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                              D{item.day}
                            </span>
                            <h3 className="font-syne text-sm font-bold text-[#111111]">
                              {item.title}
                            </h3>
                          </div>

                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-emerald-600 shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs space-y-3 border-t border-emerald-100/60 font-sans">
                            <p className="text-gray-700 leading-relaxed font-normal text-xs sm:text-sm">
                              {item.description}
                            </p>

                            {item.highlights && item.highlights.length > 0 && (
                              <div className="pt-2">
                                <span className="font-bold text-emerald-800 text-[10px] block uppercase font-syne mb-1.5">
                                  Day Highlights & Darshan:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {item.highlights.map((h, i) => (
                                    <span
                                      key={i}
                                      className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-900 font-semibold text-[11px] shadow-xs"
                                    >
                                      ✓ {h}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-6 space-y-3">
                  <h3 className="font-syne text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> WHAT IS INCLUDED
                  </h3>
                  <ul className="space-y-2 text-xs text-gray-800 font-medium">
                    {tour.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50/30 border border-red-200/60 rounded-2xl p-6 space-y-3">
                  <h3 className="font-syne text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-red-500" /> WHAT IS EXCLUDED
                  </h3>
                  <ul className="space-y-2 text-xs text-gray-700">
                    {tour.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">✕</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Package Terms & Conditions Block */}
              <div className="rounded-2xl bg-amber-50/40 border border-amber-200/70 p-6 space-y-3">
                <h3 className="font-syne text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> TOUR BOOKING TERMS & POLICY
                </h3>
                <ul className="space-y-2 text-xs text-amber-950 font-medium">
                  {tour.terms.map((term, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Right Sticky Booking Pricing Card */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
              
              <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-6 shadow-lg">
                
                {/* Pricing & Advance Strip */}
                <div className="space-y-2 pb-4 border-b border-gray-100">
                  <span className="text-[10px] text-gray-400 block uppercase font-extrabold tracking-wider">
                    Tour Package Fare
                  </span>
                  
                  <div className="space-y-1">
                    <div className="font-syne text-2xl font-extrabold text-[#111111]">
                      {tour.priceDisplay}
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{tour.advanceLabel}</span>
                  </div>
                </div>

                {/* Key Departures Snapshot */}
                <div className="space-y-2.5 text-xs text-gray-600">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Travel Dates:</span>
                    <strong className="text-[#111111] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" /> {tour.datesLabel}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Duration:</span>
                    <strong className="text-[#111111]">{tour.durationLabel}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Covered Sites:</span>
                    <strong className="text-emerald-700 font-bold">{tour.sites.length} Temples & Ghats</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Booking Advance:</span>
                    <strong className="text-emerald-600 font-bold">{tour.advanceLabel}</strong>
                  </div>
                </div>

                {/* Direct Action Buttons: Online Booking, WhatsApp & Call */}
                <div className="space-y-2.5 pt-2">
                  {/* Primary Book Now Online Button */}
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 text-center cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Book Now Online ({tour.advanceLabel})</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-2xl bg-[#0D1912] hover:bg-[#152B1E] text-emerald-300 font-bold text-xs tracking-wider uppercase transition-all border border-emerald-500/30 flex items-center justify-center gap-2 text-center"
                  >
                    <MessageCircle className="w-4 h-4 fill-emerald-400" />
                    <span>Book on WhatsApp</span>
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={callUrl1}
                      className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm text-center"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call {SHARED_TOUR_CONTACT.phone1}</span>
                    </a>

                    <a
                      href={callUrl2}
                      className="py-2.5 px-3 rounded-xl bg-[#111111] hover:bg-gray-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm text-center"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call {SHARED_TOUR_CONTACT.phone2}</span>
                    </a>
                  </div>
                </div>

                {/* Trust & Guarantee Notes */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-[11px] text-gray-500 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gray-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Aarambha Tour Guarantee</span>
                  </div>
                  <p className="text-[10px] leading-relaxed">
                    Verified AC vehicle with experienced pilgrimage driver, hotel reservation confirmation, and on-trip assistance.
                  </p>
                </div>

              </div>

              {/* Shared Contact Card Block */}
              <div className="bg-[#FAFAFC] border border-gray-200 rounded-3xl p-5 space-y-3 text-xs">
                <h4 className="font-syne font-bold text-[#111111] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> Travel Desk Office
                </h4>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  {SHARED_TOUR_CONTACT.address}
                </p>
                <div className="pt-2 border-t border-gray-200 flex flex-col gap-1.5 text-[11px]">
                  <span className="text-gray-700">
                    <strong>Helpline:</strong> {SHARED_TOUR_CONTACT.phone1Display} / {SHARED_TOUR_CONTACT.phone2Display}
                  </span>
                  <a
                    href={SHARED_TOUR_CONTACT.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:underline font-bold"
                  >
                    Instagram: @aarambha_tours_travels
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─── 3. TOP 3 SELF-DRIVE CARS FOR THIS TOUR / ROADTRIP ───────── */}
      <section className="py-14 bg-[#FAFAFC] border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#FF3B30] border border-red-200 text-[10px] font-bold uppercase tracking-wider font-syne">
                <Car className="w-3.5 h-3.5" /> SELF-DRIVE FLEET
              </div>
              <h3 className="font-syne text-xl sm:text-2xl font-extrabold text-[#111111] tracking-tight">
                Self-Drive Car Options for {tour.title.split('–')[0].split('-')[0].trim()}
              </h3>
              <p className="text-xs text-gray-500 font-normal">
                Prefer driving yourself or with family? Rent from our pristine, fully insured fleet with zero deposit friction.
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
      </section>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          item={modalItem}
        />
      )}

      {/* Tour Package Terms & Conditions */}
      <TermsConditionsSection mode="tours" />

      <Footer />

    </div>
  );
}
