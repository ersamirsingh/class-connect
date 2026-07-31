import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseApi } from '../../api/models/course.api';
import { enrollmentApi } from '../../api/models/enrollment.api';
import {
  PlayCircle,
  CheckCircle2,
  Lock,
  FileText,
  Award,
  ArrowLeft,
  Loader2,
  Download,
  BookOpen,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const VideoPlayerPage = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [activeLecture, setActiveLecture] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [activeTab, setActiveTab] = useState('curriculum'); // 'curriculum' | 'resources'

  useEffect(() => {
    const initLearningRoom = async () => {
      try {
        setLoading(true);
        const [courseRes, enrollRes] = await Promise.all([
          courseApi.getCourseByIdOrSlug(courseId),
          enrollmentApi.getMyEnrollments(),
        ]);

        if (courseRes.success && courseRes.data) {
          setCourse(courseRes.data);
          const firstLec = courseRes.data.sections?.[0]?.lectures?.[0];
          if (firstLec) setActiveLecture(firstLec);
        }

        if (enrollRes.success && enrollRes.data) {
          const myCourseEnrollment = enrollRes.data.find(
            (e) => e.course?._id === courseId || e.course?.slug === courseId
          );
          if (myCourseEnrollment) {
            // Fetch progress info if available
          }
        }
      } catch (err) {
        console.error('Failed to initialize learning room:', err);
      } finally {
        setLoading(false);
      }
    };
    initLearningRoom();
  }, [courseId]);

  const handleMarkComplete = async () => {
    if (!activeLecture || !course) return;

    try {
      setMarking(true);
      const lecId = activeLecture._id || activeLecture.title;
      await enrollmentApi.markComplete(course._id, lecId);
      if (!completedLectures.includes(lecId)) {
        setCompletedLectures((prev) => [...prev, lecId]);
      }
    } catch (err) {
      console.error('Failed to mark complete:', err);
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FC]">
        <Loader2 className="w-10 h-10 text-[#3730E0] animate-spin mb-3" />
        <span className="text-xs font-bold text-slate-500">Loading learning room...</span>
      </div>
    );
  }

  const isCurrentCompleted =
    activeLecture && completedLectures.includes(activeLecture._id || activeLecture.title);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col">
      {/* Top Learning Room Header */}
      <header className="bg-[#1E293B] border-b border-slate-800 px-6 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg line-clamp-1">{course?.title}</h1>
            <span className="text-xs text-slate-400 font-medium">Visual Learning Classroom</span>
          </div>
        </div>

        {course && (
          <Link
            to={`/certificate/${course._id}`}
            className="btn-visual bg-[#1FAE64] text-white hover:bg-[#1FAE64]/90 text-xs font-extrabold px-4 py-2"
          >
            <Award className="w-4 h-4" /> Certificate
          </Link>
        )}
      </header>

      {/* Main Classroom Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Player Area */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
          {/* Main Video Screen */}
          <div className="card-visual bg-black rounded-3xl overflow-hidden shadow-2xl relative">
            {activeLecture?.videoUrl ? (
              <video
                src={activeLecture.videoUrl}
                controls
                autoPlay
                className="w-full h-80 sm:h-[450px] object-cover"
              />
            ) : (
              <div className="h-80 sm:h-[450px] flex items-center justify-center text-slate-500 font-bold">
                Select a lecture to start playing
              </div>
            )}
          </div>

          {/* Active Lecture Control Card */}
          <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-[#FF7A33] uppercase">Now Playing</div>
              <h2 className="text-xl font-black text-white mt-0.5">{activeLecture?.title || 'Lecture Video'}</h2>
              <span className="text-xs font-medium text-slate-400">Duration: {activeLecture?.duration || '10 mins'}</span>
            </div>

            <button
              onClick={handleMarkComplete}
              disabled={marking || isCurrentCompleted}
              className={`btn-visual text-xs font-extrabold px-6 py-3 shadow-lg ${
                isCurrentCompleted
                  ? 'bg-[#1FAE64]/20 text-[#1FAE64] border border-[#1FAE64]/40'
                  : 'btn-primary'
              }`}
            >
              {isCurrentCompleted ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#1FAE64]" /> Completed
                </>
              ) : marking ? (
                <span>Marking...</span>
              ) : (
                <>
                  <Check className="w-5 h-5" /> Mark as Completed
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Sidebar Curriculum & Resources */}
        <div className="w-full lg:w-96 bg-[#1E293B] border-l border-slate-800 flex flex-col shrink-0">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`flex-1 py-3 text-center transition-colors ${
                activeTab === 'curriculum'
                  ? 'border-b-2 border-[#3730E0] text-[#3730E0]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex-1 py-3 text-center transition-colors ${
                activeTab === 'resources'
                  ? 'border-b-2 border-[#3730E0] text-[#3730E0]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Resources
            </button>
          </div>

          {/* Curriculum List */}
          {activeTab === 'curriculum' ? (
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {course?.sections?.map((sec, sIdx) => (
                <div key={sec._id || sIdx} className="space-y-2">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    {sec.title}
                  </div>
                  <div className="space-y-1.5">
                    {sec.lectures?.map((lec, lIdx) => {
                      const isSelected = activeLecture?._id === lec._id || activeLecture?.title === lec.title;
                      const isDone = completedLectures.includes(lec._id || lec.title);
                      return (
                        <div
                          key={lec._id || lIdx}
                          onClick={() => setActiveLecture(lec)}
                          className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-[#3730E0] text-white shadow-md'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-[#1FAE64] shrink-0" />
                            ) : (
                              <PlayCircle className="w-4 h-4 text-[#FF7A33] shrink-0" />
                            )}
                            <span className="line-clamp-1">{lec.title}</span>
                          </div>
                          <span className="text-[10px] opacity-70">{lec.duration || '10m'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Resources Tab */
            <div className="p-4 space-y-3 flex-1">
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF7A33]/20 text-[#FF7A33] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Course CheatSheet.pdf</div>
                    <div className="text-[10px] text-slate-400">2.4 MB • PDF Document</div>
                  </div>
                </div>
                <button className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
