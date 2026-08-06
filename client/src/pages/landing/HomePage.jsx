import React, { useState, useEffect } from 'react';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';
import { ImageSequenceHero } from '../../components/motion/ImageSequenceHero';
import { RedParticleCursor } from '../../components/motion/RedParticleCursor';
import { PlatformPulseCrawler } from '../../components/motion/PlatformPulseCrawler';
import { CourseCoverflow } from '../../components/motion/CourseCoverflow';
import { CategoryCraftDeck } from '../../components/home/CategoryCraftDeck';
import { courseApi } from '../../api/models/course.api';
import { categoryApi } from '../../api/models/category.api';
import { SAMPLE_CATEGORIES, SAMPLE_COURSES } from '../../data/sampleData';

export function HomePage() {
  const [categories, setCategories] = useState(SAMPLE_CATEGORIES);
  const [courses, setCourses] = useState(SAMPLE_COURSES);

  useEffect(() => {
    const loadData = async () => {
      try {
        const catRes = await categoryApi.getCategories();
        if (catRes?.data && Array.isArray(catRes.data)) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.warn('Fallback categories loaded');
      }

      try {
        const courseRes = await courseApi.getCourses();
        if (courseRes?.data && Array.isArray(courseRes.data)) {
          setCourses(courseRes.data);
        }
      } catch (err) {
        console.warn('Fallback courses loaded');
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-[#F7F7F5] overflow-x-hidden selection:bg-[#C1FBD4] selection:text-black">
      {/* Desktop Red Particle Cursor Effect */}
      <RedParticleCursor />

      {/* Floating Translucent Navigation */}
      <FloatingNav />

      {/* Signature Scroll-Driven 240-Frame Hero */}
      <ImageSequenceHero />

      {/* Platform Telemetry Pulse Crawler */}
      <PlatformPulseCrawler />

      {/* 3D Depth Course Coverflow Carousel Showcase */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-[#C1FBD4]/10 border border-[#C1FBD4]/30 text-[#C1FBD4] font-mono text-xs uppercase tracking-widest mb-3">
            EXPLORE FEATURED TRACKS
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-light text-[#F7F7F5]">
            Handcrafted for <span className="text-[#C1FBD4] font-normal">relentless builders.</span>
          </h2>
        </div>

        <CourseCoverflow courses={courses} />
      </section>

      {/* Category Craft Deck Section */}
      <CategoryCraftDeck categories={categories} />

      {/* Cinematic Footer */}
      <Footer />
    </div>
  );
}
