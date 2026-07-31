import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { enrollmentApi } from '../../api/models/enrollment.api';
import { NumberTicker } from '../../components/motion/NumberTicker';
import { TextEffect } from '../../components/motion/TextEffect';
import { InView } from '../../components/motion/InView';
import { PlayCircle, Award, CreditCard, AlertCircle, BookOpen, Clock } from 'lucide-react';

export function StudentDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await enrollmentApi.getMyEnrollments();
        const loadedEnrollments = Array.isArray(res?.data)
          ? res.data
          : (res?.data?.enrollments || (Array.isArray(res) ? res : []));
        setEnrollments(loadedEnrollments);
      } catch (error) {
        console.error('Failed to load enrollments', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const recentEnrollment = enrollments[0];

  if (loading) {
    return <div className="min-h-screen bg-[var(--canvas)] p-6 md:p-10 text-[var(--ink)] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--canvas)] p-6 md:p-10 text-[var(--ink)]">
      <InView>
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-2 font-['Manrope']">
            <TextEffect>{t('welcome_back') || 'Welcome back'}, {user?.firstName || 'Student'}!</TextEffect>
          </h1>
          <p className="text-[var(--ink-muted)]">
            {t('ready_to_learn') || 'Ready to continue your learning journey?'}
          </p>
        </header>
      </InView>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {recentEnrollment ? (
            <section>
              <h2 className="text-xl font-bold mb-4 font-['Manrope']">{t('continue_learning') || 'Continue Learning'}</h2>
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-[var(--surface)] p-6 rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] border border-[var(--border)]"
              >
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/3 aspect-video bg-[var(--canvas)] rounded-[var(--radius-lg)] overflow-hidden">
                    {recentEnrollment.course?.thumbnail && (
                      <img src={recentEnrollment.course.thumbnail} alt={recentEnrollment.course.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-bold">{recentEnrollment.course?.title}</h3>
                    <div className="flex items-center gap-2 text-[var(--ink-muted)] text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Last accessed recently</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2 font-medium">
                        <span>Progress</span>
                        <span>
                          <NumberTicker value={recentEnrollment.progress || 0} />%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[var(--canvas)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[var(--primary)] rounded-full transition-all duration-1000"
                          style={{ width: `${recentEnrollment.progress || 0}%` }}
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/learning/${recentEnrollment.courseId}`)}
                      className="w-full md:w-auto px-6 py-3 min-h-[44px] bg-[var(--primary)] text-white font-medium rounded-[var(--radius-pill)] hover:bg-[var(--deep-anchor)] transition-colors flex items-center justify-center gap-2"
                    >
                      <PlayCircle className="w-5 h-5" />
                      {t('resume_course') || 'Resume Course'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </section>
          ) : (
            <section>
              <div className="bg-[var(--surface)] p-10 rounded-[var(--radius-xl)] border border-[var(--border)] text-center shadow-[var(--shadow-sm)]">
                <BookOpen className="w-12 h-12 text-[var(--primary-soft)] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No active enrollments</h3>
                <p className="text-[var(--ink-muted)] mb-6">Looks like you haven't enrolled in any courses yet.</p>
                <Link to="/courses" className="inline-block px-6 py-3 min-h-[44px] bg-[var(--primary)] text-white font-medium rounded-[var(--radius-pill)]">
                  Browse Courses
                </Link>
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xl font-bold mb-4 font-['Manrope']">{t('my_courses') || 'My Courses'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enr) => (
                <div key={enr.id} className="bg-[var(--surface)] p-4 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex gap-4 cursor-pointer hover:border-[var(--primary)] transition-colors" onClick={() => navigate(`/learning/${enr.courseId}`)}>
                   <div className="w-24 h-24 shrink-0 bg-[var(--canvas)] rounded-lg overflow-hidden">
                      {enr.course?.thumbnail && <img src={enr.course.thumbnail} alt="" className="w-full h-full object-cover" />}
                   </div>
                   <div className="flex-1 flex flex-col justify-center">
                     <h4 className="font-bold text-sm line-clamp-2 mb-2">{enr.course?.title}</h4>
                     <div className="w-full h-1.5 bg-[var(--canvas)] rounded-full overflow-hidden mt-auto">
                        <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${enr.progress || 0}%` }} />
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-4 font-['Manrope']">{t('quick_actions') || 'Quick Actions'}</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              <Link to="/courses" className="flex items-center gap-3 p-4 bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors shadow-[var(--shadow-sm)]">
                <div className="p-2 bg-[var(--aura-blue)] rounded-lg text-[var(--primary)]"><BookOpen className="w-5 h-5"/></div>
                <span className="font-medium text-sm">Browse Courses</span>
              </Link>
              <Link to="/payments" className="flex items-center gap-3 p-4 bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors shadow-[var(--shadow-sm)]">
                <div className="p-2 bg-[var(--aura-peach)] rounded-lg text-[var(--energy-accent)]"><CreditCard className="w-5 h-5"/></div>
                <span className="font-medium text-sm">Payment History</span>
              </Link>
              <Link to="/report" className="flex items-center gap-3 p-4 bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors shadow-[var(--shadow-sm)]">
                <div className="p-2 bg-[var(--aura-violet)] rounded-lg text-[var(--deep-anchor)]"><AlertCircle className="w-5 h-5"/></div>
                <span className="font-medium text-sm">Report Problem</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
