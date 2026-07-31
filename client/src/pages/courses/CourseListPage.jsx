import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { courseApi } from '../../api/models/course.api';
import { categoryApi } from '../../api/models/category.api';
import { enrollmentApi } from '../../api/models/enrollment.api';
import { Navbar } from '../../components/guest/Navbar';
import { Footer } from '../../components/guest/Footer';
import { useAuth } from '../../hooks/useAuth';
import {
  Search,
  Star,
  PlayCircle,
  Radio,
  BookOpen,
  ArrowRight,
  Loader2,
  Code,
  Palette,
  Database,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp,
  Video,
  CheckCircle2,
  Sparkles,
  Play,
  Filter,
  Check,
  Tag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ICON_MAP = {
  Code,
  Palette,
  Database,
  Cpu,
  Layers,
};

export const CourseListPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || searchParams.get('cat') || '';

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedFormat, setSelectedFormat] = useState('all'); // 'all' | 'live' (pos1) | 'recorded' (pos2)
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  
  // Category Scroll Down Dropdown State & Ref
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  // Close category dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const [courseRes, catRes] = await Promise.all([
          courseApi.getCourses({}),
          categoryApi.getCategories(),
        ]);

        if (courseRes.success) setCourses(courseRes.data);
        if (catRes.success) setCategories(catRes.data);

        // Fetch user's purchased / enrolled courses if logged in
        if (user) {
          try {
            const enrollRes = await enrollmentApi.getMyEnrollments();
            if (enrollRes.success && enrollRes.data) {
              const ids = new Set(
                enrollRes.data.map((item) => (item.course?._id || item.course).toString())
              );
              setEnrolledCourseIds(ids);
            }
          } catch (err) {
            console.error('Failed to load user enrollments:', err);
          }
        }
      } catch (err) {
        console.error('Failed to load courses data:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [user]);

  // Filter courses based on format (live/recorded), category, and search
  const filteredCourses = courses.filter((c) => {
    // Format check (Position 1: Live, Position 2: Recorded)
    if (selectedFormat === 'live' && c.type !== 'live') return false;
    if (selectedFormat === 'recorded' && c.type !== 'recorded') return false;

    // Category check
    if (selectedCategory) {
      const catId = (c.category?._id || c.category).toString();
      const catSlug = c.category?.slug;
      if (selectedCategory !== catId && selectedCategory !== catSlug) return false;
    }

    // Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchDesc = (c.description || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });

  // Active selected category object for dropdown button label
  const currentCategoryObj = categories.find(
    (c) => c._id.toString() === selectedCategory || c.slug === selectedCategory
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col justify-between transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        
        {/* EASY HEADER & CONTROL BAR */}
        <div className="bg-white dark:bg-[#1E293B] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6366F1]/10 text-[#6366F1] dark:text-[#818cf8] text-xs font-extrabold mb-1">
                <BookOpen className="w-4 h-4 text-[#06B6D4]" /> Interactive MERN Catalog
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white tracking-tight">
                All MERN Courses ({filteredCourses.length} Cards)
              </h1>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses, lectures, topics..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* TWO WRAPPED CONTROL OPTIONS (1. CATEGORY SCROLL-DOWN BUTTON & 2. FORMAT TOGGLE) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            
            {/* OPTION 1: WRAPPED CATEGORY SCROLL DOWN BUTTON */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full sm:w-80 px-4 py-2.5 bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#6366F1] rounded-2xl text-xs font-extrabold text-[#0F172A] dark:text-white flex items-center justify-between shadow-xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Filter className="w-4 h-4 text-[#6366F1] shrink-0" />
                  <span className="truncate">
                    {currentCategoryObj ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: currentCategoryObj.color || '#6366F1' }} />
                        {currentCategoryObj.name}
                      </span>
                    ) : (
                      'All Categories (Scroll Down Options)'
                    )}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Scroll Down Menu Popup */}
              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    className="absolute left-0 top-full mt-2 w-full sm:w-80 bg-white dark:bg-[#111827] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-[90] space-y-1 max-h-72 overflow-y-auto"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('');
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all ${
                        !selectedCategory
                          ? 'bg-[#6366F1] text-white shadow-sm'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#06B6D4]" /> All Categories & Tracks
                      </span>
                      {!selectedCategory && <Check className="w-4 h-4 text-white" />}
                    </button>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                    {categories.map((cat) => {
                      const isSelected = selectedCategory === cat._id.toString() || selectedCategory === cat.slug;
                      return (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(isSelected ? '' : cat._id.toString());
                            setIsCategoryDropdownOpen(false);
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-[#6366F1] text-white shadow-sm'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color || '#6366F1' }} />
                            <span className="truncate">{cat.name}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* OPTION 2: FORMAT POSITIONS (Pos 1: Live, Pos 2: Recorded, All Formats) */}
            <div className="flex items-center bg-[#F1F5F9] dark:bg-slate-900 p-1.5 rounded-2xl w-full sm:w-auto">
              <button
                onClick={() => setSelectedFormat('all')}
                className={`flex-1 sm:flex-none px-4 py-2 text-xs font-black rounded-xl transition-all ${
                  selectedFormat === 'all'
                    ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Formats
              </button>
              <button
                onClick={() => setSelectedFormat('live')}
                className={`flex-1 sm:flex-none px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  selectedFormat === 'live'
                    ? 'bg-[#FF6B00] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#FF6B00]'
                }`}
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Pos 1: Live</span>
              </button>
              <button
                onClick={() => setSelectedFormat('recorded')}
                className={`flex-1 sm:flex-none px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  selectedFormat === 'recorded'
                    ? 'bg-[#6366F1] text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#6366F1]'
                }`}
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Pos 2: Recorded</span>
              </button>
            </div>

          </div>
        </div>

        {/* LOADING SPINNER */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#6366F1] animate-spin mb-3" />
            <span className="text-xs font-bold text-slate-500">Loading course cards...</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#1E293B] rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No courses match your selected filter</h3>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedFormat('all');
                setSearchTerm('');
              }}
              className="btn-visual btn-primary text-xs px-5 py-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* ALL COURSES SHOWN AS CARDS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isPurchased = enrolledCourseIds.has((course._id).toString());
              const isExpanded = expandedCourseId === course._id;
              const categoryName = course.category?.name || 'MERN Track';
              const categoryColor = course.category?.color || '#6366F1';

              return (
                <motion.div
                  key={course._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md overflow-hidden flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Thumbnail Cover Banner */}
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900 group">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Category & Format Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-black uppercase text-white shadow-md flex items-center gap-1"
                        style={{ backgroundColor: categoryColor }}
                      >
                        <Tag className="w-3 h-3" /> {categoryName}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-white shadow-md ${
                          course.type === 'live' ? 'bg-[#FF6B00]' : 'bg-[#6366F1]'
                        }`}
                      >
                        {course.type === 'live' ? '🔴 Pos 1: Live' : '📹 Pos 2: Recorded'}
                      </span>
                    </div>

                    {/* Purchased / Enrolled Badge */}
                    {isPurchased && (
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-[#10B981] text-white rounded-full text-[10px] font-black shadow-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Purchased
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold mb-2">
                        <div className="flex items-center gap-1 text-[#F59E0B]">
                          <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                          <span>{course.rating || 4.9}</span>
                        </div>
                        <span className="text-slate-400 text-[10px]">
                          {course.sections?.reduce((acc, s) => acc + (s.lectures?.length || 0), 0) || 4} Lectures
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base text-[#0F172A] dark:text-white leading-snug line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {course.subtitle || course.description}
                      </p>
                    </div>

                    {/* Category-Wise Lectures Expander Drawer */}
                    {course.sections && course.sections.length > 0 && (
                      <button
                        onClick={() => setExpandedCourseId(isExpanded ? null : course._id)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-[#6366F1] hover:bg-[#6366F1]/10 flex items-center justify-between transition-all cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-[#06B6D4]" /> View Lectures List
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}

                    {/* Lectures List Drawer */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs"
                        >
                          {course.sections?.map((section) => (
                            <div key={section._id || section.title} className="space-y-1.5">
                              <span className="font-extrabold text-slate-700 dark:text-slate-300 text-[11px] block uppercase tracking-wider">
                                {section.title}
                              </span>
                              <div className="space-y-1 pl-2 border-l-2 border-[#6366F1]/30">
                                {section.lectures?.map((lec) => (
                                  <div
                                    key={lec._id || lec.title}
                                    className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-0.5"
                                  >
                                    <span className="truncate max-w-[200px] flex items-center gap-1">
                                      <PlayCircle className="w-3 h-3 text-[#6366F1] shrink-0" />
                                      {lec.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold shrink-0">
                                      {lec.duration}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* FOOTER ACTIONS: Purchased (Hide price, show Enrolled) vs Unpurchased (Show Price & Purchase) */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        {isPurchased ? (
                          <span className="px-2.5 py-1 rounded-full bg-[#2FA876]/10 text-[#2FA876] text-[10px] font-black uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Enrolled & Active
                          </span>
                        ) : (
                          <span className="text-base font-black text-[#2B2B38] dark:text-white">
                            ${course.discountPrice || course.price}
                          </span>
                        )}
                      </div>

                      {isPurchased ? (
                        <Link
                          to={`/courses/${course._id}/explore`}
                          className="btn-visual bg-[#5B54E8] hover:bg-[#4740D2] text-white text-xs px-4 py-2 flex items-center gap-1.5 shadow-md font-black"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Explore</span>
                        </Link>
                      ) : (
                        <Link
                          to={`/courses/${course.slug || course._id}`}
                          className="btn-visual bg-[#FF7A59] hover:bg-[#E56848] text-white text-xs px-4 py-2 flex items-center gap-1.5 shadow-md font-black"
                        >
                          <span>Purchase</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
