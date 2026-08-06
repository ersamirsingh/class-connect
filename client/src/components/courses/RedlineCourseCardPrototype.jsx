import React from 'react';
import { SpotlightCard } from '../motion/SpotlightCard';
import { ShimmerButton } from '../motion/ShimmerButton';
import { Star, Clock, Users, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const RedlineCourseCardPrototype = ({
  course = {
    id: 'demo-fullstack-pro',
    title: 'Full-Stack Systems Architecture & Cloud Deployment',
    tagline: 'Master scalable backend microservices, distributed queues, and high-performance React frontends.',
    category: 'FULL-STACK SYSTEMS',
    price: 4999,
    originalPrice: 9999,
    rating: 4.9,
    reviewsCount: 342,
    studentsCount: 1850,
    duration: '12 Weeks',
    level: 'Advanced Track',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    slug: 'fullstack-systems-architecture'
  }
}) => {
  return (
    <SpotlightCard className="group flex flex-col md:flex-row gap-6 p-6 sm:p-8 rounded-3xl bg-[#0B0B0D] border border-white/10">
      {/* Media Column */}
      <div className="relative w-full md:w-5/12 h-64 md:h-auto rounded-2xl overflow-hidden bg-[#141416] flex-shrink-0">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-transparent opacity-80" />

        {/* Floating Signal Tag */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#9F1018]/80 backdrop-blur-md border border-[#FF2A2A]/50 text-white font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A2A] animate-pulse" />
            {course.category}
          </span>
        </div>

        {/* Floating Rating Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050505]/80 backdrop-blur-md border border-white/10 text-xs font-mono text-white">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>{course.rating}</span>
          <span className="text-[#A8A8AE]">({course.reviewsCount})</span>
        </div>
      </div>

      {/* Content Column */}
      <div className="flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-xs font-mono text-[#A8A8AE]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#FF2A2A]" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#FF4D3D]" />
              {course.studentsCount} Students
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-[#F7F7F5]">
              {course.level}
            </span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-light text-[#F7F7F5] group-hover:text-[#FF4D3D] transition-colors leading-snug">
            {course.title}
          </h3>

          <p className="font-body text-sm text-[#A8A8AE] line-clamp-2 leading-relaxed">
            {course.tagline}
          </p>
        </div>

        {/* Pricing & CTA Section */}
        <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-normal text-[#F7F7F5]">
              ₹{course.price.toLocaleString('en-IN')}
            </span>
            {course.originalPrice && (
              <span className="font-mono text-sm text-[#A8A8AE] line-through">
                ₹{course.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="font-mono text-[10px] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full bg-emerald-500/10">
              SAVE 50%
            </span>
          </div>

          <ShimmerButton href={`/courses/${course.slug}`} size="default" variant="primary">
            Explore Track <ArrowUpRight className="w-4 h-4 ml-1" />
          </ShimmerButton>
        </div>
      </div>
    </SpotlightCard>
  );
};

export default RedlineCourseCardPrototype;
