/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* TP d'optique : n°7 lentilles minces, n°8 microscope */
(function () {
  "use strict";
  const { register, $, css, fr, gauss, store, fit, txt } = window.TPCORE;
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const round05 = x => Math.round(x * 2) / 2;
  const seg = (id, items, cur) => `<div class="seg" role="group">${items.map(([v, l]) => `<button type="button" data-${id}="${v}" aria-pressed="${v === cur}">${l}</button>`).join("")}</div>`;
  const setSeg = (id, v) => document.querySelectorAll(`[data-${id}]`).forEach(b => b.setAttribute("aria-pressed", b.getAttribute("data-" + id) === v));

  /* ---------- outils communs aux TP 7 et 8 ---------- */
  const imageOf = (xo, xl, f) => { const OA = xo - xl, inv = 1 / f + 1 / OA; return Math.abs(inv) < 1e-9 ? Infinity : xl + 1 / inv; };
  function bench(c, w, by, X, mu) {
    c.fillStyle = css("--line"); c.fillRect(X(0), by + 34, X(150) - X(0), 10);
    for (let x = 0; x <= 150; x += 5) { c.strokeStyle = mu; c.lineWidth = 1; c.beginPath(); c.moveTo(X(x), by + 34); c.lineTo(X(x), by + (x % 10 ? 40 : 46)); c.stroke(); if (x % 20 === 0) txt(c, String(x), X(x), by + 60, mu, "center"); }
    txt(c, "cm", X(150), by + 74, mu, "right");
    c.setLineDash([4, 4]); c.strokeStyle = mu; c.beginPath(); c.moveTo(X(0), by); c.lineTo(X(150), by); c.stroke(); c.setLineDash([]);
  }
  function lens(c, x, by, col, label, conv = true) {
    c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.moveTo(x, by - 40); c.lineTo(x, by + 28); c.stroke(); c.fillStyle = col;
    [[-40, 1], [28, -1]].forEach(([dy, sg]) => { c.beginPath(); if (conv) { c.moveTo(x, by + dy - sg * 2); c.lineTo(x - 7, by + dy + sg * 8); c.lineTo(x + 7, by + dy + sg * 8); } c.closePath(); c.fill(); });
    txt(c, label, x, by - 48, col, "center");
  }
  function objectF(c, x, by) { c.fillStyle = css("--saff"); c.fillRect(x - 6, by - 28, 12, 28); txt(c, "F", x, by - 34, css("--saff"), "center", "alphabetic", "700 14px 'Fira Sans'"); txt(c, "objet", x, by + 24, css("--muted"), "center"); }
  // vignette « ce que l'on voit » : F net ou flou, éventuellement renversé
  function viewF(c, x, y, w, h, title, sharpness, scale, inverted, note) {
    c.fillStyle = "#f4f1e8"; c.fillRect(x, y, w, h); c.strokeStyle = css("--muted"); c.lineWidth = 1; c.strokeRect(x, y, w, h); txt(c, title, x + w / 2, y - 6, css("--muted"), "center");
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    if (sharpness != null) { const size = Math.max(8, Math.min(h * 1.5, scale * h * 0.35)), bl = Math.min(28, sharpness * 60), n = bl < 0.6 ? 1 : 22;
      c.fillStyle = "#d98e04"; c.globalAlpha = n === 1 ? 1 : 0.1;
      for (let k = 0; k < n; k++) { const a = k / n * 6.283, r = n === 1 ? 0 : bl * (0.35 + 0.65 * ((k * 7) % n) / n); c.save(); c.translate(x + w / 2 + Math.cos(a) * r, y + h / 2 + Math.sin(a) * r); if (inverted) c.rotate(Math.PI); c.font = `700 ${size}px 'Fira Sans',Arial`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("F", 0, 0); c.restore(); }
      c.globalAlpha = 1; } else { c.fillStyle = "rgba(217,142,4,.15)"; c.beginPath(); c.arc(x + w / 2, y + h / 2, h * 0.42, 0, 7); c.fill(); }
    if (note) txt(c, note, x + w / 2, y + h - 6, "#7a6a4a", "center");
    c.restore();
  }

  /* ========================= TP 7 : LENTILLES ========================= */
  register({
    id: "lentilles", num: 7, disc: "Optique", court: "Lentilles et focométrie",
    titre: "Lois des lentilles : détermination de la distance focale",
    objectifs: "déterminer la distance focale f′ d'une lentille mince convergente par trois méthodes — autocollimation, plans conjugués (relation de conjugaison) et méthode de Bessel — puis comparer leur précision.",
    materiel: ["Banc d'optique gradué", "Objet lumineux (lettre F éclairée)", "Lentille mince convergente (f′ inconnue)", "Miroir plan", "Écran", "Supports"],
    theorie: `<p>Pour une lentille mince de centre O, de foyers F et F′, un objet A a une image A′ telle que (distances algébriques, sens de la lumière positif) :</p>
      <div class="formula">1/OA′ − 1/OA = 1/f′        grandissement  γ = A′B′/AB = OA′/OA</div>
      <h4>1. Autocollimation</h4><p>On place un miroir plan juste derrière la lentille. Si l'objet est dans le plan focal objet, les rayons sortent de la lentille parallèles, se réfléchissent sur le miroir et reviennent former une image <b>nette dans le plan de l'objet</b>, renversée. On lit alors directement <b>f′ = distance objet–lentille</b>.</p>
      <h4>2. Plans conjugués</h4><p>On mesure OA et OA′ pour plusieurs positions. Le graphe 1/OA′ = f(1/OA) est une droite de pente 1 et d'ordonnée à l'origine 1/f′ (la vergence V en dioptries δ si les distances sont en mètres).</p>
      <h4>3. Méthode de Bessel</h4><p>L'objet et l'écran sont fixes, à la distance D l'un de l'autre. Si D > 4f′, il existe <b>deux positions</b> de la lentille donnant une image nette, séparées de d. On montre que :</p>
      <div class="formula">f′ = (D² − d²) / (4 D)</div>
      <p>Cette méthode n'exige pas de repérer précisément le centre de la lentille : seule la différence d de deux positions intervient.</p>`,
    protocole: `<h4>Partie A — Autocollimation</h4><ol>
        <li>Objet à la graduation 5 cm. Place la lentille puis le miroir plan accolé derrière elle (méthode « Autocollimation »).</li>
        <li>Déplace l'ensemble lentille + miroir jusqu'à ce que l'image renvoyée dans le plan de l'objet soit parfaitement nette.</li>
        <li>Enregistre : f′ = distance objet–lentille. Recommence 3 fois en partant alternativement de trop près et de trop loin.</li></ol>
      <h4>Partie B — Plans conjugués</h4><ol>
        <li>Retire le miroir et place l'écran (méthode « Plans conjugués »). Lentille à 25 cm de l'objet.</li>
        <li>Déplace l'écran jusqu'à l'image la plus nette ; enregistre OA et OA′.</li>
        <li>Recommence pour au moins 6 positions de la lentille. Exploite le graphe 1/OA′ = f(1/OA).</li></ol>
      <h4>Partie C — Méthode de Bessel</h4><ol>
        <li>Fixe l'écran à une distance D de l'objet (D > 4f′, par exemple D = 80 cm) (méthode « Bessel »).</li>
        <li>Cherche la première position nette de la lentille (près de l'objet, image agrandie) : « Noter position 1 ».</li>
        <li>Cherche la seconde position nette (près de l'écran, image réduite) : « Noter position 2 ».</li>
        <li>Recommence pour D = 70, 90, 100 et 110 cm.</li></ol>`,
    precautions: `<ul><li>La netteté est appréciée à l'œil : fais la mise au point en venant alternativement des deux côtés et prends la moyenne.</li>
      <li>L'objet, la lentille et l'écran doivent être centrés sur l'axe optique (même hauteur).</li>
      <li>En plans conjugués, l'incertitude vient surtout de la position du centre optique ; la méthode de Bessel l'élimine.</li>
      <li>Pour Bessel : Δf′/f′ ≈ (2DΔD + 2dΔd)/(D² − d²) + ΔD/D.</li></ul>`,
    preparation: ["Construis l'image d'un objet situé à 2f′ devant une lentille convergente. Où est l'image ?", "Explique pourquoi, en autocollimation, l'image se forme dans le plan de l'objet quand celui-ci est au foyer.", "Démontre la formule de Bessel f′ = (D² − d²)/(4D) à partir de la relation de conjugaison.", "Pourquoi faut-il D > 4f′ pour la méthode de Bessel ?"],
    hint: "Les curseurs déplacent les éléments sur le banc. La vignette montre ce que l'on voit sur l'écran (ou dans le plan de l'objet).",
    controls: `<h3>Méthode</h3>${seg("lnm", [["A", "Autocollimation"], ["B", "Plans conjugués"], ["C", "Bessel"]], "A")}
      <div class="ctl"><label for="lnL">Position de la lentille <b id="lnLv"></b></label><input id="lnL" type="range" min="8" max="120" step="0.1" value="20"></div>
      <div class="ctl"><label for="lnLf">Réglage fin de la lentille <b>± 1 cm</b></label><input id="lnLf" type="range" min="-1" max="1" step="0.02" value="0"></div>
      <div class="ctl" id="lnEw"><label for="lnE">Position de l'écran <b id="lnEv"></b></label><input id="lnE" type="range" min="20" max="150" step="0.1" value="60"></div>
      <div class="ctl" id="lnDw"><label for="lnD">Distance objet–écran D <b id="lnDv"></b></label><input id="lnD" type="range" min="40" max="140" step="1" value="80"></div>
      <dl class="lcd"><dt>Objet</dt><dd>5,0 cm</dd><dt>Lentille</dt><dd id="lnLr"></dd><dt id="lnEl">Écran</dt><dd id="lnEr"></dd></dl>
      <div class="row" id="lnRecW"><button type="button" class="btn primary sm" id="lnRec">Enregistrer la mesure</button></div>
      <div class="row" id="lnBesW"><button type="button" class="btn primary sm" id="lnP1">Noter position 1</button><button type="button" class="btn primary sm" id="lnP2">Noter position 2</button></div>
      <button type="button" class="btn sm" id="lnNew">Changer de lentille</button>`,
    parts: [
      { key: "A", titre: "Autocollimation", cols: ["n°", "Objet (cm)", "Lentille (cm)", "f′ = OA (cm)"],
        cells: (r, k) => [k + 1, "5,0", fr(r.xl, 1), fr(r.xl - 5, 1)],
        fit: (R, rows) => rows.length ? `Moyenne des ${rows.length} mesures : f′ = ${fr(rows.reduce((s, r) => s + r.xl - 5, 0) / rows.length, 1)} cm` : "Fais au moins 3 mises au point." },
      { key: "B", titre: "Plans conjugués", cols: ["n°", "OA (cm)", "OA′ (cm)", "1/OA (δ)", "1/OA′ (δ)"],
        cells: (r, k) => [k + 1, fr(r.OA, 1), fr(r.OAp, 1), fr(100 / r.OA, 2), fr(100 / r.OAp, 2)],
        point: r => [100 / r.OA, 100 / r.OAp], axes: { xl: "1/OA (δ)", yl: "1/OA′ (δ)", ymin: 0 },
        fit: R => R ? `1/OA′ = ${fr(R.a, 3)} · (1/OA) + ${fr(R.b, 2)}  (r = ${fr(R.r, 4)})   ⟹   V = ${fr(R.b, 2)} δ  et  f′ = 1/V = ${fr(100 / R.b, 1)} cm   (pente attendue : 1)` : "Au moins 2 mesures sont nécessaires." },
      { key: "C", titre: "Méthode de Bessel", cols: ["n°", "D (cm)", "x₁ (cm)", "x₂ (cm)", "d (cm)", "f′ (cm)"],
        cells: (r, k) => { const d = Math.abs(r.x2 - r.x1); return [k + 1, fr(r.D, 0), fr(r.x1, 1), fr(r.x2, 1), fr(d, 1), fr((r.D * r.D - d * d) / (4 * r.D), 2)]; },
        point: r => [r.D, (r.D * r.D - (r.x2 - r.x1) ** 2) / (4 * r.D)], axes: { xl: "D (cm)", yl: "f′ (cm)", noFit: true, ymin: 0 },
        fit: (R, rows) => rows.length ? `Moyenne sur ${rows.length} valeurs de D : f′ = ${fr(rows.reduce((s, r) => s + (r.D * r.D - (r.x2 - r.x1) ** 2) / (4 * r.D), 0) / rows.length, 2)} cm` : "Note les deux positions nettes pour plusieurs distances D." }
    ],
    questions: ["Autocollimation : pourquoi l'image est-elle renversée et de même taille que l'objet ?", "Plans conjugués : la pente de la droite est-elle proche de 1 ? Donne V et f′.", "Bessel : pourquoi n'y a-t-il plus d'image nette quand D < 4f′ ? Donne f′.", "Compare les trois valeurs de f′. Quelle méthode est la plus rapide ? la plus précise ?", "Pour une des mesures de la partie B, calcule le grandissement γ = OA′/OA."],
    init(T) {
      let P = store.get("lent_par", null); const newL = () => { P = { f: [10, 12.5, 15, 20][Math.floor(Math.random() * 4)] * (1 + (Math.random() * 2 - 1) * 0.04) }; store.set("lent_par", P); }; if (!P) newL();
      const XO = 5, AP = 4, mirrorGap = 2; let mode = "A", xl = 20, xe = 60, D = 80, pend = null;
      const sharpThr = 0.03;
      // flou relatif (≈ diamètre de la tache / taille) et grandissement
      const state = () => {
        if (mode === "A") { const s = xl - XO, f = P.f, vinv = 1 / f - 1 / s, v = Math.abs(vinv) < 1e-9 ? Infinity : 1 / vinv;
          const p = isFinite(v) ? 2 * mirrorGap - v : -Infinity, pinv = isFinite(p) ? 1 / p : 0, qinv = 1 / f - pinv;
          if (qinv <= 0) return { blur: null }; const q = 1 / qinv, xi = xl - q; return { blur: AP * Math.abs(xi - XO) / q, g: 1, xi }; }
        const xs = mode === "C" ? XO + D : xe, xi = imageOf(XO, xl, P.f);
        if (!isFinite(xi) || xi <= xl) return { blur: null }; const v = xi - xl; let blur = AP * Math.abs(xs - xi) / v;
        if (mode === "C") {   // Bessel : la netteté se juge sur la position de la lentille (profondeur de champ réaliste, ±0,25 cm),
          const dis = D * D - 4 * D * P.f;   // sinon la position agrandie (près de l'objet) serait presque impossible à trouver
          if (dis > 0) { const p = xl - XO, r = Math.sqrt(dis), dmin = Math.min(Math.abs(p - (D - r) / 2), Math.abs(p - (D + r) / 2)); blur = Math.min(blur, sharpThr * dmin / 0.25); }
        }
        return { blur, g: -v / (xl - XO), xi, xs };
      };
      const ui = () => {
        const fine = +$("#lnLf").value; xl = +$("#lnL").value + fine; xe = Math.max(+$("#lnE").value, xl + 1); D = +$("#lnD").value;
        $("#lnLv").textContent = fr(+$("#lnL").value, 1) + " cm"; $("#lnEv").textContent = fr(xe, 1) + " cm"; $("#lnDv").textContent = D + " cm";
        $("#lnLr").textContent = fr(xl, 1) + " cm"; $("#lnEl").textContent = mode === "A" ? "Miroir" : "Écran"; $("#lnEr").textContent = mode === "A" ? fr(xl + mirrorGap, 1) + " cm" : fr(mode === "C" ? XO + D : xe, 1) + " cm";
        $("#lnEw").hidden = mode !== "B"; $("#lnDw").hidden = mode !== "C"; $("#lnRecW").hidden = mode === "C"; $("#lnBesW").hidden = mode !== "C";
        T.draw();
      };
      document.querySelectorAll("[data-lnm]").forEach(b => b.onclick = () => { mode = b.dataset.lnm; setSeg("lnm", mode); pend = null; if (mode === "B") { $("#lnL").value = 30; $("#lnLf").value = 0; } ui(); T.msg(""); });
      ["#lnL", "#lnLf", "#lnE", "#lnD"].forEach(s => $(s).addEventListener("input", () => { if (s === "#lnD") pend = null; ui(); }));
      const sharp = () => { const s = state(); return s.blur != null && s.blur < sharpThr; };
      $("#lnRec").onclick = () => {
        if (!sharp()) { T.msg("L'image n'est pas nette : ajuste la mise au point avant d'enregistrer.", "bad"); return; }
        if (mode === "A") T.add("A", { xl: Math.round((xl + gauss() * 0.05) * 10) / 10 });
        else { const OA = -(xl - XO), OAp = xe - xl; T.add("B", { OA: Math.round(OA * 10) / 10, OAp: Math.round(OAp * 10) / 10 }); }
        T.msg("Mesure enregistrée.", "ok");
      };
      $("#lnP1").onclick = () => { if (!sharp()) { T.msg("L'image n'est pas nette : cherche la position donnant une image nette.", "bad"); return; } pend = { D, x1: Math.round(xl * 10) / 10 }; T.msg(`Position 1 notée : ${fr(pend.x1, 1)} cm. Cherche maintenant la seconde position nette.`, "ok"); };
      $("#lnP2").onclick = () => { if (!pend) { T.msg("Note d'abord la position 1.", "bad"); return; } if (!sharp()) { T.msg("L'image n'est pas nette.", "bad"); return; } const x2 = Math.round(xl * 10) / 10; if (Math.abs(x2 - pend.x1) < 1) { T.msg("C'est la même position : cherche l'autre position nette, plus loin de l'objet.", "bad"); return; } T.add("C", { D: pend.D, x1: Math.min(pend.x1, x2), x2: Math.max(pend.x1, x2) }); pend = null; T.msg("Couple de positions enregistré.", "ok"); };
      $("#lnNew").onclick = () => { if (T.locked()) { T.msg("Compte rendu déjà soumis : le matériel ne peut plus être changé.", "bad"); return; } newL(); T.clearRows(); ui(); T.msg("Nouvelle lentille : refais les mesures."); };
      T.draw = () => {
        const s = state(), { c, w, h } = fit($("#lentilles-cv"), innerWidth < 600 ? 1.0 : 0.6); c.fillStyle = css("--plot-bg"); c.fillRect(0, 0, w, h);
        const fg = css("--fg"), mu = css("--muted"), by = h * 0.36, X = x => 16 + x / 150 * (w - 32);
        bench(c, w, by, X, mu); objectF(c, X(XO), by); lens(c, X(xl), by, css("--accent"), "lentille");
        if (mode === "A") { const mx = X(xl + mirrorGap); c.fillStyle = "#9aa6b5"; c.fillRect(mx, by - 40, 5, 68); for (let k = -40; k < 28; k += 6) { c.strokeStyle = mu; c.beginPath(); c.moveTo(mx + 5, by + k); c.lineTo(mx + 10, by + k - 5); c.stroke(); } txt(c, "miroir", mx + 4, by + 40, mu, "center"); }
        else { const sx = X(mode === "C" ? XO + D : xe); c.fillStyle = fg; c.fillRect(sx - 3, by - 46, 6, 74); txt(c, "écran", sx, by - 52, fg, "center");
          if (mode === "C") { c.strokeStyle = mu; c.beginPath(); c.moveTo(X(XO), by + 82); c.lineTo(sx, by + 82); c.stroke(); txt(c, "D = " + D + " cm", (X(XO) + sx) / 2, by + 96, mu, "center"); if (pend) { c.fillStyle = css("--saff"); c.beginPath(); c.arc(X(pend.x1), by + 30, 4, 0, 7); c.fill(); txt(c, "pos. 1", X(pend.x1), by + 22, css("--saff"), "center"); } } }
        // rayons (objet de hauteur 2 cm, échelle 12 px/cm)
        if (mode !== "A" && s.blur != null) { const k = 12, yA = by - 2 * k, ix = X(s.xi), iy = by - s.g * 2 * k, end = Math.min(X(150), Math.max(X(s.xs), ix) + 10);
          c.strokeStyle = css("--saff"); c.globalAlpha = .5; c.lineWidth = 1.2; c.beginPath(); c.moveTo(X(XO), yA); c.lineTo(X(xl), yA); c.lineTo(end, yA + (iy - yA) * (end - X(xl)) / ((ix - X(xl)) || 1)); c.stroke();
          c.beginPath(); c.moveTo(X(XO), yA); c.lineTo(end, yA + (by - yA) * (end - X(XO)) / ((X(xl) - X(XO)) || 1)); c.stroke(); c.globalAlpha = 1; }
        // vignette
        const vw = Math.min(170, w * 0.36), vh = h * 0.3, vx = w - vw - 12, vy = h - vh - 12;
        if (mode === "A") viewF(c, vx, vy, vw, vh, "plan de l'objet (à côté de F)", s.blur, 1, true, s.blur != null && s.blur < sharpThr ? "image nette, renversée" : "image floue");
        else viewF(c, vx, vy, vw, vh, "ce que l'on voit sur l'écran", s.blur, Math.abs(s.g || 0), true, s.blur == null ? "pas d'image" : s.blur < sharpThr ? "image nette (renversée)" : "image floue");
      };
      ui();
    }
  });

  /* ========================= TP 8 : MICROSCOPE ========================= */
  register({
    id: "microscope", num: 8, disc: "Optique", court: "Microscope",
    titre: "Le microscope optique (maquette sur banc)",
    objectifs: "comprendre le fonctionnement du microscope à deux lentilles, déterminer la focale de l'objectif par l'étude de l'image intermédiaire, régler l'oculaire pour une observation à l'infini et mesurer la puissance et le grossissement commercial de l'instrument.",
    materiel: ["Banc d'optique", "Objet : micromètre (règle graduée, AB = 2 mm)", "Objectif : lentille convergente de courte focale f₁", "Oculaire : lentille convergente f₂", "Écran dépoli gradué", "Viseur à réticule (mesure d'angle)"],
    theorie: `<p>Un microscope comporte un <b>objectif</b> L₁ (courte focale f₁) qui donne d'un petit objet AB une image intermédiaire A₁B₁ réelle et agrandie, et un <b>oculaire</b> L₂ (focale f₂) qui joue le rôle de loupe pour observer A₁B₁.</p>
      <h4>Objectif</h4><div class="formula">γ₁ = A₁B₁/AB = O₁A₁/O₁A = 1 − O₁A₁/f₁    ⟹    |γ₁| = O₁A₁/f₁ − 1</div>
      <p>Le graphe |γ₁| = f(O₁A₁) est une droite de pente 1/f₁ ; elle coupe l'axe des abscisses en O₁A₁ = f₁.</p>
      <h4>Oculaire et observation à l'infini</h4><p>Pour que l'œil observe sans fatigue (au repos), l'image finale doit être à l'infini : A₁B₁ doit être dans le <b>plan focal objet de l'oculaire</b> (O₂A₁ = f₂). L'image finale est alors vue sous l'angle :</p>
      <div class="formula">α′ = A₁B₁ / f₂ = |γ₁| · AB / f₂</div>
      <h4>Puissance et grossissement commercial</h4><div class="formula">P = α′/AB = |γ₁| / f₂   (en dioptries δ, f₂ en m)        G_c = P / 4   (distance de vision d = 0,25 m)</div>
      <p>Le graphe P = f(|γ₁|) est une droite passant par l'origine, de pente 1/f₂.</p>`,
    protocole: `<h4>Partie A — Image intermédiaire et focale de l'objectif</h4><ol>
        <li>L'objectif est fixé à la graduation 30 cm. Place l'objet (micromètre) à quelques centimètres devant lui (mode « Objectif seul »).</li>
        <li>Déplace l'écran dépoli jusqu'à obtenir une image nette de la graduation. Mesure sa taille A₁B₁ sur l'écran gradué ; l'objet mesure AB = 2 mm.</li>
        <li>Enregistre O₁A₁ et |γ₁| = A₁B₁/AB (Partie A). Recommence pour 6 positions de l'objet.</li>
        <li>Exploite le graphe |γ₁| = f(O₁A₁) : pente 1/f₁.</li></ol>
      <h4>Partie B — Microscope complet, observation à l'infini</h4><ol>
        <li>Place l'objet de façon à obtenir un grandissement |γ₁| voisin de 3 (mode « Microscope complet »). L'écran est retiré : A₁B₁ est une image aérienne.</li>
        <li>Déplace l'oculaire jusqu'à voir dans l'oculaire une image nette <b>sans accommoder</b> (image à l'infini) : la vignette l'indique.</li>
        <li>Mesure au viseur l'angle α′ sous lequel est vue l'image (bouton « Enregistrer »), puis calcule P = α′/AB et G_c = P/4.</li>
        <li>Recommence pour 5 positions de l'objet (|γ₁| de 2 à 8), en réglant chaque fois l'oculaire. Exploite le graphe P = f(|γ₁|).</li></ol>`,
    precautions: `<ul><li>L'objet doit être placé un peu au-delà du foyer objet de l'objectif : trop près, il n'y a plus d'image réelle.</li>
      <li>Le réglage « à l'infini » est délicat : l'œil accommode facilement sur une image proche. Le critère est une image nette avec l'œil au repos.</li>
      <li>La mesure de A₁B₁ sur l'écran se fait à ±0,2 mm près ; préfère les grands grandissements pour la précision relative.</li></ul>`,
    preparation: ["Fais le schéma de principe du microscope avec la construction de A₁B₁ et de l'image finale.", "Démontre la relation |γ₁| = O₁A₁/f₁ − 1.", "Pourquoi place-t-on A₁B₁ au foyer objet de l'oculaire ?", "Pour f₁ = 5 cm, O₁A₁ = 20 cm et f₂ = 10 cm, calcule γ₁, P et G_c."],
    hint: "Mode « Objectif seul » : cherche l'image sur l'écran. Mode « Microscope complet » : règle l'oculaire pour voir une image nette à l'infini.",
    controls: `<h3>Mode</h3>${seg("mcm", [["A", "Objectif seul"], ["B", "Microscope complet"]], "A")}
      <div class="ctl"><label for="mcO">Position de l'objet <b id="mcOv"></b></label><input id="mcO" type="range" min="15" max="25" step="0.05" value="22"></div>
      <div class="ctl" id="mcEw"><label for="mcE">Position de l'écran <b id="mcEv"></b></label><input id="mcE" type="range" min="36" max="110" step="0.1" value="50"></div>
      <div class="ctl" id="mcKw"><label for="mcK">Position de l'oculaire <b id="mcKv"></b></label><input id="mcK" type="range" min="40" max="140" step="0.1" value="70"></div>
      <dl class="lcd"><dt>Objectif L₁</dt><dd>30,0 cm</dd><dt>A₁B₁ lue sur l'écran</dt><dd id="mcAB"></dd><dt>Image finale</dt><dd id="mcFin"></dd></dl>
      <button type="button" class="btn primary sm" id="mcRec">Enregistrer la mesure</button>
      <button type="button" class="btn sm" id="mcNew">Changer de lentilles</button>`,
    parts: [
      { key: "A", titre: "Image intermédiaire — focale de l'objectif", cols: ["n°", "O₁A (cm)", "O₁A₁ (cm)", "A₁B₁ (mm)", "|γ₁|"],
        cells: (r, k) => [k + 1, fr(-r.s, 2), fr(r.v, 1), fr(r.ab1, 1), fr(r.ab1 / 2, 2)],
        point: r => [r.v, r.ab1 / 2], axes: { xl: "O₁A₁ (cm)", yl: "|γ₁|", xmin: 0, ymin: 0 },
        fit: R => R ? `|γ₁| = ${fr(R.a, 4)} · O₁A₁ ${R.b < 0 ? "−" : "+"} ${fr(Math.abs(R.b), 3)}  (r = ${fr(R.r, 4)})   ⟹   f₁ = 1/pente = ${fr(1 / R.a, 2)} cm   (ordonnée à l'origine attendue : −1)` : "Au moins 2 mesures sont nécessaires." },
      { key: "B", titre: "Microscope complet — puissance et grossissement", cols: ["n°", "|γ₁|", "α′ (mrad)", "P = α′/AB (δ)", "G_c = P/4"],
        cells: (r, k) => [k + 1, fr(r.g1, 2), fr(r.a * 1000, 1), fr(r.a / 0.002, 1), fr(r.a / 0.002 / 4, 1)],
        point: r => [r.g1, r.a / 0.002], axes: { xl: "|γ₁|", yl: "P (δ)", xmin: 0, ymin: 0 },
        fit: R => R ? `P = ${fr(R.a, 2)} · |γ₁| ${R.b < 0 ? "−" : "+"} ${fr(Math.abs(R.b), 2)}  (r = ${fr(R.r, 4)})   ⟹   f₂ = 1/pente = ${fr(100 / R.a, 1)} cm` : "Au moins 2 mesures sont nécessaires." }
    ],
    questions: ["Partie A : donne f₁. Pourquoi l'objectif doit-il avoir une courte focale ?", "Où se forme l'image intermédiaire A₁B₁ par rapport à l'oculaire quand l'image finale est à l'infini ?", "Partie B : donne f₂ et compare P mesurée à |γ₁|/f₂.", "Calcule le grossissement commercial pour |γ₁| = 5. Comment augmenter le grossissement d'un microscope ?", "Pourquoi observe-t-on de préférence avec l'image finale à l'infini ?"],
    init(T) {
      let P = store.get("micro_par", null); const newL = () => { P = { f1: 4.5 + Math.random() * 1.5, f2: 8 + Math.random() * 4 }; store.set("micro_par", P); }; if (!P) newL();
      const X1 = 30, AB = 2; let mode = "A", xo = 22, xe = 50, xk = 70;
      const st = () => { const s = X1 - xo, inv = 1 / P.f1 - 1 / s; if (inv <= 0) return { real: false }; const v = 1 / inv, g1 = v / s; return { real: true, s, v, g1, x1: X1 + v }; };
      const ui = () => {
        xo = +$("#mcO").value; xe = +$("#mcE").value; xk = +$("#mcK").value; const s = st();
        $("#mcOv").textContent = fr(xo, 2) + " cm"; $("#mcEv").textContent = fr(xe, 1) + " cm"; $("#mcKv").textContent = fr(xk, 1) + " cm";
        $("#mcEw").hidden = mode !== "A"; $("#mcKw").hidden = mode !== "B";
        if (mode === "A") { const sh = s.real && Math.abs(xe - s.x1) / s.v < 0.012; $("#mcAB").textContent = s.real ? (sh ? fr(Math.round(AB * s.g1 * 5 + gauss()) / 5, 1) + " mm" : "image floue") : "pas d'image réelle"; $("#mcFin").textContent = "—"; }
        else { $("#mcAB").textContent = "—"; const e = s.real ? (xk - s.x1) - P.f2 : null; $("#mcFin").textContent = !s.real ? "pas d'image" : Math.abs(e) < 0.15 ? "à l'infini" : (e < 0 && e > -2) ? "proche (l'œil accommode)" : "floue"; }
        T.draw();
      };
      document.querySelectorAll("[data-mcm]").forEach(b => b.onclick = () => { mode = b.dataset.mcm; setSeg("mcm", mode); ui(); T.msg(""); });
      ["#mcO", "#mcE", "#mcK"].forEach(s => $(s).addEventListener("input", ui));
      $("#mcRec").onclick = () => {
        const s = st(); if (!s.real) { T.msg("Pas d'image réelle : éloigne l'objet de l'objectif.", "bad"); return; }
        if (mode === "A") { if (Math.abs(xe - s.x1) / s.v >= 0.012) { T.msg("L'image n'est pas nette sur l'écran.", "bad"); return; }
          T.add("A", { s: s.s, v: Math.round((xe - X1) * 10) / 10, ab1: Math.round((AB * s.g1 * (1 + gauss() * 0.015)) * 10) / 10 }); T.msg("Mesure enregistrée (partie A).", "ok"); }
        else { const e = (xk - s.x1) - P.f2; if (Math.abs(e) >= 0.15) { T.msg("L'image finale n'est pas à l'infini : règle l'oculaire.", "bad"); return; }
          const a = AB / 1000 * s.g1 / (P.f2 / 100) * (1 + gauss() * 0.02); T.add("B", { g1: Math.round(s.g1 * (1 + gauss() * 0.015) * 100) / 100, a }); T.msg("Mesure enregistrée (partie B).", "ok"); }
      };
      $("#mcNew").onclick = () => { if (T.locked()) { T.msg("Compte rendu déjà soumis : le matériel ne peut plus être changé.", "bad"); return; } newL(); T.clearRows(); ui(); T.msg("Nouvelles lentilles : refais les mesures."); };
      T.draw = () => {
        const s = st(), { c, w, h } = fit($("#microscope-cv"), innerWidth < 600 ? 1.0 : 0.6); c.fillStyle = css("--plot-bg"); c.fillRect(0, 0, w, h);
        const fg = css("--fg"), mu = css("--muted"), by = h * 0.36, X = x => 16 + x / 150 * (w - 32);
        bench(c, w, by, X, mu);
        c.fillStyle = css("--saff"); c.fillRect(X(xo) - 3, by - 16, 6, 16); txt(c, "objet", X(xo), by + 24, mu, "center");
        lens(c, X(X1), by, css("--accent"), "objectif L₁");
        if (s.real) { const k = 3, yA = by - AB / 10 * 8 * k; c.strokeStyle = css("--saff"); c.globalAlpha = .45; c.lineWidth = 1.2;
          const ix = X(s.x1), iy = by + s.g1 * (by - yA); c.beginPath(); c.moveTo(X(xo), yA); c.lineTo(X(X1), yA); c.lineTo(ix, iy); c.stroke(); c.beginPath(); c.moveTo(X(xo), yA); c.lineTo(ix, iy); c.stroke(); c.globalAlpha = 1;
          if (mode === "B" || Math.abs(xe - s.x1) / s.v < 0.012) { c.strokeStyle = css("--saff"); c.setLineDash([3, 3]); c.beginPath(); c.moveTo(ix, by); c.lineTo(ix, iy); c.stroke(); c.setLineDash([]); txt(c, "A₁B₁", ix + 4, iy + 12, css("--saff")); } }
        if (mode === "A") { const sx = X(xe); c.fillStyle = "#cfd6de"; c.fillRect(sx - 3, by - 46, 6, 90); c.strokeStyle = fg; c.strokeRect(sx - 3, by - 46, 6, 90); txt(c, "écran dépoli", sx, by - 52, fg, "center"); }
        else { lens(c, X(xk), by, css("--rouge"), "oculaire L₂"); const ex = X(xk) + 26; c.fillStyle = fg; c.beginPath(); c.ellipse(ex, by, 9, 6, 0, 0, 7); c.fill(); txt(c, "œil", ex, by + 20, mu, "center"); }
        // vignette
        const vw = Math.min(170, w * 0.36), vh = h * 0.3, vx = w - vw - 12, vy = h - vh - 12;
        if (mode === "A") { const bl = s.real ? 4 * Math.abs(xe - s.x1) / s.v : null; viewF(c, vx, vy, vw, vh, "écran dépoli", bl, s.real ? Math.min(3, s.g1 * 0.35) : 0, true, !s.real ? "pas d'image réelle" : bl < 0.05 ? "image nette, |γ₁| = A₁B₁/AB" : "image floue"); }
        else { const e = s.real ? (xk - s.x1) - P.f2 : 99, bl = Math.abs(e) < 0.15 ? 0 : (e < 0 && e > -2) ? 0.15 : Math.min(1, Math.abs(e) * 0.5); viewF(c, vx, vy, vw, vh, "vue dans l'oculaire", s.real ? bl : null, s.real ? Math.min(3, s.g1 * 0.4) : 0, true, !s.real ? "pas d'image" : Math.abs(e) < 0.15 ? "nette, à l'infini (œil au repos)" : (e < 0 && e > -2) ? "nette si l'œil accommode" : "floue"); }
      };
      ui();
    }
  });

  /* ========================= TP 9 : ASSOCIATION DE LENTILLES ========================= */
  function lensDiv(c, x, by, col, label) {
    c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.moveTo(x, by - 40); c.lineTo(x, by + 28); c.stroke();
    c.lineWidth = 2.2; c.beginPath(); c.moveTo(x - 7, by - 48); c.lineTo(x, by - 40); c.lineTo(x + 7, by - 48); c.moveTo(x - 7, by + 36); c.lineTo(x, by + 28); c.lineTo(x + 7, by + 36); c.stroke();
    if (label) txt(c, label, x, by - 54, col, "center");
  }
  register({
    id: "assoc", num: 9, disc: "Optique", court: "Association de lentilles",
    titre: "Association de lentilles minces : lentilles accolées et lentilles séparées",
    objectifs: "mesurer la vergence d'une lentille convergente, en déduire celle d'une lentille divergente par accolement (V = V₁ + V₂), puis étudier un système de deux lentilles séparées et vérifier la relation de conjugaison appliquée lentille après lentille (formule de Gullstrand).",
    materiel: ["Banc d'optique gradué", "Objet lumineux (lettre F éclairée)", "Collimateur (objet à l'infini)", "Lentille convergente L₁ (f′₁ inconnue)", "Lentille divergente L₂ (f′₂ inconnue)", "Lentille convergente L₃ (f′₃ inconnue)", "Écran", "Supports"],
    theorie: `<p>Une lentille mince de vergence V = 1/f′ (en dioptries δ, f′ en mètres) conjugue un objet A et son image A′ :</p>
      <div class="formula">1/OA′ − 1/OA = V = 1/f′</div>
      <h4>1. Lentilles accolées</h4><p>Deux lentilles minces accolées (centres confondus) se comportent comme une seule lentille de vergence</p>
      <div class="formula">V = V₁ + V₂</div>
      <p>On en déduit la vergence d'une lentille <b>divergente</b> L₂, qui ne donne jamais d'image réelle d'un objet réel : on l'accole à une convergente L₁ plus puissante, on mesure V, puis V₂ = V − V₁.</p>
      <h4>2. Lentilles séparées</h4><p>Deux lentilles L₁ et L₃ distantes de e = O₁O₃. Pour un objet à l'infini, L₁ donne une image intermédiaire en F′₁ ; elle sert d'objet à L₃, avec O₃F′₁ = f′₁ − e. L'image finale A′ vérifie :</p>
      <div class="formula">1/O₃A′ = 1/f′₃ + 1/(f′₁ − e)        soit   1/x′ = V₃ + 1/(f′₁ − e)</div>
      <p>Le graphe 1/x′ = f(1/(f′₁ − e)) est une droite de pente 1 et d'ordonnée à l'origine V₃. La vergence du système est donnée par la formule de Gullstrand :</p>
      <div class="formula">V = V₁ + V₃ − e · V₁ · V₃</div>`,
    protocole: `<h4>Partie A — Lentille convergente L₁ seule</h4><ol>
        <li>Objet à la graduation 5 cm. Place L₁ à environ 30 cm de l'objet (méthode « L₁ seule »).</li>
        <li>Déplace l'écran jusqu'à l'image la plus nette ; enregistre OA et OA′.</li>
        <li>Recommence pour au moins 5 positions de L₁. Le graphe 1/OA′ = f(1/OA) donne V₁ (ordonnée à l'origine).</li></ol>
      <h4>Partie B — Lentilles accolées L₁ + L₂</h4><ol>
        <li>Accole la lentille divergente L₂ à L₁ (méthode « L₁ + L₂ accolées »).</li>
        <li>Même démarche : au moins 5 couples (OA, OA′). Le graphe donne la vergence V du doublet ; calcule V₂ = V − V₁ et f′₂.</li></ol>
      <h4>Partie C — Lentilles séparées L₁ et L₃</h4><ol>
        <li>Remplace l'objet par le collimateur (objet à l'infini). L₁ est fixée à la graduation 20 cm (méthode « L₁ et L₃ séparées »).</li>
        <li>Place L₃ à la distance e de L₁ (par exemple e = 2, 3, 4, 5 puis 6 cm).</li>
        <li>Pour chaque e, cherche l'image nette sur l'écran et enregistre e et x′ = O₃A′.</li>
        <li>Avec ton f′₁ (partie A), trace 1/x′ = f(1/(f′₁ − e)) : l'ordonnée à l'origine est V₃.</li></ol>`,
    precautions: `<ul><li>Fais chaque mise au point en venant alternativement des deux côtés et garde une position moyenne.</li>
      <li>Pour les lentilles accolées, les deux lentilles doivent être au contact : leur distance est négligée devant les focales.</li>
      <li>En partie C, garde e nettement inférieur à f′₁ : quand e se rapproche de f′₁, 1/(f′₁ − e) devient très sensible à l'erreur sur f′₁.</li>
      <li>ΔV₂ ≈ ΔV + ΔV₁ : l'incertitude sur une vergence obtenue par différence est la somme des incertitudes.</li></ul>`,
    preparation: ["Démontre que deux lentilles minces accolées sont équivalentes à une lentille de vergence V₁ + V₂.", "Pourquoi ne peut-on pas mesurer directement f′₂ par la méthode des plans conjugués ? À quelle condition le doublet L₁ + L₂ est-il convergent ?", "Pour un objet à l'infini, montre que O₃A′ = f′₃ (f′₁ − e) / (f′₁ + f′₃ − e).", "Calcule la vergence du système pour f′₁ = 12,5 cm, f′₃ = 20 cm et e = 4 cm avec la formule de Gullstrand."],
    hint: "Choisis la méthode, déplace les lentilles et l'écran ; la vignette montre l'image sur l'écran. Enregistre quand elle est nette.",
    controls: `<h3>Méthode</h3>${seg("asm", [["A", "L₁ seule"], ["B", "L₁ + L₂ accolées"], ["C", "L₁ et L₃ séparées"]], "A")}
      <div class="ctl" id="asLw"><label for="asL">Position de la lentille <b id="asLv"></b></label><input id="asL" type="range" min="12" max="80" step="0.1" value="35"></div>
      <div class="ctl" id="asEcw"><label for="asEc">Écart e entre L₁ et L₃ <b id="asEcv"></b></label><input id="asEc" type="range" min="1" max="20" step="0.1" value="3"></div>
      <div class="ctl"><label for="asE">Position de l'écran <b id="asEv"></b></label><input id="asE" type="range" min="20" max="150" step="0.1" value="80"></div>
      <div class="ctl"><label for="asEf">Réglage fin de l'écran <b>± 2 cm</b></label><input id="asEf" type="range" min="-2" max="2" step="0.02" value="0"></div>
      <dl class="lcd"><dt id="asOl">Objet</dt><dd id="asOr">5,0 cm</dd><dt>Lentille(s)</dt><dd id="asLr"></dd><dt>Écran</dt><dd id="asEr"></dd></dl>
      <div class="row"><button type="button" class="btn primary sm" id="asRec">Enregistrer la mesure</button></div>
      <button type="button" class="btn sm" id="asNew">Changer de lentilles</button>`,
    parts: [
      { key: "A", titre: "Lentille convergente L₁ seule", cols: ["n°", "OA (cm)", "OA′ (cm)", "1/OA (δ)", "1/OA′ (δ)"],
        cells: (r, k) => [k + 1, fr(r.OA, 1), fr(r.OAp, 1), fr(100 / r.OA, 2), fr(100 / r.OAp, 2)],
        point: r => [100 / r.OA, 100 / r.OAp], axes: { xl: "1/OA (δ)", yl: "1/OA′ (δ)", ymin: 0 },
        fit: R => R ? `1/OA′ = ${fr(R.a, 3)} · (1/OA) + ${fr(R.b, 2)}  (r = ${fr(R.r, 4)})   ⟹   V₁ = ${fr(R.b, 2)} δ  et  f′₁ = ${fr(100 / R.b, 1)} cm` : "Au moins 2 mesures sont nécessaires." },
      { key: "B", titre: "Lentilles accolées L₁ + L₂", cols: ["n°", "OA (cm)", "OA′ (cm)", "1/OA (δ)", "1/OA′ (δ)"],
        cells: (r, k) => [k + 1, fr(r.OA, 1), fr(r.OAp, 1), fr(100 / r.OA, 2), fr(100 / r.OAp, 2)],
        point: r => [100 / r.OA, 100 / r.OAp], axes: { xl: "1/OA (δ)", yl: "1/OA′ (δ)", ymin: 0 },
        fit: R => R ? `1/OA′ = ${fr(R.a, 3)} · (1/OA) + ${fr(R.b, 2)}  (r = ${fr(R.r, 4)})   ⟹   V (doublet) = ${fr(R.b, 2)} δ` : "Au moins 2 mesures sont nécessaires." },
      { key: "C", titre: "Lentilles séparées L₁ et L₃ (objet à l'infini)", cols: ["n°", "e (cm)", "x′ = O₃A′ (cm)", "1/x′ (δ)"],
        cells: (r, k) => [k + 1, fr(r.e, 1), fr(r.xp, 1), fr(100 / r.xp, 2)],
        point: r => [r.e, r.xp], axes: { xl: "e (cm)", yl: "x′ (cm)", xmin: 0, ymin: 0, noFit: true },
        fit: (R, rows) => rows.length ? "Plus L₃ s'éloigne de L₁ (e augmente), plus l'image se rapproche de L₃. Trace 1/x′ = f(1/(f′₁ − e)) dans le compte rendu : l'ordonnée à l'origine est V₃." : "Enregistre x′ pour plusieurs écarts e." }
    ],
    questions: ["Partie A : donne V₁ et f′₁. La pente de la droite est-elle proche de 1 ?", "Partie B : donne la vergence V du doublet, puis V₂ = V − V₁ et f′₂. Le doublet est-il convergent ? Pourquoi ?", "Partie C : donne V₃ et f′₃ à partir du graphe 1/x′ = f(1/(f′₁ − e)).", "Pour l'un de tes écarts e, calcule la vergence du système L₁ + L₃ par la formule de Gullstrand.", "Cite deux sources d'erreur et compare la précision sur V₂ (obtenue par différence) à celle sur V₁."],
    init(T) {
      let P = store.get("assoc_par", null);
      const newA = () => { const pk = a => a[Math.floor(Math.random() * a.length)], tl = () => 1 + (Math.random() * 2 - 1) * 0.04; P = { f1: pk([10, 12.5, 15]) * tl(), f2: -pk([40, 50, 60]) * tl(), f3: pk([15, 20, 25]) * tl() }; store.set("assoc_par", P); };
      if (!P || !P.f1) newA();
      const XO = 5, XL1C = 20, AP = 4, sharpThr = 0.03; let mode = "A", xl = 35, e = 3, xe = 80;
      const fd = () => 1 / (1 / P.f1 + 1 / P.f2);
      const last = () => mode === "C" ? XL1C + e : xl;
      const state = () => {
        let xi;
        if (mode === "C") { if (e >= P.f1 - 0.05) return { blur: null }; xi = imageOf(XL1C + P.f1, XL1C + e, P.f3); }
        else xi = imageOf(XO, xl, mode === "A" ? P.f1 : fd());
        const xL = last(); if (!isFinite(xi) || xi <= xL + 0.2) return { blur: null };
        const v = xi - xL; return { blur: AP * Math.abs(xe - xi) / v, xi, g: mode === "C" ? 1 : -v / (xl - XO) };
      };
      const ui = () => {
        xl = +$("#asL").value; e = +$("#asEc").value; xe = Math.max(+$("#asE").value + +$("#asEf").value, last() + 1);
        $("#asLv").textContent = fr(xl, 1) + " cm"; $("#asEcv").textContent = fr(e, 1) + " cm"; $("#asEv").textContent = fr(+$("#asE").value, 1) + " cm";
        $("#asLw").hidden = mode === "C"; $("#asEcw").hidden = mode !== "C";
        $("#asOl").textContent = mode === "C" ? "Objet" : "Objet"; $("#asOr").textContent = mode === "C" ? "à l'infini (collimateur)" : "5,0 cm";
        $("#asLr").textContent = mode === "C" ? "L₁ " + fr(XL1C, 1) + " cm · L₃ " + fr(XL1C + e, 1) + " cm" : fr(xl, 1) + " cm"; $("#asEr").textContent = fr(xe, 1) + " cm";
        T.draw();
      };
      document.querySelectorAll("[data-asm]").forEach(b => b.onclick = () => { mode = b.dataset.asm; setSeg("asm", mode); ui(); T.msg(""); });
      ["#asL", "#asEc", "#asE", "#asEf"].forEach(s => $(s).addEventListener("input", ui));
      $("#asRec").onclick = () => {
        const s = state();
        if (s.blur == null) { T.msg(mode === "C" ? "Pas d'image réelle : diminue l'écart e entre L₁ et L₃." : "Pas d'image réelle sur l'écran : éloigne la lentille de l'objet.", "bad"); return; }
        if (s.blur >= sharpThr) { T.msg("L'image n'est pas nette : ajuste la position de l'écran avant d'enregistrer.", "bad"); return; }
        if (mode === "C") T.add("C", { e: Math.round(e * 10) / 10, xp: Math.round((xe - (XL1C + e)) * 10) / 10 });
        else T.add(mode, { OA: Math.round(-(xl - XO) * 10) / 10, OAp: Math.round((xe - xl) * 10) / 10 });
        T.msg("Mesure enregistrée (partie " + mode + ").", "ok");
      };
      $("#asNew").onclick = () => { if (T.locked()) { T.msg("Compte rendu déjà soumis : le matériel ne peut plus être changé.", "bad"); return; } newA(); T.clearRows(); ui(); T.msg("Nouvelles lentilles : refais les mesures."); };
      T.draw = () => {
        const s = state(), { c, w, h } = fit($("#assoc-cv"), innerWidth < 600 ? 1.0 : 0.6); c.fillStyle = css("--plot-bg"); c.fillRect(0, 0, w, h);
        const fg = css("--fg"), mu = css("--muted"), ac = css("--accent"), by = h * 0.36, X = x => 16 + x / 150 * (w - 32);
        bench(c, w, by, X, mu);
        if (mode === "C") {
          c.fillStyle = "#8a8f98"; c.fillRect(X(0), by - 22, X(9) - X(0), 44); txt(c, w < 520 ? "← collimateur (objet à l'infini)" : "collimateur", w < 520 ? X(0) : X(4.5), w < 520 ? by + 74 : by - 30, mu, w < 520 ? "left" : "center");
          c.strokeStyle = css("--saff"); c.globalAlpha = .55; c.lineWidth = 1.2;
          [-12, 12].forEach(dy => { c.beginPath(); c.moveTo(X(9), by + dy); c.lineTo(X(XL1C), by + dy); c.stroke(); });
          if (s.blur != null) { const x1 = X(XL1C), x3 = X(XL1C + e), xi = X(s.xi), end = Math.min(X(150), Math.max(xi, X(xe)) + 10), yAt3 = dy => dy * (1 - e / P.f1);
            [-12, 12].forEach(dy => { c.beginPath(); c.moveTo(x1, by + dy); c.lineTo(x3, by + yAt3(dy)); const sl = (by - (by + yAt3(dy))) / ((xi - x3) || 1); c.lineTo(end, by + yAt3(dy) + sl * (end - x3)); c.stroke(); }); }
          c.globalAlpha = 1;
          const x1 = X(XL1C), x3 = X(XL1C + e), tight = x3 - x1 < 30; lens(c, x1, by, ac, ""); lens(c, x3, by, css("--ok"), "");
          txt(c, "L₁", tight ? x1 - 5 : x1, by - 48, ac, tight ? "right" : "center"); txt(c, "L₃", tight ? x3 + 5 : x3, by - 48, css("--ok"), tight ? "left" : "center");
        } else {
          objectF(c, X(XO), by);
          if (mode === "A") lens(c, X(xl), by, ac, "L₁"); else { lens(c, X(xl) - 4, by, ac, ""); lensDiv(c, X(xl) + 4, by, css("--rouge"), ""); txt(c, "L₁ + L₂", X(xl), by - 54, fg, "center"); }
          if (s.blur != null) { const k = 12, yA = by - 2 * k, ix = X(s.xi), iy = by - s.g * 2 * k, end = Math.min(X(150), Math.max(X(xe), ix) + 10);
            c.strokeStyle = css("--saff"); c.globalAlpha = .5; c.lineWidth = 1.2; c.beginPath(); c.moveTo(X(XO), yA); c.lineTo(X(xl), yA); c.lineTo(end, yA + (iy - yA) * (end - X(xl)) / ((ix - X(xl)) || 1)); c.stroke();
            c.beginPath(); c.moveTo(X(XO), yA); c.lineTo(end, yA + (by - yA) * (end - X(XO)) / ((X(xl) - X(XO)) || 1)); c.stroke(); c.globalAlpha = 1; }
        }
        const sx = X(xe); c.fillStyle = fg; c.fillRect(sx - 3, by - 46, 6, 74); txt(c, "écran", sx, sx - X(last()) < 44 ? by - 66 : by - 52, fg, "center");
        const vw = Math.min(170, w * 0.36), vh = h * 0.3, vx = w - vw - 12, vy = h - vh - 12;
        viewF(c, vx, vy, vw, vh, "ce que l'on voit sur l'écran", s.blur, mode === "C" ? 0.6 : Math.abs(s.g || 0), true, s.blur == null ? "pas d'image" : s.blur < sharpThr ? "image nette" : "image floue");
      };
      ui();
    }
  });
})();
