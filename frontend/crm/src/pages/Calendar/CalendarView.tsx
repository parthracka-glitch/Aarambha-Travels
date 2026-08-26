import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Download,
  Printer, Users, Car, Compass, CheckCircle2, ArrowUpRight, ArrowDownLeft,
  Search, Eye, FileSpreadsheet, FileText, Info, RefreshCw, X, Clock, MapPin, Phone, MessageSquare
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getToursBookings, getToursPackages } from '@/api/tours.api';
import { getFleetBookings, getFleetVehicles } from '@/api/fleet.api';
import { Loader } from '@/components/common/Loader';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { WhatsAppBookingModal } from '@/components/common/WhatsAppBookingModal';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  exportMembersListPDF,
  exportMembersListExcel,
  openPrintMembersListView,
  ManifestTraveler
} from '@/utils/exportManifest';
import { generateInvoicePDF } from '@/utils/generateInvoicePDF';
import { useAutoRefresh } from '@/hooks/useRealtimeSync';

type VerticalFilter = 'all' | 'tours' | 'fleet';
type ViewMode = 'calendar' | 'packages';

interface UnifiedEvent {
  id: string;
  bookingId: string;
  bookingCode: string;
  type: 'tour' | 'fleet';
  eventType: 'out' | 'in'; // out = departure/pickup, in = return/dropoff
  dateStr: string; // YYYY-MM-DD
  title: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  paxCount?: number;
  seats?: number;
  packageId?: string;
  packageName?: string;
  vehicleName?: string;
  vehicleReg?: string;
  departureDate?: string;
  returnDate?: string;
  pickupLocation?: string;
  pickupTime?: string;
  status: string;
  depositPaid: number;
  totalAmount: number;
  rawBooking: any;
}

