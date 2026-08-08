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
  Briefcase,
  Radio,
  Quote,
  CheckCircle2
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
import { CategoryCraftDeck } from '../../components/home/CategoryCraftDeck';
import { GlowingEffect } from '../../components/motion/GlowingEffect';
import { courseApi } from '../../api/models/course.api';
import { categoryApi } from '../../api/models/category.api';
import { contentApi } from '../../api/models/content.api';
import { SAMPLE_CATEGORIES } from '../../data/sampleData';

// --- Sample Testimonials Data ---
const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Full-Stack Developer at TechCorp",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    text: "ClassConnect transformed how I learn. The visual course breakdown and live sessions gave me the practical confidence to crack my dream interview!",
    course: "Full-Stack Web Engineering"
  },
  {
    name: "Priya Patel",
    role: "UI/UX Designer",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    text: "The bilingual teaching style (Hindi + English) was a game changer for me. Concepts are explained so clearly with real-world projects.",
    course: "UI/UX Design Masterclass"
  },
  {
    name: "Rohan Verma",
    role: "Data Analyst",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    text: "Lifetime access and verifiable certificates gave my resume an instant boost. Highly recommended for anyone starting from scratch!",
    course: "Data Science & Analytics"
  }
];

// --- Live Classes Mock Data ---
const liveClassesSample = [
  {
    id: 'live-1',
    title: 'Advanced React 19 & Server Components Masterclass',
    instructor: 'Rohan Sharma',
    time: 'Today • 7:00 PM IST',
    attendees: 340,
    isLiveNow: true,
  },
  {
    id: 'live-2',
    title: 'Full-Stack Architecture & Microservices Q&A',
    instructor: 'Sneha Gupta',
    time: 'Tomorrow • 6:00 PM IST',
    attendees: 215,
    isLiveNow: false,
  },
  {
    id: 'live-3',
    title: 'AI Engineering & LLM Integration Live Workshop',
    instructor: 'Vikram Mehta',
    time: 'Aug 4 • 8:00 PM IST',
    attendees: 490,
    isLiveNow: false,
  }
];

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
  const { t } = useLanguage();
  const { user } = useAuth();
  const [categories, setCategories] = useState(SAMPLE_CATEGORIES);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [featuredHeader, setFeaturedHeader] = useState({ title: 'Featured courses', subtitle: 'Hand-picked by our experts, these courses represent the best of what ClassConnect has to offer.' });
  const [isLoadingCats, setIsLoadingCats] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        const apiCats = Array.isArray(response.data)
          ? response.data
          : (response.data?.categories || (Array.isArray(response) ? response : []));
        if (apiCats.length > 0) {
          setCategories(apiCats);
        }
      } catch (error) {
        console.warn('Using sample categories fallback:', error.message);
      }
    };

    const fetchCourses = async () => {
      setIsLoadingCourses(true);
      try {
        const response = await contentApi.getPublicContent('home');
        const blocks = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
        const featuredBlock = blocks.find(b => b.section === 'featured_courses');
        if (featuredBlock && featuredBlock.isActive) {
          setFeaturedCourses(featuredBlock.data?.courses || []);
          if (featuredBlock.title) {
            setFeaturedHeader(prev => ({
              title: featuredBlock.title,
              subtitle: featuredBlock.subtitle || prev.subtitle
            }));
          }
        } else {
          setFeaturedCourses([]);
        }
      } catch (error) {
        console.warn('Failed to fetch admin featured courses:', error.message);
        setFeaturedCourses([]);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCategories();
    fetchCourses();
  }, []);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] overflow-x-hidden selection:bg-[var(--primary-soft)] selection:text-[var(--primary-deep)]">
      <FloatingNav />

      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-6 lg:px-[var(--space-page)] overflow-hidden">
        {/* Subtle Background Aura Gradients */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-10 w-96 h-96 rounded-full bg-[var(--aura-violet)] filter blur-[100px] opacity-60 animate-pulse" />
          <div className="absolute top-1/3 -right-10 w-96 h-96 rounded-full bg-[var(--aura-blue)] filter blur-[100px] opacity-50" />
          <div className="absolute -bottom-10 left-1/3 w-96 h-96 rounded-full bg-[var(--aura-peach)] filter blur-[120px] opacity-40" />
        </div>

        <div className="max-w-[var(--max-width)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Column: Text Content */}
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-sm font-semibold mb-6 border border-[var(--primary)]/10"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-ping" />
              Luminous Learning OS 2026
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-manrope tracking-tight leading-[1.1] mb-6">
              <SplitText text={getTranslation(t, 'hero.headline', 'Learn skills that move you forward.')} />
            </h1>

            <p className="text-lg sm:text-xl text-[var(--ink-muted)] mb-8 max-w-xl font-normal leading-relaxed">
              {getTranslation(
                t,
                'hero.subtitle',
                "India's most visual learning platform. Master real-world skills with expert-led courses in Hindi & English."
              )}
            </p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link to="/courses">
                <ShimmerButton className="w-full sm:w-auto px-8 py-4 text-base font-semibold shadow-[var(--shadow-md)]">
                  Explore Courses
                </ShimmerButton>
              </Link>
              {!user && (
                <Link to="/auth">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-[var(--radius-pill)] border-2 border-[var(--border)] bg-transparent text-[var(--ink)] font-semibold hover:bg-[var(--surface)] hover:border-[var(--primary)]/20 transition-all duration-300 min-h-[44px]">
                    Start Learning
                  </button>
                </Link>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-12 flex items-center gap-8 border-t border-[var(--border)] pt-8 w-full max-w-md"
            >
              <div>
                <div className="flex items-baseline gap-0.5 text-2xl font-bold font-manrope">
                  <NumberTicker value={10000} />+
                </div>
                <div className="text-sm text-[var(--ink-muted)] font-medium">Active Learners</div>
              </div>
              <div className="w-px h-10 bg-[var(--border)]"></div>
              <div>
                <div className="flex items-baseline gap-1 text-2xl font-bold font-manrope">
                  <NumberTicker value={4} />.<NumberTicker value={8} /> <Star className="w-5 h-5 fill-[var(--accent)] text-[var(--accent)]" />
                </div>
                <div className="text-sm text-[var(--ink-muted)] font-medium">Average Rating</div>
              </div>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="hidden lg:block relative z-10"
          >
            <div className="relative rounded-[24px] overflow-hidden shadow-[var(--shadow-lg)] aspect-[4/3] bg-[var(--surface)] border border-[var(--border)] p-2">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-soft)] to-[var(--aura-peach)] opacity-30"></div>
              
              <div className="w-full h-full rounded-[16px] overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)] via-purple-500 to-[var(--accent)] mix-blend-overlay opacity-80 group-hover:scale-105 transition-transform duration-700"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Students learning" 
                  className="w-full h-full object-cover mix-blend-multiply opacity-80"
                />
                
                {/* Floating UI Element */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center">
                      <Play className="w-5 h-5 fill-white text-white ml-1" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">Full-Stack Development</div>
                      <div className="text-white/80 text-sm">Next lesson starting now</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Trust Ribbon */}
      <section className="py-8 border-y border-[var(--border)] bg-[var(--surface)]/50 backdrop-blur-sm overflow-hidden">
        <Marquee pauseOnHover className="[--duration:40s]">
          {[
            { icon: Users, text: "10,000+ Learners" },
            { icon: Star, text: "4.8★ Rating" },
            { icon: GraduationCap, text: "Expert Instructors" },
            { icon: Globe2, text: "Hindi & English" },
            { icon: Award, text: "Verifiable Certificates" },
            { icon: Briefcase, text: "Job-Ready Skills" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 px-6 py-3 mx-4 rounded-full bg-[var(--canvas)] border border-[var(--border)] shadow-sm">
              <item.icon className="w-5 h-5 text-[var(--primary)]" />
              <span className="font-semibold text-[var(--ink)]">{item.text}</span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* 3. Category Crafts Deck (Find Your Path - Auto-scrolling Interface Crafts style) */}
      <CategoryCraftDeck categories={categories} />

      {/* 4. Featured Courses Section */}
      <section className="py-[var(--space-section)] px-6 lg:px-[var(--space-page)] bg-[var(--surface)]">
        <div className="max-w-[var(--max-width)] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-manrope font-bold mb-4">
                <TextEffect preset="fade-up">{featuredHeader.title}</TextEffect>
              </h2>
              <p className="text-[var(--ink-muted)] text-lg max-w-xl">
                {featuredHeader.subtitle}
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
          ) : featuredCourses.length === 0 ? (
            <div className="text-center py-16 px-6 bg-[var(--canvas)] rounded-[var(--radius-xl)] border border-dashed border-[var(--border)] max-w-2xl mx-auto">
              <BookOpen className="w-12 h-12 text-[var(--ink-muted)] mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold font-manrope mb-2">No Featured Courses Configured</h3>
              <p className="text-sm text-[var(--ink-muted)] mb-6">Our admin team is currently updating the featured course selection. Check back soon or explore our full catalog below.</p>
              <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-full text-xs font-extrabold hover:bg-[var(--primary-soft)] transition-colors">
                Explore All Courses <ArrowRight className="w-4 h-4" />
              </Link>
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
                          <p className="text-[var(--ink-muted)] text-sm mb-4 line-clamp-2">
                            {course.subtitle || course.description}
                          </p>
                          
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

      {/* 4.5. Live Classes Strip (Flat Row with Live Now Pulsing Badge) */}
      <section className="py-12 px-6 lg:px-[var(--space-page)] bg-[var(--canvas)] border-y border-[var(--border)]">
        <div className="max-w-[var(--max-width)] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <h2 className="text-2xl font-bold font-manrope">Live Classes & Workshops</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-500 text-white uppercase tracking-wider">Live Now</span>
            </div>
            <Link to="/courses" className="text-sm font-semibold text-[var(--primary)] hover:underline flex items-center gap-1">
              View Schedule <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Flat Horizontal Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveClassesSample.map((session) => (
              <div key={session.id} className="p-6 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col justify-between hover:border-[var(--primary)]/50 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {session.isLiveNow ? (
                      <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1">
                        <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE NOW
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold">
                        {session.time}
                      </span>
                    )}
                    <span className="text-xs text-[var(--ink-muted)] font-medium">{session.attendees} registered</span>
                  </div>
                  <h3 className="font-bold text-lg font-manrope mb-2 line-clamp-2">{session.title}</h3>
                  <p className="text-sm text-[var(--ink-muted)]">Host: <span className="font-semibold text-[var(--ink)]">{session.instructor}</span></p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--primary)]">Interactive Session</span>
                  <Link to="/courses" className="px-4 py-2 text-xs font-bold rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-deep)] transition-colors">
                    {session.isLiveNow ? 'Join Room' : 'Reserve Spot'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works Section (4-Step Visual: Browse -> Buy -> Learn -> Get Certified) */}
      <section className="py-[var(--space-section)] px-6 lg:px-[var(--space-page)] relative overflow-hidden">
        <div className="max-w-[var(--max-width)] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-manrope font-bold mb-4">
              <TextEffect preset="fade-up">How it works</TextEffect>
            </h2>
            <p className="text-[var(--ink-muted)] text-lg max-w-2xl mx-auto">
              Your 4-step path from curiosity to certified expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              {
                icon: BookOpen,
                step: "1. Browse",
                title: "Explore Courses",
                desc: "Filter through structured live and recorded courses across tech, business, and design."
              },
              {
                icon: CreditCard,
                step: "2. Buy",
                title: "Instant Access",
                desc: "Seamless, secure checkout with Razorpay UPI QR or Stripe card payments."
              },
              {
                icon: Play,
                step: "3. Learn",
                title: "Interactive Practice",
                desc: "Watch HLS video lectures, join live interactive rooms, and solve hands-on tasks."
              },
              {
                icon: Award,
                step: "4. Get Certified",
                title: "Earn Certificate",
                desc: "Track your progress to 100% completion and download your verifiable certificate."
              }
            ].map((item, idx) => (
              <InView key={idx} delay={idx * 0.15}>
                <div className="relative z-10 flex flex-col items-center text-center p-6 bg-[var(--surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] border border-[var(--border)] hover:shadow-[var(--shadow-md)] hover:border-[var(--primary)]/30 transition-all h-full">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mb-5 font-bold shadow-sm">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-black text-[var(--primary)] uppercase tracking-wider mb-1">{item.step}</span>
                  <h3 className="text-lg font-bold font-manrope mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--ink-muted)] leading-relaxed">{item.desc}</p>
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* 5.5. Testimonials Carousel (Photo-First) */}
      <section className="py-[var(--space-section)] px-6 lg:px-[var(--space-page)] bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-[var(--max-width)] mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-bold mb-4">
              <Quote className="w-3.5 h-3.5" /> Student Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-manrope font-bold mb-4">
              Loved by 10,000+ Learners
            </h2>
            <p className="text-[var(--ink-muted)] text-lg max-w-xl mx-auto">
              Read how students across India built career skills and transformed their futures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <InView key={idx} delay={idx * 0.15}>
                <div className="bg-[var(--canvas)] p-8 rounded-[var(--radius-xl)] border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col justify-between h-full hover:shadow-[var(--shadow-md)] transition-all">
                  <div>
                    <div className="flex items-center gap-1 text-[var(--accent)] mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[var(--accent)]" />
                      ))}
                    </div>
                    <p className="text-[var(--ink)] font-medium leading-relaxed mb-8 italic">
                      "{item.text}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-[var(--border)]">
                    <img 
                      src={item.photo} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-[var(--primary-soft)]"
                    />
                    <div>
                      <h4 className="font-bold text-sm font-manrope text-[var(--ink)]">{item.name}</h4>
                      <p className="text-xs text-[var(--ink-muted)]">{item.role}</p>
                      <span className="text-[10px] font-semibold text-[var(--primary)]">{item.course}</span>
                    </div>
                  </div>
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Stats Section */}
      <section className="py-20 px-6 lg:px-[var(--space-page)] relative overflow-hidden bg-[var(--ink)] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0idHJhbnNwYXJlbnQiPjwvcmVjdD4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE1KSI+PC9jaXJjbGU+Cjwvc3ZnPg==')] opacity-50" />
        
        <div className="max-w-[var(--max-width)] mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Students Worldwide", value: 10000, suffix: "+" },
              { label: "Premium Courses", value: 50, suffix: "+" },
              { label: "Average Rating", value: 4.8, suffix: "/5" },
              { label: "Support", value: 24, suffix: "/7" }
            ].map((stat, idx) => (
              <InView key={idx} delay={idx * 0.1}>
                <div className="flex flex-col items-center">
                  <div className="text-4xl md:text-5xl font-manrope font-black mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                    <NumberTicker value={stat.value} />{stat.suffix}
                  </div>
                  <div className="text-white/70 font-medium text-sm md:text-base uppercase tracking-wider">{stat.label}</div>
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-[var(--space-section)] px-6 lg:px-[var(--space-page)] bg-[var(--surface)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-manrope font-bold mb-4">
              <TextEffect preset="slide">Frequently asked questions</TextEffect>
            </h2>
            <p className="text-[var(--ink-muted)] text-lg">
              Everything you need to know about the product and billing.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <InView key={idx} delay={idx * 0.05}>
                <div className="border border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--canvas)] overflow-hidden">
                  <button
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none min-h-[44px]"
                    onClick={() => toggleFaq(idx)}
                  >
                    <span className="font-semibold text-lg font-manrope">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openFaqIndex === idx ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 ml-4"
                    >
                      <ChevronDown className="w-5 h-5 text-[var(--ink-muted)]" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaqIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-5 text-[var(--ink-muted)] leading-relaxed border-t border-[var(--border)] pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA Section */}
      <section className="py-[calc(var(--space-section)*1.2)] px-6 lg:px-[var(--space-page)] relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[var(--primary)] opacity-[0.03] z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[var(--primary-soft)] to-transparent rounded-full blur-[100px] opacity-50 z-0 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <InView>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-manrope font-extrabold tracking-tight mb-8">
              Ready to start learning?
            </h2>
            <p className="text-xl text-[var(--ink-muted)] mb-12 max-w-2xl mx-auto">
              Join our community of learners today and take the first step towards achieving your goals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/courses">
                <ShimmerButton className="px-10 py-5 text-lg font-semibold shadow-[var(--shadow-lg)]">
                  Explore All Courses
                </ShimmerButton>
              </Link>
              {!user && (
                <Link to="/auth">
                  <button className="px-10 py-5 rounded-[var(--radius-pill)] border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] font-semibold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300 min-h-[44px] shadow-sm">
                    Create Free Account
                  </button>
                </Link>
              )}
            </div>
          </InView>
        </div>
      </section>

      <Footer />
    </div>
  );
}
