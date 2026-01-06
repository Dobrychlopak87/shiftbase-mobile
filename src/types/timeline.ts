export type CalendarMode = 'single' | 'multi' | 'range';

export interface TimelineState {
  selectedDates: Set<string>;
  mode: CalendarMode;
  rangeStart: string | null;
  rangeEnd: string | null;
}

export interface DayData {
  date: string;
  totalHours: number;
  entryCount: number;
  isSelected: boolean;
}
