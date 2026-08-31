'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Sparkles, MapPin } from 'lucide-react';

const RECENT_BOOKINGS = [
  {
    name: 'Amit S.',
    location: 'Kothrud, Pune',
    service: '3 Jyotirlinga Yatra (Ujjain & Omkareshwar)',
    timeAgo: '4 mins ago',
    type: 'tour',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop'
  },
  {
    name: 'Prasad N.',
    location: 'Katraj, Pune',
    service: 'Mahindra Thar 4x4 (Self-Drive)',
    timeAgo: '11 mins ago',
    type: 'car',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=120&auto=format&fit=crop'
  },
  {
    name: 'Mrs. Deshmukh & Family',
    location: 'Baner, Pune',
    service: 'Force Urbania 13-Seater VIP Lounge',
    timeAgo: '18 mins ago',
    type: 'van',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop'
  },
  {
    name: 'Sneha M.',
    location: 'Viman Nagar, Pune',
    service: 'Chardham Holy Yatra Batch',
    timeAgo: '27 mins ago',
    type: 'tour',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=120&auto=format&fit=crop'
  },
];

export default function SocialProofToast() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Initial show after 4 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    // Loop cycle: show for 6 seconds, hide for 10 seconds, rotate index
    const cycleInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_BOOKINGS.length);
        setIsVisible(true);
      }, 9000);
    }, 16000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(cycleInterval);
    };
  }, [isDismissed]);

  if (isDismissed || !isVisible) return null;

  const current = RECENT_BOOKINGS[currentIndex];

  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-sm hidden sm:block animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="relative p-3.5 rounded-2xl bg-[#141624]/95 border border-white/15 backdrop-blur-2xl shadow-2xl flex items-center gap-3 text-white">
        
        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          title="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Customer Avatar */}
        <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-emerald-500/40">
          <img
            src={current.avatar}
            alt={current.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-1 ring-black" />
        </div>

        {/* Details */}
        <div className="space-y-0.5 pr-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-200">
            <span>{current.name}</span>
            <span className="text-[10px] text-gray-400 font-normal">({current.location})</span>
          </div>
          <div className="text-xs font-extrabold text-amber-400 line-clamp-1">
            {current.service}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span className="flex items-center gap-0.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Booking</span>
            </span>
            <span>•</span>
            <span>{current.timeAgo}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
