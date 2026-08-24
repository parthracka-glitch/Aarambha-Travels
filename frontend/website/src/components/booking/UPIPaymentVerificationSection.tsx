'use client';

import React, { useState } from 'react';
import { QrCode, Copy, Check, ExternalLink, ShieldCheck, ArrowRight, Upload, Phone, AlertCircle, Smartphone } from 'lucide-react';
import { SHARED_BUS_CONTACT } from '@/constants/busData';
import { SHARED_CAR_CONTACT } from '@/constants/carsData';

interface UPIPaymentVerificationSectionProps {
  bookingCode: string;
  itemTitle: string;
  itemType: 'tour' | 'car';
  totalPrice: number;
  depositAmount: number;
  customerName: string;
  customerPhone: string;
  onConfirmPayment: (data: { utrNumber: string; paymentScreenshot?: string }) => void;
  onBack?: () => void;
  isSubmitting?: boolean;
}

export default function UPIPaymentVerificationSection({
  bookingCode,
  itemTitle,
  itemType,
  totalPrice,
  depositAmount,
  customerName,
  customerPhone,
  onConfirmPayment,
  onBack,
  isSubmitting = false,
}: UPIPaymentVerificationSectionProps) {
  // UPI Configuration
  const upiId = itemType === 'tour' ? '9067617451@ybl' : '7820802985@ybl';
  const payeeName = 'Aarambha Tours and Travels';
  const whatsappPhone = itemType === 'tour' ? SHARED_BUS_CONTACT.whatsappPhone : SHARED_CAR_CONTACT.whatsappPhone;

  // Standard NPCI UPI URI
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${depositAmount}&cu=INR&tn=${encodeURIComponent(bookingCode)}`;
  const gpayUrl = `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${depositAmount}&cu=INR&tn=${encodeURIComponent(bookingCode)}`;
  const phonepeUrl = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${depositAmount}&cu=INR&tn=${encodeURIComponent(bookingCode)}`;
  const paytmUrl = `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${depositAmount}&cu=INR&tn=${encodeURIComponent(bookingCode)}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiUrl)}&margin=10`;

  const [copied, setCopied] = useState(false);
  const [utr, setUtr] = useState('');
  const [utrError, setUtrError] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState<string>('');
  const [screenshotName, setScreenshotName] = useState<string>('');

  const balanceRemaining = Math.max(0, totalPrice - depositAmount);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB. Please upload a smaller image.');
      return;
    }

    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendWhatsAppProof = () => {
    const msg = `*AARAMBHA ADVANCE PAYMENT PROOF*%0A` +
      `🔖 *Booking Ref:* ${bookingCode}%0A` +
      `📦 *Package/Vehicle:* ${itemTitle}%0A` +
      `👤 *Customer:* ${customerName} (${customerPhone})%0A` +
      `💰 *Deposit Amount:* ₹${depositAmount.toLocaleString('en-IN')}%0A` +
      `🔢 *UTR / Ref No:* ${utr.trim() || 'Attaching screenshot'}%0A%0A` +
      `_I have completed the advance transfer. Please verify and confirm my booking._`;
    window.open(`https://wa.me/91${whatsappPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUtrError('');

    const cleanUtr = utr.replace(/\s+/g, '');
    if (!cleanUtr || cleanUtr.length < 8) {
      setUtrError('Please enter a valid 12-digit UPI UTR / Transaction Reference number.');
      return;
    }

    onConfirmPayment({
      utrNumber: cleanUtr,
      paymentScreenshot: screenshotBase64 || undefined,
    });
  };

  return (
    <div className="space-y-4">
      {/* ─── 1. PAYMENT SUMMARY HEADER CARD ─── */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#171721] to-[#252538] text-white border border-white/10 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#5266EB]/30 text-[#9CB4E8] border border-[#5266EB]/40">
            Step 2: Advance Deposit Payment
          </span>
          <span className="text-[11px] font-mono text-gray-300 font-bold">
            Ref: {bookingCode}
          </span>
        </div>

        <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
          <div>
            <span className="text-[11px] text-[#AFB2CE] block">Advance Deposit Payable Now:</span>
            <span className="font-syne text-2xl sm:text-3xl font-black text-emerald-400">
              ₹{depositAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 block">Total Fare: ₹{totalPrice.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-amber-300 font-bold block">
              Balance on Pickup: ₹{balanceRemaining.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* ─── 2. OFFICIAL PHONEPE UPI QR CODE & 1-CLICK MOBILE LAUNCH ─── */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <h4 className="font-syne font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-[#5266EB]" /> Scan Official UPI QR Scanner
          </h4>
          <span className="text-[9px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            0% Gateway Fee • Instant Bank Transfer
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
          {/* Official Uploaded PhonePe QR Scanner Graphic */}
          <div className="relative p-2 bg-[#FAFAFC] border-2 border-dashed border-[#5f259f]/40 rounded-2xl shadow-inner shrink-0 flex flex-col items-center max-w-[200px]">
            <img
              src="/images/aarambha_upi_qr.jpeg"
              alt="Official PhonePe QR Scanner - Sham Umakant Suryawanshi"
              className="w-44 h-auto rounded-xl object-contain bg-white shadow-xs"
            />
            <div className="text-center mt-2 px-1">
              <span className="text-[10px] font-black text-gray-900 block font-syne uppercase tracking-wider">
                SHAM UMAKANT SURYAWANSHI
              </span>
              <span className="text-[9px] font-bold text-[#5f259f] block">
                PhonePe • GPay • Paytm • BHIM
              </span>
            </div>
          </div>

          {/* Quick 1-Click Mobile Launch Apps */}
          <div className="flex-1 w-full space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/80 text-purple-950 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 font-syne">
                  Payee Account Name
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Verified Merchant
                </span>
              </div>
              <p className="font-syne font-bold text-xs text-gray-900">
                SHAM UMAKANT SURYAWANSHI
              </p>
              <p className="text-[11px] text-gray-600 leading-snug">
                Scan using any UPI App on your phone to transfer advance deposit of <strong className="text-emerald-700 font-bold">₹{depositAmount.toLocaleString('en-IN')}</strong>.
              </p>
            </div>

            <p className="text-[11px] text-gray-600 leading-snug">
              Paying from your mobile phone? Tap below to open directly in your UPI app:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={phonepeUrl}
                className="py-2.5 px-3 rounded-xl bg-[#5f259f]/10 hover:bg-[#5f259f]/20 border border-[#5f259f]/30 text-[#5f259f] font-bold text-[11px] font-syne flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
              >
                <span>PhonePe</span>
                <ExternalLink className="w-3 h-3 text-[#5f259f]/60" />
              </a>

              <a
                href={gpayUrl}
                className="py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 font-bold text-[11px] font-syne flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
              >
                <span>Google Pay</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>

              <a
                href={paytmUrl}
                className="py-2.5 px-3 rounded-xl bg-[#00baf2]/10 hover:bg-[#00baf2]/20 border border-[#00baf2]/30 text-[#002e6e] font-bold text-[11px] font-syne flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
              >
                <span>Paytm UPI</span>
                <ExternalLink className="w-3 h-3 text-[#00baf2]" />
              </a>

              <a
                href={upiUrl}
                className="py-2.5 px-3 rounded-xl bg-[#5266EB] hover:bg-[#3E51D4] text-white font-bold text-[11px] font-syne flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
              >
                <Smartphone className="w-3 h-3" />
                <span>Any UPI App</span>
              </a>
            </div>

            {/* Copyable UPI ID Box */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-200 text-[11px]">
              <div className="truncate mr-2">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">UPI ID</span>
                <span className="font-mono font-bold text-gray-900">{upiId}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-sm text-[10px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-gray-500" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. UTR ENTRY & PROOF SUBMISSION FORM ─── */}
      <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-syne font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Enter 12-Digit UPI Ref / UTR Number *
          </label>
          <span className="text-[10px] text-gray-400 font-medium">Found in payment receipt</span>
        </div>

        <div className="space-y-1.5">
          <input
            type="text"
            required
            maxLength={16}
            placeholder="e.g. 423819283719 (12-Digit UTR)"
            value={utr}
            onChange={(e) => {
              setUtr(e.target.value.replace(/[^0-9a-zA-Z]/g, ''));
              setUtrError('');
            }}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-bold tracking-wider text-gray-900 focus:bg-white focus:outline-none focus:border-[#5266EB]"
          />
          {utrError && (
            <p className="text-[11px] text-red-600 font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{utrError}</span>
            </p>
          )}
        </div>

        {/* Optional Screenshot Upload or WhatsApp Proof */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <label className="p-2 rounded-xl border border-dashed border-gray-300 hover:border-[#5266EB] bg-gray-50 text-gray-600 flex items-center justify-center gap-1.5 cursor-pointer text-[11px] font-bold transition-all">
            <Upload className="w-3.5 h-3.5 text-gray-500" />
            <span className="truncate">{screenshotName ? screenshotName : 'Attach Payment Screenshot'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleScreenshotUpload}
            />
          </label>

          <button
            type="button"
            onClick={handleSendWhatsAppProof}
            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Send Receipt via WhatsApp</span>
          </button>
        </div>

        {/* Security Note */}
        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
          <span className="text-amber-600 font-bold">ℹ️</span>
          <p className="leading-tight">
            <strong>Two-Stage Protected Verification:</strong> Your booking will initially register as <em>"Provisional (Verification Pending)"</em> and will officially confirm once our accounts team matches your UTR with the incoming bank credit.
          </p>
        </div>

        {/* Form Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs font-syne transition-all cursor-pointer"
            >
              Back
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs font-syne uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>{isSubmitting ? 'Verifying & Submitting...' : 'Submit Payment UTR & Complete Booking'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
