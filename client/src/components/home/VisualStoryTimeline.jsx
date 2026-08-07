import React from 'react';
import { ArrowUpRight, ShieldCheck, Play, Award, Zap } from 'lucide-react';
import { ShimmerButton } from '../motion/ShimmerButton';

export const VisualStoryTimeline = () => {
  const storySteps = [
    {
      number: '01',
      tag: 'CURATED TRACKS',
      title: 'Select your high-momentum learning track',
      desc: 'Skip generic tutorials. Dive directly into industry-standard codebases built by senior engineers at top tech companies.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      badge: '100% Practical Systems',
    },
    {
      number: '02',
      tag: 'INSTANT ACCESS',
      title: 'Frictionless, protected Razorpay checkout',
      desc: 'Enrolling takes seconds. One-click instant unlock with 256-bit SSL encrypted UPI, Card, and Netbanking options.',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      badge: '256-Bit SSL Protected',
    },
    {
      number: '03',
      tag: 'HANDS-ON STUDIO',
      title: 'Master real code with live interactive player',
      desc: 'Watch HD streaming lectures, submit live assignments, track progress, and get on-demand 24/7 code help from mentors.',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      badge: 'Adaptive Telemetry Player',
    },
    {
      number: '04',
      tag: 'CAREER ACCELERATION',
      title: 'Earn verifiable digital credentials',
      desc: 'Complete 100% of your track milestones and instantly receive an encrypted digital certificate to display on LinkedIn & resume.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      badge: 'Verifiable Credentials',
    },
  ];

  return (
    <section className="relative py-28 px-6 max-w-7xl mx-auto border-t border-white/10">
      {/* Section Header */}
      <div className="max-w-3xl mb-20">
        <span className="inline-block px-3.5 py-1 rounded-full bg-[#C1FBD4]/10 border border-[#C1FBD4]/30 text-[#C1FBD4] font-mono text-xs uppercase tracking-widest mb-4">
          THE LEARNING EXPERIENCE
        </span>
        <h2 className="font-display text-4xl sm:text-6xl font-light text-[#F7F7F5] leading-tight">
          How ClassConnect <span className="text-[#C1FBD4] font-normal">transforms your career.</span>
        </h2>
      </div>

      {/* Sequential Asymmetric Story Panels */}
      <div className="space-y-16">
        {storySteps.map((step, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={idx}
              className={`flex flex-col ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-10 lg:gap-16 p-8 sm:p-12 rounded-3xl bg-[#0B0B0D] border border-white/10 hover:border-[#C1FBD4]/40 transition-all duration-300`}
            >
              {/* Full-Bleed Media Side */}
              <div className="relative w-full lg:w-1/2 h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#141416] group shrink-0">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-transparent opacity-80" />

                {/* Step Number Overlay */}
                <div className="absolute top-4 left-4 font-mono text-4xl font-light text-white/40 drop-shadow">
                  {step.number}
                </div>

                {/* Floating Signal Badge */}
                <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono text-[#C1FBD4] flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#C1FBD4]" />
                  <span>{step.badge}</span>
                </div>
              </div>

              {/* Content Side */}
              <div className="flex-1 space-y-4">
                <span className="font-mono text-xs text-[#C1FBD4] uppercase tracking-widest block">
                  // STEP {step.number} • {step.tag}
                </span>

                <h3 className="font-display text-3xl sm:text-4xl font-light text-[#F7F7F5] leading-snug">
                  {step.title}
                </h3>

                <p className="font-body text-base text-[#A1A1AA] leading-relaxed">
                  {step.desc}
                </p>

                <div className="pt-4">
                  <ShimmerButton href="/courses" size="sm" variant="outline">
                    Explore Track <ArrowUpRight className="w-4 h-4 ml-1" />
                  </ShimmerButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default VisualStoryTimeline;
