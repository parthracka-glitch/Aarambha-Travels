'use client';

import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, ExternalLink, ShieldCheck, Compass } from 'lucide-react';

export default function CompanyLocationSection({ mode = 'all' }: { mode?: 'cars' | 'buses' | 'tours' | 'all' }) {
  const whatsappUrl = mode === 'cars'
    ? "https://wa.me/918208211478?text=Hi%20Aarambha%20Car%20Rentals,%20I%20would%20like%20to%20inquire%20about%20self-drive%20car%20rentals."
    : mode === 'buses'
    ? "https://wa.me/919021878717?text=Hi%20Aarambha%20Bus%20Rentals,%20I%20would%20like%20to%20inquire%20about%20bus%20hire."
    : mode === 'tours'
    ? "https://wa.me/919067617451?text=Hi%20Aarambha%20Tours%20%26%20Travels,%20I%20would%20like%20to%20inquire%20about%20pilgrimage%20tour%20packages."
    : "https://wa.me/919021878717?text=Hi%20Aarambha%20Tours%20%26%20Car%20Rentals,%20I%20would%20like%20to%20inquire%20about%20your%20services.";

  const phoneUrl = mode === 'cars' ? "tel:+917820802985" : "tel:+919067617451";
  const googleMapsUrl = "https://maps.google.com/?q=Green+Hills+Society+Katraj+Pune+Maharashtra+411046";

  return (
    <section className="py-16 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="space-y-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold font-syne uppercase tracking-wider ${
              mode === 'cars'
                ? 'bg-[#5266EB]/10 text-[#5266EB] border border-[#5266EB]/30'
                : mode === 'buses'
                ? 'bg-[#5266EB]/10 text-[#5266EB] border border-[#5266EB]/30'
                : 'bg-[#9CB4E8]/20 text-[#171721] border border-[#9CB4E8]/40'
            }`}>
              <MapPin className="w-3.5 h-3.5" />
              {mode === 'cars'
                ? 'CAR RENTALS HQ & CONTACT'
                : mode === 'buses'
                ? 'BUS RENTALS HQ & CONTACT'
                : mode === 'tours'
                ? 'TOURS HQ & CONTACT'
                : 'LOCATION & CONTACT'}
            </span>
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#000000] tracking-tight">
              {mode === 'cars'
                ? 'Visit Central Fleet HQ & Connect'
                : mode === 'buses'
                ? 'Visit Bus Fleet Desk & Connect'
                : mode === 'tours'
                ? 'Visit Travel Desk HQ & Connect'
                : 'Visit Our HQ & Connect With Us'}
            </h2>
          </div>
          <p className="text-xs text-gray-500 max-w-md leading-relaxed font-normal">
            {mode === 'cars'
              ? 'Have questions about self-drive vehicle availability or doorstep Pune delivery? Speak directly with our 24/7 fleet support desk.'
              : mode === 'buses'
              ? 'Have questions about bus hire, tempo travellers, or Urbania outstation packages? Speak directly with our 24/7 bus support desk.'
              : mode === 'tours'
              ? 'Have questions about pilgrimage tour itineraries or custom family packages? Speak directly with our 24/7 tour assistance team.'
              : 'Have questions about tour itineraries or self-drive vehicle availability? Speak directly with our 24/7 support team or drop by our central office.'}
          </p>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT 6-COL: COMPANY DETAILS & DIRECT CONTACT CTAS */}
          <div className="lg:col-span-6 rounded-3xl bg-[#FAFAFC] border border-gray-200 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
            
            <div className="space-y-6">
              {/* Brand Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 ring-1 ring-gray-200 shadow-sm shrink-0">
                    <img src="/images/logo.jpeg" alt="आरंभ Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-['Amita','Yatra_One','Rozha_One',serif] text-xl font-bold text-[#000000] leading-none">
                      आरंभ <span className="font-syne text-sm font-bold text-gray-700 font-sans">Tours & Travels</span>
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">Government Registered Travel & Fleet Agency</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#9CB4E8]/20 text-[#171721] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 border border-[#9CB4E8]/30">
                  <ShieldCheck className="w-3 h-3 text-[#5266EB]" /> Verified HQ
                </span>
              </div>

              {/* Contact Detail Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Address */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-gray-200">
                  <div className="p-2 rounded-xl bg-[#5266EB]/10 text-[#5266EB] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#000000] text-xs font-syne">Head Office</h4>
                    <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5">
                      Green Hills Society, Near Mastan Hotel, Mangdewadi, Katraj, Pune - 411046, Maharashtra
                    </p>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-gray-200">
                  <div className="p-2 rounded-xl bg-[#9CB4E8]/20 text-[#5266EB] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#000000] text-xs font-syne">Support Desk</h4>
                    <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5">
                      24/7 Operations & On-Trip Support
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-gray-200">
                  <div className="p-2 rounded-xl bg-[#AFB2CE]/20 text-[#171721] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#000000] text-xs font-syne">Phone Hotline</h4>
                    {mode === 'cars' ? (
                      <>
                        <p className="text-gray-900 font-bold text-[11px] mt-0.5">Call: +91 78208 02985</p>
                        <p className="text-[#5266EB] font-bold text-[10px]">WhatsApp: +91 82082 11478</p>
                      </>
                    ) : mode === 'buses' ? (
                      <>
                        <p className="text-gray-900 font-bold text-[11px] mt-0.5">Call: +91 90676 17451</p>
                        <p className="text-[#5266EB] font-bold text-[10px]">WhatsApp: +91 90218 78717</p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-900 font-bold text-[11px] mt-0.5">+91 90676 17451 / +91 90218 78717</p>
                        <p className="text-gray-400 text-[10px]">24/7 Yatra Assistance & Calling</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-gray-200">
                  <div className="p-2 rounded-xl bg-[#5266EB]/10 text-[#5266EB] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#000000] text-xs font-syne">Email Support</h4>
                    <p className="text-gray-500 text-[11px] mt-0.5">support@aarambhatravels.in</p>
                    <p className="text-gray-400 text-[10px]">bookings@aarambhatravels.in</p>
                  </div>
                </div>

              </div>
            </div>

            {/* INSTANT CTA ACTION BUTTONS (WHATSAPP & DIRECT CALL) */}
            <div className="pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* WhatsApp CTA Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#171721] hover:bg-[#272735] text-[#EDEDF3] font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#171721]/20 hover:scale-105 active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>

              {/* Direct Call CTA Button */}
              <a
                href={phoneUrl}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#5266EB]/20 hover:scale-105 active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>{mode === 'cars' ? 'Call +91 78208 02985' : 'Call +91 90676 17451'}</span>
              </a>

            </div>

          </div>

          {/* RIGHT 6-COL: INTERACTIVE GOOGLE MAPS LOCATION EMBED */}
          <div className="lg:col-span-6 rounded-3xl overflow-hidden border border-gray-200 bg-gray-100 min-h-[320px] sm:min-h-[400px] relative group shadow-sm flex flex-col justify-between">
            
            {/* Embedded Google Maps Frame for Green Hills Society Katraj Pune */}
            <iframe
              title="Aarambha Green Hills Society Katraj Pune Location Google Maps"
              src="https://maps.google.com/maps?q=Green+Hills+Society+Katraj+Pune+Maharashtra&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[320px] sm:min-h-[400px] border-0 filter brightness-95 group-hover:brightness-100 transition-all duration-500"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Floating Map Overlay Badge */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#5266EB]/10 text-[#5266EB]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#000000] text-xs font-syne">Green Hills Society, Katraj</h4>
                  <p className="text-[11px] text-gray-500">Pune, Maharashtra - 411046</p>
                </div>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#171721] hover:bg-[#5266EB] text-[#EDEDF3] font-extrabold text-[11px] tracking-wider uppercase transition-colors shrink-0"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
