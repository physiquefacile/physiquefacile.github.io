/* Service worker : consultation hors connexion et ouverture rapide de la plateforme.
   - pages et ressources du site : servies immédiatement depuis la copie locale de la version installée ;
     une nouvelle version (VERSION ci-dessous) est téléchargée en arrière-plan — seuls les fichiers modifiés
     sont retransférés — puis la page se recharge une fois toute seule (sauf la page des TP).
     ⚠ Toute modification du site doit s'accompagner d'un changement de VERSION.
   - documents PDF : copie locale d'abord, rafraîchie en arrière-plan
   - bibliothèques externes (KaTeX) : copie locale permanente */
const VERSION = "v90";
const SHELL = "shell-" + VERSION;
const PDFS = "pdf-v1";          // nom stable : les documents enregistrés survivent aux mises à jour du site
const EXT = "ext-v1";           // KaTeX ne change pas : inutile de le retélécharger à chaque version

const SHELL_FILES = [
  "./", "index.html", "quiz.html", "simulations.html", "entrainement.html", "calendrier.html", "questions.html", "videos.html", "tp.html", "auteur.html",
  "assets/site.css", "assets/quiz-data.js", "assets/acces.js", "assets/exos.js", "assets/exos-reperes.js", "assets/exos-optique.js", "assets/optique-svg.js", "assets/quiz-optique-fig.js", "assets/annonces.js", "assets/config.js", "assets/videos.js", "assets/tp-cr.js", "assets/tp-qd.js", "assets/tp-core.js", "assets/tp-meca.js", "assets/tp-elec.js", "assets/tp-oscillo.js", "assets/tp-mesures.js", "assets/tp-optique.js", "manifest.webmanifest",
  "vendor/pdfjs/pdf.js", "vendor/pdfjs/pdf.worker.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png",
  "img/Support_Chapitre_1_Calcul_vectoriel.jpg", "img/Support_Chapitre_2_Cinematique.jpg",
  "img/Support_Chapitre_3_Dynamique.jpg", "img/Support_Chapitre_4_Travail_energie.jpg",
  "img/Electricite_Chapitre_1_Electrostatique.jpg", "img/Electricite_Chapitre_2_Champ_potentiel.jpg", "img/Electricite_Chapitre_3_Dipole.jpg", "img/Fascicule_TP_Physique_L1.jpg", "img/Optique_Chapitre_1_Lois_fondamentales.jpg", "img/Optique_Chapitre_2_Formation_images.jpg", "img/Optique_Chapitre_3_Prisme_lame.jpg", "img/Optique_Chapitre_4_Miroirs_dioptres_spheriques.jpg", "img/Optique_Chapitre_5_Lentilles_minces.jpg"
];
/* supports de cours et TD (≈ 3,4 Mo) : enregistrés dès la première visite */
const DOC_FILES = [
  "docs/Fascicule_TP_Physique_L1.pdf",
  "docs/Electricite_Chapitre_1_Electrostatique.pdf",
  "docs/Electricite_Chapitre_2_Champ_potentiel.pdf",
  "docs/Electricite_Chapitre_3_Dipole.pdf",
  "docs/Optique_Chapitre_1_Lois_fondamentales.pdf",
  "docs/TD_Optique_1_enonces.pdf",
  "docs/TD_Optique_1_corrige.pdf",
  "docs/Optique_Chapitre_2_Formation_images.pdf",
  "docs/TD_Optique_2_enonces.pdf",
  "docs/TD_Optique_2_corrige.pdf",
  "docs/Optique_Chapitre_3_Prisme_lame.pdf",
  "docs/TD_Optique_3_enonces.pdf",
  "docs/TD_Optique_3_corrige.pdf",
  "docs/Optique_Chapitre_4_Miroirs_dioptres_spheriques.pdf",
  "docs/TD_Optique_4_enonces.pdf",
  "docs/TD_Optique_4_corrige.pdf",
  "docs/Optique_Chapitre_5_Lentilles_minces.pdf",
  "docs/TD_Optique_5_enonces.pdf",
  "docs/TD_Optique_5_corrige.pdf",
  "docs/Support_Chapitre_1_Calcul_vectoriel.pdf",
  "docs/Support_Chapitre_2_Cinematique.pdf",
  "docs/Support_Chapitre_3_Dynamique.pdf",
  "docs/Support_Chapitre_4_Travail_energie.pdf",
  "docs/TD1_Calcul_vectoriel_corrige.pdf",
  "docs/TD1_Calcul_vectoriel_enonces.pdf",
  "docs/TD2_Cinematique_corrige.pdf",
  "docs/TD2_Cinematique_enonces.pdf",
  "docs/TD3_Dynamique_corrige.pdf",
  "docs/TD3_Dynamique_enonces.pdf",
  "docs/TD4_Travail_energie_corrige.pdf",
  "docs/TD4_Travail_energie_enonces.pdf",
  "docs/TD_Electricite_1_corrige.pdf",
  "docs/TD_Electricite_1_enonces.pdf",
  "docs/TD_Electricite_2_corrige.pdf",
  "docs/TD_Electricite_2_enonces.pdf"
];
/* documents modifiés : augmenter le numéro force le remplacement de la copie enregistrée sur les appareils */
const DOC_REV = { "docs/Fascicule_TP_Physique_L1.pdf": 6 };
const EXT_FILES = [
  "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js"
];

