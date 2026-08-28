# 📱 Instant WhatsApp Reminder, Dispatch & Notification System
## Complete Drop-In Blueprint & AI Prompt Specification

> **How to use this file:**  
> Copy and paste the **"AI Assistant Prompt"** section below directly into any AI assistant (ChatGPT, Claude, Cursor, Antigravity, GitHub Copilot) in your target project. It contains the complete working model, business logic, production-tested templates, and full TypeScript/React source code ready for immediate generation.

---

```markdown
# PROMPT TO COPY & PASTE INTO YOUR NEW PROJECT'S AI ASSISTANT:

I want you to implement the complete, production-grade WhatsApp Reminder, Dispatch & Notification System from Aarambha Tours & Travels into this project.

### System Requirements:
1. Zero-Cost, 100% Reliable Architecture: Do not rely on expensive third-party SMS/WhatsApp APIs (like Twilio or Gupshup). Use direct, deep-linked WhatsApp Web and Mobile protocol (`https://wa.me/<phone>?text=<encoded_text>`).
2. Dual-Vertical & Omnichannel Support: Built-in support for multiple service verticals (e.g., Tour Packages vs. Car/Vehicle Rentals vs. Bus Charters), with vertical-aware templates, status-based recommendation engine, and dynamic variable replacements.
3. Multi-Field Resilient Data Extraction: Automatically normalize any inconsistent booking object from MongoDB, SQL, or local state. Handle variations like `customerPhone`, `phone`, `mobile`, `contact_number`, `user.phone`, etc.
4. Intelligent Indian/International Phone Sanitizer: Auto-format 10-digit numbers with country code `91`, strip leading zeros, remove spaces/dashes, and validate lengths.
5. Interactive Admin CRM Modal Component:
   - Full booking details summary card (Customer, Service, Schedule, Financials, Advance, Due Balance).
   - Recipient customer WhatsApp phone router (editable, validated with status badges, and 1-click revert to booking phone).
   - Vertical-specific template selection cards with icons and descriptions.
   - Dynamic variable chips to insert tags at current cursor position in real-time.
   - Live editable message draft preview textarea with character counter.
   - 1-Click "Copy to Clipboard" button with confirmation state.
   - 1-Click "Open in WhatsApp & Send" button targeting the validated phone number.
6. Public Website Inquiries & Payment Verification:
   - Customer-side WhatsApp inquiry forms with automatic message synthesis.
   - UPI advance payment proof dispatcher for instant screenshot/UTR verification.

Please generate the entire system using the following exact templates, business details, and code structure below.
```

---

## 🏢 1. Business Configuration & Default Parameters

| Parameter | Value | Description |
| :--- | :--- | :--- |
| **Primary Tour Company Name** | `Aarambha Tours & Travels` | Displayed on tour packages, itineraries & balance dues |
| **Fleet / Rental Company Name**| `Aarambha Car Rentals` | Displayed on self-drive car & bus rental dispatches |
| **Tours WhatsApp Helpline** | `+91 90676 17451` (`919067617451`) | Direct support line for tour travelers |
| **Car Rentals WhatsApp Hotline** | `+91 82082 11478` (`918208211478`) | Dedicated car booking desk |
| **Bus Rentals & Urbania Hotline**| `+91 90218 78717` (`919021878717`) | Dedicated bus charter desk |
| **Fleet Operations & Dispatch** | `+91 78208 02985` (`917820802985`) | Hub manager & vehicle handover coordination |
| **Default Pickup Hub** | `Katraj Hub / Pune Airport Delivery Point` | Default hub for vehicle pickup |
| **Default Security Deposit** | `₹3,000` | Refundable deposit for self-drive cars |
| **Primary UPI Payee Name** | `Aarambh Travels` / `SHAM UMAKANT SURYAWANSHI` | Verified payee name for UPI transfers |
| **Primary UPI VPA** | `8208211478@ybl` | Direct UPI ID for deposits |

---

## 📜 2. Production WhatsApp Message Templates

The system features **10 specialized templates** partitioned by service vertical and customer lifecycle stage:

### Category A: Tours & Holiday Packages (`tour` vertical)

#### 1. Tour Booking Confirmation (`tour_confirmation`)
```text
Namaste {customer_name} 🙏

Thank you for choosing *{company_name}*! Your tour package booking has been confirmed. 🌄🏕️

📋 *Tour Summary:*
• *Booking ID:* {booking_id}
• *Tour Package:* {service_type}
• *Travel Dates:* {pickup_date} to {dropoff_date}
• *Travelers:* {pax_count}
• *Pickup Point:* {pickup_location}

💳 *Payment Summary:*
• *Total Fare:* ₹{total_amount}
• *Advance Paid:* ₹{advance_paid}
• *Balance at Departure:* ₹{balance_amount}

Our tour manager will coordinate with you prior to departure.

Helpline: {helpline_number}
Happy Travelling! 🌸
*{company_name}*
```

#### 2. Cab & Driver / Tour Guide Allotment (`tour_driver_allotment`)
```text
Namaste {customer_name} 🙏

Your travel ride & tour manager have been assigned! Here are your travel details: 🚖

• *Booking ID:* {booking_id}
• *Tour Package:* {service_type}
• *Assigned Vehicle:* {vehicle_name} ({vehicle_number})
• *Reporting Time:* {pickup_time} on {pickup_date}
• *Pickup Location:* {pickup_location}

👨✈️ *Driver / Tour Manager:*
• {driver_details}

Our team will contact you 30 minutes before reporting time.

Wish you a pleasant and comfortable journey! 🌸
*{company_name}*
```

#### 3. Tour Balance Due Reminder (`tour_balance_reminder`)
```text
Namaste {customer_name} 🙏

This is a friendly reminder regarding your upcoming tour with *{company_name}* ({booking_id}).

• *Tour Package:* {service_type}
• *Departure Date:* {pickup_date}
• *Pending Balance Fare:* ₹{balance_amount}

Please settle the remaining balance via UPI or bank transfer to ensure a hassle-free journey.

Helpline: {helpline_number}
Warm regards,
*{company_name}*
```

#### 4. Tour Itinerary & Important Guidelines (`tour_itinerary_guidelines`)
```text
Namaste {customer_name} 🙏

Here are the instructions and guidelines for your upcoming *{service_type}* tour with *{company_name}*! 🌄

• *Tour Dates:* {pickup_date} to {dropoff_date}
• *Reporting Time:* {pickup_time}
• *Reporting Hub:* {pickup_location}

