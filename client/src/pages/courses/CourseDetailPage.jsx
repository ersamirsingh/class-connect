import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseApi } from '../../api/models/course.api';
import { Navbar } from '../../components/guest/Navbar';
import { Footer } from '../../components/guest/Footer';
import {
  PlayCircle,
  Star,
  CheckCircle2,
  Lock,
  Clock,
  BookOpen,
  Award,
  Video,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
  ShoppingBag,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CourseDetailPage = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({ 0: true });
  const [playingVideo, setPlayingVideo] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await courseApi.getCourseByIdOrSlug(idOrSlug);
        if (res.success && res.data) {
          setCourse(res.data);
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [idOrSlug]);

  const toggleSection = (idx) => {
    setExpandedSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#3730E0] animate-spin mb-3" />
          <span className="text-xs font-bold text-slate-500">Loading course...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-[#1E1E2E]">Course Not Found</h2>
          <Link to="/courses" className="btn-visual btn-primary text-xs mt-4 inline-flex">
            Back to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Video Preview & Curriculum */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#3730E0]/10 text-[#3730E0] text-xs font-extrabold uppercase">
                  {course.category?.name || 'Course'}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase text-white ${
                    course.type === 'live' ? 'bg-[#FF7A33]' : 'bg-[#1FAE64]'
                  }`}
                >
                  {course.type === 'live' ? '⚡ Live Class' : '📹 Recorded'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-[#1E1E2E] leading-tight">{course.title}</h1>
              <p className="text-sm font-medium text-slate-600">{course.subtitle || course.description}</p>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-500 pt-1">
                <div className="flex items-center gap-1 text-[#F5A623]">
                  <Star className="w-4 h-4 fill-[#F5A623]" />
                  <span>{course.rating || 4.9}</span>
                  <span className="text-slate-400">({course.ratingCount || 120} reviews)</span>
                </div>
                <div>•</div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#1FAE64]" /> Completion Certificate
                </div>
              </div>
            </div>

            {/* Video Player Card */}
            <div className="card-visual overflow-hidden relative bg-black">
              {playingVideo ? (
                <video src={course.previewVideo} controls autoPlay className="w-full h-80 sm:h-96 object-cover" />
              ) : (
                <div className="relative h-80 sm:h-96">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80" />
                  <button
                    onClick={() => setPlayingVideo(true)}
                    className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-[#FF7A33] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                  >
                    <PlayCircle className="w-10 h-10 fill-white text-[#FF7A33]" />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#FF7A33]" /> Preview Free Lesson
                  </div>
                </div>
              )}
            </div>

            {/* Visual Curriculum Section */}
            <div className="card-visual p-6 space-y-4">
              <h3 className="text-xl font-black text-[#1E1E2E] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#3730E0]" /> Course Curriculum
              </h3>

              {course.sections && course.sections.length > 0 ? (
                <div className="space-y-3">
                  {course.sections.map((section, idx) => (
                    <div key={section._id || idx} className="border border-slate-100 rounded-2xl overflow-hidden">
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(idx)}
                        className="w-full bg-[#F7F8FC] p-4 flex items-center justify-between font-bold text-xs sm:text-sm text-[#1E1E2E] hover:bg-slate-100/70 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#3730E0] text-white flex items-center justify-center text-xs font-black">
                            {idx + 1}
                          </span>
                          <span>{section.title}</span>
                        </div>
                        {expandedSections[idx] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {/* Lectures List */}
                      {expandedSections[idx] && (
                        <div className="divide-y divide-slate-100 p-2 bg-white">
                          {section.lectures.map((lec, lIdx) => (
                            <div key={lec._id || lIdx} className="p-3 flex items-center justify-between text-xs font-medium">
                              <div className="flex items-center gap-2.5">
                                {lec.isPreview ? (
                                  <PlayCircle className="w-4 h-4 text-[#FF7A33] shrink-0" />
                                ) : (
                                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                                <span className={lec.isPreview ? 'font-bold text-[#1E1E2E]' : 'text-slate-600'}>
                                  {lec.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                                <span>{lec.duration || '10 mins'}</span>
                                {lec.isPreview && (
                                  <span className="px-2 py-0.5 rounded-full bg-[#FF7A33]/10 text-[#FF7A33] font-bold text-[10px]">
                                    Free Preview
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs font-bold text-slate-400">Curriculum details available upon enrollment.</div>
              )}
            </div>
          </div>

          {/* Right Column: Pricing & Instructor Box */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            {/* Price Buy Card */}
            <div className="card-visual p-6 space-y-6 border-2 border-[#3730E0]/20 shadow-xl">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase">Course Fee</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-[#3730E0]">${course.discountPrice || course.price}</span>
                  {course.discountPrice && (
                    <span className="text-sm font-bold text-slate-400 line-through">${course.price}</span>
                  )}
                </div>
              </div>

              <Link
                to={`/checkout/${course._id}`}
                className="btn-visual btn-primary w-full text-sm font-black shadow-lg shadow-[#3730E0]/30 py-3.5"
              >
                <ShoppingBag className="w-5 h-5" /> Buy Course Now
              </Link>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1FAE64]" /> Full Lifetime Access
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1FAE64]" /> Access on Mobile & Desktop
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1FAE64]" /> Certificate of Completion
                </div>
              </div>
            </div>

            {/* Instructor Card */}
            <div className="card-visual p-5 space-y-3">
              <div className="text-xs font-extrabold uppercase text-slate-400">Course Instructor</div>
              <div className="flex items-center gap-3">
                <img
                  src={course.instructor?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                  alt={course.instructor?.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#3730E0]"
                />
                <div>
                  <div className="text-sm font-extrabold text-[#1E1E2E]">{course.instructor?.name || 'ClassConnect'}</div>
                  <div className="text-xs font-bold text-slate-500">{course.instructor?.title || 'Senior Instructor'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
