'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, Compass, Car, Zap } from 'lucide-react';
import { AARAMBHA_HOTLINE_PHONE } from '@/utils/whatsapp';

export default function MobileActionDock() {
  const pathname = usePathname();

  const isTours = pathname.startsWith('/tours');
  const isRentals = pathname.startsWith('/rentals');

  const whatsappMsg = isTours
    ? 'Hello Aarambha Tours, I would like to inquire about upcoming Yatra departure packages.'
    : 'Hello Aarambha Rentals, I would like to check vehicle availability and rates.';

  const whatsappUrl = `https://wa.me/${AARAMBHA_HOTLINE_PHONE}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 sm:hidden bg-[#10121D]/95 backdrop-blur-2xl border-t border-white/10 px-4 py-2.5 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        
        {/* Call Hotline */}
        <a
          href={`tel:+${AARAMBHA_HOTLINE_PHONE}`}
          className="flex-1 py-2 px-2 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center text-gray-300 hover:text-white transition-colors"
        >
          <Phone className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-bold mt-0.5">Call</span>
        </a>

        {/* WhatsApp Inquiry */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 px-2 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 flex flex-col items-center justify-center text-center text-[#25D366] font-bold transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-[10px] font-bold mt-0.5">WhatsApp</span>
        </a>

        {/* Quick Portal Switcher / Action */}
        <Link
          href={isTours ? "/rentals" : "/tours"}
          className={`flex-[1.4] py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black transition-all shadow-lg ${
            isTours
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-amber-500/30'
          }`}
        >
          {isTours ? (
            <>
              <Car className="w-3.5 h-3.5" />
              <span>Rentals Hub</span>
            </>
          ) : (
            <>
              <Compass className="w-3.5 h-3.5" />
              <span>Tours & Yatras</span>
            </>
          )}
        </Link>

      </div>
    </div>
  );
}
