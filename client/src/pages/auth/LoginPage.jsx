import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, AlertCircle, Loader2 } from 'lucide-react';

export function LoginPage() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await login(email, password);
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || t('auth.loginError'));
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
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-['Manrope'] text-[var(--ink)] mb-2">
            {t('auth.welcomeBack')}
          </h1>
          <p className="text-[var(--ink-muted)] font-['Inter']">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[var(--danger-soft,rgba(255,0,0,0.1))] text-[var(--danger,red)] rounded-[var(--radius-md,12px)] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-[var(--ink)] font-['Inter']">
                {t('auth.passwordLabel')}
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-[var(--primary)] hover:underline"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[48px] px-4 py-3 pr-12 rounded-[var(--radius-md,12px)] border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-shadow font-['Inter']"
                placeholder={t('auth.passwordPlaceholder')}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] hover:text-[var(--ink)] p-1 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
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
                <LogIn className="w-5 h-5" />
                {t('auth.loginButton')}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center font-['Inter']">
          <span className="text-[var(--ink-muted)] text-sm">
            {t('auth.noAccount')}
          </span>{' '}
          <Link 
            to="/signup" 
            className="text-[var(--primary)] font-bold hover:underline text-sm ml-1"
          >
            {t('auth.signupLink')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
