import crypto from 'crypto';
import mongoose from 'mongoose';
import { TourDestination, TourPackage, TourInquiry, TourBooking, TourCustomer } from '../models';
import { recordAudit } from '../middlewares/auth.middleware';
import { localStore } from './localStore';
import { realtimeService } from './realtime.service';

export class ToursService {
  // Destinations
  static async createDestination(data: any) {
    const dest = await TourDestination.create(data);
    realtimeService.broadcast('TOURS_UPDATED');
    return dest;
  }

  static async listDestinations() {
    return TourDestination.find();
  }

  // Packages
  static async createPackage(data: any) {
    const pkg = await TourPackage.create(data);
    realtimeService.broadcast('TOURS_UPDATED');
    return pkg;
  }

  static async listPackages() {
    return TourPackage.find({ isActive: true }).populate('destinationId');
  }

  static async getPackageBySlugOrId(slugOrId: string) {
    let pkg = await TourPackage.findOne({ slug: slugOrId }).populate('destinationId');
    if (!pkg && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      pkg = await TourPackage.findById(slugOrId).populate('destinationId');
    }
    if (!pkg) {
      const error: any = new Error('Package not found');
      error.statusCode = 404;
      throw error;
    }
    return pkg;
  }

  static async updatePackage(id: string, data: any) {
    const pkg = await TourPackage.findByIdAndUpdate(id, data, { new: true });
    if (!pkg) {
      const error: any = new Error('Package not found');
      error.statusCode = 404;
      throw error;
    }
    realtimeService.broadcast('TOURS_UPDATED');
    return pkg;
  }

  static async deletePackage(id: string) {
    const pkg = await TourPackage.findByIdAndDelete(id);
    if (!pkg) {
      const error: any = new Error('Package not found');
      error.statusCode = 404;
      throw error;
    }
    realtimeService.broadcast('TOURS_UPDATED');
    return { message: 'Package deleted successfully' };
  }

  // Inquiries
  static async createInquiry(data: any) {
    let result;
    if (mongoose.connection.readyState === 1) {
      try {
        result = await TourInquiry.create({ ...data, status: 'New' });
      } catch (_e) {}
    }
    if (!result) {
      const newInquiry = {
        _id: 'ti-' + Date.now(),
        id: 'ti-' + Date.now(),
        customerName: data.customerName || data.customer_name || 'Guest',
        customerEmail: data.customerEmail || data.customer_email || 'guest@example.com',
        customerPhone: data.customerPhone || data.customer_phone || '+91 82082 11478',
        status: data.status || 'New',
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
      };
      result = localStore.addToursInquiry(newInquiry);
    }
    realtimeService.broadcast('INQUIRIES_UPDATED');
    return result;
  }

  static async listInquiries() {
    if (mongoose.connection.readyState === 1) {
      try {
        const list = await TourInquiry.find().sort({ createdAt: -1 });
        return list;
      } catch (_e) {}
    }
    return localStore.getToursInquiries();
  }

