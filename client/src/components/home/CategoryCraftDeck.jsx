import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Smartphone, 
  Palette, 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  MonitorPlay,
  Lightbulb,
  Megaphone,
  Compass,
  Sparkles,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function CategoryCraftDeck({ categories = [] }) {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const sliderRef = useRef(null);

  // 6 Major Course Categories matching the reference image styling & colors
  const majorCategories = [
    {
      id: 'web-dev',
      name: isHindi ? 'वेब डेवलपमेंट' : 'Web Development',
      slug: 'web-development',
      sentence: isHindi ? 'HTML, React, Node.js और Next.js 15 सीखें।' : 'Master HTML, CSS, React, Node.js & Next.js 15.',
      courseCount: 12,
      gradient: 'from-[#FF4365] via-[#FF5E7E] to-[#E62E5C]', // Hot Pink / Crimson
      shadowColor: 'shadow-[0_20px_50px_rgba(255,67,101,0.35)]',
      pedestalBg: 'bg-white/20 backdrop-blur-md border-white/30',
      icon: Code2,
      stageIcon: MonitorPlay,
    },
    {
      id: 'app-dev',
      name: isHindi ? 'ऐप डेवलपमेंट' : 'App Development',
      slug: 'app-development',
      sentence: isHindi ? 'React Native और Flutter से मोबाइल ऐप्स बनाएं।' : 'Build native iOS & Android apps with Flutter & React Native.',
      courseCount: 8,
      gradient: 'from-[#10B981] via-[#34D399] to-[#059669]', // Emerald Green
      shadowColor: 'shadow-[0_20px_50px_rgba(16,185,129,0.35)]',
      pedestalBg: 'bg-white/20 backdrop-blur-md border-white/30',
      icon: Smartphone,
      stageIcon: Smartphone,
    },
    {
      id: 'ui-ux',
      name: isHindi ? 'यूआई/यूएक्स डिजाइन' : 'UI/UX Design',
      slug: 'ui-ux-design',
      sentence: isHindi ? 'Figma, मोशन डिजाइन और विजुअल सिस्टम सीखें।' : 'Figma, Visual Design Systems & Micro-Interactions.',
      courseCount: 6,
      gradient: 'from-[#6366F1] via-[#818CF8] to-[#4F46E5]', // Purple / Indigo
      shadowColor: 'shadow-[0_20px_50px_rgba(99,102,241,0.35)]',
      pedestalBg: 'bg-white/20 backdrop-blur-md border-white/30',
      icon: Palette,
      stageIcon: Lightbulb,
    },
    {
      id: 'ai-data',
      name: isHindi ? 'एआई और डेटा साइंस' : 'AI & Data Science',
      slug: 'ai-data-science',
      sentence: isHindi ? 'पायथन, मशीन लर्निंग और AI एजेंट बनाएं।' : 'Python, Machine Learning, OpenAI APIs & AI Agents.',
      courseCount: 10,
      gradient: 'from-[#14B8A6] via-[#2DD4BF] to-[#0D9488]', // Bright Teal / Cyan
      shadowColor: 'shadow-[0_20px_50px_rgba(20,184,166,0.35)]',
      pedestalBg: 'bg-white/20 backdrop-blur-md border-white/30',
      icon: Cpu,
      stageIcon: Zap,
    },
    {
      id: 'marketing',
      name: isHindi ? 'डिजिटल मार्केटिंग' : 'Digital Marketing',
      slug: 'digital-marketing',
      sentence: isHindi ? 'SEO, सोशल मीडिया विज्ञापन और ब्रांड ग्रोथ सीखें।' : 'Performance Marketing, Google Ads, Meta & Brand Growth.',
      courseCount: 5,
      gradient: 'from-[#3B82F6] via-[#60A5FA] to-[#2563EB]', // Royal Blue
      shadowColor: 'shadow-[0_20px_50px_rgba(59,130,246,0.35)]',
      pedestalBg: 'bg-white/20 backdrop-blur-md border-white/30',
      icon: TrendingUp,
      stageIcon: Megaphone,
    },
    {
      id: 'cloud-sec',
      name: isHindi ? 'क्लाउड और सिक्योरिटी' : 'Cloud & Security',
      slug: 'cloud-computing',
      sentence: isHindi ? 'AWS, डॉकर, कुबेरनेट्स और साइबर सुरक्षा सीखें।' : 'AWS, Docker, Kubernetes & Cybersecurity Defense.',
      courseCount: 7,
      gradient: 'from-[#F59E0B] via-[#FBBF24] to-[#D97706]', // Gold / Yellow
      shadowColor: 'shadow-[0_20px_50px_rgba(245,158,11,0.35)]',
      pedestalBg: 'bg-white/20 backdrop-blur-md border-white/30',
      icon: ShieldCheck,
      stageIcon: Compass,
    },
  ];

  // Infinite items array for seamless drag & scroll loop
  const displayItems = [...majorCategories, ...majorCategories, ...majorCategories];

  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll track loop when not dragging or hovering
  useEffect(() => {
    let animId;
    const autoSlide = () => {
      if (sliderRef.current && !isHovered) {
        sliderRef.current.scrollLeft += 0.8;
        if (sliderRef.current.scrollLeft >= sliderRef.current.scrollWidth / 3) {
          sliderRef.current.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(autoSlide);
    };

    animId = requestAnimationFrame(autoSlide);
    return () => cancelAnimationFrame(animId);
  }, [isHovered]);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  const handleWheel = (e) => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += e.deltaY * 0.9;
    }
  };

  return (
    <section className="relative py-24 overflow-hidden bg-[var(--canvas)]">
      {/* Background Soft Glow Blobs */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden opacity-30">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[var(--aura-violet)] filter blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[var(--aura-peach)] filter blur-3xl" />
      </div>

      {/* Header */}
      <div className="page-container flex flex-col md:flex-row md:items-end justify-between mb-12 relative z-10 gap-6">
        <div className="text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-manrope text-[var(--ink)] tracking-tight mb-3">
            {isHindi ? 'अपना रास्ता चुनें (Find Your Path)' : 'Find Your Path'}
          </h2>

          <p className="text-base sm:text-lg text-[var(--ink-muted)] max-w-xl font-normal">
            {isHindi 
              ? 'शुरुआती से लेकर प्रोफेशनल बनने तक के लिए तैयार किए गए हमारे विशेष कोर्स श्रेणियों को देखें।'
              : 'Explore our curated selection of disciplines designed to take you from beginner to professional.'}
          </p>
        </div>

        {/* Working Arrow Navigation Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={slideLeft}
            type="button"
            className="w-12 h-12 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] text-[var(--ink)] flex items-center justify-center transition-all shadow-md active:scale-90 cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={slideRight}
            type="button"
            className="w-12 h-12 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] text-[var(--ink)] flex items-center justify-center transition-all shadow-md active:scale-90 cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Interactive Drag & Click Infinite Slider Container */}
      <div className="relative w-full">
        {/* Left & Right Fading Overlays */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-12 md:w-20 bg-gradient-to-r from-[var(--canvas)] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-12 md:w-20 bg-gradient-to-l from-[var(--canvas)] to-transparent" />

        {/* Drag / Scroll Track */}
        <div
          ref={sliderRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onWheel={handleWheel}
          className="flex overflow-x-auto scrollbar-hide py-4 px-6 md:px-12 gap-6 sm:gap-8 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollBehavior: 'smooth' }}
        >
          {displayItems.map((cat, idx) => (
            <ReferenceStyleCard key={`${cat.id}-${idx}`} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

// 3D Pedestal Stage Reference Card Component (Exact Reference Image Style)
function ReferenceStyleCard({ category }) {
  const MainIcon = category.icon;
  const StageIcon = category.stageIcon;

  return (
    <div className="w-[340px] sm:w-[380px] md:w-[400px] shrink-0">
      <Link to={`/courses?category=${category.slug}`}>
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`relative h-[260px] sm:h-[280px] rounded-[28px] bg-gradient-to-br ${category.gradient} p-7 flex flex-col justify-between overflow-hidden text-white ${category.shadowColor} border border-white/20`}
        >
          {/* Top Row: Category Name + Subtitle (Layer 1 Text) */}
          <div className="relative z-10 max-w-[65%] text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-manrope leading-tight mb-2 tracking-tight text-white drop-shadow-sm">
              {category.name}
            </h3>

            <p className="text-xs sm:text-sm font-medium text-white/90 line-clamp-2 leading-relaxed">
              {category.sentence}
            </p>
          </div>

          {/* Bottom Row: Course Count Badge */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {category.courseCount} Courses
            </span>
          </div>

          {/* 3D Pedestal Stage & Icon Art (Matching Uploaded Reference Screenshot Style) */}
          <div className="absolute right-3 bottom-3 sm:right-5 sm:bottom-4 w-44 sm:w-48 h-44 sm:h-48 pointer-events-none flex flex-col items-center justify-end">
            {/* Top 3D Floating Icon Element */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white text-slate-900 shadow-[0_16px_36px_rgba(0,0,0,0.25)] flex items-center justify-center relative z-20 border-2 border-white/80"
            >
              <StageIcon className="w-8 h-8 sm:w-9 sm:h-9 text-slate-800" />
            </motion.div>

            {/* Middle 3D Step Pedestal Stage 1 */}
            <div className="w-32 sm:w-36 h-10 sm:h-12 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 -mt-5 relative z-10 flex items-center justify-center">
              <MainIcon className="w-5 h-5 text-white/80" />
            </div>

            {/* Base 3D Step Pedestal Stage 2 */}
            <div className="w-40 sm:w-44 h-12 sm:h-14 bg-white/20 backdrop-blur-sm rounded-3xl shadow-md border border-white/30 -mt-5 relative z-0" />
          </div>
        </motion.div>
      </Link>
    </div>
  );
}

export default CategoryCraftDeck;
