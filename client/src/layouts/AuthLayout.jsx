import React from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Award, Video, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LanguageSwitcher } from '../components/shared/LanguageSwitcher';
import { ThemeToggle } from '../components/shared/ThemeToggle';

export function AuthLayout() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // If already authenticated with valid token, redirect to home/dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--canvas)] flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans">
      
      {/* Top Header Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 mb-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-[var(--ink)]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            ClassConnect
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/" className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface)] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <LanguageSwitcher variant="compact" />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Center Area — Split into Two Cards */}
      <main className="flex-1 flex items-center justify-center py-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch my-auto">
          
          {/* CARD 1: ABOUT US & PLATFORM HIGHLIGHTS (Left Card) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-5 bg-gradient-to-br from-[var(--primary)] via-indigo-700 to-[var(--deep-anchor,#24216F)] text-white p-6 sm:p-8 rounded-[var(--radius-xl,24px)] shadow-xl flex flex-col justify-between relative overflow-hidden"
          >
            {/* Decorative background aura */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-extrabold tracking-wide uppercase border border-white/20">
                <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                <span>About ClassConnect</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-manrope leading-tight">
                  Empowering Learners Worldwide
                </h2>
                <p className="text-sm text-indigo-100 mt-2.5 leading-relaxed font-medium">
                  ClassConnect is a state-of-the-art learning platform providing live masterclasses, hands-on projects, and verifiable certifications.
                </p>
              </div>

              {/* Feature Bullets */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/10 shrink-0">
                    <Video className="w-4 h-4 text-sky-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Live & Recorded Masterclasses</h4>
                    <p className="text-[11px] text-indigo-200">HD streaming with adaptive player.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/10 shrink-0">
                    <Award className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Verifiable Certificates</h4>
                    <p className="text-[11px] text-indigo-200">Earn recognized digital credentials upon course completion.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/10 shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">100% Verified Instructors</h4>
                    <p className="text-[11px] text-indigo-200">Learn directly from senior industry leaders.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Stat Strip */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/15 flex items-center justify-between text-xs">
              <div>
                <span className="block text-lg font-black text-white">10,000+</span>
                <span className="text-[10px] text-indigo-200 font-medium">Active Students</span>
              </div>
              <div>
                <span className="block text-lg font-black text-white">99.4%</span>
                <span className="text-[10px] text-indigo-200 font-medium">Satisfaction</span>
              </div>
              <div>
                <span className="block text-lg font-black text-white">4.9 ★</span>
                <span className="text-[10px] text-indigo-200 font-medium">Top Rated</span>
              </div>
            </div>
          </motion.div>

          {/* CARD 2: LOGIN / SIGNUP FORM (Right Card) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-7 bg-[var(--surface)] p-6 sm:p-8 md:p-10 rounded-[var(--radius-xl,24px)] border border-[var(--border)] shadow-xl flex flex-col justify-center"
          >
            <Outlet />
          </motion.div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="max-w-6xl w-full mx-auto text-center py-2 text-[11px] text-[var(--ink-muted)] font-medium">
        © 2026 ClassConnect Inc. All rights reserved.
      </footer>

    </div>
  );
}
