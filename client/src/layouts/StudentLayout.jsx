import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, User, LogOut, Home, Receipt, Flag } from 'lucide-react';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import { NotificationBell } from '../components/shared/NotificationBell';

export const StudentLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#3730E0] flex items-center justify-center text-white font-black text-xl shadow-md">
              C
            </div>
            <span className="font-extrabold text-xl text-[#1E1E2E] hidden sm:inline">
              Class<span className="text-[#FF7A33]">Connect</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/dashboard" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#3730E0]/10 hover:text-[#3730E0] transition-colors">
              <Home className="w-4 h-4 text-[#3730E0]" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link to="/courses" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#3730E0]/10 hover:text-[#3730E0] transition-colors">
              <BookOpen className="w-4 h-4 text-[#FF7A33]" />
              <span>Explore</span>
            </Link>
            <Link to="/payments" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#3730E0]/10 hover:text-[#3730E0] transition-colors">
              <Receipt className="w-4 h-4 text-[#F5A623]" />
              <span className="hidden sm:inline">Payments</span>
            </Link>
            <Link to="/report-problem" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#EF4444]/10 hover:text-[#EF4444] transition-colors">
              <Flag className="w-4 h-4 text-[#EF4444]" />
              <span className="hidden sm:inline">Report Issue</span>
            </Link>
            <Link to="/profile" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#3730E0]/10 hover:text-[#3730E0] transition-colors">
              <User className="w-4 h-4 text-[#1FAE64]" />
              <span className="hidden sm:inline">Profile</span>
            </Link>

            <NotificationBell />
            <ThemeToggle />
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 pr-3 rounded-full border border-slate-200">
              <img
                src={user?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover border border-white"
              />
              <span className="text-xs font-bold text-slate-800 truncate max-w-[100px] hidden md:inline">
                {user?.name}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};
