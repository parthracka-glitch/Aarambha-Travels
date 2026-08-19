import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import { getFleetVehicles, getFleetCategories, createVehicle, updateVehicle, deleteVehicle } from '@/api/fleet.api';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { Loader } from '@/components/common/Loader';
import { formatCurrency } from '@/utils/formatCurrency';

export default function FleetView() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVeh, setEditingVeh] = useState<any | null>(null);

  const [form, setForm] = useState({
    name: '', regNumber: '', vehicleType: 'car', dailyRate: 2500, securityDeposit: 3000
  });

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      getFleetVehicles().then(d => setVehicles(d)),
      getFleetCategories().then(d => setCategories(d)),
    ]).then(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setForm({ name: '', regNumber: '', vehicleType: 'car', dailyRate: 2500, securityDeposit: 3000 });
    setEditingVeh(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: any) => {
    setEditingVeh(v);
    setForm({
      name: v.name || '',
      regNumber: v.regNumber || v.reg_number || '',
      vehicleType: v.vehicleType || v.vehicle_type || 'car',
      dailyRate: v.dailyRate || v.daily_rate || 2500,
      securityDeposit: v.securityDeposit || v.security_deposit || 3000,
    });
    setIsModalOpen(true);
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        images: editingVeh?.images || ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop'],
        specs: editingVeh?.specs || { transmission: 'Manual', seats: 5 }
      };

      if (editingVeh) {
        await updateVehicle(editingVeh._id || editingVeh.id, payload);
      } else {
        await createVehicle(payload);
      }
      setIsModalOpen(false);
      resetForm();
      load();
    } catch (err: any) { alert(err.message); }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle from the fleet?')) return;
    try {
      await deleteVehicle(id);
      load();
    } catch (err: any) { alert(err.message); }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 select-none">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#111827] tracking-tight">
            Fleet Inventory ({vehicles.length} vehicles)
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Manage self-drive cars, bikes, daily rates, and maintenance statuses.</p>
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
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-aether-card">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-left text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-5 py-3.5">Vehicle</th>
              <th className="px-5 py-3.5">Reg No.</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Daily Rate</th>
              <th className="px-5 py-3.5">Deposit</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vehicles.map((v: any, i: number) => (
              <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-5 py-4 font-bold text-[#111827] text-xs">{v.name}</td>
                <td className="px-5 py-4 font-mono text-xs text-gray-600">{v.regNumber || v.reg_number}</td>
                <td className="px-5 py-4">
                  <span className="capitalize px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-[10px]">
                    {v.vehicleType || v.vehicle_type}
                  </span>
                </td>
                <td className="px-5 py-4 font-bold text-[#111827]">{formatCurrency(v.dailyRate || v.daily_rate || 0)}/day</td>
                <td className="px-5 py-4 font-semibold text-gray-700">{formatCurrency(v.securityDeposit || v.security_deposit || 0)}</td>
                <td className="px-5 py-4">
                  <Badge color={v.status === 'Available' ? 'green' : v.status === 'Rented' ? 'amber' : 'red'}>{v.status}</Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(v)}
                      title="Edit Vehicle"
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteVehicle(v._id || v.id)}
                      title="Delete Vehicle"
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No vehicles in fleet. Add one above!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingVeh ? "Edit Fleet Vehicle" : "Add New Fleet Vehicle"}>
        <form onSubmit={handleSaveVehicle} className="space-y-4 text-xs select-none">
          <div>
            <label className="block font-bold text-[#111827] mb-1">Vehicle Name / Model</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:border-black"
              placeholder="Enter vehicle name / model"
            />
          </div>

          <div>
            <label className="block font-bold text-[#111827] mb-1">Registration Number</label>
            <input
              type="text"
              required
              value={form.regNumber}
              onChange={e => setForm({ ...form, regNumber: e.target.value.toUpperCase() })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs uppercase focus:outline-none focus:border-black"
              placeholder="e.g. MH12-AB-1234"
            />
          </div>

          <div>
            <label className="block font-bold text-[#111827] mb-1">Vehicle Type</label>
            <select
              value={form.vehicleType}
              onChange={e => setForm({ ...form, vehicleType: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:outline-none focus:border-black"
            >
              <option value="car">Car (Self-Drive)</option>
              <option value="bike">Bike (Self-Drive)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#111827] mb-1">Daily Rental Rate (₹)</label>
              <input
                type="number"
                required
                value={form.dailyRate}
                onChange={e => setForm({ ...form, dailyRate: +e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-[#111827] mb-1">Security Deposit (₹)</label>
              <input
                type="number"
                required
                value={form.securityDeposit}
                onChange={e => setForm({ ...form, securityDeposit: +e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#111827] hover:bg-black text-white font-bold rounded-xl text-xs shadow-md transition-all mt-2"
          >
            {editingVeh ? "Update Vehicle" : "Save Vehicle to Fleet"}
          </button>
        </form>
      </Modal>

    </div>
  );
}
