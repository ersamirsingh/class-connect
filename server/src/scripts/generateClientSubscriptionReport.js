const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
} = require('docx');

const COLOR_PRIMARY = '1E293B';
const COLOR_SECONDARY = '4F46E5';
const COLOR_TEXT = '334155';
const COLOR_BG_LIGHT = 'F8FAFC';
const COLOR_SUCCESS = '059669';

const cellText = (text, opts = {}) =>
  new TableCell({
    shading: opts.bg ? { fill: opts.bg, type: ShadingType.CLEAR } : undefined,
    children: [
      new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({
            text,
            bold: !!opts.bold,
            color: opts.color || COLOR_TEXT,
            font: 'Arial',
            size: opts.size || 18,
          }),
        ],
      }),
    ],
  });

const headerCell = (text) => cellText(text, { bg: COLOR_PRIMARY, bold: true, color: 'FFFFFF', size: 18 });

const createTitlePage = () => [
  new Paragraph({ text: '', spacing: { before: 800 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: 'ClassConnect Platform', bold: true, size: 52, color: COLOR_SECONDARY, font: 'Arial' }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [
      new TextRun({ text: 'API Key Procurement & Subscription Cost Planning Guide', bold: true, size: 28, color: COLOR_PRIMARY, font: 'Arial' }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [
      new TextRun({ text: 'Capacity Planning & Cost Breakdown — All Prices in Indian Rupees (₹)', italic: true, size: 22, color: '64748B', font: 'Arial' }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 800 },
    children: [
      new TextRun({ text: 'For 5,000 Initial Students & 50-100 GB Video Storage', italic: true, size: 22, color: '64748B', font: 'Arial' }),
    ],
  }),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: COLOR_BG_LIGHT, type: ShadingType.CLEAR },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_SECONDARY },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_SECONDARY },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
                children: [
                  new TextRun({ text: 'Prepared For: ', bold: true, size: 20, color: COLOR_PRIMARY }),
                  new TextRun({ text: 'Client Executive & Operations Team\n', size: 20, color: COLOR_TEXT }),
                  new TextRun({ text: 'Platform Capacity: ', bold: true, size: 20, color: COLOR_PRIMARY }),
                  new TextRun({ text: '5,000 Active Students & 50 – 100 GB Video Storage\n', size: 20, color: COLOR_TEXT }),
                  new TextRun({ text: 'Standard Monthly Cost: ', bold: true, size: 20, color: COLOR_PRIMARY }),
                  new TextRun({ text: '~₹10,254 / month (Using Cloudinary Plus)\n', size: 20, color: COLOR_TEXT }),
                  new TextRun({ text: 'Optimized Monthly Cost: ', bold: true, size: 20, color: COLOR_SUCCESS }),
                  new TextRun({ text: '~₹3,024 / month (Using Bunny.net Video CDN)\n', bold: true, size: 20, color: COLOR_SUCCESS }),
                  new TextRun({ text: 'Exchange Rate: ', bold: true, size: 20, color: COLOR_PRIMARY }),
                  new TextRun({ text: '1 USD = ₹84 (Aug 2026)\n', size: 20, color: COLOR_TEXT }),
                  new TextRun({ text: 'Date Prepared: ', bold: true, size: 20, color: COLOR_PRIMARY }),
                  new TextRun({ text: 'August 2026', size: 20, color: COLOR_TEXT }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  }),
  new Paragraph({ text: '', pageBreakBefore: true }),
];

const heading1 = (text) =>
  new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } });

const heading2 = (text) =>
  new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 } });

const bulletItem = (boldPrefix, text) =>
  new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({ text: boldPrefix + ' ', bold: true, color: COLOR_PRIMARY, font: 'Arial' }),
      new TextRun({ text, color: COLOR_TEXT, font: 'Arial' }),
    ],
  });

const paragraph = (text) =>
  new Paragraph({
    spacing: { before: 100, after: 100 },
    children: [new TextRun({ text, color: COLOR_TEXT, font: 'Arial', size: 22 })],
  });

