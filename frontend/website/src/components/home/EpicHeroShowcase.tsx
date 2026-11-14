'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
} from 'lucide-react';
import { TourPackage } from '@/constants/toursData';
import { fetchLiveTourPackages } from '@/services/tours.service';
import { useAutoRefresh } from '@/hooks/useRealtimeSync';

const DEFAULT_HERO_SLIDES = [
  {
    id: 'mumbai-ujjain',
    image: '/images/tours/mumbai_ujjain_omkareshwar_tour.jpg',
    badge: '✨ Special Spiritual Yatra • 3D / 1N',
    label: 'Mumbai to Ujjain Mahakal',
    tag: 'Ujjain, Omkareshwar & Maheshwar',
    title: 'Mumbai to Ujjain Mahakal | Omkareshwar Jyotirlinga | Maheshwar',
    subtitle: 'Special 2026 spiritual pilgrimage from Mumbai covering Ujjain Mahakaleshwar Jyotirlinga, Mahakal Corridor, Kaal Bhairav, Omkareshwar Jyotirlinga, Mamleshwar, and historic Maheshwar Rajwada.',
    slug: 'mumbai-ujjain-mahakal-omkareshwar-maheshwar',
    price: '₹7,499',
    deposit: '₹2,999',
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

const AUTO_SCROLL_DURATION = 5500; // 5.5 seconds per slide

interface EpicHeroShowcaseProps {
  packages?: TourPackage[];
}

export default function EpicHeroShowcase({ packages: initialPackages }: EpicHeroShowcaseProps = {}) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [livePackages, setLivePackages] = useState<TourPackage[]>(initialPackages || []);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const loadPackages = useCallback(() => {
    fetchLiveTourPackages(true).then((pkgs) => {
      if (Array.isArray(pkgs) && pkgs.length > 0) {
        setLivePackages(pkgs);
      }
    });
  }, []);

  useEffect(() => {
    if (initialPackages && initialPackages.length > 0) {
      setLivePackages(initialPackages);
    } else {
      loadPackages();
    }
  }, [initialPackages, loadPackages]);

  useAutoRefresh(loadPackages, ['TOURS_UPDATED'], 8000);

  // Dynamically merge live packages from DB into the hero carousel slides
  const heroSlides = useMemo(() => {
    return DEFAULT_HERO_SLIDES.map((defaultSlide) => {
      const match = livePackages.find((p) => {
        if (!p) return false;
        if (defaultSlide.id === 'mumbai-ujjain') {
          return (
            p.slug.includes('mumbai-ujjain') ||
            p.id.includes('mumbai-ujjain') ||
            (p.title?.toLowerCase().includes('mumbai') && p.title?.toLowerCase().includes('ujjain'))
          );
        }
        if (defaultSlide.id === 'sanwaliya-seth') {
          return (
            p.slug.includes('sanwaliya') ||
            p.id === 'sanwaliya-seth' ||
            p.title?.toLowerCase().includes('sanwaliya')
          );
        }
        if (defaultSlide.id === 'girnar-trip') {
          return (
            p.slug.includes('girnar') ||
            p.id === 'girnar-trip' ||
            p.title?.toLowerCase().includes('girnar')
          );
        }
        return false;
      });

      if (!match) return defaultSlide;

      return {
        ...defaultSlide,
        title: match.title || defaultSlide.title,
        subtitle: match.subtitle || match.overview || defaultSlide.subtitle,
        slug: match.slug || defaultSlide.slug,
        price: match.priceDisplay ? match.priceDisplay.replace(' per person', '') : `₹${match.basePrice.toLocaleString('en-IN')}`,
        deposit: match.advanceLabel
          ? match.advanceLabel.replace(' Advance', '')
          : `₹${match.depositPrice.toLocaleString('en-IN')}`,
        image: match.image || defaultSlide.image,
      };
    });
  }, [livePackages]);

  // Smooth, lag-free auto-scroll timer
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, AUTO_SCROLL_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, heroSlides.length]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const activeSlide = heroSlides[currentSlide] || heroSlides[0];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full bg-[#120F0D] pt-24 pb-12 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-16 overflow-hidden flex items-center justify-center font-sans border-b border-[#EDE2D0]/40 select-none"
    >

      {/* ─── 1. BUTTERY-SMOOTH HARDWARE-ACCELERATED CAROUSEL ─── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {heroSlides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-all duration-[1200ms] ease-out will-change-[opacity,transform] ${isActive
                  ? 'opacity-100 scale-100 z-10'
                  : 'opacity-0 scale-105 pointer-events-none z-0'
                }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.06]"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}

        {/* Ambient atmospheric gradient overlays for optimal text clarity */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/70 via-black/45 to-black/80 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#FCFAF6] via-[#FCFAF6]/40 to-transparent z-20 pointer-events-none" />
      </div>

      {/* Side Arrow Navigation */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="hidden xl:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/15 text-white items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 hover:border-white/30"
      >
        <ChevronLeft className="w-5 h-5 text-white/90" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="hidden xl:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/15 text-white items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95 hover:border-white/30"
      >
        <ChevronRight className="w-5 h-5 text-white/90" />
      </button>

      {/* ─── 2. MINIMALIST CLEAN HERO CONTENT ─── */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center">

        {/* Sleek Minimalist Tabs with Auto-Scroll Progress */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          {heroSlides.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`relative overflow-hidden px-4 sm:px-5 py-2 rounded-full text-xs sm:text-[13px] font-semibold transition-all duration-300 cursor-pointer backdrop-blur-md border flex items-center gap-2 ${isActive
                    ? 'bg-[#C65A2E] text-white border-[#C65A2E] shadow-md shadow-[#C65A2E]/25 scale-[1.02]'
                    : 'bg-black/35 hover:bg-black/55 text-white/80 border-white/15 hover:border-white/30'
                  }`}
              >
                <span>{slide.label}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
                  }`}>
                  {slide.price}
                </span>

                {/* Subtle auto-play progress bar on active tab */}
                {isActive && !isPaused && (
                  <span
                    key={`progress-${currentSlide}`}
                    className="absolute bottom-0 left-0 h-[2px] bg-white/70 animate-hero-progress"
                    style={{ animationDuration: `${AUTO_SCROLL_DURATION}ms` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Minimal Animated Text Content Container */}
        <div
          key={`content-${currentSlide}`}
          className="flex flex-col items-center transition-opacity duration-500 ease-out animate-fadeIn"
        >
          {/* Subtle Pill Tag */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-medium mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-[#E8B9A5]" />
            <span>{activeSlide.badge}</span>
          </div>

          {/* Clean Elegant Headline */}
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.18] mb-3 max-w-3xl drop-shadow-md">
            {activeSlide.title}
          </h1>

          {/* Minimalist Subtitle */}
          <p className="text-xs sm:text-sm md:text-[15px] text-white/85 max-w-2xl mx-auto leading-relaxed font-light mb-6 sm:mb-8 drop-shadow-sm">
            {activeSlide.subtitle}
          </p>

          {/* Clean Dual CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-7 sm:mb-9">
            <button
              type="button"
              onClick={() => router.push(`/tours-travels/${activeSlide.slug}`)}
              className="px-6 sm:px-7 py-3 rounded-full bg-[#C65A2E] hover:bg-[#B24E25] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95 group"
            >
              <Compass className="w-4 h-4 text-white group-hover:rotate-45 transition-transform" />
              <span>Book This Tour • Advance: {activeSlide.deposit}</span>
              <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => router.push(`/tours-travels/${activeSlide.slug}`)}
              className="px-5 sm:px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/25 text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>View Full Itinerary</span>
            </button>
          </div>
        </div>

        {/* Minimalist Trust Ribbon (Unified sleek glass bar) */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-4 sm:gap-x-6 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-[#EDE2D0] shadow-sm text-xs text-[#5D5047] font-medium">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span><strong className="font-bold text-[#3B2E27]">4.9/5</strong> (1,200+ Yatris)</span>
          </div>

          <span className="hidden sm:inline text-[#EDE2D0]">•</span>

          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Commercial Tourist Fleet</span>
          </div>

          <span className="hidden sm:inline text-[#EDE2D0]">•</span>

          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C65A2E]" />
            <span>Satvik Meals &amp; 3★ Stays</span>
          </div>

          <span className="hidden sm:inline text-[#EDE2D0]">•</span>

          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C65A2E]" />
            <span>100% Confirmed Departures</span>
          </div>
        </div>

      </div>

    </section>
  );
}
