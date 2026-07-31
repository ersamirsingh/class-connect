import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldAlert, BookOpen, Users, DollarSign, Flag, Layout, Layers, Home, UserCheck, Menu, X, ExternalLink, ChevronRight, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { NotificationBell } from '../components/shared/NotificationBell';
import { UserProfileDropdown } from '../components/shared/UserProfileDropdown';

const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: Home, color: '#06B6D4' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Homepage CMS', path: '/admin/cms', icon: Layout, color: '#8B5CF6' },
      { label: 'Categories', path: '/admin/categories', icon: Layers, color: '#0EA5E9' },
      { label: 'Manage Courses', path: '/admin/courses', icon: BookOpen, color: '#6366F1' },
    ],
  },
  {
    label: 'Users',
    items: [
      { label: 'Student Directory', path: '/admin/users', icon: UserCheck, color: '#10B981' },
      { label: 'Manage Admins', path: '/admin/admins', icon: Users, color: '#06B6D4' },
    ],
  },
  {
    label: 'Finance & Support',
    items: [
      { label: 'Sales & Payments', path: '/admin/payments', icon: DollarSign, color: '#F59E0B' },
      { label: 'Problem Reports', path: '/admin/reports', icon: Flag, color: '#EF4444' },
    ],
  },
];

export const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col md:flex-row transition-colors duration-200">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#111827] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-black text-base">Admin Portal</span>
        </div>
        <div className="flex items-center gap-1">
          <NotificationBell />
          <ThemeToggle />
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111827] text-white flex flex-col justify-between border-r border-slate-800 transform transition-transform duration-200 md:static md:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-5 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6366F1] flex items-center justify-center font-bold text-white shadow-lg shadow-[#6366F1]/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-black text-lg leading-tight">Admin Portal</h2>
                <span className="text-[10px] font-extrabold tracking-wider text-[#06B6D4] uppercase">ClassConnect</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <NotificationBell />
              <ThemeToggle />
            </div>
          </div>

          {/* Navigation Sections */}
          <nav className="p-4 space-y-5">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label}>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-3 mb-2">{section.label}</div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                          isActive
                            ? 'bg-[#6366F1] text-white shadow-md shadow-[#6366F1]/20'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" style={{ color: isActive ? 'white' : item.color }} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* See Live Website */}
            <div className="pt-3 border-t border-slate-800">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold text-[#06B6D4] hover:bg-[#06B6D4]/10 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>See Live Website</span>
              </a>
            </div>
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800 relative z-50">
          <UserProfileDropdown position="up" />
        </div>
      </aside>

      {/* Main Page Area */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-extrabold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#6366F1] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
};
