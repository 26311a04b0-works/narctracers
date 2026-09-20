import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { TestResult, CaseStatus } from '@/features/cases/types';

const resultStyles: Record<TestResult, { bg: string; text: string }> = {
  Positive: { bg: 'rgba(231, 76, 60, 0.15)', text: Colors.red[400] },
  Negative: { bg: 'rgba(39, 174, 96, 0.15)', text: Colors.green[400] },
  Inconclusive: { bg: 'rgba(245, 176, 65, 0.15)', text: Colors.amber[400] },
  Pending: { bg: 'rgba(136, 150, 168, 0.15)', text: Colors.gray },
};

const statusStyles: Record<CaseStatus, { bg: string; text: string }> = {
  Saved: { bg: 'rgba(20, 145, 139, 0.15)', text: Colors.teal[400] },
  Submitted: { bg: 'rgba(243, 156, 18, 0.12)', text: Colors.amber[400] },
  Approved: { bg: 'rgba(39, 174, 96, 0.15)', text: Colors.green[400] },
  Rejected: { bg: 'rgba(231, 76, 60, 0.15)', text: Colors.red[400] },
  Verified: { bg: 'rgba(39, 174, 96, 0.15)', text: Colors.green[400] },
  Pending: { bg: 'rgba(136, 150, 168, 0.15)', text: Colors.gray },
};

export function ResultBadge({ result }: { result: TestResult }) {
  const s = resultStyles[result];
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.text }]}>{result}</Text>
    </View>
  );
}

export function StatusBadge({ status }: { status: CaseStatus }) {
  const s = statusStyles[status];
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.text }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3, fontFamily: 'Inter-Bold' },
});
