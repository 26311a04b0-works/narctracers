import { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image,
} from 'react-native';
import {
  Camera, MapPin, CheckCircle2, XCircle, HelpCircle, ListChecks, SkipForward,
  Save, ArrowLeft, AudioLines,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { Dropdown } from '@/components/Dropdown';
import { PlaceholderImage } from '@/components/PlaceholderImage';
import { EvidenceCaptureGuide } from '@/components/EvidenceCaptureGuide';
import { EvidenceCamera } from '@/features/evidence/EvidenceCamera';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { useAuth } from '@/features/auth/useAuth';
import { TestResult } from '@/features/cases/types';
import { validateNewCase } from '@/features/cases/caseService';
import { SUBSTANCE_OPTIONS, GUIDED_STEPS } from '@/constants/disclaimer';

type Step = 'form' | 'choice' | 'steps' | 'camera' | 'result';

export default function NewTestScreen() {
  const router = useRouter();
  const { addCase } = useAuth();
  const [step, setStep] = useState<Step>('form');
  const [sampleId, setSampleId] = useState('');
  const [substance, setSubstance] = useState('');
  const [notes, setNotes] = useState('');
  const [gps] = useState('28.6139°N, 77.2090°E (Auto-detected)');
  const [guidedStepIndex, setGuidedStepIndex] = useState(0);
  const [result, setResult] = useState<TestResult | null>(null);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [audioNoteDuration, setAudioNoteDuration] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleSave = () => {
    const errors = validateNewCase({
      sampleId: sampleId.trim(),
      substance: substance || '',
      notes: notes.trim(),
      result: result || 'Pending',
      gps,
      capturedImageUri: capturedImageUri || undefined,
    });
    if (errors.length > 0) {
      Alert.alert('Missing Fields', errors.join('\n'));
      return;
    }
    const newCase = addCase({
      sampleId: sampleId.trim(),
      substance: substance || '',
      notes: notes.trim(),
      result: result || 'Pending',
      gps,
      audioNoteDuration: audioNoteDuration || undefined,
      capturedImageUri: capturedImageUri || undefined,
    });
    Alert.alert('Case Saved', `Case ${newCase.caseId} has been submitted for approval.`, [
      { text: 'OK', onPress: () => router.push('/dashboard') },
    ]);
  };

  const goBack = () => {
    if (step === 'form') router.back();
    else if (step === 'choice') setStep('form');
    else if (step === 'steps') setStep('choice');
    else if (step === 'camera') setStep('choice');
    else setStep('camera');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft size={22} color={Colors.white} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>
          {step === 'form' ? 'New Test' : step === 'choice' ? 'Guided Steps' : step === 'steps' ? 'Reaction Steps' : step === 'camera' ? 'Evidence Capture' : 'Record Result'}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <DisclaimerBanner compact />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {step === 'form' && (
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Sample ID</Text>
            <TextInput style={styles.textInput} placeholder="e.g. SMP-2024-0050" placeholderTextColor={Colors.darkGray} value={sampleId} onChangeText={setSampleId} autoCapitalize="characters" autoCorrect={false} />
            <View style={{ marginTop: 16 }}>
              <Dropdown label="Suspected Substance (Optional)" value={substance} options={SUBSTANCE_OPTIONS} onSelect={setSubstance} />
            </View>
            <Text style={styles.optionalHint}>Substance may be unknown at the time of the field test. You can select it later.</Text>
            <View style={styles.notesRow}>
              <View style={styles.notesLabelRow}>
                <Text style={styles.sectionLabel}>Notes</Text>
                <VoiceRecorder onRecorded={(dur) => setAudioNoteDuration(dur)} />
              </View>
              <TextInput style={[styles.textInput, styles.notesInput]} placeholder="Type observation notes or use the voice note button..." placeholderTextColor={Colors.darkGray} value={notes} onChangeText={setNotes} multiline textAlignVertical="top" />
              {audioNoteDuration && (
                <View style={styles.audioBadge}>
                  <AudioLines size={14} color={Colors.teal[300]} strokeWidth={2} />
                  <Text style={styles.audioBadgeText}>Voice note recorded ({audioNoteDuration})</Text>
                </View>
              )}
            </View>
            <View style={styles.gpsBox}>
              <MapPin size={18} color={Colors.teal[400]} strokeWidth={2} />
              <View>
                <Text style={styles.gpsLabel}>GPS Location (Placeholder)</Text>
                <Text style={styles.gpsValue}>{gps}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('choice')} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'choice' && (
          <View style={styles.choiceSection}>
            <View style={styles.choiceCard}>
              <ListChecks size={32} color={Colors.teal[400]} strokeWidth={2} />
              <Text style={styles.choiceTitle}>Use guided reaction steps?</Text>
              <Text style={styles.choiceDesc}>Follow step-by-step instructions for conducting the presumptive field test, or skip directly to evidence capture.</Text>
            </View>
            <TouchableOpacity style={[styles.choiceButton, styles.choicePrimary]} onPress={() => { setGuidedStepIndex(0); setStep('steps'); }} activeOpacity={0.8}>
              <ListChecks size={22} color={Colors.white} strokeWidth={2} />
              <Text style={styles.choicePrimaryText}>Use Steps</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.choiceButton, styles.choiceSecondary]} onPress={() => setStep('camera')} activeOpacity={0.8}>
              <SkipForward size={22} color={Colors.teal[300]} strokeWidth={2} />
              <Text style={styles.choiceSecondaryText}>Skip Steps</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'steps' && (
          <View style={styles.stepsSection}>
            <View style={styles.stepProgress}>
              <Text style={styles.stepCounter}>Step {guidedStepIndex + 1} of {GUIDED_STEPS.length}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${((guidedStepIndex + 1) / GUIDED_STEPS.length) * 100}%` }]} />
              </View>
            </View>
            <View style={styles.stepCard}>
              <View style={styles.stepNumberCircle}>
                <Text style={styles.stepNumberText}>{guidedStepIndex + 1}</Text>
              </View>
              <Text style={styles.stepText}>{GUIDED_STEPS[guidedStepIndex]}</Text>
            </View>
            <View style={styles.stepNav}>
              <TouchableOpacity style={[styles.stepNavButton, guidedStepIndex === 0 && styles.stepNavDisabled]} disabled={guidedStepIndex === 0} onPress={() => setGuidedStepIndex((i) => Math.max(0, i - 1))}>
                <Text style={styles.stepNavText}>Previous</Text>
              </TouchableOpacity>
              {guidedStepIndex < GUIDED_STEPS.length - 1 ? (
                <TouchableOpacity style={styles.stepNavNext} onPress={() => setGuidedStepIndex((i) => i + 1)}>
                  <Text style={styles.stepNavNextText}>Next Step</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.stepNavNext} onPress={() => setStep('camera')}>
                  <Text style={styles.stepNavNextText}>Proceed to Capture</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {step === 'camera' && (
          <View style={styles.cameraSection}>
            <EvidenceCaptureGuide />
            {capturedImageUri ? (
              <View style={styles.capturedContainer}>
                {capturedImageUri !== 'camera-placeholder' ? (
                  <Image source={{ uri: capturedImageUri }} style={styles.capturedImage} />
                ) : (
                  <PlaceholderImage label="Evidence photo captured" size={220} />
                )}
                <View style={styles.capturedBadge}>
                  <CheckCircle2 size={16} color={Colors.green[400]} strokeWidth={2} />
                  <Text style={styles.capturedBadgeText}>Photo captured</Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.cameraPlaceholder} onPress={() => setShowCamera(true)} activeOpacity={0.7}>
                <Camera size={40} color={Colors.teal[300]} strokeWidth={1.5} />
                <Text style={styles.cameraPlaceholderText}>Tap to open camera</Text>
                <Text style={styles.cameraPlaceholderSub}>Camera access required</Text>
              </TouchableOpacity>
            )}
            {capturedImageUri && (
              <TouchableOpacity style={styles.retakeButton} onPress={() => { setCapturedImageUri(null); setShowCamera(true); }}>
                <Text style={styles.retakeText}>Retake Photo</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.primaryButton, !capturedImageUri && styles.primaryDisabled]} disabled={!capturedImageUri} onPress={() => setStep('result')}>
              <Text style={styles.primaryButtonText}>Continue to Result</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'result' && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>Select Test Result</Text>
            <Text style={styles.resultSub}>Record the presumptive field result</Text>
            <ResultButton label="Positive" icon={<CheckCircle2 size={24} color={Colors.red[400]} strokeWidth={2} />} selected={result === 'Positive'} onPress={() => setResult('Positive')} accentColor={Colors.red[400]} />
            <ResultButton label="Negative" icon={<XCircle size={24} color={Colors.green[400]} strokeWidth={2} />} selected={result === 'Negative'} onPress={() => setResult('Negative')} accentColor={Colors.green[400]} />
            <ResultButton label="Inconclusive" icon={<HelpCircle size={24} color={Colors.amber[400]} strokeWidth={2} />} selected={result === 'Inconclusive'} onPress={() => setResult('Inconclusive')} accentColor={Colors.amber[400]} />
            <TouchableOpacity style={[styles.saveButton, !result && styles.primaryDisabled]} disabled={!result} onPress={handleSave}>
              <Save size={20} color={Colors.white} strokeWidth={2} />
              <Text style={styles.saveButtonText}>Save & Submit Case</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <EvidenceCamera visible={showCamera} onClose={() => setShowCamera(false)} onCapture={(uri) => setCapturedImageUri(uri)} />
    </View>
  );
}

function ResultButton({ label, icon, selected, onPress, accentColor }: { label: string; icon: React.ReactNode; selected: boolean; onPress: () => void; accentColor: string }) {
  return (
    <TouchableOpacity style={[styles.resultButton, selected && { borderColor: accentColor, borderWidth: 2 }]} onPress={onPress} activeOpacity={0.7}>
      {icon}
      <Text style={[styles.resultButtonText, selected && { color: accentColor }]}>{label}</Text>
      {selected && <CheckCircle2 size={20} color={accentColor} strokeWidth={2} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.navy[800] },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, backgroundColor: Colors.navy[900], borderBottomWidth: 1, borderBottomColor: Colors.navy[600] },
  topBarTitle: { fontSize: 17, fontWeight: '700', color: Colors.white, fontFamily: 'Inter-Bold' },
  scroll: { padding: 20, paddingBottom: 100 },
  formSection: {},
  sectionLabel: { fontSize: 13, fontWeight: '600', color: Colors.lightGray, marginBottom: 8, fontFamily: 'Inter-SemiBold' },
  optionalHint: { fontSize: 11, color: Colors.darkGray, marginTop: 6, fontStyle: 'italic', fontFamily: 'Inter-Regular' },
  textInput: { backgroundColor: Colors.navy[900], borderWidth: 1, borderColor: Colors.navy[500], borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: Colors.white, fontFamily: 'Inter-Regular' },
  notesRow: { marginTop: 16 },
  notesLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  notesInput: { minHeight: 80, textAlignVertical: 'top' },
  audioBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(20, 145, 139, 0.12)', borderRadius: 8, alignSelf: 'flex-start' },
  audioBadgeText: { fontSize: 12, color: Colors.teal[300], fontWeight: '600', fontFamily: 'Inter-SemiBold' },
  gpsBox: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.navy[900], borderWidth: 1, borderColor: Colors.navy[500], borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14, marginTop: 16 },
  gpsLabel: { fontSize: 11, color: Colors.gray, fontFamily: 'Inter-Regular' },
  gpsValue: { fontSize: 14, color: Colors.teal[300], marginTop: 2, fontFamily: 'Inter-Regular' },
  primaryButton: { backgroundColor: Colors.teal[500], borderRadius: 12, height: 54, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  primaryButtonText: { fontSize: 17, fontWeight: '700', color: Colors.white, fontFamily: 'Inter-Bold' },
  primaryDisabled: { opacity: 0.4 },
  choiceSection: { paddingTop: 20 },
  choiceCard: { backgroundColor: Colors.navy[700], borderRadius: 16, padding: 28, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: Colors.navy[500], marginBottom: 24 },
  choiceTitle: { fontSize: 18, fontWeight: '700', color: Colors.white, textAlign: 'center', fontFamily: 'Inter-Bold' },
  choiceDesc: { fontSize: 14, color: Colors.gray, textAlign: 'center', lineHeight: 20, fontFamily: 'Inter-Regular' },
  choiceButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 14, height: 56, marginBottom: 12 },
  choicePrimary: { backgroundColor: Colors.teal[500] },
  choicePrimaryText: { fontSize: 17, fontWeight: '700', color: Colors.white, fontFamily: 'Inter-Bold' },
  choiceSecondary: { backgroundColor: Colors.navy[700], borderWidth: 1.5, borderColor: Colors.teal[500] },
  choiceSecondaryText: { fontSize: 17, fontWeight: '700', color: Colors.teal[300], fontFamily: 'Inter-Bold' },
  stepsSection: { paddingTop: 8 },
  stepProgress: { marginBottom: 20 },
  stepCounter: { fontSize: 13, fontWeight: '600', color: Colors.teal[300], marginBottom: 8, fontFamily: 'Inter-SemiBold' },
  progressBar: { height: 4, backgroundColor: Colors.navy[600], borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.teal[400], borderRadius: 2 },
  stepCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, backgroundColor: Colors.navy[700], borderRadius: 14, padding: 20, borderWidth: 1, borderColor: Colors.navy[500], minHeight: 120 },
  stepNumberCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.teal[500], alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNumberText: { fontSize: 16, fontWeight: '700', color: Colors.white, fontFamily: 'Inter-Bold' },
  stepText: { flex: 1, fontSize: 16, color: Colors.white, lineHeight: 24, fontFamily: 'Inter-Regular' },
  stepNav: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 24 },
  stepNavButton: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.navy[700], borderWidth: 1, borderColor: Colors.navy[500], borderRadius: 12, height: 50 },
  stepNavDisabled: { opacity: 0.4 },
  stepNavText: { fontSize: 15, fontWeight: '600', color: Colors.lightGray, fontFamily: 'Inter-SemiBold' },
  stepNavNext: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.teal[500], borderRadius: 12, height: 50 },
  stepNavNextText: { fontSize: 15, fontWeight: '700', color: Colors.white, fontFamily: 'Inter-Bold' },
  cameraSection: { paddingTop: 8 },
  cameraPlaceholder: { alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.navy[900], borderWidth: 2, borderColor: Colors.teal[500], borderStyle: 'dashed', borderRadius: 14, height: 220 },
  cameraPlaceholderText: { fontSize: 15, fontWeight: '600', color: Colors.teal[300], fontFamily: 'Inter-SemiBold' },
  cameraPlaceholderSub: { fontSize: 12, color: Colors.darkGray, fontFamily: 'Inter-Regular' },
  capturedContainer: { borderRadius: 14, overflow: 'hidden' },
  capturedImage: { width: '100%', height: 220, borderRadius: 14 },
  capturedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(39, 174, 96, 0.12)', borderRadius: 8, alignSelf: 'flex-start' },
  capturedBadgeText: { fontSize: 12, color: Colors.green[400], fontWeight: '600', fontFamily: 'Inter-SemiBold' },
  retakeButton: { alignItems: 'center', paddingVertical: 12, marginTop: 8 },
  retakeText: { fontSize: 14, fontWeight: '600', color: Colors.teal[300], fontFamily: 'Inter-SemiBold' },
  resultSection: { paddingTop: 8 },
  resultTitle: { fontSize: 20, fontWeight: '700', color: Colors.white, fontFamily: 'Inter-Bold' },
  resultSub: { fontSize: 14, color: Colors.gray, marginTop: 4, marginBottom: 24, fontFamily: 'Inter-Regular' },
  resultButton: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.navy[700], borderWidth: 1, borderColor: Colors.navy[500], borderRadius: 12, paddingHorizontal: 20, paddingVertical: 18, marginBottom: 12 },
  resultButtonText: { flex: 1, fontSize: 17, fontWeight: '600', color: Colors.white, fontFamily: 'Inter-SemiBold' },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.teal[500], borderRadius: 14, height: 56, marginTop: 20 },
  saveButtonText: { fontSize: 18, fontWeight: '700', color: Colors.white, fontFamily: 'Inter-Bold' },
});
