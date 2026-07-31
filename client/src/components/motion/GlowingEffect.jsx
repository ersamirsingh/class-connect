import React, { useRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

export function GlowingEffect({
  children,
  className,
  containerClassName,
  glowColor = 'rgba(67, 56, 242, 0.6)',
  accentGlow = 'rgba(255, 107, 53, 0.5)',
  borderWidth = 1.5,
  blurRadius = 12,
  disabled = false,
}) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(!window.matchMedia('(hover: hover)').matches);
  }, []);

  const handleMouseMove = (e) => {
    if (disabled || isTouch || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn('group relative rounded-2xl p-[1px] transition-all duration-300', containerClassName)}
    >
      {/* Edge Glow Blur Layer (behind border) */}
      <div
        className={cn(
          'pointer-events-none absolute -inset-0.5 rounded-2xl opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100',
          disabled && 'hidden'
        )}
        style={{
          background: isHovered
            ? `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, ${accentGlow}, transparent 70%)`
            : undefined,
        }}
      />

      {/* Animated Edge Border Trail */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'
        )}
        style={{
          padding: `${borderWidth}px`,
          background: isHovered
            ? `radial-gradient(220px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, ${accentGlow}, rgba(255,255,255,0.05) 80%)`
            : `linear-gradient(135deg, rgba(67, 56, 242, 0.2) 0%, rgba(255, 107, 53, 0.15) 50%, rgba(34, 32, 90, 0.08) 100%)`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Inner Card Content Wrapper */}
      <div className={cn('relative z-10 h-full w-full rounded-[15px] bg-[var(--surface)]', className)}>
        {children}
      </div>
    </div>
  );
}

export default GlowingEffect;
