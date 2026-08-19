import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Plus, Trash2, FileDown, Filter, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getToursBookings, getToursPackages, createToursBooking, deleteToursBooking } from '@/api/tours.api';
import { getFleetBookings, getFleetVehicles, createFleetBooking, deleteFleetBooking, pickupFleetBooking, returnFleetBooking, refundFleetBooking } from '@/api/fleet.api';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { Loader } from '@/components/common/Loader';
import { statusColor } from '@/utils/statusColor';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { generateInvoicePDF, getNextInvoiceNumber, type InvoiceData } from '@/utils/generateInvoicePDF';

export default function BookingsView() {
  const { activeVertical: vertical, user } = useAuth();
  const isViewer = user?.role === 'viewer';

  const [toursBookings, setToursBookings] = useState<any[]>([]);
  const [fleetBookings, setFleetBookings] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);

  // ── Filters ──────────────────────────────────────────────────────────────
  const [filterSection, setFilterSection] = useState<'all' | 'tours' | 'fleet'>('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterPayment, setFilterPayment] = useState<'all' | 'paid' | 'partial' | 'pending'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Offline walk-in booking state
  const [offlineForm, setOfflineForm] = useState({
    bookingType: 'Tours', // 'Tours' | 'Fleet'
    packageId: '',
    vehicleId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    licenseNumber: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    paxCount: 1,
    depositPaid: 500,
    paymentMethod: 'Cash', // 'Cash' | 'UPI' | 'POS Card'
  });

  const load = useCallback(() => {
    setLoading(true);
    const promises: Promise<any>[] = [
      getToursPackages().then(d => setPackages(d)),
      getFleetVehicles().then(d => setVehicles(d)),
    ];
    if (vertical === 'all' || vertical === 'tours') promises.push(getToursBookings().then(d => setToursBookings(d)));
    if (vertical === 'all' || vertical === 'fleet') promises.push(getFleetBookings().then(d => setFleetBookings(d)));
    Promise.all(promises).then(() => setLoading(false));
  }, [vertical]);

  useEffect(() => { load(); }, [load]);

  const handlePickup = async (id: string) => {
    try { await pickupFleetBooking(id, 'Cash'); load(); } catch (e: any) { alert(e.message); }
  };
  const handleReturn = async (id: string) => {
    try { await returnFleetBooking(id); load(); } catch (e: any) { alert(e.message); }
  };
  const handleRefund = async (id: string) => {
    try { await refundFleetBooking(id); load(); } catch (e: any) { alert(e.message); }
  };
  const handleDeleteBooking = async (id: string, isFleet: boolean) => {
    if (!confirm('Are you sure you want to delete this booking record?')) return;
    try {
      if (isFleet) await deleteFleetBooking(id); else await deleteToursBooking(id);
      load();
    } catch (e: any) { alert(e.message); }
  };

  const handleCreateOfflineBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (offlineForm.bookingType === 'Tours') {
        if (!offlineForm.packageId && packages.length > 0) offlineForm.packageId = packages[0]._id || packages[0].id;
        await createToursBooking({
          packageId: offlineForm.packageId || packages[0]?._id,
          customerName: offlineForm.customerName,
          customerEmail: offlineForm.customerEmail || `${offlineForm.customerPhone || 'walkin'}@walkin.com`,
          customerPhone: offlineForm.customerPhone,
          travelDate: offlineForm.startDate,
          paxCount: offlineForm.paxCount,
          depositPaid: offlineForm.depositPaid,
          specialRequests: `Walk-in Offline Booking (${offlineForm.paymentMethod})`,
        });
      } else {
        if (!offlineForm.vehicleId && vehicles.length > 0) offlineForm.vehicleId = vehicles[0]._id || vehicles[0].id;
        await createFleetBooking({
          vehicleId: offlineForm.vehicleId || vehicles[0]?._id,
          customerName: offlineForm.customerName,
          customerEmail: offlineForm.customerEmail || `${offlineForm.customerPhone || 'walkin'}@walkin.com`,
          customerPhone: offlineForm.customerPhone,
          licenseNumber: offlineForm.licenseNumber || 'WALK-IN-DL',
          pickupDatetime: `${offlineForm.startDate}T10:00:00.000Z`,
          dropoffDatetime: `${offlineForm.endDate}T10:00:00.000Z`,
          depositPaid: offlineForm.depositPaid,
          specialRequests: `Walk-in Offline Rental (${offlineForm.paymentMethod})`,
        });
      }
      setIsOfflineModalOpen(false);
      load();
    } catch (err: any) { alert(err.message); }
  };

  // ── Excel / CSV Export ───────────────────────────────────────────────────
  const exportToExcel = (dataToExport: any[]) => {
    if (!dataToExport || dataToExport.length === 0) {
      alert('No bookings found to export.');
      return;
    }

    const headers = [
      'Booking ID',
      'Service Type',
      'Item / Package Name',
      'Customer Name',
      'Phone Number',
      'Email Address',
      'Driving License / Pax',
      'Pickup / Travel Date',
      'Return / Dropoff Date',
      'Deposit Paid (INR)',
      'Total Amount (INR)',
      'Balance Due (INR)',
      'Payment Status',
      'Transaction ID / Ref',
      'Booking Date',
    ];

    const rows = dataToExport.map(b => {
      const isFleet = b.type === 'Fleet';
      const code = b.bookingCode || b.booking_code || '';
      const name = b.customerName || b.customer_name || 'Guest';
      const phone = b.customerPhone || b.customer_phone || '';
      const email = b.customerEmail || b.customer_email || '';
      const license = isFleet ? (b.licenseNumber || 'N/A') : `${b.paxCount || 1} Pax`;
      const itemName = isFleet ? (b.vehicleId?.name || b.vehicleName || 'Vehicle Rental') : (b.packageId?.title || b.packageName || 'Tour Package');
      const start = isFleet ? formatDate(b.pickupDatetime || b.pickupDate || b.startDate) : formatDate(b.travelDate || b.startDate);
      const end = isFleet ? formatDate(b.dropoffDatetime || b.returnDate || b.endDate) : 'N/A';
      const deposit = b.depositAmount || b.depositPaid || b.deposit_paid || 500;
      const total = b.totalAmount || b.total_amount || b.totalRentalAmount || b.totalPrice || 0;
      const balance = Math.max(0, total - deposit);
      const status = b.status || 'Confirmed';
      const txn = b.razorpayPaymentId || b.razorpay_payment_id || b.bookingCode || 'Direct / Cash';
      const created = formatDate(b.createdAt || b.created_at);

      return [
        `"${code}"`,
        `"${isFleet ? 'Car Rental' : 'Tour Package'}"`,
        `"${itemName.replace(/"/g, '""')}"`,
        `"${name.replace(/"/g, '""')}"`,
        `"${phone}"`,
        `"${email}"`,
        `"${license}"`,
        `"${start}"`,
        `"${end}"`,
        deposit,
        total,
        balance,
        `"${status}"`,
        `"${txn}"`,
        `"${created}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Aarambha_Bookings_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <Loader />;

  // ── Build + filter booking list ──────────────────────────────────────────
  const PAID_STATUSES = ['Picked Up (Paid in Full)', 'Returned', 'Confirmed'];
  const PARTIAL_STATUSES = ['Deposit Paid'];

  const allBookings = [
    ...(vertical !== 'fleet' ? toursBookings.map(b => ({ ...b, type: 'Tours' })) : []),
    ...(vertical !== 'tours' ? fleetBookings.map(b => ({ ...b, type: 'Fleet' })) : []),
  ]
    .sort((a, b) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime())
    .filter(b => {
      // Section filter
      if (filterSection !== 'all') {
        if (filterSection === 'tours' && b.type !== 'Tours') return false;
        if (filterSection === 'fleet' && b.type !== 'Fleet') return false;
      }
      // Date from
      if (filterDateFrom) {
        const bookingDate = new Date(b.createdAt || b.created_at);
        if (bookingDate < new Date(filterDateFrom)) return false;
      }
      // Date to
      if (filterDateTo) {
        const bookingDate = new Date(b.createdAt || b.created_at);
        if (bookingDate > new Date(filterDateTo + 'T23:59:59')) return false;
      }
      // Payment status
      if (filterPayment !== 'all') {
        if (filterPayment === 'paid' && !PAID_STATUSES.includes(b.status)) return false;
        if (filterPayment === 'partial' && !PARTIAL_STATUSES.includes(b.status)) return false;
        if (filterPayment === 'pending' && (PAID_STATUSES.includes(b.status) || PARTIAL_STATUSES.includes(b.status))) return false;
      }
      return true;
    });

  const activeFilters = [filterSection !== 'all', filterDateFrom, filterDateTo, filterPayment !== 'all'].filter(Boolean).length;

  return (
    <div className="space-y-6 select-none">
      
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2">
            Bookings {isViewer && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                View Only
              </span>
            )}
            <span className="text-gray-400 font-normal text-base">({allBookings.length})</span>
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {isViewer
              ? 'View and filter all booking records.'
              : 'Track online ₹500 deposits, Razorpay txns, walk-in offline bookings & handovers.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="p-2 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-black hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            title="Refresh Bookings"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>

          <button
            onClick={() => exportToExcel(allBookings)}
            className="px-3.5 py-2 rounded-full border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            title="Download Bookings as Excel / CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Export Excel
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-2 border ${
              showFilters || activeFilters > 0
                ? 'bg-[#111827] text-white border-[#111827]'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters {activeFilters > 0 && <span className="bg-amber-400 text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black">{activeFilters}</span>}
          </button>

          {/* Add Offline Booking — superadmin only */}
          {!isViewer && (
            <button
              onClick={() => setIsOfflineModalOpen(true)}
              className="px-4 py-2 bg-[#111827] hover:bg-black text-white rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Offline Booking
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-wrap gap-4 items-end">
          {/* Section */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Section</label>
            <div className="flex gap-1.5">
              {(['all', 'tours', 'fleet'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterSection(s)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                    filterSection === s ? 'bg-[#111827] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s === 'all' ? 'All' : s === 'tours' ? 'Car Rental' : 'Tour'}
                </button>
              ))}
            </div>
          </div>

          {/* Date From */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">From Date</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={e => setFilterDateFrom(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-medium bg-gray-50 focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Date To */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">To Date</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={e => setFilterDateTo(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-medium bg-gray-50 focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Payment Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Payment Status</label>
            <div className="flex gap-1.5">
              {([
                { val: 'all', label: 'All' },
                { val: 'paid', label: 'Paid' },
                { val: 'partial', label: 'Partial' },
                { val: 'pending', label: 'Pending' },
              ] as const).map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setFilterPayment(val)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                    filterPayment === val ? 'bg-[#111827] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear */}
          {activeFilters > 0 && (
            <button
              onClick={() => { setFilterSection('all'); setFilterDateFrom(''); setFilterDateTo(''); setFilterPayment('all'); }}
              className="px-3 py-1.5 rounded-full text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-all self-end"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-aether-card">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 text-left text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-5 py-3.5">Booking ID</th>
                <th className="px-5 py-3.5">Service</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Dates / Travel</th>
                <th className="px-5 py-3.5">Deposit & Total</th>
                <th className="px-5 py-3.5">Txn ID</th>
                <th className="px-5 py-3.5">Agreement</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allBookings.map((b, i) => {
                const isFleet = b.type === 'Fleet';
                const code = b.bookingCode || b.booking_code;
                const name = b.customerName || b.customer_name || 'Customer';
                const email = b.customerEmail || b.customer_email || 'N/A';
                const phone = b.customerPhone || b.customer_phone || 'N/A';
                const total = b.totalAmount || b.total_amount || b.totalRentalAmount || b.total_rental_amount || 0;
                const depositPaid = b.depositAmount || b.depositPaid || 500;
                const razorpayId = b.razorpayPaymentId || b.razorpay_payment_id || 'Walk-in / Cash';
                const itemName = isFleet ? (b.vehicleId?.name || 'Vehicle Rental') : (b.packageId?.title || 'Tour Package');

                return (
                  <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-[#111827]">{code}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${isFleet ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {b.type}
                      </span>
                      <div className="text-[11px] font-bold text-[#111827] mt-1">{itemName}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-[#111827]">{name}</div>
                      <div className="text-[10px] text-gray-500">{phone} • {email}</div>
                      {b.licenseNumber && <div className="text-[10px] text-gray-400 font-mono">DL: {b.licenseNumber}</div>}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {isFleet ? (
                        <>
                          <div>{formatDate(b.pickupDatetime)} →</div>
                          <div>{formatDate(b.dropoffDatetime)}</div>
                        </>
                      ) : (
                        <>
                          <div>Start: {formatDate(b.travelDate)}</div>
                          <div className="text-[10px] text-gray-400">{b.paxCount || 1} traveler(s)</div>
                        </>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-emerald-600">₹{depositPaid} (Deposit)</div>
                      <div className="text-[11px] text-gray-500">Total: {formatCurrency(total)}</div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-gray-500">{razorpayId}</td>
                    <td className="px-5 py-4">
                      {b.agreementAccepted ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                          ✓ Signed
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-medium">Standard</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <Badge color={statusColor(b.status)}>{b.status}</Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Invoice — always visible */}
                        <button
                          onClick={() => {
                            const invNum = getNextInvoiceNumber(isFleet ? 'car' : 'tour');
                            const pickupDt = b.pickupDatetime || b.pickup_datetime;
                            const dropDt = b.dropoffDatetime || b.dropoff_datetime;
                            const days = pickupDt && dropDt
                              ? Math.max(1, Math.ceil((new Date(dropDt).getTime() - new Date(pickupDt).getTime()) / 86400000))
                              : 1;
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
                              depositPaid: depositPaid,
                              balanceAmount: total - depositPaid,
                              paymentMode: b.pickupPaymentMethod || (razorpayId.includes('Walk') ? 'Cash' : 'Razorpay'),
                              paymentStatus: b.status === 'Picked Up (Paid in Full)' || b.status === 'Returned' ? 'Paid' : 'Partially Paid',
                              transactionId: razorpayId !== 'Walk-in / Cash' ? razorpayId : undefined,
                            };
                            generateInvoicePDF(invoiceData);
                          }}
                          className="px-3 py-1.5 bg-[#111827] hover:bg-black text-white rounded-full text-[11px] font-bold shadow-sm transition-all flex items-center gap-1"
                        >
                          <FileDown className="w-3 h-3" /> Invoice
                        </button>

                        {/* Excel Single Export */}
                        <button
                          onClick={() => exportToExcel([b])}
                          title="Export booking to Excel / CSV"
                          className="p-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        </button>

                        {/* Status-change & delete buttons — superadmin only */}
                        {!isViewer && isFleet && (
                          <>
                            {b.status === 'Deposit Paid' && (
                              <button onClick={() => handlePickup(b._id || b.id)} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-full text-[11px] font-bold border border-emerald-200">
                                Pickup
                              </button>
                            )}
                            {b.status === 'Picked Up (Paid in Full)' && (
                              <button onClick={() => handleReturn(b._id || b.id)} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-full text-[11px] font-bold border border-indigo-200">
                                Return
                              </button>
                            )}
                            {b.status === 'Returned' && (
                              <button onClick={() => handleRefund(b._id || b.id)} className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-full text-[11px] font-bold border border-amber-200">
                                Refund
                              </button>
                            )}
                          </>
                        )}
                        {!isViewer && (
                          <button
                            onClick={() => handleDeleteBooking(b._id || b.id, isFleet)}
                            title="Delete Booking"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {allBookings.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-12 text-center text-gray-400">
                  {activeFilters > 0 ? 'No bookings match the active filters.' : 'No bookings recorded yet.'}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Offline Walk-in Booking Modal — superadmin only */}
      {!isViewer && (
        <Modal isOpen={isOfflineModalOpen} onClose={() => setIsOfflineModalOpen(false)} title="Create Offline Walk-in Booking">
          <form onSubmit={handleCreateOfflineBooking} className="space-y-4 text-xs select-none">
            
            <div>
              <label className="block font-bold text-[#111827] mb-1">Booking Type</label>
              <div className="flex gap-2">
                {(['Tours', 'Fleet'] as const).map(type => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setOfflineForm({ ...offlineForm, bookingType: type })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      offlineForm.bookingType === type
                        ? 'bg-[#111827] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'Tours' ? 'Tour Package' : 'Self-Drive Rental'}
                  </button>
                ))}
              </div>
            </div>

            {offlineForm.bookingType === 'Tours' ? (
              <div>
                <label className="block font-bold text-[#111827] mb-1">Select Tour Package</label>
                <select
                  value={offlineForm.packageId}
                  onChange={e => setOfflineForm({ ...offlineForm, packageId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-black"
                >
                  {packages.map((pkg: any) => (
                    <option key={pkg._id || pkg.id} value={pkg._id || pkg.id}>
                      {pkg.title} — ₹{pkg.basePrice} (Deposit: ₹{pkg.depositPrice})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block font-bold text-[#111827] mb-1">Select Rental Vehicle</label>
                <select
                  value={offlineForm.vehicleId}
                  onChange={e => setOfflineForm({ ...offlineForm, vehicleId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-black"
                >
                  {vehicles.map((v: any) => (
                    <option key={v._id || v.id} value={v._id || v.id}>
                      {v.name} ({v.regNumber || v.reg_number}) — ₹{v.dailyRate}/day
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#111827] mb-1">Customer Name</label>
                <input type="text" required value={offlineForm.customerName}
                  onChange={e => setOfflineForm({ ...offlineForm, customerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Enter customer name" />
              </div>
              <div>
                <label className="block font-bold text-[#111827] mb-1">Phone Number</label>
                <input type="tel" required value={offlineForm.customerPhone}
                  onChange={e => setOfflineForm({ ...offlineForm, customerPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Enter contact phone" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#111827] mb-1">Email Address</label>
                <input type="email" value={offlineForm.customerEmail}
                  onChange={e => setOfflineForm({ ...offlineForm, customerEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl" placeholder="Enter customer email (optional)" />
              </div>
              {offlineForm.bookingType === 'Fleet' ? (
                <div>
                  <label className="block font-bold text-[#111827] mb-1">Driving License No.</label>
                  <input type="text" required value={offlineForm.licenseNumber}
                    onChange={e => setOfflineForm({ ...offlineForm, licenseNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl uppercase font-mono" placeholder="Enter DL number" />
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-[#111827] mb-1">Travelers Count (Pax)</label>
                  <input type="number" min={1} required value={offlineForm.paxCount}
                    onChange={e => setOfflineForm({ ...offlineForm, paxCount: +e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#111827] mb-1">Start / Pickup Date</label>
                <input type="date" required value={offlineForm.startDate}
                  onChange={e => setOfflineForm({ ...offlineForm, startDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
              </div>
              {offlineForm.bookingType === 'Fleet' && (
                <div>
                  <label className="block font-bold text-[#111827] mb-1">Return Date</label>
                  <input type="date" required value={offlineForm.endDate}
                    onChange={e => setOfflineForm({ ...offlineForm, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#111827] mb-1">Deposit Collected (₹)</label>
                <input type="number" required value={offlineForm.depositPaid}
                  onChange={e => setOfflineForm({ ...offlineForm, depositPaid: +e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-[#111827] mb-1">Payment Method</label>
                <select value={offlineForm.paymentMethod}
                  onChange={e => setOfflineForm({ ...offlineForm, paymentMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium">
                  <option value="Cash">Cash Handover</option>
                  <option value="UPI">Direct UPI / QR</option>
                  <option value="POS Card">POS Card Machine</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-[#111827] hover:bg-black text-white font-bold rounded-xl text-xs shadow-md transition-all mt-2">
              Create Walk-in Booking
            </button>
          </form>
        </Modal>
      )}

      {/* Invoice Preview Modal */}
      <Modal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} title={`Invoice — ${selectedBooking?.bookingCode || selectedBooking?.booking_code || ''}`}>
        {selectedBooking && (() => {
          const isFleet = selectedBooking.type === 'Fleet';
          const bCode = selectedBooking.bookingCode || selectedBooking.booking_code;
          const bName = selectedBooking.customerName || selectedBooking.customer_name;
          const bPhone = selectedBooking.customerPhone || selectedBooking.customer_phone;
          const bEmail = selectedBooking.customerEmail || selectedBooking.customer_email;
          const bTotal = selectedBooking.totalAmount || selectedBooking.total_amount || selectedBooking.totalRentalAmount || 0;
          const bDeposit = selectedBooking.depositAmount || selectedBooking.depositPaid || 500;
          const bTxn = selectedBooking.razorpayPaymentId || selectedBooking.razorpay_payment_id || 'Walk-in / Cash';
          const pickupDt = selectedBooking.pickupDatetime || selectedBooking.pickup_datetime;
          const dropDt = selectedBooking.dropoffDatetime || selectedBooking.dropoff_datetime;
          const bDays = pickupDt && dropDt
            ? Math.max(1, Math.ceil((new Date(dropDt).getTime() - new Date(pickupDt).getTime()) / 86400000))
            : 1;

          const handleDownload = () => {
            const invNum = getNextInvoiceNumber(isFleet ? 'car' : 'tour');
            const invoiceData: InvoiceData = {
              invoiceNumber: invNum,
              invoiceDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              bookingType: isFleet ? 'car' : 'tour',
              bookingCode: bCode,
              customerName: bName,
              customerPhone: bPhone,
              customerEmail: bEmail,
              ...(isFleet ? {
                carModel: selectedBooking.vehicleId?.name || 'Vehicle Rental',
                rentalStartDate: pickupDt ? formatDate(pickupDt) : 'N/A',
                rentalEndDate: dropDt ? formatDate(dropDt) : 'N/A',
                numberOfDays: bDays,
                perDayRate: Math.round(bTotal / bDays),
              } : {
                packageName: selectedBooking.packageId?.title || 'Tour Package',
                travelDates: selectedBooking.travelDate ? formatDate(selectedBooking.travelDate) : 'N/A',
                numberOfTravelers: selectedBooking.paxCount || 1,
                perPersonPrice: Math.round(bTotal / Math.max(1, selectedBooking.paxCount || 1)),
              }),
              totalAmount: bTotal,
              depositPaid: bDeposit,
              balanceAmount: bTotal - bDeposit,
              paymentMode: selectedBooking.pickupPaymentMethod || (bTxn.includes('Walk') ? 'Cash' : 'Razorpay'),
              paymentStatus: selectedBooking.status === 'Picked Up (Paid in Full)' || selectedBooking.status === 'Returned' ? 'Paid' : 'Partially Paid',
              transactionId: bTxn !== 'Walk-in / Cash' ? bTxn : undefined,
            };
            generateInvoicePDF(invoiceData);
          };

          return (
            <div className="space-y-4 text-xs p-1 select-none">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between font-extrabold text-[#111827] border-b border-gray-200 pb-2.5 text-sm">
                  <span>{isFleet ? 'Self-Drive Rental Invoice' : 'Tour Package Invoice'}</span>
                  <span className="font-mono text-indigo-600">{bCode}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div><span className="text-gray-400 font-medium">Customer:</span> <strong className="text-[#111827]">{bName}</strong></div>
                  <div><span className="text-gray-400 font-medium">Email:</span> <strong className="text-[#111827]">{bEmail}</strong></div>
                  <div><span className="text-gray-400 font-medium">Phone:</span> <strong className="text-[#111827]">{bPhone}</strong></div>
                  <div><span className="text-gray-400 font-medium">Txn ID:</span> <strong className="font-mono text-[#111827]">{bTxn}</strong></div>
                </div>
              </div>
              <table className="w-full text-xs border border-gray-200 rounded-2xl overflow-hidden">
                <thead className="bg-gray-100 font-bold text-gray-700">
                  <tr>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-3">
                      <strong className="text-[#111827]">{isFleet ? (selectedBooking.vehicleId?.name || 'Vehicle Rental') : (selectedBooking.packageId?.title || 'Tour Package')}</strong>
                      {selectedBooking.specialRequests && <div className="text-gray-400 text-[10px] mt-0.5">Note: {selectedBooking.specialRequests}</div>}
                    </td>
                    <td className="p-3 text-right font-extrabold text-[#111827]">{formatCurrency(bTotal)}</td>
                  </tr>
                  <tr className="bg-emerald-50 text-emerald-800 font-bold">
                    <td className="p-3">Booking Deposit Paid</td>
                    <td className="p-3 text-right">− ₹{bDeposit}</td>
                  </tr>
                  <tr className="font-extrabold text-[#111827] text-sm bg-gray-50">
                    <td className="p-3">Balance Payable</td>
                    <td className="p-3 text-right">{formatCurrency(bTotal - bDeposit)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={handleDownload} className="px-4 py-2 bg-[#111827] hover:bg-black text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5">
                  <FileDown className="w-3.5 h-3.5" /> Download PDF
                </button>
                <button onClick={() => setIsInvoiceOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-xs font-bold hover:bg-gray-100">
                  Close
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

    </div>
  );
}
