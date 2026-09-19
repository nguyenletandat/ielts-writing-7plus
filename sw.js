// Minimal offline app-shell cache for the static IELTS Writing 7.0+ site.
// Cross-origin requests (Gemini API calls, fonts, etc.) are never intercepted.
var CACHE_NAME = "ielts-cache-v1";
var CORE_ASSETS = [
  "./",
  "./index.html",
  "./lessons.html",
  "./question-bank.html",
  "./practice.html",
  "./flashcards.html",
  "./paraphrase.html",
  "./css/style.css",
  "./js/main.js",
  "./js/practice.js",
  "./js/chart-data.js",
  "./js/chart-render.js",
  "./js/chart-builder.js",
  "./js/ai-grading.js",
  "./js/question-bank-data.js",
  "./js/vocab-data.js",
  "./js/flashcards.js",
  "./js/paraphrase-data.js",
  "./manifest.json",
  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(CORE_ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  var url = new URL(event.request.url);
  if (url.origin !== location.origin) return; // never intercept cross-origin (e.g. Gemini API)

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(function (resp) {
          var copy = resp.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
          return resp;
        })
        .catch(function () {
          return caches.match(event.request).then(function (r) { return r || caches.match("./index.html"); });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      var fetchPromise = fetch(event.request).then(function (resp) {
        if (resp && resp.status === 200) {
          var copy = resp.clone();
          caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
        }
        return resp;
      }).catch(function () { return cached; });
      return cached || fetchPromise;
    })
  );
});
