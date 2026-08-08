import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, FolderOpen, Users, ShieldCheck,
  CreditCard, AlertTriangle, FileText, LogOut, ChevronLeft,
  ChevronRight, User, Menu
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { ThemeToggle } from '../components/shared/ThemeToggle';

const adminNavItems = [
  { key: 'admin.dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { key: 'admin.manageCategories', path: '/admin/categories', icon: FolderOpen },
  { key: 'admin.manageCourses', path: '/admin/courses', icon: BookOpen },
  { key: 'admin.manageUsers', path: '/admin/users', icon: Users },
  { key: 'admin.manageAdmins', path: '/admin/admins', icon: ShieldCheck },
  { key: 'admin.payments', path: '/admin/payments', icon: CreditCard },
  { key: 'admin.reports', path: '/admin/reports', icon: AlertTriangle },
  { key: 'admin.cms', path: '/admin/cms', icon: FileText },
  { key: 'nav.profile', path: '/admin/profile', icon: User },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-[var(--border)]">
        <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        {(!collapsed || mobile) && (
          <span className="text-sm font-extrabold tracking-tight text-[var(--ink)]"
            style={{ fontFamily: 'Manrope, sans-serif' }}>
            Admin Panel
          </span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
        {adminNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => mobile && setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${isActive
                  ? 'text-[var(--primary)] bg-[var(--primary-soft)]'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-soft)]'
                }`}
              title={collapsed && !mobile ? t(item.key) : undefined}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {(!collapsed || mobile) && <span>{t(item.key)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-[var(--border)] space-y-1">
        <ThemeToggle className="w-full justify-start" />
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold
            text-[var(--ink-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)]
            transition-all duration-200`}
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {(!collapsed || mobile) && <span>{t('nav.logout')}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--canvas)] flex">
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-[var(--border)]
          bg-[var(--surface)] transition-all duration-300 sticky top-0 h-screen
          ${collapsed ? 'w-16' : 'w-60'}`}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[var(--surface)]
            border border-[var(--border)] flex items-center justify-center
            text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--primary-soft)]
            transition-all duration-200 shadow-[var(--shadow-xs)]"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--surface)]
                border-r border-[var(--border)] z-50 md:hidden shadow-[var(--shadow-xl)]"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 glass border-b border-[var(--border)]">
          <div className="flex items-center justify-between h-14 px-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl text-[var(--ink)] hover:bg-[var(--primary-soft)] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-[var(--ink)]">Admin</span>
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
