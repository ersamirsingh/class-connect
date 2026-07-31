import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/models/auth.api';
import { KeyRound, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const queryToken = searchParams.get('token');
    if (queryToken) {
      setToken(queryToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Reset token is missing.');
      return;
    }
    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const res = await authApi.resetPassword(token, newPassword);
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Token may be expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1FAE64]/10 text-[#1FAE64] text-xs font-bold mb-3">
          <KeyRound className="w-4 h-4" /> Create New Password
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E2E]">Reset Password</h2>
        <p className="text-xs text-slate-500 mt-1">Enter your token and set a secure new password.</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3.5 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs font-semibold flex items-center gap-2.5"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {successMessage ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-[#1FAE64]/10 border border-[#1FAE64]/20 text-[#1FAE64] text-xs font-semibold flex items-center gap-3"
        >
          <CheckCircle2 className="w-6 h-6 shrink-0 text-[#1FAE64]" />
          <div>
            <div className="font-extrabold text-sm">{successMessage}</div>
            <div className="text-slate-600 mt-0.5">Redirecting to login in 2 seconds...</div>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Reset Token */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-[#3730E0]" /> Reset Token
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste token here"
              required
              className="w-full px-4 py-2.5 bg-[#F7F8FC] border border-slate-200 rounded-2xl text-xs font-mono text-[#1E1E2E] focus:outline-none focus:ring-2 focus:ring-[#3730E0] focus:bg-white transition-all"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#3730E0]" /> New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className="w-full px-4 py-2.5 bg-[#F7F8FC] border border-slate-200 rounded-2xl text-xs font-medium text-[#1E1E2E] focus:outline-none focus:ring-2 focus:ring-[#3730E0] focus:bg-white transition-all"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#1FAE64]" /> Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              required
              className="w-full px-4 py-2.5 bg-[#F7F8FC] border border-slate-200 rounded-2xl text-xs font-medium text-[#1E1E2E] focus:outline-none focus:ring-2 focus:ring-[#1FAE64] focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-visual btn-primary w-full mt-2"
          >
            {isSubmitting ? (
              <span className="text-xs font-bold">Resetting...</span>
            ) : (
              <>
                <span className="text-xs font-extrabold uppercase tracking-wide">Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-3 text-center border-t border-slate-100">
            <Link to="/login" className="text-xs font-bold text-slate-500 hover:text-[#3730E0]">
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
