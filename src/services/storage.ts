import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, CURRENT_VERSION } from '../constants/storage';
import { Entry } from '../types/entry';
import { Project } from '../types/project';
import { Settings } from '../types/settings';

export const storageService = {
  async getEntries(): Promise<Entry[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading entries:', error);
      return [];
    }
  },

  async saveEntries(entries: Entry[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving entries:', error);
      throw error;
    }
  },

  async getProjects(): Promise<Project[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  },

  async saveProjects(projects: Project[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects:', error);
      throw error;
    }
  },

  async getSettings(): Promise<Settings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return JSON.parse(data);
      return this.getDefaultSettings();
    } catch (error) {
      console.error('Error loading settings:', error);
      return this.getDefaultSettings();
    }
  },

  async saveSettings(settings: Settings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  getDefaultSettings(): Settings {
    return {
      theme: 'light',
      language: 'en',
      defaultCategory: 'work',
      defaultBreakTime: 0,
      soundEnabled: true,
      hapticEnabled: true,
      autoBackup: false,
      backupFrequency: 'weekly',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },

  async exportData(entries: Entry[], projects: Project[], settings: Settings) {
    return {
      entries,
      projects,
      settings,
      exportDate: new Date().toISOString(),
      version: CURRENT_VERSION,
    };
  },

  async importData(data: any): Promise<{ entries: Entry[]; projects: Project[]; settings: Settings }> {
    try {
      if (!data.entries || !Array.isArray(data.entries)) throw new Error('Invalid entries');
      if (!data.projects || !Array.isArray(data.projects)) throw new Error('Invalid projects');
      if (!data.settings || typeof data.settings !== 'object') throw new Error('Invalid settings');

      return {
        entries: data.entries,
        projects: data.projects,
        settings: data.settings,
      };
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  },
};
