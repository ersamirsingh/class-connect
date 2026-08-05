import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function SquigglyText({
  children,
  text,
  className = '',
}) {
  const content = text || children || '';

  return (
    <span className={cn('relative inline-block pb-2', className)}>
      <span className="relative z-10">{content}</span>
      
      {/* Animated Squiggly SVG Underline */}
      <svg
        className="absolute bottom-0 left-0 w-full h-4 overflow-visible pointer-events-none z-0"
        viewBox="0 0 300 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="heroSquigglyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4338F2" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#FF6B35" />
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Primary Animated Squiggly Stroke */}
        <motion.path
          d="M 4,14 Q 40,2 75,14 T 145,14 T 215,14 T 295,14"
          stroke="url(#heroSquigglyGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glowFilter)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            d: [
              "M 4,14 Q 40,2 75,14 T 145,14 T 215,14 T 295,14",
              "M 4,14 Q 40,24 75,14 T 145,14 T 215,14 T 295,14",
              "M 4,14 Q 40,2 75,14 T 145,14 T 215,14 T 295,14",
            ]
          }}
          transition={{
            pathLength: { duration: 1, ease: 'easeOut' },
            opacity: { duration: 0.3 },
            d: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
          }}
        />

        {/* Accent Glow Trail */}
        <motion.path
          d="M 4,14 Q 40,2 75,14 T 145,14 T 215,14 T 295,14"
          stroke="#FF6B35"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.6}
          animate={{
            x: [0, 4, -4, 0],
          }}
          transition={{
            x: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      </svg>
    </span>
  );
}

export default SquigglyText;
