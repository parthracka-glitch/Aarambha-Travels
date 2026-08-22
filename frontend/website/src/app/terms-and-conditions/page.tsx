'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Download, ArrowLeft, ShieldCheck, FileText, Scale } from 'lucide-react';
import Link from 'next/link';

export default function StandardTermsPage() {
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
              <FileText className="w-3.5 h-3.5 text-[#5266EB]" />
              STANDARD PLATFORM TERMS
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-gray-300">
              Document Ref: AT/LEGAL/TERMS-2026
            </span>
          </div>

          <h1 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Website Standard Terms & Conditions
          </h1>

          <p className="text-xs sm:text-sm text-[#AFB2CE] max-w-2xl leading-relaxed font-normal">
            These terms govern your use of the आरंभ website, digital booking systems, and services. By accessing or using this website, you accept these terms in full.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="/documents/Website-Standard-Terms-And-Conditions.docx"
              download="Website-Standard-Terms-And-Conditions.docx"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] text-xs font-bold transition-all shadow-lg shadow-[#5266EB]/20 hover:scale-102"
            >
              <Download className="w-4 h-4" /> Download Official .DOCX Document
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
              WEBSITE STANDARD TERMS AND CONDITIONS
            </h2>
            <p className="text-xs text-gray-500 font-mono">
              Effective Date: August 19, 2026 | Applicable to all Users & Visitors
            </p>
          </div>

          {/* Clauses List */}
          <div className="space-y-6">
            
            {/* Clause 1 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">1</span>
                Introduction
              </h3>
              <p className="text-gray-600 pl-8">
                These Website Standard Terms And Conditions contained herein on this webpage shall govern your use of this website, including all pages within this website (collectively referred to herein below as this “Website”). These Terms apply in full force and effect to your use of this Website and by using this Website, you expressly accept all terms and conditions contained herein in full. You must not use this Website if you have any objection to any of these Website Standard Terms And Conditions.
              </p>
              <p className="text-gray-600 pl-8 font-medium">
                This Website is not for use by any minors (defined as those who are not at least 18 years of age), and you must not use this Website if you are a minor.
              </p>
            </div>

            {/* Clause 2 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">2</span>
                Intellectual Property Rights
              </h3>
              <p className="text-gray-600 pl-8">
                Other than content you own, which you may have opted to include on this Website, under these Terms, <strong>आरंभ Tours & Car Rentals</strong> and/or its licensors own all rights to the intellectual property and material contained in this Website, and all such rights are reserved. You are granted a limited license only, subject to the restrictions provided in these Terms, for purposes of viewing the material contained on this Website.
              </p>
            </div>

            {/* Clause 3 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">3</span>
                Restrictions
              </h3>
              <div className="text-gray-600 pl-8 space-y-1.5">
                <p>You are expressly and emphatically restricted from all of the following:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Publishing any Website material in any media without written permission;</li>
                  <li>Selling, sublicensing and/or otherwise commercializing any Website material;</li>
                  <li>Publicly performing and/or showing any Website material;</li>
                  <li>Using this Website in any way that is, or may be, damaging to this Website;</li>
                  <li>Using this Website in any way that impacts user access to this Website;</li>
                  <li>Using this Website contrary to applicable laws and regulations, or in a way that causes harm to the Website or any person;</li>
                  <li>Engaging in any data mining, data harvesting, data extracting or any other similar activity;</li>
                  <li>Using this Website to engage in unauthorized advertising or marketing.</li>
                </ul>
              </div>
            </div>

            {/* Clause 4 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">4</span>
                Your Content
              </h3>
              <p className="text-gray-600 pl-8">
                In these Website Standard Terms And Conditions, “Your Content” shall mean any audio, video, text, images or other material you choose to display on this Website. With respect to Your Content, by displaying it, you grant <strong>आरंभ Tours & Car Rentals</strong> a non-exclusive, worldwide, irrevocable, royalty-free, sublicensable license to use, reproduce, adapt, publish, translate and distribute it in any media. Your Content must be your own and not infringe any third party’s rights.
              </p>
            </div>

            {/* Clause 5 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">5</span>
                No Warranties
              </h3>
              <p className="text-gray-600 pl-8">
                This Website is provided “as is,” with all faults, and <strong>आरंभ Tours & Car Rentals</strong> makes no express or implied representations or warranties of any kind related to this Website or the materials contained on this Website. Nothing contained on this Website shall be construed as providing legal or financial consult to you.
              </p>
            </div>

            {/* Clause 6 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">6</span>
                Limitation of Liability
              </h3>
              <p className="text-gray-600 pl-8">
                In no event shall <strong>आरंभ Tours & Car Rentals</strong>, nor any of its officers, directors, and employees, be liable to you for anything arising out of or in any way connected with your use of this Website, whether such liability is under contract, tort or otherwise.
              </p>
            </div>

            {/* Clause 7 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">7</span>
                Indemnification
              </h3>
              <p className="text-gray-600 pl-8">
                You hereby indemnify to the fullest extent <strong>आरंभ Tours & Car Rentals</strong> from and against any and all liabilities, costs, demands, causes of action, damages and expenses (including reasonable attorney’s fees) arising out of or in any way related to your breach of any provisions of these Terms.
              </p>
            </div>

            {/* Clause 8 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">8</span>
                Severability
              </h3>
              <p className="text-gray-600 pl-8">
                If any provision of these Terms is found to be unenforceable or invalid under any applicable law, such unenforceability or invalidity shall not render these Terms unenforceable or invalid as a whole, and such provisions shall be deleted without affecting the remaining provisions herein.
              </p>
            </div>

            {/* Clause 9 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">9</span>
                Variation of Terms
              </h3>
              <p className="text-gray-600 pl-8">
                <strong>आरंभ Tours & Car Rentals</strong> is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review such Terms on a regular basis to ensure you understand all terms and conditions governing use of this Website.
              </p>
            </div>

            {/* Clause 10 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">10</span>
                Assignment
              </h3>
              <p className="text-gray-600 pl-8">
                <strong>आरंभ Tours & Car Rentals</strong> shall be permitted to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification or consent required. You shall not be permitted to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.
              </p>
            </div>

            {/* Clause 11 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">11</span>
                Entire Agreement
              </h3>
              <p className="text-gray-600 pl-8">
                These Terms, including any legal notices and disclaimers contained on this Website, constitute the entire agreement between <strong>आरंभ Tours & Car Rentals</strong> and you in relation to your use of this Website, and supersede all prior agreements and understandings with respect to the same.
              </p>
            </div>

            {/* Clause 12 */}
            <div className="space-y-2">
              <h3 className="font-syne text-sm font-bold text-[#000000] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#5266EB]/10 text-[#5266EB] font-bold text-xs flex items-center justify-center font-syne">12</span>
                Governing Law & Jurisdiction
              </h3>
              <p className="text-gray-600 pl-8">
                These Terms will be governed by and construed in accordance with the laws of India, and you submit to the jurisdiction of the state and federal courts located in Pune / Mumbai, Maharashtra for the resolution of any disputes.
              </p>
            </div>

          </div>

          {/* Download CTA Box */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need an offline copy? Download the official Microsoft Word format document.
            </p>

            <a
              href="/documents/Website-Standard-Terms-And-Conditions.docx"
              download="Website-Standard-Terms-And-Conditions.docx"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#171721] hover:bg-[#272735] text-[#EDEDF3] text-xs font-bold transition-all shadow-md shrink-0"
            >
              <Download className="w-4 h-4" /> Download .DOCX File
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
