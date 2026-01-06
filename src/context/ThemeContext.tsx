import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Theme } from '../types/settings';
import { THEMES, ThemeColors } from '../constants/themes';
import { storageService } from '../services/storage';

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  setTheme: (theme: Theme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const settings = await storageService.getSettings();
      setThemeState(settings.theme);
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      const settings = await storageService.getSettings();
      settings.theme = newTheme;
      await storageService.saveSettings(settings);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = useMemo(() => THEMES[theme], [theme]);

  const value: ThemeContextType = {
    theme,
    colors,
    setTheme,
  };

  if (isLoading) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
