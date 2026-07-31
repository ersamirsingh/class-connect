import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { courseApi } from '../../api/models/course.api';
import { enrollmentApi } from '../../api/models/enrollment.api';
import { CheckCircle2, Circle, ChevronLeft, Menu, X, Play } from 'lucide-react';

export function VideoPlayerPage() {
  const { courseId } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await courseApi.getCourseByIdOrSlug(courseId);
        setCourse(res?.data);
        if (res?.data?.lectures?.length > 0) {
          setCurrentLecture(res.data.lectures[0]);
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
    if (!currentLecture) return;
    try {
      await enrollmentApi.markComplete(courseId, currentLecture.id);
      // Update local state to reflect completion
      setCourse(prev => {
        if(!prev) return prev;
        const newLectures = prev.lectures.map(l => l.id === currentLecture.id ? { ...l, completed: true } : l);
        return { ...prev, lectures: newLectures };
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="h-screen bg-[var(--canvas)] flex items-center justify-center text-[var(--ink)]">Loading...</div>;
  if (!course) return <div className="h-screen bg-[var(--canvas)] flex items-center justify-center text-[var(--ink)]">Course not found</div>;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[var(--canvas)] text-[var(--ink)] overflow-hidden">
      
      {/* Main Content area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Header */}
        <header className="h-16 shrink-0 bg-[var(--surface)] border-b border-[var(--border)] flex items-center px-4 justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-[var(--canvas)] rounded-full transition-colors min-h-[44px]">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold truncate hidden sm:block">{course.title}</h1>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-[var(--canvas)] rounded-lg min-h-[44px]">
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Video Area */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col max-w-6xl mx-auto w-full">
          <div className="aspect-video bg-black rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-md)] mb-6 flex items-center justify-center relative">
            {currentLecture?.videoUrl ? (
              <video src={currentLecture.videoUrl} controls className="w-full h-full" />
            ) : (
              <div className="text-white/50 flex flex-col items-center">
                <Play className="w-12 h-12 mb-2" />
                <span>Video content here</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold font-['Manrope']">{currentLecture?.title || 'Lecture Title'}</h2>
            <button 
              onClick={handleMarkComplete}
              className="px-6 py-2.5 min-h-[44px] bg-[var(--success)] text-white font-medium rounded-[var(--radius-pill)] hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              {t('mark_complete') || 'Mark Complete'}
            </button>
          </div>

          <div className="prose max-w-none text-[var(--ink-muted)] pb-10">
            <p>{currentLecture?.description || 'No description provided for this lecture.'}</p>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex w-80 shrink-0 bg-[var(--surface)] border-l border-[var(--border)] flex-col h-full z-10">
        <div className="p-4 border-b border-[var(--border)]">
          <h3 className="font-bold font-['Manrope']">Course Content</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {course.lectures?.map((lecture, idx) => (
            <button 
              key={lecture.id}
              onClick={() => setCurrentLecture(lecture)}
              className={`w-full text-left p-4 min-h-[44px] flex gap-3 border-b border-[var(--border)] transition-colors hover:bg-[var(--canvas)] ${currentLecture?.id === lecture.id ? 'bg-[var(--aura-blue)]/50' : ''}`}
            >
              <div className="shrink-0 mt-0.5 text-[var(--primary)]">
                {lecture.completed ? <CheckCircle2 className="w-5 h-5 text-[var(--success)]" /> : <Circle className="w-5 h-5 text-[var(--ink-muted)]" />}
              </div>
              <div>
                <div className="text-xs text-[var(--ink-muted)] mb-1">Lesson {idx + 1}</div>
                <div className="font-medium text-sm line-clamp-2">{lecture.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar - Mobile Modal */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-80 bg-[var(--surface)] shadow-2xl z-50 flex flex-col lg:hidden"
            >
              <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
                <h3 className="font-bold font-['Manrope']">Course Content</h3>
                <button onClick={() => setSidebarOpen(false)} className="p-2 min-h-[44px] hover:bg-[var(--canvas)] rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {course.lectures?.map((lecture, idx) => (
                  <button 
                    key={lecture.id}
                    onClick={() => { setCurrentLecture(lecture); setSidebarOpen(false); }}
                    className={`w-full text-left p-4 min-h-[44px] flex gap-3 border-b border-[var(--border)] transition-colors hover:bg-[var(--canvas)] ${currentLecture?.id === lecture.id ? 'bg-[var(--aura-blue)]/50' : ''}`}
                  >
                    <div className="shrink-0 mt-0.5 text-[var(--primary)]">
                      {lecture.completed ? <CheckCircle2 className="w-5 h-5 text-[var(--success)]" /> : <Circle className="w-5 h-5 text-[var(--ink-muted)]" />}
                    </div>
                    <div>
                      <div className="text-xs text-[var(--ink-muted)] mb-1">Lesson {idx + 1}</div>
                      <div className="font-medium text-sm line-clamp-2">{lecture.title}</div>
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
