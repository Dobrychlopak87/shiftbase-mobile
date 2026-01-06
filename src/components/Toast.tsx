import React, { useEffect, useState } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  visible: boolean;
  onDismiss?: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, visible, onDismiss }: ToastProps) {
  const { colors } = useTheme();
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDismiss?.();
      });
    }
  }, [visible, duration, opacity, onDismiss]);

  if (!visible) return null;

  const typeColors = {
    success: colors.success,
    error: colors.error,
    info: colors.primary,
  };

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 20,
      left: 16,
      right: 16,
      backgroundColor: typeColors[type],
      borderRadius: 8,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    text: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '500',
      flex: 1,
    },
  });

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}
