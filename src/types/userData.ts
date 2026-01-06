import { Entry } from './entry';
import { Project } from './project';
import { Settings } from './settings';

export interface UserData {
  entries: Entry[];
  projects: Project[];
  settings: Settings;
  lastSync: number;
  version: string;
}

export interface ExportData {
  entries: Entry[];
  projects: Project[];
  settings: Settings;
  exportDate: string;
  version: string;
}
