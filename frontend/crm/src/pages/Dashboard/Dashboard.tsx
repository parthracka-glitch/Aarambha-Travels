import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, ArrowUpRight, CalendarCheck, Compass, Car, Bus, ArrowRight, CheckCircle, AlertTriangle, ShieldAlert, Pencil, RefreshCw, Search } from 'lucide-react';
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

  // Tabbed Inventory State
  const [inventoryTab, setInventoryTab] = useState<'tours' | 'fleet'>('tours');
  const [inventorySearch, setInventorySearch] = useState('');

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

  // Filtered Inventory Lists based on search query
  const filteredTours = (tours.packages || []).filter((pkg: any) => {
    if (!inventorySearch) return true;
    const q = inventorySearch.toLowerCase();
    return (pkg.title || '').toLowerCase().includes(q) || (pkg.location || '').toLowerCase().includes(q);
  });

  const filteredBusRates = busRates.filter((b: any) => {
    if (!inventorySearch) return true;
    const q = inventorySearch.toLowerCase();
    return (
      (b.busType || '').toLowerCase().includes(q) ||
      (b.category || '').toLowerCase().includes(q) ||
      (b.seats ? String(b.seats).includes(q) : false)
    );
  });

  return (
    <div className="space-y-8">

      {/* DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-gray-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Overview of real-time bookings, payment verifications, and fleet operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Refresh Operations Data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span>Refresh</span>
          </button>
          <Link
            to="/fleet"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-medium rounded-lg shadow-xs transition-colors"
          >
            <Bus className="w-3.5 h-3.5 text-gray-300" />
            <span>Manage Fleet ({busRates.length})</span>
          </Link>
        </div>
      </div>

      {/* KPI METRICS GRID — CLEAN, DISTINCT & NO TRUNCATION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Bookings"
          value={String(allBookings.length)}
          sub={`${fleet.bookings.length} Rental • ${tours.bookings.length} Tours`}
          icon={<CalendarCheck className="w-3.5 h-3.5" />}
          variant="blue"
          onClick={() => navigate('/bookings')}
        />
        <KPICard
          label="Customer Inquiries"
          value={String(allInquiries.length)}
          sub="Leads & WhatsApp Inquiries"
          icon={<Clock className="w-3.5 h-3.5" />}
          variant="amber"
          onClick={() => navigate('/customers')}
        />
        <KPICard
          label="Buses & Cabs"
          value={String(busRates.length)}
          sub="Live Bus & Cab Rates"
          icon={<Bus className="w-3.5 h-3.5" />}
          variant="purple"
          onClick={() => navigate('/fleet')}
        />
        <KPICard
          label="Self-Drive Fleet"
          value={String(fleet.vehicles.length)}
          sub="Cars & Luxury SUVs"
          icon={<Car className="w-3.5 h-3.5" />}
          variant="emerald"
          onClick={() => navigate('/fleet')}
        />
      </div>

      {/* ⚡ DIRECT DASHBOARD TOUR PACKAGES & BUS RATES TABBED INVENTORY SECTION */}
      {!isViewer && (
        <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-xs space-y-4">
          {/* SECTION HEADER & TAB CONTROLS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-gray-900 tracking-tight">
                  Website Inventory & Rates
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live on Website
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Directly view and adjust prices for tour packages, Pune–Mumbai cabs, and outstation bus rate cards.
              </p>
            </div>

            {/* Segmented Tab Switch & Navigation Link */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex p-0.5 bg-gray-100/90 border border-gray-200/80 rounded-lg text-xs">
                <button
                  onClick={() => setInventoryTab('tours')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                    inventoryTab === 'tours'
                      ? 'bg-white text-gray-900 shadow-2xs font-semibold'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Compass className={`w-3.5 h-3.5 ${inventoryTab === 'tours' ? 'text-amber-600' : 'text-gray-400'}`} />
                  <span>Tour Packages ({tours.packages?.length || 0})</span>
                </button>
                <button
                  onClick={() => setInventoryTab('fleet')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                    inventoryTab === 'fleet'
                      ? 'bg-white text-gray-900 shadow-2xs font-semibold'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Bus className={`w-3.5 h-3.5 ${inventoryTab === 'fleet' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <span>Buses & Cabs ({busRates.length})</span>
                </button>
              </div>

              <Link
                to={inventoryTab === 'tours' ? '/tours' : '/fleet'}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 rounded-lg shadow-2xs transition-colors"
              >
                <span>Full Inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* INSTANT SEARCH TOOLBAR */}
          <div className="flex items-center justify-between gap-3 pt-0.5">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder={inventoryTab === 'tours' ? 'Search tour packages...' : 'Search bus types, seater, category...'}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
              />
            </div>
            <span className="text-[11px] font-medium text-gray-400 hidden sm:inline-block">
              {inventoryTab === 'tours' 
                ? `Showing ${filteredTours.length} of ${tours.packages?.length || 0} packages`
                : `Showing ${Math.min(filteredBusRates.length, 12)} of ${busRates.length} rate cards`}
            </span>
          </div>

          {/* TAB 1: TOUR PACKAGES */}
          {inventoryTab === 'tours' && (
            <div className="overflow-x-auto no-scrollbar rounded-lg border border-gray-200/80">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/90 text-gray-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200/80">
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
                  {filteredTours.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                        No tour packages found matching "{inventorySearch}".
                      </td>
                    </tr>
                  ) : (
                    filteredTours.map((pkg: any) => (
                      <tr key={pkg._id || pkg.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-gray-900 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0">
                            <Compass className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate max-w-md">{pkg.title}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200/60">
                            {pkg.durationDays || pkg.duration_days || 1}D / {pkg.durationNights || pkg.duration_nights || 0}N
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-900">
                          {formatCurrency(pkg.basePrice || pkg.base_price || 0)}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {formatCurrency(pkg.depositPrice || pkg.deposit_price || 500)}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            {Array.isArray(pkg.batchDates) ? pkg.batchDates.length : 0} Available
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => navigate('/tours')}
                            className="px-2.5 py-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium rounded-md text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs hover:border-gray-300"
                          >
                            <Pencil className="w-3 h-3 text-gray-400" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: BUS & CHAUFFEUR RATES */}
          {inventoryTab === 'fleet' && (
            <div className="space-y-3">
              <div className="overflow-x-auto no-scrollbar rounded-lg border border-gray-200/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/90 text-gray-500 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200/80">
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
                    {filteredBusRates.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-400 text-xs">
                          No bus rates found matching "{inventorySearch}".
                        </td>
                      </tr>
                    ) : (
                      filteredBusRates.slice(0, 12).map((b) => (
                        <tr key={b._id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3 px-4 font-semibold text-gray-900 flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center justify-center shrink-0">
                              <Bus className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="block font-semibold">{b.busType}</span>
                              <span className="block text-[10px] text-gray-400 uppercase tracking-wider">{b.category?.replace(/_/g, ' ') || 'Local & Outstation'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200/60">
                              {b.seats} Seater
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-900">
                            {b.baseRate ? formatCurrency(b.baseRate) : '—'}
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-900">
                            {b.packageRate ? formatCurrency(b.packageRate) : (b.mumbaiRate ? formatCurrency(b.mumbaiRate) : '—')}
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-900">
                            {b.mahabaleshwarRate ? formatCurrency(b.mahabaleshwarRate) : '—'}
                          </td>
                          <td className="py-3 px-4 text-gray-500 font-medium">
                            ₹{b.extraKmRate || 0}/km
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleOpenQuickEdit(b)}
                              className="px-2.5 py-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium rounded-md text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs hover:border-gray-300"
                            >
                              <Pencil className="w-3 h-3 text-gray-400" />
                              <span>Edit</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {filteredBusRates.length > 12 && (
                <div className="flex items-center justify-between pt-2 text-xs text-gray-500 px-1">
                  <span>Showing 12 of {busRates.length} bus & cab rate cards</span>
                  <Link
                    to="/fleet"
                    className="text-xs font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-1 hover:underline"
                  >
                    <span>View all in Fleet Manager</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* RECENT BOOKINGS TABLE */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-5 shadow-xs space-y-4">
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
              <div key={i} className="bg-gray-50/60 rounded-lg p-3.5 border border-gray-150 space-y-2">
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
                <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-150">
                  <div>
                    <p className="font-medium text-gray-900">{name}</p>
                    <p className="text-[10px] text-gray-400">{formatDate(dateVal)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-700">₹{depositPaid} paid</p>
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
        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/90 text-gray-500 font-semibold uppercase tracking-wider text-[10px] border-b border-gray-200/80">
              <tr>
                <th className="py-2.5 px-4">Booking ID</th>
                <th className="py-2.5 px-4">Service Scope</th>
                <th className="py-2.5 px-4">Customer</th>
                <th className="py-2.5 px-4">Dates</th>
                <th className="py-2.5 px-4">Deposit & Total</th>
                <th className="py-2.5 px-4 text-right">Status</th>
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
