
type CacheOptions = {
  expireTimeInMinutes: number;
  staleWhileRevalidate?: boolean;
};

type CacheMetadata = {
  createdAt: number;
  expiresAt: number;
  staleWhileRevalidate?: boolean;
};

type CacheItem<T> = {
  data: T;
  metadata: CacheMetadata;
};

export const generateCacheKey = (prefix: string, params: Record<string, any>): string => {
  const paramsString = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join('&');

  return `${prefix}:${paramsString}`;
};

export const setCache = <T>(
  key: string, 
  data: T, 
  options: CacheOptions
): void => {
  const now = Date.now();
  const expiresAt = now + options.expireTimeInMinutes * 60 * 1000;
  
  const cacheItem: CacheItem<T> = {
    data,
    metadata: {
      createdAt: now,
      expiresAt,
      staleWhileRevalidate: options.staleWhileRevalidate
    }
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Error setting cache:', error);
    // Se houver um erro (como exceder o limite de armazenamento), limpe o cache
    cleanCache();
  }
};

export const getCache = <T>(key: string): T | null => {
  try {
    const cachedItemString = localStorage.getItem(key);
    
    if (!cachedItemString) return null;
    
    const cachedItem = JSON.parse(cachedItemString) as CacheItem<T>;
    
    // Se o cache expirou e não estamos usando staleWhileRevalidate, retorne null
    if (
      cachedItem.metadata.expiresAt < Date.now() && 
      !cachedItem.metadata.staleWhileRevalidate
    ) {
      localStorage.removeItem(key);
      return null;
    }
    
    return cachedItem.data;
  } catch (error) {
    console.error('Error retrieving from cache:', error);
    return null;
  }
};

export const isCacheStale = (key: string): boolean => {
  try {
    const cachedItemString = localStorage.getItem(key);
    
    if (!cachedItemString) return false;
    
    const cachedItem = JSON.parse(cachedItemString) as CacheItem<any>;
    
    return cachedItem.metadata.expiresAt < Date.now();
  } catch (error) {
    console.error('Error checking if cache is stale:', error);
    return false;
  }
};

export const removeCache = (key: string): void => {
  localStorage.removeItem(key);
};

export const cleanCache = (maxAgeInMinutes = 60): void => {
  const now = Date.now();
  const maxAge = maxAgeInMinutes * 60 * 1000;
  
  // Iterar sobre todas as chaves no localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    if (key) {
      try {
        const value = localStorage.getItem(key);
        
        if (value) {
          const cachedItem = JSON.parse(value) as CacheItem<any>;
          
          // Verificar se o item está mais velho que maxAge
          if (now - cachedItem.metadata.createdAt > maxAge) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        // Ignorar itens que não são JSON válido ou não seguem o formato esperado
        continue;
      }
    }
  }
};

// Limpar cache expirado a cada 5 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    cleanCache(30); // Remover items mais velhos que 30 minutos
  }, 5 * 60 * 1000);
}
