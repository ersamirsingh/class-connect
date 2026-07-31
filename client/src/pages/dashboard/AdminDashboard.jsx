import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ShieldAlert, BookOpen, Users, DollarSign, Flag, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1E1E2E] p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A33]/20 text-[#FF7A33] text-xs font-bold mb-2">
            <ShieldAlert className="w-4 h-4" /> Admin Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Control Center</h1>
          <p className="text-xs text-slate-400 font-medium">Manage courses, admins, sales, and platform operations.</p>
        </div>
      </motion.div>

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-visual p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Courses</span>
            <div className="w-9 h-9 rounded-xl bg-[#3730E0]/10 text-[#3730E0] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1E1E2E]">0</div>
        </div>

        <div className="card-visual p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Admins</span>
            <div className="w-9 h-9 rounded-xl bg-[#1FAE64]/10 text-[#1FAE64] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1E1E2E]">1</div>
        </div>

        <div className="card-visual p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Sales</span>
            <div className="w-9 h-9 rounded-xl bg-[#F5A623]/10 text-[#F5A623] flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1E1E2E]">$0</div>
        </div>

        <div className="card-visual p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Open Reports</span>
            <div className="w-9 h-9 rounded-xl bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center font-bold">
              <Flag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#1E1E2E]">0</div>
        </div>
      </div>
    </div>
  );
};