async function buildDocument() {
  const doc = new Document({
    styles: {
      heading1: { run: { size: 34, bold: true, color: COLOR_PRIMARY, font: 'Arial' } },
      heading2: { run: { size: 26, bold: true, color: COLOR_SECONDARY, font: 'Arial' } },
    },
    sections: [
      {
        properties: {},
        children: [
          ...createTitlePage(),

          heading1('1. Executive Summary'),
          paragraph(
            'To launch and run the ClassConnect platform in production, the client needs to register accounts with 5-7 cloud service providers and share the generated API keys / connection strings. This document provides an exact breakdown of storage sizing, bandwidth estimates, recommended subscription tiers, and monthly costs — all in Indian Rupees (₹) — tailored for an initial baseline of 5,000 active students and 50–100 GB of video content.'
          ),

          // Summary Table
          heading1('2. Master API Key & Subscription Summary'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [headerCell('Service'), headerCell('Purpose'), headerCell('API Keys Required'), headerCell('Recommended Plan'), headerCell('Monthly Cost (₹)')] }),
              new TableRow({ children: [cellText('MongoDB Atlas'), cellText('Database & User Data'), cellText('MONGO_URI'), cellText('Flex Tier (usage-based)'), cellText('₹0 (Free M0) or ₹670 (Flex)')] }),
              new TableRow({ children: [cellText('Cloudinary'), cellText('Video & Image Hosting'), cellText('CLOUD_NAME, API_KEY, API_SECRET'), cellText('Plus Plan (225 credits)'), cellText('₹7,480 – ₹8,316')] }),
              new TableRow({ children: [cellText('Bunny.net (Alt.)', { bold: true, color: COLOR_SUCCESS }), cellText('Optimized Video CDN'), cellText('BUNNY_API_KEY, LIBRARY_ID'), cellText('Pay-as-you-go'), cellText('₹840 – ₹1,260 (Save ₹6,700+!)', { bold: true, color: COLOR_SUCCESS })] }),
              new TableRow({ children: [cellText('Razorpay'), cellText('INR Payments & Payouts'), cellText('KEY_ID, KEY_SECRET'), cellText('Standard Merchant (No sub)'), cellText('₹0 (2% + GST per txn)')] }),
              new TableRow({ children: [cellText('Stripe'), cellText('International Payments'), cellText('STRIPE_SECRET_KEY'), cellText('Invite-Only Account'), cellText('₹0 (~4.3% + 2% conv + GST)')] }),
              new TableRow({ children: [cellText('Upstash Redis'), cellText('Rate Limiting & Caching'), cellText('REDIS_HOST, PORT, PASS'), cellText('Free Tier (256 MB)'), cellText('₹0')] }),
              new TableRow({ children: [cellText('Brevo (SMTP)'), cellText('Automated Emails'), cellText('SMTP_HOST, USER, PASS'), cellText('Starter (20K emails/mo)'), cellText('₹1,512')] }),
              new TableRow({ children: [cellText('Render.com'), cellText('Node.js Backend Host'), cellText('Deploy Hook URL'), cellText('Starter (0.5 vCPU, 512 MB)'), cellText('₹588')] }),
              new TableRow({ children: [cellText('Vercel / Netlify'), cellText('React Frontend Hosting'), cellText('—'), cellText('Hobby Free Tier'), cellText('₹0')] }),
              new TableRow({ children: [cellText('Custom Domain'), cellText('.com / .in Domain'), cellText('—'), cellText('Annual Registration'), cellText('₹84 (~₹1,000/year)')] }),
            ],
          }),

          // Total Budget
          heading1('3. Total Monthly Budget Summary'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [headerCell('Setup Type'), headerCell('Monthly Cost (₹)'), headerCell('Annual Cost (₹)')] }),
              new TableRow({ children: [cellText('Standard Setup (Cloudinary Video)'), cellText('₹10,254 – ₹11,090'), cellText('₹1,23,048 – ₹1,33,080')] }),
              new TableRow({ children: [cellText('Optimized Setup (Bunny.net Video)', { bold: true, color: COLOR_SUCCESS }), cellText('₹3,024 – ₹4,130', { bold: true, color: COLOR_SUCCESS }), cellText('₹36,288 – ₹49,560', { bold: true, color: COLOR_SUCCESS })] }),
              new TableRow({ children: [cellText('Annual Savings with Optimized Setup', { bold: true }), cellText('₹6,700 – ₹7,500/mo saved'), cellText('₹80,000 – ₹90,000/year saved')] }),
            ],
          }),

          // Section 4: Deep Sizing
          heading1('4. Database Capacity Sizing (MongoDB Atlas)'),
          paragraph('Calculation for 5,000 initial active students:'),
          bulletItem('User Profiles:', '5,000 users × 1.5 KB per document = 7.5 MB'),
          bulletItem('Enrollments & Progress:', '5,000 students × 4 courses × 20 lessons × 0.5 KB = 100 MB'),
          bulletItem('Payment Receipts & Orders:', '5,000 orders × 2 KB = 10 MB'),
          bulletItem('KYC Verification Records:', '5,000 PAN/Aadhaar records × 2 KB = 10 MB'),
          bulletItem('Wallet & Referral Transactions:', '10,000 transactions × 1.5 KB = 15 MB'),
          bulletItem('Indexes & System Overhead:', '~50 MB buffer'),
          bulletItem('TOTAL ESTIMATED DB SIZE:', '~180 MB to 250 MB'),
          bulletItem('Recommended Plan:', 'MongoDB Atlas M0 Free Tier (512 MB) = ₹0/month — 100% sufficient for launch. For backups & SLA, use Flex Tier = ₹670/month (capped).'),
          bulletItem('Important Note:', 'M2/M5 shared clusters are discontinued as of January 2026. The Flex Tier is the new replacement.'),

          heading1('5. Video Storage & Streaming Sizing'),
          paragraph('Calculation for 50 GB to 100 GB video library & streaming to 500 monthly active learners:'),
          bulletItem('Storage:', '50 – 100 GB of H.264/WebM compressed course videos & HD thumbnails.'),
          bulletItem('Monthly Streaming:', '500 active learners × 10 hours × 500 MB/hr = 2,500 GB (2.5 TB) monthly bandwidth.'),
          bulletItem('Cloudinary Plus Plan:', '225 credits/month. Monthly cost = ₹7,480 – ₹8,316. High bandwidth months may require extra credits.'),
          bulletItem('Bunny.net Stream (Recommended):', 'Storage 100 GB @ ₹0.84/GB = ₹84. Streaming 1,000 GB @ ₹0.84/GB = ₹840. Total = ₹840 – ₹1,260/month. Free standard H.264 encoding included.'),
          bulletItem('ANNUAL SAVINGS:', 'Using Bunny.net saves ₹78,000 – ₹84,000 per year compared to Cloudinary.'),

          heading1('6. Payment Gateway Fees'),
          bulletItem('Razorpay (Domestic):', 'No subscription. Fee = 2% + 18% GST = ~2.36% effective. Per ₹1,000 sale: ₹23.60 deducted.'),
          bulletItem('Stripe (International):', 'No subscription. Fee = ~4.3% + 2% currency conversion + 18% GST = ~6-7.4% effective. Stripe India is invite-only as of 2026.'),

          heading1('7. Email Delivery Sizing (Brevo)'),
          bulletItem('Monthly Volume:', '5,000 students × 2.5 emails/month = 12,500 emails/month.'),
          bulletItem('Recommended Plan:', 'Brevo Starter Plan (20,000 emails/month) = ₹1,512/month.'),

          heading1('8. Rate Limiting & Caching (Upstash Redis)'),
          bulletItem('Memory Required:', '~20 – 50 MB for session tokens, rate limits, and live chat.'),
          bulletItem('Recommended Plan:', 'Upstash Free Tier (256 MB, 500K commands/month) = ₹0/month.'),

          heading1('9. Step-by-Step Action Checklist for Client'),
          bulletItem('Step 1 — MongoDB Atlas:', 'Create account at mongodb.com → Deploy M0/Flex cluster → Copy MONGO_URI connection string.'),
          bulletItem('Step 2 — Cloudinary / Bunny.net:', 'Create account → Copy API credentials (Cloud Name, Key, Secret or Bunny API Key).'),
          bulletItem('Step 3 — Razorpay:', 'Register merchant at razorpay.com → Complete KYC → Generate API Key ID & Secret.'),
          bulletItem('Step 4 — Stripe:', 'Apply at stripe.com/in (invite-only) → Complete KYC → Copy Secret Key.'),
          bulletItem('Step 5 — Brevo SMTP:', 'Create account at brevo.com → Subscribe to Starter Plan → Copy SMTP Host, User, Password.'),
          bulletItem('Step 6 — Upstash Redis:', 'Create account at upstash.com → Create Free Redis DB → Copy Host, Port, Password.'),
          bulletItem('Step 7 — Render.com:', 'Create account at render.com → Connect GitHub repo → Deploy as Starter Web Service (₹588/mo).'),
          bulletItem('Step 8 — Deliver Credentials:', 'Send all API keys securely to the development team via password manager or encrypted document. NEVER send keys over WhatsApp, plain email, or SMS.'),
        ],
      },
    ],
  });

  const docsDir = path.join(__dirname, '../../../docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const filePath = path.join(docsDir, 'ClassConnect-Client-API-Keys-Guide-INR.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);

  console.log(`✅ Word Document generated at: ${filePath}`);
}

buildDocument().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
