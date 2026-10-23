/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* Exercices d'entraînement à valeurs aléatoires.
   Chaque générateur renvoie : titre, enonce (HTML + LaTeX entre $), reponses [{nom, unite, val, tol}], correction [étapes]. */
(function () {
  const R = String.raw;
  const g = 9.8, K = 9e9, e0 = 8.85e-12, e = 1.6e-19;
  const rnd = (a, b, step = 1) => { const n = Math.round((b - a) / step); return +(a + step * Math.floor(Math.random() * (n + 1))).toFixed(6); };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
  // nombre au format français, en LaTeX
  function N(x, sig = 3) {
    if (!isFinite(x)) return "\\infty";
    if (x === 0) return "0";
    const a = Math.abs(x);
    if (a >= 1e-2 && a < 1e4) {
      let s = (+x.toPrecision(sig)).toString();
      return s.replace("-", "-").replace(".", "{,}");
    }
    const ex = Math.floor(Math.log10(a)); let m = +(x / 10 ** ex).toPrecision(sig);
    if (Math.abs(m) >= 10) { m /= 10; return N(m * 10 ** (ex + 1), sig); }
    return m.toString().replace(".", "{,}") + "\\times10^{" + ex + "}";
  }
  const deg = r => r * 180 / Math.PI, rad = d => d * Math.PI / 180;
  const vec = v => "(" + v.map(x => N(x)).join("\\,;\\,") + ")";
  const sgn = x => (x < 0 ? "(" + N(x) + ")" : N(x));

  const EX = {};

  /* ===================== MÉCANIQUE 1 : CALCUL VECTORIEL ===================== */
  EX.meca1 = [
    function () {
      let u, v; do { u = [nz(-4, 4), rnd(-4, 4), rnd(-4, 4)]; v = [rnd(-4, 4), nz(-4, 4), rnd(-4, 4)]; } while (Math.abs(u[0]*v[0]+u[1]*v[1]+u[2]*v[2]) === Math.hypot(...u)*Math.hypot(...v));
      const nu = Math.hypot(...u), nv = Math.hypot(...v), d = u[0]*v[0]+u[1]*v[1]+u[2]*v[2], th = deg(Math.acos(d/(nu*nv)));
      return { titre: "Norme, produit scalaire et angle",
        enonce: R`On donne $\vec u=${vec(u)}$ et $\vec v=${vec(v)}$. Calculer $\|\vec u\|$, le produit scalaire $\vec u\cdot\vec v$, puis l'angle $\theta$ entre les deux vecteurs.`,
        reponses: [{ nom: R`\|\vec u\|`, unite: "", val: nu }, { nom: R`\vec u\cdot\vec v`, unite: "", val: d, abs: 0.01 }, { nom: R`\theta`, unite: "°", val: th, abs: 0.6 }],
        correction: [
          R`Norme : $\|\vec u\|=\sqrt{${u.map(sgn).map(x=>x+"^2").join("+")}}=\sqrt{${u[0]**2+u[1]**2+u[2]**2}}\approx${N(nu)}$.`,
          R`Produit scalaire : $\vec u\cdot\vec v=u_xv_x+u_yv_y+u_zv_z=${u.map((x,i)=>sgn(x)+"\\times"+sgn(v[i])).join("+")}=${N(d)}$.`,
          R`Angle : $\cos\theta=\dfrac{\vec u\cdot\vec v}{\|\vec u\|\,\|\vec v\|}=\dfrac{${N(d)}}{${N(nu)}\times${N(nv)}}\approx${N(d/(nu*nv))}$, d'où $\theta\approx${N(th)}^\circ$.`] };
    },
    function () {
      let u, v, w; do { u = [rnd(-3, 3), rnd(-3, 3), rnd(-3, 3)]; v = [rnd(-3, 3), rnd(-3, 3), rnd(-3, 3)]; w = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]]; } while (Math.hypot(...w) === 0);
      const A = Math.hypot(...w) / 2;
      return { titre: "Produit vectoriel et aire d'un triangle",
        enonce: R`Les points $A$, $B$, $C$ sont tels que $\vec{AB}=${vec(u)}$ et $\vec{AC}=${vec(v)}$. Calculer les composantes de $\vec w=\vec{AB}\wedge\vec{AC}$, puis l'aire du triangle $ABC$.`,
        reponses: [{ nom: "w_x", val: w[0], abs: 0.01 }, { nom: "w_y", val: w[1], abs: 0.01 }, { nom: "w_z", val: w[2], abs: 0.01 }, { nom: R`\text{Aire}`, unite: "", val: A }],
        correction: [
          R`$w_x=u_yv_z-u_zv_y=${sgn(u[1])}\times${sgn(v[2])}-${sgn(u[2])}\times${sgn(v[1])}=${w[0]}$`,
          R`$w_y=u_zv_x-u_xv_z=${sgn(u[2])}\times${sgn(v[0])}-${sgn(u[0])}\times${sgn(v[2])}=${w[1]}$`,
          R`$w_z=u_xv_y-u_yv_x=${sgn(u[0])}\times${sgn(v[1])}-${sgn(u[1])}\times${sgn(v[0])}=${w[2]}$`,
          R`La norme du produit vectoriel est l'aire du parallélogramme ; le triangle en est la moitié : $\mathcal A=\tfrac12\|\vec w\|=\tfrac12\sqrt{${w[0]**2+w[1]**2+w[2]**2}}\approx${N(A)}$.`] };
    },
    function () {
      const u = [nz(-5, 5), nz(-5, 5), rnd(-5, 5)], n = Math.hypot(...u), c = u.map(x => x / n);
      return { titre: "Cosinus directeurs",
        enonce: R`Calculer les cosinus directeurs $\cos\alpha$, $\cos\beta$, $\cos\gamma$ du vecteur $\vec u=${vec(u)}$.`,
        reponses: [{ nom: R`\cos\alpha`, val: c[0], abs: 0.005 }, { nom: R`\cos\beta`, val: c[1], abs: 0.005 }, { nom: R`\cos\gamma`, val: c[2], abs: 0.005 }],
        correction: [
          R`Norme : $\|\vec u\|=\sqrt{${u[0]**2+u[1]**2+u[2]**2}}\approx${N(n)}$.`,
          R`$\cos\alpha=\dfrac{u_x}{\|\vec u\|}\approx${N(c[0])}$, $\cos\beta=\dfrac{u_y}{\|\vec u\|}\approx${N(c[1])}$, $\cos\gamma=\dfrac{u_z}{\|\vec u\|}\approx${N(c[2])}$.`,
          R`Vérification : $\cos^2\alpha+\cos^2\beta+\cos^2\gamma=1$.`] };
    }
  ];

  /* ===================== MÉCANIQUE 2 : CINÉMATIQUE ===================== */
  EX.meca2 = [
    function () {
      const a = nz(-4, 4), b = rnd(-6, 6), c = rnd(-5, 5), t = rnd(1, 4);
      const x = a*t*t + b*t + c, v = 2*a*t + b, acc = 2*a;
      return { titre: "Mouvement rectiligne : position, vitesse, accélération",
        enonce: R`Un point se déplace sur l'axe $Ox$ selon $x(t)=${N(a)}\,t^2${b<0?"":"+"}${N(b)}\,t${c<0?"":"+"}${N(c)}$ (SI). Calculer la position, la vitesse et l'accélération à $t=${t}$ s.`,
        reponses: [{ nom: R`x(${t})`, unite: "m", val: x, abs: 0.01 }, { nom: R`v(${t})`, unite: "m/s", val: v, abs: 0.01 }, { nom: "a", unite: "m/s²", val: acc, abs: 0.01 }],
        correction: [
          R`Position : $x(${t})=${N(a)}\times${t}^2${b<0?"":"+"}${N(b)}\times${t}${c<0?"":"+"}${N(c)}=${N(x)}$ m.`,
          R`Vitesse : $v=\dfrac{\dd x}{\dd t}=${N(2*a)}\,t${b<0?"":"+"}${N(b)}$, donc $v(${t})=${N(v)}$ m/s.`,
          R`Accélération : $a=\dfrac{\dd v}{\dd t}=${N(acc)}$ m/s² (constante : mouvement uniformément varié).`,
          v*acc > 0 ? R`À cet instant $a\,v>0$ : le mouvement est accéléré.` : v*acc < 0 ? R`À cet instant $a\,v<0$ : le mouvement est ralenti.` : R`À cet instant la vitesse est nulle : le mobile fait demi-tour.`] };
    },
    function () {
      const Rr = rnd(0.5, 5, 0.5), T = rnd(1, 10), v = 2*Math.PI*Rr/T, aN = v*v/Rr;
      return { titre: "Mouvement circulaire uniforme",
        enonce: R`Un point décrit un cercle de rayon $R=${N(Rr)}$ m à vitesse constante, avec une période $T=${T}$ s. Calculer sa vitesse $v$, sa vitesse angulaire $\omega$ et son accélération normale $a_N$.`,
        reponses: [{ nom: "v", unite: "m/s", val: v }, { nom: R`\omega`, unite: "rad/s", val: 2*Math.PI/T }, { nom: "a_N", unite: "m/s²", val: aN }],
        correction: [
          R`Un tour de longueur $2\pi R$ en une période : $v=\dfrac{2\pi R}{T}=\dfrac{2\pi\times${N(Rr)}}{${T}}\approx${N(v)}$ m/s.`,
          R`$\omega=\dfrac{2\pi}{T}\approx${N(2*Math.PI/T)}$ rad/s (on vérifie $v=R\omega$).`,
          R`La vitesse est constante, donc $a_T=0$ et $a=a_N=\dfrac{v^2}{R}=\dfrac{${N(v)}^2}{${N(Rr)}}\approx${N(aN)}$ m/s², dirigée vers le centre.`] };
    },
    function () {
      const b = rnd(0.5, 3, 0.5), w = rnd(0.5, 3, 0.5), t = rnd(1, 4), r = b*t;
      const vr = b, vt = r*w, ar = -r*w*w, at = 2*b*w;
      return { titre: "Coordonnées polaires",
        enonce: R`Un point se déplace dans un plan avec $r(t)=${N(b)}\,t$ (m) et $\theta(t)=${N(w)}\,t$ (rad). Calculer à $t=${t}$ s les composantes $v_r$, $v_\theta$ de la vitesse et $a_r$, $a_\theta$ de l'accélération.`,
        reponses: [{ nom: "v_r", unite: "m/s", val: vr }, { nom: R`v_\theta`, unite: "m/s", val: vt }, { nom: "a_r", unite: "m/s²", val: ar }, { nom: R`a_\theta`, unite: "m/s²", val: at }],
        correction: [
          R`Dérivées : $\dot r=${N(b)}$, $\ddot r=0$, $\dot\theta=${N(w)}$, $\ddot\theta=0$ ; à $t=${t}$ s, $r=${N(r)}$ m.`,
          R`$\vec v=\dot r\,\vec u_r+r\dot\theta\,\vec u_\theta$ : $v_r=${N(vr)}$ m/s et $v_\theta=${N(r)}\times${N(w)}=${N(vt)}$ m/s.`,
          R`$\vec a=(\ddot r-r\dot\theta^2)\,\vec u_r+(2\dot r\dot\theta+r\ddot\theta)\,\vec u_\theta$ : $a_r=-${N(r)}\times${N(w)}^2=${N(ar)}$ m/s² et $a_\theta=2\times${N(b)}\times${N(w)}=${N(at)}$ m/s².`] };
    }
  ];

  /* ===================== MÉCANIQUE 3 : DYNAMIQUE ===================== */
  EX.meca3 = [
    function () {
      const al = rnd(15, 40, 5), L = rnd(1, 5, 0.5), a = g*Math.sin(rad(al)), v = Math.sqrt(2*a*L), t = Math.sqrt(2*L/a);
      return { titre: "Plan incliné sans frottement",
        enonce: R`Un solide est lâché sans vitesse en haut d'un plan incliné d'angle $\alpha=${al}^\circ$ et de longueur $L=${N(L)}$ m. Les frottements sont négligés ($g=9{,}8$ m/s²). Calculer son accélération, sa vitesse en bas du plan et la durée de la descente.`,
        reponses: [{ nom: "a", unite: "m/s²", val: a }, { nom: "v", unite: "m/s", val: v }, { nom: "t", unite: "s", val: t }],
        correction: [
          R`Forces : le poids $\vec P$ et la réaction normale $\vec N$. On projette le PFD sur l'axe du plan (vers le bas) : $ma=mg\sin\alpha$, la réaction ne contribue pas.`,
          R`$a=g\sin\alpha=9{,}8\times\sin${al}^\circ\approx${N(a)}$ m/s².`,
          R`Mouvement uniformément accéléré : $v^2=2aL$, donc $v=\sqrt{2\times${N(a)}\times${N(L)}}\approx${N(v)}$ m/s.`,
          R`$L=\tfrac12at^2$, donc $t=\sqrt{2L/a}\approx${N(t)}$ s.`] };
    },
    function () {
      let al, mu; do { al = rnd(25, 45, 5); mu = rnd(0.1, 0.4, 0.05); } while (Math.tan(rad(al)) <= mu + 0.05);
      const m = rnd(1, 10), Nn = m*g*Math.cos(rad(al)), f = mu*Nn, a = g*(Math.sin(rad(al)) - mu*Math.cos(rad(al)));
      return { titre: "Plan incliné avec frottement",
        enonce: R`Un bloc de masse $m=${m}$ kg glisse vers le bas d'un plan incliné d'angle $\alpha=${al}^\circ$. Le coefficient de frottement dynamique vaut $\mu=${N(mu)}$ ($g=9{,}8$ m/s²). Calculer la réaction normale $N$, la force de frottement $f$ et l'accélération $a$.`,
        reponses: [{ nom: "N", unite: "N", val: Nn }, { nom: "f", unite: "N", val: f }, { nom: "a", unite: "m/s²", val: a }],
        correction: [
          R`Perpendiculairement au plan, pas de mouvement : $N=mg\cos\alpha=${m}\times9{,}8\times\cos${al}^\circ\approx${N(Nn)}$ N.`,
          R`Frottement de glissement : $f=\mu N\approx${N(f)}$ N, opposé au mouvement.`,
          R`Le long du plan : $ma=mg\sin\alpha-f$, d'où $a=g(\sin\alpha-\mu\cos\alpha)\approx${N(a)}$ m/s².`] };
    },
    function () {
      const m = rnd(0.1, 2, 0.1), k = rnd(10, 200, 10), X = rnd(2, 10) / 100, w = Math.sqrt(k/m), T = 2*Math.PI/w;
      return { titre: "Oscillateur harmonique (masse-ressort)",
        enonce: R`Une masse $m=${N(m)}$ kg est fixée à un ressort de raideur $k=${k}$ N/m, sur un support horizontal sans frottement. On l'écarte de $X_m=${N(X*100)}$ cm puis on la lâche. Calculer la pulsation propre $\omega_0$, la période $T_0$ et la vitesse maximale.`,
        reponses: [{ nom: R`\omega_0`, unite: "rad/s", val: w }, { nom: "T_0", unite: "s", val: T }, { nom: R`v_{\max}`, unite: "m/s", val: X*w }],
        correction: [
          R`PFD sur l'axe : $m\ddot x=-kx$, soit $\ddot x+\omega_0^2x=0$ avec $\omega_0=\sqrt{k/m}=\sqrt{${k}/${N(m)}}\approx${N(w)}$ rad/s.`,
          R`$T_0=\dfrac{2\pi}{\omega_0}\approx${N(T)}$ s.`,
          R`$x(t)=X_m\cos(\omega_0t)$, donc $v_{\max}=X_m\omega_0=${N(X)}\times${N(w)}\approx${N(X*w)}$ m/s.`] };
    }
  ];

  /* ===================== MÉCANIQUE 4 : TRAVAIL ET ÉNERGIE ===================== */
  EX.meca4 = [
    function () {
      const F = rnd(5, 100, 5), d = rnd(1, 20), th = pick([0, 30, 45, 60, 90, 120, 135, 150, 180]), W = F*d*Math.cos(rad(th));
      return { titre: "Travail d'une force constante",
        enonce: R`Une force constante d'intensité $F=${F}$ N déplace son point d'application de $d=${d}$ m en ligne droite. L'angle entre la force et le déplacement vaut $\theta=${th}^\circ$. Calculer le travail de la force.`,
        reponses: [{ nom: "W", unite: "J", val: W, abs: 0.05 }],
        correction: [
          R`$W=\vec F\cdot\vec{AB}=F\,d\cos\theta=${F}\times${d}\times\cos${th}^\circ\approx${N(W)}$ J.`,
          th < 90 ? R`$\theta<90^\circ$ : le travail est moteur ($W>0$).` : th === 90 ? R`La force est perpendiculaire au déplacement : elle ne travaille pas.` : R`$\theta>90^\circ$ : le travail est résistant ($W<0$).`] };
    },
    function () {
      const h = rnd(1, 30), m = rnd(0.1, 5, 0.1), v = Math.sqrt(2*g*h);
      return { titre: "Chute libre et énergie mécanique",
        enonce: R`Un objet de masse $m=${N(m)}$ kg est lâché sans vitesse d'une hauteur $h=${h}$ m. On néglige les frottements ($g=9{,}8$ m/s²). Calculer le travail du poids pendant la chute, puis la vitesse au sol.`,
        reponses: [{ nom: R`W(\vec P)`, unite: "J", val: m*g*h }, { nom: "v", unite: "m/s", val: v }],
        correction: [
          R`$W(\vec P)=mg(z_A-z_B)=mgh=${N(m)}\times9{,}8\times${h}\approx${N(m*g*h)}$ J.`,
          R`Seul le poids travaille : $E_m$ se conserve, $mgh=\tfrac12mv^2$ (la masse se simplifie).`,
          R`$v=\sqrt{2gh}=\sqrt{2\times9{,}8\times${h}}\approx${N(v)}$ m/s.`] };
    },
    function () {
      const k = rnd(20, 500, 10), x = rnd(2, 20) / 100, m = rnd(0.1, 2, 0.1), Ep = 0.5*k*x*x, v = x*Math.sqrt(k/m);
      return { titre: "Énergie potentielle élastique",
        enonce: R`Un ressort de raideur $k=${k}$ N/m est comprimé de $x=${N(x*100)}$ cm par une bille de masse $m=${N(m)}$ kg, sur un plan horizontal sans frottement. On lâche le système. Calculer l'énergie potentielle élastique initiale, puis la vitesse de la bille quand le ressort reprend sa longueur à vide.`,
        reponses: [{ nom: "E_p", unite: "J", val: Ep }, { nom: "v", unite: "m/s", val: v }],
        correction: [
          R`$E_p=\tfrac12kx^2=\tfrac12\times${k}\times${N(x)}^2\approx${N(Ep)}$ J.`,
          R`Conservation de l'énergie mécanique : $\tfrac12kx^2=\tfrac12mv^2$.`,
          R`$v=x\sqrt{k/m}=${N(x)}\times\sqrt{${k}/${N(m)}}\approx${N(v)}$ m/s.`] };
    }
  ];

  /* ===================== ÉLECTRICITÉ 1 : CHARGE ET COULOMB ===================== */
  EX.elec1 = [
    function () {
      const q1 = nz(-9, 9), q2 = nz(-9, 9), d = rnd(1, 30), F = K*Math.abs(q1*q2)*1e-18/(d/100)**2;
      return { titre: "Loi de Coulomb",
        enonce: R`Deux charges ponctuelles $q_1=${q1}$ nC et $q_2=${q2}$ nC sont distantes de $d=${d}$ cm. Calculer l'intensité de la force électrique entre elles ($K=9\times10^9$ SI).`,
        reponses: [{ nom: "F", unite: "N", val: F }],
        correction: [
          R`Conversion : $q_1=${q1}\times10^{-9}$ C, $q_2=${q2}\times10^{-9}$ C, $d=${N(d/100)}$ m.`,
          R`$F=K\dfrac{|q_1q_2|}{d^2}=9\times10^9\times\dfrac{${Math.abs(q1*q2)}\times10^{-18}}{(${N(d/100)})^2}\approx${N(F)}$ N.`,
          q1*q2 > 0 ? "Les charges sont de même signe : la force est répulsive." : "Les charges sont de signes contraires : la force est attractive."] };
    },
    function () {
      const q1 = rnd(-8, 8, 0.2), q2 = rnd(-8, 8, 0.2), qp = (q1 + q2) / 2, n = Math.abs(q1 - qp) * 1e-6 / e;
      return { titre: "Électrisation par contact",
        enonce: R`Deux sphères conductrices identiques portent $q_1=${N(q1)}\ \mu$C et $q_2=${N(q2)}\ \mu$C. On les met en contact, puis on les sépare. Calculer la charge finale de chaque sphère et le nombre d'électrons échangés ($e=1{,}6\times10^{-19}$ C).`,
        reponses: [{ nom: "q'", unite: "µC", val: qp, abs: 0.001 }, { nom: "n", unite: "électrons", val: n, abs: 1e9 }],
        correction: [
          R`Conservation de la charge et symétrie : $q'=\dfrac{q_1+q_2}{2}=\dfrac{${N(q1)}+${sgn(q2)}}{2}=${N(qp)}\ \mu$C pour chaque sphère.`,
          R`La sphère 1 passe de $${N(q1)}$ à $${N(qp)}\ \mu$C : sa charge varie de $${N(qp-q1)}\ \mu$C.`,
          R`$n=\dfrac{|\Delta q|}{e}=\dfrac{${N(Math.abs(qp-q1))}\times10^{-6}}{1{,}6\times10^{-19}}\approx${N(n)}$ électrons.`] };
    },
    function () {
      const q1 = rnd(1, 9), q2 = rnd(1, 9), d = rnd(10, 30, 2), x = rnd(2, d - 2, 1), q3 = 1;
      const Fx = K*q3*1e-9*(q1*1e-9/(x/100)**2 - q2*1e-9/((d - x)/100)**2), xe = d/(1 + Math.sqrt(q2/q1));
      return { titre: "Superposition et position d'équilibre",
        enonce: R`Les charges $q_1=+${q1}$ nC et $q_2=+${q2}$ nC sont fixées en $x=0$ et en $x=${d}$ cm sur l'axe $Ox$. Une charge $q_3=+1$ nC est placée en $x=${x}$ cm. Calculer la composante $F_x$ de la force totale sur $q_3$, puis la position d'équilibre $x_e$ de $q_3$ entre les deux charges.`,
        reponses: [{ nom: "F_x", unite: "N", val: Fx }, { nom: "x_e", unite: "cm", val: xe }],
        correction: [
          R`$q_1$ repousse $q_3$ vers $+x$ : $F_{1,x}=+K\dfrac{q_1q_3}{x^2}$ ; $q_2$ la repousse vers $-x$ : $F_{2,x}=-K\dfrac{q_2q_3}{(d-x)^2}$.`,
          R`$F_x=9\times10^9\times10^{-9}\left(\dfrac{${q1}\times10^{-9}}{${N(x/100)}^2}-\dfrac{${q2}\times10^{-9}}{${N((d-x)/100)}^2}\right)\approx${N(Fx)}$ N.`,
          R`Équilibre : $\dfrac{q_1}{x_e^2}=\dfrac{q_2}{(d-x_e)^2}$, soit $\dfrac{d-x_e}{x_e}=\sqrt{\dfrac{q_2}{q_1}}$, d'où $x_e=\dfrac{d}{1+\sqrt{q_2/q_1}}\approx${N(xe)}$ cm.`] };
    }
  ];

  /* ===================== ÉLECTRICITÉ 2 : CHAMP ET POTENTIEL ===================== */
  EX.elec2 = [
    function () {
      const q = nz(-10, 10), r = rnd(1, 50), V = K*q*1e-9/(r/100), E = K*Math.abs(q)*1e-9/(r/100)**2;
      return { titre: "Champ et potentiel d'une charge ponctuelle",
        enonce: R`Une charge ponctuelle $q=${q}$ nC est placée en $O$. Calculer le potentiel $V$ et l'intensité du champ $E$ en un point situé à $r=${r}$ cm de $O$ ($V=0$ à l'infini).`,
        reponses: [{ nom: "V", unite: "V", val: V }, { nom: "E", unite: "V/m", val: E }],
        correction: [
          R`$V=K\dfrac qr=\dfrac{9\times10^9\times(${q}\times10^{-9})}{${N(r/100)}}\approx${N(V)}$ V.`,
          R`$E=K\dfrac{|q|}{r^2}=\dfrac{9\times10^9\times${Math.abs(q)}\times10^{-9}}{${N(r/100)}^2}\approx${N(E)}$ V/m.`,
          q > 0 ? "Le champ est dirigé en s'éloignant de la charge (q > 0)." : "Le champ est dirigé vers la charge (q < 0)."] };
    },
    function () {
      const Rb = rnd(2, 10), Q = rnd(1, 20), inside = Math.random() < 0.5, r = inside ? rnd(1, Rb - 1) : rnd(Rb + 1, 3*Rb);
      const Rm = Rb/100, rm = r/100, Qc = Q*1e-9, Qi = inside ? Qc*(rm/Rm)**3 : Qc, E = K*Qi/(rm*rm), V = inside ? K*Qc/(2*Rm)*(3 - (rm/Rm)**2) : K*Qc/rm;
      return { titre: "Boule chargée en volume : théorème de Gauss",
        enonce: R`Une boule de rayon $R=${Rb}$ cm porte une charge $Q=${Q}$ nC répartie uniformément dans son volume. On admet que le champ est radial et ne dépend que de $r$. Calculer la charge intérieure à la sphère de Gauss de rayon $r=${r}$ cm, le champ $E(r)$ et le potentiel $V(r)$ ($V=0$ à l'infini).`,
        reponses: [{ nom: R`Q_{\text{int}}`, unite: "nC", val: Qi*1e9 }, { nom: "E(r)", unite: "V/m", val: E }, { nom: "V(r)", unite: "V", val: V }],
        correction: [
          R`Flux à travers la sphère de Gauss : $\Phi=4\pi r^2E(r)=\dfrac{Q_{\text{int}}}{\varepsilon_0}$, donc $E=K\dfrac{Q_{\text{int}}}{r^2}$.`,
          inside ? R`$r<R$ : $Q_{\text{int}}=Q\dfrac{r^3}{R^3}=${Q}\times\left(\dfrac{${r}}{${Rb}}\right)^3\approx${N(Qi*1e9)}$ nC.` : R`$r>R$ : la sphère de Gauss contient toute la charge, $Q_{\text{int}}=Q=${Q}$ nC.`,
          R`$E=\dfrac{9\times10^9\times${N(Qi)}}{${N(rm)}^2}\approx${N(E)}$ V/m.`,
          inside ? R`À l'intérieur : $V(r)=\dfrac{KQ}{2R}\left(3-\dfrac{r^2}{R^2}\right)\approx${N(V)}$ V.` : R`À l'extérieur : $V(r)=\dfrac{KQ}{r}\approx${N(V)}$ V.`] };
    },
    function () {
      const Ra = rnd(2, 15), Q = rnd(1, 20), z = rnd(1, 30), Rm = Ra/100, zm = z/100, r = Math.hypot(Rm, zm), V = K*Q*1e-9/r, E = K*Q*1e-9*zm/r**3;
      return { titre: "Anneau chargé : champ sur l'axe",
        enonce: R`Un anneau de rayon $R=${Ra}$ cm porte une charge $Q=${Q}$ nC répartie uniformément. Calculer le potentiel et le champ en un point $M$ de son axe situé à $z=${z}$ cm du centre.`,
        reponses: [{ nom: "V", unite: "V", val: V }, { nom: "E", unite: "V/m", val: E }],
        correction: [
          R`Tous les points de l'anneau sont à la distance $r=\sqrt{R^2+z^2}=\sqrt{${N(Rm)}^2+${N(zm)}^2}\approx${N(r)}$ m de $M$.`,
          R`$V=\dfrac{KQ}{r}=\dfrac{9\times10^9\times${Q}\times10^{-9}}{${N(r)}}\approx${N(V)}$ V.`,
          R`$E_z=-\dfrac{\dd V}{\dd z}=\dfrac{KQz}{(R^2+z^2)^{3/2}}\approx${N(E)}$ V/m.`] };
    },
    function () {
      const isP = Math.random() < 0.5, VA = rnd(-200, 500, 10), VB = rnd(-200, 500, 10), q = isP ? e : -e, W = q*(VA - VB);
      return { titre: "Travail de la force électrique",
        enonce: R`Un ${isP ? "proton" : "électron"} se déplace d'un point $A$ ($V_A=${VA}$ V) à un point $B$ ($V_B=${VB}$ V). Calculer le travail de la force électrique, en joules puis en électronvolts.`,
        reponses: [{ nom: "W", unite: "J", val: W, abs: 1e-21 }, { nom: "W", unite: "eV", val: W/e, abs: 0.5 }],
        correction: [
          R`$W_{A\to B}=q\,(V_A-V_B)$ avec $q=${isP ? "+" : "-"}1{,}6\times10^{-19}$ C.`,
          R`$W=${isP ? "" : "-"}1{,}6\times10^{-19}\times(${VA}-${sgn(VB)})=${N(W)}$ J.`,
          R`En électronvolts ($1$ eV $=1{,}6\times10^{-19}$ J) : $W=${N(W/e)}$ eV.`,
          W > 0 ? "Le travail est moteur : la particule est accélérée." : W < 0 ? "Le travail est résistant : la particule est freinée." : "Le travail est nul : A et B sont au même potentiel."] };
    }
  ];

  /* ===================== ÉLECTRICITÉ 3 : DIPÔLE ÉLECTROSTATIQUE ===================== */
  EX.elec3 = [
    function () {
      const q = rnd(1, 10), a = rnd(1, 10), r = rnd(10, 50), th = pick([0, 30, 45, 60, 120, 135, 150, 180]);
      const p = q*1e-9*a/1000, rm = r/100, t = th*Math.PI/180, V = K*p*Math.cos(t)/rm**2, E = K*p*Math.sqrt(1 + 3*Math.cos(t)**2)/rm**3;
      return { titre: "Potentiel et champ d'un dipôle",
        enonce: R`Un dipôle est formé de deux charges $\pm q$ avec $q=${q}$ nC, distantes de $a=${a}$ mm. Calculer son moment dipolaire $p$, puis le potentiel $V$ et l'intensité du champ $E$ au point $M$ tel que $\rho=OM=${r}$ cm et $\theta=${th}^\circ$ ($\rho\gg a$).`,
        reponses: [{ nom: "p", unite: "C·m", val: p }, { nom: "V", unite: "V", val: V, abs: 1e-3 }, { nom: "E", unite: "V/m", val: E }],
        correction: [
          R`$p=q\,a=${q}\times10^{-9}\times${N(a/1000)}=${N(p)}$ C$\cdot$m.`,
          R`$V=K\dfrac{p\cos\theta}{\rho^2}=\dfrac{9\times10^9\times${N(p)}\times\cos ${th}^\circ}{${N(rm)}^2}\approx${N(V)}$ V.`,
          R`$E=K\dfrac{p\sqrt{1+3\cos^2\theta}}{\rho^3}=\dfrac{9\times10^9\times${N(p)}\times\sqrt{1+3\cos^2${th}^\circ}}{${N(rm)}^3}\approx${N(E)}$ V/m.`,
          th === 90 ? "" : R`Remarque : $V$ a le signe de $\cos\theta$ ; il est nul dans le plan médiateur.`].filter(Boolean) };
    },
    function () {
      const q = rnd(1, 10), a = rnd(1, 10), r = rnd(10, 40), p = q*1e-9*a/1000, rm = r/100, Ea = 2*K*p/rm**3, Em = K*p/rm**3;
      return { titre: "Positions principales de Gauss",
        enonce: R`Un dipôle ($q=${q}$ nC, $a=${a}$ mm) est étudié à la distance $\rho=${r}$ cm de son centre. Calculer l'intensité du champ sur l'axe du dipôle ($\theta=0$) puis sur sa médiatrice ($\theta=90^\circ$).`,
        reponses: [{ nom: R`E_{\text{axe}}`, unite: "V/m", val: Ea }, { nom: R`E_{\text{médiatrice}}`, unite: "V/m", val: Em }],
        correction: [
          R`$p=q\,a=${N(p)}$ C$\cdot$m.`,
          R`Sur l'axe : $E=K\dfrac{2p}{\rho^3}=\dfrac{9\times10^9\times2\times${N(p)}}{${N(rm)}^3}\approx${N(Ea)}$ V/m, de même sens que $\vec p$.`,
          R`Sur la médiatrice : $E=K\dfrac{p}{\rho^3}\approx${N(Em)}$ V/m, de sens opposé à $\vec p$ : deux fois plus faible que sur l'axe.`] };
    },
    function () {
      const q = rnd(1, 10), a = rnd(1, 10), E = rnd(1, 20), al = pick([30, 45, 60, 90, 120, 150]), p = q*1e-9*a/1000, t = al*Math.PI/180, C = p*E*1000*Math.sin(t), Ep = -p*E*1000*Math.cos(t);
      return { titre: "Dipôle dans un champ uniforme",
        enonce: R`Un dipôle ($q=${q}$ nC, $a=${a}$ mm) est placé dans un champ uniforme $E=${E}$ kV/m ; son moment dipolaire fait l'angle $\alpha=${al}^\circ$ avec $\vec E$. Calculer le moment du couple $C$ et l'énergie potentielle $E_p$ du dipôle.`,
        reponses: [{ nom: "C", unite: "N·m", val: C }, { nom: R`E_p`, unite: "J", val: Ep, abs: 1e-12 }],
        correction: [
          R`$p=q\,a=${N(p)}$ C$\cdot$m ; la résultante des forces est nulle (champ uniforme).`,
          R`$C=pE\sin\alpha=${N(p)}\times${E}\times10^3\times\sin ${al}^\circ\approx${N(C)}$ N$\cdot$m.`,
          R`$E_p=-pE\cos\alpha\approx${N(Ep)}$ J. Le couple tend à ramener $\vec p$ dans le sens de $\vec E$ (équilibre stable pour $\alpha=0$).`] };
    }
  ];

  window.EXOS = EX;
  window.EXO_OUTILS = { R, g, K, e0, rnd, pick, nz, N, deg, rad, vec, sgn };
  window.EXO_TITRES = { meca1: "Chapitre 1 — Calcul vectoriel", meca2: "Chapitre 2 — Cinématique", meca3: "Chapitre 3 — Dynamique", meca4: "Chapitre 4 — Travail et énergie", elec1: "Chapitre 1 — Généralités sur l'électrostatique", elec2: "Chapitre 2 — Champ et potentiel", elec3: "Chapitre 3 — Le dipôle électrostatique" };
})();
