import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function GravityTestimonialsSection() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const testimonials = [
    {
      id: 'test-1',
      quote: isHindi 
        ? 'क्लासकनेक्ट का द्विभाषी हिंदी और अंग्रेजी तरीका बहुत ही शानदार है। React और Next.js 15 के जटिल टॉपिक आसानी से समझ आ गए!'
        : "ClassConnect's bilingual Hindi & English visual learning made complex React & Next.js 15 concepts crystal clear. Landed my first developer role in 3 months!",
      name: 'Arjun Mehta',
      role: 'Frontend Engineer @ Swiggy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      tiltDegree: -3,
      gravityDropY: 18,
    },
    {
      id: 'test-2',
      quote: isHindi
        ? 'Figma मोशन डिजाइन और हैंड्स-ऑन प्रोजेक्ट्स बहुत ही बेहतरीन हैं। स्किल डेवलपर्स के लिए यह बेस्ट प्लेटफॉर्म है।'
        : "The Figma motion design system and hands-on portfolio projects are top-notch. Best learning OS built for real-world skill builders.",
      name: 'Ananya Sharma',
      role: 'UI/UX Designer @ CRED',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      tiltDegree: 3,
      gravityDropY: 16,
    },
    {
      id: 'test-3',
      quote: isHindi
        ? 'मैंने कई प्लेटफॉर्म ट्राई किए, लेकिन क्लासकनेक्ट की हिंदी+इंग्लिश स्पष्टता और प्रोजेक्ट्स का कोई मुकाबला नहीं है।'
        : "I've tried many platforms, but ClassConnect stands out with its attention to visual detail, bilingual clarity, and verifiable certificates.",
      name: 'Rohan Verma',
      role: 'Fullstack Developer @ Razorpay',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      tiltDegree: -5,
      gravityDropY: 24,
    },
    {
      id: 'test-4',
      quote: isHindi
        ? 'जीरो पायथन से शुरुआत करके खुद के AI एजेंट्स बनाने तक की यात्रा बहुत ही स्मूथ रही। मेंटॉर सपोर्ट 24/7 मिलता है!'
        : "From zero Python knowledge to building custom LLM AI agents. The bilingual explanations and 24/7 community support are a total game changer!",
      name: 'Kavita Patel',
      role: 'AI Engineer @ Flipkart',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      rating: 5,
      tiltDegree: 4,
      gravityDropY: 20,
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-8 bg-[var(--canvas)] relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        {/* Section Header */}
        <div className="mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[var(--primary-soft)] text-[var(--primary)] mb-4 border border-[var(--primary)]/15">
            <Sparkles className="w-3.5 h-3.5" />
            {isHindi ? 'विद्यार्थियों का अनुभव' : 'Student Loved Stories'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-manrope text-[var(--ink)] tracking-tight mb-4">
            {isHindi ? 'हमारे विद्यार्थी क्या कहते हैं' : 'Loved by 10,000+ skill builders'}
          </h2>
          <p className="text-base sm:text-lg text-[var(--ink-muted)] max-w-xl mx-auto">
            {isHindi 
              ? 'देखें कैसे हमारे द्विभाषी विजुअल लर्निंग प्लेटफॉर्म ने हजारों विद्यार्थियों का करियर बदला।'
              : 'Real stories from learners who transformed their careers with ClassConnect.'}
          </p>
        </div>

        {/* Gravity Testimonials 2x2 Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative z-10">
          {testimonials.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ 
                rotate: item.tiltDegree, 
                y: item.gravityDropY, 
                scale: 1.03,
                zIndex: 40,
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 18 
              }}
              className="relative p-7 sm:p-8 rounded-[28px] bg-[var(--surface)] border-2 border-[var(--border)] shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_24px_50px_rgba(67,56,242,0.18)] hover:border-[var(--primary)]/60 text-left transition-all flex flex-col justify-between cursor-pointer group"
            >
              {/* Quote Icon Background Detail */}
              <Quote className="absolute right-6 top-6 w-12 h-12 text-[var(--ink-faint)]/20 pointer-events-none group-hover:text-[var(--primary)]/20 transition-colors" />

              {/* Quote Body */}
              <p className="text-sm sm:text-base text-[var(--ink)] font-medium leading-relaxed mb-8 relative z-10">
                "{item.quote}"
              </p>

              {/* Author Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] relative z-10">
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[var(--primary)]/30 group-hover:border-[var(--primary)] transition-colors shadow-sm"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs font-medium text-[var(--ink-muted)]">
                      {item.role}
                    </p>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--accent)] text-[var(--accent)]" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GravityTestimonialsSection;
