import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, Pencil, Trash2, Calendar, CheckCircle2, AlertCircle, Clock, Tag, X, Users } from 'lucide-react';
import { getToursPackages, getToursDestinations, createPackage, updatePackage, deletePackage } from '@/api/tours.api';
import { Modal } from '@/components/common/Modal';
import { Loader } from '@/components/common/Loader';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAutoRefresh } from '@/hooks/useRealtimeSync';

const DEFAULT_BATCHES: any[] = [];

export default function ToursView() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<any | null>(null);

  // Batch Dates Manager Modal State
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [activeBatchPkg, setActiveBatchPkg] = useState<any | null>(null);
  const [pkgBatches, setPkgBatches] = useState<any[]>([]);
  const [activeMonthFilter, setActiveMonthFilter] = useState('All');

  // New Batch Form State
  const [newBatchMonth, setNewBatchMonth] = useState('August');
  const [newBatchTag, setNewBatchTag] = useState('Batch Special');
  const [newBatchStart, setNewBatchStart] = useState('2026-08-05');
  const [newBatchEnd, setNewBatchEnd] = useState('2026-08-11');
  const [newBatchStatus, setNewBatchStatus] = useState<'available' | 'full'>('available');

  const [form, setForm] = useState({
    title: '', slug: '', description: '', durationDays: 5, durationNights: 4, basePrice: 15000, depositPrice: 2500, inclusions: 'Hotel, Meals, Transfers'
  });

  const load = useCallback(() => {
    Promise.all([
      getToursPackages().then(d => setPackages(d)),
      getToursDestinations().then(d => setDestinations(d)),
    ]).then(() => setLoading(false));
  }, []);

  useAutoRefresh(load, ['TOURS_UPDATED'], 6000);

  const resetForm = () => {
    setForm({ title: '', slug: '', description: '', durationDays: 5, durationNights: 4, basePrice: 15000, depositPrice: 2500, inclusions: 'Hotel, Meals, Transfers' });
    setEditingPkg(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (pkg: any) => {
    setEditingPkg(pkg);
    setForm({
      title: pkg.title || '',
      slug: pkg.slug || '',
      description: pkg.description || '',
      durationDays: pkg.durationDays || pkg.duration_days || 1,
      durationNights: pkg.durationNights || pkg.duration_nights || 0,
      basePrice: pkg.basePrice || pkg.base_price || 0,
      depositPrice: pkg.depositPrice || pkg.deposit_price || 500,
      inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join(', ') : (pkg.inclusions || 'Hotel, Meals'),
    });
    setIsCreateOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...(editingPkg || {}),
        ...form,
        inclusions: typeof form.inclusions === 'string' ? form.inclusions.split(',').map(s => s.trim()) : form.inclusions,
        images: editingPkg?.images || ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop'],
        itineraries: editingPkg?.itineraries || [{ dayNumber: 1, title: 'Day 1 Exploration', description: 'Sightseeing and city tour.' }],
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
    } catch (err: any) { alert(err.message); }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour package?')) return;
    try {
      await deletePackage(id);
      load();
    } catch (err: any) { alert(err.message); }
  };

  // ─── BATCH DATES MANAGEMENT HANDLERS ──────────────────────────────
  const handleOpenManageBatches = (pkg: any) => {
    setActiveBatchPkg(pkg);
    let loadedBatches: any[] = [];
    if (pkg.batchDates !== undefined && Array.isArray(pkg.batchDates)) {
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
        ...activeBatchPkg,
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

      alert(`Successfully saved ${pkgBatches.length} departure batch dates for "${activeBatchPkg.title}"!`);
      setBatchModalOpen(false);
      load();
    } catch (err: any) {
      alert('Error saving batch dates: ' + err.message);
    }
  };

  if (loading) return <Loader />;

  const monthsList = Array.from(new Set(pkgBatches.map(b => b.month)));
  const filteredBatches = activeMonthFilter === 'All' ? pkgBatches : pkgBatches.filter(b => b.month === activeMonthFilter);

  return (
    <div className="space-y-6 select-none">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#111827] tracking-tight">
            Tour Packages ({packages.length})
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Manage custom itineraries, pricing, departure batch dates, and features.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="p-2 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-black hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-[#111827] hover:bg-black text-white rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Tour Package
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {packages.map((pkg: any, i: number) => {
          const dateCount = Array.isArray(pkg.batchDates) ? pkg.batchDates.length : 0;
          return (
            <div key={i} className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-aether-card flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-[#111827] text-base leading-snug">{pkg.title}</h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      title="Edit Package"
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg._id || pkg.id)}
                      title="Delete Package"
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-indigo-600 font-semibold mt-1 mb-2">{pkg.durationDays || pkg.duration_days}D / {pkg.durationNights || pkg.duration_nights}N • <span className="font-mono text-gray-400">{pkg.slug}</span></p>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{pkg.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-medium block">Total Price</span>
                    <span className="text-base font-extrabold text-[#111827]">{formatCurrency(pkg.basePrice || pkg.base_price || 0)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-medium block">Required Deposit</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">₹{pkg.depositPrice || pkg.deposit_price || 500}</span>
                  </div>
                </div>

                {/* Manage Departure Dates & Calendar Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenManageBatches(pkg)}
                    className="py-2 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm border border-indigo-100"
                  >
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Batches ({dateCount})</span>
                  </button>

                  <button
                    onClick={() => navigate('/calendar')}
                    className="py-2 px-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Users className="w-3.5 h-3.5 text-red-400" />
                    <span>Members List</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {packages.length === 0 && (
          <div className="bg-white rounded-[24px] border border-gray-100 p-12 text-center text-gray-400 col-span-3">
            No tour packages found. Click "+ Add Tour Package" above to create one.
          </div>
        )}
      </div>

      {/* ─── MODAL 1: CREATE / EDIT TOUR PACKAGE ─────────────────────────── */}
      <Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); resetForm(); }} title={editingPkg ? "Edit Tour Package" : "Create New Tour Package"}>
        <form onSubmit={handleSavePackage} className="space-y-4 text-xs select-none">
          <div>
            <label className="block font-bold text-[#111827] mb-1">Package Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '') })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black transition-all"
              placeholder="Enter tour package title"
            />
          </div>

          <div>
            <label className="block font-bold text-[#111827] mb-1">URL Slug</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={e => setForm({ ...form, slug: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl font-mono text-xs text-gray-700 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#111827] mb-1">Duration Days</label>
              <input
                type="number"
                required
                min={1}
                value={form.durationDays}
                onChange={e => setForm({ ...form, durationDays: +e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-[#111827] mb-1">Duration Nights</label>
              <input
                type="number"
                required
                min={0}
                value={form.durationNights}
                onChange={e => setForm({ ...form, durationNights: +e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#111827] mb-1">Total Price (₹)</label>
              <input
                type="number"
                required
                value={form.basePrice}
                onChange={e => setForm({ ...form, basePrice: +e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-[#111827] mb-1">Online Deposit (₹)</label>
              <input
                type="number"
                required
                value={form.depositPrice}
                onChange={e => setForm({ ...form, depositPrice: +e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#111827] mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-black"
              placeholder="Enter tour package description"
            />
          </div>

          <div>
            <label className="block font-bold text-[#111827] mb-1">Inclusions (comma separated)</label>
            <input
              type="text"
              value={form.inclusions}
              onChange={e => setForm({ ...form, inclusions: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              placeholder="Hotel, Meals, Sightseeing, Transfers"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#111827] hover:bg-black text-white font-bold rounded-xl text-xs shadow-md transition-all mt-2"
          >
            {editingPkg ? "Update Tour Package" : "Create Tour Package"}
          </button>
        </form>
      </Modal>

      {/* ─── MODAL 2: PACKAGE BATCH DATES MANAGER (ULTRA-PREMIUM 2-COLUMN DASHBOARD) ─── */}
      {batchModalOpen && activeBatchPkg && (
        <Modal
          isOpen={batchModalOpen}
          onClose={() => setBatchModalOpen(false)}
          title={`Batch Dates Control Panel — ${activeBatchPkg.title}`}
          maxWidth="max-w-5xl"
        >
          <div className="space-y-6 text-xs select-none">
            
            {/* 2-Column Split Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN: Add New Batch & Quick Presets */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Header Banner */}
                <div className="bg-[#09090b] text-white p-5 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-extrabold text-[10px] uppercase tracking-widest">
                    <Calendar className="w-4 h-4 text-amber-400" /> Fixed Departure Manager
                  </div>
                  <h4 className="font-syne text-lg font-black text-white leading-tight">
                    Add & Change Dates
                  </h4>
                  <p className="text-[11px] text-gray-300 leading-relaxed font-normal">
                    Create new departure batches or modify dates. Updates dynamically reflect live in the customer booking engine.
                  </p>
                </div>

                {/* Quick Date Presets */}
                <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 space-y-2.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-900 block font-syne">
                    ⚡ Quick Date Presets
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNewBatchTag('Batch #1 (Early ' + newBatchMonth.slice(0,3) + ')');
                        setNewBatchStart('2026-08-04');
                        setNewBatchEnd('2026-08-10');
                      }}
                      className="p-2 rounded-xl bg-white border border-indigo-200 text-indigo-800 hover:bg-indigo-600 hover:text-white font-bold text-[10px] transition-all shadow-xs text-center"
                    >
                      Early Month<br /><span className="text-[9px] opacity-75">(04 - 10)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewBatchTag('Batch #2 (Mid ' + newBatchMonth.slice(0,3) + ')');
                        setNewBatchStart('2026-08-14');
                        setNewBatchEnd('2026-08-20');
                      }}
                      className="p-2 rounded-xl bg-white border border-indigo-200 text-indigo-800 hover:bg-indigo-600 hover:text-white font-bold text-[10px] transition-all shadow-xs text-center"
                    >
                      Mid Month<br /><span className="text-[9px] opacity-75">(14 - 20)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewBatchTag('Batch #3 (Late ' + newBatchMonth.slice(0,3) + ')');
                        setNewBatchStart('2026-08-24');
                        setNewBatchEnd('2026-08-30');
                      }}
                      className="p-2 rounded-xl bg-white border border-indigo-200 text-indigo-800 hover:bg-indigo-600 hover:text-white font-bold text-[10px] transition-all shadow-xs text-center"
                    >
                      Late Month<br /><span className="text-[9px] opacity-75">(24 - 30)</span>
                    </button>
                  </div>
                </div>

                {/* Form to Add Custom Batch */}
                <form onSubmit={handleAddBatchDate} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3.5 shadow-sm">
                  <span className="font-extrabold text-gray-900 block text-xs uppercase tracking-wider font-syne">
                    + Custom Batch Details
                  </span>

                  <div className="space-y-1">
                    <label className="block font-bold text-gray-700 text-[11px]">Month Name</label>
                    <select
                      value={newBatchMonth}
                      onChange={e => setNewBatchMonth(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:outline-none focus:border-indigo-600"
                    >
                      {['August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-gray-700 text-[11px]">Batch Tag / Label</label>
                    <input
                      type="text"
                      required
                      value={newBatchTag}
                      onChange={e => setNewBatchTag(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:outline-none focus:border-indigo-600"
                      placeholder="e.g. Monsoon Weekend Special"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block font-bold text-gray-700 text-[11px]">Start Date</label>
                      <input
                        type="date"
                        required
                        value={newBatchStart}
                        onChange={e => setNewBatchStart(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-gray-700 text-[11px]">End Date</label>
                      <input
                        type="date"
                        required
                        value={newBatchEnd}
                        onChange={e => setNewBatchEnd(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-gray-700 text-[11px]">Availability Status</label>
                    <select
                      value={newBatchStatus}
                      onChange={e => setNewBatchStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:outline-none"
                    >
                      <option value="available">🟢 Available for Booking</option>
                      <option value="full">🔴 Sold Out / Full</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#111827] hover:bg-indigo-600 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
                  >
                    <Plus className="w-4 h-4" /> Add Departure Batch
                  </button>
                </form>

              </div>

              {/* RIGHT COLUMN: Configured Batches Timeline */}
              <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                
                <div className="space-y-4">
                  
                  {/* Filter Pills */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <span className="font-extrabold text-gray-900 text-sm font-syne">
                      Configured Dates ({pkgBatches.length})
                    </span>

                    <div className="flex items-center gap-1.5 overflow-x-auto">
                      <button
                        onClick={() => setActiveMonthFilter('All')}
                        className={`px-3 py-1 rounded-full font-extrabold text-[11px] transition-all whitespace-nowrap ${
                          activeMonthFilter === 'All' ? 'bg-[#111827] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        All ({pkgBatches.length})
                      </button>

                      {monthsList.map(m => (
                        <button
                          key={m}
                          onClick={() => setActiveMonthFilter(m)}
                          className={`px-3 py-1 rounded-full font-extrabold text-[11px] transition-all whitespace-nowrap ${
                            activeMonthFilter === m ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {m} ({pkgBatches.filter(b => b.month === m).length})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Batch Cards List */}
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {filteredBatches.map((batch: any, index: number) => {
                      const isFull = batch.status === 'full' || batch.status === 'disabled';
                      return (
                        <div
                          key={batch.id || index}
                          className="p-4 rounded-2xl border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-syne font-black text-sm text-gray-900 tracking-tight">
                                📅 {batch.label}
                              </span>
                              
                              <button
                                type="button"
                                onClick={() => handleToggleBatchStatus(batch.id)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                  isFull
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200'
                                }`}
                              >
                                {isFull ? '🔴 Sold Out' : '🟢 Available'}
                              </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 font-semibold">
                              <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md font-bold">{batch.month}</span>
                              <span>• {batch.tag}</span>
                              <span className="font-mono text-gray-400">({batch.startDate} → {batch.endDate})</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                            <button
                              type="button"
                              onClick={() => handleToggleBatchStatus(batch.id)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                                isFull
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                              }`}
                            >
                              {isFull ? 'Mark Available' : 'Mark Sold Out'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteBatchDate(batch.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                              title="Delete Batch Date"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {filteredBatches.length === 0 && (
                      <div className="p-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                        No departure dates configured for this filter. Use the Quick Date Presets or form on the left to add dates.
                      </div>
                    )}
                  </div>

                </div>

                {/* Footer Save Action Bar */}
                <div className="pt-4 border-t border-gray-200 flex items-center justify-between gap-3 bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
                  <div>
                    <span className="text-xs font-extrabold text-gray-900 block font-syne">
                      {pkgBatches.length} Total Departure Dates
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {pkgBatches.filter(b => b.status !== 'full' && b.status !== 'disabled').length} Active & Available
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBatchModalOpen(false)}
                      className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all text-xs"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleSaveAllBatches}
                      className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-lg transition-all flex items-center gap-2 text-xs uppercase tracking-wider"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" /> Save Batch Dates
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
