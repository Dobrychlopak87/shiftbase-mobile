import { Language } from '../types/settings';
import { pl } from './pl';
import { en } from './en';
import { nl } from './nl';

export const TRANSLATIONS: Record<Language, typeof pl> = {
  pl,
  en,
  nl,
};

export const getTranslation = (language: Language) => TRANSLATIONS[language];

export type TranslationKeys = typeof pl;
