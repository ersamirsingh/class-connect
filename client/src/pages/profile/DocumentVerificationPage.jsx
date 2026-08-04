import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileCheck, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  UploadCloud, 
  AlertCircle, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { verificationApi } from '../../api/models/verification.api';

export function DocumentVerificationPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    panNumber: '',
    panImageUrl: '',
    aadhaarImageUrl: '',
  });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const loadStatus = async () => {
    try {
      setLoading(true);
      const res = await verificationApi.getMyStatus();
      setData(res.data);
      if (res.data) {
        setForm({
          panNumber: res.data.panNumber || '',
          panImageUrl: res.data.panImageUrl || '',
          aadhaarImageUrl: res.data.aadhaarImageUrl || '',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      setSubmitting(true);
      await verificationApi.submitVerification(form);
      setMsg({ type: 'success', text: 'Documents submitted successfully for Admin review!' });
      await loadStatus();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 text-[var(--ink)]">
          <div className="w-6 h-6 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <span className="font-bold text-sm">Loading verification status...</span>
        </div>
      </div>
    );
  }

  const status = data?.status || 'unsubmitted';

  return (
    <div className="min-h-screen bg-[var(--canvas)] p-4 sm:p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-black uppercase text-[var(--primary)] tracking-widest">KYC & Identity</span>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-manrope text-[var(--ink)]">Government Document Verification</h1>
          </div>

          {status === 'verified' && (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Identity Verified
            </span>
          )}
          {status === 'pending' && (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs">
              <Clock className="w-4 h-4 text-amber-600" /> Review Pending
            </span>
          )}
          {status === 'rejected' && (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-100 text-rose-800 font-extrabold text-xs">
              <ShieldAlert className="w-4 h-4 text-rose-600" /> Rejected
            </span>
          )}
        </div>

        {/* Rejection Alert */}
        {status === 'rejected' && data?.rejectionReason && (
          <div className="p-4 rounded-2xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold flex items-start gap-2">
            <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <p className="font-black">Verification Rejected</p>
              <p className="font-medium text-rose-800 mt-0.5">{data.rejectionReason}</p>
            </div>
          </div>
        )}

        {/* System Message */}
        {msg.text && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            msg.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{msg.text}</span>
          </div>
        )}

        {/* Main Document Form */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--surface)] p-6 sm:p-8 rounded-3xl border border-[var(--border)] shadow-xl space-y-6"
        >
          <div className="border-b border-[var(--border)] pb-4">
            <h3 className="font-extrabold text-lg text-[var(--ink)] font-manrope">PAN & Aadhaar Upload</h3>
            <p className="text-xs text-[var(--ink-muted)] font-medium">Required for Admin verification before requesting referral wallet payouts.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* PAN Number */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-muted)] block mb-1">PAN Card Number (Required)</label>
              <input
                type="text"
                placeholder="e.g. ABCDE1234F"
                value={form.panNumber}
                onChange={(e) => setForm({ ...form, panNumber: e.target.value })}
                required
                disabled={status === 'verified'}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] font-mono text-xs uppercase font-bold focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            {/* PAN Image URL */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-muted)] block mb-1">PAN Card Document Image URL (Required)</label>
              <input
                type="url"
                placeholder="https://res.cloudinary.com/.../pan_card.png"
                value={form.panImageUrl}
                onChange={(e) => setForm({ ...form, panImageUrl: e.target.value })}
                required
                disabled={status === 'verified'}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] text-xs focus:outline-none focus:border-[var(--primary)]"
              />
              {form.panImageUrl && (
                <div className="mt-2 p-2 bg-[var(--canvas)] rounded-xl border border-[var(--border)] max-w-xs">
                  <img src={form.panImageUrl} alt="PAN Preview" className="w-full h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>

            {/* Optional Aadhaar Image URL */}
            <div>
              <label className="text-xs font-bold text-[var(--ink-muted)] block mb-1">Aadhaar Card Document Image URL (Optional)</label>
              <input
                type="url"
                placeholder="https://res.cloudinary.com/.../aadhaar_card.png"
                value={form.aadhaarImageUrl}
                onChange={(e) => setForm({ ...form, aadhaarImageUrl: e.target.value })}
                disabled={status === 'verified'}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] text-xs focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            {/* Submit Button */}
            {status !== 'verified' && (
              <div className="flex justify-end pt-4 border-t border-[var(--border)]">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-[var(--primary)] text-white text-xs font-extrabold rounded-xl shadow-md hover:bg-[var(--deep-anchor,#24216F)] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Documents for Verification'}
                </button>
              </div>
            )}
          </form>
        </motion.div>

      </div>
    </div>
  );
}
