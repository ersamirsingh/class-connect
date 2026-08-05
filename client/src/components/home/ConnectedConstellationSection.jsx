import React, { useRef, useState, useEffect } from 'react';
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
import { GlowingEffect } from '../motion/GlowingEffect';

export function ConnectedConstellationSection() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-50px' });

  const nodeRefs = useRef({});
  const centerTextRef = useRef(null);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const calculateLines = () => {
      if (!sectionRef.current || !centerTextRef.current) return;
      const secRect = sectionRef.current.getBoundingClientRect();
      const centerRect = centerTextRef.current.getBoundingClientRect();

      const newLines = [];

      const cText = {
        x: centerRect.left + centerRect.width / 2 - secRect.left,
        y: centerRect.top + centerRect.height / 2 - secRect.top,
        top: centerRect.top - secRect.top,
        bottom: centerRect.bottom - secRect.top,
        left: centerRect.left - secRect.left,
        right: centerRect.right - secRect.left,
        width: centerRect.width,
        height: centerRect.height,
      };

      Object.keys(nodeRefs.current).forEach((key) => {
        const nodeEl = nodeRefs.current[key];
        if (!nodeEl) return;
        const r = nodeEl.getBoundingClientRect();

        const n = {
          x: r.left + r.width / 2 - secRect.left,
          y: r.top + r.height / 2 - secRect.top,
          top: r.top - secRect.top,
          bottom: r.bottom - secRect.top,
          left: r.left - secRect.left,
          right: r.right - secRect.left,
          width: r.width,
          height: r.height,
        };

        let startX = n.x;
        let startY = n.y;
        let endX = cText.x;
        let endY = cText.y;
        let controlX = (startX + endX) / 2;
        let controlY = (startY + endY) / 2;

        if (key === 'node-bilingual') {
          startX = n.right;
          startY = n.bottom - 10;
          endX = cText.left + 20;
          endY = cText.top + 20;
          controlX = startX + 40;
          controlY = startY + 30;
        } else if (key === 'node-certificates') {
          startX = n.x;
          startY = n.bottom;
          endX = cText.x;
          endY = cText.top - 5;
          controlX = n.x;
          controlY = (startY + endY) / 2;
        } else if (key === 'node-instructors') {
          startX = n.left;
          startY = n.bottom - 10;
          endX = cText.right - 20;
          endY = cText.top + 20;
          controlX = startX - 40;
          controlY = startY + 30;
        } else if (key === 'node-skills') {
          startX = n.right;
          startY = n.top + 10;
          endX = cText.left + 40;
          endY = cText.bottom - 20;
          controlX = startX + 40;
          controlY = startY - 30;
        } else if (key === 'node-learners') {
          startX = n.x;
          startY = n.top;
          endX = cText.x;
          endY = cText.bottom + 5;
          controlX = n.x;
          controlY = (startY + endY) / 2;
        } else if (key === 'node-rating') {
          startX = n.left;
          startY = n.top + 10;
          endX = cText.right - 40;
          endY = cText.bottom - 20;
          controlX = startX - 40;
          controlY = startY - 30;
        }

        const pathD = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
        newLines.push({ id: key, pathD, startX, startY, endX, endY });
      });

      setLines(newLines);
    };

    calculateLines();
    window.addEventListener('resize', calculateLines);
    const timer = setTimeout(calculateLines, 250);
    return () => {
      window.removeEventListener('resize', calculateLines);
      clearTimeout(timer);
    };
  }, []);

  const nodes = [
    {
      id: 'node-bilingual',
      title: 'Bilingual OS',
      sub: 'Hindi & English',
      badge: 'HI + EN',
      badgeBg: 'bg-rose-500',
      icon: Globe,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50/90 dark:bg-indigo-950/60',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      glowColor: 'rgba(67, 56, 242, 0.45)',
    },
    {
      id: 'node-certificates',
      title: 'Certificates',
      sub: '8 Verifiable',
      badge: '100%',
      badgeBg: 'bg-amber-500',
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50/90 dark:bg-amber-950/60',
      borderColor: 'border-amber-200 dark:border-amber-800',
      glowColor: 'rgba(245, 158, 11, 0.45)',
    },
    {
      id: 'node-instructors',
      title: 'Mentors',
      sub: 'Expert Faculty',
      badge: 'PRO',
      badgeBg: 'bg-blue-600',
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50/90 dark:bg-blue-950/60',
      borderColor: 'border-blue-200 dark:border-blue-800',
      glowColor: 'rgba(37, 99, 235, 0.45)',
    },
    {
      id: 'node-skills',
      title: 'Job Skills',
      sub: 'Real Projects',
      badge: '100A',
      badgeBg: 'bg-emerald-600',
      icon: Code2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50/90 dark:bg-emerald-950/60',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      glowColor: 'rgba(5, 150, 105, 0.45)',
    },
    {
      id: 'node-learners',
      title: 'Learners',
      sub: 'Active Community',
      badge: '10K+',
      badgeBg: 'bg-purple-600',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50/90 dark:bg-purple-950/60',
      borderColor: 'border-purple-200 dark:border-purple-800',
      glowColor: 'rgba(147, 51, 234, 0.45)',
    },
    {
      id: 'node-rating',
      title: 'Rating',
      sub: 'Top Reviewed',
      badge: '4.8 ★',
      badgeBg: 'bg-orange-500',
      icon: Star,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50/90 dark:bg-orange-950/60',
      borderColor: 'border-orange-200 dark:border-orange-800',
      glowColor: 'rgba(255, 107, 53, 0.45)',
    },
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative py-16 sm:py-24 px-3 sm:px-8 bg-[var(--canvas)] overflow-hidden min-h-[640px] flex flex-col justify-between"
    >
      {/* Real-time Calculated SVG Connecting Lines */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        fill="none"
      >
        <defs>
          <linearGradient id="liveConstellationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4338F2" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#FF6B35" />
          </linearGradient>
        </defs>

        {lines.map((line, index) => (
          <g key={line.id}>
            <motion.path
              d={line.pathD}
              stroke="url(#liveConstellationGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.95 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1.2, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          </g>
        ))}
      </svg>

      {/* Top Row Nodes: Responsive Flex Wrap */}
      <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-10">
        <div ref={(el) => (nodeRefs.current['node-bilingual'] = el)}>
          <NodeCard node={nodes[0]} isInView={isInView} delay={0.1} />
        </div>
        <div ref={(el) => (nodeRefs.current['node-certificates'] = el)}>
          <NodeCard node={nodes[1]} isInView={isInView} delay={0.2} />
        </div>
        <div ref={(el) => (nodeRefs.current['node-instructors'] = el)}>
          <NodeCard node={nodes[2]} isInView={isInView} delay={0.3} />
        </div>
      </div>

      {/* Center Headline */}
      <div ref={centerTextRef} className="relative z-20 max-w-2xl mx-auto text-center px-2 sm:px-4 py-4 sm:py-6">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-xl sm:text-3xl md:text-4xl font-extrabold font-manrope text-[var(--ink)] tracking-tight leading-[1.25] mb-6 sm:mb-8"
        >
          {isHindi ? (
            <span>
              पारंपरिक ऑनलाइन शिक्षा अव्यवस्थित है।{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4338F2] via-[#7C3AED] to-[#FF6B35]">
                क्लासकनेक्ट सब कुछ जोड़ता है।
              </span>
            </span>
          ) : (
            <span>
              Traditional online learning is fragmented.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4338F2] via-[#7C3AED] to-[#FF6B35]">
                ClassConnect unites everything.
              </span>
            </span>
          )}
        </motion.h2>

        {/* 3 Sub-Text Bullet Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 text-left font-mono"
        >
          <div className="p-3 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-md">
            <div className="text-xs font-semibold text-[var(--ink-muted)] leading-relaxed">
              {isHindi ? '100% द्विभाषी हिंदी और अंग्रेजी भाषा में लर्निंग OS' : '100% Bilingual Hindi & English visual learning OS.'}
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-md">
            <div className="text-xs font-semibold text-[var(--ink-muted)] leading-relaxed">
              {isHindi ? '10,000+ सक्रिय विद्यार्थी रियल स्किल्स सीख रहे हैं' : '10,000+ active learners mastering real skills.'}
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-md">
            <div className="text-xs font-semibold text-[var(--ink-muted)] leading-relaxed">
              {isHindi ? '4.8★ रेटिंग और 8 सत्यापन योग्य प्रमाण पत्र' : '4.8★ rating with 8 verifiable skill certificates.'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row Nodes */}
      <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-4 mt-6 sm:mt-10">
        <div ref={(el) => (nodeRefs.current['node-skills'] = el)}>
          <NodeCard node={nodes[3]} isInView={isInView} delay={0.4} />
        </div>
        <div ref={(el) => (nodeRefs.current['node-learners'] = el)}>
          <NodeCard node={nodes[4]} isInView={isInView} delay={0.5} />
        </div>
        <div ref={(el) => (nodeRefs.current['node-rating'] = el)}>
          <NodeCard node={nodes[5]} isInView={isInView} delay={0.6} />
        </div>
      </div>
    </section>
  );
}

function NodeCard({ node, isInView, delay }) {
  const IconComp = node.icon;
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={isInView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0, opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay,
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{ scale: 1.05, y: -3 }}
      className="relative pointer-events-auto group"
    >
      <GlowingEffect
        glowColor={node.glowColor}
        accentGlow="rgba(255, 107, 53, 0.4)"
        containerClassName="h-full rounded-xl sm:rounded-2xl"
      >
        <div className={`relative p-2.5 sm:p-4 rounded-xl sm:rounded-2xl ${node.bgColor} border ${node.borderColor} shadow-sm backdrop-blur-md flex items-center gap-2 sm:gap-3 min-w-[125px] sm:min-w-[170px]`}>
          {/* Red/Color Notification Pill Badge */}
          <div className={`absolute -top-2.5 -right-1.5 px-2 py-0.5 rounded-full text-[10px] font-black text-white ${node.badgeBg} shadow-md border-2 border-white dark:border-slate-900 z-20`}>
            {node.badge}
          </div>

          <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-center ${node.color} shrink-0`}>
            <IconComp className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>

          <div className="text-left pr-1">
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
              {node.title}
            </div>
            <div className="text-[9px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              {node.sub}
            </div>
          </div>
        </div>
      </GlowingEffect>
    </motion.div>
  );
}

export default ConnectedConstellationSection;
