'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Mail, Lock, CheckCircle2, ShieldCheck, CreditCard, Download, ArrowRight, LogOut, Users, Plus, Minus, ExternalLink, AlertCircle, QrCode } from 'lucide-react';
import GoogleAuthButton from '../auth/GoogleAuthButton';
import { apiFetch } from '@/services/api-client';
import { generateInvoicePDF, getNextInvoiceNumber, type InvoiceData } from '@/utils/generateInvoicePDF';
import UPIPaymentVerificationSection from './UPIPaymentVerificationSection';
import { SHARED_BUS_CONTACT } from '@/constants/busData';
import { SHARED_CAR_CONTACT } from '@/constants/carsData';

export interface BookingModalItem {
  id: string;
  type: 'car' | 'tour';
  title: string;
  subtitle?: string;
  image: string;
  price: number;
  deposit: number;
  batchDates?: any[];
  initialBatchId?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BookingModalItem | null;
  onSuccess?: () => void;
}

export default function BookingModal({ isOpen, onClose, item, onSuccess }: BookingModalProps) {
  // Current user authentication state
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone?: string } | null>(null);

  // In-modal Auth Form state
  const [authTab, setAuthTab] = useState<'signup' | 'login'>('signup');
  const [authFullName, setAuthFullName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const activeBatches = React.useMemo(() => {
    if (!item) return [];
    if (item.batchDates !== undefined && Array.isArray(item.batchDates)) {
      return item.batchDates;
    }
    if ((item as any)?.batchDates !== undefined && Array.isArray((item as any).batchDates)) {
      return (item as any).batchDates;
    }
    return [];
  }, [item]);

  const availableMonths: string[] = React.useMemo(() => {
    const months: string[] = Array.from(new Set<string>(activeBatches.map((b: any) => String(b.month)).filter(Boolean)));
    return months;
  }, [activeBatches]);

  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0] || '');
  const [selectedBatchId, setSelectedBatchId] = useState(activeBatches[0]?.id || '');
  const [startDate, setStartDate] = useState(activeBatches[0]?.startDate || '');
  const [endDate, setEndDate] = useState(activeBatches[0]?.endDate || '');

  // Synchronize selected batch when activeBatches or item changes
  useEffect(() => {
    if (activeBatches.length > 0) {
      let targetBatch = activeBatches[0];
      if (item?.initialBatchId) {
        const found = activeBatches.find((b: any) => b.id === item.initialBatchId);
        if (found) targetBatch = found;
      }
      setSelectedMonth(targetBatch.month || availableMonths[0] || '');
      setSelectedBatchId(targetBatch.id);
      setStartDate(targetBatch.startDate || new Date().toISOString().split('T')[0]);
      setEndDate(targetBatch.endDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
    } else {
      setSelectedMonth('');
      setSelectedBatchId('');
      if (!startDate) {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const startStr = today.toISOString().split('T')[0];
        setStartDate(startStr);
        const end = new Date(today);
        end.setDate(end.getDate() + 3);
        setEndDate(end.toISOString().split('T')[0]);
      }
    }
  }, [item, activeBatches, availableMonths]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPaymentStep, setIsPaymentStep] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [submittedUtr, setSubmittedUtr] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [liveBookingStatus, setLiveBookingStatus] = useState<'pending_verification' | 'Confirmed' | 'Rejected'>('pending_verification');

  // Live poll backend status while customer is on the provisional screen
  useEffect(() => {
    if (!isSuccess || !bookingRef || !item) return;

    let intervalId: any;
    const pollStatus = async () => {
      try {
        const endpoint = item.type === 'tour' ? '/api/tours/bookings/sync-status' : '/api/fleet/bookings/sync-status';
        const res = await apiFetch<any[]>(endpoint, {
          method: 'POST',
          body: JSON.stringify({ codes: [bookingRef] }),
        });

        if (Array.isArray(res) && res.length > 0) {
          const matched = res[0];
          if (matched.status === 'Confirmed') {
            setLiveBookingStatus('Confirmed');
            try {
              const existingStr = localStorage.getItem('aarambha_user_bookings');
              if (existingStr) {
                const list = JSON.parse(existingStr);
                const updated = list.map((b: any) =>
                  (b.id === bookingRef || b.bookingCode === bookingRef)
                    ? { ...b, status: 'Confirmed', verifiedAt: matched.verifiedAt }
                    : b
                );
                localStorage.setItem('aarambha_user_bookings', JSON.stringify(updated));
                window.dispatchEvent(new Event('aarambha_booking_updated'));
              }
            } catch (_e) {}
          } else if (matched.status === 'Rejected') {
            setLiveBookingStatus('Rejected');
          }
        }
      } catch (_e) {}
    };

    intervalId = setInterval(pollStatus, 2500);
    pollStatus();

    return () => clearInterval(intervalId);
  }, [isSuccess, bookingRef, item?.type]);

  // Sync auth state on mount and upon auth changes
  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem('aarambha_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setCurrentUser(parsed);
          setFullName(parsed.name || '');
          setEmail(parsed.email || '');
          setPhone(parsed.phone || '');
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    };

    checkAuth();
    window.addEventListener('aarambha_auth_changed', checkAuth);
    return () => window.removeEventListener('aarambha_auth_changed', checkAuth);
  }, []);

  React.useEffect(() => {
    if (availableMonths.length > 0 && !availableMonths.includes(selectedMonth)) {
      setSelectedMonth(availableMonths[0]);
    }
    const firstInMonth = activeBatches.find((b: any) => b.month === (availableMonths.includes(selectedMonth) ? selectedMonth : availableMonths[0]));
    if (firstInMonth) {
      setSelectedBatchId(firstInMonth.id);
      setStartDate(firstInMonth.startDate);
      setEndDate(firstInMonth.endDate);
    }
  }, [activeBatches, availableMonths]);

  if (!isOpen || !item) return null;

  const handleBatchSelect = (batchId: string) => {
    setSelectedBatchId(batchId);
    const selected = activeBatches.find((b: any) => b.id === batchId);
    if (selected) {
      setStartDate(selected.startDate);
      setEndDate(selected.endDate);
    }
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    const firstOfMonth = activeBatches.find((b: any) => b.month === month);
    if (firstOfMonth) {
      handleBatchSelect(firstOfMonth.id);
    }
  };

  // In-modal authentication submit handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail.trim() || !authEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!authPassword.trim() || authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    if (authTab === 'signup') {
      if (!authFullName.trim()) {
        setAuthError('Please enter your full name.');
        return;
      }
      if (!authPhone.trim() || authPhone.replace(/\D/g, '').length < 10) {
        setAuthError('Please enter a valid 10-digit phone number.');
        return;
      }
    }

    setAuthLoading(true);

    setTimeout(() => {
      setAuthLoading(false);

      let registeredUsers: any[] = [];
      try {
        const stored = localStorage.getItem('aarambha_registered_users');
        if (stored) registeredUsers = JSON.parse(stored);
      } catch (_e) {}

      if (authTab === 'signup') {
        const existing = registeredUsers.find((u) => u.email.toLowerCase() === authEmail.trim().toLowerCase());
        if (existing) {
          setAuthError('An account with this email already exists. Please log in.');
          return;
        }

        const newUser = {
          name: authFullName.trim(),
          email: authEmail.trim().toLowerCase(),
          phone: authPhone.trim(),
          password: authPassword,
          createdAt: new Date().toISOString(),
        };

        registeredUsers.push(newUser);
        try {
          localStorage.setItem('aarambha_registered_users', JSON.stringify(registeredUsers));
        } catch (_e) {}

        const profile = {
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          loggedIn: true,
        };

        try {
          localStorage.setItem('aarambha_user', JSON.stringify(profile));
          window.dispatchEvent(new Event('aarambha_auth_changed'));
        } catch (_e) {}

        setCurrentUser(profile);
        setFullName(profile.name);
        setEmail(profile.email);
        setPhone(profile.phone);
      } else {
        // Log in
        const existing = registeredUsers.find((u) => u.email.toLowerCase() === authEmail.trim().toLowerCase());
        if (existing && existing.password && existing.password !== authPassword) {
          setAuthError('Incorrect password. Please try again.');
          return;
        }

        const profile = {
          name: existing ? existing.name : (authFullName || authEmail.split('@')[0] || 'Valued Member'),
          email: authEmail.trim().toLowerCase(),
          phone: existing ? existing.phone : '+91 90676 17451',
          loggedIn: true,
        };

        try {
          localStorage.setItem('aarambha_user', JSON.stringify(profile));
          window.dispatchEvent(new Event('aarambha_auth_changed'));
        } catch (_e) {}

        setCurrentUser(profile);
        setFullName(profile.name);
        setEmail(profile.email);
        setPhone(profile.phone);
      }
    }, 500);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('aarambha_user');
      window.dispatchEvent(new Event('aarambha_auth_changed'));
    } catch {}
    setCurrentUser(null);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!currentUser) {
      setValidationError('Please log in or create an account to proceed with booking.');
      return;
    }

    if (!fullName.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setValidationError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (!termsAccepted) {
      setValidationError('Please accept the terms & conditions to proceed with booking.');
      return;
    }

    const refNo = (item.type === 'car' ? 'FL-' : 'TR-') + Math.floor(100000 + Math.random() * 900000);
    const invNum = getNextInvoiceNumber(item.type === 'car' ? 'car' : 'tour');
    setBookingRef(refNo);
    setInvoiceNumber(invNum);
    setIsPaymentStep(true);
  };

  const handleConfirmUpiPayment = async ({ utrNumber, paymentScreenshot }: { utrNumber: string; paymentScreenshot?: string }) => {
    if (!item) return;
    setIsSubmitting(true);
    setSubmittedUtr(utrNumber);

    const calculatedTotal = item.type === 'tour' ? item.price * Math.max(1, guests) : item.price;
    const calculatedDeposit = item.type === 'tour' ? (item.deposit || 2999) * Math.max(1, guests) : (item.deposit || 500);
    const calculatedBalance = Math.max(0, calculatedTotal - calculatedDeposit);

    const bookingPayload = {
      id: bookingRef,
      bookingCode: bookingRef,
      type: item.type === 'car' ? 'Fleet' : 'Tours',
      title: item.title,
      packageName: item.title,
      vehicleName: item.title,
      image: item.image,
      startDate: item.type === 'tour' ? startDate : (startDate || new Date().toISOString().split('T')[0]),
      endDate: item.type === 'tour' ? endDate : (endDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]),
      travelDate: item.type === 'tour' ? startDate : (startDate || new Date().toISOString().split('T')[0]),
      guestsCount: Math.max(1, guests),
      paxCount: Math.max(1, guests),
      numberOfTravelers: Math.max(1, guests),
      perPersonPrice: item.price,
      totalPrice: calculatedTotal,
      totalAmount: calculatedTotal,
      depositPaid: calculatedDeposit,
      balanceAmount: calculatedBalance,
      customerName: fullName.trim(),
      customerEmail: (currentUser?.email || email.trim()).toLowerCase(),
      email: (currentUser?.email || email.trim()).toLowerCase(),
      customerPhone: phone.trim(),
      phone: phone.trim(),
      accountEmail: (currentUser?.email || email.trim()).toLowerCase(),
      userEmail: (currentUser?.email || email.trim()).toLowerCase(),
      agreementAccepted: true,
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
      termsVersion: '2026.1-STANDARD',
      status: 'pending_verification',
      paymentStatus: 'Verification Pending',
      paymentMethod: 'Direct UPI',
      utrNumber: utrNumber,
      paymentScreenshot: paymentScreenshot,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    try {
      const existingStr = localStorage.getItem('aarambha_user_bookings');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      existing.unshift(bookingPayload);
      localStorage.setItem('aarambha_user_bookings', JSON.stringify(existing));
      window.dispatchEvent(new Event('aarambha_booking_updated'));
    } catch (err) {
      console.error('Failed to persist booking to localStorage:', err);
    }

    // Send POST to Express backend so CRM receives the booking
    try {
      const endpoint = item.type === 'tour' ? '/api/tours/bookings' : '/api/fleet/bookings';
      await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(bookingPayload),
      });
    } catch (err) {
      console.warn('Backend sync warning:', err);
    }

    setIsSubmitting(false);
    setIsPaymentStep(false);
    setIsSuccess(true);
    if (onSuccess) onSuccess();
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setIsPaymentStep(false);
    setIsSubmitting(false);
    setSubmittedUtr('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          /* ─── SCREEN 1: PROVISIONAL VOUCHER & PAYMENT IN VERIFICATION / CONFIRMED ─── */
          <div className="p-6 sm:p-8 text-center space-y-5 overflow-y-auto max-h-[85vh]">
            {liveBookingStatus === 'Confirmed' ? (
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-10 h-10" />
              </div>
            )}

            <div className="space-y-1.5">
              {liveBookingStatus === 'Confirmed' ? (
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-widest inline-block font-syne border border-emerald-300">
                  🎉 BOOKING OFFICIALLY CONFIRMED & VERIFIED
                </span>
              ) : (
                <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-widest inline-block font-syne border border-amber-200">
                  PROVISIONAL BOOKING • VERIFICATION IN PROGRESS
                </span>
              )}
              <h3 className="font-syne text-2xl font-extrabold text-gray-900 pt-1">
                Booking Reference #{bookingRef}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
                {liveBookingStatus === 'Confirmed' ? (
                  <>Congratulations, <strong className="text-gray-900">{fullName || 'Valued Guest'}</strong>! Your payment has been verified and your departure is locked.</>
                ) : (
                  <>Thank you, <strong className="text-gray-900">{fullName || 'Valued Guest'}</strong>! Your booking request and UPI UTR reference have been recorded.</>
                )}
              </p>
            </div>

            {/* Status Advisory Banner */}
            {liveBookingStatus === 'Confirmed' ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] text-emerald-900 text-left space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Payment Verified by Admin</span>
                </div>
                <p className="leading-relaxed text-emerald-800">
                  Your advance deposit has been reconciled. You can download your official confirmed invoice below or view it anytime in My Bookings.
                </p>
              </div>
            ) : (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-[11px] text-blue-900 text-left space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <span>🛡️</span>
                  <span>Accounts Verification Desk</span>
                </div>
                <p className="leading-relaxed text-blue-800">
                  Our accounts team is cross-checking UTR <strong className="font-mono">{submittedUtr}</strong> with incoming bank credit. This page will update automatically once verified!
                </p>
              </div>
            )}

            <div className="bg-[#F8F9FA] rounded-2xl p-4 text-xs space-y-2.5 text-left border border-gray-200/80">
              <div className="flex justify-between text-gray-600">
                <span>Package / Vehicle:</span> <strong className="text-gray-900">{item.title}</strong>
              </div>
              {item.type === 'tour' && (
                <div className="flex justify-between text-gray-600">
                  <span>Travelers (Pax):</span> <strong className="text-gray-900">{guests} Person{guests > 1 ? 's' : ''}</strong>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Total Package Fare:</span> <strong className="text-gray-900 font-bold">₹{item.type === 'tour' ? (item.price * guests).toLocaleString('en-IN') : item.price.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Advance Deposit Paid:</span> <strong className="text-emerald-700 font-bold">₹{item.type === 'tour' ? (item.deposit * guests).toLocaleString('en-IN') : item.deposit.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>UTR / Ref No.:</span> <strong className="font-mono text-gray-900">{submittedUtr || 'Recorded'}</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Invoice Slip No.:</span> <strong className="font-mono text-gray-900">{invoiceNumber}</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Current Status:</span>
                {liveBookingStatus === 'Confirmed' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-300">
                    🟢 Confirmed & Verified
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-300">
                    🟡 Pending Bank Verification
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              {liveBookingStatus !== 'Confirmed' && (
                <button
                  type="button"
                  onClick={() => {
                    const wpPhone = item.type === 'tour' ? SHARED_BUS_CONTACT.whatsappPhone : SHARED_CAR_CONTACT.whatsappPhone;
                    const msg = `*AARAMBHA BOOKING VERIFICATION DESK*%0A🔖 *Booking Code:* ${bookingRef}%0A👤 *Name:* ${fullName}%0A💰 *Deposit:* ₹${item.type === 'tour' ? item.deposit * guests : item.deposit}%0A🔢 *UTR:* ${submittedUtr}%0A_Please verify my UPI transfer and confirm._`;
                    window.open(`https://wa.me/91${wpPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-syne transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4" /> Direct WhatsApp Desk Verification
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  const totalAmt = item.type === 'tour' ? item.price * Math.max(1, guests) : item.price;
                  const depAmt = item.type === 'tour' ? item.deposit * Math.max(1, guests) : item.deposit;
                  const invoiceData: InvoiceData = {
                    invoiceNumber,
                    invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                    bookingType: item.type === 'car' ? 'car' : 'tour',
                    bookingCode: bookingRef,
                    customerName: fullName || 'Valued Guest',
                    customerPhone: phone || 'N/A',
                    customerEmail: email || 'N/A',
                    ...(item.type === 'car' ? {
                      carModel: item.title,
                      rentalStartDate: startDate,
                      rentalEndDate: endDate,
                      numberOfDays: Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)),
                      perDayRate: item.price,
                      subtotal: item.price,
                    } : {
                      packageName: item.title,
                      travelDates: `${startDate} → ${endDate}`,
                      numberOfTravelers: Math.max(1, guests),
                      perPersonPrice: item.price,
                      subtotal: totalAmt,
                    }),
                    totalAmount: totalAmt,
                    depositPaid: depAmt,
                    balanceAmount: Math.max(0, totalAmt - depAmt),
                    paymentMode: 'Direct UPI',
                    paymentStatus: liveBookingStatus === 'Confirmed' ? 'Confirmed & Verified' : 'Partially Paid',
                    transactionId: submittedUtr || bookingRef,
                  };
                  generateInvoicePDF(invoiceData);
                }}
                className={`w-full py-3 rounded-2xl text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                  liveBookingStatus === 'Confirmed' ? 'bg-[#5266EB] hover:bg-[#3E51D4]' : 'bg-gray-900 hover:bg-black'
                }`}
              >
                <Download className="w-4 h-4" /> {liveBookingStatus === 'Confirmed' ? 'Download Confirmed Tax Invoice PDF' : 'Download Provisional Invoice PDF'}
              </button>

              <a
                href="/my-bookings"
                className="w-full py-2.5 rounded-2xl border border-gray-200 bg-white text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer block"
              >
                <span>Go to My Bookings Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : !currentUser ? (
          /* ─── SCREEN 2: MANDATORY AUTHENTICATION / SIGNUP STEP ─────────── */
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            
            {/* Modal Header Card */}
            <div className="bg-[#171721] text-[#EDEDF3] p-6 relative overflow-hidden flex items-center gap-4 flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 rounded-xl object-cover border border-white/20 flex-shrink-0"
              />
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block bg-[#5266EB]/20 text-[#9CB4E8] border border-[#5266EB]/30 font-syne">
                  🔒 Verified Booking Required
                </span>
                <h3 className="font-syne text-base font-extrabold text-white leading-tight">
                  {item.title}
                </h3>
                <span className="text-xs font-bold text-[#AFB2CE] block font-syne">
                  Advance Deposit: ₹{item.deposit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Auth Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              
              {/* Notice Banner */}
              <div className="p-3.5 bg-[#9CB4E8]/10 border border-[#9CB4E8]/30 rounded-2xl text-[#171721] text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#5266EB] shrink-0" />
                  <span>Please Log In or Create Account to Book</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed font-normal">
                  To prevent unauthorized or fake bookings, a verified account is required before reserving seats.
                </p>
              </div>

              {/* Error Banner */}
              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{authError}</span>
                </div>
              )}

              {/* Segmented Auth Mode Switcher */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => { setAuthTab('signup'); setAuthError(''); }}
                  className={`flex-1 py-2 rounded-xl font-syne font-extrabold text-xs transition-all ${
                    authTab === 'signup'
                      ? 'bg-[#171721] text-[#EDEDF3] shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  CREATE NEW ACCOUNT
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthTab('login'); setAuthError(''); }}
                  className={`flex-1 py-2 rounded-xl font-syne font-extrabold text-xs transition-all ${
                    authTab === 'login'
                      ? 'bg-[#171721] text-[#EDEDF3] shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  LOG IN
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-3 pt-1">
                {authTab === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-400" /> Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#5266EB]"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#5266EB]"
                  />
                </div>

                {authTab === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400" /> Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="e.g. +91 90676 17451"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#5266EB]"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-gray-400" /> Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter password (min 6 characters)"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#5266EB]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3.5 rounded-2xl bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-[#5266EB]/20 flex items-center justify-center gap-2"
                  >
                    <span>{authLoading ? 'Verifying Account...' : authTab === 'signup' ? 'Create Account & Continue Booking' : 'Log In & Continue Booking'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* 1-Click Google Login inside Booking Modal */}
              <div className="pt-2">
                <div className="flex items-center justify-center relative my-3">
                  <div className="w-full border-t border-gray-200" />
                  <span className="bg-white px-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider absolute">
                    or 1-click with
                  </span>
                </div>
                <GoogleAuthButton
                  text="Instant 1-Click Google Sign-In"
                  onSuccess={(user) => {
                    setCurrentUser(user);
                    setFullName(user.name);
                    setEmail(user.email);
                  }}
                  onError={(err) => setAuthError(typeof err === 'string' ? err : 'Google Sign-In failed')}
                  className="w-full"
                />
              </div>

            </div>

          </div>
        ) : isPaymentStep ? (
          /* ─── SCREEN 3: DYNAMIC UPI QR & UTR VERIFICATION SCREEN ──────── */
          <div className="p-6 overflow-y-auto flex-1 min-h-0 max-h-[85vh]">
            <UPIPaymentVerificationSection
              bookingCode={bookingRef}
              itemTitle={item.title}
              itemType={item.type}
              totalPrice={item.type === 'tour' ? item.price * Math.max(1, guests) : item.price}
              depositAmount={item.type === 'tour' ? (item.deposit || 2999) * Math.max(1, guests) : (item.deposit || 500)}
              customerName={fullName}
              customerPhone={phone}
              onConfirmPayment={handleConfirmUpiPayment}
              onBack={() => setIsPaymentStep(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : (
          /* ─── SCREEN 4: VERIFIED BOOKING DETAILS ENTRY FORM ───────────── */
          <form onSubmit={handleProceedToPayment} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            
            {/* Modal Header Card (Fixed top) */}
            <div className="bg-[#171721] text-[#EDEDF3] p-5 relative overflow-hidden flex items-center gap-4 flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 rounded-xl object-cover border border-white/20 flex-shrink-0"
              />
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block bg-[#5266EB]/20 text-[#9CB4E8] border border-[#5266EB]/30">
                  {item.type === 'car' ? 'Self-Drive Vehicle' : 'Tour Package'}
                </span>
                <h3 className="font-syne text-base font-extrabold text-white leading-tight">
                  {item.title}
                </h3>
                <span className="text-xs font-bold text-[#AFB2CE] block font-syne">
                  ₹{item.price.toLocaleString('en-IN')} {item.type === 'car' ? '/day' : 'total'}
                </span>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              
              {/* Authenticated User Banner */}
              <div className="p-3 bg-[#9CB4E8]/10 border border-[#9CB4E8]/30 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#5266EB] text-white font-bold text-xs flex items-center justify-center font-syne">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-[#000000] leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {currentUser.email} • Verified Member
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[10px] font-bold text-[#5266EB] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" /> Log Out
                </button>
              </div>

              {/* Validation Error Banner */}
              {validationError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{validationError}</span>
                </div>
              )}
              
              {/* Dates / Fixed Departure Batch Selection */}
              {item.type === 'tour' ? (
                activeBatches.length > 0 && (
                  <div className="space-y-2.5 bg-[#FAFAFC] border border-gray-200 p-4 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-[#000000] flex items-center gap-1.5 text-xs font-syne">
                        <Calendar className="w-4 h-4 text-[#5266EB]" /> Select Tour Batch Date *
                      </label>
                      <span className="text-[9px] font-extrabold text-[#171721] bg-[#9CB4E8]/20 px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#9CB4E8]/30">
                        {activeBatches.filter((b: any) => !selectedMonth || b.month === selectedMonth).length} Departure Dates
                      </span>
                    </div>

                    {/* Month Switcher Tabs */}
                    {availableMonths.length > 1 && (
                      <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-gray-200 overflow-x-auto">
                        {availableMonths.map((m: string) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              setSelectedMonth(m);
                              const match = activeBatches.find((b: any) => b.month === m);
                              if (match) {
                                setSelectedBatchId(match.id);
                                setStartDate(match.startDate);
                                setEndDate(match.endDate);
                              }
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer font-syne ${
                              selectedMonth === m
                                ? 'bg-[#5266EB] text-white shadow-xs'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Specific Batch Selection Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-h-48 overflow-y-auto">
                      {activeBatches
                        .filter((b: any) => !selectedMonth || b.month === selectedMonth)
                        .map((b: any) => {
                          const isSelected = selectedBatchId === b.id;
                          return (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => {
                                setSelectedBatchId(b.id);
                                setStartDate(b.startDate);
                                setEndDate(b.endDate);
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-[#5266EB]/10 border-[#5266EB] shadow-xs'
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className={`text-xs font-bold font-syne ${isSelected ? 'text-[#5266EB]' : 'text-gray-900'}`}>
                                  {b.label}
                                </span>
                                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#5266EB] shrink-0" />}
                              </div>
                              <span className="text-[10px] text-gray-500 mt-1 block">
                                {b.tag || 'Standard Group Batch'}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" /> Pick-up Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5266EB]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" /> Return Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={startDate}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5266EB]"
                    />
                  </div>
                </div>
              )}

              {/* Number of Pilgrims / Travelers (For Tours) */}
              {item.type === 'tour' && (
                <div className="space-y-2 bg-[#FAFAFC] border border-gray-200 p-4 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-[#000000] flex items-center gap-1.5 text-xs font-syne">
                      <Users className="w-4 h-4 text-[#5266EB]" /> Number of Pilgrims / Travelers *
                    </label>
                    <span className="text-[10px] font-extrabold text-[#5266EB] bg-[#5266EB]/10 px-2 py-0.5 rounded-full">
                      {guests} Pax Selected
                    </span>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 4, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuests(num)}
                        className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap border cursor-pointer ${
                          guests === num
                            ? 'bg-[#5266EB] text-white border-[#5266EB] shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#5266EB]/40 hover:bg-[#5266EB]/5'
                        }`}
                      >
                        {num} Pax
                      </button>
                    ))}
                  </div>

                  {/* Interactive Stepper & Direct Input */}
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="text-xs text-gray-600 font-medium">Custom Pilgrim Count:</span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGuests((prev: number) => Math.max(1, prev - 1))}
                        disabled={guests <= 1}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-800 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={guests}
                        onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-14 text-center font-syne font-extrabold text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg py-1 focus:outline-none focus:border-[#5266EB]"
                      />

                      <button
                        type="button"
                        onClick={() => setGuests((prev: number) => Math.min(50, prev + 1))}
                        className="w-8 h-8 rounded-lg bg-[#5266EB] hover:bg-[#3E51D4] flex items-center justify-center text-white transition-colors shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Live Fare Calculation Summary Card */}
                  <div className="bg-white rounded-xl p-3 border border-gray-200 space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Package Rate / Pilgrim:</span>
                      <strong className="text-gray-900 font-syne">₹{item.price.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Total Pilgrims (Pax):</span>
                      <strong className="text-gray-900 font-syne">{guests} Person{guests > 1 ? 's' : ''}</strong>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-gray-100 text-gray-900 font-syne">
                      <span className="font-bold">Total Package Fare:</span>
                      <strong className="text-[#5266EB] text-sm font-extrabold">₹{(item.price * guests).toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Guest / Driver Name */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-gray-400" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#5266EB]"
                />
              </div>

              {/* Contact Email & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5266EB]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 82082 11478"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#5266EB]"
                  />
                </div>
              </div>

              {/* Instant Confirmation Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-900 text-xs">
                    Direct Advance Payment:
                  </span>
                </div>
                <span className="font-syne text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  UPI QR & 1-Click Mobile Pay
                </span>
              </div>

              {/* Mandatory Terms & Conditions Acceptance Checkbox */}
              <div className="space-y-2 pt-1">
                <label className={`flex items-start gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                  termsAccepted
                    ? 'bg-[#9CB4E8]/10 border-[#5266EB]/40 shadow-sm'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (e.target.checked) setValidationError('');
                    }}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#5266EB] focus:ring-[#5266EB] cursor-pointer accent-[#5266EB] flex-shrink-0"
                  />
                  <span className="text-[11px] text-gray-700 leading-snug font-medium">
                    I have read and agree to the{' '}
                    <a
                      href={item.type === 'car' ? '/car-rentals#terms' : '/tours-travels#terms'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-bold text-[#5266EB] hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Terms & Conditions</span>
                      <ExternalLink className="w-2.5 h-2.5 inline" />
                    </a>{' '}
                    including booking guidelines, cancellation policies, and tour terms.
                  </span>
                </label>

                {validationError && (
                  <p className="text-[11px] font-bold text-red-600 flex items-center gap-1.5 px-1 animate-fade-in">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{validationError}</span>
                  </p>
                )}
              </div>

            </div>

            {/* Footer Actions (Sticky bottom) */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white flex-shrink-0 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="text-xs font-bold text-gray-500 hover:text-gray-700 cursor-pointer px-3 py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!termsAccepted || isSubmitting}
                className={`text-xs font-bold px-8 py-3.5 rounded-full text-white shadow-md flex items-center gap-2 transition-all ${
                  !termsAccepted || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 shadow-none'
                    : 'bg-[#5266EB] hover:bg-[#3E51D4] cursor-pointer hover:scale-102 active:scale-98 shadow-[#5266EB]/30'
                }`}
              >
                <QrCode className="w-4 h-4 text-white" />
                <span>Proceed to UPI Payment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
