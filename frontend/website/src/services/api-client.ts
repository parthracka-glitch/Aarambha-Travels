const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 15000; // 15 seconds TTL

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const method = (options?.method || 'GET').toUpperCase();
  const cacheKey = `${method}:${endpoint}`;

  if (method !== 'GET') {
    cache.clear();
  }

  if (method === 'GET' && cache.has(cacheKey)) {
    const entry = cache.get(cacheKey)!;
    if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
      // Revalidate in background
      fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
        ...options,
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((fresh) => {
          if (fresh) cache.set(cacheKey, { data: fresh, timestamp: Date.now() });
        })
        .catch(() => {});

      return entry.data as T;
    }
  }

  const controllerSignal = options?.signal || AbortSignal.timeout(30000);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    signal: controllerSignal,
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorData.detail || 'API request failed');
  }

  const data = await res.json();
  if (method === 'GET') {
    cache.set(cacheKey, { data, timestamp: Date.now() });
  }

  return data as T;
}
