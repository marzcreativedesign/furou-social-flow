
/**
 * Funções utilitárias para gerenciar o cache do cliente
 */

// Tempo padrão de expiração do cache (30 minutos)
const DEFAULT_CACHE_TTL = 30 * 60 * 1000;

/**
 * Opções de configuração de cache
 */
export interface CacheOptions {
  expireTimeInMinutes?: number;
  staleWhileRevalidate?: boolean;
}

/**
 * Interface para itens em cache
 */
export interface CacheItem<T> {
  data: T;
  timestamp: number;
}

/**
 * Verifica se o cache está expirado
 * @param key Chave do item em cache
 * @param ttl Tempo de vida em milissegundos
 */
export const isCacheStale = (key: string, ttl = DEFAULT_CACHE_TTL): boolean => {
  try {
    const cachedItem = localStorage.getItem(key);
    if (!cachedItem) return true;
    
    const { timestamp } = JSON.parse(cachedItem);
    return Date.now() - timestamp > ttl;
  } catch (error) {
    console.error('Erro ao verificar status do cache:', error);
    return true;
  }
};

/**
 * Gera uma chave de cache única com base em parâmetros
 * @param prefix Prefixo para a chave (ex: 'events', 'users')
 * @param params Objeto com parâmetros para diferenciar itens em cache
 */
export const generateCacheKey = (prefix: string, params?: Record<string, any>): string => {
  if (!params) return `app:${prefix}`;
  
  const paramString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  
  return `app:${prefix}:${paramString}`;
};

/**
 * Salva dados no cache local
 * @param key Chave para identificar os dados
 * @param data Dados a serem armazenados
 * @param options Opções de configuração do cache
 */
export const setCache = <T>(key: string, data: T, options?: CacheOptions): void => {
  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Erro ao salvar no cache:', error);
  }
};

/**
 * Recupera dados do cache local
 * @param key Chave para identificar os dados
 * @param ttl Tempo de vida em milissegundos (opcional)
 */
export const getCache = <T>(key: string, ttl = DEFAULT_CACHE_TTL): T | null => {
  try {
    const cachedItem = localStorage.getItem(key);
    if (!cachedItem) return null;
    
    const { data, timestamp } = JSON.parse(cachedItem);
    
    if (Date.now() - timestamp > ttl) {
      // Cache expirado, remover e retornar null
      localStorage.removeItem(key);
      return null;
    }
    
    return data as T;
  } catch (error) {
    console.error('Erro ao recuperar do cache:', error);
    return null;
  }
};

/**
 * Limpa todo o cache relacionado à aplicação
 */
export const clearAppCache = (): void => {
  try {
    const keysToRemove: string[] = [];
    
    // Encontra todas as chaves que começam com 'app:'
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('app:')) {
        keysToRemove.push(key);
      }
    }
    
    // Remove cada item
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('Cache da aplicação limpo com sucesso');
  } catch (error) {
    console.error('Erro ao limpar cache da aplicação:', error);
  }
};

/**
 * Alias para as funções principais para compatibilidade com código existente
 */
export const saveToCache = setCache;
export const getFromCache = getCache;

// Ensure all necessary functions are explicitly exported
export { DEFAULT_CACHE_TTL };
