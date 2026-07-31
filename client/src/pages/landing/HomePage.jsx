import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentApi } from '../../api/models/content.api';
import { Navbar } from '../../components/guest/Navbar';
import { Footer } from '../../components/guest/Footer';
import {
  Sparkles,
  PlayCircle,
  ArrowRight,
  Code,
  Palette,
  Database,
  Smartphone,
  BarChart3,
  Cpu,
  Star,
  Quote,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'web', name: 'Web Development', icon: Code, color: '#3730E0', count: '12 Courses' },
  { id: 'design', name: 'UI/UX Design', icon: Palette, color: '#FF7A33', count: '8 Courses' },
  { id: 'data', name: 'Data Science', icon: Database, color: '#1FAE64', count: '10 Courses' },
  { id: 'mobile', name: 'Mobile Apps', icon: Smartphone, color: '#9333EA', count: '6 Courses' },
  { id: 'analytics', name: 'Business & AI', icon: BarChart3, color: '#0EA5E9', count: '9 Courses' },
  { id: 'cloud', name: 'DevOps & Cloud', icon: Cpu, color: '#DB2777', count: '7 Courses' },
];

export const HomePage = () => {
  const [contentBlocks, setContentBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await contentApi.getPublicContent('home');
        if (res.success && res.data) {
          setContentBlocks(res.data);
        }
      } catch (err) {
        console.error('Failed to load homepage content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const heroBlock = contentBlocks.find((b) => b.section === 'hero') || {
    title: 'Master New Skills With Visual Learning',
    subtitle: 'Interactive video lessons, live classes, and expert guidance designed for visual thinkers.',
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000',
      ctaText: 'Explore Courses',
      ctaLink: '/courses',
      badge: 'Visual-First EdTech Platform',
    },
  };

  const bannerBlock = contentBlocks.find((b) => b.section === 'banner') || {
    title: 'Live Interactive Classes Daily',
    subtitle: 'Join live sessions with top instructors and solve real problems together.',
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
      ctaText: 'View Live Schedule',
      ctaLink: '/courses',
      tag: 'Live Now',
    },
  };

  const testimonials = contentBlocks.filter((b) => b.section === 'testimonial');

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
      <Navbar />

      {/* Main Container */}
      <main className="space-y-16 py-8 px-4 max-w-7xl mx-auto w-full">
        {/* HERO SECTION */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3730E0]/10 text-[#3730E0] text-xs font-extrabold">
              <Sparkles className="w-4 h-4 text-[#FF7A33]" />
              <span>{heroBlock.data?.badge || 'Visual-First EdTech'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#1E1E2E] leading-tight">
              {heroBlock.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl">
              {heroBlock.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={heroBlock.data?.ctaLink || '/courses'}
                className="btn-visual btn-primary text-sm font-black px-6 py-3.5 shadow-lg"
              >
                <PlayCircle className="w-5 h-5" />
                <span>{heroBlock.data?.ctaText || 'Explore Courses'}</span>
              </Link>
              <Link
                to="/signup"
                className="btn-visual btn-secondary text-sm font-black px-6 py-3.5 shadow-lg"
              >
                <span>Join For Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="flex items-center gap-6 pt-4 text-xs font-bold text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#FF7A33]" /> Fast Visual Lessons
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1FAE64]" /> Lifetime Access
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={heroBlock.data?.imageUrl}
                alt="Visual Learning"
                className="w-full h-72 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#FF7A33]">Interactive Modules</div>
                  <div className="text-lg font-bold">Learn by Doing with Real Visual Feedback</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CATEGORY TILES (COLOR-CODED VISUAL GRID) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#3730E0]">Categories</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E2E]">Explore By Topic</h2>
            </div>
            <Link to="/courses" className="text-xs font-extrabold text-[#FF7A33] hover:underline flex items-center gap-1">
              View All Topics <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <motion.div
                  key={cat.id}
                  whileHover={{ y: -4 }}
                  className="card-visual p-6 cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
                      style={{ backgroundColor: cat.color }}
                    >
                      <IconComp className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-[#1E1E2E] group-hover:text-[#3730E0] transition-colors">
                        {cat.name}
                      </h3>
                      <span className="text-xs font-bold text-slate-400">{cat.count}</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#3730E0] group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* LIVE CLASS BANNER */}
        <section className="bg-gradient-to-r from-[#FF7A33] to-[#E8631C] rounded-3xl p-6 sm:p-10 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold">
              <Sparkles className="w-4 h-4 text-white" /> {bannerBlock.data?.tag || 'Live Session'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-black">{bannerBlock.title}</h2>
            <p className="text-xs sm:text-sm text-white/90 font-medium max-w-xl">
              {bannerBlock.subtitle}
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Link
              to={bannerBlock.data?.ctaLink || '/courses'}
              className="btn-visual bg-white text-[#FF7A33] hover:bg-slate-50 text-xs font-extrabold px-6 py-3.5 shadow-xl"
            >
              <PlayCircle className="w-5 h-5" /> {bannerBlock.data?.ctaText || 'Join Live Class'}
            </Link>
          </div>
        </section>

        {/* TESTIMONIALS CAROUSEL SECTION */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#1FAE64]">Testimonials</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E2E]">What Our Students Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, idx) => (
              <div key={t._id || idx} className="card-visual p-6 space-y-4 relative">
                <Quote className="w-8 h-8 text-[#3730E0]/10 absolute right-6 top-6 pointer-events-none" />

                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-[#F5A623]">
                  {[...Array(t.data?.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F5A623]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed italic">
                  "{t.data?.comment}"
                </p>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <img
                    src={t.data?.authorPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                    alt={t.data?.author}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#3730E0]"
                  />
                  <div>
                    <div className="text-xs font-extrabold text-[#1E1E2E]">{t.data?.author}</div>
                    <div className="text-[10px] font-bold text-slate-400">{t.data?.authorRole}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
