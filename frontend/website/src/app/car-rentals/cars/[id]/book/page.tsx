'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CarBookingCheckoutRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const carId = params?.id as string;

  useEffect(() => {
    if (carId) {
      router.replace(`/car-rentals/cars/${carId}?book=true`);
    } else {
      router.replace('/car-rentals/cars');
    }
  }, [carId, router]);

  return (
    <div className="min-h-screen bg-[#FCFAF6] flex items-center justify-center font-sans text-xs text-[#756B63]">
      <span>Loading reservation portal...</span>
    </div>
  );
}
