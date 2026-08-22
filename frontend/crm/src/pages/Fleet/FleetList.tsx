import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Pencil, Trash2, Car, Bus, Users, Search, CheckCircle, AlertTriangle, ShieldCheck, Tag, Sparkles, Layers, Check, X } from 'lucide-react';
import { getFleetVehicles, getFleetCategories, createVehicle, updateVehicle, deleteVehicle } from '@/api/fleet.api';
import { getBusRates, createBusRate, updateBusRate, deleteBusRate } from '@/api/bus.api';
import { Modal } from '@/components/common/Modal';
import { Loader } from '@/components/common/Loader';
import { formatCurrency } from '@/utils/formatCurrency';

type MainSection = 'buses' | 'cars';
type BusTab = 'all' | 'pune-mumbai' | 'outstation-ac' | 'outstation-nonac' | 'urbania-perkm' | 'local-ac' | 'local-nonac' | 'urbania-local';

const FALLBACK_BUS_RATES = [
  { _id: 'f1', busId: 'out-ac-13u', busType: '13 Seater Urbania', category: 'outstation_ac', seats: 13, acType: 'AC', isUrbania: true, mumbaiRate: 15000, mahabaleshwarRate: 10800, extraKmRate: 35, specialPermit: 500, status: 'Active' },
  { _id: 'f2', busId: 'out-ac-17u', busType: '17 Seater Urbania', category: 'outstation_ac', seats: 17, acType: 'AC', isUrbania: true, mumbaiRate: 15000, mahabaleshwarRate: 10800, extraKmRate: 36, specialPermit: 500, status: 'Active' },
  { _id: 'f3', busId: 'out-ac-13', busType: '13 Seater AC Coach', category: 'outstation_ac', seats: 13, acType: 'AC', isUrbania: false, mumbaiRate: 10500, mahabaleshwarRate: 10500, extraKmRate: 24, specialPermit: 500, status: 'Active' },
  { _id: 'f4', busId: 'out-ac-17', busType: '17 Seater AC Coach', category: 'outstation_ac', seats: 17, acType: 'AC', isUrbania: false, mumbaiRate: 11500, mahabaleshwarRate: 11500, extraKmRate: 28, specialPermit: 500, status: 'Active' },
  { _id: 'f5', busId: 'out-ac-20', busType: '20 Seater AC Coach', category: 'outstation_ac', seats: 20, acType: 'AC', isUrbania: false, mumbaiRate: 12500, mahabaleshwarRate: 12500, extraKmRate: 30, specialPermit: 700, status: 'Active' },
  { _id: 'f6', busId: 'out-ac-27', busType: '27 Seater AC Coach', category: 'outstation_ac', seats: 27, acType: 'AC', isUrbania: false, mumbaiRate: 17000, mahabaleshwarRate: 16000, extraKmRate: 45, specialPermit: 700, status: 'Active' },
  { _id: 'f7', busId: 'out-ac-35', busType: '35 Seater AC Coach', category: 'outstation_ac', seats: 35, acType: 'AC', isUrbania: false, mumbaiRate: 21500, mahabaleshwarRate: 19500, extraKmRate: 55, specialPermit: 700, status: 'Active' },
  { _id: 'f8', busId: 'out-ac-41', busType: '41 Seater AC Coach', category: 'outstation_ac', seats: 41, acType: 'AC', isUrbania: false, mumbaiRate: 24000, mahabaleshwarRate: 22000, extraKmRate: 60, specialPermit: 800, status: 'Active' },
  { _id: 'f9', busId: 'out-ac-45', busType: '45 Seater AC Coach', category: 'outstation_ac', seats: 45, acType: 'AC', isUrbania: false, mumbaiRate: 26000, mahabaleshwarRate: 24000, extraKmRate: 65, specialPermit: 800, status: 'Active' },
  { _id: 'f10', busId: 'pm-cab-5', busType: '5-Seater Sedan / SUV (with Driver)', category: 'urbania_pune_mumbai', seats: 5, acType: 'AC', packageRate: 3500, kmIncluded: 350, extraKmRate: 14, status: 'Active' },
  { _id: 'f11', busId: 'pm-cab-7', busType: '7-Seater Ertiga / Innova (with Driver)', category: 'urbania_pune_mumbai', seats: 7, acType: 'AC', packageRate: 4500, kmIncluded: 350, extraKmRate: 18, status: 'Active' },
  { _id: 'f12', busId: 'urb-day-13', busType: '13 Seater Urbania Per KM', category: 'urbania_per_day', seats: 13, acType: 'AC', isUrbania: true, minKmPerDay: 300, acPerKmRate: 35, tollNote: '₹400 or Food Extra', status: 'Active' },
  { _id: 'f13', busId: 'urb-day-17', busType: '17 Seater Urbania Per KM', category: 'urbania_per_day', seats: 17, acType: 'AC', isUrbania: true, minKmPerDay: 300, acPerKmRate: 36, tollNote: '₹400 or Food Extra', status: 'Active' },
  { _id: 'f14', busId: 'out-nonac-17', busType: '17 Seater Non-AC Coach', category: 'outstation_nonac', seats: 17, acType: 'Non-AC', isUrbania: false, mumbaiRate: 9000, mahabaleshwarRate: 8500, extraKmRate: 22, specialPermit: 500, status: 'Active' },
  { _id: 'f15', busId: 'out-nonac-20', busType: '20 Seater Non-AC Coach', category: 'outstation_nonac', seats: 20, acType: 'Non-AC', isUrbania: false, mumbaiRate: 10500, mahabaleshwarRate: 9500, extraKmRate: 25, specialPermit: 500, status: 'Active' },
  { _id: 'f16', busId: 'out-nonac-32', busType: '32 Seater Non-AC Coach', category: 'outstation_nonac', seats: 32, acType: 'Non-AC', isUrbania: false, mumbaiRate: 13500, mahabaleshwarRate: 12500, extraKmRate: 33, specialPermit: 700, status: 'Active' },
  { _id: 'f17', busId: 'out-nonac-35', busType: '35 Seater Non-AC Coach', category: 'outstation_nonac', seats: 35, acType: 'Non-AC', isUrbania: false, mumbaiRate: 14500, mahabaleshwarRate: 13500, extraKmRate: 36, specialPermit: 700, status: 'Active' },
  { _id: 'f18', busId: 'out-nonac-40', busType: '40 Seater Non-AC Coach', category: 'outstation_nonac', seats: 40, acType: 'Non-AC', isUrbania: false, mumbaiRate: 15500, mahabaleshwarRate: 14500, extraKmRate: 41, specialPermit: 700, status: 'Active' },
  { _id: 'f19', busId: 'out-nonac-45', busType: '45 Seater (2×2) Non-AC', category: 'outstation_nonac', seats: 45, acType: 'Non-AC', isUrbania: false, mumbaiRate: 19000, mahabaleshwarRate: 18000, extraKmRate: 50, specialPermit: 800, status: 'Active' },
  { _id: 'f20', busId: 'out-nonac-49', busType: '49 Seater (3×2) Non-AC', category: 'outstation_nonac', seats: 49, acType: 'Non-AC', isUrbania: false, mumbaiRate: 20000, mahabaleshwarRate: 17000, extraKmRate: 49, specialPermit: 800, status: 'Active' },
  { _id: 'f21', busId: 'local-ac-13', busType: '13 Seater Local AC', category: 'local_ac', seats: 13, acType: 'AC', baseRate: 6000, extraKmRate: 24, extraHourRate: 300, status: 'Active' },
  { _id: 'f22', busId: 'local-ac-17', busType: '17 Seater Local AC', category: 'local_ac', seats: 17, acType: 'AC', baseRate: 7000, extraKmRate: 28, extraHourRate: 300, status: 'Active' },
  { _id: 'f23', busId: 'local-ac-27', busType: '27 Seater Local AC', category: 'local_ac', seats: 27, acType: 'AC', baseRate: 9500, extraKmRate: 45, extraHourRate: 500, status: 'Active' },
  { _id: 'f24', busId: 'local-ac-35', busType: '35 Seater Local AC', category: 'local_ac', seats: 35, acType: 'AC', baseRate: 12000, extraKmRate: 55, extraHourRate: 700, status: 'Active' },
];

