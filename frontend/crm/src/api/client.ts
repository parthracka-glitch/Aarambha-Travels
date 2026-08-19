const API = 'http://127.0.0.1:8000';

// In-memory SWR cache for GET requests
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 15000; // 15 seconds TTL

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('crm_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path: string, opts?: RequestInit) {
  const method = (opts?.method || 'GET').toUpperCase();
  const cacheKey = `${method}:${path}`;

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
      fetch(`${API}${path}`, { headers, ...opts })
        .then((r) => (r.ok ? r.json() : null))
        .then((fresh) => {
          if (fresh) cache.set(cacheKey, { data: fresh, timestamp: Date.now() });
        })
        .catch(() => {});

      return entry.data;
    }
  }

  const controllerSignal = opts?.signal || AbortSignal.timeout(4000);

  const res = await fetch(`${API}${path}`, {
    headers,
    signal: controllerSignal,
    ...opts,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || res.statusText);
  }

  const data = await res.json();
  if (method === 'GET') {
    cache.set(cacheKey, { data, timestamp: Date.now() });
  }

  return data;
}

export async function checkHealthStatus(): Promise<boolean> {
  try {
    const res = await fetch(`${API}/api/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
