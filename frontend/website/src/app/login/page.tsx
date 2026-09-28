import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthCard from '@/components/auth/AuthCard';

export const metadata = {
  title: 'Log In — Aarambha Tours & Car Rentals',
  description: 'Log in to your Aarambha account to manage luxury car rentals, tour packages, and travel reservations.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#493B34] flex flex-col justify-between relative overflow-hidden font-sans">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 pt-24 sm:pt-28">
        <AuthCard initialMode="login" />
      </main>

      <Footer />
    </div>
  );
}
