import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, User, Home, Receipt, Flag, GraduationCap, Video, Menu, X, ChevronRight, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { NotificationBell } from '../components/shared/NotificationBell';
import { UserProfileDropdown } from '../components/shared/UserProfileDropdown';

export const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'View Courses', path: '/courses', icon: BookOpen },
    { label: 'My Dashboard', path: '/dashboard', icon: Home },
    { label: 'Payment Receipts', path: '/payments', icon: Receipt },
    { label: 'Report Issue', path: '/report-problem', icon: Flag },
    { label: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col transition-colors duration-200">
      
      {/* Top Navbar Header */}
      <nav className="bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-40 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#6366F1] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#6366F1]/30 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-black text-xl text-[#0F172A] dark:text-white tracking-tight hidden sm:inline">
                Class<span className="text-[#06B6D4]">Connect</span>
              </span>
            </Link>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <NotificationBell />
            <ThemeToggle />
            <UserProfileDropdown />
          </div>

        </div>
      </nav>

      {/* Sidebar + Main Outlet */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex items-start gap-8 p-4 sm:p-6">
        
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800 p-5 transform lg:transform-none lg:static lg:w-64 lg:rounded-3xl lg:border lg:shadow-md transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          
          <div className="flex items-center justify-between lg:hidden pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <span className="font-extrabold text-sm text-[#0F172A] dark:text-white">Student Navigation</span>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 py-1 mb-1">Learning Hub</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                    isActive
                      ? 'bg-[#6366F1] text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-xs text-[#06B6D4] font-extrabold space-y-1">
              <div className="flex items-center gap-1.5">
                <Video className="w-4 h-4" /> Live Q&A Support
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Connect with TAs 10 AM - 10 PM IST daily.</p>
            </div>
          </div>

        </aside>

        {/* Main Content View */}
        <main className="flex-1 w-full min-w-0">
          {/* Back Button */}
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-extrabold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#6366F1] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
          <Outlet />
        </main>

      </div>

    </div>
  );
};
