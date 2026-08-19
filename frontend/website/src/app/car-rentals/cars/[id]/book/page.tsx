'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  Car,
  MapPin,
  Sparkles,
  CreditCard,
  FileText,
  Clock,
  ArrowRight,
  Check,
  Plus,
  Minus,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';
import { FLEET_VEHICLES } from '@/constants/carsData';
import { apiFetch } from '@/services/api-client';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';

import { generateInvoicePDF, getNextInvoiceNumber, type InvoiceData } from '@/utils/generateInvoicePDF';

export default function CarBookingCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const carId = params?.id as string;

  const vehicle = FLEET_VEHICLES.find((v) => v.id === carId) || FLEET_VEHICLES[0];

  // Rental Dates State
  const todayStr = new Date().toISOString().split('T')[0];
  const [pickupDate, setPickupDate] = useState(() => todayStr);
  const [returnDate, setReturnDate] = useState(() => {
    const future = new Date(Date.now() + 86400000 * 3);
    return future.toISOString().split('T')[0];
  });

  const [pickupLocation, setPickupLocation] = useState('Green Hills Society, Katraj, Pune (HQ)');
  const [selectedColor, setSelectedColor] = useState(vehicle.availableColors[0] || '#FF3B30');

  // Customer Auth & Contact State
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone?: string } | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Inline Quick Auth state
  const [authTab, setAuthTab] = useState<'signup' | 'login'>('signup');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

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
        setValidationError('Please enter your full name as per your Driving License.');
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
          createdAt: new Date().toISOString(),
        };

        registeredUsers.push(newUser);
        try {
          localStorage.setItem('aarambha_registered_users', JSON.stringify(registeredUsers));
        } catch (_e) {}

        const profile = { name: newUser.name, email: newUser.email, phone: newUser.phone, loggedIn: true };
        try {
          localStorage.setItem('aarambha_user', JSON.stringify(profile));
          window.dispatchEvent(new Event('aarambha_auth_changed'));
        } catch (_e) {}

        setCurrentUser(profile);
      } else {
        const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (existing && existing.password && existing.password !== authPassword) {
          setValidationError('Incorrect password. Please try again.');
          return;
        }

        const profile = {
          name: existing ? existing.name : (fullName || email.split('@')[0] || 'Valued Member'),
          email: email.trim().toLowerCase(),
          phone: existing ? existing.phone : (phone || '+91 82082 11478'),
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

  // Add-on Options State
  const [doorstepDelivery, setDoorstepDelivery] = useState(true);
  const [zeroDepInsurance, setZeroDepInsurance] = useState(true);
  const [childSeat, setChildSeat] = useState(false);
  const [additionalDriver, setAdditionalDriver] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  // Date Change Handler with automatic range correction
  const handlePickupDateChange = (newDate: string) => {
    setPickupDate(newDate);
    if (newDate > returnDate) {
      const nextDay = new Date(new Date(newDate).getTime() + 86400000).toISOString().split('T')[0];
      setReturnDate(nextDay);
    }
  };

  const handleReturnDateChange = (newDate: string) => {
    if (newDate < pickupDate) {
      setReturnDate(pickupDate);
    } else {
      setReturnDate(newDate);
    }
  };

  // Rental Calculation Math
  const startD = new Date(pickupDate || Date.now());
  const endD = new Date(returnDate || Date.now() + 86400000 * 3);
  const diffTime = Math.max(86400000, endD.getTime() - startD.getTime());
  const computedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const dailyRateINR = vehicle.pricePerDay;
  
  const baseRentalCost = dailyRateINR * computedDays;
  const doorstepFee = doorstepDelivery ? 300 : 0;
  const zeroDepFee = zeroDepInsurance ? 499 : 0;
  const childSeatFee = childSeat ? 200 * computedDays : 0;
  const extraDriverFee = additionalDriver ? 400 : 0;

  const grandTotalCost = baseRentalCost + doorstepFee + zeroDepFee + childSeatFee + extraDriverFee;
  const depositAmount = 500;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!currentUser) {
      setValidationError('Please log in or create an account in Section 2 to confirm your booking.');
      return;
    }

    // Strict Field Validations
    if (!fullName.trim()) {
      setValidationError('Please enter your full name as per your Driving License.');
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
    if (!licenseNumber.trim()) {
      setValidationError('Please enter your Driving License number for insurance verification.');
      return;
    }
    if (!pickupDate || !returnDate) {
      setValidationError('Please select valid pickup and return dates.');
      return;
    }
    if (!termsAccepted) {
      setValidationError('Please accept the terms & conditions to proceed with booking.');
      return;
    }

    setIsSubmitting(true);

    const bookingRef = 'FL-' + Math.floor(100000 + Math.random() * 900000);
    const invNum = getNextInvoiceNumber('car');

    const bookingPayload = {
      id: bookingRef,
      bookingCode: bookingRef,
      type: 'car',
      title: vehicle.name,
      vehicleName: vehicle.name,
      image: vehicle.image,
      startDate: pickupDate,
      endDate: returnDate,
      pickupDate,
      returnDate,
      pickupLocation,
      guestsCount: 1,
      totalPrice: grandTotalCost,
      depositPaid: depositAmount,
      customerName: fullName.trim(),
      customerEmail: (currentUser?.email || email.trim()).toLowerCase(),
      email: (currentUser?.email || email.trim()).toLowerCase(),
      customerPhone: phone.trim(),
      phone: phone.trim(),
      accountEmail: (currentUser?.email || email.trim()).toLowerCase(),
      userEmail: (currentUser?.email || email.trim()).toLowerCase(),
      licenseNumber: licenseNumber.trim().toUpperCase(),
      addons: {
        doorstepDelivery,
        zeroDepInsurance,
        childSeat,
        additionalDriver,
      },
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

    // Save locally to user bookings
    try {
      const existingStr = localStorage.getItem('aarambha_user_bookings');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      existing.unshift(bookingPayload);
      localStorage.setItem('aarambha_user_bookings', JSON.stringify(existing));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }

    // Sync to backend API
    try {
      await apiFetch('/api/fleet/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingPayload),
      });
    } catch (err) {}

    // Send WhatsApp notification
    const textMessage = 
      `*AARAMBHA VEHICLE BOOKING CONFIRMED*%0A` +
      `━━━━━━━━━━━━━━━━━━━━%0A` +
      `📌 *Ref No:* #${bookingRef}%0A` +
      `🚗 *Vehicle:* ${vehicle.name} (${vehicle.category})%0A` +
      `👤 *Customer:* ${fullName}%0A` +
      `📞 *Phone:* ${phone}%0A` +
      `🪪 *DL No:* ${licenseNumber.toUpperCase()}%0A` +
      `📅 *Dates:* ${pickupDate} to ${returnDate} (${computedDays} Days)%0A` +
      `📍 *Pickup:* ${pickupLocation}%0A` +
      `💰 *Total Cost:* ₹${grandTotalCost.toLocaleString('en-IN')}%0A` +
      `💳 *Deposit Paid:* ₹500 (Online Deposit)%0A` +
      `━━━━━━━━━━━━━━━━━━━━%0A` +
      `_Self-Drive Booking Confirmation_`;

    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSuccess({
        refNo: bookingRef,
        invoiceNumber: invNum,
        totalCost: grandTotalCost,
        depositPaid: depositAmount,
        pickupDate,
        returnDate,
        days: computedDays,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        licenseNumber: licenseNumber.trim().toUpperCase(),
        pickupLocation,
        whatsappUrl: `https://wa.me/918208211478?text=${textMessage}`,
      });
    }, 800);
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
      carModel: `${vehicle.name} (${vehicle.category})`,
      pickupLocation: bookingSuccess.pickupLocation,
      rentalStartDate: bookingSuccess.pickupDate,
      rentalEndDate: bookingSuccess.returnDate,
      numberOfDays: bookingSuccess.days,
      perDayRate: dailyRateINR,
      totalAmount: bookingSuccess.totalCost,
      depositPaid: bookingSuccess.depositPaid,
      balanceAmount: bookingSuccess.totalCost - bookingSuccess.depositPaid,
      paymentMode: 'Online Deposit',
      paymentStatus: 'Partially Paid',
      transactionId: bookingSuccess.refNo,
    };
    generateInvoicePDF(invoiceData);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-[#FF3B30] selection:text-white">
      
      <Navbar vertical="fleet" />

      {/* STEP NAVIGATION HEADER */}
      <section className="bg-[#111111] text-white py-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-4">
          
          <Link
            href={`/car-rentals/cars/${vehicle.id}`}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#FF3B30]" /> Back to {vehicle.name} Details
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF3B30] bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                STEP 2 OF 2: BOOKING DETAILS & OPTIONS
              </span>
              <h1 className="font-syne text-2xl sm:text-4xl font-extrabold text-white mt-1">
                Complete Booking for {vehicle.name}
              </h1>
            </div>

            {/* Stepper Indicator */}
            <div className="flex items-center gap-3 text-xs font-syne font-bold">
              <Link
                href={`/car-rentals/cars/${vehicle.id}`}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
                <span>1. Vehicle Specs</span>
              </Link>
              <span className="text-gray-600">→</span>
              <div className="flex items-center gap-1.5 text-[#FF3B30]">
                <span className="w-6 h-6 rounded-full bg-[#FF3B30] text-white flex items-center justify-center text-[10px]">2</span>
                <span>2. Booking & Guest Details</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN CHECKOUT FORM SECTION */}
      <section className="py-12 bg-[#FAFAFC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          {bookingSuccess ? (
            /* SUCCESS CONFIRMATION VOUCHER */
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-2xl space-y-6 text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full uppercase tracking-wider font-syne border border-emerald-200">
                  RESERVATION CONFIRMED
                </span>
                <h2 className="font-syne text-3xl font-extrabold text-[#111111]">
                  Booking #{bookingSuccess.refNo}
                </h2>
                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed font-normal">
                  Congratulations <strong className="text-[#111111]">{bookingSuccess.fullName}</strong>! Your self-drive vehicle <strong className="text-[#111111]">{vehicle.name}</strong> is reserved with a ₹500 deposit.
                </p>
              </div>

              <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-200/80 text-left text-xs space-y-3">
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Vehicle:</span>
                  <strong className="text-[#111111] font-syne">{vehicle.name} ({vehicle.category})</strong>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Rental Period:</span>
                  <strong className="text-[#111111]">{bookingSuccess.pickupDate} → {bookingSuccess.returnDate} ({bookingSuccess.days} Days)</strong>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Pickup Point:</span>
                  <strong className="text-[#111111]">{pickupLocation}</strong>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500">DL Number:</span>
                  <strong className="text-[#111111] font-mono">{bookingSuccess.licenseNumber}</strong>
                </div>
                <div className="flex justify-between pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Online Lock Deposit Paid:</span>
                  <strong className="text-emerald-600 font-bold">₹500 (Confirmed)</strong>
                </div>
                <div className="flex justify-between pt-1 text-sm font-extrabold text-[#111111]">
                  <span>Total Amount Payable at Pickup:</span>
                  <span className="text-[#FF3B30] font-syne">₹{(bookingSuccess.totalCost - 500).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Download Official PDF Invoice
                </button>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={bookingSuccess.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3.5 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all text-center block shadow-md"
                  >
                    Send on WhatsApp
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
          ) : (
            <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT 7-COLS: BOOKING & GUEST DETAILS OPTIONS FORM */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Validation Error Banner */}
                {validationError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-center gap-2 shadow-sm animate-shake">
                    <span>⚠️</span>
                    <span>{validationError}</span>
                  </div>
                )}

                {/* 1. RENTAL DATES & PICKUP LOCATION */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-5 shadow-sm">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <div className="p-2 rounded-xl bg-red-50 text-[#FF3B30]">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-syne text-base font-bold text-[#111111]">
                        1. Select Rental Dates & Pickup Location
                      </h3>
                      <p className="text-[11px] text-gray-500">Doorstep delivery available across Goa</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#111111]">Pick-up Date *</label>
                      <input
                        type="date"
                        required
                        value={pickupDate}
                        min={todayStr}
                        onChange={(e) => handlePickupDateChange(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#FF3B30]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#111111]">Return Date *</label>
                      <input
                        type="date"
                        required
                        value={returnDate}
                        min={pickupDate}
                        onChange={(e) => handleReturnDateChange(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#FF3B30]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#111111]">Doorstep Delivery / Pickup Location *</label>
                    <select
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#111111] focus:bg-white focus:outline-none focus:border-[#FF3B30]"
                    >
                      <option value="Green Hills Society, Katraj, Pune (HQ)">📍 Green Hills Society, Katraj, Pune (HQ Direct Pickup)</option>
                      <option value="Pune Airport (PNQ) Terminal">✈️ Pune Airport (PNQ) — Terminal Pickup</option>
                      <option value="Pune Railway Station">🚉 Pune Railway Station — Direct Delivery</option>
                      <option value="Katraj / Bharati Vidyapeeth Area">🏨 Katraj / Bharati Vidyapeeth Delivery</option>
                      <option value="Baner / Balewadi / Hinjewadi">🏨 Baner / Balewadi / Hinjewadi Delivery</option>
                      <option value="Viman Nagar / Koregaon Park">🏨 Viman Nagar / Koregaon Park Delivery</option>
                    </select>
                  </div>
                </div>

                {/* 2. PRIMARY DRIVER DETAILS */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-red-50 text-[#FF3B30]">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-syne text-base font-bold text-[#111111]">
                          2. Driver & Customer Information
                        </h3>
                        <p className="text-[11px] text-gray-500">Verified membership required to prevent fake bookings</p>
                      </div>
                    </div>

                    {currentUser && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Member
                      </span>
                    )}
                  </div>

                  {!currentUser ? (
                    /* Inline Auth Box */
                    <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-4">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Please Log In or Create Account to Lock Your Vehicle</span>
                      </div>

                      {/* Switcher */}
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-amber-200">
                        <button
                          type="button"
                          onClick={() => setAuthTab('signup')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-syne transition-all ${
                            authTab === 'signup' ? 'bg-[#111111] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          CREATE ACCOUNT
                        </button>
                        <button
                          type="button"
                          onClick={() => setAuthTab('login')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-syne transition-all ${
                            authTab === 'login' ? 'bg-[#111111] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          LOG IN
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {authTab === 'signup' && (
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-800">Full Name *</label>
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="e.g. Rahul Sharma"
                              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF3B30]"
                            />
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-800">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. rahul@example.com"
                            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF3B30]"
                          />
                        </div>

                        {authTab === 'signup' && (
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-800">WhatsApp Phone *</label>
                            <input
                              type="tel"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="e.g. +91 82082 11478"
                              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF3B30]"
                            />
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-800">Password *</label>
                          <input
                            type="password"
                            required
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#FF3B30]"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleInlineAuth}
                        disabled={authLoading}
                        className="w-full py-3 bg-[#111111] hover:bg-black text-white font-syne font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Lock className="w-3.5 h-3.5 text-[#FF3B30]" />
                        <span>{authLoading ? 'Verifying Account...' : authTab === 'signup' ? 'Create Account & Unlock Booking' : 'Log In & Unlock Booking'}</span>
                      </button>

                      <div className="pt-1">
                        <div className="flex items-center justify-center relative my-2">
                          <div className="w-full border-t border-amber-200" />
                          <span className="bg-amber-50/70 px-2 text-[10px] font-bold text-amber-800 uppercase tracking-wider absolute">
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
                          onError={(err) => setValidationError(typeof err === 'string' ? err : 'Google Sign-In failed')}
                          className="w-full"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Authenticated Member Section */
                    <div className="space-y-4">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center font-syne">
                            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <strong className="text-gray-900 block">{currentUser.name}</strong>
                            <span className="text-[10px] text-gray-500">{currentUser.email} • Authenticated Account</span>
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#111111]">Full Name *</label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#FF3B30]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#111111]">WhatsApp Phone *</label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#FF3B30]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#111111]">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#FF3B30]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#111111]">Driving License Number *</label>
                          <input
                            type="text"
                            required
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                            placeholder="e.g. DL-0420210098765"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium uppercase font-mono focus:bg-white focus:outline-none focus:border-[#FF3B30]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. OPTIONAL RENTAL ADD-ONS */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-red-50 text-[#FF3B30]">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-syne text-base font-bold text-[#111111]">
                          3. Add-on Rental Services & Insurance
                        </h3>
                        <p className="text-[11px] text-gray-500">Select extra preferences for your drive</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-white cursor-pointer transition-all">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={doorstepDelivery}
                          onChange={(e) => setDoorstepDelivery(e.target.checked)}
                          className="w-4 h-4 text-[#FF3B30] rounded focus:ring-[#FF3B30]"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-[#111111]">Doorstep Airport & Hotel Handover</h4>
                          <p className="text-[11px] text-gray-500">Clean vehicle delivered directly to your location</p>
                        </div>
                      </div>
                      <span className="font-syne text-xs font-bold text-[#111111]">+₹300</span>
                    </label>

                    <label className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-white cursor-pointer transition-all">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={zeroDepInsurance}
                          onChange={(e) => setZeroDepInsurance(e.target.checked)}
                          className="w-4 h-4 text-[#FF3B30] rounded focus:ring-[#FF3B30]"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-[#111111]">Zero-Depreciation Insurance Shield</h4>
                          <p className="text-[11px] text-gray-500">100% collision damage waiver protection</p>
                        </div>
                      </div>
                      <span className="font-syne text-xs font-bold text-[#111111]">+₹499</span>
                    </label>

                    <label className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-white cursor-pointer transition-all">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={childSeat}
                          onChange={(e) => setChildSeat(e.target.checked)}
                          className="w-4 h-4 text-[#FF3B30] rounded focus:ring-[#FF3B30]"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-[#111111]">Child Safety Seat</h4>
                          <p className="text-[11px] text-gray-500">Infant ISOFIX safety seat included</p>
                        </div>
                      </div>
                      <span className="font-syne text-xs font-bold text-[#111111]">+₹200/day</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* RIGHT 5-COLS: SELECTED CAR SUMMARY & PRICE LEDGER */}
              <div className="lg:col-span-5 space-y-6 sticky top-24">
                
                {/* VEHICLE SUMMARY CARD */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden space-y-6 p-6">
                  
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SELECTED VEHICLE</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-[#FF3B30] font-bold text-[10px]">
                      {vehicle.category}
                    </span>
                  </div>

                  {/* Image & Title */}
                  <div className="space-y-3">
                    <div className="relative h-44 bg-gray-900 rounded-2xl overflow-hidden border border-gray-200">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                        {vehicle.specs.transmission} • {vehicle.specs.fuelType}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-syne text-xl font-extrabold text-[#111111]">
                        {vehicle.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {vehicle.specs.engine} • {vehicle.specs.passengers} Passengers
                      </p>
                    </div>
                  </div>

                  {/* PRICE SUMMARY BREAKDOWN LEDGER */}
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-xs space-y-2.5">
                    <div className="flex justify-between text-gray-600">
                      <span>Daily Rate (₹{dailyRateINR.toLocaleString('en-IN')} × {computedDays} Days):</span>
                      <strong className="text-[#111111] font-syne">₹{baseRentalCost.toLocaleString('en-IN')}</strong>
                    </div>

                    {doorstepDelivery && (
                      <div className="flex justify-between text-gray-600">
                        <span>Doorstep Delivery:</span>
                        <strong className="text-[#111111]">₹300</strong>
                      </div>
                    )}

                    {zeroDepInsurance && (
                      <div className="flex justify-between text-gray-600">
                        <span>Zero-Dep Insurance Waiver:</span>
                        <strong className="text-[#111111]">₹499</strong>
                      </div>
                    )}

                    {childSeat && (
                      <div className="flex justify-between text-gray-600">
                        <span>Child Safety Seat ({computedDays} Days):</span>
                        <strong className="text-[#111111]">₹{childSeatFee.toLocaleString('en-IN')}</strong>
                      </div>
                    )}

                    <div className="flex justify-between pt-3 border-t border-gray-200 text-sm font-extrabold">
                      <span className="text-[#111111]">Total Rental Amount:</span>
                      <span className="text-[#FF3B30] font-syne">₹{grandTotalCost.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between pt-1 text-xs text-emerald-600 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                      <span>Lock Vehicle Deposit (Payable Now):</span>
                      <span>₹500 (100% Refundable)</span>
                    </div>
                  </div>

                  {/* MANDATORY TERMS & CONDITIONS CHECKBOX */}
                  <div className="space-y-2">
                    <label className={`flex items-start gap-2.5 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
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
                          href="/car-rentals#terms"
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

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !termsAccepted}
                    className={`w-full py-4 rounded-2xl font-extrabold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-xl ${
                      !termsAccepted || isSubmitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 shadow-none'
                        : 'bg-[#FF3B30] hover:bg-[#E03126] text-white shadow-red-600/30 cursor-pointer hover:scale-[1.01]'
                    }`}
                  >
                    {isSubmitting ? (
                      <span>Processing Reservation...</span>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Confirm & Lock Booking (₹500 Deposit)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                    🔒 Free cancellation up to 24 hours prior to pickup date. Remaining balance payable at vehicle delivery.
                  </p>

                </div>

              </div>

            </form>
          )}

        </div>
      </section>

      {/* CAR RENTAL TERMS & CONDITIONS */}
      <TermsConditionsSection mode="cars" />

      <Footer />

    </div>
  );
}
