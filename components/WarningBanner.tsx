import { StyleSheet, View, Text } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

export function WarningBanner({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <ShieldAlert size={compact ? 16 : 20} color={Colors.amber[500]} strokeWidth={2} />
      <Text
        style={[styles.text, compact && styles.compactText]}
        numberOfLines={compact ? 2 : undefined}
      >
        Presumptive field result only — laboratory confirmation required.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(243, 156, 18, 0.12)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(243, 156, 18, 0.3)',
  },
  compact: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.amber[400],
    lineHeight: 18,
  },
  compactText: {
    fontSize: 11,
    lineHeight: 15,
  },
});
