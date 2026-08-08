import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileCheck, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import { verificationApi } from '../../../api/models/verification.api';

export function AdminVerificationsPage() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadQueue = async () => {
    try {
      setLoading(true);
      const res = await verificationApi.getAdminQueue(statusFilter);
      setQueue(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [statusFilter]);

  const handleReview = async (id, action, reason = '') => {
    setActionMsg({ type: '', text: '' });
    try {
      await verificationApi.reviewVerification(id, action, reason);
      setActionMsg({ type: 'success', text: `Document status updated to '${action}d'.` });
      setRejectingId(null);
      setRejectReason('');
      await loadQueue();
    } catch (err) {
      setActionMsg({ type: 'error', text: err.response?.data?.message || err.message });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--canvas)] p-4 sm:p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-black uppercase text-[var(--primary)] tracking-widest">Admin Verification Queue</span>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-manrope text-[var(--ink)]">Student Document Verification</h1>
          </div>

          <div className="flex items-center gap-2 bg-[var(--surface)] p-1 rounded-full border border-[var(--border)]">
            {['all', 'pending', 'verified', 'rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold capitalize transition-colors cursor-pointer ${
                  statusFilter === st ? 'bg-[var(--primary)] text-white' : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* System Message */}
        {actionMsg.text && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            actionMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{actionMsg.text}</span>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs font-bold text-[var(--ink-muted)]">Loading verification queue...</div>
          ) : queue.length === 0 ? (
            <div className="p-12 text-center text-xs font-bold text-[var(--ink-muted)]">No verification requests found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--canvas)] text-[var(--ink-muted)] font-black uppercase text-[10px] border-b border-[var(--border)]">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Aadhaar Number</th>
                    <th className="p-4">PAN Number</th>
                    <th className="p-4">Documents</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Submitted Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-[var(--ink)] font-semibold">
                  {queue.map((doc) => (
                    <tr key={doc._id} className="hover:bg-[var(--canvas)] transition-colors">
                      
                      <td className="p-4">
                        <p className="font-extrabold text-[var(--ink)]">{doc.student?.name || 'Student'}</p>
                        <p className="text-[10px] text-[var(--ink-muted)] font-mono">{doc.student?.email}</p>
                      </td>

                      <td className="p-4 font-mono font-bold text-[var(--primary)]">
                        {doc.aadhaarNumber || 'N/A'}
                      </td>

                      <td className="p-4 font-mono font-bold uppercase text-[var(--ink-muted)]">
                        {doc.panNumber || '—'}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="px-3 py-1 bg-[var(--canvas)] text-[var(--primary)] rounded-lg border border-[var(--border)] font-bold text-[11px] hover:bg-indigo-50 flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Images
                        </button>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          doc.status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                          doc.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {doc.status}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-[11px] text-[var(--ink-muted)]">
                        {new Date(doc.updatedAt).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-right">
                        {doc.status === 'pending' && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReview(doc._id, 'approve')}
                              className="px-3 py-1.5 bg-emerald-600 text-white font-extrabold text-[11px] rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectingId(doc._id)}
                              className="px-3 py-1.5 bg-rose-100 text-rose-700 font-extrabold text-[11px] rounded-lg hover:bg-rose-200 transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Image Viewer Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[var(--surface)] p-6 rounded-3xl max-w-2xl w-full border border-[var(--border)] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="font-extrabold text-base text-[var(--ink)] font-manrope">Verification Documents</h3>
                <p className="text-xs text-[var(--ink-muted)]">{selectedDoc.student?.name} — Aadhaar: <strong className="font-mono">{selectedDoc.aadhaarNumber}</strong> {selectedDoc.panNumber && `| PAN: ${selectedDoc.panNumber}`}</p>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer">Close</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-[var(--ink-muted)] block mb-1">Aadhaar Card Image (Required)</span>
                {selectedDoc.aadhaarImageUrl ? (
                  <img src={selectedDoc.aadhaarImageUrl} alt="Aadhaar Card" className="w-full h-48 object-contain bg-slate-900 rounded-xl border border-slate-700" />
                ) : (
                  <div className="h-48 flex items-center justify-center bg-slate-100 rounded-xl text-xs text-slate-500">No Image</div>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-[var(--ink-muted)] block mb-1">PAN Card Image (Optional)</span>
                {selectedDoc.panImageUrl ? (
                  <img src={selectedDoc.panImageUrl} alt="PAN Card" className="w-full h-48 object-contain bg-slate-900 rounded-xl border border-slate-700" />
                ) : (
                  <div className="h-48 flex items-center justify-center bg-slate-100 rounded-xl text-xs text-slate-500">Not Uploaded (Optional)</div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[var(--surface)] p-6 rounded-3xl max-w-md w-full border border-[var(--border)] shadow-2xl space-y-4">
            <h3 className="font-extrabold text-lg font-manrope text-[var(--ink)]">Reject Document Verification</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleReview(rejectingId, 'reject', rejectReason); }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[var(--ink-muted)] block mb-1">Reason for Rejection</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Blurred image or PAN name mismatch..."
                  required
                  className="w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] text-xs font-medium focus:outline-none h-24"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setRejectingId(null)} className="px-4 py-2 text-xs font-bold text-[var(--ink-muted)]">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white font-extrabold text-xs rounded-xl">Confirm Rejection</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
