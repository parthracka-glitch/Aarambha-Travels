import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Trash2, Plus, Phone, MessageSquare, Mail, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getToursInquiries, deleteToursInquiry, createToursInquiry } from '@/api/tours.api';
import { getFleetInquiries, deleteFleetInquiry, createFleetInquiry } from '@/api/fleet.api';
import { Badge } from '@/components/common/Badge';
import { Loader } from '@/components/common/Loader';
import { Modal } from '@/components/common/Modal';
import { statusColor } from '@/utils/statusColor';
import { formatDate } from '@/utils/formatDate';
import { useAutoRefresh } from '@/hooks/useRealtimeSync';

export default function InquiriesView() {
  const { activeVertical: vertical } = useAuth();
  const [toursInq, setToursInq] = useState<any[]>([]);
  const [fleetInq, setFleetInq] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Inquiry Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    type: 'Tours',
    travelDate: '',
    paxCount: 1,
    status: 'New',
    notes: '',
  });

  const load = useCallback(() => {
    const p: Promise<any>[] = [];
    if (vertical !== 'fleet') p.push(getToursInquiries().then(d => setToursInq(d)));
    if (vertical !== 'tours') p.push(getFleetInquiries().then(d => setFleetInq(d)));
    Promise.all(p).then(() => setLoading(false));
  }, [vertical]);

  useAutoRefresh(load, ['INQUIRIES_UPDATED'], 5000);

  const handleDeleteInquiry = async (id: string, isFleet: boolean) => {
    if (!confirm('Are you sure you want to delete this inquiry record?')) return;
    try {
      if (isFleet) {
        await deleteFleetInquiry(id);
      } else {
        await deleteToursInquiry(id);
      }
      load();
    } catch (err: any) { alert(err.message); }
  };

  const handleCreateInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      alert('Please fill in Customer Name, Email, and Phone.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName: formData.customerName,
        customer_name: formData.customerName,
        customerEmail: formData.customerEmail,
        customer_email: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customer_phone: formData.customerPhone,
        travelDate: formData.travelDate,
        paxCount: Number(formData.paxCount) || 1,
        status: formData.status,
        notes: formData.notes,
      };

      if (formData.type === 'Fleet') {
        await createFleetInquiry(payload);
      } else {
        await createToursInquiry(payload);
      }

      setIsModalOpen(false);
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        type: 'Tours',
        travelDate: '',
        paxCount: 1,
        status: 'New',
        notes: '',
      });
      load();
    } catch (err: any) {
      alert(err.message || 'Failed to create inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  const all = [
    ...(vertical !== 'fleet' ? toursInq.map(i => ({ ...i, type: 'Tours' })) : []),
    ...(vertical !== 'tours' ? fleetInq.map(i => ({ ...i, type: 'Fleet' })) : []),
  ].sort((a, b) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime());

  return (
    <div className="space-y-5 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-extrabold text-[#111827] tracking-tight flex items-center gap-2">
            Inquiries & Lead Funnel
            <span className="text-gray-400 font-normal text-base">({all.length})</span>
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Manage customer inquiries with 1-tap call & WhatsApp triggers.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Inquiry
          </button>

          <button
            onClick={load}
            className="p-2 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-black hover:bg-gray-50 text-xs font-semibold flex items-center justify-center shadow-sm transition-all"
            title="Refresh Inquiries"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 📱 MOBILE CARDS VIEW (< 768px) */}
      <div className="md:hidden space-y-3">
        {all.map((inq, i) => {
          const isFleet = inq.type === 'Fleet';
          const name = inq.customerName || inq.customer_name || 'Customer';
          const phone = inq.customerPhone || inq.customer_phone || '';
          const cleanPhone = phone.replace(/[^0-9]/g, '');
          const email = inq.customerEmail || inq.customer_email || '';

          return (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3 relative"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${isFleet ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                      {inq.type}
                    </span>
                    <Badge color={statusColor(inq.status)}>{inq.status}</Badge>
                  </div>
                  <h4 className="font-bold text-sm text-[#111827] mt-1.5">{name}</h4>
                </div>

                <button
                  onClick={() => handleDeleteInquiry(inq._id || inq.id, isFleet)}
                  title="Delete Inquiry"
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                {phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-medium">{phone}</span>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-0.5">
                  <Calendar className="w-3 h-3" />
                  <span>Received {formatDate(inq.createdAt || inq.created_at)}</span>
                </div>
              </div>

              {/* 1-Tap Action Bar on Mobile */}
              <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                {phone && (
                  <>
                    <a
                      href={`tel:${phone}`}
                      className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-blue-200/60"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                    <a
                      href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`}?text=${encodeURIComponent(`Hello ${name}, thank you for contacting Aarambha Tours & Travels regarding your ${inq.type} inquiry.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-emerald-200/60"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {all.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-xs border border-gray-100">
            No customer inquiries found.
          </div>
        )}
      </div>

      {/* 💻 DESKTOP TABLE VIEW (>= 768px) */}
      <div className="hidden md:block bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-aether-card">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-left text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-5 py-3.5">Name</th>
              <th className="px-5 py-3.5">Email</th>
              <th className="px-5 py-3.5">Phone</th>
              <th className="px-5 py-3.5">Vertical</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {all.map((inq, i) => {
              const isFleet = inq.type === 'Fleet';
              const phone = inq.customerPhone || inq.customer_phone || '';
              const cleanPhone = phone.replace(/[^0-9]/g, '');

              return (
                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-5 py-4 font-bold text-[#111827]">{inq.customerName || inq.customer_name}</td>
                  <td className="px-5 py-4 text-gray-600">{inq.customerEmail || inq.customer_email}</td>
                  <td className="px-5 py-4 text-gray-600 font-medium">
                    <div className="flex items-center gap-2">
                      <span>{phone}</span>
                      {phone && (
                        <a
                          href={`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Message on WhatsApp"
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${isFleet ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {inq.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge color={statusColor(inq.status)}>{inq.status}</Badge>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{formatDate(inq.createdAt || inq.created_at)}</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDeleteInquiry(inq._id || inq.id, isFleet)}
                      title="Delete Inquiry"
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {all.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No inquiries found in this view.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── ADD NEW INQUIRY MODAL ──────────────────────────────────── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Customer Inquiry">
        <form onSubmit={handleCreateInquiry} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-gray-700 font-bold mb-1">Customer Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ananya Roy"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Customer Email *</label>
              <input
                type="email"
                required
                placeholder="ananya@example.com"
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Service Vertical</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs font-semibold"
              >
                <option value="Tours">Tours & Packages</option>
                <option value="Fleet">Self-Drive Rentals (Fleet)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Initial Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs font-semibold"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Quoted">Quoted</option>
                <option value="Converted">Converted</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Expected Travel/Rental Date</label>
              <input
                type="date"
                value={formData.travelDate}
                onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Pax / Group Count</label>
              <input
                type="number"
                min="1"
                value={formData.paxCount}
                onChange={(e) => setFormData({ ...formData, paxCount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">Notes / Requirement Details</label>
            <textarea
              rows={3}
              placeholder="e.g. Interested in 5-day Himachal tour package or SUV rental..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-[#111827] hover:bg-black text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Inquiry'}
            </button>
          </div>

        </form>
      </Modal>
    </div>
  );
}
