import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowRight, Compass, Filter, Star, Radio, PlayCircle, DollarSign, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { categoryApi } from '../../api/models/category.api';
import { courseApi } from '../../api/models/course.api';
import { SAMPLE_CATEGORIES, SAMPLE_COURSES } from '../../data/sampleData';
import { SpotlightCard } from '../../components/motion/SpotlightCard';
import { TextEffect } from '../../components/motion/TextEffect';
import { InView } from '../../components/motion/InView';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';

export function CategoryListPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [categories, setCategories] = useState(SAMPLE_CATEGORIES);
  const [categoryCourses, setCategoryCourses] = useState(SAMPLE_COURSES);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Icon-based filter chips
  const [activeTypeFilter, setActiveTypeFilter] = useState('all'); // 'all' | 'live' | 'recorded'
  const [activeRatingFilter, setActiveRatingFilter] = useState(0); // 0 | 4.5
  const [activePriceFilter, setActivePriceFilter] = useState('all'); // 'all' | 'under1000'

  const isHindi = language === 'hi';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const catRes = await categoryApi.getCategories();
        const rawCats = Array.isArray(catRes.data)
          ? catRes.data
          : (catRes.data?.categories || (Array.isArray(catRes) ? catRes : SAMPLE_CATEGORIES));
        
        // Filter out legacy categories, ensuring only the 6 actual categories are displayed
        const validSlugs = ['web-development', 'app-development', 'ui-ux-design', 'ai-data-science', 'digital-marketing', 'cyber-security-cloud'];
        const loadedCats = rawCats.filter(c => {
          const s = c.slug || c.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return validSlugs.includes(s);
        });

        const finalCats = loadedCats.length > 0 ? loadedCats : SAMPLE_CATEGORIES;
        setCategories(finalCats);

        if (id) {
          const match = loadedCats.find(c => c._id === id || c.slug === id || c.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id.toLowerCase()) || {
            _id: id,
            slug: id,
            name: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            tagline: 'Master industry-relevant skills with top experts',
          };
          setSelectedCategory(match);

          try {
            const courseRes = await courseApi.getCourses({ category: match._id || match.slug });
            const loadedCourses = Array.isArray(courseRes.data)
              ? courseRes.data
              : (courseRes.data?.courses || (Array.isArray(courseRes) ? courseRes : []));
            
            if (loadedCourses.length > 0) {
              setCategoryCourses(loadedCourses);
            } else {
              // Fallback filter from SAMPLE_COURSES
              const matchedSample = SAMPLE_COURSES.filter(c => {
                const cCatSlug = typeof c.category === 'object' ? c.category?.slug : '';
                const cCatName = typeof c.category === 'object' ? c.category?.name : String(c.category || '');
                return cCatSlug.toLowerCase() === match.slug.toLowerCase() || cCatName.toLowerCase() === match.name.toLowerCase();
              });
              setCategoryCourses(matchedSample.length > 0 ? matchedSample : SAMPLE_COURSES);
            }
          } catch (err) {
            setCategoryCourses(SAMPLE_COURSES);
          }
        }
      } catch (error) {
        console.warn('Fallback to sample data for category:', error);
        if (id) {
          const match = SAMPLE_CATEGORIES.find(c => c._id === id || c.slug === id) || SAMPLE_CATEGORIES[0];
          setSelectedCategory(match);
          setCategoryCourses(SAMPLE_COURSES);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const gradients = [
    'from-blue-500/10 to-indigo-500/10 text-indigo-600',
    'from-emerald-500/10 to-teal-500/10 text-teal-600',
    'from-orange-500/10 to-red-500/10 text-orange-600',
    'from-purple-500/10 to-pink-500/10 text-purple-600',
    'from-cyan-500/10 to-blue-500/10 text-cyan-600',
    'from-yellow-500/10 to-orange-500/10 text-yellow-600',
  ];

  // Filter logic for single category view
  const filteredCourses = categoryCourses.filter(c => {
    if (activeTypeFilter === 'live' && c.type !== 'live') return false;
    if (activeTypeFilter === 'recorded' && c.type === 'live') return false;
    if (activeRatingFilter > 0 && (c.rating || 4.5) < activeRatingFilter) return false;
    if (activePriceFilter === 'under1000' && c.price >= 1000) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--canvas)] flex flex-col font-sans">
      <FloatingNav />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* SINGLE CATEGORY VIEW (`/category/:id`) */}
          {id && selectedCategory ? (
            <div className="space-y-12">
              {/* Category Banner */}
              <div className="relative overflow-hidden p-8 sm:p-12 rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-md)] flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-bold">
                    <Layers className="w-3.5 h-3.5" /> Category Overview
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold font-manrope text-[var(--ink)]">
                    {selectedCategory.name}
                  </h1>
                  <p className="text-base sm:text-lg text-[var(--ink-muted)]">
                    {selectedCategory.tagline || selectedCategory.description || "Master industry-ready skills with top expert-led courses."}
                  </p>
                </div>

                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--primary-soft)] to-[var(--aura-violet)] flex items-center justify-center text-[var(--primary)] shadow-sm shrink-0">
                  <Compass className="w-12 h-12" />
                </div>
              </div>

              {/* Icon-Based Filter Chips */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
                  <Filter className="w-4 h-4 text-[var(--primary)]" />
                  <span>Filter by:</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Type chips */}
                  <button
                    onClick={() => setActiveTypeFilter('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${activeTypeFilter === 'all' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--canvas)] text-[var(--ink-muted)] hover:bg-[var(--border)]'}`}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> All Types
                  </button>
                  <button
                    onClick={() => setActiveTypeFilter('live')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${activeTypeFilter === 'live' ? 'bg-red-500 text-white' : 'bg-[var(--canvas)] text-[var(--ink-muted)] hover:bg-[var(--border)]'}`}
                  >
                    <Radio className="w-3.5 h-3.5" /> Live Now
                  </button>
                  <button
                    onClick={() => setActiveTypeFilter('recorded')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${activeTypeFilter === 'recorded' ? 'bg-indigo-600 text-white' : 'bg-[var(--canvas)] text-[var(--ink-muted)] hover:bg-[var(--border)]'}`}
                  >
                    <PlayCircle className="w-3.5 h-3.5" /> Recorded
                  </button>

                  <div className="w-px h-6 bg-[var(--border)] mx-1" />

                  {/* Rating chips */}
                  <button
                    onClick={() => setActiveRatingFilter(activeRatingFilter === 4.5 ? 0 : 4.5)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${activeRatingFilter === 4.5 ? 'bg-[var(--accent)] text-white' : 'bg-[var(--canvas)] text-[var(--ink-muted)] hover:bg-[var(--border)]'}`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" /> 4.5+ Stars
                  </button>

                  {/* Price chips */}
                  <button
                    onClick={() => setActivePriceFilter(activePriceFilter === 'under1000' ? 'all' : 'under1000')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${activePriceFilter === 'under1000' ? 'bg-emerald-600 text-white' : 'bg-[var(--canvas)] text-[var(--ink-muted)] hover:bg-[var(--border)]'}`}
                  >
                    <DollarSign className="w-3.5 h-3.5" /> Under ₹1,000
                  </button>
                </div>
              </div>

              {/* Course Grid for Category */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-[var(--surface)] rounded-[var(--radius-lg)] h-80 border border-[var(--border)]" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCourses.map((course) => (
                    <Link key={course._id} to={`/courses/${course.slug || course._id}`} className="block h-full group">
                      <SpotlightCard className="h-full bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all overflow-hidden flex flex-col justify-between">
                        <div className="aspect-video w-full relative bg-[var(--canvas)] overflow-hidden">
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black bg-white/90 backdrop-blur-md text-[var(--ink)] shadow-sm flex items-center gap-1">
                            {course.type === 'live' ? (
                              <span className="text-red-500 flex items-center gap-1"><Radio className="w-3 h-3 animate-pulse" /> LIVE</span>
                            ) : (
                              <span className="text-indigo-600 flex items-center gap-1"><PlayCircle className="w-3 h-3" /> RECORDED</span>
                            )}
                          </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow justify-between">
                          <div>
                            <h3 className="text-xl font-bold font-manrope mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                              {course.title}
                            </h3>
                            <p className="text-sm text-[var(--ink-muted)] line-clamp-2 mb-4">
                              {course.subtitle || course.description}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-[var(--accent)] text-[var(--accent)]" />
                              <span className="text-sm font-bold">{course.rating || '4.8'}</span>
                              <span className="text-xs text-[var(--ink-muted)]">({course.totalReviews || 85})</span>
                            </div>
                            <div className="text-lg font-bold font-manrope text-[var(--primary-deep)]">
                              {course.price === 0 ? 'Free' : `₹${course.price?.toLocaleString('en-IN')}`}
                            </div>
                          </div>
                        </div>
                      </SpotlightCard>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* CATEGORY LIST VIEW (`/categories`) */
            <>
              {/* Hero Section */}
              <div className="text-center mb-20">
                <div className="inline-flex items-center justify-center p-3 bg-[var(--surface)] rounded-full shadow-[var(--shadow-sm)] mb-6 border border-[var(--border)]">
                  <Compass className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <InView>
                  <TextEffect 
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--ink)] mb-6 tracking-tight"
                  >
                    {isHindi ? "श्रेणियाँ ब्राउज़ करें" : "Browse Categories"}
                  </TextEffect>
                  <p className="text-lg md:text-xl text-[var(--ink-muted)] max-w-2xl mx-auto">
                    {isHindi 
                      ? "विभिन्न विषयों में ज्ञान खोजें और वह कोर्स चुनें जो आपके लिए सही हो।"
                      : "Discover knowledge across diverse fields and find the perfect path for your growth."}
                  </p>
                </InView>
              </div>

              {/* Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-[var(--surface)] rounded-[var(--radius-lg)] h-48 border border-[var(--border)]" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {categories.map((category, index) => {
                      const CATEGORY_META = {
                        'web-development': {
                          tag: 'FULLSTACK',
                          image: '/assets/categories/web-development.jpg',
                          count: '12 Courses',
                          desc: 'Master HTML, CSS, React 19, Node.js, Next.js & fullstack architecture.',
                        },
                        'app-development': {
                          tag: 'MOBILE',
                          image: '/assets/categories/app-development.jpg',
                          count: '8 Courses',
                          desc: 'Build Android & iOS apps with React Native, Flutter, Swift & Mobile APIs.',
                        },
                        'ui-ux-design': {
                          tag: 'CREATIVE',
                          image: '/assets/categories/ui-ux-design.jpg',
                          count: '6 Courses',
                          desc: 'Figma UI/UX, Motion Graphics, Premiere Pro & visual design systems.',
                        },
                        'ai-data-science': {
                          tag: 'FUTURE TECH',
                          image: '/assets/about_hero_lead.jpg',
                          count: '10 Courses',
                          desc: 'Python, Machine Learning, OpenAI APIs, LLM Agents & Data Analytics.',
                        },
                        'digital-marketing': {
                          tag: 'GROWTH',
                          image: '/assets/categories/digital-marketing.jpg',
                          count: '5 Courses',
                          desc: 'SEO, performance marketing ads, social media growth & brand funnel strategy.',
                        },
                        'cyber-security-cloud': {
                          tag: 'SECURITY',
                          image: '/assets/categories/cyber-security-cloud.jpg',
                          count: '5 Courses',
                          desc: 'AWS, Azure, Ethical Hacking, Network Security & DevOps infrastructure.',
                        },
                      };

                      const slug = category.slug || category.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      const meta = CATEGORY_META[slug] || {
                        tag: 'PROGRAM',
                        image: '/assets/about_hero_lead.jpg',
                        count: '5 Courses',
                        desc: category.description || 'Master industry-relevant skills with senior experts.',
                      };
                      
                      return (
                        <motion.div
                          key={category._id || slug}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <Link to={`/courses?category=${slug}`} className="block h-full group">
                            {/* Magazine Card Container matching About Page */}
                            <div className="h-full bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">
                              
                              {/* Top Header Image + Glass Badge */}
                              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                                <img
                                  src={meta.image}
                                  alt={category.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/about_hero_lead.jpg';
                                  }}
                                />
                                {/* Bottom Fade Gradient into White */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                                
                                {/* Top Left Glass Tag Badge */}
                                <div className="absolute top-4 left-4 z-10">
                                  <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-widest border border-white/20 shadow-sm">
                                    {meta.tag}
                                  </span>
                                </div>
                              </div>

                              {/* Card Body */}
                              <div className="p-6 space-y-2 flex-grow bg-white">
                                <div className="text-xs font-extrabold text-indigo-600 tracking-wide uppercase">
                                  {meta.count}
                                </div>
                                <h3 className="text-xl font-black font-manrope text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                                  {category.name}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                                  {meta.desc}
                                </p>
                              </div>

                              {/* Footer Action Strip */}
                              <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between">
                                <span className="text-xs font-extrabold tracking-wider uppercase text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  EXPLORE PROGRAM
                                </span>
                                <ArrowRight className="w-4 h-4 text-slate-900 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
