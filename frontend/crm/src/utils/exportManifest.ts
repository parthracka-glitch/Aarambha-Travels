import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from './formatDate';
import { formatCurrency } from './formatCurrency';

export interface ManifestPassenger {
  seatNo: number | string;
  name: string;
  age?: number | string;
  gender?: string;
  isPrimary?: boolean;
  phone?: string;
  email?: string;
  bookingCode?: string;
  bookingId?: string;
  pickupPoint?: string;
  depositPaid?: number;
  totalAmount?: number;
  balanceAmount?: number;
  status?: string;
  specialRequests?: string;
  boarded?: boolean;
}

export interface ManifestTraveler {
  bookingId: string;
  bookingCode?: string;
  travelerName: string;
  customerName?: string;
  phone: string;
  email?: string;
  seatCount: number;
  paxCount?: number;
  totalAmount?: number;
  depositPaid?: number;
  balanceAmount?: number;
  status?: string;
  pickupPoint?: string;
  specialRequests?: string;
  passengers?: Array<{
    seatNo?: number | string;
    name: string;
    age?: number | string;
    gender?: string;
  }>;
}

export interface ManifestOptions {
  packageName: string;
  packageDescription?: string;
  departureDate: string;
  returnDate?: string;
  pickupLocation?: string;
  pickupTime?: string;
  tourLeader?: string;
  driverDetails?: string;
  vehicleType?: string;
  travelers?: ManifestTraveler[];
  passengers?: ManifestPassenger[];
}

/**
 * Normalizes options into a flat list of passengers for manifest printing
 */
export function extractPassengersFromOptions(options: ManifestOptions): ManifestPassenger[] {
  if (options.passengers && options.passengers.length > 0) {
    return options.passengers;
  }

  const result: ManifestPassenger[] = [];
  let seatCounter = 1;

  (options.travelers || []).forEach((t) => {
    const leadName = t.travelerName || t.customerName || 'Guest Member';
    const code = t.bookingCode || t.bookingId?.slice(-6).toUpperCase() || '—';

    if (t.passengers && Array.isArray(t.passengers) && t.passengers.length > 0) {
      t.passengers.forEach((p, idx) => {
        result.push({
          seatNo: p.seatNo || seatCounter++,
          name: p.name || (idx === 0 ? leadName : `${leadName} Co-Traveler`),
          age: p.age || '—',
          gender: p.gender || '—',
          isPrimary: idx === 0,
          phone: t.phone || '—',
          email: t.email,
          bookingCode: code,
          bookingId: t.bookingId,
          pickupPoint: t.pickupPoint || options.pickupLocation || 'Katraj / Swargate',
          depositPaid: t.depositPaid,
          totalAmount: t.totalAmount,
          balanceAmount: t.balanceAmount,
          status: t.status || 'Confirmed',
          specialRequests: t.specialRequests,
        });
      });
    } else {
      const seats = t.seatCount || t.paxCount || 1;
      for (let i = 0; i < seats; i++) {
        result.push({
          seatNo: seatCounter++,
          name: i === 0 ? leadName : `${leadName} (Co-Traveler ${i + 1})`,
          age: '—',
          gender: '—',
          isPrimary: i === 0,
          phone: t.phone || '—',
          email: t.email,
          bookingCode: code,
          bookingId: t.bookingId,
          pickupPoint: t.pickupPoint || options.pickupLocation || 'Katraj / Swargate',
          depositPaid: t.depositPaid,
          totalAmount: t.totalAmount,
          balanceAmount: t.balanceAmount,
          status: t.status || 'Confirmed',
          specialRequests: t.specialRequests,
        });
      }
    }
  });

  return result;
}

/**
 * Generate and download an official Print-Ready Conductor Manifest PDF
 */
