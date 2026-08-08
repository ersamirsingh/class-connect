import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function LanguageSwitcher({ variant = 'pill', className = '' }) {
  const { language, toggleLanguage } = useLanguage();

  const labels = {
    en: { short: 'EN', full: 'English' },
    te: { short: 'తె', full: 'తెలుగు' },
  };

  const currentLabel = labels[language] || labels.en;

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleLanguage}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold
          transition-colors duration-150 border border-[var(--border)] bg-[var(--surface)]
          text-[var(--ink)] hover:text-[var(--primary)] hover:bg-[var(--primary-soft)] cursor-pointer
          ${className}`}
        aria-label="Toggle Language"
        title="Switch Language (EN / TE)"
      >
        <Globe className="w-3.5 h-3.5 text-[var(--primary)]" />
        <span className="font-mono font-extrabold">{currentLabel.short}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-full
        border border-[var(--border)] bg-[var(--surface)]
        transition-all duration-200 cursor-pointer
        hover:border-[var(--primary)] hover:shadow-sm
        ${className}`}
      aria-label="Toggle Language"
    >
      <Globe className="w-4 h-4 text-[var(--primary)] transition-colors" />
      <span className="text-xs font-extrabold text-[var(--ink)]">
        {currentLabel.full}
      </span>
    </button>
  );
}