📄 *Important Reminders:*
1. Carry Original Photo ID (Aadhaar / Passport)
2. Keep your booking ID ({booking_id}) handy
3. Comfortable clothing and personal medicines

For 24x7 tour assistance: {helpline_number}.

Have a memorable trip! 🌿
*{company_name}*
```

#### 5. Tour Completed & Thank You (`tour_completed_thanks`)
```text
Namaste {customer_name} 🙏

Thank you for traveling with *{company_name}* on the *{service_type}* tour! 🌟

We hope you had a spiritual, joyful, and memorable journey. We would love to hear your feedback!

We look forward to hosting you and your family again on your next holiday trip.

Warm regards,
*{company_name}*
```

---

### Category B: Self-Drive Cars & Bus Fleet (`fleet` vertical)

#### 6. Self-Drive Booking Confirmation (`self_drive_confirmation`)
```text
Namaste {customer_name} 🙏

Thank you for choosing *{company_name}*! Your self-drive car booking has been confirmed. 🚗✨

📋 *Booking Summary:*
• *Booking ID:* {booking_id}
• *Vehicle:* {vehicle_name}
• *Pickup Date & Time:* {pickup_date} at {pickup_time}
• *Drop-off Date & Time:* {dropoff_date} at {dropoff_time}
• *Pickup Location:* {pickup_location}

💳 *Payment Summary:*
• *Total Fare:* ₹{total_amount}
• *Advance Paid:* ₹{advance_paid}
• *Balance at Pickup:* ₹{balance_amount}
• *Refundable Security Deposit:* ₹{security_deposit}

📄 *Documents Required at Handover:*
1. Original Valid Driving License
2. Aadhaar Card / Passport

For any queries or assistance, contact us at {helpline_number}.

Have a safe and wonderful drive! 🌿
*{company_name}*
```

#### 7. Car Dispatch & Hub Handover (`vehicle_handover`)
```text
Namaste {customer_name} 🙏

Your self-drive vehicle is sanitized, inspected, and ready for pickup! 🚙💨

• *Vehicle:* {vehicle_name}
• *Vehicle Number:* {vehicle_number}
• *Pickup Hub:* {pickup_location}
• *Pickup Time:* {pickup_time} ({pickup_date})
• *Pending Balance + Deposit:* ₹{balance_amount} + ₹{security_deposit}

Kindly carry your Original Driving License for verification.

📍 Google Maps Hub Link: {pickup_location}
📞 Hub Manager: {helpline_number}

Drive safe!
*{company_name}*
```

#### 8. Bus / Coach Rental Dispatch (`bus_rental_dispatch`)
```text
Namaste {customer_name} 🙏

Your bus / coach rental has been scheduled and dispatched! 🚌💨

• *Booking ID:* {booking_id}
• *Coach / Bus:* {vehicle_name}
• *Vehicle Number:* {vehicle_number}
• *Reporting Schedule:* {pickup_time} on {pickup_date}
• *Reporting Hub:* {pickup_location}

👨✈️ *Driver Details:*
• {driver_details}

💳 *Payment Summary:*
• *Total Fare:* ₹{total_amount}
• *Advance Paid:* ₹{advance_paid}
• *Balance Due:* ₹{balance_amount}

📞 Support / Dispatch: {helpline_number}
Have a smooth journey!
*{company_name}*
```

#### 9. Rental Balance & Deposit Reminder (`fleet_payment_reminder`)
```text
Namaste {customer_name} 🙏

This is a friendly reminder regarding your upcoming rental booking with *{company_name}* ({booking_id}).

• *Vehicle:* {vehicle_name}
• *Pickup Date:* {pickup_date}
• *Pending Balance Amount:* ₹{balance_amount}
• *Refundable Deposit:* ₹{security_deposit}

Please settle the balance via UPI or at vehicle handover to ensure smooth dispatch.

Helpline: {helpline_number}
Warm regards,
*{company_name}*
```

#### 10. Rental Completed & Deposit Refund (`rental_completed_refund`)
```text
Namaste {customer_name} 🙏

Thank you for traveling with *{company_name}*! We hope you had a great driving experience with our {vehicle_name}. 🌟

• *Booking ID:* {booking_id}
• *Vehicle Returned On:* {dropoff_date}
• *Refundable Deposit Status:* Processed / Handed Over (₹{security_deposit})

We would love to host you again on your next road trip!

Warm regards,
*{company_name}*
```

---

## 🧩 3. Core Engine: `whatsappTemplates.ts`

Save this file at: `src/utils/whatsappTemplates.ts`

```typescript
export interface BookingDataInput {
  id?: string;
  _id?: string;
  type?: string;
  _vertical?: string;
  bookingCode?: string;
  booking_code?: string;
  customerName?: string;
  customer_name?: string;
  fullName?: string;
  name?: string;
  customerPhone?: string;
  customer_phone?: string;
  phone?: string;
  mobile?: string;
  contactNumber?: string;
  contact_number?: string;
  userPhone?: string;
  guestPhone?: string;
  customerDetails?: { phone?: string; customerPhone?: string; name?: string };
  user?: { phone?: string; email?: string; name?: string };
  customerEmail?: string;
  customer_email?: string;
  email?: string;
  vehicleName?: string;
  packageName?: string;
  title?: string;
  vehicleId?: { name?: string; regNumber?: string; reg_number?: string; dailyRate?: number; securityDeposit?: number };
  packageId?: { title?: string; slug?: string; basePrice?: number };
  regNumber?: string;
  reg_number?: string;
  vehicleNumber?: string;
  licenseNumber?: string;
  serviceType?: string;
  service_type?: string;
  travelDate?: string;
  pickupDatetime?: string;
  pickupDate?: string;
  startDate?: string;
  dropoffDatetime?: string;
  dropoffDate?: string;
  returnDate?: string;
  endDate?: string;
  pickupTime?: string;
  dropoffTime?: string;
  pickupLocation?: string;
  pickup_location?: string;
  location?: string;
  totalAmount?: number;
  total_amount?: number;
  totalPrice?: number;
  totalRentalAmount?: number;
  total_rental_amount?: number;
  depositAmount?: number;
  depositPaid?: number;
  deposit_paid?: number;
  advancePaid?: number;
  securityDepositAmount?: number;
  security_deposit_amount?: number;
  securityDeposit?: number;
  security_deposit?: number;
  driverDetails?: string;
  driver_details?: string;
  driverName?: string;
  driverPhone?: string;
  paxCount?: number;
  seats?: number;
  status?: string;
  paymentMethod?: string;
  utrNumber?: string;
  [key: string]: any;
}

