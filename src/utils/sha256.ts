/**
 * SHA-256 hash utility for evidence image integrity.
 * Uses the Web Crypto API (SubtleCrypto) available in both browsers
 * and React Native's polyfilled environment. Falls back to a deterministic
 * placeholder hash when SubtleCrypto is unavailable (e.g. some native runtimes).
 */
export async function sha256(data: string): Promise<string> {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
      const encoder = new TextEncoder();
      const buffer = await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(data));
      return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch {
    // fall through to fallback
  }
  return generateFallbackHash(data);
}

/**
 * Synchronous fallback that produces a 64-character hex string.
 * NOT cryptographically secure — used only when SubtleCrypto is unavailable.
 */
export function generateFallbackHash(seed: string): string {
  let h1 = 0xdeadbeef ^ seed.length;
  let h2 = 0x41c6ce57 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex = (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
  return (hex + hex + hex + hex).slice(0, 64);
}

/**
 * Constant-time comparison of two hex hash strings.
 * Prevents timing attacks by comparing all characters regardless of early mismatch.
 */
export function compareHashes(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
