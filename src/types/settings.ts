export type Theme = 'dark' | 'light' | 'onyx';
export type Language = 'pl' | 'en' | 'nl';

export interface Settings {
  theme: Theme;
  language: Language;
  defaultCategory: 'work' | 'overtime' | 'vacation';
  defaultBreakTime: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  createdAt: number;
  updatedAt: number;
}
