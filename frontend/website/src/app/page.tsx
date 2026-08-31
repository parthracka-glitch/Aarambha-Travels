'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { CreditCard } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import InteractiveSplitGateway from '@/components/home/InteractiveSplitGateway';
import CompanyLocationSection from '@/components/home/CompanyLocationSection';
import FAQSection from '@/components/home/FAQSection';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';

const PaymentProofModal = dynamic(() => import('@/components/booking/PaymentProofModal'), {
  ssr: false,
});

export default function RootGatewayPage() {
  const [paymentProofOpen, setPaymentProofOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0B10] text-white flex flex-col font-sans selection:bg-[#FF3B30] selection:text-white">
      <Navbar vertical="home" />

      {/* ─── 1. INTERACTIVE FULL-SCREEN DUAL GATEWAY ───────────────── */}
      <InteractiveSplitGateway />

      {/* ─── 2. QUICK PAYMENT PROOF ACTION BANNER ──────────────────── */}
      <section className="bg-gradient-to-r from-[#141624] via-[#1B1E30] to-[#141624] border-y border-white/10 py-6 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <h3 className="font-syne text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Already paid an advance via UPI / Bank Transfer?</span>
            </h3>
            <p className="text-xs text-gray-400">
              Submit your UTR / transaction reference number directly for instant WhatsApp verification.
            </p>
          </div>

          <button
            onClick={() => setPaymentProofOpen(true)}
            className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors shadow-lg shadow-emerald-500/20 shrink-0"
          >
            Submit UTR Proof
          </button>
        </div>
      </section>

      {/* ─── 3. OFFICE / FLEET HUB LOCATION SECTION ────────────────── */}
      <CompanyLocationSection />

      {/* ─── 4. FAQ & LEGAL ────────────────────────────────────────── */}
      <FAQSection />
      <TermsConditionsSection />

      {/* ─── 5. PAYMENT PROOF MODAL ────────────────────────────────── */}
      <PaymentProofModal
        isOpen={paymentProofOpen}
        onClose={() => setPaymentProofOpen(false)}
      />

      <Footer />
    </div>
  );
}
