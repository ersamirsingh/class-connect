import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Menu, X, LogOut, User, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { ThemeToggle } from '../shared/ThemeToggle';
import { GooeyInput } from '../motion/GooeyInput';
import { UserProfileDropdown } from '../shared/UserProfileDropdown';

const publicLinks = [
  { key: 'nav.courses', path: '/courses' },
  { key: 'nav.categories', path: '/categories' },
  { key: 'nav.about', path: '/about' },
];

export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/courses?search=${encodeURIComponent(navSearch.trim())}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const dashboardPath = isAdmin ? '/admin/dashboard' : '/dashboard';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-2'
            : 'py-4'
        }`}
      >
        <nav
          className={`mx-auto max-w-[var(--max-width)] px-[var(--space-page)] transition-all duration-300 ${
            scrolled ? '' : ''
          }`}
        >
          <div
            className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 ${
              scrolled
                ? 'glass shadow-[var(--shadow-md)]'
                : 'bg-transparent'
            }`}
          >
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center
                shadow-[var(--shadow-primary)] group-hover:scale-105 transition-transform duration-200">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-[var(--ink)]"
                style={{ fontFamily: 'Manrope, sans-serif' }}>
                ClassConnect
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-1">
              {publicLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                      ${isActive
                        ? 'text-[var(--primary)] bg-[var(--primary-soft)]'
                        : 'text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-soft)]'
                      }`}
                  >
                    {t(link.key)}
                  </Link>
                );
              })}
            </div>

            {/* Top Navigation Bar Search (GooeyInput) */}
            <div className="hidden md:block w-48 lg:w-64 mx-2">
              <GooeyInput
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                onClear={() => setNavSearch('')}
                onSubmit={handleNavSearchSubmit}
                placeholder={language === 'hi' ? 'कोर्स खोजें...' : 'Search courses...'}
              />
            </div>

            {/* Desktop right actions */}
            <div className="hidden md:flex items-center gap-2">
              <LanguageSwitcher variant="compact" />
              <ThemeToggle />

              {isAuthenticated ? (
                <div className="flex items-center gap-2 ml-1">
                  <UserProfileDropdown position="down" />
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-1">
                  <Link
                    to="/login"
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--ink-muted)]
                      hover:text-[var(--ink)] hover:bg-[var(--primary-soft)] transition-all duration-200"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary text-sm px-5 py-2.5 rounded-xl"
                    style={{ minHeight: '40px' }}
                  >
                    {t('nav.signup')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-[var(--ink)] hover:bg-[var(--primary-soft)]
                transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-40 md:hidden px-[var(--space-page)]"
          >
            <div className="glass rounded-2xl shadow-[var(--shadow-lg)] p-4 flex flex-col gap-1">
              {publicLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors duration-200
                      ${isActive
                        ? 'text-[var(--primary)] bg-[var(--primary-soft)]'
                        : 'text-[var(--ink)] hover:bg-[var(--primary-soft)]'
                      }`}
                  >
                    {t(link.key)}
                  </Link>
                );
              })}

              <div className="h-px bg-[var(--border)] my-2" />

              <div className="flex items-center gap-2 px-4 py-2">
                <LanguageSwitcher variant="pill" />
                <ThemeToggle />
              </div>

              {isAuthenticated ? (
                <>
                  <Link
                    to={dashboardPath}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
                      text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {t('nav.dashboard')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
                      text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <div className="flex gap-2 mt-1">
                  <Link to="/login" className="btn-ghost flex-1 text-sm rounded-xl justify-center">{t('nav.login')}</Link>
                  <Link to="/signup" className="btn-primary flex-1 text-sm rounded-xl justify-center">{t('nav.signup')}</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-[72px]" />
    </>
  );
}
