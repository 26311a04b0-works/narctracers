import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Shield, Lock, User, Eye, EyeOff, BadgeCheck } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { useAuth } from '@/features/auth/useAuth';

export default function LoginScreen() {
  const { login } = useAuth();
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!officerId.trim() || !password.trim()) {
      setError('Please enter both Officer ID and password.');
      return;
    }
    const success = login(officerId, password);
    if (!success) {
      setError('Invalid credentials. Check the demo accounts below.');
    }
  };

  const fillOfficer = () => {
    setOfficerId('OFF-2024-0421');
    setPassword('demo');
    setError('');
  };

  const fillAdmin = () => {
    setOfficerId('OFF-2026-1432');
    setPassword('admindemo');
    setError('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Shield size={36} color={Colors.teal[400]} strokeWidth={2} />
          </View>
          <Text style={styles.appName}>NarcTracers</Text>
          <Text style={styles.tagline}>Field Drug-Test Recording System</Text>
        </View>

        <DisclaimerBanner />

        <View style={styles.form}>
          <Text style={styles.formTitle}>Sign In</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Officer ID</Text>
            <View style={styles.inputRow}>
              <User size={18} color={Colors.gray} strokeWidth={2} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. OFF-2024-0421"
                placeholderTextColor={Colors.darkGray}
                value={officerId}
                onChangeText={(v) => { setOfficerId(v); setError(''); }}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Lock size={18} color={Colors.gray} strokeWidth={2} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor={Colors.darkGray}
                value={password}
                onChangeText={(v) => { setPassword(v); setError(''); }}
                secureTextEntry={!showPassword}
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((s) => !s)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {showPassword ? (
                  <EyeOff size={18} color={Colors.gray} strokeWidth={2} />
                ) : (
                  <Eye size={18} color={Colors.gray} strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.demoAccountsContainer}>
            <Text style={styles.demoTitle}>Quick Login</Text>

            <TouchableOpacity style={styles.demoAccountBtn} onPress={fillOfficer} activeOpacity={0.7}>
              <View style={styles.demoAccountLeft}>
                <View style={styles.demoIconOfficer}>
                  <Shield size={16} color={Colors.teal[400]} strokeWidth={2} />
                </View>
                <View>
                  <Text style={styles.demoAccountTitle}>Officer Login</Text>
                  <Text style={styles.demoAccountSub}>OFF-2024-0421 / demo</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoAccountBtn, styles.demoAccountAdmin]}
              onPress={fillAdmin}
              activeOpacity={0.7}
            >
              <View style={styles.demoAccountLeft}>
                <View style={styles.demoIconAdmin}>
                  <BadgeCheck size={16} color={Colors.amber[400]} strokeWidth={2} />
                </View>
                <View>
                  <Text style={styles.demoAccountTitle}>Admin Login</Text>
                  <Text style={styles.demoAccountSub}>OFF-2026-1432 / admindemo</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.credentialInfo}>
            <Text style={styles.credInfoTitle}>Credentials</Text>
            <View style={styles.credRow}>
              <View style={[styles.credDot, { backgroundColor: Colors.teal[400] }]} />
              <Text style={styles.credInfoText}>Officer: OFF-2024-0421 — Password: demo</Text>
            </View>
            <View style={styles.credRow}>
              <View style={[styles.credDot, { backgroundColor: Colors.amber[400] }]} />
              <Text style={styles.credInfoText}>Admin: OFF-2026-1432 — Password: admindemo</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.navy[800] },
  scroll: { flexGrow: 1 },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 24 },
  logoCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.navy[600], borderWidth: 2, borderColor: Colors.teal[500], alignItems: 'center', justifyContent: 'center' },
  appName: { fontSize: 28, fontWeight: '800', color: Colors.white, marginTop: 16, fontFamily: 'Inter-ExtraBold', letterSpacing: 0.5 },
  tagline: { fontSize: 13, color: Colors.teal[300], marginTop: 4, fontFamily: 'Inter-Regular' },
  form: { flex: 1, paddingHorizontal: 24, paddingTop: 28 },
  formTitle: { fontSize: 20, fontWeight: '700', color: Colors.white, marginBottom: 20, fontFamily: 'Inter-Bold' },
  errorBox: { backgroundColor: 'rgba(231, 76, 60, 0.12)', borderWidth: 1, borderColor: 'rgba(231, 76, 60, 0.3)', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16 },
  errorText: { fontSize: 13, color: Colors.red[400], fontFamily: 'Inter-Regular' },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.lightGray, marginBottom: 8, fontFamily: 'Inter-SemiBold' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.navy[900], borderWidth: 1, borderColor: Colors.navy[500], borderRadius: 10, paddingHorizontal: 16, gap: 10, height: 54 },
  inputIcon: { marginRight: 4 },
  input: { flex: 1, fontSize: 15, color: Colors.white, fontFamily: 'Inter-Regular' },
  loginButton: { backgroundColor: Colors.teal[500], borderRadius: 12, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  loginButtonText: { fontSize: 17, fontWeight: '700', color: Colors.white, fontFamily: 'Inter-Bold' },
  demoAccountsContainer: { marginTop: 24 },
  demoTitle: { fontSize: 14, fontWeight: '700', color: Colors.teal[300], marginBottom: 12, fontFamily: 'Inter-Bold' },
  demoAccountBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.navy[700], borderWidth: 1, borderColor: Colors.teal[500], borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10 },
  demoAccountAdmin: { borderColor: Colors.amber[500] },
  demoAccountLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  demoIconOfficer: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(20, 145, 139, 0.15)', alignItems: 'center', justifyContent: 'center' },
  demoIconAdmin: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(243, 156, 18, 0.15)', alignItems: 'center', justifyContent: 'center' },
  demoAccountTitle: { fontSize: 15, fontWeight: '700', color: Colors.white, fontFamily: 'Inter-Bold' },
  demoAccountSub: { fontSize: 12, color: Colors.gray, marginTop: 2, fontFamily: 'Inter-Regular' },
  credentialInfo: { marginTop: 20, padding: 16, backgroundColor: Colors.navy[900], borderRadius: 10, borderWidth: 1, borderColor: Colors.navy[600] },
  credInfoTitle: { fontSize: 13, fontWeight: '700', color: Colors.teal[400], marginBottom: 10, fontFamily: 'Inter-Bold' },
  credRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  credDot: { width: 8, height: 8, borderRadius: 4 },
  credInfoText: { fontSize: 12, color: Colors.gray, fontFamily: 'Inter-Regular' },
});
