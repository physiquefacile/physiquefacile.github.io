/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* Comptes rendus notés : ce que l'étudiant doit remplir.
   (Les valeurs attendues et les réponses des QCM sont uniquement sur le serveur de correction.)
   fill  : colonnes du tableau à calculer et remplir à la main, ligne par ligne
   plot  : graphe tracé à partir des valeurs remplies par l'étudiant (sans droite de régression)
   calc  : résultats à calculer
   qcm   : questions d'interprétation */
window.TPCR = {
  pendule: {
    parts: {
      A: { min: 5, aide: "<b>T = t / n</b> (durée d'une seule oscillation). Sur le graphe, θ₀² est en rad² : θ₀ (rad) = θ₀ (°) × π / 180. L'ordonnée à l'origine est T₀, la période des petites oscillations.", fill: [{ k: "T", h: "T = t/n (s)", ref: r => r.t / r.n, warn: "Attention : T est la durée d'UNE oscillation, T = t / n (et non t)." }], plot: { x: (r, f) => (r.A * Math.PI / 180) ** 2, y: (r, f) => f.T, xl: "θ₀² (rad²)", yl: "T (s)", xmin: 0, ymin: 0, fit: true, eq: R => "T = " + R.a.toFixed(4).replace(".", ",") + " θ₀² + " + R.b.toFixed(3).replace(".", ","), mark0: R => "T₀ = " + R.b.toFixed(3).replace(".", ",") + " s (θ₀ = 0)" } },
      B: { min: 3, fill: [{ k: "T", h: "T = t/n (s)", ref: r => r.t / r.n, warn: "Attention : T est la durée d'UNE oscillation, T = t / n (et non t)." }] },
      C: { min: 5, aide: "<b>T = t / n</b> puis <b>T²</b>. La droite T² = f(L) (L en m) a pour pente <b>a = 4π² / g</b> (en s²/m), d'où <b>g = 4π² / a = 39,48 / a</b>. Ex. a = 4,04 s²/m : g = 9,77 m/s².", fill: [{ k: "T", h: "T = t/n (s)", ref: r => r.t / r.n, warn: "Attention : T est la durée d'UNE oscillation, T = t / n (et non t)." }, { k: "T2", h: "T² (s²)", ref: r => (r.t / r.n) ** 2, tol: 0.1, warn: "T² = (t / n)²." }], plot: { x: (r, f) => r.L, y: (r, f) => f.T2, xl: "L (m)", yl: "T² (s²)", xmin: 0, ymin: 0, fit: true, eq: R => "T² = " + R.a.toFixed(3).replace(".", ",") + " L " + (R.b < 0 ? "− " : "+ ") + Math.abs(R.b).toFixed(3).replace(".", ",") } }
    },
    calc: [
      { k: "varA", h: "Partie A : variation relative de T entre la plus petite et la plus grande amplitude", u: "%" },
      { k: "pente", h: "Partie C : pente a de la droite T² = f(L)", u: "s²/m" },
      { k: "g", h: "Valeur de g déduite de la pente (g = 4π²/a)", u: "m/s²" },
      { k: "ecart", h: "Écart relatif entre ta valeur de g et 9,78 m/s²", u: "%" }
    ],
    qcm: [
      { q: "Pour les petites oscillations, la période du pendule simple dépend :", o: ["de la longueur L seulement (et de g)", "de la masse et de la longueur", "de l'amplitude θ₀", "de la masse seulement"] },
      { q: "Le graphe T² = f(L) est :", o: ["une parabole", "une droite passant par l'origine, de pente 4π²/g", "une droite de pente g", "une hyperbole"] },
      { q: "Quand l'amplitude dépasse une vingtaine de degrés, la période :", o: ["diminue", "reste rigoureusement constante", "augmente légèrement", "s'annule"] },
      { q: "On chronomètre 10 oscillations plutôt qu'une seule pour :", o: ["que le pendule s'arrête", "diviser par 10 l'erreur due au temps de réaction", "mesurer la fréquence", "obtenir une période dix fois plus grande"] },
      { q: "Si l'on double la masse suspendue (L et θ₀ inchangés), la période :", o: ["double", "est multipliée par √2", "ne change pas", "est divisée par 2"] }
    ]
  },
  ressort: {
    parts: {
      A: { min: 5, aide: "<b>F = m × g</b> avec m en <b>kg</b> (m(g) / 1000) et g = 9,78 m/s². Ex. m = 150 g : F = 0,150 × 9,78 = 1,467 N. <b>Δℓ = ℓ − ℓ₀</b> en cm.<br>Le graphe est tracé avec Δℓ en cm : sa pente est en N/cm. <b>k (N/m) = 100 × pente</b> (ou trace F en fonction de Δℓ en m).", fill: [{ k: "F", h: "F = mg (N)", ref: r => r.m / 1000 * 9.78, tol: 0.1, warn: "F = m × g avec m en kg (g ÷ 1000) et g = 9,78 m/s²." }, { k: "dl", h: "Δℓ = ℓ − ℓ₀ (cm)", ref: r => r.l - r.l0, tol: 0.1, warn: "Δℓ = ℓ − ℓ₀ (allongement en cm)." }], plot: { x: (r, f) => f.dl, y: (r, f) => f.F, xl: "Δℓ (cm)", yl: "F (N)", xmin: 0, ymin: 0, fit: true, eq: R => "F = " + R.a.toFixed(3).replace(".", ",") + " Δℓ " + (R.b < 0 ? "− " : "+ ") + Math.abs(R.b).toFixed(3).replace(".", ",") } },
      B: { min: 4, aide: "<b>T₀ = t / n</b> puis T₀². Le graphe T₀² = f(m), m en kg, est une droite de pente <b>a = 4π² / k</b> et d'ordonnée à l'origine <b>b = a × m<sub>r</sub> / 3</b>. D'où <b>k = 39,48 / a</b> et <b>m<sub>r</sub> = 3 b / a</b> (en kg, × 1000 pour des grammes).", fill: [{ k: "T", h: "T₀ = t/n (s)", ref: r => r.t / r.n, warn: "Attention : T₀ est la durée d'UNE oscillation, T₀ = t / n (et non t)." }, { k: "T2", h: "T₀² (s²)", ref: r => (r.t / r.n) ** 2, warn: "T₀² est le carré de la période T₀ = t / n." }], plot: { x: (r, f) => r.m / 1000, y: (r, f) => f.T2, xl: "m (kg)", yl: "T₀² (s²)", xmin: 0, ymin: 0, fit: true, eq: R => "T₀² = " + R.a.toFixed(3).replace(".", ",") + " m + " + R.b.toFixed(4).replace(".", ","), mark0: R => "b = " + R.b.toFixed(4).replace(".", ",") + " s² pour m = 0" } }
    },
    calc: [
      { k: "kstat", h: "Raideur k par la méthode statique : pente de F = f(Δℓ) avec Δℓ en m (= 100 × pente du graphe en cm)", u: "N/m" },
      { k: "kdyn", h: "Raideur k par la méthode dynamique (k = 4π²/pente de T₀² = f(m))", u: "N/m" },
      { k: "mr", h: "Masse du ressort déduite de l'ordonnée à l'origine (m_r = 3b/a)", u: "g" },
      { k: "ecart", h: "Écart relatif entre k dynamique et k statique", u: "%" }
    ],
    qcm: [
      { q: "La période d'oscillation du système masse-ressort :", o: ["dépend de l'amplitude", "ne dépend pas de l'amplitude", "dépend de g", "est proportionnelle à m"] },
      { q: "L'expression de la période propre est :", o: ["T₀ = 2π√(k/m)", "T₀ = 2π√(m/k)", "T₀ = 2πmk", "T₀ = √(m/k)"] },
      { q: "Si l'on multiplie la masse par 4, la période est :", o: ["multipliée par 4", "multipliée par 2", "divisée par 2", "inchangée"] },
      { q: "L'ordonnée à l'origine non nulle du graphe T₀² = f(m) s'explique par :", o: ["la masse du ressort", "les frottements", "l'erreur de lecture de la règle", "la valeur de g"] },
      { q: "À l'équilibre, l'allongement du ressort vaut :", o: ["Δℓ = k/(mg)", "Δℓ = mgk", "Δℓ = mg/k", "Δℓ = m/k"] }
    ]
  },
  torsion: {
    parts: {
      A: { min: 4, aide: "<b>d² en m²</b> : d (cm) / 100, au carré. Ex. d = 7,5 cm : d² = 0,075² = 0,005625 m². <b>T = t / n</b>, puis T².<br>Droite T² = a d² + b : <b>C = 8π² m / a</b> avec m = 0,2 kg (en N·m/rad ; × 1000 pour l'unité 10⁻³) et <b>J₀ = b × C / (4π²)</b> (× 1000 pour l'unité 10⁻³ kg·m²).", fill: [{ k: "d2", h: "d² (m²)", ref: r => (r.d / 100) ** 2, tol: 0.1, warn: "d² en m² : (d en cm ÷ 100)²." }, { k: "T", h: "T = t/n (s)", ref: r => r.t / r.n, tol: 0.1, warn: "T = t / n : durée d'une oscillation." }, { k: "T2", h: "T² (s²)", ref: r => (r.t / r.n) ** 2, tol: 0.1, warn: "T² = (t / n)²." }], plot: { x: (r, f) => f.d2, y: (r, f) => f.T2, xl: "d² (m²)", yl: "T² (s²)", xmin: 0, ymin: 0, fit: true, eq: R => "T² = " + R.a.toFixed(1).replace(".", ",") + " d² + " + R.b.toFixed(3).replace(".", ","), mark0: R => "b = " + R.b.toFixed(3).replace(".", ",") + " s² pour d = 0" } },
      B: { min: 4, aide: "<b>T = t / n</b>, puis T². Sur le graphe, ℓ est en mètres (ℓ (cm) / 100) : T² = f(ℓ) est une droite qui passe par l'origine, car C est inversement proportionnelle à ℓ.", fill: [{ k: "T", h: "T = t/n (s)", ref: r => r.t / r.n, tol: 0.1, warn: "T = t / n : durée d'une oscillation." }, { k: "T2", h: "T² (s²)", ref: r => (r.t / r.n) ** 2, tol: 0.1, warn: "T² = (t / n)²." }], plot: { x: (r, f) => r.L / 100, y: (r, f) => f.T2, xl: "ℓ (m)", yl: "T² (s²)", xmin: 0, ymin: 0, fit: true, eq: R => "T² = " + R.a.toFixed(2).replace(".", ",") + " ℓ " + (R.b < 0 ? "− " : "+ ") + Math.abs(R.b).toFixed(3).replace(".", ",") } }
    },
    calc: [
      { k: "pente", h: "Partie A : pente a de la droite T² = f(d²)", u: "s²/m²" },
      { k: "C", h: "Constante de torsion C = 8π²m/a (m = 0,2 kg), exprimée en 10⁻³ N·m/rad (ex. 0,0228 N·m/rad → 22,8)", u: "×10⁻³ N·m/rad" },
      { k: "J0", h: "Moment d'inertie de la barre J₀ = b·C/(4π²), exprimé en 10⁻³ kg·m² (ex. 0,0042 kg·m² → 4,2)", u: "×10⁻³ kg·m²" },
      { k: "penteB", h: "Partie B : pente de la droite T² = f(ℓ)", u: "s²/m" }
    ],
    qcm: [
      { q: "Le couple de rappel exercé par le fil de torsion est :", o: ["Γ = −Cθ", "Γ = −Cθ²", "Γ = −C/θ", "Γ = −C sin θ"] },
      { q: "La période du pendule de torsion :", o: ["dépend de l'amplitude dès 20°", "ne dépend pas de l'amplitude, même grande", "dépend de g", "dépend de la masse du fil seulement"] },
      { q: "Quand on éloigne les masses de l'axe, la période :", o: ["diminue", "augmente", "reste constante", "devient nulle"] },
      { q: "Si l'on double la longueur du fil, la constante de torsion C :", o: ["double", "est divisée par 2", "est inchangée", "est multipliée par 4"] },
      { q: "Le graphe T² = f(d²) est une droite car :", o: ["le moment d'inertie J = J₀ + 2md² est une fonction affine de d²", "C dépend de d", "la période est proportionnelle à d", "g intervient"] }
    ]
  },
  ohm: {
    parts: {
      A: { min: 6, aide: "<b>R = U / I</b> avec I en <b>ampères</b> : <b>R (Ω) = U (V) / I (mA) × 1000</b>. Ex. U = 4,70 V, I = 10,0 mA : R = 470 Ω.<br>Le graphe U = f(I) est tracé avec I en mA : sa pente est en V/mA = kΩ. <b>R<sub>X</sub> (Ω) = 1000 × pente</b>.", fill: [{ k: "R", h: "U/I (Ω)", ref: r => r.U / (r.I / 1000), tol: 0.1, warn: "R = U / I avec I en A : U ÷ (I en mA ÷ 1000)." }], plot: { x: (r, f) => r.I, y: (r, f) => r.U, xl: "I (mA)", yl: "U (V)", xmin: 0, ymin: 0, fit: true, eq: R => "U = " + R.a.toFixed(4).replace(".", ",") + " I " + (R.b < 0 ? "− " : "+ ") + Math.abs(R.b).toFixed(3).replace(".", ",") } },
      B: { min: 4, aide: "<b>R corrigée</b> (r<sub>A</sub> = 2 Ω ; R<sub>V</sub> = 1 MΩ = 10⁶ Ω) — montage <b>amont</b> : R = R<sub>mes</sub> − r<sub>A</sub>  ;  montage <b>aval</b> : 1/R = 1/R<sub>mes</sub> − 1/R<sub>V</sub>, soit R = R<sub>mes</sub>·R<sub>V</sub> / (R<sub>V</sub> − R<sub>mes</sub>).", fill: [{ k: "Rm", h: "R_mes = U/I (Ω)", ref: r => r.U / (r.I / 1000), tol: 0.1, warn: "R_mes = U / I avec I en A : U ÷ (I en mA ÷ 1000)." }, { k: "Rc", h: "R corrigée (Ω)" }] },
      C: { min: 4, aide: "<b>R<sub>mes</sub> (Ω) = U (V) / I (mA) × 1000</b>. Série : R<sub>éq</sub> = R₁ + R₂ ; parallèle : R<sub>éq</sub> = R₁R₂ / (R₁ + R₂).", fill: [{ k: "Rm", h: "R_mes = U/I (Ω)", ref: r => r.U / (r.I / 1000), tol: 0.1, warn: "R_mes = U / I avec I en A : U ÷ (I en mA ÷ 1000)." }] }
    },
    calc: [
      { k: "RX", h: "Résistance R_X = 1000 × pente de U = f(I) (I en mA sur le graphe)", u: "Ω" },
      { k: "nom", h: "Valeur nominale de X lue avec le code des couleurs", u: "Ω" },
      { k: "ecart", h: "Écart relatif entre R_X mesurée et la valeur nominale", u: "%" },
      { k: "serie", h: "Résistance équivalente série calculée R₁ + R₂ (avec tes valeurs mesurées de R₁ et R₂)", u: "Ω" },
      { k: "para", h: "Résistance équivalente parallèle calculée R₁R₂/(R₁+R₂)", u: "Ω" }
    ],
    qcm: [
      { q: "Pour mesurer une petite résistance (22 Ω), le montage le plus juste est :", o: ["le montage amont (longue dérivation)", "le montage aval (courte dérivation)", "les deux sont équivalents", "aucun des deux"] },
      { q: "En montage amont, la résistance mesurée U/I vaut :", o: ["R + r_A", "R − r_A", "R·R_V/(R + R_V)", "R exactement"] },
      { q: "L'ampèremètre se branche :", o: ["en dérivation", "en série", "aux bornes du générateur", "indifféremment"] },
      { q: "La caractéristique d'un conducteur ohmique est :", o: ["une droite passant par l'origine", "une parabole", "une courbe exponentielle", "une droite horizontale"] },
      { q: "Un résistor de 22 Ω (0,5 W) supporte au maximum une tension d'environ :", o: ["12 V", "1 V", "3,3 V", "22 V"] }
    ]
  },
  oscillo: {
    parts: {
      A: { min: 3, fill: [{ k: "U", h: "E = d × S (V)", ref: r => r.d * r.S, tol: 0.1, warn: "E = d × S : déviation en divisions multipliée par la sensibilité S (V/div)." }] },
      B: { min: 4, aide: "U<sub>m</sub> = (crête à crête en div) × S / 2   •   T = (période en div) × B   •   f = 1 / T : avec T en ms, f = 1000 / T en Hz   •   U<sub>eff</sub> = U<sub>m</sub> / √2",
        fill: [{ k: "Um", h: "U_m (V)", ref: r => r.ypp * r.S / 2, tol: 0.1, warn: "U_m est l'amplitude : la moitié de la hauteur crête à crête, en volts : U_m = (crête à crête × S) / 2." }, { k: "T", h: "T (ms)", ref: r => r.x * r.B, tol: 0.1, warn: "T = (largeur d'une période en div) × B (ms/div)." }, { k: "f", h: "f mesurée (Hz)", ref: r => 1000 / (r.x * r.B), tol: 0.1, warn: "f = 1/T. Avec T en ms, f = 1000 / T en hertz." }, { k: "Ueff", h: "U_eff = U_m/√2 (V)", ref: r => r.ypp * r.S / 2 / Math.SQRT2, tol: 0.1, warn: "U_eff = U_m / √2 ; compare avec l'indication du voltmètre." }], plot: { x: (r, f) => r.fa, y: (r, f) => f.f, xl: "f affichée (Hz)", yl: "f mesurée (Hz)", xmin: 0, ymin: 0, fit: true, eq: R => "f = " + R.a.toFixed(3).replace(".", ",") + " f_aff " + (R.b < 0 ? "− " : "+ ") + Math.abs(R.b).toFixed(3).replace(".", ",") } },
      C: { min: 4, aide: "φ = 360° × τ / T, avec τ et T lus en divisions sur l'écran (même base de temps).", fill: [{ k: "phi", h: "φ = 360°·τ/T (°)", ref: r => 360 * r.tau / r.Tdiv, tol: 0.1, warn: "φ = 360° × τ / T, avec τ et T en divisions." }], plot: { x: (r, f) => r.fa, y: (r, f) => f.phi, xl: "f affichée (Hz)", yl: "φ (°)", xmin: 0, ymin: 0, join: true } }
    },
    calc: [
      { k: "E", h: "Partie A : tension continue E (moyenne de tes mesures)", u: "V" },
      { k: "Ueff", h: "Partie B : valeur efficace U_eff = U_m/√2 (moyenne)", u: "V" },
      { k: "ecartV", h: "Écart relatif entre U_eff (oscilloscope) et l'indication moyenne du voltmètre", u: "%" },
      { k: "C", h: "Partie C : capacité C = 1/(R ω tan φ) (moyenne ; R = 1 kΩ, ω = 2π/T mesurée)", u: "µF" }
    ],
    qcm: [
      { q: "Sur un oscilloscope, la sensibilité verticale s'exprime en :", o: ["s/div", "V/div", "Hz/div", "div/V"] },
      { q: "La base de temps (balayage horizontal) s'exprime en :", o: ["V/div", "s/div (ou ms/div)", "Hz", "div/s"] },
      { q: "Un signal occupe 6 divisions crête à crête avec une sensibilité de 0,5 V/div. Son amplitude U_m vaut :", o: ["3 V", "1,5 V", "6 V", "0,75 V"] },
      { q: "Une période occupe 4 divisions avec une base de temps de 0,2 ms/div. La fréquence vaut :", o: ["1 250 Hz", "800 Hz", "5 000 Hz", "125 Hz"] },
      { q: "Pour une tension sinusoïdale, la valeur efficace vaut :", o: ["U_eff = U_m/√2", "U_eff = U_m·√2", "U_eff = U_m/2", "U_eff = 2U_m"] }
    ]
  },
  mesures: {
    parts: {
      A: { min: 6, aide: "<b>D</b> = valeur d'une unité du dernier chiffre affiché : 200 mV → 0,0001 V ; 2 V → 0,001 V ; 20 V → 0,01 V ; 200 V → 0,1 V ; <b>600 V → 1 V</b>.<br><b>ΔU = 0,005 × U + 2 × D</b> (en V) ; <b>ΔU/U (%) = ΔU / U × 100</b>.<br>Exemple : 1,592 V sur le calibre 2 V : ΔU = 0,005 × 1,592 + 2 × 0,001 = 0,00996 V ; ΔU/U = 0,63 %.",
        fill: [{ k: "D", h: "Résolution D (V)", ref: r => window.TP_MES.CAL.V[r.c].d, tol: 0.01, warn: "D est la valeur d'une unité du dernier chiffre affiché, en volts (600 V → 1 V ; 20 V → 0,01 V ; 2 V → 0,001 V)." },
          { k: "dU", h: "ΔU = 0,5 %·U + 2 D (V)", ref: r => 0.005 * r.L + 2 * window.TP_MES.CAL.V[r.c].d, tol: 0.1, warn: "ΔU = 0,005 × U + 2 × D, en volts." },
          { k: "rel", h: "ΔU/U (%)", ref: r => (0.005 * r.L + 2 * window.TP_MES.CAL.V[r.c].d) / r.L * 100, tol: 0.1, warn: "ΔU/U (%) = ΔU / U × 100." }] },
      B: { min: 3, aide: "Travaille en <b>mA</b> : sur le calibre 10 A, une lecture de 0,02 A vaut 20 mA.<br><b>D</b> (en mA) : 2 mA → 0,001 ; 20 mA → 0,01 ; 200 mA → 0,1 ; <b>10 A → 0,01 A = 10 mA</b>.<br><b>ΔI = 0,01 × I + 2 × D</b> ; sur le calibre 10 A : <b>ΔI = 0,02 × I + 5 × D</b> ; <b>ΔI/I (%) = ΔI / I × 100</b>.<br>Exemple : 8,60 mA sur 20 mA : ΔI = 0,01 × 8,60 + 2 × 0,01 = 0,106 mA ; ΔI/I = 1,23 %.",
        fill: [{ k: "D", h: "Résolution D (mA)", ref: r => window.TP_MES.CAL.A[r.c].d, tol: 0.01, warn: "D en milliampères : 20 mA → 0,01 mA ; 200 mA → 0,1 mA ; 10 A → 0,01 A = 10 mA." },
          { k: "dI", h: "ΔI = 1 %·I + 2 D (mA) ; calibre 10 A : 2 %·I + 5 D", ref: r => r.c === 4 ? 0.02 * r.L + 5 * window.TP_MES.CAL.A[4].d : 0.01 * r.L + 2 * window.TP_MES.CAL.A[r.c].d, tol: 0.1, warn: "ΔI = 0,01 × I + 2 × D (calibre 10 A : 0,02 × I + 5 × D), avec I et D en mA." },
          { k: "rel", h: "ΔI/I (%)", ref: r => (r.c === 4 ? 0.02 * r.L + 5 * window.TP_MES.CAL.A[4].d : 0.01 * r.L + 2 * window.TP_MES.CAL.A[r.c].d) / r.L * 100, tol: 0.1, warn: "ΔI/I (%) = ΔI / I × 100 (ΔI et I dans la même unité)." }] },
      C: { min: 4, need: { k: "k", vals: ["a", "c", "d"], lab: v => window.TP_MES.RES[v] }, aide: "Mesure <b>chacun</b> des trois résistors R₁, R₂ et R₃, au moins une fois sur son meilleur calibre (le plus petit sans OL).<br>Travaille en <b>Ω</b> : 0,990 kΩ = 990 Ω.<br><b>Code des couleurs</b> (4 anneaux, tolérance or à droite) : R<sub>nom</sub> = (10 × a + b) × 10<sup>m</sup> (a, b : 1<sup>er</sup> et 2<sup>e</sup> anneaux ; m : 3<sup>e</sup> anneau, noir 0 … blanc 9). Ex. jaune-violet-noir : 47 × 10⁰ = 47 Ω ; marron-noir-rouge : 10 × 10² = 1 000 Ω ; marron-vert-jaune : 15 × 10⁴ = 150 000 Ω. Écris un nombre en Ω (47, 1000, 150000…). Pour 3 et 5 anneaux, voir la théorie.<br><b>D</b> (en Ω) : 200 Ω → 0,1 ; 2 kΩ → 1 ; 20 kΩ → 10 ; 200 kΩ → 100 ; 2 MΩ → 1000.<br><b>ΔR = 0,008 × R + 3 × D</b> ; <b>écart (%) = |R − R<sub>nom</sub>| / R<sub>nom</sub> × 100</b>.",
        fill: [{ k: "nom", h: "R nominale, code des couleurs (Ω)" },
          { k: "D", h: "Résolution D (Ω)", ref: r => window.TP_MES.CAL.O[r.c].d, tol: 0.01, warn: "D en ohms : 200 Ω → 0,1 ; 2 kΩ → 1 ; 20 kΩ → 10 ; 200 kΩ → 100." },
          { k: "dR", h: "ΔR = 0,8 %·R + 3 D (Ω)", ref: r => 0.008 * r.L + 3 * window.TP_MES.CAL.O[r.c].d, tol: 0.1, warn: "ΔR = 0,008 × R + 3 × D, avec R et D en ohms." },
          { k: "ecart", h: "Écart à la valeur nominale (%)" }] }
    },
    calc: [
      { k: "E1", h: "Partie A : tension E₁ de la pile 1,5 V lue sur le meilleur calibre (le plus petit calibre sans OL)", u: "V" },
      { k: "dE1", h: "Incertitude ΔE₁ = 0,005 × E₁ + 2 × D sur ce calibre", u: "V" },
      { k: "I", h: "Partie B : intensité I lue sur le meilleur calibre (le plus petit calibre sans OL)", u: "mA" },
      { k: "R2", h: "Partie C : résistance R₂ lue sur le meilleur calibre, en ohms", u: "Ω" },
      { k: "Ical", h: "Intensité calculée I = E₂ / R₂ × 1000 (E₂ en V : pile 9 V lue en partie A sur le meilleur calibre ; R₂ en Ω)", u: "mA" },
      { k: "ecart", h: "Écart relatif = |I calculée − I mesurée| / I calculée × 100", u: "%" }
    ],
    qcm: [
      { q: "Le voltmètre se branche :", o: ["en série avec le dipôle", "en dérivation, aux bornes du dipôle", "à la place du dipôle", "entre les bornes COM et 10 A"] },
      { q: "L'ampèremètre se branche :", o: ["en série, dans la branche où circule le courant", "en dérivation aux bornes du dipôle", "aux bornes de la pile", "indifféremment"] },
      { q: "Le multimètre affiche « OL » (ou un « 1 » seul à gauche) :", o: ["la mesure est nulle", "la pile du multimètre est neuve", "la valeur mesurée dépasse le calibre choisi", "les pointes sont inversées"] },
      { q: "Pour obtenir la mesure la plus précise, on choisit :", o: ["le plus grand calibre", "le plus petit calibre qui ne donne pas de dépassement", "toujours le calibre 20", "le calibre 10 A"] },
      { q: "Sur le calibre 20 V d'un multimètre 2000 points, la résolution vaut :", o: ["1 V", "0,1 V", "0,01 V", "0,001 V"] }
    ]
  },
  lentilles: {
    parts: {
      A: { min: 3, aide: "En autocollimation, l'objet est au foyer : <b>f′ = position de la lentille − position de l'objet</b> (en cm). Ex. lentille à 17,1 cm, objet à 5,0 cm : f′ = 12,1 cm.",
        fill: [{ k: "f", h: "f′ = lentille − objet (cm)", ref: r => r.xl - 5, tol: 0.1, warn: "f′ = position de la lentille − position de l'objet (5,0 cm)." }] },
      B: { min: 5, aide: "Distances <b>algébriques</b> en cm : OA est <b>négatif</b> (objet avant la lentille), OA′ positif. Pour avoir des dioptries, il faut les distances en mètres : <b>1/OA (δ) = 100 / OA(cm)</b> et <b>1/OA′ (δ) = 100 / OA′(cm)</b>, <b>en gardant le signe</b>.<br>Ex. OA = −20,0 cm : 1/OA = 100 / (−20,0) = −5,00 δ ; OA′ = 30,5 cm : 1/OA′ = 100 / 30,5 = 3,28 δ.<br>Le graphe est une droite de pente 1 ; son ordonnée à l'origine est la vergence V, et <b>f′ (cm) = 100 / V</b>.",
        fill: [{ k: "x", h: "1/OA (δ)", ref: r => 100 / r.OA, tol: 0.1, warn: "1/OA (δ) = 100 / OA, avec OA en cm et NÉGATIF : le résultat est négatif." }, { k: "y", h: "1/OA′ (δ)", ref: r => 100 / r.OAp, tol: 0.1, warn: "1/OA′ (δ) = 100 / OA′, avec OA′ en cm." }], plot: { x: (r, f) => f.x, y: (r, f) => f.y, xl: "1/OA (δ)", yl: "1/OA′ (δ)", xmax: 0, ymin: 0, fit: true, eq: R => "1/OA′ = " + R.a.toFixed(2).replace(".", ",") + " · 1/OA + " + R.b.toFixed(2).replace(".", ","), mark0: R => "V = " + R.b.toFixed(2).replace(".", ",") + " δ pour 1/OA = 0" } },
      C: { min: 2, aide: "D = distance objet–écran (fixée) ; x₁ et x₂ = les deux positions de la lentille donnant une image nette.<br><b>d = x₂ − x₁</b> ; <b>f′ = (D² − d²) / (4 D)</b>, tout en cm. Il faut D &gt; 4 f′ pour trouver deux positions.<br>Ex. D = 80 cm, x₁ = 19,9 cm, x₂ = 70,1 cm : d = 50,2 cm ; f′ = (6400 − 2520) / 320 = 12,1 cm.",
        fill: [{ k: "d", h: "d = x₂ − x₁ (cm)", ref: r => r.x2 - r.x1, tol: 0.1, warn: "d = x₂ − x₁ : distance entre les deux positions de la lentille." }, { k: "f", h: "f′ = (D² − d²)/4D (cm)", ref: r => { const d = r.x2 - r.x1; return (r.D * r.D - d * d) / (4 * r.D); }, tol: 0.1, warn: "f′ = (D² − d²) / (4 D), avec D et d en cm." }] }
    },
    calc: [
      { k: "fA", h: "f′ par autocollimation (moyenne des mesures de la partie A)", u: "cm" },
      { k: "V", h: "Vergence V : ordonnée à l'origine de la droite 1/OA′ = f(1/OA) (lue sur le graphe, environ 5 à 10 δ)", u: "δ" },
      { k: "fB", h: "f′ par les plans conjugués : f′ = 100 / V (V en δ, f′ en cm)", u: "cm" },
      { k: "fC", h: "f′ par la méthode de Bessel (moyenne de la partie C)", u: "cm" }
    ],
    qcm: [
      { q: "En autocollimation, l'image nette se forme dans le plan de l'objet lorsque :", o: ["l'objet est au foyer objet de la lentille", "l'objet est à 2f′", "le miroir est au foyer image", "la lentille touche l'objet"] },
      { q: "La relation de conjugaison d'une lentille mince s'écrit :", o: ["1/OA + 1/OA′ = 1/f′", "1/OA′ − 1/OA = 1/f′", "OA′ − OA = f′", "OA · OA′ = f′²"] },
      { q: "La méthode de Bessel n'est possible que si :", o: ["D < 4f′", "D > 4f′", "D = 2f′", "d > D"] },
      { q: "Le graphe 1/OA′ = f(1/OA) est une droite de pente :", o: ["f′", "−1", "1", "1/f′"] },
      { q: "L'avantage de la méthode de Bessel est :", o: ["elle ne nécessite pas de repérer précisément le centre optique", "elle ne nécessite pas d'écran", "elle donne l'image à l'infini", "elle fonctionne avec une lentille divergente"] }
    ]
  },
  microscope: {
    parts: {
      A: { min: 5, aide: "<b>|γ₁| = A₁B₁ / AB</b> avec AB = 2 mm (A₁B₁ en mm). Ex. A₁B₁ = 5,1 mm : |γ₁| = 2,55.<br>Relation de conjugaison 1/O₁A₁ − 1/O₁A = 1/f₁ ⟹ <b>|γ₁| = O₁A₁ / f₁ − 1</b> : droite de <b>pente 1/f₁</b> et d'<b>ordonnée à l'origine −1</b> (négative : c'est normal, la droite ne passe pas par l'origine).<br>Pente en cm⁻¹ (environ 0,15 à 0,25) ; <b>f₁ (cm) = 1 / pente</b>, positive (objectif convergent).",
        fill: [{ k: "g", h: "|γ₁| = A₁B₁/AB", ref: r => r.ab1 / 2, tol: 0.1, warn: "|γ₁| = A₁B₁ / AB, avec A₁B₁ en mm et AB = 2 mm." }], plot: { x: (r, f) => r.v, y: (r, f) => f.g, xl: "O₁A₁ (cm)", yl: "|γ₁|", xmin: 0, ymin: 0, fit: true, eq: R => "|γ₁| = " + R.a.toFixed(3).replace(".", ",") + " O₁A₁ " + (R.b < 0 ? "− " : "+ ") + Math.abs(R.b).toFixed(3).replace(".", ","), mark0: R => "b = " + R.b.toFixed(2).replace(".", ",").replace("-", "−") + " (théorie : −1)", noZoom: true } },
      B: { min: 4, aide: "<b>P = α′ / AB</b> avec α′ en <b>radians</b> et AB en <b>mètres</b> (0,002 m) : <b>P (δ) = α′(mrad) / 2</b>. Ex. α′ = 12,5 mrad : P = 6,25 δ. <b>G<sub>c</sub> = P / 4</b>.<br>Le microscope : <b>P = |γ₁| × P₂ = |γ₁| / f₂</b> ⟹ droite qui <b>passe par l'origine</b>, de pente 1/f₂ (en δ).<br><b>f₂ (cm) = 100 / pente</b>. Ex. pente 9,45 δ : f₂ = 10,6 cm. Grossissement pour |γ₁| = 5 : <b>G = 5 × pente / 4</b>.",
        fill: [{ k: "P", h: "P = α′/AB (δ)", ref: r => r.a / 0.002, tol: 0.1, warn: "P = α′ / AB : α′ en rad (mrad ÷ 1000), AB = 0,002 m, soit P = α′(mrad) / 2." }, { k: "G", h: "G_c = P/4", ref: r => r.a / 0.002 / 4, tol: 0.1, warn: "G_c = P / 4 (P en dioptries)." }], plot: { x: (r, f) => r.g1, y: (r, f) => f.P, xl: "|γ₁|", yl: "P (δ)", xmin: 0, ymin: 0, fit: true, eq: R => "P = " + R.a.toFixed(2).replace(".", ",") + " |γ₁| " + (R.b < 0 ? "− " : "+ ") + Math.abs(R.b).toFixed(3).replace(".", ",") } }
    },
    calc: [
      { k: "pente", h: "Partie A : pente de la droite |γ₁| = f(O₁A₁), en cm⁻¹ (environ 0,15 à 0,25)", u: "cm⁻¹" },
      { k: "f1", h: "Distance focale de l'objectif f₁ = 1 / pente (positive)", u: "cm" },
      { k: "f2", h: "Distance focale de l'oculaire f₂ = 100 / pente de P = f(|γ₁|) (pente en δ)", u: "cm" },
      { k: "G5", h: "Grossissement commercial pour |γ₁| = 5 : G = 5 × pente de P = f(|γ₁|) / 4", u: "" }
    ],
    qcm: [
      { q: "L'objectif d'un microscope donne de l'objet une image :", o: ["virtuelle et réduite", "réelle et agrandie", "réelle et réduite", "à l'infini"] },
      { q: "Pour une observation sans fatigue (œil au repos), l'image intermédiaire A₁B₁ doit être :", o: ["au foyer image de l'objectif", "au foyer objet de l'oculaire", "sur l'oculaire", "à 25 cm de l'œil"] },
      { q: "La puissance du microscope (image à l'infini) vaut :", o: ["P = |γ₁|/f₂", "P = |γ₁|·f₂", "P = f₁/f₂", "P = 1/(f₁ + f₂)"] },
      { q: "Le grossissement commercial est défini par :", o: ["G_c = 4P", "G_c = P", "G_c = P/4", "G_c = 1/P"] },
      { q: "Pour augmenter le grossissement d'un microscope, on peut :", o: ["utiliser un objectif de plus grande focale", "utiliser un oculaire de plus courte focale", "éloigner l'œil", "réduire la lumière"] }
    ]
  },
  assoc: {
    parts: {
      A: { min: 4, aide: "1/OA (δ) = 100 / OA(cm) — OA est <b>négatif</b>, garde le signe ; 1/OA′ (δ) = 100 / OA′(cm). f′ (cm) = 100 / V.", fill: [{ k: "x", h: "1/OA (δ)", ref: r => 100 / r.OA, tol: 0.1, warn: "1/OA (δ) = 100 / OA, avec OA en cm et NÉGATIF." }, { k: "y", h: "1/OA′ (δ)", ref: r => 100 / r.OAp, tol: 0.1, warn: "1/OA′ (δ) = 100 / OA′, avec OA′ en cm." }], plot: { x: (r, f) => f.x, y: (r, f) => f.y, xl: "1/OA (δ)", yl: "1/OA′ (δ)", xmax: 0, ymin: 0, fit: true, eq: R => "1/OA′ = " + R.a.toFixed(2).replace(".", ",") + " · 1/OA + " + R.b.toFixed(2).replace(".", ","), mark0: R => "V₁ = " + R.b.toFixed(2).replace(".", ",") + " δ pour 1/OA = 0" } },
      B: { min: 4, aide: "1/OA (δ) = 100 / OA(cm) — OA est <b>négatif</b>, garde le signe ; 1/OA′ (δ) = 100 / OA′(cm). f′ (cm) = 100 / V.", fill: [{ k: "x", h: "1/OA (δ)", ref: r => 100 / r.OA, tol: 0.1, warn: "1/OA (δ) = 100 / OA, avec OA en cm et NÉGATIF." }, { k: "y", h: "1/OA′ (δ)", ref: r => 100 / r.OAp, tol: 0.1, warn: "1/OA′ (δ) = 100 / OA′, avec OA′ en cm." }], plot: { x: (r, f) => f.x, y: (r, f) => f.y, xl: "1/OA (δ)", yl: "1/OA′ (δ)", xmax: 0, ymin: 0, fit: true, eq: R => "1/OA′ = " + R.a.toFixed(2).replace(".", ",") + " · 1/OA + " + R.b.toFixed(2).replace(".", ","), mark0: R => "V = " + R.b.toFixed(2).replace(".", ",") + " δ (doublet)" } },
      C: { min: 4, aide: "Calcule 1/(f′₁ − e) avec <b>ta</b> valeur de f′₁ (partie A). Distances en cm : 1/(f′₁ − e) = 100/(f′₁ − e) en dioptries ; de même 1/x′ = 100/x′.", fill: [{ k: "x", h: "1/(f′₁ − e) (δ)" }, { k: "y", h: "1/x′ (δ)" }], plot: { x: (r, f) => f.x, y: (r, f) => f.y, xl: "1/(f′₁ − e) (δ)", yl: "1/x′ (δ)", xmin: 0, ymin: 0, fit: true, eq: R => "1/x′ = " + R.a.toFixed(2).replace(".", ",") + " · 1/(f′₁ − e) " + (R.b < 0 ? "− " : "+ ") + Math.abs(R.b).toFixed(2).replace(".", ","), mark0: R => "V₃ = " + R.b.toFixed(2).replace(".", ",") + " δ" } }
    },
    calc: [
      { k: "V1", h: "Partie A : vergence V₁ de L₁ (ordonnée à l'origine)", u: "δ" },
      { k: "V", h: "Partie B : vergence V du doublet L₁ + L₂", u: "δ" },
      { k: "V2", h: "Vergence de la lentille divergente V₂ = V − V₁", u: "δ" },
      { k: "f2", h: "Distance focale f′₂ = 100 / V₂ (V₂ en δ, f′₂ en cm ; négative)", u: "cm" },
      { k: "V3", h: "Partie C : vergence V₃ de L₃ (ordonnée à l'origine)", u: "δ" },
      { k: "f3", h: "Distance focale f′₃ = 100 / V₃ (V₃ en δ, f′₃ en cm)", u: "cm" }
    ],
    qcm: [
      { q: "Deux lentilles minces accolées de vergences V₁ et V₂ sont équivalentes à une lentille de vergence :", o: ["V₁ + V₂", "V₁ · V₂", "V₁ − V₂", "V₁V₂/(V₁ + V₂)"] },
      { q: "On accole une lentille de vergence +8 δ et une lentille de vergence −3 δ. La vergence du doublet vaut :", o: ["+11 δ", "+5 δ", "−24 δ", "+2,7 δ"] },
      { q: "Pour mesurer une lentille divergente, on l'accole à une lentille convergente plus puissante car :", o: ["une lentille divergente ne donne pas d'image réelle d'un objet réel", "cela double sa vergence", "cela corrige les aberrations", "cela réduit la luminosité"] },
      { q: "Le doublet L₁ + L₂ (L₁ convergente, L₂ divergente) est convergent si :", o: ["V₁ + V₂ > 0", "V₁ < |V₂|", "V₂ > 0", "f′₁ > |f′₂|"] },
      { q: "Une lentille de distance focale f′ = −40 cm a une vergence de :", o: ["−0,025 δ", "+2,5 δ", "−2,5 δ", "−40 δ"] },
      { q: "Pour deux lentilles minces distantes de e, la formule de Gullstrand s'écrit :", o: ["V = V₁ + V₂", "V = V₁ + V₂ − e·V₁·V₂", "V = V₁ + V₂ + e·V₁·V₂", "V = V₁·V₂/e"] },
      { q: "Pour un objet à l'infini, l'image donnée par la lentille convergente L₁ se forme :", o: ["au foyer image F′₁", "au centre O₁", "au foyer objet F₁", "à l'infini"] },
      { q: "Dans la partie C (e < f′₁), l'image intermédiaire F′₁ joue pour L₃ le rôle :", o: ["d'un objet virtuel, situé après L₃", "d'un objet réel, situé avant L₃", "de l'image définitive", "du foyer objet de L₃"] },
      { q: "Pour e = 0, la formule de Gullstrand redonne :", o: ["la formule des lentilles accolées V = V₁ + V₂", "une vergence nulle", "V = V₁ · V₂", "une lentille divergente"] },
      { q: "V₂ est obtenue par différence, V₂ = V − V₁. Son incertitude vaut environ :", o: ["ΔV + ΔV₁", "ΔV − ΔV₁", "ΔV · ΔV₁", "la plus petite des deux"] },
      { q: "Avec f′₁ = 10 cm, f′₃ = 20 cm et e = 5 cm, la vergence du système vaut :", o: ["12,5 δ", "15 δ", "17,5 δ", "2,5 δ"] },
      { q: "Le graphe 1/x′ = f(1/(f′₁ − e)) est une droite de pente 1 et d'ordonnée à l'origine :", o: ["V₃", "V₁", "V₁ + V₃", "f′₃"] }
    ]
  },
  prisme: {
    parts: {
      A: { min: 3, aide: "Les deux faisceaux réfléchis font entre eux l'angle 2A : <b>A = |θ₂ − θ₁| / 2</b>. Ex. θ₁ = 222,40° et θ₂ = 342,58° : A = 60,09°.", fill: [{ k: "A", h: "A = |θ₂ − θ₁|/2 (°)", ref: r => Math.abs(r.t2 - r.t1) / 2, tol: 0.05, warn: "A est la MOITIÉ de l'écart entre les deux lectures θ₁ et θ₂." }] },
      B: { min: 5, need: { k: "lam", vals: [404.7, 435.8, 491.6, 546.1, 578], lab: v => "raie " + String(v).replace(".", ",") + " nm" },
        aide: "<b>D_m = θ_m − θ₀</b> ; <b>n = sin((A + D_m)/2) / sin(A/2)</b> avec <b>ton</b> angle A moyen (partie A), calculatrice en mode degrés. <b>1/λ²</b> avec λ en µm : λ = 546,1 nm = 0,5461 µm ⇒ 1/λ² = 3,353 µm⁻². La droite n = f(1/λ²) a pour pente b et pour ordonnée à l'origine a (loi de Cauchy).",
        fill: [{ k: "D", h: "D_m = θ_m − θ₀ (°)", ref: r => r.th - r.th0, tol: 0.05, warn: "D_m = θ_m − θ₀ : lecture au minimum de déviation moins lecture du faisceau direct." },
          { k: "n", h: "n", ref: r => (window.TPX && window.TPX.prismeN) ? window.TPX.prismeN(r) : NaN, tol: 0.02, warn: "n = sin((A + D_m)/2) / sin(A/2), calculatrice en mode DEGRÉS, avec ton A moyen." },
          { k: "x", h: "1/λ² (µm⁻²)", ref: r => 1e6 / (r.lam * r.lam), tol: 0.05, warn: "λ en µm : 1/λ² = 1/(λ en µm)². Ex. 0,5461 µm ⇒ 3,353 µm⁻²." }],
        plot: { x: (r, f) => f.x, y: (r, f) => f.n, xl: "1/λ² (µm⁻²)", yl: "n", fit: true, eq: R => "n = " + R.b.toFixed(4).replace(".", ",") + " + " + R.a.toFixed(4).replace(".", ",") + " / λ²" } }
    },
    calc: [
      { k: "A", h: "Partie A : angle A du prisme (moyenne)", u: "°" },
      { k: "Dv", h: "Partie B : minimum de déviation D_m pour la raie verte (546,1 nm)", u: "°" },
      { k: "nv", h: "Indice n du verre pour la raie verte", u: "" },
      { k: "a", h: "Loi de Cauchy : coefficient a (ordonnée à l'origine de n = f(1/λ²))", u: "" },
      { k: "b", h: "Loi de Cauchy : coefficient b (pente de n = f(1/λ²))", u: "µm²" },
      { k: "nD", h: "Indice n_D pour la raie jaune du sodium, λ = 589,3 nm (n_D = a + b/λ²)", u: "" }
    ],
    qcm: [
      { q: "Au minimum de déviation, le trajet de la lumière dans le prisme est :", o: ["symétrique : i = i′ et r = r′ = A/2", "tel que i = 90°", "tel que r = 0", "tel que D = A"] },
      { q: "Au minimum de déviation, l'indice du prisme vaut :", o: ["n = sin((A + D_m)/2) / sin(A/2)", "n = sin(A/2) / sin((A + D_m)/2)", "n = (A + D_m)/A", "n = sin(A + D_m) / sin A"] },
      { q: "Dans la méthode de réflexion, les deux faisceaux réfléchis par les faces du prisme font entre eux l'angle :", o: ["A", "2A", "A/2", "180° − A"] },
      { q: "Dans un verre, l'indice de réfraction :", o: ["est plus grand pour le violet que pour le jaune", "est le même pour toutes les couleurs", "est plus grand pour le jaune que pour le violet", "est inférieur à 1"] },
      { q: "La radiation la plus déviée par le prisme est :", o: ["la radiation jaune", "la radiation violette", "la radiation verte", "toutes sont déviées de la même façon"] },
      { q: "La loi de Cauchy s'écrit :", o: ["n = a + b/λ²", "n = a + bλ²", "n = a·λ", "n = a/λ"] },
      { q: "Quand on fait tourner le prisme près du minimum de déviation, la raie observée dans la lunette :", o: ["se déplace toujours dans le même sens", "s'arrête puis repart en sens inverse", "disparaît", "change de couleur"] },
      { q: "Avec A = 60,0° et D_m = 40,0°, l'indice du prisme vaut :", o: ["1,532", "1,667", "1,286", "0,653"] },
      { q: "La lecture θ₀ du faisceau direct (sans prisme) sert à :", o: ["mesurer l'angle A", "calculer la déviation D = θ − θ₀", "régler la fente", "mesurer la longueur d'onde"] },
      { q: "Pour la raie verte λ = 546,1 nm, 1/λ² (λ en µm) vaut :", o: ["3,353 µm⁻²", "1,831 µm⁻²", "0,298 µm⁻²", "3,353 × 10⁻⁶ µm⁻²"] },
      { q: "Une erreur de 0,1° sur D_m entraîne sur n (A = 60°, D_m ≈ 40°) une erreur de l'ordre de :", o: ["10⁻³", "10⁻¹", "1", "10⁻⁶"] },
      { q: "La décomposition de la lumière blanche par un prisme s'explique par :", o: ["la réflexion totale", "la variation de l'indice avec la longueur d'onde", "la diffraction par l'arête", "l'absorption du verre"] }
    ]
  },
  rc: {
    parts: {
      A: { min: 6, aide: "<b>ln</b> est le logarithme <b>népérien</b> (touche ln, pas log). E − u_C en volts. La droite ln(E − u_C) = f(t) a pour pente <b>−1/τ</b> : τ = −1/pente. Ex. pente −2,13 s⁻¹ ⇒ τ = 0,469 s.",
        fill: [{ k: "d", h: "E − u_C (V)", ref: r => r.E - r.u, tol: 0.05, warn: "E − u_C : différence entre la tension du générateur et celle du condensateur." },
          { k: "y", h: "ln(E − u_C)", ref: r => { const y = Math.log(r.E - r.u); return Math.abs(y) < 0.2 ? NaN : y; }, tol: 0.1, warn: "Logarithme NÉPÉRIEN (touche ln) de E − u_C." }],
        plot: { x: r => r.t, y: (r, f) => f.y, xl: "t (s)", yl: "ln(E − u_C)", xmin: 0, fit: true, eq: R => "ln(E − u_C) = " + R.a.toFixed(3).replace(".", ",") + " · t " + (R.b < 0 ? "− " : "+ ") + Math.abs(R.b).toFixed(3).replace(".", ",") } },
      B: { min: 6, aide: "<b>ln u_C</b>, logarithme népérien. La droite ln(u_C) = f(t) a pour pente <b>−1/τ</b> et pour ordonnée à l'origine ln U₀.",
        fill: [{ k: "y", h: "ln(u_C)", ref: r => { const y = Math.log(r.u); return Math.abs(y) < 0.2 ? NaN : y; }, tol: 0.1, warn: "Logarithme NÉPÉRIEN (touche ln) de u_C." }],
        plot: { x: r => r.t, y: (r, f) => f.y, xl: "t (s)", yl: "ln(u_C)", xmin: 0, fit: true, eq: R => "ln(u_C) = " + R.a.toFixed(3).replace(".", ",") + " · t " + (R.b < 0 ? "− " : "+ ") + Math.abs(R.b).toFixed(3).replace(".", ",") } },
      C: { min: 4, need: { k: "R", vals: [1000, 2200, 4700, 10000], lab: v => "R = " + (v / 1000 + "").replace(".", ",") + " kΩ" },
        aide: "τ est l'instant où u_C atteint 0,63 E pendant la charge. La droite τ = f(R), avec <b>R en kΩ</b>, a pour pente C en s/kΩ : <b>C (µF) = 1000 × pente</b>. Ex. pente 0,0985 s/kΩ ⇒ C = 98,5 µF.",
        fill: [], plot: { x: r => r.R / 1000, y: r => r.t, xl: "R (kΩ)", yl: "τ (s)", xmin: 0, ymin: 0, fit: true, eq: R => "τ = " + R.a.toFixed(4).replace(".", ",") + " · R " + (R.b < 0 ? "− " : "+ ") + Math.abs(R.b).toFixed(3).replace(".", ",") } }
    },
    calc: [
      { k: "tauA", h: "Partie A : constante de temps τ déduite de la pente (charge)", u: "s" },
      { k: "tauB", h: "Partie B : constante de temps τ déduite de la pente (décharge)", u: "s" },
      { k: "pente", h: "Partie C : pente de la droite τ = f(R), R en kΩ", u: "s/kΩ" },
      { k: "C", h: "Capacité C = 1000 × pente", u: "µF" },
      { k: "ecart", h: "Écart relatif entre C mesurée et la valeur indiquée sur le condensateur", u: "%" }
    ],
    qcm: [
      { q: "Pendant la charge d'un condensateur (initialement déchargé) à travers R sous la tension E, u_C(t) s'écrit :", o: ["E (1 − e^(−t/τ))", "E e^(−t/τ)", "E t/τ", "E (1 + e^(−t/τ))"] },
      { q: "La constante de temps d'un circuit RC vaut :", o: ["τ = R/C", "τ = RC", "τ = 1/(RC)", "τ = √(RC)"] },
      { q: "Pendant la charge, à t = τ, u_C vaut environ :", o: ["37 % de E", "50 % de E", "63 % de E", "100 % de E"] },
      { q: "On considère le condensateur chargé (à 1 % près) au bout de :", o: ["τ", "2τ", "5τ", "100τ"] },
      { q: "Pendant la décharge, à t = τ, u_C vaut environ :", o: ["37 % de U₀", "63 % de U₀", "50 % de U₀", "0"] },
      { q: "Avec R = 4,7 kΩ et C = 100 µF, τ vaut :", o: ["0,47 s", "47 s", "4,7 ms", "470 s"] },
      { q: "Pendant la décharge, la droite ln(u_C) = f(t) a pour pente :", o: ["−1/τ", "τ", "−τ", "1/τ"] },
      { q: "Le produit RC s'exprime en :", o: ["ohms", "farads", "secondes", "volts"] },
      { q: "Si l'on double R (C inchangée), la charge est :", o: ["deux fois plus rapide", "deux fois plus lente", "inchangée", "quatre fois plus lente"] },
      { q: "Le graphe τ = f(R) est une droite passant par l'origine, de pente :", o: ["C", "1/C", "E", "R"] },
      { q: "Juste après la fermeture de l'interrupteur (charge, condensateur déchargé), l'intensité vaut :", o: ["0", "E/R", "E·R", "E/(RC)"] },
      { q: "La tension aux bornes d'un condensateur :", o: ["peut varier brusquement", "ne peut pas varier instantanément (elle est continue)", "est toujours égale à E", "est égale à R·i"] }
    ]
  },
  rlc: {
    parts: {
      A: { min: 10, aide: "<b>Z = U / I</b> avec I en ampères : <b>Z (Ω) = 1000 × U / I(mA)</b>. Ex. U = 2,00 V et I = 40,0 mA ⇒ Z = 50,0 Ω. À la résonance, Z est minimale et vaut R + r. Δf = f₂ − f₁ où I = I₀/√2 ; Q = f₀/Δf.",
        fill: [{ k: "Z", h: "Z = U/I (Ω)", ref: r => 1000 * r.U / r.I, tol: 0.05, warn: "I est en mA : Z (Ω) = 1000 × U / I." }],
        plot: { x: r => r.f, y: r => r.I, xl: "f (Hz)", yl: "I (mA)", ymin: 0, join: true } },
      B: { min: 8, aide: "Même calcul : Z (Ω) = 1000 × U / I(mA). Compare la largeur de cette courbe à celle de la partie A.",
        fill: [{ k: "Z", h: "Z = U/I (Ω)", ref: r => 1000 * r.U / r.I, tol: 0.05, warn: "I est en mA : Z (Ω) = 1000 × U / I." }],
        plot: { x: r => r.f, y: r => r.I, xl: "f (Hz)", yl: "I (mA)", ymin: 0, join: true } }
    },
    calc: [
      { k: "f0", h: "Partie A : fréquence de résonance f₀", u: "Hz" },
      { k: "I0", h: "Partie A : intensité maximale I₀", u: "mA" },
      { k: "Rt", h: "Résistance totale R + r = U / I₀ (I₀ en ampères)", u: "Ω" },
      { k: "r", h: "Résistance r de la bobine = (R + r) − 22", u: "Ω" },
      { k: "df", h: "Partie A : bande passante Δf = f₂ − f₁", u: "Hz" },
      { k: "Q", h: "Partie A : facteur de qualité Q = f₀ / Δf", u: "" },
      { k: "L", h: "Inductance L = 1 / (4π² f₀² C), avec la valeur indiquée de C", u: "mH" },
      { k: "dfB", h: "Partie B : bande passante Δf avec R = 100 Ω", u: "Hz" }
    ],
    qcm: [
      { q: "La fréquence de résonance d'un circuit RLC série vaut :", o: ["f₀ = 1/(2π√(LC))", "f₀ = 2π√(LC)", "f₀ = 1/(LC)", "f₀ = √(L/C)"] },
      { q: "À la résonance d'intensité, l'impédance du circuit est :", o: ["maximale", "minimale et égale à la résistance totale R + r", "nulle", "égale à Lω"] },
      { q: "À la résonance, la tension u_R et la tension du générateur sont :", o: ["en quadrature", "en opposition de phase", "en phase", "décalées d'un quart de période"] },
      { q: "La bande passante Δf = f₂ − f₁ est délimitée par les fréquences où :", o: ["I = I₀/2", "I = I₀/√2", "I = 0", "I = I₀√2"] },
      { q: "Le facteur de qualité vaut :", o: ["Q = f₀/Δf", "Q = Δf/f₀", "Q = f₀·Δf", "Q = R/L"] },
      { q: "Si l'on augmente la résistance du circuit, la résonance devient :", o: ["plus aiguë", "plus floue (bande passante plus large)", "impossible", "décalée vers les hautes fréquences"] },
      { q: "La fréquence de résonance dépend :", o: ["de L et de C seulement", "de R seulement", "de R, L et C", "de la tension du générateur"] },
      { q: "L'impédance d'un dipôle RLC série s'écrit :", o: ["Z = R + Lω + 1/(Cω)", "Z = √(R² + (Lω − 1/(Cω))²)", "Z = R·Lω/(Cω)", "Z = √(R² + L²ω²)"] },
      { q: "Avec L = 0,10 H et C = 1,0 µF, f₀ vaut environ :", o: ["503 Hz", "3,16 kHz", "159 Hz", "50 Hz"] },
      { q: "Pour f < f₀, le circuit RLC série a un comportement :", o: ["inductif", "capacitif", "purement résistif", "nul"] },
      { q: "Un ampèremètre en position alternative (AC) indique :", o: ["la valeur maximale de i", "la valeur efficace de i", "la valeur moyenne de i", "la valeur crête à crête de i"] },
      { q: "La résistance r de la bobine se déduit de l'intensité maximale I₀ par :", o: ["r = U/I₀ − R", "r = U·I₀", "r = R − U/I₀", "r = U/I₀"] }
    ]
  }
};

