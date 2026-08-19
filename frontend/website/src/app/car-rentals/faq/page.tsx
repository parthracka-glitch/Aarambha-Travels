'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FAQSection from '@/components/home/FAQSection';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-[#FF3B30] selection:text-white">
      
      <Navbar vertical="fleet" />

      {/* ─── 1. BREADCRUMB & HEADER BANNER ─────────────────────────── */}
      <section className="pt-8 pb-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-4 text-center">
          
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-syne">
            HOME/FAQS
          </div>

          <h1 className="font-syne text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight">
            Frequently Asked Questions
          </h1>

          <div className="relative w-full h-[220px] sm:h-[300px] rounded-2xl overflow-hidden bg-[#111111]">
            <img
              src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1600&auto=format&fit=crop"
              alt="Car Dashboard Interior Header"
              className="w-full h-full object-cover opacity-85"
            />
          </div>

        </div>
      </section>

      {/* ─── 2. CATEGORIZED ACCORDION FAQ SECTION ──────────────────── */}
      <FAQSection mode="cars" />

      {/* ─── 3. STILL HAVE QUESTIONS? BANNER ──────────────────────── */}
      <section className="py-10 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="relative rounded-2xl bg-[#FFEFEF] p-8 sm:p-12 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 border border-red-200">
            
            <div className="space-y-3 text-center lg:text-left z-10">
              <h2 className="font-syne text-2xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
                Still Have<br />Questions?
              </h2>
              <span className="text-xs font-bold text-[#111111] tracking-wider block font-syne uppercase">
                CONTACT US FOR ASSISTANCE
              </span>
              <div className="pt-1">
                <Link
                  href="/car-rentals/contact"
                  className="btn-red-pill text-xs font-semibold px-6 py-2.5 rounded-full bg-[#FF3B30] text-white hover:bg-[#E03126] transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/2 aspect-[16/9] relative flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000&auto=format&fit=crop"
                alt="Still Have Questions Car"
                className="w-full h-full object-contain"
              />
            </div>

          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
