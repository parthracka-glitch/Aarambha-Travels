'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LocalTripsSubrouteRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/bus-rentals');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FCFAF6] flex items-center justify-center font-sans text-xs text-[#756B63]">
      <span>Redirecting to Bus Rentals...</span>
    </div>
  );
}
