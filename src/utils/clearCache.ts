
/**
 * Função para limpar o cache do navegador
 * Útil quando há problemas de visualização na interface
 */
export const clearAllCache = () => {
  // Limpa o cache do localStorage
  localStorage.clear();
  
  // Limpa o cache do sessionStorage
  sessionStorage.clear();
  
  // Remove todos os cookies
  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  });
  
  // Atualiza a página para garantir que as mudanças sejam aplicadas
  window.location.reload();
};

/**
 * Verifica se o cache deve ser limpo com base em uma marca de tempo
 */
export const clearCacheIfNeeded = () => {
  const lastCacheClear = localStorage.getItem('lastCacheClear');
  const now = Date.now();
  
  // Limpa o cache se nunca foi limpo ou se foi há mais de 24 horas
  if (!lastCacheClear || now - parseInt(lastCacheClear) > 24 * 60 * 60 * 1000) {
    clearAllCache();
    localStorage.setItem('lastCacheClear', now.toString());
  }
};
