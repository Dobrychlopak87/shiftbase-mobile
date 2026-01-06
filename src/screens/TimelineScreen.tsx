import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useI18n } from '../context/I18nContext';
import { useCalendar } from '../hooks/useCalendar';
import { dateUtils } from '../utils/dateUtils';
import { formatters } from '../utils/formatters';
import { calculationService } from '../services/calculations';
import { CalendarGrid } from '../components/CalendarGrid';
import { Card } from '../components/Card';

export function TimelineScreen() {
  const { colors } = useTheme();
  const { entries } = useApp();
  const { t } = useI18n();
  const calendar = useCalendar('single');

  const selectedDateEntries = Array.from(calendar.selectedDates).flatMap(date =>
    entries.filter(e => e.date === date)
  );

  const selectedDateStats = {
    totalHours: selectedDateEntries.reduce((sum, e) => sum + e.hours, 0),
    entryCount: selectedDateEntries.length,
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    content: {
      padding: 12,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
    },
    statLabel: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
    },
    entriesList: {
      marginTop: 16,
    },
    entryItem: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    entryDate: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 4,
    },
    entryDesc: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    entryTime: {
      fontSize: 12,
      color: colors.textMuted,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.timeline.title}</Text>
      </View>

      <View style={styles.content}>
        <CalendarGrid
          selectedDates={calendar.selectedDates}
          onDateSelect={calendar.toggleDate}
          month={calendar.currentMonth}
          onMonthChange={direction => {
            if (direction === 'prev') calendar.previousMonth();
            else calendar.nextMonth();
          }}
        />

        {calendar.selectedDates.size > 0 && (
          <>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>{t.overview.totalHours}</Text>
                <Text style={styles.statValue}>{formatters.formatHours(selectedDateStats.totalHours)}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Entries</Text>
                <Text style={styles.statValue}>{selectedDateStats.entryCount}</Text>
              </View>
            </View>

            <View style={styles.entriesList}>
              {selectedDateEntries.map(entry => (
                <View key={entry.id} style={styles.entryItem}>
                  <Text style={styles.entryDate}>{entry.date}</Text>
                  <Text style={styles.entryDesc}>{entry.description}</Text>
                  <Text style={styles.entryTime}>
                    {formatters.formatTimeRange(entry.startTime, entry.endTime)} • {formatters.formatHours(entry.hours)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
