import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Radio, Users, Calendar, ArrowRight, Video } from 'lucide-react';
import { courseApi } from '../../api/models/course.api';

export function LiveClassesWorkshopsSection() {
  const [liveSessions, setLiveSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLiveSessions = async () => {
      try {
        const response = await courseApi.getCourses();
        const courses = Array.isArray(response?.data)
          ? response.data
          : (response?.data?.courses || (Array.isArray(response) ? response : []));

        // Filter courses with live or hybrid types or liveSchedule
        const liveOnly = courses.filter(c => c.type === 'live' || c.type === 'hybrid' || c.liveSchedule);

        const formatted = liveOnly.map(c => {
          const schedule = c.liveSchedule || {};
          const isLiveNow = schedule.status === 'live';
          
          let statusText = 'Scheduled Session';
          if (schedule.status === 'live') {
            statusText = 'LIVE NOW';
          } else if (schedule.status === 'ended') {
            statusText = 'Completed • Recording Available';
          } else if (schedule.startTime) {
            statusText = new Date(schedule.startTime).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            });
          }

          return {
            id: c._id || c.slug,
            status: statusText,
            isLiveNow,
            registered: `${c.ratingCount ? c.ratingCount * 3 + 120 : 150} registered`,
            title: c.title,
            host: c.instructor?.name || 'ClassConnect Master',
            type: c.type === 'live' ? 'Live Workshop' : 'Hybrid Masterclass',
            actionText: isLiveNow ? 'Join Room' : 'View Course',
            actionLink: `/courses/${c.slug || c._id}`,
          };
        });

        setLiveSessions(formatted.slice(0, 3));
      } catch (err) {
        console.warn('Failed to load live sessions from DB:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveSessions();
  }, []);

  if (!isLoading && liveSessions.length === 0) {
    return null;
  }

  return (
    <section className="py-[var(--space-section)] px-6 lg:px-[var(--space-page)] bg-[var(--surface)] border-t border-[var(--border)] relative overflow-hidden">
      {/* Background Subtle Aura Glow */}
      <div className="pointer-events-none absolute top-0 right-1/4 w-96 h-96 bg-[var(--primary-soft)] rounded-full blur-[120px] opacity-40" />

      <div className="max-w-[var(--max-width)] mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
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
              LIVE & UPCOMING
            </span>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-deep)] transition-colors"
          >
            View Schedule <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Live Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {liveSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group relative rounded-2xl bg-[var(--canvas)] border border-[var(--border)] p-6 flex flex-col justify-between hover:border-[var(--primary)]/40 hover:shadow-lg hover:shadow-[var(--primary-soft)]/20 transition-all duration-300"
            >
              {/* Card Top Metadata Bar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  {session.isLiveNow ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 text-pink-600 border border-pink-500/20">
                      <Radio className="w-3.5 h-3.5 animate-pulse text-pink-600" />
                      LIVE NOW
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary)]/20">
                      <Calendar className="w-3.5 h-3.5" />
                      {session.status}
                    </span>
                  )}

                  <span className="text-xs text-[var(--ink-muted)] font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[var(--ink-faint)]" />
                    {session.registered}
                  </span>
                </div>

                {/* Session Title */}
                <h3 className="text-lg font-bold font-manrope text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors mb-2 leading-snug">
                  {session.title}
                </h3>

                {/* Host */}
                <p className="text-sm text-[var(--ink-muted)] mb-6">
                  Host: <span className="text-[var(--ink)] font-semibold">{session.host}</span>
                </p>
              </div>

              {/* Card Bottom Actions */}
              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--primary)] flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" />
                  {session.type}
                </span>

                <Link
                  to={session.actionLink}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-sm shadow-[var(--primary)]/25 transition-all duration-200"
                >
                  {session.actionText}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

