import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { TestCase } from './types';
import { formatDateTime } from '@/utils/dateFormat';
import { ResultBadge, StatusBadge } from '@/components/Badges';

interface CaseCardProps {
  testCase: TestCase;
  onPress: () => void;
}

export function CaseCard({ testCase, onPress }: CaseCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.sampleId}>{testCase.sampleId}</Text>
        <ChevronRight size={20} color={Colors.gray} strokeWidth={2} />
      </View>
      <Text style={styles.substance}>
        {testCase.substance || 'Substance not identified'}
      </Text>
      <View style={styles.footer}>
        <View style={styles.badges}>
          <ResultBadge result={testCase.result} />
          <StatusBadge status={testCase.status} />
        </View>
        <Text style={styles.date}>{formatDateTime(testCase.date)}</Text>
      </View>
      <Text style={styles.officer}>{testCase.officerName}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.navy[700],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.navy[500],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sampleId: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  substance: {
    fontSize: 14,
    color: Colors.lightGray,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    flexWrap: 'wrap',
    gap: 6,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  date: {
    fontSize: 12,
    color: Colors.gray,
    fontFamily: 'Inter-Regular',
  },
  officer: {
    fontSize: 11,
    color: Colors.darkGray,
    marginTop: 6,
    fontFamily: 'Inter-Regular',
  },
});
