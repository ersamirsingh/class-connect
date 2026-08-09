import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Star, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  Briefcase,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cdnImg } from '../../utils/cdnImg';



function StudentCardItem({ student }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-[250px] sm:w-[270px] h-[260px] cursor-pointer group shrink-0"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className="w-full h-full relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200/90"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          style={{ 
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d'
          }}
          className="w-full h-full relative"
        >
          {/* --- FRONT SIDE --- */}
          <div 
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden bg-slate-900"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            {/* Student Portrait Photo */}
            <img
              src={cdnImg(student.avatarUrl)}
              alt={student.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Bottom Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/40 to-transparent flex flex-col justify-end p-4 text-white">
              
              {/* Student Name + Green Active Status Dot */}
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"></span>
                <h3 className="font-extrabold text-lg font-manrope tracking-tight text-white">
                  {student.name}
                </h3>
              </div>

              {/* Company Logo + Company Name & Role Title */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white text-slate-900 font-bold text-[11px] flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-white/30">
                  {student.companyLogo ? (
                    <img src={cdnImg(student.companyLogo)} alt={student.company} className="w-full h-full object-cover" />
                  ) : (
                    student.company.substring(0, 2).toUpperCase()
                  )}
                </div>

                <div className="leading-tight">
                  <p className="font-bold text-[11px] text-white">{student.company}</p>
                  <p className="text-[10px] text-gray-300 font-medium">{student.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- BACK SIDE (Written Detailed Back View) --- */}
          <div 
            className="absolute inset-0 w-full h-full rounded-3xl p-4 flex flex-col justify-between overflow-hidden bg-slate-900 text-white border border-indigo-500/40 shadow-2xl"
            style={{ 
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              WebkitTransform: 'rotateY(180deg)'
            }}
          >
            <div>
              {/* Header Info */}
              <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-1.5">
                <div>
                  <h4 className="font-bold text-xs text-white font-manrope">{student.name}</h4>
                  <p className="text-[10px] text-indigo-300 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {student.role}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(student.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Written Review */}
              <p className="text-[11px] text-gray-200 leading-relaxed italic line-clamp-3 mb-2">
                "{student.review}"
              </p>

              {/* Company & Batch Info */}
              <div className="flex items-center justify-between text-[10px] text-indigo-200 font-semibold bg-white/10 px-2 py-1 rounded-lg border border-white/10">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-emerald-400" />
                  {student.company}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-400" />
                  {student.batch || 'Batch Zero'}
                </span>
              </div>
            </div>

            {/* Bottom Outcome & Mastered Skills */}
            <div className="pt-1.5 border-t border-white/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-extrabold">
                  {student.packageCTC || 'Placed Graduate'}
                </span>
                <span className="text-[9px] text-gray-300 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Verified
                </span>
              </div>

              {/* Skills Pills */}
              <div className="flex flex-wrap gap-1">
                {(student.skills || ['React', 'Node.js']).slice(0, 3).map((skill, kIdx) => (
                  <span key={kIdx} className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-500/40">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function StudentBatchResultsShowcase({ cmsData }) {
  const data = cmsData?.data || {};
  const students = (data.students || []).filter(s => s.isActive !== false);
  const scrollContainerRef = useRef(null);

  if (!cmsData || !cmsData.isActive || students.length === 0) {
    return null;
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 px-6 lg:px-[var(--space-page)] bg-white text-slate-900 relative overflow-hidden">
      
      {/* Background Soft Aura Glows */}
      <div className="pointer-events-none absolute top-1/3 left-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[160px] -translate-y-1/2" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[180px]" />

      <div className="max-w-[var(--max-width)] w-full mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT COLUMN: Real Results Statement */}
          <div className="lg:col-span-5 space-y-6 pr-2">
            
            {/* Giant Faded Numeral "0" Background */}
            <div className="relative">
              <div className="pointer-events-none absolute -left-10 -top-16 text-slate-900/[0.04] font-extrabold text-[220px] leading-none select-none font-manrope">
                0
              </div>

              <div className="relative z-10">
                {/* Title with Red Underline under "Real Results" */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-manrope leading-[1.15] mb-6 tracking-tight text-slate-900">
                  <span className="relative inline-block border-b-4 border-red-600 pb-1 text-slate-900">
                    Real Results
                  </span>{' '}
                  <span className="text-slate-900">from Batch Zero</span>
                </h2>

                {/* Checklist Items with Green Checkmarks */}
                <div className="space-y-3.5 font-body">
                  <div className="flex items-start gap-3.5 text-sm md:text-base font-semibold text-slate-800">
                    <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-300 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>{data.headlineMetric || '100% of graduates* secured paid industry opportunities.'}</span>
                  </div>

                  <div className="flex items-start gap-3.5 text-sm md:text-base font-semibold text-slate-800">
                    <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-300 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>{data.opportunitiesText || 'Full-time jobs | Paid internships | Freelance clients'}</span>
                  </div>

                  <div className="flex items-start gap-3.5 text-sm md:text-base font-semibold text-slate-800">
                    <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-300 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-emerald-700 font-extrabold">{data.ctcStat || '₹16.2 LPA Combined CTC'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footnote */}
            <p className="text-[11px] text-slate-500 leading-relaxed italic border-t border-slate-200 pt-3">
              {data.footnote || '*Out of all the students who completed the program and actively pursued paid opportunities from ClassConnect'}
            </p>
          </div>

          {/* RIGHT COLUMN: 2-Row Horizontal Scroll Container */}
          <div className="lg:col-span-7 relative">
            
            {/* Scroll Navigation Arrow Controls */}
            <div className="flex justify-end items-center mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={scrollLeft}
                  className="w-9 h-9 rounded-full bg-white border border-slate-300 shadow-xs text-slate-700 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={scrollRight}
                  className="w-9 h-9 rounded-full bg-white border border-slate-300 shadow-xs text-slate-700 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                  title="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2-ROW Horizontal Scrollable Container */}
            <div 
              ref={scrollContainerRef}
              className="grid grid-rows-2 grid-flow-col gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {students.map((student) => (
                <StudentCardItem key={student.id} student={student} />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
