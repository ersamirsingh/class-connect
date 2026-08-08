import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowRight, Compass, Filter, Star, Radio, PlayCircle, DollarSign, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { categoryApi } from '../../api/models/category.api';
import { courseApi } from '../../api/models/course.api';
import { SpotlightCard } from '../../components/motion/SpotlightCard';
import { TextEffect } from '../../components/motion/TextEffect';
import { InView } from '../../components/motion/InView';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';

export function CategoryListPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [categoryCourses, setCategoryCourses] = useState([]);
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
        const loadedCats = Array.isArray(catRes?.data)
          ? catRes.data
          : (catRes?.data?.categories || (Array.isArray(catRes) ? catRes : []));
        setCategories(loadedCats);

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
            const loadedCourses = Array.isArray(courseRes?.data)
              ? courseRes.data
              : (courseRes?.data?.courses || (Array.isArray(courseRes) ? courseRes : []));
            setCategoryCourses(loadedCourses);
          } catch (courseErr) {
            console.warn('Failed to load courses for category:', courseErr);
            setCategoryCourses([]);
          }
        } else {
          // Load overall courses if no category ID filter
          const courseRes = await courseApi.getCourses();
          const loadedCourses = Array.isArray(courseRes?.data)
            ? courseRes.data
            : (courseRes?.data?.courses || (Array.isArray(courseRes) ? courseRes : []));
          setCategoryCourses(loadedCourses);
        }
      } catch (err) {
        console.warn('Failed to load live categories:', err);
        setCategories([]);
        setCategoryCourses([]);
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
                      // Map category slug/name to its thumbnail image
                      const CATEGORY_IMAGES = {
                        'web-development': '/assets/categories/web-development.jpg',
                        'app-development': '/assets/categories/app-development.jpg',
                        'ui-ux-design': '/assets/categories/ui-ux-design.jpg',
                        'ai-data-science': '/assets/categories/ai-data-science.jpg',
                        'digital-marketing': '/assets/categories/digital-marketing.jpg',
                        'cyber-security-cloud': '/assets/categories/cyber-security-cloud.jpg',
                      };
                      const CATEGORY_COLORS = {
                        'web-development': '#EF4444',
                        'app-development': '#10B981',
                        'ui-ux-design': '#8B5CF6',
                        'ai-data-science': '#3B82F6',
                        'digital-marketing': '#F97316',
                        'cyber-security-cloud': '#14B8A6',
                      };

                      const slug = category.slug || category.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      const imageUrl = CATEGORY_IMAGES[slug] || null;
                      const accentColor = CATEGORY_COLORS[slug] || '#4338F2';
                      
                      return (
                        <motion.div
                          key={category._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <Link to={`/courses?category=${slug}`} className="block h-full group">
                            <div className="h-full bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all overflow-hidden">
                              
                              {/* Category Thumbnail Image */}
                              <div className="relative w-full h-44 overflow-hidden">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                                    <Layers className="w-12 h-12 text-indigo-400" />
                                  </div>
                                )}
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                {/* Course count badge */}
                                <div className="absolute top-3 left-3">
                                  <span
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white backdrop-blur-md"
                                    style={{ backgroundColor: `${accentColor}CC` }}
                                  >
                                    <Sparkles className="w-3 h-3" />
                                    {`${category.courseCount || 0} Courses`}
                                  </span>
                                </div>
                              </div>

                              {/* Card Content */}
                              <div className="p-5 flex items-center justify-between">
                                <div>
                                  <h3 className="text-lg font-extrabold text-[var(--ink)] mb-1 group-hover:text-[var(--primary)] transition-colors font-manrope">
                                    {category.name}
                                  </h3>
                                  <p className="text-xs text-[var(--ink-muted)] font-medium">
                                    Explore courses
                                  </p>
                                </div>
                                <div className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center bg-[var(--canvas)] text-[var(--ink-muted)] group-hover:bg-[var(--primary)] group-hover:text-white group-hover:border-[var(--primary)] transition-colors duration-300 shrink-0">
                                  <ArrowRight className="w-4 h-4" />
                                </div>
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
