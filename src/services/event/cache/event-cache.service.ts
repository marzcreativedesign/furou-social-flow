
/**
 * Event Cache Service
 * Provides caching functionality for events to reduce unnecessary API calls
 */
import { Event } from "@/types/event";

interface CachedResponse<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // Cache expiry time in milliseconds
}

const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export const EventCacheService = {
  /**
   * Store data in the client cache
   */
  setCache: <T>(key: string, data: T, expiresIn: number = DEFAULT_CACHE_TIME): void => {
    try {
      const cacheItem: CachedResponse<T> = {
        data,
        timestamp: Date.now(),
        expiresIn,
      };
      
      localStorage.setItem(`event_cache_${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.error("Error setting cache:", error);
    }
  },

  /**
   * Get data from client cache if available and not expired
   */
  getCache: <T>(key: string): T | null => {
    try {
      const cacheJson = localStorage.getItem(`event_cache_${key}`);
      
      if (!cacheJson) return null;
      
      const cache = JSON.parse(cacheJson) as CachedResponse<T>;
      const now = Date.now();
      
      // Check if cache is expired
      if (now - cache.timestamp > cache.expiresIn) {
        localStorage.removeItem(`event_cache_${key}`);
        return null;
      }
      
      return cache.data;
    } catch (error) {
      console.error("Error getting cache:", error);
      return null;
    }
  },

  /**
   * Check if the cache exists for a specific key
   */
  hasCache: (key: string): boolean => {
    return !!localStorage.getItem(`event_cache_${key}`);
  },
  
  /**
   * Clear a specific cache item
   */
  clearCache: (key: string): void => {
    localStorage.removeItem(`event_cache_${key}`);
  },
  
  /**
   * Clear all event cache items
   */
  clearAllCache: (): void => {
    Object.keys(localStorage)
      .filter(key => key.startsWith('event_cache_'))
      .forEach(key => localStorage.removeItem(key));
  }
};

export default EventCacheService;
