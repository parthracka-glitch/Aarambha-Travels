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
    <div className="min-h-screen bg-[#0d0d11] flex items-center justify-center px-4 font-sans">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white p-1 border border-white/20 mb-3 shadow-2xl overflow-hidden">
            <img src="/logo.jpeg" alt="आरंभ Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-white font-black text-2xl tracking-tight flex items-center justify-center gap-2">
            <span className="text-[#FF3B30] font-['Rozha_One','Mukta',serif] text-3xl font-normal">आरंभ</span>
            <span>CRM</span>
          </h1>
          <p className="text-gray-400 text-xs mt-1">Tours, Travels & Fleet Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
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
              <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider">
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
                className="w-full px-4 py-3 bg-[#1e2230] border border-gray-700/80 rounded-xl text-white font-medium text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all caret-white shadow-inner"
                style={{ color: '#ffffff' }}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider">
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
                  className="w-full px-4 py-3 pr-11 bg-[#1e2230] border border-gray-700/80 rounded-xl text-white font-medium text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all caret-white shadow-inner"
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
              className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 mt-2"
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
          <div className="mt-6 pt-5 border-t border-white/8">
            <p className="text-center text-[11px] text-gray-500 font-medium">
              Super Admin: <code className="text-gray-400">admin@aarambhatravels.in</code>
            </p>
            <p className="text-center text-[11px] text-gray-500 font-medium mt-1">
              Viewer: <code className="text-gray-400">viewer1@aarambhatravels.in</code> · <code className="text-gray-400">Viewer@123</code>
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
