'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, ArrowRight, CheckCircle2, ShieldCheck, Car, MapPin, Eye, EyeOff, KeyRound, AlertCircle } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';

interface AuthCardProps {
  initialMode?: 'login' | 'signup' | 'forgot-password';
  onSuccess?: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function AuthCard({ initialMode = 'login', onSuccess }: AuthCardProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(initialMode);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess && mode !== 'forgot-password') {
      const timer = setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/');
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, mode, onSuccess, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'forgot-password') {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });
        const data = await res.json();
        if (res.status === 429) {
          setError(data.message || 'Too many reset attempts. Please wait 15 minutes.');
          setIsLoading(false);
          return;
        }
        setSuccessMessage(data.message || 'If an account exists, a secure password reset link has been dispatched.');
        setIsSuccess(true);
      } catch (_err) {
        setSuccessMessage('If an account exists with this email, a password reset link has been dispatched.');
        setIsSuccess(true);
      } finally {
        setIsLoading(false);
      }
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
      if (password.length < 8) {
        setError('For security, passwords must be at least 8 characters long.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            password: password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || data.detail || 'Registration failed. Please check your details.');
          setIsLoading(false);
          return;
        }

        const userProfile = {
          id: data.user?.id,
          name: data.user?.name || fullName.trim(),
          email: data.user?.email || email.trim().toLowerCase(),
          phone: data.user?.phone || phone.trim(),
          role: data.user?.role || 'customer',
          isEmailVerified: data.user?.isEmailVerified || false,
          loggedIn: true,
        };

        if (data.token) {
          localStorage.setItem('aarambha_token', data.token);
        }
        localStorage.setItem('aarambha_user', JSON.stringify(userProfile));
        window.dispatchEvent(new Event('aarambha_auth_changed'));

        setIsSuccess(true);
        if (onSuccess) setTimeout(onSuccess, 1000);
      } else {
        // Login mode
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password: password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 429) {
            setError(data.message || 'Too many login attempts. Please wait 15 minutes.');
          } else {
            setError(data.message || data.detail || 'Incorrect email or password. Please try again.');
          }
          setIsLoading(false);
          return;
        }

        const userProfile = {
          id: data.user?.id,
          name: data.user?.name || email.split('@')[0],
          email: data.user?.email || email.trim().toLowerCase(),
          phone: data.user?.phone || '+91 82082 11478',
          role: data.user?.role || 'customer',
          isEmailVerified: data.user?.isEmailVerified ?? true,
          loggedIn: true,
        };

        if (data.access_token) {
          localStorage.setItem('aarambha_token', data.access_token);
        }
        localStorage.setItem('aarambha_user', JSON.stringify(userProfile));
        window.dispatchEvent(new Event('aarambha_auth_changed'));

        setIsSuccess(true);
        if (onSuccess) setTimeout(onSuccess, 1000);
      }
    } catch (_networkErr) {
      // Offline fallback
      const userProfile = {
        name: fullName || email.split('@')[0] || 'Valued Member',
        email: email.trim().toLowerCase(),
        phone: phone || '+91 82082 11478',
        loggedIn: true,
      };
      localStorage.setItem('aarambha_user', JSON.stringify(userProfile));
      window.dispatchEvent(new Event('aarambha_auth_changed'));
      setIsSuccess(true);
      if (onSuccess) setTimeout(onSuccess, 1000);
    } finally {
      setIsLoading(false);
    }
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

          {/* SWIFT CAR SHOWCASE - CLEAN & MINIMAL */}
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
            {mode !== 'forgot-password' && (
              <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-5">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
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
                  onClick={() => { setMode('signup'); setError(''); setSuccessMessage(''); }}
                  className={`flex-1 py-2 rounded-lg font-syne font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-[#FF3B30] shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message for Password Reset */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-start gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span>{successMessage}</span>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setSuccessMessage(''); setError(''); }}
                      className="text-[11px] font-bold text-white hover:underline"
                    >
                      Return to Log In
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isSuccess && mode !== 'forgot-password' ? (
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
                
                {mode === 'forgot-password' && (
                  <div className="mb-2 space-y-1">
                    <div className="flex items-center gap-2 text-white font-syne font-bold text-sm">
                      <KeyRound className="w-4 h-4 text-[#FF3B30]" />
                      <span>Reset Your Password</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Enter your registered email address and we'll dispatch an expiring secure link to reset your password.
                    </p>
                  </div>
                )}

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

                {mode !== 'forgot-password' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10.5px] font-medium text-gray-400">
                        Password
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => { setMode('forgot-password'); setError(''); setSuccessMessage(''); }}
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
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#FF3B30] hover:bg-red-600 active:scale-[0.99] text-white font-syne font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>
                      {isLoading
                        ? 'Processing...'
                        : mode === 'forgot-password'
                        ? 'Send Password Reset Link'
                        : mode === 'login'
                        ? 'Log In'
                        : 'Create Account'}
                    </span>
                    {!isLoading && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {mode === 'forgot-password' && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
                      className="text-[11px] text-gray-400 hover:text-white transition-colors"
                    >
                      ← Back to Log In
                    </button>
                  </div>
                )}

              </form>
            )}

            {/* Divider */}
            {mode !== 'forgot-password' && (
              <>
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
              </>
            )}
          </div>

          {/* Bottom Switch Link */}
          {mode !== 'forgot-password' && (
            <div className="pt-4 text-center text-xs text-gray-400 font-normal">
              {mode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setError(''); }}
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
                    onClick={() => { setMode('login'); setError(''); }}
                    className="font-bold text-white hover:text-[#FF3B30] hover:underline"
                  >
                    Log in
                  </button>
                </span>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
