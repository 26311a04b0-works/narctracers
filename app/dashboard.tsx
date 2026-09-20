import { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Plus, Search, LogOut, CircleUser as UserCircle, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { OfflineStatusBanner } from '@/components/OfflineStatusBanner';
import { CaseCard } from '@/features/cases/CaseCard';
import { useAuth } from '@/features/auth/useAuth';
import { filterCasesByOfficer, searchCases } from '@/features/cases/caseService';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout, cases } = useAuth();
  const [search, setSearch] = useState('');
  const [online, setOnline] = useState(true);

  const visibleCases = useMemo(() => {
    const myCases = filterCasesByOfficer(cases, user?.officerId || '');
    return searchCases(myCases, search);
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
        <OfflineStatusBanner online={online} onToggle={() => setOnline((o) => !o)} />
      </View>

      <DisclaimerBanner compact />

      <View style={styles.newTestContainer}>
        <TouchableOpacity
          style={styles.newTestButton}
          onPress={() => router.push('/new-test')}
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
          <CaseCard testCase={item} onPress={() => router.push({ pathname: '/case/[id]', params: { id: item.id } })} />
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
  container: { flex: 1, backgroundColor: Colors.navy[800] },
  header: { backgroundColor: Colors.navy[900], paddingHorizontal: 20, paddingTop: 52, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Colors.navy[600] },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flexDirection: 'row', gap: 12, flex: 1 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.navy[600], alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.teal[500] },
  officerName: { fontSize: 17, fontWeight: '700', color: Colors.white, fontFamily: 'Inter-Bold' },
  officerId: { fontSize: 12, color: Colors.teal[300], marginTop: 2, fontFamily: 'Inter-Regular' },
  station: { fontSize: 11, color: Colors.gray, marginTop: 2, fontFamily: 'Inter-Regular' },
  logoutBtn: { padding: 8 },
  newTestContainer: { paddingHorizontal: 20, paddingTop: 16 },
  newTestButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.teal[500], borderRadius: 14, height: 56 },
  newTestText: { fontSize: 18, fontWeight: '700', color: Colors.white, fontFamily: 'Inter-Bold' },
  searchContainer: { paddingHorizontal: 20, paddingTop: 16 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.navy[900], borderWidth: 1, borderColor: Colors.navy[500], borderRadius: 10, paddingHorizontal: 16, height: 48 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.white, fontFamily: 'Inter-Regular' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  listTitle: { fontSize: 15, fontWeight: '700', color: Colors.lightGray, fontFamily: 'Inter-Bold' },
  listCount: { fontSize: 12, color: Colors.gray, fontFamily: 'Inter-Regular' },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  emptyState: { alignItems: 'center', paddingTop: 40 },
  emptyText: { fontSize: 14, color: Colors.gray, textAlign: 'center', fontFamily: 'Inter-Regular' },
});
