/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* Modèles chimiques des TP de chimie (mêmes calculs que le serveur de correction) */
/* ---------- modèles chimiques communs (identiques sur la page et sur le serveur de correction) ---------- */
var CXKW = 1e-14, CXK1 = Math.pow(10, -6.35), CXK2 = Math.pow(10, -10.33);
/* pH par électroneutralité : cat = cations « forts » (équivalents, mol/L), an = anions forts,
   cw = acide éthanoïque total, cc = carbone inorganique total (CO₂ dissous) ; dichotomie sur log h */
function cxPH(cat, an, cw, cc, pKa) {
  var Ka = Math.pow(10, -(pKa || 4.76)), lo = -14.5, hi = 0.5;
  for (var i = 0; i < 80; i++) {
    var m = (lo + hi) / 2, h = Math.pow(10, m), f = h + cat - CXKW / h - an;
    if (cw) f -= cw * Ka / (Ka + h);
    if (cc) f -= cc * (CXK1 * h + 2 * CXK1 * CXK2) / (h * h + CXK1 * h + CXK1 * CXK2);
    if (f > 0) hi = m; else lo = m;
  }
  return -(lo + hi) / 2;
}
/* premier volume (grille de 0,05 mL, c'est-à-dire une goutte) où f(V) ≥ seuil (sens = 1) ou < seuil (sens = −1) */
function cxCross(f, thr, sens, vmax) { for (var k = 0; k <= Math.round((vmax || 50) / 0.05); k++) { var V = Math.round(k * 5) / 100, y = f(V); if (sens < 0 ? y < thr : y >= thr) return V; } return NaN; }
/* volume noté au virage : au plus tôt la goutte du virage, au plus tard 1 mL après */
function cxVolOK(V, end) { return isFinite(V) && isFinite(end) && V >= end - 1e-6 && V <= end + 1.05; }
function cxMoy(R, f) { R = R || []; var s = 0, n = 0; for (var i = 0; i < R.length; i++) { var y = f(R[i]); if (isFinite(y)) { s += y; n++; } } return n ? s / n : NaN; }
/* dosages répétés : moyenne des dosages précis (sans l'essai rapide n°1 quand il y a au moins 3 essais) */
function cxPrec(R) { R = R || []; return R.length >= 3 ? R.slice(1) : R; }
function cxSd(a) { var n = a.length; if (n < 2) return NaN; var m = 0, s = 0, i; for (i = 0; i < n; i++) m += a[i]; m /= n; for (i = 0; i < n; i++) s += (a[i] - m) * (a[i] - m); return Math.sqrt(s / (n - 1)); }
/* dérivée (Δy/ΔV) entre une ligne et la précédente */
function cxDer(r, R, k) { R = R || []; var i = R.indexOf(r); if (i < 1) return NaN; var dv = r.V - R[i - 1].V; return dv > 0 ? (r[k] - R[i - 1][k]) / dv : NaN; }
/* volume au milieu de l'intervalle où |Δy/ΔV| est le plus grand */
function cxMid(R, k) { var b = -1, v = NaN; for (var i = 1; i < (R || []).length; i++) { var d = Math.abs((R[i][k] - R[i - 1][k]) / (R[i].V - R[i - 1].V)); if (isFinite(d) && d > b) { b = d; v = (R[i].V + R[i - 1].V) / 2; } } return v; }
function cxNear(R, v) { var b = R[0]; for (var i = 1; i < R.length; i++) if (Math.abs(R[i].V - v) < Math.abs(b.V - v)) b = R[i]; return b; }

