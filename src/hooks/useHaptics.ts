import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function useHaptics(enabled: boolean = true) {
  const tap = useCallback(async () => {
    if (enabled && Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.error('Error triggering tap haptic:', error);
      }
    }
  }, [enabled]);

  const success = useCallback(async () => {
    if (enabled && Platform.OS !== 'web') {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error('Error triggering success haptic:', error);
      }
    }
  }, [enabled]);

  const error = useCallback(async () => {
    if (enabled && Platform.OS !== 'web') {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch (error) {
        console.error('Error triggering error haptic:', error);
      }
    }
  }, [enabled]);

  const medium = useCallback(async () => {
    if (enabled && Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.error('Error triggering medium haptic:', error);
      }
    }
  }, [enabled]);

  return { tap, success, error, medium };
}
