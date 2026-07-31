import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, ShoppingBag, Radio, AlertCircle, CheckCircle2, Trash2, Filter } from 'lucide-react';
import api from '../../api/axios';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications').catch(() => ({
          data: {
            data: [
              { id: 1, type: 'purchase', title: 'Payment Successful', message: 'Order #CC-9481 confirmed for Full Stack Web Dev course.', date: '2 hours ago', read: false },
              { id: 2, type: 'live', title: 'Masterclass Starting Soon', message: 'Live React Hooks & State session starts in 30 minutes.', date: '5 hours ago', read: false },
              { id: 3, type: 'report', title: 'Report Update', message: 'Your support ticket #R-204 was resolved by Technical Team.', date: '1 day ago', read: true },
              { id: 4, type: 'system', title: 'Welcome to ClassConnect', message: 'Explore career tracks and join live interactive coding rooms.', date: '3 days ago', read: true },
            ]
          }
        }));
        
        const list = res.data?.data || res.data || [];
        setNotifications(list);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'purchase':
        return <ShoppingBag className="w-4 h-4 text-[#2FA876]" />;
      case 'live':
        return <Radio className="w-4 h-4 text-[#FF7A59]" />;
      case 'report':
        return <AlertCircle className="w-4 h-4 text-[#E8A23D]" />;
      default:
        return <Bell className="w-4 h-4 text-[#5B54E8]" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'purchase') return n.type === 'purchase';
    if (filter === 'live') return n.type === 'live';
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--canvas)] p-6 sm:p-10 text-[var(--ink)] space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-black mb-2">
            <Bell className="w-3.5 h-3.5" /> Activity Stream
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Notifications</h1>
        </div>

        <button
          onClick={markAllRead}
          className="btn-visual btn-primary text-xs px-4 py-2 self-start sm:self-auto"
        >
          <CheckCircle2 className="w-4 h-4" /> Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Activity' },
          { id: 'unread', label: 'Unread Only' },
          { id: 'purchase', label: 'Purchases' },
          { id: 'live', label: 'Live Alerts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filter === tab.id
                ? 'bg-[var(--primary)] text-white shadow-sm'
                : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-[var(--surface-raised)] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-12 text-center text-[var(--ink-muted)] font-semibold text-xs">
          No notifications found in this view.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                item.read
                  ? 'bg-[var(--surface)] border-[var(--border)]'
                  : 'bg-white dark:bg-[#1E1B4B]/30 border-[#5B54E8]/40 shadow-xs'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-[var(--canvas)] border border-[var(--border)] shrink-0">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-black text-[var(--ink)] flex items-center gap-2">
                    <span>{item.title}</span>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#5B54E8] animate-pulse" />
                    )}
                  </h4>
                  <span className="text-[10px] font-semibold text-[var(--ink-muted)]">{item.date}</span>
                </div>
                <p className="text-xs text-[var(--ink-muted)] font-medium leading-relaxed">
                  {item.message}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