export default function CalendarView() {
  const { activeVertical: userVertical, user } = useAuth();
  const isViewer = user?.role === 'viewer';

  // Data states
  const [toursBookings, setToursBookings] = useState<any[]>([]);
  const [fleetBookings, setFleetBookings] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters and navigation
  const [selectedVertical, setSelectedVertical] = useState<VerticalFilter>('all');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [searchQuery, setSearchQuery] = useState('');

  // Calendar Date
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  // Selected Day Details Modal (Direct Members List & Car Rental List)
  const [selectedDayData, setSelectedDayData] = useState<{
    dateStr: string;
    packagesList: {
      packageId: string;
      packageName: string;
      travelers: ManifestTraveler[];
      departureDate: string;
      returnDate: string;
    }[];
    fleetEvents: UnifiedEvent[];
  } | null>(null);

  // Active selected package tab inside the Day Modal (if multiple packages on that day)
  const [activePackageIndex, setActivePackageIndex] = useState<number>(0);

  // Single Booking Detail Modal
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<UnifiedEvent | null>(null);
  const [whatsAppModalBooking, setWhatsAppModalBooking] = useState<any | null>(null);

  // Selected Package in "Packages & Members" Explorer tab
  const [explorerPackageId, setExplorerPackageId] = useState<string>('');

  // ─── Fetch Data ─────────────────────────────────────────────────────────────
  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      getToursPackages().then(res => (Array.isArray(res) ? res : [])),
      getFleetVehicles().then(res => (Array.isArray(res) ? res : [])),
      getToursBookings().then(res => (Array.isArray(res) ? res : [])),
      getFleetBookings().then(res => (Array.isArray(res) ? res : [])),
    ])
      .then(([pkgs, vechs, tb, fb]) => {
        setPackages(pkgs);
        setVehicles(vechs);
        setToursBookings(tb);
        setFleetBookings(fb);
        if (pkgs.length > 0 && !explorerPackageId) {
          setExplorerPackageId(pkgs[0]._id || pkgs[0].id || pkgs[0].slug || '');
        }
      })
      .finally(() => setLoading(false));
  }, [explorerPackageId]);

  useAutoRefresh(loadData, ['BOOKINGS_UPDATED', 'TOURS_UPDATED', 'FLEET_UPDATED'], 6000);

  // Sync userVertical if set in layout
  useEffect(() => {
    if (userVertical === 'tours') setSelectedVertical('tours');
    else if (userVertical === 'fleet') setSelectedVertical('fleet');
  }, [userVertical]);

  // Helper: map package duration
  const getPackageDuration = useCallback(
    (pkgIdOrName: string) => {
      const found = packages.find(
        p => p._id === pkgIdOrName || p.id === pkgIdOrName || p.slug === pkgIdOrName || p.title === pkgIdOrName
      );
      return found?.durationDays || found?.duration_days || 5;
    },
    [packages]
  );

  // Helper: Format date to YYYY-MM-DD
  const toDateKey = (dateInput: any): string => {
    if (!dateInput) return '';
    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return String(dateInput).split('T')[0];
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return '';
    }
  };

  // Helper: Add days to date string
  const addDaysToDate = (dateStr: string, days: number): string => {
    try {
      const d = new Date(dateStr);
      d.setDate(d.getDate() + days);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return dateStr;
    }
  };

  // ─── Build Unified Events List ──────────────────────────────────────────────
  const unifiedEvents = useMemo(() => {
    const events: UnifiedEvent[] = [];

    // 1. Process Tours Bookings
    toursBookings.forEach(b => {
      const bId = b._id || b.id || `TB-${Math.random()}`;
      const code = b.bookingCode || b.booking_code || `TR-${bId.slice(-4).toUpperCase()}`;
      const name = b.customerName || b.customer_name || 'Guest Member';
      const phone = b.customerPhone || b.customer_phone || '';
      const email = b.customerEmail || b.customer_email || '';
      const pax = Number(b.paxCount || b.pax_count || b.guestsCount || 1);
      const pkgName = b.packageId?.title || b.packageName || 'Tour Package';
      const pkgId = b.packageId?._id || b.packageId?.id || b.packageId || b.packageName || 'general-pkg';
      const duration = getPackageDuration(pkgId);

      const depDate = toDateKey(b.travelDate || b.travel_date || b.startDate || b.createdAt);
      const retDate = toDateKey(b.returnDate || b.return_date || b.endDate) || addDaysToDate(depDate, Math.max(1, duration - 1));

      // Departure Event ("Out")
      if (depDate) {
        events.push({
          id: `${bId}-dep`,
          bookingId: bId,
          bookingCode: code,
          type: 'tour',
          eventType: 'out',
          dateStr: depDate,
          title: `${pkgName} (Dep: ${pax} Seats)`,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          paxCount: pax,
          seats: pax,
          packageId: String(pkgId),
          packageName: pkgName,
          departureDate: depDate,
          returnDate: retDate,
          pickupLocation: 'Swargate / Katraj Terminal, Pune',
          pickupTime: '06:00 AM',
          status: b.status || 'Confirmed',
          depositPaid: Number(b.depositPaid || b.deposit_paid || 500),
          totalAmount: Number(b.totalAmount || b.total_amount || 0),
          rawBooking: b,
        });
      }

      // Return Event ("In")
      if (retDate && retDate !== depDate) {
        events.push({
          id: `${bId}-ret`,
          bookingId: bId,
          bookingCode: code,
          type: 'tour',
          eventType: 'in',
          dateStr: retDate,
          title: `${pkgName} (Return)`,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          paxCount: pax,
          seats: pax,
          packageId: String(pkgId),
          packageName: pkgName,
          departureDate: depDate,
          returnDate: retDate,
          pickupLocation: 'Swargate / Katraj Terminal, Pune',
          pickupTime: '06:00 AM',
          status: b.status || 'Confirmed',
          depositPaid: Number(b.depositPaid || b.deposit_paid || 500),
          totalAmount: Number(b.totalAmount || b.total_amount || 0),
          rawBooking: b,
        });
      }
    });

    // 2. Process Fleet Bookings (Car Rental)
    fleetBookings.forEach(b => {
      const bId = b._id || b.id || `FB-${Math.random()}`;
      const code = b.bookingCode || b.booking_code || `FL-${bId.slice(-4).toUpperCase()}`;
      const name = b.customerName || b.customer_name || 'Guest Driver';
      const phone = b.customerPhone || b.customer_phone || '';
      const email = b.customerEmail || b.customer_email || '';
      const vechName = b.vehicleId?.name || b.vehicleName || b.vehicle_name || 'Car Rental';
      const vechReg = b.vehicleId?.regNumber || b.vehicleReg || b.registrationNumber || 'MH 12 Registered';

      const pickDate = toDateKey(b.pickupDatetime || b.pickupDate || b.pickup_date || b.startDate);
      const dropDate = toDateKey(b.dropoffDatetime || b.returnDate || b.return_date || b.dropoffDate || b.endDate);

      // Pickup Event ("Out")
      if (pickDate) {
        events.push({
          id: `${bId}-pick`,
          bookingId: bId,
          bookingCode: code,
          type: 'fleet',
          eventType: 'out',
          dateStr: pickDate,
          title: `${vechName} (Pickup)`,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          vehicleName: vechName,
          vehicleReg: vechReg,
          departureDate: pickDate,
          returnDate: dropDate,
          pickupLocation: 'Katraj Office / Doorstep Pune',
          pickupTime: '10:00 AM',
          status: b.status || 'Confirmed',
          depositPaid: Number(b.depositAmount || b.depositPaid || b.deposit_paid || 500),
          totalAmount: Number(b.totalRentalAmount || b.totalPrice || b.total_price || 0),
          rawBooking: b,
        });
      }

      // Return / Dropoff Event ("In")
      if (dropDate) {
        events.push({
          id: `${bId}-drop`,
          bookingId: bId,
          bookingCode: code,
          type: 'fleet',
          eventType: 'in',
          dateStr: dropDate,
          title: `${vechName} (Return)`,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          vehicleName: vechName,
          vehicleReg: vechReg,
          departureDate: pickDate,
          returnDate: dropDate,
          pickupLocation: 'Katraj Office / Swargate Pune',
          pickupTime: '08:00 PM',
          status: b.status || 'Confirmed',
          depositPaid: Number(b.depositAmount || b.depositPaid || b.deposit_paid || 500),
          totalAmount: Number(b.totalRentalAmount || b.totalPrice || b.total_price || 0),
          rawBooking: b,
        });
      }
    });

    return events;
  }, [toursBookings, fleetBookings, getPackageDuration]);

  // Filtered Events according to vertical filter & package filter & search
  const filteredEvents = useMemo(() => {
    return unifiedEvents.filter(ev => {
      if (selectedVertical === 'tours' && ev.type !== 'tour') return false;
      if (selectedVertical === 'fleet' && ev.type !== 'fleet') return false;

      if (selectedPackageId !== 'all') {
        if (ev.type === 'tour') {
          const matchesPkg =
            ev.packageId === selectedPackageId ||
            ev.packageName?.toLowerCase().includes(selectedPackageId.toLowerCase());
          if (!matchesPkg) return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          ev.customerName.toLowerCase().includes(q) ||
          ev.customerPhone.toLowerCase().includes(q) ||
          ev.bookingCode.toLowerCase().includes(q) ||
          (ev.packageName && ev.packageName.toLowerCase().includes(q)) ||
          (ev.vehicleName && ev.vehicleName.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [unifiedEvents, selectedVertical, selectedPackageId, searchQuery]);

  // Map of dateStr -> events for quick lookup
  const eventsByDate = useMemo(() => {
    const map = new Map<string, UnifiedEvent[]>();
    filteredEvents.forEach(ev => {
      if (!map.has(ev.dateStr)) {
        map.set(ev.dateStr, []);
      }
      map.get(ev.dateStr)!.push(ev);
    });
    return map;
  }, [filteredEvents]);

  // ─── Calendar Month Grid Calculations ──────────────────────────────────────
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = useMemo(() => {
    const days: { dayNumber: number; dateStr: string; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = totalDaysInPrevMonth - i;
      const prevM = month === 0 ? 11 : month - 1;
      const prevY = month === 0 ? year - 1 : year;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateStr, isCurrentMonth: false });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateStr, isCurrentMonth: true });
    }

    // Next month padding
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextM = month === 11 ? 0 : month + 1;
      const nextY = month === 11 ? year + 1 : year;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dayNumber: d, dateStr, isCurrentMonth: false });
    }

    return days;
  }, [year, month, firstDayIndex, totalDaysInMonth, totalDaysInPrevMonth]);

  // ─── Month Navigation ──────────────────────────────────────────────────────
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  // ─── Super Simple Day Click: Open Direct Members & Operations List ─────────
  const handleDayClick = (dateStr: string) => {
    const dayEvs = eventsByDate.get(dateStr) || [];
    const toursEvs = dayEvs.filter(e => e.type === 'tour');
    const fleetEvs = dayEvs.filter(e => e.type === 'fleet');

    // Group Tour Bookings by Package Name on this date
    const pkgMap = new Map<string, { packageId: string; packageName: string; travelers: ManifestTraveler[]; departureDate: string; returnDate: string }>();

    toursEvs.forEach(ev => {
      const pKey = ev.packageId || ev.packageName || 'Unknown Package';
      if (!pkgMap.has(pKey)) {
        pkgMap.set(pKey, {
          packageId: ev.packageId || '',
          packageName: ev.packageName || 'Tour Package',
          departureDate: ev.departureDate || dateStr,
          returnDate: ev.returnDate || dateStr,
          travelers: [],
        });
      }
      const existing = pkgMap.get(pKey)!.travelers.find(t => t.bookingId === ev.bookingId);
      if (!existing) {
        pkgMap.get(pKey)!.travelers.push({
          bookingId: ev.bookingId,
          bookingCode: ev.bookingCode,
          travelerName: ev.customerName,
          customerName: ev.customerName,
          phone: ev.customerPhone,
          email: ev.customerEmail,
          seatCount: ev.seats || ev.paxCount || 1,
          paxCount: ev.paxCount || 1,
          totalAmount: ev.totalAmount,
          depositPaid: ev.depositPaid,
          status: ev.status,
          pickupPoint: ev.pickupLocation,
          specialRequests: ev.rawBooking?.specialRequests || '',
        });
      }
    });

    const packagesList = Array.from(pkgMap.values());

    setActivePackageIndex(0);
    setSelectedDayData({
      dateStr,
      packagesList,
      fleetEvents: fleetEvs,
    });
  };

  // ─── Packages Explorer Data Calculation ──────────────────────────────────────
  const selectedExplorerPackage = useMemo(() => {
    if (!explorerPackageId) return packages[0] || null;
    return packages.find(p => p._id === explorerPackageId || p.id === explorerPackageId || p.slug === explorerPackageId) || null;
  }, [packages, explorerPackageId]);

  const packageBatchesWithBookings = useMemo(() => {
    if (!selectedExplorerPackage) return [];

    const pkgId = selectedExplorerPackage._id || selectedExplorerPackage.id || selectedExplorerPackage.slug;
    const pkgTitle = selectedExplorerPackage.title || 'Tour Package';
    const duration = selectedExplorerPackage.durationDays || selectedExplorerPackage.duration_days || 5;

    const bookingsForPkg = toursBookings.filter(b => {
      const bPkgId = b.packageId?._id || b.packageId?.id || b.packageId || b.packageName;
      return (
        bPkgId === pkgId ||
        (b.packageName && b.packageName.toLowerCase() === pkgTitle.toLowerCase()) ||
        (b.packageId?.title && b.packageId.title.toLowerCase() === pkgTitle.toLowerCase())
      );
    });

    const dateGroups = new Map<string, ManifestTraveler[]>();
    const batchDates = selectedExplorerPackage.batchDates || [];
    batchDates.forEach((b: any) => {
      if (b.startDate && !dateGroups.has(b.startDate)) {
        dateGroups.set(b.startDate, []);
      }
    });

    bookingsForPkg.forEach(b => {
      const depDate = toDateKey(b.travelDate || b.travel_date || b.startDate || b.createdAt);
      if (!depDate) return;
      if (!dateGroups.has(depDate)) {
        dateGroups.set(depDate, []);
      }
      dateGroups.get(depDate)!.push({
        bookingId: b._id || b.id || '',
        bookingCode: b.bookingCode || b.booking_code || `TR-${b._id?.slice(-4).toUpperCase()}`,
        travelerName: b.customerName || b.customer_name || 'Guest Member',
        customerName: b.customerName || b.customer_name || 'Guest Member',
        phone: b.customerPhone || b.customer_phone || '',
        email: b.customerEmail || b.customer_email || '',
        seatCount: Number(b.paxCount || b.pax_count || b.guestsCount || 1),
        paxCount: Number(b.paxCount || b.pax_count || b.guestsCount || 1),
        totalAmount: Number(b.totalAmount || b.total_amount || 0),
        depositPaid: Number(b.depositPaid || b.deposit_paid || 500),
        status: b.status || 'Confirmed',
        pickupPoint: 'Swargate / Katraj Terminal, Pune',
        specialRequests: b.specialRequests || '',
      });
    });

    const sortedDates = Array.from(dateGroups.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return sortedDates.map(depDate => {
      const travelers = dateGroups.get(depDate) || [];
      const totalPax = travelers.reduce((sum, t) => sum + (t.seatCount || 1), 0);
      const retDate = addDaysToDate(depDate, Math.max(1, duration - 1));
      return {
        departureDate: depDate,
        returnDate: retDate,
        packageName: pkgTitle,
        travelers,
        totalPax,
        bookingsCount: travelers.length,
      };
    });
  }, [selectedExplorerPackage, toursBookings]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 select-none font-sans pb-12">
      
      {/* ─── Top Header & Controls ────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-200/70 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-red-50 text-[#EF4444] border border-red-100 shadow-sm">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2">
                All-in-One Operations Calendar
                {isViewer && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    View Only
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Unified departure &amp; return schedule &middot; Click any date to view and export Members Lists.
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Tabs & Refresh */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-gray-100/80 p-1 rounded-2xl border border-gray-200 flex text-xs font-semibold text-gray-600">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Month Calendar</span>
            </button>
            <button
              onClick={() => setViewMode('packages')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'packages'
                  ? 'bg-white text-gray-900 shadow-sm font-bold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>Packages &amp; Members</span>
            </button>
          </div>

          <button
            onClick={loadData}
            title="Refresh Schedule Data"
            className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Global Filter Bar ─────────────────────────────────────────────── */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-200/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Scope Selector: All / Tours / Car Rental */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {(['all', 'tours', 'fleet'] as const).map(v => (
            <button
              key={v}
              onClick={() => setSelectedVertical(v)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                selectedVertical === v
                  ? 'bg-[#111827] text-white border-[#111827] shadow-sm'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {v === 'all' && <span>All Bookings</span>}
              {v === 'tours' && (
                <>
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Tours &amp; Travels</span>
                </>
              )}
              {v === 'fleet' && (
                <>
                  <Car className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Car Rental</span>
                </>
              )}
            </button>
          ))}
        </div>

        {/* Search and Package Filter Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Package Filter (visible when tours or all is active) */}
          {selectedVertical !== 'fleet' && (
            <div className="relative">
              <select
                value={selectedPackageId}
                onChange={e => setSelectedPackageId(e.target.value)}
                className="text-xs font-semibold bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer"
              >
                <option value="all">🧳 All Tour Packages ({packages.length})</option>
                {packages.map(p => (
                  <option key={p._id || p.id || p.slug} value={p._id || p.id || p.slug}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Search Member / Booking */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search member, phone, ref..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-2xl pl-8 pr-3 py-2 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Legend / Info Banner ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-1 text-xs text-gray-500 font-medium">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
            <span className="font-bold text-gray-700">Out / Departure</span>
            <span className="text-[10px] text-gray-400">(Trip Starts / Car Pickup)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-100"></span>
            <span className="font-bold text-gray-700">In / Return</span>
            <span className="text-[10px] text-gray-400">(Trip Ends / Car Return)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>Tours &amp; Travels</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Car Rental</span>
          </div>
        </div>

        <div className="text-[11px] text-gray-400">
          💡 Click any date on the calendar to see members list and print or download.
        </div>
      </div>

      {/* ─── MODE 1: MONTH CALENDAR VIEW ──────────────────────────────────── */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
          
          {/* Calendar Month Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-3">
              <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight font-syne">
                {monthName}
              </h3>
              <button
                onClick={handleToday}
                className="text-[11px] font-bold px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 shadow-sm transition-all"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all shadow-sm"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all shadow-sm"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/80 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div
                key={d}
                className={`py-2.5 text-[11px] font-bold uppercase tracking-wider ${
                  i === 0 || i === 6 ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Month 7-Column Grid */}
          <div className="grid grid-cols-7 auto-rows-fr bg-gray-200/50 gap-[1px]">
            {calendarDays.map((cell, idx) => {
              const dayEvs = eventsByDate.get(cell.dateStr) || [];
              const outEvs = dayEvs.filter(e => e.eventType === 'out');
              const inEvs = dayEvs.filter(e => e.eventType === 'in');
              
              const isToday = toDateKey(new Date()) === cell.dateStr;
              const hasEvents = dayEvs.length > 0;

              return (
                <div
                  key={`${cell.dateStr}-${idx}`}
                  onClick={() => handleDayClick(cell.dateStr)}
                  className={`min-h-[110px] sm:min-h-[135px] p-2 flex flex-col justify-between transition-all duration-150 cursor-pointer ${
                    cell.isCurrentMonth ? 'bg-white hover:bg-slate-50/90' : 'bg-gray-50/60 text-gray-400 hover:bg-gray-100/60'
                  } ${isToday ? 'ring-2 ring-red-500/80 ring-inset bg-red-50/20' : ''}`}
                >
                  
                  {/* Top Day Number & Counts Badge */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-[#EF4444] text-white shadow-sm'
                          : cell.isCurrentMonth
                          ? 'text-gray-800'
                          : 'text-gray-400'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {/* Summary Out / In Counts */}
                    {hasEvents && (
                      <div className="flex items-center gap-1">
                        {outEvs.length > 0 && (
                          <span
                            className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5"
                            title={`${outEvs.length} Out / Departures`}
                          >
                            <ArrowUpRight className="w-2.5 h-2.5 text-emerald-600" />
                            {outEvs.length} Out
                          </span>
                        )}
                        {inEvs.length > 0 && (
                          <span
                            className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 flex items-center gap-0.5"
                            title={`${inEvs.length} In / Returns`}
                          >
                            <ArrowDownLeft className="w-2.5 h-2.5 text-red-600" />
                            {inEvs.length} In
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Event Badges List */}
                  <div className="space-y-1 overflow-hidden flex-1">
                    {dayEvs.slice(0, 3).map(ev => {
                      const isTour = ev.type === 'tour';
                      const isOut = ev.eventType === 'out';

                      return (
                        <div
                          key={ev.id}
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md truncate flex items-center gap-1 border transition-all ${
                            isOut
                              ? isTour
                                ? 'bg-emerald-50/90 text-emerald-900 border-emerald-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isTour
                              ? 'bg-rose-50/90 text-rose-900 border-rose-200'
                              : 'bg-amber-50 text-amber-900 border-amber-200'
                          }`}
                          title={`${isTour ? '🧳 ' + ev.packageName : '🚗 ' + ev.vehicleName} (${isOut ? 'Out/Dep' : 'In/Ret'}) - ${ev.customerName}`}
                        >
                          {isTour ? (
                            <Compass className="w-2.5 h-2.5 shrink-0 text-indigo-600" />
                          ) : (
                            <Car className="w-2.5 h-2.5 shrink-0 text-amber-600" />
                          )}
                          <span className="font-extrabold uppercase text-[9px] mr-0.5">
                            {isOut ? 'Out' : 'In'}
                          </span>
                          <span className="truncate">
                            {isTour ? ev.packageName : ev.vehicleName}
                          </span>
                          {ev.seats && (
                            <span className="ml-auto text-[9px] font-bold text-gray-500">
                              {ev.seats}p
                            </span>
                          )}
                        </div>
                      );
                    })}

                    {dayEvs.length > 3 && (
                      <div className="text-[9px] font-bold text-gray-500 text-center py-0.5 bg-gray-100 rounded-md">
                        +{dayEvs.length - 3} more trips
                      </div>
                    )}
                  </div>

                  {!hasEvents && cell.isCurrentMonth && (
                    <div className="text-[10px] text-gray-300 font-medium text-center opacity-0 group-hover:opacity-100">
                      —
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── MODE 2: PACKAGES & MEMBERS EXPLORER ─────────────────────────── */}
      {viewMode === 'packages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Tour Package Selector */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600" /> Tour Packages
            </h3>
            <p className="text-xs text-gray-500">
              Select any package below to view members and download printable lists.
            </p>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {packages.map(p => {
                const pkgId = p._id || p.id || p.slug;
                const isSelected = explorerPackageId === pkgId;

                const count = toursBookings.filter(
                  b => b.packageId?._id === pkgId || b.packageId === pkgId || b.packageName === p.title
                ).length;

                return (
                  <button
                    key={pkgId}
                    onClick={() => setExplorerPackageId(pkgId)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#111827] text-white border-[#111827] shadow-md'
                        : 'bg-gray-50/70 text-gray-800 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs leading-tight">{p.title}</p>
                      <p className={`text-[10px] mt-1 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                        {p.durationDays || p.duration_days || 5} Days &middot; ₹{(p.basePrice || p.base_price || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {count} Bookings
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Scheduled Batches & Members Lists */}
          <div className="lg:col-span-2 space-y-4">
            {selectedExplorerPackage ? (
              <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Tour Package Schedule
                    </span>
                    <h2 className="text-xl font-extrabold text-gray-900 mt-1">
                      {selectedExplorerPackage.title}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Duration: {selectedExplorerPackage.durationDays || selectedExplorerPackage.duration_days || 5} Days &middot; Pickup: Swargate / Katraj Terminal
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-bold">Scheduled Batches</p>
                    <p className="text-lg font-extrabold text-gray-900">{packageBatchesWithBookings.length} Dates</p>
                  </div>
                </div>

                {/* List of Batches / Departure Dates */}
                <div className="space-y-4">
                  {packageBatchesWithBookings.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500 text-xs">
                      No upcoming bookings registered yet for this tour package.
                    </div>
                  ) : (
                    packageBatchesWithBookings.map((batch, bIdx) => (
                      <div
                        key={batch.departureDate + bIdx}
                        className="bg-gray-50/80 rounded-2xl border border-gray-200/80 p-4 sm:p-5 space-y-4 hover:border-gray-300 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                              <h4 className="font-extrabold text-sm text-gray-900">
                                Departure: {formatDate(batch.departureDate)}
                              </h4>
                              <span className="text-gray-400 text-xs">&rarr;</span>
                              <span className="text-xs font-semibold text-gray-600">
                                Return: {formatDate(batch.returnDate)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {batch.totalPax} Members / Seats across {batch.bookingsCount} Booking(s)
                            </p>
                          </div>

                          {/* Action Buttons: PDF, Excel, Print */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                openPrintMembersListView({
                                  packageName: batch.packageName,
                                  departureDate: batch.departureDate,
                                  returnDate: batch.returnDate,
                                  travelers: batch.travelers,
                                })
                              }
                              disabled={batch.travelers.length === 0}
                              className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-40"
                              title="Print Members List"
                            >
                              <Printer className="w-3.5 h-3.5 text-gray-600" />
                              <span>Print</span>
                            </button>

                            <button
                              onClick={() =>
                                exportMembersListPDF({
                                  packageName: batch.packageName,
                                  departureDate: batch.departureDate,
                                  returnDate: batch.returnDate,
                                  travelers: batch.travelers,
                                })
                              }
                              disabled={batch.travelers.length === 0}
                              className="px-3 py-1.5 rounded-xl bg-red-500 text-white hover:bg-red-600 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-40"
                              title="Download Printable PDF Members List"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </button>

                            <button
                              onClick={() =>
                                exportMembersListExcel({
                                  packageName: batch.packageName,
                                  departureDate: batch.departureDate,
                                  returnDate: batch.returnDate,
                                  travelers: batch.travelers,
                                })
                              }
                              disabled={batch.travelers.length === 0}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-40"
                              title="Download Excel / CSV Sheet"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5" />
                              <span>Download Excel</span>
                            </button>
                          </div>
                        </div>

                        {/* Quick Member Table */}
                        {batch.travelers.length > 0 ? (
                          <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden text-xs">
                            <table className="w-full text-left">
                              <thead className="bg-gray-100 text-gray-700 font-bold text-[10px] uppercase">
                                <tr>
                                  <th className="py-2.5 px-3">S.No</th>
                                  <th className="py-2.5 px-3">Member Name</th>
                                  <th className="py-2.5 px-3">Phone</th>
                                  <th className="py-2.5 px-3 text-center">Seats</th>
                                  <th className="py-2.5 px-3">Booking Ref</th>
                                  <th className="py-2.5 px-3">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 font-medium">
                                {batch.travelers.map((t, idx) => (
                                  <tr key={t.bookingId + idx} className="hover:bg-slate-50">
                                    <td className="py-2.5 px-3 font-semibold text-gray-400">{idx + 1}</td>
                                    <td className="py-2.5 px-3 font-bold text-gray-900">{t.travelerName}</td>
                                    <td className="py-2.5 px-3 text-gray-600">{t.phone}</td>
                                    <td className="py-2.5 px-3 text-center">
                                      <span className="font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-[10px]">
                                        {t.seatCount || t.paxCount || 1}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 font-mono font-bold text-gray-700">
                                      {t.bookingCode || t.bookingId.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <Badge color="green">{t.status || 'Confirmed'}</Badge>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-[11px] text-gray-400 italic">
                            No members registered yet for this date batch.
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center text-gray-500">
                Please select a tour package from the left.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── DIRECT & SIMPLE DAY OPERATIONS MODAL ─────────────────────────── */}
      {selectedDayData && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDayData(null)}
          title={`Day Operations & Members – ${formatDate(selectedDayData.dateStr)}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6 font-sans">
            
            {/* Top Date & Package Tabs (if multiple packages on that day) */}
            {selectedDayData.packagesList.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
                  Tour Packages:
                </span>
                {selectedDayData.packagesList.map((pkg, pIdx) => {
                  const isActive = activePackageIndex === pIdx;
                  const totalSeats = pkg.travelers.reduce((s, t) => s + (t.seatCount || 1), 0);
                  return (
                    <button
                      key={pkg.packageId + pIdx}
                      onClick={() => setActivePackageIndex(pIdx)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                        isActive
                          ? 'bg-[#111827] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Compass className="w-3 h-3 text-indigo-400" />
                      <span>{pkg.packageName}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                        {totalSeats}p
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* DIRECT TOUR PACKAGE MEMBERS LIST SECTION */}
            {selectedDayData.packagesList.length > 0 && (() => {
              const currentPkg = selectedDayData.packagesList[activePackageIndex] || selectedDayData.packagesList[0];
              const totalSeats = currentPkg.travelers.reduce((s, t) => s + (t.seatCount || t.paxCount || 1), 0);

              return (
                <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-4 sm:p-5 space-y-4">
                  
                  {/* Package Header with direct Download Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Tours &amp; Travels Members List
                        </span>
                        <span className="text-xs font-extrabold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                          {totalSeats} Total Members ({currentPkg.travelers.length} Bookings)
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mt-1.5">
                        {currentPkg.packageName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Departure: <strong className="text-gray-800">{formatDate(currentPkg.departureDate)}</strong> &rarr; Return: <strong className="text-gray-800">{formatDate(currentPkg.returnDate)}</strong> &middot; Swargate / Katraj (06:00 AM)
                      </p>
                    </div>

                    {/* Direct 1-Click Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          openPrintMembersListView({
                            packageName: currentPkg.packageName,
                            departureDate: currentPkg.departureDate,
                            returnDate: currentPkg.returnDate,
                            travelers: currentPkg.travelers,
                          })
                        }
                        disabled={currentPkg.travelers.length === 0}
                        className="px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-40"
                        title="Print Members List"
                      >
                        <Printer className="w-3.5 h-3.5 text-gray-600" />
                        <span>Print</span>
                      </button>

                      <button
                        onClick={() =>
                          exportMembersListPDF({
                            packageName: currentPkg.packageName,
                            departureDate: currentPkg.departureDate,
                            returnDate: currentPkg.returnDate,
                            travelers: currentPkg.travelers,
                          })
                        }
                        disabled={currentPkg.travelers.length === 0}
                        className="px-3.5 py-2 rounded-xl bg-[#EF4444] text-white hover:bg-red-600 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-40"
                        title="Download PDF Sheet"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>

                      <button
                        onClick={() =>
                          exportMembersListExcel({
                            packageName: currentPkg.packageName,
                            departureDate: currentPkg.departureDate,
                            returnDate: currentPkg.returnDate,
                            travelers: currentPkg.travelers,
                          })
                        }
                        disabled={currentPkg.travelers.length === 0}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-40"
                        title="Download Excel Sheet"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Download Excel</span>
                      </button>
                    </div>
                  </div>

                  {/* Members Table */}
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-white font-bold text-[10px] uppercase">
                        <tr>
                          <th className="py-2.5 px-3 text-center w-12">S.No</th>
                          <th className="py-2.5 px-3">Member Name</th>
                          <th className="py-2.5 px-3 text-center">Phone Number</th>
                          <th className="py-2.5 px-3 text-center w-16">Seats</th>
                          <th className="py-2.5 px-3 text-center">Booking ID</th>
                          <th className="py-2.5 px-3 text-center">Payment</th>
                          <th className="py-2.5 px-3 text-center w-24">Attendance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {currentPkg.travelers.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-6 text-center text-gray-400 text-xs">
                              No members registered for this date yet.
                            </td>
                          </tr>
                        ) : (
                          currentPkg.travelers.map((t, idx) => (
                            <tr key={t.bookingId + idx} className="hover:bg-slate-50 transition-colors">
                              <td className="py-2.5 px-3 text-center font-bold text-gray-400">{idx + 1}</td>
                              <td className="py-2.5 px-3">
                                <p className="font-extrabold text-gray-900">{t.travelerName || t.customerName}</p>
                                {t.specialRequests && (
                                  <p className="text-[10px] text-gray-400 italic mt-0.5">{t.specialRequests}</p>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-center font-semibold text-gray-700">
                                <a href={`tel:${t.phone}`} className="hover:text-blue-600 flex items-center justify-center gap-1">
                                  <Phone className="w-3 h-3 text-gray-400" />
                                  {t.phone || '—'}
                                </a>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span className="font-black text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full text-xs">
                                  {t.seatCount || t.paxCount || 1}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center font-mono font-bold text-gray-800">
                                {t.bookingCode || t.bookingId.slice(-6).toUpperCase()}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <Badge color={t.status === 'Confirmed' ? 'green' : 'amber'}>
                                  {t.depositPaid ? `₹${t.depositPaid} Paid` : t.status || 'Confirmed'}
                                </Badge>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <label className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-gray-600">
                                  <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                                  />
                                  <span>Present</span>
                                </label>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* CAR RENTAL PICKUPS & RETURNS SECTION */}
            {selectedDayData.fleetEvents.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                    <Car className="w-4 h-4 text-amber-600" />
                    Car Rental Pickups &amp; Returns ({selectedDayData.fleetEvents.length})
                  </h4>
                </div>

                <div className="space-y-2">
                  {selectedDayData.fleetEvents.map(ev => {
                    const isOut = ev.eventType === 'out';

                    return (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedBookingDetail(ev)}
                        className="p-3 rounded-xl bg-gray-50 hover:bg-slate-100 transition-all flex items-center justify-between gap-4 cursor-pointer border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isOut ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {isOut ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-xs text-gray-900">{ev.vehicleName}</p>
                              <span className="text-[10px] font-mono text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                                {ev.vehicleReg || 'MH 12'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {isOut ? 'Pickup' : 'Return'}: <strong className="text-gray-800">{ev.customerName}</strong> ({ev.customerPhone})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <p className="text-xs font-extrabold text-gray-900">₹{ev.totalAmount.toLocaleString('en-IN')}</p>
                            <Badge color={ev.status === 'Confirmed' ? 'green' : 'amber'}>{ev.status}</Badge>
                          </div>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedBookingDetail(ev);
                            }}
                            className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"
                            title="View Booking Details / Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state if nothing on that date */}
            {selectedDayData.packagesList.length === 0 && selectedDayData.fleetEvents.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-xs bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                No tour departures or vehicle handovers scheduled on this date.
              </div>
            )}

          </div>
        </Modal>
      )}

      {/* ─── SINGLE BOOKING DETAILS MODAL ─────────────────────────────────── */}
      {selectedBookingDetail && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBookingDetail(null)}
          title={`Booking Details – ${selectedBookingDetail.bookingCode}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                  {selectedBookingDetail.type === 'tour' ? 'Tour Package' : 'Car Rental'}
                </span>
                <Badge color={selectedBookingDetail.status === 'Confirmed' ? 'green' : 'amber'}>
                  {selectedBookingDetail.status}
                </Badge>
              </div>
              <h4 className="font-extrabold text-base text-gray-900">
                {selectedBookingDetail.type === 'tour' ? selectedBookingDetail.packageName : selectedBookingDetail.vehicleName}
              </h4>
              <p className="text-gray-500 font-mono font-bold">
                Ref: {selectedBookingDetail.bookingCode}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-gray-200">
              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px]">Customer Name</p>
                <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedBookingDetail.customerName}</p>
              </div>
              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px]">Phone Number</p>
                <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedBookingDetail.customerPhone}</p>
              </div>
              <div className="mt-2">
                <p className="text-gray-400 font-bold uppercase text-[10px]">Pickup / Departure</p>
                <p className="font-bold text-emerald-700 mt-0.5">{formatDate(selectedBookingDetail.departureDate)}</p>
              </div>
              <div className="mt-2">
                <p className="text-gray-400 font-bold uppercase text-[10px]">Return / Drop-off</p>
                <p className="font-bold text-red-700 mt-0.5">{formatDate(selectedBookingDetail.returnDate)}</p>
              </div>
              <div className="mt-2">
                <p className="text-gray-400 font-bold uppercase text-[10px]">Deposit Paid</p>
                <p className="font-bold text-gray-900 mt-0.5">₹{selectedBookingDetail.depositPaid.toLocaleString('en-IN')}</p>
              </div>
              <div className="mt-2">
                <p className="text-gray-400 font-bold uppercase text-[10px]">Total Amount</p>
                <p className="font-bold text-gray-900 mt-0.5">₹{selectedBookingDetail.totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setWhatsAppModalBooking({
                    bookingCode: selectedBookingDetail.bookingCode,
                    customerName: selectedBookingDetail.customerName,
                    customerPhone: selectedBookingDetail.customerPhone,
                    customerEmail: selectedBookingDetail.customerEmail,
                    vehicleName: selectedBookingDetail.vehicleName,
                    packageName: selectedBookingDetail.packageName,
                    pickupDate: selectedBookingDetail.departureDate,
                    dropoffDate: selectedBookingDetail.returnDate,
                    travelDate: selectedBookingDetail.departureDate,
                    totalAmount: selectedBookingDetail.totalAmount,
                    depositPaid: selectedBookingDetail.depositPaid,
                    status: selectedBookingDetail.status,
                    type: selectedBookingDetail.type === 'fleet' ? 'Fleet' : 'Tours',
                  });
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Message</span>
              </button>

              <button
                onClick={() => {
                  generateInvoicePDF({
                    invoiceNumber: `INV-${selectedBookingDetail.bookingCode}`,
                    invoiceDate: new Date().toISOString(),
                    bookingType: selectedBookingDetail.type === 'fleet' ? 'car' : 'tour',
                    bookingCode: selectedBookingDetail.bookingCode,
                    customerName: selectedBookingDetail.customerName,
                    customerPhone: selectedBookingDetail.customerPhone,
                    customerEmail: selectedBookingDetail.customerEmail || 'customer@aarambhatravels.in',
                    vehicleName: selectedBookingDetail.vehicleName,
                    carModel: selectedBookingDetail.vehicleName,
                    packageName: selectedBookingDetail.packageName,
                    rentalStartDate: selectedBookingDetail.departureDate,
                    rentalEndDate: selectedBookingDetail.returnDate,
                    departureDate: selectedBookingDetail.departureDate,
                    returnDate: selectedBookingDetail.returnDate,
                    numberOfTravelers: selectedBookingDetail.seats || selectedBookingDetail.paxCount || 1,
                    totalAmount: selectedBookingDetail.totalAmount,
                    depositPaid: selectedBookingDetail.depositPaid,
                    balanceAmount: Math.max(0, selectedBookingDetail.totalAmount - selectedBookingDetail.depositPaid),
                    paymentMode: 'Online Deposit (Razorpay / UPI)',
                    paymentStatus: selectedBookingDetail.status,
                  });
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#111827] text-white hover:bg-gray-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate Invoice</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* WhatsApp Interactive Dispatch & Reminder Modal */}
      <WhatsAppBookingModal
        isOpen={Boolean(whatsAppModalBooking)}
        onClose={() => setWhatsAppModalBooking(null)}
        booking={whatsAppModalBooking}
      />

    </div>
  );
}
