import { useEffect, useRef } from 'react';

/**
 * DeploymentAutoRefresh for CRM
 * Monitors remote deployment version periodically and on window focus.
 * When a new commit is deployed or old chunks become invalid, it automatically
 * refreshes the browser so admins never get stuck on an outdated build.
 */
export default function DeploymentAutoRefresh() {
  const currentVersionRef = useRef<string | null>(null);
  const isCheckingRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Recover gracefully from stale chunks on new deployments
    const handleError = (e: ErrorEvent | PromiseRejectionEvent) => {
      const msg =
        (e as ErrorEvent)?.message ||
        (e as any)?.reason?.message ||
        String((e as any)?.reason || '');

      if (
        msg.includes('Loading chunk') ||
        msg.includes('ChunkLoadError') ||
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('is not a valid JavaScript MIME type') ||
        msg.includes('Load failed')
      ) {
        console.warn('[DeploymentAutoRefresh] Stale chunk detected after deployment. Auto-refreshing...');
        window.location.reload();
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    // 2. Fetch remote version and reload if newer version is detected
    const checkVersion = async () => {
      if (isCheckingRef.current) return;
      isCheckingRef.current = true;

      try {
        const res = await fetch(`/version.json?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-store' },
        });

        if (res && res.ok) {
          const data = await res.json();
          const remoteVersion = data?.version?.toString();

          if (remoteVersion) {
            if (currentVersionRef.current === null) {
              currentVersionRef.current = remoteVersion;
            } else if (currentVersionRef.current !== remoteVersion) {
              // Only reload if user is not actively typing in an input
              const activeTag = document.activeElement?.tagName?.toLowerCase();
              if (activeTag !== 'input' && activeTag !== 'textarea') {
                console.log('[DeploymentAutoRefresh] New CRM deployment detected. Auto-refreshing...');
                window.location.reload();
              }
            }
          }
        }
      } catch (_err) {
        // Silent fail on transient network hiccups
      } finally {
        isCheckingRef.current = false;
      }
    };

    // Initial check
    checkVersion();

    // Periodic check every 25 seconds
    const interval = setInterval(checkVersion, 25000);

    // Check when user switches back to this tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkVersion();
      }
    };

    window.addEventListener('focus', checkVersion);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
      clearInterval(interval);
      window.removeEventListener('focus', checkVersion);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return null;
}

