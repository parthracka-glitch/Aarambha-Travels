'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  Phone,
  MessageCircle,
  MapPin,
  Sparkles,
  Star,
  CreditCard,
  User,
  Car,
  ArrowRight,
  Clock,
  Compass,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';
import BookingModal, { BookingModalItem } from '@/components/booking/BookingModal';
import { TOUR_PACKAGES, SHARED_TOUR_CONTACT, TourPackage } from '@/constants/toursData';
import { fetchLiveTourPackageBySlug } from '@/services/tours.service';
import JsonLd, { getTourPackageSchema } from '@/components/shared/JsonLd';

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
    <div className="min-h-screen bg-[#FCFAF6] text-[#493B34] flex flex-col font-sans">
      <JsonLd data={getTourPackageSchema(tour)} />
      
      <Navbar vertical="tours" />

      {/* ─── 1. BREADCRUMB & HERO HEADER ──────────────────────────── */}
      <section className="relative bg-[#2D1F18] text-white pt-24 pb-12 sm:pt-28 sm:pb-16 overflow-hidden border-b border-[#EDE2D0]/20">
        <img
          src={tour.image}
          alt={tour.title}
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-20 filter brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D1F18] via-[#2D1F18]/85 to-[#2D1F18]/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Link
              href="/tours-travels"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EDE2D0] hover:text-white transition-colors bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Tours
            </Link>

            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#C65A2E] hover:bg-[#B24E25] px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" /> Book Online ({tour.advanceLabel})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#EDE2D0] font-medium pt-1">
            <span className="px-3 py-1 rounded-full bg-[#C65A2E]/20 text-[#E8B9A5] border border-[#C65A2E]/40 font-bold">
              {tour.durationLabel}
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full border border-white/20 text-white">
              <Calendar className="w-3.5 h-3.5 text-[#E8B9A5]" /> {tour.datesLabel}
            </span>
            <span className="flex items-center gap-1 text-[#D8B77A] font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/20">
              <Star className="w-3.5 h-3.5 fill-[#D8B77A] text-[#D8B77A]" /> {tour.rating} ({tour.reviewsCount} Pilgrim Reviews)
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            {tour.title}
          </h1>

          <p className="text-xs sm:text-sm text-[#EDE2D0]/90 max-w-2xl leading-relaxed">
            {tour.subtitle}
          </p>
        </div>
      </section>

      {/* ─── 2. MAIN OVERVIEW & BOOKING CARD GRID ─────────────────── */}
      <section className="py-10 sm:py-12 bg-[#FCFAF6] border-b border-[#EDE2D0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Image & Gallery */}
              <div className="space-y-3">
                <div className="bg-white rounded-2xl h-[300px] sm:h-[400px] overflow-hidden border border-[#EDE2D0] shadow-sm relative">
                  <img
                    src={selectedImage}
                    alt={tour.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-[#2D1F18]/80 backdrop-blur-md text-white text-xs font-semibold">
                    {tour.destination}
                  </div>
                </div>

                {tour.gallery.length > 1 && (
                  <div className="grid grid-cols-3 gap-3">
                    {tour.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`rounded-xl h-20 sm:h-24 overflow-hidden border transition-all cursor-pointer ${
                          selectedImage === img
                            ? 'border-2 border-[#C65A2E] ring-2 ring-[#C65A2E]/30'
                            : 'border-[#EDE2D0] hover:border-[#C65A2E]/50 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Pilgrimage Overview */}
              <div className="rounded-2xl bg-white border border-[#EDE2D0] p-6 space-y-2.5 shadow-2xs">
                <h2 className="font-serif text-base font-bold text-[#493B34] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C65A2E]" /> Yatra Overview &amp; Experience
                </h2>
                <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed font-normal">
                  {tour.overview}
                </p>
              </div>

              {/* Complete Holy Sites / Temples List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#EDE2D0] pb-2.5">
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#493B34] tracking-tight">
                      Sacred Sites &amp; Temples Covered
                    </h2>
                    <p className="text-xs text-[#756B63] font-normal">
                      Complete list of all {tour.sites.length} auspicious destinations included in this departure
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#C65A2E] bg-[#F8EFEA] px-3 py-1 rounded-full border border-[#E8B9A5]/50">
                    {tour.sites.length} Holy Sites
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {tour.sites.map((site, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl bg-white border border-[#EDE2D0] flex items-start gap-2.5 hover:border-[#E8B9A5] transition-colors shadow-2xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#C65A2E] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-xs font-semibold text-[#493B34] leading-snug">
                        {site}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Departure Batches & Dates */}
              {tour.batchDates && tour.batchDates.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EDE2D0] pb-2.5 gap-2">
                    <div>
                      <h2 className="font-serif text-lg font-bold text-[#493B34] tracking-tight flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#C65A2E]" />
                        <span>Upcoming Departure Batches</span>
                      </h2>
                      <p className="text-xs text-[#756B63] font-normal mt-0.5">
                        Select an official departure batch to reserve seats with ₹{tour.depositPrice || 2500} advance
                      </p>
                    </div>
                    <span className="self-start sm:self-auto text-xs font-bold text-[#C65A2E] bg-[#F8EFEA] px-3 py-1 rounded-full border border-[#E8B9A5]/50">
                      {tour.batchDates.length} Scheduled Batches
                    </span>
                  </div>

                  {/* Month Filter Tabs */}
                  {Array.from(new Set(tour.batchDates.map((b) => b.month || 'Other'))).length > 1 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        onClick={() => setBatchMonthFilter('All')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          batchMonthFilter === 'All'
                            ? 'bg-[#493B34] text-white shadow-xs'
                            : 'bg-white text-[#756B63] border border-[#EDE2D0] hover:bg-[#F8EFEA]'
                        }`}
                      >
                        All Months ({tour.batchDates.length})
                      </button>
                      {Array.from(new Set(tour.batchDates.map((b) => b.month || 'Other'))).map((month) => (
                        <button
                          key={month}
                          onClick={() => setBatchMonthFilter(month)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            batchMonthFilter === month
                              ? 'bg-[#493B34] text-white shadow-xs'
                              : 'bg-white text-[#756B63] border border-[#EDE2D0] hover:bg-[#F8EFEA]'
                          }`}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Batch Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {tour.batchDates
                      .filter((b) => batchMonthFilter === 'All' || b.month === batchMonthFilter)
                      .map((batch) => {
                        const isFull = batch.status === 'full';
                        return (
                          <div
                            key={batch.id}
                            className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2.5 relative ${
                              isFull
                                ? 'bg-gray-50 border-[#EDE2D0] opacity-70'
                                : 'bg-white border-[#EDE2D0] hover:border-[#C65A2E] hover:shadow-sm'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C65A2E] bg-[#F8EFEA] px-2 py-0.5 rounded border border-[#E8B9A5]/50">
                                  {batch.tag || `${batch.month} Batch`}
                                </span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    isFull ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                                  }`}
                                >
                                  {isFull ? 'Sold Out' : 'Available'}
                                </span>
                              </div>
                              <h4 className="font-serif font-bold text-xs sm:text-sm text-[#493B34] pt-0.5">
                                {batch.label}
                              </h4>
                              <p className="text-[11px] text-[#756B63]">
                                {tour.durationLabel}
                              </p>
                            </div>

                            <button
                              disabled={isFull}
                              onClick={() => handleBookBatch(batch.id)}
                              className={`w-full py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                                isFull
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-[#C65A2E] hover:bg-[#B24E25] text-white shadow-xs'
                              }`}
                            >
                              <span>{isFull ? 'Sold Out' : 'Select Batch'}</span>
                              {!isFull && <ArrowRight className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Day-by-Day Detailed Itinerary */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#EDE2D0] pb-2.5">
                  <h2 className="font-serif text-lg font-bold text-[#493B34] tracking-tight">
                    Day-by-Day Tour Itinerary
                  </h2>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {tour.durationLabel}
                  </span>
                </div>

                <div className="space-y-2.5 font-sans">
                  {tour.itinerary.map((item) => {
                    const isOpen = openDay === item.day;
                    return (
                      <div
                        key={item.day}
                        className={`rounded-xl border transition-all overflow-hidden ${
                          isOpen
                            ? 'border-[#E8B9A5] bg-[#F8EFEA]/40'
                            : 'border-[#EDE2D0] bg-white hover:border-[#E8B9A5]'
                        }`}
                      >
                        <button
                          onClick={() => toggleDay(item.day)}
                          className="w-full p-4 flex items-center justify-between text-left gap-3 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-[#C65A2E] text-white font-bold text-xs flex items-center justify-center shrink-0">
                              D{item.day}
                            </span>
                            <h3 className="text-sm font-bold text-[#493B34]">
                              {item.title}
                            </h3>
                          </div>

                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-[#C65A2E] shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#756B63] shrink-0" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 pt-0 text-xs space-y-2.5 border-t border-[#EDE2D0] font-sans">
                            <p className="text-[#756B63] leading-relaxed font-normal text-xs pt-2">
                              {item.description}
                            </p>

                            {item.highlights && item.highlights.length > 0 && (
                              <div className="pt-1">
                                <span className="font-bold text-[#C65A2E] text-[10px] block uppercase mb-1">
                                  Highlights &amp; Darshan:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {item.highlights.map((h, i) => (
                                    <span
                                      key={i}
                                      className="px-2.5 py-0.5 rounded-full bg-white border border-[#EDE2D0] text-[#493B34] font-medium text-[11px]"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                
                <div className="bg-white border border-[#EDE2D0] rounded-2xl p-5 space-y-2.5 shadow-2xs">
                  <h3 className="text-xs font-bold text-[#493B34] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> What is Included
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#756B63] font-medium">
                    {tour.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50/30 border border-red-200/60 rounded-2xl p-5 space-y-2.5 shadow-2xs">
                  <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-red-500" /> What is Excluded
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#756B63]">
                    {tour.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-red-100 text-red-600 text-[9px] flex items-center justify-center shrink-0 mt-0.5 font-bold">✕</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>

            {/* Right Sticky Booking Pricing Card */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
              
              <div className="bg-white border border-[#EDE2D0] rounded-2xl p-6 space-y-5 shadow-md">
                
                {/* Pricing & Advance Strip */}
                <div className="space-y-1.5 pb-4 border-b border-[#EDE2D0]">
                  <span className="text-[10px] text-[#756B63] block uppercase font-bold tracking-wider">
                    Tour Package Fare
                  </span>
                  
                  <div className="space-y-0.5">
                    <div className="font-serif text-2xl font-bold text-[#493B34]">
                      {tour.priceDisplay}
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#F8EFEA] rounded-xl border border-[#E8B9A5]/50 text-[#C65A2E] text-xs flex items-center justify-between">
                    <span className="font-semibold text-[#493B34]">Advance to Reserve:</span>
                    <strong className="font-bold text-[#C65A2E]">{tour.advanceLabel}</strong>
                  </div>
                </div>

                {/* Key Inclusions Summary */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 text-[#756B63]">
                    <ShieldCheck className="w-4 h-4 text-[#C65A2E] shrink-0" />
                    <span>3-Star Verified Hotel Stays Included</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#756B63]">
                    <Car className="w-4 h-4 text-[#C65A2E] shrink-0" />
                    <span>AC Pushback Transport from Pune</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#756B63]">
                    <User className="w-4 h-4 text-[#C65A2E] shrink-0" />
                    <span>Dedicated Tour Captain</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-1">
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="w-full py-3 bg-[#C65A2E] hover:bg-[#B24E25] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Reserve Seats Online</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>

                {/* Contact Helpline */}
                <div className="pt-2 border-t border-[#EDE2D0] text-center text-xs space-y-1 text-[#756B63]">
                  <p className="text-[11px] font-medium">Need customized dates or group booking?</p>
                  <div className="flex items-center justify-center gap-3 font-semibold text-[#493B34]">
                    <a href={callUrl1} className="hover:text-[#C65A2E] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#C65A2E]" /> +91 {SHARED_TOUR_CONTACT.phone1}
                    </a>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Terms & Conditions Section */}
      <TermsConditionsSection />

      {/* Footer */}
      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        item={modalItem}
      />
    </div>
  );
}
