self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || "Live member JKT48!";
  const options = {
    body: data.body || "Ada member JKT48 yang sedang live!",
    icon: data.icon || "https://example.com/icon.png",
    badge: data.badge || "https://example.com/badge.png",
    actions: [
      {
        action: 'open',
        title: data.actionTitle || 'Buka Live Stream',
        url: data.url || 'https://www.jkt48connect.my.id/'
      }
    ]
  };
  
  event.waitUntil(self.registration.showNotification(title, options));
});

// Mendaftar service worker ketika halaman dimuat
self.addEventListener('install', function(event) {
  console.log('Service Worker installed');
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activated');
});
