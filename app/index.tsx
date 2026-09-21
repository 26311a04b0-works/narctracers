import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/features/auth/useAuth';

export default function Index() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    } else if (user.role === 'admin') {
      router.replace('/authority/dashboard');
    } else {
      router.replace('/dashboard');
    }
  }, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.navy[800], alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color={Colors.teal[400]} />
    </View>
  );
}
