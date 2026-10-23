/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* Petits schémas d'optique géométrique en SVG (couleurs liées au thème clair/sombre).
   Utilisé par le quiz et par les exercices d'entraînement d'optique. */
(function () {
  let uid = 0;
  const COL = { fg: "var(--fg)", mu: "var(--muted)", ac: "var(--accent)", r: "var(--rouge)", o: "var(--saff)", g: "var(--ok)", b: "var(--bleu)", gr: "var(--grid)" };
  const C = k => COL[k] || k;
  const F = v => (+v).toFixed(1);
  const rad = d => d * Math.PI / 180;

  /* Scène : repère « physique » (x vers la droite, y vers le haut) projeté sur W×H pixels.
     eq:true => même échelle sur les deux axes (angles exacts). */
  function Scene(o) {
    const W = o.W || 460, H = o.H || 260, pad = o.pad == null ? 16 : o.pad;
    let sx = (W - 2 * pad) / (o.x1 - o.x0), sy = (H - 2 * pad) / (o.y1 - o.y0);
    if (o.eq) sx = sy = Math.min(sx, sy);
    const cx = W / 2 - (o.x0 + o.x1) / 2 * sx, cy = H / 2 + (o.y0 + o.y1) / 2 * sy;
    const X = x => cx + x * sx, Y = y => cy - y * sy;
    let out = "";
    const st = (col, w, dash) => `stroke:${C(col)};stroke-width:${w}${dash ? ";stroke-dasharray:" + (dash === true ? "5 4" : dash) : ""};fill:none`;
    const S = {
      X, Y, sx, sy, W, H,
      raw(s) { out += s; return S; },
      line(x1, y1, x2, y2, col = "fg", w = 1.6, dash) { out += `<line x1="${F(X(x1))}" y1="${F(Y(y1))}" x2="${F(X(x2))}" y2="${F(Y(y2))}" style="${st(col, w, dash)}"/>`; return S; },
      /* pointe de flèche (triangle) au point (x,y) dans la direction (dx,dy) physique */
      tip(x, y, dx, dy, col = "o", size = 7) {
        const a = Math.atan2(-dy * sy, dx * sx), px = X(x), py = Y(y), c = Math.cos(a), s = Math.sin(a);
        const p = [[size, 0], [-size * 0.6, size * 0.55], [-size * 0.6, -size * 0.55]].map(([u, v]) => F(px + u * c - v * s) + "," + F(py + u * s + v * c)).join(" ");
        out += `<polygon points="${p}" style="fill:${C(col)}"/>`; return S;
      },
      /* rayon lumineux : ligne brisée avec une flèche au milieu de chaque segment */
      ray(pts, col = "o", opt = {}) {
        const w = opt.w || 2, dash = opt.dash, arrows = opt.arrows !== false;
        for (let i = 0; i + 1 < pts.length; i++) {
          const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
          S.line(x1, y1, x2, y2, col, w, dash);
          if (arrows && !(opt.noArrow || []).includes(i)) S.tip((x1 + x2) / 2, (y1 + y2) / 2, x2 - x1, y2 - y1, col);
        }
        return S;
      },
      text(x, y, t, col = "fg", o2 = {}) {
        out += `<text x="${F(X(x) + (o2.dx || 0))}" y="${F(Y(y) + (o2.dy || 0))}" text-anchor="${o2.a || "middle"}" style="fill:${C(col)};font:${o2.b ? "600 " : ""}${o2.it ? "italic " : ""}${o2.s || 12.5}px 'Fira Sans',Arial,sans-serif">${t}</text>`; return S;
      },
      pt(x, y, lab, col = "fg", dy = 16, dx = 0) { out += `<circle cx="${F(X(x))}" cy="${F(Y(y))}" r="2.8" style="fill:${C(col)}"/>`; if (lab) S.text(x, y, lab, col, { dy, dx }); return S; },
      /* objet ou image : flèche verticale (ou quelconque) avec pointe */
      vec(x1, y1, x2, y2, col = "ac", lab, dash, ldx = 6, ldy) {
        S.line(x1, y1, x2, y2, col, 2.8, dash); S.tip(x2, y2, x2 - x1, y2 - y1, col, 8);
        if (lab) S.text(x2, y2, lab, col, { a: "start", dx: ldx, dy: ldy == null ? (y2 >= y1 ? 2 : 12) : ldy, b: true });
        return S;
      },
      /* arc d'angle centré en (x,y), de l'angle a1 à a2 (degrés, sens trigonométrique), rayon r en pixels */
      arc(x, y, a1, a2, r, lab, col = "fg", lr) {
        if (a2 < a1) [a1, a2] = [a2, a1];
        if (a2 - a1 > 180) [a1, a2] = [a2, a1 + 360];
        const px = X(x), py = Y(y), p = a => [px + r * Math.cos(rad(a)), py - r * Math.sin(rad(a))];
        const [x1, y1] = p(a1), [x2, y2] = p(a2), big = a2 - a1 > 180 ? 1 : 0;
        out += `<path d="M${F(x1)},${F(y1)} A${r},${r} 0 ${big} 0 ${F(x2)},${F(y2)}" style="${st(col, 1.3)}"/>`;
        if (lab) { const am = rad((a1 + a2) / 2), R2 = lr || r + 13; out += `<text x="${F(px + R2 * Math.cos(am))}" y="${F(py - R2 * Math.sin(am) + 4)}" text-anchor="middle" style="fill:${C(col)};font:italic 12.5px 'Fira Sans',Arial,sans-serif">${lab}</text>`; }
        return S;
      },
      poly(pts, fill, stroke = "fg", w = 1.4, op = 1) {
        out += `<polygon points="${pts.map(([x, y]) => F(X(x)) + "," + F(Y(y))).join(" ")}" style="fill:${fill ? C(fill) : "none"};fill-opacity:${op};stroke:${C(stroke)};stroke-width:${w}"/>`; return S;
      },
      rect(x0, y0, x1, y1, fill, op = 0.18) { return S.poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], fill, fill, 0, op); },
      /* hachures du côté non réfléchissant d'un miroir plan (segment), côté (nx,ny) */
      hatch(x1, y1, x2, y2, nx, ny, col = "fg", n = 12) {
        const L = 7 / Math.max(sx, sy);
        for (let k = 0; k <= n; k++) { const t = k / n, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t; S.line(x, y, x + (nx + (x2 - x1) / Math.hypot(x2 - x1, y2 - y1) * 0.7) * L, y + (ny + (y2 - y1) / Math.hypot(x2 - x1, y2 - y1) * 0.7) * L, col, 1); }
        return S;
      },
      mirror(x1, y1, x2, y2, nx, ny) { S.line(x1, y1, x2, y2, "fg", 2.6); return S.hatch(x1, y1, x2, y2, nx, ny); },
      /* lentille mince symbolique (verticale) en x, demi-hauteur h (physique) */
      lens(x, h, conv, lab) {
        S.line(x, -h, x, h, "fg", 2.4);
        const d = 7, px = X(x), t = Y(h), b = Y(-h);
        if (conv) out += `<path d="M${F(px - d)},${F(t + d)}L${F(px)},${F(t)}L${F(px + d)},${F(t + d)}M${F(px - d)},${F(b - d)}L${F(px)},${F(b)}L${F(px + d)},${F(b - d)}" style="${st("fg", 2)}"/>`;
        else out += `<path d="M${F(px - d)},${F(t - d)}L${F(px)},${F(t)}L${F(px + d)},${F(t - d)}M${F(px - d)},${F(b + d)}L${F(px)},${F(b)}L${F(px + d)},${F(b + d)}" style="${st("fg", 2)}"/>`;
        if (lab) S.text(x, h, lab, "fg", { a: "start", dx: 9, dy: 4 });
        return S;
      },
      /* miroir sphérique symbolique de sommet x, demi-hauteur h ; concave = bords tournés vers la gauche (lumière venant de la gauche) */
      smirror(x, h, concave, lab) {
        S.line(x, -h, x, h, "fg", 2.6);
        const d = 8, px = X(x), t = Y(h), b = Y(-h), s = concave ? -1 : 1;
        out += `<path d="M${F(px + s * d)},${F(t - d)}L${F(px)},${F(t)}M${F(px + s * d)},${F(b + d)}L${F(px)},${F(b)}" style="${st("fg", 2)}"/>`;
        for (let k = 1; k < 9; k++) { const yy = t + (b - t) * k / 9; out += `<line x1="${F(px)}" y1="${F(yy)}" x2="${F(px + 6)}" y2="${F(yy + 5)}" style="${st("fg", 1)}"/>`; }
        if (lab) S.text(x, h, lab, "fg", { a: "start", dx: 9, dy: 4 });
        return S;
      },
      /* quadrillage de pas p (unités physiques) */
      grid(x0, x1, y0, y1, p = 1) {
        for (let x = Math.ceil(x0 / p) * p; x <= x1 + 1e-9; x += p) S.line(x, y0, x, y1, "gr", 1);
        for (let y = Math.ceil(y0 / p) * p; y <= y1 + 1e-9; y += p) S.line(x0, y, x1, y, "gr", 1);
        return S;
      },
      axis(x0, x1, lab) { S.line(x0, 0, x1, 0, "mu", 1.1, "6 4"); if (lab) S.text(x1, 0, lab, "mu", { a: "end", dy: -6 }); return S; },
      svg(label) {
        return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label || "Schéma d'optique"}" style="width:100%;max-width:${W}px;height:auto">${out}</svg>`;
      }
    };
    return S;
  }

  /* Outils géométriques */
  const G = {
    rad, deg: r => r * 180 / Math.PI,
    dir: a => [Math.cos(rad(a)), Math.sin(rad(a))],           // vecteur unitaire d'angle a (degrés)
    refl(d, n) { const k = 2 * (d[0] * n[0] + d[1] * n[1]); return [d[0] - k * n[0], d[1] - k * n[1]]; },
    /* intersection de la demi-droite P + t d avec la droite Q + s e */
    inter(P, d, Q, e) { const den = d[0] * e[1] - d[1] * e[0]; const t = ((Q[0] - P[0]) * e[1] - (Q[1] - P[1]) * e[0]) / den; return [P[0] + t * d[0], P[1] + t * d[1]]; },
    /* réfraction vectorielle : d incident unitaire, n normale unitaire orientée vers le milieu d'incidence, n1 -> n2 ; null si réflexion totale */
    refr(d, n, n1, n2) {
      const c = -(d[0] * n[0] + d[1] * n[1]), r = n1 / n2, k = 1 - r * r * (1 - c * c);
      if (k < 0) return null;
      const f = r * c - Math.sqrt(k); return [r * d[0] + f * n[0], r * d[1] + f * n[1]];
    }
  };

  /* cadre : avec quadrillage, carreaux carrés (même échelle sur les deux axes) */
  function frame(o, xmin, xmax, ym) {
    const W = o.W || 470;
    if (!o.grid) return { W, H: o.H || 250, x0: xmin, x1: xmax, y0: -ym, y1: ym };
    const k = (W - 32) / (xmax - xmin), H = Math.max(170, Math.min(420, Math.round(2 * ym * k + 32)));
    return { W, H, x0: xmin, x1: xmax, y0: -ym, y1: ym, eq: true };
  }

  /* Construction d'image par une lentille mince (axe horizontal, lentille en x=0), échelle verticale indépendante.
     o = {fp, OA, AB, OAp, ApBp, grid:p, rays:true|false, lab:{A,B}} */
  function lentille(o) {
    const { fp, OA, AB } = o, conv = fp > 0, OAp = o.OAp, ApBp = o.ApBp, rays = o.rays !== false;
    const xs = [OA, -Math.abs(fp) * 1.2, Math.abs(fp) * 1.2, 0].concat(isFinite(OAp) ? [OAp] : []);
    const xmin = Math.min(...xs) - 0.12 * (Math.max(...xs) - Math.min(...xs)) - 1, xmax = Math.max(...xs) + 0.12 * (Math.max(...xs) - Math.min(...xs)) + 1;
    let ym = Math.max(Math.abs(AB), isFinite(ApBp) ? Math.abs(ApBp) : 0) * 1.3 + 0.6;
    if (o.grid) ym = Math.ceil(ym / o.grid) * o.grid + 0.4 * o.grid;
    const S = Scene(frame(o, xmin, xmax, ym));
    if (o.grid) S.grid(Math.ceil(xmin / o.grid) * o.grid, Math.floor(xmax / o.grid) * o.grid, -Math.floor(ym / o.grid) * o.grid, Math.floor(ym / o.grid) * o.grid, o.grid);
    S.axis(xmin, xmax, "");
    S.lens(0, ym * 0.9, conv, conv ? "L" : "L");
    if (rays && isFinite(OAp)) {
      const xe = xmax, k1 = -AB / fp, k2 = AB / OA;
      S.ray([[OA, AB], [0, AB], [xe, AB + k1 * xe]], "o");
      if (OAp < 0 || !conv) { const xb = Math.max(xmin, Math.min(OAp, -Math.abs(fp)) - 0.5); S.line(0, AB, xb, AB + k1 * xb, "o", 1.2, true); }
      S.ray([[OA, AB], [0, 0], [xe, k2 * xe]], "g");
      if (OAp < 0) { const xb = Math.max(xmin, OAp - 0.5); S.line(0, 0, xb, k2 * xb, "g", 1.2, true); }
      // troisième rayon : passant par F (ou dirigé vers F) puis parallèle à l'axe
      if (Math.abs(OA + fp) > 1e-6) { const yI = AB * fp / (fp + OA); if (Math.abs(yI) < ym * 0.88) { S.ray([[OA, AB], [0, yI], [xe, yI]], "b", { w: 1.6 }); if (OAp < 0) S.line(0, yI, Math.max(xmin, OAp - 0.5), yI, "b", 1.1, true); } }
    }
    S.pt(0, 0, "O", "fg", 16, -8).pt(fp, 0, "F′").pt(-fp, 0, "F");
    S.vec(OA, 0, OA, AB, "ac", (o.lab && o.lab.B) || "B"); S.text(OA, 0, (o.lab && o.lab.A) || "A", "ac", { dy: AB > 0 ? 15 : -6, dx: -8, b: true });
    if (rays && !o.noImage && isFinite(OAp)) { S.vec(OAp, 0, OAp, ApBp, "r", "B′", OAp < 0); S.text(OAp, 0, "A′", "r", { dy: ApBp > 0 ? 15 : -6, dx: -8, b: true }); }
    return S.svg("Construction de l'image par une lentille mince");
  }

  /* Construction d'image par un miroir sphérique (sommet S en x=0, lumière venant de la gauche).
     SC < 0 : concave ; SC > 0 : convexe. */
  function miroirSph(o) {
    const { SC, SA, AB } = o, SF = SC / 2, conc = SC < 0, SAp = o.SAp, ApBp = o.ApBp, rays = o.rays !== false;
    const xs = [SA, SC, SF, 0, 1].concat(isFinite(SAp) ? [SAp] : []);
    const span = Math.max(...xs) - Math.min(...xs), xmin = Math.min(...xs) - 0.1 * span - 1, xmax = Math.max(...xs) + 0.1 * span + 1;
    let ym = Math.max(Math.abs(AB), isFinite(ApBp) ? Math.abs(ApBp) : 0) * 1.3 + 0.6;
    if (o.grid) ym = Math.ceil(ym / o.grid) * o.grid + 0.4 * o.grid;
    const S = Scene(frame(o, xmin, xmax, ym));
    if (o.grid) S.grid(Math.ceil(xmin / o.grid) * o.grid, Math.floor(xmax / o.grid) * o.grid, -Math.floor(ym / o.grid) * o.grid, Math.floor(ym / o.grid) * o.grid, o.grid);
    S.axis(xmin, xmax, "");
    S.smirror(0, ym * 0.9, conc, conc ? "M (concave)" : "M (convexe)");
    if (rays && isFinite(SAp)) {
      // rayon parallèle à l'axe -> passe par F (ou semble en venir) ; rayon passant par S -> symétrique par rapport à l'axe
      const xl = xmin;
      S.ray([[SA, AB], [0, AB], [xl, AB - AB / SF * xl]], "o");
      if (!conc || SAp > 0) S.line(0, AB, Math.min(xmax, Math.max(SF, SAp) + 0.5), AB - AB / SF * Math.min(xmax, Math.max(SF, SAp) + 0.5), "o", 1.2, true);
      const k2 = AB / SA;            // incident vers S : pente AB/SA ; réfléchi : pente -AB/SA
      S.ray([[SA, AB], [0, 0], [xl, -k2 * xl]], "g");
      if (SAp > 0) S.line(0, 0, Math.min(xmax, SAp + 0.5), -k2 * Math.min(xmax, SAp + 0.5), "g", 1.2, true);
    }
    S.pt(0, 0, "S", "fg", 16, 8).pt(SF, 0, "F").pt(SC, 0, "C");
    S.vec(SA, 0, SA, AB, "ac", "B"); S.text(SA, 0, "A", "ac", { dy: AB > 0 ? 15 : -6, dx: -8, b: true });
    if (rays && !o.noImage && isFinite(SAp)) { S.vec(SAp, 0, SAp, ApBp, "r", "B′", SAp > 0); S.text(SAp, 0, "A′", "r", { dy: ApBp > 0 ? 15 : -6, dx: -8, b: true }); }
    return S.svg("Construction de l'image par un miroir sphérique");
  }

  /* Marche d'un rayon dans un prisme d'angle A (sommet en haut), indice n, incidence i (degrés).
     Retourne {svg, r, rp, ip, D, tot} ; full=false : seul le rayon incident est tracé.
     ns = [{n, col, lab}] : plusieurs indices (dispersion) ; hook(S, geo) : tracés supplémentaires. */
  function prisme(o) {
    const A = o.A, i = o.i, full = o.full !== false, h = 1, ns = o.ns || [{ n: o.n, col: "o" }];
    const half = rad(A / 2), base = 2 * h * Math.tan(half);
    const P = [0, h], L = [-base / 2, 0], Rr = [base / 2, 0];
    const S = Scene({ W: o.W || 460, H: o.H || 270, x0: o.x0 || -1.55, x1: o.x1 || 1.55, y0: -0.25, y1: 1.2, eq: true });
    S.poly([P, L, Rr], "ac", "fg", 1.6, 0.12);
    S.arc(0, h, 270 - A / 2, 270 + A / 2, 26, "A");
    const e1 = [P[0] - L[0], P[1] - L[1]], l1 = Math.hypot(...e1), u1 = [e1[0] / l1, e1[1] / l1], n1 = [-u1[1], u1[0]];
    const e2 = [Rr[0] - P[0], Rr[1] - P[1]], l2 = Math.hypot(...e2), u2 = [e2[0] / l2, e2[1] / l2], n2 = [-u2[1], u2[0]];
    const I = [L[0] + u1[0] * l1 * (o.at || 0.5), L[1] + u1[1] * l1 * (o.at || 0.5)];
    const aN = Math.atan2(-n1[1], -n1[0]), ai = aN + rad(i), d0 = [Math.cos(ai), Math.sin(ai)];
    const S0 = [I[0] - d0[0] * 1.0, I[1] - d0[1] * 1.0];
    S.line(I[0] + n1[0] * 0.38, I[1] + n1[1] * 0.38, I[0] - n1[0] * 0.3, I[1] - n1[1] * 0.3, "mu", 1, "4 3");
    S.ray([S0, I], ns.length > 1 ? "fg" : ns[0].col);
    const aIn = G.deg(Math.atan2(-d0[1], -d0[0])), aNo = G.deg(Math.atan2(n1[1], n1[0]));
    if (o.arcs !== false) S.arc(I[0], I[1], aIn, aNo, 30, "i");
    const res = { tot: false, I, d0, n1, n2 };
    ns.forEach((m, k) => {
      const n = m.n, d1 = G.refr(d0, n1, 1, n);
      if (k === 0) { res.r = G.deg(Math.asin(Math.sin(rad(i)) / n)); res.rp = A - res.r; }
      if (!full || !d1) return;
      const J = G.inter(I, d1, P, u2);
      S.ray([I, J], m.col, { arrows: ns.length === 1 });
      if (k === 0) S.line(J[0] + n2[0] * 0.38, J[1] + n2[1] * 0.38, J[0] - n2[0] * 0.3, J[1] - n2[1] * 0.3, "mu", 1, "4 3");
      const d2 = G.refr(d1, [-n2[0], -n2[1]], n, 1);
      if (d2) {
        const K = [J[0] + d2[0] * (o.out || 1.0), J[1] + d2[1] * (o.out || 1.0)];
        S.ray([J, K], m.col);
        if (m.lab) S.text(K[0], K[1], m.lab, m.col, { a: "start", dx: 6, dy: 4, b: true });
        if (k === 0) {
          Object.assign(res, { J, K, d2 });
          res.ip = G.deg(Math.asin(n * Math.sin(rad(res.rp)))); res.D = i + res.ip - A;
          const aOut = G.deg(Math.atan2(d2[1], d2[0])), aN2 = G.deg(Math.atan2(n2[1], n2[0]));
          if (o.arcs !== false) S.arc(J[0], J[1], aOut, aN2, 28, "i′");
          if (o.showD) {
            const M = G.inter(I, d0, J, [-d2[0], -d2[1]]);
            if (isFinite(M[0]) && Math.abs(M[0]) < 1.6 && M[1] > -0.2 && M[1] < 1.2) {
              S.line(I[0], I[1], M[0], M[1], m.col, 1.1, true).line(J[0], J[1], M[0], M[1], m.col, 1.1, true);
              S.line(M[0], M[1], M[0] + d0[0] * 0.6, M[1] + d0[1] * 0.6, "mu", 1, "3 3");
              const a0 = G.deg(Math.atan2(d0[1], d0[0])), a2 = G.deg(Math.atan2(d2[1], d2[0]));
              S.arc(M[0], M[1], a0, a2, 58, "D", "r", 70);
            }
          }
        }
      } else if (k === 0) { res.tot = true; res.J = J; const d3 = G.refl(d1, n2), K = G.inter(J, d3, L, [1, 0]); S.ray([J, K], m.col); }
    });
    if (o.hook) o.hook(S, res);
    res.svg = S.svg("Marche d'un rayon à travers un prisme");
    return res;
  }

  window.OPT_SVG = { Scene, G, lentille, miroirSph, prisme };
})();
