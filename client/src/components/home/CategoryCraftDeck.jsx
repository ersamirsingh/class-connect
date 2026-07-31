import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import FastMarquee from 'react-fast-marquee';
const Marquee = typeof FastMarquee === 'function' ? FastMarquee : (FastMarquee?.default || FastMarquee);
import { 
  Code2, 
  Smartphone, 
  Palette, 
  Cpu, 
  TrendingUp, 
  ArrowRight,
  Database,
  ShieldCheck,
  Cloud,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { GlowingEffect } from '../motion/GlowingEffect';
import { TextEffect } from '../motion/TextEffect';
import { useLanguage } from '../../context/LanguageContext';

const categoryIcons = {
  'web-development': Code2,
  'app-development': Smartphone,
  'ui-ux-design': Palette,
  'ai-data-science': Cpu,
  'digital-marketing': TrendingUp,
  'cloud-computing': Cloud,
  'cyber-security': ShieldCheck,
  'data-engineering': Database,
};

const categoryTechStack = {
  'web-development': ['React', 'Node.js', 'Next.js', 'MongoDB'],
  'app-development': ['Flutter', 'React Native', 'Swift', 'Kotlin'],
  'ui-ux-design': ['Figma', 'Framer', 'Prototyping', '3D Design'],
  'ai-data-science': ['Python', 'OpenAI', 'PyTorch', 'LLMs'],
  'digital-marketing': ['SEO', 'Google Ads', 'Meta', 'Analytics'],
  'cloud-computing': ['AWS', 'Docker', 'Kubernetes', 'DevOps'],
};

const defaultGradientBadges = [
  'from-indigo-500/15 via-purple-500/10 to-transparent',
  'from-blue-500/15 via-cyan-500/10 to-transparent',
  'from-orange-500/15 via-amber-500/10 to-transparent',
  'from-emerald-500/15 via-teal-500/10 to-transparent',
  'from-rose-500/15 via-pink-500/10 to-transparent',
];

export function CategoryCraftDeck({ categories = [] }) {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const scrollRef = useRef(null);

  // Ensure we have a rich set of items for scrolling
  const fullCategories = categories.length > 0 ? categories : [
    { _id: 'c1', name: 'Web Development', slug: 'web-development', courseCount: 12, description: 'HTML, CSS, React, Node.js & Next.js' },
    { _id: 'c2', name: 'App Development', slug: 'app-development', courseCount: 8, description: 'React Native & Flutter Apps' },
    { _id: 'c3', name: 'UI/UX Design', slug: 'ui-ux-design', courseCount: 6, description: 'Figma, Visual & Motion Systems' },
    { _id: 'c4', name: 'AI & Data Science', slug: 'ai-data-science', courseCount: 10, description: 'Python, Machine Learning & LLMs' },
    { _id: 'c5', name: 'Digital Marketing', slug: 'digital-marketing', courseCount: 5, description: 'SEO, Ads & Brand Growth' },
    { _id: 'c6', name: 'Cloud Computing', slug: 'cloud-computing', courseCount: 7, description: 'AWS, Docker & Kubernetes' },
  ];

  // Split into 2 rows for dual-direction auto scroll
  const halfLength = Math.ceil(fullCategories.length / 2);
  const row1 = fullCategories.slice(0, halfLength);
  const row2 = fullCategories.slice(halfLength).concat(fullCategories.slice(0, 2));

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-20 overflow-hidden bg-[var(--canvas)]">
      {/* Background Subtle Gradient Blobs */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden opacity-30">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[var(--aura-violet)] filter blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[var(--aura-peach)] filter blur-3xl" />
      </div>

      {/* Header */}
      <div className="page-container flex flex-col md:flex-row md:items-end justify-between mb-12 relative z-10 gap-6">
        <div className="text-left">
          <TextEffect preset="fade-in-blur" className="section-heading mb-3">
            {isHindi ? 'अपना रास्ता चुनें (Find Your Path)' : 'Find Your Path'}
          </TextEffect>

          <p className="section-subheading max-w-xl">
            {isHindi 
              ? 'शुरुआती से लेकर प्रोफेशनल बनने तक के लिए तैयार किए गए हमारे विशेष कोर्स श्रेणियों को देखें।'
              : 'Explore our curated selection of disciplines designed to take you from beginner to professional.'}
          </p>
        </div>

        {/* Interactive Left & Right Scroll Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={scrollLeft}
            className="w-11 h-11 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--canvas)] hover:border-[var(--primary)] text-[var(--ink)] flex items-center justify-center transition-all shadow-sm active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="w-11 h-11 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--canvas)] hover:border-[var(--primary)] text-[var(--ink)] flex items-center justify-center transition-all shadow-sm active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Interactive Deck Container with connected scrollRef & 2 Marquee Rows */}
      <div 
        ref={scrollRef} 
        className="relative w-full space-y-6 overflow-x-auto scrollbar-hide select-none"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Left & Right Fading Edge Overlay */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-16 md:w-24 bg-gradient-to-r from-[var(--canvas)] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-16 md:w-24 bg-gradient-to-l from-[var(--canvas)] to-transparent" />

        {/* Row 1: Left Continuous Auto-Scroll & Scrollable */}
        <Marquee speed={35} direction="left" pauseOnHover gradient={false} className="py-2">
          {row1.map((cat, idx) => (
            <CategoryCraftCard key={`${cat._id}-r1-${idx}`} category={cat} index={idx} />
          ))}
        </Marquee>

        {/* Row 2: Right Continuous Auto-Scroll & Scrollable */}
        <Marquee speed={35} direction="right" pauseOnHover gradient={false} className="py-2">
          {row2.map((cat, idx) => (
            <CategoryCraftCard key={`${cat._id}-r2-${idx}`} category={cat} index={idx + 3} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function CategoryCraftCard({ category, index }) {
  const IconComponent = categoryIcons[category.slug] || Code2;
  const techList = categoryTechStack[category.slug] || ['React', 'Python', 'Figma', 'Node.js'];
  const gradientClass = defaultGradientBadges[index % defaultGradientBadges.length];

  return (
    <div className="w-[320px] sm:w-[360px] shrink-0 mx-3">
      <Link to={`/courses?category=${category.slug}`}>
        <GlowingEffect
          glowColor="rgba(67, 56, 242, 0.4)"
          accentGlow="rgba(255, 107, 53, 0.4)"
          containerClassName="h-full"
        >
          <div className="relative h-full p-6 sm:p-7 flex flex-col justify-between overflow-hidden">
            {/* Background Subtle Pattern */}
            <div 
              className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, var(--ink) 1px, transparent 0)`,
                backgroundSize: '16px 16px',
              }}
            />

            {/* Gradient Corner Accent */}
            <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${gradientClass} rounded-bl-full pointer-events-none`} />

            {/* Top Row: Icon + Course Tag */}
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] shadow-sm group-hover:scale-110 transition-transform duration-300">
                <IconComponent className="w-6 h-6" />
              </div>

              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--ink-muted)]">
                {category.courseCount || 10} courses
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10 mb-4">
              <h3 className="text-xl font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--primary)] transition-colors flex items-center gap-2 font-manrope">
                {category.name}
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--primary)]" />
              </h3>

              <p className="text-sm text-[var(--ink-muted)] line-clamp-2 leading-relaxed font-normal">
                {category.description || 'Master key concepts with hands-on real-world projects.'}
              </p>
            </div>

            {/* Micro Tech Stack Badge Pills inside Card */}
            <div className="relative z-10 pt-3 border-t border-[var(--border)] flex flex-wrap gap-1.5">
              {techList.map((tech, i) => (
                <span 
                  key={i} 
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--canvas)] text-[var(--ink-muted)] border border-[var(--border)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </GlowingEffect>
      </Link>
    </div>
  );
}

export default CategoryCraftDeck;
