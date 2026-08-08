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
  CheckCircle2,
  Upload,
  X,
  FileImage
} from 'lucide-react';
import { verificationApi } from '../../api/models/verification.api';

export function DocumentVerificationPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    aadhaarNumber: '',
    aadhaarImageUrl: '',
    panNumber: '',
    panImageUrl: '',
  });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const loadStatus = async () => {
    try {
      setLoading(true);
      const res = await verificationApi.getMyStatus();
      setData(res.data);
      if (res.data) {
        setForm({
          aadhaarNumber: res.data.aadhaarNumber || '',
          aadhaarImageUrl: res.data.aadhaarImageUrl || '',
          panNumber: res.data.panNumber || '',
          panImageUrl: res.data.panImageUrl || '',
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

  const compressImageFile = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          callback(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          callback(event.target.result);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAadhaarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFile(file, (compressedUrl) => {
      setForm((prev) => ({ ...prev, aadhaarImageUrl: compressedUrl }));
    });
  };

  const handlePanFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFile(file, (compressedUrl) => {
      setForm((prev) => ({ ...prev, panImageUrl: compressedUrl }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    if (!form.aadhaarNumber || !form.aadhaarImageUrl) {
      setMsg({ type: 'error', text: 'Please enter your 12-digit Aadhaar number and upload your Aadhaar card image file.' });
      return;
    }

    try {
      setSubmitting(true);
      await verificationApi.submitVerification(form);
      setMsg({ type: 'success', text: 'Verification documents submitted successfully for Admin review!' });
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
            <h3 className="font-extrabold text-lg text-[var(--ink)] font-manrope">Aadhaar & PAN Document Verification</h3>
            <p className="text-xs text-[var(--ink-muted)] font-medium">Aadhaar verification is required to unlock wallet withdrawals. PAN card is optional.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Aadhaar Number - MANDATORY */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-extrabold text-[var(--ink)] uppercase">
                  Aadhaar Card Number <span className="text-red-500 font-bold">* (Required)</span>
                </label>
              </div>
              <input
                type="text"
                placeholder="e.g. 1234 5678 9012"
                value={form.aadhaarNumber}
                onChange={(e) => setForm({ ...form, aadhaarNumber: e.target.value })}
                required
                disabled={status === 'verified'}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] font-mono text-xs font-bold focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            {/* Aadhaar Image File Upload Box - MANDATORY */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-[var(--ink)] block">
                Aadhaar Card Document Image File <span className="text-red-500 font-bold">* (Required)</span>
              </label>
              
              {form.aadhaarImageUrl ? (
                <div className="p-4 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] max-w-sm space-y-3">
                  <img src={form.aadhaarImageUrl} alt="Aadhaar Card Preview" className="w-full h-44 object-contain rounded-xl bg-slate-900 border border-slate-700" />
                  {status !== 'verified' && (
                    <label className="w-full py-2 bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Change Aadhaar Image File</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleAadhaarFileChange} />
                    </label>
                  )}
                </div>
              ) : (
                <label className="border-2 border-dashed border-[var(--primary)]/60 hover:border-[var(--primary)] bg-[var(--canvas)] p-6 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors max-w-md">
                  <UploadCloud className="w-8 h-8 text-[var(--primary)]" />
                  <span className="text-xs font-extrabold text-[var(--ink)]">Click to Select Aadhaar Card Image File</span>
                  <span className="text-[10px] text-[var(--ink-muted)] font-medium">Supports JPG, PNG, WEBP images (Mandatory)</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleAadhaarFileChange} disabled={status === 'verified'} />
                </label>
              )}
            </div>

            {/* Optional PAN Section */}
            <div className="space-y-4 pt-4 border-t border-[var(--border)]">
              <div>
                <label className="text-xs font-bold text-[var(--ink-muted)] block mb-1">
                  PAN Card Number <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ABCDE1234F"
                  value={form.panNumber}
                  onChange={(e) => setForm({ ...form, panNumber: e.target.value })}
                  disabled={status === 'verified'}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] font-mono text-xs uppercase font-bold focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--ink-muted)] block">
                  PAN Card Document Image File <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                
                {form.panImageUrl ? (
                  <div className="p-4 bg-[var(--canvas)] rounded-2xl border border-[var(--border)] max-w-sm space-y-3">
                    <img src={form.panImageUrl} alt="PAN Card Preview" className="w-full h-44 object-contain rounded-xl bg-slate-900 border border-slate-700" />
                    {status !== 'verified' && (
                      <label className="w-full py-2 bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>Change PAN Image File</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handlePanFileChange} />
                      </label>
                    )}
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] bg-[var(--canvas)] p-5 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors max-w-md">
                    <FileImage className="w-7 h-7 text-[var(--ink-muted)]" />
                    <span className="text-xs font-bold text-[var(--ink)]">Click to Select PAN Card Image File (Optional)</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handlePanFileChange} disabled={status === 'verified'} />
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            {status !== 'verified' && (
              <div className="flex justify-end pt-4 border-t border-[var(--border)]">
                <button
                  type="submit"
                  disabled={submitting || !form.aadhaarNumber || !form.aadhaarImageUrl}
                  className="px-8 py-3 bg-[var(--primary)] text-white text-xs font-extrabold rounded-xl shadow-md hover:bg-[var(--deep-anchor,#24216F)] transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Submit Documents for Verification'}</span>
                </button>
              </div>
            )}
          </form>
        </motion.div>

      </div>
    </div>
  );
}
