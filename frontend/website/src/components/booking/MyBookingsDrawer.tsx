'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Trash2, CheckCircle2, Car, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export interface SavedBooking {
  id: string;
  bookingCode?: string;
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
  customerEmail?: string;
  accountEmail?: string;
  userEmail?: string;
  phone: string;
  status: string;
  createdAt: string;
}

interface MyBookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MyBookingsDrawer({ isOpen, onClose }: MyBookingsDrawerProps) {
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
  const [bookings, setBookings] = useState<SavedBooking[]>([]);

  const loadUserBookings = () => {
    try {
      const rawUser = localStorage.getItem('aarambha_user');
      if (!rawUser) {
        setUser(null);
        setBookings([]);
        return;
      }
      const parsedUser = JSON.parse(rawUser);
      setUser(parsedUser);

      if (!parsedUser || !parsedUser.email) {
        setBookings([]);
        return;
      }

      const userEmail = parsedUser.email.toLowerCase().trim();
      const stored = localStorage.getItem('aarambha_user_bookings');
      if (stored) {
        const all: any[] = JSON.parse(stored);
        const userSpecific = all.filter((b) => {
          const bEmail = (b.customerEmail || b.email || b.accountEmail || b.userEmail || '').toLowerCase().trim();
          return bEmail === userEmail;
        });
        setBookings(userSpecific);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error('Failed to load saved bookings:', err);
      setUser(null);
      setBookings([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadUserBookings();
    }
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener('aarambha_auth_changed', loadUserBookings);
    return () => window.removeEventListener('aarambha_auth_changed', loadUserBookings);
  }, []);

  const handleCancelBooking = (bookingId: string) => {
    try {
      const raw = localStorage.getItem('aarambha_user_bookings');
      const all = raw ? JSON.parse(raw) : [];
      const updated = all.filter((b: any) => b.id !== bookingId && b.bookingCode !== bookingId);
      localStorage.setItem('aarambha_user_bookings', JSON.stringify(updated));
      setBookings((prev) => prev.filter((b) => b.id !== bookingId && b.bookingCode !== bookingId));
    } catch (err) {
      console.error('Failed to update local storage:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in font-sans">
      
      {/* Drawer Body */}
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between relative overflow-hidden border-l border-gray-100">
        
        {/* Header */}
        <div className="p-6 border-b border-[#272735] flex items-center justify-between bg-[#171721] text-[#EDEDF3]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#5266EB] text-white flex items-center justify-center font-bold text-xs">
              A
            </div>
            <div>
              <h2 className="font-syne text-lg font-extrabold tracking-tight">My Bookings</h2>
              <span className="text-[10px] text-[#AFB2CE] block font-medium">
                {user ? `Account: ${user.email}` : 'Active & Confirmed Reservations'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!user ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#5266EB]/10 text-[#5266EB] flex items-center justify-center mx-auto">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="font-syne text-base font-bold text-[#000000]">Not Logged In</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Please log in to your account to view your reservations and invoices.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="btn-red-pill text-xs font-bold py-2.5 px-6 rounded-full bg-[#5266EB] text-[#EDEDF3] text-center inline-block"
                >
                  Log In to Account
                </Link>
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="font-syne text-base font-bold text-[#000000]">No Active Bookings</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                You haven&apos;t reserved any vehicles or tour packages yet. Lock your departure with just ₹500 deposit!
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/car-rentals/cars"
                  onClick={onClose}
                  className="btn-red-pill text-xs font-bold py-2.5 rounded-full bg-[#5266EB] text-[#EDEDF3] text-center"
                >
                  Browse Self-Drive Cars
                </Link>
                <Link
                  href="/tours-travels"
                  onClick={onClose}
                  className="text-xs font-bold py-2.5 rounded-full bg-[#171721] text-[#EDEDF3] text-center hover:bg-[#272735] transition-colors"
                >
                  Explore Tour Packages
                </Link>
              </div>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-3 relative overflow-hidden"
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    booking.type === 'car' ? 'bg-[#5266EB]/10 text-[#5266EB] border border-[#5266EB]/30' : 'bg-[#9CB4E8]/20 text-[#171721] border border-[#9CB4E8]/40'
                  }`}>
                    {booking.type === 'car' ? 'Car Rental' : 'Tour Package'}
                  </span>

                  <span className="text-[10px] font-bold text-gray-400">
                    Ref #{booking.id}
                  </span>
                </div>

                {/* Details Row */}
                <div className="flex items-center gap-3">
                  <img
                    src={booking.image}
                    alt={booking.title}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-syne text-xs font-bold text-[#111111] truncate">
                      {booking.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" /> {booking.startDate} — {booking.endDate}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-600 block">
                      Deposit Paid: ₹{booking.depositPaid}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Confirmed
                  </span>

                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="text-[10px] font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {bookings.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-[#FAFAFC] text-center text-xs text-gray-500">
            Need help with your reservation? Contact support at <strong className="text-[#111111]">support@aarambhatravels.com</strong>
          </div>
        )}

      </div>

    </div>
  );
}
