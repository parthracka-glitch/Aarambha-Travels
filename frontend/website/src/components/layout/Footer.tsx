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
            <div className="lg:col-span-4 space-y-4">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white p-0.5 ring-2 ring-[#D3592B]/20 shadow-md shrink-0">
                  <img
                    src="/images/aarambha_logo.png"
                    alt="आरंभ Logo"
                    className="w-full h-full object-contain rounded-xl"
                    onError={(e) => { (e.target as HTMLElement).setAttribute('src', '/logo.png'); }}
                  />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="aarambha-logo-3d-light text-2xl sm:text-3xl font-bold leading-none select-none">
                      आरंभ
                    </span>
                  </div>
                  <p className="font-['Syne',sans-serif] text-[9px] font-extrabold text-[#3A231A] tracking-[0.25em] leading-none mt-1">
                    ✦ TOURS AND TRAVELS ✦
                  </p>
                </div>
              </Link>

              <h2 className="font-syne text-xl sm:text-2xl font-bold text-[#000000] tracking-tight pt-1">
                Don't Miss a Journey
              </h2>
              <p className="text-xs text-gray-500 max-w-md">
                Subscribe to आरंभ for exclusive holiday package deals and luxury self-drive offers.
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="pt-1 max-w-md">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    placeholder="Enter email address for newsletter ..."
                    className="w-full bg-[#FAFAFC] border border-gray-300 rounded-full px-5 py-2.5 text-xs text-[#000000] placeholder:text-gray-400 focus:outline-none focus:border-[#5266EB] pr-10 transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-1 w-7 h-7 rounded-full bg-[#171721] text-[#EDEDF3] flex items-center justify-center hover:bg-[#5266EB] transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Columns (4 Columns: Services, Legal, Company, Social) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
              
              {/* Services */}
              <div className="space-y-3">
                <h3 className="font-bold text-[#000000] text-xs font-syne uppercase tracking-wider">Services</h3>
                <ul className="space-y-2 text-gray-600">
                  {isCarsActive ? (
                    <>
                      <li><Link href="/bus-rentals" className="hover:text-[#5266EB] transition-colors font-medium">Bus & Car Rentals</Link></li>
                      <li><Link href="/bus-rentals/bus-rental" className="hover:text-[#5266EB] transition-colors">Outstation Bus Hire</Link></li>
                      <li><Link href="/bus-rentals/local-trips" className="hover:text-[#5266EB] transition-colors">Pune Local Trips</Link></li>
                      <li><Link href="/bus-rentals/car-rental" className="hover:text-[#5266EB] transition-colors">Self-Drive Fleet</Link></li>
                    </>
                  ) : isToursActive ? (
                    <>
                      <li><Link href="/tours-travels" className="hover:text-[#5266EB] transition-colors">Tour Packages</Link></li>
                      <li><Link href="/tours-travels" className="hover:text-[#5266EB] transition-colors">Curated Departures</Link></li>
                      <li><Link href="/bus-rentals" className="hover:text-[#5266EB] transition-colors font-medium">Bus & Car Rentals</Link></li>
                    </>
                  ) : (
                    <>
                      <li><Link href="/tours-travels" className="hover:text-[#5266EB] transition-colors">Tour Packages</Link></li>
                      <li><Link href="/bus-rentals" className="hover:text-[#5266EB] transition-colors font-medium">Bus & Car Rentals</Link></li>
                      <li><Link href="/bus-rentals/car-rental" className="hover:text-[#5266EB] transition-colors">Self-Drive Fleet</Link></li>
                      <li><Link href="/car-rentals/about" className="hover:text-[#5266EB] transition-colors">About Us</Link></li>
                    </>
                  )}
                </ul>
              </div>

              {/* Legal & Policies */}
              <div className="space-y-3">
                <h3 className="font-bold text-[#000000] text-xs font-syne uppercase tracking-wider">Legal</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><Link href="/legal" className="hover:text-[#5266EB] transition-colors font-semibold text-[#5266EB]">All Legal Documents ↗</Link></li>
                  <li><Link href="/legal/privacy-policy" className="hover:text-[#5266EB] transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/legal/refund-policy" className="hover:text-[#5266EB] transition-colors">Refund & Cancellation</Link></li>
                  <li><Link href="/legal/cookie-policy" className="hover:text-[#5266EB] transition-colors">Cookie Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-[#5266EB] transition-colors">Rental & Tour Policies</Link></li>
                  <li><Link href="/terms-and-conditions" className="hover:text-[#5266EB] transition-colors">Standard Terms</Link></li>
                </ul>
              </div>

              {/* More Legal */}
              <div className="space-y-3">
                <h3 className="font-bold text-[#000000] text-xs font-syne uppercase tracking-wider">Compliance</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><Link href="/legal/disclaimer" className="hover:text-[#5266EB] transition-colors">Disclaimer</Link></li>
                  <li><Link href="/legal/acceptable-use" className="hover:text-[#5266EB] transition-colors">Acceptable Use</Link></li>
                  <li><Link href="/legal/community-guidelines" className="hover:text-[#5266EB] transition-colors">Community Guidelines</Link></li>
                  <li><Link href="/legal/accessibility" className="hover:text-[#5266EB] transition-colors">Accessibility</Link></li>
                  <li><Link href="/legal/security-policy" className="hover:text-[#5266EB] transition-colors">Security Policy</Link></li>
                  <li><Link href="/nda" className="hover:text-[#5266EB] transition-colors">NDA</Link></li>
                </ul>
              </div>

              {/* Social */}
              <div className="space-y-3">
                <h3 className="font-bold text-[#000000] text-xs font-syne uppercase tracking-wider">Social Media</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#5266EB] transition-colors">Facebook</a></li>
                  <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#5266EB] transition-colors">Instagram</a></li>
                  <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#5266EB] transition-colors">Twitter / X</a></li>
                  <li><Link href="/faq" className="hover:text-[#5266EB] transition-colors">FAQ</Link></li>
                </ul>
              </div>

            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
              <p>© Copyright 2026 आरंभ Tours & Car Rentals. All rights reserved.</p>
              <span className="hidden sm:inline text-gray-300">•</span>
              <Link href="/legal/privacy-policy" className="hover:text-[#5266EB] underline transition-colors">Privacy</Link>
              <span className="text-gray-300">•</span>
              <Link href="/legal/refund-policy" className="hover:text-[#5266EB] underline transition-colors">Refunds</Link>
              <span className="text-gray-300">•</span>
              <Link href="/terms-and-conditions" className="hover:text-[#5266EB] underline transition-colors">Terms</Link>
              <span className="text-gray-300">•</span>
              <Link href="/legal/cookie-policy" className="hover:text-[#5266EB] underline transition-colors">Cookies</Link>
              <span className="text-gray-300">•</span>
              <Link href="/nda" className="hover:text-[#5266EB] underline transition-colors">NDA</Link>
            </div>

            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="w-8 h-8 rounded-full bg-[#5266EB] text-[#EDEDF3] flex items-center justify-center hover:bg-[#3E51D4] transition-colors shadow-md shadow-[#5266EB]/20"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </footer>

      {/* ─── NIRVANAA STUDIOS WATERMARK FOOTER STRIP ─── */}
      <aside aria-label="Website credits" className="w-full bg-[#171721] py-3.5 px-6 border-t border-[#272735] text-center flex flex-wrap items-center justify-center gap-2 text-xs text-[#AFB2CE] select-none">
        <span className="text-[11px] text-[#AFB2CE] font-medium">Crafted with</span>
        <Heart className="w-3.5 h-3.5 text-[#5266EB] fill-[#5266EB] inline-block animate-pulse" />
        <span className="text-[11px] text-[#AFB2CE] font-medium">by</span>
        <span className="font-syne font-black tracking-widest text-[12px] bg-gradient-to-r from-[#5266EB] via-[#9CB4E8] to-[#AFB2CE] bg-clip-text text-transparent uppercase drop-shadow-sm px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
          NIRVANAA STUDIOS
        </span>
        <Sparkles className="w-3.5 h-3.5 text-[#9CB4E8] fill-[#9CB4E8]/30" />
      </aside>
    </>
  );
}
