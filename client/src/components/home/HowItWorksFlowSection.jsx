import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function HowItWorksFlowSection() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const steps = [
    {
      id: 'step-1',
      title: isHindi ? '1. कोर्स खोजें' : '1. Explore Courses',
      desc: isHindi
        ? 'वेब, मोबाइल, एआई और यूआई/यूक्स में अपनी पसंद का स्किल ट्रैक चुनें।'
        : 'Browse curated skill tracks in Web, Mobile, AI & Design built by industry experts.',
      icon: Search,
      bgColor: 'bg-gradient-to-br from-[#9333EA] to-[#7C3AED]',
      shadowColor: 'shadow-[0_16px_36px_rgba(147,51,234,0.35)]',
      dotColorLeft: 'bg-[#9333EA]',
      dotColorRight: 'bg-[#06B6D4]',
    },
    {
      id: 'step-2',
      title: isHindi ? '2. सीखें और बनाएं' : '2. Learn & Build',
      desc: isHindi
        ? 'हिंदी और अंग्रेजी में विजुअल लेसन देखें और रियल-वर्ल्ड प्रोजेक्ट्स बनाएं।'
        : 'Watch visual bilingual lessons in Hindi & English while building real-world projects.',
      icon: Sparkles,
      bgColor: 'bg-gradient-to-br from-[#06B6D4] to-[#0284C7]',
      shadowColor: 'shadow-[0_16px_36px_rgba(6,182,212,0.35)]',
      dotColorLeft: 'bg-[#06B6D4]',
      dotColorRight: 'bg-[#F472B6]',
    },
    {
      id: 'step-3',
      title: isHindi ? '3. सर्टिफिकेट पाएं' : '3. Get Certified',
      desc: isHindi
        ? 'सत्यापन योग्य सर्टिफिकेट प्राप्त करें और अपना करियर आगे बढ़ाएं।'
        : 'Receive verifiable skill certificates, build a portfolio, and launch your tech career.',
      icon: Award,
      bgColor: 'bg-gradient-to-br from-[#F472B6] to-[#DB2777]',
      shadowColor: 'shadow-[0_16px_36px_rgba(244,114,182,0.35)]',
      dotColorLeft: 'bg-[#F472B6]',
      dotColorRight: 'bg-[#9333EA]',
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[var(--surface)] relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-manrope text-[var(--ink)] tracking-tight mb-12 sm:mb-20">
          3 Steps To <span className="font-cursive font-normal text-purple-600 text-4xl sm:text-5xl md:text-6xl">Master High-Income</span> Skills
        </h2>

        {/* 3 Step Nodes Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative items-start">
          {steps.map((step, index) => {
            const IconComp = step.icon;
            return (
              <div key={step.id} className="relative flex flex-col items-center group">
                {/* Horizontal Connector Dotted Line with Glowing Endpoint Dots (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-center absolute top-10 left-[60%] w-[80%] z-0 pointer-events-none">
                    <div className={`w-2.5 h-2.5 rounded-full ${step.dotColorLeft} shadow-md shrink-0`} />
                    <div className="w-full border-t-2 border-dashed border-indigo-200 dark:border-indigo-800/60 mx-1.5" />
                    <div className={`w-2.5 h-2.5 rounded-full ${step.dotColorRight} shadow-md shrink-0`} />
                  </div>
                )}

                {/* Vertical Connector Line for Mobile */}
                {index < steps.length - 1 && (
                  <div className="flex md:hidden flex-col items-center absolute top-[80px] left-1/2 -translate-x-1/2 h-[50px] z-0 pointer-events-none">
                    <div className="h-full border-l-2 border-dashed border-indigo-300 dark:border-indigo-700" />
                  </div>
                )}

                {/* Soft Glowing Colored Icon Tile */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  whileInView={{ scale: 1, opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ scale: 1.08, y: -6 }}
                  className={`relative z-10 w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl ${step.bgColor} ${step.shadowColor} flex items-center justify-center text-white mb-6 sm:mb-8 transition-transform duration-300`}
                >
                  <IconComp className="w-8 h-8 sm:w-11 sm:h-11 stroke-[2]" />
                </motion.div>

                {/* Step Title & Subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.1 }}
                  className="max-w-xs text-center px-2"
                >
                  <h3 className="text-base sm:text-xl font-bold font-manrope text-[var(--ink)] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--ink-muted)] font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksFlowSection;
