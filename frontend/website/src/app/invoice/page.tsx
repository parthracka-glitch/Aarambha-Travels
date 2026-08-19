'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAarambhInvoiceHTML, type InvoiceData } from '@/utils/generateInvoicePDF';

export default function InvoiceViewerPage() {
  const searchParams = useSearchParams();
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    // Try reading latest booking from localStorage or query params
    let invoiceData: InvoiceData = {
      invoiceNumber: searchParams?.get('inv') || 'AT/TT/2026/00147',
      invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      bookingType: (searchParams?.get('type') as any) || 'tour',
      bookingCode: searchParams?.get('ref') || 'TR-782910',
      customerName: searchParams?.get('name') || 'Valued Pilgrim',
      customerPhone: searchParams?.get('phone') || '+91 82082 11478',
      customerEmail: searchParams?.get('email') || 'customer@aarambhatravels.in',
      packageName: searchParams?.get('pkg') || 'Tirupati Balaji Darshan — Group Yatra',
      travelDates: searchParams?.get('dates') || '04 Sep 2026 → 08 Sep 2026',
      numberOfTravelers: parseInt(searchParams?.get('pax') || '2', 10),
      totalAmount: parseInt(searchParams?.get('total') || '13600', 10),
      depositPaid: parseInt(searchParams?.get('deposit') || '5000', 10),
      balanceAmount: parseInt(searchParams?.get('balance') || '8600', 10),
      paymentMode: 'Razorpay / Online',
      paymentStatus: 'Confirmed',
    };

    try {
      const rawUser = localStorage.getItem('aarambha_user');
      const user = rawUser ? JSON.parse(rawUser) : null;
      const userEmail = user?.email?.toLowerCase().trim();

      const storedBookings = localStorage.getItem('aarambha_user_bookings');
      if (storedBookings) {
        const parsed = JSON.parse(storedBookings);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const reqRef = searchParams?.get('ref');
          let b = reqRef
            ? parsed.find((item: any) => item.id === reqRef || item.bookingCode === reqRef)
            : null;

          if (!b && userEmail) {
            b = parsed.find(
              (item: any) =>
                (item.customerEmail || item.email || item.accountEmail || item.userEmail || '').toLowerCase().trim() === userEmail
            );
          }

          if (!b && !userEmail && !reqRef) {
            b = null;
          } else if (!b && !userEmail) {
            b = parsed[0];
          }

          if (b) {
            invoiceData = {
              ...invoiceData,
              invoiceNumber: b.invoiceNumber || invoiceData.invoiceNumber,
              bookingCode: b.id || b.bookingCode || invoiceData.bookingCode,
              bookingType: b.type === 'car' ? 'car' : 'tour',
              customerName: b.customerName || invoiceData.customerName,
              customerEmail: b.customerEmail || invoiceData.customerEmail,
              customerPhone: b.customerPhone || invoiceData.customerPhone,
              packageName: b.packageName || b.title || invoiceData.packageName,
              carModel: b.vehicleName || b.title,
              travelDates: `${b.startDate} → ${b.endDate}`,
              numberOfTravelers: b.guestsCount || b.paxCount || 2,
              numberOfDays: 3,
              totalAmount: b.totalPrice || b.totalAmount || 13600,
              depositPaid: b.depositPaid || 500,
              balanceAmount: (b.totalPrice || b.totalAmount || 13600) - (b.depositPaid || 500),
            };
          }
        }
      }
    } catch (_e) {}

    const html = getAarambhInvoiceHTML(invoiceData);
    setHtmlContent(html);
  }, [searchParams]);

  if (!htmlContent) {
    return (
      <div className="min-h-screen bg-[#DCD3C2] flex items-center justify-center font-sans text-gray-700">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-xs uppercase tracking-wider">Generating Royal Invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={htmlContent}
      className="w-full h-screen border-none"
      title="Aarambh Tours & Travels Invoice Preview"
    />
  );
}
