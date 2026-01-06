import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useI18n } from '../context/I18nContext';
import { calculationService } from '../services/calculations';
import { dateUtils } from '../utils/dateUtils';
import { formatters } from '../utils/formatters';
import { Card } from '../components/Card';
import { WeeklyChart } from '../components/WeeklyChart';

export function OverviewScreen() {
  const { colors } = useTheme();
  const { entries } = useApp();
  const { t } = useI18n();

  const stats = useMemo(() => {
    const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
    const weekStart = dateUtils.getWeekStart(dateUtils.today());
    const weeklyHours = calculationService.calculateWeeklyTotal(entries, weekStart);
    const averageDaily = calculationService.calculateAverageDaily(entries);
    const totalBreaks = entries.reduce((sum, e) => sum + e.breakTime, 0);

    return {
      totalHours,
      weeklyHours,
      averageDaily,
      totalBreaks,
      entryCount: entries.length,
    };
  }, [entries]);

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
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 16,
    },
    statCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 8,
      fontWeight: '500',
    },
    statValue: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.primary,
    },
    chartContainer: {
      marginBottom: 16,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.overview.title}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{t.overview.totalHours}</Text>
            <Text style={styles.statValue}>{formatters.formatHours(stats.totalHours)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{t.overview.thisWeek}</Text>
            <Text style={styles.statValue}>{formatters.formatHours(stats.weeklyHours)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{t.overview.averageDaily}</Text>
            <Text style={styles.statValue}>{formatters.formatHours(stats.averageDaily)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{t.overview.totalBreaks}</Text>
            <Text style={styles.statValue}>{formatters.formatMinutes(stats.totalBreaks)}</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <WeeklyChart entries={entries} startDate={dateUtils.getWeekStart(dateUtils.today())} />
        </View>
      </View>
    </ScrollView>
  );
}
