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

// Primary Color Palette
const COLOR_PRIMARY = '1E293B'; // Deep Navy Slate
const COLOR_SECONDARY = '4F46E5'; // Indigo Accent
const COLOR_TEXT = '334155'; // Dark Slate Text
const COLOR_BG_LIGHT = 'F8FAFC'; // Light Gray Shading
const COLOR_BORDER = 'CBD5E1'; // Border Gray

const createTitlePage = () => [
  new Paragraph({ text: '', spacing: { before: 1200 } }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: 'ClassConnect',
        bold: true,
        size: 56,
        color: COLOR_SECONDARY,
        font: 'Arial',
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [
      new TextRun({
        text: 'Course Selling & Learning Platform',
        bold: true,
        size: 32,
        color: COLOR_PRIMARY,
        font: 'Arial',
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 1200 },
    children: [
      new TextRun({
        text: 'Complete Technical & Functional Feature Specification',
        italic: true,
        size: 24,
        color: '64748B',
        font: 'Arial',
      }),
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
                  new TextRun({ text: 'Stack: ', bold: true, size: 20, color: COLOR_PRIMARY }),
                  new TextRun({ text: 'MERN (MongoDB, Express, React, Node.js) + TypeScript\n', size: 20, color: COLOR_TEXT }),
                  new TextRun({ text: 'Version: ', bold: true, size: 20, color: COLOR_PRIMARY }),
                  new TextRun({ text: '1.0 Production Specification\n', size: 20, color: COLOR_TEXT }),
                  new TextRun({ text: 'Target Audience: ', bold: true, size: 20, color: COLOR_PRIMARY }),
                  new TextRun({ text: 'Engineering, Moderation & Product Teams\n', size: 20, color: COLOR_TEXT }),
                  new TextRun({ text: 'Date Generated: ', bold: true, size: 20, color: COLOR_PRIMARY }),
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
  new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
  });

const heading2 = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
  });

const heading3 = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
  });

