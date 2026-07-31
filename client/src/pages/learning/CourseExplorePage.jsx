import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseApi } from '../../api/models/course.api';
import { enrollmentApi } from '../../api/models/enrollment.api';
import { Navbar } from '../../components/guest/Navbar';
import { Footer } from '../../components/guest/Footer';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CourseExplorePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recorded'); // 'recorded' | 'live'
  const [completedLectures, setCompletedLectures] = useState([]);
  const [expandedUnitIndex, setExpandedUnitIndex] = useState(0);

  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const fetchExploreContent = async () => {
      try {
        setLoading(true);
        const [courseRes, enrollRes] = await Promise.all([
          courseApi.getCourseByIdOrSlug(courseId),
          enrollmentApi.getMyEnrollments(),
        ]);

        if (courseRes.success && courseRes.data) {
          setCourse(courseRes.data);
          if (courseRes.data.type === 'live') {
            setActiveTab('live');
          }
        }

        if (enrollRes.success && enrollRes.data) {
          const myEnrollment = enrollRes.data.find(
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
      <div className="min-h-screen bg-[#FBFAF7] dark:bg-[#090D16] flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#5B54E8] animate-spin mb-3" />
          <span className="text-xs font-bold text-[#2B2B38] dark:text-slate-400">Loading learning workspace...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#FBFAF7] dark:bg-[#090D16] flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-20 space-y-4">
          <h2 className="text-2xl font-bold text-[#2B2B38] dark:text-white">Course Not Found</h2>
          <Link to="/courses" className="btn-visual bg-[#5B54E8] text-white text-xs inline-flex">
            Back to Programs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate overall progress stats
  const allLectures = course.sections?.flatMap((s) => s.lectures) || [];
  const totalLecturesCount = allLectures.length || 1;
  const completedCount = completedLectures.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLecturesCount) * 100));

  // Find next incomplete lecture for "Continue where you left off" jump card
  const nextIncompleteLecture = allLectures.find((l) => !completedLectures.includes(l._id));

  // Mock or real Live sessions schedule array
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
    <div className="min-h-screen bg-[#FBFAF7] dark:bg-[#090D16] flex flex-col justify-between transition-colors duration-200 text-[#2B2B38] dark:text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        
        {/* HEADER & COURSE BRAND BANNER */}
        <div className="bg-white dark:bg-[#111827] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B54E8]/10 text-[#5B54E8] text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" /> Learning Workspace (Post-Purchase Explore)
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#2B2B38] dark:text-white">{course.title}</h1>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{course.subtitle || course.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to={orderId ? `/receipt/${orderId}` : '/payments'}
                className="btn-visual bg-[#2FA876] hover:bg-[#25875e] text-white text-xs font-black px-4 py-3 rounded-2xl shadow-md flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Billing & Download Invoice</span>
              </Link>

              <Link
                to={`/learning/${course._id}`}
                className="btn-visual bg-[#5B54E8] hover:bg-[#4740D2] text-white text-xs font-black px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Open Player Room</span>
              </Link>
            </div>
          </div>

          {/* TOP TAB TOGGLE: LIVE VS RECORDED */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('recorded')}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                activeTab === 'recorded'
                  ? 'bg-[#5B54E8] text-white shadow-md'
                  : 'bg-[#DCEFFB]/60 dark:bg-slate-800 text-[#2B2B38] dark:text-slate-300 hover:bg-[#DCEFFB]'
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Recorded Units ({course.sections?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('live')}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                activeTab === 'live'
                  ? 'bg-[#FF7A59] text-white shadow-md'
                  : 'bg-[#FCE7D6]/60 dark:bg-slate-800 text-[#2B2B38] dark:text-slate-300 hover:bg-[#FCE7D6]'
              }`}
            >
              <Radio className="w-4 h-4 animate-pulse text-[#FF7A59]" />
              <span>Live Sessions ({liveSessions.length})</span>
            </button>
          </div>
        </div>

        {/* RECORDED TAB SECTION */}
        {activeTab === 'recorded' && (
          <div className="space-y-6">
            
            {/* PERSISTENT "CONTINUE WHERE YOU LEFT OFF" CARD */}
            <div className="bg-[#E4E2FB] dark:bg-[#1E1B4B] p-6 rounded-3xl border border-[#5B54E8]/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#5B54E8] text-white flex items-center justify-center font-black shadow-md shrink-0">
                  <Play className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-[#5B54E8] dark:text-[#818cf8] tracking-wider">Quick Resume</span>
                  <h3 className="text-base font-extrabold text-[#2B2B38] dark:text-white">
                    {nextIncompleteLecture ? nextIncompleteLecture.title : 'All Lectures Completed! 🎉'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                    Progress: {completedCount} / {totalLecturesCount} Lectures ({progressPercent}%)
                  </p>
                </div>
              </div>

              <Link
                to={`/learning/${course._id}`}
                className="btn-visual bg-[#5B54E8] hover:bg-[#4740D2] text-white text-xs font-black px-5 py-3 rounded-2xl shadow-md flex items-center gap-2 shrink-0"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* UNIT ACCORDION LIST */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-[#2B2B38] dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#5B54E8]" /> Course Units & Curriculum
              </h2>

              {course.sections && course.sections.length > 0 ? (
                course.sections.map((unit, uIdx) => {
                  const unitCompleted = unit.lectures.filter((l) => completedLectures.includes(l._id)).length;
                  const unitTotal = unit.lectures.length || 1;
                  const isExpanded = expandedUnitIndex === uIdx;

                  return (
                    <div
                      key={unit._id || uIdx}
                      className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm"
                    >
                      <button
                        onClick={() => setExpandedUnitIndex(isExpanded ? null : uIdx)}
                        className="w-full p-5 flex items-center justify-between font-extrabold text-sm text-[#2B2B38] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-2xl bg-[#5B54E8] text-white flex items-center justify-center text-xs font-black">
                            U{uIdx + 1}
                          </span>
                          <div className="text-left">
                            <h3 className="text-sm font-black">{unit.title}</h3>
                            <span className="text-[11px] text-[#5B54E8] font-bold">
                              {unitCompleted} / {unitTotal} lectures complete
                            </span>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-[#5B54E8]" /> : <ChevronDown className="w-5 h-5 text-[#5B54E8]" />}
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800 p-3 bg-[#FBFAF7] dark:bg-[#090D16]">
                          {unit.lectures.map((lec) => {
                            const isDone = completedLectures.includes(lec._id);
                            return (
                              <div
                                key={lec._id || lec.title}
                                className="p-3 rounded-2xl flex items-center justify-between text-xs font-semibold hover:bg-white dark:hover:bg-slate-900 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-[#2FA876] shrink-0" />
                                  ) : (
                                    <PlayCircle className="w-4 h-4 text-[#5B54E8] shrink-0" />
                                  )}
                                  <span className={isDone ? 'line-through text-slate-400 font-medium' : 'text-[#2B2B38] dark:text-white font-bold'}>
                                    {lec.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] text-slate-400 font-bold">{lec.duration}</span>
                                  <Link
                                    to={`/learning/${course._id}`}
                                    className="px-3 py-1 rounded-xl bg-[#5B54E8]/10 text-[#5B54E8] font-black text-[10px] hover:bg-[#5B54E8]/20 transition-colors"
                                  >
                                    Play
                                  </Link>
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
                <div className="text-xs font-bold text-slate-400 py-4">No recorded units available.</div>
              )}
            </div>

          </div>
        )}

        {/* LIVE TAB SECTION */}
        {activeTab === 'live' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-[#2B2B38] dark:text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#FF7A59] animate-pulse" /> Scheduled Live Masterclasses
            </h2>

            {/* FLAT HORIZONTAL SCROLLABLE ROW OF LIVE SESSION CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveSessions.map((session) => {
                const isLiveNow = session.status === 'live';
                const isCompleted = session.status === 'completed';

                return (
                  <div
                    key={session.id}
                    className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        {isLiveNow ? (
                          <span className="px-3 py-1 rounded-full bg-[#FF7A59] text-white text-[10px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
                            🔴 LIVE NOW
                          </span>
                        ) : isCompleted ? (
                          <span className="px-3 py-1 rounded-full bg-[#2FA876]/10 text-[#2FA876] text-[10px] font-black uppercase tracking-wider">
                            ✓ Completed
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-[#5B54E8]/10 text-[#5B54E8] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Upcoming
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-base text-[#2B2B38] dark:text-white">{session.title}</h3>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#5B54E8]" />
                        <span>{new Date(session.startTime).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      {isLiveNow ? (
                        <a
                          href={session.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-visual bg-[#FF7A59] hover:bg-[#E56848] text-white w-full text-xs font-black py-2.5 rounded-2xl flex items-center justify-center gap-2 shadow-md"
                        >
                          <ExternalLink className="w-4 h-4" /> Join Live Masterclass
                        </a>
                      ) : isCompleted ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold text-center"
                        >
                          Recording Unavailable
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold text-center cursor-not-allowed"
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
