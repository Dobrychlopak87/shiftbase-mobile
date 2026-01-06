import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useI18n } from '../context/I18nContext';
import { useHaptics } from '../hooks/useHaptics';
import { dateUtils } from '../utils/dateUtils';
import { calculationService } from '../services/calculations';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EntryCard } from '../components/EntryCard';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';

export function RecordsScreen() {
  const { colors } = useTheme();
  const { entries, projects, addEntry, deleteEntry } = useApp();
  const { t } = useI18n();
  const { tap } = useHaptics();

  const [selectedDate, setSelectedDate] = useState(dateUtils.today());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: selectedDate,
    startTime: '09:00',
    endTime: '17:00',
    description: '',
    projectId: null as string | null,
    category: 'work' as const,
    breakTime: 0,
    location: '',
    notes: '',
  });

  const dayEntries = useMemo(() => {
    return entries.filter(e => e.date === selectedDate);
  }, [entries, selectedDate]);

  const dailyTotal = useMemo(() => {
    return calculationService.calculateDailyTotal(dayEntries, selectedDate);
  }, [dayEntries, selectedDate]);

  const handleAddEntry = async () => {
    if (!formData.description.trim()) {
      Alert.alert(t.common.error, 'Description is required');
      return;
    }

    const hours = calculationService.calculateHours(formData.startTime, formData.endTime, formData.breakTime);

    const newEntry = {
      id: Date.now().toString(),
      ...formData,
      hours,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await addEntry(newEntry);
    await tap();
    setShowForm(false);
    setFormData({
      date: selectedDate,
      startTime: '09:00',
      endTime: '17:00',
      description: '',
      projectId: null,
      category: 'work',
      breakTime: 0,
      location: '',
      notes: '',
    });
  };

  const handleDeleteEntry = (id: string) => {
    Alert.alert(t.common.delete, t.records.deleteConfirm, [
      { text: t.common.cancel, onPress: () => {} },
      {
        text: t.common.delete,
        onPress: async () => {
          await deleteEntry(id);
          await tap();
        },
        style: 'destructive',
      },
    ]);
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
    dateNavigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    dateButton: {
      padding: 8,
    },
    dateText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    stats: {
      flexDirection: 'row',
      gap: 12,
    },
    statItem: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 8,
      alignItems: 'center',
    },
    statLabel: {
      fontSize: 11,
      color: colors.textMuted,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primary,
    },
    content: {
      flex: 1,
      padding: 12,
    },
    emptyText: {
      textAlign: 'center',
      color: colors.textMuted,
      marginTop: 20,
    },
    fab: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    fabText: {
      fontSize: 28,
      color: '#ffffff',
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dateNavigation}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setSelectedDate(dateUtils.subtractDays(selectedDate, 1))}
          >
            <Text style={styles.dateText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>{dateUtils.formatDateDisplay(selectedDate)}</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setSelectedDate(dateUtils.addDays(selectedDate, 1))}
          >
            <Text style={styles.dateText}>›</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>{t.records.totalHours}</Text>
            <Text style={styles.statValue}>{dailyTotal.toFixed(1)}h</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Entries</Text>
            <Text style={styles.statValue}>{dayEntries.length}</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={dayEntries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EntryCard
            entry={item}
            projectColor={item.projectId ? projects.find(p => p.id === item.projectId)?.color : undefined}
            onDelete={() => handleDeleteEntry(item.id)}
          />
        )}
        contentContainerStyle={styles.content}
        ListEmptyComponent={<Text style={styles.emptyText}>{t.common.empty}</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setShowForm(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={showForm}
        title={t.records.addEntry}
        onClose={() => setShowForm(false)}
        actions={
          <View style={{ gap: 8, flexDirection: 'row' }}>
            <Button label={t.common.cancel} onPress={() => setShowForm(false)} variant="secondary" />
            <Button label={t.common.save} onPress={handleAddEntry} />
          </View>
        }
      >
        <Input
          label={t.records.description}
          value={formData.description}
          onChangeText={text => setFormData({ ...formData, description: text })}
          placeholder="What did you work on?"
          required
        />
        <Input
          label={t.records.startTime}
          value={formData.startTime}
          onChangeText={text => setFormData({ ...formData, startTime: text })}
          placeholder="HH:MM"
        />
        <Input
          label={t.records.endTime}
          value={formData.endTime}
          onChangeText={text => setFormData({ ...formData, endTime: text })}
          placeholder="HH:MM"
        />
        <Input
          label={t.records.breakTime}
          value={formData.breakTime.toString()}
          onChangeText={text => setFormData({ ...formData, breakTime: parseInt(text) || 0 })}
          placeholder="0"
          keyboardType="numeric"
        />
      </Modal>
    </View>
  );
}
