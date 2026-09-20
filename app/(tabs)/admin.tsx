import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import {
  Search,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  MapPin,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { WarningBanner } from '@/components/WarningBanner';
import { useApp } from '@/context/AppContext';
import { TestCase } from '@/types';

type FilterTab = 'pending' | 'approved' | 'rejected' | 'all';

export default function AdminScreen() {
  const router = useRouter();
  const { user, logout, cases, approveCase, rejectCase } = useApp();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('pending');

  const filteredCases = useMemo(() => {
    let list = cases;
    if (activeFilter === 'pending') {
      list = cases.filter((c) => c.status === 'Submitted');
    } else if (activeFilter === 'approved') {
      list = cases.filter((c) => c.status === 'Approved');
    } else if (activeFilter === 'rejected') {
      list = cases.filter((c) => c.status === 'Rejected');
    }
    if (!search.trim()) return list;
    return list.filter((c) =>
      c.sampleId.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [cases, search, activeFilter]);

  if (!user) return null;

  const pendingCount = cases.filter((c) => c.status === 'Submitted').length;
  const approvedCount = cases.filter((c) => c.status === 'Approved').length;
  const rejectedCount = cases.filter((c) => c.status === 'Rejected').length;

  const handleApprove = (testCase: TestCase) => {
    Alert.alert(
      'Approve Test Result',
      `Approve case ${testCase.sampleId}?\nResult: ${testCase.result}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Approve', onPress: () => approveCase(testCase.id) },
      ]
    );
  };

  const handleReject = (testCase: TestCase) => {
    Alert.alert(
      'Reject Test Result',
      `Reject case ${testCase.sampleId}?\nThis will mark the case as rejected.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reject', style: 'destructive', onPress: () => rejectCase(testCase.id) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <ShieldCheck size={28} color={Colors.amber[400]} strokeWidth={2} />
            </View>
            <View>
              <Text style={styles.adminName}>{user.name}</Text>
              <Text style={styles.adminId}>{user.officerId}</Text>
              <Text style={styles.station}>
                <MapPin size={10} color={Colors.gray} strokeWidth={2} /> {user.station}
              </Text>
            </View>
          </View>
          <View style={styles.adminBadge}>
            <ShieldCheck size={12} color={Colors.amber[400]} strokeWidth={2} />
            <Text style={styles.adminBadgeText}>ADMIN</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <LogOut size={20} color={Colors.lightGray} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <WarningBanner compact />

      <View style={styles.statsRow}>
        <StatCard label="Pending" value={pendingCount} icon={<Clock size={16} color={Colors.amber[400]} strokeWidth={2} />} accentColor={Colors.amber[400]} />
        <StatCard label="Approved" value={approvedCount} icon={<CheckCircle2 size={16} color={Colors.green[400]} strokeWidth={2} />} accentColor={Colors.green[400]} />
        <StatCard label="Rejected" value={rejectedCount} icon={<XCircle size={16} color={Colors.red[400]} strokeWidth={2} />} accentColor={Colors.red[400]} />
      </View>

      <View style={styles.filterRow}>
        <FilterTabBtn label="Pending" active={activeFilter === 'pending'} onPress={() => setActiveFilter('pending')} count={pendingCount} />
        <FilterTabBtn label="Approved" active={activeFilter === 'approved'} onPress={() => setActiveFilter('approved')} count={approvedCount} />
        <FilterTabBtn label="Rejected" active={activeFilter === 'rejected'} onPress={() => setActiveFilter('rejected')} count={rejectedCount} />
        <FilterTabBtn label="All" active={activeFilter === 'all'} onPress={() => setActiveFilter('all')} count={cases.length} />
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

      <FlatList
        data={filteredCases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AdminCaseCard
            testCase={item}
            onPress={() => router.push({ pathname: '/(tabs)/case-detail', params: { id: item.id } })}
            onApprove={() => handleApprove(item)}
            onReject={() => handleReject(item)}
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No cases in this category.</Text>
          </View>
        }
      />
    </View>
  );
}

function StatCard({ label, value, icon, accentColor }: { label: string; value: number; icon: React.ReactNode; accentColor: string }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statTop}>
        {icon}
        <Text style={[styles.statValue, { color: accentColor }]}>{value}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function FilterTabBtn({ label, active, onPress, count }: { label: string; active: boolean; onPress: () => void; count: number }) {
  return (
    <TouchableOpacity
      style={[styles.filterTab, active && styles.filterTabActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>{label}</Text>
      <View style={[styles.filterCount, active && styles.filterCountActive]}>
        <Text style={[styles.filterCountText, active && styles.filterCountTextActive]}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
}

function AdminCaseCard({
  testCase,
  onPress,
  onApprove,
  onReject,
}: {
  testCase: TestCase;
  onPress: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const dateObj = new Date(testCase.date);
  const dateStr = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const statusColors: Record<string, string> = {
    Approved: Colors.green[400],
    Rejected: Colors.red[400],
    Submitted: Colors.amber[400],
    Saved: Colors.teal[400],
    Verified: Colors.green[400],
    Pending: Colors.gray,
  };
  const statusColor = statusColors[testCase.status] || Colors.gray;

  return (
    <View style={styles.adminCard}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.adminCardHeader}>
          <Text style={styles.adminSampleId}>{testCase.sampleId}</Text>
          <View style={[styles.adminStatusPill, { backgroundColor: `${statusColor}20`, borderColor: `${statusColor}50` }]}>
            <Text style={[styles.adminStatusText, { color: statusColor }]}>{testCase.status}</Text>
          </View>
        </View>
        <Text style={styles.adminSubstance}>
          {testCase.substance || 'Substance not identified'}
        </Text>
        <Text style={styles.adminOfficer}>{testCase.officerName} · {testCase.officerId}</Text>
        <Text style={styles.adminDate}>{dateStr} · {timeStr}</Text>
        <View style={styles.adminResultRow}>
          <Text style={styles.adminResultLabel}>Result:</Text>
          <Text style={[styles.adminResultValue, { color: statusColors[testCase.result] || Colors.gray }]}>
            {testCase.result}
          </Text>
        </View>
      </TouchableOpacity>

      {testCase.status === 'Submitted' && (
        <View style={styles.adminActions}>
          <TouchableOpacity style={styles.approveBtn} onPress={onApprove} activeOpacity={0.7}>
            <Check size={18} color={Colors.white} strokeWidth={2.5} />
            <Text style={styles.approveBtnText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectBtn} onPress={onReject} activeOpacity={0.7}>
            <X size={18} color={Colors.white} strokeWidth={2.5} />
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
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
    borderColor: Colors.amber[500],
  },
  adminName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  adminId: {
    fontSize: 12,
    color: Colors.amber[400],
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  station: {
    fontSize: 11,
    color: Colors.gray,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(243, 156, 18, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(243, 156, 18, 0.3)',
    marginTop: 2,
    marginRight: 8,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.amber[400],
    fontFamily: 'Inter-ExtraBold',
    letterSpacing: 0.5,
  },
  logoutBtn: {
    padding: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.navy[700],
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.navy[500],
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'Inter-ExtraBold',
  },
  statLabel: {
    fontSize: 11,
    color: Colors.gray,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.navy[700],
    borderWidth: 1,
    borderColor: Colors.navy[500],
  },
  filterTabActive: {
    backgroundColor: Colors.teal[500],
    borderColor: Colors.teal[400],
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray,
    fontFamily: 'Inter-SemiBold',
  },
  filterTabTextActive: {
    color: Colors.white,
  },
  filterCount: {
    backgroundColor: Colors.navy[600],
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  filterCountActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  filterCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.lightGray,
    fontFamily: 'Inter-Bold',
  },
  filterCountTextActive: {
    color: Colors.white,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
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
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  adminCard: {
    backgroundColor: Colors.navy[700],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.navy[500],
  },
  adminCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adminSampleId: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  adminStatusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  adminStatusText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  adminSubstance: {
    fontSize: 14,
    color: Colors.lightGray,
    marginTop: 6,
    fontFamily: 'Inter-Regular',
  },
  adminOfficer: {
    fontSize: 12,
    color: Colors.teal[300],
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  adminDate: {
    fontSize: 11,
    color: Colors.darkGray,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  adminResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  adminResultLabel: {
    fontSize: 13,
    color: Colors.gray,
    fontFamily: 'Inter-Regular',
  },
  adminResultValue: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  adminActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.navy[600],
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.green[500],
    borderRadius: 10,
    height: 46,
  },
  approveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.red[500],
    borderRadius: 10,
    height: 46,
  },
  rejectBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray,
    fontFamily: 'Inter-Regular',
  },
});
