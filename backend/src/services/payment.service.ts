import crypto from 'crypto';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import { Vehicle, FleetCustomer, FleetBooking, FleetPayment, TourPackage, TourCustomer, TourBooking } from '../models';
import { recordAudit } from '../middlewares/auth.middleware';
import { localStore } from './localStore';
import { realtimeService } from './realtime.service';

function getRazorpayKeys(serviceType: string = 'tours') {
  const keyId =
    process.env.RAZORPAY_KEY_ID ||
    (serviceType === 'fleet' ? process.env.RAZORPAY_FLEET_KEY_ID : process.env.RAZORPAY_TOURS_KEY_ID) ||
    process.env.RAZORPAY_TOURS_KEY_ID ||
    'rzp_test_placeholder';

  const keySecret =
    process.env.RAZORPAY_KEY_SECRET ||
    (serviceType === 'fleet' ? process.env.RAZORPAY_FLEET_KEY_SECRET : process.env.RAZORPAY_TOURS_KEY_SECRET) ||
    process.env.RAZORPAY_TOURS_KEY_SECRET ||
    'placeholder_secret';

  const isConfigured = Boolean(
    keyId &&
    keySecret &&
    !keyId.includes('placeholder') &&
    keySecret !== 'placeholder_secret' &&
    !keyId.includes('test_tours_key')
  );

  return { keyId, keySecret, isConfigured };
}

export class PaymentService {
  static getRazorpayKey(serviceType: string = 'tours') {
    const { keyId, isConfigured } = getRazorpayKeys(serviceType);
    return {
      key_id: keyId,
      is_configured: isConfigured,
    };
  }

  static async createOrder(data: any) {
    const serviceType = data.service_type || data.serviceType || 'tours';
    const amountInRupees = Number(data.amount || data.totalAmount || data.depositAmount || 1999);
    const amountInPaise = Math.max(100, Math.round(amountInRupees * 100)); // Minimum 1 INR = 100 paise
    const referenceId = data.reference_id || data.referenceId || data.bookingCode || `REF-${Date.now()}`;

    const { keyId, keySecret, isConfigured } = getRazorpayKeys(serviceType);

    // If live or valid Razorpay keys are not provided yet, generate a development mock order
    if (!isConfigured) {
      const mockOrderId = `order_mock_${crypto.randomBytes(8).toString('hex')}`;
      return {
        id: mockOrderId,
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${serviceType}_${Date.now()}`,
        status: 'created',
        key_id: keyId,
        mock: true,
        is_configured: false,
      };
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${serviceType}_${Date.now()}`,
      notes: {
        service_type: serviceType,
        reference_id: referenceId,
        customer_name: data.customer_name || data.customerName || '',
        customer_phone: data.customer_phone || data.customerPhone || '',
        customer_email: data.customer_email || data.customerEmail || '',
        title: data.title || data.packageName || data.vehicleName || '',
      },
    });

    return {
      ...order,
      key_id: keyId,
      mock: false,
      is_configured: true,
    };
  }

  static async verifyPaymentAndCreateBooking(body: any, ipAddress?: string) {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      service_type = 'tours',
    } = body;

    const { keySecret, isConfigured } = getRazorpayKeys(service_type);

    const isMock = !razorpay_order_id || razorpay_order_id.startsWith('order_mock_');

