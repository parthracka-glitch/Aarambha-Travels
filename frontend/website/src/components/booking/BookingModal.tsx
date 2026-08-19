'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Mail, Lock, CheckCircle2, ShieldCheck, CreditCard, Download, ArrowRight, LogOut, Users, Plus, Minus, ExternalLink, AlertCircle } from 'lucide-react';
import GoogleAuthButton from '../auth/GoogleAuthButton';
import { apiFetch } from '@/services/api-client';
import { generateInvoicePDF, getNextInvoiceNumber, type InvoiceData } from '@/utils/generateInvoicePDF';

export interface BookingModalItem {
  id: string;
  type: 'car' | 'tour';
  title: string;
  subtitle?: string;
  image: string;
  price: number;
  deposit: number;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BookingModalItem | null;
  onSuccess?: () => void;
}

const FIXED_TOUR_BATCHES = [
  // August 3 fixed options
  { id: 'aug-1', month: 'August', label: '04 Aug – 10 Aug 2026', tag: 'Batch #1 (Early Aug)', startDate: '2026-08-04', endDate: '2026-08-10', status: 'available' },
  { id: 'aug-2', month: 'August', label: '14 Aug – 20 Aug 2026', tag: 'Batch #2 (Mid Aug)', startDate: '2026-08-14', endDate: '2026-08-20', status: 'available' },
  { id: 'aug-3', month: 'August', label: '24 Aug – 30 Aug 2026', tag: 'Batch #3 (Late Aug)', startDate: '2026-08-24', endDate: '2026-08-30', status: 'available' },
  // September 3 fixed options
  { id: 'sep-1', month: 'September', label: '04 Sep – 10 Sep 2026', tag: 'Batch #1 (Early Sep)', startDate: '2026-09-04', endDate: '2026-09-10', status: 'available' },
  { id: 'sep-2', month: 'September', label: '14 Sep – 20 Sep 2026', tag: 'Batch #2 (Mid Sep)', startDate: '2026-09-14', endDate: '2026-09-20', status: 'available' },
  { id: 'sep-3', month: 'September', label: '24 Sep – 30 Sep 2026', tag: 'Batch #3 (Late Sep)', startDate: '2026-09-24', endDate: '2026-09-30', status: 'available' },
  // October 3 fixed options
  { id: 'oct-1', month: 'October', label: '04 Oct – 10 Oct 2026', tag: 'Batch #1 (Early Oct)', startDate: '2026-10-04', endDate: '2026-10-10', status: 'available' },
  { id: 'oct-2', month: 'October', label: '14 Oct – 20 Oct 2026', tag: 'Batch #2 (Mid Oct)', startDate: '2026-10-14', endDate: '2026-10-20', status: 'available' },
  { id: 'oct-3', month: 'October', label: '24 Oct – 30 Oct 2026', tag: 'Batch #3 (Late Oct)', startDate: '2026-10-24', endDate: '2026-10-30', status: 'available' },
];

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
    if (!item) return FIXED_TOUR_BATCHES;
    try {
      const stored = localStorage.getItem('aarambha_package_batches_' + item.id);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 3) return parsed;
      }
    } catch (_e) {}
    if ((item as any)?.batchDates && Array.isArray((item as any).batchDates) && (item as any).batchDates.length >= 3) {
      return (item as any).batchDates;
    }
    return FIXED_TOUR_BATCHES;
  }, [item]);

  const availableMonths: string[] = React.useMemo(() => {
    const months: string[] = Array.from(new Set<string>(activeBatches.map((b: any) => String(b.month))));
    return months.length > 0 ? months : ['August', 'September', 'October'];
  }, [activeBatches]);

  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0] || 'August');
  const [selectedBatchId, setSelectedBatchId] = useState(activeBatches[0]?.id || FIXED_TOUR_BATCHES[0].id);
  const [startDate, setStartDate] = useState(activeBatches[0]?.startDate || FIXED_TOUR_BATCHES[0].startDate);
  const [endDate, setEndDate] = useState(activeBatches[0]?.endDate || FIXED_TOUR_BATCHES[0].endDate);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationError, setValidationError] = useState('');

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

  const handleSubmitBooking = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);

    const refNo = (item.type === 'car' ? 'FL-' : 'TR-') + Math.floor(100000 + Math.random() * 900000);

    const calculatedTotal = item.type === 'tour' ? item.price * Math.max(1, guests) : item.price;
    const calculatedDeposit = item.type === 'tour' ? item.deposit * Math.max(1, guests) : item.deposit;
    const calculatedBalance = Math.max(0, calculatedTotal - calculatedDeposit);

    const bookingPayload = {
      id: refNo,
      bookingCode: refNo,
      type: item.type,
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
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    // If no active user session, initialize session with booking contact info
    if (!currentUser) {
      const guestProfile = {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        loggedIn: true,
      };
      try {
        localStorage.setItem('aarambha_user', JSON.stringify(guestProfile));
        window.dispatchEvent(new Event('aarambha_auth_changed'));
      } catch (_e) {}
    }

    // Save to localStorage
    try {
      const existingStr = localStorage.getItem('aarambha_user_bookings');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      existing.unshift(bookingPayload);
      localStorage.setItem('aarambha_user_bookings', JSON.stringify(existing));
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

    setTimeout(() => {
      setIsSubmitting(false);
      setBookingRef(refNo);
      const invNum = getNextInvoiceNumber(item.type === 'car' ? 'car' : 'tour');
      setInvoiceNumber(invNum);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    }, 1000);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setIsSubmitting(false);
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
          /* ─── SCREEN 1: SUCCESS VOUCHER & INVOICE ─────────────────── */
          <div className="p-8 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest block font-syne">
                RESERVATION CONFIRMED
              </span>
              <h3 className="font-syne text-2xl font-extrabold text-[#111111]">
                Booking Reference #{bookingRef}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                Thank you, <strong className="text-[#111111]">{fullName || 'Valued Guest'}</strong>! Your booking for <strong className="text-[#111111]">{item.title}</strong> is locked for <strong className="text-[#111111]">{guests} {guests > 1 ? 'Travelers' : 'Traveler'}</strong> with a ₹{item.type === 'tour' ? item.deposit * guests : item.deposit} deposit.
              </p>
            </div>

            <div className="bg-[#F8F9FA] rounded-2xl p-4 text-xs space-y-2 text-left border border-gray-200/80">
              <div className="flex justify-between text-gray-600">
                <span>Item / Package:</span> <strong className="text-[#111111]">{item.title}</strong>
              </div>
              {item.type === 'tour' && (
                <div className="flex justify-between text-gray-600">
                  <span>Travelers (Pax):</span> <strong className="text-[#111111]">{guests} Person{guests > 1 ? 's' : ''}</strong>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Total Package Fare:</span> <strong className="text-gray-900 font-bold">₹{item.type === 'tour' ? (item.price * guests).toLocaleString('en-IN') : item.price.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Deposit Paid:</span> <strong className="text-emerald-600 font-bold">₹{item.type === 'tour' ? (item.deposit * guests).toLocaleString('en-IN') : item.deposit.toLocaleString('en-IN')} (Success)</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Invoice No.:</span> <strong className="font-mono text-[#111111]">{invoiceNumber}</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Account:</span> <strong className="text-[#111111]">{currentUser?.email || email}</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Status:</span> <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">Confirmed</span>
              </div>
            </div>

            {/* Download Invoice Button */}
            <button
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
                  paymentMode: 'Razorpay',
                  paymentStatus: 'Partially Paid',
                  transactionId: bookingRef,
                };
                generateInvoicePDF(invoiceData);
              }}
              className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Invoice PDF
            </button>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3 rounded-full border border-gray-200 bg-white text-[#111111] text-xs font-bold hover:bg-gray-50 transition-colors"
            >
              View My Bookings
            </button>
          </div>
        ) : !currentUser ? (
          /* ─── SCREEN 2: MANDATORY AUTHENTICATION / SIGNUP STEP ─────────── */
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            
            {/* Modal Header Card */}
            <div className="bg-[#111111] text-white p-6 relative overflow-hidden flex items-center gap-4 flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 rounded-xl object-cover border border-white/20 flex-shrink-0"
              />
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block bg-amber-500/20 text-amber-300 border border-amber-500/30 font-syne">
                  🔒 Verified Booking Required
                </span>
                <h3 className="font-syne text-base font-extrabold text-white leading-tight">
                  {item.title}
                </h3>
                <span className="text-xs font-bold text-gray-300 block font-syne">
                  Advance Deposit: ₹{item.deposit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Auth Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              
              {/* Notice Banner */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Please Log In or Create Account to Book</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed font-normal">
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
                      ? 'bg-[#111827] text-white shadow-md'
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
                      ? 'bg-[#111827] text-white shadow-md'
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
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-600"
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
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-600"
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
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-600"
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
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2"
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
        ) : (
          /* ─── SCREEN 3: VERIFIED BOOKING CONFIRMATION FORM ────────────── */
          <form onSubmit={handleSubmitBooking} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            
            {/* Modal Header Card (Fixed top) */}
            <div className="bg-[#111111] text-white p-5 relative overflow-hidden flex items-center gap-4 flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 rounded-xl object-cover border border-white/20 flex-shrink-0"
              />
              <div className="space-y-1">
                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block ${
                  item.type === 'car' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {item.type === 'car' ? 'Self-Drive Vehicle' : 'Tour Package'}
                </span>
                <h3 className="font-syne text-base font-extrabold text-white leading-tight">
                  {item.title}
                </h3>
                <span className="text-xs font-bold text-gray-300 block font-syne">
                  ₹{item.price.toLocaleString('en-IN')} {item.type === 'car' ? '/day' : 'total'}
                </span>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              
              {/* Authenticated User Banner */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center font-syne">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 leading-tight">
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
                  className="text-[10px] font-bold text-[#FF3B30] hover:underline flex items-center gap-1"
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
                <div className="space-y-2.5 bg-emerald-50/30 border border-emerald-200/80 p-4 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-gray-900 flex items-center gap-1.5 text-xs font-syne">
                      <Calendar className="w-4 h-4 text-emerald-600" /> Select Tour Batch Date *
                    </label>
                    <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {activeBatches.filter((b: any) => b.month === selectedMonth).length} Departure Dates
                    </span>
                  </div>

                  {/* Month Switcher Tabs */}
                  <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-gray-200 overflow-x-auto">
                    {availableMonths.map((m: string) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleMonthChange(m)}
                        className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap ${
                          selectedMonth === m
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {/* Date Options Cards for Selected Month */}
                  <div className="space-y-2 pt-0.5">
                    {activeBatches.filter((b: any) => b.month === selectedMonth).map((slot: any) => {
                      const isSelected = selectedBatchId === slot.id;
                      const isSoldOut = slot.status === 'full' || slot.status === 'disabled';
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={isSoldOut}
                          onClick={() => !isSoldOut && handleBatchSelect(slot.id)}
                          className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                            isSoldOut
                              ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'border-2 border-emerald-600 bg-white shadow-sm'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div>
                              <span className="font-bold text-xs text-gray-900 block font-syne">
                                📅 {slot.label}
                              </span>
                              <span className="text-[10px] text-gray-500 font-medium">
                                {slot.tag}
                              </span>
                            </div>
                          </div>

                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isSelected ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {isSelected ? '✓ Selected' : 'Select'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" /> Pick-up Date
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#FF3B30]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" /> Return Date
                    </label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#FF3B30]"
                    />
                  </div>
                </div>
              )}

              {/* ─── DEDICATED NUMBER OF TRAVELERS / PILGRIMS SELECTION BOX (TOURS ONLY) ─── */}
              {item.type === 'tour' && (
                <div className="space-y-3 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white border border-emerald-200/90 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-gray-900 flex items-center gap-1.5 text-xs font-syne">
                      <Users className="w-4 h-4 text-emerald-600" /> Number of Travelers / Pilgrims *
                    </label>
                    <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-syne border border-emerald-200">
                      {guests} {guests > 1 ? 'Pilgrims' : 'Pilgrim'}
                    </span>
                  </div>

                  {/* Quick Selection Buttons */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuests(num)}
                        className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap border ${
                          guests === num
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40'
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
                        className="w-14 text-center font-syne font-extrabold text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg py-1 focus:outline-none focus:border-emerald-500"
                      />

                      <button
                        type="button"
                        onClick={() => setGuests((prev: number) => Math.min(50, prev + 1))}
                        className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white transition-colors shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Live Fare Calculation Summary Card */}
                  <div className="bg-white/90 rounded-xl p-3 border border-emerald-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Package Rate / Pilgrim:</span>
                      <strong className="text-gray-900 font-syne">₹{item.price.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Total Pilgrims (Pax):</span>
                      <strong className="text-gray-900 font-syne">{guests} Person{guests > 1 ? 's' : ''}</strong>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-emerald-100 text-gray-900 font-syne">
                      <span className="font-bold">Total Package Fare:</span>
                      <strong className="text-emerald-700 text-sm font-extrabold">₹{(item.price * guests).toLocaleString('en-IN')}</strong>
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
                  className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF3B30]"
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
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#FF3B30]"
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
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#FF3B30]"
                  />
                </div>
              </div>

              {/* Deposit Banner */}
              <div className="bg-emerald-50 border border-emerald-200/70 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-900 text-xs">
                    {item.type === 'tour' ? `Lock Date Deposit (${guests} Pax):` : 'Lock Date With Deposit:'}
                  </span>
                </div>
                <span className="font-syne text-sm font-extrabold text-emerald-700">
                  ₹{(item.type === 'tour' ? item.deposit * guests : item.deposit).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Mandatory Terms & Conditions Acceptance Checkbox */}
              <div className="space-y-2 pt-1">
                <label className={`flex items-start gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                  termsAccepted
                    ? 'bg-amber-50/50 border-amber-300/80 shadow-sm'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (e.target.checked) setValidationError('');
                    }}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#FF3B30] focus:ring-[#FF3B30] cursor-pointer accent-[#FF3B30] flex-shrink-0"
                  />
                  <span className="text-[11px] text-gray-700 leading-snug font-medium">
                    I have read and agree to the{' '}
                    <a
                      href={item.type === 'car' ? '/car-rentals#terms' : '/tours-travels#terms'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-bold text-[#FF3B30] hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Terms & Conditions</span>
                      <ExternalLink className="w-2.5 h-2.5 inline" />
                    </a>{' '}
                    including fuel policy, damage liability, late return charges, and cancellation policy.
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
                disabled={isSubmitting || !termsAccepted}
                className={`text-xs font-bold px-8 py-3 rounded-full text-white shadow-md flex items-center gap-2 transition-all ${
                  !termsAccepted || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 shadow-none'
                    : item.type === 'car'
                    ? 'btn-red-pill bg-[#FF3B30] hover:bg-[#E03126] cursor-pointer hover:scale-102'
                    : 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer hover:scale-102'
                }`}
              >
                {isSubmitting ? (
                  <span>Processing Deposit...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Confirm Booking (Pay ₹{(item.type === 'tour' ? item.deposit * guests : item.deposit).toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
