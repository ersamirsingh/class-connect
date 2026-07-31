import React, { useState, useEffect } from 'react';
import { reportApi } from '../../../api/models/report.api';
import { Flag, CheckCircle2, Clock, AlertCircle, Loader2, MessageSquare, ExternalLink } from 'lucide-react';

export const ManageReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportApi.getAllReportsAdmin(filterStatus);
      if (res.success && res.data) {
        setReports(res.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load problem reports.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filterStatus]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await reportApi.updateStatus(id, newStatus);
      if (res.success) {
        setMessage({ type: 'success', text: `Ticket status set to ${newStatus}` });
        fetchReports();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update ticket status.' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold mb-2">
          <Flag className="w-4 h-4" /> Operations Support
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white">Reported Problems & Tickets</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Review and resolve reported student issues.</p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {['all', 'open', 'in-progress', 'resolved'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all shrink-0 ${
              filterStatus === st
                ? 'bg-[#6366F1] text-white shadow-md'
                : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 ${
            message.type === 'success'
              ? 'bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]'
              : 'bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-10 h-10 text-[#6366F1] animate-spin mb-3" />
          <span className="text-xs font-bold text-slate-500">Loading tickets...</span>
        </div>
      ) : reports.length === 0 ? (
        <div className="card-visual p-8 text-center text-xs font-bold text-slate-400">
          No reports found under this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="card-visual p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={report.student?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                    alt={report.student?.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#6366F1]"
                  />
                  <div>
                    <div className="text-xs font-extrabold text-[#0F172A] dark:text-white">{report.student?.name || 'Student'}</div>
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{report.student?.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-[10px] font-extrabold uppercase">
                    Category: {report.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                      report.status === 'resolved'
                        ? 'bg-[#10B981]/10 text-[#10B981]'
                        : report.status === 'in-progress'
                        ? 'bg-[#0EA5E9]/10 text-[#0EA5E9]'
                        : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                    }`}
                  >
                    {report.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">{report.description}</p>

              {report.images && report.images.length > 0 && (
                <div className="flex items-center gap-3 pt-2">
                  {report.images.map((img, idx) => (
                    <a key={idx} href={img} target="_blank" rel="noreferrer" className="relative group">
                      <img src={img} alt="Evidence" className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-800" />
                      <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </a>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 text-xs">
                {report.status !== 'in-progress' && (
                  <button
                    onClick={() => handleUpdateStatus(report._id, 'in-progress')}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Set In-Progress
                  </button>
                )}
                {report.status !== 'resolved' && (
                  <button
                    onClick={() => handleUpdateStatus(report._id, 'resolved')}
                    className="btn-visual bg-[#10B981] text-white hover:bg-[#10B981]/90 text-xs px-4 py-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
