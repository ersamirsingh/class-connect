import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Lock, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required.');
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1FAE64]/10 text-[#1FAE64] text-xs font-bold mb-3">
          <UserCheck className="w-4 h-4" /> Student Registration
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E2E] dark:text-white">Join ClassConnect</h2>
        <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">Start your visual learning journey today.</p>
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
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#3730E0]" /> Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="w-full px-4 py-2.5 bg-[#F7F8FC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-[#1E1E2E] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3730E0] focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-[#3730E0]" /> Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="student@example.com"
            required
            className="w-full px-4 py-2.5 bg-[#F7F8FC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-[#1E1E2E] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3730E0] focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#3730E0]" /> Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            required
            className="w-full px-4 py-2.5 bg-[#F7F8FC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-[#1E1E2E] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3730E0] focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-visual btn-secondary w-full mt-3"
        >
          {isSubmitting ? (
            <span className="text-xs font-bold">Creating Account...</span>
          ) : (
            <>
              <span className="text-xs font-extrabold uppercase tracking-wide">Create Student Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Switch */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-300 font-medium">Already have an account?</span>
        <Link to="/login" className="font-bold text-[#3730E0] hover:underline flex items-center gap-1">
          Sign In <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
