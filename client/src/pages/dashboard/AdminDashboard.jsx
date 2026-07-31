import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { adminApi } from '../../api/models/admin.api';
import { Users, BookOpen, IndianRupee, CreditCard, LayoutDashboard, Settings, FileText, AlertTriangle, ListTree } from 'lucide-react';
import { NumberTicker } from '../../components/motion/NumberTicker';
import { TextEffect } from '../../components/motion/TextEffect';
import { InView } from '../../components/motion/InView';

export function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getStats();
        setStats(response.data?.data || response.data || response);
      } catch (err) {
        setError(t('failedToLoadStats') || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [t]);

  const modules = [
    { title: 'manageCourses', icon: <BookOpen />, path: '/admin/courses', color: 'var(--primary)' },
    { title: 'manageCategories', icon: <ListTree />, path: '/admin/categories', color: 'var(--accent)' },
    { title: 'manageUsers', icon: <Users />, path: '/admin/users', color: 'var(--success)' },
    { title: 'manageAdmins', icon: <Settings />, path: '/admin/admins', color: 'var(--ink)' },
    { title: 'managePayments', icon: <CreditCard />, path: '/admin/payments', color: 'var(--warning)' },
    { title: 'manageReports', icon: <AlertTriangle />, path: '/admin/reports', color: 'var(--danger)' },
    { title: 'manageCms', icon: <FileText />, path: '/admin/cms', color: 'var(--primary-soft)' },
  ];

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-48 bg-[var(--surface-raised)] rounded-md animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-[var(--surface-raised)] rounded-[var(--radius-lg)] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-[var(--danger)]">{error}</div>;
  }

  return (
    <div className="p-8 space-y-8 bg-[var(--canvas)] min-h-screen text-[var(--ink)]">
      <header>
        <TextEffect as="h1" className="text-3xl font-bold mb-2">
          {t('adminDashboard') || 'Admin Dashboard'}
        </TextEffect>
        <p className="text-[var(--ink-muted)]">{t('welcomeAdmin') || 'Welcome back to the command center.'}</p>
      </header>

      <InView>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title={t('totalStudents') || 'Total Students'} 
            value={stats?.totalStudents || 0} 
            icon={<Users className="text-[var(--primary)]" />} 
          />
          <StatCard 
            title={t('totalCourses') || 'Total Courses'} 
            value={stats?.totalCourses || 0} 
            icon={<BookOpen className="text-[var(--success)]" />} 
          />
          <StatCard 
            title={t('totalRevenue') || 'Total Revenue (₹)'} 
            value={stats?.totalRevenue || 0} 
            icon={<IndianRupee className="text-[var(--accent)]" />} 
          />
          <StatCard 
            title={t('pendingPayments') || 'Pending Payments'} 
            value={stats?.pendingPayments || 0} 
            icon={<CreditCard className="text-[var(--warning)]" />} 
          />
        </div>
      </InView>

      <section className="mt-12">
        <h2 className="text-xl font-bold mb-6">{t('quickModules') || 'Quick Modules'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              className="bg-[var(--surface)] p-6 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all cursor-pointer min-h-[120px] flex items-center gap-4"
            >
              <Link to={mod.path} className="flex-1 flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--surface-raised)]"
                  style={{ color: mod.color }}
                >
                  {mod.icon}
                </div>
                <span className="font-semibold text-lg">{t(mod.title) || mod.title}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-[var(--surface)] p-6 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col justify-between h-32"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-[var(--ink-muted)] font-medium">{title}</h3>
        {icon}
      </div>
      <div className="text-3xl font-bold mt-4">
        <NumberTicker value={value} />
      </div>
    </motion.div>
  );
}
