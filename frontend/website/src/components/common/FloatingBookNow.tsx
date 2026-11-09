'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, Sparkles, ChevronUp, ChevronDown, ArrowRight, X, Calendar } from 'lucide-react';

const FEATURED_YATRAS = [
  {
    title: '2 Jyotirlinga Yatra (Ujjain & Omkareshwar)',
    price: '₹5,999',
    advance: '₹1,999',
    duration: '3D / 2N',
    slug: 'pune-to-2-jyotirlinga-yatra--ujjain-omkareshwar-maheshwar',
    badge: 'Popular',
  },
  {
    title: 'Sanwaliya Seth & Khatu Shyam Baba',
    price: '₹7,999',
    advance: '₹1,999',
    duration: '4D / 3N',
    slug: 'pune-to-sanwaliya-seth---khatu-shyam-babaujjain-mahakal',
    badge: 'Special',
  },
  {
    title: 'Girnar Mountain, Dwarka & Somnath',
    price: '₹11,999',
    advance: '₹2,999',
    duration: '6 Days',
    slug: 'pune-to-girnar-dwarka-somnath-jyotirlinga',
    badge: 'Limited Seats',
  },
];

export default function FloatingBookNow() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <aside aria-label="Quick Booking" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 select-none font-sans">
      
      {/* Expanded Quick Tour Selector Panel */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-2xl border border-[#EDE2D0] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          
          {/* Header */}
          <div className="bg-[#101F40] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="font-bold text-xs tracking-wide">Instant Online Yatra Booking</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Featured Tours List */}
          <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
            {FEATURED_YATRAS.map((tour) => (
              <button
                key={tour.slug}
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/tours-travels/${tour.slug}`);
                }}
                className="w-full text-left p-2.5 rounded-xl border border-[#EDE2D0]/70 hover:border-[#C65A2E] hover:bg-[#FCFAF6] transition-all group cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#F8EFEA] text-[#C65A2E]">
                      {tour.badge}
                    </span>
                    <span className="text-[10px] text-[#756B63]">{tour.duration}</span>
                  </div>
                  <h4 className="font-bold text-xs text-[#17233D] group-hover:text-[#C65A2E] truncate">
                    {tour.title}
                  </h4>
                  <p className="text-[10.5px] text-[#756B63] mt-0.5">
                    Advance: <strong className="text-[#3569F6] font-semibold">{tour.advance}</strong> (Total: {tour.price})
                  </p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-[#FCFAF6] group-hover:bg-[#C65A2E] group-hover:text-white text-[#C65A2E] border border-[#EDE2D0] flex items-center justify-center shrink-0 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>

          {/* Footer Action */}
          <div className="p-3 pt-0">
            <Link
              href="/tours-travels"
              onClick={() => setIsOpen(false)}
              className="w-full py-2 bg-[#F8EFEA] hover:bg-[#F2E5DC] text-[#C65A2E] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-[#EDE2D0]"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Browse All Sacred Yatras</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Persistent Floating Button Card */}
      <div className="flex items-center gap-1.5 shadow-2xl rounded-full bg-white/95 backdrop-blur-md border border-[#EDE2D0] p-1.5 hover:shadow-2xl hover:border-[#C65A2E]/50 transition-all">
        
        {/* Toggle Expand Dropdown */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 rounded-full bg-[#FCFAF6] hover:bg-[#F8EFEA] text-[#493B34] border border-[#EDE2D0] transition-colors cursor-pointer"
          title={isOpen ? 'Collapse Yatra Options' : 'View Featured Trips'}
        >
          {isOpen ? <ChevronDown className="w-4 h-4 text-[#C65A2E]" /> : <ChevronUp className="w-4 h-4 text-[#C65A2E]" />}
        </button>

        {/* Primary Click to Book Button */}
        <button
          onClick={() => router.push('/tours-travels')}
          className="flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-gradient-to-r from-[#C65A2E] to-[#B24E25] hover:from-[#B24E25] hover:to-[#9E3E1A] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
        >
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span>Book Now</span>
          <span className="hidden sm:inline text-[11px] font-medium text-white/80 border-l border-white/20 pl-2">
            Advance from ₹1,999
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-white/80" />
        </button>

      </div>

    </aside>
  );
}
