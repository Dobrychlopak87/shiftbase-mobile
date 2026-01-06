import { COLORS_LIGHT, COLORS_DARK, COLORS_ONYX } from './colors';
import { Theme } from '../types/settings';

export interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export const THEMES: Record<Theme, ThemeColors> = {
  light: COLORS_LIGHT,
  dark: COLORS_DARK,
  onyx: COLORS_ONYX,
};

export const DEFAULT_THEME: Theme = 'light';
