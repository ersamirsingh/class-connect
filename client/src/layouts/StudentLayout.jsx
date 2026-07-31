import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, User, CreditCard, AlertTriangle, LogOut, Bell
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from '../components/shared/LanguageSwitcher';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { NotificationBell } from '../components/shared/NotificationBell';

const studentNavItems = [
  { key: 'nav.dashboard', path: '/dashboard', icon: LayoutDashboard },
  { key: 'nav.courses', path: '/courses', icon: BookOpen },
  { key: 'nav.profile', path: '/profile', icon: User },
  { key: 'nav.payments', path: '/payments', icon: CreditCard },
  { key: 'nav.help', path: '/report-problem', icon: AlertTriangle },
];

export function StudentLayout() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 glass border-b border-[var(--border)]">
        <div className="page-container flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center
              shadow-sm group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-[var(--ink)] hidden sm:block"
              style={{ fontFamily: 'Manrope, sans-serif' }}>
              ClassConnect
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {studentNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                    ${isActive
                      ? 'text-[var(--primary)] bg-[var(--primary-soft)]'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-soft)]'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{t(item.key)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <NotificationBell />
            <LanguageSwitcher variant="compact" />
            <ThemeToggle />
            <div className="hidden md:flex items-center gap-2 ml-2 pl-2 border-l border-[var(--border)]">
              <span className="text-sm font-medium text-[var(--ink-muted)]">
                {user?.name?.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-[var(--ink-muted)] hover:text-[var(--danger)]
                  hover:bg-[var(--danger-soft)] transition-all duration-200"
                aria-label={t('nav.logout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="page-container py-6 md:py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile bottom dock */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-[var(--border)]
        safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {studentNavItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center justify-center gap-0.5 w-14 h-14 rounded-2xl transition-all duration-200
                  ${isActive
                    ? 'text-[var(--primary)]'
                    : 'text-[var(--ink-faint)]'
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
                  {t(item.key).split(' ')[0]}
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
