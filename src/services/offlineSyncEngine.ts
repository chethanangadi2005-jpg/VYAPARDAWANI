import { openDB, IDBPDatabase } from 'idb';
import { OfflineQueueItem } from '../types';

const DB_NAME = 'VyaparDhwaniOfflineDB';
const STORE_NAME = 'sync_queue';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('by_status', 'status');
          store.createIndex('by_timestamp', 'timestamp');
        }
      }
    });
  }
  return dbPromise;
}

type SyncListener = (items: OfflineQueueItem[]) => void;
const listeners: Set<SyncListener> = new Set();

export function subscribeQueueUpdates(listener: SyncListener): () => void {
  listeners.add(listener);
  // Initial broadcast
  getOfflineQueue().then(items => listener(items));
  return () => {
    listeners.delete(listener);
  };
}

async function notifyListeners() {
  const items = await getOfflineQueue();
  listeners.forEach(listener => listener(items));
}

/**
 * Add a failed request or offline operation to the persistent IndexedDB queue.
 */
export async function enqueueOfflineTask(
  type: OfflineQueueItem['type'],
  payload: any
): Promise<OfflineQueueItem> {
  const db = await getDB();
  const item: OfflineQueueItem = {
    id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    type,
    payload,
    timestamp: Date.now(),
    status: 'PENDING',
    retryCount: 0
  };

  await db.put(STORE_NAME, item);
  console.log('📥 Enqueued offline task to IndexedDB:', item.id);
  await notifyListeners();
  return item;
}

/**
 * Retrieve all items in the offline sync queue.
 */
export async function getOfflineQueue(): Promise<OfflineQueueItem[]> {
  try {
    const db = await getDB();
    const items = await db.getAll(STORE_NAME);
    return items.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to read offline queue from IndexedDB:', error);
    return [];
  }
}

/**
 * Get count of pending offline items.
 */
export async function getPendingCount(): Promise<number> {
  const queue = await getOfflineQueue();
  return queue.filter(item => item.status === 'PENDING' || item.status === 'FAILED').length;
}

/**
 * Remove an item from the queue by ID.
 */
export async function removeFromQueue(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
  await notifyListeners();
}

/**
 * Clear all completed (SYNCED) items from queue.
 */
export async function clearSyncedItems(): Promise<void> {
  const db = await getDB();
  const queue = await getOfflineQueue();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const item of queue) {
    if (item.status === 'SYNCED') {
      await tx.store.delete(item.id);
    }
  }
  await tx.done;
  await notifyListeners();
}

/**
 * Process pending queue items and send to server API.
 */
export async function syncPendingQueue(
  apiUploader: (item: OfflineQueueItem) => Promise<boolean>
): Promise<{ syncedCount: number; failedCount: number }> {
  if (!navigator.onLine) {
    console.log('📡 Browser is offline. Sync deferred.');
    return { syncedCount: 0, failedCount: 0 };
  }

  const queue = await getOfflineQueue();
  const pendingItems = queue.filter(i => i.status === 'PENDING' || i.status === 'FAILED');

  if (pendingItems.length === 0) {
    return { syncedCount: 0, failedCount: 0 };
  }

  const db = await getDB();
  let syncedCount = 0;
  let failedCount = 0;

  for (const item of pendingItems) {
    item.status = 'SYNCING';
    await db.put(STORE_NAME, item);
    await notifyListeners();

    try {
      const success = await apiUploader(item);
      if (success) {
        item.status = 'SYNCED';
        syncedCount++;
        await db.put(STORE_NAME, item);
      } else {
        item.status = 'FAILED';
        item.retryCount += 1;
        item.error = 'Server rejected upload request.';
        failedCount++;
        await db.put(STORE_NAME, item);
      }
    } catch (err: any) {
      item.status = 'FAILED';
      item.retryCount += 1;
      item.error = err.message || 'Network error during sync attempt.';
      failedCount++;
      await db.put(STORE_NAME, item);
    }
  }

  await notifyListeners();
  return { syncedCount, failedCount };
}

// Global Online/Offline Event Listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('🌐 Network Connection Restored. Triggering auto-sync...');
    // Emit global event for components
    window.dispatchEvent(new CustomEvent('vyapardhwani:online'));
  });

  window.addEventListener('offline', () => {
    console.log('📡 Network Connection Dropped. Switching to offline queue mode.');
    window.dispatchEvent(new CustomEvent('vyapardhwani:offline'));
  });
}
