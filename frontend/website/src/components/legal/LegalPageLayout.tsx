'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ChevronRight, FileText, Clock, Calendar } from 'lucide-react';

export interface TocEntry {
  id: string;
  label: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle?: string;
  lastUpdated: string;
  effectiveDate: string;
  breadcrumb?: string;
  toc: TocEntry[];
  children: React.ReactNode;
}

export default function LegalPageLayout({
  title,
  subtitle,
  lastUpdated,
  effectiveDate,
  breadcrumb,
  toc,
  children,
}: LegalPageLayoutProps) {
  const [activeId, setActiveId] = useState<string>(toc[0]?.id || '');
  const [mobileOpen, setMobileOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Scroll-spy: observe all section headings
  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    });

    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current!.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [toc]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 96;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-[#5266EB] selection:text-white">
      <Navbar vertical="home" />

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#171721] overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #5266EB 0%, transparent 60%), radial-gradient(circle at 80% 20%, #D3592B 0%, transparent 50%)' }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-14 sm:py-18">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-[#AFB2CE] mb-6 font-medium tracking-wide">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-[#5266EB]" />
            <Link href="/legal" className="hover:text-white transition-colors">Legal</Link>
            {breadcrumb && (
              <>
                <ChevronRight className="w-3 h-3 text-[#5266EB]" />
                <span className="text-[#EDEDF3]">{breadcrumb}</span>
              </>
            )}
          </nav>

          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-[#5266EB]/15 border border-[#5266EB]/30 items-center justify-center shrink-0 mt-1">
              <FileText className="w-5 h-5 text-[#5266EB]" />
            </div>
            <div>
              <p className="font-['Syne',sans-serif] text-[10px] font-black tracking-[0.25em] text-[#5266EB] uppercase mb-2">
                आरंभ Legal Documents
              </p>
              <h1 className="font-['Syne',sans-serif] text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-3 text-sm text-[#AFB2CE] max-w-2xl leading-relaxed">{subtitle}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-5 text-[11px] text-[#AFB2CE]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-[#5266EB]" />
                  Last updated: <strong className="text-[#EDEDF3]">{lastUpdated}</strong>
                </span>
                <span className="text-[#272735]">•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#5266EB]" />
                  Effective: <strong className="text-[#EDEDF3]">{effectiveDate}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile TOC Toggle ───────────────────────────────────────────── */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-6 py-3 text-xs font-semibold text-gray-700 font-['Syne',sans-serif]"
        >
          <span>Table of Contents</span>
          <ChevronRight className={`w-4 h-4 text-[#5266EB] transition-transform ${mobileOpen ? 'rotate-90' : ''}`} />
        </button>
        {mobileOpen && (
          <nav className="bg-[#FAFAFC] border-t border-gray-100 px-6 py-3 space-y-1">
            {toc.map((item, i) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                  activeId === item.id
                    ? 'bg-[#5266EB]/10 text-[#5266EB] font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-[10px] font-bold text-[#5266EB] font-['Syne',sans-serif] w-5 shrink-0">§{i + 1}</span>
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* ── Body: Sidebar + Content ──────────────────────────────────────── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-10 lg:py-14">
        <div className="flex gap-10 lg:gap-14 items-start">

          {/* Sticky Sidebar TOC (desktop) */}
          <aside className="hidden lg:block w-56 xl:w-64 shrink-0 sticky top-24 self-start">
            <p className="font-['Syne',sans-serif] text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-4">
              Contents
            </p>
            <nav className="space-y-0.5">
              {toc.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[11px] font-medium transition-all duration-150 ${
                    activeId === item.id
                      ? 'bg-[#5266EB]/10 text-[#5266EB] border-l-2 border-[#5266EB]'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100 border-l-2 border-transparent'
                  }`}
                >
                  <span className={`text-[9px] font-black font-['Syne',sans-serif] w-4 shrink-0 ${
                    activeId === item.id ? 'text-[#5266EB]' : 'text-gray-300'
                  }`}>
                    §{i + 1}
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Print link */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => window.print()}
                className="text-[11px] text-gray-400 hover:text-[#5266EB] transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print / Save PDF
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 prose-sm max-w-none">
            <div className="space-y-0">
              {children}
            </div>
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
}
