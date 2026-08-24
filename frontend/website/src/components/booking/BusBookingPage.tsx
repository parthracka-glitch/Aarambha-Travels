'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Calendar,
  User,
  Mail,
  Phone,
  Lock,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Bus,
  MapPin,
  Sparkles,
  FileText,
  Clock,
  ArrowRight,
  Check,
  ExternalLink,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';
import { apiFetch } from '@/services/api-client';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import { generateInvoicePDF, getNextInvoiceNumber, type InvoiceData } from '@/utils/generateInvoicePDF';
import { BUS_RULES_AND_GUIDELINES, SHARED_BUS_CONTACT } from '@/constants/busData';
import UPIPaymentVerificationSection from '@/components/booking/UPIPaymentVerificationSection';

export interface BusBookingConfig {
  busType: string;
  seats: number;
  serviceType: 'local' | 'outstation';
  acType: 'AC' | 'Non-AC';
  route?: string;          // e.g., 'Mumbai', 'Mahabaleshwar', 'Per KM', 'Pune Local'
  basePrice: number;
  backLink: string;        // link back to the pricing page
  backLabel: string;       // label for back link
}

export default function BusBookingPage({ config }: { config: BusBookingConfig }) {
  const router = useRouter();

  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const [travelDate, setTravelDate] = useState(todayStr);
  const [returnDate, setReturnDate] = useState(() => {
    const future = new Date(Date.now() + 86400000);
    return future.toISOString().split('T')[0];
  });

  const [pickupLocation, setPickupLocation] = useState('Green Hills Society, Katraj, Pune (HQ)');
  const [dropLocation, setDropLocation] = useState(config.route || '');

  // Customer Auth & Contact State
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone?: string } | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [bookingRef, setBookingRef] = useState('');

  // Inline Quick Auth state
  const [authTab, setAuthTab] = useState<'signup' | 'login'>('signup');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentStep, setIsPaymentStep] = useState(false);
  const [submittedUtr, setSubmittedUtr] = useState('');
  const [liveBookingStatus, setLiveBookingStatus] = useState<'pending_verification' | 'Confirmed' | 'Rejected'>('pending_verification');
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  // Live polling for booking status confirmation from Admin CRM
  React.useEffect(() => {
    if (!bookingSuccess || !bookingSuccess.refNo) return;

    let intervalId: any;
    const pollStatus = async () => {
      try {
        const res = await apiFetch<any[]>('/api/fleet/bookings/sync-status', {
          method: 'POST',
          body: JSON.stringify({ codes: [bookingSuccess.refNo] }),
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
                  (b.id === bookingSuccess.refNo || b.bookingCode === bookingSuccess.refNo)
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
  }, [bookingSuccess]);

  // Sync user from localStorage
  React.useEffect(() => {
    const syncUser = () => {
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
    syncUser();
    window.addEventListener('aarambha_auth_changed', syncUser);
    return () => window.removeEventListener('aarambha_auth_changed', syncUser);
  }, []);

  const handleInlineAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (!authPassword.trim() || authPassword.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }
    if (authTab === 'signup') {
      if (!fullName.trim()) {
        setValidationError('Please enter your full name.');
        return;
      }
      if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
        setValidationError('Please enter a valid 10-digit WhatsApp number.');
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
        const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (existing) {
          setValidationError('An account with this email already exists. Please log in.');
          return;
        }

        const newUser = {
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password: authPassword,
        };
        registeredUsers.push(newUser);
        try {
          localStorage.setItem('aarambha_registered_users', JSON.stringify(registeredUsers));
          localStorage.setItem('aarambha_user', JSON.stringify({ ...newUser, loggedIn: true }));
          window.dispatchEvent(new Event('aarambha_auth_changed'));
        } catch (_e) {}

        setCurrentUser({ ...newUser });
      } else {
        const existing = registeredUsers.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === authPassword
        );
        if (!existing) {
          const guestProfile = {
            name: fullName.trim() || email.split('@')[0],
            email: email.trim().toLowerCase(),
            phone: phone.trim() || '+91 82082 11478',
            loggedIn: true,
          };
          try {
            localStorage.setItem('aarambha_user', JSON.stringify(guestProfile));
            window.dispatchEvent(new Event('aarambha_auth_changed'));
          } catch (_e) {}
          setCurrentUser(guestProfile);
          setFullName(guestProfile.name);
          setPhone(guestProfile.phone);
          return;
        }

        const profile = {
          name: existing.name,
          email: existing.email,
          phone: existing.phone,
          loggedIn: true,
        };
        try {
          localStorage.setItem('aarambha_user', JSON.stringify(profile));
          window.dispatchEvent(new Event('aarambha_auth_changed'));
        } catch (_e) {}

        setCurrentUser(profile);
        setFullName(profile.name);
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

  // Pricing
  const totalCost = config.basePrice;
  const depositAmount = 500;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!currentUser) {
      setValidationError('Please log in or create an account to confirm your booking.');
      return;
    }
    if (!fullName.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setValidationError('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (!travelDate) {
      setValidationError('Please select a valid travel date.');
      return;
    }
    if (!termsAccepted) {
      setValidationError('Please accept the terms & conditions to proceed with booking.');
      return;
    }

    const refNo = 'BUS-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRef(refNo);
    setIsPaymentStep(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmUpiPayment = async ({ utrNumber, paymentScreenshot }: { utrNumber: string; paymentScreenshot?: string }) => {
    setIsSubmitting(true);
    setSubmittedUtr(utrNumber);
    const refNo = bookingRef || 'BUS-' + Math.floor(100000 + Math.random() * 900000);
    const invNum = getNextInvoiceNumber('car');

    const bookingPayload = {
      id: refNo,
      bookingCode: refNo,
      type: 'Fleet',
      title: `${config.busType} (${config.acType}) - ${config.serviceType === 'local' ? 'Local Trip' : 'Outstation'}`,
      vehicleName: config.busType,
      image: '/images/fleet/bus_25_seater.jpg',
      startDate: travelDate,
      endDate: returnDate || travelDate,
      pickupDate: travelDate,
      returnDate: returnDate || travelDate,
      pickupLocation,
      specialRequests: `${config.serviceType === 'outstation' && config.route ? `Route: ${config.route}. ` : ''}Drop: ${dropLocation || 'N/A'}. ${specialRequests}`.trim(),
      guestsCount: config.seats,
      totalPrice: totalCost,
      totalAmount: totalCost,
      depositPaid: 500,
      customerName: fullName.trim(),
      customerEmail: (currentUser?.email || email.trim()).toLowerCase(),
      email: (currentUser?.email || email.trim()).toLowerCase(),
      customerPhone: phone.trim(),
      phone: phone.trim(),
      accountEmail: (currentUser?.email || email.trim()).toLowerCase(),
      userEmail: (currentUser?.email || email.trim()).toLowerCase(),
      licenseNumber: 'N/A-BUS',
      agreementAccepted: true,
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
      termsVersion: '2026.1-STANDARD',
      status: 'pending_verification',
      paymentMethod: 'Direct UPI',
      utrNumber,
      paymentScreenshot: paymentScreenshot || '',
      createdAt: new Date().toISOString(),
    };

    // Save locally
    try {
      const existingStr = localStorage.getItem('aarambha_user_bookings');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      existing.unshift(bookingPayload);
      localStorage.setItem('aarambha_user_bookings', JSON.stringify(existing));
      window.dispatchEvent(new Event('aarambha_booking_updated'));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }

    // Sync to backend API
    try {
      await apiFetch('/api/fleet/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingPayload),
      });
    } catch (err) {
      console.warn('Backend sync warning:', err);
    }

    setIsSubmitting(false);
    setIsPaymentStep(false);
    setBookingSuccess({
      refNo,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      travelDate,
      returnDate,
      totalCost,
      depositPaid: 500,
      invoiceNumber: invNum,
      utrNumber,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadInvoice = () => {
    if (!bookingSuccess) return;
    const invoiceData: InvoiceData = {
      invoiceNumber: bookingSuccess.invoiceNumber,
      invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      bookingType: 'car',
      bookingCode: bookingSuccess.refNo,
      customerName: bookingSuccess.fullName,
      customerPhone: bookingSuccess.phone,
      customerEmail: bookingSuccess.email,
      carModel: `${config.busType} (${config.acType})`,
      pickupLocation,
      rentalStartDate: bookingSuccess.travelDate,
      rentalEndDate: bookingSuccess.returnDate || bookingSuccess.travelDate,
      numberOfDays: 1,
      perDayRate: totalCost,
      totalAmount: bookingSuccess.totalCost,
      depositPaid: bookingSuccess.depositPaid,
      balanceAmount: bookingSuccess.totalCost - bookingSuccess.depositPaid,
      paymentMode: 'Direct Confirmation',
      paymentStatus: 'Confirmed',
      transactionId: bookingSuccess.refNo,
    };
    generateInvoicePDF(invoiceData);
  };

  /* ─── UPI PAYMENT STEP ────────────────────────────────────────── */
  if (isPaymentStep) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans">
        <Navbar vertical="fleet" />
        <section className="flex-1 py-12 px-6">
          <div className="max-w-2xl mx-auto">
            <UPIPaymentVerificationSection
              bookingCode={bookingRef}
              itemTitle={`${config.busType} (${config.acType})`}
              itemType="car"
              totalPrice={totalCost}
              depositAmount={500}
              customerName={fullName}
              customerPhone={phone}
              onConfirmPayment={handleConfirmUpiPayment}
              onBack={() => setIsPaymentStep(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  /* ─── BOOKING SUCCESS SCREEN ──────────────────────────────────── */
  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans">
        <Navbar vertical="fleet" />
        <section className="flex-1 flex items-center justify-center py-16 px-6">
          <div className="max-w-2xl w-full bg-white rounded-3xl border border-gray-200 shadow-2xl p-8 sm:p-10 text-center space-y-6">
            {liveBookingStatus === 'Confirmed' ? (
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-100 shadow-inner animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border-4 border-amber-100 shadow-inner animate-pulse">
                <Clock className="w-10 h-10" />
              </div>
            )}

            <div className="space-y-2">
              {liveBookingStatus === 'Confirmed' ? (
                <span className="px-3.5 py-1 bg-emerald-100 text-emerald-900 text-xs font-extrabold rounded-full uppercase tracking-wider font-syne border border-emerald-300">
                  ✓ BUS RESERVATION OFFICIALLY CONFIRMED
                </span>
              ) : (
                <span className="px-3.5 py-1 bg-amber-100 text-amber-900 text-xs font-extrabold rounded-full uppercase tracking-wider font-syne border border-amber-300">
                  ⏳ UNDER VERIFICATION • PROVISIONAL BUS BOOKING
                </span>
              )}

              <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-[#000000]">
                Booking #{bookingSuccess.refNo}
              </h2>

              {liveBookingStatus === 'Confirmed' ? (
                <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed font-semibold">
                  Congratulations <strong className="text-black">{bookingSuccess.fullName}</strong>! Your payment has been verified by the Admin and your bus booking for <strong className="text-black">{config.busType}</strong> is officially confirmed!
                </p>
              ) : (
                <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                  Thank you <strong className="text-black">{bookingSuccess.fullName}</strong>! We have received your advance lock deposit (UTR: <span className="font-mono font-bold text-indigo-700">{bookingSuccess.utrNumber || submittedUtr}</span>). Our desk is verifying it right now.
                </p>
              )}
            </div>

            <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-200/80 text-left text-xs space-y-3">
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500">Bus Type:</span>
                <strong className="text-[#000000] font-syne">{config.busType} ({config.acType})</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500">Service Route:</span>
                <strong className="text-[#000000] capitalize">{config.serviceType}{config.route ? ` — ${config.route}` : ''}</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500">Travel Date:</span>
                <strong className="text-[#000000]">{bookingSuccess.travelDate}</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500">Pickup Location:</span>
                <strong className="text-[#000000]">{pickupLocation}</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500">Submitted UTR:</span>
                <strong className="text-indigo-700 font-mono font-bold">{bookingSuccess.utrNumber || submittedUtr}</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-200">
                <span className="text-gray-500">Lock Deposit:</span>
                <strong className="text-[#5266EB] font-bold">₹500 (Submitted via UPI)</strong>
              </div>
              <div className="flex justify-between pt-1 text-sm font-extrabold text-[#000000]">
                <span>Balance Payable to Driver:</span>
                <span className="text-[#5266EB] font-syne">₹{(bookingSuccess.totalCost - 500).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {liveBookingStatus === 'Confirmed' ? (
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> Download Official Confirmed Tax Invoice
                </button>
              ) : (
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full py-4 bg-[#5266EB] hover:bg-[#3E51D4] text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#5266EB]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> Download Provisional Booking Receipt
                </button>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/918208211478?text=${encodeURIComponent(`Hi Aarambha Travels, I have submitted UPI payment for Bus Booking #${bookingSuccess.refNo} (${config.busType}, UTR: ${bookingSuccess.utrNumber || submittedUtr}). Please confirm.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all text-center block shadow-md"
                >
                  Notify Desk on WhatsApp
                </a>
                <Link
                  href="/my-bookings"
                  className="flex-1 py-3.5 border border-gray-300 bg-white hover:bg-gray-50 text-[#111111] rounded-2xl font-bold text-xs uppercase tracking-wider transition-all text-center block"
                >
                  View My Bookings
                </Link>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  /* ─── MAIN BOOKING FORM ───────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-[#5266EB] selection:text-white">
      <Navbar vertical="fleet" />

      {/* STEP HEADER */}
      <section className="bg-[#111111] text-white py-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-4">
          <Link
            href={config.backLink}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#5266EB]" /> {config.backLabel}
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5266EB] bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                BOOKING DETAILS & CONFIRMATION
              </span>
              <h1 className="font-syne text-2xl sm:text-4xl font-extrabold text-white mt-1">
                Book {config.busType} ({config.acType})
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                {config.serviceType === 'local' ? 'Pune Local Trip — 8 Hrs / 80 KM Package' : `Outstation${config.route ? ` — ${config.route}` : ''}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT GRID */}
      <section className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT: FORM FIELDS (2/3) */}
            <div className="lg:col-span-2 space-y-8">

              {/* SECTION 1: Travel Dates */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#5266EB]" />
                  <h3 className="font-syne font-bold text-sm">1. Travel Dates</h3>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Travel Date *</label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      min={todayStr}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAFAFC] border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#5266EB] focus:border-[#5266EB] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={travelDate}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAFAFC] border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#5266EB] focus:border-[#5266EB] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Pickup Location *</label>
                    <select
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAFAFC] border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#5266EB] focus:border-[#5266EB] outline-none transition-all"
                    >
                      <option value="Green Hills Society, Katraj, Pune (HQ)">Green Hills Society, Katraj, Pune (HQ)</option>
                      <option value="Pune Airport">Pune Airport</option>
                      <option value="Pune Railway Station">Pune Railway Station</option>
                      <option value="Swargate Bus Stand">Swargate Bus Stand</option>
                      <option value="Custom Location (specify in special requests)">Custom Location</option>
                    </select>
                  </div>
                  {config.serviceType === 'outstation' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Destination</label>
                      <input
                        type="text"
                        value={dropLocation}
                        onChange={(e) => setDropLocation(e.target.value)}
                        placeholder={config.route || 'e.g., Mumbai, Mahabaleshwar'}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAFAFC] border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#5266EB] focus:border-[#5266EB] outline-none transition-all"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: Account / Auth */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#5266EB]" />
                  <h3 className="font-syne font-bold text-sm">2. Your Account</h3>
                </div>
                <div className="p-6">
                  {currentUser ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#5266EB]/20 text-[#5266EB] font-bold text-base flex items-center justify-center border border-[#5266EB]/30">
                          {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-800">{currentUser.name}</div>
                          <div className="text-xs text-gray-500">{currentUser.email}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Switch
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex gap-1 bg-gray-100 rounded-full p-1">
                        <button type="button" onClick={() => setAuthTab('signup')} className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${authTab === 'signup' ? 'bg-[#5266EB] text-white' : 'text-gray-500'}`}>
                          Sign Up
                        </button>
                        <button type="button" onClick={() => setAuthTab('login')} className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${authTab === 'login' ? 'bg-[#5266EB] text-white' : 'text-gray-500'}`}>
                          Log In
                        </button>
                      </div>

                      <GoogleAuthButton
                        onSuccess={(u) => {
                          setCurrentUser(u);
                          setFullName(u.name);
                          setEmail(u.email);
                        }}
                      />

                      <div className="relative flex items-center gap-3 text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span>or use email</span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      {authTab === 'signup' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name *" className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAFAFC] border border-gray-200 text-sm focus:ring-2 focus:ring-[#5266EB] outline-none" />
                          </div>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp Number *" className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAFAFC] border border-gray-200 text-sm focus:ring-2 focus:ring-[#5266EB] outline-none" />
                          </div>
                        </div>
                      )}

                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address *" className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAFAFC] border border-gray-200 text-sm focus:ring-2 focus:ring-[#5266EB] outline-none" />
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Password (min 6 chars) *" className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAFAFC] border border-gray-200 text-sm focus:ring-2 focus:ring-[#5266EB] outline-none" />
                      </div>

                      <button
                        type="button"
                        onClick={handleInlineAuth}
                        disabled={authLoading}
                        className="w-full py-3 rounded-xl bg-[#5266EB] hover:bg-[#3E51D4] text-white text-xs font-extrabold uppercase tracking-wider transition-all disabled:opacity-50"
                      >
                        {authLoading ? 'Processing...' : authTab === 'signup' ? 'Create Account & Continue' : 'Log In & Continue'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: Contact Details */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#5266EB]" />
                  <h3 className="font-syne font-bold text-sm">3. Contact Details</h3>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className="w-full px-4 py-3 rounded-xl bg-[#FAFAFC] border border-gray-200 text-sm focus:ring-2 focus:ring-[#5266EB] outline-none" />
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">WhatsApp Number *</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 rounded-xl bg-[#FAFAFC] border border-gray-200 text-sm focus:ring-2 focus:ring-[#5266EB] outline-none" />
                  </div>
                  <div className="relative sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl bg-[#FAFAFC] border border-gray-200 text-sm focus:ring-2 focus:ring-[#5266EB] outline-none" />
                  </div>
                  <div className="relative sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Special Requests (optional)</label>
                    <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Any specific pickup time, extra stops, etc." rows={3} className="w-full px-4 py-3 rounded-xl bg-[#FAFAFC] border border-gray-200 text-sm focus:ring-2 focus:ring-[#5266EB] outline-none resize-none" />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Terms */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#5266EB]" />
                  <h3 className="font-syne font-bold text-sm">4. Terms & Acceptance</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    {BUS_RULES_AND_GUIDELINES.map((rule, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <Check className="w-3.5 h-3.5 text-[#5266EB] mt-0.5 flex-shrink-0" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[#5266EB] focus:ring-[#5266EB] mt-0.5"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      I agree to the <Link href="/terms" className="text-[#5266EB] font-bold hover:underline" target="_blank">Terms & Conditions</Link>, the rules & guidelines above, and confirm that my booking details are accurate. I understand that extra KM/hour charges apply as specified.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT: PRICING SUMMARY (1/3) */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Bus Summary Card */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={config.seats <= 17 ? '/images/fleet/bus_urbania.jpg' : config.seats <= 27 ? '/images/fleet/bus_25_seater.jpg' : config.seats <= 40 ? '/images/fleet/bus_35_seater.jpg' : '/images/fleet/bus_45_seater.jpg'}
                      alt={config.busType}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                      {config.seats} Seats • {config.acType}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-syne font-extrabold text-base">{config.busType}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Bus className="w-3.5 h-3.5 text-[#5266EB]" />
                      <span className="capitalize">{config.serviceType}{config.route ? ` — ${config.route}` : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 space-y-4">
                  <h4 className="font-syne font-bold text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#5266EB]" />
                    Price Summary
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">{config.serviceType === 'local' ? 'Package (8 Hrs / 80 KM)' : 'Package Rate'}</span><span className="font-bold">₹{config.basePrice.toLocaleString('en-IN')}</span></div>
                    <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-sm">
                      <span>Total Estimated Cost</span>
                      <span className="text-emerald-700">₹{totalCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between pt-1 text-xs text-emerald-600 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                      <span>Lock Vehicle Deposit (Payable Now):</span>
                      <span>₹500 (100% Refundable)</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    * Extra KM/hour charges apply beyond package limits. Toll, parking & driver allowance charged as actuals.
                  </p>
                </div>

                {/* Validation Error */}
                {validationError && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-[#5266EB] hover:bg-[#3E51D4] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Proceed to UPI Advance Payment (₹500)
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Contact Help */}
                <div className="text-center text-[10px] text-gray-400 space-y-1">
                  <p>Need help? Call <a href={`tel:${SHARED_BUS_CONTACT.callPhone}`} className="text-[#5266EB] font-bold">{SHARED_BUS_CONTACT.callPhoneDisplay}</a></p>
                  <p>WhatsApp: <a href={`https://wa.me/91${SHARED_BUS_CONTACT.whatsappPhone}`} className="text-green-600 font-bold">{SHARED_BUS_CONTACT.whatsappPhoneDisplay}</a></p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
