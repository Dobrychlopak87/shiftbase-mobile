import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useI18n } from '../context/I18nContext';
import { calculationService } from '../services/calculations';
import { formatters } from '../utils/formatters';
import { Card } from '../components/Card';

export function ReportsScreen() {
  const { colors } = useTheme();
  const { entries, projects } = useApp();
  const { t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoryBreakdown = useMemo(() => {
    const breakdown = calculationService.calculateCategoryBreakdown(entries);
    return Object.entries(breakdown).map(([category, hours]) => ({
      category,
      hours,
      percent: (hours / (Object.values(breakdown).reduce((a, b) => a + b, 0) || 1)) * 100,
    }));
  }, [entries]);

  const projectBreakdown = useMemo(() => {
    return projects.map(project => ({
      project,
      hours: project.totalHours,
      percent: (project.totalHours / (projects.reduce((sum, p) => sum + p.totalHours, 0) || 1)) * 100,
    }));
  }, [projects]);

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
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginTop: 16,
      marginBottom: 12,
    },
    item: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemLeft: {
      flex: 1,
    },
    itemName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    itemBar: {
      height: 6,
      backgroundColor: colors.surface,
      borderRadius: 3,
      marginTop: 4,
      overflow: 'hidden',
    },
    itemBarFill: {
      height: '100%',
      backgroundColor: colors.primary,
    },
    itemRight: {
      alignItems: 'flex-end',
    },
    itemHours: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primary,
    },
    itemPercent: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.reports.title}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        {categoryBreakdown.map(item => (
          <View key={item.category} style={styles.item}>
            <View style={styles.itemLeft}>
              <Text style={styles.itemName}>{formatters.capitalizeFirst(item.category)}</Text>
              <View style={styles.itemBar}>
                <View style={[styles.itemBarFill, { width: `${item.percent}%` }]} />
              </View>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemHours}>{formatters.formatHours(item.hours)}</Text>
              <Text style={styles.itemPercent}>{item.percent.toFixed(1)}%</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Project Breakdown</Text>
        {projectBreakdown.map(item => (
          <View key={item.project.id} style={styles.item}>
            <View style={styles.itemLeft}>
              <Text style={styles.itemName}>{item.project.name}</Text>
              <View style={styles.itemBar}>
                <View style={[styles.itemBarFill, { width: `${item.percent}%`, backgroundColor: item.project.color }]} />
              </View>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemHours}>{formatters.formatHours(item.hours)}</Text>
              <Text style={styles.itemPercent}>{item.percent.toFixed(1)}%</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
