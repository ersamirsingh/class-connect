import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

export function SignupPage() {
  const { t } = useLanguage();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length > 5) strength += 1;
    if (pass.length > 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return Math.min(4, strength);
  };

  const strength = getPasswordStrength(formData.password);
  const strengthColors = ['var(--danger)', 'var(--energy-accent,#FF6B35)', 'var(--energy-accent,#FF6B35)', 'var(--success)', 'var(--success)'];
  const strengthColor = formData.password ? strengthColors[strength] : 'var(--border)';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signup(formData.name, formData.email, formData.password, formData.phone, null);
      navigate('/login', { state: { message: t('auth.signupSuccess') } });
    } catch (err) {
      setError(err.message || t('auth.signupError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--canvas)] p-4 sm:p-6 lg:p-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-[var(--surface)] rounded-[var(--radius-lg,20px)] shadow-[var(--shadow-card,0_4px_32px_rgba(34,32,90,0.08))] p-8 border border-[var(--border)]"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-['Manrope'] text-[var(--ink)] mb-2">
            {t('auth.createAccount')}
          </h1>
          <p className="text-[var(--ink-muted)] font-['Inter']">
            {t('auth.signupSubtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[var(--danger-soft,rgba(255,0,0,0.1))] text-[var(--danger,red)] rounded-[var(--radius-md,12px)] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--ink)] font-['Inter']">
              {t('auth.nameLabel')}
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full min-h-[48px] px-4 py-3 rounded-[var(--radius-md,12px)] border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-shadow font-['Inter']"
              placeholder={t('auth.namePlaceholder')}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--ink)] font-['Inter']">
              {t('auth.emailLabel')}
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full min-h-[48px] px-4 py-3 rounded-[var(--radius-md,12px)] border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-shadow font-['Inter']"
              placeholder={t('auth.emailPlaceholder')}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--ink)] font-['Inter']">
              {t('auth.phoneLabel')}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full min-h-[48px] px-4 py-3 rounded-[var(--radius-md,12px)] border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-shadow font-['Inter']"
              placeholder={t('auth.phonePlaceholder')}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--ink)] font-['Inter']">
              {t('auth.passwordLabel')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
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
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="pt-2 flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className="h-1 flex-1 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: i <= strength ? strengthColor : 'var(--border)' }}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] mt-2 flex items-center justify-center gap-2 bg-[var(--primary)] text-[var(--surface)] font-bold rounded-[var(--radius-md,12px)] hover:bg-[var(--deep-anchor,#24216F)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] disabled:opacity-70 disabled:cursor-not-allowed font-['Inter']"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                {t('auth.signupButton')}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center font-['Inter']">
          <span className="text-[var(--ink-muted)] text-sm">
            {t('auth.alreadyHaveAccount')}
          </span>{' '}
          <Link 
            to="/login" 
            className="text-[var(--primary)] font-bold hover:underline text-sm ml-1"
          >
            {t('auth.loginLink')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
