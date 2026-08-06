import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
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
        <h1 className="font-display text-3xl font-light text-[#000000] mb-1">
          {t('auth.welcomeBack') || 'Welcome Back'}
        </h1>
        <p className="font-body text-xs text-[#71717A]">
          {t('auth.loginSubtitle') || 'Sign in to access your learning tracks and progress.'}
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 text-red-600 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-body">
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-[#000000] uppercase tracking-wider">
            {t('auth.emailLabel') || 'Email Address'}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-[#E4E4E7] bg-[#FBFBF5] text-[#000000] text-sm focus:outline-none focus:border-[#000000] transition-all"
            placeholder="name@example.com"
            disabled={loading}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-mono text-[#000000] uppercase tracking-wider">
              {t('auth.passwordLabel') || 'Password'}
            </label>
            <Link 
              to="/forgot-password" 
              className="text-xs font-mono text-[#71717A] hover:text-[#000000] hover:underline"
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
              className="w-full min-h-[44px] px-4 py-2.5 pr-11 rounded-xl border border-[#E4E4E7] bg-[#FBFBF5] text-[#000000] text-sm focus:outline-none focus:border-[#000000] transition-all"
              placeholder="••••••••"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#000000] p-1 rounded-lg transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide Password' : 'Show Password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[46px] mt-3 flex items-center justify-center gap-2 bg-[#000000] hover:bg-[#27272A] text-white text-xs font-mono uppercase tracking-wider rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
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

      <div className="mt-6 pt-4 border-t border-[#E4E4E7] text-center text-xs font-mono">
        <span className="text-[#71717A]">
          {t('auth.noAccount') || "Don't have an account?"}
        </span>{' '}
        <Link 
          to="/signup" 
          className="text-[#000000] font-medium hover:underline ml-1"
        >
          {t('auth.signupLink') || 'Create an account'}
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