export type BookingVertical = 'tour' | 'fleet';

export interface ExtractedBookingDetails {
  vertical: BookingVertical;
  customer_name: string;
  customer_phone: string;
  raw_customer_phone: string;
  display_phone: string;
  customer_email: string;
  booking_id: string;
  raw_code: string;
  vehicle_name: string;
  vehicle_number: string;
  service_type: string;
  pax_count: string;
  pickup_date: string;
  pickup_time: string;
  dropoff_date: string;
  dropoff_time: string;
  pickup_location: string;
  total_amount: string;
  advance_paid: string;
  balance_amount: string;
  security_deposit: string;
  driver_details: string;
  company_name: string;
  helpline_number: string;
  status: string;
  is_fleet: boolean;
  clean_phone: string;
  is_phone_valid: boolean;
}

export const DEFAULT_COMPANY_NAME = 'Aarambha Tours & Travels';
export const DEFAULT_CAR_RENTAL_COMPANY_NAME = 'Aarambha Car Rentals';
export const DEFAULT_HELPLINE_NUMBER = '+91 78208 02985 / +91 82082 11478';
export const DEFAULT_PICKUP_HUB = 'Katraj Hub / Pune Airport Delivery Point';
export const DEFAULT_SECURITY_DEPOSIT = 3000;

export function formatDateSafe(d?: string | Date): string {
  if (!d) return 'Scheduled Date';
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return String(d);
  }
}

function extractTime(dtStr?: string, defaultFallback = '09:00 AM'): string {
  if (!dtStr) return defaultFallback;
  try {
    const d = new Date(dtStr);
    if (isNaN(d.getTime())) return defaultFallback;
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return defaultFallback;
  }
}

export function sanitizeWhatsAppPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  let clean = String(phone).replace(/[^0-9]/g, '');
  if (!clean) return '';
  if (clean.length === 11 && clean.startsWith('0')) clean = clean.substring(1);
  if (clean.length === 10) clean = `91${clean}`;
  return clean;
}

export function isValidWhatsAppPhone(phone: string | null | undefined): boolean {
  if (!phone) return false;
  const clean = sanitizeWhatsAppPhone(phone);
  return clean.length >= 10 && clean.length <= 15;
}

export function formatDisplayPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  const clean = sanitizeWhatsAppPhone(phone);
  if (!clean) return phone;
  if (clean.startsWith('91') && clean.length === 12) {
    const main = clean.substring(2);
    return `+91 ${main.substring(0, 5)} ${main.substring(5)}`;
  }
  return `+${clean}`;
}

export function getBookingVertical(raw: BookingDataInput | null | undefined): BookingVertical {
  if (!raw) return 'tour';
  const typeStr = (raw.type || raw._vertical || '').toLowerCase();
  if (
    typeStr === 'tours' ||
    typeStr === 'tour' ||
    Boolean(raw.packageId) ||
    Boolean(raw.packageName && !raw.vehicleId && !raw.regNumber && !raw.reg_number)
  ) {
    return 'tour';
  }
  if (
    typeStr === 'fleet' ||
    typeStr === 'rental' ||
    typeStr === 'car' ||
    typeStr === 'bus' ||
    Boolean(raw.vehicleId) ||
    Boolean(raw.regNumber || raw.reg_number || raw.vehicleNumber)
  ) {
    return 'fleet';
  }
  const nameCheck = (raw.packageName || raw.title || raw.vehicleName || '').toLowerCase();
  if (nameCheck.includes('tour') || nameCheck.includes('yatra') || nameCheck.includes('darshan') || nameCheck.includes('package')) {
    return 'tour';
  }
  return 'fleet';
}

