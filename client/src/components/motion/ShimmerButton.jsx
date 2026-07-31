import React from 'react';
import { cn } from '../../utils/cn';

export function ShimmerButton({
  children,
  className,
  onClick,
  disabled,
  type = 'button',
  size = 'default',
}) {
  const sizeClasses = {
    sm: 'min-h-[40px] text-sm px-4',
    default: 'min-h-[48px] text-base px-6',
    lg: 'min-h-[56px] text-lg px-8',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group relative inline-flex items-center justify-center overflow-hidden rounded-[100px] font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-[1.02]',
        sizeClasses[size],
        className
      )}
      style={{
        background: 'var(--primary)',
      }}
    >
      {!disabled && (
        <>
          <div className="absolute inset-0 z-0 overflow-hidden rounded-[100px]">
            <div className="absolute -inset-[100%] animate-[shimmer_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)]" />
          </div>
          <style>
            {`
              @keyframes shimmer {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </>
      )}
      <div className="absolute inset-[1px] z-10 rounded-[100px] bg-[var(--primary)] transition-colors group-hover:bg-[#534aff]" />
      <span className="relative z-20">{children}</span>
    </button>
  );
}

export default ShimmerButton;
