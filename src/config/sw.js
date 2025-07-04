/**
 * Service Worker - MSoft Framework
 * Cache e funcionalidades offline
 */

// Função de debug condicional para Service Worker
function debugLog(message, data = null) {
  // Verifica se o debug está habilitado via URL
  const urlParams = new URLSearchParams(self.location.search);
  const isDebugEnabled = urlParams.get('debug') === 'true';
  
  if (isDebugEnabled) {
    if (data) {
      console.log(`[SW Debug] ${message}`, data);
    } else {
      console.log(`[SW Debug] ${message}`);
    }
  }
}

const CACHE_NAME = 'msoft-framework-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/assets/css/style.css',
  '/src/core/core.js',
  '/src/core/component.js',
  '/src/core/helpers.js',
  '/src/core/skeleton.js',
  '/src/config/config.js',
  '/src/config/env.js',
  '/src/config/security.js',
  '/src/utils/validator.js',
  '/env.development.js',
  '/env.production.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://code.jquery.com/jquery-3.7.1.min.js',
  'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css',
  'https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css',
  'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        debugLog('Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Erro ao instalar cache:', error);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            debugLog('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna do cache se disponível
        if (response) {
          return response;
        }

        // Se não estiver no cache, busca da rede
        return fetch(event.request)
          .then((response) => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta para armazenar no cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Fallback para páginas offline
            if (event.request.destination === 'document') {
              return caches.match('/src/pages/404.html');
            }
          });
      })
  );
});

// Mensagens do Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Função para sincronização em background
function doBackgroundSync() {
  // Implementar sincronização de dados quando necessário
  debugLog('Sincronização em background executada');
}

// Notificações push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do MSoft Framework',
          icon: '/src/assets/favicon/favicon-32x32.png',
      badge: '/src/assets/favicon/favicon-16x16.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver mais',
        icon: '/src/assets/favicon/favicon-16x16.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/src/assets/favicon/favicon-16x16.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('MSoft Framework', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 