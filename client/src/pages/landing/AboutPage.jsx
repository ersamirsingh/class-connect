import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Heart, Target, Sparkles, ArrowRight, CheckCircle2, Award, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';
import { TextEffect } from '../../components/motion/TextEffect';
import { InView } from '../../components/motion/InView';
import { NumberTicker } from '../../components/motion/NumberTicker';
import { useLanguage } from '../../context/LanguageContext';

const jumpLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'stats', label: 'Impact' },
  { id: 'values', label: 'Our Values' },
  { id: 'career', label: 'Career Banner' },
];

const values = [
  {
    icon: Target,
    title: 'Practical Skills',
    desc: 'Every course is designed around real-world projects and outcomes, not just theory.',
    gradient: 'from-indigo-500/10 to-purple-500/10',
  },
  {
    icon: Users,
    title: 'Expert Instructors',
    desc: 'Learn from industry professionals who bring years of hands-on experience.',
    gradient: 'from-blue-500/10 to-cyan-500/10',
  },
  {
    icon: Heart,
    title: 'Bilingual Learning',
    desc: 'All courses available in Hindi and English, so language is never a barrier.',
    gradient: 'from-orange-500/10 to-amber-500/10',
  },
  {
    icon: Sparkles,
    title: 'Affordable Pricing',
    desc: 'Premium quality education at prices that respect your budget.',
    gradient: 'from-emerald-500/10 to-teal-500/10',
  },
];

export function AboutPage() {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';
  const [activeTab, setActiveTab] = useState('overview');

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <FloatingNav />

      {/* Floating Jump-to Sub-Navigation Pill Bar (Matching Reference Screenshot) */}
      <div className="sticky top-[72px] z-40 py-3 bg-[var(--canvas)]/80 backdrop-blur-md border-b border-[var(--border)] transition-all">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] shrink-0 mr-1">
            Jump to:
          </span>
          {jumpLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 shrink-0 min-h-[36px] flex items-center ${
                  isActive
                    ? 'bg-[var(--ink)] text-[var(--surface)] shadow-sm'
                    : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--canvas)]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Overview */}
      <section id="overview" className="pt-16 pb-16 px-6 max-w-7xl mx-auto text-center">
        <InView>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            {t('nav.about', 'About ClassConnect')}
          </div>
        </InView>

        <TextEffect preset="fade-in-blur" className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-manrope tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
          {isHindi ? 'ज्ञान जो आपको आगे बढ़ाए' : 'Making quality education accessible to everyone'}
        </TextEffect>

        <InView>
          <p className="text-lg md:text-xl text-[var(--ink-muted)] max-w-2xl mx-auto leading-relaxed">
            {isHindi
              ? 'क्लासकनेक्ट भारत का सबसे विजुअल और इंटरएक्टिव लर्निंग प्लेटफॉर्म है। हम व्यावहारिक और जॉब-रेडी स्किल्स सिखाते हैं।'
              : "ClassConnect is India's premier visual learning OS. We believe great education should be affordable, bilingual in Hindi & English, and built around real skills."}
          </p>
        </InView>
      </section>

      {/* Large Numbers Impact Section (Matching Reference Screenshot) */}
      <section id="stats" className="py-16 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 text-center lg:text-left">
            <InView>
              <div>
                <div className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-manrope text-[var(--primary)] mb-2 tracking-tight">
                  <NumberTicker value={10} suffix="k+" />
                </div>
                <p className="text-sm font-semibold text-[var(--ink-muted)] uppercase tracking-wider">
                  Global active learners
                </p>
              </div>
            </InView>

            <InView delay={0.1}>
              <div>
                <div className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-manrope text-[var(--primary)] mb-2 tracking-tight">
                  <NumberTicker value={50} suffix="+" />
                </div>
                <p className="text-sm font-semibold text-[var(--ink-muted)] uppercase tracking-wider">
                  Industry-ready courses
                </p>
              </div>
            </InView>

            <InView delay={0.2}>
              <div>
                <div className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-manrope text-[var(--primary)] mb-2 tracking-tight">
                  <NumberTicker value={100} suffix="%" />
                </div>
                <p className="text-sm font-semibold text-[var(--ink-muted)] uppercase tracking-wider">
                  Bilingual Hindi & English
                </p>
              </div>
            </InView>

            <InView delay={0.3}>
              <div>
                <div className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-manrope text-[var(--primary)] mb-2 tracking-tight">
                  <NumberTicker value={4} decimals={1} suffix="★" />
                </div>
                <p className="text-sm font-semibold text-[var(--ink-muted)] uppercase tracking-wider">
                  Average student rating
                </p>
              </div>
            </InView>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <TextEffect preset="fade-in-blur" className="text-3xl md:text-4xl font-extrabold font-manrope mb-4">
            {t('about.valuesHeading', 'What makes us different')}
          </TextEffect>
          <p className="text-[var(--ink-muted)] text-base max-w-xl mx-auto">
            We focus on outcome-oriented learning, visual clarity, and accessible instruction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((item, i) => {
            const Icon = item.icon;
            return (
              <InView key={i} delay={i * 0.1}>
                <div className="card p-8 group hover:shadow-[var(--shadow-lg)] transition-all duration-300 rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 border border-[var(--border)] group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-[var(--primary)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--ink)] mb-3 font-manrope">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </InView>
            );
          })}
        </div>
      </section>

      {/* Large Featured Deep Purple Career Banner Card (Matching Reference Screenshot) */}
      <section id="career" className="py-12 max-w-7xl mx-auto px-6 mb-16">
        <InView>
          <div className="relative rounded-[32px] md:rounded-[40px] overflow-hidden bg-[#2D1B69] text-white p-8 md:p-14 shadow-2xl">
            {/* Ambient Background Gradient Accent */}
            <div className="pointer-events-none absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="pointer-events-none absolute left-0 top-0 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              {/* Left Column Text */}
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-manrope leading-[1.15] text-white tracking-tight">
                  Ready for your next <br className="hidden sm:block" /> big career move?
                </h2>
                <p className="text-white/80 text-base md:text-lg max-w-xl font-normal leading-relaxed">
                  Join an all-star learning platform where ambitious people come to do their best work. 
                  If you're looking to build innovative technical skills and help yourself grow, you found it.
                </p>
                <div className="pt-4">
                  <Link
                    to="/courses"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#2D1B69] font-extrabold text-base hover:bg-gray-100 transition-all duration-300 shadow-lg group"
                  >
                    <span className="w-7 h-7 rounded-full bg-[#2D1B69] text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                    Explore All Courses
                  </Link>
                </div>
              </div>

              {/* Right Column Team / Student Visual */}
              <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-indigo-900/50 group">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
                    alt="ClassConnect Instructors & Team"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Subtle Name Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-white/80 font-medium">
                    <div>
                      <div className="font-bold text-white">Samir Singh</div>
                      <div className="text-[11px] text-white/70">Founder & Lead</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">Priya & Rahul</div>
                      <div className="text-[11px] text-white/70">Design & Mobile Leads</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </InView>
      </section>

      <Footer />
    </div>
  );
}

export default AboutPage;
