import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  CheckCircle2, 
  Star, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Globe,
  ArrowRight
} from 'lucide-react';
import { ShimmerButton } from '../motion/ShimmerButton';
import { NumberTicker } from '../motion/NumberTicker';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';

export function ArcOrbitStatsCtaSection() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isHindi = language === 'hi';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-50px' });

  // Floating Micro Badges along the concentric orbit curves (Exact Reference Screenshot Style)
  const orbitBadges = [
    {
      id: 'badge-1',
      text: isHindi ? '✓ नामांकन जारी' : '✓ Enrollment Active',
      bgColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300',
      pos: 'top-12 left-4 lg:left-16',
      icon: CheckCircle2,
    },
    {
      id: 'badge-2',
      text: isHindi ? '10K+ विद्यार्थी' : '10K+ Active Learners',
      bgColor: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300',
      pos: 'top-4 left-1/3 -translate-x-1/2',
      icon: Users,
    },
    {
      id: 'badge-3',
      text: isHindi ? '100% द्विभाषी' : '100% Bilingual',
      bgColor: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300',
      pos: 'top-10 right-1/3 translate-x-1/2',
      icon: Globe,
    },
    {
      id: 'badge-4',
      text: '4.8 ★ Rating',
      bgColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300',
      pos: 'top-20 right-4 lg:right-16',
      icon: Star,
    },
    {
      id: 'badge-5',
      text: isHindi ? '50+ प्रीमियम कोर्स' : '50+ Premium Courses',
      bgColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300',
      pos: 'top-32 left-12 lg:left-32',
      icon: BookOpen,
    },
    {
      id: 'badge-6',
      text: isHindi ? '24/7 सपोर्ट' : '24/7 Mentorship',
      bgColor: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300',
      pos: 'top-36 right-12 lg:right-32',
      icon: MessageSquare,
    },
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative py-28 px-4 sm:px-8 bg-[var(--canvas)] overflow-hidden min-h-[640px] flex flex-col justify-center"
    >
      {/* Concentric Arc SVG Orbit Lines (Exact Reference Screenshot Style) */}
      <svg 
        className="absolute inset-x-0 top-0 w-full h-[360px] pointer-events-none z-0 overflow-visible opacity-50"
        viewBox="0 0 1000 360"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="arcOrbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4338F2" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Outer Arc Curve */}
        <motion.path
          d="M 20 280 Q 500 20 980 280"
          stroke="url(#arcOrbitGrad)"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
        />

        {/* Inner Arc Curve */}
        <motion.path
          d="M 120 310 Q 500 80 880 310"
          stroke="url(#arcOrbitGrad)"
          strokeWidth="2"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.6, delay: 0.2, ease: 'easeOut' }}
        />
      </svg>

      {/* Floating Micro-Badges along Orbit Lines */}
      <div className="absolute inset-x-0 top-0 max-w-6xl mx-auto h-[320px] pointer-events-none z-10">
        {orbitBadges.map((badge, idx) => {
          const IconComp = badge.icon;
          return (
            <motion.div
              key={badge.id}
              className={`absolute ${badge.pos} pointer-events-auto`}
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={isInView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0, opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                delay: 0.1 * idx,
                type: 'spring',
                stiffness: 240,
              }}
              whileHover={{ scale: 1.08, y: -3 }}
            >
              <div className={`px-3.5 py-1.5 rounded-full border shadow-sm backdrop-blur-md text-xs font-bold flex items-center gap-2 ${badge.bgColor}`}>
                <IconComp className="w-3.5 h-3.5" />
                <span>{badge.text}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Numerical Stats Row (Exact Reference Screenshot Layout) */}
      <div className="relative z-20 max-w-4xl mx-auto text-center pt-16 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {/* Stat 1: 10000+ */}
          <div className="flex flex-col items-center">
            <div className="text-4xl sm:text-5xl font-extrabold font-manrope text-[var(--ink)] tracking-tight mb-2 flex items-baseline">
              <NumberTicker value={10000} />+
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[var(--ink-muted)] uppercase tracking-wider">
              {isHindi ? 'ग्लोबल विद्यार्थी' : 'Students Worldwide'}
            </div>
          </div>

          {/* Stat 2: 50+ */}
          <div className="flex flex-col items-center">
            <div className="text-4xl sm:text-5xl font-extrabold font-manrope text-[var(--ink)] tracking-tight mb-2 flex items-baseline">
              <NumberTicker value={50} />+
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[var(--ink-muted)] uppercase tracking-wider">
              {isHindi ? 'प्रीमियम कोर्स' : 'Premium Courses'}
            </div>
          </div>

          {/* Stat 3: 5/5 */}
          <div className="flex flex-col items-center">
            <div className="text-4xl sm:text-5xl font-extrabold font-manrope text-[var(--ink)] tracking-tight mb-2 flex items-baseline gap-1">
              <span>5/5</span>
              <Star className="w-6 h-6 fill-[var(--accent)] text-[var(--accent)] inline-block" />
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[var(--ink-muted)] uppercase tracking-wider">
              {isHindi ? 'औसत रेटिंग' : 'Average Rating'}
            </div>
          </div>

          {/* Stat 4: 24/7 */}
          <div className="flex flex-col items-center">
            <div className="text-4xl sm:text-5xl font-extrabold font-manrope text-[var(--ink)] tracking-tight mb-2 flex items-baseline">
              24/7
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[var(--ink-muted)] uppercase tracking-wider">
              {isHindi ? 'लाइव सपोर्ट' : 'Support'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Merged CTA Section Below Stats (Exact Reference Screenshot Flow) */}
      <div className="relative z-20 max-w-3xl mx-auto text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-manrope text-[var(--ink)] tracking-tight mb-4"
        >
          {isHindi ? 'सीखना शुरू करने के लिए तैयार हैं?' : 'Ready to start learning?'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-base sm:text-lg text-[var(--ink-muted)] font-normal leading-relaxed max-w-xl mx-auto mb-10"
        >
          {isHindi 
            ? 'आज ही हमारे कम्युनिटी से जुड़ें और अपने लक्ष्यों को प्राप्त करने की दिशा में पहला कदम बढ़ाएं।'
            : 'Join our community of learners today and take the first step towards achieving your goals.'}
        </motion.p>

        {/* CTA Dual Pill Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/courses" className="w-full sm:w-auto">
            <ShimmerButton className="w-full sm:w-auto px-8 py-4 text-base font-bold shadow-lg">
              <span className="flex items-center gap-2">
                {isHindi ? 'सभी कोर्स देखें' : 'Explore All Courses'}
                <ArrowRight className="w-4 h-4" />
              </span>
            </ShimmerButton>
          </Link>

          {!user && (
            <Link to="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-[var(--radius-pill)] border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] font-bold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300 min-h-[48px] shadow-sm cursor-pointer">
                {isHindi ? 'फ्री अकाउंट बनाएं' : 'Create Free Account'}
              </button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default ArcOrbitStatsCtaSection;
