import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, FolderOpen, Users, ShieldCheck,
  CreditCard, AlertTriangle, FileText, LogOut, ChevronLeft,
  ChevronRight, User, Menu, Globe, Search, ExternalLink, Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { LanguageSwitcher } from '../components/shared/LanguageSwitcher';
import { UniversalSearchModal } from '../components/shared/UniversalSearchModal';

const adminNavItems = [
  { key: 'admin.dashboard', path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'admin.manageCategories', path: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { key: 'admin.manageCourses', path: '/admin/courses', label: 'Courses', icon: BookOpen },
  { key: 'admin.manageUsers', path: '/admin/users', label: 'Students & Users', icon: Users },
  { key: 'admin.manageAdmins', path: '/admin/admins', label: 'Admin Roles', icon: ShieldCheck },
  { key: 'admin.payments', path: '/admin/payments', label: 'Transactions', icon: CreditCard },
  { key: 'admin.reports', path: '/admin/reports', label: 'Tickets & Reports', icon: AlertTriangle },
  { key: 'admin.cms', path: '/admin/cms', label: 'CMS Content', icon: FileText },
  { key: 'nav.profile', path: '/admin/profile', label: 'Admin Profile', icon: User },
];

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full bg-[var(--surface)]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-[var(--border)] shrink-0">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-extrabold shadow-sm shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          {(!collapsed || mobile) && (
            <div className="flex flex-col">
              <span className="text-sm font-black text-[var(--ink)] leading-none font-manrope">
                ClassConnect
              </span>
              <span className="text-[10px] font-extrabold text-[var(--primary)] uppercase tracking-wider mt-0.5">
                Admin Control
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-1">
        {adminNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => mobile && setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200
                ${isActive
                  ? 'text-[var(--primary)] bg-[var(--primary-soft)] border border-[var(--primary)]/20 shadow-xs'
                  : 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--canvas)]'
                }`}
              title={collapsed && !mobile ? (t(item.key) !== item.key ? t(item.key) : item.label) : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {(!collapsed || mobile) && <span>{t(item.key) !== item.key ? t(item.key) : item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-[var(--border)] space-y-1 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs font-bold text-[var(--ink-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-all"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {(!collapsed || mobile) && <span>Main Platform ↗</span>}
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {(!collapsed || mobile) && <span>{t('nav.logout') || 'Logout'}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--canvas)] flex flex-col font-sans">
      
      {/* UNIVERSAL TOP ADMIN NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border)] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Menu Toggle & Brand Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-xl text-[var(--ink)] hover:bg-[var(--canvas)] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--primary)] to-purple-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="hidden sm:flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-[var(--ink)] font-manrope leading-none">ClassConnect</span>
                  <span className="px-2 py-0.5 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-[9px] font-extrabold uppercase tracking-wider">
                    ADMIN
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[var(--ink-muted)]">Management Control Panel</span>
              </div>
            </Link>
          </div>

          {/* Center: Search Trigger Input Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full px-4 py-2 rounded-full bg-[var(--canvas)] border border-[var(--border)] text-xs text-[var(--ink-muted)] flex items-center justify-between hover:border-[var(--primary)] transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[var(--ink-faint)]" />
                <span>Search courses, users, categories...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] text-[9px] font-bold text-[var(--ink-faint)] border border-[var(--border)]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Quick Links & Controls */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/courses"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[var(--ink-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-all"
            >
              <span>Courses</span>
            </Link>
            
            <Link
              to="/categories"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[var(--ink-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-all"
            >
              <span>Categories</span>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-extrabold hover:bg-[var(--primary)] hover:text-white transition-all shadow-xs"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="h-5 w-px bg-[var(--border)] mx-1 hidden sm:block" />

            <LanguageSwitcher />
            <ThemeToggle />

            {/* Admin Avatar Badge */}
            <div className="flex items-center gap-2 pl-1">
              <Link to="/admin/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white font-extrabold text-xs flex items-center justify-center shadow-xs border border-white/20 group-hover:scale-105 transition-transform">
                  {user?.name ? user.name[0].toUpperCase() : 'A'}
                </div>
              </Link>
            </div>
          </div>

        </div>
      </header>

      {/* BODY WITH SIDEBAR & MAIN DASHBOARD OUTLET */}
      <div className="flex-1 flex min-w-0">
        
        {/* Desktop sidebar */}
        <aside
          className={`hidden md:flex flex-col shrink-0 border-r border-[var(--border)]
            bg-[var(--surface)] transition-all duration-300 sticky top-16 h-[calc(100vh-4rem)]
            ${collapsed ? 'w-16' : 'w-60'}`}
        >
          <SidebarContent />
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[var(--surface)]
              border border-[var(--border)] flex items-center justify-center
              text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--primary-soft)]
              transition-all duration-200 shadow-xs z-10 cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
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
                className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--surface)]
                  border-r border-[var(--border)] z-50 md:hidden shadow-2xl"
              >
                <SidebarContent mobile />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
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

      {/* Universal Search Modal Trigger */}
      <UniversalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
