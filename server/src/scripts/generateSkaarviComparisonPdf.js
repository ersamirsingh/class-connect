const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Colors
const COLOR_PRIMARY = '#0F172A';    // Deep Navy/Black
const COLOR_HEADER_BG = '#1E293B';  // Slate Header
const COLOR_SUCCESS_BG = '#DCFCE7'; // Light Green Pill
const COLOR_SUCCESS_TEXT = '#15803D';// Dark Green Text
const COLOR_DANGER_BG = '#FEE2E2';  // Light Red Pill
const COLOR_DANGER_TEXT = '#B91C1C'; // Dark Red Text
const COLOR_TEXT = '#334155';       // Dark Slate Text
const COLOR_MUTED = '#64748B';      // Muted Text
const COLOR_ROW_ALT = '#F8FAFC';    // Alternating Row BG

function drawBadge(doc, x, y, width, height, text, isYes) {
  const bg = isYes ? COLOR_SUCCESS_BG : COLOR_DANGER_BG;
  const textColor = isYes ? COLOR_SUCCESS_TEXT : COLOR_DANGER_TEXT;

  // Draw rounded pill
  doc.roundedRect(x, y, width, height, 4).fill(bg);

  // Text inside pill
  doc
    .font('Helvetica-Bold')
    .fontSize(8.5)
    .fillColor(textColor)
    .text(text, x, y + 3, { width: width, align: 'center' });
}

