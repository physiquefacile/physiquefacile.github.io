/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* Exercices d'entraînement illustrés par un schéma dans un repère orthonormé.
   Chaque schéma est dessiné avec les valeurs tirées pour l'exercice (même échelle sur les deux axes).
   Un générateur peut renvoyer, en plus des champs habituels :
     figure    : { svg, legende }  (schéma de l'énoncé)
     figureCor : { svg, legende }  (schéma de la correction, facultatif) */
(function () {
  const T = window.EXO_OUTILS, EX = window.EXOS;
  if (!T || !EX) return;
  const { R, g, K, rnd, pick, nz, N, deg, rad, sgn } = T;

  /* ---------------------------------------------------------------- figures */
  const COUL = { ax: "var(--fg)", c1: "var(--accent)", c2: "var(--saff)", c3: "var(--rouge)", c4: "var(--bleu)", m: "var(--muted)", ok: "var(--ok)" };
  const col = c => COUL[c] || c;
  const f1 = x => (+x.toFixed(1)).toString();

  function niceStep(range, n) {
    const raw = range / (n || 6), p = 10 ** Math.floor(Math.log10(raw)), m = raw / p;
    return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
  }

  function Fig(o) {
    const W = o.W || 440, pad = o.pad == null ? 30 : o.pad;
    const s = (W - 2 * pad) / (o.xmax - o.xmin);
    const H = Math.round(s * (o.ymax - o.ymin) + 2 * pad);
    const X = x => pad + (x - o.xmin) * s, Y = y => pad + (o.ymax - y) * s;
    const out = [];
    const F = { s, X, Y, W, H, out };

    F.line = (x1, y1, x2, y2, c, w, dash) => {
      out.push(`<line x1="${f1(X(x1))}" y1="${f1(Y(y1))}" x2="${f1(X(x2))}" y2="${f1(Y(y2))}" style="stroke:${col(c || "ax")};stroke-width:${w || 1.4}${dash ? ";stroke-dasharray:5 4" : ""}"/>`);
      return F;
    };
    // flèche en pixels
    const head = (xp, yp, ang, c, size) => {
      const L = size || 10, a1 = ang + Math.PI - 0.38, a2 = ang + Math.PI + 0.38;
      out.push(`<polygon points="${f1(xp)},${f1(yp)} ${f1(xp + L * Math.cos(a1))},${f1(yp + L * Math.sin(a1))} ${f1(xp + L * Math.cos(a2))},${f1(yp + L * Math.sin(a2))}" style="fill:${col(c)}"/>`);
    };
    F.arrowPx = (x1, y1, x2, y2, c, w, size) => {
      const ang = Math.atan2(y2 - y1, x2 - x1), L = size || 10;
      const xe = x2 - 0.7 * L * Math.cos(ang), ye = y2 - 0.7 * L * Math.sin(ang);
      out.push(`<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(xe)}" y2="${f1(ye)}" style="stroke:${col(c)};stroke-width:${w || 2.2}"/>`);
      head(x2, y2, ang, c, L);
      return F;
    };
    F.arrow = (x1, y1, x2, y2, c, w, size) => F.arrowPx(X(x1), Y(y1), X(x2), Y(y2), c, w, size);

    // texte : "F_1" donne F indice 1 ; vec:true ajoute la flèche au-dessus
    F.textPx = (xp, yp, txt, op) => {
      op = op || {};
      const size = op.size || 16, c = col(op.c || "ax"), anchor = op.anchor || "middle";
      const [b, sub] = String(txt).split("_");
      const w = size * 0.56 * b.length + (sub ? size * 0.4 * sub.length : 0);
      const x0 = anchor === "middle" ? xp - w / 2 : anchor === "end" ? xp - w : xp;
      const st = `fill:${c};font-size:${size}px;${op.roman ? "font-style:normal;font-family:var(--f-head)" : "font-style:italic;font-family:var(--f-body)"}${op.bold ? ";font-weight:700" : ""}`;
      out.push(`<text x="${f1(x0)}" y="${f1(yp + size * 0.35)}" style="${st}">${b}${sub ? `<tspan style="font-size:${size * 0.68}px" dy="${size * 0.28}">${sub}</tspan>` : ""}</text>`);
      if (op.vec) {
        const yv = yp - size * 0.62, xs = x0 + 1, xe = x0 + size * 0.56 * b.length + 2;
        out.push(`<line x1="${f1(xs)}" y1="${f1(yv)}" x2="${f1(xe - 3)}" y2="${f1(yv)}" style="stroke:${c};stroke-width:1.2"/>`);
        head(xe, yv, 0, op.c || "ax", 5);
      }
      return F;
    };
    F.text = (x, y, txt, op) => F.textPx(X(x), Y(y), txt, op);

    F.grid = step => {
      step = step || 1;
      for (let x = Math.ceil(o.xmin / step) * step; x <= o.xmax + 1e-9; x += step) out.push(`<line x1="${f1(X(x))}" y1="${f1(Y(o.ymin))}" x2="${f1(X(x))}" y2="${f1(Y(o.ymax))}" style="stroke:var(--grid);stroke-width:1"/>`);
      for (let y = Math.ceil(o.ymin / step) * step; y <= o.ymax + 1e-9; y += step) out.push(`<line x1="${f1(X(o.xmin))}" y1="${f1(Y(y))}" x2="${f1(X(o.xmax))}" y2="${f1(Y(y))}" style="stroke:var(--grid);stroke-width:1"/>`);
      return F;
    };
    F.axes = (xl, yl, op) => {
      op = op || {};
      const y0 = Math.min(Math.max(0, o.ymin), o.ymax), x0 = Math.min(Math.max(0, o.xmin), o.xmax);
      F.arrowPx(X(o.xmin) - 4, Y(y0), X(o.xmax) + 14, Y(y0), "ax", 1.4, 9);
      F.arrowPx(X(x0), Y(o.ymin) + 4, X(x0), Y(o.ymax) - 14, "ax", 1.4, 9);
      F.textPx(X(o.xmax) + 12, Y(y0) + 14, xl || "x", { size: 15 });
      F.textPx(X(x0) + (op.ticks ? 8 : -13), Y(o.ymax) - 10, yl || "y", { size: 15, anchor: op.ticks ? "start" : "middle" });
      if (op.O !== false) F.textPx(X(x0) - 11, Y(y0) + 13, "O", { size: 15 });
      if (op.ticks) {
        const st = op.ticks;
        for (let x = Math.ceil(o.xmin / st) * st; x <= o.xmax + 1e-9; x += st) if (Math.abs(x) > 1e-9) {
          out.push(`<line x1="${f1(X(x))}" y1="${f1(Y(y0) - 3)}" x2="${f1(X(x))}" y2="${f1(Y(y0) + 3)}" style="stroke:var(--fg);stroke-width:1"/>`);
          F.textPx(X(x), Y(y0) + 14, String(+x.toFixed(6)).replace(".", ","), { size: 10.5, roman: true, c: "m" });
        }
        for (let y = Math.ceil(o.ymin / st) * st; y <= o.ymax + 1e-9; y += st) if (Math.abs(y) > 1e-9) {
          out.push(`<line x1="${f1(X(x0) - 3)}" y1="${f1(Y(y))}" x2="${f1(X(x0) + 3)}" y2="${f1(Y(y))}" style="stroke:var(--fg);stroke-width:1"/>`);
          F.textPx(X(x0) - 6, Y(y), String(+y.toFixed(6)).replace(".", ","), { size: 10.5, roman: true, c: "m", anchor: "end" });
        }
      }
      return F;
    };
    // base (i, j) à l'origine
    F.base = (L, op) => {
      L = L || 1; op = op || {};
      const x0 = op.x || 0, y0 = op.y || 0;
      F.arrow(x0, y0, x0 + L, y0, "c1", 2.6, 9).arrow(x0, y0, x0, y0 + L, "c1", 2.6, 9);
      F.textPx(X(x0 + L / 2), Y(y0) + 15, "i", { vec: true, c: "c1", size: 15 });
      F.textPx(X(x0) - 12, Y(y0 + L / 2), "j", { vec: true, c: "c1", size: 15 });
      return F;
    };
    // vecteur avec étiquette ; side = 1 (à gauche du sens de parcours) ou -1
    F.vec = (x1, y1, x2, y2, c, label, op) => {
      op = op || {};
      F.arrow(x1, y1, x2, y2, c, op.w || 2.4, 11);
      if (label) {
        const dx = X(x2) - X(x1), dy = Y(y2) - Y(y1), L = Math.hypot(dx, dy) || 1, side = op.side || 1, t = op.t == null ? 0.55 : op.t;
        const nx = dy / L * side, ny = -dx / L * side, d = op.d || 15;
        F.textPx(X(x1) + dx * t + nx * d, Y(y1) + dy * t + ny * d, label, { vec: op.vec !== false, c, size: op.size || 16 });
      }
      return F;
    };
    F.point = (x, y, label, op) => {
      op = op || {};
      out.push(`<circle cx="${f1(X(x))}" cy="${f1(Y(y))}" r="${op.r || 3.6}" style="fill:${col(op.c || "ax")}"/>`);
      if (label) F.textPx(X(x) + (op.dx == null ? 10 : op.dx), Y(y) + (op.dy == null ? -11 : op.dy), label, { c: op.c || "ax", size: op.size || 16, anchor: op.anchor });
      return F;
    };
    F.charge = (x, y, q, label, op) => {
      op = op || {};
      const c = q > 0 ? "c3" : "c4", r = op.r || 10;
      out.push(`<circle cx="${f1(X(x))}" cy="${f1(Y(y))}" r="${r}" style="fill:${col(c)};stroke:var(--surface);stroke-width:1.5"/>`);
      F.textPx(X(x), Y(y) - 1, q > 0 ? "+" : "−", { roman: true, bold: true, size: 15, c: "#fff" });
      if (label) F.textPx(X(x) + (op.dx == null ? 0 : op.dx), Y(y) + (op.dy == null ? -20 : op.dy), label, { c, size: 15 });
      return F;
    };
    F.poly = (pts, c, w, dash, fill) => {
      out.push(`<polyline points="${pts.map(p => f1(X(p[0])) + "," + f1(Y(p[1]))).join(" ")}" style="fill:${fill || "none"};stroke:${col(c)};stroke-width:${w || 1.8}${dash ? ";stroke-dasharray:5 4" : ""}"/>`);
      return F;
    };
    F.circle = (x, y, r, c, dash) => {
      out.push(`<circle cx="${f1(X(x))}" cy="${f1(Y(y))}" r="${f1(r * s)}" style="fill:none;stroke:${col(c)};stroke-width:1.6${dash ? ";stroke-dasharray:5 4" : ""}"/>`);
      return F;
    };
    // arc d'angle (degrés, sens trigonométrique), rayon en pixels
    F.arc = (x, y, rp, a1, a2, c, label, op) => {
      op = op || {};
      if (a2 < a1) [a1, a2] = [a2, a1];
      const cx = X(x), cy = Y(y), p1 = [cx + rp * Math.cos(rad(a1)), cy - rp * Math.sin(rad(a1))], p2 = [cx + rp * Math.cos(rad(a2)), cy - rp * Math.sin(rad(a2))];
      out.push(`<path d="M${f1(p1[0])},${f1(p1[1])} A${rp},${rp} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${f1(p2[0])},${f1(p2[1])}" style="fill:none;stroke:${col(c)};stroke-width:1.4"/>`);
      if (label) {
        const am = rad((a1 + a2) / 2), rl = rp + (op.d || 12);
        F.textPx(cx + rl * Math.cos(am), cy - rl * Math.sin(am), label, { c, size: op.size || 15 });
      }
      return F;
    };
    F.svg = aria => `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${aria || "Schéma"}" xmlns="http://www.w3.org/2000/svg">${out.join("")}</svg>`;
    return F;
  }
  // cadre englobant des points, avec une marge
  function cadre(pts, m) {
    m = m == null ? 1 : m;
    const xs = pts.map(p => p[0]).concat(0), ys = pts.map(p => p[1]).concat(0);
    return { xmin: Math.floor(Math.min(...xs)) - m, xmax: Math.ceil(Math.max(...xs)) + m, ymin: Math.floor(Math.min(...ys)) - m, ymax: Math.ceil(Math.max(...ys)) + m };
  }
  const angleOx = (x, y) => deg(Math.atan2(y, x));
  const nzi = (a, b) => nz(a, b);
  window.EXO_FIG = Fig;
  const add = (list, ...fns) => fns.forEach(f => { f.fig = true; list.push(f); });

  /* ============================================ MÉCANIQUE 1 : CALCUL VECTORIEL */
  add(EX.meca1, 
    function () {
      let u, v, s;
      do { u = [nzi(-4, 4), rnd(-4, 4)]; v = [rnd(-4, 4), nzi(-4, 4)]; s = [u[0] + v[0], u[1] + v[1]]; }
      while (Math.abs(u[0] * v[1] - u[1] * v[0]) < 2 || !s[0] || !s[1] || Math.hypot(...s) < 1.5 || Math.hypot(...u) < 2 || Math.hypot(...v) < 2);
      const ns = Math.hypot(...s), phi = angleOx(s[0], s[1]);
      const box = cadre([u, v, s]);
      const fig = Fig(box).grid(1).axes("x", "y").base(1)
        .vec(0, 0, u[0], u[1], "c2", "u").vec(0, 0, v[0], v[1], "c3", "v", { side: -1 });
      const cor = Fig(box).grid(1).axes("x", "y")
        .line(u[0], u[1], s[0], s[1], "m", 1.2, true).line(v[0], v[1], s[0], s[1], "m", 1.2, true)
        .vec(0, 0, u[0], u[1], "c2", "u").vec(0, 0, v[0], v[1], "c3", "v", { side: -1 })
        .vec(0, 0, s[0], s[1], "c1", "s", { w: 3 }).arc(0, 0, 28, 0, phi, "c1", "φ", { d: 10 });
      return { titre: "Lecture de vecteurs dans un repère orthonormé",
        enonce: R`Le plan est muni du repère orthonormé $(O,\vec i,\vec j)$ ; un carreau représente une unité. Lire sur la figure les composantes des vecteurs $\vec u$ et $\vec v$, puis calculer les composantes du vecteur somme $\vec s=\vec u+\vec v$, sa norme et l'angle orienté $\varphi=(\vec i,\vec s)$, compris entre $-180^\circ$ et $180^\circ$.`,
        figure: { svg: fig.svg("Vecteurs u et v dans le repère"), legende: R`Figure — Les vecteurs $\vec u$ et $\vec v$ tracés à partir de l'origine $O$ ; la base $(\vec i,\vec j)$ est en bleu-vert.` },
        reponses: [{ nom: "s_x", val: s[0], abs: 0.01 }, { nom: "s_y", val: s[1], abs: 0.01 }, { nom: R`\|\vec s\|`, val: ns }, { nom: R`\varphi`, unite: "°", val: phi, abs: 0.6 }],
        correction: [
          R`Lecture : $\vec u=${sgn(u[0])}\,\vec i${u[1] < 0 ? "" : "+"}${N(u[1])}\,\vec j$ et $\vec v=${sgn(v[0])}\,\vec i${v[1] < 0 ? "" : "+"}${N(v[1])}\,\vec j$ (on compte les carreaux de l'origine à la pointe).`,
          R`On additionne composante par composante : $s_x=${sgn(u[0])}+${sgn(v[0])}=${s[0]}$ et $s_y=${sgn(u[1])}+${sgn(v[1])}=${s[1]}$.`,
          R`Norme : $\|\vec s\|=\sqrt{s_x^2+s_y^2}=\sqrt{${s[0] ** 2}+${s[1] ** 2}}\approx${N(ns)}$.`,
          R`Angle : $\cos\varphi=\dfrac{s_x}{\|\vec s\|}\approx${N(s[0] / ns)}$ et $\sin\varphi=\dfrac{s_y}{\|\vec s\|}\approx${N(s[1] / ns)}$ ; le signe de $\sin\varphi$ fixe le signe de l'angle : $\varphi\approx${N(phi)}^\circ$.`,
          R`Géométriquement, $\vec s$ est la diagonale du parallélogramme construit sur $\vec u$ et $\vec v$ (figure de la correction).`],
        figureCor: { svg: cor.svg("Construction du vecteur somme"), legende: R`Figure — Règle du parallélogramme : $\vec s=\vec u+\vec v$ est la diagonale issue de $O$.` } };
    },
    function () {
      let A, F, M;
      do { A = [nzi(-4, 4), nzi(-3, 3)]; F = [nzi(-3, 3), rnd(-3, 3)]; M = A[0] * F[1] - A[1] * F[0]; }
      while (M === 0 || Math.hypot(...F) < 2 || Math.hypot(...A) < 2);
      const nF = Math.hypot(...F), d = Math.abs(M) / nF;
      const tip = [A[0] + F[0], A[1] + F[1]];
      // pied de la perpendiculaire issue de O sur la droite d'action
      const u = [F[0] / nF, F[1] / nF], k = A[0] * u[0] + A[1] * u[1], H = [A[0] - k * u[0], A[1] - k * u[1]];
      const box = cadre([A, tip, H, [A[0] - F[0], A[1] - F[1]]]);
      const fig = Fig(box).grid(1).axes("x", "y").base(1)
        .line(0, 0, A[0], A[1], "m", 1.3, true).point(A[0], A[1], "A", { dx: -12, dy: -12 })
        .vec(A[0], A[1], tip[0], tip[1], "c2", "F", { w: 2.8 });
      const L = 12, cor = Fig(box).grid(1).axes("x", "y")
        .line(A[0] - L * u[0], A[1] - L * u[1], A[0] + L * u[0], A[1] + L * u[1], "m", 1.2, true)
        .line(0, 0, H[0], H[1], "c1", 2).point(H[0], H[1], "H", { c: "c1", dx: 12, dy: 12 })
        .point(A[0], A[1], "A", { dx: -12, dy: -12 }).vec(A[0], A[1], tip[0], tip[1], "c2", "F", { w: 2.8 });
      return { titre: "Moment d'une force par rapport à un point",
        enonce: R`Dans le repère orthonormé $(O,\vec i,\vec j,\vec k)$ (un carreau = 1 m pour les positions et 1 N pour les forces), une force $\vec F$ est appliquée au point $A$. Lire sur la figure les coordonnées de $A$ et les composantes de $\vec F$, puis calculer la composante $\mathcal M_z$ du moment $\vec{\mathcal M}_O=\vec{OA}\wedge\vec F$ et le bras de levier $d$ (distance de $O$ à la droite d'action de $\vec F$).`,
        figure: { svg: fig.svg("Force F appliquée au point A"), legende: R`Figure — La force $\vec F$ appliquée en $A$ ; le segment pointillé représente $\vec{OA}$. L'axe $Oz$ ($\vec k$) sort de la feuille.` },
        reponses: [{ nom: R`\mathcal M_z`, unite: "N·m", val: M, abs: 0.01 }, { nom: "d", unite: "m", val: d }],
        correction: [
          R`Lecture : $A(${A[0]}\,;\,${A[1]})$, donc $\vec{OA}=${sgn(A[0])}\,\vec i${A[1] < 0 ? "" : "+"}${A[1]}\,\vec j$ ; $\vec F=${sgn(F[0])}\,\vec i${F[1] < 0 ? "" : "+"}${F[1]}\,\vec j$ (N).`,
          R`Les deux vecteurs sont dans le plan $(xOy)$, leur produit vectoriel est porté par $\vec k$ : $\mathcal M_z=x_AF_y-y_AF_x=${sgn(A[0])}\times${sgn(F[1])}-${sgn(A[1])}\times${sgn(F[0])}=${M}$ N$\cdot$m.`,
          M > 0 ? R`$\mathcal M_z>0$ : la force tend à faire tourner le système autour de $Oz$ dans le sens trigonométrique.` : R`$\mathcal M_z<0$ : la force tend à faire tourner le système autour de $Oz$ dans le sens des aiguilles d'une montre.`,
          R`$\|\vec F\|=\sqrt{${F[0] ** 2}+${F[1] ** 2}}\approx${N(nF)}$ N. Comme $\|\vec{\mathcal M}_O\|=F\,d$, le bras de levier vaut $d=\dfrac{|\mathcal M_z|}{F}=\dfrac{${Math.abs(M)}}{${N(nF)}}\approx${N(d)}$ m : c'est la longueur $OH$ de la figure de la correction.`],
        figureCor: { svg: cor.svg("Bras de levier"), legende: R`Figure — Droite d'action de $\vec F$ (pointillés) et bras de levier $d=OH$, perpendiculaire à cette droite.` } };
    }
  );

  /* ============================================ MÉCANIQUE 2 : CINÉMATIQUE */
  add(EX.meca2, 
    function () {
      const v0 = rnd(8, 20), al = pick([45, 50, 55, 60, 65, 70]), a = rad(al);
      const tS = v0 * Math.sin(a) / g, h = (v0 * Math.sin(a)) ** 2 / (2 * g), P = v0 * v0 * Math.sin(2 * a) / g;
      const st = niceStep(P, 6), xmax = Math.ceil(P * 1.08 / st) * st, ymax = Math.ceil(h * 1.35 / st) * st;
      const fig = Fig({ xmin: 0, xmax, ymin: 0, ymax, W: 460, pad: 34 }).grid(st).axes("x (m)", "y (m)", { ticks: st });
      const pts = []; for (let i = 0; i <= 60; i++) { const x = P * i / 60; pts.push([x, x * Math.tan(a) - g * x * x / (2 * v0 * v0 * Math.cos(a) ** 2)]); }
      const Lv = Math.min(P * 0.22, ymax * 0.55);
      fig.poly(pts, "c1", 2.2).line(P / 2, 0, P / 2, h, "m", 1.2, true).point(P / 2, h, "S", { dy: -12, dx: 0 }).point(P, 0, "P", { dy: -12, dx: 4 })
        .vec(0, 0, Lv * Math.cos(a), Lv * Math.sin(a), "c2", "v_0", { side: 1 }).arc(0, 0, 30, 0, al, "c2", "α", { d: 10 })
        .textPx(fig.X(P / 2) + 12, fig.Y(h / 2), "h", { c: "m", size: 15 });
      return { titre: "Tir d'un projectile dans un repère orthonormé",
        enonce: R`Un projectile est lancé de l'origine $O$ du repère orthonormé $(O,\vec i,\vec j)$ ($Ox$ horizontal, $Oy$ vertical ascendant) avec une vitesse $v_0=${v0}$ m/s faisant l'angle $\alpha=${al}^\circ$ avec l'horizontale. On néglige la résistance de l'air ($g=9{,}8$ m/s²). Calculer la durée $t_S$ pour atteindre le sommet $S$, la flèche $h$ et la portée $OP$.`,
        figure: { svg: fig.svg("Trajectoire parabolique"), legende: R`Figure — Trajectoire parabolique du projectile (échelle identique sur les deux axes) : sommet $S$ à la hauteur $h$, point de chute $P$ sur l'axe $Ox$.` },
        reponses: [{ nom: "t_S", unite: "s", val: tS }, { nom: "h", unite: "m", val: h }, { nom: "OP", unite: "m", val: P }],
        correction: [
          R`PFD : $\vec a=\vec g$, donc $a_x=0$ et $a_y=-g$. Avec $\vec v(0)=(v_0\cos\alpha\,;\,v_0\sin\alpha)$ : $v_x=v_0\cos\alpha$ et $v_y=-gt+v_0\sin\alpha$.`,
          R`Équations horaires : $x(t)=v_0\cos\alpha\;t$ et $y(t)=-\tfrac12gt^2+v_0\sin\alpha\;t$.`,
          R`Au sommet, $v_y=0$ : $t_S=\dfrac{v_0\sin\alpha}{g}=\dfrac{${v0}\times\sin${al}^\circ}{9{,}8}\approx${N(tS)}$ s.`,
          R`Flèche : $h=y(t_S)=\dfrac{v_0^2\sin^2\alpha}{2g}\approx${N(h)}$ m.`,
          R`Portée : $y=0$ pour $t=2t_S$, d'où $OP=\dfrac{v_0^2\sin 2\alpha}{g}=\dfrac{${v0}^2\times\sin${2 * al}^\circ}{9{,}8}\approx${N(P)}$ m.`] };
    },
    function () {
      const Rr = rnd(2, 4), w = pick([0.5, 1, 1.5, 2]), t = rnd(1, 6, 0.5);
      const th = w * t, thd = ((deg(th) % 360) + 360) % 360, x = Rr * Math.cos(th), y = Rr * Math.sin(th), v = Rr * w, aN = Rr * w * w;
      const m = Rr + 1.6, fig = Fig({ xmin: -m, xmax: m, ymin: -m, ymax: m, W: 400 }).grid(1).axes("x", "y").circle(0, 0, Rr, "m");
      const er = [Math.cos(th), Math.sin(th)], et = [-Math.sin(th), Math.cos(th)];
      fig.line(0, 0, x, y, "m", 1.2, true).arc(0, 0, 24, 0, thd, "c2", "θ", { d: 10 })
        .vec(x, y, x + 1.1 * er[0], y + 1.1 * er[1], "c1", "e_ρ", { side: -1, size: 14 })
        .vec(x, y, x + 1.1 * et[0], y + 1.1 * et[1], "c1", "e_θ", { side: 1, size: 14 })
        .point(x, y, "M", { dx: -16 * er[0] - 14 * et[0], dy: 16 * er[1] + 14 * et[1] });
      return { titre: "Mouvement circulaire uniforme en coordonnées polaires",
        enonce: R`Un point $M$ décrit un cercle de centre $O$ et de rayon $R=${Rr}$ m dans le repère orthonormé $(O,\vec i,\vec j)$, d'un mouvement uniforme de vitesse angulaire $\omega=${N(w)}$ rad/s. À $t=0$, $M$ est sur l'axe $Ox$ ($\theta=0$). À l'instant $t=${N(t)}$ s, calculer les coordonnées $x$ et $y$ de $M$, la norme de sa vitesse et celle de son accélération.`,
        figure: { svg: fig.svg("Point M sur le cercle"), legende: R`Figure — Position de $M$ à l'instant $t$ (un carreau = 1 m) et base polaire $(\vec e_\rho,\vec e_\theta)$ attachée au point $M$.` },
        reponses: [{ nom: "x", unite: "m", val: x, abs: 0.03 }, { nom: "y", unite: "m", val: y, abs: 0.03 }, { nom: "v", unite: "m/s", val: v }, { nom: "a", unite: "m/s²", val: aN }],
        correction: [
          R`Angle parcouru : $\theta=\omega t=${N(w)}\times${N(t)}=${N(th)}$ rad, soit $${N(deg(th))}^\circ${deg(th) >= 360 ? R`\equiv${N(thd)}^\circ` : ""}$.`,
          R`Coordonnées : $x=R\cos\theta=${Rr}\times\cos(${N(th)})\approx${N(x)}$ m et $y=R\sin\theta\approx${N(y)}$ m (calculatrice en radians).`,
          R`En polaires, $\overrightarrow{OM}=R\,\vec e_\rho$ avec $R$ constant : $\vec v=R\dot\theta\,\vec e_\theta$, donc $v=R\omega=${Rr}\times${N(w)}=${N(v)}$ m/s, portée par $\vec e_\theta$ (tangente au cercle).`,
          R`$\vec a=-R\dot\theta^2\,\vec e_\rho+R\ddot\theta\,\vec e_\theta$ avec $\ddot\theta=0$ : l'accélération est centripète, $a=R\omega^2=${Rr}\times${N(w)}^2=${N(aN)}$ m/s².`] };
    }
  );

  /* ============================================ MÉCANIQUE 3 : DYNAMIQUE */
  add(EX.meca3, 
    function () {
      const m = rnd(1, 10), al = pick([20, 25, 30, 35, 40]), a = rad(al), P = m * g;
      const Px = P * Math.sin(a), Py = -P * Math.cos(a), Nn = P * Math.cos(a), Tt = P * Math.sin(a);
      // schéma : plan incliné montant vers la droite ; repère (G, x, y) lié au plan, x vers le bas de la pente
      const Lp = 8, fig = Fig({ xmin: -0.6, xmax: Lp + 0.6, ymin: -0.8, ymax: Lp * Math.tan(rad(40)) * 0.62 + 1.6, W: 460, pad: 18 });
      const top = [Lp, Lp * Math.tan(a)], u = [Math.cos(a), Math.sin(a)], n = [-Math.sin(a), Math.cos(a)];
      fig.poly([[0, 0], [Lp, 0], top, [0, 0]], "ax", 1.6, false, "var(--tint)").arc(0, 0, 44, 0, al, "c2", "α", { d: 10 });
      const c = [0.62 * Lp * u[0], 0.62 * Lp * u[1]], hw = 0.55, hh = 0.75;
      const corner = (s1, s2) => [c[0] + s1 * hw * u[0] + s2 * hh * n[0], c[1] + s1 * hw * u[1] + s2 * hh * n[1]];
      fig.poly([corner(-1, 0), corner(1, 0), corner(1, 2), corner(-1, 2), corner(-1, 0)], "ax", 1.4, false, "var(--tint2)");
      const G = [c[0] + hh * n[0], c[1] + hh * n[1]];
      // repère lié au plan
      fig.vec(G[0], G[1], G[0] - 2.4 * u[0], G[1] - 2.4 * u[1], "m", "x", { vec: false, w: 1.3, side: 1, t: 1.05, d: 10 })
        .vec(G[0], G[1], G[0] + 2.6 * n[0], G[1] + 2.6 * n[1], "m", "y", { vec: false, w: 1.3, side: -1, t: 1.02, d: 10 });
      fig.vec(G[0], G[1], G[0], G[1] - 2.2, "c3", "P", { side: -1, t: 0.85 })
        .vec(G[0] - 0.5 * u[0] + hh * -n[0] * 0, G[1] - 0.5 * u[1], G[0] - 0.5 * u[0] + 1.9 * n[0], G[1] - 0.5 * u[1] + 1.9 * n[1], "c4", "R", { side: 1, t: 0.9 })
        .vec(c[0] + hw * u[0] + 0.6 * n[0], c[1] + hw * u[1] + 0.6 * n[1], c[0] + (hw + 1.8) * u[0] + 0.6 * n[0], c[1] + (hw + 1.8) * u[1] + 0.6 * n[1], "c1", "T", { side: 1 })
        .point(G[0], G[1], "G", { dx: -12, dy: -2, r: 3 });
      return { titre: "Équilibre sur un plan incliné : projection dans le repère du plan",
        enonce: R`Un bloc de masse $m=${m}$ kg est maintenu immobile sur un plan incliné d'angle $\alpha=${al}^\circ$, sans frottement, par un fil parallèle à la ligne de plus grande pente. On utilise le repère orthonormé $(G,\vec i,\vec j)$ lié au plan : $Gx$ parallèle au plan, orienté vers le bas de la pente, et $Gy$ perpendiculaire au plan ($g=9{,}8$ m/s²). Calculer les composantes $P_x$ et $P_y$ du poids, la réaction $R$ du plan et la tension $T$ du fil.`,
        figure: { svg: fig.svg("Bloc sur un plan incliné"), legende: R`Figure — Forces appliquées au bloc : poids $\vec P$, réaction normale $\vec R$ du plan et tension $\vec T$ du fil ; les axes $Gx$ et $Gy$ sont liés au plan incliné.` },
        reponses: [{ nom: "P_x", unite: "N", val: Px }, { nom: "P_y", unite: "N", val: Py }, { nom: "R", unite: "N", val: Nn }, { nom: "T", unite: "N", val: Tt }],
        correction: [
          R`Le poids fait l'angle $\alpha$ avec $-\vec j$ (angles à côtés perpendiculaires) : $P_x=mg\sin\alpha=${m}\times9{,}8\times\sin${al}^\circ\approx${N(Px)}$ N et $P_y=-mg\cos\alpha\approx${N(Py)}$ N.`,
          R`Composantes des autres forces : $\vec R=R\,\vec j$ (perpendiculaire au plan, pas de frottement) et $\vec T=-T\,\vec i$ (vers le haut de la pente).`,
          R`Équilibre : $\vec P+\vec R+\vec T=\vec 0$. Projection sur $Gy$ : $P_y+R=0$, d'où $R=mg\cos\alpha\approx${N(Nn)}$ N.`,
          R`Projection sur $Gx$ : $P_x-T=0$, d'où $T=mg\sin\alpha\approx${N(Tt)}$ N.`] };
    },
    function () {
      let F1, F2, F3;
      do { F1 = [nzi(-4, 4), rnd(-4, 4)]; F2 = [rnd(-4, 4), nzi(-4, 4)]; F3 = [-F1[0] - F2[0], -F1[1] - F2[1]]; }
      while (Math.abs(F1[0] * F2[1] - F1[1] * F2[0]) < 0.6 * Math.hypot(...F1) * Math.hypot(...F2) || !F3[0] || !F3[1] || Math.hypot(...F3) < 2 || Math.hypot(...F1) < 2 || Math.hypot(...F2) < 2);
      const n3 = Math.hypot(...F3), phi = angleOx(F3[0], F3[1]);
      const box = cadre([F1, F2, F3]);
      const fig = Fig(box).grid(1).axes("x", "y").vec(0, 0, F1[0], F1[1], "c2", "F_1").vec(0, 0, F2[0], F2[1], "c4", "F_2", { side: -1 }).point(0, 0, "", { r: 4.5 });
      const cor = Fig(box).grid(1).axes("x", "y").vec(0, 0, F1[0], F1[1], "c2", "F_1").vec(0, 0, F2[0], F2[1], "c4", "F_2", { side: -1 })
        .vec(0, 0, F3[0], F3[1], "c3", "F_3", { w: 3 }).arc(0, 0, 26, 0, phi, "c3", "φ", { d: 9 }).point(0, 0, "", { r: 4.5 });
      return { titre: "Équilibre d'un point soumis à trois forces",
        enonce: R`Un anneau $O$, placé à l'origine du repère orthonormé $(O,\vec i,\vec j)$, est soumis aux forces $\vec F_1$ et $\vec F_2$ représentées ci-dessous (un carreau = 1 N) et à une troisième force $\vec F_3$ inconnue. L'anneau est en équilibre. Calculer les composantes de $\vec F_3$, son intensité et l'angle orienté $\varphi=(\vec i,\vec F_3)$, compris entre $-180^\circ$ et $180^\circ$.`,
        figure: { svg: fig.svg("Forces F1 et F2"), legende: R`Figure — Les forces $\vec F_1$ et $\vec F_2$ appliquées à l'anneau $O$.` },
        reponses: [{ nom: "F_{3x}", unite: "N", val: F3[0], abs: 0.01 }, { nom: "F_{3y}", unite: "N", val: F3[1], abs: 0.01 }, { nom: "F_3", unite: "N", val: n3 }, { nom: R`\varphi`, unite: "°", val: phi, abs: 0.6 }],
        correction: [
          R`Lecture : $\vec F_1=(${F1[0]}\,;\,${F1[1]})$ N et $\vec F_2=(${F2[0]}\,;\,${F2[1]})$ N.`,
          R`Équilibre (principe d'inertie) : $\vec F_1+\vec F_2+\vec F_3=\vec 0$, donc $\vec F_3=-(\vec F_1+\vec F_2)$.`,
          R`$F_{3x}=-(${sgn(F1[0])}+${sgn(F2[0])})=${F3[0]}$ N et $F_{3y}=-(${sgn(F1[1])}+${sgn(F2[1])})=${F3[1]}$ N.`,
          R`$F_3=\sqrt{${F3[0] ** 2}+${F3[1] ** 2}}\approx${N(n3)}$ N ; $\cos\varphi=F_{3x}/F_3$ et $\sin\varphi=F_{3y}/F_3$ donnent $\varphi\approx${N(phi)}^\circ$.`],
        figureCor: { svg: cor.svg("Force F3 d'équilibre"), legende: R`Figure — $\vec F_3$ est l'opposée de la résultante $\vec F_1+\vec F_2$ : les trois forces se compensent.` } };
    }
  );

  /* ============================================ MÉCANIQUE 4 : TRAVAIL ET ÉNERGIE */
  add(EX.meca4, 
    function () {
      let A, B, F;
      do { A = [rnd(-4, 0), rnd(-3, 0)]; B = [rnd(1, 5), rnd(1, 4)]; F = [nzi(-3, 3), nzi(-3, 3)]; } while (B[0] - A[0] < 3 || B[1] - A[1] < 2);
      const C = [B[0], A[1]], W1 = F[0] * (C[0] - A[0]), W2 = F[1] * (B[1] - C[1]), W = W1 + W2;
      const box = cadre([A, B, [A[0] + F[0], A[1] + F[1]], [B[0] + 1, B[1] + 1]]);
      const fig = Fig(box).grid(1).axes("x", "y")
        .poly([A, C, B], "c1", 2.2, true).line(A[0], A[1], B[0], B[1], "c4", 1.8)
        .point(A[0], A[1], "A", { dx: -12, dy: 2 }).point(B[0], B[1], "B", { dx: 12, dy: -4 }).point(C[0], C[1], "C", { dx: 12, dy: 10 })
        .vec(-0.2 + box.xmin + 1.2, box.ymax - 1.2 - (F[1] > 0 ? 3 : 0), -0.2 + box.xmin + 1.2 + F[0] * 0.8, box.ymax - 1.2 - (F[1] > 0 ? 3 : 0) + F[1] * 0.8, "c2", "F", { w: 2.8 });
      return { titre: "Travail d'une force constante sur deux chemins",
        enonce: R`Une force constante $\vec F=${sgn(F[0])}\,\vec i${F[1] < 0 ? "" : "+"}${F[1]}\,\vec j$ (N) agit sur un point matériel qui va de $A(${A[0]}\,;\,${A[1]})$ à $B(${B[0]}\,;\,${B[1]})$ (coordonnées en m, repère orthonormé). Calculer le travail de $\vec F$ sur le trajet $A\to C$, puis sur $C\to B$, et enfin directement sur le segment $[AB]$.`,
        figure: { svg: fig.svg("Deux chemins de A à B"), legende: R`Figure — Chemin $A\to C\to B$ en pointillés et chemin direct $[AB]$ en trait plein (un carreau = 1 m). La flèche $\vec F$ indique la direction de la force (même vecteur en tout point).` },
        reponses: [{ nom: R`W_{A\to C}`, unite: "J", val: W1, abs: 0.01 }, { nom: R`W_{C\to B}`, unite: "J", val: W2, abs: 0.01 }, { nom: R`W_{A\to B}`, unite: "J", val: W, abs: 0.01 }],
        correction: [
          R`Pour une force constante, $W=\vec F\cdot\vec{\ell}$ où $\vec\ell$ est le vecteur déplacement : $W=F_x\,\Delta x+F_y\,\Delta y$.`,
          R`$A\to C$ : $\vec{AC}=(${C[0] - A[0]}\,;\,0)$, donc $W_{A\to C}=${sgn(F[0])}\times${C[0] - A[0]}=${W1}$ J (seule $F_x$ travaille).`,
          R`$C\to B$ : $\vec{CB}=(0\,;\,${B[1] - C[1]})$, donc $W_{C\to B}=${sgn(F[1])}\times${B[1] - C[1]}=${W2}$ J (seule $F_y$ travaille).`,
          R`Chemin direct : $\vec{AB}=(${B[0] - A[0]}\,;\,${B[1] - A[1]})$, donc $W_{A\to B}=${sgn(F[0])}\times${B[0] - A[0]}+${sgn(F[1])}\times${B[1] - A[1]}=${W}$ J.`,
          R`On retrouve $W_{A\to C}+W_{C\to B}=W_{A\to B}$ : le travail d'une force constante ne dépend pas du chemin suivi (force conservative).`] };
    }
  );

  /* ============================================ ÉLECTRICITÉ 1 : COULOMB */
  add(EX.elec1, 
    function () {
      let a, b; do { a = nzi(-5, 5); b = nzi(-4, 4); } while (Math.abs(a) < 2 || Math.abs(b) < 2);
      const q0 = nzi(-5, 5), q1 = nzi(-5, 5), q2 = nzi(-5, 5);
      // force exercée sur q0 (en O) par une charge q placée en P : F = K q0 q (O - P)/r^3
      const f = (q, P) => { const r = Math.hypot(...P), k = K * q0 * q * 1e-18 / (r / 100) ** 3; return [-k * P[0] / 100, -k * P[1] / 100]; };
      const A = [a, 0], B = [0, b], F1 = f(q1, A), F2 = f(q2, B), Fx = F1[0] + F2[0], Fy = F1[1] + F2[1], Ft = Math.hypot(Fx, Fy);
      const n1 = Math.hypot(...F1), n2 = Math.hypot(...F2);
      const L1 = Math.min(2, 0.6 * Math.abs(a)), L2 = Math.min(2, 0.6 * Math.abs(b));
      const box = cadre([A, B, [2.4, 2.4], [-2.4, -2.4]]);
      const fig = Fig(box).grid(1).axes("x (cm)", "y (cm)", { O: false })
        .charge(a, 0, q1, "q_1", { dy: -20 }).charge(0, b, q2, "q_2", { dx: 22, dy: 0 })
        .vec(0, 0, Math.sign(F1[0]) * L1, 0, "c2", "F_1", { side: F1[0] > 0 ? -1 : 1, w: 3.2, d: 18 }).vec(0, 0, 0, Math.sign(F2[1]) * L2, "c1", "F_2", { side: F2[1] > 0 ? 1 : -1, w: 3.2, d: 18 })
        .charge(0, 0, q0, "q_0", { dx: Math.sign(-F1[0]) * 20, dy: Math.sign(F2[1]) * 20 });
      return { titre: "Superposition de deux forces de Coulomb dans un repère",
        enonce: R`Dans le repère orthonormé $(O,\vec i,\vec j)$ (un carreau = 1 cm), on place $q_1=${q1}$ nC au point $A(${a}\,;\,0)$, $q_2=${q2}$ nC au point $B(0\,;\,${b})$ et $q_0=${q0}$ nC à l'origine $O$. Calculer les composantes $F_x$ et $F_y$ de la force électrostatique totale exercée sur $q_0$, puis son intensité ($K=9\times10^9$ SI).`,
        figure: { svg: fig.svg("Trois charges dans le repère"), legende: R`Figure — Positions des charges (rouge : positive, bleu : négative) et forces $\vec F_1$, $\vec F_2$ exercées sur $q_0$ par $q_1$ et $q_2$ (directions exactes, longueurs non représentatives des intensités).` },
        reponses: [{ nom: "F_x", unite: "N", val: Fx, abs: 1e-9 }, { nom: "F_y", unite: "N", val: Fy, abs: 1e-9 }, { nom: "F", unite: "N", val: Ft }],
        correction: [
          R`Force exercée par $q_1$ : $F_1=K\dfrac{|q_0q_1|}{OA^2}=\dfrac{9\times10^9\times${Math.abs(q0 * q1)}\times10^{-18}}{(${N(Math.abs(a) / 100)})^2}\approx${N(n1)}$ N. ${q0 * q1 > 0 ? "Les charges sont de même signe : répulsion" : "Les charges sont de signes opposés : attraction"}, la force est portée par l'axe $Ox$ : $F_{1x}\approx${N(F1[0])}$ N.`,
          R`Force exercée par $q_2$ : $F_2=K\dfrac{|q_0q_2|}{OB^2}\approx${N(n2)}$ N. ${q0 * q2 > 0 ? "Répulsion" : "Attraction"}, portée par l'axe $Oy$ : $F_{2y}\approx${N(F2[1])}$ N.`,
          R`Principe de superposition : $\vec F=\vec F_1+\vec F_2$, d'où $F_x=F_{1x}\approx${N(Fx)}$ N et $F_y=F_{2y}\approx${N(Fy)}$ N.`,
          R`Les deux composantes sont perpendiculaires : $F=\sqrt{F_x^2+F_y^2}\approx${N(Ft)}$ N.`] };
    }
  );

  /* ============================================ ÉLECTRICITÉ 2 : CHAMP ET POTENTIEL */
  add(EX.elec2, 
    function () {
      const d = pick([3, 4]), ym = (d === 3 ? 4 : 3) * pick([1, -1]); // AM = BM = 5 cm
      const q1 = nzi(-6, 6), q2 = nzi(-6, 6), A = [-d, 0], B = [d, 0], M = [0, ym];
      const r = Math.hypot(d, ym) / 100;
      const E = (q, P) => { const dx = (M[0] - P[0]) / 100, dy = (M[1] - P[1]) / 100, k = K * q * 1e-9 / r ** 3; return [k * dx, k * dy]; };
      const E1 = E(q1, A), E2 = E(q2, B), Ex = E1[0] + E2[0], Ey = E1[1] + E2[1], V = K * (q1 + q2) * 1e-9 / r;
      const n1 = Math.hypot(...E1), n2 = Math.hypot(...E2), sc = 2.4 / Math.max(n1, n2);
      const box = cadre([A, B, M, [M[0] + 2.6, M[1] + 2.6 * Math.sign(ym)], [M[0] - 2.6, M[1] + 2.6 * Math.sign(ym)]]);
      const fig = Fig(box).grid(1).axes("x (cm)", "y (cm)")
        .line(A[0], A[1], M[0], M[1], "m", 1.1, true).line(B[0], B[1], M[0], M[1], "m", 1.1, true)
        .charge(A[0], 0, q1, "q_1", { dy: 20 * Math.sign(ym) }).charge(B[0], 0, q2, "q_2", { dy: 20 * Math.sign(ym) })
        .point(M[0], M[1], "M", { dx: -14, dy: -12 * Math.sign(ym) })
        .vec(M[0], M[1], M[0] + E1[0] * sc, M[1] + E1[1] * sc, "c2", "E_1").vec(M[0], M[1], M[0] + E2[0] * sc, M[1] + E2[1] * sc, "c1", "E_2", { side: -1 });
      return { titre: "Champ et potentiel de deux charges en un point du plan",
        enonce: R`Dans le repère orthonormé $(O,\vec i,\vec j)$ (un carreau = 1 cm), les charges $q_1=${q1}$ nC et $q_2=${q2}$ nC sont placées en $A(${-d}\,;\,0)$ et $B(${d}\,;\,0)$. Le point $M$ a pour coordonnées $(0\,;\,${N(ym)})$. Calculer les composantes $E_x$ et $E_y$ du champ électrostatique en $M$, puis le potentiel $V(M)$ (nul à l'infini, $K=9\times10^9$ SI).`,
        figure: { svg: fig.svg("Deux charges et le point M"), legende: R`Figure — Champs $\vec E_1$ et $\vec E_2$ créés en $M$ par $q_1$ et $q_2$ (directions exactes, longueurs proportionnelles aux intensités) ; $AM=BM$.` },
        reponses: [{ nom: "E_x", unite: "V/m", val: Ex, abs: 1 }, { nom: "E_y", unite: "V/m", val: Ey, abs: 1 }, { nom: "V(M)", unite: "V", val: V, abs: 0.5 }],
        correction: [
          R`Distances : $AM=BM=\sqrt{${d}^2+${N(Math.abs(ym))}^2}=${N(r * 100)}$ cm $=${N(r)}$ m.`,
          R`Le champ créé par une charge $q$ placée en $P$ vaut $\vec E=K\dfrac{q}{PM^3}\,\vec{PM}$. Ici $\vec{AM}=(${d}\,;\,${N(ym)})$ cm et $\vec{BM}=(${-d}\,;\,${N(ym)})$ cm.`,
          R`$\vec E_1=\dfrac{9\times10^9\times${q1}\times10^{-9}}{${N(r)}^3}\,(${N(d / 100)}\,;\,${N(ym / 100)})\approx(${N(E1[0])}\,;\,${N(E1[1])})$ V/m.`,
          R`$\vec E_2=\dfrac{9\times10^9\times${q2}\times10^{-9}}{${N(r)}^3}\,(${N(-d / 100)}\,;\,${N(ym / 100)})\approx(${N(E2[0])}\,;\,${N(E2[1])})$ V/m.`,
          R`Superposition : $E_x\approx${N(Ex)}$ V/m et $E_y\approx${N(Ey)}$ V/m.`,
          R`Le potentiel est une grandeur scalaire : $V(M)=K\dfrac{q_1+q_2}{AM}=\dfrac{9\times10^9\times(${q1}${q2 < 0 ? "" : "+"}${q2})\times10^{-9}}{${N(r)}}\approx${N(V)}$ V.`] };
    }
  );

  /* ============================================ ÉLECTRICITÉ 3 : DIPÔLE */
  add(EX.elec3, 
    function () {
      const [x, y] = pick([[3, 4], [4, 3], [-3, 4], [-4, 3], [6, 8], [8, 6], [-6, 8], [3, -4], [-4, -3]]);
      const q = rnd(1, 10), a = rnd(1, 5), p = q * 1e-9 * a / 1000;
      const rho = Math.hypot(x, y), th = angleOx(x, y), t = rad(th), rm = rho / 100;
      const Er = 2 * K * p * Math.cos(t) / rm ** 3, Et = K * p * Math.sin(t) / rm ** 3, E = Math.hypot(Er, Et);
      const m = Math.max(Math.abs(x), Math.abs(y)) + 2;
      const fig = Fig({ xmin: Math.min(-2, x - 2), xmax: Math.max(2, x + 2), ymin: Math.min(-1.5, y - 2), ymax: Math.max(1.5, y + 2), W: 420 })
        .grid(1).axes("x (cm)", "y (cm)", { O: false });
      const er = [x / rho, y / rho], et = [-y / rho, x / rho];
      fig.line(0, 0, x, y, "m", 1.2, true).arc(0, 0, 30, 0, th, "c2", "θ", { d: 10 })
        .charge(-0.45, 0, -1, "", { r: 8 }).charge(0.45, 0, 1, "", { r: 8 })
        .vec(-0.5, -0.85, 0.7, -0.85, "c3", "p", { side: -1, size: 15, d: 13 })
        .vec(x, y, x + 1.3 * er[0], y + 1.3 * er[1], "c1", "e_ρ", { side: -1, size: 14 })
        .vec(x, y, x + 1.3 * et[0], y + 1.3 * et[1], "c1", "e_θ", { side: 1, size: 14 })
        .point(x, y, "M", { dx: -16 * er[0] - 14 * et[0], dy: 16 * er[1] + 14 * et[1] });
      void m;
      return { titre: "Champ d'un dipôle en un point repéré par ses coordonnées",
        enonce: R`Un dipôle de centre $O$ ($q=${q}$ nC, $a=${a}$ mm) a son moment dipolaire $\vec p$ dirigé selon $\vec i$. Dans le repère orthonormé $(O,\vec i,\vec j)$ (un carreau = 1 cm), le point $M$ a pour coordonnées $(${x}\,;\,${y})$ cm. Calculer ses coordonnées polaires $\rho$ et $\theta$ (avec $-180^\circ<\theta\le180^\circ$), puis les composantes $E_\rho$ et $E_\theta$ du champ en $M$ et son intensité $E$ ($\rho\gg a$).`,
        figure: { svg: fig.svg("Dipôle et point M"), legende: R`Figure — Dipôle placé en $O$ (dessiné agrandi), point $M$ et base polaire $(\vec e_\rho,\vec e_\theta)$ ; $\theta$ est l'angle orienté $(\vec i,\overrightarrow{OM})$.` },
        reponses: [{ nom: R`\rho`, unite: "cm", val: rho }, { nom: R`\theta`, unite: "°", val: th, abs: 0.6 }, { nom: R`E_\rho`, unite: "V/m", val: Er, abs: 0.05 }, { nom: R`E_\theta`, unite: "V/m", val: Et, abs: 0.05 }, { nom: "E", unite: "V/m", val: E }],
        correction: [
          R`Coordonnées polaires : $\rho=\sqrt{x^2+y^2}=\sqrt{${x * x}+${y * y}}=${N(rho)}$ cm ; $\cos\theta=\dfrac{x}{\rho}=${N(x / rho)}$ et $\sin\theta=\dfrac{y}{\rho}=${N(y / rho)}$, d'où $\theta\approx${N(th)}^\circ$.`,
          R`Moment dipolaire : $p=q\,a=${q}\times10^{-9}\times${N(a / 1000)}=${N(p)}$ C$\cdot$m.`,
          R`$E_\rho=K\dfrac{2p\cos\theta}{\rho^3}=\dfrac{9\times10^9\times2\times${N(p)}\times${N(x / rho)}}{${N(rm)}^3}\approx${N(Er)}$ V/m.`,
          R`$E_\theta=K\dfrac{p\sin\theta}{\rho^3}=\dfrac{9\times10^9\times${N(p)}\times${N(y / rho)}}{${N(rm)}^3}\approx${N(Et)}$ V/m.`,
          R`$E=\sqrt{E_\rho^2+E_\theta^2}\approx${N(E)}$ V/m ; on vérifie $E=K\dfrac{p\sqrt{1+3\cos^2\theta}}{\rho^3}$.`] };
    }
  );
})();
