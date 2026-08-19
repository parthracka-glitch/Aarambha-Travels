'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ArrowUp, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const isCarsActive = pathname.startsWith('/car-rentals') || pathname.startsWith('/cars');
  const isToursActive = pathname.startsWith('/tours-travels');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-white border-t border-gray-200 pt-12 pb-8 font-sans">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
          
          {/* Top Newsletter & Links */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column (Brand & Newsletter) */}
            <div className="lg:col-span-5 space-y-4">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-white p-0.5 ring-1 ring-gray-200 shadow-md">
                  <img
                    src="/images/logo.jpeg"
                    alt="आरंभ Logo"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-['Amita','Yatra_One','Rozha_One',serif] text-2xl sm:text-3xl font-bold text-[#111111] leading-none">
                      आरंभ
                    </span>
                    <span className="text-[#FF3B30] font-black text-2xl sm:text-3xl leading-none">.</span>
                  </div>
                  <p className="text-[9px] font-extrabold text-gray-500 uppercase tracking-[0.2em] leading-none mt-1">
                    Tours & Travels • Self-Drive Rentals
                  </p>
                </div>
              </Link>

              <h2 className="font-syne text-xl sm:text-2xl font-bold text-[#111111] tracking-tight pt-1">
                Don’t Miss a Journey
              </h2>
              <p className="text-xs text-gray-500 max-w-md">
                Subscribe to आरंभ for exclusive holiday package deals and luxury self-drive offers.
              </p>

              {/* Pill Newsletter Form */}
              <form onSubmit={(e) => e.preventDefault()} className="pt-1 max-w-md">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    placeholder="Enter email address for newsletter ..."
                    className="w-full bg-[#FAFAFC] border border-gray-300 rounded-full px-5 py-2.5 text-xs text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-[#FF3B30] pr-10 transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-1 w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center hover:bg-[#FF3B30] transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Columns (3 Columns: Quick Link, Services, Social Media) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              
              <div className="space-y-3">
                <h3 className="font-bold text-[#111111] text-xs font-syne uppercase tracking-wider">Quick Link</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><Link href="/car-rentals/about" className="hover:text-[#FF3B30] transition-colors">About us</Link></li>
                  <li><Link href="/car-rentals/about" className="hover:text-[#FF3B30] transition-colors">Who we are</Link></li>
                  <li><Link href="/car-rentals/contact" className="hover:text-[#FF3B30] transition-colors">Contact Us</Link></li>
                  <li><Link href="/terms" className="hover:text-[#FF3B30] transition-colors font-semibold">Terms & Conditions</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-[#111111] text-xs font-syne uppercase tracking-wider">Services</h3>
                <ul className="space-y-2 text-gray-600">
                  {isCarsActive ? (
                    <>
                      <li><Link href="/car-rentals/cars" className="hover:text-[#FF3B30] transition-colors">Self-Drive Fleet</Link></li>
                      <li><Link href="/car-rentals/cars" className="hover:text-[#FF3B30] transition-colors">Luxury SUVs & Sedans</Link></li>
                      <li><Link href="/car-rentals/faq" className="hover:text-[#FF3B30] transition-colors">Car Rental FAQs</Link></li>
                    </>
                  ) : isToursActive ? (
                    <>
                      <li><Link href="/tours-travels" className="hover:text-emerald-600 transition-colors">Tour Packages</Link></li>
                      <li><Link href="/tours-travels" className="hover:text-emerald-600 transition-colors">Curated Departures</Link></li>
                      <li><Link href="/terms" className="hover:text-emerald-600 transition-colors">Tour Terms</Link></li>
                    </>
                  ) : (
                    <>
                      <li><Link href="/tours-travels" className="hover:text-emerald-600 transition-colors">Tour Packages</Link></li>
                      <li><Link href="/car-rentals/cars" className="hover:text-[#FF3B30] transition-colors">Self-Drive Fleet</Link></li>
                      <li><Link href="/car-rentals/faq" className="hover:text-[#FF3B30] transition-colors">FAQs</Link></li>
                    </>
                  )}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-[#111111] text-xs font-syne uppercase tracking-wider">Social Media</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#FF3B30] transition-colors">Facebook</a></li>
                  <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#FF3B30] transition-colors">Instagram</a></li>
                  <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#FF3B30] transition-colors">Twitter</a></li>
                </ul>
              </div>

            </div>

          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
            <p>© Copyright 2026 आरंभ Tours & Car Rentals. All rights reserved.</p>

            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="w-8 h-8 rounded-full bg-[#FF3B30] text-white flex items-center justify-center hover:bg-[#E03126] transition-colors shadow-md shadow-red-500/20"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </footer>

      {/* ─── NIRVANAA STUDIOS WATERMARK FOOTER STRIP ─── */}
      <aside aria-label="Website credits" className="w-full bg-[#09090b] py-3.5 px-6 border-t border-white/10 text-center flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400 select-none">
        <span className="text-[11px] text-gray-400 font-medium">Crafted with</span>
        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline-block animate-pulse" />
        <span className="text-[11px] text-gray-400 font-medium">by</span>
        <span className="font-syne font-black tracking-widest text-[12px] bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 bg-clip-text text-transparent uppercase drop-shadow-sm px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
          NIRVANAA STUDIOS
        </span>
        <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
      </aside>
    </>
  );
}
