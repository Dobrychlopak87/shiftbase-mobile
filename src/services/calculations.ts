import { Entry } from '../types/entry';
import { Project } from '../types/project';

export const calculationService = {
  calculateHours(startTime: string, endTime: string, breakTime: number = 0): number {
    try {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      let totalMinutes = endMinutes - startMinutes;
      if (totalMinutes < 0) totalMinutes += 24 * 60;

      const workMinutes = totalMinutes - breakTime;
      return Math.max(0, workMinutes / 60);
    } catch (error) {
      console.error('Error calculating hours:', error);
      return 0;
    }
  },

  calculateDailyTotal(entries: Entry[], date: string): number {
    return entries
      .filter(e => e.date === date)
      .reduce((sum, e) => sum + e.hours, 0);
  },

  calculateWeeklyTotal(entries: Entry[], startDate: string): number {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    return entries
      .filter(e => {
        const eDate = new Date(e.date);
        return eDate >= start && eDate < end;
      })
      .reduce((sum, e) => sum + e.hours, 0);
  },

  calculateMonthlyTotal(entries: Entry[], year: number, month: number): number {
    return entries
      .filter(e => {
        const date = new Date(e.date);
        return date.getFullYear() === year && date.getMonth() === month;
      })
      .reduce((sum, e) => sum + e.hours, 0);
  },

  calculateProjectStats(entries: Entry[], projectId: string): { totalHours: number; entryCount: number } {
    const projectEntries = entries.filter(e => e.projectId === projectId);
    return {
      totalHours: projectEntries.reduce((sum, e) => sum + e.hours, 0),
      entryCount: projectEntries.length,
    };
  },

  calculateCategoryBreakdown(entries: Entry[]): Record<string, number> {
    const breakdown: Record<string, number> = {};
    entries.forEach(e => {
      breakdown[e.category] = (breakdown[e.category] || 0) + e.hours;
    });
    return breakdown;
  },

  calculateAverageDaily(entries: Entry[]): number {
    if (entries.length === 0) return 0;

    const dates = new Set(entries.map(e => e.date));
    const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

    return totalHours / dates.size;
  },

  getDateRange(entries: Entry[]): { start: string | null; end: string | null } {
    if (entries.length === 0) return { start: null, end: null };

    const dates = entries.map(e => e.date).sort();
    return {
      start: dates[0],
      end: dates[dates.length - 1],
    };
  },

  filterEntriesByDateRange(entries: Entry[], startDate: string, endDate: string): Entry[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);

    return entries.filter(e => {
      const eDate = new Date(e.date);
      return eDate >= start && eDate < end;
    });
  },

  filterEntriesByProject(entries: Entry[], projectId: string): Entry[] {
    return entries.filter(e => e.projectId === projectId);
  },

  filterEntriesByCategory(entries: Entry[], category: string): Entry[] {
    return entries.filter(e => e.category === category);
  },

  sortEntries(entries: Entry[], sortBy: 'date' | 'hours' = 'date', descending: boolean = true): Entry[] {
    const sorted = [...entries];
    sorted.sort((a, b) => {
      if (sortBy === 'date') {
        return descending ? new Date(b.date).getTime() - new Date(a.date).getTime() : new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return descending ? b.hours - a.hours : a.hours - b.hours;
      }
    });
    return sorted;
  },
};
