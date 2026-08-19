'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, ArrowRight, CheckCircle2, ShieldCheck, Car, MapPin, Eye, EyeOff } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';

interface AuthCardProps {
  initialMode?: 'login' | 'signup';
  onSuccess?: () => void;
}

export default function AuthCard({ initialMode = 'login', onSuccess }: AuthCardProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/');
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onSuccess, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Check or save to local users registry
      let registeredUsers: any[] = [];
      try {
        const stored = localStorage.getItem('aarambha_registered_users');
        if (stored) registeredUsers = JSON.parse(stored);
      } catch (_e) {}

      if (mode === 'signup') {
        const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (existing) {
          setError('An account with this email already exists. Please log in.');
          return;
        }

        const newUser = {
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password: password,
          createdAt: new Date().toISOString(),
        };

        registeredUsers.push(newUser);
        try {
          localStorage.setItem('aarambha_registered_users', JSON.stringify(registeredUsers));
        } catch (_e) {}

        const userProfile = {
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          loggedIn: true,
        };

        try {
          localStorage.setItem('aarambha_user', JSON.stringify(userProfile));
          window.dispatchEvent(new Event('aarambha_auth_changed'));
        } catch (_e) {}

        setIsSuccess(true);
        if (onSuccess) {
          setTimeout(onSuccess, 1000);
        }
      } else {
        // Login mode
        const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (existing && existing.password && existing.password !== password) {
          setError('Incorrect password. Please try again.');
          return;
        }

        const userProfile = {
          name: existing ? existing.name : (fullName || email.split('@')[0] || 'Valued Member'),
          email: email.trim().toLowerCase(),
          phone: existing ? existing.phone : (phone || '+91 82082 11478'),
          loggedIn: true,
        };

        try {
          localStorage.setItem('aarambha_user', JSON.stringify(userProfile));
          window.dispatchEvent(new Event('aarambha_auth_changed'));
        } catch (_e) {}

        setIsSuccess(true);
        if (onSuccess) {
          setTimeout(onSuccess, 1000);
        }
      }
    }, 600);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto my-4 sm:my-8 px-2 sm:px-4 select-none">
      
      {/* Soft minimal ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Main Minimal Luxury Split Card Container */}
      <div className="relative bg-[#0d0d10] rounded-3xl shadow-2xl overflow-hidden border border-white/[0.08] flex flex-col md:flex-row min-h-[540px]">
        
        {/* ─── LEFT SIDE: MINIMAL HERO CAR SHOWCASE ─── */}
        <div className="md:w-1/2 bg-[#09090c] relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-white/[0.08] min-h-[260px] md:min-h-[540px]">
          
          {/* Top Brand & Tag */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-full">
                <Car className="w-3.5 h-3.5 text-gray-300" /> Self-Drive & Tours
              </span>
            </div>
            <h3 className="font-syne text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
              Drive The Extraordinary<span className="text-[#FF3B30]">.</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Explore Maharashtra with verified self-drive rentals and curated pilgrimage tours.
            </p>
          </div>

          {/* SWIFT CAR SHOWCASE - CLEAN & MINIMAL (NO OVERLAY TEXT/PRICE) */}
          <div className="relative z-20 my-auto py-3 flex items-center justify-center">
            <div className="relative w-full max-w-[360px] rounded-2xl overflow-hidden border border-white/[0.08] bg-black/40 shadow-lg">
              <div className="relative w-full h-44 sm:h-52 overflow-hidden">
                <img
                  src="/images/car_rentals_bg.jpg?v=2"
                  alt="Aarambha Self Drive Fleet"
                  className="w-full h-full object-cover object-center filter brightness-100 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
              </div>
            </div>
          </div>

          {/* Bottom Minimal Trust Highlights */}
          <div className="relative z-10 grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.08] text-[11px] text-gray-400 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gray-300 shrink-0" />
              <span>Verified & Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-300 shrink-0" />
              <span>Doorstep Delivery</span>
            </div>
          </div>

        </div>

        {/* ─── RIGHT SIDE: CLEAN MINIMAL FORM ─── */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-[#0e0e12] text-white relative">
          
          <div>
            {/* Header: Logo & Branding */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 ring-1 ring-white/20 shadow shrink-0">
                  <img src="/images/logo.jpeg" alt="आरंभ Logo" className="w-full h-full object-contain rounded-lg" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 font-syne uppercase tracking-widest block">
                    Welcome to
                  </span>
                  <h2 className="font-['Amita','Yatra_One','Rozha_One',serif] text-2xl font-bold text-white tracking-wide flex items-baseline gap-1 leading-none">
                    <span>आरंभ</span>
                    <span className="text-[#FF3B30] font-bold font-syne">.</span>
                  </h2>
                </div>
              </div>

              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-full">
                Portal
              </span>
            </div>

            {/* Minimal Segmented Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-5">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-2 rounded-lg font-syne font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 py-2 rounded-lg font-syne font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2 animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isSuccess ? (
              /* Success Screen */
              <div className="py-8 text-center space-y-4 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-syne text-xl font-bold text-white">
                    {mode === 'login' ? 'Welcome Back' : 'Account Created'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {mode === 'login' ? 'You have successfully signed in.' : 'Your member profile is ready.'}
                  </p>
                  <p className="text-[11px] font-medium text-emerald-400 pt-1">
                    Redirecting to home...
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSuccess) onSuccess();
                      else router.push('/');
                    }}
                    className="px-5 py-2.5 bg-white text-black hover:bg-gray-200 text-xs font-bold font-syne rounded-xl transition-all inline-flex items-center gap-2"
                  >
                    <span>Continue to Home</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[10.5px] font-medium text-gray-400 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 font-normal focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all text-xs"
                      />
                      <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10.5px] font-medium text-gray-400 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 font-normal focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all text-xs"
                    />
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-[10.5px] font-medium text-gray-400 mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 font-normal focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all text-xs"
                      />
                      <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10.5px] font-medium text-gray-400">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => alert('Password reset link sent to your email address.')}
                        className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 font-normal focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all text-xs"
                    />
                    <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-300 absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#FF3B30] hover:bg-red-600 active:scale-[0.99] text-white font-syne font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>{isLoading ? 'Processing...' : mode === 'login' ? 'Log In' : 'Create Account'}</span>
                    {!isLoading && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>

              </form>
            )}

            {/* Divider */}
            <div className="my-4 flex items-center justify-center relative">
              <div className="w-full border-t border-white/[0.08]" />
              <span className="bg-[#0e0e12] px-2.5 text-[10px] font-medium text-gray-500 uppercase tracking-widest absolute">
                or
              </span>
            </div>

            {/* Google Sign-In Active Button */}
            <div>
              <GoogleAuthButton
                text={mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
                onSuccess={() => {
                  setIsSuccess(true);
                  if (onSuccess) {
                    setTimeout(onSuccess, 800);
                  }
                }}
                onError={(err) => setError(typeof err === 'string' ? err : 'Google Sign-In failed')}
                className="w-full !rounded-xl !bg-white/[0.04] hover:!bg-white/[0.08] !border-white/[0.08] !text-gray-200 hover:!border-white/20 !py-2.5"
              />
            </div>
          </div>

          {/* Bottom Switch Link */}
          <div className="pt-4 text-center text-xs text-gray-400 font-normal">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-white hover:text-[#FF3B30] hover:underline"
                >
                  Sign up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-white hover:text-[#FF3B30] hover:underline"
                >
                  Log in
                </button>
              </span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
