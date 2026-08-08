import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseApi } from '../../api/models/course.api';
import { enrollmentApi } from '../../api/models/enrollment.api';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import {
  Radio,
  PlayCircle,
  CheckCircle2,
  Clock,
  Video,
  ChevronDown,
  ChevronUp,
  Loader2,
  ArrowRight,
  BookOpen,
  Calendar,
  ExternalLink,
  Award,
  Play,
  Sparkles,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CourseExplorePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const isTelugu = language === 'te';

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recorded'); // 'recorded' | 'live'
  const [completedLectures, setCompletedLectures] = useState([]);
  const [expandedUnitIndex, setExpandedUnitIndex] = useState(0);

  const [orderId, setOrderId] = useState(null);
  const [shareMsg, setShareMsg] = useState(false);

  const [unlockStatus, setUnlockStatus] = useState({ unlockedSections: [0] });

  const handleShareClick = () => {
    const refCode = user?.referralCode || '';
    const shareUrl = `${window.location.origin}/course/${course?.slug || courseId}${refCode ? `?ref=${refCode}` : ''}`;
    navigator.clipboard.writeText(shareUrl);
    setShareMsg(true);
    setTimeout(() => setShareMsg(false), 3000);
  };

  useEffect(() => {
    const fetchExploreContent = async () => {
      try {
        setLoading(true);
        const [courseRes, enrollRes, unlockRes] = await Promise.all([
          courseApi.getCourseByIdOrSlug(courseId),
          enrollmentApi.getMyEnrollments().catch(() => ({ success: false, data: [] })),
          enrollmentApi.getUnlockStatus(courseId).catch(() => ({ data: { unlockedSections: [0] } })),
        ]);

        const loadedCourse = courseRes.data?.course || courseRes.data || (courseRes._id ? courseRes : null);
        if (loadedCourse) {
          setCourse(loadedCourse);
          if (loadedCourse.type === 'live') {
            setActiveTab('live');
          }
        }

        if (unlockRes && unlockRes.data) {
          setUnlockStatus(unlockRes.data);
        }

        if (enrollRes.success && enrollRes.data) {
          const enrollmentsList = Array.isArray(enrollRes.data)
            ? enrollRes.data
            : (enrollRes.data?.enrollments || []);
          const myEnrollment = enrollmentsList.find(
            (e) => (e.course?._id || e.course)?.toString() === courseId || e.course?.slug === courseId
          );
          if (myEnrollment) {
            if (myEnrollment.completedLectures) setCompletedLectures(myEnrollment.completedLectures);
            setOrderId(myEnrollment.order?._id || myEnrollment.order);
          }
        }
      } catch (err) {
        console.error('Failed to load explore content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExploreContent();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--canvas)] flex flex-col justify-between font-sans">
        <FloatingNav />
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin mb-3" />
          <span className="text-xs font-bold text-[var(--ink-muted)]">Loading learning workspace...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[var(--canvas)] flex flex-col justify-between font-sans">
        <FloatingNav />
        <div className="text-center py-32 space-y-4 max-w-md mx-auto px-6">
          <h2 className="text-2xl font-bold text-[var(--ink)] font-manrope">Course Not Found</h2>
          <p className="text-xs font-medium text-[var(--ink-muted)]">The requested learning program could not be located.</p>
          <Link to="/courses" className="px-6 py-3 rounded-full bg-[var(--primary)] text-white text-xs font-bold inline-flex items-center gap-2 shadow-md hover:opacity-90 transition-all">
            Back to Programs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate overall progress stats
  const allLectures = course.sections?.flatMap((s) => s.lectures || []) || [];
  const totalLecturesCount = allLectures.length || 1;
  const completedCount = completedLectures.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLecturesCount) * 100));

  // Find next incomplete lecture for "Continue where you left off" jump card
  const nextIncompleteLecture = allLectures.find((l) => !completedLectures.includes(l._id));

  // Live sessions schedule array
  const liveSessions = course.liveSchedule
    ? [
        {
          id: '1',
          title: `${course.title} — Live Interactive Masterclass`,
          startTime: course.liveSchedule.startTime || new Date(Date.now() + 3600000),
          endTime: course.liveSchedule.endTime || new Date(Date.now() + 7200000),
          meetingUrl: course.liveSchedule.meetingUrl || 'https://meet.google.com/demo-live-class',
          status: course.liveSchedule.status || 'scheduled',
        },
      ]
    : [
        {
          id: 'demo-live-1',
          title: 'Live Q&A & Mentorship Workshop',
          startTime: new Date(Date.now() + 2 * 3600000),
          endTime: new Date(Date.now() + 4 * 3600000),
          meetingUrl: 'https://meet.google.com/demo-live-class',
          status: 'live',
        },
        {
          id: 'demo-live-2',
          title: 'Live Code Review & Architecture Sync',
          startTime: new Date(Date.now() + 26 * 3600000),
          endTime: new Date(Date.now() + 28 * 3600000),
          meetingUrl: 'https://meet.google.com/demo-live-class',
          status: 'upcoming',
        },
      ];

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] flex flex-col justify-between font-sans">
      <FloatingNav />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-28 pb-16 space-y-8">
        
        {/* HEADER & COURSE BRAND BANNER */}
        <div className="bg-[var(--surface)] p-6 sm:p-8 rounded-3xl border border-[var(--border)] shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" /> Learning Workspace (Enrolled)
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-[var(--ink)] font-manrope">{course.title}</h1>
              <p className="text-xs sm:text-sm font-medium text-[var(--ink-muted)] max-w-3xl">{course.subtitle || course.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={handleShareClick}
                className="px-4 py-3 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] hover:bg-[var(--primary-glow)] text-xs font-bold border border-[var(--border)] flex items-center gap-2 cursor-pointer transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>{shareMsg ? 'Referral Link Copied! 📋' : 'Refer & Share'}</span>
              </button>

              <Link
                to={orderId ? `/receipt/${orderId}` : '/payments'}
                className="px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all"
              >
                <Award className="w-4 h-4" />
                <span>Billing & Invoice</span>
              </Link>

              <Link
                to={`/learning/${course._id}`}
                className="px-5 py-3 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-extrabold shadow-lg flex items-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Open Player Room</span>
              </Link>
            </div>
          </div>

          {/* TOP TAB TOGGLE: LIVE VS RECORDED */}
          <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
            <button
              onClick={() => setActiveTab('recorded')}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'recorded'
                  ? 'bg-[var(--primary)] text-white shadow-md'
                  : 'bg-[var(--canvas)] text-[var(--ink-muted)] hover:text-[var(--ink)] border border-[var(--border)]'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Recorded Units ({course.sections?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('live')}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-full text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'live'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-[var(--canvas)] text-[var(--ink-muted)] hover:text-[var(--ink)] border border-[var(--border)]'
              }`}
            >
              <Radio className="w-4 h-4 animate-pulse text-rose-500" />
              <span>Live Sessions ({liveSessions.length})</span>
            </button>
          </div>
        </div>

        {/* RECORDED TAB SECTION */}
        {activeTab === 'recorded' && (
          <div className="space-y-6">
            
            {/* PERSISTENT "CONTINUE WHERE YOU LEFT OFF" CARD */}
            <div className="bg-indigo-50/80 border border-indigo-200/80 p-6 rounded-3xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center font-black shadow-md shrink-0">
                  <Play className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[var(--primary)] tracking-wider">Quick Resume</span>
                  <h3 className="text-base font-extrabold text-[var(--ink)] font-manrope">
                    {nextIncompleteLecture ? nextIncompleteLecture.title : 'All Lectures Completed! 🎉'}
                  </h3>
                  <p className="text-xs font-medium text-[var(--ink-muted)] mt-0.5">
                    Progress: {completedCount} / {totalLecturesCount} Lectures ({progressPercent}%)
                  </p>
                </div>
              </div>

              <Link
                to={`/learning/${course._id}`}
                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-extrabold px-6 py-3 rounded-full shadow-md flex items-center gap-2 shrink-0 transition-all"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* UNIT ACCORDION LIST */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-manrope text-[var(--ink)] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[var(--primary)]" /> Course Units & Curriculum
              </h2>

              {course.sections && course.sections.length > 0 ? (
                course.sections.map((unit, uIdx) => {
                  const unitCompleted = unit.lectures?.filter((l) => completedLectures.includes(l._id)).length || 0;
                  const unitTotal = unit.lectures?.length || 1;
                  const isExpanded = expandedUnitIndex === uIdx;
                  const isUnlocked = course.type === 'live' || uIdx === 0 || (unlockStatus.unlockedSections && unlockStatus.unlockedSections.includes(uIdx));
                  const prevUnitTitle = course.sections[uIdx - 1]?.title || `Unit ${uIdx}`;

                  return (
                    <div
                      key={unit._id || uIdx}
                      className={`rounded-3xl border overflow-hidden shadow-xs transition-all ${
                        isUnlocked 
                          ? 'bg-[var(--surface)] border-[var(--border)]' 
                          : 'bg-[var(--canvas)] border-[var(--border)] opacity-80'
                      }`}
                    >
                      <button
                        onClick={() => setExpandedUnitIndex(isExpanded ? null : uIdx)}
                        className="w-full p-5 flex items-center justify-between font-extrabold text-sm text-[var(--ink)] hover:bg-[var(--canvas)] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isUnlocked ? 'bg-[var(--primary)] text-white' : 'bg-slate-400 text-white'
                          }`}>
                            U{uIdx + 1}
                          </span>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold font-manrope">{unit.title}</h3>
                              {!isUnlocked && (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                                  🔒 Locked
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[var(--ink-muted)] font-medium">
                              {isUnlocked 
                                ? `${unitCompleted} / ${unitTotal} lectures complete` 
                                : `Complete "${prevUnitTitle}" to unlock`}
                            </span>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-[var(--primary)]" /> : <ChevronDown className="w-5 h-5 text-[var(--primary)]" />}
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-[var(--border)] p-3 bg-[var(--canvas)]">
                          {unit.lectures?.map((lec) => {
                            const isDone = completedLectures.includes(lec._id);
                            return (
                              <div
                                key={lec._id || lec.title}
                                className="p-3.5 rounded-2xl flex items-center justify-between text-xs font-medium hover:bg-[var(--surface)] transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <PlayCircle className={`w-4 h-4 shrink-0 ${isUnlocked ? 'text-[var(--primary)]' : 'text-[var(--ink-faint)]'}`} />
                                  )}
                                  <span className={isDone ? 'line-through text-[var(--ink-faint)]' : isUnlocked ? 'text-[var(--ink)] font-bold' : 'text-[var(--ink-muted)]'}>
                                    {lec.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] text-[var(--ink-faint)] font-bold">{lec.duration}</span>
                                  {isUnlocked ? (
                                    <Link
                                      to={`/learning/${course._id}`}
                                      className="px-3.5 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] font-bold text-[10px] hover:bg-[var(--primary)] hover:text-white transition-colors"
                                    >
                                      Play
                                    </Link>
                                  ) : (
                                    <span className="px-2.5 py-1 rounded-full bg-[var(--canvas)] border border-[var(--border)] text-[var(--ink-faint)] font-bold text-[10px] cursor-not-allowed">
                                      Locked 🔒
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-xs font-bold text-[var(--ink-muted)] py-4">No recorded units available.</div>
              )}
            </div>

          </div>
        )}

        {/* LIVE TAB SECTION */}
        {activeTab === 'live' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-manrope text-[var(--ink)] flex items-center gap-2">
              <Radio className="w-5 h-5 text-rose-500 animate-pulse" /> Scheduled Live Masterclasses
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveSessions.map((session) => {
                const isLiveNow = session.status === 'live';
                const isCompleted = session.status === 'completed';

                return (
                  <div
                    key={session.id}
                    className="bg-[var(--surface)] rounded-3xl p-6 border border-[var(--border)] shadow-md flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        {isLiveNow ? (
                          <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                            🔴 LIVE NOW
                          </span>
                        ) : isCompleted ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                            ✓ Completed
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Upcoming
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-base text-[var(--ink)] font-manrope">{session.title}</h3>
                      <div className="text-xs font-semibold text-[var(--ink-muted)] flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[var(--primary)]" />
                        <span>{new Date(session.startTime).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--border)]">
                      {isLiveNow ? (
                        <a
                          href={session.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-rose-600 hover:bg-rose-700 text-white w-full text-xs font-extrabold py-3 rounded-full flex items-center justify-center gap-2 shadow-md transition-all"
                        >
                          <ExternalLink className="w-4 h-4" /> Join Live Masterclass
                        </a>
                      ) : isCompleted ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-full bg-[var(--canvas)] text-[var(--ink-faint)] text-xs font-bold text-center border border-[var(--border)]"
                        >
                          Recording Unavailable
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-full bg-[var(--canvas)] text-[var(--ink-faint)] text-xs font-bold text-center cursor-not-allowed border border-[var(--border)]"
                        >
                          Starts Soon
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
