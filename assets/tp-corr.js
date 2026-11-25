/* Correction détaillée d'un compte rendu, affichée après la soumission et téléchargeable (PDF via l'impression du navigateur).
   Données : action « correction » du correcteur (v2.23 et plus) → chaque case juste / fausse avec la valeur attendue,
   chaque résultat de calcul, et pour le QCM seulement juste / faux (jamais la bonne réponse).
   Les remarques et conseils propres à un TP sont produits par TPCorr.rules[id] (ici : TP 6, multimètre). */
(function () {
  "use strict";
  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const num = v => { if (v === null || v === undefined) return NaN; const s = String(v).trim().replace(/\s/g, "").replace(",", ".").replace(/[×x*]10\^?\(?(-?\d+)\)?/i, "e$1"); return s === "" ? NaN : Number(s); };
  const fr = (x, sig = 4) => { if (x == null || !isFinite(x)) return "—"; if (x === 0) return "0"; let s = (+(+x).toPrecision(sig)).toString(); if (/e/.test(s)) s = (+x).toFixed(Math.max(0, sig - 1 - Math.floor(Math.log10(Math.abs(x))))); return s.replace(".", ","); };
  const vide = v => v == null || String(v).trim() === "";
  const ok = b => b ? '<span class="cr-ok">✓</span>' : '<span class="cr-ko">✗</span>';
  const near = (a, b, t = 0.02) => isFinite(a) && isFinite(b) && b !== 0 && Math.abs(a / b - 1) <= t;
  const lettreO = v => /[oO]/.test(String(v || "")) && isFinite(num(String(v).replace(/[oO]/g, "0")));
  const parasite = v => !vide(v) && !isFinite(num(v)) && !lettreO(v);

  /* ---------- remarques du TP 6 (multimètre) : mêmes règles que les corrections envoyées par mail ---------- */
  const R6 = ctx => {
    const M = window.TP_MES, CAL = M.CAL, raw = ctx.copie.raw, fill = ctx.copie.fill, calc = ctx.copie.calc, C = ctx.corr;
    const out = { forts: [], why: {}, conseils: [], cell: {} }, add = (k, t) => { if (!out.conseils.some(x => x[0] === k)) out.conseils.push([k, t]); };
    const lim = (f, c) => Math.min(CAL[f][c].max || Infinity, 2000 * CAL[f][c].d);
    const bestIdx = (f, x) => { for (let c = 0; c < CAL[f].length; c++) if (Math.abs(x) < lim(f, c)) return c; return CAL[f].length - 1; };
    const rowsOf = (part, key, v) => (raw[part] || []).map((r, i) => Object.assign({ i }, r)).filter(r => key ? r[key] === v : true);
    const finest = rows => rows.length ? rows.reduce((a, b) => (b.c < a.c ? b : a)) : null;
    const A1 = rowsOf("A", "s", "1"), A2 = rowsOf("A", "s", "2"), A3 = rowsOf("A", "s", "3"), B = rowsOf("B"), Ra = rowsOf("C", "k", "a"), Rc = rowsOf("C", "k", "c"), Rd = rowsOf("C", "k", "d");
    const fA1 = finest(A1), fA2 = finest(A2), fA3 = finest(A3), fB = finest(B), fRa = finest(Ra), fRc = finest(Rc), fRd = finest(Rd);
    const cn = (f, c) => CAL[f][c].n, lect = (f, r) => M.fmtL(f, r.c, r.L);
    const e = k => (C.calc[k] || [])[1], okc = k => !!(C.calc[k] || [])[0], v = k => num(calc[k]);
    // 1) meilleur calibre atteint ?
    const manque = [];
    [[fA1, "V", "la pile 1,5 V"], [fA2, "V", "la pile 9 V"], [fA3, "V", "le capteur"]].forEach(([r, f, lab]) => { if (r && r.c > bestIdx(f, r.L)) manque.push(`${lab} jusqu'au <b>${cn(f, bestIdx(f, r.L))}</b> (tu t'es arrêté·e au ${cn(f, r.c)})`); });
    if (fB && fB.c > bestIdx("A", fB.L) && fB.c !== 4) manque.push(`l'intensité jusqu'au <b>${cn("A", bestIdx("A", fB.L))}</b>`);
    [[fRa, "R₁"], [fRc, "R₂"], [fRd, "R₃"]].forEach(([r, lab]) => { if (r && r.c > bestIdx("O", r.L)) manque.push(`${lab} jusqu'au <b>${cn("O", bestIdx("O", r.L))}</b> (tu t'es arrêté·e au ${cn("O", r.c)})`); });
    if (manque.length) add("cal", `<b>Descendre jusqu'au meilleur calibre</b> (le plus petit qui n'affiche pas « OL ») : ${manque.join(" ; ")}. Une valeur ronde (1,5 ; 9 ; 2200…) vient presque toujours d'un calibre trop grand.`);
    else out.forts.push("Toutes tes mesures vont jusqu'au <b>meilleur calibre</b> : c'est exactement la bonne méthode.");
    // 2) cases du tableau
    let nO = 0, nPar = 0, nVide = 0, nCase = 0, ecartKO = null, nomKO = null, arrondi = null;
    Object.keys(C.fill).forEach(part => (C.fill[part] || []).forEach((cells, i) => Object.keys(cells).forEach(c => {
      nCase++; const [g, ex] = cells[c], val = ((fill[part] || [])[i] || {})[c], x = num(val); if (g) return;
      let note = "";
      if (vide(val)) { nVide++; note = "case vide"; }
      else if (lettreO(val)) { nO++; note = "lettre « O » au lieu du chiffre 0"; }
      else if (parasite(val)) { nPar++; note = "caractère non numérique"; }
      else if (part === "C" && c === "ecart") { if (!ecartKO) ecartKO = { i, r: raw.C[i], nom: num(((fill.C || [])[i] || {}).nom), ex, val }; note = near(x, ex * 0.01, 0.05) ? "oubli du × 100" : "voir la formule de l'écart"; }
      else if (part === "C" && c === "nom") { if (!nomKO) nomKO = { val: x, ex }; note = near(x, ex * 10, 0.02) ? "un zéro de trop" : (x < ex && near(x * Math.pow(10, Math.round(Math.log10(ex / x))), ex, 0.02)) ? "multiplicateur (3ᵉ anneau) oublié" : "voir le code des couleurs"; }
      else if (near(x * 1000, ex, 0.05) || near(x / 1000, ex, 0.05)) note = "erreur d'unité (facteur 1000)";
      else if (near(x, ex, 0.25) && String(val).replace(/\D/g, "").replace(/^0+/, "").length < 3) { note = "trop arrondi : garde 3 chiffres"; if (!arrondi) arrondi = { part, i, c, val, ex }; }
      (out.cell[part] = out.cell[part] || {})[i + ":" + c] = note;
    })));
    ["A", "B", "C"].forEach(p => { const L = C.fill[p] || []; if (L.length && L.every(o => Object.values(o).every(z => z[0]))) out.forts.push(`Tableau de la partie ${p} <b>entièrement juste</b>.`); });
    if (nO) add("O", `<b>Lettre « O » au lieu du chiffre 0</b> (${nO} case${nO > 1 ? "s" : ""}) : une case qui contient une lettre est comptée fausse. Tape bien le chiffre <b>0</b>.`);
    if (nPar) add("par", "<b>Caractères parasites</b> (« & », espaces…) : écris uniquement le nombre.");
    if (ecartKO && ecartKO.r) { const r = ecartKO.r, nom = isFinite(ecartKO.nom) ? ecartKO.nom : NaN;
      add("ecart", `<b>Écart à la valeur nominale</b> : écart = |R − R<sub>nom</sub>| / R<sub>nom</sub> × 100, c'est en général quelques %. Ex. ta ligne ${ecartKO.i + 1} : |${fr(r.L)} − ${fr(nom)}| / ${fr(nom)} × 100 ≈ <b>${fr(ecartKO.ex, 2)} %</b> (et non ${esc(ecartKO.val)}).`); }
    if (nomKO) add("nom", "<b>Code des couleurs</b> : le 3ᵉ anneau donne le nombre de zéros à ajouter (noir → 0, marron → 1, rouge → 2, orange → 3, jaune → 4). Ex. rouge-rouge-rouge = 22 × 10² = <b>2200 Ω</b> ; orange-blanc-noir = 39 × 10⁰ = <b>39 Ω</b>.");
    if (arrondi) add("arr", `<b>Ne pas arrondir trop tôt</b> : partie ${arrondi.part}, ligne ${arrondi.i + 1}, ${esc(arrondi.val)} au lieu de ${fr(arrondi.ex, 3)}. Garde au moins 3 chiffres significatifs, sinon les cases suivantes deviennent fausses.`);
    // 3) résultats et calculs
    const autreLigne = (rows, x, f) => rows.find(r => near(x, r.L, 0.004));
    const calibreNb = (f, x) => CAL[f].some(c => near(x, num(c.n), 0.0001) || near(x, num(c.n) * (c.u === "A" ? 1000 : 1), 0.0001));
    { const x = v("E1"), r = autreLigne(A1, x);
      if (!okc("E1")) out.why.E1 = vide(calc.E1) ? "Case vide." : (r && fA1 && r.c !== fA1.c) ? `Tu as recopié la lecture du calibre <b>${cn("V", r.c)}</b>. Il faut celle du meilleur calibre : <b>${cn("V", fA1.c)}</b>, soit <b>${fr(e("E1"))} V</b>.` : calibreNb("V", x) ? `Tu as écrit le <b>calibre</b>, pas la lecture. Il faut le nombre affiché sur le meilleur calibre : <b>${fr(e("E1"))} V</b>.` : `Il faut la lecture de la pile 1,5 V sur le meilleur calibre : <b>${fr(e("E1"))} V</b>.`;
      else if (r && fA1 && r.c !== fA1.c) out.why.E1 = `Accepté, mais la lecture la plus précise est celle du calibre ${cn("V", fA1.c)} : ${lect("V", fA1)}.`;
      if (!okc("E1") && !vide(calc.E1)) add("best", "<b>Résultats</b> : recopie le <b>nombre affiché à l'écran</b> sur le meilleur calibre, jamais le nombre écrit sur le calibre (600, 20…). La meilleure lecture est celle qui a le plus de chiffres (1,544 plutôt que 1,5)."); }
    if (!okc("dE1")) { const x = v("dE1"), r = A1.find(rr => near(x, num(((fill.A || [])[rr.i] || {}).dU), 0.01) && fA1 && rr.c !== fA1.c);
      out.why.dE1 = vide(calc.dE1) ? "Case vide." : (r ? `Tu as repris l'incertitude de la ligne du calibre <b>${cn("V", r.c)}</b>. ` : "") + `ΔE₁ = 0,005 × E₁ + 2 × D, avec E₁ et D du <b>meilleur calibre</b> : <b>${fr(e("dE1"), 3)} V</b>.`; }
    { const x = v("I"), r = autreLigne(B, x), r10 = B.find(rr => rr.c === 4 && near(x * 1000, rr.L, 0.01));
      if (!okc("I")) out.why.I = vide(calc.I) ? `Case vide. Il fallait la lecture du meilleur calibre : <b>${fr(e("I"))} mA</b>.` : r10 ? "Tu as écrit la lecture du calibre 10 A, <b>en ampères</b>. Il faut la lecture du meilleur calibre, en <b>mA</b>." : (r && fB && r.c !== fB.c) ? `Tu as recopié la lecture du calibre <b>${cn("A", r.c)}</b>. Il faut celle du meilleur calibre : <b>${fr(e("I"))} mA</b>.` : calibreNb("A", x) ? `Tu as écrit le <b>calibre</b>, pas la lecture : <b>${fr(e("I"))} mA</b>.` : `Il faut la lecture du meilleur calibre : <b>${fr(e("I"))} mA</b>.`;
      else if (r && fB && r.c !== fB.c) out.why.I = `Accepté, mais la meilleure lecture est celle du calibre ${cn("A", fB.c)} : ${lect("A", fB)}.`; }
    { const x = v("R2"), r = autreLigne(Rc, x);
      if (!okc("R2")) { if (near(x * 1000, e("R2"), 0.03)) { out.why.R2 = `Tu as écrit des <b>kΩ</b>. Il faut des <b>ohms</b> : ${fr(x)} kΩ = <b>${fr(x * 1000)} Ω</b>.`; add("unit", "<b>Unités</b> : 2,14 kΩ = 2140 Ω ; 0,0074 A = 7,4 mA. Vérifie l'ordre de grandeur : I de quelques mA, R₂ entre 1000 et 2300 Ω."); }
        else out.why.R2 = vide(calc.R2) ? "Case vide." : (r && fRc && r.c !== fRc.c) ? `Tu as recopié la lecture du calibre <b>${cn("O", r.c)}</b> (arrondie : elle tombe souvent sur la valeur nominale). Il faut celle du meilleur calibre : <b>${fr(e("R2"))} Ω</b>.` : calibreNb("O", x) ? `Tu as écrit un <b>calibre</b>, pas la lecture : <b>${fr(e("R2"))} Ω</b>.` : `Il faut la lecture de R₂ sur le meilleur calibre, en ohms : <b>${fr(e("R2"))} Ω</b>.`; }
      else if (r && fRc && r.c !== fRc.c) out.why.R2 = `Accepté, mais c'est la lecture arrondie du calibre ${cn("O", r.c)}. La plus précise est ${lect("O", fRc)}.`; }
    if (!okc("Ical")) { const x = v("Ical"), ex = e("Ical");
      out.why.Ical = vide(calc.Ical) ? `Case vide. I = E₂ / R₂ × 1000 ≈ <b>${fr(ex, 3)} mA</b>.` : (near(x * 1000, ex, 0.06) ? "Ton résultat est en <b>ampères</b> : multiplie par 1000 pour avoir des mA. " : near(x * 1e6, ex, 0.06) ? "Ton résultat est <b>un million de fois trop petit</b> : on <b>multiplie</b> par 1000, on ne divise pas. " : near(x / 1000, ex, 0.06) ? "Ton résultat est <b>1000 fois trop grand</b> (R₂ en kΩ, ou × 1000 en trop). " : (A2.some(rr => rr.c === 4 && Rc.some(q => near(x, rr.L / q.L * 1000, 0.01))) ? "Tu as utilisé la lecture de la pile 9 V sur le calibre <b>600 V</b>. " : "")) + `I = E₂ / R₂ × 1000, avec les meilleures lectures (E₂ en V, R₂ en Ω) : <b>${fr(ex, 3)} mA</b>. Elle doit être proche de I mesurée.`;
      if (!vide(calc.Ical)) add("ordre", "<b>Ordre de grandeur</b> : I calculée doit être proche de I mesurée (quelques mA). Un résultat très différent signale une erreur d'unité ou de lecture."); }
    if (!okc("ecart")) { const x = v("ecart"), ex = e("ecart");
      out.why.ecart = vide(calc.ecart) ? `Case vide. Écart ≈ <b>${fr(ex, 2)} %</b>.` : (near(x * 100, ex, 0.1) ? "Tu as oublié le <b>× 100</b>. " : "") + `Écart = |I calculée − I mesurée| / I calculée × 100 ≈ <b>${fr(ex, 2)} %</b> (un petit écart est normal : résistance interne de l'ampèremètre et de la pile).`; }
    const kc = Object.keys(C.calc); if (kc.length && kc.every(okc)) out.forts.push("Les <b>six résultats de calcul</b> sont justes.");
    // 4) QCM et temps
    const nq = C.qcm.filter(Boolean).length, nb = ctx.copie.repondu.filter(x => !x).length;
    if (C.qcm.length && nq === C.qcm.length) out.forts.push("<b>QCM parfait</b>.");
    else { if (nb) add("qcmv", `<b>QCM</b> : ${nb} question${nb > 1 ? "s" : ""} sans réponse. Réponds à toutes, même en cas de doute.`);
      if (C.qcm.length - nq - nb > 0) add("qcm", "<b>QCM</b> : chaque question porte sur une <b>ligne précise de ton tableau</b>. Retrouve la ligne, refais le calcul (ΔU, ΔI, ΔR ou incertitude relative) et choisis la valeur la plus proche."); }
    const nCalcVide = kc.filter(k => vide(calc[k])).length;
    if ((nCase && nVide / nCase > 0.25) || nCalcVide >= 3) out.conseils.unshift(["temps", "<b>Gestion du temps</b> : beaucoup de cases sont restées vides. Remplis le tableau au fur et à mesure de tes mesures et garde 15 minutes à la fin pour les calculs et le QCM."]);
    if (!out.conseils.length) out.conseils.push(["bravo", "Excellent travail : continue ainsi !"]);
    out.conseils = out.conseils.map(x => x[1]).slice(0, 6);
    return out;
  };

  /* ---------- rendu ---------- */
  function build(ctx) {
    const d = ctx.data, C = d.corr, cp = d.copie, CR = ctx.CR, R = (ctx.rules || (() => ({ forts: [], why: {}, conseils: [], cell: {} })))({ copie: cp, corr: C });
    const parts = ctx.keys.map((k, n) => {
      const p = CR.parts[k], rows = cp.raw[k] || [], cf = C.fill[k] || [], f = cp.fill[k] || [];
      let g = 0, t = 0; cf.forEach(o => Object.values(o).forEach(z => { t++; if (z[0]) g++; }));
      const body = rows.map((r, i) => `<tr>${p.cells(r, i).map(x => `<td>${x}</td>`).join("")}${(p.fill || []).map(c => { const z = (cf[i] || {})[c.k], val = (f[i] || {})[c.k], nt = ((R.cell[k] || {})[i + ":" + c.k]) || "";
        return z ? `<td>${vide(val) ? '<span class="cr-vide">vide</span>' : esc(val)} ${ok(z[0])}${z[0] ? "" : `<div class="cr-att">attendu : ${fr(z[1])}${nt ? " — " + esc(nt) : ""}</div>`}</td>` : `<td>${esc(val)}</td>`; }).join("")}</tr>`).join("");
      return `<h3>Partie ${ctx.L[n]} — ${esc(p.titre)} <small>${g}/${t} cases justes</small></h3><div class="cr-scroll"><table><tr>${p.cols.concat((p.fill || []).map(c => c.h)).map(c => `<th>${c}</th>`).join("")}</tr>${body || `<tr><td colspan="9">Aucune mesure</td></tr>`}</table></div>`;
    }).join("");
    const calc = (CR.calc || []).map(c => { const z = C.calc[c.k] || [false, null], val = cp.calc[c.k];
      return `<tr><td class="cr-l">${c.h}</td><td>${vide(val) ? '<span class="cr-vide">vide</span>' : esc(val) + " " + esc(c.u)} ${ok(z[0])}</td><td>${z[0] ? "—" : fr(z[1]) + " " + esc(c.u)}</td><td class="cr-why">${R.why[c.k] || (z[0] ? "Juste." : "")}</td></tr>`; }).join("");
    const qcm = cp.questions.map((q, i) => `<tr><td>${i + 1}</td><td class="cr-l">${esc(ctx.qText(q, i))}</td><td>${cp.repondu[i] ? ok(C.qcm[i]) : '<span class="cr-ko">sans réponse</span>'}</td></tr>`).join("");
    const wM = ctx.wM, bar = (x, m) => `<div class="cr-bar"><i style="width:${Math.max(0, Math.min(100, Math.round(100 * x / m)))}%"></i></div>`;
    const nq = C.qcm.filter(Boolean).length, nc = Object.values(C.calc).filter(z => z[0]).length;
    return `<div class="cr-head"><div><b>${esc(ctx.etu.prenom)} ${esc(ctx.etu.nom)}</b><br><span>N° carte ${esc(ctx.etu.carte)} • Groupe ${esc(ctx.etu.groupe)} • Soumis le ${esc(new Date(d.date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }))}</span></div><div class="cr-note"><b>${fr(d.note)}</b><span>/20</span></div></div>
      <div class="cr-grid"><div><span>Mesures</span><b>${fr(d.mesures, 3)} / ${wM}</b>${bar(d.mesures, wM)}</div>${ctx.hf ? `<div><span>Tableaux</span><b>${fr(d.tableau, 3)} / 6</b>${bar(d.tableau, 6)}</div>` : ""}${ctx.hc ? `<div><span>Calculs (${nc}/${Object.keys(C.calc).length})</span><b>${fr(d.calculs, 3)} / 6</b>${bar(d.calculs, 6)}</div>` : ""}<div><span>QCM (${nq}/${C.qcm.length})</span><b>${fr(d.qcm, 3)} / 6</b>${bar(d.qcm, 6)}</div></div>
      ${R.forts.length ? `<div class="cr-box cr-forts"><b>Ce qui est bien réussi</b><ul>${R.forts.map(x => `<li>${x}</li>`).join("")}</ul></div>` : ""}
      ${parts}
      ${calc ? `<h3>Résultats et calculs <small>${nc}/${Object.keys(C.calc).length} justes</small></h3><div class="cr-scroll"><table class="cr-calc"><tr><th>Grandeur</th><th>Ta réponse</th><th>Attendu</th><th>Explication</th></tr>${calc}</table></div>` : ""}
      ${qcm ? `<h3>QCM <small>${nq}/${C.qcm.length} justes</small></h3><table><tr><th>#</th><th>Question</th><th></th></tr>${qcm}</table>` : ""}
      ${R.conseils.length ? `<div class="cr-box cr-cons"><b>Remarques et conseils pour progresser</b><ul>${R.conseils.map(x => `<li>${x}</li>`).join("")}</ul></div>` : ""}
      <p class="cr-foot">Note officielle calculée par le correcteur de la plateforme. Les valeurs attendues sont calculées avec tes propres mesures et ton matériel ; pour le QCM, seul « juste / faux » est indiqué.</p>`;
  }
  const CSS = `body{font-family:Arial,Helvetica,sans-serif;color:#1b2333;font-size:9.5pt;max-width:900px;margin:18px auto;padding:0 14px}
h1{font-size:15pt;margin:2px 0 6px;color:#14213d;border-bottom:3px solid #1f7a8c;padding-bottom:4px}h3{font-size:10.5pt;margin:12px 0 4px;color:#14213d}h3 small{font-weight:400;color:#5b6b7f;margin-left:6px}
.ecole{font-weight:700;color:#14213d;font-size:9pt;letter-spacing:.4px}.tp{color:#5b6b7f}
.cr-head{display:flex;justify-content:space-between;align-items:center;background:#eef4f6;border-radius:8px;padding:7px 11px;gap:10px}.cr-head span{color:#5b6b7f}
.cr-note{background:#14213d;color:#fff;border-radius:8px;padding:4px 12px;text-align:center;white-space:nowrap}.cr-note b{font-size:18pt}.cr-note span{margin-left:2px}
.cr-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:6px;margin-top:6px}.cr-grid div{border:1px solid #c9d6dd;border-radius:6px;padding:4px 7px}.cr-grid span{display:block;color:#5b6b7f;font-size:8pt}
.cr-bar{height:4px;background:#e3e9ee;border-radius:2px;margin-top:3px}.cr-bar i{display:block;height:4px;background:#1f7a8c;border-radius:2px}
table{width:100%;border-collapse:collapse}th{background:#14213d;color:#fff;font-size:8pt;padding:3px 4px;text-align:left}td{border-bottom:1px solid #dde5ea;padding:3px 4px;vertical-align:top}
.cr-ok{color:#2e8b57;font-weight:700}.cr-ko{color:#b23a48;font-weight:700}.cr-att{color:#b23a48;font-size:8pt}.cr-vide{color:#8a96a3;font-style:italic}.cr-l{text-align:left}.cr-why{font-size:8.6pt}
.cr-box{border-radius:8px;padding:6px 10px;margin:8px 0}.cr-box ul{margin:4px 0;padding-left:18px}.cr-box li{margin-bottom:3px}.cr-forts{background:#eaf6ef;border-left:4px solid #2e8b57}.cr-cons{background:#fff6e5;border-left:4px solid #d98e04}
.cr-foot{margin-top:8px;color:#5b6b7f;font-size:8pt;border-top:1px solid #c9d6dd;padding-top:4px}
@media print{body{margin:0;max-width:none}@page{size:A4;margin:10mm}h3,tr{break-inside:avoid}}`;
  function doc(ctx, inner) {
    return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Correction TP ${esc(ctx.T.lab)} — ${esc(ctx.etu.nom)}</title><style>${CSS}</style></head><body>
      <div class="ecole">${esc(ctx.org)}</div><div class="tp">TP n°${esc(ctx.T.lab)} — ${esc(ctx.T.titre)}</div><h1>Correction de mon compte rendu</h1>${inner}</body></html>`;
  }
  // même style dans la page, limité au bloc .crpage (sans les règles body et impression)
  const CSS_IN = CSS.split("\n").filter(l => !/^(body|@media)/.test(l)).join("").split("}").filter(r => r.includes("{")).map(r => { const [sel, dec] = r.split("{"); return sel.split(",").map(x => ".crpage " + x.trim()).join(",") + "{" + dec + "}"; }).join("\n")
    + "\n.crpage{font-family:Arial,Helvetica,sans-serif;font-size:.86rem;color:var(--fg)}.crpage .cr-scroll{overflow-x:auto}.crpage td,.crpage th{color:inherit}.crpage th{color:#fff}.crpage .cr-head,.crpage .cr-forts,.crpage .cr-cons{color:#1b2333}.crpage h3{color:var(--fg)}.crpage td,.crpage th{text-align:left;font-family:Arial,Helvetica,sans-serif;font-size:.84rem;white-space:normal}.crpage table{margin:0}";
  window.TPCorr = { build, doc, CSS, CSS_IN, rules: { mesures: R6 } };
})();
