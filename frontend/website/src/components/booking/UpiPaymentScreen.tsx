'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Copy, Check, ArrowLeft, Lock, Smartphone, AlertCircle, Clock, FileText, Sparkles } from 'lucide-react';

interface UpiPaymentScreenProps {
  serviceTitle: string;
  serviceType: 'tour' | 'fleet';
  bookingCode: string;
  datesText: string;
  paxOrDurationText: string;
  totalAmount: number;
  depositAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  onBack: () => void;
  onSubmitUtr: (utrNumber: string) => Promise<void>;
  onClose?: () => void;
}

export default function UpiPaymentScreen({
  serviceTitle,
  serviceType,
  bookingCode,
  datesText,
  paxOrDurationText,
  totalAmount,
  depositAmount,
  customerName,
  customerPhone,
  customerEmail,
  onBack,
  onSubmitUtr,
  onClose,
}: UpiPaymentScreenProps) {
  // UPI Configuration State
  const [upiId, setUpiId] = useState('8208211478@ybl');
  const [payeeName, setPayeeName] = useState('Aarambh Travels');
  const [payeeFullName, setPayeeFullName] = useState('SHAM UMAKANT SURYAWANSHI');

  // UI States
  const [showUtrForm, setShowUtrForm] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [utrError, setUtrError] = useState('');
  const [isSuccessSubmitted, setIsSuccessSubmitted] = useState(false);

  // Fetch configured UPI ID from backend if available
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    fetch(`${apiUrl}/api/settings/public`)
      .then((res) => res.json())
      .then((data) => {
        if (data.upi_id) setUpiId(data.upi_id);
        if (data.upi_payee_name) setPayeeName(data.upi_payee_name);
      })
      .catch(() => {});
  }, []);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();

    if (!cleanUtr) {
      setUtrError('Please enter the 12-digit UPI Transaction / UTR reference number.');
      return;
    }
    if (cleanUtr.length < 8) {
      setUtrError('UTR / Reference Number must be at least 8 to 12 digits.');
      return;
    }

    setUtrError('');
    setSubmitting(true);
    try {
      await onSubmitUtr(cleanUtr);
      setIsSuccessSubmitted(true);
    } catch (err: any) {
      setUtrError(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── SUCCESS / PENDING VERIFICATION SCREEN ─────────────────────────────────
  if (isSuccessSubmitted) {
    return (
      <div className="p-6 sm:p-8 space-y-6 text-center animate-fade-in">
        {/* Status Header */}
        <div className="w-16 h-16 rounded-full bg-[#5266EB]/10 text-[#5266EB] mx-auto flex items-center justify-center border-2 border-[#5266EB]/30 animate-pulse">
          <Clock className="w-8 h-8 text-[#5266EB]" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold font-syne uppercase tracking-wider bg-[#5266EB]/15 text-[#5266EB] border border-[#5266EB]/30">
            PAYMENT PENDING VERIFICATION
          </span>
          <h3 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#000000]">
            Booking Received!
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-gray-900">{customerName}</strong>! Your payment details have been logged into our verification queue.
          </p>
        </div>

        {/* Verification Notice Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#9CB4E8]/15 border border-[#9CB4E8]/40 text-left space-y-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#5266EB] shrink-0 mt-0.5" />
            <div className="text-xs text-[#171721] space-y-1">
              <strong className="block text-sm font-syne text-[#000000]">
                Payment is Being Verified by Aarambha Accounts Team
              </strong>
              <p className="text-gray-600 leading-relaxed">
                We are cross-referencing your UTR reference against our bank statement. You will receive a confirmation call and WhatsApp update within <strong>2–4 hours</strong> once verified.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#9CB4E8]/30 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-syne">Booking ID</span>
              <strong className="font-mono text-[#000000]">{bookingCode}</strong>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-syne">Submitted UTR</span>
              <strong className="font-mono text-[#5266EB]">{utrNumber.trim()}</strong>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-syne">Deposit Logged</span>
              <strong className="text-[#000000]">₹{depositAmount.toLocaleString('en-IN')}</strong>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-syne">Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                <Clock className="w-3 h-3" /> Pending Check
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose || (() => window.location.reload())}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#171721] hover:bg-[#272735] text-[#EDEDF3] text-xs font-bold font-syne transition-all shadow-md cursor-pointer"
          >
            Done & Return to Website
          </button>
        </div>
      </div>
    );
  }

  // ─── MAIN OFFICIAL PHONEPE SCANNER & UTR PAYMENT SCREEN ────────────────────
  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Change Booking Details
        </button>

        <span className="text-[10px] font-bold font-syne px-2.5 py-1 rounded-full bg-[#5266EB]/10 text-[#5266EB] border border-[#5266EB]/20 flex items-center gap-1">
          <Lock className="w-3 h-3" /> 100% Secure Direct UPI
        </span>
      </div>

      {/* Booking Summary Card */}
      <div className="p-4 rounded-2xl bg-[#171721] text-[#EDEDF3] border border-[#272735] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-[#AFB2CE] font-syne">
            {serviceType === 'tour' ? 'PILGRIMAGE TOUR PACKAGE' : 'SELF-DRIVE RENTAL VEHICLE'}
          </span>
          <span className="font-mono text-xs font-bold text-[#9CB4E8]">{bookingCode}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="font-syne font-extrabold text-sm sm:text-base text-white">{serviceTitle}</h4>
            <p className="text-xs text-[#AFB2CE]">
              {datesText} • {paxOrDurationText}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-[#AFB2CE] block font-syne">Deposit to Pay Now</span>
            <span className="text-lg sm:text-xl font-black text-[#EDEDF3] font-syne">
              ₹{depositAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Official PhonePe QR Scanner Card */}
      <div className="p-6 rounded-3xl bg-white border border-gray-200 shadow-md text-center space-y-4">
        
        {/* Header Badges */}
        <div className="flex items-center justify-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#5266EB]/10 text-[#5266EB] text-xs font-extrabold font-syne border border-[#5266EB]/20">
            AMOUNT TO PAY: ₹{depositAmount.toLocaleString('en-IN')}
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-mono font-medium">
            Ref: {bookingCode}
          </span>
        </div>

        {/* The Exact Provided Scanner Standee Image */}
        <div className="max-w-[280px] sm:max-w-[300px] mx-auto bg-white p-2 sm:p-3 rounded-2xl border-2 border-gray-900 shadow-xl overflow-hidden relative group">
          <img
            src="/images/phonepe-qr.jpg"
            alt="PhonePe Scanner - SHAM UMAKANT SURYAWANSHI"
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>

        {/* Beneficiary Name and Instructions */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-600">
            <span>Verified Beneficiary:</span>
            <strong className="text-gray-950 font-bold">{payeeFullName}</strong>
          </div>
          <p className="text-[11px] text-gray-500 font-medium">
            Scan and pay using any UPI app (PhonePe, GPay, Paytm, BHIM, etc.)
          </p>
        </div>

        {/* Copy UPI ID & Mobile Pay Buttons */}
        <div className="pt-1 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleCopyUpi}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
          >
            {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#5266EB]" />}
            <span>{copiedUpi ? 'UPI ID Copied!' : `Copy UPI ID: ${upiId}`}</span>
          </button>

          <a
            href={`upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${depositAmount}&cu=INR&tn=${encodeURIComponent(`Booking ${bookingCode}`)}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5266EB]/10 hover:bg-[#5266EB]/20 text-[#5266EB] border border-[#5266EB]/30 text-xs font-bold transition-colors cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Open in UPI App (Mobile)</span>
          </a>
        </div>
      </div>

      {/* UTR Input Section */}
      {!showUtrForm ? (
        <button
          type="button"
          onClick={() => setShowUtrForm(true)}
          className="w-full py-4 rounded-full bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] font-syne font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#5266EB]/25 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>I've Paid — Enter UTR / Reference No.</span>
        </button>
      ) : (
        <form onSubmit={handleUtrSubmit} className="p-5 rounded-3xl bg-[#9CB4E8]/15 border border-[#9CB4E8]/40 space-y-4 animate-fade-in">
          <div className="space-y-1">
            <label className="block text-xs font-extrabold text-[#000000] font-syne uppercase tracking-wider">
              UPI Transaction Reference / UTR Number *
            </label>
            <p className="text-[11px] text-gray-600">
              Enter the 12-digit UTR reference number from your PhonePe / GPay / Paytm payment screen to link with your booking:
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              required
              autoFocus
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
              placeholder="e.g. 423589123456 (12-digit Ref No.)"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:border-[#5266EB] focus:ring-2 focus:ring-[#5266EB]/20 uppercase font-bold"
            />
            {utrError && (
              <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {utrError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-full bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] font-syne font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-[#5266EB]/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <span>Submitting Booking for Verification...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Submit UTR & Lock Reservation</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
