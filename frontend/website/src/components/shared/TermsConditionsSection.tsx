'use client';

import React, { useState } from 'react';
import { ShieldAlert, FileText, CheckCircle2, Car, Compass, ShieldCheck, AlertCircle, Phone } from 'lucide-react';
import { SHARED_TOUR_CONTACT } from '@/constants/toursData';
import { SHARED_CAR_CONTACT } from '@/constants/carsData';
import { SHARED_BUS_CONTACT } from '@/constants/busData';

export type TermsMode = 'all' | 'cars' | 'tours' | 'buses';

const CAR_RENTAL_TERMS = [
  {
    title: 'Valid Driving License & Identity Verification',
    description: 'Hirer must possess an original, valid Driving License (minimum 1-year driving experience) and government-issued photo ID proof (Aadhaar Card / Passport / Voter ID). Original documents must be presented for physical verification during vehicle handover.',
  },
  {
    title: 'Security Deposit & Booking Policy',
    description: 'A refundable security deposit locks your vehicle reservation. The remaining rental balance is payable prior to vehicle handover. Refundable security deposits are credited back within 24 hours of successful post-trip vehicle inspection.',
  },
  {
    title: 'Fuel Level & Kilometre Limit Policy',
    description: 'All self-drive vehicles are provided on a dry basis (the fuel level is recorded at dispatch and must match upon return). Transparent kilometre caps apply as per your selected booking plan with minimal per-km charges thereafter.',
  },
  {
    title: 'Speed Governors & State Traffic Compliance',
    description: 'Vehicles are fitted with commercial speed governors (80–100 km/h) in compliance with Motor Vehicles Act guidelines. Overspeeding penalties, rash driving fines, and state transport challans are the sole legal liability of the hirer.',
  },
  {
    title: 'Tolls, Parking & Interstate Permits',
    description: 'All FASTag highway toll charges, local municipal parking fees, and any interstate road tax permits incurred during the rental period are payable directly by the hirer.',
  },
  {
    title: 'Comprehensive Insurance & Damage Protocol',
    description: 'Vehicles include zero-depreciation comprehensive insurance coverage for major incidents. Minor body scratches, tyre punctures, or interior upholstery stains caused by misuse/negligence are deductible up to the security deposit amount.',
  },
];

const BUS_RENTAL_TERMS = [
  {
    title: 'Time & Kilometre Calculation Standard',
    description: 'Time and KM calculations start and end from office to office. Running limit is standard 300 KM per day for outstation trips.',
  },
  {
    title: 'Operating Hours & Night Charges',
    description: 'Service time starts 6:00 AM to 10:00 PM. Night charges apply from 12:00 AM to 6:00 AM; extra charges apply after 10:00 PM.',
  },
  {
    title: 'Driver Allowance & Per-Day DA',
    description: 'Driver allowance (DA) / food allowance is charged as specified on the rate card (e.g. ₹400/day or food provided by the client).',
  },
  {
    title: 'Tolls, Parking & Interstate Permits',
    description: 'Interstate entry taxes, toll taxes, parking fees, and service tax are charged as actuals and payable directly during the trip.',
  },
  {
    title: 'Extra Kilometres & Hours Protocol',
    description: 'Transparent extra per-km and extra hourly charges apply beyond the included package limits as per the official rate card.',
  },
  {
    title: 'Fuel Price Variation Policy',
    description: 'Quoted prices are based on current diesel fuel prices. Any government fuel price escalation will result in a proportionate rate variation.',
  },
];

