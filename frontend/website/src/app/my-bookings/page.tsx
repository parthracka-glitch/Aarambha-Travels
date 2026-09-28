'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Calendar, User, Car, Compass, ArrowLeft, BookOpen, Clock, CheckCircle, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateInvoicePDF, getNextInvoiceNumber, type InvoiceData } from '@/utils/generateInvoicePDF';
import { apiFetch } from '@/services/api-client';

interface LocalBooking {
  id: string;
  type: 'car' | 'tour';
  title: string;
  image: string;
  startDate: string;
  endDate: string;
  guestsCount: number;
  totalPrice: number;
  depositPaid: number;
  customerName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  invoiceNumber?: string;
  utrNumber?: string;
  paymentMethod?: string;
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return d; }
}

export default function MyBookingsPage() {
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
  const [bookings, setBookings] = useState<LocalBooking[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadBookingsForUser = async () => {
    try {
      const rawUser = localStorage.getItem('aarambha_user');
      let userEmail = '';
      if (rawUser) {
        const parsedUser = JSON.parse(rawUser);
        setUser(parsedUser);
        userEmail = (parsedUser.email || '').toLowerCase().trim();
      }

      const raw = localStorage.getItem('aarambha_user_bookings');
      let localList: any[] = raw ? JSON.parse(raw) : [];

      // Fetch live bookings from backend to check if admin verified
      try {
        const codes = localList.map(b => b.id || b.bookingCode || b.booking_code).filter(Boolean);
        const [fleetRes, toursRes] = await Promise.all([
          apiFetch<any[]>('/api/fleet/bookings/sync-status', {
            method: 'POST',
            body: JSON.stringify({ codes, email: userEmail }),
          }).catch(() => []),
          apiFetch<any[]>('/api/tours/bookings/sync-status', {
            method: 'POST',
            body: JSON.stringify({ codes, email: userEmail }),
          }).catch(() => []),
        ]);

        const backendAll = [
          ...(Array.isArray(fleetRes) ? fleetRes : []),
          ...(Array.isArray(toursRes) ? toursRes : []),
        ];

        // Merge updated status from backend into local list
        let changed = false;
        localList = localList.map(local => {
          const match = backendAll.find(b => 
            (b.bookingCode && b.bookingCode === local.id) ||
            (b.id && b.id === local.id) ||
            (b.bookingCode && b.bookingCode === local.bookingCode)
          );
          if (match && match.status && match.status !== local.status) {
            changed = true;
            return { 
              ...local, 
              status: match.status, 
              rejectionReason: match.rejectionReason, 
              verifiedAt: match.verifiedAt,
              utrNumber: match.utrNumber || local.utrNumber
            };
          }
          return local;
        });

        if (changed) {
          localStorage.setItem('aarambha_user_bookings', JSON.stringify(localList));
        }
      } catch (_apiErr) {}

      // Filter by user if logged in, or show recent guest bookings
      if (userEmail) {
        const userSpecific = localList.filter(
          (b) => (b.email || '').toLowerCase().trim() === userEmail
        );
        setBookings(userSpecific.reverse());
      } else {
        setBookings(localList.reverse());
      }
    } catch (_err) {
      setBookings([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadBookingsForUser();

    const handleAuthChange = () => {
      loadBookingsForUser();
    };

    window.addEventListener('aarambha_auth_changed', handleAuthChange);
    return () => {
      window.removeEventListener('aarambha_auth_changed', handleAuthChange);
    };
  }, []);

  const handleDownloadInvoice = (b: LocalBooking) => {
    const invNum = b.invoiceNumber || getNextInvoiceNumber(b.type === 'car' ? 'car' : 'tour');
    const days = Math.max(1, Math.ceil(
      (new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / 86400000
    ));

    const invoiceData: InvoiceData = {
      invoiceNumber: invNum,
      invoiceDate: formatDate(b.createdAt),
      bookingType: b.type === 'car' ? 'car' : 'tour',
      bookingCode: b.id,
      customerName: b.customerName,
      customerPhone: b.phone,
      customerEmail: b.email,
      ...(b.type === 'car'
        ? {
            carModel: b.title,
            rentalStartDate: formatDate(b.startDate),
            rentalEndDate: formatDate(b.endDate),
            numberOfDays: days,
            perDayRate: Math.round(b.totalPrice / days),
          }
        : {
            packageName: b.title,
            travelDates: `${formatDate(b.startDate)} → ${formatDate(b.endDate)}`,
            numberOfTravelers: b.guestsCount || 1,
            perPersonPrice: Math.round(b.totalPrice / Math.max(1, b.guestsCount || 1)),
          }),
      totalAmount: b.totalPrice,
      depositPaid: b.depositPaid,
      balanceAmount: b.totalPrice - b.depositPaid,
      paymentMode: 'Direct UPI',
      paymentStatus: b.status === 'Confirmed' ? 'Partially Paid' : 'Verification Pending',
      transactionId: b.utrNumber || b.id,
    };

    generateInvoicePDF(invoiceData);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#493B34] flex flex-col font-sans select-none">
      <Navbar vertical="home" />

      {/* Hero Header */}
      <section className="relative bg-[#FCFAF6] border-b border-[#EDE2D0] pt-24 pb-12 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 space-y-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#756B63] hover:text-[#C65A2E] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F8EFEA] flex items-center justify-center border border-[#E8B9A5]/50">
              <BookOpen className="w-5 h-5 text-[#C65A2E]" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#493B34]">My Bookings &amp; Invoices</h1>
              <p className="text-xs text-[#756B63] mt-0.5">Track your verified reservations and download official tax invoices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 lg:px-12 py-10">
        {!user ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EDE2D0] shadow-sm p-8 max-w-md mx-auto space-y-3.5">
            <div className="w-14 h-14 rounded-full bg-[#F8EFEA] text-[#C65A2E] flex items-center justify-center mx-auto border border-[#E8B9A5]/50">
              <User className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-lg font-bold text-[#493B34]">Log In to View Bookings</h2>
            <p className="text-xs text-[#756B63]">
              Please sign in with your registered account to manage your reservations and download tax invoices.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C65A2E] hover:bg-[#B24E25] text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
              >
                <User className="w-4 h-4 text-white" /> Log In Now
              </Link>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#EDE2D0] p-8 max-w-md mx-auto space-y-3.5">
            <div className="w-14 h-14 rounded-full bg-[#FCFAF6] border border-[#EDE2D0] flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6 text-[#756B63]" />
            </div>
            <h2 className="font-serif text-lg font-bold text-[#493B34]">No Reservations Found</h2>
            <p className="text-xs text-[#756B63] max-w-xs mx-auto">
              No bookings are currently linked to <strong className="text-[#493B34]">{user.email}</strong>. Reserve a tour package or self-drive vehicle to track it here.
            </p>
            <div className="pt-2">
              <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C65A2E] hover:bg-[#B24E25] text-white text-xs font-semibold rounded-xl transition-all shadow-xs">
                <Compass className="w-4 h-4" /> Explore Packages &amp; Fleet
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <p className="text-xs text-[#756B63] font-medium">
                {bookings.length} reservation{bookings.length > 1 ? 's' : ''} for <strong className="text-[#493B34]">{user.email}</strong>
              </p>
            </div>

            {bookings.map((b, i) => {
              const isCar = b.type === 'car';
              const days = Math.max(1, Math.ceil(
                (new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / 86400000
              ));

              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#EDE2D0] overflow-hidden shadow-2xs hover:shadow-sm hover:border-[#E8B9A5] transition-all flex flex-col sm:flex-row"
                >
                  {/* Image */}
                  <div className="relative w-full sm:w-44 h-32 sm:h-auto flex-shrink-0 bg-[#FDFBF7] overflow-hidden">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#C65A2E] text-white text-[9px] font-semibold uppercase tracking-wider">
                      {isCar ? 'Self-Drive' : 'Tour Package'}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#756B63] uppercase tracking-wider">
                            ID: {b.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              b.status === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {b.status || 'Verification Pending'}
                          </span>
                        </div>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#493B34] mt-1">
                          {b.title}
                        </h3>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-[#756B63] block">Total Amount</span>
                        <span className="text-base sm:text-lg font-bold text-[#493B34]">
                          ₹{b.totalPrice?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-[#C65A2E] block font-semibold">
                          Advance: ₹{b.depositPaid?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#EDE2D0] text-xs text-[#756B63]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C65A2E]" />
                        <span>
                          {formatDate(b.startDate)}
                          {b.endDate && b.endDate !== b.startDate ? ` → ${formatDate(b.endDate)}` : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#C65A2E]" />
                        <span>{isCar ? `${days} Day Rental` : `${b.guestsCount || 1} Travelers`}</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C65A2E]" />
                        <span>{b.paymentMethod || 'Direct UPI'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10.5px] text-[#756B63]">
                        Booked on {formatDate(b.createdAt)}
                      </span>

                      <button
                        onClick={() => handleDownloadInvoice(b)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8EFEA] hover:bg-[#E8B9A5]/40 text-[#C65A2E] text-xs font-semibold rounded-lg border border-[#E8B9A5]/50 transition-all cursor-pointer shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Tax Invoice (PDF)</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
