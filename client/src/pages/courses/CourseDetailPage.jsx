import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseApi } from '../../api/models/course.api';
import { Navbar } from '../../components/guest/Navbar';
import { Footer } from '../../components/guest/Footer';
import { CourseReviewsSection } from '../../components/courses/CourseReviewsSection';
import {
  PlayCircle,
  Star,
  CheckCircle2,
  Lock,
  Clock,
  BookOpen,
  Award,
  Video,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
  ShoppingBag,
  CreditCard,
  HelpCircle,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  Calendar,
  Eye,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CourseDetailPage = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('curriculum');
  const [expandedSections, setExpandedSections] = useState({ 0: true });
  const [playingVideo, setPlayingVideo] = useState(false);
  const [demoLecture, setDemoLecture] = useState(null); // For demo video modal

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

  // Collect all preview lectures for demo access
  const previewLectures = course?.sections?.flatMap((s) =>
    s.lectures.filter((l) => l.isPreview).map((l) => ({ ...l, sectionTitle: s.title }))
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#6366F1] animate-spin mb-3" />
          <span className="text-xs font-bold text-slate-500">Loading program details...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white">Program Not Found</h2>
          <Link to="/courses" className="btn-visual btn-primary text-xs mt-4 inline-flex">
            Back to All Programs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      {/* DEMO VIDEO MODAL */}
      {demoLecture && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#111827] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
              <div>
                <div className="text-[10px] font-black text-[#06B6D4] uppercase tracking-wider">Free Demo Preview</div>
                <h3 className="text-sm font-extrabold text-white">{demoLecture.title}</h3>
              </div>
              <button
                onClick={() => setDemoLecture(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <video
              src={demoLecture.videoUrl}
              controls
              autoPlay
              className="w-full h-80 sm:h-[420px] object-contain bg-black"
            />
            <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Duration: {demoLecture.duration}</span>
              <Link
                to={`/checkout/${course._id}`}
                className="btn-visual btn-primary text-xs px-4 py-2"
              >
                <ShoppingBag className="w-4 h-4" /> Enroll for Full Access
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      {/* HERO BANNER */}
      <section className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E1B4B] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
              <span>/</span>
              <span className="text-[#06B6D4]">{course.category?.name || 'Program'}</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-md ${course.type === 'live' ? 'bg-[#06B6D4]' : 'bg-[#6366F1]'}`}>
                {course.type === 'live' ? '🔴 Live Masterclass' : '📹 Self-Paced'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#10B981] backdrop-blur-md">
                Certified Program
              </span>
              {previewLectures.length > 0 && (
                <button
                  onClick={() => setDemoLecture(previewLectures[0])}
                  className="px-3 py-1 rounded-full bg-[#06B6D4]/20 text-[#06B6D4] text-xs font-extrabold flex items-center gap-1.5 hover:bg-[#06B6D4]/30 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Watch Demo
                </button>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">{course.title}</h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl leading-relaxed">{course.subtitle || course.description}</p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-bold text-slate-300">
              <div className="flex items-center gap-1.5 text-[#F59E0B]">
                <Star className="w-4 h-4 fill-[#F59E0B]" />
                <span className="text-white">{course.rating || 4.9}</span>
                <span className="text-slate-400">({course.reviewsCount || 120} ratings)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#6366F1]" />
                <span>Instructor: {course.instructor?.name || 'ClassConnect Tech Lead'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#06B6D4]">
                <Calendar className="w-4 h-4" /> Enrollment Closes Soon
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN CONTENT & STICKY ENROLL CARD */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* CONTENT TABS */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
              {[
                { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
                { id: 'overview', label: 'Overview', icon: Sparkles },
                { id: 'instructor', label: 'Instructor', icon: Users },
                { id: 'reviews', label: 'Reviews', icon: Star },
                { id: 'faqs', label: 'FAQs', icon: HelpCircle },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
                      activeTab === tab.id
                        ? 'bg-[#6366F1] text-white shadow-md'
                        : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* CURRICULUM TAB */}
            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                {/* Preview Video Card */}
                <div className="card-visual overflow-hidden relative bg-black">
                  {playingVideo ? (
                    <video src={course.previewVideo} controls autoPlay className="w-full h-80 sm:h-96 object-contain bg-black" />
                  ) : (
                    <div className="relative h-80 sm:h-96">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-75" />
                      <button
                        onClick={() => setPlayingVideo(true)}
                        className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-[#6366F1] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                      >
                        <PlayCircle className="w-10 h-10 fill-white text-[#6366F1]" />
                      </button>
                      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2">
                        <Video className="w-4 h-4 text-[#06B6D4]" /> Watch Course Introduction
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-visual p-6 space-y-4">
                  <h3 className="text-xl font-black text-[#0F172A] dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#6366F1]" /> Module Syllabus & Accordions
                  </h3>

                  {course.sections && course.sections.length > 0 ? (
                    <div className="space-y-3">
                      {course.sections.map((section, idx) => (
                        <div key={section._id || idx} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                          <button
                            onClick={() => toggleSection(idx)}
                            className="w-full bg-[#F8FAFC] dark:bg-slate-900 p-4 flex items-center justify-between font-bold text-xs sm:text-sm text-[#0F172A] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-xs font-black">
                                {idx + 1}
                              </span>
                              <span>{section.title}</span>
                            </div>
                            {expandedSections[idx] ? <ChevronUp className="w-4 h-4 text-[#6366F1]" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {expandedSections[idx] && (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800 p-2 bg-white dark:bg-[#111827]">
                              {section.lectures.map((lec, lIdx) => (
                                <div key={lec._id || lIdx} className="p-3 flex items-center justify-between text-xs font-semibold">
                                  <div className="flex items-center gap-3">
                                    {lec.isPreview ? (
                                      <PlayCircle className="w-4 h-4 text-[#06B6D4] shrink-0" />
                                    ) : (
                                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                                    )}
                                    <span className={lec.isPreview ? 'font-bold text-[#0F172A] dark:text-white' : 'text-slate-500'}>
                                      {lec.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                                    <span>{lec.duration || '15 mins'}</span>
                                    {lec.isPreview && (
                                      <button
                                        onClick={() => setDemoLecture(lec)}
                                        className="px-2.5 py-0.5 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] font-black text-[10px] hover:bg-[#06B6D4]/20 transition-colors cursor-pointer flex items-center gap-1"
                                      >
                                        <Eye className="w-3 h-3" /> Watch Demo
                                      </button>
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
                    <div className="text-xs font-bold text-slate-400 py-4">Full syllabus available upon enrollment.</div>
                  )}
                </div>
              </div>
            )}

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="card-visual p-6 space-y-4">
                <h3 className="text-xl font-black text-[#0F172A] dark:text-white">Program Overview</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {course.description || 'This course is engineered with an emphasis on production-ready projects, live mentorship, and ATS resume building to help you transition into top engineering roles.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">100% Practical Project-Driven</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Lifetime Support & Community Access</span>
                  </div>
                </div>
              </div>
            )}

            {/* INSTRUCTOR TAB */}
            {activeTab === 'instructor' && (
              <div className="card-visual p-6 space-y-4">
                <h3 className="text-xl font-black text-[#0F172A] dark:text-white">Lead Instructor</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={course.instructor?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                    alt={course.instructor?.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#6366F1]/20"
                  />
                  <div>
                    <div className="text-base font-extrabold text-[#0F172A] dark:text-white">{course.instructor?.name || 'ClassConnect Technical Mentor'}</div>
                    <div className="text-xs font-bold text-slate-400">{course.instructor?.title || 'Principal Engineer & Educator'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <CourseReviewsSection courseId={course._id} />
            )}

            {/* FAQS TAB */}
            {activeTab === 'faqs' && (
              <div className="card-visual p-6 space-y-4">
                <h3 className="text-xl font-black text-[#0F172A] dark:text-white">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <div className="text-xs font-bold text-[#0F172A] dark:text-white">Is this program suitable for complete beginners?</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Yes! All concepts start from absolute fundamentals before building up to production apps.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <div className="text-xs font-bold text-[#0F172A] dark:text-white">Will I get a verified certificate upon completion?</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Yes, upon completing 100% of lectures and assignments, an official certificate with verification badge is issued.</div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: STICKY ENROLLMENT CARD */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="card-visual p-6 space-y-6 border-2 border-[#6366F1]/30 shadow-2xl bg-white dark:bg-[#111827]">
              {/* Price & Savings Badge */}
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Program Fee</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-[#6366F1]">₹{course.discountPrice || course.price || 2999}</span>
                  {course.price && course.discountPrice && course.discountPrice < course.price && (
                    <>
                      <span className="text-sm font-bold text-slate-400 line-through">₹{course.price}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#EF4444] text-white text-[10px] font-black uppercase">
                        {Math.round(((course.price - course.discountPrice) / course.price) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-2 p-2.5 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#06B6D4] text-xs font-extrabold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 shrink-0" />
                  <span>No-Cost EMI starting at ₹499/month</span>
                </div>
              </div>

              {/* Demo Video Button for Top Demo */}
              {course.previewVideo && (
                <button
                  onClick={() => setPlayingVideo(true)}
                  className="w-full btn-visual text-xs font-extrabold py-3 bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 hover:bg-[#06B6D4]/20 transition-colors cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4 text-[#06B6D4]" /> Play Top Demo Video
                </button>
              )}

              {/* Instant Buy Button */}
              <Link
                to={`/checkout/${course._id}`}
                className="btn-visual btn-primary w-full text-sm font-black py-3.5 shadow-lg shadow-[#6366F1]/30"
              >
                <ShoppingBag className="w-5 h-5" /> Buy Program Now
              </Link>

              {/* Course Highlights */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Full Lifetime Course Access
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 1-on-1 Doubt Mentor Sessions
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Verified Completion Certificate
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Access on Mobile & Web
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
