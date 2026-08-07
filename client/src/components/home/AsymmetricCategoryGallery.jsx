import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Code, Brain, Layout, Server, Star, CheckCircle2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AsymmetricCategoryGallery = () => {
  const [hoveredTrackId, setHoveredTrackId] = useState(null);

  const tracks = [
    {
      id: 'fullstack',
      title: 'Full-Stack Systems Architecture',
      subtitle: 'React 19, Node microservices, PostgreSQL, and Redis caching.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      icon: Code,
      slug: 'fullstack-web-development',
      colSpan: 'lg:col-span-8',
      tag: 'POPULAR TRACK',
      instructor: 'Samir Singh',
      rating: 4.9,
      price: '₹1,499',
      modules: ['React 19 Server Actions', 'Node.js Microservices', 'PostgreSQL & Prisma', 'Redis Caching & Scale'],
    },
    {
      id: 'ai-engineering',
      title: 'AI Systems & LLM Integration',
      subtitle: 'RAG pipelines, LangChain, PyTorch, and Vector DBs.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
      icon: Brain,
      slug: 'ai-engineering-and-llms',
      colSpan: 'lg:col-span-4',
      tag: 'NEW TRACK',
      instructor: 'Rohan Verma',
      rating: 5.0,
      price: '₹2,499',
      modules: ['RAG Pipeline Architecture', 'Vector DBs (Pinecone)', 'LangChain AI Agents', 'PyTorch Fine-Tuning'],
    },
    {
      id: 'ui-ux',
      title: 'UI/UX & Product Design System',
      subtitle: 'Figma design tokens, micro-interactions, and accessibility.',
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80',
      icon: Layout,
      slug: 'uiux-design-masterclass',
      colSpan: 'lg:col-span-5',
      tag: 'DESIGN TRACK',
      instructor: 'Priya Patel',
      rating: 4.8,
      price: '₹1,299',
      modules: ['Figma Design Tokens', 'Micro-Interactions (Framer)', 'Dark Mode Aesthetics', '3D Web Canvas'],
    },
    {
      id: 'devops',
      title: 'Cloud DevOps & Kubernetes',
      subtitle: 'Docker containers, AWS infra, CI/CD, and Terraform.',
      image: 'https://images.unsplash.com/photo-1667372335854-c072535a7ce9?auto=format&fit=crop&w=800&q=80',
      icon: Server,
      slug: 'cloud-devops-and-kubernetes',
      colSpan: 'lg:col-span-7',
      tag: 'INFRASTRUCTURE',
      instructor: 'Sneha Gupta',
      rating: 4.9,
      price: '₹1,999',
      modules: ['Docker Containerization', 'Kubernetes Ingress & Pods', 'GitHub Actions CI/CD', 'Terraform Cloud IaC'],
    },
  ];

  return (
    <section className="relative py-24 px-6 max-w-7xl mx-auto border-t border-white/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
        <div>
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#C1FBD4]/10 border border-[#C1FBD4]/30 text-[#C1FBD4] font-mono text-xs uppercase tracking-widest mb-3">
            TECHNICAL DOMAINS
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-light text-[#F7F7F5]">
            Asymmetric <span className="text-[#C1FBD4] font-normal">learning tracks.</span>
          </h2>
        </div>
        <p className="font-body text-sm text-[#A1A1AA] max-w-md">
          Hover over any track card to inspect detailed curriculum modules, instructor ratings, and course details.
        </p>
      </div>

      {/* Asymmetric Image Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {tracks.map((track) => {
          const IconComp = track.icon;
          const isHovered = hoveredTrackId === track.id;

          return (
            <div
              key={track.id}
              onMouseEnter={() => setHoveredTrackId(track.id)}
              onMouseLeave={() => setHoveredTrackId(null)}
              className={`${track.colSpan} relative min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden bg-[#0B0B0D] border border-white/10 hover:border-[#C1FBD4]/70 transition-all duration-500 shadow-2xl flex flex-col justify-end p-8`}
            >
              {/* Full Bleed Image */}
              <img
                src={track.image}
                alt={track.title}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                  isHovered ? 'scale-110 opacity-40 blur-[2px]' : 'scale-100 opacity-70'
                }`}
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/60 to-transparent opacity-90" />

              {/* Floating Top Left Tag */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#C1FBD4] uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                  <IconComp className="w-3.5 h-3.5 text-[#C1FBD4]" />
                  {track.tag}
                </span>
              </div>

              {/* Top Right Action Pill */}
              <Link
                to={`/category/${track.slug}`}
                className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[#C1FBD4] hover:text-black transition-all duration-300"
              >
                <ArrowUpRight className="w-5 h-5" />
              </Link>

              {/* Standard Base Content */}
              <div className={`relative z-10 space-y-2 transition-opacity duration-300 ${isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <h3 className="font-display text-2xl sm:text-3xl font-light text-[#F7F7F5] leading-snug">
                  {track.title}
                </h3>
                <p className="font-body text-xs sm:text-sm text-[#A1A1AA] line-clamp-2 max-w-xl leading-relaxed">
                  {track.subtitle}
                </p>
              </div>

              {/* Animated Hover Popup Detailed Overlay */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 z-30 p-8 bg-[#0B0B0D]/95 backdrop-blur-xl flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <span className="font-mono text-[10px] text-[#C1FBD4] uppercase tracking-widest block">
                            CURRICULUM BREAKDOWN
                          </span>
                          <h4 className="font-display text-2xl font-light text-white">
                            {track.title}
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="font-display text-2xl font-normal text-[#C1FBD4]">
                            {track.price}
                          </span>
                        </div>
                      </div>

                      {/* Key Modules List */}
                      <div className="space-y-2">
                        <span className="font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider block">
                          Key Production Modules:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {track.modules.map((mod, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-mono text-white bg-[#141416] p-2.5 rounded-xl border border-white/5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#C1FBD4] shrink-0" />
                              <span className="truncate">{mod}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono text-xs text-[#A1A1AA]">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-white font-bold">{track.rating}</span>
                        <span>({track.instructor})</span>
                      </div>

                      <Link
                        to={`/category/${track.slug}`}
                        className="px-6 py-2.5 rounded-full bg-[#C1FBD4] text-black font-mono text-xs font-semibold hover:bg-[#a3f7be] transition-colors flex items-center gap-1.5 shadow-lg"
                      >
                        <span>Explore & Enrol</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AsymmetricCategoryGallery;
