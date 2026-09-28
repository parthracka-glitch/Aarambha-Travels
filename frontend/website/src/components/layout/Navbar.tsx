'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Phone,
  BookmarkCheck,
  LogOut,
  ChevronDown,
  Compass,
  Car,
  Bus,
  HelpCircle,
} from 'lucide-react';

const MyBookingsDrawer = dynamic(() => import('../booking/MyBookingsDrawer'), {
  ssr: false,
});

export default function Navbar({ vertical = 'home' }: { vertical?: 'tours' | 'fleet' | 'home' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
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
      window.removeEventListener('aarambha_auth_changed', checkUser);
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownOpen]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('aarambha_user');
      localStorage.removeItem('aarambha_token');
      window.dispatchEvent(new Event('aarambha_auth_changed'));
      setUser(null);
      setProfileDropdownOpen(false);
      router.push('/');
    } catch {}
  };

  const isToursActive = pathname.startsWith('/tours-travels');
  const isBusActive = pathname.startsWith('/bus-rentals');
  const isCarActive = pathname.startsWith('/car-rentals') || pathname.startsWith('/cars');
  const isFaqActive = pathname.startsWith('/faq');

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <>
      <header className="w-full fixed top-0 left-0 right-0 z-50 bg-[#FCFAF6]/95 backdrop-blur-md border-b border-[#EDE2D0] h-[66px] transition-colors select-none font-sans">
        <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* ─── BRAND LOGO ────────────────────────── */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-[#EDE2D0] p-1 shrink-0 flex items-center justify-center group-hover:border-[#C65A2E]/40 transition-colors shadow-2xs">
                <img
                  src="/images/aarambha_logo.png"
                  alt="Aarambha Travels Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).setAttribute('src', '/logo.png');
                  }}
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[17px] font-bold tracking-tight text-[#493B34] leading-tight flex items-center gap-1">
                  <span>आरंभ</span>
                  <span className="font-semibold text-[#C65A2E]">Travels</span>
                </span>
                <span className="text-[10px] text-[#756B63] tracking-normal leading-none mt-0.5 font-medium">
                  Pilgrimages &amp; Fleet Rentals
                </span>
              </div>
            </Link>
          </div>

          {/* ─── MINIMAL DESKTOP NAVIGATION LINKS ─────────────────── */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[14px]">
            <Link
              href="/tours-travels"
              className={`transition-colors py-1 ${
                isToursActive
                  ? 'text-[#C65A2E] font-semibold'
                  : 'text-[#493B34] hover:text-[#C65A2E]'
              }`}
            >
              Spiritual Tours
            </Link>

            <Link
              href="/bus-rentals"
              className={`transition-colors py-1 ${
                isBusActive
                  ? 'text-[#C65A2E] font-semibold'
                  : 'text-[#493B34] hover:text-[#C65A2E]'
              }`}
            >
              Bus Rentals
            </Link>

            <Link
              href="/car-rentals"
              className={`transition-colors py-1 ${
                isCarActive
                  ? 'text-[#C65A2E] font-semibold'
                  : 'text-[#493B34] hover:text-[#C65A2E]'
              }`}
            >
              Self-Drive Cars
            </Link>

            <Link
              href="/faq"
              className={`transition-colors py-1 ${
                isFaqActive
                  ? 'text-[#C65A2E] font-semibold'
                  : 'text-[#493B34] hover:text-[#C65A2E]'
              }`}
            >
              Help &amp; FAQ
            </Link>
          </nav>

          {/* ─── RIGHT ACTION AREA ──────────────── */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            
            {/* Phone Helpline */}
            <a
              href="https://wa.me/919067617451?text=Hello%20Aarambha%20Travels,%20I%20would%20like%20to%20inquire%20about%20a%20booking."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] text-[#493B34] hover:text-[#C65A2E] transition-colors font-medium"
              title="Direct WhatsApp & Phone Helpline"
            >
              <Phone className="w-3.5 h-3.5 text-[#C65A2E]" />
              <span>+91 90676 17451</span>
            </a>

            {/* If Logged Out: Show "Sign In" link */}
            {!user && (
              <Link
                href="/login"
                className="px-3 py-1.5 text-[13px] font-medium text-[#493B34] hover:text-[#C65A2E] hover:bg-[#EDE2D0]/30 rounded-md transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Primary Action Button */}
            <Link
              href="/tours-travels"
              className="px-4.5 py-2 rounded-xl text-[13px] font-semibold text-white bg-[#C65A2E] hover:bg-[#B24E25] transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Explore Tours</span>
              <span>&rarr;</span>
            </Link>

            {/* If Logged In: Sleek User Profile Pill & Dropdown */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white hover:bg-[#EDE2D0]/40 border border-[#EDE2D0] transition-all cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-full bg-[#C65A2E] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    {initials}
                  </div>
                  <span className="text-[13px] font-medium text-[#493B34] max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#756B63] group-hover:text-[#493B34] transition-transform duration-150" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#EDE2D0] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-[#FCFAF6] border-b border-[#EDE2D0]">
                      <p className="text-xs font-bold text-[#493B34] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#756B63] truncate mt-0.5">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-1.5 space-y-0.5 text-xs text-[#493B34]">
                      
                      {/* My Bookings & Invoices */}
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setBookingsOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F8EFEA] hover:text-[#C65A2E] text-left transition-colors cursor-pointer"
                      >
                        <BookmarkCheck className="w-4 h-4 text-[#C65A2E]" />
                        <div className="flex-1">
                          <span className="font-semibold block">My Bookings &amp; Invoices</span>
                          <span className="text-[10px] text-[#756B63]">Track trips &amp; download PDFs</span>
                        </div>
                      </button>

                      <Link
                        href="/my-bookings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F8EFEA] hover:text-[#C65A2E] transition-colors"
                      >
                        <Compass className="w-4 h-4 text-[#C65A2E]" />
                        <span>Bookings Dashboard</span>
                      </Link>

                      <Link
                        href="/car-rentals"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F8EFEA] hover:text-[#C65A2E] transition-colors"
                      >
                        <Car className="w-4 h-4 text-[#C65A2E]" />
                        <span>Self-Drive Fleet</span>
                      </Link>

                      <Link
                        href="/faq"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#F8EFEA] hover:text-[#C65A2E] transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-[#756B63]" />
                        <span>Support &amp; Policies</span>
                      </Link>
                    </div>

                    {/* Sign Out Action */}
                    <div className="p-1.5 border-t border-[#EDE2D0] bg-[#FCFAF6]">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}

          </div>

          {/* ─── MOBILE HAMBURGER BUTTON ──────────────────────────────── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#FCFAF6] text-[#493B34] border border-[#EDE2D0] transition-colors cursor-pointer hover:bg-[#F8EFEA]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

        {/* ─── MOBILE MENU DROPDOWN ─────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#FCFAF6] border-b border-[#EDE2D0] px-5 py-4 space-y-4 shadow-xl">
            
            {/* User status in mobile */}
            {user ? (
              <div className="p-3 bg-white rounded-xl border border-[#EDE2D0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#C65A2E] text-white flex items-center justify-center font-bold text-xs">
                    {initials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#493B34]">{user.name}</p>
                    <p className="text-[11px] text-[#756B63] truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold text-[#493B34] bg-white border border-[#EDE2D0] rounded-lg hover:border-[#C65A2E]"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold text-white bg-[#C65A2E] hover:bg-[#B24E25] rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Navigation links */}
            <div className="flex flex-col space-y-2 text-[14px] font-normal text-[#493B34] pt-1">
              <Link
                href="/tours-travels"
                onClick={() => setMobileOpen(false)}
                className={`py-2 px-3 rounded-lg flex items-center gap-2.5 ${
                  isToursActive ? 'bg-[#F8EFEA] text-[#C65A2E] font-bold border border-[#E8B9A5]/50' : 'hover:bg-[#F8EFEA]'
                }`}
              >
                <Compass className="w-4 h-4 text-[#C65A2E]" />
                <span>Spiritual Tours &amp; Yatras</span>
              </Link>

              <Link
                href="/bus-rentals"
                onClick={() => setMobileOpen(false)}
                className={`py-2 px-3 rounded-lg flex items-center gap-2.5 ${
                  isBusActive ? 'bg-[#F8EFEA] text-[#C65A2E] font-bold border border-[#E8B9A5]/50' : 'hover:bg-[#F8EFEA]'
                }`}
              >
                <Bus className="w-4 h-4 text-[#C65A2E]" />
                <span>Bus Rentals (17–45 Seater)</span>
              </Link>

              <Link
                href="/car-rentals"
                onClick={() => setMobileOpen(false)}
                className={`py-2 px-3 rounded-lg flex items-center gap-2.5 ${
                  isCarActive ? 'bg-[#F8EFEA] text-[#C65A2E] font-bold border border-[#E8B9A5]/50' : 'hover:bg-[#F8EFEA]'
                }`}
              >
                <Car className="w-4 h-4 text-[#C65A2E]" />
                <span>Self-Drive Cars</span>
              </Link>

              <Link
                href="/faq"
                onClick={() => setMobileOpen(false)}
                className={`py-2 px-3 rounded-lg flex items-center gap-2.5 ${
                  isFaqActive ? 'bg-[#F8EFEA] text-[#C65A2E] font-bold border border-[#E8B9A5]/50' : 'hover:bg-[#F8EFEA]'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-[#C65A2E]" />
                <span>Help &amp; FAQ</span>
              </Link>
            </div>

            {/* Action buttons */}
            <div className="pt-2 border-t border-[#EDE2D0] flex flex-col gap-2">
              {user && (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setBookingsOpen(true);
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#F8EFEA] text-[#C65A2E] border border-[#E8B9A5]/50 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <BookmarkCheck className="w-4 h-4 text-[#C65A2E]" />
                  <span>My Bookings &amp; Invoices</span>
                </button>
              )}

              <Link
                href="/tours-travels"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2.5 rounded-lg bg-[#C65A2E] hover:bg-[#B24E25] text-white text-xs font-bold flex items-center justify-center shadow-xs"
              >
                Explore Tours
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Slide-out Bookings Drawer */}
      <MyBookingsDrawer isOpen={bookingsOpen} onClose={() => setBookingsOpen(false)} />
    </>
  );
}