/* Colonnes des mesures brutes (relevées sur la paillasse) et arrondis appliqués à l'enregistrement.
   r : arrondi par champ (nombre de décimales, ou "s4" = 4 chiffres significatifs) */
(function () {
  const fr = (x, d) => (x == null || !isFinite(x)) ? "—" : (+x).toFixed(d).replace(".", ",");
  const s4 = x => (x == null || !isFinite(x)) ? "—" : String(+(+x).toPrecision(4)).replace(".", ",");
  const RAW = {
    pendule: {
      A: { cols: ["n°", "L (cm)", "θ₀ (°)", "θ₀² (rad²)", "n", "t (s)"], cells: (r, i) => [i + 1, fr(r.L * 100, 1), r.A, fr((r.A * Math.PI / 180) ** 2, 4), r.n, fr(r.t, 2)], r: { L: 3, t: 2 }, titre: "Isochronisme des petites oscillations" },
      B: { cols: ["n°", "m (g)", "L (cm)", "θ₀ (°)", "n", "t (s)"], cells: (r, i) => [i + 1, r.m, fr(r.L * 100, 1), r.A, r.n, fr(r.t, 2)], r: { L: 3, t: 2 }, titre: "Influence de la masse" },
      C: { cols: ["n°", "L (m)", "θ₀ (°)", "n", "t (s)"], cells: (r, i) => [i + 1, fr(r.L, 3), r.A, r.n, fr(r.t, 2)], r: { L: 3, t: 2 }, titre: "Influence de la longueur — mesure de g" }
    },
    ressort: {
      A: { cols: ["n°", "m (g)", "ℓ₀ (cm)", "ℓ (cm)"], cells: (r, i) => [i + 1, r.m, fr(r.l0, 1), fr(r.l, 1)], r: { l: 1, l0: 1 }, titre: "Méthode statique (loi de Hooke)" },
      B: { cols: ["n°", "m (g)", "X₀ (cm)", "n", "t (s)"], cells: (r, i) => [i + 1, r.m, fr(r.X, 1), r.n, fr(r.t, 2)], r: { t: 2, X: 1 }, titre: "Méthode dynamique (période)" }
    },
    torsion: {
      A: { cols: ["n°", "ℓ (cm)", "d (cm)", "n", "t (s)"], cells: (r, i) => [i + 1, r.L, fr(r.d, 1), r.n, fr(r.t, 2)], r: { t: 2, d: 1 }, titre: "Détermination de C et J₀ (ℓ fixée)" },
      B: { cols: ["n°", "ℓ (cm)", "d (cm)", "n", "t (s)"], cells: (r, i) => [i + 1, r.L, fr(r.d, 1), r.n, fr(r.t, 2)], r: { t: 2, d: 1 }, titre: "Influence de la longueur du fil (d fixée)" }
    },
    ohm: {
      A: { cols: ["n°", "U (V)", "I (mA)"], cells: (r, i) => [i + 1, fr(r.U, 2), s4(r.I)], r: { U: 2, I: "s4" }, titre: "Caractéristique U = f(I) du résistor X" },
      B: { cols: ["n°", "Résistor", "Montage", "U (V)", "I (mA)"], cells: (r, i) => [i + 1, r.nom, r.mont, fr(r.U, 2), s4(r.I)], r: { U: 2, I: "s4" }, titre: "Montage amont ou aval ?" },
      C: { cols: ["n°", "Dipôle", "U (V)", "I (mA)"], cells: (r, i) => [i + 1, r.nom, fr(r.U, 2), s4(r.I)], r: { U: 2, I: "s4" }, titre: "Associations de résistances" }
    },
    oscillo: {
      A: { cols: ["n°", "S (V/div)", "d (div)"], cells: (r, i) => [i + 1, String(r.S).replace(".", ","), fr(r.d, 1)], r: { d: 2 }, titre: "Mesure d'une tension continue" },
      B: { cols: ["n°", "f affichée (Hz)", "S (V/div)", "Crête à crête (div)", "B (ms/div)", "Période (div)", "Voltmètre (V)"], cells: (r, i) => [i + 1, r.fa, String(r.S).replace(".", ","), fr(r.ypp, 1), String(r.B).replace(".", ","), fr(r.x, 1), fr(r.V, 2)], r: { ypp: 2, x: 2, V: 2 }, titre: "Tension sinusoïdale du GBF" },
      C: { cols: ["n°", "f affichée (Hz)", "B (ms/div)", "τ (div)", "Période (div)"], cells: (r, i) => [i + 1, r.fa, String(r.B).replace(".", ","), fr(r.tau, 1), fr(r.Tdiv, 1)], r: { tau: 2, Tdiv: 2 }, titre: "Déphasage dans le circuit RC" }
    },
    mesures: {
      A: { cols: ["n°", "Source", "Calibre", "Lecture U"], cells: (r, i) => [i + 1, window.TP_MES.SRC[r.s], window.TP_MES.CAL.V[r.c].n, window.TP_MES.fmtL("V", r.c, r.L)], r: { L: 4 }, titre: "Mesure de tensions (voltmètre)" },
      B: { cols: ["n°", "Calibre", "Lecture I"], cells: (r, i) => [i + 1, window.TP_MES.CAL.A[r.c].n, window.TP_MES.fmtL("A", r.c, r.L)], r: { L: 4 }, titre: "Mesure d'une intensité (ampèremètre)" },
      C: { cols: ["n°", "Résistor", "Calibre", "Lecture R"], cells: (r, i) => [i + 1, window.TP_MES.RES[r.k], window.TP_MES.CAL.O[r.c].n, window.TP_MES.fmtL("O", r.c, r.L)], r: { L: 4 }, titre: "Mesure de résistances (ohmmètre)" }
    },
    lentilles: {
      A: { cols: ["n°", "Objet (cm)", "Lentille (cm)"], cells: (r, i) => [i + 1, "5,0", fr(r.xl, 1)], r: { xl: 1 }, titre: "Autocollimation" },
      B: { cols: ["n°", "OA (cm)", "OA′ (cm)"], cells: (r, i) => [i + 1, fr(r.OA, 1), fr(r.OAp, 1)], r: { OA: 1, OAp: 1 }, titre: "Plans conjugués" },
      C: { cols: ["n°", "D (cm)", "x₁ (cm)", "x₂ (cm)"], cells: (r, i) => [i + 1, fr(r.D, 0), fr(r.x1, 1), fr(r.x2, 1)], r: { x1: 1, x2: 1 }, titre: "Méthode de Bessel" }
    },
    microscope: {
      A: { cols: ["n°", "O₁A (cm)", "O₁A₁ (cm)", "A₁B₁ (mm)"], cells: (r, i) => [i + 1, fr(-r.s, 2), fr(r.v, 1), fr(r.ab1, 1)], r: { s: 2, v: 1, ab1: 1 }, titre: "Image intermédiaire — focale de l'objectif" },
      B: { cols: ["n°", "|γ₁|", "α′ (mrad)"], cells: (r, i) => [i + 1, fr(r.g1, 2), fr(r.a * 1000, 1)], r: { g1: 2, a: 4 }, titre: "Microscope complet — puissance et grossissement" }
    },
    assoc: {
      A: { cols: ["n°", "OA (cm)", "OA′ (cm)"], cells: (r, i) => [i + 1, fr(r.OA, 1), fr(r.OAp, 1)], r: { OA: 1, OAp: 1 }, titre: "Lentille convergente L₁ seule" },
      B: { cols: ["n°", "OA (cm)", "OA′ (cm)"], cells: (r, i) => [i + 1, fr(r.OA, 1), fr(r.OAp, 1)], r: { OA: 1, OAp: 1 }, titre: "Lentilles accolées L₁ + L₂" },
      C: { cols: ["n°", "e (cm)", "x′ = O₃A′ (cm)"], cells: (r, i) => [i + 1, fr(r.e, 1), fr(r.xp, 1)], r: { e: 1, xp: 1 }, titre: "Lentilles séparées L₁ et L₃ (objet à l'infini)" }
    },
    prisme: {
      A: { cols: ["n°", "θ₁ (°)", "θ₂ (°)"], cells: (r, i) => [i + 1, fr(r.t1, 2), fr(r.t2, 2)], r: { t1: 2, t2: 2 }, titre: "Angle A du prisme (méthode de réflexion)" },
      B: { cols: ["n°", "Raie", "λ (nm)", "θ₀ (°)", "θ_m (°)"], cells: (r, i) => [i + 1, ((window.TPX && window.TPX.LINES) || []).filter(l => l.lam === r.lam).map(l => l.nom)[0] || "", fr(r.lam, 1), fr(r.th0, 2), fr(r.th, 2)], r: { th0: 2, th: 2 }, titre: "Minimum de déviation pour chaque raie du mercure" }
    },
    rc: {
      A: { cols: ["n°", "R (Ω)", "E (V)", "t (s)", "u_C (V)"], cells: (r, i) => [i + 1, r.R, fr(r.E, 2), s4(r.t), fr(r.u, 2)], r: { E: 2, t: "s4", u: 2 }, titre: "Charge du condensateur" },
      B: { cols: ["n°", "R (Ω)", "U₀ (V)", "t (s)", "u_C (V)"], cells: (r, i) => [i + 1, r.R, fr(r.U0, 2), s4(r.t), fr(r.u, 2)], r: { U0: 2, t: "s4", u: 2 }, titre: "Décharge du condensateur" },
      C: { cols: ["n°", "R (Ω)", "τ (s)"], cells: (r, i) => [i + 1, r.R, s4(r.t)], r: { t: "s4" }, titre: "Influence de R sur la constante de temps" }
    },
    rlc: {
      A: { cols: ["n°", "R (Ω)", "U (V)", "f (Hz)", "I (mA)"], cells: (r, i) => [i + 1, r.R, fr(r.U, 2), s4(r.f), s4(r.I)], r: { U: 2, f: "s4", I: "s4" }, titre: "Courbe de résonance avec R = 22 Ω" },
      B: { cols: ["n°", "R (Ω)", "U (V)", "f (Hz)", "I (mA)"], cells: (r, i) => [i + 1, r.R, fr(r.U, 2), s4(r.f), s4(r.I)], r: { U: 2, f: "s4", I: "s4" }, titre: "Courbe de résonance avec R = 100 Ω" }
    }
  };
  Object.keys(RAW).forEach(k => Object.keys(RAW[k]).forEach(p => Object.assign(window.TPCR[k].parts[p], RAW[k][p])));
  window.TPCR_PARAMS = { ressort: "ressort_par", torsion: "torsion_par", ohm: "ohm_par", oscillo: "osc_par", mesures: "mes_par", lentilles: "lent_par", microscope: "micro_par", assoc: "assoc_par", prisme: "prisme_par", rc: "rc_par", rlc: "rlc_par" };
})();

