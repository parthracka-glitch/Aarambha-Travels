import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

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
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#171721] flex items-center justify-center px-4 font-sans">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#5266EB]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-[#9CB4E8]/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white p-1 border border-white/20 mb-3 shadow-2xl overflow-hidden">
            <img src="/logo.jpeg" alt="आरंभ Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-[#EDEDF3] font-black text-2xl tracking-tight flex items-center justify-center gap-2">
            <span className="text-[#5266EB] font-['Rozha_One','Mukta',serif] text-3xl font-normal">आरंभ</span>
            <span>CRM</span>
          </h1>
          <p className="text-[#AFB2CE] text-xs mt-1">Tours, Travels & Fleet Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-[#272735]/70 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-red-300 text-xs font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#EDEDF3] uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@aarambhatravels.in"
                className="w-full px-4 py-3 bg-[#171721] border border-gray-700/80 rounded-xl text-[#EDEDF3] font-medium text-sm placeholder-gray-400 focus:outline-none focus:border-[#5266EB] focus:ring-1 focus:ring-[#5266EB] transition-all caret-white shadow-inner"
                style={{ color: '#ffffff' }}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#EDEDF3] uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 bg-[#171721] border border-gray-700/80 rounded-xl text-[#EDEDF3] font-medium text-sm placeholder-gray-400 focus:outline-none focus:border-[#5266EB] focus:ring-1 focus:ring-[#5266EB] transition-all caret-white shadow-inner"
                  style={{ color: '#ffffff' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#5266EB] hover:bg-[#3E51D4] disabled:bg-[#5266EB]/40 disabled:cursor-not-allowed text-[#EDEDF3] font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-[#5266EB]/20 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Hint */}
          <div className="mt-6 pt-5 border-t border-white/8 space-y-1.5 text-center">
            <p className="text-[11px] text-gray-400 font-medium">
              Super Admin 1: <code className="text-white bg-white/10 px-1.5 py-0.5 rounded">admin@aarambhatravels.in</code> &middot; <code className="text-gray-300">Admin@123</code>
            </p>
            <p className="text-[11px] text-gray-400 font-medium">
              Super Admin 2: <code className="text-white bg-white/10 px-1.5 py-0.5 rounded">admin2@aarambhatravels.in</code> &middot; <code className="text-gray-300">Admin@123</code>
            </p>
            <p className="text-[11px] text-gray-400 font-medium">
              Viewer: <code className="text-white bg-white/10 px-1.5 py-0.5 rounded">viewer1@aarambhatravels.in</code> &middot; <code className="text-gray-300">Viewer@123</code>
            </p>
          </div>
        </div>

        <div className="text-center text-[11px] text-gray-500 mt-6 space-y-1">
          <p>© 2026 आरंभ Tours & Self-Drive Rentals</p>
          <p className="text-[10px] text-gray-400">
            Engineered by <strong className="text-gray-300 tracking-wider uppercase font-semibold">Nirvanaa Studios</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
