import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Project } from '../types/project';
import { formatters } from '../utils/formatters';

interface ProjectCardProps {
  project: Project;
  onPress?: () => void;
  onDelete?: () => void;
}

export function ProjectCard({ project, onPress, onDelete }: ProjectCardProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    colorDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    stats: {
      fontSize: 12,
      color: colors.textMuted,
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
        <View style={[styles.colorDot, { backgroundColor: project.color }]} />
        <View style={styles.info}>
          <Text style={styles.name}>{project.name}</Text>
          <Text style={styles.stats}>
            {project.entryCount} entries • {formatters.formatHours(project.totalHours)}
          </Text>
        </View>
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
