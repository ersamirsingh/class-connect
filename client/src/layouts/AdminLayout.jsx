import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShieldAlert, BookOpen, Users, DollarSign, Flag, Layout, Layers, LogOut, Home } from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col md:flex-row">
      {/* Admin Sidebar Nav */}
      <aside className="w-full md:w-64 bg-[#1E1E2E] text-white p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-700/50 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#FF7A33] flex items-center justify-center font-bold text-white shadow-lg">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg leading-tight">Admin Portal</h2>
              <span className="text-[10px] font-bold tracking-wider text-[#FF7A33] uppercase">ClassConnect Control</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4 text-[#FF7A33]" /> Dashboard
            </Link>
            <Link
              to="/admin/cms"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Layout className="w-4 h-4 text-[#9333EA]" /> Homepage CMS
            </Link>
            <Link
              to="/admin/categories"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Layers className="w-4 h-4 text-[#0EA5E9]" /> Categories
            </Link>
            <Link
              to="/admin/courses"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#3730E0]" /> Manage Courses
            </Link>
            <Link
              to="/admin/admins"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Users className="w-4 h-4 text-[#1FAE64]" /> Manage Admins
            </Link>
            <Link
              to="/admin/payments"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <DollarSign className="w-4 h-4 text-[#F5A623]" /> Sales & Payments
            </Link>
            <Link
              to="/admin/reports"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Flag className="w-4 h-4 text-[#EF4444]" /> Problem Reports
            </Link>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-6 border-t border-slate-700/50 mt-6 flex items-center justify-between">
          <Link to="/admin/profile" className="flex items-center gap-2.5 group">
            <img
              src={user?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FF7A33] group-hover:scale-105 transition-transform"
            />
            <div className="truncate max-w-[110px]">
              <div className="text-xs font-bold text-white truncate group-hover:text-[#FF7A33] transition-colors">{user?.name}</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Admin</div>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-[#EF4444] transition-colors"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Page Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
