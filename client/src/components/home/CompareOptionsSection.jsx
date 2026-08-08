import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Laptop, School, Check, X, Sparkles } from 'lucide-react';

const COMPARISON_COLUMNS = [
  'Learning Style',
  'Mentorship',
  'Curriculum',
  'Industry Access',
  'Language',
  'Career Support',
  'Outcome'
];

const COMPARISON_DATA = {
  classConnect: {
    name: 'ClassConnect',
    tagline: 'Visual Learning OS',
    cells: [
      'Live & Visual Micro-lessons',
      '1-on-1 Senior Engineers',
      '2026 In-Demand Tech',
      'Direct Hiring Network',
      'Hindi & English Bilingual',
      'Portfolio & Placement Drive',
      'Land High-CTC Tech Offer'
    ]
  },
  onlinePlatforms: {
    name: 'Online Courses',
    tagline: 'Pre-recorded Videos',
    cells: [
      'Pre-recorded videos',
      'Limited or none',
      'Outdated software basics',
      'None',
      'English only',
      'Learn alone',
      'Collect certificates'
    ]
  },
  offlineInstitutes: {
    name: 'Offline Schools',
    tagline: 'Traditional Coaching',
    cells: [
      'Classroom lectures',
      'Generic trainers',
      'Basic theoretical syllabus',
      'Limited local contacts',
      'Regional classroom only',
      'Resume building only',
      'Get simple paper certificate'
    ]
  }
};

export function CompareOptionsSection() {
  return (
    <section className="py-20 px-6 lg:px-[var(--space-page)] bg-white text-slate-900 border-t border-slate-200 relative overflow-hidden">
      
      {/* Background Subtle Ambient Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-slate-100/60 rounded-full blur-[140px]" />

      <div className="max-w-[var(--max-width)] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-900 font-extrabold text-xs uppercase tracking-widest mb-3 border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-slate-900" />
            Clear Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-manrope text-slate-900 tracking-tight leading-tight">
            Compare Your{' '}
            <span className="relative inline-block border-b-4 border-slate-900 pb-1 text-slate-900">
              Options
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mt-3 font-normal">
            See how ClassConnect's practical visual ecosystem compares to traditional learning paths.
          </p>
        </div>

        {/* Premium Bordered Table Container */}
        <div className="overflow-x-auto pb-4 scrollbar-none">
          <div className="min-w-[960px] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            
            {/* Header Row */}
            <div className="grid grid-cols-8 bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-700 uppercase tracking-wider text-center">
              <div className="p-4 text-left border-r border-slate-200 font-manrope text-slate-900">
                Platform
              </div>
              {COMPARISON_COLUMNS.map((col, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 font-manrope flex items-center justify-center ${
                    idx < COMPARISON_COLUMNS.length - 1 ? 'border-r border-slate-200' : ''
                  }`}
                >
                  {col}
                </div>
              ))}
            </div>

            {/* ROW 1: ClassConnect (LIGHT BLACK / CHARCOAL ROW WITH GREEN CHECKS) */}
            <div className="grid grid-cols-8 bg-[#18181B] text-white items-center border-b border-slate-800">
              {/* Brand Title Cell */}
              <div className="p-4 border-r border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-md">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white font-manrope leading-tight">
                    {COMPARISON_DATA.classConnect.name}
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">
                    {COMPARISON_DATA.classConnect.tagline}
                  </span>
                </div>
              </div>

              {/* Feature Cells */}
              {COMPARISON_DATA.classConnect.cells.map((val, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 text-center text-xs font-bold text-white leading-snug flex flex-col items-center justify-center gap-1.5 min-h-[80px] ${
                    idx < COMPARISON_DATA.classConnect.cells.length - 1 ? 'border-r border-slate-800' : ''
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{val}</span>
                </div>
              ))}
            </div>

            {/* ROW 2: Online Courses (Clean White Row) */}
            <div className="grid grid-cols-8 bg-white text-slate-800 items-center border-b border-slate-200">
              {/* Brand Title Cell */}
              <div className="p-4 border-r border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
                  <Laptop className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-manrope leading-tight">
                    {COMPARISON_DATA.onlinePlatforms.name}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-medium">{COMPARISON_DATA.onlinePlatforms.tagline}</span>
                </div>
              </div>

              {/* Feature Cells */}
              {COMPARISON_DATA.onlinePlatforms.cells.map((val, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 text-center text-xs font-medium text-slate-600 leading-snug flex flex-col items-center justify-center gap-1.5 min-h-[80px] ${
                    idx < COMPARISON_DATA.onlinePlatforms.cells.length - 1 ? 'border-r border-slate-200' : ''
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200 shrink-0">
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>{val}</span>
                </div>
              ))}
            </div>

            {/* ROW 3: Offline Schools (Light Slate Row) */}
            <div className="grid grid-cols-8 bg-slate-50/60 text-slate-800 items-center">
              {/* Brand Title Cell */}
              <div className="p-4 border-r border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
                  <School className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 font-manrope leading-tight">
                    {COMPARISON_DATA.offlineInstitutes.name}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-medium">{COMPARISON_DATA.offlineInstitutes.tagline}</span>
                </div>
              </div>

              {/* Feature Cells */}
              {COMPARISON_DATA.offlineInstitutes.cells.map((val, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 text-center text-xs font-medium text-slate-600 leading-snug flex flex-col items-center justify-center gap-1.5 min-h-[80px] ${
                    idx < COMPARISON_DATA.offlineInstitutes.cells.length - 1 ? 'border-r border-slate-200' : ''
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200 shrink-0">
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>{val}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
