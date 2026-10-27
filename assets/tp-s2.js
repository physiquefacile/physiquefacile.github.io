/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* TP du semestre 2 (EC TP de Physique 2) : n°10 prisme, n°11 charge et décharge d'un condensateur, n°12 circuit RLC et résonance */
(function () {
  "use strict";
  const { register, $, css, fr, gauss, store, fit, txt } = window.TPCORE;
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const seg = (id, items, cur) => `<div class="seg" role="group">${items.map(([v, l]) => `<button type="button" data-${id}="${v}" aria-pressed="${v === cur}">${l}</button>`).join("")}</div>`;
  const setSeg = (id, v) => document.querySelectorAll(`[data-${id}]`).forEach(b => b.setAttribute("aria-pressed", b.getAttribute("data-" + id) === v));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const tol = p => 1 + (Math.random() * 2 - 1) * p;
  const s4 = x => +(+x).toPrecision(4);
  const r2 = x => Math.round(x * 100) / 100;
  const frs = (x, sig = 4) => isFinite(x) ? String(+(+x).toPrecision(sig)).replace(".", ",") : "—";
  window.TPX = window.TPX || {};

  /* ======================================================================
     TP 10 : LE PRISME — angle, minimum de déviation, indice et loi de Cauchy
     ====================================================================== */
  const LINES = [
    { lam: 404.7, nom: "violette", col: "#A779FF" }, { lam: 435.8, nom: "indigo", col: "#6D8BFF" }, { lam: 491.6, nom: "bleu-vert", col: "#36CFD2" },
    { lam: 546.1, nom: "verte", col: "#5BE36F" }, { lam: 578.0, nom: "jaune", col: "#F6D32D" }];
  window.TPX.LINES = LINES;
  const nOf = (P, lam) => P.a + P.b / Math.pow(lam / 1000, 2);
  const devOf = (P, lam, i) => {   // déviation (°) pour l'incidence i (°) ; NaN si la lumière ne ressort pas
    const n = nOf(P, lam), r = Math.asin(Math.sin(i * D2R) / n), rp = P.A * D2R - r, s = n * Math.sin(rp);
    if (!isFinite(r) || Math.abs(s) >= 1) return NaN;
    return i + Math.asin(s) * R2D - P.A;
  };
  const dminOf = (P, lam) => 2 * Math.asin(nOf(P, lam) * Math.sin(P.A / 2 * D2R)) * R2D - P.A;
  register({
    id: "prisme", num: 10, disc: "Optique", court: "Prisme et indice",
    titre: "Étude d'un prisme au goniomètre : angle, minimum de déviation et indice de réfraction",
    objectifs: "mesurer l'angle A d'un prisme par la méthode de réflexion, mesurer le minimum de déviation D_m pour les raies d'une lampe spectrale, en déduire l'indice n du verre pour chaque longueur d'onde et vérifier la loi de Cauchy n = a + b/λ².",
    materiel: ["Goniomètre (collimateur, plate-forme tournante, lunette, lecture numérique au 1/100 de degré)", "Prisme en verre (angle A inconnu)", "Lampe spectrale à vapeur de mercure (raies 404,7 ; 435,8 ; 491,6 ; 546,1 ; 578,0 nm)", "Lampe blanche pour la méthode de réflexion"],
    theorie: `<p>Un rayon traverse le prisme d'angle A en se réfractant sur deux faces (lois de Snell-Descartes) :</p>
      <div class="formula">sin i = n sin r      sin i′ = n sin r′      r + r′ = A      D = i + i′ − A</div>
      <h4>Minimum de déviation</h4><p>Quand on fait tourner le prisme, la déviation D passe par un minimum D_m. Le trajet est alors symétrique : i = i′ et r = r′ = A/2, d'où</p>
      <div class="formula">n = sin((A + D_m)/2) / sin(A/2)</div>
      <h4>Mesure de l'angle A (méthode de réflexion)</h4><p>L'arête du prisme est tournée vers le collimateur : chaque face réfléchit une partie du faisceau. Les deux faisceaux réfléchis font entre eux l'angle 2A ; avec les lectures θ₁ et θ₂ de la lunette :</p>
      <div class="formula">A = |θ₂ − θ₁| / 2</div>
      <h4>Dispersion : loi de Cauchy</h4><p>L'indice du verre dépend de la longueur d'onde (il est plus grand pour le violet que pour le jaune). Dans le visible :</p>
      <div class="formula">n = a + b / λ²        (λ en µm, b en µm²)</div>
      <p>Le graphe n = f(1/λ²) est une droite de pente b et d'ordonnée à l'origine a.</p>`,
    protocole: `<h4>Réglage préliminaire — faisceau direct</h4><ol>
        <li>Prisme retiré (réglage « Faisceau direct »), vise la fente éclairée : amène le réticule de la lunette exactement sur l'image de la fente.</li>
        <li>Clique sur « Noter θ₀ » : c'est la lecture du faisceau non dévié, qui servira de référence pour les déviations.</li></ol>
      <h4>Partie A — Angle A du prisme</h4><ol>
        <li>Choisis « Angle A (réflexion) » : l'arête du prisme fait face au collimateur.</li>
        <li>Cherche avec la lunette la première image réfléchie de la fente, mets le réticule dessus : « Noter θ₁ ».</li>
        <li>Cherche la seconde image (de l'autre côté), mets le réticule dessus : « Noter θ₂ et enregistrer ».</li>
        <li>Le prisme est ensuite replacé : recommence au moins 3 fois et calcule A pour chaque mesure.</li></ol>
      <h4>Partie B — Minimum de déviation pour chaque raie du mercure</h4><ol>
        <li>Choisis « Déviation minimale » et la raie étudiée. Fais tourner lentement le prisme (incidence i) en suivant la raie avec la lunette.</li>
        <li>La raie se déplace, s'arrête puis repart en sens inverse : la position d'arrêt est le minimum de déviation. Amène le réticule exactement sur la raie à cet instant et enregistre.</li>
        <li>Recommence pour les 5 raies. Calcule D_m = θ_m − θ₀, puis n avec ton angle A moyen, et trace n = f(1/λ²).</li></ol>`,
    precautions: `<ul><li>Pointe toujours la raie avec la vis fine de la lunette, et toujours dans le même sens pour éviter le jeu mécanique.</li>
      <li>Le minimum de déviation est plat : quelques dixièmes de degré sur i ne changent presque pas D. C'est pour cela qu'il se mesure précisément.</li>
      <li>Calcule n avec la calculatrice en mode <b>degrés</b>. Une erreur de 0,1° sur D_m donne une erreur d'environ 10⁻³ sur n.</li>
      <li>ΔA ≈ (Δθ₁ + Δθ₂)/2 ; ΔD_m ≈ Δθ_m + Δθ₀.</li></ul>`,
    preparation: ["Démontre les quatre formules du prisme à partir des lois de Snell-Descartes.", "Montre qu'au minimum de déviation r = r′ = A/2, puis établis n = sin((A + D_m)/2)/sin(A/2).", "Pourquoi les deux faisceaux réfléchis par les faces du prisme font-ils l'angle 2A ?", "Calcule n pour A = 60,0° et D_m = 44,5°, puis l'erreur sur n si D_m est connu à 0,1° près."],
    hint: "Vue de dessus du goniomètre (à gauche) et champ de la lunette avec son réticule (à droite). Déplace la lunette avec les curseurs ; en partie B, fais tourner le prisme et suis la raie.",
    controls: `<h3>Réglage</h3>${seg("prm", [["O", "Faisceau direct"], ["A", "Angle A (réflexion)"], ["B", "Déviation minimale"]], "O")}
      <div class="ctl"><label for="prT">Lunette (lecture θ) <b id="prTv"></b></label><input id="prT" type="range" min="0" max="360" step="0.05" value="90"></div>
      <div class="ctl"><label for="prTf">Vis fine de la lunette <b>± 0,5°</b></label><input id="prTf" type="range" min="-0.5" max="0.5" step="0.002" value="0"></div>
      <div class="ctl" id="prIw"><label for="prI">Rotation du prisme (incidence i) <b id="prIv"></b></label><input id="prI" type="range" min="30" max="80" step="0.05" value="40"></div>
      <div class="ctl" id="prLw"><label for="prL">Raie mesurée</label><select id="prL">${LINES.map((l, k) => `<option value="${k}">${l.nom} — ${String(l.lam).replace(".", ",")} nm</option>`).join("")}</select></div>
      <dl class="lcd"><dt>Lecture θ</dt><dd id="prRd"></dd><dt>θ₀ noté</dt><dd id="prR0">—</dd><dt id="prR1l">θ₁ noté</dt><dd id="prR1">—</dd></dl>
      <div class="row"><button type="button" class="btn primary sm" id="prRec0">Noter θ₀</button><button type="button" class="btn primary sm" id="prP1">Noter θ₁</button><button type="button" class="btn primary sm" id="prP2">Noter θ₂ et enregistrer</button><button type="button" class="btn primary sm" id="prRec">Enregistrer la mesure</button></div>
      <button type="button" class="btn sm" id="prNew">Changer de prisme</button>`,
    parts: [
      { key: "A", titre: "Angle A du prisme (méthode de réflexion)", cols: ["n°", "θ₁ (°)", "θ₂ (°)", "A (°)"],
        cells: (r, k) => [k + 1, fr(r.t1, 2), fr(r.t2, 2), fr(Math.abs(r.t2 - r.t1) / 2, 2)],
        point: (r, k) => [k + 1, Math.abs(r.t2 - r.t1) / 2], axes: { xl: "mesure n°", yl: "A (°)", noFit: true },
        fit: (R, rows) => rows.length ? `A moyen = ${fr(rows.reduce((s, r) => s + Math.abs(r.t2 - r.t1) / 2, 0) / rows.length, 2)}°` : "Fais au moins 3 mesures de A." },
      { key: "B", titre: "Minimum de déviation pour chaque raie", cols: ["n°", "λ (nm)", "θ₀ (°)", "θ_m (°)", "D_m (°)"],
        cells: (r, k) => [k + 1, fr(r.lam, 1), fr(r.th0, 2), fr(r.th, 2), fr(r.th - r.th0, 2)],
        point: r => [1e6 / (r.lam * r.lam), r.th - r.th0], axes: { xl: "1/λ² (µm⁻²)", yl: "D_m (°)" },
        fit: (R, rows) => rows.length ? "La déviation minimale augmente du jaune au violet : l'indice du verre augmente quand λ diminue (dispersion)." : "Mesure D_m pour les 5 raies." }
    ],
    questions: ["Donne l'angle A du prisme et son incertitude.", "Pour chaque raie, calcule D_m puis n. Comment varie n avec λ ?", "Trace n = f(1/λ²) : la loi de Cauchy est-elle vérifiée ? Donne a et b.", "Calcule l'indice n_D du verre pour la raie jaune du sodium (589,3 nm).", "Quelle couleur est la plus déviée ? Explique la dispersion de la lumière blanche par le prisme."],
    init(T) {
      let P = store.get("prisme_par", null);
      const newP = () => { P = { A: 60 + (Math.random() * 2 - 1) * 0.6, a: 1.50 + Math.random() * 0.12, b: 0.0040 + Math.random() * 0.0030, th0: 100 + (Math.random() * 2 - 1) * 4 }; store.set("prisme_par", P); };
      if (!P || !P.A) newP();
      let mode = "O", off = (Math.random() * 2 - 1) * 3, th0m = null, t1m = null;
      // lecture A moyenne de l'étudiant (pour la case « n » du compte rendu)
      window.TPX.prismeN = r => { const R = T.rows.A || []; if (!R.length) return NaN; const A = R.reduce((s, q) => s + Math.abs(q.t2 - q.t1) / 2, 0) / R.length, D = r.th - r.th0; return Math.sin((A + D) / 2 * D2R) / Math.sin(A / 2 * D2R); };
      const theta = () => +$("#prT").value + +$("#prTf").value;
      const inc = () => +$("#prI").value;
      const targets = () => {
        if (mode === "O") return [{ th: P.th0, col: "#FFFFFF", k: 0 }];
        if (mode === "A") return [{ th: P.th0 + 180 - P.A + off, col: "#FFFFFF", k: 1 }, { th: P.th0 + 180 + P.A + off, col: "#FFFFFF", k: 2 }];
        return LINES.map((l, k) => { const D = devOf(P, l.lam, inc()); return { th: P.th0 + D, col: l.col, k, D }; }).filter(t => isFinite(t.th));
      };
      const ui = () => {
        const th = theta();
        $("#prTv").textContent = fr(+$("#prT").value, 2) + "°"; $("#prIv").textContent = fr(inc(), 2) + "°";
        $("#prRd").textContent = fr(th, 2) + "°"; $("#prR0").textContent = th0m == null ? "—" : fr(th0m, 2) + "°";
        $("#prR1").textContent = t1m == null ? "—" : fr(t1m.th, 2) + "°";
        $("#prIw").hidden = mode !== "B"; $("#prLw").hidden = mode !== "B";
        $("#prR1").hidden = mode !== "A"; $("#prR1l").hidden = mode !== "A";
        $("#prRec0").hidden = mode !== "O"; $("#prP1").hidden = mode !== "A"; $("#prP2").hidden = mode !== "A"; $("#prRec").hidden = mode !== "B";
        T.draw();
      };
      const read = () => r2(theta() + gauss() * 0.003);
      const onT = t => Math.abs(t.th - theta()) <= 0.02;
      document.querySelectorAll("[data-prm]").forEach(b => b.onclick = () => { mode = b.dataset.prm; setSeg("prm", mode); t1m = null; ui(); T.msg(""); });
      ["#prT", "#prTf", "#prI"].forEach(s => $(s).addEventListener("input", ui));
      $("#prL").addEventListener("change", ui);
      $("#prRec0").onclick = () => {
        const t = targets()[0]; if (!onT(t)) { T.msg("Le réticule n'est pas exactement sur l'image de la fente : affine avec la vis fine.", "bad"); return; }
        th0m = read(); ui(); T.msg("θ₀ = " + fr(th0m, 2) + "° noté : c'est la référence des déviations.", "ok");
      };
      $("#prP1").onclick = () => {
        const t = targets().find(onT); if (!t) { T.msg("Aucune image réfléchie de la fente n'est sur le réticule : cherche-la avec la lunette, puis affine.", "bad"); return; }
        t1m = { th: read(), k: t.k }; ui(); T.msg("θ₁ noté. Cherche maintenant la seconde image réfléchie, de l'autre côté.", "ok");
      };
      $("#prP2").onclick = () => {
        if (!t1m) { T.msg("Note d'abord θ₁ sur la première image réfléchie.", "bad"); return; }
        const t = targets().find(onT); if (!t) { T.msg("Aucune image réfléchie de la fente n'est sur le réticule : cherche-la avec la lunette, puis affine.", "bad"); return; }
        if (t.k === t1m.k) { T.msg("C'est la même image que pour θ₁ : vise l'image réfléchie par l'autre face du prisme.", "bad"); return; }
        T.add("A", { t1: t1m.th, t2: read() }); t1m = null; off = (Math.random() * 2 - 1) * 3; ui();
        T.msg("Mesure enregistrée (partie A). Le prisme a été replacé : recommence pour une nouvelle mesure.", "ok");
      };
      $("#prRec").onclick = () => {
        if (th0m == null) { T.msg("Note d'abord la lecture θ₀ du faisceau direct (réglage « Faisceau direct »).", "bad"); return; }
        const k = +$("#prL").value, l = LINES[k], D = devOf(P, l.lam, inc());
        if (!isFinite(D)) { T.msg("La lumière ne ressort pas du prisme pour cette orientation : fais tourner le prisme.", "bad"); return; }
        if (Math.abs(P.th0 + D - theta()) > 0.02) { T.msg(`Le réticule n'est pas exactement sur la raie ${l.nom} : suis-la avec la lunette et affine.`, "bad"); return; }
        if (D - dminOf(P, l.lam) > 0.05) { T.msg("Ce n'est pas le minimum de déviation : fais tourner le prisme lentement ; au minimum, la raie s'arrête puis repart en sens inverse.", "bad"); return; }
        T.add("B", { lam: l.lam, th0: th0m, th: read() }); T.msg(`Mesure enregistrée (partie B, raie ${l.nom}).`, "ok");
      };
      $("#prNew").onclick = () => { if (T.locked()) { T.msg("Compte rendu déjà soumis : le matériel ne peut plus être changé.", "bad"); return; } newP(); th0m = null; t1m = null; T.clearRows(); ui(); T.msg("Nouveau prisme : refais les mesures."); };
      T.draw = () => {
        const narrow = innerWidth < 600, { c, w, h } = fit($("#prisme-cv"), narrow ? 1.25 : 0.56);
        c.fillStyle = css("--plot-bg"); c.fillRect(0, 0, w, h);
        const fg = css("--fg"), mu = css("--muted"), ac = css("--accent"), th = theta(), TG = targets();
        // ---- vue de dessus du goniomètre
        const gw = narrow ? w : w * 0.56, gh = narrow ? h * 0.55 : h, cx = gw * 0.47, cy = gh * 0.52, Rp = Math.min(gw, gh) * 0.2;
        c.strokeStyle = css("--line"); c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, Rp * 2.05, 0, 7); c.stroke();
        for (let a = 0; a < 360; a += 10) { const q = -a * D2R, r1 = Rp * 2.05, r0 = r1 - (a % 30 ? 4 : 9); c.beginPath(); c.moveTo(cx + r0 * Math.cos(q), cy + r0 * Math.sin(q)); c.lineTo(cx + r1 * Math.cos(q), cy + r1 * Math.sin(q)); c.stroke(); }
        c.fillStyle = css("--tint"); c.beginPath(); c.arc(cx, cy, Rp * 0.95, 0, 7); c.fill();
        // collimateur (fixe, à gauche) et faisceau incident
        c.fillStyle = "#8a8f98"; c.save(); c.translate(cx, cy); c.fillRect(-Rp * 2.0, -7, Rp * 0.9, 14); c.restore();
        txt(c, "collimateur", cx - Rp * 1.55, cy + 24, mu, "center");
        const ray = (a, len, col, alpha = 0.8) => { c.strokeStyle = col; c.globalAlpha = alpha; c.lineWidth = 2; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + len * Math.cos(-a * D2R), cy + len * Math.sin(-a * D2R)); c.stroke(); c.globalAlpha = 1; };
        c.strokeStyle = "#f5f1e0"; c.lineWidth = 2; c.globalAlpha = 0.8; c.beginPath(); c.moveTo(cx - Rp * 1.1, cy); c.lineTo(cx, cy); c.stroke(); c.globalAlpha = 1;
        // prisme
        const tri = rot => { const A = P.A * D2R, s = Rp * 0.75, pts = [[0, -s * 0.55], [-s * Math.tan(A / 2) * 1.1, s * 0.55], [s * Math.tan(A / 2) * 1.1, s * 0.55]];
          c.save(); c.translate(cx, cy); c.rotate(rot); c.fillStyle = "rgba(140,200,230,.35)"; c.strokeStyle = ac; c.lineWidth = 1.6; c.beginPath(); pts.forEach((p, j) => j ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fill(); c.stroke(); c.restore(); };
        if (mode === "O") ray(0, Rp * 2.0, "#f5f1e0");
        if (mode === "A") { tri(-Math.PI / 2 + off * D2R); TG.forEach(t => ray(t.th - P.th0, Rp * 2.0, "#f5f1e0", 0.7)); }
        if (mode === "B") { tri(Math.PI + (inc() - P.A / 2 - 45) * D2R * 0.6); TG.forEach(t => ray(t.D, Rp * 2.0, t.col, 0.85)); }
        // lunette (bras mobile)
        const ta = (th - P.th0) * D2R; c.save(); c.translate(cx, cy); c.rotate(-ta); c.fillStyle = css("--saff"); c.fillRect(Rp * 1.15, -8, Rp * 0.9, 16); c.fillStyle = fg; c.fillRect(Rp * 2.05, -5, 8, 10); c.restore();
        txt(c, "lunette", cx + Rp * 1.6 * Math.cos(-ta), cy + Rp * 1.6 * Math.sin(-ta) - 14, css("--saff"), "center");
        txt(c, mode === "O" ? "prisme retiré" : mode === "A" ? "arête face au collimateur" : "incidence i = " + fr(inc(), 1) + "°", 10, 18, mu, "left");
        // ---- champ de la lunette
        const re = narrow ? Math.min(w * 0.3, h * 0.19) : Math.min(h * 0.4, (w - gw) * 0.42), ex = narrow ? w / 2 : gw + (w - gw) / 2, ey = narrow ? gh + (h - gh) / 2 - 6 : h * 0.5, FOV = 1.0;
        c.fillStyle = "#05070b"; c.beginPath(); c.arc(ex, ey, re, 0, 7); c.fill();
        c.save(); c.beginPath(); c.arc(ex, ey, re, 0, 7); c.clip();
        TG.forEach(t => { const x = ex + (t.th - th) / FOV * re; if (Math.abs(x - ex) > re + 6) return; c.shadowColor = t.col; c.shadowBlur = 10; c.fillStyle = t.col; c.fillRect(x - 1.6, ey - re, 3.2, 2 * re); c.shadowBlur = 0; });
        c.strokeStyle = "rgba(255,255,255,.75)"; c.lineWidth = 1; c.beginPath(); c.moveTo(ex - re, ey); c.lineTo(ex + re, ey); c.moveTo(ex, ey - re); c.lineTo(ex, ey + re); c.stroke();
        c.restore(); c.strokeStyle = mu; c.lineWidth = 2; c.beginPath(); c.arc(ex, ey, re, 0, 7); c.stroke();
        txt(c, "champ de la lunette (± 1°)", ex, ey - re - 8, mu, "center");
        txt(c, "θ = " + fr(th, 2) + "°", ex, ey + re + 18, fg, "center", "alphabetic", "600 13px 'Fira Mono',monospace");
      };
      ui();
    }
  });

  /* ======================================================================
     TP 11 : CHARGE ET DÉCHARGE D'UN CONDENSATEUR (circuit RC)
     ====================================================================== */
  const RCR = { a: 1000, b: 2200, c: 4700, d: 10000 };
  const fR = v => v >= 1000 ? String(v / 1000).replace(".", ",") + " kΩ" : v + " Ω";
  const TACQ = [0.2, 0.5, 1, 2, 5, 10, 20];
  register({
    id: "rc", num: 11, disc: "Électricité", court: "Charge et décharge RC",
    titre: "Charge et décharge d'un condensateur à travers une résistance (circuit RC)",
    objectifs: "enregistrer la charge et la décharge d'un condensateur, déterminer la constante de temps τ = RC par la méthode des 63 % et par linéarisation (logarithme), puis vérifier que τ est proportionnelle à R et en déduire la capacité C.",
    materiel: ["Générateur de tension continue E", "Condensateur de capacité C (valeur indiquée sur le boîtier)", "Résistances 1 kΩ, 2,2 kΩ, 4,7 kΩ et 10 kΩ", "Inverseur K (position 1 : charge ; position 2 : décharge)", "Système d'acquisition (oscilloscope à mémoire) avec curseur", "Voltmètre"],
    theorie: `<p>Le condensateur se charge sous la tension E à travers R (K en position 1). La loi des mailles et i = C du_C/dt donnent :</p>
      <div class="formula">RC du_C/dt + u_C = E     ⟹     u_C(t) = E (1 − e^(−t/τ))     avec  τ = RC</div>
      <p>Pour la décharge (K en position 2, u_C = U₀ à t = 0) :</p>
      <div class="formula">RC du_C/dt + u_C = 0     ⟹     u_C(t) = U₀ e^(−t/τ)</div>
      <h4>Mesure de τ</h4><ul><li><b>Méthode des 63 %</b> : à t = τ, u_C = E (1 − e⁻¹) ≈ 0,63 E pendant la charge (et 0,37 U₀ pendant la décharge).</li>
      <li><b>Linéarisation</b> : ln(E − u_C) = ln E − t/τ (charge) et ln u_C = ln U₀ − t/τ (décharge). Ces graphes en fonction de t sont des droites de pente −1/τ.</li></ul>
      <p>Comme τ = RC, le graphe τ = f(R) est une droite passant par l'origine de pente C.</p>`,
    protocole: `<h4>Partie A — Charge (une seule résistance)</h4><ol>
        <li>Choisis R et une durée d'acquisition d'environ 5τ. Vérifie que le condensateur est déchargé, puis bascule K en position 1 (« Charger »).</li>
        <li>Lis E au voltmètre. Avec le curseur, relève au moins 6 points (t ; u_C) répartis sur la montée, avant que u_C n'atteigne E.</li>
        <li>Calcule E − u_C et ln(E − u_C), trace ln(E − u_C) = f(t) et déduis τ de la pente.</li></ol>
      <h4>Partie B — Décharge (même résistance)</h4><ol>
        <li>Le condensateur étant chargé, bascule K en position 2 (« Décharger »).</li>
        <li>Relève au moins 6 points (t ; u_C). Trace ln(u_C) = f(t) et déduis τ.</li></ol>
      <h4>Partie C — Influence de R</h4><ol>
        <li>Pour chacune des 4 résistances : décharge le condensateur, lance une charge, place le curseur à l'instant où u_C = 0,63 E et note τ.</li>
        <li>Trace τ = f(R) avec R en kΩ : la pente donne C.</li></ol>`,
    precautions: `<ul><li>Décharge complètement le condensateur avant chaque charge (au moins 5τ en position 2).</li>
      <li>N'utilise pas les points où u_C est très proche de E (charge) ou de 0 (décharge) : ln(E − u_C) ou ln u_C y deviennent très imprécis.</li>
      <li>Choisis la durée d'acquisition pour que la courbe occupe tout l'écran : la lecture de t au curseur en est plus précise.</li>
      <li>Les résistances ont une tolérance de ±5 % et le condensateur de ±10 % : C mesurée peut s'écarter de la valeur indiquée.</li></ul>`,
    preparation: ["Établis l'équation différentielle de la charge et vérifie que u_C(t) = E(1 − e^(−t/τ)) en est la solution.", "Montre que u_C(τ) ≈ 0,63 E. Que vaut u_C au bout de 5τ ?", "Vérifie que le produit RC a la dimension d'un temps.", "Calcule τ pour R = 4,7 kΩ et C = 100 µF, et la durée d'acquisition à choisir."],
    hint: "Choisis R et la durée, puis charge ou décharge le condensateur. Déplace le curseur sur la courbe enregistrée pour lire t et u_C.",
    controls: `<h3>Circuit</h3>
      <div class="ctl"><label for="rcR">Résistance R</label><select id="rcR">${Object.keys(RCR).map(k => `<option value="${k}">R = ${fR(RCR[k])}</option>`).join("")}</select></div>
      <div class="ctl"><label for="rcT">Durée d'acquisition</label><select id="rcT">${TACQ.map(v => `<option value="${v}"${v === 2 ? " selected" : ""}>${String(v).replace(".", ",")} s (${String(v / 10).replace(".", ",")} s/div)</option>`).join("")}</select></div>
      <div class="row"><button type="button" class="btn sm" id="rcCh">Charger (K → 1)</button><button type="button" class="btn sm" id="rcDe">Décharger (K → 2)</button></div>
      <h3>Lecture au curseur</h3>
      <div class="ctl"><label for="rcC">Curseur <b id="rcCv"></b></label><input id="rcC" type="range" min="0" max="500" step="1" value="100"></div>
      <dl class="lcd"><dt>Voltmètre (E)</dt><dd id="rcE"></dd><dt>C indiquée</dt><dd id="rcCn"></dd><dt>t (curseur)</dt><dd id="rcTt">—</dd><dt>u_C (curseur)</dt><dd id="rcU">—</dd></dl>
      <div class="row"><button type="button" class="btn primary sm" id="rcRec">Enregistrer le point</button><button type="button" class="btn primary sm" id="rcTau">Noter τ (63 %)</button></div>
      <button type="button" class="btn sm" id="rcNew">Changer de matériel</button>`,
    parts: [
      { key: "A", titre: "Charge du condensateur", cols: ["n°", "R", "E (V)", "t (s)", "u_C (V)"],
        cells: (r, k) => [k + 1, fR(r.R), fr(r.E, 2), frs(r.t), fr(r.u, 2)],
        point: r => [r.t, r.u], axes: { xl: "t (s)", yl: "u_C (V)", xmin: 0, ymin: 0, noFit: true },
        fit: (R, rows) => rows.length ? "u_C(t) monte vers E : la courbe n'est pas une droite. Linéarise avec ln(E − u_C) dans le compte rendu." : "Relève au moins 6 points pendant la charge." },
      { key: "B", titre: "Décharge du condensateur", cols: ["n°", "R", "U₀ (V)", "t (s)", "u_C (V)"],
        cells: (r, k) => [k + 1, fR(r.R), fr(r.U0, 2), frs(r.t), fr(r.u, 2)],
        point: r => [r.t, r.u], axes: { xl: "t (s)", yl: "u_C (V)", xmin: 0, ymin: 0, noFit: true },
        fit: (R, rows) => rows.length ? "u_C(t) décroît exponentiellement vers 0. Linéarise avec ln(u_C) dans le compte rendu." : "Relève au moins 6 points pendant la décharge." },
      { key: "C", titre: "Influence de R sur τ", cols: ["n°", "R", "τ (s)"],
        cells: (r, k) => [k + 1, fR(r.R), frs(r.t)],
        point: r => [r.R / 1000, r.t], axes: { xl: "R (kΩ)", yl: "τ (s)", xmin: 0, ymin: 0 },
        fit: R => R ? `τ = ${frs(R.a, 3)} · R ${R.b < 0 ? "−" : "+"} ${frs(Math.abs(R.b), 2)}  (R en kΩ, r = ${fr(R.r, 4)})` : "Au moins 2 mesures sont nécessaires." }
    ],
    questions: ["Donne τ obtenue en charge (partie A) et en décharge (partie B). Sont-elles égales ?", "Compare τ à la valeur lue directement à 63 % de E.", "Le graphe τ = f(R) est-il une droite passant par l'origine ? Déduis-en C.", "Compare C mesurée à la valeur indiquée sur le condensateur (tolérance ±10 %).", "Au bout de combien de temps le condensateur est-il chargé à 99 % ?"],
    init(T) {
      let P = store.get("rc_par", null);
      const newP = () => { const Cn = pick([47, 100, 220]), R = {}; Object.keys(RCR).forEach(k => R[k] = { nom: RCR[k], R: RCR[k] * tol(0.04) }); P = { E: 4.5 + Math.random() * 1.5, Cn, C: Cn * tol(0.08), R }; store.set("rc_par", P); };
      if (!P || !P.R) newP();
      const Erd = () => r2(P.E);
      let uC = 0, acq = null, raf = null;
      const tauOf = k => P.R[k].R * P.C * 1e-6;
      const Tacq = () => +$("#rcT").value;
      const uAt = (a, t) => a.type === "c" ? P.E + (a.u0 - P.E) * Math.exp(-t / a.tau) : a.u0 * Math.exp(-t / a.tau);
      const elapsed = () => { if (!acq) return 0; const sp = acq.T > 5 ? acq.T / 5 : 1; return Math.min(acq.T, (performance.now() - acq.t0) / 1000 * sp); };
      const cur = () => { if (!acq) return null; const i = +$("#rcC").value, t = acq.T * i / 500; if (t > elapsed() + 1e-9) return { t, u: NaN }; return { t, u: Math.round((uAt(acq, t) + acq.nz[i]) * 100) / 100 }; };
      const ui = () => {
        $("#rcE").textContent = fr(Erd(), 2) + " V"; $("#rcCn").textContent = P.Cn + " µF";
        const q = cur(); $("#rcCv").textContent = q ? frs(q.t) + " s" : "—";
        $("#rcTt").textContent = q ? frs(q.t) + " s" : "—"; $("#rcU").textContent = q && isFinite(q.u) ? fr(q.u, 2) + " V" : "—";
        T.draw();
      };
      const start = type => {
        if (acq && !acq.done) { T.msg("Acquisition en cours : attends la fin de l'enregistrement.", "bad"); return; }
        if (type === "c" && uC > 0.02 * P.E) { T.msg("Le condensateur n'est pas déchargé : bascule d'abord K en position 2 assez longtemps (au moins 5τ).", "bad"); return; }
        const k = $("#rcR").value, T0 = Tacq();
        acq = { type, k, R: RCR[k], tau: tauOf(k), u0: uC, T: T0, t0: performance.now(), done: false, nz: Array.from({ length: 501 }, () => gauss() * 0.004) };
        T.msg(type === "c" ? "Charge en cours (K en position 1)…" : "Décharge en cours (K en position 2)…");
        const step = () => { if (elapsed() >= acq.T) { acq.done = true; uC = uAt(acq, acq.T); ui(); T.msg("Enregistrement terminé : déplace le curseur pour lire t et u_C."); raf = null; return; } ui(); raf = requestAnimationFrame(step); };
        if (raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(step);
      };
      $("#rcCh").onclick = () => start("c"); $("#rcDe").onclick = () => start("d");
      ["#rcC"].forEach(s => $(s).addEventListener("input", ui)); $("#rcT").addEventListener("change", ui); $("#rcR").addEventListener("change", ui);
      $("#rcRec").onclick = () => {
        if (!acq) { T.msg("Lance d'abord une charge ou une décharge.", "bad"); return; }
        const q = cur(); if (!q || !isFinite(q.u)) { T.msg("Le curseur est au-delà de la partie déjà enregistrée de la courbe.", "bad"); return; }
        const part = acq.type === "c" ? "A" : "B", rows = T.rows[part];
        if (rows.length && rows[0].R !== acq.R) { T.msg(`Partie ${part} : garde la même résistance que pour tes premiers points (R = ${fR(rows[0].R)}).`, "bad"); return; }
        if (part === "A" && acq.u0 > 0.02 * P.E) { T.msg("Cette charge n'est pas partie d'un condensateur déchargé : décharge-le puis recommence.", "bad"); return; }
        if (part === "A" && Erd() - q.u < 0.05) { T.msg("u_C est trop proche de E : choisis un point plus tôt (ln(E − u_C) serait très imprécis).", "bad"); return; }
        if (part === "B" && q.u < 0.05) { T.msg("u_C est trop proche de 0 : choisis un point plus tôt (ln u_C serait très imprécis).", "bad"); return; }
        if (part === "A") T.add("A", { R: acq.R, E: Erd(), t: s4(q.t), u: q.u }); else T.add("B", { R: acq.R, U0: r2(acq.u0), t: s4(q.t), u: q.u });
        T.msg(`Point enregistré (partie ${part}).`, "ok");
      };
      $("#rcTau").onclick = () => {
        if (!acq || acq.type !== "c") { T.msg("τ se lit sur une courbe de CHARGE : lance une charge.", "bad"); return; }
        if (acq.u0 > 0.02 * P.E) { T.msg("Cette charge n'est pas partie d'un condensateur déchargé : décharge-le puis recommence.", "bad"); return; }
        const q = cur(); if (!q || !isFinite(q.u)) { T.msg("Le curseur est au-delà de la partie déjà enregistrée de la courbe.", "bad"); return; }
        if (Math.abs(q.u - 0.632 * Erd()) > 0.006 * Erd() + 0.01) { T.msg("Le curseur n'est pas à l'instant où u_C atteint 63 % de E : calcule 0,63 × E et déplace le curseur.", "bad"); return; }
        T.add("C", { R: acq.R, t: s4(q.t) }); T.msg(`τ noté pour R = ${fR(acq.R)} (partie C).`, "ok");
      };
      $("#rcNew").onclick = () => { if (T.locked()) { T.msg("Compte rendu déjà soumis : le matériel ne peut plus être changé.", "bad"); return; } newP(); uC = 0; acq = null; T.clearRows(); ui(); T.msg("Nouveau matériel : refais les mesures."); };
      T.draw = () => {
        const narrow = innerWidth < 600, { c, w, h } = fit($("#rc-cv"), narrow ? 1.25 : 0.56);
        c.fillStyle = css("--plot-bg"); c.fillRect(0, 0, w, h);
        const fg = css("--fg"), mu = css("--muted"), ac = css("--accent");
        // ---- schéma du circuit
        const sw = narrow ? w : w * 0.34, sh = narrow ? h * 0.36 : h, X0 = sw * 0.14, X1 = sw * 0.86, Y0 = sh * 0.24, Y1 = sh * 0.78;
        c.strokeStyle = fg; c.lineWidth = 1.6;
        const line = (a, b, cc, d) => { c.beginPath(); c.moveTo(a, b); c.lineTo(cc, d); c.stroke(); };
        // générateur (gauche)
        line(X0, Y0, X0, Y0 + (Y1 - Y0) * 0.38); line(X0, Y0 + (Y1 - Y0) * 0.62, X0, Y1);
        c.beginPath(); c.arc(X0, (Y0 + Y1) / 2, (Y1 - Y0) * 0.12, 0, 7); c.stroke(); txt(c, "E", X0 + (Y1 - Y0) * 0.12 + 6, (Y0 + Y1) / 2 + 4, fg, "left");
        txt(c, "+", X0 - 10, (Y0 + Y1) / 2 - (Y1 - Y0) * 0.12 - 2, fg, "center");
        // inverseur K : borne commune reliée à R ; position 1 vers E (charge), position 2 vers le bas de la maille (décharge, E hors circuit)
        const kx = X0 + (X1 - X0) * 0.36, pos = acq ? acq.type : "d";
        line(X0, Y0, X0, Y0 - 12); line(X0, Y0 - 12, kx - 14, Y0 - 12);
        c.fillStyle = fg; [[kx - 14, Y0 - 12], [kx - 14, Y0 + 12], [kx + 14, Y0]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 3, 0, 7); c.fill(); });
        txt(c, "1", kx - 20, Y0 - 16, mu, "right"); txt(c, "2", kx - 20, Y0 + 24, mu, "right");
        line(kx - 14, Y0 + 12, kx - 14, Y1);
        c.strokeStyle = css("--saff"); c.lineWidth = 2.4; line(kx + 14, Y0, kx - 14, pos === "c" ? Y0 - 12 : Y0 + 12); c.strokeStyle = fg; c.lineWidth = 1.6; txt(c, "K", kx + 4, Y0 + 30, fg, "center");
        // R puis C (droite)
        const rx = kx + 14; line(rx, Y0, X1, Y0);
        c.fillStyle = css("--plot-bg"); c.fillRect(rx + (X1 - rx) * 0.2, Y0 - 8, (X1 - rx) * 0.5, 16); c.strokeRect(rx + (X1 - rx) * 0.2, Y0 - 8, (X1 - rx) * 0.5, 16); txt(c, "R = " + fR(RCR[$("#rcR").value]), rx + (X1 - rx) * 0.45, Y0 - 14, ac, "center");
        line(X1, Y0, X1, (Y0 + Y1) / 2 - 6); line(X1 - 16, (Y0 + Y1) / 2 - 6, X1 + 16, (Y0 + Y1) / 2 - 6); line(X1 - 16, (Y0 + Y1) / 2 + 6, X1 + 16, (Y0 + Y1) / 2 + 6); line(X1, (Y0 + Y1) / 2 + 6, X1, Y1);
        txt(c, "C", X1 + 20, (Y0 + Y1) / 2 + 4, ac); txt(c, "u_C", X1 - 20, (Y0 + Y1) / 2 + 4, css("--saff"), "right");
        line(X0, Y1, X1, Y1);
        txt(c, "voltmètre : E = " + fr(Erd(), 2) + " V", X0, sh - 8, mu);
        // ---- écran d'acquisition
        const ox = narrow ? 8 : sw + 8, oy = narrow ? sh + 4 : 8, ow = narrow ? w - 16 : w - sw - 16, oh = narrow ? h - sh - 12 : h - 16;
        c.fillStyle = "#20262c"; c.fillRect(ox, oy, ow, oh);
        const u = Math.floor(Math.min((ow - 20) / 10, (oh - 40) / 8)), W = 10 * u, H = 8 * u, x0 = ox + Math.round((ow - W) / 2), y0 = oy + 8;
        c.fillStyle = "#06140b"; c.fillRect(x0 - 3, y0 - 3, W + 6, H + 6);
        c.strokeStyle = "rgba(120,200,140,.28)"; c.lineWidth = 1;
        for (let i = 0; i <= 10; i++) { c.beginPath(); c.moveTo(x0 + i * u + .5, y0); c.lineTo(x0 + i * u + .5, y0 + H); c.stroke(); }
        for (let j = 0; j <= 8; j++) { c.beginPath(); c.moveTo(x0, y0 + j * u + .5); c.lineTo(x0 + W, y0 + j * u + .5); c.stroke(); }
        const S = 1, Y = v => y0 + H - u - v / S * u, Tm = acq ? acq.T : Tacq(), X = t => x0 + t / Tm * W;
        if (acq) {
          const te = elapsed(); c.save(); c.beginPath(); c.rect(x0, y0, W, H); c.clip();
          c.strokeStyle = "#7CFF8A"; c.lineWidth = 2; c.shadowColor = "#7CFF8A"; c.shadowBlur = 6; c.beginPath();
          for (let i = 0; i <= 500; i++) { const t = Tm * i / 500; if (t > te) break; const v = uAt(acq, t) + acq.nz[i]; i ? c.lineTo(X(t), Y(v)) : c.moveTo(X(t), Y(v)); }
          c.stroke(); c.shadowBlur = 0;
          const q = cur(); if (q) { c.strokeStyle = "#FFD166"; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(X(q.t), y0); c.lineTo(X(q.t), y0 + H); c.stroke(); if (isFinite(q.u)) { c.beginPath(); c.moveTo(x0, Y(q.u)); c.lineTo(x0 + W, Y(q.u)); c.stroke(); } c.setLineDash([]); }
          c.restore();
        } else txt(c, "Lance une charge ou une décharge", x0 + W / 2, y0 + H / 2, "#c9d3dc", "center", "middle", "13px 'Fira Sans',Arial");
        const ly = y0 + H + 18;
        txt(c, `u_C : ${S} V/div  •  ${String(Tm / 10).replace(".", ",")} s/div${W > 420 ? "  •  0 V : 1ʳᵉ division en bas" : ""}`, x0, ly, "#c9d3dc", "left", "alphabetic", "600 11px 'Fira Mono',monospace");
        if (acq && !acq.done) txt(c, "● acquisition", x0 + W, ly, "#FF6B6B", "right", "alphabetic", "600 12px 'Fira Sans',Arial");
      };
      ui();
    }
  });

  /* ======================================================================
     TP 12 : CIRCUIT RLC SÉRIE — résonance d'intensité
     ====================================================================== */
  const RLR = { a: 22, b: 100 };
  const fF = f => String(+(+f).toPrecision(4)).replace(".", ",");
  register({
    id: "rlc", num: 12, disc: "Électricité", court: "Circuit RLC et résonance",
    titre: "Circuit RLC série en régime sinusoïdal forcé : résonance d'intensité",
    objectifs: "tracer la courbe de résonance I = f(f) d'un circuit RLC série pour deux résistances, mesurer la fréquence de résonance f₀, la bande passante Δf et le facteur de qualité Q, et en déduire l'inductance L et la résistance r de la bobine.",
    materiel: ["Générateur basse fréquence (GBF) sinusoïdal, tension efficace U constante", "Bobine d'inductance L et de résistance r inconnues", "Condensateur de capacité C (valeur indiquée)", "Résistances 22 Ω et 100 Ω", "Ampèremètre (position AC)", "Oscilloscope bicourbe (u_G sur CH1, u_R sur CH2)"],
    theorie: `<p>En régime sinusoïdal forcé de fréquence f (pulsation ω = 2πf), l'intensité efficace dans le circuit R, L (r), C série vaut :</p>
      <div class="formula">I = U / Z      avec   Z = √((R + r)² + (Lω − 1/(Cω))²)</div>
      <h4>Résonance d'intensité</h4><p>I est maximale quand Lω = 1/(Cω), c'est-à-dire pour la fréquence propre :</p>
      <div class="formula">f₀ = 1 / (2π√(LC))        I₀ = U / (R + r)</div>
      <p>À la résonance, l'intensité et la tension du générateur sont en phase (u_R et u_G en phase sur l'oscilloscope).</p>
      <h4>Bande passante et facteur de qualité</h4><p>Les fréquences f₁ et f₂ pour lesquelles I = I₀/√2 limitent la bande passante :</p>
      <div class="formula">Δf = f₂ − f₁ = (R + r) / (2πL)        Q = f₀ / Δf = (1/(R + r)) √(L/C)</div>
      <p>Plus la résistance totale est faible, plus la résonance est aiguë (Q grand).</p>`,
    protocole: `<h4>Partie A — Courbe de résonance avec R = 22 Ω</h4><ol>
        <li>Lis la tension efficace U du GBF (elle reste constante). Choisis R = 22 Ω.</li>
        <li>Balaye la fréquence et repère approximativement f₀ (I maximale, u_R et u_G en phase).</li>
        <li>Relève au moins 10 couples (f ; I), resserrés autour de f₀. Cherche et enregistre aussi les deux fréquences f₁ et f₂ où I = I₀/√2.</li>
        <li>Calcule Z = U/I pour chaque point et trace I = f(f).</li></ol>
      <h4>Partie B — Influence de la résistance (R = 100 Ω)</h4><ol>
        <li>Remplace R par 100 Ω et recommence (au moins 8 points, avec f₁ et f₂).</li>
        <li>Compare les deux courbes : f₀, I₀ et la largeur de la résonance.</li></ol>`,
    precautions: `<ul><li>Vérifie que la tension U du GBF ne varie pas pendant les mesures.</li>
      <li>Près de la résonance, l'intensité varie vite : prends des points rapprochés (réglage fin de la fréquence).</li>
      <li>L'ampèremètre doit être en position alternative (AC) : il indique la valeur efficace.</li>
      <li>Pour Δf, interpole entre tes points si f₁ ou f₂ ne sont pas exactement mesurées.</li></ul>`,
    preparation: ["Établis l'expression de l'impédance Z d'un circuit RLC série.", "Montre que I est maximale pour f₀ = 1/(2π√(LC)) et que I₀ = U/(R + r).", "Calcule f₀ pour L = 33 mH et C = 1,0 µF.", "Montre que Q = f₀/Δf = (1/(R + r))√(L/C) et calcule Q pour R + r = 34 Ω."],
    hint: "Règle la fréquence du GBF avec les curseurs ; l'ampèremètre indique I, l'oscilloscope montre u_G (jaune) et u_R (vert) : à la résonance, ils sont en phase.",
    controls: `<h3>Résistance R</h3>${seg("rlr", [["a", "R = 22 Ω (partie A)"], ["b", "R = 100 Ω (partie B)"]], "a")}
      <div class="ctl"><label for="rlF">Fréquence du GBF <b id="rlFv"></b></label><input id="rlF" type="range" min="0" max="1000" step="1" value="400"></div>
      <div class="ctl"><label for="rlFf">Réglage fin <b>± 3 %</b></label><input id="rlFf" type="range" min="-3" max="3" step="0.01" value="0"></div>
      <dl class="lcd"><dt>GBF : f</dt><dd id="rlFd"></dd><dt>GBF : U (voltmètre)</dt><dd id="rlUd"></dd><dt>Ampèremètre : I</dt><dd id="rlId"></dd><dt>C indiquée</dt><dd id="rlCd"></dd></dl>
      <div class="row"><button type="button" class="btn primary sm" id="rlRec">Enregistrer (f ; I)</button></div>
      <button type="button" class="btn sm" id="rlNew">Changer de matériel</button>`,
    parts: [
      { key: "A", titre: "Courbe de résonance avec R = 22 Ω", cols: ["n°", "R", "U (V)", "f (Hz)", "I (mA)"],
        cells: (r, k) => [k + 1, r.R + " Ω", fr(r.U, 2), fF(r.f), frs(r.I)],
        point: r => [r.f, r.I], axes: { xl: "f (Hz)", yl: "I (mA)", ymin: 0, noFit: true },
        fit: (R, rows) => { if (!rows.length) return "Relève au moins 10 points (f ; I)."; const m = rows.reduce((a, r) => r.I > a.I ? r : a, rows[0]); return `Intensité la plus grande mesurée : ${frs(m.I)} mA pour f = ${fF(m.f)} Hz.`; } },
      { key: "B", titre: "Courbe de résonance avec R = 100 Ω", cols: ["n°", "R", "U (V)", "f (Hz)", "I (mA)"],
        cells: (r, k) => [k + 1, r.R + " Ω", fr(r.U, 2), fF(r.f), frs(r.I)],
        point: r => [r.f, r.I], axes: { xl: "f (Hz)", yl: "I (mA)", ymin: 0, noFit: true },
        fit: (R, rows) => { if (!rows.length) return "Relève au moins 8 points (f ; I)."; const m = rows.reduce((a, r) => r.I > a.I ? r : a, rows[0]); return `Intensité la plus grande mesurée : ${frs(m.I)} mA pour f = ${fF(m.f)} Hz.`; } }
    ],
    questions: ["Donne f₀ et I₀ pour R = 22 Ω. Déduis-en la résistance r de la bobine.", "Détermine f₁, f₂, la bande passante Δf et le facteur de qualité Q pour chaque résistance.", "Avec la valeur indiquée de C, calcule L à partir de f₀.", "Comment la résistance modifie-t-elle la résonance (f₀, I₀, Δf) ?", "Comment reconnaît-on la résonance sur l'oscilloscope ?"],
    init(T) {
      let P = store.get("rlc_par", null);
      const newP = () => { const Cn = pick([0.47, 1.0, 2.2]), R = {}; Object.keys(RLR).forEach(k => R[k] = { nom: RLR[k], R: RLR[k] * tol(0.03) }); P = { U: 1.9 + Math.random() * 0.2, L: pick([0.020, 0.033, 0.047]) * tol(0.05), r: 8 + Math.random() * 8, Cn, C: Cn * tol(0.05), R }; store.set("rlc_par", P); };
      if (!P || !P.R) newP();
      let rk = "a";
      const fq = () => { const f = 50 * Math.pow(200, +$("#rlF").value / 1000) * (1 + +$("#rlFf").value / 100); return s4(f); };
      const Zof = f => { const w = 2 * Math.PI * f; return Math.sqrt(Math.pow(P.R[rk].R + P.r, 2) + Math.pow(P.L * w - 1 / (P.C * 1e-6 * w), 2)); };
      const Ird = f => s4(1000 * P.U / Zof(f) * (1 + 0.002 * Math.sin(f * 12.9898)));
      const ui = () => {
        const f = fq(); $("#rlFv").textContent = fF(f) + " Hz"; $("#rlFd").textContent = fF(f) + " Hz"; $("#rlUd").textContent = fr(r2(P.U), 2) + " V";
        $("#rlId").textContent = frs(Ird(f)) + " mA"; $("#rlCd").textContent = P.Cn.toPrecision(2).replace(".", ",") + " µF"; T.draw();
      };
      document.querySelectorAll("[data-rlr]").forEach(b => b.onclick = () => { rk = b.dataset.rlr; setSeg("rlr", rk); ui(); T.msg(""); });
      ["#rlF", "#rlFf"].forEach(s => $(s).addEventListener("input", ui));
      $("#rlRec").onclick = () => {
        const f = fq(), part = rk === "a" ? "A" : "B";
        if (T.rows[part].some(r => Math.abs(r.f / f - 1) < 0.002)) { T.msg("Tu as déjà un point à cette fréquence : choisis une autre fréquence.", "bad"); return; }
        T.add(part, { R: RLR[rk], U: r2(P.U), f, I: Ird(f) }); T.msg(`Point enregistré (partie ${part}).`, "ok");
      };
      $("#rlNew").onclick = () => { if (T.locked()) { T.msg("Compte rendu déjà soumis : le matériel ne peut plus être changé.", "bad"); return; } newP(); T.clearRows(); ui(); T.msg("Nouveau matériel : refais les mesures."); };
      T.draw = () => {
        const narrow = innerWidth < 600, { c, w, h } = fit($("#rlc-cv"), narrow ? 1.25 : 0.56);
        c.fillStyle = css("--plot-bg"); c.fillRect(0, 0, w, h);
        const fg = css("--fg"), mu = css("--muted"), ac = css("--accent"), f = fq(), I = Ird(f);
        // ---- schéma
        const sw = narrow ? w : w * 0.38, sh = narrow ? h * 0.46 : h, X0 = sw * 0.12, X1 = sw * 0.88, Y0 = sh * 0.22, Y1 = sh * 0.74;
        c.strokeStyle = fg; c.lineWidth = 1.6; const line = (a, b, cc, d) => { c.beginPath(); c.moveTo(a, b); c.lineTo(cc, d); c.stroke(); };
        line(X0, Y0, X0, (Y0 + Y1) / 2 - 18); line(X0, (Y0 + Y1) / 2 + 18, X0, Y1);
        c.beginPath(); c.arc(X0, (Y0 + Y1) / 2, 18, 0, 7); c.stroke(); c.beginPath(); for (let k = 0; k <= 20; k++) { const x = X0 - 10 + k, y = (Y0 + Y1) / 2 - 7 * Math.sin(k / 20 * 2 * Math.PI); k ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
        txt(c, "GBF", X0, (Y0 + Y1) / 2 + 34, mu, "center");
        // ampèremètre, R, bobine, condensateur en série sur la branche du haut
        const seg5 = (X1 - X0) / 5;
        line(X0, Y0, X0 + seg5 * 0.6, Y0); c.beginPath(); c.arc(X0 + seg5 * 0.85, Y0, 12, 0, 7); c.stroke(); txt(c, "A", X0 + seg5 * 0.85, Y0 + 4, fg, "center", "alphabetic", "700 12px 'Fira Sans',Arial");
        line(X0 + seg5 * 1.1, Y0, X0 + seg5 * 1.6, Y0); c.strokeRect(X0 + seg5 * 1.6, Y0 - 8, seg5 * 0.8, 16); txt(c, RLR[rk] + " Ω", X0 + seg5 * 2.0, Y0 - 14, ac, "center");
        line(X0 + seg5 * 2.4, Y0, X0 + seg5 * 2.7, Y0); c.beginPath(); for (let k = 0; k < 4; k++) c.arc(X0 + seg5 * (2.8 + k * 0.2), Y0, seg5 * 0.1, Math.PI, 0); c.stroke(); txt(c, "L, r", X0 + seg5 * 3.1, Y0 - 14, ac, "center");
        line(X0 + seg5 * 3.5, Y0, X1, Y0); line(X1, Y0, X1, (Y0 + Y1) / 2 - 5); line(X1 - 14, (Y0 + Y1) / 2 - 5, X1 + 14, (Y0 + Y1) / 2 - 5); line(X1 - 14, (Y0 + Y1) / 2 + 5, X1 + 14, (Y0 + Y1) / 2 + 5); line(X1, (Y0 + Y1) / 2 + 5, X1, Y1);
        txt(c, "C", X1 + 18, (Y0 + Y1) / 2 + 4, ac); line(X0, Y1, X1, Y1);
        // afficheur de l'ampèremètre
        const ax = X0 + seg5 * 0.2, ay = Y1 + 12; c.fillStyle = "#1f2a24"; c.fillRect(ax, ay, Math.min(170, sw * 0.7), 30);
        txt(c, frs(I) + " mA", ax + Math.min(170, sw * 0.7) - 8, ay + 21, "#B8F5C4", "right", "alphabetic", "600 16px 'Fira Mono',monospace"); txt(c, "AC", ax + 6, ay + 19, "#7fa38a");
        // ---- oscilloscope : u_G (CH1) et u_R (CH2)
        const ox = narrow ? 8 : sw + 8, oy = narrow ? sh + 4 : 8, ow = narrow ? w - 16 : w - sw - 16, oh = narrow ? h - sh - 12 : h - 16;
        c.fillStyle = "#20262c"; c.fillRect(ox, oy, ow, oh);
        const u = Math.floor(Math.min((ow - 20) / 10, (oh - 54) / 8)), W = 10 * u, H = 8 * u, x0 = ox + Math.round((ow - W) / 2), y0 = oy + 8, two = W < 460;
        c.fillStyle = "#06140b"; c.fillRect(x0 - 3, y0 - 3, W + 6, H + 6); c.strokeStyle = "rgba(120,200,140,.28)"; c.lineWidth = 1;
        for (let i = 0; i <= 10; i++) { c.beginPath(); c.moveTo(x0 + i * u + .5, y0); c.lineTo(x0 + i * u + .5, y0 + H); c.stroke(); }
        for (let j = 0; j <= 8; j++) { c.beginPath(); c.moveTo(x0, y0 + j * u + .5); c.lineTo(x0 + W, y0 + j * u + .5); c.stroke(); }
        const w0 = 2 * Math.PI * f, Rt = P.R[rk].R + P.r, ph = -Math.atan((P.L * w0 - 1 / (P.C * 1e-6 * w0)) / Rt), UR = P.R[rk].R * I / 1000 * Math.SQRT2;
        const S1 = 1, S2 = [0.05, 0.1, 0.2, 0.5, 1].find(s => UR / s <= 3.5) || 1, Tsc = 2 / f, B = Tsc / 10;
        const trace = (fn, col) => { c.strokeStyle = col; c.lineWidth = 2; c.shadowColor = col; c.shadowBlur = 6; c.beginPath(); for (let i = 0; i <= 400; i++) { const t = Tsc * i / 400, y = fn(t); i ? c.lineTo(x0 + i / 400 * W, y0 + H / 2 - y * u) : c.moveTo(x0, y0 + H / 2 - y * u); } c.stroke(); c.shadowBlur = 0; };
        c.save(); c.beginPath(); c.rect(x0, y0, W, H); c.clip();
        trace(t => P.U * Math.SQRT2 * Math.sin(w0 * t) / S1, "#FFD166"); trace(t => UR * Math.sin(w0 * t + ph) / S2, "#7CFF8A"); c.restore();
        const fB = b => b >= 1e-3 ? fF(b * 1000) + " ms/div" : fF(b * 1e6) + " µs/div", fV = s => s >= 1 ? s + " V/div" : s * 1000 + " mV/div";
        txt(c, `CH1 u_G : ${fV(S1)}`, x0, y0 + H + 18, "#FFD166", "left", "alphabetic", "600 11px 'Fira Mono',monospace");
        txt(c, `CH2 u_R : ${fV(S2)}`, two ? x0 : x0 + W * 0.38, two ? y0 + H + 34 : y0 + H + 18, "#7CFF8A", "left", "alphabetic", "600 11px 'Fira Mono',monospace");
        txt(c, fB(B), x0 + W, y0 + H + (two ? 34 : 18), "#c9d3dc", "right", "alphabetic", "600 11px 'Fira Mono',monospace");
      };
      ui();
    }
  });
})();
