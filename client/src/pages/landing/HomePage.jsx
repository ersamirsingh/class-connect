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
import { courseApi } from '../../api/models/course.api';
import { categoryApi } from '../../api/models/category.api';

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
  const [categories, setCategories] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [isLoadingCats, setIsLoadingCats] = useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        setCategories(response.data?.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      } finally {
        setIsLoadingCats(false);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await courseApi.getCourses();
        const allCourses = response.data?.courses || [];
        setFeaturedCourses(allCourses.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch featured courses', error);
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
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] overflow-x-hidden font-inter">
      <FloatingNav />

      {/* 1. Hero Section */}
      <section className="relative pt-[calc(var(--space-section)*1.5)] pb-[var(--space-section)] px-6 lg:px-[var(--space-page)] overflow-hidden">
        {/* Aura Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--aura-violet)] opacity-60 blur-[120px] mix-blend-multiply" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-[var(--aura-peach)] opacity-60 blur-[120px] mix-blend-multiply" />
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] rounded-full bg-[var(--aura-blue)] opacity-60 blur-[120px] mix-blend-multiply" />
        </div>

        <div className="max-w-[var(--max-width)] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col items-start z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-pill)] bg-[var(--primary-soft)] text-[var(--primary-deep)] text-sm font-semibold mb-6 shadow-sm border border-[var(--primary)]/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
              </span>
              Luminous OS 2.0 is Live
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[64px] leading-[1.1] font-manrope font-extrabold tracking-tight mb-6">
              <SplitText 
                text={getTranslation(t, 'hero.headline', 'Master the skills of the future')} 
                delay={40} 
              />
            </h1>

            <div className="text-lg md:text-xl text-[var(--ink-muted)] mb-10 max-w-xl font-medium leading-relaxed">
              <TextEffect preset="fade-up" delay={0.4}>
                {getTranslation(t, 'hero.subtitle', 'Join thousands of learners elevating their careers with cinematic, expert-led courses designed for real-world impact.')}
              </TextEffect>
            </div>

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

      {/* 3. Categories Section */}
      <section className="py-[var(--space-section)] px-6 lg:px-[var(--space-page)] relative">
        <div className="max-w-[var(--max-width)] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-manrope font-bold mb-4">
              <TextEffect preset="fade-up">Find your path</TextEffect>
            </h2>
            <p className="text-[var(--ink-muted)] text-lg max-w-2xl mx-auto">
              Explore our curated selection of disciplines designed to take you from beginner to professional.
            </p>
          </div>

          {isLoadingCats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-40 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category, idx) => (
                <InView key={category._id || idx} delay={idx * 0.1}>
                  <Link to={`/courses?category=${category.slug || category._id}`}>
                    <div className="group relative h-40 p-6 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300 overflow-hidden flex flex-col justify-end">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-soft)] rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none translate-x-1/2 -translate-y-1/2" />
                      
                      <div className="mb-auto">
                        <div className="w-10 h-10 rounded-lg bg-[var(--canvas)] flex items-center justify-center text-[var(--primary)] group-hover:scale-110 transition-transform duration-300">
                          {/* Fallback icon if no category image/icon exists */}
                          <MonitorPlay className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-lg font-manrope group-hover:text-[var(--primary)] transition-colors">
                        {category.name}
                      </h3>
                      {category.courseCount !== undefined && (
                        <p className="text-sm text-[var(--ink-muted)] mt-1">{category.courseCount} courses</p>
                      )}
                    </div>
                  </Link>
                </InView>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Featured Courses Section */}
      <section className="py-[var(--space-section)] px-6 lg:px-[var(--space-page)] bg-[var(--surface)]">
        <div className="max-w-[var(--max-width)] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-manrope font-bold mb-4">
                <TextEffect preset="fade-up">Featured courses</TextEffect>
              </h2>
              <p className="text-[var(--ink-muted)] text-lg max-w-xl">
                Hand-picked by our experts, these courses represent the best of what Luminous has to offer.
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
                <InView key={course._id} delay={idx * 0.1}>
                  <Link to={`/courses/${course.slug || course._id}`} className="block h-full">
                    <SpotlightCard className="h-full bg-[var(--canvas)] border border-[var(--border)] overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300">
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
                            <span className="text-sm font-bold">{course.averageRating || '4.8'}</span>
                            <span className="text-xs text-[var(--ink-muted)]">({course.reviewCount || 120})</span>
                          </div>
                          
                          <div className="font-manrope font-bold text-lg text-[var(--primary-deep)]">
                            {course.price === 0 ? 'Free' : `₹${course.price}`}
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </Link>
                </InView>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="py-[var(--space-section)] px-6 lg:px-[var(--space-page)] relative overflow-hidden">
        <div className="max-w-[var(--max-width)] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-manrope font-bold mb-4">
              <TextEffect preset="fade-up">How it works</TextEffect>
            </h2>
            <p className="text-[var(--ink-muted)] text-lg max-w-2xl mx-auto">
              Your journey to mastery starts here. It's simple, fast, and effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-[var(--primary-soft)] via-[var(--primary)] to-[var(--primary-soft)] z-0" />

            {[
              {
                icon: BookOpen,
                title: "1. Pick a course",
                desc: "Browse our extensive catalog and find the perfect course that matches your goals."
              },
              {
                icon: CreditCard,
                title: "2. Pay securely",
                desc: "Enroll with confidence using our secure, frictionless payment gateways."
              },
              {
                icon: Play,
                title: "3. Start learning",
                desc: "Get instant, lifetime access to high-quality video lessons and resources."
              }
            ].map((step, idx) => (
              <InView key={idx} delay={idx * 0.2}>
                <div className="relative z-10 flex flex-col items-center text-center p-6 bg-[var(--surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] border border-[var(--border)] hover:shadow-[var(--shadow-md)] transition-shadow">
                  <div className="w-24 h-24 rounded-full bg-[var(--canvas)] border-4 border-[var(--surface)] shadow-sm flex items-center justify-center mb-6">
                    <step.icon className="w-10 h-10 text-[var(--primary)]" />
                  </div>
                  <h3 className="text-xl font-bold font-manrope mb-3">{step.title}</h3>
                  <p className="text-[var(--ink-muted)]">{step.desc}</p>
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
