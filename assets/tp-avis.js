/* Questionnaire « Ton avis sur le TP » : proposé après la soumission du compte rendu.
   Les réponses vont dans l'onglet « Avis TP n » du tableur de l'enseignant (action « avis » du correcteur, v2.21 et plus).
   Pour ajouter un TP : une entrée dans AVIS (id du TP → questions propres), les questions communes sont ajoutées automatiquement. */
(function () {
  "use strict";
  const ACCORD = ["Pas du tout d'accord", "Plutôt pas d'accord", "Plutôt d'accord", "Tout à fait d'accord"];
  const SAVOIR = ["Pas du tout", "Un peu", "Bien", "Très bien"];
  const DEBUT = [
    { id: "note", t: "note", q: "Globalement, ce TP t'a plu ?", lab: "Note globale (1 à 5)" },
    { id: "diff", t: "choix", q: "Comment as-tu trouvé ce TP ?", o: ["Très facile", "Facile", "Moyen", "Difficile", "Très difficile"], lab: "Difficulté" },
    { id: "duree", t: "choix", q: "Le temps prévu était…", o: ["Trop court", "Suffisant", "Trop long"], lab: "Durée" },
    { id: "app", t: "choix", q: "Sur quel appareil as-tu fait le TP ?", o: ["Ordinateur", "Tablette", "Téléphone"], lab: "Appareil" }
  ];
  const FIN = [
    { id: "pres", t: "echelle", o: ACCORD, q: "La présentation faite avant le TP m'a aidée à le réussir.", lab: "Présentation utile" },
    { id: "simu", t: "echelle", o: ACCORD, q: "Le simulateur était facile à utiliser.", lab: "Simulateur facile" },
    { id: "pb", t: "multi", q: "As-tu eu des problèmes techniques ? (plusieurs réponses possibles)", o: ["Aucun", "Page lente", "Affichage mal adapté à l'écran", "Connexion internet", "Mesures ou réponses perdues", "Autre"], lab: "Problèmes techniques" },
    { id: "aide", t: "texte", q: "Qu'est-ce qui t'a le plus aidée ?", lab: "Ce qui a aidé", opt: true },
    { id: "ameliorer", t: "texte", q: "Que faudrait-il améliorer ? Une question restée sans réponse ?", lab: "À améliorer", opt: true }
  ];
  const AVIS = {
    mesures: [
      { id: "partie", t: "choix", q: "Quelle partie a été la plus difficile pour toi ?", o: ["A — Tensions", "B — Intensité", "C — Résistances", "Les calculs", "Le QCM"], lab: "Partie la plus difficile" },
      { t: "titre", q: "Après ce TP, je sais…" },
      { id: "s_cal", t: "echelle", o: SAVOIR, q: "choisir le meilleur calibre (le plus petit sans « OL »)", lab: "Sait : meilleur calibre" },
      { id: "s_lec", t: "echelle", o: SAVOIR, q: "quelle valeur recopier : la lecture de l'écran, pas le calibre", lab: "Sait : valeur à recopier" },
      { id: "s_D", t: "echelle", o: SAVOIR, q: "trouver la résolution D d'un calibre dans le tableau", lab: "Sait : résolution D" },
      { id: "s_inc", t: "echelle", o: SAVOIR, q: "calculer une incertitude (ΔU, ΔI, ΔR)", lab: "Sait : incertitude" },
      { id: "s_serie", t: "echelle", o: SAVOIR, q: "brancher un ampèremètre en série", lab: "Sait : ampèremètre en série" },
      { id: "s_coul", t: "echelle", o: SAVOIR, q: "lire le code des couleurs, avec le multiplicateur (3ᵉ anneau)", lab: "Sait : code des couleurs" },
      { id: "s_unit", t: "echelle", o: SAVOIR, q: "convertir les unités (kΩ en Ω, A en mA)", lab: "Sait : unités" },
      { id: "vrai", t: "choix", q: "Pourrais-tu maintenant mesurer une tension avec un vrai multimètre ?", o: ["Oui, seule", "Oui, avec un peu d'aide", "Non, pas encore"], lab: "Prête pour un vrai multimètre" }
    ]
  };
  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const qs = tp => AVIS[tp] ? DEBUT.concat(AVIS[tp], FIN) : null;
  const get = k => { try { return JSON.parse(localStorage.getItem("tp2_avis_" + k)); } catch (e) { return null; } };
  const put = (k, v) => { try { localStorage.setItem("tp2_avis_" + k, JSON.stringify(v)); } catch (e) {} };

  function field(T, q, i, v) {
    const n = `${T}-av-${q.id}`;
    if (q.t === "titre") return `<p class="av-tit">${esc(q.q)}</p>`;
    if (q.t === "texte") return `<label class="av-q"><span>${esc(q.q)}${q.opt ? ' <i>(facultatif)</i>' : ""}</span><textarea name="${n}" rows="2" maxlength="600">${esc(v || "")}</textarea></label>`;
    if (q.t === "note") return `<fieldset class="av-q"><legend>${esc(q.q)}</legend><div class="av-stars">${[1, 2, 3, 4, 5].map(k => `<label title="${k}/5"><input type="radio" name="${n}" value="${k}"${+v === k ? " checked" : ""}><span>★</span></label>`).join("")}</div></fieldset>`;
    const multi = q.t === "multi", sc = q.t === "echelle";
    return `<fieldset class="av-q${sc ? " av-sc" : ""}"><legend>${esc(q.q)}</legend><div class="av-opts">${q.o.map(o => `<label><input type="${multi ? "checkbox" : "radio"}" name="${n}" value="${esc(o)}"${(multi ? (v || []).includes(o) : v === o) ? " checked" : ""}><span>${esc(o)}</span></label>`).join("")}</div></fieldset>`;
  }
  function read(box, T, Q) {
    const r = {};
    Q.forEach(q => { if (!q.id) return; const n = `${T}-av-${q.id}`;
      if (q.t === "texte") r[q.id] = box.querySelector(`[name="${n}"]`).value.trim();
      else if (q.t === "multi") r[q.id] = [...box.querySelectorAll(`[name="${n}"]:checked`)].map(e => e.value);
      else { const e = box.querySelector(`[name="${n}"]:checked`); r[q.id] = e ? e.value : ""; } });
    return r;
  }

  /* o : { tp, lab, after (élément après lequel insérer), session: { carte, code }, post(obj) → Promise, device } */
  function mount(o) {
    const Q = qs(o.tp); if (!Q || !o.after || !o.session) return;
    const id = o.tp + "-avis", k = o.tp + "_" + o.session.carte; let box = document.getElementById(id);
    if (!box) { box = document.createElement("section"); box.id = id; box.className = "avis noprint"; o.after.insertAdjacentElement("afterend", box); }
    const sent = get(k + "_ok"), draft = get(k) || {};
    if (sent) { box.innerHTML = `<div class="av-done"><b>Merci pour ton avis sur le TP n°${esc(o.lab)} !</b> <span>Envoyé le ${esc(new Date(sent).toLocaleString("fr-FR"))}.</span> <button type="button" class="btn" id="${id}-edit">Modifier mes réponses</button></div>`;
      box.querySelector("#" + id + "-edit").onclick = () => { put(k + "_ok", null); mount(o); }; return; }
    box.innerHTML = `<h3>Ton avis sur le TP n°${esc(o.lab)}</h3>
      <p class="hint">2 à 3 minutes. Tes réponses aident ton enseignant à améliorer le TP et les explications. <b>Elles n'ont aucun effet sur ta note.</b></p>
      <form class="av-form">${Q.map((q, i) => field(o.tp, q, i, draft[q.id])).join("")}
      <div class="row"><button type="submit" class="btn primary">Envoyer mon avis</button></div><p class="msg" id="${id}-msg"></p></form>`;
    const f = box.querySelector("form"), msg = box.querySelector("#" + id + "-msg");
    f.addEventListener("change", () => put(k, read(box, o.tp, Q)));
    f.addEventListener("input", () => put(k, read(box, o.tp, Q)));
    f.onsubmit = async e => {
      e.preventDefault(); const r = read(box, o.tp, Q);
      const manque = Q.filter(q => q.id && !q.opt && (q.t === "multi" ? !r[q.id].length : !r[q.id]));
      box.querySelectorAll(".av-q").forEach(x => x.classList.remove("av-miss"));
      if (manque.length) { manque.forEach(q => { const x = box.querySelector(`[name="${o.tp}-av-${q.id}"]`); if (x) x.closest(".av-q").classList.add("av-miss"); });
        msg.textContent = `Il reste ${manque.length} question${manque.length > 1 ? "s" : ""} sans réponse (encadrée${manque.length > 1 ? "s" : ""} en rouge).`; msg.className = "msg bad";
        box.querySelector(".av-miss").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
      const btn = f.querySelector("button[type=submit]"); btn.disabled = true; msg.textContent = "Envoi…"; msg.className = "msg";
      const rep = Q.filter(q => q.id).map(q => [q.lab, Array.isArray(r[q.id]) ? r[q.id].join(" ; ") : r[q.id]]);
      try {
        const R = await o.post({ action: "avis", tp: o.tp, carte: o.session.carte, code: o.session.code, device: o.device, rep });
        if (R && R.ok) { put(k + "_ok", new Date().toISOString()); mount(o); box.scrollIntoView({ behavior: "smooth", block: "center" }); }
        else { btn.disabled = false; msg.textContent = (R && R.error) || "L'envoi a échoué. Réessaie dans un instant."; msg.className = "msg bad"; }
      } catch (err) { btn.disabled = false; msg.textContent = "Pas de connexion internet : tes réponses sont gardées sur cet appareil, réessaie plus tard."; msg.className = "msg bad"; }
    };
  }
  window.TPAvis = { mount, questions: qs };
})();
