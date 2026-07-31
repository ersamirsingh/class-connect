import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, LogIn, UserPlus, Compass, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from '../shared/ThemeToggle';

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 px-4 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#3730E0] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#3730E0]/30 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl text-[#1E1E2E] tracking-tight">
              Class<span className="text-[#FF7A33]">Connect</span>
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/courses"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#3730E0]/10 hover:text-[#3730E0] transition-colors"
          >
            <Compass className="w-4 h-4 text-[#FF7A33]" />
            <span>Explore</span>
          </Link>
          <Link
            to="/about"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#3730E0]/10 hover:text-[#3730E0] transition-colors"
          >
            <Info className="w-4 h-4 text-[#1FAE64]" />
            <span className="hidden sm:inline">About</span>
          </Link>

          {/* Theme Switcher Button */}
          <ThemeToggle />

          {/* Action CTAs */}
          {isAuthenticated ? (
            <Link
              to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
              className="btn-visual btn-primary text-xs font-extrabold px-4 py-2"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#3730E0] hover:bg-[#3730E0]/10 transition-colors"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
              <Link
                to="/signup"
                className="btn-visual btn-secondary text-xs font-extrabold px-4 py-2 shadow-md hidden sm:inline-flex"
              >
                <UserPlus className="w-4 h-4" /> Join Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
