import React from 'react';

/**
 * RedlineGlow - Spatial Crimson Background Glow Component
 * Renders a soft spatial crimson/red radial light glow behind key visual sections.
 */
export const RedlineGlow = ({
  className = '',
  intensity = 'medium', // 'subtle' | 'medium' | 'high'
  position = 'center',  // 'top' | 'center' | 'bottom'
  children
}) => {
  const opacityMap = {
    subtle: 'opacity-30',
    medium: 'opacity-60',
    high: 'opacity-90',
  };

  const positionMap = {
    top: '-top-40 left-1/2 -translate-x-1/2',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    bottom: '-bottom-40 left-1/2 -translate-x-1/2',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Radial Crimson Glow Layer */}
      <div 
        className={`pointer-events-none absolute w-[600px] md:w-[900px] h-[400px] md:h-[600px] rounded-full blur-[120px] bg-gradient-to-tr from-[#9F1018]/40 via-[#FF2A2A]/25 to-transparent ${opacityMap[intensity]} ${positionMap[position]} -z-10`}
        aria-hidden="true"
      />
      {children}
    </div>
  );
};
