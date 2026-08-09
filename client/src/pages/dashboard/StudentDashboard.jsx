import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { enrollmentApi } from '../../api/models/enrollment.api';
import { NumberTicker } from '../../components/motion/NumberTicker';
import { TextEffect } from '../../components/motion/TextEffect';
import { InView } from '../../components/motion/InView';
import { 
  PlayCircle, 
  Award, 
  CreditCard, 
  AlertCircle, 
  BookOpen, 
  Clock, 
  User, 
  Radio, 
  FileText,
  ChevronRight,
  Sparkles
} from 'lucide-react';

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
        const loaded = Array.isArray(res?.data)
          ? res.data
          : (res?.data?.enrollments || (Array.isArray(res) ? res : []));
        setEnrollments(loaded);
      } catch (error) {
        console.warn('Failed to load enrollments:', error);
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const continueEnrollment = enrollments.find(e => (e.progress || 0) < 100) || enrollments[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--canvas)] p-6 md:p-10 text-[var(--ink)] flex items-center justify-center font-sans">
        <div className="animate-pulse font-bold text-lg text-[var(--ink-muted)]">Loading student dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--canvas)] p-6 md:p-10 text-[var(--ink)] font-sans">
      <InView>
        {/* Welcome Header with Profile Avatar */}
        <header className="mb-10 flex items-center justify-between gap-6 pb-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary)] to-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md overflow-hidden border-2 border-white">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name || user.firstName} className="w-full h-full object-cover" />
              ) : (
                <span>{(user?.name || user?.firstName || 'S').charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope">
                Welcome back, {user?.name || user?.firstName || 'Student'}! 👋
              </h1>
              <p className="text-sm text-[var(--ink-muted)] font-medium">
                Track your active courses, resume lectures, and view certificates.
              </p>
            </div>
          </div>

          <Link to="/profile" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:border-[var(--primary)] transition-all">
            <User className="w-4 h-4 text-[var(--primary)]" />
            <span>Manage Profile</span>
          </Link>
        </header>
      </InView>

      {/* Quick-Access Icons Row */}
      <section className="mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link to="/payments" className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--primary)] transition-all flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-peach-100 text-orange-600 bg-orange-50 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm font-manrope text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">Payment History</h4>
              <p className="text-xs text-[var(--ink-muted)]">Orders & Receipts</p>
            </div>
          </Link>

          <Link to="/report" className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--primary)] transition-all flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm font-manrope text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">My Reports</h4>
              <p className="text-xs text-[var(--ink-muted)]">Tickets & Status</p>
            </div>
          </Link>

          <Link to="/certificates" className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--primary)] transition-all flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm font-manrope text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">Certificates</h4>
              <p className="text-xs text-[var(--ink-muted)]">Earned Badges</p>
            </div>
          </Link>

          <Link to="/profile" className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--primary)] transition-all flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm font-manrope text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">Profile</h4>
              <p className="text-xs text-[var(--ink-muted)]">Account & Security</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Main Grid */}
      <div className="space-y-10">
        
        {/* Big Top "Continue Learning" Card */}
        {continueEnrollment && continueEnrollment.course ? (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-manrope flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--primary)]" /> Continue Learning
              </h2>
            </div>

            <motion.div 
              whileHover={{ scale: 1.005 }}
              className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 rounded-[var(--radius-xl)] shadow-xl border border-indigo-700/50"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-2/5 aspect-video rounded-2xl overflow-hidden shadow-lg relative bg-slate-800 border border-white/10 shrink-0">
                  <img 
                    src={cdnImg(continueEnrollment.course?.thumbnail)} 
                    alt={continueEnrollment.course?.title || 'Course'} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {continueEnrollment.course.type === 'live' ? '🔴 Live Session' : 'Recorded Course'}
                  </div>
                </div>

                <div className="flex-1 space-y-4 text-left w-full">
                  <div>
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Next Lecture Ahead</span>
                    <h3 className="text-2xl font-extrabold font-manrope mt-1 text-white leading-tight">
                      {continueEnrollment.course.title}
                    </h3>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-indigo-200 mb-2">
                      <span>Overall Progress</span>
                      <span><NumberTicker value={continueEnrollment.progress || 0} />% Completed</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-1000"
                        style={{ width: `${continueEnrollment.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
                    <button 
                      onClick={() => navigate(`/course/${continueEnrollment.courseId || continueEnrollment.course._id}/explore`)}
                      className="px-6 py-3 min-h-[44px] bg-[#5B54E8] hover:bg-[#4740D2] text-white font-extrabold text-sm rounded-full shadow-lg flex items-center gap-2 transition-all"
                    >
                      <PlayCircle className="w-5 h-5 fill-white text-indigo-900" />
                      <span>Resume Lecture</span>
                    </button>
                    <span className="text-xs text-indigo-300 font-medium">Last accessed: {continueEnrollment.lastAccessed || 'Recently'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        ) : (
          <section>
            <div className="bg-[var(--surface)] p-10 rounded-[var(--radius-xl)] border border-[var(--border)] text-center shadow-sm">
              <BookOpen className="w-12 h-12 text-[var(--primary)] mx-auto mb-4" />
              <h3 className="text-xl font-bold font-manrope mb-2">No active course enrolled</h3>
              <p className="text-[var(--ink-muted)] mb-6 text-sm">Explore our course catalog to start your learning journey.</p>
              <Link to="/courses" className="inline-flex px-6 py-3 min-h-[44px] bg-[var(--primary)] text-white font-bold text-sm rounded-full shadow-sm">
                Explore Courses
              </Link>
            </div>
          </section>
        )}

        {/* "My Courses" Grid (Tapping navigates to `/course/:id/explore`) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-manrope">My Enrolled Courses</h2>
            <Link to="/courses" className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1">
              Browse More <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enr) => {
              const c = enr.course || {};
              const targetCourseId = enr.courseId || c._id || c.slug;

              return (
                <div 
                  key={enr.id || targetCourseId}
                  onClick={() => navigate(`/course/${targetCourseId}/explore`)}
                  className="bg-[var(--surface)] p-5 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--primary)] transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="aspect-video w-full rounded-2xl bg-[var(--canvas)] overflow-hidden relative border border-[var(--border)]">
                      <img 
                        src={cdnImg(c.thumbnail)} 
                        alt={c.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-white/90 backdrop-blur-md text-[var(--ink)] shadow-sm">
                        {c.type === 'live' ? (
                          <span className="text-red-500 flex items-center gap-1"><Radio className="w-3 h-3 animate-pulse" /> LIVE</span>
                        ) : (
                          <span className="text-indigo-600 flex items-center gap-1"><PlayCircle className="w-3 h-3" /> RECORDED</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-base font-manrope text-[var(--ink)] line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                        {c.title}
                      </h3>
                      <p className="text-xs text-[var(--ink-muted)] mt-1 line-clamp-1">
                        {c.subtitle || c.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-[var(--ink-muted)]">Progress</span>
                      <span className="text-[var(--primary)]">{enr.progress || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--canvas)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${enr.progress || 0}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
