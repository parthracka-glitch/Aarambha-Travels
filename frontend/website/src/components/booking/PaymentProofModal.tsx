'use client';

import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Send, ShieldCheck, Copy, Check } from 'lucide-react';
import { createPaymentProofWhatsAppUrl, AARAMBHA_ACCOUNTS_PHONE } from '@/utils/whatsapp';

interface PaymentProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingCode?: string;
  defaultAmount?: number;
  serviceType?: string;
}

export default function PaymentProofModal({
  isOpen,
  onClose,
  bookingCode = '',
  defaultAmount = 500,
  serviceType = 'Tour / Vehicle Booking'
}: PaymentProofModalProps) {
  const [code, setCode] = useState(bookingCode);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(defaultAmount);
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  if (!isOpen) return null;

  const upiId = 'aarambhatours@upi';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleDispatchWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !utrNumber) {
      alert('Please fill in your name, phone number, and UTR / Reference number.');
      return;
    }

    const whatsappUrl = createPaymentProofWhatsAppUrl({
      bookingCode: code || 'ATT-' + Math.floor(100000 + Math.random() * 900000),
      customerName: name,
      customerPhone: phone,
      amountPaid: Number(amount) || 500,
      utrNumber: utrNumber,
      serviceType: serviceType
    });

    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#141622] border border-white/10 p-6 sm:p-8 text-white shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Instant Payment Verification</span>
          </div>
          <h2 className="text-2xl font-bold font-syne text-white">
            Submit Payment Proof / UTR
          </h2>
          <p className="text-xs text-gray-400">
            Send your advance transfer screenshot & UTR number directly to our accounts desk.
          </p>
        </div>

        {/* UPI Details Box */}
        <div className="p-4 rounded-2xl bg-[#1D2032] border border-white/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Official Company UPI ID</div>
            <div className="text-sm font-extrabold text-amber-400 font-mono">{upiId}</div>
          </div>
          <button
            onClick={handleCopyUpi}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
          >
            {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUpi ? 'Copied!' : 'Copy UPI'}</span>
          </button>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleDispatchWhatsApp} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Patil"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300">WhatsApp Phone *</label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300">Booking Reference / Item</label>
              <input
                type="text"
                placeholder="e.g. ATT-2026 or Tour Name"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300">Amount Transferred (₹) *</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300">Bank UTR / Transaction Ref Number *</label>
            <input
              type="text"
              required
              placeholder="e.g. 423819284920 or GooglePay/PhonePe Ref"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20BE5C] text-black font-extrabold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 mt-4"
          >
            <Send className="w-4 h-4" />
            <span>Send Payment Proof to WhatsApp</span>
          </button>
        </form>

      </div>
    </div>
  );
}
