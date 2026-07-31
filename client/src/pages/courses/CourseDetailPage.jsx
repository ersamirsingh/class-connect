import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseApi } from '../../api/models/course.api';
import { enrollmentApi } from '../../api/models/enrollment.api';
import { Navbar } from '../../components/guest/Navbar';
import { Footer } from '../../components/guest/Footer';
import { CourseReviewsSection } from '../../components/courses/CourseReviewsSection';
import { useAuth } from '../../hooks/useAuth';
import {
  PlayCircle,
  Star,
  CheckCircle2,
  Lock,
  BookOpen,
  Video,
  ChevronDown,
  ChevronUp,
  Loader2,
  ShoppingBag,
  CreditCard,
  HelpCircle,
  Users,
  Sparkles,
  Calendar,
  Eye,
  X,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CourseDetailPage = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('curriculum');
  const [expandedSections, setExpandedSections] = useState({ 0: true });
  
  // Demo Preview N-View Counter State
  const [demoLecture, setDemoLecture] = useState(null);
  const [previewError, setPreviewError] = useState('');
  const [remainingViews, setRemainingViews] = useState(3);
  const [playingVideoUrl, setPlayingVideoUrl] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    const fetchCourseAndEnrollment = async () => {
      try {
        setLoading(true);
        const res = await courseApi.getCourseByIdOrSlug(idOrSlug);
        if (res.success && res.data) {
          setCourse(res.data);
          const maxV = res.data.maxPreviewViews || 3;
          setRemainingViews(maxV);

          // Check if logged-in user is enrolled
          if (user) {
            try {
              const statusRes = await enrollmentApi.checkStatus(res.data._id);
              if (statusRes.success && statusRes.data) {
                setIsEnrolled(statusRes.data.isEnrolled);
              }
            } catch (eErr) {
              console.log('Enrollment check failed:', eErr);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndEnrollment();
  }, [idOrSlug, user]);

  const toggleSection = (idx) => {
    setExpandedSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Trigger demo video playback with N-views tracking
  const handlePlayDemo = async (lecture) => {
    if (!course) return;
    try {
      setLoadingPreview(true);
      setPreviewError('');

      // Call backend to track preview play
      const localGuestCount = Number(localStorage.getItem(`preview_count_${course._id}`) || 0);
      const res = await courseApi.trackPreviewPlay(course._id, localGuestCount);

      if (res.success && res.data) {
        if (!user) {
          localStorage.setItem(`preview_count_${course._id}`, String(res.data.guestCount || localGuestCount + 1));
        }
        setRemainingViews(res.data.remainingViews);
        setPlayingVideoUrl(res.data.previewVideoUrl || lecture?.videoUrl || course.previewVideo);
        setDemoLecture(lecture || { title: 'Free Demo Course Preview', duration: '5 mins' });
      }
    } catch (err) {
      setPreviewError(err.response?.data?.message || err.message || 'Preview limit reached — Purchase to continue.');
      setRemainingViews(0);
    } finally {
      setLoadingPreview(false);
    }
  };

  // Collect all preview lectures for demo access
  const previewLectures = course?.sections?.flatMap((s) =>
    s.lectures.filter((l) => l.isPreview).map((l) => ({ ...l, sectionTitle: s.title }))
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFAF7] dark:bg-[#090D16] flex flex-col justify-between">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#5B54E8] animate-spin mb-3" />
          <span className="text-xs font-bold text-[#2B2B38] dark:text-slate-400">Loading course details...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#FBFAF7] dark:bg-[#090D16] flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-[#2B2B38] dark:text-white">Course Not Found</h2>
          <Link to="/courses" className="btn-visual btn-primary text-xs mt-4 inline-flex">
            Back to All Courses
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFAF7] dark:bg-[#090D16] flex flex-col justify-between transition-colors duration-200 text-[#2B2B38] dark:text-slate-100">
      <Navbar />

      {/* DEMO VIDEO MODAL WITH N-VIEW LIMIT */}
      {demoLecture && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#111827] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-800"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
              <div>
                <div className="text-[10px] font-black text-[#FF7A59] uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> Free Demo Preview ({remainingViews} plays left)
                </div>
                <h3 className="text-sm font-extrabold text-white">{demoLecture.title}</h3>
              </div>
              <button
                onClick={() => setDemoLecture(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewError ? (
              <div className="p-8 text-center space-y-4 bg-slate-900">
                <div className="w-12 h-12 rounded-full bg-[#E0524F]/20 text-[#E0524F] flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-white">Preview Limit Reached</h4>
                <p className="text-xs text-slate-300 font-medium max-w-md mx-auto">
                  You've reached your free demo preview limit for this course. Purchase full access to unlock all lectures!
                </p>
                <Link
                  to={`/checkout/${course._id}`}
                  className="btn-visual bg-[#FF7A59] hover:bg-[#E56848] text-white text-xs font-black px-6 py-3 inline-flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Purchase Course Now
                </Link>
              </div>
            ) : (
              <>
                <video
                  src={playingVideoUrl || course.previewVideo}
                  controls
                  autoPlay
                  className="w-full h-80 sm:h-[400px] object-contain bg-black"
                />
                <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-bold">
                    Remaining Free Views: <strong className="text-[#FF7A59]">{remainingViews}</strong>
                  </span>
                  {isEnrolled ? (
                    <Link to={`/courses/${course._id}/explore`} className="btn-visual bg-[#5B54E8] text-white text-xs px-4 py-2">
                      Explore Full Course
                    </Link>
                  ) : (
                    <Link to={`/checkout/${course._id}`} className="btn-visual bg-[#FF7A59] text-white text-xs px-4 py-2">
                      <ShoppingBag className="w-4 h-4" /> Enroll for Full Access
                    </Link>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* HERO BANNER */}
      <section className="bg-gradient-to-r from-[#2B2B38] via-[#1E293B] to-[#1E1B4B] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
              <span>/</span>
              <span className="text-[#5B54E8]">{course.category?.name || 'Category'}</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-md ${course.type === 'live' ? 'bg-[#FF7A59]' : 'bg-[#5B54E8]'}`}>
                {course.type === 'live' ? '🔴 Pos 1: Live Class' : '📹 Pos 2: Recorded'}
              </span>

              {previewLectures.length > 0 && (
                <button
                  onClick={() => handlePlayDemo(previewLectures[0])}
                  disabled={loadingPreview}
                  className="px-3.5 py-1 rounded-full bg-[#5B54E8]/20 text-[#5B54E8] text-xs font-extrabold flex items-center gap-1.5 hover:bg-[#5B54E8]/30 transition-colors cursor-pointer border border-[#5B54E8]/30"
                >
                  {loadingPreview ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>Watch Free Demo ({remainingViews} left)</span>
                </button>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">{course.title}</h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl leading-relaxed">{course.subtitle || course.description}</p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-bold text-slate-300">
              <div className="flex items-center gap-1.5 text-[#E8A23D]">
                <Star className="w-4 h-4 fill-[#E8A23D]" />
                <span className="text-white">{course.rating || 4.9}</span>
                <span className="text-slate-400">({course.ratingCount || 120} ratings)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#5B54E8]" />
                <span>Instructor: {course.instructor?.name || 'ClassConnect Tech Lead'}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN CONTENT & STICKY ACTION CARD */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* CONTENT TABS */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
              {[
                { id: 'curriculum', label: 'Curriculum & Units', icon: BookOpen },
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
                        ? 'bg-[#5B54E8] text-white shadow-md'
                        : 'bg-white dark:bg-[#111827] text-[#2B2B38] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
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
                
                {/* Preview Video Player Banner */}
                <div className="card-visual overflow-hidden relative bg-black">
                  <div className="relative h-80 sm:h-96">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-75" />
                    <button
                      onClick={() => handlePlayDemo(previewLectures[0])}
                      className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-[#5B54E8] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                    >
                      <PlayCircle className="w-10 h-10 fill-white text-[#5B54E8]" />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-2">
                      <Video className="w-4 h-4 text-[#FF7A59]" /> Course Demo Video ({remainingViews} free views left)
                    </div>
                  </div>
                </div>

                {/* Unit / Syllabus Accordion List */}
                <div className="card-visual p-6 space-y-4">
                  <h3 className="text-xl font-black text-[#2B2B38] dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#5B54E8]" /> Syllabus Units & Lectures
                  </h3>

                  {course.sections && course.sections.length > 0 ? (
                    <div className="space-y-3">
                      {course.sections.map((section, idx) => (
                        <div key={section._id || idx} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                          <button
                            onClick={() => toggleSection(idx)}
                            className="w-full bg-[#E4E2FB]/40 dark:bg-slate-900 p-4 flex items-center justify-between font-extrabold text-xs sm:text-sm text-[#2B2B38] dark:text-white hover:bg-[#E4E2FB]/70 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-full bg-[#5B54E8] text-white flex items-center justify-center text-xs font-black">
                                {idx + 1}
                              </span>
                              <span>{section.title}</span>
                              <span className="text-[10px] text-[#5B54E8] font-black">({section.lectures?.length || 0} lectures)</span>
                            </div>
                            {expandedSections[idx] ? <ChevronUp className="w-4 h-4 text-[#5B54E8]" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {expandedSections[idx] && (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800 p-2 bg-white dark:bg-[#111827]">
                              {section.lectures.map((lec, lIdx) => (
                                <div key={lec._id || lIdx} className="p-3 flex items-center justify-between text-xs font-semibold">
                                  <div className="flex items-center gap-3">
                                    {lec.isPreview ? (
                                      <PlayCircle className="w-4 h-4 text-[#5B54E8] shrink-0" />
                                    ) : (
                                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                                    )}
                                    <span className={lec.isPreview ? 'font-bold text-[#2B2B38] dark:text-white' : 'text-slate-500'}>
                                      {lec.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                                    <span>{lec.duration || '15 mins'}</span>
                                    {lec.isPreview && (
                                      <button
                                        onClick={() => handlePlayDemo(lec)}
                                        className="px-2.5 py-0.5 rounded-full bg-[#5B54E8]/10 text-[#5B54E8] font-black text-[10px] hover:bg-[#5B54E8]/20 transition-colors cursor-pointer flex items-center gap-1"
                                      >
                                        <Eye className="w-3 h-3" /> Preview
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
                <h3 className="text-xl font-black text-[#2B2B38] dark:text-white">Program Overview</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {course.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#DCEFFB] dark:bg-slate-900">
                    <CheckCircle2 className="w-5 h-5 text-[#2FA876]" />
                    <span className="text-xs font-bold text-[#2B2B38] dark:text-slate-200">100% Production-Ready Code</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#DCF5E7] dark:bg-slate-900">
                    <CheckCircle2 className="w-5 h-5 text-[#2FA876]" />
                    <span className="text-xs font-bold text-[#2B2B38] dark:text-slate-200">Verified Certificate Issued</span>
                  </div>
                </div>
              </div>
            )}

            {/* INSTRUCTOR TAB */}
            {activeTab === 'instructor' && (
              <div className="card-visual p-6 space-y-4">
                <h3 className="text-xl font-black text-[#2B2B38] dark:text-white">Lead Instructor</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={course.instructor?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                    alt={course.instructor?.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#5B54E8]/20"
                  />
                  <div>
                    <div className="text-base font-extrabold text-[#2B2B38] dark:text-white">{course.instructor?.name || 'ClassConnect Mentor'}</div>
                    <div className="text-xs font-bold text-slate-400">{course.instructor?.title || 'Principal Architect'}</div>
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
                <h3 className="text-xl font-black text-[#2B2B38] dark:text-white">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <div className="text-xs font-bold text-[#2B2B38] dark:text-white">What happens after I purchase?</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">You instantly gain access to the Explore Page with Live sessions and Recorded Units!</div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: DYNAMIC ENROLLMENT / EXPLORE ACTION CARD */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="card-visual p-6 space-y-6 border-2 border-[#5B54E8]/30 shadow-2xl bg-white dark:bg-[#111827]">
              {/* Price & Savings Badge (Hidden when Enrolled) */}
              <div>
                {isEnrolled ? (
                  <div className="p-3 rounded-2xl bg-[#2FA876]/10 border border-[#2FA876]/20 text-[#2FA876] text-xs font-black flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Course Enrolled & Active
                    </span>
                    <span className="text-[10px] uppercase bg-[#2FA876] text-white px-2 py-0.5 rounded-full font-black">
                      VERIFIED
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Program Fee</div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-black text-[#5B54E8]">${course.discountPrice || course.price}</span>
                      {course.price && course.discountPrice && course.discountPrice < course.price && (
                        <>
                          <span className="text-sm font-bold text-slate-400 line-through">${course.price}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#E0524F] text-white text-[10px] font-black uppercase">
                            {Math.round(((course.price - course.discountPrice) / course.price) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* DYNAMIC BUTTON LOGIC: Enrolled -> Explore & Billing vs Unpurchased -> Purchase */}
              {isEnrolled ? (
                <div className="space-y-3">
                  <Link
                    to={`/courses/${course._id}/explore`}
                    className="btn-visual bg-[#5B54E8] hover:bg-[#4740D2] w-full text-sm font-black py-3.5 shadow-lg shadow-[#5B54E8]/30 text-white flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" /> Explore Course Now
                  </Link>

                  <Link
                    to={orderId ? `/receipt/${orderId}` : '/payments'}
                    className="btn-visual bg-[#2FA876] hover:bg-[#25875e] w-full text-xs font-black py-2.5 shadow-md text-white flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" /> Download Billing Invoice
                  </Link>
                </div>
              ) : (
                <Link
                  to={`/checkout/${course._id}`}
                  className="btn-visual bg-[#FF7A59] hover:bg-[#E56848] w-full text-sm font-black py-3.5 shadow-lg shadow-[#FF7A59]/30 text-white flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" /> Purchase (${course.discountPrice || course.price})
                </Link>
              )}

              {/* Course Highlights */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2FA876]" /> Full Lifetime Access
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2FA876]" /> Live & Recorded Curriculum
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2FA876]" /> Verified Completion Certificate
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