export function exportMembersListPDF(options: ManifestOptions): void {
  const {
    packageName,
    departureDate,
    returnDate,
    pickupLocation = 'Swargate / Katraj Terminal, Pune',
    pickupTime = '06:00 AM',
    tourLeader = 'Pravin / Aarambha Coordinator (+91 82082 11478)',
    vehicleType = 'Force Urbania 17-Seater / AC Luxury Coach',
  } = options;

  const passengers = extractPassengersFromOptions(options);
  const totalSeats = passengers.length;
  const uniqueBookings = new Set(passengers.map((p) => p.bookingCode)).size;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header Banner
  doc.setFillColor(16, 31, 64); // Dark Navy #101F40
  doc.rect(0, 0, 210, 32, 'F');

  // Accent Line
  doc.setFillColor(239, 68, 68); // Red #EF4444
  doc.rect(0, 32, 210, 2.5, 'F');

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('AARAMBHA TOURS & TRAVELS', 12, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(209, 213, 219);
  doc.text('OFFICIAL PASSENGER MANIFEST & CONDUCTOR BOARDING CHART', 12, 19);
  doc.text('Katraj / Swargate, Pune | Operations Hotline: +91 90676 17451 / +91 82082 11478', 12, 25);

  // Generated Tag
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 198, 25, { align: 'right' });

  // Tour Meta Info Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(12, 38, 186, 34, 2, 2, 'FD');

  doc.setTextColor(16, 31, 64);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(packageName, 16, 46);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  // Column 1
  doc.text('Departure Date:', 16, 53);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 31, 64);
  doc.text(formatDate(departureDate), 44, 53);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Return Date:', 16, 59);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 31, 64);
  doc.text(returnDate ? formatDate(returnDate) : 'As per Itinerary', 44, 59);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Boarding Point:', 16, 65);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 31, 64);
  doc.text(`${pickupLocation} (${pickupTime})`, 44, 65);

  // Column 2
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Vehicle / Coach:', 116, 53);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 31, 64);
  doc.text(vehicleType, 146, 53);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Total Yatris:', 116, 59);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(239, 68, 68);
  doc.text(`${totalSeats} Yatris (${uniqueBookings} Bookings)`, 146, 59);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Tour Leader:', 116, 65);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 31, 64);
  doc.text(tourLeader, 146, 65);

  // Table of Passengers
  const tableData = passengers.map((p) => {
    const ageGender = [p.age && p.age !== '—' ? `${p.age}y` : '', p.gender && p.gender !== '—' ? p.gender[0]?.toUpperCase() : '']
      .filter(Boolean)
      .join(' / ') || '—';
    const isPrimaryBadge = p.isPrimary ? ' (Lead)' : '';
    const paymentLabel = p.depositPaid ? `Adv: Rs.${p.depositPaid}` : (p.status || 'Confirmed');

    return [
      String(p.seatNo || '—'),
      `${p.name}${isPrimaryBadge}`,
      ageGender,
      p.phone || '—',
      p.pickupPoint || 'Katraj/Swargate',
      p.bookingCode || '—',
      paymentLabel,
      p.boarded ? '[X] Boarded' : '[   ] Boarded',
    ];
  });

  autoTable(doc, {
    startY: 76,
    head: [['Seat', 'Passenger Name', 'Age/Sex', 'Primary Phone', 'Pickup Point', 'Booking Code', 'Payment', 'Roll Call']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [16, 31, 64],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.8,
      textColor: [30, 41, 59],
      valign: 'middle',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12, fontStyle: 'bold' },
      1: { cellWidth: 42, fontStyle: 'bold' },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 30, halign: 'center' },
      4: { cellWidth: 28 },
      5: { cellWidth: 24, halign: 'center', fontStyle: 'bold' },
      6: { cellWidth: 20, halign: 'center' },
      7: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 160;

  // Summary & Sign-off Section
  const summaryY = Math.min(finalY + 8, 252);

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(12, summaryY, 198, summaryY);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 31, 64);
  doc.text(`TOTAL MANIFEST COUNT: ${totalSeats} CONFIRMED PASSENGERS  |  BOOKINGS: ${uniqueBookings}`, 12, summaryY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Notice: Verify Govt. Photo ID for every passenger before departure. Report any absentee to the Katraj control desk.', 12, summaryY + 10.5);

  // Signature Boxes
  const sigY = summaryY + 16;
  if (sigY + 12 <= 285) {
    doc.line(16, sigY + 8, 70, sigY + 8);
    doc.text('Tour Captain / Driver Signature', 16, sigY + 12);

    doc.line(140, sigY + 8, 194, sigY + 8);
    doc.text('Operations In-charge (Pravin)', 140, sigY + 12);
  }

  const cleanName = packageName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
  const cleanDate = departureDate.split('T')[0];
  doc.save(`Aarambha_Manifest_${cleanName}_${cleanDate}.pdf`);
}

/**
 * Open a clean, printable HTML Conductor Manifest in browser with direct print dialog
 */
