/* Socle commun des travaux pratiques virtuels :
   fiche (protocole), paillasse simulée, parties de mesures (tableau + graphe + régression),
   chronomètre, compte rendu remplissable et exportable. */
(function () {
  "use strict";
  /* page de début de chaque TP dans le fascicule (docs/Fascicule_TP_Physique_L1.pdf, numéro de page du fichier) */
  const FASC = { 1: 11, 2: 17, 3: 22, 4: 27, 5: 33, 6: 39, 7: 45, 8: 51 };
  const $ = s => document.querySelector(s);
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fr = (x, d = 2) => (x == null || !isFinite(x)) ? "—" : x.toFixed(d).replace(".", ",").replace(/^-0(,0+)?$/, "0$1");
  const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const store = {
    get(k, d) { try { const v = localStorage.getItem("tp2_" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("tp2_" + k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem("tp2_" + k); } catch (e) {} }
  };
  function fit(cv, ratio) {
    const w = cv.clientWidth || 600, h = Math.round(w * ratio), d = Math.min(devicePixelRatio || 1, 2);
    if (cv.width !== Math.round(w * d) || cv.height !== Math.round(h * d)) { cv.width = Math.round(w * d); cv.height = Math.round(h * d); cv.style.height = h + "px"; }
    const c = cv.getContext("2d"); c.setTransform(d, 0, 0, d, 0, 0); return { c, w, h };
  }
  function txt(c, s, x, y, col, al = "left", bl = "alphabetic", font = "12px 'Fira Sans',Arial,sans-serif") { c.font = font; c.fillStyle = col; c.textAlign = al; c.textBaseline = bl; c.fillText(s, x, y); }
  function linreg(P) {
    const n = P.length; if (n < 2) return null; let sx = 0, sy = 0, sxx = 0, sxy = 0, syy = 0;
    P.forEach(([x, y]) => { sx += x; sy += y; sxx += x * x; sxy += x * y; syy += y * y; });
    const d = n * sxx - sx * sx; if (Math.abs(d) < 1e-18) return null;
    const a = (n * sxy - sx * sy) / d, b = (sy - a * sx) / n, den = Math.sqrt(d * (n * syy - sy * sy));
    return { a, b, r: den ? (n * sxy - sx * sy) / den : 1, n };
  }
  /* nuage de points + droite de régression (ou non) */
  function scatter(cv, P, o) {
    const { c, w, h } = fit(cv, 0.66); c.fillStyle = css("--plot-bg"); c.fillRect(0, 0, w, h);
    const m = { l: 54, r: 14, t: 18, b: 40 }, W = w - m.l - m.r, H = h - m.t - m.b;
    if (!P.length) { txt(c, "Le graphe se trace dès la première mesure.", w / 2, h / 2, css("--muted"), "center", "middle", "13px 'Fira Sans',Arial"); return null; }
    const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
    const R0 = o.noFit ? null : linreg(P); if (R0 && o.xmin != null) ys.push(R0.a * o.xmin + R0.b); if (R0 && o.xmax != null) ys.push(R0.a * o.xmax + R0.b);   // la droite prolongée reste visible
    let x0 = o.xmin != null ? Math.min(o.xmin, ...xs) : Math.min(...xs), x1 = o.xmax != null ? Math.max(o.xmax, ...xs) : Math.max(...xs), y0 = o.ymin != null ? Math.min(o.ymin, ...ys) : Math.min(...ys), y1 = Math.max(...ys);
    const px = (x1 - x0) || Math.abs(x1) || 1, py = (y1 - y0) || Math.abs(y1) || 1;
    if (o.xmax == null) x1 += px * 0.08; else x1 += px * 0.04; y1 += py * 0.12; if (o.xmin == null) x0 -= px * 0.08; if (o.ymin == null) y0 -= py * 0.1;
    const X = x => m.l + (x - x0) / (x1 - x0) * W, Y = y => m.t + H - (y - y0) / (y1 - y0) * H;
    const ticks = (a, b) => { const s = Math.pow(10, Math.floor(Math.log10((b - a) / 4))); const st = [1, 2, 5, 10].map(k => k * s).find(k => (b - a) / k <= 6); const out = []; for (let t = Math.ceil(a / st) * st; t <= b + 1e-12; t += st) out.push(+t.toPrecision(8)); return out; };
    c.strokeStyle = css("--grid"); c.lineWidth = 1;
    ticks(x0, x1).forEach(t => { c.beginPath(); c.moveTo(X(t), m.t); c.lineTo(X(t), m.t + H); c.stroke(); txt(c, String(t).replace(".", ","), X(t), m.t + H + 14, css("--muted"), "center"); });
    ticks(y0, y1).forEach(t => { c.beginPath(); c.moveTo(m.l, Y(t)); c.lineTo(m.l + W, Y(t)); c.stroke(); txt(c, String(t).replace(".", ","), m.l - 6, Y(t), css("--muted"), "right", "middle"); });
    // axes : ils se coupent à l'origine (0, 0) dès qu'elle est dans le cadre
    const ax = x0 <= 0 && x1 >= 0 ? X(0) : m.l, ay = y0 <= 0 && y1 >= 0 ? Y(0) : m.t + H;
    c.strokeStyle = css("--fg") || css("--muted"); c.lineWidth = 1.4; c.beginPath(); c.moveTo(ax, m.t); c.lineTo(ax, m.t + H); c.moveTo(m.l, ay); c.lineTo(m.l + W, ay); c.stroke();
    if (ax !== m.l || ay !== m.t + H) { c.strokeStyle = css("--muted"); c.lineWidth = 1; c.beginPath(); c.moveTo(m.l, m.t); c.lineTo(m.l, m.t + H); c.lineTo(m.l + W, m.t + H); c.stroke(); }
    txt(c, o.xl, m.l + W, m.t + H + 32, css("--muted"), "right"); txt(c, o.yl, m.l + 4, m.t + 10, css("--muted"));
    c.save(); c.beginPath(); c.rect(m.l, m.t, W, H); c.clip();
    if (o.curve) { c.strokeStyle = css("--muted"); c.setLineDash([5, 4]); c.lineWidth = 1.4; c.beginPath(); for (let i = 0; i <= 200; i++) { const x = x0 + (x1 - x0) * i / 200, y = o.curve(x); i ? c.lineTo(X(x), Y(y)) : c.moveTo(X(x), Y(y)); } c.stroke(); c.setLineDash([]); }
    if (o.join && P.length >= 2) {   // courbe lissée passant par les points (grandeur non linéaire)
      const Q = P.slice().sort((a, b) => a[0] - b[0]).map(([x, y]) => [X(x), Y(y)]);
      c.strokeStyle = css("--saff"); c.lineWidth = 2; c.beginPath(); c.moveTo(Q[0][0], Q[0][1]);
      for (let i = 0; i + 1 < Q.length; i++) { const p0 = Q[i - 1] || Q[i], p1 = Q[i], p2 = Q[i + 1], p3 = Q[i + 2] || p2;
        c.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]); }
      c.stroke();
    }
    const R = o.noFit ? null : linreg(P);
    if (R) {
      const xa = o.xmin != null ? Math.min(...xs) : x0, xb = o.xmax != null ? Math.max(...xs) : x1;   // partie mesurée en trait plein, prolongements (jusqu'à x = 0) en pointillés
      c.strokeStyle = css("--saff"); c.lineWidth = 2; c.beginPath(); c.moveTo(X(xa), Y(R.a * xa + R.b)); c.lineTo(X(xb), Y(R.a * xb + R.b)); c.stroke();
      c.setLineDash([6, 5]);
      if (xa > x0) { c.beginPath(); c.moveTo(X(x0), Y(R.a * x0 + R.b)); c.lineTo(X(xa), Y(R.a * xa + R.b)); c.stroke(); }
      if (xb < x1) { c.beginPath(); c.moveTo(X(xb), Y(R.a * xb + R.b)); c.lineTo(X(x1), Y(R.a * x1 + R.b)); c.stroke(); }
      c.setLineDash([]);
    }
    c.restore();
    if (R && o.mark0 && x0 <= 0 && x1 >= 0 && P.length >= 2) {   // ordonnée à l'origine (ex. T₀ du pendule, vergence V)
      const yb = Y(R.b); c.fillStyle = css("--bad") || "#c0392b"; c.beginPath(); c.arc(X(0), yb, 6, 0, 7); c.fill();
      c.strokeStyle = c.fillStyle; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(m.l, yb); c.lineTo(Math.min(X(0) + 30, m.l + W), yb); c.stroke(); c.setLineDash([]);
      txt(c, o.mark0(R), m.l + 10, Math.abs(yb - (m.t + 40)) < 22 ? yb + 22 : m.t + 40, c.fillStyle, "left", "alphabetic", "700 14px 'Fira Sans',Arial");
    }
    if (R && o.eq && P.length >= 2) txt(c, o.eq(R), m.l + W - 6, R.a >= 0 ? m.t + H - 10 : m.t + 14, css("--saff"), "right", "alphabetic", "600 13px 'Fira Sans',Arial");
    c.fillStyle = css("--accent"); P.forEach(([x, y]) => { c.beginPath(); c.arc(X(x), Y(y), 4.5, 0, 7); c.fill(); });
    if (R && o.mark0 && P.length >= 2 && x0 <= 0 && x1 >= 0 && R.b !== 0 && Math.abs(R.b) < 0.1 * (y1 - y0)) zoom0(c, P, R, o, { m, W, H, X, Y });   // loupe sur l'ordonnée à l'origine
    if (o.note) txt(c, o.note, m.l + 10, m.t + 62, "#c0392b", "left", "alphabetic", "600 12px 'Fira Sans',Arial");
    return R;
  }


  /* Loupe : agrandissement de la zone autour de x = 0 pour lire l'ordonnée à l'origine b à l'œil nu */
  function zoom0(c, P, R, o, G) {
    const { m, W, H, X, Y } = G, b = R.b, a = R.a, ab = Math.abs(b);
    const side = P.reduce((s, p) => s + p[0], 0) >= 0 ? 1 : -1;                 // côté des mesures
    const xspan = Math.max(...P.map(p => Math.abs(p[0])));
    let xr = Math.abs(a) > 0 ? 2.5 * ab / Math.abs(a) : xspan * 0.2; xr = Math.min(Math.max(xr, xspan * 0.04), xspan * 0.5);
    const zx0 = Math.min(0, side * xr), zx1 = Math.max(0, side * xr);
    const ye = [0, b, a * zx0 + b, a * zx1 + b], zy0 = Math.min(...ye) - 0.35 * ab, zy1 = Math.max(...ye) + 0.35 * ab;
    // cadre de la loupe (coin haut gauche pour une pente positive, haut droit sinon)
    const bw = Math.min(250, W * 0.46), bh = Math.min(160, H * 0.44), il = { l: 46, r: 10, t: 22, b: 26 };
    const bx = (a >= 0 ? m.l + 14 : m.l + W - bw - 14), by = m.t + 52, iw = bw - il.l - il.r, ih = bh - il.t - il.b;
    const ZX = x => bx + il.l + (x - zx0) / (zx1 - zx0) * iw, ZY = y => by + il.t + ih - (y - zy0) / (zy1 - zy0) * ih;
    const red = css("--bad") || "#c0392b", muted = css("--muted"), fg = css("--fg") || muted;
    // zone agrandie repérée sur le graphe principal, reliée à la loupe
    const rx0 = X(zx0), rx1 = X(zx1), ry0 = Y(zy1), ry1 = Y(zy0);
    c.save(); c.strokeStyle = muted; c.lineWidth = 1; c.setLineDash([3, 3]);
    c.strokeRect(Math.min(rx0, rx1) - 3, Math.min(ry0, ry1) - 3, Math.abs(rx1 - rx0) + 6, Math.abs(ry1 - ry0) + 6);
    c.beginPath(); c.moveTo((rx0 + rx1) / 2, Math.min(ry0, ry1) - 3); c.lineTo(bx + bw / 2, by + bh); c.stroke(); c.setLineDash([]);
    // fond et bord
    c.fillStyle = css("--plot-bg") || "#fff"; c.fillRect(bx, by, bw, bh); c.strokeStyle = red; c.lineWidth = 1.5; c.strokeRect(bx, by, bw, bh);
    txt(c, "Loupe : zone proche de " + (o.xl || "x").split(" ")[0] + " = 0", bx + 8, by + 14, red, "left", "alphabetic", "600 11px 'Fira Sans',Arial");
    // graduations
    const ticks = (u, v) => { const s = Math.pow(10, Math.floor(Math.log10((v - u) / 3))); const st = [1, 2, 5, 10].map(k => k * s).find(k => (v - u) / k <= 4); const out = []; for (let t = Math.ceil(u / st) * st; t <= v + 1e-12; t += st) out.push(+t.toPrecision(6)); return out; };
    c.save(); c.beginPath(); c.rect(bx + il.l, by + il.t, iw, ih); c.clip();
    c.strokeStyle = css("--grid"); c.lineWidth = 1;
    ticks(zy0, zy1).forEach(t => { c.beginPath(); c.moveTo(bx + il.l, ZY(t)); c.lineTo(bx + il.l + iw, ZY(t)); c.stroke(); });
    ticks(zx0, zx1).forEach(t => { c.beginPath(); c.moveTo(ZX(t), by + il.t); c.lineTo(ZX(t), by + il.t + ih); c.stroke(); });
    // axes passant par l'origine
    c.strokeStyle = fg; c.lineWidth = 1.3; c.beginPath(); c.moveTo(ZX(0), by + il.t); c.lineTo(ZX(0), by + il.t + ih);
    if (zy0 <= 0 && zy1 >= 0) { c.moveTo(bx + il.l, ZY(0)); c.lineTo(bx + il.l + iw, ZY(0)); } c.stroke();
    // droite de régression
    const xm = side > 0 ? Math.min(...P.map(p => p[0])) : Math.max(...P.map(p => p[0]));   // au-delà des mesures : prolongement en pointillés
    c.strokeStyle = css("--saff"); c.lineWidth = 2;
    const seg = (u, v, d) => { if (v <= u) return; c.setLineDash(d ? [6, 5] : []); c.beginPath(); c.moveTo(ZX(u), ZY(a * u + b)); c.lineTo(ZX(v), ZY(a * v + b)); c.stroke(); };
    if (side > 0) { seg(zx0, Math.min(zx1, xm), true); seg(Math.max(zx0, xm), zx1, false); } else { seg(zx0, Math.max(zx0, xm), false); seg(Math.max(zx0, xm), zx1, true); }
    c.setLineDash([]);
    c.fillStyle = css("--accent"); P.forEach(([x, y]) => { if (x >= zx0 && x <= zx1 && y >= zy0 && y <= zy1) { c.beginPath(); c.arc(ZX(x), ZY(y), 3.5, 0, 7); c.fill(); } });
    // ordonnée à l'origine
    c.strokeStyle = red; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(bx + il.l, ZY(b)); c.lineTo(ZX(0), ZY(b)); c.stroke(); c.setLineDash([]);
    c.fillStyle = red; c.beginPath(); c.arc(ZX(0), ZY(b), 5, 0, 7); c.fill();
    c.restore();
    ticks(zy0, zy1).forEach(t => txt(c, String(t).replace(".", ","), bx + il.l - 4, ZY(t), muted, "right", "middle", "10px 'Fira Sans',Arial"));
    ticks(zx0, zx1).forEach(t => txt(c, String(t).replace(".", ","), ZX(t), by + il.t + ih + 12, muted, "center", "alphabetic", "10px 'Fira Sans',Arial"));
    const lab = "b ≈ " + (+b.toPrecision(3)).toString().replace(".", ",");
    txt(c, lab, ZX(0) + (side > 0 ? 8 : -8), ZY(b) + (a * side >= 0 ? 14 : -8), red, side > 0 ? "left" : "right", "alphabetic", "700 12px 'Fira Sans',Arial");
    c.restore();
  }

  /* chronomètre (manuel ou capteur automatique) */
  function chrono(id) {
    const html = `<h3>Chronomètre</h3>
      <div class="seg" role="group" aria-label="Mode de chronométrage"><button type="button" id="${id}-mMan" aria-pressed="true">Manuel</button><button type="button" id="${id}-mAut" aria-pressed="false">Capteur automatique</button></div>
      <div class="ctl"><label for="${id}-nb">Nombre d'oscillations à chronométrer</label><input id="${id}-nb" type="number" min="1" max="50" value="10"></div>
      <dl class="lcd"><dt>Temps</dt><dd id="${id}-t">0,00 s</dd><dt>Oscillations comptées</dt><dd id="${id}-n">0</dd></dl>
      <div class="row"><button type="button" class="btn sm" id="${id}-go">Démarrer</button><button type="button" class="btn sm" id="${id}-rz">Remise à zéro</button></div>`;
    const S = { t: 0, n: 0, on: false, auto: false, armed: false, target: 10, done: false };
    function bind() {
      const show = () => { $("#" + id + "-t").textContent = fr(S.t, 2) + " s"; $("#" + id + "-n").textContent = S.n; $("#" + id + "-go").textContent = S.on ? "Arrêter" : (S.auto ? "Armer le capteur" : "Démarrer"); };
      S.show = show;
      $("#" + id + "-mMan").onclick = () => { S.auto = false; $("#" + id + "-mMan").setAttribute("aria-pressed", "true"); $("#" + id + "-mAut").setAttribute("aria-pressed", "false"); show(); };
      $("#" + id + "-mAut").onclick = () => { S.auto = true; $("#" + id + "-mAut").setAttribute("aria-pressed", "true"); $("#" + id + "-mMan").setAttribute("aria-pressed", "false"); show(); };
      $("#" + id + "-go").onclick = () => {
        S.target = Math.max(1, Math.round(+$("#" + id + "-nb").value || 10));
        const now = performance.now();
        if (S.on || S.armed) { if (S.on && !S.auto && S.t0 != null) S.t = (now - S.t0) / 1000; S.on = false; S.armed = false; S.t0 = null; }
        else if (S.auto) { S.t = 0; S.n = 0; S.done = false; S.armed = true; }
        else { S.t = 0; S.n = 0; S.done = false; S.on = true; S.t0 = now; }   // manuel : temps réel exact entre les deux clics
        show();
      };
      $("#" + id + "-rz").onclick = () => { S.on = false; S.armed = false; S.t = 0; S.n = 0; S.done = false; show(); };
      show();
    }
    // appelé à chaque image ; pass=true quand l'oscillateur passe par sa position d'équilibre (fourche optique placée à l'équilibre,
    // franchie deux fois par période) ; frac = temps écoulé depuis ce passage jusqu'à la fin de l'image (passage daté exactement)
    S.step = (dt, pass, frac) => {
      frac = Math.min(dt, Math.max(0, frac || 0));
      if (S.armed && pass) { S.armed = false; S.on = true; S.t = frac; S.n = 0; S.h = 0; }
      else if (S.on) {
        if (!S.auto && S.t0 != null) S.t = (performance.now() - S.t0) / 1000; else S.t += dt;
        if (pass && S.auto) { S.h = (S.h || 0) + 1; if (S.h % 2 === 0) { S.n++; if (S.n >= S.target) { S.on = false; S.done = true; S.t = Math.max(0, S.t - frac) + gauss() * 0.002; } } }
        else if (pass) { S.h = (S.h || 0) + 1; if (S.h % 2 === 0) S.n++; }
      }
      if (S.show) S.show();
    };
    S.reading = () => ({ t: S.t, n: S.auto ? S.n : Math.max(1, Math.round(+$("#" + id + "-nb").value || 10)), man: !S.auto });
    return { html, S, bind };
  }

  /* ---------- session de l'étudiant connecté (n° de carte + code personnel) ---------- */
  /* session valide uniquement si elle contient l'identité et les données des TP (sinon : on l'oublie, il suffit de se reconnecter) */
  const sess = () => { const s = store.get("session", null); if (s && s.etudiant && s.tps && typeof s.tps === "object") return s; if (s) { try { localStorage.removeItem("tp2_session"); } catch (e) {} } return null; };
  const device = () => { let d = store.get("device", null); if (!d) { d = Math.random().toString(36).slice(2, 10) + Date.now().toString(36); store.set("device", d); } return d; };
  const wipe = () => { try { Object.keys(localStorage).filter(k => k.startsWith("tp2_") && k !== "tp2_device").forEach(k => localStorage.removeItem(k)); } catch (e) {} };
  const endpoint = () => (window.SITE_CONFIG || {}).crEndpoint;
  /* envoi au correcteur, avec nouveaux essais automatiques si le serveur est occupé (beaucoup d'étudiants en même temps) */
  const post = async (o, onWait, tries = 6) => {
    for (let k = 1; ; k++) {
      let R = null;
      try { const r = await fetch(endpoint(), { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(o) }); R = await r.json(); } catch (e) { R = null; }
      if (R && !R.busy) return R;
      if (k >= tries) { if (R) return R; throw new Error("réseau"); }
      if (onWait) onWait(k);
      await new Promise(res => setTimeout(res, (2000 + Math.random() * 4000) * Math.min(k, 4)));
    }
  };
  const waitMsg = k => `Serveur très sollicité : nouvel essai automatique (${k})… Ne ferme pas la page.`;
  const dfmt = iso => { const d = new Date(iso); return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) + " à " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); };
  /* installe le matériel personnel reçu du serveur ; efface les mesures faites avec un autre matériel */
  function applySession() {
    const s = sess(); if (!s) return [];
    const changed = [];
    TPS.forEach(T => {
      const st = s.tps[T.id]; if (!st) return;
      const pk = (window.TPCR_PARAMS || {})[T.id];
      if (pk && st.params && JSON.stringify(store.get(pk, null)) !== JSON.stringify(st.params)) {
        store.set(pk, st.params);
        Object.keys(window.TPCR[T.id].parts).forEach(k => { try { localStorage.removeItem("tp2_" + T.id + "_v2_" + k); } catch (e) {} });
        const cr = store.get(T.id + "_crv2", null); if (cr) { cr.fill = {}; cr.calc = {}; store.set(T.id + "_crv2", cr); }
        changed.push(T.num);
      }
      if (st.soumis) store.set(T.id + "_submitted", st.soumis); else { try { localStorage.removeItem("tp2_" + T.id + "_submitted"); } catch (e) {} }
    });
    return changed;
  }
  async function login(carte, code, onWait) {
    const R = await post({ action: "login", carte, code, device: device() }, onWait);
    if (!R.ok) return R;
    if (!R.etudiant || !R.tps) return { ok: false, error: "Réponse incomplète du correcteur : vérifie que la dernière version du script est installée (Déployer → Gérer les déploiements → Nouvelle version)." };
    const old = sess();
    if (old && old.etudiant.carte !== R.etudiant.carte) wipe();
    store.set("session", { etudiant: R.etudiant, code: String(code).trim().toUpperCase(), tps: R.tps, at: new Date().toISOString(), skew: Date.parse(R.serveur) - Date.now() || 0 });
    return R;
  }
  function loginCard(changed) {
    const box = $("#tpLogin"); if (!box) return; const s = sess();
    if (!s) {
      box.innerHTML = `<h2>Connexion aux TP</h2>
        <p>Connecte-toi avec ton <b>numéro de carte étudiant</b> et le <b>code personnel</b> remis par ton enseignant. Tu recevras ton propre matériel et tes propres questions ; sans connexion, tu peux t'entraîner mais pas soumettre de compte rendu.</p>
        <form class="loginf" id="lgForm" autocomplete="off"><label>N° carte étudiant<input id="lgCarte" required></label><label>Code personnel<input id="lgCode" required autocapitalize="characters" spellcheck="false"></label><button class="btn primary" type="submit" id="lgGo">Se connecter</button></form>
        <p class="msg" id="lgMsg" role="status"></p>`;
      $("#lgForm").onsubmit = async e => {
        e.preventDefault(); const m = $("#lgMsg");
        if (!endpoint()) { m.textContent = "La connexion n'est pas encore activée par l'enseignant."; m.className = "msg bad"; return; }
        m.textContent = "Connexion en cours…"; m.className = "msg"; $("#lgGo").disabled = true;
        try { const R = await login($("#lgCarte").value.trim(), $("#lgCode").value.trim(), k => { m.textContent = waitMsg(k); }); if (R.ok) { location.reload(); return; } m.textContent = R.error || "Connexion refusée."; m.className = "msg bad"; }
        catch (err) { m.textContent = "Connexion impossible : vérifie ta connexion internet puis réessaie."; m.className = "msg bad"; }
        $("#lgGo").disabled = false;
      };
      return;
    }
    const E = s.etudiant;
    box.innerHTML = `<div class="who"><div><div class="eyebrow">Connecté(e)</div><b>${esc(E.prenom)} ${esc(E.nom)}</b> — carte n° ${esc(E.carte)} — groupe ${esc(E.groupe)}${E.sousgroupe ? ", sous-groupe " + esc(E.sousgroupe) : ""}</div>
      <div class="row"><button type="button" class="btn sm" id="lgRef">Actualiser</button><button type="button" class="btn sm" id="lgOut">Se déconnecter</button></div></div>
      ${changed && changed.length ? `<p class="msg ok">Ton matériel personnel est installé (TP ${changed.join(", ")}) : les mesures d'entraînement faites avec un autre matériel ont été effacées.</p>` : ""}
      <p class="msg" id="lgMsg" role="status"></p><p class="hint" id="lgSrv"></p>`;
    // version du correcteur relié au site (aide au diagnostic) et TP connus par lui
    fetch(endpoint()).then(r => r.json()).then(o => { const v = (String(o.service || "").match(/\(v[\d.]+\)/) || ["(version inconnue)"])[0]; $("#lgSrv").textContent = `Correcteur relié : ${v} • adresse …${endpoint().slice(-12)} • TP reçus : ${Object.keys(s.tps).length}`; }).catch(() => {});
    $("#lgOut").onclick = () => { if (!confirm("Se déconnecter ? Les mesures et réponses non soumises enregistrées sur cet appareil seront effacées.")) return; wipe(); location.reload(); };
    $("#lgRef").onclick = async () => { const m = $("#lgMsg"); m.textContent = "Actualisation…"; m.className = "msg";
      try { const R = await login(E.carte, s.code, k => { m.textContent = waitMsg(k); }); if (R.ok) { location.reload(); return; } m.textContent = R.error; m.className = "msg bad"; } catch (err) { m.textContent = "Pas de connexion internet."; m.className = "msg bad"; } };
  }

  /* minuteurs : un seul battement par seconde pour tous les TP minutés */
  const TIMERS = [];
  setInterval(() => TIMERS.forEach(f => f()), 1000);
  const hms = ms => { const t = Math.max(0, Math.ceil(ms / 1000)), h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = t % 60; return (h ? h + " h " : "") + String(m).padStart(2, "0") + " min " + String(s).padStart(2, "0") + " s"; };

  const TPS = [];
  function register(T) { TPS.push(T); }

  const ROUND = (row, spec) => { const o = Object.assign({}, row); Object.keys(spec || {}).forEach(k => { if (typeof o[k] !== "number") return; o[k] = spec[k] === "s4" ? +o[k].toPrecision(4) : +o[k].toFixed(spec[k]); }); return o; };
  const parseNum = v => { const s = String(v ?? "").trim().replace(/\s/g, "").replace(",", ".").replace(/[×x*]10\^?\(?(-?\d+)\)?/i, "e$1"); return s === "" ? NaN : Number(s); };

  function mount(T) {
    const CR = window.TPCR[T.id], L = "ABCDEFG", keys = Object.keys(CR.parts);
    const SS = sess(), ST = SS && SS.tps[T.id], QS = ST ? ST.qcm : [];
    const QDT = id => ((window.TPQD || {}).Q || {})[T.id] && window.TPQD.Q[T.id][id];   // questions attribuées : [[n° question, ordre des réponses], ...]
    const host = document.createElement("section"); host.className = "tp"; host.id = T.id; host.hidden = true;
    const idField = (f, label, opt) => `<label>${label}${opt ? ' <span class="opt">(facultatif)</span>' : ""}<input id="${T.id}-${f}" data-id="${f}" autocomplete="off"></label>`;
    host.innerHTML = `
    <article class="card fiche">
      <div class="eyebrow">${esc(T.disc)} • TP n°${T.num}</div>
      <h2>${esc(T.titre)}</h2>
      <p class="obj"><b>Objectifs.</b> ${T.objectifs}</p>
      ${FASC[T.num] ? `<p class="fasc-link"><a href="docs/Fascicule_TP_Physique_L1.pdf#page=${FASC[T.num]}" target="_blank" rel="noopener">Lire ce TP dans le fascicule (PDF, page ${FASC[T.num] - 1})</a> : théorie détaillée, schémas de montage et tableaux de mesures.</p>` : ""}
      <ul class="mat" aria-label="Matériel">${T.materiel.map(m => `<li>${esc(m)}</li>`).join("")}</ul>
      <details open><summary>Rappels théoriques</summary><div class="sec">${T.theorie}</div></details>
      <details open><summary>Protocole détaillé</summary><div class="sec">${T.protocole}</div></details>
      <details><summary>Précautions et incertitudes</summary><div class="sec">${T.precautions}</div></details>
      <details><summary>Préparation (à faire avant la séance)</summary><div class="sec"><ol>${T.preparation.map(q => `<li>${q}</li>`).join("")}</ol></div></details>
    </article>
    ${ST && ST.duree ? `<div class="timer noprint" id="${T.id}-timer" role="timer" aria-live="off"></div><p class="surv noprint" style="font-family:var(--f-head);font-size:.86rem;color:var(--muted);border-left:3px solid var(--rouge);padding:6px 10px;margin:8px 0;background:var(--tint)"><b>Surveillance du TP minuté :</b> les sorties de la page ou de l'application, les captures d'écran détectables, les copies de texte et les impressions sont enregistrées avec l'heure et transmises à ton enseignant.</p>` : ""}
    <div class="lab">
      <div class="bench"><canvas id="${T.id}-cv" aria-label="Montage simulé"></canvas><p class="hint">${T.hint}</p></div>
      <div class="panel">${T.controls}<p class="msg" id="${T.id}-msg" role="status"></p></div>
    </div>
    <section class="card report" id="${T.id}-cr" aria-labelledby="${T.id}-crh">
      <h3 id="${T.id}-crh">Compte rendu — TP n°${T.num}</h3>
      <div class="note-box" id="${T.id}-noteBox" hidden></div>
      <p class="crstate${SS ? (ST && ST.etat ? " bad" : "") : " warn"}" id="${T.id}-state">${!SS ? "<b>Mode entraînement.</b> Connecte-toi en haut de la page pour recevoir ton matériel personnel, tes questions et pouvoir soumettre ce compte rendu."
        : ST && ST.etat ? esc(ST.etat) : ST && ST.fin ? "Soumission possible jusqu'au " + esc(dfmt(ST.fin)) + "." : "Matériel personnel attribué à " + esc(SS.etudiant.prenom + " " + SS.etudiant.nom) + "."}</p>
      <div class="id">${idField("nom", "Nom")}${idField("prenom", "Prénom")}${idField("carte", "N° carte étudiant")}${idField("groupe", "Groupe")}${idField("sousgroupe", "Sous-groupe")}${idField("binome", "Binôme", true)}</div>
      <p class="hint">Les mesures relevées sur la paillasse s'ajoutent automatiquement aux tableaux. À toi de calculer et de remplir les colonnes colorées, puis les résultats et le QCM. Tout est enregistré sur cet appareil jusqu'à la soumission.</p>
      ${keys.map((k, i) => { const p = CR.parts[k]; return `<div class="crpart">
        <h4>Partie ${L[i]} — ${esc(p.titre)} <span class="minm" id="${T.id}-min-${k}"></span></h4>
        ${p.aide ? `<div class="formula aide">${p.aide}</div>` : ""}
        <div class="data${p.plot ? "" : " solo"}">
          <div class="tblwrap"><table><thead><tr>${p.cols.map(c => `<th>${c}</th>`).join("")}${p.fill.map(f => `<th class="fillh">${f.h}</th>`).join("")}<th class="noprint"></th></tr></thead><tbody id="${T.id}-tb-${k}"></tbody></table></div>
          ${p.plot ? `<div class="graph"><canvas id="${T.id}-gr-${k}" aria-label="Graphe de la partie ${L[i]}"></canvas><p class="hint">Graphe tracé avec <b>tes</b> valeurs. Trace la droite moyenne et calcule sa pente toi-même.</p></div>` : ""}
        </div></div>`; }).join("")}
      <div class="crblock"><h4>Résultats et calculs</h4><div class="calcs">
        ${CR.calc.map(c => `<div class="calc"><label for="${T.id}-c-${c.k}">${c.h}</label><div class="cin"><input id="${T.id}-c-${c.k}" data-calc="${c.k}" inputmode="decimal"><span>${esc(c.u)}</span></div></div>`).join("")}
      </div></div>
      <div class="crblock"><h4>Questions (QCM)</h4>
        <p class="hint qcm-wait" id="${T.id}-qwait" hidden><b>Les questions apparaîtront quand tu auras cliqué sur « Commencer le TP »</b> (en haut de la paillasse).</p>
        <div id="${T.id}-qbox">
        ${QS.some(([qi]) => typeof qi === "string") ? `<p class="hint"><b>Questions sur TES mesures :</b> les propositions sont calculées à partir de ton propre tableau.</p>` : ""}
        <div class="qzctl" id="${T.id}-qzctl"></div>
        ${QS.length ? QS.map(([qi, ord, kq], i) => { if (typeof qi === "string") { const t = QDT(qi); return t ? `<fieldset class="qcm qd" data-qi="${i}" data-qd="${qi}" data-k="${kq || 1}"><legend><b>${i + 1}.</b> <span class="qdq"></span></legend><p class="hint qdmiss" hidden></p>${ord.map(j => `<label><input type="radio" name="${T.id}-q${qi}" value="${j}"> <span class="qdv" data-j="${j}"></span></label>`).join("")}</fieldset>` : ""; }
            const q = CR.qcm[qi]; return `<fieldset class="qcm" data-qi="${i}"><legend><b>${i + 1}.</b> ${q.q}</legend>${ord.map(j => `<label><input type="radio" name="${T.id}-q${qi}" value="${j}"> ${q.o[j]}</label>`).join("")}</fieldset>`; }).join("")
          : SS ? `<p class="hint"><b>Questions non disponibles pour ce TP.</b> Le correcteur de l'enseignant ne connaît pas encore ce TP (il doit installer la dernière version du script), puis clique sur « Actualiser » en haut de la page.</p>`
          : `<p class="hint">Les questions te seront attribuées après connexion (chaque étudiant reçoit ses propres questions).</p>`}
        </div>
      </div>
      <div class="crblock"><h4>Remarques <span class="opt">(facultatif, non noté)</span></h4><textarea id="${T.id}-rem" data-id="rem"></textarea></div>
      <div class="submit noprint" id="${T.id}-sub">
        ${ST && ST.seance ? `<label class="seance">Code de séance <span class="opt">(donné par l'enseignant en salle)</span><input id="${T.id}-seance" autocomplete="off" autocapitalize="characters"></label>` : ""}
        <label class="chk"><input type="checkbox" id="${T.id}-ok"> <span>Je certifie que ce compte rendu est mon travail. J'ai compris qu'<b>une seule soumission</b> est possible pour ce TP et que la note est définitive.</span></label>
        <div class="row"><button type="button" class="btn primary" id="${T.id}-send">Soumettre le compte rendu</button><button type="button" class="btn" id="${T.id}-dl">Télécharger une copie</button><button type="button" class="btn" id="${T.id}-clr">Effacer toutes les mesures</button></div>
        <p class="msg" id="${T.id}-smsg" role="status"></p>
      </div>
    </section>`;
    $("#tpHost").appendChild(host);

    const S = store.get(T.id + "_crv2", { fill: {}, calc: {}, qcm: {}, id: {} });
    T.rows = {}; keys.forEach(k => { T.rows[k] = store.get(T.id + "_v2_" + k, []); S.fill[k] = S.fill[k] || []; while (S.fill[k].length < T.rows[k].length) S.fill[k].push({}); });
    const save = () => { S.maj = Date.now(); store.set(T.id + "_crv2", S); keys.forEach(k => store.set(T.id + "_v2_" + k, T.rows[k])); };
    let SUB = store.get(T.id + "_submitted", null);
    let PEND = SUB ? null : store.get(T.id + "_pending", null);   // compte rendu verrouillé, en attente d'envoi (connexion absente)
    let refused = false;   // mesure refusée : on ne laisse pas le message « enregistrée » du montage la recouvrir
    const refuse = (s) => { T.msg(s, "bad"); refused = true; Promise.resolve().then(() => { refused = false; }); };
    T.msg = (s, kind) => { if (refused && kind === "ok") return; const e = $("#" + T.id + "-msg"); e.textContent = s || ""; e.className = "msg" + (kind ? " " + kind : ""); };
    const suspect = (c, r, raw) => { if (!c.ref) return false; const v = parseNum(raw), e = c.ref(r); return isFinite(v) && isFinite(e) && e !== 0 && Math.abs(v / e - 1) > (c.tol || 0.5); };
    const plotPart = k => {
      const p = CR.parts[k]; if (!p.plot) return;
      const bad = [];   // valeurs saisies très éloignées de la valeur attendue (ex. t au lieu de T = t/n) : écartées du graphe
      const P = T.rows[k].map((r, i) => { const f = {}; p.fill.forEach(c => f[c.k] = parseNum((S.fill[k][i] || {})[c.k])); if (p.fill.some(c => suspect(c, r, (S.fill[k][i] || {})[c.k]))) { bad.push(i + 1); return [NaN, NaN]; } return [p.plot.x(r, f), p.plot.y(r, f)]; }).filter(q => isFinite(q[0]) && isFinite(q[1]));
      scatter($("#" + T.id + "-gr-" + k), P, { xl: p.plot.xl, yl: p.plot.yl, noFit: !(p.plot.fit && P.length >= 2), xmin: p.plot.xmin, xmax: p.plot.xmax, ymin: p.plot.ymin, eq: p.plot.eq, mark0: p.plot.mark0, join: p.plot.join,
        note: bad.length ? `Ligne${bad.length > 1 ? "s" : ""} ${bad.join(", ")} écartée${bad.length > 1 ? "s" : ""} : valeur à vérifier (case rouge)` : "" });
    };
    T.renderPart = k => {
      const p = CR.parts[k], rows = T.rows[k], tb = $("#" + T.id + "-tb-" + k), lock = !!SUB || !!S.qz;
      while (S.fill[k].length < rows.length) S.fill[k].push({}); S.fill[k].length = rows.length;
      const susp = (c, r, i) => suspect(c, r, (S.fill[k][i] || {})[c.k]);
      tb.innerHTML = rows.length ? rows.map((r, i) => `<tr>${p.cells(r, i).map(v => `<td>${v}</td>`).join("")}${p.fill.map(c => `<td class="fillc${susp(c, r, i) ? " susp" : ""}"${susp(c, r, i) ? ` title="${esc(c.warn || "Valeur très éloignée : vérifie ton calcul.")}"` : ""}><input data-f="${k}:${i}:${c.k}" value="${esc((S.fill[k][i] || {})[c.k] ?? "")}" inputmode="decimal" aria-label="${esc(c.h)}, ligne ${i + 1}"${lock ? " disabled" : ""}></td>`).join("")}<td class="x noprint">${lock ? "" : `<button type="button" data-del="${k}:${i}" aria-label="Supprimer la mesure ${i + 1}">×</button>`}</td></tr>`).join("")
        : `<tr class="empty"><td colspan="${p.cols.length + p.fill.length + 1}">Aucune mesure : fais les mesures sur la paillasse ci-dessus.</td></tr>`;
      const m = $("#" + T.id + "-min-" + k); m.textContent = `${rows.length} mesure${rows.length > 1 ? "s" : ""} / ${p.min} minimum`; m.className = "minm" + (rows.length >= p.min ? " ok" : "");
      plotPart(k); save(); updQD();
    };
    T.renderAll = () => keys.forEach(T.renderPart);
    // QCM déduit des mesures : propositions recalculées avec les mesures actuelles
    const QDV = {};
    const updQD = () => {
      host.querySelectorAll("fieldset.qd").forEach(fs => {
        const id = fs.dataset.qd, t = QDT(id), k = +fs.dataset.k || 1; if (!t) return;
        const R = T.rows[t.part] || [], P = window.TPQD.propose(t, R, k), miss = fs.querySelector(".qdmiss");
        const L = { A: "A", B: "B", C: "C" }[t.part] || t.part;
        fs.querySelector(".qdq").textContent = P ? t.q.replace("{k}", P.k) : t.q.replace("{k}", "…");
        miss.hidden = !!P; if (!P) miss.textContent = "Fais d'abord tes mesures de la partie " + L + (t.g ? " (au moins " + (t.min || 3) + ")" : "") + " : les propositions apparaîtront ici.";
        QDV[id] = P ? P.vals : null; fs.dataset.ok = P ? "1" : "0";
        fs.querySelectorAll(".qdv").forEach(sp => { const j = +sp.dataset.j; sp.textContent = P ? window.TPQD.fmt(P.vals[j], t.sig) + (t.u ? " " + t.u : "") : "—"; });
        fs.querySelectorAll("input").forEach(inp => { inp.disabled = !P || !!SUB || !!PEND; });
      });
      try { qzRender(); } catch (e) {}   // (QCM chronométré pas encore initialisé au tout premier rendu)
    };
    T.locked = () => !!SUB || !!S.qz;
    T.clearRows = () => { keys.forEach(k => { T.rows[k] = []; S.fill[k] = []; }); T.renderAll(); };
    T.add = (k, row) => { if (timed() === "avant") { refuse("Ce TP est minuté : clique d'abord sur « Commencer le TP » au-dessus de la paillasse."); return; } if (timed() === "fini") { refuse("Le temps imparti est écoulé : les mesures ne sont plus enregistrées."); return; } if (SUB) { refuse("Ce compte rendu a déjà été soumis : les nouvelles mesures ne sont plus enregistrées."); return; } if (PEND) { refuse("Ton compte rendu est verrouillé (envoi en attente) : les nouvelles mesures ne sont plus enregistrées."); return; } if (S.qz) { refuse("Le QCM est commencé : tes mesures sont verrouillées."); return; } T.rows[k].push(Object.assign(ROUND(row, CR.parts[k].r), { ts: Date.now() })); S.fill[k].push({}); T.renderPart(k); };
    const cr = $("#" + T.id + "-cr");
    cr.addEventListener("click", e => { const b = e.target.closest("[data-del]"); if (!b || SUB || S.qz) return; const [k, i] = b.dataset.del.split(":"); T.rows[k].splice(+i, 1); S.fill[k].splice(+i, 1); T.renderPart(k); });
    cr.addEventListener("input", e => {
      const t = e.target; if (SUB) return;
      if (t.dataset.f) { const [k, i, c] = t.dataset.f.split(":"); S.fill[k][+i] = S.fill[k][+i] || {}; S.fill[k][+i][c] = t.value; const fc = CR.parts[k].fill.find(x => x.k === c), td = t.parentElement; if (fc && td) { const bad = suspect(fc, T.rows[k][+i], t.value); td.classList.toggle("susp", bad); if (bad) td.title = fc.warn || "Valeur très éloignée : vérifie ton calcul."; else td.removeAttribute("title"); } plotPart(k); save(); }
      else if (t.dataset.calc) { S.calc[t.dataset.calc] = t.value; save(); }
      else if (t.dataset.id) { S.id[t.dataset.id] = t.value; save(); }
    });
    cr.addEventListener("change", e => { if (!SUB && e.target.type === "radio" && qzOK(e.target)) { S.qcm["q" + e.target.name.split("-q").pop()] = e.target.value; save(); } });
    Object.keys(S.id).forEach(f => { const e = $("#" + T.id + "-" + f); if (e) e.value = S.id[f]; });
    Object.keys(S.calc).forEach(c => { const e = $("#" + T.id + "-c-" + c); if (e) e.value = S.calc[c]; });
    Object.keys(S.qcm).forEach(q => { const e = host.querySelector(`input[name="${T.id}-${q}"][value="${S.qcm[q]}"]`); if (e) e.checked = true; });
    if (SS) { const E = SS.etudiant; [["nom", E.nom], ["prenom", E.prenom], ["carte", E.carte], ["groupe", E.groupe], ["sousgroupe", E.sousgroupe]].forEach(([f, v]) => { const e = $("#" + T.id + "-" + f); e.value = v || ""; e.disabled = true; }); }
    $("#" + T.id + "-clr").onclick = () => { if (SUB || PEND || S.qz) return; keys.forEach(k => { T.rows[k] = []; S.fill[k] = []; }); T.renderAll(); T.msg("Toutes les mesures ont été effacées."); };

    const showNote = R => {
      const nb = $("#" + T.id + "-noteBox"); nb.hidden = false;
      nb.innerHTML = isFinite(R.note) ? `<div class="nb-main"><span>Compte rendu soumis le ${esc(new Date(R.date).toLocaleString("fr-FR"))}</span><b>${String(R.note).replace(".", ",")} / 20</b></div>
        <div class="nb-detail"><span>Mesures <b>${fr(R.mesures, 2)}</b> / 2</span><span>Tableaux <b>${fr(R.tableau, 2)}</b> / 6</span><span>Calculs <b>${fr(R.calculs, 2)}</b> / 6</span><span>QCM <b>${fr(R.qcm, 2)}</b> / 6</span></div>
        <p class="hint">Ta copie a été transmise à ton enseignant. Elle ne peut plus être modifiée.</p>`
        : `<div class="nb-main"><span>Un compte rendu a déjà été soumis pour ce TP avec ce numéro de carte.</span><b>Soumis</b></div>`;
      // phase de test : l'enseignant autorise plusieurs soumissions (réglage MODE_TEST du script)
      if (ST && ST.essais) {
        nb.insertAdjacentHTML("beforeend", `<div class="row"><button type="button" class="btn primary" id="${T.id}-redo">Refaire ce TP (nouvel essai)</button></div><p class="msg" id="${T.id}-rmsg"></p>`);
        $("#" + T.id + "-redo").onclick = async () => {
          if (!confirm(`Refaire le TP n°${T.num} ? Tes mesures et tes réponses actuelles seront effacées de cet appareil (la copie déjà envoyée reste chez ton enseignant).${ST.duree ? ` Le minuteur de ${ST.duree} min redémarre tout de suite.` : ""}`)) return;
          const rb = $("#" + T.id + "-redo"), rm = $("#" + T.id + "-rmsg"); rb.disabled = true; rm.textContent = "Préparation du nouvel essai…"; rm.className = "msg";
          try {
            const R = await post({ action: "start", tp: T.id, carte: SS.etudiant.carte, code: SS.code, device: device(), nouvelEssai: true }, k => { rm.textContent = waitMsg(k); });
            if (!R.ok) { rb.disabled = false; rm.textContent = R.error || "Impossible de recommencer."; rm.className = "msg bad"; return; }
            try { localStorage.removeItem("tp2_" + T.id + "_submitted"); keys.forEach(k => localStorage.removeItem("tp2_" + T.id + "_v2_" + k)); localStorage.removeItem("tp2_" + T.id + "_crv2"); } catch (e) {}
            const s2 = sess(); if (s2 && s2.tps[T.id]) { Object.assign(s2.tps[T.id], { soumis: null, debutTP: R.debutTP || null, finTP: R.finTP || null }); s2.skew = Date.parse(R.serveur) - Date.now() || 0; store.set("session", s2); }
            location.hash = T.id; location.reload();
          } catch (err) { rb.disabled = false; rm.textContent = "Pas de connexion internet : impossible de recommencer pour l'instant."; rm.className = "msg bad"; }
        };
      }
      cr.querySelectorAll("input, textarea").forEach(e => e.disabled = true);
      $("#" + T.id + "-sub").querySelector(".chk").hidden = true; $("#" + T.id + "-send").hidden = true; $("#" + T.id + "-clr").hidden = true;
      cr.querySelectorAll("[data-del]").forEach(b => b.remove());
    };
    const smsg = (s, kind) => { const e = $("#" + T.id + "-smsg"); e.textContent = s; e.className = "msg" + (kind ? " " + kind : ""); };
    const lockCR = () => { cr.querySelectorAll("input, textarea, select").forEach(e => e.disabled = true); ["-send", "-clr"].forEach(x => { const e = $("#" + T.id + x); if (e) e.disabled = true; }); };
    const PEND_MSG = "Pas de connexion internet : ton compte rendu est VERROUILLÉ (plus aucune modification possible). Il sera envoyé automatiquement dès le retour de la connexion. Garde cette page ouverte, ou rouvre-la plus tard avec une connexion.";
    const buildPayload = () => {
      const id = {}; ["nom", "prenom", "carte", "groupe", "sousgroupe", "binome"].forEach(f => id[f] = ($("#" + T.id + "-" + f).value || "").trim());
      id.carte = SS.etudiant.carte; id.code = SS.code;
      const seance = ($("#" + T.id + "-seance") || {}).value || "";
      const fillOut = {}; keys.forEach(k => fillOut[k] = T.rows[k].map((_, i) => { const o = {}; CR.parts[k].fill.forEach(c => o[c.k] = (S.fill[k][i] || {})[c.k] ?? ""); return o; }));
      const qOut = {}, qv = {}; QS.forEach(([qi]) => { if (S.qcm["q" + qi] != null) { qOut["q" + qi] = S.qcm["q" + qi]; if (typeof qi === "string" && QDV[qi]) qv["q" + qi] = QDV[qi][+S.qcm["q" + qi]]; } });
      return { action: "submit", qv, qz: S.qz ? { deb: new Date(S.qz.deb).toISOString(), d: S.qz.d.slice(), n: QS.length, qsec: QSEC } : null, tp: T.id, num: T.num, id, seance, device: device(), journal: journalResume(), raw: T.rows, fill: fillOut, calc: S.calc, qcm: qOut, rem: ($("#" + T.id + "-rem").value || "").slice(0, 2000), client: new Date().toISOString() };
    };
    // gel du compte rendu : copie figée à l'instant t (heure de l'appareil + décalage avec le serveur), conservée jusqu'à l'envoi
    const freeze = (payload, t) => {
      const gel = new Date(t).toISOString();
      PEND = Object.assign(payload, { differe: true, gel, client: gel, skew: (sess() || {}).skew || 0 });
      store.set(T.id + "_pending", PEND); lockCR();
    };
    let rt = null;
    const retryLater = () => { if (rt) return; rt = setInterval(() => { if (SUB || !PEND || PEND.refus) { clearInterval(rt); rt = null; return; } if (navigator.onLine !== false) doSend(true); }, 20000); };
    addEventListener("online", () => { if (PEND && !SUB && !PEND.refus) doSend(true); });
    const doSend = async auto => {
      if (SUB || sending) return;
      if (PEND && PEND.refus) return;
      let payload = PEND;
      if (!payload) {
        if (!SS) { smsg("Connecte-toi d'abord en haut de la page (n° de carte et code personnel) : la soumission est réservée aux étudiants inscrits.", "bad"); $("#tpLogin").scrollIntoView({ behavior: "smooth" }); return; }
        const miss = ["nom", "prenom", "carte", "groupe", "sousgroupe"].filter(f => !($("#" + T.id + "-" + f).value || "").trim());
        if (miss.length && !auto) { smsg("Complète d'abord l'identification : nom, prénom, n° de carte étudiant, groupe et sous-groupe.", "bad"); $("#" + T.id + "-" + miss[0]).focus(); return; }
        const seance = ($("#" + T.id + "-seance") || {}).value || "";
        if (ST && ST.seance && !seance.trim() && !auto) { smsg("Saisis le code de séance donné par l'enseignant.", "bad"); $("#" + T.id + "-seance").focus(); return; }
        if (!$("#" + T.id + "-ok").checked && !auto) { smsg("Coche la case de certification avant de soumettre.", "bad"); return; }
        if (!endpoint()) { smsg("La soumission en ligne n'est pas encore activée par l'enseignant. Utilise « Télécharger une copie » en attendant.", "bad"); return; }
        payload = buildPayload();
      }
      const btn = $("#" + T.id + "-send"); btn.disabled = true; sending = true;
      smsg(PEND ? "Envoi de ton compte rendu verrouillé…" : auto ? "Temps écoulé : envoi automatique de ton compte rendu…" : "Envoi et correction en cours…");
      try {
        const R = await post(payload, k => smsg(waitMsg(k), "bad"), PEND ? 3 : auto ? 10 : 6);
        if (R.ok) { SUB = Object.assign({ date: new Date().toISOString() }, R); store.set(T.id + "_submitted", SUB); store.del(T.id + "_pending"); PEND = null; { const tb = $("#" + T.id + "-timer"); if (tb) tb.hidden = true; } const s2 = sess(); if (s2 && s2.tps[T.id]) { s2.tps[T.id].soumis = SUB; store.set("session", s2); }
          smsg(R.nonConforme ? "Compte rendu enregistré. Attention : tes mesures ne correspondent pas au matériel qui t'a été attribué ; ton enseignant en est informé." : "Compte rendu soumis et corrigé.", R.nonConforme ? "bad" : "ok"); showNote(SUB); }
        else if (R.duplicate) { SUB = { date: new Date().toISOString(), note: NaN }; store.set(T.id + "_submitted", SUB); store.del(T.id + "_pending"); PEND = null; smsg(R.error, "bad"); showNote(SUB); }
        else if (PEND) { PEND.refus = R.error || "refusé"; store.set(T.id + "_pending", PEND); smsg("Ton compte rendu verrouillé n'a pas été accepté par le serveur : " + (R.error || "") + " Adresse-toi à ton enseignant (garde ta copie avec « Télécharger une copie »).", "bad"); }
        else { btn.disabled = false; smsg((R.error || "La soumission a échoué.") + (R.auth ? " Déconnecte-toi puis reconnecte-toi en haut de la page." : ""), "bad"); }
      } catch (err) {
        // pas de réseau : la copie est figée telle quelle et partira toute seule
        if (!PEND) freeze(payload, Date.now());
        smsg(PEND_MSG, "bad"); retryLater();
      }
      sending = false;
    };
    let sending = false;
    $("#" + T.id + "-send").onclick = () => doSend(false);

    /* minuteur du TP (durée fixée par l'enseignant ; heure du serveur) */
    const left = () => Date.parse(ST.finTP) - (Date.now() + ((sess() || {}).skew || 0));
    const timed = () => !(ST && ST.duree) || SUB ? "" : !ST.finTP ? "avant" : left() <= 0 ? "fini" : "en cours";
    const tbox = $("#" + T.id + "-timer");
    let autoDone = false;
    const qVis = () => { const avant = timed() === "avant", qb = $("#" + T.id + "-qbox"), qw = $("#" + T.id + "-qwait"); if (qb) qb.hidden = avant; if (qw) qw.hidden = !avant; };
    const drawTimer = () => {
      qVis();
      if (!tbox) return;
      if (SUB) { tbox.hidden = true; return; }
      const st = timed();
      if (st === "avant") {
        if (!tbox.dataset.st) tbox.innerHTML = `<div><b>TP minuté : ${ST.duree} min.</b> Le minuteur démarre quand tu cliques sur « Commencer le TP » et ne peut plus être arrêté, même si tu fermes la page. À la fin du temps, ton compte rendu est envoyé automatiquement dans l'état où il se trouve.</div>${ST.etat ? "" : `<button type="button" class="btn primary" id="${T.id}-go">Commencer le TP</button>`}<p class="msg" id="${T.id}-tmsg"></p>`;
        tbox.dataset.st = "avant"; tbox.className = "timer noprint";
        const go = $("#" + T.id + "-go"); if (go && !go.onclick) go.onclick = async () => {
          if (!confirm(`Commencer le TP n°${T.num} ? Tu disposeras de ${ST.duree} minutes à partir de maintenant. Les mesures d'entraînement déjà faites pour ce TP seront effacées.`)) return;
          go.disabled = true; const m = $("#" + T.id + "-tmsg"); m.textContent = "Démarrage…"; m.className = "msg";
          try {
            const R = await post({ action: "start", tp: T.id, carte: SS.etudiant.carte, code: SS.code, device: device() }, k => { m.textContent = waitMsg(k); });
            if (!R.ok) { go.disabled = false; m.textContent = R.error; m.className = "msg bad"; return; }
            ST.debutTP = R.debutTP; ST.finTP = R.finTP; const s2 = sess(); if (s2) { s2.tps[T.id].debutTP = R.debutTP; s2.tps[T.id].finTP = R.finTP; s2.skew = Date.parse(R.serveur) - Date.now() || 0; store.set("session", s2); }
            T.clearRows(); store.set(T.id + "_journal", null); T.msg("Le TP a commencé : bon travail !", "ok"); drawTimer();
          } catch (err) { go.disabled = false; m.textContent = "Pas de connexion internet : impossible de démarrer le minuteur."; m.className = "msg bad"; }
        };
        return;
      }
      const ms = left(), tot = ST.duree * 60000;
      tbox.dataset.st = st;
      tbox.className = "timer noprint run" + (ms <= 120000 ? " bad" : ms <= 600000 ? " warn" : "");
      tbox.innerHTML = st === "fini" ? `<b>Temps écoulé.</b> <span>${SUB ? "" : PEND && PEND.refus ? "Compte rendu verrouillé, refusé par le serveur : adresse-toi à ton enseignant." : "Compte rendu verrouillé : il est envoyé automatiquement, dès que la connexion le permet."}</span>`
        : `<span>Temps restant</span><b class="tleft">${hms(ms)}</b><span class="tbar"><i style="width:${Math.max(0, Math.min(100, ms / tot * 100)).toFixed(1)}%"></i></span><span>fin à ${new Date(Date.parse(ST.finTP) - ((sess() || {}).skew || 0)).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>`;
      if (st === "fini" && !autoDone && !SUB) {
        autoDone = true; lockCR();
        // copie figée à la fin du temps (ou à la dernière modification si la page était fermée) : plus aucune modification possible
        if (!PEND && SS) freeze(buildPayload(), Math.min(Date.now(), S.maj || Date.now()));
        smsg("Temps écoulé : ton compte rendu est verrouillé et va être envoyé automatiquement. S'il n'y a pas de connexion, il partira dès son retour.", "bad");
        // envoi étalé sur 90 s pour ne pas saturer le serveur quand tout un groupe termine en même temps
        setTimeout(() => doSend(true), Math.random() * 90000); retryLater();
      }
    };
    if (tbox) { TIMERS.push(drawTimer); drawTimer(); } else qVis();
    /* ---------- QCM chronométré : une question à la fois, mesures verrouillées ---------- */
    const QSEC = ST && ST.qsec != null ? +ST.qsec : 30;
    // durée de la question i : double pour les questions qui demandent un calcul sur la droite de régression
    const qdur = i => { const q = QS[i], t = q && typeof q[0] === "string" ? QDT(q[0]) : null; return QSEC * (t && t.g ? 2 : 1); };
    const qzOn = () => !!(SS && QS.length && QSEC > 0);
    const qzOK = inp => { if (!qzOn() || SUB) return true; const fs = inp.closest("fieldset"); return !!(S.qz && fs && +fs.dataset.qi === S.qz.i); };
    let qzTick = null;
    function qzAdvance() { if (!S.qz) return; S.qz.d.push(Date.now() - S.qz.t); S.qz.i++; S.qz.t = Date.now(); save(); qzRender(); }
    function qzRender() {
      const ctl = $("#" + T.id + "-qzctl"); if (!ctl) return;
      const F = [...host.querySelectorAll("#" + T.id + "-qbox fieldset.qcm")], N = F.length;
      if (!qzOn() || SUB || PEND) { ctl.innerHTML = ""; F.forEach(f => f.hidden = false); if (qzTick) { clearInterval(qzTick); qzTick = null; } if (SUB || PEND) F.forEach(f => f.querySelectorAll("input").forEach(x => x.disabled = true)); return; }
      if (!S.qz) {
        F.forEach(f => f.hidden = true);
        ctl.innerHTML = `<div class="qzintro"><p><b>QCM chronométré : ${N} questions, ${QSEC} s par question (${2 * QSEC} s pour celles qui portent sur ta droite).</b> Les questions s'affichent <b>une par une</b>, sans retour en arrière. Quand le temps d'une question est écoulé, on passe automatiquement à la suivante.</p><p><b>Dernière étape du TP :</b> en commençant le QCM, tes mesures, ton tableau et tes calculs sont <b>verrouillés définitivement</b>. Termine-les avant.</p><button type="button" class="btn primary" id="${T.id}-qzgo">Je réponds au QCM</button></div>`;
        $("#" + T.id + "-qzgo").onclick = () => {
          if (!keys.some(k => T.rows[k].length)) { T.msg("Fais d'abord tes mesures.", "bad"); return; }
          if (!confirm("Commencer le QCM ?\n\nTes mesures, ton tableau et tes calculs seront verrouillés définitivement.\n" + N + " questions, " + QSEC + " s chacune (" + 2 * QSEC + " s pour celles qui portent sur ta droite), sans retour en arrière.")) return;
          S.qz = { deb: Date.now(), t: Date.now(), i: 0, d: [] }; save();
          T.renderAll(); cr.querySelectorAll("[data-calc]").forEach(x => x.disabled = true);
          qzRender();
        };
        return;
      }
      cr.querySelectorAll("[data-calc]").forEach(x => x.disabled = true);
      if (S.qz.i >= N) {
        if (qzTick) { clearInterval(qzTick); qzTick = null; }
        F.forEach(f => { f.hidden = false; f.querySelectorAll("input").forEach(x => x.disabled = true); });
        ctl.innerHTML = `<p class="msg ok">QCM terminé : tes réponses sont enregistrées (elles ne peuvent plus être modifiées). Tu peux maintenant soumettre ton compte rendu.</p>`;
        return;
      }
      const left = qdur(S.qz.i) * 1000 - (Date.now() - S.qz.t);
      if (left <= 0) { qzAdvance(); return; }
      F.forEach((f, j) => { f.hidden = j !== S.qz.i; const off = j !== S.qz.i || (f.classList.contains("qd") && f.dataset.ok !== "1"); f.querySelectorAll("input").forEach(x => x.disabled = off); });
      const last = S.qz.i === N - 1;
      if (!ctl.querySelector(".qzbar") || +ctl.dataset.i !== S.qz.i) {
        ctl.dataset.i = S.qz.i;
        ctl.innerHTML = `<div class="qzbar"><span>Question <b>${S.qz.i + 1}</b> / ${N}</span><b class="qzt"></b><span class="tbar"><i></i></span><button type="button" class="btn primary sm" id="${T.id}-qznext">${last ? "Terminer le QCM" : "Valider et passer à la suivante"}</button></div>`;
        $("#" + T.id + "-qznext").onclick = () => { if (!confirm(last ? "Terminer le QCM ? Tes réponses seront définitives." : "Passer à la question suivante ? Tu ne pourras plus revenir à celle-ci.")) return; qzAdvance(); };
      }
      const sec = Math.ceil(left / 1000);
      ctl.querySelector(".qzt").textContent = sec + " s"; ctl.querySelector(".qzt").style.color = sec <= 10 ? "var(--rouge)" : "";
      ctl.querySelector(".tbar i").style.width = (left / (qdur(S.qz.i) * 1000) * 100).toFixed(1) + "%";
      if (!qzTick) qzTick = setInterval(() => qzRender(), 250);
    }
    qzRender();
    /* ---------- surveillance pendant le TP minuté ---------- */
    // Remarque : aucun navigateur ne signale une capture faite avec les boutons du téléphone ; on enregistre ce qui est détectable
    // (sortie de la page ou de l'application, touche Impr. écran, raccourcis de capture, copie, impression) et on filigrane la page.
    const surv = () => !!(SS && ST && ST.duree && timed() === "en cours");
    const J = () => store.get(T.id + "_journal", null) || { sorties: 0, hors: 0, focus: 0, cap: 0, imp: 0, cop: 0, ev: [] };
    const jq = [];   // événements à transmettre tout de suite au serveur
    const jflush = beacon => {
      if (!jq.length || !SS || !endpoint()) return;
      const body = JSON.stringify({ action: "journal", tp: T.id, carte: SS.etudiant.carte, code: SS.code, device: device(), ev: jq.splice(0, 20) });
      try { if (beacon && navigator.sendBeacon) { navigator.sendBeacon(endpoint(), new Blob([body], { type: "text/plain;charset=utf-8" })); return; } } catch (e) {}
      fetch(endpoint(), { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body, keepalive: true }).catch(() => {});
    };
    let jt = null;
    const jlog = (type, detail, now, ms) => {
      if (!surv()) return;
      const j0 = J(), last = j0.ev[j0.ev.length - 1];
      if (type === "capture" && last && last.type === "capture" && Date.now() - last.t < 2500) return;   // même capture (touche enfoncée puis relâchée)
      const j = J(), t = Date.now(), e = { t, srv: new Date(t + ((sess() || {}).skew || 0)).toISOString(), type, detail: detail || "" };
      j.ev.push(e); if (j.ev.length > 80) j.ev.splice(0, j.ev.length - 80);
      if (type === "retour") j.sorties++; if (type === "capture") j.cap++; if (type === "impression") j.imp++; if (type === "copie") j.cop++; if (type === "focus") j.focus++;
      if (ms) { e.dureeMs = ms; if (type === "retour") j.hors += ms; }
      store.set(T.id + "_journal", j); jq.push(e);
      if (now) jflush(true); else { clearTimeout(jt); jt = setTimeout(() => jflush(false), 1500); }
      if (type === "capture" || type === "impression") T.msg("Capture ou impression détectée : l'événement est transmis à ton enseignant.", "bad");
    };
    const journalResume = () => { const j = store.get(T.id + "_journal", null); if (!j) return null; return { sorties: j.sorties, horsSec: Math.round(j.hors / 1000), focus: j.focus, captures: j.cap, impressions: j.imp, copies: j.cop, ev: j.ev.slice(-60).map(e => ({ t: e.srv, type: e.type, detail: e.detail, ms: e.dureeMs || 0 })) }; };
    let hiddenAt = 0, blurAt = 0, lastKey = { k: "", t: 0 };
    document.addEventListener("visibilitychange", () => {
      if (!surv()) return;
      if (document.visibilityState === "hidden") { hiddenAt = Date.now(); jlog("sortie", "page masquée (autre application, autre onglet ou écran éteint)", true); }
      else if (hiddenAt) { const d = Date.now() - hiddenAt; hiddenAt = 0; jlog("retour", "retour après " + Math.round(d / 1000) + " s", false, d); }
    });
    addEventListener("blur", () => { if (surv() && document.visibilityState === "visible") { blurAt = Date.now(); if (Date.now() - lastKey.t < 1500 && /Meta|OS|Shift/.test(lastKey.k)) jlog("capture", "outil de capture probable (" + lastKey.k + " puis perte du focus)", true); } });
    addEventListener("focus", () => { if (blurAt && surv()) { const d = Date.now() - blurAt; blurAt = 0; if (d > 3000 && !hiddenAt) jlog("focus", "fenêtre quittée pendant " + Math.round(d / 1000) + " s (autre fenêtre ou outil au premier plan)", false, d); } });
    addEventListener("keydown", e => {
      if (!surv()) return; lastKey = { k: (e.metaKey ? "Meta+" : "") + (e.ctrlKey ? "Ctrl+" : "") + (e.shiftKey ? "Shift+" : "") + e.key, t: Date.now() };
      const k = (e.key || "").toLowerCase();
      if (e.key === "PrintScreen" || e.code === "PrintScreen") jlog("capture", "touche Impr. écran", true);
      else if (e.metaKey && e.shiftKey && ["3", "4", "5", "s"].includes(k)) jlog("capture", "raccourci de capture " + lastKey.k, true);
      else if ((e.ctrlKey || e.metaKey) && k === "p") jlog("impression", "raccourci d'impression " + lastKey.k, true);
    }, true);
    addEventListener("keyup", e => { if (surv() && (e.key === "PrintScreen" || e.code === "PrintScreen")) jlog("capture", "touche Impr. écran (relâchée)", true); }, true);
    addEventListener("beforeprint", () => jlog("impression", "impression ou export PDF de la page", true));
    document.addEventListener("copy", () => { if (surv()) jlog("copie", "texte copié : " + String(getSelection() || "").slice(0, 60), false); });
    addEventListener("pagehide", () => jflush(true));
    // filigrane nominatif : toute capture qui circule permet de retrouver son auteur
    if (SS && ST && ST.duree) {
      const wm = (SS.etudiant.prenom + " " + SS.etudiant.nom + " · " + SS.etudiant.carte).replace(/[<&"]/g, "");
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='170'><text x='10' y='100' transform='rotate(-22 180 85)' font-family='Arial' font-size='15' fill='rgba(128,128,128,0.16)'>${wm} · TP ${T.num}</text></svg>`;
      const url = "url(\"data:image/svg+xml;utf8," + encodeURIComponent(svg) + "\")";
      [cr, host.querySelector(".lab")].forEach(el => { if (!el) return; el.style.position = "relative"; const d = document.createElement("div"); d.className = "wm noprint-not"; d.setAttribute("aria-hidden", "true"); d.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:5;background-image:" + url; el.appendChild(d); });
    }
    if (PEND && !SUB) { lockCR(); if (PEND.refus) smsg("Ton compte rendu verrouillé n'a pas été accepté par le serveur : " + PEND.refus + " Adresse-toi à ton enseignant.", "bad"); else { smsg(PEND_MSG, "bad"); setTimeout(() => doSend(true), 1500); retryLater(); } }
    $("#" + T.id + "-dl").onclick = () => {
      const val = f => ($("#" + T.id + "-" + f) || {}).value || "";
      const tables = keys.map((k, i) => { const p = CR.parts[k]; const cv = p.plot ? $("#" + T.id + "-gr-" + k) : null;
        return `<h2>Partie ${L[i]} — ${esc(p.titre)}</h2>${p.aide ? `<p style="font-family:Arial;font-size:13px;background:#EEF4F6;padding:6px 10px">${p.aide}</p>` : ""}<table><tr>${p.cols.concat(p.fill.map(f => f.h)).map(c => `<th>${c}</th>`).join("")}</tr>${T.rows[k].map((r, j) => `<tr>${p.cells(r, j).concat(p.fill.map(c => esc((S.fill[k][j] || {})[c.k] ?? ""))).map(v => `<td>${v}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="9">Aucune mesure</td></tr>`}</table>${cv && T.rows[k].length ? `<img src="${cv.toDataURL("image/png")}" alt="Graphe" style="max-width:100%;border:1px solid #ccc">` : ""}`; }).join("");
      const calcs = CR.calc.map(c => `<tr><td style="text-align:left">${c.h}</td><td>${esc(S.calc[c.k] || "")} ${esc(c.u)}</td></tr>`).join("");
      const qcm = QS.map(([qi], i) => { if (typeof qi === "string") { const fs = host.querySelector(`fieldset.qd[data-qd="${qi}"]`), t = QDT(qi), j = S.qcm["q" + qi]; return `<p><b>${i + 1}. ${esc(fs ? fs.querySelector(".qdq").textContent : qi)}</b><br>${j != null && QDV[qi] && t ? esc(window.TPQD.fmt(QDV[qi][+j], t.sig) + " " + t.u) : "(sans réponse)"}</p>`; } const q = CR.qcm[qi]; return `<p><b>${i + 1}. ${q.q}</b><br>${S.qcm["q" + qi] != null ? esc(q.o[+S.qcm["q" + qi]]) : "(sans réponse)"}</p>`; }).join("");
      const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Compte rendu TP ${T.num} — ${esc(val("nom"))}</title><style>body{font-family:Georgia,serif;max-width:820px;margin:24px auto;padding:0 16px;color:#111}h1{font-family:Arial,sans-serif;font-size:20px;border-bottom:3px solid #D98E04;padding-bottom:6px}h2{font-family:Arial,sans-serif;font-size:16px;color:#1F7A8C;margin-top:22px}table{border-collapse:collapse;margin:8px 0;font-family:monospace;font-size:13px}th,td{border:1px solid #999;padding:4px 8px;text-align:right}th{background:#EEF4F6}</style></head><body>
        <div style="font-family:Arial;font-size:12px;color:#B87503;font-weight:bold">UNIVERSITÉ SOULEYMANE NIANG DE MATAM • PHYSIQUE L1</div><h1>Compte rendu — TP n°${T.num} : ${esc(T.titre)}</h1>
        <p><b>${esc(val("nom"))} ${esc(val("prenom"))}</b> — carte n° ${esc(val("carte"))} — groupe ${esc(val("groupe"))}, sous-groupe ${esc(val("sousgroupe"))}${val("binome") ? " — binôme : " + esc(val("binome")) : ""}</p>
        ${SUB && isFinite(SUB.note) ? `<p><b>Note obtenue : ${String(SUB.note).replace(".", ",")} / 20</b></p>` : ""}${tables}<h2>Résultats et calculs</h2><table>${calcs}</table><h2>QCM</h2>${qcm}</body></html>`;
      const b = new Blob([html], { type: "text/html;charset=utf-8" }), a = document.createElement("a");
      a.href = URL.createObjectURL(b); a.download = `CR_TP${T.num}_${(val("nom") || "etudiant").replace(/\s+/g, "_")}.html`; document.body.appendChild(a); a.click(); a.remove();
    };

    T.init(T);
    if (SS) host.querySelectorAll('.panel button[id$="New"]').forEach(b => b.remove());   // matériel personnel : on ne peut plus en changer
    T.renderAll();
    if (SUB) showNote(SUB);
  }
  let cur = null;
  function go(id, initial) {
    cur = id;
    document.querySelectorAll("#tabs [data-t]").forEach(b => b.setAttribute("aria-pressed", b.dataset.t === id));
    TPS.forEach(t => { document.getElementById(t.id).hidden = t.id !== id; });
    if (!initial) history.replaceState(null, "", "#" + id);   // au chargement, ne pas ajouter d'ancre : le navigateur ferait défiler la page
    const T = TPS.find(t => t.id === id); T.draw && T.draw(); T.renderAll();
  }
  function start() {
    // un TP dont le fichier n'est pas encore à jour (copie ancienne en cache) est ignoré au lieu de bloquer toute la page
    for (let i = TPS.length - 1; i >= 0; i--) if (!(window.TPCR || {})[TPS[i].id]) TPS.splice(i, 1);
    TPS.sort((a, b) => a.num - b.num);
    const groups = {}; TPS.forEach(t => (groups[t.disc] = groups[t.disc] || []).push(t));
    $("#tabs").innerHTML = Object.entries(groups).map(([g, l]) => `<div class="grp"><div class="grp-t">${esc(g)}</div><div class="pill-row">${l.map(t => `<button type="button" class="pill" data-t="${t.id}" aria-pressed="false">TP ${t.num} · ${esc(t.court)}</button>`).join("")}</div></div>`).join("");
    const changed = applySession();
    loginCard(changed);
    // mise à jour silencieuse de la connexion à chaque ouverture : questions, dates, durée et copies déjà soumises
    (async () => {
      const s0 = sess(); if (!s0 || !endpoint() || !navigator.onLine) return;
      try {
        const R = await post({ action: "login", carte: s0.etudiant.carte, code: s0.code, device: device() }, null, 2);
        if (!R || !R.ok || !R.tps) return;
        const key = t => JSON.stringify(Object.keys(t).sort().map(k => [k, t[k].qcm, t[k].params, t[k].duree, t[k].debutTP || null, !!t[k].soumis, t[k].etat, t[k].seance]));
        if (key(R.tps) === key(s0.tps)) return;
        store.set("session", Object.assign({}, s0, { tps: R.tps, skew: Date.parse(R.serveur) - Date.now() || 0 }));
        let n = 0; try { n = +sessionStorage.getItem("tp2_autoref") || 0; } catch (e) {}
        if (n < 2) { try { sessionStorage.setItem("tp2_autoref", n + 1); } catch (e) {} location.reload(); }
      } catch (e) {}
    })();
    TPS.slice().forEach(T => { try { mount(T); } catch (err) { console.error("TP " + T.id, err); TPS.splice(TPS.indexOf(T), 1); const e = document.getElementById(T.id); if (e) e.remove(); const t = document.querySelector(`#tabs [data-t="${T.id}"]`); if (t) t.remove(); } });
    $("#tabs").addEventListener("click", e => { const b = e.target.closest("[data-t]"); if (b) go(b.dataset.t); });
    addEventListener("hashchange", () => { const h = location.hash.slice(1); if (TPS.some(t => t.id === h) && h !== cur) go(h); });
    let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { const T = TPS.find(t => t.id === cur); T.draw && T.draw(); T.renderAll(); }, 120); });
    const h = location.hash.slice(1); go(TPS.some(t => t.id === h) ? h : TPS[0].id, true);
    // boucle d'animation unique : seul le TP affiché avance
    let last = null;
    const loop = ts => { let dt = last == null ? 0 : (ts - last) / 1000; last = ts; if (dt > 0.5) dt = 0;   // temps réel (pause seulement si l'onglet a été quitté)
      const T = TPS.find(t => t.id === cur); if (T && T.tick && dt > 0) T.tick(dt); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
  window.TPCORE = { build: 49, scatter, register, start, $, css, esc, fr, gauss, store, fit, txt, linreg, chrono, isCur: id => cur === id };
})();
