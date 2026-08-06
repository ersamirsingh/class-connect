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
  Wallet
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { NotificationBell } from '../shared/NotificationBell';

const mainNavItems = [
  { key: 'nav.categories', label: 'Categories', path: '/categories', icon: Layers },
  { key: 'nav.courses', label: 'Courses', path: '/courses', icon: BookOpen },
  { key: 'nav.about', label: 'About', path: '/about', icon: Sparkles },
];

export function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [barMenuOpen, setBarMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const barMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (barMenuRef.current && !barMenuRef.current.contains(event.target)) {
        setBarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          className={`w-full rounded-full border transition-all duration-300 ${
            scrolled
              ? 'bg-[#0B0B0D]/90 backdrop-blur-xl border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.8)] py-2 px-5 sm:px-7'
              : 'bg-[#0B0B0D]/75 backdrop-blur-lg border-white/10 shadow-lg py-2.5 px-5 sm:px-7'
          }`}
        >
          <div className="flex items-center justify-between h-11">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full bg-[#FF2A2A] flex items-center justify-center shadow-[0_0_15px_rgba(255,42,42,0.5)] group-hover:scale-105 transition-transform duration-200">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-base font-medium tracking-tight text-[#F7F7F5] flex items-center gap-1.5">
                  ClassConnect
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A2A] animate-pulse" />
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              {mainNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const IconComp = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all duration-200 ${
                      isActive
                        ? 'text-[#FF2A2A] bg-[#FF2A2A]/10 border border-[#FF2A2A]/30'
                        : 'text-[#A8A8AE] hover:text-[#F7F7F5] hover:bg-white/5'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{t(item.key) !== item.key ? t(item.key) : item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Action Icons & Bar Menu */}
            <div className="flex items-center gap-3">
              {isAuthenticated && <NotificationBell />}
              <LanguageSwitcher variant="compact" />

              {/* Bar Menu Dropdown */}
              <div className="relative ml-1" ref={barMenuRef}>
                <button
                  onClick={() => setBarMenuOpen(!barMenuOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#141416] text-[#F7F7F5] hover:border-[#FF2A2A]/40 transition-all duration-200 cursor-pointer min-h-[36px]"
                  aria-label="Open Bar Menu"
                >
                  <Menu className="w-4 h-4 text-[#FF2A2A]" />
                  {isAuthenticated ? (
                    <div className="w-5.5 h-5.5 rounded-full bg-[#FF2A2A]/20 text-[#FF4D3D] flex items-center justify-center font-bold text-[10px]">
                      {(user?.name || user?.firstName || 'U').charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <User className="w-4 h-4 text-[#A8A8AE]" />
                  )}
                  <ChevronDown className={`w-3 h-3 text-[#A8A8AE] transition-transform duration-200 ${barMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {barMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#0B0B0D] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.9)] p-2.5 z-50 overflow-hidden"
                    >
                      {isAuthenticated && (
                        <div className="px-3.5 py-3 mb-2 border-b border-white/10 bg-[#141416] rounded-xl">
                          <p className="font-display text-xs font-semibold text-[#F7F7F5] truncate">{user?.name || user?.firstName || 'Student'}</p>
                          <p className="font-mono text-[10px] text-[#A8A8AE] truncate">{user?.email || ''}</p>
                        </div>
                      )}

                      <div className="space-y-1">
                        <Link
                          to={dashboardPath}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono text-[#F7F7F5] hover:text-[#FF2A2A] hover:bg-white/5 transition-all duration-200"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#FF2A2A]" />
                          <span>Dashboard</span>
                        </Link>

                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono text-[#F7F7F5] hover:text-[#FF2A2A] hover:bg-white/5 transition-all duration-200"
                        >
                          <User className="w-4 h-4 text-[#FF4D3D]" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/wallet"
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono text-[#F7F7F5] hover:text-[#FF2A2A] hover:bg-white/5 transition-all duration-200"
                        >
                          <Wallet className="w-4 h-4 text-emerald-400" />
                          <span>My Wallet & Referrals</span>
                        </Link>

                        <div className="h-px bg-white/10 my-1.5" />

                        {isAuthenticated ? (
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono text-[#FF2A2A] hover:bg-[#9F1018]/20 transition-all duration-200 text-left cursor-pointer"
                          >
                            <LogOut className="w-4 h-4 text-[#FF2A2A]" />
                            <span>Log Out</span>
                          </button>
                        ) : (
                          <>
                            <Link
                              to="/signup"
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium text-white bg-[#FF2A2A] hover:bg-[#FF4D3D] transition-all duration-200 shadow-[0_0_15px_rgba(255,42,42,0.4)]"
                            >
                              <UserPlus className="w-4 h-4" />
                              <span>Create Account</span>
                            </Link>

                            <Link
                              to="/login"
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono text-[#A8A8AE] hover:text-[#F7F7F5] hover:bg-white/5 transition-all duration-200"
                            >
                              <LogIn className="w-4 h-4 text-[#A8A8AE]" />
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
                className="md:hidden p-1.5 rounded-full text-[#F7F7F5] hover:bg-white/10 transition-colors"
                aria-label="Toggle Mobile Menu"
              >
                {mobileOpen ? <X className="w-5 h-5 text-[#FF2A2A]" /> : <Menu className="w-5 h-5" />}
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
            className="fixed inset-x-0 top-[80px] z-40 md:hidden px-4"
          >
            <div className="bg-[#0B0B0D]/95 backdrop-blur-xl rounded-2xl p-5 flex flex-col gap-2 border border-white/10 shadow-2xl">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-3 rounded-xl text-sm font-mono tracking-wide transition-colors ${
                    location.pathname === item.path
                      ? 'text-[#FF2A2A] bg-[#FF2A2A]/10 border border-[#FF2A2A]/30'
                      : 'text-[#F7F7F5] hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="h-px bg-white/10 my-2" />

              <Link
                to={dashboardPath}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-mono text-[#FF2A2A] hover:bg-white/5"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-mono text-[#F7F7F5] hover:bg-white/5"
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </Link>

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-mono text-[#FF2A2A] hover:bg-[#9F1018]/20 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              ) : (
                <div className="flex gap-3 mt-3 pt-3 border-t border-white/10">
                  <Link to="/login" className="flex-1 text-center py-3 rounded-xl text-xs font-mono border border-white/10 text-[#F7F7F5]">
                    Log In
                  </Link>
                  <Link to="/signup" className="flex-1 text-center py-3 rounded-xl text-xs font-mono bg-[#FF2A2A] text-white">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16" />
    </>
  );
}
