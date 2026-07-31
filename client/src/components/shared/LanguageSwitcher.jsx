import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function LanguageSwitcher({ variant = 'pill', className = '' }) {
  const { language, toggleLanguage } = useLanguage();

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleLanguage}
        className={`inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium
          transition-colors duration-150
          text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--primary-soft)]
          ${className}`}
        aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
      >
        <Globe className="w-4 h-4" />
        <span className="font-semibold">{language === 'en' ? 'हि' : 'En'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`group inline-flex items-center gap-2 px-3 py-2 rounded-full
        border border-[var(--border)] bg-[var(--surface)]
        transition-all duration-200
        hover:border-[var(--primary)] hover:shadow-[var(--shadow-xs)]
        ${className}`}
      aria-label={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
    >
      <Globe className="w-4 h-4 text-[var(--ink-muted)] group-hover:text-[var(--primary)] transition-colors" />
      <span className="text-sm font-semibold text-[var(--ink)]">
        {language === 'en' ? 'हिंदी' : 'English'}
      </span>
    </button>
  );
}
