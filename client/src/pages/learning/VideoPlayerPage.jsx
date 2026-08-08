import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { courseApi } from '../../api/models/course.api';
import { enrollmentApi } from '../../api/models/enrollment.api';
import { CheckCircle2, Circle, ChevronLeft, Menu, X, PlayCircle, BookOpen } from 'lucide-react';
import { CustomVideoPlayer } from '../../components/video/CustomVideoPlayer';
import { LiveChatPanel } from '../../components/live/LiveChatPanel';
import { AdminLiveParticipantPanel } from '../../components/live/AdminLiveParticipantPanel';
import { useAuth } from '../../hooks/useAuth';

export function VideoPlayerPage() {
  const { courseId } = useParams();
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [unlockStatus, setUnlockStatus] = useState({ unlockedSections: [0] });

  useEffect(() => {
    async function loadCourse() {
      try {
        const [res, unlockRes] = await Promise.all([
          courseApi.getCourseByIdOrSlug(courseId),
          enrollmentApi.getUnlockStatus(courseId).catch(() => ({ data: { unlockedSections: [0] } })),
        ]);
        const loadedCourse = res?.data;
        setCourse(loadedCourse);
        if (unlockRes && unlockRes.data) {
          setUnlockStatus(unlockRes.data);
        }

        // Find first lecture across sections or lectures array
        if (loadedCourse) {
          const allLectures = loadedCourse.sections && loadedCourse.sections.length > 0
            ? loadedCourse.sections.flatMap(s => s.lectures || [])
            : (loadedCourse.lectures || []);

          if (allLectures.length > 0) {
            setCurrentLecture(allLectures[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [courseId]);

  const handleMarkComplete = async () => {
    if (!currentLecture || !course) return;
    const lectureId = currentLecture._id || currentLecture.id || currentLecture.title;
    try {
      await enrollmentApi.markComplete(courseId, lectureId);
      
      // Update local state to reflect completion
      setCourse(prev => {
        if (!prev) return prev;
        const updatedSections = (prev.sections || []).map(section => ({
          ...section,
          lectures: (section.lectures || []).map(l => 
            (l._id || l.id || l.title) === lectureId ? { ...l, completed: true } : l
          )
        }));
        return { ...prev, sections: updatedSections };
      });
      setCurrentLecture(prev => prev ? { ...prev, completed: true } : prev);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[var(--canvas)] flex items-center justify-center text-[var(--ink)] font-sans">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <span className="font-bold text-sm">Loading course video player...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="h-screen bg-[var(--canvas)] flex flex-col items-center justify-center text-[var(--ink)] gap-4 font-sans">
        <p className="text-lg font-bold">Course not found.</p>
        <button onClick={() => navigate('/dashboard')} className="px-5 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-full">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const allLecturesList = course.sections && course.sections.length > 0
    ? course.sections.flatMap(s => s.lectures || [])
    : (course.lectures || []);

  const liveSessionId = course._id || courseId;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[var(--canvas)] text-[var(--ink)] overflow-hidden font-sans">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Header */}
        <header className="h-16 shrink-0 bg-[var(--surface)] border-b border-[var(--border)] flex items-center px-4 md:px-6 justify-between z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="p-2 hover:bg-[var(--canvas)] rounded-full transition-colors min-h-[44px] cursor-pointer"
              title="Back to Dashboard"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--ink)]" />
            </button>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[var(--primary)] tracking-wider">Course Player</span>
              <h1 className="font-extrabold text-sm sm:text-base font-manrope text-[var(--ink)] truncate max-w-md sm:max-w-xl">{course.title}</h1>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="lg:hidden p-2 hover:bg-[var(--canvas)] rounded-xl min-h-[44px] cursor-pointer border border-[var(--border)] flex items-center gap-1.5 text-xs font-bold"
          >
            <Menu className="w-4 h-4 text-[var(--primary)]" />
            <span>Modules</span>
          </button>
        </header>

        {/* Video Player & Info Area */}
        <div className="flex-1 p-4 md:p-6 flex flex-col max-w-4xl mx-auto w-full space-y-6">
          
          {/* CUSTOM VIDEO PLAYER */}
          <div className="w-full max-w-4xl mx-auto shadow-xl rounded-2xl overflow-hidden border border-[var(--border)]">
            <CustomVideoPlayer 
              src={currentLecture?.videoUrl} 
              title={currentLecture?.title || course.title}
              poster={course.thumbnail}
              onEnded={handleMarkComplete}
            />
          </div>

          {/* Lecture Info Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--border)] pb-6">
            <div>
              <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
                Lesson: {currentLecture?.title || 'Overview'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold font-manrope mt-0.5 text-[var(--ink)]">
                {currentLecture?.title || 'Welcome to the Course'}
              </h2>
            </div>
            
            <button 
              onClick={handleMarkComplete}
              className={`px-6 py-2.5 min-h-[44px] rounded-full font-extrabold text-xs transition-all flex items-center gap-2 shadow-sm cursor-pointer ${
                currentLecture?.completed 
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                  : 'bg-[var(--primary)] text-white hover:bg-[var(--deep-anchor,#24216F)]'
              }`}
            >
              <CheckCircle2 className="w-4.5 h-4.5" />
              <span>{currentLecture?.completed ? 'Completed ✓' : (t('mark_complete') || 'Mark Complete')}</span>
            </button>
          </div>

          {/* REAL-TIME LIVE CLASS CHAT & ADMIN MODERATION PANEL (RESTRICTED TO LIVE SESSIONS ONLY) */}
          {course.type === 'live' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7">
                <LiveChatPanel liveSessionId={liveSessionId} />
              </div>
              {isAdmin && (
                <div className="md:col-span-5">
                  <AdminLiveParticipantPanel liveSessionId={liveSessionId} />
                </div>
              )}
            </div>
          )}

          {/* Description & Resources */}
          <div className="prose max-w-none text-sm text-[var(--ink-muted)] leading-relaxed space-y-3 pb-10">
            <h3 className="text-sm font-bold text-[var(--ink)] uppercase tracking-wider">Lecture Overview & Resources</h3>
            <p>{currentLecture?.description || 'No additional description provided for this lecture.'}</p>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex w-80 shrink-0 bg-[var(--surface)] border-l border-[var(--border)] flex-col h-full z-10">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--canvas)] flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm font-manrope text-[var(--ink)]">Course Content</h3>
            <p className="text-[10px] text-[var(--ink-muted)] font-medium">{allLecturesList.length} Lectures Total</p>
          </div>
          <BookOpen className="w-4 h-4 text-[var(--primary)]" />
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {course.sections && course.sections.length > 0 ? (
            course.sections.map((section, sIdx) => {
              const isSecUnlocked = course.type === 'live' || sIdx === 0 || (unlockStatus.unlockedSections && unlockStatus.unlockedSections.includes(sIdx));
              const prevSecTitle = course.sections[sIdx - 1]?.title || 'previous topic';

              return (
                <div key={section._id || sIdx} className="space-y-1 mb-3">
                  <div className="px-3 py-1.5 text-[11px] font-black uppercase text-[var(--ink-muted)] tracking-wider flex items-center justify-between">
                    <span>{section.title}</span>
                    {!isSecUnlocked && <span className="text-[10px] text-amber-600 font-extrabold lowercase">🔒 locked</span>}
                  </div>
                  {(section.lectures || []).map((lecture, lIdx) => {
                    const isSelected = (currentLecture?._id || currentLecture?.id || currentLecture?.title) === (lecture._id || lecture.id || lecture.title);
                    return (
                      <button 
                        key={lecture._id || lIdx}
                        disabled={!isSecUnlocked}
                        onClick={() => {
                          if (isSecUnlocked) {
                            setCurrentLecture(lecture);
                          }
                        }}
                        title={!isSecUnlocked ? `Complete all lectures in "${prevSecTitle}" to unlock` : ''}
                        className={`w-full text-left p-3 rounded-xl min-h-[44px] flex items-center gap-3 transition-all ${
                          !isSecUnlocked 
                            ? 'opacity-50 bg-slate-100 dark:bg-slate-900 cursor-not-allowed text-slate-400'
                            : isSelected 
                              ? 'bg-[var(--primary-soft)] border border-[var(--primary)] text-[var(--primary)] cursor-pointer' 
                              : 'hover:bg-[var(--canvas)] text-[var(--ink)] cursor-pointer'
                        }`}
                      >
                        <div className="shrink-0 text-[var(--primary)]">
                          {!isSecUnlocked ? (
                            <span className="text-xs">🔒</span>
                          ) : lecture.completed ? (
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                          ) : (
                            <PlayCircle className="w-4.5 h-4.5 text-[var(--ink-muted)]" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-extrabold text-xs line-clamp-1">{lecture.title}</div>
                          <div className="text-[10px] text-[var(--ink-muted)] font-mono">
                            {!isSecUnlocked ? `Locked (Complete ${prevSecTitle})` : (lecture.duration || '10 mins')}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })
          ) : (
            allLecturesList.map((lecture, idx) => {
              const isSelected = (currentLecture?._id || currentLecture?.id || currentLecture?.title) === (lecture._id || lecture.id || lecture.title);
              return (
                <button 
                  key={lecture._id || idx}
                  onClick={() => setCurrentLecture(lecture)}
                  className={`w-full text-left p-3 rounded-xl min-h-[44px] flex items-center gap-3 transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[var(--primary-soft)] border border-[var(--primary)] text-[var(--primary)]' 
                      : 'hover:bg-[var(--canvas)] text-[var(--ink)]'
                  }`}
                >
                  <div className="shrink-0 text-[var(--primary)]">
                    {lecture.completed ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                    ) : (
                      <PlayCircle className="w-4.5 h-4.5 text-[var(--ink-muted)]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-xs line-clamp-1">{lecture.title}</div>
                    <div className="text-[10px] text-[var(--ink-muted)] font-mono">{lecture.duration || '10 mins'}</div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Sidebar - Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-80 bg-[var(--surface)] shadow-2xl z-50 flex flex-col lg:hidden"
            >
              <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--canvas)]">
                <h3 className="font-extrabold text-sm font-manrope">Course Content</h3>
                <button onClick={() => setSidebarOpen(false)} className="p-2 min-h-[44px] hover:bg-[var(--surface)] rounded-full cursor-pointer">
                  <X className="w-5 h-5 text-[var(--ink)]" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {allLecturesList.map((lecture, idx) => (
                  <button 
                    key={lecture._id || idx}
                    onClick={() => { setCurrentLecture(lecture); setSidebarOpen(false); }}
                    className="w-full text-left p-3 rounded-xl min-h-[44px] flex items-center gap-3 border-b border-[var(--border)] hover:bg-[var(--canvas)] cursor-pointer"
                  >
                    <PlayCircle className="w-4.5 h-4.5 text-[var(--primary)] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-extrabold text-xs line-clamp-1">{lecture.title}</div>
                      <div className="text-[10px] text-[var(--ink-muted)] font-mono">{lecture.duration || '10 mins'}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