const scope = () => new URL(self.registration.scope);
const path = u => new URL(u, self.registration.scope).pathname;

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const s = await caches.open(SHELL);
    // « no-cache » : le navigateur demande au serveur si le fichier a changé ; s'il n'a pas changé (réponse 304),
    // il réutilise sa copie sans retélécharger. Seuls les fichiers modifiés transitent donc sur le réseau.
    await Promise.all(SHELL_FILES.map(async u => {
      try { const r = await fetch(new Request(u, { cache: "no-cache" })); if (r.ok) await s.put(u, r); } catch (err) {}
    }));
    self.skipWaiting();
  })());
});

/* documents et bibliothèques : téléchargés en arrière-plan, sans retarder la mise à jour du site */
async function prechargerDocs() {
  try {
    const d = await caches.open(PDFS);
    // remplacement des documents mis à jour (copie enregistrée périmée)
    let rev = {}; try { const r0 = await d.match("/__docrev"); if (r0) rev = await r0.json(); } catch (err) {}
    for (const u of Object.keys(DOC_REV)) if (rev[u] !== DOC_REV[u]) { await d.delete(path(u)); rev[u] = DOC_REV[u]; }
    await d.put("/__docrev", new Response(JSON.stringify(rev), { headers: { "Content-Type": "application/json" } }));
    for (const u of DOC_FILES) {
      const key = path(u);
      if (await d.match(key)) continue;
      try { const r = await fetch(u, { cache: "no-cache" }); if (r.ok) await d.put(key, r); } catch (err) {}
    }
    const x = await caches.open(EXT);
    for (const u of EXT_FILES) { if (!(await x.match(u))) { try { await x.add(new Request(u, { mode: "cors" })); } catch (err) {} } }
  } catch (err) {}
}

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keep = [SHELL, PDFS, EXT];
    for (const k of await caches.keys()) if (!keep.includes(k) && !k.startsWith("labo-")) await caches.delete(k);   // les caches du Labo virtuel (/labo/) lui appartiennent
    await self.clients.claim();
  })());
  prechargerDocs();
});

const isPdf = url => url.pathname.endsWith(".pdf");
const isExt = url => /(^|\.)cdnjs\.cloudflare\.com$|fonts\.googleapis\.com$|fonts\.gstatic\.com$/.test(url.hostname);
const legere = url => /\.(html|js|css|json|webmanifest|png|jpg|jpeg|svg|ico|woff2?)$/i.test(url.pathname) || url.pathname.endsWith("/");

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (/\.(mp4|webm)$/i.test(url.pathname)) return;   // vidéos : lecture directe par le navigateur (requêtes partielles), jamais mises en cache

  if (url.origin === location.origin && isPdf(url)) {
    // copie locale immédiate, puis mise à jour en arrière-plan si internet est disponible
    e.respondWith((async () => {
      const c = await caches.open(PDFS);
      const hit = await c.match(url.pathname, { ignoreSearch: true, ignoreVary: true });
      const net = fetch(url.pathname, { cache: "no-cache" }).then(res => { if (res.ok) c.put(url.pathname, res.clone()); return res; }).catch(() => null);
      if (hit) { e.waitUntil(net); return hit; }
      return (await net) || Response.error();
    })());
    return;
  }

  if (isExt(url)) {
    e.respondWith((async () => {
      const c = await caches.open(EXT);
      const hit = await c.match(req, { ignoreVary: true }) || await caches.match(req.url, { ignoreVary: true });
      if (hit) return hit;
      try { const res = await fetch(req); if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; } catch (err) { return Response.error(); }
    })());
    return;
  }

  if (url.origin === location.origin) {
    if (url.pathname.endsWith("/reparer.html")) return;            // page de réparation : toujours depuis le réseau
    e.respondWith((async () => {
      const c = await caches.open(SHELL);
      // version installée : réponse immédiate, même sur une connexion lente
      const hit = await c.match(req, { ignoreSearch: true }) || (req.mode === "navigate" && url.pathname === scope().pathname ? await c.match("index.html") : null);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res.ok && legere(url)) c.put(req, res.clone());
        return res;
      } catch (err) {
        if (req.mode === "navigate") return (await c.match("index.html")) || Response.error();
        return Response.error();
      }
    })());
  }
});
