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
    <div className="space-y-4 font-sans text-xs">
      {/* ─── 1. PAYMENT SUMMARY HEADER CARD ─── */}
      <div className="p-4 rounded-xl bg-[#493B34] text-white border border-[#EDE2D0]/20 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8B9A5]">
            Step 2: Advance Deposit Payment
          </span>
          <span className="text-[11px] font-mono text-[#EDE2D0] font-bold">
            Ref: {bookingCode}
          </span>
        </div>

        <div className="flex items-baseline justify-between border-t border-white/10 pt-2.5">
          <div>
            <span className="text-[10px] text-[#EDE2D0] block">Advance Deposit Payable Now:</span>
            <span className="font-serif text-2xl font-bold text-[#E8B9A5]">
              ₹{depositAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#EDE2D0] block">Total: ₹{totalPrice.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-[#E8B9A5] font-semibold block">
              Balance on Departure: ₹{balanceRemaining.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* ─── 2. OFFICIAL UPI QR CODE & 1-CLICK MOBILE LAUNCH ─── */}
      <div className="p-4 rounded-xl bg-white border border-[#EDE2D0] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-[#493B34] flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-[#C65A2E]" /> Scan UPI QR Code
          </h4>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            0% Gateway Fee • Instant Verification
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
          {/* Official PhonePe QR Scanner Graphic */}
          <div className="relative p-2 bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl shrink-0 flex flex-col items-center max-w-[180px]">
            <img
              src="/images/aarambha_upi_qr.jpeg"
              alt="Official PhonePe QR Scanner - Aarambha Travels"
              className="w-36 h-auto rounded-lg object-contain bg-white shadow-xs"
            />
            <div className="text-center mt-1.5 px-1">
              <span className="text-[10px] font-bold text-[#493B34] block uppercase">
                SHAM UMAKANT SURYAWANSHI
              </span>
              <span className="text-[9px] font-medium text-[#756B63] block">
                PhonePe • GPay • Paytm • BHIM
              </span>
            </div>
          </div>

          {/* Quick 1-Click Mobile Launch Apps */}
          <div className="flex-1 w-full space-y-2 text-xs">
            <div className="p-2 rounded-lg bg-[#F8EFEA] border border-[#E8B9A5]/50 text-[#493B34] space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C65A2E]">
                  Verified Merchant Account
                </span>
                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                  Aarambha Verified
                </span>
              </div>
              <p className="font-semibold text-xs text-[#493B34]">
                SHAM UMAKANT SURYAWANSHI
              </p>
            </div>

            <p className="text-[11px] text-[#756B63]">
              Tap below to pay directly using installed UPI application:
            </p>

            <div className="grid grid-cols-2 gap-1.5">
              <a
                href={phonepeUrl}
                className="py-2 px-2.5 rounded-lg bg-[#FCFAF6] hover:bg-[#F8EFEA] border border-[#EDE2D0] text-[#493B34] font-bold text-[11px] flex items-center justify-center gap-1 transition-all"
              >
                <span>PhonePe</span>
                <ExternalLink className="w-3 h-3 text-[#756B63]" />
              </a>

              <a
                href={gpayUrl}
                className="py-2 px-2.5 rounded-lg bg-[#FCFAF6] hover:bg-[#F8EFEA] border border-[#EDE2D0] text-[#493B34] font-bold text-[11px] flex items-center justify-center gap-1 transition-all"
              >
                <span>Google Pay</span>
                <ExternalLink className="w-3 h-3 text-[#756B63]" />
              </a>

              <a
                href={paytmUrl}
                className="py-2 px-2.5 rounded-lg bg-[#FCFAF6] hover:bg-[#F8EFEA] border border-[#EDE2D0] text-[#493B34] font-bold text-[11px] flex items-center justify-center gap-1 transition-all"
              >
                <span>Paytm</span>
                <ExternalLink className="w-3 h-3 text-[#756B63]" />
              </a>

              <a
                href={upiUrl}
                className="py-2 px-2.5 rounded-lg bg-[#C65A2E] hover:bg-[#B24E25] text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-all shadow-xs"
              >
                <Smartphone className="w-3 h-3" />
                <span>Any UPI App</span>
              </a>
            </div>

            {/* Copyable UPI ID Box */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#FCFAF6] border border-[#EDE2D0] text-[11px]">
              <div className="truncate mr-2">
                <span className="text-[9px] text-[#756B63] block uppercase font-bold">UPI ID</span>
                <span className="font-mono font-bold text-[#493B34]">{upiId}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="px-2 py-1 rounded bg-white border border-[#EDE2D0] text-[#493B34] font-semibold hover:bg-[#F8EFEA] transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-xs text-[10px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#756B63]" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. UTR ENTRY & PROOF SUBMISSION FORM ─── */}
      <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-white border border-[#EDE2D0] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-bold text-xs text-[#493B34] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Enter 12-Digit UPI UTR / Transaction Reference *
          </label>
          <span className="text-[10px] text-[#756B63]">Found in payment receipt</span>
        </div>

        <div className="space-y-1">
          <input
            type="text"
            required
            maxLength={18}
            placeholder="Enter 12-digit UTR reference number (e.g. 423987123456)"
            value={utr}
            onChange={(e) => {
              setUtr(e.target.value);
              if (utrError) setUtrError('');
            }}
            className="w-full font-mono font-bold text-xs tracking-wider px-3.5 py-2.5 bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl text-[#493B34] placeholder:text-[#756B63]/60 focus:outline-none focus:border-[#C65A2E] focus:bg-white transition-all"
          />
          {utrError && (
            <p className="text-[11px] font-semibold text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{utrError}</span>
            </p>
          )}
        </div>

        {/* Optional Screenshot Upload & WhatsApp Backup */}
        <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#EDE2D0]">
          <label className="flex items-center gap-1.5 text-[#756B63] hover:text-[#493B34] cursor-pointer font-medium text-[11px]">
            <Upload className="w-3.5 h-3.5 text-[#C65A2E]" />
            <span className="truncate max-w-[180px]">
              {screenshotName ? screenshotName : 'Attach Payment Screenshot (Optional)'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleScreenshotUpload}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleSendWhatsAppProof}
            className="text-[11px] font-bold text-[#25D366] hover:underline flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Send Proof on WhatsApp</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="py-2.5 px-4 bg-[#FCFAF6] hover:bg-[#F8EFEA] text-[#493B34] border border-[#EDE2D0] font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Back
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !utr.trim()}
            className="flex-1 py-3 bg-[#C65A2E] hover:bg-[#B24E25] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 text-white" />
            <span>{isSubmitting ? 'Confirming Verification...' : 'Submit Payment & Confirm Booking'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
