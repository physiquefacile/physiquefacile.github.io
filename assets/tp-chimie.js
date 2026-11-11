/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* TP de chimie analytique de L1, d'après le fascicule de l'Université Souleymane Niang de Matam (2026-2027) :
   C1 sécurité, C2 préparation des solutions, C3.1 dosage colorimétrique et C3.2 pH-métrie de l'acide éthanoïque,
   C4 alcalimétrie (carbonate de calcium), C5 conductimétrie, C6 produit de solubilité, C7 chlorométrie (eau de Javel),
   C8 manganimétrie I (eau oxygénée), C9 manganimétrie II (dichromate, dosage en retour), C10 dosage potentiométrique */
(function () {
  "use strict";
  const { register, $, css, store, fit, txt } = window.TPCORE;
  const seg = (id, items, cur) => `<div class="seg" role="group">${items.map(([v, l]) => `<button type="button" data-${id}="${v}" aria-pressed="${v === cur}">${l}</button>`).join("")}</div>`;
  const setSeg = (id, v) => document.querySelectorAll(`[data-${id}]`).forEach(b => b.setAttribute("aria-pressed", b.getAttribute("data-" + id) === v));
  const fx = (x, d) => isFinite(x) ? (+x).toFixed(d).replace(".", ",") : "—";
  const f2 = x => fx(x, 2);
  const rnd = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
  const U = (a, b) => a + Math.random() * (b - a);
  const EAU = "rgba(170,205,235,.45)";
  const phenCol = pH => { const f = 1 / (1 + Math.pow(10, 9.3 - pH)); return pH >= 8.2 ? `rgba(226,52,146,${(0.15 + 0.75 * f).toFixed(3)})` : null; };
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const bbtCol = pH => { const t = Math.max(0, Math.min(1, (pH - 6.0) / 1.6)); const c = t < 0.5 ? mix([232, 205, 40], [70, 165, 85], t * 2) : mix([70, 165, 85], [40, 90, 205], (t - 0.5) * 2); return `rgba(${c[0]},${c[1]},${c[2]},.6)`; };
  const helCol = pH => { const t = Math.max(0, Math.min(1, (pH - 3.1) / 1.3)); const c = mix([215, 50, 40], [240, 200, 45], t); return `rgba(${c[0]},${c[1]},${c[2]},.6)`; };
  const indCol = (ind, pH) => ind === "ph" ? phenCol(pH) || EAU : ind === "bbt" ? bbtCol(pH) : helCol(pH);
  const indTxt = (ind, pH) => ind === "ph" ? (pH >= 8.2 ? "rose persistant" : "incolore") : ind === "bbt" ? (pH < 6.6 ? "jaune" : pH < 7.4 ? "vert (teinte sensible)" : "bleu") : (pH < 3.6 ? "rouge" : pH < 4.4 ? "orangé" : "jaune");

  /* ---------- paillasse commune : support, burette, récipient, appareil de mesure, mini-courbe ---------- */
  function mkBench(cvId) {
    let drop = 0;
    const B = { flash: 0 };
    B.drop = () => { drop = 1; };
    B.tick = dt => { const a = drop > 0 || B.flash > 0; drop = Math.max(0, drop - dt / 0.35); B.flash = Math.max(0, B.flash - dt / 0.9); return a; };
    B.draw = o => {
      const narrow = innerWidth < 600, { c, w, h } = fit($("#" + cvId), narrow ? 1.6 : 0.56);
      c.fillStyle = css("--plot-bg"); c.fillRect(0, 0, w, h);
      const fg = css("--fg"), mu = css("--muted"), ac = css("--accent");
      const bw = narrow ? w : w * 0.42, H0 = narrow ? h * 0.56 : h;
      const bx = bw * 0.46, top = H0 * 0.05, bot = H0 * 0.56, tw = Math.max(12, bw * 0.05), y0 = top + 12, VM = o.VMAX || 50, Y = v => y0 + v / VM * (bot - 14 - y0);
      const F = (s, x, y, col, al, font) => txt(c, s, x, y, col || mu, al || "left", "alphabetic", font || "11px 'Fira Sans',Arial");
      if (!o.noStand) { c.fillStyle = mu; c.fillRect(bw * 0.12, top - 4, 5, H0 * 0.9 - top + 4); c.fillRect(bw * 0.06, H0 * 0.90, bw * 0.3, 7); }
      if (o.V != null) {
        c.fillStyle = mu; c.fillRect(bw * 0.12, top + H0 * 0.12, bx - bw * 0.12, 4);
        c.fillStyle = o.burCol || "rgba(170,205,235,.55)"; c.fillRect(bx - tw / 2, Y(o.V), tw, bot - Y(o.V));
        c.strokeStyle = fg; c.lineWidth = 1.3; c.strokeRect(bx - tw / 2, top, tw, bot - top);
        c.lineWidth = 1; for (let v = 0; v <= VM; v++) { const y = Y(v), L = v % 5 ? 4 : 8; c.beginPath(); c.moveTo(bx + tw / 2 - L, y); c.lineTo(bx + tw / 2, y); c.stroke(); if (v % 10 === 0) F(String(v), bx + tw / 2 + 4, y + 4, mu, "left", "10px 'Fira Sans',Arial"); }
        c.strokeStyle = "#2a6f97"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(bx - tw / 2 - 3, Y(o.V)); c.lineTo(bx + tw / 2 + 3, Y(o.V)); c.stroke();
        c.fillStyle = fg; c.fillRect(bx - tw * 0.9, bot + 2, tw * 1.8, 5); c.fillRect(bx - 1.5, bot, 3, H0 * 0.07);
        F(o.tit || "", bx - tw / 2 - 6, top + 14, mu, "right");
        F(f2(o.V) + " mL", bx + tw / 2 + 24, Y(o.V) + 4, "#2a6f97", "left", "600 12px 'Fira Mono',monospace");
      }
      const vy0 = H0 * 0.665, vy1 = H0 * 0.865, tip = bot + H0 * 0.07;
      let surf = vy0 + (vy1 - vy0) * 0.45;
      const G = { c, w, h, bx, bw, H0, vy0, vy1, fg, mu, ac, narrow, F, top, bot };
      const fillLiq = (path, col, turb) => { c.fillStyle = col || EAU; path(); c.fill(); if (turb > 0) { c.fillStyle = `rgba(250,250,250,${(0.8 * turb).toFixed(3)})`; path(); c.fill(); } };
      if (o.vessel === "erlen") {
        const nk = bw * 0.06, bs = bw * 0.24, ny = vy0 - H0 * 0.03, sh = vy0 + (vy1 - vy0) * 0.15;
        surf = vy1 - (vy1 - ny) * Math.min(0.85, 0.45 + (o.V || 0) / 220);
        const xAt = y => y < sh ? nk : nk + (bs - nk) * (y - sh) / ((vy1 - vy0) * 0.85);
        fillLiq(() => { c.beginPath(); c.moveTo(bx - xAt(surf), surf); c.lineTo(bx + xAt(surf), surf); c.lineTo(bx + bs, vy1); c.lineTo(bx - bs, vy1); c.closePath(); }, o.col, o.turb);
        c.strokeStyle = fg; c.lineWidth = 1.6; c.beginPath(); c.moveTo(bx - nk, ny); c.lineTo(bx - nk, sh); c.lineTo(bx - bs, vy1); c.lineTo(bx + bs, vy1); c.lineTo(bx + nk, sh); c.lineTo(bx + nk, ny); c.stroke();
      } else if (o.vessel === "becher") {
        const bs = bw * 0.2; surf = vy1 - (vy1 - vy0) * Math.min(0.9, 0.55 + (o.V || 0) / 160);
        fillLiq(() => { c.beginPath(); c.rect(bx - bs, surf, 2 * bs, vy1 - surf); }, o.col, o.turb);
        c.strokeStyle = fg; c.lineWidth = 1.6; c.beginPath(); c.moveTo(bx - bs, vy0 - 6); c.lineTo(bx - bs, vy1); c.lineTo(bx + bs, vy1); c.lineTo(bx + bs, vy0 - 6); c.stroke();
        if (o.probe) { c.fillStyle = "#444"; c.fillRect(bx + bs * 0.45, vy0 - H0 * 0.26, 8, H0 * 0.26 + (vy1 - vy0) * 0.75); c.fillStyle = o.probe === "cond" ? "#b0b0b0" : o.probe === "pt" ? "#d8d8d8" : "#9cc3d5"; c.fillRect(bx + bs * 0.45 - (o.probe === "cond" ? 3 : 0), vy1 - (vy1 - vy0) * 0.25, o.probe === "cond" ? 14 : 8, (vy1 - vy0) * 0.12); }
        if (o.probe2) { c.fillStyle = "#6d5a3b"; c.fillRect(bx - bs * 0.6, vy0 - H0 * 0.24, 9, H0 * 0.24 + (vy1 - vy0) * 0.7); c.fillStyle = "#f2efe6"; c.fillRect(bx - bs * 0.6, vy1 - (vy1 - vy0) * 0.3, 9, (vy1 - vy0) * 0.14); }
        if (o.stir) { c.fillStyle = mu; c.fillRect(bx - bs * 0.3, vy1 - 6, bs * 0.6, 4); }
      }
      if (o.custom) o.custom(G);
      if (o.stir || o.heat) { c.fillStyle = o.heat ? "#5a3b33" : "#3d4650"; c.fillRect(bx - bw * 0.26, vy1 + 1, bw * 0.52, H0 * 0.9 - vy1 - 1); if (o.heat) { c.fillStyle = "#ff7043"; c.fillRect(bx - bw * 0.2, vy1 + 3, bw * 0.4, 3); } }
      if (o.cap) F(o.cap, bx, H0 * 0.975, mu, "center");
      if (drop > 0 && o.V != null && o.vessel) { const y = tip + (surf - tip) * (1 - drop); c.fillStyle = o.dropCol || "rgba(120,170,220,.9)"; c.beginPath(); c.arc(bx, y, 3.2, 0, 7); c.fill(); }
      // ---- appareil, informations et courbe
      const rx = narrow ? 8 : bw + 10, rw = narrow ? w - 16 : w - bw - 18, ry = narrow ? H0 + 4 : 0, rh = narrow ? h - H0 - 8 : h;
      const mh = Math.min(rh * 0.34, 150), my = ry + 8;
      let ny = ry + 24;
      if (o.meter) {
        c.fillStyle = "#2b3138"; c.fillRect(rx, my, rw, mh);
        c.fillStyle = "#c9e6b4"; const lw = Math.min(rw * 0.7, 260), lh = mh * 0.45; c.fillRect(rx + 12, my + 12, lw, lh);
        txt(c, o.meter.val, rx + 12 + lw / 2, my + 12 + lh * 0.7, "#1d2b14", "center", "alphabetic", `600 ${Math.round(Math.min(lh * 0.62, 34, lw / (o.meter.val.length * 0.68)))}px 'Fira Mono',monospace`);
        F(o.meter.sub || "", rx + 12, my + mh - 12, "#c9d3dc", "left", "11px 'Fira Mono',monospace");
        if (o.probe) { c.strokeStyle = "#444"; c.lineWidth = 2; c.beginPath(); c.moveTo(narrow ? rx + rw * 0.8 : rx, narrow ? my : my + mh * 0.8); c.quadraticCurveTo(narrow ? rx + rw * 0.8 : rx - 20, narrow ? my - 40 : my + mh + 30, bx + bw * 0.09 + 4, vy0 - H0 * 0.26); c.stroke(); }
        ny = my + mh + 22;
      }
      if (o.curve) {
        const K = o.curve, gy = ny - 8, gh = ry + rh - gy - 22, gx = rx + 40, gw = rw - 50, y0c = K.ymin || 0;
        c.strokeStyle = mu; c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh);
        const X = v => gx + v / K.xmax * gw, Yc = p => gy + gh - (p - y0c) / (K.ymax - y0c) * gh;
        const nt = gh < 170 ? 4 : 7, st = (K.ymax - y0c) / nt; for (let i = 0; i <= nt; i++) F(String(+(y0c + i * st).toPrecision(3)).replace(".", ","), gx - 4, Yc(y0c + i * st) + 4, mu, "right", "10px 'Fira Sans',Arial");
        for (let v = 0; v <= K.xmax + 1e-9; v += K.xmax / 5) F(String(+v.toFixed(1)).replace(".", ","), X(v), gy + gh + 13, mu, "center", "10px 'Fira Sans',Arial");
        F(K.lab, gx + 4, gy + 14);
        c.fillStyle = ac; K.pts.forEach(([x, y]) => { c.beginPath(); c.arc(X(x), Yc(y), 3, 0, 7); c.fill(); });
        if (K.cur != null) { c.strokeStyle = "#FFB000"; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(K.cur), gy); c.lineTo(X(K.cur), gy + gh); c.stroke(); c.setLineDash([]); }
      } else (o.side || []).forEach(([s, col, bold], i) => F(s, rx, ny + i * 21, col || fg, "left", (bold ? "600 13px" : "12px") + " 'Fira Sans',Arial"));
      return G;
    };
    return B;
  }
  const burHTML = (px, lab, steps) => `<div id="${px}Bur"><h3>Burette (${lab})</h3><div class="row">${(steps || [["1", "+ 1 mL"], ["0.5", "+ 0,5 mL"], ["0.2", "+ 0,2 mL"], ["0.05", "+ 1 goutte"]]).map(([v, l]) => `<button type="button" class="btn sm" data-${px}v="${v}">${l}</button>`).join("")}</div>
      <button type="button" class="btn sm" id="${px}Raz">Nouveau dosage (burette au zéro, nouvelle prise)</button></div>`;
  const lcd = (px, rows) => `<dl class="lcd">${rows.map(([k, l]) => `<dt id="${px}${k}t">${l}</dt><dd id="${px}${k}"></dd>`).join("")}</dl>`;
  /* état persistant d'un TP (montage, volumes versés, réglages) */
  const state = (key, def) => { let s = Object.assign(JSON.parse(JSON.stringify(def)), store.get(key, {})); Object.keys(def).forEach(k => { if (def[k] && typeof def[k] === "object" && !Array.isArray(def[k])) s[k] = Object.assign({}, def[k], s[k] || {}); }); return s; };
  const params = (key, mk, ok) => { let P = store.get(key, null); if (!P || !ok(P)) { P = mk(); store.set(key, P); } return P; };
  const lockedMsg = T => { if (T.locked()) { T.msg("Compte rendu déjà soumis : le matériel ne peut plus être changé.", "bad"); return true; } return false; };
  const addV = (T, st, key, dv, max) => { const V = st[key] || 0; if (V + dv > (max || 50) + 1e-9) { T.msg("La burette est vide : clique sur « Nouveau dosage » pour la remplir.", "bad"); return false; } st[key] = rnd(V + dv, 2); return true; };
  /* fiole jaugée dessinée avec son trait de jauge (Vn : volume nominal ; Vf : volume actuel) */
  const flask = (G, Vn, Vf, hom, col, x0) => {
    const { c, bw, H0, fg, F } = G, bx = x0 != null ? x0 : G.bx, by = H0 * 0.87, r = bw * 0.17, cy = by - r, nk = bw * 0.035, ntop = H0 * 0.12, mark = H0 * 0.3;
    const lv = Vf <= 0 ? by : Vf < Vn * 0.95 ? by - 2 * r * Math.min(1, Vf / (Vn * 0.95)) : mark + (Vn - Vf) / Vn * 100 * (H0 * 0.022);
    c.fillStyle = col || EAU; c.save(); c.beginPath(); c.arc(bx, cy, r, 0, 7); c.rect(bx - nk, ntop, 2 * nk, cy - ntop); c.clip(); if (Vf > 0) c.fillRect(bx - r, Math.max(ntop, lv), 2 * r, by - Math.max(ntop, lv)); c.restore();
    c.strokeStyle = fg; c.lineWidth = 1.6; c.beginPath(); c.moveTo(bx - nk, ntop); c.lineTo(bx - nk, cy - r * 0.95); c.arc(bx, cy, r, -Math.PI / 2 - 0.2, Math.PI * 1.5 + 0.2, true); c.stroke(); c.beginPath(); c.moveTo(bx + nk, ntop); c.lineTo(bx + nk, cy - r * 0.95); c.stroke();
    c.strokeStyle = "#c0392b"; c.beginPath(); c.moveTo(bx - nk - 6, mark); c.lineTo(bx + nk + 6, mark); c.stroke(); F("trait de jauge", bx + nk + 10, mark + 4, "#c0392b");
    F(String(Vn).replace(".", ",") + " mL", bx, by + 16, G.mu, "center");
    if (hom) { c.fillStyle = "#555"; c.fillRect(bx - nk - 2, ntop - 10, 2 * nk + 4, 10); }
  };
  /* état du ménisque dans une fiole jaugée */
  const meni = (Vf, Vn) => { const d = Vf - Vn; return Math.abs(d) <= 0.05 ? "sur le trait" : d < 0 ? (d > -1 ? "juste sous le trait (" + fx(-d, 2) + " mL)" : "sous le trait") : "AU-DESSUS du trait : à refaire"; };
  window.TPX = window.TPX || {};

  /* ======================================================================
     TP C1 : NORMES DE SÉCURITÉ AU LABORATOIRE
     A : pictogrammes des étiquettes ; B : situations de travail ; C : tri des déchets ; D : équipements de sécurité
     ====================================================================== */
  const DANGERS = ["Comburant", "Corrosif", "Danger pour la santé (CMR, sensibilisant)", "Danger pour l'environnement aquatique", "Explosif", "Gaz sous pression", "Inflammable", "Nocif ou irritant", "Toxicité aiguë (peut être mortel)"];
  const SITU = [
    { n: "Manipulation d'un acide concentré (HCl à 37 %)", o: ["Travailler sur la paillasse sans lunettes, en restant à distance du flacon", "Blouse, lunettes et gants ; manipuler sous la hotte ; verser l'acide dans l'eau, jamais l'inverse", "Pipeter à la bouche, lentement, pour bien contrôler le volume", "Diluer en versant l'eau sur l'acide concentré"] },
    { n: "Préparation d'une solution de soude à partir des pastilles", o: ["Prendre les pastilles à la main pour aller plus vite", "Dissoudre dans un flacon fermé hermétiquement et agiter fort", "Peser à la spatule, dissoudre progressivement dans l'eau froide sous agitation (dissolution exothermique), avec lunettes et gants", "Chauffer fortement pour accélérer la dissolution"] },
    { n: "Utilisation d'un produit oxydant (KMnO₄, eau oxygénée concentrée)", o: ["Le ranger avec les solvants inflammables", "Le tenir à l'écart des matières combustibles et des réducteurs ; gants et lunettes", "Jeter les restes dans la poubelle à papier", "Le mélanger à de l'éthanol pour le neutraliser"] },
    { n: "Déversement accidentel d'acide sur la paillasse", o: ["Essuyer tout de suite avec du papier, à mains nues", "Prévenir l'enseignant, baliser, contenir avec un absorbant ou neutraliser (hydrogénocarbonate de sodium) avec gants et lunettes, puis éliminer comme déchet", "Diluer avec beaucoup d'eau et laisser sécher", "Continuer la manipulation et nettoyer à la fin de la séance"] },
    { n: "Déchet contenant du chrome(VI)", o: ["Le verser à l'évier avec beaucoup d'eau", "Le mélanger au bidon des solvants organiques", "Le collecter dans le bidon fermé et étiqueté « chrome(VI) – métaux lourds », pour un traitement spécialisé", "L'évaporer sous la hotte"] },
    { n: "Projection d'une solution corrosive dans l'œil", o: ["Frotter l'œil et attendre que la douleur passe", "Rincer immédiatement et abondamment au rince-œil pendant au moins 15 minutes, paupières ouvertes, puis consulter", "Neutraliser avec une solution basique", "Couvrir l'œil d'un pansement et continuer le TP"] }
  ];
  const WASTES = ["Solution aqueuse de chlorure de sodium (TP C2)", "Mélange d'un dosage acide-base, neutralisé (pH entre 6 et 8)", "Résidus du dosage du dichromate (chrome)", "Solutions contenant des ions manganèse (dosages au permanganate)", "Éthanol ayant servi à rincer la verrerie", "Pipette en verre cassée", "Gants et papiers souillés de produits chimiques"];
  const FILIERES = ["Évier, avec beaucoup d'eau", "Bidon « métaux lourds » (chrome, manganèse…)", "Bidon « solvants organiques non halogénés »", "Conteneur à verre cassé", "Sac « déchets solides contaminés »"];
  /* pictogramme SGH (losange rouge, symbole noir) */
  function picto(c, code, x, y, s) {
    c.save(); c.translate(x, y);
    c.fillStyle = "#fff"; c.strokeStyle = "#d0021b"; c.lineWidth = Math.max(2, s * 0.07);
    c.beginPath(); c.moveTo(0, -s / 2); c.lineTo(s / 2, 0); c.lineTo(0, s / 2); c.lineTo(-s / 2, 0); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#111"; c.strokeStyle = "#111"; c.lineWidth = Math.max(1.2, s * 0.03);
    const k = s / 100, P = (pts, fill) => { c.beginPath(); pts.forEach(([a, b], i) => i ? c.lineTo(a * k, b * k) : c.moveTo(a * k, b * k)); c.closePath(); fill === false ? c.stroke() : c.fill(); };
    const flame = (dx, dy, sc) => { c.beginPath(); c.moveTo((dx - 10 * sc) * k, (dy + 12 * sc) * k); c.bezierCurveTo((dx - 16 * sc) * k, (dy - 2 * sc) * k, (dx - 4 * sc) * k, (dy - 8 * sc) * k, (dx - 2 * sc) * k, (dy - 22 * sc) * k); c.bezierCurveTo((dx + 6 * sc) * k, (dy - 10 * sc) * k, (dx + 16 * sc) * k, (dy - 2 * sc) * k, (dx + 10 * sc) * k, (dy + 12 * sc) * k); c.closePath(); c.fill(); };
    if (code === "SGH01") { c.beginPath(); c.arc(-6 * k, 8 * k, 11 * k, 0, 7); c.fill(); for (let i = 0; i < 9; i++) { const a = -2.6 + i * 0.32; c.beginPath(); c.moveTo((6 + 14 * Math.cos(a)) * k, (-4 + 14 * Math.sin(a)) * k); c.lineTo((6 + 26 * Math.cos(a)) * k, (-4 + 26 * Math.sin(a)) * k); c.stroke(); } }
    else if (code === "SGH02") { flame(0, 2, 1.3); c.fillRect(-16 * k, 20 * k, 32 * k, 4 * k); }
    else if (code === "SGH03") { c.lineWidth = 4 * k; c.beginPath(); c.arc(0, 10 * k, 10 * k, 0, 7); c.stroke(); flame(0, -8, 0.9); c.fillRect(-16 * k, 23 * k, 32 * k, 4 * k); }
    else if (code === "SGH04") { c.beginPath(); c.ellipse(0, 4 * k, 9 * k, 22 * k, 0.9, 0, 7); c.fill(); c.fillRect(10 * k, -16 * k, 6 * k, 6 * k); }
    else if (code === "SGH05") { P([[-24, -14], [-14, -22], [-4, -10], [-14, -2]]); P([[4, -22], [14, -14], [2, -2], [-6, -10]]); c.beginPath(); c.arc(-12 * k, 2 * k, 2.5 * k, 0, 7); c.arc(4 * k, 4 * k, 2.5 * k, 0, 7); c.fill();
      c.fillRect(-28 * k, 12 * k, 20 * k, 6 * k); P([[2, 22], [2, 10], [6, 10], [6, 6], [10, 6], [10, 10], [14, 10], [14, 6], [18, 6], [18, 10], [26, 12], [26, 22]]); }
    else if (code === "SGH06") { c.beginPath(); c.arc(0, -6 * k, 13 * k, 0, 7); c.fill(); c.fillRect(-7 * k, 4 * k, 14 * k, 8 * k); c.fillStyle = "#fff"; c.beginPath(); c.arc(-5 * k, -7 * k, 3.6 * k, 0, 7); c.arc(5 * k, -7 * k, 3.6 * k, 0, 7); c.fill(); c.fillStyle = "#111";
      c.lineWidth = 4 * k; c.beginPath(); c.moveTo(-18 * k, 14 * k); c.lineTo(18 * k, 26 * k); c.moveTo(18 * k, 14 * k); c.lineTo(-18 * k, 26 * k); c.stroke(); }
    else if (code === "SGH07") { P([[-4, -24], [4, -24], [2, 10], [-2, 10]]); c.beginPath(); c.arc(0, 18 * k, 4 * k, 0, 7); c.fill(); }
    else if (code === "SGH08") { c.beginPath(); c.arc(0, -16 * k, 7 * k, 0, 7); c.fill(); P([[-16, 26], [-14, -2], [-6, -8], [6, -8], [14, -2], [16, 26]]); c.fillStyle = "#fff"; c.beginPath(); for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, r = i % 2 ? 4 : 10; c.lineTo(r * Math.cos(a) * k, (8 + r * Math.sin(a)) * k); } c.closePath(); c.fill(); c.fillStyle = "#111"; }
    else if (code === "SGH09") { c.fillRect(-20 * k, -2 * k, 3 * k, 22 * k); c.lineWidth = 2.5 * k; c.beginPath(); c.moveTo(-19 * k, 4 * k); c.lineTo(-28 * k, -8 * k); c.moveTo(-19 * k, 0); c.lineTo(-10 * k, -12 * k); c.moveTo(-18 * k, 10 * k); c.lineTo(-8 * k, 2 * k); c.stroke();
      c.fillRect(-28 * k, 20 * k, 56 * k, 3 * k); c.beginPath(); c.ellipse(10 * k, 12 * k, 11 * k, 5 * k, 0, 0, 7); c.fill(); P([[20, 12], [28, 6], [28, 18]]); c.fillStyle = "#fff"; c.beginPath(); c.arc(4 * k, 11 * k, 1.6 * k, 0, 7); c.fill(); c.fillStyle = "#111"; }
    c.restore();
  }
  /* icônes des équipements de sécurité sur le plan (sans légende : il faut les reconnaître) */
  function equipIcon(c, k, x, y, s) {
    c.save(); c.translate(x, y); const z = s / 40; c.lineWidth = 2;
    c.fillStyle = k === "extinct" || k === "couv" ? "#c62828" : k === "dechets" ? "#6d4c41" : k === "hotte" ? "#78909c" : "#2e7d32"; c.fillRect(-20 * z, -20 * z, 40 * z, 40 * z);
    c.fillStyle = "#fff"; c.strokeStyle = "#fff";
    if (k === "douche") { c.fillRect(-2 * z, -16 * z, 4 * z, 10 * z); c.fillRect(-10 * z, -8 * z, 20 * z, 4 * z); for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * 4 * z, -2 * z); c.lineTo(i * 5 * z, 8 * z); c.stroke(); } c.beginPath(); c.arc(0, 12 * z, 3 * z, 0, 7); c.fill(); c.fillRect(-4 * z, 14 * z, 8 * z, 4 * z); }
    else if (k === "oeil") { c.beginPath(); c.ellipse(0, -2 * z, 13 * z, 7 * z, 0, 0, 7); c.stroke(); c.beginPath(); c.arc(0, -2 * z, 4 * z, 0, 7); c.fill(); for (let i = -1; i <= 1; i++) { c.beginPath(); c.moveTo(i * 6 * z, 16 * z); c.lineTo(i * 4 * z, 8 * z); c.stroke(); } }
    else if (k === "extinct") { c.fillRect(-6 * z, -8 * z, 12 * z, 24 * z); c.fillRect(-3 * z, -14 * z, 6 * z, 6 * z); c.beginPath(); c.moveTo(3 * z, -12 * z); c.lineTo(14 * z, -16 * z); c.stroke(); }
    else if (k === "couv") { c.fillRect(-12 * z, -14 * z, 24 * z, 28 * z); c.fillStyle = "#c62828"; c.beginPath(); c.moveTo(-4 * z, 8 * z); c.quadraticCurveTo(-8 * z, -2 * z, 0, -8 * z); c.quadraticCurveTo(8 * z, -2 * z, 4 * z, 8 * z); c.closePath(); c.fill(); }
    else if (k === "secours") { c.fillRect(-4 * z, -14 * z, 8 * z, 28 * z); c.fillRect(-14 * z, -4 * z, 28 * z, 8 * z); }
    else if (k === "hotte") { c.beginPath(); c.moveTo(-16 * z, 4 * z); c.lineTo(-8 * z, -10 * z); c.lineTo(8 * z, -10 * z); c.lineTo(16 * z, 4 * z); c.closePath(); c.stroke(); c.fillRect(-3 * z, -18 * z, 6 * z, 8 * z); c.fillRect(-16 * z, 10 * z, 32 * z, 3 * z); }
    else if (k === "dechets") { c.fillRect(-12 * z, -10 * z, 10 * z, 24 * z); c.fillRect(2 * z, -10 * z, 10 * z, 24 * z); c.fillRect(-10 * z, -14 * z, 6 * z, 4 * z); c.fillRect(4 * z, -14 * z, 6 * z, 4 * z); }
    c.restore();
  }
  register({
    id: "csecu", num: 31, lab: "C1", disc: "Chimie", court: "Sécurité au laboratoire",
    titre: "Normes de sécurité au laboratoire",
    objectifs: "reconnaître les pictogrammes de danger, identifier les risques liés aux acides, aux bases et aux oxydants, choisir les équipements de protection, localiser les équipements d'urgence, distinguer les filières de déchets et décrire la conduite à tenir en cas d'incident.",
    materiel: ["Blouse en coton, lunettes de protection, gants adaptés", "Flacons de réactifs étiquetés et leurs fiches de données de sécurité (FDS)", "Douche de sécurité, rince-œil, extincteur, couverture anti-feu, trousse de secours", "Hotte aspirante", "Bidons et conteneurs de collecte des déchets"],
    theorie: `<p>La prévention des accidents repose sur l'<b>identification des dangers</b>, l'<b>évaluation des risques</b>, le choix des <b>équipements de protection</b> et le respect des <b>procédures écrites</b>.</p>
      <h4>Étiquetage SGH (règlement CLP)</h4><p>L'étiquette d'un produit dangereux porte des <b>pictogrammes</b> (losange à bord rouge), une mention d'avertissement (« Danger » ou « Attention »), des <b>mentions de danger H</b> (ex. H314 : provoque des brûlures de la peau et des lésions oculaires graves) et des conseils de prudence P. La fiche de données de sécurité (FDS) détaille les risques, les protections et la conduite à tenir.</p>
      <h4>Les neuf pictogrammes</h4><ul><li>SGH01 explosif ; SGH02 inflammable ; SGH03 comburant ; SGH04 gaz sous pression ; SGH05 corrosif ;</li><li>SGH06 toxicité aiguë ; SGH07 nocif ou irritant ; SGH08 danger pour la santé (cancérogène, mutagène, toxique pour la reproduction, sensibilisant) ; SGH09 danger pour l'environnement aquatique.</li></ul>
      <h4>Règles d'or</h4><ul><li>Blouse fermée, lunettes en permanence, cheveux attachés ; gants adaptés au produit.</li><li><b>Jamais de pipetage à la bouche</b> : propipette ou pipeteur.</li><li>On verse <b>l'acide dans l'eau</b>, jamais l'inverse.</li><li>Ne jamais mélanger l'<b>eau de Javel avec un acide</b> : dégagement de dichlore toxique.</li><li>Les déchets contenant des métaux lourds, en particulier le <b>chrome(VI)</b> (cancérogène), sont collectés séparément.</li></ul>`,
    protocole: `<h4>Partie A — Étiquettes et pictogrammes</h4><ol><li>Choisis un réactif : son étiquette s'affiche.</li><li>Pour chaque pictogramme numéroté, indique la classe de danger qu'il signale, puis note ton identification. Fais-le pour les six réactifs.</li></ol>
      <h4>Partie B — Situations de travail</h4><ol><li>Pour chaque situation (les cinq du tableau du fascicule et la projection dans l'œil), choisis le danger principal et la prévention ou la conduite à tenir.</li></ol>
      <h4>Partie C — Tri des déchets</h4><ol><li>Pour chaque déchet produit pendant les TP, choisis la filière de collecte.</li></ol>
      <h4>Partie D — Équipements de sécurité</h4><ol><li>Choisis un équipement dans la liste, puis clique sur le plan de la salle à l'endroit où il se trouve.</li><li>Repère ainsi les sept équipements.</li></ol>`,
    precautions: `<ul><li>Lis toute l'étiquette : nom, pictogrammes, mention d'avertissement et mentions H.</li><li>Un même produit porte souvent plusieurs pictogrammes : identifie-les tous.</li><li>Pour refaire une réponse, supprime la ligne correspondante (✕) dans le tableau, puis note-la de nouveau.</li><li>Réel : repère les équipements de sécurité dès ta première séance et demande où se trouve la FDS de chaque produit utilisé.</li></ul>`,
    preparation: ["Dessine les neuf pictogrammes SGH et écris la signification de chacun.", "Pourquoi les lunettes de protection sont-elles indispensables, même pour une simple dilution ?", "Pourquoi ne faut-il jamais pipeter à la bouche ?", "Pourquoi ne doit-on jamais mélanger l'eau de Javel avec un acide ? Écris l'équation de la réaction.", "Pourquoi les déchets contenant du chrome(VI) doivent-ils être collectés séparément ?"],
    hint: "Choisis une partie, puis réponds avec les listes du panneau de commande. Partie D : choisis l'équipement, puis clique sur le plan.",
    controls: `<h3>Partie</h3>${seg("csm", [["A", "A · étiquettes"], ["B", "B · situations"], ["C", "C · déchets"], ["D", "D · équipements"]], "A")}
      <div id="csA"><div class="ctl"><label for="csR">Réactif</label><select id="csR">${CX_REAC.map((r, i) => `<option value="${i}">${r.n}</option>`).join("")}</select></div><div id="csPs"></div></div>
      <div id="csB" hidden><div class="ctl"><label for="csS">Situation</label><select id="csS">${SITU.map((s, i) => `<option value="${i}">${s.n}</option>`).join("")}</select></div>
        <div class="ctl"><label for="csD">Danger principal</label><select id="csD">${DANGERS.map((d, i) => `<option value="${i}">${d}</option>`).join("")}</select></div>
        <fieldset class="ctl" id="csO"><legend>Prévention ou conduite à tenir</legend></fieldset></div>
      <div id="csC" hidden><div class="ctl"><label for="csW">Déchet</label><select id="csW">${WASTES.map((w, i) => `<option value="${i}">${w}</option>`).join("")}</select></div>
        <fieldset class="ctl" id="csF"><legend>Filière de collecte</legend>${FILIERES.map((f, i) => `<label class="radio"><input type="radio" name="csF" value="${i}"> ${f}</label>`).join("")}</fieldset></div>
      <div id="csDd" hidden><div class="ctl"><label for="csE">Équipement à repérer</label><select id="csE">${CX_EQUIP.map(e => `<option value="${e.k}">${e.n}</option>`).join("")}</select></div><p class="hint">Clique sur le plan de la salle, à l'endroit de cet équipement.</p></div>
      <div class="row"><button type="button" class="btn primary sm" id="csRec">Noter ma réponse</button></div>`,
    parts: [{ key: "A" }, { key: "B" }, { key: "C" }, { key: "D" }],
    questions: ["Associe chaque pictogramme rencontré à sa signification.", "Pour chaque situation, justifie la prévention choisie.", "Pourquoi trie-t-on les déchets chimiques ? Que deviennent ceux qui contiennent du chrome(VI) ?", "Décris la conduite à tenir en cas de projection de produit sur la peau ou dans l'œil.", "Pourquoi ne doit-on jamais mélanger l'eau de Javel avec un acide ?"],
    init(T) {
      const def = { m: "A" };
      let st = state("csecu_st", def); const save = () => store.set("csecu_st", st);
      const cv = $("#csecu-cv");
      const pics = () => CX_REAC[+$("#csR").value].p;
      const fillA = () => { $("#csPs").innerHTML = pics().map((g, i) => `<div class="ctl"><label for="csP${i}">Pictogramme n°${i + 1}</label><select id="csP${i}"><option value="">— choisir —</option>${DANGERS.map((d, j) => `<option value="${j}">${d}</option>`).join("")}</select></div>`).join(""); };
      const fillB = () => { const s = SITU[+$("#csS").value]; $("#csO").innerHTML = `<legend>Prévention ou conduite à tenir</legend>` + s.o.map((o, i) => `<label class="radio"><input type="radio" name="csO" value="${i}"> ${o}</label>`).join(""); };
      const ui = () => {
        setSeg("csm", st.m); $("#csA").hidden = st.m !== "A"; $("#csB").hidden = st.m !== "B"; $("#csC").hidden = st.m !== "C"; $("#csDd").hidden = st.m !== "D";
        $("#csRec").hidden = st.m === "D"; draw();
      };
      let hover = null;
      const draw = () => {
        const narrow = innerWidth < 600, { c, w, h } = fit(cv, narrow ? 1.25 : 0.56), fg = css("--fg"), mu = css("--muted"), ac = css("--accent");
        c.fillStyle = css("--plot-bg"); c.fillRect(0, 0, w, h);
        const F = (s, x, y, col, al, font) => txt(c, s, x, y, col || fg, al || "left", "alphabetic", font || "13px 'Fira Sans',Arial");
        if (st.m === "A") {
          const R = CX_REAC[+$("#csR").value], lw = Math.min(w - 30, 620), lh = Math.min(h - 30, 360), lx = (w - lw) / 2, ly = (h - lh) / 2;
          c.fillStyle = "#fffdf6"; c.fillRect(lx, ly, lw, lh); c.strokeStyle = "#999"; c.lineWidth = 1; c.strokeRect(lx, ly, lw, lh);
          txt(c, R.n, lx + 16, ly + 30, "#111", "left", "alphabetic", "600 18px 'Fira Sans',Arial");
          txt(c, R.f + "   •   Lot 26-0417   •   Laboratoire de chimie", lx + 16, ly + 52, "#555", "left", "alphabetic", "12px 'Fira Sans',Arial");
          txt(c, R.p.indexOf("SGH05") >= 0 || R.p.indexOf("SGH06") >= 0 || R.p.indexOf("SGH08") >= 0 ? "DANGER" : "ATTENTION", lw < 520 ? lx + 16 : lx + lw - 16, lw < 520 ? ly + 74 : ly + 30, "#b71c1c", lw < 520 ? "left" : "right", "alphabetic", "700 16px 'Fira Sans',Arial");
          const n = R.p.length, s = Math.min(92, (lw - 40) / n - 14, lh * 0.38);
          R.p.forEach((g, i) => { const x = lx + 20 + s / 2 + i * (s + 14), y = ly + (lw < 520 ? 92 : 80) + s / 2; picto(c, g, x, y, s); txt(c, String(i + 1), x, y + s / 2 + 18, ac, "center", "alphabetic", "700 14px 'Fira Sans',Arial"); });
          txt(c, "Mentions de danger : " + R.h, lx + 16, ly + lh - 46, "#222", "left", "alphabetic", "12px 'Fira Sans',Arial");
          txt(c, "Lire la fiche de données de sécurité avant utilisation.", lx + 16, ly + lh - 24, "#555", "left", "alphabetic", "italic 12px 'Fira Sans',Arial");
        } else if (st.m === "B" || st.m === "C") {
          const isB = st.m === "B", title = isB ? SITU[+$("#csS").value].n : WASTES[+$("#csW").value];
          F(isB ? "Situation" : "Déchet à éliminer", 20, 34, mu); F(title, 20, 60, fg, "left", "600 17px 'Fira Sans',Arial");
          if (!isB) {   // les cinq filières de collecte
            const bw = (w - 40) / 5;
            FILIERES.forEach((f, i) => { const x = 20 + i * bw, y = h * 0.42, col = ["#90a4ae", "#6d4c41", "#ef6c00", "#2e7d32", "#5e35b1"][i];
              c.fillStyle = col; c.fillRect(x + 8, y, bw - 16, h * 0.34); c.fillStyle = "rgba(255,255,255,.9)";
              const words = f.split(" "); let line = "", ly2 = y + 22; words.forEach(wd => { if (c.measureText(line + wd).width > bw - 28 && line) { txt(c, line, x + bw / 2, ly2, "#fff", "center", "alphabetic", "12px 'Fira Sans',Arial"); line = ""; ly2 += 15; } line += wd + " "; }); txt(c, line, x + bw / 2, ly2, "#fff", "center", "alphabetic", "12px 'Fira Sans',Arial"); });
          } else { picto(c, "SGH05", w * 0.25, h * 0.6, Math.min(110, h * 0.32)); picto(c, "SGH03", w * 0.5, h * 0.6, Math.min(110, h * 0.32)); picto(c, "SGH08", w * 0.75, h * 0.6, Math.min(110, h * 0.32)); F("Quel est le danger principal ? Quelle prévention ou quelle conduite à tenir ?", 20, h - 20, mu); }
          const R = T.rows[st.m]; F((isB ? "Situations" : "Déchets") + " déjà traités : " + R.length + " / " + (isB ? SITU.length : WASTES.length), 20, 86, ac, "left", "12px 'Fira Sans',Arial");
        } else {
          // plan de la salle vu de dessus
          const px = 14, py = 14, pw = w - 28, ph = h - 28, X = u => px + u * pw, Y = v => py + v * ph;
          c.fillStyle = "#eef1f3"; c.fillRect(px, py, pw, ph); c.strokeStyle = "#455a64"; c.lineWidth = 4; c.strokeRect(px, py, pw, ph);
          c.fillStyle = "#cfd8dc"; [[0.25, 0.32, 0.5, 0.1], [0.25, 0.52, 0.5, 0.1]].forEach(([a, b, cw2, chh]) => { c.fillRect(X(a), Y(b), cw2 * pw, chh * ph); });
          txt(c, "paillasses", X(0.5), Y(0.47), "#607d8b", "center", "alphabetic", "12px 'Fira Sans',Arial");
          c.fillStyle = "#b0bec5"; c.fillRect(X(0.4), Y(0.02), pw * 0.08, ph * 0.08); txt(c, "évier", X(0.44), Y(0.15), "#607d8b", "center", "alphabetic", "11px 'Fira Sans',Arial");
          c.fillStyle = "#fff"; c.fillRect(X(0.72), Y(0.97), pw * 0.12, ph * 0.04); txt(c, "porte", X(0.78), Y(0.94), "#607d8b", "center", "alphabetic", "11px 'Fira Sans',Arial");
          c.fillStyle = "#a1887f"; c.fillRect(X(0.86), Y(0.78), pw * 0.1, ph * 0.12); txt(c, "armoire à produits", X(0.84), Y(0.76), "#607d8b", "right", "alphabetic", "11px 'Fira Sans',Arial");
          const s = Math.min(42, pw * 0.07, ph * 0.12);
          CX_EQUIP.forEach(e => equipIcon(c, e.k, X(e.x), Y(e.y), s));
          T.rows.D.forEach(r => { c.strokeStyle = ac; c.lineWidth = 2.5; c.beginPath(); c.arc(X(r.x), Y(r.y), 10, 0, 7); c.stroke(); });
          if (hover) { c.strokeStyle = "#FFB000"; c.lineWidth = 1.5; c.beginPath(); c.arc(X(hover[0]), Y(hover[1]), 8, 0, 7); c.stroke(); }
          txt(c, "Repérés : " + T.rows.D.length + " / " + CX_EQUIP.length, px + 8, py + ph - 8, ac, "left", "alphabetic", "600 12px 'Fira Sans',Arial");
        }
      };
      T.draw = draw;
      document.querySelectorAll("[data-csm]").forEach(b => b.onclick = () => { st.m = b.dataset.csm; save(); T.msg(""); ui(); });
      $("#csR").addEventListener("change", () => { fillA(); draw(); });
      $("#csS").addEventListener("change", () => { fillB(); draw(); });
      $("#csW").addEventListener("change", () => { document.querySelectorAll('input[name="csF"]').forEach(x => { x.checked = false; }); draw(); });
      const dup = (k, f) => T.rows[k].some(f);
      $("#csRec").onclick = () => {
        const m = st.m;
        if (m === "A") {
          const r = +$("#csR").value, d = pics().map((g, i) => $("#csP" + i).value);
          if (d.some(v => v === "")) { T.msg("Indique la classe de danger de chaque pictogramme de l'étiquette.", "bad"); return; }
          if (dup("A", q => q.r === r)) { T.msg("Ce réactif est déjà noté : supprime sa ligne (✕) pour refaire ton identification.", "bad"); return; }
          T.add("A", { r, d: d.join(",") }); T.msg("Identification notée pour : " + CX_REAC[r].n + ".", "ok"); draw(); return;
        }
        if (m === "B") {
          const s = +$("#csS").value, o = document.querySelector('input[name="csO"]:checked');
          if (!o) { T.msg("Choisis la prévention ou la conduite à tenir.", "bad"); return; }
          if (dup("B", q => q.s === s)) { T.msg("Cette situation est déjà notée : supprime sa ligne (✕) pour la refaire.", "bad"); return; }
          T.add("B", { s, d: +$("#csD").value, c: +o.value }); T.msg("Réponse notée.", "ok"); draw(); return;
        }
        const wv = +$("#csW").value, f = document.querySelector('input[name="csF"]:checked');
        if (!f) { T.msg("Choisis une filière de collecte.", "bad"); return; }
        if (dup("C", q => q.w === wv)) { T.msg("Ce déchet est déjà trié : supprime sa ligne (✕) pour le refaire.", "bad"); return; }
        T.add("C", { w: wv, f: +f.value }); T.msg("Tri noté.", "ok"); draw();
      };
      const rel = e => { const b = cv.getBoundingClientRect(), x = (e.clientX - b.left - 14) / (b.width - 28), y = (e.clientY - b.top - 14) / (b.height - 28); return [x, y]; };
      cv.addEventListener("click", e => {
        if (st.m !== "D") return;
        const [x, y] = rel(e); if (x < 0 || x > 1 || y < 0 || y > 1) return;
        const k = $("#csE").value;
        if (dup("D", q => q.k === k)) { T.msg("Cet équipement est déjà repéré : supprime sa ligne (✕) pour le repérer de nouveau.", "bad"); return; }
        T.add("D", { k, x: rnd(x, 3), y: rnd(y, 3) }); T.msg("Emplacement noté pour : " + CX_EQUIP.find(q => q.k === k).n + ".", "ok");
        const i = $("#csE").selectedIndex; if (i < CX_EQUIP.length - 1) $("#csE").selectedIndex = i + 1; draw();
      });
      cv.addEventListener("mousemove", e => { if (st.m !== "D") return; hover = rel(e); draw(); });
      cv.addEventListener("mouseleave", () => { hover = null; if (st.m === "D") draw(); });
      fillA(); fillB(); ui();
    }
  });
  window.TPX.secu = { DANGERS, SITU, WASTES, FILIERES };

  /* ======================================================================
     TP C2 : PRÉPARATION DES SOLUTIONS
     A : 250,0 mL de NaCl à 0,100 mol/L par dissolution ; B : 100,0 mL à 0,0200 mol/L par dilution
     ====================================================================== */
  register({
    id: "csol", num: 32, lab: "C2", disc: "Chimie", court: "Préparation des solutions",
    titre: "Préparation des solutions : dissolution d'un solide et dilution d'une solution mère",
    objectifs: "calculer une masse de soluté, réaliser une pesée correcte, effectuer un transfert quantitatif, utiliser une fiole jaugée et une pipette jaugée, et calculer la concentration réelle des solutions préparées.",
    materiel: ["Balance analytique (lecture au 0,1 mg) et coupelle de pesée", "Chlorure de sodium NaCl solide (M = 58,44 g/mol), spatule", "Bécher de 100 mL, entonnoir, pissette d'eau distillée", "Fioles jaugées de 50,0, 100,0 et 250,0 mL avec bouchons", "Pipettes jaugées de 10,0, 20,0 et 25,0 mL, propipette", "Étiquettes"],
    theorie: `<p>Pour une <b>dissolution</b> : la masse de soluté à peser est</p><div class="formula">m = C × V × M</div>
      <p>Pour 250,0 mL de NaCl à 0,100 mol/L : m = 0,100 × 0,2500 × 58,44 = <b>1,461 g</b>.</p>
      <p>Pour une <b>dilution</b>, la quantité de soluté prélevée se retrouve dans la fille :</p><div class="formula">C₁ V₁ = C₂ V₂        V₁ = C₂ V₂ / C₁</div>
      <p>Pour 100,0 mL à 0,0200 mol/L à partir de la solution mère à 0,100 mol/L : V₁ = 0,0200 × 100,0 / 0,100 = <b>20,0 mL</b>.</p>
      <h4>Concentrations réelles</h4><p>On ne pèse jamais exactement 1,461 g : la concentration réelle se calcule avec la masse <b>réellement pesée</b>, C = m / (M × V), puis C₂ = C₁ V₁ / V₂ pour la fille.</p>`,
    protocole: `<h4>Partie A — Dissolution</h4><ol><li>Pose la coupelle sur la balance et <b>tare</b>.</li><li>Ajoute le NaCl à la spatule jusqu'à environ 1,461 g (une pointe de spatule à la fois à la fin). Note la masse affichée.</li>
        <li>Dissous le solide dans un peu d'eau distillée dans le bécher.</li><li>Transvase dans la fiole jaugée de 250 mL, puis <b>rince le bécher</b> et verse les eaux de rinçage dans la fiole (transfert quantitatif).</li>
        <li>Complète jusqu'au trait de jauge (bas du ménisque sur le trait), bouche et homogénéise par retournements. Note la préparation.</li></ol>
      <h4>Partie B — Dilution</h4><ol><li>Choisis la pipette jaugée et la fiole jaugée qui conviennent.</li><li>Prélève la solution mère avec la pipette jaugée et la propipette, verse dans la fiole.</li>
        <li>Complète au trait avec de l'eau distillée, bouche et homogénéise. Note la dilution.</li></ol>`,
    precautions: `<ul><li>Tare la balance avec la coupelle avant de peser.</li><li>Sans rinçage du bécher, une partie du solide reste dans le bécher : la concentration réelle est plus faible que celle calculée.</li>
      <li>Termine l'ajustement au trait goutte à goutte : si tu dépasses le trait, la solution est à refaire.</li><li>Ne pipette jamais à la bouche : utilise la propipette.</li><li>Étiquette chaque solution (nom, concentration, date).</li></ul>`,
    preparation: ["Calcule la masse de NaCl nécessaire pour 250,0 mL à 0,100 mol/L.", "Calcule le volume de solution mère à prélever pour 100,0 mL à 0,0200 mol/L.", "Pourquoi faut-il rincer le bécher lors d'un transfert quantitatif ?", "Pourquoi complète-t-on au trait de jauge après la dissolution, et pas avant ?", "Que se passe-t-il si le volume final est dépassé ?"],
    hint: "Partie A : coupelle, tare, pesée, dissolution, transfert, rinçage, ajustement au trait, homogénéisation. Partie B : pipette et fiole adaptées.",
    controls: `<h3>Étape</h3>${seg("slm", [["A", "A · dissolution"], ["B", "B · dilution"]], "A")}
      <div id="slA"><h3>Balance</h3><div class="row"><button type="button" class="btn sm" id="slCup">Poser la coupelle</button><button type="button" class="btn sm" id="slTare">Tarer</button></div>
        <div class="row"><button type="button" class="btn sm" data-slsp="g">+ spatulée</button><button type="button" class="btn sm" data-slsp="p">+ petite spatulée</button><button type="button" class="btn sm" data-slsp="t">+ pointe</button><button type="button" class="btn sm" data-slsp="r">− pointe</button></div>
        <h3>Solution</h3><div class="row"><button type="button" class="btn sm" id="slDis">Dissoudre dans le bécher</button><button type="button" class="btn sm" id="slTr">Transvaser dans la fiole</button><button type="button" class="btn sm" id="slRi">Rincer le bécher (3 fois)</button></div></div>
      <div id="slB" hidden><div class="ctl"><label for="slPip">Pipette jaugée</label><select id="slPip"><option value="10">10,0 mL</option><option value="20">20,0 mL</option><option value="25">25,0 mL</option></select></div>
        <div class="ctl"><label for="slFio">Fiole jaugée</label><select id="slFio"><option value="50">50,0 mL</option><option value="100">100,0 mL</option><option value="250">250,0 mL</option></select></div>
        <div class="row"><button type="button" class="btn sm" id="slPr">Prélever et verser dans la fiole</button></div></div>
      <div class="ctl"><label for="slF">Compléter avec de l'eau <b id="slFv"></b></label><input id="slF" type="range" min="0" max="251" step="0.05" value="0"></div>
      <div class="row"><button type="button" class="btn sm" id="slHo">Boucher et homogénéiser</button><button type="button" class="btn sm" id="slRe">Recommencer cette étape</button></div>
      ${lcd("sl", [["M", "Balance"], ["E", "État"]])}
      <div class="row"><button type="button" class="btn primary sm" id="slRec">Noter la préparation</button></div>`,
    parts: [{ key: "A" }, { key: "B" }],
    questions: ["Calcule la concentration réelle de la solution mère à partir de la masse pesée.", "Calcule la concentration réelle de la solution diluée.", "Compare aux valeurs théoriques et calcule l'erreur relative.", "Cite trois sources d'erreurs possibles.", "Pourquoi utilise-t-on une fiole jaugée et une pipette jaugée plutôt qu'une éprouvette ?"],
    init(T) {
      const CUP = 12.3418, defA = { cup: 0, tare: 0, m: 0, dis: 0, tr: 0, ri: 0, Vf: 0, hom: 0, ok: 0 }, defB = { pr: 0, V1: 0, Vn: 100, Vf: 0, hom: 0, ok: 0 };
      const def = { m: "A", a: defA, b: defB };
      let st = state("csol_st", def); const save = () => store.set("csol_st", st);
      const bal = () => { const a = st.a; if (!a.cup) return a.tare ? -CUP : 0; return rnd((a.tare ? 0 : CUP) + a.m + 0.00006 * Math.sin(a.m * 913), 4); };
      const cur = () => st.m === "A" ? st.a : st.b, Vn = () => st.m === "A" ? 250 : st.b.Vn;
      const ui = () => {
        setSeg("slm", st.m); $("#slA").hidden = st.m !== "A"; $("#slB").hidden = st.m !== "B";
        const s = cur(), ready = st.m === "A" ? s.tr : s.pr; $("#slF").max = Vn() + 1; $("#slF").value = s.Vf; $("#slFv").textContent = ready ? meni(s.Vf, Vn()) : "—";
        $("#slMt").textContent = st.m === "A" ? "Balance" : "Solution mère"; $("#slM").textContent = st.m === "A" ? fx(bal(), 4) + " g" : T.rows.A.length ? "préparée" : "à préparer d'abord (partie A)";
        const a = st.a;
        $("#slE").textContent = st.m === "A" ? (a.hom ? "fiole homogénéisée" : a.tr ? (a.ri ? "transvasée et rincée" : "transvasée, bécher non rincé") : a.dis ? "dissous dans le bécher" : a.m > 0 ? "pesée en cours" : "—")
          : (s.hom ? "fiole homogénéisée" : s.pr ? s.V1 + " mL dans la fiole de " + s.Vn + " mL" : "—");
        draw();
      };
      const draw = () => {
        const B = mkBench("csol-cv");
        if (st.m === "A") {
          const a = st.a;
          B.draw({ V: null, noStand: true, side: [["Masse affichée : " + fx(bal(), 4) + " g", null, true], ["Masse visée : 1,461 g (pour 250,0 mL à 0,100 mol/L)"], ["Bécher " + (a.tr ? (a.ri ? "rincé : tout le solide est dans la fiole" : "NON rincé : il reste du solide !") : a.dis ? "solution dans le bécher" : "vide"), a.tr && !a.ri ? "#c0392b" : null], ["Fiole : " + (a.tr ? meni(a.Vf, 250) : "vide") + (a.hom ? " — homogénéisée" : "")]],
            custom: G => { const { c, bw, H0, fg } = G;
              if (!a.tr) {   // balance
                const x = bw * 0.12, y = H0 * 0.55, ww = bw * 0.7; c.fillStyle = "#cfd8dc"; c.fillRect(x, y, ww, H0 * 0.25); c.fillStyle = "#90a4ae"; c.fillRect(x + ww * 0.25, y - 8, ww * 0.5, 8);
                c.fillStyle = "#1d2b14"; c.fillRect(x + ww * 0.2, y + H0 * 0.08, ww * 0.6, H0 * 0.1); txt(c, fx(bal(), 4) + " g", x + ww / 2, y + H0 * 0.155, "#c9e6b4", "center", "alphabetic", "600 16px 'Fira Mono',monospace");
                if (a.cup) { c.fillStyle = "#e0e0e0"; c.fillRect(x + ww * 0.3, y - 16, ww * 0.4, 8); if (a.m > 0) { c.fillStyle = "#fafafa"; c.beginPath(); c.ellipse(x + ww / 2, y - 18, Math.min(ww * 0.17, 4 + a.m * 18), 4 + a.m * 3, 0, Math.PI, 0); c.fill(); c.strokeStyle = "#bbb"; c.stroke(); } }
                txt(c, "balance analytique", x + ww / 2, y + H0 * 0.31, G.mu, "center", "alphabetic", "11px 'Fira Sans',Arial");
              } else flask(G, 250, a.Vf, a.hom, null, bw * 0.46); } });
        } else {
          const b = st.b;
          B.draw({ V: null, noStand: true, side: [["Pipette : " + $("#slPip").value + ",0 mL   Fiole : " + $("#slFio").value + ",0 mL", null, true], ["Concentration visée : 0,0200 mol/L dans 100,0 mL"], ["Fiole : " + (b.pr ? meni(b.Vf, b.Vn) : "vide") + (b.hom ? " — homogénéisée" : "")]],
            custom: G => flask(G, b.pr ? b.Vn : +$("#slFio").value, b.Vf, b.hom, null, G.bw * 0.46) });
        }
      };
      T.draw = draw;
      document.querySelectorAll("[data-slm]").forEach(b => b.onclick = () => { st.m = b.dataset.slm; save(); T.msg(""); ui(); });
      $("#slCup").onclick = () => { const a = st.a; if (a.tr) { T.msg("La pesée est terminée : « Recommencer cette étape » pour une nouvelle préparation.", "bad"); return; } a.cup = 1; save(); T.msg("Coupelle posée : tare la balance avant d'ajouter le solide."); ui(); };
      $("#slTare").onclick = () => { const a = st.a; if (a.m > 0) { T.msg("Il y a déjà du solide dans la coupelle : on tare avant d'ajouter le produit.", "bad"); return; } a.tare = 1; save(); T.msg(a.cup ? "Balance tarée : l'affichage est à zéro avec la coupelle." : "Balance tarée sans coupelle : pose d'abord la coupelle, puis tare.", a.cup ? "ok" : "bad"); if (!a.cup) a.tare = 0; save(); ui(); };
      document.querySelectorAll("[data-slsp]").forEach(b => b.onclick = () => {
        const a = st.a; if (!a.cup || !a.tare) { T.msg("Pose la coupelle et tare la balance avant de peser.", "bad"); return; } if (a.dis) { T.msg("Le solide est déjà dissous.", "bad"); return; }
        const k = b.dataset.slsp, d = k === "g" ? U(0.25, 0.4) : k === "p" ? U(0.04, 0.08) : U(0.004, 0.012);
        a.m = Math.max(0, rnd(a.m + (k === "r" ? -d : d), 5)); save(); T.msg(a.m > 1.6 ? "Trop de solide : retire une pointe de spatule à la fois." : ""); ui();
      });
      $("#slDis").onclick = () => { const a = st.a; if (!(a.m > 0)) { T.msg("Pèse d'abord le chlorure de sodium.", "bad"); return; } a.dis = 1; a.mw = bal(); save(); T.msg("Solide dissous dans un peu d'eau distillée. Masse pesée : " + fx(a.mw, 4) + " g.", "ok"); ui(); };
      $("#slTr").onclick = () => { const a = st.a; if (!a.dis) { T.msg("Dissous d'abord le solide dans le bécher.", "bad"); return; } a.tr = 1; a.Vf = Math.max(a.Vf, 60); save(); T.msg("Solution transvasée dans la fiole jaugée de 250 mL. Pense à rincer le bécher."); ui(); };
      $("#slRi").onclick = () => { const a = st.a; if (!a.tr) { T.msg("Transvase d'abord la solution dans la fiole.", "bad"); return; } if (a.Vf > 240) { T.msg("La fiole est presque pleine : on rince avant de compléter.", "bad"); return; } a.ri = 1; a.Vf = Math.max(a.Vf, 90); save(); T.msg("Bécher rincé trois fois ; les eaux de rinçage sont dans la fiole.", "ok"); ui(); };
      $("#slPr").onclick = () => {
        const b = st.b; if (!T.rows.A.length) { T.msg("Prépare et note d'abord la solution mère (partie A).", "bad"); return; } if (b.pr) { T.msg("Le prélèvement est déjà fait : « Recommencer cette étape » pour une nouvelle fiole.", "bad"); return; }
        Object.assign(b, { pr: 1, V1: +$("#slPip").value, Vn: +$("#slFio").value, Vf: +$("#slPip").value, hom: 0, ok: 0 }); save(); T.msg(b.V1 + ",0 mL de solution mère versés dans la fiole de " + b.Vn + ",0 mL. Complète au trait.", "ok"); ui();
      };
      $("#slF").addEventListener("input", () => {
        const s = cur(), ready = st.m === "A" ? s.tr : s.pr, v = +$("#slF").value;
        if (!ready) { $("#slF").value = s.Vf; T.msg(st.m === "A" ? "Transvase d'abord la solution dans la fiole." : "Fais d'abord le prélèvement.", "bad"); return; }
        if (s.hom) { $("#slF").value = s.Vf; T.msg("La fiole est bouchée et homogénéisée.", "bad"); return; }
        if (v < s.Vf) { $("#slF").value = s.Vf; T.msg("On ne peut pas retirer d'eau de la fiole.", "bad"); return; }
        s.Vf = v; save(); T.msg(v > Vn() + 0.05 ? "Le ménisque a dépassé le trait de jauge : la solution est à refaire." : "", v > Vn() + 0.05 ? "bad" : ""); ui();
      });
      $("#slHo").onclick = () => { const s = cur(); if (Math.abs(s.Vf - Vn()) > 0.05) { T.msg(s.Vf > Vn() ? "Le trait est dépassé : recommence." : "Complète d'abord jusqu'au trait de jauge.", "bad"); return; } s.hom = 1; save(); T.msg("Fiole bouchée et homogénéisée par plusieurs retournements.", "ok"); ui(); };
      $("#slRe").onclick = () => { if (st.m === "A") st.a = Object.assign({}, defA); else st.b = Object.assign({}, defB); save(); T.msg("Étape recommencée : verrerie rincée."); ui(); };
      $("#slRec").onclick = () => {
        const s = cur(); if (!s.hom) { T.msg("Complète au trait, puis bouche et homogénéise avant de noter.", "bad"); return; } if (s.ok) { T.msg("Cette préparation est déjà notée : « Recommencer cette étape » pour en faire une autre.", "bad"); return; }
        const n = T.rows[st.m].length;
        if (st.m === "A") T.add("A", { m: st.a.mw, V: 250, ri: st.a.ri, Vf: rnd(st.a.Vf, 2) }); else T.add("B", { V1: st.b.V1, V2: st.b.Vn, Vf: rnd(st.b.Vf, 2) });
        if (T.rows[st.m].length > n) { s.ok = 1; save(); T.msg("Préparation notée.", "ok"); } ui();
      };
      ["#slPip", "#slFio"].forEach(q => $(q).addEventListener("change", draw));
      ui();
    }
  });

  /* ======================================================================
     TP C3.1 : DOSAGE COLORIMÉTRIQUE DE L'ACIDE ÉTHANOÏQUE PAR LA SOUDE
     ====================================================================== */
  register({
    id: "ccolo", num: 33, lab: "C3.1", disc: "Chimie", court: "Dosage colorimétrique",
    titre: "Acidimétrie : dosage colorimétrique de l'acide éthanoïque (acétique) par la soude",
    objectifs: "comprendre la réaction de neutralisation, identifier l'équivalence, utiliser une burette et une pipette jaugée, choisir un indicateur coloré adapté et calculer la concentration d'une solution d'acide éthanoïque.",
    materiel: ["Burette graduée de 50 mL remplie de soude NaOH à 0,100 mol/L (concentration connue)", "Solution d'acide éthanoïque CH₃COOH à doser (environ 0,1 mol/L)", "Pipette jaugée de 10,0 mL, propipette, erlenmeyer, eau distillée", "Indicateurs colorés : phénolphtaléine, bleu de bromothymol (BBT), hélianthine", "Agitateur magnétique"],
    theorie: `<p>La soude réagit de façon totale avec l'acide éthanoïque :</p><div class="formula">CH₃COOH + HO⁻ → CH₃COO⁻ + H₂O</div>
      <p>À l'<b>équivalence</b>, l'acide et la base ont été introduits dans les proportions stœchiométriques (réaction 1:1) :</p><div class="formula">C_a × V_a = C_b × V_E        C_a = C_b × V_E / V_a</div>
      <h4>Choix de l'indicateur</h4><p>À l'équivalence, la solution contient la base CH₃COO⁻ : le <b>pH d'équivalence est supérieur à 7</b> (environ 8,7). L'indicateur doit changer de couleur dans le saut de pH, c'est-à-dire avoir sa zone de virage autour de ce pH.</p>
      <table class="mini"><tr><th>Indicateur</th><th>Zone de virage</th><th>Couleurs</th></tr><tr><td>Hélianthine</td><td>3,1 – 4,4</td><td>rouge → jaune</td></tr><tr><td>Bleu de bromothymol</td><td>6,0 – 7,6</td><td>jaune → bleu</td></tr><tr><td>Phénolphtaléine</td><td>8,2 – 10,0</td><td>incolore → rose</td></tr></table>
      <p>Le <b>virage</b> de l'indicateur (changement de couleur observé) ne coïncide avec l'<b>équivalence</b> (définie par la stœchiométrie) que si l'indicateur est bien choisi.</p>`,
    protocole: `<h4>Partie A — Dosage avec la phénolphtaléine</h4><ol><li>Rince la burette avec un peu de soude, remplis-la et élimine les bulles d'air ; ajuste le zéro (« Nouveau dosage »).</li>
        <li>Prélève 10,0 mL d'acide éthanoïque à la pipette jaugée, verse-les dans l'erlenmeyer avec 20 mL d'eau et 2 gouttes de phénolphtaléine.</li>
        <li><b>Dosage rapide</b> (essai 1) : verse la soude mL par mL sous agitation jusqu'au virage. Note V.</li>
        <li><b>Dosages précis</b> (essais 2 et 3) : verse rapidement jusqu'à 1 mL avant le volume trouvé, puis goutte à goutte jusqu'à la première teinte rose persistante. Les volumes doivent concorder à 0,1 mL près.</li></ol>
      <h4>Partie B — Comparaison des indicateurs</h4><ol><li>Refais un dosage avec chacun des trois indicateurs (BBT : note le volume au virage au vert ; hélianthine : au virage au jaune).</li><li>Compare les volumes au virage au volume équivalent trouvé dans la partie A.</li></ol>`,
    precautions: `<ul><li>Chasse la bulle d'air sous le robinet et ajuste le zéro avant chaque dosage.</li><li>À proximité du virage, ajoute la soude goutte à goutte et agite : la teinte doit <b>persister</b>.</li><li>Lis la burette au bas du ménisque, l'œil à hauteur du trait.</li><li>Réel : blouse, lunettes et gants pour la soude.</li></ul>`,
    preparation: ["Écris l'équation de la réaction de dosage.", "Définis l'équivalence et établis la relation C_a V_a = C_b V_E.", "Calcule V_E attendu pour 10,0 mL d'acide à 0,10 mol/L dosés par la soude à 0,100 mol/L.", "Pourquoi le pH à l'équivalence est-il supérieur à 7 ? Quel indicateur faut-il choisir ?", "Pourquoi faut-il agiter le mélange pendant le dosage ?"],
    hint: "Partie A : dosages avec la phénolphtaléine (un rapide, puis deux précis). Partie B : un dosage avec chaque indicateur.",
    controls: `<h3>Partie</h3>${seg("clm", [["A", "A · phénolphtaléine"], ["B", "B · indicateurs"]], "A")}
      <div class="ctl" id="clIw" hidden><label for="clI">Indicateur ajouté</label><select id="clI"><option value="ph">phénolphtaléine</option><option value="bbt">bleu de bromothymol</option><option value="hel">hélianthine</option></select></div>
      ${burHTML("cl", "soude 0,100 mol/L")}
      ${lcd("cl", [["V", "Burette : V versé"], ["C", "Teinte de la solution"]])}
      <div class="row"><button type="button" class="btn primary sm" id="clRec">Noter V au virage</button></div>
      <button type="button" class="btn sm" id="clNew">Changer de matériel</button>`,
    parts: [{ key: "A" }, { key: "B" }],
    questions: ["Écris l'équation de dosage et la relation à l'équivalence.", "Calcule la concentration de l'acide éthanoïque (mol/L et g/L).", "Distingue l'équivalence du virage de l'indicateur.", "Pourquoi l'hélianthine ne convient-elle pas ? Le BBT convient-il ?", "Pourquoi recommence-t-on jusqu'à obtenir des résultats concordants ?"],
    init(T) {
      const mk = () => ({ cw: U(0.08, 0.12), pKa: 4.76 + (Math.random() * 2 - 1) * 0.04 });
      let P = params("ccolo_par", mk, P => isFinite(P.cw));
      const def = { m: "A", V: { A: 0, B: 0 }, fin: { A: false, B: false }, ind: "ph" };
      let st = state("ccolo_st", def); const save = () => store.set("ccolo_st", st);
      const B = mkBench("ccolo-cv");
      const ind = () => st.m === "A" ? "ph" : st.ind, pH = () => cxColoPH(P, st.V[st.m]), vir = () => pH() >= CX_IND[ind()].t;
      const ui = () => {
        setSeg("clm", st.m); $("#clIw").hidden = st.m !== "B"; $("#clI").value = st.ind;
        $("#clV").textContent = f2(st.V[st.m]) + " mL"; $("#clC").textContent = indTxt(ind(), pH()); draw();
      };
      const draw = () => { const m = st.m, i = ind(), p = pH();
        B.draw({ V: st.V[m], tit: "NaOH 0,100 mol/L", vessel: "erlen", stir: true, col: B.flash > 0.05 && i === "ph" && !vir() ? `rgba(226,52,146,${(0.4 * B.flash).toFixed(3)})` : indCol(i, p),
          cap: "CH₃COOH 10,0 mL + 20 mL d'eau + " + CX_IND[i].n,
          side: [["Teinte : " + indTxt(i, p), null, true], ["Indicateur : " + CX_IND[i].n + " (zone de virage " + CX_IND[i].z + ")"], ["Volumes notés : " + (T.rows[m].map(r => f2(r.V) + (m === "B" ? " (" + CX_IND[r.ind].n + ")" : "")).join(" ; ") || "aucun")], ...(st.fin[m] ? [["Dosage terminé : « Nouveau dosage » pour l'essai suivant.", css("--accent")]] : [])] }); };
      T.draw = draw; T.tick = dt => { if (B.tick(dt)) draw(); };
      document.querySelectorAll("[data-clm]").forEach(b => b.onclick = () => { st.m = b.dataset.clm; save(); T.msg(""); ui(); });
      $("#clI").addEventListener("change", () => { if (st.V.B > 0 && !st.fin.B) { $("#clI").value = st.ind; T.msg("L'indicateur se choisit avant le dosage : « Nouveau dosage » pour changer d'indicateur.", "bad"); return; } st.ind = $("#clI").value; st.V.B = 0; st.fin.B = false; save(); T.msg("Nouvelle prise d'essai avec " + CX_IND[st.ind].n + "."); ui(); });
      document.querySelectorAll("[data-clv]").forEach(b => b.onclick = () => {
        const m = st.m; if (st.fin[m]) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        const was = vir(); if (!addV(T, st.V, m, +b.getAttribute("data-clv"))) return; save(); B.drop();
        if (!vir() && ind() === "ph" && P.cw * 100 - st.V[m] < 1.2) B.flash = 1;
        T.msg(!was && vir() ? "Changement de couleur : la teinte persiste à l'agitation." : "", "ok"); ui();
      });
      $("#clRaz").onclick = () => { const m = st.m; st.V[m] = 0; st.fin[m] = false; save(); T.msg("Nouvelle prise : 10,0 mL d'acide éthanoïque + 20 mL d'eau + " + CX_IND[ind()].n + " ; burette remplie et ajustée au zéro."); ui(); };
      $("#clRec").onclick = () => {
        const m = st.m; if (st.fin[m]) { T.msg("Ce volume est déjà noté : clique sur « Nouveau dosage ».", "bad"); return; }
        if (!vir()) { T.msg("L'indicateur n'a pas encore changé de couleur.", "bad"); return; }
        const n = T.rows[m].length; T.add(m, m === "A" ? { Va: 10, V: st.V.A } : { ind: st.ind, V: st.V.B });
        if (T.rows[m].length > n) { st.fin[m] = true; save(); T.msg(`V = ${f2(st.V[m])} mL noté. « Nouveau dosage » pour l'essai suivant.`, "ok"); } ui();
      };
      $("#clNew").onclick = () => { if (lockedMsg(T)) return; P = mk(); store.set("ccolo_par", P); st = JSON.parse(JSON.stringify(def)); save(); T.clearRows(); ui(); T.msg("Nouvelle solution d'acide : refais les dosages."); };
      ui();
    }
  });

  /* ======================================================================
     TP C3.2 : DOSAGE pH-MÉTRIQUE DE L'ACIDE ÉTHANOÏQUE PAR LA SOUDE
     A : étalonnage du pH-mètre ; B : courbe pH = f(V) de CH₃COOH ; C : courbe de HCl (comparaison)
     ====================================================================== */
  register({
    id: "cphm", num: 34, lab: "C3.2", disc: "Chimie", court: "Dosage pH-métrique",
    titre: "Acidimétrie : dosage pH-métrique de l'acide éthanoïque par la soude",
    objectifs: "étalonner un pH-mètre, suivre l'évolution du pH au cours du dosage, tracer la courbe pH = f(V), repérer l'équivalence, déterminer le pKa du couple CH₃COOH/CH₃COO⁻ et comparer avec le dosage d'un acide fort.",
    materiel: ["pH-mètre et électrode combinée, solutions tampons pH 7 et pH 4", "Burette de 50 mL remplie de soude NaOH à 0,100 mol/L", "Acide éthanoïque CH₃COOH à doser (environ 0,1 mol/L) ; acide chlorhydrique HCl (environ 0,1 mol/L) pour la comparaison", "Pipette jaugée de 20,0 mL, bécher de 150 mL, eau distillée", "Agitateur magnétique"],
    theorie: `<p>Le pH est défini par <b>pH = −log a(H₃O⁺)</b> ; en solution diluée, a(H₃O⁺) ≈ [H₃O⁺] / c° avec c° = 1 mol/L.</p>
      <div class="formula">CH₃COOH + HO⁻ → CH₃COO⁻ + H₂O        C_a V_a = C_b V_E</div>
      <h4>Exploitation de la courbe pH = f(V)</h4><ul><li>L'équivalence est au milieu du <b>saut de pH</b> : méthode des tangentes parallèles, ou maximum de la dérivée ΔpH/ΔV.</li>
      <li>À la <b>demi-équivalence</b> (V = V_E/2), [CH₃COOH] = [CH₃COO⁻], donc <b>pH = pKa</b>.</li>
      <li>Acide faible : pH initial plus élevé, saut plus court, <b>pH à l'équivalence &gt; 7</b>. Acide fort : pH initial plus bas, saut plus grand, pH = 7 à l'équivalence.</li></ul>`,
    protocole: `<h4>Partie A — Étalonnage du pH-mètre</h4><ol><li>Électrode dans le tampon pH 7 : tourne le bouton « zéro » jusqu'à lire 7,00. Note la lecture.</li><li>Électrode rincée, dans le tampon pH 4 : tourne le bouton « pente » jusqu'à lire 4,00. Note la lecture. Ne touche plus aux boutons ensuite.</li></ol>
      <h4>Partie B — Dosage de l'acide éthanoïque</h4><ol><li>20,0 mL d'acide éthanoïque + 50 mL d'eau dans le bécher ; électrode immergée ; agitation.</li><li>Mesure le pH initial, puis ajoute la soude par 1 mL (ou 2 mL au début), en attendant la stabilisation du pH après chaque ajout.</li>
        <li>Réduis les incréments (0,2 mL ou une goutte) près de l'équivalence, puis continue quelques mL après.</li><li>Calcule ΔpH/ΔV, repère V_E, puis lis le pH à V_E/2.</li></ol>
      <h4>Partie C — Comparaison avec l'acide chlorhydrique</h4><ol><li>Même protocole avec 20,0 mL de HCl.</li></ol>`,
    precautions: `<ul><li>Étalonne le pH-mètre <b>avant</b> les dosages : sans étalonnage, toutes les valeurs de pH sont fausses.</li><li>Rince l'électrode à l'eau distillée entre deux solutions ; ne la laisse jamais à sec.</li><li>Attends la stabilisation de la lecture avant de noter le pH.</li><li>Près de l'équivalence, le pH varie très vite : resserre les points.</li></ul>`,
    preparation: ["Pourquoi faut-il étalonner le pH-mètre ?", "Calcule le pH initial attendu pour l'acide éthanoïque à 0,1 mol/L dilué de 20 à 70 mL (pKa = 4,76).", "Montre qu'à la demi-équivalence, pH = pKa.", "Pourquoi le pH à l'équivalence n'est-il pas égal à 7 pour l'acide éthanoïque ?", "Comment repère-t-on l'équivalence sur une courbe ?"],
    hint: "Étalonne d'abord le pH-mètre (partie A), puis verse la soude et enregistre les points (V ; pH).",
    controls: `<h3>Partie</h3>${seg("cpm", [["A", "A · étalonnage"], ["B", "B · CH₃COOH"], ["C", "C · HCl"]], "A")}
      <div id="cpCal"><h3>Étalonnage</h3><div class="ctl"><label for="cpTp">Électrode plongée dans</label><select id="cpTp"><option value="7">le tampon pH 7</option><option value="4">le tampon pH 4</option></select></div>
      <div class="ctl"><label for="cpZ">Bouton « zéro » <b id="cpZv"></b></label><input id="cpZ" type="range" min="-0.6" max="0.6" step="0.005" value="0"></div>
      <div class="ctl"><label for="cpK">Bouton « pente » <b id="cpKv"></b></label><input id="cpK" type="range" min="94" max="110" step="0.05" value="100"></div></div>
      ${burHTML("cp", "soude 0,100 mol/L", [["2", "+ 2 mL"], ["1", "+ 1 mL"], ["0.2", "+ 0,2 mL"], ["0.05", "+ 1 goutte"]])}
      ${lcd("cp", [["V", "Burette : V versé"], ["P", "pH-mètre"]])}
      <div class="row"><button type="button" class="btn primary sm" id="cpRec">Enregistrer</button></div>
      <button type="button" class="btn sm" id="cpNew">Changer de matériel</button>`,
    parts: [{ key: "A" }, { key: "B" }, { key: "C" }],
    questions: ["Trace pH = f(V) pour l'acide éthanoïque et détermine V_E.", "Calcule la concentration de l'acide éthanoïque.", "Détermine le pKa du couple CH₃COOH/CH₃COO⁻ et compare-le à 4,76.", "Compare les courbes de l'acide fort et de l'acide faible.", "Pourquoi le pH à l'équivalence n'est-il pas toujours égal à 7 ?"],
    init(T) {
      const mk = () => { const sg = Math.random() < 0.5 ? -1 : 1; return { cw: U(0.08, 0.12), ca: U(0.08, 0.12), pKa: 4.76 + (Math.random() * 2 - 1) * 0.04, s: U(0.93, 0.985), off: sg * U(0.12, 0.37) }; };
      let P = params("cphm_par", mk, P => isFinite(P.cw) && isFinite(P.off));
      const def = { m: "A", V: { B: 0, C: 0 }, z: 0, k: 100 };
      let st = state("cphm_st", def); const save = () => store.set("cphm_st", st);
      const B = mkBench("cphm-cv"), seed = { B: 2.9, C: 4.3, B4: 5.1, B7: 6.7 };
      const meter = (pH, n) => { const m = 7 + P.s * (pH - 7) + P.off + 0.004 * Math.sin(n); return rnd(7 + (m - 7 + st.z) * st.k / 100, 2); };
      const read = () => st.m === "A" ? meter(+$("#cpTp").value, seed["B" + $("#cpTp").value]) : meter(cxPhmPH(P, st.m, st.V[st.m]), st.V[st.m] * 37.3 + seed[st.m]);
      const ui = () => {
        setSeg("cpm", st.m); $("#cpBur").hidden = st.m === "A"; $("#cpCal").hidden = st.m !== "A";
        $("#cpZ").value = st.z; $("#cpK").value = st.k; $("#cpZv").textContent = (st.z >= 0 ? "+" : "−") + fx(Math.abs(st.z), 3); $("#cpKv").textContent = fx(st.k, 2) + " %";
        $("#cpV").textContent = st.m === "A" ? "—" : f2(st.V[st.m]) + " mL"; $("#cpP").textContent = f2(read());
        $("#cpRec").textContent = st.m === "A" ? "Noter la lecture du tampon" : "Enregistrer le point (V ; pH)"; draw();
      };
      const draw = () => { const m = st.m;
        if (m === "A") { const tp = +$("#cpTp").value;
          B.draw({ V: null, meter: { val: "pH  " + f2(read()), sub: "zéro " + (st.z >= 0 ? "+" : "−") + fx(Math.abs(st.z), 3) + "   pente " + fx(st.k, 2) + " %" },
            custom: G => { const { c, bw, vy0, vy1, H0, fg, F } = G; [[7, bw * 0.3, "rgba(120,200,120,.45)"], [4, bw * 0.7, "rgba(240,140,90,.45)"]].forEach(([v, x, col]) => {
              c.fillStyle = col; c.fillRect(x - bw * 0.12, vy0 + (vy1 - vy0) * 0.35, bw * 0.24, (vy1 - vy0) * 0.65); c.strokeStyle = fg; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x - bw * 0.12, vy0); c.lineTo(x - bw * 0.12, vy1); c.lineTo(x + bw * 0.12, vy1); c.lineTo(x + bw * 0.12, vy0); c.stroke();
              F("tampon pH " + v, x, H0 * 0.975, G.mu, "center"); if (v === tp) { c.fillStyle = "#444"; c.fillRect(x - 4, vy0 - H0 * 0.28, 8, H0 * 0.28 + (vy1 - vy0) * 0.6); c.fillStyle = "#9cc3d5"; c.fillRect(x - 4, vy0 + (vy1 - vy0) * 0.45, 8, (vy1 - vy0) * 0.15); } }); } });
          return; }
        B.draw({ V: st.V[m], tit: "NaOH 0,100 mol/L", vessel: "becher", probe: "ph", stir: true, cap: (m === "B" ? "CH₃COOH" : "HCl") + " 20,0 mL + 50 mL d'eau",
          meter: { val: "pH  " + f2(read()), sub: "zéro " + (st.z >= 0 ? "+" : "−") + fx(Math.abs(st.z), 3) + "   pente " + fx(st.k, 2) + " %" },
          curve: { lab: "pH = f(V) — partie " + m, xmax: 35, ymax: 14, pts: T.rows[m].map(r => [r.V, r.pH]), cur: st.V[m] } }); };
      T.draw = draw; T.tick = dt => { if (B.tick(dt)) draw(); };
      document.querySelectorAll("[data-cpm]").forEach(b => b.onclick = () => { st.m = b.dataset.cpm; save(); T.msg(st.m !== "A" && T.rows.A.length < 2 ? "Étalonne d'abord le pH-mètre (partie A) : sinon toutes les valeurs de pH sont fausses." : ""); ui(); });
      document.querySelectorAll("[data-cpv]").forEach(b => b.onclick = () => { if (st.V[st.m] >= 35) { T.msg("Ce n'est plus utile d'aller au-delà de 35 mL.", "bad"); return; } if (addV(T, st.V, st.m, +b.getAttribute("data-cpv"))) { save(); B.drop(); T.msg(""); ui(); } });
      $("#cpRaz").onclick = () => { st.V[st.m] = 0; save(); T.msg("Nouveau dosage : burette au zéro, 20,0 mL d'acide + 50 mL d'eau." + (T.rows[st.m].length ? " Supprime d'abord les lignes de cette partie (✕) si tu refais la courbe." : "")); ui(); };
      $("#cpZ").addEventListener("input", () => { st.z = +$("#cpZ").value; save(); ui(); });
      $("#cpK").addEventListener("input", () => { st.k = +$("#cpK").value; save(); ui(); });
      $("#cpTp").addEventListener("change", ui);
      $("#cpRec").onclick = () => {
        const m = st.m, L = read();
        if (m === "A") { const tp = +$("#cpTp").value; if (Math.abs(L - tp) > 0.015) { T.msg(`Le pH-mètre n'affiche pas ${tp},00 : tourne le bouton « ${tp === 7 ? "zéro" : "pente"} » avant de noter la lecture.`, "bad"); return; } T.add("A", { tp, L }); T.msg(`Lecture notée dans le tampon pH ${tp}.`, "ok"); return; }
        const R = T.rows[m], V = st.V[m];
        if (R.length && V <= R[R.length - 1].V + 1e-9) { T.msg("Tu as déjà un point à ce volume (ou à un volume plus grand) : verse de la soude avant d'enregistrer.", "bad"); return; }
        T.add(m, { V, pH: L }); T.msg(`Point enregistré (partie ${m}).`, "ok"); draw();
      };
      $("#cpNew").onclick = () => { if (lockedMsg(T)) return; P = mk(); store.set("cphm_par", P); st = JSON.parse(JSON.stringify(def)); save(); T.clearRows(); ui(); T.msg("Nouveau matériel : refais l'étalonnage et les mesures."); };
      ui();
    }
  });

  /* ======================================================================
     TP C4 : ALCALIMÉTRIE — DOSAGE DU CARBONATE DE CALCIUM PAR UN ACIDE FORT (dosage en retour)
     A : étalonnage de l'acide chlorhydrique par la soude ; B : échantillon + excès connu de HCl, excès dosé par la soude
     ====================================================================== */
  register({
    id: "ccaco3", num: 35, lab: "C4", disc: "Chimie", court: "Alcalimétrie (CaCO₃)",
    titre: "Alcalimétrie : dosage du carbonate de calcium par un acide fort",
    objectifs: "mettre en œuvre un dosage acido-basique, écrire et équilibrer les équations, étalonner la solution d'acide, doser le carbonate de calcium d'un échantillon (craie, calcaire) par un excès connu d'acide chlorhydrique, exploiter les volumes et évaluer la répétabilité.",
    materiel: ["Acide chlorhydrique HCl (environ 0,2 mol/L, à étalonner)", "Burette de 50 mL remplie de soude NaOH à 0,100 mol/L", "Échantillon solide contenant du carbonate de calcium CaCO₃ (M = 100,09 g/mol), balance analytique", "Pipettes jaugées de 10,0 et 25,0 mL, erlenmeyers, eau distillée", "Plaque chauffante, phénolphtaléine"],
    theorie: `<p>Le carbonate de calcium est insoluble dans l'eau : on le fait réagir avec un <b>excès connu</b> d'acide chlorhydrique, puis on dose l'acide restant par la soude (<b>dosage en retour</b>).</p>
      <div class="formula">CaCO₃(s) + 2 H₃O⁺ → Ca²⁺ + CO₂(g) + 3 H₂O
H₃O⁺ (excès) + HO⁻ → 2 H₂O</div>
      <p>Une mole de CaCO₃ consomme <b>deux</b> moles d'acide. Avec n(H₃O⁺) introduit = C_H × 25,0 mL et n(H₃O⁺) restant = C_b × V_E :</p>
      <div class="formula">n(CaCO₃) = [C_H × V_H − C_b × V_E] / 2        % CaCO₃ = n(CaCO₃) × 100,09 / m × 100</div>
      <h4>Étalonnage de l'acide (partie A)</h4><div class="formula">HCl + NaOH → NaCl + H₂O        C_H × V_H = C_b × V_E</div>
      <h4>Pourquoi chauffer ?</h4><p>Le CO₂ produit reste en partie dissous (acide carbonique). Si on ne le chasse pas par une ébullition douce, la soude le dose aussi : le volume V_E est trop grand et la teneur en CaCO₃ est sous-estimée.</p>`,
    protocole: `<h4>Partie A — Étalonnage de l'acide chlorhydrique</h4><ol><li>Rince et remplis la burette avec la soude à 0,100 mol/L.</li><li>Prélève 10,0 mL de HCl, ajoute 20 mL d'eau et 2 gouttes de phénolphtaléine.</li><li>Titre par la soude sous agitation jusqu'à la teinte rose persistante. Fais deux essais concordants.</li></ol>
      <h4>Partie B — Dosage de l'échantillon</h4><ol><li>Pèse environ 0,2 g d'échantillon dans un erlenmeyer ; note la masse exacte.</li><li>Ajoute 25,0 mL de HCl (pipette jaugée) : effervescence.</li><li>Quand l'effervescence cesse, porte à <b>ébullition douce</b> 2 minutes pour chasser le CO₂, puis refroidis.</li>
        <li>Ajoute 25 mL d'eau et 2 gouttes de phénolphtaléine ; titre l'acide restant par la soude jusqu'au rose persistant.</li><li>Effectue trois essais (une pesée par essai).</li></ol>`,
    precautions: `<ul><li>Attends la fin de l'effervescence avant de chauffer ; chauffe doucement pour éviter les projections.</li><li>Refroidis avant de doser.</li><li>L'acide doit être en excès : avec environ 0,2 g d'échantillon, 25,0 mL d'acide à 0,2 mol/L conviennent.</li><li>Réel : lunettes, gants ; ne respire pas les vapeurs d'acide.</li></ul>`,
    preparation: ["Écris l'équation de la réaction du carbonate de calcium avec l'acide chlorhydrique.", "Pourquoi ne peut-on pas doser directement le carbonate de calcium par une base ? Pourquoi un dosage en retour ?", "Établis l'expression de n(CaCO₃) en fonction de C_H, V_H, C_b et V_E.", "Calcule V_E attendu pour 0,200 g de CaCO₃ pur, 25,0 mL de HCl à 0,200 mol/L et la soude à 0,100 mol/L.", "Pourquoi réalise-t-on plusieurs essais ?"],
    hint: "Partie A : étalonne l'acide. Partie B : pèse, ajoute 25,0 mL d'acide, chauffe pour chasser le CO₂, refroidis, puis dose par la soude.",
    controls: `<h3>Partie</h3>${seg("cam", [["A", "A · étalonnage de HCl"], ["B", "B · échantillon"]], "A")}
      <div id="caPrep" hidden><h3>Préparation de l'échantillon</h3><div class="row"><button type="button" class="btn sm" id="caPe">Peser l'échantillon</button><button type="button" class="btn sm" id="caAc">Ajouter 25,0 mL de HCl</button></div>
        <div class="row"><button type="button" class="btn sm" id="caBo">Ébullition douce, puis refroidir</button><button type="button" class="btn sm" id="caPh">Ajouter l'eau et la phénolphtaléine</button></div></div>
      ${burHTML("ca", "soude 0,100 mol/L")}
      ${lcd("ca", [["M", "Masse pesée"], ["V", "Burette : V versé"], ["C", "Teinte"]])}
      <div class="row"><button type="button" class="btn primary sm" id="caRec">Noter V_E (rose persistant)</button></div>
      <button type="button" class="btn sm" id="caNew">Changer de matériel</button>`,
    parts: [{ key: "A" }, { key: "B" }],
    questions: ["Écris les équations des réactions mises en jeu.", "Calcule la concentration exacte de l'acide chlorhydrique.", "Calcule n(CaCO₃) et la teneur en CaCO₃ de l'échantillon pour chaque essai, puis leur moyenne.", "Que se passe-t-il si l'on ne chasse pas le CO₂ ?", "Cite deux causes d'un volume équivalent anormal."],
    init(T) {
      const mk = () => ({ cH: U(0.19, 0.22), pur: U(0.90, 0.98) });
      let P = params("ccaco3_par", mk, P => isFinite(P.cH));
      const def = { m: "A", V: { A: 0, B: 0 }, fin: { A: false, B: false }, b: { m: 0, ac: 0, bo: 0, ph: 0 } };
      let st = state("ccaco3_st", def); const save = () => store.set("ccaco3_st", st);
      const B = mkBench("ccaco3-cv");
      const pH = () => st.m === "A" ? cxCaPH(P, "A", st.V.A) : cxCaPH(P, "B", st.V.B, st.b.m, st.b.bo);
      const ready = () => st.m === "A" || st.b.ph;
      const ui = () => {
        setSeg("cam", st.m); $("#caPrep").hidden = st.m !== "B"; const b = st.b;
        $("#caM").textContent = st.m === "B" && b.m ? fx(b.m, 4) + " g" : "—"; $("#caV").textContent = f2(st.V[st.m]) + " mL";
        $("#caC").textContent = ready() ? (pH() >= 8.2 ? "rose persistant" : "incolore") : "—"; draw();
      };
      const draw = () => { const m = st.m, b = st.b, p = pH(), pink = ready() && p >= 8.2;
        B.draw({ V: ready() ? st.V[m] : null, tit: "NaOH 0,100 mol/L", vessel: "erlen", stir: ready(),  col: pink ? phenCol(p) : B.flash > 0.05 ? `rgba(226,52,146,${(0.4 * B.flash).toFixed(3)})` : EAU, turb: m === "B" && b.m && !b.ac ? 0.6 : 0,
          cap: m === "A" ? "HCl 10,0 mL + 20 mL d'eau + phénolphtaléine" : b.ph ? "échantillon + 25,0 mL de HCl + 25 mL d'eau" : b.ac ? "échantillon + 25,0 mL de HCl" : b.m ? "échantillon pesé" : "erlenmeyer vide",
          custom: G => { if (m === "B" && b.ac && !b.bo) { const { c, bx, vy1, bw } = G; c.fillStyle = "rgba(255,255,255,.85)"; for (let i = 0; i < 12; i++) { c.beginPath(); c.arc(bx + Math.sin(i * 2.1) * bw * 0.16, vy1 - 8 - ((i * 11 + Date.now() / 40) % 45), 2.2, 0, 7); c.fill(); } } },
          side: [["Teinte : " + (ready() ? (pink ? "rose persistante" : "incolore") : "—"), pink ? "#c2185b" : null, true], ...(m === "B" ? [["Échantillon : " + (b.m ? fx(b.m, 4) + " g" : "à peser") + (b.ac ? " ; acide ajouté" : "") + (b.bo ? " ; CO₂ chassé" : b.ac ? " ; CO₂ encore dissous" : ""), b.ac && !b.bo && b.ph ? "#c0392b" : null]] : []),
            ["Volumes notés : " + (T.rows[m].map(r => f2(r.V)).join(" ; ") || "aucun")], ...(st.fin[m] ? [["Dosage terminé : « Nouveau dosage » pour l'essai suivant.", css("--accent")]] : [])] }); };
      T.draw = draw; T.tick = dt => { if (B.tick(dt) || (st.m === "B" && st.b.ac && !st.b.bo)) draw(); };
      document.querySelectorAll("[data-cam]").forEach(b => b.onclick = () => { st.m = b.dataset.cam; save(); T.msg(""); ui(); });
      $("#caPe").onclick = () => { const b = st.b; if (b.m) { T.msg("L'échantillon est déjà pesé : « Nouveau dosage » pour une nouvelle pesée.", "bad"); return; } b.m = rnd(U(0.18, 0.21), 4); save(); T.msg("Masse pesée : " + fx(b.m, 4) + " g.", "ok"); ui(); };
      $("#caAc").onclick = () => { const b = st.b; if (!b.m) { T.msg("Pèse d'abord l'échantillon.", "bad"); return; } if (b.ac) { T.msg("L'acide est déjà ajouté.", "bad"); return; } b.ac = 1; save(); T.msg("25,0 mL de HCl ajoutés : effervescence (dégagement de CO₂).", "ok"); ui(); };
      $("#caBo").onclick = () => { const b = st.b; if (!b.ac) { T.msg("Ajoute d'abord l'acide.", "bad"); return; } if (b.ph) { T.msg("Le dosage a commencé : il fallait chauffer avant.", "bad"); return; } b.bo = 1; save(); T.msg("Ébullition douce 2 min : le CO₂ est chassé. Mélange refroidi.", "ok"); ui(); };
      $("#caPh").onclick = () => { const b = st.b; if (!b.ac) { T.msg("Ajoute d'abord l'acide.", "bad"); return; } b.ph = 1; save(); T.msg(b.bo ? "Eau et phénolphtaléine ajoutées : tu peux doser." : "Eau et phénolphtaléine ajoutées. Attention : le CO₂ n'a pas été chassé.", b.bo ? "ok" : "bad"); ui(); };
      document.querySelectorAll("[data-cav]").forEach(b => b.onclick = () => {
        const m = st.m; if (!ready()) { T.msg("Prépare d'abord l'échantillon (pesée, acide, ébullition, phénolphtaléine).", "bad"); return; }
        if (st.fin[m]) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        const was = pH() >= 8.2; if (!addV(T, st.V, m, +b.getAttribute("data-cav"))) return; save(); B.drop(); if (pH() < 8.2) B.flash = 0.6;
        T.msg(!was && pH() >= 8.2 ? "La teinte rose persiste à l'agitation." : "", "ok"); ui();
      });
      $("#caRaz").onclick = () => { const m = st.m; st.V[m] = 0; st.fin[m] = false; if (m === "B") st.b = { m: 0, ac: 0, bo: 0, ph: 0 }; save(); T.msg(m === "A" ? "Nouvelle prise : 10,0 mL de HCl + 20 mL d'eau + phénolphtaléine ; burette au zéro." : "Nouvel essai : pèse un nouvel échantillon ; burette au zéro."); ui(); };
      $("#caRec").onclick = () => {
        const m = st.m; if (!ready()) { T.msg("Prépare d'abord l'échantillon.", "bad"); return; }
        if (st.fin[m]) { T.msg("Ce volume est déjà noté : clique sur « Nouveau dosage ».", "bad"); return; }
        if (pH() < 8.2) { T.msg("La solution est incolore : l'équivalence n'est pas atteinte.", "bad"); return; }
        const n = T.rows[m].length; T.add(m, m === "A" ? { Va: 10, V: st.V.A } : { m: st.b.m, VH: 25, V: st.V.B, bo: st.b.bo });
        if (T.rows[m].length > n) { st.fin[m] = true; save(); T.msg(`V_E = ${f2(st.V[m])} mL noté.`, "ok"); } ui();
      };
      $("#caNew").onclick = () => { if (lockedMsg(T)) return; P = mk(); store.set("ccaco3_par", P); st = JSON.parse(JSON.stringify(def)); save(); T.clearRows(); ui(); T.msg("Nouveau matériel : refais l'étalonnage et les dosages."); };
      ui();
    }
  });

  /* ======================================================================
     TP C5 : DOSAGE CONDUCTIMÉTRIQUE DE HCl ET DE L'ACIDE ÉTHANOÏQUE PAR LA SOUDE
     ====================================================================== */
  register({
    id: "ccond", num: 36, lab: "C5", disc: "Chimie", court: "Conductimétrie",
    titre: "Conductimétrie : dosage de HCl et de l'acide éthanoïque par la soude",
    objectifs: "expliquer l'origine de la conductivité d'une solution ionique, vérifier le conductimètre, réaliser un dosage conductimétrique, tracer σ = f(V), déterminer le volume équivalent par intersection des portions linéaires et comparer le dosage d'un acide fort et d'un acide faible.",
    materiel: ["Conductimètre et cellule conductimétrique", "Solution étalon de KCl à 0,0100 mol/L (σ = 1,41 mS/cm à 25 °C)", "Burette de 50 mL remplie de soude NaOH à 0,100 mol/L", "Acide chlorhydrique et acide éthanoïque de concentrations inconnues (environ 0,025 mol/L)", "Pipette jaugée de 20,0 mL, bécher de 400 mL, eau distillée, agitateur magnétique"],
    theorie: `<p>La conductivité d'une solution dépend de la concentration et de la mobilité des ions : <b>σ = Σ λᵢ [Xᵢ]</b>.</p>
      <p>Conductivités molaires ioniques à 25 °C (mS·m²/mol) : H₃O⁺ 35,0 ; HO⁻ 19,8 ; Cl⁻ 7,6 ; Na⁺ 5,0 ; CH₃COO⁻ 4,1.</p>
      <h4>A. Acide fort : HCl par NaOH</h4><div class="formula">H₃O⁺ + HO⁻ → 2 H₂O</div><ul><li>Avant l'équivalence, les ions H₃O⁺, très mobiles, sont remplacés par des ions Na⁺ : <b>σ diminue</b>.</li><li>Après l'équivalence, l'excès d'ions HO⁻ fait <b>augmenter σ</b> nettement.</li></ul>
      <h4>B. Acide faible : CH₃COOH par NaOH</h4><div class="formula">CH₃COOH + HO⁻ → CH₃COO⁻ + H₂O</div><ul><li>L'acide est peu dissocié : σ initiale faible. La formation d'ions CH₃COO⁻ et Na⁺ fait <b>augmenter σ</b> lentement.</li><li>Après l'équivalence, la pente augmente (excès de HO⁻).</li></ul>
      <p>Dans les deux cas, V_E est l'abscisse de l'<b>intersection des portions linéaires</b> : C_a V_a = C_b V_E. On corrige la dilution en traçant σ corrigée = σ × (V₀ + V) / V₀, avec V₀ = 220 mL.</p>`,
    protocole: `<h4>Partie A — Vérification du conductimètre</h4><ol><li>Cellule dans la solution de KCl à 0,0100 mol/L : tourne le bouton « constante de cellule » jusqu'à lire 1,410 mS/cm. Note la lecture.</li></ol>
      <h4>Partie B — Dosage de HCl</h4><ol><li>20,0 mL de HCl + 200 mL d'eau distillée, agitation, cellule immergée.</li><li>Mesure σ initiale, puis ajoute la soude par 0,5 mL (ou 1 mL), attends la stabilisation et note σ et V, jusqu'à environ 12 mL.</li><li>Trace σ corrigée = f(V) et lis V_E à l'intersection des droites.</li></ol>
      <h4>Partie C — Dosage de l'acide éthanoïque</h4><ol><li>Même protocole avec 20,0 mL d'acide éthanoïque.</li></ol>`,
    precautions: `<ul><li>Maintiens la température aussi constante que possible : σ augmente d'environ 2 % par degré.</li><li>Attends que la lecture soit stable avant de noter σ ; agite sans provoquer de projections.</li><li>Répartis les points de part et d'autre de l'équivalence pour bien tracer les deux droites.</li><li>Rince la cellule à l'eau distillée entre deux solutions.</li></ul>`,
    preparation: ["Écris les équations des deux réactions de dosage.", "Explique, avec les conductivités molaires ioniques, l'allure attendue de chaque courbe.", "Calcule V_E attendu pour 20,0 mL d'acide à 0,025 mol/L dosés par la soude à 0,100 mol/L.", "Pourquoi travaille-t-on dans un grand volume d'eau ?", "Pourquoi faut-il maintenir la température constante ?"],
    hint: "Vérifie le conductimètre (partie A), puis verse la soude par 0,5 mL et enregistre σ après chaque ajout.",
    controls: `<h3>Partie</h3>${seg("cdm", [["A", "A · étalonnage"], ["B", "B · HCl"], ["C", "C · CH₃COOH"]], "A")}
      ${burHTML("cd", "soude 0,100 mol/L", [["1", "+ 1 mL"], ["0.5", "+ 0,5 mL"], ["0.2", "+ 0,2 mL"], ["0.1", "+ 0,1 mL"]])}
      <div id="cdCal" hidden><h3>Étalonnage (cellule dans KCl 0,0100 mol/L)</h3>
      <div class="ctl"><label for="cdK">Bouton « constante de cellule » <b id="cdKv"></b></label><input id="cdK" type="range" min="0.85" max="1.15" step="0.0005" value="1"></div></div>
      ${lcd("cd", [["V", "Burette : V versé"], ["S", "Conductimètre"]])}
      <div class="row"><button type="button" class="btn primary sm" id="cdRec">Enregistrer</button></div>
      <button type="button" class="btn sm" id="cdNew">Changer de matériel</button>`,
    parts: [{ key: "A" }, { key: "B" }, { key: "C" }],
    questions: ["Pourquoi σ diminue-t-elle avant l'équivalence du dosage de HCl ?", "Pourquoi σ augmente-t-elle dès le début du dosage de l'acide éthanoïque ?", "Détermine V_E et la concentration de chaque acide.", "Compare les deux courbes et explique les différences.", "Pourquoi trace-t-on σ corrigée plutôt que σ ?"],
    init(T) {
      const mk = () => ({ ke: U(0.9, 1.1), ca: U(0.020, 0.030), cw: U(0.020, 0.030) });
      let P = params("ccond_par", mk, P => isFinite(P.ke) && isFinite(P.cw));
      const def = { m: "A", V: { B: 0, C: 0 }, kn: 1 };
      let st = state("ccond_st", def); const save = () => store.set("ccond_st", st);
      const B = mkBench("ccond-cv");
      const sig = () => st.m === "A" ? 1.41 : st.m === "B" ? cxSig(P.ca, 0, st.V.B) : cxSig(0, P.cw, st.V.C);
      const read = () => rnd(sig() * P.ke * st.kn * (1 + 0.0006 * Math.sin((st.m === "A" ? 3.1 : st.V[st.m] * 41.7 + (st.m === "B" ? 1 : 2)))), 3);
      const ui = () => {
        setSeg("cdm", st.m); $("#cdBur").hidden = st.m === "A"; $("#cdCal").hidden = st.m !== "A";
        $("#cdK").value = st.kn; $("#cdKv").textContent = fx(st.kn, 4);
        $("#cdV").textContent = st.m === "A" ? "—" : f2(st.V[st.m]) + " mL"; $("#cdS").textContent = fx(read(), 3) + " mS/cm";
        $("#cdRec").textContent = st.m === "A" ? "Noter la lecture dans KCl" : "Enregistrer le point (V ; σ)"; draw();
      };
      const draw = () => B.draw({
        V: st.m === "A" ? null : st.V[st.m], tit: "NaOH 0,100 mol/L", vessel: "becher", probe: "cond", stir: true, col: st.m === "A" ? "rgba(200,220,240,.55)" : EAU,
        cap: st.m === "A" ? "KCl 0,0100 mol/L" : (st.m === "B" ? "HCl" : "CH₃COOH") + " 20,0 mL + 200 mL d'eau",
        meter: { val: fx(read(), 3) + " mS/cm", sub: "constante de cellule × " + fx(st.kn, 4) },
        curve: st.m === "A" ? null : { lab: "σ = f(V) — partie " + st.m, xmax: 12, ymax: st.m === "B" ? 1.6 : 1.0, pts: T.rows[st.m].map(r => [r.V, r.s]), cur: st.V[st.m] }
      });
      T.draw = draw; T.tick = dt => { if (B.tick(dt)) draw(); };
      document.querySelectorAll("[data-cdm]").forEach(b => b.onclick = () => { st.m = b.dataset.cdm; save(); T.msg(""); ui(); });
      document.querySelectorAll("[data-cdv]").forEach(b => b.onclick = () => { if (addV(T, st.V, st.m, +b.getAttribute("data-cdv"), 20)) { save(); B.drop(); T.msg(""); ui(); } });
      $("#cdRaz").onclick = () => { st.V[st.m] = 0; save(); T.msg("Nouveau dosage : burette au zéro, nouvelle prise de 20,0 mL + 200 mL d'eau." + (T.rows[st.m].length ? " Supprime d'abord les lignes de cette partie (✕) si tu refais la courbe." : "")); ui(); };
      $("#cdK").addEventListener("input", () => { st.kn = +$("#cdK").value; save(); ui(); });
      $("#cdRec").onclick = () => {
        const m = st.m, L = read();
        if (m === "A") { if (Math.abs(L - 1.41) > 0.0025) { T.msg("Le conductimètre n'affiche pas 1,410 mS/cm : tourne le bouton « constante de cellule ».", "bad"); return; } T.add("A", { L }); T.msg("Étalonnage noté.", "ok"); return; }
        const R = T.rows[m], V = st.V[m];
        if (R.length && V <= R[R.length - 1].V + 1e-9) { T.msg("Tu as déjà un point à ce volume (ou à un volume plus grand) : verse de la soude avant d'enregistrer.", "bad"); return; }
        T.add(m, { V, s: L }); T.msg(`Point enregistré (partie ${m}).`, "ok"); draw();
      };
      $("#cdNew").onclick = () => { if (lockedMsg(T)) return; P = mk(); store.set("ccond_par", P); st = JSON.parse(JSON.stringify(def)); save(); T.clearRows(); ui(); T.msg("Nouveau matériel : refais l'étalonnage et les mesures."); };
      ui();
    }
  });

  /* ======================================================================
     TP C6 : PRODUIT DE SOLUBILITÉ — DOSAGE DE Ca(OH)₂ PAR HCl ET EFFET D'ION COMMUN
     ====================================================================== */
  register({
    id: "cksp", num: 37, lab: "C6", disc: "Chimie", court: "Produit de solubilité",
    titre: "Produit de solubilité : dosage de Ca(OH)₂ par HCl en l'absence et en présence de CaCl₂",
    objectifs: "écrire l'équilibre de dissolution d'un solide peu soluble, définir la solubilité et le produit de solubilité, doser les ions HO⁻ d'une solution saturée de Ca(OH)₂ par HCl, calculer s et Ks, puis étudier l'effet de l'ion commun Ca²⁺ apporté par CaCl₂.",
    materiel: ["Hydroxyde de calcium Ca(OH)₂ solide (M = 74,09 g/mol)", "Eau distillée et solution de CaCl₂ à C₀ = 0,100 mol/L", "Burette de 50 mL remplie de HCl à 0,0500 mol/L", "Pipette jaugée de 10,0 mL, erlenmeyers, phénolphtaléine", "Entonnoir et papier filtre, thermomètre"],
    theorie: `<div class="formula">Ca(OH)₂(s) ⇌ Ca²⁺(aq) + 2 HO⁻(aq)        Ks = a(Ca²⁺) · a(HO⁻)² ≈ [Ca²⁺][HO⁻]²</div>
      <h4>Dans l'eau pure</h4><p>Si s est la solubilité molaire : [Ca²⁺] = s et [HO⁻] = 2s, donc <b>Ks ≈ 4 s³</b>.</p>
      <p>Le dosage d'un volume V_s de filtrat par HCl (C_a) donne n(HO⁻) = C_a V_E, d'où <b>[HO⁻] = C_a V_E / V_s</b> et s = [HO⁻]/2.</p>
      <h4>En présence de CaCl₂ (effet d'ion commun)</h4><p>CaCl₂ → Ca²⁺ + 2 Cl⁻ apporte déjà des ions Ca²⁺ (C₀) : l'équilibre est déplacé vers le solide et la solubilité diminue. Si s₂ est la quantité de Ca(OH)₂ dissoute :</p>
      <div class="formula">[Ca²⁺] = C₀ + s₂        [HO⁻] = 2 s₂        Ks ≈ (C₀ + s₂)(2 s₂)²</div>
      <p>Ces expressions supposent des solutions idéales : en présence de beaucoup d'ions, les activités s'écartent des concentrations. La solubilité de Ca(OH)₂ <b>diminue quand la température augmente</b>.</p>`,
    protocole: `<h4>Partie A — Solution saturée dans l'eau</h4><ol><li>Agite un excès de Ca(OH)₂ dans 100 mL d'eau distillée, à température constante, puis laisse l'équilibre s'établir.</li><li><b>Filtre</b> pour obtenir une solution limpide. Note la température.</li>
        <li>10,0 mL du filtrat + 20 mL d'eau + phénolphtaléine (rose) ; titre par HCl jusqu'à la décoloration. Répète sur des prélèvements indépendants.</li></ol>
      <h4>Partie B — Effet de CaCl₂</h4><ol><li>Même préparation avec 100 mL de CaCl₂ à 0,100 mol/L au lieu de l'eau, puis même dosage (au moins deux essais).</li></ol>`,
    precautions: `<ul><li>Le filtrat doit être <b>limpide</b> : du solide en suspension se dissoudrait pendant le dosage et fausserait V_E.</li><li>Protège le filtrat du CO₂ de l'air, qui forme du carbonate de calcium.</li><li>Note la température : la solubilité en dépend.</li><li>Dans CaCl₂, le volume équivalent est petit : verse goutte à goutte.</li></ul>`,
    preparation: ["Écris l'équation de dissolution de Ca(OH)₂ et l'expression de Ks.", "Montre que Ks ≈ 4s³ dans l'eau pure.", "Calcule V_E attendu si s = 0,020 mol/L (10,0 mL dosés par HCl à 0,0500 mol/L).", "Pourquoi filtre-t-on la suspension avant le dosage ?", "Explique l'effet de l'ion commun Ca²⁺."],
    hint: "Prépare la solution saturée (agiter, puis filtrer), puis dose 10,0 mL du filtrat par HCl jusqu'à la décoloration.",
    controls: `<h3>Solvant</h3>${seg("ckm", [["A", "A · eau distillée"], ["B", "B · CaCl₂ 0,100 mol/L"]], "A")}
      <h3>Préparation</h3><div class="row"><button type="button" class="btn sm" id="ckAg">Agiter, laisser l'équilibre s'établir</button><button type="button" class="btn sm" id="ckFi">Filtrer</button></div>
      ${burHTML("ck", "HCl 0,0500 mol/L")}
      ${lcd("ck", [["P", "Préparation"], ["T", "Thermomètre"], ["V", "Burette : V versé"], ["C", "Teinte"]])}
      <div class="row"><button type="button" class="btn primary sm" id="ckRec">Noter V_E (décoloration)</button></div>
      <button type="button" class="btn sm" id="ckNew">Changer de matériel</button>`,
    parts: [{ key: "A" }, { key: "B" }],
    questions: ["Calcule [HO⁻], s et Ks dans l'eau pure.", "Calcule s₂ et Ks dans la solution de CaCl₂.", "Compare les deux solubilités et conclus sur l'effet d'ion commun.", "Pourquoi le produit de solubilité ne doit-il pas être calculé avec la seule concentration totale en calcium sans distinguer ses origines ?", "Discute l'influence de la température, du CO₂ et des activités ioniques."],
    init(T) {
      const mk = () => ({ T: rnd(U(24, 32), 1) });
      let P = params("cksp_par", mk, P => isFinite(P.T));
      const def = { m: "A", V: { A: 0, B: 0 }, prep: { A: 0, B: 0 }, fin: { A: false, B: false } };
      let st = state("cksp_st", def); const save = () => store.set("cksp_st", st);
      const B = mkBench("cksp-cv");
      const cOH = m => 2 * (m === "A" ? cxS1(P.T) : cxS2(P.T)) * (st.prep[m] === 2 ? 1 : 1.15);
      const pH = () => cxKspPH(cOH(st.m), st.V[st.m]);
      const ui = () => {
        setSeg("ckm", st.m); const m = st.m, p = st.prep[m], c = phenCol(pH());
        $("#ckP").textContent = ["à faire", "agitée, non filtrée", "filtrée (limpide)"][p]; $("#ckT").textContent = fx(P.T, 1) + " °C";
        $("#ckV").textContent = f2(st.V[m]) + " mL"; $("#ckC").textContent = p ? (c ? "rose" : "incolore") : "—"; draw();
      };
      const draw = () => { const m = st.m, p = st.prep[m], c = p ? phenCol(pH()) : null;
        B.draw({ V: p ? st.V[m] : null, tit: "HCl 0,0500 mol/L", vessel: p ? "erlen" : "becher", col: p ? (c || EAU) : (m === "A" ? EAU : "rgba(200,215,230,.5)"), turb: p === 1 ? 0.55 : 0,
          cap: p ? "10,0 mL de " + (p === 2 ? "filtrat" : "solution non filtrée") + " + 20 mL d'eau" : (m === "A" ? "100 mL d'eau" : "100 mL de CaCl₂") + " + Ca(OH)₂ en excès",
          side: [["Préparation : " + ["agiter, puis filtrer", "agitée — trouble (non filtrée)", "filtrée — limpide"][p], p === 1 ? "#c0392b" : null, true], ["Température : " + fx(P.T, 1) + " °C"], ["Teinte : " + (p ? (c ? "rose" : "incolore") : "—")], ["Volumes notés : " + (T.rows[m].map(r => f2(r.V)).join(" ; ") || "aucun")], ...(st.fin[m] ? [["Dosage terminé : « Nouveau dosage » pour l'essai suivant.", css("--accent")]] : [])],
          custom: p ? null : G => { const { c: cc, bx, bw, vy1 } = G; cc.fillStyle = "rgba(240,240,240,.95)"; cc.fillRect(bx - bw * 0.18, vy1 - 8, bw * 0.36, 6); } }); };
      T.draw = draw; T.tick = dt => { if (B.tick(dt)) draw(); };
      document.querySelectorAll("[data-ckm]").forEach(b => b.onclick = () => { st.m = b.dataset.ckm; save(); T.msg(""); ui(); });
      $("#ckAg").onclick = () => { st.prep[st.m] = Math.max(st.prep[st.m], 1); save(); T.msg("Mélange agité puis laissé au repos : la solution est saturée, mais encore trouble."); ui(); };
      $("#ckFi").onclick = () => { if (!st.prep[st.m]) { T.msg("Agite d'abord le solide avec le solvant.", "bad"); return; } st.prep[st.m] = 2; save(); T.msg("Filtration terminée : le filtrat est limpide.", "ok"); ui(); };
      document.querySelectorAll("[data-ckv]").forEach(b => b.onclick = () => {
        const m = st.m; if (!st.prep[m]) { T.msg("Prépare d'abord la solution saturée (agiter, puis filtrer).", "bad"); return; }
        if (st.fin[m]) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        const was = !phenCol(pH()); if (!addV(T, st.V, m, +b.getAttribute("data-ckv"))) return; save(); B.drop();
        T.msg(!was && !phenCol(pH()) ? "La solution se décolore." : "", "ok"); ui();
      });
      $("#ckRaz").onclick = () => { st.V[st.m] = 0; st.fin[st.m] = false; save(); T.msg("Nouvelle prise : 10,0 mL de la solution + 20 mL d'eau + phénolphtaléine ; burette au zéro."); ui(); };
      $("#ckRec").onclick = () => {
        const m = st.m; if (!st.prep[m]) { T.msg("Prépare d'abord la solution saturée.", "bad"); return; }
        if (st.fin[m]) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        if (phenCol(pH())) { T.msg("La solution est encore rose : l'équivalence n'est pas atteinte.", "bad"); return; }
        const n = T.rows[m].length; T.add(m, { T: P.T, Vs: 10, V: st.V[m] }); if (T.rows[m].length > n) { st.fin[m] = true; save(); T.msg(`V_E = ${f2(st.V[m])} mL noté.`, "ok"); } ui();
      };
      $("#ckNew").onclick = () => { if (lockedMsg(T)) return; P = mk(); store.set("cksp_par", P); st = JSON.parse(JSON.stringify(def)); save(); T.clearRows(); ui(); T.msg("Nouveau matériel (autre température de la salle) : refais les mesures."); };
      ui();
    }
  });

  /* ======================================================================
     TP C7 : CHLOROMÉTRIE — DOSAGE IODOMÉTRIQUE (INDIRECT) DE L'EAU DE JAVEL
     A : dilution au 1/10 ; B : ClO⁻ + I⁻ en excès en milieu acide → I₂, dosé par le thiosulfate (amidon)
     ====================================================================== */
  register({
    id: "cjavel", num: 38, lab: "C7", disc: "Chimie", court: "Chlorométrie (eau de Javel)",
    titre: "Chlorométrie : dosage iodométrique de l'eau de Javel",
    objectifs: "comprendre un dosage indirect, écrire les réactions d'oxydoréduction, comprendre le rôle des ions iodure et de l'amidon, déterminer la concentration en ions hypochlorite à partir du volume équivalent, appliquer un facteur de dilution et calculer le titre chlorométrique.",
    materiel: ["Eau de Javel commerciale", "Pipette jaugée de 10,0 mL, fiole jaugée de 100,0 mL, eau distillée", "Iodure de potassium KI (solution à 10 %, en excès)", "Acide éthanoïque à 3 mol/L (acidification, sous la hotte)", "Burette de 50 mL remplie de thiosulfate de sodium Na₂S₂O₃ à 0,1000 mol/L", "Empois d'amidon, erlenmeyer, hotte aspirante"],
    theorie: `<p>L'ion hypochlorite oxyde les ions iodure en milieu acide ; le diiode libéré est ensuite dosé par le thiosulfate : c'est un <b>dosage indirect</b>.</p>
      <div class="formula">ClO⁻ + 2 I⁻ + 2 H⁺ → I₂ + Cl⁻ + H₂O
I₂ + 2 S₂O₃²⁻ → 2 I⁻ + S₄O₆²⁻</div>
      <p>D'où <b>n(ClO⁻) = n(I₂) = n(S₂O₃²⁻) / 2</b> et, pour la solution diluée : <b>C(ClO⁻) = C(S₂O₃²⁻) × V_E / (2 V_échantillon)</b>. On multiplie par le facteur de dilution pour l'eau de Javel commerciale.</p>
      <h4>Rôle de l'amidon</h4><p>Le diiode colore la solution en brun puis en jaune pâle. L'empois d'amidon forme avec I₂ un complexe <b>bleu foncé</b> très visible : on l'ajoute quand la solution est <b>jaune pâle</b>, puis on verse le thiosulfate jusqu'à la disparition de la couleur bleue. Ajouté trop tôt, l'amidon retient le diiode et l'équivalence est dépassée.</p>
      <h4>Titre chlorométrique</h4><p>C'est le volume de dichlore (en litres, à 0 °C et 1 atm) que peut libérer 1 L d'eau de Javel selon ClO⁻ + Cl⁻ + 2 H⁺ → Cl₂ + H₂O : n(Cl₂) = n(ClO⁻), donc <b>°chl = 22,4 × C(ClO⁻)</b>. La teneur en chlore actif vaut 70,9 × C(ClO⁻) en g/L.</p>`,
    protocole: `<h4>Partie A — Dilution</h4><ol><li>Prélève 10,0 mL d'eau de Javel à la pipette jaugée, verse dans la fiole de 100,0 mL, complète au trait, bouche et homogénéise. Note la dilution.</li></ol>
      <h4>Partie B — Dosage</h4><ol><li>Prélève 10,0 mL de la solution diluée dans un erlenmeyer, ajoute un excès d'iodure de potassium.</li><li><b>Sous la hotte en marche</b>, acidifie avec l'acide éthanoïque : la solution devient brune (I₂).</li>
        <li>Dose immédiatement par le thiosulfate. Quand la solution est jaune pâle, ajoute quelques gouttes d'amidon (bleu foncé).</li><li>Continue goutte à goutte jusqu'à la disparition persistante de la couleur bleue. Note V_E. Répète le dosage.</li></ol>`,
    precautions: `<ul><li><b>Danger</b> : l'acidification de l'eau de Javel peut libérer du dichlore, gaz toxique. Elle ne se fait que selon la procédure validée, sous hotte, par des personnes formées. Aucun mélange improvisé d'eau de Javel et d'acide.</li><li>L'iodure doit être en excès pour que tout l'hypochlorite réagisse.</li><li>Dose immédiatement : le diiode est volatil et l'iodure s'oxyde à l'air.</li><li>N'ajoute l'amidon qu'à la teinte jaune pâle.</li></ul>`,
    preparation: ["Pourquoi le dosage de l'hypochlorite est-il indirect ?", "Établis n(ClO⁻) = n(S₂O₃²⁻) / 2 à partir des deux équations.", "Quel est le rôle des ions iodure ? Et de l'amidon ?", "Calcule V_E attendu pour une eau de Javel à 0,38 mol/L diluée 10 fois (10,0 mL dosés, thiosulfate à 0,1000 mol/L).", "Quelle différence y a-t-il entre la concentration en hypochlorite et le titre chlorométrique ?"],
    hint: "Dilue d'abord l'eau de Javel (A). Puis : iodure, acidification sous la hotte, thiosulfate, amidon au jaune pâle, et goutte à goutte jusqu'à la disparition du bleu.",
    controls: `<h3>Étape</h3>${seg("cjm", [["A", "A · dilution"], ["B", "B · dosage"]], "A")}
      <div id="cjDil"><h3>Dilution</h3><div class="row"><button type="button" class="btn sm" id="cjPi">Prélever 10,0 mL et verser dans la fiole</button></div>
      <div class="ctl"><label for="cjF">Compléter avec de l'eau <b id="cjFv"></b></label><input id="cjF" type="range" min="10" max="101" step="0.05" value="10"></div>
      <div class="row"><button type="button" class="btn sm" id="cjHo">Boucher et homogénéiser</button><button type="button" class="btn sm" id="cjRe">Recommencer la dilution</button></div></div>
      <div id="cjPr" hidden><h3>Prise d'essai</h3><label class="radio"><input type="checkbox" id="cjHot"> Hotte aspirante en marche</label>
        <div class="row"><button type="button" class="btn sm" id="cjKI">Ajouter KI en excès</button><button type="button" class="btn sm" id="cjAc">Acidifier (acide éthanoïque)</button><button type="button" class="btn sm" id="cjAm">Ajouter l'amidon</button></div></div>
      ${burHTML("cj", "thiosulfate 0,1000 mol/L")}
      ${lcd("cj", [["V", "Burette : V versé"], ["C", "Teinte"]])}
      <div class="row"><button type="button" class="btn primary sm" id="cjRec">Noter</button></div>
      <button type="button" class="btn sm" id="cjNew">Changer de matériel</button>`,
    parts: [{ key: "A" }, { key: "B" }],
    questions: ["Écris les deux équations et la relation entre n(ClO⁻) et n(S₂O₃²⁻).", "Calcule C(ClO⁻) dans la solution diluée, puis dans l'eau de Javel commerciale.", "Calcule le titre chlorométrique et la teneur en chlore actif.", "Pourquoi faut-il doser sans attendre ?", "Pourquoi ne doit-on jamais mélanger l'eau de Javel et un acide hors d'un protocole validé ?"],
    init(T) {
      const mk = () => ({ cj: U(0.34, 0.42), ct: 0.1 });
      let P = params("cjavel_par", mk, P => isFinite(P.cj));
      const def = { m: "A", d: { pi: false, Vf: 10, hom: false, ok: false }, V: { B: 0 }, b: { ki: 0, ac: 0, am: 0, tot: 0 }, fin: false, hot: false };
      let st = state("cjavel_st", def); const save = () => store.set("cjavel_st", st);
      const B = mkBench("cjavel-cv");
      const Vf = () => st.d.Vf, E0 = () => cxJavEnd(P, Vf(), 0), E = () => cxJavEnd(P, Vf(), st.b.tot);
      const ready = () => st.b.ki && st.b.ac;
      const iod = () => ready() ? Math.max(0, 1 - st.V.B / E0()) : 0;          // fraction de I₂ restant
      const blue = () => st.b.am && ready() && st.V.B < E() - 1e-9;
      const teinte = () => !ready() ? (st.b.ki ? "incolore (milieu non acidifié)" : "incolore") : blue() ? "bleu foncé" : st.b.am ? "incolore" : iod() > 0.5 ? "brune" : iod() > 0.15 ? "jaune" : iod() > 0.001 ? "jaune pâle" : "incolore";
      const col = () => { if (!ready()) return EAU; if (blue()) return `rgba(25,35,110,${(0.35 + 0.5 * Math.min(1, iod() * 8 + 0.2)).toFixed(3)})`; const f = iod(); return f > 0 && !st.b.am ? `rgba(${Math.round(150 + 90 * (1 - f))},${Math.round(80 + 140 * (1 - f))},${Math.round(20 + 40 * (1 - f))},${(0.25 + 0.6 * f).toFixed(3)})` : EAU; };
      const ui = () => {
        setSeg("cjm", st.m); const m = st.m; $("#cjDil").hidden = m !== "A"; $("#cjBur").hidden = m !== "B"; $("#cjPr").hidden = m !== "B"; $("#cjHot").checked = st.hot;
        $("#cjF").value = Vf(); $("#cjFv").textContent = st.d.pi ? meni(Vf(), 100) : "—";
        $("#cjVt").textContent = m === "A" ? "Fiole jaugée" : "Burette : V versé"; $("#cjV").textContent = m === "A" ? (st.d.pi ? "ménisque " + meni(Vf(), 100) : "vide") : f2(st.V.B) + " mL";
        $("#cjC").textContent = m === "A" ? (st.d.hom ? "homogénéisée" : st.d.pi ? "non homogénéisée" : "—") : teinte();
        $("#cjRec").textContent = m === "A" ? "Noter la dilution" : "Noter V_E (disparition du bleu)"; draw();
      };
      const draw = () => { const m = st.m;
        if (m === "A") { B.draw({ V: null, side: [["Dilution : " + (st.d.ok ? "notée" : st.d.hom ? "prête à noter" : st.d.pi ? "complète au trait puis homogénéise" : "prélève 10,0 mL d'eau de Javel"), null, true], ["Ménisque : " + (st.d.pi ? meni(Vf(), 100) : "—"), Vf() > 100.05 ? "#c0392b" : null]],
          custom: G => flask(G, 100, st.d.pi ? Vf() : 0, st.d.hom) }); return; }
        B.draw({ V: st.V.B, tit: "S₂O₃²⁻ 0,1000 mol/L", vessel: "erlen", stir: true, col: col(), cap: "10,0 mL de solution diluée" + (st.b.ki ? " + KI" : "") + (st.b.ac ? " + acide" : "") + (st.b.am ? " + amidon" : ""),
          custom: G => { if (st.hot) { const { c, bw, H0 } = G; c.strokeStyle = "#78909c"; c.lineWidth = 3; c.beginPath(); c.moveTo(bw * 0.02, H0 * 0.04); c.lineTo(bw * 0.98, H0 * 0.04); c.stroke(); txt(c, "hotte en marche", bw * 0.98, H0 * 0.03, "#78909c", "right", "alphabetic", "11px 'Fira Sans',Arial"); } },
          side: [["Teinte : " + teinte(), blue() ? "#1a237e" : null, true], ["KI : " + (st.b.ki ? "ajouté" : "non") + "   acide : " + (st.b.ac ? "ajouté" : "non") + "   amidon : " + (st.b.am ? "ajouté" : "non")], ["Volumes notés : " + (T.rows.B.map(r => f2(r.V)).join(" ; ") || "aucun")], ...(st.fin ? [["Dosage terminé : « Nouveau dosage » pour l'essai suivant.", css("--accent")]] : [])] });
      };
      T.draw = draw; T.tick = dt => { if (B.tick(dt)) draw(); };
      document.querySelectorAll("[data-cjm]").forEach(b => b.onclick = () => { st.m = b.dataset.cjm; save(); T.msg(st.m === "B" && !T.rows.A.length ? "Prépare et note d'abord la solution diluée (étape A)." : ""); ui(); });
      $("#cjPi").onclick = () => { if (st.d.pi) { T.msg("Les 10,0 mL sont déjà dans la fiole. « Recommencer la dilution » pour une nouvelle fiole.", "bad"); return; } st.d = { pi: true, Vf: 10, hom: false, ok: false }; save(); T.msg("10,0 mL d'eau de Javel sont dans la fiole jaugée. Complète avec de l'eau jusqu'au trait.", "ok"); ui(); };
      $("#cjF").addEventListener("input", () => {
        if (!st.d.pi) { $("#cjF").value = 10; T.msg("Prélève d'abord 10,0 mL d'eau de Javel.", "bad"); return; }
        if (st.d.hom) { $("#cjF").value = st.d.Vf; T.msg("La fiole est bouchée et homogénéisée.", "bad"); return; }
        const v = +$("#cjF").value; if (v < st.d.Vf) { $("#cjF").value = st.d.Vf; T.msg("On ne peut pas retirer d'eau de la fiole.", "bad"); return; }
        st.d.Vf = v; save(); T.msg(v > 100.05 ? "Le ménisque a dépassé le trait de jauge : la dilution est à refaire." : "", v > 100.05 ? "bad" : ""); ui();
      });
      $("#cjHo").onclick = () => { if (!st.d.pi) { T.msg("Prélève d'abord 10,0 mL d'eau de Javel.", "bad"); return; } if (Math.abs(st.d.Vf - 100) > 0.05) { T.msg(st.d.Vf > 100 ? "Le trait est dépassé : recommence la dilution." : "Complète d'abord jusqu'au trait de jauge.", "bad"); return; } st.d.hom = true; save(); T.msg("Fiole bouchée et homogénéisée.", "ok"); ui(); };
      $("#cjRe").onclick = () => { st.d = { pi: false, Vf: 10, hom: false, ok: false }; save(); T.msg("Fiole rincée : recommence la dilution."); ui(); };
      $("#cjHot").addEventListener("change", () => { st.hot = $("#cjHot").checked; save(); draw(); });
      const okDil = () => { if (!st.d.ok) { T.msg("Prépare et note d'abord la solution diluée (étape A).", "bad"); return false; } return true; };
      $("#cjKI").onclick = () => { if (!okDil()) return; if (st.b.ki) { T.msg("L'iodure est déjà ajouté.", "bad"); return; } st.b.ki = 1; save(); T.msg("Iodure de potassium ajouté en excès.", "ok"); ui(); };
      $("#cjAc").onclick = () => {
        if (!okDil()) return; if (!st.b.ki) { T.msg("Ajoute d'abord l'iodure de potassium.", "bad"); return; } if (st.b.ac) { T.msg("Le milieu est déjà acidifié.", "bad"); return; }
        if (!st.hot) { T.msg("Interdit : l'acidification de l'eau de Javel peut libérer du dichlore toxique. Mets d'abord la hotte en marche et travaille dessous.", "bad"); return; }
        st.b.ac = 1; save(); T.msg("Milieu acidifié sous la hotte : le diiode libéré colore la solution en brun. Dose sans attendre.", "ok"); ui();
      };
      $("#cjAm").onclick = () => {
        if (!ready()) { T.msg("Ajoute d'abord l'iodure et acidifie : il n'y a pas encore de diiode.", "bad"); return; } if (st.b.am) { T.msg("L'amidon est déjà ajouté.", "bad"); return; }
        st.b.am = 1; st.b.tot = iod() > 0.25 ? 1 : 0; save(); T.msg(st.b.tot ? "Amidon ajouté alors que la solution est encore brune ou jaune : il retient le diiode, l'équivalence sera difficile à repérer." : "Amidon ajouté au jaune pâle : la solution devient bleu foncé.", st.b.tot ? "bad" : "ok"); ui();
      };
      document.querySelectorAll("[data-cjv]").forEach(b => b.onclick = () => {
        if (!okDil()) return; if (!ready()) { T.msg("Ajoute l'iodure puis acidifie (sous la hotte) avant de verser le thiosulfate.", "bad"); return; }
        if (st.fin) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        const was = blue(); if (!addV(T, st.V, "B", +b.getAttribute("data-cjv"))) return; save(); B.drop();
        T.msg(was && !blue() ? "La couleur bleue disparaît et ne revient pas." : !st.b.am && iod() < 0.15 && iod() > 0 ? "La solution est jaune pâle : c'est le moment d'ajouter l'amidon." : !st.b.am && iod() === 0 ? "La solution est incolore : sans amidon, la fin du dosage est difficile à repérer." : "", "ok"); ui();
      });
      $("#cjRaz").onclick = () => { st.V.B = 0; st.fin = false; st.b = { ki: 0, ac: 0, am: 0, tot: 0 }; save(); T.msg("Nouvelle prise : 10,0 mL de solution diluée dans un erlenmeyer ; burette remplie et ajustée au zéro."); ui(); };
      $("#cjRec").onclick = () => {
        if (st.m === "A") {
          if (!st.d.hom) { T.msg("Complète au trait, puis bouche et homogénéise la fiole avant de noter la dilution.", "bad"); return; }
          if (st.d.ok) { T.msg("Cette dilution est déjà notée.", "bad"); return; }
          const n = T.rows.A.length; T.add("A", { Vp: 10, Vf: rnd(st.d.Vf, 2) }); if (T.rows.A.length > n) { st.d.ok = true; save(); T.msg("Dilution notée : 10,0 mL → 100,0 mL.", "ok"); } ui(); return;
        }
        if (st.fin) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        if (!st.b.am) { T.msg("Ajoute l'amidon (au jaune pâle) pour repérer précisément l'équivalence.", "bad"); return; }
        if (blue()) { T.msg("La solution est encore bleue : l'équivalence n'est pas atteinte.", "bad"); return; }
        const n = T.rows.B.length; T.add("B", { V: st.V.B, tot: st.b.tot }); if (T.rows.B.length > n) { st.fin = true; save(); T.msg(`V_E = ${f2(st.V.B)} mL noté.`, "ok"); } ui();
      };
      $("#cjNew").onclick = () => { if (lockedMsg(T)) return; P = mk(); store.set("cjavel_par", P); st = JSON.parse(JSON.stringify(def)); save(); T.clearRows(); ui(); T.msg("Nouvelle eau de Javel : refais la dilution et les dosages."); };
      ui();
    }
  });

  /* ======================================================================
     TP C8 : MANGANIMÉTRIE I — DOSAGE DE L'EAU OXYGÉNÉE
     ====================================================================== */
  const MNO4 = "rgba(150,40,140,.85)";
  const pinkMn = x => `rgba(200,60,160,${Math.min(0.85, 0.3 + x * 0.6).toFixed(3)})`;
  register({
    id: "ch2o2", num: 39, lab: "C8", disc: "Chimie", court: "Manganimétrie I (H₂O₂)",
    titre: "Manganimétrie I : dosage de l'eau oxygénée par le permanganate de potassium",
    objectifs: "comprendre le rôle du milieu acide dans une réaction d'oxydoréduction, équilibrer une équation rédox, réaliser un dosage manganimétrique, déterminer la concentration en H₂O₂ d'une eau oxygénée et calculer son titre volumique.",
    materiel: ["Eau oxygénée commerciale « 10 volumes »", "Burette de 50 mL remplie de KMnO₄ (concentration indiquée sur le flacon, environ 0,02 mol/L)", "Acide sulfurique dilué (1 mol/L)", "Pipette jaugée de 10,0 mL, fiole jaugée de 100,0 mL, eau distillée, erlenmeyer"],
    theorie: `<p>En milieu acide, l'ion permanganate MnO₄⁻ (violet) oxyde le peroxyde d'hydrogène ; il est réduit en Mn²⁺, presque incolore :</p>
      <div class="formula">2 MnO₄⁻ + 5 H₂O₂ + 6 H⁺ → 2 Mn²⁺ + 5 O₂ + 8 H₂O</div>
      <p>À l'équivalence : <b>n(H₂O₂) = (5/2) n(MnO₄⁻)</b>, d'où <b>C(H₂O₂) = 5 C(MnO₄⁻) V_E / [2 V(H₂O₂)]</b>.</p>
      <p>La première goutte de permanganate en excès colore la solution en <b>rose pâle persistant</b> : le permanganate est son propre indicateur (auto-indicateur). Le milieu doit être fortement acide (H₂SO₄) pour que MnO₄⁻ soit réduit en Mn²⁺ (et non en MnO₂ brun).</p>
      <h4>Titre volumique</h4><p>Volume de dioxygène (L, à 0 °C et 1 atm, V_m = 22,4 L/mol) libéré par 1 L de solution selon 2 H₂O₂ → 2 H₂O + O₂ : <b>titre = C(H₂O₂) × V_m / 2 = 11,2 × C(H₂O₂)</b>. Une eau oxygénée « 10 volumes » contient environ 0,89 mol/L de H₂O₂ : on la dilue 10 fois avant le dosage.</p>`,
    protocole: `<h4>Partie A — Dilution au 1/10</h4><ol><li>Prélève 10,0 mL d'eau oxygénée à la pipette jaugée, verse dans la fiole de 100,0 mL, complète au trait, bouche et homogénéise. Note la dilution.</li></ol>
      <h4>Partie B — Dosage</h4><ol><li>Prélève 10,0 mL de solution diluée, ajoute 10 mL d'acide sulfurique (milieu acide).</li><li>Titre par le permanganate sous agitation ; près de l'équivalence, goutte à goutte.</li><li>Arrête à la première coloration rose pâle persistante. Note V_E. Répète le dosage.</li></ol>`,
    precautions: `<ul><li>Le permanganate est un oxydant puissant : gants et lunettes.</li><li>N'oublie pas l'acide : sans lui, il se forme un précipité brun de MnO₂ et le dosage est faux.</li><li>Lis la burette au haut du ménisque (solution très foncée).</li><li>L'eau oxygénée se décompose à la lumière et à la chaleur : flacon opaque et au frais.</li></ul>`,
    preparation: ["Écris les demi-équations des couples MnO₄⁻/Mn²⁺ et O₂/H₂O₂ et équilibre l'équation de dosage.", "Pourquoi le milieu doit-il être acide ?", "Pourquoi le permanganate joue-t-il le rôle d'auto-indicateur ?", "Que signifie une eau oxygénée à 10 volumes ? Calcule sa concentration.", "Calcule V_E attendu pour 10,0 mL de la solution diluée et KMnO₄ à 0,0200 mol/L."],
    hint: "Fais d'abord la dilution (A), puis dose 10,0 mL de la solution diluée, acidifiée, par KMnO₄ jusqu'au rose pâle persistant.",
    controls: `<h3>Étape</h3>${seg("hym", [["A", "A · dilution"], ["B", "B · dosage"]], "A")}
      <div id="hyDil"><h3>Dilution</h3><div class="row"><button type="button" class="btn sm" id="hyPi">Prélever 10,0 mL et verser dans la fiole</button></div>
      <div class="ctl"><label for="hyF">Compléter avec de l'eau <b id="hyFv"></b></label><input id="hyF" type="range" min="10" max="101" step="0.05" value="10"></div>
      <div class="row"><button type="button" class="btn sm" id="hyHo">Boucher et homogénéiser</button><button type="button" class="btn sm" id="hyRe">Recommencer la dilution</button></div></div>
      <div id="hyPr" hidden><div class="row"><button type="button" class="btn sm" id="hyAc">Ajouter 10 mL de H₂SO₄</button></div></div>
      ${burHTML("hy", "KMnO₄")}
      ${lcd("hy", [["V", "Burette : V versé"], ["C", "État"], ["K", "Flacon de KMnO₄"]])}
      <div class="row"><button type="button" class="btn primary sm" id="hyRec">Noter</button></div>
      <button type="button" class="btn sm" id="hyNew">Changer de matériel</button>`,
    parts: [{ key: "A" }, { key: "B" }],
    questions: ["Équilibre la réaction de dosage.", "Calcule la concentration de la solution diluée, puis celle de l'eau oxygénée commerciale.", "Calcule le titre volumique et compare à l'étiquette.", "Pourquoi le milieu doit-il être acide ?", "Cite deux causes possibles d'une sous-estimation de la concentration."],
    init(T) {
      const mk = () => { const c = U(0.018, 0.022); return { c, cL: +c.toPrecision(4), tv: U(8.8, 10.0) }; };
      let P = params("ch2o2_par", mk, P => isFinite(P.c));
      const def = { m: "A", d: { pi: false, Vf: 10, hom: false, ok: false }, V: { B: 0 }, ac: 0, fin: false };
      let st = state("ch2o2_st", def); const save = () => store.set("ch2o2_st", st);
      const B = mkBench("ch2o2-cv");
      const Vf = () => st.d.Vf, E = () => cxH2End(P, Vf()), pink = () => st.ac && st.V.B >= E() - 1e-9, brown = () => !st.ac && st.V.B > 0;
      const ui = () => {
        setSeg("hym", st.m); const m = st.m; $("#hyDil").hidden = m !== "A"; $("#hyBur").hidden = m !== "B"; $("#hyPr").hidden = m !== "B";
        $("#hyF").value = Vf(); $("#hyFv").textContent = st.d.pi ? meni(Vf(), 100) : "—";
        $("#hyVt").textContent = m === "A" ? "Fiole jaugée" : "Burette : V versé"; $("#hyV").textContent = m === "A" ? (st.d.pi ? "ménisque " + meni(Vf(), 100) : "vide") : f2(st.V.B) + " mL";
        $("#hyC").textContent = m === "A" ? (st.d.hom ? "homogénéisée" : st.d.pi ? "non homogénéisée" : "—") : brown() ? "précipité brun (MnO₂)" : pink() ? "rose pâle persistant" : "incolore";
        $("#hyK").textContent = fx(P.cL, 4) + " mol/L";
        $("#hyRec").textContent = m === "A" ? "Noter la dilution" : "Noter V_E (rose persistant)"; draw();
      };
      const draw = () => { const m = st.m;
        if (m === "A") { B.draw({ V: null, side: [["Dilution : " + (st.d.ok ? "notée" : st.d.hom ? "prête à noter" : st.d.pi ? "complète au trait puis homogénéise" : "prélève 10,0 mL d'eau oxygénée"), null, true], ["Ménisque : " + (st.d.pi ? meni(Vf(), 100) : "—"), Vf() > 100.05 ? "#c0392b" : null]],
          custom: G => flask(G, 100, st.d.pi ? Vf() : 0, st.d.hom) }); return; }
        const V = st.V.B, p = pink();
        B.draw({ V, tit: "KMnO₄ " + fx(P.cL, 4) + " mol/L", burCol: MNO4, dropCol: "rgba(150,40,140,.95)", vessel: "erlen", stir: true, col: brown() ? "rgba(120,80,40,.55)" : p ? pinkMn(V - E()) : B.flash > 0.05 ? `rgba(200,60,160,${(0.45 * B.flash).toFixed(3)})` : EAU, turb: brown() ? 0.2 : 0,
          cap: "solution diluée 10,0 mL" + (st.ac ? " + H₂SO₄" : ""),
          custom: G => { if (V > 0 && !p && st.ac) { const { c, bx, vy1, bw } = G; c.fillStyle = "rgba(255,255,255,.85)"; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(bx + Math.sin(i * 2.3 + V) * bw * 0.15, vy1 - 8 - ((i * 13 + V * 40) % 40), 2.2, 0, 7); c.fill(); } } },
          side: [["Teinte : " + (brown() ? "brune (MnO₂) : milieu non acidifié !" : p ? "rose pâle persistante" : B.flash > 0.05 ? "rose qui disparaît (dégagement de O₂)" : "incolore"), brown() ? "#c0392b" : p ? "#a0287f" : null, true], ["Volumes notés : " + (T.rows.B.map(q => f2(q.V)).join(" ; ") || "aucun")], ...(st.fin ? [["Dosage terminé : « Nouveau dosage » pour l'essai suivant.", css("--accent")]] : [])] });
      };
      T.draw = draw; T.tick = dt => { if (B.tick(dt)) draw(); };
      document.querySelectorAll("[data-hym]").forEach(b => b.onclick = () => { st.m = b.dataset.hym; save(); T.msg(""); ui(); });
      $("#hyPi").onclick = () => { if (st.d.pi) { T.msg("Les 10,0 mL sont déjà dans la fiole. « Recommencer la dilution » pour une nouvelle fiole.", "bad"); return; } st.d = { pi: true, Vf: 10, hom: false, ok: false }; save(); T.msg("10,0 mL d'eau oxygénée sont dans la fiole jaugée. Complète avec de l'eau jusqu'au trait.", "ok"); ui(); };
      $("#hyF").addEventListener("input", () => {
        if (!st.d.pi) { $("#hyF").value = 10; T.msg("Prélève d'abord 10,0 mL d'eau oxygénée.", "bad"); return; }
        if (st.d.hom) { $("#hyF").value = st.d.Vf; T.msg("La fiole est bouchée et homogénéisée.", "bad"); return; }
        const v = +$("#hyF").value; if (v < st.d.Vf) { $("#hyF").value = st.d.Vf; T.msg("On ne peut pas retirer d'eau de la fiole.", "bad"); return; }
        st.d.Vf = v; save(); T.msg(v > 100.05 ? "Le ménisque a dépassé le trait de jauge : la dilution est à refaire." : "", v > 100.05 ? "bad" : ""); ui();
      });
      $("#hyHo").onclick = () => { if (!st.d.pi) { T.msg("Prélève d'abord 10,0 mL d'eau oxygénée.", "bad"); return; } if (Math.abs(st.d.Vf - 100) > 0.05) { T.msg(st.d.Vf > 100 ? "Le trait est dépassé : recommence la dilution." : "Complète d'abord jusqu'au trait de jauge.", "bad"); return; } st.d.hom = true; save(); T.msg("Fiole bouchée et homogénéisée.", "ok"); ui(); };
      $("#hyRe").onclick = () => { st.d = { pi: false, Vf: 10, hom: false, ok: false }; save(); T.msg("Fiole rincée : recommence la dilution."); ui(); };
      $("#hyAc").onclick = () => { if (!st.d.ok) { T.msg("Prépare et note d'abord la solution diluée (étape A).", "bad"); return; } if (st.ac) { T.msg("L'acide est déjà ajouté.", "bad"); return; } if (st.V.B > 0) { T.msg("Trop tard : du MnO₂ s'est déjà formé. « Nouveau dosage » et acidifie avant de verser le permanganate.", "bad"); return; } st.ac = 1; save(); T.msg("10 mL d'acide sulfurique ajoutés : milieu acide.", "ok"); ui(); };
      document.querySelectorAll("[data-hyv]").forEach(b => b.onclick = () => {
        if (!st.d.ok) { T.msg("Prépare et note d'abord la solution diluée (étape A).", "bad"); return; }
        if (st.fin) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        const was = pink(); if (!addV(T, st.V, "B", +b.getAttribute("data-hyv"))) return; save(); B.drop(); if (!pink() && st.ac) B.flash = 1;
        T.msg(!st.ac ? "Un précipité brun apparaît : le milieu n'est pas acide !" : !was && pink() ? "La teinte rose pâle persiste à l'agitation." : "", st.ac ? "ok" : "bad"); ui();
      });
      $("#hyRaz").onclick = () => { st.V.B = 0; st.fin = false; st.ac = 0; save(); T.msg("Nouvelle prise : 10,0 mL de solution diluée ; burette au zéro. N'oublie pas l'acide."); ui(); };
      $("#hyRec").onclick = () => {
        if (st.m === "A") {
          if (!st.d.hom) { T.msg("Complète au trait, puis bouche et homogénéise la fiole avant de noter la dilution.", "bad"); return; }
          if (st.d.ok) { T.msg("Cette dilution est déjà notée.", "bad"); return; }
          const n = T.rows.A.length; T.add("A", { Vp: 10, Vf: rnd(st.d.Vf, 2) }); if (T.rows.A.length > n) { st.d.ok = true; save(); T.msg("Dilution notée : 10,0 mL → 100,0 mL.", "ok"); } ui(); return;
        }
        if (st.fin) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        if (!st.ac) { T.msg("Le milieu n'est pas acide : ce dosage est faux. « Nouveau dosage ».", "bad"); return; }
        if (!pink()) { T.msg("La solution est incolore : l'équivalence n'est pas atteinte.", "bad"); return; }
        const n = T.rows.B.length; T.add("B", { V: st.V.B }); if (T.rows.B.length > n) { st.fin = true; save(); T.msg(`V_E = ${f2(st.V.B)} mL noté.`, "ok"); } ui();
      };
      $("#hyNew").onclick = () => { if (lockedMsg(T)) return; P = mk(); store.set("ch2o2_par", P); st = JSON.parse(JSON.stringify(def)); save(); T.clearRows(); ui(); T.msg("Nouveau matériel : refais la dilution et les dosages."); };
      ui();
    }
  });

  /* ======================================================================
     TP C9 : MANGANIMÉTRIE II — DOSAGE EN RETOUR DU DICHROMATE À L'AIDE DU SEL DE MOHR
     A : sel de Mohr seul par KMnO₄ (quantité réelle de Fe²⁺) ; B : dichromate + excès de sel de Mohr, Fe²⁺ restant par KMnO₄
     ====================================================================== */
  register({
    id: "cdichro", num: 40, lab: "C9", disc: "Chimie", court: "Manganimétrie II (dichromate)",
    titre: "Manganimétrie II : dosage en retour du dichromate par l'intermédiaire du sel de Mohr",
    objectifs: "comprendre le principe du dosage en retour, écrire et équilibrer les deux réactions d'oxydoréduction, déterminer la quantité de fer(II) introduite et restante, calculer la quantité et la concentration du dichromate par différence, et respecter la gestion des déchets contenant du chrome(VI).",
    materiel: ["Solution de dichromate de potassium K₂Cr₂O₇ à doser (M = 294,18 g/mol)", "Solution de sel de Mohr (NH₄)₂Fe(SO₄)₂·6H₂O à environ 0,100 mol/L", "Burette de 50 mL remplie de KMnO₄ (concentration indiquée sur le flacon)", "Acide sulfurique et acide phosphorique (milieu acide)", "Pipettes jaugées de 10,0, 20,0 et 25,0 mL, erlenmeyers", "Bidon de collecte « chrome(VI) – métaux lourds »"],
    theorie: `<p>Le sel de Mohr fournit des ions fer(II). On en introduit une quantité connue <b>en excès</b> : le dichromate est entièrement réduit, puis le permanganate dose le fer(II) <b>restant</b>.</p>
      <div class="formula">Cr₂O₇²⁻ + 6 Fe²⁺ + 14 H⁺ → 2 Cr³⁺ + 6 Fe³⁺ + 7 H₂O
MnO₄⁻ + 5 Fe²⁺ + 8 H⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O</div>
      <div class="formula">n(Fe²⁺)initial = C_F V_F        n(Fe²⁺)restant = 5 C_M V_E        n(Cr₂O₇²⁻) = [C_F V_F − 5 C_M V_E] / 6        C_D = n(Cr₂O₇²⁻) / V_D</div>
      <p>Une mole de dichromate consomme <b>six</b> moles de Fe²⁺, une mole de permanganate en consomme <b>cinq</b>. Le sel de Mohr s'oxyde lentement à l'air : on détermine sa concentration réelle C_F en le dosant seul par le permanganate (partie A).</p>
      <p>La fin du dosage est repérée par la première teinte rose persistante (la solution contient des ions Cr³⁺ verts : la teinte finale est gris-violacé).</p>`,
    protocole: `<h4>Partie A — Dosage du sel de Mohr seul</h4><ol><li>10,0 mL de solution de sel de Mohr + 10 mL de milieu acide ; titre par KMnO₄ jusqu'à la teinte rose persistante. Deux essais.</li></ol>
      <h4>Partie B — Dosage en retour du dichromate</h4><ol><li>Prélève 10,0 mL de dichromate dans un erlenmeyer.</li><li>Ajoute un volume connu de sel de Mohr <b>en excès</b> (choisis la pipette), puis le milieu acide ; agite et laisse la réaction s'achever (la solution passe de l'orangé au vert).</li>
        <li>Titre le fer(II) restant par KMnO₄ jusqu'à la première teinte rose persistante. Note V_E.</li><li>Vide le contenu de l'erlenmeyer dans le <b>bidon « chrome(VI) »</b>, puis recommence (deux ou trois essais).</li></ol>`,
    precautions: `<ul><li><b>Sécurité renforcée</b> : le chrome(VI) est toxique, cancérogène et dangereux pour l'environnement. Gants, lunettes, et collecte séparée de tous les déchets qui en contiennent.</li><li>Le sel de Mohr doit être en excès : vérifie par le calcul que C_F V_F &gt; 6 C_D V_D.</li><li>Lis la burette de KMnO₄ au haut du ménisque.</li></ul>`,
    preparation: ["Écris les demi-équations des couples Cr₂O₇²⁻/Cr³⁺, MnO₄⁻/Mn²⁺ et Fe³⁺/Fe²⁺, puis les deux équations.", "Pourquoi introduit-on le sel de Mohr en excès ?", "Établis C_D = (C_F V_F − 5 C_M V_E) / (6 V_D) et explique la division par 6.", "Pour 10,0 mL de dichromate à environ 0,017 mol/L, quel volume minimal de sel de Mohr à 0,100 mol/L faut-il ?", "Pourquoi les déchets contenant du chrome(VI) doivent-ils être collectés séparément ?"],
    hint: "Partie A : dose le sel de Mohr seul. Partie B : dichromate + sel de Mohr en excès + acide, puis KMnO₄ jusqu'au rose persistant ; vide l'erlenmeyer dans le bidon « chrome ».",
    controls: `<h3>Partie</h3>${seg("dim", [["A", "A · sel de Mohr seul"], ["B", "B · dichromate"]], "A")}
      <div id="diPr" hidden><div class="ctl"><label for="diVF">Pipette de sel de Mohr</label><select id="diVF"><option value="10">10,0 mL</option><option value="20">20,0 mL</option><option value="25">25,0 mL</option></select></div>
        <div class="row"><button type="button" class="btn sm" id="diMx">10,0 mL de dichromate + sel de Mohr + acide</button></div>
        <div class="row"><button type="button" class="btn sm" id="diBid">Vider dans le bidon « chrome(VI) »</button><button type="button" class="btn sm" id="diEv">Vider à l'évier</button></div></div>
      ${burHTML("di", "KMnO₄")}
      ${lcd("di", [["V", "Burette : V versé"], ["C", "Teinte"], ["K", "Flacon de KMnO₄"]])}
      <div class="row"><button type="button" class="btn primary sm" id="diRec">Noter V_E (rose persistant)</button></div>
      <button type="button" class="btn sm" id="diNew">Changer de matériel</button>`,
    parts: [{ key: "A" }, { key: "B" }],
    questions: ["Écris les deux équations d'oxydoréduction.", "Calcule la concentration réelle C_F du sel de Mohr.", "Calcule n(Fe²⁺) initial, n(Fe²⁺) restant, n(Cr₂O₇²⁻) et C_D pour chaque essai.", "Que se passe-t-il si le sel de Mohr n'est pas introduit en quantité suffisante ?", "Pourquoi faut-il connaître précisément la quantité initiale de sel de Mohr ?"],
    init(T) {
      const mk = () => { const cM = U(0.0195, 0.0205); return { cD: U(0.015, 0.019), cF: 0.1 * U(0.97, 1.0), cM, cML: +cM.toPrecision(4) }; };
      let P = params("cdichro_par", mk, P => isFinite(P.cD));
      const def = { m: "A", V: { A: 0, B: 0 }, fin: { A: false, B: false }, b: { mx: 0, VF: 20, sale: 0 } };
      let st = state("cdichro_st", def); const save = () => store.set("cdichro_st", st);
      const B = mkBench("cdichro-cv");
      const E = () => cxDiEnd(P, st.m, st.b.VF), ready = () => st.m === "A" || st.b.mx;
      const lack = () => st.m === "B" && st.b.mx && E() <= 0;
      const pink = () => ready() && !lack() && st.V[st.m] >= E() - 1e-9;
      const ui = () => {
        setSeg("dim", st.m); $("#diPr").hidden = st.m !== "B"; $("#diVF").value = st.b.VF;
        $("#diV").textContent = f2(st.V[st.m]) + " mL"; $("#diK").textContent = fx(P.cML, 4) + " mol/L";
        $("#diC").textContent = !ready() ? "—" : lack() ? "orangée (dichromate en excès)" : pink() ? "rose persistant" : st.m === "B" ? "verte (Cr³⁺)" : "jaune très pâle"; draw();
      };
      const draw = () => { const m = st.m, V = st.V[m], p = pink();
        B.draw({ V: ready() ? V : null, tit: "KMnO₄ " + fx(P.cML, 4) + " mol/L", burCol: MNO4, dropCol: "rgba(150,40,140,.95)", vessel: "erlen", stir: ready(),
          col: !ready() ? (st.b.sale ? "rgba(90,160,110,.5)" : "rgba(0,0,0,0)") : lack() ? "rgba(235,130,40,.6)" : p ? (m === "B" ? "rgba(140,90,150,.6)" : pinkMn(V - E())) : B.flash > 0.05 ? `rgba(200,60,160,${(0.4 * B.flash).toFixed(3)})` : m === "B" ? "rgba(90,160,110,.5)" : "rgba(240,230,170,.4)",
          cap: m === "A" ? "sel de Mohr 10,0 mL + acide" : st.b.mx ? "dichromate 10,0 mL + sel de Mohr " + st.b.VF + ",0 mL + acide" : st.b.sale ? "erlenmeyer à vider" : "erlenmeyer : prépare le mélange",
          side: [["Teinte : " + $("#diC").textContent, lack() ? "#c0392b" : null, true], ...(m === "B" ? [["Sel de Mohr ajouté : " + (st.b.mx ? st.b.VF + ",0 mL" : "—")]] : []), ["Volumes notés : " + (T.rows[m].map(q => f2(q.V)).join(" ; ") || "aucun")], ...(st.fin[m] ? [[m === "B" ? "Dosage terminé : vide l'erlenmeyer dans le bidon « chrome(VI) »." : "Dosage terminé : « Nouveau dosage » pour l'essai suivant.", css("--accent")]] : [])] }); };
      T.draw = draw; T.tick = dt => { if (B.tick(dt)) draw(); };
      document.querySelectorAll("[data-dim]").forEach(b => b.onclick = () => { st.m = b.dataset.dim; save(); T.msg(""); ui(); });
      $("#diVF").addEventListener("change", () => { if (st.b.mx) { $("#diVF").value = st.b.VF; T.msg("Le mélange est déjà préparé.", "bad"); return; } st.b.VF = +$("#diVF").value; save(); ui(); });
      $("#diMx").onclick = () => {
        if (st.b.sale) { T.msg("Vide d'abord l'erlenmeyer précédent dans le bidon « chrome(VI) ».", "bad"); return; } if (st.b.mx) { T.msg("Le mélange est déjà préparé.", "bad"); return; }
        st.b.mx = 1; st.V.B = 0; st.fin.B = false; B.flash = 0; save(); T.msg(lack() ? "La solution reste orangée : le dichromate n'a pas été entièrement réduit. Le sel de Mohr n'est pas en excès : vide l'erlenmeyer et prends une pipette plus grande." : "Mélange préparé : la solution passe de l'orangé au vert (Cr³⁺). Le fer(II) est en excès.", lack() ? "bad" : "ok"); ui();
      };
      $("#diBid").onclick = () => { if (!st.b.mx && !st.b.sale) { T.msg("L'erlenmeyer est vide.", "bad"); return; } st.b = { mx: 0, VF: st.b.VF, sale: 0 }; st.V.B = 0; st.fin.B = false; save(); T.msg("Contenu versé dans le bidon « chrome(VI) – métaux lourds » ; erlenmeyer rincé (eau de rinçage dans le même bidon).", "ok"); ui(); };
      $("#diEv").onclick = () => { if (!st.b.mx && !st.b.sale) { T.msg("L'erlenmeyer est vide.", "bad"); return; } T.msg("Interdit : une solution contenant du chrome ne doit jamais être jetée à l'évier. Utilise le bidon « chrome(VI) ».", "bad"); };
      document.querySelectorAll("[data-div]").forEach(b => b.onclick = () => {
        const m = st.m; if (!ready()) { T.msg("Prépare d'abord le mélange dichromate + sel de Mohr + acide.", "bad"); return; }
        if (st.fin[m]) { T.msg(m === "B" ? "Ce dosage est terminé : vide l'erlenmeyer dans le bidon « chrome(VI) »." : "Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        if (lack()) { T.msg("Il ne reste pas de fer(II) à doser : le sel de Mohr n'était pas en excès.", "bad"); return; }
        const was = pink(); if (!addV(T, st.V, m, +b.getAttribute("data-div"))) return; save(); B.drop(); if (!pink()) B.flash = 1;
        T.msg(!was && pink() ? "La teinte rose persiste à l'agitation." : "", "ok"); ui();
      });
      $("#diRaz").onclick = () => { if (st.m === "B") { if (st.b.mx || st.b.sale) { T.msg("Vide d'abord l'erlenmeyer dans le bidon « chrome(VI) ».", "bad"); return; } st.V.B = 0; st.fin.B = false; save(); T.msg("Burette au zéro : prépare un nouveau mélange."); ui(); return; } st.V.A = 0; st.fin.A = false; save(); T.msg("Nouvelle prise : 10,0 mL de sel de Mohr + acide ; burette au zéro."); ui(); };
      $("#diRec").onclick = () => {
        const m = st.m; if (!ready()) { T.msg("Prépare d'abord le mélange.", "bad"); return; }
        if (st.fin[m]) { T.msg("Ce volume est déjà noté.", "bad"); return; }
        if (!pink()) { T.msg(lack() ? "Ce dosage est impossible : le sel de Mohr n'était pas en excès." : "La teinte rose n'est pas encore apparue.", "bad"); return; }
        const n = T.rows[m].length; T.add(m, m === "A" ? { VF: 10, V: st.V.A } : { VD: 10, VF: st.b.VF, V: st.V.B });
        if (T.rows[m].length > n) { st.fin[m] = true; if (m === "B") { st.b.mx = 0; st.b.sale = 1; } save(); T.msg(`V_E = ${f2(st.V[m])} mL noté.` + (m === "B" ? " Vide maintenant l'erlenmeyer dans le bidon « chrome(VI) »." : ""), "ok"); } ui();
      };
      $("#diNew").onclick = () => { if (lockedMsg(T)) return; P = mk(); store.set("cdichro_par", P); st = JSON.parse(JSON.stringify(def)); save(); T.clearRows(); ui(); T.msg("Nouveau matériel : refais les dosages."); };
      ui();
    }
  });

  /* ======================================================================
     TP C10 : DOSAGE POTENTIOMÉTRIQUE — Fe²⁺ PAR MnO₄⁻ (électrode de platine / électrode au calomel saturé)
     ====================================================================== */
  register({
    id: "cpot", num: 41, lab: "C10", disc: "Chimie", court: "Dosage potentiométrique",
    titre: "Dosage potentiométrique des ions fer(II) par le permanganate",
    objectifs: "comprendre le principe de la potentiométrie, identifier le rôle de l'électrode indicatrice et de l'électrode de référence, effectuer une série de mesures de potentiel, tracer E = f(V), calculer la dérivée ΔE/ΔV et déterminer le volume équivalent et la concentration de la solution dosée.",
    materiel: ["Potentiomètre (millivoltmètre électronique)", "Électrode indicatrice de platine, électrode de référence au calomel saturé (ECS, E = 0,244 V)", "Solution de fer(II) (sel de Mohr) à doser, environ 0,05 mol/L", "Burette de 50 mL remplie de KMnO₄ (concentration indiquée sur le flacon)", "Acide sulfurique à 1 mol/L", "Pipette jaugée de 20,0 mL, bécher de 150 mL, agitateur magnétique"],
    theorie: `<p>La potentiométrie mesure, à courant pratiquement nul, la différence de potentiel E entre une <b>électrode indicatrice</b> (platine), dont le potentiel dépend de la composition de la solution, et une <b>électrode de référence</b> (calomel saturé), dont le potentiel est constant.</p>
      <div class="formula">MnO₄⁻ + 5 Fe²⁺ + 8 H⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O        C(Fe²⁺) × V(Fe²⁺) = 5 C(MnO₄⁻) × V_E</div>
      <h4>Allure de la courbe E = f(V)</h4><ul><li>Avant l'équivalence : E = E°′(Fe³⁺/Fe²⁺) + 0,059 log([Fe³⁺]/[Fe²⁺]) − 0,244 (en V, par rapport à l'ECS).</li><li>À la <b>demi-équivalence</b>, [Fe³⁺] = [Fe²⁺] : E = E°′(Fe³⁺/Fe²⁺) − 0,244.</li><li>À l'équivalence : saut de potentiel de plusieurs centaines de millivolts ; après, le potentiel est fixé par le couple MnO₄⁻/Mn²⁺.</li><li>À <b>2 V_E</b>, [MnO₄⁻] = [Mn²⁺] : E = E°(MnO₄⁻/Mn²⁺) − 0,244 (milieu très acide, pH ≈ 0).</li></ul>
      <h4>Exploitation</h4><div class="formula">ΔE/ΔV = (E_{i+1} − E_i) / (V_{i+1} − V_i)</div><p>Le maximum de la dérivée, tracée en fonction du volume moyen de chaque intervalle, donne le volume équivalent.</p>`,
    protocole: `<h4>Mesures</h4><ol><li>Choisis et installe les électrodes adaptées (indicatrice et référence) ; vérifie que la lecture est stable.</li><li>20,0 mL de la solution de fer(II) + 20 mL d'acide sulfurique dans le bécher ; agitation.</li>
        <li>Mesure le potentiel initial, puis ajoute le permanganate par 1 mL ; après chaque ajout, attends la stabilisation et note E.</li><li>Réduis les incréments (0,2 mL ou une goutte) près de l'équivalence, puis poursuis jusqu'à environ 2 V_E.</li>
        <li>Trace E = f(V), calcule ΔE/ΔV et détermine V_E ; lis E à la demi-équivalence et à 2 V_E.</li></ol>`,
    precautions: `<ul><li>L'électrode de platine doit être propre ; l'électrode au calomel ne doit pas sécher (garde-la dans KCl saturé).</li><li>Attends la stabilisation du potentiel après chaque ajout, surtout près de l'équivalence.</li><li>Réduis les incréments près du saut : c'est là que se joue la précision sur V_E.</li><li>Facteurs influents : température, état des électrodes, agitation, acidité du milieu.</li></ul>`,
    preparation: ["Quel est le rôle de l'électrode de référence ? Et de l'électrode indicatrice ?", "Écris l'équation de dosage et la relation à l'équivalence.", "Calcule V_E attendu pour 20,0 mL de Fe²⁺ à 0,050 mol/L et KMnO₄ à 0,0200 mol/L.", "Montre qu'à la demi-équivalence, E = E°′(Fe³⁺/Fe²⁺) − E(ECS).", "Pourquoi réduire les incréments près de l'équivalence ?"],
    hint: "Choisis les électrodes, puis verse le permanganate et enregistre les points (V ; E).",
    controls: `<h3>Électrodes</h3><div class="ctl"><label for="poI">Électrode indicatrice</label><select id="poI"><option value="">— choisir —</option><option value="pt">platine</option><option value="verre">électrode de verre (pH)</option><option value="ag">argent</option></select></div>
      <div class="ctl"><label for="poR">Électrode de référence</label><select id="poR"><option value="">— choisir —</option><option value="ecs">calomel saturé (ECS)</option><option value="pt">deuxième électrode de platine</option></select></div>
      ${burHTML("po", "KMnO₄", [["1", "+ 1 mL"], ["0.5", "+ 0,5 mL"], ["0.2", "+ 0,2 mL"], ["0.05", "+ 1 goutte"]])}
      ${lcd("po", [["V", "Burette : V versé"], ["E", "Potentiomètre"], ["K", "Flacon de KMnO₄"]])}
      <div class="row"><button type="button" class="btn primary sm" id="poRec">Enregistrer le point (V ; E)</button></div>
      <button type="button" class="btn sm" id="poNew">Changer de matériel</button>`,
    parts: [{ key: "A" }],
    questions: ["Trace E = f(V) et la dérivée ΔE/ΔV ; détermine V_E.", "Calcule la concentration de la solution de fer(II).", "Déduis E°′(Fe³⁺/Fe²⁺) du potentiel à la demi-équivalence.", "Pourquoi ce dosage ne nécessite-t-il pas d'indicateur coloré ?", "Cite trois facteurs susceptibles d'influencer la mesure."],
    init(T) {
      const mk = () => { const cM = U(0.0195, 0.0205); return { cFe: U(0.045, 0.055), cM, cML: +cM.toPrecision(4), E0: U(0.67, 0.69) }; };
      let P = params("cpot_par", mk, P => isFinite(P.cFe));
      const def = { V: 0, ei: "", er: "" };
      let st = state("cpot_st", def); const save = () => store.set("cpot_st", st);
      const B = mkBench("cpot-cv");
      const good = () => st.ei === "pt" && st.er === "ecs";
      const read = () => good() ? Math.round(cxPotE(P, st.V) + 0.6 * Math.sin(st.V * 29.1 + 1.3)) : NaN;
      const shown = () => good() ? read() : st.ei && st.er ? Math.round(150 + 400 * Math.random()) : NaN;
      const ui = () => {
        $("#poI").value = st.ei; $("#poR").value = st.er; $("#poV").textContent = f2(st.V) + " mL"; $("#poK").textContent = fx(P.cML, 4) + " mol/L";
        const e = shown(); $("#poE").textContent = isFinite(e) ? e + " mV" + (good() ? "" : " (instable)") : "électrodes non branchées"; draw();
      };
      const draw = () => { const e = shown();
        B.draw({ V: st.V, tit: "KMnO₄ " + fx(P.cML, 4) + " mol/L", burCol: MNO4, dropCol: "rgba(150,40,140,.95)", vessel: "becher", probe: st.ei ? "pt" : null, probe2: !!st.er, stir: true, col: st.V >= 20 * P.cFe / (5 * P.cM) ? "rgba(200,60,160,.35)" : "rgba(240,230,170,.4)",
          cap: "Fe²⁺ 20,0 mL + 20 mL de H₂SO₄",
          meter: { val: isFinite(e) ? e + " mV" : "— mV", sub: good() ? "Pt / ECS" : st.ei && st.er ? "lecture instable : électrodes inadaptées" : "choisis les électrodes" },
          curve: { lab: "E = f(V)", xmax: 25, ymin: 200, ymax: 1400, pts: T.rows.A.map(r => [r.V, r.E]), cur: st.V } }); };
      T.draw = draw; T.tick = dt => { if (B.tick(dt)) draw(); };
      $("#poI").addEventListener("change", () => { st.ei = $("#poI").value; save(); T.msg(st.ei && st.er && !good() ? "La lecture ne se stabilise pas : ces électrodes ne conviennent pas pour un dosage d'oxydoréduction." : good() ? "Électrodes adaptées : la lecture est stable." : "", good() ? "ok" : st.ei && st.er ? "bad" : ""); ui(); });
      $("#poR").addEventListener("change", () => { st.er = $("#poR").value; save(); T.msg(st.ei && st.er && !good() ? "La lecture ne se stabilise pas : il faut une électrode de référence de potentiel constant et une électrode indicatrice inerte." : good() ? "Électrodes adaptées : la lecture est stable." : "", good() ? "ok" : st.ei && st.er ? "bad" : ""); ui(); });
      document.querySelectorAll("[data-pov]").forEach(b => b.onclick = () => { if (st.V >= 25) { T.msg("Ce n'est plus utile d'aller au-delà de 25 mL.", "bad"); return; } const o = { V: st.V }; if (addV(T, o, "V", +b.getAttribute("data-pov"))) { st.V = o.V; save(); B.drop(); T.msg(""); ui(); } });
      $("#poRaz").onclick = () => { st.V = 0; save(); T.msg("Nouveau dosage : burette au zéro, 20,0 mL de Fe²⁺ + 20 mL de H₂SO₄." + (T.rows.A.length ? " Supprime d'abord les lignes (✕) si tu refais la courbe." : "")); ui(); };
      $("#poRec").onclick = () => {
        if (!good()) { T.msg(st.ei && st.er ? "La lecture est instable : change d'électrodes avant de mesurer." : "Choisis d'abord les électrodes.", "bad"); return; }
        const R = T.rows.A, V = st.V;
        if (R.length && V <= R[R.length - 1].V + 1e-9) { T.msg("Tu as déjà un point à ce volume (ou à un volume plus grand) : verse du permanganate avant d'enregistrer.", "bad"); return; }
        T.add("A", { V, E: read() }); T.msg("Point enregistré.", "ok"); draw();
      };
      $("#poNew").onclick = () => { if (lockedMsg(T)) return; P = mk(); store.set("cpot_par", P); st = JSON.parse(JSON.stringify(def)); save(); T.clearRows(); ui(); T.msg("Nouveau matériel : refais les mesures."); };
      ui();
    }
  });
})();
