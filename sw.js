const CACHE_NAME = 'mylog-v1';
const ASSETS = [
  'index.html',
  'howto.html',
  'icon.png',
  'manifest.json'
];

// インストール時にファイルをキャッシュ
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// オフライン時はキャッシュから、オンライン時はネットワークから取得（ネットワークファースト・フォールバック）
self.addEventListener('fetch', (e) => {
  // 外部CDN（Google FontsやApexCharts）はネットワークを取りに行き、失敗したらキャッシュを試みる
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});