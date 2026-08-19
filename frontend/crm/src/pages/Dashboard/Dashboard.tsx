import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, ArrowUpRight, CalendarCheck, Compass, Car, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getToursBookings, getToursInquiries, getToursPackages } from '@/api/tours.api';
import { getFleetBookings, getFleetInquiries, getFleetVehicles } from '@/api/fleet.api';
import { KPICard } from '@/components/common/KPICard';
import { Loader } from '@/components/common/Loader';
import { Badge } from '@/components/common/Badge';
import { statusColor } from '@/utils/statusColor';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';

export default function DashboardView() {
  const navigate = useNavigate();
  const { activeVertical: vertical, user } = useAuth();
  const [tours, setTours] = useState<any>({ bookings: [], inquiries: [], packages: [] });
  const [fleet, setFleet] = useState<any>({ bookings: [], inquiries: [], vehicles: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getToursBookings(),
      getToursInquiries(),
      getToursPackages(),
      getFleetBookings(),
      getFleetInquiries(),
      getFleetVehicles(),
    ]).then(([tb, ti, tp, fb, fi, fv]) => {
      setTours({ bookings: tb, inquiries: ti, packages: tp });
      setFleet({ bookings: fb, inquiries: fi, vehicles: fv });
      setLoading(false);
    });
  }, []);

  const showTours = vertical === 'all' || vertical === 'tours';
  const showFleet = vertical === 'all' || vertical === 'fleet';

  const totalRevenue =
    (showTours ? tours.bookings.reduce((a: number, b: any) => a + Number(b.depositPaid || b.deposit_paid || b.depositAmount || 500), 0) : 0) +
    (showFleet ? fleet.bookings.reduce((a: number, b: any) => a + Number(b.totalRentalAmount || b.total_rental_amount || b.totalPrice || b.total_price || 0), 0) : 0);

  const activeBookings = (showTours ? tours.bookings.length : 0) + (showFleet ? fleet.bookings.length : 0);
  const newInquiries = (showTours ? tours.inquiries.filter((i: any) => i.status === 'New').length : 0) +
    (showFleet ? fleet.inquiries.filter((i: any) => i.status === 'New').length : 0);
  const availableVehicles = showFleet ? fleet.vehicles.filter((v: any) => v.status === 'Available').length : 0;

  if (loading) return <Loader />;

  // Dynamic recent bookings list according to active scope
  const recentBookings = [
    ...(showTours ? tours.bookings.map((b: any) => ({ ...b, type: 'Tours' })) : []),
    ...(showFleet ? fleet.bookings.map((b: any) => ({ ...b, type: 'Rental' })) : []),
  ].sort((a, b) => new Date(b.createdAt || b.created_at || Date.now()).getTime() - new Date(a.createdAt || a.created_at || Date.now()).getTime());

  // Scope title helper
  const recentBookingsTitle =
    vertical === 'tours' ? 'Recent Bookings (Tours)' :
    vertical === 'fleet' ? 'Recent Bookings (Rental)' :
    'Recent Bookings (All)';

  return (
    <div className="space-y-6 select-none">
      
      {/* Top Greeting */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
          Hello {user?.name ? user.name.split(' ')[0] : 'Admin'}
        </h2>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          Monitor performance and operations in real time.
        </p>
      </div>

      {/* KPI Cards Grid (3-Column Layout with Click Redirects) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* KPI 1: Total Revenue (Redirects to /finance) */}
        <KPICard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          sub={`${activeBookings} active bookings`}
          variant="peach"
          onClick={() => navigate('/finance')}
        />

        {/* KPI 2: Active Bookings (Redirects to /bookings) */}
        <KPICard
          label="Active Bookings"
          value={activeBookings.toString()}
          sub={showTours && showFleet ? `${tours.bookings.length} Tours | ${fleet.bookings.length} Rental` : 'Scope Filtered'}
          variant="blue"
          onClick={() => navigate('/bookings')}
        />

        {/* KPI 3: New Inquiries (Redirects to /customers) */}
        <KPICard
          label="New Inquiries"
          value={newInquiries.toString()}
          sub="Awaiting response"
          variant="purple"
          onClick={() => navigate('/customers')}
        />

      </div>

      {/* Recent Bookings Section (Replacing Productivity & Volume Trends) */}
      <div className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-aether-card space-y-5">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                {recentBookingsTitle}
              </h3>
              <p className="text-xs text-gray-400">Latest reservations and booking statuses</p>
            </div>
          </div>

          <Link
            to="/bookings"
            className="px-4 py-2 bg-gray-100 hover:bg-[#111827] hover:text-white text-gray-700 rounded-full text-xs font-bold transition-all flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-400 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Service Scope</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Deposit & Total</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80">
              {recentBookings.slice(0, 6).map((b, i) => {
                const isRental = b.type === 'Rental' || b.type === 'Fleet';
                const code = b.bookingCode || b.booking_code || `REF-${i + 100}`;
                const name = b.customerName || b.customer_name || 'Customer';
                const email = b.customerEmail || b.customer_email || 'N/A';
                const phone = b.customerPhone || b.customer_phone || 'N/A';
                const total = b.totalAmount || b.total_amount || b.totalRentalAmount || b.total_rental_amount || b.totalPrice || b.total_price || 0;
                const depositPaid = b.depositPaid || b.deposit_paid || b.depositAmount || 500;
                const itemName = isRental
                  ? (b.vehicleName || b.vehicle_name || b.title || b.vehicleId?.name || 'Zephyr A4 Stratos')
                  : (b.packageName || b.package_name || b.title || b.packageId?.title || 'Tour Package');
                const dateVal = b.startDate || b.travelDate || b.pickupDatetime || b.pickup_date || b.createdAt || b.created_at;

                return (
                  <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#111827]">{code}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isRental ? 'bg-blue-50 text-blue-700 border border-blue-200/60' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      }`}>
                        {isRental ? <Car className="w-3 h-3" /> : <Compass className="w-3 h-3" />}
                        {b.type}
                      </span>
                      <div className="text-[11px] font-semibold text-gray-700 mt-1">{itemName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#111827]">{name}</div>
                      <div className="text-[10px] text-gray-400">{phone} • {email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      <div>{formatDate(dateVal)}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-700">₹{depositPaid} (Deposit)</div>
                      <div className="text-[10px] text-gray-400">Total: {formatCurrency(total)}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Badge color={statusColor(b.status || 'Confirmed')}>{b.status || 'Confirmed'}</Badge>
                    </td>
                  </tr>
                );
              })}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No recent bookings recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
