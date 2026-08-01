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

export function ConnectedConstellationSection() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-50px' });

  // References for dynamic position calculation
  const nodeRefs = useRef({});
  const centerTextRef = useRef(null);
  const bottomBoxesRef = useRef(null);
  const [lines, setLines] = useState([]);

  // Calculate exact connection coordinates dynamically based on actual DOM box positions!
  useEffect(() => {
    const calculateLines = () => {
      if (!sectionRef.current) return;
      const secRect = sectionRef.current.getBoundingClientRect();
      const newLines = [];

      // Helper to get center of an element relative to section
      const getCenter = (ref) => {
        if (!ref) return null;
        const r = ref.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - secRect.left,
          y: r.top + r.height / 2 - secRect.top,
          width: r.width,
          height: r.height,
        };
      };

      const centerText = getCenter(centerTextRef.current);
      if (!centerText) return;

      Object.keys(nodeRefs.current).forEach((key) => {
        const nodeEl = nodeRefs.current[key];
        const node = getCenter(nodeEl);
        if (!node) return;

        // Determine connection points
        let startX = node.x;
        let startY = node.y;
        let endX = centerText.x;
        let endY = centerText.y;

        // Custom curve offsets based on node position
        let controlX = (startX + endX) / 2;
        let controlY = (startY + endY) / 2;

        if (key === 'node-bilingual') {
          startX = node.x + node.width / 3;
          startY = node.y + node.height / 2;
          endX = centerText.x - centerText.width / 3;
          endY = centerText.y - centerText.height / 4;
          controlY = startY + 40;
        } else if (key === 'node-certificates') {
          startX = node.x;
          startY = node.y + node.height / 2;
          endX = centerText.x;
          endY = centerText.y - centerText.height / 2;
          controlY = (startY + endY) / 2;
        } else if (key === 'node-instructors') {
          startX = node.x - node.width / 3;
          startY = node.y + node.height / 2;
          endX = centerText.x + centerText.width / 3;
          endY = centerText.y - centerText.height / 4;
          controlY = startY + 40;
        } else if (key === 'node-skills') {
          startX = node.x + node.width / 3;
          startY = node.y - node.height / 2;
          endX = centerText.x - centerText.width / 3;
          endY = centerText.y + centerText.height / 3;
          controlY = startY - 40;
        } else if (key === 'node-learners') {
          startX = node.x;
          startY = node.y - node.height / 2;
          endX = centerText.x;
          endY = centerText.y + centerText.height / 2;
          controlY = (startY + endY) / 2;
        } else if (key === 'node-rating') {
          startX = node.x - node.width / 3;
          startY = node.y - node.height / 2;
          endX = centerText.x + centerText.width / 3;
          endY = centerText.y + centerText.height / 3;
          controlY = startY - 40;
        }

        const pathD = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
        newLines.push({ id: key, pathD, startX, startY, endX, endY });
      });

      setLines(newLines);
    };

    calculateLines();
    window.addEventListener('resize', calculateLines);
    const timer = setTimeout(calculateLines, 300);
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
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/60',
      borderColor: 'border-indigo-300 dark:border-indigo-700',
    },
    {
      id: 'node-certificates',
      title: 'Certificates',
      sub: '8 Verifiable',
      badge: '100%',
      badgeBg: 'bg-amber-500',
      icon: Award,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950/60',
      borderColor: 'border-amber-300 dark:border-amber-700',
    },
    {
      id: 'node-instructors',
      title: 'Mentors',
      sub: 'Expert Faculty',
      badge: 'PRO',
      badgeBg: 'bg-blue-600',
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/60',
      borderColor: 'border-blue-300 dark:border-blue-700',
    },
    {
      id: 'node-skills',
      title: 'Job Skills',
      sub: 'Real Projects',
      badge: '100A',
      badgeBg: 'bg-emerald-600',
      icon: Code2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60',
      borderColor: 'border-emerald-300 dark:border-emerald-700',
    },
    {
      id: 'node-learners',
      title: 'Learners',
      sub: 'Active Community',
      badge: '10K+',
      badgeBg: 'bg-purple-600',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/60',
      borderColor: 'border-purple-300 dark:border-purple-700',
    },
    {
      id: 'node-rating',
      title: 'Rating',
      sub: 'Top Reviewed',
      badge: '4.8 ★',
      badgeBg: 'bg-orange-500',
      icon: Star,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/60',
      borderColor: 'border-orange-300 dark:border-orange-700',
    },
  ];

  return (
    <section 
      ref={sectionRef} 
      className="relative py-20 px-4 sm:px-8 bg-[var(--canvas)] overflow-hidden min-h-[700px] flex flex-col justify-between"
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
            {/* Background Glow Line */}
            <motion.path
              d={line.pathD}
              stroke="url(#liveConstellationGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              opacity={0.3}
              filter="blur(3px)"
            />
            {/* Primary Sharp Line */}
            <motion.path
              d={line.pathD}
              stroke="url(#liveConstellationGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.9 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </g>
        ))}
      </svg>

      {/* Top Row Nodes: Bilingual (Left), Certificates (Center), Mentors (Right) */}
      <div className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between gap-4 mb-8">
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
      <div ref={centerTextRef} className="relative z-20 max-w-3xl mx-auto text-center px-4 py-8">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-manrope text-[var(--ink)] tracking-tight leading-[1.2] mb-8"
        >
          {isHindi 
            ? 'पारंपरिक ऑनलाइन शिक्षा अव्यवस्थित है। क्लासकनेक्ट सब कुछ जोड़ता है।'
            : 'Traditional online learning is fragmented. ClassConnect unites everything.'}
        </motion.h2>

        {/* 3 Sub-Text Bullet Items */}
        <motion.div
          ref={bottomBoxesRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left font-mono"
        >
          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-md hover:border-[var(--primary)]/50 transition-colors">
            <div className="text-xs font-semibold text-[var(--ink-muted)] leading-relaxed">
              {isHindi ? '100% द्विभाषी हिंदी और अंग्रेजी भाषा में लर्निंग OS' : '100% Bilingual Hindi & English visual learning OS.'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-md hover:border-[var(--primary)]/50 transition-colors">
            <div className="text-xs font-semibold text-[var(--ink-muted)] leading-relaxed">
              {isHindi ? '10,000+ सक्रिय विद्यार्थी रियल स्किल्स सीख रहे हैं' : '10,000+ active learners mastering real skills.'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-md hover:border-[var(--primary)]/50 transition-colors">
            <div className="text-xs font-semibold text-[var(--ink-muted)] leading-relaxed">
              {isHindi ? '4.8★ रेटिंग और 8 सत्यापन योग्य प्रमाण पत्र' : '4.8★ rating with 8 verifiable skill certificates.'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row Nodes: Job Skills (Left), Learners (Center), Rating (Right) */}
      <div className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between gap-4 mt-8">
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
      initial={{ scale: 0, opacity: 0, y: 30 }}
      animate={isInView ? { scale: 1, opacity: 1, y: 0 } : { scale: 0, opacity: 0, y: 30 }}
      transition={{
        duration: 0.5,
        delay,
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{ scale: 1.06, y: -4 }}
      className="relative pointer-events-auto"
    >
      <div className={`relative p-3.5 sm:p-4 rounded-2xl ${node.bgColor} border-2 ${node.borderColor} shadow-[0_14px_32px_rgba(0,0,0,0.12)] backdrop-blur-md flex items-center gap-3 transition-transform min-w-[150px] sm:min-w-[190px]`}>
        {/* Red/Color Notification Pill Badge */}
        <div className={`absolute -top-3 -right-2 px-2.5 py-0.5 rounded-full text-[11px] font-black text-white ${node.badgeBg} shadow-md border-2 border-white dark:border-slate-900`}>
          {node.badge}
        </div>

        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center ${node.color} shrink-0`}>
          <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <div className="text-left pr-1">
          <div className="text-xs sm:text-sm font-extrabold text-[var(--ink)] leading-tight">{node.title}</div>
          <div className="text-[10px] sm:text-[11px] font-semibold text-[var(--ink-muted)]">{node.sub}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default ConnectedConstellationSection;
