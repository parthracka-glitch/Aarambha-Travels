'use client';

import React, { useRef, useState } from 'react';
import { ScrollText, CheckSquare, Square } from 'lucide-react';

interface RentalAgreementProps {
  vehicleName: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function RentalAgreement({ vehicleName, onAccept, onDecline }: RentalAgreementProps) {
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
          <ScrollText className="w-5 h-5 text-terracotta" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-espresso">Self-Drive Rental Agreement</h3>
          <p className="text-xs text-espresso/60">Please read and accept before proceeding</p>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-64 overflow-y-auto border border-sand/20 rounded-xl p-5 bg-cream-soft text-sm text-espresso/80 leading-relaxed space-y-4 mb-4"
      >
        <h4 className="font-bold text-espresso text-base">SELF-DRIVE VEHICLE RENTAL AGREEMENT</h4>
        <p className="text-xs text-espresso/50">Vehicle: {vehicleName} | Date: {new Date().toLocaleDateString('en-IN')}</p>

        <p className="font-semibold text-espresso">1. RENTAL TERMS</p>
        <p>The Renter agrees to rent the above-mentioned vehicle from Aarambha Self-Drive Rentals (hereinafter &quot;the Company&quot;) subject to the following terms and conditions. The vehicle shall be used exclusively by the authorized renter who holds a valid Indian driving license.</p>

        <p className="font-semibold text-espresso">2. BOOKING DEPOSIT</p>
        <p>A non-refundable booking deposit of ₹500 is required to confirm the reservation. The remaining rental amount (daily rate × number of days) and the refundable security deposit shall be collected at the time of vehicle pickup/delivery.</p>

        <p className="font-semibold text-espresso">3. SECURITY DEPOSIT</p>
        <p>A refundable security deposit (as mentioned on the vehicle listing) will be collected at the time of pickup. This deposit covers potential damage, traffic violations, or fuel shortages. The deposit will be refunded within 3-5 business days after successful return of the vehicle in its original condition.</p>

        <p className="font-semibold text-espresso">4. FUEL POLICY</p>
        <p>The vehicle will be provided with a specific fuel level. The Renter must return the vehicle with the same fuel level. Any shortfall in fuel will be deducted from the security deposit at prevailing fuel rates plus a ₹200 refueling service charge.</p>

        <p className="font-semibold text-espresso">5. USAGE RESTRICTIONS</p>
        <p>The vehicle must not be used for: (a) racing or speed testing, (b) carrying passengers for hire, (c) towing other vehicles, (d) transporting hazardous materials, (e) driving under the influence of alcohol or drugs, (f) driving beyond state borders without prior written consent.</p>

        <p className="font-semibold text-espresso">6. DAMAGE & LIABILITY</p>
        <p>The Renter is fully responsible for all damage to the vehicle during the rental period, including but not limited to collision damage, tire damage, and interior damage. Basic insurance coverage is included; however, the Renter bears a damage excess/deductible as per the security deposit amount.</p>

        <p className="font-semibold text-espresso">7. TRAFFIC VIOLATIONS</p>
        <p>The Renter is responsible for all traffic fines, e-challans, toll charges, and parking fees incurred during the rental period. Any fines received after vehicle return will be deducted from the security deposit or charged to the Renter.</p>

        <p className="font-semibold text-espresso">8. CANCELLATION POLICY</p>
        <p>Cancellation more than 48 hours before pickup: Full refund of booking deposit. Cancellation within 24-48 hours: 50% refund. Cancellation within 24 hours or no-show: No refund of booking deposit.</p>

        <p className="font-semibold text-espresso">9. VEHICLE RETURN</p>
        <p>The vehicle must be returned at the agreed date, time, and location. Late returns will incur additional charges at 1.5× the daily rate per additional day or part thereof. The vehicle must be returned in clean condition; a cleaning fee of ₹500 applies for excessively dirty vehicles.</p>

        <p className="font-semibold text-espresso">10. JURISDICTION</p>
        <p>This agreement is governed by the laws of India. Any disputes arising from this agreement shall be subject to the exclusive jurisdiction of the courts of Jaipur, Rajasthan.</p>

        <div className="pt-4 border-t border-sand/20">
          <p className="text-xs text-espresso/50 italic">By accepting this agreement, you confirm that you have read, understood, and agree to all the above terms and conditions. You also confirm that you hold a valid Indian driving license and are legally authorized to drive the rented vehicle.</p>
        </div>
      </div>

      {!scrolledToEnd && (
        <p className="text-xs text-terracotta mb-3 animate-pulse-soft text-center">↓ Please scroll to the end of the agreement to continue</p>
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
          I have read and accept the Self-Drive Rental Agreement
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
