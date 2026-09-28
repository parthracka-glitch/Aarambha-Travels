'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Bus, Car, HelpCircle, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FCFAF6] border-t border-[#EDE2D0] pt-14 pb-10 text-[#493B34] select-none font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Overview Column */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-[#EDE2D0] p-1 shrink-0 flex items-center justify-center shadow-2xs">
                <img
                  src="/images/aarambha_logo.png"
                  alt="आरंभ Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLElement).setAttribute('src', '/logo.png'); }}
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

            <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed max-w-sm">
              Premium spiritual pilgrimage yatras, luxury Force Urbania &amp; bus rentals, and reliable self-drive fleet management across India.
            </p>

            <div className="pt-1 text-xs text-[#756B63] space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C65A2E] shrink-0 mt-0.5" />
                <span>Katraj - Kondhwa Road, Pune, Maharashtra 411046</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C65A2E] shrink-0" />
                <span>+91 90676 17451 (24x7 Customer Support)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C65A2E] shrink-0" />
                <span>contact@aarambhatravels.in</span>
              </div>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
            
            {/* Column 1: Spiritual Tours */}
            <div className="space-y-3">
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#493B34] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#C65A2E]" />
                <span>Spiritual Tours</span>
              </h3>
              <ul className="space-y-2 text-[#756B63]">
                <li><Link href="/tours-travels" className="hover:text-[#C65A2E] transition-colors">All Tour Packages</Link></li>
                <li><Link href="/tours-travels/3-jyotirlinga-special" className="hover:text-[#C65A2E] transition-colors">3 Jyotirlinga Yatra</Link></li>
                <li><Link href="/tours-travels/ashtavinayak-special" className="hover:text-[#C65A2E] transition-colors">Ashtavinayak Darshan</Link></li>
                <li><Link href="/tours-travels/mathura-vrindavan-agra" className="hover:text-[#C65A2E] transition-colors">Vrindavan &amp; Agra</Link></li>
                <li><Link href="/my-bookings" className="hover:text-[#C65A2E] transition-colors font-semibold text-[#C65A2E]">Track Booking Status</Link></li>
              </ul>
            </div>

            {/* Column 2: Bus & Car Rentals */}
            <div className="space-y-3">
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#493B34] flex items-center gap-1.5">
                <Bus className="w-4 h-4 text-[#C65A2E]" />
                <span>Bus &amp; Fleet</span>
              </h3>
              <ul className="space-y-2 text-[#756B63]">
                <li><Link href="/bus-rentals" className="hover:text-[#C65A2E] transition-colors">Bus Rate Calculator</Link></li>
                <li><Link href="/bus-rentals" className="hover:text-[#C65A2E] transition-colors">Force Urbania (17S)</Link></li>
                <li><Link href="/bus-rentals" className="hover:text-[#C65A2E] transition-colors">Luxury Coaches (32-45S)</Link></li>
                <li><Link href="/car-rentals" className="hover:text-[#C65A2E] transition-colors">Self-Drive Car Rentals</Link></li>
                <li><Link href="/car-rentals" className="hover:text-[#C65A2E] transition-colors">SUVs &amp; Sedans</Link></li>
              </ul>
            </div>

            {/* Column 3: Help & Policies */}
            <div className="space-y-3">
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#493B34] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#C65A2E]" />
                <span>Support &amp; Legal</span>
              </h3>
              <ul className="space-y-2 text-[#756B63]">
                <li><Link href="/faq" className="hover:text-[#C65A2E] transition-colors">Help Center &amp; FAQ</Link></li>
                <li><Link href="/legal/terms-and-conditions" className="hover:text-[#C65A2E] transition-colors">Terms of Service</Link></li>
                <li><Link href="/legal/privacy-policy" className="hover:text-[#C65A2E] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/refund-policy" className="hover:text-[#C65A2E] transition-colors">Refund Policy</Link></li>
                <li><Link href="/legal/security-policy" className="hover:text-[#C65A2E] transition-colors">Security &amp; Trust</Link></li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[#EDE2D0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#756B63]">
          <p>© {new Date().getFullYear()} आरंभ (Aarambha) Tours &amp; Travels. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/legal/terms-and-conditions" className="hover:text-[#C65A2E] transition-colors">Terms</Link>
            <span>•</span>
            <Link href="/legal/privacy-policy" className="hover:text-[#C65A2E] transition-colors">Privacy</Link>
            <span>•</span>
            <Link href="/legal/refund-policy" className="hover:text-[#C65A2E] transition-colors">Refunds</Link>
            <span>•</span>
            <button onClick={scrollToTop} className="hover:text-[#C65A2E] font-medium cursor-pointer">
              Back to Top ↑
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
