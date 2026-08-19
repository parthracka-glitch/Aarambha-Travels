import mongoose, { Schema, Document } from 'mongoose';

// ─── TourDestination ────────────────────────────────────
export interface ITourDestination extends Document {
  name: string;
  state: string;
  country: string;
  description?: string;
  imageUrl?: string;
}

const TourDestinationSchema = new Schema<ITourDestination>({
  name: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, default: 'India' },
  description: { type: String },
  imageUrl: { type: String },
});

export const TourDestination = mongoose.model<ITourDestination>('TourDestination', TourDestinationSchema);

// ─── TourItinerary ──────────────────────────────────────
export interface ITourItinerary {
  dayNumber: number;
  title: string;
  description: string;
  meals?: string;
  stayDetails?: string;
}

const TourItinerarySchema = new Schema<ITourItinerary>({
  dayNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  meals: { type: String },
  stayDetails: { type: String },
});

// ─── TourBatchDate ──────────────────────────────────────
export interface ITourBatchDate {
  id: string;
  month: string;
  label: string;
  tag: string;
  startDate: string;
  endDate: string;
  status?: 'available' | 'full' | 'disabled';
}

const TourBatchDateSchema = new Schema<ITourBatchDate>({
  id: { type: String, required: true },
  month: { type: String, required: true },
  label: { type: String, required: true },
  tag: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  status: { type: String, default: 'available' },
});

// ─── TourPackage ────────────────────────────────────────
export interface ITourPackage extends Document {
  slug: string;
  title: string;
  description: string;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  depositPrice: number;
  destinationId?: string;
  isActive: boolean;
  images: string[];
  inclusions: string[];
  itineraries: ITourItinerary[];
  batchDates?: ITourBatchDate[];
  createdAt: Date;
}

const TourPackageSchema = new Schema<ITourPackage>({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  durationDays: { type: Number, required: true },
  durationNights: { type: Number, required: true },
  basePrice: { type: Number, required: true },
  depositPrice: { type: Number, required: true },
  destinationId: { type: Schema.Types.ObjectId, ref: 'TourDestination' },
  isActive: { type: Boolean, default: true },
  images: [{ type: String }],
  inclusions: [{ type: String }],
  itineraries: [TourItinerarySchema],
  batchDates: [TourBatchDateSchema],
  createdAt: { type: Date, default: Date.now },
});

export const TourPackage = mongoose.model<ITourPackage>('TourPackage', TourPackageSchema);

// ─── TourCustomer ───────────────────────────────────────
export interface ITourCustomer extends Document {
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

const TourCustomerSchema = new Schema<ITourCustomer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const TourCustomer = mongoose.model<ITourCustomer>('TourCustomer', TourCustomerSchema);

// ─── TourInquiry ────────────────────────────────────────
export interface ITourInquiry extends Document {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageId?: string;
  travelDate?: string;
  paxCount: number;
  status: string;
  notes?: string;
  createdAt: Date;
}

const TourInquirySchema = new Schema<ITourInquiry>({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  packageId: { type: Schema.Types.ObjectId, ref: 'TourPackage' },
  travelDate: { type: String },
  paxCount: { type: Number, default: 1 },
  status: { type: String, default: 'New' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const TourInquiry = mongoose.model<ITourInquiry>('TourInquiry', TourInquirySchema);

// ─── TourBooking ────────────────────────────────────────
export interface ITourBooking extends Document {
  bookingCode: string;
  packageId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  travelDate: Date;
  paxCount: number;
  totalAmount: number;
  depositPaid: number;
  balanceAmount: number;
  status: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  agreementAccepted: boolean;
  agreementAcceptedAt?: Date;
  termsAccepted: boolean;
  termsAcceptedAt?: Date;
  termsVersion?: string;
  specialRequests?: string;
  createdAt: Date;
}

const TourBookingSchema = new Schema<ITourBooking>({
  bookingCode: { type: String, required: true, unique: true, index: true },
  packageId: { type: Schema.Types.ObjectId, ref: 'TourPackage', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'TourCustomer', required: true },
  customerName: { type: String },
  customerEmail: { type: String },
  customerPhone: { type: String },
  travelDate: { type: Date, required: true },
  paxCount: { type: Number, default: 1 },
  totalAmount: { type: Number, required: true },
  depositPaid: { type: Number, required: true },
  balanceAmount: { type: Number, required: true },
  status: { type: String, default: 'Deposit Paid' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  agreementAccepted: { type: Boolean, default: true },
  agreementAcceptedAt: { type: Date },
  termsAccepted: { type: Boolean, required: true, default: true },
  termsAcceptedAt: { type: Date, default: Date.now },
  termsVersion: { type: String, default: '2026.1-STANDARD' },
  specialRequests: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const TourBooking = mongoose.model<ITourBooking>('TourBooking', TourBookingSchema);

// ─── TourReview ─────────────────────────────────────────
export interface ITourReview extends Document {
  packageId: mongoose.Types.ObjectId;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
}

const TourReviewSchema = new Schema<ITourReview>({
  packageId: { type: Schema.Types.ObjectId, ref: 'TourPackage', required: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const TourReview = mongoose.model<ITourReview>('TourReview', TourReviewSchema);
