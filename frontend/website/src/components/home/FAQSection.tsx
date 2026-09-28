'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, FileText, ShieldCheck, ArrowRight, Car, Bus, Compass } from 'lucide-react';

export type FAQCategory = 'all' | 'cars' | 'buses' | 'tours' | 'legal';

export interface FAQDocumentLink {
  label: string;
  url: string;
  isDownload?: boolean;
  downloadFilename?: string;
  type: 'view' | 'docx' | 'doc';
}

export interface FAQItem {
  id: string;
  category: 'common' | 'cars' | 'buses' | 'tours' | 'legal';
  question: string;
  answer: string;
  documents?: FAQDocumentLink[];
}

const FAQS_DATA: FAQItem[] = [
  // ─── BUS RENTALS & OUTSTATION SPECIFIC FAQS ──────────────────────
  {
    id: 'bus-1',
    category: 'buses',
    question: 'What seating capacities are available for bus rentals and Urbania hire?',
    answer: 'We offer 13, 17, 20, 27, 32, 35, 40, 41, 45, and 49 Seater AC & Non-AC buses, as well as 13-Seater and 17-Seater Executive Force Urbania luxury vans.',
  },
  {
    id: 'bus-2',
    category: 'buses',
    question: 'How are Pune to Mumbai 5-Seater / 7-Seater cab & bus packages priced?',
    answer: 'Pune → Mumbai packages include up to 350 KM running with a professional driver. Driver DA, tolls, and extra KM rates are clearly itemized on each vehicle rate card.',
  },
  {
    id: 'bus-3',
    category: 'buses',
    question: 'What is included in the Pune Local Bus Rental Package?',
    answer: 'Standard local Pune bus packages include 8 Hours and 80 KM. Running beyond 80 KM or 8 hours is billed at transparent extra KM and extra hour rates.',
  },
  {
    id: 'bus-4',
    category: 'buses',
    question: 'Are outstation state permits and driver allowances included?',
    answer: 'Outstation rate cards clearly detail special state entry permits (e.g. ₹500 to ₹800) and driver DA / toll notes so there are zero hidden costs during your trip.',
  },

  // ─── CAR RENTALS SPECIFIC FAQS ──────────────────────────────────────
  {
    id: 'car-1',
    category: 'cars',
    question: 'What documents are required to rent a self-drive car?',
    answer: 'You will need a valid Driving License (DL) and an Original Government Photo ID (Aadhaar Card, Passport, or Voter ID). International tourists need a valid Passport and International Driving Permit (IDP).',
  },
  {
    id: 'car-2',
    category: 'cars',
    question: 'Are fuel charges included in the rental price?',
    answer: 'Vehicles are provided on a dry-rental basis. We provide sufficient fuel to reach the nearest fuel station, and you are expected to return the vehicle at the same fuel level as provided.',
  },
  {
    id: 'car-3',
    category: 'cars',
    question: 'Do you offer doorstep car delivery & airport pickups in Goa?',
    answer: 'Yes! We offer doorstep pickup and drop-off service across Goa, including Mopa Airport (GOX), Dabolim Airport (GOI), railway stations, and hotel locations.',
  },
  {
    id: 'car-4',
    category: 'cars',
    question: 'Is insurance included with self-drive vehicle rentals?',
    answer: 'Yes, 100% full zero-depreciation insurance is included with all vehicle rentals to ensure complete peace of mind during your drive.',
  },
  {
    id: 'car-5',
    category: 'cars',
    question: 'What is the speed limit and toll policy?',
    answer: 'Speed governors are calibrated to 80-100 km/h as mandated by transport laws. Tolls and FASTag charges incurred during the trip are payable at vehicle return.',
  },

  // ─── TOURS & TRAVELS SPECIFIC FAQS ──────────────────────────────────
  {
    id: 'tour-1',
    category: 'tours',
    question: 'Are hotel stays and local sightseeing guides included in tour packages?',
    answer: 'Yes! All curated fixed departure batches and private tour packages include verified 3★/4★ hotel stays, daily breakfast, and certified local sightseeing guides.',
  },
  {
    id: 'tour-2',
    category: 'tours',
    question: 'Can I customize a tour itinerary for a private family or corporate group?',
    answer: 'Absolutely! We offer fully custom private tour itineraries for families, honeymoons, and corporate groups with customized AC vehicle transfers.',
  },
  {
    id: 'tour-3',
    category: 'tours',
    question: 'What is included in the fixed departure batch tours?',
    answer: 'Fixed departure packages include round-trip transfers, hotel accommodations, guide services, activity passes, and 24/7 on-trip assistance.',
  },
  {
    id: 'tour-4',
    category: 'tours',
    question: 'How far in advance should I book domestic tour packages?',
    answer: 'We recommend booking at least 7-14 days prior to your travel date to ensure hotel availability and fixed departure seat allocation.',
  },
  {
    id: 'tour-5',
    category: 'tours',
    question: 'What is the cancellation and deposit policy for tours?',
    answer: 'Free cancellation is available up to 24 hours before tour start time with 100% deposit refund processed back to your original payment mode.',
  },

  // ─── OFFICIAL LEGAL POLICIES & AGREEMENTS FAQS ─────────────────────
  {
    id: 'legal-1',
    category: 'legal',
    question: 'Where can I read or download the official Website Standard Terms & Conditions?',
    answer: 'Our comprehensive 12-clause platform terms govern user obligations, reservation confirmations, vehicle operator guidelines, warranties, and Maharashtra jurisdiction. You can read the full policy online or download the official Microsoft Word (.DOCX) document below.',
    documents: [
      {
        label: 'Read Full Policy Online',
        url: '/terms-and-conditions',
        type: 'view',
      },
      {
        label: 'Download Agreement (.DOCX)',
        url: '/documents/Website-Standard-Terms-And-Conditions.docx',
        isDownload: true,
        downloadFilename: 'Website-Standard-Terms-And-Conditions.docx',
        type: 'docx',
      },
    ],
  },
  {
    id: 'legal-2',
    category: 'legal',
    question: 'Where can I review and download the official Non-Disclosure Agreement (NDA)?',
    answer: 'Our official 5-year bilateral proprietary confidentiality agreement includes fast-track arbitration under Section 29B of the Arbitration Act. You can review the complete NDA online or download the official Microsoft Word (.DOC) agreement below.',
    documents: [
      {
        label: 'Read Full NDA Online',
        url: '/nda',
        type: 'view',
      },
      {
        label: 'Download NDA (.DOC)',
        url: '/documents/Website-Non-Disclosure-Agreement.doc',
        isDownload: true,
        downloadFilename: 'Website-Non-Disclosure-Agreement.doc',
        type: 'doc',
      },
    ],
  },
  {
    id: 'legal-3',
    category: 'legal',
    question: 'What legal compliance and privacy standards protect my travel bookings?',
    answer: 'All reservations on आरंभ Tours & Travels operate under strict data protection protocols, transparent billing, zero hidden fees, and clear cancellation policies detailed in our verified legal repository.',
    documents: [
      {
        label: 'View Legal & Policies Hub',
        url: '/legal',
        type: 'view',
      },
      {
        label: 'View Cookie Policy',
        url: '/legal/cookie-policy',
        type: 'view',
      },
    ],
  },
];

