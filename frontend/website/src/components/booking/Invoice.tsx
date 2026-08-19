'use client';

import React, { useRef } from 'react';
import { Download, Printer, CheckCircle2 } from 'lucide-react';

interface InvoiceProps {
  type: 'fleet' | 'tours';
  booking: any;
  vehicleOrPackage: any;
}

export default function Invoice({ type, booking, vehicleOrPackage }: InvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = invoiceRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${booking.bookingCode}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', 'Segoe UI', sans-serif; color: #2C231E; padding: 40px; background: white; }
            .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #F0ECE1; }
            .brand { font-size: 24px; font-weight: 700; color: #C85227; }
            .brand-sub { font-size: 10px; color: #D49B5B; letter-spacing: 2px; text-transform: uppercase; }
            .invoice-title { font-size: 20px; font-weight: 700; color: #2C231E; text-align: right; }
            .invoice-id { font-size: 12px; color: #888; }
            .section { margin-bottom: 24px; }
            .section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #C85227; margin-bottom: 8px; }
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .detail-label { font-size: 11px; color: #888; margin-bottom: 2px; }
            .detail-value { font-size: 13px; font-weight: 600; color: #2C231E; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; text-align: left; padding: 8px 12px; border-bottom: 1px solid #F0ECE1; }
            td { font-size: 13px; padding: 10px 12px; border-bottom: 1px solid #F0ECE1; }
            .total-row td { font-weight: 700; font-size: 14px; color: #C85227; border-top: 2px solid #C85227; }
            .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #F0ECE1; text-align: center; font-size: 10px; color: #aaa; }
            .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 10px; font-weight: 600; background: #e6f4ea; color: #1e7e34; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const bookingCode = booking.bookingCode || booking.booking_code;
  const paymentId = booking.razorpayPaymentId || booking.razorpay_payment_id || 'N/A';
  const createdAt = new Date(booking.createdAt || booking.created_at).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="animate-fade-up">
      {/* Action Buttons */}
      <div className="flex gap-3 mb-4 no-print">
        <button onClick={handlePrint} className="btn-primary !py-2 !px-4 !text-xs flex-1">
          <Printer className="w-3.5 h-3.5" /> Print Invoice
        </button>
        <button onClick={handlePrint} className="btn-outline !py-2 !px-4 !text-xs flex-1">
          <Download className="w-3.5 h-3.5" /> Download PDF
        </button>
      </div>

      {/* Invoice Content */}
      <div ref={invoiceRef} className="bg-white border border-sand/20 rounded-xl p-6 text-sm">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-cream-dark">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-0.5 ring-1 ring-sand/30 shadow-sm shrink-0">
              <img
                src="/images/logo.jpeg"
                alt="आरंभ Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="brand text-2xl font-bold text-terracotta font-['Amita','Yatra_One','Rozha_One',serif] leading-none">आरंभ</div>
              <div className="brand-sub text-[9px] text-sand font-bold uppercase tracking-[0.2em] mt-1">आरंभ TOURS & TRAVELS</div>
              <p className="text-xs text-espresso/50 mt-0.5">Green Hills Society, Katraj, Pune - 411046 | support@aarambha.in | +91 82082 11478</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-espresso">INVOICE</h3>
            <p className="text-xs text-espresso/60 font-mono">{bookingCode}</p>
            <p className="text-xs text-espresso/50">{createdAt}</p>
          </div>
        </div>

        {/* Customer & Booking Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="section-title text-[10px] font-semibold uppercase tracking-wider text-terracotta mb-2">Bill To</p>
            <p className="font-semibold text-espresso">{booking.customerName || booking.customer_name}</p>
            <p className="text-xs text-espresso/60">{booking.customerEmail || booking.customer_email}</p>
            <p className="text-xs text-espresso/60">{booking.customerPhone || booking.customer_phone}</p>
          </div>
          <div className="text-right">
            <p className="section-title text-[10px] font-semibold uppercase tracking-wider text-terracotta mb-2">Booking Details</p>
            <p className="text-xs text-espresso/60">
              Type: <span className="font-semibold text-espresso">{type === 'fleet' ? 'Self-Drive Rental' : 'Tour Package'}</span>
            </p>
            <p className="text-xs text-espresso/60">
              Razorpay ID: <span className="font-mono text-espresso">{paymentId}</span>
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200">
              <CheckCircle2 className="w-3 h-3 inline -mt-0.5 mr-0.5" /> Deposit Paid
            </span>
          </div>
        </div>

        {/* Line Items */}
        <table className="w-full text-xs mb-4">
          <thead>
            <tr className="border-b border-cream-dark">
              <th className="text-left py-2 text-espresso/50 font-semibold uppercase tracking-wider text-[10px]">Description</th>
              <th className="text-right py-2 text-espresso/50 font-semibold uppercase tracking-wider text-[10px]">Amount</th>
            </tr>
          </thead>
          <tbody>
            {type === 'fleet' ? (
              <>
                <tr className="border-b border-cream-dark/50">
                  <td className="py-2.5">
                    <span className="font-semibold text-espresso">{vehicleOrPackage?.name || 'Vehicle'}</span>
                    <br /><span className="text-espresso/50">Reg: {vehicleOrPackage?.regNumber || 'N/A'} • {vehicleOrPackage?.vehicleType || 'car'}</span>
                    <br /><span className="text-espresso/50">
                      {new Date(booking.pickupDatetime || booking.pickup_datetime).toLocaleDateString('en-IN')} → {new Date(booking.dropoffDatetime || booking.dropoff_datetime).toLocaleDateString('en-IN')}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-semibold">₹{(booking.totalRentalAmount || booking.total_rental_amount || 0).toLocaleString('en-IN')}</td>
                </tr>
                <tr className="border-b border-cream-dark/50">
                  <td className="py-2.5 text-espresso/70">Refundable Security Deposit (at pickup)</td>
                  <td className="py-2.5 text-right text-espresso/70">₹{(booking.securityDepositAmount || booking.security_deposit_amount || 0).toLocaleString('en-IN')}</td>
                </tr>
              </>
            ) : (
              <>
                <tr className="border-b border-cream-dark/50">
                  <td className="py-2.5">
                    <span className="font-semibold text-espresso">{vehicleOrPackage?.title || 'Tour Package'}</span>
                    <br /><span className="text-espresso/50">{vehicleOrPackage?.durationDays || '?'}D / {vehicleOrPackage?.durationNights || '?'}N • {booking.paxCount || booking.pax_count || 1} pax</span>
                    <br /><span className="text-espresso/50">Travel: {new Date(booking.travelDate || booking.travel_date).toLocaleDateString('en-IN')}</span>
                  </td>
                  <td className="py-2.5 text-right font-semibold">₹{(booking.totalAmount || booking.total_amount || 0).toLocaleString('en-IN')}</td>
                </tr>
              </>
            )}
            <tr className="border-b border-cream-dark/50 bg-green-50/50">
              <td className="py-2.5 font-semibold text-green-700">Booking Deposit Paid (Online — Razorpay)</td>
              <td className="py-2.5 text-right font-bold text-green-700">− ₹500</td>
            </tr>
            <tr>
              <td className="py-3 font-bold text-terracotta text-sm border-t-2 border-terracotta/20">Balance Amount Due</td>
              <td className="py-3 text-right font-bold text-terracotta text-sm border-t-2 border-terracotta/20">
                ₹{type === 'fleet'
                  ? ((booking.totalRentalAmount || booking.total_rental_amount || 0) + (booking.securityDepositAmount || booking.security_deposit_amount || 0) - 500).toLocaleString('en-IN')
                  : ((booking.totalAmount || booking.total_amount || 0) - 500).toLocaleString('en-IN')
                }
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer Note */}
        <div className="pt-4 border-t border-cream-dark text-center">
          <p className="text-[10px] text-espresso/40">
            {type === 'fleet'
              ? 'Balance rental fee and security deposit to be collected at vehicle pickup/delivery.'
              : 'Remaining balance to be paid before or at the start of the tour as per booking policy.'
            }
          </p>
          <p className="text-[10px] text-espresso/30 mt-1">This is a computer-generated invoice. | आरंभ Tours & Travels</p>
        </div>
      </div>
    </div>
  );
}
