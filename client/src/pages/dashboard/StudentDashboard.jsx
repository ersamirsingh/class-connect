import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { enrollmentApi } from '../../api/models/enrollment.api';
import {
  PlayCircle,
  BookOpen,
  Award,
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  Radio,
  Loader2,
  Video,
  Calendar,
  Layers,
  ChevronRight,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const StudentDashboard = () => {
  const { user } = useAuth();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await enrollmentApi.getMyEnrollments();
        if (res.success && res.data) {
          setEnrollments(res.data);
        }
      } catch (err) {
        console.error('Failed to load enrolled courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.isCompleted).length;
  const avgProgress = totalCourses > 0 
    ? Math.round(enrollments.reduce((acc, curr) => acc + (curr.progressPercent || 0), 0) / totalCourses) 
    : 0;

  const liveClassItem = enrollments.find((e) => e.isLiveNow);

  return (
    <div className="space-y-8">
      
      {/* WELCOME HERO CARD WITH OVERALL PROGRESS BAR */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#5B51D8] via-[#4B41C8] to-[#3B82F6] p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
              <Sparkles className="w-4 h-4 text-[#FF6B00]" /> Student Dashboard
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">
              Welcome back, {user?.name || 'Learner'}! 👋
            </h1>
            <p className="text-xs text-white/80 font-medium">
              You are enrolled in <strong className="text-white font-bold">{totalCourses} program(s)</strong>. Keep up the learning momentum!
            </p>
          </div>

          {enrollments.length > 0 && (
            <Link
              to={`/learning/${enrollments[0].course?._id}`}
              className="btn-visual bg-[#FF6B00] text-white hover:bg-[#E56000] text-xs font-black px-6 py-3 shadow-lg shrink-0"
            >
              <PlayCircle className="w-5 h-5" /> Resume Learning
            </Link>
          )}
        </div>

        {/* Overall Completion Progress Bar */}
        <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-2 relative z-10">
          <div className="flex justify-between items-center text-xs font-bold">
            <span>Overall Curriculum Completion</span>
            <span className="text-[#FF6B00] font-black">{avgProgress}% Completed</span>
          </div>
          <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF6B00] to-[#10B981] rounded-full transition-all duration-500"
              style={{ width: `${avgProgress}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* UPCOMING LIVE EVENTS WIDGET */}
      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#FF6B00] animate-pulse" />
            <h2 className="text-lg font-black text-[#0F172A] dark:text-white">Upcoming Live Classes & Workshops</h2>
          </div>
          <span className="text-xs font-bold text-slate-400">Scheduled Today</span>
        </div>

        {liveClassItem ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#E56000] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider inline-block mb-1">
                🔴 Live Room Active
              </span>
              <h3 className="font-extrabold text-base">{liveClassItem.course?.title}</h3>
              <p className="text-xs text-white/80">Instructor: {liveClassItem.course?.instructor?.name || 'ClassConnect Lead'}</p>
            </div>
            <a
              href={liveClassItem.course?.liveSchedule?.meetingUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="btn-visual bg-white text-[#FF6B00] hover:bg-slate-50 text-xs font-black px-5 py-2.5 shadow-md shrink-0"
            >
              <Video className="w-4 h-4" /> Join Live Zoom Room
            </a>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#5B51D8]" />
              <span>Next live Q&A masterclass scheduled for <strong>Tomorrow at 7:00 PM IST</strong></span>
            </div>
            <span className="text-[#5B51D8] font-bold">Reminder Set</span>
          </div>
        )}
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card-visual p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#5B51D8]/10 text-[#5B51D8] flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0F172A] dark:text-white">{totalCourses}</div>
            <div className="text-xs font-extrabold text-slate-400">Enrolled Programs</div>
          </div>
        </div>

        <div className="card-visual p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0F172A] dark:text-white">{totalCourses * 8}h</div>
            <div className="text-xs font-extrabold text-slate-400">Learning Watch Time</div>
          </div>
        </div>

        <div className="card-visual p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0F172A] dark:text-white">{completedCourses}</div>
            <div className="text-xs font-extrabold text-slate-400">Certificates Earned</div>
          </div>
        </div>
      </div>

      {/* IN-PROGRESS COURSES CARDS */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-[#0F172A] dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#5B51D8]" /> In-Progress Courses
          </h2>
          <Link to="/courses" className="text-xs font-extrabold text-[#5B51D8] hover:underline flex items-center gap-1">
            Browse All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-[#5B51D8] animate-spin mb-2" />
            <span className="text-xs font-bold text-slate-500">Loading learning tracks...</span>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="card-visual p-8 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-800 dark:text-white">No active program enrollments</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Explore the course catalog to start learning with live mentorship.</p>
            <Link to="/courses" className="btn-visual btn-primary text-xs mt-2 inline-flex">
              Explore Course Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((item) => (
              <div key={item.enrollmentId} className="card-visual p-6 space-y-4 flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  <img
                    src={item.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=300'}
                    alt={item.course?.title}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#5B51D8]/10 text-[#5B51D8] text-[10px] font-black uppercase">
                      {item.course?.category?.name || 'Bootcamp Track'}
                    </span>
                    <h3 className="font-extrabold text-base text-[#0F172A] dark:text-white line-clamp-2 leading-snug">{item.course?.title}</h3>
                  </div>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>Course Progress</span>
                    <span className="text-[#5B51D8] font-black">{item.progressPercent}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#5B51D8] to-[#FF6B00] rounded-full transition-all duration-500"
                      style={{ width: `${item.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  {item.isCompleted ? (
                    <Link
                      to={`/certificate/${item.course?._id}`}
                      className="btn-visual bg-[#10B981]/10 text-[#10B981] text-xs font-black px-4 py-2"
                    >
                      <Award className="w-4 h-4" /> View Certificate
                    </Link>
                  ) : (
                    <Link
                      to={`/learning/${item.course?._id}`}
                      className="btn-visual btn-primary text-xs px-4 py-2"
                    >
                      <PlayCircle className="w-4 h-4" /> Resume Learning
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
