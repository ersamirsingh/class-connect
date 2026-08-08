import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Radio, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Users, 
  UserX, 
  VolumeX, 
  ShieldAlert, 
  Clock, 
  Ban, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Square,
  RefreshCw,
  Settings,
  MessageSquare,
  Sliders
} from 'lucide-react';
import { liveApi } from '../../api/models/live.api';
import { notificationApi } from '../../api/models/notification.api';
import { courseApi } from '../../api/models/course.api';
import { Bell, Send } from 'lucide-react';

export function AdminGoLiveModal({ course, isOpen, onClose }) {
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [notifyStudentsOnLive, setNotifyStudentsOnLive] = useState(true);
  const [isSendingNotif, setIsSendingNotif] = useState(false);
  const [participants, setParticipants] = useState([
    { _id: 'stu-1', name: 'Md Yusuf', email: 'student1@test.com', audioMuted: false, videoOff: false, status: 'active', photo: 'https://class-connect.b-cdn.net/avatars/1786211720236-avatar-1786211720236.svg' },
    { _id: 'stu-2', name: 'Mahi Raj', email: 'student2@test.com', audioMuted: false, videoOff: true, status: 'active', photo: 'https://class-connect.b-cdn.net/avatars/1786211720641-avatar-1786211720641.svg' },
    { _id: 'stu-3', name: 'Rohan Mehta', email: 'student3@test.com', audioMuted: true, videoOff: false, status: 'active', photo: 'https://class-connect.b-cdn.net/avatars/1786211721037-avatar-1786211721036.svg' },
    { _id: 'stu-4', name: 'Sneha Iyer', email: 'student4@test.com', audioMuted: false, videoOff: false, status: 'muted', photo: 'https://class-connect.b-cdn.net/avatars/1786211721787-avatar-1786211721787.svg' },
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionType, setActionType] = useState('temp_suspend'); // 'mute_mic', 'disable_video', 'temp_suspend', 'perm_suspend', 'chat_mute'
  const [actionReason, setActionReason] = useState('');
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });
  const [adminMic, setAdminMic] = useState(true);
  const [adminCam, setAdminCam] = useState(true);
  const [globalMuteMics, setGlobalMuteMics] = useState(false);
  const [globalDisableCams, setGlobalDisableCams] = useState(false);

  useEffect(() => {
    if (course) {
      setIsLiveActive(course.liveSchedule?.status === 'live' || course.type === 'live');
    }
  }, [course]);

  if (!isOpen || !course) return null;

  const handleStartBroadcast = async () => {
    setIsLiveActive(true);
    let notifText = '';
    try {
      await courseApi.updateLiveStatus(course._id, 'live');
    } catch (e) {
      console.warn('Failed to update live status in DB:', e);
    }
    if (notifyStudentsOnLive) {
      try {
        setIsSendingNotif(true);
        const res = await notificationApi.broadcastLiveAlert({
          courseId: course._id,
          courseTitle: course.title
        });
        notifText = ` 🔔 Notification dispatched to ${res.count || 'all enrolled'} students!`;
      } catch (err) {
        console.warn('Failed to broadcast live notification:', err);
      } finally {
        setIsSendingNotif(false);
      }
    }
    setActionMsg({ type: 'success', text: `🔴 Live Broadcast Started for "${course.title}".${notifText}` });
  };

  const handleSendLiveAlertNow = async () => {
    try {
      setIsSendingNotif(true);
      const res = await notificationApi.broadcastLiveAlert({
        courseId: course._id,
        courseTitle: course.title
      });
      setActionMsg({ type: 'success', text: `🔔 Live notification sent to ${res.count || 'all'} students!` });
    } catch (err) {
      setActionMsg({ type: 'error', text: 'Failed to send live notification.' });
    } finally {
      setIsSendingNotif(false);
    }
  };

  const handleEndBroadcast = async () => {
    setIsLiveActive(false);
    try {
      await courseApi.updateLiveStatus(course._id, 'ended');
    } catch (e) {
      console.warn('Failed to update live status in DB:', e);
    }
    setActionMsg({ type: 'success', text: `Broadcast ended. Session recorded and saved to course archive.` });
  };

  const toggleStudentMic = (studentId) => {
    setParticipants(prev => prev.map(p => {
      if (p._id === studentId) {
        const nextState = !p.audioMuted;
        setActionMsg({ type: 'success', text: `${p.name}'s microphone was ${nextState ? 'Muted' : 'Unmuted'}.` });
        return { ...p, audioMuted: nextState };
      }
      return p;
    }));
  };

  const toggleStudentVideo = (studentId) => {
    setParticipants(prev => prev.map(p => {
      if (p._id === studentId) {
        const nextState = !p.videoOff;
        setActionMsg({ type: 'success', text: `${p.name}'s camera was ${nextState ? 'Disabled' : 'Enabled'}.` });
        return { ...p, videoOff: nextState };
      }
      return p;
    }));
  };

  const handleApplyGlobalMuteMics = () => {
    const next = !globalMuteMics;
    setGlobalMuteMics(next);
    setParticipants(prev => prev.map(p => ({ ...p, audioMuted: next })));
    setActionMsg({ type: 'success', text: next ? 'All student microphones muted by Host.' : 'Student microphones unmuted.' });
  };

  const handleApplyGlobalDisableCams = () => {
    const next = !globalDisableCams;
    setGlobalDisableCams(next);
    setParticipants(prev => prev.map(p => ({ ...p, videoOff: next })));
    setActionMsg({ type: 'success', text: next ? 'All student cameras disabled by Host.' : 'Student cameras enabled.' });
  };

  const handleExecuteAction = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    if (actionType === 'temp_suspend') {
      setParticipants(prev => prev.map(p => p._id === selectedStudent._id ? { ...p, status: 'temp_suspended' } : p));
      setActionMsg({ type: 'success', text: `Student ${selectedStudent.name} temporarily suspended (15 mins).` });
    } else if (actionType === 'perm_suspend') {
      setParticipants(prev => prev.filter(p => p._id !== selectedStudent._id));
      setActionMsg({ type: 'success', text: `Student ${selectedStudent.name} permanently banned from live room.` });
    } else if (actionType === 'chat_mute') {
      setParticipants(prev => prev.map(p => p._id === selectedStudent._id ? { ...p, status: 'chat_muted' } : p));
      setActionMsg({ type: 'success', text: `Student ${selectedStudent.name} muted from live chat.` });
    }

    setSelectedStudent(null);
    setActionReason('');
  };

  const handleRestoreStudent = (studentId) => {
    setParticipants(prev => prev.map(p => p._id === studentId ? { ...p, status: 'active', audioMuted: false, videoOff: false } : p));
    setActionMsg({ type: 'success', text: 'Student conduct status restored.' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.96 }} 
        className="bg-slate-900 text-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-800 font-sans"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl flex items-center gap-2 ${isLiveActive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-400'}`}>
              <Radio className={`w-5 h-5 ${isLiveActive ? 'animate-pulse text-rose-500' : ''}`} />
              <span className="font-extrabold text-xs tracking-wider uppercase">
                {isLiveActive ? 'Live Studio Active' : 'Live Setup Standby'}
              </span>
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white font-manrope line-clamp-1">{course.title}</h2>
              <p className="text-xs text-slate-400">Host Control Center & Live User Operations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer select-none bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
              <input 
                type="checkbox" 
                checked={notifyStudentsOnLive} 
                onChange={(e) => setNotifyStudentsOnLive(e.target.checked)} 
                className="w-3.5 h-3.5 accent-indigo-500 rounded cursor-pointer" 
              />
              <span>🔔 Send Live Alert</span>
            </label>

            <button
              onClick={handleSendLiveAlertNow}
              disabled={isSendingNotif}
              title="Dispatch instant broadcast notification to all students"
              className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Bell className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isSendingNotif ? 'Sending...' : 'Alert Students'}</span>
            </button>

            {isLiveActive ? (
              <button 
                onClick={handleEndBroadcast}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-full transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>End Broadcast</span>
              </button>
            ) : (
              <button 
                onClick={handleStartBroadcast}
                disabled={isSendingNotif}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-full transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Go Live Now</span>
              </button>
            )}

            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Action Alert Banner */}
        {actionMsg.text && (
          <div className={`px-6 py-2.5 text-xs font-bold flex items-center justify-between border-b ${
            actionMsg.type === 'success' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40' : 'bg-rose-950/60 text-rose-400 border-rose-800/40'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionMsg.text}</span>
            </div>
            <button onClick={() => setActionMsg({ type: '', text: '' })} className="hover:opacity-80">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-grow overflow-hidden">
          
          {/* Left / Main Column: Video Stream Stage & Host Controls */}
          <div className="lg:col-span-2 p-6 flex flex-col justify-between space-y-6 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-y-auto">
            {/* Live Screen Stage */}
            <div className="aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative flex flex-col items-center justify-center shadow-inner group">
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="px-3 py-1 bg-rose-600 text-white text-[10px] font-black uppercase rounded-full flex items-center gap-1 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" /> Live Host
                </span>
                <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] font-bold rounded-full border border-slate-700">
                  HD 1080p Stream
                </span>
              </div>

              {/* Stage Visualizer */}
              <div className="flex flex-col items-center gap-3 text-slate-500">
                <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-slate-400 shadow-xl">
                  {adminCam ? <Video className="w-8 h-8 text-indigo-400" /> : <VideoOff className="w-8 h-8 text-rose-400" />}
                </div>
                <p className="font-extrabold text-sm text-slate-300">
                  {isLiveActive ? 'Host Video Broadcast Stream Active' : 'Broadcast Ready — Click "Go Live Now" to Start'}
                </p>
                <p className="text-xs text-slate-500">Bunny Stream Ultra-Low Latency Channel</p>
              </div>

              {/* Host Quick Toolbar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl">
                <button 
                  onClick={() => setAdminMic(!adminMic)}
                  className={`p-3 rounded-xl transition-all cursor-pointer ${adminMic ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white'}`}
                  title={adminMic ? 'Mute Host Mic' : 'Unmute Host Mic'}
                >
                  {adminMic ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button 
                  onClick={() => setAdminCam(!adminCam)}
                  className={`p-3 rounded-xl transition-all cursor-pointer ${adminCam ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white'}`}
                  title={adminCam ? 'Turn Off Host Camera' : 'Turn On Host Camera'}
                >
                  {adminCam ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Global Controls & Master Operations */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" /> Global Class Controls
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Affects all enrolled participants</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleApplyGlobalMuteMics}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    globalMuteMics 
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {globalMuteMics ? <MicOff className="w-4 h-4 text-amber-400" /> : <Mic className="w-4 h-4" />}
                  <span>{globalMuteMics ? 'Unmute All Mics' : 'Mute All Mics'}</span>
                </button>

                <button
                  onClick={handleApplyGlobalDisableCams}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    globalDisableCams 
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' 
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {globalDisableCams ? <VideoOff className="w-4 h-4 text-rose-400" /> : <Video className="w-4 h-4" />}
                  <span>{globalDisableCams ? 'Enable All Cams' : 'Disable All Cams'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Live Roster & Student Operations */}
          <div className="p-6 flex flex-col justify-between space-y-4 bg-slate-950/60 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-slate-200">Live Participants ({participants.length})</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/30">
                  Roster Active
                </span>
              </div>

              {/* Participant Cards */}
              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {participants.map((student) => (
                  <div 
                    key={student._id} 
                    className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <img src={student.photo} alt={student.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700" />
                      <div className="truncate">
                        <p className="font-bold text-xs text-slate-100 truncate">{student.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{student.email}</p>
                      </div>
                    </div>

                    {/* Quick Operations Button Toolbar */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Mic Control */}
                      <button
                        onClick={() => toggleStudentMic(student._id)}
                        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${student.audioMuted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        title={student.audioMuted ? 'Unmute Mic' : 'Mute Mic'}
                      >
                        {student.audioMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      </button>

                      {/* Video Control */}
                      <button
                        onClick={() => toggleStudentVideo(student._id)}
                        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${student.videoOff ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                        title={student.videoOff ? 'Enable Camera' : 'Disable Camera'}
                      >
                        {student.videoOff ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                      </button>

                      {/* Actions Menu */}
                      <button
                        onClick={() => { setSelectedStudent(student); setActionType('temp_suspend'); }}
                        className="p-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs hover:bg-rose-500/30 cursor-pointer"
                        title="Moderate / Suspend Student"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                      </button>

                      {student.status !== 'active' && (
                        <button
                          onClick={() => handleRestoreStudent(student._id)}
                          className="px-2 py-1 bg-emerald-600 text-white font-extrabold text-[10px] rounded-lg hover:bg-emerald-500 cursor-pointer"
                          title="Restore Status"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 text-center">
              Host session controls are broadcast live over WebSocket & Bunny Stream API.
            </div>
          </div>

        </div>
      </motion.div>

      {/* Moderation Action Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 text-white p-6 rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl space-y-4 font-sans">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" /> Student Moderation Action
                </h3>
                <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div>
                <p className="text-xs text-slate-300 font-bold mb-1">Target Participant: {selectedStudent.name}</p>
                <p className="text-[11px] text-slate-400 font-mono mb-3">{selectedStudent.email}</p>

                <form onSubmit={handleExecuteAction} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1.5">Action Type</label>
                    <select
                      value={actionType}
                      onChange={e => setActionType(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-bold focus:outline-none focus:border-indigo-500"
                    >
                      <option value="temp_suspend">⏱️ Temporary Suspension (15 Minutes)</option>
                      <option value="perm_suspend">⛔ Permanent Suspension (Ban from Live Room)</option>
                      <option value="chat_mute">💬 Mute Live Chat Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1.5">Reason for Action</label>
                    <textarea
                      required
                      rows={3}
                      value={actionReason}
                      onChange={e => setActionReason(e.target.value)}
                      placeholder="e.g. Disrespectful behavior or background noise disruption..."
                      className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setSelectedStudent(null)} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white">
                      Cancel
                    </button>
                    <button type="submit" className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-full shadow-lg cursor-pointer">
                      Execute Action
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
