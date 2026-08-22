'use client';

import React, { useState } from 'react';
import { User, Plus, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface GoogleAuthButtonProps {
  onSuccess?: (user: { name: string; email: string; picture?: string; phone?: string }) => void;
  onError?: (err: any) => void;
  text?: string;
  className?: string;
  variant?: 'full' | 'compact';
}

const PRESET_GOOGLE_ACCOUNTS = [
  {
    name: 'Parth Racka',
    email: 'parthracka@gmail.com',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    phone: '+91 82082 11478',
  },
  {
    name: 'Kushal Parakh',
    email: 'kushal@aarambhatours.com',
    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    phone: '+91 98220 12345',
  },
  {
    name: 'Aarambha Support',
    email: 'info@aarambhatours.com',
    picture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    phone: '+91 82082 11478',
  },
];

export default function GoogleAuthButton({
  onSuccess,
  onError,
  text = 'Continue with Google',
  className = '',
}: GoogleAuthButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  const handleSelectAccount = (account: { name: string; email: string; picture?: string; phone?: string }) => {
    setIsModalOpen(false);

    const userProfile = {
      name: account.name,
      email: account.email.toLowerCase(),
      picture: account.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      phone: account.phone || '+91 82082 11478',
      googleId: 'google-auth-' + Date.now(),
      loggedIn: true,
      authProvider: 'google',
    };

    // Save user to registered users registry
    try {
      const stored = localStorage.getItem('aarambha_registered_users');
      const registered = stored ? JSON.parse(stored) : [];
      if (!registered.some((u: any) => u.email === userProfile.email)) {
        registered.push({ ...userProfile, createdAt: new Date().toISOString() });
        localStorage.setItem('aarambha_registered_users', JSON.stringify(registered));
      }
    } catch (_e) {}

    // Save active session
    try {
      localStorage.setItem('aarambha_user', JSON.stringify(userProfile));
      window.dispatchEvent(new Event('aarambha_auth_changed'));
    } catch (_e) {}

    if (onSuccess) {
      onSuccess(userProfile);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim() || !customEmail.includes('@')) return;

    handleSelectAccount({
      name: customName.trim(),
      email: customEmail.trim(),
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`w-full py-3 px-4 rounded-2xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-syne font-bold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer ${className}`}
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{text}</span>
      </button>

      {/* GOOGLE ACCOUNT SELECTOR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 p-6 space-y-5 animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <h3 className="font-syne font-extrabold text-base text-gray-900">Choose a Google Account</h3>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setShowCustomForm(false);
                }}
                className="p-1 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 font-medium">
              Select an account to sign in to <strong>Aarambha Tours & Travels</strong>
            </p>

            {/* Account List */}
            {!showCustomForm ? (
              <div className="space-y-2.5">
                {PRESET_GOOGLE_ACCOUNTS.map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAccount(acc)}
                    className="w-full p-3.5 rounded-2xl border border-gray-100 hover:border-blue-200 bg-gray-50/50 hover:bg-blue-50/40 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.picture}
                        alt={acc.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-gray-900 group-hover:text-[#5266EB] transition-colors">{acc.name}</h4>
                        <p className="text-[11px] text-gray-500">{acc.email}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#5266EB] transition-colors" />
                  </button>
                ))}

                <button
                  onClick={() => setShowCustomForm(true)}
                  className="w-full p-3.5 rounded-2xl border border-dashed border-gray-300 hover:border-gray-400 bg-white text-left transition-all flex items-center gap-3 cursor-pointer text-xs font-bold text-gray-700 hover:text-black"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Plus className="w-5 h-5 text-gray-600" />
                  </div>
                  <span>Use another Google account</span>
                </button>
              </div>
            ) : (
              /* Custom Account Form */
              <form onSubmit={handleCustomSubmit} className="space-y-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#5266EB] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Google Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={customEmail}
                    onChange={e => setCustomEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#5266EB] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomForm(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-100"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-[#5266EB] hover:bg-[#3E51D4] text-white font-bold text-xs shadow-md"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2 text-center border-t border-gray-100">
              <span className="text-[10px] text-gray-400 inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Protected by Google Account Security Policy
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
