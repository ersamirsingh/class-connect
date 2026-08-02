import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  BookOpen,
  User,
  LogOut,
  Receipt,
  Flag,
  ChevronDown,
  Layout,
  ShieldAlert,
  Layers,
  Users,
  DollarSign,
  UserCheck,
  Home,
  ChevronUp,
} from 'lucide-react';

export const UserProfileDropdown = ({ position = 'auto' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [adminControlOpen, setAdminControlOpen] = useState(true);
  const dropdownRef = useRef(null);

  const isAdmin = user?.role === 'admin';

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login');
  };

  const adminLinks = [
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: Home, color: '#06B6D4' },
    { label: 'Homepage CMS', path: '/admin/cms', icon: Layout, color: '#8B5CF6' },
    { label: 'Categories', path: '/admin/categories', icon: Layers, color: '#0EA5E9' },
    { label: 'Manage Courses', path: '/admin/courses', icon: BookOpen, color: '#6366F1' },
    { label: 'Student Directory', path: '/admin/users', icon: UserCheck, color: '#10B981' },
    { label: 'Manage Admins', path: '/admin/admins', icon: Users, color: '#06B6D4' },
    { label: 'Sales & Payments', path: '/admin/payments', icon: DollarSign, color: '#F59E0B' },
    { label: 'Problem Reports', path: '/admin/reports', icon: Flag, color: '#EF4444' },
  ];

  // Dynamic positioning logic: 'up' for bottom sidebars, 'down' for top headers
  const isUp = position === 'up';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* User Avatar & Name Click Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800 p-1.5 pr-3 rounded-full border border-slate-200 dark:border-slate-700 hover:border-[#6366F1] transition-all cursor-pointer select-none"
        aria-label="User Profile Menu"
      >
        <img
          src={
            user?.photo ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366F1&color=fff`
          }
          alt={user?.name || 'User Profile'}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366F1&color=fff`;
          }}
          className="w-8 h-8 rounded-full object-cover border-2 border-[#6366F1] shrink-0"
        />
        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 truncate max-w-[110px] hidden sm:inline">
          {user?.name || 'Account'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Options Popup */}
      {isOpen && (
        <div
          className={`absolute w-64 bg-white dark:bg-[#111827] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2.5 z-[100] animate-in fade-in slide-in-from-top-2 ${
            isUp ? 'bottom-full mb-3 left-0' : 'top-full mt-2 right-0'
          }`}
        >
          {/* User Info Header */}
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
            <div className="truncate">
              <div className="text-xs font-black text-[#0F172A] dark:text-white truncate">{user?.name}</div>
              <div className="text-[10px] font-semibold text-slate-400 truncate">{user?.email}</div>
            </div>
            {isAdmin && (
              <span className="px-2 py-0.5 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-[9px] font-black uppercase shrink-0">
                Admin
              </span>
            )}
          </div>

          <div className="space-y-1 max-h-[320px] overflow-y-auto">
            {isAdmin ? (
              <>
                {/* Wrapped Admin Control Section */}
                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
                  <button
                    type="button"
                    onClick={() => setAdminControlOpen(!adminControlOpen)}
                    className="w-full px-3 py-2 text-xs font-extrabold text-[#6366F1] flex items-center justify-between hover:bg-[#6366F1]/10 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-[#6366F1]" />
                      <span>Admin Control</span>
                    </div>
                    {adminControlOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {adminControlOpen && (
                    <div className="p-1 space-y-0.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111827]">
                      {adminLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Icon className="w-3.5 h-3.5" style={{ color: link.color }} />
                            <span>{link.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Admin Option: My Profile */}
                <Link
                  to="/admin/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <User className="w-4 h-4 text-[#10B981]" />
                  <span>My Profile</span>
                </Link>
              </>
            ) : (
              /* Student Options */
              <>
                <Link
                  to="/courses"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-extrabold text-[#6366F1] bg-[#6366F1]/10 hover:bg-[#6366F1]/20 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-[#6366F1]" />
                  <span>View Courses</span>
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Layout className="w-4 h-4 text-[#06B6D4]" />
                  <span>My Dashboard</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <User className="w-4 h-4 text-[#10B981]" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/payments"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Receipt className="w-4 h-4 text-[#F5A623]" />
                  <span>Payment Receipts</span>
                </Link>

                <Link
                  to="/report-problem"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Flag className="w-4 h-4 text-[#EF4444]" />
                  <span>Report Issue</span>
                </Link>
              </>
            )}
          </div>

          {/* Logout Option */}
          <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-extrabold text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
