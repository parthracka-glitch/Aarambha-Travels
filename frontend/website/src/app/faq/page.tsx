'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Car,
  Bus,
  CreditCard,
  ShieldCheck,
  ChevronDown,
  Phone,
  MessageCircle,
  HelpCircle,
  Sparkles,
  MapPin,
  Users,
  Award,
  ArrowRight,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CompanyLocationSection from '@/components/home/CompanyLocationSection';

interface FAQItem {
  q: string;
  a: string;
  category: 'all' | 'tours' | 'cars' | 'buses' | 'payments';
}

const FAQ_DATA: FAQItem[] = [
  // ─── TOURS FAQS ───
  {
    category: 'tours',
    q: 'What is included in the pilgrimage tour packages?',
    a: 'All our tour packages are all-inclusive. They include sanitized AC pushback transport, pre-verified 3-star AC hotel accommodations (twin/triple sharing), pure satvik meals (breakfast, lunch, and dinner), toll/parking taxes, and experienced tour captains who assist with temple darshan.',
  },
  {
    category: 'tours',
    q: 'Are these tours suitable for senior citizens and families?',
    a: 'Yes, absolutely. We prioritize comfortable pacing, ground-floor or elevator hotel rooms, dedicated porter/darshan assistance, and pure satvik vegetarian meals specifically curated for elders and devotional families.',
  },
  {
    category: 'tours',
    q: 'How does the ₹500 advance deposit work for tours?',
    a: 'You can lock your seats for any upcoming tour departure with a nominal deposit of ₹500 per person. The remaining balance is payable prior to boarding or during the journey.',
  },
  {
    category: 'tours',
    q: 'What is your cancellation policy for tour packages?',
    a: 'Cancellations made 7+ days before departure receive a 100% full refund of the deposit. Cancellations made 3-6 days before receive a 50% refund or free date rescheduling.',
  },

  // ─── CARS FAQS ───
  {
    category: 'cars',
    q: 'What documents are required to rent a self-drive car in Pune?',
    a: 'You need an Original Valid Driving License (minimum 1 year old) and Aadhaar Card / Voter ID for KYC verification. No cumbersome paperwork is required.',
  },
  {
    category: 'cars',
    q: 'Is there really zero security deposit for self-drive cars?',
    a: 'Yes! For verified local residents and travelers with valid KYC, we offer zero security deposit rentals on selected hatchbacks and SUVs.',
  },
  {
    category: 'cars',
    q: 'Do you provide doorstep delivery in Pune?',
    a: 'Yes, we deliver self-drive cars across Pune, including Katraj, Baner, Kothrud, Hinjawadi, Pune Railway Station, and Pune International Airport (PNQ) within 45 minutes.',
  },
  {
    category: 'cars',
    q: 'What is the fuel and toll policy for self-drive cars?',
    a: 'Cars are provided with sufficient fuel to reach the nearest petrol pump. You return the car with the same fuel level as provided. FASTag toll charges are auto-calculated and settled upon return.',
  },

  // ─── BUSES FAQS ───
  {
    category: 'buses',
    q: 'What seating capacities are available for bus and Urbania rentals?',
    a: 'We offer 13, 17, and 26-seater luxury Force Urbania vans, as well as 32, 45, and 50-seater BharatBenz and Ashok Leyland luxury pushback AC coaches with commercial tourist permits.',
  },
  {
    category: 'buses',
    q: 'How are local 8 Hrs / 80 KM bus packages billed?',
    a: 'Local city packages include 8 continuous hours and up to 80 kilometers from garage departure to garage return. Extra hours and extra kilometers are billed at transparent predetermined flat rates.',
  },
  {
    category: 'buses',
    q: 'Are interstate permits and driver allowances included in outstation trips?',
    a: 'Outstation rates are calculated per kilometer (minimum 300 KM/day). Driver allowance (₹400/day), toll, parking, and state border entry taxes are extra as per actual receipts.',
  },

  // ─── PAYMENTS & REFUNDS FAQS ───
  {
    category: 'payments',
    q: 'What payment methods do you accept?',
    a: 'We accept instant UPI payments (Google Pay, PhonePe, Paytm, BHIM via QR Code), Razorpay online credit/debit cards, NetBanking, and direct bank transfers (NEFT/IMPS).',
  },
  {
    category: 'payments',
    q: 'Will I get an official GST tax invoice for my booking?',
    a: 'Yes! Every booking generated through our portal generates a compliant digital GST invoice accessible instantly from the /invoice page or your My Bookings dashboard.',
  },
];

