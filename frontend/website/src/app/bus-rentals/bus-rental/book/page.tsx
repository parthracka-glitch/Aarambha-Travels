'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BusBookingPage, { BusBookingConfig } from '@/components/booking/BusBookingPage';

function OutstationBusBookingContent() {
  const searchParams = useSearchParams();

  const busType = searchParams.get('type') || '13 Seater';
  const seats = parseInt(searchParams.get('seats') || '13', 10);
  const acType = (searchParams.get('ac') as 'AC' | 'Non-AC') || 'AC';
  const route = searchParams.get('route') || 'Mumbai';
  const basePrice = parseInt(searchParams.get('price') || '10500', 10);

  const config: BusBookingConfig = {
    busType,
    seats,
    serviceType: 'outstation',
    acType,
    route,
    basePrice,
    backLink: '/bus-rentals/bus-rental',
    backLabel: 'Back to Outstation Rates',
  };

  return <BusBookingPage config={config} />;
}

export default function OutstationBusBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#5266EB] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OutstationBusBookingContent />
    </Suspense>
  );
}
