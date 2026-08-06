import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Star, BookOpen, Sparkles, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { courseApi } from '../../api/models/course.api';
import { categoryApi } from '../../api/models/category.api';
import { SAMPLE_CATEGORIES, SAMPLE_COURSES } from '../../data/sampleData';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';

export function CourseListPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [allCourses, setAllCourses] = useState(SAMPLE_COURSES);
  const [categories, setCategories] = useState(SAMPLE_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(searchParam);

  useEffect(() => {
    setSearchTerm(searchParam);
  }, [searchParam]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [categoriesRes, coursesRes] = await Promise.all([
          categoryApi.getCategories(),
          courseApi.getCourses()
        ]);
        
        const apiCats = Array.isArray(categoriesRes.data)
          ? categoriesRes.data
          : (categoriesRes.data?.categories || (Array.isArray(categoriesRes) ? categoriesRes : []));
        const apiCourses = Array.isArray(coursesRes.data)
          ? coursesRes.data
          : (coursesRes.data?.courses || (Array.isArray(coursesRes) ? coursesRes : []));

        if (apiCats.length > 0) setCategories(apiCats);
        if (apiCourses.length > 0) setAllCourses(apiCourses);
      } catch (error) {
        console.warn('Using sample courses fallback for CourseListPage:', error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      if (categoryParam) {
        const courseCatSlug = typeof course.category === 'object' ? course.category?.slug : '';
        const courseCatName = typeof course.category === 'object' ? course.category?.name : String(course.category || '');
        if (courseCatSlug !== categoryParam && courseCatName.toLowerCase() !== categoryParam.toLowerCase()) {
          return false;
        }
      }

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

        return titleMatch || descMatch || instructorMatch || catNameMatch;
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
    <div className="min-h-screen bg-[#FBFBF5] text-[#000000] flex flex-col font-body selection:bg-[#C1FBD4] selection:text-black">
      <FloatingNav />
      
      <main className="flex-grow pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-[#C1FBD4] text-[#000000] text-xs font-mono font-medium mb-3">
              ALL COURSES & TRACKS
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-light text-[#000000] tracking-tight mb-4">
              {isHindi ? "कोर्स खोजें" : "Explore Courses"}
            </h1>
            <p className="font-body text-base sm:text-lg text-[#71717A]">
              {isHindi 
                ? "अपनी पसंद के विषयों में महारत हासिल करें और अपने करियर को नई ऊंचाइयों पर ले जाएं।"
                : "Master new skills and accelerate your career with industry-proven technical tracks."}
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            {/* Category Pills */}
            <div className="flex overflow-x-auto pb-2 -mb-2 w-full md:w-auto scrollbar-hide gap-2">
              <button
                onClick={() => handleCategorySelect('')}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                  !categoryParam 
                    ? 'bg-[#000000] text-white' 
                    : 'bg-[#FFFFFF] text-[#71717A] border border-[#E4E4E7] hover:border-[#000000]'
                }`}
              >
                {isHindi ? "सभी" : "All Categories"}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`px-5 py-2 rounded-full text-xs font-medium transition-all ${
                    categoryParam === cat.slug 
                      ? 'bg-[#000000] text-white' 
                      : 'bg-[#FFFFFF] text-[#71717A] border border-[#E4E4E7] hover:border-[#000000]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full md:w-80 shrink-0">
              <input
                type="text"
                placeholder={isHindi ? "कोर्स या श्रेणी खोजें..." : "Search courses, topics, instructor..."}
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-11 pr-10 py-2.5 bg-[#FFFFFF] border border-[#E4E4E7] rounded-full text-sm text-[#000000] placeholder-[#A1A1AA] focus:outline-none focus:border-[#000000] transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#A1A1AA] hover:text-[#000000]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Course Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-[#FFFFFF] rounded-3xl h-[380px] border border-[#E4E4E7]" />
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <Link key={course._id} to={`/courses/${course.slug || course._id}`} className="block h-full group">
                  <div className="h-full bg-[#FFFFFF] rounded-3xl border border-[#E4E4E7] hover:border-[#000000] transition-all duration-300 overflow-hidden flex flex-col justify-between p-6">
                    <div className="relative aspect-video w-full overflow-hidden bg-[#FBFBF5] rounded-2xl mb-4">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#D4F9E0] flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-[#000000]/40" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-[10px] font-mono text-[#000000] border border-[#E4E4E7]">
                        {typeof course.category === 'object' ? course.category?.name : course.category || "General"}
                      </div>
                    </div>

                    <div className="flex-grow flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-display text-xl font-medium text-[#000000] group-hover:text-[#9F1018] transition-colors leading-snug mb-1.5">
                          {course.title}
                        </h3>
                        
                        <p className="font-body text-xs text-[#71717A] line-clamp-2">
                          {course.subtitle || course.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#E4E4E7] flex items-center justify-between">
                        <div className="flex items-center gap-1 font-mono text-xs text-[#000000]">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{course.rating?.toFixed(1) || "4.9"}</span>
                          <span className="text-[#A1A1AA]">({course.totalReviews || 120})</span>
                        </div>
                        <div className="font-display text-lg font-normal text-[#000000]">
                          {course.price === 0 ? "Free" : `₹${course.price?.toLocaleString('en-IN')}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#FFFFFF] rounded-3xl border border-[#E4E4E7]">
              <Sparkles className="w-12 h-12 text-[#A1A1AA] mx-auto mb-4" />
              <h3 className="font-display text-2xl font-light text-[#000000] mb-2">
                {isHindi ? "कोई परिणाम नहीं मिला" : "No matching courses"}
              </h3>
              <p className="font-body text-sm text-[#71717A] mb-6 max-w-md mx-auto">
                No courses matched "{searchTerm}". Try searching for another topic.
              </p>
              <button
                onClick={() => {
                  handleClearSearch();
                  handleCategorySelect('');
                }}
                className="px-6 py-2.5 bg-[#000000] text-white font-medium text-xs rounded-full hover:bg-[#27272A] transition-colors"
              >
                Reset All Filters
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
