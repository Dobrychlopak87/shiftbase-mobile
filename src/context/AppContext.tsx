import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Entry } from '../types/entry';
import { Project } from '../types/project';
import { storageService } from '../services/storage';
import { calculationService } from '../services/calculations';

interface AppContextType {
  entries: Entry[];
  projects: Project[];
  addEntry: (entry: Entry) => Promise<void>;
  updateEntry: (entry: Entry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  addProject: (project: Project) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getEntriesByDate: (date: string) => Entry[];
  getProjectById: (id: string) => Project | undefined;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [loadedEntries, loadedProjects] = await Promise.all([
        storageService.getEntries(),
        storageService.getProjects(),
      ]);
      setEntries(loadedEntries);
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addEntry = useCallback(async (entry: Entry) => {
    try {
      const updated = [entry, ...entries];
      setEntries(updated);
      await storageService.saveEntries(updated);

      if (entry.projectId) {
        const project = projects.find(p => p.id === entry.projectId);
        if (project) {
          const stats = calculationService.calculateProjectStats(updated, entry.projectId);
          project.totalHours = stats.totalHours;
          project.entryCount = stats.entryCount;
          project.lastUsed = Date.now();
          await updateProject(project);
        }
      }
    } catch (error) {
      console.error('Error adding entry:', error);
      throw error;
    }
  }, [entries, projects]);

  const updateEntry = useCallback(async (entry: Entry) => {
    try {
      const updated = entries.map(e => e.id === entry.id ? entry : e);
      setEntries(updated);
      await storageService.saveEntries(updated);
    } catch (error) {
      console.error('Error updating entry:', error);
      throw error;
    }
  }, [entries]);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      const updated = entries.filter(e => e.id !== id);
      setEntries(updated);
      await storageService.saveEntries(updated);
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  }, [entries]);

  const addProject = useCallback(async (project: Project) => {
    try {
      const updated = [project, ...projects];
      setProjects(updated);
      await storageService.saveProjects(updated);
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  }, [projects]);

  const updateProject = useCallback(async (project: Project) => {
    try {
      const updated = projects.map(p => p.id === project.id ? project : p);
      setProjects(updated);
      await storageService.saveProjects(updated);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }, [projects]);

  const deleteProject = useCallback(async (id: string) => {
    try {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      await storageService.saveProjects(updated);

      const updatedEntries = entries.map(e =>
        e.projectId === id ? { ...e, projectId: null } : e
      );
      setEntries(updatedEntries);
      await storageService.saveEntries(updatedEntries);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }, [projects, entries]);

  const getEntriesByDate = useCallback((date: string) => {
    return entries.filter(e => e.date === date);
  }, [entries]);

  const getProjectById = useCallback((id: string) => {
    return projects.find(p => p.id === id);
  }, [projects]);

  const value: AppContextType = {
    entries,
    projects,
    addEntry,
    updateEntry,
    deleteEntry,
    addProject,
    updateProject,
    deleteProject,
    getEntriesByDate,
    getProjectById,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
