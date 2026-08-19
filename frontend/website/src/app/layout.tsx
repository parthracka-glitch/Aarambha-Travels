import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'आरंभ (AARAMBHA) — Premium Tours, Travels & Self-Drive Rentals',
  description: 'Experience your journey, your car, your way with आरंभ Tours, Travels & Car Rentals. Browse our impressive fleet of luxury vehicles and handpicked domestic tour packages.',
  keywords: ['Aarambha car rental', 'आरंभ टूर अँड ट्रॅव्हल्स', 'self-drive car rentals', 'tour packages India', 'convertible rental', 'SUV rental'],
  icons: {
    icon: [
      { url: '/images/logo.jpeg' },
      { url: '/favicon.ico' }
    ],
    apple: '/images/logo.jpeg',
    shortcut: '/images/logo.jpeg',
  },
  openGraph: {
    title: 'आरंभ (AARAMBHA) — Tours, Travels & Car Rentals',
    description: 'Your Journey, Your Car, Your Way with आरंभ Tours & Travels.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amita:wght@400;700&family=Gotu&family=Mukta:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Rozha+One&family=Syne:wght@500;600;700;800&family=Tiro+Devanagari+Marathi:ital@0;1&family=Yatra+One&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/jpeg" href="/images/logo.jpeg" />
      </head>
      <body className="antialiased selection:bg-[#FF3B30] selection:text-white">
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
