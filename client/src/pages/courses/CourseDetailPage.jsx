import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  PlayCircle, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  Award,
  Infinity as InfiniteIcon,
  Radio,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { courseApi } from '../../api/models/course.api';
import { reviewApi } from '../../api/models/review.api';
import { enrollmentApi } from '../../api/models/enrollment.api';
import { SAMPLE_COURSES } from '../../data/sampleData';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';
import { ShimmerButton } from '../../components/motion/ShimmerButton';
import { LearningTrackList } from '../../components/courses/LearningTrackList';

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

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setIsLoading(true);
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

  const handleActionClick = () => {
    if (!course) return;
    if (isOwned) {
      navigate(`/course/${course._id || course.id}/explore`);
    } else if (isAuthenticated) {
      navigate(`/checkout/${course._id || course.id}`);
    } else {
      navigate('/login');
    }
  };

  if (isLoading || !course) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between">
        <FloatingNav />
        <div className="py-40 text-center font-mono text-[#C1FBD4]">
          Loading learning track details...
        </div>
        <Footer />
      </div>
    );
  }

  // Curriculum sample data fallback if units empty
  const units = course.units || [
    {
      title: 'Foundation Architecture & Project Blueprinting',
      lectures: [
        { title: 'System Overview & Tech Stack Breakdown', duration: '14 mins', isLocked: false },
        { title: 'State Management & Async Telemetry Pipelines', duration: '28 mins', isLocked: false },
      ]
    },
    {
      title: 'Advanced Microservices & Database Sharding',
      lectures: [
        { title: 'Designing High-Availability SQL Schemas', duration: '32 mins', isLocked: true },
        { title: 'Redis Cache Layering & Invalidation Patterns', duration: '24 mins', isLocked: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-[#F7F7F5] font-body selection:bg-[#C1FBD4] selection:text-black">
      <FloatingNav />

      {/* Hero Media Banner */}
      <section className="relative pt-28 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Course Info Column */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C1FBD4]/10 border border-[#C1FBD4]/30 text-[#C1FBD4] font-mono text-xs uppercase tracking-widest">
              {course.category?.name || course.category || 'TECHNICAL TRACK'}
            </span>

            <h1 className="font-display text-4xl sm:text-6xl font-light text-[#F7F7F5] leading-tight">
              {course.title}
            </h1>

            <p className="font-body text-base sm:text-xl text-[#A1A1AA] leading-relaxed">
              {course.subtitle || course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-[#A1A1AA] pt-4 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-white">{course.rating || '4.9'}</span>
                <span>({course.totalReviews || 184} reviews)</span>
              </div>
              <div>
                <span>Instructor: </span>
                <span className="text-white font-medium">{course.instructor?.name || 'Samir Singh'}</span>
              </div>
            </div>
          </div>

          {/* Floating Checkout Sticky Box */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-28 p-8 rounded-3xl bg-[#0B0B0D] border border-white/10 shadow-2xl space-y-6">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#141416]">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-baseline justify-between pt-2">
                <div>
                  <span className="font-display text-4xl font-normal text-[#F7F7F5]">
                    {course.price === 0 ? 'Free' : `₹${course.price?.toLocaleString('en-IN')}`}
                  </span>
                  {course.originalPrice && (
                    <span className="font-mono text-sm text-[#71717A] line-through ml-3">
                      ₹{course.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-[#C1FBD4] border border-[#C1FBD4]/30 px-3 py-1 rounded-full bg-[#C1FBD4]/10">
                  LIFETIME ACCESS
                </span>
              </div>

              <ShimmerButton
                onClick={handleActionClick}
                className="w-full text-base py-4 font-mono uppercase tracking-wider"
                variant="white"
              >
                {isOwned ? 'Continue Learning →' : 'Enroll In Track Now'}
              </ShimmerButton>

              <div className="space-y-3 pt-4 border-t border-white/5 font-mono text-xs text-[#A1A1AA]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C1FBD4]" />
                  <span>Razorpay Protected Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C1FBD4]" />
                  <span>Verifiable Certificate on Completion</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Curriculum Track Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="max-w-3xl mb-12">
          <span className="font-mono text-xs text-[#C1FBD4] uppercase tracking-widest block mb-2">
            SYLLABUS & SYNOPSIS
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-light text-[#F7F7F5]">
            Learning Track <span className="text-[#C1FBD4] font-normal">Modules</span>
          </h2>
        </div>

        <div className="max-w-4xl">
          <LearningTrackList units={units} />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default CourseDetailPage;
