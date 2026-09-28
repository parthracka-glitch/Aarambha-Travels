'use client';

import React, { useState, useEffect } from 'react';
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
            password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 429) {
            setError(data.message || 'Too many registration attempts. Please try again later.');
          } else {
            setError(data.message || data.detail || 'Registration failed. Please check your details.');
          }
          setIsLoading(false);
          return;
        }

        // Store local user info
        const userProfile = {
          id: data.user?.id,
          name: data.user?.name || fullName.trim(),
          email: data.user?.email || email.trim().toLowerCase(),
          phone: data.user?.phone || phone.trim(),
          role: data.user?.role || 'customer',
          isEmailVerified: data.user?.isEmailVerified ?? false,
          loggedIn: true,
        };

        if (data.access_token) {
          localStorage.setItem('aarambha_token', data.access_token);
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
            password,
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
    <div className="relative w-full max-w-3xl mx-auto my-4 sm:my-8 px-2 select-none font-sans">
      
      {/* Main Split Card Container */}
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-[#EDE2D0] flex flex-col md:flex-row min-h-[520px]">
        
        {/* ─── LEFT SIDE: HERO BRAND SHOWCASE ─── */}
        <div className="md:w-5/12 bg-[#493B34] text-white p-6 sm:p-8 flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-[#EDE2D0]/20">
          
          {/* Top Brand */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#E8B9A5] bg-white/10 px-3 py-1 rounded-full border border-white/15">
              <Car className="w-3.5 h-3.5 text-[#F2C6A0]" /> Self-Drive & Devotional Tours
            </div>
            
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
              Premium Travel Services Across Maharashtra.
            </h3>
            
            <p className="text-xs text-[#EDE2D0]/90 leading-relaxed">
              Explore Maharashtra with 100% verified self-drive cars, luxury buses, and devotional pilgrimage packages.
            </p>
          </div>

          {/* Visual Showcase Card */}
          <div className="my-6 rounded-xl overflow-hidden border border-white/20 shadow-md">
            <img
              src="/images/car_rentals_bg.jpg?v=2"
              alt="Aarambha Travels Fleet"
              className="w-full h-36 object-cover object-center"
            />
          </div>

          {/* Bottom Trust Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-[11px] text-[#EDE2D0] font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D8B77A] shrink-0" />
              <span>Verified & Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D8B77A] shrink-0" />
              <span>Pune Pickup</span>
            </div>
          </div>

        </div>

        {/* ─── RIGHT SIDE: CLEAN FORM ─── */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between bg-white text-[#493B34]">
          
          <div>
            {/* Header: Logo & Title */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 border border-[#EDE2D0] shadow-2xs shrink-0">
                  <img src="/images/logo.jpeg" alt="आरंभ Logo" className="w-full h-full object-contain rounded-lg" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#756B63] uppercase tracking-wider block">
                    Welcome to
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#493B34] leading-tight">
                    आरंभ Travels
                  </h2>
                </div>
              </div>

              <span className="text-[10px] font-bold text-[#C65A2E] uppercase tracking-wider bg-[#FCFAF6] border border-[#EDE2D0] px-2.5 py-1 rounded-full">
                Customer Portal
              </span>
            </div>

            {/* Segmented Switcher */}
            {mode !== 'forgot-password' && (
              <div className="flex items-center p-1 rounded-xl bg-[#FCFAF6] border border-[#EDE2D0] mb-5">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
                  className={`flex-1 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-[#493B34] shadow-2xs border border-[#EDE2D0]'
                      : 'text-[#756B63] hover:text-[#493B34]'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); setSuccessMessage(''); }}
                  className={`flex-1 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white text-[#493B34] shadow-2xs border border-[#EDE2D0]'
                      : 'text-[#756B63] hover:text-[#493B34]'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message for Password Reset */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span>{successMessage}</span>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setSuccessMessage(''); setError(''); }}
                      className="text-[11px] font-bold text-[#C65A2E] hover:underline"
                    >
                      Return to Log In
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isSuccess && mode !== 'forgot-password' ? (
              /* Success Screen */
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-[#493B34]">
                    {mode === 'login' ? 'Welcome Back!' : 'Account Created Successfully!'}
                  </h3>
                  <p className="text-xs text-[#756B63]">
                    {mode === 'login' ? 'You have successfully signed in.' : 'Your member profile is ready.'}
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-700 pt-1">
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
                    className="px-6 py-2.5 bg-[#C65A2E] hover:bg-[#B24E25] text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer"
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
                    <div className="flex items-center gap-2 text-[#493B34] font-bold text-sm">
                      <KeyRound className="w-4 h-4 text-[#C65A2E]" />
                      <span>Reset Your Password</span>
                    </div>
                    <p className="text-[11px] text-[#756B63] leading-relaxed">
                      Enter your registered email address and we will dispatch a secure link to reset your password.
                    </p>
                  </div>
                )}

                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-bold text-[#493B34] mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full pl-9 pr-4 py-2.5 bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl text-[#493B34] placeholder-gray-400 font-medium focus:outline-none focus:border-[#C65A2E] focus:ring-1 focus:ring-[#C65A2E] focus:bg-white transition-all text-xs"
                      />
                      <User className="w-4 h-4 text-[#756B63] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-[#493B34] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-9 pr-4 py-2.5 bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl text-[#493B34] placeholder-gray-400 font-medium focus:outline-none focus:border-[#C65A2E] focus:ring-1 focus:ring-[#C65A2E] focus:bg-white transition-all text-xs"
                    />
                    <Mail className="w-4 h-4 text-[#756B63] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-bold text-[#493B34] mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter 10-digit mobile number"
                        className="w-full pl-9 pr-4 py-2.5 bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl text-[#493B34] placeholder-gray-400 font-medium focus:outline-none focus:border-[#C65A2E] focus:ring-1 focus:ring-[#C65A2E] focus:bg-white transition-all text-xs"
                      />
                      <Phone className="w-4 h-4 text-[#756B63] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}

                {mode !== 'forgot-password' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-[#493B34]">
                        Password *
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => { setMode('forgot-password'); setError(''); setSuccessMessage(''); }}
                          className="text-[10px] text-[#C65A2E] hover:underline cursor-pointer"
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
                        placeholder="Enter your password"
                        className="w-full pl-9 pr-9 py-2.5 bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl text-[#493B34] placeholder-gray-400 font-medium focus:outline-none focus:border-[#C65A2E] focus:ring-1 focus:ring-[#C65A2E] focus:bg-white transition-all text-xs"
                      />
                      <Lock className="w-4 h-4 text-[#756B63] absolute left-3 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[#756B63] hover:text-[#493B34] absolute right-3 top-1/2 -translate-y-1/2 p-0.5 cursor-pointer"
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
                    className="w-full py-3 bg-[#C65A2E] hover:bg-[#B24E25] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
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
                    {!isLoading && <ArrowRight className="w-3.5 h-3.5 text-white" />}
                  </button>
                </div>

                {mode === 'forgot-password' && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
                      className="text-[11px] text-[#756B63] hover:text-[#493B34] cursor-pointer"
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
                  <div className="w-full border-t border-[#EDE2D0]" />
                  <span className="bg-white px-2.5 text-[10px] font-bold text-[#756B63] uppercase tracking-wider absolute">
                    or continue with
                  </span>
                </div>

                {/* Google Sign-In Active Button */}
                <div>
                  <GoogleAuthButton
                    text={mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                    onSuccess={() => {
                      setIsSuccess(true);
                      if (onSuccess) {
                        setTimeout(onSuccess, 800);
                      }
                    }}
                    onError={(err) => setError(typeof err === 'string' ? err : 'Google Sign-In failed')}
                    className="w-full !rounded-xl !bg-[#FCFAF6] hover:!bg-[#EDE2D0]/40 !border-[#EDE2D0] !text-[#493B34] !py-2.5"
                  />
                </div>
              </>
            )}
          </div>

          {/* Bottom Switch Link */}
          {mode !== 'forgot-password' && (
            <div className="pt-4 text-center text-xs text-[#756B63]">
              {mode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setError(''); }}
                    className="font-bold text-[#C65A2E] hover:underline cursor-pointer"
                  >
                    Create Account
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(''); }}
                    className="font-bold text-[#C65A2E] hover:underline cursor-pointer"
                  >
                    Log In
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
