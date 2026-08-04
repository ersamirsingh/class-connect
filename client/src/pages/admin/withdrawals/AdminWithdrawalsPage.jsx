import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  AlertCircle, 
  Building2,
  Filter
} from 'lucide-react';
import { walletApi } from '../../../api/models/wallet.api';

export function AdminWithdrawalsPage() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadQueue = async () => {
    try {
      setLoading(true);
      const res = await walletApi.getAdminQueue(statusFilter);
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

  const handleApprove = async (requestId) => {
    setActionMsg({ type: '', text: '' });
    try {
      await walletApi.approveWithdrawal(requestId);
      setActionMsg({ type: 'success', text: 'Payout approved and dispatched via RazorpayX!' });
      await loadQueue();
    } catch (err) {
      setActionMsg({ type: 'error', text: err.response?.data?.message || err.message });
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectingId) return;
    setActionMsg({ type: '', text: '' });
    try {
      await walletApi.rejectWithdrawal(rejectingId, rejectReason);
      setActionMsg({ type: 'success', text: 'Withdrawal rejected and funds refunded to student wallet.' });
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
            <span className="text-xs font-black uppercase text-[var(--primary)] tracking-widest">Admin Control Panel</span>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-manrope text-[var(--ink)]">Withdrawals & Payout Queue</h1>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-[var(--surface)] p-1 rounded-full border border-[var(--border)]">
            {['all', 'pending', 'paid', 'rejected'].map((st) => (
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

        {/* System Message Alert */}
        {actionMsg.text && (
          <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
            actionMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{actionMsg.text}</span>
          </div>
        )}

        {/* QUEUE TABLE */}
        <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs font-bold text-[var(--ink-muted)]">Loading payout queue...</div>
          ) : queue.length === 0 ? (
            <div className="p-12 text-center text-xs font-bold text-[var(--ink-muted)]">No withdrawal requests found for status '{statusFilter}'.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--canvas)] text-[var(--ink-muted)] font-black uppercase text-[10px] border-b border-[var(--border)]">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Requested Amount</th>
                    <th className="p-4">Doc Verification Status</th>
                    <th className="p-4">Requested Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-[var(--ink)] font-semibold">
                  {queue.map((req) => (
                    <tr key={req._id} className="hover:bg-[var(--canvas)] transition-colors">
                      
                      <td className="p-4">
                        <p className="font-extrabold text-[var(--ink)]">{req.student?.name || 'Unknown Student'}</p>
                        <p className="text-[10px] text-[var(--ink-muted)] font-mono">{req.student?.email}</p>
                      </td>

                      <td className="p-4 font-mono font-black text-sm text-[var(--primary)]">
                        ₹{req.amount}
                      </td>

                      <td className="p-4">
                        {req.verificationStatus === 'verified' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
                          </span>
                        ) : req.verificationStatus === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> Unverified / Pending
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-mono text-[11px] text-[var(--ink-muted)]">
                        {new Date(req.requestedAt).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          req.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        {req.status === 'pending' && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(req._id)}
                              className="px-3 py-1.5 bg-emerald-600 text-white font-extrabold text-[11px] rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                              title="Approve Payout"
                            >
                              Approve & Pay
                            </button>
                            <button
                              onClick={() => setRejectingId(req._id)}
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

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[var(--surface)] p-6 rounded-3xl max-w-md w-full border border-[var(--border)] shadow-2xl space-y-4">
            <h3 className="font-extrabold text-lg font-manrope text-[var(--ink)]">Reject Withdrawal Request</h3>
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[var(--ink-muted)] block mb-1">Reason for Rejection</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Bank account name mismatch..."
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
