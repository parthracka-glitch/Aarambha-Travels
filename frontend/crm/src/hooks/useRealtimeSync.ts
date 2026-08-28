import { useEffect, useRef, useCallback } from 'react';
import { getApiBaseUrl } from '@/api/client';

type RealtimeListener = (event: { type: string; data?: any; timestamp: number }) => void;

class RealtimeClient {
  private eventSource: EventSource | null = null;
  private listeners: Set<RealtimeListener> = new Set();
  private reconnectTimeout: any = null;
  private isConnecting: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  connect() {
    if (this.eventSource || this.isConnecting || typeof window === 'undefined') return;
    this.isConnecting = true;

    try {
      const url = `${getApiBaseUrl()}/api/realtime/events`;
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        this.isConnecting = false;
      };

      this.eventSource.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          this.notify(payload);
        } catch (_err) {}
      };

      this.eventSource.onerror = () => {
        this.isConnecting = false;
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        // Reconnect after 3 seconds
        if (!this.reconnectTimeout) {
          this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            this.connect();
          }, 3000);
        }
      };
    } catch (_e) {
      this.isConnecting = false;
    }
  }

  subscribe(listener: RealtimeListener): () => void {
    this.listeners.add(listener);
    if (!this.eventSource) {
      this.connect();
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(event: { type: string; data?: any; timestamp: number }) {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (_err) {}
    }
  }
}

export const realtimeClient = new RealtimeClient();

/**
 * Custom React hook for live multi-device synchronization
 * @param loadFn Function to reload page/component data
 * @param eventTypes SSE event types to trigger a refresh (e.g. ['TOURS_UPDATED', 'BOOKINGS_UPDATED'])
 * @param fallbackIntervalMs Optional fallback heartbeat interval in milliseconds (default 8000ms)
 */
export function useAutoRefresh(
  loadFn: () => void | Promise<any>,
  eventTypes: string[] = [],
  fallbackIntervalMs: number = 8000
) {
  const loadRef = useRef(loadFn);
  loadRef.current = loadFn;

  const eventTypesRef = useRef(eventTypes);
  eventTypesRef.current = eventTypes;

  const safeReload = useCallback(() => {
    try {
      loadRef.current();
    } catch (_e) {}
  }, []);

  useEffect(() => {
    // 1. Initial Load
    safeReload();

    // 2. Realtime SSE Event Listener
    const unsubscribe = realtimeClient.subscribe((event) => {
      if (
        eventTypesRef.current.length === 0 ||
        eventTypesRef.current.includes(event.type) ||
        event.type === 'ALL'
      ) {
        safeReload();
      }
    });

    // 3. Window Focus & Device Wakeup Sync
    const handleFocus = () => {
      safeReload();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        safeReload();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 4. Background Heartbeat Polling Fallback
    let timer: any = null;
    if (fallbackIntervalMs > 0) {
      timer = setInterval(safeReload, fallbackIntervalMs);
    }

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timer) clearInterval(timer);
    };
  }, [safeReload, fallbackIntervalMs]);
}
