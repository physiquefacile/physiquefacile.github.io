/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* Questions de QCM « déduites des mesures » : les propositions sont calculées à partir des mesures de chaque étudiant.
   Une photo des questions ne suffit pas pour répondre : il faut les valeurs de son propre tableau.
   (Les bonnes réponses sont uniquement sur le serveur de correction.) */
(function () {
  const fitL = (P) => { const n = P.length; if (n < 2) return { a: NaN, b: NaN }; let sx = 0, sy = 0, sxx = 0, sxy = 0; P.forEach(([x, y]) => { sx += x; sy += y; sxx += x * x; sxy += x * y; }); const d = n * sxx - sx * sx; if (Math.abs(d) < 1e-18) return { a: NaN, b: NaN }; const a = (n * sxy - sx * sy) / d; return { a, b: (sy - a * sx) / n }; };
  const H = {
    fit(R, fx, fy, skip) { const L = R.filter((_, j) => !(skip === "last" && j === R.length - 1) && !(skip === "first" && j === 0)); return fitL(L.map(r => [fx(r), fy(r)]).filter(p => isFinite(p[0]) && isFinite(p[1]))); },
    sortBy(R, f) { return R.slice().sort((a, b) => f(a) - f(b)); },
    cal(f, c) { return ((window.TP_MES || {}).CAL || {})[f][c] || { d: NaN }; }
  };
  const Q = {};
  Q.pendule = {
    C_T: { part: "C", q: "Pour ta mesure n°{k} de la partie C, la période T vaut :", u: "s", sig: 4, f: [r => r.t / r.n, r => 2 * r.t / r.n], s: ["e","o1","o0","o2"] },
    C_T2: { part: "C", q: "Pour ta mesure n°{k} de la partie C, T² vaut :", u: "s²", sig: 4, f: [r => (r.t / r.n) ** 2, r => r.t * r.t / r.n], s: ["o1","o0","o2","e"] },
    A_T: { part: "A", q: "Pour ta mesure n°{k} de la partie A, la période T vaut :", u: "s", sig: 4, f: [r => r.t / r.n, r => 2 * r.t / r.n], s: ["e","o0","o2","o1"] },
    A_th: { part: "A", q: "Pour ta mesure n°{k} de la partie A, l'amplitude θ₀ exprimée en radians vaut :", u: "rad", sig: 3, f: [r => r.A * Math.PI / 180, r => (r.A * Math.PI / 180) ** 2], s: ["o1","o2","e","o0"] },
    C_b: { part: "C", g: 1, min: 3, q: "L'ordonnée à l'origine de ta droite de régression T² = f(L) (partie C) vaut :", u: "s²", sig: 3, s: [R => H.fit(R, r => r.L, r => (r.t / r.n) ** 2).a, R => H.fit(R, r => r.L, r => (r.t / r.n) ** 2).b, R => H.fit(R, r => r.L, r => r.t / r.n).b, R => H.fit(R, r => (r.t / r.n) ** 2, r => r.L).b] },
    A_var: { part: "A", g: 1, min: 3, q: "D'après tes mesures de la partie A, la variation relative de la période entre la plus petite et la plus grande amplitude vaut :", u: "%", sig: 3, s: [R => { const s = H.sortBy(R, r => r.A), a = s[0].t / s[0].n, b = s[s.length - 1].t / s[s.length - 1].n; return (b - a) * 100; }, R => { const s = H.sortBy(R, r => r.A), a = s[0].t / s[0].n, b = s[s.length - 1].t / s[s.length - 1].n; return (b / a - 1) * 100; }, R => { const s = H.sortBy(R, r => r.A), a = s[0].t / s[0].n, b = s[s.length - 1].t / s[s.length - 1].n; return (b / a - 1) * 200; }, R => { const s = H.sortBy(R, r => r.A), a = s[0].t / s[0].n, b = s[s.length - 2].t / s[s.length - 2].n; return (b / a - 1) * 100; }] },
  };
  Q.ressort = {
    A_dl: { part: "A", q: "Pour ta mesure n°{k} de la partie A, l'allongement Δℓ vaut :", u: "cm", sig: 3, f: [r => r.l - r.l0, r => r.l], s: ["o0","o1","o2","e"] },
    A_F: { part: "A", q: "Pour ta mesure n°{k} de la partie A, la force F = mg (g = 9,78 m/s²) vaut :", u: "N", sig: 3, f: [r => r.m / 1000 * 9.78, r => r.m / 100 * 9.78], s: ["o0","o2","o1","e"] },
    B_T: { part: "B", q: "Pour ta mesure n°{k} de la partie B, la période T₀ vaut :", u: "s", sig: 3, f: [r => r.t / r.n, r => 2 * r.t / r.n], s: ["o2","e","o1","o0"] },
    B_T2: { part: "B", q: "Pour ta mesure n°{k} de la partie B, T₀² vaut :", u: "s²", sig: 3, f: [r => (r.t / r.n) ** 2, r => r.t * r.t / r.n], s: ["o1","o0","o2","e"] },
    A_k: { part: "A", g: 1, min: 3, q: "La pente de ta droite F = f(Δℓ) (partie A, Δℓ en mètres) vaut :", u: "N/m", sig: 3, s: [R => H.fit(R, r => (r.l - r.l0) / 100, r => r.m / 1000 * 9.78).a, R => H.fit(R, r => r.m / 1000 * 9.78, r => (r.l - r.l0) / 100).a, R => H.fit(R, r => (r.l - r.l0) / 100, r => r.m / 1000 * 9.78).b, R => H.fit(R, r => r.l - r.l0, r => r.m / 1000 * 9.78).a] },
    B_b: { part: "B", g: 1, min: 3, q: "L'ordonnée à l'origine de ta droite T₀² = f(m) (partie B, m en kg) vaut :", u: "s²", sig: 3, s: [R => H.fit(R, r => r.m / 1000, r => (r.t / r.n) ** 2).a, R => H.fit(R, r => r.m / 1000, r => r.t / r.n).b, R => H.fit(R, r => (r.t / r.n) ** 2, r => r.m / 1000).b, R => H.fit(R, r => r.m / 1000, r => (r.t / r.n) ** 2).b] },
    B_mr: { part: "B", g: 1, min: 3, q: "La masse du ressort déduite de ta droite T₀² = f(m), m_r = 3b/a, vaut :", u: "g", sig: 3, s: [R => { const F = H.fit(R, r => r.m / 1000, r => r.t / r.n); return 3000 * F.b / F.a; }, R => { const F = H.fit(R, r => r.m / 1000, r => (r.t / r.n) ** 2); return 3000 * F.b / F.a; }, R => H.fit(R, r => r.m / 1000, r => (r.t / r.n) ** 2).a, R => { const F = H.fit(R, r => r.m / 1000, r => (r.t / r.n) ** 2); return 1000 * F.b / F.a; }] },
  };
  Q.torsion = {
    A_T: { part: "A", q: "Pour ta mesure n°{k} de la partie A, la période T vaut :", u: "s", sig: 3, f: [r => r.t / r.n, r => 2 * r.t / r.n], s: ["o1","e","o2","o0"] },
    A_T2: { part: "A", q: "Pour ta mesure n°{k} de la partie A, T² vaut :", u: "s²", sig: 3, f: [r => (r.t / r.n) ** 2, r => r.t * r.t / r.n], s: ["o2","e","o1","o0"] },
    A_d2: { part: "A", q: "Pour ta mesure n°{k} de la partie A, d² exprimé en m² vaut :", u: "m²", sig: 3, f: [r => (r.d / 100) ** 2, r => r.d / 100], s: ["o2","e","o0","o1"] },
    B_T: { part: "B", q: "Pour ta mesure n°{k} de la partie B, la période T vaut :", u: "s", sig: 3, f: [r => r.t / r.n, r => 2 * r.t / r.n], s: ["o1","e","o2","o0"] },
    A_b: { part: "A", g: 1, min: 3, q: "L'ordonnée à l'origine de ta droite T² = f(d²) (partie A) vaut :", u: "s²", sig: 3, s: [R => H.fit(R, r => (r.t / r.n) ** 2, r => (r.d / 100) ** 2).b, R => H.fit(R, r => (r.d / 100) ** 2, r => r.t / r.n).b, R => H.fit(R, r => (r.d / 100) ** 2, r => (r.t / r.n) ** 2).b, R => H.fit(R, r => (r.d / 100) ** 2, r => (r.t / r.n) ** 2).a] },
    A_J0: { part: "A", g: 1, min: 3, q: "Le moment d'inertie J₀ de la barre déduit de ta droite T² = f(d²) vaut (en 10⁻³ kg·m²) :", u: "×10⁻³ kg·m²", sig: 3, s: [R => { const F = H.fit(R, r => (r.d / 100) ** 2, r => r.t / r.n); return 400 * F.b / F.a; }, R => { const F = H.fit(R, r => (r.d / 100) ** 2, r => (r.t / r.n) ** 2); return 400 * F.b / F.a; }, R => { const F = H.fit(R, r => (r.d / 100) ** 2, r => (r.t / r.n) ** 2); return 400 * F.b / F.a * 4 * Math.PI * Math.PI; }, R => { const F = H.fit(R, r => (r.d / 100) ** 2, r => (r.t / r.n) ** 2); return 200 * F.b / F.a; }] },
    B_a: { part: "B", g: 1, min: 3, q: "La pente de ta droite T² = f(ℓ) (partie B, ℓ en mètres) vaut :", u: "s²/m", sig: 3, s: [R => H.fit(R, r => r.L, r => (r.t / r.n) ** 2).a, R => H.fit(R, r => r.L / 100, r => (r.t / r.n) ** 2).b, R => H.fit(R, r => r.L / 100, r => (r.t / r.n) ** 2).a, R => H.fit(R, r => r.L / 100, r => r.t / r.n).a] },
  };
  Q.ohm = {
    A_P: { part: "A", q: "Pour ta mesure n°{k} de la partie A, la puissance reçue par le résistor vaut :", u: "mW", sig: 3, f: [r => r.U * r.I, r => r.U * r.I / 2], s: ["o2","o1","o0","e"] },
    B_Rm: { part: "B", q: "Pour ta mesure n°{k} de la partie B, R_mes = U/I vaut :", u: "Ω", sig: 4, f: [r => r.U / (r.I / 1000), r => r.U / r.I], s: ["e","o2","o1","o0"] },
    B_Rc: { part: "B", q: "Pour ta mesure n°{k} de la partie B, la résistance corrigée vaut :", u: "Ω", sig: 4, f: [r => { const m = r.U / (r.I / 1000); return r.mont === 'amont' ? m - 2 : m * 1e6 / (1e6 - m); }, r => { const m = r.U / (r.I / 1000); return r.mont === 'amont' ? m * 1e6 / (1e6 - m) : m - 2; }], s: ["o2","e","o1","o0"] },
    C_Rm: { part: "C", q: "Pour ta mesure n°{k} de la partie C, U/I vaut :", u: "Ω", sig: 4, f: [r => r.U / (r.I / 1000), r => r.U / r.I], s: ["o0","o1","o2","e"] },
    C_P: { part: "C", q: "Pour ta mesure n°{k} de la partie C, la puissance reçue par le dipôle vaut :", u: "mW", sig: 3, f: [r => r.U * r.I, r => r.U * r.I / 2], s: ["o1","o0","o2","e"] },
    A_RX: { part: "A", g: 1, min: 3, q: "La pente de ta droite U = f(I) (partie A, I en ampères) vaut :", u: "Ω", sig: 3, s: [R => H.fit(R, r => r.I / 1000, r => r.U).b, R => H.fit(R, r => r.I, r => r.U).a, R => 1 / H.fit(R, r => r.I / 1000, r => r.U).a, R => H.fit(R, r => r.I / 1000, r => r.U).a] },
  };
  Q.oscillo = {
    A_E: { part: "A", q: "Pour ta mesure n°{k} de la partie A, la tension E vaut :", u: "V", sig: 3, f: [r => r.d * r.S, r => r.d / r.S], s: ["o1","e","o0","o2"] },
    B_Um: { part: "B", q: "Pour ta mesure n°{k} de la partie B, l'amplitude U_m vaut :", u: "V", sig: 3, f: [r => r.ypp * r.S / 2, r => r.ypp * r.S], s: ["o2","o1","e","o0"] },
    B_f: { part: "B", q: "Pour ta mesure n°{k} de la partie B, la fréquence mesurée à l'oscilloscope vaut :", u: "Hz", sig: 3, f: [r => 1000 / (r.x * r.B), r => 500 / (r.x * r.B)], s: ["e","o1","o2","o0"] },
    B_Ueff: { part: "B", q: "Pour ta mesure n°{k} de la partie B, la valeur efficace déduite de l'oscilloscope vaut :", u: "V", sig: 3, f: [r => r.ypp * r.S / (2 * Math.SQRT2), r => r.ypp * r.S / Math.SQRT2], s: ["o1","e","o0","o2"] },
    C_phi: { part: "C", q: "Pour ta mesure n°{k} de la partie C, le déphasage φ vaut :", u: "°", sig: 3, f: [r => 360 * r.tau / r.Tdiv, r => 180 * r.tau / r.Tdiv], s: ["o1","o0","o2","e"] },
    C_T: { part: "C", q: "Pour ta mesure n°{k} de la partie C, la période du signal vaut :", u: "ms", sig: 3, f: [r => r.Tdiv * r.B, r => r.tau * r.B], s: ["e","o0","o2","o1"] },
  };
  Q.mesures = {
    A_dU: { part: "A", q: "Pour ta mesure n°{k} de la partie A, l'incertitude ΔU vaut :", u: "V", sig: 3, f: [r => 0.005 * Math.abs(r.L) + 2 * H.cal('V', r.c).d, r => 0.05 * Math.abs(r.L) + 2 * H.cal('V', r.c).d], s: ["o1","o0","e","o2"] },
    A_rel: { part: "A", q: "Pour ta mesure n°{k} de la partie A, l'incertitude relative ΔU/U vaut :", u: "%", sig: 3, f: [r => (0.005 * Math.abs(r.L) + 2 * H.cal('V', r.c).d) / Math.abs(r.L) * 100, r => (0.005 * Math.abs(r.L) + H.cal('V', r.c).d) / Math.abs(r.L) * 100], s: ["o1","o0","o2","e"] },
    B_dI: { part: "B", q: "Pour ta mesure n°{k} de la partie B, l'incertitude ΔI vaut :", u: "mA", sig: 3, f: [r => r.c === 4 ? 0.02 * Math.abs(r.L) + 5 * H.cal('A', r.c).d : 0.01 * Math.abs(r.L) + 2 * H.cal('A', r.c).d, r => 0.01 * Math.abs(r.L) + 20 * H.cal('A', r.c).d], s: ["o1","o2","o0","e"] },
    B_rel: { part: "B", q: "Pour ta mesure n°{k} de la partie B, l'incertitude relative ΔI/I vaut :", u: "%", sig: 3, f: [r => (r.c === 4 ? 0.02 * Math.abs(r.L) + 5 * H.cal('A', r.c).d : 0.01 * Math.abs(r.L) + 2 * H.cal('A', r.c).d) / Math.abs(r.L) * 100, r => (0.01 * Math.abs(r.L) + H.cal('A', r.c).d) / Math.abs(r.L) * 100], s: ["e","o2","o1","o0"] },
    C_dR: { part: "C", q: "Pour ta mesure n°{k} de la partie C, l'incertitude ΔR vaut :", u: "Ω", sig: 3, f: [r => 0.008 * Math.abs(r.L) + 3 * H.cal('O', r.c).d, r => 0.08 * Math.abs(r.L) + 3 * H.cal('O', r.c).d], s: ["o2","e","o0","o1"] },
    C_rel: { part: "C", q: "Pour ta mesure n°{k} de la partie C, l'incertitude relative ΔR/R vaut :", u: "%", sig: 3, f: [r => (0.008 * Math.abs(r.L) + 3 * H.cal('O', r.c).d) / Math.abs(r.L) * 100, r => (0.008 * Math.abs(r.L) + H.cal('O', r.c).d) / Math.abs(r.L) * 100], s: ["o2","o0","e","o1"] },
  };
  Q.lentilles = {
    A_f: { part: "A", q: "Pour ta mesure n°{k} de la partie A, la distance focale f′ vaut :", u: "cm", sig: 3, f: [r => r.xl - 5, r => (r.xl - 5) / 2], s: ["o2","e","o1","o0"] },
    B_g: { part: "B", q: "Pour ta mesure n°{k} de la partie B, le grandissement γ vaut :", u: "", sig: 3, f: [r => r.OAp / r.OA, r => r.OA / r.OAp], s: ["e","o0","o2","o1"] },
    B_x: { part: "B", q: "Pour ta mesure n°{k} de la partie B, 1/OA exprimé en dioptries vaut :", u: "δ", sig: 3, f: [r => 100 / r.OA, r => 1 / r.OA], s: ["o1","o2","o0","e"] },
    B_V: { part: "B", q: "Pour ta mesure n°{k} de la partie B, la vergence V = 1/OA′ − 1/OA vaut :", u: "δ", sig: 3, f: [r => 100 / r.OAp - 100 / r.OA, r => 100 / r.OAp + 100 / r.OA], s: ["e","o2","o1","o0"] },
    C_d: { part: "C", q: "Pour ta mesure n°{k} de la partie C, la distance d entre les deux positions de la lentille vaut :", u: "cm", sig: 3, f: [r => Math.abs(r.x2 - r.x1), r => Math.abs(r.x2 - r.x1) / 2], s: ["o0","o1","e","o2"] },
    C_f: { part: "C", q: "Pour ta mesure n°{k} de la partie C, f′ obtenue par la méthode de Bessel vaut :", u: "cm", sig: 3, f: [r => { const d = Math.abs(r.x2 - r.x1); return (r.D * r.D - d * d) / (4 * r.D); }, r => { const d = Math.abs(r.x2 - r.x1); return (r.D * r.D + d * d) / (4 * r.D); }], s: ["o2","o0","o1","e"] },
    B_Vb: { part: "B", g: 1, min: 3, q: "L'ordonnée à l'origine de ta droite 1/OA′ = f(1/OA) (partie B) vaut :", u: "δ", sig: 3, s: [R => H.fit(R, r => r.OA, r => r.OAp).b, R => H.fit(R, r => 100 / r.OA, r => 100 / r.OAp).a, R => H.fit(R, r => 1 / r.OA, r => 1 / r.OAp).b, R => H.fit(R, r => 100 / r.OA, r => 100 / r.OAp).b] },
  };
  Q.microscope = {
    A_g: { part: "A", q: "Pour ta mesure n°{k} de la partie A, |γ₁| vaut :", u: "", sig: 3, f: [r => r.ab1 / 2, r => r.ab1 * 2], s: ["o1","o2","o0","e"] },
    A_f1: { part: "A", q: "Pour ta mesure n°{k} de la partie A, la focale de l'objectif déduite de la relation de conjugaison vaut :", u: "cm", sig: 3, f: [r => 1 / (1 / r.v + 1 / r.s), r => 1 / (1 / r.s - 1 / r.v)], s: ["o1","o2","o0","e"] },
    A_ratio: { part: "A", q: "Pour ta mesure n°{k} de la partie A, le rapport O₁A₁/|O₁A| vaut :", u: "", sig: 3, f: [r => r.v / r.s, r => r.s / r.v * 100], s: ["o2","e","o1","o0"] },
    B_P: { part: "B", q: "Pour ta mesure n°{k} de la partie B, la puissance P = α′/AB vaut :", u: "δ", sig: 3, f: [r => r.a / 0.002, r => r.a / 0.02], s: ["o0","o2","o1","e"] },
    B_Gc: { part: "B", q: "Pour ta mesure n°{k} de la partie B, le grossissement commercial G_c vaut :", u: "", sig: 3, f: [r => r.a / 0.002 / 4, r => r.a / 0.002 * 4], s: ["e","o2","o0","o1"] },
    A_a: { part: "A", g: 1, min: 3, q: "La pente de ta droite |γ₁| = f(O₁A₁) (partie A) vaut :", u: "cm⁻¹", sig: 3, s: [R => H.fit(R, r => r.v, r => r.ab1 / 2).b, R => H.fit(R, r => r.v, r => r.ab1 / 2).a, R => H.fit(R, r => r.v, r => r.ab1).a, R => 1 / H.fit(R, r => r.v, r => r.ab1 / 2).a] },
  };
  Q.assoc = {
    A_x: { part: "A", q: "Pour ta mesure n°{k} de la partie A, 1/OA exprimé en dioptries vaut :", u: "δ", sig: 3, f: [r => 100 / r.OA, r => 1 / r.OA], s: ["o2","o0","e","o1"] },
    A_V: { part: "A", q: "Pour ta mesure n°{k} de la partie A, la vergence V₁ = 1/OA′ − 1/OA vaut :", u: "δ", sig: 3, f: [r => 100 / r.OAp - 100 / r.OA, r => 100 / r.OAp + 100 / r.OA], s: ["e","o2","o1","o0"] },
    B_V: { part: "B", q: "Pour ta mesure n°{k} de la partie B, la vergence du doublet V = 1/OA′ − 1/OA vaut :", u: "δ", sig: 3, f: [r => 100 / r.OAp - 100 / r.OA, r => 100 / r.OAp + 100 / r.OA], s: ["o1","e","o2","o0"] },
    C_y: { part: "C", q: "Pour ta mesure n°{k} de la partie C, 1/x′ exprimé en dioptries vaut :", u: "δ", sig: 3, f: [r => 100 / r.xp, r => 1 / r.xp], s: ["o2","o1","o0","e"] },
    A_b: { part: "A", g: 1, min: 3, q: "L'ordonnée à l'origine de ta droite 1/OA′ = f(1/OA) (partie A) vaut :", u: "δ", sig: 3, s: [R => H.fit(R, r => 100 / r.OA, r => 100 / r.OAp).b, R => H.fit(R, r => 1 / r.OA, r => 1 / r.OAp).b, R => H.fit(R, r => r.OA, r => r.OAp).b, R => H.fit(R, r => 100 / r.OA, r => 100 / r.OAp).a] },
    B_b: { part: "B", g: 1, min: 3, q: "L'ordonnée à l'origine de ta droite 1/OA′ = f(1/OA) (partie B) vaut :", u: "δ", sig: 3, s: [R => H.fit(R, r => r.OA, r => r.OAp).b, R => H.fit(R, r => 1 / r.OA, r => 1 / r.OAp).b, R => H.fit(R, r => 100 / r.OA, r => 100 / r.OAp).b, R => H.fit(R, r => 100 / r.OA, r => 100 / r.OAp).a] },
  };
  Q.prisme = {
    A_A: { part: "A", q: "Pour ta mesure n°{k} de la partie A, l'angle A du prisme vaut :", u: "°", sig: 4, f: [r => Math.abs(r.t2 - r.t1) / 2, r => Math.abs(r.t2 - r.t1)], s: ["o1","e","o2","o0"] },
    B_Dm: { part: "B", q: "Pour ta mesure n°{k} de la partie B, le minimum de déviation D_m vaut :", u: "°", sig: 4, f: [r => r.th - r.th0, r => (r.th - r.th0) / 2], s: ["o0","o1","e","o2"] },
    B_x: { part: "B", q: "Pour ta mesure n°{k} de la partie B, 1/λ² (λ en µm) vaut :", u: "µm⁻²", sig: 4, f: [r => 1e6 / (r.lam * r.lam), r => 1000 / r.lam], s: ["o1","o2","o0","e"] },
    B_rad: { part: "B", q: "Pour ta mesure n°{k} de la partie B, le minimum de déviation D_m exprimé en radians vaut :", u: "rad", sig: 3, f: [r => (r.th - r.th0) * Math.PI / 180, r => (r.th - r.th0) * 180 / Math.PI], s: ["o0","o1","o2","e"] },
    A_m: { part: "A", g: 1, min: 3, q: "D'après tes mesures de la partie A, l'angle A moyen du prisme vaut :", u: "°", sig: 4, s: [R => R.reduce((s, r) => s + Math.abs(r.t2 - r.t1) / 4, 0) / R.length, R => R.reduce((s, r) => s + Math.abs(r.t2 - r.t1), 0) / R.length, R => 180 - R.reduce((s, r) => s + Math.abs(r.t2 - r.t1) / 2, 0) / R.length, R => R.reduce((s, r) => s + Math.abs(r.t2 - r.t1) / 2, 0) / R.length] },
    B_disp: { part: "B", g: 1, min: 3, q: "D'après tes mesures de la partie B, l'écart entre la plus grande et la plus petite déviation minimale vaut :", u: "°", sig: 3, s: [R => Math.min(...R.map(r => r.th - r.th0)), R => Math.max(...R.map(r => r.th - r.th0)), R => { const D = R.map(r => r.th - r.th0); return Math.max(...D) - Math.min(...D); }, R => (Math.max(...R.map(r => r.th - r.th0)) - Math.min(...R.map(r => r.th - r.th0))) / 2] },
  };
  Q.rc = {
    A_d: { part: "A", q: "Pour ta mesure n°{k} de la partie A, E − u_C vaut :", u: "V", sig: 3, f: [r => r.E - r.u, r => r.E + r.u], s: ["o2","o1","o0","e"] },
    A_ln: { part: "A", q: "Pour ta mesure n°{k} de la partie A, ln(E − u_C) vaut :", u: "", sig: 3, f: [r => Math.log(r.E - r.u), r => Math.log10(r.E - r.u)], s: ["o0","o1","e","o2"] },
    B_ln: { part: "B", q: "Pour ta mesure n°{k} de la partie B, ln(u_C) vaut :", u: "", sig: 3, f: [r => Math.log(r.u), r => Math.log10(r.u)], s: ["o2","o0","o1","e"] },
    C_tR: { part: "C", q: "Pour ta mesure n°{k} de la partie C, le rapport τ / R (R en kΩ) vaut :", u: "s/kΩ", sig: 3, f: [r => r.t / (r.R / 1000), r => r.t * r.R / 1000], s: ["o0","o2","o1","e"] },
    A_tau: { part: "A", g: 1, min: 3, q: "La constante de temps τ déduite de ta droite ln(E − u_C) = f(t) (partie A) vaut :", u: "s", sig: 3, s: [R => -1 / H.fit(R, r => r.t, r => Math.log(r.E - r.u)).a, R => -0.5 / H.fit(R, r => r.t, r => Math.log(r.E - r.u)).a, R => H.fit(R, r => r.t, r => Math.log(r.E - r.u)).b, R => H.fit(R, r => r.t, r => Math.log(r.E - r.u)).a] },
    B_tau: { part: "B", g: 1, min: 3, q: "La constante de temps τ déduite de ta droite ln(u_C) = f(t) (partie B) vaut :", u: "s", sig: 3, s: [R => H.fit(R, r => r.t, r => Math.log(r.u)).a, R => -0.5 / H.fit(R, r => r.t, r => Math.log(r.u)).a, R => H.fit(R, r => r.t, r => Math.log(r.u)).b, R => -1 / H.fit(R, r => r.t, r => Math.log(r.u)).a] },
  };
  Q.rlc = {
    A_Z: { part: "A", q: "Pour ta mesure n°{k} de la partie A, l'impédance Z = U/I vaut :", u: "Ω", sig: 3, f: [r => 1000 * r.U / r.I, r => r.U / r.I], s: ["o0","o2","o1","e"] },
    A_w: { part: "A", q: "Pour ta mesure n°{k} de la partie A, la pulsation ω vaut :", u: "rad/s", sig: 4, f: [r => 2 * Math.PI * r.f, r => r.f / (2 * Math.PI)], s: ["e","o1","o0","o2"] },
    B_Z: { part: "B", q: "Pour ta mesure n°{k} de la partie B, l'impédance Z = U/I vaut :", u: "Ω", sig: 3, f: [r => 1000 * r.U / r.I, r => r.U / r.I], s: ["o1","o2","e","o0"] },
    A_f0: { part: "A", g: 1, min: 3, q: "D'après tes mesures de la partie A, la fréquence où l'intensité est la plus grande vaut :", u: "Hz", sig: 4, s: [R => 2 * H.sortBy(R, r => -r.I)[0].f, R => H.sortBy(R, r => -r.I)[0].f / (2 * Math.PI), R => H.sortBy(R, r => r.I)[0].f, R => H.sortBy(R, r => -r.I)[0].f] },
    A_I0: { part: "A", g: 1, min: 3, q: "D'après tes mesures de la partie A, I₀/√2 (I₀ : plus grande intensité mesurée) vaut :", u: "mA", sig: 3, s: [R => Math.max(...R.map(r => r.I)) * Math.SQRT2, R => Math.max(...R.map(r => r.I)) / Math.SQRT2, R => Math.max(...R.map(r => r.I)) / 2, R => Math.max(...R.map(r => r.I))] },
    A_Rt: { part: "A", g: 1, min: 3, q: "D'après tes mesures de la partie A, la résistance totale R + r = U/I₀ vaut :", u: "Ω", sig: 3, s: [R => 1000 * R[0].U / Math.max(...R.map(r => r.I)), R => R[0].U / Math.max(...R.map(r => r.I)), R => 1000 * R[0].U / Math.min(...R.map(r => r.I)), R => 1000 * R[0].U / Math.max(...R.map(r => r.I)) / Math.SQRT2] },
  };

  // valeurs des 4 propositions pour les mesures R (lignes de la partie), avec la graine k donnée par le serveur
  const near = (a, b) => !isFinite(a) || !isFinite(b) || Math.abs(a - b) <= 0.03 * Math.max(Math.abs(a), Math.abs(b)) || (Math.abs(a) < 1e-12 && Math.abs(b) < 1e-12);
  function propose(t, R, k) {
    const n = R.length;
    if (t.g ? n < (t.min || 3) : n < 1) return null;
    let i = -1;
    if (!t.g) { const i0 = (k - 1) % n; for (let d = 0; d < n; d++) { let y = NaN; try { y = t.f[0](R[(i0 + d) % n]); } catch (e) {} if (isFinite(y) && y !== 0) { i = (i0 + d) % n; break; } } if (i < 0) return null; }   // ligne utilisable (valeur non nulle)
    const at = d => R[(i + d) % n], v = k % 2;
    let vals;
    try {
      vals = t.g ? t.s.map(f => f(R)) : t.s.map(s => s === "o0" ? t.f[0](at(0)) : s === "o1" ? t.f[0](at(1)) : s === "o2" ? t.f[0](at(2)) : t.f[1](at(v ? 0 : 1)));
    } catch (e) { return null; }
    // la bonne valeur doit exister ; les propositions identiques sont remplacées (autres mesures, puis valeurs voisines)
    const good = t.g ? null : t.s.indexOf("o0");
    const ref = t.g ? vals : null;
    if (vals.every(x => !isFinite(x))) return null;
    const alt = []; if (!t.g) for (let d = 3; d < n + 3; d++) { try { alt.push(t.f[0](at(d))); alt.push(t.f[1](at(d))); } catch (e) {} }
    const fac = [0.83, 1.19, 0.71, 1.33, 0.62, 1.47];
    const base = vals.find(x => isFinite(x) && x !== 0) || 1;
    for (let j = 0; j < 4; j++) {
      const clash = () => !isFinite(vals[j]) || vals.some((x, m) => m !== j && (m < j || (!t.g && m === good)) && near(x, vals[j]));
      if (!clash() || (!t.g && j === good)) continue;
      let ok = false;
      for (const a of alt) { vals[j] = a; if (!clash()) { ok = true; break; } }
      if (!ok) for (const f of fac) { vals[j] = base * f * (1 + j * 0.03); if (!clash()) break; }
    }
    return { k: i + 1, vals };
  }
  const fmt = (x, sig) => { if (!isFinite(x)) return "—"; const y = +x.toPrecision(sig); const a = Math.abs(y); let s = a >= 1e5 ? y.toFixed(0) : a >= 1 ? String(y) : y.toPrecision(sig).replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, ""); if (/e/.test(s)) s = String(y); return s.replace("-", "−").replace(".", ","); };
  window.TPQD = { Q, propose, fmt };
})();
