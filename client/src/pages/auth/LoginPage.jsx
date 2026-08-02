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
      setError(err.response?.data?.message || err.message || t('auth.loginError') || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope text-[var(--ink)] mb-1">
          {t('auth.welcomeBack') || 'Welcome Back'}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--ink-muted)] font-medium">
          {t('auth.loginSubtitle') || 'Sign in to access your courses and continue learning.'}
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 text-red-600 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">
            {t('auth.emailLabel') || 'Email Address'}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            placeholder="name@example.com"
            disabled={loading}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">
              {t('auth.passwordLabel') || 'Password'}
            </label>
            <Link 
              to="/forgot-password" 
              className="text-xs font-bold text-[var(--primary)] hover:underline"
            >
              {t('auth.forgotPassword') || 'Forgot Password?'}
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-[44px] px-4 py-2.5 pr-11 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] text-sm font-semibold focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] hover:text-[var(--ink)] p-1.5 rounded-lg transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[44px] mt-2 flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--deep-anchor,#24216F)] text-white text-xs font-extrabold rounded-full shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>{t('auth.loginButton') || 'Sign In'}</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-[var(--border)] text-center text-xs">
        <span className="text-[var(--ink-muted)] font-medium">
          {t('auth.noAccount') || "Don't have an account?"}
        </span>{' '}
        <Link 
          to="/signup" 
          className="text-[var(--primary)] font-extrabold hover:underline ml-1"
        >
          {t('auth.signupLink') || 'Create an account'}
        </Link>
      </div>
    </div>
  );
}
