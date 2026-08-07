import React from 'react';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';
import { FileText, UserCheck, ShieldAlert, Award, Gavel } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] flex flex-col">
      <FloatingNav />

      <main className="flex-1 pt-28 pb-16">
        <div className="page-container max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header Card */}
          <div className="glass p-8 md:p-10 rounded-2xl border border-[var(--border)] mb-10 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mx-auto mb-5 shadow-sm">
              <FileText className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
              {t('legal.terms_title', 'Terms & Conditions')}
            </h1>
            <p className="text-[var(--ink-muted)] text-sm md:text-base max-w-2xl mx-auto">
              {t('legal.terms_subtitle', 'Please read these terms carefully before accessing or using the ClassConnect platform.')}
            </p>
            <div className="mt-4 text-xs font-semibold text-[var(--primary)] bg-[var(--primary-soft)] inline-block px-3 py-1 rounded-full">
              Last Updated: August 2026
            </div>
          </div>

          {/* Terms Content */}
          <div className="space-y-8 text-sm md:text-base leading-relaxed text-[var(--ink-muted)]">
            <section className="glass p-6 md:p-8 rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--ink)]">
                <UserCheck className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-xl font-bold">1. Account & Eligibility</h2>
              </div>
              <p className="mb-3">
                By creating an account on ClassConnect, you represent that you are at least 18 years of age or accessing the platform under the supervision of a parent or guardian. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Provide accurate, current, and complete registration details.</li>
                <li>Maintain the security of your password and accept responsibility for all activities under your account.</li>
                <li>Notify us immediately of any unauthorized use or security breach of your account.</li>
              </ul>
            </section>

            <section className="glass p-6 md:p-8 rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--ink)]">
                <ShieldAlert className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-xl font-bold">2. Intellectual Property & Anti-Piracy</h2>
              </div>
              <p className="mb-3">
                All content published on ClassConnect — including video lectures, downloadable guides, graphics, source code, logos, and course materials — is protected by copyright and intellectual property laws.
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Courses are licensed for your individual, non-transferable personal learning only.</li>
                <li>Screen recording, downloading, distributing, selling, or sharing account credentials with third parties is strictly prohibited.</li>
                <li>Violation of anti-piracy policies will result in immediate permanent account termination without refund and potential legal prosecution.</li>
              </ul>
            </section>

            <section className="glass p-6 md:p-8 rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--ink)]">
                <Award className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-xl font-bold">3. Course Access & Wallet Earnings Disclaimer</h2>
              </div>
              <p className="mb-3">
                Enrollment grants you lifetime digital access to course materials, subject to platform availability.
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Referral commissions and wallet balance rewards earned through the referral program are subject to compliance verification.</li>
                <li>Financial earnings, career outcomes, or skill growth depend entirely on individual effort; ClassConnect makes no guaranteed income promises.</li>
              </ul>
            </section>

            <section className="glass p-6 md:p-8 rounded-xl border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-4 text-[var(--ink)]">
                <Gavel className="w-5 h-5 text-[var(--primary)]" />
                <h2 className="text-xl font-bold">4. Governing Law & Jurisdiction</h2>
              </div>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of India. Any legal disputes arising out of or in connection with the platform shall be subject to the exclusive jurisdiction of the competent courts in India.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
