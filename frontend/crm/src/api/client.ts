export const PRODUCTION_RENDER_API = 'https://aarambha-backend-api.onrender.com';

/**
 * Intelligent Base API Resolver:
 * - Checks localStorage override ('crm_api_url')
 * - Checks VITE_API_URL
 * - If on remote domain (Vercel, phone, public web) and URL points to localhost or is missing,
 *   automatically routes to Render production backend!
 * - On local development (localhost / 127.0.0.1), uses http://127.0.0.1:8000
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('crm_api_url');
    if (stored && stored.startsWith('http')) return stored.replace(/\/+$/, '');
  }

  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    const cleaned = envUrl.trim().replace(/\/+$/, '');
    if (typeof window !== 'undefined') {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      // If user is accessing CRM remotely (e.g. on mobile or Vercel), do NOT route to 127.0.0.1
      if (!isLocalhost && (cleaned.includes('127.0.0.1') || cleaned.includes('localhost'))) {
        return PRODUCTION_RENDER_API;
      }
    }
    return cleaned;
  }

  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
      return PRODUCTION_RENDER_API;
    }
  }

  return 'http://127.0.0.1:8000';
}

// In-memory SWR cache for GET requests
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 15000; // 15 seconds TTL

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('crm_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path: string, opts?: RequestInit, retries: number = 1): Promise<any> {
  const method = (opts?.method || 'GET').toUpperCase();
  const cacheKey = `${method}:${path}`;
  const base = getApiBaseUrl();

  // If mutation (POST, PUT, DELETE), clear GET cache
  if (method !== 'GET') {
    cache.clear();
  }

  // Merge auth headers with any provided headers
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...(opts?.headers || {}),
  };

  // Return cached result if fresh for GET requests
  if (method === 'GET' && cache.has(cacheKey)) {
    const entry = cache.get(cacheKey)!;
    if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
      // Revalidate in background asynchronously
      fetch(`${base}${path}`, { headers, ...opts })
        .then((r) => (r.ok ? r.json() : null))
        .then((fresh) => {
          if (fresh) cache.set(cacheKey, { data: fresh, timestamp: Date.now() });
        })
        .catch(() => {});

      return entry.data;
    }
  }

  let lastError: any = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controllerSignal = opts?.signal || AbortSignal.timeout(15000);

      const res = await fetch(`${base}${path}`, {
        headers,
        signal: controllerSignal,
        ...opts,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || err.message || err.error || res.statusText);
      }

      const data = await res.json();
      if (method === 'GET') {
        cache.set(cacheKey, { data, timestamp: Date.now() });
      }

      return data;
    } catch (err: any) {
      lastError = err;
      // Only retry if it's a GET or idempotent, or network failure, and attempts remain
      if (attempt < retries && (method === 'GET' || err.name === 'AbortError' || err.message?.includes('fetch'))) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      break;
    }
  }

  throw lastError;
}

export async function checkHealthStatus(timeoutMs: number = 15000): Promise<boolean> {
  try {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(timeoutMs) });
    return res.ok;
  } catch {
    return false;
  }
}