export default function FAQAboutPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'tours' | 'cars' | 'buses' | 'payments'>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQ_DATA.filter((item) =>
    activeCategory === 'all' ? true : item.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#493B34] flex flex-col font-sans select-none">
      {/* Navbar */}
      <Navbar vertical="home" />

      {/* ─────────────────────────────────────────────────────────────
          1. HERO: ABOUT US & EVERYTHING YOU NEED TO KNOW
          ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 bg-[#FCFAF6] border-b border-[#EDE2D0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#EDE2D0] shadow-2xs text-[#493B34] text-xs font-semibold uppercase tracking-wider">
            <span className="text-sm text-[#C65A2E]">🪷</span>
            <span>About आरंभ &amp; Help Center</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-[#493B34]">
            Everything You <br />
            <span className="text-[#C65A2E] font-serif italic">Need to Know</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#756B63] max-w-2xl leading-relaxed font-normal">
            Learn about आरंभ Tours &amp; Travels, our commitment to transparent travel, and answers to common questions about tour departures, car rentals, and luxury bus hire.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. ABOUT US: OUR STORY & CREDIBILITY METRICS
          ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-16 bg-white border-b border-[#EDE2D0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-[#C65A2E] uppercase tracking-wider block">
                Who We Are
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#493B34] tracking-tight">
                Rooted in Trust, Driven by Devotion &amp; Quality
              </h2>
              <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed">
                Headquartered at <strong>Katraj, Pune</strong>, <strong>आरंभ (Aarambha) Tours &amp; Travels</strong> is Maharashtra’s leading integrated travel and mobility enterprise. We bridge two essential needs: sacred, well-organized spiritual pilgrimage tours for families and modern, reliable self-drive and luxury bus rentals for travelers and corporates.
              </p>
              <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed">
                Whether you are seeking blessings at Mahakaleshwar, embarking on an Ashtavinayak yatra, renting a Force Urbania for a wedding, or driving a Thar to Goa, our mission is simple: <em>transparent pricing, verified safety, and uncompromising comfort.</em>
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-[#EDE2D0] space-y-1.5 shadow-2xs">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#C65A2E] block">5,000+</span>
                <h4 className="text-xs font-bold text-[#493B34]">Happy Pilgrims</h4>
                <p className="text-[11px] text-[#756B63]">Devotees guided on spiritual yatras.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-[#EDE2D0] space-y-1.5 shadow-2xs">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#493B34] block">50+</span>
                <h4 className="text-xs font-bold text-[#493B34]">Luxury Fleet</h4>
                <p className="text-[11px] text-[#756B63]">Cars, Urbania, &amp; AC luxury buses.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-[#EDE2D0] space-y-1.5 shadow-2xs">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-600 block">4.9★</span>
                <h4 className="text-xs font-bold text-[#493B34]">Google Rating</h4>
                <p className="text-[11px] text-[#756B63]">Consistently top-rated service.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FCFAF6] border border-[#EDE2D0] space-y-1.5 shadow-2xs">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-600 block">100%</span>
                <h4 className="text-xs font-bold text-[#493B34]">Refund Policy</h4>
                <p className="text-[11px] text-[#756B63]">Honest, hassle-free cancellations.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CATEGORIZED ACCORDION FAQS
          ───────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-16 bg-[#FCFAF6] border-b border-[#EDE2D0]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#C65A2E] uppercase tracking-wider block">
              Got Questions?
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#493B34] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#756B63]">
              Select a category below to filter questions about your specific travel requirement.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Questions', icon: HelpCircle },
              { id: 'tours', label: 'Tours & Pilgrimages', icon: Compass },
              { id: 'cars', label: 'Self-Drive Cars', icon: Car },
              { id: 'buses', label: 'Bus & Urbania', icon: Bus },
              { id: 'payments', label: 'Payments & Refunds', icon: CreditCard },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  setOpenIndex(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#C65A2E] text-white shadow-xs'
                    : 'bg-white text-[#756B63] border border-[#EDE2D0] hover:border-[#C65A2E] hover:text-[#C65A2E]'
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Accordion Questions List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#EDE2D0] overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#493B34] hover:text-[#C65A2E] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#756B63] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'transform rotate-180 text-[#C65A2E]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[#756B63] leading-relaxed border-t border-[#EDE2D0]/60 bg-[#FCFAF6]/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. LOCATION */}
      <CompanyLocationSection />

      {/* 5. FOOTER */}
      <Footer />
    </div>
  );
}
