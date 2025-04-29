
import { ExploreEventsData } from "@/types/explore";
import { generateCacheKey, getCache, setCache } from "./clientCache";

/**
 * Gera uma chave de cache para eventos
 */
export const getEventsCacheKey = (
  prefix: string, 
  params: Record<string, any>
): string => {
  return generateCacheKey(prefix, params);
};

/**
 * Recupera eventos em cache
 */
export const getCachedEvents = <T = ExploreEventsData>(cacheKey: string): T | null => {
  return getCache<T>(cacheKey);
};

/**
 * Armazena eventos em cache
 */
export const cacheEvents = <T>(
  cacheKey: string, 
  data: T, 
  expireTimeInMinutes: number = 5
): void => {
  setCache(cacheKey, data, { expireTimeInMinutes });
};

/**
 * Verifica se o cache está expirado
 */
export const isCacheStale = (cacheKey: string): boolean => {
  const cache = getCache(cacheKey);
  if (!cache || !cache._metadata || !cache._metadata.expiresAt) return true;
  
  const expiryTime = new Date(cache._metadata.expiresAt).getTime();
  const now = new Date().getTime();
  
  return now > expiryTime;
};
