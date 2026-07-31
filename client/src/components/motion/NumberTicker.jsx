import React, { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '../../utils/cn';

export function NumberTicker({
  value,
  direction = 'up',
  decimals = 0,
  className,
  prefix = '',
  suffix = '',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });
  const motionValue = useMotionValue(direction === 'down' ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(direction === 'down' ? 0 : value);
    }
  }, [motionValue, isInView, value, direction]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`;
      }
    });
  }, [springValue, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={cn('inline-block tabular-nums', className)}>
      {prefix}
      {direction === 'down' ? value : 0}
      {suffix}
    </span>
  );
}

export default NumberTicker;
