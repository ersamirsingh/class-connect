import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  BookOpen, 
  Layers, 
  ArrowRight, 
  Star, 
  Tag, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { courseApi } from '../../api/models/course.api';
import { categoryApi } from '../../api/models/category.api';

export function UniversalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, catRes] = await Promise.all([
          courseApi.getCourses(),
          categoryApi.getCategories()
        ]);
        if (cRes.data?.courses?.length) setCourses(cRes.data.courses);
        if (catRes.data?.categories?.length) setCategories(catRes.data.categories);
      } catch (err) {
        console.warn('Search data fallback active:', err.message);
      }
    };
    fetchData();
  }, []);

  // Filter fuzzy matching (substring matching across title, subtitle, tags, category)
  const cleanQuery = query.trim().toLowerCase();

  const matchedCategories = cleanQuery === '' 
    ? [] 
    : categories.filter(cat => 
        cat.name?.toLowerCase().includes(cleanQuery) ||
        cat.description?.toLowerCase().includes(cleanQuery) ||
        cat.slug?.toLowerCase().includes(cleanQuery)
      );

  const matchedCourses = cleanQuery === '' 
    ? [] 
    : courses.filter(c => {
        const titleMatch = c.title?.toLowerCase().includes(cleanQuery);
        const subMatch = c.subtitle?.toLowerCase().includes(cleanQuery) || c.description?.toLowerCase().includes(cleanQuery);
        const tagMatch = c.tags?.some(t => t.toLowerCase().includes(cleanQuery));
        const catName = typeof c.category === 'object' ? c.category?.name : '';
        const catMatch = catName.toLowerCase().includes(cleanQuery);

        return titleMatch || subMatch || tagMatch || catMatch;
      });

  const handleSelectCourse = (path) => {
    onClose();
    navigate(path);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-md">
        
        {/* Backdrop click listener */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden text-slate-900 z-10 flex flex-col max-h-[80vh]"
        >
          {/* Top Search Input Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <Search className="w-5 h-5 text-indigo-600 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, categories, tags (e.g. React, Full-Stack, AI)..."
              className="w-full bg-transparent border-none text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-1 text-[10px] font-mono font-extrabold text-slate-400 bg-slate-200/60 rounded-md border border-slate-300/50">
              ESC
            </kbd>
          </div>

          {/* Results Container */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            
            {/* Case A: Empty Query -> Popular Recommendations */}
            {!cleanQuery && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Popular Categories</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 5).map((cat, idx) => (
                    <button
                      key={cat._id || idx}
                      onClick={() => setQuery(cat.name)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Case B: Query Active with Matches */}
            {cleanQuery && (
              <>
                {/* OUTPUT 1: Course Categories Output */}
                {matchedCategories.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        Course Categories Output ({matchedCategories.length})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {matchedCategories.map((cat, idx) => (
                        <div
                          key={cat._id || idx}
                          onClick={() => handleSelectCourse(`/categories`)}
                          className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 flex items-center justify-between transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                              <Layers className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-xs text-slate-900 font-manrope group-hover:text-indigo-600 transition-colors">
                                {cat.name}
                              </h4>
                              <p className="text-[10px] text-slate-500 font-medium">Category</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* OUTPUT 2: Actual Courses Output */}
                {matchedCourses.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        Actual Courses Output ({matchedCourses.length})
                      </span>
                    </div>

                    <div className="space-y-2">
                      {matchedCourses.map((c, idx) => (
                        <div
                          key={c._id || idx}
                          onClick={() => handleSelectCourse(`/courses/${c.slug || c._id}`)}
                          className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 flex items-center justify-between transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={c.thumbnail || '/assets/about_hero_lead.jpg'}
                              alt={c.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/about_hero_lead.jpg';
                              }}
                            />
                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-700">
                                  {typeof c.category === 'object' ? c.category?.name : 'Course'}
                                </span>
                                <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                                  <Star className="w-3 h-3 fill-amber-400" />
                                  {c.rating || '4.9'}
                                </span>
                              </div>
                              <h4 className="font-extrabold text-xs text-slate-900 font-manrope group-hover:text-indigo-600 transition-colors line-clamp-1">
                                {c.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">
                                {c.subtitle || c.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-extrabold text-xs text-slate-900">
                              {c.price === 0 ? 'Free' : `₹${c.price?.toLocaleString('en-IN')}`}
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Case C: No Match Found */}
                {matchedCategories.length === 0 && matchedCourses.length === 0 && (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Search className="w-6 h-6" />
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-800 font-manrope">No matches found for "{query}"</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Try searching with broader terms like "React", "Python", "Full-Stack", or "Design".
                    </p>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-slate-100/70 border-t border-slate-200/80 text-center text-[11px] text-slate-500 font-medium flex items-center justify-between px-6">
            <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-mono">ESC</kbd> to close</span>
            <span className="text-indigo-600 font-bold">ClassConnect Universal Search</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
