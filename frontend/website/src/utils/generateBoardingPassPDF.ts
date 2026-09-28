/**
 * Aarambha Tours & Travels — Official Boarding Pass & Travel Voucher Generator
 * Generates an official, printable A4 boarding pass & voucher for pilgrims & fleet travelers.
 */

export interface BoardingPassData {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceType: 'tour' | 'car' | 'bus';
  title: string;
  startDate: string;
  endDate?: string;
  pickupTime?: string;
  reportingTime?: string;
  pickupLocation?: string;
  dropLocation?: string;
  passengersCount: number;
  assignedVehicle?: string;
  vehicleRegistration?: string;
  driverName?: string;
  driverPhone?: string;
  tourCaptainName?: string;
  tourCaptainPhone?: string;
  totalAmount: number;
  depositPaid: number;
  balanceAmount: number;
  paymentStatus: string;
  utrNumber?: string;
  bookingDate: string;
}

export function generateBoardingPassHTML(data: BoardingPassData): string {
  const isTour = data.serviceType === 'tour';
  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    `AARAMBHA-PASS|${data.bookingId}|${data.customerName}|${data.startDate}`
  )}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Boarding Pass & Travel Voucher — ${data.bookingId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Rozha+One&display=swap');

    @page {
      size: A4 portrait;
      margin: 10mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #FFFFFF;
      color: #2D231E;
      line-height: 1.4;
      font-size: 12px;
      display: flex;
      justify-content: center;
      padding: 10px;
    }

    .voucher-card {
      width: 100%;
      max-width: 800px;
      border: 2px solid #C65A2E;
      border-radius: 18px;
      overflow: hidden;
      background: #FFFDF9;
      box-shadow: 0 4px 20px rgba(73, 59, 52, 0.08);
      position: relative;
    }

    /* Top Decorative Watermark / Strip */
    .top-strip {
      background: linear-gradient(135deg, #3B2E27 0%, #221A15 100%);
      color: #FFFFFF;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #C65A2E;
    }

    .brand-block h1 {
      font-family: 'Rozha One', serif;
      font-size: 24px;
      color: #F8EFEA;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-block p {
      font-size: 10px;
      color: #E8B9A5;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 600;
      margin-top: 2px;
    }

    .voucher-type-badge {
      background: #C65A2E;
      color: #FFFFFF;
      padding: 6px 14px;
      border-radius: 30px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    /* Boarding Pass Hero Grid */
    .hero-banner {
      background: #FDF7F2;
      border-bottom: 2px dashed #E8B9A5;
      padding: 18px 24px;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 20px;
      align-items: center;
    }

    .trip-title {
      font-family: 'Cinzel', serif;
      font-size: 19px;
      font-weight: 700;
      color: #3B2E27;
      margin-bottom: 6px;
    }

    .meta-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .meta-pill {
      background: #FFFFFF;
      border: 1px solid #EDE2D0;
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 10.5px;
      font-weight: 600;
      color: #5D5047;
    }

    .meta-pill strong {
      color: #C65A2E;
    }

    .qr-container {
      text-align: center;
      background: #FFFFFF;
      border: 2px solid #EDE2D0;
      padding: 8px;
      border-radius: 12px;
    }

    .qr-container img {
      width: 95px;
      height: 95px;
      display: block;
    }

    .qr-label {
      font-size: 8.5px;
      font-weight: 700;
      color: #756B63;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Core Details Section */
    .details-grid {
      padding: 20px 24px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .info-card {
      background: #FFFFFF;
      border: 1px solid #EDE2D0;
      border-radius: 12px;
      padding: 12px 14px;
    }

    .info-card .card-label {
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #8C7D73;
      font-weight: 700;
      margin-bottom: 4px;
      display: block;
    }

    .info-card .card-value {
      font-size: 13px;
      font-weight: 700;
      color: #2D231E;
      display: block;
    }

    .info-card .card-sub {
      font-size: 10px;
      color: #756B63;
      margin-top: 3px;
      display: block;
    }

    /* Driver & Operational Contacts */
    .ops-bar {
      margin: 0 24px 18px;
      background: #F8EFEA;
      border: 1px solid #E8B9A5;
      border-radius: 12px;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .ops-col h4 {
      font-size: 10px;
      text-transform: uppercase;
      color: #C65A2E;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .ops-col p {
      font-size: 12px;
      font-weight: 700;
      color: #3B2E27;
      margin-top: 2px;
    }

    /* Financials & Balance */
    .financials-strip {
      margin: 0 24px 18px;
      background: #FFFFFF;
      border: 1.5px solid #EDE2D0;
      border-radius: 12px;
      padding: 12px 18px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      text-align: center;
    }

    .fin-item span {
      font-size: 9.5px;
      color: #8C7D73;
      text-transform: uppercase;
      font-weight: 600;
      display: block;
    }

    .fin-item strong {
      font-size: 15px;
      color: #2D231E;
      display: block;
      margin-top: 2px;
    }

    .fin-item.highlight strong {
      color: #C65A2E;
    }

    /* Important Guidelines Checklist */
    .guidelines {
      margin: 0 24px 20px;
      background: #FFFFFF;
      border: 1px solid #EDE2D0;
      border-radius: 12px;
      padding: 14px 18px;
    }

    .guidelines h3 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #3B2E27;
      font-weight: 800;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .guidelines ul {
      list-style: none;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 16px;
    }

    .guidelines li {
      font-size: 10px;
      color: #5D5047;
      display: flex;
      align-items: flex-start;
      gap: 6px;
    }

    .guidelines li::before {
      content: '✓';
      color: #C65A2E;
      font-weight: 800;
    }

    /* Footer Stamp */
    .voucher-footer {
      background: #FDFBF7;
      border-top: 1px solid #EDE2D0;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9.5px;
      color: #8C7D73;
    }

    .security-stamp {
      border: 1.5px solid #16A34A;
      color: #16A34A;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-block;
    }

    @media print {
      body {
        padding: 0;
        background: transparent;
      }
      .voucher-card {
        box-shadow: none;
        border: 2px solid #C65A2E !important;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>

  <div class="voucher-card">
    
    <!-- Top Header -->
    <div class="top-strip">
      <div class="brand-block">
        <h1>आरंभ Travels</h1>
        <p>Aarambha Luxury Fleet & Pilgrimage Ecosystem • Pune, Maharashtra</p>
      </div>
      <div class="voucher-type-badge">
        ${isTour ? 'Official Yatra Boarding Pass' : 'Fleet Rental Voucher'}
      </div>
    </div>

    <!-- Hero Banner with QR -->
    <div class="hero-banner">
      <div>
        <div class="trip-title">${data.title}</div>
        <div class="meta-pills">
          <div class="meta-pill">Booking Code: <strong>${data.bookingId}</strong></div>
          <div class="meta-pill">Date of Travel: <strong>${data.startDate}</strong></div>
          <div class="meta-pill">Status: <strong>${data.paymentStatus}</strong></div>
          <div class="meta-pill">Guests: <strong>${data.passengersCount} Pax</strong></div>
        </div>
      </div>

      <div class="qr-container">
        <img src="${qrDataUrl}" alt="Check-in QR" />
        <div class="qr-label">Scan on Boarding</div>
      </div>
    </div>

    <!-- Core Passenger & Travel Details -->
    <div class="details-grid">
      <div class="info-card">
        <span class="card-label">Primary Passenger / Pilgrim</span>
        <span class="card-value">${data.customerName}</span>
        <span class="card-sub">📱 ${data.customerPhone}</span>
      </div>

      <div class="info-card">
        <span class="card-label">Reporting & Boarding Hub</span>
        <span class="card-value">${data.reportingTime || '06:00 AM (15m Prior)'}</span>
        <span class="card-sub">📍 ${data.pickupLocation || 'Pune Swargate / Wakad Hub'}</span>
      </div>

      <div class="info-card">
        <span class="card-label">Assigned Fleet / Coach</span>
        <span class="card-value">${data.assignedVehicle || 'Force Urbania Executive'}</span>
        <span class="card-sub">Reg: ${data.vehicleRegistration || 'MH-12 Commercial Permit'}</span>
      </div>
    </div>

    <!-- Operational & Tour Captain Contacts -->
    <div class="ops-bar">
      <div class="ops-col">
        <h4>Assigned Chauffeur / Captain</h4>
        <p>${data.driverName || 'Designated Senior Chauffeur'} (${data.driverPhone || '+91 90676 17451'})</p>
      </div>
      <div class="ops-col" style="text-align: right;">
        <h4>24x7 Emergency Helpline</h4>
        <p>+91 90676 17451 • contact@aarambhatravels.in</p>
      </div>
    </div>

    <!-- Financial Breakdown -->
    <div class="financials-strip">
      <div class="fin-item">
        <span>Total Tariff</span>
        <strong>₹${data.totalAmount.toLocaleString('en-IN')}</strong>
      </div>
      <div class="fin-item">
        <span>Advance Paid</span>
        <strong style="color: #16A34A;">₹${data.depositPaid.toLocaleString('en-IN')}</strong>
      </div>
      <div class="fin-item highlight">
        <span>Payable on Boarding</span>
        <strong>₹${data.balanceAmount.toLocaleString('en-IN')}</strong>
      </div>
      <div class="fin-item">
        <span>Ref UTR / Mode</span>
        <strong style="font-size: 11px;">${data.utrNumber ? data.utrNumber.slice(-8) : 'Verified UPI'}</strong>
      </div>
    </div>

    <!-- Sacred Travel & Safety Guidelines -->
    <div class="guidelines">
      <h3>📋 Boarding Guidelines & Pilgrim Checklist</h3>
      <ul>
        <li>Carry original Government Photo ID (Aadhaar / Voter ID / Driving License) for temple check-in.</li>
        <li>Traditional, modest dress code required for temple sanctum entry (Dhoti/Kurta or Saree/Salwar).</li>
        <li>AC Pushback seating is pre-reserved. Report 15 minutes prior to scheduled departure.</li>
        <li>Luggage policy: 1 Medium Strolley + 1 Handbag per passenger for comfortable cabin transit.</li>
        <li>Satvik meals & pure vegetarian dining arrangements are verified for all sacred halts.</li>
        <li>No smoking, tobacco, or alcohol permitted inside luxury coach or pilgrimage fleet.</li>
      </ul>
    </div>

    <!-- Official Stamp Footer -->
    <div class="voucher-footer">
      <div>
        <span>Authorized System Generated Voucher • Ref: ${data.bookingId} • Issued on ${data.bookingDate}</span>
      </div>
      <div class="security-stamp">
        ✓ VERIFIED BOARDING PASS
      </div>
    </div>

  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;
}

export function openBoardingPassPDF(data: BoardingPassData): void {
  const html = generateBoardingPassHTML(data);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
