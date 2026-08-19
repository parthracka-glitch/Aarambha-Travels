'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-[#FF3B30] selection:text-white">
      
      <Navbar vertical="home" />

      {/* ─── 1. HEADER BANNER ───────────────────────────────────────── */}
      <section className="pt-8 pb-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-4 text-center">
          
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider font-syne">
            LEGAL / POLICIES
          </div>

          <h1 className="font-syne text-3xl sm:text-5xl font-extrabold text-[#111111] tracking-tight">
            Terms & Conditions Policy
          </h1>

          <p className="text-xs text-gray-500 max-w-xl mx-auto leading-relaxed">
            Review the official rental agreements, tour package rules, deposit policies, and customer code of conduct for Aarambha Tours & Car Rentals.
          </p>

        </div>
      </section>

      {/* ─── 2. INTEGRATED TERMS & CONDITIONS SECTION ───────────────── */}
      <TermsConditionsSection mode="all" />

      <Footer />

    </div>
  );
}