export function openPrintMembersListView(options: ManifestOptions): void {
  const {
    packageName,
    departureDate,
    returnDate,
    pickupLocation = 'Swargate / Katraj Terminal, Pune',
    pickupTime = '06:00 AM',
    tourLeader = 'Pravin / Aarambha Coordinator (+91 82082 11478)',
    vehicleType = 'Force Urbania 17-Seater / AC Luxury Coach',
  } = options;

  const passengers = extractPassengersFromOptions(options);
  const totalSeats = passengers.length;
  const uniqueBookings = new Set(passengers.map((p) => p.bookingCode)).size;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Passenger Manifest – ${packageName}</title>
  <style>
    @media print {
      @page { size: A4 portrait; margin: 10mm; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 0 !important; }
      .no-print { display: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #0F172A;
      background: #ffffff;
      margin: 0;
      padding: 20px;
      font-size: 12px;
    }
    .btn-bar {
      margin-bottom: 16px;
      display: flex;
      gap: 10px;
    }
    .btn {
      padding: 9px 18px;
      background: #101F40;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 700;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .btn:hover { background: #1C315A; }
    .header {
      background: #101F40;
      color: #ffffff;
      padding: 16px 20px;
      border-radius: 8px 8px 0 0;
      border-bottom: 3.5px solid #EF4444;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header h1 { margin: 0 0 4px 0; font-size: 18px; font-weight: 800; letter-spacing: 0.5px; }
    .header p { margin: 0; font-size: 11px; color: #94A3B8; }
    .meta-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 14px 18px;
      margin: 14px 0;
      border-radius: 6px;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 16px;
    }
    .meta-title { font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 8px; }
    .meta-grid { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 12px; }
    .meta-label { color: #64748B; font-weight: 500; }
    .meta-val { font-weight: 700; color: #0F172A; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 11.5px;
    }
    th {
      background: #101F40;
      color: #FFFFFF;
      padding: 9px 8px;
      text-align: left;
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      border: 1px solid #1E293B;
    }
    td {
      padding: 8px 8px;
      border: 1px solid #E2E8F0;
      color: #334155;
      vertical-align: middle;
    }
    tr:nth-child(even) td { background: #F8FAFC; }
    .text-center { text-align: center; }
    .font-bold { font-weight: 700; }
    .seat-badge {
      background: #EFF6FF;
      color: #1D4ED8;
      border: 1px solid #BFDBFE;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 6px;
      display: inline-block;
      font-size: 11px;
    }
    .lead-tag {
      background: #FEF3C7;
      color: #92400E;
      font-size: 9px;
      font-weight: 800;
      padding: 1px 5px;
      border-radius: 4px;
      margin-left: 4px;
      text-transform: uppercase;
    }
    .check-box {
      width: 15px;
      height: 15px;
      border: 1.5px solid #475569;
      border-radius: 3px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 4px;
    }
    .summary-card {
      margin-top: 16px;
      padding: 10px 16px;
      background: #F1F5F9;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 700;
      border-left: 4px solid #101F40;
    }
    .sign-section {
      margin-top: 36px;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
    }
    .sign-box { text-align: center; font-size: 11px; color: #64748B; }
    .sign-line { width: 180px; border-bottom: 1px solid #94A3B8; margin-bottom: 6px; }
  </style>
</head>
<body>
  <div class="btn-bar no-print">
    <button class="btn" onclick="window.print()">🖨️ Direct Print Manifest (A4)</button>
    <button class="btn" style="background:#EF4444;" onclick="window.close()">Close Preview</button>
  </div>

  <div class="header">
    <div>
      <h1>AARAMBHA TOURS & TRAVELS</h1>
      <p>Official Passenger Manifest &amp; Conductor Travel-Time Boarding Chart</p>
    </div>
    <div style="text-align:right;">
      <p style="color:#FFF; font-weight:700;">Pune Headquarters</p>
      <p>Control Desk: +91 90676 17451</p>
    </div>
  </div>

  <div class="meta-box">
    <div>
      <div class="meta-title">${packageName}</div>
      <div class="meta-grid">
        <div class="meta-label">Departure Date:</div>
        <div class="meta-val">${formatDate(departureDate)}</div>
        <div class="meta-label">Return Date:</div>
        <div class="meta-val">${returnDate ? formatDate(returnDate) : 'As per Itinerary'}</div>
        <div class="meta-label">Pickup Point &amp; Time:</div>
        <div class="meta-val">${pickupLocation} (${pickupTime})</div>
        <div class="meta-label">Assigned Vehicle:</div>
        <div class="meta-val">${vehicleType}</div>
        <div class="meta-label">Tour Coordinator:</div>
        <div class="meta-val">${tourLeader}</div>
      </div>
    </div>
    <div style="border-left: 1px solid #E2E8F0; padding-left: 16px; display:flex; flex-direction:column; justify-content:center;">
      <div style="font-size:10px; color:#64748B; text-transform:uppercase; font-weight:700;">Confirmed Yatris</div>
      <div style="font-size:26px; font-weight:800; color:#EF4444; margin:3px 0;">${totalSeats} <span style="font-size:12px; color:#64748B; font-weight:500;">Seats</span></div>
      <div style="font-size:11px; color:#334155; font-weight:600;">Across ${uniqueBookings} Booking(s)</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="text-center" style="width: 45px;">Seat</th>
        <th>Passenger Full Name</th>
        <th class="text-center" style="width: 70px;">Age / Sex</th>
        <th class="text-center" style="width: 105px;">Contact Phone</th>
        <th>Pickup Point</th>
        <th class="text-center" style="width: 95px;">Booking Ref</th>
        <th class="text-center" style="width: 90px;">Payment Status</th>
        <th class="text-center" style="width: 100px;">Roll-Call Check</th>
      </tr>
    </thead>
    <tbody>
      ${passengers
        .map(
          (p) => `
        <tr>
          <td class="text-center font-bold"><span class="seat-badge">#${p.seatNo}</span></td>
          <td class="font-bold">
            ${p.name}
            ${p.isPrimary ? '<span class="lead-tag">Primary</span>' : ''}
          </td>
          <td class="text-center">${[p.age && p.age !== '—' ? `${p.age}y` : '', p.gender && p.gender !== '—' ? p.gender[0]?.toUpperCase() : ''].filter(Boolean).join(' / ') || '—'}</td>
          <td class="text-center">${p.phone || '—'}</td>
          <td>${p.pickupPoint || 'Katraj / Swargate'}</td>
          <td class="text-center font-bold" style="font-family:monospace;">${p.bookingCode || '—'}</td>
          <td class="text-center">${p.depositPaid ? `Adv: Rs.${p.depositPaid}` : (p.status || 'Confirmed')}</td>
          <td class="text-center"><span class="check-box"></span> ${p.boarded ? '<b>Boarded</b>' : 'Present'}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="summary-card">
    <div>Total Confirmed Passengers: ${totalSeats} Yatris</div>
    <div>Total Bookings: ${uniqueBookings}</div>
    <div>Emergency Support: +91 82082 11478</div>
  </div>

  <div class="sign-section">
    <div class="sign-box">
      <div class="sign-line"></div>
      Bus Driver / Tour Captain Signature
    </div>
    <div class="sign-box">
      <div class="sign-line"></div>
      Trip Operations Coordinator (Pravin)
    </div>
  </div>

  <script>
    // Auto-trigger print dialog when opened via print button
    window.addEventListener('load', () => {
      // Small timeout for render completion
      setTimeout(() => { window.print(); }, 400);
    });
  </script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
  }
}

/**
 * Generate and download an Excel/CSV spreadsheet for manifest passengers
 */
export function exportMembersListExcel(options: ManifestOptions): void {
  const {
    packageName,
    departureDate,
    returnDate,
    pickupLocation = 'Swargate / Katraj Terminal, Pune',
  } = options;

  const passengers = extractPassengersFromOptions(options);

  const headers = [
    'Seat No',
    'Passenger Name',
    'Age',
    'Gender',
    'Role',
    'Primary Phone',
    'Package Name',
    'Departure Date',
    'Return Date',
    'Pickup Point',
    'Booking Code',
    'Payment Status',
    'Deposit Paid (INR)',
    'Boarding Check',
  ];

  const rows = passengers.map((p) => {
    const seat = p.seatNo;
    const name = (p.name || 'Guest').replace(/"/g, '""');
    const age = p.age || '';
    const gender = p.gender || '';
    const role = p.isPrimary ? 'Lead Booker' : 'Co-Traveler';
    const phone = p.phone || '';
    const pkg = packageName.replace(/"/g, '""');
    const dep = formatDate(departureDate);
    const ret = returnDate ? formatDate(returnDate) : '';
    const pickup = (p.pickupPoint || pickupLocation).replace(/"/g, '""');
    const code = (p.bookingCode || '').replace(/"/g, '""');
    const status = (p.status || 'Confirmed').replace(/"/g, '""');
    const deposit = p.depositPaid ?? 0;
    const check = p.boarded ? 'Boarded' : 'Pending';

    return [
      seat,
      `"${name}"`,
      `"${age}"`,
      `"${gender}"`,
      `"${role}"`,
      `"${phone}"`,
      `"${pkg}"`,
      `"${dep}"`,
      `"${ret}"`,
      `"${pickup}"`,
      `"${code}"`,
      `"${status}"`,
      deposit,
      `"${check}"`,
    ].join(',');
  });

  const summaryRow = [
    'TOTAL',
    `"${passengers.length} Passengers"`,
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
  ].join(',');

  const csvContent = '\uFEFF' + [headers.join(','), ...rows, summaryRow].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanName = packageName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
  const cleanDate = departureDate.split('T')[0];
  link.setAttribute('download', `Aarambha_Manifest_${cleanName}_${cleanDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Aliases for clean backward compatibility
export const exportPassengerManifestPDF = exportMembersListPDF;
export const exportPassengerManifestExcel = exportMembersListExcel;
export const openPrintManifestView = openPrintMembersListView;