/* Banque de questions : 12 par TP. Chaque étudiant connecté reçoit 5 questions tirées
   pour lui seul, avec les réponses dans un ordre mélangé (les bonnes réponses restent sur le serveur). */
(function () {
  const EXTRA = {
    pendule: [
      { q: "Pour mesurer g avec précision, il vaut mieux utiliser :", o: ["un pendule court et une grande amplitude", "un pendule long et de petites oscillations", "un pendule court et de petites oscillations", "une masse très légère"] },
      { q: "La longueur L du pendule se mesure :", o: ["du point de suspension au centre de la masse", "du point de suspension au bas de la masse", "du point de suspension au haut de la masse", "le long de la potence"] },
      { q: "Un pendule de longueur L = 1 m (g = 9,78 m/s²) a une période d'environ :", o: ["1,0 s", "2,0 s", "3,1 s", "6,3 s"] },
      { q: "Si l'on multiplie la longueur du pendule par 4, la période :", o: ["est multipliée par 4", "est multipliée par 2", "est divisée par 2", "ne change pas"] },
      { q: "La pente de la droite T² = f(L) vaut a = 4,04 s²/m. On en déduit g ≈", o: ["9,77 m/s²", "4,04 m/s²", "0,25 m/s²", "39,9 m/s²"] },
      { q: "L'approximation sin θ ≈ θ (petites oscillations) est valable :", o: ["pour θ quelconque exprimé en degrés", "pour θ petit, exprimé en radians", "seulement pour θ = 90°", "pour toutes les amplitudes"] },
      { q: "Une oscillation complète (une période) correspond :", o: ["à un aller seulement", "à un aller-retour : retour à la même position, dans le même sens", "à un passage par la verticale", "à la moitié d'un aller"] }
    ],
    ressort: [
      { q: "Dans la méthode statique, la raideur k est :", o: ["la pente du graphe F = f(Δℓ)", "l'ordonnée à l'origine du graphe F = f(Δℓ)", "l'inverse de la pente du graphe F = f(Δℓ)", "la pente du graphe T₀² = f(m)"] },
      { q: "L'unité de la raideur k est :", o: ["le newton (N)", "le newton-mètre (N·m)", "le newton par mètre (N/m)", "le kilogramme par seconde (kg/s)"] },
      { q: "Une masse de 200 g allonge un ressort de 8,0 cm (g = 9,78 m/s²). Sa raideur vaut environ :", o: ["2,4 N/m", "24 N/m", "0,24 N/m", "24 450 N/m"] },
      { q: "Pour le ressort vertical, le poids décale la position d'équilibre, mais la période :", o: ["dépend de g", "reste T₀ = 2π√(m/k), comme pour un ressort horizontal", "est doublée", "dépend de l'écart initial imposé"] },
      { q: "La pente du graphe T₀² = f(m) vaut :", o: ["k/4π²", "4π²/k", "2π/k", "4π²k"] },
      { q: "Avec un ressort deux fois plus raide (même masse), la période est :", o: ["multipliée par 2", "divisée par 2", "divisée par √2", "multipliée par √2"] },
      { q: "Au-delà de la limite d'élasticité, le ressort :", o: ["reprend toujours sa longueur initiale", "se déforme définitivement : la loi de Hooke n'est plus valable", "devient plus raide", "n'a plus de masse"] }
    ],
    torsion: [
      { q: "L'unité de la constante de torsion C est :", o: ["le N·m/rad", "le N/m", "le kg·m²", "le N·m²"] },
      { q: "L'ordonnée à l'origine b de la droite T² = f(d²) permet de calculer :", o: ["la constante de torsion C", "le moment d'inertie J₀ de la barre seule", "la masse des cylindres", "la longueur du fil"] },
      { q: "La barre seule a un moment d'inertie J₀. On y fixe deux masses ponctuelles m à la distance d de l'axe. Le moment d'inertie total J du système vaut :", o: ["J₀ + 2md", "J₀ + md²", "J₀ + 2md²", "2md²"] },
      { q: "Si la constante de torsion C est multipliée par 4 (J inchangé), la période :", o: ["est multipliée par 4", "est divisée par 2", "est multipliée par 2", "ne change pas"] },
      { q: "L'équation du mouvement du pendule de torsion s'écrit :", o: ["J θ̈ + C θ = 0", "J θ̈ − C θ = 0", "C θ̈ + J θ = 0", "θ̈ + C J θ = 0"] },
      { q: "Pour un fil de rayon r, C = πGr⁴/(2ℓ). Avec un fil de rayon double (même longueur), C est :", o: ["multipliée par 2", "multipliée par 4", "multipliée par 16", "inchangée"] },
      { q: "On chronomètre 5 oscillations et on lit t = 21,0 s. La période vaut :", o: ["4,2 s", "105 s", "21,0 s", "0,24 s"] }
    ],
    ohm: [
      { q: "La loi d'Ohm pour un conducteur ohmique s'écrit :", o: ["U = R/I", "U = R·I", "U = I/R", "U = R·I²"] },
      { q: "Le voltmètre se branche :", o: ["en série avec le dipôle", "en dérivation, aux bornes du dipôle", "en série avec l'ampèremètre", "à la place du générateur"] },
      { q: "En montage aval (courte dérivation), l'erreur systématique vient :", o: ["de la résistance de l'ampèremètre", "du courant qui traverse le voltmètre", "du générateur", "des fils de connexion"] },
      { q: "Pour mesurer une grande résistance (47 kΩ), le montage le plus juste est :", o: ["le montage amont (longue dérivation)", "le montage aval (courte dérivation)", "les deux sont équivalents", "aucun des deux"] },
      { q: "Deux résistances R₁ = 220 Ω et R₂ = 330 Ω en série ont une résistance équivalente de :", o: ["110 Ω", "132 Ω", "550 Ω", "726 Ω"] },
      { q: "Les mêmes résistances (220 Ω et 330 Ω) en parallèle ont une résistance équivalente de :", o: ["132 Ω", "550 Ω", "275 Ω", "110 Ω"] },
      { q: "Un résistor de 470 Ω parcouru par un courant de 20 mA a à ses bornes une tension de :", o: ["9,4 V", "23,5 V", "0,94 V", "4,7 V"] }
    ],
    oscillo: [
      { q: "Un voltmètre en position alternative (V~) indique :", o: ["la valeur maximale", "la valeur efficace", "la valeur crête à crête", "la valeur moyenne"] },
      { q: "En couplage AC, l'oscilloscope :", o: ["supprime la composante continue du signal", "supprime la composante alternative", "affiche la masse", "double la sensibilité"] },
      { q: "La position GND (masse) de l'entrée sert à :", o: ["mesurer la fréquence", "repérer la ligne de référence 0 V sur l'écran", "augmenter l'amplitude", "déclencher le balayage"] },
      { q: "Dans un circuit RC série, la tension u_R aux bornes de R, par rapport à la tension du générateur, est :", o: ["en retard", "en avance", "en phase", "en opposition de phase"] },
      { q: "Un décalage τ entre deux signaux de période T correspond à un déphasage :", o: ["φ = 2πτ/T (rad), soit 360°·τ/T", "φ = τ·T", "φ = T/τ", "φ = 2πT/τ"] },
      { q: "Dans un circuit RC série, tan φ vaut :", o: ["RCω", "1/(RCω)", "R/C", "ω/(RC)"] },
      { q: "Pour mesurer une période avec le plus de précision, on choisit la base de temps telle que la période occupe :", o: ["moins d'une division", "le plus de divisions possible sans dépasser 10", "exactement 1 division", "plus de 10 divisions"] }
    ],
    mesures: [
      { q: "Précision ±(0,5 % + 2 D) ; on lit 9.27 sur le calibre 20 V. L'incertitude ΔU vaut environ :", o: ["0,07 V", "0,02 V", "0,5 V", "0,007 V"] },
      { q: "On mesure U = 1,523 V avec ΔU = 0,010 V. Le résultat s'écrit :", o: ["U = 1,523 V ± 1 %", "U = (1,52 ± 0,01) V", "U = (1,5 ± 0,01) V", "U = (1,5230 ± 0,01) V"] },
      { q: "En voltmètre, l'appareil affiche « −4.52 » :", o: ["il est en panne", "le calibre est trop petit", "les pointes sont inversées : la borne COM est du côté du +", "il faut changer de fonction"] },
      { q: "Avant de mesurer une résistance à l'ohmmètre, il faut :", o: ["alimenter le circuit", "choisir le calibre 10 A", "retirer le résistor du circuit (aucune tension à ses bornes)", "mettre la pointe rouge sur la borne mA"] },
      { q: "Un ampèremètre branché en dérivation aux bornes d'un résistor :", o: ["mesure la tension aux bornes du résistor", "crée un court-circuit et fait fondre le fusible", "ne perturbe pas le circuit", "mesure la résistance"] },
      { q: "Pour perturber le moins possible le circuit, la résistance interne d'un ampèremètre doit être :", o: ["très grande", "égale à celle du circuit", "infinie", "très petite"] },
      { q: "Un résistor marron-noir-rouge-or a pour valeur nominale :", o: ["102 Ω", "1 kΩ ± 5 %", "10 kΩ ± 5 %", "120 Ω ± 10 %"] }
    ],
    lentilles: [
      { q: "La vergence d'une lentille de distance focale f′ = 20 cm vaut :", o: ["0,05 δ", "5 δ", "20 δ", "2 δ"] },
      { q: "Un objet réel placé entre le foyer objet F et une lentille convergente donne une image :", o: ["réelle et renversée", "virtuelle et droite", "réelle et droite", "à l'infini"] },
      { q: "Pour un objet placé au foyer objet d'une lentille convergente, l'image se forme :", o: ["au foyer image", "à l'infini", "sur la lentille", "à 2f′ de la lentille"] },
      { q: "Le grandissement d'une lentille mince vaut :", o: ["γ = OA′/OA", "γ = OA/OA′", "γ = OA·OA′", "γ = f′/OA"] },
      { q: "Méthode de Bessel (D : distance objet-écran, d : distance entre les deux positions de la lentille) :", o: ["f′ = (D² − d²)/(4D)", "f′ = (D² + d²)/(4D)", "f′ = D/4", "f′ = (D − d)/2"] },
      { q: "Dans la méthode de Bessel, lorsque D = 4f′ :", o: ["les deux positions nettes sont très éloignées", "les deux positions de la lentille sont confondues (d = 0)", "il n'y a aucune image nette", "l'image est à l'infini"] },
      { q: "Un objet est à OA = −30 cm d'une lentille de vergence 10 δ (f′ = 10 cm). L'image est à :", o: ["OA′ = 15 cm", "OA′ = 7,5 cm", "OA′ = −15 cm", "OA′ = 20 cm"] }
    ],
    microscope: [
      { q: "L'oculaire d'un microscope joue le rôle :", o: ["d'une loupe qui observe l'image intermédiaire", "d'un miroir", "d'un écran", "d'un diaphragme"] },
      { q: "L'objectif d'un microscope a une distance focale :", o: ["très grande (plusieurs mètres)", "courte (quelques millimètres)", "nulle", "négative (lentille divergente)"] },
      { q: "Pour que l'objectif donne une image réelle et agrandie, l'objet doit être placé :", o: ["entre le foyer F₁ et l'objectif", "un peu avant le foyer objet F₁ (entre 2f₁ et f₁ de l'objectif)", "très loin de l'objectif", "au centre optique de l'objectif"] },
      { q: "L'image finale donnée par un microscope réglé à l'infini est :", o: ["réelle et droite", "virtuelle et renversée par rapport à l'objet", "réelle et renversée, sur un écran", "virtuelle et droite"] },
      { q: "La puissance P d'un instrument s'exprime :", o: ["en mètres", "en dioptries (δ), c'est-à-dire en m⁻¹", "en degrés", "sans unité"] },
      { q: "Avec |γ₁| = 10 et un oculaire de focale f₂ = 2,5 cm, la puissance vaut :", o: ["400 δ", "25 δ", "4 δ", "250 δ"] },
      { q: "Pour un microscope de puissance P = 400 δ, le grossissement commercial vaut :", o: ["100", "1600", "400", "4"] }
    ]
  };
  Object.keys(EXTRA).forEach(k => window.TPCR[k].qcm.push(...EXTRA[k]));
})();
