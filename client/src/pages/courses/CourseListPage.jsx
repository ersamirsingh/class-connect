import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, BookOpen, Sparkles, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { courseApi } from '../../api/models/course.api';
import { categoryApi } from '../../api/models/category.api';
import { GlowingEffect } from '../../components/motion/GlowingEffect';
import { TextEffect } from '../../components/motion/TextEffect';
import { InView } from '../../components/motion/InView';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';
import { FeaturedCourseCard } from '../../components/courses/FeaturedCourseCard';

export function CourseListPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(searchParam);

  // Synchronize input if search URL param changes externally
  useEffect(() => {
    setSearchTerm(searchParam);
  }, [searchParam]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [categoriesRes, coursesRes] = await Promise.all([
          categoryApi.getCategories(),
          courseApi.getCourses()
        ]);
        
        const apiCats = Array.isArray(categoriesRes?.data)
          ? categoriesRes.data
          : (categoriesRes?.data?.categories || (Array.isArray(categoriesRes) ? categoriesRes : []));
        const apiCourses = Array.isArray(coursesRes?.data)
          ? coursesRes.data
          : (coursesRes?.data?.courses || (Array.isArray(coursesRes) ? coursesRes : []));

        setCategories(apiCats);
        setAllCourses(apiCourses);
      } catch (error) {
        console.warn('Failed to load live courses:', error.message);
        setCategories([]);
        setAllCourses([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  // Universal instant search & category filtering
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      // 1. Category Filter
      if (categoryParam) {
        const paramClean = categoryParam.toLowerCase().trim();
        const courseCatSlug = (typeof course.category === 'object' ? course.category?.slug : '').toLowerCase();
        const courseCatName = (typeof course.category === 'object' ? course.category?.name : String(course.category || '')).toLowerCase();
        const courseCatId = (typeof course.category === 'object' ? course.category?._id : String(course.category || ''));

        const normalizedCatName = courseCatName.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const matchesSlug = courseCatSlug === paramClean;
        const matchesName = courseCatName === paramClean || normalizedCatName === paramClean;
        const matchesId = courseCatId === categoryParam;

        if (!matchesSlug && !matchesName && !matchesId) {
          return false;
        }
      }

      // 2. Universal Search Query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const titleMatch = course.title?.toLowerCase().includes(q);
        const descMatch = course.description?.toLowerCase().includes(q);
        const instructorMatch = (typeof course.instructor === 'object' ? course.instructor?.name : String(course.instructor || ''))
          .toLowerCase()
          .includes(q);
        const catNameMatch = (typeof course.category === 'object' ? course.category?.name : String(course.category || ''))
          .toLowerCase()
          .includes(q);
        const catSlugMatch = (typeof course.category === 'object' ? course.category?.slug : '')
          .toLowerCase()
          .includes(q);

        return titleMatch || descMatch || instructorMatch || catNameMatch || catSlugMatch;
      }

      return true;
    });
  }, [allCourses, categoryParam, searchTerm]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    const params = new URLSearchParams(searchParams);
    if (val.trim()) {
      params.set('search', val);
    } else {
      params.delete('search');
    }
    setSearchParams(params, { replace: true });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    setSearchParams(params, { replace: true });
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
      
      <main className="flex-grow pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
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
                className={`px-5 py-2.5 rounded-[var(--radius-pill)] text-sm font-semibold whitespace-nowrap transition-all duration-300 min-h-[44px] ${
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
                  className={`px-5 py-2.5 rounded-[var(--radius-pill)] text-sm font-semibold whitespace-nowrap transition-all duration-300 min-h-[44px] ${
                    categoryParam === cat.slug 
                      ? 'bg-[var(--primary)] text-[var(--surface)] shadow-[var(--shadow-sm)]' 
                      : 'bg-[var(--surface)] text-[var(--ink-muted)] hover:bg-[var(--canvas)] border border-[var(--border)]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Universal Instant Search Bar */}
            <div className="relative w-full md:w-80 shrink-0">
              <input
                type="text"
                placeholder={isHindi ? "कोर्स या श्रेणी खोजें..." : "Search courses, topics, instructor..."}
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-11 pr-10 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-pill)] text-[var(--ink)] placeholder-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all shadow-[var(--shadow-sm)] min-h-[44px]"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--ink-faint)]" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--canvas)]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Course Grid with Edge Glowing Effect */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-[var(--surface)] rounded-[var(--radius-lg)] h-[400px] border border-[var(--border)]" />
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                  >
                    <FeaturedCourseCard course={course} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
              <Sparkles className="w-14 h-14 text-[var(--ink-faint)] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[var(--ink)] mb-2">
                {isHindi ? "कोई परिणाम नहीं मिला" : "No matching courses"}
              </h3>
              <p className="text-sm text-[var(--ink-muted)] mb-6 max-w-md mx-auto">
                {isHindi 
                  ? "कृपया अपनी खोज बदलें या कोई अन्य श्रेणी चुनें।"
                  : `No courses matched "${searchTerm}". Try searching for another topic like "web", "react", "python", or "design".`}
              </p>
              <button
                onClick={() => {
                  handleClearSearch();
                  handleCategorySelect('');
                }}
                className="px-6 py-2.5 bg-[var(--primary)] text-white font-semibold rounded-[var(--radius-pill)] hover:bg-[var(--primary-hover)] transition-colors min-h-[44px]"
              >
                {isHindi ? "सभी कोर्स देखें" : "Reset All Filters"}
              </button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default CourseListPage;
