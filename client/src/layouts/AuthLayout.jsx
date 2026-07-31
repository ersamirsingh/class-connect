import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles, GraduationCap, PlayCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between p-4 md:p-8">
      {/* Brand Top Header */}
      <header className="max-w-6xl mx-auto w-full flex justify-between items-center py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-[#3730E0] flex items-center justify-center text-white shadow-lg shadow-[#3730E0]/30 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#1E1E2E] tracking-tight">Class<span className="text-[#FF7A33]">Connect</span></span>
            <span className="block text-xs font-semibold text-[#3730E0]">Visual Learning Hub</span>
          </div>
        </Link>
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#1FAE64] bg-[#1FAE64]/10 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" /> Secure Platform
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-6">
        {/* Left Visual Banner (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-6 bg-gradient-to-br from-[#3730E0] to-[#2B24C7] p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-[#FF7A33]" />
          </div>
          
          <h1 className="text-3xl font-extrabold leading-tight">
            Learn Visually.<br />Master Skills Easily.
          </h1>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
              <PlayCircle className="w-6 h-6 text-[#FF7A33] shrink-0" />
              <span className="text-sm font-medium">Icon-first interactive lessons</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
              <GraduationCap className="w-6 h-6 text-[#1FAE64] shrink-0" />
              <span className="text-sm font-medium">Certified expert courses</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-100"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs font-medium text-slate-500">
        &copy; {new Date().getFullYear()} ClassConnect. All rights reserved.
      </footer>
    </div>
  );
};
