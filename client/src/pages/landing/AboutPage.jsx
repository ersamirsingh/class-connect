import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Heart, Target, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';
import { TextEffect } from '../../components/motion/TextEffect';
import { InView } from '../../components/motion/InView';
import { NumberTicker } from '../../components/motion/NumberTicker';
import { useLanguage } from '../../context/LanguageContext';

const values = [
  {
    icon: Target,
    title: 'Practical Skills',
    desc: 'Every course is designed around real-world projects and outcomes, not just theory.',
    gradient: 'from-[var(--aura-violet)] to-[var(--aura-blue)]',
  },
  {
    icon: Users,
    title: 'Expert Instructors',
    desc: 'Learn from industry professionals who bring years of hands-on experience.',
    gradient: 'from-[var(--aura-blue)] to-[var(--aura-peach)]',
  },
  {
    icon: Heart,
    title: 'Bilingual Learning',
    desc: 'All courses available in Hindi and English, so language is never a barrier.',
    gradient: 'from-[var(--aura-peach)] to-[var(--aura-violet)]',
  },
  {
    icon: Sparkles,
    title: 'Affordable Pricing',
    desc: 'Premium quality education at prices that respect your budget.',
    gradient: 'from-[var(--aura-violet)] to-[var(--aura-peach)]',
  },
];

export function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <FloatingNav />

      {/* Hero */}
      <section className="section-gap">
        <div className="page-container text-center">
          <InView>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
              bg-[var(--primary-soft)] text-[var(--primary)] text-sm font-semibold mb-6">
              <BookOpen className="w-4 h-4" />
              {t('nav.about', 'About Us')}
            </div>
          </InView>

          <TextEffect preset="fade-in-blur" className="section-heading mb-5">
            {t('about.headline', 'Making quality education accessible to everyone')}
          </TextEffect>

          <InView>
            <p className="section-subheading mx-auto">
              {t('about.subtitle', 'ClassConnect is India\'s most visual learning platform. We believe that great education should be affordable, accessible in your language, and designed to help you build real skills.')}
            </p>
          </InView>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 10000, suffix: '+', label: 'Students' },
              { value: 50, suffix: '+', label: 'Courses' },
              { value: 4.8, decimals: 1, suffix: '', label: 'Rating' },
              { value: 24, suffix: '/7', label: 'Support' },
            ].map((stat, i) => (
              <InView key={i}>
                <div className="text-center p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                  <div className="text-3xl md:text-4xl font-extrabold text-[var(--primary)] mb-1"
                    style={{ fontFamily: 'Manrope, sans-serif' }}>
                    <NumberTicker value={stat.value} decimals={stat.decimals || 0} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm font-medium text-[var(--ink-muted)]">{stat.label}</p>
                </div>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-gap">
        <div className="page-container">
          <div className="text-center mb-12">
            <TextEffect preset="fade-in-blur" className="section-heading mb-4">
              {t('about.valuesHeading', 'What makes us different')}
            </TextEffect>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((item, i) => {
              const Icon = item.icon;
              return (
                <InView key={i}>
                  <div className="card p-8 group hover:shadow-[var(--shadow-lg)] transition-all duration-300">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient}
                      flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-[var(--primary-deep)]" />
                    </div>
                    <h3 className="text-lg font-bold text-[var(--ink)] mb-2"
                      style={{ fontFamily: 'Manrope, sans-serif' }}>
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
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center">
            <InView>
              <div className="relative p-8 md:p-12 rounded-3xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, var(--aura-violet) 0%, var(--aura-blue) 50%, var(--aura-peach) 100%)`,
                }}
              >
                <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--primary-deep)] mb-4"
                  style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {t('about.missionTitle', 'Our Mission')}
                </h2>
                <p className="text-base md:text-lg text-[var(--primary-deep)] opacity-80 leading-relaxed mb-8">
                  {t('about.missionDesc', 'To empower 1 million learners across India with practical, industry-relevant skills through beautifully designed courses in Hindi and English — at prices everyone can afford.')}
                </p>
                <Link
                  to="/courses"
                  className="btn-primary inline-flex items-center gap-2 rounded-xl"
                >
                  {t('hero.ctaBrowse', 'Explore Courses')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </InView>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
