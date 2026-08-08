import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Menu, 
  X, 
  LogOut, 
  User, 
  LayoutDashboard, 
  UserPlus, 
  LogIn, 
  Layers, 
  Sparkles,
  ChevronDown,
  Wallet,
  Search
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { ThemeToggle } from '../shared/ThemeToggle';
import { NotificationBell } from '../shared/NotificationBell';
import { UniversalSearchModal } from '../shared/UniversalSearchModal';

const mainNavItems = [
  { key: 'nav.categories', label: 'Categories', path: '/categories', icon: Layers },
  { key: 'nav.courses', label: 'Courses', path: '/courses', icon: BookOpen },
  { key: 'nav.about', label: 'About', path: '/about', icon: Sparkles },
];

export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [barMenuOpen, setBarMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const barMenuRef = useRef(null);

  // Global Ctrl+K / Cmd+K search shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (barMenuRef.current && !barMenuRef.current.contains(event.target)) {
        setBarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setBarMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const dashboardPath = isAdmin ? '/admin/dashboard' : '/dashboard';

  return (
    <>
      {/* FLOATING NAVBAR CONTAINER */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl transition-all duration-300">
        <nav
          className={`w-full rounded-2xl border transition-all duration-300 ${
            scrolled
              ? 'bg-[var(--surface)]/90 backdrop-blur-md border-[var(--border)] shadow-[var(--shadow-md)] py-2 px-4 sm:px-6'
              : 'bg-[var(--surface)]/80 backdrop-blur-md border-[var(--border)] shadow-sm py-2.5 px-4 sm:px-6'
          }`}
        >
          <div className="flex items-center justify-between h-12">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8.5 h-8.5 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                <BookOpen className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-[var(--ink)] hidden sm:block" style={{ fontFamily: 'Manrope, sans-serif' }}>
                ClassConnect
              </span>
            </Link>

            {/* Navigation Links (Courses, Categories, About) */}
            <div className="hidden md:flex items-center gap-1">
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const IconComp = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'text-[var(--primary)] bg-[var(--primary-soft)]'
                        : 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-soft)]'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{t(item.key) !== item.key ? t(item.key) : item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Action Icons & Bar Menu Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs"
                aria-label="Universal Search"
                title="Search courses & categories (Ctrl+K)"
              >
                <Search className="w-4 h-4 text-[var(--primary)]" />
              </button>
              {isAuthenticated && <NotificationBell />}
              <LanguageSwitcher variant="compact" />
              <ThemeToggle />

              {/* BAR MENU BUTTON WRAPPING Profile, Dashboard, Signup/Login */}
              <div className="relative ml-1" ref={barMenuRef}>
                <button
                  onClick={() => setBarMenuOpen(!barMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--primary-soft)] hover:border-[var(--primary)]/30 transition-all duration-200 shadow-xs cursor-pointer min-h-[36px]"
                  aria-label="Open Bar Menu"
                >
                  <Menu className="w-4 h-4 text-[var(--primary)]" />
                  {isAuthenticated ? (
                    <div className="w-5.5 h-5.5 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center font-bold text-[10px]">
                      {(user?.name || user?.firstName || 'U').charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <User className="w-4 h-4 text-[var(--ink-muted)]" />
                  )}
                  <ChevronDown className={`w-3 h-3 text-[var(--ink-muted)] transition-transform duration-200 ${barMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {barMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-60 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl p-2 z-50 overflow-hidden"
                    >
                      {/* User Header Info */}
                      {isAuthenticated && (
                        <div className="px-3 py-2.5 mb-1.5 border-b border-[var(--border)] bg-[var(--canvas)] rounded-xl">
                          <p className="text-xs font-black text-[var(--ink)] truncate">{user?.name || user?.firstName || 'Student'}</p>
                          <p className="text-[10px] font-semibold text-[var(--ink-muted)] truncate">{user?.email || ''}</p>
                        </div>
                      )}

                      <div className="space-y-0.5">
                        {/* 1. Dashboard Menu Option */}
                        <Link
                          to={dashboardPath}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[var(--ink)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-all duration-200"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[var(--primary)]" />
                          <span>Dashboard</span>
                        </Link>

                        {/* 2. Profile Menu Option */}
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[var(--ink)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-all duration-200"
                        >
                          <User className="w-4 h-4 text-indigo-500" />
                          <span>My Profile</span>
                        </Link>

                        {/* 3. Wallet & Referrals Menu Option */}
                        <Link
                          to="/wallet"
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[var(--ink)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-all duration-200"
                        >
                          <Wallet className="w-4 h-4 text-emerald-500" />
                          <span>My Wallet & Referrals</span>
                        </Link>

                        <div className="h-px bg-[var(--border)] my-1" />

                        {/* 3. Signup / Login / Logout Options */}
                        {isAuthenticated ? (
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 text-left cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-red-500" />
                            <span>Log Out</span>
                          </button>
                        ) : (
                          <>
                            <Link
                              to="/signup"
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[var(--primary)] bg-[var(--primary-soft)] hover:bg-[var(--primary)] hover:text-white transition-all duration-200"
                            >
                              <UserPlus className="w-4 h-4" />
                              <span>Sign Up (Create Account)</span>
                            </Link>

                            <Link
                              to="/login"
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[var(--ink)] hover:text-[var(--primary)] hover:bg-[var(--canvas)] transition-all duration-200"
                            >
                              <LogIn className="w-4 h-4 text-[var(--ink-muted)]" />
                              <span>Log In</span>
                            </Link>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-1.5 rounded-xl text-[var(--ink)] hover:bg-[var(--primary-soft)] transition-colors"
                aria-label="Toggle Mobile Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </nav>
      </header>

      {/* Mobile Slide-Down Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[76px] z-40 md:hidden px-4"
          >
            <div className="bg-[var(--surface)]/95 backdrop-blur-md rounded-2xl shadow-xl p-4 flex flex-col gap-1 border border-[var(--border)]">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    location.pathname === item.path
                      ? 'text-[var(--primary)] bg-[var(--primary-soft)]'
                      : 'text-[var(--ink)] hover:bg-[var(--primary-soft)]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="h-px bg-[var(--border)] my-2" />

              <Link
                to={dashboardPath}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-[var(--primary)] hover:bg-[var(--primary-soft)]"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-[var(--ink)] hover:bg-[var(--primary-soft)]"
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </Link>

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              ) : (
                <div className="flex gap-2 mt-2 pt-2 border-t border-[var(--border)]">
                  <Link to="/login" className="flex-1 text-center py-2.5 rounded-xl text-xs font-bold border border-[var(--border)] text-[var(--ink)]">
                    Log In
                  </Link>
                  <Link to="/signup" className="flex-1 text-center py-2.5 rounded-xl text-xs font-bold bg-[var(--primary)] text-white">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Floating Navbar Spacer to prevent overlapping page content */}
      <div className="h-20" />

      {/* Universal Search Modal */}
      <UniversalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
