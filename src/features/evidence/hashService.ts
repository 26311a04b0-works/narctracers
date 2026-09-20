/**
 * Hash service — thin wrapper around sha256 utility for evidence integrity.
 * Kept separate from evidenceService to keep hashing logic testable in isolation.
 */
export { sha256, compareHashes, generateFallbackHash } from '@/utils/sha256';
