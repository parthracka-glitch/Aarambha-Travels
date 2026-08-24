import crypto from 'crypto';
import mongoose from 'mongoose';
import { FleetCategory, Vehicle, FleetInquiry, FleetBooking, FleetCustomer, FleetPayment } from '../models';
import { recordAudit } from '../middlewares/auth.middleware';
import { localStore } from './localStore';
import { realtimeService } from './realtime.service';

export class FleetService {
  // Categories
  static async createCategory(data: any) {
    const cat = await FleetCategory.create(data);
    realtimeService.broadcast('FLEET_UPDATED');
    return cat;
  }

  static async listCategories() {
    return FleetCategory.find();
  }

  // Vehicles
  static async createVehicle(body: any) {
    const { name, reg_number, regNumber, category_id, categoryId, vehicle_type, vehicleType, daily_rate, dailyRate, security_deposit, securityDeposit, images, specs } = body;
    const veh = await Vehicle.create({
      name,
      regNumber: reg_number || regNumber,
      categoryId: category_id || categoryId,
      vehicleType: vehicle_type || vehicleType || 'car',
      dailyRate: daily_rate || dailyRate,
      securityDeposit: security_deposit || securityDeposit,
      images: images || [],
      specs: specs || {},
      status: 'Available',
    });
    realtimeService.broadcast('FLEET_UPDATED');
    return veh;
  }

  static async listVehicles() {
    return Vehicle.find().populate('categoryId');
  }

  static async getVehicleById(id: string) {
    const veh = await Vehicle.findById(id).populate('categoryId');
    if (!veh) {
      const error: any = new Error('Vehicle not found');
      error.statusCode = 404;
      throw error;
    }
    return veh;
  }

  static async updateVehicle(id: string, data: any) {
    const veh = await Vehicle.findByIdAndUpdate(id, data, { new: true });
    if (!veh) {
      const error: any = new Error('Vehicle not found');
      error.statusCode = 404;
      throw error;
    }
    realtimeService.broadcast('FLEET_UPDATED');
    return veh;
  }

  static async deleteVehicle(id: string) {
    const veh = await Vehicle.findByIdAndDelete(id);
    if (!veh) {
      const error: any = new Error('Vehicle not found');
      error.statusCode = 404;
      throw error;
    }
    realtimeService.broadcast('FLEET_UPDATED');
    return { message: 'Vehicle deleted successfully' };
  }

