export const formatters = {
  formatHours(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  },

  formatMinutes(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  },

  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  formatPercent(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
  },

  formatNumber(num: number, decimals: number = 2): string {
    return num.toFixed(decimals);
  },

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  },

  capitalizeFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  formatCategory(category: string): string {
    const map: Record<string, string> = {
      work: 'Work',
      overtime: 'Overtime',
      vacation: 'Vacation',
    };
    return map[category] || category;
  },

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  },

  formatTimeRange(startTime: string, endTime: string): string {
    return `${this.formatTime(startTime)} - ${this.formatTime(endTime)}`;
  },

  pluralize(count: number, singular: string, plural?: string): string {
    if (count === 1) return singular;
    return plural || singular + 's';
  },
};
