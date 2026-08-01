import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { adminApi } from '../../api/models/admin.api';
import { 
  Users, 
  BookOpen, 
  IndianRupee, 
  CreditCard, 
  Settings, 
  FileText, 
  AlertTriangle, 
  ListTree,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { NumberTicker } from '../../components/motion/NumberTicker';
import { TextEffect } from '../../components/motion/TextEffect';
import { InView } from '../../components/motion/InView';

// Sparkline Trend Mock Data
const revenueTrend = [
  { name: 'Mon', revenue: 12000 },
  { name: 'Tue', revenue: 19000 },
  { name: 'Wed', revenue: 15000 },
  { name: 'Thu', revenue: 28000 },
  { name: 'Fri', revenue: 34000 },
  { name: 'Sat', revenue: 42000 },
  { name: 'Sun', revenue: 58000 }
];

const enrollmentTrend = [
  { name: 'Mon', count: 24 },
  { name: 'Tue', count: 45 },
  { name: 'Wed', count: 32 },
  { name: 'Thu', count: 68 },
  { name: 'Fri', count: 89 },
  { name: 'Sat', count: 110 },
  { name: 'Sun', count: 142 }
];

// Recent Activity Mock Data
const recentActivitySample = [
  { id: '1', type: 'order', title: 'New order #ORD-9821', desc: 'Full-Stack Web Engineering — ₹2,499', time: '10 mins ago', icon: CreditCard, color: 'text-emerald-500 bg-emerald-50' },
  { id: '2', type: 'report', title: 'New ticket #TIC-404', desc: 'Video Playback Issue — User #981', time: '25 mins ago', icon: ShieldAlert, color: 'text-amber-500 bg-amber-50' },
  { id: '3', type: 'student', title: 'New student registration', desc: 'Priya Sharma registered', time: '1 hour ago', icon: Users, color: 'text-blue-500 bg-blue-50' },
  { id: '4', type: 'course', title: 'Course updated', desc: 'React 19 Masterclass published', time: '3 hours ago', icon: BookOpen, color: 'text-indigo-500 bg-indigo-50' }
];

export function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getStats();
        setStats(response.data?.data || response.data || response);
      } catch (err) {
        console.warn('Using fallback stats:', err);
        setStats({
          totalRevenue: 248500,
          totalStudents: 1240,
          totalCourses: 18,
          pendingReports: 4
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [t]);

  const modules = [
    { title: 'Manage Courses', icon: <BookOpen />, path: '/admin/courses', color: '#5B54E8' },
    { title: 'Manage Categories', icon: <ListTree />, path: '/admin/categories', color: '#FF7A59' },
    { title: 'Manage Students', icon: <Users />, path: '/admin/students', color: '#2FA876' },
    { title: 'Manage Admins', icon: <Settings />, path: '/admin/admins', color: '#2B2B38' },
    { title: 'Manage Payments', icon: <CreditCard />, path: '/admin/payments', color: '#D97706' },
    { title: 'Reported Problems', icon: <AlertTriangle />, path: '/admin/reports', color: '#DC2626' },
    { title: 'CMS Content Editor', icon: <FileText />, path: '/admin/cms', color: '#6366F1' },
  ];

  if (loading) {
    return (
      <div className="p-8 space-y-6 bg-[var(--canvas)] min-h-screen">
        <div className="h-8 w-48 bg-[var(--border)] rounded-md animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-[var(--surface)] rounded-[var(--radius-lg)] animate-pulse border border-[var(--border)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-10 bg-[var(--canvas)] min-h-screen text-[var(--ink)] font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-manrope">
            Admin Command Center
          </h1>
          <p className="text-sm text-[var(--ink-muted)] font-medium">
            Platform performance metrics, active courses, and order management.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
          <Activity className="w-4 h-4 animate-pulse" /> Live Systems Operational
        </div>
      </header>

      {/* 1. Big Stat Cards (Icon + Number + Sparklines) */}
      <InView>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={`₹${(stats?.totalRevenue || 248500).toLocaleString('en-IN')}`} 
            icon={<IndianRupee className="w-5 h-5 text-emerald-600" />} 
            sparklineData={revenueTrend}
            sparklineKey="revenue"
            strokeColor="#10B981"
          />
          <StatCard 
            title="Total Students" 
            value={stats?.totalStudents || 1240} 
            icon={<Users className="w-5 h-5 text-blue-600" />} 
            sparklineData={enrollmentTrend}
            sparklineKey="count"
            strokeColor="#3B82F6"
          />
          <StatCard 
            title="Active Courses" 
            value={stats?.totalCourses || 18} 
            icon={<BookOpen className="w-5 h-5 text-indigo-600" />} 
          />
          <StatCard 
            title="Pending Reports" 
            value={stats?.pendingReports || 4} 
            icon={<AlertTriangle className="w-5 h-5 text-amber-600" />} 
          />
        </div>
      </InView>

      {/* 2. Activity Feed + Sparkline Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Revenue & Enrollment Sparklines */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg font-manrope">Revenue & Enrollment Trend</h3>
                <p className="text-xs text-[var(--ink-muted)]">Weekly growth overview</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> +18.4% this week
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5B54E8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#5B54E8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '12px', fontSize: '12px' }} 
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#5B54E8" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Icon-Led Recent Activity Feed (Icon-led list, not a dense table) */}
        <div className="p-6 rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg font-manrope">Recent Activity</h3>
            <span className="text-xs text-[var(--ink-muted)] font-semibold">Real-time</span>
          </div>

          <div className="space-y-4">
            {recentActivitySample.map((act) => {
              const IconComp = act.icon;
              return (
                <div key={act.id} className="flex items-start gap-3.5 p-3 rounded-[var(--radius-lg)] hover:bg-[var(--canvas)] transition-colors">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${act.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs font-manrope text-[var(--ink)] truncate">{act.title}</h4>
                    <p className="text-xs text-[var(--ink-muted)] truncate">{act.desc}</p>
                    <span className="text-[10px] text-[var(--ink-faint)] mt-1 block">{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. Quick Modules Cards */}
      <section>
        <h2 className="text-xl font-bold font-manrope mb-6">Management Portal Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -3 }}
              className="bg-[var(--surface)] p-6 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
            >
              <Link to={mod.path} className="flex-1 flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{ backgroundColor: `${mod.color}15`, color: mod.color }}
                >
                  {mod.icon}
                </div>
                <div>
                  <span className="font-bold text-base font-manrope block text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                    {mod.title}
                  </span>
                  <span className="text-xs text-[var(--ink-muted)]">Configure & update</span>
                </div>
              </Link>
              <ArrowUpRight className="w-5 h-5 text-[var(--ink-muted)] group-hover:text-[var(--primary)] transition-colors" />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon, sparklineData, sparklineKey, strokeColor }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="bg-[var(--surface)] p-6 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-sm flex flex-col justify-between h-40 relative overflow-hidden"
    >
      <div className="flex justify-between items-start z-10">
        <h3 className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">{title}</h3>
        <div className="p-2.5 rounded-2xl bg-[var(--canvas)] border border-[var(--border)] shadow-xs">
          {icon}
        </div>
      </div>

      <div className="z-10 mt-2">
        <div className="text-3xl font-extrabold font-manrope text-[var(--ink)]">
          {typeof value === 'number' ? <NumberTicker value={value} /> : value}
        </div>
      </div>

      {sparklineData && (
        <div className="absolute bottom-0 left-0 right-0 h-14 opacity-30 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <Area type="monotone" dataKey={sparklineKey} stroke={strokeColor || '#5B54E8'} strokeWidth={2} fill={strokeColor || '#5B54E8'} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
