import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentApi } from '../../api/models/content.api';
import { courseApi } from '../../api/models/course.api';
import { categoryApi } from '../../api/models/category.api';
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
  Users,
  Award,
  MessageSquare,
  FileCheck,
  Briefcase,
  TrendingUp,
  Clock,
  BookOpen,
  Layers,
} from 'lucide-react';
import { motion } from 'framer-motion';

const ICON_MAP = {
  Code,
  Palette,
  Database,
  Smartphone,
  BarChart3,
  Cpu,
  Layers,
};

const VALUE_PROPS = [
  {
    icon: MessageSquare,
    title: '1-on-1 Doubt Clearing',
    desc: 'Instant live resolution with expert teaching assistants to keep your momentum going.',
    color: '#6366F1',
  },
  {
    icon: FileCheck,
    title: 'Resume & Portfolio Building',
    desc: 'Craft ATS-ready industry resumes and publish real production-grade GitHub projects.',
    color: '#06B6D4',
  },
  {
    icon: Briefcase,
    title: 'Dedicated Job Portal',
    desc: 'Direct hiring referrals with 500+ hiring partners across top tech product companies.',
    color: '#10B981',
  },
  {
    icon: Code,
    title: 'Hands-on Real Projects',
    desc: 'Build full-stack applications with industry architectures rather than passive viewing.',
    color: '#0EA5E9',
  },
];

