import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Language } from '../types/settings';
import { getTranslation, TranslationKeys } from '../i18n/translations';
import { storageService } from '../services/storage';

interface I18nContextType {
  language: Language;
  t: TranslationKeys;
  setLanguage: (language: Language) => Promise<void>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const settings = await storageService.getSettings();
      setLanguageState(settings.language);
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = async (newLanguage: Language) => {
    setLanguageState(newLanguage);
    try {
      const settings = await storageService.getSettings();
      settings.language = newLanguage;
      await storageService.saveSettings(settings);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = useMemo(() => getTranslation(language), [language]);

  const value: I18nContextType = {
    language,
    t,
    setLanguage,
  };

  if (isLoading) {
    return null;
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
