import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { courseApi } from '../../api/models/course.api';
import { categoryApi } from '../../api/models/category.api';
import { Navbar } from '../../components/guest/Navbar';
import { Footer } from '../../components/guest/Footer';
import { Search, Star, PlayCircle, Radio, BookOpen, Filter, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const CourseListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCat = searchParams.get('category') || '';

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const [courseRes, catRes] = await Promise.all([
          courseApi.getCourses({
            category: selectedCat,
            type: typeFilter,
            search: searchTerm,
          }),
          categoryApi.getCategories(),
        ]);

        if (courseRes.success) setCourses(courseRes.data);
        if (catRes.success) setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [selectedCat, typeFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3730E0]/10 text-[#3730E0] text-xs font-extrabold mb-2">
              <BookOpen className="w-4 h-4 text-[#FF7A33]" /> Course Catalog
            </div>
            <h1 className="text-3xl font-black text-[#1E1E2E]">Explore All Courses</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">High-impact visual learning modules & live interactive sessions.</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3730E0] shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          <button
            onClick={() => {
              setTypeFilter('');
              setSearchParams({});
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !typeFilter && !selectedCat
                ? 'bg-[#3730E0] text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setTypeFilter('recorded')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              typeFilter === 'recorded'
                ? 'bg-[#3730E0] text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <PlayCircle className="w-4 h-4 text-[#FF7A33]" /> Recorded
          </button>
          <button
            onClick={() => setTypeFilter('live')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              typeFilter === 'live'
                ? 'bg-[#FF7A33] text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Radio className="w-4 h-4 text-[#FF7A33]" /> Live Classes
          </button>
        </div>

        {/* Course Card Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-[#3730E0] animate-spin mb-3" />
            <span className="text-xs font-bold text-slate-500">Loading catalog...</span>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl p-8 border border-slate-100 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No courses match your filter</h3>
            <p className="text-xs text-slate-500 font-medium">Try resetting your search or filter keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <motion.div key={course._id} whileHover={{ y: -4 }}>
                <Link
                  to={`/courses/${course.slug || course._id}`}
                  className="card-visual overflow-hidden flex flex-col justify-between h-full group block"
                >
                  {/* Thumbnail Image + Overlay Badge */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-md ${
                          course.type === 'live' ? 'bg-[#FF7A33]' : 'bg-[#3730E0]'
                        }`}
                      >
                        {course.type === 'live' ? '⚡ Live Class' : '📹 Recorded'}
                      </span>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl shadow-md flex items-center gap-1.5">
                      <span className="text-sm font-black text-[#3730E0]">${course.discountPrice || course.price}</span>
                      {course.discountPrice && (
                        <span className="text-[10px] text-slate-400 line-through font-bold">${course.price}</span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-[#F5A623] mb-1 text-xs font-bold">
                        <Star className="w-4 h-4 fill-[#F5A623]" />
                        <span>{course.rating || 4.9}</span>
                        <span className="text-slate-400 text-[10px]">({course.ratingCount || 100})</span>
                      </div>

                      <h3 className="font-extrabold text-base text-[#1E1E2E] group-hover:text-[#3730E0] transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 line-clamp-2 mt-1">
                        {course.subtitle || course.description}
                      </p>
                    </div>

                    {/* Instructor Info */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={course.instructor?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                          alt={course.instructor?.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
                          {course.instructor?.name || 'ClassConnect'}
                        </span>
                      </div>

                      <span className="text-xs font-extrabold text-[#3730E0] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
