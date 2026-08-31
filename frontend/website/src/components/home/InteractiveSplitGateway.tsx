'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Car, ArrowRight, ShieldCheck, Star, MapPin, Sparkles, Phone, MessageCircle, Flame, Users, Bus } from 'lucide-react';
import { AARAMBHA_HOTLINE_PHONE } from '@/utils/whatsapp';

export default function InteractiveSplitGateway() {
  const [hoveredPanel, setHoveredPanel] = useState<'tours' | 'rentals' | null>(null);

  return (
    <div className="w-full relative overflow-hidden bg-[#0A0B10]">
      {/* ─── DESKTOP DUAL INTERACTIVE SPLIT PANELS ─── */}
      <div className="min-h-[82vh] w-full flex flex-col lg:flex-row">
        
        {/* ─── LEFT PANEL: TOURS & PILGRIMAGES ─── */}
        <div
          onMouseEnter={() => setHoveredPanel('tours')}
          onMouseLeave={() => setHoveredPanel(null)}
          className={`relative flex-1 min-h-[420px] lg:min-h-full transition-all duration-700 ease-out flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 group ${
            hoveredPanel === 'tours' ? 'lg:flex-[1.25]' : hoveredPanel === 'rentals' ? 'lg:flex-[0.85]' : 'lg:flex-1'
          }`}
        >
          {/* Background Image with Cinematic Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1400&auto=format&fit=crop"
              alt="Pilgrimage & Spiritual Tours"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-40 filter brightness-90 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-[#0A0B10]/70 to-black/40" />
            <div className="absolute inset-0 bg-amber-950/20 mix-blend-color group-hover:opacity-60 transition-opacity" />
          </div>

          {/* Top Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Spiritual & Holiday Yatras</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>4.9★ Pilgrim Trust</span>
            </div>
          </div>

          {/* Center Content */}
          <div className="relative z-10 space-y-4 my-8 max-w-xl">
            <h2 className="text-3xl sm:text-5xl font-black font-syne text-white tracking-tight leading-tight">
              Divine Yatras & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500">
                Spiritual Pilgrimages
              </span>
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Mahakaleshwar, Omkareshwar, Chardham, Somnath, and custom family tour packages from Pune with verified hotel stays, VIP Darshan, and satvik food.
            </p>

            {/* Quick Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-[11px] font-semibold text-gray-200 border border-white/10">
                ✓ VIP Darshan Queue Support
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-[11px] font-semibold text-gray-200 border border-white/10">
                ✓ Live Monthly Departure Batches
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-[11px] font-semibold text-gray-200 border border-white/10">
                ✓ ₹500 Seat Reservation
              </span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
            <Link
              href="/tours"
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 group-hover:scale-[1.02]"
            >
              <span>Explore All Tours</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${AARAMBHA_HOTLINE_PHONE}?text=${encodeURIComponent('Hello Aarambha Tours, please share upcoming tour packages and departure dates.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>

        {/* ─── RIGHT PANEL: CAR & BUS RENTALS ─── */}
        <div
          onMouseEnter={() => setHoveredPanel('rentals')}
          onMouseLeave={() => setHoveredPanel(null)}
          className={`relative flex-1 min-h-[420px] lg:min-h-full transition-all duration-700 ease-out flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden group ${
            hoveredPanel === 'rentals' ? 'lg:flex-[1.25]' : hoveredPanel === 'tours' ? 'lg:flex-[0.85]' : 'lg:flex-1'
          }`}
        >
          {/* Background Image with Cinematic Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1400&auto=format&fit=crop"
              alt="Self-Drive Cars & Bus Fleet"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-40 filter brightness-90 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B10] via-[#0A0B10]/70 to-black/40" />
            <div className="absolute inset-0 bg-red-950/20 mix-blend-color group-hover:opacity-60 transition-opacity" />
          </div>

          {/* Top Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Car className="w-3.5 h-3.5 text-red-400" />
              <span>Self-Drive Cars & Bus Fleet</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-red-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Doorstep Delivery Pune</span>
            </div>
          </div>

          {/* Center Content */}
          <div className="relative z-10 space-y-4 my-8 max-w-xl">
            <h2 className="text-3xl sm:text-5xl font-black font-syne text-white tracking-tight leading-tight">
              Self-Drive, Urbania & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-300">
                Luxury Coach Rentals
              </span>
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Mahindra Thar 4x4, Toyota Fortuner, Swift, Baleno, Force Urbania (9-17s), and luxury tourist coaches (25-55s) with transparent per-KM billing.
            </p>

            {/* Quick Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-[11px] font-semibold text-gray-200 border border-white/10">
                ✓ Zero Deposit Options
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-[11px] font-semibold text-gray-200 border border-white/10">
                ✓ Unlimited KM Packages
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-[11px] font-semibold text-gray-200 border border-white/10">
                ✓ Sanitized Fleet with Fastag
              </span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
            <Link
              href="/rentals"
              className="px-7 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 group-hover:scale-[1.02]"
            >
              <span>Explore Fleet & Rates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${AARAMBHA_HOTLINE_PHONE}?text=${encodeURIComponent('Hello Aarambha Rentals, I am looking to rent a car / Urbania / bus. Please share vehicle options and tariff.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Instant WhatsApp Quote</span>
            </a>
          </div>
        </div>

      </div>

      {/* ─── BOTTOM SHARED TRUST BAR ─── */}
      <div className="bg-[#0E1018] border-t border-white/10 py-6 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Rating Breakdown Strip */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-amber-400 font-extrabold text-lg">
                <span>4.9</span>
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
              </div>
              <div className="text-gray-400 text-xs">
                Over <span className="text-white font-bold">1,850+ Verified Traveler Reviews</span> in Pune & Maharashtra
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 text-center text-[11px] font-semibold text-gray-300">
              <div>
                <div className="text-emerald-400 font-bold">100%</div>
                <div className="text-gray-400 text-[10px]">Clean Sanitized Vehicles</div>
              </div>
              <div>
                <div className="text-amber-400 font-bold">4.9 / 5.0</div>
                <div className="text-gray-400 text-[10px]">Driver Punctuality</div>
              </div>
              <div>
                <div className="text-blue-400 font-bold">VIP Passes</div>
                <div className="text-gray-400 text-[10px]">Darshan Coordination</div>
              </div>
            </div>
          </div>

          {/* 4 Feature Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">100% Insured & Verified</div>
                <div className="text-[10px] text-gray-400">Zero dep cover & safety checks</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-red-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">Katraj & Pune Hub</div>
                <div className="text-[10px] text-gray-400">Airport & doorstep delivery</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400">
                <Star className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">₹500 Booking Lock</div>
                <div className="text-[10px] text-gray-400">Instant reservation on WhatsApp</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-blue-400">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-white">24/7 Travel Helpline</div>
                <div className="text-[10px] text-gray-400">+91 90676 17451</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
