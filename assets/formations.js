/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* =====================================================================
   FORMATIONS — rattachement des quiz, entraînements et simulations
   ---------------------------------------------------------------------
   - La formation choisie (PCI, BCG, MI) est mémorisée sur l'appareil (clé « formation ») et partagée
     par toutes les pages : accueil, quiz, entraînement, simulations.
   - Pour chaque formation : ses EC et leurs chapitres. « res » liste les clés de quiz / d'entraînement
     (mêmes clés : meca1, elec4, opt5…) et « sims » les simulations qui traitent le même sujet.
     Une ressource déjà écrite pour la PCI peut ainsi servir à un chapitre BCG ou MI (ressource commune).
   - Un chapitre sans ressource est affiché « à venir ». Pour en ajouter : compléter « res » ou « sims ».
   ===================================================================== */
(function () {
  "use strict";
  var F = {
    PCI: { tab: "Licence PCI", short: "L1 PCI",
      line: "Licence Physique-Chimie et Informatique (LPCI) • L1 (semestres 1 et 2)",
      ecs: [
        { code: "LPCI1121", title: "Mécanique 1", ch: [
          { n: 1, t: "Calcul vectoriel", res: ["meca1"] },
          { n: 2, t: "Cinématique du point", res: ["meca2"], sims: ["frenet"] },
          { n: 3, t: "Dynamique du point matériel", res: ["meca3"] },
          { n: 4, t: "Travail et énergie", res: ["meca4"], sims: ["energie"] } ] },
        { code: "LPCI1122", title: "Électricité 1", ch: [
          { n: 1, t: "Généralités sur l'électrostatique", res: ["elec1"], sims: ["champ"] },
          { n: 2, t: "Champ et potentiel électrostatiques", res: ["elec2"], sims: ["champ", "anneau", "boule"] },
          { n: 3, t: "Le dipôle électrostatique", res: ["elec3"], sims: ["dipole"] },
          { n: 4, t: "Électrocinétique", res: ["elec4"] } ] },
        { code: "LPCI1221", title: "Optique 1", ch: [
          { n: 1, t: "Lois fondamentales", res: ["opt1"], sims: ["refrac"] },
          { n: 2, t: "Formation des images", res: ["opt2"] },
          { n: 3, t: "Prisme et lame", res: ["opt3"], sims: ["prisme"] },
          { n: 4, t: "Miroirs et dioptres sphériques", res: ["opt4"], sims: ["miroir"] },
          { n: 5, t: "Lentilles minces", res: ["opt5"], sims: ["lentille"] } ] },
        { code: "LPCI1222", title: "Électricité 2", ch: [
          { n: 1, t: "Le champ magnétique", res: ["elec21"] } ] } ] },
    BCG: { tab: "Licence BCG", short: "L1 BCG (SVT)",
      line: "Licence Biologie, Chimie et Géologie (BCG) • Département SVT • L1 (semestres 1 et 2)",
      ecs: [
        { code: "LBCG1121", title: "Physique générale 1", ch: [
          { n: 1, t: "Outils de base et cinématique", res: ["bcgpg11", "meca1", "meca2"] },
          { n: 2, t: "Dynamique du point", res: ["bcgpg12", "meca3"] },
          { n: 3, t: "Travail, énergie et puissance", res: ["bcgpg13", "meca4"], sims: ["energie"] },
          { n: 4, t: "Mécanique des fluides", res: ["bcgpg14"] },
          { n: 5, t: "Optique géométrique", res: ["bcgpg15", "opt1", "opt5"], sims: ["refrac", "lentille", "miroir"] } ] },
        { code: "LBCG1221", title: "Physique générale 2", ch: [
          { n: 1, t: "Température et chaleur", res: ["bcgpg21"] },
          { n: 2, t: "Gaz parfait et premier principe", res: ["bcgpg22"] },
          { n: 3, t: "Électrostatique", res: ["bcgpg23", "elec1", "elec2"], sims: ["champ"] },
          { n: 4, t: "Électrocinétique", res: ["bcgpg24", "elec4"] },
          { n: 5, t: "Oscillations et ondes mécaniques", res: ["bcgpg25"] } ] },
        { code: "LBCG1223", title: "Biophysique", ch: [
          { n: 1, t: "Phénomènes de transport", res: ["bcgbio1"] },
          { n: 2, t: "Bioélectricité", res: ["bcgbio2"] },
          { n: 3, t: "Rayonnements électromagnétiques", res: ["bcgbio3"] },
          { n: 4, t: "Radioactivité", res: ["bcgbio4"] },
          { n: 5, t: "Ultrasons", res: ["bcgbio5"] } ] } ] },
    MI: { tab: "Licence MI", short: "L2 MI",
      line: "Licence Mathématiques et Informatique (MI) • L2 (semestre 4, options RISE et SDC)",
      ecs: [
        { code: "INFO246b1", title: "Électricité 1 (RISE)", ch: [
          { n: 1, t: "Grandeurs électriques", res: ["elec4"] },
          { n: 2, t: "Circuits en régime continu", res: ["elec4"] },
          { n: 3, t: "Régimes transitoires" },
          { n: 4, t: "Régime sinusoïdal" },
          { n: 5, t: "Filtrage" } ] },
        { code: "INFO246b2", title: "Électronique 1 (RISE)", ch: [
          { n: 1, t: "Semi-conducteurs et diode" },
          { n: 2, t: "Alimentations" },
          { n: 3, t: "Transistor bipolaire" },
          { n: 4, t: "Amplificateur opérationnel" },
          { n: 5, t: "De l'analogique au numérique" } ] },
        { code: "INFO246c1", title: "Électricité - Électronique (SDC)", ch: [
          { n: 1, t: "Circuits en continu", res: ["elec4"] },
          { n: 2, t: "Circuits RC" },
          { n: 3, t: "Filtrage" },
          { n: 4, t: "Composants" },
          { n: 5, t: "Chaîne d'acquisition" } ] },
        { code: "INFO246c2", title: "Physique quantique (SDC)", ch: [
          { n: 1, t: "Limites de la physique classique" },
          { n: 2, t: "Dualité onde-corpuscule" },
          { n: 3, t: "Équation de Schrödinger" },
          { n: 4, t: "L'atome d'hydrogène" },
          { n: 5, t: "Information quantique" } ] } ] }
  };
  var KEY = "formation";
  function get() {
    var q = (location.search.match(/[?&]f=(PCI|BCG|MI)\b/) || [])[1];
    if (q) { set(q); return q; }
    try { var v = localStorage.getItem(KEY); if (F[v]) return v; } catch (e) {}
    return "PCI";
  }
  function set(f) { try { if (F[f]) localStorage.setItem(KEY, f); } catch (e) {} }
  // clés (quiz / entraînement) ou simulations utilisées par une formation, dans l'ordre des EC
  function used(f, field) {
    var out = [];
    F[f].ecs.forEach(function (ec) { ec.ch.forEach(function (c) { (c[field] || []).forEach(function (k) { if (out.indexOf(k) < 0) out.push(k); }); }); });
    return out;
  }
  // barre « Formation : PCI | BCG | MI » ; onChange(f) est appelé après le changement
  function bar(el, onChange) {
    var cur = get();
    el.innerHTML = '<span class="fl">Formation</span>' + Object.keys(F).map(function (k) {
      return '<button type="button" class="form" data-f="' + k + '" aria-pressed="' + (k === cur) + '">' + F[k].tab + '</button>';
    }).join("");
    el.onclick = function (e) {
      var b = e.target.closest("[data-f]"); if (!b) return;
      set(b.dataset.f); bar(el, onChange); if (onChange) onChange(b.dataset.f);
    };
  }
  // ligne « UNIVERSITÉ… • UFR-STI • L1 PCI » des en-têtes
  function uni(f) {
    var u = document.querySelector(".uni");
    if (!u) return;
    var t = u.lastChild;
    if (t && t.nodeType === 3) t.nodeValue = t.nodeValue.replace(/•\s*UFR-STI.*$/, "• UFR-STI • " + F[f].short);
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  // choix du chapitre groupé par EC (quiz, entraînement).
  // o = { has(k) : la ressource existe, cur : clé active, sub(k) : sous-titre, extra(k) : HTML ajouté (score…) }
  function picker(f, o) {
    return F[f].ecs.map(function (ec) {
      var items = ec.ch.map(function (c) {
        var ks = (c.res || []).filter(o.has);
        var lab = "Ch. " + c.n + " · " + esc(c.t);
        if (!ks.length) return '<button type="button" class="pill soon" disabled>' + lab + '<span class="tg">à venir</span></button>';
        var pci = used("PCI", "res");
        return ks.map(function (k) {
          var shared = f !== "PCI" && pci.indexOf(k) >= 0;
          return '<button type="button" class="pill" data-k="' + k + '" aria-pressed="' + (k === o.cur) + '" title="' + esc(o.sub(k)) + '">' + lab +
            (ks.length > 1 && shared ? " (" + esc(o.sub(k)) + ")" : "") + (shared ? '<span class="tg">PCI</span>' : "") + (o.extra ? o.extra(k) : "") + "</button>";
        }).join("");
      }).join("");
      return '<div class="grp"><div class="grp-t">' + esc(ec.title) + " • " + ec.code + '</div><div class="pill-row">' + items + "</div></div>";
    }).join("") + (f !== "PCI" ? '<p class="fnote">Les ressources marquées PCI sont communes avec la Licence PCI : même notion, traitée au niveau L1 PCI, utiles pour aller plus loin. Les chapitres « à venir » recevront leurs propres ressources au fil du semestre.</p>' : "");
  }
  window.FORMATIONS = { data: F, get: get, set: set, used: used, bar: bar, uni: uni, picker: picker };
})();
