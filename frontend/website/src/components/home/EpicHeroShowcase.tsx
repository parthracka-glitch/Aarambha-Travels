'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: '2-jyotirlinga',
    image: '/images/tours/mumbai_ujjain_omkareshwar_tour.jpg',
    badge: '🛕 Holy Jyotirlinga Darshan • 3D / 2N',
    label: '2 Jyotirlinga Yatra',
    tag: 'Ujjain & Omkareshwar',
    title: 'Pune to 2 Jyotirlinga Yatra — Ujjain & Omkareshwar',
    subtitle: 'Mahakaleshwar Bhasma Aarti, Mahakal Corridor, Omkareshwar Jyotirlinga, Mamleshwar & Maheshwar Rajwada with 2×2 AC Sleeper Coach & verified 3★ stays.',
    slug: 'pune-to-2-jyotirlinga-yatra--ujjain-omkareshwar-maheshwar',
    price: '₹5,999',
    deposit: '₹1,999',
  },
  {
    id: 'sanwaliya-seth',
    image: '/images/tours/khatu_shyam_salasar_tour.jpg',
    badge: '🌸 Divine Miracles Yatra • 4D / 3N',
    label: 'Sanwaliya Seth Yatra',
    tag: 'Salasar & Khatu Shyam',
    title: 'Pune to Sanwaliya Seth | Salasar Balaji | Khatu Shyam',
    subtitle: 'Seek sacred blessings at Khatu Shyam Baba, miraculous Sanwaliya Seth Mandir, and holy Salasar Balaji Dham in 2×2 AC Sleeper Coach.',
    slug: 'pune-to-sanwaliya-seth---khatu-shyam-babaujjain-mahakal',
    price: '₹7,999',
    deposit: '₹1,999',
  },
  {
    id: 'girnar-trip',
    image: '/images/himalayan_hero_bg.jpg',
    badge: '⛰️ Sacred Mountain Pilgrimage • 6 Days',
    label: 'Girnar Mountain Yatra',
    tag: 'Dwarka & Somnath Jyotirlinga',
    title: 'Pune to Girnar Mountain | Dwarka & Somnath Jyotirlinga',
    subtitle: 'Sacred spiritual yatra covering holy Girnar Mountain, Dwarkadhish, Bet Dwarka, Somnath Jyotirlinga, Nageshwar & Statue of Unity.',
    slug: 'pune-to-girnar-dwarka-somnath-jyotirlinga',
    price: '₹11,999',
    deposit: '₹2,999',
  },
];

export default function EpicHeroShowcase() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play carousel every 5.5s
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
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
              className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.08]"
            />
          </div>
        ))}

        {/* Ambient cinematic scrim: delivers crisp typography contrast while keeping photos vivid */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/65 via-black/40 to-black/75 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#FCFAF6] via-[#FCFAF6]/60 to-transparent z-20 pointer-events-none" />
      </div>

      {/* Side Arrow Controls */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="hidden lg:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/35 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 text-white/90" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="hidden lg:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/35 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
      >
        <ChevronRight className="w-5 h-5 text-white/90" />
      </button>

      {/* ─── 2. MAIN HERO CONTAINER ─── */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center">
        
        {/* Top 3 Yatra Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-5 sm:mb-6 select-none">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer backdrop-blur-md border ${
                  isActive
                    ? 'bg-[#C65A2E] text-white border-[#C65A2E] shadow-lg shadow-[#C65A2E]/30 scale-105'
                    : 'bg-black/40 hover:bg-black/60 text-white/90 border-white/20 hover:border-white/40'
                }`}
              >
                <span>{slide.label}</span>
                <span className={`ml-2 text-[11px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80'}`}>
                  {slide.price}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Title */}
        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.18] mb-3.5 max-w-4xl drop-shadow-lg">
          {HERO_SLIDES[currentSlide].title}
        </h1>

        {/* Dynamic Subtitle */}
        <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-2xl mx-auto leading-relaxed font-normal mb-6 sm:mb-8 drop-shadow-md">
          {HERO_SLIDES[currentSlide].subtitle}
        </p>

        {/* Single Clean Actions Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 select-none">
          <button
            type="button"
            onClick={() => router.push(`/tours-travels/${HERO_SLIDES[currentSlide].slug}`)}
            className="px-7 py-3.5 rounded-full bg-[#C65A2E] hover:bg-[#B24E25] text-white text-xs sm:text-sm font-extrabold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Compass className="w-4 h-4 text-white" />
            <span>Book This Tour • Advance: {HERO_SLIDES[currentSlide].deposit}</span>
            <ArrowRight className="w-4 h-4 text-white/80" />
          </button>

          <button
            type="button"
            onClick={() => router.push(`/tours-travels/${HERO_SLIDES[currentSlide].slug}`)}
            className="px-6 py-3.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/40 text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>View Full Itinerary</span>
          </button>
        </div>

        {/* Minimal Slide Indicators */}
        <div className="flex items-center justify-center gap-2 mb-6 select-none">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentSlide
                  ? 'w-8 bg-[#C65A2E] shadow-sm'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Refined Minimal Trust Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs text-[#5D5047] font-medium select-none">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#EDE2D0] shadow-sm">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span><strong className="font-bold text-[#3B2E27]">4.9/5</strong> (1,200+ Yatris)</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#EDE2D0] shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Commercial Tourist Fleet</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#EDE2D0] shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C65A2E]" />
            <span>Satvik Meals &amp; 3★ Stays</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#EDE2D0] shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C65A2E]" />
            <span>100% Confirmed Departures</span>
          </div>
        </div>

      </div>

    </section>
  );
}
