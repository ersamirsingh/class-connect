import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radio, Users, Calendar, ArrowRight, Video, Sparkles } from 'lucide-react';

const liveSessions = [
  {
    id: 'live-1',
    status: 'LIVE NOW',
    isLiveNow: true,
    registered: '340 registered',
    title: 'Advanced React 19 & Server Components Masterclass',
    host: 'Rohan Sharma',
    type: 'Interactive Session',
    actionText: 'Join Room',
    actionLink: '/courses/react-19-masterclass',
    image: '/assets/workshops/workshop_react19.jpg',
  },
  {
    id: 'live-2',
    status: 'Tomorrow • 6:00 PM IST',
    isLiveNow: false,
    registered: '215 registered',
    title: 'Full-Stack Architecture & Microservices Q&A',
    host: 'Sneha Gupta',
    type: 'Interactive Session',
    actionText: 'Reserve Spot',
    actionLink: '/courses/fullstack-architecture',
    image: '/assets/workshops/workshop_fullstack.jpg',
  },
  {
    id: 'live-3',
    status: 'Aug 4 • 8:00 PM IST',
    isLiveNow: false,
    registered: '490 registered',
    title: 'AI Engineering & LLM Integration Live Workshop',
    host: 'Vikram Mehta',
    type: 'Interactive Session',
    actionText: 'Reserve Spot',
    actionLink: '/courses/ai-engineering-workshop',
    image: '/assets/workshops/workshop_ai.jpg',
  },
];

export function LiveClassesWorkshopsSection() {
  return (
    <section className="py-[var(--space-section)] px-6 lg:px-[var(--space-page)] bg-[var(--surface)] relative overflow-hidden">
      {/* Background Subtle Aura Glow */}
      <div className="pointer-events-none absolute top-0 right-1/4 w-96 h-96 bg-[var(--primary-soft)] rounded-full blur-[120px] opacity-40" />

      <div className="max-w-[var(--max-width)] mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            {/* Pulsating Red Live Dot */}
            <div className="relative flex items-center justify-center w-4 h-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </div>

            <h2 className="text-2xl md:text-3xl font-manrope font-extrabold text-[var(--ink)] tracking-tight">
              Live Classes & Workshops
            </h2>

            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-500/15 text-red-600 border border-red-500/25 uppercase tracking-wide">
              LIVE NOW
            </span>
          </div>

          <Link
            to="/courses?filter=live"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-deep)] transition-colors"
          >
            View Schedule <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Live Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {liveSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group relative rounded-2xl bg-[var(--canvas)] border border-[var(--border)] overflow-hidden flex flex-col justify-between hover:border-[var(--primary)]/40 hover:shadow-xl hover:shadow-[var(--primary-glow)] transition-all duration-300"
            >
              {/* Card Image Banner */}
              <div className="relative w-full aspect-video overflow-hidden bg-slate-900">
                <img 
                  src={session.image} 
                  alt={session.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                
                {/* Subtle Image Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />

                {/* Top Left Status Pill */}
                <div className="absolute top-3 left-3">
                  {session.isLiveNow ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-red-600/90 text-white shadow-md backdrop-blur-md border border-red-400/30">
                      <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
                      LIVE NOW
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 text-indigo-300 shadow-md backdrop-blur-md border border-slate-700/60">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {session.status}
                    </span>
                  )}
                </div>

                {/* Top Right Registered Count Pill */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-slate-200 backdrop-blur-md border border-slate-700/60">
                    <Users className="w-3 h-3 text-slate-400" />
                    {session.registered}
                  </span>
                </div>
              </div>

              {/* Card Content Section */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between">
                <div>
                  {/* Session Title */}
                  <h3 className="text-lg font-bold font-manrope text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors mb-2 leading-snug">
                    {session.title}
                  </h3>

                  {/* Host Info */}
                  <p className="text-xs sm:text-sm text-[var(--ink-muted)] mb-6 font-medium">
                    Host: <span className="text-[var(--ink)] font-bold">{session.host}</span>
                  </p>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--primary)] flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-[var(--primary)]" />
                    {session.type}
                  </span>

                  <Link
                    to={session.actionLink}
                    className="px-4 py-2 rounded-full text-xs font-extrabold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-md shadow-[var(--primary-glow)] transition-all duration-200"
                  >
                    {session.actionText}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
