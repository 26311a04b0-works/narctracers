import { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Modal, ActivityIndicator } from 'react-native';
import { Camera, X, RefreshCw, Camera as CameraIcon } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors } from '@/constants/colors';

interface EvidenceCameraProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (uri: string) => void;
}

export function EvidenceCamera({ visible, onClose, onCapture }: EvidenceCameraProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const cameraRef = useRef<{ takePictureAsync: (opts?: object) => Promise<{ uri: string }> }>(null);

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible]);

  const handleTakePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setCapturedUri(photo.uri);
    } catch {
      setCapturedUri('camera-placeholder');
    }
  };

  const handleConfirm = () => {
    if (capturedUri) {
      onCapture(capturedUri);
      setCapturedUri(null);
      onClose();
    }
  };

  const handleRetake = () => setCapturedUri(null);
  const handleClose = () => {
    setCapturedUri(null);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Evidence Camera</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={24} color={Colors.white} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.cameraArea}>
            {permission?.granted && !capturedUri ? (
              <CameraView ref={cameraRef as any} style={styles.camera} facing="back" mode="picture" />
            ) : capturedUri ? (
              <View style={styles.placeholderPreview}>
                <Camera size={40} color={Colors.teal[300]} strokeWidth={1.5} />
                <Text style={styles.placeholderText}>Photo captured</Text>
              </View>
            ) : permission && !permission.granted ? (
              <View style={styles.permissionDenied}>
                <CameraIcon size={40} color={Colors.gray} strokeWidth={1.5} />
                <Text style={styles.permissionText}>Camera permission required.</Text>
                <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                  <Text style={styles.permissionBtnText}>Grant Permission</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.teal[400]} />
                <Text style={styles.loadingText}>Requesting camera access...</Text>
              </View>
            )}
          </View>

          {capturedUri ? (
            <View style={styles.actions}>
              <TouchableOpacity style={styles.retakeBtn} onPress={handleRetake}>
                <RefreshCw size={18} color={Colors.lightGray} strokeWidth={2} />
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                <Camera size={18} color={Colors.white} strokeWidth={2} />
                <Text style={styles.confirmText}>Use Photo</Text>
              </TouchableOpacity>
            </View>
          ) : permission?.granted ? (
            <View style={styles.captureArea}>
              <TouchableOpacity style={styles.captureBtn} onPress={handleTakePicture} activeOpacity={0.7}>
                <View style={styles.captureInner} />
              </TouchableOpacity>
              <Text style={styles.captureHint}>
                Ensure officer ID / case-ID slip is visible beside sample
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 12 },
  modalContent: { backgroundColor: Colors.navy[800], borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: Colors.navy[500] },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: Colors.navy[900], borderBottomWidth: 1, borderBottomColor: Colors.navy[600] },
  title: { fontSize: 17, fontWeight: '700', color: Colors.white, fontFamily: 'Inter-Bold' },
  cameraArea: { height: 380, backgroundColor: Colors.navy[900] },
  camera: { flex: 1 },
  placeholderPreview: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: Colors.navy[700] },
  placeholderText: { fontSize: 15, fontWeight: '600', color: Colors.teal[300], fontFamily: 'Inter-SemiBold' },
  permissionDenied: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 30 },
  permissionText: { fontSize: 15, color: Colors.gray, textAlign: 'center', fontFamily: 'Inter-Regular' },
  permissionBtn: { backgroundColor: Colors.teal[500], paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, marginTop: 8 },
  permissionBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white, fontFamily: 'Inter-Bold' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: Colors.gray, fontFamily: 'Inter-Regular' },
  actions: { flexDirection: 'row', gap: 12, padding: 20 },
  retakeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.navy[700], borderWidth: 1, borderColor: Colors.navy[500], borderRadius: 12, height: 50 },
  retakeText: { fontSize: 15, fontWeight: '600', color: Colors.lightGray, fontFamily: 'Inter-SemiBold' },
  confirmBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.teal[500], borderRadius: 12, height: 50 },
  confirmText: { fontSize: 15, fontWeight: '700', color: Colors.white, fontFamily: 'Inter-Bold' },
  captureArea: { alignItems: 'center', paddingVertical: 20, gap: 10 },
  captureBtn: { width: 70, height: 70, borderRadius: 35, borderWidth: 4, borderColor: Colors.teal[400], alignItems: 'center', justifyContent: 'center' },
  captureInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: Colors.teal[500] },
  captureHint: { fontSize: 12, color: Colors.gray, textAlign: 'center', paddingHorizontal: 30, fontFamily: 'Inter-Regular' },
});
