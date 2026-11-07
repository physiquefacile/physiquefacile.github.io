/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* TP de chimie de L1 : C2 conductimétrie, C3 alcalimétrie, C4 produit de solubilité,
   C5 chlorométrie, C6 manganimétrie I, C7 manganimétrie II */
(function () {
  "use strict";
  const { register, $, css, store, fit, txt } = window.TPCORE;
  const seg = (id, items, cur) => `<div class="seg" role="group">${items.map(([v, l]) => `<button type="button" data-${id}="${v}" aria-pressed="${v === cur}">${l}</button>`).join("")}</div>`;
  const setSeg = (id, v) => document.querySelectorAll(`[data-${id}]`).forEach(b => b.setAttribute("aria-pressed", b.getAttribute("data-" + id) === v));
  const fx = (x, d) => isFinite(x) ? (+x).toFixed(d).replace(".", ",") : "—";
  const f2 = x => fx(x, 2);
  const rnd = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
  const U = (a, b) => a + Math.random() * (b - a);

  /* ---------- chimie des solutions : pH par électroneutralité (dichotomie sur log h) ---------- */
  const KW = 1e-14, K1C = Math.pow(10, -6.35), K2C = Math.pow(10, -10.33), KA = Math.pow(10, -4.76);
  const pHsol = Q => {
    let lo = -14.5, hi = 0.5;
    for (let i = 0; i < 80; i++) {
      const m = (lo + hi) / 2, h = Math.pow(10, m);
      let f = h + (Q.Na || 0) - KW / h - (Q.Cl || 0);
      if (Q.cw) f -= Q.cw * KA / (KA + h);
      if (Q.cc) f -= Q.cc * (K1C * h + 2 * K1C * K2C) / (h * h + K1C * h + K1C * K2C);
      if (f > 0) hi = m; else lo = m;
    }
    return -(lo + hi) / 2;
  };
  const phen = pH => { const f = 1 / (1 + Math.pow(10, 9.3 - pH)); return pH >= 8.2 ? `rgba(226,52,146,${(0.15 + 0.75 * f).toFixed(3)})` : null; };
  const helia = pH => { const t = Math.max(0, Math.min(1, (pH - 3.1) / 1.3)); const r = 225 + 15 * t, g = Math.round(55 + 150 * t), b = 45; return `rgba(${r},${g},${b},.62)`; };
  const EAU = "rgba(170,205,235,.45)";

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
      c.fillStyle = mu; c.fillRect(bw * 0.12, top - 4, 5, H0 * 0.9 - top + 4); c.fillRect(bw * 0.06, H0 * 0.90, bw * 0.3, 7);
      if (o.V != null) {
        c.fillRect(bw * 0.12, top + H0 * 0.12, bx - bw * 0.12, 4);
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
      const G = { c, bx, bw, H0, vy0, vy1, fg, mu, ac, narrow, F };
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
        if (o.probe) { c.fillStyle = "#444"; c.fillRect(bx + bs * 0.45, vy0 - H0 * 0.26, 8, H0 * 0.26 + (vy1 - vy0) * 0.75); c.fillStyle = o.probe === "cond" ? "#b0b0b0" : "#9cc3d5"; c.fillRect(bx + bs * 0.45 - (o.probe === "cond" ? 3 : 0), vy1 - (vy1 - vy0) * 0.25, o.probe === "cond" ? 14 : 8, (vy1 - vy0) * 0.12); }
        if (o.stir) { c.fillStyle = mu; c.fillRect(bx - bs * 0.3, vy1 - 6, bs * 0.6, 4); }
      }
      if (o.custom) o.custom(G);
      if (o.stir || o.heat) { c.fillStyle = o.heat ? "#5a3b33" : "#3d4650"; c.fillRect(bx - bw * 0.26, vy1 + 1, bw * 0.52, H0 * 0.9 - vy1 - 1); if (o.heat) { c.fillStyle = "#ff7043"; c.fillRect(bx - bw * 0.2, vy1 + 3, bw * 0.4, 3); } }
      if (o.temp != null) {   // thermomètre
        const tx = bx + bw * 0.33, ty0 = vy0 - H0 * 0.2, ty1 = vy1 - 8, fr = Math.max(0, Math.min(1, (o.temp - 10) / 90));
        c.strokeStyle = fg; c.lineWidth = 1; c.strokeRect(tx - 3, ty0, 6, ty1 - ty0); c.fillStyle = "#d32f2f"; c.fillRect(tx - 2, ty1 - (ty1 - ty0) * fr, 4, (ty1 - ty0) * fr); c.beginPath(); c.arc(tx, ty1 + 3, 5, 0, 7); c.fill();
        F(fx(o.temp, 1) + " °C", tx, ty0 - 6, "#d32f2f", "center", "600 12px 'Fira Mono',monospace");
      }
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
        if (o.probe) { c.strokeStyle = "#444"; c.lineWidth = 2; c.beginPath(); c.moveTo(narrow ? rx + rw * 0.8 : rx, narrow ? my : my + mh * 0.8); c.quadraticCurveTo(narrow ? rx + rw * 0.8 : rx - 20, narrow ? my - 40 : my + mh + 30, (o.probeX != null ? o.probeX : bx + bw * 0.09) + 4, vy0 - H0 * 0.26); c.stroke(); }
        ny = my + mh + 22;
      }
      if (o.curve) {
        const K = o.curve, gy = ny - 8, gh = ry + rh - gy - 22, gx = rx + 34, gw = rw - 44;
        c.strokeStyle = mu; c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh);
        const X = v => gx + v / K.xmax * gw, Yc = p => gy + gh - p / K.ymax * gh;
        const st = K.ymax / (gh < 170 ? 4 : 7); for (let i = 0; i <= (gh < 170 ? 4 : 7); i++) F(String(+(i * st).toPrecision(2)).replace(".", ","), gx - 4, Yc(i * st) + 4, mu, "right", "10px 'Fira Sans',Arial");
        for (let v = 0; v <= K.xmax + 1e-9; v += K.xmax / 5) F(String(+v.toFixed(1)).replace(".", ","), X(v), gy + gh + 13, mu, "center", "10px 'Fira Sans',Arial");
        F(K.lab, gx + 4, gy + 14);
        c.fillStyle = ac; K.pts.forEach(([x, y]) => { c.beginPath(); c.arc(X(x), Yc(y), 3, 0, 7); c.fill(); });
        if (K.cur != null) { c.strokeStyle = "#FFB000"; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(K.cur), gy); c.lineTo(X(K.cur), gy + gh); c.stroke(); c.setLineDash([]); }
      } else (o.side || []).forEach(([s, col, bold], i) => F(s, rx, ny + i * 21, col || fg, "left", (bold ? "600 13px" : "12px") + " 'Fira Sans',Arial"));
    };
    return B;
  }
  const burHTML = (px, lab, steps) => `<div id="${px}Bur"><h3>Burette (${lab})</h3><div class="row">${(steps || [["1", "+ 1 mL"], ["0.5", "+ 0,5 mL"], ["0.2", "+ 0,2 mL"], ["0.05", "+ 1 goutte"]]).map(([v, l]) => `<button type="button" class="btn sm" data-${px}v="${v}">${l}</button>`).join("")}</div>
      <button type="button" class="btn sm" id="${px}Raz">Nouveau dosage (burette au zéro, nouvelle prise)</button></div>`;
  const lcd = (px, rows) => `<dl class="lcd">${rows.map(([k, l]) => `<dt id="${px}${k}t">${l}</dt><dd id="${px}${k}"></dd>`).join("")}</dl>`;
  /* état persistant d'un TP (montage, volumes versés, réglages) */
  const state = (key, def) => { let s = Object.assign(JSON.parse(JSON.stringify(def)), store.get(key, {})); Object.keys(def).forEach(k => { if (def[k] && typeof def[k] === "object" && !Array.isArray(def[k])) s[k] = Object.assign({}, def[k], s[k] || {}); }); return s; };
  const params = (T, key, mk, ok) => { let P = store.get(key, null); if (!P || !ok(P)) { P = mk(); store.set(key, P); } return P; };
  const lockedMsg = T => { if (T.locked()) { T.msg("Compte rendu déjà soumis : le matériel ne peut plus être changé.", "bad"); return true; } return false; };
  const addV = (T, st, key, dv, max) => { const V = st[key] || 0; if (V + dv > (max || 50) + 1e-9) { T.msg("La burette est vide : clique sur « Nouveau dosage » pour la remplir.", "bad"); return false; } st[key] = rnd(V + dv, 2); return true; };
  window.TPX = window.TPX || {}; window.TPX.chim = { pHsol };

  /* ======================================================================
     TP C2 : CONDUCTIMÉTRIE
     ====================================================================== */
  const LB = { H: 35.0, OH: 19.8, Na: 5.0, Cl: 7.6, A: 4.1 };
  const AF = 1.41 / (10 * 0.01 * (7.35 + 7.6));   // conductivités « effectives » : la solution de KCl à 0,0100 mol/L vaut 1,41 mS/cm
  const sigma = (cs, cw, V) => {   // 20,0 mL d'acide + 200 mL d'eau, soude à 0,100 mol/L ; σ en mS/cm
    const Vt = 220 + V, Na = 0.1 * V / Vt, Cl = cs * 20 / Vt, W = cw * 20 / Vt, pH = pHsol({ Na, Cl, cw: W }), h = Math.pow(10, -pH), A = W * KA / (KA + h);
    return AF * 10 * (LB.H * h + LB.OH * KW / h + LB.Na * Na + LB.Cl * Cl + LB.A * A);
  };
  window.TPX.chim.sigma = sigma;
  register({
    id: "conducti", num: 22, lab: "C2", disc: "Chimie", court: "Conductimétrie",
    titre: "Conductimétrie : dosage d'un acide fort, puis d'un mélange acide fort + acide faible",
    objectifs: "étalonner un conductimètre, suivre la conductivité σ pendant le dosage de l'acide chlorhydrique puis d'un mélange HCl + CH₃COOH par la soude, repérer les équivalences à l'intersection des droites et interpréter les pentes avec les conductivités molaires ioniques.",
    materiel: ["Conductimètre et cellule de mesure", "Solution étalon de KCl à 0,0100 mol/L (σ = 1,41 mS/cm à 25 °C)", "Burette de 50 mL remplie de soude NaOH à 0,100 mol/L", "Acide chlorhydrique de concentration inconnue (environ 0,025 mol/L)", "Mélange HCl + CH₃COOH de concentrations inconnues", "Pipette jaugée de 20,0 mL, bécher de 400 mL, 200 mL d'eau distillée, agitateur magnétique"],
    theorie: `<p>La conductivité d'une solution est la somme des contributions de ses ions :</p>
      <div class="formula">σ = Σ λᵢ [Xᵢ]</div>
      <p>Conductivités molaires ioniques à 25 °C (mS·m²/mol) : H₃O⁺ 35,0 ; HO⁻ 19,8 ; Cl⁻ 7,6 ; Na⁺ 5,0 ; CH₃COO⁻ 4,1.</p>
      <h4>Dosage de HCl par la soude</h4><ul><li>Avant l'équivalence, chaque ion H₃O⁺ (très conducteur) est remplacé par un ion Na⁺ : <b>σ diminue</b>.</li>
      <li>Après l'équivalence, on ajoute des ions Na⁺ et HO⁻ : <b>σ augmente</b>.</li><li>L'équivalence est l'<b>intersection des deux droites</b> : C_a · V_a = C_b · V_E.</li></ul>
      <h4>Dosage du mélange HCl + CH₃COOH</h4><p>L'acide fort est dosé en premier (σ diminue jusqu'à V_E1), puis l'acide faible : CH₃COOH devient CH₃COO⁻ + Na⁺ et σ augmente lentement jusqu'à V_E2 ; ensuite l'excès de HO⁻ fait monter σ plus vite.</p>
      <div class="formula">C(HCl) = C_b · V_E1 / V_a        C(CH₃COOH) = C_b · (V_E2 − V_E1) / V_a</div>
      <h4>Correction de dilution</h4><p>Le volume passe de V₀ = 220 mL à V₀ + V : on trace σ corrigée = σ · (V₀ + V) / V₀ pour obtenir des portions bien rectilignes.</p>`,
    protocole: `<h4>Partie A — Étalonnage</h4><ol><li>Plonge la cellule dans la solution de KCl à 0,0100 mol/L.</li><li>Tourne le bouton « constante de cellule » jusqu'à lire 1,410 mS/cm. Note la lecture et ne touche plus au réglage.</li></ol>
      <h4>Partie B — Dosage de HCl</h4><ol><li>20,0 mL de HCl + 200 mL d'eau distillée, agitation, cellule immergée.</li><li>Verse la soude par 0,5 mL et relève σ après chaque ajout, de V = 0 jusqu'à V = 12 mL.</li><li>Calcule σ corrigée, trace σ corrigée = f(V), modélise les deux portions par des droites et lis V_E à leur intersection.</li></ol>
      <h4>Partie C — Dosage du mélange</h4><ol><li>20,0 mL du mélange + 200 mL d'eau ; même protocole jusqu'à V = 12 mL.</li><li>Repère les trois portions de droite, lis V_E1 et V_E2.</li></ol>`,
    precautions: `<ul><li>Étalonne le conductimètre avant les dosages : sans étalonnage, toutes les valeurs de σ sont fausses.</li><li>Attends que la lecture soit stable (agitation) avant de noter σ.</li><li>Ne place pas de point exactement à l'équivalence : les droites se tracent avec des points bien répartis de part et d'autre.</li><li>La cellule doit être entièrement immergée et rincée à l'eau distillée entre deux solutions.</li></ul>`,
    preparation: ["Écris l'équation de la réaction de dosage de HCl par la soude.", "Explique, avec les conductivités molaires ioniques, pourquoi σ diminue puis augmente.", "Calcule V_E attendu pour 20,0 mL de HCl à 0,025 mol/L dosés par la soude à 0,100 mol/L.", "Pourquoi travaille-t-on dans un grand volume d'eau ?"],
    hint: "Étalonne le conductimètre (montage A), puis verse la soude par 0,5 mL et enregistre σ après chaque ajout.",
    controls: `<h3>Montage</h3>${seg("com", [["A", "A · étalonnage"], ["B", "B · HCl"], ["C", "C · mélange"]], "A")}
      ${burHTML("co", "soude 0,100 mol/L", [["1", "+ 1 mL"], ["0.5", "+ 0,5 mL"], ["0.2", "+ 0,2 mL"], ["0.1", "+ 0,1 mL"]])}
      <div id="coCal" hidden><h3>Étalonnage (cellule dans KCl 0,0100 mol/L)</h3>
      <div class="ctl"><label for="coK">Bouton « constante de cellule » <b id="coKv"></b></label><input id="coK" type="range" min="0.85" max="1.15" step="0.0005" value="1"></div></div>
      ${lcd("co", [["V", "Burette : V versé"], ["S", "Conductimètre"]])}
      <div class="row"><button type="button" class="btn primary sm" id="coRec">Enregistrer</button></div>
      <button type="button" class="btn sm" id="coNew">Changer de matériel</button>`,
    parts: [{ key: "A" }, { key: "B" }, { key: "C" }],
    questions: ["Pourquoi σ diminue-t-elle avant l'équivalence du dosage de HCl ?", "Déduis V_E et la concentration de HCl.", "Identifie les trois portions de la courbe du mélange et calcule les deux concentrations.", "Pourquoi la deuxième portion du mélange monte-t-elle lentement ?", "Compare l'intérêt de la conductimétrie et de la pH-métrie."],
    init(T) {
      const mk = () => ({ ke: U(0.9, 1.1), ca: U(0.020, 0.030), ms: U(0.010, 0.018), mw: U(0.010, 0.018) });
      let P = params(T, "conducti_par", mk, P => isFinite(P.ke));
      const def = { m: "A", V: { B: 0, C: 0 }, kn: 1 };
      let st = state("conducti_st", def); const save = () => store.set("conducti_st", st);
      const B = mkBench("conducti-cv");
      const sig = () => st.m === "A" ? 1.41 : st.m === "B" ? sigma(P.ca, 0, st.V.B) : sigma(P.ms, P.mw, st.V.C);
      const read = () => rnd(sig() * P.ke * st.kn * (1 + 0.0006 * Math.sin((st.m === "A" ? 3.1 : st.V[st.m] * 41.7 + (st.m === "B" ? 1 : 2)))), 3);
      const ui = () => {
        setSeg("com", st.m); $("#coBur").hidden = st.m === "A"; $("#coCal").hidden = st.m !== "A";
        $("#coK").value = st.kn; $("#coKv").textContent = fx(st.kn, 4);
        $("#coV").textContent = st.m === "A" ? "—" : f2(st.V[st.m]) + " mL"; $("#coS").textContent = fx(read(), 3) + " mS/cm";
        $("#coRec").textContent = st.m === "A" ? "Noter la lecture dans KCl" : "Enregistrer le point (V ; σ)";
        draw();
      };
      const draw = () => B.draw({
        V: st.m === "A" ? null : st.V[st.m], tit: "NaOH 0,100 mol/L", vessel: "becher", probe: "cond", stir: true, col: st.m === "A" ? "rgba(200,220,240,.55)" : EAU,
        cap: st.m === "A" ? "KCl 0,0100 mol/L" : (st.m === "B" ? "HCl" : "mélange HCl + CH₃COOH") + " 20,0 mL + 200 mL d'eau",
        meter: { val: fx(read(), 3) + " mS/cm", sub: "constante de cellule × " + fx(st.kn, 4) },
        curve: st.m === "A" ? null : { lab: "σ = f(V) — partie " + st.m, xmax: 12, ymax: 1.6, pts: T.rows[st.m].map(r => [r.V, r.s]), cur: st.V[st.m] }
      });
      T.draw = draw; T.tick = dt => { if (B.tick(dt)) draw(); };
      document.querySelectorAll("[data-com]").forEach(b => b.onclick = () => { st.m = b.dataset.com; save(); T.msg(""); ui(); });
      document.querySelectorAll("[data-cov]").forEach(b => b.onclick = () => { if (addV(T, st.V, st.m, +b.getAttribute("data-cov"), 20)) { save(); B.drop(); T.msg(""); ui(); } });
      $("#coRaz").onclick = () => { st.V[st.m] = 0; save(); T.msg("Nouveau dosage : burette au zéro, nouvelle prise de 20,0 mL + 200 mL d'eau." + (T.rows[st.m].length ? " Supprime d'abord les lignes de la partie " + st.m + " (✕) si tu refais la courbe." : "")); ui(); };
      $("#coK").addEventListener("input", () => { st.kn = +$("#coK").value; save(); ui(); });
      $("#coRec").onclick = () => {
        const m = st.m, L = read();
        if (m === "A") { if (Math.abs(L - 1.41) > 0.0025) { T.msg("Le conductimètre n'affiche pas 1,410 mS/cm : tourne le bouton « constante de cellule ».", "bad"); return; } T.add("A", { L }); T.msg("Étalonnage noté.", "ok"); return; }
        const R = T.rows[m], V = st.V[m];
        if (R.length && V <= R[R.length - 1].V + 1e-9) { T.msg("Tu as déjà un point à ce volume (ou à un volume plus grand) : verse de la soude avant d'enregistrer.", "bad"); return; }
        T.add(m, { V, s: L }); T.msg(`Point enregistré (partie ${m}).`, "ok"); draw();
      };
      $("#coNew").onclick = () => { if (lockedMsg(T)) return; P = mk(); store.set("conducti_par", P); st = JSON.parse(JSON.stringify(def)); save(); T.clearRows(); ui(); T.msg("Nouveau matériel : refais l'étalonnage et les mesures."); };
      ui();
    }
  });

  /* ======================================================================
     TP C3 : ALCALIMÉTRIE
     ====================================================================== */
  const alcPH = (cOH, cc, V) => { const Vt = 30 + V; return pHsol({ Na: (cOH * 10 + 2 * cc * 10) / Vt, Cl: 0.1 * V / Vt, cc: cc * 10 / Vt }); };
  window.TPX.chim.alcPH = alcPH;
  register({
    id: "alcali", num: 23, lab: "C3", disc: "Chimie", court: "Alcalimétrie",
    titre: "Alcalimétrie : dosage de la soude, du carbonate de sodium et d'un mélange par l'acide chlorhydrique",
    objectifs: "doser une base forte puis une dibase (le carbonate) par un acide fort avec deux indicateurs successifs, et déterminer la composition d'un mélange soude + carbonate de sodium.",
    materiel: ["Burette de 50 mL remplie d'acide chlorhydrique HCl à 0,100 mol/L", "Soude NaOH de concentration inconnue (environ 0,1 mol/L)", "Carbonate de sodium Na₂CO₃ de concentration inconnue (environ 0,05 mol/L)", "Mélange NaOH + Na₂CO₃ inconnu", "Phénolphtaléine (8,2 – 10) et hélianthine (3,1 – 4,4)", "Pipette jaugée de 10,0 mL, erlenmeyer, eau distillée"],
    theorie: `<p>La soude est dosée en une étape : H₃O⁺ + HO⁻ → 2 H₂O. Le carbonate est une <b>dibase</b>, dosée en deux étapes :</p>
      <div class="formula">CO₃²⁻ + H₃O⁺ → HCO₃⁻ + H₂O        (virage de la phénolphtaléine : V₁)
HCO₃⁻ + H₃O⁺ → CO₂,H₂O + H₂O      (virage de l'hélianthine : V₂, lu depuis le zéro)</div>
      <p>Pour le carbonate seul, V₂ = 2 V₁ et C(CO₃²⁻) = C_a · V₁ / V. Pour un mélange soude + carbonate, la soude et la première basicité du carbonate sont dosées avant le premier virage :</p>
      <div class="formula">n(CO₃²⁻) = C_a (V₂ − V₁)        n(HO⁻) = C_a (2V₁ − V₂)</div>
      <p>Données : pKa(HCO₃⁻/CO₃²⁻) = 10,3 ; pKa(CO₂,H₂O/HCO₃⁻) = 6,4.</p>`,
    protocole: `<h4>Partie A — Soude</h4><ol><li>10,0 mL de soude + 20 mL d'eau + 2 gouttes de phénolphtaléine (rose).</li><li>Verse HCl jusqu'à la décoloration. Au moins deux dosages concordants (« Nouveau dosage » entre deux).</li></ol>
      <h4>Partie B — Carbonate de sodium</h4><ol><li>10,0 mL de Na₂CO₃ + 20 mL d'eau + phénolphtaléine. Verse HCl jusqu'à la décoloration et note V₁.</li><li>L'hélianthine est alors ajoutée (solution jaune) : continue jusqu'au virage jaune → orange et note V₂ (lu depuis le zéro). Deux dosages.</li></ol>
      <h4>Partie C — Mélange</h4><ol><li>Même double dosage sur 10,0 mL du mélange inconnu. Deux dosages.</li></ol>`,
    precautions: `<ul><li>Près du premier virage, verse goutte à goutte : la décoloration de la phénolphtaléine est progressive.</li><li>V₂ se lit depuis le zéro de la burette (on ne remet pas la burette à zéro après V₁).</li><li>Près du second virage, le CO₂ dissous rend le virage moins net : en salle, on chauffe parfois légèrement.</li><li>Réel : gants et lunettes pour la soude et l'acide.</li></ul>`,
    preparation: ["Écris les deux réactions du dosage du carbonate par HCl.", "Pourquoi V₂ = 2 V₁ pour le carbonate seul ?", "Établis les relations donnant n(HO⁻) et n(CO₃²⁻) dans le mélange.", "Justifie le choix de chaque indicateur avec les pKa."],
    hint: "Choisis la solution, verse HCl et observe la couleur. Au premier virage, note V₁ : l'hélianthine est ajoutée et tu continues jusqu'à l'orange.",
    controls: `<h3>Solution dosée</h3>${seg("alm", [["A", "A · soude"], ["B", "B · carbonate"], ["C", "C · mélange"]], "A")}
      ${burHTML("al", "HCl 0,100 mol/L")}
      ${lcd("al", [["V", "Burette : V versé"], ["I", "Indicateur"], ["C", "Teinte"]])}
      <div class="row"><button type="button" class="btn primary sm" id="alRec">Noter</button></div>
      <button type="button" class="btn sm" id="alNew">Changer de matériel</button>`,
    parts: [{ key: "A" }, { key: "B" }, { key: "C" }],
    questions: ["Calcule la concentration de la soude.", "Vérifie que V₂ ≈ 2 V₁ pour le carbonate et calcule sa concentration.", "Calcule les concentrations de NaOH et de Na₂CO₃ dans le mélange.", "Justifie le choix des indicateurs.", "Pourquoi chauffe-t-on parfois près du second virage ?"],
    init(T) {
      const mk = () => ({ cb: U(0.08, 0.12), cc: U(0.04, 0.06), mo: U(0.03, 0.06), mc: U(0.02, 0.04) });
      let P = params(T, "alcali_par", mk, P => isFinite(P.cb));
      const def = { m: "A", V: { A: 0, B: 0, C: 0 }, ph: { A: 1, B: 1, C: 1 }, v1: { B: null, C: null }, fin: { A: false, B: false, C: false } };
      let st = state("alcali_st", def); const save = () => store.set("alcali_st", st);
      const B = mkBench("alcali-cv");
      const comp = m => m === "A" ? [P.cb, 0] : m === "B" ? [0, P.cc] : [P.mo, P.mc];
      const pH = () => { const [o, cc] = comp(st.m); return alcPH(o, cc, st.V[st.m]); };
      const look = () => { const p = pH(); if (st.ph[st.m] === 2) { const t = p > 4.4 ? "jaune" : p > 3.1 ? "orange" : "rouge"; return { col: helia(p), t, end: p <= 4.4 }; } const c = phen(p); return { col: c || EAU, t: c ? "rose" : "incolore", end: !c }; };
      const ui = () => {
        setSeg("alm", st.m); const L = look(), m = st.m;
        $("#alV").textContent = f2(st.V[m]) + " mL"; $("#alI").textContent = st.ph[m] === 2 ? "hélianthine" : "phénolphtaléine"; $("#alC").textContent = L.t;
        $("#alRec").textContent = m === "A" ? "Noter V_E (décoloration)" : st.ph[m] === 1 ? "Noter V₁ (décoloration)" : "Noter V₂ (virage à l'orange)";
        draw();
      };
      const draw = () => { const L = look(), m = st.m; B.draw({ V: st.V[m], tit: "HCl 0,100 mol/L", vessel: "erlen", col: B.flash > 0.05 && !L.end && st.ph[m] === 1 ? "rgba(240,190,215,.5)" : L.col,
        cap: ({ A: "NaOH", B: "Na₂CO₃", C: "mélange NaOH + Na₂CO₃" })[m] + " 10,0 mL + 20 mL d'eau",
        side: [["Teinte : " + L.t + (st.ph[m] === 2 ? " (hélianthine)" : " (phénolphtaléine)"), L.end ? css("--accent") : null, true],
          ...(m === "A" ? [["Essais notés : " + (T.rows.A.map(r => f2(r.V)).join(" ; ") || "aucun")]] : [["V₁ de ce dosage : " + (st.v1[m] != null ? f2(st.v1[m]) + " mL" : "—")], ["Essais notés : " + (T.rows[m].map(r => f2(r.V1) + " / " + f2(r.V2)).join(" ; ") || "aucun")]]),
          ...(st.fin[m] ? [["Dosage terminé : « Nouveau dosage » pour l'essai suivant.", css("--accent")]] : [])] }); };
      T.draw = draw; T.tick = dt => { if (B.tick(dt)) draw(); };
      document.querySelectorAll("[data-alm]").forEach(b => b.onclick = () => { st.m = b.dataset.alm; save(); T.msg(""); ui(); });
      document.querySelectorAll("[data-alv]").forEach(b => b.onclick = () => {
        const m = st.m; if (st.fin[m]) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        const was = look().end; if (!addV(T, st.V, m, +b.getAttribute("data-alv"))) return; save(); B.drop();
        const L = look(); if (!L.end && st.ph[m] === 1 && pH() < 9) B.flash = 1;
        T.msg(!was && L.end ? (st.ph[m] === 2 ? "La solution vire à l'orange." : "La solution se décolore.") : "", !was && L.end ? "ok" : ""); ui();
      });
      $("#alRaz").onclick = () => { const m = st.m; st.V[m] = 0; st.ph[m] = 1; if (m !== "A") st.v1[m] = null; st.fin[m] = false; save(); T.msg("Nouvelle prise d'essai : 10,0 mL + 20 mL d'eau + 2 gouttes de phénolphtaléine ; burette remplie et ajustée au zéro."); ui(); };
      $("#alRec").onclick = () => {
        const m = st.m, L = look(), V = st.V[m];
        if (st.fin[m]) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        if (!L.end) { T.msg(st.ph[m] === 2 ? "La solution est encore jaune : le second virage n'est pas atteint." : "La solution est encore rose : le virage n'est pas atteint.", "bad"); return; }
        if (m === "A") { const n = T.rows.A.length; T.add("A", { Va: 10, V }); if (T.rows.A.length > n) { st.fin.A = true; T.msg(`V_E = ${f2(V)} mL noté.`, "ok"); } }
        else if (st.ph[m] === 1) { st.v1[m] = V; st.ph[m] = 2; T.msg(`V₁ = ${f2(V)} mL noté. On ajoute 2 gouttes d'hélianthine : la solution est jaune. Continue jusqu'au virage à l'orange.`, "ok"); }
        else { const n = T.rows[m].length; T.add(m, { Va: 10, V1: st.v1[m], V2: V }); if (T.rows[m].length > n) { st.fin[m] = true; T.msg(`V₁ = ${f2(st.v1[m])} mL et V₂ = ${f2(V)} mL notés.`, "ok"); } }
        save(); ui();
      };
      $("#alNew").onclick = () => { if (lockedMsg(T)) return; P = mk(); store.set("alcali_par", P); st = JSON.parse(JSON.stringify(def)); save(); T.clearRows(); ui(); T.msg("Nouveau matériel : refais les dosages."); };
      ui();
    }
  });

  /* ======================================================================
     TP C4 : PRODUIT DE SOLUBILITÉ DE Ca(OH)₂
     ====================================================================== */
  const solS = T0 => 0.0200 - 0.00018 * (T0 - 25);                   // solubilité dans l'eau pure (mol/L) à la température T0 (°C)
  const solS2 = T0 => { const s = solS(T0), Ks = 4 * s * s * s; let lo = 0, hi = s; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if ((0.1 + m) * 4 * m * m > Ks) hi = m; else lo = m; } return (lo + hi) / 2; };   // dans CaCl₂ 0,10 mol/L
  const solPH = (cOH, V) => { const Vt = 30 + V; return pHsol({ Na: cOH * 10 / Vt, Cl: 0.05 * V / Vt }); };   // 10,0 mL de filtrat + 20 mL d'eau, HCl 0,050 mol/L
  window.TPX.chim.solS = solS; window.TPX.chim.solS2 = solS2;
  register({
    id: "solub", num: 24, lab: "C4", disc: "Chimie", court: "Produit de solubilité",
    titre: "Produit de solubilité de l'hydroxyde de calcium et effet d'ion commun",
    objectifs: "préparer une solution saturée de Ca(OH)₂, doser les ions HO⁻ du filtrat par l'acide chlorhydrique, en déduire la solubilité s et le produit de solubilité Ks, puis observer l'effet d'ion commun dans une solution de CaCl₂.",
    materiel: ["Hydroxyde de calcium Ca(OH)₂ solide", "Eau distillée et solution de CaCl₂ à 0,10 mol/L", "Burette de 50 mL remplie de HCl à 0,050 mol/L", "Phénolphtaléine", "Entonnoir et papier filtre, thermomètre", "Pipette jaugée de 10,0 mL, erlenmeyer"],
    theorie: `<div class="formula">Ca(OH)₂(s) ⇌ Ca²⁺ + 2 HO⁻        Ks = [Ca²⁺] [HO⁻]² = s · (2s)² = 4 s³</div>
      <p>Le dosage du filtrat par HCl donne [HO⁻] = C_a · V_E / V = 2s, d'où s et Ks. La solubilité de Ca(OH)₂ <b>diminue quand la température augmente</b>.</p>
      <h4>Effet d'ion commun</h4><p>Dans une solution de CaCl₂ de concentration C, les ions Ca²⁺ déjà présents déplacent l'équilibre : la solubilité s′ est plus faible.</p>
      <div class="formula">Ks = (C + s′) (2s′)²</div>
      <p>Masse molaire : M(Ca(OH)₂) = 74,1 g/mol. Valeur tabulée à 25 °C : s ≈ 0,020 mol/L.</p>`,
    protocole: `<h4>Partie A — Solution saturée dans l'eau</h4><ol><li>Agite 1 g de Ca(OH)₂ dans 100 mL d'eau distillée pendant 10 min, laisse reposer, puis <b>filtre</b>. Note la température.</li>
        <li>10,0 mL du filtrat + 20 mL d'eau + phénolphtaléine (rose) ; verse HCl jusqu'à la décoloration. Au moins deux dosages concordants.</li></ol>
      <h4>Partie B — Effet d'ion commun</h4><ol><li>Même préparation avec 100 mL de CaCl₂ à 0,10 mol/L au lieu de l'eau, puis même dosage (au moins deux).</li></ol>`,
    precautions: `<ul><li>Le filtrat doit être <b>limpide</b> : du solide en suspension se dissoudrait pendant le dosage et fausserait V_E.</li><li>Ne rince pas le filtre à l'eau : cela diluerait la solution saturée.</li><li>Note la température : la solubilité en dépend.</li><li>Le volume équivalent dans CaCl₂ est petit : verse goutte à goutte.</li></ul>`,
    preparation: ["Écris l'équilibre de dissolution de Ca(OH)₂ et l'expression de Ks en fonction de s.", "Exprime s en fonction de V_E, C_a et du volume dosé.", "Calcule V_E attendu si s = 0,020 mol/L (10,0 mL dosés par HCl à 0,050 mol/L).", "Explique qualitativement l'effet d'ion commun."],
    hint: "Prépare la solution saturée (agiter, puis filtrer), puis dose 10,0 mL du filtrat avec HCl jusqu'à la décoloration.",
    controls: `<h3>Solvant</h3>${seg("som", [["A", "A · eau distillée"], ["B", "B · CaCl₂ 0,10 mol/L"]], "A")}
      <h3>Préparation</h3><div class="row"><button type="button" class="btn sm" id="soAg">Agiter 10 min, laisser reposer</button><button type="button" class="btn sm" id="soFi">Filtrer</button></div>
      ${burHTML("so", "HCl 0,050 mol/L")}
      ${lcd("so", [["P", "Préparation"], ["T", "Thermomètre"], ["V", "Burette : V versé"], ["C", "Teinte"]])}
      <div class="row"><button type="button" class="btn primary sm" id="soRec">Noter V_E (décoloration)</button></div>
      <button type="button" class="btn sm" id="soNew">Changer de matériel</button>`,
    parts: [{ key: "A" }, { key: "B" }],
    questions: ["Calcule [HO⁻], s (en mol/L et en g/L) et Ks dans l'eau pure.", "Compare à la valeur tabulée et commente l'influence de la température.", "Calcule s′ dans CaCl₂ et conclus sur l'effet d'ion commun.", "Pourquoi faut-il filtrer ?", "Pourquoi ne pas rincer le filtre à l'eau ?"],
    init(T) {
      const mk = () => ({ T: rnd(U(24, 32), 1) });
      let P = params(T, "solub_par", mk, P => isFinite(P.T));
      const def = { m: "A", V: { A: 0, B: 0 }, prep: { A: 0, B: 0 }, fin: { A: false, B: false } };
      let st = state("solub_st", def); const save = () => store.set("solub_st", st);
      const B = mkBench("solub-cv");
      const cOH = m => 2 * (m === "A" ? solS(P.T) : solS2(P.T)) * (st.prep[m] === 2 ? 1 : 1.15);
      const pH = () => solPH(cOH(st.m), st.V[st.m]);
      const ui = () => {
        setSeg("som", st.m); const m = st.m, p = st.prep[m], c = phen(pH());
        $("#soP").textContent = ["à faire", "agitée, non filtrée", "filtrée (limpide)"][p]; $("#soT").textContent = fx(P.T, 1) + " °C";
        $("#soV").textContent = f2(st.V[m]) + " mL"; $("#soC").textContent = p ? (c ? "rose" : "incolore") : "—"; draw();
      };
      const draw = () => { const m = st.m, p = st.prep[m], c = p ? phen(pH()) : null;
        B.draw({ V: p ? st.V[m] : null, tit: "HCl 0,050 mol/L", vessel: p ? "erlen" : "becher", col: p ? (c || EAU) : (m === "A" ? EAU : "rgba(200,215,230,.5)"), turb: p === 0 ? 0 : p === 1 ? 0.55 : 0, temp: P.T,
          cap: p ? "10,0 mL de " + (p === 2 ? "filtrat" : "solution non filtrée") + " + 20 mL d'eau" : (m === "A" ? "100 mL d'eau" : "100 mL de CaCl₂") + " + 1 g de Ca(OH)₂",
          side: [["Préparation : " + ["agiter, puis filtrer", "agitée — trouble (non filtrée)", "filtrée — limpide"][p], p === 1 ? "#c0392b" : null, true], ["Teinte : " + (p ? (c ? "rose" : "incolore") : "—")], ["Essais notés : " + (T.rows[m].map(r => f2(r.V)).join(" ; ") || "aucun")], ...(st.fin[m] ? [["Dosage terminé : « Nouveau dosage » pour l'essai suivant.", css("--accent")]] : [])],
          custom: p ? null : G => { const { c, bx, bw, vy1 } = G; c.fillStyle = "rgba(240,240,240,.95)"; c.fillRect(bx - bw * 0.18, vy1 - 8, bw * 0.36, 6); } }); };
      T.draw = draw; T.tick = dt => { if (B.tick(dt)) draw(); };
      document.querySelectorAll("[data-som]").forEach(b => b.onclick = () => { st.m = b.dataset.som; save(); T.msg(""); ui(); });
      $("#soAg").onclick = () => { st.prep[st.m] = Math.max(st.prep[st.m], 1); save(); T.msg("Solution agitée 10 min puis laissée au repos : elle est saturée, mais encore trouble (solide en suspension)."); ui(); };
      $("#soFi").onclick = () => { if (!st.prep[st.m]) { T.msg("Agite d'abord le solide avec le solvant.", "bad"); return; } st.prep[st.m] = 2; save(); T.msg("Filtration terminée : le filtrat est limpide.", "ok"); ui(); };
      document.querySelectorAll("[data-sov]").forEach(b => b.onclick = () => {
        const m = st.m; if (!st.prep[m]) { T.msg("Prépare d'abord la solution saturée (agiter, puis filtrer).", "bad"); return; }
        if (st.fin[m]) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        const was = !phen(pH()); if (!addV(T, st.V, m, +b.getAttribute("data-sov"))) return; save(); B.drop();
        T.msg(!was && !phen(pH()) ? "La solution se décolore." : "", "ok"); ui();
      });
      $("#soRaz").onclick = () => { st.V[st.m] = 0; st.fin[st.m] = false; save(); T.msg("Nouvelle prise : 10,0 mL de la solution + 20 mL d'eau + phénolphtaléine ; burette au zéro."); ui(); };
      $("#soRec").onclick = () => {
        const m = st.m; if (!st.prep[m]) { T.msg("Prépare d'abord la solution saturée.", "bad"); return; }
        if (st.fin[m]) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        if (phen(pH())) { T.msg("La solution est encore rose : l'équivalence n'est pas atteinte.", "bad"); return; }
        const n = T.rows[m].length; T.add(m, { T: P.T, V: st.V[m] }); if (T.rows[m].length > n) { st.fin[m] = true; save(); T.msg(`V_E = ${f2(st.V[m])} mL noté.`, "ok"); } ui();
      };
      $("#soNew").onclick = () => { if (lockedMsg(T)) return; P = mk(); store.set("solub_par", P); st = JSON.parse(JSON.stringify(def)); save(); T.clearRows(); ui(); T.msg("Nouveau matériel (autre température de la salle) : refais les mesures."); };
      ui();
    }
  });

  /* ======================================================================
     TP C5 : CHLOROMÉTRIE (MÉTHODE DE MOHR)
     ====================================================================== */
  const mohrEnd = (P, m, neutre) => m === "B" ? P.V0 : (m === "A" ? 0.05 * 20 : P.ser / 58.5 * 20) / (0.05 * P.f) + P.V0 + (m === "C" && !neutre && P.pHs < 6.5 ? 1.2 : 0);
  window.TPX.chim.mohrEnd = mohrEnd;
  register({
    id: "chloro", num: 25, lab: "C5", disc: "Chimie", court: "Chlorométrie (Mohr)",
    titre: "Chlorométrie : dosage des ions chlorure par la méthode de Mohr",
    objectifs: "doser les ions chlorure par précipitation avec les ions argent, repérer l'équivalence grâce au chromate de potassium, contrôler la solution de nitrate d'argent et déterminer la teneur en chlorure de sodium d'un sérum physiologique.",
    materiel: ["Burette de 50 mL remplie de nitrate d'argent AgNO₃ à 0,0500 mol/L (à contrôler)", "Solution étalon de NaCl à 0,0500 mol/L", "Sérum physiologique dilué 10 fois", "Chromate de potassium K₂CrO₄ à 5 %", "Papier pH et hydrogénocarbonate de sodium NaHCO₃", "Pipette jaugée de 20,0 mL, erlenmeyer, CaCO₃ (essai à blanc)"],
    theorie: `<div class="formula">Ag⁺ + Cl⁻ → AgCl(s)  (blanc)        2 Ag⁺ + CrO₄²⁻ → Ag₂CrO₄(s)  (rouge brique)</div>
      <p>AgCl (Ks = 1,8×10⁻¹⁰) précipite en premier. Le premier excès d'ions Ag⁺ fait apparaître le précipité rouge brique de Ag₂CrO₄ : c'est l'équivalence.</p>
      <div class="formula">C(Cl⁻) · V_prise = C(Ag⁺) · (V_E − V₀)</div>
      <p>V₀ est le volume de l'<b>essai à blanc</b> : il faut un petit excès d'Ag⁺ pour voir la teinte rouge brique ; on le retranche de chaque dosage.</p>
      <p>Le dosage se fait en milieu neutre ou légèrement basique (pH 6,5 à 10) : en milieu acide, le chromate devient dichromate et le virage est retardé.</p>
      <p>Données : M(Cl) = 35,5 g/mol ; M(NaCl) = 58,5 g/mol. Sérum physiologique : 0,9 % de NaCl, soit 9 g/L.</p>`,
    protocole: `<h4>Partie A — Contrôle de la solution d'argent</h4><ol><li>20,0 mL de NaCl étalon + 1 mL de K₂CrO₄ ; verse AgNO₃ jusqu'à la teinte rouge brique persistante. Deux dosages.</li></ol>
      <h4>Partie B — Essai à blanc</h4><ol><li>20 mL d'eau + 1 mL de K₂CrO₄ + une pincée de CaCO₃ ; verse AgNO₃ goutte à goutte jusqu'au virage et note V₀.</li></ol>
      <h4>Partie C — Sérum physiologique dilué 10 fois</h4><ol><li>Vérifie le pH au papier pH ; s'il est inférieur à 6,5, ajoute une pointe de NaHCO₃.</li><li>20,0 mL de l'échantillon + 1 mL de K₂CrO₄ ; dose jusqu'à la teinte rouge brique. Deux dosages.</li></ol>`,
    precautions: `<ul><li>Agite en permanence : le précipité blanc cache le début de la teinte rouge brique.</li><li>Contrôle le pH de l'échantillon avant le dosage.</li><li>Retranche V₀ (essai à blanc) de chaque volume.</li><li>Réel : AgNO₃ tache la peau en noir (gants) ; les déchets d'argent et de chromate vont dans un bidon de récupération.</li></ul>`,
    preparation: ["Écris les deux réactions de précipitation.", "Pourquoi AgCl précipite-t-il avant Ag₂CrO₄ ?", "Calcule V_E attendu pour 20,0 mL de NaCl à 0,0500 mol/L.", "Calcule la concentration en Cl⁻ d'un sérum à 9 g/L de NaCl, puis dilué 10 fois."],
    hint: "Verse AgNO₃ en agitant : un trouble blanc apparaît (AgCl), puis la teinte rouge brique persistante marque l'équivalence.",
    controls: `<h3>Solution dosée</h3>${seg("clm", [["A", "A · NaCl étalon"], ["B", "B · essai à blanc"], ["C", "C · sérum dilué"]], "A")}
      <div id="clPh" hidden><h3>Contrôle du pH</h3><div class="row"><button type="button" class="btn sm" id="clPa">Papier pH</button><button type="button" class="btn sm" id="clBi">Ajouter NaHCO₃</button></div></div>
      ${burHTML("cl", "AgNO₃ 0,0500 mol/L")}
      ${lcd("cl", [["V", "Burette : V versé"], ["C", "Aspect"], ["H", "pH (papier)"]])}
      <div class="row"><button type="button" class="btn primary sm" id="clRec">Noter V (rouge brique persistant)</button></div>
      <button type="button" class="btn sm" id="clNew">Changer de matériel</button>`,
    parts: [{ key: "A" }, { key: "B" }, { key: "C" }],
    questions: ["Écris les réactions et explique le rôle du chromate.", "Corrige la concentration de AgNO₃ à l'aide de l'étalon.", "Calcule la concentration en Cl⁻ du sérum dilué, en mol/L et en mg/L.", "Déduis la concentration en NaCl du sérum (g/L) et compare à 9 g/L.", "Pourquoi contrôler le pH ? Pourquoi conserver AgNO₃ à l'abri de la lumière ?"],
    init(T) {
      const mk = () => ({ f: U(0.97, 1.03), V0: rnd(U(0.08, 0.15), 3), ser: U(0.85, 0.95), pHs: rnd(Math.random() < 0.5 ? U(5.2, 6.2) : U(6.8, 7.8), 1) });
      let P = params(T, "chloro_par", mk, P => isFinite(P.f));
      const def = { m: "A", V: { A: 0, B: 0, C: 0 }, fin: { A: false, B: false, C: false }, papier: false, neutre: false };
      let st = state("chloro_st", def); const save = () => store.set("chloro_st", st);
      const B = mkBench("chloro-cv");
      const end = () => mohrEnd(P, st.m, st.neutre);
      const red = () => st.V[st.m] >= end() - 1e-9;
      const Vcl = () => st.m === "B" ? 0 : end() - P.V0 - (st.m === "C" && !st.neutre && P.pHs < 6.5 ? 1.2 : 0);
      const ui = () => {
        setSeg("clm", st.m); const m = st.m; $("#clPh").hidden = m !== "C";
        $("#clV").textContent = f2(st.V[m]) + " mL"; $("#clC").textContent = red() ? "rouge brique" : st.V[m] > 0 && m !== "B" ? "jaune, trouble blanc" : "jaune";
        $("#clH").textContent = m === "C" && st.papier ? (st.neutre ? "≈ 8" : "≈ " + fx(P.pHs, 0)) : "—"; draw();
      };
      const draw = () => { const m = st.m, V = st.V[m], Ve = Vcl(), r = red();
        B.draw({ V, tit: "AgNO₃ 0,0500 mol/L", burCol: "rgba(210,215,225,.6)", vessel: "erlen",
          col: r ? `rgba(185,75,45,${Math.min(0.85, 0.55 + (V - end()) * 0.4).toFixed(3)})` : B.flash > 0.05 ? "rgba(225,140,70,.6)" : "rgba(245,205,50,.55)",
          turb: m === "B" ? 0.35 : Math.min(0.75, 0.75 * Math.min(V, Ve) / Math.max(Ve, 1)),
          cap: ({ A: "NaCl 20,0 mL + K₂CrO₄", B: "eau 20 mL + K₂CrO₄ + CaCO₃", C: "sérum dilué 20,0 mL + K₂CrO₄" })[m],
          side: [["Aspect : " + (r ? "rouge brique persistant" : B.flash > 0.05 ? "rougeur locale qui disparaît à l'agitation" : V > 0 && m !== "B" ? "jaune avec précipité blanc" : "jaune"), r ? "#a63d1e" : null, true],
            ...(m === "C" ? [["pH de l'échantillon : " + (st.papier ? (st.neutre ? "≈ 8 (NaHCO₃ ajouté)" : "≈ " + fx(P.pHs, 0)) : "non contrôlé"), !st.neutre && st.papier && P.pHs < 6.5 ? "#c0392b" : null]] : []),
            ["Essais notés : " + (T.rows[m].map(q => f2(q.V)).join(" ; ") || "aucun")], ...(st.fin[m] ? [["Dosage terminé : « Nouveau dosage » pour l'essai suivant.", css("--accent")]] : [])] }); };
      T.draw = draw; T.tick = dt => { if (B.tick(dt)) draw(); };
      document.querySelectorAll("[data-clm]").forEach(b => b.onclick = () => { st.m = b.dataset.clm; save(); T.msg(""); ui(); });
      $("#clPa").onclick = () => { st.papier = true; save(); T.msg(st.neutre || P.pHs >= 6.5 ? "Le papier pH indique un milieu neutre : le dosage est possible." : "Le papier pH indique un milieu acide (pH ≈ " + fx(P.pHs, 0) + ") : ajoute NaHCO₃ avant le dosage.", st.neutre || P.pHs >= 6.5 ? "ok" : "bad"); ui(); };
      $("#clBi").onclick = () => { if (st.V.C > 0 && !st.fin.C) { T.msg("Ajoute NaHCO₃ avant de commencer le dosage (« Nouveau dosage »).", "bad"); return; } st.neutre = true; save(); T.msg("Une pointe de NaHCO₃ est ajoutée à l'échantillon : son pH est maintenant voisin de 8.", "ok"); ui(); };
      document.querySelectorAll("[data-clv]").forEach(b => b.onclick = () => {
        const m = st.m; if (st.fin[m]) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        const was = red(); if (!addV(T, st.V, m, +b.getAttribute("data-clv"))) return; save(); B.drop();
        if (!red() && end() - st.V[m] < 1) B.flash = 1;
        T.msg(!was && red() ? "La teinte rouge brique persiste à l'agitation." : "", "ok"); ui();
      });
      $("#clRaz").onclick = () => { st.V[st.m] = 0; st.fin[st.m] = false; save(); T.msg("Nouvelle prise d'essai ; burette remplie et ajustée au zéro."); ui(); };
      $("#clRec").onclick = () => {
        const m = st.m; if (st.fin[m]) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        if (!red()) { T.msg("La teinte rouge brique n'est pas encore apparue (ou elle disparaît à l'agitation).", "bad"); return; }
        const n = T.rows[m].length; T.add(m, { V: st.V[m] }); if (T.rows[m].length > n) { st.fin[m] = true; save(); T.msg(`V = ${f2(st.V[m])} mL noté.`, "ok"); } ui();
      };
      $("#clNew").onclick = () => { if (lockedMsg(T)) return; P = mk(); store.set("chloro_par", P); st = JSON.parse(JSON.stringify(def)); save(); T.clearRows(); ui(); T.msg("Nouveau matériel : refais les dosages."); };
      ui();
    }
  });

  /* ======================================================================
     TP C6 et C7 : MANGANIMÉTRIE
     ====================================================================== */
  const MNO4 = "rgba(150,40,140,.85)";
  const pinkMn = x => `rgba(200,60,160,${Math.min(0.85, 0.3 + x * 0.6).toFixed(3)})`;
  const m1End = (P, m, T0) => m === "A" ? 0.2 / P.c * (T0 > 85 ? 0.96 : 1) : P.m * P.pur / (19.6 * P.c);
  window.TPX.chim.m1End = m1End;
  register({
    id: "mangan1", num: 26, lab: "C6", disc: "Chimie", court: "Manganimétrie I",
    titre: "Manganimétrie I : étalonnage du permanganate par l'acide oxalique et dosage du fer(II)",
    objectifs: "étalonner une solution de permanganate de potassium par l'acide oxalique (à chaud), puis doser les ions fer(II) d'une solution de sel de Mohr et en déduire la pureté du sel.",
    materiel: ["Burette de 50 mL remplie de KMnO₄ (environ 0,02 mol/L, à étalonner)", "Acide oxalique H₂C₂O₄ à 0,0500 mol/L (solution étalon)", "Acide sulfurique H₂SO₄ à 1 mol/L", "Solution de sel de Mohr FeSO₄,(NH₄)₂SO₄,6H₂O : masse pesée dissoute dans 100 mL (M = 392 g/mol)", "Plaque chauffante et thermomètre", "Pipette jaugée de 10,0 mL, erlenmeyer"],
    theorie: `<p>L'ion MnO₄⁻, violet, est réduit en Mn²⁺, presque incolore. La première goutte en excès colore la solution en <b>rose persistant</b> : le permanganate sert lui-même d'indicateur.</p>
      <div class="formula">2 MnO₄⁻ + 5 H₂C₂O₄ + 6 H⁺ → 2 Mn²⁺ + 10 CO₂ + 8 H₂O        5 C(MnO₄⁻) V_E = 2 C_ox V_ox
MnO₄⁻ + 5 Fe²⁺ + 8 H⁺ → Mn²⁺ + 5 Fe³⁺ + 4 H₂O              5 C(MnO₄⁻) V_E = C(Fe²⁺) V_Fe</div>
      <p>La réaction avec l'acide oxalique est <b>lente à froid</b> : on chauffe vers 60 – 70 °C (sans bouillir). Les ions Mn²⁺ formés catalysent la réaction (autocatalyse).</p>`,
    protocole: `<h4>Partie A — Étalonnage de KMnO₄</h4><ol><li>10,0 mL d'acide oxalique + 10 mL de H₂SO₄ ; chauffe vers 60 – 70 °C.</li><li>Verse KMnO₄ : les premières gouttes se décolorent lentement, puis rapidement. Arrête à la teinte rose persistante. Deux dosages.</li></ol>
      <h4>Partie B — Dosage du fer(II)</h4><ol><li>10,0 mL de la solution de sel de Mohr + 10 mL de H₂SO₄, <b>à froid</b>.</li><li>Verse KMnO₄ jusqu'à la teinte rose persistante. Deux dosages.</li></ol>`,
    precautions: `<ul><li>À froid, la décoloration de l'acide oxalique est très lente : la teinte rose qui reste n'est pas l'équivalence.</li><li>Ne fais pas bouillir : l'acide oxalique se décompose.</li><li>Le milieu doit être fortement acide (H₂SO₄, jamais HCl : les ions Cl⁻ seraient oxydés).</li><li>Lis la burette au haut du ménisque : KMnO₄ est trop foncé pour voir le bas.</li></ul>`,
    preparation: ["Écris les demi-équations des couples MnO₄⁻/Mn²⁺, CO₂/H₂C₂O₄ et Fe³⁺/Fe²⁺.", "Établis la relation à l'équivalence de chaque dosage.", "Calcule V_E attendu pour 10,0 mL d'acide oxalique à 0,0500 mol/L et KMnO₄ à 0,0200 mol/L.", "Pourquoi chauffe-t-on pour l'acide oxalique et pas pour le fer(II) ?"],
    hint: "Partie A : chauffe vers 60 – 70 °C avant de verser KMnO₄. La première teinte rose persistante marque l'équivalence.",
    controls: `<h3>Solution dosée</h3>${seg("m1m", [["A", "A · acide oxalique"], ["B", "B · sel de Mohr"]], "A")}
      <div class="ctl"><label for="m1T">Plaque chauffante <b id="m1Tv"></b></label><input id="m1T" type="range" min="20" max="95" step="1" value="20"></div>
      ${burHTML("m1", "KMnO₄ à étalonner")}
      ${lcd("m1", [["V", "Burette : V versé"], ["C", "Teinte"], ["M", "Masse de sel de Mohr pesée"]])}
      <div class="row"><button type="button" class="btn primary sm" id="m1Rec">Noter V_E (rose persistant)</button></div>
      <button type="button" class="btn sm" id="m1New">Changer de matériel</button>`,
    parts: [{ key: "A" }, { key: "B" }],
    questions: ["Écris les demi-équations et les équations bilans.", "Calcule la concentration exacte de KMnO₄.", "Calcule C(Fe²⁺), la masse de sel de Mohr dissoute et sa pureté.", "Pourquoi chauffer pour l'acide oxalique ?", "Pourquoi utiliser H₂SO₄ et non HCl ?"],
    init(T) {
      const mk = () => ({ c: U(0.018, 0.022), m: rnd(U(3.6, 4.2), 3), pur: U(0.95, 1.0) });
      let P = params(T, "mangan1_par", mk, P => isFinite(P.c));
      const def = { m: "A", V: { A: 0, B: 0 }, fin: { A: false, B: false }, T: { A: 20, B: 20 } };
      let st = state("mangan1_st", def); const save = () => store.set("mangan1_st", st);
      const B = mkBench("mangan1-cv");
      const Tm = () => st.T[st.m];
      const pink = () => { const m = st.m, V = st.V[m]; if (m === "A" && Tm() < 50 && V > 0) return true; return V >= m1End(P, m, Tm()) - 1e-9; };
      const ui = () => {
        setSeg("m1m", st.m); const m = st.m; $("#m1T").value = Tm(); $("#m1Tv").textContent = Tm() + " °C";
        $("#m1V").textContent = f2(st.V[m]) + " mL"; $("#m1C").textContent = pink() ? "rose persistant" : "incolore"; $("#m1M").textContent = fx(P.m, 3).replace(".", ",") + " g dans 100 mL"; draw();
      };
      const draw = () => { const m = st.m, V = st.V[m], E = m1End(P, m, Tm()), p = pink();
        B.draw({ V, tit: "KMnO₄", burCol: MNO4, dropCol: "rgba(150,40,140,.95)", vessel: "erlen", heat: Tm() > 25, temp: Tm(),
          col: p ? pinkMn(m === "A" && Tm() < 50 ? 0.3 : V - E) : B.flash > 0.05 ? `rgba(200,60,160,${(0.45 * B.flash).toFixed(3)})` : m === "B" ? "rgba(240,225,150,.4)" : EAU,
          cap: m === "A" ? "acide oxalique 10,0 mL + H₂SO₄" : "sel de Mohr 10,0 mL + H₂SO₄",
          side: [["Teinte : " + (p ? "rose persistante" : B.flash > 0.05 ? "rose qui disparaît à l'agitation" : "incolore"), p ? "#a0287f" : null, true], ["Température : " + Tm() + " °C" + (Tm() > 85 ? " — trop chaud !" : m === "A" && Tm() < 50 ? " — trop froid" : ""), Tm() > 85 || (m === "A" && Tm() < 50) ? "#c0392b" : null],
            ["Essais notés : " + (T.rows[m].map(q => f2(q.V)).join(" ; ") || "aucun")], ...(st.fin[m] ? [["Dosage terminé : « Nouveau dosage » pour l'essai suivant.", css("--accent")]] : [])] }); };
      T.draw = draw; T.tick = dt => { if (B.tick(dt)) draw(); };
      document.querySelectorAll("[data-m1m]").forEach(b => b.onclick = () => { st.m = b.dataset.m1m; save(); T.msg(""); ui(); });
      $("#m1T").addEventListener("input", () => { if (st.V[st.m] > 0 && !st.fin[st.m] && Math.abs(+$("#m1T").value - Tm()) > 0) { /* on peut ajuster pendant le dosage */ } st.T[st.m] = +$("#m1T").value; save(); ui(); });
      document.querySelectorAll("[data-m1v]").forEach(b => b.onclick = () => {
        const m = st.m; if (st.fin[m]) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        const was = pink(); if (!addV(T, st.V, m, +b.getAttribute("data-m1v"))) return; save(); B.drop();
        if (!pink()) { B.flash = 1; if (m === "A" && st.V.A <= 1.05) B.flash = 1.6; }
        T.msg(m === "A" && Tm() < 50 ? "À froid, la réaction est très lente : la couleur ne disparaît pas. Chauffe vers 60 – 70 °C." : Tm() > 85 ? "Attention : à cette température, l'acide oxalique se décompose." : !was && pink() ? "La teinte rose persiste à l'agitation." : "", (m === "A" && Tm() < 50) || Tm() > 85 ? "bad" : "ok"); ui();
      });
      $("#m1Raz").onclick = () => { st.V[st.m] = 0; st.fin[st.m] = false; st.T[st.m] = 20; save(); T.msg("Nouvelle prise d'essai (à température ambiante) ; burette remplie et ajustée au zéro."); ui(); };
      $("#m1Rec").onclick = () => {
        const m = st.m; if (st.fin[m]) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        if (!pink()) { T.msg("La solution est incolore : l'équivalence n'est pas atteinte.", "bad"); return; }
        const n = T.rows[m].length; T.add(m, { T: Tm(), V: st.V[m] }); if (T.rows[m].length > n) { st.fin[m] = true; save(); T.msg(`V_E = ${f2(st.V[m])} mL noté.`, "ok"); } ui();
      };
      $("#m1New").onclick = () => { if (lockedMsg(T)) return; P = mk(); store.set("mangan1_par", P); st = JSON.parse(JSON.stringify(def)); save(); T.clearRows(); ui(); T.msg("Nouveau matériel : refais les dosages."); };
      ui();
    }
  });

  const m2End = (P, Vf, hom) => 0.4 * (P.tv / 11.2) * 10 / Vf * 10 / P.c * (hom ? 1 : 1.25);
  window.TPX.chim.m2End = m2End;
  register({
    id: "mangan2", num: 27, lab: "C7", disc: "Chimie", court: "Manganimétrie II",
    titre: "Manganimétrie II : dosage de l'eau oxygénée par le permanganate",
    objectifs: "réaliser une dilution précise, doser l'eau oxygénée par le permanganate étalonné, exprimer le résultat en mol/L, en g/L et en « volumes », et contrôler l'indication de l'étiquette (10 volumes).",
    materiel: ["Eau oxygénée commerciale « 10 volumes »", "Burette de 50 mL remplie de KMnO₄ étalonné (concentration indiquée sur le flacon)", "Acide sulfurique H₂SO₄ à 1 mol/L", "Pipette jaugée de 10,0 mL, fiole jaugée de 100,0 mL, eau distillée", "Erlenmeyer"],
    theorie: `<div class="formula">2 MnO₄⁻ + 5 H₂O₂ + 6 H⁺ → 2 Mn²⁺ + 5 O₂ + 8 H₂O        2 C(H₂O₂) V_prise = 5 C(MnO₄⁻) V_E</div>
      <p>Le <b>titre en volumes</b> est le volume de dioxygène (en L, dans les conditions normales) libéré par 1 L de solution selon 2 H₂O₂ → 2 H₂O + O₂ :</p>
      <div class="formula">T_vol = C(H₂O₂) × 22,4 / 2 = 11,2 × C(H₂O₂)</div>
      <p>Une eau oxygénée « 10 volumes » a une concentration d'environ 0,89 mol/L : on la dilue 10 fois avant le dosage. M(H₂O₂) = 34,0 g/mol.</p>`,
    protocole: `<h4>Partie A — Dilution au 1/10</h4><ol><li>Prélève 10,0 mL d'eau oxygénée commerciale à la pipette jaugée et verse-les dans la fiole jaugée de 100,0 mL.</li><li>Complète avec de l'eau distillée jusqu'au trait de jauge (bas du ménisque sur le trait), bouche et homogénéise. Note la dilution.</li></ol>
      <h4>Partie B — Dosage</h4><ol><li>10,0 mL de la solution diluée + 10 mL de H₂SO₄, à froid.</li><li>Verse KMnO₄ jusqu'à la teinte rose persistante (un dégagement de O₂ accompagne le dosage). Deux dosages.</li></ol>`,
    precautions: `<ul><li>Termine l'ajustement au trait goutte à goutte : si tu dépasses le trait, la dilution est à refaire.</li><li>Homogénéise la fiole avant tout prélèvement.</li><li>L'eau oxygénée se décompose à la lumière et à la chaleur : flacon opaque et au frais.</li><li>Lis la burette au haut du ménisque (KMnO₄ est très foncé).</li></ul>`,
    preparation: ["Écris les demi-équations des couples MnO₄⁻/Mn²⁺ et O₂/H₂O₂ et l'équation bilan.", "Montre que T_vol = 11,2 × C(H₂O₂).", "Calcule la concentration d'une eau oxygénée à 10 volumes, puis diluée 10 fois.", "Calcule V_E attendu pour 10,0 mL de la solution diluée et KMnO₄ à 0,0200 mol/L."],
    hint: "Fais d'abord la dilution (montage A), puis dose 10,0 mL de la solution diluée par KMnO₄ jusqu'au rose persistant.",
    controls: `<h3>Étape</h3>${seg("m2m", [["A", "A · dilution"], ["B", "B · dosage"]], "A")}
      <div id="m2Dil"><h3>Dilution</h3><div class="row"><button type="button" class="btn sm" id="m2Pi">Prélever 10,0 mL et verser dans la fiole</button></div>
      <div class="ctl"><label for="m2F">Compléter avec de l'eau <b id="m2Fv"></b></label><input id="m2F" type="range" min="10" max="101" step="0.05" value="10"></div>
      <div class="row"><button type="button" class="btn sm" id="m2Ho">Boucher et homogénéiser</button><button type="button" class="btn sm" id="m2Re">Recommencer la dilution</button></div></div>
      ${burHTML("m2", "KMnO₄ étalonné")}
      ${lcd("m2", [["V", "Burette : V versé"], ["C", "État"], ["K", "Flacon de KMnO₄"]])}
      <div class="row"><button type="button" class="btn primary sm" id="m2Rec">Noter</button></div>
      <button type="button" class="btn sm" id="m2New">Changer de matériel</button>`,
    parts: [{ key: "A" }, { key: "B" }],
    questions: ["Écris les demi-équations et l'équation bilan.", "Calcule la concentration de la solution diluée, puis celle de l'eau oxygénée commerciale.", "Exprime le résultat en g/L et en volumes ; compare à l'étiquette.", "Pourquoi dilue-t-on la solution commerciale ?", "Pourquoi conserve-t-on l'eau oxygénée dans un flacon opaque et au frais ?"],
    init(T) {
      const mk = () => { const c = U(0.018, 0.022); return { c, cL: +c.toPrecision(4), tv: U(8.8, 10.0) }; };
      let P = params(T, "mangan2_par", mk, P => isFinite(P.c));
      const def = { m: "A", d: { pi: false, Vf: 10, hom: false, ok: false }, V: { B: 0 }, fin: false };
      let st = state("mangan2_st", def); const save = () => store.set("mangan2_st", st);
      const B = mkBench("mangan2-cv");
      const Vf = () => st.d.Vf, E = () => m2End(P, st.d.Vf, st.d.hom), pink = () => st.V.B >= E() - 1e-9;
      const meni = () => { const d = Vf() - 100; return Math.abs(d) <= 0.05 ? "sur le trait" : d < 0 ? (d > -1 ? "juste sous le trait (" + fx(-d, 2) + " mL)" : "sous le trait") : "AU-DESSUS du trait : à refaire"; };
      const ui = () => {
        setSeg("m2m", st.m); const m = st.m; $("#m2Dil").hidden = m !== "A"; $("#m2Bur").hidden = m !== "B";
        $("#m2F").value = Vf(); $("#m2Fv").textContent = st.d.pi ? meni() : "—";
        $("#m2Vt").textContent = m === "A" ? "Fiole jaugée" : "Burette : V versé"; $("#m2V").textContent = m === "A" ? (st.d.pi ? "ménisque " + meni() : "vide") : f2(st.V.B) + " mL";
        $("#m2C").textContent = m === "A" ? (st.d.hom ? "homogénéisée" : st.d.pi ? "non homogénéisée" : "—") : pink() ? "rose persistant" : "incolore";
        $("#m2K").textContent = fx(P.cL, 4) + " mol/L";
        $("#m2Rec").textContent = m === "A" ? "Noter la dilution" : "Noter V_E (rose persistant)"; draw();
      };
      const draw = () => { const m = st.m;
        if (m === "A") { B.draw({ V: null, cap: "fiole jaugée de 100,0 mL", side: [["Dilution : " + (st.d.ok ? "notée" : st.d.hom ? "prête à noter" : st.d.pi ? "complète au trait puis homogénéise" : "prélève 10,0 mL d'eau oxygénée"), null, true], ["Ménisque : " + (st.d.pi ? meni() : "—"), Vf() > 100.05 ? "#c0392b" : null], ["Bouchée et homogénéisée : " + (st.d.hom ? "oui" : "non")]],
          custom: G => { const { c, bx, bw, H0, fg, F } = G, by = H0 * 0.87, r = bw * 0.17, cy = by - r, nk = bw * 0.035, ntop = H0 * 0.12, mark = H0 * 0.3, lv = Vf() <= 0 ? by : Vf() < 95 ? by - 2 * r * Math.min(1, Vf() / 95) : mark + (100 - Vf()) * (H0 * 0.022);
            c.fillStyle = EAU; c.save(); c.beginPath(); c.arc(bx, cy, r, 0, 7); c.rect(bx - nk, ntop, 2 * nk, cy - ntop); c.clip(); if (st.d.pi) c.fillRect(bx - r, Math.max(ntop, lv), 2 * r, by - Math.max(ntop, lv)); c.restore();
            c.strokeStyle = fg; c.lineWidth = 1.6; c.beginPath(); c.moveTo(bx - nk, ntop); c.lineTo(bx - nk, cy - r * 0.95); c.arc(bx, cy, r, -Math.PI / 2 - 0.2, Math.PI * 1.5 + 0.2, true); c.stroke(); c.beginPath(); c.moveTo(bx + nk, ntop); c.lineTo(bx + nk, cy - r * 0.95); c.stroke();
            c.strokeStyle = "#c0392b"; c.beginPath(); c.moveTo(bx - nk - 6, mark); c.lineTo(bx + nk + 6, mark); c.stroke(); F("trait de jauge", bx + nk + 10, mark + 4, "#c0392b");
            if (st.d.hom) { c.fillStyle = "#555"; c.fillRect(bx - nk - 2, ntop - 10, 2 * nk + 4, 10); } } }); return; }
        const V = st.V.B, p = pink();
        B.draw({ V, tit: "KMnO₄ " + fx(P.cL, 4) + " mol/L", burCol: MNO4, dropCol: "rgba(150,40,140,.95)", vessel: "erlen", col: p ? pinkMn(V - E()) : B.flash > 0.05 ? `rgba(200,60,160,${(0.45 * B.flash).toFixed(3)})` : EAU,
          cap: "solution diluée 10,0 mL + H₂SO₄",
          custom: G => { if (V > 0 && !p) { const { c, bx, vy1, bw } = G; c.fillStyle = "rgba(255,255,255,.85)"; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(bx + Math.sin(i * 2.3 + V) * bw * 0.15, vy1 - 8 - ((i * 13 + V * 40) % 40), 2.2, 0, 7); c.fill(); } } },
          side: [["Teinte : " + (p ? "rose persistante" : B.flash > 0.05 ? "rose qui disparaît (dégagement de O₂)" : "incolore"), p ? "#a0287f" : null, true], ["Essais notés : " + (T.rows.B.map(q => f2(q.V)).join(" ; ") || "aucun")], ...(st.fin ? [["Dosage terminé : « Nouveau dosage » pour l'essai suivant.", css("--accent")]] : [])] });
      };
      T.draw = draw; T.tick = dt => { if (B.tick(dt)) draw(); };
      document.querySelectorAll("[data-m2m]").forEach(b => b.onclick = () => { st.m = b.dataset.m2m; save(); T.msg(""); ui(); });
      $("#m2Pi").onclick = () => { if (st.d.pi) { T.msg("Les 10,0 mL sont déjà dans la fiole. « Recommencer la dilution » pour une nouvelle fiole.", "bad"); return; } st.d = { pi: true, Vf: 10, hom: false, ok: false }; save(); T.msg("10,0 mL d'eau oxygénée sont dans la fiole jaugée. Complète avec de l'eau jusqu'au trait.", "ok"); ui(); };
      $("#m2F").addEventListener("input", () => {
        if (!st.d.pi) { $("#m2F").value = 10; T.msg("Prélève d'abord 10,0 mL d'eau oxygénée.", "bad"); return; }
        if (st.d.hom) { $("#m2F").value = st.d.Vf; T.msg("La fiole est bouchée et homogénéisée.", "bad"); return; }
        const v = +$("#m2F").value; if (v < st.d.Vf) { $("#m2F").value = st.d.Vf; T.msg("On ne peut pas retirer d'eau de la fiole.", "bad"); return; }
        st.d.Vf = v; save(); T.msg(v > 100.05 ? "Le ménisque a dépassé le trait de jauge : la dilution est à refaire." : "", v > 100.05 ? "bad" : ""); ui();
      });
      $("#m2Ho").onclick = () => { if (!st.d.pi) { T.msg("Prélève d'abord 10,0 mL d'eau oxygénée.", "bad"); return; } if (Math.abs(st.d.Vf - 100) > 0.05) { T.msg(st.d.Vf > 100 ? "Le trait est dépassé : recommence la dilution." : "Complète d'abord jusqu'au trait de jauge.", "bad"); return; } st.d.hom = true; save(); T.msg("Fiole bouchée et homogénéisée par plusieurs retournements.", "ok"); ui(); };
      $("#m2Re").onclick = () => { st.d = { pi: false, Vf: 10, hom: false, ok: false }; save(); T.msg("Fiole rincée : recommence la dilution."); ui(); };
      document.querySelectorAll("[data-m2v]").forEach(b => b.onclick = () => {
        if (!st.d.pi || st.d.Vf < 99) { T.msg("Prépare d'abord la solution diluée (montage A).", "bad"); return; }
        if (st.fin) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        const was = pink(); if (!addV(T, st.V, "B", +b.getAttribute("data-m2v"))) return; save(); B.drop(); if (!pink()) B.flash = 1;
        T.msg(!was && pink() ? "La teinte rose persiste à l'agitation." : "", "ok"); ui();
      });
      $("#m2Raz").onclick = () => { st.V.B = 0; st.fin = false; save(); T.msg("Nouvelle prise : 10,0 mL de solution diluée + 10 mL de H₂SO₄ ; burette au zéro."); ui(); };
      $("#m2Rec").onclick = () => {
        if (st.m === "A") {
          if (!st.d.hom) { T.msg("Complète au trait, puis bouche et homogénéise la fiole avant de noter la dilution.", "bad"); return; }
          if (st.d.ok) { T.msg("Cette dilution est déjà notée.", "bad"); return; }
          const n = T.rows.A.length; T.add("A", { Vp: 10, Vf: rnd(st.d.Vf, 2) }); if (T.rows.A.length > n) { st.d.ok = true; save(); T.msg("Dilution notée : 10,0 mL → 100,0 mL.", "ok"); } ui(); return;
        }
        if (st.fin) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage ».", "bad"); return; }
        if (!pink()) { T.msg("La solution est incolore : l'équivalence n'est pas atteinte.", "bad"); return; }
        const n = T.rows.B.length; T.add("B", { V: st.V.B }); if (T.rows.B.length > n) { st.fin = true; save(); T.msg(`V_E = ${f2(st.V.B)} mL noté.`, "ok"); } ui();
      };
      $("#m2New").onclick = () => { if (lockedMsg(T)) return; P = mk(); store.set("mangan2_par", P); st = JSON.parse(JSON.stringify(def)); save(); T.clearRows(); ui(); T.msg("Nouveau matériel : refais la dilution et les dosages."); };
      ui();
    }
  });
})();
