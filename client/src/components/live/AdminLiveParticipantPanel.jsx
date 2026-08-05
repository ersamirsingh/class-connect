import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  VolumeX, 
  UserX, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { liveApi } from '../../api/models/live.api';

export function AdminLiveParticipantPanel({ liveSessionId, socket }) {
  const [roster, setRoster] = useState({ suspensions: [], recentParticipants: [] });
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [suspendType, setSuspendType] = useState('chat_mute');
  const [reason, setReason] = useState('');
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  const loadRoster = async () => {
    try {
      setLoading(true);
      const res = await liveApi.getSessionRoster(liveSessionId);
      setRoster(res.data || { suspensions: [], recentParticipants: [] });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoster();
  }, [liveSessionId]);

  const handleSuspendSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setActionMsg({ type: '', text: '' });
    try {
      if (socket) {
        socket.emit('suspend-student', {
          liveSessionId,
          studentId: selectedStudent._id,
          type: suspendType,
          reason,
          adminId: 'admin',
        });
      } else {
        await liveApi.suspendStudent(liveSessionId, {
          studentId: selectedStudent._id,
          type: suspendType,
          reason,
        });
      }
      setActionMsg({ type: 'success', text: `Student ${suspendType === 'chat_mute' ? 'muted from chat' : 'suspended from class'}.` });
      setSelectedStudent(null);
      setReason('');
      await loadRoster();
    } catch (err) {
      setActionMsg({ type: 'error', text: err.response?.data?.message || err.message });
    }
  };

  const handleRestore = async (studentId) => {
    setActionMsg({ type: '', text: '' });
    try {
      if (socket) {
        socket.emit('restore-student', { liveSessionId, studentId });
      } else {
        await liveApi.restoreStudent(liveSessionId, studentId);
      }
      setActionMsg({ type: 'success', text: 'Student conduct status restored immediately.' });
      await loadRoster();
    } catch (err) {
      setActionMsg({ type: 'error', text: err.response?.data?.message || err.message });
    }
  };

  return (
    <div className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] shadow-lg space-y-4 font-sans text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[var(--primary)]" />
          <span className="font-extrabold text-xs text-[var(--ink)] uppercase font-manrope">Live Moderation & Roster</span>
        </div>
        <button onClick={loadRoster} className="text-[10px] font-extrabold text-[var(--primary)] hover:underline">
          Refresh Roster
        </button>
      </div>

      {actionMsg.text && (
        <div className={`p-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 ${
          actionMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
        }`}>
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{actionMsg.text}</span>
        </div>
      )}

      {/* SUSPENSIONS LOG */}
      {roster.suspensions.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase text-rose-600 block">Active Suspensions & Mutes</span>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {roster.suspensions.filter(s => s.status === 'active').map((susp) => (
              <div key={susp._id} className="p-2 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-rose-900">{susp.student?.name || 'Student'}</p>
                  <p className="text-[9px] text-rose-700 font-mono">Type: {susp.type} | Reason: {susp.reason}</p>
                </div>
                <button
                  onClick={() => handleRestore(susp.student?._id || susp.student)}
                  className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-[10px] rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PARTICIPANTS / CHATTERS LIST */}
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase text-[var(--ink-muted)] block">Active Class Chatters</span>
        {loading ? (
          <p className="text-[11px] text-[var(--ink-muted)]">Loading roster...</p>
        ) : roster.recentParticipants.length === 0 ? (
          <p className="text-[11px] text-[var(--ink-muted)]">No active chatters recorded in this session yet.</p>
        ) : (
          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {Array.from(new Set(roster.recentParticipants.map(p => p.student?._id))).map((sId) => {
              const item = roster.recentParticipants.find(p => p.student?._id === sId);
              if (!item || !item.student) return null;
              const student = item.student;
              return (
                <div key={sId} className="p-2 bg-[var(--canvas)] border border-[var(--border)] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={student.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'} className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <p className="font-extrabold text-[var(--ink)]">{student.name}</p>
                      <p className="text-[9px] text-[var(--ink-muted)] font-mono">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setSelectedStudent(student); setSuspendType('chat_mute'); }}
                      className="p-1 bg-amber-100 text-amber-800 rounded-lg font-extrabold text-[10px] hover:bg-amber-200 cursor-pointer flex items-center gap-1 px-2"
                      title="Mute Chat"
                    >
                      <VolumeX className="w-3 h-3" /> Mute
                    </button>
                    <button
                      onClick={() => { setSelectedStudent(student); setSuspendType('full'); }}
                      className="p-1 bg-rose-100 text-rose-800 rounded-lg font-extrabold text-[10px] hover:bg-rose-200 cursor-pointer flex items-center gap-1 px-2"
                      title="Full Suspension"
                    >
                      <UserX className="w-3 h-3" /> Suspend
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[var(--surface)] p-5 rounded-2xl max-w-sm w-full border border-[var(--border)] shadow-2xl space-y-3">
            <h3 className="font-extrabold text-sm font-manrope text-[var(--ink)]">
              {suspendType === 'chat_mute' ? 'Mute Student from Chat' : 'Full Session Suspension'}
            </h3>
            <p className="text-[11px] text-[var(--ink-muted)]">Target: <strong>{selectedStudent.name}</strong></p>

            <form onSubmit={handleSuspendSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-[var(--ink-muted)] block mb-1">Reason for Action</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Spamming inappropriate messages..."
                  required
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--canvas)] text-[var(--ink)] text-xs focus:outline-none h-20"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setSelectedStudent(null)} className="px-3 py-1.5 text-xs font-bold text-[var(--ink-muted)]">Cancel</button>
                <button type="submit" className="px-3 py-1.5 bg-rose-600 text-white font-extrabold text-xs rounded-xl">Confirm Action</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
