import React, { useId, useRef } from 'react';
import { cn } from '../../utils/cn';

export function Marquee({
  children,
  className,
  speed = 40,
  pauseOnHover = true,
  direction = 'left',
  vertical = false,
}) {
  const id = useId().replace(/:/g, '');
  const animationName = `marquee-${id}`;
  const isReverse = direction === 'right' || direction === 'down';
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className={cn(
        'group flex overflow-x-auto scrollbar-hide select-none cursor-grab active:cursor-grabbing',
        vertical ? 'flex-col h-full overflow-y-auto' : 'flex-row w-full',
        className
      )}
      style={{ scrollBehavior: 'smooth' }}
    >
      <style>
        {`
          @keyframes ${animationName} {
            from { transform: ${vertical ? 'translateY' : 'translateX'}(0); }
            to { transform: ${vertical ? 'translateY' : 'translateX'}(calc(-100% - 1rem)); }
          }
          .animate-${animationName} {
            animation: ${animationName} ${speed}s linear infinite ${isReverse ? 'reverse' : 'normal'};
          }
          ${
            pauseOnHover
              ? `.group:hover .animate-${animationName} { animation-play-state: paused; }`
              : ''
          }
        `}
      </style>
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 justify-around gap-4',
            vertical ? 'flex-col mb-4' : 'flex-row mr-4',
            `animate-${animationName}`
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

export default Marquee;
