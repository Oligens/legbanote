// Legba Note Service Worker
// Version: 2.3
// Stratégie: Cache First pour les assets, Network First pour les données

const CACHE_NAME = 'legba-note-v2.3';
const OFFLINE_URL = '/offline.html';

// Fichiers à mettre en cache lors de l'installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation en cours...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache ouvert:', CACHE_NAME);
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Assets statiques mis en cache');
        return self.skipWaiting(); // Activation immédiate
      })
      .catch((error) => {
        console.error('[SW] Erreur lors de la mise en cache:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation en cours...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Supprimer les anciens caches
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Suppression de l\'ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation terminée');
        return self.clients.claim(); // Prendre le contrôle immédiatement
      })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Stratégie différente selon le type de requête
  if (request.method !== 'GET') {
    // Pour les requêtes POST/PUT/DELETE, passer directement au réseau
    return;
  }
  
  // Assets statiques : Cache First
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // API calls : Network First avec fallback cache
  if (isApiCall(url)) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Navigation : Network First avec fallback offline
  if (request.mode === 'navigate') {
    event.respondWith(navigationHandler(request));
    return;
  }
  
  // Autres requêtes : Stale While Revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// Stratégie Cache First
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    console.log('[SW] Servir depuis le cache:', request.url);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      console.log('[SW] Mis en cache:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Erreur réseau:', error);
    return new Response('Ressource non disponible', { status: 503 });
  }
}

// Stratégie Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      console.log('[SW] Mis en cache depuis le réseau:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Réseau indisponible, fallback cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Données non disponibles hors-ligne', { status: 503 });
  }
}

// Stratégie Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const networkPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    return cachedResponse || new Response('Non disponible', { status: 503 });
  });
  
  return cachedResponse || networkPromise;
}

// Gestionnaire de navigation
async function navigationHandler(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('[SW] Navigation hors-ligne');
    const cachedResponse = await caches.match(OFFLINE_URL);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hors-ligne - Legba Note</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0a0f1d 0%, #132F4C 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
          }
          .container {
            max-width: 400px;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 16px;
          }
          p {
            font-size: 14px;
            opacity: 0.7;
            line-height: 1.6;
          }
          button {
            margin-top: 24px;
            padding: 12px 24px;
            background: rgba(0, 255, 255, 0.2);
            border: 1px solid rgba(0, 255, 255, 0.3);
            color: #00ffff;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
          }
          button:hover {
            background: rgba(0, 255, 255, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📡 Vous êtes hors-ligne</h1>
          <p>Legba Note nécessite une connexion internet pour accéder à l'API Gemini. 
          Vos cours et données locales restent accessibles.</p>
          <button onclick="window.location.reload()">Réessayer</button>
        </div>
      </body>
      </html>
    `, {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Fonctions utilitaires
function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2')
  );
}

function isApiCall(url) {
  return (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('generativelanguage.googleapis.com')
  );
}

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }).then(() => {
        console.log('[SW] Cache vidé');
      })
    );
  }
});

// Synchronisation en arrière-plan (Background Sync)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-courses') {
    console.log('[SW] Synchronisation des cours en arrière-plan');
    event.waitUntil(syncCourses());
  }
});

async function syncCourses() {
  // Logique de synchronisation des cours
  // Cette fonction sera appelée lorsque la connexion est rétablie
  console.log('[SW] Synchronisation terminée');
}

// Notifications Push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: 'Ouvrir',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Legba Note', options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification cliquée:', event.notification.tag);
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[SW] Service Worker Legba Note chargé');
