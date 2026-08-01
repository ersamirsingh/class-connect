import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { reportApi } from '../../api/models/report.api';
import { AlertCircle, FileImage, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function ReportProblemPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ issueType: 'video_playback', description: '' });
  const [file, setFile] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    try {
      const res = await reportApi.getMyReports();
      const loadedData = Array.isArray(res?.data) 
        ? res.data 
        : (res?.data?.reports || (Array.isArray(res) ? res : []));
      setTickets(loadedData);
    } catch (err) {
      console.error(err);
      setTickets([]);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('issueType', formData.issueType);
      payload.append('description', formData.description);
      if (file) payload.append('attachment', file);
      
      await reportApi.submitReport(payload);
      setSuccess(true);
      setFormData({ issueType: 'video_playback', description: '' });
      setFile(null);
      loadTickets();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const issueTypes = [
    { id: 'video_playback', label: 'Video Playback Issue' },
    { id: 'payment', label: 'Payment / Billing' },
    { id: 'content', label: 'Course Content Missing' },
    { id: 'other', label: 'Other' }
  ];

  return (
    <div className="min-h-screen bg-[var(--canvas)] p-6 md:p-10 text-[var(--ink)] font-sans">
      <div className="max-w-3xl mx-auto space-y-10">
        
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-[var(--primary-soft,#EEEDFD)] text-[var(--primary,#5B54E8)] rounded-2xl shadow-xs">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope">{t('report_problem') || 'Report a Problem'}</h1>
          </div>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)] font-medium">Experiencing an issue? Let us know and our support team will help you out.</p>
        </div>

        <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-xl,24px)] shadow-sm border border-[var(--border)]">
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Ticket submitted successfully! We'll get back to you soon.
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[var(--ink-muted)] block">Issue Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {issueTypes.map(type => (
                  <label key={type.id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.issueType === type.id ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] shadow-xs' : 'border-[var(--border)] bg-[var(--canvas)] hover:bg-[var(--surface)] text-[var(--ink)]'}`}>
                    <input type="radio" name="issueType" className="hidden" checked={formData.issueType === type.id} onChange={() => setFormData({ ...formData, issueType: type.id })} />
                    <span className="font-extrabold text-xs">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[var(--ink-muted)] block">Description</label>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Please describe the issue in detail..."
                className="w-full p-4 bg-[var(--canvas)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--primary)] text-sm font-semibold resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[var(--ink-muted)] block">Attachment (Optional)</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[var(--canvas)] border border-[var(--border)] rounded-xl cursor-pointer hover:bg-[var(--surface)] transition-colors">
                  <FileImage className="w-4 h-4 text-[var(--ink-muted)]" />
                  <span className="text-xs font-bold">{file ? file.name : 'Upload Screenshot'}</span>
                  <input type="file" className="hidden" accept="image/*" onChange={e => setFile(e.target.files[0])} />
                </label>
                {file && <button type="button" onClick={() => setFile(null)} className="text-xs font-bold text-red-500 hover:underline p-2 cursor-pointer">Remove</button>}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting || !formData.description.trim()}
              className="px-6 py-3 min-h-[44px] bg-[var(--primary)] text-white font-extrabold text-xs rounded-full hover:bg-[var(--deep-anchor,#24216F)] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 w-full md:w-auto shadow-md cursor-pointer"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span>Submit Report</span>
            </button>
          </form>
        </div>

        {tickets.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold font-manrope mb-4">My Tickets</h2>
            <div className="space-y-3">
              {tickets.map((ticket, idx) => {
                const ticketIdStr = ticket._id || ticket.id || `TCK-${idx + 1}`;
                const ticketStatus = ticket.status || 'pending';
                const createdDate = ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Recently';

                return (
                  <div key={ticketIdStr} className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-extrabold text-xs font-mono">Ticket #{String(ticketIdStr).substring(0, 8)}</span>
                        <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase ${ticketStatus === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {ticketStatus}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--ink-muted)] line-clamp-2 font-medium">{ticket.description}</p>
                    </div>
                    <div className="text-[11px] font-bold text-[var(--ink-muted)]">
                      {createdDate}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
