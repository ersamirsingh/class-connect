import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';
import { liveApi } from '../../api/models/live.api';
import { useAuth } from '../../hooks/useAuth';

export function LiveChatPanel({ liveSessionId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [suspended, setSuspended] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // 1. Fetch initial chat history
    const fetchHistory = async () => {
      try {
        const res = await liveApi.getChatHistory(liveSessionId);
        setMessages(res.data || []);
        scrollToBottom();
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    fetchHistory();

    // 2. Initialize Socket.io connection
    const socketUrl = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
      : 'http://localhost:5000';

    const s = io(socketUrl, { withCredentials: true });
    setSocket(s);

    s.emit('join-live-room', { liveSessionId, studentId: user?._id || user?.id });

    // Listen for incoming messages
    s.on('receive-message', (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
      scrollToBottom();
    });

    // Listen for real-time suspension
    s.on('you-are-suspended', (data) => {
      setSuspended(data);
    });

    // Listen for real-time restoration
    s.on('you-are-restored', () => {
      setSuspended(null);
    });

    return () => {
      s.disconnect();
    };
  }, [liveSessionId, user]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !socket || suspended) return;

    socket.emit('send-message', {
      liveSessionId,
      studentId: user?._id || user?.id,
      message: inputMsg.trim(),
    });

    setInputMsg('');
  };

  return (
    <div className="flex flex-col h-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-lg font-sans">
      
      {/* Panel Header */}
      <div className="p-3.5 border-b border-[var(--border)] bg-[var(--canvas)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-xs font-black uppercase text-[var(--ink)] font-manrope">Live Class Chat</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" /> Live
        </span>
      </div>

      {/* Suspension Alert Banner */}
      {suspended && (
        <div className="p-3 bg-rose-100 border-b border-rose-300 text-rose-900 text-xs font-bold flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <p className="font-black text-[11px]">Notice: {suspended.message || 'Suspended'}</p>
            {suspended.reason && <p className="text-[10px] text-rose-800 font-medium">Reason: {suspended.reason}</p>}
          </div>
        </div>
      )}

      {/* Messages Scroll Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[250px] max-h-[400px]">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[var(--ink-muted)] font-medium">
            Welcome to the live chat! Be respectful and ask questions.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = (msg.student?._id || msg.student) === (user?._id || user?.id);
            const isInst = msg.student?.role === 'admin';
            return (
              <div key={msg._id} className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                <img
                  src={msg.student?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                  alt="User"
                  className="w-7 h-7 rounded-full object-cover shrink-0 border border-[var(--border)]"
                />
                <div className={`max-w-[80%] ${isMe ? 'items-end text-right' : ''}`}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-black text-[var(--ink)]">{msg.student?.name || 'Learner'}</span>
                    {isInst && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">
                        Host
                      </span>
                    )}
                  </div>
                  <div className={`px-3 py-2 rounded-2xl text-xs font-medium leading-relaxed shadow-xs inline-block ${
                    isMe ? 'bg-[var(--primary)] text-white rounded-tr-xs' : 'bg-[var(--canvas)] border border-[var(--border)] text-[var(--ink)] rounded-tl-xs'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-[var(--border)] bg-[var(--canvas)] flex items-center gap-2">
        <input
          type="text"
          placeholder={suspended ? 'You are muted from chat...' : 'Type a question or message...'}
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          disabled={!!suspended}
          className="flex-1 px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] text-xs font-medium focus:outline-none focus:border-[var(--primary)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!!suspended || !inputMsg.trim()}
          className="p-2.5 bg-[var(--primary)] text-white rounded-xl shadow-sm hover:bg-[var(--deep-anchor,#24216F)] transition-colors cursor-pointer disabled:opacity-50"
        >
          {suspended ? <Lock className="w-4 h-4" /> : <Send className="w-4 h-4" />}
        </button>
      </form>

    </div>
  );
}
