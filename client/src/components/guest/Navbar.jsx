import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, LogIn, UserPlus, Search, ChevronDown, Compass, BookOpen, Cpu, Shield, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from '../shared/ThemeToggle';
import { NotificationBell } from '../shared/NotificationBell';
import { UserProfileDropdown } from '../shared/UserProfileDropdown';
import { courseApi } from '../../api/models/course.api';

export const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [exploreCourses, setExploreCourses] = useState([]);

  const isHomePage = location.pathname === '/';

  const categories = [
    { title: 'Full Stack Development', icon: Compass, link: '/courses?cat=web-dev' },
    { title: 'Data Science & Analytics', icon: BookOpen, link: '/courses?cat=data-science' },
    { title: 'AI & Machine Learning', icon: Cpu, link: '/courses?cat=ai-ml' },
    { title: 'Cyber Security', icon: Shield, link: '/courses?cat=cyber' },
  ];

  useEffect(() => {
    const fetchTopCourses = async () => {
      try {
        const res = await courseApi.getCourses({ limit: 5 });
        if (res.success && res.data) {
          setExploreCourses(res.data);
        }
      } catch (err) {
        console.error('Failed to load explore courses:', err);
      }
    };
    fetchTopCourses();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="bg-white/85 dark:bg-[#111827]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-50 px-4 py-2.5 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          {/* Back Button — hidden on home page */}
          {!isHomePage && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#6366F1] transition-colors cursor-pointer"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* 1. Logo Routing to Home Page / */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0" title="Go to Homepage">
            <div className="w-10 h-10 rounded-xl bg-[#5B54E8] flex items-center justify-center text-white font-black text-xl shadow-md shadow-[#5B54E8]/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-xl text-[#2B2B38] dark:text-white tracking-tight">
                Class<span className="text-[#06B6D4]">Connect</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md items-center relative">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for courses, skills, masterclasses..."
              className="w-full pl-10 pr-24 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1] transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1 bg-[#6366F1] text-white rounded-full text-[10px] font-bold hover:bg-[#4F46E5] transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Right: Notification Bell (Requirement 3), Theme Toggle, Auth Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationBell />
          <ThemeToggle />

          {isAuthenticated ? (
            <UserProfileDropdown />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-extrabold text-[#6366F1] hover:bg-[#6366F1]/10 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/signup"
                className="btn-visual btn-secondary text-xs font-extrabold px-4 py-2 shadow-md hidden sm:inline-flex"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};
