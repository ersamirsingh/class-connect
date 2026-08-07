import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { SpotlightCard } from '../motion/SpotlightCard';

export const EditorialLearnerGallery = () => {
  const stories = [
    {
      name: 'Aarav Sharma',
      role: 'Full-Stack Engineer',
      company: 'TechCorp Systems',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      quote: 'ClassConnect transformed how I build software. The visual course breakdown and hands-on systems architecture gave me the confidence to crack senior engineering roles.',
      track: 'Full-Stack Systems Architecture',
      rating: 5,
    },
    {
      name: 'Priya Patel',
      role: 'Product Designer',
      company: 'Design Studio',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      quote: 'The bilingual masterclasses (Hindi + English) explained complex UI systems with unprecedented clarity. The portfolio projects made my resume stand out instantly.',
      track: 'UI/UX Design Masterclass',
      rating: 5,
    },
    {
      name: 'Rohan Verma',
      role: 'AI Engineer',
      company: 'Cloud Scale AI',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      quote: 'Verifiable digital certificates and 24/7 code help gave me real production confidence. Best investment I made in my tech career.',
      track: 'AI Systems & LLM Integration',
      rating: 5,
    },
  ];

  return (
    <section className="relative py-28 px-6 max-w-7xl mx-auto border-t border-white/10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="inline-block px-3.5 py-1 rounded-full bg-[#C1FBD4]/10 border border-[#C1FBD4]/30 text-[#C1FBD4] font-mono text-xs uppercase tracking-widest mb-3">
          LEARNER SUCCESS STORIES
        </span>
        <h2 className="font-display text-4xl sm:text-6xl font-light text-[#F7F7F5]">
          Editorial proof from <span className="text-[#C1FBD4] font-normal">active graduates.</span>
        </h2>
      </div>

      {/* Editorial Portrait Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stories.map((story, idx) => (
          <SpotlightCard key={idx} className="p-8 flex flex-col justify-between h-[460px] bg-[#0B0B0D] border border-white/10">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-[#C1FBD4]/40" />
              </div>

              <p className="font-body text-sm sm:text-base text-[#F7F7F5] leading-relaxed italic mb-6">
                "{story.quote}"
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center gap-4">
              <img
                src={story.avatar}
                alt={story.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#C1FBD4]/40 shrink-0"
              />
              <div className="space-y-0.5">
                <h4 className="font-display text-lg font-medium text-white flex items-center gap-1.5">
                  {story.name}
                  <CheckCircle2 className="w-4 h-4 text-[#C1FBD4]" />
                </h4>
                <p className="font-mono text-xs text-[#A1A1AA]">{story.role} • {story.company}</p>
                <span className="inline-block font-mono text-[10px] text-[#C1FBD4] uppercase tracking-wider">
                  {story.track}
                </span>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
};

export default EditorialLearnerGallery;
