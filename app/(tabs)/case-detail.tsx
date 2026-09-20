import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  PhoneCall,
  MapPin,
  Calendar,
  User,
  FileBadge,
  Lock,
  AudioLines,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { WarningBanner } from '@/components/WarningBanner';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { useApp } from '@/context/AppContext';

export default function CaseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCaseById, user } = useApp();
  const testCase = id ? getCaseById(id) : undefined;

  if (!testCase) {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <ArrowLeft size={22} color={Colors.white} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Case Not Found</Text>
          <View style={{ width: 22 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>This case could not be found.</Text>
        </View>
      </View>
    );
  }

  const dateObj = new Date(testCase.date);
  const dateStr = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const isAdmin = user?.role === 'admin';

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
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft size={22} color={Colors.white} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Case Detail</Text>
        <View style={{ width: 22 }} />
      </View>

      <WarningBanner compact />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.caseHeader}>
          <View style={styles.caseHeaderTop}>
            <View>
              <Text style={styles.sampleId}>{testCase.sampleId}</Text>
              <Text style={styles.caseId}>{testCase.caseId}</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: `${statusColor}20`, borderColor: `${statusColor}50` }]}>
              <Text style={[styles.statusPillText, { color: statusColor }]}>{testCase.status}</Text>
            </View>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Result:</Text>
            <Text style={[styles.resultValue, { color: statusColors[testCase.result] || Colors.gray }]}>
              {testCase.result}
            </Text>
          </View>
        </View>

        <Section title="Evidence Authentication">
          <View style={styles.authNote}>
            <ShieldCheck size={18} color={Colors.teal[400]} strokeWidth={2} />
            <Text style={styles.authText}>
              Evidence Authentication: Officer ID / Case-ID slip visible beside sample image.
            </Text>
          </View>
        </Section>

        <Section title="Evidence Photo">
          {testCase.capturedImageUri && testCase.capturedImageUri !== 'camera-placeholder' ? (
            <Image source={{ uri: testCase.capturedImageUri }} style={styles.evidenceImage} />
          ) : (
            <PlaceholderImage label="Evidence photo placeholder" size={200} />
          )}
        </Section>

        <Section title="Case Information">
          <InfoRow icon={<Calendar size={16} color={Colors.gray} strokeWidth={2} />} label="Date / Time" value={`${dateStr} · ${timeStr}`} />
          <InfoRow icon={<User size={16} color={Colors.gray} strokeWidth={2} />} label="Officer" value={`${testCase.officerName} (${testCase.officerId})`} />
          <InfoRow icon={<MapPin size={16} color={Colors.gray} strokeWidth={2} />} label="GPS Location" value={testCase.gps} />
          <InfoRow icon={<FileText size={16} color={Colors.gray} strokeWidth={2} />} label="Suspected Substance" value={testCase.substance || 'Not identified — pending lab confirmation'} />
          {testCase.notes ? (
            <InfoRow icon={<FileText size={16} color={Colors.gray} strokeWidth={2} />} label="Notes" value={testCase.notes} />
          ) : null}
          {testCase.audioNoteDuration && (
            <View style={styles.infoRow}>
              <AudioLines size={16} color={Colors.teal[300]} strokeWidth={2} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Voice Note</Text>
                <Text style={styles.infoValue}>Audio recording ({testCase.audioNoteDuration})</Text>
              </View>
            </View>
          )}
          <InfoRow icon={<FileText size={16} color={Colors.gray} strokeWidth={2} />} label="Result" value={testCase.result} />
          <InfoRow icon={<FileText size={16} color={Colors.gray} strokeWidth={2} />} label="Conclusion" value={`Presumptive field result: ${testCase.result}. Laboratory confirmation required.`} />
        </Section>

        <Section title="Evidence Integrity">
          <InfoRow icon={<FileBadge size={16} color={Colors.gray} strokeWidth={2} />} label="Case ID" value={testCase.caseId} />
          <InfoRow icon={<Lock size={16} color={Colors.gray} strokeWidth={2} />} label="Image Hash" value={testCase.imageHash} mono />
          <InfoRow icon={<ShieldCheck size={16} color={Colors.gray} strokeWidth={2} />} label="Integrity Status" value={testCase.integrityStatus} />
        </Section>

        <Section title="Actions (Demo)">
          <DemoButton icon={<ShieldCheck size={20} color={Colors.teal[300]} strokeWidth={2} />} label="Verify Integrity" />
          <DemoButton icon={<FileText size={20} color={Colors.teal[300]} strokeWidth={2} />} label="Generate Formal Report" />
          <DemoButton icon={<PhoneCall size={20} color={Colors.teal[300]} strokeWidth={2} />} label="Request Help from Authority" />
        </Section>

        {isAdmin && testCase.status === 'Submitted' && (
          <View style={styles.adminActionsSection}>
            <Text style={styles.adminActionsTitle}>Admin Review</Text>
            <View style={styles.adminActionsRow}>
              <TouchableOpacity
                style={styles.adminApproveBtn}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <CheckCircle2 size={18} color={Colors.white} strokeWidth={2.5} />
                <Text style={styles.adminApproveText}>Approve from Dashboard</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.adminHint}>Use the Admin Dashboard to approve or reject this case.</Text>
          </View>
        )}

        {testCase.status === 'Approved' && (
          <View style={styles.approvalBanner}>
            <CheckCircle2 size={18} color={Colors.green[400]} strokeWidth={2} />
            <Text style={styles.approvalText}>This test result has been approved by an admin.</Text>
          </View>
        )}
        {testCase.status === 'Rejected' && (
          <View style={styles.rejectionBanner}>
            <XCircle size={18} color={Colors.red[400]} strokeWidth={2} />
            <Text style={styles.rejectionText}>This test result has been rejected by an admin.</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function InfoRow({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <View style={styles.infoRow}>
      {icon}
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, mono && styles.mono]}>{value}</Text>
      </View>
    </View>
  );
}

function DemoButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <TouchableOpacity style={styles.demoButton} disabled activeOpacity={0.7}>
      {icon}
      <Text style={styles.demoButtonText}>{label}</Text>
      <Text style={styles.demoBadge}>Demo</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navy[800],
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: Colors.navy[900],
    borderBottomWidth: 1,
    borderBottomColor: Colors.navy[600],
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  scroll: {
    padding: 20,
    paddingBottom: 100,
  },
  caseHeader: {
    backgroundColor: Colors.navy[700],
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.navy[500],
    marginBottom: 16,
  },
  caseHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sampleId: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  caseId: {
    fontSize: 13,
    color: Colors.teal[300],
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  resultLabel: {
    fontSize: 14,
    color: Colors.gray,
    fontFamily: 'Inter-Regular',
  },
  resultValue: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.teal[300],
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  sectionBody: {
    backgroundColor: Colors.navy[700],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.navy[500],
  },
  authNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  authText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.teal[300],
    lineHeight: 20,
    fontFamily: 'Inter-SemiBold',
  },
  evidenceImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.navy[600],
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 3,
    fontFamily: 'Inter-Regular',
  },
  infoValue: {
    fontSize: 15,
    color: Colors.white,
    fontFamily: 'Inter-Regular',
  },
  mono: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: Colors.lightGray,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.navy[900],
    borderWidth: 1,
    borderColor: Colors.navy[500],
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  demoButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.lightGray,
    fontFamily: 'Inter-SemiBold',
  },
  demoBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.darkGray,
    backgroundColor: Colors.navy[600],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontFamily: 'Inter-SemiBold',
  },
  adminActionsSection: {
    marginBottom: 16,
  },
  adminActionsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.amber[400],
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  adminActionsRow: {
    backgroundColor: Colors.navy[700],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.navy[500],
  },
  adminApproveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.teal[500],
    borderRadius: 10,
    height: 48,
  },
  adminApproveText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  adminHint: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  approvalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(39, 174, 96, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(39, 174, 96, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  approvalText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.green[400],
    fontFamily: 'Inter-SemiBold',
  },
  rejectionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(231, 76, 60, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  rejectionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.red[400],
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.gray,
    fontFamily: 'Inter-Regular',
  },
});
