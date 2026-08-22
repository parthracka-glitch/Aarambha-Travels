import mongoose, { Schema, Document } from 'mongoose';

// ─── FleetCategory ──────────────────────────────────────
export interface IFleetCategory extends Document {
  name: string;
  description?: string;
}

const FleetCategorySchema = new Schema<IFleetCategory>({
  name: { type: String, required: true },
  description: { type: String },
});

export const FleetCategory = mongoose.model<IFleetCategory>('FleetCategory', FleetCategorySchema);

// ─── Vehicle ───────────────────────────────────────────
export interface IVehicle extends Document {
  name: string;
  regNumber: string;
  categoryId?: mongoose.Types.ObjectId;
  vehicleType: 'car' | 'bike';
  dailyRate: number;
  securityDeposit: number;
  status: 'Available' | 'Rented' | 'Maintenance';
  images: string[];
  specs: Record<string, any>;
  createdAt: Date;
}

const VehicleSchema = new Schema<IVehicle>({
  name: { type: String, required: true },
  regNumber: { type: String, required: true, unique: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'FleetCategory' },
  vehicleType: { type: String, enum: ['car', 'bike'], default: 'car' },
  dailyRate: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  status: { type: String, enum: ['Available', 'Rented', 'Maintenance'], default: 'Available' },
  images: [{ type: String }],
  specs: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
});

export const Vehicle = mongoose.model<IVehicle>('Vehicle', VehicleSchema);

// ─── FleetCustomer ──────────────────────────────────────
export interface IFleetCustomer extends Document {
  name: string;
  email: string;
  phone: string;
  licenseNumber?: string;
  licenseDocumentUrl?: string;
  isLicenseApproved: boolean;
  createdAt: Date;
}

const FleetCustomerSchema = new Schema<IFleetCustomer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String },
  licenseDocumentUrl: { type: String },
  isLicenseApproved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const FleetCustomer = mongoose.model<IFleetCustomer>('FleetCustomer', FleetCustomerSchema);

// ─── FleetInquiry ───────────────────────────────────────
export interface IFleetInquiry extends Document {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleId?: mongoose.Types.ObjectId;
  pickupDate?: string;
  dropoffDate?: string;
  status: string;
  notes?: string;
  createdAt: Date;
}

const FleetInquirySchema = new Schema<IFleetInquiry>({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
  pickupDate: { type: String },
  dropoffDate: { type: String },
  status: { type: String, default: 'New' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const FleetInquiry = mongoose.model<IFleetInquiry>('FleetInquiry', FleetInquirySchema);

// ─── FleetBooking ───────────────────────────────────────
export interface IFleetBooking extends Document {
  bookingCode: string;
  vehicleId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  licenseNumber?: string;
  pickupDatetime: Date;
  dropoffDatetime: Date;
  totalRentalAmount: number;
  securityDepositAmount: number;
  depositAmount: number;
  status: string; // pending_verification -> Deposit Paid / Confirmed -> Picked Up (Paid in Full) -> Returned -> Deposit Refunded / Rejected
  pickupPaymentMethod?: string;
  refundRef?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  utrNumber?: string;
  paymentMethod?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  rejectionReason?: string;
  agreementAccepted: boolean;
  agreementAcceptedAt?: Date;
  termsAccepted: boolean;
  termsAcceptedAt?: Date;
  termsVersion?: string;
  specialRequests?: string;
  createdAt: Date;
}

const FleetBookingSchema = new Schema<IFleetBooking>({
  bookingCode: { type: String, required: true, unique: true, index: true },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'FleetCustomer', required: true },
  customerName: { type: String },
  customerEmail: { type: String },
  customerPhone: { type: String },
  licenseNumber: { type: String },
  pickupDatetime: { type: Date, required: true },
  dropoffDatetime: { type: Date, required: true },
  totalRentalAmount: { type: Number, required: true },
  securityDepositAmount: { type: Number, required: true },
  depositAmount: { type: Number, default: 500 },
  status: { type: String, default: 'pending_verification' },
  pickupPaymentMethod: { type: String },
  refundRef: { type: String },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  utrNumber: { type: String, index: true },
  paymentMethod: { type: String, default: 'UPI_QR' },
  verifiedAt: { type: Date },
  verifiedBy: { type: String },
  rejectionReason: { type: String },
  agreementAccepted: { type: Boolean, default: true },
  agreementAcceptedAt: { type: Date },
  termsAccepted: { type: Boolean, required: true, default: true },
  termsAcceptedAt: { type: Date, default: Date.now },
  termsVersion: { type: String, default: '2026.1-STANDARD' },
  specialRequests: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const FleetBooking = mongoose.model<IFleetBooking>('FleetBooking', FleetBookingSchema);

// ─── FleetPayment ───────────────────────────────────────
export interface IFleetPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  amount: number;
  paymentType: string;
  paymentMethod: string;
  status: string;
  transactionRef?: string;
  createdAt: Date;
}

const FleetPaymentSchema = new Schema<IFleetPayment>({
  bookingId: { type: Schema.Types.ObjectId, ref: 'FleetBooking', required: true },
  amount: { type: Number, required: true },
  paymentType: { type: String, required: true },
  paymentMethod: { type: String, default: 'Razorpay' },
  status: { type: String, default: 'Success' },
  transactionRef: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const FleetPayment = mongoose.model<IFleetPayment>('FleetPayment', FleetPaymentSchema);

// ─── FleetReview ────────────────────────────────────────
export interface IFleetReview extends Document {
  vehicleId: mongoose.Types.ObjectId;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
}

const FleetReviewSchema = new Schema<IFleetReview>({
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const FleetReview = mongoose.model<IFleetReview>('FleetReview', FleetReviewSchema);
