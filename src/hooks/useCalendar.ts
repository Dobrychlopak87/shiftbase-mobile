import { useState, useCallback, useMemo } from 'react';
import { CalendarMode } from '../types/timeline';
import { dateUtils } from '../utils/dateUtils';

export function useCalendar(mode: CalendarMode = 'single') {
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(dateUtils.today());

  const toggleDate = useCallback((date: string) => {
    if (mode === 'single') {
      setSelectedDates(new Set([date]));
    } else if (mode === 'multi') {
      const newSet = new Set(selectedDates);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      setSelectedDates(newSet);
    } else if (mode === 'range') {
      if (!rangeStart) {
        setRangeStart(date);
      } else if (!rangeEnd) {
        if (dateUtils.isBefore(date, rangeStart)) {
          setRangeStart(date);
          setRangeEnd(rangeStart);
        } else {
          setRangeEnd(date);
        }
        updateRangeSelection(rangeStart, date);
      } else {
        setRangeStart(date);
        setRangeEnd(null);
      }
    }
  }, [mode, selectedDates, rangeStart, rangeEnd]);

  const updateRangeSelection = useCallback((start: string, end: string) => {
    const dates = new Set<string>();
    let current = start;
    while (dateUtils.isBefore(current, end) || dateUtils.isSameDay(current, end)) {
      dates.add(current);
      current = dateUtils.addDays(current, 1);
    }
    setSelectedDates(dates);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedDates(new Set());
    setRangeStart(null);
    setRangeEnd(null);
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentMonth(dateUtils.addDays(currentMonth, 30));
  }, [currentMonth]);

  const previousMonth = useCallback(() => {
    setCurrentMonth(dateUtils.subtractDays(currentMonth, 30));
  }, [currentMonth]);

  const isDateSelected = useCallback((date: string) => {
    return selectedDates.has(date);
  }, [selectedDates]);

  const monthDays = useMemo(() => {
    return dateUtils.getMonthDays(currentMonth);
  }, [currentMonth]);

  return {
    selectedDates,
    rangeStart,
    rangeEnd,
    currentMonth,
    monthDays,
    toggleDate,
    clearSelection,
    nextMonth,
    previousMonth,
    isDateSelected,
  };
}
