import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  BookOpen, 
  CreditCard, 
  Star, 
  Users, 
  GraduationCap, 
  Award, 
  Globe2, 
  ChevronDown, 
  ArrowRight,
  MonitorPlay,
  Briefcase
} from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';
import { SplitText } from '../../components/motion/SplitText';
import { TextEffect } from '../../components/motion/TextEffect';
import { InView } from '../../components/motion/InView';
import { SpotlightCard } from '../../components/motion/SpotlightCard';
import { ShimmerButton } from '../../components/motion/ShimmerButton';
import { Marquee } from '../../components/motion/Marquee';
import { NumberTicker } from '../../components/motion/NumberTicker';
import { CategoryShowcase } from '../../components/home/CategoryShowcase';
import { ConnectedConstellationSection } from '../../components/home/ConnectedConstellationSection';
import { HowItWorksFlowSection } from '../../components/home/HowItWorksFlowSection';
import { ArcOrbitStatsCtaSection } from '../../components/home/ArcOrbitStatsCtaSection';
import { GravityTestimonialsSection } from '../../components/home/GravityTestimonialsSection';
import { GlowingEffect } from '../../components/motion/GlowingEffect';
import { SquigglyText } from '../../components/motion/SquigglyText';
import { LiveClassesWorkshopsSection } from '../../components/home/LiveClassesWorkshopsSection';
import { StudentBatchResultsShowcase } from '../../components/home/StudentBatchResultsShowcase';
import { StudentVideoTestimonialsSection } from '../../components/home/StudentVideoTestimonialsSection';
import { MergedTestimonialsFaqSection } from '../../components/home/MergedTestimonialsFaqSection';
import { CompareOptionsSection } from '../../components/home/CompareOptionsSection';
import { courseApi } from '../../api/models/course.api';
import { categoryApi } from '../../api/models/category.api';
import { contentApi } from '../../api/models/content.api';

// --- Placeholder Translations (Fallback if keys missing) ---
const getTranslation = (t, key, fallback) => {
  const val = t(key);
  return val === key ? fallback : val;
};

// --- FAQ Data ---
const faqs = [
  {
    question: "Do I get full lifetime access?",
    answer: "Yes, once you enroll in a course, you get lifetime access to all its content, including future updates."
  },
  {
    question: "Are the courses in Hindi or English?",
    answer: "Our courses are available in bilingual options (Hinglish/English) with dual-language subtitles."
  },
  {
    question: "Will I get a certificate upon completion?",
    answer: "Absolutely! You will receive a verifiable certificate of completion that you can add to your resume or LinkedIn profile."
  },
  {
    question: "Can I access the courses on my mobile phone?",
    answer: "Yes, the platform is fully responsive and optimized for mobile devices, so you can learn anytime, anywhere."
  },
  {
    question: "What is your refund policy?",
    answer: "We offer a 7-day money-back guarantee. If you're not satisfied with the course, you can request a full refund within the first 7 days of purchase."
  }
];

