import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { useI18n } from '../context/I18nContext';
import { useHaptics } from '../hooks/useHaptics';
import { PROJECT_COLORS } from '../constants/colors';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProjectCard } from '../components/ProjectCard';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';

export function ProjectsScreen() {
  const { colors } = useTheme();
  const { projects, addProject, deleteProject } = useApp();
  const { t } = useI18n();
  const { tap } = useHaptics();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: PROJECT_COLORS[0],
  });

  const handleAddProject = async () => {
    if (!formData.name.trim()) {
      Alert.alert(t.common.error, 'Project name is required');
      return;
    }

    const newProject = {
      id: Date.now().toString(),
      name: formData.name,
      color: formData.color,
      totalHours: 0,
      entryCount: 0,
      lastUsed: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await addProject(newProject);
    await tap();
    setShowForm(false);
    setFormData({
      name: '',
      color: PROJECT_COLORS[0],
    });
  };

  const handleDeleteProject = (id: string) => {
    Alert.alert(t.common.delete, t.projects.deleteConfirm, [
      { text: t.common.cancel, onPress: () => {} },
      {
        text: t.common.delete,
        onPress: async () => {
          await deleteProject(id);
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
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
    colorPicker: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
    },
    colorOption: {
      width: '30%',
      height: 50,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    colorSelected: {
      borderColor: colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.projects.title}</Text>
      </View>

      <FlatList
        data={projects}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onDelete={() => handleDeleteProject(item.id)}
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
        title={t.projects.addProject}
        onClose={() => setShowForm(false)}
        actions={
          <View style={{ gap: 8, flexDirection: 'row' }}>
            <Button label={t.common.cancel} onPress={() => setShowForm(false)} variant="secondary" />
            <Button label={t.common.save} onPress={handleAddProject} />
          </View>
        }
      >
        <Input
          label={t.projects.name}
          value={formData.name}
          onChangeText={text => setFormData({ ...formData, name: text })}
          placeholder="Project name"
          required
        />
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 12, marginBottom: 8 }}>
          {t.projects.color}
        </Text>
        <View style={styles.colorPicker}>
          {PROJECT_COLORS.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                formData.color === color && styles.colorSelected,
              ]}
              onPress={() => setFormData({ ...formData, color })}
            />
          ))}
        </View>
      </Modal>
    </View>
  );
}
