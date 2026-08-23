import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings, updateAdminProfile } from '@/api/settings.api';
import { Loader } from '@/components/common/Loader';
import {
  Save,
  CheckCircle2,
  QrCode,
  Shield,
  Phone,
  Mail,
  Building,
  Clock,
  Copy,
  Check,
  Loader2,
  User,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAutoRefresh } from '@/hooks/useRealtimeSync';

export default function SettingsView() {
  const { user, updateUser } = useAuth();
  const isViewer = user?.role === 'viewer';

  const [activeTab, setActiveTab] = useState<'profile' | 'system'>('profile');

  // ─── 1. System Settings State ──────────────────────────────────────────
  const [settings, setSettings] = useState<Record<string, any>>({
    business_name: 'Aarambha Tours & Travels + Self-Drive Rentals',
    contact_phone: '+91 82082 11478',
    contact_email: 'info@aarambhatravels.in',
    upi_id: '8208211478@ybl',
    upi_payee_name: 'Aarambh Travels',
    verification_timeframe: '2-4 hours',
  });

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // ─── 2. Personal Profile & Password State ──────────────────────────────
  const [profileName, setProfileName] = useState(user?.name || 'Kushal Parakh');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'admin@aarambhatravels.in');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
    }
  }, [user]);

  const loadSettings = React.useCallback(() => {
    getSettings()
      .then((d) => {
        setSettings((prev) => ({ ...prev, ...d }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useAutoRefresh(loadSettings, ['SETTINGS_UPDATED'], 8000);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;
    setSavingSettings(true);
    setSaveSettingsSuccess(false);
    try {
      await updateSettings(settings);
      setSaveSettingsSuccess(true);
      setTimeout(() => setSaveSettingsSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save system settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!profileName.trim()) {
      setProfileError('Display name cannot be empty');
      return;
    }
    if (!profileEmail.trim()) {
      setProfileError('Login email cannot be empty');
      return;
    }

    if (newPassword) {
      if (!currentPassword) {
        setProfileError('Please enter your current password to set a new password');
        return;
      }
      if (newPassword.length < 6) {
        setProfileError('New password must be at least 6 characters long');
        return;
      }
      if (newPassword !== confirmPassword) {
        setProfileError('New password and confirm password do not match');
        return;
      }
    }

    setSavingProfile(true);

    try {
      const payload: any = {
        name: profileName.trim(),
        email: profileEmail.trim().toLowerCase(),
      };

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res: any = await updateAdminProfile(payload);

      if (res?.user) {
        updateUser(res.user, res.access_token);
      } else {
        updateUser({
          name: payload.name,
          email: payload.email,
          role: user?.role || 'superadmin',
        });
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setProfileSuccess(res?.message || 'Your profile & login credentials were updated successfully!');
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update personal profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 select-none max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#000000] tracking-tight flex items-center gap-2">
            Settings &amp; Account Preferences
            {isViewer && (
              <span className="text-[10px] font-bold bg-[#9CB4E8]/20 text-[#171721] border border-[#9CB4E8]/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                View Only
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Manage your personal login credentials, display name, business settings, and UPI payment channels.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100/90 rounded-2xl border border-gray-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-[#5266EB] shadow-sm border border-gray-200/60'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'system'
                ? 'bg-white text-[#5266EB] shadow-sm border border-gray-200/60'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>UPI &amp; Business</span>
          </button>
        </div>
      </div>

      {/* ─── TAB 1: PERSONAL PROFILE & LOGIN CREDENTIALS ──────────── */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Success & Error Banners */}
            {profileSuccess && (
              <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-800 text-xs font-semibold animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-700 text-xs font-semibold animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            {/* Card 1: Display Name & Login ID */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-[#5266EB]/10 text-[#5266EB] flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-syne font-bold text-sm text-[#000000]">
                    Personal Identity &amp; Login ID
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Change your admin display name and login email address.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="e.g. Kushal Parakh"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#5266EB] focus:bg-white"
                  />
                  <span className="text-[10px] text-gray-400 block">Appears in topbar avatar and CRM reports.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">
                    Login Email / Admin ID *
                  </label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="e.g. admin@aarambhatravels.in"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-[#000000] focus:outline-none focus:border-[#5266EB] focus:bg-white"
                  />
                  <span className="text-[10px] text-gray-400 block">Use this new email to log into the CRM portal.</span>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-gray-700 block">
                    Assigned Portal Role
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {user?.role === 'viewer' ? 'Viewer (Read-Only Access)' : 'Super Admin (Full Administrative Authority)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Change Password */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-syne font-bold text-sm text-[#000000]">
                    Security &amp; Change Password
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Leave blank if you do not wish to change your password.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current password"
                      className="w-full px-3.5 py-2.5 pr-9 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#000000] focus:outline-none focus:border-[#5266EB] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min 6)"
                      className="w-full px-3.5 py-2.5 pr-9 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#000000] focus:outline-none focus:border-[#5266EB] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-3.5 py-2.5 pr-9 bg-gray-50 border border-gray-200 rounded-xl text-xs text-[#000000] focus:outline-none focus:border-[#5266EB] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Save Profile Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-3 bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] rounded-2xl text-xs font-bold shadow-lg shadow-[#5266EB]/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                {savingProfile ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{savingProfile ? 'Updating Profile…' : 'Save Personal Profile'}</span>
              </button>
            </div>

          </div>

          {/* Right Column: Profile Summary Preview Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-5 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#5266EB] to-indigo-700 text-white flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-[#5266EB]/20 border-2 border-white">
                {profileName
                  ? profileName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  : 'KP'}
              </div>

              <div className="space-y-1">
                <h4 className="font-syne font-bold text-base text-[#000000]">
                  {profileName || 'Kushal Parakh'}
                </h4>
                <p className="text-xs text-gray-500 font-mono">{profileEmail || 'admin@aarambhatravels.in'}</p>
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#5266EB] bg-[#5266EB]/10 px-2.5 py-0.5 rounded-full mt-1">
                  {user?.role === 'viewer' ? 'Viewer' : 'Super Admin'}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-400 text-left space-y-2 leading-relaxed">
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                  <Shield className="w-3.5 h-3.5 text-[#5266EB]" />
                  <span>Session Protected (JWT 7-Day)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Realtime Synchronization Active</span>
                </div>
              </div>
            </div>
          </div>

        </form>
      )}

      {/* ─── TAB 2: SYSTEM & PAYMENT GATEWAY SETTINGS ─────────────── */}
      {activeTab === 'system' && (
        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Columns: Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 1: UPI Gateway / Manual QR Settings */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-[#5266EB]/10 text-[#5266EB] flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-syne font-bold text-sm text-[#000000]">
                    Direct UPI QR Code Configuration
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Controls the live dynamic QR deep links generated during customer checkout.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">
                    Aarambh Business UPI ID (VPA) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isViewer}
                    value={settings.upi_id || ''}
                    onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                    placeholder="e.g. 8208211478@ybl"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-[#000000] focus:outline-none focus:border-[#5266EB] focus:bg-white"
                  />
                  <span className="text-[10px] text-gray-400 block">Must be an active merchant/personal UPI handle.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">
                    UPI Payee Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isViewer}
                    value={settings.upi_payee_name || ''}
                    onChange={(e) => setSettings({ ...settings, upi_payee_name: e.target.value })}
                    placeholder="e.g. Aarambh Travels"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#000000] focus:outline-none focus:border-[#5266EB] focus:bg-white"
                  />
                  <span className="text-[10px] text-gray-400 block">Shown inside banking apps (GPay, PhonePe).</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">
                    Verification Estimate Timeframe
                  </label>
                  <input
                    type="text"
                    disabled={isViewer}
                    value={settings.verification_timeframe || ''}
                    onChange={(e) => setSettings({ ...settings, verification_timeframe: e.target.value })}
                    placeholder="e.g. 2-4 hours"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-[#000000] focus:outline-none focus:border-[#5266EB] focus:bg-white"
                  />
                  <span className="text-[10px] text-gray-400 block">Promised turn-around for customer UTR checks.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">
                    Payment Mode Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value="UPI QR (Direct Bank Transfer)"
                    className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-500"
                  />
                  <span className="text-[10px] text-gray-400 block">Fixed to zero-gateway manual verification mode.</span>
                </div>
              </div>
            </div>

            {/* Card 2: Business & Contact Info */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-[#9CB4E8]/20 text-[#171721] flex items-center justify-center">
                  <Building className="w-5 h-5 text-[#5266EB]" />
                </div>
                <div>
                  <h4 className="font-syne font-bold text-sm text-[#000000]">
                    Enterprise Profile &amp; Contact Channels
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Appears on customer PDF invoices and booking confirmation notices.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-gray-700 block">Business Legal Name</label>
                  <input
                    type="text"
                    disabled={isViewer}
                    value={settings.business_name || ''}
                    onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-[#000000] focus:outline-none focus:border-[#5266EB] focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">Support Phone Number</label>
                  <input
                    type="text"
                    disabled={isViewer}
                    value={settings.contact_phone || ''}
                    onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-[#000000] focus:outline-none focus:border-[#5266EB] focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-700 block">Support Email</label>
                  <input
                    type="email"
                    disabled={isViewer}
                    value={settings.contact_email || ''}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-[#000000] focus:outline-none focus:border-[#5266EB] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Save System Settings Button */}
            {!isViewer && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-3 bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] rounded-2xl text-xs font-bold shadow-lg shadow-[#5266EB]/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {savingSettings ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : saveSettingsSuccess ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{savingSettings ? 'Saving Settings…' : saveSettingsSuccess ? 'Settings Saved!' : 'Save System Settings'}</span>
                </button>
              </div>
            )}

          </div>

          {/* Right 1 Column: Live UPI QR Preview Box */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5266EB] font-syne bg-[#5266EB]/10 px-3 py-1 rounded-full border border-[#5266EB]/20">
                LIVE CUSTOMER QR PREVIEW
              </span>

              <div className="max-w-[200px] mx-auto p-2 bg-white rounded-2xl border-2 border-[#171721] shadow-md overflow-hidden">
                <img
                  src="/images/phonepe-qr.jpg"
                  alt="PhonePe Scanner"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <strong className="block text-xs font-syne text-[#000000]">SHAM UMAKANT SURYAWANSHI</strong>
                <span className="text-[11px] text-gray-500 block">{settings.upi_payee_name || 'Aarambh Travels'}</span>
                <span className="text-xs font-mono text-[#5266EB] font-bold block">{settings.upi_id || '8208211478@ybl'}</span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(settings.upi_id)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors cursor-pointer"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUpi ? 'Copied' : 'Copy UPI ID'}</span>
              </button>

              <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-400 text-left space-y-1 leading-relaxed">
                <p>💡 <strong>Note:</strong> When you update the UPI ID here, all live website customer checkout screens will dynamically generate QR codes with this updated ID.</p>
              </div>
            </div>
          </div>

        </form>
      )}

    </div>
  );
}
