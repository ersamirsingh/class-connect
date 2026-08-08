import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  Headphones, 
  Maximize2, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  UserCheck, 
  Quote,
  Star,
  CheckCircle2,
  TrendingUp,
  Search,
  Type
} from 'lucide-react';
import { cdnImg } from '../../utils/cdnImg';



export function StudentVideoTestimonialsSection({ cmsData }) {
  const testimonialsList = cmsData?.data?.items || [];
  if (!cmsData || !cmsData.isActive || testimonialsList.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const rawTestimonial = testimonialsList[currentIndex] || testimonialsList[0] || VIDEO_TESTIMONIALS[0];
  const currentTestimonial = {
    ...rawTestimonial,
    avatarStack: rawTestimonial.avatarStack || [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
    ]
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? testimonialsList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev === testimonialsList.length - 1 ? 0 : prev + 1));
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section className="py-20 px-6 lg:px-[var(--space-page)] bg-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Main Light Rounded Card Container (Matching Reference Screenshot Exactly) */}
        <div className="relative bg-[#F4F4F7] rounded-[36px] p-8 md:p-14 border border-slate-200 shadow-xl overflow-hidden min-h-[560px] flex flex-col justify-between">
          
          {/* Top Pill Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-slate-800 text-xs font-extrabold shadow-sm border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Student Video Stories</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* LEFT COLUMN: Title & Floating Customer Satisfaction Stat Badge */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Floating Customer Satisfaction / Salary Hike Badge (Matching Screenshot) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={`stat-${currentTestimonial.id}`}
                className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 max-w-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2 overflow-hidden">
                    {currentTestimonial.avatarStack.map((url, i) => (
                      <img key={i} src={url} alt="Learner" className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-extrabold text-base text-slate-900 leading-tight">
                      {currentTestimonial.hikeStat}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Career Growth & Salary Increase
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Main Headline */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-slate-900 tracking-tight leading-tight mb-3">
                  Watch Real <span className="text-indigo-600">Video Reviews</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Seamless integration ensures that learners experience real face-to-face mentorship and career transformation.
                </p>
              </div>

              {/* Student Quote */}
              <div className="p-4 rounded-2xl bg-white/80 border border-slate-200 text-xs italic text-slate-700 font-medium">
                "{currentTestimonial.quote}"
              </div>
            </div>

            {/* CENTER COLUMN: Mobile Portrait Video Player Card (Matching Reference Screenshot) */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-[280px] sm:w-[300px] h-[480px] rounded-[30px] overflow-hidden shadow-2xl bg-slate-950 border-4 border-white group">
                
                {/* Video Top Controls Overlay */}
                <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center text-xs font-bold border border-white/20">
                    <Type className="w-4 h-4" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center text-xs font-bold border border-white/20">
                    <Headphones className="w-4 h-4" />
                  </div>
                </div>

                {/* HTML5 Video Element */}
                <video
                  ref={videoRef}
                  src={cdnImg(currentTestimonial.videoUrl)}
                  poster={currentTestimonial.posterUrl}
                  playsInline
                  muted={isMuted}
                  loop
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={togglePlay}
                />

                {/* Center Big Play / Pause Button Overlay */}
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                  <button
                    onClick={togglePlay}
                    className={`w-14 h-14 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 shadow-xl border border-white/30 pointer-events-auto cursor-pointer ${
                      isPlaying ? 'opacity-0 group-hover:opacity-100 scale-90' : 'opacity-100 scale-100'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                  </button>
                </div>

                {/* Video Bottom Details Overlay */}
                <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm font-manrope">{currentTestimonial.studentName}</h4>
                      <p className="text-[11px] text-gray-300 font-medium">{currentTestimonial.role}</p>
                    </div>

                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors cursor-pointer"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: Floating Feature Badges & Control Action Buttons */}
            <div className="lg:col-span-4 space-y-6 flex flex-col items-start lg:items-end">
              
              {/* Floating Face-to-Face Experience Badge (Matching Screenshot) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                key={`badge-${currentTestimonial.id}`}
                className="bg-white p-3.5 rounded-2xl shadow-md border border-slate-200 flex items-center gap-3 max-w-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900">
                    Face-to-Face Experience
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    1-on-1 Mentor Feedback
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons: Fullscreen & Filter */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleFullscreen}
                  className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-md text-slate-700 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
                  title="Fullscreen View"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-md text-slate-700 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
                  title="Audio Control"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Left / Right Slider Controls */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-md text-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                  aria-label="Previous Video"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {currentIndex + 1} / {VIDEO_TESTIMONIALS.length}
                </span>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-md text-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                  aria-label="Next Video"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
