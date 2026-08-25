import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { subscribeQueueUpdates, syncPendingQueue, getOfflineQueue } from '../../services/offlineSyncEngine';
import { OfflineQueueItem } from '../../types';
import { apiService } from '../../services/api';

export const OfflineSyncBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [queue, setQueue] = useState<OfflineQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const unsubscribe = subscribeQueueUpdates((items) => {
      setQueue(items);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribe();
    };
  }, []);

  const pendingCount = queue.filter(i => i.status === 'PENDING' || i.status === 'FAILED').length;

  const handleManualSync = async () => {
    if (!isOnline) {
      setSyncStatusMsg('Cannot sync while offline. Check network connection.');
      setTimeout(() => setSyncStatusMsg(null), 4000);
      return;
    }

    setIsSyncing(true);
    setSyncStatusMsg('Syncing pending queue with server...');

    try {
      const result = await syncPendingQueue(async (item) => {
        if (item.type === 'INVOICE_SCAN') {
          await apiService.processOcrScan(item.payload.filename || 'offline_scan.jpg', item.payload.sampleType);
          return true;
        }
        return true;
      });

      if (result.syncedCount > 0) {
        setSyncStatusMsg(`Successfully synchronized ${result.syncedCount} queued item(s)!`);
      } else if (result.failedCount > 0) {
        setSyncStatusMsg(`Sync attempted. ${result.failedCount} item(s) failed.`);
      } else {
        setSyncStatusMsg('All items are already in sync.');
      }
    } catch (err: any) {
      setSyncStatusMsg(`Sync failed: ${err.message || 'Server error'}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusMsg(null), 5000);
    }
  };

  if (isOnline && pendingCount === 0 && !syncStatusMsg) {
    return null; // Clean UI when everything is normal online
  }

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-slate-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-inner">
      <div className="flex items-center space-x-2">
        {!isOnline ? (
          <span className="flex items-center text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/50">
            <WifiOff className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
            Offline Mode Active
          </span>
        ) : (
          <span className="flex items-center text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/50">
            <Wifi className="w-3.5 h-3.5 mr-1.5" />
            Online
          </span>
        )}

        {pendingCount > 0 && (
          <span className="flex items-center text-blue-300 bg-blue-950/80 border border-blue-800/50 px-2 py-0.5 rounded font-mono">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-blue-400" />
            {pendingCount} Pending Offline Upload{pendingCount > 1 ? 's' : ''}
          </span>
        )}

        {syncStatusMsg && (
          <span className="text-slate-300 font-medium truncate max-w-xs md:max-w-md">
            {syncStatusMsg}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {pendingCount > 0 && (
          <button
            onClick={handleManualSync}
            disabled={isSyncing || !isOnline}
            className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-2.5 py-1 rounded font-medium transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Queue Now'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
