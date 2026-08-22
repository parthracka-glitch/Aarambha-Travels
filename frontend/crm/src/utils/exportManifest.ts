import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from './formatDate';
import { formatCurrency } from './formatCurrency';

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
}

export interface ManifestOptions {
  packageName: string;
  packageDescription?: string;
  departureDate: string;
  returnDate: string;
  pickupLocation?: string;
  pickupTime?: string;
  tourLeader?: string;
  driverDetails?: string;
  travelers: ManifestTraveler[];
}

/**
 * Generate and download a print-ready Members List PDF
 */
export function exportMembersListPDF(options: ManifestOptions): void {
  const {
    packageName,
    departureDate,
    returnDate,
    pickupLocation = 'Swargate / Katraj Terminal, Pune',
    pickupTime = '06:00 AM',
    tourLeader = 'Pravin / Aarambha Coordinator (+91 82082 11478)',
    travelers,
  } = options;

  const totalSeats = travelers.reduce((sum, t) => sum + (t.seatCount || t.paxCount || 1), 0);
  const totalBookings = travelers.length;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header Banner
  doc.setFillColor(17, 24, 39); // Dark Gray/Navy #111827
  doc.rect(0, 0, 210, 32, 'F');

  // Accent Line
  doc.setFillColor(239, 68, 68); // Aarambha Red #EF4444
  doc.rect(0, 32, 210, 2, 'F');

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('AARAMBHA TOURS & TRAVELS', 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(209, 213, 219);
  doc.text('OFFICIAL MEMBERS LIST & TRAVELER VERIFICATION SHEET', 14, 19);
  doc.text('Katraj / Swargate, Pune | Call: +91 78208 02985 | WhatsApp: +91 82082 11478', 14, 25);

  // Generated Tag
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 196, 25, { align: 'right' });

  // Tour Meta Info Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 38, 182, 34, 2, 2, 'FD');

  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(packageName, 18, 46);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  // Column 1
  doc.text(`Departure Date:`, 18, 54);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(formatDate(departureDate), 48, 54);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Return Date:`, 18, 61);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(formatDate(returnDate), 48, 61);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Pickup Point:`, 18, 68);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(`${pickupLocation} (${pickupTime})`, 48, 68);

  // Column 2
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Total Bookings:`, 120, 54);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(`${totalBookings} Booking(s)`, 152, 54);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Total Members:`, 120, 61);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(239, 68, 68); // Red highlight for seats
  doc.text(`${totalSeats} Members / Seats`, 152, 61);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Coordinator:`, 120, 68);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(tourLeader, 152, 68);

  // Table of Travelers
  const tableData = travelers.map((t, index) => [
    index + 1,
    t.travelerName || t.customerName || 'Guest Member',
    t.phone || '—',
    t.seatCount || t.paxCount || 1,
    t.bookingCode || t.bookingId?.slice(-6).toUpperCase() || '—',
    t.status || 'Confirmed',
    t.depositPaid ? `Deposit: Rs.${t.depositPaid}` : 'Paid',
    '[   ] Verified',
  ]);

  autoTable(doc, {
    startY: 76,
    head: [['S.No', 'Member / Lead Name', 'Phone Number', 'Seats', 'Booking Ref', 'Status', 'Payment', 'Attendance Check']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59], // Slate 800
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      textColor: [30, 41, 59],
      valign: 'middle',
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { cellWidth: 42, fontStyle: 'bold' },
      2: { cellWidth: 32, halign: 'center' },
      3: { halign: 'center', cellWidth: 14, fontStyle: 'bold' },
      4: { halign: 'center', cellWidth: 24 },
      5: { halign: 'center', cellWidth: 20 },
      6: { halign: 'center', cellWidth: 20 },
      7: { halign: 'center', cellWidth: 18, fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 160;

  // Summary & Sign-off Section
  const summaryY = Math.min(finalY + 10, 250);

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(14, summaryY, 196, summaryY);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(`TOTAL MEMBERS: ${totalSeats} SEATS  |  TOTAL BOOKINGS: ${totalBookings}`, 14, summaryY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Note: Cross-verify each member with photo ID before boarding. Report absentees to admin desk.', 14, summaryY + 12);

  // Signature Boxes
  const sigY = summaryY + 20;
  if (sigY + 15 <= 285) {
    doc.line(18, sigY + 10, 70, sigY + 10);
    doc.text('Tour Leader / Driver Signature', 18, sigY + 15);

    doc.line(140, sigY + 10, 192, sigY + 10);
    doc.text('Trip Operations In-charge (Pravin)', 140, sigY + 15);
  }

  const cleanName = packageName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
  const cleanDate = departureDate.split('T')[0];
  doc.save(`Aarambha_Members_List_${cleanName}_${cleanDate}.pdf`);
}

/**
 * Generate and download an Excel/CSV spreadsheet for members
 */
export function exportMembersListExcel(options: ManifestOptions): void {
  const {
    packageName,
    departureDate,
    returnDate,
    pickupLocation = 'Swargate / Katraj Terminal, Pune',
    travelers,
  } = options;

  const headers = [
    'S.No',
    'Member Name',
    'Phone Number',
    'Seat Count',
    'Package Name',
    'Departure Date',
    'Return Date',
    'Pickup Location',
    'Booking Code / ID',
    'Payment Status',
    'Deposit Paid (INR)',
    'Total Amount (INR)',
    'Special Requests',
  ];

  const rows = travelers.map((t, index) => {
    const name = (t.travelerName || t.customerName || 'Guest Member').replace(/"/g, '""');
    const phone = t.phone || '';
    const seats = t.seatCount || t.paxCount || 1;
    const pkg = packageName.replace(/"/g, '""');
    const dep = formatDate(departureDate);
    const ret = formatDate(returnDate);
    const pickup = pickupLocation.replace(/"/g, '""');
    const code = (t.bookingCode || t.bookingId || '').replace(/"/g, '""');
    const status = (t.status || 'Confirmed').replace(/"/g, '""');
    const deposit = t.depositPaid ?? 500;
    const total = t.totalAmount ?? 0;
    const notes = (t.specialRequests || '').replace(/"/g, '""');

    return [
      index + 1,
      `"${name}"`,
      `"${phone}"`,
      seats,
      `"${pkg}"`,
      `"${dep}"`,
      `"${ret}"`,
      `"${pickup}"`,
      `"${code}"`,
      `"${status}"`,
      deposit,
      total,
      `"${notes}"`,
    ].join(',');
  });

  const totalSeats = travelers.reduce((sum, t) => sum + (t.seatCount || t.paxCount || 1), 0);
  const totalDeposit = travelers.reduce((sum, t) => sum + (t.depositPaid || 0), 0);
  const totalAmount = travelers.reduce((sum, t) => sum + (t.totalAmount || 0), 0);

  // Summary Row
  const summaryRow = [
    'TOTAL',
    `"${travelers.length} Bookings"`,
    '""',
    totalSeats,
    '""',
    '""',
    '""',
    '""',
    '""',
    '""',
    totalDeposit,
    totalAmount,
    '""',
  ].join(',');

  const csvContent = '\uFEFF' + [headers.join(','), ...rows, summaryRow].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanName = packageName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
  const cleanDate = departureDate.split('T')[0];
  link.setAttribute('download', `Aarambha_Members_List_${cleanName}_${cleanDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Open a clean, printable HTML Members List in browser
 */
export function openPrintMembersListView(options: ManifestOptions): void {
  const {
    packageName,
    departureDate,
    returnDate,
    pickupLocation = 'Swargate / Katraj Terminal, Pune',
    pickupTime = '06:00 AM',
    tourLeader = 'Pravin / Aarambha Coordinator (+91 82082 11478)',
    travelers,
  } = options;

  const totalSeats = travelers.reduce((sum, t) => sum + (t.seatCount || t.paxCount || 1), 0);
  const totalBookings = travelers.length;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Members List – ${packageName}</title>
  <style>
    @media print {
      @page { size: A4 portrait; margin: 12mm; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      font-size: 13px;
    }
    .header {
      background: #111827;
      color: #ffffff;
      padding: 16px 20px;
      border-radius: 8px 8px 0 0;
      border-bottom: 3px solid #EF4444;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header h1 { margin: 0 0 4px 0; font-size: 18px; font-weight: 800; letter-spacing: 0.5px; }
    .header p { margin: 0; font-size: 11px; color: #9CA3AF; }
    .meta-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 16px;
      margin: 16px 0;
      border-radius: 6px;
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 16px;
    }
    .meta-title { font-size: 16px; font-weight: 800; color: #0F172A; margin-bottom: 8px; }
    .meta-grid { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 12px; }
    .meta-label { color: #64748B; }
    .meta-val { font-weight: 600; color: #0F172A; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 12px;
    }
    th {
      background: #1E293B;
      color: #FFFFFF;
      padding: 10px 8px;
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td {
      padding: 9px 8px;
      border-bottom: 1px solid #E2E8F0;
      color: #334155;
    }
    tr:nth-child(even) td { background: #F8FAFC; }
    .text-center { text-align: center; }
    .font-bold { font-weight: 700; }
    .seat-badge {
      background: #FEE2E2;
      color: #991B1B;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 9999px;
      display: inline-block;
    }
    .check-box {
      width: 16px;
      height: 16px;
      border: 1.5px solid #64748B;
      border-radius: 3px;
      display: inline-block;
    }
    .summary-card {
      margin-top: 20px;
      padding: 12px 16px;
      background: #F1F5F9;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      font-weight: 700;
      border-left: 4px solid #111827;
    }
    .sign-section {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
    }
    .sign-box { text-align: center; font-size: 11px; color: #64748B; }
    .sign-line { width: 180px; border-bottom: 1px solid #94A3B8; margin-bottom: 6px; }
    .btn-bar {
      margin-bottom: 16px;
      display: flex;
      gap: 10px;
    }
    .btn {
      padding: 8px 16px;
      background: #111827;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="btn-bar no-print">
    <button class="btn" onclick="window.print()">🖨️ Print Members List</button>
    <button class="btn" style="background:#EF4444;" onclick="window.close()">Close Window</button>
  </div>

  <div class="header">
    <div>
      <h1>AARAMBHA TOURS & TRAVELS</h1>
      <p>Official Members Attendance &amp; Boarding Verification List</p>
    </div>
    <div style="text-align:right;">
      <p style="color:#FFF; font-weight:700;">Pune, Maharashtra</p>
      <p>+91 82082 11478 | +91 78208 02985</p>
    </div>
  </div>

  <div class="meta-box">
    <div>
      <div class="meta-title">${packageName}</div>
      <div class="meta-grid">
        <div class="meta-label">Departure Date:</div>
        <div class="meta-val">${formatDate(departureDate)}</div>
        <div class="meta-label">Return Date:</div>
        <div class="meta-val">${formatDate(returnDate)}</div>
        <div class="meta-label">Pickup Point &amp; Time:</div>
        <div class="meta-val">${pickupLocation} (${pickupTime})</div>
        <div class="meta-label">Tour Coordinator:</div>
        <div class="meta-val">${tourLeader}</div>
      </div>
    </div>
    <div style="border-left: 1px solid #E2E8F0; padding-left: 16px; display:flex; flex-direction:column; justify-content:center;">
      <div style="font-size:11px; color:#64748B; text-transform:uppercase; font-weight:700;">Total Members</div>
      <div style="font-size:28px; font-weight:800; color:#EF4444; margin:4px 0;">${totalSeats} <span style="font-size:13px; color:#64748B; font-weight:500;">Seats</span></div>
      <div style="font-size:12px; color:#334155; font-weight:600;">Across ${totalBookings} Booking(s)</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="text-center" style="width: 40px;">S.No</th>
        <th>Member / Lead Name</th>
        <th class="text-center">Phone Number</th>
        <th class="text-center" style="width: 60px;">Seats</th>
        <th class="text-center">Booking Ref</th>
        <th class="text-center">Status</th>
        <th class="text-center" style="width: 100px;">Verification</th>
      </tr>
    </thead>
    <tbody>
      ${travelers
        .map(
          (t, i) => `
        <tr>
          <td class="text-center font-bold">${i + 1}</td>
          <td class="font-bold">${t.travelerName || t.customerName || 'Guest Member'}</td>
          <td class="text-center">${t.phone || '—'}</td>
          <td class="text-center"><span class="seat-badge">${t.seatCount || t.paxCount || 1}</span></td>
          <td class="text-center font-bold" style="font-family:monospace;">${t.bookingCode || t.bookingId?.slice(-6).toUpperCase() || '—'}</td>
          <td class="text-center">${t.status || 'Confirmed'}</td>
          <td class="text-center"><span class="check-box"></span> &nbsp; Present</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="summary-card">
    <div>Total Booked Members: ${totalSeats} Seats</div>
    <div>Total Confirmed Bookings: ${totalBookings}</div>
  </div>

  <div class="sign-section">
    <div class="sign-box">
      <div class="sign-line"></div>
      Tour Leader / Bus Driver Signature
    </div>
    <div class="sign-box">
      <div class="sign-line"></div>
      Trip Operations Manager (Pravin)
    </div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
  }
}

// Aliases for clean backward compatibility
export const exportPassengerManifestPDF = exportMembersListPDF;
export const exportPassengerManifestExcel = exportMembersListExcel;
export const openPrintManifestView = openPrintMembersListView;
