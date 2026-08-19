// Standalone Node.js test script to generate a sample invoice PDF
// Run with: node generate_test_invoice.mjs
// Requires jspdf installed in the frontend/website directory

// Since jsPDF is a browser library, we'll use a simple HTML page approach
// Create a minimal HTML page that auto-generates and downloads the PDF

const html = `<!DOCTYPE html>
<html>
<head>
<title>Invoice Preview Generator</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>
</head>
<body style="background:#111;color:white;font-family:sans-serif;padding:40px;text-align:center;">
<h2>Generating Premium Invoice...</h2>
<p>The PDF will download automatically.</p>
<script>
const { jsPDF } = window.jspdf;

function inr(amount) {
  return 'Rs. ' + amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
const W = doc.internal.pageSize.getWidth();
const H = doc.internal.pageSize.getHeight();
const ML = 16, MR = 16, CW = W - ML - MR;

const C = {
  ink: [17,24,39], muted: [75,85,99], soft: [156,163,175],
  border: [229,231,235], bg: [249,250,251], white: [255,255,255],
  red: [220,38,38], green: [5,150,105], greenLight: [209,250,229],
  greenText: [6,95,70], accent: [5,150,105]
};

// Header
doc.setFillColor(...C.ink);
doc.rect(0, 0, W, 46, 'F');

doc.setFont('helvetica', 'bold');
doc.setFontSize(18);
doc.setTextColor(255,255,255);
doc.text('AARAMBHA', ML, 14);

doc.setFillColor(220,38,38);
doc.circle(ML + doc.getTextWidth('AARAMBHA') + 1.4, 12.2, 1.5, 'F');

doc.setFont('helvetica', 'normal');
doc.setFontSize(7);
doc.setTextColor(160,168,185);
doc.text('TOURS & TRAVELS AND SELF-DRIVE CAR RENTAL', ML, 19.5);

doc.setDrawColor(50,58,75);
doc.setLineWidth(0.25);
doc.line(ML, 23, W-MR, 23);

doc.setFontSize(6.5);
doc.setTextColor(120,130,150);
doc.text('Green Hill Society, Near Mastan Hotel, Mangdewadi, Katraj, Pune - 411046', ML, 28.5);
doc.text('Phone: +91 98765 43210    |    support@aarambha.in', ML, 33.5);

// Right meta
doc.setFont('helvetica', 'bold');
doc.setFontSize(14);
doc.setTextColor(255,255,255);
doc.text('TR-1002', W-MR, 13, { align: 'right' });

doc.setFont('helvetica', 'normal');
doc.setFontSize(6.5);
doc.setTextColor(160,168,185);
doc.text('Date: 13 Aug 2026', W-MR, 19, { align: 'right' });
doc.text('Booking Ref: AAR-307310', W-MR, 23.5, { align: 'right' });

// Type badge
const badgeW = 46;
doc.setFillColor(...C.green);
doc.roundedRect(W-MR-badgeW, 27, badgeW, 8, 1.5, 1.5, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(6);
doc.setTextColor(255,255,255);
doc.text('TOUR PACKAGE INVOICE', W-MR-badgeW/2, 32.2, { align: 'center' });

// Customer card
let Y = 54;
doc.setFillColor(...C.bg);
doc.roundedRect(ML, Y, CW, 34, 3, 3, 'F');
doc.setDrawColor(...C.border);
doc.setLineWidth(0.3);
doc.roundedRect(ML, Y, CW, 34, 3, 3, 'D');

doc.setFont('helvetica', 'bold');
doc.setFontSize(6.5);
doc.setTextColor(...C.soft);
doc.text('BILLED TO', ML+8, Y+8);

doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
doc.setTextColor(...C.ink);
doc.text('Rahul Sharma', ML+8, Y+16);

doc.setFont('helvetica', 'normal');
doc.setFontSize(7.5);
doc.setTextColor(...C.muted);
doc.text('Phone: +91 98765 43210', ML+8, Y+22);
doc.text('Email: rahul@test.com', ML+8, Y+28);

// Status pill
doc.setFillColor(209,250,229);
doc.roundedRect(W-MR-8-38, Y+6, 38, 8, 2, 2, 'F');
doc.setFillColor(...C.green);
doc.circle(W-MR-8-38+5, Y+10.5, 1.8, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(6);
doc.setTextColor(...C.greenText);
doc.text('PARTIALLY PAID', W-MR-8-38+9, Y+11.5);

doc.setFont('helvetica', 'normal');
doc.setFontSize(7);
doc.setTextColor(...C.muted);
doc.text('Mode: Razorpay', W-MR-8, Y+22, { align: 'right' });
doc.text('Txn: AAR-307310', W-MR-8, Y+28, { align: 'right' });

Y += 42;

// Section label
doc.setFont('helvetica', 'bold');
doc.setFontSize(7);
doc.setTextColor(...C.green);
doc.text('BOOKING DETAILS', ML, Y+5);
doc.setDrawColor(...C.green);
doc.setLineWidth(0.35);
doc.line(ML, Y+7, W-MR, Y+7);

Y += 13;

// Table
jsPDF.API.autoTable || (jsPDF.API.autoTable = window.jsPDF.API.autoTable);
doc.autoTable({
  startY: Y,
  head: [['Description', 'Details', 'Qty / Duration', 'Unit Rate', 'Amount']],
  body: [
    ['Ujjain Darshan Package', '14 Sep 2026  →  20 Sep 2026', '2 Travelers', 'Rs. 12,000', 'Rs. 24,000'],
  ],
  theme: 'plain',
  styles: { fontSize: 8.5, cellPadding: {top:4,right:5,bottom:4,left:5}, textColor: C.ink, lineColor: C.border, lineWidth: 0.25 },
  headStyles: { fillColor: C.green, textColor: [255,255,255], fontStyle: 'bold', fontSize: 7.5, cellPadding: {top:4.5,right:5,bottom:4.5,left:5} },
  alternateRowStyles: { fillColor: C.bg },
  columnStyles: { 0:{cellWidth:42,fontStyle:'bold'}, 1:{cellWidth:56}, 2:{cellWidth:26,halign:'center'}, 3:{cellWidth:27,halign:'right'}, 4:{cellWidth:27,halign:'right',fontStyle:'bold'} },
  margin: { left: ML, right: MR },
  tableLineColor: C.border, tableLineWidth: 0.3
});

Y = doc.lastAutoTable.finalY + 10;

// Totals
const totW = 80, totX = W-MR-totW, rowH = 9, pad = 5;

doc.setFillColor(...C.bg);
doc.roundedRect(totX-2, Y-2, totW+4, rowH*3+12, 3, 3, 'F');
doc.setDrawColor(...C.border);
doc.setLineWidth(0.3);
doc.roundedRect(totX-2, Y-2, totW+4, rowH*3+12, 3, 3, 'D');

doc.setFont('helvetica', 'normal');
doc.setFontSize(8);
doc.setTextColor(...C.muted);
doc.text('Subtotal', totX+pad, Y+6);
doc.setFont('helvetica', 'bold');
doc.setTextColor(...C.ink);
doc.text('Rs. 24,000', totX+totW-pad, Y+6, { align: 'right' });
Y += rowH;

doc.setDrawColor(...C.border);
doc.setLineWidth(0.2);
doc.line(totX+pad, Y+1, totX+totW-pad, Y+1);
Y += 3;

doc.setFillColor(...C.greenLight);
doc.rect(totX-2, Y-1, totW+4, rowH, 'F');
doc.setFont('helvetica', 'normal');
doc.setFontSize(8);
doc.setTextColor(...C.greenText);
doc.text('Deposit Paid', totX+pad, Y+6);
doc.setFont('helvetica', 'bold');
doc.setTextColor(...C.green);
doc.text('- Rs. 500', totX+totW-pad, Y+6, { align: 'right' });
Y += rowH;

doc.setFillColor(...C.ink);
doc.roundedRect(totX-2, Y-1, totW+4, rowH+3, 0, 0, 'F');
doc.setFillColor(...C.ink);
doc.rect(totX-2, Y-1, totW+4, 3, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(9.5);
doc.setTextColor(255,255,255);
doc.text('Balance Due', totX+pad, Y+7.5);
doc.setTextColor(253,211,77);
doc.text('Rs. 23,500', totX+totW-pad, Y+7.5, { align: 'right' });
Y += rowH + 8;

// Footer
const FTR_H = 28, FTR_Y = H - FTR_H;
doc.setDrawColor(...C.green);
doc.setLineWidth(0.5);
doc.line(ML, FTR_Y-2, W-MR, FTR_Y-2);

doc.setFillColor(...C.ink);
doc.rect(0, FTR_Y, W, FTR_H, 'F');

doc.setFont('helvetica', 'bold');
doc.setFontSize(9);
doc.setTextColor(255,255,255);
doc.text('Thank you for choosing Aarambha!', ML, FTR_Y+9);

doc.setFont('helvetica', 'normal');
doc.setFontSize(6.5);
doc.setTextColor(140,148,165);
doc.text('This is a computer-generated invoice and does not require a physical signature.', ML, FTR_Y+15);
doc.text('For support: support@aarambha.in   |   +91 98765 43210   |   www.aarambha.in', ML, FTR_Y+21);

doc.setFontSize(6.5);
doc.setTextColor(100,108,125);
doc.text('Page 1 of 1', W-MR, FTR_Y+21, { align: 'right' });

doc.save('Aarambha_Invoice_Preview_TR-1002.pdf');
document.querySelector('h2').textContent = 'Invoice Downloaded!';
document.querySelector('p').textContent = 'Check your Downloads folder for Aarambha_Invoice_Preview_TR-1002.pdf';
</script>
</body>
</html>`;

// Write to public folder so it's accessible from the dev server
const fs = require('fs');
const path = require('path');
const outPath = path.join(__dirname, 'public', 'invoice-preview.html');
fs.writeFileSync(outPath, html);
console.log('Written to: ' + outPath);
console.log('Open: http://localhost:3000/invoice-preview.html');
