import React from 'react';
import { Outlet, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, GraduationCap, PlayCircle, ShieldCheck, CheckCircle2, Award, Users, Star, ArrowRight, Zap, BookOpen, Code, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../components/shared/ThemeToggle';

export const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // If already logged in, redirect away from login/signup to home page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col justify-between p-3 sm:p-5 transition-colors duration-300 relative overflow-hidden">
      
      {/* Ambient background glow accents */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#6366F1]/10 dark:bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#06B6D4]/10 dark:bg-[#06B6D4]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Compact Floating Header */}
      <header className="max-w-5xl mx-auto w-full flex justify-between items-center py-2 z-10">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0" title="Back to Homepage">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#4F46E5] flex items-center justify-center text-white shadow-md shadow-[#6366F1]/30 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-[#0F172A] dark:text-white">
              Class<span className="text-[#06B6D4]">Connect</span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-extrabold text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-full border border-[#10B981]/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> SSL Encrypted
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Compact Split-Screen Layout with Equal Fixed Height */}
      <main className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-3 z-10">
        
        {/* Left Side: About ClassConnect Showcase Card (Fixed Height 480px) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between h-[480px] bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#0F172A] p-7 rounded-3xl text-white shadow-xl relative overflow-hidden border border-white/10">
          
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#06B6D4]/20 rounded-full blur-3xl pointer-events-none" />

          {/* About Us Section */}
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-black border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" /> About ClassConnect
            </div>

            <h1 className="text-2xl font-black leading-tight tracking-tight">
              India's Premier Tech<br />
              <span className="text-[#06B6D4]">Visual Education Ecosystem</span>
            </h1>

            <p className="text-[11px] text-slate-200 leading-relaxed font-medium">
              ClassConnect bridges the gap between college curriculum and top-tier product engineering jobs through hands-on projects, PW-Skills structure, and 1-on-1 TA support.
            </p>
          </div>

          {/* About Us Highlights */}
          <div className="space-y-2 relative z-10">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center gap-2 text-[11px] font-bold">
              <Code className="w-4 h-4 text-[#06B6D4] shrink-0" />
              <span>Production-Grade Projects</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center gap-2 text-[11px] font-bold">
              <Shield className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Single-Device & Watermarked Streams</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center gap-2 text-[11px] font-bold">
              <Award className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span>Verified ATS Resume Certificates</span>
            </div>
          </div>

          {/* Bottom Student Count Pill */}
          <div className="pt-3 border-t border-white/15 relative z-10 flex items-center justify-between text-[11px] font-bold text-slate-200">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>50,000+ Enrolled Learners</span>
            </div>
            <div className="flex items-center gap-1 text-[#F59E0B]">
              <Star className="w-3 h-3 fill-[#F59E0B]" /> 4.9/5
            </div>
          </div>

        </div>

        {/* Right Side: Equal Fixed Height Auth Form Card (Fixed Height 480px) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-7 bg-white dark:bg-[#111827] p-5 sm:p-6 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors duration-300 relative max-w-lg mx-auto lg:max-w-none w-full h-[480px] flex flex-col justify-between overflow-y-auto"
        >
          <div>
            {/* Top Switcher Tabs: Sign In vs Create Account */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-4 border border-slate-200/60 dark:border-slate-800">
              <Link
                to="/login"
                className={`flex-1 py-2 text-center text-xs font-black rounded-xl transition-all ${
                  isLoginPage
                    ? 'bg-[#6366F1] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className={`flex-1 py-2 text-center text-xs font-black rounded-xl transition-all ${
                  !isLoginPage
                    ? 'bg-[#6366F1] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                Create Account
              </Link>
            </div>

            <Outlet />
          </div>
        </motion.div>

      </main>

      {/* Compact Footer */}
      <footer className="text-center py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 z-10">
        &copy; {new Date().getFullYear()} ClassConnect. All rights reserved.
      </footer>
    </div>
  );
};
