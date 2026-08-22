'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FAQSection from '@/components/home/FAQSection';

export default function BusRentalFAQPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-[#5266EB] selection:text-white">
      
      <Navbar vertical="fleet" />

      {/* BREADCRUMB & HEADER BANNER */}
      <section className="pt-8 pb-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-4 text-center">
          
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-syne">
            HOME / BUS RENTALS / FAQS
          </div>

          <h1 className="font-syne text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight">
            Bus Rental Frequently Asked Questions
          </h1>

          <div className="relative w-full h-[200px] sm:h-[280px] rounded-2xl overflow-hidden bg-[#111111]">
            <img
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1600&auto=format&fit=crop"
              alt="Luxury Bus Fleet Rental"
              className="w-full h-full object-cover opacity-85"
            />
          </div>

        </div>
      </section>

      {/* BUS RENTALS FAQ SECTION */}
      <FAQSection mode="buses" />

      {/* NEED ASSISTANCE */}
      <section className="py-10 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="relative rounded-3xl bg-blue-50 p-8 sm:p-12 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 border border-blue-100 shadow-sm">
            
            <div className="space-y-3 text-center lg:text-left z-10">
              <h2 className="font-syne text-2xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
                Need Help Booking<br />A Bus or Force Urbania?
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Our bus rental specialists are available 24/7 to assist with customized outstation itineraries.
              </p>
              <div className="pt-2">
                <Link
                  href="/bus-rentals/contact"
                  className="text-xs font-bold px-6 py-3 rounded-full bg-[#5266EB] text-white hover:bg-[#3E51D4] transition-all shadow-md inline-block"
                >
                  Contact Bus Rental Support
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
