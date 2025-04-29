
const CACHE_PREFIX = 'app_';

interface CacheOptions {
  expireTimeInMinutes?: number;
  staleWhileRevalidate?: boolean;
}

interface CacheItem<T> {
  value: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Gera uma chave de cache baseada nos parâmetros
 */
export const generateCacheKey = (
  prefix: string, 
  params: Record<string, any> = {}
): string => {
  const paramString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join('&');
    
  return `${CACHE_PREFIX}${prefix}:${paramString}`;
};

/**
 * Obtém um item do cache
 */
export const getCache = <T>(key: string): T | null => {
  try {
    const storedItem = localStorage.getItem(key);
    if (!storedItem) return null;
    
    const cacheItem: CacheItem<T> = JSON.parse(storedItem);
    
    // Se já expirou, retorna null
    if (Date.now() > cacheItem.expiresAt) {
      return null;
    }
    
    return cacheItem.value;
  } catch (error) {
    console.error('Error retrieving from cache:', error);
    return null;
  }
};

/**
 * Armazena um item no cache
 */
export const setCache = <T>(
  key: string, 
  value: T,
  options?: CacheOptions
): void => {
  try {
    const expireMinutes = options?.expireTimeInMinutes || 5;
    const expiresAt = Date.now() + (expireMinutes * 60 * 1000);
    
    const cacheItem: CacheItem<T> = {
      value,
      timestamp: Date.now(),
      expiresAt
    };
    
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Error storing in cache:', error);
  }
};

/**
 * Verifica se o cache está "stale" (expirado, mas ainda potencialmente útil)
 */
export const isCacheStale = (key: string): boolean => {
  try {
    const storedItem = localStorage.getItem(key);
    if (!storedItem) return false;
    
    const cacheItem = JSON.parse(storedItem);
    const staleTime = cacheItem.timestamp + (60 * 1000); // 1 minuto
    
    // Retorna true se passou do tempo de stale mas não expirou completamente
    return Date.now() > staleTime && Date.now() < cacheItem.expiresAt;
  } catch (error) {
    return false;
  }
};

/**
 * Remove um item do cache
 */
export const removeCache = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from cache:', error);
  }
};

/**
 * Limpa todo o cache da aplicação
 */
export const clearAppCache = (): void => {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing app cache:', error);
  }
};
