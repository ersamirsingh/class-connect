import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function TextEffect({
  children,
  className,
  preset = 'fade-in-blur',
  per = 'word',
  delay = 0,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const shouldReduceMotion = useReducedMotion();

  if (typeof children !== 'string') return <span className={className}>{children}</span>;

  const isWord = per === 'word';
  const elements = isWord ? children.split(' ') : [children];

  const presets = {
    'fade-in-blur': {
      hidden: { opacity: 0, filter: 'blur(4px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
    },
    'fade-up': {
      hidden: { opacity: 0, y: 8 },
      visible: { opacity: 1, y: 0 },
    },
    slide: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  };

  const itemVariants = presets[preset] || presets['fade-in-blur'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: delay,
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
        {elements.map((el, i) => (
          <React.Fragment key={i}>
            <motion.span
              variants={
                shouldReduceMotion
                  ? {}
                  : {
                      hidden: itemVariants.hidden,
                      visible: {
                        ...itemVariants.visible,
                        transition: { duration: 0.4, ease: 'easeOut' },
                      },
                    }
              }
              className="inline-block"
            >
              {el}
            </motion.span>
            {isWord && i !== elements.length - 1 && (
              <span className="inline-block w-[0.25em]">&nbsp;</span>
            )}
          </React.Fragment>
        ))}
      </motion.span>
    </span>
  );
}

export default TextEffect;
