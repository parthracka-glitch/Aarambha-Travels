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
  Clock, 
  Users, 
  CreditCard, 
  Flame, 
  Sun,
  Award,
  Check
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';
import BookingModal, { BookingModalItem } from '@/components/booking/BookingModal';
import { TOUR_PACKAGES, SHARED_TOUR_CONTACT, TourPackage } from '@/constants/toursData';
import { fetchLiveTourPackageBySlug } from '@/services/tours.service';
import { createTourInquiryWhatsAppUrl, AARAMBHA_HOTLINE_PHONE } from '@/utils/whatsapp';

export default function DedicatedTourSlugPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const defaultTour = TOUR_PACKAGES.find((t) => t.slug === slug || t.id === slug) || TOUR_PACKAGES[0];
  const [tour, setTour] = useState<TourPackage>(defaultTour);
  const [selectedImage, setSelectedImage] = useState(defaultTour.image);
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string | undefined>(undefined);

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

  const rawPrice = typeof tour.basePrice === 'number'
    ? tour.basePrice
    : parseInt(String(tour.priceDisplay).replace(/\D/g, '')) || 5999;

  const modalItem: BookingModalItem = {
    id: tour.id,
    type: 'tour',
    title: tour.title,
    subtitle: `${tour.durationLabel} • ${tour.datesLabel || 'Multiple Monthly Batches'}`,
    image: selectedImage || tour.image,
    price: rawPrice,
    deposit: tour.depositPrice || 500,
    batchDates: tour.batchDates || [],
    initialBatchId: selectedBatchId,
  };

  const whatsappUrl = createTourInquiryWhatsAppUrl({
    packageTitle: tour.title,
    durationDays: tour.durationDays,
    pricePerPerson: rawPrice,
    datesLabel: tour.datesLabel,
    sourceCity: 'Pune, Maharashtra'
  });

  const toggleDay = (dayNum: number) => {
    setOpenDay(openDay === dayNum ? null : dayNum);
  };

  return (
    <div className="min-h-screen bg-[#0A0B10] text-white flex flex-col font-sans selection:bg-[#E58A2B] selection:text-white">
      <Navbar vertical="tours" />

      {/* ─── 1. BREADCRUMB & BACK HEADER ─── */}
      <div className="bg-[#12141F] border-b border-white/10 py-3.5 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <Link
            href="/tours"
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Tours</span>
          </Link>
          <div className="text-gray-400 hidden sm:block">
            Home / Tours / <span className="text-white font-semibold">{tour.destination}</span>
          </div>
        </div>
      </div>

      {/* ─── 2. HERO & MAIN SHOWCASE ─── */}
      <section className="py-8 px-6 lg:px-12 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Title Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{tour.destination}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-gray-300 text-xs font-semibold">
              {tour.durationLabel || `${tour.durationDays} Days / ${tour.durationNights || tour.durationDays - 1} Nights`}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>VIP Darshan Queue Support</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-syne text-white tracking-tight leading-tight">
            {tour.title}
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            {tour.subtitle || tour.overview}
          </p>
        </div>

        {/* Media Gallery & Quick Booking Sticky Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Main Image + Thumbnails */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative h-[340px] sm:h-[460px] rounded-3xl overflow-hidden bg-[#151724] border border-white/10 shadow-2xl">
              <img
                src={selectedImage || tour.image}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                <span className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white font-bold border border-white/10 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9★ (120+ Pilgrim Reviews)</span>
                </span>
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-1.5 rounded-full font-black text-sm shadow-lg">
                  {tour.priceDisplay}
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {tour.gallery && tour.gallery.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[tour.image, ...tour.gallery].map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === img ? 'border-amber-400 scale-105 shadow-md' : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Col: Instant Reservation Box */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-[#141624] border border-amber-500/20 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Total All-Inclusive Fare</div>
                  <div className="text-3xl font-black font-syne text-white">
                    {tour.priceDisplay}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase">Reserve Now For</div>
                  <div className="text-lg font-black text-emerald-400">₹{tour.depositPrice || 500}</div>
                </div>
              </div>

              {/* Urgency Pill */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                <span><strong>High Demand:</strong> Fast-filling departure batches for upcoming weekend.</span>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <span>Book Seat with ₹{tour.depositPrice || 500}</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ask Details on WhatsApp</span>
                </a>
              </div>

              {/* Inclusions summary */}
              <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AC Sleeper / Pushback Transport</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified 3-Star Hotel Accommodation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Satvik Pure Vegetarian Breakfast & Meals</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated Spiritual Tour Escort from Pune</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ─── 3. DAY-BY-DAY ITINERARY TIMELINE ─── */}
        <section className="space-y-6 pt-6">
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold font-syne text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-amber-400" />
              <span>Detailed Day-Wise Yatra Itinerary</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Complete milestone schedule from Pune departure to return.</p>
          </div>

          <div className="space-y-3">
            {(tour.itinerary || []).map((dayItem) => {
              const isOpen = openDay === dayItem.day;
              return (
                <div
                  key={dayItem.day}
                  className="rounded-2xl bg-[#141624] border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleDay(dayItem.day)}
                    className="w-full p-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center border border-amber-500/40 shrink-0">
                        D{dayItem.day}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white font-syne">
                          Day {dayItem.day}: {dayItem.title}
                        </h3>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 space-y-3 border-t border-white/5 text-xs text-gray-300 leading-relaxed animate-in fade-in duration-300">
                      <p>{dayItem.description}</p>
                      {dayItem.highlights && dayItem.highlights.length > 0 && (
                        <div className="space-y-1.5 pt-2">
                          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Day Highlights:</div>
                          <div className="flex flex-wrap gap-2">
                            {dayItem.highlights.map((hl, hIndex) => (
                              <span key={hIndex} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-200">
                                ✦ {hl}
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
        </section>

      </section>

      {/* ─── 4. BOOKING MODAL ─── */}
      <BookingModal
        item={modalItem}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />

      <TermsConditionsSection />
      <Footer />
    </div>
  );
}
