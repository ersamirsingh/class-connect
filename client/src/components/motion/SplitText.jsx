import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function SplitText({ text, className, delay = 0, once = true }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });
  const shouldReduceMotion = useReducedMotion();

  if (typeof text !== 'string') return null;

  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 12,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <span ref={ref} className={cn('inline-flex flex-wrap', className)}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="inline-flex flex-wrap"
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={shouldReduceMotion ? {} : wordVariants}
            className="inline-block mr-[0.25em] last:mr-0"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </span>
  );
}

export default SplitText;
