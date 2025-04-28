
/**
 * Funções utilitárias para gerenciar o cache do cliente
 */

// Tempo padrão de expiração do cache (30 minutos)
const DEFAULT_CACHE_TTL = 30 * 60 * 1000;

/**
 * Verifica se o cache está expirado
 * @param timestamp Timestamp do último armazenamento
 * @param ttl Tempo de vida em milissegundos
 */
export const isCacheStale = (timestamp: number, ttl = DEFAULT_CACHE_TTL): boolean => {
  return Date.now() - timestamp > ttl;
};

/**
 * Salva dados no cache local
 * @param key Chave para identificar os dados
 * @param data Dados a serem armazenados
 */
export const saveToCache = <T>(key: string, data: T): void => {
  try {
    const cacheItem = {
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
 * @param ttl Tempo de vida em milissegundos
 */
export const getFromCache = <T>(key: string, ttl = DEFAULT_CACHE_TTL): T | null => {
  try {
    const cachedItem = localStorage.getItem(key);
    if (!cachedItem) return null;
    
    const { data, timestamp } = JSON.parse(cachedItem);
    
    if (isCacheStale(timestamp, ttl)) {
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
