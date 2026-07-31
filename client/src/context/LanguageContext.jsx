import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

import en from '../i18n/en.json';
import hi from '../i18n/hi.json';

const translations = { en, hi };

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
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
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

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
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
