import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Award, ArrowLeft, CheckCircle2, Copy, Check, Search } from 'lucide-react';
import { enrollmentApi } from '../../api/models/enrollment.api';
import { Navbar } from '../../components/guest/Navbar';
import { Footer } from '../../components/guest/Footer';

export function VerifyCertificatePage() {
  const { uniqueId } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function verify() {
      try {
        setLoading(true);
        setError(null);
        const res = await enrollmentApi.verifyPublicCertificate(uniqueId);
        if (res.success && res.data) {
          setCert(res.data);
        } else {
          setError('Certificate not found or invalid.');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Certificate verification failed.');
      } finally {
        setLoading(false);
      }
    }
    if (uniqueId) verify();
  }, [uniqueId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [inputCode, setInputCode] = useState(uniqueId || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      window.location.href = `/verify-certificate/${inputCode.trim()}`;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--canvas)] flex flex-col justify-between font-sans text-[var(--ink)]">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 space-y-8 flex-1">
        
        {/* Navigation & Public Search Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-[var(--primary)] hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-extrabold flex items-center gap-2 hover:bg-slate-50 cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Share Verification Link'}</span>
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--border)] shadow-sm space-y-3">
            <h2 className="text-lg font-extrabold font-manrope">Verify Any Student Certificate</h2>
            <p className="text-xs text-[var(--ink-muted)]">Enter official Hash Code (e.g. <code className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-mono">CC-CERT-9A8B7C-178621</code>) to verify authenticity.</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={inputCode} 
                  onChange={(e) => setInputCode(e.target.value)} 
                  placeholder="Paste Certificate Hash Code..." 
                  className="w-full pl-10 pr-4 py-3 bg-[var(--canvas)] border border-[var(--border)] rounded-2xl text-xs font-mono font-bold focus:outline-none focus:border-[var(--primary)]" 
                />
              </div>
              <button type="submit" className="px-6 py-3 bg-[var(--primary)] text-white text-xs font-extrabold rounded-2xl hover:bg-[var(--deep-anchor,#24216F)] transition-colors cursor-pointer shadow-md">
                Verify Credential
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="p-16 text-center bg-[var(--surface)] rounded-3xl border border-[var(--border)] shadow-xl space-y-4">
            <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-extrabold text-[var(--ink-muted)]">Verifying certificate credentials with ledger...</p>
          </div>
        ) : error || !cert ? (
          <div className="p-12 text-center bg-rose-50 border border-rose-200 rounded-3xl space-y-4">
            <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
            <h2 className="text-xl font-extrabold text-rose-900 font-manrope">Invalid or Unverified Certificate</h2>
            <p className="text-xs font-bold text-rose-700 max-w-md mx-auto">{error || 'The requested certificate ID could not be verified on the ClassConnect registry.'}</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* VERIFIED STATUS BANNER */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-extrabold font-manrope">Official Verified Credential</h3>
                  <p className="text-xs text-emerald-700 font-medium">This certificate was officially issued by ClassConnect and verified on public record.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-mono text-[11px] font-bold">
                VERIFIED ✓
              </span>
            </div>

            {/* SINGLE STATIC FRAME TEMPLATE CERTIFICATE DISPLAY */}
            <motion.div
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 sm:p-12 border-[10px] border-[#1E1B4B] rounded-3xl shadow-2xl relative overflow-hidden text-center space-y-8"
            >
              {/* TOP-RIGHT UNIQUE CERTIFICATE ID OVERLAY */}
              <div className="absolute top-4 right-6 text-right">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Certificate ID</span>
                <span className="font-mono text-xs sm:text-sm font-extrabold text-[#5B54E8] bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                  {cert.certificateId}
                </span>
              </div>

              {/* TOP LEFT BRAND WATERMARK */}
              <div className="absolute top-4 left-6 text-left">
                <span className="font-extrabold text-sm text-[#1E1B4B] tracking-widest uppercase font-manrope">ClassConnect</span>
              </div>

              {/* CENTER SEAL & HEADER */}
              <div className="pt-8 space-y-3">
                <div className="w-16 h-16 bg-[#5B54E8]/10 text-[#5B54E8] rounded-full flex items-center justify-center mx-auto border-2 border-[#5B54E8]/30">
                  <Award className="w-8 h-8" />
                </div>
                <h2 className="text-xl sm:text-3xl font-black font-manrope tracking-widest text-[#1E1B4B] uppercase">
                  Certificate of Completion
                </h2>
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                  Academic & Technical Competency Standard
                </p>
              </div>

              {/* CENTERED DYNAMIC STUDENT NAME */}
              <div className="space-y-3 py-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">This is to certify that</p>
                <div className="inline-block border-b-2 border-slate-300 pb-2 px-8">
                  <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 capitalize tracking-wide">
                    {cert.studentName}
                  </h1>
                </div>
                <p className="text-xs font-semibold text-slate-500 pt-2">
                  has successfully completed all required modules, projects, and assessments for
                </p>
                <h3 className="text-xl sm:text-2xl font-extrabold font-manrope text-[#5B54E8] max-w-xl mx-auto">
                  "{cert.courseTitle}"
                </h3>
              </div>

              {/* FOOTER METADATA & INSTRUCTOR */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                <div className="text-left space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Issued Date</span>
                  <span className="font-mono font-bold text-slate-700">
                    {new Date(cert.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Instructor Signature</span>
                  <span className="font-serif italic font-bold text-base text-slate-900 block">
                    {cert.instructorName}
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
