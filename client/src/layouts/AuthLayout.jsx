import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles, GraduationCap, PlayCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../components/shared/ThemeToggle';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col justify-between p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      {/* Sleek Floating Top Header */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-[#4F46E5] flex items-center justify-center text-white shadow-lg shadow-[#4F46E5]/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] dark:text-white">
              Class<span className="text-[#3B82F6]">Connect</span>
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#4F46E5]">
              Visual Learning Platform
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#10B981] bg-[#10B981]/10 px-3.5 py-1.5 rounded-full border border-[#10B981]/20">
            <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Secured
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Split-Screen Main Container */}
      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-6">
        {/* Left Visual Hero Card (Desktop Split-Screen) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between min-h-[520px] bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#3B82F6] p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
              <Sparkles className="w-7 h-7 text-[#F59E0B]" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight">
              Master New Skills.<br />
              <span className="text-white/80 font-bold">10x Faster Visually.</span>
            </h1>

            <p className="text-xs text-white/80 leading-relaxed font-medium">
              Join thousands of students and creators consuming interactive, icon-first courses.
            </p>
          </div>

          <div className="space-y-3 pt-6 relative z-10 border-t border-white/15">
            <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
              <PlayCircle className="w-5 h-5 text-[#F59E0B] shrink-0" />
              <span className="text-xs font-semibold">Interactive Video & Live Classrooms</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-2xl backdrop-blur-sm border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
              <span className="text-xs font-semibold">Verified Completion Certificates</span>
            </div>
          </div>
        </div>

        {/* Right Dynamic Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-7 bg-white dark:bg-[#1E293B] p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 transition-colors duration-300"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
        &copy; {new Date().getFullYear()} ClassConnect Platform Inc. All rights reserved.
      </footer>
    </div>
  );
};
