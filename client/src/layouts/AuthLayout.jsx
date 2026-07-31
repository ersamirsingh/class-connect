import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { LanguageSwitcher } from '../components/shared/LanguageSwitcher';
import { ThemeToggle } from '../components/shared/ThemeToggle';

export function AuthLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--canvas)]">
      {/* Left panel — abstract visual (desktop only) */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center"
        style={{
          background: `linear-gradient(135deg, var(--aura-violet) 0%, var(--aura-blue) 50%, var(--aura-peach) 100%)`,
        }}
      >
        {/* Decorative floating shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full opacity-30"
            style={{ background: 'var(--primary)', filter: 'blur(80px)' }}
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[20%] right-[15%] w-48 h-48 rounded-full opacity-25"
            style={{ background: 'var(--accent)', filter: 'blur(60px)' }}
            animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-20"
            style={{ background: 'var(--primary-deep)', filter: 'blur(100px)' }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Brand message */}
        <div className="relative z-10 text-center px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/90 flex items-center justify-center mx-auto mb-8
              shadow-[var(--shadow-lg)]">
              <BookOpen className="w-8 h-8 text-[var(--primary)]" />
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--primary-deep)] mb-4"
              style={{ fontFamily: 'Manrope, sans-serif' }}>
              ClassConnect
            </h1>
            <p className="text-base text-[var(--primary-deep)] opacity-70 max-w-xs mx-auto leading-relaxed">
              Your journey to mastering new skills starts here.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col">
        {/* Top bar with actions */}
        <div className="flex items-center justify-between p-4 lg:px-8 lg:py-5">
          <Link to="/" className="flex items-center gap-2 lg:hidden group">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-[var(--ink)]"
              style={{ fontFamily: 'Manrope, sans-serif' }}>
              ClassConnect
            </span>
          </Link>
          <div className="flex items-center gap-1 ml-auto">
            <LanguageSwitcher variant="compact" />
            <ThemeToggle />
          </div>
        </div>

        {/* Form content area */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 lg:px-16">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
