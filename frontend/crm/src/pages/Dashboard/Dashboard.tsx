import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarCheck, Compass, Car, Bus, Users,
  CheckCircle2, Clock, Pencil, RefreshCw, Search,
  ArrowRight, Sparkles, Plus, ChevronRight, MoreVertical,
  Activity, BarChart3, TrendingUp, ShieldCheck,
  Printer, Download, Eye, MapPin, Phone, User, CheckSquare, Square,
  FileText, ChevronDown, ChevronUp, AlertCircle, Filter, Check, MessageSquare
} from 'lucide-react';
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
import {
  exportMembersListPDF,
  exportMembersListExcel,
  openPrintMembersListView,
  ManifestPassenger,
  ManifestOptions,
} from '@/utils/exportManifest';

export default function DashboardView() {
  const navigate = useNavigate();
  const { activeVertical: vertical, user } = useAuth();
  const isViewer = user?.role === 'viewer';
  const [tours, setTours] = useState<any>({ bookings: [], inquiries: [], packages: [] });
  const [fleet, setFleet] = useState<any>({ bookings: [], inquiries: [], vehicles: [] });
  const [busRates, setBusRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  // Tabbed Section: 'trips' (Upcoming Trips & Manifest) | 'tours' (Tours Inventory) | 'fleet' (Buses & Cabs)
  const [inventoryTab, setInventoryTab] = useState<'trips' | 'tours' | 'fleet'>('trips');
  const [inventorySearch, setInventorySearch] = useState('');
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);
  const [inspectingTrip, setInspectingTrip] = useState<any | null>(null);

  // Travel Boarding Roll-Call Check-in state persisted in localStorage
  const [boardedMap, setBoardedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('aarambha_trip_boarded_manifest');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleBoarded = (passKey: string) => {
    setBoardedMap((prev) => {
      const next = { ...prev, [passKey]: !prev[passKey] };
      try {
        localStorage.setItem('aarambha_trip_boarded_manifest', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

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
              passengers: local.passengers || [],
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

  // Derive and Aggregate Upcoming Travel Trips with Full Passenger Manifests
  const upcomingTrips = useMemo(() => {
    const groups: Record<string, any> = {};

    // 1. Process all Tour Bookings and group by Package & Travel Date
    (tours.bookings || []).forEach((b: any) => {
      if (b.type && b.type !== 'Tours' && b.type !== 'tour') return;

      const pkgName = b.packageName || b.title || 'Sacred Pilgrimage Yatra';
      const rawDate = b.travelDate || b.startDate || b.departureDate || b.date;
      const dateKey = rawDate ? new Date(rawDate).toISOString().split('T')[0] : '2026-10-23';
      const key = `${pkgName}__${dateKey}`;

      if (!groups[key]) {
        const matchedPkg = (tours.packages || []).find(
          (p: any) => (p.title && p.title.toLowerCase() === pkgName.toLowerCase()) || p._id === b.packageId
        );
        const thumb = (Array.isArray(matchedPkg?.images) && matchedPkg?.images[0]) || matchedPkg?.image || '/images/tours_travels_bg.jpg';
        const durationStr = matchedPkg ? `${matchedPkg.durationDays || 3}D / ${matchedPkg.durationNights || 2}N` : '3D / 2N';

        groups[key] = {
          id: key,
          packageName: pkgName,
          subtitle: matchedPkg?.subtitle || matchedPkg?.destination || 'Sacred Pilgrimage Yatra',
          image: thumb,
          travelDate: dateKey,
          returnDate: b.endDate || b.returnDate || '',
          pickupLocation: b.pickupLocation || 'Katraj / Swargate Terminal, Pune',
          pickupTime: b.pickupTime || '06:00 AM',
          vehicleType: b.vehicleType || 'Force Urbania 17-Seater / BharatBenz AC Coach',
          tourLeader: 'Pravin / Aarambha Coordinator (+91 82082 11478)',
          duration: durationStr,
          bookings: [],
          passengers: [],
        };
      }

      groups[key].bookings.push(b);
    });

    // 2. Unpack individual passengers with Seat #, Name, Age, Gender, Phone, Booking Ref, and Check-in status
    Object.values(groups).forEach((trip: any) => {
      let seatCounter = 1;
      trip.bookings.forEach((b: any) => {
        const code = b.bookingCode || b.booking_code || b._id?.slice(-6).toUpperCase() || b.id?.slice(-6).toUpperCase() || '—';
        const leadName = b.customerName || b.fullName || 'Guest Yatri';
        const phone = b.customerPhone || b.phone || '—';
        const email = b.customerEmail || b.email || '';
        const pickup = b.pickupLocation || trip.pickupLocation;
        const deposit = b.depositPaid ?? 0;
        const total = b.totalAmount ?? 0;
        const status = b.status || 'Confirmed';

        if (b.passengers && Array.isArray(b.passengers) && b.passengers.length > 0) {
          b.passengers.forEach((p: any, idx: number) => {
            const passKey = `${trip.id}_${code}_${p.name || idx}`;
            trip.passengers.push({
              seatNo: p.seatNo || seatCounter++,
              name: p.name || (idx === 0 ? leadName : `${leadName} Co-Traveler`),
              age: p.age || '—',
              gender: p.gender || '—',
              isPrimary: idx === 0,
              phone: phone,
              email: email,
              bookingCode: code,
              bookingId: b._id || b.id,
              pickupPoint: pickup,
              depositPaid: deposit,
              totalAmount: total,
              status: status,
              boarded: !!boardedMap[passKey],
              passKey,
            });
          });
        } else {
          const count = b.paxCount || b.seats || b.seatCount || 1;
          for (let i = 0; i < count; i++) {
            const passKey = `${trip.id}_${code}_pax_${i}`;
            trip.passengers.push({
              seatNo: seatCounter++,
              name: i === 0 ? leadName : `${leadName} (Guest ${i + 1})`,
              age: i === 0 ? (b.age || '—') : '—',
              gender: i === 0 ? (b.gender || '—') : '—',
              isPrimary: i === 0,
              phone: phone,
              email: email,
              bookingCode: code,
              bookingId: b._id || b.id,
              pickupPoint: pickup,
              depositPaid: deposit,
              totalAmount: total,
              status: status,
              boarded: !!boardedMap[passKey],
              passKey,
            });
          }
        }
      });
    });

    // 3. Add scheduled upcoming batches from packages if not yet booked
    (tours.packages || []).forEach((pkg: any) => {
      const batches = Array.isArray(pkg.batchDates) ? pkg.batchDates : [];
      batches.forEach((b: any) => {
        const dateStr = b.date || b.startDate || (b.dates && b.dates[0]);
        if (!dateStr) return;
        const dateKey = new Date(dateStr).toISOString().split('T')[0];
        const key = `${pkg.title}__${dateKey}`;
        if (!groups[key]) {
          const thumb = (Array.isArray(pkg.images) && pkg.images[0]) || pkg.image || '/images/tours_travels_bg.jpg';
          groups[key] = {
            id: key,
            packageName: pkg.title,
            subtitle: pkg.subtitle || pkg.destination || 'Scheduled Departure',
            image: thumb,
            travelDate: dateKey,
            returnDate: '',
            pickupLocation: 'Katraj / Swargate Terminal, Pune',
            pickupTime: '06:00 AM',
            vehicleType: 'Force Urbania 17-Seater / BharatBenz AC Coach',
            tourLeader: 'Pravin / Aarambha Coordinator (+91 82082 11478)',
            duration: `${pkg.durationDays || 3}D / ${pkg.durationNights || 2}N`,
            bookings: [],
            passengers: [],
          };
        }
      });
    });

    return Object.values(groups).sort((a: any, b: any) => {
      return new Date(a.travelDate).getTime() - new Date(b.travelDate).getTime();
    });
  }, [tours.bookings, tours.packages, boardedMap]);

  // Set default expanded trip
  useEffect(() => {
    if (!expandedTripId && upcomingTrips.length > 0) {
      const withPax = upcomingTrips.find((t: any) => t.passengers.length > 0);
      setExpandedTripId(withPax ? withPax.id : upcomingTrips[0].id);
    }
  }, [upcomingTrips, expandedTripId]);

  // Direct Print PDF Manifest Handler
  const handlePrintTrip = (trip: any) => {
    openPrintMembersListView({
      packageName: trip.packageName,
      departureDate: trip.travelDate,
      returnDate: trip.returnDate,
      pickupLocation: trip.pickupLocation,
      pickupTime: trip.pickupTime,
      vehicleType: trip.vehicleType,
      tourLeader: trip.tourLeader,
      passengers: trip.passengers,
    });
  };

  // Direct Download PDF Manifest Handler
  const handleDownloadPDF = (trip: any) => {
    exportMembersListPDF({
      packageName: trip.packageName,
      departureDate: trip.travelDate,
      returnDate: trip.returnDate,
      pickupLocation: trip.pickupLocation,
      pickupTime: trip.pickupTime,
      vehicleType: trip.vehicleType,
      tourLeader: trip.tourLeader,
      passengers: trip.passengers,
    });
  };

  // Direct Export Excel Manifest Handler
  const handleExportExcel = (trip: any) => {
    exportMembersListExcel({
      packageName: trip.packageName,
      departureDate: trip.travelDate,
      returnDate: trip.returnDate,
      pickupLocation: trip.pickupLocation,
      passengers: trip.passengers,
    });
  };

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

  // Filtered Upcoming Trips based on search query
  const filteredTrips = upcomingTrips.filter((t: any) => {
    if (!inventorySearch) return true;
    const q = inventorySearch.toLowerCase();
    const pkgMatch = (t.packageName || '').toLowerCase().includes(q);
    const dateMatch = (t.travelDate || '').toLowerCase().includes(q);
    const passMatch = t.passengers.some((p: any) =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.phone || '').includes(q) ||
      (p.bookingCode || '').toLowerCase().includes(q)
    );
    return pkgMatch || dateMatch || passMatch;
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
    <div className="space-y-6 sm:space-y-7 pb-10 select-none">

      {/* ─── 1. PANORAMIC TRAVEL HERO BANNER ─── */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm border border-[#E8ECF4] bg-[#101F40] min-h-[175px] sm:min-h-[200px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101F40]/90 via-[#101F40]/60 to-[#101F40]/20 sm:to-transparent" />

        <div className="absolute top-4 sm:top-6 right-1/4 sm:right-1/3 opacity-80 pointer-events-none transform -rotate-12">
          <svg className="w-12 h-12 text-white/40 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>

        <div className="relative z-10 px-5 sm:px-8 py-5 sm:py-7 flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest text-[#60A5FA] uppercase">
                Aarambha Control Deck
              </span>
              <span className="w-8 h-[1px] bg-[#60A5FA]/60" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Admin & Operations Dashboard
            </h1>
            <p className="text-white/80 text-xs sm:text-sm font-normal leading-relaxed">
              Upcoming travel departure charts, conductor passenger manifests, and instant A4 roll-call printing.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setInventoryTab('trips')}
                className="px-4 py-2 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Upcoming Trips & Manifest</span>
              </button>
              <button
                onClick={() => navigate('/bookings')}
                className="px-4 py-2 rounded-xl bg-[#101F40] hover:bg-[#1C315A] text-white text-xs font-semibold border border-white/20 shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>All Bookings ({allBookings.length})</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#3569F6]" />
              </button>
            </div>
          </div>

          <div className="hidden lg:block text-right pr-6">
            <p className="font-serif italic text-white/90 text-2xl tracking-wide drop-shadow-sm">
              Sacred Journeys
            </p>
            <p className="font-serif italic text-white/80 text-xl tracking-wider drop-shadow-sm -mt-1">
              Flawless Check-in
            </p>
          </div>
        </div>
      </div>

      {/* ─── 2. FOUR KPI CARDS ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <KPICard
          label="Upcoming Trips"
          value={String(upcomingTrips.length)}
          trend="Live Batches"
          trendLabel="scheduled"
          trendType="up"
          icon={<Compass className="w-5 h-5 text-[#EF4444]" />}
          variant="amber"
          onClick={() => setInventoryTab('trips')}
        />
        <KPICard
          label="Total Bookings"
          value={String(allBookings.length)}
          trend="+12%"
          trendLabel="vs last week"
          trendType="up"
          icon={<CalendarCheck className="w-5 h-5" />}
          variant="blue"
          onClick={() => navigate('/bookings')}
        />
        <KPICard
          label="Customer Inquiries"
          value={String(allInquiries.length)}
          trend="0%"
          trendLabel="vs last week"
          trendType="neutral"
          icon={<Users className="w-5 h-5" />}
          variant="amber"
          onClick={() => navigate('/customers')}
        />
        <KPICard
          label="Buses & Cabs"
          value={String(busRates.length)}
          trend="+5%"
          trendLabel="active fleet"
          trendType="up"
          icon={<Bus className="w-5 h-5" />}
          variant="purple"
          onClick={() => navigate('/fleet')}
        />
      </div>

      {/* ─── 3. MIDDLE SECTION: TABS SWITCHER + CONTENT (LEFT) + QUICK ACTIONS (RIGHT) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* Left Column (8 cols): Dynamic Tab Area */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E8ECF4] p-4 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          
          {/* Card Header & Tab Capsules */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F5F7FC]">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#EDF3FF] text-[#3569F6] flex items-center justify-center">
                  {inventoryTab === 'trips' ? <Compass className="w-3.5 h-3.5 text-[#EF4444]" /> : <BarChart3 className="w-3.5 h-3.5" />}
                </div>
                <h3 className="font-extrabold text-[#17233D] text-base sm:text-lg tracking-tight">
                  {inventoryTab === 'trips' ? 'Upcoming Travel Trips & Manifest' : 'Website Inventory & Rates'}
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#12A879] bg-[#E7F7F2] border border-[#BDEBDC]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#12A879]" />
                  Live Operational
                </span>
              </div>
              <p className="text-xs text-[#77839A] mt-1 font-normal">
                {inventoryTab === 'trips'
                  ? 'Track passengers, check attendance, and directly print A4 passenger manifests for on-bus roll calls.'
                  : 'Directly view and adjust prices for tour packages, Pune–Mumbai cabs, and outstation bus rate cards.'}
              </p>
            </div>

            {/* Tab Capsules */}
            <div className="flex items-center gap-1.5 bg-[#F5F7FC] p-1 rounded-full border border-[#E8ECF4] self-start sm:self-auto shrink-0 overflow-x-auto">
              <button
                onClick={() => setInventoryTab('trips')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  inventoryTab === 'trips'
                    ? 'bg-[#101F40] text-white shadow-xs'
                    : 'text-[#77839A] hover:text-[#17233D]'
                }`}
              >
                <Compass className="w-3 h-3 text-[#EF4444]" />
                <span>Upcoming Trips ({upcomingTrips.length})</span>
              </button>
              <button
                onClick={() => setInventoryTab('tours')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  inventoryTab === 'tours'
                    ? 'bg-[#101F40] text-white shadow-xs'
                    : 'text-[#77839A] hover:text-[#17233D]'
                }`}
              >
                Tours ({tours.packages?.length || 6})
              </button>
              <button
                onClick={() => setInventoryTab('fleet')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  inventoryTab === 'fleet'
                    ? 'bg-[#101F40] text-white shadow-xs'
                    : 'text-[#77839A] hover:text-[#17233D]'
                }`}
              >
                Buses & Cabs ({busRates.length || 40})
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-[#77839A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              placeholder={
                inventoryTab === 'trips'
                  ? 'Search trips by yatri name, tour package, phone number, or date...'
                  : inventoryTab === 'tours'
                  ? 'Search tour packages...'
                  : 'Search bus rates, routes, seats...'
              }
              className="w-full bg-[#F5F7FC] border border-[#E8ECF4] rounded-xl pl-9 pr-4 py-2 text-xs text-[#17233D] placeholder-[#77839A] focus:outline-none focus:bg-white focus:border-[#3569F6] focus:ring-2 focus:ring-[#3569F6]/10 transition-all"
            />
          </div>

          {/* ──────────────── TAB 1: UPCOMING TRIPS & PASSENGER MANIFEST ──────────────── */}
          {inventoryTab === 'trips' && (
            <div className="space-y-4">
              {/* Summary Pill Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E8ECF4] text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#17233D] flex items-center gap-1.5">
                    <CalendarCheck className="w-3.5 h-3.5 text-[#3569F6]" />
                    <span>{filteredTrips.length} Upcoming Departure Batches</span>
                  </span>
                  <span className="text-[#E8ECF4]">|</span>
                  <span className="text-[#77839A]">
                    Total Confirmed Yatris: <strong className="text-[#EF4444] font-extrabold">{filteredTrips.reduce((acc: number, t: any) => acc + t.passengers.length, 0)}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                  <span className="w-2 h-2 rounded-full bg-[#12A879] animate-pulse" />
                  <span>Conductor Print Ready</span>
                </div>
              </div>

              {/* List of Trip Cards */}
              <div className="space-y-4">
                {filteredTrips.map((trip: any) => {
                  const isExpanded = expandedTripId === trip.id;
                  const totalPax = trip.passengers.length;
                  const boardedCount = trip.passengers.filter((p: any) => p.boarded).length;

                  return (
                    <div
                      key={trip.id}
                      className="bg-white rounded-xl border border-[#E8ECF4] shadow-xs overflow-hidden transition-all hover:border-[#CBD5E1]"
                    >
                      {/* Trip Card Header Banner */}
                      <div className="p-3.5 sm:p-4 bg-[#F8FAFC]/60 border-b border-[#E8ECF4] flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <img
                            src={trip.image}
                            alt={trip.packageName}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[#E8ECF4] shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).setAttribute('src', '/images/tours_travels_bg.jpg');
                            }}
                          />
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold text-[#EF4444] bg-[#FEE2E2] uppercase">
                                Yatra Departure
                              </span>
                              <span className="text-xs font-bold text-[#17233D]">
                                {formatDate(trip.travelDate)}
                              </span>
                              <span className="text-[10px] text-[#77839A] font-semibold">
                                ({trip.duration})
                              </span>
                            </div>
                            <h4 className="font-extrabold text-[#17233D] text-sm sm:text-base leading-snug">
                              {trip.packageName}
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#64748B]">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#3569F6]" />
                                <span>{trip.pickupLocation} ({trip.pickupTime})</span>
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Bus className="w-3 h-3 text-[#9560EF]" />
                                <span>{trip.vehicleType}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Quick Actions */}
                        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
                          {/* Yatris Count Tag */}
                          <div className="px-2.5 py-1 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-center">
                            <p className="text-[10px] text-[#1D4ED8] font-bold uppercase">Confirmed Yatris</p>
                            <p className="text-xs font-extrabold text-[#1D4ED8]">
                              {totalPax} Seats
                              {totalPax > 0 && <span className="ml-1 text-[10px] text-[#12A879]">({boardedCount} Boarded)</span>}
                            </p>
                          </div>

                          {/* 🖨️ DIRECT PRINT PDF MANIFEST */}
                          <button
                            onClick={() => handlePrintTrip(trip)}
                            title="Direct Print A4 Conductor Passenger Manifest"
                            className="px-3 py-1.5 rounded-lg bg-[#101F40] hover:bg-[#1C315A] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#60A5FA]" />
                            <span>Print PDF</span>
                          </button>

                          {/* 📥 DOWNLOAD PDF */}
                          <button
                            onClick={() => handleDownloadPDF(trip)}
                            title="Download PDF File"
                            className="p-1.5 rounded-lg bg-white hover:bg-[#F5F7FC] border border-[#E8ECF4] text-[#17233D] text-xs transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-[#77839A]" />
                          </button>

                          {/* 📊 EXPORT CSV */}
                          <button
                            onClick={() => handleExportExcel(trip)}
                            title="Export to Excel / CSV"
                            className="p-1.5 rounded-lg bg-white hover:bg-[#F5F7FC] border border-[#E8ECF4] text-[#17233D] text-xs transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#77839A]" />
                          </button>

                          {/* TOGGLE EXPAND PASSENGERS */}
                          <button
                            onClick={() => setExpandedTripId(isExpanded ? null : trip.id)}
                            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              isExpanded
                                ? 'bg-[#EDF3FF] border-[#BFDBFE] text-[#3569F6]'
                                : 'bg-white border-[#E8ECF4] text-[#77839A] hover:text-[#17233D]'
                            }`}
                          >
                            <span>Passengers ({totalPax})</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Passenger Manifest Table */}
                      {isExpanded && (
                        <div className="p-3.5 sm:p-4 bg-white">
                          {totalPax === 0 ? (
                            <div className="py-6 text-center text-[#77839A] text-xs space-y-2">
                              <p>No passengers booked yet for this upcoming batch departure.</p>
                              <button
                                onClick={() => navigate('/bookings')}
                                className="px-3 py-1.5 rounded-lg bg-[#101F40] text-white font-bold text-xs hover:bg-[#1C315A] transition-all cursor-pointer inline-flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Offline Booking</span>
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {/* Header & Roll-call Status */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pb-2 border-b border-[#F5F7FC]">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-[#17233D]">Official Conductor Manifest:</span>
                                  <span className="text-[#77839A]">{totalPax} travelers assigned to this departure.</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] text-[#77839A]">Attendance:</span>
                                  <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-[#E7F7F2] text-[#12A879] border border-[#BDEBDC]">
                                    {boardedCount} / {totalPax} Boarded
                                  </span>
                                </div>
                              </div>

                              {/* 💻 DESKTOP TABLE VIEW (>= 768px) */}
                              <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left text-xs border border-[#E8ECF4] rounded-lg">
                                  <thead>
                                    <tr className="bg-[#101F40] text-white text-[10px] uppercase font-bold tracking-wider">
                                      <th className="py-2.5 px-3 text-center w-12">Seat</th>
                                      <th className="py-2.5 px-3">Passenger Full Name</th>
                                      <th className="py-2.5 px-3 text-center">Age / Sex</th>
                                      <th className="py-2.5 px-3 text-center">Primary Phone</th>
                                      <th className="py-2.5 px-3 text-center">Booking Ref</th>
                                      <th className="py-2.5 px-3">Pickup Point</th>
                                      <th className="py-2.5 px-3 text-center">Payment Status</th>
                                      <th className="py-2.5 px-3 text-center w-28">Boarding Check</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[#E8ECF4]">
                                    {trip.passengers.map((p: any, idx: number) => {
                                      const ageSex = [
                                        p.age && p.age !== '—' ? `${p.age}y` : '',
                                        p.gender && p.gender !== '—' ? p.gender : ''
                                      ].filter(Boolean).join(' • ') || '—';

                                      return (
                                        <tr
                                          key={`${trip.id}_pax_${idx}`}
                                          className={`hover:bg-[#F8FAFC] transition-colors ${p.boarded ? 'bg-[#F0FDF4]/50' : ''}`}
                                        >
                                          <td className="py-2.5 px-3 text-center">
                                            <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-[#EDF3FF] text-[#1D4ED8] border border-[#BFDBFE]">
                                              #{p.seatNo}
                                            </span>
                                          </td>
                                          <td className="py-2.5 px-3">
                                            <div className="font-bold text-[#17233D] flex items-center gap-1.5">
                                              <span>{p.name}</span>
                                              {p.isPrimary && (
                                                <span className="text-[9px] bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.2 rounded font-extrabold uppercase">
                                                  Primary
                                                </span>
                                              )}
                                            </div>
                                          </td>
                                          <td className="py-2.5 px-3 text-center text-[#77839A] font-medium">
                                            {ageSex}
                                          </td>
                                          <td className="py-2.5 px-3 text-center">
                                            <div className="flex items-center justify-center gap-1 font-semibold text-[#17233D]">
                                              <a href={`tel:${p.phone}`} className="hover:text-[#3569F6] transition-colors">
                                                {p.phone || '—'}
                                              </a>
                                              {p.phone && p.phone !== '—' && (
                                                <a
                                                  href={`https://wa.me/91${p.phone.replace(/[^0-9]/g, '')}`}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  title="WhatsApp Traveler"
                                                  className="text-[#12A879] hover:opacity-80 ml-0.5"
                                                >
                                                  <MessageSquare className="w-3 h-3" />
                                                </a>
                                              )}
                                            </div>
                                          </td>
                                          <td className="py-2.5 px-3 text-center font-mono font-bold text-[11px] text-[#3569F6]">
                                            {p.bookingCode}
                                          </td>
                                          <td className="py-2.5 px-3 text-[#77839A]">
                                            {p.pickupPoint}
                                          </td>
                                          <td className="py-2.5 px-3 text-center">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#E7F7F2] text-[#12A879] border border-[#BDEBDC]">
                                              {p.depositPaid ? `Adv: ₹${p.depositPaid}` : (p.status || 'Confirmed')}
                                            </span>
                                          </td>
                                          <td className="py-2.5 px-3 text-center">
                                            <button
                                              type="button"
                                              onClick={() => toggleBoarded(p.passKey)}
                                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                                p.boarded
                                                  ? 'bg-[#12A879] text-white shadow-xs'
                                                  : 'bg-[#F5F7FC] border border-[#E8ECF4] text-[#77839A] hover:bg-[#EDF3FF] hover:text-[#3569F6]'
                                              }`}
                                            >
                                              {p.boarded ? (
                                                <>
                                                  <Check className="w-3.5 h-3.5" />
                                                  <span>Boarded</span>
                                                </>
                                              ) : (
                                                <>
                                                  <Square className="w-3.5 h-3.5" />
                                                  <span>Check In</span>
                                                </>
                                              )}
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>

                              {/* 📱 MOBILE PASSENGER CARDS VIEW (< 768px) */}
                              <div className="md:hidden space-y-2.5">
                                {trip.passengers.map((p: any, idx: number) => {
                                  const ageSex = [
                                    p.age && p.age !== '—' ? `${p.age}y` : '',
                                    p.gender && p.gender !== '—' ? p.gender : ''
                                  ].filter(Boolean).join(' • ') || '—';

                                  return (
                                    <div
                                      key={`${trip.id}_pax_m_${idx}`}
                                      className={`p-3 rounded-xl border transition-all space-y-2 ${
                                        p.boarded
                                          ? 'bg-[#F0FDF4] border-[#86EFAC]'
                                          : 'bg-white border-[#E8ECF4] shadow-2xs'
                                      }`}
                                    >
                                      {/* Top Row: Seat & Name & Boarding Button */}
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-[#EDF3FF] text-[#1D4ED8] border border-[#BFDBFE] shrink-0">
                                            #{p.seatNo}
                                          </span>
                                          <span className="font-bold text-xs text-[#17233D] truncate">
                                            {p.name}
                                          </span>
                                          {p.isPrimary && (
                                            <span className="text-[9px] bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0">
                                              Primary
                                            </span>
                                          )}
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => toggleBoarded(p.passKey)}
                                          className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer touch-manipulation active:scale-95 ${
                                            p.boarded
                                              ? 'bg-[#12A879] text-white shadow-xs'
                                              : 'bg-[#F5F7FC] border border-[#CBD5E1] text-[#17233D] hover:bg-[#EDF3FF]'
                                          }`}
                                        >
                                          {p.boarded ? (
                                            <>
                                              <Check className="w-3.5 h-3.5" />
                                              <span>Boarded</span>
                                            </>
                                          ) : (
                                            <>
                                              <Square className="w-3.5 h-3.5" />
                                              <span>Check In</span>
                                            </>
                                          )}
                                        </button>
                                      </div>

                                      {/* Middle Row: Age/Gender + Phone + Ref */}
                                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B] pt-0.5">
                                        <div className="flex items-center gap-2">
                                          <span>{ageSex}</span>
                                          <span>•</span>
                                          <a href={`tel:${p.phone}`} className="font-semibold text-[#17233D] hover:text-[#3569F6]">
                                            {p.phone || '—'}
                                          </a>
                                          {p.phone && p.phone !== '—' && (
                                            <a
                                              href={`https://wa.me/91${p.phone.replace(/[^0-9]/g, '')}`}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="text-[#12A879]"
                                            >
                                              <MessageSquare className="w-3.5 h-3.5" />
                                            </a>
                                          )}
                                        </div>

                                        <span className="font-mono font-bold text-[10px] text-[#3569F6]">
                                          {p.bookingCode}
                                        </span>
                                      </div>

                                      {/* Bottom Row: Pickup point + Adv deposit badge */}
                                      <div className="flex items-center justify-between gap-2 text-[10px] text-[#77839A] pt-1 border-t border-gray-100">
                                        <span className="truncate flex items-center gap-1">
                                          <MapPin className="w-3 h-3 text-[#3569F6] shrink-0" />
                                          {p.pickupPoint || 'Main Boarding Point'}
                                        </span>
                                        <span className="font-bold text-[#12A879] shrink-0">
                                          {p.depositPaid ? `Adv: ₹${p.depositPaid}` : (p.status || 'Confirmed')}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Footer Checklist & Print Button */}
                              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-[#F8FAFC] p-3 rounded-xl border border-[#E8ECF4]">
                                <div className="text-[#64748B] flex items-center gap-2">
                                  <ShieldCheck className="w-4 h-4 text-[#12A879] shrink-0" />
                                  <span>
                                    <strong>Conductor Roll-Call Protocol:</strong> Verify government photo ID for each passenger prior to boarding.
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => handlePrintTrip(trip)}
                                    className="px-3.5 py-1.5 rounded-lg bg-[#101F40] hover:bg-[#1C315A] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                                  >
                                    <Printer className="w-3.5 h-3.5 text-[#60A5FA]" />
                                    <span>Direct Print Manifest (PDF)</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredTrips.length === 0 && (
                  <div className="py-12 text-center text-[#77839A] text-xs bg-[#F8FAFC] rounded-xl border border-[#E8ECF4]">
                    <Compass className="w-8 h-8 text-[#94A3B8] mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-[#17233D]">No upcoming trips found</p>
                    <p className="text-[11px] text-[#77839A] mt-1">Try searching for a different yatri name, tour date, or package title.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ──────────────── TAB 2: TOURS PACKAGES INVENTORY ──────────────── */}
          {inventoryTab === 'tours' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8ECF4] text-[10px] uppercase font-bold text-[#77839A] tracking-wider">
                    <th className="pb-2 px-2">Tour Package Title</th>
                    <th className="pb-2 px-3 text-center">Duration</th>
                    <th className="pb-2 px-3 text-right">Base Price</th>
                    <th className="pb-2 px-3 text-right">Deposit Price</th>
                    <th className="pb-2 px-3 text-center">Departure Batches</th>
                    <th className="pb-2 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F7FC]">
                  {filteredTours.slice(0, 8).map((pkg: any) => {
                    const batchCount = Array.isArray(pkg.batchDates) ? pkg.batchDates.length : (pkg.batches?.length || 0);
                    const thumb = (Array.isArray(pkg.images) && pkg.images[0]) || pkg.image || '/images/tours_travels_bg.jpg';
                    const durationStr = `${pkg.durationDays || 3}D / ${pkg.durationNights || 2}N`;

                    return (
                      <tr key={pkg._id || pkg.id} className="hover:bg-[#F5F7FC]/70 transition-colors group">
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={thumb}
                              alt={pkg.title}
                              className="w-12 h-9 rounded-lg object-cover border border-[#E8ECF4] shrink-0"
                              onError={(e) => {
                                (e.target as HTMLElement).setAttribute('src', '/images/tours_travels_bg.jpg');
                              }}
                            />
                            <div className="max-w-[200px] sm:max-w-[280px]">
                              <p className="font-bold text-[#17233D] text-xs truncate group-hover:text-[#3569F6] transition-colors">
                                {pkg.title}
                              </p>
                              <p className="text-[10px] text-[#77839A] truncate">
                                {pkg.subtitle || pkg.destination || 'Pilgrimage Darshan'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#17233D] bg-[#F5F7FC] border border-[#E8ECF4]">
                            {durationStr}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#17233D]">
                          ₹{(pkg.basePrice || 5999).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right text-[#77839A] font-medium">
                          ₹{(pkg.depositPrice || 1999).toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold text-[#12A879] bg-[#E7F7F2] border border-[#BDEBDC]">
                            {batchCount > 0 ? `${batchCount} Available` : 'Available'}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => navigate('/tours')}
                              title="Edit Tour Package"
                              className="p-1.5 rounded-lg text-[#77839A] hover:text-[#3569F6] hover:bg-[#EDF3FF] transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => navigate('/tours')}
                              title="View Details"
                              className="p-1.5 rounded-lg text-[#77839A] hover:text-[#17233D] hover:bg-[#F5F7FC] transition-colors"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTours.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#77839A] text-xs">
                        No tour packages matching "{inventorySearch}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ──────────────── TAB 3: BUSES & CABS INVENTORY ──────────────── */}
          {inventoryTab === 'fleet' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8ECF4] text-[10px] uppercase font-bold text-[#77839A] tracking-wider">
                    <th className="pb-2 px-2">Vehicle / Coach</th>
                    <th className="pb-2 px-3 text-center">Capacity</th>
                    <th className="pb-2 px-3 text-right">Pune–Mumbai Rate</th>
                    <th className="pb-2 px-3 text-right">Mahabaleshwar</th>
                    <th className="pb-2 px-3 text-center">Status</th>
                    <th className="pb-2 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F7FC]">
                  {filteredBusRates.slice(0, 8).map((b: any) => (
                    <tr key={b._id} className="hover:bg-[#F5F7FC]/70 transition-colors group">
                      <td className="py-2.5 px-2">
                        <p className="font-bold text-[#17233D] text-xs group-hover:text-[#3569F6] transition-colors">
                          {b.busType}
                        </p>
                        <p className="text-[10px] text-[#77839A] capitalize">
                          {b.category?.replace(/_/g, ' ') || 'Outstation AC'}
                        </p>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-[#17233D] bg-[#F5F7FC] border border-[#E8ECF4]">
                          {b.seats ? `${b.seats} Seats` : 'AC Coach'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#17233D]">
                        ₹{(b.packageRate || b.mumbaiRate || 10500).toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right text-[#77839A] font-medium">
                        ₹{(b.mahabaleshwarRate || 9500).toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold text-[#12A879] bg-[#E7F7F2] border border-[#BDEBDC]">
                          Active
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <button
                          onClick={() => handleOpenQuickEdit(b)}
                          title="Quick Edit Rate"
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#3569F6] bg-[#EDF3FF] hover:bg-[#3569F6] hover:text-white transition-all"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredBusRates.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#77839A] text-xs">
                        No fleet rates matching "{inventorySearch}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Right Column (4 cols): Quick Actions & Operations Checklist */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E8ECF4] p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-[#F5F7FC]">
              <span className="text-base font-bold text-[#17233D] flex items-center gap-1.5">
                <span>⚡</span> Quick Actions
              </span>
            </div>

            <div className="space-y-2.5 mt-3.5">
              <button
                onClick={() => setInventoryTab('trips')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#101F40] hover:bg-[#1C315A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <Compass className="w-4 h-4 text-[#EF4444]" />
                <span>Upcoming Passenger Manifests</span>
              </button>

              <button
                onClick={() => navigate('/bookings')}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F5F7FC] border border-[#E8ECF4] text-[#17233D] font-semibold text-xs flex items-center gap-2.5 transition-all cursor-pointer group"
              >
                <CalendarCheck className="w-4 h-4 text-[#77839A] group-hover:text-[#3569F6] transition-colors" />
                <span>View All Bookings ({allBookings.length})</span>
              </button>

              <button
                onClick={() => navigate('/tours')}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F5F7FC] border border-[#E8ECF4] text-[#17233D] font-semibold text-xs flex items-center gap-2.5 transition-all cursor-pointer group"
              >
                <Plus className="w-4 h-4 text-[#77839A] group-hover:text-[#3569F6] transition-colors" />
                <span>Add / Manage Tour Package</span>
              </button>

              <button
                onClick={() => navigate('/fleet')}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F5F7FC] border border-[#E8ECF4] text-[#17233D] font-semibold text-xs flex items-center gap-2.5 transition-all cursor-pointer group"
              >
                <Car className="w-4 h-4 text-[#77839A] group-hover:text-[#3569F6] transition-colors" />
                <span>Manage Fleet & Cabs</span>
              </button>

              <button
                onClick={() => navigate('/customers')}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F5F7FC] border border-[#E8ECF4] text-[#17233D] font-semibold text-xs flex items-center gap-2.5 transition-all cursor-pointer group"
              >
                <Users className="w-4 h-4 text-[#77839A] group-hover:text-[#3569F6] transition-colors" />
                <span>Check Customer Inquiries</span>
              </button>
            </div>
          </div>

          {/* Quick System Health Pill */}
          <div className="bg-[#F5F7FC] border border-[#E8ECF4] rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#12A879]" />
              <span className="font-semibold text-[#17233D] text-[11px]">Database Active</span>
            </div>
            <span className="text-[10px] text-[#77839A]">All Systems Operational</span>
          </div>

        </div>

      </div>

      {/* ─── 4. BOTTOM ROW: RECENT ACTIVITY + BOOKINGS OVERVIEW + PROMO BANNER ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Card 1: Recent Activity */}
        <div className="bg-white rounded-2xl border border-[#E8ECF4] p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#F5F7FC]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#3569F6]" />
              <h4 className="font-bold text-[#17233D] text-sm">Recent Activity</h4>
            </div>
            <Link to="/bookings" className="text-[11px] font-bold text-[#3569F6] hover:text-[#2554DB] flex items-center gap-0.5">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#E7F7F2] text-[#12A879] flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#17233D] text-xs truncate">New Booking Received</p>
                  <p className="text-[11px] text-[#77839A] truncate">Sanwaliya Seth &amp; Ujjain Mahakal</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] text-[#77839A]">Live</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#12A879]" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#EDF3FF] text-[#3569F6] flex items-center justify-center shrink-0">
                  <Car className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#17233D] text-xs truncate">Fleet Ready</p>
                  <p className="text-[11px] text-[#77839A] truncate">Force Urbania &amp; Coaches</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] text-[#77839A]">Active</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3569F6]" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#F4EEFD] text-[#9560EF] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#17233D] text-xs truncate">Yatri Manifest Ready</p>
                  <p className="text-[11px] text-[#77839A] truncate">Direct A4 PDF Roll-Call</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] text-[#77839A]">Ready</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#9560EF]" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Bookings Overview Spline Chart */}
        <div className="bg-white rounded-2xl border border-[#E8ECF4] p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#F5F7FC]">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#3569F6]" />
              <h4 className="font-bold text-[#17233D] text-sm">Bookings Overview</h4>
            </div>
            <span className="text-[11px] font-semibold text-[#77839A] bg-[#F5F7FC] px-2 py-0.5 rounded-md border border-[#E8ECF4]">
              This Month ▾
            </span>
          </div>

          <div className="relative pt-2">
            <div className="absolute top-0 right-1/4 -translate-y-2 bg-[#101F40] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
              <span>{allBookings.length} Bookings</span>
            </div>

            <svg viewBox="0 0 280 110" className="w-full h-24 overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3569F6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3569F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="20" x2="280" y2="20" stroke="#F0F4F8" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="280" y2="50" stroke="#F0F4F8" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="280" y2="80" stroke="#F0F4F8" strokeDasharray="3 3" />

              <path
                d="M 10 90 Q 70 75, 120 40 T 210 20 T 270 50 L 270 100 L 10 100 Z"
                fill="url(#chartGradient)"
              />
              <path
                d="M 10 90 Q 70 75, 120 40 T 210 20 T 270 50"
                fill="none"
                stroke="#3569F6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="10" cy="90" r="3.5" fill="#FFFFFF" stroke="#3569F6" strokeWidth="2" />
              <circle cx="120" cy="40" r="3.5" fill="#FFFFFF" stroke="#3569F6" strokeWidth="2" />
              <circle cx="210" cy="20" r="4" fill="#3569F6" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="270" cy="50" r="3.5" fill="#FFFFFF" stroke="#3569F6" strokeWidth="2" />
            </svg>

            <div className="flex justify-between text-[10px] font-semibold text-[#77839A] mt-1.5 px-1">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>

        {/* Card 3: Scenic Travel Promo Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-[#E8ECF4] shadow-xs p-5 bg-[#101F40] flex flex-col justify-between min-h-[160px] group">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101F40] via-[#101F40]/70 to-[#101F40]/30" />

          <div className="relative z-10 space-y-1">
            <h4 className="text-white font-extrabold text-base tracking-tight leading-snug">
              Conductor Ready
            </h4>
            <p className="text-white/80 text-xs font-normal">
              1-Click Manifest Printing for Coaches &amp; Buses.
            </p>
          </div>

          <div className="relative z-10 pt-4">
            <button
              onClick={() => setInventoryTab('trips')}
              className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>View Manifests</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#3569F6]" />
            </button>
          </div>
        </div>

      </div>

      {/* ─── DASHBOARD QUICK EDIT RATE MODAL ─── */}
      {editingBus && (
        <Modal
          isOpen={!!editingBus}
          onClose={() => setEditingBus(null)}
          title={`Quick Edit Rate: ${editingBus.busType}`}
        >
          <form onSubmit={handleSaveQuickEdit} className="space-y-4 text-xs text-[#17233D]">
            <div>
              <label className="font-bold text-[#17233D] block mb-1">Bus / Vehicle Title</label>
              <input
                type="text"
                required
                value={busForm.busType}
                onChange={e => setBusForm({ ...busForm, busType: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#E8ECF4] bg-[#F5F7FC] focus:bg-white focus:ring-2 focus:ring-[#3569F6]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#17233D] block mb-1">Pune–Mumbai Rate (₹)</label>
                <input
                  type="number"
                  value={busForm.packageRate || busForm.mumbaiRate}
                  onChange={e => setBusForm({ ...busForm, packageRate: Number(e.target.value), mumbaiRate: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-[#E8ECF4] font-bold text-[#17233D] text-base sm:text-xs bg-white focus:outline-none focus:border-[#3569F6]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#17233D] block mb-1">Mahabaleshwar Rate (₹)</label>
                <input
                  type="number"
                  value={busForm.mahabaleshwarRate}
                  onChange={e => setBusForm({ ...busForm, mahabaleshwarRate: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-[#E8ECF4] font-bold text-[#17233D] text-base sm:text-xs bg-white focus:outline-none focus:border-[#3569F6]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-medium text-[#77839A] block mb-1">Local Base Rate (₹)</label>
                <input
                  type="number"
                  value={busForm.baseRate}
                  onChange={e => setBusForm({ ...busForm, baseRate: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-[#E8ECF4] text-base sm:text-xs bg-white focus:outline-none focus:border-[#3569F6]"
                />
              </div>
              <div>
                <label className="font-medium text-[#77839A] block mb-1">Extra KM Rate (₹)</label>
                <input
                  type="number"
                  value={busForm.extraKmRate}
                  onChange={e => setBusForm({ ...busForm, extraKmRate: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-[#E8ECF4] text-base sm:text-xs bg-white focus:outline-none focus:border-[#3569F6]"
                />
              </div>
              <div>
                <label className="font-medium text-[#77839A] block mb-1">Extra Hour Rate (₹)</label>
                <input
                  type="number"
                  value={busForm.extraHourRate}
                  onChange={e => setBusForm({ ...busForm, extraHourRate: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-[#E8ECF4] text-base sm:text-xs bg-white focus:outline-none focus:border-[#3569F6]"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingBus(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#E8ECF4] text-[#77839A] font-semibold hover:bg-[#F5F7FC] min-h-[44px] cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#101F40] hover:bg-[#1C315A] text-white font-bold shadow-xs min-h-[44px] cursor-pointer text-xs"
              >
                Update Price &amp; Save Live
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