  // Inquiries
  static async createInquiry(data: any) {
    if (mongoose.connection.readyState === 1) {
      try {
        return await FleetInquiry.create({ ...data, status: 'New' });
      } catch (_e) {}
    }
    const newInquiry = {
      _id: 'fi-' + Date.now(),
      id: 'fi-' + Date.now(),
      customer_name: data.customer_name || data.customerName || 'Guest',
      customerName: data.customer_name || data.customerName || 'Guest',
      customer_email: data.customer_email || data.customerEmail || 'guest@example.com',
      customerEmail: data.customer_email || data.customerEmail || 'guest@example.com',
      customer_phone: data.customer_phone || data.customerPhone || '+91 82082 11478',
      customerPhone: data.customer_phone || data.customerPhone || '+91 82082 11478',
      status: data.status || 'New',
      notes: data.notes || '',
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    return localStore.addFleetInquiry(newInquiry);
  }

  static async listInquiries() {
    if (mongoose.connection.readyState === 1) {
      try {
        const list = await FleetInquiry.find().sort({ createdAt: -1 });
        return list;
      } catch (_e) {}
    }
    return localStore.getFleetInquiries();
  }

  // Bookings
  static async createBooking(body: any, ipAddress?: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        const {
          vehicle_id, vehicleId,
          customer_name, customerName,
          customer_email, customerEmail,
          customer_phone, customerPhone,
          license_number, licenseNumber,
          pickup_datetime, pickupDatetime, pickupDate, startDate,
          dropoff_datetime, dropoffDatetime, returnDate, endDate,
          totalPrice, totalRentalAmount, total_price,
          depositPaid, deposit_paid, depositAmount,
          id, bookingCode: incomingCode,
          specialRequests,
        } = body;

        const name = customer_name || customerName || 'Valued Guest';
        const email = customer_email || customerEmail || 'guest@example.com';
        const phone = customer_phone || customerPhone || '+91 82082 11478';
        const license = license_number || licenseNumber || 'DL-PENDING';
        const pickupStr = pickup_datetime || pickupDatetime || pickupDate || startDate || new Date().toISOString();
        const dropoffStr = dropoff_datetime || dropoffDatetime || returnDate || endDate || new Date(Date.now() + 86400000 * 3).toISOString();

        let veh: any = null;
        const rawVehId = vehicle_id || vehicleId;
        if (rawVehId && mongoose.Types.ObjectId.isValid(rawVehId)) {
          veh = await Vehicle.findById(rawVehId);
        }
        if (!veh && (body.title || body.vehicleName)) {
          veh = await Vehicle.findOne({ name: new RegExp(body.title || body.vehicleName, 'i') });
        }
        if (!veh) {
          veh = await Vehicle.findOne();
        }

        if (veh) {
          let customer = await FleetCustomer.findOne({ email });
          if (!customer) {
            customer = await FleetCustomer.create({
              name,
              email,
              phone,
              licenseNumber: license,
              isLicenseApproved: true,
            });
          }

          const start = new Date(pickupStr);
          const end = new Date(dropoffStr);
          const diffDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
          const total = totalPrice || totalRentalAmount || total_price || (veh.dailyRate * diffDays);
          const dep = depositPaid || deposit_paid || depositAmount || 500;
          const bookingCode = incomingCode || id || `FL-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

          const booking = await FleetBooking.create({
            bookingCode,
            vehicleId: veh._id,
            customerId: customer._id,
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            licenseNumber: license,
            pickupDatetime: start,
            dropoffDatetime: end,
            totalRentalAmount: total,
            securityDepositAmount: veh.securityDeposit || 5000,
            depositAmount: dep,
            status: body.status || 'pending_verification',
            utrNumber: body.utrNumber || body.utr_number || '',
            paymentMethod: body.paymentMethod || body.payment_method || 'UPI_QR',
            paymentScreenshot: body.paymentScreenshot || body.payment_screenshot || '',
            agreementAccepted: true,
            agreementAcceptedAt: new Date(body.termsAcceptedAt || Date.now()),
            termsAccepted: true,
            termsAcceptedAt: new Date(body.termsAcceptedAt || Date.now()),
            termsVersion: body.termsVersion || '2026.1-STANDARD',
            specialRequests: specialRequests || (body.pickupLocation ? `Pickup: ${body.pickupLocation}` : ''),
          });

          await recordAudit({
            actorName: name,
            action: 'CREATE_FLEET_BOOKING',
            targetType: 'fleet_booking',
            targetId: String(booking._id),
            details: { bookingCode, deposit: dep, utrNumber: body.utrNumber, termsAccepted: true, termsVersion: body.termsVersion || '2026.1-STANDARD' },
            ipAddress,
          });

          return booking;
        }
      } catch (err: any) {
        console.error('[FleetService.createBooking Error]', err.message);
      }
    }

    // Fallback to localStore
    const refNo = body.bookingCode || body.id || 'FL-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    const newBooking = {
      _id: 'fb-' + Date.now(),
      id: 'fb-' + Date.now(),
      booking_code: refNo,
      bookingCode: refNo,
      customer_name: body.customerName || body.customer_name || 'Valued Guest',
      customerName: body.customerName || body.customer_name || 'Valued Guest',
      customer_email: body.customerEmail || body.customer_email || 'guest@example.com',
      customerEmail: body.customerEmail || body.customer_email || 'guest@example.com',
      customer_phone: body.customerPhone || body.customer_phone || '+91 82082 11478',
      customerPhone: body.customerPhone || body.customer_phone || '+91 82082 11478',
      licenseNumber: body.licenseNumber || body.license_number || 'DL-PENDING',
      vehicle_name: body.title || body.vehicleName || 'Vehicle Rental',
      vehicleName: body.title || body.vehicleName || 'Vehicle Rental',
      pickup_date: body.startDate || body.pickupDate || body.pickup_datetime || new Date().toISOString().split('T')[0],
      return_date: body.endDate || body.returnDate || body.dropoff_datetime || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      pickupDatetime: body.startDate || body.pickupDate || body.pickup_datetime || new Date().toISOString(),
      dropoffDatetime: body.endDate || body.returnDate || body.dropoff_datetime || new Date(Date.now() + 86400000 * 3).toISOString(),
      total_price: body.totalPrice || body.totalRentalAmount || body.total_price || 12740,
      totalPrice: body.totalPrice || body.totalRentalAmount || body.total_price || 12740,
      totalRentalAmount: body.totalPrice || body.totalRentalAmount || body.total_price || 12740,
      security_deposit: body.depositPaid || body.deposit_paid || 500,
      deposit_paid: body.depositPaid || body.deposit_paid || 500,
      depositPaid: body.depositPaid || body.deposit_paid || 500,
      depositAmount: body.depositPaid || body.deposit_paid || 500,
      status: body.status || 'pending_verification',
      utrNumber: body.utrNumber || body.utr_number || '',
      paymentMethod: body.paymentMethod || body.payment_method || 'UPI_QR',
      paymentScreenshot: body.paymentScreenshot || body.payment_screenshot || '',
      agreementAccepted: true,
      termsAccepted: true,
      termsAcceptedAt: body.termsAcceptedAt || new Date().toISOString(),
      termsVersion: body.termsVersion || '2026.1-STANDARD',
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    return localStore.addFleetBooking(newBooking);
  }

  static async verifyBooking(id: string, status: 'Confirmed' | 'Deposit Paid' | 'Rejected', rejectionReason?: string, adminName: string = 'Admin', ipAddress?: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        const booking = await FleetBooking.findById(id);
        if (booking) {
          booking.status = status;
          booking.verifiedAt = new Date();
          booking.verifiedBy = adminName;
          if (rejectionReason) booking.rejectionReason = rejectionReason;
          await booking.save();

          await recordAudit({
            actorName: adminName,
            action: status === 'Rejected' ? 'REJECT_FLEET_BOOKING' : 'CONFIRM_FLEET_BOOKING',
            targetType: 'fleet_booking',
            targetId: String(booking._id),
            details: { bookingCode: booking.bookingCode, utrNumber: booking.utrNumber, status, rejectionReason },
            ipAddress,
          });

          realtimeService.broadcast('BOOKINGS_UPDATED');
          return booking;
        }
      } catch (_e) {}
    }

    const updated = localStore.updateFleetBookingStatus(id, status, rejectionReason);
    realtimeService.broadcast('BOOKINGS_UPDATED');
    return updated || { _id: id, id, status, rejectionReason, verifiedAt: new Date().toISOString() };
  }

  static async syncBookingStatus(codes?: string[], email?: string) {
    const filter: any = {};
    if (Array.isArray(codes) && codes.length > 0) {
      filter.$or = [
        { bookingCode: { $in: codes } },
        { _id: { $in: codes.filter(c => mongoose.Types.ObjectId.isValid(c)) } }
      ];
    } else if (email) {
      filter.customerEmail = new RegExp(`^${email.trim()}$`, 'i');
    } else {
      return [];
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const list = await FleetBooking.find(filter).select('bookingCode status utrNumber rejectionReason verifiedAt depositAmount totalRentalAmount');
        return list.map(b => ({
          id: b.bookingCode,
          bookingCode: b.bookingCode,
          status: b.status,
          utrNumber: b.utrNumber,
          rejectionReason: b.rejectionReason,
          verifiedAt: b.verifiedAt,
          depositPaid: b.depositAmount,
          totalAmount: b.totalRentalAmount,
        }));
      } catch (_e) {}
    }

    const localList = localStore.getFleetBookings();
    return localList
      .filter((b: any) => {
        if (Array.isArray(codes) && codes.length > 0) {
          return codes.includes(b.bookingCode) || codes.includes(b.id) || codes.includes(b._id);
        }
        if (email) {
          return (b.customerEmail || b.email || '').toLowerCase() === email.toLowerCase();
        }
        return false;
      })
      .map((b: any) => ({
        id: b.bookingCode || b.id,
        bookingCode: b.bookingCode || b.id,
        status: b.status,
        utrNumber: b.utrNumber,
        rejectionReason: b.rejectionReason,
        verifiedAt: b.verifiedAt,
        depositPaid: b.depositAmount || b.depositPaid,
        totalAmount: b.totalRentalAmount || b.totalAmount,
      }));
  }

  static async listBookings() {
    if (mongoose.connection.readyState === 1) {
      try {
        const list = await FleetBooking.find().sort({ createdAt: -1 }).populate('vehicleId');
        return list;
      } catch (_e) {}
    }
    return localStore.getFleetBookings();
  }

  static async markPickedUp(id: string, paymentMethodBody?: string, ipAddress?: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        const method = paymentMethodBody || 'Cash';
        const booking = await FleetBooking.findById(id);
        if (booking) {
          booking.status = 'Picked Up (Paid in Full)';
          booking.pickupPaymentMethod = method;
          await booking.save();
          await Vehicle.findByIdAndUpdate(booking.vehicleId, { status: 'Rented' });
          realtimeService.broadcast('BOOKINGS_UPDATED');
          realtimeService.broadcast('FLEET_UPDATED');
          return booking;
        }
      } catch (_e) {}
    }
    realtimeService.broadcast('BOOKINGS_UPDATED');
    return { message: 'Picked up updated' };
  }

  static async markReturned(id: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        const booking = await FleetBooking.findById(id);
        if (booking) {
          booking.status = 'Returned';
          await booking.save();
          await Vehicle.findByIdAndUpdate(booking.vehicleId, { status: 'Available' });
          realtimeService.broadcast('BOOKINGS_UPDATED');
          realtimeService.broadcast('FLEET_UPDATED');
          return booking;
        }
      } catch (_e) {}
    }
    realtimeService.broadcast('BOOKINGS_UPDATED');
    return { message: 'Returned updated' };
  }

  static async refundDeposit(id: string, ipAddress?: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        const booking = await FleetBooking.findById(id);
        if (booking) {
          const refundRef = `RF-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
          booking.status = 'Deposit Refunded';
          booking.refundRef = refundRef;
          await booking.save();
          realtimeService.broadcast('BOOKINGS_UPDATED');
          return booking;
        }
      } catch (_e) {}
    }
    realtimeService.broadcast('BOOKINGS_UPDATED');
    return { message: 'Deposit refunded' };
  }

  static async deleteBooking(id: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        await FleetBooking.findByIdAndDelete(id);
      } catch (_e) {}
    }
    localStore.deleteFleetBooking(id);
    realtimeService.broadcast('BOOKINGS_UPDATED');
    return { message: 'Booking deleted successfully' };
  }

  static async deleteInquiry(id: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        await FleetInquiry.findByIdAndDelete(id);
      } catch (_e) {}
    }
    localStore.deleteFleetInquiry(id);
    realtimeService.broadcast('INQUIRIES_UPDATED');
    return { message: 'Inquiry deleted successfully' };
  }
}
