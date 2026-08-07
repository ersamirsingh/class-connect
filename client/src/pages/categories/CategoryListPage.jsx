import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layers, ArrowRight, Compass, Filter, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { categoryApi } from '../../api/models/category.api';
import { courseApi } from '../../api/models/course.api';
import { SAMPLE_CATEGORIES, SAMPLE_COURSES } from '../../data/sampleData';
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
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
  const [activeRatingFilter, setActiveRatingFilter] = useState(0);
  const [activePriceFilter, setActivePriceFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const catRes = await categoryApi.getCategories();
        const loadedCats = Array.isArray(catRes.data)
          ? catRes.data
          : (catRes.data?.categories || (Array.isArray(catRes) ? catRes : SAMPLE_CATEGORIES));
        setCategories(loadedCats.length > 0 ? loadedCats : SAMPLE_CATEGORIES);

        if (id) {
          const matchedCategory = loadedCats.find(c => 
            c._id === id || 
            c.slug === id || 
            c.slug === id.replace(/-web-development/, '').replace(/-masterclass/, '')
          ) || SAMPLE_CATEGORIES.find(c => c._id === id || c.slug === id) || {
            _id: id,
            name: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            tagline: 'Master industry-relevant skills with top experts',
          };
          
          setSelectedCategory(matchedCategory);

          const courseRes = await courseApi.getCourses({ category: matchedCategory._id || matchedCategory.slug });
          const loadedCourses = Array.isArray(courseRes.data)
            ? courseRes.data
            : (courseRes.data?.courses || (Array.isArray(courseRes) ? courseRes : []));

          if (loadedCourses.length > 0) {
            setCategoryCourses(loadedCourses);
          } else {
            // Filter sample courses matching category
            const sampleMatch = SAMPLE_COURSES.filter(c => 
              c.category?.slug === id || 
              c.category?._id === id || 
              c.slug === id ||
              c.category?.slug === matchedCategory.slug
            );
            setCategoryCourses(sampleMatch.length > 0 ? sampleMatch : SAMPLE_COURSES);
          }
        }
      } catch (error) {
        console.warn('Fallback to sample data for category:', error);
        if (id) {
          const match = SAMPLE_CATEGORIES.find(c => c._id === id || c.slug === id) || {
            _id: id,
            name: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            tagline: 'Master industry-relevant skills with top experts',
          };
          setSelectedCategory(match);

          const sampleMatch = SAMPLE_COURSES.filter(c => 
            c.category?.slug === id || 
            c.slug === id ||
            c.category?._id === id
          );
          setCategoryCourses(sampleMatch.length > 0 ? sampleMatch : SAMPLE_COURSES);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const filteredCourses = categoryCourses.filter(c => {
    if (activeTypeFilter === 'live' && c.type !== 'live') return false;
    if (activeTypeFilter === 'recorded' && c.type === 'live') return false;
    if (activeRatingFilter > 0 && (c.rating || 4.5) < activeRatingFilter) return false;
    if (activePriceFilter === 'under1000' && c.price >= 1000) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FBFBF5] text-[#000000] flex flex-col font-body selection:bg-[#C1FBD4] selection:text-black">
      <FloatingNav />
      
      <main className="flex-grow pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* SINGLE CATEGORY VIEW (`/category/:id`) */}
          {id && selectedCategory ? (
            <div className="space-y-10">
              {/* Category Banner */}
              <div className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E4E4E7] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl text-center md:text-left">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C1FBD4] text-[#000000] text-xs font-mono font-medium">
                    <Layers className="w-3.5 h-3.5" /> TECHNICAL LEARNING TRACK
                  </span>
                  <h1 className="font-display text-4xl sm:text-6xl font-light text-[#000000] tracking-tight">
                    {selectedCategory.name}
                  </h1>
                  <p className="font-body text-base sm:text-lg text-[#71717A] max-w-xl">
                    {selectedCategory.tagline || selectedCategory.description || "Master industry-ready skills with top expert-led courses."}
                  </p>
                </div>

                <div className="w-24 h-24 rounded-3xl bg-[#D4F9E0] flex items-center justify-center text-[#000000] shrink-0">
                  <Compass className="w-12 h-12" />
                </div>
              </div>

              {/* Filter Chips */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFFFFF] border border-[#E4E4E7]">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#000000]">
                  <Filter className="w-4 h-4 text-[#000000]" />
                  <span>Filter by:</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveTypeFilter('all')}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTypeFilter === 'all' ? 'bg-[#000000] text-white' : 'bg-[#FBFBF5] text-[#71717A] border border-[#E4E4E7]'}`}
                  >
                    All Tracks
                  </button>
                  <button
                    onClick={() => setActiveTypeFilter('live')}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTypeFilter === 'live' ? 'bg-[#FF2A2A] text-white' : 'bg-[#FBFBF5] text-[#71717A] border border-[#E4E4E7]'}`}
                  >
                    Live Masterclasses
                  </button>
                  <button
                    onClick={() => setActiveTypeFilter('recorded')}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTypeFilter === 'recorded' ? 'bg-[#000000] text-white' : 'bg-[#FBFBF5] text-[#71717A] border border-[#E4E4E7]'}`}
                  >
                    Recorded Architecture
                  </button>

                  <div className="w-px h-5 bg-[#E4E4E7] mx-1" />

                  <button
                    onClick={() => setActiveRatingFilter(activeRatingFilter === 4.5 ? 0 : 4.5)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeRatingFilter === 4.5 ? 'bg-[#C1FBD4] text-[#000000]' : 'bg-[#FBFBF5] text-[#71717A] border border-[#E4E4E7]'}`}
                  >
                    ★ 4.5+ Stars
                  </button>
                </div>
              </div>

              {/* Course Grid for Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <Link key={course._id} to={`/courses/${course.slug || course._id}`} className="block h-full group">
                    <div className="h-full bg-[#FFFFFF] rounded-3xl border border-[#E4E4E7] hover:border-[#000000] transition-all duration-300 overflow-hidden flex flex-col justify-between p-6">
                      
                      {/* High Resolution Course Thumbnail */}
                      <div className="aspect-video w-full relative bg-[#000000] rounded-2xl overflow-hidden mb-5">
                        <img 
                          src={course.thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80"} 
                          alt={course.title} 
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80";
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-mono bg-black/80 backdrop-blur-md text-white border border-white/10">
                          {course.type === 'live' ? 'LIVE SESSION' : 'SYSTEMS TRACK'}
                        </div>
                      </div>

                      <div className="flex-grow flex flex-col justify-between space-y-4">
                        <div>
                          <h3 className="font-display text-xl font-medium text-[#000000] group-hover:text-[#FF2A2A] transition-colors leading-snug mb-2">
                            {course.title}
                          </h3>
                          <p className="font-body text-xs text-[#71717A] line-clamp-2">
                            {course.subtitle || course.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#E4E4E7] flex items-center justify-between">
                          <div className="flex items-center gap-1 font-mono text-xs text-[#000000]">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>{course.rating || '4.9'}</span>
                          </div>
                          <div className="font-display text-lg font-normal text-[#000000]">
                            {course.price === 0 ? 'Free' : `₹${course.price?.toLocaleString('en-IN')}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            /* CATEGORY LIST VIEW (`/categories`) */
            <>
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#C1FBD4] text-[#000000] text-xs font-mono font-medium mb-4">
                  BROWSE ALL PATHS
                </span>
                <h1 className="font-display text-4xl sm:text-6xl font-light text-[#000000] tracking-tight mb-4">
                  Explore Learning Tracks
                </h1>
                <p className="font-body text-base sm:text-lg text-[#71717A]">
                  Discover knowledge across specialized fields and find the exact path for your growth.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                  <Link key={category._id} to={`/category/${category._id || category.slug}`} className="block h-full group">
                    <div className="h-full bg-[#FFFFFF] rounded-3xl border border-[#E4E4E7] hover:border-[#000000] transition-all duration-300 p-8 flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-[#D4F9E0] flex items-center justify-center text-[#000000]">
                          <Layers className="w-7 h-7" />
                        </div>
                        <div className="w-10 h-10 rounded-full border border-[#E4E4E7] flex items-center justify-center bg-[#FBFBF5] text-[#000000] group-hover:bg-[#000000] group-hover:text-white transition-colors duration-300">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-display text-2xl font-light text-[#000000] mb-2 group-hover:text-[#FF2A2A] transition-colors">
                          {category.name}
                        </h3>
                        <p className="font-body text-xs text-[#71717A]">
                          {category.courseCount !== undefined ? `${category.courseCount} Courses Available` : 'Explore courses'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
