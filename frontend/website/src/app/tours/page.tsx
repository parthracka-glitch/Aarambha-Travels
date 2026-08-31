'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  MapPin, 
  Star, 
  Calendar, 
  Clock, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  Check, 
  Flame, 
  Share2, 
  HeartHandshake,
  Sun
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookingModal, { BookingModalItem } from '@/components/booking/BookingModal';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';
import FAQSection from '@/components/home/FAQSection';
import { TOUR_PACKAGES, TourPackage } from '@/constants/toursData';
import { fetchLiveTourPackages } from '@/services/tours.service';
import { createTourInquiryWhatsAppUrl, AARAMBHA_HOTLINE_PHONE } from '@/utils/whatsapp';

export default function DedicatedToursPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<'all' | 'jyotirlinga' | 'heritage' | 'short'>('all');
  const [selectedBookingTour, setSelectedBookingTour] = useState<BookingModalItem | null>(null);
  const [packagesList, setPackagesList] = useState<TourPackage[]>(TOUR_PACKAGES);

  useEffect(() => {
    fetchLiveTourPackages().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setPackagesList(data);
      }
    });
  }, []);

  const filteredPackages = packagesList.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.sites.some((site) => site.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedPillar === 'jyotirlinga') {
      return pkg.title.toLowerCase().includes('mahakal') || 
             pkg.title.toLowerCase().includes('omkareshwar') || 
             pkg.title.toLowerCase().includes('jyotirlinga') || 
             pkg.title.toLowerCase().includes('somnath');
    }
    if (selectedPillar === 'heritage') {
      return pkg.title.toLowerCase().includes('rajasthan') || 
             pkg.title.toLowerCase().includes('mandu') || 
             pkg.title.toLowerCase().includes('heritage') ||
             pkg.title.toLowerCase().includes('maheshwar');
    }
    if (selectedPillar === 'short') {
      return pkg.durationDays <= 3;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#0C0D12] text-white flex flex-col font-sans selection:bg-[#E58A2B] selection:text-white">
      <Navbar vertical="tours" />

      {/* ─── 1. SPIRITUAL YATRA HERO ──────────────────────────────── */}
      <section className="relative min-h-[65vh] flex items-center justify-center text-center px-6 lg:px-12 overflow-hidden border-b border-white/10">
        {/* Full-bleed scenic spiritual background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/tours_travels_bg.jpg?v=2"
            alt="Spiritual Yatra - Aarambha Tours & Travels"
            className="w-full h-full object-cover scale-105 filter brightness-75 contrast-110"
            onError={(e) => {
              // fallback image if local asset is unavailable
              (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1600&auto=format&fit=crop');
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0D12] via-black/60 to-black/30" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-6 pt-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Curated Pilgrimages & Holy Yatras</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold font-syne tracking-tight text-white leading-tight">
            Sacred Darshans, Hassle-Free <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500">
              Pilgrimage Experiences
            </span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Experience divine blessings with confirmed VIP Darshan assistance, verified hygienic hotel stays, comfortable AC transport, and dedicated tour coordinators from Pune.
          </p>

          {/* Quick Pillar Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2 text-left">
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md">
              <div className="text-xl font-black text-amber-400 font-syne">10,000+</div>
              <div className="text-[11px] text-gray-400">Pilgrims Guided</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md">
              <div className="text-xl font-black text-amber-400 font-syne">VIP Darshan</div>
              <div className="text-[11px] text-gray-400">Queue Assistance</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md">
              <div className="text-xl font-black text-amber-400 font-syne">₹500 Deposit</div>
              <div className="text-[11px] text-gray-400">Zero Risk Booking</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md">
              <div className="text-xl font-black text-amber-400 font-syne">100% Satvik</div>
              <div className="text-[11px] text-gray-400">Hygienic Meals</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. PILGRIMAGE PILLARS FILTER BAR ─────────────────────── */}
      <section className="sticky top-[69px] z-40 bg-[#12131C]/95 backdrop-blur-xl border-b border-white/10 py-4 px-6 lg:px-12 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center bg-black/40 p-1.5 rounded-full border border-white/10 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setSelectedPillar('all')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedPillar === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Packages ({packagesList.length})
            </button>
            <button
              onClick={() => setSelectedPillar('jyotirlinga')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedPillar === 'jyotirlinga'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Jyotirlinga Yatras</span>
            </button>
            <button
              onClick={() => setSelectedPillar('heritage')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedPillar === 'heritage'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Heritage & Forts</span>
            </button>
            <button
              onClick={() => setSelectedPillar('short')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedPillar === 'short'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Weekend Yatras (≤3 Days)</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Ujjain, Omkareshwar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

        </div>
      </section>

      {/* ─── 3. TOUR PACKAGES GRID ────────────────────────────────── */}
      <section className="py-12 px-6 lg:px-12 flex-1 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold font-syne text-white flex items-center gap-2">
              <Compass className="w-6 h-6 text-amber-400" />
              <span>Upcoming Departure Batches</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Fixed departure group tours and customized family spiritual circuits.</p>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {filteredPackages.length} Packages Found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((tour) => {
            const rawPrice = typeof tour.basePrice === 'number' 
              ? tour.basePrice 
              : parseInt(String(tour.priceDisplay).replace(/\D/g, '')) || 5999;

            const whatsappUrl = createTourInquiryWhatsAppUrl({
              packageTitle: tour.title,
              datesLabel: tour.datesLabel,
              durationDays: tour.durationDays,
              pricePerPerson: rawPrice,
              sourceCity: 'Pune, Maharashtra'
            });

            return (
              <div
                key={tour.id}
                className="rounded-2xl bg-[#151722] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 group"
              >
                <div>
                  {/* Image Frame */}
                  <div className="relative h-52 bg-[#1B1D2C] overflow-hidden">
                    <img
                      src={tour.image || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=800&auto=format&fit=crop'}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-amber-300 border border-white/10 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{tour.durationDays} Days / {tour.durationNights || tour.durationDays - 1} Nights</span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-3.5 py-1 rounded-full text-xs font-extrabold shadow-lg">
                      {tour.priceDisplay}
                    </div>
                  </div>

                  {/* Tour Details */}
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{tour.destination}</span>
                      </div>
                      <h3 className="font-syne text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                        {tour.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{tour.datesLabel || 'Multiple Batches Monthly'}</span>
                      </div>
                    </div>

                    {/* Sites Covered */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Key Holy Sites:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {tour.sites.slice(0, 4).map((site, i) => (
                          <span key={i} className="text-[10px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                            {site}
                          </span>
                        ))}
                        {tour.sites.length > 4 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300">
                            +{tour.sites.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() =>
                      setSelectedBookingTour({
                        id: tour.id,
                        title: tour.title,
                        type: 'tour',
                        price: rawPrice,
                        deposit: tour.depositPrice || 500,
                        image: tour.image || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=800&auto=format&fit=crop',
                        batchDates: tour.batchDates || [],
                      })
                    }
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>Reserve Seat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 4. BOOKING MODAL ─────────────────────────────────────── */}
      {selectedBookingTour && (
        <BookingModal
          item={selectedBookingTour}
          isOpen={true}
          onClose={() => setSelectedBookingTour(null)}
        />
      )}

      {/* ─── 5. FAQ & TERMS ───────────────────────────────────────── */}
      <FAQSection />
      <TermsConditionsSection />
      <Footer />
    </div>
  );
}
