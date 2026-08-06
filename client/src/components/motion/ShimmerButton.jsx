import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

/**
 * ShimmerButton - Redline Signature Capsule Control
 * High-contrast pill button with crimson/red shimmer bloom.
 */
export function ShimmerButton({
  children,
  className,
  onClick,
  disabled = false,
  type = 'button',
  size = 'default',
  variant = 'primary', // 'primary' (red) | 'white' (white pill) | 'outline' (dark glass)
  href,
}) {
  const sizeClasses = {
    sm: 'min-h-[40px] text-xs px-5 font-mono uppercase tracking-wider',
    default: 'min-h-[48px] text-sm px-7 font-medium tracking-wide',
    lg: 'min-h-[56px] text-base px-9 font-medium tracking-wide',
  };

  const variantStyles = {
    primary: {
      bg: 'bg-[#FF2A2A]',
      text: 'text-white',
      hover: 'hover:bg-[#FF4D3D] hover:shadow-[0_0_25px_rgba(255,42,42,0.5)]',
      border: 'border border-[#FF4D3D]/50',
    },
    white: {
      bg: 'bg-[#F7F7F5]',
      text: 'text-[#050505]',
      hover: 'hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]',
      border: 'border border-white/80',
    },
    outline: {
      bg: 'bg-[#0B0B0D]/80',
      text: 'text-[#F7F7F5]',
      hover: 'hover:border-[#FF2A2A]/50 hover:bg-[#141416] hover:shadow-[0_0_20px_rgba(255,42,42,0.2)]',
      border: 'border border-white/10',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;

  const content = (
    <span className="relative z-20 flex items-center justify-center gap-2">
      {children}
    </span>
  );

  const baseClasses = cn(
    'group relative inline-flex items-center justify-center overflow-hidden rounded-full font-body transition-all duration-300 active:scale-[0.98]',
    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    currentVariant.bg,
    currentVariant.text,
    currentVariant.border,
    currentVariant.hover,
    sizeClasses[size],
    className
  );

  if (href) {
    if (href.startsWith('http') || href.startsWith('https')) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses}>
          {content}
        </a>
      );
    }
    return (
      <Link to={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={baseClasses}>
      {content}
    </button>
  );
}

export default ShimmerButton;
