'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X, ChevronRight, Settings, Check } from 'lucide-react';

const CONSENT_KEY = 'aarambha_cookie_consent';
const CONSENT_VERSION = 'v1';

interface ConsentState {
  version: string;
  acceptedAt: string;
  essential: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

function getStoredConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    // Re-show if version changed or consent is > 6 months old
    if (parsed.version !== CONSENT_VERSION) return null;
    const accepted = new Date(parsed.acceptedAt).getTime();
    const sixMonths = 180 * 24 * 60 * 60 * 1000;
    if (Date.now() - accepted > sixMonths) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(state: Omit<ConsentState, 'version' | 'acceptedAt' | 'essential'>) {
  const consent: ConsentState = {
    ...state,
    essential: true,
    version: CONSENT_VERSION,
    acceptedAt: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [managing, setManaging] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: true, marketing: false, preferences: true });

  useEffect(() => {
    // Delay slightly so it doesn't flash on fast initial render
    const timer = setTimeout(() => {
      if (!getStoredConsent()) setVisible(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    saveConsent({ analytics: true, marketing: true, preferences: true });
    setVisible(false);
  };

  const savePreferences = () => {
    saveConsent(prefs);
    setVisible(false);
  };

  const rejectNonEssential = () => {
    saveConsent({ analytics: false, marketing: false, preferences: false });
    setVisible(false);
  };

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-[9999] p-4 sm:p-6 pointer-events-none"
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="true"
    >
      <div className="max-w-4xl mx-auto bg-[#FCFAF6] border border-[#EDE2D0] rounded-2xl shadow-2xl shadow-[#493B34]/15 overflow-hidden pointer-events-auto">

        {!managing ? (
          /* ── Main Banner ──────────────────────────────────────────────── */
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 sm:p-6">
            <div className="w-10 h-10 rounded-xl bg-[#C65A2E]/10 border border-[#C65A2E]/20 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5 text-[#C65A2E]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#493B34] font-syne">
                We use cookies 🍪
              </p>
              <p className="text-xs text-[#7A6B63] mt-0.5 leading-relaxed font-sans">
                We use essential cookies to make आरंभ work, and optional cookies to improve your travel experience and show relevant pilgrimage offers.{' '}
                <Link href="/legal/cookie-policy" className="text-[#C65A2E] underline hover:text-[#A84820] font-medium transition-colors">
                  Learn more
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
              <button
                onClick={() => setManaging(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#493B34] bg-[#F7F3EB] border border-[#EDE2D0] hover:border-[#C65A2E]/50 hover:bg-white transition-all"
              >
                <Settings className="w-3 h-3 text-[#7A6B63]" />
                Manage
              </button>
              <button
                onClick={rejectNonEssential}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7A6B63] bg-[#F7F3EB] border border-[#EDE2D0] hover:border-[#493B34]/40 hover:text-[#493B34] transition-all"
              >
                Essential Only
              </button>
              <button
                onClick={acceptAll}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#C65A2E] text-white hover:bg-[#A84820] transition-colors shadow-md shadow-[#C65A2E]/20"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          /* ── Preferences Drawer ─────────────────────────────────────── */
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Cookie className="w-4 h-4 text-[#C65A2E]" />
                <h2 className="text-sm font-bold text-[#493B34] font-syne">Cookie Preferences</h2>
              </div>
              <button onClick={() => setManaging(false)} className="text-[#7A6B63] hover:text-[#493B34] p-1 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              {[
                {
                  key: 'essential',
                  label: 'Essential Cookies',
                  description: 'Required for the website to function. Cannot be disabled.',
                  locked: true,
                  value: true,
                },
                {
                  key: 'analytics',
                  label: 'Analytics Cookies',
                  description: 'Help us understand how visitors use our site so we can improve it.',
                  locked: false,
                  value: prefs.analytics,
                },
                {
                  key: 'marketing',
                  label: 'Marketing Cookies',
                  description: 'Used to show you relevant ads and offers on and off our website.',
                  locked: false,
                  value: prefs.marketing,
                },
                {
                  key: 'preferences',
                  label: 'Preference Cookies',
                  description: 'Remember your settings like language and region for a better experience.',
                  locked: false,
                  value: prefs.preferences,
                },
              ].map((item) => (
                <div key={item.key} className="flex items-start gap-4 bg-white border border-[#EDE2D0] rounded-xl px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#493B34]">{item.label}</p>
                    <p className="text-[11px] text-[#7A6B63] mt-0.5">{item.description}</p>
                  </div>
                  {item.locked ? (
                    <div className="shrink-0 flex items-center gap-1 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-[#C65A2E]" />
                      <span className="text-[10px] text-[#C65A2E] font-bold">Always On</span>
                    </div>
                  ) : (
                    <button
                      role="switch"
                      aria-checked={item.value}
                      onClick={() => setPrefs((p) => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                      className={`shrink-0 relative w-9 h-5 rounded-full border-2 transition-colors mt-0.5 ${
                        item.value
                          ? 'bg-[#C65A2E] border-[#C65A2E]'
                          : 'bg-[#EDE2D0] border-[#DDD1BE]'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${
                          item.value ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={rejectNonEssential}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7A6B63] bg-[#F7F3EB] border border-[#EDE2D0] hover:text-[#493B34] transition-all"
              >
                Essential Only
              </button>
              <button
                onClick={savePreferences}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#C65A2E] text-white hover:bg-[#A84820] transition-colors shadow-md shadow-[#C65A2E]/20"
              >
                <Check className="w-3.5 h-3.5" />
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
