export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  destination?: string;
  state?: string;
  durationDays: number;
  durationNights: number;
  durationLabel?: string;
  datesLabel?: string;
  basePrice: number;
  priceDisplay?: string;
  depositPrice: number;
  advanceLabel?: string;
  rating?: number;
  reviewsCount?: number;
  images?: string[];
  image?: string;
  gallery?: string[];
  sites?: string[];
  inclusions: string[];
  exclusions?: string[];
  terms?: string[];
}

export interface Vehicle {
  id: string;
  name: string;
  regNumber: string;
  vehicleType: 'car' | 'bike';
  dailyRate: number;
  securityDeposit: number;
  status: string;
  images: string[];
}

export interface BookingState {
  serviceType: 'tours' | 'fleet';
  referenceId: string;
  depositPaid: number;
}
