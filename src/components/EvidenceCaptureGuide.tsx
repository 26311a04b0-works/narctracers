import { StyleSheet, View, Text } from 'react-native';
import { Camera } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

/**
 * Displays the evidence capture instructions that remind the officer
 * to place the officer ID badge / case-ID slip beside the sample.
 */
export function EvidenceCaptureGuide() {
  return (
    <View style={styles.container}>
      <Camera size={20} color={Colors.amber[400]} strokeWidth={2} />
      <Text style={styles.text}>
        Place the sample/reaction kit and the officer ID badge or generated case-ID slip together in the camera frame.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(243, 156, 18, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(243, 156, 18, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.amber[400],
    lineHeight: 20,
    fontFamily: 'Inter-SemiBold',
  },
});
