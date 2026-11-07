import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, LogIn, AlertCircle, ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FC] flex items-center justify-center p-4 font-sans select-none pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#101F40] p-3 shadow-md mb-3 border border-[#1C315A]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3569F6] to-[#60A5FA] flex items-center justify-center text-white font-black text-lg">
              A
            </div>
          </div>
          <h1 className="text-[#17233D] font-extrabold text-2xl tracking-tight flex items-center justify-center gap-2">
            <span>Aarambha</span>
            <span className="text-[#3569F6] text-xs font-bold uppercase tracking-wider bg-[#EDF3FF] border border-[#3569F6]/20 px-2 py-0.5 rounded-lg">
              CRM Portal
            </span>
          </h1>
          <p className="text-xs font-semibold text-[#77839A] mt-1 tracking-wider uppercase">
            Enterprise Operations Management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#E8ECF4] rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="mb-5 pb-4 border-b border-[#E8ECF4]">
            <h2 className="text-base font-bold text-[#17233D]">Sign In to Portal</h2>
            <p className="text-xs text-[#77839A] mt-0.5">
              Enter your official administrative credentials to access operations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#17233D] mb-1">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#77839A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aarambhatravels.in"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F5F7FC] border border-[#E8ECF4] rounded-xl text-base sm:text-xs text-[#17233D] placeholder-[#77839A] focus:bg-white focus:border-[#3569F6] focus:ring-2 focus:ring-[#3569F6]/20 focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-[#17233D] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#77839A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#F5F7FC] border border-[#E8ECF4] rounded-xl text-base sm:text-xs text-[#17233D] placeholder-[#77839A] focus:bg-white focus:border-[#3569F6] focus:ring-2 focus:ring-[#3569F6]/20 focus:outline-none transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77839A] hover:text-[#17233D] transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full min-h-[46px] flex items-center justify-center gap-2 py-3 bg-[#101F40] hover:bg-[#1C315A] disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs mt-3 cursor-pointer tap-highlight-transparent touch-manipulation active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <LogIn className="w-4 h-4 text-white" />
              )}
              <span>{loading ? 'Authenticating...' : 'Sign In to CRM'}</span>
            </button>
          </form>

          {/* Security badge */}
          <div className="mt-5 pt-4 border-t border-[#E8ECF4] flex items-center justify-center gap-1.5 text-[#77839A] text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-End Encrypted Session</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-[#77839A] mt-6 space-y-0.5">
          <p>© 2026 Aarambha Tours &amp; Self-Drive Rentals</p>
          <p className="text-[10px] text-[#77839A]/70">
            Secure Admin Portal for Authorized Personnel Only
          </p>
        </div>

      </div>
    </div>
  );
}
