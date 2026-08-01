import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, User, CreditCard, AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { FloatingNav } from '../components/layout/FloatingNav';

const studentNavItems = [
  { key: 'nav.dashboard', path: '/dashboard', icon: LayoutDashboard },
  { key: 'nav.courses', path: '/courses', icon: BookOpen },
  { key: 'nav.profile', path: '/profile', icon: User },
  { key: 'nav.payments', path: '/payments', icon: CreditCard },
  { key: 'nav.help', path: '/report', icon: AlertTriangle },
];

export function StudentLayout() {
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[var(--canvas)] font-sans">
      {/* Universal Top Nav Header (Used across all pages & dashboard) */}
      <FloatingNav />

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile Bottom Dock */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-[var(--border)] safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {studentNavItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-2xl transition-all duration-200 ${
                  isActive ? 'text-[var(--primary)]' : 'text-[var(--ink-faint)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="student-dock-pill"
                    className="absolute inset-0 bg-[var(--primary-soft)] rounded-2xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="text-[10px] font-semibold relative z-10">
                  {t(item.key) !== item.key ? t(item.key).split(' ')[0] : item.key.split('.')[1]}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom dock spacer on mobile */}
      <div className="md:hidden h-20" />
    </div>
  );
}
