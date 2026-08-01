import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Globe, 
  Award, 
  Users, 
  Star, 
  GraduationCap, 
  Code2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function ConnectedConstellationSection() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-100px' });

  // Floating Node Data
  const nodes = [
    {
      id: 'node-bilingual',
      title: 'Bilingual OS',
      sub: 'Hindi & English',
      badge: 'HI + EN',
      badgeBg: 'bg-rose-500',
      icon: Globe,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
      borderColor: 'border-indigo-300 dark:border-indigo-700',
      pos: 'top-6 left-4 lg:top-12 lg:left-12',
    },
    {
      id: 'node-certificates',
      title: 'Certificates',
      sub: '8 Verifiable',
      badge: '100%',
      badgeBg: 'bg-amber-500',
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950/50',
      borderColor: 'border-amber-300 dark:border-amber-700',
      pos: 'top-2 left-1/2 -translate-x-1/2 lg:top-4 lg:left-1/2',
    },
    {
      id: 'node-instructors',
      title: 'Mentors',
      sub: 'Expert Faculty',
      badge: 'PRO',
      badgeBg: 'bg-blue-600',
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/50',
      borderColor: 'border-blue-300 dark:border-blue-700',
      pos: 'top-8 right-4 lg:top-14 lg:right-12',
    },
    {
      id: 'node-skills',
      title: 'Job Skills',
      sub: 'Real Projects',
      badge: '100A',
      badgeBg: 'bg-emerald-600',
      icon: Code2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
      borderColor: 'border-emerald-300 dark:border-emerald-700',
      pos: 'bottom-8 left-4 lg:bottom-16 lg:left-16',
    },
    {
      id: 'node-learners',
      title: 'Learners',
      sub: 'Active Community',
      badge: '10K+',
      badgeBg: 'bg-purple-600',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/50',
      borderColor: 'border-purple-300 dark:border-purple-700',
      pos: 'bottom-2 left-1/2 -translate-x-1/2 lg:bottom-6 lg:left-1/2',
    },
    {
      id: 'node-rating',
      title: 'Rating',
      sub: 'Top Reviewed',
      badge: '4.8 ★',
      badgeBg: 'bg-orange-500',
      icon: Star,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/50',
      borderColor: 'border-orange-300 dark:border-orange-700',
      pos: 'bottom-10 right-4 lg:bottom-16 lg:right-16',
    },
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative py-32 px-4 sm:px-8 bg-[var(--canvas)] overflow-hidden min-h-[680px] flex items-center justify-center"
    >
      {/* Dynamic Darker & Sweeping Curved SVG Lines (Targeted Anchor Connections) */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="constellationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4338F2" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* 1. Top-Left Node (Bilingual) -> Center */}
        <motion.path
          d="M 120 70 C 260 90, 320 180, 420 220"
          stroke="url(#constellationGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.85 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* 2. Top-Center Node (Certificates) -> Center */}
        <motion.path
          d="M 500 50 C 500 110, 500 160, 500 210"
          stroke="url(#constellationGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.85 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* 3. Top-Right Node (Mentors) -> Center */}
        <motion.path
          d="M 880 80 C 740 110, 680 180, 580 220"
          stroke="url(#constellationGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.85 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* 4. Bottom-Left Node (Job Skills) -> Center */}
        <motion.path
          d="M 140 500 C 280 460, 340 380, 420 340"
          stroke="url(#constellationGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.85 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* 5. Bottom-Center Node (Learners) -> Center */}
        <motion.path
          d="M 500 540 C 500 470, 500 410, 500 350"
          stroke="url(#constellationGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.85 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* 6. Bottom-Right Node (Rating) -> Center */}
        <motion.path
          d="M 860 480 C 720 440, 660 380, 580 340"
          stroke="url(#constellationGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.85 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      {/* Floating 3D Nodes connected to the curved paths */}
      <div className="absolute inset-0 max-w-6xl mx-auto pointer-events-none z-10">
        {nodes.map((node, index) => {
          const IconComp = node.icon;
          return (
            <motion.div
              key={node.id}
              className={`absolute ${node.pos} pointer-events-auto`}
              initial={{ scale: 0, opacity: 0, y: 40 }}
              animate={isInView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0, opacity: 0, y: 40 }}
              transition={{
                duration: 0.6,
                delay: 0.12 * index + 0.2,
                type: 'spring',
                stiffness: 240,
                damping: 18,
              }}
              whileHover={{ scale: 1.08, y: -5 }}
            >
              <div className={`relative p-3.5 sm:p-4 rounded-2xl ${node.bgColor} border-2 ${node.borderColor} shadow-[0_14px_36px_rgba(0,0,0,0.12)] backdrop-blur-md flex items-center gap-3 transition-transform`}>
                {/* Red/Color Notification Pill Badge */}
                <div className={`absolute -top-3 -right-2 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold text-white ${node.badgeBg} shadow-md border-2 border-white dark:border-slate-900`}>
                  {node.badge}
                </div>

                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center ${node.color}`}>
                  <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <div className="hidden sm:block text-left pr-2">
                  <div className="text-xs font-extrabold text-[var(--ink)] leading-tight">{node.title}</div>
                  <div className="text-[11px] font-semibold text-[var(--ink-muted)]">{node.sub}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Center Headline & Stats Grid */}
      <div className="relative z-20 max-w-3xl mx-auto text-center px-4 py-12">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-manrope text-[var(--ink)] tracking-tight leading-[1.2] mb-10"
        >
          {isHindi 
            ? 'पारंपरिक ऑनलाइन शिक्षा अव्यवस्थित है। क्लासकनेक्ट सब कुछ जोड़ता है।'
            : 'Traditional online learning is fragmented. ClassConnect unites everything.'}
        </motion.h2>

        {/* 3 Sub-Text Bullet Items */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left font-mono"
        >
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:border-[var(--primary)]/40 transition-colors">
            <div className="text-xs font-semibold text-[var(--ink-muted)] leading-relaxed">
              {isHindi ? '100% द्विभाषी हिंदी और अंग्रेजी भाषा में लर्निंग OS' : '100% Bilingual Hindi & English visual learning OS.'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:border-[var(--primary)]/40 transition-colors">
            <div className="text-xs font-semibold text-[var(--ink-muted)] leading-relaxed">
              {isHindi ? '10,000+ सक्रिय विद्यार्थी रियल स्किल्स सीख रहे हैं' : '10,000+ active learners mastering real skills.'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm hover:border-[var(--primary)]/40 transition-colors">
            <div className="text-xs font-semibold text-[var(--ink-muted)] leading-relaxed">
              {isHindi ? '4.8★ रेटिंग और 8 सत्यापन योग्य प्रमाण पत्र' : '4.8★ rating with 8 verifiable skill certificates.'}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ConnectedConstellationSection;
