import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/models/auth.api';
import { Mail, KeyRound, ArrowRight, AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      const res = await authApi.forgotPassword(email);
      if (res.success) {
        setMessage(res.message);
        if (res.resetToken) {
          setResetToken(res.resetToken);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5A623]/10 text-[#F5A623] text-xs font-bold mb-3">
          <KeyRound className="w-4 h-4" /> Password Recovery
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E2E]">Forgot Password?</h2>
        <p className="text-xs text-slate-500 mt-1">Enter your registered email to receive a password reset token.</p>
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

      {message ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#1FAE64]/10 border border-[#1FAE64]/20 text-[#1FAE64] text-xs font-semibold flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold">{message}</div>
              <div className="text-[11px] text-slate-600 font-normal mt-1">
                Please check your inbox or use the token generated below to reset your password.
              </div>
            </div>
          </div>

          {resetToken && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-slate-800 space-y-2">
              <div className="text-xs font-extrabold text-amber-800 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-600" /> Dev/Test Reset Token:
              </div>
              <div className="font-mono text-xs p-2 bg-white rounded-xl border border-amber-200 break-all select-all">
                {resetToken}
              </div>
              <Link
                to={`/reset-password?token=${resetToken}`}
                className="btn-visual btn-primary w-full text-xs mt-2"
              >
                Proceed to Reset Password <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="pt-2 text-center">
            <Link to="/login" className="text-xs font-bold text-[#3730E0] hover:underline">
              Return to Login
            </Link>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#3730E0]" /> Account Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full px-4 py-3 bg-[#F7F8FC] border border-slate-200 rounded-2xl text-xs font-medium text-[#1E1E2E] focus:outline-none focus:ring-2 focus:ring-[#3730E0] focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-visual btn-primary w-full mt-2"
          >
            {isSubmitting ? (
              <span className="text-xs font-bold">Sending request...</span>
            ) : (
              <>
                <span className="text-xs font-extrabold uppercase tracking-wide">Request Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link to="/login" className="text-xs font-bold text-slate-500 hover:text-[#3730E0]">
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
