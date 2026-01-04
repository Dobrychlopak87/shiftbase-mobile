import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput, Modal, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

// Types
interface Entry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  project: string;
  category: 'work' | 'overtime' | 'vacation';
  breakTime: number;
}

interface Project {
  id: string;
  name: string;
  color: string;
}

// Colors
const COLORS = {
  primary: '#0a7ea4',
  background: '#ffffff',
  card: '#f5f5f5',
  text: '#11181C',
  textMuted: '#687076',
  border: '#E5E7EB',
  error: '#EF4444',
};

// Records Screen
function RecordsScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    description: '',
    project: '',
    category: 'work' as const,
    breakTime: '0',
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await AsyncStorage.getItem('entries');
      if (data) setEntries(JSON.parse(data));
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const saveEntry = async () => {
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    const newEntry: Entry = {
      id: Date.now().toString(),
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      description: formData.description,
      project: formData.project,
      category: formData.category,
      breakTime: parseInt(formData.breakTime) || 0,
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    await AsyncStorage.setItem('entries', JSON.stringify(updated));
    setShowForm(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      description: '',
      project: '',
      category: 'work',
      breakTime: '0',
    });
  };

  const deleteEntry = async (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    await AsyncStorage.setItem('entries', JSON.stringify(updated));
  };

  const calculateHours = (start: string, end: string, breakTime: number) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    const totalMinutes = endMinutes - startMinutes;
    const hours = (totalMinutes - breakTime) / 60;
    return Math.max(0, hours).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Records</Text>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryDate}>{item.date}</Text>
              <TouchableOpacity onPress={() => deleteEntry(item.id)}>
                <Text style={styles.deleteBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.entryDesc}>{item.description}</Text>
            <View style={styles.entryFooter}>
              <Text style={styles.entryTime}>{item.startTime} - {item.endTime}</Text>
              <Text style={styles.entryHours}>
                {calculateHours(item.startTime, item.endTime, item.breakTime)}h
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <Modal visible={showForm} animationType="slide">
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <TouchableOpacity onPress={() => setShowForm(false)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.formTitle}>New Entry</Text>
            <TouchableOpacity onPress={saveEntry}>
              <Text style={styles.saveBtn}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContent}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              value={formData.date}
              onChangeText={text => setFormData({ ...formData, date: text })}
              placeholder="YYYY-MM-DD"
            />

            <Text style={styles.label}>Start Time</Text>
            <TextInput
              style={styles.input}
              value={formData.startTime}
              onChangeText={text => setFormData({ ...formData, startTime: text })}
              placeholder="HH:MM"
            />

            <Text style={styles.label}>End Time</Text>
            <TextInput
              style={styles.input}
              value={formData.endTime}
              onChangeText={text => setFormData({ ...formData, endTime: text })}
              placeholder="HH:MM"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { minHeight: 80 }]}
              value={formData.description}
              onChangeText={text => setFormData({ ...formData, description: text })}
              placeholder="What did you work on?"
              multiline
            />

            <Text style={styles.label}>Project</Text>
            <TextInput
              style={styles.input}
              value={formData.project}
              onChangeText={text => setFormData({ ...formData, project: text })}
              placeholder="Project name"
            />

            <Text style={styles.label}>Break Time (minutes)</Text>
            <TextInput
              style={styles.input}
              value={formData.breakTime}
              onChangeText={text => setFormData({ ...formData, breakTime: text })}
              placeholder="0"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryButtons}>
              {(['work', 'overtime', 'vacation'] as const).map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryBtn,
                    formData.category === cat && styles.categoryBtnActive,
                  ]}
                  onPress={() => setFormData({ ...formData, category: cat })}
                >
                  <Text style={styles.categoryBtnText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// Projects Screen
function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await AsyncStorage.getItem('projects');
      if (data) setProjects(JSON.parse(data));
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const saveProject = async () => {
    if (!projectName.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }

    const newProject: Project = {
      id: Date.now().toString(),
      name: projectName,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    };

    const updated = [...projects, newProject];
    setProjects(updated);
    await AsyncStorage.setItem('projects', JSON.stringify(updated));
    setShowForm(false);
    setProjectName('');
  };

  const deleteProject = async (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    await AsyncStorage.setItem('projects', JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Projects</Text>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={projects}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.projectCard}>
            <View style={[styles.projectColor, { backgroundColor: item.color }]} />
            <Text style={styles.projectName}>{item.name}</Text>
            <TouchableOpacity onPress={() => deleteProject(item.id)}>
              <Text style={styles.deleteBtn}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <Modal visible={showForm} animationType="slide">
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <TouchableOpacity onPress={() => setShowForm(false)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.formTitle}>New Project</Text>
            <TouchableOpacity onPress={saveProject}>
              <Text style={styles.saveBtn}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContent}>
            <Text style={styles.label}>Project Name</Text>
            <TextInput
              style={styles.input}
              value={projectName}
              onChangeText={setProjectName}
              placeholder="Enter project name"
              autoFocus
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Overview Screen
function OverviewScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await AsyncStorage.getItem('entries');
      if (data) setEntries(JSON.parse(data));
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const totalHours = entries.reduce((sum, e) => {
    const [sh, sm] = e.startTime.split(':').map(Number);
    const [eh, em] = e.endTime.split(':').map(Number);
    const minutes = (eh * 60 + em) - (sh * 60 + sm) - e.breakTime;
    return sum + minutes / 60;
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Overview</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Hours</Text>
          <Text style={styles.statValue}>{totalHours.toFixed(2)}h</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Entries</Text>
          <Text style={styles.statValue}>{entries.length}</Text>
        </View>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 12,
  },
  entryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  deleteBtn: {
    fontSize: 16,
    color: COLORS.error,
    fontWeight: 'bold',
  },
  entryDesc: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
    marginBottom: 8,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entryTime: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  entryHours: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeBtn: {
    fontSize: 24,
    color: COLORS.text,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  saveBtn: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  formContent: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  categoryBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  categoryBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  projectColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  projectName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

// Main App Component
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Tab.Screen
          name="Records"
          component={RecordsScreen}
          options={{
            tabBarLabel: 'Records',
          }}
        />
        <Tab.Screen
          name="Projects"
          component={ProjectsScreen}
          options={{
            tabBarLabel: 'Projects',
          }}
        />
        <Tab.Screen
          name="Overview"
          component={OverviewScreen}
          options={{
            tabBarLabel: 'Overview',
          }}
        />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
