import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import {
  Plus,
  Search,
  LogOut,
  Wifi,
  WifiOff,
  CircleUser as UserCircle,
  MapPin,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { WarningBanner } from '@/components/WarningBanner';
import { CaseCard } from '@/components/CaseCard';
import { useApp } from '@/context/AppContext';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout, cases } = useApp();
  const [search, setSearch] = useState('');
  const [online, setOnline] = useState(true);

  const visibleCases = useMemo(() => {
    const filtered = cases.filter((c) => c.officerId === user?.officerId);
    if (!search.trim()) return filtered;
    return filtered.filter((c) =>
      c.sampleId.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [cases, user, search]);

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <UserCircle size={28} color={Colors.teal[400]} strokeWidth={2} />
            </View>
            <View>
              <Text style={styles.officerName}>{user.name}</Text>
              <Text style={styles.officerId}>{user.officerId}</Text>
              <Text style={styles.station}>
                <MapPin size={10} color={Colors.gray} strokeWidth={2} /> {user.station}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <LogOut size={20} color={Colors.lightGray} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.statusBadge, online ? styles.online : styles.offline]}
          onPress={() => setOnline((o) => !o)}
          activeOpacity={0.7}
        >
          {online ? (
            <Wifi size={13} color={Colors.green[400]} strokeWidth={2} />
          ) : (
            <WifiOff size={13} color={Colors.gray} strokeWidth={2} />
          )}
          <Text style={[styles.statusText, online ? styles.statusTextOn : styles.statusTextOff]}>
            {online ? 'Online' : 'Offline'}
          </Text>
        </TouchableOpacity>
      </View>

      <WarningBanner compact />

      <View style={styles.newTestContainer}>
        <TouchableOpacity
          style={styles.newTestButton}
          onPress={() => router.push('/(tabs)/new-test')}
          activeOpacity={0.8}
        >
          <Plus size={26} color={Colors.white} strokeWidth={2.5} />
          <Text style={styles.newTestText}>New Test</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <Search size={18} color={Colors.gray} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Sample ID..."
            placeholderTextColor={Colors.darkGray}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>My Recent Cases</Text>
        <Text style={styles.listCount}>{visibleCases.length} cases</Text>
      </View>

      <FlatList
        data={visibleCases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CaseCard
            testCase={item}
            onPress={() => router.push({ pathname: '/(tabs)/case-detail', params: { id: item.id } })}
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No cases found. Create a new test to get started.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navy[800],
  },
  header: {
    backgroundColor: Colors.navy[900],
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.navy[600],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.navy[600],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.teal[500],
  },
  officerName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  officerId: {
    fontSize: 12,
    color: Colors.teal[300],
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  station: {
    fontSize: 11,
    color: Colors.gray,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  logoutBtn: {
    padding: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginTop: 14,
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
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  statusTextOn: {
    color: Colors.green[400],
  },
  statusTextOff: {
    color: Colors.gray,
  },
  newTestContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  newTestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.teal[500],
    borderRadius: 14,
    height: 56,
  },
  newTestText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.navy[900],
    borderWidth: 1,
    borderColor: Colors.navy[500],
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.white,
    fontFamily: 'Inter-Regular',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.lightGray,
    fontFamily: 'Inter-Bold',
  },
  listCount: {
    fontSize: 12,
    color: Colors.gray,
    fontFamily: 'Inter-Regular',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});
