import crypto from 'crypto';
import { Vehicle, FleetCustomer, FleetBooking, FleetPayment, TourPackage, TourCustomer, TourBooking } from '../models';
import { recordAudit } from '../middlewares/auth.middleware';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
const DEPOSIT_AMOUNT = 500;
const DEPOSIT_PAISE = DEPOSIT_AMOUNT * 100;

export class PaymentService {
  static getRazorpayKey() {
    return { key_id: RAZORPAY_KEY_ID };
  }

  static async createOrder(serviceType: string, referenceId?: string) {
    let Razorpay: any;
    try {
      // @ts-ignore
      Razorpay = require('razorpay');
    } catch {
      const mockOrderId = `order_mock_${crypto.randomBytes(8).toString('hex')}`;
      return {
        id: mockOrderId,
        amount: DEPOSIT_PAISE,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
        status: 'created',
        key_id: RAZORPAY_KEY_ID,
        mock: true,
      };
    }

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: DEPOSIT_PAISE,
      currency: 'INR',
      receipt: `rcpt_${serviceType}_${Date.now()}`,
      notes: {
        service_type: serviceType || 'unknown',
        reference_id: referenceId || '',
      },
    });

    return {
      ...order,
      key_id: RAZORPAY_KEY_ID,
    };
  }

  static async verifyPaymentAndCreateBooking(body: any, ipAddress?: string) {
    const {
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
      service_type,
      vehicle_id, license_number, pickup_datetime, dropoff_datetime,
      package_id, travel_date, pax_count,
      customer_name, customer_email, customer_phone,
      agreement_accepted, special_requests,
    } = body;

    const isMock = razorpay_order_id?.startsWith('order_mock_');
    if (!isMock && RAZORPAY_KEY_SECRET !== 'placeholder_secret') {
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        const error: any = new Error('Payment verification failed — invalid signature');
        error.statusCode = 400;
        throw error;
      }
    }

    const paymentId = razorpay_payment_id || `pay_mock_${crypto.randomBytes(6).toString('hex')}`;

    if (service_type === 'fleet') {
      const veh = await Vehicle.findById(vehicle_id);
      if (!veh) {
        const error: any = new Error('Vehicle not found');
        error.statusCode = 404;
        throw error;
      }

      let customer = await FleetCustomer.findOne({ email: customer_email });
      if (!customer) {
        customer = await FleetCustomer.create({
          name: customer_name, email: customer_email, phone: customer_phone,
          licenseNumber: license_number, isLicenseApproved: true,
        });
      }

      const startDate = new Date(pickup_datetime);
      const endDate = new Date(dropoff_datetime);
      const diffDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));
      const totalRental = veh.dailyRate * diffDays;
      const bookingCode = `FL-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

      const booking = await FleetBooking.create({
        bookingCode,
        vehicleId: veh._id,
        customerId: customer._id,
        customerName: customer_name,
        customerEmail: customer_email,
        customerPhone: customer_phone,
        licenseNumber: license_number,
        pickupDatetime: startDate,
        dropoffDatetime: endDate,
        totalRentalAmount: totalRental,
        securityDepositAmount: veh.securityDeposit,
        depositAmount: DEPOSIT_AMOUNT,
        status: 'Deposit Paid',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: paymentId,
        agreementAccepted: agreement_accepted || false,
        agreementAcceptedAt: agreement_accepted ? new Date() : undefined,
        specialRequests: special_requests || '',
      });

      await FleetPayment.create({
        bookingId: booking._id,
        amount: DEPOSIT_AMOUNT,
        paymentType: 'Booking Deposit',
        paymentMethod: 'Razorpay',
        status: 'Success',
        transactionRef: paymentId,
      });

      await recordAudit({
        actorName: customer_name,
        action: 'CREATE_FLEET_BOOKING_RAZORPAY',
        targetType: 'fleet_booking',
        targetId: String(booking._id),
        details: { bookingCode, deposit: DEPOSIT_AMOUNT, razorpayPaymentId: paymentId },
        ipAddress,
      });

      return FleetBooking.findById(booking._id).populate('vehicleId');
    }

    if (service_type === 'tours') {
      const pkg = await TourPackage.findById(package_id);
      if (!pkg) {
        const error: any = new Error('Tour package not found');
        error.statusCode = 404;
        throw error;
      }

      let customer = await TourCustomer.findOne({ email: customer_email });
      if (!customer) {
        customer = await TourCustomer.create({ name: customer_name, email: customer_email, phone: customer_phone });
      }

      const pax = pax_count || 1;
      const total = pkg.basePrice * pax;
      const deposit = DEPOSIT_AMOUNT;
      const balance = total - deposit;
      const bookingCode = `TR-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

      const booking = await TourBooking.create({
        bookingCode,
        packageId: pkg._id,
        customerId: customer._id,
        customerName: customer_name,
        customerEmail: customer_email,
        customerPhone: customer_phone,
        travelDate: new Date(travel_date),
        paxCount: pax,
        totalAmount: total,
        depositPaid: deposit,
        balanceAmount: balance,
        status: 'Deposit Paid',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: paymentId,
        agreementAccepted: agreement_accepted || false,
        agreementAcceptedAt: agreement_accepted ? new Date() : undefined,
        specialRequests: special_requests || '',
      });

      await recordAudit({
        actorName: customer_name,
        action: 'CREATE_TOURS_BOOKING_RAZORPAY',
        targetType: 'tour_booking',
        targetId: String(booking._id),
        details: { bookingCode, deposit, razorpayPaymentId: paymentId },
        ipAddress,
      });

      return TourBooking.findById(booking._id).populate('packageId');
    }

    const error: any = new Error('Invalid service_type. Must be "fleet" or "tours".');
    error.statusCode = 400;
    throw error;
  }
}
