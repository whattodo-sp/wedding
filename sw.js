// 웨딩 영수증 서비스 워커: 설치 가능 조건 + 오프라인에서도 화면이 열리게 한다.
// 데이터는 브라우저 localStorage에 있어서 여기서는 화면 파일만 보관한다.
var CACHE = 'wedding-receipt-v1';
var FILES = ['./', './index.html', './icon-192.png', './icon-512.png', './manifest.json'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
// 네트워크 우선(새 버전이 바로 보이게), 실패하면 보관본
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(function (r) {
    var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); return r;
  }).catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match('./index.html'); }); }));
});