/* TP C1 : sécurité — réactifs (pictogrammes SGH présents sur l'étiquette), situations, déchets, équipements */
var CX_PICTO = ["SGH01", "SGH02", "SGH03", "SGH04", "SGH05", "SGH06", "SGH07", "SGH08", "SGH09"];
var CX_REAC = [
  { n: "Acide chlorhydrique à 37 %", f: "HCl", p: ["SGH05", "SGH07"], h: "H290 · H314 · H335" },
  { n: "Hydroxyde de sodium (pastilles)", f: "NaOH", p: ["SGH05"], h: "H290 · H314" },
  { n: "Permanganate de potassium", f: "KMnO₄", p: ["SGH03", "SGH07", "SGH08", "SGH09"], h: "H272 · H302 · H361d · H410" },
  { n: "Eau de Javel à 9,6 % de chlore actif", f: "NaClO", p: ["SGH05", "SGH09"], h: "H314 · H410 · EUH031" },
  { n: "Dichromate de potassium", f: "K₂Cr₂O₇", p: ["SGH03", "SGH05", "SGH06", "SGH08", "SGH09"], h: "H272 · H301 · H314 · H330 · H340 · H350 · H360FD · H410" },
  { n: "Eau oxygénée à 30 %", f: "H₂O₂", p: ["SGH05", "SGH07"], h: "H302 · H318 · H335" }
];
/* zones des équipements de sécurité sur le plan de la salle (coordonnées relatives 0–1) */
var CX_EQUIP = [
  { k: "douche", n: "Douche de sécurité", x: 0.08, y: 0.20 },
  { k: "oeil", n: "Rince-œil", x: 0.30, y: 0.12 },
  { k: "extinct", n: "Extincteur à CO₂", x: 0.92, y: 0.22 },
  { k: "couv", n: "Couverture anti-feu", x: 0.92, y: 0.58 },
  { k: "secours", n: "Trousse de secours", x: 0.56, y: 0.10 },
  { k: "hotte", n: "Hotte aspirante", x: 0.10, y: 0.74 },
  { k: "dechets", n: "Bidons de collecte des déchets", x: 0.60, y: 0.88 }
];
function cxEquipOK(r) { for (var i = 0; i < CX_EQUIP.length; i++) { var e = CX_EQUIP[i]; if (e.k === r.k) return Math.abs(r.x - e.x) <= 0.07 && Math.abs(r.y - e.y) <= 0.09; } return false; }

/* TP C3.1 : 10,0 mL d'acide éthanoïque + 20 mL d'eau, soude 0,100 mol/L ; virage noté pour chaque indicateur */
var CX_IND = { ph: { n: "phénolphtaléine", z: "8,2 – 10,0", t: 8.2 }, bbt: { n: "bleu de bromothymol", z: "6,0 – 7,6", t: 7.0 }, hel: { n: "hélianthine", z: "3,1 – 4,4", t: 4.4 } };
function cxColoPH(P, V) { var Vt = 30 + V; return cxPH(0.1 * V / Vt, 0, P.cw * 10 / Vt, 0, P.pKa); }
function cxColoEnd(P, ind) { return cxCross(function (V) { return cxColoPH(P, V); }, CX_IND[ind].t, 1); }

/* TP C3.2 : 20,0 mL d'acide + 50 mL d'eau, soude 0,100 mol/L (B : CH₃COOH ; C : HCl) */
function cxPhmPH(P, part, V) { var Vt = 70 + V; return part === "B" ? cxPH(0.1 * V / Vt, 0, P.cw * 20 / Vt, 0, P.pKa) : cxPH(0.1 * V / Vt, P.ca * 20 / Vt, 0, 0); }

/* TP C4 : A — 10,0 mL de HCl + 20 mL d'eau, soude 0,100 mol/L ; B — m g d'échantillon + 25,0 mL de HCl (+ 25 mL d'eau), dosage en retour */
function cxCaN(P, m) { return m * P.pur / 100.09; }   // mol de CaCO₃ dans la masse m (g)
function cxCaPH(P, part, V, m, bo) {
  if (part === "A") { var Vt = 30 + V; return cxPH(0.1 * V / Vt, P.cH * 10 / Vt, 0, 0); }
  var n = cxCaN(P, m) * 1000, Vt2 = 50 + V;   // mmol ; mL
  return cxPH((2 * n + 0.1 * V) / Vt2, P.cH * 25 / Vt2, 0, (bo ? 0 : 0.15) * n / Vt2);
}
function cxCaEnd(P, part, m, bo) { return cxCross(function (V) { return cxCaPH(P, part, V, m, bo); }, 8.2, 1); }

