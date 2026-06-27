/* Apologia Daily — service worker.
   Strategy:
   - /api/* and auth calls: NEVER cached (always live).
   - Page navigations: network-first (fresh content), fall back to cache, then
     to a cached shell — so the app still opens offline.
   - Static assets (css/js/png/svg/fonts): cache-first, refreshed in background.
   Bump CACHE_VERSION to force-update clients after a deploy. */
'use strict';

var CACHE_VERSION = 'apd-v2';
var SHELL = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/evidence-library.html',
  '/ad-nav.css',
  '/ad-nav.js',
  '/analytics.js',
  '/coach.js',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function (c) {
      // Best-effort precache; don't fail install if one URL 404s.
      return Promise.allSettled(SHELL.map(function (u) { return c.add(u); }));
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_VERSION; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;                       // never touch POST/PUT
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;        // skip cross-origin (CDNs, Supabase, Anthropic)
  if (url.pathname.indexOf('/api/') === 0) return;        // API is always live, never cached

  // Page navigations: network-first so arguments stay fresh.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE_VERSION).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) {
          return hit || caches.match('/index.html');
        });
      })
    );
    return;
  }

  // Static assets: cache-first, refresh in background.
  e.respondWith(
    caches.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(CACHE_VERSION).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    })
  );
});

/* ---- Push notifications (ready for the "daily argument" nudge) ----
   Server sends a push payload; this shows it. Wired but dormant until you
   add a push provider + VAPID keys. */
self.addEventListener('push', function (e) {
  // Payload pushes are supported, but our daily cron sends no payload — so we
  // fetch today's argument to show something fresh and specific.
  e.waitUntil((async function () {
    var data = {};
    try { if (e.data) data = e.data.json(); } catch (err) {}
    if (!data.title) {
      try {
        var r = await fetch('/api/today', { cache: 'no-store' });
        if (r.ok) data = await r.json();
      } catch (err2) {}
    }
    return self.registration.showNotification(data.title || 'Apologia Daily', {
      body: data.body || "Today's argument is ready.",
      icon: '/pwa-icon-192.png',
      badge: '/pwa-icon-192.png',
      data: { url: data.url || '/dashboard.html' }
    });
  })());
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var target = (e.notification.data && e.notification.data.url) || '/dashboard.html';
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf(target) !== -1 && 'focus' in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
