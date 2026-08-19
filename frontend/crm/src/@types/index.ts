export interface Booking {
  id?: string;
  _id?: string;
  type?: 'Tours' | 'Fleet';
  bookingCode?: string;
  booking_code?: string;
  customerName?: string;
  customer_name?: string;
  customerEmail?: string;
  customer_email?: string;
  customerPhone?: string;
  customer_phone?: string;
  totalAmount?: number;
  total_amount?: number;
  totalRentalAmount?: number;
  total_rental_amount?: number;
  depositAmount?: number;
  depositPaid?: number;
  deposit_paid?: number;
  securityDepositAmount?: number;
  security_deposit_amount?: number;
  razorpayPaymentId?: string;
  razorpay_payment_id?: string;
  status: string;
  createdAt?: string;
  created_at?: string;
  travelDate?: string;
  pickupDatetime?: string;
  dropoffDatetime?: string;
  paxCount?: number;
  licenseNumber?: string;
  agreementAccepted?: boolean;
  specialRequests?: string;
  packageId?: { title?: string };
  vehicleId?: { name?: string };
}

export interface Inquiry {
  id?: string;
  _id?: string;
  type?: string;
  customerName?: string;
  customer_name?: string;
  customerEmail?: string;
  customer_email?: string;
  customerPhone?: string;
  customer_phone?: string;
  status: string;
  createdAt?: string;
  created_at?: string;
}

export interface TourPackage {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  description: string;
  durationDays?: number;
  duration_days?: number;
  durationNights?: number;
  duration_nights?: number;
  basePrice?: number;
  base_price?: number;
  depositPrice?: number;
  deposit_price?: number;
  inclusions?: string[];
  images?: string[];
}

export interface Vehicle {
  id?: string;
  _id?: string;
  name: string;
  regNumber?: string;
  reg_number?: string;
  vehicleType?: string;
  vehicle_type?: string;
  dailyRate?: number;
  daily_rate?: number;
  securityDeposit?: number;
  security_deposit?: number;
  status: string;
}

export interface PromoCode {
  id?: string;
  _id?: string;
  code: string;
  discountPercentage?: number;
  discount_percentage?: number;
  maxDiscountAmount?: number;
  max_discount_amount?: number;
  validVertical?: string;
  valid_vertical?: string;
  isActive?: boolean;
}

export interface AuditLogItem {
  action: string;
  actorName?: string;
  actor_name?: string;
  targetType?: string;
  target_type?: string;
  details?: any;
  createdAt?: string;
  created_at?: string;
}
