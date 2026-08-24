'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, ShieldCheck, ArrowLeft, Calendar, Phone, MessageCircle, MapPin, Sparkles, AlertCircle, Info, Star, CreditCard, User, Car, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';
import BookingModal, { BookingModalItem } from '@/components/booking/BookingModal';
import { TOUR_PACKAGES, SHARED_TOUR_CONTACT, TourPackage } from '@/constants/toursData';
import { fetchLiveTourPackageBySlug } from '@/services/tours.service';

export default function TourPackageDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const defaultTour = TOUR_PACKAGES.find((t) => t.slug === slug || t.id === slug) || TOUR_PACKAGES[0];
  const [tour, setTour] = useState<TourPackage>(defaultTour);
  const [selectedImage, setSelectedImage] = useState(defaultTour.image);
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string | undefined>(undefined);
  const [batchMonthFilter, setBatchMonthFilter] = useState('All');

  useEffect(() => {
    if (slug) {
      fetchLiveTourPackageBySlug(slug).then((liveTour) => {
        if (liveTour) {
          setTour(liveTour);
          setSelectedImage(liveTour.image);
        }
      });
    }
  }, [slug]);

  const modalItem: BookingModalItem = {
    id: tour.id,
    type: 'tour',
    title: tour.title,
    subtitle: `${tour.durationLabel} • ${tour.datesLabel}`,
    image: tour.image,
    price: tour.basePrice,
    deposit: tour.depositPrice || 2999,
    batchDates: tour.batchDates,
    initialBatchId: selectedBatchId,
  };

  const handleBookBatch = (batchId: string) => {
    setSelectedBatchId(batchId);
    setIsBookingModalOpen(true);
  };

  const toggleDay = (dayNum: number) => {
    setOpenDay(openDay === dayNum ? null : dayNum);
  };

  const whatsappBookingMessage = `*AARAMBHA PILGRIMAGE BOOKING INQUIRY*%0A━━━━━━━━━━━━━━━━━━━━%0A🧭 *Tour Package:* ${tour.title}%0A📅 *Travel Dates:* ${tour.datesLabel}%0A⏱ *Duration:* ${tour.durationLabel}%0A💰 *Fare:* ${tour.priceDisplay}%0A🔖 *Advance Deposit:* ${tour.advanceLabel}%0A━━━━━━━━━━━━━━━━━━━━%0AName:%20%0ANumber of Travelers:%20%0APlease confirm booking availability and seat allotment.`;
  const whatsappUrl = `https://wa.me/${SHARED_TOUR_CONTACT.whatsappNumber}?text=${encodeURIComponent(whatsappBookingMessage)}`;
  const callUrl1 = `tel:+91${SHARED_TOUR_CONTACT.phone1}`;
  const callUrl2 = `tel:+91${SHARED_TOUR_CONTACT.phone2}`;

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-[#5266EB] selection:text-white">
      
      <Navbar vertical="tours" />

      {/* ─── 1. BREADCRUMB & HERO HEADER ──────────────────────────── */}
      <section className="relative bg-[#171721] text-white py-12 overflow-hidden border-b border-[#272735]">
        <img
          src={tour.image}
          alt={tour.title}
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-30 filter brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171721] via-black/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/tours-travels"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9CB4E8] hover:text-white font-syne transition-colors bg-white/10 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Pilgrimage Tours
            </Link>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#EDEDF3] bg-[#5266EB] hover:bg-[#3E51D4] px-4 py-2 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" /> Book Now Online ({tour.advanceLabel})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#EDEDF3] font-semibold font-syne">
            <span className="px-2.5 py-0.5 rounded-full bg-[#5266EB]/20 text-[#9CB4E8] border border-[#5266EB]/30">
              {tour.durationLabel}
            </span>
            <span className="flex items-center gap-1 text-[#AFB2CE] bg-[#171721]/80 px-2.5 py-0.5 rounded-full border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-[#9CB4E8]" /> {tour.datesLabel}
            </span>
            <span className="flex items-center gap-1 text-[#9CB4E8]">
              <Star className="w-3.5 h-3.5 fill-[#9CB4E8]" /> {tour.rating} ({tour.reviewsCount} Pilgrim Reviews)
            </span>
          </div>

          <h1 className="font-syne text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {tour.title}
          </h1>

          <p className="text-xs sm:text-sm text-[#AFB2CE] max-w-2xl leading-relaxed font-normal">
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
                            ? 'border-2 border-[#5266EB] ring-2 ring-[#5266EB]/30'
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
                <h2 className="font-syne text-lg font-bold text-[#000000] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#5266EB]" /> Sacred Yatra Overview
                </h2>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                  {tour.overview}
                </p>
              </div>

              {/* Complete Holy Sites / Temples List (Card / Grid) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div>
                    <h2 className="font-syne text-xl font-bold text-[#000000] tracking-tight">
                      Sacred Sites & Temples Covered
                    </h2>
                    <p className="text-xs text-gray-500 font-normal">
                      Complete list of all {tour.sites.length} auspicious places included in this departure
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#171721] bg-[#9CB4E8]/20 px-3 py-1 rounded-full border border-[#9CB4E8]/40">
                    {tour.sites.length} Holy Sites
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {tour.sites.map((site, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-[#FAFAFC] border border-gray-200 flex items-start gap-2.5 hover:border-[#5266EB]/40 hover:bg-[#5266EB]/5 transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#5266EB] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-xs font-semibold text-gray-800 leading-snug">
                        {site}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Departure Batches & Dates (Synced with Admin Panel) */}
              {tour.batchDates && tour.batchDates.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3 gap-2">
                    <div>
                      <h2 className="font-syne text-xl font-bold text-[#000000] tracking-tight flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#5266EB]" />
                        <span>Upcoming Departure Batches & Live Dates</span>
                      </h2>
                      <p className="text-xs text-gray-500 font-normal mt-0.5">
                        Select an official departure batch to lock your seats with ₹{tour.depositPrice || 2500} advance
                      </p>
                    </div>
                    <span className="self-start sm:self-auto text-xs font-bold text-[#5266EB] bg-[#5266EB]/10 px-3 py-1 rounded-full border border-[#5266EB]/20">
                      {tour.batchDates.length} Scheduled Batches
                    </span>
                  </div>

                  {/* Month Filter Tabs (if multiple months exist) */}
                  {Array.from(new Set(tour.batchDates.map((b) => b.month || 'Other'))).length > 1 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => setBatchMonthFilter('All')}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-syne transition-all cursor-pointer ${
                          batchMonthFilter === 'All'
                            ? 'bg-[#5266EB] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        All Months ({tour.batchDates.length})
                      </button>
                      {Array.from(new Set(tour.batchDates.map((b) => b.month || 'Other'))).map((month) => (
                        <button
                          key={month}
                          onClick={() => setBatchMonthFilter(month)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-syne transition-all cursor-pointer ${
                            batchMonthFilter === month
                              ? 'bg-[#5266EB] text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Batch Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    {tour.batchDates
                      .filter((b) => batchMonthFilter === 'All' || b.month === batchMonthFilter)
                      .map((batch) => {
                        const isFull = batch.status === 'full';
                        return (
                          <div
                            key={batch.id}
                            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 relative ${
                              isFull
                                ? 'bg-gray-50 border-gray-200 opacity-75'
                                : 'bg-white border-gray-200 hover:border-[#5266EB]/50 hover:shadow-md'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5266EB] bg-[#5266EB]/10 px-2 py-0.5 rounded-md">
                                  {batch.tag || `${batch.month} Batch`}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    isFull
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-emerald-100 text-emerald-700'
                                  }`}
                                >
                                  {isFull ? 'Batch Full' : 'Available'}
                                </span>
                              </div>
                              <h4 className="font-syne font-bold text-xs sm:text-sm text-gray-900 pt-1">
                                {batch.label}
                              </h4>
                              <p className="text-[11px] text-gray-500">
                                {tour.durationLabel}
                              </p>
                            </div>

                            <button
                              disabled={isFull}
                              onClick={() => handleBookBatch(batch.id)}
                              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold font-syne uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                isFull
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-[#5266EB] text-white hover:bg-[#3E51D4] shadow-sm'
                              }`}
                            >
                              <span>{isFull ? 'Sold Out' : 'Select & Book'}</span>
                              {!isFull && <ArrowRight className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

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
                            ? 'border-[#5266EB] bg-[#5266EB]/5 shadow-sm'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <button
                          onClick={() => toggleDay(item.day)}
                          className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-[#5266EB] text-white font-syne font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                              D{item.day}
                            </span>
                            <h3 className="font-syne text-sm font-bold text-[#000000]">
                              {item.title}
                            </h3>
                          </div>

                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-[#5266EB] shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs space-y-3 border-t border-[#9CB4E8]/30 font-sans">
                            <p className="text-gray-700 leading-relaxed font-normal text-xs sm:text-sm">
                              {item.description}
                            </p>

                            {item.highlights && item.highlights.length > 0 && (
                              <div className="pt-2">
                                <span className="font-bold text-[#5266EB] text-[10px] block uppercase font-syne mb-1.5">
                                  Day Highlights & Darshan:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {item.highlights.map((h, i) => (
                                    <span
                                      key={i}
                                      className="px-2.5 py-1 rounded-lg bg-white border border-[#9CB4E8]/40 text-[#171721] font-semibold text-[11px] shadow-xs"
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
                
                <div className="bg-[#FAFAFC] border border-gray-200 rounded-2xl p-6 space-y-3">
                  <h3 className="font-syne text-xs font-bold text-[#5266EB] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5266EB]" /> WHAT IS INCLUDED
                  </h3>
                  <ul className="space-y-2 text-xs text-gray-800 font-medium">
                    {tour.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-[#5266EB] text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">✓</span>
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
                    <div className="font-syne text-2xl font-extrabold text-[#000000]">
                      {tour.priceDisplay}
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9CB4E8]/20 text-[#171721] text-xs font-bold border border-[#9CB4E8]/40 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5266EB]" />
                    <span>{tour.advanceLabel}</span>
                  </div>
                </div>

                {/* Key Departures Snapshot */}
                <div className="space-y-2.5 text-xs text-gray-600">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Travel Dates:</span>
                    <strong className="text-[#000000] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#5266EB]" /> {tour.datesLabel}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Duration:</span>
                    <strong className="text-[#000000]">{tour.durationLabel}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Covered Sites:</span>
                    <strong className="text-[#5266EB] font-bold">{tour.sites.length} Temples & Ghats</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-400">Booking Advance:</span>
                    <strong className="text-[#5266EB] font-bold">{tour.advanceLabel}</strong>
                  </div>
                </div>

                {/* Direct Action Buttons: Online Booking, WhatsApp & Call */}
                <div className="space-y-2.5 pt-2">
                  {/* Primary Book Now Online Button */}
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full py-4 px-4 rounded-2xl bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] font-extrabold text-xs tracking-wider uppercase transition-all shadow-xl shadow-[#5266EB]/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 text-center cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Book Now Online ({tour.advanceLabel})</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-2xl bg-[#272735] hover:bg-[#171721] text-[#9CB4E8] font-bold text-xs tracking-wider uppercase transition-all border border-[#9CB4E8]/30 flex items-center justify-center gap-2 text-center"
                  >
                    <MessageCircle className="w-4 h-4 fill-[#9CB4E8]" />
                    <span>Book on WhatsApp</span>
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={callUrl1}
                      className="py-2.5 px-3 rounded-xl bg-[#171721] hover:bg-[#272735] text-[#EDEDF3] font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm text-center"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call {SHARED_TOUR_CONTACT.phone1}</span>
                    </a>

                    <a
                      href={callUrl2}
                      className="py-2.5 px-3 rounded-xl bg-[#171721] hover:bg-[#272735] text-[#EDEDF3] font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm text-center"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call {SHARED_TOUR_CONTACT.phone2}</span>
                    </a>
                  </div>
                </div>

                {/* Trust & Guarantee Notes */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-[11px] text-gray-500 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gray-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5266EB] shrink-0" />
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

      {/* 📱 MOBILE STICKY FLOATING BOOKING BAR (Fixed at bottom on phones) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#171721]/95 backdrop-blur-xl border-t border-white/15 px-4 py-3 pb-safe flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#9CB4E8] block leading-tight">Advance Lock</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-extrabold text-white font-syne">{tour.advanceLabel}</span>
            <span className="text-[10px] text-gray-400">/ {tour.priceDisplay}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="py-2.5 px-5 rounded-xl bg-[#5266EB] hover:bg-[#3E51D4] text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" /> Book Now
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          item={modalItem}
        />
      )}

      {/* Tour Package Terms & Conditions */}
      <div className="pb-16 lg:pb-0">
        <TermsConditionsSection mode="tours" />
      </div>

      <Footer />

    </div>
  );
}
