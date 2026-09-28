import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, ShieldCheck, CheckCircle2, AlertCircle, Loader2, LogOut, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getApiBaseUrl } from '@/api/client';
import { useNavigate } from 'react-router-dom';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      // If user has phone property
      setPhone((user as any).phone || '');
    }
    setError(null);
    setSuccess(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordSection(false);
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid official email address');
      return;
    }

    if (showPasswordSection) {
      if (!currentPassword) {
        setError('Please enter your current password to set a new password');
        return;
      }
      if (newPassword.length < 8) {
        setError('New password must be at least 8 characters long');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match');
        return;
      }
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('crm_token');
      const base = getApiBaseUrl();

      const payload: Record<string, string> = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      };
      if (phone.trim()) payload.phone = phone.trim();
      if (showPasswordSection && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch(`${base}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.detail || 'Failed to update profile');
      }

      // Update auth state
      if (data.user) {
        updateUser(
          {
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          },
          data.access_token
        );
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/login', { replace: true });
  };

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#E2E8F0]">
        
        {/* Header with Warm Cocoa */}
        <div className="px-6 py-4 bg-[#2D1F18] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EDE2D0] text-[#2D1F18] font-bold text-sm flex items-center justify-center shadow-xs">
              {initials}
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">{name || 'Administrator'}</h3>
              <p className="text-[11px] text-[#EDE2D0] flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C65A2E]" />
                <span className="capitalize">{user?.role === 'viewer' ? 'Viewer / Read-Only' : 'Super Administrator'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-[#2D1F18] mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full pl-9 pr-3 py-2 bg-[#F8EFEA] border border-[#EDE2D0] rounded-lg text-xs text-[#2D1F18] focus:bg-white focus:border-[#C65A2E] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-[#2D1F18] mb-1">
              Official Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your official email address"
                required
                className="w-full pl-9 pr-3 py-2 bg-[#F8EFEA] border border-[#EDE2D0] rounded-lg text-xs text-[#2D1F18] focus:bg-white focus:border-[#C65A2E] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-[#2D1F18] mb-1">
              Mobile Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full pl-9 pr-3 py-2 bg-[#F8EFEA] border border-[#EDE2D0] rounded-lg text-xs text-[#2D1F18] focus:bg-white focus:border-[#C65A2E] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Change Password Toggle */}
          <div className="pt-2 border-t border-[#EDE2D0]">
            <button
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="text-xs font-bold text-[#C65A2E] hover:text-[#B24E25] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{showPasswordSection ? 'Cancel Password Change' : 'Change Password'}</span>
            </button>
          </div>

          {/* Password Fields */}
          {showPasswordSection && (
            <div className="space-y-3 p-3 bg-[#F8EFEA] rounded-lg border border-[#EDE2D0] animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#2D1F18]">Security Credentials</span>
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="text-[11px] text-[#756B63] hover:text-[#2D1F18] flex items-center gap-1"
                >
                  {showPasswords ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPasswords ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#756B63] mb-1">
                  Current Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full px-3 py-1.5 bg-white border border-[#EDE2D0] rounded-md text-xs text-[#2D1F18] focus:border-[#C65A2E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#756B63] mb-1">
                  New Password (min 8 characters)
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 8 characters)"
                  className="w-full px-3 py-1.5 bg-white border border-[#EDE2D0] rounded-md text-xs text-[#2D1F18] focus:border-[#C65A2E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#756B63] mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-1.5 bg-white border border-[#EDE2D0] rounded-md text-xs text-[#2D1F18] focus:border-[#C65A2E] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#EDE2D0] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#493B34] hover:text-[#2D1F18] bg-[#F8EFEA] hover:bg-[#EDE2D0] rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold text-white bg-[#C65A2E] hover:bg-[#B24E25] rounded-md transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{loading ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
