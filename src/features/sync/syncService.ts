import { drainQueue, getPendingCount } from './offlineStorageService';

/**
 * Sync service — processes the offline pending queue when connectivity returns.
 * Production would push each queued item to Supabase.
 */
export function syncPendingItems(): { synced: number; failed: number } {
  const items = drainQueue();
  let synced = 0;
  let failed = 0;

  for (const item of items) {
    // In production: await supabase.from('cases').insert(item.payload)
    synced++;
  }

  return { synced, failed };
}

export function hasPendingItems(): boolean {
  return getPendingCount() > 0;
}
