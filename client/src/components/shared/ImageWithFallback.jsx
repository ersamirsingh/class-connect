import React, { useState } from 'react';
import { Layers, User } from 'lucide-react';

export function ImageWithFallback({ 
  src, 
  alt = 'Image', 
  className = '', 
  fallbackType = 'course',
  ...props 
}) {
  const [hasError, setHasError] = useState(false);

  // SVG Data URI Fallbacks for Instant Offline / HTTP 403 Safety
  const defaultCourseSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'><rect width='100%' height='100%' fill='%234338CA'/><circle cx='400' cy='225' r='120' fill='%236366F1' opacity='0.4'/><path d='M300 225L500 225M400 125L400 325' stroke='white' stroke-width='16' stroke-linecap='round'/></svg>";
  const defaultAvatarSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><circle cx='100' cy='100' r='100' fill='%234F46E5'/><circle cx='100' cy='75' r='35' fill='white'/><path d='M35 165 C35 125 165 125 165 165 Z' fill='white'/></svg>";

  if (!src || hasError) {
    if (fallbackType === 'avatar') {
      return (
        <div className={`flex items-center justify-center bg-indigo-100 text-indigo-600 font-extrabold rounded-full overflow-hidden ${className}`}>
          <img 
            src={defaultAvatarSvg} 
            alt={alt} 
            className="w-full h-full object-cover" 
          />
        </div>
      );
    }

    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-black/20" />
        <Layers className="w-12 h-12 text-indigo-400 opacity-60 z-10 animate-pulse" />
        <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-[10px] font-bold text-indigo-200 rounded-full z-10 border border-indigo-500/30">
          ClassConnect HD
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
