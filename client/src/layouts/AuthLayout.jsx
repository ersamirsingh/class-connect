import React from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Award, Video, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LanguageSwitcher } from '../components/shared/LanguageSwitcher';

export function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FBFBF5] text-[#000000] flex flex-col justify-between p-4 sm:p-6 md:p-8 font-body selection:bg-[#C1FBD4] selection:text-black">
      
      {/* Top Header Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 mb-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-[#000000] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-display text-base font-medium tracking-tight text-[#000000]">
            ClassConnect
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/" className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono text-[#71717A] hover:text-[#000000] hover:bg-[#FFFFFF] transition-colors border border-transparent hover:border-[#E4E4E7]">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <LanguageSwitcher variant="compact" />
        </div>
      </header>

      {/* Main Center Area — Split into Two Cards */}
      <main className="flex-1 flex items-center justify-center py-4">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch my-auto">
          
          {/* CARD 1: ABOUT US & PLATFORM HIGHLIGHTS (Left Card) */}
          <div className="lg:col-span-5 bg-[#000000] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C1FBD4] text-[#000000] text-[10px] font-mono font-medium uppercase tracking-widest">
                <GraduationCap className="w-3.5 h-3.5" />
                ABOUT CLASSCONNECT
              </span>

              <div>
                <h2 className="font-display text-3xl font-light text-white leading-tight">
                  Empowering Relentless Learners
                </h2>
                <p className="font-body text-xs text-[#A1A1AA] mt-2.5 leading-relaxed">
                  ClassConnect is a state-of-the-art learning operating system providing live masterclasses, hands-on projects, and verifiable credentials.
                </p>
              </div>

              {/* Feature Bullets */}
              <div className="space-y-4 pt-2 font-body text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/10 shrink-0">
                    <Video className="w-4 h-4 text-[#C1FBD4]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Live & Recorded Masterclasses</h4>
                    <p className="text-[#A1A1AA] text-[11px]">HD streaming with adaptive telemetry player.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/10 shrink-0">
                    <Award className="w-4 h-4 text-[#C1FBD4]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Verifiable Digital Credentials</h4>
                    <p className="text-[#A1A1AA] text-[11px]">Earn recognized certificates upon course completion.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/10 shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#C1FBD4]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">100% Verified Instructors</h4>
                    <p className="text-[#A1A1AA] text-[11px]">Learn directly from senior industry leaders.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Stat Strip */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/15 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="block text-lg font-normal text-white">10,000+</span>
                <span className="text-[10px] text-[#A1A1AA]">Active Learners</span>
              </div>
              <div>
                <span className="block text-lg font-normal text-white">99.4%</span>
                <span className="text-[10px] text-[#A1A1AA]">Satisfaction</span>
              </div>
              <div>
                <span className="block text-lg font-normal text-white">4.9 ★</span>
                <span className="text-[10px] text-[#A1A1AA]">Top Rated</span>
              </div>
            </div>
          </div>

          {/* CARD 2: LOGIN / SIGNUP FORM (Right Card) */}
          <div className="lg:col-span-7 bg-[#FFFFFF] p-8 sm:p-10 rounded-3xl border border-[#E4E4E7] shadow-sm flex flex-col justify-center">
            <Outlet />
          </div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="max-w-6xl w-full mx-auto text-center py-2 text-xs font-mono text-[#71717A]">
        © 2026 ClassConnect Inc. All rights reserved.
      </footer>

    </div>
  );
}
