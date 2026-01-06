import { EntryFormData } from '../types/entry';

export const validators = {
  isValidDate(dateStr: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const date = new Date(dateStr + 'T00:00:00');
    return date instanceof Date && !isNaN(date.getTime());
  },

  isValidTime(timeStr: string): boolean {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(timeStr);
  },

  isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  isValidProjectName(name: string): boolean {
    return name.trim().length > 0 && name.trim().length <= 100;
  },

  isValidDescription(desc: string): boolean {
    return desc.trim().length > 0 && desc.trim().length <= 500;
  },

  isValidBreakTime(breakTime: number): boolean {
    return breakTime >= 0 && breakTime < 1440;
  },

  validateEntry(entry: EntryFormData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.isValidDate(entry.date)) {
      errors.push('Invalid date format');
    }

    if (!this.isValidTime(entry.startTime)) {
      errors.push('Invalid start time format');
    }

    if (!this.isValidTime(entry.endTime)) {
      errors.push('Invalid end time format');
    }

    if (!this.isValidDescription(entry.description)) {
      errors.push('Description must be between 1 and 500 characters');
    }

    if (!this.isValidBreakTime(entry.breakTime)) {
      errors.push('Break time must be between 0 and 1440 minutes');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  validateProjectName(name: string): { valid: boolean; error?: string } {
    if (!this.isValidProjectName(name)) {
      return { valid: false, error: 'Project name must be between 1 and 100 characters' };
    }
    return { valid: true };
  },

  compareTime(time1: string, time2: string): number {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    const t1 = h1 * 60 + m1;
    const t2 = h2 * 60 + m2;
    return t1 - t2;
  },

  isTimeRangeValid(startTime: string, endTime: string): boolean {
    const comparison = this.compareTime(startTime, endTime);
    return comparison < 0 || comparison === 0;
  },
};
