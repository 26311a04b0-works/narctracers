import { StyleSheet, View, Text } from 'react-native';
import { ImageOff } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface PlaceholderImageProps {
  label?: string;
  size?: number;
  borderRadius?: number;
}

export function PlaceholderImage({
  label = 'Evidence photo placeholder',
  size = 200,
  borderRadius = 12,
}: PlaceholderImageProps) {
  return (
    <View
      style={[
        styles.container,
        { width: '100%', height: size, borderRadius },
      ]}
    >
      <ImageOff size={40} color={Colors.navy[400]} strokeWidth={1.5} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.navy[800],
    borderWidth: 1,
    borderColor: Colors.navy[500],
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: Colors.navy[400],
    fontFamily: 'Inter-Regular',
  },
});
