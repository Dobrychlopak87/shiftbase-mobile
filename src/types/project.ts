export interface Project {
  id: string;
  name: string;
  color: string;
  totalHours: number;
  entryCount: number;
  lastUsed: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface ProjectFormData {
  name: string;
  color: string;
}
