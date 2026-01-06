import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Entry } from '../types/entry';
import { formatters } from '../utils/formatters';

interface EntryCardProps {
  entry: Entry;
  projectColor?: string;
  onPress?: () => void;
  onDelete?: () => void;
}

export function EntryCard({ entry, projectColor, onPress, onDelete }: EntryCardProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      borderLeftWidth: 4,
      borderLeftColor: projectColor || colors.primary,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    content: {
      flex: 1,
    },
    description: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    time: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 4,
    },
    hours: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
    },
    actions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 8,
    },
    actionText: {
      fontSize: 16,
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <Text style={styles.description}>{entry.description}</Text>
        <Text style={styles.time}>{formatters.formatTimeRange(entry.startTime, entry.endTime)}</Text>
        <Text style={styles.hours}>{formatters.formatHours(entry.hours)}</Text>
      </View>
      <View style={styles.actions}>
        {onDelete && (
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Text style={[styles.actionText, { color: colors.error }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}
