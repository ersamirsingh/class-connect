import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function InView({
  children,
  className,
  variants,
  transition,
  threshold = 0.2,
  once = true,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (typeof children === 'function') {
    return (
      <div ref={ref} className={className}>
        {children(isInView)}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants || defaultVariants}
      transition={transition || { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default InView;
