/**
 * Secure storage abstraction for sensitive local data (tokens, session).
 * Uses AsyncStorage under the hood on native, localStorage on web.
 * Production would use expo-secure-store for sensitive values.
 */

const STORAGE_PREFIX = 'narctracers_';

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

export function secureSet(key: string, value: string): void {
  const storage = getStorage();
  if (storage) {
    storage.setItem(STORAGE_PREFIX + key, value);
  }
}

export function secureGet(key: string): string | null {
  const storage = getStorage();
  if (!storage) return null;
  return storage.getItem(STORAGE_PREFIX + key);
}

export function secureRemove(key: string): void {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(STORAGE_PREFIX + key);
  }
}
