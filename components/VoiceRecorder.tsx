import { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Mic, Square, AlertCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface VoiceRecorderProps {
  onRecorded: (duration: string) => void;
}

export function VoiceRecorder({ onRecorded }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      stopTimer();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const startRecording = useCallback(async () => {
    setError('');
    if (Platform.OS !== 'web' || !navigator.mediaDevices?.getUserMedia) {
      setError('Voice recording is available on web only.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } catch {
      setError('Microphone permission denied or unavailable.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    stopTimer();
    setIsRecording(false);
    const duration = formatTime(seconds);
    onRecorded(duration);
  }, [seconds, onRecorded]);

  return (
    <View>
      <TouchableOpacity
        style={[styles.micButton, isRecording && styles.micButtonActive]}
        onPress={isRecording ? stopRecording : startRecording}
        activeOpacity={0.7}
      >
        {isRecording ? (
          <Square size={18} color={Colors.white} strokeWidth={2.5} fill={Colors.white} />
        ) : (
          <Mic size={18} color={Colors.teal[300]} strokeWidth={2} />
        )}
        <Text style={[styles.micText, isRecording && styles.micTextActive]}>
          {isRecording ? `Recording ${formatTime(seconds)}` : 'Voice Note'}
        </Text>
      </TouchableOpacity>
      {error ? (
        <View style={styles.errorRow}>
          <AlertCircle size={12} color={Colors.red[400]} strokeWidth={2} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  micButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.navy[900],
    borderWidth: 1,
    borderColor: Colors.teal[500],
    borderRadius: 8,
  },
  micButtonActive: {
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
    borderColor: Colors.red[500],
  },
  micText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.teal[300],
    fontFamily: 'Inter-SemiBold',
  },
  micTextActive: {
    color: Colors.red[400],
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  errorText: {
    fontSize: 11,
    color: Colors.red[400],
    fontFamily: 'Inter-Regular',
  },
});
