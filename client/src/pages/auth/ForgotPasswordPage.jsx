import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { authApi } from '../../api/models/auth.api';

export function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || t('auth.forgotPasswordError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--canvas)] p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-[var(--surface)] rounded-[var(--radius-lg,20px)] shadow-[var(--shadow-card,0_4px_32px_rgba(34,32,90,0.08))] p-8 border border-[var(--border)]"
      >
        <Link 
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] mb-6 min-h-[44px] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('auth.backToLogin')}
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold font-['Manrope'] text-[var(--ink)] mb-2">
            {t('auth.forgotPasswordTitle')}
          </h1>
          <p className="text-[var(--ink-muted)] font-['Inter']">
            {t('auth.forgotPasswordSubtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[var(--danger-soft,rgba(255,0,0,0.1))] text-[var(--danger,red)] rounded-[var(--radius-md,12px)] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="w-16 h-16 bg-[var(--success-soft,rgba(22,165,106,0.1))] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--success,#16A56A)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-['Manrope'] text-[var(--ink)] mb-2">
              {t('auth.checkYourEmail')}
            </h3>
            <p className="text-[var(--ink-muted)] font-['Inter'] mb-6">
              {t('auth.emailSentMessage')}
            </p>
            <Link
              to="/login"
              className="inline-flex min-h-[48px] items-center justify-center w-full bg-[var(--primary)] text-[var(--surface)] font-bold rounded-[var(--radius-md,12px)] hover:bg-[var(--deep-anchor,#24216F)] transition-colors font-['Inter']"
            >
              {t('auth.returnToLogin')}
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[var(--ink)] font-['Inter']">
                {t('auth.emailLabel')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[48px] px-4 py-3 rounded-[var(--radius-md,12px)] border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-shadow font-['Inter']"
                placeholder={t('auth.emailPlaceholder')}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-[var(--primary)] text-[var(--surface)] font-bold rounded-[var(--radius-md,12px)] hover:bg-[var(--deep-anchor,#24216F)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] disabled:opacity-70 disabled:cursor-not-allowed font-['Inter']"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  {t('auth.sendResetLink')}
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
