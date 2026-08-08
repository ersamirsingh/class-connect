import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ChevronDown, 
  HelpCircle, 
  Quote, 
  Sparkles,
  MessageSquare
} from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Arjun Mehta',
    role: 'Frontend Engineer @ Swiggy',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    quote: 'ClassConnect\'s bilingual Hindi & English visual learning made complex React & Next.js 15 concepts crystal clear. Landed my first developer role in 3 months!',
    rating: 5
  },
  {
    id: 2,
    name: 'Ananya Sharma',
    role: 'UI/UX Designer @ CRED',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    quote: 'The Figma motion design system and hands-on portfolio projects are top-notch. Best learning OS built for real-world skill builders.',
    rating: 5
  },
  {
    id: 3,
    name: 'Rohan Verma',
    role: 'Full-Stack Lead @ Razorpay',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    quote: 'I\'ve tried many platforms, but ClassConnect stands out with its attention to visual detail, bilingual clarity, and verifiable certificates.',
    rating: 5
  },
  {
    id: 4,
    name: 'Kavita Patel',
    role: 'AI Engineer @ SaaS Startup',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    quote: 'From zero Python knowledge to building custom LLM AI agents. The bilingual explanations and 24/7 community support are a total game changer!',
    rating: 5
  }
];

const FAQS = [
  {
    id: 1,
    question: "Do I get full lifetime access?",
    answer: "Yes! Once you enroll in a course, you receive full lifetime access to all video lessons, project code repositories, live class recordings, and future course updates."
  },
  {
    id: 2,
    question: "Are the courses taught in Hindi or English?",
    answer: "Our courses feature a bilingual learning system — key technical terms are explained in English, with step-by-step practical walk-throughs in clear Hindi and English."
  },
  {
    id: 3,
    question: "Do you provide verifiable certificates upon completion?",
    answer: "Absolutely! Upon finishing all lessons and submitting course projects, you will receive a QR-verifiable certificate that can be shared on LinkedIn and your resume."
  },
  {
    id: 4,
    question: "Can I access the platform on my mobile phone?",
    answer: "Yes, ClassConnect is fully optimized for mobile devices, tablets, and desktops so you can learn on the go anywhere, anytime."
  },
  {
    id: 5,
    question: "What is your refund policy?",
    answer: "We offer a hassle-free 7-day money-back guarantee. If you're not completely satisfied with the course, you can request a 100% refund within the first 7 days."
  }
];

export function MergedTestimonialsFaqSection({ cmsData, faqCmsData }) {
  const testimonialsList = cmsData?.data?.items || [];
  const faqList = faqCmsData?.data?.items || cmsData?.data?.faqs || [];

  if ((!cmsData || !cmsData.isActive) && (!faqCmsData || !faqCmsData.isActive)) return null;
  if (testimonialsList.length === 0 && faqList.length === 0) return null;

  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6 lg:px-[var(--space-page)] bg-[var(--surface)] relative overflow-hidden">
      
      {/* Background Soft Aura Gradients */}
      <div className="pointer-events-none absolute top-1/4 left-10 w-96 h-96 rounded-full bg-[var(--aura-violet)] filter blur-[120px] opacity-40" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[var(--aura-blue)] filter blur-[120px] opacity-40" />

      <div className="max-w-[var(--max-width)] mx-auto relative z-10">
        
        {/* Main 2-Column Side-by-Side Merged Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Student Comments / Loved Stories (Matching Screenshot 1) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header Badge & Title */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3 border border-indigo-100 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Student Loved Stories
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-slate-900 tracking-tight leading-tight mb-2">
                Loved by <span className="text-indigo-600">10,000+</span> skill builders
              </h2>
              <p className="text-sm text-slate-600 font-normal">
                Real stories from learners who transformed their careers with ClassConnect.
              </p>
            </div>

            {/* Testimonials 2x2 Grid of Borderless Depth Edge Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {testimonialsList.map((t, idx) => (
                <motion.div
                  key={t.id || idx}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-5 relative borderless shadow-[0_10px_30px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Faded Quote Watermark */}
                  <div className="absolute top-4 right-4 text-slate-200 pointer-events-none select-none font-serif text-4xl font-bold leading-none">
                    ”
                  </div>

                  {/* Quote Text */}
                  <p className="text-xs text-slate-700 leading-relaxed italic mb-4 relative z-10">
                    "{t.quote}"
                  </p>

                  {/* Student Footer Details */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'} 
                        alt={t.name} 
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-50 shadow-xs"
                      />
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 font-manrope leading-tight">
                          {t.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {t.role}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

          {/* RIGHT COLUMN: Frequently Asked Questions (Matching Screenshot 2) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header Badge & Title */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3 border border-indigo-100 shadow-xs">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                Help Center
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-slate-900 tracking-tight leading-tight mb-2">
                Frequently Asked <span className="text-indigo-600">Questions</span>
              </h2>
              <p className="text-sm text-slate-600 font-normal">
                Quick answers to common questions about courses, lifetime access, and support.
              </p>
            </div>

            {/* Accordion FAQ Borderless Depth Cards */}
            <div className="space-y-3">
              {faqList.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;

                return (
                  <motion.div
                    key={faq.id}
                    layout
                    className="bg-white rounded-2xl borderless shadow-[0_8px_24px_-6px_rgba(0,0,0,0.05)] hover:shadow-[0_14px_32px_-8px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="font-extrabold text-sm font-manrope text-slate-900 leading-snug">
                        {faq.question}
                      </span>
                      
                      {/* Pill Arrow Icon Circle */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                        isOpen ? 'bg-indigo-600 text-white rotate-180' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      }`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