const TOUR_PACKAGE_TERMS = [
  {
    title: 'Booking Confirmation & Advance Amount Policy',
    description: 'Tour package bookings are confirmed strictly upon receipt of the specified advance deposit amount (₹1,999 for 3 Jyotirlinga Yatra / ₹2,999 for Krishna Yatra & Tirupati Balaji / ₹4,999 for South India Premium Tour). The remaining package balance must be cleared prior to departure.',
  },
  {
    title: 'Strict Cancellation & No Refund Policy',
    description: 'Once a booking is confirmed and seats/hotel allotments are secured, no monetary refund is provided upon cancellation under any circumstances.',
  },
  {
    title: 'Substitute Traveler Permitted',
    description: 'In the event a registered guest is unable to travel, a substitute traveler may be nominated in their place at no extra charge, provided prior notification is submitted to our travel desk at least 24 hours before departure.',
  },
  {
    title: 'Hotel Accommodation & Room Sharing Basis',
    description: 'Standard package accommodation includes comfortable verified hotel stays arranged on a 3 to 4 person sharing basis (or 4–5 person sharing for 3 Jyotirlinga Yatra) with clean amenities and sanitized bedding.',
  },
  {
    title: 'Dedicated AC Fleet & Transportation Protocol',
    description: 'All inter-city journeys and sightseeing transfers are conducted in New Urbania Pushback AC Buses or 2x2 AC Sleeper Coaches with experienced pilgrimage drivers and route managers.',
  },
  {
    title: 'Darshan Passes & Personal Temple Expenses',
    description: 'VIP Special Darshan passes, personal puja/abhishek rituals, local auto-rickshaw/e-rickshaw transit, boating fees, and personal shopping expenses are excluded from the tour package fare and payable directly by guests.',
  },
];

const COMMON_PLATFORM_TERMS = [
  {
    title: 'Government Compliance & Code of Conduct',
    description: 'Aarambha is a government-registered travel agency and fleet operator. Consumption of alcohol, transport of prohibited substances, or unlawful conduct during travel is strictly prohibited and subject to immediate legal reporting.',
  },
  {
    title: '24/7 Helpline & Roadside Support',
    description: `Our dedicated Pune travel desk (Tours & Bus Rentals: +91 ${SHARED_BUS_CONTACT.callPhone} / +91 ${SHARED_BUS_CONTACT.whatsappPhone} • Car Rentals Call: ${SHARED_CAR_CONTACT.callPhoneDisplay} • WhatsApp: ${SHARED_CAR_CONTACT.whatsappPhoneDisplay}) operates 24/7 to provide continuous assistance, route guidance, and pilgrimage support throughout your journey.`,
  },
  {
    title: 'Data Privacy & Traveler Security',
    description: 'Customer contact details, payment receipts, and identity documents are encrypted and handled in strict accordance with the Information Technology Act and never disclosed to third parties.',
  },
];

