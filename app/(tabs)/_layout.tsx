import { Tabs } from 'expo-router';
import { Home, ShieldCheck, Plus } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

export default function TabLayout() {
  const { user } = useApp();
  const isAdmin = user?.role === 'admin';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.navy[900],
          borderTopColor: Colors.navy[600],
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: isAdmin ? Colors.amber[400] : Colors.teal[400],
        tabBarInactiveTintColor: Colors.gray,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          fontFamily: 'Inter-SemiBold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isAdmin ? 'Overview' : 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />

      {isAdmin ? (
        <Tabs.Screen
          name="new-test"
          options={{
          href: null,
          title: 'New Test',
          tabBarIcon: ({ size, color }) => (
            <Plus size={size} color={color} strokeWidth={2} />
          ),
        }}
        />
      ) : (
        <Tabs.Screen
          name="new-test"
          options={{
            title: 'New Test',
            tabBarIcon: ({ size, color }) => (
              <Plus size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
      )}

      {isAdmin ? (
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Approvals',
            tabBarIcon: ({ size, color }) => (
              <ShieldCheck size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="admin"
          options={{
          href: null,
          title: 'Admin',
          tabBarIcon: ({ size, color }) => (
            <ShieldCheck size={size} color={color} strokeWidth={2} />
          ),
        }}
        />
      )}

      <Tabs.Screen
        name="case-detail"
        options={{
          href: null,
          title: 'Case Detail',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
