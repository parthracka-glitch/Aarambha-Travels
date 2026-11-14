import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  LayoutGrid,
  List,
  ExternalLink,
  Sparkles,
  X,
  Compass,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { getToursPackages, getToursDestinations, createPackage, updatePackage, deletePackage } from '@/api/tours.api';
import { Modal } from '@/components/common/Modal';
import { Loader } from '@/components/common/Loader';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAutoRefresh } from '@/hooks/useRealtimeSync';

// Helper for contextual fallback images
function getPackageFallbackImage(title?: string, slug?: string): string {
  const str = `${title || ''} ${slug || ''}`.toLowerCase();
  if (str.includes('girnar') || str.includes('somnath') || str.includes('dwarka')) {
    return '/images/tours/somnath_jyotirlinga_temple.jpg';
  }
  if (str.includes('khatu') || str.includes('salasar') || str.includes('sanwaliya')) {
    return '/images/tours/khatu_shyam_salasar_tour.jpg';
  }
  if (str.includes('ujjain') || str.includes('omkareshwar') || str.includes('mahakal') || str.includes('jyotirlinga')) {
    return '/images/tours/mumbai_ujjain_omkareshwar_tour.jpg';
  }
  if (str.includes('krishna') || str.includes('vrindavan') || str.includes('mathura')) {
    return 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop';
  }
  return '/images/tours_travels_bg.jpg';
}

// ─── NON-FLICKERING PACKAGE THUMBNAIL (GRID) ─────────────────────────
function PackageThumbnail({ title, image, slug }: { title: string; image?: string; slug?: string }) {
  const [loadError, setLoadError] = useState(false);
  const fallbackImg = useMemo(() => getPackageFallbackImage(title, slug), [title, slug]);
  const initialSrc = image?.trim() || fallbackImg;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  React.useEffect(() => {
    setCurrentSrc(image?.trim() || fallbackImg);
    setLoadError(false);
  }, [image, fallbackImg]);

  if (loadError) {
    return (
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#101F40] to-[#1C315A] text-white flex items-center justify-center shrink-0 border border-[#E8ECF4]">
        <Compass className="w-6 h-6 text-[#E8B9A5]" />
      </div>
    );
  }

  return (
    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F5F7FC] border border-[#E8ECF4] shrink-0 relative">
      <img
        src={currentSrc}
        alt={title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          e.currentTarget.onerror = null; // Cut off infinite loop immediately
          if (currentSrc.startsWith('/') && !currentSrc.startsWith('//')) {
            setCurrentSrc(`https://www.aarambhatravels.in${currentSrc}`);
          } else if (currentSrc !== fallbackImg) {
            setCurrentSrc(fallbackImg);
          } else {
            setLoadError(true);
          }
        }}
      />
    </div>
  );
}

// ─── NON-FLICKERING PACKAGE THUMBNAIL (TABLE) ────────────────────────
function TablePackageThumbnail({ title, image, slug }: { title: string; image?: string; slug?: string }) {
  const [loadError, setLoadError] = useState(false);
  const fallbackImg = useMemo(() => getPackageFallbackImage(title, slug), [title, slug]);
  const initialSrc = image?.trim() || fallbackImg;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  React.useEffect(() => {
    setCurrentSrc(image?.trim() || fallbackImg);
    setLoadError(false);
  }, [image, fallbackImg]);

  if (loadError) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#101F40] to-[#1C315A] text-white flex items-center justify-center shrink-0">
        <Compass className="w-4 h-4 text-[#E8B9A5]" />
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={title}
      loading="lazy"
      decoding="async"
      className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-[#E8ECF4] shrink-0"
      onError={(e) => {
        e.currentTarget.onerror = null;
        if (currentSrc.startsWith('/') && !currentSrc.startsWith('//')) {
          setCurrentSrc(`https://www.aarambhatravels.in${currentSrc}`);
        } else if (currentSrc !== fallbackImg) {
          setCurrentSrc(fallbackImg);
        } else {
          setLoadError(true);
        }
      }}
    />
  );
}

