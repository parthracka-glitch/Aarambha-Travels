'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, Car, Compass, ShieldCheck } from 'lucide-react';

export type FAQCategory = 'all' | 'cars' | 'tours';

export interface FAQItem {
  id: string;
  category: 'common' | 'cars' | 'tours';
  question: string;
  answer: string;
}

const FAQS_DATA: FAQItem[] = [
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
];

export default function FAQSection({ mode = 'cars' }: { mode?: 'cars' | 'tours' | 'all' }) {
  const filteredFaqs = FAQS_DATA.filter((faq) => {
    if (mode === 'cars') return faq.category === 'cars';
    if (mode === 'tours') return faq.category === 'tours';
    return true;
  });

  const [openId, setOpenId] = useState<string | null>(filteredFaqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-[#FAFAFC] border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-10">
        
        {/* Section Title */}
        <div className="text-center space-y-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold font-syne uppercase tracking-wider ${
            mode === 'cars'
              ? 'bg-red-50 text-[#FF3B30] border border-red-100'
              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
          }`}>
            <HelpCircle className="w-3.5 h-3.5" />
            {mode === 'cars' ? 'SELF-DRIVE CAR RENTAL FAQS' : 'TOUR PACKAGES FAQS'}
          </span>

          <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            {mode === 'cars' ? 'Car Rental FAQs & Guidelines' : 'Tour Packages FAQs & Guidelines'}
          </h2>

          <p className="text-xs text-gray-500 max-w-lg mx-auto leading-relaxed font-normal">
            {mode === 'cars'
              ? 'Everything you need to know about renting self-drive cars, documents, fuel, and delivery.'
              : 'Everything you need to know about booking tour packages, hotel inclusions, and itineraries.'}
          </p>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? mode === 'cars'
                      ? 'bg-white border-[#FF3B30] shadow-md shadow-red-500/5'
                      : 'bg-white border-emerald-600 shadow-md shadow-emerald-500/5'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className={`font-syne text-sm sm:text-base font-bold transition-colors ${
                    isOpen
                      ? mode === 'cars'
                        ? 'text-[#FF3B30]'
                        : 'text-emerald-600'
                      : 'text-[#111111]'
                  }`}>
                    {faq.question}
                  </span>

                  <div className={`p-2 rounded-full shrink-0 transition-colors ${
                    isOpen
                      ? mode === 'cars'
                        ? 'bg-red-50 text-[#FF3B30]'
                        : 'bg-emerald-50 text-emerald-600'
                      : 'bg-gray-100 text-gray-500'
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
                      <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4 font-normal">
                        {faq.answer}
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
