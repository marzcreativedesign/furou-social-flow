
interface CacheData<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cache = {
  set<T>(key: string, data: T): void {
    try {
      const cacheData: CacheData<T> = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },

  get<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(`cache_${key}`);
      if (!stored) return null;

      const parsed: CacheData<T> = JSON.parse(stored);
      const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;
      
      if (isExpired) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
};