/* TP C5 : conductimétrie — 20,0 mL d'acide + 200 mL d'eau, soude 0,100 mol/L ; σ en mS/cm */
var CX_AF = 1.41 / (10 * 0.01 * (7.35 + 7.6));
function cxSig(cs, cw, V) {
  var Vt = 220 + V, Na = 0.1 * V / Vt, Cl = cs * 20 / Vt, W = cw * 20 / Vt, pH = cxPH(Na, Cl, W, 0), h = Math.pow(10, -pH), Ka = Math.pow(10, -4.76), A = W * Ka / (Ka + h);
  return CX_AF * 10 * (35 * h + 19.8 * CXKW / h + 5 * Na + 7.6 * Cl + 4.1 * A);
}

/* TP C6 : solubilité de Ca(OH)₂ (mol/L) à la température T, dans l'eau puis dans CaCl₂ à 0,100 mol/L ;
   dosage de 10,0 mL de filtrat + 20 mL d'eau par HCl à 0,0500 mol/L */
var CX_C0 = 0.100;
function cxS1(T) { return 0.0200 - 0.00018 * (T - 25); }
function cxS2(T) { var s = cxS1(T), Ks = 4 * s * s * s, lo = 0, hi = s; for (var i = 0; i < 60; i++) { var m = (lo + hi) / 2; if ((CX_C0 + m) * 4 * m * m > Ks) hi = m; else lo = m; } return (lo + hi) / 2; }
function cxKspPH(cOH, V) { var Vt = 30 + V; return cxPH(cOH * 10 / Vt, 0.05 * V / Vt, 0, 0); }
function cxKspEnd(P, part) { var c = 2 * (part === "A" ? cxS1(P.T) : cxS2(P.T)); return cxCross(function (V) { return cxKspPH(c, V); }, 8.2, -1); }

/* TP C7 : eau de Javel diluée (10,0 mL → Vf mL), 10,0 mL dosés par le thiosulfate ; amidon ajouté trop tôt : +0,15 mL */
function cxJavEnd(P, Vf, tot) { return 2 * P.cj * 10 / Vf * 10 / P.ct + (tot ? 0.15 : 0); }

/* TP C8 : eau oxygénée diluée (10,0 mL → Vf mL), 10,0 mL dosés par KMnO₄ */
function cxH2End(P, Vf) { return 2 * (P.tv / 11.2) * 10 / Vf * 10 / (5 * P.c); }

/* TP C9 : A — 10,0 mL de sel de Mohr par KMnO₄ ; B — 10,0 mL de dichromate + VF mL de sel de Mohr, excès de Fe²⁺ par KMnO₄ */
function cxDiEnd(P, part, VF) { return part === "A" ? P.cF * 10 / (5 * P.cM) : (P.cF * VF - 6 * P.cD * 10) / (5 * P.cM); }

/* TP C10 : 20,0 mL de Fe²⁺ + H₂SO₄, KMnO₄ ; électrode de platine contre électrode au calomel saturé (0,244 V) ; E en mV */
function cxPotE(P, V) {
  var nFe = P.cFe * 20, nMn = P.cM * V, E1 = P.E0, E2 = 1.51, lo = 0, hi = 2;
  /* équilibre : Fe³⁺ (traces initiales 0,2 % + 5 par Mn²⁺ formé) et rapports fixés par E (Nernst, pH ≈ 0) */
  for (var i = 0; i < 70; i++) {
    var E = (lo + hi) / 2, r1 = Math.pow(10, (E - E1) / 0.059), r2 = Math.pow(10, 5 * (E - E2) / 0.059);
    var f = nFe * r1 / (1 + r1) - 0.002 * nFe - 5 * nMn / (1 + r2);
    if (f > 0) hi = E; else lo = E;
  }
  return 1000 * ((lo + hi) / 2 - 0.244);
}
