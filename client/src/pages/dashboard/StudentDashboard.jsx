import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { PlayCircle, BookOpen, Award, Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Visual Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#3730E0] to-[#2B24C7] p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
            <Sparkles className="w-4 h-4 text-[#FF7A33]" /> Student Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-xs text-white/80 max-w-lg font-medium">
            Continue learning where you left off or explore new visual courses.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <button className="btn-visual bg-[#FF7A33] text-white hover:bg-[#E8631C] text-xs font-extrabold shadow-lg">
            <PlayCircle className="w-5 h-5" /> Resume Learning
          </button>
        </div>
      </motion.div>

      {/* Quick Visual Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-visual p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#3730E0]/10 text-[#3730E0] flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#1E1E2E]">0</div>
            <div className="text-xs font-bold text-slate-500">Enrolled Courses</div>
          </div>
        </div>

        <div className="card-visual p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF7A33]/10 text-[#FF7A33] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#1E1E2E]">0h</div>
            <div className="text-xs font-bold text-slate-500">Watch Time</div>
          </div>
        </div>

        <div className="card-visual p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1FAE64]/10 text-[#1FAE64] flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#1E1E2E]">0</div>
            <div className="text-xs font-bold text-slate-500">Certificates Earned</div>
          </div>
        </div>
      </div>
    </div>
  );
};
