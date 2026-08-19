'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Menu, X, Compass, Car, BookmarkCheck, ChevronRight, User, LogOut } from 'lucide-react';

const MyBookingsDrawer = dynamic(() => import('../booking/MyBookingsDrawer'), {
  ssr: false,
});

export default function Navbar({ vertical = 'home' }: { vertical?: 'tours' | 'fleet' | 'home' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);

    const checkUser = () => {
      try {
        const stored = localStorage.getItem('aarambha_user');
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('aarambha_auth_changed', checkUser);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('aarambha_auth_changed', checkUser);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('aarambha_user');
      window.dispatchEvent(new Event('aarambha_auth_changed'));
    } catch {}
  };

  const isToursActive = pathname.startsWith('/tours-travels') || vertical === 'tours';
  const isCarsActive = pathname.startsWith('/car-rentals') || pathname.startsWith('/cars') || vertical === 'fleet';

  return (
    <>
      <header
        className={`w-full sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#09090b]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-3'
            : 'bg-[#0a0a0c] border-b border-white/10 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          
          {/* ─── 1. BRAND LOGO ────────────────────────────────────────── */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="flex items-center gap-3 group hover:opacity-95 transition-opacity"
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-white p-0.5 ring-1 ring-white/20 shadow-lg shadow-black/30 group-hover:scale-105 transition-transform shrink-0">
                <img
                  src="/images/logo.jpeg"
                  alt="आरंभ Tours & Travels Logo"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-baseline gap-1">
                  <span className="font-['Amita','Yatra_One','Rozha_One',serif] text-2xl sm:text-3xl font-bold tracking-wide text-white drop-shadow-sm leading-none">
                    आरंभ
                  </span>
                  <span className="text-[#FF3B30] font-black text-2xl sm:text-3xl leading-none">.</span>
                </div>
                <span className="text-[8.5px] sm:text-[9.5px] font-extrabold text-gray-400 uppercase tracking-[0.2em] leading-none mt-1 group-hover:text-gray-300 transition-colors">
                  Tours & Travels
                </span>
              </div>
            </Link>
          </div>

          {/* ─── 2. DESKTOP NAVIGATION LINKS ─────────────────────────────── */}
          <nav className="hidden md:flex items-center justify-center gap-8 lg:gap-10 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
            <Link
              href="/"
              className={`relative py-1 transition-colors hover:text-white ${
                pathname === '/' ? 'text-white font-extrabold' : 'text-gray-400'
              }`}
            >
              <span>Home</span>
              {pathname === '/' && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#FF3B30] to-emerald-500 rounded-full" />
              )}
            </Link>

            {(!isCarsActive || pathname === '/') && (
              <Link
                href="/tours-travels"
                className={`relative py-1 flex items-center gap-1.5 transition-colors hover:text-emerald-400 ${
                  isToursActive ? 'text-emerald-400 font-extrabold' : 'text-gray-400'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Tours & Travels</span>
                {isToursActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-emerald-500 rounded-full" />
                )}
              </Link>
            )}

            {(!isToursActive || pathname === '/') && (
              <Link
                href="/car-rentals"
                className={`relative py-1 flex items-center gap-1.5 transition-colors hover:text-[#FF3B30] ${
                  isCarsActive ? 'text-[#FF3B30] font-extrabold' : 'text-gray-400'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Car Rentals</span>
                {isCarsActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#FF3B30] rounded-full" />
                )}
              </Link>
            )}

            <Link
              href="/car-rentals/faq"
              className={`relative py-1 transition-colors hover:text-white ${
                pathname.includes('/faq') ? 'text-white font-extrabold' : 'text-gray-400'
              }`}
            >
              <span>FAQs</span>
              {pathname.includes('/faq') && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white rounded-full" />
              )}
            </Link>
          </nav>

          {/* ─── 3. RIGHT ACTION BUTTONS ────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-2 bg-white/5 border border-white/15 px-3 py-1.5 rounded-full backdrop-blur-md">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-syne font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-bold text-gray-200 truncate max-w-[110px]">
                  {user.name ? user.name.split(' ')[0] : 'Member'}
                </span>
                <button
                  onClick={handleLogout}
                  title="Log Out"
                  className="text-gray-400 hover:text-[#FF3B30] p-1 rounded-full hover:bg-white/10 transition-colors ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 transition-all uppercase tracking-wider"
              >
                <User className="w-3.5 h-3.5 text-[#FF3B30]" />
                <span>Log In</span>
              </Link>
            )}

            <Link
              href="/my-bookings"
              className="group flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-extrabold uppercase tracking-wider backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-sm whitespace-nowrap"
            >
              <BookmarkCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>My Bookings</span>
            </Link>

            <Link
              href={isToursActive ? "/tours-travels" : "/car-rentals/cars"}
              className="text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-full bg-white text-black hover:bg-gray-100 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Book Now</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>

          {/* ─── 4. MOBILE HAMBURGER BUTTON ──────────────────────────────── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-200 hover:text-white border border-white/10 backdrop-blur-md transition-all cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

        {/* ─── 5. MINIMALIST ULTRA-PREMIUM MOBILE DRAWER ────────────────── */}
        {mobileOpen && (
          <div className="md:hidden bg-[#09090b]/98 backdrop-blur-3xl border-b border-white/10 px-6 py-6 space-y-6 text-xs font-medium text-white uppercase tracking-wider animate-in fade-in slide-in-from-top-3 duration-300">
            
            {/* Minimal Segmented Capsule Switcher */}
            <div className="p-1 rounded-full bg-white/[0.04] border border-white/10 flex items-center gap-1">
              <Link
                href="/tours-travels"
                onClick={() => setMobileOpen(false)}
                className={`flex-1 py-2.5 rounded-full flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  isToursActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Tours & Travels</span>
              </Link>

              <Link
                href="/car-rentals"
                onClick={() => setMobileOpen(false)}
                className={`flex-1 py-2.5 rounded-full flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  isCarsActive
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Car Rentals</span>
              </Link>
            </div>

            {/* Clean Minimalist Nav List */}
            <nav className="flex flex-col gap-1 py-2">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center justify-between py-3 px-3 rounded-xl transition-colors ${
                  pathname === '/' ? 'bg-white/5 text-white font-extrabold' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {pathname === '/' && <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />}
                  <span>Home</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
              </Link>

              <Link
                href="/tours-travels"
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center justify-between py-3 px-3 rounded-xl transition-colors ${
                  isToursActive ? 'bg-white/5 text-emerald-400 font-extrabold' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isToursActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  <span>Tours & Travels</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
              </Link>

              <Link
                href={pathname === '/' ? '/?view=cars' : '/car-rentals'}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center justify-between py-3 px-3 rounded-xl transition-colors ${
                  isCarsActive ? 'bg-white/5 text-[#FF3B30] font-extrabold' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCarsActive && <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />}
                  <span>Car Rentals</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
              </Link>

              <Link
                href="/car-rentals/faq"
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center justify-between py-3 px-3 rounded-xl transition-colors ${
                  pathname.includes('/faq') ? 'bg-white/5 text-white font-extrabold' : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {pathname.includes('/faq') && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  <span>FAQs</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
              </Link>
            </nav>

            {/* Refined Action Buttons */}
            <div className="pt-2 flex flex-col gap-3">
              {user ? (
                <div className="w-full py-3 px-4 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 font-syne font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
                      <div className="text-[10px] text-gray-400 font-normal lowercase">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="text-xs font-bold text-[#FF3B30] hover:underline flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-[#FF3B30]" />
                  <span>Log In / Create Account</span>
                </Link>
              )}

              <button
                onClick={() => {
                  setMobileOpen(false);
                  setBookingsOpen(true);
                }}
                className="w-full py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                <span>My Bookings</span>
              </button>

              <Link
                href="/car-rentals/cars"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3.5 rounded-full bg-white hover:bg-gray-100 text-black font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <span>Book Now</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {bookingsOpen && <MyBookingsDrawer isOpen={bookingsOpen} onClose={() => setBookingsOpen(false)} />}
    </>
  );
}
