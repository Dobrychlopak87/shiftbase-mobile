import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Entry } from '../types/entry';
import { dateUtils } from '../utils/dateUtils';
import { calculationService } from '../services/calculations';

interface WeeklyChartProps {
  entries: Entry[];
  startDate: string;
}

export function WeeklyChart({ entries, startDate }: WeeklyChartProps) {
  const { colors } = useTheme();

  const weekData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 7; i++) {
      const date = dateUtils.addDays(startDate, i);
      const dayHours = calculationService.calculateDailyTotal(entries, date);
      data.push({
        date,
        day: dateUtils.getDayOfWeek(date).substring(0, 3),
        hours: dayHours,
      });
    }
    return data;
  }, [entries, startDate]);

  const maxHours = Math.max(...weekData.map(d => d.hours), 8);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    chart: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      height: 150,
      gap: 4,
    },
    bar: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    barFill: {
      width: '100%',
      backgroundColor: colors.primary,
      borderRadius: 4,
      marginBottom: 8,
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textMuted,
    },
    hours: {
      fontSize: 10,
      color: colors.text,
      fontWeight: '600',
      marginBottom: 2,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Overview</Text>
      <View style={styles.chart}>
        {weekData.map(day => (
          <View key={day.date} style={styles.bar}>
            <Text style={styles.hours}>{day.hours.toFixed(1)}h</Text>
            <View
              style={[
                styles.barFill,
                {
                  height: (day.hours / maxHours) * 100,
                },
              ]}
            />
            <Text style={styles.label}>{day.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
