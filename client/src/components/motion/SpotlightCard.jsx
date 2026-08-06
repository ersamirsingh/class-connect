import React, { useRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

/**
 * SpotlightCard - Redline Dark Technical Card Component
 * Dark glass container with cursor-following crimson glare highlight.
 */
export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(255, 42, 42, 0.18)',
}) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(!window.matchMedia('(hover: hover)').matches);
  }, []);

  const handleMouseMove = (e) => {
    if (isTouch || !divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    if (isTouch) return;
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0D] transition-all duration-300 hover:border-[#FF2A2A]/40 hover:shadow-[0_0_30px_rgba(255,42,42,0.12)]',
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 50%)`,
        }}
      />
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
}

export default SpotlightCard;
