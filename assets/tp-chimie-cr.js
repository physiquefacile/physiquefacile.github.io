/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* Comptes rendus notés des TP de chimie : tableaux, calculs et questions.
   (Les valeurs attendues et les réponses des QCM sont uniquement sur le serveur de correction.) */
(function () {
  const fr = (x, d) => (x == null || !isFinite(x)) ? "—" : (+x).toFixed(d).replace(".", ",");
  window.TPCR = window.TPCR || {};
  window.TPCR.csecu = {
    parts: {
      A: { titre: "Pictogrammes des étiquettes", min: 6, need: { k: "r", vals: [0, 1, 2, 3, 4, 5], lab: v => CX_REAC[v].f }, aide: "Une ligne par réactif. Pour chaque pictogramme numéroté de l'étiquette, la classe de danger que tu as identifiée.", cols: ["Réactif", "Classes de danger identifiées (pictogramme n° → danger)"], cells: (r, i) => [CX_REAC[r.r].n, String(r.d).split(",").map((v, j) => (j + 1) + ". " + window.TPX.secu.DANGERS[+v]).join(" ; ")], r: {  }, fill: [] },
      B: { titre: "Situations de travail", min: 6, need: { k: "s", vals: [0, 1, 2, 3, 4, 5], lab: v => "situation " + (v + 1) }, cols: ["Situation", "Danger principal", "Prévention ou conduite à tenir"], cells: (r, i) => [window.TPX.secu.SITU[r.s].n, window.TPX.secu.DANGERS[r.d], window.TPX.secu.SITU[r.s].o[r.c]], r: {  }, fill: [] },
      C: { titre: "Tri des déchets", min: 7, need: { k: "w", vals: [0, 1, 2, 3, 4, 5, 6], lab: v => "déchet " + (v + 1) }, cols: ["Déchet", "Filière choisie"], cells: (r, i) => [window.TPX.secu.WASTES[r.w], window.TPX.secu.FILIERES[r.f]], r: {  }, fill: [] },
      D: { titre: "Équipements de sécurité repérés sur le plan", min: 7, need: { k: "k", vals: ["douche", "oeil", "extinct", "couv", "secours", "hotte", "dechets"], lab: v => CX_EQUIP.find(e => e.k === v).n }, cols: ["Équipement", "Position cliquée (x ; y)"], cells: (r, i) => [CX_EQUIP.find(e => e.k === r.k).n, fr(r.x, 2) + " ; " + fr(r.y, 2)], r: { x: 3, y: 3 }, fill: [] }
    },
    calc: [],
    qcm: [
      { q: "Le pictogramme représentant une flamme au-dessus d'un cercle signale un produit :", o: ["inflammable", "comburant", "explosif", "corrosif"] },
      { q: "Le pictogramme « corrosion » (liquide qui ronge une main et une surface) signale un produit qui :", o: ["est inflammable", "provoque des brûlures de la peau et des lésions oculaires graves", "est toxique pour l'environnement", "est sous pression"] },
      { q: "On prépare une solution diluée d'acide à partir d'acide concentré en versant :", o: ["l'eau dans l'acide", "l'acide dans l'eau, lentement et en agitant", "les deux en même temps", "l'acide sur la paillasse avant de le rincer"] },
      { q: "Il ne faut jamais pipeter à la bouche parce que :", o: ["c'est moins précis", "on risque d'avaler ou d'inhaler un produit dangereux", "la pipette se casse", "le volume est faux"] },
      { q: "Mélanger de l'eau de Javel avec un acide :", o: ["neutralise l'eau de Javel sans danger", "libère du dichlore, un gaz toxique", "produit de l'oxygène", "renforce son pouvoir désinfectant sans risque"] },
      { q: "Les déchets contenant du chrome(VI) :", o: ["peuvent être versés à l'évier après dilution", "sont collectés séparément car le chrome(VI) est toxique, cancérogène et dangereux pour l'environnement", "sont mélangés aux solvants organiques", "sont évaporés sous la hotte"] },
      { q: "En cas de projection d'un produit corrosif dans l'œil, il faut d'abord :", o: ["frotter l'œil", "rincer immédiatement et abondamment au rince-œil pendant au moins 15 minutes", "appliquer une pommade", "neutraliser avec un acide ou une base"] },
      { q: "La fiche de données de sécurité (FDS) d'un produit indique notamment :", o: ["son prix", "ses dangers, les protections à utiliser et la conduite à tenir en cas d'accident", "la date du prochain TP", "uniquement sa formule chimique"] },
      { q: "Le pictogramme « silhouette humaine avec une étoile sur la poitrine » signale :", o: ["un danger pour la santé à long terme (cancérogène, mutagène, toxique pour la reproduction…)", "un produit explosif", "un gaz sous pression", "un produit sans danger"] },
      { q: "Pour manipuler un produit qui dégage des vapeurs toxiques, on travaille :", o: ["près d'une fenêtre ouverte", "sous une hotte aspirante en marche, la vitre la plus basse possible", "dans le couloir", "sans précaution particulière si la quantité est faible"] },
      { q: "La mention de danger « H314 » signifie :", o: ["provoque des brûlures de la peau et des lésions oculaires graves", "liquide et vapeurs très inflammables", "nocif en cas d'ingestion", "très toxique pour les organismes aquatiques"] },
      { q: "Au laboratoire, les lunettes de protection se portent :", o: ["seulement pour manipuler des acides concentrés", "en permanence, dès qu'on est dans la salle de TP", "seulement pendant les chauffages", "uniquement si l'enseignant le demande"] }
    ]
  };
  window.TPCR.csol = {
    parts: {
      A: { titre: "Dissolution : 250,0 mL de NaCl à 0,100 mol/L", min: 1, aide: "<b>C₁ = m / (M × V)</b> avec M = 58,44 g/mol et V = 0,2500 L. Ex. m = 1,4588 g : C₁ = 1,4588 / (58,44 × 0,2500) = 0,09985 mol/L.", cols: ["Essai", "m pesée (g)", "V (mL)", "Bécher rincé"], cells: (r, i) => [i + 1, fr(r.m, 4), "250,0", r.ri ? "oui" : "non"], r: { m: 4, Vf: 2 }, fill: [{ k: "C", h: "C₁ = m/(M·V) (mol/L)", ref: r => r.m / (58.44 * 0.25), tol: 0.05, warn: "C₁ = m / (58,44 × 0,2500) : V en litres." }] },
      B: { titre: "Dilution : 100,0 mL à 0,0200 mol/L", min: 1, aide: "<b>C₂ = C₁ × V₁ / V₂</b>, avec C₁ la concentration réelle de ta solution mère (partie A).", cols: ["Essai", "V₁ prélevé (mL)", "V₂ de la fiole (mL)"], cells: (r, i) => [i + 1, fr(r.V1, 1), fr(r.V2, 1)], r: { Vf: 2 }, fill: [{ k: "C2", h: "C₂ = C₁·V₁/V₂ (mol/L)", warn: "C₂ = C₁ × V₁ / V₂ (C₁ : concentration réelle de la partie A)." }] }
    },
    calc: [{ k: "mth", h: "Masse théorique de NaCl pour 250,0 mL à 0,100 mol/L", u: "g" }, { k: "C1", h: "Concentration réelle de la solution mère (moyenne de la partie A)", u: "mol/L" }, { k: "V1", h: "Volume théorique de solution mère à prélever pour 100,0 mL à 0,0200 mol/L", u: "mL" }, { k: "C2", h: "Concentration réelle de la solution diluée", u: "mol/L" }, { k: "err", h: "Erreur relative de C₁ par rapport à 0,100 mol/L", u: "%" }],
    qcm: [
      { q: "La masse de soluté à peser pour préparer un volume V de solution de concentration C est :", o: ["m = C × V × M", "m = C / (V × M)", "m = M / (C × V)", "m = C × M / V"] },
      { q: "Lors d'une dilution, la grandeur qui se conserve est :", o: ["la concentration", "le volume", "la quantité de soluté", "la masse volumique"] },
      { q: "Pour préparer 100,0 mL à 0,0200 mol/L à partir d'une solution à 0,100 mol/L, on prélève :", o: ["5,0 mL", "20,0 mL", "50,0 mL", "2,0 mL"] },
      { q: "On rince le bécher et on verse les eaux de rinçage dans la fiole pour :", o: ["refroidir la solution", "transférer la totalité du soluté (transfert quantitatif)", "diluer davantage", "nettoyer la fiole"] },
      { q: "Si le ménisque dépasse le trait de jauge, la concentration obtenue est :", o: ["plus grande que prévu", "plus petite que prévu : la solution est à refaire", "inchangée", "impossible à prévoir"] },
      { q: "Le volume le plus précis s'obtient avec :", o: ["une éprouvette graduée", "un bécher", "une fiole jaugée", "un erlenmeyer"] },
      { q: "On complète au trait de jauge seulement après dissolution complète parce que :", o: ["la dissolution peut modifier le volume et la température", "c'est plus rapide", "le soluté ne se dissout pas sinon", "la fiole se casserait"] },
      { q: "Le trait de jauge est atteint quand :", o: ["le haut du ménisque est sur le trait", "le bas du ménisque est sur le trait, l'œil à sa hauteur", "le liquide touche le bouchon", "la fiole est à moitié pleine"] },
      { q: "Avant de peser un solide dans une coupelle, il faut :", o: ["tarer la balance avec la coupelle posée", "tarer la balance sans coupelle", "ne pas tarer", "peser la coupelle après le solide"] },
      { q: "La concentration molaire d'une solution contenant 2,922 g de NaCl (58,44 g/mol) dans 500 mL vaut :", o: ["0,0500 mol/L", "0,100 mol/L", "5,84 mol/L", "0,0250 mol/L"] },
      { q: "Si on oublie de rincer le bécher lors du transfert, la concentration réelle est :", o: ["plus grande que celle calculée", "plus petite que celle calculée", "égale à celle calculée", "nulle"] },
      { q: "Pour homogénéiser une solution dans une fiole jaugée, on :", o: ["l'agite avec une spatule", "la bouche et la retourne plusieurs fois", "la chauffe", "la laisse reposer une heure"] }
    ]
  };
  window.TPCR.ccolo = {
    parts: {
      A: { titre: "Dosages avec la phénolphtaléine", min: 3, aide: "Essai 1 : dosage rapide ; essais 2 et 3 : dosages précis (concordants à 0,1 mL près). <b>C_a = C_b × V_E / V_a</b> avec C_b = 0,100 mol/L et V_a = 10,0 mL. Ex. V_E = 9,85 mL ⇒ C_a = 0,0985 mol/L.", cols: ["Essai", "V_a (mL)", "V_E (mL)"], cells: (r, i) => [i + 1 + (i ? " (précis)" : " (rapide)"), fr(r.Va, 1), fr(r.V, 2)], r: { V: 2 }, fill: [{ k: "C", h: "C_a = C_b·V_E/V_a (mol/L)", ref: r => 0.1 * r.V / r.Va, tol: 0.02, warn: "C_a = 0,100 × V_E / 10,0 (volumes dans la même unité)." }] },
      B: { titre: "Comparaison des indicateurs", min: 3, need: { k: "ind", vals: ["ph", "bbt", "hel"], lab: v => CX_IND[v].n }, aide: "Concentration « apparente » calculée avec le volume au virage de chaque indicateur : <b>C = 0,100 × V / 10,0</b>. Seul l'indicateur dont la zone de virage contient le pH d'équivalence donne la bonne valeur.", cols: ["n°", "Indicateur", "V au virage (mL)"], cells: (r, i) => [i + 1, CX_IND[r.ind].n, fr(r.V, 2)], r: { V: 2 }, fill: [{ k: "C", h: "C apparente (mol/L)", ref: r => 0.01 * r.V, tol: 0.02, warn: "C = 0,100 × V / 10,0." }] }
    },
    calc: [{ k: "Vm", h: "Partie A : volume équivalent moyen des dosages précis", u: "mL" }, { k: "sd", h: "Partie A : écart-type des volumes des dosages précis", u: "mL" }, { k: "C", h: "Concentration de l'acide éthanoïque", u: "mol/L" }, { k: "Cm", h: "Concentration massique de l'acide éthanoïque (M = 60,05 g/mol)", u: "g/L" }, { k: "erH", h: "Partie B : écart relatif entre le volume au virage de l'hélianthine et V_E", u: "%" }],
    qcm: [
      { q: "La réaction de dosage de l'acide éthanoïque par la soude s'écrit :", o: ["CH₃COOH + HO⁻ → CH₃COO⁻ + H₂O", "CH₃COOH + H₂O → CH₃COO⁻ + H₃O⁺", "H₃O⁺ + HO⁻ → 2 H₂O seulement", "CH₃COO⁻ + H₃O⁺ → CH₃COOH + H₂O"] },
      { q: "À l'équivalence :", o: ["le pH vaut toujours 7", "l'acide et la base ont été introduits dans les proportions stœchiométriques", "l'indicateur vient d'être ajouté", "la burette est vide"] },
      { q: "Le pH à l'équivalence du dosage de l'acide éthanoïque par la soude est :", o: ["inférieur à 7", "égal à 7", "supérieur à 7 (environ 8,7)", "égal au pKa"] },
      { q: "L'indicateur le mieux adapté à ce dosage est :", o: ["l'hélianthine (3,1 – 4,4)", "le bleu de bromothymol (6,0 – 7,6)", "la phénolphtaléine (8,2 – 10,0)", "aucun indicateur ne convient"] },
      { q: "Avec l'hélianthine, le virage est observé :", o: ["bien avant l'équivalence", "exactement à l'équivalence", "après l'équivalence", "jamais"] },
      { q: "Le virage d'un indicateur et l'équivalence :", o: ["sont toujours confondus", "coïncident seulement si la zone de virage contient le pH d'équivalence", "n'ont aucun rapport", "sont confondus si on agite fort"] },
      { q: "Avec V_a = 10,0 mL et V_E = 9,60 mL de soude à 0,100 mol/L, C_a vaut :", o: ["0,0960 mol/L", "0,104 mol/L", "0,960 mol/L", "0,00960 mol/L"] },
      { q: "On agite pendant le dosage pour :", o: ["chauffer la solution", "que la soude réagisse avec tout l'acide (mélange homogène)", "faire mousser", "accélérer l'écoulement de la burette"] },
      { q: "Ajouter 20 mL d'eau dans l'erlenmeyer avant le dosage :", o: ["augmente V_E", "diminue V_E", "ne change pas V_E", "rend le dosage impossible"] },
      { q: "Le premier dosage, rapide, sert à :", o: ["obtenir le résultat final", "repérer approximativement V_E pour faire ensuite des dosages précis", "étalonner la burette", "vérifier l'indicateur"] },
      { q: "Avant de remplir la burette, on la rince avec :", o: ["de l'eau du robinet", "un peu de la solution titrante", "de l'acide", "de l'éthanol"] },
      { q: "La concentration massique d'un acide éthanoïque à 0,100 mol/L (M = 60,05 g/mol) vaut :", o: ["6,01 g/L", "0,60 g/L", "60,05 g/L", "1,67 g/L"] }
    ]
  };
  window.TPCR.cphm = {
    parts: {
      A: { titre: "Étalonnage du pH-mètre", min: 2, need: { k: "tp", vals: [7, 4], lab: v => "tampon pH " + v }, aide: "Note la lecture du pH-mètre dans chaque tampon <b>après</b> réglage : 7,00 dans le tampon pH 7 (bouton « zéro »), puis 4,00 dans le tampon pH 4 (bouton « pente »).", cols: ["n°", "Tampon", "Lecture du pH-mètre"], cells: (r, i) => [i + 1, "pH " + r.tp, fr(r.L, 2)], r: { L: 2 }, fill: [] },
      B: { titre: "Courbe pH = f(V) de l'acide éthanoïque", min: 20, aide: "<b>ΔpH/ΔV</b> se calcule entre chaque point et le <b>précédent</b> : (pH − pH précédent) / (V − V précédent), en mL⁻¹. Laisse vide la case de la 1ʳᵉ ligne. V_E est au milieu de l'intervalle où ΔpH/ΔV est le plus grand ; le pKa est le pH lu à V_E/2.", cols: ["n°", "V (mL)", "pH"], cells: (r, i) => [i + 1, fr(r.V, 2), fr(r.pH, 2)], r: { V: 2, pH: 2 }, fill: [{ k: "d", h: "ΔpH/ΔV (mL⁻¹)", warn: "(pH − pH de la ligne précédente) / (V − V de la ligne précédente)." }], plot: { x: r => r.V, y: r => r.pH, xl: "V (mL)", yl: "pH", xmin: 0, ymin: 0, join: true, hint: "Repère V_E (tangentes parallèles ou maximum de ΔpH/ΔV), puis lis le pH à V_E/2 : c'est le pKa." } },
      C: { titre: "Courbe pH = f(V) de l'acide chlorhydrique (comparaison)", min: 15, aide: "Même calcul de <b>ΔpH/ΔV</b> (1ʳᵉ case vide). Compare le pH initial, le pH à l'équivalence et la hauteur du saut avec la partie B.", cols: ["n°", "V (mL)", "pH"], cells: (r, i) => [i + 1, fr(r.V, 2), fr(r.pH, 2)], r: { V: 2, pH: 2 }, fill: [{ k: "d", h: "ΔpH/ΔV (mL⁻¹)", warn: "(pH − pH de la ligne précédente) / (V − V de la ligne précédente)." }], plot: { x: r => r.V, y: r => r.pH, xl: "V (mL)", yl: "pH", xmin: 0, ymin: 0, join: true, hint: "Repère le saut de pH et V_E." } }
    },
    calc: [{ k: "VeB", h: "Partie B : volume équivalent V_E", u: "mL" }, { k: "CwB", h: "Partie B : concentration de l'acide éthanoïque", u: "mol/L" }, { k: "pHeB", h: "Partie B : pH à l'équivalence", u: "" }, { k: "pKa", h: "Partie B : pKa du couple CH₃COOH/CH₃COO⁻ (pH à V_E/2)", u: "" }, { k: "VeC", h: "Partie C : volume équivalent V_E", u: "mL" }, { k: "CaC", h: "Partie C : concentration de l'acide chlorhydrique", u: "mol/L" }, { k: "pHeC", h: "Partie C : pH à l'équivalence", u: "" }],
    qcm: [
      { q: "On étalonne un pH-mètre avec :", o: ["de l'eau du robinet", "deux solutions tampons de pH connu", "la solution à doser", "de la soude"] },
      { q: "Le pH est défini par :", o: ["pH = log a(H₃O⁺)", "pH = −log a(H₃O⁺)", "pH = −log a(HO⁻)", "pH = 14 × a(H₃O⁺)"] },
      { q: "À la demi-équivalence du dosage d'un acide faible par une base forte :", o: ["pH = 7", "pH = pKa", "pH = 14 − pKa", "pH = pKa / 2"] },
      { q: "Le pH à l'équivalence du dosage de l'acide éthanoïque par la soude est :", o: ["inférieur à 7", "égal à 7", "supérieur à 7", "égal au pKa"] },
      { q: "Le pH à l'équivalence du dosage de HCl par la soude vaut :", o: ["environ 4", "7", "environ 8,7", "environ 12"] },
      { q: "Par rapport à HCl de même concentration, la courbe de l'acide éthanoïque présente :", o: ["un pH initial plus faible et un saut plus grand", "un pH initial plus élevé et un saut plus petit", "la même courbe", "aucun saut de pH"] },
      { q: "Pour repérer l'équivalence sur une courbe pH = f(V), on peut utiliser :", o: ["la méthode des tangentes parallèles ou le maximum de ΔpH/ΔV", "le minimum du pH", "le point où pH = pKa", "le premier point"] },
      { q: "On attend la stabilisation de la mesure après chaque ajout pour :", o: ["laisser l'électrode sécher", "que la réaction et le mélange soient terminés : la lecture est alors fiable", "économiser la soude", "étalonner l'appareil"] },
      { q: "Près de l'équivalence, on verse la soude par petits volumes car :", o: ["le pH varie très vite", "la burette se bouche", "la soude est plus chère", "l'électrode se décharge"] },
      { q: "Avec V_a = 20,0 mL et V_E = 18,4 mL de soude à 0,100 mol/L, C_a vaut :", o: ["0,092 mol/L", "0,109 mol/L", "0,184 mol/L", "0,920 mol/L"] },
      { q: "Entre deux solutions, l'électrode du pH-mètre doit être :", o: ["séchée à l'air", "rincée à l'eau distillée", "rincée avec la soude", "laissée dans la solution précédente"] },
      { q: "Ajouter 50 mL d'eau au bécher avant le dosage :", o: ["modifie le volume équivalent", "ne modifie pas le volume équivalent mais permet d'immerger l'électrode", "double le volume équivalent", "rend la courbe inexploitable"] }
    ]
  };
  window.TPCR.ccaco3 = {
    parts: {
      A: { titre: "Étalonnage de l'acide chlorhydrique", min: 2, aide: "<b>C_H = C_b × V_E / V_H</b> avec C_b = 0,100 mol/L et V_H = 10,0 mL. Ex. V_E = 20,40 mL ⇒ C_H = 0,2040 mol/L.", cols: ["Essai", "V_HCl (mL)", "V_E (mL)"], cells: (r, i) => [i + 1, fr(r.Va, 1), fr(r.V, 2)], r: { V: 2 }, fill: [{ k: "C", h: "C_H = C_b·V_E/V_H (mol/L)", ref: r => 0.01 * r.V, tol: 0.02, warn: "C_H = 0,100 × V_E / 10,0." }] },
      B: { titre: "Dosage en retour du carbonate de calcium", min: 3, aide: "<b>n(H₃O⁺) restant = C_b × V_E</b> (en mmol si V_E en mL). <b>n(CaCO₃) = (C_H × 25,0 − C_b × V_E) / 2</b>, avec C_H moyen de la partie A. <b>% CaCO₃ = n(CaCO₃) × 100,09 / (1000 × m) × 100</b>. Ex. C_H = 0,2000, V_E = 12,40 mL, m = 0,1950 g : n = (5,000 − 1,240)/2 = 1,880 mmol ; % = 1,880 × 100,09 / 195,0 × 100 = 96,5 %.", cols: ["Essai", "m (g)", "V_HCl (mL)", "V_E (mL)", "CO₂ chassé"], cells: (r, i) => [i + 1, fr(r.m, 4), "25,0", fr(r.V, 2), r.bo ? "oui" : "non"], r: { m: 4, V: 2 }, fill: [{ k: "nr", h: "n(H₃O⁺) restant (mmol)", ref: r => 0.1 * r.V, tol: 0.05, warn: "n = 0,100 × V_E (mmol)." }, { k: "nc", h: "n(CaCO₃) (mmol)", warn: "n(CaCO₃) = (C_H × 25,0 − 0,100 × V_E) / 2." }, { k: "p", h: "% CaCO₃", warn: "% = n(CaCO₃) × 100,09 / (1000 × m) × 100." }] }
    },
    calc: [{ k: "CH", h: "Concentration de l'acide chlorhydrique (moyenne de la partie A)", u: "mol/L" }, { k: "nH", h: "Quantité d'acide introduite dans chaque essai de la partie B (C_H × 25,0 mL)", u: "mmol" }, { k: "pm", h: "Teneur moyenne de l'échantillon en CaCO₃", u: "%" }, { k: "sd", h: "Écart-type des teneurs en CaCO₃", u: "%" }],
    qcm: [
      { q: "La réaction du carbonate de calcium avec l'acide chlorhydrique s'écrit :", o: ["CaCO₃ + H₃O⁺ → Ca²⁺ + HCO₃⁻ + H₂O seulement", "CaCO₃ + 2 H₃O⁺ → Ca²⁺ + CO₂ + 3 H₂O", "CaCO₃ + HO⁻ → CaOH⁺ + CO₃²⁻", "CaCO₃ + Cl⁻ → CaCl₂ + CO₂"] },
      { q: "Une mole de CaCO₃ consomme :", o: ["une mole d'acide", "deux moles d'acide", "une demi-mole d'acide", "six moles d'acide"] },
      { q: "Dans un dosage en retour :", o: ["on dose directement l'espèce recherchée", "on ajoute un réactif en excès connu, puis on dose ce qui reste", "on n'utilise pas de burette", "on dose le produit de la réaction"] },
      { q: "On ne dose pas directement CaCO₃ par l'acide avec un indicateur car :", o: ["CaCO₃ est insoluble et réagit lentement : l'équivalence serait mal repérée", "l'acide ne réagit pas avec CaCO₃", "CaCO₃ est coloré", "il faudrait trop d'acide"] },
      { q: "On porte le mélange à ébullition douce avant le dosage pour :", o: ["dissoudre l'indicateur", "chasser le CO₂ dissous, qui serait dosé par la soude", "évaporer l'acide en excès", "accélérer la burette"] },
      { q: "Si le CO₂ n'est pas chassé, le volume de soude versé à l'équivalence est :", o: ["trop grand, et la teneur en CaCO₃ calculée trop faible", "trop petit, et la teneur trop grande", "inchangé", "nul"] },
      { q: "La relation à l'équivalence de l'étalonnage de HCl par NaOH est :", o: ["C_H V_H = C_b V_E", "2 C_H V_H = C_b V_E", "C_H V_E = C_b V_H", "C_H = C_b"] },
      { q: "n(CaCO₃) se calcule par :", o: ["(C_H V_H + C_b V_E) / 2", "(C_H V_H − C_b V_E) / 2", "C_H V_H − C_b V_E", "2 (C_H V_H − C_b V_E)"] },
      { q: "L'acide doit être introduit en excès pour que :", o: ["tout le carbonate réagisse et qu'il reste de l'acide à doser", "la solution soit colorée", "le pH soit neutre", "le CO₂ reste dissous"] },
      { q: "Pour 0,200 g de CaCO₃ pur (100,09 g/mol), la quantité d'acide consommée vaut environ :", o: ["2,00 mmol", "4,00 mmol", "1,00 mmol", "0,40 mmol"] },
      { q: "On réalise plusieurs essais pour :", o: ["évaluer la répétabilité et détecter un essai anormal", "consommer les réactifs", "changer d'indicateur", "étalonner la balance"] },
      { q: "Une cause d'un volume équivalent anormal peut être :", o: ["une bulle d'air dans la burette ou une erreur de lecture", "l'utilisation d'une pipette jaugée", "un erlenmeyer propre", "l'agitation"] }
    ]
  };
  window.TPCR.ccond = {
    parts: {
      A: { titre: "Vérification du conductimètre", min: 1, aide: "Lecture du conductimètre dans la solution de KCl à 0,0100 mol/L <b>après</b> réglage du bouton « constante de cellule » : 1,410 mS/cm.", cols: ["n°", "Lecture dans KCl (mS/cm)"], cells: (r, i) => [i + 1, fr(r.L, 3)], r: { L: 3 }, fill: [] },
      B: { titre: "Dosage conductimétrique de HCl", min: 16, aide: "<b>σ corrigée = σ × (220 + V) / 220</b> (V₀ = 20,0 + 200 = 220 mL). Trace σ corrigée = f(V) : deux portions de droite ; V_E est l'abscisse de leur intersection.", cols: ["n°", "V (mL)", "σ (mS/cm)"], cells: (r, i) => [i + 1, fr(r.V, 2), fr(r.s, 3)], r: { V: 2, s: 3 }, fill: [{ k: "sc", h: "σ corrigée (mS/cm)", ref: r => r.s * (220 + r.V) / 220, tol: 0.02, warn: "σ corrigée = σ × (220 + V) / 220." }], plot: { x: r => r.V, y: (r, f) => f.sc, xl: "V (mL)", yl: "σ corrigée (mS/cm)", xmin: 0, ymin: 0, hint: "Trace les deux droites (avant et après l'équivalence) et lis V_E à leur intersection." } },
      C: { titre: "Dosage conductimétrique de l'acide éthanoïque", min: 16, aide: "Même correction de dilution. σ augmente lentement avant l'équivalence (formation de CH₃COO⁻ et Na⁺), puis plus vite après (excès de HO⁻) : V_E est à l'intersection des deux droites.", cols: ["n°", "V (mL)", "σ (mS/cm)"], cells: (r, i) => [i + 1, fr(r.V, 2), fr(r.s, 3)], r: { V: 2, s: 3 }, fill: [{ k: "sc", h: "σ corrigée (mS/cm)", ref: r => r.s * (220 + r.V) / 220, tol: 0.02, warn: "σ corrigée = σ × (220 + V) / 220." }], plot: { x: r => r.V, y: (r, f) => f.sc, xl: "V (mL)", yl: "σ corrigée (mS/cm)", xmin: 0, ymin: 0, hint: "Trace les deux droites et lis V_E à leur intersection (changement de pente)." } }
    },
    calc: [{ k: "VeB", h: "Partie B : volume équivalent (intersection des droites)", u: "mL" }, { k: "CaB", h: "Partie B : concentration de HCl", u: "mol/L" }, { k: "VeC", h: "Partie C : volume équivalent (changement de pente)", u: "mL" }, { k: "CwC", h: "Partie C : concentration de l'acide éthanoïque", u: "mol/L" }],
    qcm: [
      { q: "La conductivité d'une solution ionique s'écrit :", o: ["σ = Σ λᵢ [Xᵢ]", "σ = Σ [Xᵢ] / λᵢ", "σ = U / I", "σ = Σ λᵢ"] },
      { q: "Pendant le dosage de HCl par NaOH, avant l'équivalence, σ diminue car :", o: ["les ions H₃O⁺, très mobiles, sont remplacés par des ions Na⁺ moins mobiles", "on ajoute de l'eau", "les ions Cl⁻ disparaissent", "la température baisse"] },
      { q: "Après l'équivalence du dosage de HCl, σ augmente car :", o: ["on ajoute des ions Na⁺ et HO⁻ en excès", "l'acide se reforme", "les ions Cl⁻ précipitent", "la cellule chauffe"] },
      { q: "Au début du dosage de l'acide éthanoïque, σ augmente car :", o: ["l'acide faible, peu dissocié, est transformé en ions CH₃COO⁻ et Na⁺", "les ions H₃O⁺ sont consommés", "les ions HO⁻ sont en excès dès le début", "l'acide s'évapore"] },
      { q: "Le volume équivalent d'un dosage conductimétrique se lit :", o: ["au maximum de σ", "à l'intersection des portions de droite", "au premier point", "quand σ = 0"] },
      { q: "Le conductimètre se vérifie avec :", o: ["un tampon de pH 7", "une solution de KCl de conductivité connue", "de l'eau du robinet", "la soude"] },
      { q: "On trace σ corrigée = σ (V₀ + V)/V₀ pour :", o: ["tenir compte de la dilution due au réactif ajouté", "convertir les unités", "changer de signe", "éliminer la température"] },
      { q: "On travaille dans un grand volume d'eau (200 mL) pour :", o: ["que la dilution due à la soude reste faible et que les portions soient rectilignes", "diminuer V_E", "augmenter la température", "économiser l'acide"] },
      { q: "Il faut maintenir la température constante car :", o: ["σ augmente d'environ 2 % par degré", "la soude gèle", "le volume équivalent en dépend fortement", "la burette se dilate"] },
      { q: "Avec V_a = 20,0 mL et V_E = 5,20 mL de soude à 0,100 mol/L, C_a vaut :", o: ["0,0260 mol/L", "0,0520 mol/L", "0,104 mol/L", "0,260 mol/L"] },
      { q: "Un intérêt de la conductimétrie par rapport à un indicateur coloré :", o: ["elle convient aux solutions colorées ou très diluées", "elle ne nécessite aucun appareil", "elle est instantanée sans mesure", "elle donne directement le pKa"] },
      { q: "Parmi ces ions, le plus conducteur est :", o: ["Na⁺", "Cl⁻", "H₃O⁺", "CH₃COO⁻"] }
    ]
  };
  window.TPCR.cksp = {
    parts: {
      A: { titre: "Solution saturée dans l'eau", min: 2, aide: "<b>[HO⁻] = C(HCl) × V_E / V_s = 0,0500 × V_E / 10,0</b> ; <b>s₁ = [HO⁻] / 2</b>. Ex. V_E = 7,90 mL : [HO⁻] = 0,0395 mol/L, s₁ = 0,0198 mol/L.", cols: ["Essai", "θ (°C)", "V_s (mL)", "V_E (mL)"], cells: (r, i) => [i + 1, fr(r.T, 1), fr(r.Vs, 1), fr(r.V, 2)], r: { V: 2 }, fill: [{ k: "oh", h: "[HO⁻] (mol/L)", ref: r => 0.005 * r.V, tol: 0.05, warn: "[HO⁻] = 0,0500 × V_E / 10,0." }, { k: "s", h: "s₁ = [HO⁻]/2 (mol/L)", ref: r => 0.0025 * r.V, tol: 0.05, warn: "s₁ = [HO⁻] / 2." }] },
      B: { titre: "Solution saturée dans CaCl₂ (C₀ = 0,100 mol/L)", min: 2, aide: "Mêmes calculs : <b>s₂ = [HO⁻] / 2</b> est la quantité de Ca(OH)₂ dissoute dans CaCl₂. La concentration totale en Ca²⁺ vaut C₀ + s₂.", cols: ["Essai", "θ (°C)", "V_s (mL)", "V_E (mL)"], cells: (r, i) => [i + 1, fr(r.T, 1), fr(r.Vs, 1), fr(r.V, 2)], r: { V: 2 }, fill: [{ k: "oh", h: "[HO⁻] (mol/L)", ref: r => 0.005 * r.V, tol: 0.05, warn: "[HO⁻] = 0,0500 × V_E / 10,0." }, { k: "s", h: "s₂ = [HO⁻]/2 (mol/L)", ref: r => 0.0025 * r.V, tol: 0.05, warn: "s₂ = [HO⁻] / 2." }] }
    },
    calc: [{ k: "sA", h: "Partie A : solubilité s₁ dans l'eau (moyenne)", u: "mol/L" }, { k: "KsA", h: "Partie A : produit de solubilité estimé Ks ≈ 4 s₁³", u: "" }, { k: "sB", h: "Partie B : solubilité s₂ dans CaCl₂ (moyenne)", u: "mol/L" }, { k: "CaB", h: "Partie B : concentration totale en Ca²⁺ (C₀ + s₂)", u: "mol/L" }, { k: "KsB", h: "Partie B : produit de solubilité estimé Ks ≈ (C₀ + s₂)(2 s₂)²", u: "" }],
    qcm: [
      { q: "Le produit de solubilité de Ca(OH)₂ s'écrit (solutions idéales) :", o: ["Ks = [Ca²⁺][HO⁻]", "Ks = [Ca²⁺][HO⁻]²", "Ks = [Ca²⁺]²[HO⁻]", "Ks = [Ca(OH)₂]"] },
      { q: "Dans l'eau pure, en fonction de la solubilité s, Ks vaut :", o: ["s²", "2 s²", "4 s³", "s³"] },
      { q: "Dans une solution de CaCl₂, la solubilité de Ca(OH)₂ :", o: ["augmente", "diminue (effet d'ion commun)", "ne change pas", "devient nulle"] },
      { q: "On filtre la suspension avant le dosage pour :", o: ["éliminer le solide non dissous, qui se dissoudrait pendant le dosage", "refroidir la solution", "ajouter l'indicateur", "éliminer les ions Ca²⁺"] },
      { q: "Dans la solution de CaCl₂ à C₀, la concentration totale en Ca²⁺ vaut :", o: ["s₂", "C₀", "C₀ + s₂", "2 s₂"] },
      { q: "Dans la solution de CaCl₂, Ks s'écrit :", o: ["4 s₂³", "(C₀ + s₂)(2 s₂)²", "C₀ (2 s₂)", "(C₀ + 2 s₂) s₂²"] },
      { q: "Quand la température augmente, la solubilité de Ca(OH)₂ :", o: ["augmente", "diminue", "ne change pas", "double"] },
      { q: "Le CO₂ de l'air peut fausser le résultat car il :", o: ["forme du carbonate de calcium en consommant des ions HO⁻", "colore la solution", "augmente la solubilité", "réagit avec HCl"] },
      { q: "Le dosage du filtrat par HCl donne directement :", o: ["[Ca²⁺]", "[HO⁻] = C(HCl) V_E / V_s", "Ks", "la masse de solide"] },
      { q: "Avec V_E = 8,00 mL (10,0 mL de filtrat, HCl à 0,0500 mol/L), s vaut :", o: ["0,0200 mol/L", "0,0400 mol/L", "0,0100 mol/L", "0,0800 mol/L"] },
      { q: "On ne calcule pas Ks avec la seule concentration totale en calcium sans distinguer ses origines car :", o: ["les ions HO⁻ ne proviennent que de Ca(OH)₂ : [HO⁻] = 2 s₂, pas 2 [Ca²⁺]", "le chlorure réagit avec HCl", "CaCl₂ est insoluble", "Ks dépend du volume"] },
      { q: "En présence de beaucoup d'ions, le modèle Ks ≈ [Ca²⁺][HO⁻]² :", o: ["est exact", "peut s'écarter de la réalité car les activités diffèrent des concentrations", "ne s'applique plus du tout", "donne toujours Ks = 0"] }
    ]
  };
  window.TPCR.cjavel = {
    parts: {
      A: { titre: "Dilution au 1/10", min: 1, aide: "Prélèvement de 10,0 mL d'eau de Javel, complété à 100,0 mL : <b>facteur de dilution 10</b>.", cols: ["n°", "V pipette (mL)", "V fiole (mL)"], cells: (r, i) => [i + 1, fr(r.Vp, 1), fr(r.Vf, 2)], r: { Vf: 2 }, fill: [] },
      B: { titre: "Dosage iodométrique de la solution diluée", min: 2, aide: "<b>C(ClO⁻) diluée = C(S₂O₃²⁻) × V_E / (2 × 10,0) = 0,1000 × V_E / 20,0</b>. Ex. V_E = 7,60 mL : C = 0,0380 mol/L ; eau de Javel commerciale : × 10 = 0,380 mol/L.", cols: ["Essai", "V_E (mL)", "Amidon ajouté trop tôt"], cells: (r, i) => [i + 1, fr(r.V, 2), r.tot ? "oui" : "non"], r: { V: 2 }, fill: [{ k: "c", h: "C(ClO⁻) diluée (mol/L)", ref: r => 0.005 * r.V, tol: 0.05, warn: "C = 0,1000 × V_E / (2 × 10,0)." }] }
    },
    calc: [{ k: "Cd", h: "Concentration en ClO⁻ de la solution diluée (moyenne)", u: "mol/L" }, { k: "Cc", h: "Concentration en ClO⁻ de l'eau de Javel commerciale", u: "mol/L" }, { k: "chl", h: "Titre chlorométrique de l'eau de Javel (22,4 × C)", u: "°chl" }, { k: "ca", h: "Teneur en chlore actif (70,9 × C)", u: "g/L" }],
    qcm: [
      { q: "Le dosage de l'hypochlorite par le thiosulfate est indirect car :", o: ["on dose le diiode formé par l'action de ClO⁻ sur les ions iodure", "on dose l'excès d'hypochlorite", "le thiosulfate réagit directement avec ClO⁻", "on mesure un pH"] },
      { q: "Les ions iodure jouent le rôle :", o: ["d'indicateur coloré", "de réducteur, en excès, qui transforme tout ClO⁻ en I₂", "de catalyseur", "d'oxydant"] },
      { q: "D'après les équations, n(ClO⁻) vaut :", o: ["n(S₂O₃²⁻)", "2 n(S₂O₃²⁻)", "n(S₂O₃²⁻) / 2", "n(S₂O₃²⁻) / 4"] },
      { q: "L'amidon sert à :", o: ["acidifier le milieu", "repérer la disparition du diiode grâce à un complexe bleu foncé", "réduire l'hypochlorite", "stabiliser le thiosulfate"] },
      { q: "On ajoute l'amidon :", o: ["dès le début du dosage", "quand la solution est devenue jaune pâle", "après l'équivalence", "avant l'iodure"] },
      { q: "On évite d'attendre entre la libération du diiode et le dosage car :", o: ["le diiode est volatil et l'iodure s'oxyde à l'air", "le thiosulfate se décompose", "l'amidon précipite", "la burette se vide"] },
      { q: "Mélanger hors protocole l'eau de Javel et un acide est interdit car :", o: ["cela libère du dichlore, gaz toxique", "cela produit de l'eau oxygénée", "la solution devient bleue", "cela neutralise le chlore actif sans danger"] },
      { q: "La demi-équation du couple S₄O₆²⁻/S₂O₃²⁻ s'écrit :", o: ["S₄O₆²⁻ + 2 e⁻ = 2 S₂O₃²⁻", "S₂O₃²⁻ + 2 e⁻ = S₄O₆²⁻", "S₄O₆²⁻ = 2 S₂O₃²⁻ + 2 e⁻", "S₂O₃²⁻ + H⁺ = HS₂O₃⁻"] },
      { q: "Le titre chlorométrique d'une eau de Javel à C(ClO⁻) = 0,40 mol/L vaut environ :", o: ["9,0 °chl", "0,40 °chl", "4,5 °chl", "22,4 °chl"] },
      { q: "La concentration en hypochlorite et le titre chlorométrique :", o: ["sont la même grandeur", "sont proportionnels : °chl = 22,4 × C(ClO⁻)", "n'ont aucun lien", "sont inversement proportionnels"] },
      { q: "On dilue l'eau de Javel commerciale avant le dosage pour :", o: ["obtenir un volume équivalent mesurable avec la burette", "la rendre plus concentrée", "la colorer", "éviter d'utiliser l'iodure"] },
      { q: "À l'équivalence du dosage, la solution :", o: ["devient brune", "passe du bleu foncé à l'incolore", "devient rose", "précipite"] }
    ]
  };
  window.TPCR.ch2o2 = {
    parts: {
      A: { titre: "Dilution au 1/10", min: 1, aide: "Prélèvement de 10,0 mL d'eau oxygénée, complété à 100,0 mL : <b>facteur de dilution 10</b>.", cols: ["n°", "V pipette (mL)", "V fiole (mL)"], cells: (r, i) => [i + 1, fr(r.Vp, 1), fr(r.Vf, 2)], r: { Vf: 2 }, fill: [] },
      B: { titre: "Dosage de la solution diluée par KMnO₄", min: 2, aide: "<b>C(H₂O₂) diluée = 5 × C(MnO₄⁻) × V_E / (2 × 10,0)</b>, avec C(MnO₄⁻) indiquée sur le flacon. Ex. C(MnO₄⁻) = 0,02000 mol/L, V_E = 17,60 mL : C = 0,0880 mol/L.", cols: ["Essai", "V(H₂O₂) (mL)", "V_E (mL)"], cells: (r, i) => [i + 1, "10,0", fr(r.V, 2)], r: { V: 2 }, fill: [{ k: "c", h: "C(H₂O₂) diluée (mol/L)", warn: "C = 5 × C(MnO₄⁻) × V_E / (2 × 10,0)." }] }
    },
    calc: [{ k: "Cd", h: "Concentration de la solution diluée (moyenne)", u: "mol/L" }, { k: "Cc", h: "Concentration de l'eau oxygénée commerciale", u: "mol/L" }, { k: "gL", h: "Concentration massique de l'eau oxygénée commerciale (M = 34,01 g/mol)", u: "g/L" }, { k: "tv", h: "Titre volumique de l'eau oxygénée commerciale (11,2 × C)", u: "volumes" }, { k: "ec", h: "Écart relatif avec l'indication de l'étiquette (10 volumes)", u: "%" }],
    qcm: [
      { q: "Dans le dosage de l'eau oxygénée par le permanganate, H₂O₂ joue le rôle :", o: ["d'oxydant", "de réducteur", "de catalyseur", "d'indicateur"] },
      { q: "L'équation de dosage équilibrée est :", o: ["2 MnO₄⁻ + 5 H₂O₂ + 6 H⁺ → 2 Mn²⁺ + 5 O₂ + 8 H₂O", "MnO₄⁻ + H₂O₂ → Mn²⁺ + O₂", "2 MnO₄⁻ + 3 H₂O₂ → 2 MnO₂ + 3 O₂ + 2 HO⁻ + 2 H₂O", "MnO₄⁻ + 5 H₂O₂ → Mn²⁺ + 5 O₂"] },
      { q: "À l'équivalence, n(H₂O₂) vaut :", o: ["n(MnO₄⁻)", "(2/5) n(MnO₄⁻)", "(5/2) n(MnO₄⁻)", "5 n(MnO₄⁻)"] },
      { q: "Le milieu doit être acide car :", o: ["MnO₄⁻ est alors réduit en Mn²⁺ (sinon il se forme MnO₂ brun)", "l'eau oxygénée se décompose sinon", "l'acide est l'indicateur", "le permanganate précipite"] },
      { q: "Le permanganate est un auto-indicateur car :", o: ["MnO₄⁻ est violet et Mn²⁺ presque incolore : la première goutte en excès colore la solution", "il change de couleur avec le pH", "il réagit avec l'amidon", "il précipite à l'équivalence"] },
      { q: "Une eau oxygénée « à 10 volumes » :", o: ["libère 10 L de O₂ (conditions de référence) par litre de solution", "contient 10 % de H₂O₂", "doit être diluée 10 fois", "contient 10 mol/L de H₂O₂"] },
      { q: "Le titre volumique se calcule par :", o: ["T = C(H₂O₂) × V_m / 2", "T = 2 C(H₂O₂) × V_m", "T = C(H₂O₂) / V_m", "T = C(H₂O₂) × V_m"] },
      { q: "La concentration d'une eau oxygénée à 10 volumes vaut environ :", o: ["0,089 mol/L", "0,89 mol/L", "8,9 mol/L", "10 mol/L"] },
      { q: "Une cause possible de sous-estimation de la concentration est :", o: ["la décomposition de l'eau oxygénée (flacon ancien ou mal conservé)", "une burette bien rincée", "l'agitation", "l'acidification"] },
      { q: "La burette de permanganate se lit :", o: ["au bas du ménisque", "au haut du ménisque (solution très foncée)", "au milieu du liquide", "sans tenir compte du ménisque"] },
      { q: "Au cours du dosage, on observe un dégagement gazeux de :", o: ["dichlore", "dioxygène", "dihydrogène", "dioxyde de carbone"] },
      { q: "On dilue l'eau oxygénée commerciale 10 fois pour :", o: ["que le volume équivalent soit mesurable avec la burette", "la rendre plus oxydante", "éviter l'acide", "la colorer"] }
    ]
  };
  window.TPCR.cdichro = {
    parts: {
      A: { titre: "Dosage du sel de Mohr seul", min: 2, aide: "<b>C_F = 5 × C_M × V_E / 10,0</b>, avec C_M la concentration du permanganate indiquée sur le flacon. Ex. C_M = 0,02000 mol/L, V_E = 9,85 mL : C_F = 0,0985 mol/L.", cols: ["Essai", "V_F (mL)", "V_E (mL)"], cells: (r, i) => [i + 1, fr(r.VF, 1), fr(r.V, 2)], r: { V: 2 }, fill: [{ k: "CF", h: "C_F = 5·C_M·V_E/10,0 (mol/L)", warn: "C_F = 5 × C_M × V_E / 10,0." }] },
      B: { titre: "Dosage en retour du dichromate", min: 2, aide: "<b>n(Fe²⁺) restant = 5 C_M V_E</b> (mmol) ; <b>n(Cr₂O₇²⁻) = (C_F V_F − 5 C_M V_E) / 6</b> (mmol), avec C_F moyen de la partie A ; <b>C_D = n(Cr₂O₇²⁻) / V_D</b> avec V_D = 10,0 mL.", cols: ["Essai", "V_D (mL)", "V_F (mL)", "V_E (mL)"], cells: (r, i) => [i + 1, fr(r.VD, 1), fr(r.VF, 1), fr(r.V, 2)], r: { V: 2 }, fill: [{ k: "nr", h: "n(Fe²⁺) restant (mmol)", warn: "n = 5 × C_M × V_E." }, { k: "nd", h: "n(Cr₂O₇²⁻) (mmol)", warn: "n = (C_F V_F − 5 C_M V_E) / 6." }, { k: "CD", h: "C_D (mol/L)", warn: "C_D = n(Cr₂O₇²⁻) / 10,0 mL." }] }
    },
    calc: [{ k: "CF", h: "Concentration réelle du sel de Mohr C_F (moyenne de la partie A)", u: "mol/L" }, { k: "nd", h: "Quantité de dichromate dans 10,0 mL (moyenne de la partie B)", u: "mmol" }, { k: "CD", h: "Concentration du dichromate C_D", u: "mol/L" }, { k: "Cm", h: "Concentration massique en K₂Cr₂O₇ (M = 294,18 g/mol)", u: "g/L" }],
    qcm: [
      { q: "On introduit le sel de Mohr en excès pour que :", o: ["tout le dichromate soit réduit et qu'il reste du fer(II) à doser", "la solution soit violette", "le permanganate ne réagisse pas", "le milieu soit neutre"] },
      { q: "Une mole de dichromate consomme :", o: ["une mole de Fe²⁺", "cinq moles de Fe²⁺", "six moles de Fe²⁺", "deux moles de Fe²⁺"] },
      { q: "Une mole de permanganate consomme :", o: ["cinq moles de Fe²⁺", "six moles de Fe²⁺", "une mole de Fe²⁺", "deux moles de Fe²⁺"] },
      { q: "n(Cr₂O₇²⁻) se calcule par :", o: ["(C_F V_F − 5 C_M V_E) / 6", "(C_F V_F + 5 C_M V_E) / 6", "6 (C_F V_F − 5 C_M V_E)", "C_F V_F − C_M V_E"] },
      { q: "Le permanganate dose ici :", o: ["le dichromate", "le fer(II) restant après la réaction avec le dichromate", "le fer(III)", "les ions Cr³⁺"] },
      { q: "Si le sel de Mohr n'est pas en quantité suffisante :", o: ["tout le fer(II) est consommé, il reste du dichromate et le calcul est impossible", "le résultat est plus précis", "le dosage dure moins longtemps", "la solution devient incolore"] },
      { q: "On dose le sel de Mohr seul (partie A) car :", o: ["il s'oxyde lentement à l'air : sa concentration réelle doit être mesurée", "il est coloré", "le permanganate n'est pas étalonné", "c'est plus rapide"] },
      { q: "Les déchets contenant du chrome(VI) :", o: ["vont à l'évier", "sont collectés séparément (toxique, cancérogène, dangereux pour l'environnement)", "sont mélangés aux solvants", "sont évaporés"] },
      { q: "Au cours de la réduction du dichromate, la solution passe :", o: ["de l'orangé (Cr₂O₇²⁻) au vert (Cr³⁺)", "du vert au rose", "de l'incolore au bleu", "du violet à l'incolore"] },
      { q: "Dans le dosage en retour, la quantité de dichromate est obtenue :", o: ["par différence entre le fer(II) introduit et le fer(II) restant", "directement par la burette", "par pesée", "par mesure de pH"] },
      { q: "Avec C_F V_F = 2,00 mmol et 5 C_M V_E = 0,95 mmol, n(Cr₂O₇²⁻) vaut :", o: ["0,175 mmol", "1,05 mmol", "0,525 mmol", "6,30 mmol"] },
      { q: "La demi-équation du couple Cr₂O₇²⁻/Cr³⁺ s'écrit :", o: ["Cr₂O₇²⁻ + 14 H⁺ + 6 e⁻ = 2 Cr³⁺ + 7 H₂O", "Cr₂O₇²⁻ + 6 e⁻ = 2 Cr³⁺", "Cr₂O₇²⁻ + 2 e⁻ = 2 CrO₄²⁻", "Cr³⁺ + 3 e⁻ = Cr"] }
    ]
  };
  window.TPCR.cpot = {
    parts: {
      A: { titre: "Courbe E = f(V) du dosage de Fe²⁺ par MnO₄⁻", min: 20, aide: "<b>ΔE/ΔV</b> se calcule entre chaque point et le <b>précédent</b> : (E − E précédent) / (V − V précédent), en mV/mL ; laisse vide la case de la 1ʳᵉ ligne. V_E est au milieu de l'intervalle où ΔE/ΔV est le plus grand. <b>C(Fe²⁺) = 5 × C(MnO₄⁻) × V_E / 20,0</b>. À V_E/2, E = E°′(Fe³⁺/Fe²⁺) − 0,244 V ; à 2 V_E, E = E°(MnO₄⁻/Mn²⁺) − 0,244 V.", cols: ["n°", "V (mL)", "E (mV)"], cells: (r, i) => [i + 1, fr(r.V, 2), String(r.E)], r: { V: 2 }, fill: [{ k: "d", h: "ΔE/ΔV (mV/mL)", warn: "(E − E de la ligne précédente) / (V − V de la ligne précédente)." }], plot: { x: r => r.V, y: r => r.E, xl: "V (mL)", yl: "E (mV)", xmin: 0, join: true, hint: "Repère le saut de potentiel : V_E au maximum de ΔE/ΔV ; lis E à V_E/2." } }
    },
    calc: [{ k: "Ve", h: "Volume équivalent V_E", u: "mL" }, { k: "C", h: "Concentration de la solution de fer(II)", u: "mol/L" }, { k: "Eh", h: "Potentiel à la demi-équivalence (par rapport à l'ECS)", u: "mV" }, { k: "E0", h: "Potentiel standard apparent E°′(Fe³⁺/Fe²⁺) par rapport à l'ENH", u: "V" }, { k: "E2", h: "Potentiel à 2 V_E (par rapport à l'ECS) ; on en déduit E°(MnO₄⁻/Mn²⁺)", u: "mV" }],
    qcm: [
      { q: "En potentiométrie, on mesure :", o: ["une intensité", "une différence de potentiel à courant pratiquement nul", "une conductivité", "une absorbance"] },
      { q: "L'électrode de référence a pour rôle :", o: ["de réagir avec la solution", "de fournir un potentiel constant", "de mesurer le pH", "d'agiter la solution"] },
      { q: "Pour un dosage d'oxydoréduction, l'électrode indicatrice est :", o: ["une électrode de verre", "une électrode de platine", "une électrode au calomel", "une électrode d'argent recouverte de AgCl"] },
      { q: "À la demi-équivalence du dosage de Fe²⁺, le potentiel est égal à :", o: ["E°′(MnO₄⁻/Mn²⁺)", "E°′(Fe³⁺/Fe²⁺) (par rapport à l'ENH)", "0 V", "la moyenne des deux potentiels standard"] },
      { q: "Le volume équivalent se repère :", o: ["au minimum de E", "au maximum de ΔE/ΔV", "quand E = 0", "au premier point"] },
      { q: "On réduit les incréments près de l'équivalence car :", o: ["le potentiel varie très vite : il faut des points rapprochés pour localiser V_E", "la burette se bouche", "l'électrode s'use", "le permanganate est cher"] },
      { q: "On attend la stabilisation du potentiel après chaque ajout pour :", o: ["que l'équilibre s'établisse à la surface de l'électrode", "laisser la burette se vider", "chauffer la solution", "étalonner l'appareil"] },
      { q: "La relation à l'équivalence est :", o: ["C(Fe²⁺) V(Fe²⁺) = 5 C(MnO₄⁻) V_E", "5 C(Fe²⁺) V(Fe²⁺) = C(MnO₄⁻) V_E", "C(Fe²⁺) V(Fe²⁺) = C(MnO₄⁻) V_E", "C(Fe²⁺) = 5 C(MnO₄⁻)"] },
      { q: "Un avantage de la potentiométrie est :", o: ["elle ne nécessite pas d'indicateur coloré", "elle est sans appareil", "elle donne directement la masse", "elle ne dépend pas de la température"] },
      { q: "L'électrode au calomel saturé a un potentiel de :", o: ["0 V", "0,244 V par rapport à l'ENH", "1,51 V", "0,68 V"] },
      { q: "Avant l'équivalence, le potentiel de la solution est fixé par le couple :", o: ["MnO₄⁻/Mn²⁺", "Fe³⁺/Fe²⁺", "H⁺/H₂", "O₂/H₂O"] },
      { q: "Parmi ces facteurs, celui qui n'influence pas la mesure de E est :", o: ["la température", "l'état de surface des électrodes", "la couleur du bécher", "l'acidité du milieu"] }
    ]
  };
  window.TPCR_PARAMS = Object.assign(window.TPCR_PARAMS || {}, { ccolo: "ccolo_par", cphm: "cphm_par", ccaco3: "ccaco3_par", ccond: "ccond_par", cksp: "cksp_par", cjavel: "cjavel_par", ch2o2: "ch2o2_par", cdichro: "cdichro_par", cpot: "cpot_par" });
  if (window.TPQD && window.TPQD.Q) Object.assign(window.TPQD.Q, {
    csol: {
      A_C: { part: "A", q: "Pour ta préparation n°{k} de la partie A, C₁ = m/(M·V) vaut :", u: "mol/L", sig: 3, f: [r => r.m / (58.44 * 0.25), r => r.m * 58.44 / 0.25], s: ["o0", "e", "o1", "o2"] },
      A_n: { part: "A", q: "Pour ta préparation n°{k} de la partie A, la quantité de NaCl n = m/M vaut :", u: "mol", sig: 3, f: [r => r.m / 58.44, r => r.m / 58.44 / 0.25], s: ["e", "o1", "o0", "o2"] },
      A_V: { part: "A", q: "Avec la masse pesée de ta préparation n°{k}, le volume de solution qui donnerait exactement 0,100 mol/L vaut :", u: "mL", sig: 4, f: [r => r.m / (58.44 * 0.1) * 1000, r => r.m / (58.44 * 0.1)], s: ["o1", "o0", "e", "o2"] },
      B_f: { part: "B", q: "Pour ta dilution n°{k} de la partie B, le facteur de dilution V₂/V₁ vaut :", u: "", sig: 3, f: [r => r.V2 / r.V1, r => r.V1 / r.V2], s: ["o0", "o2", "e", "o1"] },
      A_err: { part: "A", g: 1, min: 1, q: "D'après ta première préparation de la partie A, l'erreur relative de C₁ par rapport à 0,100 mol/L vaut :", u: "%", sig: 2, s: [R => Math.abs(R[0].m / 14.61 - 0.1) * 1000, R => Math.abs(R[0].m / 14.61 - 0.1) * 100, R => Math.abs(R[0].m - 1.461) * 10, R => Math.abs(R[0].m / 14.61 - 0.1) * 10000] }
    },
    ccolo: {
      A_C: { part: "A", q: "Pour ton essai n°{k} de la partie A, C_a = C_b·V_E/V_a vaut :", u: "mol/L", sig: 3, f: [r => 0.1 * r.V / r.Va, r => 0.1 * r.Va / r.V], s: ["o0", "e", "o1", "o2"] },
      B_C: { part: "B", q: "Pour ta mesure n°{k} de la partie B, la concentration apparente 0,100 × V / 10,0 vaut :", u: "mol/L", sig: 3, f: [r => 0.01 * r.V, r => 0.1 / r.V], s: ["e", "o1", "o0", "o2"] },
      A_n: { part: "A", q: "Pour ton essai n°{k} de la partie A, la quantité de soude versée à l'équivalence vaut :", u: "mmol", sig: 3, f: [r => 0.1 * r.V, r => r.V / 0.1], s: ["o1", "o0", "e", "o2"] },
      A_cm: { part: "A", q: "Pour ton essai n°{k} de la partie A, la concentration massique 60,05 × C_a vaut :", u: "g/L", sig: 3, f: [r => 0.01 * r.V * 60.05, r => 0.01 * r.V / 60.05], s: ["o2", "e", "o0", "o1"] },
      A_m: { part: "A", g: 1, min: 3, q: "D'après tes essais de la partie A, la moyenne des volumes des dosages précis (sans l'essai rapide n°1) vaut :", u: "mL", sig: 4, s: [R => R.reduce((s, r) => s + r.V, 0) / R.length, R => R.slice(1).reduce((s, r) => s + r.V, 0) / (R.length - 1), R => R[0].V, R => Math.max(...R.map(r => r.V)) + 0.5] },
      B_e: { part: "B", g: 1, min: 3, q: "Dans ton tableau de la partie B, l'écart entre le plus grand et le plus petit volume au virage vaut :", u: "mL", sig: 3, s: [R => Math.max(...R.map(r => r.V)) - Math.min(...R.map(r => r.V)), R => (Math.max(...R.map(r => r.V)) - Math.min(...R.map(r => r.V))) / 2, R => Math.max(...R.map(r => r.V)), R => Math.min(...R.map(r => r.V))] }
    },
    cphm: {
      B_h: { part: "B", q: "Pour ta mesure n°{k} de la partie B, la concentration [H₃O⁺] = 10^(−pH) vaut :", u: "mol/L", sig: 3, f: [r => Math.pow(10, -r.pH), r => Math.pow(10, r.pH - 14)], s: ["o1", "o0", "e", "o2"] },
      C_h: { part: "C", q: "Pour ta mesure n°{k} de la partie C, la concentration [H₃O⁺] = 10^(−pH) vaut :", u: "mol/L", sig: 3, f: [r => Math.pow(10, -r.pH), r => Math.pow(10, r.pH - 14)], s: ["o2", "e", "o0", "o1"] },
      B_s: { part: "B", g: 1, min: 3, q: "D'après tes mesures de la partie B, le volume au milieu de l'intervalle où ΔpH/ΔV est le plus grand vaut :", u: "mL", sig: 3, s: [R => cxMid(R, "pH"), R => cxMid(R, "pH") / 2, R => R[R.length - 1].V, R => cxMid(R, "pH") * 0.8] },
      C_s: { part: "C", g: 1, min: 3, q: "D'après tes mesures de la partie C, le volume au milieu de l'intervalle où ΔpH/ΔV est le plus grand vaut :", u: "mL", sig: 3, s: [R => cxMid(R, "pH") / 2, R => R[R.length - 1].V, R => cxMid(R, "pH"), R => cxMid(R, "pH") * 1.25] },
      B_pk: { part: "B", g: 1, min: 3, q: "Dans ton tableau de la partie B, le pH relevé au point le plus proche de V_E/2 (V_E : milieu de l'intervalle où ΔpH/ΔV est le plus grand) vaut :", u: "", sig: 3, s: [R => cxNear(R, cxMid(R, "pH")).pH, R => R[0].pH, R => cxNear(R, cxMid(R, "pH") / 2).pH, R => cxNear(R, cxMid(R, "pH") / 4).pH] },
      B_C: { part: "B", g: 1, min: 3, q: "En prenant pour V_E le milieu de l'intervalle où ΔpH/ΔV est le plus grand (partie B), C = 0,100 × V_E / 20,0 vaut :", u: "mol/L", sig: 3, s: [R => 0.1 * cxMid(R, "pH") / 10, R => 0.1 * 20 / cxMid(R, "pH"), R => 0.005 * cxMid(R, "pH"), R => cxMid(R, "pH") / 20] }
    },
    ccaco3: {
      A_C: { part: "A", q: "Pour ton essai n°{k} de la partie A, C_H = 0,100 × V_E / 10,0 vaut :", u: "mol/L", sig: 3, f: [r => 0.01 * r.V, r => 1 / r.V], s: ["o0", "o1", "e", "o2"] },
      B_nr: { part: "B", q: "Pour ton essai n°{k} de la partie B, la quantité de H₃O⁺ restante 0,100 × V_E vaut :", u: "mmol", sig: 3, f: [r => 0.1 * r.V, r => 0.05 * r.V], s: ["e", "o0", "o2", "o1"] },
      B_g: { part: "B", q: "Pour ton essai n°{k} de la partie B, la quantité de CaCO₃ contenue dans l'échantillon s'il était pur, 1000 × m / 100,09, vaut :", u: "mmol", sig: 3, f: [r => 1000 * r.m / 100.09, r => r.m / 100.09], s: ["o1", "e", "o0", "o2"] },
      A_m: { part: "A", g: 1, min: 2, q: "D'après tes essais de la partie A, la moyenne des volumes équivalents vaut :", u: "mL", sig: 4, s: [R => Math.max(...R.map(r => r.V)) + 0.4, R => R.reduce((s, r) => s + r.V, 0) / R.length, R => R.reduce((s, r) => s + r.V, 0) / R.length / 2, R => Math.min(...R.map(r => r.V)) - 0.4] },
      B_m: { part: "B", g: 1, min: 2, q: "D'après tes essais de la partie B, la moyenne des volumes équivalents vaut :", u: "mL", sig: 4, s: [R => R.reduce((s, r) => s + r.V, 0) / R.length, R => Math.max(...R.map(r => r.V)) + 0.5, R => R.reduce((s, r) => s + r.m, 0) / R.length * 100, R => Math.min(...R.map(r => r.V)) - 0.5] }
    },
    ccond: {
      B_sc: { part: "B", q: "Pour ta mesure n°{k} de la partie B, σ corrigée = σ × (220 + V) / 220 vaut :", u: "mS/cm", sig: 3, f: [r => r.s * (220 + r.V) / 220, r => r.s * 220 / (220 + r.V)], s: ["o1", "e", "o0", "o2"] },
      C_sc: { part: "C", q: "Pour ta mesure n°{k} de la partie C, σ corrigée = σ × (220 + V) / 220 vaut :", u: "mS/cm", sig: 3, f: [r => r.s * (220 + r.V) / 220, r => r.s * 220 / (220 + r.V)], s: ["e", "o0", "o2", "o1"] },
      B_min: { part: "B", g: 1, min: 3, q: "Dans ton tableau de la partie B, le volume pour lequel σ est la plus faible vaut :", u: "mL", sig: 3, s: [R => R.reduce((a, r) => r.s < a.s ? r : a, R[0]).V / 2, R => R.reduce((a, r) => r.s < a.s ? r : a, R[0]).V, R => R[R.length - 1].V, R => R.reduce((a, r) => r.s < a.s ? r : a, R[0]).V * 1.3] },
      B_C: { part: "B", g: 1, min: 3, q: "En prenant pour V_E le volume où σ est la plus faible dans ta partie B, C(HCl) = 0,100 × V_E / 20,0 vaut :", u: "mol/L", sig: 3, s: [R => 0.1 * R.reduce((a, r) => r.s < a.s ? r : a, R[0]).V / 10, R => 0.1 * 20 / R.reduce((a, r) => r.s < a.s ? r : a, R[0]).V, R => 0.1 * R.reduce((a, r) => r.s < a.s ? r : a, R[0]).V / 20, R => R.reduce((a, r) => r.s < a.s ? r : a, R[0]).V / 20] },
      C_0: { part: "C", g: 1, min: 3, q: "Dans ton tableau de la partie C, la conductivité mesurée au premier point vaut :", u: "mS/cm", sig: 3, s: [R => R[R.length - 1].s, R => R[0].s, R => R[0].s * 2, R => Math.max(...R.map(r => r.s))] }
    },
    cksp: {
      A_oh: { part: "A", q: "Pour ton essai n°{k} de la partie A, [HO⁻] = 0,0500 × V_E / 10,0 vaut :", u: "mol/L", sig: 3, f: [r => 0.005 * r.V, r => 0.0025 * r.V], s: ["o0", "e", "o2", "o1"] },
      A_s: { part: "A", q: "Pour ton essai n°{k} de la partie A, la solubilité s₁ = [HO⁻] / 2 vaut :", u: "mol/L", sig: 3, f: [r => 0.0025 * r.V, r => 0.005 * r.V], s: ["e", "o1", "o0", "o2"] },
      B_s: { part: "B", q: "Pour ton essai n°{k} de la partie B, s₂ = [HO⁻] / 2 vaut :", u: "mol/L", sig: 3, f: [r => 0.0025 * r.V, r => 0.005 * r.V], s: ["o1", "o2", "e", "o0"] },
      A_ks: { part: "A", g: 1, min: 2, q: "Avec la moyenne de tes essais de la partie A, Ks ≈ 4 s₁³ vaut :", u: "", sig: 3, s: [R => Math.pow(0.0025 * R.reduce((s, r) => s + r.V, 0) / R.length, 3), R => 4 * Math.pow(0.0025 * R.reduce((s, r) => s + r.V, 0) / R.length, 3), R => 4 * Math.pow(0.0025 * R.reduce((s, r) => s + r.V, 0) / R.length, 2), R => 4 * Math.pow(0.005 * R.reduce((s, r) => s + r.V, 0) / R.length, 3)] },
      B_ks: { part: "B", g: 1, min: 2, q: "Avec la moyenne de tes essais de la partie B, Ks ≈ (C₀ + s₂)(2 s₂)² (C₀ = 0,100 mol/L) vaut :", u: "", sig: 3, s: [R => 4 * Math.pow(0.0025 * R.reduce((s, r) => s + r.V, 0) / R.length, 3), R => 0.1 * Math.pow(0.005 * R.reduce((s, r) => s + r.V, 0) / R.length, 2), R => { var s2 = 0.0025 * R.reduce((s, r) => s + r.V, 0) / R.length; return (0.1 + s2) * 4 * s2 * s2; }, R => { var s2 = 0.0025 * R.reduce((s, r) => s + r.V, 0) / R.length; return (0.1 + s2) * 2 * s2; }] }
    },
    cjavel: {
      B_c: { part: "B", q: "Pour ton essai n°{k} de la partie B, C(ClO⁻) diluée = 0,1000 × V_E / 20,0 vaut :", u: "mol/L", sig: 3, f: [r => 0.005 * r.V, r => 0.01 * r.V], s: ["o0", "e", "o1", "o2"] },
      B_n: { part: "B", q: "Pour ton essai n°{k} de la partie B, la quantité de thiosulfate versée à l'équivalence vaut :", u: "mmol", sig: 3, f: [r => 0.1 * r.V, r => 0.05 * r.V], s: ["e", "o1", "o0", "o2"] },
      B_i: { part: "B", q: "Pour ton essai n°{k} de la partie B, la quantité de diiode dosée vaut :", u: "mmol", sig: 3, f: [r => 0.05 * r.V, r => 0.1 * r.V], s: ["o1", "o0", "e", "o2"] },
      B_cc: { part: "B", q: "Pour ton essai n°{k} de la partie B, la concentration en ClO⁻ de l'eau de Javel commerciale (dilution au 1/10) vaut :", u: "mol/L", sig: 3, f: [r => 0.05 * r.V, r => 0.005 * r.V], s: ["o2", "e", "o0", "o1"] },
      B_m: { part: "B", g: 1, min: 2, q: "D'après tes essais de la partie B, la moyenne des volumes équivalents vaut :", u: "mL", sig: 4, s: [R => R.reduce((s, r) => s + r.V, 0) / R.length, R => Math.max(...R.map(r => r.V)) + 0.4, R => R.reduce((s, r) => s + r.V, 0) / R.length / 2, R => Math.min(...R.map(r => r.V)) - 0.4] }
    },
    ch2o2: {
      B_n: { part: "B", q: "Pour ton essai n°{k} de la partie B, la quantité de permanganate versée en prenant C(MnO₄⁻) = 0,0200 mol/L vaut :", u: "mmol", sig: 3, f: [r => 0.02 * r.V, r => 0.05 * r.V], s: ["o0", "e", "o1", "o2"] },
      B_h: { part: "B", q: "Pour ton essai n°{k} de la partie B, la quantité de H₂O₂ dosée en prenant C(MnO₄⁻) = 0,0200 mol/L vaut :", u: "mmol", sig: 3, f: [r => 0.05 * r.V, r => 0.008 * r.V], s: ["e", "o1", "o0", "o2"] },
      B_c: { part: "B", q: "Pour ton essai n°{k} de la partie B, C(H₂O₂) diluée en prenant C(MnO₄⁻) = 0,0200 mol/L vaut :", u: "mol/L", sig: 3, f: [r => 0.005 * r.V, r => 0.0008 * r.V], s: ["o1", "o0", "e", "o2"] },
      B_t: { part: "B", q: "Pour ton essai n°{k} de la partie B, le titre volumique de l'eau oxygénée commerciale en prenant C(MnO₄⁻) = 0,0200 mol/L vaut :", u: "volumes", sig: 3, f: [r => 0.56 * r.V, r => 0.056 * r.V], s: ["o2", "e", "o0", "o1"] },
      B_m: { part: "B", g: 1, min: 2, q: "D'après tes essais de la partie B, la moyenne des volumes équivalents vaut :", u: "mL", sig: 4, s: [R => Math.max(...R.map(r => r.V)) + 0.4, R => R.reduce((s, r) => s + r.V, 0) / R.length, R => R.reduce((s, r) => s + r.V, 0) / R.length / 2, R => Math.min(...R.map(r => r.V)) - 0.4] }
    },
    cdichro: {
      A_C: { part: "A", q: "Pour ton essai n°{k} de la partie A, en prenant C_M = 0,0200 mol/L, C_F = 5 × C_M × V_E / 10,0 vaut :", u: "mol/L", sig: 3, f: [r => 0.01 * r.V, r => 0.002 * r.V], s: ["o0", "e", "o1", "o2"] },
      B_nr: { part: "B", q: "Pour ton essai n°{k} de la partie B, en prenant C_M = 0,0200 mol/L, n(Fe²⁺) restant = 5 C_M V_E vaut :", u: "mmol", sig: 3, f: [r => 0.1 * r.V, r => 0.02 * r.V], s: ["e", "o0", "o2", "o1"] },
      B_ni: { part: "B", q: "Pour ton essai n°{k} de la partie B, en prenant C_F = 0,100 mol/L, n(Fe²⁺) introduit = C_F V_F vaut :", u: "mmol", sig: 3, f: [r => 0.1 * r.VF, r => 0.1 * r.VF / 6], s: ["o1", "o2", "e", "o0"] },
      B_nd: { part: "B", q: "Pour ton essai n°{k} de la partie B, en prenant C_F = 0,100 mol/L et C_M = 0,0200 mol/L, n(Cr₂O₇²⁻) = (C_F V_F − 5 C_M V_E) / 6 vaut :", u: "mmol", sig: 3, f: [r => (0.1 * r.VF - 0.1 * r.V) / 6, r => (0.1 * r.VF - 0.1 * r.V) / 5], s: ["o2", "o0", "e", "o1"] },
      A_m: { part: "A", g: 1, min: 2, q: "D'après tes essais de la partie A, la moyenne des volumes équivalents vaut :", u: "mL", sig: 4, s: [R => R.reduce((s, r) => s + r.V, 0) / R.length, R => Math.max(...R.map(r => r.V)) + 0.4, R => Math.min(...R.map(r => r.V)) - 0.4, R => R.reduce((s, r) => s + r.V, 0) / R.length * 5] }
    },
    cpot: {
      A_e: { part: "A", q: "Pour ta mesure n°{k}, le potentiel de l'électrode de platine par rapport à l'ENH (E_ECS = 0,244 V) vaut :", u: "V", sig: 3, f: [r => r.E / 1000 + 0.244, r => r.E / 1000 - 0.244], s: ["o0", "e", "o1", "o2"] },
      A_s: { part: "A", g: 1, min: 3, q: "D'après tes mesures, le volume au milieu de l'intervalle où ΔE/ΔV est le plus grand vaut :", u: "mL", sig: 3, s: [R => cxMid(R, "E") / 2, R => cxMid(R, "E"), R => R[R.length - 1].V, R => cxMid(R, "E") * 1.25] },
      A_h: { part: "A", g: 1, min: 3, q: "Dans ton tableau, le potentiel relevé au point le plus proche de V_E/2 (V_E : milieu de l'intervalle où ΔE/ΔV est le plus grand) vaut :", u: "mV", sig: 3, s: [R => cxNear(R, cxMid(R, "E") / 2).E, R => R[0].E, R => cxNear(R, cxMid(R, "E")).E, R => cxNear(R, cxMid(R, "E") / 4).E] },
      A_C: { part: "A", g: 1, min: 3, q: "En prenant C(MnO₄⁻) = 0,0200 mol/L et pour V_E le milieu de l'intervalle où ΔE/ΔV est le plus grand, C(Fe²⁺) = 5 × 0,0200 × V_E / 20,0 vaut :", u: "mol/L", sig: 3, s: [R => 0.001 * cxMid(R, "E"), R => 0.025 * cxMid(R, "E"), R => 0.005 * cxMid(R, "E"), R => 0.0002 * cxMid(R, "E")] },
      A_d: { part: "A", g: 1, min: 3, q: "Dans ton tableau, la plus grande valeur de ΔE/ΔV (entre deux points consécutifs) vaut :", u: "mV/mL", sig: 3, s: [R => { var b = 0; for (var i = 1; i < R.length; i++) b = Math.max(b, (R[i].E - R[i - 1].E) / (R[i].V - R[i - 1].V)); return b / 10; }, R => Math.max(...R.map(r => r.E)) - Math.min(...R.map(r => r.E)), R => { var b = 0; for (var i = 1; i < R.length; i++) b = Math.max(b, (R[i].E - R[i - 1].E) / (R[i].V - R[i - 1].V)); return b; }, R => Math.max(...R.map(r => r.E))] }
    }
  });
})();
