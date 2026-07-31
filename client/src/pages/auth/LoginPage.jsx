import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const res = await login(formData.email, formData.password);
      if (res.success && res.data) {
        if (res.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3730E0]/10 text-[#3730E0] text-xs font-bold mb-3">
          <LogIn className="w-4 h-4" /> Welcome Back
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E2E]">Sign In</h2>
        <p className="text-xs text-slate-500 mt-1">Access your courses, progress, and live sessions.</p>
      </div>

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3.5 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs font-semibold flex items-center gap-2.5"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-[#3730E0]" /> Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              className="w-full pl-11 pr-4 py-3 bg-[#F7F8FC] border border-slate-200 rounded-2xl text-xs font-medium text-[#1E1E2E] focus:outline-none focus:ring-2 focus:ring-[#3730E0] focus:bg-white transition-all"
            />
            <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#3730E0]" /> Password
            </label>
            <Link to="/forgot-password" className="text-xs font-bold text-[#FF7A33] hover:underline">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full pl-11 pr-11 py-3 bg-[#F7F8FC] border border-slate-200 rounded-2xl text-xs font-medium text-[#1E1E2E] focus:outline-none focus:ring-2 focus:ring-[#3730E0] focus:bg-white transition-all"
            />
            <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-visual btn-primary w-full shadow-lg shadow-[#3730E0]/25 mt-2"
        >
          {isSubmitting ? (
            <span className="text-xs font-bold">Signing in...</span>
          ) : (
            <>
              <span className="text-xs font-extrabold uppercase tracking-wide">Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Switch */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-slate-500 font-medium">New student to ClassConnect?</span>
        <Link
          to="/signup"
          className="px-4 py-2 rounded-xl bg-[#FF7A33]/10 text-[#FF7A33] font-bold hover:bg-[#FF7A33]/20 transition-colors flex items-center gap-1.5"
        >
          <UserCheck className="w-4 h-4" /> Create Student Account
        </Link>
      </div>
    </div>
  );
};
