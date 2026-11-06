import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types/index.ts';
import { translations } from '../i18n/translations.ts';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  hasChosenOnboarding: boolean;
  completeOnboarding: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('rajnish_study_lang');
    if (saved === 'en' || saved === 'hi') return saved;
    return 'hi'; // Default Hindi medium for Indian students & aspirants
  });

  const [hasChosenOnboarding, setHasChosenOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('rajnish_study_onboarded') === 'true';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('rajnish_study_lang', lang);
    document.documentElement.lang = lang;
  };

  const completeOnboarding = (lang: Language) => {
    setLanguage(lang);
    setHasChosenOnboarding(true);
    localStorage.setItem('rajnish_study_onboarded', 'true');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language] || translations.hi;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        hasChosenOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
