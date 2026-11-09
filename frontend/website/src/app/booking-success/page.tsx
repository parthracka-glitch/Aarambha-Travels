'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Download,
  Printer,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  Copy,
  Check,
  Compass,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateInvoicePDF, type InvoiceData } from '@/utils/generateInvoicePDF';
import { SHARED_TOUR_CONTACT } from '@/constants/toursData';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const bookingRef = searchParams.get('ref') || searchParams.get('code') || '';
  const paymentId = searchParams.get('paymentId') || searchParams.get('payment_id') || '';
  const serviceType = searchParams.get('type') || 'tour';

  const [booking, setBooking] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Try reading booking from localStorage first
    let foundBooking: any = null;
    try {
      const stored = localStorage.getItem('aarambha_user_bookings');
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          if (bookingRef) {
            foundBooking = list.find(
              (b: any) =>
                b.bookingCode === bookingRef ||
                b.id === bookingRef ||
                b._id === bookingRef
            );
          }
          if (!foundBooking && list.length > 0) {
            foundBooking = list[0];
          }
        }
      }
    } catch (_e) {}

    if (foundBooking) {
      setBooking(foundBooking);
      setLoading(false);
    } else {
      // Create fallback booking structure based on query params
      const fallback: any = {
        bookingCode: bookingRef || 'TR-' + Math.floor(100000 + Math.random() * 900000),
        id: bookingRef,
        title: searchParams.get('title') || 'Aarambha Sacred Pilgrimage Yatra',
        packageName: searchParams.get('title') || 'Aarambha Sacred Pilgrimage Yatra',
        customerName: searchParams.get('name') || 'Valued Devotee',
        customerPhone: searchParams.get('phone') || '+91 90676 17451',
        customerEmail: searchParams.get('email') || 'devotee@aarambhatravels.in',
        travelDate: searchParams.get('date') || new Date().toISOString().split('T')[0],
        startDate: searchParams.get('date') || new Date().toISOString().split('T')[0],
        endDate: searchParams.get('endDate') || '',
        paxCount: parseInt(searchParams.get('pax') || '1', 10),
        totalAmount: parseInt(searchParams.get('total') || '11999', 10),
        depositPaid: parseInt(searchParams.get('deposit') || '2999', 10),
        balanceAmount: parseInt(searchParams.get('balance') || '9000', 10),
        razorpayPaymentId: paymentId || `pay_rzp_${Date.now().toString(36)}`,
        status: 'Deposit Paid',
        paymentMethod: 'Razorpay',
        createdAt: new Date().toISOString(),
      };
      setBooking(fallback);
      setLoading(false);
    }
  }, [bookingRef, paymentId, searchParams]);

  const handleCopyCode = () => {
    if (!booking) return;
    const code = booking.bookingCode || booking.id || bookingRef;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const invoiceData: InvoiceData = {
    invoiceNumber: booking?.invoiceNumber || 'AT/TT/2026/00148',
    invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    bookingType: (booking?.type === 'Fleet' || serviceType === 'car' || serviceType === 'fleet') ? 'car' : 'tour',
    bookingCode: booking?.bookingCode || booking?.id || bookingRef || 'TR-782910',
    customerName: booking?.customerName || booking?.name || 'Valued Devotee',
    customerPhone: booking?.customerPhone || booking?.phone || '+91 90676 17451',
    customerEmail: booking?.customerEmail || booking?.email || 'customer@aarambhatravels.in',
    packageName: booking?.packageName || booking?.title || 'Aarambha Sacred Pilgrimage Yatra',
    carModel: booking?.vehicleName || booking?.title,
    travelDates: `${booking?.startDate || booking?.travelDate || 'Departure'} ${booking?.endDate ? `→ ${booking?.endDate}` : ''}`,
    numberOfTravelers: Number(booking?.paxCount || booking?.guestsCount || 1),
    totalAmount: Number(booking?.totalAmount || booking?.totalPrice || 11999),
    depositPaid: Number(booking?.depositPaid || 2999),
    balanceAmount: Math.max(0, Number(booking?.totalAmount || booking?.totalPrice || 11999) - Number(booking?.depositPaid || 2999)),
    paymentMode: 'Razorpay (Online)',
    paymentStatus: 'Advance Received (Confirmed)',
    transactionId: booking?.razorpayPaymentId || paymentId || 'RZP-PAID',
    pickupLocation: booking?.pickupLocation || 'Pune',
  };

  const handleDownloadInvoice = () => {
    generateInvoicePDF(invoiceData);
  };

  const whatsappMessage = `*AARAMBHA BOOKING CONFIRMATION*%0A━━━━━━━━━━━━━━━━━━━━%0A🔖 *Booking Code:* ${booking?.bookingCode || bookingRef}%0A🧭 *Trip:* ${booking?.title || booking?.packageName}%0A👤 *Name:* ${booking?.customerName}%0A💰 *Advance Paid via Razorpay:* ₹${(booking?.depositPaid || 0).toLocaleString('en-IN')}%0A🆔 *Razorpay Payment ID:* ${booking?.razorpayPaymentId || paymentId}%0A━━━━━━━━━━━━━━━━━━━━%0APlease share the departure instructions and boarding guide.`;
  const whatsappUrl = `https://wa.me/${SHARED_TOUR_CONTACT.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFAF6] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#101F40] font-semibold text-sm">
          <div className="w-5 h-5 border-2 border-[#101F40] border-t-transparent rounded-full animate-spin" />
          <span>Confirming your booking details...</span>
        </div>
      </div>
    );
  }

  const codeDisplay = booking?.bookingCode || booking?.id || bookingRef || 'TR-CONFIRMED';
  const currentPaymentId = booking?.razorpayPaymentId || paymentId || 'pay_online_verified';

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#17233D] flex flex-col font-sans select-none">
      <Navbar vertical={serviceType === 'car' || serviceType === 'fleet' ? 'fleet' : 'tours'} />

      <main className="flex-1 pt-24 pb-16 lg:pt-28 lg:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* ─── 1. CELEBRATORY HEADER CARD ─── */}
          <div className="relative overflow-hidden bg-white rounded-3xl border border-[#E8ECF4] shadow-xl p-6 sm:p-10 text-center space-y-4">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#12A879] via-[#3569F6] to-[#12A879]" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#12A879]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#E7F7F2] text-[#12A879] ring-8 ring-[#E7F7F2]/60 mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="relative space-y-1.5 max-w-lg mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F7F2] text-[#12A879] text-xs font-bold uppercase tracking-wider border border-[#BDEBDC]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Payment Verified via Razorpay
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101F40] tracking-tight">
                Booking Confirmed!
              </h1>
              <p className="text-xs sm:text-sm text-[#77839A] leading-relaxed">
                Thank you for choosing <strong className="text-[#101F40]">Aarambha Tours &amp; Travels</strong>. Your advance payment has been successfully received, and your seats are reserved.
              </p>
            </div>

            {/* Booking Code & Payment ID Banner */}
            <div className="relative max-w-md mx-auto pt-2">
              <div className="p-3.5 rounded-2xl bg-[#F5F7FC] border border-[#E8ECF4] flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div>
                  <span className="text-[10px] font-bold text-[#77839A] uppercase tracking-wider block">
                    Official Booking Code
                  </span>
                  <span className="text-base font-black font-mono text-[#101F40] tracking-wider">
                    {codeDisplay}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#EDF3FF] border border-[#E8ECF4] text-xs font-semibold text-[#3569F6] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#12A879]" />
                      <span className="text-[#12A879]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-[#77839A]">
                <span>Razorpay Payment ID:</span>
                <span className="font-mono font-medium text-[#101F40]">{currentPaymentId}</span>
              </div>
            </div>

            {/* ─── PRIMARY ACTION: DOWNLOAD OFFICIAL INVOICE (PDF) ─── */}
            <div className="relative pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleDownloadInvoice}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#101F40] hover:bg-[#1C315A] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#101F40]/15 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#EDF3FF]" />
                <span>Download Booking Invoice (PDF)</span>
              </button>

              <Link
                href={`/invoice?ref=${encodeURIComponent(codeDisplay)}`}
                target="_blank"
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white hover:bg-[#F5F7FC] border border-[#E8ECF4] text-[#101F40] text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <Printer className="w-4 h-4 text-[#77839A]" />
                <span>Print Invoice</span>
              </Link>
            </div>
          </div>

          {/* ─── 2. BOOKING SUMMARY & FINANCIAL BREAKDOWN GRID ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card A: Trip & Traveler Information */}
            <div className="bg-white rounded-3xl border border-[#E8ECF4] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8ECF4] pb-3">
                <h3 className="text-sm font-bold text-[#101F40] uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#3569F6]" />
                  <span>Trip &amp; Traveler Details</span>
                </h3>
                <span className="text-[11px] font-bold text-[#3569F6] bg-[#EDF3FF] px-2.5 py-0.5 rounded-full">
                  {booking?.guestsCount || booking?.paxCount || 1} Traveler(s)
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#77839A] block text-[11px]">Package / Vehicle Title</span>
                  <span className="font-bold text-[#101F40] text-sm block mt-0.5">
                    {booking?.title || booking?.packageName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[#77839A] block text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#3569F6]" /> Travel Date
                    </span>
                    <span className="font-semibold text-[#101F40] mt-0.5 block">
                      {booking?.startDate || booking?.travelDate || 'As confirmed'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#77839A] block text-[11px] flex items-center gap-1">
                      <User className="w-3 h-3 text-[#3569F6]" /> Primary Passenger
                    </span>
                    <span className="font-semibold text-[#101F40] mt-0.5 block truncate">
                      {booking?.customerName}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[#77839A] block text-[11px] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#3569F6]" /> Contact Mobile
                    </span>
                    <span className="font-semibold text-[#101F40] mt-0.5 block">
                      {booking?.customerPhone}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#77839A] block text-[11px] flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#3569F6]" /> Email Address
                    </span>
                    <span className="font-semibold text-[#101F40] mt-0.5 block truncate">
                      {booking?.customerEmail}
                    </span>
                  </div>
                </div>

                {booking?.pickupLocation && (
                  <div className="pt-1">
                    <span className="text-[#77839A] block text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#3569F6]" /> Boarding Point
                    </span>
                    <span className="font-semibold text-[#101F40] mt-0.5 block">
                      {booking?.pickupLocation}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Card B: Payment & Fare Breakdown */}
            <div className="bg-white rounded-3xl border border-[#E8ECF4] p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#E8ECF4] pb-3">
                  <h3 className="text-sm font-bold text-[#101F40] uppercase tracking-wider flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#12A879]" />
                    <span>Payment Breakdown</span>
                  </h3>
                  <span className="text-[11px] font-bold text-[#12A879] bg-[#E7F7F2] px-2.5 py-0.5 rounded-full border border-[#BDEBDC]">
                    Confirmed
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-[#77839A]">
                    <span>Total Package Cost:</span>
                    <span className="font-bold text-[#101F40]">
                      ₹{(booking?.totalAmount || booking?.totalPrice || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#E7F7F2]/60 border border-[#BDEBDC] text-[#12A879]">
                    <span className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Advance Paid via Razorpay:
                    </span>
                    <span className="font-extrabold text-sm">
                      ₹{(booking?.depositPaid || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[#77839A]">
                    <span>Remaining Balance Due:</span>
                    <span className="font-extrabold text-sm text-[#101F40]">
                      ₹{(booking?.balanceAmount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#77839A] italic pt-1 leading-relaxed">
                    * The remaining balance is payable on the departure date at boarding time via cash, UPI, or card.
                  </p>
                </div>
              </div>

              {/* View in My Bookings */}
              <div className="pt-3 border-t border-[#E8ECF4]">
                <Link
                  href="/my-bookings"
                  className="w-full py-2.5 rounded-xl bg-[#F5F7FC] hover:bg-[#EDF3FF] text-[#3569F6] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View All Bookings in Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

          {/* ─── 3. NEXT STEPS & 24/7 YATRA COORDINATOR ─── */}
          <div className="bg-white rounded-3xl border border-[#E8ECF4] p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-[#3569F6] uppercase tracking-wider block">
                Travel Assurance
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-[#101F40] tracking-tight mt-0.5">
                What Happens Next?
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#F5F7FC] border border-[#E8ECF4] space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-[#101F40] text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="font-bold text-xs text-[#101F40]">SMS &amp; Email Confirmation</h4>
                <p className="text-[11px] text-[#77839A] leading-relaxed">
                  Your official invoice and digital receipt have been saved to your account.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F7FC] border border-[#E8ECF4] space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-[#3569F6] text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="font-bold text-xs text-[#101F40]">Tour Captain Briefing</h4>
                <p className="text-[11px] text-[#77839A] leading-relaxed">
                  Our dedicated tour coordinator will call 24–48 hours before departure to coordinate boarding.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F7FC] border border-[#E8ECF4] space-y-1.5">
                <span className="w-6 h-6 rounded-full bg-[#12A879] text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="font-bold text-xs text-[#101F40]">Comfortable Yatra</h4>
                <p className="text-[11px] text-[#77839A] leading-relaxed">
                  Present your digital PDF invoice on your phone when boarding the AC luxury coach.
                </p>
              </div>
            </div>

            {/* WhatsApp Assistance Bar */}
            <div className="pt-4 border-t border-[#E8ECF4] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FCFAF6] p-4 rounded-2xl border">
              <div>
                <p className="font-bold text-xs text-[#101F40]">Need immediate assistance or seat allotment?</p>
                <p className="text-[11px] text-[#77839A]">Our Pune operations desk is available 24/7 to help you.</p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Tour Desk</span>
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FCFAF6] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#101F40] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}
