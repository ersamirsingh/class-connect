import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/models/admin.api';
import {
  DollarSign,
  Users,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Flag,
  Layout,
  Layers,
  Loader2,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-[#6366F1] animate-spin mb-3" />
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Loading sales dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold mb-2 border border-[#6366F1]/20">
          <ShieldCheck className="w-4 h-4" /> Admin Control Center
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white">Sales & Platform Performance</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Real-time revenue, enrollments, and operational controls.</p>
      </div>

      {/* 4 Big Visual Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card-visual p-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Total Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0F172A] dark:text-white">${stats?.totalRevenue || 0}</div>
          <div className="text-xs font-semibold text-[#10B981] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24% vs last month
          </div>
        </div>

        <div className="card-visual p-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Total Enrollments</span>
            <div className="w-10 h-10 rounded-2xl bg-[#6366F1]/10 text-[#6366F1] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0F172A] dark:text-white">{stats?.totalEnrollments || 0}</div>
          <div className="text-xs font-semibold text-slate-400">Active Course Purchases</div>
        </div>

        <div className="card-visual p-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Active Students</span>
            <div className="w-10 h-10 rounded-2xl bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0F172A] dark:text-white">{stats?.totalStudents || 0}</div>
          <div className="text-xs font-semibold text-slate-400">Registered Accounts</div>
        </div>

        <div className="card-visual p-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Payment Success</span>
            <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0F172A] dark:text-white">{stats?.successRate || 100}%</div>
          <div className="text-xs font-semibold text-slate-400">Gateway Conversion</div>
        </div>
      </div>

      {/* Sparkline / Revenue Area Chart */}
      <div className="card-visual p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-lg text-[#0F172A] dark:text-white">Revenue & Enrollment Growth</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monthly revenue trend line</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-extrabold">
            Live Stream
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats?.chartData || []}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Admin Operations Navigation Grid */}
      <div className="space-y-4">
        <h3 className="font-black text-lg text-[#0F172A] dark:text-white">Quick Control Panel</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <Link to="/admin/cms" className="card-visual p-4 text-center hover:scale-105 transition-transform space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] mx-auto flex items-center justify-center font-bold">
              <Layout className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-[#0F172A] dark:text-white">Homepage CMS</div>
          </Link>

          <Link to="/admin/categories" className="card-visual p-4 text-center hover:scale-105 transition-transform space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 text-[#0EA5E9] mx-auto flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-[#0F172A] dark:text-white">Categories</div>
          </Link>

          <Link to="/admin/courses" className="card-visual p-4 text-center hover:scale-105 transition-transform space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#6366F1]/10 text-[#6366F1] mx-auto flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-[#0F172A] dark:text-white">Courses</div>
          </Link>

          <Link to="/admin/users" className="card-visual p-4 text-center hover:scale-105 transition-transform space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 text-[#10B981] mx-auto flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-[#0F172A] dark:text-white">Students</div>
          </Link>

          <Link to="/admin/admins" className="card-visual p-4 text-center hover:scale-105 transition-transform space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/10 text-[#06B6D4] mx-auto flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-[#0F172A] dark:text-white">Admins</div>
          </Link>

          <Link to="/admin/reports" className="card-visual p-4 text-center hover:scale-105 transition-transform space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 text-[#EF4444] mx-auto flex items-center justify-center font-bold">
              <Flag className="w-5 h-5" />
            </div>
            <div className="text-xs font-extrabold text-[#0F172A] dark:text-white">Reports ({stats?.openReportsCount || 0})</div>
          </Link>
        </div>
      </div>
    </div>
  );
};
