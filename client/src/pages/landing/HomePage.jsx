import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentApi } from '../../api/models/content.api';
import { courseApi } from '../../api/models/course.api';
import { categoryApi } from '../../api/models/category.api';
import { Navbar } from '../../components/guest/Navbar';
import { Footer } from '../../components/guest/Footer';
import { SphereCanvas } from '../../components/shared/SphereCanvas';
import {
  Sparkles,
  PlayCircle,
  ArrowRight,
  Code,
  Palette,
  Database,
  Smartphone,
  BarChart3,
  Cpu,
  Star,
  Quote,
  ShieldCheck,
  Zap,
  Users,
  Award,
  MessageSquare,
  FileCheck,
  Briefcase,
  TrendingUp,
  Clock,
  BookOpen,
  Layers,
  CheckCircle2,
  Play,
  Search,
  ShoppingCart,
  Radio,
  ExternalLink,
  Calendar,
  Globe,
  Compass,
} from 'lucide-react';
import { motion } from 'framer-motion';

const ICON_MAP = {
  Code,
  Palette,
  Database,
  Smartphone,
  BarChart3,
  Cpu,
  Layers,
};

const HOW_IT_WORKS_STEPS = [
  {
    step: '1',
    title: 'Browse',
    desc: 'Explore career tracks & masterclasses',
    icon: Search,
    color: '#5B54E8',
    bgColor: '#E4E2FB',
  },
  {
    step: '2',
    title: 'Enroll',
    desc: 'Instant access & verified invoice',
    icon: ShoppingCart,
    color: '#FF7A59',
    bgColor: '#FCE7D6',
  },
  {
    step: '3',
    title: 'Learn & Build',
    desc: 'Watch lectures & join live classes',
    icon: Play,
    color: '#06B6D4',
    bgColor: '#DCEFFB',
  },
  {
    step: '4',
    title: 'Get Certified',
    desc: 'Earn ISO verified certificate & referrals',
    icon: Award,
    color: '#2FA876',
    bgColor: '#DCF5E7',
  },
];

const VALUE_PROPS = [
  {
    icon: MessageSquare,
    title: '1-on-1 Live Doubt Resolution',
    desc: 'Instant live resolution with senior mentor teaching assistants so you never get stuck.',
    bgColor: '#E4E2FB',
    accentColor: '#5B54E8',
  },
  {
    icon: FileCheck,
    title: 'ATS Resume & Portfolio Audit',
    desc: 'Craft ATS-optimized resumes and publish production-grade open-source GitHub projects.',
    bgColor: '#DCEFFB',
    accentColor: '#06B6D4',
  },
  {
    icon: Briefcase,
    title: '500+ Partner Job Referrals',
    desc: 'Direct hiring referrals with top tech product companies across global and remote markets.',
    bgColor: '#DCF5E7',
    accentColor: '#2FA876',
  },
  {
    icon: Code,
    title: 'Hands-on Real World Projects',
    desc: 'Build real full-stack applications with modern industry architecture rather than passive watching.',
    bgColor: '#FCE7D6',
    accentColor: '#FF7A59',
  },
];

