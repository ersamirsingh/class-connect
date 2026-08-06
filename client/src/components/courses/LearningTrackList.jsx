import React from 'react';
import { PlayCircle, Lock, CheckCircle2 } from 'lucide-react';

export const LearningTrackList = ({ units = [] }) => {
  if (!units || units.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-[#0B0B0D] border border-white/10 text-center text-[#A1A1AA]">
        Curriculum curriculum modules loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {units.map((unit, uIdx) => (
        <div key={uIdx} className="p-6 sm:p-8 rounded-3xl bg-[#0B0B0D] border border-white/10">
          <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <span className="font-mono text-xs text-[#C1FBD4] uppercase tracking-widest block mb-1">
                MODULE 0{uIdx + 1}
              </span>
              <h3 className="font-display text-2xl font-light text-[#F7F7F5]">
                {unit.title || `Unit ${uIdx + 1}`}
              </h3>
            </div>
            <span className="font-mono text-xs text-[#A1A1AA]">
              {unit.lectures?.length || 0} Lessons
            </span>
          </div>

          <div className="space-y-3">
            {(unit.lectures || []).map((lecture, lIdx) => {
              const isLocked = lecture.isLocked ?? (lIdx > 0 && uIdx > 0);
              return (
                <div
                  key={lIdx}
                  className="group flex items-center justify-between p-4 rounded-2xl bg-[#141416] border border-white/5 hover:border-[#C1FBD4]/40 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm font-semibold text-[#A1A1AA] w-6">
                      {String(lIdx + 1).padStart(2, '0')}
                    </span>
                    <span className="font-body text-sm font-medium text-[#F7F7F5] group-hover:text-[#C1FBD4] transition-colors">
                      {lecture.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {lecture.duration && (
                      <span className="font-mono text-xs text-[#A1A1AA]">
                        {lecture.duration}
                      </span>
                    )}
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-[#71717A]" />
                    ) : (
                      <PlayCircle className="w-4 h-4 text-[#C1FBD4]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LearningTrackList;
