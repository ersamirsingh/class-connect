import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Loader2, ArrowRight, Compass } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { categoryApi } from '../../api/models/category.api';
import { SpotlightCard } from '../../components/motion/SpotlightCard';
import { TextEffect } from '../../components/motion/TextEffect';
import { InView } from '../../components/motion/InView';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';

export function CategoryListPage() {
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isHindi = language === 'hi';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getCategories();
        const loadedCats = Array.isArray(res.data)
          ? res.data
          : (res.data?.categories || (Array.isArray(res) ? res : []));
        setCategories(loadedCats);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const gradients = [
    'from-blue-500/10 to-indigo-500/10 text-indigo-600',
    'from-emerald-500/10 to-teal-500/10 text-teal-600',
    'from-orange-500/10 to-red-500/10 text-orange-600',
    'from-purple-500/10 to-pink-500/10 text-purple-600',
    'from-cyan-500/10 to-blue-500/10 text-cyan-600',
    'from-yellow-500/10 to-orange-500/10 text-yellow-600',
  ];

  return (
    <div className="min-h-screen bg-[var(--canvas)] flex flex-col font-sans">
      <FloatingNav />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center p-3 bg-[var(--surface)] rounded-full shadow-[var(--shadow-sm)] mb-6 border border-[var(--border)]">
              <Compass className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <InView>
              <TextEffect 
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--ink)] mb-6 tracking-tight"
              >
                {isHindi ? "श्रेणियाँ ब्राउज़ करें" : "Browse Categories"}
              </TextEffect>
              <p className="text-lg md:text-xl text-[var(--ink-muted)] max-w-2xl mx-auto">
                {isHindi 
                  ? "विभिन्न विषयों में ज्ञान खोजें और वह कोर्स चुनें जो आपके लिए सही हो।"
                  : "Discover knowledge across diverse fields and find the perfect path for your growth."}
              </p>
            </InView>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-[var(--surface)] rounded-[var(--radius-lg)] h-48 border border-[var(--border)]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {categories.map((category, index) => {
                  const gradientClass = gradients[index % gradients.length];
                  const [bgGrad, textColor] = gradientClass.split(' text-');
                  
                  return (
                    <motion.div
                      key={category._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link to={`/courses?category=${category.slug}`} className="block h-full group">
                        <SpotlightCard className="h-full bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all overflow-hidden p-8 flex flex-col justify-between">
                          <div className="flex items-start justify-between mb-8">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${bgGrad} flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
                              <Layers className={`w-7 h-7 text-${textColor}`} />
                            </div>
                            <div className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center bg-[var(--canvas)] text-[var(--ink-muted)] group-hover:bg-[var(--primary)] group-hover:text-[var(--surface)] group-hover:border-[var(--primary)] transition-colors duration-300">
                              <ArrowRight className="w-5 h-5" />
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-2xl font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                              {category.name}
                            </h3>
                            <p className="text-[var(--ink-muted)] font-medium">
                              {category.courseCount !== undefined ? `${category.courseCount} Courses` : 'Explore courses'}
                            </p>
                          </div>
                        </SpotlightCard>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
