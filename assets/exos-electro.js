/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* Exercices d'entraînement : Électricité 1 ch. 4 (électrocinétique) et Électricité 2 ch. 1 (champ magnétique).
   Même format que exos.js : titre, enonce, reponses [{nom, unite, val, tol|abs}], correction [étapes]. */
(function () {
  const T = window.EXO_OUTILS, EX = window.EXOS;
  if (!T || !EX) return;
  const { R, rnd, pick, N } = T;
  const mu0 = 4 * Math.PI * 1e-7, PI = Math.PI;

  /* ===================== ÉLECTRICITÉ 1 — CH. 4 : ÉLECTROCINÉTIQUE ===================== */
  EX.elec4 = [
    function () {
      let e, ep; do { e = rnd(6, 24); ep = rnd(2, 20); } while (ep >= e - 1);
      const r = rnd(0.2, 2, 0.1), rp = rnd(0.5, 4, 0.5), Rr = rnd(1, 20), I = (e - ep) / (r + Rr + rp), UG = e - r * I, UM = ep + rp * I, eta = 100 * ep / UM;
      return { titre: "Générateur, résistor et moteur en série",
        enonce: R`Un générateur ($e=${e}$ V, $r=${N(r)}\ \Omega$) alimente en série un résistor $R=${Rr}\ \Omega$ et un moteur de f.c.é.m. $e'=${ep}$ V et de résistance interne $r'=${N(rp)}\ \Omega$. Calculer l'intensité $I$, la tension $U_G$ aux bornes du générateur, la tension $U_M$ aux bornes du moteur et le rendement $\eta$ du moteur.`,
        reponses: [{ nom: "I", unite: "A", val: I }, { nom: "U_G", unite: "V", val: UG }, { nom: "U_M", unite: "V", val: UM }, { nom: R`\eta`, unite: "%", val: eta, abs: 0.5 }],
        correction: [
          R`Loi des mailles : $e-rI=RI+e'+r'I$, d'où $I=\dfrac{e-e'}{r+R+r'}=\dfrac{${e}-${ep}}{${N(r)}+${Rr}+${N(rp)}}\approx${N(I)}$ A.`,
          R`Générateur (convention générateur) : $U_G=e-rI=${e}-${N(r)}\times${N(I)}\approx${N(UG)}$ V.`,
          R`Moteur (convention récepteur) : $U_M=e'+r'I=${ep}+${N(rp)}\times${N(I)}\approx${N(UM)}$ V.`,
          R`Rendement du moteur : $\eta=\dfrac{e'I}{U_MI}=\dfrac{e'}{U_M}=\dfrac{${ep}}{${N(UM)}}\approx${N(eta)}\,\%$.`] };
    },
    function () {
      const e1 = rnd(6, 24), e2 = rnd(2, 18), r1 = rnd(1, 5), r2 = rnd(1, 5), Rr = rnd(2, 20);
      const D = Rr * (r1 + r2) + r1 * r2, I1 = (e1 * (Rr + r2) - e2 * Rr) / D, I2 = ((e1 - e2) * Rr - e2 * r1) / D, I = (e1 * r2 + e2 * r1) / D, VB = Rr * I;
      return { titre: "Lois de Kirchhoff : réseau à deux mailles",
        enonce: R`On reprend le réseau de référence du cours (deux générateurs pôles $+$ en haut, résistance $R$ au milieu ; $I_1$ et $I_2$ orientés vers la droite sur le fil du haut, $I$ vers le bas dans $R$) avec $e_1=${e1}$ V, $r_1=${r1}\ \Omega$, $e_2=${e2}$ V, $r_2=${r2}\ \Omega$ et $R=${Rr}\ \Omega$. Calculer $I_1$, $I_2$, $I$ et la tension $U_{BM}$ aux bornes de $R$.`,
        reponses: [{ nom: "I_1", unite: "A", val: I1, abs: 0.005 }, { nom: "I_2", unite: "A", val: I2, abs: 0.005 }, { nom: "I", unite: "A", val: I, abs: 0.005 }, { nom: "U_{BM}", unite: "V", val: VB, abs: 0.02 }],
        correction: [
          R`Nœud $B$ : $I_1=I+I_2$. Maille (1) : $r_1I_1+RI=e_1$. Maille (2) : $-RI+r_2I_2=-e_2$.`,
          R`Déterminant : $D=R(r_1+r_2)+r_1r_2=${Rr}\times${r1 + r2}+${r1 * r2}=${D}\ \Omega^2$.`,
          R`$I=\dfrac{e_1r_2+e_2r_1}{D}=\dfrac{${e1 * r2}+${e2 * r1}}{${D}}\approx${N(I)}$ A.`,
          R`$I_1=\dfrac{e_1(R+r_2)-e_2R}{D}\approx${N(I1)}$ A et $I_2=\dfrac{(e_1-e_2)R-e_2r_1}{D}\approx${N(I2)}$ A ; on vérifie $I_1=I+I_2$.`,
          R`$U_{BM}=RI\approx${N(VB)}$ V. ` + (I2 > 1e-9 ? R`Comme $I_2>0$, le courant entre dans $e_2$ par sa borne $+$ : le générateur 2 fonctionne en récepteur.` : I2 < -1e-9 ? R`Comme $I_2<0$, le générateur 2 débite réellement (il fournit de l'énergie).` : R`$I_2=0$ : le générateur 2 ne débite pas.`)] };
    },
    function () {
      const E = rnd(6, 24), R1 = pick([100, 150, 200, 220, 330, 470]), R2 = pick([100, 220, 330, 470, 680, 1000]), Rc = pick([100, 220, 470, 1000, 2200]);
      const Eth = E * R2 / (R1 + R2), Rth = R1 * R2 / (R1 + R2), I = Eth / (Rth + Rc), IN = Eth / Rth;
      return { titre: "Théorème de Thévenin",
        enonce: R`Un générateur idéal $E=${E}$ V alimente un diviseur formé de $R_1=${R1}\ \Omega$ (en haut) et $R_2=${R2}\ \Omega$ (en bas). On branche une charge $R_c=${Rc}\ \Omega$ aux bornes de $R_2$. Déterminer le générateur de Thévenin $(E_{Th},R_{Th})$ vu par la charge, le courant $I$ dans la charge et le courant de Norton $I_N$.`,
        reponses: [{ nom: "E_{Th}", unite: "V", val: Eth }, { nom: "R_{Th}", unite: "Ω", val: Rth }, { nom: "I", unite: "mA", val: 1000 * I }, { nom: "I_N", unite: "mA", val: 1000 * IN }],
        correction: [
          R`Tension à vide (charge débranchée, diviseur de tension) : $E_{Th}=E\,\dfrac{R_2}{R_1+R_2}=${E}\times\dfrac{${R2}}{${R1 + R2}}\approx${N(Eth)}$ V.`,
          R`Source éteinte ($E$ remplacée par un fil) : $R_1$ et $R_2$ sont en parallèle, $R_{Th}=\dfrac{R_1R_2}{R_1+R_2}\approx${N(Rth)}\ \Omega$.`,
          R`Courant dans la charge : $I=\dfrac{E_{Th}}{R_{Th}+R_c}=\dfrac{${N(Eth)}}{${N(Rth)}+${Rc}}\approx${N(1000 * I)}$ mA.`,
          R`Norton : $I_N=\dfrac{E_{Th}}{R_{Th}}\approx${N(1000 * IN)}$ mA, en parallèle avec $R_N=R_{Th}$.`] };
    }
  ];

  /* ===================== ÉLECTRICITÉ 2 — CH. 1 : CHAMP MAGNÉTIQUE ===================== */
  EX.elec21 = [
    function () {
      const I = rnd(1, 20), d = rnd(1, 10), Rs = rnd(2, 15), Ns = pick([1, 10, 20, 50, 100]);
      const Bf = mu0 * I / (2 * PI * d / 100), Bs = mu0 * Ns * I / (2 * Rs / 100);
      return { titre: "Fil rectiligne et bobine plate",
        enonce: R`Un fil rectiligne très long est parcouru par $I=${I}$ A. Calculer le champ magnétique $B_1$ à la distance $d=${d}$ cm du fil. Le même courant parcourt ensuite une bobine plate de $N=${Ns}$ spire${Ns > 1 ? "s" : ""} de rayon $R=${Rs}$ cm : calculer le champ $B_2$ en son centre ($\mu_0=4\pi\times10^{-7}$ H/m).`,
        reponses: [{ nom: "B_1", unite: "T", val: Bf }, { nom: "B_2", unite: "T", val: Bs }],
        correction: [
          R`Fil infini (Biot et Savart ou théorème d'Ampère) : $B_1=\dfrac{\mu_0I}{2\pi d}=\dfrac{4\pi\times10^{-7}\times${I}}{2\pi\times${N(d / 100)}}\approx${N(Bf)}$ T ; les lignes de champ sont des cercles centrés sur le fil.`,
          R`Bobine plate en son centre : $B_2=N\dfrac{\mu_0I}{2R}=\dfrac{${Ns}\times4\pi\times10^{-7}\times${I}}{2\times${N(Rs / 100)}}\approx${N(Bs)}$ T, porté par l'axe (règle du tire-bouchon).`] };
    },
    function () {
      const Ns = pick([200, 400, 500, 800, 1000, 1500]), L = rnd(20, 60, 5), I = rnd(0.5, 5, 0.5), r = rnd(1, 4, 0.5);
      const n = Ns / (L / 100), B = mu0 * n * I, S = PI * (r / 100) ** 2, Phi = B * S, PhiT = Ns * Phi;
      return { titre: "Solénoïde long : champ et flux",
        enonce: R`Un solénoïde de longueur $L=${L}$ cm, considéré comme infini, comporte $N=${Ns}$ spires de rayon $r=${N(r)}$ cm parcourues par $I=${N(I)}$ A. Calculer le nombre de spires par mètre $n$, le champ $B$ à l'intérieur, le flux $\Phi_1$ à travers une spire et le flux total $\Phi=N\Phi_1$.`,
        reponses: [{ nom: "n", unite: "spires/m", val: n }, { nom: "B", unite: "T", val: B }, { nom: R`\Phi_1`, unite: "Wb", val: Phi }, { nom: R`\Phi`, unite: "Wb", val: PhiT }],
        correction: [
          R`$n=\dfrac NL=\dfrac{${Ns}}{${N(L / 100)}}\approx${N(n)}$ spires/m.`,
          R`Théorème d'Ampère (solénoïde infini) : $B=\mu_0nI=4\pi\times10^{-7}\times${N(n)}\times${N(I)}\approx${N(B)}$ T, uniforme et parallèle à l'axe.`,
          R`$\vec B$ est normal au plan de la spire : $\Phi_1=B\,\pi r^2=${N(B)}\times\pi\times${N(r / 100)}^2\approx${N(Phi)}$ Wb.`,
          R`Flux total : $\Phi=N\Phi_1\approx${N(PhiT)}$ Wb.`] };
    },
    function () {
      const P = pick([{ nom: "Un proton", q: 1.6e-19, m: 1.67e-27, mt: R`1{,}67\times10^{-27}` }, { nom: "Un électron", q: 1.6e-19, m: 9.11e-31, mt: R`9{,}11\times10^{-31}` }, { nom: "Une particule $\\alpha$ (charge $2e$)", q: 3.2e-19, m: 6.64e-27, mt: R`6{,}64\times10^{-27}` }]);
      const isE = P.m < 1e-29, v = isE ? rnd(1, 9) * 1e6 : rnd(1, 9) * 1e5, B = isE ? rnd(1, 20) / 1000 : rnd(0.1, 1.5, 0.1);
      const Rr = P.m * v / (P.q * B), Tp = 2 * PI * P.m / (P.q * B);
      return { titre: "Particule chargée dans un champ magnétique uniforme",
        enonce: R`${P.nom} (masse $m=${P.mt}$ kg) pénètre avec la vitesse $v=${N(v)}$ m/s perpendiculairement à un champ magnétique uniforme $B=${N(B)}$ T. Calculer le rayon $R$ de sa trajectoire circulaire, sa période $T$ et le travail $W$ de la force magnétique sur un tour.`,
        reponses: [{ nom: "R", unite: "m", val: Rr }, { nom: "T", unite: "s", val: Tp }, { nom: "W", unite: "J", val: 0, abs: 1e-30 }],
        correction: [
          R`Force de Lorentz $\vec F=q\vec v\wedge\vec B$, perpendiculaire à $\vec v$ : le mouvement est circulaire uniforme. PFD en projection normale : $m\dfrac{v^2}{R}=|q|vB$.`,
          R`$R=\dfrac{mv}{|q|B}=\dfrac{${P.mt}\times${N(v)}}{${N(P.q)}\times${N(B)}}\approx${N(Rr)}$ m.`,
          R`$T=\dfrac{2\pi m}{|q|B}\approx${N(Tp)}$ s (indépendante de la vitesse).`,
          R`La force magnétique est toujours perpendiculaire au déplacement : elle ne travaille pas, $W=0$ (l'énergie cinétique reste constante).`] };
    }
  ];

  Object.assign(window.EXO_TITRES, {
    elec4: "Chapitre 4 — Électrocinétique",
    elec21: "Chapitre 1 — Le champ magnétique"
  });
})();
