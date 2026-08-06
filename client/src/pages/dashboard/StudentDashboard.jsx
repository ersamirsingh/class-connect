import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { enrollmentApi } from '../../api/models/enrollment.api';
import { NumberTicker } from '../../components/motion/NumberTicker';
import { 
  PlayCircle, 
  Award, 
  CreditCard, 
  BookOpen, 
  Clock, 
  User, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { SAMPLE_COURSES } from '../../data/sampleData';

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
        
        if (loaded.length > 0) {
          setEnrollments(loaded);
        } else {
          setEnrollments([
            {
              id: 'enr-1',
              courseId: SAMPLE_COURSES[0]._id,
              course: SAMPLE_COURSES[0],
              progress: 65,
              lastAccessed: '2 hours ago'
            },
            {
              id: 'enr-2',
              courseId: SAMPLE_COURSES[1]._id,
              course: SAMPLE_COURSES[1],
              progress: 90,
              lastAccessed: 'Yesterday'
            }
          ]);
        }
      } catch (error) {
        console.warn('Using sample enrollments fallback:', error);
        setEnrollments([
          {
            id: 'enr-1',
            courseId: SAMPLE_COURSES[0]._id,
            course: SAMPLE_COURSES[0],
            progress: 65,
            lastAccessed: '2 hours ago'
          },
          {
            id: 'enr-2',
            courseId: SAMPLE_COURSES[1]._id,
            course: SAMPLE_COURSES[1],
            progress: 90,
            lastAccessed: 'Yesterday'
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const continueEnrollment = enrollments.find(e => (e.progress || 0) < 100) || enrollments[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBF5] p-8 text-[#000000] flex items-center justify-center font-mono text-sm">
        Loading student command centre...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBF5] p-6 md:p-10 text-[#000000] font-body selection:bg-[#C1FBD4] selection:text-black">
      {/* Header */}
      <header className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#E4E4E7]">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#C1FBD4] text-[#000000] text-xs font-mono font-medium mb-2">
            STUDENT COMMAND CENTRE
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-light text-[#000000] tracking-tight">
            Welcome back, <span className="font-normal">{user?.name || user?.firstName || 'Learner'}</span>
          </h1>
        </div>

        <Link
          to="/profile"
          className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#E4E4E7] hover:border-[#000000] transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-[#000000] text-white flex items-center justify-center font-mono text-xs font-bold">
            {(user?.name || user?.firstName || 'U').charAt(0).toUpperCase()}
          </div>
          <span className="font-mono text-xs text-[#000000]">View Profile</span>
        </Link>
      </header>

      {/* Main Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Continue Learning Spotlight Banner */}
        {continueEnrollment && continueEnrollment.course && (
          <div className="lg:col-span-8 bg-[#000000] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-[#C1FBD4] text-[#000000] text-[10px] font-mono font-medium uppercase tracking-widest">
                  CONTINUE LEARNING TRACK
                </span>
                <span className="font-mono text-xs text-[#A1A1AA]">
                  {continueEnrollment.lastAccessed}
                </span>
              </div>

              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-light text-white leading-tight mb-2">
                  {continueEnrollment.course.title}
                </h2>
                <p className="font-body text-xs text-[#A1A1AA] line-clamp-2">
                  {continueEnrollment.course.subtitle || continueEnrollment.course.description}
                </p>
              </div>

              {/* Progress Line */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between font-mono text-xs text-[#A1A1AA]">
                  <span>Track Completion</span>
                  <span className="text-[#C1FBD4] font-bold">{continueEnrollment.progress || 0}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-[#C1FBD4] rounded-full transition-all duration-500" 
                    style={{ width: `${continueEnrollment.progress || 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 mt-6 border-t border-white/15 flex items-center justify-between">
              <span className="font-mono text-xs text-[#A1A1AA]">
                Next lesson ready to stream
              </span>
              <button
                onClick={() => navigate(`/learning/${continueEnrollment.course._id || continueEnrollment.course.id}`)}
                className="px-6 py-3 rounded-full bg-[#C1FBD4] text-[#000000] font-mono text-xs font-medium hover:bg-[#a3f7be] transition-colors cursor-pointer flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                Resume Lecture
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#E4E4E7]">
            <span className="font-mono text-xs text-[#71717A] uppercase tracking-wider block mb-2">
              ENROLLED TRACKS
            </span>
            <div className="font-display text-4xl font-light text-[#000000] mb-1">
              <NumberTicker value={enrollments.length} />
            </div>
            <p className="font-body text-xs text-[#71717A]">
              Active technical learning tracks in your portfolio
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#D4F9E0] border border-[#E4E4E7]">
            <span className="font-mono text-xs text-[#000000] uppercase tracking-wider block mb-2">
              VERIFIED CERTIFICATES
            </span>
            <div className="font-display text-4xl font-light text-[#000000] mb-1">
              <NumberTicker value={enrollments.filter(e => e.progress === 100).length} />
            </div>
            <p className="font-body text-xs text-[#000000]">
              Credentials ready for resume export
            </p>
          </div>
        </div>

      </div>

      {/* Enrolled Courses Gallery */}
      <section className="mt-12 pt-8 border-t border-[#E4E4E7]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-light text-[#000000]">
            My Learning Tracks
          </h2>
          <Link to="/courses" className="font-mono text-xs text-[#000000] hover:underline flex items-center gap-1">
            Browse More Tracks <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((item) => (
            <div 
              key={item.id || item._id} 
              className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E4E4E7] flex flex-col justify-between space-y-4"
            >
              <div>
                <span className="font-mono text-[10px] text-[#71717A] uppercase tracking-widest block mb-2">
                  {item.course?.category?.name || 'LEARNING TRACK'}
                </span>
                <h3 className="font-display text-xl font-medium text-[#000000] line-clamp-2">
                  {item.course?.title}
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-mono text-[11px] text-[#71717A]">
                  <span>Progress</span>
                  <span className="font-bold text-[#000000]">{item.progress || 0}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#FBFBF5] overflow-hidden border border-[#E4E4E7]">
                  <div 
                    className="h-full bg-[#000000] rounded-full" 
                    style={{ width: `${item.progress || 0}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => navigate(`/learning/${item.course?._id || item.course?.id}`)}
                className="w-full py-2.5 rounded-full bg-[#000000] text-white font-mono text-xs hover:bg-[#27272A] transition-colors cursor-pointer"
              >
                Go to Player →
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default StudentDashboard;
