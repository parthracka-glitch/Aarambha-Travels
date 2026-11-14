export const RENDER_API = 'https://aarambha-travels.onrender.com';

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('website_api_url');
    if (stored && stored.startsWith('http')) return stored.replace(/\/+$/, '');
  }

  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    const cleaned = envUrl.trim().replace(/\/+$/, '');
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (!isLocal && (cleaned.includes('127.0.0.1') || cleaned.includes('localhost'))) {
        return RENDER_API;
      }
    }
    return cleaned;
  }

  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocal) {
      return RENDER_API;
    }
  }

  // If in production build / SSR on Vercel
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    return RENDER_API;
  }

  return RENDER_API;
}

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 2000; // 2 seconds short cache to allow snappy navigation while staying in live sync

export interface ApiFetchOptions extends RequestInit {
  bypassCache?: boolean;
}

export async function apiFetch<T>(endpoint: string, options?: ApiFetchOptions): Promise<T> {
  const method = (options?.method || 'GET').toUpperCase();
  const cacheKey = `${method}:${endpoint}`;
  const baseUrl = getApiBaseUrl();

  if (method !== 'GET' || options?.bypassCache) {
    cache.delete(cacheKey);
  }

  if (method === 'GET' && !options?.bypassCache && cache.has(cacheKey)) {
    const entry = cache.get(cacheKey)!;
    if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
      return entry.data as T;
    }
  }

  // Render free tier instances take 30-45s to spin up on cold start.
  // Using 45s default ensures initial requests complete rather than aborting prematurely.
  const timeoutMs = 45000;
  const controllerSignal = options?.signal || AbortSignal.timeout(timeoutMs);

  // Attempt fetch against primary URL; on connection failure (e.g. offline localhost or timeout), failover to Render API with retry
  let res: Response | null = null;
  let primaryError: any = null;

  try {
    res = await fetch(`${baseUrl}${endpoint}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      signal: controllerSignal,
      ...options,
    });
  } catch (err: any) {
    primaryError = err;
    // If baseUrl is different from RENDER_API or if cold start timed out, retry once against RENDER_API
    try {
      res = await fetch(`${RENDER_API}${endpoint}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
        signal: AbortSignal.timeout(timeoutMs),
        ...options,
      });
    } catch (_fallbackErr) {
      throw primaryError;
    }
  }

  if (!res || !res.ok) {
    const errorData = await res?.json().catch(() => ({ detail: res?.statusText || 'Request failed' }));
    throw new Error(errorData?.detail || errorData?.message || 'API request failed');
  }

  const data = await res.json();
  if (method === 'GET' && !options?.bypassCache) {
    cache.set(cacheKey, { data, timestamp: Date.now() });
  }

  return data as T;
}
