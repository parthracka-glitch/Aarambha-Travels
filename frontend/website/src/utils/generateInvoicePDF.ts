// ─── Aarambha Invoice Generator ─────────────────────────────────────────────
// Premium Luxury Design Matching Aarambha Dashboard & Portal Aesthetic
// Supports 2-Page Car Rental Invoice & 2-Page Tours & Travels Invoice
// Shared across Website & CRM

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  bookingType: 'car' | 'tour';
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  drivingLicenceNumber?: string;
  aadhaarNumber?: string;
  customerAddress?: string;
  // Car Rental Details
  carModel?: string;
  vehicleName?: string;
  registrationNumber?: string;
  vehicleColor?: string;
  fuelType?: string;
  pickupLocation?: string;
  dropLocation?: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
  numberOfDays?: number;
  perDayRate?: number;
  extraCharges?: number;
  kmLimit?: number;
  isBike?: boolean;
  // Tour Details
  packageName?: string;
  packageDescription?: string;
  travelDates?: string;
  departureDate?: string;
  returnDate?: string;
  numberOfTravelers?: number;
  perPersonPrice?: number;
  sevaTicketPrice?: number;
  darshanType?: string;
  // Financials
  subtotal?: number;
  discount?: number;
  gstAmount?: number;
  securityDeposit?: number;
  totalAmount: number;
  depositPaid: number;
  balanceAmount: number;
  paymentMode: string;
  paymentStatus: string;
  transactionId?: string;
}

