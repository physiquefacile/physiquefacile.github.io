/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* Questions de quiz d'optique accompagnées d'un schéma (champ fig : SVG, figcap : légende). */
(function () {
  const O = window.OPT_SVG, Q = window.QUIZ;
  if (!O || !Q) return;
  const { Scene, G, lentille, miroirSph, prisme } = O;
  const sinD = d => Math.sin(G.rad(d)), asinD = x => G.deg(Math.asin(x));
  const add = (k, qs) => { if (Q[k]) Q[k].qs.push(...qs); };

  /* ---------- Chapitre 1 ---------- */
  // 1. Quel rayon est réfracté ? (air -> verre)
  const f1 = (() => {
    const S = Scene({ W: 440, H: 260, x0: -1.6, x1: 1.6, y0: -1.25, y1: 1.25, eq: true });
    S.rect(-1.6, 0, 1.6, -1.25, "b", 0.13).line(-1.6, 0, 1.6, 0, "fg", 1.6).line(0, 1.15, 0, -1.15, "mu", 1, "5 4");
    S.text(-1.5, 0.12, "air (n₁ = 1,00)", "fg", { a: "start", dy: -4 }).text(-1.5, -1.1, "verre (n₂ = 1,50)", "fg", { a: "start" });
    const i = 50, r = asinD(sinD(i) / 1.5), L = 1.2, P = [-L * sinD(i), L * Math.cos(G.rad(i))];
    S.ray([P, [0, 0]], "o").arc(0, 0, 90, 90 + i, 34, "50°");
    [[70, "1"], [r, "2"], [i, "3"]].forEach(([a, l]) => { const E = [L * sinD(a) * 0.95, -L * Math.cos(G.rad(a)) * 0.95]; S.ray([[0, 0], E], "r", { w: 1.6 }).text(E[0], E[1], l, "r", { dx: 9, dy: 4, b: true }); });
    return S.svg("Rayon incident sur un dioptre air-verre et trois rayons candidats");
  })();
  // 2. Réflexion totale (verre -> air, i = 55°)
  const f2 = (() => {
    const S = Scene({ W: 440, H: 240, x0: -1.6, x1: 1.6, y0: -1.2, y1: 1.05, eq: true });
    S.rect(-1.6, 0, 1.6, -1.2, "b", 0.13).line(-1.6, 0, 1.6, 0, "fg", 1.6).line(0, 0.95, 0, -1.1, "mu", 1, "5 4");
    S.text(-1.5, 0.12, "air (n = 1,00)", "fg", { a: "start", dy: -4 }).text(-1.5, -1.05, "verre (n = 1,50)", "fg", { a: "start" });
    const i = 55, P = [-1.25 * sinD(i), -1.25 * Math.cos(G.rad(i))];
    S.ray([P, [0, 0]], "o").arc(0, 0, 270 - i, 270, 34, "55°").text(0.55, 0.45, "?", "r", { s: 22, b: true });
    return S.svg("Rayon arrivant du verre vers l'air sous une incidence de 55 degrés");
  })();
  // 3. Angle mesuré par rapport à la surface
  const f3 = (() => {
    const S = Scene({ W: 440, H: 220, x0: -1.6, x1: 1.6, y0: -0.9, y1: 1.0, eq: true });
    S.rect(-1.6, 0, 1.6, -0.9, "b", 0.13).line(-1.6, 0, 1.6, 0, "fg", 1.6).line(0, 0.95, 0, -0.85, "mu", 1, "5 4");
    S.text(0.04, 0.88, "normale", "mu", { a: "start" });
    const a = 25, P = [-1.4 * Math.cos(G.rad(a)), 1.4 * sinD(a)];
    S.ray([P, [0, 0]], "o").arc(0, 0, 180 - a, 180, 60, "25°", "r");
    return S.svg("Rayon incident faisant un angle de 25 degrés avec la surface");
  })();

  /* ---------- Chapitre 2 ---------- */
  // 4. Image d'un point par un miroir plan (quadrillage)
  const f4 = (() => {
    const S = Scene({ W: 440, H: 250, x0: -5, x1: 5, y0: -3.2, y1: 3.2, eq: true });
    S.grid(-5, 5, -3, 3, 1).mirror(0, -3, 0, 3, 1, 0).text(0, 3, "miroir", "fg", { dy: -4, a: "end", dx: -4 });
    S.pt(-3, 2, "A", "ac", -8, -10);
    [[1.5, 2, "1"], [3, 2, "2"], [3, -2, "3"]].forEach(([x, y, l]) => S.raw(`<circle cx="${S.X(x)}" cy="${S.Y(y)}" r="5" style="fill:none;stroke:var(--rouge);stroke-width:2"/>`).text(x, y, l, "r", { dx: 12, dy: 4, b: true }));
    return S.svg("Point A devant un miroir plan et trois positions candidates pour l'image");
  })();
  // 5. Deux miroirs perpendiculaires
  const f5 = (() => {
    const S = Scene({ W: 380, H: 250, x0: -0.6, x1: 4.2, y0: -0.6, y1: 3.4, eq: true });
    S.mirror(0, 0, 4, 0, -0.5, -1).mirror(0, 0, 0, 3.2, -1, -0.5).arc(0, 0, 0, 90, 26, "90°");
    S.vec(1.8, 1.0, 1.8, 2.0, "ac", "objet");
    S.text(3.2, 0, "M₁", "fg", { dy: 18 }).text(0, 2.8, "M₂", "fg", { dx: -14 });
    return S.svg("Objet placé entre deux miroirs plans perpendiculaires");
  })();
  // 6. Profondeur apparente
  const f6 = (() => {
    const S = Scene({ W: 440, H: 270, x0: -3, x1: 3, y0: -3.6, y1: 2.6, eq: true });
    S.rect(-3, 0, 3, -3.6, "b", 0.16).line(-3, 0, 3, 0, "fg", 1.6).text(-2.9, -3.4, "eau (n = 1,33)", "fg", { a: "start" });
    const A = [0, -3], hp = 3 / 1.33;
    [-0.55, 0.55].forEach(x => { const I = [x, 0], d = [x - 0, hp], l = Math.hypot(...d), E = [x + d[0] / l * 2.2, d[1] / l * 2.2]; S.ray([A, I], "o", { w: 1.6 }).ray([I, E], "o", { w: 1.6 }); });
    S.raw(`<ellipse cx="${S.X(0)}" cy="${S.Y(2.35)}" rx="13" ry="7" style="fill:none;stroke:var(--fg);stroke-width:1.6"/><circle cx="${S.X(0)}" cy="${S.Y(2.35)}" r="3" style="fill:var(--fg)"/>`).text(0.35, 2.35, "œil", "fg", { a: "start", dy: 4 });
    S.pt(0, -3, "poisson", "ac", 4, 34);
    [[-hp, "1"], [-3.5, "2"]].forEach(([y, l]) => S.raw(`<circle cx="${S.X(-1.6)}" cy="${S.Y(y)}" r="5" style="fill:none;stroke:var(--rouge);stroke-width:2"/>`).text(-1.6, y, l, "r", { dx: -14, dy: 4, b: true }).line(-1.4, y, 1.4, y, "r", 0.8, "2 4"));
    return S.svg("Poisson observé depuis l'air presque à la verticale");
  })();

  /* ---------- Chapitre 3 ---------- */
  // 7. Sens de la déviation par un prisme
  const f7 = prisme({ A: 60, n: 1.5, i: 50, arcs: false, out: 0.95, hook(S, g) {
    const rot = (d, a) => { const c = Math.cos(G.rad(a)), s = Math.sin(G.rad(a)); return [d[0] * c - d[1] * s, d[0] * s + d[1] * c]; };
    const J = g.J, D = g.D;
    [[rot(g.d0, D * 0.8), "1"], [g.d0, "3"]].forEach(([d, l]) => { const K = [J[0] + d[0] * 0.95, J[1] + d[1] * 0.95]; S.ray([J, K], "r", { w: 1.6 }).text(K[0], K[1], l, "r", { a: "start", dx: 6, dy: 4, b: true }); });
    S.text(g.K[0], g.K[1], "2", "o", { a: "start", dx: 6, dy: 4, b: true });
  } }).svg;
  // 8. Dispersion de la lumière blanche
  const f8 = prisme({ A: 60, i: 50, arcs: false, out: 1.1, ns: [{ n: 1.58, col: "#d94a3d", lab: "2" }, { n: 1.66, col: "#7b4fd6", lab: "1" }], hook(S) { S.text(-1.45, 0.42, "lumière blanche", "fg", { a: "start" }); } }).svg;
  // 9. Lame à faces parallèles
  const f9 = (() => {
    const S = Scene({ W: 440, H: 310, x0: -1.7, x1: 1.7, y0: -2.25, y1: 1.15, eq: true });
    S.rect(-1.7, 0, 1.7, -1, "ac", 0.15).line(-1.7, 0, 1.7, 0, "fg", 1.4).line(-1.7, -1, 1.7, -1, "fg", 1.4).text(1.65, -0.6, "lame de verre", "fg", { a: "end" });
    const i = 50, r = asinD(sinD(i) / 1.5), I = [-0.6, 0], P = [I[0] - 1.1 * sinD(i), 1.1 * Math.cos(G.rad(i))], J = [I[0] + Math.tan(G.rad(r)), -1];
    S.ray([P, I], "o").ray([I, J], "o");
    const d = [sinD(i), -Math.cos(G.rad(i))];
    const cand = (a, l, L) => { const E = [J[0] + sinD(a) * L, -1 - Math.cos(G.rad(a)) * L]; S.ray([J, E], "r", { w: 1.6 }).text(E[0], E[1], l, "r", { a: "start", dx: 6, dy: 5, b: true }); };
    cand(i, "1", 1.15); cand(r, "2", 1.15); cand(80, "3", 1.0);
    S.line(I[0], 0, I[0] + d[0] * 2.4, d[1] * 2.4, "mu", 1, "4 4");
    return S.svg("Rayon traversant une lame à faces parallèles et trois rayons émergents candidats");
  })();

  /* ---------- Chapitre 4 ---------- */
  const f10 = miroirSph({ SC: -4, SA: -6.5, AB: 1.2, SAp: 1 / (2 / -4 + 1 / 6.5), ApBp: -1.2 * (1 / (2 / -4 + 1 / 6.5)) / -6.5, noImage: true });
  const f11 = (() => {
    const S = Scene({ W: 440, H: 240, x0: -7, x1: 1.2, y0: -2.4, y1: 2.6 });
    S.axis(-7, 1.2).smirror(0, 2.2, true, "M (concave)").pt(-2, 0, "F").pt(-4, 0, "C").pt(0, 0, "S", "fg", 16, 8);
    const yM = 0.6;
    S.ray([[-6.5, -0.3 * 4.5 + 0], [0, yM]], "o");
    S.ray([[0, yM], [-6.8, yM]], "r", { w: 1.6 }).text(-6.8, yM, "1", "r", { dx: -4, dy: -6, b: true });
    S.ray([[0, yM], [-6.6, yM - (yM / 4) * 6.6]], "r", { w: 1.6 }).text(-6.6, yM - (yM / 4) * 6.6, "2", "r", { dx: -4, dy: 14, b: true });
    S.ray([[0, yM], [-6.0, yM + 0.3 * 6.0]], "r", { w: 1.6 }).text(-6.0, yM + 1.8, "3", "r", { dx: -4, dy: -6, b: true });
    return S.svg("Rayon incident passant par le foyer d'un miroir concave et trois rayons réfléchis candidats");
  })();
  const SAc = 1 / (1 / 1.5 + 1 / 4.5);
  const f12 = miroirSph({ SC: 3, SA: -4.5, AB: 1.5, SAp: SAc, ApBp: 1.5 * SAc / 4.5 });

  /* ---------- Chapitre 5 ---------- */
  const f13 = (() => {
    const S = Scene({ W: 440, H: 230, x0: -6, x1: 6.5, y0: -2.2, y1: 2.2 });
    S.axis(-6, 6.5).lens(0, 2, true, "L").pt(3, 0, "F′").pt(-3, 0, "F").pt(0, 0, "O", "fg", 16, -8);
    const h = 1.2; S.ray([[-5.5, h], [0, h]], "o");
    S.ray([[0, h], [6, h - h / 3 * 6]], "r", { w: 1.6 }).text(6, -h, "1", "r", { a: "start", dx: 5, dy: 4, b: true });
    S.ray([[0, h], [6, h]], "r", { w: 1.6 }).text(6, h, "2", "r", { a: "start", dx: 5, dy: 4, b: true });
    S.ray([[0, h], [5, h + h / 3 * 5 * 0.35]], "r", { w: 1.6 }).text(5, h + h / 3 * 5 * 0.35, "3", "r", { a: "start", dx: 5, dy: 0, b: true });
    return S.svg("Rayon parallèle à l'axe arrivant sur une lentille convergente");
  })();
  const OAl = -1.5, fl = 3, OApl = 1 / (1 / fl + 1 / OAl);
  const f14 = lentille({ fp: fl, OA: OAl, AB: 1, OAp: OApl, ApBp: OApl / OAl });
  const f15 = (() => {
    const S = Scene({ W: 440, H: 230, x0: -6, x1: 6.5, y0: -2.3, y1: 2.3 });
    S.axis(-6, 6.5).lens(0, 2, false, "L").pt(-3, 0, "F′").pt(3, 0, "F").pt(0, 0, "O", "fg", 16, -8);
    const h = 0.8; S.ray([[-5.5, h], [0, h]], "o");
    S.ray([[0, h], [5.2, h + h / 3 * 5.2]], "r", { w: 1.6 }).text(5.2, h + h / 3 * 5.2, "1", "r", { a: "start", dx: 5, dy: 4, b: true });
    S.ray([[0, h], [6, h - h / 3 * 6]], "r", { w: 1.6 }).text(6, h - h / 3 * 6, "2", "r", { a: "start", dx: 5, dy: 4, b: true });
    S.ray([[0, h], [6, h]], "r", { w: 1.6 }).text(6, h, "3", "r", { a: "start", dx: 5, dy: 4, b: true });
    return S.svg("Rayon parallèle à l'axe arrivant sur une lentille divergente");
  })();

  add("opt1", [
    { q: "Un rayon passe de l'air dans le verre (schéma). Quel rayon représente le rayon réfracté ?", fig: f1, figcap: "Incidence $i_1=50^\\circ$ sur un dioptre air-verre ; trois rayons candidats.",
      c: ["Le rayon 1", "Le rayon 2", "Le rayon 3", "Aucun : la lumière est totalement réfléchie"], a: 1,
      e: "$\\sin i_2=\\dfrac{1{,}00\\times\\sin50^\\circ}{1{,}50}\\approx0{,}51$, d'où $i_2\\approx31^\\circ$ : le rayon se rapproche de la normale en entrant dans un milieu plus réfringent. Le rayon 3 n'est pas dévié et le rayon 1 s'écarte de la normale.", s: "Lois de Snell-Descartes" },
    { q: "Le rayon du schéma se propage dans le verre ($n=1{,}50$) et atteint la surface verre-air sous l'incidence $55^\\circ$. Que devient-il ?", fig: f2, figcap: "Rayon venant du verre vers l'air.",
      c: ["Il est totalement réfléchi dans le verre", "Il passe dans l'air en s'écartant de la normale", "Il passe dans l'air en se rapprochant de la normale", "Il traverse la surface sans être dévié"], a: 0,
      e: "Angle critique : $\\sin\\lambda=\\dfrac1{1{,}50}$, soit $\\lambda\\approx41{,}8^\\circ$. Comme $55^\\circ>\\lambda$, $\\sin i_2=1{,}50\\sin55^\\circ\\approx1{,}23>1$ est impossible : réflexion totale.", s: "Réflexion totale" },
    { q: "Sur le schéma, le rayon incident fait un angle de $25^\\circ$ avec la surface. L'angle d'incidence vaut :", fig: f3, figcap: "L'angle marqué est mesuré par rapport à la surface, pas par rapport à la normale.",
      c: ["$25^\\circ$", "$65^\\circ$", "$50^\\circ$", "$115^\\circ$"], a: 1,
      e: "L'angle d'incidence se mesure entre le rayon et la <b>normale</b> : $i=90^\\circ-25^\\circ=65^\\circ$. C'est l'erreur la plus fréquente dans la lecture des schémas.", s: "Lois de Snell-Descartes" }
  ]);
  add("opt2", [
    { q: "Le point $A$ est placé devant un miroir plan (1 carreau = 1 cm). Où se trouve son image $A'$ ?", fig: f4, figcap: "Trois positions candidates repérées 1, 2 et 3.",
      c: ["Au point 1", "Au point 2", "Au point 3", "Le miroir ne donne pas d'image d'un point"], a: 1,
      e: "L'image est le symétrique de l'objet par rapport au plan du miroir : $A$ est à 3 carreaux devant, à 2 carreaux au-dessus de l'axe, donc $A'$ est à 3 carreaux derrière, à la même hauteur : point 2. Elle est virtuelle.", s: "Miroir plan" },
    { q: "Un objet est placé entre deux miroirs plans perpendiculaires (schéma). Combien d'images voit-on ?", fig: f5, figcap: "Deux miroirs plans M₁ et M₂ formant un angle de 90°.",
      c: ["2", "3", "4", "Une infinité"], a: 1,
      e: "Chaque miroir donne une image ($A_1$ et $A_2$), et l'image d'une image par l'autre miroir donne une troisième image confondue pour les deux (symétrique de $A$ par rapport à l'arête). Pour un angle $\\alpha$ tel que $360/\\alpha$ est entier : $N=\\dfrac{360^\\circ}{\\alpha}-1=3$.", s: "Miroir plan" },
    { q: "Un poisson est au fond de l'eau ; on l'observe presque à la verticale (schéma). Où le voit-on ?", fig: f6, figcap: "Deux rayons issus du poisson sortent de l'eau en s'écartant de la normale.",
      c: ["En 1, plus près de la surface", "En 2, plus profond qu'il n'est", "À sa position réelle", "À la surface de l'eau"], a: 0,
      e: "Les rayons réfractés s'écartent de la normale en sortant de l'eau ; leurs prolongements se coupent au-dessus du poisson. Dioptre plan : $h'=\\dfrac h{n}=\\dfrac h{1{,}33}\\approx0{,}75\\,h$ : on le voit en 1.", s: "Objet et image" }
  ]);
  add("opt3", [
    { q: "Un rayon traverse un prisme de verre placé dans l'air (schéma). Quel est le rayon émergent ?", fig: f7, figcap: "Prisme d'angle $A=60^\\circ$, indice $n=1{,}5$ ; incidence $50^\\circ$.",
      c: ["Le rayon 1", "Le rayon 2", "Le rayon 3", "Aucun : réflexion totale sur la deuxième face"], a: 1,
      e: "Un prisme plus réfringent que l'air dévie toujours la lumière <b>vers sa base</b>. Ici $r\\approx30{,}7^\\circ$, $r'=A-r\\approx29{,}3^\\circ$ (inférieur à $\\lambda\\approx41{,}8^\\circ$, donc émergence) et $i'\\approx47{,}2^\\circ$ : $D=i+i'-A\\approx37^\\circ$.", s: "Formules du prisme" },
    { q: "Un faisceau de lumière blanche traverse un prisme (schéma). Le rayon 1, le plus dévié, est de couleur :", fig: f8, figcap: "Dispersion de la lumière blanche par un prisme (écarts exagérés).",
      c: ["rouge", "violette", "verte", "blanche"], a: 1,
      e: "L'indice du verre augmente quand la longueur d'onde diminue (loi de Cauchy $n=A+B/\\lambda^2$). Le violet ($\\lambda\\approx400$ nm) a l'indice le plus grand : il est le plus dévié ; le rouge est le moins dévié.", s: "Dispersion" },
    { q: "Un rayon traverse une lame de verre à faces parallèles (schéma). Quel est le rayon émergent ?", fig: f9, figcap: "Le pointillé prolonge le rayon incident.",
      c: ["Le rayon 1", "Le rayon 2", "Le rayon 3", "Aucun : le rayon reste piégé dans la lame"], a: 0,
      e: "Les deux faces sont parallèles : $n\\sin r=\\sin i'$ et $\\sin i=n\\sin r$ donnent $i'=i$. Le rayon émergent est <b>parallèle</b> au rayon incident mais décalé latéralement de $d=e\\,\\dfrac{\\sin(i-r)}{\\cos r}$ : c'est le rayon 1.", s: "Lame à faces parallèles" }
  ]);
  add("opt4", [
    { q: "On construit l'image de $AB$, situé avant le centre $C$ d'un miroir concave (schéma). L'image est :", fig: f10, figcap: "Rayon parallèle à l'axe (orange) et rayon passant par le sommet (vert).",
      c: ["réelle, renversée et réduite", "réelle, renversée et agrandie", "virtuelle, droite et agrandie", "virtuelle, droite et réduite"], a: 0,
      e: "Les rayons réfléchis se coupent réellement devant le miroir, entre $C$ et $F$, sous l'axe : image réelle et renversée. Objet au-delà de $C$ ⇒ image entre $C$ et $F$, plus petite ($|\\gamma|<1$).", s: "Construction des images" },
    { q: "Un rayon passe par le foyer $F$ d'un miroir concave avant de s'y réfléchir (schéma). Quel est le rayon réfléchi ?", fig: f11, figcap: "Miroir concave : centre $C$, foyer $F$ au milieu de $[SC]$.",
      c: ["Le rayon 1", "Le rayon 2", "Le rayon 3", "Il repart sur lui-même"], a: 0,
      e: "Par retour inverse de la lumière, un rayon passant par le foyer objet $F$ ressort <b>parallèle à l'axe</b> (rayon 1). Seul un rayon passant par $C$ repart sur lui-même.", s: "Miroir sphérique" },
    { q: "Le schéma montre l'image d'un objet réel par un miroir convexe (rétroviseur). Cette image est toujours :", fig: f12, figcap: "Les prolongements (pointillés) des rayons réfléchis se coupent derrière le miroir.",
      c: ["virtuelle, droite et réduite", "réelle, renversée et réduite", "virtuelle, droite et agrandie", "réelle, droite et agrandie"], a: 0,
      e: "Pour un miroir convexe et un objet réel, $\\overline{SA'}=\\dfrac{1}{1/\\overline{SF}-1/\\overline{SA}}$ est positif et inférieur à $\\overline{SF}$ : image virtuelle, droite, réduite. D'où le large champ de vision des rétroviseurs.", s: "Miroir sphérique" }
  ]);
  add("opt5", [
    { q: "Un rayon parallèle à l'axe arrive sur une lentille convergente (schéma). Quel est le rayon émergent ?", fig: f13, figcap: "Lentille convergente : foyers $F$ et $F'$.",
      c: ["Le rayon 1", "Le rayon 2", "Le rayon 3", "Le rayon revient en arrière"], a: 0,
      e: "Tout rayon incident parallèle à l'axe optique émerge en passant par le <b>foyer image</b> $F'$ : c'est le rayon 1. Seul le rayon passant par le centre $O$ n'est pas dévié.", s: "Construction des images" },
    { q: "L'objet $AB$ est placé entre le foyer objet $F$ et le centre $O$ d'une lentille convergente (schéma). L'image $A'B'$ est :", fig: f14, figcap: "Les pointillés prolongent les rayons émergents vers l'arrière.",
      c: ["virtuelle, droite et agrandie", "réelle, renversée et agrandie", "réelle, droite et réduite", "rejetée à l'infini"], a: 0,
      e: "Les rayons émergents divergent : leurs prolongements se coupent avant la lentille, du même côté que l'objet : image virtuelle, droite et agrandie. C'est le principe de la <b>loupe</b>.", s: "Construction des images" },
    { q: "Un rayon parallèle à l'axe arrive sur une lentille divergente (schéma). Quel est le rayon émergent ?", fig: f15, figcap: "Lentille divergente : le foyer image $F'$ est situé avant la lentille.",
      c: ["Le rayon 1", "Le rayon 2", "Le rayon 3", "Il passe par le foyer objet $F$"], a: 0,
      e: "Pour une lentille divergente, un rayon parallèle à l'axe émerge en <b>semblant provenir</b> du foyer image $F'$ (situé du côté de la lumière incidente) : il s'écarte de l'axe, c'est le rayon 1.", s: "Construction des images" }
  ]);
})();
