
// Nomes dos caches
const STATIC_CACHE_NAME = 'eventos-static-v1';
const IMAGE_CACHE_NAME = 'eventos-images-v1';
const API_CACHE_NAME = 'eventos-api-v1';

// Recursos para cache estático (arquivos essenciais)
const staticAssets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/placeholder.svg'
];

// Função para verificar se a requisição é uma API
const isApiRequest = (url) => {
  // Adaptar conforme sua API
  return url.includes('/rest/v1/') || url.includes('.supabase.co');
};

// Função para verificar se a requisição é uma imagem
const isImageRequest = (url) => {
  return (
    url.includes('.jpg') || 
    url.includes('.jpeg') || 
    url.includes('.png') || 
    url.includes('.gif') || 
    url.includes('.webp') || 
    url.includes('.svg') ||
    url.includes('storage.googleapis.com') || // Supabase Storage
    url.includes('images.unsplash.com')
  );
};

// Instalação do service worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static files');
        return cache.addAll(staticAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação do service worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          // Remove caches antigos quando uma nova versão do service worker for ativada
          if (key !== STATIC_CACHE_NAME && key !== IMAGE_CACHE_NAME && key !== API_CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
      .then(() => self.clients.claim())
  );
});

// Estratégias de cache
const networkFirst = async (request, cacheName) => {
  try {
    // Tenta buscar da rede primeiro
    const networkResponse = await fetch(request);
    
    // Se a resposta foi bem-sucedida, armazena no cache
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse.clone();
  } catch (error) {
    // Se falhar, tenta buscar do cache
    console.log('[Service Worker] Network request failed, getting from cache', request.url);
    const cachedResponse = await caches.match(request);
    return cachedResponse || Promise.reject('no-match');
  }
};

const cacheFirst = async (request, cacheName) => {
  // Verifica primeiro no cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    // Se não estiver no cache, busca da rede
    const networkResponse = await fetch(request);
    
    // Armazena no cache se a resposta for válida
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Se falhar a rede e não estiver no cache, retorna erro
    return Promise.reject('no-match');
  }
};

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  // Ignora requisições não GET
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Ignora requisições do devtools, chrome-extension, etc
  if (
    url.origin !== self.location.origin &&
    !url.hostname.includes('supabase.co') &&
    !url.hostname.includes('googleapis.com') &&
    !url.hostname.includes('unsplash.com')
  ) {
    return;
  }

  // Estratégia baseada no tipo de recurso
  if (isApiRequest(event.request.url)) {
    // Para APIs, usar network-first (sempre tenta rede primeiro)
    event.respondWith(networkFirst(event.request, API_CACHE_NAME));
  } else if (isImageRequest(event.request.url)) {
    // Para imagens, usar cache-first (prioriza o cache)
    event.respondWith(cacheFirst(event.request, IMAGE_CACHE_NAME));
  } else {
    // Para outros recursos estáticos, usar cache-first
    event.respondWith(cacheFirst(event.request, STATIC_CACHE_NAME));
  }
});

// Sincronização em segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-events') {
    console.log('[Service Worker] Syncing events');
    // Implementar lógica para sincronizar dados em segundo plano
  }
});

// Recebimento de mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((keyList) => {
      Promise.all(keyList.map((key) => caches.delete(key)));
    });
    console.log('[Service Worker] Cache cleared by request');
  }
});

// Notificações push
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Notificação', options)
    );
  }
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Verifica se já existe uma janela aberta e a foca
      for (const client of clientList) {
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Se não houver janela aberta, abre uma nova
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
