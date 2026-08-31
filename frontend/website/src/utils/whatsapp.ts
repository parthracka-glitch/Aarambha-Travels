/**
 * Aarambha Tours & Travels - WhatsApp Integration Helpers
 * Implements high-converting dispatch URLs and UTR payment proof formats
 * as documented in WHATSAPP_SYSTEM_BLUEPRINT.md
 */

export const AARAMBHA_HOTLINE_PHONE = '919067617451';
export const AARAMBHA_ACCOUNTS_PHONE = '919067617451';

export interface TourInquiryWhatsAppParams {
  packageTitle: string;
  durationDays?: number;
  datesLabel?: string;
  pricePerPerson?: number;
  travelerCount?: number;
  travelerName?: string;
  sourceCity?: string;
}

export interface RentalBookingWhatsAppParams {
  vehicleName: string;
  category: 'self-drive' | 'urbania' | 'bus';
  startDate?: string;
  endDate?: string;
  pickupLocation?: string;
  tariffPerDay?: number;
  estimatedKm?: number;
  customerName?: string;
}

export interface PaymentProofWhatsAppParams {
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  amountPaid: number;
  utrNumber: string;
  serviceType: string;
  accountPhone?: string;
}

/**
 * Generate WhatsApp message URL for Pilgrimage & Tour Inquiries
 */
export function createTourInquiryWhatsAppUrl(params: TourInquiryWhatsAppParams, phone = AARAMBHA_HOTLINE_PHONE): string {
  const text =
    `*🕉️ AARAMBHA SPIRITUAL TOUR INQUIRY*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🧭 *Tour Package:* ${params.packageTitle}\n` +
    (params.datesLabel ? `📅 *Departure Batch:* ${params.datesLabel}\n` : '') +
    (params.durationDays ? `⏳ *Duration:* ${params.durationDays} Days\n` : '') +
    (params.pricePerPerson ? `💰 *Price:* ₹${params.pricePerPerson.toLocaleString('en-IN')}/person\n` : '') +
    (params.travelerCount ? `👥 *Travelers:* ${params.travelerCount} Persons\n` : '') +
    (params.travelerName ? `👤 *Name:* ${params.travelerName}\n` : '') +
    (params.sourceCity ? `📍 *Pickup City:* ${params.sourceCity}\n` : '') +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `_Hello Aarambha Team, please share seat availability, VIP Darshan details, and complete day-wise itinerary._`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate WhatsApp message URL for Vehicle & Bus Rentals
 */
export function createRentalBookingWhatsAppUrl(params: RentalBookingWhatsAppParams, phone = AARAMBHA_HOTLINE_PHONE): string {
  const text =
    `*🚗 AARAMBHA FLEET & RENTAL INQUIRY*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🚘 *Vehicle Model:* ${params.vehicleName}\n` +
    `📋 *Category:* ${params.category.toUpperCase()}\n` +
    (params.startDate ? `📅 *Trip Dates:* ${params.startDate} to ${params.endDate || 'TBD'}\n` : '') +
    (params.pickupLocation ? `📍 *Pickup Location:* ${params.pickupLocation}\n` : '') +
    (params.tariffPerDay ? `💵 *Rate:* ₹${params.tariffPerDay.toLocaleString('en-IN')}/day\n` : '') +
    (params.estimatedKm ? `🛣️ *Est. Distance:* ${params.estimatedKm} KM\n` : '') +
    (params.customerName ? `👤 *Customer Name:* ${params.customerName}\n` : '') +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `_Hello, I would like to check availability and book this vehicle. Please share the final tariff and terms._`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Generate WhatsApp message URL for UPI / UTR Payment Proof Submission
 */
export function createPaymentProofWhatsAppUrl(params: PaymentProofWhatsAppParams): string {
  const accountPhone = params.accountPhone || AARAMBHA_ACCOUNTS_PHONE;
  const text =
    `*💰 ADVANCE PAYMENT PROOF SUBMISSION*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🔖 *Booking Reference:* ${params.bookingCode}\n` +
    `👤 *Customer Name:* ${params.customerName}\n` +
    `📞 *Customer Phone:* ${params.customerPhone}\n` +
    `📦 *Service:* ${params.serviceType}\n` +
    `💵 *Deposit Paid:* ₹${params.amountPaid.toLocaleString('en-IN')}\n` +
    `🔢 *UTR / Transaction Ref:* ${params.utrNumber}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `_I have completed the advance transfer. Please verify against our booking reference and send the official receipt/voucher._`;

  return `https://wa.me/${accountPhone}?text=${encodeURIComponent(text)}`;
}