  static async updateInquiryStatus(id: string, status: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        const inquiry = await TourInquiry.findByIdAndUpdate(id, { status }, { new: true });
        if (inquiry) {
          realtimeService.broadcast('INQUIRIES_UPDATED');
          return { message: `Inquiry status updated to ${status}`, inquiry };
        }
      } catch (_e) {}
    }
    realtimeService.broadcast('INQUIRIES_UPDATED');
    return { message: `Inquiry status updated to ${status}` };
  }

  // Bookings
  static async createBooking(body: any, ipAddress?: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        const {
          package_id, packageId,
          customer_name, customerName,
          customer_email, customerEmail,
          customer_phone, customerPhone,
          travel_date, travelDate, startDate,
          pax_count, paxCount, guestsCount,
          totalPrice, totalAmount, total_price,
          depositPaid, deposit_paid, depositPrice,
          id, bookingCode: incomingCode,
          specialRequests,
        } = body;

        const name = customer_name || customerName || 'Valued Guest';
        const email = customer_email || customerEmail || 'guest@example.com';
        const phone = customer_phone || customerPhone || '+91 82082 11478';
        const dateStr = travel_date || travelDate || startDate || new Date().toISOString();
        const pax = pax_count || paxCount || guestsCount || 1;

        let pkg: any = null;
        const rawPkgId = package_id || packageId;
        if (rawPkgId && mongoose.Types.ObjectId.isValid(rawPkgId)) {
          pkg = await TourPackage.findById(rawPkgId);
        }
        if (!pkg && rawPkgId) {
          pkg = await TourPackage.findOne({ slug: rawPkgId });
        }
        if (!pkg && (body.title || body.packageName)) {
          pkg = await TourPackage.findOne({ title: new RegExp(body.title || body.packageName, 'i') });
        }
        if (!pkg) {
          pkg = await TourPackage.findOne();
        }

        if (pkg) {
          let customer = await TourCustomer.findOne({ email });
          if (!customer) {
            customer = await TourCustomer.create({ name, email, phone });
          }

          const total = totalPrice || totalAmount || total_price || (pkg.basePrice * pax);
          const deposit = depositPaid || deposit_paid || depositPrice || (pkg.depositPrice ? pkg.depositPrice * pax : 500);
          const balance = total - deposit;
          const bookingCode = incomingCode || id || `TR-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

          const booking = await TourBooking.create({
            bookingCode,
            packageId: pkg._id,
            customerId: customer._id,
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            travelDate: new Date(dateStr),
            paxCount: pax,
            totalAmount: total,
            depositPaid: deposit,
            balanceAmount: balance,
            status: body.status || 'pending_verification',
            utrNumber: body.utrNumber || body.utr_number || '',
            paymentMethod: body.paymentMethod || body.payment_method || 'UPI_QR',
            agreementAccepted: true,
            agreementAcceptedAt: new Date(body.termsAcceptedAt || Date.now()),
            termsAccepted: true,
            termsAcceptedAt: new Date(body.termsAcceptedAt || Date.now()),
            termsVersion: body.termsVersion || '2026.1-STANDARD',
            specialRequests: specialRequests || '',
          });

          await recordAudit({
            actorName: name,
            action: 'CREATE_TOURS_BOOKING',
            targetType: 'tour_booking',
            targetId: String(booking._id),
            details: { bookingCode, deposit, utrNumber: body.utrNumber, termsAccepted: true, termsVersion: body.termsVersion || '2026.1-STANDARD' },
            ipAddress,
          });

          return booking;
        }
      } catch (err: any) {
        console.error('[ToursService.createBooking Error]', err.message);
      }
    }

    // Fallback to localStore
    const refNo = body.bookingCode || body.id || 'TR-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    const newBooking = {
      _id: 'tb-' + Date.now(),
      id: 'tb-' + Date.now(),
      bookingCode: refNo,
      booking_code: refNo,
      customerName: body.customerName || body.customer_name || 'Valued Guest',
      customer_name: body.customerName || body.customer_name || 'Valued Guest',
      customerEmail: body.customerEmail || body.customer_email || 'guest@example.com',
      customer_email: body.customerEmail || body.customer_email || 'guest@example.com',
      customerPhone: body.customerPhone || body.customer_phone || '+91 82082 11478',
      customer_phone: body.customerPhone || body.customer_phone || '+91 82082 11478',
      packageName: body.title || body.packageName || 'Tour Package',
      travelDate: body.startDate || body.travelDate || new Date().toISOString().split('T')[0],
      paxCount: body.guestsCount || body.paxCount || body.pax_count || 1,
      totalAmount: body.totalPrice || body.totalAmount || body.total_price || 24000,
      total_price: body.totalPrice || body.totalAmount || body.total_price || 24000,
      depositPaid: body.depositPaid || body.deposit_paid || 500,
      deposit_paid: body.depositPaid || body.deposit_paid || 500,
      balanceAmount: (body.totalPrice || 24000) - (body.depositPaid || 500),
      status: body.status || 'pending_verification',
      utrNumber: body.utrNumber || body.utr_number || '',
      paymentMethod: body.paymentMethod || body.payment_method || 'UPI_QR',
      agreementAccepted: true,
      termsAccepted: true,
      termsAcceptedAt: body.termsAcceptedAt || new Date().toISOString(),
      termsVersion: body.termsVersion || '2026.1-STANDARD',
      createdAt: new Date().toISOString(),
    };
    return localStore.addToursBooking(newBooking);
  }

  static async verifyBooking(id: string, status: 'Confirmed' | 'Deposit Paid' | 'Rejected', rejectionReason?: string, adminName: string = 'Admin', ipAddress?: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        const booking = await TourBooking.findById(id);
        if (booking) {
          booking.status = status;
          booking.verifiedAt = new Date();
          booking.verifiedBy = adminName;
          if (rejectionReason) booking.rejectionReason = rejectionReason;
          await booking.save();

          await recordAudit({
            actorName: adminName,
            action: status === 'Rejected' ? 'REJECT_TOURS_BOOKING' : 'CONFIRM_TOURS_BOOKING',
            targetType: 'tour_booking',
            targetId: String(booking._id),
            details: { bookingCode: booking.bookingCode, utrNumber: booking.utrNumber, status, rejectionReason },
            ipAddress,
          });

          realtimeService.broadcast('BOOKINGS_UPDATED');
          return booking;
        }
      } catch (_e) {}
    }

    const updated = localStore.updateToursBookingStatus(id, status, rejectionReason);
    realtimeService.broadcast('BOOKINGS_UPDATED');
    return updated || { _id: id, id, status, rejectionReason, verifiedAt: new Date().toISOString() };
  }

  static async listBookings() {
    if (mongoose.connection.readyState === 1) {
      try {
        const list = await TourBooking.find().sort({ createdAt: -1 }).populate('packageId');
        return list;
      } catch (_e) {}
    }
    return localStore.getToursBookings();
  }

  static async deleteBooking(id: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        await TourBooking.findByIdAndDelete(id);
      } catch (_e) {}
    }
    localStore.deleteToursBooking(id);
    realtimeService.broadcast('BOOKINGS_UPDATED');
    return { message: 'Booking deleted successfully' };
  }

  static async deleteInquiry(id: string) {
    if (mongoose.connection.readyState === 1) {
      try {
        await TourInquiry.findByIdAndDelete(id);
      } catch (_e) {}
    }
    localStore.deleteToursInquiry(id);
    realtimeService.broadcast('INQUIRIES_UPDATED');
    return { message: 'Inquiry deleted successfully' };
  }
}
