/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* TP de chimie de L1 : n° C1 acidimétrie et pH-métrie (les autres suivront) */
(function () {
  "use strict";
  const { register, $, css, store, fit, txt } = window.TPCORE;
  const seg = (id, items, cur) => `<div class="seg" role="group">${items.map(([v, l]) => `<button type="button" data-${id}="${v}" aria-pressed="${v === cur}">${l}</button>`).join("")}</div>`;
  const setSeg = (id, v) => document.querySelectorAll(`[data-${id}]`).forEach(b => b.setAttribute("aria-pressed", b.getAttribute("data-" + id) === v));
  const f2 = x => isFinite(x) ? (+x).toFixed(2).replace(".", ",") : "—";
  const KW = 1e-14, CB = 0.100;

  /* ======================================================================
     TP C1 : ACIDIMÉTRIE ET pH-MÉTRIE
     A : dosage coloré de HCl (phénolphtaléine) ; B : étalonnage du pH-mètre ;
     C : courbe pH = f(V) de HCl ; D : courbe pH = f(V) de CH₃COOH et pKa
     ====================================================================== */
  // prise d'essai (mL), eau ajoutée (mL), acide fort (s) ou faible (w)
  const SYS = { A: { Va: 10, Vw: 20, ac: "s" }, C: { Va: 20, Vw: 50, ac: "s" }, D: { Va: 20, Vw: 50, ac: "w" } };
  /* pH exact du mélange (électroneutralité résolue par dichotomie sur log h) */
  const pHof = (P, sys, V) => {
    const S = SYS[sys], Vt = S.Va + S.Vw + V, na = CB * V / Vt, Ka = Math.pow(10, -P.pKa);
    const cs = S.ac === "s" ? P.ca * S.Va / Vt : 0, cw = S.ac === "w" ? P.cw * S.Va / Vt : 0;
    let lo = -14.5, hi = 0.5;
    for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2, h = Math.pow(10, m); if (h + na - KW / h - cs - cw * Ka / (Ka + h) > 0) hi = m; else lo = m; }
    return -(lo + hi) / 2;
  };
  window.TPX = window.TPX || {}; window.TPX.pHof = pHof;
  const VMAX = 50;
  register({
    id: "acidi", num: 21, lab: "C1", disc: "Chimie", court: "Acidimétrie et pH-métrie",
    titre: "Acidimétrie et pH-métrie : dosage d'un acide fort et d'un acide faible par la soude",
    objectifs: "doser l'acide chlorhydrique par la soude avec un indicateur coloré, étalonner un pH-mètre, tracer les courbes pH = f(V) d'un acide fort et d'un acide faible, déterminer leurs concentrations et le pKa du couple CH₃COOH/CH₃COO⁻.",
    materiel: ["Burette graduée de 50 mL (lecture au 0,05 mL) remplie de soude NaOH à 0,100 mol/L", "Acide chlorhydrique HCl de concentration inconnue (environ 0,1 mol/L)", "Acide éthanoïque CH₃COOH de concentration inconnue (environ 0,1 mol/L)", "Pipettes jaugées de 10,0 et 20,0 mL, erlenmeyer, bécher de 150 mL, eau distillée", "Phénolphtaléine", "pH-mètre avec électrode combinée, tampons pH 7 et pH 4", "Agitateur magnétique"],
    theorie: `<p>Les réactions de dosage par la soude sont totales :</p>
      <div class="formula">H₃O⁺ + HO⁻ → 2 H₂O          CH₃COOH + HO⁻ → CH₃COO⁻ + H₂O</div>
      <p>À l'équivalence, l'acide et la base ont été introduits dans les proportions stœchiométriques :</p>
      <div class="formula">C_a · V_a = C_b · V_E</div>
      <h4>Courbes pH = f(V)</h4><ul>
      <li><b>Acide fort</b> : pH initial ≈ −log C (faible), saut de pH important, pH = 7 à l'équivalence.</li>
      <li><b>Acide faible</b> : pH initial plus élevé, saut plus court, pH &gt; 7 à l'équivalence (la solution contient la base CH₃COO⁻).</li>
      <li>À la <b>demi-équivalence</b> (V = V_E/2), [CH₃COOH] = [CH₃COO⁻], donc <b>pH = pKa</b>.</li></ul>
      <h4>Repérer l'équivalence</h4><p>Méthode des tangentes parallèles, ou maximum de la dérivée ΔpH/ΔV : l'équivalence est au milieu de l'intervalle où ΔpH/ΔV est le plus grand.</p>
      <h4>Indicateur coloré</h4><p>La phénolphtaléine (incolore → rose, zone de virage 8,2 – 10) vire dans le saut de pH des deux dosages ; l'hélianthine (3,1 – 4,4) ne convient pas pour l'acide faible.</p>`,
    protocole: `<h4>Partie A — Dosage coloré de HCl</h4><ol>
        <li>Prise d'essai : 10,0 mL de HCl + 20 mL d'eau + 2 gouttes de phénolphtaléine dans l'erlenmeyer (montage A).</li>
        <li><b>Dosage rapide</b> : verse la soude mL par mL jusqu'à la teinte rose persistante et note V (essai 1).</li>
        <li><b>Deux dosages précis</b> (« Nouveau dosage ») : verse rapidement jusqu'à 1 mL avant l'équivalence, puis goutte à goutte. Note V à la première teinte rose persistante. Les deux volumes doivent concorder à 0,1 mL près.</li></ol>
      <h4>Partie B — Étalonnage du pH-mètre</h4><ol>
        <li>Électrode dans le tampon pH 7 : tourne le bouton « zéro » jusqu'à lire 7,00. Note la lecture.</li>
        <li>Électrode rincée, dans le tampon pH 4 : tourne le bouton « pente » jusqu'à lire 4,00. Note la lecture. Ne touche plus aux boutons ensuite.</li></ol>
      <h4>Partie C — Suivi pH-métrique de HCl</h4><ol>
        <li>20,0 mL de HCl + 50 mL d'eau dans le bécher, électrode immergée, agitation (montage C).</li>
        <li>Relève le pH tous les 1 mL, puis tous les 0,2 mL (ou moins) autour de l'équivalence, jusqu'à V = 30 mL.</li>
        <li>Calcule ΔpH/ΔV entre chaque point et le précédent ; repère V_E et le pH à l'équivalence.</li></ol>
      <h4>Partie D — Suivi pH-métrique de CH₃COOH</h4><ol>
        <li>Même protocole avec 20,0 mL d'acide éthanoïque (montage D).</li>
        <li>Repère V_E, puis lis le pH à la demi-équivalence V_E/2 : c'est le pKa.</li></ol>`,
    precautions: `<ul><li>Chasse la bulle d'air sous le robinet et ajuste le zéro de la burette avant chaque dosage (« Nouveau dosage »).</li>
      <li>La teinte rose doit <b>persister</b> : une coloration qui disparaît à l'agitation n'est pas l'équivalence.</li>
      <li>Étalonne le pH-mètre <b>avant</b> les parties C et D : sans étalonnage, toutes les valeurs de pH sont fausses.</li>
      <li>Près de l'équivalence, le pH varie très vite : verse goutte à goutte et resserre les points.</li>
      <li>Réel : blouse, lunettes, gants pour la soude ; rince l'électrode à l'eau distillée entre deux solutions.</li></ul>`,
    preparation: ["Écris les équations des deux réactions de dosage et la relation à l'équivalence.", "Calcule V_E attendu pour 10,0 mL d'un acide à 0,10 mol/L dosé par la soude à 0,100 mol/L.", "Calcule le pH initial d'une solution de HCl à 0,10 mol/L diluée de 20 mL à 70 mL.", "Montre qu'à la demi-équivalence du dosage d'un acide faible, pH = pKa.", "Pourquoi la phénolphtaléine convient-elle aux deux dosages ?"],
    hint: "Choisis le montage, verse la soude avec les boutons de la burette et observe la couleur ou le pH-mètre. Étalonne le pH-mètre (montage B) avant les courbes C et D.",
    controls: `<h3>Montage</h3>${seg("chm", [["A", "A · indicateur"], ["B", "B · étalonnage"], ["C", "C · HCl"], ["D", "D · CH₃COOH"]], "A")}
      <div id="chBur"><h3>Burette (soude 0,100 mol/L)</h3>
      <div class="row"><button type="button" class="btn sm" data-chv="1">+ 1 mL</button><button type="button" class="btn sm" data-chv="0.5">+ 0,5 mL</button><button type="button" class="btn sm" data-chv="0.2">+ 0,2 mL</button><button type="button" class="btn sm" data-chv="0.05">+ 1 goutte</button></div>
      <button type="button" class="btn sm" id="chRaz">Nouveau dosage (burette au zéro, nouvelle prise)</button></div>
      <div id="chCal" hidden><h3>Étalonnage</h3>
      <div class="ctl"><label for="chTp">Électrode plongée dans</label><select id="chTp"><option value="7">le tampon pH 7</option><option value="4">le tampon pH 4</option></select></div>
      <div class="ctl"><label for="chZ">Bouton « zéro » <b id="chZv"></b></label><input id="chZ" type="range" min="-0.6" max="0.6" step="0.005" value="0"></div>
      <div class="ctl"><label for="chK">Bouton « pente » <b id="chKv"></b></label><input id="chK" type="range" min="94" max="110" step="0.05" value="100"></div></div>
      <dl class="lcd"><dt>Burette : V versé</dt><dd id="chVd"></dd><dt id="chLt">pH-mètre</dt><dd id="chPd"></dd></dl>
      <div class="row"><button type="button" class="btn primary sm" id="chRec">Enregistrer</button></div>
      <button type="button" class="btn sm" id="chNew">Changer de matériel</button>`,
    parts: [
      { key: "A", titre: "Dosage coloré de HCl", cols: ["Essai", "V_a (mL)", "V_E (mL)"] },
      { key: "B", titre: "Étalonnage du pH-mètre", cols: ["n°", "Tampon", "Lecture"] },
      { key: "C", titre: "Courbe pH = f(V) de HCl", cols: ["n°", "V (mL)", "pH"] },
      { key: "D", titre: "Courbe pH = f(V) de CH₃COOH", cols: ["n°", "V (mL)", "pH"] }
    ],
    questions: ["Écris les équations des réactions de dosage. Pourquoi la phénolphtaléine convient-elle ?", "Calcule la concentration de HCl par le dosage coloré, puis par la courbe pH-métrique. Compare.", "Compare les deux courbes : pH initial, pH à l'équivalence, hauteur du saut.", "Déduis le pKa du couple CH₃COOH/CH₃COO⁻ et compare-le à 4,76.", "Pourquoi l'hélianthine ne convient-elle pas pour l'acide éthanoïque ?"],
    init(T) {
      let P = store.get("acidi_par", null);
      const newP = () => { const sg = Math.random() < 0.5 ? -1 : 1; P = { ca: 0.08 + Math.random() * 0.04, cw: 0.08 + Math.random() * 0.04, pKa: 4.76 + (Math.random() * 2 - 1) * 0.04, s: 0.93 + Math.random() * 0.055, off: sg * (0.12 + Math.random() * 0.25) }; store.set("acidi_par", P); };
      if (!P || !isFinite(P.ca)) newP();
      const st0 = { m: "A", V: { A: 0, C: 0, D: 0 }, finA: false, z: 0, k: 100 };
      let st = Object.assign({}, st0, store.get("acidi_st", {})); st.V = Object.assign({ A: 0, C: 0, D: 0 }, st.V);
      const save = () => store.set("acidi_st", st);
      const VeA = () => P.ca * SYS.A.Va / CB;
      const seed = { A: 1.7, C: 2.9, D: 4.3, B4: 5.1, B7: 6.7 };
      // lecture du pH-mètre : électrode (pente s, décalage off) puis réglages « zéro » et « pente »
      const meter = (pH, n) => { const m = 7 + P.s * (pH - 7) + P.off + 0.004 * Math.sin(n); return Math.round((7 + (m - 7 + st.z) * st.k / 100) * 100) / 100; };
      const reading = () => {
        if (st.m === "B") { const tp = +$("#chTp").value; return meter(tp, seed["B" + tp]); }
        if (st.m === "A") return NaN;
        return meter(pHof(P, st.m, st.V[st.m]), st.V[st.m] * 37.3 + seed[st.m]);
      };
      let drop = 0, flash = 0;   // animation de la goutte ; coloration rose fugace
      const ui = () => {
        setSeg("chm", st.m);
        $("#chBur").hidden = st.m === "B"; $("#chCal").hidden = st.m !== "B";
        $("#chZ").value = st.z; $("#chK").value = st.k;
        $("#chZv").textContent = (st.z >= 0 ? "+" : "−") + Math.abs(st.z).toFixed(3).replace(".", ","); $("#chKv").textContent = st.k.toFixed(2).replace(".", ",") + " %";
        $("#chVd").textContent = st.m === "B" ? "—" : f2(st.V[st.m]) + " mL";
        $("#chLt").textContent = st.m === "A" ? "Teinte de la solution" : "pH-mètre";
        $("#chPd").textContent = st.m === "A" ? (pHof(P, "A", st.V.A) >= 8.2 ? "rose persistant" : "incolore") : f2(reading());
        $("#chRec").textContent = st.m === "A" ? "Noter V_E (teinte rose persistante)" : st.m === "B" ? "Noter la lecture du tampon" : "Enregistrer le point (V ; pH)";
        T.draw();
      };
      document.querySelectorAll("[data-chm]").forEach(b => b.onclick = () => { st.m = b.dataset.chm; save(); T.msg(""); ui(); });
      document.querySelectorAll("[data-chv]").forEach(b => b.onclick = () => {
        const m = st.m, dv = +b.dataset.chv;
        if (m === "A" && st.finA) { T.msg("Ce dosage est terminé : clique sur « Nouveau dosage » pour une nouvelle prise d'essai.", "bad"); return; }
        if (st.V[m] + dv > VMAX + 1e-9) { T.msg("La burette est vide : clique sur « Nouveau dosage » pour la remplir.", "bad"); return; }
        const before = m === "A" ? pHof(P, "A", st.V.A) : 0;
        st.V[m] = Math.round((st.V[m] + dv) * 100) / 100; save(); drop = 1;
        if (m === "A") { const after = pHof(P, "A", st.V.A); if (after < 8.2 && VeA() - st.V.A < 1.2) flash = 1; if (before < 8.2 && after >= 8.2) T.msg("La solution devient rose et la teinte persiste à l'agitation.", "ok"); else T.msg(""); }
        ui();
      });
      $("#chRaz").onclick = () => {
        const m = st.m; st.V[m] = 0; if (m === "A") st.finA = false; save(); flash = 0;
        T.msg(m === "A" ? "Nouvelle prise d'essai : 10,0 mL de HCl + 20 mL d'eau + 2 gouttes de phénolphtaléine ; burette remplie et ajustée au zéro."
          : `Nouveau dosage : burette au zéro, 20,0 mL ${m === "C" ? "de HCl" : "d'acide éthanoïque"} + 50 mL d'eau dans le bécher.${T.rows[m].length ? " Supprime d'abord les lignes de la partie " + m + " (✕) si tu refais la courbe." : ""}`);
        ui();
      };
      $("#chZ").addEventListener("input", () => { st.z = +$("#chZ").value; save(); ui(); });
      $("#chK").addEventListener("input", () => { st.k = +$("#chK").value; save(); ui(); });
      $("#chTp").addEventListener("change", ui);
      $("#chRec").onclick = () => {
        const m = st.m;
        if (m === "A") {
          if (st.finA) { T.msg("Ce volume est déjà noté : clique sur « Nouveau dosage ».", "bad"); return; }
          if (pHof(P, "A", st.V.A) < 8.2) { T.msg("La solution est encore incolore : l'équivalence n'est pas atteinte.", "bad"); return; }
          T.add("A", { Va: 10, V: st.V.A }); if (T.rows.A.length && T.rows.A[T.rows.A.length - 1].V === st.V.A) { st.finA = true; save(); T.msg(`V_E = ${f2(st.V.A)} mL noté (essai ${T.rows.A.length}). Clique sur « Nouveau dosage » pour l'essai suivant.`, "ok"); }
          ui(); return;
        }
        if (m === "B") {
          const tp = +$("#chTp").value, L = reading();
          if (Math.abs(L - tp) > 0.015) { T.msg(`Le pH-mètre n'affiche pas ${tp},00 : tourne le bouton « ${tp === 7 ? "zéro" : "pente"} » avant de noter la lecture.`, "bad"); return; }
          T.add("B", { tp, L }); T.msg(`Lecture notée dans le tampon pH ${tp}.`, "ok"); return;
        }
        const R = T.rows[m], V = st.V[m];
        if (R.length && V <= R[R.length - 1].V + 1e-9) { T.msg(`Tu as déjà un point à ce volume (ou à un volume plus grand) : verse de la soude avant d'enregistrer.`, "bad"); return; }
        if (V > 35) { T.msg("Ce n'est plus utile d'aller au-delà de 35 mL.", "bad"); return; }
        T.add(m, { V, pH: reading() }); T.msg(`Point enregistré (partie ${m}).`, "ok"); T.draw();
      };
      $("#chNew").onclick = () => { if (T.locked()) { T.msg("Compte rendu déjà soumis : le matériel ne peut plus être changé.", "bad"); return; } newP(); st = JSON.parse(JSON.stringify(st0)); save(); T.clearRows(); ui(); T.msg("Nouveau matériel : refais l'étalonnage et les mesures."); };
      T.tick = dt => { if (drop > 0 || flash > 0) { drop = Math.max(0, drop - dt / 0.35); flash = Math.max(0, flash - dt / 0.9); T.draw(); } };

      T.draw = () => {
        const narrow = innerWidth < 600, { c, w, h } = fit($("#acidi-cv"), narrow ? 1.6 : 0.56);
        c.fillStyle = css("--plot-bg"); c.fillRect(0, 0, w, h);
        const fg = css("--fg"), mu = css("--muted"), ac = css("--accent"), m = st.m;
        const bw = narrow ? w : w * 0.42, H0 = narrow ? h * 0.56 : h;   // paillasse : à gauche (en haut sur téléphone)
        // ---- support et burette
        const bx = bw * 0.46, top = H0 * 0.05, bot = H0 * 0.56, tw = Math.max(12, bw * 0.05), y0 = top + 12, Y = v => y0 + v / VMAX * (bot - 14 - y0);
        c.fillStyle = mu; c.fillRect(bw * 0.12, top - 4, 5, H0 * 0.9 - top + 4); c.fillRect(bw * 0.12, top + H0 * 0.12, bx - bw * 0.12, 4); c.fillRect(bw * 0.06, H0 * 0.90, bw * 0.3, 7);
        if (m !== "B") {
          const V = st.V[m];
          c.fillStyle = "rgba(170,205,235,.55)"; c.fillRect(bx - tw / 2, Y(V), tw, bot - Y(V));
          c.strokeStyle = fg; c.lineWidth = 1.3; c.strokeRect(bx - tw / 2, top, tw, bot - top);
          c.lineWidth = 1; for (let v = 0; v <= VMAX; v++) { const y = Y(v), L = v % 5 ? 4 : 8; c.beginPath(); c.moveTo(bx + tw / 2 - L, y); c.lineTo(bx + tw / 2, y); c.stroke(); if (v % 10 === 0) txt(c, String(v), bx + tw / 2 + 4, y + 4, mu, "left", "alphabetic", "10px 'Fira Sans',Arial"); }
          c.strokeStyle = "#2a6f97"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(bx - tw / 2 - 3, Y(V)); c.lineTo(bx + tw / 2 + 3, Y(V)); c.stroke();
          // robinet et pointe
          c.fillStyle = fg; c.fillRect(bx - tw * 0.9, bot + 2, tw * 1.8, 5); c.fillRect(bx - 1.5, bot, 3, H0 * 0.07);
          txt(c, "NaOH 0,100 mol/L", bx - tw / 2 - 6, top + 14, mu, "right", "alphabetic", "11px 'Fira Sans',Arial");
          txt(c, f2(V) + " mL", bx + tw / 2 + 24, Y(V) + 4, "#2a6f97", "left", "alphabetic", "600 12px 'Fira Mono',monospace");
        }
        // ---- récipient
        const vy0 = H0 * 0.665, vy1 = H0 * 0.865, tip = bot + H0 * 0.07;
        let liq = "rgba(170,205,235,.45)", surf = vy0 + (vy1 - vy0) * 0.45;
        if (m === "A") {
          const pH = pHof(P, "A", st.V.A), f = 1 / (1 + Math.pow(10, 9.3 - pH)), a = Math.min(0.9, Math.max(0.85 * f, flash * 0.45));
          liq = a > 0.03 ? `rgba(226,52,146,${(0.15 + a * 0.85).toFixed(3)})` : liq;
          const nk = bw * 0.06, bs = bw * 0.24, ny = vy0 - H0 * 0.03;
          surf = vy1 - (vy1 - ny) * (0.45 + st.V.A / 220);
          const xAt = y => y < vy0 + (vy1 - vy0) * 0.15 ? nk : nk + (bs - nk) * (y - (vy0 + (vy1 - vy0) * 0.15)) / ((vy1 - vy0) * 0.85);
          c.fillStyle = liq; c.beginPath(); c.moveTo(bx - xAt(surf), surf); c.lineTo(bx + xAt(surf), surf); c.lineTo(bx + bs, vy1); c.lineTo(bx - bs, vy1); c.closePath(); c.fill();
          c.strokeStyle = fg; c.lineWidth = 1.6; c.beginPath(); c.moveTo(bx - nk, ny); c.lineTo(bx - nk, vy0 + (vy1 - vy0) * 0.15); c.lineTo(bx - bs, vy1); c.lineTo(bx + bs, vy1); c.lineTo(bx + nk, vy0 + (vy1 - vy0) * 0.15); c.lineTo(bx + nk, ny); c.stroke();
          txt(c, "HCl 10,0 mL + eau + phénolphtaléine", bx, H0 * 0.975, mu, "center", "alphabetic", "11px 'Fira Sans',Arial");
        } else if (m === "B") {
          const tp = +$("#chTp").value;
          [[7, bw * 0.3, "rgba(120,200,120,.45)"], [4, bw * 0.7, "rgba(240,140,90,.45)"]].forEach(([v, x, col]) => {
            c.fillStyle = col; c.fillRect(x - bw * 0.12, vy0 + (vy1 - vy0) * 0.35, bw * 0.24, (vy1 - vy0) * 0.65);
            c.strokeStyle = fg; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x - bw * 0.12, vy0); c.lineTo(x - bw * 0.12, vy1); c.lineTo(x + bw * 0.12, vy1); c.lineTo(x + bw * 0.12, vy0); c.stroke();
            txt(c, "tampon pH " + v, x, H0 * 0.975, mu, "center", "alphabetic", "11px 'Fira Sans',Arial");
            if (v === tp) { c.fillStyle = "#444"; c.fillRect(x - 4, vy0 - H0 * 0.28, 8, H0 * 0.28 + (vy1 - vy0) * 0.6); c.fillStyle = "#9cc3d5"; c.fillRect(x - 4, vy0 + (vy1 - vy0) * 0.45, 8, (vy1 - vy0) * 0.15); }
          });
        } else {
          const bs = bw * 0.2;
          surf = vy1 - (vy1 - vy0) * (0.55 + st.V[m] / 160);
          c.fillStyle = liq; c.fillRect(bx - bs, surf, 2 * bs, vy1 - surf);
          c.strokeStyle = fg; c.lineWidth = 1.6; c.beginPath(); c.moveTo(bx - bs, vy0 - 6); c.lineTo(bx - bs, vy1); c.lineTo(bx + bs, vy1); c.lineTo(bx + bs, vy0 - 6); c.stroke();
          c.fillStyle = "#444"; c.fillRect(bx + bs * 0.45, vy0 - H0 * 0.26, 8, H0 * 0.26 + (vy1 - vy0) * 0.75); c.fillStyle = "#9cc3d5"; c.fillRect(bx + bs * 0.45, vy1 - (vy1 - vy0) * 0.25, 8, (vy1 - vy0) * 0.12);
          c.fillStyle = mu; c.fillRect(bx - bs * 0.3, vy1 - 6, bs * 0.6, 4);
          txt(c, (m === "C" ? "HCl" : "CH₃COOH") + " 20,0 mL + 50 mL d'eau", bx, H0 * 0.975, mu, "center", "alphabetic", "11px 'Fira Sans',Arial");
        }
        if (m !== "B") { c.fillStyle = "#3d4650"; c.fillRect(bx - bw * 0.26, vy1 + 1, bw * 0.52, H0 * 0.9 - vy1 - 1); }
        if (drop > 0 && m !== "B") { const y = tip + (surf - tip) * (1 - drop); c.fillStyle = "rgba(120,170,220,.9)"; c.beginPath(); c.arc(bx, y, 3.2, 0, 7); c.fill(); }
        // ---- pH-mètre et courbe
        const rx = narrow ? 8 : bw + 10, rw = narrow ? w - 16 : w - bw - 18, ry = narrow ? H0 + 4 : 0, rh = narrow ? h - H0 - 8 : h;
        const mh = Math.min(rh * 0.34, 150), my = ry + 8;
        if (m !== "A") {
          c.fillStyle = "#2b3138"; c.fillRect(rx, my, rw, mh);
          c.fillStyle = "#c9e6b4"; const lw = Math.min(rw * 0.62, 220), lh = mh * 0.45; c.fillRect(rx + 12, my + 12, lw, lh);
          txt(c, "pH  " + f2(reading()), rx + 12 + lw / 2, my + 12 + lh * 0.7, "#1d2b14", "center", "alphabetic", `600 ${Math.round(Math.min(lh * 0.62, 34, lw / 6.5))}px 'Fira Mono',monospace`);
          txt(c, "zéro " + (st.z >= 0 ? "+" : "−") + Math.abs(st.z).toFixed(3).replace(".", ",") + "   pente " + st.k.toFixed(2).replace(".", ",") + " %", rx + 12, my + mh - 12, "#c9d3dc", "left", "alphabetic", "11px 'Fira Mono',monospace");
          c.strokeStyle = "#444"; c.lineWidth = 2; c.beginPath(); c.moveTo(narrow ? rx + rw * 0.8 : rx, narrow ? my : my + mh * 0.8); c.quadraticCurveTo(narrow ? rx + rw * 0.8 : rx - 20, narrow ? my - 40 : my + mh + 30, m === "B" ? (+$("#chTp").value === 7 ? bw * 0.3 : bw * 0.7) + 4 : bx + bw * 0.09 + 4, vy0 - H0 * 0.26); c.stroke();
        } else {
          const pH = pHof(P, "A", st.V.A), pink = pH >= 8.2;
          txt(c, "Teinte : " + (pink ? "rose persistante" : flash > 0.05 ? "rose fugace (disparaît à l'agitation)" : "incolore"), rx, ry + 24, pink ? "#c2185b" : fg, "left", "alphabetic", "600 13px 'Fira Sans',Arial");
          txt(c, "Essais notés : " + (T.rows.A.length ? T.rows.A.map(r => f2(r.V)).join(" ; ") + " mL" : "aucun"), rx, ry + 46, mu, "left", "alphabetic", "12px 'Fira Sans',Arial");
          if (st.finA) txt(c, "Dosage terminé : « Nouveau dosage » pour l'essai suivant.", rx, ry + 66, ac, "left", "alphabetic", "12px 'Fira Sans',Arial");
        }
        if (m === "C" || m === "D") {   // mini-courbe des points enregistrés
          const R = T.rows[m], gy = my + mh + 14, gh = ry + rh - gy - 22, gx = rx + 30, gw = rw - 40;
          c.strokeStyle = mu; c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh);
          const X = v => gx + v / 35 * gw, Yp = p => gy + gh - p / 14 * gh;
          for (let p = 0; p <= 14; p += gh < 170 ? 4 : 2) txt(c, String(p), gx - 4, Yp(p) + 4, mu, "right", "alphabetic", "10px 'Fira Sans',Arial");
          for (let v = 0; v <= 35; v += 5) txt(c, String(v), X(v), gy + gh + 13, mu, "center", "alphabetic", "10px 'Fira Sans',Arial");
          txt(c, "pH = f(V) — partie " + m, gx + 4, gy + 14, mu, "left", "alphabetic", "11px 'Fira Sans',Arial");
          c.fillStyle = ac; R.forEach(r => { c.beginPath(); c.arc(X(r.V), Yp(r.pH), 3, 0, 7); c.fill(); });
          c.strokeStyle = "#FFB000"; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(st.V[m]), gy); c.lineTo(X(st.V[m]), gy + gh); c.stroke(); c.setLineDash([]);
        }
      };
      ui();
    }
  });
})();
