/* TP n°6 : mesures électriques — utilisation du multimètre numérique (voltmètre, ampèremètre, ohmmètre) */
(function () {
  "use strict";
  const { register, $, fr, gauss, store } = window.TPCORE;

  /* calibres d'un multimètre 2000 points (3 ½ digits). Unités de base : V (tension), mA (intensité), Ω (résistance).
     d : résolution (valeur d'un digit) ; k, u, dec : conversion pour l'affichage ; r : résistance interne de l'ampèremètre (Ω) ; s : borne */
  const CAL = {
    V: [{ n: "200 mV", d: 1e-4, k: 1000, u: "mV", dec: 1 }, { n: "2 V", d: 1e-3, k: 1, u: "V", dec: 3 }, { n: "20 V", d: 0.01, k: 1, u: "V", dec: 2 }, { n: "200 V", d: 0.1, k: 1, u: "V", dec: 1 }, { n: "600 V", d: 1, k: 1, u: "V", dec: 0, max: 600 }],
    A: [{ n: "200 µA", d: 1e-4, k: 1000, u: "µA", dec: 1, r: 1000, s: "mA" }, { n: "2 mA", d: 1e-3, k: 1, u: "mA", dec: 3, r: 100, s: "mA" }, { n: "20 mA", d: 0.01, k: 1, u: "mA", dec: 2, r: 10, s: "mA" }, { n: "200 mA", d: 0.1, k: 1, u: "mA", dec: 1, r: 1, s: "mA" }, { n: "10 A", d: 10, k: 0.001, u: "A", dec: 2, r: 0.01, s: "10A", max: 10000 }],
    O: [{ n: "200 Ω", d: 0.1, k: 1, u: "Ω", dec: 1 }, { n: "2 kΩ", d: 1, k: 1e-3, u: "kΩ", dec: 3 }, { n: "20 kΩ", d: 10, k: 1e-3, u: "kΩ", dec: 2 }, { n: "200 kΩ", d: 100, k: 1e-3, u: "kΩ", dec: 1 }, { n: "2 MΩ", d: 1000, k: 1e-6, u: "MΩ", dec: 3 }]
  };
  const PREC = { V: "±(0,5 % + 2 D)", A: "±(1,0 % + 2 D) ; calibre 10 A : ±(2 % + 5 D)", O: "±(0,8 % + 3 D)" };
  const FN = { OFF: "Arrêt", V: "Voltmètre continu (V⎓)", A: "Ampèremètre continu (A⎓)", O: "Ohmmètre (Ω)" };
  const SRC = { 1: "Pile 1,5 V", 2: "Pile 9 V", 3: "Capteur (faible tension)" };
  const RES = { a: "R₁", c: "R₂", d: "R₃" };
  const RPILE = 1.5, RV = 1e7;   // résistance interne de la pile 9 V ; résistance d'entrée du voltmètre
  const COL = { noir: "#111", marron: "#7a4a1f", rouge: "#c62828", orange: "#ef7d00", jaune: "#f2c200", vert: "#2e7d32", bleu: "#1565c0", violet: "#6a1b9a", gris: "#8a8a8a", blanc: "#f5f5f5", or: "#c9a227" };
  const NOMC = ["noir", "marron", "rouge", "orange", "jaune", "vert", "bleu", "violet", "gris", "blanc"];
  const bands = v => { const e = Math.floor(Math.log10(v)) - 1, d = Math.round(v / 10 ** e); return [NOMC[Math.floor(d / 10)], NOMC[d % 10], NOMC[e], "or"]; };
  const lim = c => Math.min(c.max || Infinity, 2000 * c.d);                 // au-delà : dépassement (OL)
  const lcdTxt = (c, x) => (x * c.k).toFixed(c.dec);                        // texte affiché (point décimal, comme sur l'appareil)
  const fmtL = (f, c, x) => { const C = CAL[f][c]; return fr(x * C.k, C.dec) + " " + C.u; };
  const seg = (id, items, cur) => `<div class="seg ms-seg" role="group">${items.map(([v, l]) => `<button type="button" data-${id}="${v}" aria-pressed="${v === cur}">${l}</button>`).join("")}</div>`;
  const setSeg = (id, v) => document.querySelectorAll(`[data-${id}]`).forEach(b => b.setAttribute("aria-pressed", b.getAttribute("data-" + id) === String(v)));
  window.TP_MES = { CAL, SRC, RES, fmtL };
  if (!document.getElementById("ms-style")) {
    const st = document.createElement("style"); st.id = "ms-style";
    st.textContent = `.ms-seg{flex-wrap:wrap}.ms-seg button{min-width:30%}
.ms-board svg{width:100%;height:auto;display:block;background:var(--plot-bg);border-radius:10px;user-select:none}
.ms-board .pos{cursor:pointer}.ms-board .pos:hover circle{stroke:var(--saff);stroke-width:3}
.dtab{border-collapse:collapse;font-size:.86rem;margin:6px 0 10px;display:block;overflow-x:auto}.dtab th,.dtab td{border:1px solid var(--line);padding:4px 7px;white-space:nowrap;text-align:left}.dtab th{background:var(--tint)}
.ms-board .sock{cursor:pointer}.ms-board .sock:hover .ring{stroke:var(--saff);stroke-width:4}`;
    document.head.appendChild(st);
  }

  register({
    id: "mesures", num: 6, disc: "Électricité", court: "Mesures électriques",
    titre: "Mesures électriques : utilisation du multimètre",
    objectifs: "utiliser un multimètre numérique en voltmètre, en ampèremètre et en ohmmètre ; choisir la fonction, la borne et le calibre adaptés ; brancher correctement l'appareil (dérivation ou série) ; évaluer l'incertitude d'une mesure à partir de la précision donnée par le constructeur et écrire correctement un résultat.",
    materiel: ["Multimètre numérique 2000 points (3 ½ digits)", "Pile 1,5 V, pile 9 V et capteur de faible tension", "Résistors R₁, R₂ et R₃ (code des couleurs)", "Fils et pointes de touche"],
    theorie: `<h4>Le multimètre numérique</h4><p>Un même appareil sert de <b>voltmètre</b> (V⎓), d'<b>ampèremètre</b> (A⎓) et d'<b>ohmmètre</b> (Ω). On choisit la fonction et le <b>calibre</b> avec le commutateur, et la <b>borne</b> où l'on branche la pointe rouge : <b>VΩ</b> pour les tensions et les résistances, <b>mA</b> pour les intensités jusqu'à 200 mA (protégée par un fusible), <b>10 A</b> pour les fortes intensités. La pointe noire est toujours sur <b>COM</b>.</p>
      <h4>Calibre, résolution et dépassement</h4><p>Un multimètre « 2000 points » affiche au plus 1999 unités. Le <b>calibre</b> est la plus grande valeur mesurable ; la <b>résolution D</b> (un « digit ») est la plus petite variation affichée, c'est-à-dire la valeur d'une unité du <b>dernier chiffre affiché</b>. Sur le calibre 20 V, l'appareil affiche par exemple 9.27 : D = 0,01 V. En général D = calibre / 2000, <b>sauf</b> sur les calibres 600 V et 10 A, limités par l'appareil : on y lit 9 V (D = 1 V) et 0.01 A (D = 0,01 A = 10 mA).</p>
      <table class="dtab"><tr><th>Voltmètre</th><td>200 mV : D = 0,1 mV = 0,0001 V</td><td>2 V : 0,001 V</td><td>20 V : 0,01 V</td><td>200 V : 0,1 V</td><td>600 V : 1 V</td></tr>
      <tr><th>Ampèremètre</th><td>200 µA : D = 0,1 µA = 0,0001 mA</td><td>2 mA : 0,001 mA</td><td>20 mA : 0,01 mA</td><td>200 mA : 0,1 mA</td><td>10 A : 0,01 A = 10 mA</td></tr>
      <tr><th>Ohmmètre</th><td>200 Ω : D = 0,1 Ω</td><td>2 kΩ : 1 Ω</td><td>20 kΩ : 10 Ω</td><td>200 kΩ : 100 Ω</td><td>2 MΩ : 1000 Ω</td></tr></table>
      <p>Si la grandeur dépasse le calibre, l'appareil affiche <b>OL</b> (ou un « 1 » seul à gauche) : il faut prendre un calibre plus grand. On commence toujours par le plus grand calibre, puis on descend.</p>
      <h4>Précision et incertitude</h4><p>Le constructeur donne la précision sous la forme ±(p % de la lecture + n digits). L'incertitude absolue sur une lecture L est donc</p>
      <div class="formula">ΔX = p % · L + n · D</div>
      <p>Pour cet appareil : tensions ${PREC.V} ; intensités ${PREC.A} ; résistances ${PREC.O}.</p>
      <p>L'incertitude relative ΔX/X est la plus petite quand la lecture utilise le plus de chiffres : <b>le meilleur calibre est le plus petit calibre qui ne donne pas de dépassement</b>.</p>
      <h4>Branchement</h4><ul><li><b>Voltmètre en dérivation</b>, aux bornes du dipôle (résistance d'entrée 10 MΩ : il ne perturbe presque pas le circuit). Pointe rouge (VΩ) du côté du +.</li>
        <li><b>Ampèremètre en série</b> : on ouvre le circuit et on y insère l'appareil, le courant entrant par la borne mA (ou 10 A). Sa résistance interne r<sub>A</sub> est petite mais non nulle et dépend du calibre (200 µA : 1 kΩ ; 2 mA : 100 Ω ; 20 mA : 10 Ω ; 200 mA : 1 Ω ; 10 A : 0,01 Ω). Branché en dérivation, il court-circuite le dipôle et fait fondre son fusible.</li>
        <li><b>Ohmmètre</b> : le résistor doit être <b>hors circuit</b>, sans aucune tension à ses bornes ; l'appareil fournit lui-même un petit courant.</li></ul>
      <p>Une valeur négative signifie que les pointes sont inversées.</p>
      <h4>Écriture d'un résultat</h4><p>On arrondit ΔX à 1 (ou 2) chiffre(s) significatif(s), par excès, puis on arrondit X au même rang : U = (9,27 ± 0,07) V.</p>
      <h4>Code des couleurs</h4><p>1<sup>er</sup> anneau : 1<sup>er</sup> chiffre ; 2<sup>e</sup> anneau : 2<sup>e</sup> chiffre ; 3<sup>e</sup> anneau : puissance de 10 ; 4<sup>e</sup> anneau or : tolérance ±5 %.<br>0 noir • 1 marron • 2 rouge • 3 orange • 4 jaune • 5 vert • 6 bleu • 7 violet • 8 gris • 9 blanc.</p>`,
    protocole: `<h4>Partie A — Mesure de tensions (voltmètre)</h4><ol>
        <li>Choisis « Tension d'une source », puis la pile 1,5 V. Mets le commutateur sur V⎓, calibre 600 V, et la pointe rouge sur VΩ.</li>
        <li>Lis l'affichage, enregistre, puis descends de calibre en calibre jusqu'au dépassement (OL). Enregistre chaque lecture qui ne dépasse pas.</li>
        <li>Recommence avec la pile 9 V et avec le capteur. Fais au moins 2 mesures par source.</li>
        <li>Pour chaque ligne, remplis la résolution D, l'incertitude ΔU et l'incertitude relative ΔU/U.</li></ol>
      <h4>Partie B — Mesure d'une intensité (ampèremètre)</h4><ol>
        <li>Choisis « Intensité dans un circuit » : la pile 9 V alimente le résistor R₂. Place l'ampèremètre <b>en série</b>.</li>
        <li>Commutateur sur A⎓ ; pointe rouge sur la borne 10 A pour le calibre 10 A, sur mA pour les autres. Mesure I sur les calibres 10 A, 200 mA, 20 mA, puis 2 mA.</li>
        <li>Enregistre au moins 3 mesures et remplis D, ΔI et ΔI/I.</li></ol>
      <h4>Partie C — Mesure de résistances (ohmmètre)</h4><ol>
        <li>Choisis « Résistance d'un résistor » : le résistor est hors du circuit. Commutateur sur Ω, pointe rouge sur VΩ.</li>
        <li>Lis la valeur nominale de chaque résistor avec le code des couleurs, puis mesure R₁, R₂ et R₃ sur le meilleur calibre (et sur un autre calibre pour comparer).</li>
        <li>Enregistre au moins 4 mesures ; remplis la valeur nominale, D, ΔR et l'écart à la valeur nominale.</li></ol>
      <h4>Exploitation</h4><ol><li>Calcule I = E₂/R₂ avec ta mesure de la pile 9 V (partie A) et de R₂ (partie C), et compare-la à l'intensité mesurée en partie B.</li></ol>`,
    precautions: `<ul><li>Avant chaque mesure : bonne <b>fonction</b>, bonne <b>borne</b>, puis le <b>plus grand calibre</b> ; on descend ensuite.</li>
      <li>Ne branche jamais un ampèremètre aux bornes d'une source ou d'un dipôle : court-circuit, fusible fondu (bouton « Remplacer le fusible »).</li>
      <li>Ne mesure jamais une résistance dans un circuit alimenté.</li>
      <li>Ne change pas de fonction pendant que les pointes touchent le circuit.</li>
      <li>Incertitude : ΔX = p %·L + n·D ; arrondis ΔX par excès à 1 ou 2 chiffres significatifs.</li></ul>`,
    preparation: ["Quelle est la résolution d'un multimètre 2000 points sur les calibres 2 V, 20 V et 200 mA ?", "Une pile de 9,3 V est mesurée sur le calibre 20 V (précision ±(0,5 % + 2 D)). Calcule ΔU et écris le résultat.", "Fais le schéma d'un circuit pile + résistor avec l'ampèremètre en série et le voltmètre en dérivation aux bornes du résistor.", "Pourquoi un ampèremètre branché en dérivation provoque-t-il un court-circuit ?", "Lis la valeur nominale d'un résistor jaune-violet-rouge-or."],
    hint: "Tourne le commutateur (touche une position du cadran), choisis la borne de la pointe rouge (touche une borne) et le montage dans le panneau. L'afficheur montre la lecture : OL signifie un dépassement du calibre.",
    controls: `<h3>Montage</h3>${seg("msp", [["A", "Tension d'une source"], ["B", "Intensité dans un circuit"], ["C", "Résistance d'un résistor"]], "A")}
      <div id="msSrc" class="ctl">${seg("mss", [["1", "Pile 1,5 V"], ["2", "Pile 9 V"], ["3", "Capteur"]], "1")}</div>
      <div id="msBr" class="ctl" hidden>${seg("msb", [["serie", "Ampèremètre en série"], ["deriv", "En dérivation sur R₂"]], "serie")}</div>
      <div id="msRes" class="ctl" hidden>${seg("msr", [["a", "R₁"], ["c", "R₂"], ["d", "R₃"]], "a")}</div>
      <h3>Commutateur</h3>${seg("msf", [["OFF", "Arrêt"], ["V", "V⎓"], ["A", "A⎓"], ["O", "Ω"]], "OFF")}
      <div id="msCal" class="ctl"></div>
      <h3>Pointe rouge sur la borne</h3>${seg("mso", [["VO", "VΩ"], ["mA", "mA"], ["10A", "10 A"]], "VO")}
      <div class="row"><button type="button" class="btn sm" id="msInv">Inverser les pointes</button><button type="button" class="btn sm" id="msFuse">Remplacer le fusible</button></div>
      <dl class="lcd"><dt>Afficheur</dt><dd id="msLcd">—</dd><dt>Fonction</dt><dd id="msFn">—</dd><dt>Résolution D</dt><dd id="msD">—</dd></dl>
      <button type="button" class="btn primary sm" id="msRec">Enregistrer la mesure</button>
      <button type="button" class="btn sm" id="msNew">Nouveau matériel</button>`,
    parts: [
      { key: "A", titre: "Mesure de tensions", cols: ["n°", "Source", "Calibre", "Lecture U"], cells: (r, i) => [i + 1, SRC[r.s], CAL.V[r.c].n, fmtL("V", r.c, r.L)] },
      { key: "B", titre: "Mesure d'une intensité", cols: ["n°", "Calibre", "Lecture I"], cells: (r, i) => [i + 1, CAL.A[r.c].n, fmtL("A", r.c, r.L)] },
      { key: "C", titre: "Mesure de résistances", cols: ["n°", "Résistor", "Calibre", "Lecture R"], cells: (r, i) => [i + 1, RES[r.k], CAL.O[r.c].n, fmtL("O", r.c, r.L)] }
    ],
    questions: ["Partie A : pour chaque source, quel calibre donne la mesure la plus précise ? Énonce la règle de choix du calibre.", "Que signifie l'affichage OL ? Sur quels calibres l'as-tu obtenu ?", "Partie B : compare les lectures de I sur les calibres 10 A, 200 mA et 20 mA. Pourquoi le calibre 10 A est-il inadapté ici ?", "Compare I mesurée et I = E₂/R₂ calculée : explique le petit écart (résistance interne de l'ampèremètre et de la pile).", "Partie C : les résistances mesurées sont-elles dans la tolérance du code des couleurs (±5 %) ? Écris chaque résultat sous la forme R = (… ± …) Ω."],
    init(T) {
      let P = store.get("mes_par", null);
      const newSet = () => {
        const pick = a => a[Math.floor(Math.random() * a.length)], tol = () => 1 + (Math.random() * 2 - 1) * 0.045, cal = () => [0, 1, 2, 3, 4].map(() => (Math.random() * 2 - 1) * 0.0025);
        const na = pick([33, 39, 47, 56, 68, 82]), nc = pick([1000, 1200, 1500, 1800, 2200]), nd = pick([47000, 68000, 100000, 150000, 330000]);
        P = { E1: 1.45 + Math.random() * 0.17, E2: 8.6 + Math.random() * 1.0, E3: 0.105 + Math.random() * 0.08, R: { a: { nom: na, R: na * tol() }, c: { nom: nc, R: nc * tol() }, d: { nom: nd, R: nd * tol() } }, cal: { V: cal(), A: cal(), O: cal() } };
        store.set("mes_par", P);
      };
      if (!P || !P.R || !P.cal) newSet();
      const S = Object.assign({ p: "A", s: "1", b: "serie", k: "a", f: "OFF", c: 4, o: "VO", inv: false, fuse: true }, store.get("mes_etat", {}));
      const saveS = () => store.set("mes_etat", S);
      let L = null;   // lecture courante

      /* valeur vraie vue par l'appareil et message éventuel */
      function physique() {
        const f = S.f, C = f === "OFF" ? null : CAL[f][S.c], sg = S.inv ? -1 : 1;
        if (f === "OFF") return { off: true, msg: "Le multimètre est à l'arrêt : tourne le commutateur." };
        const sockOK = f === "A" ? S.o === C.s : S.o === "VO";
        const sockMsg = f === "A" ? (C.s === "10A" ? "Pour le calibre 10 A, la pointe rouge doit être sur la borne 10 A." : "Pour les calibres en mA, la pointe rouge doit être sur la borne mA.") : "Pour mesurer une tension ou une résistance, la pointe rouge doit être sur la borne VΩ.";
        if (f === "A" && S.o === "mA" && !S.fuse) return { x: 0, msg: "Le fusible de la borne mA est fondu : l'ampèremètre indique 0. Remplace le fusible.", bad: true };
        if (S.p === "A") {   // pointes aux bornes d'une source
          const E = P["E" + S.s];
          if (f === "V") return sockOK ? { x: sg * E, ok: true } : { x: 0, msg: sockMsg, bad: true };
          if (f === "A") {
            if (S.o === "VO") return { x: 0, msg: sockMsg, bad: true };
            const I = E / ((S.s === "2" ? RPILE : 0.4) + C.r) * 1000;
            if (S.o === "mA") { S.fuse = false; saveS(); return { x: 0, msg: "Court-circuit ! Un ampèremètre branché aux bornes d'une source fait passer un courant énorme : le fusible a fondu. L'ampèremètre se branche en série.", bad: true, boom: true }; }
            return { x: sg * I, msg: "Court-circuit de la pile à travers l'ampèremètre (calibre 10 A) : un ampèremètre ne se branche jamais aux bornes d'une source !", bad: true, boom: true };
          }
          return { x: NaN, msg: "Ne mesure jamais une résistance aux bornes d'une source : l'ohmmètre donne une valeur fausse et peut être endommagé.", bad: true };
        }
        if (S.p === "B") {   // pile 9 V + R₂ ; appareil en série ou aux bornes de R₂
          const R = P.R.c.R;
          if (S.b === "serie") {
            if (f === "A") return sockOK ? { x: sg * P.E2 / (R + RPILE + C.r) * 1000, ok: true } : { x: 0, msg: "Pointe rouge sur la mauvaise borne : le circuit est ouvert, aucun courant ne passe. " + sockMsg, bad: true };
            if (f === "V") return sockOK ? { x: sg * P.E2 * RV / (RV + R + RPILE), msg: "Voltmètre branché en série : sa très grande résistance empêche presque tout courant de passer ; il indique la tension de la pile, pas une intensité.", bad: true } : { x: 0, msg: sockMsg, bad: true };
            return { x: NaN, msg: "Ne mesure jamais une résistance dans un circuit alimenté : retire le résistor du circuit (partie C).", bad: true };
          }
          // en dérivation aux bornes de R₂
          if (f === "A") {
            if (S.o === "VO") return { x: 0, msg: sockMsg, bad: true };
            if (S.o === "mA") { S.fuse = false; saveS(); return { x: 0, msg: "L'ampèremètre branché en dérivation court-circuite le résistor : le courant devient très grand et le fusible fond. Branche-le en série !", bad: true, boom: true }; }
            return { x: sg * P.E2 / (RPILE + C.r) * 1000, msg: "Ampèremètre en dérivation : il court-circuite le résistor et la pile débite un courant énorme. Branche-le en série !", bad: true, boom: true };
          }
          if (f === "V") return sockOK ? { x: sg * P.E2 * R / (R + RPILE), msg: "Le voltmètre mesure ici la tension aux bornes de R₂ : pour la partie B, il faut mesurer l'intensité avec l'ampèremètre en série.", bad: true } : { x: 0, msg: sockMsg, bad: true };
          return { x: NaN, msg: "Ne mesure jamais une résistance dans un circuit alimenté : retire le résistor du circuit (partie C).", bad: true };
        }
        // partie C : résistor seul, hors circuit
        if (f === "O") return sockOK ? { x: P.R[S.k].R, ok: true } : { x: 0, msg: sockMsg, bad: true, ol: true };
        return { x: 0, msg: "Le résistor seul n'est traversé par aucun courant : pour mesurer sa résistance, utilise l'ohmmètre (Ω).", bad: true };
      }
      const fkey = () => S.f;
      function lire() {
        const r = physique();
        if (r.off) { L = null; return { txt: "", r }; }
        const C = CAL[S.f][S.c];
        if (!isFinite(r.x)) { L = null; return { txt: (Math.random() < 0.5 ? "" : "-") + lcdTxt(C, (300 + Math.random() * 1500) * C.d), r }; }
        if (S.f === "O" && r.ol) { L = null; return { txt: "OL", r }; }   // circuit ouvert à l'ohmmètre
        const cal = (P.cal[S.f] || [])[S.c] || 0;
        let x = r.x === 0 ? 0 : r.x * (1 + cal) + gauss() * 0.12 * C.d;   // bruit : le dernier chiffre peut varier d'une unité près d'un arrondi
        if (r.x > 0) x = Math.max(0, x); else if (r.x < 0) x = Math.min(0, x);   // le bruit ne change jamais le signe (une résistance n'est jamais négative)
        if (Math.abs(x) >= lim(C)) { L = null; return { txt: "OL", r, ol: true }; }
        x = Math.round(x / C.d) * C.d; if (Math.abs(x) < C.d / 2) x = 0;
        L = x; return { txt: lcdTxt(C, x), r };
      }
      let cur = { txt: "", r: { off: true } };

      /* ---------- paillasse (SVG 640 × 400) ---------- */
      const cv = $("#mesures-cv"), box = document.createElement("div");
      box.className = "ms-board"; box.setAttribute("aria-label", "Paillasse : multimètre et montage"); cv.replaceWith(box);
      const F = 'font-family="Fira Sans,Arial"', FM = 'font-family="Fira Mono,monospace"';
      const POSN = [["OFF", 0, "OFF"]].concat(CAL.V.map((c, i) => ["V", i, c.n.replace(" ", "")]), CAL.A.map((c, i) => ["A", i, c.n.replace(" ", "")]), CAL.O.map((c, i) => ["O", i, c.n.replace(" ", "")]));
      const DC = [125, 212], DR = 46;
      const ang = j => (-90 + j * 22.5) * Math.PI / 180;
      const SOCK = { "10A": [50, 338], mA: [93, 338], COM: [143, 338], VO: [193, 338] };
      const resDraw = (x1, x2, y, k) => {
        const bd = bands(P.R[k].nom), w = x2 - x1;
        return `<rect x="${x1}" y="${y - 13}" width="${w}" height="26" rx="9" fill="#e8d3a9" stroke="var(--fg)" stroke-width="1.5"/>`
          + bd.map((b, i) => `<rect x="${x1 + 14 + i * (w - 40) / 3 + (i === 3 ? 10 : 0)}" y="${y - 13}" width="8" height="26" fill="${b === "or" ? "url(#msGold)" : COL[b]}"${b === "or" ? ` stroke="#8a6d12" stroke-width="0.8"` : ""}/>`).join("");
      };
      const lead = (from, to, col) => { const [x1, y1] = from, [x2, y2] = to, mx = (x1 + x2) / 2 + 30, my = Math.max(y1, y2) + 40; return `<path d="M${x1},${y1} Q${mx},${my} ${x2},${y2}" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".92"/><circle cx="${x2}" cy="${y2}" r="6" fill="${col}" stroke="#fff" stroke-width="1.5"/>`; };
      T.draw = () => {
        const C = S.f === "OFF" ? null : CAL[S.f][S.c];
        let h = `<svg viewBox="0 0 640 400" role="img" aria-label="Multimètre et montage"><defs><linearGradient id="msGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8c6a12"/><stop offset=".45" stop-color="#f7e08a"/><stop offset=".55" stop-color="#d4af37"/><stop offset="1" stop-color="#7a5c0e"/></linearGradient></defs>`;
        // ---- multimètre ----
        h += `<rect x="18" y="16" width="214" height="368" rx="22" fill="#f0b323" stroke="#6b4a00" stroke-width="2"/><rect x="30" y="28" width="190" height="344" rx="16" fill="#2b2b2b"/>`
          + `<rect x="42" y="42" width="166" height="70" rx="6" fill="#b9c8a6" stroke="#6f7f5c"/>`
          + `<text x="196" y="94" text-anchor="end" font-size="38" fill="#1b2414" ${FM}>${cur.txt || ""}</text>`
          + (C && cur.txt ? `<text x="200" y="108" text-anchor="end" font-size="11" fill="#1b2414" ${F}>${cur.txt === "OL" ? "" : C.u}</text>` : "")
          + (S.f !== "OFF" ? `<text x="48" y="56" font-size="10" fill="#1b2414" ${F}>${S.f === "V" ? "DC V" : S.f === "A" ? "DC A" : "Ω"}</text>` : "")
          + (!S.fuse ? `<text x="125" y="128" text-anchor="middle" font-size="11" font-weight="700" fill="#ff6b5a" ${F}>FUSIBLE mA FONDU</text>` : "");
        // cadran
        h += `<circle cx="${DC[0]}" cy="${DC[1]}" r="${DR + 30}" fill="#3a3a3a"/>`;
        POSN.forEach(([f, i, lab], j) => {
          const a = ang(j), x = DC[0] + (DR + 18) * Math.cos(a), y = DC[1] + (DR + 18) * Math.sin(a), on = S.f === f && (f === "OFF" || S.c === i);
          h += `<g class="pos" data-f="${f}" data-c="${i}" role="button" tabindex="0" aria-label="${f === "OFF" ? "Arrêt" : FN[f] + ", calibre " + CAL[f][i].n}"><circle cx="${x}" cy="${y}" r="11" fill="${on ? "var(--saff)" : "transparent"}" stroke="transparent" stroke-width="2"/><text x="${x}" y="${y + 3}" text-anchor="middle" font-size="${lab.length > 4 ? 7 : 8}" font-weight="600" fill="${on ? "#111" : (f === "V" ? "#ffd27a" : f === "A" ? "#9fd3ff" : f === "O" ? "#b9f0b0" : "#ddd")}" ${F}>${lab}</text></g>`;
        });
        const jj = S.f === "OFF" ? 0 : POSN.findIndex(p => p[0] === S.f && p[1] === S.c), aa = ang(jj);
        h += `<circle cx="${DC[0]}" cy="${DC[1]}" r="${DR - 6}" fill="#1e1e1e" stroke="#666" stroke-width="2"/><line x1="${DC[0]}" y1="${DC[1]}" x2="${DC[0] + (DR - 10) * Math.cos(aa)}" y2="${DC[1] + (DR - 10) * Math.sin(aa)}" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`
          + [["V", 3, "V⎓", "#ffd27a"], ["A", 8, "A⎓", "#9fd3ff"], ["O", 13, "Ω", "#b9f0b0"]].map(([f, j, l, col]) => { const a = ang(j); return `<text x="${DC[0] + 90 * Math.cos(a)}" y="${DC[1] + 90 * Math.sin(a) + 4}" text-anchor="middle" font-size="12" font-weight="700" fill="${col}" ${F}>${l}</text>`; }).join("");
        // bornes
        Object.entries(SOCK).forEach(([k, [x, y]]) => {
          const lab = { "10A": "10A", mA: "mA", COM: "COM", VO: "VΩ" }[k], red = k !== "COM";
          h += `<g class="${k === "COM" ? "" : "sock"}" data-o="${k}" ${k === "COM" ? "" : `role="button" tabindex="0" aria-label="Borne ${lab}"`}><circle class="ring" cx="${x}" cy="${y}" r="13" fill="#111" stroke="${red ? "#d33" : "#888"}" stroke-width="3"/><text x="${x}" y="${y + 28}" text-anchor="middle" font-size="11" font-weight="700" fill="#eee" ${F}>${lab}</text></g>`;
        });
        // ---- montage ----
        let tipR, tipB;
        if (S.p === "A") {
          const lab = SRC[S.s], big = S.s === "2";
          h += `<rect x="370" y="150" width="180" height="${big ? 120 : 90}" rx="12" fill="${S.s === "3" ? "#cfd8dc" : big ? "#37474f" : "#2e7d32"}" stroke="var(--fg)" stroke-width="2"/>`
            + `<text x="460" y="${big ? 220 : 205}" text-anchor="middle" font-size="15" font-weight="700" fill="${S.s === "3" ? "#222" : "#fff"}" ${F}>${lab}</text>`
            + `<rect x="398" y="128" width="24" height="22" fill="#c62828"/><text x="410" y="122" text-anchor="middle" font-size="16" font-weight="700" fill="#c62828" ${F}>+</text>`
            + `<rect x="498" y="128" width="24" height="22" fill="#333"/><text x="510" y="122" text-anchor="middle" font-size="16" font-weight="700" fill="var(--fg)" ${F}>−</text>`;
          tipR = [410, 132]; tipB = [510, 132];
        } else if (S.p === "B") {
          const se = S.b === "serie";
          h += `<rect x="300" y="200" width="56" height="96" rx="8" fill="#37474f" stroke="var(--fg)" stroke-width="2"/><text x="328" y="252" text-anchor="middle" font-size="12" font-weight="700" fill="#fff" ${F}>9 V</text><text x="314" y="196" font-size="15" font-weight="700" fill="#c62828" ${F}>+</text>`
            + `<path d="M328,200 V100 H430" stroke="var(--fg)" stroke-width="3" fill="none"/>` + resDraw(430, 540, 100, "c")
            + `<text x="485" y="80" text-anchor="middle" font-size="13" font-weight="700" fill="var(--fg)" ${F}>R₂</text>`
            + `<path d="M540,100 H600 V${se ? 165 : 340}" stroke="var(--fg)" stroke-width="3" fill="none"/>`
            + (se ? `<path d="M600,245 V340" stroke="var(--fg)" stroke-width="3" fill="none"/><circle cx="600" cy="165" r="6" fill="var(--fg)"/><circle cx="600" cy="245" r="6" fill="var(--fg)"/><text x="612" y="210" font-size="11" fill="var(--muted)" ${F}>circuit</text><text x="612" y="224" font-size="11" fill="var(--muted)" ${F}>ouvert</text>` : "")
            + `<path d="M600,340 H328 V296" stroke="var(--fg)" stroke-width="3" fill="none"/>`
            + `<polygon points="392,100 382,94 382,106" fill="var(--rouge,#c62828)"/><text x="380" y="90" font-size="12" font-style="italic" fill="#c62828" ${F}>I</text>`;
          if (se) { tipR = [600, 165]; tipB = [600, 245]; } else { tipR = [430, 100]; tipB = [540, 100]; }
        } else {
          h += `<line x1="380" y1="200" x2="410" y2="200" stroke="var(--fg)" stroke-width="3"/><line x1="540" y1="200" x2="570" y2="200" stroke="var(--fg)" stroke-width="3"/>` + resDraw(410, 540, 200, S.k)
            + `<text x="475" y="172" text-anchor="middle" font-size="15" font-weight="700" fill="var(--fg)" ${F}>${RES[S.k]}</text><text x="475" y="246" text-anchor="middle" font-size="11" fill="var(--muted)" ${F}>résistor hors circuit</text>`
            + `<text x="300" y="30" font-size="11" font-weight="700" fill="var(--fg)" ${F}>Code des couleurs</text>`
            + NOMC.map((n, i) => `<rect x="${300 + i * 29}" y="38" width="22" height="16" rx="2" fill="${COL[n]}" stroke="#888" stroke-width="0.6"/><text x="${311 + i * 29}" y="68" text-anchor="middle" font-size="10" fill="var(--fg)" ${F}>${i}</text>`).join("")
            + `<rect x="${300 + 10 * 29 + 4}" y="38" width="22" height="16" rx="2" fill="url(#msGold)" stroke="#8a6d12" stroke-width="0.6"/><text x="${315 + 10 * 29}" y="68" text-anchor="middle" font-size="10" fill="var(--fg)" ${F}>or ±5 %</text>`
            + `<text x="300" y="86" font-size="10" fill="var(--muted)" ${F}>anneaux 1 et 2 : chiffres • anneau 3 : puissance de 10</text>`;
          tipR = [380, 200]; tipB = [570, 200];
        }
        if (S.inv) [tipR, tipB] = [tipB, tipR];
        h += lead(SOCK.COM, tipB, "#222") + lead(SOCK[S.o], tipR, "#d32f2f");
        if (cur.r && cur.r.boom) h += `<text x="460" y="385" text-anchor="middle" font-size="14" font-weight="700" fill="#d32f2f" ${F}>court-circuit !</text>`;
        h += `</svg>`;
        box.innerHTML = h;
      };

      /* ---------- interface ---------- */
      const calSeg = () => {
        if (S.f === "OFF") { $("#msCal").innerHTML = ""; return; }
        $("#msCal").innerHTML = `<label>Calibre</label>` + seg("msc", CAL[S.f].map((c, i) => [String(i), c.n]), String(S.c));
        document.querySelectorAll("[data-msc]").forEach(b => b.onclick = () => { S.c = +b.dataset.msc; update(); });
      };
      function update(silent) {
        saveS();
        $("#msSrc").hidden = S.p !== "A"; $("#msBr").hidden = S.p !== "B"; $("#msRes").hidden = S.p !== "C";
        setSeg("msp", S.p); setSeg("mss", S.s); setSeg("msb", S.b); setSeg("msr", S.k); setSeg("msf", S.f); setSeg("mso", S.o);
        calSeg();
        cur = lire();
        const C = S.f === "OFF" ? null : CAL[S.f][S.c];
        $("#msLcd").textContent = S.f === "OFF" ? "—" : cur.txt === "OL" ? "OL (dépassement)" : cur.txt + " " + C.u;
        $("#msFn").textContent = S.f === "OFF" ? "arrêt" : FN[S.f].split(" (")[0] + " — " + C.n;
        { const bu = { V: "V", A: "mA", O: "Ω" }[S.f], base = C ? fr(C.d, Math.max(0, -Math.floor(Math.log10(C.d)))) + " " + bu : "—"; $("#msD").textContent = !C ? "—" : (C.u === bu ? base : base + " (" + fr(C.d * C.k, C.dec) + " " + C.u + ")"); }
        if (!silent) { if (cur.r.msg) T.msg(cur.r.msg, cur.r.bad ? "bad" : ""); else if (cur.txt === "OL") T.msg("Dépassement (OL) : la valeur est supérieure au calibre. Choisis un calibre plus grand.", "bad"); else T.msg(""); }
        T.draw();
      }
      const bindSeg = (id, key, after) => document.querySelectorAll(`[data-${id}]`).forEach(b => b.onclick = () => { S[key] = b.getAttribute("data-" + id); if (after) after(); update(); });
      bindSeg("msp", "p"); bindSeg("mss", "s"); bindSeg("msb", "b"); bindSeg("msr", "k"); bindSeg("mso", "o");
      bindSeg("msf", "f", () => { S.c = S.f === "OFF" ? 0 : CAL[S.f].length - 1; });   // nouvelle fonction : on part du plus grand calibre
      box.addEventListener("click", e => {
        const p = e.target.closest("[data-f]"), o = e.target.closest(".sock");
        if (p) { const f = p.dataset.f; S.f = f; S.c = f === "OFF" ? 0 : +p.dataset.c; update(); }
        else if (o) { S.o = o.dataset.o; update(); }
      });
      box.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.target.dispatchEvent(new MouseEvent("click", { bubbles: true })); } });
      $("#msInv").onclick = () => { S.inv = !S.inv; update(); };
      $("#msFuse").onclick = () => { if (S.fuse) { T.msg("Le fusible est en bon état.", ""); return; } S.fuse = true; update(true); T.msg("Fusible remplacé. Vérifie ton branchement avant de mesurer une intensité : l'ampèremètre se met en série.", "ok"); };
      $("#msRec").onclick = () => {
        if (S.f === "OFF") { T.msg("Le multimètre est à l'arrêt.", "bad"); return; }
        if (cur.r.bad) { T.msg("Mesure refusée : " + cur.r.msg, "bad"); return; }
        if (cur.txt === "OL" || L == null) { T.msg("Dépassement (OL) : rien à enregistrer. Choisis un calibre plus grand.", "bad"); return; }
        if (L < 0) { T.msg("La lecture est négative : les pointes sont inversées. La pointe rouge doit être du côté du + (ou de l'entrée du courant).", "bad"); return; }
        if (L === 0) { T.msg("La lecture est nulle sur ce calibre : choisis un calibre plus petit.", "bad"); return; }
        const want = { A: "V", B: "A", C: "O" }[S.p];
        if (S.f !== want) { T.msg("Cette fonction ne correspond pas à la mesure demandée dans cette partie.", "bad"); return; }
        const row = S.p === "A" ? { s: S.s, c: S.c, L } : S.p === "B" ? { c: S.c, L } : { k: S.k, c: S.c, L };
        T.add(S.p, row);
        const C = CAL[S.f][S.c];
        T.msg(`Mesure enregistrée (partie ${S.p}) : ${fmtL(S.f, S.c, L)} sur le calibre ${C.n}.`, "ok");
      };
      $("#msNew").onclick = () => { if (T.locked()) { T.msg("Compte rendu déjà soumis : le matériel ne peut plus être changé.", "bad"); return; } newSet(); T.clearRows(); update(true); T.msg("Nouveau matériel : refais les mesures."); };
      update(true);
    }
  });
})();