export default function FleetView() {
  const [mainSection, setMainSection] = useState<MainSection>('buses');
  const [activeBusTab, setActiveBusTab] = useState<BusTab>('all');

  // Car Fleet States
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [carLoading, setCarLoading] = useState(true);
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingVeh, setEditingVeh] = useState<any | null>(null);

  // Bus Rate Fleet States
  const [busRates, setBusRates] = useState<any[]>([]);
  const [busLoading, setBusLoading] = useState(true);
  const [isBusModalOpen, setIsBusModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<any | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  // Inline Quick Edit State
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineForm, setInlineForm] = useState<any>({});

  const [busForm, setBusForm] = useState({
    busId: '',
    busType: '13 Seater AC Coach',
    category: 'outstation_ac',
    seats: 13,
    acType: 'AC',
    isUrbania: false,
    baseRate: 6000,
    extraKmRate: 24,
    extraHourRate: 300,
    mumbaiRate: 10500,
    mahabaleshwarRate: 10500,
    specialPermit: 500,
    minKmPerDay: 300,
    acPerKmRate: 35,
    tollParkingDriverDA: 400,
    tollNote: '₹400 or Food Extra',
    packageRate: 3500,
    status: 'Active',
  });

  const [carForm, setCarForm] = useState({
    name: '',
    regNumber: '',
    categoryId: '',
    vehicleType: 'car',
    dailyRate: 2500,
    securityDeposit: 3000,
    status: 'Available',
    image: '/images/fleet/wagonr_vxi_2025.jpg',
    bodyType: 'Hatchback',
    transmission: 'Manual',
    fuel: 'Petrol',
    seats: 5,
    engine: '',
    horsepower: 85,
  });

  // Load Data
  const loadData = useCallback(() => {
    setCarLoading(true);
    setBusLoading(true);

    Promise.all([
      getFleetVehicles().then(d => setVehicles(Array.isArray(d) ? d : [])),
      getFleetCategories().then(d => setCategories(Array.isArray(d) ? d : [])),
    ]).finally(() => setCarLoading(false));

    getBusRates()
      .then(d => {
        const list = Array.isArray(d) ? d : (Array.isArray(d?.data) ? d.data : []);
        setBusRates(list);
      })
      .finally(() => setBusLoading(false));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Bus Actions
  const handleOpenBusEdit = (b: any) => {
    setEditingBus(b);
    setBusForm({
      busId: b.busId || '',
      busType: b.busType || '',
      category: b.category || 'outstation_ac',
      seats: b.seats || 13,
      acType: b.acType || 'AC',
      isUrbania: !!b.isUrbania,
      baseRate: b.baseRate || 0,
      extraKmRate: b.extraKmRate || 0,
      extraHourRate: b.extraHourRate || 0,
      mumbaiRate: b.mumbaiRate || 0,
      mahabaleshwarRate: b.mahabaleshwarRate || 0,
      specialPermit: b.specialPermit || 0,
      minKmPerDay: b.minKmPerDay || 300,
      acPerKmRate: b.acPerKmRate || 35,
      tollParkingDriverDA: b.tollParkingDriverDA || 400,
      tollNote: b.tollNote || '₹400 or Food Extra',
      packageRate: b.packageRate || 0,
      status: b.status || 'Active',
    });
    setIsBusModalOpen(true);
  };

  const handleSaveBus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...busForm,
        seats: Number(busForm.seats),
        baseRate: Number(busForm.baseRate),
        extraKmRate: Number(busForm.extraKmRate),
        extraHourRate: Number(busForm.extraHourRate),
        mumbaiRate: Number(busForm.mumbaiRate),
        mahabaleshwarRate: Number(busForm.mahabaleshwarRate),
        specialPermit: Number(busForm.specialPermit),
        minKmPerDay: Number(busForm.minKmPerDay),
        acPerKmRate: Number(busForm.acPerKmRate),
        tollParkingDriverDA: Number(busForm.tollParkingDriverDA),
        tollNote: busForm.tollNote,
        packageRate: Number(busForm.packageRate),
      };

      if (editingBus) {
        await updateBusRate(editingBus._id, payload);
      } else {
        await createBusRate(payload);
      }
      setIsBusModalOpen(false);
      setEditingBus(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save bus rate');
    }
  };

  const startInlineEdit = (b: any) => {
    setInlineEditingId(b._id);
    setInlineForm({
      mumbaiRate: b.mumbaiRate || 0,
      mahabaleshwarRate: b.mahabaleshwarRate || 0,
      extraKmRate: b.extraKmRate || 0,
      specialPermit: b.specialPermit || 0,
      baseRate: b.baseRate || 0,
      extraHourRate: b.extraHourRate || 0,
      packageRate: b.packageRate || 0,
      acPerKmRate: b.acPerKmRate || 35,
      minKmPerDay: b.minKmPerDay || 300,
      tollParkingDriverDA: b.tollParkingDriverDA || 400,
      tollNote: b.tollNote || '₹400 or Food Extra',
    });
  };

  const saveInlineEdit = async (id: string) => {
    try {
      await updateBusRate(id, {
        mumbaiRate: Number(inlineForm.mumbaiRate),
        mahabaleshwarRate: Number(inlineForm.mahabaleshwarRate),
        extraKmRate: Number(inlineForm.extraKmRate),
        specialPermit: Number(inlineForm.specialPermit),
        baseRate: Number(inlineForm.baseRate),
        extraHourRate: Number(inlineForm.extraHourRate),
        packageRate: Number(inlineForm.packageRate),
        acPerKmRate: Number(inlineForm.acPerKmRate),
        minKmPerDay: Number(inlineForm.minKmPerDay),
        tollParkingDriverDA: Number(inlineForm.tollParkingDriverDA),
        tollNote: inlineForm.tollNote,
      });
      setInlineEditingId(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save price');
    }
  };

  // Filter Buses by Category Tabs
  const getFilteredBusesForTab = () => {
    return busRates.filter(b => {
      const matchesSearch = b.busType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            String(b.seats).includes(searchQuery);
      if (!matchesSearch) return false;

      if (activeBusTab === 'all') return true;

      switch (activeBusTab) {
        case 'pune-mumbai':
          return b.category === 'urbania_pune_mumbai';
        case 'outstation-ac':
          return b.category === 'outstation_ac';
        case 'outstation-nonac':
          return b.category === 'outstation_nonac';
        case 'urbania-perkm':
          return b.category === 'urbania_per_day';
        case 'local-ac':
          return b.category === 'local_ac';
        case 'local-nonac':
          return b.category === 'local_nonac';
        case 'urbania-local':
          return b.category === 'urbania_local';
        default:
          return true;
      }
    });
  };

  const busTabs: { id: BusTab; label: string; catKey: string }[] = [
    { id: 'all', label: 'All Rates', catKey: 'all' },
    { id: 'outstation-ac', label: 'AC Bus Outstation', catKey: 'outstation_ac' },
    { id: 'outstation-nonac', label: 'Non-AC Bus Outstation', catKey: 'outstation_nonac' },
    { id: 'pune-mumbai', label: 'Pune–Mumbai (Cabs & Buses)', catKey: 'urbania_pune_mumbai' },
    { id: 'urbania-perkm', label: 'Urbania Per KM', catKey: 'urbania_per_day' },
    { id: 'local-ac', label: 'Local AC Buses (8h/80km)', catKey: 'local_ac' },
    { id: 'local-nonac', label: 'Local Non-AC Buses (8h/80km)', catKey: 'local_nonac' },
    { id: 'urbania-local', label: 'Urbania Local Package', catKey: 'urbania_local' },
  ];

  const currentTabBuses = getFilteredBusesForTab();

  return (
    <div className="space-y-4 max-w-full select-none font-sans">

      {/* MINIMAL HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#5266EB]/10 text-[#5266EB] rounded-lg">
            <Bus className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-none">
              Vehicle & Rate Cards Management
            </h1>
            <p className="text-[11px] text-gray-400 mt-1">
              Live synced with main website rate cards and booking forms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setMainSection('buses')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              mainSection === 'buses'
                ? 'bg-[#5266EB] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Bus Rates ({busRates.length})</span>
          </button>
          <button
            onClick={() => setMainSection('cars')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              mainSection === 'cars'
                ? 'bg-[#5266EB] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Cars ({vehicles.length})</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 1: BUS RENTALS RATE CARDS
          ───────────────────────────────────────────────────────────────── */}
      {mainSection === 'buses' && (
        <div className="space-y-4">

          {/* SLEEK MINIMAL CATEGORY PILLS BAR */}
          <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {busTabs.map((tab) => {
                const count = busRates.filter(b => b.category === tab.catKey).length;
                const isActive = activeBusTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveBusTab(tab.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-[#5266EB] text-white shadow-sm'
                        : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEARCH & ACTIONS BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search seating capacity or bus type..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#5266EB]"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={loadData}
                className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                title="Refresh Rates"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setEditingBus(null);
                  setBusForm({
                    busId: `bus-${Date.now()}`,
                    busType: '13 Seater AC Coach',
                    category: activeBusTab === 'outstation-ac' ? 'outstation_ac' : (activeBusTab === 'outstation-nonac' ? 'outstation_nonac' : 'local_ac'),
                    seats: 13,
                    acType: activeBusTab.includes('nonac') ? 'Non-AC' : 'AC',
                    isUrbania: activeBusTab.includes('urbania'),
                    baseRate: 6000,
                    extraKmRate: 24,
                    extraHourRate: 300,
                    mumbaiRate: 10500,
                    mahabaleshwarRate: 10500,
                    specialPermit: 500,
                    minKmPerDay: 300,
                    acPerKmRate: 35,
                    tollParkingDriverDA: 400,
                    tollNote: '₹400 or Food Extra',
                    packageRate: 3500,
                    status: 'Active',
                  });
                  setIsBusModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-[#5266EB] hover:bg-[#3E51D4] text-white text-xs font-semibold rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Rate Card</span>
              </button>
            </div>
          </div>

          {/* TABLE / CARDS VIEW WITH FULL MOBILE PHONE SUPPORT */}
          {busLoading ? (
            <div className="py-12 flex justify-center">
              <Loader />
            </div>
          ) : currentTabBuses.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-xl border border-gray-200">
              <Bus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-700">No Rate Cards Configured in this Tab</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Click "Add Rate Card" above to create new rates.</p>
            </div>
          ) : (
            <div className="space-y-4">

              {/* 📱 MOBILE RATE EDIT CARDS (< 768px - PERFECT FOR ANDROID & IPHONE) */}
              <div className="grid grid-cols-1 gap-3.5 md:hidden">
                {currentTabBuses.map((rate) => {
                  const isEditingThis = inlineEditingId === rate._id;

                  return (
                    <div key={rate._id} className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-2">
                          <Bus className="w-4 h-4 text-[#5266EB]" />
                          <div>
                            <p className="font-bold text-xs text-gray-900">{rate.busType}</p>
                            <p className="text-[10px] text-gray-400">{rate.seats} Seater Capacity</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-blue-50 text-[#5266EB] px-2 py-0.5 rounded-full border border-blue-200">
                          {rate.seats} Seats
                        </span>
                      </div>

                      {/* OUTSTATION & ALL RATES MOBILE INPUTS */}
                      {(activeBusTab === 'all' || activeBusTab === 'outstation-ac' || activeBusTab === 'outstation-nonac') && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                            <span className="text-[10px] text-gray-500 block font-semibold">Mumbai Rate</span>
                            {isEditingThis ? (
                              <input
                                type="number"
                                value={inlineForm.mumbaiRate}
                                onChange={e => setInlineForm({ ...inlineForm, mumbaiRate: e.target.value })}
                                className="w-full px-2 py-1 border border-emerald-400 rounded text-xs font-bold text-emerald-700 bg-white"
                              />
                            ) : (
                              <span className="font-bold text-emerald-700 text-sm">₹{rate.mumbaiRate ? rate.mumbaiRate.toLocaleString('en-IN') : 0}</span>
                            )}
                          </div>

                          <div className="bg-blue-50/70 p-2 rounded-lg border border-blue-100">
                            <span className="text-[10px] text-gray-500 block font-semibold">Mahabaleshwar Rate</span>
                            {isEditingThis ? (
                              <input
                                type="number"
                                value={inlineForm.mahabaleshwarRate}
                                onChange={e => setInlineForm({ ...inlineForm, mahabaleshwarRate: e.target.value })}
                                className="w-full px-2 py-1 border border-blue-400 rounded text-xs font-bold text-[#5266EB] bg-white"
                              />
                            ) : (
                              <span className="font-bold text-[#5266EB] text-sm">₹{rate.mahabaleshwarRate ? rate.mahabaleshwarRate.toLocaleString('en-IN') : 0}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* URBANIA PER KM MOBILE INPUTS */}
                      {activeBusTab === 'urbania-perkm' && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-blue-50/70 p-2 rounded-lg border border-blue-100">
                            <span className="text-[10px] text-gray-500 block font-semibold">Per KM Rate</span>
                            {isEditingThis ? (
                              <input
                                type="number"
                                value={inlineForm.acPerKmRate}
                                onChange={e => setInlineForm({ ...inlineForm, acPerKmRate: e.target.value })}
                                className="w-full px-2 py-1 border border-blue-400 rounded text-xs font-bold text-[#5266EB] bg-white"
                              />
                            ) : (
                              <span className="font-bold text-[#5266EB] text-sm">₹{rate.acPerKmRate || 35}/km</span>
                            )}
                          </div>

                          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                            <span className="text-[10px] text-gray-500 block font-semibold">Min Running</span>
                            {isEditingThis ? (
                              <input
                                type="number"
                                value={inlineForm.minKmPerDay}
                                onChange={e => setInlineForm({ ...inlineForm, minKmPerDay: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-bold bg-white"
                              />
                            ) : (
                              <span className="font-bold text-gray-800 text-xs">{rate.minKmPerDay || 300} KM/day</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* PUNE-MUMBAI CABS & BUSES MOBILE INPUTS */}
                      {activeBusTab === 'pune-mumbai' && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-blue-50/70 p-2 rounded-lg border border-blue-100">
                            <span className="text-[10px] text-gray-500 block font-semibold">Package Rate</span>
                            {isEditingThis ? (
                              <input
                                type="number"
                                value={inlineForm.packageRate}
                                onChange={e => setInlineForm({ ...inlineForm, packageRate: e.target.value })}
                                className="w-full px-2 py-1 border border-blue-400 rounded text-xs font-bold text-[#5266EB] bg-white"
                              />
                            ) : (
                              <span className="font-bold text-[#5266EB] text-sm">₹{rate.packageRate ? rate.packageRate.toLocaleString('en-IN') : 0}</span>
                            )}
                          </div>

                          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                            <span className="text-[10px] text-gray-500 block font-semibold">Extra KM Rate</span>
                            {isEditingThis ? (
                              <input
                                type="number"
                                value={inlineForm.extraKmRate}
                                onChange={e => setInlineForm({ ...inlineForm, extraKmRate: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-bold bg-white"
                              />
                            ) : (
                              <span className="font-bold text-gray-800 text-xs">₹{rate.extraKmRate}/km</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* LOCAL BUSES MOBILE INPUTS */}
                      {(activeBusTab === 'local-ac' || activeBusTab === 'local-nonac' || activeBusTab === 'urbania-local') && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-100 p-2 rounded-lg">
                            <span className="text-[10px] text-gray-500 block font-semibold">Base Rate (8h/80km)</span>
                            {isEditingThis ? (
                              <input
                                type="number"
                                value={rate.packageRate ? inlineForm.packageRate : inlineForm.baseRate}
                                onChange={e => setInlineForm({ ...inlineForm, baseRate: e.target.value, packageRate: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-400 rounded text-xs font-bold bg-white"
                              />
                            ) : (
                              <span className="font-bold text-gray-900 text-sm">₹{(rate.baseRate || rate.packageRate || 0).toLocaleString('en-IN')}</span>
                            )}
                          </div>

                          <div className="bg-gray-50 p-2 rounded-lg">
                            <span className="text-[10px] text-gray-500 block font-semibold">Extra KM Rate</span>
                            {isEditingThis ? (
                              <input
                                type="number"
                                value={inlineForm.extraKmRate}
                                onChange={e => setInlineForm({ ...inlineForm, extraKmRate: e.target.value })}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-bold bg-white"
                              />
                            ) : (
                              <span className="font-bold text-gray-800 text-xs">₹{rate.extraKmRate}/km</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* MOBILE ACTIONS BUTTON */}
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100">
                        {isEditingThis ? (
                          <button
                            onClick={() => saveInlineEdit(rate._id)}
                            className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                          >
                            Save Price Live
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 w-full">
                            <button
                              onClick={() => startInlineEdit(rate)}
                              className="flex-1 py-2 rounded-lg bg-[#5266EB] hover:bg-[#3E51D4] text-white font-semibold text-xs inline-flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Edit Prices</span>
                            </button>
                            <button
                              onClick={() => handleOpenBusEdit(rate)}
                              className="p-2 text-gray-500 hover:text-[#5266EB] rounded-lg border border-gray-200 cursor-pointer"
                              title="Full Details Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 💻 DESKTOP TABLE VIEW (>= 768px) */}
              <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto no-scrollbar">

                  {/* OUTSTATION & ALL RATES MASTER TABLE */}
                  {(activeBusTab === 'all' || activeBusTab === 'outstation-ac' || activeBusTab === 'outstation-nonac') && (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#181824] text-white uppercase text-[10px] tracking-wider font-bold">
                        <tr>
                          <th className="py-3 px-4">BUS TYPE & CAPACITY</th>
                          <th className="py-3 px-4">SEATS</th>
                          <th className="py-3 px-4">MUMBAI RATE</th>
                          <th className="py-3 px-4">MAHABALESHWAR RATE</th>
                          <th className="py-3 px-4">EXTRA KM</th>
                          <th className="py-3 px-4">SPECIAL PERMIT</th>
                          <th className="py-3 px-4 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {currentTabBuses.map((rate) => {
                          const isEditingThis = inlineEditingId === rate._id;

                          return (
                            <tr key={rate._id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-3 px-4 font-semibold text-gray-900 flex items-center gap-2">
                                <Bus className="w-4 h-4 text-[#5266EB]" />
                                <div>
                                  <p className="font-bold text-xs text-gray-900">{rate.busType}</p>
                                  <p className="text-[10px] text-gray-400">{rate.seats} Seater Capacity</p>
                                </div>
                              </td>

                              <td className="py-3 px-4 font-semibold text-gray-800">{rate.seats} Seater</td>

                              <td className="py-3 px-4 font-bold text-emerald-600">
                                {isEditingThis ? (
                                  <input
                                    type="number"
                                    value={inlineForm.mumbaiRate}
                                    onChange={e => setInlineForm({ ...inlineForm, mumbaiRate: e.target.value })}
                                    className="w-24 px-2 py-1 border border-emerald-400 rounded text-xs font-bold text-emerald-700 focus:outline-none"
                                  />
                                ) : (
                                  <span>₹{rate.mumbaiRate ? rate.mumbaiRate.toLocaleString('en-IN') : 0}</span>
                                )}
                              </td>

                              <td className="py-3 px-4 font-bold text-[#5266EB]">
                                {isEditingThis ? (
                                  <input
                                    type="number"
                                    value={inlineForm.mahabaleshwarRate}
                                    onChange={e => setInlineForm({ ...inlineForm, mahabaleshwarRate: e.target.value })}
                                    className="w-24 px-2 py-1 border border-blue-400 rounded text-xs font-bold text-[#5266EB] focus:outline-none"
                                  />
                                ) : (
                                  <span>₹{rate.mahabaleshwarRate ? rate.mahabaleshwarRate.toLocaleString('en-IN') : 0}</span>
                                )}
                              </td>

                              <td className="py-3 px-4">
                                {isEditingThis ? (
                                  <input
                                    type="number"
                                    value={inlineForm.extraKmRate}
                                    onChange={e => setInlineForm({ ...inlineForm, extraKmRate: e.target.value })}
                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-xs font-semibold focus:outline-none"
                                  />
                                ) : (
                                  <span>₹{rate.extraKmRate}/km</span>
                                )}
                              </td>

                              <td className="py-3 px-4 font-medium text-amber-700">
                                {isEditingThis ? (
                                  <input
                                    type="number"
                                    value={inlineForm.specialPermit}
                                    onChange={e => setInlineForm({ ...inlineForm, specialPermit: e.target.value })}
                                    className="w-16 px-2 py-1 border border-amber-400 rounded text-xs font-bold text-amber-800 focus:outline-none"
                                  />
                                ) : (
                                  <span>₹{rate.specialPermit}</span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right space-x-1.5">
                                {isEditingThis ? (
                                  <button
                                    onClick={() => saveInlineEdit(rate._id)}
                                    className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                                  >
                                    Save
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => startInlineEdit(rate)}
                                    className="px-3 py-1 rounded-md bg-[#5266EB] hover:bg-[#3E51D4] text-white font-semibold text-xs inline-flex items-center gap-1 cursor-pointer shadow-sm"
                                  >
                                    <Pencil className="w-3 h-3" />
                                    <span>Edit Price</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => handleOpenBusEdit(rate)}
                                  className="p-1 text-gray-400 hover:text-[#5266EB] rounded hover:bg-gray-100 cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}

                  {/* URBANIA PER KM TABLE */}
                  {activeBusTab === 'urbania-perkm' && (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#181824] text-white uppercase text-[10px] tracking-wider font-bold">
                        <tr>
                          <th className="py-3 px-4">VEHICLE TYPE</th>
                          <th className="py-3 px-4">SEATS</th>
                          <th className="py-3 px-4">PER KM RATE</th>
                          <th className="py-3 px-4">MIN RUNNING</th>
                          <th className="py-3 px-4">DRIVER DA / TOLL NOTE</th>
                          <th className="py-3 px-4 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {currentTabBuses.map((rate) => {
                          const isEditingThis = inlineEditingId === rate._id;

                          return (
                            <tr key={rate._id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-3 px-4 font-semibold text-gray-900 flex items-center gap-2">
                                <Bus className="w-4 h-4 text-[#5266EB]" />
                                <div>
                                  <p className="font-bold text-xs text-gray-900">{rate.busType}</p>
                                  <p className="text-[10px] text-gray-400">{rate.seats} Seats • Pushback AC Urbania</p>
                                </div>
                              </td>

                              <td className="py-3 px-4 font-semibold text-gray-800">{rate.seats} Seater</td>

                              <td className="py-3 px-4 font-bold text-[#5266EB]">
                                {isEditingThis ? (
                                  <input
                                    type="number"
                                    value={inlineForm.acPerKmRate}
                                    onChange={e => setInlineForm({ ...inlineForm, acPerKmRate: e.target.value })}
                                    className="w-20 px-2 py-1 border border-blue-400 rounded text-xs font-bold text-[#5266EB] focus:outline-none"
                                  />
                                ) : (
                                  <span>₹{rate.acPerKmRate || 35}/km</span>
                                )}
                              </td>

                              <td className="py-3 px-4 font-bold text-gray-800">
                                {isEditingThis ? (
                                  <input
                                    type="number"
                                    value={inlineForm.minKmPerDay}
                                    onChange={e => setInlineForm({ ...inlineForm, minKmPerDay: e.target.value })}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-xs font-bold focus:outline-none"
                                  />
                                ) : (
                                  <span>{rate.minKmPerDay || 300} KM/day</span>
                                )}
                              </td>

                              <td className="py-3 px-4 font-medium text-gray-700">
                                {isEditingThis ? (
                                  <input
                                    type="text"
                                    value={inlineForm.tollNote}
                                    onChange={e => setInlineForm({ ...inlineForm, tollNote: e.target.value })}
                                    className="w-40 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none"
                                  />
                                ) : (
                                  <span>{rate.tollNote || '₹400 or Food Extra'}</span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right space-x-1.5">
                                {isEditingThis ? (
                                  <button
                                    onClick={() => saveInlineEdit(rate._id)}
                                    className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                                  >
                                    Save
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => startInlineEdit(rate)}
                                    className="px-3 py-1 rounded-md bg-[#5266EB] hover:bg-[#3E51D4] text-white font-semibold text-xs inline-flex items-center gap-1 cursor-pointer shadow-sm"
                                  >
                                    <Pencil className="w-3 h-3" />
                                    <span>Edit Price</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}

                  {/* PUNE - MUMBAI CABS & BUSES TABLE */}
                  {activeBusTab === 'pune-mumbai' && (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#181824] text-white uppercase text-[10px] tracking-wider font-bold">
                        <tr>
                          <th className="py-3 px-4">PACKAGE / VEHICLE TITLE</th>
                          <th className="py-3 px-4">SEATS</th>
                          <th className="py-3 px-4">PACKAGE RATE (PUNE → MUMBAI)</th>
                          <th className="py-3 px-4">INCLUDED KM</th>
                          <th className="py-3 px-4">EXTRA KM RATE</th>
                          <th className="py-3 px-4 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {currentTabBuses.map((rate) => {
                          const isEditingThis = inlineEditingId === rate._id;

                          return (
                            <tr key={rate._id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-3 px-4 font-semibold text-gray-900 flex items-center gap-2">
                                <Car className="w-4 h-4 text-[#5266EB]" />
                                <div>
                                  <p className="font-bold text-xs text-gray-900">{rate.busType}</p>
                                  <p className="text-[10px] text-gray-400">{rate.seats} Seater Capacity</p>
                                </div>
                              </td>

                              <td className="py-3 px-4 font-semibold text-gray-800">{rate.seats} Seater</td>

                              <td className="py-3 px-4 font-bold text-[#5266EB]">
                                {isEditingThis ? (
                                  <input
                                    type="number"
                                    value={inlineForm.packageRate}
                                    onChange={e => setInlineForm({ ...inlineForm, packageRate: e.target.value })}
                                    className="w-24 px-2 py-1 border border-blue-400 rounded text-xs font-bold text-[#5266EB] focus:outline-none"
                                  />
                                ) : (
                                  <span>₹{rate.packageRate ? rate.packageRate.toLocaleString('en-IN') : 0}</span>
                                )}
                              </td>

                              <td className="py-3 px-4 font-semibold">{rate.kmIncluded || 350} KM</td>

                              <td className="py-3 px-4">
                                {isEditingThis ? (
                                  <input
                                    type="number"
                                    value={inlineForm.extraKmRate}
                                    onChange={e => setInlineForm({ ...inlineForm, extraKmRate: e.target.value })}
                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-xs font-semibold focus:outline-none"
                                  />
                                ) : (
                                  <span>₹{rate.extraKmRate}/km</span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right space-x-1">
                                {isEditingThis ? (
                                  <button
                                    onClick={() => saveInlineEdit(rate._id)}
                                    className="px-3 py-1 rounded-md bg-emerald-600 text-white font-bold text-xs"
                                  >
                                    Save
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => startInlineEdit(rate)}
                                    className="px-3 py-1 rounded-md bg-[#5266EB] text-white font-semibold text-xs inline-flex items-center gap-1"
                                  >
                                    <Pencil className="w-3 h-3" />
                                    <span>Edit Price</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}

                  {/* LOCAL BUSES TABLE */}
                  {(activeBusTab === 'local-ac' || activeBusTab === 'local-nonac' || activeBusTab === 'urbania-local') && (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#181824] text-white uppercase text-[10px] tracking-wider font-bold">
                        <tr>
                          <th className="py-3 px-4">BUS TYPE</th>
                          <th className="py-3 px-4">SEATS</th>
                          <th className="py-3 px-4">BASE / PACKAGE RATE</th>
                          <th className="py-3 px-4">EXTRA KM RATE</th>
                          <th className="py-3 px-4">EXTRA HOUR RATE</th>
                          <th className="py-3 px-4 text-right">ACTION</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {currentTabBuses.map((rate) => {
                          const isEditingThis = inlineEditingId === rate._id;

                          return (
                            <tr key={rate._id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-3 px-4 font-semibold text-gray-900 flex items-center gap-2">
                                <Bus className="w-4 h-4 text-[#5266EB]" />
                                <div>
                                  <p className="font-bold text-xs text-gray-900">{rate.busType}</p>
                                  <p className="text-[10px] text-gray-400">{rate.seats} Seater Capacity</p>
                                </div>
                              </td>

                              <td className="py-3 px-4 font-semibold text-gray-800">{rate.seats} Seater</td>

                              <td className="py-3 px-4 font-bold text-gray-900">
                                {isEditingThis ? (
                                  <input
                                    type="number"
                                    value={rate.packageRate ? inlineForm.packageRate : inlineForm.baseRate}
                                    onChange={e => setInlineForm({
                                      ...inlineForm,
                                      baseRate: e.target.value,
                                      packageRate: e.target.value,
                                    })}
                                    className="w-24 px-2 py-1 border border-gray-400 rounded text-xs font-bold focus:outline-none"
                                  />
                                ) : (
                                  <span>₹{(rate.baseRate || rate.packageRate || 0).toLocaleString('en-IN')}</span>
                                )}
                              </td>

                              <td className="py-3 px-4">
                                {isEditingThis ? (
                                  <input
                                    type="number"
                                    value={inlineForm.extraKmRate}
                                    onChange={e => setInlineForm({ ...inlineForm, extraKmRate: e.target.value })}
                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-xs font-semibold focus:outline-none"
                                  />
                                ) : (
                                  <span>₹{rate.extraKmRate}/km</span>
                                )}
                              </td>

                              <td className="py-3 px-4">
                                {isEditingThis ? (
                                  <input
                                    type="number"
                                    value={inlineForm.extraHourRate}
                                    onChange={e => setInlineForm({ ...inlineForm, extraHourRate: e.target.value })}
                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-xs font-semibold focus:outline-none"
                                  />
                                ) : (
                                  <span>₹{rate.extraHourRate || 0}/hr</span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right space-x-1">
                                {isEditingThis ? (
                                  <button
                                    onClick={() => saveInlineEdit(rate._id)}
                                    className="px-3 py-1 rounded-md bg-emerald-600 text-white font-bold text-xs"
                                  >
                                    Save
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => startInlineEdit(rate)}
                                    className="px-3 py-1 rounded-md bg-[#5266EB] text-white font-semibold text-xs inline-flex items-center gap-1"
                                  >
                                    <Pencil className="w-3 h-3" />
                                    <span>Edit Price</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}

                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* SECTION 2: CARS INVENTORY */}
      {mainSection === 'cars' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vehicles.map(car => (
            <div key={car._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="relative h-40 bg-gray-100 flex items-center justify-center p-3">
                <img
                  src={Array.isArray(car.images) && car.images[0] ? car.images[0] : '/images/fleet/wagonr_vxi_2025.jpg'}
                  alt={car.name}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold">
                  {car.regNumber || 'N/A'}
                </div>
              </div>

              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{car.name}</h4>
                  <p className="text-xs text-gray-400">
                    {car.specs?.seats || 5} Seats • {car.specs?.transmission || 'Manual'} • {car.specs?.fuel || 'Petrol'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-medium">Daily Rate</span>
                    <span className="font-bold text-gray-900 text-xs">{formatCurrency(car.dailyRate || 2500)}</span>
                  </div>
                  <button
                    onClick={() => {
                      setEditingVeh(car);
                      setCarForm({
                        name: car.name || '',
                        regNumber: car.regNumber || '',
                        categoryId: car.categoryId?._id || car.categoryId || categories[0]?._id || '',
                        vehicleType: car.vehicleType || 'car',
                        dailyRate: car.dailyRate || 2500,
                        securityDeposit: car.securityDeposit || 3000,
                        status: car.status || 'Available',
                        image: Array.isArray(car.images) && car.images[0] ? car.images[0] : '/images/fleet/wagonr_vxi_2025.jpg',
                        bodyType: car.specs?.bodyType || 'Hatchback',
                        transmission: car.specs?.transmission || 'Manual',
                        fuel: car.specs?.fuel || 'Petrol',
                        seats: car.specs?.seats || 5,
                        engine: car.specs?.engine || '',
                        horsepower: car.specs?.horsepower || 85,
                      });
                      setIsCarModalOpen(true);
                    }}
                    className="p-1.5 text-gray-500 hover:text-[#5266EB] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT BUS MODAL */}
      <Modal
        isOpen={isBusModalOpen}
        onClose={() => setIsBusModalOpen(false)}
        title={editingBus ? `Edit Rate Card: ${editingBus.busType}` : 'Add Bus Rental Rate Card'}
      >
        <form onSubmit={handleSaveBus} className="space-y-4 text-xs text-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-900 block mb-1">Bus / Vehicle Title *</label>
              <input
                type="text"
                required
                value={busForm.busType}
                onChange={e => setBusForm({ ...busForm, busType: e.target.value })}
                className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#5266EB] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-gray-900 block mb-1">Category *</label>
              <select
                value={busForm.category}
                onChange={e => setBusForm({ ...busForm, category: e.target.value as any })}
                className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#5266EB] focus:outline-none bg-white"
              >
                <option value="outstation_ac">Outstation AC Bus</option>
                <option value="outstation_nonac">Outstation Non-AC Bus</option>
                <option value="urbania_pune_mumbai">Pune → Mumbai Package (Cabs & Buses)</option>
                <option value="urbania_per_day">Urbania Per-Day Outstation</option>
                <option value="local_ac">Local AC Bus (8h/80km)</option>
                <option value="local_nonac">Local Non-AC Bus (8h/80km)</option>
                <option value="urbania_local">Urbania Local Package</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-[#5266EB] block mb-1">Urbania Per KM Rate (₹)</label>
              <input
                type="number"
                value={busForm.acPerKmRate}
                onChange={e => setBusForm({ ...busForm, acPerKmRate: Number(e.target.value) })}
                className="w-full p-2 rounded-lg border border-gray-200 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-gray-900 block mb-1">Min KM Running (KM/day)</label>
              <input
                type="number"
                value={busForm.minKmPerDay}
                onChange={e => setBusForm({ ...busForm, minKmPerDay: Number(e.target.value) })}
                className="w-full p-2 rounded-lg border border-gray-200 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-gray-900 block mb-1">Driver DA / Toll Note</label>
              <input
                type="text"
                value={busForm.tollNote}
                onChange={e => setBusForm({ ...busForm, tollNote: e.target.value })}
                className="w-full p-2 rounded-lg border border-gray-200 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#5266EB] block mb-1">Mumbai Rate (₹)</label>
              <input
                type="number"
                value={busForm.mumbaiRate}
                onChange={e => setBusForm({ ...busForm, mumbaiRate: Number(e.target.value) })}
                className="w-full p-2 rounded-lg border border-gray-200 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-[#5266EB] block mb-1">Mahabaleshwar Rate (₹)</label>
              <input
                type="number"
                value={busForm.mahabaleshwarRate}
                onChange={e => setBusForm({ ...busForm, mahabaleshwarRate: Number(e.target.value) })}
                className="w-full p-2 rounded-lg border border-gray-200 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-medium block mb-1">Package Rate (₹)</label>
              <input
                type="number"
                value={busForm.packageRate}
                onChange={e => setBusForm({ ...busForm, packageRate: Number(e.target.value) })}
                className="w-full p-2 rounded-lg border border-gray-200"
              />
            </div>
            <div>
              <label className="font-medium block mb-1">Extra KM Rate (₹)</label>
              <input
                type="number"
                value={busForm.extraKmRate}
                onChange={e => setBusForm({ ...busForm, extraKmRate: Number(e.target.value) })}
                className="w-full p-2 rounded-lg border border-gray-200"
              />
            </div>
            <div>
              <label className="font-medium block mb-1">Special Permit (₹)</label>
              <input
                type="number"
                value={busForm.specialPermit}
                onChange={e => setBusForm({ ...busForm, specialPermit: Number(e.target.value) })}
                className="w-full p-2 rounded-lg border border-gray-200"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsBusModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#5266EB] hover:bg-[#3E51D4] text-white font-bold shadow-md"
            >
              Save Rate Card
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
