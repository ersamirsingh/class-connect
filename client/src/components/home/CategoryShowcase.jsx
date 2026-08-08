import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Web Development',
    slug: 'web-development',
    courses: 5,
    image: '/assets/categories/web-development.jpg',
    color: '#EF4444',
    tagline: 'HTML, CSS, React, Node.js & Next.js',
  },
  {
    name: 'App Development',
    slug: 'app-development',
    courses: 5,
    image: '/assets/categories/app-development.jpg',
    color: '#10B981',
    tagline: 'Flutter, React Native & Swift',
  },
  {
    name: 'UI/UX Design',
    slug: 'ui-ux-design',
    courses: 5,
    image: '/assets/categories/ui-ux-design.jpg',
    color: '#8B5CF6',
    tagline: 'Figma, Design Systems & Prototyping',
  },
  {
    name: 'AI & Data Science',
    slug: 'ai-data-science',
    courses: 5,
    image: '/assets/categories/ai-data-science.jpg',
    color: '#3B82F6',
    tagline: 'Python, ML, OpenAI & Data Analytics',
  },
  {
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    courses: 5,
    image: '/assets/categories/digital-marketing.jpg',
    color: '#F97316',
    tagline: 'SEO, Google Ads, Meta Ads & Content',
  },
  {
    name: 'Cyber Security & Cloud',
    slug: 'cyber-security-cloud',
    courses: 5,
    image: '/assets/categories/cyber-security-cloud.jpg',
    color: '#14B8A6',
    tagline: 'AWS, Azure, Ethical Hacking & DevOps',
  },
];

// Individual fanning card component
function CategoryFanCard({ category, index, totalCards, hoveredIndex, setHoveredIndex }) {
  const isHovered = hoveredIndex === index;
  const centerOffset = index - (totalCards - 1) / 2;

  // Fan-out base rotation & offset — wide spread arch carousel
  const baseRotation = centerOffset * 8;
  const baseX = centerOffset * 160;
  const baseY = Math.abs(centerOffset) * 22;

  // On hover: the card lifts up, scales, and straightens
  const hoverY = isHovered ? -38 : 0;
  const hoverScale = isHovered ? 1.12 : 1;
  const hoverRotation = isHovered ? 0 : baseRotation;
  const hoverZ = isHovered ? 50 : totalCards - Math.abs(centerOffset);

  return (
    <motion.div
      className="absolute cursor-pointer select-none"
      style={{
        zIndex: hoverZ,
        transformOrigin: 'bottom center',
      }}
      animate={{
        x: baseX,
        y: baseY + hoverY,
        rotate: hoverRotation,
        scale: hoverScale,
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 22,
        mass: 0.8,
      }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <Link
        to={`/courses?category=${category.slug}`}
        className="block"
      >
        <div
          className="relative w-[240px] sm:w-[280px] lg:w-[320px] rounded-[22px] overflow-hidden shadow-xl group"
          style={{
            aspectRatio: '3 / 4',
            boxShadow: isHovered
              ? `0 24px 60px -12px ${category.color}40, 0 8px 24px -4px rgba(0,0,0,0.15)`
              : '0 8px 30px -8px rgba(0,0,0,0.12)',
          }}
        >
          {/* Card Background Image */}
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradient Overlay from bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Top Badge */}
          <div className="absolute top-3 left-3">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white backdrop-blur-md"
              style={{ backgroundColor: `${category.color}CC` }}
            >
              <Sparkles className="w-3 h-3" />
              {category.courses} Courses
            </span>
          </div>

          {/* Bottom Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
            <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight mb-1 font-manrope drop-shadow-md">
              {category.name}
            </h3>
            <p className="text-[11px] sm:text-xs text-white/80 font-medium leading-snug mb-3">
              {category.tagline}
            </p>

            {/* CTA Arrow */}
            <motion.div
              className="flex items-center gap-1.5 text-white/90 text-xs font-bold"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -8 }}
              transition={{ duration: 0.2 }}
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Horizontal Slider Version (Mobile + Tablet)
function CategorySlider() {
  const scrollRef = useRef(null);

  const scrollDirection = (dir) => {
    if (scrollRef.current) {
      const amount = dir === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={() => scrollDirection('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-700 hover:bg-white hover:text-indigo-600 transition-all cursor-pointer border border-slate-200/60 -ml-2"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scrollDirection('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-700 hover:bg-white hover:text-indigo-600 transition-all cursor-pointer border border-slate-200/60 -mr-2"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Scrollable Cards */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide px-6 pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.slug}
            to={`/courses?category=${cat.slug}`}
            className="flex-shrink-0 w-[240px] snap-center block group"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -12, scale: 1.03 }}
              className="relative rounded-[22px] overflow-hidden shadow-lg"
              style={{
                aspectRatio: '3 / 4',
              }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Top badge */}
              <div className="absolute top-3 left-3">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white backdrop-blur-md"
                  style={{ backgroundColor: `${cat.color}CC` }}
                >
                  <Sparkles className="w-3 h-3" />
                  {cat.courses} Courses
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-extrabold text-white leading-tight mb-1 font-manrope drop-shadow-md">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-white/80 font-medium leading-snug mb-2">
                  {cat.tagline}
                </p>
                <div className="flex items-center gap-1.5 text-white/90 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CategoryShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="relative py-20 sm:py-28 bg-[var(--surface)] overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-[11px] font-extrabold mb-4 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            🔥 High-Income Career Tracks
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-manrope text-[var(--ink)] tracking-tight leading-tight">
            Explore <span className="font-cursive font-normal text-indigo-600 text-4xl sm:text-5xl lg:text-6xl">Curated Skill</span> Collections
          </h2>
          <p className="text-sm sm:text-base text-[var(--ink-muted)] mt-3 max-w-md mx-auto font-medium leading-relaxed">
            Industry-crafted roadmaps to fast-track your journey from beginner to ₹12+ LPA tech professional.
          </p>
        </motion.div>
      </div>

      {/* Desktop Fan-out Cards (Hidden on mobile/tablet) */}
      <div className="hidden lg:flex justify-center items-end relative" style={{ minHeight: '560px' }}>
        <div className="relative flex items-end justify-center" style={{ width: '100%', maxWidth: '1100px' }}>
          {CATEGORIES.map((cat, i) => (
            <CategoryFanCard
              key={cat.slug}
              category={cat}
              index={i}
              totalCards={CATEGORIES.length}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
            />
          ))}
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Slider (Hidden on desktop) */}
      <div className="lg:hidden">
        <CategorySlider />
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-center mt-12 sm:mt-16"
      >
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] text-sm font-bold hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition-all shadow-sm"
        >
          Explore More
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
}
