import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import React from 'react';

interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function AppCard({ children, style }: AppCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.navy[700],
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.navy[500],
  },
});