export const formatCurrency = (amount: number): string => {
  const num = Number(amount) || 0;
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatDate = (date?: string | Date): string => {
  if (!date) return '—';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd} / ${mm} / ${yyyy}`;
  } catch {
    return String(date);
  }
};

export function getNextInvoiceNumber(bookingType: 'car' | 'tour'): string {
  const key = bookingType === 'car' ? 'aarambha_invoice_counter_cr' : 'aarambha_invoice_counter_tr';
  const prefix = bookingType === 'car' ? 'AT/CR/2026/' : 'AT/TT/2026/';
  let counter = 147;
  try {
    const stored = localStorage.getItem(key);
    if (stored) counter = parseInt(stored, 10);
    localStorage.setItem(key, String(counter + 1));
  } catch (_) {}
  return `${prefix}${String(counter).padStart(5, '0')}`;
}

/**
 * Generate Ultra-Premium 2-Page Car Rental Invoice HTML matching Dashboard Theme
 * Contact: Call: +91 78208 02985 | WhatsApp: +91 82082 11478
 */
export function generateCarRentalInvoiceHTML(data: InvoiceData): string {
  const invoiceNumber = data.invoiceNumber || 'AT/CR/2026/00147';
  const invoiceDate = data.invoiceDate || new Date().toISOString();
  const pickupDate = data.rentalStartDate || data.travelDates?.split('→')[0]?.trim() || new Date().toISOString();
  const returnDate = data.rentalEndDate || data.travelDates?.split('→')[1]?.trim() || new Date(Date.now() + 86400000 * 3).toISOString();
  
  const customerName = data.customerName || 'Valued Guest';
  const customerPhone = data.customerPhone || '+91 82082 11478';
  const customerEmail = data.customerEmail || 'customer@aarambhatravels.in';
  const drivingLicenceNumber = data.drivingLicenceNumber || 'MH-12-DL-PENDING';
  const aadhaarNumber = data.aadhaarNumber || 'XXXX-XXXX-XXXX';
  const customerAddress = data.customerAddress || 'Pune, Maharashtra, India';

  const vehicleName = data.vehicleName || data.carModel || 'Maruti Suzuki Swift VXi';
  const registrationNumber = data.registrationNumber || 'MH 12 AB 8821';
  const vehicleColor = data.vehicleColor || 'Arctic White / Silky Silver';
  const fuelType = data.fuelType || 'Petrol / Manual';
  
  const rentalDuration = data.numberOfDays || Math.max(1, Math.ceil(
    (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / 86400000
  )) || 3;
  
  const ratePerDay = data.perDayRate || Math.round(data.totalAmount / rentalDuration) || 1500;
  const subtotal = data.subtotal || (ratePerDay * rentalDuration) || data.totalAmount;
  const discount = data.discount || 0;
  const securityDeposit = data.securityDeposit ?? 500;
  const amountPaid = data.depositPaid || 500;
  const totalPayable = subtotal - discount + securityDeposit;
  const amountDue = Math.max(0, totalPayable - amountPaid);
  const kmLimit = data.kmLimit || 300;
  const pickupLocation = data.pickupLocation || 'Green Hills Soc, Katraj, Pune Office / Doorstep';

  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Aarambha Car Rentals – Invoice ${invoiceNumber}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Amita:wght@400;700&family=Gotu&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Rozha+One&family=Syne:wght@600;700;800&family=Yatra+One&display=swap"
    rel="stylesheet" />
  <style>
    :root {
      --primary: #FF3B30;
      --primary-dark: #E02E24;
      --dark: #0F172A;
      --text-main: #1E293B;
      --text-muted: #64748B;
      --text-light: #94A3B8;
      --border-subtle: #E2E8F0;
      --bg-light: #F8FAFC;
      --bg-page: #EEF2F6;
      --success: #10B981;
      --danger: #EF4444;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-page);
      color: var(--text-main);
      font-size: 12px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      background: #FFFFFF;
      margin: 28px auto;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 40px -10px rgba(15, 23, 42, 0.12);
      border-radius: 4px;
      position: relative;
    }

    .page-body {
      flex: 1;
      padding: 38px 44px 28px;
    }

    /* ── HEADER ─────────────────────────────── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 22px;
      border-bottom: 2px solid var(--dark);
      position: relative;
    }

    .brand-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-logo-wrap {
      width: 68px;
      height: 68px;
      border-radius: 16px;
      background: #FFFFFF;
      border: 1.5px solid #F1E5DF;
      padding: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(211, 89, 43, 0.15);
      flex-shrink: 0;
    }

    .brand-logo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 12px;
    }

    .brand-marathi-3d {
      font-family: 'Yatra One', 'Rozha One', 'Tiro Devanagari Marathi', 'Amita', serif;
      font-size: 30px;
      font-weight: 700;
      color: #D3592B;
      letter-spacing: 0.04em;
      line-height: 1;
      text-shadow: 0 1px 0 #7A2E12, 0 2px 0 #5E200B, 0 3px 0 #421506, 0 4px 6px rgba(40, 15, 6, 0.35);
    }

    .brand-english-sub {
      font-family: 'Syne', sans-serif;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #3A231A;
      margin: 3px 0 5px;
    }

    .brand-address {
      font-size: 10px;
      color: var(--text-muted);
      line-height: 1.6;
      font-weight: 500;
    }

    .invoice-right {
      text-align: right;
    }

    .invoice-badge-title {
      font-family: 'Syne', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: var(--dark);
      letter-spacing: -0.5px;
      line-height: 1;
      margin-bottom: 8px;
    }

    .invoice-meta-card {
      background: var(--bg-light);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      padding: 8px 14px;
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 190px;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      gap: 12px;
    }

    .meta-row .label {
      color: var(--text-muted);
      font-weight: 500;
    }

    .meta-row .value {
      color: var(--dark);
      font-weight: 700;
      text-align: right;
    }

    /* ── BILL TO + RENTAL DETAILS ────────────── */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 22px;
      padding: 16px 20px;
      background: var(--bg-light);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
    }

    .section-label {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--primary);
      margin-bottom: 6px;
    }

    .customer-name {
      font-size: 14px;
      font-weight: 700;
      color: var(--dark);
      margin-bottom: 4px;
    }

    .customer-detail {
      font-size: 10.5px;
      color: var(--text-muted);
      line-height: 1.65;
    }

    .rental-details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 14px;
    }

    .rental-item .r-label {
      font-size: 8.5px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--text-light);
      margin-bottom: 2px;
    }

    .rental-item .r-value {
      font-size: 11.5px;
      font-weight: 700;
      color: var(--dark);
    }

    /* ── TABLE ───────────────────────────────── */
    .table-wrap {
      margin-top: 24px;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid var(--border-subtle);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead th {
      background: var(--dark);
      color: #FFFFFF;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      padding: 11px 16px;
      text-align: left;
    }

    thead th:not(:first-child) {
      text-align: right;
    }

    tbody td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-subtle);
      font-size: 11.5px;
      color: var(--dark);
      vertical-align: middle;
      background: #FFFFFF;
    }

    tbody td:not(:first-child) {
      text-align: right;
    }

    .item-name {
      font-weight: 700;
      font-size: 12.5px;
      color: var(--dark);
      margin-bottom: 3px;
    }

    .item-sub {
      font-size: 10px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .placeholder-row td {
      padding: 10px 16px;
      border-bottom: 1px solid #F1F5F9;
      color: #E2E8F0;
      font-size: 11px;
    }

    /* ── TOTALS ──────────────────────────────── */
    .totals-wrap {
      display: flex;
      justify-content: flex-end;
      margin-top: 18px;
    }

    .totals-table {
      width: 280px;
      background: var(--bg-light);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 12px 16px;
    }

    .totals-table .t-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid #E2E8F0;
      font-size: 11px;
    }

    .totals-table .t-row:last-child {
      border-bottom: none;
    }

    .totals-table .t-row .tl {
      color: var(--text-muted);
      font-weight: 500;
    }

    .totals-table .t-row .tv {
      font-weight: 700;
      color: var(--dark);
    }

    .totals-table .t-row.paid .tv {
      color: var(--success);
      font-weight: 700;
    }

    .totals-table .t-row.due .tv {
      color: var(--danger);
      font-weight: 700;
    }

    .totals-table .t-row.total {
      border-top: 2px solid var(--dark);
      border-bottom: none;
      margin-top: 6px;
      padding-top: 8px;
    }

    .totals-table .t-row.total .tl {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: var(--dark);
    }

    .totals-table .t-row.total .tv {
      font-size: 16px;
      font-weight: 800;
      color: var(--primary);
    }

    /* ── NOTE ────────────────────────────────── */
    .note-section {
      margin-top: 28px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 20px;
    }

    .note-box {
      flex: 1;
      background: #FFF5F5;
      border-left: 3.5px solid var(--primary);
      border-radius: 0 8px 8px 0;
      padding: 10px 14px;
    }

    .note-box .note-label {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--primary);
      margin-bottom: 4px;
    }

    .note-box .note-text {
      font-size: 10px;
      color: #475569;
      line-height: 1.6;
    }

    .signature-box {
      text-align: center;
      padding-bottom: 4px;
      min-width: 140px;
    }

    .sig-line {
      width: 130px;
      border-top: 1.5px solid var(--dark);
      margin: 0 auto 6px;
    }

    .sig-label {
      font-size: 9px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    /* ── FOOTER ──────────────────────────────── */
    .footer {
      border-top: 2px solid var(--dark);
      padding: 14px 44px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      background: #FFFFFF;
    }

    .footer-left {
      font-size: 10.5px;
      color: var(--dark);
      font-weight: 700;
    }

    .footer-center {
      font-size: 10px;
      color: var(--text-muted);
      text-align: center;
    }

    .footer-center .fc-label {
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--primary);
      margin-bottom: 2px;
    }

    .footer-divider {
      width: 1px;
      height: 26px;
      background: var(--border-subtle);
    }

    /* ════════════════════════════════
     PAGE 2 — TERMS & CONDITIONS
  ════════════════════════════════ */
    .tc-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--dark);
    }

    .tc-brand-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .tc-brand-logo-wrap {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: #FFFFFF;
      border: 1px solid var(--border-subtle);
      padding: 2px;
    }

    .tc-brand-logo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 8px;
    }

    .tc-brand-name {
      font-size: 16px;
      font-weight: 800;
      color: var(--dark);
    }

    .tc-brand-sub {
      font-size: 9px;
      color: var(--primary);
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 2px;
      font-weight: 700;
    }

    .tc-title-block {
      text-align: right;
    }

    .tc-title {
      font-family: 'Syne', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: var(--dark);
      letter-spacing: -0.5px;
    }

    .tc-subtitle {
      font-size: 9.5px;
      color: var(--text-muted);
      letter-spacing: 1px;
      margin-top: 3px;
      font-weight: 600;
    }

    /* tc items */
    .tc-list {
      margin-top: 18px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .tc-item {
      display: grid;
      grid-template-columns: 28px 1fr;
      gap: 12px;
      padding: 9px 0;
      border-bottom: 1px solid #F1F5F9;
      align-items: start;
    }

    .tc-item:last-child {
      border-bottom: none;
    }

    .tc-num {
      font-size: 11px;
      font-weight: 800;
      color: var(--primary);
      padding-top: 1px;
    }

    .tc-content {
      font-size: 11px;
      color: var(--dark);
      line-height: 1.6;
      font-weight: 400;
    }

    .tc-content strong {
      color: #0F172A;
      font-weight: 700;
    }

    .tc-ack-card {
      margin-top: 22px;
      padding: 14px 18px;
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      background: var(--bg-light);
    }

    .tc-footer {
      border-top: 2px solid var(--dark);
      padding: 14px 44px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      background: #FFFFFF;
    }

    .tc-footer-left {
      font-size: 10px;
      color: var(--text-muted);
    }

    .tc-footer-left strong {
      color: var(--dark);
      font-weight: 700;
    }

    .tc-footer-right {
      font-size: 10px;
      color: var(--primary);
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    @media screen and (max-width: 768px) {
      body {
        padding: 0;
        background: #FFFFFF;
      }
      .page {
        width: 100% !important;
        min-height: auto !important;
        margin: 60px 0 0 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
      .page-body {
        padding: 20px 16px !important;
      }
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      .invoice-right {
        text-align: left;
        width: 100%;
      }
      .invoice-meta-card {
        width: 100%;
      }
      .info-grid {
        grid-template-columns: 1fr !important;
        gap: 16px;
        padding: 14px 16px;
      }
      .rental-details-grid {
        grid-template-columns: 1fr 1fr;
      }
      .totals-wrap {
        justify-content: stretch;
      }
      .totals-table {
        width: 100% !important;
      }
      .note-section {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }
      .action-bar {
        padding: 0 16px;
      }
      .action-title {
        font-size: 11px;
      }
      .btn-action {
        padding: 7px 12px;
        font-size: 10px;
      }
      .footer {
        padding: 12px 16px;
        flex-direction: column;
        gap: 8px;
        text-align: center;
      }
      .tc-header {
        flex-direction: column;
        gap: 12px;
      }
      .tc-title-block {
        text-align: left;
      }
      .tc-footer {
        padding: 12px 16px;
        flex-direction: column;
        gap: 8px;
        text-align: center;
      }
    }

    @media print {
      body {
        background: #fff;
        padding: 0;
      }

      .page {
        margin: 0;
        box-shadow: none;
        page-break-after: always;
      }

      .no-print {
        display: none !important;
      }
    }

    /* Floating Action Bar */
    .action-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: rgba(15, 23, 42, 0.96);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 40px;
      z-index: 1000;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
    }

    .action-title {
      color: #FFFFFF;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .action-title span {
      color: var(--primary);
    }

    .action-buttons {
      display: flex;
      gap: 12px;
    }

    .btn-action {
      background: var(--primary);
      color: #FFFFFF;
      border: none;
      padding: 9px 20px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 11px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-family: inherit;
      box-shadow: 0 4px 14px rgba(255, 59, 48, 0.35);
    }

    .btn-action:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(255, 59, 48, 0.45);
    }

    .btn-action-outline {
      background: transparent;
      color: #FFFFFF;
      border: 1px solid rgba(255, 255, 255, 0.25);
      box-shadow: none;
    }

    .btn-action-outline:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: #FFFFFF;
      box-shadow: none;
    }

    @media screen {
      body {
        padding-top: 80px;
      }
    }
  </style>
</head>

<body>

  <!-- Floating Action Bar for Web View -->
  <div class="action-bar no-print">
    <div class="action-title">
      Aarambha Car Rentals &nbsp;&middot;&nbsp; <span>Invoice ${invoiceNumber}</span>
    </div>
    <div class="action-buttons">
      <button class="btn-action btn-action-outline" onclick="window.close()">Close Tab</button>
      <button class="btn-action" onclick="window.print()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Save as PDF / Print
      </button>
    </div>
  </div>

  <!-- ══════════════════════════════════
     PAGE 1 — INVOICE
  ══════════════════════════════════ -->
  <div class="page">
    <div class="page-body">

      <!-- HEADER -->
      <div class="header">
        <div class="brand-left">
          <div class="brand-logo-wrap">
            <img src="/images/aarambha_logo.png" alt="Aarambha Logo" class="brand-logo" onerror="this.src='/logo.png';" />
          </div>
          <div class="brand-text">
            <div class="brand-marathi-3d">आरंभ</div>
            <div class="brand-english-sub">✦ TOURS AND TRAVELS ✦</div>
            <div class="brand-address">
              Self-Drive Fleet &middot; Green Hills Soc, Katraj, Pune, Maharashtra 411046<br>
              Call: +91 78208 02985 &nbsp;&middot;&nbsp; WhatsApp: +91 82082 11478<br>
              support@aarambhatravels.in &nbsp;&middot;&nbsp; booking@aarambhatravels.in
            </div>
          </div>
        </div>

        <div class="invoice-right">
          <div class="invoice-badge-title">INVOICE</div>
          <div class="invoice-meta-card">
            <div class="meta-row"><span class="label">Invoice No.</span><span class="value">${invoiceNumber}</span></div>
            <div class="meta-row"><span class="label">Invoice Date</span><span class="value">${formatDate(invoiceDate)}</span></div>
            <div class="meta-row"><span class="label">Pickup Date</span><span class="value">${formatDate(pickupDate)}</span></div>
            <div class="meta-row"><span class="label">Return Date</span><span class="value">${formatDate(returnDate)}</span></div>
          </div>
        </div>
      </div>

      <!-- BILL TO + RENTAL DETAILS -->
      <div class="info-grid">
        <div class="bill-to">
          <div class="section-label">Billed To</div>
          <div class="customer-name">${customerName}</div>
          <div class="customer-detail">
            ${customerPhone}<br>
            ${customerEmail}<br>
            DL No.: ${drivingLicenceNumber}<br>
            Aadhaar No.: ${aadhaarNumber}<br>
            ${customerAddress}
          </div>
        </div>

        <div class="rental-details-grid">
          <div class="rental-item">
            <div class="r-label">Rental Duration</div>
            <div class="r-value">${rentalDuration} Day${rentalDuration > 1 ? 's' : ''}</div>
          </div>
          <div class="rental-item">
            <div class="r-label">Pickup Location</div>
            <div class="r-value">${pickupLocation}</div>
          </div>
          <div class="rental-item">
            <div class="r-label">KM Limit / Day</div>
            <div class="r-value">${kmLimit} KM</div>
          </div>
          <div class="rental-item">
            <div class="r-label">Extra KM Rate</div>
            <div class="r-value">&#8377;7 per KM</div>
          </div>
        </div>
      </div>

      <!-- ITEMS TABLE -->
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th style="width:45%">Vehicle Description</th>
              <th style="width:15%">Days</th>
              <th style="width:20%">Rate / Day</th>
              <th style="width:20%">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="item-name">${vehicleName}</div>
                <div class="item-sub">Reg. No.: ${registrationNumber} &nbsp;&middot;&nbsp; Color: ${vehicleColor} &nbsp;&middot;&nbsp; Fuel: ${fuelType}</div>
              </td>
              <td>${rentalDuration}</td>
              <td>&#8377; ${formatCurrency(ratePerDay)}</td>
              <td>&#8377; ${formatCurrency(subtotal)}</td>
            </tr>
            <tr class="placeholder-row">
              <td>&nbsp;</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TOTALS -->
      <div class="totals-wrap">
        <div class="totals-table">
          <div class="t-row"><span class="tl">Subtotal</span><span class="tv">&#8377; ${formatCurrency(subtotal)}</span></div>
          ${discount > 0 ? `<div class="t-row discount"><span class="tl">Discount</span><span class="tv">&minus; &#8377; ${formatCurrency(discount)}</span></div>` : ''}
          <div class="t-row"><span class="tl">Security Deposit</span><span class="tv">&#8377; ${formatCurrency(securityDeposit)}</span></div>
          <div class="t-row paid"><span class="tl">Deposit / Amount Paid</span><span class="tv">&#8377; ${formatCurrency(amountPaid)}</span></div>
          <div class="t-row due"><span class="tl">Balance Due</span><span class="tv">&#8377; ${formatCurrency(amountDue)}</span></div>
          <div class="t-row total"><span class="tl">Total Payable</span><span class="tv">&#8377; ${formatCurrency(totalPayable)}</span></div>
        </div>
      </div>

      <!-- NOTE + SIGNATURE -->
      <div class="note-section">
        <div class="note-box">
          <div class="note-label">Important Note</div>
          <div class="note-text">
            All vehicle rentals are governed by Aarambha Terms &amp; Conditions (see page 2).<br>
            Please record a 360&deg; video of the vehicle before pickup.<br>
            Allowance of ${kmLimit} KM/day cumulative; extra kilometres charged at &#8377;7/KM.<br>
            24/7 Roadside Assistance: Call +91 78208 02985 &middot; WhatsApp +91 82082 11478.
          </div>
        </div>
        <div class="signature-box">
          <div style="height:36px;"></div>
          <div class="sig-line"></div>
          <div class="sig-label">Authorised Signatory</div>
        </div>
      </div>

    </div><!-- /page-body -->

    <!-- FOOTER -->
    <div class="footer">
      <div class="footer-left">Thank you for choosing Aarambha Car Rentals</div>
      <div class="footer-divider"></div>
      <div class="footer-center">
        <div class="fc-label">Support Helpline</div>
        <div>Call: +91 78208 02985 &nbsp;&middot;&nbsp; support@aarambhatravels.in</div>
      </div>
      <div class="footer-divider"></div>
      <div class="footer-center">
        <div class="fc-label">WhatsApp Helpline</div>
        <div>+91 82082 11478 &nbsp;&middot;&nbsp; Quick Response Team</div>
      </div>
    </div>
  </div>


  <!-- ══════════════════════════════════
     PAGE 2 — TERMS & CONDITIONS (ENGLISH ONLY)
  ══════════════════════════════════ -->
  <div class="page">
    <div class="page-body">

      <!-- TC HEADER -->
      <div class="tc-header">
        <div class="tc-brand-left">
          <div class="tc-brand-logo-wrap">
            <img src="/images/logo.jpeg" alt="Aarambha Logo" class="tc-brand-logo" onerror="this.src='/logo.jpeg';" />
          </div>
          <div>
            <div class="tc-brand-name">Aarambha Car Rentals</div>
            <div class="tc-brand-sub">Self-Drive Fleet &middot; Pune, Maharashtra</div>
          </div>
        </div>
        <div class="tc-title-block">
          <div class="tc-title">Terms &amp; Conditions</div>
          <div class="tc-subtitle">
            Rental Agreement &middot; Standard Policy
          </div>
        </div>
      </div>

      <!-- TERMS LIST (ENGLISH ONLY) -->
      <div class="tc-list">
        
        <div class="tc-item">
          <div class="tc-num">01</div>
          <div class="tc-content">
            <strong>Valid Driving License:</strong> The customer must possess a valid, original government-approved R.T.O. Driving License and carry it at all times while operating the rental vehicle.
          </div>
        </div>

        <div class="tc-item">
          <div class="tc-num">02</div>
          <div class="tc-content">
            <strong>Fines, Penalties &amp; Tolls:</strong> The customer is solely responsible for paying all traffic fines, speeding challans, parking tickets, penalties, and toll taxes incurred throughout the rental duration.
          </div>
        </div>

        <div class="tc-item">
          <div class="tc-num">03</div>
          <div class="tc-content">
            <strong>Damages &amp; Non-Covered Repairs:</strong> Any vehicle damages, loss of accessories, or repair expenses not covered under the insurance policy—including rental downtime fees during servicing—must be paid in full by the customer.
          </div>
        </div>

        <div class="tc-item">
          <div class="tc-num">04</div>
          <div class="tc-content">
            <strong>Accident Reporting:</strong> In the event of an accident, mishap, or vehicle damage, the customer must immediately inform the Aarambha Support Helpline before initiating any repairs or negotiations.
          </div>
        </div>

        <div class="tc-item">
          <div class="tc-num">05</div>
          <div class="tc-content">
            <strong>Rental Extension:</strong> If the customer wishes to extend the rental duration, prior authorization from Aarambha Car Rentals must be obtained at least 6 hours before the scheduled return time.
          </div>
        </div>

        <div class="tc-item">
          <div class="tc-num">06</div>
          <div class="tc-content">
            <strong>Mandatory Vehicle Inspection:</strong> The customer is strictly advised to inspect the car and record a full 360-degree video of the exterior body and interior cabin before taking possession.
          </div>
        </div>

        <div class="tc-item">
          <div class="tc-num">07</div>
          <div class="tc-content">
            <strong>Kilometer Limit &amp; Excess Charges:</strong> Standard daily limit is ${kmLimit} km/day (calculated cumulatively across total rental days). Additional distance driven beyond this allowance will be charged at &#8377;7 per km.
          </div>
        </div>

        <div class="tc-item">
          <div class="tc-num">08</div>
          <div class="tc-content">
            <strong>Prohibited Activities:</strong> The vehicle must strictly not be used for racing, towing, off-roading, commercial subleasing, or any unlawful/illegal activity. Any breach will result in immediate forfeiture and legal action.
          </div>
        </div>

        <div class="tc-item">
          <div class="tc-num">09</div>
          <div class="tc-content">
            <strong>Breakdown &amp; Emergency Assistance:</strong> In case of mechanical breakdown or puncture, immediately contact our 24/7 Roadside Assistance Team at <strong>+91 78208 02985</strong> or WhatsApp <strong>+91 82082 11478</strong>.
          </div>
        </div>

      </div>

      <!-- ACKNOWLEDGEMENT -->
      <div class="tc-ack-card">
        <div style="font-size:9.5px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--primary);margin-bottom:6px;">
          Customer Acknowledgement &amp; Declaration
        </div>
        <div style="font-size:10.5px;color:#475569;line-height:1.7;">
          I have read, understood, and agree to abide by all the above Terms &amp; Conditions of Aarambha Car Rentals.
          I acknowledge that I am fully responsible for the vehicle, passengers, and adherence to traffic regulations during the rental duration.
        </div>
        <div style="display:flex;gap:60px;margin-top:24px;">
          <div>
            <div style="width:170px;border-top:1.5px solid var(--dark);margin-bottom:5px;"></div>
            <div style="font-size:9px;color:var(--text-muted);font-weight:700;letter-spacing:1px;text-transform:uppercase;">Customer Signature</div>
          </div>
          <div>
            <div style="width:170px;border-top:1.5px solid var(--dark);margin-bottom:5px;"></div>
            <div style="font-size:9px;color:var(--text-muted);font-weight:700;letter-spacing:1px;text-transform:uppercase;">Date</div>
          </div>
        </div>
      </div>

    </div><!-- /page-body -->

    <!-- TC FOOTER -->
    <div class="tc-footer">
      <div class="tc-footer-left">
        By renting a vehicle, the customer agrees to all the above terms.<br>
        <strong>Aarambha Car Rentals</strong> &nbsp;&middot;&nbsp; Call: +91 78208 02985 &nbsp;&middot;&nbsp; WhatsApp: +91 82082 11478
      </div>
      <div class="tc-footer-right">Drive safe. Drive smart.</div>
    </div>
  </div>

</body>

</html>`;
}

/**
 * Generate Ultra-Premium 2-Page Tours & Travels (Yatra) Invoice HTML matching Dashboard Theme
 * Contact: +91 90676 17451 | +91 90218 78717
 */
export function generateToursInvoiceHTML(data: InvoiceData): string {
  const invoiceNumber = data.invoiceNumber.startsWith('AT/')
    ? data.invoiceNumber
    : `AT/TT/2026/${data.invoiceNumber.replace(/\D/g, '').padStart(5, '0')}`;
  
  const invoiceDate = data.invoiceDate || new Date().toISOString();
  const packageName = data.packageName || 'Tirupati Balaji Darshan — Premium Group Yatra';
  const packageDescription = data.packageDescription || 'AC luxury travel, hotel accommodation, guided VIP darshan, breakfast & meals';
  
  const departureDate = data.departureDate || data.travelDates?.split('→')[0]?.trim() || data.travelDates || '04 Sep 2026';
  const returnDate = data.returnDate || data.travelDates?.split('→')[1]?.trim() || '08 Sep 2026 (5D/4N)';
  
  const customerName = data.customerName || 'Valued Pilgrim';
  const customerPhone = data.customerPhone || '+91 90676 17451';
  const customerEmail = data.customerEmail || 'pilgrim@aarambhatravels.in';
  const customerAddress = data.customerAddress || 'Pune, Maharashtra, India';
  const pickupPoint = data.pickupLocation || 'Green Hills Soc, Katraj, Pune (HQ Direct)';
  
  const pax = Number(data.numberOfTravelers) || 1;
  const rate = data.perPersonPrice || (data.totalAmount ? Math.round(data.totalAmount / pax) : 6500);
  const subtotal = data.subtotal || (rate * pax) || data.totalAmount || (6500 * pax);
  const discount = data.discount || 0;
  const gstAmount = data.gstAmount || 0;
  const totalAmount = data.totalAmount || (subtotal - discount + gstAmount);
  const amountPaid = data.depositPaid || (totalAmount > 5000 ? 5000 : totalAmount);
  const balanceDue = Math.max(0, totalAmount - amountPaid);
  
  const isPaidInFull = balanceDue <= 0 || (data.paymentStatus && data.paymentStatus.toLowerCase().includes('paid') && !data.paymentStatus.toLowerCase().includes('partial'));
  const statusBadgeText = isPaidInFull ? 'Full Payment Completed' : 'Booking Confirmed';
  const statusSubText = isPaidInFull ? 'Verified reservation · Ready for departure' : 'Advance received · Reservation confirmed';

  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Aarambha Tours &amp; Travels – Invoice ${invoiceNumber}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Amita:wght@400;700&family=Gotu&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Rozha+One&family=Syne:wght@600;700;800&family=Yatra+One&display=swap"
    rel="stylesheet" />
  <style>
    :root {
      --primary: #FF3B30;
      --primary-dark: #E02E24;
      --dark: #0F172A;
      --text-main: #1E293B;
      --text-muted: #64748B;
      --text-light: #94A3B8;
      --border-subtle: #E2E8F0;
      --bg-light: #F8FAFC;
      --bg-page: #EEF2F6;
      --success: #10B981;
      --danger: #EF4444;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-page);
      color: var(--text-main);
      font-size: 12px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      background: #FFFFFF;
      margin: 28px auto;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 40px -10px rgba(15, 23, 42, 0.12);
      border-radius: 4px;
      position: relative;
    }

    .page-body {
      flex: 1;
      padding: 38px 44px 28px;
    }

    /* ── HEADER ─────────────────────────────── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 22px;
      border-bottom: 2px solid var(--dark);
      position: relative;
    }

    .brand-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-logo-wrap {
      width: 68px;
      height: 68px;
      border-radius: 16px;
      background: #FFFFFF;
      border: 1.5px solid #F1E5DF;
      padding: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(211, 89, 43, 0.15);
      flex-shrink: 0;
    }

    .brand-logo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 12px;
    }

    .brand-marathi-3d {
      font-family: 'Yatra One', 'Rozha One', 'Tiro Devanagari Marathi', 'Amita', serif;
      font-size: 30px;
      font-weight: 700;
      color: #D3592B;
      letter-spacing: 0.04em;
      line-height: 1;
      text-shadow: 0 1px 0 #7A2E12, 0 2px 0 #5E200B, 0 3px 0 #421506, 0 4px 6px rgba(40, 15, 6, 0.35);
    }

    .brand-english-sub {
      font-family: 'Syne', sans-serif;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #3A231A;
      margin: 3px 0 5px;
    }

    .brand-address {
      font-size: 10px;
      color: var(--text-muted);
      line-height: 1.6;
      font-weight: 500;
    }

    .invoice-right {
      text-align: right;
    }

    .invoice-badge-title {
      font-family: 'Syne', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: var(--dark);
      letter-spacing: -0.5px;
      line-height: 1;
      margin-bottom: 8px;
    }

    .invoice-meta-card {
      background: var(--bg-light);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      padding: 8px 14px;
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 190px;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      gap: 12px;
    }

    .meta-row .label {
      color: var(--text-muted);
      font-weight: 500;
    }

    .meta-row .value {
      color: var(--dark);
      font-weight: 700;
      text-align: right;
    }

    /* ── STATUS BAR ─────────────────────────── */
    .status-strip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 18px;
      padding: 10px 18px;
      background: #F0FDF4;
      border: 1px solid #DCFCE7;
      border-radius: 10px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #15803D;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .status-badge::before {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #15803D;
      display: inline-block;
    }

    .status-sub {
      font-size: 10.5px;
      color: #166534;
      font-weight: 500;
    }

    /* ── BILL TO + YATRA DETAILS ────────────── */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 18px;
      padding: 16px 20px;
      background: var(--bg-light);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
    }

    .section-label {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--primary);
      margin-bottom: 6px;
    }

    .customer-name {
      font-size: 14px;
      font-weight: 700;
      color: var(--dark);
      margin-bottom: 4px;
    }

    .customer-detail {
      font-size: 10.5px;
      color: var(--text-muted);
      line-height: 1.65;
    }

    .rental-details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 14px;
    }

    .rental-item .r-label {
      font-size: 8.5px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--text-light);
      margin-bottom: 2px;
    }

    .rental-item .r-value {
      font-size: 11.5px;
      font-weight: 700;
      color: var(--dark);
    }

    /* ── TABLE ───────────────────────────────── */
    .table-wrap {
      margin-top: 24px;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid var(--border-subtle);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead th {
      background: var(--dark);
      color: #FFFFFF;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      padding: 11px 16px;
      text-align: left;
    }

    thead th:not(:first-child) {
      text-align: right;
    }

    tbody td {
      padding: 14px 16px;
      border-bottom: 1px solid var(--border-subtle);
      font-size: 11.5px;
      color: var(--dark);
      vertical-align: middle;
      background: #FFFFFF;
    }

    tbody td:not(:first-child) {
      text-align: right;
    }

    .item-name {
      font-weight: 700;
      font-size: 12.5px;
      color: var(--dark);
      margin-bottom: 3px;
    }

    .item-sub {
      font-size: 10px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .placeholder-row td {
      padding: 10px 16px;
      border-bottom: 1px solid #F1F5F9;
      color: #E2E8F0;
      font-size: 11px;
    }

    /* ── TOTALS ──────────────────────────────── */
    .totals-wrap {
      display: flex;
      justify-content: flex-end;
      margin-top: 18px;
    }

    .totals-table {
      width: 280px;
      background: var(--bg-light);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 12px 16px;
    }

    .totals-table .t-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid #E2E8F0;
      font-size: 11px;
    }

    .totals-table .t-row:last-child {
      border-bottom: none;
    }

    .totals-table .t-row .tl {
      color: var(--text-muted);
      font-weight: 500;
    }

    .totals-table .t-row .tv {
      font-weight: 700;
      color: var(--dark);
    }

    .totals-table .t-row.paid .tv {
      color: var(--success);
      font-weight: 700;
    }

    .totals-table .t-row.due .tv {
      color: var(--danger);
      font-weight: 700;
    }

    .totals-table .t-row.total {
      border-top: 2px solid var(--dark);
      border-bottom: none;
      margin-top: 6px;
      padding-top: 8px;
    }

    .totals-table .t-row.total .tl {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: var(--dark);
    }

    .totals-table .t-row.total .tv {
      font-size: 16px;
      font-weight: 800;
      color: var(--primary);
    }

    /* ── NOTE ────────────────────────────────── */
    .note-section {
      margin-top: 28px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 20px;
    }

    .note-box {
      flex: 1;
      background: #FFF5F5;
      border-left: 3.5px solid var(--primary);
      border-radius: 0 8px 8px 0;
      padding: 10px 14px;
    }

    .note-box .note-label {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--primary);
      margin-bottom: 4px;
    }

    .note-box .note-text {
      font-size: 10px;
      color: #475569;
      line-height: 1.6;
    }

    .signature-box {
      text-align: center;
      padding-bottom: 4px;
      min-width: 140px;
    }

    .sig-line {
      width: 130px;
      border-top: 1.5px solid var(--dark);
      margin: 0 auto 6px;
    }

    .sig-label {
      font-size: 9px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    /* ── FOOTER ──────────────────────────────── */
    .footer {
      border-top: 2px solid var(--dark);
      padding: 14px 44px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      background: #FFFFFF;
    }

    .footer-left {
      font-size: 10.5px;
      color: var(--dark);
      font-weight: 700;
    }

    .footer-center {
      font-size: 10px;
      color: var(--text-muted);
      text-align: center;
    }

    .footer-center .fc-label {
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--primary);
      margin-bottom: 2px;
    }

    .footer-divider {
      width: 1px;
      height: 26px;
      background: var(--border-subtle);
    }

    /* ════════════════════════════════
     PAGE 2 — TERMS & CONDITIONS
  ════════════════════════════════ */
    .tc-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--dark);
    }

    .tc-brand-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .tc-brand-logo-wrap {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: #FFFFFF;
      border: 1px solid var(--border-subtle);
      padding: 2px;
    }

    .tc-brand-logo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 8px;
    }

    .tc-brand-name {
      font-size: 16px;
      font-weight: 800;
      color: var(--dark);
    }

    .tc-brand-sub {
      font-size: 9px;
      color: var(--primary);
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 2px;
      font-weight: 700;
    }

    .tc-title-block {
      text-align: right;
    }

    .tc-title {
      font-family: 'Syne', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: var(--dark);
      letter-spacing: -0.5px;
    }

    .tc-subtitle {
      font-size: 9.5px;
      color: var(--text-muted);
      letter-spacing: 1px;
      margin-top: 3px;
      font-weight: 600;
    }

    /* tc items */
    .tc-list {
      margin-top: 18px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .tc-item {
      display: grid;
      grid-template-columns: 28px 1fr;
      gap: 12px;
      padding: 9px 0;
      border-bottom: 1px solid #F1F5F9;
      align-items: start;
    }

    .tc-item:last-child {
      border-bottom: none;
    }

    .tc-num {
      font-size: 11px;
      font-weight: 800;
      color: var(--primary);
      padding-top: 1px;
    }

    .tc-content {
      font-size: 11px;
      color: var(--dark);
      line-height: 1.6;
      font-weight: 400;
    }

    .tc-content strong {
      color: #0F172A;
      font-weight: 700;
    }

    .tc-ack-card {
      margin-top: 22px;
      padding: 14px 18px;
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      background: var(--bg-light);
    }

    .tc-footer {
      border-top: 2px solid var(--dark);
      padding: 14px 44px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      background: #FFFFFF;
    }

    .tc-footer-left {
      font-size: 10px;
      color: var(--text-muted);
    }

    .tc-footer-left strong {
      color: var(--dark);
      font-weight: 700;
    }

    .tc-footer-right {
      font-size: 10px;
      color: var(--primary);
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    @media screen and (max-width: 768px) {
      body {
        padding: 0;
        background: #FFFFFF;
      }
      .page {
        width: 100% !important;
        min-height: auto !important;
        margin: 60px 0 0 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
      .page-body {
        padding: 20px 16px !important;
      }
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      .invoice-right {
        text-align: left;
        width: 100%;
      }
      .invoice-meta-card {
        width: 100%;
      }
      .info-grid {
        grid-template-columns: 1fr !important;
        gap: 16px;
        padding: 14px 16px;
      }
      .tour-details-grid {
        grid-template-columns: 1fr 1fr;
      }
      .totals-wrap {
        justify-content: stretch;
      }
      .totals-table {
        width: 100% !important;
      }
      .note-section {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }
      .action-bar {
        padding: 0 16px;
      }
      .action-title {
        font-size: 11px;
      }
      .btn-action {
        padding: 7px 12px;
        font-size: 10px;
      }
      .footer {
        padding: 12px 16px;
        flex-direction: column;
        gap: 8px;
        text-align: center;
      }
      .tc-header {
        flex-direction: column;
        gap: 12px;
      }
      .tc-title-block {
        text-align: left;
      }
      .tc-footer {
        padding: 12px 16px;
        flex-direction: column;
        gap: 8px;
        text-align: center;
      }
    }

    @media print {
      body {
        background: #fff;
        padding: 0;
      }

      .page {
        margin: 0;
        box-shadow: none;
        page-break-after: always;
      }

      .no-print {
        display: none !important;
      }
    }

    /* Floating Action Bar */
    .action-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: rgba(15, 23, 42, 0.96);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 40px;
      z-index: 1000;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
    }

    .action-title {
      color: #FFFFFF;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .action-title span {
      color: var(--primary);
    }

    .action-buttons {
      display: flex;
      gap: 12px;
    }

    .btn-action {
      background: var(--primary);
      color: #FFFFFF;
      border: none;
      padding: 9px 20px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 11px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-family: inherit;
      box-shadow: 0 4px 14px rgba(255, 59, 48, 0.35);
    }

    .btn-action:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(255, 59, 48, 0.45);
    }

    .btn-action-outline {
      background: transparent;
      color: #FFFFFF;
      border: 1px solid rgba(255, 255, 255, 0.25);
      box-shadow: none;
    }

    .btn-action-outline:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: #FFFFFF;
      box-shadow: none;
    }

    @media screen {
      body {
        padding-top: 80px;
      }
    }
  </style>
</head>

<body>

  <!-- Floating Action Bar for Web View -->
  <div class="action-bar no-print">
    <div class="action-title">
      Aarambha Tours &amp; Travels &nbsp;&middot;&nbsp; <span>Invoice ${invoiceNumber}</span>
    </div>
    <div class="action-buttons">
      <button class="btn-action btn-action-outline" onclick="window.close()">Close Tab</button>
      <button class="btn-action" onclick="window.print()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Save as PDF / Print
      </button>
    </div>
  </div>

  <!-- ══════════════════════════════════
     PAGE 1 — INVOICE
  ══════════════════════════════════ -->
  <div class="page">
    <div class="page-body">

      <!-- HEADER -->
      <div class="header">
        <div class="brand-left">
          <div class="brand-logo-wrap">
            <img src="/images/aarambha_logo.png" alt="Aarambha Logo" class="brand-logo" onerror="this.src='/logo.png';" />
          </div>
          <div class="brand-text">
            <div class="brand-marathi-3d">आरंभ</div>
            <div class="brand-english-sub">✦ TOURS AND TRAVELS ✦</div>
            <div class="brand-address">
              Pilgrimage &amp; Group Yatra Specialists &middot; Pune, Maharashtra 411046<br>
              +91 90676 17451 &nbsp;&middot;&nbsp; +91 90218 78717<br>
              support@aarambhatravels.in &nbsp;&middot;&nbsp; booking@aarambhatravels.in
            </div>
          </div>
        </div>

        <div class="invoice-right">
          <div class="invoice-badge-title">INVOICE</div>
          <div class="invoice-meta-card">
            <div class="meta-row"><span class="label">Invoice No.</span><span class="value">${invoiceNumber}</span></div>
            <div class="meta-row"><span class="label">Invoice Date</span><span class="value">${formatDate(invoiceDate)}</span></div>
            <div class="meta-row"><span class="label">Departure</span><span class="value">${departureDate}</span></div>
            <div class="meta-row"><span class="label">Return</span><span class="value">${returnDate}</span></div>
          </div>
        </div>
      </div>

      <!-- STATUS BAR -->
      <div class="status-strip">
        <span class="status-badge">${statusBadgeText}</span>
        <span class="status-sub">${statusSubText}</span>
      </div>

      <!-- BILL TO + YATRA DETAILS -->
      <div class="info-grid">
        <div class="bill-to">
          <div class="section-label">Billed To (Pilgrim)</div>
          <div class="customer-name">${customerName}</div>
          <div class="customer-detail">
            ${customerPhone}<br>
            ${customerEmail}<br>
            ${customerAddress}
          </div>
        </div>

        <div class="rental-details-grid">
          <div class="rental-item">
            <div class="r-label">Pilgrims (Pax)</div>
            <div class="r-value">${pax} Person${pax > 1 ? 's' : ''}</div>
          </div>
          <div class="rental-item">
            <div class="r-label">Pickup Point</div>
            <div class="r-value">${pickupPoint}</div>
          </div>
          <div class="rental-item">
            <div class="r-label">Travel Mode</div>
            <div class="r-value">AC Luxury Coach / Train</div>
          </div>
          <div class="rental-item">
            <div class="r-label">Darshan Seva</div>
            <div class="r-value">VIP Darshan Assistance</div>
          </div>
        </div>
      </div>

      <!-- ITEMS TABLE -->
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th style="width:48%">Yatra Package &amp; Inclusions</th>
              <th style="width:12%">Pax</th>
              <th style="width:20%">Rate / Pilgrim</th>
              <th style="width:20%">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="item-name">${packageName}</div>
                <div class="item-sub">${packageDescription}</div>
              </td>
              <td>${pax}</td>
              <td>&#8377; ${formatCurrency(rate)}</td>
              <td>&#8377; ${formatCurrency(subtotal)}</td>
            </tr>
            <tr class="placeholder-row">
              <td>&nbsp;</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TOTALS -->
      <div class="totals-wrap">
        <div class="totals-table">
          <div class="t-row"><span class="tl">Subtotal</span><span class="tv">&#8377; ${formatCurrency(subtotal)}</span></div>
          ${discount > 0 ? `<div class="t-row discount"><span class="tl">Discount</span><span class="tv">&minus; &#8377; ${formatCurrency(discount)}</span></div>` : ''}
          ${gstAmount > 0 ? `<div class="t-row"><span class="tl">GST (5%)</span><span class="tv">&#8377; ${formatCurrency(gstAmount)}</span></div>` : ''}
          <div class="t-row paid"><span class="tl">Advance / Amount Paid</span><span class="tv">&#8377; ${formatCurrency(amountPaid)}</span></div>
          <div class="t-row due"><span class="tl">Balance Due</span><span class="tv">&#8377; ${formatCurrency(balanceDue)}</span></div>
          <div class="t-row total"><span class="tl">Total Package Amount</span><span class="tv">&#8377; ${formatCurrency(totalAmount)}</span></div>
        </div>
      </div>

      <!-- NOTE + SIGNATURE -->
      <div class="note-section">
        <div class="note-box">
          <div class="note-label">Important Pilgrim Advisory</div>
          <div class="note-text">
            All yatras are governed by Aarambha Tours &amp; Travels Guidelines (see page 2).<br>
            Please carry original Government Photo IDs (Aadhaar / Voter ID) for all pilgrims.<br>
            Balance payment must be cleared 3 days prior to departure date.<br>
            24/7 Tour Coordinator Helpline: +91 90676 17451 &middot; +91 90218 78717.
          </div>
        </div>
        <div class="signature-box">
          <div style="height:36px;"></div>
          <div class="sig-line"></div>
          <div class="sig-label">Authorised Signatory</div>
        </div>
      </div>

    </div><!-- /page-body -->

    <!-- FOOTER -->
    <div class="footer">
      <div class="footer-left">Har Har Mahadev &middot; Thank you for travelling with Aarambha</div>
      <div class="footer-divider"></div>
      <div class="footer-center">
        <div class="fc-label">Helpline &amp; Bookings</div>
        <div>support@aarambhatravels.in &nbsp;&middot;&nbsp; +91 90676 17451</div>
      </div>
      <div class="footer-divider"></div>
      <div class="footer-center">
        <div class="fc-label">Yatra Coordinator</div>
        <div>+91 90218 78717 &nbsp;&middot;&nbsp; Pune Head Office</div>
      </div>
    </div>
  </div>


  <!-- ══════════════════════════════════
     PAGE 2 — TERMS & CONDITIONS (ENGLISH ONLY)
  ══════════════════════════════════ -->
  <div class="page">
    <div class="page-body">

      <!-- TC HEADER -->
      <div class="tc-header">
        <div class="tc-brand-left">
          <div class="tc-brand-logo-wrap">
            <img src="/images/logo.jpeg" alt="Aarambha Logo" class="tc-brand-logo" onerror="this.src='/logo.jpeg';" />
          </div>
          <div>
            <div class="tc-brand-name">आरंभ Tours &amp; Travels</div>
            <div class="tc-brand-sub">Pilgrimage &amp; Group Yatra Specialists &middot; Pune</div>
          </div>
        </div>
        <div class="tc-title-block">
          <div class="tc-title">Yatra Terms &amp; Conditions</div>
          <div class="tc-subtitle">
            Pilgrim Agreement &middot; Standard Yatra Policy
          </div>
        </div>
      </div>

      <!-- TERMS LIST (ENGLISH ONLY) -->
      <div class="tc-list">
        
        <div class="tc-item">
          <div class="tc-num">01</div>
          <div class="tc-content">
            <strong>Payment Clearance:</strong> The remaining balance amount must be cleared in full at least 3 days prior to the departure date to ensure room and darshan confirmations.
          </div>
        </div>

        <div class="tc-item">
          <div class="tc-num">02</div>
          <div class="tc-content">
            <strong>Cancellation &amp; Refund Policy:</strong> Cancellations made within 7 days of departure are strictly non-refundable. Cancellations made prior to 7 days will incur a standard 20% administrative charge.
          </div>
        </div>

        <div class="tc-item">
          <div class="tc-num">03</div>
          <div class="tc-content">
            <strong>Temple Trust &amp; Darshan Timings:</strong> Darshan slots, protocol timings, and seva arrangements are governed by the respective Temple Trust authorities and are subject to change without prior notice.
          </div>
        </div>

        <div class="tc-item">
          <div class="tc-num">04</div>
          <div class="tc-content">
            <strong>Unforeseen Circumstances:</strong> Aarambha Tours &amp; Travels is not liable for itinerary disruptions caused by adverse weather, road blocks, natural events, or temple regulatory changes.
          </div>
        </div>

        <div class="tc-item">
          <div class="tc-num">05</div>
          <div class="tc-content">
            <strong>Mandatory Photo Identification:</strong> All travelers must carry original government-issued photo ID (Aadhaar Card, Voter ID, or Passport) throughout the yatra duration.
          </div>
        </div>

        <div class="tc-item">
          <div class="tc-num">06</div>
          <div class="tc-content">
            <strong>Luggage &amp; Personal Belongings:</strong> Pilgrims are advised to take care of their personal belongings, jewelry, and cash. Aarambha is not responsible for any loss or misplacement during travel.
          </div>
        </div>

        <div class="tc-item">
          <div class="tc-num">07</div>
          <div class="tc-content">
            <strong>Temple Decorum &amp; Code of Conduct:</strong> Traditional Indian temple attire must be adhered to during darshan. Consumption of alcohol, tobacco, or non-vegetarian food is strictly prohibited during the yatra.
          </div>
        </div>

        <div class="tc-item">
          <div class="tc-num">08</div>
          <div class="tc-content">
            <strong>Accommodation &amp; Room Allotment:</strong> Hotel check-in/out times follow standard hotel guidelines. Rooms are allotted on double/triple sharing basis as per selected package tier.
          </div>
        </div>

        <div class="tc-item">
          <div class="tc-num">09</div>
          <div class="tc-content">
            <strong>24/7 Yatra Assistance:</strong> For any assistance during the tour, our dedicated tour coordinator can be reached at <strong>+91 90676 17451</strong> or <strong>+91 90218 78717</strong>.
          </div>
        </div>

      </div>

      <!-- ACKNOWLEDGEMENT -->
      <div class="tc-ack-card">
        <div style="font-size:9.5px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--primary);margin-bottom:6px;">
          Pilgrim Acknowledgement &amp; Declaration
        </div>
        <div style="font-size:10.5px;color:#475569;line-height:1.7;">
          I have read, understood, and agreed to all the above Yatra Terms &amp; Conditions of Aarambha Tours &amp; Travels.
          I confirm that all pilgrim details provided by me are accurate and valid.
        </div>
        <div style="display:flex;gap:60px;margin-top:24px;">
          <div>
            <div style="width:170px;border-top:1.5px solid var(--dark);margin-bottom:5px;"></div>
            <div style="font-size:9px;color:var(--text-muted);font-weight:700;letter-spacing:1px;text-transform:uppercase;">Pilgrim Signature</div>
          </div>
          <div>
            <div style="width:170px;border-top:1.5px solid var(--dark);margin-bottom:5px;"></div>
            <div style="font-size:9px;color:var(--text-muted);font-weight:700;letter-spacing:1px;text-transform:uppercase;">Date</div>
          </div>
        </div>
      </div>

    </div><!-- /page-body -->

    <!-- TC FOOTER -->
    <div class="tc-footer">
      <div class="tc-footer-left">
        Wishing you a divine, auspicious, and blissful pilgrimage.<br>
        <strong>Aarambha Tours &amp; Travels</strong> &nbsp;&middot;&nbsp; support@aarambhatravels.in &nbsp;&middot;&nbsp; +91 90676 17451
      </div>
      <div class="tc-footer-right">Shubh Yatra. Har Har Mahadev.</div>
    </div>
  </div>

</body>

</html>`;
}

/**
 * Universal invoice dispatcher
 */
export function getAarambhInvoiceHTML(data: InvoiceData): string {
  if (data.bookingType === 'car') {
    return generateCarRentalInvoiceHTML(data);
  }
  return generateToursInvoiceHTML(data);
}

export function generateInvoicePDF(data: InvoiceData): void {
  const html = getAarambhInvoiceHTML(data);
  const win = window.open('', '_blank');
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
  }
}