export function extractBookingDetails(raw: BookingDataInput | null | undefined): ExtractedBookingDetails {
  const vertical = getBookingVertical(raw);
  const isFleet = vertical === 'fleet';

  if (!raw) {
    return {
      vertical: 'tour',
      customer_name: 'Valued Customer',
      customer_phone: '',
      raw_customer_phone: '',
      display_phone: 'No Phone Provided',
      customer_email: '',
      booking_id: '#TR-0000',
      raw_code: 'TR-0000',
      vehicle_name: 'Tour / Rental Service',
      vehicle_number: 'MH 12 AB 1234',
      service_type: 'Outstation Tour Package',
      pax_count: '2 Pax',
      pickup_date: 'Today',
      pickup_time: '09:00 AM',
      dropoff_date: 'Return Date',
      dropoff_time: '08:00 PM',
      pickup_location: DEFAULT_PICKUP_HUB,
      total_amount: '0',
      advance_paid: '0',
      balance_amount: '0',
      security_deposit: '0',
      driver_details: 'Tour Manager: Ramesh Patil (+91 78208 02985)',
      company_name: DEFAULT_COMPANY_NAME,
      helpline_number: DEFAULT_HELPLINE_NUMBER,
      status: 'Confirmed',
      is_fleet: false,
      clean_phone: '',
      is_phone_valid: false,
    };
  }

  const rawCode =
    raw.bookingCode ||
    raw.booking_code ||
    raw.id ||
    raw._id ||
    `TR-${Math.floor(1000 + Math.random() * 9000)}`;

  const bookingIdFormatted = rawCode.startsWith('#') ? rawCode : `#${rawCode}`;

  const customerName =
    raw.customerName ||
    raw.customer_name ||
    raw.fullName ||
    raw.name ||
    'Valued Customer';

  const rawCustomerPhone =
    raw.customerPhone ||
    raw.customer_phone ||
    raw.phone ||
    raw.mobile ||
    raw.contactNumber ||
    raw.contact_number ||
    raw.userPhone ||
    raw.guestPhone ||
    raw.customerDetails?.phone ||
    raw.customerDetails?.customerPhone ||
    raw.user?.phone ||
    '';

  const cleanPhone = sanitizeWhatsAppPhone(rawCustomerPhone);
  const displayPhone = formatDisplayPhone(rawCustomerPhone);
  const isPhoneValid = isValidWhatsAppPhone(rawCustomerPhone);

  const customerEmail =
    raw.customerEmail ||
    raw.customer_email ||
    raw.email ||
    raw.user?.email ||
    '';

  const vehicleName =
    raw.vehicleId?.name ||
    raw.vehicleName ||
    (isFleet ? 'Mahindra Thar 4x4 / Swift Dzire' : 'Aarambha Tour Coach');

  const tourPackageName =
    raw.packageId?.title ||
    raw.packageName ||
    raw.title ||
    raw.serviceType ||
    raw.service_type ||
    'Aarambha Tour Package';

  const serviceType = isFleet
    ? raw.serviceType || raw.service_type || (vehicleName.toLowerCase().includes('bus') || vehicleName.toLowerCase().includes('urbania') ? 'Bus / Coach Rental' : 'Self-Drive Rental')
    : tourPackageName;

  const vehicleNumber =
    raw.vehicleId?.regNumber ||
    raw.vehicleId?.reg_number ||
    raw.vehicleNumber ||
    raw.regNumber ||
    raw.reg_number ||
    (isFleet ? 'MH 12 AB 1234' : 'MH 12 TC 5678');

  const paxCountNum = raw.paxCount || raw.seats || 1;
  const paxCount = `${paxCountNum} Pax`;

  const pickupRaw =
    raw.pickupDatetime ||
    raw.pickup_datetime ||
    raw.pickupDate ||
    raw.travelDate ||
    raw.startDate;

  const dropoffRaw =
    raw.dropoffDatetime ||
    raw.dropoff_datetime ||
    raw.dropoffDate ||
    raw.returnDate ||
    raw.endDate;

  const pickupDateFormatted = pickupRaw ? formatDateSafe(pickupRaw) : 'Scheduled Date';
  const pickupTimeFormatted = raw.pickupTime || extractTime(pickupRaw, '06:00 AM');

  const dropoffDateFormatted = dropoffRaw ? formatDateSafe(dropoffRaw) : (pickupRaw ? formatDateSafe(pickupRaw) : 'Return Date');
  const dropoffTimeFormatted = raw.dropoffTime || extractTime(dropoffRaw, '08:00 PM');

  const pickupLocation =
    raw.pickupLocation ||
    raw.pickup_location ||
    raw.location ||
    (isFleet ? DEFAULT_PICKUP_HUB : 'Pune / Designated Pickup Point');

  const totalNum = Number(
    raw.totalAmount ??
    raw.total_amount ??
    raw.totalPrice ??
    raw.totalRentalAmount ??
    raw.total_rental_amount ??
    0
  );

  const advanceNum = Number(
    raw.depositAmount ??
    raw.depositPaid ??
    raw.deposit_paid ??
    raw.advancePaid ??
    0
  );

  const balanceNum = Math.max(0, totalNum - advanceNum);

  const securityDepositNum = Number(
    raw.securityDepositAmount ??
    raw.security_deposit_amount ??
    raw.securityDeposit ??
    raw.security_deposit ??
    raw.vehicleId?.securityDeposit ??
    (isFleet ? DEFAULT_SECURITY_DEPOSIT : 0)
  );

  let driverDetails =
    raw.driverDetails ||
    raw.driver_details ||
    (raw.driverName
      ? `${raw.driverName} (${raw.driverPhone || 'Contact assigned on dispatch'})`
      : isFleet
        ? 'Assigned Driver / Hub Manager: +91 78208 02985'
        : 'Tour Manager: Ramesh Patil (+91 78208 02985)');

  const companyName = isFleet ? DEFAULT_CAR_RENTAL_COMPANY_NAME : DEFAULT_COMPANY_NAME;

  return {
    vertical,
    customer_name: customerName,
    customer_phone: rawCustomerPhone,
    raw_customer_phone: rawCustomerPhone,
    display_phone: displayPhone,
    customer_email: customerEmail,
    booking_id: bookingIdFormatted,
    raw_code: rawCode,
    vehicle_name: isFleet ? vehicleName : tourPackageName,
    vehicle_number: vehicleNumber,
    service_type: serviceType,
    pax_count: paxCount,
    pickup_date: pickupDateFormatted,
    pickup_time: pickupTimeFormatted,
    dropoff_date: dropoffDateFormatted,
    dropoff_time: dropoffTimeFormatted,
    pickup_location: pickupLocation,
    total_amount: totalNum.toLocaleString('en-IN'),
    advance_paid: advanceNum.toLocaleString('en-IN'),
    balance_amount: balanceNum.toLocaleString('en-IN'),
    security_deposit: securityDepositNum.toLocaleString('en-IN'),
    driver_details: driverDetails,
    company_name: companyName,
    helpline_number: DEFAULT_HELPLINE_NUMBER,
    status: raw.status || 'Confirmed',
    is_fleet: isFleet,
    clean_phone: cleanPhone,
    is_phone_valid: isPhoneValid,
  };
}

export function renderBookingTemplate(templateBody: string, bookingData: BookingDataInput | null | undefined): string {
  const details = extractBookingDetails(bookingData);

  return templateBody
    .replace(/\{customer_name\}/g, details.customer_name)
    .replace(/\{booking_id\}/g, details.booking_id)
    .replace(/\{vehicle_name\}/g, details.vehicle_name)
    .replace(/\{vehicle_number\}/g, details.vehicle_number)
    .replace(/\{service_type\}/g, details.service_type)
    .replace(/\{pax_count\}/g, details.pax_count)
    .replace(/\{pickup_date\}/g, details.pickup_date)
    .replace(/\{pickup_time\}/g, details.pickup_time)
    .replace(/\{dropoff_date\}/g, details.dropoff_date)
    .replace(/\{dropoff_time\}/g, details.dropoff_time)
    .replace(/\{pickup_location\}/g, details.pickup_location)
    .replace(/\{total_amount\}/g, details.total_amount)
    .replace(/\{advance_paid\}/g, details.advance_paid)
    .replace(/\{balance_amount\}/g, details.balance_amount)
    .replace(/\{security_deposit\}/g, details.security_deposit)
    .replace(/\{driver_details\}/g, details.driver_details)
    .replace(/\{company_name\}/g, details.company_name)
    .replace(/\{helpline_number\}/g, details.helpline_number);
}

export interface MessageTemplate {
  id: string;
  title: string;
  icon: string;
  vertical: BookingVertical;
  description: string;
  template: string;
}

