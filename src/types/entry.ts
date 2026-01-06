export type EntryCategory = 'work' | 'overtime' | 'vacation';

export interface Entry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  projectId: string | null;
  category: EntryCategory;
  breakTime: number;
  location: string;
  notes: string;
  hours: number;
  createdAt: number;
  updatedAt: number;
}

export interface EntryFormData {
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  projectId: string | null;
  category: EntryCategory;
  breakTime: number;
  location: string;
  notes: string;
}
