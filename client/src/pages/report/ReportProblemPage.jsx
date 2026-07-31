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
      setTickets(res?.data || []);
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-[var(--canvas)] p-6 md:p-10 text-[var(--ink)]">
      <div className="max-w-3xl mx-auto space-y-10">
        
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-[var(--aura-violet)] text-[var(--deep-anchor)] rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold font-['Manrope']">{t('report_problem') || 'Report a Problem'}</h1>
          </div>
          <p className="text-[var(--ink-muted)]">Experiencing an issue? Let us know and our support team will help you out.</p>
        </div>

        <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] border border-[var(--border)]">
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-50 border border-green-200 text-[var(--success)] rounded-lg flex items-center gap-3 font-medium">
              <CheckCircle2 className="w-5 h-5" />
              Ticket submitted successfully! We'll get back to you soon.
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Issue Type</label>
              <div className="grid grid-cols-2 gap-3">
                {issueTypes.map(type => (
                  <label key={type.id} className={`flex items-center p-4 border rounded-[var(--radius-lg)] cursor-pointer transition-colors ${formData.issueType === type.id ? 'border-[var(--primary)] bg-[var(--aura-blue)]/30 ring-1 ring-[var(--primary)]' : 'border-[var(--border)] hover:bg-[var(--canvas)]'}`}>
                    <input type="radio" name="issueType" className="hidden" checked={formData.issueType === type.id} onChange={() => setFormData({ ...formData, issueType: type.id })} />
                    <span className="font-medium text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Description</label>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Please describe the issue in detail..."
                className="w-full p-4 bg-[var(--canvas)] border border-[var(--border)] rounded-[var(--radius-lg)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Attachment (Optional)</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-[var(--canvas)] border border-[var(--border)] rounded-[var(--radius-pill)] cursor-pointer hover:bg-white transition-colors">
                  <FileImage className="w-4 h-4 text-[var(--ink-muted)]" />
                  <span className="text-sm font-medium">{file ? file.name : 'Upload Screenshot'}</span>
                  <input type="file" className="hidden" accept="image/*" onChange={e => setFile(e.target.files[0])} />
                </label>
                {file && <button type="button" onClick={() => setFile(null)} className="text-sm text-red-500 hover:underline p-2">Remove</button>}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting || !formData.description.trim()}
              className="px-6 py-3 min-h-[44px] bg-[var(--primary)] text-white font-medium rounded-[var(--radius-pill)] hover:bg-[var(--deep-anchor)] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 w-full md:w-auto"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              Submit Report
            </button>
          </form>
        </div>

        {tickets.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-['Manrope'] mb-4">My Tickets</h2>
            <div className="space-y-3">
              {tickets.map(ticket => (
                <div key={ticket.id} className="bg-[var(--surface)] p-5 rounded-[var(--radius-lg)] border border-[var(--border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-sm">Ticket #{ticket.id.substring(0,6)}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${ticket.status === 'resolved' ? 'bg-green-100 text-[var(--success)]' : 'bg-yellow-100 text-[var(--energy-accent)]'}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--ink-muted)] line-clamp-1">{ticket.description}</p>
                  </div>
                  <div className="text-xs text-[var(--ink-muted)]">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
