import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Smartphone, 
  Palette, 
  Cpu, 
  TrendingUp, 
  Layers, 
  ArrowRight,
  Database,
  ShieldCheck,
  Cloud
} from 'lucide-react';
import { GlowingEffect } from '../motion/GlowingEffect';
import { Marquee } from '../motion/Marquee';
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

const defaultGradientBadges = [
  'from-indigo-500/15 via-purple-500/10 to-transparent',
  'from-blue-500/15 via-cyan-500/10 to-transparent',
  'from-orange-500/15 via-amber-500/10 to-transparent',
  'from-emerald-500/15 via-teal-500/10 to-transparent',
  'from-rose-500/15 via-pink-500/10 to-transparent',
];

export function CategoryCraftDeck({ categories = [] }) {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  // Ensure we have a rich set of items for scrolling
  const fullCategories = categories.length > 0 ? categories : [
    { _id: 'c1', name: 'Web Development', slug: 'web-development', courseCount: 12, description: 'HTML, CSS, React, Node.js & Next.js' },
    { _id: 'c2', name: 'App Development', slug: 'app-development', courseCount: 8, description: 'React Native & Flutter Apps' },
    { _id: 'c3', name: 'UI/UX Design', slug: 'ui-ux-design', courseCount: 6, description: 'Figma, Visual & Motion Systems' },
    { _id: 'c4', name: 'AI & Data Science', slug: 'ai-data-science', courseCount: 10, description: 'Python, Machine Learning & LLMs' },
    { _id: 'c5', name: 'Digital Marketing', slug: 'digital-marketing', courseCount: 5, description: 'SEO, Ads & Brand Growth' },
    { _id: 'c6', name: 'Cloud Computing', slug: 'cloud-computing', courseCount: 7, description: 'AWS, Docker & Kubernetes' },
  ];

  // Split into two rows for dual-direction auto scroll
  const halfLength = Math.ceil(fullCategories.length / 2);
  const row1 = fullCategories.slice(0, halfLength);
  const row2 = fullCategories.slice(halfLength).concat(fullCategories.slice(0, 2));

  return (
    <section className="relative py-20 overflow-hidden bg-[var(--canvas)]">
      {/* Background Subtle Gradient Blobs */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden opacity-30">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[var(--aura-violet)] filter blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[var(--aura-peach)] filter blur-3xl" />
      </div>

      {/* Header */}
      <div className="page-container text-center mb-14 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-4">
          <Layers className="w-3.5 h-3.5" />
          {isHindi ? 'विषय चुनें' : 'Curated Disciplines'}
        </div>

        <TextEffect preset="fade-in-blur" className="section-heading mb-4">
          {isHindi ? 'अपना रास्ता चुनें (Find Your Path)' : 'Find Your Path'}
        </TextEffect>

        <p className="section-subheading mx-auto max-w-xl text-center">
          {isHindi 
            ? 'शुरुआती से लेकर प्रोफेशनल बनने तक के लिए तैयार किए गए हमारे विशेष कोर्स श्रेणियों को देखें।'
            : 'Explore our curated selection of disciplines designed to take you from beginner to professional.'}
        </p>
      </div>

      {/* Interface Craft Infinite Scroll Container */}
      <div className="relative w-full space-y-6">
        {/* Left & Right Fading Gradient Edge Overlay for seamless marquee */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-24 bg-gradient-to-r from-[var(--canvas)] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-24 bg-gradient-to-l from-[var(--canvas)] to-transparent" />

        {/* Row 1: Left Auto-Scroll */}
        <Marquee speed={35} direction="left" pauseOnHover className="py-2">
          {row1.map((cat, idx) => (
            <CategoryCraftCard key={`${cat._id}-r1-${idx}`} category={cat} index={idx} />
          ))}
        </Marquee>

        {/* Row 2: Right Auto-Scroll */}
        <Marquee speed={35} direction="right" pauseOnHover className="py-2">
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
  const gradientClass = defaultGradientBadges[index % defaultGradientBadges.length];

  return (
    <div className="w-[340px] sm:w-[380px] shrink-0 mx-3">
      <Link to={`/courses?category=${category.slug}`}>
        <GlowingEffect
          glowColor="rgba(67, 56, 242, 0.4)"
          accentGlow="rgba(255, 107, 53, 0.4)"
          containerClassName="h-full"
        >
          <div className="relative h-full p-6 sm:p-7 flex flex-col justify-between overflow-hidden">
            {/* Background Craft Grid Subtle Pattern */}
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
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-soft)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] shadow-sm group-hover:scale-110 transition-transform duration-300">
                <IconComponent className="w-6 h-6" />
              </div>

              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--ink-muted)]">
                {category.courseCount || 10} courses
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--primary)] transition-colors flex items-center gap-2"
                style={{ fontFamily: 'Manrope, sans-serif' }}>
                {category.name}
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[var(--primary)]" />
              </h3>

              <p className="text-sm text-[var(--ink-muted)] line-clamp-2 leading-relaxed font-normal">
                {category.description || 'Master key concepts with hands-on real-world projects.'}
              </p>
            </div>
          </div>
        </GlowingEffect>
      </Link>
    </div>
  );
}

export default CategoryCraftDeck;
