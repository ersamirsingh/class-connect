import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Lock, Eye, EyeOff, UserCheck, AlertCircle, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // Password strength logic
  const getPasswordStrength = (pass) => {
    if (!pass) return { label: '', score: 0, color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { label: 'Weak', score: 33, color: 'bg-[#EF4444]' };
    if (score <= 4) return { label: 'Medium', score: 66, color: 'bg-[#F59E0B]' };
    return { label: 'Strong', score: 100, color: 'bg-[#10B981]' };
  };

  const strength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const res = await signup(
        formData.name,
        formData.email,
        formData.password
      );
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Signup failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-bold mb-3 border border-[#10B981]/20">
          <UserCheck className="w-4 h-4" /> Free Student Registration
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white tracking-tight">Create Your Account</h2>
        {/* Reassuring Micro-copy */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#F59E0B]" /> Takes less than 1 minute • No credit card required
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs font-semibold flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#4F46E5]" /> Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-[#0F172A] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white dark:focus:bg-slate-800 transition-all shadow-xs"
            />
            <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-[#4F46E5]" /> Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@example.com"
              required
              className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-[#0F172A] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white dark:focus:bg-slate-800 transition-all shadow-xs"
            />
            <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Password & Password Strength Bar */}
        <div>
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#4F46E5]" /> Password
            </span>
            {formData.password && (
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Strength: <strong className={strength.score === 100 ? 'text-[#10B981]' : strength.score === 66 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}>{strength.label}</strong>
              </span>
            )}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
              className="w-full pl-11 pr-12 py-3 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-[#0F172A] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white dark:focus:bg-slate-800 transition-all shadow-xs"
            />
            <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            
            {/* Independent Eye Toggle #1 */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title={showPassword ? 'Hide Password' : 'Show Password'}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-5 h-5 text-[#4F46E5]" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Dynamic Password Strength Meter Bar */}
          {formData.password && (
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${strength.color} transition-all duration-300 rounded-full`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
          )}
        </div>

        {/* Confirm Password Field & Real-Time Matching Indicator */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#3B82F6]" /> Confirm Password
            </label>
            {formData.confirmPassword && (
              <span className={`text-[11px] font-bold flex items-center gap-1 ${passwordsMatch ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {passwordsMatch ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Passwords Match
                  </>
                ) : (
                  'Passwords do not match'
                )}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
              className={`w-full pl-11 pr-12 py-3 bg-[#F8FAFC] dark:bg-slate-900 border ${
                formData.confirmPassword
                  ? passwordsMatch
                    ? 'border-[#10B981]'
                    : 'border-[#EF4444]'
                  : 'border-slate-200 dark:border-slate-700'
              } rounded-2xl text-xs font-semibold text-[#0F172A] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white dark:focus:bg-slate-800 transition-all shadow-xs`}
            />
            <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

            {/* Independent Eye Toggle #2 */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title={showConfirmPassword ? 'Hide Confirm Password' : 'Show Confirm Password'}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5 text-[#3B82F6]" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-visual btn-secondary w-full shadow-lg shadow-[#3B82F6]/25 py-3.5 mt-3"
        >
          {isSubmitting ? (
            <span className="text-xs font-bold">Creating Account...</span>
          ) : (
            <>
              <span className="text-xs font-black uppercase tracking-wider">Create Free Student Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Switch */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Already have an account?</span>
        <Link to="/login" className="font-extrabold text-[#4F46E5] hover:underline flex items-center gap-1">
          Sign In <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
