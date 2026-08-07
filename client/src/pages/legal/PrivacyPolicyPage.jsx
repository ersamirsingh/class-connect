import React from 'react';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';
import { ShieldCheck, Lock, Eye, FileText, Bell } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function PrivacyPolicyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] flex flex-col">
      <FloatingNav />

      <main className="flex-1 pt-28 pb-16">
        <div className="page-container max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header Card */}
          <div className="glass p-8 md:p-10 rounded-2xl border border-[var(--border)] mb-10 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mx-auto mb-5 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
              {t('legal.privacy_title', 'Privacy Policy')}
            </h1>
            <p className="text-[var(--ink-muted)] text-sm md:text-base max-w-2xl mx-auto">
              {t('legal.privacy_subtitle', 'We value your trust and are committed to protecting your personal data and privacy.')}
            </p>
            <div className="mt-4 text-xs font-semibold text-[var(--primary)] bg-[var(--primary-soft)] inline-block px-3 py-1 rounded-full">
              Last Updated: August 2026
            </div>
          </div>

          {/* Policy Content */}
          <div className="space-y-8 text-sm md:text-base leading-relaxed text-[var(--ink-muted)]">
            <section className="glass p-6 md:p-8 rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--ink)]">
                <FileText className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-xl font-bold">1. Information We Collect</h2>
              </div>
              <p className="mb-3">
                When you create an account, purchase a course, or interact with ClassConnect, we collect necessary information to provide you with seamless service:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong className="text-[var(--ink)]">Personal Identifiers:</strong> Name, email address, mobile number, and profile picture.</li>
                <li><strong className="text-[var(--ink)]">Account & Authentication Data:</strong> Password hashes, login credentials, and session tokens.</li>
                <li><strong className="text-[var(--ink)]">Financial & Transaction Data:</strong> Payment details (processed securely via Razorpay/Stripe; we do not store raw card/bank data), purchase history, and wallet balance logs.</li>
                <li><strong className="text-[var(--ink)]">Verification Records:</strong> Uploaded identity documents (Aadhaar, PAN, Passport) provided voluntarily for student/instructor verification.</li>
                <li><strong className="text-[var(--ink)]">Learning Activity:</strong> Course progress, video timestamps, quiz scores, certificates, and lecture notes.</li>
              </ul>
            </section>

            <section className="glass p-6 md:p-8 rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--ink)]">
                <Eye className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-xl font-bold">2. How We Use Your Information</h2>
              </div>
              <p className="mb-3">We use your data solely for educational, transactional, and platform improvement purposes:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Enabling access to purchased courses, video playback, and live interactive masterclasses.</li>
                <li>Processing transactions, issuing digital receipts, and managing wallet referral commissions.</li>
                <li>Generating verifiable course completion certificates.</li>
                <li>Sending transactional emails (invoices, password resets) and important course updates.</li>
                <li>Protecting platform integrity against unauthorized sharing or piracy.</li>
              </ul>
            </section>

            <section className="glass p-6 md:p-8 rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--ink)]">
                <Lock className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-xl font-bold">3. Data Protection & Security</h2>
              </div>
              <p>
                We enforce industry-standard security measures including SSL/TLS encryption for all data in transit, bcrypt password hashing, JWT authentication tokens, and restricted database access. Your verification documents are stored securely and accessible only to authorized compliance administrators.
              </p>
            </section>

            <section className="glass p-6 md:p-8 rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--ink)]">
                <Bell className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-xl font-bold">4. Sharing & Third-Party Services</h2>
              </div>
              <p className="mb-3">
                We never sell or rent your personal data to third parties. We share data only with trusted service providers required to operate ClassConnect:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong className="text-[var(--ink)]">Payment Partners:</strong> Razorpay / Stripe for processing payments securely.</li>
                <li><strong className="text-[var(--ink)]">Media & Storage CDN:</strong> Cloudinary / Bunny.net for secure video and asset streaming.</li>
                <li><strong className="text-[var(--ink)]">Email Relay:</strong> Brevo / SendGrid for transactional notifications.</li>
              </ul>
            </section>

            <section className="glass p-6 md:p-8 rounded-xl border border-[var(--border)]">
              <h2 className="text-xl font-bold text-[var(--ink)] mb-4">5. Contact Us Regarding Your Data</h2>
              <p>
                If you have any questions, concerns, or requests regarding your personal data or privacy rights, please contact our support team at <a href="mailto:support@classconnect.com" className="text-[var(--primary)] font-medium hover:underline">support@classconnect.com</a> or reach out via our Help & Support portal.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
