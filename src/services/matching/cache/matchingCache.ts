interface CacheEntry {
  timestamp: number;
  data: any;
}

const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedResult = (key: string): any | null => {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return entry.data;
};

export const setCachedResult = (key: string, data: any): void => {
  cache.set(key, {
    timestamp: Date.now(),
    data
  });
};

export const clearCache = (): void => {
  cache.clear();
};