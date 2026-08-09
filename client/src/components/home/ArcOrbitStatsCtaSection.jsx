import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { ShimmerButton } from '../motion/ShimmerButton';
import { NumberTicker } from '../motion/NumberTicker';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';

export function ArcOrbitStatsCtaSection({ statsCms, cmsData }) {
  const cms = statsCms || cmsData;
  const { language } = useLanguage();
  const { user } = useAuth();
  const isHindi = language === 'hi';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-50px' });

  return (
    <section 
      ref={sectionRef} 
      className="relative py-28 px-4 sm:px-8 bg-[var(--surface)] overflow-hidden min-h-[580px] flex flex-col justify-center"
    >
      {/* Concentric Arc SVG Orbit Lines (Clean Sweeping Arcs Above Text) */}
      <svg 
        className="absolute inset-x-0 top-0 w-full h-[320px] pointer-events-none z-0 overflow-visible opacity-45"
        viewBox="0 0 1000 320"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="cleanArcGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4338F2" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="cleanArcGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#4338F2" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Outer Sweeping Arc */}
        <motion.path
          d="M 20 260 Q 500 10 980 260"
          stroke="url(#cleanArcGrad1)"
          strokeWidth="3"
          strokeDasharray="6 6"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />

        {/* Inner Sweeping Arc */}
        <motion.path
          d="M 100 290 Q 500 60 900 290"
          stroke="url(#cleanArcGrad2)"
          strokeWidth="2.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
        />
      </svg>

      {/* Numerical Stats Row (No Boxes — Pure Ultra-Attractive Typography) */}
      <div className="relative z-10 max-w-5xl mx-auto text-center pt-8 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {/* Stat 1: 10,000+ */}
          <div className="flex flex-col items-center group">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black font-manrope bg-clip-text text-transparent bg-gradient-to-r from-[var(--ink)] via-[var(--primary)] to-[var(--ink)] tracking-tight mb-2 group-hover:scale-105 transition-transform duration-300">
              <NumberTicker value={10000} />+
            </div>
            <div className="text-xs sm:text-sm font-bold text-[var(--ink-muted)] uppercase tracking-widest font-mono">
              {isHindi ? 'ग्लोबल विद्यार्थी' : 'Students Worldwide'}
            </div>
          </div>

          {/* Stat 2: 50+ */}
          <div className="flex flex-col items-center group">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black font-manrope bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] via-purple-600 to-[var(--accent)] tracking-tight mb-2 group-hover:scale-105 transition-transform duration-300">
              <NumberTicker value={50} />+
            </div>
            <div className="text-xs sm:text-sm font-bold text-[var(--ink-muted)] uppercase tracking-widest font-mono">
              {isHindi ? 'प्रीमियम कोर्स' : 'Premium Courses'}
            </div>
          </div>

          {/* Stat 3: 5/5 */}
          <div className="flex flex-col items-center group">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black font-manrope text-[var(--ink)] tracking-tight mb-2 flex items-center justify-center gap-1 group-hover:scale-105 transition-transform duration-300">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B35] to-[#F59E0B]">5/5</span>
              <Star className="w-7 h-7 sm:w-8 sm:h-8 fill-[#FF6B35] text-[#FF6B35] inline-block -mt-1" />
            </div>
            <div className="text-xs sm:text-sm font-bold text-[var(--ink-muted)] uppercase tracking-widest font-mono">
              {isHindi ? 'औसत रेटिंग' : 'Average Rating'}
            </div>
          </div>

          {/* Stat 4: 24/7 */}
          <div className="flex flex-col items-center group">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black font-manrope bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-[var(--primary)] to-[var(--accent)] tracking-tight mb-2 group-hover:scale-105 transition-transform duration-300">
              24/7
            </div>
            <div className="text-xs sm:text-sm font-bold text-[var(--ink-muted)] uppercase tracking-widest font-mono">
              {isHindi ? 'लाइव सपोर्ट' : 'Support'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Merged CTA Section (No Boxes — High Impact Clean Text & Buttons) */}
      <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-manrope text-[var(--ink)] tracking-tight leading-tight mb-5"
        >
          {cms?.title ? (
            <span>{cms.title}</span>
          ) : isHindi ? (
            <span>
              మీ కేరిర్‌ను <span className="font-cursive font-normal text-indigo-600 text-4xl sm:text-5xl lg:text-6xl">10x గ్రోత్</span> వైపు తీసుకెళ్లడానికి సిద్ధమా?
            </span>
          ) : (
            <span>
              Ready To <span className="font-cursive font-normal text-indigo-600 text-4xl sm:text-5xl lg:text-6xl">10x Your Tech</span> Salary?
            </span>
          )}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-base sm:text-lg lg:text-xl text-[var(--ink-muted)] font-medium leading-relaxed max-w-2xl mx-auto mb-10"
        >
          {cms?.subtitle || (isHindi 
            ? '10,000+ విద్యార్థులతో చేరండి. ఇండస్ట్రీ-ఆధారిత ప్రాజెక్ట్‌లను నిర్మించి మీ డ్రీమ్ ఉద్యోగాన్ని సాధించండి.'
            : 'Join 10,000+ ambitious skill builders. Master production-grade skills, build real projects, and land high-paying tech roles.')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/courses" className="w-full sm:w-auto">
            <ShimmerButton className="w-full sm:w-auto px-9 py-4 text-base font-bold shadow-xl">
              <span className="flex items-center justify-center gap-2">
                {isHindi ? 'सभी कोर्स देखें' : 'Explore All Courses'}
                <ArrowRight className="w-4 h-4" />
              </span>
            </ShimmerButton>
          </Link>

          {!user && (
            <Link to="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-9 py-4 rounded-[var(--radius-pill)] border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] font-bold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-300 min-h-[48px] shadow-sm cursor-pointer">
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
