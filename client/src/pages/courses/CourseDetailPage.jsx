import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Clock, 
  PlayCircle, 
  Lock, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  ShoppingCart, 
  Loader2,
  Award,
  Infinity as InfiniteIcon,
  Radio,
  FileText,
  Compass,
  ArrowRight,
  Share2,
  BookOpen,
  Users
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { courseApi } from '../../api/models/course.api';
import { reviewApi } from '../../api/models/review.api';
import { enrollmentApi } from '../../api/models/enrollment.api';
import { SAMPLE_COURSES } from '../../data/sampleData';
import { TextEffect } from '../../components/motion/TextEffect';
import { InView } from '../../components/motion/InView';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';

export function CourseDetailPage() {
  const { idOrSlug, slug: paramSlug } = useParams();
  const slug = idOrSlug || paramSlug;
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isOwned, setIsOwned] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUnits, setExpandedUnits] = useState({ 0: true });

  const isHindi = language === 'hi';

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [courseRes, reviewsRes, enrollRes] = await Promise.all([
          courseApi.getCourseByIdOrSlug(slug),
          reviewApi.getCourseReviews(slug).catch(() => ({ data: [] })),
          isAuthenticated ? enrollmentApi.getMyEnrollments().catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
        ]);

        const loadedCourse = courseRes.data?.course || courseRes.data || (courseRes._id ? courseRes : null);
        
        if (loadedCourse) {
          setCourse(loadedCourse);
          const loadedReviews = Array.isArray(reviewsRes.data)
            ? reviewsRes.data
            : (reviewsRes.data?.reviews || []);
          setReviews(loadedReviews);

          const myEnrollments = Array.isArray(enrollRes.data)
            ? enrollRes.data
            : (enrollRes.data?.enrollments || (Array.isArray(enrollRes) ? enrollRes : []));
          
          const owned = myEnrollments.some(e => 
            e.courseId === loadedCourse._id || e.course?._id === loadedCourse._id || e.course?.slug === loadedCourse.slug
          );
          setIsOwned(owned);
        } else {
          throw new Error('Course not found');
        }
      } catch (err) {
        const foundSample = SAMPLE_COURSES.find(c => c.slug === slug || c._id === slug) || SAMPLE_COURSES[0];
        setCourse(foundSample);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) fetchCourseDetails();
  }, [slug, isAuthenticated]);

  const toggleUnit = (index) => {
    setExpandedUnits(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const [shareMsg, setShareMsg] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    if (refParam) {
      localStorage.setItem('pendingReferralCode', refParam);
    }
  }, []);

  const handleShareClick = () => {
    const refCode = user?.referralCode || '';
    const shareUrl = `${window.location.origin}/course/${slug}${refCode ? `?ref=${refCode}` : ''}`;
    navigator.clipboard.writeText(shareUrl);
    setShareMsg(true);
    setTimeout(() => setShareMsg(false), 3000);
  };

  const handleActionClick = () => {
    if (!course) return;
    if (isOwned) {
      navigate(`/course/${course._id}/explore`);
    } else if (isAuthenticated) {
      navigate(`/checkout/${course._id}`);
    } else {
      navigate('/login', { state: { from: `/course/${slug}` } });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--canvas)] flex flex-col items-center justify-center font-sans">
        <FloatingNav />
        <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin mb-4" />
        <p className="text-[var(--ink-muted)] font-medium">Loading course details...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[var(--canvas)] flex flex-col font-sans">
        <FloatingNav />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[var(--surface)] p-8 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-md)] text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-4">Course Not Found</h2>
            <p className="text-[var(--ink-muted)] mb-8">{error || "The course you are looking for does not exist."}</p>
            <Link to="/courses" className="inline-flex items-center justify-center w-full px-6 py-3 bg-[var(--primary)] text-white font-bold rounded-[var(--radius-pill)] hover:opacity-90 min-h-[44px]">
              Browse Courses
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const units = course.sections || course.units || [
    { title: 'Unit 1: Foundations & Architecture', lectures: [{ title: 'Overview & Intro' }, { title: 'Environment Setup' }, { title: 'Core Mechanics' }] },
    { title: 'Unit 2: Advanced Implementation', lectures: [{ title: 'Production Patterns' }, { title: 'State & Performance' }] },
    { title: 'Unit 3: Real-World Capstone', lectures: [{ title: 'Building Capstone App' }, { title: 'Deployment & CI/CD' }] }
  ];

  return (
    <div className="min-h-screen bg-[var(--canvas)] flex flex-col font-sans relative pb-24 lg:pb-0">
      <FloatingNav />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <div className="bg-[var(--surface)] border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 flex flex-col lg:flex-row gap-12">
            
            {/* Text Content */}
            <div className="flex-1 lg:pr-8">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3.5 py-1 bg-[var(--canvas)] text-[var(--primary)] text-xs font-bold rounded-full border border-[var(--border)]">
                  {typeof course.category === 'object' ? course.category?.name : (course.category || 'General')}
                </span>
                {course.type === 'live' ? (
                  <span className="px-3.5 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 animate-pulse" /> Live + Recorded
                  </span>
                ) : (
                  <span className="px-3.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full flex items-center gap-1">
                    <PlayCircle className="w-3.5 h-3.5" /> Self-Paced Recorded
                  </span>
                )}
              </div>
              
              <TextEffect className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--ink)] font-manrope leading-tight mb-6">
                {course.title}
              </TextEffect>
              
              <p className="text-lg text-[var(--ink-muted)] mb-8 max-w-3xl leading-relaxed">
                {course.subtitle || course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-[var(--ink)] font-medium">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-[var(--accent)] text-[var(--accent)]" />
                  <span className="font-bold">{course.rating?.toFixed(1) || "4.8"}</span>
                  <span className="text-sm text-[var(--ink-muted)]">({course.totalReviews || 120} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--ink-muted)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center font-bold">
                    {course.instructor?.name?.charAt(0) || "I"}
                  </div>
                  <span>Taught by <strong className="text-[var(--ink)]">{course.instructor?.name || "Expert Instructor"}</strong></span>
                </div>
              </div>
            </div>

            {/* Floating Action Card (Desktop) */}
            <div className="hidden lg:block w-full max-w-md shrink-0">
              <div className="bg-[var(--canvas)] border border-[var(--border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] overflow-hidden sticky top-32">
                <div className="aspect-video bg-black relative group">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/about_hero_lead.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--primary-soft)] to-[var(--aura-violet)]">
                      <PlayCircle className="w-16 h-16 text-[var(--primary)]" />
                    </div>
                  )}
                </div>

                <div className="p-8 space-y-6">
                  <div className="flex items-baseline justify-between">
                    <div className="text-4xl font-extrabold font-manrope text-[var(--ink)]">
                      {course.price === 0 ? "Free" : `₹${course.price?.toLocaleString('en-IN')}`}
                    </div>
                    {course.originalPrice && (
                      <div className="text-lg line-through text-[var(--ink-muted)]">
                        ₹{course.originalPrice.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleActionClick}
                    className={`w-full font-extrabold text-lg py-4 rounded-full transition-all min-h-[48px] flex items-center justify-center gap-2 shadow-md ${
                      isOwned 
                        ? 'bg-[#5B54E8] hover:bg-[#4740D2] text-white' 
                        : 'bg-[#FF7A59] hover:bg-[#e06847] text-white'
                    }`}
                  >
                    {isOwned ? (
                      <>
                        <Compass className="w-5 h-5" />
                        {isHindi ? "कोर्स एक्सप्लोर करें" : "Explore Course"}
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        {isHindi ? "अभी खरीदें" : "Buy Now"}
                      </>
                    )}
                  </button>

                  <button 
                    onClick={handleShareClick}
                    className="w-full font-extrabold text-xs py-3 px-4 rounded-full border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{shareMsg ? 'Referral Link Copied! 📋' : 'Refer & Share Course'}</span>
                  </button>

                  <p className="text-center text-xs font-medium text-[var(--ink-muted)]">
                    30-Day Money-Back Guarantee • Lifetime Access
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* What's Included Strip */}
        <section className="py-8 bg-[var(--canvas)] border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: InfiniteIcon, title: "Lifetime Access", desc: "Learn at your own pace" },
              { icon: Award, title: "Certificate Included", desc: "Verifiable credential" },
              { icon: Radio, title: "Live + Recorded", desc: "Interactive masterclasses" },
              { icon: FileText, title: "Download Resources", desc: "Cheatsheets, slides & code" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm font-manrope">{item.title}</h4>
                  <p className="text-xs text-[var(--ink-muted)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Course Details Grid */}
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-16">
            
            {/* Expandable Unit List (Titles + Lecture counts only, no play access pre-purchase) */}
            <section>
              <h2 className="text-2xl font-bold font-manrope text-[var(--ink)] mb-8">Course Units & Curriculum</h2>
              <div className="space-y-4">
                {units.map((unit, uIdx) => {
                  const isExpanded = expandedUnits[uIdx];
                  const lectureCount = unit.lectures?.length || 0;

                  return (
                    <div key={uIdx} className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden shadow-sm">
                      <button
                        onClick={() => toggleUnit(uIdx)}
                        className="w-full p-5 flex items-center justify-between font-bold text-base text-[var(--ink)] hover:bg-[var(--canvas)] transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-bold flex items-center justify-center">
                            U{uIdx + 1}
                          </span>
                          <div>
                            <div className="font-manrope">{unit.title}</div>
                            <div className="text-xs font-medium text-[var(--ink-muted)]">{lectureCount} Lectures</div>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-[var(--ink-muted)]" /> : <ChevronDown className="w-5 h-5 text-[var(--ink-muted)]" />}
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-[var(--border)] border-t border-[var(--border)] bg-[var(--canvas)] p-2">
                          {unit.lectures?.map((lec, lIdx) => (
                            <div key={lIdx} className="p-3.5 flex items-center justify-between text-sm">
                              <div className="flex items-center gap-3">
                                <PlayCircle className="w-4 h-4 text-[var(--primary)] shrink-0" />
                                <span className="font-medium text-[var(--ink)]">{lec.title}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)]">
                                <span>Locked</span>
                                <Lock className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Reviews Section with Star Breakdown */}
            <section>
              <h2 className="text-2xl font-bold font-manrope text-[var(--ink)] mb-8">Student Ratings & Reviews</h2>
              
              {/* Star Breakdown */}
              <div className="p-8 rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] shadow-sm mb-8 flex flex-col md:flex-row items-center gap-8">
                <div className="text-center md:border-r md:border-[var(--border)] md:pr-8">
                  <div className="text-5xl font-extrabold font-manrope text-[var(--ink)] mb-1">
                    {course.rating?.toFixed(1) || "4.8"}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-[var(--accent)] mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[var(--accent)] text-[var(--accent)]" />
                    ))}
                  </div>
                  <div className="text-xs text-[var(--ink-muted)]">Course Rating</div>
                </div>

                <div className="flex-1 w-full space-y-2">
                  {[
                    { stars: '5 Star', pct: 85 },
                    { stars: '4 Star', pct: 10 },
                    { stars: '3 Star', pct: 3 },
                    { stars: '2 Star', pct: 1 },
                    { stars: '1 Star', pct: 1 }
                  ].map((row, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs font-medium">
                      <span className="w-12 text-[var(--ink-muted)]">{row.stars}</span>
                      <div className="flex-1 h-2 bg-[var(--canvas)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${row.pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-[var(--ink-muted)]">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Cards */}
              {reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review, idx) => (
                    <div key={review._id || idx} className="bg-[var(--surface)] p-6 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center font-bold">
                          {review.user?.name?.charAt(0) || "S"}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[var(--ink)]">{review.user?.name || "Student Learner"}</div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < (review.rating || 5) ? 'fill-[var(--accent)] text-[var(--accent)]' : 'fill-[var(--canvas)] text-[var(--border)]'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-[var(--ink-muted)] text-sm leading-relaxed">{review.comment || "Extremely well structured course. Solved my doubts clearly!"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[var(--surface)] p-8 rounded-[var(--radius-lg)] border border-[var(--border)] text-center text-[var(--ink-muted)] font-medium">
                  Verified student reviews will appear here.
                </div>
              )}
            </section>
            
          </div>
        </div>
      </main>
      
      {/* Mobile Sticky Bottom Bar (Always visible without scrolling) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-[var(--border)] p-4 shadow-xl z-50 flex items-center justify-between gap-4">
        <div className="text-2xl font-extrabold font-manrope text-[var(--ink)]">
          {course.price === 0 ? "Free" : `₹${course.price?.toLocaleString('en-IN')}`}
        </div>
        <button 
          onClick={handleActionClick}
          className={`flex-1 font-bold py-3 px-6 rounded-full transition-transform active:scale-95 min-h-[44px] flex items-center justify-center gap-2 shadow-md ${
            isOwned ? 'bg-[#5B54E8] text-white' : 'bg-[#FF7A59] text-white'
          }`}
        >
          {isOwned ? (
            <>
              <Compass className="w-5 h-5" />
              {isHindi ? "एक्सप्लोर करें" : "Explore Course"}
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              {isHindi ? "अभी खरीदें" : "Buy Now"}
            </>
          )}
        </button>
      </div>
      
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}
