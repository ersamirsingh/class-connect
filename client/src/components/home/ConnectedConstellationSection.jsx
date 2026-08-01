import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Globe, 
  Award, 
  Sparkles, 
  Users, 
  Star, 
  GraduationCap, 
  CheckCircle2,
  Code2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function ConnectedConstellationSection() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-100px' });

  // Floating Node Data based on prompt & reference image
  const nodes = [
    {
      id: 'node-bilingual',
      title: 'Bilingual OS',
      sub: 'Hindi & English',
      badge: 'HI + EN',
      badgeBg: 'bg-rose-500',
      icon: Globe,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
      borderColor: 'border-indigo-200 dark:border-indigo-800/50',
      pos: 'top-4 left-4 lg:top-10 lg:left-12',
    },
    {
      id: 'node-certificates',
      title: 'Certificates',
      sub: '8 Verifiable',
      badge: '100%',
      badgeBg: 'bg-amber-500',
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-200 dark:border-amber-800/50',
      pos: 'top-0 right-1/4 lg:top-4 lg:right-1/3',
    },
    {
      id: 'node-instructors',
      title: 'Mentors',
      sub: 'Expert Faculty',
      badge: 'PRO',
      badgeBg: 'bg-blue-600',
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-200 dark:border-blue-800/50',
      pos: 'top-6 right-4 lg:top-12 lg:right-12',
    },
    {
      id: 'node-skills',
      title: 'Job Skills',
      sub: 'Real Projects',
      badge: '100A',
      badgeBg: 'bg-emerald-600',
      icon: Code2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderColor: 'border-emerald-200 dark:border-emerald-800/50',
      pos: 'bottom-6 left-4 lg:bottom-12 lg:left-16',
    },
    {
      id: 'node-learners',
      title: 'Learners',
      sub: 'Active Community',
      badge: '10K+',
      badgeBg: 'bg-purple-600',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
      borderColor: 'border-purple-200 dark:border-purple-800/50',
      pos: 'bottom-2 left-1/3 lg:bottom-6 lg:left-1/2 -translate-x-1/2',
    },
    {
      id: 'node-rating',
      title: 'Rating',
      sub: 'Top Reviewed',
      badge: '4.8 ★',
      badgeBg: 'bg-orange-500',
      icon: Star,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/40',
      borderColor: 'border-orange-200 dark:border-orange-800/50',
      pos: 'bottom-8 right-4 lg:bottom-14 lg:right-16',
    },
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative py-28 px-4 sm:px-8 bg-[var(--canvas)] overflow-hidden min-h-[640px] flex items-center justify-center"
    >
      {/* Dynamic Animated Curved SVG Connector Lines (Reference Image Style) */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Top-Left Curve */}
        <motion.path
          d="M 120 100 Q 250 180 400 240"
          stroke="var(--ink-faint)"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity={0.35}
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />

        {/* Top-Right Curve */}
        <motion.path
          d="M 880 120 Q 720 180 600 240"
          stroke="var(--ink-faint)"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity={0.35}
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
        />

        {/* Bottom-Left Curve */}
        <motion.path
          d="M 160 480 Q 300 420 400 360"
          stroke="var(--ink-faint)"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity={0.35}
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        />

        {/* Bottom-Right Curve */}
        <motion.path
          d="M 840 460 Q 700 400 600 360"
          stroke="var(--ink-faint)"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity={0.35}
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
        />

        {/* Bottom-Center Straight Up Curve */}
        <motion.path
          d="M 500 520 L 500 400"
          stroke="var(--ink-faint)"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity={0.35}
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        />
      </svg>

      {/* Floating 3D App Icon Nodes (Reference Style) */}
      <div className="absolute inset-0 max-w-6xl mx-auto pointer-events-none z-10">
        {nodes.map((node, index) => {
          const IconComp = node.icon;
          return (
            <motion.div
              key={node.id}
              className={`absolute ${node.pos} pointer-events-auto`}
              initial={{ scale: 0, opacity: 0, y: 30 }}
              animate={isInView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0, opacity: 0, y: 30 }}
              transition={{
                duration: 0.6,
                delay: 0.15 * index,
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              whileHover={{ scale: 1.08, y: -4 }}
            >
              <div className={`relative p-3.5 sm:p-4 rounded-2xl ${node.bgColor} border ${node.borderColor} shadow-[0_12px_32px_rgba(0,0,0,0.08)] backdrop-blur-md flex items-center gap-3 transition-transform`}>
                {/* Red/Color Notification Pill Badge (Exact Reference Style) */}
                <div className={`absolute -top-2.5 -right-2 px-2 py-0.5 rounded-full text-[10px] font-black text-white ${node.badgeBg} shadow-md border-2 border-white dark:border-slate-900`}>
                  {node.badge}
                </div>

                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center ${node.color}`}>
                  <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <div className="hidden sm:block text-left pr-2">
                  <div className="text-xs font-bold text-[var(--ink)] leading-tight">{node.title}</div>
                  <div className="text-[11px] font-medium text-[var(--ink-muted)]">{node.sub}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Center Headline & Stats Text (Exact Reference Layout) */}
      <div className="relative z-20 max-w-3xl mx-auto text-center px-4 py-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-manrope text-[var(--ink)] tracking-tight leading-[1.2] mb-10"
        >
          {isHindi 
            ? 'पारंपरिक ऑनलाइन शिक्षा अव्यवस्थित है। क्लासकनेक्ट सब कुछ जोड़ता है।'
            : 'Traditional online learning is fragmented. ClassConnect unites everything.'}
        </motion.h2>

        {/* 3 Sub-Text Bullet Items in Grid (Exact Reference Style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-left font-mono"
        >
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="text-xs font-semibold text-[var(--ink-muted)] leading-relaxed">
              {isHindi ? '100% द्विभाषी हिंदी और अंग्रेजी भाषा में लर्निंग OS' : '100% Bilingual Hindi & English visual learning OS.'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
            <div className="text-xs font-semibold text-[var(--ink-muted)] leading-relaxed">
              {isHindi ? '10,000+ सक्रिय विद्यार्थी रियल स्किल्स सीख रहे हैं' : '10,000+ active learners mastering real skills.'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
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
