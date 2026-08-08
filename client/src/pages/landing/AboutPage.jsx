import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, Sparkles, Globe, Award, ShieldCheck, Play, 
  Code, Trophy, Layers, ChevronRight, Star, Heart, Target, Users, BookOpen, 
  Check, FileText, Zap, ExternalLink, ArrowUpRight, CheckCircle, Users2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';
import { InView } from '../../components/motion/InView';
import { NumberTicker } from '../../components/motion/NumberTicker';
import { useLanguage } from '../../context/LanguageContext';
import { ContactSupportSection } from '../../components/about/ContactSupportSection';

// Asymmetric Masonry Category Data
const CATEGORIES_DATA = [
  {
    id: 'ai',
    title: 'AI & PROMPT TOOLS',
    titleHi: 'एआई और प्रॉम्प्ट टूल्स',
    desc: 'Master ChatGPT, Claude, Midjourney & AI Workflows for real productivity.',
    image: '/assets/students/video_poster_1.jpg',
    span: 'col-span-1 md:col-span-7',
    aspect: 'aspect-[16/10]',
    accent: 'from-purple-600/30 to-indigo-600/30',
  },
  {
    id: 'design',
    title: 'DESIGN & VIDEO EDITING',
    titleHi: 'डिजाइन और वीडियो एडिटिंग',
    desc: 'Figma UI/UX, Motion Graphics, Premiere Pro & visual design systems.',
    image: '/assets/students/abhishek.jpg',
    span: 'col-span-1 md:col-span-5',
    aspect: 'aspect-[4/3]',
    accent: 'from-pink-600/30 to-rose-600/30',
  },
  {
    id: 'marketing',
    title: 'DIGITAL MARKETING',
    titleHi: 'डिजिटल मार्केटिंग',
    desc: 'SEO, performance ads, social media growth & brand funnel strategy.',
    image: '/assets/students/bhoomika.jpg',
    span: 'col-span-1 md:col-span-4',
    aspect: 'aspect-[4/3]',
    accent: 'from-amber-500/30 to-orange-600/30',
  },
  {
    id: 'excel',
    title: 'MS EXCEL',
    titleHi: 'एमएस एक्सेल और डेटा',
    desc: 'Advanced formulas, Power Query, dashboards & business analytics.',
    image: '/assets/students/video_poster_2.jpg',
    span: 'col-span-1 md:col-span-4',
    aspect: 'aspect-[4/3]',
    accent: 'from-emerald-600/30 to-teal-600/30',
  },
  {
    id: 'communication',
    title: 'COMMUNICATION',
    titleHi: 'कम्युनिकेशन और स्पीकिंग',
    desc: 'Professional English speaking, public speaking & interview confidence.',
    image: '/assets/students/divye_ratan.jpg',
    span: 'col-span-1 md:col-span-4',
    aspect: 'aspect-[4/3]',
    accent: 'from-blue-600/30 to-cyan-600/30',
  },
  {
    id: 'freelancing',
    title: 'FREELANCING',
    titleHi: 'फ्रीलांसिंग और क्लाइंट वर्क',
    desc: 'Upwork, Fiverr, portfolio crafting & acquiring international clients.',
    image: '/assets/students/yes_patel.jpg',
    span: 'col-span-1 md:col-span-6',
    aspect: 'aspect-[16/10]',
    accent: 'from-violet-600/30 to-purple-600/30',
  },
  {
    id: 'career',
    title: 'CAREER SKILLS',
    titleHi: 'करियर स्किल्स',
    desc: 'Resume building, LinkedIn optimization & salary negotiation.',
    image: '/assets/students/video_poster_3.jpg',
    span: 'col-span-1 md:col-span-6',
    aspect: 'aspect-[16/10]',
    accent: 'from-blue-700/30 to-indigo-800/30',
  },
];

