'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Scale,
  Shield,
  RotateCcw,
  Lock,
  Cookie,
  AlertTriangle,
  FileText,
  CheckCircle2,
  ChevronRight,
  Printer,
  Compass,
  Car,
  Bus,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ConsolidatedLegalCenterPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'refund' | 'compliance'>('terms');

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#493B34] flex flex-col font-sans select-none">
      {/* Navbar */}
      <Navbar vertical="home" />

      {/* ─────────────────────────────────────────────────────────────
          1. HERO: CONSOLIDATED LEGAL & POLICY FRAMEWORK
          ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-14 lg:pt-32 lg:pb-16 bg-[#2D1F18] text-white overflow-hidden border-b border-[#EDE2D0]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C65A2E]/20 border border-[#C65A2E]/40 text-[#E8B9A5] text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-[#C65A2E]" />
            <span>Legal, Policies &amp; Compliance Framework</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-3xl">
            Terms, Policies &amp; <br />
            <span className="text-[#E8B9A5]">Legal Compliance</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#EDE2D0]/90 max-w-2xl leading-relaxed">
            Consolidated terms, conditions, privacy protections, refund timelines, and compliance disclosures governing all tours, self-drive rentals, and bus bookings with आरंभ.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. CONSOLIDATED TABBED LEGAL CENTER
          ───────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white border-b border-[#EDE2D0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
          
          {/* Tabs Navigation */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#EDE2D0] pb-4">
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-[#493B34] text-white shadow-2xs'
                  : 'bg-[#FCFAF6] text-[#756B63] border border-[#EDE2D0] hover:border-[#C65A2E]'
              }`}
            >
              <FileText className="w-4 h-4 text-[#C65A2E]" />
              <span>1. Terms &amp; Conditions &amp; Rental Policies</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-[#493B34] text-white shadow-2xs'
                  : 'bg-[#FCFAF6] text-[#756B63] border border-[#EDE2D0] hover:border-[#C65A2E]'
              }`}
            >
              <Shield className="w-4 h-4 text-[#C65A2E]" />
              <span>2. Privacy Policy &amp; Cookies</span>
            </button>

            <button
              onClick={() => setActiveTab('refund')}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'refund'
                  ? 'bg-[#493B34] text-white shadow-2xs'
                  : 'bg-[#FCFAF6] text-[#756B63] border border-[#EDE2D0] hover:border-[#C65A2E]'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-emerald-600" />
              <span>3. Refund &amp; Cancellation Policy</span>
            </button>

            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'compliance'
                  ? 'bg-[#493B34] text-white shadow-2xs'
                  : 'bg-[#FCFAF6] text-[#756B63] border border-[#EDE2D0] hover:border-[#C65A2E]'
              }`}
            >
              <Lock className="w-4 h-4 text-[#D8B77A]" />
              <span>4. Security, Compliance &amp; NDA</span>
            </button>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              TAB 1: TERMS & CONDITIONS & RENTAL POLICIES
              ───────────────────────────────────────────────────────────── */}
          {activeTab === 'terms' && (
            <div className="space-y-8 max-w-4xl text-xs sm:text-sm text-[#756B63] leading-relaxed">
              
              <div className="space-y-3 pb-6 border-b border-[#EDE2D0]/50">
                <h2 className="font-serif text-2xl font-bold text-[#493B34]">1. Standard Terms of Use &amp; Agreement</h2>
                <p>
                  By accessing the website (<strong>aarambhatravels.in</strong>) or booking any tour package, self-drive vehicle, or bus rental from <strong>आरंभ (Aarambha) Tours &amp; Travels</strong>, you agree to be bound by these unified terms and conditions.
                </p>
              </div>

              <div className="space-y-3 pb-6 border-b border-[#EDE2D0]/50">
                <h3 className="font-serif text-lg font-bold text-[#493B34] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#C65A2E]" /> Tour Packages &amp; Pilgrimage Booking Rules
                </h3>
                <ul className="space-y-2 list-disc list-inside text-[#756B63]">
                  <li><strong>Advance Booking Deposit:</strong> All tour package seats are reserved upon receipt of a minimum advance deposit of ₹500 per passenger. Remaining balance must be cleared prior to boarding.</li>
                  <li><strong>Itinerary Adherence:</strong> Temple darshan timings are subject to temple trust rules, local administrative orders, and crowd controls. The tour leader reserves the right to re-sequence stops for safety.</li>
                  <li><strong>Hotel Check-in &amp; Meals:</strong> Standard check-in time is 12:00 PM. Twin or triple sharing rooms in verified 3-star AC hotels are provided as per booked package. Satvik pure vegetarian meals are provided on tour days.</li>
                  <li><strong>Luggage:</strong> Devotees are permitted one medium suitcase/trolley (up to 15 kg) and one handbag per person.</li>
                </ul>
              </div>

              <div className="space-y-3 pb-6 border-b border-[#EDE2D0]/50">
                <h3 className="font-serif text-lg font-bold text-[#493B34] flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#C65A2E]" /> Self-Drive Car Rental Policies
                </h3>
                <ul className="space-y-2 list-disc list-inside text-[#756B63]">
                  <li><strong>Eligibility &amp; KYC:</strong> The driver must be at least 21 years old and hold a valid Indian or International driving license (at least 1 year old) along with original Aadhaar Card.</li>
                  <li><strong>Speed Limits &amp; Safety:</strong> Commercial speed governor limits (80 km/h on highways / 100 km/h on expressways) apply. Reckless driving, off-roading (unless in 4x4 Thar on designated trails), or racing is strictly prohibited.</li>
                  <li><strong>Zero Deposit Option:</strong> Available to verified local Pune residents and pre-approved travelers. Any minor accidental damages below ₹5,000 are subject to insurance deductibles.</li>
                  <li><strong>Fuel &amp; FASTag:</strong> Vehicles are delivered with sufficient fuel to reach the next pump and must be returned at the same level. FASTag toll charges incurred during rental are settled on return.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-lg font-bold text-[#493B34] flex items-center gap-2">
                  <Bus className="w-4 h-4 text-[#C65A2E]" /> Bus &amp; Force Urbania Rental Terms
                </h3>
                <ul className="space-y-2 list-disc list-inside text-[#756B63]">
                  <li><strong>Local Packages (8h/80km):</strong> Service commences from the garage dispatch time and concludes upon garage return. Extra hours and extra kilometers are calculated per agreed rate sheet.</li>
                  <li><strong>Outstation Trips:</strong> Billed at a minimum of 300 KM per calendar day. Driver DA (₹400/day), toll taxes, interstate border taxes, and parking fees are borne by the customer as per actual receipts.</li>
                  <li><strong>Prohibited Activities:</strong> Smoking, alcohol consumption, or carrying hazardous/illegal substances in commercial passenger vehicles is strictly prohibited under Maharashtra Transport Laws.</li>
                </ul>
              </div>

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 2: PRIVACY POLICY & COOKIES
              ───────────────────────────────────────────────────────────── */}
          {activeTab === 'privacy' && (
            <div className="space-y-8 max-w-4xl text-xs sm:text-sm text-[#756B63] leading-relaxed">
              
              <div className="space-y-3 pb-6 border-b border-[#EDE2D0]/50">
                <h2 className="font-serif text-2xl font-bold text-[#493B34]">2. Privacy Policy &amp; Cookie Preferences</h2>
                <p>
                  We are committed to safeguarding your personal data under the <strong>Information Technology Act, 2000</strong> and the <strong>Digital Personal Data Protection (DPDP) Act</strong> of India.
                </p>
              </div>

              <div className="space-y-3 pb-6 border-b border-[#EDE2D0]/50">
                <h3 className="font-serif text-lg font-bold text-[#493B34]">Information We Collect</h3>
                <ul className="space-y-2 list-disc list-inside text-[#756B63]">
                  <li><strong>Contact Details:</strong> Name, phone number, email address for booking confirmations and invoices.</li>
                  <li><strong>KYC Documents:</strong> Driving license and Aadhaar numbers for self-drive car dispatch (stored encrypted and deleted post-retention cycle).</li>
                  <li><strong>Payment Identifiers:</strong> Razorpay Order IDs, UPI Transaction UTR numbers, and payment verification receipts. We do NOT store card CVVs or net banking passwords.</li>
                </ul>
              </div>

              <div className="space-y-3 pb-6 border-b border-[#EDE2D0]/50">
                <h3 className="font-serif text-lg font-bold text-[#493B34]">How We Use Your Data</h3>
                <ul className="space-y-2 list-disc list-inside text-[#756B63]">
                  <li>To process reservations, issue verified GST tax invoices, and assign tour captains or delivery drivers.</li>
                  <li>To provide 24/7 roadside assistance and instant customer support over WhatsApp and phone.</li>
                  <li>We never sell, rent, or trade your personal information to third-party marketing companies.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-lg font-bold text-[#493B34]">Cookie Preferences &amp; Storage</h3>
                <p className="text-[#756B63]">
                  We use essential session cookies to remember your active bookings, authentication tokens, and filter preferences. You can adjust your browser preferences anytime to restrict non-essential performance cookies.
                </p>
              </div>

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 3: REFUND & CANCELLATION POLICY
              ───────────────────────────────────────────────────────────── */}
          {activeTab === 'refund' && (
            <div className="space-y-8 max-w-4xl text-xs sm:text-sm text-[#756B63] leading-relaxed">
              
              <div className="space-y-3 pb-6 border-b border-[#EDE2D0]/50">
                <h2 className="font-serif text-2xl font-bold text-[#493B34]">3. 100% Transparent Refund &amp; Cancellation Policy</h2>
                <p>
                  We understand that travel plans can change unexpectedly. We provide one of the most flexible and fair refund policies in Maharashtra.
                </p>
              </div>

              <div className="space-y-3 pb-6 border-b border-[#EDE2D0]/50">
                <h3 className="font-serif text-lg font-bold text-[#493B34]">Tour Package Cancellation Timelines</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-[#EDE2D0] rounded-xl overflow-hidden">
                    <thead className="bg-[#FCFAF6] text-[#493B34] font-serif font-bold uppercase">
                      <tr className="border-b border-[#EDE2D0]">
                        <th className="p-3.5">Cancellation Notice</th>
                        <th className="p-3.5">Refund Percentage</th>
                        <th className="p-3.5">Alternative Option</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE2D0]/50 font-medium text-[#756B63]">
                      <tr>
                        <td className="p-3.5 font-bold text-[#493B34]">7+ Days before Departure</td>
                        <td className="p-3.5 text-emerald-600 font-bold">100% Full Refund</td>
                        <td className="p-3.5">Free Date Rescheduling</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-[#493B34]">3 to 6 Days before Departure</td>
                        <td className="p-3.5 text-amber-600 font-bold">50% Refund</td>
                        <td className="p-3.5">Credit Voucher for Next Tour</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-[#493B34]">Less than 48 Hours</td>
                        <td className="p-3.5 text-[#C65A2E] font-bold">Deposit Forfeited</td>
                        <td className="p-3.5">Passenger Substitution Allowed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-3 pb-6 border-b border-[#EDE2D0]/50">
                <h3 className="font-serif text-lg font-bold text-[#493B34]">Self-Drive Car &amp; Bus Rental Refunds</h3>
                <ul className="space-y-2 list-disc list-inside text-[#756B63]">
                  <li><strong>Security Deposit Refund:</strong> If collected, security deposits are refunded within 24 to 48 hours post-vehicle inspection and FASTag toll clearance.</li>
                  <li><strong>Early Return:</strong> No partial refund is issued for vehicle returns made earlier than the booked drop-off schedule.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-lg font-bold text-[#493B34]">Force Majeure (Natural Disasters, Road Closures)</h3>
                <p className="text-[#756B63]">
                  In case of unexpected severe weather, temple shutdowns by government authority, or road blockages, bookings are eligible for 100% full rescheduling to future dates without any penalty fees.
                </p>
              </div>

            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 4: SECURITY, COMPLIANCE & NDA
              ───────────────────────────────────────────────────────────── */}
          {activeTab === 'compliance' && (
            <div className="space-y-8 max-w-4xl text-xs sm:text-sm text-[#756B63] leading-relaxed">
              
              <div className="space-y-3 pb-6 border-b border-[#EDE2D0]/50">
                <h2 className="font-serif text-2xl font-bold text-[#493B34]">4. Security, Compliance, Disclaimer &amp; NDA</h2>
                <p>
                  Our legal framework complies with commercial motor vehicle regulations, digital commerce security standards, and intellectual property protections.
                </p>
              </div>

              <div className="space-y-3 pb-6 border-b border-[#EDE2D0]/50">
                <h3 className="font-serif text-lg font-bold text-[#493B34]">Security &amp; Responsible Disclosure</h3>
                <p className="text-[#756B63]">
                  We employ HTTPS 256-bit SSL encryption, CSRF protection, rate limiting, and automated XSS sanitization across all payment and booking endpoints. If you discover a vulnerability, report it to <code>security@aarambhatravels.in</code> for coordinated disclosure.
                </p>
              </div>

              <div className="space-y-3 pb-6 border-b border-[#EDE2D0]/50">
                <h3 className="font-serif text-lg font-bold text-[#493B34]">Non-Disclosure &amp; Confidentiality (NDA)</h3>
                <p className="text-[#756B63]">
                  All corporate transport contracts, passenger rosters, VIP itineraries, and internal CRM pricing agreements are strictly confidential and protected against unauthorized disclosure under our master non-disclosure terms.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-lg font-bold text-[#493B34]">Legal Disclaimer &amp; Jurisdiction</h3>
                <p className="text-[#756B63]">
                  All services rendered by आरंभ (Aarambha) Tours &amp; Travels are subject to the exclusive jurisdiction of the competent courts in <strong>Pune, Maharashtra, India</strong>.
                </p>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
