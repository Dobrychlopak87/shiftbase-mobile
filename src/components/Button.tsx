import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useHaptics } from '../hooks/useHaptics';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  haptic?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  size = 'medium',
  style,
  haptic = true,
}: ButtonProps) {
  const { colors } = useTheme();
  const { tap } = useHaptics(haptic);

  const handlePress = async () => {
    if (!disabled && !loading) {
      await tap();
      onPress();
    }
  };

  const styles = useMemo(() => {
    const baseButton: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.5 : 1,
    };

    const sizeStyles: Record<string, ViewStyle> = {
      small: { paddingHorizontal: 12, paddingVertical: 6 },
      medium: { paddingHorizontal: 16, paddingVertical: 10 },
      large: { paddingHorizontal: 20, paddingVertical: 14 },
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: { backgroundColor: colors.primary },
      secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
      danger: { backgroundColor: colors.error },
    };

    return StyleSheet.create({
      button: { ...baseButton, ...sizeStyles[size], ...variantStyles[variant] },
      text: {
        fontSize: size === 'small' ? 12 : size === 'large' ? 16 : 14,
        fontWeight: '600',
        color: variant === 'secondary' ? colors.text : '#ffffff',
      },
    });
  }, [variant, size, disabled, colors]);

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{loading ? 'Loading...' : label}</Text>
    </TouchableOpacity>
  );
}
