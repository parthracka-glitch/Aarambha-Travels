import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s — Legal | आरंभ Tours & Travels',
    default: 'Legal Documents — आरंभ Tours & Travels',
  },
  description: 'Legal documents, policies, and compliance information for आरंभ Tours & Travels — including Privacy Policy, Refund Policy, Terms of Service, and more.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'आरंभ Tours & Travels',
  },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