export const TOUR_TEMPLATES: MessageTemplate[] = [
  {
    id: 'tour_confirmation',
    title: 'Tour Booking Confirmation',
    icon: '🗺️',
    vertical: 'tour',
    description: 'Tour summary, travel dates, passenger count & advance receipt',
    template:
      'Namaste {customer_name} 🙏\n\nThank you for choosing *{company_name}*! Your tour package booking has been confirmed. 🌄🏕️\n\n📋 *Tour Summary:*\n• *Booking ID:* {booking_id}\n• *Tour Package:* {service_type}\n• *Travel Dates:* {pickup_date} to {dropoff_date}\n• *Travelers:* {pax_count}\n• *Pickup Point:* {pickup_location}\n\n💳 *Payment Summary:*\n• *Total Fare:* ₹{total_amount}\n• *Advance Paid:* ₹{advance_paid}\n• *Balance at Departure:* ₹{balance_amount}\n\nOur tour manager will coordinate with you prior to departure.\n\nHelpline: {helpline_number}\nHappy Travelling! 🌸\n*{company_name}*',
  },
  {
    id: 'tour_driver_allotment',
    title: 'Cab & Driver / Guide Allotment',
    icon: '🚖',
    vertical: 'tour',
    description: 'Assigned chauffeur/guide name, phone, cab number & reporting time',
    template:
      'Namaste {customer_name} 🙏\n\nYour travel ride & tour manager have been assigned! Here are your travel details: 🚖\n\n• *Booking ID:* {booking_id}\n• *Tour Package:* {service_type}\n• *Assigned Vehicle:* {vehicle_name} ({vehicle_number})\n• *Reporting Time:* {pickup_time} on {pickup_date}\n• *Pickup Location:* {pickup_location}\n\n👨✈️ *Driver / Tour Manager:*\n• {driver_details}\n\nOur team will contact you 30 minutes before reporting time.\n\nWish you a pleasant and comfortable journey! 🌸\n*{company_name}*',
  },
  {
    id: 'tour_balance_reminder',
    title: 'Tour Balance Due Reminder',
    icon: '💰',
    vertical: 'tour',
    description: 'Balance settlement reminder for holiday & yatra packages',
    template:
      'Namaste {customer_name} 🙏\n\nThis is a friendly reminder regarding your upcoming tour with *{company_name}* ({booking_id}).\n\n• *Tour Package:* {service_type}\n• *Departure Date:* {pickup_date}\n• *Pending Balance Fare:* ₹{balance_amount}\n\nPlease settle the remaining balance via UPI or bank transfer to ensure a hassle-free journey.\n\nHelpline: {helpline_number}\nWarm regards,\n*{company_name}*',
  },
  {
    id: 'tour_itinerary_guidelines',
    title: 'Tour Itinerary & Guidelines',
    icon: '📋',
    vertical: 'tour',
    description: 'Detailed instructions, reporting time & required documents',
    template:
      'Namaste {customer_name} 🙏\n\nHere are the instructions and guidelines for your upcoming *{service_type}* tour with *{company_name}*! 🌄\n\n• *Tour Dates:* {pickup_date} to {dropoff_date}\n• *Reporting Time:* {pickup_time}\n• *Reporting Hub:* {pickup_location}\n\n📄 *Important Reminders:*\n1. Carry Original Photo ID (Aadhaar / Passport)\n2. Keep your booking ID ({booking_id}) handy\n3. Comfortable clothing and personal medicines\n\nFor 24x7 tour assistance: {helpline_number}.\n\nHave a memorable trip! 🌿\n*{company_name}*',
  },
  {
    id: 'tour_completed_thanks',
    title: 'Tour Completed & Thank You',
    icon: '🌸',
    vertical: 'tour',
    description: 'Post-tour appreciation, feedback & future travel invitation',
    template:
      'Namaste {customer_name} 🙏\n\nThank you for traveling with *{company_name}* on the *{service_type}* tour! 🌟\n\nWe hope you had a spiritual, joyful, and memorable journey. We would love to hear your feedback!\n\nWe look forward to hosting you and your family again on your next holiday trip.\n\nWarm regards,\n*{company_name}*',
  },
];

export const FLEET_TEMPLATES: MessageTemplate[] = [
  {
    id: 'self_drive_confirmation',
    title: 'Self-Drive Booking Confirmation',
    icon: '🚗',
    vertical: 'fleet',
    description: 'Car model, dates, fare breakdown, deposit & KYC documents',
    template:
      'Namaste {customer_name} 🙏\n\nThank you for choosing *{company_name}*! Your self-drive car booking has been confirmed. 🚗✨\n\n📋 *Booking Summary:*\n• *Booking ID:* {booking_id}\n• *Vehicle:* {vehicle_name}\n• *Pickup Date & Time:* {pickup_date} at {pickup_time}\n• *Drop-off Date & Time:* {dropoff_date} at {dropoff_time}\n• *Pickup Location:* {pickup_location}\n\n💳 *Payment Summary:*\n• *Total Fare:* ₹{total_amount}\n• *Advance Paid:* ₹{advance_paid}\n• *Balance at Pickup:* ₹{balance_amount}\n• *Refundable Security Deposit:* ₹{security_deposit}\n\n📄 *Documents Required at Handover:*\n1. Original Valid Driving License\n2. Aadhaar Card / Passport\n\nFor any queries or assistance, contact us at {helpline_number}.\n\nHave a safe and wonderful drive! 🌿\n*{company_name}*',
  },
  {
    id: 'vehicle_handover',
    title: 'Car Dispatch & Hub Handover',
    icon: '🔑',
    vertical: 'fleet',
    description: 'Vehicle ready notice, plate number, hub location & balance due',
    template:
      'Namaste {customer_name} 🙏\n\nYour self-drive vehicle is sanitized, inspected, and ready for pickup! 🚙💨\n\n• *Vehicle:* {vehicle_name}\n• *Vehicle Number:* {vehicle_number}\n• *Pickup Hub:* {pickup_location}\n• *Pickup Time:* {pickup_time} ({pickup_date})\n• *Pending Balance + Deposit:* ₹{balance_amount} + ₹{security_deposit}\n\nKindly carry your Original Driving License for verification.\n\n📍 Google Maps Hub Link: {pickup_location}\n📞 Hub Manager: {helpline_number}\n\nDrive safe!\n*{company_name}*',
  },
  {
    id: 'bus_rental_dispatch',
    title: 'Bus / Coach Rental Dispatch',
    icon: '🚌',
    vertical: 'fleet',
    description: 'Coach allotment, driver details, included km & dispatch notes',
    template:
      'Namaste {customer_name} 🙏\n\nYour bus / coach rental has been scheduled and dispatched! 🚌💨\n\n• *Booking ID:* {booking_id}\n• *Coach / Bus:* {vehicle_name}\n• *Vehicle Number:* {vehicle_number}\n• *Reporting Schedule:* {pickup_time} on {pickup_date}\n• *Reporting Hub:* {pickup_location}\n\n👨✈️ *Driver Details:*\n• {driver_details}\n\n💳 *Payment Summary:*\n• *Total Fare:* ₹{total_amount}\n• *Advance Paid:* ₹{advance_paid}\n• *Balance Due:* ₹{balance_amount}\n\n📞 Support / Dispatch: {helpline_number}\nHave a smooth journey!\n*{company_name}*',
  },
  {
    id: 'fleet_payment_reminder',
    title: 'Rental Balance & Deposit Reminder',
    icon: '💰',
    vertical: 'fleet',
    description: 'Balance & security deposit reminder before vehicle handover',
    template:
      'Namaste {customer_name} 🙏\n\nThis is a friendly reminder regarding your upcoming rental booking with *{company_name}* ({booking_id}).\n\n• *Vehicle:* {vehicle_name}\n• *Pickup Date:* {pickup_date}\n• *Pending Balance Amount:* ₹{balance_amount}\n• *Refundable Deposit:* ₹{security_deposit}\n\nPlease settle the balance via UPI or at vehicle handover to ensure smooth dispatch.\n\nHelpline: {helpline_number}\nWarm regards,\n*{company_name}*',
  },
  {
    id: 'rental_completed_refund',
    title: 'Rental Completed & Deposit Refund',
    icon: '🏁',
    vertical: 'fleet',
    description: 'Vehicle returned notice & security deposit refund status',
    template:
      'Namaste {customer_name} 🙏\n\nThank you for traveling with *{company_name}*! We hope you had a great driving experience with our {vehicle_name}. 🌟\n\n• *Booking ID:* {booking_id}\n• *Vehicle Returned On:* {dropoff_date}\n• *Refundable Deposit Status:* Processed / Handed Over (₹{security_deposit})\n\nWe would love to host you again on your next road trip!\n\nWarm regards,\n*{company_name}*',
  },
];

