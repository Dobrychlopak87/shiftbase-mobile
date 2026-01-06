import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { storageService } from '../services/storage';
import { exportService } from '../services/export';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export function SettingsScreen() {
  const { colors, theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();
  const { entries, projects } = useApp();
  const [settings, setSettings] = useState(storageService.getDefaultSettings());

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const loaded = await storageService.getSettings();
    setSettings(loaded);
  };

  const handleExportJSON = async () => {
    try {
      const data = await storageService.exportData(entries, projects, settings);
      await exportService.shareJSON(entries, projects, settings);
      Alert.alert(t.common.success, 'Data exported successfully');
    } catch (error) {
      Alert.alert(t.common.error, 'Failed to export data');
    }
  };

  const handleExportCSV = async () => {
    try {
      await exportService.shareCSV(entries, projects);
      Alert.alert(t.common.success, 'Data exported successfully');
    } catch (error) {
      Alert.alert(t.common.error, 'Failed to export data');
    }
  };

  const handleClearAll = () => {
    Alert.alert('Clear All Data', 'This action cannot be undone. Are you sure?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Clear',
        onPress: async () => {
          await storageService.clearAll();
          Alert.alert(t.common.success, 'All data cleared');
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
    settingItem: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    settingLabel: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    buttonGroup: {
      gap: 8,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.settings.title}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>{t.profile.theme}</Text>
            <TouchableOpacity onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>
                {theme === 'light' ? 'Light' : 'Dark'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>{t.profile.language}</Text>
            <TouchableOpacity onPress={() => setLanguage(language === 'en' ? 'pl' : 'en')}>
              <Text style={{ color: colors.primary, fontWeight: '600' }}>
                {language === 'en' ? 'English' : 'Polski'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>{t.settings.soundEnabled}</Text>
            <Switch
              value={settings.soundEnabled}
              onValueChange={async value => {
                const updated = { ...settings, soundEnabled: value };
                setSettings(updated);
                await storageService.saveSettings(updated);
              }}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>{t.settings.hapticEnabled}</Text>
            <Switch
              value={settings.hapticEnabled}
              onValueChange={async value => {
                const updated = { ...settings, hapticEnabled: value };
                setSettings(updated);
                await storageService.saveSettings(updated);
              }}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.buttonGroup}>
            <Button label="Export as JSON" onPress={handleExportJSON} variant="secondary" />
            <Button label="Export as CSV" onPress={handleExportCSV} variant="secondary" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <Button label="Clear All Data" onPress={handleClearAll} variant="danger" />
        </View>
      </View>
    </ScrollView>
  );
}
