import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, FileDown, Receipt } from 'lucide-react';
import { getPromoCodes, createPromoCode } from '@/api/finance.api';
import { getToursBookings } from '@/api/tours.api';
import { getFleetBookings } from '@/api/fleet.api';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { Loader } from '@/components/common/Loader';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { generateInvoicePDF, getNextInvoiceNumber, type InvoiceData } from '@/utils/generateInvoicePDF';

type Tab = 'promos' | 'invoices';

export default function FinanceView() {
  const [activeTab, setActiveTab] = useState<Tab>('invoices');
  const [promos, setPromos] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    code: '', discountPercentage: 15, maxDiscountAmount: 2000, validVertical: 'all'
  });

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      getPromoCodes().catch(() => []),
      getToursBookings().catch(() => []),
      getFleetBookings().catch(() => []),
    ]).then(([p, t, f]) => {
      setPromos(p);
      const merged = [
        ...t.map((b: any) => ({ ...b, _vertical: 'tour' })),
        ...f.map((b: any) => ({ ...b, _vertical: 'fleet' })),
      ].sort((a, b) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime());
      setAllBookings(merged);
      setLoading(false);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPromoCode(form);
      setIsModalOpen(false);
      load();
    } catch (err: any) { alert(err.message); }
  };

  const handleDownloadInvoice = (b: any) => {
    const isFleet = b._vertical === 'fleet';
    const code = b.bookingCode || b.booking_code;
    const name = b.customerName || b.customer_name || 'Customer';
    const phone = b.customerPhone || b.customer_phone || 'N/A';
    const email = b.customerEmail || b.customer_email || 'N/A';
    const total = b.totalAmount || b.total_amount || b.totalRentalAmount || b.total_rental_amount || 0;
    const deposit = b.depositAmount || b.depositPaid || 500;
    const txn = b.razorpayPaymentId || b.razorpay_payment_id || 'Walk-in / Cash';
    const pickupDt = b.pickupDatetime || b.pickup_datetime;
    const dropDt = b.dropoffDatetime || b.dropoff_datetime;
    const days = pickupDt && dropDt
      ? Math.max(1, Math.ceil((new Date(dropDt).getTime() - new Date(pickupDt).getTime()) / 86400000))
      : 1;

    const invNum = getNextInvoiceNumber(isFleet ? 'car' : 'tour');
    const invoiceData: InvoiceData = {
      invoiceNumber: invNum,
      invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      bookingType: isFleet ? 'car' : 'tour',
      bookingCode: code,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      ...(isFleet ? {
        carModel: b.vehicleId?.name || 'Vehicle Rental',
        rentalStartDate: pickupDt ? formatDate(pickupDt) : 'N/A',
        rentalEndDate: dropDt ? formatDate(dropDt) : 'N/A',
        numberOfDays: days,
        perDayRate: Math.round(total / days),
      } : {
        packageName: b.packageId?.title || 'Tour Package',
        travelDates: b.travelDate ? formatDate(b.travelDate) : 'N/A',
        numberOfTravelers: b.paxCount || 1,
        perPersonPrice: Math.round(total / Math.max(1, b.paxCount || 1)),
      }),
      totalAmount: total,
      depositPaid: deposit,
      balanceAmount: total - deposit,
      paymentMode: b.pickupPaymentMethod || (txn.includes('Walk') ? 'Cash' : 'Razorpay'),
      paymentStatus: b.status === 'Picked Up (Paid in Full)' || b.status === 'Returned' ? 'Paid' : 'Partially Paid',
      transactionId: txn !== 'Walk-in / Cash' ? txn : undefined,
    };
    generateInvoicePDF(invoiceData);
  };

  if (loading) return <Loader />;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'invoices', label: `Invoices (${allBookings.length})`, icon: <Receipt className="w-3.5 h-3.5" /> },
    { id: 'promos', label: `Promo Codes (${promos.length})`, icon: <Plus className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-[#111827] tracking-tight">Finance</h3>
        <div className="flex items-center gap-3">
          {activeTab === 'promos' && (
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-[#111827] text-white text-xs font-bold rounded-full flex items-center gap-2 hover:bg-black shadow">
              <Plus className="w-4 h-4" /> Create Promo
            </button>
          )}
          <button onClick={load} className="text-xs flex items-center gap-1 text-gray-500 hover:text-[#111827] p-2 rounded-full border border-gray-200">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[#111827] shadow-sm'
                : 'text-gray-500 hover:text-[#111827]'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Invoices Tab ─── */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 text-left text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5">Booking Ref</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Total</th>
                  <th className="px-5 py-3.5">Deposit</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allBookings.map((b, i) => {
                  const isFleet = b._vertical === 'fleet';
                  const code = b.bookingCode || b.booking_code;
                  const name = b.customerName || b.customer_name || 'Customer';
                  const total = b.totalAmount || b.total_amount || b.totalRentalAmount || 0;
                  const deposit = b.depositAmount || b.depositPaid || 500;

                  return (
                    <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-[#111827]">{code}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${isFleet ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {isFleet ? 'Car Rental' : 'Tour'}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-[#111827]">{name}</td>
                      <td className="px-5 py-4 text-gray-500">{formatDate(b.createdAt || b.created_at)}</td>
                      <td className="px-5 py-4 font-bold text-[#111827]">{formatCurrency(total)}</td>
                      <td className="px-5 py-4 text-emerald-600 font-semibold">₹{deposit}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          b.status === 'Picked Up (Paid in Full)' || b.status === 'Returned'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {b.status || 'Deposit Paid'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDownloadInvoice(b)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] hover:bg-black text-white rounded-full text-[11px] font-bold transition-all"
                        >
                          <FileDown className="w-3 h-3" /> PDF
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {allBookings.length === 0 && (
                  <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400">No bookings found. Add bookings to generate invoices.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Promo Codes Tab ─── */}
      {activeTab === 'promos' && (
        <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Discount %</th>
                  <th className="px-4 py-3">Max Amount</th>
                  <th className="px-4 py-3">Valid Vertical</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {promos.map((p: any, i: number) => (
                  <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold font-mono text-[#111827]">{p.code}</td>
                    <td className="px-4 py-3 font-medium">{p.discountPercentage || p.discount_percentage}%</td>
                    <td className="px-4 py-3">{formatCurrency(p.maxDiscountAmount || p.max_discount_amount || 0)}</td>
                    <td className="px-4 py-3"><Badge color={p.validVertical === 'tours' ? 'terracotta' : p.validVertical === 'fleet' ? 'sand' : 'blue'}>{(p.validVertical || p.valid_vertical || 'all').toUpperCase()}</Badge></td>
                    <td className="px-4 py-3"><Badge color={p.isActive ? 'green' : 'red'}>{p.isActive ? 'Active' : 'Inactive'}</Badge></td>
                  </tr>
                ))}
                {promos.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">No promo codes yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Promo Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Promo Code">
        <form onSubmit={handleCreatePromo} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1">Promo Code</label>
            <input type="text" required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full p-2.5 border rounded-lg font-mono uppercase" placeholder="Enter coupon code" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">Discount %</label>
              <input type="number" required max={100} value={form.discountPercentage} onChange={e => setForm({ ...form, discountPercentage: +e.target.value })} className="w-full p-2.5 border rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">Max Discount Amount (₹)</label>
              <input type="number" required value={form.maxDiscountAmount} onChange={e => setForm({ ...form, maxDiscountAmount: +e.target.value })} className="w-full p-2.5 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1">Target Vertical</label>
            <select value={form.validVertical} onChange={e => setForm({ ...form, validVertical: e.target.value })} className="w-full p-2.5 border rounded-lg bg-white">
              <option value="all">All Verticals (Tours + Fleet)</option>
              <option value="tours">Tours & Travels Only</option>
              <option value="fleet">Self-Drive Fleet Only</option>
            </select>
          </div>
          <button type="submit" className="w-full py-3 bg-[#111827] text-white font-bold rounded-lg hover:bg-black transition-colors">
            Create Promo Code
          </button>
        </form>
      </Modal>
    </div>
  );
}