export function HomePage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const isTelugu = language === 'te';
  const [categories, setCategories] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [studentResultsCms, setStudentResultsCms] = useState(null);
  const [liveClassesCms, setLiveClassesCms] = useState(null);
  const [videoTestimonialsCms, setVideoTestimonialsCms] = useState(null);
  const [faqCms, setFaqCms] = useState(null);
  const [testimonialsCms, setTestimonialsCms] = useState(null);

  const [isLoadingCats, setIsLoadingCats] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        const apiCats = response.data?.categories || (Array.isArray(response.data) ? response.data : []);
        if (apiCats.length > 0) {
          setCategories(apiCats);
        }
      } catch (error) {
        console.warn('Failed to load categories:', error.message);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await courseApi.getCourses();
        const apiCourses = response.data?.courses || (Array.isArray(response.data) ? response.data : []);
        if (apiCourses.length > 0) {
          setFeaturedCourses(apiCourses.slice(0, 6));
        }
      } catch (error) {
        console.warn('Failed to load courses:', error.message);
      }
    };

    const fetchCmsBlocks = async () => {
      try {
        const response = await contentApi.getContentByPage('home');
        const blocks = Array.isArray(response?.data) 
          ? response.data 
          : (response?.data?.blocks || []);
        
        const resultsBlock = blocks.find(b => b.section === 'student-results' && b.isActive);
        if (resultsBlock) setStudentResultsCms(resultsBlock);

        const liveBlock = blocks.find(b => b.section === 'live-classes' && b.isActive);
        if (liveBlock) setLiveClassesCms(liveBlock);

        const videoBlock = blocks.find(b => b.section === 'video-testimonials' && b.isActive);
        if (videoBlock) setVideoTestimonialsCms(videoBlock);

        const faqBlock = blocks.find(b => b.section === 'faqs' && b.isActive);
        if (faqBlock) setFaqCms(faqBlock);

        const testBlock = blocks.find(b => b.section === 'testimonial' && b.isActive);
        if (testBlock) setTestimonialsCms(testBlock);
      } catch (error) {
        console.warn('Failed to load CMS blocks:', error.message);
      }
    };

    fetchCategories();
    fetchCourses();
    fetchCmsBlocks();
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] overflow-x-hidden selection:bg-[var(--primary-soft)] selection:text-[var(--primary-deep)]">
      <FloatingNav />

      {/* 1. Full-Screen Hero Section (100% Viewport Edge-to-Edge with 0px Top, Left & Right Padding) */}
      <section className="relative min-h-screen w-full flex items-center overflow-hidden m-0 p-0 border-none">
        
        {/* Full-Screen Background Image Layer (Spans 100% Width & Height Edge-to-Edge) */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden m-0 p-0">
          <img 
            src="/assets/hero_students_hq.jpg" 
            alt="ClassConnect Indian Students Workspace" 
            className="w-full h-full object-cover object-right antialiased block m-0 p-0 border-none"
            style={{ imageRendering: 'high-quality' }}
          />
        </div>

        {/* Content Layer Shifted Farther to the Left Edge */}
        <div className="w-full relative z-10 px-6 sm:px-10 lg:px-16 flex items-center min-h-screen pt-24 pb-16">
          
          <div className="flex flex-col items-start text-left max-w-xl lg:max-w-2xl pt-6">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-indigo-200/80 text-indigo-700 text-xs font-extrabold mb-5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>🚀 100% Practical • High-CTC Tech Outcomes</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold font-manrope tracking-tight leading-[1.10] text-slate-900 mb-5">
              {isTelugu ? (
                <span>
                  మీ కేరిర్‌ను{' '}
                  <span className="font-cursive font-normal text-[#FF6B35] text-5xl sm:text-6xl lg:text-[70px]">
                    నెక్స్ట్ లెవెల్‌కి
                  </span>{' '}
                  తీసుకెళ్లే నైపుణ్యాలు <SquigglyText>నేర్చుకోండి</SquigglyText>
                </span>
              ) : (
                <span>
                  Master{' '}
                  <span className="font-cursive font-normal text-[#FF6B35] text-5xl sm:text-6xl lg:text-[70px]">
                    High-Income
                  </span>{' '}
                  skills that <SquigglyText>scale your career</SquigglyText>
                </span>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-700 mb-8 max-w-lg font-medium leading-relaxed">
              {isTelugu
                ? 'సాధారణ పాఠాలను వదిలేయండి. సీనియర్ ఇండస్ట్రీ లీడర్ల మార్గదర్శకత్వంలో రియల్-వరల్డ్ ప్రాజెక్ట్‌లను నిర్మించి 10x నైపుణ్యం సాధించండి.'
                : 'Break free from generic tutorials. Build production-grade Web apps, AI agents & Design systems alongside senior industry leaders with 100% bilingual clarity.'}
            </p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link to="/courses">
                <button className="w-full sm:w-auto px-8 py-4 text-base font-extrabold rounded-full bg-[#3B82F6] hover:bg-blue-600 text-white shadow-xl shadow-blue-500/25 hover:scale-105 transition-all cursor-pointer">
                  {isTelugu ? 'కోర్సులను అన్వేషించండి' : 'Explore Courses'}
                </button>
              </Link>
              <button 
                onClick={() => {
                  const target = document.getElementById('featured-courses');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = '/courses';
                  }
                }}
                className="w-full sm:w-auto px-8 py-4 text-base font-extrabold rounded-full border border-slate-300/80 bg-white/90 backdrop-blur-md text-slate-800 hover:bg-slate-100 hover:scale-105 transition-all cursor-pointer"
              >
                {isTelugu ? 'నేర్చుకోవడం ప్రారంభించండి' : 'Start Learning Free'}
              </button>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. Connected Constellation Section (Reference Image Format with SVG Curve Lines & Animated Nodes) */}
      <ConnectedConstellationSection />

      {/* 3. Student Batch Zero Results & Flip Cards Carousel (Just after Hero & Graph) */}
      <StudentBatchResultsShowcase cmsData={studentResultsCms} />

      {/* 4. Category Crafts Deck (Find Your Path - Auto-scrolling Interface Crafts style) */}
      <CategoryShowcase />

      {/* 5. Featured Courses Section */}
      <section id="featured-courses" className="py-[var(--space-section)] px-6 lg:px-[var(--space-page)] bg-[var(--surface)]">
        <div className="max-w-[var(--max-width)] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-manrope font-extrabold mb-3">
                Featured <span className="font-cursive font-normal text-indigo-600 text-4xl sm:text-5xl lg:text-6xl">Industry-Grade</span> Masterclasses
              </h2>
              <p className="text-[var(--ink-muted)] text-base sm:text-lg max-w-xl font-medium">
                Hand-picked hands-on courses engineered to turn ambitious learners into top 1% engineers & designers.
              </p>
            </div>
            <Link to="/courses" className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold hover:text-[var(--primary-deep)] transition-colors">
              View all courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoadingCourses ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 rounded-[var(--radius-lg)] bg-[var(--canvas)] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course, idx) => (
                <InView key={course._id || idx} delay={idx * 0.1}>
                  <Link to={`/courses/${course.slug || course._id}`} className="block h-full">
                    {/* GlowingEdge Border Card */}
                    <GlowingEffect
                      glowColor="rgba(67, 56, 242, 0.45)"
                      accentGlow="rgba(255, 107, 53, 0.4)"
                      containerClassName="h-full"
                    >
                      <div className="h-full bg-[var(--canvas)] overflow-hidden flex flex-col rounded-[15px] relative">
                        <div className="relative aspect-video w-full overflow-hidden bg-[var(--ink-faint)]">
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[var(--primary-soft)] to-[var(--aura-violet)] flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-[var(--primary)]/40" />
                            </div>
                          )}
                          {course.category && (
                            <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-[var(--ink)] shadow-sm">
                              {typeof course.category === 'object' ? course.category.name : 'Category'}
                            </div>
                          )}
                        </div>
                        
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold font-manrope leading-tight mb-2 line-clamp-2">
                            {course.title}
                          </h3>
                          <p className="text-[var(--ink-muted)] text-sm mb-3 line-clamp-2">
                            {course.subtitle || course.description}
                          </p>

                          {/* Tech Stack Badges */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {(course.tags || ['React 19', 'Node.js', 'Next.js']).slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary)]/15">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-[var(--accent)] text-[var(--accent)]" />
                              <span className="text-sm font-bold">{course.rating || '4.9'}</span>
                              <span className="text-xs text-[var(--ink-muted)]">({course.totalReviews || 120})</span>
                            </div>
                            
                            <div className="font-manrope font-bold text-lg text-[var(--primary-deep)]">
                              {course.price === 0 ? 'Free' : `₹${course.price?.toLocaleString('en-IN')}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlowingEffect>
                  </Link>
                </InView>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Live Classes & Workshops Section (Directly Below Featured Courses) */}
      <LiveClassesWorkshopsSection cmsData={liveClassesCms} />

      {/* 7. How It Works Section */}
      <HowItWorksFlowSection />

      {/* 8. Arc Orbit Stats & Merged CTA Section */}
      <ArcOrbitStatsCtaSection />

      {/* 9. Compare Your Options Comparison Chart */}
      <CompareOptionsSection />

      {/* 10. Merged Side-by-Side Section: Student Loved Stories (Left) + FAQs (Right) */}
      <MergedTestimonialsFaqSection cmsData={testimonialsCms} faqCmsData={faqCms} />

      {/* 11. Student Video Testimonials Showcase */}
      <StudentVideoTestimonialsSection cmsData={videoTestimonialsCms} />

      <Footer />
    </div>
  );
}
