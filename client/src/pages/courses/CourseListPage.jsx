import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, BookOpen, Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { courseApi } from '../../api/models/course.api';
import { categoryApi } from '../../api/models/category.api';
import { SAMPLE_CATEGORIES, SAMPLE_COURSES } from '../../data/sampleData';
import { SpotlightCard } from '../../components/motion/SpotlightCard';
import { TextEffect } from '../../components/motion/TextEffect';
import { InView } from '../../components/motion/InView';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';

export function CourseListPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [courses, setCourses] = useState(SAMPLE_COURSES);
  const [categories, setCategories] = useState(SAMPLE_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(searchParam);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, coursesRes] = await Promise.all([
          categoryApi.getCategories(),
          courseApi.getCourses({ category: categoryParam, search: searchParam })
        ]);
        
        const apiCats = categoriesRes.data?.categories || [];
        const apiCourses = coursesRes.data?.courses || [];

        if (apiCats.length > 0) setCategories(apiCats);
        if (apiCourses.length > 0) {
          setCourses(apiCourses);
        } else if (categoryParam || searchParam) {
          // Filter sample courses locally if API has no results
          let filtered = [...SAMPLE_COURSES];
          if (categoryParam) {
            filtered = filtered.filter(c => c.category?.slug === categoryParam);
          }
          if (searchParam) {
            const q = searchParam.toLowerCase();
            filtered = filtered.filter(c => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
          }
          setCourses(filtered);
        }
      } catch (error) {
        console.warn('Using sample courses fallback for CourseListPage:', error.message);
      }
    };
    
    fetchInitialData();
  }, [categoryParam, searchParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleCategorySelect = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  const isHindi = language === 'hi';

  return (
    <div className="min-h-screen bg-[var(--canvas)] flex flex-col font-sans">
      <FloatingNav />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <InView>
              <TextEffect 
                className="text-4xl md:text-5xl font-extrabold text-[var(--ink)] mb-4 tracking-tight"
              >
                {isHindi ? "कोर्स खोजें" : "Explore Courses"}
              </TextEffect>
              <p className="text-lg text-[var(--ink-muted)] max-w-2xl mx-auto">
                {isHindi 
                  ? "अपनी पसंद के विषयों में महारत हासिल करें और अपने करियर को नई ऊंचाइयों पर ले जाएं।"
                  : "Master new skills and take your career to new heights with our premium courses."}
              </p>
            </InView>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            {/* Categories */}
            <div className="flex overflow-x-auto pb-2 -mb-2 w-full md:w-auto scrollbar-hide gap-2">
              <button
                onClick={() => handleCategorySelect('')}
                className={`px-5 py-2.5 rounded-[var(--radius-pill)] text-sm font-medium whitespace-nowrap transition-all duration-300 min-h-[44px] ${
                  !categoryParam 
                    ? 'bg-[var(--primary)] text-[var(--surface)] shadow-[var(--shadow-sm)]' 
                    : 'bg-[var(--surface)] text-[var(--ink-muted)] hover:bg-[var(--canvas)] border border-[var(--border)]'
                }`}
              >
                {isHindi ? "सभी" : "All Categories"}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`px-5 py-2.5 rounded-[var(--radius-pill)] text-sm font-medium whitespace-nowrap transition-all duration-300 min-h-[44px] ${
                    categoryParam === cat.slug 
                      ? 'bg-[var(--primary)] text-[var(--surface)] shadow-[var(--shadow-sm)]' 
                      : 'bg-[var(--surface)] text-[var(--ink-muted)] hover:bg-[var(--canvas)] border border-[var(--border)]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80 shrink-0">
              <input
                type="text"
                placeholder={isHindi ? "खोजें..." : "Search courses..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-pill)] text-[var(--ink)] placeholder-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-shadow shadow-[var(--shadow-sm)] min-h-[44px]"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ink-faint)]" />
            </form>
          </div>

          {/* Course Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-[var(--surface)] rounded-[var(--radius-lg)] h-[400px] border border-[var(--border)]" />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {courses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link to={`/courses/${course.slug}`} className="block h-full group">
                      <SpotlightCard className="h-full flex flex-col bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all overflow-hidden relative">
                        {/* Thumbnail */}
                        <div className="relative aspect-video w-full overflow-hidden bg-[var(--canvas)]">
                          {course.thumbnail ? (
                            <img 
                              src={course.thumbnail} 
                              alt={course.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[var(--primary-soft)] to-[var(--accent-soft)] flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-[var(--primary)] opacity-50" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4 bg-[var(--surface)]/90 backdrop-blur-sm px-3 py-1 rounded-[var(--radius-pill)] text-xs font-semibold text-[var(--ink)] shadow-sm">
                            {course.category?.name || "General"}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold text-[var(--ink)] mb-2 line-clamp-2 leading-tight group-hover:text-[var(--primary)] transition-colors">
                            {course.title}
                          </h3>
                          
                          <p className="text-sm text-[var(--ink-muted)] mb-4">
                            By {course.instructor?.name || "Instructor"}
                          </p>
                          
                          <div className="mt-auto">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-1.5 bg-[var(--canvas)] px-2 py-1 rounded-[var(--radius-pill)]">
                                <Star className="w-4 h-4 fill-[var(--accent)] text-[var(--accent)]" />
                                <span className="text-sm font-semibold text-[var(--ink)]">{course.rating?.toFixed(1) || "4.5"}</span>
                                <span className="text-xs text-[var(--ink-faint)]">({course.totalReviews || 0})</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 mt-2">
                              <div className="text-lg font-extrabold text-[var(--primary)]">
                                {course.price === 0 ? "Free" : `₹${course.price?.toLocaleString('en-IN')}`}
                              </div>
                              <div className="text-sm font-semibold text-[var(--ink-muted)] flex items-center gap-1 group-hover:text-[var(--primary)] transition-colors">
                                {isHindi ? "विवरण देखें" : "View Details"}
                                <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SpotlightCard>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-24 bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
              <Sparkles className="w-16 h-16 text-[var(--ink-faint)] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[var(--ink)] mb-2">
                {isHindi ? "कोई कोर्स नहीं मिला" : "No courses found"}
              </h3>
              <p className="text-[var(--ink-muted)] mb-8">
                {isHindi 
                  ? "कृपया अपनी खोज बदलें या कोई अन्य श्रेणी चुनें।"
                  : "Try adjusting your search or filter to find what you're looking for."}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchParams(new URLSearchParams());
                }}
                className="px-6 py-3 bg-[var(--canvas)] hover:bg-[var(--border)] text-[var(--ink)] font-semibold rounded-[var(--radius-pill)] transition-colors min-h-[44px]"
              >
                {isHindi ? "फिल्टर साफ़ करें" : "Clear Filters"}
              </button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
