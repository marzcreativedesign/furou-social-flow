
interface CacheOptions {
  expireTimeInMinutes?: number;
  staleWhileRevalidate?: boolean;
  maxSize?: number;
}

interface CacheMetadata {
  expiresAt?: string;
  cachedAt?: string;
  lastAccessed?: string;
  accessCount?: number;
}

interface CachedData<T> {
  _metadata?: CacheMetadata;
  data?: T;
}

// Cache size control
const MAX_CACHE_SIZE = 50; // Maximum number of cached items
const DEFAULT_EXPIRY = 5; // Default expiry in minutes

// Memory cache for faster access without localStorage overhead
const memoryCache: Record<string, any> = {};

/**
 * Generates a cache key based on prefix and parameters
 */
export const generateCacheKey = (
  prefix: string, 
  params: Record<string, any>
): string => {
  // Sort parameters for consistent cache keys
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
 * Gets cached data for a given key with performance optimizations
 */
export const getCache = <T = any>(key: string): T | null => {
  try {
    // Check memory cache first for faster access
    if (memoryCache[key]) {
      // Update metadata
      const data = memoryCache[key];
      if (data._metadata) {
        data._metadata.lastAccessed = new Date().toISOString();
        data._metadata.accessCount = (data._metadata.accessCount || 0) + 1;
      }
      return data.data as T;
    }
    
    const stored = localStorage.getItem(`cache_${key}`);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored) as CachedData<T>;
    
    // Update metadata
    if (parsed._metadata) {
      parsed._metadata.lastAccessed = new Date().toISOString();
      parsed._metadata.accessCount = (parsed._metadata.accessCount || 0) + 1;
      
      // Save back with updated metadata
      localStorage.setItem(`cache_${key}`, JSON.stringify(parsed));
    }
    
    // Also store in memory cache
    memoryCache[key] = parsed;
    
    return parsed.data as T || null;
  } catch (error) {
    console.error("Cache retrieval error:", error);
    return null;
  }
};

/**
 * Sets cache data with improved memory management
 */
export const setCache = <T>(
  key: string, 
  data: T, 
  options: CacheOptions = {}
): void => {
  try {
    const { 
      expireTimeInMinutes = DEFAULT_EXPIRY,
      maxSize = MAX_CACHE_SIZE
    } = options;
    
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expireTimeInMinutes * 60 * 1000);
    
    const cacheData: CachedData<T> = {
      data,
      _metadata: {
        cachedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        lastAccessed: now.toISOString(),
        accessCount: 0
      }
    };
    
    // Store in memory for faster access
    memoryCache[key] = cacheData;
    
    // Store in localStorage for persistence
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
    
    // Clean up cache if it's getting too large
    cleanupCache(maxSize);
  } catch (error) {
    console.error("Cache storage error:", error);
  }
};

/**
 * Verifies if a cache key is stale
 */
export const isCacheStale = (key: string): boolean => {
  try {
    // Check memory cache first
    if (memoryCache[key] && memoryCache[key]._metadata?.expiresAt) {
      const expiryTime = new Date(memoryCache[key]._metadata.expiresAt).getTime();
      return new Date().getTime() > expiryTime;
    }
    
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

/**
 * Cleans up the cache when it exceeds the maximum size
 */
const cleanupCache = (maxSize: number = MAX_CACHE_SIZE): void => {
  try {
    // Get all cache keys
    const cacheKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        cacheKeys.push(key.substring(6)); // Remove 'cache_' prefix
      }
    }
    
    if (cacheKeys.length <= maxSize) return;
    
    // If we have too many items, remove least recently used
    const cacheItems = cacheKeys.map(key => {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return { key, lastAccessed: new Date(0).toISOString() };
      
      try {
        const parsed = JSON.parse(item);
        return { 
          key, 
          lastAccessed: parsed._metadata?.lastAccessed || new Date(0).toISOString(),
          accessCount: parsed._metadata?.accessCount || 0
        };
      } catch (e) {
        return { key, lastAccessed: new Date(0).toISOString() };
      }
    });
    
    // Sort by last accessed (oldest first) and access count (least used first)
    cacheItems.sort((a, b) => {
      // First compare by access count
      const countDiff = (a.accessCount || 0) - (b.accessCount || 0);
      if (countDiff !== 0) return countDiff;
      
      // Then by last accessed time
      return new Date(a.lastAccessed).getTime() - new Date(b.lastAccessed).getTime();
    });
    
    // Remove the oldest/least used items
    const itemsToRemove = cacheItems.slice(0, cacheItems.length - maxSize);
    itemsToRemove.forEach(item => {
      localStorage.removeItem(`cache_${item.key}`);
      delete memoryCache[item.key];
    });
    
  } catch (error) {
    console.error("Cache cleanup error:", error);
  }
};

/**
 * Clears all cached data
 */
export const clearCache = (): void => {
  try {
    // Clear memory cache
    Object.keys(memoryCache).forEach(key => {
      delete memoryCache[key];
    });
    
    // Clear localStorage cache
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error("Cache clear error:", error);
  }
};