export default function FAQSection({ mode = 'cars' }: { mode?: 'cars' | 'buses' | 'tours' | 'all' }) {
  const [selectedTab, setSelectedTab] = useState<FAQCategory>(mode);

  const activeCategory = mode === 'all' ? selectedTab : mode;

  const filteredFaqs = FAQS_DATA.filter((faq) => {
    if (activeCategory === 'cars') return faq.category === 'cars' || faq.category === 'legal' || faq.category === 'common';
    if (activeCategory === 'buses') return faq.category === 'buses' || faq.category === 'legal' || faq.category === 'common';
    if (activeCategory === 'tours') return faq.category === 'tours' || faq.category === 'legal' || faq.category === 'common';
    if (activeCategory === 'legal') return faq.category === 'legal';
    return true;
  });

  const [openId, setOpenId] = useState<string | null>(filteredFaqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const badgeColor = 'bg-[#C65A2E]/10 text-[#C65A2E] border border-[#C65A2E]/20';

  const titleText = mode === 'buses'
    ? 'Bus Rental & Outstation FAQs'
    : mode === 'cars'
    ? 'Car Rental FAQs & Guidelines'
    : mode === 'tours'
    ? 'Tour Packages FAQs & Guidelines'
    : 'Frequently Asked Questions & Policy Repository';

  const subtitleText = mode === 'buses'
    ? 'Everything you need to know about bus rentals, Pune-Mumbai packages, Urbania per-km rates, and legal policies.'
    : mode === 'cars'
    ? 'Everything you need to know about renting self-drive cars, documents, fuel, and official rental agreements.'
    : mode === 'tours'
    ? 'Everything you need to know about booking tour packages, hotel inclusions, itineraries, and terms.'
    : 'Find answers about car rentals, luxury buses, pilgrimage tour packages, and official legal agreements.';

  return (
    <section className="py-12 sm:py-16 bg-[#FCFAF6] border-t border-[#EDE2D0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 space-y-8 sm:space-y-10">
        
        {/* Section Title */}
        <div className="text-center space-y-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold font-syne uppercase tracking-wider ${badgeColor}`}>
            <HelpCircle className="w-3.5 h-3.5" />
            {mode === 'buses'
              ? 'BUS RENTAL FAQS'
              : mode === 'cars'
              ? 'SELF-DRIVE CAR RENTAL FAQS'
              : mode === 'tours'
              ? 'TOUR PACKAGES FAQS'
              : 'FREQUENTLY ASKED QUESTIONS'}
          </span>

          <h2 className="font-syne text-2xl sm:text-4xl font-extrabold text-[#493B34] tracking-tight">
            {titleText}
          </h2>

          <p className="text-xs sm:text-sm text-[#7A6B63] max-w-lg mx-auto leading-relaxed font-normal">
            {subtitleText}
          </p>
        </div>

        {/* Tab Filter if mode === 'all' */}
        {mode === 'all' && (
          <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
            {[
              { key: 'all', label: 'All FAQs' },
              { key: 'cars', label: 'Car Rentals' },
              { key: 'buses', label: 'Bus Rentals' },
              { key: 'tours', label: 'Tour Packages' },
              { key: 'legal', label: 'Legal Policies' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as FAQCategory)}
                className={`px-4 py-2 rounded-full text-xs font-bold font-syne uppercase tracking-wider transition-all cursor-pointer ${
                  selectedTab === tab.key
                    ? 'bg-[#C65A2E] text-white shadow-md shadow-[#C65A2E]/20'
                    : 'bg-white text-[#493B34] hover:bg-[#F7F3EB] border border-[#EDE2D0]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Accordion FAQ List */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            const isLegalItem = faq.category === 'legal';

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? isLegalItem
                      ? 'bg-white border-[#C65A2E] shadow-md shadow-[#C65A2E]/10 ring-1 ring-[#C65A2E]/20'
                      : 'bg-white border-[#C65A2E] shadow-md shadow-[#C65A2E]/5'
                    : 'bg-white border-[#EDE2D0] hover:border-[#DDD1BE]'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isLegalItem && (
                      <span className="p-1.5 rounded-lg bg-[#C65A2E]/10 text-[#C65A2E] shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className={`font-syne text-xs sm:text-base font-bold transition-colors ${
                      isOpen
                        ? 'text-[#C65A2E]'
                        : 'text-[#493B34]'
                    }`}>
                      {faq.question}
                    </span>
                  </div>

                  <div className={`p-1.5 sm:p-2 rounded-full shrink-0 transition-colors ${
                    isOpen
                      ? 'bg-[#C65A2E]/10 text-[#C65A2E]'
                      : 'bg-[#F7F3EB] text-[#7A6B63]'
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-4 pb-5 sm:px-6 text-xs sm:text-sm text-[#7A6B63] leading-relaxed border-t border-[#EDE2D0]/60 pt-3 font-normal space-y-3">
                        <p>{faq.answer}</p>

                        {/* Action Buttons & Document Downloads */}
                        {faq.documents && faq.documents.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2.5 pt-2">
                            {faq.documents.map((doc, idx) => (
                              doc.isDownload ? (
                                <a
                                  key={idx}
                                  href={doc.url}
                                  download={doc.downloadFilename || true}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F7F3EB] hover:bg-[#EDE2D0] text-[#493B34] text-xs font-bold transition-all border border-[#EDE2D0] cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5 text-[#C65A2E]" />
                                  <span>{doc.label}</span>
                                </a>
                              ) : (
                                <Link
                                  key={idx}
                                  href={doc.url}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#493B34] hover:bg-[#3D302A] text-white text-xs font-bold transition-all shadow-sm"
                                >
                                  <span>{doc.label}</span>
                                  <ArrowRight className="w-3 h-3 text-[#EDE2D0]" />
                                </Link>
                              )
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
