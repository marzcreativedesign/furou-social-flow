
import { ExploreEventsData } from "@/types/explore";
import { generateCacheKey, getCache, setCache, isCacheStale } from "./clientCache";

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
 * Verifica se o cache está expirado (re-exportando da função principal)
 */
export { isCacheStale };
