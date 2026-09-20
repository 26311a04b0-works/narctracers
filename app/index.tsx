import { View } from 'react-native';

/**
 * Root index — the AuthGate in _layout.tsx handles redirecting
 * to /login, /dashboard, or /authority/dashboard based on auth state.
 */
export default function Index() {
  return <View style={{ flex: 1, backgroundColor: '#0d1f33' }} />;
}
