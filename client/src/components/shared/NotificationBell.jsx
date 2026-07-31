import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { notificationApi } from '../../api/models/notification.api';

export function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function fetchNotifications() {
    try {
      const res = await notificationApi.getNotifications();
      setNotifications(res.data?.notifications || []);
    } catch {
      // Silently fail — notifications are non-critical
    }
  }

  async function handleMarkRead(id) {
    try {
      await notificationApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // Silently fail
    }
  }

  async function handleMarkAllRead() {
    try {
      await notificationApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // Silently fail
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-xl transition-all duration-200
          text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-soft)]"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[var(--accent)]
            text-white text-[10px] font-bold flex items-center justify-center
            animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-80 max-h-96 overflow-hidden
              bg-[var(--surface)] border border-[var(--border)] rounded-2xl
              shadow-[var(--shadow-lg)] z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-bold text-[var(--ink)]">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-72">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell className="w-8 h-8 mx-auto text-[var(--ink-faint)] mb-2" />
                  <p className="text-sm text-[var(--ink-muted)]">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => !n.isRead && handleMarkRead(n._id)}
                    className={`px-4 py-3 border-b border-[var(--border)] last:border-0
                      cursor-pointer transition-colors duration-150
                      ${n.isRead
                        ? 'bg-transparent'
                        : 'bg-[var(--primary-soft)]'
                      } hover:bg-[var(--canvas)]`}
                  >
                    <p className={`text-sm leading-relaxed ${
                      n.isRead ? 'text-[var(--ink-muted)]' : 'text-[var(--ink)] font-medium'
                    }`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-[var(--ink-faint)] mt-1">
                      {new Date(n.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
