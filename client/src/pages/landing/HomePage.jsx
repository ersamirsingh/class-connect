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
import { FeaturedCourseCard } from '../../components/courses/FeaturedCourseCard';

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
    answer: "Our courses are taught in a mix of Hindi and English to ensure maximum clarity and understanding for our diverse student base."
  },
  {
    question: "Do you provide certificates upon completion?",
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
  const isHindi = language === 'hi';
  const [categories, setCategories] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [studentResultsCms, setStudentResultsCms] = useState(null);
  const [liveClassesCms, setLiveClassesCms] = useState(null);
  const [testimonialsCms, setTestimonialsCms] = useState(null);
  const [faqsCms, setFaqsCms] = useState(null);
  const [isLoadingCats, setIsLoadingCats] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        const apiCats = Array.isArray(response?.data) 
          ? response.data 
          : (response?.data?.categories || (Array.isArray(response) ? response : []));
        setCategories(apiCats);
      } catch (error) {
        console.warn('Failed to load live categories:', error.message);
        setCategories([]);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await courseApi.getCourses();
        const apiCourses = Array.isArray(response?.data) 
          ? response.data 
          : (response?.data?.courses || (Array.isArray(response) ? response : []));
        setFeaturedCourses(apiCourses.slice(0, 8));
      } catch (error) {
        console.warn('Failed to load live courses:', error.message);
        setFeaturedCourses([]);
      }
    };

    const fetchCmsBlocks = async () => {
      try {
        const response = await contentApi.getContentByPage('home');
        const blocks = Array.isArray(response?.data) 
          ? response.data 
          : (response?.data?.blocks || []);
        
        // 1. Featured Courses CMS Block
        const featBlock = blocks.find(b => b.section === 'featured_courses' && b.isActive);
        if (featBlock?.data?.courseIds && featBlock.data.courseIds.length > 0) {
          const allRes = await courseApi.getCourses();
          const allList = allRes.data?.courses || [];
          const matched = featBlock.data.courseIds.map(id => allList.find(c => (c._id || c.id) === id)).filter(Boolean);
          if (matched.length > 0) {
            setFeaturedCourses(matched);
          }
        }

        // 2. Batch Zero Student Results CMS Block
        const resultsBlock = blocks.find(b => b.section === 'student-results' && b.isActive);
        if (resultsBlock?.data) {
          setStudentResultsCms(resultsBlock.data);
        }

        // 3. Live Classes & Workshops CMS Block
        const liveBlock = blocks.find(b => (b.section === 'live_classes_workshops' || b.section === 'live-workshops') && b.isActive);
        if (liveBlock?.data) {
          setLiveClassesCms(liveBlock.data);
        }

        // 4. Specific Student Ratings / Testimonials CMS Block
        const testBlock = blocks.find(b => (b.section === 'testimonials' || b.section === 'student_ratings') && b.isActive);
        if (testBlock?.data) {
          setTestimonialsCms(testBlock.data);
        }

        // 5. FAQ CMS Block
        const faqBlock = blocks.find(b => b.section === 'faqs' && b.isActive);
        if (faqBlock?.data?.faqs) {
          setFaqsCms(faqBlock.data.faqs);
        }
      } catch (error) {
        console.warn('Using sample CMS results fallback:', error.message);
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

      {/* 1. Full-Screen Hero Section (100% Viewport Edge-to-Edge with 0px Right Padding) */}
      <section className="relative min-h-screen w-full flex items-center pt-28 pb-16 overflow-hidden">
        
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
        <div className="w-full relative z-10 px-6 sm:px-10 lg:px-16 flex items-center min-h-[72vh]">
          
          <div className="flex flex-col items-start text-left max-w-xl lg:max-w-2xl pt-4">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold font-manrope tracking-tight leading-[1.12] text-slate-900 mb-5">
              {isHindi ? (
                <span>
                  ऐसी{' '}
                  <span className="font-extrabold italic text-[#FF6B35]">
                    स्किल्स
                  </span>{' '}
                  सीखें जो <SquigglyText>आगे ले जाएं</SquigglyText>
                </span>
              ) : (
                <span>
                  Learn{' '}
                  <span className="font-extrabold italic text-[#FF6B35]">
                    skills
                  </span>{' '}
                  that <SquigglyText>move you forward</SquigglyText>
                </span>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-700 mb-8 max-w-lg font-medium leading-relaxed">
              {getTranslation(
                t,
                'hero.subtitle',
                "India's most visual learning platform. Master real-world skills with expert-led courses in Hindi & English."
              )}
            </p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link to="/courses">
                <button className="w-full sm:w-auto px-8 py-3.5 text-base font-bold rounded-full bg-[#3B82F6] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all cursor-pointer">
                  Explore Courses
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
                className="w-full sm:w-auto px-8 py-3.5 text-base font-bold rounded-full border border-slate-300/80 bg-white/80 backdrop-blur-md text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
              >
                {isHindi ? 'सीखना शुरू करें' : 'Start Learning'}
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
              <h2 className="text-3xl md:text-4xl font-manrope font-bold mb-4">
                <TextEffect preset="fade-up">Featured courses</TextEffect>
              </h2>
              <p className="text-[var(--ink-muted)] text-lg max-w-xl">
                Hand-picked by our experts, these courses represent the best of what ClassConnect has to offer.
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
                  <FeaturedCourseCard course={course} />
                </InView>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Live Classes & Workshops Section (Directly Below Featured Courses) */}
      <LiveClassesWorkshopsSection />

      {/* 7. How It Works Section */}
      <HowItWorksFlowSection />

      {/* 8. Arc Orbit Stats & Merged CTA Section */}
      <ArcOrbitStatsCtaSection />

      {/* 9. Compare Your Options Comparison Chart */}
      <CompareOptionsSection />

      {/* 10. Merged Side-by-Side Section: Student Loved Stories (Left) + FAQs (Right) */}
      <MergedTestimonialsFaqSection />

      {/* 11. Student Video Testimonials Showcase */}
      <StudentVideoTestimonialsSection />

      <Footer />
    </div>
  );
}
