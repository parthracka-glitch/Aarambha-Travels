import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, ArrowUpRight, CalendarCheck, Compass, Car, Bus, ArrowRight, CheckCircle, AlertTriangle, ShieldAlert, Pencil, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getToursBookings, getToursInquiries, getToursPackages } from '@/api/tours.api';
import { getFleetBookings, getFleetInquiries, getFleetVehicles } from '@/api/fleet.api';
import { getBusRates, updateBusRate } from '@/api/bus.api';
import { KPICard } from '@/components/common/KPICard';
import { Loader } from '@/components/common/Loader';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { statusColor } from '@/utils/statusColor';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAutoRefresh } from '@/hooks/useRealtimeSync';

export default function DashboardView() {
  const navigate = useNavigate();
  const { activeVertical: vertical, user } = useAuth();
  const isViewer = user?.role === 'viewer';
  const [tours, setTours] = useState<any>({ bookings: [], inquiries: [], packages: [] });
  const [fleet, setFleet] = useState<any>({ bookings: [], inquiries: [], vehicles: [] });
  const [busRates, setBusRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  // Quick Rate Edit Modal State on Dashboard
  const [editingBus, setEditingBus] = useState<any | null>(null);
  const [busForm, setBusForm] = useState({
    busType: '',
    baseRate: 0,
    mumbaiRate: 0,
    mahabaleshwarRate: 0,
    packageRate: 0,
    extraKmRate: 0,
    extraHourRate: 0,
    status: 'Active',
  });

  const loadData = useCallback(() => {
    if (!hasLoadedRef.current) setLoading(true);
    Promise.all([
      getToursBookings().catch(() => []),
      getToursInquiries().catch(() => []),
      getToursPackages().catch(() => []),
      getFleetBookings().catch(() => []),
      getFleetInquiries().catch(() => []),
      getFleetVehicles().catch(() => []),
      getBusRates().catch(() => []),
    ])
      .then(([tb, ti, tp, fb, fi, fv, br]) => {
        let localBookings: any[] = [];
        try {
          const rawLocal = localStorage.getItem('aarambha_user_bookings');
          if (rawLocal) localBookings = JSON.parse(rawLocal);
        } catch (_e) {}

        const mergedFleet = [...(Array.isArray(fb) ? fb : [])];
        const mergedTours = [...(Array.isArray(tb) ? tb : [])];

        localBookings.forEach((local: any) => {
          const isCar = local.type === 'car' || local.type === 'Fleet' || local.type === 'Rental';
          const targetList = isCar ? mergedFleet : mergedTours;
          const localCode = local.id || local.bookingCode || local.booking_code;
          const exists = targetList.some((x: any) => 
            (x.bookingCode && x.bookingCode === localCode) ||
            (x.booking_code && x.booking_code === localCode) ||
            (x._id && x._id === localCode) ||
            (x.id && x.id === localCode)
          );
          if (!exists) {
            targetList.unshift({
              ...local,
              _id: localCode,
              id: localCode,
              bookingCode: localCode,
              booking_code: localCode,
              customerName: local.customerName || local.fullName,
              customerPhone: local.customerPhone || local.phone,
              customerEmail: local.customerEmail || local.email,
              vehicleName: local.vehicleName || local.title,
              packageName: local.packageName || local.title,
              totalAmount: local.totalPrice || local.totalAmount,
              depositPaid: local.depositPaid || 1,
              type: isCar ? 'Rental' : 'Tours',
            });
          }
        });

        const busList = Array.isArray(br) ? br : (Array.isArray(br?.data) ? br.data : []);
        setTours({ 
          bookings: mergedTours, 
          inquiries: Array.isArray(ti) ? ti : [], 
          packages: Array.isArray(tp) ? tp : [] 
        });
        setFleet({ 
          bookings: mergedFleet, 
          inquiries: Array.isArray(fi) ? fi : [], 
          vehicles: Array.isArray(fv) ? fv : [] 
        });
        setBusRates(busList);
      })
      .catch((err) => {
        console.warn('[Dashboard] Error loading dashboard data:', err);
      })
      .finally(() => {
        hasLoadedRef.current = true;
        setLoading(false);
      });
  }, []);

  useAutoRefresh(loadData, [], 4000);

  useEffect(() => {
    window.addEventListener('storage', loadData);
    window.addEventListener('aarambha_booking_updated', loadData);
    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('aarambha_booking_updated', loadData);
    };
  }, [loadData]);

  const handleOpenQuickEdit = (b: any) => {
    setEditingBus(b);
    setBusForm({
      busType: b.busType || '',
      baseRate: b.baseRate || 0,
      mumbaiRate: b.mumbaiRate || 0,
      mahabaleshwarRate: b.mahabaleshwarRate || 0,
      packageRate: b.packageRate || 0,
      extraKmRate: b.extraKmRate || 0,
      extraHourRate: b.extraHourRate || 0,
      status: b.status || 'Active',
    });
  };

  const handleSaveQuickEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBus) return;
    try {
      await updateBusRate(editingBus._id, {
        busType: busForm.busType,
        baseRate: Number(busForm.baseRate),
        mumbaiRate: Number(busForm.mumbaiRate),
        mahabaleshwarRate: Number(busForm.mahabaleshwarRate),
        packageRate: Number(busForm.packageRate),
        extraKmRate: Number(busForm.extraKmRate),
        extraHourRate: Number(busForm.extraHourRate),
        status: busForm.status,
      });
      setEditingBus(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update bus rate');
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  const allBookings = [...tours.bookings, ...fleet.bookings];
  const allInquiries = [...tours.inquiries, ...fleet.inquiries];

  const recentBookings = [...allBookings].sort((a, b) => {
    const da = new Date(a.createdAt || a.created_at || a.travelDate || Date.now()).getTime();
    const db = new Date(b.createdAt || b.created_at || b.travelDate || Date.now()).getTime();
    return db - da;
  });

  // Highlight Pune-Mumbai and Mahabaleshwar packages
  const packagesList = busRates.filter(b => 
    b.category === 'urbania_pune_mumbai' ||
    b.mumbaiRate > 0 ||
    b.mahabaleshwarRate > 0 ||
    b.category === 'local_ac'
  );

  return (
    <div className="space-y-8">

      {/* DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-gray-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Overview of real-time bookings, payment verifications, and fleet operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200/80 hover:bg-gray-50 text-gray-600 text-xs font-medium rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Refresh Operations Data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
            <span>Refresh</span>
          </button>
          <Link
            to="/fleet"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200/80 text-gray-700 text-xs font-medium rounded-lg shadow-2xs transition-colors"
          >
            <Bus className="w-3.5 h-3.5 text-gray-400" />
            <span>Manage Fleet ({busRates.length})</span>
          </Link>
        </div>
      </div>

      {/* KPI METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Bookings"
          value={String(allBookings.length)}
          sub={`${fleet.bookings.length} Rental • ${tours.bookings.length} Tours`}
          onClick={() => navigate('/bookings')}
        />
        <KPICard
          label="Customer Inquiries"
          value={String(allInquiries.length)}
          sub="Leads & WhatsApp Inquiries"
          onClick={() => navigate('/customers')}
        />
        <KPICard
          label="Website Buses & Cabs"
          value={String(busRates.length)}
          sub="Live Bus Rates & Rate Cards"
          onClick={() => navigate('/fleet')}
        />
        <KPICard
          label="Self-Drive Fleet"
          value={String(fleet.vehicles.length)}
          sub="Cars & Luxury SUVs"
          onClick={() => navigate('/fleet')}
        />
      </div>

      {/* ⚡ DIRECT DASHBOARD TOUR PACKAGES & BUS RATES EDIT SECTION */}
      {!isViewer && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                {vertical === 'tours' ? 'Tour Packages & Departure Batches' : (vertical === 'fleet' ? 'Pune–Mumbai & Outstation Bus Package Rates' : 'Tour Packages & Bus Rental Rates')}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {vertical === 'tours'
                  ? 'Directly edit prices, duration, and departure batch dates for tour packages listed on the website.'
                  : 'Directly edit prices for Pune–Mumbai cabs, Mahabaleshwar packages, and bus rate cards listed on the website.'}
              </p>
            </div>

            <Link
              to={vertical === 'tours' ? '/tours' : '/fleet'}
              className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 self-start sm:self-auto hover:underline"
            >
              <span>{vertical === 'tours' ? `View All (${tours.packages?.length || 0})` : `Full Inventory (${busRates.length})`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* TOUR PACKAGES LIST (WHEN VERTICAL IS TOURS OR ALL) */}
          {(vertical === 'tours' || vertical === 'all') && tours.packages?.length > 0 && (
            <div className="space-y-3">
              {vertical === 'all' && (
                <div className="flex items-center gap-2 font-medium text-xs text-gray-700 border-b border-gray-100 pb-2">
                  <Compass className="w-3.5 h-3.5 text-gray-400" />
                  <span>Tour Packages ({tours.packages.length})</span>
                </div>
              )}
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/50 text-gray-400 font-medium uppercase text-[10px] tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="py-2.5 px-4">Tour Package Title</th>
                      <th className="py-2.5 px-4">Duration</th>
                      <th className="py-2.5 px-4">Base Price</th>
                      <th className="py-2.5 px-4">Deposit Price</th>
                      <th className="py-2.5 px-4">Departure Batches</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {tours.packages.map((pkg: any) => (
                      <tr key={pkg._id || pkg.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900 flex items-center gap-2">
                          <Compass className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{pkg.title}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {pkg.durationDays || pkg.duration_days || 1}D / {pkg.durationNights || pkg.duration_nights || 0}N
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {formatCurrency(pkg.basePrice || pkg.base_price || 0)}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {formatCurrency(pkg.depositPrice || pkg.deposit_price || 500)}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {Array.isArray(pkg.batchDates) ? pkg.batchDates.length : 0} Available
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => navigate('/tours')}
                            className="px-2.5 py-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/80 font-medium rounded-md text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Pencil className="w-3 h-3 text-gray-400" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BUS & FLEET RATES LIST (WHEN VERTICAL IS FLEET OR ALL) */}
          {(vertical === 'fleet' || vertical === 'all') && busRates.length > 0 && (
            <div className="space-y-3 pt-2">
              {vertical === 'all' && (
                <div className="flex items-center gap-2 font-medium text-xs text-gray-700 border-b border-gray-100 pb-2">
                  <Bus className="w-3.5 h-3.5 text-gray-400" />
                  <span>Bus & Chauffeur Rental Rates ({busRates.length})</span>
                </div>
              )}
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/50 text-gray-400 font-medium uppercase text-[10px] tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="py-2.5 px-4">Bus / Vehicle Package</th>
                      <th className="py-2.5 px-4">Seats</th>
                      <th className="py-2.5 px-4">Local Base Rate</th>
                      <th className="py-2.5 px-4">Mumbai Package Rate</th>
                      <th className="py-2.5 px-4">Mahabaleshwar Rate</th>
                      <th className="py-2.5 px-4">Extra KM</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {busRates.slice(0, 10).map((b) => (
                      <tr key={b._id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900 flex items-center gap-2">
                          <Bus className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{b.busType}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{b.seats} Seater</td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {b.baseRate ? formatCurrency(b.baseRate) : '—'}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {b.packageRate ? formatCurrency(b.packageRate) : (b.mumbaiRate ? formatCurrency(b.mumbaiRate) : '—')}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {b.mahabaleshwarRate ? formatCurrency(b.mahabaleshwarRate) : '—'}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          ₹{b.extraKmRate || 0}/km
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenQuickEdit(b)}
                            className="px-2.5 py-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/80 font-medium rounded-md text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Pencil className="w-3 h-3 text-gray-400" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RECENT BOOKINGS TABLE */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-semibold text-base text-gray-900">Recent Customer Bookings</h3>
            <p className="text-xs text-gray-500 mt-0.5">Live feed of tour departures and vehicle rental reservations.</p>
          </div>
          <Link
            to="/bookings"
            className="text-xs font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1 hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 📱 MOBILE RECENT BOOKINGS CARDS (< 768px) */}
        <div className="md:hidden space-y-3">
          {recentBookings.slice(0, 6).map((b, i) => {
            const isRental = b.type === 'Rental' || b.type === 'Fleet';
            const code = b.bookingCode || b.booking_code || `REF-${i + 100}`;
            const name = b.customerName || b.customer_name || 'Customer';
            const phone = b.customerPhone || b.customer_phone || 'N/A';
            const total = b.totalAmount || b.total_amount || b.totalPrice || 0;
            const depositPaid = b.depositPaid || b.depositAmount || 1;
            const itemName = isRental
              ? (b.vehicleName || b.vehicle_name || b.title || 'Rental Vehicle')
              : (b.packageName || b.package_name || b.title || 'Tour Package');
            const dateVal = b.startDate || b.travelDate || b.pickup_date || b.createdAt;

            return (
              <div key={i} className="bg-gray-50/60 rounded-lg p-3.5 border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-medium text-xs text-gray-900">{code}</span>
                  <Badge color={statusColor(b.status || 'Confirmed')}>{b.status || 'Confirmed'}</Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                    isRental ? 'bg-blue-50 text-blue-700 border border-blue-200/60' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  }`}>
                    {isRental ? <Car className="w-3 h-3 shrink-0" /> : <Compass className="w-3 h-3 shrink-0" />}
                    {b.type}
                  </span>
                  <span className="text-xs font-medium text-gray-800 truncate">{itemName}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{name}</p>
                    <p className="text-[10px] text-gray-400">{formatDate(dateVal)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-emerald-700">₹{depositPaid} paid</p>
                    <p className="text-[10px] text-gray-400">Total: {formatCurrency(total)}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {recentBookings.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-6">No recent bookings recorded.</p>
          )}
        </div>

        {/* 💻 DESKTOP TABLE VIEW (>= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/50 text-gray-400 font-medium uppercase tracking-wider text-[10px] border-b border-gray-100">
              <tr>
                <th className="py-2.5 px-4 font-medium">Booking ID</th>
                <th className="py-2.5 px-4 font-medium">Service Scope</th>
                <th className="py-2.5 px-4 font-medium">Customer</th>
                <th className="py-2.5 px-4 font-medium">Dates</th>
                <th className="py-2.5 px-4 font-medium">Deposit & Total</th>
                <th className="py-2.5 px-4 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {recentBookings.slice(0, 8).map((b, i) => {
                const isRental = b.type === 'Rental' || b.type === 'Fleet';
                const code = b.bookingCode || b.booking_code || `REF-${i + 100}`;
                const name = b.customerName || b.customer_name || 'Customer';
                const phone = b.customerPhone || b.customer_phone || 'N/A';
                const total = b.totalAmount || b.total_amount || b.totalPrice || 0;
                const depositPaid = b.depositPaid || b.depositAmount || 1;
                const itemName = isRental
                  ? (b.vehicleName || b.vehicle_name || b.title || 'Rental Vehicle')
                  : (b.packageName || b.package_name || b.title || 'Tour Package');
                const dateVal = b.startDate || b.travelDate || b.pickup_date || b.createdAt;

                return (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-gray-900">{code}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                        isRental ? 'bg-blue-50 text-blue-700 border border-blue-200/60' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      }`}>
                        {isRental ? <Car className="w-3 h-3 shrink-0" /> : <Compass className="w-3 h-3 shrink-0" />}
                        {b.type}
                      </span>
                      <div className="text-xs font-medium text-gray-900 mt-1">{itemName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{name}</div>
                      <div className="text-[11px] text-gray-400">{phone}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      <div>{formatDate(dateVal)}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-emerald-700">₹{depositPaid} (Deposit)</div>
                      <div className="text-[11px] text-gray-400">Total: {formatCurrency(total)}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge color={statusColor(b.status || 'Confirmed')}>{b.status || 'Confirmed'}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DASHBOARD QUICK EDIT RATE MODAL */}
      {editingBus && (
        <Modal
          isOpen={!!editingBus}
          onClose={() => setEditingBus(null)}
          title={`Quick Edit Rate: ${editingBus.busType}`}
        >
          <form onSubmit={handleSaveQuickEdit} className="space-y-4 text-xs text-gray-700">
            <div>
              <label className="font-bold text-gray-900 block mb-1">Bus / Vehicle Title</label>
              <input
                type="text"
                required
                value={busForm.busType}
                onChange={e => setBusForm({ ...busForm, busType: e.target.value })}
                className="w-full p-2 rounded-lg border border-[#EDE2D0] focus:ring-2 focus:ring-[#C65A2E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#C65A2E] block mb-1">Pune–Mumbai Rate (₹)</label>
                <input
                  type="number"
                  value={busForm.packageRate || busForm.mumbaiRate}
                  onChange={e => setBusForm({ ...busForm, packageRate: Number(e.target.value), mumbaiRate: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-[#EDE2D0] font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="font-bold text-[#C65A2E] block mb-1">Mahabaleshwar Rate (₹)</label>
                <input
                  type="number"
                  value={busForm.mahabaleshwarRate}
                  onChange={e => setBusForm({ ...busForm, mahabaleshwarRate: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-[#EDE2D0] font-bold text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-medium block mb-1">Local Base Rate (₹)</label>
                <input
                  type="number"
                  value={busForm.baseRate}
                  onChange={e => setBusForm({ ...busForm, baseRate: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-[#EDE2D0]"
                />
              </div>
              <div>
                <label className="font-medium block mb-1">Extra KM Rate (₹)</label>
                <input
                  type="number"
                  value={busForm.extraKmRate}
                  onChange={e => setBusForm({ ...busForm, extraKmRate: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-[#EDE2D0]"
                />
              </div>
              <div>
                <label className="font-medium block mb-1">Extra Hour Rate (₹)</label>
                <input
                  type="number"
                  value={busForm.extraHourRate}
                  onChange={e => setBusForm({ ...busForm, extraHourRate: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-[#EDE2D0]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingBus(null)}
                className="px-4 py-2 rounded-lg border border-[#EDE2D0] text-[#493B34] font-bold hover:bg-[#F8EFEA]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#C65A2E] hover:bg-[#B24E25] text-white font-bold shadow-xs cursor-pointer"
              >
                Update Price & Save Live
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
