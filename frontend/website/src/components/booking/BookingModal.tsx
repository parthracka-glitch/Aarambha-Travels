'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  User,
  Phone,
  Mail,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Download,
  ArrowRight,
  Users,
  Plus,
  Minus,
  ExternalLink,
  AlertCircle,
  QrCode,
  MapPin,
  FileCheck,
  Compass,
  Car,
} from 'lucide-react';
import { apiFetch } from '@/services/api-client';
import { generateInvoicePDF, getNextInvoiceNumber, type InvoiceData } from '@/utils/generateInvoicePDF';
import UPIPaymentVerificationSection from './UPIPaymentVerificationSection';
import { SHARED_BUS_CONTACT } from '@/constants/busData';
import { SHARED_CAR_CONTACT } from '@/constants/carsData';
import { SHARED_TOUR_CONTACT } from '@/constants/toursData';

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

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('pune-swargate');
  const [customAddress, setCustomAddress] = useState('');
  const [idProofType, setIdProofType] = useState('aadhaar');
  const [specialNotes, setSpecialNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPaymentStep, setIsPaymentStep] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [submittedUtr, setSubmittedUtr] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [validationError, setValidationError] = useState('');
  const [liveBookingStatus, setLiveBookingStatus] = useState<'pending_verification' | 'Confirmed' | 'Rejected'>('pending_verification');

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

  // Sync auth state on mount and upon auth changes
  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem('aarambha_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setCurrentUser(parsed);
          if (parsed.name) setFullName(parsed.name);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.phone) setPhone(parsed.phone);
        }
      } catch {
        setCurrentUser(null);
      }
    };

    checkAuth();
    window.addEventListener('aarambha_auth_changed', checkAuth);
    return () => window.removeEventListener('aarambha_auth_changed', checkAuth);
  }, []);

  // Poll backend status while customer is on the confirmation screen
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

  if (!isOpen || !item) return null;

  // Rental math calculation
  const startD = new Date(startDate || Date.now());
  const endD = new Date(endDate || Date.now() + 86400000 * 3);
  const diffTime = Math.max(86400000, endD.getTime() - startD.getTime());
  const computedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const calculatedTotal = item.type === 'tour' ? item.price * Math.max(1, guests) : item.price * computedDays;
  const calculatedDeposit = item.type === 'tour' ? (item.deposit || 1999) * Math.max(1, guests) : (item.deposit || 500);
  const calculatedBalance = Math.max(0, calculatedTotal - calculatedDeposit);

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

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!fullName.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (!termsAccepted) {
      setValidationError('Please agree to the booking terms and cancellation guidelines.');
      return;
    }

    // Auto-save user session if not logged in
    try {
      const userObj = {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        loggedIn: true,
      };
      localStorage.setItem('aarambha_user', JSON.stringify(userObj));
      window.dispatchEvent(new Event('aarambha_auth_changed'));
    } catch {}

    const refNo = (item.type === 'car' ? 'AAR-CAR-' : 'AAR-TRIP-') + Math.floor(100000 + Math.random() * 900000);
    const invNum = getNextInvoiceNumber(item.type === 'car' ? 'car' : 'tour');
    setBookingRef(refNo);
    setInvoiceNumber(invNum);
    setIsPaymentStep(true);
  };

  const handleConfirmUpiPayment = async ({ utrNumber, paymentScreenshot }: { utrNumber: string; paymentScreenshot?: string }) => {
    if (!item) return;
    setIsSubmitting(true);
    setSubmittedUtr(utrNumber);

    const bookingPayload = {
      id: bookingRef,
      bookingCode: bookingRef,
      type: item.type === 'car' ? 'Fleet' : 'Tours',
      title: item.title,
      packageName: item.title,
      vehicleName: item.title,
      image: item.image,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      travelDate: startDate || new Date().toISOString().split('T')[0],
      durationDays: item.type === 'car' ? computedDays : undefined,
      guestsCount: Math.max(1, guests),
      paxCount: Math.max(1, guests),
      numberOfTravelers: Math.max(1, guests),
      perPersonPrice: item.price,
      totalPrice: calculatedTotal,
      totalAmount: calculatedTotal,
      depositPaid: calculatedDeposit,
      balanceAmount: calculatedBalance,
      customerName: fullName.trim(),
      customerEmail: email.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      customerPhone: phone.trim(),
      phone: phone.trim(),
      pickupLocation: pickupLocation === 'custom' ? customAddress : pickupLocation,
      idProofType: idProofType,
      specialNotes: specialNotes,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none">
      
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#EDE2D0] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Close Top-Right Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#493B34] border border-[#EDE2D0] transition-colors cursor-pointer shadow-sm"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          /* ─── SCREEN 1: INSTANT PROVISIONAL CONFIRMATION ──────────────── */
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-center space-y-5 font-sans">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C65A2E] block">
                RESERVATION SUBMITTED SUCCESSFULLY
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#493B34]">
                Advance Booking Received!
              </h3>
              <p className="text-xs text-[#756B63] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{fullName}</strong>. Your advance booking reference is{' '}
                <strong className="text-[#C65A2E] font-mono">{bookingRef}</strong>. Our Pune travel desk is verifying your UPI payment.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FCFAF6] border border-[#EDE2D0] text-left space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#EDE2D0]">
                <span className="font-bold text-xs text-[#493B34]">Verification Status</span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    liveBookingStatus === 'Confirmed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {liveBookingStatus === 'Confirmed' ? 'Verified & Confirmed' : 'Verification In Progress'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#756B63] block">Package / Vehicle</span>
                  <span className="font-semibold text-[#493B34]">{item.title}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#756B63] block">Primary Contact</span>
                  <span className="font-semibold text-[#493B34]">{fullName} ({phone})</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#756B63] block">Advance Paid</span>
                  <span className="font-bold text-emerald-700">₹{calculatedDeposit.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#756B63] block">Balance on Departure</span>
                  <span className="font-bold text-[#493B34]">₹{calculatedBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const isCar = item.type === 'car';
                  const invoiceData: InvoiceData = {
                    invoiceNumber: invoiceNumber || getNextInvoiceNumber(isCar ? 'car' : 'tour'),
                    invoiceDate: new Date().toLocaleDateString('en-IN'),
                    bookingType: isCar ? 'car' : 'tour',
                    bookingCode: bookingRef,
                    customerName: fullName,
                    customerEmail: email,
                    customerPhone: phone,
                    ...(isCar
                      ? {
                          carModel: item.title,
                          rentalStartDate: startDate || new Date().toISOString().split('T')[0],
                          rentalEndDate: endDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
                          numberOfDays: computedDays,
                          perDayRate: item.price,
                        }
                      : {
                          packageName: item.title,
                          travelDates: `${startDate || ''} → ${endDate || ''}`,
                          numberOfTravelers: guests,
                          perPersonPrice: item.price,
                        }),
                    totalAmount: calculatedTotal,
                    depositPaid: calculatedDeposit,
                    balanceAmount: calculatedBalance,
                    paymentMode: 'Direct UPI',
                    paymentStatus: 'Verification Pending',
                    transactionId: submittedUtr,
                  };
                  generateInvoicePDF(invoiceData);
                }}
                className="w-full py-3 bg-[#C65A2E] hover:bg-[#B24E25] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Download Tax Invoice PDF</span>
              </button>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-2.5 bg-white border border-[#EDE2D0] text-[#493B34] font-semibold text-xs rounded-xl hover:bg-[#FCFAF6] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : isPaymentStep ? (
          /* ─── SCREEN 2: DYNAMIC UPI QR & UTR VERIFICATION SCREEN ──────── */
          <div className="p-6 overflow-y-auto flex-1 min-h-0 max-h-[85vh]">
            <UPIPaymentVerificationSection
              bookingCode={bookingRef}
              itemTitle={item.title}
              itemType={item.type}
              totalPrice={calculatedTotal}
              depositAmount={calculatedDeposit}
              customerName={fullName}
              customerPhone={phone}
              onConfirmPayment={handleConfirmUpiPayment}
              onBack={() => setIsPaymentStep(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : (
          /* ─── SCREEN 3: COMPREHENSIVE TRIP RESERVATION FORM ────────────── */
          <form onSubmit={handleProceedToPayment} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            
            {/* Header with Luxury Brand Banner */}
            <div className="bg-[#493B34] text-white p-5 flex items-center gap-4 flex-shrink-0">
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 rounded-2xl object-cover border border-white/20 flex-shrink-0 bg-[#2D1F18]"
              />
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8B9A5] flex items-center gap-1.5">
                  {item.type === 'car' ? <Car className="w-3 h-3" /> : <Compass className="w-3 h-3" />}
                  <span>{item.type === 'car' ? 'Self-Drive Car Reservation' : 'Spiritual Yatra Reservation'}</span>
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-tight line-clamp-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-xs text-[#EDE2D0] font-medium">
                    ₹{item.price.toLocaleString('en-IN')} {item.type === 'car' ? '/day' : 'per person'}
                  </span>
                  <span className="text-[11px] font-bold text-[#E8B9A5] bg-white/10 px-2 py-0.5 rounded-md border border-white/15">
                    Advance: ₹{calculatedDeposit.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs font-sans">
              
              {/* Validation Error Banner */}
              {validationError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* ─── DATES / BATCH SELECTION ─── */}
              {item.type === 'tour' ? (
                activeBatches.length > 0 && (
                  <div className="space-y-2 bg-[#FCFAF6] border border-[#EDE2D0] p-3.5 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-[#493B34] flex items-center gap-1.5 text-xs">
                        <Calendar className="w-4 h-4 text-[#C65A2E]" /> Select Yatra Batch Date *
                      </label>
                      <span className="text-[10px] font-semibold text-[#756B63] bg-white px-2 py-0.5 rounded-md border border-[#EDE2D0]">
                        {activeBatches.filter((b: any) => !selectedMonth || b.month === selectedMonth).length} Departure Dates
                      </span>
                    </div>

                    {/* Month Switcher Tabs */}
                    {availableMonths.length > 1 && (
                      <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#EDE2D0] overflow-x-auto no-scrollbar">
                        {availableMonths.map((m: string) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => handleMonthChange(m)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                              selectedMonth === m
                                ? 'bg-[#C65A2E] text-white shadow-2xs'
                                : 'text-[#756B63] hover:text-[#493B34]'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Specific Batch Selection Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-h-40 overflow-y-auto">
                      {activeBatches
                        .filter((b: any) => !selectedMonth || b.month === selectedMonth)
                        .map((b: any) => {
                          const isSelected = selectedBatchId === b.id;
                          return (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => handleBatchSelect(b.id)}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-[#F8EFEA] border-[#C65A2E] shadow-2xs'
                                  : 'bg-white border-[#EDE2D0] hover:border-[#C65A2E]/50'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className={`text-xs font-bold ${isSelected ? 'text-[#C65A2E]' : 'text-[#493B34]'}`}>
                                  {b.label}
                                </span>
                                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#C65A2E] shrink-0" />}
                              </div>
                              <span className="text-[10px] text-[#756B63] mt-0.5 block">
                                {b.tag || 'Confirmed Group Batch'}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )
              ) : (
                /* Car Rental Date Range */
                <div className="bg-[#FCFAF6] border border-[#EDE2D0] p-3.5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#493B34] flex items-center gap-1.5 text-xs">
                      <Calendar className="w-4 h-4 text-[#C65A2E]" /> Self-Drive Rental Period *
                    </span>
                    <span className="text-[10px] font-bold text-[#C65A2E] bg-white px-2 py-0.5 rounded-md border border-[#EDE2D0]">
                      {computedDays} {computedDays === 1 ? 'Day' : 'Days'} Total
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[10.5px] font-semibold text-[#756B63]">Pickup Date</label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-white border border-[#EDE2D0] rounded-xl px-3 py-2 text-xs text-[#493B34] focus:outline-none focus:border-[#C65A2E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10.5px] font-semibold text-[#756B63]">Return Date</label>
                      <input
                        type="date"
                        required
                        min={startDate}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-white border border-[#EDE2D0] rounded-xl px-3 py-2 text-xs text-[#493B34] focus:outline-none focus:border-[#C65A2E]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ─── PASSENGERS / GUESTS COUNTER (FOR TOURS) ─── */}
              {item.type === 'tour' && (
                <div className="space-y-2 bg-[#FCFAF6] border border-[#EDE2D0] p-3.5 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-[#493B34] flex items-center gap-1.5 text-xs">
                      <Users className="w-4 h-4 text-[#C65A2E]" /> Number of Passengers / Pilgrims *
                    </label>
                    <span className="text-[10px] font-bold text-[#C65A2E] bg-white px-2 py-0.5 rounded-md border border-[#EDE2D0]">
                      {guests} {guests === 1 ? 'Passenger' : 'Passengers'}
                    </span>
                  </div>

                  {/* Preset Pax Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 4, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuests(num)}
                        className={`py-1.5 px-2 text-xs font-semibold rounded-xl transition-all border cursor-pointer ${
                          guests === num
                            ? 'bg-[#C65A2E] text-white border-[#C65A2E] shadow-2xs'
                            : 'bg-white text-[#493B34] border-[#EDE2D0] hover:bg-[#FCFAF6]'
                        }`}
                      >
                        {num} {num === 1 ? 'Pax' : 'Pax'}
                      </button>
                    ))}
                  </div>

                  {/* Stepper */}
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#EDE2D0]">
                    <span className="text-xs text-[#756B63] font-medium">Custom Traveler Count:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setGuests((prev: number) => Math.max(1, prev - 1))}
                        disabled={guests <= 1}
                        className="w-7 h-7 rounded-lg bg-[#FCFAF6] hover:bg-[#EDE2D0] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-[#493B34] transition-colors border border-[#EDE2D0]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={guests}
                        onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 text-center font-bold text-xs text-[#493B34] bg-[#FCFAF6] border border-[#EDE2D0] rounded-lg py-1 focus:outline-none focus:border-[#C65A2E]"
                      />

                      <button
                        type="button"
                        onClick={() => setGuests((prev: number) => Math.min(50, prev + 1))}
                        className="w-7 h-7 rounded-lg bg-[#C65A2E] hover:bg-[#B24E25] flex items-center justify-center text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── PRIMARY TRAVELER / HIRER CONTACT DETAILS ─── */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#493B34] flex items-center gap-1.5 text-xs">
                    <User className="w-3.5 h-3.5 text-[#C65A2E]" /> Primary Guest / Hirer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl px-3.5 py-2.5 text-xs text-[#493B34] focus:outline-none focus:border-[#C65A2E] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#493B34] flex items-center gap-1.5 text-xs">
                      <Phone className="w-3.5 h-3.5 text-[#C65A2E]" /> Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl px-3.5 py-2.5 text-xs text-[#493B34] focus:outline-none focus:border-[#C65A2E] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#493B34] flex items-center gap-1.5 text-xs">
                      <Mail className="w-3.5 h-3.5 text-[#C65A2E]" /> Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl px-3.5 py-2.5 text-xs text-[#493B34] focus:outline-none focus:border-[#C65A2E] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Pickup Location & ID Proof Choice */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-[#493B34] flex items-center gap-1.5 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#C65A2E]" /> Boarding / Pickup Location
                    </label>
                    <select
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl px-3 py-2.5 text-xs text-[#493B34] focus:outline-none focus:border-[#C65A2E] focus:bg-white cursor-pointer"
                    >
                      <option value="pune-swargate">Pune (Swargate Main Office)</option>
                      <option value="pune-wakad">Pune (Wakad / Hinjawadi)</option>
                      <option value="pune-airport">Pune International Airport (PNQ)</option>
                      <option value="pune-station">Pune Railway Station</option>
                      <option value="custom">Custom Doorstep Address in Pune</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#493B34] flex items-center gap-1.5 text-xs">
                      <FileCheck className="w-3.5 h-3.5 text-[#C65A2E]" /> Verification ID Proof Type
                    </label>
                    <select
                      value={idProofType}
                      onChange={(e) => setIdProofType(e.target.value)}
                      className="w-full bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl px-3 py-2.5 text-xs text-[#493B34] focus:outline-none focus:border-[#C65A2E] focus:bg-white cursor-pointer"
                    >
                      <option value="aadhaar">Aadhaar Card</option>
                      <option value="dl">Driving License (DL)</option>
                      <option value="passport">Indian / Foreign Passport</option>
                      <option value="voter">Voter ID Card</option>
                    </select>
                  </div>
                </div>

                {pickupLocation === 'custom' && (
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-semibold text-[#756B63]">Enter Doorstep Address in Pune</label>
                    <input
                      type="text"
                      placeholder="Building, street, landmark, area in Pune"
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      className="w-full bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl px-3.5 py-2 text-xs text-[#493B34] focus:outline-none focus:border-[#C65A2E] focus:bg-white"
                    />
                  </div>
                )}

                {/* Special Requests */}
                <div className="space-y-1">
                  <label className="text-[10.5px] font-semibold text-[#756B63]">Special Requests / Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Jain satvik meals, ground floor room request, child booster seat"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl px-3.5 py-2 text-xs text-[#493B34] focus:outline-none focus:border-[#C65A2E] focus:bg-white"
                  />
                </div>
              </div>

              {/* ─── LIVE PRICE & ADVANCE DEPOSIT BREAKDOWN ─── */}
              <div className="p-4 rounded-2xl bg-[#FCFAF6] border border-[#EDE2D0] space-y-2">
                {item.type === 'car' ? (
                  <>
                    <div className="flex justify-between items-center text-xs text-[#756B63]">
                      <span>Daily Vehicle Rate:</span>
                      <span className="font-semibold text-[#493B34]">₹{item.price.toLocaleString('en-IN')} / day</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-[#756B63]">
                      <span>Rental Duration:</span>
                      <span className="font-semibold text-[#493B34]">{computedDays} {computedDays === 1 ? 'Day' : 'Days'} (₹{item.price.toLocaleString('en-IN')} × {computedDays}d)</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center text-xs text-[#756B63]">
                      <span>Package Fare per Person:</span>
                      <span className="font-semibold text-[#493B34]">₹{item.price.toLocaleString('en-IN')} / person</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-[#756B63]">
                      <span>Total Travelers:</span>
                      <span className="font-semibold text-[#493B34]">{guests} {guests === 1 ? 'Passenger' : 'Passengers'} (₹{item.price.toLocaleString('en-IN')} × {guests})</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between items-center text-xs font-bold text-[#493B34] pt-1.5 border-t border-[#EDE2D0]">
                  <span>Total Estimated Fare:</span>
                  <span className="text-sm font-bold text-[#493B34]">₹{calculatedTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center text-xs font-bold text-[#C65A2E] pt-1.5 border-t border-[#EDE2D0]">
                  <span>Payable Now (Refundable Advance Deposit):</span>
                  <span className="text-sm font-extrabold text-[#C65A2E]">₹{calculatedDeposit.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center text-[11px] text-[#756B63] pt-0.5">
                  <span>{item.type === 'car' ? 'Remaining Balance Due on Key Handover:' : 'Remaining Balance Due on Departure:'}</span>
                  <span className="font-semibold text-[#493B34]">₹{calculatedBalance.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* ─── TERMS CHECKBOX ─── */}
              <div className="pt-1">
                <label
                  className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    termsAccepted ? 'bg-[#F8EFEA] border-[#C65A2E]/50' : 'bg-[#FCFAF6] border-[#EDE2D0] hover:border-[#C65A2E]/30'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (e.target.checked) setValidationError('');
                    }}
                    className="mt-0.5 w-4 h-4 rounded border-[#EDE2D0] text-[#C65A2E] focus:ring-[#C65A2E] cursor-pointer"
                  />
                  <span className="text-[11px] text-[#493B34] leading-snug">
                    I agree to the{' '}
                    <a
                      href={item.type === 'car' ? '/car-rentals#terms' : '/tours-travels#terms'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-bold text-[#C65A2E] hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Terms &amp; Conditions</span>
                      <ExternalLink className="w-2.5 h-2.5 inline" />
                    </a>{' '}
                    and cancellation policy for this booking.
                  </span>
                </label>
              </div>

            </div>

            {/* Sticky Bottom Actions */}
            <div className="px-5 sm:px-6 py-4 border-t border-[#EDE2D0] bg-white flex-shrink-0 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="text-xs font-semibold text-[#756B63] hover:text-[#493B34] cursor-pointer px-3 py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!termsAccepted || isSubmitting}
                className={`text-xs font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                  !termsAccepted || isSubmitting
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#C65A2E] hover:bg-[#B24E25] text-white shadow-xs'
                }`}
              >
                <QrCode className="w-4 h-4 text-white" />
                <span>Proceed to Pay Advance (₹{calculatedDeposit.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
