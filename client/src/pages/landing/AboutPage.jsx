import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, Sparkles, Globe, Award, ShieldCheck, Play, 
  Code, Trophy, Layers, ChevronRight, Star, Heart, Target, Users, BookOpen, 
  Check, FileText, Zap, ExternalLink, ArrowUpRight, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';
import { InView } from '../../components/motion/InView';
import { NumberTicker } from '../../components/motion/NumberTicker';
import { useLanguage } from '../../context/LanguageContext';
import { ContactSupportSection } from '../../components/about/ContactSupportSection';

// Category Magazine Tiles Data (linking directly to /courses)
const CATEGORY_TILES = [
  {
    id: 'web-development',
    title: 'WEB DEVELOPMENT',
    titleHi: 'వెబ్ డెవలప్‌మెంట్',
    count: '12 Courses',
    desc: 'Master HTML, CSS, React 19, Node.js, Next.js & fullstack architecture.',
    image: '/assets/categories/web-development.jpg',
    accent: 'from-red-600 to-rose-600',
    tag: 'FULLSTACK',
  },
  {
    id: 'app-development',
    title: 'APP DEVELOPMENT',
    titleHi: 'యాప్ డెవలప్‌మెంట్',
    count: '8 Courses',
    desc: 'Build Android & iOS apps with React Native, Flutter, Swift & Mobile APIs.',
    image: '/assets/categories/app-development.jpg',
    accent: 'from-emerald-600 to-teal-600',
    tag: 'MOBILE',
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX DESIGN',
    titleHi: 'యుఐ/యుఎక్స్ డిజైన్',
    count: '6 Courses',
    desc: 'Figma UI/UX, Motion Graphics, Premiere Pro & visual design systems.',
    image: '/assets/categories/ui-ux-design.jpg',
    accent: 'from-purple-600 to-pink-600',
    tag: 'CREATIVE',
  },
  {
    id: 'ai-data-science',
    title: 'AI & DATA SCIENCE',
    titleHi: 'ఎఐ & డేటా సైన్స్',
    count: '10 Courses',
    desc: 'Python, Machine Learning, OpenAI APIs, LLM Agents & Data Analytics.',
    image: '/assets/about_hero_lead.jpg',
    accent: 'from-blue-600 to-indigo-600',
    tag: 'FUTURE TECH',
  },
  {
    id: 'digital-marketing',
    title: 'DIGITAL MARKETING',
    titleHi: 'డిజిటల్ మార్కెటింగ్',
    count: '5 Courses',
    desc: 'SEO, performance marketing ads, social media growth & brand funnel strategy.',
    image: '/assets/categories/digital-marketing.jpg',
    accent: 'from-amber-500 to-orange-600',
    tag: 'GROWTH',
  },
  {
    id: 'cyber-security-cloud',
    title: 'CYBER SECURITY & CLOUD',
    titleHi: 'సైబర్ సెక్యూరిటీ & క్లౌడ్',
    count: '5 Courses',
    desc: 'AWS, Azure, Ethical Hacking, Network Security & DevOps infrastructure.',
    image: '/assets/categories/cyber-security-cloud.jpg',
    accent: 'from-teal-600 to-cyan-600',
    tag: 'SECURITY',
  },
];

