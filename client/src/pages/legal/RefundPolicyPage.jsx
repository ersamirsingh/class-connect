import React from 'react';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';
import { RefreshCw, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function RefundPolicyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] flex flex-col">
      <FloatingNav />

      <main className="flex-1 pt-28 pb-16">
        <div className="page-container max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header Card */}
          <div className="glass p-8 md:p-10 rounded-2xl border border-[var(--border)] mb-10 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mx-auto mb-5 shadow-sm">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
              {t('legal.refund_title', 'Cancellation & Refund Policy')}
            </h1>
            <p className="text-[var(--ink-muted)] text-sm md:text-base max-w-2xl mx-auto">
              {t('legal.refund_subtitle', 'Transparency and clarity regarding course purchases, digital asset access, and refund terms.')}
            </p>
            <div className="mt-4 text-xs font-semibold text-[var(--primary)] bg-[var(--primary-soft)] inline-block px-3 py-1 rounded-full">
              Last Updated: August 2026
            </div>
          </div>

          {/* Refund Content */}
          <div className="space-y-8 text-sm md:text-base leading-relaxed text-[var(--ink-muted)]">
            <section className="glass p-6 md:p-8 rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--ink)]">
                <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                <h2 className="text-xl font-bold">1. Digital Course Access</h2>
              </div>
              <p>
                Upon successful enrollment and payment confirmation, students are granted immediate full digital access to course video lectures, learning resources, downloadable files, and community access.
              </p>
            </section>

            <section className="glass p-6 md:p-8 rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--ink)]">
                <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />
                <h2 className="text-xl font-bold">2. Refund Terms & Conditions</h2>
              </div>
              <p className="mb-3">
                Due to the immediate consumable nature of digital video courses and downloadable asset packages:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong className="text-[var(--ink)]">General Policy:</strong> All course purchases are non-refundable and non-transferable once video content has been accessed or downloaded.</li>
                <li><strong className="text-[var(--ink)]">Technical Issues:</strong> If you experience severe payment processing errors, double charges, or system issues that prevent course access, our support team will investigate and process a full refund to your original payment method.</li>
                <li><strong className="text-[var(--ink)]">Duplicate Payments:</strong> In cases of accidental duplicate orders, the extra charge will be automatically refunded within 5–7 business days.</li>
              </ul>
            </section>

            <section className="glass p-6 md:p-8 rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--ink)]">
                <RefreshCw className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-xl font-bold">3. How to Request Assistance</h2>
              </div>
              <p className="mb-3">
                If you believe you qualify for a refund due to payment errors or technical issues, please follow these steps:
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-2">
                <li>Visit our <a href="/report-problem" className="text-[var(--primary)] font-medium hover:underline">Report Problem / Support Ticket</a> page or email <a href="mailto:support@classconnect.com" className="text-[var(--primary)] font-medium hover:underline">support@classconnect.com</a>.</li>
                <li>Provide your Order ID, registered email address, transaction reference, and a brief explanation of the issue.</li>
                <li>Our support team will review your request within 24–48 hours and notify you of the status.</li>
              </ol>
            </section>

            <section className="glass p-6 md:p-8 rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--ink)]">
                <HelpCircle className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-xl font-bold">4. Refund Processing Time</h2>
              </div>
              <p>
                Approved refunds are processed back to the original payment source (Credit/Debit Card, Netbanking, UPI, or Wallet) within 5 to 7 working days, depending on your bank or payment gateway service provider.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
