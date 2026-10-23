/* AP Math Online app: service worker for the installed app (scope: /ap-math-tracker/).
   Pages and data: network first, so students always get the latest version; the saved copy is used only offline.
   Fonts and KaTeX: saved once. Bump VERSION when the list of core files changes. */
const VERSION = "app-v1";
const CORE = ["learn.html", "app.html", "courses.js", "quiz-config.js", "quiz-bank.js", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(CORE.map(f => c.add(new Request(f, { cache: "reload" })).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("app-v") && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith((async () => {
      const c = await caches.open(VERSION);
      try {
        const res = await fetch(req, { cache: "no-cache" });
        if (res.ok && !/\.(mp4|webm)$/i.test(url.pathname)) c.put(req, res.clone());
        return res;
      } catch (err) {
        return (await c.match(req, { ignoreSearch: true })) || (req.mode === "navigate" && await c.match("learn.html")) || Response.error();
      }
    })());
    return;
  }
  if (/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(url.host)) {
    e.respondWith((async () => {
      const c = await caches.open("app-ext");
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === "opaque") c.put(req, res.clone());
      return res;
    })());
  }
});
