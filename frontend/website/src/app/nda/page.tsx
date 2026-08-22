'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Download, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

export default function NDAPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-[#5266EB] selection:text-white">
      <Navbar vertical="home" />

      {/* ─── 1. HERO HEADER ───────────────────────────────────────── */}
      <section className="relative bg-[#171721] text-[#EDEDF3] py-16 overflow-hidden border-b border-[#272735]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9CB4E8] hover:text-white font-syne transition-colors bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="px-3 py-1 rounded-full bg-[#5266EB]/20 text-[#9CB4E8] text-xs font-bold font-syne border border-[#5266EB]/30 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#5266EB]" />
              LEGAL & CONFIDENTIALITY
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-gray-300">
              Document Ref: AT/LEGAL/NDA-2026
            </span>
          </div>

          <h1 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Website Non-Disclosure Agreement (NDA)
          </h1>

          <p className="text-xs sm:text-sm text-[#AFB2CE] max-w-2xl leading-relaxed font-normal">
            Official bilateral proprietary information and confidentiality agreement between आरंभ (Aarambha Tours & Car Rentals) and authorized partners, vendors, or service providers.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="/documents/Website-Non-Disclosure-Agreement.doc"
              download="Website-Non-Disclosure-Agreement.doc"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] text-xs font-bold transition-all shadow-lg shadow-[#5266EB]/20 hover:scale-102"
            >
              <Download className="w-4 h-4" /> Download Official .DOC Agreement
            </a>
          </div>
        </div>
      </section>

      {/* ─── 2. MAIN DOCUMENT CONTENT ─────────────────────────────── */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 lg:px-12 py-12">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm space-y-8 text-xs sm:text-sm leading-relaxed text-gray-700">
          
          {/* Title Header */}
          <div className="border-b border-gray-200 pb-6 text-center space-y-2">
            <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#000000]">
              WEBSITE NON-DISCLOSURE AGREEMENT
            </h2>
            <p className="text-xs text-gray-500 font-mono">
              Governed by the Laws of India & the Arbitration and Conciliation Act, 1996
            </p>
          </div>

          {/* Preamble */}
          <div className="space-y-3 bg-[#FAFAFC] p-5 rounded-2xl border border-gray-200">
            <p>
              This Agreement is made at Pune / Mumbai on this <strong>19th day of August, 2026</strong>,
            </p>
            <p>
              <strong>BY AND BETWEEN:</strong><br />
              <strong className="text-[#000000]">आरंभ TOURS & CAR RENTALS</strong>, a registered enterprise having its office at Green Hills Society, Katraj, Pune - 411046 (hereinafter referred to as the <em>“Website”</em> or <em>“Company”</em>),
            </p>
            <p>
              <strong>AND:</strong><br />
              The registered company / individual vendor having its registered office / residence as specified in the work order (hereinafter referred to as the <em>“Vendor”</em>).
            </p>
            <p className="text-xs text-gray-500 italic">
              Both Website and Vendor are together referred to as the <strong>“Parties”</strong> and individually as a <strong>“Party”</strong>.
            </p>
          </div>

          {/* Recitals */}
          <div className="space-y-2">
            <h3 className="font-syne text-base font-bold text-[#000000]">Recitals & Background</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>WHEREAS, the Parties acknowledge that in order to evaluate and execute a business and operational relationship, it is necessary to exchange and release confidential, technical, and proprietary information.</li>
              <li>AND WHEREAS, the Party of the First Part (the “Website”) is the owner of the platform and digital travel booking infrastructure, and engages the Party of the Second Part (the “Vendor”) for providing services in respect thereof.</li>
            </ul>
          </div>

          {/* Key Clauses Accordion / Box Grid */}
          <div className="space-y-6 pt-2">
            
            {/* Clause 1 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">1</span>
                Definition of Confidential Information
              </h3>
              <p className="text-gray-600 pl-8">
                “Confidential Information” shall mean any invention, product, process, apparatus or design of either party or any knowledge or information with respect thereto or any other trade knowledge of either party (including without limitation business methods, booking database schemas, vehicle GPS integrations, fleet pricing logic, customer/supplier records, and short-term and long-range sales and product plans), and all drawings, disclosures, designs, data, reports, calculations, models, component parts, patent applications or the like relating in any way to the business of either party, conspicuously identified by the disclosing party as “Confidential”.
              </p>
            </div>

            {/* Clause 2 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">2</span>
                Standard of Protective Care
              </h3>
              <p className="text-gray-600 pl-8">
                Each party agrees to hold all Confidential Information of the other in the strictest confidence, utilizing the same degree of protective care that normally prudent business associates would use to protect the confidence of their own proprietary data. Neither party shall directly or indirectly reveal, publish, or disclose Confidential Information to any unauthorized third party without prior express written consent.
              </p>
            </div>

            {/* Clause 3 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">3</span>
                No Transfer of Intellectual Property
              </h3>
              <p className="text-gray-600 pl-8">
                Neither party’s disclosure of Confidential Information shall be construed by implication or otherwise to convey any rights under patents, trade secrets, trademarks, or any other proprietary rights of the disclosing party or to grant any license relating thereto.
              </p>
            </div>

            {/* Clause 4 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">4</span>
                Exclusions from Confidentiality
              </h3>
              <p className="text-gray-600 pl-8">
                Non-disclosure provisions shall not apply to information that is: (a) in the public domain; (b) disclosed with prior written approval; (c) previously and independently developed by the receiving party with reasonable written proof; or (d) rightfully received from a third party without an obligation of confidentiality.
              </p>
            </div>

            {/* Clause 5 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">5</span>
                Term & Duration (5-Year Validity)
              </h3>
              <p className="text-gray-600 pl-8">
                This Agreement shall remain in full force and effect for a period of <strong>five (5) years</strong> following the date hereof. Upon termination or written request, each party shall immediately return or securely destroy all confidential materials.
              </p>
            </div>

            {/* Clause 6 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">6</span>
                Governing Law & Fast-Track Arbitration
              </h3>
              <p className="text-gray-600 pl-8">
                This Agreement shall be governed by the laws of India. The courts in Mumbai / Pune have exclusive jurisdiction. Any dispute shall be resolved by a sole arbitrator under the fast-track procedure of <strong>Section 29B of the Arbitration and Conciliation Act, 1996</strong>, with proceedings conducted in English.
              </p>
            </div>

          </div>

          {/* Signatures Representation Box */}
          <div className="border-t border-gray-200 pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAFAFC] p-6 rounded-2xl border border-gray-200">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-syne">FOR THE WEBSITE (DISCLOSING PARTY)</span>
                <p className="font-bold text-gray-900">आरंभ Tours & Car Rentals</p>
                <div className="pt-4 border-b border-gray-300 w-3/4"></div>
                <p className="text-[11px] text-gray-500">Authorized Signatory & Seal</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-syne">FOR THE VENDOR (RECEIVING PARTY)</span>
                <p className="font-bold text-gray-900">Authorized Vendor / Partner</p>
                <div className="pt-4 border-b border-gray-300 w-3/4"></div>
                <p className="text-[11px] text-gray-500">Authorized Signatory & Seal</p>
              </div>
            </div>
          </div>

          {/* Download & Print CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              To execute a signed physical copy of this agreement, please download the Word format document.
            </p>

            <a
              href="/documents/Website-Non-Disclosure-Agreement.doc"
              download="Website-Non-Disclosure-Agreement.doc"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#171721] hover:bg-[#272735] text-[#EDEDF3] text-xs font-bold transition-all shadow-md shrink-0"
            >
              <Download className="w-4 h-4" /> Download .DOC File
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
