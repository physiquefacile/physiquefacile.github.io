/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* TP d'électricité n°5 : l'oscilloscope cathodique */
(function () {
  "use strict";
  const { register, $, css, fr, store, fit, txt } = window.TPCORE;
  const R_RC = 1000;                                             // résistance du circuit RC (Ω), connue
  const SENS = [0.05, 0.1, 0.2, 0.5, 1, 2, 5];                   // V/div
  const BASE = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10];   // ms/div
  const FREQ = [50, 100, 200, 500, 1000, 2000, 5000];            // Hz (affichage du GBF)
  const seg = (id, items, cur) => `<div class="seg" role="group">${items.map(([v, l]) => `<button type="button" data-${id}="${v}" aria-pressed="${v === cur}">${l}</button>`).join("")}</div>`;
  const setSeg = (id, v) => document.querySelectorAll(`[data-${id}]`).forEach(b => b.setAttribute("aria-pressed", b.getAttribute("data-" + id) === v));
  const opt = (arr, cur, f) => arr.map(v => `<option value="${v}"${v === cur ? " selected" : ""}>${f(v)}</option>`).join("");
  const fV = v => (v < 1 ? fr(v * 1000, 0) + " mV" : fr(v, v < 10 && v % 1 ? 1 : 0) + " V") + "/div";
  const fB = v => (v < 1 ? fr(v * 1000, 0) + " µs" : fr(v, 0) + " ms") + "/div";
  const num = v => { const s = String(v ?? "").trim().replace(",", "."); return s === "" ? NaN : Number(s); };

  register({
    id: "oscillo", num: 5, disc: "Électricité", court: "Oscilloscope cathodique",
    titre: "L'oscilloscope cathodique",
    objectifs: "connaître le principe et les réglages d'un oscilloscope ; mesurer une tension continue, puis l'amplitude, la période et la fréquence d'une tension sinusoïdale ; comparer la valeur efficace calculée à l'indication d'un voltmètre ; mesurer le déphasage entre deux tensions dans un circuit RC série et en déduire la capacité du condensateur.",
    materiel: ["Oscilloscope cathodique bicourbe", "Générateur basse fréquence (GBF)", "Alimentation continue réglée par l'enseignant", "Multimètre numérique (position V~)", "Résistor R = 1 kΩ", "Condensateur de capacité C inconnue", "Câbles coaxiaux et fils de connexion"],
    theorie: `<h4>Principe de l'oscilloscope cathodique</h4>
      <p>Un canon à électrons émet un faisceau d'électrons qui frappe un écran fluorescent et y produit un point lumineux (le spot). Deux paires de plaques déviatrices dévient ce faisceau :</p>
      <ul><li>les <b>plaques verticales (Y)</b> reçoivent la tension à étudier : la déviation verticale du spot est proportionnelle à cette tension ;</li>
        <li>les <b>plaques horizontales (X)</b> reçoivent une tension en dents de scie (le <b>balayage</b>) : le spot parcourt l'écran de gauche à droite à vitesse constante, puis revient très vite à gauche.</li></ul>
      <p>Le spot trace ainsi la courbe u(t). Le <b>déclenchement</b> (synchronisation) fait démarrer chaque balayage au même point du signal, ce qui donne une image stable.</p>
      <h4>Lecture de l'écran</h4>
      <p>L'écran est quadrillé : 10 divisions horizontales et 8 verticales, chaque division étant partagée en 5 sous-divisions (0,2 div) sur les axes centraux.</p>
      <div class="formula">Tension :  U = (nombre de divisions verticales) × S        S : sensibilité verticale (V/div)
Durée   :  t = (nombre de divisions horizontales) × B    B : base de temps (s/div)</div>
      <h4>Tension sinusoïdale</h4>
      <div class="formula">u(t) = U_m sin(ωt + φ)     ω = 2πf = 2π/T
U_m = (hauteur crête à crête en div) × S / 2      U_eff = U_m / √2</div>
      <p>Un voltmètre en position alternative (V~) indique la <b>valeur efficace</b> U<sub>eff</sub>.</p>
      <h4>Couplages de l'entrée</h4>
      <ul><li><b>DC</b> : le signal complet est affiché (composantes continue et alternative) ;</li><li><b>AC</b> : un condensateur d'entrée supprime la composante continue ;</li><li><b>GND</b> : l'entrée est reliée à la masse ; le trait horizontal obtenu repère le niveau 0 V.</li></ul>
      <h4>Déphasage dans un circuit RC série</h4>
      <p>Le GBF alimente R et C en série. La voie 1 reçoit la tension u<sub>G</sub> du GBF, la voie 2 la tension u<sub>R</sub> aux bornes de R, image du courant i. Le courant est <b>en avance</b> sur la tension du générateur d'un angle φ tel que :</p>
      <div class="formula">tan φ = 1 / (R C ω)      ⟹      C = 1 / (R ω tan φ)</div>
      <p>Si les deux courbes sont décalées d'une durée τ et ont pour période T :</p>
      <div class="formula">φ = 2π τ / T  (rad)     soit     φ = 360° × τ / T</div>`,
    protocole: `<h4>Réglages préliminaires</h4><ol>
        <li>Mets l'entrée de la voie 1 sur <b>GND</b> : un trait horizontal apparaît. Avec le bouton de position verticale, place-le exactement sur l'axe central : c'est la référence 0 V.</li>
        <li>Choisis ensuite le couplage adapté (DC pour une tension continue).</li></ol>
      <h4>Partie A — Mesure d'une tension continue</h4><ol>
        <li>Montage « Alimentation continue ». En couplage <b>GND</b>, place la référence 0 V sur la <b>ligne du bas</b> de l'écran (position −4 div) : la tension étant positive, tu disposes ainsi des 8 divisions de hauteur.</li>
        <li>Passe en couplage <b>DC</b>. Choisis une sensibilité telle que le trait reste sur l'écran avec la plus grande déviation possible.</li>
        <li>Compte la déviation d (en divisions, au 0,1 div près) entre le trait et la référence 0 V. Saisis-la puis enregistre (Partie A).</li>
        <li>Recommence avec au moins deux autres sensibilités. Calcule E = d × S pour chaque mesure.</li></ol>
      <h4>Partie B — Tension sinusoïdale du GBF</h4><ol>
        <li>Montage « GBF seul ». Affiche successivement les fréquences 100, 200, 500, 1000 et 2000 Hz sur le GBF.</li>
        <li>Pour chaque fréquence, règle la sensibilité pour que la courbe occupe le plus de hauteur possible sans sortir de l'écran, et la base de temps pour qu'<b>une période entière</b> soit la plus large possible (au plus 10 div).</li>
        <li>Mesure la hauteur crête à crête (en div) et la largeur d'une période (en div) ; saisis-les puis enregistre (Partie B). L'indication du voltmètre est relevée automatiquement.</li>
        <li>Calcule U<sub>m</sub>, U<sub>eff</sub>, T et f. Compare f mesurée et f affichée, U<sub>eff</sub> calculée et U<sub>eff</sub> lue au voltmètre.</li></ol>
      <h4>Partie C — Déphasage dans le circuit RC</h4><ol>
        <li>Montage « Circuit RC » : voie 1 = u<sub>G</sub> (GBF), voie 2 = u<sub>R</sub>. Place les deux références 0 V sur l'axe central.</li>
        <li>Pour f affichée = 200, 500, 1000 et 2000 Hz, mesure la période T (en div) et le décalage τ (en div) entre deux passages par zéro <b>dans le même sens</b> des deux courbes ; enregistre (Partie C).</li>
        <li>Calcule φ = 360° × τ/T pour chaque fréquence, puis la capacité C = 1/(R ω tan φ), avec ω calculée à partir de ta période mesurée.</li>
        <li>Facultatif : passe en mode <b>XY</b> et observe l'ellipse obtenue.</li></ol>`,
    precautions: `<ul><li>Ne laisse jamais un spot immobile et très lumineux sur l'écran : il brûlerait la couche fluorescente.</li>
      <li>Vérifie toujours la position de la référence 0 V (couplage GND) avant une mesure de tension continue.</li>
      <li>Les masses de l'oscilloscope et du GBF sont reliées : dans le circuit RC, la masse commune doit être au point commun de R et du GBF.</li>
      <li>Précision de lecture : environ ±0,1 div. Pour réduire l'erreur relative, choisis les réglages qui donnent la plus grande image possible.</li>
      <li>Incertitude : ΔU/U = Δd/d + ΔS/S ; Δf/f = ΔT/T.</li></ul>`,
    preparation: ["Explique le rôle du balayage et du déclenchement d'un oscilloscope.", "Un signal sinusoïdal occupe 5,2 div crête à crête avec S = 1 V/div et une période de 4 div avec B = 0,5 ms/div : calcule U_m, U_eff, T et f.", "Montre que dans un circuit RC série, tan φ = 1/(RCω), et que le courant est en avance sur la tension du générateur.", "Pour R = 1 kΩ, C = 0,22 µF et f = 500 Hz, calcule φ et le décalage τ correspondant."],
    hint: "Lis toi-même les divisions sur l'écran, comme en salle de TP : chaque grand carreau vaut 1 division, les petits traits des axes valent 0,2 division.",
    controls: `<h3>Montage</h3>
      ${seg("osm", [["A", "Alimentation"], ["B", "GBF seul"], ["C", "Circuit RC"]], "A")}
      <div class="ctl" id="osFw"><label for="osF">GBF : fréquence affichée</label><select id="osF">${opt(FREQ, 500, v => v + " Hz")}</select></div>
      <h3>Voie 1 (CH1)</h3>
      <div class="ctl"><label for="osS1">Sensibilité</label><select id="osS1">${opt(SENS, 1, fV)}</select></div>
      ${seg("osc", [["DC", "DC"], ["AC", "AC"], ["GND", "GND"]], "DC")}
      <div class="ctl"><label for="osP1">Position verticale <b id="osP1v"></b></label><input id="osP1" type="range" min="-4" max="4" step="0.1" value="0"></div>
      <div id="osCh2"><h3>Voie 2 (CH2)</h3>
      <div class="ctl"><label for="osS2">Sensibilité</label><select id="osS2">${opt(SENS, 1, fV)}</select></div>
      <div class="ctl"><label for="osP2">Position verticale <b id="osP2v"></b></label><input id="osP2" type="range" min="-4" max="4" step="0.1" value="0"></div></div>
      <h3 id="osBh">Balayage</h3>
      <div class="ctl" id="osBw"><label for="osB">Base de temps</label><select id="osB">${opt(BASE, 0.5, fB)}</select></div>
      <div class="ctl" id="osXw"><label for="osX">Position horizontale <b id="osXv"></b></label><input id="osX" type="range" min="0" max="5" step="0.1" value="0"></div>
      <div id="osXYw">${seg("osxy", [["YT", "Mode YT (temps)"], ["XY", "Mode XY"]], "YT")}</div>
      <div id="osMw"><h3>Multimètre (V~)</h3><dl class="lcd"><dt>Tension efficace</dt><dd id="osV">—</dd></dl></div>
      <h3>Ta lecture sur l'écran</h3>
      <div class="ctl" id="osRA"><label for="osD">Déviation d par rapport à 0 V (div)</label><input id="osD" type="text" inputmode="decimal" autocomplete="off"></div>
      <div class="ctl" id="osRB1"><label for="osY">Hauteur crête à crête (div)</label><input id="osY" type="text" inputmode="decimal" autocomplete="off"></div>
      <div class="ctl" id="osRB2"><label for="osT">Largeur d'une période (div)</label><input id="osT" type="text" inputmode="decimal" autocomplete="off"></div>
      <div class="ctl" id="osRC1"><label for="osTau">Décalage τ entre les deux courbes (div)</label><input id="osTau" type="text" inputmode="decimal" autocomplete="off"></div>
      <button type="button" class="btn primary sm" id="osRec">Enregistrer la lecture</button>
      <button type="button" class="btn sm" id="osNew">Changer de matériel</button>`,
    init(T) {
      let P = store.get("osc_par", null);
      const newP = () => { P = { E: 1.5 + Math.random() * 4.5, Um: 2 + Math.random() * 4, kf: 1 + (Math.random() - 0.5) * 0.1, C: [0.1, 0.15, 0.22, 0.33][Math.floor(Math.random() * 4)] * (1 + (Math.random() * 2 - 1) * 0.05) }; store.set("osc_par", P); };
      if (!P) newP();
      const st = { mode: "A", cpl: "DC", xy: "YT" };
      const g = () => ({ f: +$("#osF").value, S1: +$("#osS1").value, S2: +$("#osS2").value, B: +$("#osB").value, p1: +$("#osP1").value, p2: +$("#osP2").value, px: +$("#osX").value });
      const omega = f => 2 * Math.PI * f * P.kf;
      const phi = f => Math.atan(1 / (R_RC * P.C * 1e-6 * omega(f)));
      const v1 = (t, f) => st.cpl === "GND" ? 0 : st.mode === "A" ? (st.cpl === "AC" ? 0 : P.E) : P.Um * Math.sin(omega(f) * t);
      const v2 = (t, f) => P.Um * Math.cos(phi(f)) * Math.sin(omega(f) * t + phi(f));
      const ui = () => {
        const s = g(), m = st.mode;
        $("#osP1v").textContent = fr(s.p1, 1) + " div"; $("#osP2v").textContent = fr(s.p2, 1) + " div"; $("#osXv").textContent = fr(s.px, 1) + " div";
        $("#osFw").hidden = m === "A"; $("#osCh2").hidden = m !== "C"; $("#osXYw").hidden = m !== "C"; $("#osMw").hidden = m !== "B";
        $("#osBw").hidden = m === "A"; $("#osBh").hidden = m === "A"; $("#osXw").hidden = m === "A";
        $("#osRA").hidden = m !== "A"; $("#osRB1").hidden = m !== "B"; $("#osRB2").hidden = m === "A"; $("#osRC1").hidden = m !== "C";
        $("#osV").textContent = fr(Math.round(P.Um / Math.SQRT2 * 100) / 100, 2) + " V";
        if (m !== "C" && st.xy === "XY") { st.xy = "YT"; setSeg("osxy", "YT"); }
        T.draw();
      };
      document.querySelectorAll("[data-osm]").forEach(b => b.onclick = () => { st.mode = b.dataset.osm; setSeg("osm", st.mode); ["#osD", "#osY", "#osT", "#osTau"].forEach(s => $(s).value = ""); ui(); T.msg(""); });
      document.querySelectorAll("[data-osc]").forEach(b => b.onclick = () => { st.cpl = b.dataset.osc; setSeg("osc", st.cpl); ui(); });
      document.querySelectorAll("[data-osxy]").forEach(b => b.onclick = () => { st.xy = b.dataset.osxy; setSeg("osxy", st.xy); ui(); });
      ["#osF", "#osS1", "#osS2", "#osB", "#osP1", "#osP2", "#osX"].forEach(s => $(s).addEventListener("input", ui));
      $("#osRec").onclick = () => {
        const s = g(), m = st.mode;
        if (st.xy === "XY") { T.msg("Repasse en mode YT pour faire les mesures.", "bad"); return; }
        if (m === "A") {
          if (st.cpl !== "DC") { T.msg(st.cpl === "AC" ? "En couplage AC, la composante continue est supprimée : passe en DC." : "L'entrée est à la masse (GND) : passe en DC pour mesurer.", "bad"); return; }
          if (Math.abs(P.E / s.S1 + s.p1) > 4) { T.msg("Le trait est hors de l'écran : choisis une sensibilité plus grande (plus de V/div) ou ramène la référence au centre.", "bad"); return; }
          const d = num($("#osD").value); if (!(d > 0 && d <= 8)) { T.msg("Saisis la déviation lue, en divisions (par exemple 3,4).", "bad"); return; }
          T.add("A", { S: s.S1, d }); $("#osD").value = ""; T.msg("Lecture enregistrée (partie A).", "ok"); return;
        }
        if (st.cpl === "GND") { T.msg("L'entrée de la voie 1 est à la masse (GND) : choisis DC ou AC.", "bad"); return; }
        const Tdiv = 1000 / (s.f * P.kf) / s.B;
        if (Tdiv > 10) { T.msg("Une période entière ne tient pas sur l'écran : choisis une base de temps plus grande (plus de ms/div).", "bad"); return; }
        if (Tdiv < 1) { T.msg("La période est trop serrée pour être lue précisément : choisis une base de temps plus petite.", "bad"); return; }
        const x = num($("#osT").value); if (!(x > 0 && x <= 10)) { T.msg("Saisis la largeur d'une période, en divisions.", "bad"); return; }
        if (m === "B") {
          if (2 * P.Um / s.S1 > 8.05) { T.msg("La courbe dépasse l'écran en hauteur : choisis une sensibilité plus grande (plus de V/div).", "bad"); return; }
          const y = num($("#osY").value); if (!(y > 0 && y <= 8)) { T.msg("Saisis la hauteur crête à crête, en divisions.", "bad"); return; }
          T.add("B", { fa: s.f, S: s.S1, ypp: y, B: s.B, x, V: Math.round(P.Um / Math.SQRT2 * 100) / 100 });
          ["#osY", "#osT"].forEach(q => $(q).value = ""); T.msg("Lecture enregistrée (partie B).", "ok"); return;
        }
        const tau = num($("#osTau").value); if (!(tau >= 0 && tau < x)) { T.msg("Saisis le décalage τ entre les deux courbes, en divisions (plus petit qu'une période).", "bad"); return; }
        T.add("C", { fa: s.f, B: s.B, tau, Tdiv: x });
        ["#osT", "#osTau"].forEach(q => $(q).value = ""); T.msg("Lecture enregistrée (partie C).", "ok");
      };
      $("#osNew").onclick = () => { if (T.locked()) { T.msg("Compte rendu déjà soumis : le matériel ne peut plus être changé.", "bad"); return; } newP(); T.clearRows(); ui(); T.msg("Nouveau matériel : refais les mesures."); };

      T.draw = () => {
        const { c, w, h } = fit($("#oscillo-cv"), innerWidth < 600 ? 0.95 : 0.7); const s = g();
        c.fillStyle = "#20262c"; c.fillRect(0, 0, w, h);
        const u = Math.floor(Math.min((w - 24) / 10, (h - 58) / 8)), W = 10 * u, H = 8 * u, x0 = Math.round((w - W) / 2), y0 = 12;
        // écran
        c.fillStyle = "#06140b"; c.fillRect(x0 - 4, y0 - 4, W + 8, H + 8);
        c.strokeStyle = "rgba(120,200,140,.28)"; c.lineWidth = 1;
        for (let i = 0; i <= 10; i++) { c.beginPath(); c.moveTo(x0 + i * u + .5, y0); c.lineTo(x0 + i * u + .5, y0 + H); c.stroke(); }
        for (let j = 0; j <= 8; j++) { c.beginPath(); c.moveTo(x0, y0 + j * u + .5); c.lineTo(x0 + W, y0 + j * u + .5); c.stroke(); }
        c.strokeStyle = "rgba(150,230,170,.55)";
        for (let k = 0; k <= 50; k++) { const x = x0 + k * u / 5; c.beginPath(); c.moveTo(x + .5, y0 + H / 2 - 4); c.lineTo(x + .5, y0 + H / 2 + 4); c.stroke(); }
        for (let k = 0; k <= 40; k++) { const y = y0 + k * u / 5; c.beginPath(); c.moveTo(x0 + W / 2 - 4, y + .5); c.lineTo(x0 + W / 2 + 4, y + .5); c.stroke(); }
        const X = d => x0 + d * u, Y = d => y0 + H / 2 - d * u;
        c.save(); c.beginPath(); c.rect(x0, y0, W, H); c.clip();
        const trace = (fn, col) => { c.strokeStyle = col; c.lineWidth = 2; c.shadowColor = col; c.shadowBlur = 6; c.beginPath(); for (let i = 0; i <= 600; i++) { const xd = i / 60, [a, b] = fn(xd); i ? c.lineTo(X(a), Y(b)) : c.moveTo(X(a), Y(b)); } c.stroke(); c.shadowBlur = 0; };
        if (st.mode === "C" && st.xy === "XY") {
          trace(xd => { const t = xd / 10 / (s.f * P.kf); return [5 + v1(t, s.f) / s.S1, v2(t, s.f) / s.S2 + s.p2]; }, "#7CFF8A");
        } else {
          const tOf = xd => (xd - s.px) * s.B / 1000;
          trace(xd => [xd, v1(tOf(xd), s.f) / s.S1 + s.p1], "#7CFF8A");
          if (st.mode === "C") trace(xd => [xd, v2(tOf(xd), s.f) / s.S2 + s.p2], "#FFD166");
        }
        c.restore();
        // légendes
        const mu = "#c9d3dc", ly = y0 + H + 22;
        txt(c, `CH1 : ${fV(s.S1)} ${st.cpl}`, x0, ly, "#7CFF8A", "left", "alphabetic", "600 12px 'Fira Mono',monospace");
        if (st.mode === "C") txt(c, `CH2 : ${fV(s.S2)} DC`, x0 + W * 0.36, ly, "#FFD166", "left", "alphabetic", "600 12px 'Fira Mono',monospace");
        if (st.mode !== "A") txt(c, st.xy === "XY" ? "mode XY" : `Base : ${fB(s.B)}`, x0 + W, ly, mu, "right", "alphabetic", "600 12px 'Fira Mono',monospace");
        txt(c, st.mode === "A" ? "Alimentation continue → CH1" : st.mode === "B" ? `GBF : ${s.f} Hz affichés → CH1` : `GBF ${s.f} Hz : u_G → CH1, u_R → CH2 (R = 1 kΩ)`, x0, ly + 18, mu, "left", "alphabetic", "12px 'Fira Sans',Arial");
      };
      ui();
    }
  });
})();
