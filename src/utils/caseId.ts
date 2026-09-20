/**
 * Generates a case ID in the format CASE-YYYYMMDD-NNN.
 * Used when a new field test is saved and submitted for approval.
 */
export function generateCaseId(seq: number): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const seqStr = String(seq).padStart(3, '0');
  return `CASE-${dateStr}-${seqStr}`;
}

/**
 * Generates a random image hash for evidence integrity.
 * In production, this would be a real SHA-256 of the image bytes;
 * for the MVP demo it produces a 64-char hex string.
 */
export function generateImageHash(): string {
  return Array.from({ length: 64 }, () =>
    '0123456789abcdef'[Math.floor(Math.random() * 16)]
  ).join('');
}
