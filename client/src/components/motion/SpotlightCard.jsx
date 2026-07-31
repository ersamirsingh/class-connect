import React, { useRef, useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(67, 56, 242, 0.08)',
}) {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
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
    setIsFocused(true);
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
    setOpacity(0);
    setIsFocused(false);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface)]',
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

export default SpotlightCard;
