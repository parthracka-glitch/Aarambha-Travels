'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Bus,
  Car,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 'fleet',
    image: '/images/hero_luxury_fleet.jpg',
    badge: '🚩 आरंभ Luxury Travel Ecosystem',
    label: 'All-Fleet & Tours',
    tag: 'Flagship Overview',
    title: 'Sacred Pilgrimages, Luxury Buses & Self-Drive Fleet',
    subtitle: 'Pune’s premier travel ecosystem for all-inclusive spiritual yatras, Force Urbania & luxury coach hire, and zero-deposit self-drive cars.',
    tab: 'tours' as const,
  },
  {
    id: 'spiritual',
    image: '/images/hero_spiritual_tours.jpg',
    badge: '🪷 Curated Spiritual Yatras',
    label: 'Spiritual Yatras',
    tag: 'Holy Darshan & Stays',
    title: 'Sacred Temple Yatras Departing from Pune',
    subtitle: 'All-inclusive spiritual tours with confirmed AC pushback seats, verified 3★ stays, pure satvik meals, and expert tour captains.',
    tab: 'tours' as const,
  },
  {
    id: 'urbania',
    image: '/images/urbania_fleet.jpg',
    badge: '🚐 VIP Force Urbania Luxury',
    label: 'Force Urbania (13/17S)',
    tag: 'VIP Reclining Vans',
    title: 'Force Urbania Luxury Vans with Chauffeur',
    subtitle: 'Experience airplane-style individual reading lights, high-roof panoramic windows, whisper-quiet cabin, and plush captain seating.',
    tab: 'bus' as const,
  },
  {
    id: 'buses',
    image: '/images/luxury_fleet_vehicles.jpg',
    badge: '🚌 Commercial Luxury Coach Rentals',
    label: 'Luxury Bus Rentals',
    tag: '20–50 Seater Coaches',
    title: 'Luxury Bus & Coach Rentals for Groups',
    subtitle: 'Comfortable outstation tours, corporate events, and wedding fleet across Maharashtra with commercial tourist permits.',
    tab: 'bus' as const,
  },
  {
    id: 'self-drive',
    image: '/images/hillstation_featured.jpg',
    badge: '🚗 Zero-Deposit Self-Drive',
    label: 'Scenic Self-Drive',
    tag: 'Unlimited Kilometers',
    title: 'Drive Your Way to Hill Stations & Coastlines',
    subtitle: 'Rent Thar 4x4, Fortuner, Ertiga & Swift with ₹0 security deposit and door-to-door delivery in Pune for your weekend road trips.',
    tab: 'cars' as const,
  },
];

export default function EpicHeroShowcase() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'tours' | 'bus' | 'cars'>('tours');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play carousel
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    setActiveTab(HERO_SLIDES[idx].tab);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const next = (prev + 1) % HERO_SLIDES.length;
      setActiveTab(HERO_SLIDES[next].tab);
      return next;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const next = (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
      setActiveTab(HERO_SLIDES[next].tab);
      return next;
    });
  };

  const handleTabChange = (tab: 'tours' | 'bus' | 'cars') => {
    setActiveTab(tab);
    if (tab === 'tours') setCurrentSlide(1);
    else if (tab === 'bus') setCurrentSlide(2);
    else if (tab === 'cars') setCurrentSlide(4);
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full bg-[#181310] pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 overflow-hidden flex items-center justify-center font-sans border-b border-[#EDE2D0]/60"
    >
      
      {/* ─── 1. HIGH-VISIBILITY BACKGROUND CAROUSEL ─── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-105 pointer-events-none z-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
            />
          </div>
        ))}

        {/* Ambient cinematic scrim: delivers crisp typography contrast while keeping photos vivid */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/60 via-black/35 to-black/70 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#FCFAF6] via-[#FCFAF6]/60 to-transparent z-20 pointer-events-none" />
      </div>

      {/* Side Arrow Controls (Clean, Minimal & Discreet) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="hidden lg:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 text-white/90" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="hidden lg:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
      >
        <ChevronRight className="w-5 h-5 text-white/90" />
      </button>

      {/* ─── 2. MAIN HERO CONTAINER ─── */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center">
        
        {/* Sleek Minimal Floating Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-medium text-white mb-3 sm:mb-4 shadow-sm">
          <span>{HERO_SLIDES[currentSlide].badge}</span>
        </div>

        {/* Unboxed, Breathable Headline */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12] mb-3 sm:mb-3.5 max-w-4xl drop-shadow-md">
          {HERO_SLIDES[currentSlide].title}
        </h1>

        {/* Clean Airy Subtitle */}
        <p className="text-xs sm:text-sm md:text-base text-white/85 max-w-2xl mx-auto leading-relaxed font-light mb-6 sm:mb-8 drop-shadow-sm">
          {HERO_SLIDES[currentSlide].subtitle}
        </p>

        {/* ─── 3. SLEEK HERO ACTION BUTTONS ─── */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6 select-none">
          <button
            type="button"
            onClick={() => router.push('/tours-travels')}
            className="px-6 py-3.5 rounded-full bg-[#C65A2E] hover:bg-[#B24E25] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Compass className="w-4 h-4 text-white" />
            <span>Explore Spiritual Tours</span>
            <ArrowRight className="w-4 h-4 text-white/80" />
          </button>

          <button
            type="button"
            onClick={() => router.push('/bus-rentals')}
            className="px-6 py-3.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/40 text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Bus className="w-4 h-4 text-white" />
            <span>Luxury Bus Rentals</span>
          </button>

          <button
            type="button"
            onClick={() => router.push('/car-rentals')}
            className="px-6 py-3.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/40 text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Car className="w-4 h-4 text-white" />
            <span>Self-Drive Fleet</span>
          </button>
        </div>

        {/* Subtle Minimal Carousel Slide Indicators */}
        <div className="flex items-center justify-center gap-2 mt-5 select-none">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentSlide
                  ? 'w-7 bg-white shadow-sm'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* ─── 4. REFINED MINIMAL TRUST STRIP ─── */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-5 text-xs text-[#5D5047] font-medium select-none">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#EDE2D0] shadow-2xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span><strong className="font-semibold text-[#3B2E27]">4.9/5</strong> (1,200+ Yatris)</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#EDE2D0] shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Commercial Tourist Fleet</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#EDE2D0] shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C65A2E]" />
            <span>Satvik Meals &amp; 3★ Stays</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#EDE2D0] shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C65A2E]" />
            <span>₹0 Deposit &amp; Zero Hidden Fees</span>
          </div>
        </div>

      </div>

    </section>
  );
}