export function getTemplatesForBooking(booking: BookingDataInput | null | undefined): MessageTemplate[] {
  const vertical = getBookingVertical(booking);
  return vertical === 'tour' ? TOUR_TEMPLATES : FLEET_TEMPLATES;
}

export const TOUR_INSERTABLE_VARIABLES = [
  { tag: '{customer_name}', label: 'Customer Name' },
  { tag: '{booking_id}', label: 'Booking ID' },
  { tag: '{service_type}', label: 'Tour Package' },
  { tag: '{pickup_date}', label: 'Start Date' },
  { tag: '{dropoff_date}', label: 'Return Date' },
  { tag: '{pax_count}', label: 'Travelers (Pax)' },
  { tag: '{pickup_location}', label: 'Pickup Point' },
  { tag: '{total_amount}', label: 'Total Fare' },
  { tag: '{advance_paid}', label: 'Advance Paid' },
  { tag: '{balance_amount}', label: 'Balance Due' },
  { tag: '{driver_details}', label: 'Tour Guide / Driver' },
  { tag: '{helpline_number}', label: 'Helpline' },
];

export const FLEET_INSERTABLE_VARIABLES = [
  { tag: '{customer_name}', label: 'Customer Name' },
  { tag: '{booking_id}', label: 'Booking ID' },
  { tag: '{vehicle_name}', label: 'Vehicle Model' },
  { tag: '{vehicle_number}', label: 'Plate Number' },
  { tag: '{pickup_date}', label: 'Pickup Date' },
  { tag: '{pickup_time}', label: 'Pickup Time' },
  { tag: '{dropoff_date}', label: 'Drop Date' },
  { tag: '{dropoff_time}', label: 'Drop Time' },
  { tag: '{pickup_location}', label: 'Pickup Hub' },
  { tag: '{total_amount}', label: 'Total Fare' },
  { tag: '{advance_paid}', label: 'Advance Paid' },
  { tag: '{balance_amount}', label: 'Balance Due' },
  { tag: '{security_deposit}', label: 'Security Deposit' },
  { tag: '{driver_details}', label: 'Driver Details' },
  { tag: '{helpline_number}', label: 'Helpline' },
];

export function getRecommendedTemplateId(booking: BookingDataInput | null | undefined): string {
  const vertical = getBookingVertical(booking);
  const status = (booking?.status || '').toLowerCase();

  if (vertical === 'tour') {
    if (status.includes('complete') || status.includes('return')) return 'tour_completed_thanks';
    if (status.includes('guide') || status.includes('driver') || status.includes('allot')) return 'tour_driver_allotment';
    if (status.includes('pending') || status.includes('partial')) return 'tour_balance_reminder';
    return 'tour_confirmation';
  } else {
    const isBus = (booking?.vehicleName || booking?.serviceType || '').toLowerCase().includes('bus') || (booking?.vehicleName || '').toLowerCase().includes('urbania');
    if (status.includes('return') || status.includes('complete') || status.includes('refund')) return 'rental_completed_refund';
    if (status.includes('pickup') || status.includes('handover') || status.includes('deposit paid')) {
      return isBus ? 'bus_rental_dispatch' : 'vehicle_handover';
    }
    if (status.includes('pending') || status.includes('partial')) return 'fleet_payment_reminder';
    return isBus ? 'bus_rental_dispatch' : 'self_drive_confirmation';
  }
}
```

---

## 💻 4. Interactive UI: `WhatsAppBookingModal.tsx`

Save this file at: `src/components/common/WhatsAppBookingModal.tsx`

```tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  X, MessageSquare, Copy, Check, Send, Phone, User, Calendar, Car, Compass,
  Sparkles, RefreshCw, AlertCircle, ShieldCheck, MapPin, DollarSign, Edit3, Users,
  CheckCircle2, AlertTriangle, RotateCcw
} from 'lucide-react';
import {
  BookingDataInput,
  getTemplatesForBooking,
  TOUR_INSERTABLE_VARIABLES,
  FLEET_INSERTABLE_VARIABLES,
  extractBookingDetails,
  renderBookingTemplate,
  getRecommendedTemplateId,
  sanitizeWhatsAppPhone,
  isValidWhatsAppPhone,
  MessageTemplate
} from '@/utils/whatsappTemplates';

interface WhatsAppBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDataInput | null;
  defaultTemplateId?: string;
}

