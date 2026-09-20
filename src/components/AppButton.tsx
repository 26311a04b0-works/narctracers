import { StyleSheet, TouchableOpacity, Text, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import React from 'react';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  style,
}: AppButtonProps) {
  const variantStyle =
    variant === 'primary' ? styles.primary :
    variant === 'secondary' ? styles.secondary :
    variant === 'danger' ? styles.danger :
    styles.ghost;

  const textColor =
    variant === 'ghost' ? Colors.teal[300] :
    variant === 'secondary' ? Colors.teal[300] :
    Colors.white;

  return (
    <TouchableOpacity
      style={[styles.base, variantStyle, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon}
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 12,
    height: 54,
    paddingHorizontal: 20,
  },
  primary: { backgroundColor: Colors.teal[500] },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.teal[500],
  },
  danger: { backgroundColor: Colors.red[500] },
  ghost: { backgroundColor: 'transparent' },
  disabled: { opacity: 0.4 },
  text: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
});
