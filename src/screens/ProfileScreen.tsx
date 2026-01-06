import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useI18n } from '../context/I18nContext';
import { calculationService } from '../services/calculations';
import { formatters } from '../utils/formatters';
import { Card } from '../components/Card';

export function ProfileScreen() {
  const { colors } = useTheme();
  const { entries, projects } = useApp();
  const { t } = useI18n();

  const profileStats = useMemo(() => {
    const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
    const dateRange = calculationService.getDateRange(entries);
    const totalDays = dateRange.start && dateRange.end ? calculationService.filterEntriesByDateRange(entries, dateRange.start, dateRange.end).length : 0;

    return {
      totalHours,
      totalEntries: entries.length,
      totalProjects: projects.length,
      dateRange,
      averagePerEntry: entries.length > 0 ? totalHours / entries.length : 0,
    };
  }, [entries, projects]);

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
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    statItem: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statLabel: {
      fontSize: 14,
      color: colors.text,
    },
    statValue: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.primary,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.profile.title}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>{t.overview.totalHours}</Text>
            <Text style={styles.statValue}>{formatters.formatHours(profileStats.totalHours)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Entries</Text>
            <Text style={styles.statValue}>{profileStats.totalEntries}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Projects</Text>
            <Text style={styles.statValue}>{profileStats.totalProjects}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Average per Entry</Text>
            <Text style={styles.statValue}>{formatters.formatHours(profileStats.averagePerEntry)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date Range</Text>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>First Entry</Text>
            <Text style={styles.statValue}>{profileStats.dateRange.start || 'N/A'}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Latest Entry</Text>
            <Text style={styles.statValue}>{profileStats.dateRange.end || 'N/A'}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
