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
  const liveClassItem = enrollments.find((e) => e.isLiveNow);

  return (
    <div className="space-[#F7F8FC] space-y-6">
      {/* Welcome Visual Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#3730E0] to-[#2B24C7] p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
            <Sparkles className="w-4 h-4 text-[#FF7A33]" /> Visual Student Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-xs text-white/80 max-w-lg font-medium">
            You have <strong className="text-white font-bold">{totalCourses} active course(s)</strong> in your learning dashboard.
          </p>
        </div>

        {enrollments.length > 0 && (
          <div className="flex items-center gap-3 z-10 shrink-0">
            <Link
              to={`/learning/${enrollments[0].course?._id}`}
              className="btn-visual bg-[#FF7A33] text-white hover:bg-[#E8631C] text-xs font-extrabold shadow-lg"
            >
              <PlayCircle className="w-5 h-5" /> Resume Learning
            </Link>
          </div>
        )}
      </motion.div>

      {/* Live Class Active Notification */}
      {liveClassItem && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-[#FF7A33] to-[#E8631C] text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase inline-block mb-1">
                🔴 Live Now
              </div>
              <h3 className="font-extrabold text-base">{liveClassItem.course?.title}</h3>
            </div>
          </div>
          <a
            href={liveClassItem.course?.liveSchedule?.meetingUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="btn-visual bg-white text-[#FF7A33] hover:bg-slate-50 text-xs font-extrabold px-5 py-2.5 shadow-md shrink-0"
          >
            <Video className="w-4 h-4" /> Join Live Room
          </a>
        </div>
      )}

      {/* Quick Visual Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-visual p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#3730E0]/10 text-[#3730E0] flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#1E1E2E]">{totalCourses}</div>
            <div className="text-xs font-bold text-slate-500">Enrolled Courses</div>
          </div>
        </div>

        <div className="card-visual p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF7A33]/10 text-[#FF7A33] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#1E1E2E]">{totalCourses * 4}h</div>
            <div className="text-xs font-bold text-slate-500">Total Watch Time</div>
          </div>
        </div>

        <div className="card-visual p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1FAE64]/10 text-[#1FAE64] flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#1E1E2E]">{completedCourses}</div>
            <div className="text-xs font-bold text-slate-500">Certificates Earned</div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Cards */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xl font-black text-[#1E1E2E] flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#3730E0]" /> Continue Your Courses
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#3730E0] animate-spin mb-2" />
            <span className="text-xs font-bold text-slate-500">Loading your courses...</span>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="card-visual p-8 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-700">No active course enrollments yet</h3>
            <p className="text-xs text-slate-500 font-medium">Explore the course catalog to enroll and start learning visually.</p>
            <Link to="/courses" className="btn-visual btn-primary text-xs mt-2 inline-flex">
              Explore Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((item) => (
              <div key={item.enrollmentId} className="card-visual p-6 space-y-4 flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  <img
                    src={item.course?.thumbnail}
                    alt={item.course?.title}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#3730E0]/10 text-[#3730E0] text-[10px] font-black uppercase">
                      {item.course?.category?.name || 'Track'}
                    </span>
                    <h3 className="font-extrabold text-base text-[#1E1E2E] line-clamp-2">{item.course?.title}</h3>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>Course Progress</span>
                    <span className="text-[#3730E0]">{item.progressPercent}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#3730E0] to-[#FF7A33] rounded-full transition-all duration-500"
                      style={{ width: `${item.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  {item.isCompleted ? (
                    <Link
                      to={`/certificate/${item.course?._id}`}
                      className="btn-visual bg-[#1FAE64]/10 text-[#1FAE64] text-xs font-extrabold px-4 py-2"
                    >
                      <Award className="w-4 h-4" /> View Certificate
                    </Link>
                  ) : (
                    <Link
                      to={`/learning/${item.course?._id}`}
                      className="btn-visual btn-primary text-xs px-4 py-2"
                    >
                      <PlayCircle className="w-4 h-4" /> Continue
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
