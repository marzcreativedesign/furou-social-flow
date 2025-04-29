
import { ExploreEventsData } from "@/types/explore";
import { 
  generateCacheKey, 
  getCache, 
  setCache, 
  isCacheStale 
} from "./clientCache";

/**
 * Gera chave de cache para eventos com parâmetros personalizados
 */
export const getEventsCacheKey = (prefix: string, params: Record<string, any>) => {
  return generateCacheKey(prefix, params);
};

/**
 * Recupera eventos em cache
 */
export const getCachedEvents = (cacheKey: string): ExploreEventsData | null => {
  return getCache<ExploreEventsData>(cacheKey);
};

/**
 * Verifica se o cache de eventos está expirado (stale)
 * Re-exportando a função do clientCache
 */
export { isCacheStale };

/**
 * Armazena eventos em cache com tempo de expiração configurável
 */
export const cacheEvents = (
  cacheKey: string, 
  data: ExploreEventsData, 
  expireTimeInMinutes: number = 5
): void => {
  setCache(cacheKey, data, { 
    expireTimeInMinutes,
    staleWhileRevalidate: true // Permite usar dados expirados enquanto recarrega
  });
};

/**
 * Limpa o cache de eventos por prefixo
 */
export const clearEventsCache = (prefix: string = 'events'): void => {
  // Implementar limpeza de cache
  const keysToRemove = Object.keys(localStorage)
    .filter(key => key.startsWith(prefix));
    
  keysToRemove.forEach(key => localStorage.removeItem(key));
};
