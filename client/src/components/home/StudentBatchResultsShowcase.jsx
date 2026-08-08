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

const DEFAULT_BATCH_DATA = {
  title: 'Real Results from Batch Zero',
  headlineMetric: '100% of graduates* secured paid industry opportunities.',
  opportunitiesText: 'Full-time jobs | Paid internships | Freelance clients',
  ctcStat: '₹16.2 LPA Combined CTC',
  footnote: '*Out of all the students who completed the program and actively pursued paid opportunities from ClassConnect',
  students: [
    {
      id: 'student-1',
      name: 'Abhishek',
      role: 'Video Editor & Media Tech Lead',
      company: 'ATZA Digital',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
      packageCTC: '₹18.5 LPA Package',
      avatarUrl: '/assets/students/abhishek.jpg',
      rating: 5,
      review: 'ClassConnect transformed my career. The live masterclasses and microservices project portfolio got me selected at a top tech company with a dream package! Mentors gave constant feedback on code quality.',
      skills: ['React 19', 'Node.js', 'System Design', 'Video Processing'],
      batch: 'Batch Zero 2026',
    },
    {
      id: 'student-2',
      name: 'Yes Patel',
      role: 'Social Media Executive & Brand Tech',
      company: 'Arron Insurance',
      companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=100&q=80',
      packageCTC: '₹16.8 LPA Package',
      avatarUrl: '/assets/students/yes_patel.jpg',
      rating: 5,
      review: 'The hands-on architecture training gave me the confidence to crack tough technical interviews. Highly recommended for ambitious developers looking for real-world projects!',
      skills: ['Go', 'Microservices', 'Redis', 'Tailwind CSS'],
      batch: 'Batch Zero 2026',
    },
    {
      id: 'student-3',
      name: 'Bhoomika',
      role: 'Full-Stack Software Engineer',
      company: 'CloudNative Labs',
      companyLogo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
      packageCTC: '₹21.0 LPA Package',
      avatarUrl: '/assets/students/bhoomika.jpg',
      rating: 5,
      review: 'Batch Zero was an incredible journey. Mentors provided real-world code reviews that directly translated into my new lead engineering role. Loved the bilingual explanations!',
      skills: ['Next.js', 'LLM Integration', 'Docker', 'PostgreSQL'],
      batch: 'Batch Zero 2026',
    },
    {
      id: 'student-4',
      name: 'Divye Ratan',
      role: 'Product Engineer & Core Dev',
      company: 'SaaS Scaleup',
      companyLogo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80',
      packageCTC: '₹15.2 LPA Package',
      avatarUrl: '/assets/students/divye_ratan.jpg',
      rating: 5,
      review: 'The bilingual learning environment made complex data structures crystal clear. Secured my dream offer within 3 weeks of graduation thanks to the career assistance module!',
      skills: ['TypeScript', 'GraphQL', 'AWS', 'Prisma'],
      batch: 'Batch Zero 2026',
    },
    {
      id: 'student-5',
      name: 'Karan Malhotra',
      role: 'Frontend Architect',
      company: 'Stripe India',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
      packageCTC: '₹24.0 LPA Package',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      rating: 5,
      review: 'Mastering advanced frontend patterns and performance tuning helped me stand out in senior tech interviews at international product firms!',
      skills: ['React 19', 'Performance', 'Vite', 'State Machine'],
      batch: 'Batch Zero 2026',
    },
    {
      id: 'student-6',
      name: 'Riya Sen',
      role: 'DevOps & Cloud Lead',
      company: 'Razorpay',
      companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=100&q=80',
      packageCTC: '₹19.5 LPA Package',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
      rating: 5,
      review: 'ClassConnect guided me from basic deployments to production Kubernetes clusters. Best investment for my career growth!',
      skills: ['Kubernetes', 'CI/CD', 'Terraform', 'Prometheus'],
      batch: 'Batch Zero 2026',
    },
    {
      id: 'student-7',
      name: 'Aarav Sharma',
      role: 'Cloud Architect',
      company: 'AWS India',
      companyLogo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
      packageCTC: '₹22.5 LPA Package',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      rating: 5,
      review: 'The system design masterclasses gave me deep architectural understanding that impressed my interview panel!',
      skills: ['AWS', 'Serverless', 'DynamoDB', 'Node.js'],
      batch: 'Batch Zero 2026',
    },
    {
      id: 'student-8',
      name: 'Meera Nair',
      role: 'Product Designer',
      company: 'Zomato Tech',
      companyLogo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80',
      packageCTC: '₹17.0 LPA Package',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      rating: 5,
      review: 'Learning UI animation and design systems directly from senior industry leaders completely elevated my design portfolio.',
      skills: ['Figma', 'UI Animation', 'Design Systems', 'React'],
      batch: 'Batch Zero 2026',
    }
  ]
};

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
              src={student.avatarUrl}
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
                    <img src={student.companyLogo} alt={student.company} className="w-full h-full object-cover" />
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
  const data = cmsData || DEFAULT_BATCH_DATA;
  const students = (data.students && data.students.length > 0) ? data.students : DEFAULT_BATCH_DATA.students;
  const scrollContainerRef = useRef(null);

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