export default function ToursView() {
  const [packages, setPackages] = useState<any[]>([]);
  const [_destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<any | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState<'all' | 'with_batches' | 'no_batches'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Batch Dates Manager Modal State
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [activeBatchPkg, setActiveBatchPkg] = useState<any | null>(null);
  const [pkgBatches, setPkgBatches] = useState<any[]>([]);
  const [activeMonthFilter, setActiveMonthFilter] = useState('All');

  // New Batch Form State
  const [newBatchMonth, setNewBatchMonth] = useState('August');
  const [newBatchTag, setNewBatchTag] = useState('Weekend Special');
  const [newBatchStart, setNewBatchStart] = useState('2026-08-05');
  const [newBatchEnd, setNewBatchEnd] = useState('2026-08-11');
  const [newBatchStatus, setNewBatchStatus] = useState<'available' | 'full'>('available');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    durationDays: 3,
    durationNights: 2,
    basePrice: 7499,
    depositPrice: 2999,
    inclusions: 'AC Bus / Train, 3★ Hotel Stay, Pure Veg Meals, Temple Darshan Passes',
    imageUrl: '',
  });

  const load = useCallback(() => {
    if (!hasLoadedRef.current) setLoading(true);
    Promise.all([
      getToursPackages().then(d => {
        if (Array.isArray(d)) {
          setPackages(prev => {
            if (JSON.stringify(prev) === JSON.stringify(d)) return prev;
            return d;
          });
        }
      }).catch(() => {}),
      getToursDestinations().then(d => {
        if (Array.isArray(d)) {
          setDestinations(prev => {
            if (JSON.stringify(prev) === JSON.stringify(d)) return prev;
            return d;
          });
        }
      }).catch(() => {}),
    ]).finally(() => {
      hasLoadedRef.current = true;
      setLoading(false);
    });
  }, []);

  useAutoRefresh(load, ['TOURS_UPDATED'], 6000);

  // Helper to count batches (checking MongoDB + localStorage fallback)
  const getBatchCount = useCallback((pkg: any): number => {
    if (Array.isArray(pkg.batchDates) && pkg.batchDates.length > 0) return pkg.batchDates.length;
    try {
      const key = 'aarambha_package_batches_' + (pkg.slug || pkg._id || pkg.id);
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed.length;
      }
    } catch (_e) {}
    return 0;
  }, []);

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      description: '',
      durationDays: 3,
      durationNights: 2,
      basePrice: 7499,
      depositPrice: 2999,
      inclusions: 'AC Bus / Train, 3★ Hotel Stay, Pure Veg Meals, Temple Darshan Passes',
      imageUrl: '',
    });
    setEditingPkg(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (pkg: any) => {
    setEditingPkg(pkg);
    const existingImage = Array.isArray(pkg.images) && pkg.images.length > 0
      ? pkg.images[0]
      : (typeof pkg.image === 'string' ? pkg.image : '');

    setForm({
      title: pkg.title || '',
      slug: pkg.slug || '',
      description: pkg.description || '',
      durationDays: pkg.durationDays || pkg.duration_days || 1,
      durationNights: pkg.durationNights || pkg.duration_nights || 0,
      basePrice: pkg.basePrice || pkg.base_price || 0,
      depositPrice: pkg.depositPrice || pkg.deposit_price || 500,
      inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join(', ') : (pkg.inclusions || 'Hotel, Meals'),
      imageUrl: existingImage,
    });
    setIsCreateOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const destId = typeof editingPkg?.destinationId === 'object' && editingPkg?.destinationId !== null
        ? (editingPkg.destinationId._id || editingPkg.destinationId.id)
        : (editingPkg?.destinationId || undefined);

      const imagesArray = form.imageUrl.trim()
        ? [form.imageUrl.trim()]
        : (editingPkg?.images && editingPkg.images.length > 0
            ? editingPkg.images
            : ['/images/tours/ujjain_mahakal_jyotirlinga_temple.png']);

      const payload = {
        ...(editingPkg || {}),
        ...form,
        destinationId: destId,
        inclusions: typeof form.inclusions === 'string' ? form.inclusions.split(',').map(s => s.trim()) : form.inclusions,
        images: imagesArray,
        image: imagesArray[0],
        itineraries: editingPkg?.itineraries || [{ dayNumber: 1, title: 'Day 1 Sacred Journey', description: 'Sightseeing and holy temple darshan.' }],
        batchDates: editingPkg?.batchDates !== undefined ? editingPkg.batchDates : [],
      };

      if (editingPkg) {
        const pkgId = editingPkg._id || editingPkg.id || editingPkg.slug;
        await updatePackage(pkgId, payload);
      } else {
        await createPackage(payload);
      }
      setIsCreateOpen(false);
      resetForm();
      load();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeletePackage = async (id: string, title?: string) => {
    if (!confirm(`Are you sure you want to delete "${title || 'this tour package'}"? This action cannot be undone.`)) return;
    try {
      await deletePackage(id);
      load();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ─── BATCH DATES MANAGEMENT HANDLERS ──────────────────────────────
  const handleOpenManageBatches = (pkg: any) => {
    setActiveBatchPkg(pkg);
    let loadedBatches: any[] = [];
    if (Array.isArray(pkg.batchDates) && pkg.batchDates.length > 0) {
      loadedBatches = pkg.batchDates;
    } else {
      try {
        const stored = localStorage.getItem('aarambha_package_batches_' + (pkg.slug || pkg._id || pkg.id));
        if (stored !== null) loadedBatches = JSON.parse(stored);
      } catch (_e) {}
    }
    setPkgBatches(loadedBatches);
    setBatchModalOpen(true);
  };

  const handleAddBatchDate = (e: React.FormEvent) => {
    e.preventDefault();
    const startDateObj = new Date(newBatchStart);
    const endDateObj = new Date(newBatchEnd);

    const startFormatted = startDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const endFormatted = endDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newBatch = {
      id: 'batch-' + Date.now(),
      month: newBatchMonth,
      label: `${startFormatted} – ${endFormatted}`,
      tag: newBatchTag,
      startDate: newBatchStart,
      endDate: newBatchEnd,
      status: newBatchStatus,
    };

    setPkgBatches(prev => [...prev, newBatch]);
  };

  const handleDeleteBatchDate = (batchId: string) => {
    setPkgBatches(prev => prev.filter(b => b.id !== batchId));
  };

  const handleToggleBatchStatus = (batchId: string) => {
    setPkgBatches(prev => prev.map(b => {
      if (b.id === batchId) {
        const nextStatus = b.status === 'available' ? 'full' : 'available';
        return { ...b, status: nextStatus };
      }
      return b;
    }));
  };

  const handleSaveAllBatches = async () => {
    if (!activeBatchPkg) return;
    try {
      const pkgId = activeBatchPkg._id || activeBatchPkg.id || activeBatchPkg.slug;
      const updatedPayload = {
        batchDates: pkgBatches,
      };

      // Persist to Express API backend
      await updatePackage(pkgId, updatedPayload);

      // Persist to LocalStorage for instant live customer site sync
      try {
        if (activeBatchPkg.slug) {
          localStorage.setItem('aarambha_package_batches_' + activeBatchPkg.slug, JSON.stringify(pkgBatches));
        }
        if (activeBatchPkg.id) {
          localStorage.setItem('aarambha_package_batches_' + activeBatchPkg.id, JSON.stringify(pkgBatches));
        }
        if (activeBatchPkg._id) {
          localStorage.setItem('aarambha_package_batches_' + activeBatchPkg._id, JSON.stringify(pkgBatches));
        }
      } catch (_e) {}

      setBatchModalOpen(false);
      load();
    } catch (err: any) {
      alert('Error saving batch dates: ' + err.message);
    }
  };

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter(pkg => {
      // Search matching
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        pkg.title?.toLowerCase().includes(q) ||
        pkg.slug?.toLowerCase().includes(q) ||
        pkg.description?.toLowerCase().includes(q)
      );

      // Batch filter matching
      const count = getBatchCount(pkg);
      let matchesBatch = true;
      if (batchFilter === 'with_batches') matchesBatch = count > 0;
      if (batchFilter === 'no_batches') matchesBatch = count === 0;

      return matchesSearch && matchesBatch;
    });
  }, [packages, searchQuery, batchFilter, getBatchCount]);

  // Overall totals
  const totalBatches = useMemo(() => {
    return packages.reduce((acc, p) => acc + getBatchCount(p), 0);
  }, [packages, getBatchCount]);

  if (loading) return <Loader />;

  const monthsList = Array.from(new Set(pkgBatches.map(b => b.month)));
  const filteredBatches = activeMonthFilter === 'All' ? pkgBatches : pkgBatches.filter(b => b.month === activeMonthFilter);

  return (
    <div className="space-y-6 select-none font-sans">
      
      {/* ─── CLEAN, MINIMAL HEADER ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-[#101F40] tracking-tight">
              Tour Packages
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#EDF3FF] text-[#3569F6] border border-[#D3E2FE]">
              {packages.length} Packages
            </span>
            <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E7F7F2] text-[#12A879] border border-[#BDEBDC]">
              {totalBatches} Scheduled Batches
            </span>
          </div>
          <p className="text-xs text-[#77839A] mt-1">
            Manage pilgrimage itineraries, seasonal pricing, and departure batch dates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={load}
            className="p-2.5 sm:px-3.5 sm:py-2 rounded-xl border border-[#E8ECF4] bg-white text-[#17233D] hover:bg-[#F5F7FC] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Refresh Packages"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#77839A]" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#101F40] hover:bg-[#1C315A] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#3569F6]" />
            <span>Add Tour Package</span>
          </button>
        </div>
      </div>

      {/* ─── SEARCH & FILTER TOOLBAR ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E8ECF4] p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Instant Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#77839A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tours by name, Jyotirlinga, destination..."
            className="w-full pl-9 pr-8 py-2 bg-[#F5F7FC] border border-transparent focus:border-[#3569F6] focus:bg-white rounded-xl text-xs text-[#17233D] placeholder-[#77839A] outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#77839A] hover:text-[#17233D]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter Tabs & View Mode Switcher */}
        <div className="flex items-center gap-2 shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 bg-[#F5F7FC] p-1 rounded-xl border border-[#E8ECF4]">
            <button
              onClick={() => setBatchFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                batchFilter === 'all'
                  ? 'bg-white text-[#101F40] shadow-2xs'
                  : 'text-[#77839A] hover:text-[#17233D]'
              }`}
            >
              All ({packages.length})
            </button>
            <button
              onClick={() => setBatchFilter('with_batches')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                batchFilter === 'with_batches'
                  ? 'bg-white text-[#12A879] shadow-2xs'
                  : 'text-[#77839A] hover:text-[#17233D]'
              }`}
            >
              With Batches
            </button>
            <button
              onClick={() => setBatchFilter('no_batches')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                batchFilter === 'no_batches'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'text-[#77839A] hover:text-[#17233D]'
              }`}
            >
              Needs Dates
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#F5F7FC] p-1 rounded-xl border border-[#E8ECF4]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-[#101F40] shadow-2xs' : 'text-[#77839A] hover:text-[#17233D]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-[#101F40] shadow-2xs' : 'text-[#77839A] hover:text-[#17233D]'
              }`}
              title="Compact Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── VIEW 1: CLEAN MINIMAL GRID OF CARDS ──────────────────────────── */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredPackages.map((pkg: any) => {
            const dateCount = getBatchCount(pkg);
            const coverImage = Array.isArray(pkg.images) && pkg.images.length > 0
              ? pkg.images[0]
              : (typeof pkg.image === 'string' ? pkg.image : undefined);

            return (
              <div
                key={pkg._id || pkg.id || pkg.slug}
                className="bg-white rounded-2xl border border-[#E8ECF4] hover:border-[#C7D9FE] shadow-2xs hover:shadow-card-hover transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top: Image & Header Info */}
                <div className="p-4 sm:p-5 space-y-3.5">
                  <div className="flex items-start gap-3">
                    {/* Non-flickering Square Image Thumbnail */}
                    <PackageThumbnail
                      title={pkg.title}
                      image={coverImage}
                      slug={pkg.slug}
                    />

                    {/* Duration & Status Badges */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-[#EDF3FF] text-[#3569F6] border border-[#D3E2FE]">
                          {pkg.durationDays || pkg.duration_days || 1}D / {pkg.durationNights || pkg.duration_nights || 0}N
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(pkg)}
                            title="Edit Tour Package"
                            className="p-1.5 text-[#77839A] hover:text-[#3569F6] hover:bg-[#EDF3FF] rounded-lg transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePackage(pkg._id || pkg.id, pkg.title)}
                            title="Delete Tour Package"
                            className="p-1.5 text-[#77839A] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => handleOpenEdit(pkg)}
                        className="font-bold text-[#101F40] text-sm leading-snug line-clamp-2 mt-1.5 cursor-pointer hover:text-[#3569F6] transition-colors"
                        title={pkg.title}
                      >
                        {pkg.title}
                      </h3>
                    </div>
                  </div>

                  {/* Pricing Line */}
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-[#77839A] uppercase tracking-wider font-semibold block">Total Package</span>
                      <span className="text-base font-black text-[#101F40]">
                        {formatCurrency(pkg.basePrice || pkg.base_price || 0)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#77839A] uppercase tracking-wider font-semibold block">Advance Deposit</span>
                      <span className="text-xs font-bold text-[#12A879]">
                        ₹{Number(pkg.depositPrice || pkg.deposit_price || 500).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Departure Batches & Quick Actions */}
                <div className="bg-[#FAFBFD] border-t border-[#E8ECF4] px-4 py-3 flex items-center justify-between gap-2">
                  {/* Batch Status Pill */}
                  <button
                    onClick={() => handleOpenManageBatches(pkg)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      dateCount > 0
                        ? 'bg-[#E7F7F2] text-[#12A879] border border-[#BDEBDC] hover:bg-[#d8f4ea]'
                        : 'bg-[#FFF8F5] text-amber-800 border border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{dateCount > 0 ? `${dateCount} Batches Scheduled` : '+ Add Departure Dates'}</span>
                  </button>

                  {/* Preview on live customer site */}
                  <a
                    href={`https://www.aarambhatravels.in/tours-travels/${pkg.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-[#77839A] hover:text-[#101F40] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#E8ECF4]"
                    title="View on Customer Website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ─── VIEW 2: COMPACT CLEAN TABLE VIEW ────────────────────────────── */
        <div className="bg-white rounded-2xl border border-[#E8ECF4] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAFBFD] text-[#77839A] border-b border-[#E8ECF4] text-[11px] uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Tour Package</th>
                  <th className="py-3 px-4 text-center">Duration</th>
                  <th className="py-3 px-4">Total Price</th>
                  <th className="py-3 px-4">Deposit</th>
                  <th className="py-3 px-4 text-center">Departure Batches</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8ECF4]">
                {filteredPackages.map((pkg: any) => {
                  const dateCount = getBatchCount(pkg);
                  const coverImage = Array.isArray(pkg.images) && pkg.images.length > 0
                    ? pkg.images[0]
                    : (typeof pkg.image === 'string' ? pkg.image : undefined);

                  return (
                    <tr key={pkg._id || pkg.id || pkg.slug} className="hover:bg-[#FAFBFD] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <TablePackageThumbnail
                            title={pkg.title}
                            image={coverImage}
                            slug={pkg.slug}
                          />
                          <div>
                            <span className="font-bold text-[#101F40] block">{pkg.title}</span>
                            <span className="text-[10px] text-[#77839A] font-mono">{pkg.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-[#EDF3FF] text-[#3569F6]">
                          {pkg.durationDays || pkg.duration_days || 1}D / {pkg.durationNights || pkg.duration_nights || 0}N
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-[#101F40]">
                        {formatCurrency(pkg.basePrice || pkg.base_price || 0)}
                      </td>

                      <td className="py-3 px-4 font-bold text-[#12A879]">
                        ₹{Number(pkg.depositPrice || pkg.deposit_price || 500).toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleOpenManageBatches(pkg)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            dateCount > 0
                              ? 'bg-[#E7F7F2] text-[#12A879] hover:bg-[#d5f3e9]'
                              : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          <span>{dateCount} Dates</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(pkg)}
                            className="p-1.5 text-[#77839A] hover:text-[#3569F6] hover:bg-[#EDF3FF] rounded-lg transition-colors cursor-pointer"
                            title="Edit Package"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`https://www.aarambhatravels.in/tours-travels/${pkg.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-[#77839A] hover:text-[#101F40] hover:bg-gray-100 rounded-lg transition-colors"
                            title="Preview on Website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDeletePackage(pkg._id || pkg.id, pkg.title)}
                            className="p-1.5 text-[#77839A] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Package"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredPackages.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E8ECF4] p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#EDF3FF] text-[#3569F6] flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#101F40] text-sm">No Tour Packages Found</h3>
          <p className="text-xs text-[#77839A] max-w-sm mx-auto">
            {searchQuery
              ? `No packages match "${searchQuery}". Try clearing your search.`
              : 'No packages configured yet. Click the button below to add your first tour package.'}
          </p>
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-[#F5F7FC] hover:bg-[#E8ECF4] text-[#17233D] rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          ) : (
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-[#101F40] hover:bg-[#1C315A] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              + Create Tour Package
            </button>
          )}
        </div>
      )}

      {/* ─── MODAL 1: CREATE / EDIT TOUR PACKAGE (STREAMLINED & ELEGANT) ─── */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => { setIsCreateOpen(false); resetForm(); }}
        title={editingPkg ? "Edit Tour Package" : "Create New Tour Package"}
      >
        <form onSubmit={handleSavePackage} className="space-y-4 text-xs select-none">
          {/* Title */}
          <div>
            <label className="block font-bold text-[#101F40] mb-1">Package Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm({
                ...form,
                title: e.target.value,
                slug: form.slug || e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '')
              })}
              className="w-full px-3.5 py-2.5 bg-[#F5F7FC] border border-[#E8ECF4] rounded-xl text-[#17233D] placeholder-[#77839A] focus:outline-none focus:border-[#3569F6] focus:bg-white transition-all font-medium"
              placeholder="e.g. Mumbai to Ujjain Mahakal | Omkareshwar Jyotirlinga"
            />
          </div>

          {/* URL Slug */}
          <div>
            <label className="block font-bold text-[#101F40] mb-1">Website URL Slug *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={e => setForm({ ...form, slug: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#F5F7FC] border border-[#E8ECF4] rounded-xl font-mono text-xs text-[#17233D] focus:outline-none focus:border-[#3569F6]"
              placeholder="mumbai-ujjain-mahakal"
            />
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block font-bold text-[#101F40] mb-1">Cover Image Path / URL</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#F5F7FC] border border-[#E8ECF4] rounded-xl text-[#17233D] placeholder-[#77839A] focus:outline-none focus:border-[#3569F6] focus:bg-white"
              placeholder="/images/tours/ujjain_mahakal_jyotirlinga_temple.png or https://..."
            />
          </div>

          {/* Duration Days & Nights */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#101F40] mb-1">Duration Days *</label>
              <input
                type="number"
                required
                min={1}
                value={form.durationDays}
                onChange={e => setForm({ ...form, durationDays: +e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F5F7FC] border border-[#E8ECF4] rounded-xl text-[#17233D] focus:outline-none focus:border-[#3569F6]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#101F40] mb-1">Duration Nights *</label>
              <input
                type="number"
                required
                min={0}
                value={form.durationNights}
                onChange={e => setForm({ ...form, durationNights: +e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F5F7FC] border border-[#E8ECF4] rounded-xl text-[#17233D] focus:outline-none focus:border-[#3569F6]"
              />
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#101F40] mb-1">Total Price per Pax (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={form.basePrice}
                onChange={e => setForm({ ...form, basePrice: +e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F5F7FC] border border-[#E8ECF4] rounded-xl text-[#17233D] font-bold focus:outline-none focus:border-[#3569F6]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#101F40] mb-1">Online Deposit per Pax (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={form.depositPrice}
                onChange={e => setForm({ ...form, depositPrice: +e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F5F7FC] border border-[#E8ECF4] rounded-xl text-[#12A879] font-bold focus:outline-none focus:border-[#3569F6]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-[#101F40] mb-1">Tour Description *</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#F5F7FC] border border-[#E8ECF4] rounded-xl text-[#17233D] placeholder-[#77839A] focus:outline-none focus:border-[#3569F6] focus:bg-white"
              placeholder="Provide an overview of the spiritual journey, darshan points, and itinerary highlights..."
            />
          </div>

          {/* Inclusions */}
          <div>
            <label className="block font-bold text-[#101F40] mb-1">Inclusions (Comma separated)</label>
            <input
              type="text"
              value={form.inclusions}
              onChange={e => setForm({ ...form, inclusions: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#F5F7FC] border border-[#E8ECF4] rounded-xl text-[#17233D]"
              placeholder="AC Sleeper Coach, 3★ Hotel Stay, Pure Veg Meals, Sightseeing"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#101F40] hover:bg-[#1C315A] text-white font-bold rounded-xl text-xs shadow-xs transition-all mt-2 cursor-pointer active:scale-95"
          >
            {editingPkg ? "Save Changes" : "Create Tour Package"}
          </button>
        </form>
      </Modal>

      {/* ─── MODAL 2: BATCH DATES CONTROLLER (CLEAN & MINIMAL 2-COLUMN) ──── */}
      {batchModalOpen && activeBatchPkg && (
        <Modal
          isOpen={batchModalOpen}
          onClose={() => setBatchModalOpen(false)}
          title={`Schedule Departure Batches — ${activeBatchPkg.title}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-5 text-xs select-none">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* LEFT: Add Batch Date Form */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-[#FAFBFD] border border-[#E8ECF4] rounded-2xl p-4 space-y-3">
                  <h4 className="font-extrabold text-[#101F40] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-[#3569F6]" /> Add Departure Batch
                  </h4>

                  {/* Form */}
                  <form onSubmit={handleAddBatchDate} className="space-y-3">
                    <div className="space-y-1">
                      <label className="block font-bold text-[#17233D] text-[11px]">Departure Month</label>
                      <select
                        value={newBatchMonth}
                        onChange={e => setNewBatchMonth(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E8ECF4] rounded-xl font-bold text-[#101F40] focus:outline-none focus:border-[#3569F6]"
                      >
                        {['August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June', 'July'].map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-[#17233D] text-[11px]">Batch Tag / Label</label>
                      <input
                        type="text"
                        required
                        value={newBatchTag}
                        onChange={e => setNewBatchTag(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E8ECF4] rounded-xl text-[#101F40] focus:outline-none focus:border-[#3569F6]"
                        placeholder="e.g. Special Weekend Batch"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="block font-bold text-[#17233D] text-[11px]">Start Date</label>
                        <input
                          type="date"
                          required
                          value={newBatchStart}
                          onChange={e => setNewBatchStart(e.target.value)}
                          className="w-full px-2.5 py-2 bg-white border border-[#E8ECF4] rounded-xl text-[#101F40] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-bold text-[#17233D] text-[11px]">End Date</label>
                        <input
                          type="date"
                          required
                          value={newBatchEnd}
                          onChange={e => setNewBatchEnd(e.target.value)}
                          className="w-full px-2.5 py-2 bg-white border border-[#E8ECF4] rounded-xl text-[#101F40] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-[#17233D] text-[11px]">Status</label>
                      <select
                        value={newBatchStatus}
                        onChange={e => setNewBatchStatus(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-[#E8ECF4] rounded-xl font-bold text-[#101F40] focus:outline-none"
                      >
                        <option value="available">🟢 Available for Booking</option>
                        <option value="full">🔴 Sold Out / Full</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#101F40] hover:bg-[#1C315A] text-white font-bold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#3569F6]" /> Add to List
                    </button>
                  </form>
                </div>
              </div>

              {/* RIGHT: Active Batches List */}
              <div className="lg:col-span-7 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#E8ECF4] pb-2.5">
                    <span className="font-extrabold text-[#101F40] text-xs">
                      Scheduled Dates ({pkgBatches.length})
                    </span>

                    {/* Month Filter Tabs */}
                    {monthsList.length > 1 && (
                      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        <button
                          onClick={() => setActiveMonthFilter('All')}
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            activeMonthFilter === 'All' ? 'bg-[#101F40] text-white' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          All
                        </button>
                        {monthsList.map(m => (
                          <button
                            key={m}
                            onClick={() => setActiveMonthFilter(m)}
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              activeMonthFilter === m ? 'bg-[#3569F6] text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Batch Cards */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 pt-2">
                    {filteredBatches.map((batch: any, index: number) => {
                      const isFull = batch.status === 'full' || batch.status === 'disabled';
                      return (
                        <div
                          key={batch.id || index}
                          className="p-3 rounded-xl border border-[#E8ECF4] bg-white hover:border-[#CBD5E1] transition-all flex items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-[#101F40] text-xs">
                                {batch.label}
                              </span>
                              <span
                                className={`px-2 py-0.2 rounded-md text-[9.5px] font-bold ${
                                  isFull ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                                }`}
                              >
                                {isFull ? 'Sold Out' : 'Available'}
                              </span>
                            </div>
                            <p className="text-[10.5px] text-[#77839A]">
                              {batch.month} • {batch.tag}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleBatchStatus(batch.id)}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[10.5px] transition-colors cursor-pointer ${
                                isFull
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                              }`}
                            >
                              {isFull ? 'Open' : 'Mark Full'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBatchDate(batch.id)}
                              className="p-1.5 text-[#77839A] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Date"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {filteredBatches.length === 0 && (
                      <div className="p-8 text-center text-[#77839A] border border-dashed border-[#E8ECF4] rounded-xl bg-gray-50/50">
                        No departure dates configured. Use the form on the left to add batches.
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Save Button */}
                <div className="pt-3 border-t border-[#E8ECF4] flex items-center justify-between gap-3">
                  <span className="text-[11px] text-[#77839A]">
                    {pkgBatches.length} Total Departure Dates
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBatchModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-[#E8ECF4] text-[#17233D] font-bold hover:bg-gray-50 transition-all text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleSaveAllBatches}
                      className="px-5 py-2 rounded-xl bg-[#12A879] hover:bg-[#0E8A63] text-white font-bold shadow-xs transition-all flex items-center gap-1.5 text-xs cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Save &amp; Sync to Website</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </Modal>
      )}

    </div>
  );
}
