'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Calendar, User, Car, Compass, ArrowLeft, BookOpen, Clock, CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { generateInvoicePDF, getNextInvoiceNumber, type InvoiceData } from '@/utils/generateInvoicePDF';

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
        const [fleetRes, toursRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/fleet/bookings').then(r => r.json()).catch(() => []),
          fetch('http://127.0.0.1:8000/api/tours/bookings').then(r => r.json()).catch(() => []),
        ]);

        const backendAll = [
          ...(Array.isArray(fleetRes) ? fleetRes.map((x: any) => ({ ...x, _type: 'car' })) : []),
          ...(Array.isArray(toursRes) ? toursRes.map((x: any) => ({ ...x, _type: 'tour' })) : []),
        ];

        // Merge updated status from backend into local list
        let changed = false;
        localList = localList.map(local => {
          const match = backendAll.find(b => 
            (b.bookingCode && b.bookingCode === local.id) ||
            (b.booking_code && b.booking_code === local.id) ||
            (b._id && b._id === local.id) ||
            (b.id && b.id === local.id)
          );
          if (match && match.status && match.status !== local.status) {
            changed = true;
            return { ...local, status: match.status, rejectionReason: match.rejectionReason };
          }
          return local;
        });

        if (changed) {
          localStorage.setItem('aarambha_user_bookings', JSON.stringify(localList));
        }
      } catch (_apiErr) {}

      // Filter by user if logged in, or show recent guest bookings
      const userSpecific = userEmail
        ? localList.filter((b) => {
            const bEmail = (b.customerEmail || b.email || b.accountEmail || b.userEmail || '').toLowerCase().trim();
            return bEmail === userEmail;
          })
        : localList;

      setBookings(userSpecific);
    } catch (_) {
      setUser(null);
      setBookings([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadBookingsForUser();

    // Poll every 4 seconds so customer sees admin verification live
    const interval = setInterval(loadBookingsForUser, 4000);

    window.addEventListener('aarambha_auth_changed', loadBookingsForUser);
    window.addEventListener('aarambha_booking_updated', loadBookingsForUser);
    return () => {
      clearInterval(interval);
      window.removeEventListener('aarambha_auth_changed', loadBookingsForUser);
      window.removeEventListener('aarambha_booking_updated', loadBookingsForUser);
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
      paymentMode: 'Razorpay',
      paymentStatus: b.status === 'Confirmed' ? 'Partially Paid' : b.status,
      transactionId: b.id,
    };

    generateInvoicePDF(invoiceData);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans">
      <Navbar vertical="home" />

      {/* Hero */}
      <section className="relative bg-[#171721] text-[#EDEDF3] pt-28 pb-14 overflow-hidden border-b border-[#272735]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#171721] via-[#272735] to-[#171721] opacity-90" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#9CB4E8] hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#5266EB] flex items-center justify-center shadow-lg shadow-[#5266EB]/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-syne text-3xl sm:text-4xl font-extrabold text-white">My Bookings</h1>
              <p className="text-xs text-[#AFB2CE] mt-1">All your Aarambha reservations, with downloadable invoices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 lg:px-12 py-12">
        {!user ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200/80 shadow-sm p-8 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#5266EB]/10 text-[#5266EB] flex items-center justify-center mx-auto">
              <User className="w-8 h-8" />
            </div>
            <h2 className="font-syne text-xl font-bold text-[#000000]">Account Not Logged In</h2>
            <p className="text-sm text-gray-500">
              Please log in to your account to view your active bookings and download your verified tax invoices.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] text-xs font-bold font-syne uppercase tracking-wider rounded-full transition-all shadow-md hover:scale-105"
              >
                <User className="w-4 h-4" /> Log In to Your Account
              </Link>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="font-syne text-xl font-bold text-[#000000]">No bookings yet</h2>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              No reservations found for <strong className="text-gray-700">{user.email}</strong>. Book a tour package or car rental to see your reservations here.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] text-xs font-bold rounded-full transition-all mt-4">
              <Compass className="w-4 h-4" /> Explore Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500 font-medium">
                {bookings.length} booking{bookings.length > 1 ? 's' : ''} found for <strong className="text-gray-800">{user.email}</strong>
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
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row"
                >
                  {/* Image */}
                  <div className="relative w-full sm:w-48 h-36 sm:h-auto flex-shrink-0 bg-gray-900 overflow-hidden">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      isCar ? 'bg-[#171721] text-[#9CB4E8] border border-[#9CB4E8]/30' : 'bg-[#5266EB] text-white'
                    }`}>
                      {isCar ? 'Car Rental' : 'Tour Package'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        {isCar
                          ? <Car className="w-4 h-4 text-[#5266EB]" />
                          : <Compass className="w-4 h-4 text-[#5266EB]" />}
                        <h3 className="font-syne text-base font-bold text-[#000000]">{b.title}</h3>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" /> {b.customerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(b.startDate)} → {formatDate(b.endDate)}
                        </span>
                        {isCar ? (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {days} Day{days > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" /> {b.guestsCount || 1} Traveler{(b.guestsCount || 1) > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-[#111111]">
                          Total: ₹{b.totalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[#5266EB] font-semibold">
                          Deposit: ₹{b.depositPaid} logged
                        </span>
                        {b.status === 'pending_verification' ? (
                          <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                            <Clock className="w-3 h-3 text-amber-700" /> Under Verification {b.utrNumber ? `(UTR: ${b.utrNumber})` : ''}
                          </span>
                        ) : b.status === 'Rejected' ? (
                          <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-300">
                            Payment Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-300">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" /> Booking Confirmed
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-gray-400 font-mono">
                        Ref: {b.id} · Booked {formatDate(b.createdAt)}
                      </div>
                    </div>

                    {/* Download Button */}
                    <div className="flex-shrink-0">
                      {b.status === 'pending_verification' ? (
                        <span className="text-[11px] text-gray-400 italic block py-2">
                          Invoice available once verified
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDownloadInvoice(b)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-[#171721] hover:bg-[#272735] text-[#EDEDF3] text-xs font-bold rounded-full transition-all shadow-md hover:shadow-lg hover:scale-105"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Invoice PDF
                        </button>
                      )}
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
