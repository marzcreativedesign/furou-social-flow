
/**
 * Utilitários para cache no lado do cliente
 * Reduz tráfego de rede armazenando dados localmente
 */

// Tipo para configuração de cache
type CacheConfig = {
  expireTimeInMinutes?: number;
};

// Tipo para dados em cache com timestamp
type CachedData<T> = {
  data: T;
  timestamp: number;
};

// Configuração padrão: 5 minutos
const defaultConfig: CacheConfig = {
  expireTimeInMinutes: 5,
};

/**
 * Armazena dados no cache local
 * @param key Chave para armazenar os dados
 * @param data Dados a serem armazenados
 * @param config Configuração do cache (opcional)
 */
export const setCache = <T>(key: string, data: T, config: CacheConfig = defaultConfig): void => {
  try {
    const cacheData: CachedData<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
    console.log(`[Cache] Dados armazenados: ${key}`);
  } catch (error) {
    console.error("[Cache] Erro ao armazenar dados:", error);
  }
};

/**
 * Obtém dados do cache local
 * @param key Chave para recuperar os dados
 * @param config Configuração do cache (opcional)
 * @returns Dados do cache ou null se não existirem ou estiverem expirados
 */
export const getCache = <T>(key: string, config: CacheConfig = defaultConfig): T | null => {
  try {
    const cachedItem = localStorage.getItem(key);
    if (!cachedItem) {
      return null;
    }

    const { data, timestamp } = JSON.parse(cachedItem) as CachedData<T>;
    const expireTime = (config.expireTimeInMinutes || defaultConfig.expireTimeInMinutes!) * 60 * 1000;
    
    // Verifica se o cache expirou
    if (Date.now() - timestamp > expireTime) {
      console.log(`[Cache] Dados expirados: ${key}`);
      localStorage.removeItem(key);
      return null;
    }
    
    console.log(`[Cache] Dados recuperados: ${key}`);
    return data;
  } catch (error) {
    console.error("[Cache] Erro ao recuperar dados:", error);
    return null;
  }
};

/**
 * Remove dados do cache local
 * @param key Chave para remover os dados
 */
export const removeCache = (key: string): void => {
  try {
    localStorage.removeItem(key);
    console.log(`[Cache] Dados removidos: ${key}`);
  } catch (error) {
    console.error("[Cache] Erro ao remover dados:", error);
  }
};

/**
 * Limpa todos os itens do cache que começam com um determinado prefixo
 * @param prefix Prefixo das chaves a serem removidas
 */
export const clearCacheByPrefix = (prefix: string): void => {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(prefix))
      .forEach(key => localStorage.removeItem(key));
    console.log(`[Cache] Dados com prefixo "${prefix}" removidos`);
  } catch (error) {
    console.error("[Cache] Erro ao limpar cache por prefixo:", error);
  }
};

/**
 * Gera uma chave de cache com base nos parâmetros
 * @param baseKey Chave base
 * @param params Parâmetros adicionais
 * @returns Chave de cache formatada
 */
export const generateCacheKey = (baseKey: string, params?: Record<string, any>): string => {
  if (!params) return baseKey;
  
  const paramsStr = Object.entries(params)
    .map(([key, value]) => `${key}:${value}`)
    .join('_');
  
  return `${baseKey}_${paramsStr}`;
};
