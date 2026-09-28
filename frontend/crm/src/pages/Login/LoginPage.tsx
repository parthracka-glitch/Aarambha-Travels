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
    <div className="min-h-screen bg-[#FCFAF6] flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2D1F18] p-2 shadow-md mb-3">
            <img
              src="/images/aarambha_logo.png"
              alt="Aarambha Travels Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-[#2D1F18] font-extrabold text-2xl tracking-tight flex items-center justify-center gap-1.5">
            <span>आरंभ Travels</span>
            <span className="text-[#C65A2E] text-xs font-bold uppercase tracking-wider bg-[#C65A2E]/10 border border-[#C65A2E]/30 px-2 py-0.5 rounded-md">
              CRM Portal
            </span>
          </h1>
          <p className="text-xs font-semibold text-[#756B63] mt-1 uppercase tracking-widest">
            Enterprise Operations Management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#EDE2D0] rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="mb-5 pb-4 border-b border-[#EDE2D0]">
            <h2 className="text-base font-bold text-[#2D1F18]">Sign In to Portal</h2>
            <p className="text-xs text-[#756B63] mt-0.5">
              Enter your official administrative credentials to access operations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#2D1F18] mb-1">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F8EFEA] border border-[#EDE2D0] rounded-lg text-xs text-[#2D1F18] placeholder-[#756B63] focus:bg-white focus:border-[#C65A2E] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-[#2D1F18] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#F8EFEA] border border-[#EDE2D0] rounded-lg text-xs text-[#2D1F18] placeholder-[#756B63] focus:bg-white focus:border-[#C65A2E] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
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
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#C65A2E] hover:bg-[#B24E25] disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-all shadow-xs border border-black/10 mt-3 cursor-pointer"
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
          <div className="mt-5 pt-4 border-t border-[#EDE2D0] flex items-center justify-center gap-1.5 text-gray-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-End Encrypted Session</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-[#756B63] mt-6 space-y-0.5">
          <p>© 2026 Aarambha Tours & Self-Drive Rentals</p>
          <p className="text-[10px] text-[#756B63]/70">
            Secure Admin Portal for Authorized Personnel Only
          </p>
        </div>

      </div>
    </div>
  );
}
