'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ArrowRight, Compass, Car, Sparkles } from 'lucide-react';

export default function EpicHeroShowcase() {
  const [expandedSide, setExpandedSide] = useState<'none' | 'cars' | 'tours'>('none');
  const [hoveredSide, setHoveredSide] = useState<'none' | 'cars' | 'tours'>('none');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'cars') {
      setExpandedSide('cars');
    } else if (view === 'tours') {
      setExpandedSide('tours');
    } else if (view === 'none') {
      setExpandedSide('none');
    }
  }, [searchParams]);

  const handleClose = () => {
    setExpandedSide('none');
    router.push(pathname, { scroll: false });
  };

  return (
    <section className="relative w-full bg-[#09090b] text-white overflow-hidden select-none border-b border-white/10">
      <div className="relative w-full h-[540px] sm:h-[640px] lg:h-[700px] flex overflow-hidden">
        
        <AnimatePresence mode="wait">
          {expandedSide === 'none' && (
            <motion.div
              key="split-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex flex-col md:flex-row relative"
            >
              {/* TOP HALF (MOBILE) / LEFT HALF (DESKTOP): TOURS & TRAVELS */}
              <motion.div
                onClick={() => {
                  setExpandedSide('tours');
                  router.push(`${pathname}?view=tours`, { scroll: false });
                }}
                onMouseEnter={() => setHoveredSide('tours')}
                onMouseLeave={() => setHoveredSide('none')}
                whileHover={{ scale: 1.008 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="relative w-full md:w-1/2 h-1/2 md:h-full cursor-pointer overflow-hidden group border-b md:border-b-0 md:border-r border-white/20 bg-black"
              >
                {/* Character / Travel Artwork Image */}
                <motion.img
                  src="/images/tours_travels_bg.jpg?v=2"
                  alt="Tours & Travels - Ujjain"
                  className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                    hoveredSide === 'tours' ? 'scale-108 filter brightness-115 saturate-110' : 'scale-100 filter brightness-105 contrast-105'
                  }`}
                />
                
                {/* Backdrop Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent group-hover:from-black/55 transition-all duration-500" />

                {/* Content & Staggered Elements */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center z-20">
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="text-[10px] sm:text-xs uppercase tracking-widest text-[#9CB4E8] font-extrabold mb-2 flex items-center gap-1.5 bg-[#5266EB]/20 px-3.5 py-1.5 rounded-full border border-[#5266EB]/30 backdrop-blur-md shadow-lg shadow-[#5266EB]/40"
                  >
                    <Compass className="w-3.5 h-3.5" /> Curated Packages
                  </motion.span>

                  <h2 className="font-syne text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight drop-shadow-2xl group-hover:scale-105 group-hover:tracking-wider transition-all duration-500 text-white">
                    TOURS & TRAVELS
                  </h2>

                  <p className="text-[11px] sm:text-xs text-[#EDEDF3] mt-2 max-w-xs leading-snug group-hover:text-white transition-colors">
                    Tap to explore Hill Stations, Forts & Fixed Departures
                  </p>

                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#9CB4E8] bg-white/10 px-3.5 py-1 rounded-full border border-white/20 backdrop-blur-md"
                  >
                    <span>Tap to Open</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                </div>
              </motion.div>

              {/* BOTTOM HALF (MOBILE) / RIGHT HALF (DESKTOP): BUS RENTALS */}
              <motion.div
                onClick={() => {
                  router.push('/bus-rentals');
                }}
                onMouseEnter={() => setHoveredSide('cars')}
                onMouseLeave={() => setHoveredSide('none')}
                whileHover={{ scale: 1.008 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="relative w-full md:w-1/2 h-1/2 md:h-full cursor-pointer overflow-hidden group bg-black"
              >
                {/* Background Bus Rental Image */}
                <motion.img
                  src="/images/bus_rental_client_hero.jpg"
                  alt="Bus Rentals - 5 to 50 Seater Fleet"
                  className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                    hoveredSide === 'cars' ? 'scale-108 filter brightness-120 saturate-125' : 'scale-100 filter brightness-110 contrast-105'
                  }`}
                />
                
                {/* Soft Lightened Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent group-hover:from-black/50 transition-all duration-500" />
                
                {/* Content & Staggered Elements */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center z-20">
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-[10px] sm:text-xs uppercase tracking-widest text-[#AFB2CE] font-extrabold mb-2 flex items-center gap-1.5 bg-[#9CB4E8]/20 px-3.5 py-1.5 rounded-full border border-[#9CB4E8]/30 backdrop-blur-md shadow-lg shadow-[#171721]/40"
                  >
                    <Car className="w-3.5 h-3.5" /> Bus & Fleet Rentals
                  </motion.span>

                  <h2 className="font-syne text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight drop-shadow-2xl group-hover:scale-105 group-hover:tracking-wider transition-all duration-500 text-white">
                    BUS RENTALS
                  </h2>

                  <p className="text-[11px] sm:text-xs text-gray-300 mt-2 max-w-xs leading-snug group-hover:text-white transition-colors">
                    Tap to explore 5-50 Seater Buses, Urbania & Car Fleet
                  </p>

                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#AFB2CE] bg-white/10 px-3.5 py-1 rounded-full border border-white/20 backdrop-blur-md"
                  >
                    <span>Tap to Open</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                </div>
              </motion.div>

              {/* DESKTOP NAVIGATION CHEVRONS */}
              <motion.button
                whileHover={{ scale: 1.15, x: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedSide('tours');
                  router.push(`${pathname}?view=tours`, { scroll: false });
                }}
                aria-label="Previous Slide / Tours & Travels"
                className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15, x: 3 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/bus-rentals');
                }}
                aria-label="Next Slide / Bus Rentals"
                className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              2. EXPANDED TOURS & TRAVELS MODE (FORTNITE EXPANDED WITH ANIMATIONS)
              ───────────────────────────────────────────────────────────────── */}
          {expandedSide === 'tours' && (
            <motion.div
              key="tours-expanded"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full bg-gradient-to-r from-[#171721] via-[#272735] to-[#5266EB] flex flex-col md:flex-row items-center justify-between overflow-hidden"
            >
              {/* Background Travel Artwork */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src="/images/tours_travels_bg.jpg?v=2"
                  alt="Tours Expanded - Ujjain"
                  className="w-full h-full object-cover object-[center_30%] opacity-95 filter brightness-110 contrast-105 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/55 to-black/30" />
              </div>

              {/* Left Side Graphic / Featured Tour Mockup */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="hidden md:flex relative z-10 w-full md:w-1/2 h-full items-center justify-center p-6 md:p-12"
              >
                <div className="relative w-full max-w-sm h-[75%] flex items-center justify-center">
                  <motion.img
                    whileHover={{ scale: 1.02 }}
                    src="/images/hillstation_featured.jpg"
                    alt="Featured Hill Station Tour Destination"
                    className="w-full h-full object-cover rounded-3xl border-4 border-white/20 shadow-2xl transition-all duration-500"
                  />
                  <div className="absolute bottom-6 left-6 right-6 bg-black/75 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CB4E8] block font-syne">Featured Destination</span>
                    <h4 className="font-syne font-bold text-base text-white">Hill Station & Heritage Packages</h4>
                    <p className="text-xs text-gray-300">Lock your batch departure with just ₹500 deposit.</p>
                  </div>
                </div>
              </motion.div>

              {/* Right Side Staggered Text & CTA Button */}
              <div className="relative z-10 w-full md:w-1/2 h-full flex flex-col justify-center items-center md:items-start p-6 sm:p-10 lg:p-14 text-center md:text-left space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="space-y-2"
                >
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#EDEDF3] bg-white/15 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
                    Aarambha Experiences
                  </span>
                  <h1 className="font-syne text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white drop-shadow-2xl leading-tight">
                    TOURS &<br className="hidden sm:block" /> TRAVELS
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xs sm:text-sm text-[#AFB2CE] max-w-md leading-relaxed font-medium"
                >
                  Curated departure batches, luxury hill station stays, and heritage packages with local guide support.
                </motion.p>

                {/* Boxed EXPLORE CTA Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Link
                    href="/tours-travels"
                    className="relative group inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 border-2 border-white bg-white/10 hover:bg-white text-white hover:text-black font-extrabold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 backdrop-blur-sm shadow-2xl overflow-hidden"
                  >
                    <span className="relative z-10">EXPLORE</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </motion.div>
              </div>

              {/* TOP RIGHT CLOSE ICON (X) */}
              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                aria-label="Close Expanded View"
                className="absolute top-4 right-4 sm:top-8 sm:right-8 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer border border-white/30 shadow-2xl"
              >
                <X className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
              </motion.button>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────────
              3. EXPANDED CAR RENTALS MODE (UNREAL ENGINE EXPANDED WITH ANIMATIONS)
              ───────────────────────────────────────────────────────────────── */}
          {expandedSide === 'cars' && (
            <motion.div
              key="cars-expanded"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full bg-[#0d0d11] flex flex-col md:flex-row items-center justify-between overflow-hidden"
            >
              {/* Background Car Image */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src="/images/car_rentals_bg.jpg?v=2"
                  alt="Bus Rentals Expanded"
                  className="w-full h-full object-cover opacity-100 filter brightness-115 contrast-105 scale-105"
                />
                {/* Subtle soft gradient overlay so vehicle remains crystal clear */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
              </div>

              {/* Content & Staggered Elements */}
              <div className="relative z-10 w-full md:w-3/5 h-full flex flex-col justify-center items-center md:items-start p-6 sm:p-10 lg:p-14 text-center md:text-left space-y-5 sm:space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="space-y-2"
                >
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-500/20 px-4 py-1.5 rounded-full border border-amber-500/30 backdrop-blur-md">
                    Bus & Fleet Rentals
                  </span>
                  <h1 className="font-syne text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white drop-shadow-2xl leading-tight">
                    BUS<br className="hidden sm:block" /> RENTALS
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xs sm:text-base text-gray-300 max-w-lg leading-relaxed font-normal"
                >
                  Book 5-seater to 50-seater buses, Urbania Tempo Travellers, and luxury car fleet for Pune local trips and outstation travel with 100% transparent pricing.
                </motion.p>

                {/* Boxed EXPLORE CTA Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Link
                    href="/bus-rentals"
                    className="relative group inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 border-2 border-white bg-white/10 hover:bg-white text-white hover:text-black font-extrabold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 backdrop-blur-sm shadow-2xl overflow-hidden"
                  >
                    <span className="relative z-10">EXPLORE</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </motion.div>
              </div>

              {/* TOP RIGHT CLOSE ICON (X) */}
              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                aria-label="Close Expanded View"
                className="absolute top-4 right-4 sm:top-8 sm:right-8 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer border border-white/30 shadow-2xl"
              >
                <X className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