export const HomePage = () => {
  const [contentBlocks, setContentBlocks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [contentRes, catRes, courseRes] = await Promise.all([
          contentApi.getPublicContent('home'),
          categoryApi.getCategories(),
          courseApi.getCourses({ limit: 6 }),
        ]);

        if (contentRes.success && contentRes.data) {
          setContentBlocks(contentRes.data);
        }
        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }
        if (courseRes.success && courseRes.data) {
          setFeaturedCourses(courseRes.data.courses || courseRes.data);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroBlock = contentBlocks.find((b) => b.section === 'hero') || {
    title: 'Empower Your Future. Master Skills That Define Tomorrow.',
    subtitle: 'Join India\'s premier visual-first learning ecosystem. Learn from industry leaders, build production-ready projects, and accelerate your tech career with 1-on-1 mentorship.',
    data: {
      imageUrl: '/hero_showcase.jpg',
      ctaText: 'Explore All Courses',
      ctaLink: '/courses',
      badge: 'Visual-First Next-Gen Learning',
    },
  };

  const testimonials = contentBlocks.filter((b) => b.section === 'testimonial');
  const liveCourses = featuredCourses.filter((c) => c.type === 'live' || c.liveSchedule);

  return (
    <div className="min-h-screen bg-[#FBFAF7] dark:bg-[#090D16] flex flex-col justify-between transition-colors duration-200 text-[#2B2B38] dark:text-slate-100">
      <Navbar />

      {/* Main Container */}
      <main className="space-y-16 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        
        {/* SECTION 2: HERO BANNER WITH ANIMATED 3D SPHERE OF LINES & ATTRACTIVE IMAGE */}
        {loading ? (
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-xl animate-pulse h-96 flex items-center justify-center">
            <div className="space-y-4 text-center">
              <div className="w-48 h-6 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto" />
              <div className="w-80 h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl mx-auto" />
            </div>
          </div>
        ) : (
          <section className="bg-gradient-to-r from-white via-white to-[#F0EFFE] dark:from-[#111827] dark:via-[#111827] dark:to-[#1E1B4B] rounded-3xl p-6 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden relative">
            
            {/* Interactive 3D Sphere of Moving Lines directly inside the Main Hero Card */}
            <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full pointer-events-none opacity-50 dark:opacity-75 overflow-hidden z-0">
              <SphereCanvas />
            </div>

            {/* Left Hero Content with Punchy Headline */}
            <div className="max-w-2xl space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E4E2FB] dark:bg-slate-800 text-[#5B54E8] dark:text-[#818cf8] text-xs font-black border border-[#5B54E8]/20 shadow-sm">
                <Sparkles className="w-4 h-4 text-[#06B6D4]" />
                <span>{heroBlock.data?.badge || 'Visual-First Next-Gen Learning'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2B2B38] dark:text-white leading-[1.1] tracking-tight">
                {heroBlock.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-xl leading-relaxed">
                {heroBlock.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to={heroBlock.data?.ctaLink || '/courses'}
                  className="btn-visual bg-[#5B54E8] hover:bg-[#4740D2] text-white text-sm font-black px-8 py-4 rounded-2xl shadow-xl shadow-[#5B54E8]/30 flex items-center gap-2.5 min-h-[50px]"
                >
                  <Compass className="w-5 h-5" />
                  <span>{heroBlock.data?.ctaText || 'Explore All Courses'}</span>
                </Link>
                <Link
                  to="/signup"
                  className="btn-visual bg-[#FF7A59] hover:bg-[#E56848] text-white text-sm font-black px-8 py-4 rounded-2xl shadow-xl shadow-[#FF7A59]/30 flex items-center gap-2.5 min-h-[50px]"
                >
                  <span>Start Free Account</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Trust Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800">
                <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800 shadow-xs">
                  <div className="text-2xl font-black text-[#5B54E8]">100k+</div>
                  <div className="text-[11px] font-bold text-slate-500">Active Students</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800 shadow-xs">
                  <div className="text-2xl font-black text-[#06B6D4]">500+</div>
                  <div className="text-[11px] font-bold text-slate-500">Hiring Partners</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center gap-1 text-2xl font-black text-[#E8A23D]">
                    <span>4.9</span>
                    <Star className="w-4 h-4 fill-[#E8A23D]" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-500">Learner Rating</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800 shadow-xs">
                  <div className="text-2xl font-black text-[#2FA876]">100%</div>
                  <div className="text-[11px] font-bold text-slate-500">Job Referrals</div>
                </div>
              </div>
            </div>

          </section>
        )}

        {/* SECTION 3: CATEGORY TILES (COLOR-CODED BIG TILES) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#5B54E8]">Career Paths</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2B2B38] dark:text-white tracking-tight">Explore By Technology Track</h2>
            </div>
            <Link to="/courses" className="text-xs font-extrabold text-[#06B6D4] hover:underline flex items-center gap-1">
              View All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(categories.length > 0
              ? categories
              : [
                  { _id: 'html', name: 'HTML5 & Web Semantics', description: 'Semantic tags, forms, and web structure', color: '#E44D26' },
                  { _id: 'css', name: 'CSS3 & Responsive Design', description: 'Flexbox, Grid, animations, and Tailwind', color: '#264DE4' },
                  { _id: 'js', name: 'Modern JavaScript ES6+', description: 'Async/await, DOM, closures, and ES6', color: '#F7DF1E' },
                  { _id: 'react', name: 'React.js 18 & Frontend', description: 'Hooks, state management, and SPA architecture', color: '#61DAFB' },
                  { _id: 'express', name: 'Express.js & Node.js API', description: 'REST APIs, middleware, and controllers', color: '#339933' },
                  { _id: 'mongo', name: 'MongoDB & Data Modeling', description: 'Collections, Mongoose schemas, and queries', color: '#47A248' },
                ]
            ).map((cat, idx) => {
              const IconComp = ICON_MAP[cat.icon] || Code;
              return (
                <motion.div key={cat._id || idx} whileHover={{ y: -3 }}>
                  <Link
                    to={`/courses?category=${cat._id}`}
                    className="bg-white dark:bg-[#111827] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md cursor-pointer flex items-center justify-between group block transition-all hover:shadow-xl hover:border-[#5B54E8]/50 min-h-[72px]"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {cat.coverImage ? (
                        <img
                          src={cat.coverImage}
                          alt={cat.name}
                          className="w-14 h-14 rounded-2xl object-cover shadow-sm shrink-0 ring-2 ring-slate-100 dark:ring-slate-800"
                        />
                      ) : (
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 font-black"
                          style={{ backgroundColor: cat.color || '#5B54E8' }}
                        >
                          <IconComp className="w-7 h-7" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-black text-base text-[#2B2B38] dark:text-white group-hover:text-[#5B54E8] transition-colors truncate">
                          {cat.name}
                        </h3>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                          {cat.description || 'Interactive masterclass & projects'}
                        </span>
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-[#5B54E8] group-hover:text-white transition-all ml-2">
                      <ArrowRight className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-white" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: FEATURED / POPULAR COURSES */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF7A59] flex items-center gap-1">
                🔥 Popular Right Now
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2B2B38] dark:text-white tracking-tight">Top Featured Courses</h2>
            </div>
            <Link to="/courses" className="text-xs font-extrabold text-[#5B54E8] hover:underline flex items-center gap-1">
              Browse All Programs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.slice(0, 6).map((c) => (
              <div key={c._id} className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md overflow-hidden flex flex-col justify-between group">
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img
                      src={c.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md ${c.type === 'live' ? 'bg-[#FF7A59]' : 'bg-[#5B54E8]'}`}>
                        {c.type === 'live' ? '🔴 Pos 1: Live Class' : '📹 Pos 2: Recorded'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                      <div className="flex items-center gap-0.5 text-[#E8A23D]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#E8A23D]" />
                        ))}
                      </div>
                      <span className="text-slate-500 font-bold">
                        {c.sections?.reduce((acc, s) => acc + (s.lectures?.length || 0), 0) || 4} Lectures
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-[#2B2B38] dark:text-white line-clamp-2 leading-snug group-hover:text-[#5B54E8] transition-colors">
                      {c.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-medium">
                      {c.subtitle || c.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through mr-1.5">${c.price ? c.price + 20 : '69'}</span>
                    <span className="text-lg font-black text-[#2B2B38] dark:text-white">${c.discountPrice || c.price || '49'}</span>
                  </div>
                  <Link
                    to={`/courses/${c.slug || c._id}`}
                    className="btn-visual bg-[#5B54E8] hover:bg-[#4740D2] text-white text-xs px-4 py-2 font-black"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: LIVE CLASSES STRIP */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF7A59] flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-[#FF7A59] animate-pulse" /> Live Now & Upcoming Sessions
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2B2B38] dark:text-white tracking-tight">Interactive Live Masterclasses</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(liveCourses.length > 0 ? liveCourses : [
              {
                _id: 'live-demo-1',
                title: 'Full Stack Architecture & System Design',
                startTime: new Date(Date.now() + 1800000),
                status: 'live',
              },
              {
                _id: 'live-demo-2',
                title: 'React 18 Server Components & Custom Hooks',
                startTime: new Date(Date.now() + 86400000),
                status: 'upcoming',
              },
            ]).map((lc, idx) => (
              <div
                key={lc._id || idx}
                className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#FF7A59] text-white text-[10px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
                      🔴 LIVE NOW
                    </span>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Today
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#2B2B38] dark:text-white">{lc.title}</h3>
                </div>

                <Link
                  to={`/courses/${lc._id}`}
                  className="btn-visual bg-[#FF7A59] hover:bg-[#E56848] text-white w-full text-xs font-black py-2.5 rounded-2xl flex items-center justify-center gap-2 shadow-md"
                >
                  <ExternalLink className="w-4 h-4" /> Join Live Room
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: HOW IT WORKS (4-STEP VISUAL EXPLAINER FUNNEL) */}
        <section className="bg-white dark:bg-[#111827] rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#5B54E8]">Simple 4-Step Process</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2B2B38] dark:text-white tracking-tight">How ClassConnect Works</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">From first enrollment to verified certificate and job referral.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {HOW_IT_WORKS_STEPS.map((stepItem, idx) => {
              const StepIcon = stepItem.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 text-center flex flex-col items-center justify-between"
                  style={{ backgroundColor: stepItem.bgColor }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md" style={{ backgroundColor: stepItem.color }}>
                    <StepIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Step 0{stepItem.step}</span>
                    <h3 className="font-black text-lg text-[#2B2B38] mt-1">{stepItem.title}</h3>
                    <p className="text-xs text-slate-600 font-medium mt-1">{stepItem.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 7: TESTIMONIALS */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#06B6D4]">Wall of Fame</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2B2B38] dark:text-white tracking-tight">Student Stories & Reviews</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(testimonials.length > 0 ? testimonials : [
              {
                _id: 't1',
                data: {
                  author: 'Aman Sharma',
                  authorRole: 'Software Engineer @ TechCorp',
                  authorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
                  comment: 'The technology masterclasses completely transformed my skills. Live doubt resolution and real GitHub projects helped me land my dream job!',
                  rating: 5,
                },
              },
              {
                _id: 't2',
                data: {
                  author: 'Priya Patel',
                  authorRole: 'Frontend Lead @ InnovateX',
                  authorPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
                  comment: 'ClassConnect teaches production-ready code with amazing design guidelines. The video player and notes drawer are super smooth!',
                  rating: 5,
                },
              },
            ]).map((t, idx) => (
              <div key={t._id || idx} className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4 relative">
                <Quote className="w-8 h-8 text-[#5B54E8]/10 absolute right-6 top-6 pointer-events-none" />

                <div className="flex items-center gap-1 text-[#E8A23D]">
                  {[...Array(t.data?.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E8A23D]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-[#2B2B38] dark:text-slate-200 leading-relaxed italic">
                  "{t.data?.comment}"
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.data?.authorPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                      alt={t.data?.author}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#5B54E8]"
                    />
                    <div>
                      <div className="text-xs font-black text-[#2B2B38] dark:text-white">{t.data?.author}</div>
                      <div className="text-[10px] font-bold text-slate-400">{t.data?.authorRole}</div>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#2FA876]/10 text-[#2FA876] text-[10px] font-black uppercase flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> 140% Salary Hike
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 8: TRUST / STATS BAND */}
        <section className="bg-gradient-to-r from-[#2B2B38] via-[#1E293B] to-[#1E1B4B] rounded-3xl p-8 sm:p-10 text-white shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#5B54E8]">100k+</div>
            <div className="text-xs font-bold text-slate-300 mt-1">Students Enrolled</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#FF7A59]">50+</div>
            <div className="text-xs font-bold text-slate-300 mt-1">Published Courses</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#06B6D4]">98%</div>
            <div className="text-xs font-bold text-slate-300 mt-1">Completion Rate</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2FA876]">200+</div>
            <div className="text-xs font-bold text-slate-300 mt-1">Live Sessions Run</div>
          </div>
        </section>

        {/* SECTION 9: FINAL CTA BANNER */}
        <section className="bg-gradient-to-r from-[#5B54E8] via-[#4740D2] to-[#1E1B4B] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider text-white backdrop-blur-md">
              Start Your Career Today
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">Ready to Master Modern Technologies?</h2>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              Join 100,000+ students building production-ready projects with ClassConnect.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/courses"
              className="btn-visual bg-[#FF7A59] hover:bg-[#E56848] text-white text-sm font-black px-8 py-3.5 shadow-xl flex items-center gap-2 min-h-[48px]"
            >
              <BookOpen className="w-5 h-5" /> Explore All Masterclasses
            </Link>
            <Link
              to="/signup"
              className="btn-visual bg-white text-[#2B2B38] hover:bg-slate-100 text-sm font-black px-8 py-3.5 shadow-xl flex items-center gap-2 min-h-[48px]"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};