function generatePDF() {
  const doc = new PDFDocument({ margin: 40, size: 'LETTER' });

  const docsDir = path.join(__dirname, '../../../docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const outputPath = path.join(docsDir, 'ClassConnect_vs_Skaarvi_Simple_Comparison.pdf');
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  // Top Banner
  doc.rect(0, 0, 612, 95).fill(COLOR_HEADER_BG);

  doc
    .fillColor('#FFFFFF')
    .font('Helvetica-Bold')
    .fontSize(22)
    .text('ClassConnect vs Skaarvi.com', 40, 22);

  doc
    .fillColor('#94A3B8')
    .font('Helvetica')
    .fontSize(12)
    .text('Simple Feature & Capability Comparison for Client Review', 40, 48);

  doc
    .fillColor('#4ADE80')
    .font('Helvetica-Bold')
    .fontSize(9.5)
    .text('Status: 100% Skaarvi Features Covered + 12 Extra Features Added', 40, 68);

  doc.y = 115;

  // Overview Note
  doc
    .font('Helvetica-Bold')
    .fontSize(13)
    .fillColor(COLOR_PRIMARY)
    .text('Quick Summary for Client:', 40, doc.y);

  doc.moveDown(0.3);

  doc
    .font('Helvetica')
    .fontSize(9.5)
    .fillColor(COLOR_TEXT)
    .text(
      '1. Table 1 shows all the features present on Skaarvi.com — ClassConnect has ALL of them.\n' +
      '2. Table 2 shows the EXTRA advanced features built into ClassConnect that Skaarvi does NOT have.',
      { lineGap: 3 }
    );

  doc.moveDown(0.8);

  // -------------------------------------------------------------
  // TABLE 1: FEATURES WE HAVE (SAME AS SKAARVI)
  // -------------------------------------------------------------
  let y = doc.y;

  // Table 1 Header Banner
  doc.rect(40, y, 532, 26).fill('#15803D'); // Green Banner
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(11).text('TABLE 1: Features We Have (Same as Skaarvi.com)', 50, y + 7);
  y += 30;

  // Column Headers
  doc.rect(40, y, 532, 20).fill('#E2E8F0');
  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLOR_PRIMARY);
  doc.text('Feature', 50, y + 5, { width: 170 });
  doc.text('Simple Explanation', 230, y + 5, { width: 210 });
  doc.text('Skaarvi', 450, y + 5, { width: 55, align: 'center' });
  doc.text('ClassConnect', 510, y + 5, { width: 55, align: 'center' });
  y += 22;

  const table1Data = [
    { name: 'Student Account & Login', desc: 'Login, signup with referral code, password reset', skaarvi: true, cc: true },
    { name: 'Course Search & Categories', desc: 'Browse courses, search bar, category filters', skaarvi: true, cc: true },
    { name: 'Course Details & Price', desc: 'Curriculum syllabus, ratings, original & discount price', skaarvi: true, cc: true },
    { name: 'Razorpay Online Payments', desc: 'UPI (GPay/PhonePe), Credit/Debit Card, Netbanking', skaarvi: true, cc: true },
    { name: 'Student Dashboard', desc: 'My enrolled courses, % progress bar, download resources', skaarvi: true, cc: true },
    { name: 'Video Player Controls', desc: 'Play, pause, 10s skip, 0.5x-2.0x speed, next/prev lesson', skaarvi: true, cc: true },
    { name: 'Referral & Wallet System', desc: 'Share referral links, earn wallet balance, request payout', skaarvi: true, cc: true },
    { name: 'Mobile Bottom Dock Menu', desc: 'Easy mobile navigation bar at the bottom of screen', skaarvi: true, cc: true },
    { name: 'Legal Pages', desc: 'Privacy Policy, Terms & Conditions, Refund Policy', skaarvi: true, cc: true },
    { name: 'WhatsApp & Email Support', desc: 'Direct WhatsApp chat button and support ticket submission', skaarvi: true, cc: true },
  ];

  table1Data.forEach((row, i) => {
    const rowHeight = 22;

    if (i % 2 === 1) {
      doc.rect(40, y, 532, rowHeight).fill(COLOR_ROW_ALT);
    }
    doc.rect(40, y, 532, rowHeight).strokeColor('#E2E8F0').lineWidth(0.5).stroke();

    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLOR_PRIMARY).text(row.name, 48, y + 6, { width: 175 });
    doc.font('Helvetica').fontSize(8.5).fillColor(COLOR_TEXT).text(row.desc, 230, y + 6, { width: 210 });

    // Skaarvi Badge
    drawBadge(doc, 448, y + 4, 52, 14, '[ YES ]', row.skaarvi);
    // ClassConnect Badge
    drawBadge(doc, 508, y + 4, 58, 14, '[ YES ]', row.cc);

    y += rowHeight;
  });

  doc.y = y + 15;

  // -------------------------------------------------------------
  // TABLE 2: EXTRA FEATURES WE HAVE (SKAARVI DOES NOT HAVE)
  // -------------------------------------------------------------
  y = doc.y;

  // Check page overflow
  if (y > 550) {
    doc.addPage();
    y = 40;
  }

  // Table 2 Header Banner
  doc.rect(40, y, 532, 26).fill('#0369A1'); // Blue Banner
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(11).text('TABLE 2: Extra Features We Have (Skaarvi DOES NOT Have)', 50, y + 7);
  y += 30;

  // Column Headers
  doc.rect(40, y, 532, 20).fill('#E2E8F0');
  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLOR_PRIMARY);
  doc.text('Extra Feature', 50, y + 5, { width: 170 });
  doc.text('Why It Helps Your Business', 230, y + 5, { width: 210 });
  doc.text('Skaarvi', 450, y + 5, { width: 55, align: 'center' });
  doc.text('ClassConnect', 510, y + 5, { width: 55, align: 'center' });
  y += 22;

  const table2Data = [
    { name: 'Dark Mode & Light Mode', desc: 'Switch between Dark (#000000) & Light Cream themes', skaarvi: false, cc: true },
    { name: 'Multi-Language Switcher', desc: 'Instant toggle for English, Hindi & Telugu', skaarvi: false, cc: true },
    { name: 'Real-Time Notification Bell', desc: 'Header bell with unread count & notification list', skaarvi: false, cc: true },
    { name: 'Verifiable Course Certificates', desc: 'Printable certificates with unique Verification IDs', skaarvi: false, cc: true },
    { name: 'Live Class Chat Stream', desc: 'Real-time live chat with pinned announcements', skaarvi: false, cc: true },
    { name: 'Admin Live Stream Controls', desc: 'Mute, unmute or remove live class participants', skaarvi: false, cc: true },
    { name: 'CMS Website Content Editor', desc: 'Change homepage banners & text without coding', skaarvi: false, cc: true },
    { name: 'Student Document KYC Verification', desc: 'Upload Aadhaar/PAN with Admin approval status', skaarvi: false, cc: true },
    { name: 'Lesson Discussion Forums', desc: 'Per-lecture Q&A thread for student questions', skaarvi: false, cc: true },
    { name: 'Admin Student Review Controls', desc: 'Approve or delete student reviews & star ratings', skaarvi: false, cc: true },
    { name: 'Support Ticket Management Queue', desc: 'Admin portal to manage and solve student issues', skaarvi: false, cc: true },
    { name: 'Stripe International Payments', desc: 'Accept international payments in USD/EUR', skaarvi: false, cc: true },
  ];

  table2Data.forEach((row, i) => {
    const rowHeight = 22;

    if (y > 720) {
      doc.addPage();
      y = 40;

      // Re-draw Column Headers
      doc.rect(40, y, 532, 20).fill('#E2E8F0');
      doc.font('Helvetica-Bold').fontSize(9).fillColor(COLOR_PRIMARY);
      doc.text('Extra Feature', 50, y + 5, { width: 170 });
      doc.text('Why It Helps Your Business', 230, y + 5, { width: 210 });
      doc.text('Skaarvi', 450, y + 5, { width: 55, align: 'center' });
      doc.text('ClassConnect', 510, y + 5, { width: 55, align: 'center' });
      y += 22;
    }

    if (i % 2 === 1) {
      doc.rect(40, y, 532, rowHeight).fill(COLOR_ROW_ALT);
    }
    doc.rect(40, y, 532, rowHeight).strokeColor('#E2E8F0').lineWidth(0.5).stroke();

    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLOR_PRIMARY).text(row.name, 48, y + 6, { width: 175 });
    doc.font('Helvetica').fontSize(8.5).fillColor(COLOR_TEXT).text(row.desc, 230, y + 6, { width: 210 });

    // Skaarvi Badge (NO)
    drawBadge(doc, 448, y + 4, 52, 14, '[ NO ]', row.skaarvi);
    // ClassConnect Badge (YES)
    drawBadge(doc, 508, y + 4, 58, 14, '[ YES ]', row.cc);

    y += rowHeight;
  });

  // Footer note
  doc
    .fontSize(8)
    .fillColor(COLOR_MUTED)
    .text(
      '© 2026 ClassConnect Platform. Simple Client Feature Checklist.',
      40,
      745,
      { align: 'center', width: 532 }
    );

  doc.end();

  writeStream.on('finish', () => {
    console.log(`✅ Simple PDF generated at: ${outputPath}`);
  });
}

generatePDF();
