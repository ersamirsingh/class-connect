import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

export function SignupPage() {
  const { t } = useLanguage();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    referralCode: localStorage.getItem('pendingReferralCode') || '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    if (refParam) {
      localStorage.setItem('pendingReferralCode', refParam);
      setFormData((prev) => ({ ...prev, referralCode: refParam }));
    }
  }, []);

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
    return Math.min(3, strength);
  };

  const strength = getPasswordStrength(formData.password);
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await signup(formData.name, formData.email, formData.password, formData.phone, null, formData.referralCode);
      localStorage.removeItem('pendingReferralCode');
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || t('auth.signupError') || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope text-[var(--ink)] mb-1">
          {t('auth.createAccount') || 'Create Account'}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--ink-muted)] font-medium">
          {t('auth.signupSubtitle') || 'Join ClassConnect to access all courses and interactive live classes.'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 bg-red-50 text-red-600 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">
            {t('auth.nameLabel') || 'Full Name'}
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full min-h-[42px] px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            placeholder="Enter your full name"
            disabled={loading}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">
            {t('auth.emailLabel') || 'Email Address'}
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full min-h-[42px] px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            placeholder="name@example.com"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">
              {t('auth.phoneLabel') || 'Phone Number'}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full min-h-[42px] px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
              placeholder="Enter phone number"
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">
              {t('auth.passwordLabel') || 'Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full min-h-[42px] px-4 py-2 pr-10 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] hover:text-[var(--ink)] p-1 rounded-lg transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider flex items-center justify-between">
            <span>Referral Code</span>
            <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
            className="w-full min-h-[42px] px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] text-sm font-semibold uppercase focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all font-mono"
            placeholder="e.g. REF12345"
            disabled={loading}
          />
        </div>

        {/* Password Strength Bar */}
        {formData.password && (
          <div className="pt-1 flex gap-1 items-center">
            <span className="text-[10px] font-bold text-[var(--ink-muted)] uppercase mr-1">Strength:</span>
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="h-1.5 flex-1 rounded-full transition-all duration-300"
                style={{ backgroundColor: i <= strength ? strengthColors[strength] : 'var(--border)' }}
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[44px] mt-3 flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--deep-anchor,#24216F)] text-white text-xs font-extrabold rounded-full shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>{t('auth.signupButton') || 'Create Free Account'}</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-5 pt-3 border-t border-[var(--border)] text-center text-xs">
        <span className="text-[var(--ink-muted)] font-medium">
          {t('auth.alreadyHaveAccount') || 'Already have an account?'}
        </span>{' '}
        <Link 
          to="/login" 
          className="text-[var(--primary)] font-extrabold hover:underline ml-1"
        >
          {t('auth.loginLink') || 'Sign In'}
        </Link>
      </div>
    </div>
  );
}
