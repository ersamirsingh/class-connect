import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export function GooeyInput({
  value = '',
  onChange,
  onClear,
  onSubmit,
  placeholder = 'Search courses...',
  className = '',
  inputClassName = '',
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative flex items-center group', className)}>
      {/* Gooey Liquid SVG Filter Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none opacity-0">
        <defs>
          <filter id="gooey-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Gooey Focus Aura Fluid Blob */}
      <motion.div
        className="pointer-events-none absolute -inset-1 rounded-full bg-gradient-to-r from-[var(--primary)] via-purple-500 to-[var(--accent)] opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-40"
        animate={{
          scale: isFocused ? [1, 1.02, 1] : 1,
          opacity: isFocused ? 0.6 : undefined,
        }}
        transition={{ duration: 2, repeat: isFocused ? Infinity : 0, ease: 'easeInOut' }}
        style={{ filter: 'url(#gooey-filter)' }}
      />

      {/* Input Container */}
      <div className="relative w-full flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-full transition-all duration-300 shadow-sm group-hover:border-[var(--primary)]/40 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20">
        <Search className="w-4 h-4 text-[var(--ink-muted)] ml-3 shrink-0" />

        <input
          type="text"
          value={value || ''}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            'w-full py-1.5 pl-2 pr-7 bg-transparent text-xs sm:text-sm text-[var(--ink)] placeholder-[var(--ink-faint)] focus:outline-none font-medium',
            inputClassName
          )}
        />

        {value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 p-0.5 rounded-full text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--canvas)] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}

export default GooeyInput;
