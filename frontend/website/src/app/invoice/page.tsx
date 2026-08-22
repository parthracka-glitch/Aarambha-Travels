'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAarambhInvoiceHTML, type InvoiceData } from '@/utils/generateInvoicePDF';

function InvoiceContent() {
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
              bookingType: b.type === 'Fleet' ? 'car' : 'tour',
              bookingCode: b.bookingCode || b.id,
              customerName: b.customerName || b.name,
              customerPhone: b.customerPhone || b.phone,
              customerEmail: b.customerEmail || b.email,
              packageName: b.type === 'Fleet' ? undefined : b.title,
              carModel: b.type === 'Fleet' ? b.title : undefined,
              travelDates: `${b.startDate || b.pickupDate} to ${b.endDate || b.returnDate}`,
              totalAmount: b.totalPrice || b.totalAmount,
              depositPaid: b.depositPaid || 500,
              balanceAmount: (b.totalPrice || b.totalAmount) - (b.depositPaid || 500),
            };
          }
        }
      }
    } catch (_e) {}

    setHtmlContent(getAarambhInvoiceHTML(invoiceData));
  }, [searchParams]);

  if (!htmlContent) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Generating Official Invoice...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-gray-100 min-h-screen py-8 print:py-0 print:bg-white"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

export default function InvoiceViewerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading Invoice...</span>
        </div>
      </div>
    }>
      <InvoiceContent />
    </Suspense>
  );
}
