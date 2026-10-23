/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* TP de mécanique : n°1 pendule simple, n°2 oscillateur harmonique, n°3 pendule de torsion */
(function () {
  "use strict";
  const { register, $, css, fr, gauss, store, fit, txt, chrono } = window.TPCORE;
  const G = 9.78;           // valeur de g utilisée par la simulation (Sénégal)
  const PI2 = 4 * Math.PI * Math.PI;
  const partSelect = (id, parts) => `<div class="ctl"><label for="${id}-part">Enregistrer dans</label><select id="${id}-part">${parts.map(p => `<option value="${p[0]}">${p[1]}</option>`).join("")}</select></div>`;
  const support = (c, x, y, w) => { c.fillStyle = css("--muted"); c.fillRect(x - w / 2, y - 8, w, 8); c.strokeStyle = css("--muted"); c.lineWidth = 1; for (let i = -w / 2; i < w / 2; i += 8) { c.beginPath(); c.moveTo(x + i, y - 8); c.lineTo(x + i - 6, y - 16); c.stroke(); } };
  const lcdBox = (c, x, y, s) => { c.fillStyle = "#1d2a1f"; c.fillRect(x - 70, y - 24, 140, 48); txt(c, s, x, y, "#9cf29c", "center", "middle", "600 22px 'Fira Mono',monospace"); };

  /* ========================= TP 1 : PENDULE SIMPLE ========================= */
  register({
    id: "pendule", num: 1, disc: "Mécanique", court: "Pendule simple",
    titre: "Étude d'un pendule simple",
    objectifs: "vérifier l'isochronisme des petites oscillations, montrer que la période ne dépend pas de la masse, établir la loi T = 2π√(L/g) et en déduire l'intensité de la pesanteur g.",
    materiel: ["Potence et pince", "Fil inextensible de longueur réglable", "Masses marquées (50, 100, 200 g)", "Rapporteur", "Règle graduée", "Chronomètre ou capteur à fourche optique"],
    theorie: `<p>Un pendule simple est une masse ponctuelle m suspendue à un fil inextensible de longueur L et de masse négligeable. On repère sa position par l'angle θ entre le fil et la verticale.</p>
      <h4>Équation du mouvement</h4><p>Le théorème du moment cinétique (ou le PFD projeté sur la base de Frenet) donne :</p>
      <div class="formula">m L θ̈ = − m g sin θ    ⟹    θ̈ + (g/L) sin θ = 0</div>
      <p>La masse se simplifie : <b>le mouvement ne dépend pas de m</b>.</p>
      <h4>Petites oscillations</h4><p>Si θ reste petit (θ ≲ 15°, soit 0,26 rad), sin θ ≈ θ et l'équation devient celle d'un oscillateur harmonique :</p>
      <div class="formula">θ̈ + ω₀² θ = 0   avec   ω₀ = √(g/L)    ⟹    T₀ = 2π √(L/g)</div>
      <p>La période ne dépend alors ni de la masse, ni de l'amplitude θ₀ : c'est l'<b>isochronisme des petites oscillations</b>. Pour une amplitude plus grande, la période augmente légèrement (formule de Borda) :</p>
      <div class="formula">T ≈ T₀ (1 + θ₀²/16)    (θ₀ en radians)</div>
      <h4>Linéarisation (Partie A)</h4><p>La courbe T = f(θ₀) n'est pas une droite. En développant la formule de Borda :</p>
      <div class="formula">T ≈ T₀ + (T₀/16) · θ₀²</div>
      <p>Le graphe <b>T = f(θ₀²)</b>, avec θ₀ en <b>radians</b>, est donc une <b>droite</b> :</p>
      <ul><li>son <b>ordonnée à l'origine</b> est T₀, la période des petites oscillations (valeur extrapolée pour θ₀ → 0) ;</li>
      <li>sa <b>pente</b> vaut T₀/16 : le rapport pente / T₀ doit être proche de 1/16 = 0,0625.</li></ul>
      <p>On ne peut pas mesurer directement T pour θ₀ = 0 (le pendule ne bouge pas) : T₀ s'obtient par <b>extrapolation</b> de la droite.</p>
      <h4>Exploitation (Partie C)</h4><div class="formula">T² = (4π²/g) · L</div><p>Le graphe T² = f(L) est une droite passant par l'origine, de pente a = 4π²/g, d'où <b>g = 4π²/a</b>.</p>`,
    protocole: `<h4>Partie A — Isochronisme des petites oscillations</h4><ol>
        <li>Choisis une longueur L = 80 cm et la masse de 100 g.</li>
        <li>Écarte le pendule d'un angle θ₀ = 5° et lâche-le <b>sans vitesse initiale</b>.</li>
        <li>Chronomètre 10 oscillations complètes : démarre au passage par une position extrême et arrête au 10<sup>e</sup> retour à cette même position. Choisis « Partie A » puis enregistre.</li>
        <li>Recommence pour θ₀ = 10°, 15°, 20°, 30°, 40°, 50° et 60°.</li>
        <li>Utilise de préférence le <b>capteur automatique</b> : l'effet de l'amplitude est faible (moins de 2 % jusqu'à 30°) et l'erreur de réaction du chronométrage manuel peut le masquer.</li>
        <li>Le graphe <b>T = f(θ₀²)</b> (θ₀ en rad) se trace automatiquement : c'est une droite. Lis T₀ à l'ordonnée à l'origine et compare-le à la valeur théorique 2π√(L/g) affichée dans le panneau.</li></ol>
      <h4>Partie B — Influence de la masse</h4><ol>
        <li>Garde L = 80 cm et θ₀ = 10°.</li>
        <li>Mesure la période pour les masses 50 g, 100 g et 200 g (Partie B).</li></ol>
      <h4>Partie C — Influence de la longueur, mesure de g</h4><ol>
        <li>Fixe θ₀ = 10° (petites oscillations) et la masse de 100 g.</li>
        <li>Mesure la période pour au moins 7 longueurs entre 20 cm et 1,50 m (Partie C). La longueur se mesure du point de suspension au <b>centre</b> de la masse.</li>
        <li>Le graphe T² = f(L) et la droite de régression se tracent automatiquement : déduis g de la pente.</li></ol>`,
    precautions: `<ul><li>Lâche toujours la masse sans la lancer, dans un plan vertical (pas de mouvement conique).</li>
      <li>Chronométrer n = 10 périodes divise par 10 l'erreur due au temps de réaction (environ 0,1 à 0,2 s par déclenchement) : ΔT ≈ 2 × 0,15 / 10 = 0,03 s.</li>
      <li>Déclenche le chronomètre au passage par une position extrême ou, mieux, au passage par la verticale (vitesse maximale, repérage plus précis).</li>
      <li>Incertitude sur g : Δg/g = ΔL/L + 2 ΔT/T. La mesure de T est la plus critique.</li>
      <li>Le mode « capteur automatique » simule une fourche optique : il supprime l'erreur de réaction. Compare les deux modes.</li></ul>`,
    preparation: ["Établis l'équation différentielle du mouvement du pendule simple.", "Montre que, pour les petites oscillations, T₀ = 2π√(L/g).", "Calcule T₀ pour L = 1 m et g = 9,78 m/s².", "Pourquoi trace-t-on T² en fonction de L plutôt que T en fonction de L ?"],
    hint: "Le pendule oscille en temps réel. En mode manuel, c'est toi qui chronomètres, comme en salle de TP.",
    controls: `<h3>Pendule</h3>
      <div class="ctl"><label for="pdL">Longueur L <b id="pdLv"></b></label><input id="pdL" type="range" min="20" max="150" step="1" value="80"></div>
      <div class="ctl"><label for="pdA">Amplitude θ₀ <b id="pdAv"></b></label><input id="pdA" type="range" min="0" max="70" step="1" value="10"></div>
      <dl class="lcd"><dt id="pdT0l">T₀ théorique = 2π√(L/g)</dt><dd id="pdT0"></dd></dl>
      <div class="ctl"><label for="pdM">Masse</label><select id="pdM"><option value="50">50 g</option><option value="100" selected>100 g</option><option value="200">200 g</option></select></div>
      <div class="row"><button type="button" class="btn primary sm" id="pdGo">Lâcher le pendule</button><button type="button" class="btn sm" id="pdSt">Arrêter le pendule</button></div>
      __CHRONO__
      ${partSelect("pd", [["A", "Partie A — amplitude"], ["B", "Partie B — masse"], ["C", "Partie C — longueur"]])}
      <button type="button" class="btn primary sm" id="pdRec">Enregistrer la mesure</button>`,
    parts: [
      { key: "A", titre: "Isochronisme des petites oscillations", cols: ["n°", "L (cm)", "θ₀ (°)", "θ₀² (rad²)", "n", "t (s)", "T (s)"],
        cells: (r, i) => [i + 1, fr(r.L * 100, 0), r.A, fr((r.A * Math.PI / 180) ** 2, 4), r.n, fr(r.t, 2), fr(r.t / r.n, 3)],
        point: r => [(r.A * Math.PI / 180) ** 2, r.t / r.n], axes: { xl: "θ₀² (rad²)", yl: "T (s)", xmin: 0 },
        fit: (R, rows) => {
          if (rows.length < 2) return "Mesure la période pour plusieurs amplitudes à longueur fixée : le graphe T = f(θ₀²) est une droite.";
          const s = [...rows].sort((a, b) => a.A - b.A), t0 = s[0].t / s[0].n, t1 = s[s.length - 1].t / s[s.length - 1].n;
          const Ls = [...new Set(rows.map(r => Math.round(r.L * 100)))], T0th = 2 * Math.PI * Math.sqrt(rows[0].L / G);
          let out = `Entre θ₀ = ${s[0].A}° et θ₀ = ${s[s.length - 1].A}°, la période passe de ${fr(t0, 3)} s à ${fr(t1, 3)} s (variation de ${fr((t1 / t0 - 1) * 100, 1)} %).`;
          if (R) out += `<br>Droite : T = ${fr(R.a, 4)} · θ₀² + ${fr(R.b, 4)}  (r = ${fr(R.r, 4)})   ⟹   T₀ (ordonnée à l'origine) = ${fr(R.b, 3)} s ;  pente / T₀ = ${fr(R.a / R.b, 3)} (Borda : 1/16 = 0,0625).`;
          out += Ls.length > 1 ? `<br>Attention : toutes les mesures de la partie A doivent être faites avec la même longueur L (ici ${Ls.join(", ")} cm).` : `<br>T₀ théorique pour L = ${Ls[0]} cm : 2π√(L/g) = ${fr(T0th, 3)} s.`;
          return out;
        } },
      { key: "B", titre: "Influence de la masse", cols: ["n°", "m (g)", "L (cm)", "θ₀ (°)", "n", "t (s)", "T (s)"],
        cells: (r, i) => [i + 1, r.m, fr(r.L * 100, 0), r.A, r.n, fr(r.t, 2), fr(r.t / r.n, 3)],
        fit: (R, rows) => { if (!rows.length) return "Mesure la période pour les trois masses, à L et θ₀ fixés."; const T = rows.map(r => r.t / r.n), mx = Math.max(...T), mn = Math.min(...T); return `Périodes mesurées : de ${fr(mn, 3)} s à ${fr(mx, 3)} s, soit un écart de ${fr((mx - mn) / mn * 100, 1)} % entre les masses.`; } },
      { key: "C", titre: "Influence de la longueur — mesure de g", cols: ["n°", "L (m)", "θ₀ (°)", "n", "t (s)", "T (s)", "T² (s²)"],
        cells: (r, i) => [i + 1, fr(r.L, 3), r.A, r.n, fr(r.t, 2), fr(r.t / r.n, 3), fr((r.t / r.n) ** 2, 3)],
        point: r => [r.L, (r.t / r.n) ** 2], axes: { xl: "L (m)", yl: "T² (s²)", xmin: 0, ymin: 0 },
        fit: R => R ? `T² = ${fr(R.a, 3)} · L ${R.b < 0 ? "−" : "+"} ${fr(Math.abs(R.b), 3)}  (r = ${fr(R.r, 4)})   ⟹   g = 4π²/pente = ${fr(PI2 / R.a, 2)} m/s²` : "Au moins 2 mesures sont nécessaires pour la droite de régression." }
    ],
    questions: ["Partie A : le graphe T = f(θ₀²) est-il une droite ? Lis T₀ à l'ordonnée à l'origine et compare-le à 2π√(L/g). Le rapport pente / T₀ est-il proche de 1/16 (formule de Borda) ?", "Partie A : jusqu'à quelle amplitude peut-on considérer que la période est constante (écart inférieur à 1 %) ?", "Partie B : la période dépend-elle de la masse ? Justifie à partir de l'équation du mouvement.", "Partie C : le graphe T² = f(L) est-il une droite passant par l'origine ? Que vaut g ?", "Compare ta valeur de g à la valeur de référence au Sénégal (g ≈ 9,78 m/s²) : calcule l'écart relatif.", "Estime l'incertitude sur g. Quelle mesure limite la précision ?"],
    init(T) {
      const ch = chrono("pdc");
      const panel = $("#" + T.id + " .panel"); panel.innerHTML = panel.innerHTML.replace("__CHRONO__", ch.html); ch.bind();
      let L = 0.8, A = 10, m = 100, th = 0, om = 0, run = false, prev = 0;
      const set = () => { L = +$("#pdL").value / 100; A = +$("#pdA").value; m = +$("#pdM").value; $("#pdLv").textContent = fr(L * 100, 0) + " cm"; $("#pdAv").textContent = A + "°"; $("#pdT0").textContent = fr(2 * Math.PI * Math.sqrt(L / G), 3) + " s"; $("#pdT0l").textContent = "T₀ théorique pour L = " + fr(L * 100, 0) + " cm : 2π√(L/g)"; };
      const reset = () => { th = A * Math.PI / 180; om = 0; prev = 0; };
      ["#pdL", "#pdA", "#pdM"].forEach(s => $(s).addEventListener("input", () => { set(); if (!run) reset(); T.draw(); }));
      $("#pdGo").onclick = () => { set(); reset(); if (A === 0) { run = false; T.draw(); T.msg("Avec θ₀ = 0°, le pendule est à l'équilibre : il ne bouge pas. T₀ s'obtient par extrapolation de la droite T = f(θ₀²) (Partie A).", "bad"); return; } run = true; T.msg("Pendule lâché : démarre le chronomètre au passage par une position extrême."); };
      $("#pdSt").onclick = () => { run = false; reset(); T.draw(); };
      $("#pdRec").onclick = () => {
        const { t, n, man } = ch.S.reading();
        if (ch.S.on || ch.S.armed) { T.msg("Arrête d'abord le chronomètre.", "bad"); return; }
        if (t < 0.5) { T.msg("Chronomètre d'abord les oscillations.", "bad"); return; }
        const p = $("#pd-part").value; T.add(p, { L, A, m, n, t, man }); T.msg(`Mesure enregistrée dans la partie ${p} : T = ${fr(t / n, 3)} s.`, "ok");
      };
      T.tick = dt => {
        let extreme = false;
        let frac = 0;
        if (run) { const k = Math.max(10, Math.ceil(dt / 0.002)), h = dt / k; for (let i = 0; i < k; i++) { om += -(G / L) * Math.sin(th) * h; th += om * h; if (prev !== 0 && Math.sign(th) !== Math.sign(prev)) { extreme = true; frac = (k - 1 - i) * h; } prev = th; } }
        ch.S.step(dt, extreme, frac); T.draw();
      };
      T.draw = () => {
        const { c, w, h } = fit($("#pendule-cv"), innerWidth < 600 ? 0.95 : 0.58); c.fillStyle = css("--plot-bg"); c.fillRect(0, 0, w, h);
        const fg = css("--fg"), mu = css("--muted"), px = w * 0.38, py = 28, sc = (h - 70) / 1.55;
        support(c, px, py, 150);
        c.setLineDash([7, 5]); c.strokeStyle = css("--accent"); c.lineWidth = 2; c.beginPath(); c.moveTo(px, py); c.lineTo(px, py + L * sc + 30); c.stroke();
        txt(c, "verticale (θ = 0)", px + 6, Math.min(h - 6, py + L * sc + 44), css("--accent"), "center", "alphabetic", "600 12px 'Fira Sans'");
        const a0 = A * Math.PI / 180; c.setLineDash([3, 4]); c.strokeStyle = mu; c.lineWidth = 1; [1, -1].forEach(s => { c.beginPath(); c.moveTo(px, py); c.lineTo(px + Math.sin(s * a0) * L * sc, py + Math.cos(a0) * L * sc); c.stroke(); }); c.setLineDash([]);
        c.strokeStyle = mu; c.beginPath(); c.arc(px, py, 34, Math.PI / 2 - a0, Math.PI / 2, false); c.stroke(); txt(c, "θ₀ = " + A + "°", px + 36 * Math.sin(a0 / 2) + 4, py + 46, mu);
        const bx = px + Math.sin(th) * L * sc, by = py + Math.cos(th) * L * sc, r = 7 + Math.cbrt(m) * 1.3;
        c.strokeStyle = fg; c.lineWidth = 1.5; c.beginPath(); c.moveTo(px, py); c.lineTo(bx, by); c.stroke();
        const gr = c.createRadialGradient(bx - 4, by - 4, 2, bx, by, r); gr.addColorStop(0, "#ffd27a"); gr.addColorStop(1, "#b87503"); c.fillStyle = gr; c.beginPath(); c.arc(bx, by, r, 0, 7); c.fill();
        txt(c, m + " g", bx + r + 4, by + 4, mu);
        // règle verticale
        const rx = w * 0.08; c.strokeStyle = mu; c.beginPath(); c.moveTo(rx, py); c.lineTo(rx, py + 1.5 * sc); c.stroke();
        for (let k = 0; k <= 15; k++) { const y = py + k / 10 * sc; c.beginPath(); c.moveTo(rx, y); c.lineTo(rx + (k % 5 ? 5 : 10), y); c.stroke(); if (k % 5 === 0) txt(c, (k / 10).toFixed(1).replace(".", ",") + " m", rx + 13, y + 4, mu); }
        txt(c, "L = " + fr(L * 100, 0) + " cm", px + 10, py + L * sc * 0.5, fg, "left", "middle", "600 13px 'Fira Sans'");
        const S = ch.S; lcdBox(c, w * 0.8, h * 0.28, fr(S.t, 2) + " s");
        txt(c, S.armed ? "capteur armé…" : S.on ? "chronomètre en marche" : "chronomètre arrêté", w * 0.8, h * 0.28 + 40, S.on ? css("--ok") : mu, "center");
        txt(c, "oscillations : " + S.n, w * 0.8, h * 0.28 + 58, mu, "center");
      };
      set(); reset();
    }
  });

  /* ========================= TP 2 : OSCILLATEUR HARMONIQUE ========================= */
  register({
    id: "ressort", num: 2, disc: "Mécanique", court: "Oscillateur harmonique",
    titre: "L'oscillateur harmonique : système masse-ressort",
    objectifs: "déterminer la raideur k d'un ressort par une méthode statique (loi de Hooke) puis par une méthode dynamique (période des oscillations), comparer les deux résultats et estimer l'influence de la masse du ressort.",
    materiel: ["Potence", "Ressort à spires non jointives", "Porte-masse et masses marquées", "Règle graduée verticale", "Chronomètre ou capteur", "Balance"],
    theorie: `<h4>Méthode statique</h4><p>À l'équilibre, la tension du ressort compense le poids de la masse suspendue :</p>
      <div class="formula">k Δℓ = m g     ⟹    F = m g = k · Δℓ     (Δℓ = ℓ − ℓ₀ : allongement)</div>
      <p>Le graphe F = f(Δℓ) est une droite passant par l'origine, de pente k (loi de Hooke).</p>
      <h4>Méthode dynamique</h4><p>Écartée de sa position d'équilibre puis lâchée, la masse oscille. Avec x l'écart à l'équilibre, le PFD donne :</p>
      <div class="formula">m ẍ = − k x     ⟹    ẍ + ω₀² x = 0,    ω₀ = √(k/m),    T₀ = 2π √(m/k)</div>
      <p>La solution est sinusoïdale : x(t) = X<sub>m</sub> cos(ω₀t + φ). La période ne dépend pas de l'amplitude : c'est un <b>oscillateur harmonique</b>. Le ressort réel a une masse m<sub>r</sub> : on montre qu'il faut remplacer m par m + m<sub>r</sub>/3, d'où</p>
      <div class="formula">T₀² = (4π²/k) · m + (4π²/k) · (m_r/3)</div>
      <p>Le graphe T₀² = f(m) est une droite de pente 4π²/k ; son ordonnée à l'origine donne la masse du ressort.</p>`,
    protocole: `<h4>Partie A — Méthode statique</h4><ol>
        <li>Sans masse suspendue, relève la position ℓ₀ de l'extrémité du ressort sur la règle (affichée dans le panneau).</li>
        <li>Suspends successivement m = 50, 100, 150… jusqu'à 400 g. Attends l'immobilité, puis relève la position ℓ de l'extrémité.</li>
        <li>Enregistre chaque mesure (Partie A) : F = mg et Δℓ = ℓ − ℓ₀ sont calculés.</li>
        <li>Exploite le graphe F = f(Δℓ) : la pente est la raideur k.</li></ol>
      <h4>Partie B — Méthode dynamique</h4><ol>
        <li>Suspends m = 100 g, écarte la masse de 2 cm vers le bas et lâche-la sans vitesse.</li>
        <li>Chronomètre 10 oscillations (déclenchement en position basse) et enregistre (Partie B).</li>
        <li>Vérifie qu'en changeant l'amplitude (1 cm puis 4 cm), la période ne change pas.</li>
        <li>Recommence pour m = 150, 200… 400 g. Exploite le graphe T₀² = f(m).</li></ol>`,
    precautions: `<ul><li>Ne dépasse pas la limite d'élasticité du ressort : au-delà de 500 g, il se déforme définitivement.</li>
      <li>Lis la règle bien en face (erreur de parallaxe) : la précision de lecture est de l'ordre de ±1 mm.</li>
      <li>Les oscillations doivent rester verticales : un mouvement de balancier fausse la mesure.</li>
      <li>Δk/k (statique) ≈ Δm/m + Δ(Δℓ)/Δℓ ; Δk/k (dynamique) ≈ Δm/m + 2 ΔT/T.</li></ul>`,
    preparation: ["Établis l'équation différentielle du mouvement de la masse autour de sa position d'équilibre (le poids disparaît : montre-le).", "Exprime T₀ en fonction de m et k.", "Pour k = 25 N/m et m = 200 g, calcule l'allongement à l'équilibre et la période.", "Quelle grandeur faut-il porter en ordonnée pour obtenir une droite en fonction de m ?"],
    hint: "Choisis la masse, puis : en statique, lis la position sur la règle ; en dynamique, écarte la masse et chronomètre.",
    controls: `<h3>Ressort</h3>
      <div class="ctl"><label for="rsM">Masse suspendue m <b id="rsMv"></b></label><input id="rsM" type="range" min="0" max="400" step="50" value="100"></div>
      <dl class="lcd"><dt>Position à vide ℓ₀</dt><dd id="rsL0"></dd><dt>Position lue ℓ</dt><dd id="rsL"></dd></dl>
      <div class="ctl"><label for="rsX">Écart initial vers le bas <b id="rsXv"></b></label><input id="rsX" type="range" min="1" max="4" step="0.5" value="2"></div>
      <div class="row"><button type="button" class="btn primary sm" id="rsGo">Lâcher la masse</button><button type="button" class="btn sm" id="rsSt">Immobiliser</button></div>
      __CHRONO__
      <div class="row"><button type="button" class="btn primary sm" id="rsRecA">Enregistrer (A — statique)</button><button type="button" class="btn primary sm" id="rsRecB">Enregistrer (B — période)</button></div>
      <button type="button" class="btn sm" id="rsNew">Changer de ressort</button>`,
    parts: [
      { key: "A", titre: "Méthode statique (loi de Hooke)", cols: ["n°", "m (g)", "F = mg (N)", "ℓ (cm)", "Δℓ (cm)"],
        cells: (r, i) => [i + 1, r.m, fr(r.m / 1000 * G, 3), fr(r.l, 1), fr(r.l - r.l0, 1)],
        point: r => [(r.l - r.l0) / 100, r.m / 1000 * G], axes: { xl: "Δℓ (m)", yl: "F (N)", xmin: 0, ymin: 0 },
        fit: R => R ? `F = ${fr(R.a, 2)} · Δℓ ${R.b < 0 ? "−" : "+"} ${fr(Math.abs(R.b), 3)}  (r = ${fr(R.r, 4)})   ⟹   k (statique) = ${fr(R.a, 1)} N/m` : "Au moins 2 mesures sont nécessaires." },
      { key: "B", titre: "Méthode dynamique (période)", cols: ["n°", "m (g)", "X₀ (cm)", "n", "t (s)", "T₀ (s)", "T₀² (s²)"],
        cells: (r, i) => [i + 1, r.m, fr(r.X, 1), r.n, fr(r.t, 2), fr(r.t / r.n, 3), fr((r.t / r.n) ** 2, 4)],
        point: r => [r.m / 1000, (r.t / r.n) ** 2], axes: { xl: "m (kg)", yl: "T₀² (s²)", xmin: 0, ymin: 0 },
        fit: R => R ? `T₀² = ${fr(R.a, 3)} · m ${R.b < 0 ? "−" : "+"} ${fr(Math.abs(R.b), 4)}  (r = ${fr(R.r, 4)})   ⟹   k (dynamique) = 4π²/pente = ${fr(PI2 / R.a, 1)} N/m ;  masse du ressort ≈ 3·b/pente = ${fr(Math.max(0, 3 * R.b / R.a) * 1000, 0)} g` : "Au moins 2 mesures sont nécessaires." }
    ],
    questions: ["Partie A : la loi de Hooke est-elle vérifiée ? Donne la valeur de k.", "Partie B : la période dépend-elle de l'amplitude ? Justifie le nom « oscillateur harmonique ».", "Donne k obtenu par la méthode dynamique et compare-le à la valeur statique (écart relatif).", "Que représente l'ordonnée à l'origine du graphe T₀² = f(m) ? Estime la masse du ressort.", "Quelle méthode te paraît la plus précise ? Pourquoi ?"],
    init(T) {
      const ch = chrono("rsc"); const panel = $("#" + T.id + " .panel"); panel.innerHTML = panel.innerHTML.replace("__CHRONO__", ch.html); ch.bind();
      let P = store.get("ressort_par", null);
      const newSpring = () => { P = { k: 20 + Math.random() * 25, mr: 0.060 + Math.random() * 0.060, l0: 18 + Math.random() * 4 }; P.l0read = Math.round((P.l0 + gauss() * 0.04) * 10) / 10; store.set("ressort_par", P); };
      if (!P) newSpring();
      let m = 0.1, X = 0.02, x = 0, v = 0, run = false, prev = 0, wob = 0;
      const eqPos = () => P.l0 + (m * G / P.k) * 100;   // cm
      const read = () => Math.round((eqPos() + gauss() * 0.04) * 10) / 10;
      let lread = read();
      const set = () => { m = +$("#rsM").value / 1000; X = +$("#rsX").value / 100; $("#rsMv").textContent = Math.round(m * 1000) + " g"; $("#rsXv").textContent = fr(X * 100, 1) + " cm"; $("#rsL0").textContent = fr(P.l0read, 1) + " cm"; lread = read(); $("#rsL").textContent = run ? "en mouvement" : fr(lread, 1) + " cm"; };
      $("#rsM").addEventListener("input", () => { run = false; x = 0; v = 0; set(); T.draw(); });
      $("#rsX").addEventListener("input", () => { set(); });
      $("#rsGo").onclick = () => { if (m === 0) { T.msg("Suspends d'abord une masse.", "bad"); return; } set(); x = X; v = 0; prev = 0; run = true; $("#rsL").textContent = "en mouvement"; T.msg("Masse lâchée : chronomètre les oscillations."); };
      $("#rsSt").onclick = () => { run = false; x = 0; v = 0; set(); T.draw(); };
      $("#rsRecA").onclick = () => { if (run) { T.msg("Immobilise la masse avant de lire la règle.", "bad"); return; } T.add("A", { m: Math.round(m * 1000), l: lread, l0: P.l0read }); T.msg("Mesure statique enregistrée.", "ok"); };
      $("#rsRecB").onclick = () => { const { t, n } = ch.S.reading(); if (ch.S.on || ch.S.armed) { T.msg("Arrête d'abord le chronomètre.", "bad"); return; } if (t < 0.3) { T.msg("Chronomètre d'abord les oscillations.", "bad"); return; } T.add("B", { m: Math.round(m * 1000), X: X * 100, n, t }); T.msg(`Période enregistrée : T₀ = ${fr(t / n, 3)} s.`, "ok"); };
      $("#rsNew").onclick = () => { if (T.locked()) { T.msg("Compte rendu déjà soumis : le matériel ne peut plus être changé.", "bad"); return; } newSpring(); T.clearRows(); set(); T.draw(); T.msg("Nouveau ressort : refais les mesures."); };
      T.tick = dt => {
        let extreme = false;
        let frac = 0;
        if (run) { const meff = m + P.mr / 3, k = Math.max(10, Math.ceil(dt / 0.001)), h = dt / k; for (let i = 0; i < k; i++) { v += -(P.k / meff) * x * h; x += v * h; if (prev !== 0 && Math.sign(x) !== Math.sign(prev)) { extreme = true; frac = (k - 1 - i) * h; } prev = x; } }
        ch.S.step(dt, extreme, frac); T.draw();
      };
      T.draw = () => {
        const { c, w, h } = fit($("#ressort-cv"), innerWidth < 600 ? 1.0 : 0.6); c.fillStyle = css("--plot-bg"); c.fillRect(0, 0, w, h);
        const fg = css("--fg"), mu = css("--muted"), px = w < 520 ? w * 0.2 : w * 0.36, cxR = w < 520 ? w * 0.73 : w * 0.8, py = 24, sc = (h - 60) / 50; // px par cm
        support(c, px, py, 120);
        const yEnd = py + (eqPos() + x * 100) * sc;
        // ressort (spires)
        const nS = 26, top = py, len = yEnd - top - 10; c.strokeStyle = fg; c.lineWidth = 1.6; c.beginPath(); c.moveTo(px, top);
        for (let i = 0; i <= nS; i++) { const y = top + 8 + (len - 8) * i / nS; c.lineTo(px + (i % 2 ? 11 : -11) * (i === 0 || i === nS ? 0 : 1), y); } c.lineTo(px, yEnd); c.stroke();
        // masse
        if (m > 0) { const hh = 10 + m * 1000 / 18; c.fillStyle = "#8a8f98"; c.fillRect(px - 18, yEnd, 36, hh); c.strokeStyle = fg; c.strokeRect(px - 18, yEnd, 36, hh); txt(c, Math.round(m * 1000) + " g", px + 26, yEnd + hh / 2 + 4, mu); }
        else { c.fillStyle = fg; c.beginPath(); c.arc(px, yEnd, 3, 0, 7); c.fill(); }
        // index et règle
        const rx = px + 60; c.strokeStyle = css("--rouge"); c.lineWidth = 1.5; c.beginPath(); c.moveTo(px, yEnd); c.lineTo(rx, yEnd); c.stroke();
        c.fillStyle = "#efe6cf"; c.fillRect(rx, py, 34, 50 * sc); c.strokeStyle = mu; c.lineWidth = 1; c.strokeRect(rx, py, 34, 50 * sc);
        for (let k = 0; k <= 50; k++) { const y = py + k * sc; c.beginPath(); c.moveTo(rx, y); c.lineTo(rx + (k % 5 ? 7 : 13), y); c.stroke(); if (k % 5 === 0) txt(c, String(k), rx + 16, y + 4, "#5a4a2a", "left", "alphabetic", "11px 'Fira Mono'"); }
        txt(c, "cm", rx + 17, py + 50 * sc + 14, mu);
        // loupe de lecture
        const S = ch.S; lcdBox(c, cxR, h * 0.25, fr(S.t, 2) + " s");
        txt(c, S.armed ? "capteur armé…" : S.on ? "chronomètre en marche" : "chronomètre arrêté", cxR, h * 0.25 + 40, S.on ? css("--ok") : mu, "center");
        txt(c, "oscillations : " + S.n, cxR, h * 0.25 + 58, mu, "center");
        // loupe : la règle agrandie autour de l'index, graduée au millimètre
        { const pos = eqPos() + x * 100, lw = Math.min(150, w * 0.36), lh = Math.min(170, h * 0.42), lx = cxR - lw / 2, ly = h * 0.25 + 72, zs = lh / 3.2, cy = ly + lh / 2;
          c.save(); c.beginPath(); c.rect(lx, ly, lw, lh); c.clip(); c.fillStyle = "#efe6cf"; c.fillRect(lx, ly, lw, lh);
          c.strokeStyle = css("--rouge"); c.lineWidth = 2; c.beginPath(); c.moveTo(lx, cy); c.lineTo(lx + lw, cy); c.stroke();
          c.strokeStyle = "#5a4a2a"; c.lineWidth = 1;
          for (let mm = Math.floor((pos - 2) * 10); mm <= Math.ceil((pos + 2) * 10); mm++) { const y = cy + (mm / 10 - pos) * zs, big = mm % 10 === 0, mid = mm % 5 === 0; c.beginPath(); c.moveTo(lx, y); c.lineTo(lx + (big ? 30 : mid ? 20 : 11), y); c.stroke(); if (big) txt(c, String(mm / 10), lx + 36, y + 5, "#5a4a2a", "left", "alphabetic", "600 14px 'Fira Mono'"); }
          c.restore();
          c.strokeStyle = mu; c.lineWidth = 1; c.strokeRect(lx, ly, lw, lh);
          txt(c, "loupe : règle graduée en mm", cxR, ly + lh + 16, mu, "center"); }
        if (!run && m > 0) txt(c, "lecture : ℓ = " + fr(lread, 1) + " cm", cxR, Math.min(h - 8, h * 0.25 + 72 + Math.min(170, h * 0.42) + 36), fg, "center", "alphabetic", "600 14px 'Fira Sans'");
      };
      set();
    }
  });

  /* ========================= TP 3 : PENDULE DE TORSION ========================= */
  register({
    id: "torsion", num: 3, disc: "Mécanique", court: "Pendule de torsion",
    titre: "Le pendule de torsion",
    objectifs: "étudier les oscillations d'un pendule de torsion, déterminer la constante de torsion C du fil et le moment d'inertie J₀ de la barre, puis étudier l'influence de la longueur du fil.",
    materiel: ["Potence", "Fil d'acier de torsion (longueur réglable)", "Barre horizontale graduée", "Deux masses cylindriques identiques m = 200 g", "Règle", "Chronomètre ou capteur"],
    theorie: `<p>Une barre horizontale est suspendue en son milieu à un fil vertical. Si on la tourne d'un angle θ, le fil exerce un <b>couple de rappel</b> proportionnel à l'angle :</p>
      <div class="formula">Γ = − C θ     (C : constante de torsion, en N·m/rad)</div>
      <p>Le théorème du moment cinétique par rapport à l'axe du fil donne, avec J le moment d'inertie de l'ensemble :</p>
      <div class="formula">J θ̈ = − C θ    ⟹    θ̈ + (C/J) θ = 0,    T = 2π √(J/C)</div>
      <p>Le mouvement est rigoureusement harmonique : la période ne dépend pas de l'amplitude, même grande.</p>
      <h4>Masses placées sur la barre</h4><p>Deux masses m (assimilées à des points) placées symétriquement à la distance d de l'axe ajoutent 2md² au moment d'inertie (J₀ : barre seule) :</p>
      <div class="formula">T² = (4π²/C) · (J₀ + 2 m d²) = (8π² m / C) · d² + 4π² J₀ / C</div>
      <p>Le graphe T² = f(d²) est une droite : sa pente a donne <b>C = 8π²m / a</b>, son ordonnée à l'origine b donne <b>J₀ = b·C / (4π²)</b>.</p>
      <h4>Influence de la longueur du fil</h4><p>Pour un fil cylindrique de rayon r et de longueur ℓ : C = π G r⁴ / (2ℓ) (G : module de cisaillement). C est inversement proportionnel à ℓ, donc à d fixé T² est proportionnel à ℓ.</p>`,
    protocole: `<h4>Partie A — Détermination de C et J₀</h4><ol>
        <li>Règle la longueur du fil à ℓ = 50 cm.</li>
        <li>Place les deux masses à d = 5 cm de part et d'autre de l'axe, symétriquement.</li>
        <li>Tourne la barre d'environ 30° dans le plan horizontal et lâche-la sans vitesse : elle doit tourner sans se balancer.</li>
        <li>Chronomètre 5 oscillations (T est de plusieurs secondes) et enregistre (Partie A).</li>
        <li>Recommence pour d = 7,5 ; 10 ; 12,5 ; 15 ; 17,5 ; 20 cm. Exploite le graphe T² = f(d²).</li></ol>
      <h4>Partie B — Influence de la longueur du fil</h4><ol>
        <li>Place les masses à d = 15 cm.</li>
        <li>Mesure la période pour ℓ = 30, 40, 50, 60, 70 et 80 cm (Partie B).</li>
        <li>Trace T² = f(ℓ) et conclus sur la relation entre C et ℓ.</li></ol>`,
    precautions: `<ul><li>Ne tords jamais le fil de plus d'un demi-tour : il se déformerait de façon permanente.</li>
      <li>Les deux masses doivent être exactement symétriques, sinon la barre se balance.</li>
      <li>La période étant longue, chronométrer 5 oscillations suffit pour une bonne précision.</li>
      <li>ΔC/C ≈ Δm/m + 2Δd/d + 2ΔT/T : la position des masses doit être relevée soigneusement.</li></ul>`,
    preparation: ["Établis l'équation du mouvement du pendule de torsion à partir du théorème du moment cinétique.", "Exprime T en fonction de J et C.", "Montre que T² est une fonction affine de d².", "Pour C = 0,02 N·m/rad, J₀ = 2×10⁻³ kg·m², m = 0,2 kg et d = 10 cm, calcule T."],
    hint: "Vue de face (à gauche) et vue de dessus (à droite) : la barre tourne dans le plan horizontal.",
    controls: `<h3>Montage</h3>
      <div class="ctl"><label for="toD">Position des masses d <b id="toDv"></b></label><input id="toD" type="range" min="2.5" max="20" step="2.5" value="10"></div>
      <div class="ctl"><label for="toL">Longueur du fil ℓ <b id="toLv"></b></label><input id="toL" type="range" min="30" max="80" step="10" value="50"></div>
      <div class="ctl"><label for="toA">Angle initial θ₀ <b id="toAv"></b></label><input id="toA" type="range" min="10" max="90" step="5" value="30"></div>
      <div class="row"><button type="button" class="btn primary sm" id="toGo">Lâcher la barre</button><button type="button" class="btn sm" id="toSt">Immobiliser</button></div>
      __CHRONO__
      ${partSelect("to", [["A", "Partie A — position des masses"], ["B", "Partie B — longueur du fil"]])}
      <button type="button" class="btn primary sm" id="toRec">Enregistrer la mesure</button>
      <button type="button" class="btn sm" id="toNew">Changer de fil</button>`,
    parts: [
      { key: "A", titre: "Détermination de C et J₀ (ℓ fixée)", cols: ["n°", "ℓ (cm)", "d (cm)", "d² (m²)", "n", "t (s)", "T (s)", "T² (s²)"],
        cells: (r, i) => [i + 1, r.L, fr(r.d, 1), fr((r.d / 100) ** 2, 5), r.n, fr(r.t, 2), fr(r.t / r.n, 3), fr((r.t / r.n) ** 2, 3)],
        point: r => [(r.d / 100) ** 2, (r.t / r.n) ** 2], axes: { xl: "d² (m²)", yl: "T² (s²)", xmin: 0, ymin: 0 },
        fit: R => { if (!R) return "Au moins 2 mesures sont nécessaires."; const C = 8 * Math.PI ** 2 * 0.2 / R.a, J0 = R.b * C / PI2; return `T² = ${fr(R.a, 1)} · d² + ${fr(R.b, 3)}  (r = ${fr(R.r, 4)})   ⟹   C = 8π²m/pente = ${fr(C * 1000, 2)}×10⁻³ N·m/rad ;  J₀ = b·C/4π² = ${fr(J0 * 1000, 2)}×10⁻³ kg·m²`; } },
      { key: "B", titre: "Influence de la longueur du fil (d fixée)", cols: ["n°", "ℓ (m)", "d (cm)", "n", "t (s)", "T (s)", "T² (s²)"],
        cells: (r, i) => [i + 1, fr(r.L / 100, 2), fr(r.d, 1), r.n, fr(r.t, 2), fr(r.t / r.n, 3), fr((r.t / r.n) ** 2, 3)],
        point: r => [r.L / 100, (r.t / r.n) ** 2], axes: { xl: "ℓ (m)", yl: "T² (s²)", xmin: 0, ymin: 0 },
        fit: R => R ? `T² = ${fr(R.a, 2)} · ℓ ${R.b < 0 ? "−" : "+"} ${fr(Math.abs(R.b), 3)}  (r = ${fr(R.r, 4)})   ⟹   T² ∝ ℓ si l'ordonnée à l'origine est négligeable, donc C ∝ 1/ℓ` : "Au moins 2 mesures sont nécessaires." }
    ],
    questions: ["La période dépend-elle de l'angle initial θ₀ ? Pourquoi le pendule de torsion est-il un oscillateur harmonique même pour de grands angles ?", "Partie A : donne C et J₀ avec leurs unités.", "Compare J₀ au moment d'inertie d'une barre homogène de masse M = 0,3 kg et de longueur 40 cm (J = ML²/12).", "Partie B : comment varie C avec la longueur du fil ? Est-ce conforme à la formule C = πGr⁴/(2ℓ) ?", "Cite deux sources d'erreur et propose une amélioration du protocole."],
    init(T) {
      const ch = chrono("toc"); const panel = $("#" + T.id + " .panel"); panel.innerHTML = panel.innerHTML.replace("__CHRONO__", ch.html); ch.bind();
      const nb = $("#toc-nb"); nb.value = 5;
      let P = store.get("torsion_par", null);
      const newWire = () => { P = { C50: 0.015 + Math.random() * 0.015, J0: 0.0035 + Math.random() * 0.0015 }; store.set("torsion_par", P); };
      if (!P) newWire();
      const m = 0.2; let d = 0.1, L = 50, A = 30, th = 0, om = 0, run = false, prev = 0;
      const C = () => P.C50 * 50 / L, J = () => P.J0 + 2 * m * d * d;
      const set = () => { d = +$("#toD").value / 100; L = +$("#toL").value; A = +$("#toA").value; $("#toDv").textContent = fr(d * 100, 1) + " cm"; $("#toLv").textContent = L + " cm"; $("#toAv").textContent = A + "°"; };
      ["#toD", "#toL", "#toA"].forEach(s => $(s).addEventListener("input", () => { set(); if (!run) th = 0; T.draw(); }));
      $("#toGo").onclick = () => { set(); th = A * Math.PI / 180; om = 0; prev = 0; run = true; T.msg("Barre lâchée : chronomètre au moins 5 oscillations."); };
      $("#toSt").onclick = () => { run = false; th = 0; om = 0; T.draw(); };
      $("#toRec").onclick = () => { const { t, n } = ch.S.reading(); if (ch.S.on || ch.S.armed) { T.msg("Arrête d'abord le chronomètre.", "bad"); return; } if (t < 1) { T.msg("Chronomètre d'abord les oscillations.", "bad"); return; } const p = $("#to-part").value; T.add(p, { L, d: d * 100, n, t }); T.msg(`Mesure enregistrée (partie ${p}) : T = ${fr(t / n, 3)} s.`, "ok"); };
      $("#toNew").onclick = () => { if (T.locked()) { T.msg("Compte rendu déjà soumis : le matériel ne peut plus être changé.", "bad"); return; } newWire(); T.clearRows(); T.msg("Nouveau fil : refais les mesures."); };
      T.tick = dt => { let extreme = false, frac = 0; if (run) { const k = Math.max(10, Math.ceil(dt / 0.002)), h = dt / k, w2 = C() / J(); for (let i = 0; i < k; i++) { om += -w2 * th * h; th += om * h; if (prev !== 0 && Math.sign(th) !== Math.sign(prev)) { extreme = true; frac = (k - 1 - i) * h; } prev = th; } } ch.S.step(dt, extreme, frac); T.draw(); };
      T.draw = () => {
        const { c, w, h } = fit($("#torsion-cv"), innerWidth < 600 ? 1.0 : 0.58); c.fillStyle = css("--plot-bg"); c.fillRect(0, 0, w, h);
        const fg = css("--fg"), mu = css("--muted"), cx = w * 0.3, top = 26, wireLen = (h - 110) * L / 80, by = top + wireLen, half = w * 0.17;
        support(c, cx, top, 100);
        c.strokeStyle = fg; c.lineWidth = 1.2; c.beginPath(); c.moveTo(cx, top); c.lineTo(cx, by); c.stroke();
        txt(c, "ℓ = " + L + " cm", cx + 8, top + wireLen / 2, mu);
        // vue de face : projection de la barre
        const cs = Math.cos(th), sn = Math.sin(th);
        c.strokeStyle = "#6b7380"; c.lineWidth = 6; c.beginPath(); c.moveTo(cx - half * cs, by); c.lineTo(cx + half * cs, by); c.stroke();
        [1, -1].forEach(s => { const xm = cx + s * (d / 0.2) * half * cs, depth = s * sn, r = 9 + depth * 2.5; c.fillStyle = depth > 0 ? "#b87503" : "#d98e04"; c.beginPath(); c.arc(xm, by, Math.max(5, r), 0, 7); c.fill(); });
        txt(c, "vue de face", cx, by + 34, mu, "center");
        // vue de dessus
        const tx = w * 0.72, ty = h * 0.5, R = Math.min(w * 0.2, h * 0.36);
        c.strokeStyle = css("--grid"); c.lineWidth = 1; c.beginPath(); c.arc(tx, ty, R, 0, 7); c.stroke();
        for (let a = 0; a < 360; a += 10) { const ra = a * Math.PI / 180; c.beginPath(); c.moveTo(tx + Math.cos(ra) * R, ty + Math.sin(ra) * R); c.lineTo(tx + Math.cos(ra) * (R - (a % 30 ? 4 : 9)), ty + Math.sin(ra) * (R - (a % 30 ? 4 : 9))); c.stroke(); }
        c.setLineDash([4, 4]); c.strokeStyle = mu; c.beginPath(); c.moveTo(tx - R, ty); c.lineTo(tx + R, ty); c.stroke(); c.setLineDash([]);
        c.strokeStyle = "#6b7380"; c.lineWidth = 6; c.beginPath(); c.moveTo(tx - R * 0.9 * cs, ty - R * 0.9 * sn); c.lineTo(tx + R * 0.9 * cs, ty + R * 0.9 * sn); c.stroke();
        [1, -1].forEach(s => { c.fillStyle = "#d98e04"; c.beginPath(); c.arc(tx + s * (d / 0.2) * R * 0.9 * cs, ty + s * (d / 0.2) * R * 0.9 * sn, 8, 0, 7); c.fill(); });
        c.fillStyle = fg; c.beginPath(); c.arc(tx, ty, 3, 0, 7); c.fill();
        txt(c, "vue de dessus  θ = " + fr(th * 180 / Math.PI, 0) + "°", tx, ty + R + 18, mu, "center");
        const S = ch.S; lcdBox(c, cx, h - 30, fr(S.t, 2) + " s"); txt(c, (S.armed ? "capteur armé" : S.on ? "en marche" : "arrêté") + " • osc. " + S.n, cx + 80, h - 26, mu);
      };
      set();
    }
  });
})();
