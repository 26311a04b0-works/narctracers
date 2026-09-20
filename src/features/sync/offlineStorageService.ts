/**
 * Offline storage service — persists cases locally for offline-first operation.
 * MVP uses in-memory state; production would use AsyncStorage or SQLite.
 */

export interface PendingSyncItem {
  id: string;
  type: 'case_create' | 'case_update';
  payload: unknown;
  createdAt: string;
}

let pendingQueue: PendingSyncItem[] = [];

export function enqueueSync(item: Omit<PendingSyncItem, 'id' | 'createdAt'>): PendingSyncItem {
  const full: PendingSyncItem = {
    ...item,
    id: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  pendingQueue.push(full);
  return full;
}

export function getPendingCount(): number {
  return pendingQueue.length;
}

export function drainQueue(): PendingSyncItem[] {
  const items = [...pendingQueue];
  pendingQueue = [];
  return items;
}
