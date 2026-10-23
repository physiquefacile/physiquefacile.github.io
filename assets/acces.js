/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* =====================================================================
   ACCÈS À LA PLATEFORME — numéro de carte étudiant + code personnel
   ---------------------------------------------------------------------
   Chargé en tête de chaque page, juste après config.js.
   - Sans session valide sur cet appareil, la page est masquée et remplacée par l'écran de connexion.
   - La connexion est vérifiée par le correcteur (Google Apps Script), avec la même liste « Étudiants »
     et les mêmes codes personnels que pour les TP : une seule connexion vaut pour tout le site.
   - Une fois connecté, le site reste accessible hors connexion ; la session est revérifiée en arrière-plan
     une fois par jour quand internet est disponible (un étudiant retiré de la liste perd l'accès).
   ===================================================================== */
(function () {
  "use strict";
  var KEY = "tp2_session", CHECK = "tp2_acces_verif", JOUR = 24 * 3600 * 1000;
  var html = document.documentElement;

  function lire(k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function session() { var s = lire(KEY); return s && s.etudiant && s.tps && typeof s.tps === "object" ? s : null; }
  function appareil() { var d = lire("tp2_device"); if (!d) { d = Math.random().toString(36).slice(2, 10) + Date.now().toString(36); ecrire("tp2_device", d); } return d; }
  function effacer() { try { Object.keys(localStorage).filter(function (k) { return k.indexOf("tp2_") === 0 && k !== "tp2_device"; }).forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {} }
  function adresse() { return (window.SITE_CONFIG || {}).crEndpoint; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* appel au correcteur, avec quelques nouveaux essais si le serveur est occupé */
  function appel(o, essais) {
    essais = essais || 4;
    var k = 0;
    return new Promise(function (ok, ko) {
      (function un() {
        k++;
        fetch(adresse(), { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(o) })
          .then(function (r) { return r.json(); }).catch(function () { return null; })
          .then(function (R) {
            if (R && !R.busy) return ok(R);
            if (k >= essais) return R ? ok(R) : ko(new Error("réseau"));
            setTimeout(un, 2500 * k + Math.random() * 2000);
          });
      })();
    });
  }

  /* ---------- styles de l'écran de connexion ---------- */
  var css = document.createElement("style");
  css.textContent =
    "html.acces-lock body>*:not(#acces){display:none!important}html.acces-lock body{overflow:hidden}" +
    "#acces{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:16px;overflow:auto;background:var(--band,#1B2A41)}" +
    "#acces .ac-card{width:100%;max-width:420px;background:var(--surface,#fff);color:var(--fg,#1B2A41);border-radius:14px;padding:26px 24px;display:grid;gap:14px;box-shadow:0 10px 40px rgba(0,0,0,.35);border-top:5px solid var(--saff,#D98E04)}" +
    "#acces .ac-uni{font-family:var(--f-head,Arial);font-weight:700;letter-spacing:.08em;font-size:.74rem;color:var(--saff,#D98E04)}" +
    "#acces h1{font-family:var(--f-head,Arial);font-size:1.45rem;line-height:1.2;margin:0}" +
    "#acces p{margin:0;font-size:.95rem;line-height:1.5;color:var(--muted,#5A6472)}" +
    "#acces label{display:grid;gap:5px;font-family:var(--f-head,Arial);font-size:.86rem;font-weight:600}" +
    "#acces input{font:inherit;font-family:var(--f-mono,monospace);font-size:1.05rem;letter-spacing:.04em;padding:10px 12px;border:1.5px solid var(--line,#DDE2E7);border-radius:9px;background:var(--bg,#F6F7F8);color:var(--fg,#1B2A41);width:100%;box-sizing:border-box}" +
    "#acces input:focus{outline:none;border-color:var(--accent,#1F7A8C)}" +
    "#acces button{font-family:var(--f-head,Arial);font-weight:700;font-size:1rem;padding:11px 14px;border:0;border-radius:9px;background:var(--accent,#1F7A8C);color:var(--accent-fg,#fff);cursor:pointer}" +
    "#acces button:disabled{opacity:.6;cursor:wait}" +
    "#acces .ac-msg{font-family:var(--f-head,Arial);font-size:.88rem;min-height:1.2em;color:var(--ko,#B23A48)}" +
    "#acces .ac-msg.ok{color:var(--ok,#2E7D4F)}" +
    "#acces .ac-aide{font-size:.82rem;border-top:1px solid var(--line,#DDE2E7);padding-top:10px}" +
    ".acces-who{font-family:var(--f-head,Arial)}.acces-who button{font:inherit;background:none;border:0;padding:0;color:inherit;text-decoration:underline;cursor:pointer}";
  document.head.appendChild(css);

  var ACTIF = (window.SITE_CONFIG || {}).accesReserve !== false;   // interrupteur dans assets/config.js
  if (!ACTIF) return;
  var S = session();
  if (!S) html.classList.add("acces-lock");

  function ecran() {
    if (document.getElementById("acces")) return;
    var d = document.createElement("div");
    d.id = "acces";
    d.setAttribute("role", "dialog");
    d.setAttribute("aria-modal", "true");
    d.setAttribute("aria-labelledby", "acTitre");
    d.innerHTML =
      '<form class="ac-card" id="acForm" autocomplete="on">' +
      '<div class="ac-uni">' + esc(window.SITE_ORG || "UNIVERSITÉ SOULEYMANE NIANG DE MATAM • PHYSIQUE L1") + '</div>' +
      '<h1 id="acTitre">Physique Facile — accès réservé</h1>' +
      "<p>Cette plateforme est réservée aux étudiants inscrits. Connecte-toi avec ton <b>numéro de carte étudiant</b> et le <b>code personnel</b> remis par ton enseignant (le même que pour les TP).</p>" +
      '<label>N° de carte étudiant<input id="acCarte" name="username" autocomplete="username" inputmode="text" required></label>' +
      '<label>Code personnel<input id="acCode" name="password" type="password" autocomplete="current-password" required></label>' +
      '<button type="submit" id="acGo">Se connecter</button>' +
      '<div class="ac-msg" id="acMsg" role="status"></div>' +
      '<p class="ac-aide">Pas encore de code, ou code oublié ? Adresse-toi à ton enseignant. Une seule connexion suffit : ensuite, le site reste accessible sur cet appareil, même sans internet.</p>' +
      "</form>";
    document.body.appendChild(d);
    var f = d.querySelector("#acForm"), m = d.querySelector("#acMsg"), b = d.querySelector("#acGo");
    setTimeout(function () { try { d.querySelector("#acCarte").focus(); } catch (e) {} }, 50);
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var carte = d.querySelector("#acCarte").value.trim(), code = d.querySelector("#acCode").value.trim().toUpperCase();
      if (!carte || !code) { m.className = "ac-msg"; m.textContent = "Indique ton numéro de carte et ton code personnel."; return; }
      if (!adresse()) { m.className = "ac-msg"; m.textContent = "Le service de connexion n'est pas encore configuré."; return; }
      if (!navigator.onLine) { m.className = "ac-msg"; m.textContent = "Pas de connexion internet : la première connexion nécessite internet."; return; }
      b.disabled = true; m.className = "ac-msg ok"; m.textContent = "Vérification…";
      appel({ action: "login", carte: carte, code: code, device: appareil() }, 5).then(function (R) {
        b.disabled = false;
        if (!R || !R.ok || !R.etudiant || !R.tps) { m.className = "ac-msg"; m.textContent = (R && R.error) || "Connexion impossible. Réessaie dans un instant."; return; }
        var old = session();
        if (!old || old.etudiant.carte !== R.etudiant.carte) effacer();
        ecrire(KEY, { etudiant: R.etudiant, code: code, tps: R.tps, at: new Date().toISOString(), skew: Date.parse(R.serveur) - Date.now() || 0 });
        ecrire(CHECK, Date.now());
        m.className = "ac-msg ok"; m.textContent = "Bienvenue " + (R.etudiant.prenom || "") + " !";
        setTimeout(function () { location.reload(); }, 400);
      }, function () {
        b.disabled = false; m.className = "ac-msg"; m.textContent = "Le serveur ne répond pas. Vérifie ta connexion internet puis réessaie.";
      });
    });
  }

  /* nom de l'étudiant et bouton de déconnexion dans le pied de page */
  function piedDePage() {
    var s = session(), f = document.querySelector("footer .wrap");
    if (!s || !f || f.querySelector(".acces-who")) return;
    var sp = document.createElement("span");
    sp.className = "acces-who";
    sp.innerHTML = " • Connecté : " + esc((s.etudiant.prenom || "") + " " + (s.etudiant.nom || "")) + " (" + esc(s.etudiant.carte) + ") — <button type=\"button\">Se déconnecter</button>";
    sp.querySelector("button").onclick = function () {
      if (!confirm("Se déconnecter de la plateforme ? Les mesures de TP non soumises enregistrées sur cet appareil seront effacées.")) return;
      effacer(); location.reload();
    };
    f.appendChild(sp);
  }

  /* revérification discrète, au plus une fois par jour */
  function verifier() {
    var s = session(); if (!s || !adresse() || !navigator.onLine) return;
    var t = +lire(CHECK) || 0; if (Date.now() - t < JOUR) return;
    appel({ action: "login", carte: s.etudiant.carte, code: s.code, device: appareil() }, 2).then(function (R) {
      if (!R) return;
      if (R.ok && R.tps) { ecrire(KEY, Object.assign({}, s, { etudiant: R.etudiant || s.etudiant, tps: R.tps })); ecrire(CHECK, Date.now()); return; }
      // retrait de la liste ou changement de code : l'accès est fermé (pas en cas de simple blocage temporaire)
      if (!R.busy && R.error && /inscrit|incorrect|attribué/i.test(R.error)) { effacer(); location.reload(); }
    }, function () {});
  }

  function pret() { if (!session()) ecran(); else { piedDePage(); verifier(); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", pret); else pret();
})();
