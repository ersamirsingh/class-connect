import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Heart, Target, Sparkles, ArrowRight, Globe, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';
import { SplitText } from '../../components/motion/SplitText';
import { InView } from '../../components/motion/InView';
import { NumberTicker } from '../../components/motion/NumberTicker';
import { useLanguage } from '../../context/LanguageContext';
import { ContactSupportSection } from '../../components/about/ContactSupportSection';

const jumpLinks = [
  { id: 'overview', label: 'Overview' },
  { id: 'stats', label: 'Impact' },
  { id: 'values', label: 'Our Values' },
  { id: 'career', label: 'Career Banner' },
  { id: 'contact', label: 'Contact Support' },
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
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] overflow-x-hidden">
      <FloatingNav />

      {/* Hero Overview */}
      <section id="overview" className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center relative">
        {/* Subtle Background Glow Aura */}
        <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-tr from-[var(--aura-violet)] to-[var(--aura-peach)] filter blur-[120px] opacity-60 -z-10" />

        {/* Animated Title */}
        <div className="mb-6">
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-manrope tracking-tight leading-[1.15] text-[var(--ink)] max-w-4xl mx-auto text-center"
            style={{ textWrap: 'balance' }}
          >
            {isHindi ? (
              <SplitText text="ज्ञान जो आपको आगे बढ़ाए" />
            ) : (
              <span>
                Making quality education{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] via-purple-600 to-[var(--accent)] inline-block">
                  accessible to everyone
                </span>
              </span>
            )}
          </h1>
        </div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-base sm:text-lg text-[var(--ink-muted)] font-normal leading-relaxed text-center">
            {isHindi
              ? 'क्लासकनेक्ट भारत का सबसे विजुअल और इंटरएक्टिव लर्निंग प्लेटफॉर्म है। हम व्यावहारिक और जॉब-रेडी स्किल्स सिखाते हैं।'
              : "ClassConnect is India's premier visual learning OS. We believe great education should be affordable, bilingual in Hindi & English, and built around real skills."}
          </p>
        </motion.div>
      </section>

      {/* Premium Tactile Numbers Impact Cards (Smaller & Deeper Look) */}
      <section id="stats" className="py-16 bg-[var(--surface)] border-y border-[var(--border)] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Stat Card 1 */}
            <InView delay={0.05}>
              <div className="group relative rounded-2xl bg-[var(--canvas)] border border-[var(--border)] p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[var(--primary-soft)] to-transparent rounded-bl-full pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-manrope text-[var(--ink)] mb-1 tracking-tight">
                  <NumberTicker value={10} suffix="k+" />
                </div>
                <p className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">
                  Global active learners
                </p>
              </div>
            </InView>

            {/* Stat Card 2 */}
            <InView delay={0.1}>
              <div className="group relative rounded-2xl bg-[var(--canvas)] border border-[var(--border)] p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-blue-600 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4.5 h-4.5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-manrope text-[var(--ink)] mb-1 tracking-tight">
                  <NumberTicker value={50} suffix="+" />
                </div>
                <p className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">
                  Industry-ready courses
                </p>
              </div>
            </InView>

            {/* Stat Card 3 */}
            <InView delay={0.15}>
              <div className="group relative rounded-2xl bg-[var(--canvas)] border border-[var(--border)] p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-full pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Globe className="w-4.5 h-4.5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-manrope text-[var(--ink)] mb-1 tracking-tight">
                  <NumberTicker value={100} suffix="%" />
                </div>
                <p className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">
                  Bilingual Hindi & English
                </p>
              </div>
            </InView>

            {/* Stat Card 4 */}
            <InView delay={0.2}>
              <div className="group relative rounded-2xl bg-[var(--canvas)] border border-[var(--border)] p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-amber-500 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Star className="w-4.5 h-4.5 fill-current" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-manrope text-[var(--ink)] mb-1 tracking-tight">
                  <NumberTicker value={4} decimals={1} suffix="★" />
                </div>
                <p className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider">
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
          <h2 className="text-3xl md:text-4xl font-extrabold font-manrope mb-4">
            {t('about.valuesHeading', 'What makes us different')}
          </h2>
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

      {/* Large Featured Deep Purple Career Banner Card */}
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

      {/* 5. Contact Support Section (Matching Uploaded Reference Design) */}
      <ContactSupportSection />

      <Footer />
    </div>
  );
}

export default AboutPage;
