export const dateUtils = {
  today(): string {
    return new Date().toISOString().split('T')[0];
  },

  formatDate(date: Date | string): string {
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
  },

  formatDateDisplay(dateStr: string, locale: string = 'en-US'): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  },

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  },

  getDayOfWeek(dateStr: string, locale: string = 'en-US'): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(locale, { weekday: 'long' });
  },

  getMonthYear(dateStr: string, locale: string = 'en-US'): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long' });
  },

  addDays(dateStr: string, days: number): string {
    const date = new Date(dateStr + 'T00:00:00');
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  },

  subtractDays(dateStr: string, days: number): string {
    return this.addDays(dateStr, -days);
  },

  getWeekStart(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    return date.toISOString().split('T')[0];
  },

  getMonthStart(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    date.setDate(1);
    return date.toISOString().split('T')[0];
  },

  getMonthEnd(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return date.toISOString().split('T')[0];
  },

  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  },

  getMonthDays(dateStr: string): string[] {
    const [year, month] = dateStr.split('-').map(Number);
    const days = this.getDaysInMonth(year, month - 1);
    const result: string[] = [];

    for (let i = 1; i <= days; i++) {
      result.push(`${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`);
    }

    return result;
  },

  isSameDay(date1: string, date2: string): boolean {
    return date1 === date2;
  },

  isBefore(date1: string, date2: string): boolean {
    return new Date(date1) < new Date(date2);
  },

  isAfter(date1: string, date2: string): boolean {
    return new Date(date1) > new Date(date2);
  },

  isBetween(date: string, startDate: string, endDate: string): boolean {
    const d = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return d >= start && d <= end;
  },

  getDaysDifference(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },
};