// Approach 4-stage data
const APPROACH_STAGES = [
  {
    id: 'learn',
    word: 'LEARN',
    wordHi: 'सीखें',
    subtitle: 'Understand concepts through visual, structured lessons.',
    desc: 'Bilingual bite-sized video modules designed for clarity without confusing jargon.',
    icon: BookOpen,
    badge: 'STAGE 01',
    color: 'from-blue-500 to-indigo-600',
    details: ['Structured Video Lessons', 'Dual Audio (Hindi & English)', 'Lifetime Access'],
  },
  {
    id: 'practice',
    word: 'PRACTICE',
    wordHi: 'अभ्यास करें',
    subtitle: 'Build practical skills through projects and exercises.',
    desc: 'Interactive exercises, downloadable code starter files, and real-world assignments.',
    icon: Code,
    badge: 'STAGE 02',
    color: 'from-purple-500 to-pink-600',
    details: ['Real Project Handouts', 'Interactive Exercises', 'Source Code Access'],
  },
  {
    id: 'prove',
    word: 'PROVE',
    wordHi: 'प्रमाणित करें',
    subtitle: 'Earn certificates that demonstrate what you have completed.',
    desc: 'Verify your completion with shareable digital certificates and unique validation IDs.',
    icon: Award,
    badge: 'STAGE 03',
    color: 'from-amber-500 to-orange-600',
    details: ['Shareable Verified Badges', 'Unique Certificate ID', 'LinkedIn Ready'],
  },
  {
    id: 'grow',
    word: 'GROW',
    wordHi: 'आगे बढ़ें',
    subtitle: 'Use your skills to move toward better opportunities.',
    desc: 'Apply your new knowledge directly to freelance gigs, jobs, or personal projects.',
    icon: Trophy,
    badge: 'STAGE 04',
    color: 'from-emerald-500 to-teal-600',
    details: ['Portfolio Ready Output', 'Career Guidance', 'Skill Advancement'],
  },
];

// Why ClassConnect Exists interactive tabs
const WHY_TABS = [
  {
    id: 'video',
    title: 'Visual Lessons',
    desc: 'HD video lessons designed around real screen captures, clear diagrams, and zero fluff.',
    image: '/assets/students/video_poster_1.jpg',
  },
  {
    id: 'notes',
    title: 'Structured Notes',
    desc: 'Downloadable summary cheat-sheets and step-by-step guides for quick revision.',
    image: '/assets/students/video_poster_2.jpg',
  },
  {
    id: 'project',
    title: 'Practical Project',
    desc: 'Build real portfolio pieces instead of taking passive multiple-choice quizzes.',
    image: '/assets/students/video_poster_3.jpg',
  },
  {
    id: 'certificate',
    title: 'Milestone Certificate',
    desc: 'Receive a digital completion credential that honors your dedication and effort.',
    image: '/hero_showcase.jpg',
  },
];

