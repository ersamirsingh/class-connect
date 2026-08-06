import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Clock, Users, ArrowUpRight } from 'lucide-react';
import { ShimmerButton } from './ShimmerButton';

export const CourseCoverflow = ({ courses = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!courses || courses.length === 0) return null;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % courses.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + courses.length) % courses.length);
  };

  return (
    <div className="relative py-16 w-full overflow-hidden">
      {/* Coverflow Container */}
      <div className="relative h-[480px] sm:h-[520px] max-w-6xl mx-auto flex items-center justify-center">
        {courses.map((course, idx) => {
          // Calculate distance relative to active index
          const offset = (idx - activeIndex + courses.length) % courses.length;
          let position = offset;
          if (offset > courses.length / 2) {
            position = offset - courses.length;
          }

          const isActive = position === 0;
          const isLeft = position === -1 || (position < 0 && position >= -2);
          const isRight = position === 1 || (position > 0 && position <= 2);

          // Position math for 3D depth effect
          const translateX = position * 320;
          const scale = isActive ? 1 : Math.max(0.78, 1 - Math.abs(position) * 0.15);
          const opacity = isActive ? 1 : Math.max(0.35, 1 - Math.abs(position) * 0.4);
          const rotateY = position * -18;
          const zIndex = 30 - Math.abs(position) * 10;

          if (Math.abs(position) > 2) return null; // Hide far off cards

          return (
            <motion.div
              key={course._id || course.id || idx}
              initial={false}
              animate={{
                x: translateX,
                scale,
                opacity,
                rotateY,
                zIndex,
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActiveIndex(idx)}
              className={`absolute top-0 w-[340px] sm:w-[420px] h-[450px] sm:h-[480px] rounded-3xl p-6 bg-[#0B0B0D] border transition-colors cursor-pointer select-none flex flex-col justify-between ${
                isActive
                  ? 'border-[#C1FBD4]/60 shadow-[0_0_50px_rgba(193,251,212,0.15)]'
                  : 'border-white/10 hover:border-white/20'
              }`}
              style={{ perspective: 1000 }}
            >
              {/* Media Header */}
              <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-[#141416] mb-4">
                <img
                  src={course.image || course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-[#000000]/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#C1FBD4] uppercase tracking-wider">
                    {course.category?.name || course.category || 'FEATURED TRACK'}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-xs font-mono text-white">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{course.rating || '4.9'}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-light text-[#F7F7F5] line-clamp-2 leading-snug mb-2">
                    {course.title}
                  </h3>
                  <p className="font-body text-xs text-[#A1A1AA] line-clamp-2 leading-relaxed">
                    {course.subtitle || course.description || course.tagline}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                  <div>
                    <span className="font-display text-xl font-normal text-[#F7F7F5]">
                      {course.price === 0 ? 'Free' : `₹${course.price?.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  {isActive && (
                    <ShimmerButton
                      href={`/courses/${course.slug || course._id || course.id}`}
                      size="sm"
                      variant="white"
                    >
                      Explore Track <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                    </ShimmerButton>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Arrow Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          className="w-11 h-11 rounded-full bg-[#0B0B0D] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-[#C1FBD4]/50 transition-all cursor-pointer"
          aria-label="Previous Course"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {/* Dots Indicator */}
        <div className="flex items-center gap-2">
          {courses.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex ? 'w-8 bg-[#C1FBD4]' : 'w-2 bg-white/20'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-11 h-11 rounded-full bg-[#0B0B0D] border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-[#C1FBD4]/50 transition-all cursor-pointer"
          aria-label="Next Course"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CourseCoverflow;