export default function TermsConditionsSection({ mode = 'all' }: { mode?: TermsMode }) {
  const [activeTab, setActiveTab] = useState<'cars' | 'tours' | 'buses' | 'common'>(
    mode === 'cars' ? 'cars' : mode === 'buses' ? 'buses' : mode === 'tours' ? 'tours' : 'cars'
  );

  const currentMode = mode === 'all' ? activeTab : mode;

  const currentTerms = currentMode === 'cars'
    ? CAR_RENTAL_TERMS
    : currentMode === 'buses'
    ? BUS_RENTAL_TERMS
    : currentMode === 'tours'
    ? TOUR_PACKAGE_TERMS
    : COMMON_PLATFORM_TERMS;

  return (
    <section className="py-16 bg-[#FAFAFC] border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold font-syne uppercase tracking-wider ${
            currentMode === 'cars'
              ? 'bg-[#5266EB]/10 text-[#5266EB] border border-[#5266EB]/30'
              : currentMode === 'buses'
              ? 'bg-[#5266EB]/10 text-[#5266EB] border border-[#5266EB]/30'
              : currentMode === 'tours'
              ? 'bg-[#9CB4E8]/20 text-[#171721] border border-[#9CB4E8]/40'
              : 'bg-[#EDEDF3] text-slate-700 border border-[#AFB2CE]/30'
          }`}>
            <FileText className="w-3.5 h-3.5" />
            {currentMode === 'cars'
              ? 'CAR RENTAL TERMS & GUIDELINES'
              : currentMode === 'buses'
              ? 'BUS RENTAL TERMS & GUIDELINES'
              : currentMode === 'tours'
              ? 'PILGRIMAGE TOUR TRAVEL TERMS'
              : 'OFFICIAL TERMS & POLICIES'}
          </span>

          <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#000000] tracking-tight">
            {currentMode === 'cars'
              ? 'Self-Drive Car Rental Terms & Conditions'
              : currentMode === 'buses'
              ? 'Bus & Urbania Fleet Rental Guidelines'
              : currentMode === 'tours'
              ? 'Tours & Travels Pilgrimage Booking Terms'
              : 'Terms & Conditions Policy'}
          </h2>

          <p className="text-xs text-gray-500 max-w-xl mx-auto leading-relaxed font-normal">
            {currentMode === 'cars'
              ? 'Review the official security deposit, verification guidelines, fuel policies, and insurance coverage for self-drive vehicle rentals.'
              : currentMode === 'buses'
              ? 'Review the official rules, driver allowance, permit fees, and kilometre calculation standards for bus rentals.'
              : currentMode === 'tours'
              ? 'Clear, transparent booking policies, advance confirmation rules, substitute traveler permissions, and inclusion guidelines for all pilgrimage departures.'
              : 'Official terms and regulatory standards governing all vehicle rentals, pilgrimage bookings, and guest services.'}
          </p>
        </div>

        {/* Tab Switcher (Visible only in 'all' mode) */}
        {mode === 'all' && (
          <div className="flex flex-wrap items-center justify-center gap-2 pb-4">
            <button
              onClick={() => setActiveTab('cars')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-syne uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'cars'
                  ? 'bg-[#5266EB] text-white shadow-md shadow-[#5266EB]/20'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Car Rental</span>
            </button>

            <button
              onClick={() => setActiveTab('buses')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-syne uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'buses'
                  ? 'bg-[#5266EB] text-white shadow-md shadow-[#5266EB]/20'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Bus Rental</span>
            </button>

            <button
              onClick={() => setActiveTab('tours')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-syne uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'tours'
                  ? 'bg-[#171721] text-[#9CB4E8] shadow-md shadow-black/20'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#9CB4E8]" />
              <span>Tour Terms</span>
            </button>

            <button
              onClick={() => setActiveTab('common')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold font-syne uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'common'
                  ? 'bg-[#5266EB] text-[#EDEDF3] shadow-md shadow-[#5266EB]/20'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>General</span>
            </button>
          </div>
        )}

        {/* ─── TERMS CARDS CONTAINER ─── */}
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-10 shadow-sm space-y-8">
          
          <div className="flex items-center gap-2 text-[#000000] font-syne font-bold text-base pb-4 border-b border-gray-100">
            <ShieldAlert className="w-5 h-5 text-[#5266EB]" />
            <span>Policy Guidelines & Agreement Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentTerms.map((term, index) => (
              <div key={index} className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FAFAFC] border border-gray-100 hover:border-gray-200 transition-colors">
                <div className={`p-2 rounded-xl shrink-0 ${
                  currentMode === 'cars' || currentMode === 'buses'
                    ? 'bg-[#5266EB]/10 text-[#5266EB]'
                    : currentMode === 'tours'
                    ? 'bg-[#9CB4E8]/20 text-[#171721]'
                    : 'bg-[#EDEDF3] text-[#000000]'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-syne text-xs font-bold text-[#000000]">
                    {index + 1}. {term.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
                    {term.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Helpline Support Callout */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <AlertCircle className="w-4 h-4 text-[#5266EB] shrink-0" />
              <span>
                {currentMode === 'cars'
                  ? 'For self-drive queries or breakdown assistance: Call +91 78208 02985 or WhatsApp +91 82082 11478.'
                  : currentMode === 'buses'
                  ? 'For bus rental queries or assistance: Call +91 90676 17451 or WhatsApp +91 90218 78717.'
                  : 'For yatra booking queries or darshan assistance: Call +91 90676 17451 / +91 90218 78717.'}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {currentMode === 'cars' ? (
                <>
                  <a
                    href={`tel:+91${SHARED_CAR_CONTACT.callPhone}`}
                    className="inline-flex items-center gap-1.5 font-bold text-[#5266EB] hover:text-[#3E51D4] font-syne"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call {SHARED_CAR_CONTACT.callPhoneDisplay}</span>
                  </a>
                  <a
                    href={`https://wa.me/91${SHARED_CAR_CONTACT.whatsappPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-[#5266EB] hover:underline font-syne"
                  >
                    <span>WA: {SHARED_CAR_CONTACT.whatsappPhoneDisplay}</span>
                  </a>
                </>
              ) : currentMode === 'buses' ? (
                <>
                  <a
                    href={`tel:+91${SHARED_BUS_CONTACT.callPhone}`}
                    className="inline-flex items-center gap-1.5 font-bold text-[#5266EB] hover:text-[#3E51D4] font-syne"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call {SHARED_BUS_CONTACT.callPhoneDisplay}</span>
                  </a>
                  <a
                    href={`https://wa.me/91${SHARED_BUS_CONTACT.whatsappPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-[#5266EB] hover:underline font-syne"
                  >
                    <span>WA: {SHARED_BUS_CONTACT.whatsappPhoneDisplay}</span>
                  </a>
                </>
              ) : (
                <a
                  href={`tel:+91${SHARED_TOUR_CONTACT.phone1}`}
                  className="inline-flex items-center gap-1.5 font-bold text-[#5266EB] hover:text-[#3E51D4] font-syne"
                >
                  <Phone className="w-3.5 h-3.5 text-[#5266EB]" />
                  <span>{SHARED_TOUR_CONTACT.phone1Display} / {SHARED_TOUR_CONTACT.phone2Display}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ─── DEDICATED LEGAL DOCUMENTS CARDS ─── */}
        <div className="pt-2">
          <div className="text-center space-y-1 mb-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5266EB] font-syne">
              OFFICIAL LEGAL REPOSITORY
            </span>
            <h3 className="font-syne text-xl sm:text-2xl font-extrabold text-[#000000]">
              Official Policy & Agreement Documents
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Read online or download the official Word (.DOC / .DOCX) agreements below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Standard Terms and Conditions */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#5266EB]/10 text-[#5266EB] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-syne text-base font-bold text-[#000000]">
                  Website Standard Terms & Conditions
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Comprehensive 12-clause platform terms governing user obligations, intellectual property, warranties, and Maharashtra jurisdiction.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                <a
                  href="/terms-and-conditions"
                  className="flex-1 text-center py-2.5 px-4 rounded-full bg-[#171721] hover:bg-[#272735] text-[#EDEDF3] text-xs font-bold transition-colors"
                >
                  Read Full Policy
                </a>
                <a
                  href="/documents/Website-Standard-Terms-And-Conditions.docx"
                  download="Website-Standard-Terms-And-Conditions.docx"
                  className="py-2.5 px-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#5266EB]" /> .DOCX
                </a>
              </div>
            </div>

            {/* Card 2: Non-Disclosure Agreement (NDA) */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#9CB4E8]/20 text-[#5266EB] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-syne text-base font-bold text-[#000000]">
                  Website Non-Disclosure Agreement (NDA)
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Official 5-year bilateral proprietary confidentiality agreement with fast-track arbitration under Section 29B of the Arbitration Act.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                <a
                  href="/nda"
                  className="flex-1 text-center py-2.5 px-4 rounded-full bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] text-xs font-bold transition-colors shadow-sm"
                >
                  Read Full NDA
                </a>
                <a
                  href="/documents/Website-Non-Disclosure-Agreement.doc"
                  download="Website-Non-Disclosure-Agreement.doc"
                  className="py-2.5 px-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#5266EB]" /> .DOC
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