export function AboutPage() {
  const { language } = useLanguage();
  const isTelugu = language === 'te';

  // Active states
  const [activeApproach, setActiveApproach] = useState('learn');
  const [activeWhyTab, setActiveWhyTab] = useState('video');
  const [langToggle, setLangToggle] = useState('te'); // 'te' or 'en'
  const [verifiedPreview, setVerifiedPreview] = useState(false);

  // Hero parallax scroll
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)] overflow-x-hidden selection:bg-purple-500 selection:text-white">
      <FloatingNav />

      {/* ==================================================
          1. HERO — "EDUCATION THAT MOVES WITH YOU"
      ================================================== */}
      <section ref={heroRef} className="relative pt-24 pb-20 md:pt-36 md:pb-28 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Ambient Background Aura */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[var(--primary)]/15 via-purple-500/10 to-[var(--accent)]/15 blur-[140px] -z-10" />

        <div className="text-center max-w-5xl mx-auto">
          {/* Subtle Editorial Top Tag */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] shadow-xs mb-8 text-xs sm:text-sm font-semibold tracking-wide text-[var(--ink-muted)]"
          >
            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
            <span>CLASSCONNECT EDITORIAL ABOUT STORY</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-manrope tracking-tight leading-[1.05] text-[var(--ink)] uppercase"
          >
            {isTelugu ? (
              <>
                సీఖనా ఆప్‌కో <br />
                <span className="font-cursive font-normal text-[#FF6B35] lowercase text-6xl sm:text-7xl md:text-8xl">
                  ఆగే బఢానా
                </span>{' '}
                చాహియే.
              </>
            ) : (
              <>
                LEARNING SHOULD <br />
                <span className="font-cursive font-normal text-[#FF6B35] lowercase text-6xl sm:text-7xl md:text-8xl">
                  move you
                </span>{' '}
                FORWARD.
              </>
            )}
          </motion.h1>

          {/* Small Editorial Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[var(--ink-muted)] font-medium leading-relaxed text-center"
          >
            ClassConnect is India's premier outcome-focused learning OS. Engineered for ambitious minds to master high-income skills through visual micro-lessons and real-world project execution.
          </motion.p>

          {/* CTA Buttons in Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center items-center gap-4"
          >
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--primary)] text-white font-extrabold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 group"
            >
              <span>{isTelugu ? 'सभी कोर्स देखें' : 'Explore All Courses'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#approach"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] font-bold text-sm hover:bg-[var(--canvas)] transition-colors"
            >
              <span>{isTelugu ? 'हमारा तरीका' : 'Our Approach'}</span>
            </a>
          </motion.div>
        </div>
      </section>



      {/* ==================================================
          3. "WHY CLASSCONNECT EXISTS"
      ================================================== */}
      <section className="py-24 md:py-36 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-bold tracking-wider uppercase">
              <span>OUR PURPOSE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-manrope leading-[1.08] tracking-tight uppercase text-[var(--ink)]">
              WE BUILT <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-purple-600">
                CLASSCONNECT
              </span> <br />
              FOR THE NEXT GENERATION.
            </h2>

            <p className="text-base sm:text-lg text-[var(--ink-muted)] font-normal leading-relaxed pt-2">
              Learning is changing. Students don't just need information anymore. They need skills they can apply, proof of what they know, and a clear path from learning to opportunity.
            </p>

            {/* Interactive Feature Switchers */}
            <div className="pt-4 space-y-3">
              {WHY_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveWhyTab(tab.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-4 ${
                    activeWhyTab === tab.id
                      ? 'bg-[var(--surface)] border-[var(--primary)] shadow-md'
                      : 'bg-transparent border-[var(--border)] hover:bg-[var(--surface)]/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    activeWhyTab === tab.id
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--canvas)] text-[var(--ink-muted)] border border-[var(--border)]'
                  }`}>
                    {activeWhyTab === tab.id ? <Check className="w-4 h-4" /> : '•'}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--ink)] font-manrope">
                      {tab.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-0.5">
                      {tab.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column Visual Sequence */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[32px] overflow-hidden border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xl">
              <AnimatePresence mode="wait">
                {WHY_TABS.map((tab) => (
                  tab.id === activeWhyTab && (
                    <motion.div
                      key={tab.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.4 }}
                      className="relative rounded-[24px] overflow-hidden aspect-[4/3] bg-slate-950"
                    >
                      <img
                        src={tab.image}
                        alt={tab.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-300">
                          FEATURED LEARNING EXPERIENCE
                        </span>
                        <h3 className="text-xl font-bold font-manrope text-white mt-1">
                          {tab.title}
                        </h3>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          4. THE PROBLEM
      ================================================== */}
      <section className="py-24 md:py-36 bg-[#0B091A] text-white relative overflow-hidden">
        {/* Ambient Dark Gradient Background */}
        <div className="pointer-events-none absolute -bottom-36 -right-36 w-96 h-96 rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="pointer-events-none absolute -top-36 -left-36 w-96 h-96 rounded-full bg-indigo-600/20 blur-[130px]" />

        <div className="max-w-6xl mx-auto px-6">
          <InView>
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] text-purple-400 mb-4">
              {isTelugu ? 'समस्या' : 'THE REALITY'}
            </p>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-manrope tracking-tight leading-[1.1] uppercase text-white max-w-4xl">
              THE OLD WAY OF LEARNING IS BROKEN.
            </h2>
          </InView>

          {/* 3 Dramatic Problems */}
          <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <InView delay={0.1}>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                <span className="text-sm font-extrabold font-mono text-purple-400">01</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-manrope text-white mt-4 mb-3">
                  TOO EXPENSIVE.
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Traditional courses charge exorbitant fees for outdated materials that don't prepare students for modern work environments.
                </p>
              </div>
            </InView>

            <InView delay={0.2}>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                <span className="text-sm font-extrabold font-mono text-pink-400">02</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-manrope text-white mt-4 mb-3">
                  TOO THEORETICAL.
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Endless passive video lectures without real coding, design projects, or practical problem solving create fake confidence.
                </p>
              </div>
            </InView>

            <InView delay={0.3}>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                <span className="text-sm font-extrabold font-mono text-amber-400">03</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-manrope text-white mt-4 mb-3">
                  TOO FAR FROM REAL WORK.
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Degrees and certificates that lack proof of capability leave students unprepared for real-world job expectations.
                </p>
              </div>
            </InView>
          </div>

          {/* Transition text */}
          <InView delay={0.4}>
            <div className="mt-16 md:mt-24 text-center pt-8 border-t border-white/10">
              <span className="text-2xl sm:text-4xl md:text-5xl font-black font-manrope tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
                SO WE BUILT SOMETHING DIFFERENT.
              </span>
            </div>
          </InView>
        </div>
      </section>

      {/* ==================================================
          5. CLASSCONNECT APPROACH
      ================================================== */}
      <section id="approach" className="py-24 md:py-36 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] text-[var(--primary)] mb-3">
            FOUR-STEP METHODOLOGY
          </p>
          <h2 className="text-4xl sm:text-6xl font-black font-manrope tracking-tight uppercase text-[var(--ink)]">
            LEARN. PRACTICE. PROVE. GROW.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--ink-muted)]">
            Our structured approach guarantees that every hour you spend on ClassConnect builds tangible capability.
          </p>
        </div>

        {/* 4 Interactive Stages Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {APPROACH_STAGES.map((stage) => {
            const Icon = stage.icon;
            const isActive = activeApproach === stage.id;
            return (
              <div
                key={stage.id}
                onClick={() => setActiveApproach(stage.id)}
                className={`p-8 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-[var(--surface)] border-[var(--primary)] shadow-xl ring-2 ring-[var(--primary)]/20 -translate-y-1'
                    : 'bg-[var(--canvas)] border-[var(--border)] hover:bg-[var(--surface)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold tracking-widest text-[var(--ink-muted)] uppercase">
                      {stage.badge}
                    </span>
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${stage.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black font-manrope text-[var(--ink)] mb-2 uppercase">
                    {isTelugu ? stage.wordHi : stage.word}
                  </h3>
                  <p className="text-sm font-bold text-[var(--primary)] mb-4">
                    "{stage.subtitle}"
                  </p>
                  <p className="text-xs text-[var(--ink-muted)] leading-relaxed mb-6">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border)] space-y-2">
                  {stage.details.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-[var(--ink-muted)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================
          6. BILINGUAL LEARNING
      ================================================== */}
      <section className="py-24 md:py-36 bg-[var(--surface)] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <InView>
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] text-[var(--primary)] mb-4">
              ACCESSIBILITY FIRST
            </p>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-manrope tracking-tight leading-[1.1] uppercase text-[var(--ink)] max-w-4xl mx-auto">
              LEARN IN THE LANGUAGE THAT WORKS FOR YOU.
            </h2>
          </InView>

          {/* Bilingual Oversized Interactive Toggle Showcase */}
          <InView delay={0.2}>
            <div className="mt-12 md:mt-16 inline-flex p-2 rounded-full bg-[var(--canvas)] border border-[var(--border)] shadow-inner">
              <button
                type="button"
                onClick={() => setLangToggle('hi')}
                className={`px-8 py-3.5 rounded-full font-black font-manrope text-base sm:text-xl transition-all duration-300 cursor-pointer ${
                  langToggle === 'hi'
                    ? 'bg-[var(--primary)] text-white shadow-lg'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`}
              >
                हिंदी (HINDI)
              </button>
              <button
                type="button"
                onClick={() => setLangToggle('en')}
                className={`px-8 py-3.5 rounded-full font-black font-manrope text-base sm:text-xl transition-all duration-300 cursor-pointer ${
                  langToggle === 'en'
                    ? 'bg-[var(--primary)] text-white shadow-lg'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`}
              >
                ENGLISH
              </button>
            </div>

            {/* Dynamic Card Displaying Sample Lesson Header in Selected Language */}
            <div className="mt-10 max-w-2xl mx-auto p-8 rounded-3xl bg-[var(--canvas)] border border-[var(--border)] shadow-lg text-left">
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-3">
                <Globe className="w-4 h-4" />
                <span>{langToggle === 'hi' ? 'हिंदी माध्यम उपलब्ध' : 'English Medium Available'}</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold font-manrope text-[var(--ink)] mb-2">
                {langToggle === 'hi' 
                  ? 'हर विषय को अपनी मातृभाषा में समझें' 
                  : 'Master complex skills in your comfortable language'}
              </h4>
              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                {langToggle === 'hi'
                  ? 'बिना किसी भाषा की रुकावट के कोडिंग, डिजाइन और डिजिटल स्किल्स में महारत हासिल करें।'
                  : 'Clear explanations, practical examples, and zero language friction.'}
              </p>
            </div>

            <p className="mt-8 text-sm sm:text-base text-[var(--ink-muted)] font-medium max-w-xl mx-auto">
              "Because great education should not be limited by language."
            </p>
          </InView>
        </div>
      </section>

      {/* ==================================================
          7. COURSES AS THE CORE (Horizontal Magazine Gallery)
      ================================================== */}
      <section className="py-24 md:py-36 max-w-7xl mx-auto px-6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] text-[var(--primary)] mb-3">
              CURATED DOMAINS
            </p>
            <h2 className="text-3xl sm:text-5xl font-black font-manrope tracking-tight uppercase text-[var(--ink)]">
              SKILLS YOU CAN ACTUALLY USE.
            </h2>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--primary)] hover:underline shrink-0"
          >
            <span>View All Course Categories</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal Scroll / Grid of Magazine Tiles */}
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory">
          {CATEGORY_TILES.map((cat) => (
            <Link
              key={cat.id}
              to="/courses"
              className="min-w-[280px] sm:min-w-[340px] snap-start group relative rounded-3xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden bg-slate-900">
                <img 
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold tracking-widest uppercase border border-white/20">
                  {cat.tag}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-[var(--primary)] mb-1">
                    {cat.count}
                  </div>
                  <h3 className="text-xl font-black font-manrope text-[var(--ink)] uppercase group-hover:text-[var(--primary)] transition-colors">
                    {isTelugu ? cat.titleHi : cat.title}
                  </h3>
                  <p className="text-xs text-[var(--ink-muted)] mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs font-bold text-[var(--ink)] group-hover:text-[var(--primary)]">
                  <span>EXPLORE PROGRAM</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==================================================
          8. FROM COURSE TO CAREER (Visual Journey)
      ================================================== */}
      <section className="py-24 md:py-36 bg-[#0B091A] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] text-purple-400 mb-3">
              STUDENT ROADMAP
            </p>
            <h2 className="text-3xl sm:text-5xl font-black font-manrope tracking-tight uppercase text-white">
              FROM LEARNING TO OPPORTUNITY.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/70">
              "Learning shouldn't end when the video ends. It should become something you can show."
            </p>
          </div>

          {/* Timeline Process Bar */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative">
            {[
              { step: '01', title: 'DISCOVER', desc: 'Browse practical courses' },
              { step: '02', title: 'LEARN', desc: 'Watch HD bilingual lessons' },
              { step: '03', title: 'PRACTICE', desc: 'Complete project tasks' },
              { step: '04', title: 'COMPLETE', desc: 'Finish 100% of modules' },
              { step: '05', title: 'CERTIFY', desc: 'Earn verified badge', highlight: true },
              { step: '06', title: 'GROW', desc: 'Advance your career' },
            ].map((item, index) => (
              <div 
                key={index}
                className={`p-6 rounded-3xl border transition-all duration-300 relative ${
                  item.highlight
                    ? 'bg-gradient-to-b from-purple-900/60 to-indigo-900/60 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.3)]'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <span className={`text-xs font-bold font-mono ${item.highlight ? 'text-purple-300' : 'text-white/40'}`}>
                  {item.step}
                </span>
                <h4 className="text-lg font-black font-manrope text-white mt-2 mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-white/60">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          9. CERTIFICATES
      ================================================== */}
      <section className="py-24 md:py-36 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold tracking-wider uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>PROOF OF COMPLETION</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-black font-manrope leading-[1.08] tracking-tight uppercase text-[var(--ink)]">
              LEARN IT. <br />
              COMPLETE IT. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-600 to-red-600">
                PROVE IT.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
              Every completed course can become a milestone you can carry forward. Share your certificate with clients, employers, or on your LinkedIn profile.
            </p>

            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3 text-sm font-bold text-[var(--ink)]">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Unique ClassConnect Verification ID</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-[var(--ink)]">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Shareable digital credential format</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-[var(--ink)]">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Downloadable high-resolution PDF</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setVerifiedPreview(!verifiedPreview)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] font-bold text-xs shadow-sm hover:bg-[var(--canvas)] transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>{verifiedPreview ? 'Hide Sample Validation' : 'Test Certificate Validation Preview'}</span>
              </button>
            </div>
          </div>

          {/* Right Realistic Certificate Card Mockup */}
          <div className="lg:col-span-6 relative">
            <motion.div 
              whileHover={{ rotate: 1, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative p-8 md:p-10 rounded-[32px] bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-indigo-500/10 border-2 border-amber-500/30 shadow-2xl"
            >
              {/* Inner Certificate Frame */}
              <div className="p-6 md:p-8 rounded-[20px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden shadow-inner">
                {/* Certificate Watermark Ribbon */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-black text-xs">
                      CC
                    </div>
                    <span className="font-black text-sm font-manrope text-[var(--ink)]">
                      ClassConnect
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/20">
                    VERIFIED CERTIFICATE
                  </div>
                </div>

                <div className="my-6">
                  <span className="text-[10px] font-extrabold text-[var(--ink-muted)] uppercase tracking-[0.2em]">
                    THIS CERTIFICATE IS PROUDLY PRESENTED TO
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black font-manrope text-[var(--ink)] mt-2">
                    Rahul Sharma
                  </h3>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-amber-500 to-purple-600 mx-auto my-3" />
                  <p className="text-xs text-[var(--ink-muted)]">
                    FOR SUCCESSFULLY COMPLETING THE COURSE
                  </p>
                  <h4 className="text-lg font-bold text-[var(--primary)] mt-1">
                    Fullstack Web Development Bootcamp 2026
                  </h4>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-left">
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">ISSUED ON</span>
                    <span className="text-xs font-bold text-[var(--ink)]">August 2026</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">ID</span>
                    <span className="text-xs font-mono font-bold text-[var(--ink)]">CC-2026-8942</span>
                  </div>
                </div>

                {/* Validation Status Box Toggle */}
                {verifiedPreview && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Certificate ID #CC-2026-8942 is Authentic & Verified on ClassConnect</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================================================
          10. STUDENT IMPACT (Oversized Editorial Stats)
      ================================================== */}
      <section id="stats" className="py-20 md:py-32 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Stat 1 */}
            <InView delay={0.05}>
              <div className="p-8 rounded-3xl bg-[var(--canvas)] border border-[var(--border)] shadow-sm hover:shadow-lg transition-all duration-300">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--ink-muted)]">
                  ACTIVE LEARNERS
                </span>
                <div className="text-5xl sm:text-6xl font-black font-manrope text-[var(--ink)] my-3 tracking-tight">
                  <NumberTicker value={10} suffix="K+" />
                </div>
                <p className="text-xs text-[var(--ink-muted)]">
                  Learners already building their next skill on ClassConnect.
                </p>
              </div>
            </InView>

            {/* Stat 2 */}
            <InView delay={0.1}>
              <div className="p-8 rounded-3xl bg-[var(--canvas)] border border-[var(--border)] shadow-sm hover:shadow-lg transition-all duration-300">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--ink-muted)]">
                  AVAILABLE COURSES
                </span>
                <div className="text-5xl sm:text-6xl font-black font-manrope text-[var(--ink)] my-3 tracking-tight">
                  <NumberTicker value={50} suffix="+" />
                </div>
                <p className="text-xs text-[var(--ink-muted)]">
                  Practical, job-oriented visual learning programs.
                </p>
              </div>
            </InView>

            {/* Stat 3 */}
            <InView delay={0.15}>
              <div className="p-8 rounded-3xl bg-[var(--canvas)] border border-[var(--border)] shadow-sm hover:shadow-lg transition-all duration-300">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--ink-muted)]">
                  BILINGUAL CONTENT
                </span>
                <div className="text-5xl sm:text-6xl font-black font-manrope text-[var(--ink)] my-3 tracking-tight">
                  <NumberTicker value={100} suffix="%" />
                </div>
                <p className="text-xs text-[var(--ink-muted)]">
                  Available in both Telugu and English mediums.
                </p>
              </div>
            </InView>

            {/* Stat 4 */}
            <InView delay={0.2}>
              <div className="p-8 rounded-3xl bg-[var(--canvas)] border border-[var(--border)] shadow-sm hover:shadow-lg transition-all duration-300">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--ink-muted)]">
                  STUDENT RATING
                </span>
                <div className="text-5xl sm:text-6xl font-black font-manrope text-[var(--ink)] my-3 tracking-tight">
                  <NumberTicker value={4} decimals={1} suffix="★" />
                </div>
                <p className="text-xs text-[var(--ink-muted)]">
                  Average student rating across all course modules.
                </p>
              </div>
            </InView>

          </div>
        </div>
      </section>

      {/* ==================================================
          11. THE CLASSCONNECT EXPERIENCE (Magazine Collage)
      ================================================== */}
      <section className="py-24 md:py-36 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] text-[var(--primary)] mb-3">
            VISUAL SPREAD
          </p>
          <h2 className="text-3xl sm:text-5xl font-black font-manrope tracking-tight uppercase text-[var(--ink)]">
            THE CLASSCONNECT EXPERIENCE.
          </h2>
        </div>

        {/* Asymmetric Magazine Collage Spread */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 relative rounded-3xl overflow-hidden aspect-[16/10] bg-slate-900 shadow-xl border border-[var(--border)] group">
            <img 
              src="/assets/students/video_poster_1.jpg"
              alt="ClassConnect student interface"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-extrabold text-[10px] tracking-widest uppercase">
              WATCH & LEARN
            </span>
          </div>

          <div className="md:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-md flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <Play className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base font-manrope text-[var(--ink)]">Bite-Sized HD Video</h4>
                <p className="text-xs text-[var(--ink-muted)]">Focused lessons without fluff or long fill-ins.</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-md flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base font-manrope text-[var(--ink)]">Hands-on Exercises</h4>
                <p className="text-xs text-[var(--ink-muted)]">Apply learning directly inside real projects.</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-md flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base font-manrope text-[var(--ink)]">Milestone Credentials</h4>
                <p className="text-xs text-[var(--ink-muted)]">Showcase your completed skills proudly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          12. FUTURE VISION
      ================================================== */}
      <section className="py-24 md:py-36 bg-[#0B091A] text-white relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <InView>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] text-purple-400">
              FUTURE VISION
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-manrope tracking-tight leading-[1.05] uppercase text-white mt-4 mb-8">
              THE FUTURE <br />
              OF LEARNING <br />
              IS PERSONAL.
            </h2>
            <div className="space-y-2 text-base sm:text-xl text-white/80 font-normal max-w-xl mx-auto">
              <p>More practical.</p>
              <p>More accessible.</p>
              <p>More bilingual.</p>
              <p>More connected to real opportunity.</p>
            </div>
          </InView>
        </div>
      </section>

      {/* ==================================================
          13. FINAL CTA
      ================================================== */}
      <section className="py-24 md:py-36 max-w-7xl mx-auto px-6 text-center">
        <div className="relative rounded-[36px] md:rounded-[48px] bg-gradient-to-br from-[#2D1B69] via-indigo-900 to-purple-950 text-white p-10 md:p-20 shadow-2xl overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-manrope tracking-tight leading-[1.05] uppercase text-white">
              YOUR NEXT SKILL <br />
              STARTS HERE.
            </h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal">
              Explore courses designed to help you learn something useful, complete something meaningful, and move one step closer to where you want to go.
            </p>

            <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
              <Link
                to="/courses"
                className="px-9 py-4.5 rounded-full bg-white text-[#2D1B69] font-extrabold text-base hover:bg-slate-100 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95"
              >
                Explore Courses
              </Link>
              <Link
                to="/courses"
                className="px-9 py-4.5 rounded-full bg-white/10 border border-white/30 text-white font-extrabold text-base hover:bg-white/20 transition-all duration-300"
              >
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 14. Support Section & Footer Preserved Exactly */}
      <ContactSupportSection />
      <Footer />
    </div>
  );
}

export default AboutPage;