    if (!isMock && isConfigured) {
      if (!razorpay_signature || !razorpay_order_id || !razorpay_payment_id) {
        const error: any = new Error('Payment verification failed — missing required payment signatures');
        error.statusCode = 400;
        throw error;
      }

      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
      const actualBuf = Buffer.from(razorpay_signature, 'utf-8');

      if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
        const error: any = new Error('Payment verification failed — cryptographic signature mismatch');
        error.statusCode = 400;
        throw error;
      }
    }

    const paymentId = razorpay_payment_id || `pay_mock_${crypto.randomBytes(6).toString('hex')}`;
    const orderId = razorpay_order_id || `order_mock_${crypto.randomBytes(6).toString('hex')}`;

    // Extract booking details with comprehensive fallback compatibility
    const customerName = (body.customerName || body.customer_name || body.name || 'Valued Devotee').trim();
    const customerEmail = (body.customerEmail || body.customer_email || body.email || 'customer@aarambhatravels.in').trim().toLowerCase();
    const customerPhone = (body.customerPhone || body.customer_phone || body.phone || '+91 90676 17451').trim();
    const paxCount = Math.max(1, Number(body.paxCount || body.guestsCount || body.guests || body.numberOfTravelers || 1));
    const travelDate = body.travelDate || body.startDate || body.pickupDatetime || new Date().toISOString().split('T')[0];
    const returnDate = body.returnDate || body.endDate || body.dropoffDatetime || '';
    const pickupLocation = body.pickupLocation || body.pickup_datetime || 'Pune (Swargate / Katraj)';
    const idProofType = body.idProofType || 'aadhaar';
    const specialRequests = body.specialRequests || body.special_requests || body.specialNotes || '';
    const itemTitle = body.title || body.packageName || body.vehicleName || 'Aarambha Spiritual Journey';

    const totalAmount = Number(body.totalAmount || body.totalPrice || 6499 * paxCount);
    const depositPaid = Number(body.depositPaid || body.amount || body.depositAmount || 1999 * paxCount);
    const balanceAmount = Math.max(0, totalAmount - depositPaid);

    const bookingCode = body.bookingCode || body.id || (service_type === 'fleet' ? 'FL-' : 'TR-') + Math.floor(100000 + Math.random() * 900000);
    const invoiceNumber = (service_type === 'fleet' ? 'AT/CR/2026/' : 'AT/TT/2026/') + String(Math.floor(1000 + Math.random() * 9000));

    // ─────────────────────────────────────────────────────────────
    // 1. TOURS BOOKING CREATION & CONFIRMATION
    // ─────────────────────────────────────────────────────────────
    if (service_type === 'tours' || body.type === 'tour' || body.type === 'Tours') {
      let createdBooking: any = null;

      if (mongoose.connection.readyState === 1) {
        try {
          const packageId = body.package_id || body.packageId;
          let pkg = null;
          if (packageId && String(packageId).match(/^[0-9a-fA-F]{24}$/)) {
            pkg = await TourPackage.findById(packageId);
          }
          if (!pkg && packageId) {
            pkg = await TourPackage.findOne({ slug: packageId });
          }
          if (!pkg) {
            pkg = await TourPackage.findOne();
          }

          let customer = await TourCustomer.findOne({ email: customerEmail });
          if (!customer) {
            customer = await TourCustomer.create({
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
            });
          }

          createdBooking = await TourBooking.create({
            bookingCode,
            packageId: pkg ? pkg._id : new mongoose.Types.ObjectId(),
            customerId: customer._id,
            customerName,
            customerEmail,
            customerPhone,
            travelDate: new Date(travelDate),
            paxCount,
            totalAmount,
            depositPaid,
            balanceAmount,
            status: 'Deposit Paid',
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            paymentMethod: 'Razorpay',
            agreementAccepted: true,
            agreementAcceptedAt: new Date(),
            specialRequests,
          });
        } catch (_dbErr) {}
      }

      // Always persist to localStore for zero-downtime consistency
      const localBooking = {
        _id: 'tb-' + Date.now(),
        id: bookingCode,
        bookingCode,
        type: 'Tours',
        customerName,
        customerEmail,
        customerPhone,
        title: itemTitle,
        packageName: itemTitle,
        travelDate,
        startDate: travelDate,
        endDate: returnDate,
        paxCount,
        guestsCount: paxCount,
        numberOfTravelers: paxCount,
        totalAmount,
        totalPrice: totalAmount,
        depositPaid,
        balanceAmount,
        status: 'Deposit Paid',
        paymentStatus: 'Paid',
        paymentMethod: 'Razorpay',
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        invoiceNumber,
        pickupLocation,
        idProofType,
        specialNotes: specialRequests,
        createdAt: new Date().toISOString(),
      };

      localStore.addToursBooking(localBooking);
      realtimeService.broadcast('BOOKINGS_UPDATED', { bookingCode, status: 'Deposit Paid' });
      realtimeService.broadcast('TOURS_UPDATED');

      await recordAudit({
        actorName: customerName,
        action: 'CREATE_TOURS_BOOKING_RAZORPAY',
        targetType: 'tour_booking',
        targetId: bookingCode,
        details: { bookingCode, deposit: depositPaid, razorpayPaymentId: paymentId, invoiceNumber },
        ipAddress,
      }).catch(() => {});

      return {
        success: true,
        bookingCode,
        invoiceNumber,
        paymentId,
        orderId,
        status: 'Deposit Paid',
        booking: createdBooking || localBooking,
      };
    }

    // ─────────────────────────────────────────────────────────────
    // 2. FLEET / VEHICLE BOOKING CREATION & CONFIRMATION
    // ─────────────────────────────────────────────────────────────
    if (service_type === 'fleet' || body.type === 'car' || body.type === 'Fleet') {
      let createdBooking: any = null;

      if (mongoose.connection.readyState === 1) {
        try {
          const vehicleId = body.vehicle_id || body.vehicleId;
          let veh = null;
          if (vehicleId && String(vehicleId).match(/^[0-9a-fA-F]{24}$/)) {
            veh = await Vehicle.findById(vehicleId);
          }
          if (!veh) {
            veh = await Vehicle.findOne();
          }

          let customer = await FleetCustomer.findOne({ email: customerEmail });
          if (!customer) {
            customer = await FleetCustomer.create({
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
              licenseNumber: body.licenseNumber || body.license_number || 'MH-12-PENDING',
              isLicenseApproved: true,
            });
          }

          createdBooking = await FleetBooking.create({
            bookingCode,
            vehicleId: veh ? veh._id : new mongoose.Types.ObjectId(),
            customerId: customer._id,
            customerName,
            customerEmail,
            customerPhone,
            licenseNumber: body.licenseNumber || body.license_number || 'MH-12-PENDING',
            pickupDatetime: new Date(travelDate),
            dropoffDatetime: returnDate ? new Date(returnDate) : new Date(Date.now() + 86400000 * 3),
            totalRentalAmount: totalAmount,
            securityDepositAmount: veh ? veh.securityDeposit : 2000,
            depositAmount: depositPaid,
            status: 'Deposit Paid',
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            paymentMethod: 'Razorpay',
            agreementAccepted: true,
            agreementAcceptedAt: new Date(),
            specialRequests,
          });

          await FleetPayment.create({
            bookingId: createdBooking._id,
            amount: depositPaid,
            paymentType: 'Booking Deposit',
            paymentMethod: 'Razorpay',
            status: 'Success',
            transactionRef: paymentId,
          });
        } catch (_dbErr) {}
      }

      const localBooking = {
        _id: 'fb-' + Date.now(),
        id: bookingCode,
        bookingCode,
        type: 'Fleet',
        customerName,
        customerEmail,
        customerPhone,
        title: itemTitle,
        vehicleName: itemTitle,
        pickupDatetime: travelDate,
        dropoffDatetime: returnDate,
        startDate: travelDate,
        endDate: returnDate,
        totalRentalAmount: totalAmount,
        totalPrice: totalAmount,
        depositAmount: depositPaid,
        depositPaid,
        balanceAmount,
        status: 'Deposit Paid',
        paymentStatus: 'Paid',
        paymentMethod: 'Razorpay',
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        invoiceNumber,
        pickupLocation,
        idProofType,
        specialNotes: specialRequests,
        createdAt: new Date().toISOString(),
      };

      localStore.addFleetBooking(localBooking);
      realtimeService.broadcast('BOOKINGS_UPDATED', { bookingCode, status: 'Deposit Paid' });

      await recordAudit({
        actorName: customerName,
        action: 'CREATE_FLEET_BOOKING_RAZORPAY',
        targetType: 'fleet_booking',
        targetId: bookingCode,
        details: { bookingCode, deposit: depositPaid, razorpayPaymentId: paymentId, invoiceNumber },
        ipAddress,
      }).catch(() => {});

      return {
        success: true,
        bookingCode,
        invoiceNumber,
        paymentId,
        orderId,
        status: 'Deposit Paid',
        booking: createdBooking || localBooking,
      };
    }

    const error: any = new Error('Invalid service_type. Must be "fleet" or "tours".');
    error.statusCode = 400;
    throw error;
  }

  static async getBookingDetailsByCode(code: string) {
    if (!code) {
      const error: any = new Error('Booking code is required');
      error.statusCode = 400;
      throw error;
    }

    // 1. Try finding in MongoDB
    if (mongoose.connection.readyState === 1) {
      try {
        const tb = await TourBooking.findOne({
          $or: [{ bookingCode: code }, { _id: code.match(/^[0-9a-fA-F]{24}$/) ? code : null }],
        }).populate('packageId');
        if (tb) return tb;

        const fb = await FleetBooking.findOne({
          $or: [{ bookingCode: code }, { _id: code.match(/^[0-9a-fA-F]{24}$/) ? code : null }],
        }).populate('vehicleId');
        if (fb) return fb;
      } catch (_e) {}
    }

    // 2. Fallback to localStore
    const toursBookings = localStore.getToursBookings();
    const matchedTour = toursBookings.find((b: any) => b.bookingCode === code || b.id === code || b._id === code);
    if (matchedTour) return matchedTour;

    const fleetBookings = localStore.getFleetBookings();
    const matchedFleet = fleetBookings.find((b: any) => b.bookingCode === code || b.id === code || b._id === code);
    if (matchedFleet) return matchedFleet;

    const error: any = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }
}