export function WhatsAppBookingModal({
  isOpen,
  onClose,
  booking,
  defaultTemplateId,
}: WhatsAppBookingModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const bookingDetails = extractBookingDetails(booking);
  const isTour = bookingDetails.vertical === 'tour';
  const availableTemplates = getTemplatesForBooking(booking);
  const insertableVars = isTour ? TOUR_INSERTABLE_VARIABLES : FLEET_INSERTABLE_VARIABLES;

  useEffect(() => {
    if (isOpen && booking) {
      const templates = getTemplatesForBooking(booking);
      const initialTemplateId =
        defaultTemplateId && templates.some((t) => t.id === defaultTemplateId)
          ? defaultTemplateId
          : getRecommendedTemplateId(booking);

      setSelectedTemplateId(initialTemplateId);
      const matchedTemplate =
        templates.find((t) => t.id === initialTemplateId) || templates[0];

      if (matchedTemplate) {
        const parsed = renderBookingTemplate(matchedTemplate.template, booking);
        setMessageText(parsed);
      }

      const initialPhone = bookingDetails.raw_customer_phone || bookingDetails.clean_phone || '';
      setRecipientPhone(initialPhone);
      setCopied(false);
    }
  }, [isOpen, booking, defaultTemplateId]);

  if (!isOpen || !booking) return null;

  const cleanRecipient = sanitizeWhatsAppPhone(recipientPhone);
  const isPhoneValid = isValidWhatsAppPhone(recipientPhone);
  const isModifiedFromBooking = recipientPhone !== (bookingDetails.raw_customer_phone || '');

  const handleSelectTemplate = (template: MessageTemplate) => {
    setSelectedTemplateId(template.id);
    const parsed = renderBookingTemplate(template.template, booking);
    setMessageText(parsed);
  };

  const handleResetCurrentTemplate = () => {
    const matchedTemplate =
      availableTemplates.find((t) => t.id === selectedTemplateId) ||
      availableTemplates[0];
    if (matchedTemplate) {
      const parsed = renderBookingTemplate(matchedTemplate.template, booking);
      setMessageText(parsed);
    }
  };

  const handleResetRecipientPhone = () => {
    setRecipientPhone(bookingDetails.raw_customer_phone || '');
  };

  const handleInsertVariable = (tag: string) => {
    if (!textareaRef.current) {
      setMessageText((prev) => prev + ` ${tag}`);
      return;
    }

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = messageText.substring(0, start);
    const after = messageText.substring(end);

    const newText = before + tag + after;
    const parsed = renderBookingTemplate(newText, booking);
    setMessageText(parsed);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const nextPos = start + tag.length;
        textareaRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 50);
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSendWhatsApp = () => {
    if (!cleanRecipient || !isPhoneValid) {
      alert('Please enter a valid 10-digit customer WhatsApp phone number before sending.');
      return;
    }

    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${cleanRecipient}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-gray-100 my-auto">
        
        {/* HEADER */}
        <div className={`px-5 py-4 border-b border-gray-100 flex items-center justify-between text-white ${
          isTour
            ? 'bg-gradient-to-r from-emerald-950 via-[#12382D] to-[#0A2620]'
            : 'bg-gradient-to-r from-[#171F38] via-[#1E294B] to-[#121A30]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner ${
              isTour
                ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-400'
                : 'bg-indigo-500/20 border border-indigo-400/30 text-indigo-300'
            }`}>
              {isTour ? <Compass className="w-5 h-5" /> : <Car className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-syne tracking-tight">
                  {isTour ? 'Tour Package WhatsApp Dispatch' : 'Self-Drive & Fleet Dispatch'}
                </h3>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  isTour
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}>
                  {isTour ? '🗺️ Tours & Packages Only' : '🚗 Self-Drive / Fleet Only'}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                {isTour
                  ? 'Send curated itinerary confirmations, driver allotments & tour balance reminders to customer.'
                  : 'Send vehicle handover notices, hub pickup maps & deposit refund confirmations to customer.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">

          {/* 1. SUMMARY CARD */}
          <div className={`border rounded-2xl p-3.5 sm:p-4 grid grid-cols-1 md:grid-cols-4 gap-3 shadow-xs ${
            isTour ? 'bg-emerald-50/40 border-emerald-100' : 'bg-slate-50 border-slate-200/80'
          }`}>
            <div className="space-y-1 md:border-r border-gray-200/80 pr-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
                <User className="w-3 h-3 text-emerald-600" /> Customer Name
              </span>
              <div className="font-bold text-sm text-gray-900 truncate">{bookingDetails.customer_name}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                <span className="font-mono">{bookingDetails.display_phone}</span>
              </div>
            </div>

            <div className="space-y-1 md:border-r border-gray-200/80 pr-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
                {isTour ? <Compass className="w-3 h-3 text-emerald-600" /> : <Car className="w-3 h-3 text-indigo-600" />}
                {isTour ? 'Tour Package' : 'Assigned Vehicle'}
              </span>
              <div className="font-bold text-gray-900 text-xs truncate">{bookingDetails.service_type}</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {isTour ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded flex items-center gap-1">
                    <Users className="w-3 h-3" /> {bookingDetails.pax_count}
                  </span>
                ) : (
                  <span className="font-mono text-[10px] bg-slate-200/80 px-2 py-0.5 rounded font-bold text-slate-700">
                    {bookingDetails.vehicle_number}
                  </span>
                )}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isTour ? 'bg-amber-100/80 text-amber-900' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  {bookingDetails.status}
                </span>
              </div>
            </div>

            <div className="space-y-1 md:border-r border-gray-200/80 pr-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-600" />
                {isTour ? 'Travel Dates' : 'Rental Duration'}
              </span>
              <div className="text-[11px] text-gray-800 font-semibold truncate">
                {isTour ? 'Departure:' : 'Pickup:'} {bookingDetails.pickup_date} ({bookingDetails.pickup_time})
              </div>
              <div className="text-[10px] text-gray-500 truncate">
                {isTour ? 'Return:' : 'Drop-off:'} {bookingDetails.dropoff_date} ({bookingDetails.dropoff_time})
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-600" /> Payment Summary
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-gray-500">Total:</span>
                <span className="font-bold text-gray-900">₹{bookingDetails.total_amount}</span>
              </div>
              <div className="flex items-baseline justify-between text-[11px]">
                <span className="text-emerald-700 font-medium">Advance: ₹{bookingDetails.advance_paid}</span>
                <span className="text-red-600 font-bold bg-red-50 px-1.5 py-0.2 rounded">
                  Due: ₹{bookingDetails.balance_amount}
                </span>
              </div>
            </div>
          </div>

          {/* 2. RECIPIENT PHONE ROUTING BOX */}
          <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/50 border border-emerald-200/90 rounded-2xl p-3.5 flex items-center justify-between gap-3 flex-wrap">
            <div className="space-y-1 flex-1 min-w-[260px]">
              <div className="flex items-center gap-2">
                <label htmlFor="recipient-phone-input" className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Recipient Customer WhatsApp Number:</span>
                </label>
                {isPhoneValid ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {isModifiedFromBooking ? 'Custom Recipient' : 'Booking Phone Verified'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3 text-amber-600" /> Needs Valid Phone
                  </span>
                )}
              </div>
              <p className="text-[10px] text-emerald-800/80">
                Direct dispatch via <span className="font-mono font-bold">wa.me/{cleanRecipient || '...'}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <span className="absolute left-3 font-mono font-bold text-xs text-gray-500 select-none">
                  🇮🇳
                </span>
                <input
                  id="recipient-phone-input"
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="Enter 10-digit phone"
                  className="pl-9 pr-3 py-1.5 bg-white border border-emerald-300 rounded-xl font-mono font-bold text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner w-44"
                />
              </div>

              {isModifiedFromBooking && (
                <button
                  type="button"
                  onClick={handleResetRecipientPhone}
                  className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> Revert
                </button>
              )}
            </div>
          </div>

          {/* 3. TEMPLATE SELECTION CHIPS */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                {isTour ? 'Select Tour Message Template' : 'Select Self-Drive & Rental Template'} ({availableTemplates.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {availableTemplates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1 relative cursor-pointer ${
                      isSelected
                        ? isTour
                          ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{tpl.icon}</span>
                        <span className={`font-bold text-xs ${
                          isSelected ? (isTour ? 'text-emerald-950' : 'text-indigo-950') : 'text-gray-900'
                        }`}>
                          {tpl.title}
                        </span>
                      </div>
                      {isSelected && (
                        <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${isTour ? 'bg-emerald-500' : 'bg-indigo-600'}`} />
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight">
                      {tpl.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. INSERT VARIABLES */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-500 font-semibold flex items-center gap-1">
                <Edit3 className="w-3 h-3 text-indigo-500" /> Insert Variable at Cursor:
              </span>
              <button
                type="button"
                onClick={handleResetCurrentTemplate}
                className="text-[10px] font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Reset Template
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {insertableVars.map((v) => (
                <button
                  key={v.tag}
                  type="button"
                  onClick={() => handleInsertVariable(v.tag)}
                  className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                    isTour
                      ? 'bg-emerald-50/50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
                      : 'bg-indigo-50/50 hover:bg-indigo-100 border-indigo-200 text-indigo-800'
                  }`}
                >
                  + {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. EDITABLE TEXTAREA */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="whatsapp-draft-textarea" className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                <span>Message Draft (WhatsApp Formatted):</span>
              </label>
              <span className="text-[10px] font-mono text-gray-400">
                {messageText.length} characters
              </span>
            </div>

            <div className="relative rounded-2xl border border-gray-200 bg-[#FAF9F5] focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all overflow-hidden shadow-inner">
              <textarea
                id="whatsapp-draft-textarea"
                ref={textareaRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={10}
                className="w-full p-4 bg-transparent text-gray-800 font-sans text-xs sm:text-sm leading-relaxed resize-y focus:outline-none placeholder-gray-400"
                placeholder="Type your WhatsApp message draft here..."
              />
            </div>
          </div>

        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleCopyMessage}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border shadow-xs active:scale-95 cursor-pointer ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-500" />
                <span>Copy Message</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 font-bold text-xs hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              disabled={!isPhoneValid}
              className={`px-6 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-md transition-all ${
                isPhoneValid
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-emerald-600/30 hover:scale-102 active:scale-98 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>🟢 Open in WhatsApp & Send ({cleanRecipient ? `+${cleanRecipient}` : 'No Phone'})</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
```

---

## 🚀 5. How to Hook into Any Table or View

Add this button to your bookings table, reservation row, or details modal:

```tsx
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { WhatsAppBookingModal } from '@/components/common/WhatsAppBookingModal';

export function BookingsRow({ booking }: { booking: any }) {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsWhatsAppOpen(true)}
        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1 transition-all"
        title="Send WhatsApp Reminder / Dispatch Notice"
      >
        <MessageSquare className="w-3.5 h-3.5 fill-emerald-600" />
        <span className="hidden sm:inline">WhatsApp</span>
      </button>

      {isWhatsAppOpen && (
        <WhatsAppBookingModal
          isOpen={isWhatsAppOpen}
          onClose={() => setIsWhatsAppOpen(false)}
          booking={booking}
        />
      )}
    </>
  );
}
```

---

## ⚡ 6. Customer-Side WhatsApp Integrations

### A. Instant WhatsApp Inquiry Link Generator
Generate direct click-to-chat links with pre-formatted inquiry text:

```typescript
export function createWhatsAppInquiryUrl(params: {
  hotlinePhone: string;
  customerName: string;
  customerPhone: string;
  serviceTitle: string;
  travelDate?: string;
  notes?: string;
}): string {
  const text =
    `*NEW INQUIRY*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 *Name:* ${params.customerName}\n` +
    `📞 *Phone:* ${params.customerPhone}\n` +
    `🧭 *Service / Package:* ${params.serviceTitle}\n` +
    `📅 *Preferred Date:* ${params.travelDate || 'Flexible'}\n` +
    `📝 *Notes:* ${params.notes || 'Please provide details & best quote.'}\n` +
    `━━━━━━━━━━━━━━━━━━━━`;

  return `https://wa.me/${params.hotlinePhone}?text=${encodeURIComponent(text)}`;
}
```

### B. UPI Payment Screenshot / UTR Proof Submission
Allow customers to directly dispatch payment proof to the accounts team:

```typescript
export function createPaymentProofWhatsAppUrl(params: {
  accountPhone: string;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  amountPaid: number;
  utrNumber: string;
}): string {
  const text =
    `*ADVANCE PAYMENT PROOF SUBMISSION*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🔖 *Booking Reference:* ${params.bookingCode}\n` +
    `👤 *Customer:* ${params.customerName} (${params.customerPhone})\n` +
    `💰 *Deposit Paid:* ₹${params.amountPaid.toLocaleString('en-IN')}\n` +
    `🔢 *UTR / Ref Number:* ${params.utrNumber}\n\n` +
    `_I have completed the transfer. Please find the attached screenshot for verification._`;

  return `https://wa.me/${params.accountPhone}?text=${encodeURIComponent(text)}`;
}
```
