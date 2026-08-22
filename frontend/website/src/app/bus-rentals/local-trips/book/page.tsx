'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BusBookingPage, { BusBookingConfig } from '@/components/booking/BusBookingPage';

function LocalBusBookingContent() {
  const searchParams = useSearchParams();

  const busType = searchParams.get('type') || '13 Seater';
  const seats = parseInt(searchParams.get('seats') || '13', 10);
  const acType = (searchParams.get('ac') as 'AC' | 'Non-AC') || 'AC';
  const basePrice = parseInt(searchParams.get('price') || '6000', 10);

  const config: BusBookingConfig = {
    busType,
    seats,
    serviceType: 'local',
    acType,
    basePrice,
    backLink: '/bus-rentals/local-trips',
    backLabel: 'Back to Local Rates',
  };

  return <BusBookingPage config={config} />;
}

export default function LocalBusBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#5266EB] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LocalBusBookingContent />
    </Suspense>
  );
}
