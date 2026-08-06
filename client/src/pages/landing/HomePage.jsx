import React from 'react';
import { FloatingNav } from '../../components/layout/FloatingNav';
import { Footer } from '../../components/guest/Footer';
import { ImageSequenceHero } from '../../components/motion/ImageSequenceHero';
import { RedParticleCursor } from '../../components/motion/RedParticleCursor';
import { PlatformPulseCrawler } from '../../components/motion/PlatformPulseCrawler';
import { RedlineCourseCardPrototype } from '../../components/courses/RedlineCourseCardPrototype';
import { RedlineGlow } from '../../components/motion/RedlineGlow';
import { ShimmerButton } from '../../components/motion/ShimmerButton';

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F7F7F5] overflow-x-hidden selection:bg-[#9F1018] selection:text-white">
      {/* Desktop Red Particle Cursor Effect */}
      <RedParticleCursor />

      {/* Floating Translucent Glass Navigation */}
      <FloatingNav />

      {/* Signature Scroll-Driven 240-Frame Hero */}
      <ImageSequenceHero />

      {/* Platform Pulse Metric Crawler Section */}
      <PlatformPulseCrawler />

      {/* Milestone 1 Prototype Course Card Showcase Section */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto">
        <RedlineGlow position="center" intensity="medium">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF4D3D] block mb-2">
                FEATURED LEARNING TRACK PROTOTYPE
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-light text-[#F7F7F5]">
                Curated for <span className="text-[#FF2A2A] font-normal">high-performance engineers.</span>
              </h2>
            </div>
            <ShimmerButton href="/courses" variant="outline">
              View All Tracks →
            </ShimmerButton>
          </div>

          {/* Prototype Course Card Component */}
          <RedlineCourseCardPrototype />
        </RedlineGlow>
      </section>

      {/* Cinematic Footer */}
      <Footer />
    </div>
  );
}
