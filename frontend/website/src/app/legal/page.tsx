import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Shield, Cookie, RotateCcw, AlertTriangle, Eye, Lock, Bug,
  FileWarning, Users, Database, FileText, ChevronRight, Scale,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Legal Documents & Policies | आरंभ Tours & Travels',
  description: 'Find all legal documents for आरंभ Tours & Travels — privacy policy, refund policy, cookie policy, security policy, terms, and more.',
};

const LEGAL_DOCS = [
  {
    href: '/terms',
    icon: FileText,
    color: 'indigo',
    title: 'Rental & Tour Policies',
    desc: 'Comprehensive terms for all self-drive rentals, tour packages, deposits, and booking rules.',
    updated: 'Aug 2026',
    badge: 'Core',
  },
  {
    href: '/terms-and-conditions',
    icon: Scale,
    color: 'indigo',
    title: 'Standard Terms & Conditions',
    desc: 'General website terms of use, service agreements, and customer obligations.',
    updated: 'Aug 2026',
    badge: 'Core',
  },
  {
    href: '/legal/privacy-policy',
    icon: Shield,
    color: 'blue',
    title: 'Privacy Policy',
    desc: 'How we collect, use, store, and protect your personal data under the IT Act 2000.',
    updated: 'Aug 2026',
    badge: 'Privacy',
  },
  {
    href: '/legal/cookie-policy',
    icon: Cookie,
    color: 'amber',
    title: 'Cookie Policy',
    desc: 'What cookies we set, why we use them, and how to manage your preferences.',
    updated: 'Aug 2026',
    badge: 'Privacy',
  },
  {
    href: '/legal/refund-policy',
    icon: RotateCcw,
    color: 'emerald',
    title: 'Refund & Cancellation Policy',
    desc: 'Cancellation windows, refund percentages, deposit rules, and force majeure clauses.',
    updated: 'Aug 2026',
    badge: 'Financial',
  },
  {
    href: '/legal/disclaimer',
    icon: AlertTriangle,
    color: 'amber',
    title: 'Disclaimer',
    desc: 'Liability limitations for itinerary changes, road conditions, and third-party services.',
    updated: 'Aug 2026',
    badge: 'Legal',
  },
  {
    href: '/legal/accessibility',
    icon: Eye,
    color: 'purple',
    title: 'Accessibility Statement',
    desc: 'Our commitment to WCAG 2.1 AA compliance and alternative contact methods.',
    updated: 'Aug 2026',
    badge: 'Compliance',
  },
  {
    href: '/legal/security-policy',
    icon: Lock,
    color: 'slate',
    title: 'Security Policy',
    desc: 'How customer data is encrypted, secured, and protected against breaches.',
    updated: 'Aug 2026',
    badge: 'Security',
  },
  {
    href: '/legal/responsible-disclosure',
    icon: Bug,
    color: 'red',
    title: 'Responsible Disclosure',
    desc: 'How to report security vulnerabilities to us responsibly — with safe harbor protection.',
    updated: 'Aug 2026',
    badge: 'Security',
  },
  {
    href: '/legal/acceptable-use',
    icon: FileWarning,
    color: 'orange',
    title: 'Acceptable Use Policy',
    desc: 'Prohibited uses of our platform, age requirements, and consequences of violations.',
    updated: 'Aug 2026',
    badge: 'Legal',
  },
  {
    href: '/legal/community-guidelines',
    icon: Users,
    color: 'teal',
    title: 'Community Guidelines',
    desc: 'Conduct standards for reviews, interactions with staff and drivers, and social media.',
    updated: 'Aug 2026',
    badge: 'Community',
  },
  {
    href: '/legal/data-processing',
    icon: Database,
    color: 'violet',
    title: 'Data Processing Agreement',
    desc: 'Controller/processor definitions, sub-processor list, and breach notification obligations (B2B).',
    updated: 'Aug 2026',
    badge: 'Enterprise',
  },
  {
    href: '/nda',
    icon: FileText,
    color: 'slate',
    title: 'Non-Disclosure Agreement',
    desc: 'Confidentiality obligations for business partners and corporate clients.',
    updated: 'Aug 2026',
    badge: 'Legal',
  },
];

