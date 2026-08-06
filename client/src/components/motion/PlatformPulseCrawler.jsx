import React from 'react';
import { NumberTicker } from './NumberTicker';
import { SpotlightCard } from './SpotlightCard';

export const PlatformPulseCrawler = () => {
  const metrics = [
    { label: 'ACTIVE LEARNERS', value: 12450, suffix: '+', desc: 'Enrolled in active learning tracks' },
    { label: 'COMPLETION RATE', value: 98.6, decimals: 1, suffix: '%', desc: 'Practical milestone completion' },
    { label: 'AVERAGE RATING', value: 4.9, decimals: 1, suffix: '/5', desc: 'From verified course reviews' },
    { label: 'LIVE SESSIONS', value: 24, suffix: '/7', desc: 'On-demand code & mentor support' },
  ];

  return (
    <section className="relative py-20 px-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2A2A] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF2A2A]" />
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF4D3D]">
              PLATFORM PULSE • REAL-TIME METRICS
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-[#F7F7F5]">
            Engineered for <span className="text-[#FF2A2A] font-normal">measurable impact.</span>
          </h2>
        </div>
        <p className="font-body text-[#A8A8AE] text-sm sm:text-base max-w-md">
          Live telemetry from thousands of students advancing through hands-on technical tracks right now.
        </p>
      </div>

      {/* Grid of Pulse Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <SpotlightCard key={idx} className="p-7 flex flex-col justify-between h-56">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#A8A8AE] mb-4">
                <span>// {metric.label}</span>
                <span className="text-[#FF2A2A] font-mono">[LIVE]</span>
              </div>
              <div className="font-display text-4xl sm:text-5xl font-light text-[#F7F7F5] tracking-tight">
                <NumberTicker
                  value={metric.value}
                  decimals={metric.decimals || 0}
                  suffix={metric.suffix}
                />
              </div>
            </div>
            <p className="font-body text-xs text-[#A8A8AE] border-t border-white/5 pt-4">
              {metric.desc}
            </p>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
};

export default PlatformPulseCrawler;
