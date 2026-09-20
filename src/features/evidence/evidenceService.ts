import { EvidenceImage } from '@/features/cases/types';
import { sha256, generateFallbackHash } from '@/utils/sha256';

/**
 * Evidence service — handles evidence image metadata and integrity.
 * Production would upload to Supabase Storage and compute real SHA-256.
 */

export async function hashEvidenceImage(uri: string): Promise<string> {
  return sha256(uri);
}

export function createEvidenceRecord(caseId: string, uri: string, hash: string): EvidenceImage {
  return {
    id: `evidence-${Date.now()}`,
    caseId,
    uri,
    hash,
    capturedAt: new Date().toISOString(),
  };
}

export function verifyEvidenceIntegrity(image: EvidenceImage, expectedHash: string): boolean {
  return image.hash === expectedHash;
}