const bulletItem = (boldPrefix, text) =>
  new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({ text: boldPrefix + ' ', bold: true, color: COLOR_PRIMARY, font: 'Arial' }),
      new TextRun({ text: text, color: COLOR_TEXT, font: 'Arial' }),
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
      heading1: {
        run: { size: 36, bold: true, color: COLOR_PRIMARY, font: 'Arial' },
      },
      heading2: {
        run: { size: 28, bold: true, color: COLOR_SECONDARY, font: 'Arial' },
      },
      heading3: {
        run: { size: 22, bold: true, color: COLOR_PRIMARY, font: 'Arial' },
      },
    },
    sections: [
      {
        properties: {},
        children: [
          ...createTitlePage(),

          // Section 1
          heading1('1. Platform Overview'),
          paragraph(
            'ClassConnect is an end-to-end, enterprise-grade LMS and course monetization platform designed specifically for single-organization education providers. Built on the MERN stack (MongoDB, Express, React, Node.js) with strict TypeScript type safety, ClassConnect delivers a streamlined experience for students while equipping administrators with total control over content creation, payment reconciliation, document verification, multi-language internationalization, and live streaming moderation.'
          ),
          bulletItem('Single Organization Scope:', 'Designed specifically for internal organizational course sales without public third-party instructor registration.'),
          bulletItem('Dual User Role Architecture:', 'Strict segregation between Student learners and Admin moderators.'),
          bulletItem('High-Performance Core:', 'Zero legacy bloat, private video asset protection, real-time WebSockets, and idempotent dual-gateway payments.'),

          // Section 2
          heading1('2. User Roles'),
          bulletItem('Student Role:', 'Registered learners who can discover, preview, purchase, and consume both recorded and live classes. Students have zero access to CMS or administrative management APIs.'),
          bulletItem('Admin Role:', 'Privileged platform owners with full access to CMS, Course Builder, user status toggles, withdrawal queues, document verification reviews, and live class moderation. Admins are created solely through administrative invitation or initial system seed. A server-side safeguard permanently prevents the removal of the final active Admin account.'),

          // Section 3
          heading1('3. Course Content Structure'),
          paragraph('ClassConnect enforces a hierarchical content organization structure:'),
          bulletItem('Hierarchy:', 'Category → Course → Topic (Section) → Lecture.'),
          bulletItem('Recorded Content:', 'Structured into ordered Topics containing granular video lectures with duration, PDF resources, and completion tracking.'),
          bulletItem('Live Content:', 'Flat chronological session schedule (Upcoming, Live Now, Completed) with Google Meet / Socket.io streaming integration.'),
          bulletItem('Immediate Unlocking:', 'Upon course purchase, all Topics, Lectures, and Live Schedules are unlocked simultaneously with no enforced sequential locking.'),

          // Section 4
          heading1('4. Student-Facing Features'),
          heading2('4.1 Account & Profile'),
          bulletItem('Public Auth:', 'Signup, login, JWT token authentication, and single active session enforcement (logging in from a new IP/device invalidates older sessions).'),
          bulletItem('Password Recovery:', 'Forgot/reset password flow via email with cryptographically random reset tokens.'),
          bulletItem('Profile Management:', 'View/update profile photo via Cloudinary upload, phone number, and password.'),

          heading2('4.2 Course Discovery & Preview'),
          bulletItem('Discovery:', 'Category filtering, keyword search, suggested course recommendations.'),
          bulletItem('Preview Video Limits:', 'Limited-play demo videos (default 3 plays max) enforced server-side via `User.previewViews` for logged-in students to prevent guest bypass.'),

          heading2('4.3 Purchase & Payments'),
          bulletItem('Dual Gateways:', 'Razorpay (INR / UPI / Cards / QR) + Stripe (USD / Cards) hosted behind a gateway-agnostic server interface.'),
          bulletItem('Idempotency & Fraud Prevention:', 'Server-verified webhooks operate as sole source of truth for granting access. Client-side price tampering is completely ignored.'),
          bulletItem('Receipt Generation:', 'Downloadable PDF receipts and complete student purchase history.'),

          heading2('4.4 Learning Experience (Recorded)'),
          bulletItem('Player UI:', 'Live / Recorded tab toggle, Topic accordion, video quality/speed controls, position resume.'),
          bulletItem('Progress & Rewards:', 'Completion status tracking and downloadable completion certificate.'),

          heading2('4.5 Live Classes'),
          bulletItem('Live Schedule:', 'Chronological row view with one-tap join and post-session recording playback.'),
          bulletItem('Real-Time Chat:', 'Socket.io powered live session chat with retained message history and moderation interlocks.'),

          heading2('4.6 Referral, Wallet & Payout'),
          bulletItem('Referral Engine:', 'Unique referral links (e.g. `REF-XXXXXX`), auto-credited 15% commission on paid referred orders.'),
          bulletItem('Wallet & Withdrawal:', 'Wallet balance tracking, ₹500 minimum threshold, penny-drop bank account verification.'),

          heading2('4.7 Document Verification'),
          bulletItem('KYC Compliance:', 'PAN document upload with status tracking (`pending`, `verified`, `rejected`), mandatory before withdrawal approval.'),

          heading2('4.8 Multi-Language Support (i18n)'),
          bulletItem('Bilingual UI:', 'Instant English / Telugu UI language toggle with persisted state and fallback.'),

          heading2('4.9 Reports & Support'),
          bulletItem('Problem Reporting:', 'Categorized problem submission with description and up to 3 image attachments.'),

          heading2('4.10 Notifications & Reviews'),
          bulletItem('In-App & Email:', 'Instant launch notifications and course review/rating gallery.'),

          // Section 5
          heading1('5. Admin-Facing Features'),
          heading2('5.1 Dynamic Site Content (CMS)'),
          bulletItem('Live CMS Editor:', 'Update homepage hero banners, testimonials, footer links, and bilingual text fields in real time without redeploying code.'),

          heading2('5.2 Category & Course Builder'),
          bulletItem('Guided Builder:', 'Step-by-step creation of categories, pricing, recorded sections/lectures, live schedules, and preview videos.'),
          bulletItem('Soft-Delete Only:', 'Courses can be unpublished or archived; hard-deletions are blocked to protect historical student records.'),

          heading2('5.3 User & Admin Management'),
          bulletItem('User Moderation:', 'Activate/deactivate student accounts. Create new Admins and deactivate existing Admins with last-Admin safeguard.'),

          heading2('5.4 Payments & Payout Oversight'),
          bulletItem('Order Auditing:', 'Cross-gateway order tracking, refund processing, and withdrawal request queue.'),

          heading2('5.5 Document Verification Review'),
          bulletItem('KYC Desk:', 'Inspect student PAN documents, approve or reject with custom rejection reasons.'),

          heading2('5.6 Live Moderation'),
          bulletItem('Moderation Panel:', 'View active participant roster, mute chat, suspend disruptive students, and restore access.'),

          heading2('5.7 Reports Management'),
          bulletItem('Central Queue:', 'Filter support tickets by status/category, inspect uploaded evidence images, and mark resolved.'),

          heading2('5.8 Analytics & Dashboard'),
          bulletItem('Metric Cards:', 'Total revenue, student count, active courses, enrollment success rate, and monthly trend charts.'),

          // Section 6
          heading1('6. Payment System — Technical Safeguards'),
          bulletItem('Gateway Abstraction:', 'Unified backend controller handles Razorpay and Stripe seamlessly.'),
          bulletItem('Webhook Verification:', 'HMAC signature verification protects against forged webhooks and replay attacks.'),
          bulletItem('Server-Enforced Pricing:', 'Order amounts are strictly derived from MongoDB course prices.'),

          // Section 7
          heading1('7. Video Delivery & Content Security'),
          bulletItem('Private Cloudinary Assets:', 'Paid course videos are stored as private/authenticated Cloudinary assets accessible only via short-lived signed URLs generated post-enrollment check.'),
          bulletItem('Public Preview Isolation:', 'Public preview videos use distinct paths and enforce view-count rate limits.'),

          // Section 8
          heading1('8. Platform-Wide Technical Features'),
          bulletItem('RBAC & Auth Middleware:', 'Every protected route checks JWT validity and role-based permissions.'),
          bulletItem('Sanitization & Rate Limiting:', 'Mongo-sanitize middleware strips NoSQL injection operators (`$ne`), rate limiters throttle auth/payment/report routes.'),
          bulletItem('Secret Protection:', 'Zero environment secrets exposed in client bundles or API error stacks.'),

          // Section 9
          heading1('9. Testing & Quality Assurance'),
          bulletItem('Automated Test Suite:', '13 Jest + Supertest modules covering 60 test cases across Happy Path, Edge Cases, and Attack/Adversarial scenarios.'),
          bulletItem('Security & Resilience:', 'Rigorous verification of NoSQL injection, stored XSS, JWT tampering, BOLA/IDOR, payout gating, and race condition defenses.'),
        ],
      },
    ],
  });

  const docsDir = path.join(__dirname, '../../../docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const filePath = path.join(docsDir, 'ClassConnect-Feature-Specification.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);

  console.log(`✅ Word Document generated successfully at: ${filePath}`);
}

buildDocument().catch((err) => {
  console.error('❌ Error generating Word document:', err);
  process.exit(1);
});