const COLOR_MAP: Record<string, { card: string; icon: string; badge: string }> = {
  indigo: { card: 'border-[#5266EB]/20 hover:border-[#5266EB]/50 hover:shadow-[#5266EB]/10', icon: 'bg-[#5266EB]/10 text-[#5266EB]', badge: 'bg-[#5266EB]/10 text-[#5266EB]' },
  blue:   { card: 'border-blue-100 hover:border-blue-300 hover:shadow-blue-50',   icon: 'bg-blue-50 text-blue-600',   badge: 'bg-blue-50 text-blue-600' },
  amber:  { card: 'border-amber-100 hover:border-amber-300 hover:shadow-amber-50', icon: 'bg-amber-50 text-amber-600', badge: 'bg-amber-50 text-amber-600' },
  emerald:{ card: 'border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-50', icon: 'bg-emerald-50 text-emerald-600', badge: 'bg-emerald-50 text-emerald-600' },
  purple: { card: 'border-purple-100 hover:border-purple-300 hover:shadow-purple-50', icon: 'bg-purple-50 text-purple-600', badge: 'bg-purple-50 text-purple-600' },
  slate:  { card: 'border-slate-200 hover:border-slate-400 hover:shadow-slate-50',  icon: 'bg-slate-100 text-slate-600',  badge: 'bg-slate-100 text-slate-600' },
  red:    { card: 'border-red-100 hover:border-red-300 hover:shadow-red-50',     icon: 'bg-red-50 text-red-600',     badge: 'bg-red-50 text-red-600' },
  orange: { card: 'border-orange-100 hover:border-orange-300 hover:shadow-orange-50', icon: 'bg-orange-50 text-orange-600', badge: 'bg-orange-50 text-orange-600' },
  teal:   { card: 'border-teal-100 hover:border-teal-300 hover:shadow-teal-50',   icon: 'bg-teal-50 text-teal-600',   badge: 'bg-teal-50 text-teal-600' },
  violet: { card: 'border-violet-100 hover:border-violet-300 hover:shadow-violet-50', icon: 'bg-violet-50 text-violet-600', badge: 'bg-violet-50 text-violet-600' },
};

export default function LegalHubPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans">
      <Navbar vertical="home" />

      {/* Hero */}
      <section className="relative bg-[#171721] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle at 15% 60%, #5266EB 0%, transparent 55%), radial-gradient(circle at 85% 20%, #D3592B 0%, transparent 45%)' }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16 sm:py-20 text-center">
          <p className="font-['Syne',sans-serif] text-[10px] font-black tracking-[0.3em] text-[#5266EB] uppercase mb-4">
            आरंभ Legal & Compliance
          </p>
          <h1 className="font-['Syne',sans-serif] text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Legal Documents
          </h1>
          <p className="mt-4 text-sm text-[#AFB2CE] max-w-xl mx-auto leading-relaxed">
            Transparency is core to आरंभ. Find all our policies, agreements, and compliance documents here — written in plain language.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-[#AFB2CE]">
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <Shield className="w-3 h-3 text-[#5266EB]" /> Governed by Indian IT Act 2000
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <Lock className="w-3 h-3 text-[#5266EB]" /> GDPR-Aligned Data Practices
            </span>
          </div>
        </div>
      </section>

      {/* Document Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-14">
        <p className="text-[10px] font-black font-['Syne',sans-serif] tracking-[0.2em] text-gray-400 uppercase mb-8">
          All Documents — {LEGAL_DOCS.length} total
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LEGAL_DOCS.map((doc) => {
            const colors = COLOR_MAP[doc.color] || COLOR_MAP.slate;
            const Icon = doc.icon;
            return (
              <Link
                key={doc.href}
                href={doc.href}
                className={`group bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-200 p-5 flex flex-col gap-4 ${colors.card}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors.icon}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                    {doc.badge}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="font-['Syne',sans-serif] text-sm font-bold text-[#111111] group-hover:text-[#5266EB] transition-colors leading-snug">
                    {doc.title}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{doc.desc}</p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-100 pt-3">
                  <span>Updated {doc.updated}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#5266EB] group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Contact strip */}
        <div className="mt-14 bg-[#171721] rounded-2xl p-6 sm:p-8 text-center">
          <p className="font-['Syne',sans-serif] text-sm font-bold text-white mb-1">Have a legal question?</p>
          <p className="text-xs text-[#AFB2CE] mb-4">Contact our compliance team — we respond within 2 business days.</p>
          <a
            href="mailto:support@aarambhatravels.in"
            className="inline-flex items-center gap-2 bg-[#5266EB] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#3E51D4] transition-colors"
          >
            support@aarambhatravels.in
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
