import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { dateUtils } from '../utils/dateUtils';

interface CalendarGridProps {
  selectedDates: Set<string>;
  onDateSelect: (date: string) => void;
  month: string;
  onMonthChange: (direction: 'prev' | 'next') => void;
}

export function CalendarGrid({ selectedDates, onDateSelect, month, onMonthChange }: CalendarGridProps) {
  const { colors } = useTheme();

  const monthDays = useMemo(() => {
    const [year, monthNum] = month.split('-').map(Number);
    const firstDay = new Date(year, monthNum - 1, 1).getDay();
    const daysInMonth = dateUtils.getDaysInMonth(year, monthNum - 1);
    const days: (string | null)[] = Array(firstDay).fill(null);

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(`${year}-${String(monthNum).padStart(2, '0')}-${String(i).padStart(2, '0')}`);
    }

    return days;
  }, [month]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    button: {
      padding: 8,
    },
    buttonText: {
      fontSize: 18,
      color: colors.primary,
    },
    weekDays: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    weekDay: {
      flex: 1,
      textAlign: 'center',
      fontSize: 12,
      fontWeight: '600',
      color: colors.textMuted,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayCell: {
      width: '14.28%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginBottom: 4,
    },
    dayText: {
      fontSize: 12,
      fontWeight: '500',
    },
    selected: {
      backgroundColor: colors.primary,
    },
    selectedText: {
      color: '#ffffff',
    },
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.button} onPress={() => onMonthChange('prev')}>
          <Text style={styles.buttonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{dateUtils.getMonthYear(month)}</Text>
        <TouchableOpacity style={styles.button} onPress={() => onMonthChange('next')}>
          <Text style={styles.buttonText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {weekDays.map(day => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {monthDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dayCell, day && selectedDates.has(day) && styles.selected]}
            onPress={() => day && onDateSelect(day)}
            disabled={!day}
          >
            {day && (
              <Text
                style={[
                  styles.dayText,
                  { color: selectedDates.has(day) ? '#ffffff' : colors.text },
                ]}
              >
                {day.split('-')[2]}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
