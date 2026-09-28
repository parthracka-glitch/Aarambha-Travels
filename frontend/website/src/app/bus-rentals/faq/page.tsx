'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BusRentalFAQRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/faq');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FCFAF6] flex items-center justify-center font-sans text-xs text-[#756B63]">
      <span>Redirecting to FAQ Center...</span>
    </div>
  );
}