export const HomePage = () => {
  const [contentBlocks, setContentBlocks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [suggestedCourses, setSuggestedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [contentRes, catRes, courseRes, suggestedRes] = await Promise.all([
          contentApi.getPublicContent('home'),
          categoryApi.getCategories(),
          courseApi.getCourses({ limit: 6 }),
          courseApi.getSuggestedCourses(6),
        ]);

        if (contentRes.success && contentRes.data) {
          setContentBlocks(contentRes.data);
        }
        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }
        if (courseRes.success && courseRes.data) {
          setFeaturedCourses(courseRes.data.courses || courseRes.data);
        }
        if (suggestedRes.success && suggestedRes.data) {
          setSuggestedCourses(suggestedRes.data);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroBlock = contentBlocks.find((b) => b.section === 'hero') || {
    title: 'Learn Skills, Build Projects, Get Hired.',
    subtitle: 'India\'s leading visual-first learning platform for web development, data science, and AI.',
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000',
      ctaText: 'Explore Programs',
      ctaLink: '/courses',
      badge: 'Visual-First EdTech Platform',
    },
  };

  const testimonials = contentBlocks.filter((b) => b.section === 'testimonial');

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      {/* Main Container */}
      <main className="space-y-20 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        
        {/* HERO SECTION (SPLIT LAYOUT WITH TRUST STATS) */}
        <section className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6366F1]/10 text-[#6366F1] dark:text-[#818cf8] text-xs font-extrabold border border-[#6366F1]/20">
              <Sparkles className="w-4 h-4 text-[#06B6D4]" />
              <span>{heroBlock.data?.badge || 'PW Skills Inspired EdTech'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] dark:text-white leading-tight tracking-tight">
              {heroBlock.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-xl leading-relaxed">
              {heroBlock.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={heroBlock.data?.ctaLink || '/courses'}
                className="btn-visual btn-primary text-sm font-black px-7 py-3.5 shadow-lg"
              >
                <PlayCircle className="w-5 h-5" />
                <span>{heroBlock.data?.ctaText || 'Explore Programs'}</span>
              </Link>
              <Link
                to="/signup"
                className="btn-visual btn-secondary text-sm font-black px-7 py-3.5 shadow-lg"
              >
                <span>Join For Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust Stats Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white">100k+</div>
                <div className="text-[11px] font-bold text-slate-400">Active Learners</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#06B6D4]">500+</div>
                <div className="text-[11px] font-bold text-slate-400">Hiring Partners</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xl sm:text-2xl font-black text-[#10B981]">
                  <span>4.8</span>
                  <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                </div>
                <div className="text-[11px] font-bold text-slate-400">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Right Hero Interactive Cards Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
              <img
                src={heroBlock.data?.imageUrl}
                alt="Visual Learning"
                className="w-full h-80 sm:h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                <div className="text-white space-y-2">
                  <span className="px-3 py-1 bg-[#06B6D4] rounded-full text-[10px] font-black uppercase tracking-wider">
                    Interactive Live Classroom
                  </span>
                  <div className="text-lg font-extrabold leading-snug">
                    Learn by doing with real-time doubt clearing & industrial mentorship.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CATEGORY GRID */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#6366F1]">Learning Paths</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">Explore By Category</h2>
            </div>
            <Link to="/courses" className="text-xs font-extrabold text-[#06B6D4] hover:underline flex items-center gap-1">
              View All Paths <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || Code;
              return (
                <motion.div key={cat._id} whileHover={{ y: -3 }}>
                  <Link
                    to={`/courses?category=${cat._id}`}
                    className="card-visual p-6 cursor-pointer flex items-center justify-between group block"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
                        style={{ backgroundColor: cat.color || '#6366F1' }}
                      >
                        <IconComp className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-[#0F172A] dark:text-white group-hover:text-[#6366F1] transition-colors">
                          {cat.name}
                        </h3>
                        <span className="text-xs font-bold text-slate-400">
                          {cat.description || 'Explore courses & path'}
                        </span>
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-[#6366F1] group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FEATURED COURSES GRID */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#06B6D4]">Featured Programs</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">Top Industry Courses</h2>
            </div>
            <Link to="/courses" className="text-xs font-extrabold text-[#6366F1] hover:underline flex items-center gap-1">
              Explore All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.slice(0, 6).map((c) => (
              <div key={c._id} className="card-visual overflow-hidden flex flex-col justify-between group">
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md ${c.type === 'live' ? 'bg-[#06B6D4]' : 'bg-[#6366F1]'}`}>
                        {c.type === 'live' ? '🔴 Live Session' : '📹 Self-Paced'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                      <span className="flex items-center gap-1 text-[#F59E0B]">
                        <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                        <span>{c.rating || 4.9} ({c.ratingCount || '1.2k'} reviews)</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> 8 Weeks
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-[#0F172A] dark:text-white line-clamp-2 leading-snug group-hover:text-[#6366F1] transition-colors">
                      {c.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-medium">
                      {c.subtitle || c.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through mr-1.5">₹{c.price ? c.price + 2000 : '4999'}</span>
                    <span className="text-lg font-black text-[#0F172A] dark:text-white">₹{c.discountPrice || c.price || '2999'}</span>
                  </div>
                  <Link
                    to={`/courses/${c._id}`}
                    className="btn-visual btn-primary text-xs px-4 py-2"
                  >
                    Enroll Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SUGGESTED / RECOMMENDED COURSES (RAG-ready placeholder — currently shows latest or isSuggested) */}
        {suggestedCourses.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#6366F1]">Recommended For You</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">Suggested Courses</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Hand-picked by our team · AI-powered recommendations coming soon</p>
              </div>
              <Link to="/courses" className="text-xs font-extrabold text-[#6366F1] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedCourses.map((c) => (
                <Link key={c._id} to={`/courses/${c._id}`} className="card-visual overflow-hidden flex flex-col justify-between group">
                  <div>
                    <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-[#6366F1]/90 text-[10px] font-black uppercase tracking-wider text-white shadow-md backdrop-blur-sm flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Suggested
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                        <span>{c.rating || 4.8}</span>
                        <span>·</span>
                        <span>{c.category?.name || 'Program'}</span>
                      </div>
                      <h3 className="font-extrabold text-sm text-[#0F172A] dark:text-white line-clamp-2 leading-snug group-hover:text-[#6366F1] transition-colors">
                        {c.title}
                      </h3>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-base font-black text-[#6366F1]">₹{c.discountPrice || c.price || '2999'}</span>
                    <span className="text-xs font-extrabold text-[#06B6D4]">View Details →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* VALUE PROPOSITION GRID */}
        <section className="bg-white dark:bg-[#1E293B] rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#10B981]">Why Choose Us</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">The ClassConnect Edge</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Designed from the ground up for real skill acquisition and career transformation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUE_PROPS.map((vp, idx) => {
              const IconComp = vp.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md" style={{ backgroundColor: vp.color }}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-[#0F172A] dark:text-white">{vp.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{vp.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* TESTIMONIALS & WALL OF FAME */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#06B6D4]">Wall of Fame</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">Learner Salary Hikes & Stories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, idx) => (
              <div key={t._id || idx} className="card-visual p-6 space-y-4 relative">
                <Quote className="w-8 h-8 text-[#6366F1]/10 absolute right-6 top-6 pointer-events-none" />

                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-[#F59E0B]">
                  {[...Array(t.data?.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  "{t.data?.comment}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.data?.authorPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                      alt={t.data?.author}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#6366F1]"
                    />
                    <div>
                      <div className="text-xs font-extrabold text-[#0F172A] dark:text-white">{t.data?.author}</div>
                      <div className="text-[10px] font-bold text-slate-400">{t.data?.authorRole}</div>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-[10px] font-extrabold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> 120% Salary Hike
                  </span>
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
