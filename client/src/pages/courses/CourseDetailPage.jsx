import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, PlayCircle, Lock, CheckCircle, ChevronDown, ChevronUp, AlertCircle, ShoppingCart, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { courseApi } from '../../api/models/course.api';
import { reviewApi } from '../../api/models/review.api';
import { SAMPLE_COURSES } from '../../data/sampleData';
import { TextEffect } from '../../components/motion/TextEffect';
import { InView } from '../../components/motion/InView';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';

export function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});

  const isHindi = language === 'hi';

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch course and reviews in parallel
        const [courseRes, reviewsRes] = await Promise.all([
          courseApi.getCourseByIdOrSlug(slug),
          reviewApi.getCourseReviews(slug).catch(() => ({ data: [] }))
        ]);

        const loadedCourse = courseRes.data?.course || courseRes.data || (courseRes._id ? courseRes : null);
        
        if (loadedCourse) {
          setCourse(loadedCourse);
          const loadedReviews = Array.isArray(reviewsRes.data)
            ? reviewsRes.data
            : (reviewsRes.data?.reviews || []);
          setReviews(loadedReviews);
        } else {
          throw new Error('Course not found in API');
        }
        setExpandedModules({ 0: true });
        
      } catch (err) {
        // Fallback to sample courses if API fails or course not found
        const foundSample = SAMPLE_COURSES.find(c => c.slug === slug || c._id === slug) || SAMPLE_COURSES[0];
        setCourse(foundSample);
        setExpandedModules({ 0: true });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) fetchCourseDetails();
  }, [slug]);

  const toggleModule = (index) => {
    setExpandedModules(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleBuyClick = () => {
    if (isAuthenticated) {
      navigate(`/checkout/${course?._id}`);
    } else {
      navigate('/login', { state: { from: `/courses/${slug}` } });
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
            <p className="text-[var(--ink-muted)] mb-8">{error || "The course you are looking for does not exist or has been removed."}</p>
            <Link to="/courses" className="inline-flex items-center justify-center w-full px-6 py-3 bg-[var(--primary)] text-[var(--surface)] font-bold rounded-[var(--radius-pill)] hover:opacity-90 transition-opacity min-h-[44px]">
              Browse Courses
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--canvas)] flex flex-col font-sans relative pb-24 lg:pb-0">
      <FloatingNav />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <div className="bg-[var(--surface)] border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row gap-12">
            
            {/* Text Content */}
            <div className="flex-1 lg:pr-8">
              <div className="inline-block px-3 py-1 bg-[var(--canvas)] text-[var(--primary)] text-sm font-bold rounded-[var(--radius-pill)] mb-6">
                {course.category?.name || "General"}
              </div>
              
              <TextEffect className="text-4xl lg:text-5xl font-extrabold text-[var(--ink)] leading-tight mb-6">
                {course.title}
              </TextEffect>
              
              <p className="text-lg text-[var(--ink-muted)] mb-8 max-w-3xl">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-[var(--ink)] font-medium">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-[var(--accent)] text-[var(--accent)]" />
                  <span>{course.rating?.toFixed(1) || "4.5"} ({course.totalReviews || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--canvas)] flex items-center justify-center text-[var(--primary)] font-bold">
                    {course.instructor?.name?.charAt(0) || "I"}
                  </div>
                  <span>By {course.instructor?.name || "Expert Instructor"}</span>
                </div>
              </div>
            </div>

            {/* Floating Action Card (Desktop) */}
            <div className="hidden lg:block w-full max-w-md shrink-0">
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] overflow-hidden sticky top-32">
                <div className="aspect-video bg-[var(--canvas)] relative">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--primary-soft)] to-[var(--canvas)]">
                      <PlayCircle className="w-16 h-16 text-[var(--primary)] opacity-50" />
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="text-4xl font-extrabold text-[var(--ink)] mb-6">
                    {course.price === 0 ? "Free" : `₹${course.price?.toLocaleString('en-IN')}`}
                  </div>
                  <button 
                    onClick={handleBuyClick}
                    className="w-full bg-[var(--primary)] hover:bg-[var(--primary-soft)] text-[var(--surface)] hover:text-[var(--primary)] border border-transparent hover:border-[var(--primary)] font-bold text-lg py-4 rounded-[var(--radius-pill)] transition-all min-h-[44px] flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {isHindi ? "अभी खरीदें" : "Buy Now"}
                  </button>
                  <p className="text-center text-sm text-[var(--ink-faint)] mt-4">
                    Full lifetime access • 30-day money-back guarantee
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Course Content */}
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-16">
            
            {/* Curriculum */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--ink)] mb-8">Course Curriculum</h2>
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] overflow-hidden">
                {course.lectures && course.lectures.length > 0 ? (
                  <div className="divide-y divide-[var(--border)]">
                    {course.lectures.map((lecture, i) => (
                      <div key={lecture._id || i} className="p-4 hover:bg-[var(--canvas)] transition-colors flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-[var(--canvas)] flex items-center justify-center shrink-0">
                            <PlayCircle className="w-4 h-4 text-[var(--primary)]" />
                          </div>
                          <span className="font-medium text-[var(--ink)]">{lecture.title || `Lecture ${i + 1}`}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[var(--ink-faint)] shrink-0">
                          {lecture.duration && <span>{lecture.duration}</span>}
                          <Lock className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-[var(--ink-muted)]">
                    Curriculum details will be available soon.
                  </div>
                )}
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--ink)] mb-8">Student Reviews</h2>
              {reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review, idx) => (
                    <div key={review._id || idx} className="bg-[var(--surface)] p-6 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--canvas)] flex items-center justify-center font-bold text-[var(--primary)]">
                          {review.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-bold text-[var(--ink)]">{review.user?.name || "Anonymous User"}</div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < (review.rating || 5) ? 'fill-[var(--accent)] text-[var(--accent)]' : 'fill-[var(--canvas)] text-[var(--border)]'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-[var(--ink-muted)] text-sm">{review.comment || "Great course!"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[var(--surface)] p-8 rounded-[var(--radius-lg)] border border-[var(--border)] text-center text-[var(--ink-muted)]">
                  No reviews yet. Be the first to review this course!
                </div>
              )}
            </section>
            
          </div>
        </div>
      </main>
      
      {/* Mobile Sticky Buy Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-[var(--border)] p-4 shadow-[var(--shadow-md)] z-50 flex items-center justify-between gap-4">
        <div className="text-2xl font-extrabold text-[var(--ink)]">
          {course.price === 0 ? "Free" : `₹${course.price?.toLocaleString('en-IN')}`}
        </div>
        <button 
          onClick={handleBuyClick}
          className="flex-1 bg-[var(--primary)] text-[var(--surface)] font-bold py-3 px-6 rounded-[var(--radius-pill)] active:scale-95 transition-transform min-h-[44px] flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          {isHindi ? "अभी खरीदें" : "Buy Now"}
        </button>
      </div>
      
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}