// Staggered Editorial Difference Blocks
const DIFFERENCE_BLOCKS = [
  {
    num: '01',
    title: 'LEARN IN YOUR LANGUAGE',
    titleHi: 'अपनी भाषा में सीखें',
    subtitle: 'Learn through Hindi and English content.',
    desc: 'Bilingual explanations ensure complex technical & creative topics are understood effortlessly without language barriers.',
    span: 'md:col-span-7',
    bg: 'bg-[var(--surface)]',
  },
  {
    num: '02',
    title: 'LEARN PRACTICAL SKILLS',
    titleHi: 'व्यावहारिक कौशल',
    subtitle: 'Focus on skills you can actually apply.',
    desc: 'Every lesson is built around real-world projects, downloadable assets, and hands-on exercises.',
    span: 'md:col-span-5',
    bg: 'bg-[var(--surface)]',
  },
  {
    num: '03',
    title: 'LEARN AT YOUR PACE',
    titleHi: 'अपनी गति से सीखें',
    subtitle: 'Structured courses that fit your schedule.',
    desc: 'Bite-sized video modules designed for busy students and working professionals.',
    span: 'md:col-span-5',
    bg: 'bg-[var(--surface)]',
  },
  {
    num: '04',
    title: 'PROVE WHAT YOU LEARN',
    titleHi: 'प्रमाणित करें',
    subtitle: 'Complete courses and earn ClassConnect certificates.',
    desc: 'Receive digital completion credentials with unique validation IDs to showcase on LinkedIn or your portfolio.',
    span: 'md:col-span-7',
    bg: 'bg-[var(--surface)]',
  },
];

// Learning Journey Stages
const JOURNEY_STAGES = [
  { step: '01', title: 'DISCOVER', desc: 'Browse practical courses tailored to real-world demand.' },
  { step: '02', title: 'LEARN', desc: 'Watch HD video modules in Hindi & English at your pace.' },
  { step: '03', title: 'PRACTICE', desc: 'Complete interactive projects & real work exercises.' },
  { step: '04', title: 'COMPLETE', desc: 'Finish 100% of structured course milestones.' },
  { step: '05', title: 'CERTIFY', desc: 'Earn your verified ClassConnect completion certificate.' },
  { step: '06', title: 'GROW', desc: 'Apply your skills to jobs, freelancing & career advancement.' },
];

