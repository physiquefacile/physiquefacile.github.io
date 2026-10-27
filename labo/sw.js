/* Service worker du Labo Virtuel de Physique (/labo/) : ouverture rapide et TP hors connexion.
   Caches préfixés « labo- » : le site principal ne les touche pas. Changer VERSION à chaque mise à jour. */
const VERSION = "labo-67-2";
const SHELL = "labo-shell-" + VERSION, PDFS = "labo-pdf-v1";
const SHELL_FILES = ["./", "index.html", "tp.html", "auteur.html", "manifest.webmanifest", "../assets/site.css", "../assets/acces.js", "../assets/config.js", "../assets/tp-core.js", "../assets/tp-cr.js", "../assets/tp-elec.js", "../assets/tp-meca.js", "../assets/tp-mesures.js", "../assets/tp-optique.js", "../assets/tp-oscillo.js", "../assets/tp-qd.js", "../icons/icon-192.png", "../icons/apple-touch-icon.png"];
const DOCS = ["docs/Fascicule_TP_Physique_L1.pdf"];
self.addEventListener("install", e => { e.waitUntil((async () => { const c = await caches.open(SHELL); await Promise.all(SHELL_FILES.map(async u => { try { const r = await fetch(new Request(u, { cache: "no-cache" })); if (r.ok) await c.put(u, r); } catch (err) {} })); self.skipWaiting(); })()); });
self.addEventListener("activate", e => { e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k.startsWith("labo-shell-") && k !== SHELL) await caches.delete(k);
  await self.clients.claim();
  try { const d = await caches.open(PDFS); for (const u of DOCS) { const r = await fetch(u, { cache: "no-cache" }); if (r.ok) await d.put(new URL(u, self.registration.scope).pathname, r); } } catch (err) {}
})()); });
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url); if (url.origin !== location.origin || url.pathname.endsWith("/reparer.html")) return;
  if (url.pathname.endsWith(".pdf")) { e.respondWith((async () => { const d = await caches.open(PDFS), hit = await d.match(url.pathname), net = fetch(url.pathname, { cache: "no-cache" }).then(r => { if (r.ok) d.put(url.pathname, r.clone()); return r; }).catch(() => null); if (hit) { e.waitUntil(net); return hit; } return (await net) || Response.error(); })()); return; }
  e.respondWith((async () => { const c = await caches.open(SHELL), hit = await c.match(req, { ignoreSearch: true }); if (hit) return hit;
    try { const r = await fetch(req); if (r.ok && /\.(html|js|css|json|webmanifest|png|jpg|svg|woff2?)$|\/$/.test(url.pathname)) c.put(req, r.clone()); return r; }
    catch (err) { if (req.mode === "navigate") return (await c.match("index.html")) || Response.error(); return Response.error(); } })());
});
