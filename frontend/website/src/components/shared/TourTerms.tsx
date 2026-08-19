'use client';

import React, { useRef, useState } from 'react';
import { FileText, CheckSquare, Square } from 'lucide-react';

interface TourTermsProps {
  packageTitle: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function TourTerms({ packageTitle, onAccept, onDecline }: TourTermsProps) {
  const [accepted, setAccepted] = useState(false);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setScrolledToEnd(true);
      }
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-terracotta" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-espresso">Booking Terms & Conditions</h3>
          <p className="text-xs text-espresso/60">Please read and accept before proceeding</p>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-64 overflow-y-auto border border-sand/20 rounded-xl p-5 bg-cream-soft text-sm text-espresso/80 leading-relaxed space-y-4 mb-4"
      >
        <h4 className="font-bold text-espresso text-base">TOUR BOOKING TERMS & CONDITIONS</h4>
        <p className="text-xs text-espresso/50">Package: {packageTitle} | Date: {new Date().toLocaleDateString('en-IN')}</p>

        <p className="font-semibold text-espresso">1. BOOKING CONFIRMATION</p>
        <p>A booking is confirmed only after receipt of the booking deposit of ₹500 per booking. This deposit is a confirmation fee and will be adjusted against the total tour cost. The remaining balance must be paid before the trip departure date as communicated by our team.</p>

        <p className="font-semibold text-espresso">2. PAYMENT TERMS</p>
        <p>The remaining balance after the ₹500 booking deposit shall be paid as follows: (a) 50% of the balance at least 15 days before the departure date, (b) 100% balance at least 7 days before the departure date. Failure to make timely payments may result in cancellation of the booking.</p>

        <p className="font-semibold text-espresso">3. CANCELLATION & REFUND POLICY</p>
        <p>Cancellation charges apply as follows: (a) More than 30 days before departure: Full refund minus booking deposit of ₹500, (b) 15-30 days before departure: 50% of total tour cost, (c) 7-14 days before departure: 75% of total tour cost, (d) Less than 7 days or no-show: No refund.</p>

        <p className="font-semibold text-espresso">4. TOUR INCLUSIONS & EXCLUSIONS</p>
        <p>The tour package includes only those services expressly mentioned in the &quot;Inclusions&quot; section of the package details. Any services not listed under inclusions are excluded. Personal expenses, tips, travel insurance, and items of a personal nature are not included unless explicitly stated.</p>

        <p className="font-semibold text-espresso">5. ITINERARY CHANGES</p>
        <p>The Company reserves the right to modify the itinerary due to: (a) weather conditions, (b) road/trail closures, (c) government restrictions, (d) force majeure events, (e) safety concerns. Alternative arrangements of similar value will be provided where possible.</p>

        <p className="font-semibold text-espresso">6. TRAVEL DOCUMENTS</p>
        <p>The traveler is responsible for carrying valid photo identification (Aadhaar Card/Passport/Voter ID) throughout the trip. For certain destinations, additional permits may be required, and the Company will assist in obtaining these where applicable.</p>

        <p className="font-semibold text-espresso">7. HEALTH & FITNESS</p>
        <p>The traveler confirms that they are medically fit to undertake the tour. Any pre-existing medical conditions must be disclosed at the time of booking. The Company is not responsible for any medical emergencies during the tour.</p>

        <p className="font-semibold text-espresso">8. TRAVEL INSURANCE</p>
        <p>Travel insurance is not included in the tour package. The Company strongly recommends purchasing comprehensive travel insurance covering trip cancellation, medical emergencies, and baggage loss.</p>

        <p className="font-semibold text-espresso">9. CODE OF CONDUCT</p>
        <p>Travelers are expected to behave respectfully towards co-travelers, local communities, and the environment. The Company reserves the right to terminate a traveler&apos;s participation without refund in case of misconduct.</p>

        <p className="font-semibold text-espresso">10. LIABILITY</p>
        <p>The Company acts as an organizer and coordinator. Liability for services provided by third parties (hotels, transport, guides) rests with the respective service providers. The Company shall not be liable for any injury, loss, or damage arising from circumstances beyond its control.</p>

        <div className="pt-4 border-t border-sand/20">
          <p className="text-xs text-espresso/50 italic">By accepting these terms, you confirm that you have read, understood, and agree to all the above terms and conditions for this tour booking.</p>
        </div>
      </div>

      {!scrolledToEnd && (
        <p className="text-xs text-terracotta mb-3 animate-pulse-soft text-center">↓ Please scroll to the end to continue</p>
      )}

      <label
        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer mb-4 ${
          accepted ? 'bg-green-50 border-green-300' : scrolledToEnd ? 'bg-cream border-sand/25 hover:border-terracotta/30' : 'bg-gray-50 border-gray-200 opacity-50 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={() => scrolledToEnd && setAccepted(!accepted)}
          className="flex-shrink-0"
        >
          {accepted ? (
            <CheckSquare className="w-5 h-5 text-green-600" />
          ) : (
            <Square className="w-5 h-5 text-espresso/30" />
          )}
        </button>
        <span className="text-sm text-espresso font-medium">
          I have read and accept the Booking Terms & Conditions
        </span>
      </label>

      <div className="flex gap-3">
        <button
          onClick={onDecline}
          className="flex-1 py-3 border border-sand/30 text-espresso/70 font-semibold text-sm rounded-xl hover:bg-cream-dark transition-colors"
        >
          Go Back
        </button>
        <button
          onClick={onAccept}
          disabled={!accepted}
          className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all duration-300 ${
            accepted
              ? 'bg-terracotta text-cream shadow-lg shadow-terracotta/20 hover:bg-terracotta-dark'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Accept & Continue to Payment
        </button>
      </div>
    </div>
  );
}