export function AboutPage() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [langToggle, setLangToggle] = useState('hi');
  const [verifiedPreview, setVerifiedPreview] = useState(false);

  // Parallax scroll hook for hero image
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] overflow-x-hidden selection:bg-purple-500 selection:text-white">
      <FloatingNav />

      {/* ==================================================
          SECTION 1 — EDITORIAL HERO
      ================================================== */}
      <section ref={heroRef} className="relative pt-24 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Ambient Glow Aura */}
        <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[var(--primary)]/15 via-purple-500/10 to-[var(--accent)]/15 blur-[140px] -z-10" />

        {/* Asymmetric Header Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
          {/* Left Column: Large Headline */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-bold tracking-widest uppercase text-[var(--ink-muted)] mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>ABOUT CLASSCONNECT</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-manrope tracking-tight leading-[1.04] text-[var(--ink)] uppercase"
            >
              {isHindi ? (
                <>
                  हर किसी के लिए <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] via-purple-600 to-[var(--accent)]">
                    गुणवत्तापूर्ण शिक्षा
                  </span>{' '}
                  सुलभ बनाना।
                </>
              ) : (
                <>
                  MAKING QUALITY <br />
                  EDUCATION <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] via-purple-600 to-[var(--accent)]">
                    ACCESSIBLE TO
                  </span> <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-[var(--accent)]">
                    EVERYONE.
                  </span>
                </>
              )}
            </motion.h1>
          </div>

          {/* Right Column: Concise Paragraph */}
          <div className="lg:col-span-4 lg:pb-3">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-[var(--ink-muted)] font-normal leading-relaxed"
            >
              {isHindi
                ? 'क्लासकनेक्ट एक विजुअल लर्निंग प्लेटफॉर्म है जो हर जगह के छात्रों के लिए व्यावहारिक, किफायती और द्विभाषी शिक्षा को सुलभ बनाने के लिए बनाया गया है।'
                : 'ClassConnect is a visual learning platform built to make practical, affordable and bilingual education accessible to students everywhere.'}
            </motion.p>
          </div>
        </div>

        {/* Full-width Education Image */}
        <motion.div 
          style={{ y: heroY }}
          className="relative rounded-[28px] sm:rounded-[40px] overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-2xl p-2 sm:p-3"
        >
          <div className="relative rounded-[22px] sm:rounded-[32px] overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-slate-900 group">
            <img 
              src="/assets/hero_students.jpg"
              onError={(e) => { e.target.src = '/hero_showcase.jpg'; }}
              alt="Students learning on ClassConnect"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex flex-wrap justify-between items-end gap-4 text-white">
              <div className="max-w-md">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-300">
                  REAL-WORLD SKILLS
                </span>
                <h3 className="text-lg sm:text-2xl font-black font-manrope text-white mt-1">
                  Education designed around students & real outcomes.
                </h3>
              </div>
              <div className="px-5 py-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[var(--ink)] text-xs sm:text-sm font-bold font-manrope shadow-lg">
                10K+ Active Learners
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ==================================================
          SECTION 2 — LARGE VISUAL STORY
      ================================================== */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Dominant Image (65–70% width) */}
          <div className="lg:col-span-8 relative">
            <div className="rounded-[32px] overflow-hidden border border-[var(--border)] bg-[var(--surface)] p-2.5 shadow-xl">
              <div className="rounded-[24px] overflow-hidden aspect-[16/10] bg-slate-900 relative group">
                <img 
                  src="/assets/students/abhishek.jpg"
                  alt="Student collaborating and learning"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          {/* Overlapping Vertical Label Panel */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-8 rounded-[32px] bg-[var(--surface)] border border-[var(--border)] shadow-lg space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[var(--primary)]">
                EDITORIAL SPREAD
              </span>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[var(--canvas)] border border-[var(--border)] flex items-center justify-between">
                  <span className="text-xl font-black font-manrope text-[var(--ink)]">LEARN</span>
                  <span className="text-xs font-bold text-[var(--ink-muted)]">Visual HD Modules</span>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--canvas)] border border-[var(--border)] flex items-center justify-between">
                  <span className="text-xl font-black font-manrope text-[var(--ink)]">BUILD</span>
                  <span className="text-xs font-bold text-[var(--ink-muted)]">Practical Projects</span>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--canvas)] border border-[var(--border)] flex items-center justify-between">
                  <span className="text-xl font-black font-manrope text-[var(--ink)]">GROW</span>
                  <span className="text-xs font-bold text-[var(--ink-muted)]">Career Opportunities</span>
                </div>
              </div>

              <p className="text-xs text-[var(--ink-muted)] leading-relaxed pt-2 border-t border-[var(--border)]">
                Designed to bridge the gap between classroom theory and real-world implementation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 3 — WHY CLASSCONNECT EXISTS
      ================================================== */}
      <section className="py-24 md:py-36 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-manrope tracking-tight uppercase text-[var(--ink)]">
              LEARNING IS CHANGING.
            </h2>
            <p className="mt-4 text-base sm:text-xl text-[var(--ink-muted)] font-normal max-w-2xl mx-auto">
              "But access to practical, affordable and understandable education still isn't equal."
            </p>
          </div>

          {/* Asymmetric Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[var(--primary)]">
                CORE BELIEF
              </span>
              <h3 className="text-3xl sm:text-5xl font-black font-manrope tracking-tight uppercase leading-[1.08] text-[var(--ink)]">
                WE BELIEVE <br />
                SKILLS SHOULD <br />
                BE ACCESSIBLE.
              </h3>
            </div>

            <div className="lg:col-span-6">
              <p className="text-base sm:text-lg text-[var(--ink-muted)] font-normal leading-relaxed bg-[var(--canvas)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
                Students shouldn't have to choose between expensive education, complicated learning platforms and skills that don't translate into real opportunities.
              </p>
            </div>
          </div>

          {/* Large Supporting Visual Underneath */}
          <div className="mt-12 rounded-[32px] overflow-hidden border border-[var(--border)] bg-slate-900 aspect-[21/9] relative group shadow-xl">
            <img 
              src="/assets/students/bhoomika.jpg"
              alt="Student focused on learning"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-purple-300">
                CLASSCONNECT PHILOSOPHY
              </p>
              <h4 className="text-xl font-bold font-manrope text-white mt-1">
                Practical, accessible and bilingual education for every student.
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 4 — THE CLASSCONNECT DIFFERENCE
      ================================================== */}
      <section className="py-24 md:py-36 max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mb-16">
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] text-[var(--primary)] mb-3">
            THE STUDENT-FIRST APPROACH
          </p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-manrope tracking-tight uppercase text-[var(--ink)]">
            SO WE BUILT CLASSCONNECT <br className="hidden sm:block" />
            AROUND THE STUDENT.
          </h2>
        </div>

        {/* Staggered Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {DIFFERENCE_BLOCKS.map((block, idx) => (
            <InView key={idx} delay={idx * 0.1} className={`${block.span}`}>
              <div className={`p-8 md:p-10 rounded-[32px] border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between ${block.bg}`}>
                <div>
                  <span className="text-xs font-mono font-extrabold text-[var(--primary)]">
                    {block.num}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black font-manrope text-[var(--ink)] mt-3 mb-2 uppercase">
                    {isHindi ? block.titleHi : block.title}
                  </h3>
                  <p className="text-sm font-bold text-[var(--primary)] mb-4">
                    "{block.subtitle}"
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed pt-4 border-t border-[var(--border)]">
                  {block.desc}
                </p>
              </div>
            </InView>
          ))}
        </div>
      </section>

      {/* ==================================================
          SECTION 5 — BIG EDUCATION IMAGE
      ================================================== */}
      <section className="relative py-20 md:py-32 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/hero_showcase.jpg"
            alt="ClassConnect learning environment"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-12 md:py-24">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] text-purple-400">
            VISUAL PURPOSE
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-manrope tracking-tight leading-[1.05] uppercase text-white mt-4 mb-6">
            LEARNING SHOULD FEEL <br />
            PRACTICAL.
          </h2>
          <p className="text-base sm:text-xl text-white/80 font-normal max-w-xl mx-auto">
            "From the first lesson to the final certificate."
          </p>
        </div>
      </section>

      {/* ==================================================
          SECTION 6 — LEARNING JOURNEY
      ================================================== */}
      <section className="py-24 md:py-36 max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] text-[var(--primary)] mb-3">
            PROGRESSION METHODOLOGY
          </p>
          <h2 className="text-4xl sm:text-6xl font-black font-manrope tracking-tight uppercase text-[var(--ink)]">
            FROM CURIOUS TO CAPABLE.
          </h2>
        </div>

        {/* Staggered Timeline Process Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {JOURNEY_STAGES.map((item, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-[var(--primary)]">
                  {item.step}
                </span>
                <h3 className="text-2xl font-black font-manrope text-[var(--ink)] mt-2 mb-2 uppercase">
                  {item.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed pt-4 border-t border-[var(--border)]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          SECTION 7 — BILINGUAL EDUCATION
      ================================================== */}
      <section className="py-24 md:py-36 bg-[var(--surface)] border-y border-[var(--border)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Typography & Toggle */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-[0.3em] text-[var(--primary)]">
                BILINGUAL LEARNING
              </span>

              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black font-manrope tracking-tight leading-[1.08] uppercase text-[var(--ink)]">
                LEARNING SHOULDN'T <br />
                HAVE A LANGUAGE <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] via-purple-600 to-[var(--accent)]">
                  BARRIER.
                </span>
              </h2>

              <div className="inline-flex p-2 rounded-full bg-[var(--canvas)] border border-[var(--border)] shadow-inner">
                <button
                  type="button"
                  onClick={() => setLangToggle('hi')}
                  className={`px-6 py-2.5 rounded-full font-black font-manrope text-sm transition-all duration-300 cursor-pointer ${
                    langToggle === 'hi'
                      ? 'bg-[var(--primary)] text-white shadow-md'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  HINDI
                </button>
                <button
                  type="button"
                  onClick={() => setLangToggle('en')}
                  className={`px-6 py-2.5 rounded-full font-black font-manrope text-sm transition-all duration-300 cursor-pointer ${
                    langToggle === 'en'
                      ? 'bg-[var(--primary)] text-white shadow-md'
                      : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  ENGLISH
                </button>
              </div>

              <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed max-w-xl">
                ClassConnect brings practical learning closer to students through bilingual Hindi and English education.
              </p>
            </div>

            {/* Right Large Supporting Visual */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-[32px] overflow-hidden border border-[var(--border)] bg-slate-900 aspect-[4/3] shadow-2xl relative group">
                <img 
                  src="/assets/students/divye_ratan.jpg"
                  alt="Bilingual learning in action"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300">
                    <Globe className="w-4 h-4" />
                    <span>BILINGUAL AUDIO & SLIDES</span>
                  </div>
                  <h4 className="text-lg font-bold font-manrope text-white mt-1">
                    Understand every concept clearly in Hindi or English.
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 8 — COURSE CATEGORIES (Asymmetric Masonry)
      ================================================== */}
      <section className="py-24 md:py-36 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] text-[var(--primary)] mb-3">
              SKILL DOMAINS
            </p>
            <h2 className="text-3xl sm:text-5xl font-black font-manrope tracking-tight uppercase text-[var(--ink)]">
              SKILLS FOR THE REAL WORLD.
            </h2>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--primary)] hover:underline shrink-0"
          >
            <span>Explore All Categories</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetric Masonry Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {CATEGORIES_DATA.map((cat) => (
            <Link
              key={cat.id}
              to="/courses"
              className={`${cat.span} group relative rounded-[32px] overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
            >
              <div className={`relative ${cat.aspect} overflow-hidden bg-slate-900`}>
                <img 
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black font-manrope text-[var(--ink)] uppercase group-hover:text-[var(--primary)] transition-colors">
                    {isHindi ? cat.titleHi : cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-2 leading-relaxed">
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
          SECTION 9 — IMPACT / NUMBERS (Huge Editorial Typography)
      ================================================== */}
      <section id="stats" className="py-24 md:py-36 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] text-[var(--primary)] mb-3">
              PROOF OF IMPACT
            </p>
            <h2 className="text-3xl sm:text-5xl font-black font-manrope tracking-tight uppercase text-[var(--ink)]">
              BY THE NUMBERS.
            </h2>
          </div>

          {/* Staggered Oversized Editorial Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
            <InView delay={0.05}>
              <div className="p-8 md:p-12 rounded-[36px] bg-[var(--canvas)] border border-[var(--border)] shadow-sm">
                <div className="text-6xl sm:text-8xl font-black font-manrope text-[var(--ink)] tracking-tight leading-none">
                  <NumberTicker value={10} suffix="K+" />
                </div>
                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                  <h4 className="text-lg font-black font-manrope uppercase text-[var(--ink)]">
                    GLOBAL ACTIVE LEARNERS
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-1">
                    Students already building practical skills for their careers.
                  </p>
                </div>
              </div>
            </InView>

            <InView delay={0.1}>
              <div className="p-8 md:p-12 rounded-[36px] bg-[var(--canvas)] border border-[var(--border)] shadow-sm md:mt-12">
                <div className="text-6xl sm:text-8xl font-black font-manrope text-[var(--ink)] tracking-tight leading-none">
                  <NumberTicker value={50} suffix="+" />
                </div>
                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                  <h4 className="text-lg font-black font-manrope uppercase text-[var(--ink)]">
                    INDUSTRY-READY COURSES
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-1">
                    Structured visual programs designed around real project outcomes.
                  </p>
                </div>
              </div>
            </InView>

            <InView delay={0.15}>
              <div className="p-8 md:p-12 rounded-[36px] bg-[var(--canvas)] border border-[var(--border)] shadow-sm">
                <div className="text-6xl sm:text-8xl font-black font-manrope text-[var(--ink)] tracking-tight leading-none">
                  <NumberTicker value={100} suffix="%" />
                </div>
                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                  <h4 className="text-lg font-black font-manrope uppercase text-[var(--ink)]">
                    BILINGUAL HINDI & ENGLISH
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-1">
                    Every course accessible without language constraints.
                  </p>
                </div>
              </div>
            </InView>

            <InView delay={0.2}>
              <div className="p-8 md:p-12 rounded-[36px] bg-[var(--canvas)] border border-[var(--border)] shadow-sm md:mt-12">
                <div className="text-6xl sm:text-8xl font-black font-manrope text-[var(--ink)] tracking-tight leading-none">
                  <NumberTicker value={4} decimals={1} suffix="★" />
                </div>
                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                  <h4 className="text-lg font-black font-manrope uppercase text-[var(--ink)]">
                    AVERAGE STUDENT RATING
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-1">
                    Consistently high student feedback across all video modules.
                  </p>
                </div>
              </div>
            </InView>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 10 — MENTORS / LEARNING COMMUNITY
      ================================================== */}
      <section className="py-24 md:py-36 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-[0.3em] text-[var(--primary)]">
              HUMAN CONNECTION
            </span>
            <h2 className="text-4xl sm:text-6xl font-black font-manrope tracking-tight leading-[1.08] uppercase text-[var(--ink)]">
              LEARNING IS <br />
              BETTER TOGETHER.
            </h2>
            <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
              ClassConnect brings learners, practical knowledge and expert guidance into one learning experience.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                STUDENTS
              </span>
              <span className="px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                MENTORS
              </span>
              <span className="px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                COMMUNITY
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-[32px] overflow-hidden border border-[var(--border)] bg-slate-900 aspect-[4/3] shadow-2xl relative group">
              <img 
                src="/assets/hero_students.jpg"
                onError={(e) => { e.target.src = '/hero_showcase.jpg'; }}
                alt="ClassConnect learning community"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-purple-300">
                  SHARED SKILL BUILDING
                </p>
                <h4 className="text-lg font-bold font-manrope text-white mt-1">
                  Learn alongside thousands of ambitious students.
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 11 — COURSE → CERTIFICATE
      ================================================== */}
      <section className="py-24 md:py-36 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold tracking-wider uppercase">
                <Award className="w-3.5 h-3.5" />
                <span>COURSE COMPLETION CREDENTIAL</span>
              </div>

              <h2 className="text-4xl sm:text-6xl font-black font-manrope leading-[1.08] tracking-tight uppercase text-[var(--ink)]">
                LEARN IT. <br />
                COMPLETE IT. <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-600 to-red-600">
                  PROVE IT.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
                "Every completed course is a milestone worth carrying forward."
              </p>

              {/* Editorial Labels list */}
              <div className="flex flex-wrap gap-2 pt-2">
                {['COURSE', 'LESSONS', 'PROGRESS', 'COMPLETION', 'CERTIFICATE'].map((label, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-[var(--canvas)] border border-[var(--border)] text-[10px] font-extrabold tracking-widest uppercase text-[var(--ink-muted)]">
                    {label}
                  </span>
                ))}
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setVerifiedPreview(!verifiedPreview)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--canvas)] border border-[var(--border)] text-[var(--ink)] font-bold text-xs shadow-sm hover:bg-[var(--surface)] transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>{verifiedPreview ? 'Hide Sample Credential' : 'View Sample ClassConnect Certificate'}</span>
                </button>
              </div>
            </div>

            {/* Right Certificate Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="relative p-8 md:p-10 rounded-[36px] bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-indigo-500/10 border-2 border-amber-500/30 shadow-2xl">
                <div className="p-6 md:p-8 rounded-[24px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden shadow-inner">
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
                      COURSE COMPLETION
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

                  {verifiedPreview && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Authentic ClassConnect Course-Completion Certificate</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 12 — OUR VISION
      ================================================== */}
      <section className="py-24 md:py-36 bg-[#0B091A] text-white relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <InView>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.3em] text-purple-400">
              MANIFESTO
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-manrope tracking-tight leading-[1.05] uppercase text-white mt-4 mb-8">
              THE FUTURE <br />
              OF EDUCATION <br />
              SHOULD BE MORE ACCESSIBLE.
            </h2>
            <div className="space-y-3 text-base sm:text-xl text-white/80 font-normal max-w-xl mx-auto">
              <p>More practical.</p>
              <p>More bilingual.</p>
              <p>More affordable.</p>
              <p>More connected to real skills.</p>
            </div>
          </InView>
        </div>
      </section>

      {/* ==================================================
          SECTION 13 — FINAL CTA
      ================================================== */}
      <section className="py-24 md:py-36 max-w-7xl mx-auto px-6 text-center">
        <div className="relative rounded-[36px] md:rounded-[48px] bg-gradient-to-br from-[#2D1B69] via-indigo-900 to-purple-950 text-white p-10 md:p-20 shadow-2xl overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-manrope tracking-tight leading-[1.05] uppercase text-white">
              READY TO LEARN <br />
              WHAT'S NEXT?
            </h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal">
              Explore practical courses designed to help you build skills, complete meaningful learning and move forward.
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
