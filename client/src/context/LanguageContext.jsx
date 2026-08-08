import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

import en from '../i18n/en.json';
import hi from '../i18n/hi.json';
import te from '../i18n/te.json';

const translations = { en, hi, te };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('app-language') || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem('app-language', language);
    } catch {
      // Storage unavailable
    }
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'te' : 'en'));
  }, []);

  const t = useCallback(
    (key, fallback) => {
      const keys = key.split('.');
      let value = translations[language];

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Try English fallback
          let fb = translations.en;
          for (const fk of keys) {
            if (fb && typeof fb === 'object' && fk in fb) {
              fb = fb[fk];
            } else {
              return fallback || key;
            }
          }
          return typeof fb === 'string' ? fb : fallback || key;
        }
      }

      return typeof value === 'string' ? value : fallback || key;
    },
    [language]
  );

  /**
   * Helper to extract localized text for multilingual object fields { en, te }
   * Falls back to English if Telugu string is empty or missing.
   */
  const getContentText = useCallback(
    (field) => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      if (typeof field === 'object') {
        const langVal = field[language];
        if (langVal && typeof langVal === 'string' && langVal.trim() !== '') {
          return langVal;
        }
        return field.en || field.default || Object.values(field)[0] || '';
      }
      return String(field);
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, getContentText }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
