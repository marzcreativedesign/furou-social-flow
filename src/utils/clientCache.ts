
import { ExploreEventsData } from "@/types/explore";

interface CacheOptions {
  expireTimeInMinutes?: number;
  staleWhileRevalidate?: boolean;
}

interface CachedData<T> {
  _metadata?: {
    expiresAt?: string;
    cachedAt?: string;
  };
  data?: T;
}

/**
 * Generates a cache key based on prefix and parameters
 */
export const generateCacheKey = (
  prefix: string, 
  params: Record<string, any>
): string => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      if (params[key] !== undefined && params[key] !== null) {
        acc[key] = params[key];
      }
      return acc;
    }, {} as Record<string, any>);

  return `${prefix}_${JSON.stringify(sortedParams)}`;
};

/**
 * Gets cached data for a given key
 */
export const getCache = <T = any>(key: string): T | null => {
  try {
    const stored = localStorage.getItem(`cache_${key}`);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored) as CachedData<T>;
    return parsed.data as T || null;
  } catch (error) {
    console.error("Cache retrieval error:", error);
    return null;
  }
};

/**
 * Sets cache data with an optional expiration time
 */
export const setCache = <T>(
  key: string, 
  data: T, 
  options: CacheOptions = {}
): void => {
  try {
    const { expireTimeInMinutes = 5 } = options;
    
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expireTimeInMinutes * 60 * 1000);
    
    const cacheData: CachedData<T> = {
      data,
      _metadata: {
        cachedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString()
      }
    };
    
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Cache storage error:", error);
  }
};

/**
 * Verifies if a cache key is stale
 */
export const isCacheStale = (key: string): boolean => {
  try {
    const stored = localStorage.getItem(`cache_${key}`);
    if (!stored) return true;
    
    const parsed = JSON.parse(stored) as CachedData<any>;
    if (!parsed._metadata?.expiresAt) return true;
    
    const expiryTime = new Date(parsed._metadata.expiresAt).getTime();
    const now = new Date().getTime();
    
    return now > expiryTime;
  } catch (error) {
    console.error("Cache validation error:", error);
    return true;
  }
};
