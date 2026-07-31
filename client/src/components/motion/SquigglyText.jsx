import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function SquigglyText({
  children,
  text,
  highlightWord = '',
  className = '',
  squigglyColor = 'var(--primary)',
  accentColor = 'var(--accent)',
}) {
  const content = text || children || '';

  // If text is provided, we can render it with an animated squiggly SVG underline
  return (
    <span className={cn('relative inline-block', className)}>
      <span className="relative z-10">{content}</span>
      
      {/* Animated Squiggly SVG Underline */}
      <svg
        className="absolute -bottom-2.5 left-0 w-full h-4 overflow-visible pointer-events-none z-0"
        viewBox="0 0 300 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="squigglyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>

        <motion.path
          d="M 5,12 Q 40,2 75,12 T 145,12 T 215,12 T 290,12"
          stroke="url(#squigglyGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
            opacity: { duration: 0.4, delay: 0.2 },
          }}
        />

        {/* Floating Wiggle Motion Trail */}
        <motion.path
          d="M 5,12 Q 40,2 75,12 T 145,12 T 215,12 T 290,12"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.3}
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: [0, 1, 1],
            x: [0, 2, -2, 0],
          }}
          transition={{
            pathLength: { duration: 1.4, ease: 'easeOut', delay: 0.5 },
            x: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      </svg>
    </span>
  );
}

export default SquigglyText;
