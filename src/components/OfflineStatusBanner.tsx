import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Wifi, WifiOff } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface OfflineStatusBannerProps {
  online: boolean;
  onToggle?: () => void;
}

export function OfflineStatusBanner({ online, onToggle }: OfflineStatusBannerProps) {
  return (
    <TouchableOpacity
      style={[styles.badge, online ? styles.online : styles.offline]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      {online ? (
        <Wifi size={13} color={Colors.green[400]} strokeWidth={2} />
      ) : (
        <WifiOff size={13} color={Colors.gray} strokeWidth={2} />
      )}
      <Text style={[styles.text, online ? styles.textOn : styles.textOff]}>
        {online ? 'Online' : 'Offline'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  online: {
    backgroundColor: 'rgba(39, 174, 96, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(39, 174, 96, 0.3)',
  },
  offline: {
    backgroundColor: 'rgba(136, 150, 168, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(136, 150, 168, 0.2)',
  },
  text: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter-SemiBold' },
  textOn: { color: Colors.green[400] },
  textOff: { color: Colors.gray },
});
