import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/api/settings.api';
import { Loader } from '@/components/common/Loader';
import { QRCodeSVG } from 'qrcode.react';
import { Save, CheckCircle2, QrCode, Shield, Phone, Mail, Building, Clock, Copy, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsView() {
  const { user } = useAuth();
  const isViewer = user?.role === 'viewer';

  const [settings, setSettings] = useState<Record<string, any>>({
    business_name: 'Aarambha Tours & Travels + Self-Drive Rentals',
    contact_phone: '+91 82082 11478',
    contact_email: 'info@aarambhatravels.in',
    upi_id: '8208211478@ybl',
    upi_payee_name: 'Aarambh Travels',
    verification_timeframe: '2-4 hours',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    getSettings()
      .then((d) => {
        setSettings((prev) => ({ ...prev, ...d }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  if (loading) return <Loader />;

  const sampleQrUri = `upi://pay?pa=${encodeURIComponent(settings.upi_id || '8208211478@ybl')}&pn=${encodeURIComponent(
    settings.upi_payee_name || 'Aarambh Travels'
  )}&am=500&tn=SAMPLE-PREVIEW&cu=INR`;

  return (
    <div className="space-y-8 select-none max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#000000] tracking-tight flex items-center gap-2">
            System & Payment Settings
            {isViewer && (
              <span className="text-[10px] font-bold bg-[#9CB4E8]/20 text-[#171721] border border-[#9CB4E8]/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                View Only
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Configure live UPI payment parameters, business contact details, and account verification rules.
          </p>
        </div>

        {!isViewer && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] rounded-full text-xs font-bold shadow-md shadow-[#5266EB]/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saveSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : saveSuccess ? 'Settings Saved!' : 'Save All Changes'}</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
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
                  Enterprise Profile & Contact Channels
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
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors"
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
    </div>
  );
}
