import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, BookOpen, Clock, Users, ArrowRight, Sparkles, Award } from 'lucide-react';
import { ImageWithFallback } from '../shared/ImageWithFallback';
import { CourseRatingModal } from './CourseRatingModal';

export function FeaturedCourseCard({ course, onRatingUpdated }) {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(course?.rating || 4.8);

  if (!course) return null;

  const categoryName = typeof course.category === 'object' ? course.category?.name : (course.category || 'Professional');
  const instructorName = typeof course.instructor === 'object' ? course.instructor?.name : (course.instructor || 'Samir Singh');
  const instructorPhoto = typeof course.instructor === 'object' ? course.instructor?.photo : 'https://class-connect.b-cdn.net/avatars/1786211718869-avatar-1786211718869.svg';
  
  const sections = course.sections || course.units || [];
  const totalLectures = sections.reduce((acc, s) => acc + (s.lectures?.length || 0), 0);

  return (
    <>
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ duration: 0.25 }}
        className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:border-indigo-500/40 transition-all font-sans"
      >
        {/* Course Thumbnail Container with ImageWithFallback */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
          <ImageWithFallback
            src={course.thumbnail}
            alt={course.title}
            fallbackType="course"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

          {/* Badges Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md ${
              course.type === 'live'
                ? 'bg-rose-500 text-white'
                : course.type === 'hybrid'
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-600 text-white'
            }`}>
              {course.type === 'live' ? '🔴 Live Class' : course.type === 'hybrid' ? '⚡ Hybrid' : '📹 Self-Paced'}
            </span>

            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-md truncate max-w-[140px] border border-white/10">
              {categoryName}
            </span>
          </div>

          {/* Rating Badge Button */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsRatingModalOpen(true); }}
            className="absolute bottom-3 right-3 px-3 py-1 bg-black/70 hover:bg-amber-500 text-amber-300 hover:text-white backdrop-blur-md rounded-full text-xs font-black flex items-center gap-1.5 border border-amber-400/30 transition-all shadow-md cursor-pointer group/star"
            title="Click to Rate Course"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover/star:scale-125 transition-transform" />
            <span>{currentRating}</span>
            <span className="text-[10px] opacity-80">({course.reviewsCount || 128})</span>
          </button>
        </div>

        {/* Course Card Details */}
        <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
          <div>
            <Link to={`/courses/${course.slug || course._id}`}>
              <h3 className="text-lg font-black font-manrope text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {course.title}
              </h3>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
              {course.subtitle || course.description}
            </p>
          </div>

          {/* Instructor & Metrics */}
          <div className="flex items-center justify-between text-xs font-bold pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <ImageWithFallback
                src={instructorPhoto}
                alt={instructorName}
                fallbackType="avatar"
                className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
              />
              <span className="truncate max-w-[110px] text-slate-700 dark:text-slate-300">{instructorName}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>{totalLectures || 12} Lecs</span>
              </span>
            </div>
          </div>

          {/* Footer Action & Price Bar */}
          <div className="pt-2 flex items-center justify-between">
            <div>
              {course.discountPrice ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{course.discountPrice}</span>
                  <span className="text-xs text-slate-400 line-through">₹{course.price}</span>
                </div>
              ) : (
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">₹{course.price || 0}</span>
              )}
            </div>

            <Link
              to={`/courses/${course.slug || course._id}`}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Interactive Course Rating Modal */}
      <CourseRatingModal
        course={course}
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onRatingSubmitted={(newRating) => {
          setCurrentRating(newRating);
          if (onRatingUpdated) onRatingUpdated(newRating);
        }}
      />
    </>
  );
}
