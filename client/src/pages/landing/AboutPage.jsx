import React from 'react';
import { Navbar } from '../../components/guest/Navbar';
import { Footer } from '../../components/guest/Footer';
import { GraduationCap, ShieldCheck, Sparkles, Eye, Target, Heart } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 py-12 space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3730E0]/10 text-[#3730E0] text-xs font-extrabold">
            <Sparkles className="w-4 h-4 text-[#FF7A33]" /> About ClassConnect
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E1E2E]">Reinventing Education For Visual Learners</h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            We believe learning should be visual, interactive, and clear to everyone regardless of text literacy length.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-visual p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3730E0]/10 text-[#3730E0] flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#1E1E2E]">Visual-First UI</h3>
            <p className="text-xs text-slate-500 font-medium">
              80% icon and visual cards, 20% concise text so concepts are recognized and understood immediately.
            </p>
          </div>

          <div className="card-visual p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF7A33]/10 text-[#FF7A33] flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#1E1E2E]">Skill Focused</h3>
            <p className="text-xs text-slate-500 font-medium">
              Practical, real-world projects and live classes designed to build job-ready skills fast.
            </p>
          </div>

          <div className="card-visual p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1FAE64]/10 text-[#1FAE64] flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#1E1E2E]">Accessible To All</h3>
            <p className="text-xs text-slate-500 font-medium">
              Designed with large touch targets, high-contrast badges, and intuitive step trackers.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
