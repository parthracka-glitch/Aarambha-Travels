import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import './globals.css';

const CookieConsentBanner = dynamic(
  () => import('@/components/legal/CookieConsentBanner'),
  { ssr: false }
);


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#171721',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'आरंभ (AARAMBHA) — Premium Tours, Travels & Self-Drive Rentals',
  description: 'Experience your journey, your car, your way with आरंभ Tours, Travels & Car Rentals. Browse our impressive fleet of luxury vehicles and handpicked domestic tour packages.',
  keywords: ['Aarambha car rental', 'आरंभ टूर अँड ट्रॅव्हल्स', 'self-drive car rentals', 'tour packages India', 'convertible rental', 'SUV rental'],
  icons: {
    icon: [
      { url: '/images/aarambha_logo.png' },
      { url: '/favicon.png' },
      { url: '/favicon.ico' },
      { url: '/logo.png' }
    ],
    apple: '/images/aarambha_logo.png',
    shortcut: '/favicon.ico',
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
        <link rel="icon" type="image/png" href="/images/aarambha_logo.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className="antialiased selection:bg-[#5266EB] selection:text-white">
        {children}
        <CookieConsentBanner />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
