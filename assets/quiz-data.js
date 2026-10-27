/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
window.QUIZ={
"meca1": {
"course": "Mécanique 1",
"title": "Chapitre 1 — Calcul vectoriel",
"qs": [
{
"q": "Quelle est la norme du vecteur $\\vec u=(1\\,;\\,2\\,;\\,2)$ ?",
"c": [
"$5$",
"$3$",
"$\\sqrt5$",
"$9$"
],
"a": 1,
"e": "$\\|\\vec u\\|=\\sqrt{1^2+2^2+2^2}=\\sqrt9=3$.",
"s": "Composantes et cosinus directeurs"
},
{
"q": "Les vecteurs $\\vec u=(1\\,;\\,2\\,;\\,-1)$ et $\\vec v=(3\\,;\\,0\\,;\\,3)$ sont :",
"c": [
"colinéaires",
"orthogonaux",
"de même norme",
"unitaires"
],
"a": 1,
"e": "$\\vec u\\cdot\\vec v=1\\times3+2\\times0+(-1)\\times3=0$ : le produit scalaire est nul, les vecteurs sont orthogonaux.",
"s": "Produit scalaire"
},
{
"q": "Dans une base orthonormée directe, $\\vec j\\wedge\\vec i$ vaut :",
"c": [
"$\\vec k$",
"$-\\vec k$",
"$\\vec 0$",
"$1$"
],
"a": 1,
"e": "$\\vec i\\wedge\\vec j=\\vec k$ et le produit vectoriel est antisymétrique : $\\vec j\\wedge\\vec i=-\\vec i\\wedge\\vec j=-\\vec k$.",
"s": "Produit vectoriel"
},
{
"q": "Pour $\\vec u=(2\\,;\\,-1\\,;\\,0)$ et $\\vec v=(1\\,;\\,1\\,;\\,1)$, le produit vectoriel $\\vec u\\wedge\\vec v$ vaut :",
"c": [
"$(-1\\,;\\,-2\\,;\\,3)$",
"$(1\\,;\\,2\\,;\\,-3)$",
"$(-1\\,;\\,2\\,;\\,3)$",
"$(0\\,;\\,-2\\,;\\,3)$"
],
"a": 0,
"e": "$\\vec u\\wedge\\vec v=(u_yv_z-u_zv_y\\,;\\,u_zv_x-u_xv_z\\,;\\,u_xv_y-u_yv_x)=(-1-0\\,;\\,0-2\\,;\\,2+1)=(-1\\,;\\,-2\\,;\\,3)$.",
"s": "Produit vectoriel"
},
{
"q": "La norme $\\|\\vec u\\wedge\\vec v\\|$ représente :",
"c": [
"le produit des normes",
"l'aire du parallélogramme construit sur $\\vec u$ et $\\vec v$",
"le volume d'un parallélépipède",
"la projection de $\\vec u$ sur $\\vec v$"
],
"a": 1,
"e": "$\\|\\vec u\\wedge\\vec v\\|=\\|\\vec u\\|\\,\\|\\vec v\\|\\,|\\sin\\theta|$ : c'est l'aire du parallélogramme de côtés $\\vec u$ et $\\vec v$.",
"s": "Produit vectoriel"
},
{
"q": "Que vaut $\\vec u\\wedge\\vec u$ ?",
"c": [
"$\\|\\vec u\\|^2$",
"$\\vec 0$",
"$\\vec u$",
"$1$"
],
"a": 1,
"e": "Deux vecteurs colinéaires ont un produit vectoriel nul ($\\sin 0=0$).",
"s": "Produit vectoriel"
},
{
"q": "Le produit mixte $(\\vec u,\\vec v,\\vec w)=(\\vec u\\wedge\\vec v)\\cdot\\vec w$ est nul lorsque :",
"c": [
"les trois vecteurs sont unitaires",
"les trois vecteurs sont coplanaires",
"les trois vecteurs sont orthogonaux deux à deux",
"jamais"
],
"a": 1,
"e": "Le produit mixte donne le volume (algébrique) du parallélépipède construit sur les trois vecteurs ; il est nul s'ils sont dans un même plan.",
"s": "Produit mixte"
},
{
"q": "Les cosinus directeurs d'un vecteur vérifient toujours :",
"c": [
"$\\cos\\alpha+\\cos\\beta+\\cos\\gamma=1$",
"$\\cos^2\\alpha+\\cos^2\\beta+\\cos^2\\gamma=1$",
"$\\cos\\alpha\\cos\\beta\\cos\\gamma=1$",
"$\\cos^2\\alpha+\\cos^2\\beta+\\cos^2\\gamma=3$"
],
"a": 1,
"e": "Ce sont les composantes du vecteur unitaire $\\vec u/\\|\\vec u\\|$, dont la norme vaut $1$.",
"s": "Composantes et cosinus directeurs"
},
{
"q": "Un vecteur $\\vec u(t)$ de norme constante est, à chaque instant :",
"c": [
"colinéaire à sa dérivée",
"orthogonal à sa dérivée",
"constant",
"nul"
],
"a": 1,
"e": "$\\vec u\\cdot\\vec u=\\text{cste}$ ; en dérivant : $2\\,\\vec u\\cdot\\dfrac{\\dd\\vec u}{\\dd t}=0$.",
"s": "Dérivée d'un vecteur"
},
{
"q": "Le moment en $O$ d'une force $\\vec F$ appliquée en $A$, $\\vec{\\mathcal M}_O=\\vec{OA}\\wedge\\vec F$, est nul lorsque :",
"c": [
"$\\vec F$ est perpendiculaire à $\\vec{OA}$",
"la droite d'action de $\\vec F$ passe par $O$",
"$\\|\\vec F\\|=1$",
"$O$ est l'origine du repère"
],
"a": 1,
"e": "Si la droite d'action passe par $O$, $\\vec{OA}$ et $\\vec F$ sont colinéaires et leur produit vectoriel est nul.",
"s": "Moment d'un vecteur"
}
]
},
"meca2": {
"course": "Mécanique 1",
"title": "Chapitre 2 — Cinématique du point",
"qs": [
{
"q": "Un point se déplace selon $x(t)=3t^2-2t$ (SI). Sa vitesse à $t=1$ s vaut :",
"c": [
"$1$ m/s",
"$4$ m/s",
"$6$ m/s",
"$-2$ m/s"
],
"a": 1,
"e": "$v=\\dfrac{\\dd x}{\\dd t}=6t-2$, donc $v(1)=4$ m/s.",
"s": "Mouvement rectiligne"
},
{
"q": "Le mouvement est décéléré (ralenti) lorsque :",
"c": [
"$a<0$",
"$\\vec a\\cdot\\vec v<0$",
"$v<0$",
"$\\vec a=\\vec 0$"
],
"a": 1,
"e": "Il faut comparer les sens de $\\vec a$ et $\\vec v$ : la norme de la vitesse diminue si $\\vec a\\cdot\\vec v<0$, quel que soit le signe de $a$ seul.",
"s": "Mouvement rectiligne"
},
{
"q": "Dans la base de Frenet, l'accélération normale vaut :",
"c": [
"$\\dfrac{\\dd v}{\\dd t}$",
"$\\dfrac{v^2}{R}$",
"$vR$",
"$\\dfrac{R}{v^2}$"
],
"a": 1,
"e": "$\\vec a=\\dfrac{\\dd v}{\\dd t}\\,\\vec u_T+\\dfrac{v^2}{R}\\,\\vec u_N$, où $R$ est le rayon de courbure.",
"s": "Coordonnées intrinsèques (base de Frenet)"
},
{
"q": "Dans un mouvement circulaire uniforme, l'accélération est :",
"c": [
"nulle",
"tangente à la trajectoire",
"dirigée vers le centre (centripète)",
"dirigée vers l'extérieur"
],
"a": 2,
"e": "$v$ est constant donc $a_T=0$ ; il reste $a_N=v^2/R$, dirigée vers le centre.",
"s": "Coordonnées intrinsèques (base de Frenet)"
},
{
"q": "En coordonnées polaires, la vitesse s'écrit :",
"c": [
"$\\dot r\\,\\vec u_r$",
"$\\dot r\\,\\vec u_r+r\\dot\\theta\\,\\vec u_\\theta$",
"$r\\dot\\theta\\,\\vec u_r+\\dot r\\,\\vec u_\\theta$",
"$\\dot r\\,\\vec u_r+\\dot\\theta\\,\\vec u_\\theta$"
],
"a": 1,
"e": "$\\vec{OM}=r\\,\\vec u_r$ et $\\dfrac{\\dd\\vec u_r}{\\dd t}=\\dot\\theta\\,\\vec u_\\theta$, d'où $\\vec v=\\dot r\\,\\vec u_r+r\\dot\\theta\\,\\vec u_\\theta$.",
"s": "Coordonnées polaires"
},
{
"q": "La composante radiale de l'accélération en coordonnées polaires est :",
"c": [
"$\\ddot r$",
"$\\ddot r-r\\dot\\theta^2$",
"$2\\dot r\\dot\\theta+r\\ddot\\theta$",
"$r\\ddot\\theta$"
],
"a": 1,
"e": "$\\vec a=(\\ddot r-r\\dot\\theta^2)\\,\\vec u_r+(2\\dot r\\dot\\theta+r\\ddot\\theta)\\,\\vec u_\\theta$.",
"s": "Coordonnées polaires"
},
{
"q": "En coordonnées cylindriques $(\\rho,\\varphi,z)$, le vecteur position s'écrit :",
"c": [
"$\\rho\\,\\vec u_\\rho+z\\,\\vec k$",
"$\\rho\\,\\vec u_\\rho+\\varphi\\,\\vec u_\\varphi+z\\,\\vec k$",
"$r\\,\\vec u_r$",
"$\\rho\\,\\vec u_\\varphi+z\\,\\vec k$"
],
"a": 0,
"e": "$\\vec{OM}=\\rho\\,\\vec u_\\rho+z\\,\\vec k$ : il n'y a pas de composante selon $\\vec u_\\varphi$.",
"s": "Coordonnées cylindriques"
},
{
"q": "Un point a pour coordonnées $x=2t$ et $y=t^2-1$. Sa trajectoire est :",
"c": [
"une droite",
"un cercle",
"la parabole $y=\\dfrac{x^2}{4}-1$",
"une hyperbole"
],
"a": 2,
"e": "On élimine le temps : $t=x/2$, donc $y=\\dfrac{x^2}{4}-1$.",
"s": "Coordonnées cartésiennes"
},
{
"q": "Un passager marche à $1$ m/s vers l'avant d'un train qui roule à $20$ m/s (translation). Sa vitesse par rapport au sol vaut :",
"c": [
"$19$ m/s",
"$20$ m/s",
"$21$ m/s",
"$\\sqrt{401}$ m/s"
],
"a": 2,
"e": "Composition des vitesses : $\\vec v_a=\\vec v_r+\\vec v_e$, avec deux vitesses de même sens : $1+20=21$ m/s.",
"s": "Mouvement relatif"
},
{
"q": "Le vecteur vitesse est toujours :",
"c": [
"dirigé vers le centre de courbure",
"tangent à la trajectoire",
"perpendiculaire à la trajectoire",
"parallèle à l'accélération"
],
"a": 1,
"e": "$\\vec v=v\\,\\vec u_T$ : la vitesse est portée par la tangente à la trajectoire.",
"s": "Mouvement curviligne"
}
]
},
"meca3": {
"course": "Mécanique 1",
"title": "Chapitre 3 — Dynamique du point matériel",
"qs": [
{
"q": "Selon le principe d'inertie, dans un référentiel galiléen, un point isolé est :",
"c": [
"toujours immobile",
"au repos ou en mouvement rectiligne uniforme",
"en mouvement circulaire uniforme",
"uniformément accéléré"
],
"a": 1,
"e": "Un point isolé (ou pseudo-isolé) a une vitesse constante : repos ou mouvement rectiligne uniforme.",
"s": "Première loi de Newton"
},
{
"q": "Le principe fondamental de la dynamique s'écrit :",
"c": [
"$\\vec p=\\sum\\vec F$",
"$\\dfrac{\\dd\\vec p}{\\dd t}=\\sum\\vec F$",
"$m\\vec v=\\sum\\vec F$",
"$\\sum\\vec F=\\vec 0$"
],
"a": 1,
"e": "La dérivée de la quantité de mouvement $\\vec p=m\\vec v$ est égale à la somme des forces ; à masse constante, $m\\vec a=\\sum\\vec F$.",
"s": "Deuxième loi de Newton"
},
{
"q": "Les forces d'action et de réaction (troisième loi) :",
"c": [
"s'annulent toujours",
"s'exercent sur deux corps différents",
"ont des intensités différentes",
"s'exercent sur le même corps"
],
"a": 1,
"e": "$\\vec F_{A/B}=-\\vec F_{B/A}$ ; comme elles s'appliquent à des corps différents, elles ne s'annulent pas dans le bilan d'un seul corps.",
"s": "Troisième loi de Newton"
},
{
"q": "Un solide glisse sans frottement sur un plan incliné d'angle $\\alpha$. Son accélération vaut :",
"c": [
"$g$",
"$g\\cos\\alpha$",
"$g\\sin\\alpha$",
"$g\\tan\\alpha$"
],
"a": 2,
"e": "La réaction est perpendiculaire au plan ; seule la composante du poids parallèle au plan, $mg\\sin\\alpha$, met le solide en mouvement.",
"s": "Quelques lois de forces"
},
{
"q": "Un bloc reste immobile sur un plan incliné (coefficient de frottement statique $\\mu_s$) tant que :",
"c": [
"$\\tan\\alpha\\le\\mu_s$",
"$\\sin\\alpha\\le\\mu_s$",
"$\\cos\\alpha\\le\\mu_s$",
"$\\alpha\\le\\mu_s$"
],
"a": 0,
"e": "À l'équilibre, $T=mg\\sin\\alpha$ et $N=mg\\cos\\alpha$ ; la condition $T\\le\\mu_sN$ donne $\\tan\\alpha\\le\\mu_s$.",
"s": "Forces de frottement"
},
{
"q": "À l'altitude $h$, le champ de pesanteur vaut $g(h)=g_0\\dfrac{R_T^2}{(R_T+h)^2}$. À $h=R_T$, il vaut :",
"c": [
"$g_0/2$",
"$g_0/4$",
"$2g_0$",
"$g_0$"
],
"a": 1,
"e": "$g(R_T)=g_0\\dfrac{R_T^2}{(2R_T)^2}=\\dfrac{g_0}{4}$.",
"s": "Quelques lois de forces"
},
{
"q": "Le moment cinétique en $O$ d'un point de masse $m$ est :",
"c": [
"$\\vec L_O=m\\vec v\\wedge\\vec{OM}$",
"$\\vec L_O=\\vec{OM}\\wedge m\\vec v$",
"$\\vec L_O=\\vec{OM}\\cdot m\\vec v$",
"$\\vec L_O=m\\,\\vec{OM}$"
],
"a": 1,
"e": "$\\vec L_O=\\vec{OM}\\wedge\\vec p$, et le théorème du moment cinétique s'écrit $\\dfrac{\\dd\\vec L_O}{\\dd t}=\\vec{\\mathcal M}_O(\\vec F)$.",
"s": "Le moment cinétique"
},
{
"q": "Sous l'action d'une force centrale de centre $O$, on peut affirmer que :",
"c": [
"la vitesse est constante",
"le moment cinétique en $O$ est conservé et le mouvement est plan",
"la trajectoire est un cercle",
"l'énergie cinétique est constante"
],
"a": 1,
"e": "Le moment d'une force centrale en $O$ est nul, donc $\\vec L_O$ est constant : le mouvement est plan et suit la loi des aires.",
"s": "Les forces centrales"
},
{
"q": "Une masse $m=0{,}5$ kg est attachée à un ressort de raideur $k=50$ N/m. La pulsation propre vaut :",
"c": [
"$100$ rad/s",
"$10$ rad/s",
"$25$ rad/s",
"$0{,}1$ rad/s"
],
"a": 1,
"e": "$m\\ddot x+kx=0$ donne $\\omega_0=\\sqrt{k/m}=\\sqrt{100}=10$ rad/s (période $T_0=2\\pi/\\omega_0\\approx0{,}63$ s).",
"s": "Les équations différentielles du mouvement"
},
{
"q": "Un corps tombe avec un frottement fluide $\\vec f=-k\\vec v$. Sa vitesse limite vaut :",
"c": [
"$\\dfrac{k}{mg}$",
"$\\dfrac{mg}{k}$",
"$\\sqrt{\\dfrac{mg}{k}}$",
"$mgk$"
],
"a": 1,
"e": "La vitesse limite est atteinte quand l'accélération s'annule : $mg=kv_\\ell$, d'où $v_\\ell=mg/k$.",
"s": "Forces de frottement"
}
]
},
"meca4": {
"course": "Mécanique 1",
"title": "Chapitre 4 — Travail et énergie",
"qs": [
{
"q": "Une force constante de $10$ N déplace son point d'application de $5$ m, l'angle entre la force et le déplacement valant $60^\\circ$. Le travail vaut :",
"c": [
"$50$ J",
"$25$ J",
"$43$ J",
"$0$ J"
],
"a": 1,
"e": "$W=F\\,AB\\cos\\alpha=10\\times5\\times0{,}5=25$ J.",
"s": "Travail d'une force"
},
{
"q": "Le travail du poids entre $A$ et $B$ vaut :",
"c": [
"$mg(z_B-z_A)$",
"$mg(z_A-z_B)$",
"$mg\\,AB$",
"il dépend du chemin suivi"
],
"a": 1,
"e": "$W_{A\\to B}(\\vec P)=mg(z_A-z_B)$ (axe $z$ vers le haut) : il est positif à la descente et ne dépend pas du chemin.",
"s": "Travail de quelques forces usuelles"
},
{
"q": "La réaction normale d'un support fixe sans frottement :",
"c": [
"a un travail toujours positif",
"a un travail nul",
"a un travail toujours négatif",
"a un travail égal à $-mgh$"
],
"a": 1,
"e": "Elle est perpendiculaire au déplacement à chaque instant : $\\vec N\\cdot\\vec{\\dd\\ell}=0$.",
"s": "Travail de quelques forces usuelles"
},
{
"q": "La puissance d'une force $\\vec F$ appliquée à un point de vitesse $\\vec v$ est :",
"c": [
"$\\vec F\\wedge\\vec v$",
"$\\vec F\\cdot\\vec v$",
"$F/v$",
"$\\tfrac12 Fv^2$"
],
"a": 1,
"e": "$\\mathcal P=\\dfrac{\\delta W}{\\dd t}=\\vec F\\cdot\\vec v$, en watts.",
"s": "Puissance d'une force"
},
{
"q": "Le théorème de l'énergie cinétique s'écrit :",
"c": [
"$\\Delta E_c=\\sum W(\\vec F)$",
"$\\Delta E_c=0$",
"$E_c=\\sum\\vec F$",
"$\\Delta E_c=-\\Delta E_p$ toujours"
],
"a": 0,
"e": "La variation d'énergie cinétique est égale à la somme des travaux de toutes les forces (conservatives ou non).",
"s": "Énergie cinétique"
},
{
"q": "Une force est conservative si :",
"c": [
"son travail est toujours nul",
"son travail ne dépend pas du chemin suivi",
"elle est constante",
"elle est perpendiculaire à la vitesse"
],
"a": 1,
"e": "Son travail ne dépend que des points de départ et d'arrivée ; elle dérive alors d'une énergie potentielle : $\\vec F=-\\overrightarrow{\\text{grad}}\\,E_p$.",
"s": "Forces conservatives et énergie potentielle"
},
{
"q": "Un ressort de raideur $k=200$ N/m est allongé de $10$ cm. Son énergie potentielle élastique vaut :",
"c": [
"$20$ J",
"$1$ J",
"$2$ J",
"$10$ J"
],
"a": 1,
"e": "$E_p=\\tfrac12kx^2=\\tfrac12\\times200\\times(0{,}1)^2=1$ J.",
"s": "Forces conservatives et énergie potentielle"
},
{
"q": "Un objet lâché sans vitesse tombe de $5$ m (frottements négligés, $g=9{,}8$ m/s²). Sa vitesse en bas vaut environ :",
"c": [
"$49$ m/s",
"$9{,}9$ m/s",
"$7$ m/s",
"$98$ m/s"
],
"a": 1,
"e": "Conservation de l'énergie mécanique : $mgh=\\tfrac12mv^2$, d'où $v=\\sqrt{2gh}=\\sqrt{98}\\approx9{,}9$ m/s.",
"s": "Énergie mécanique"
},
{
"q": "En présence de frottements, l'énergie mécanique :",
"c": [
"reste constante",
"diminue",
"augmente",
"s'annule"
],
"a": 1,
"e": "$\\Delta E_m=W(\\text{forces non conservatives})<0$ : les frottements dissipent de l'énergie.",
"s": "Énergie mécanique"
},
{
"q": "Une position d'équilibre stable correspond à :",
"c": [
"un maximum de $E_p$",
"un minimum de $E_p$",
"un point où $E_p=0$",
"un point d'inflexion de $E_p$"
],
"a": 1,
"e": "À l'équilibre $\\dfrac{\\dd E_p}{\\dd x}=0$ ; il est stable si $\\dfrac{\\dd^2E_p}{\\dd x^2}>0$ (minimum) : la force ramène le point vers l'équilibre.",
"s": "Équilibre et stabilité"
}
]
},
"elec1": {
"course": "Électricité 1",
"title": "Chapitre 1 — Généralités sur l'électrostatique",
"qs": [
{
"q": "La charge d'un corps est toujours de la forme $q=\\pm ne$. Une charge de $1{,}0\\times10^{-19}$ C est-elle possible ?",
"c": [
"oui",
"non, car elle est plus petite que $e$",
"oui, si le corps est isolant",
"oui, si le corps est conducteur"
],
"a": 1,
"e": "La charge est quantifiée : $1{,}0\\times10^{-19}$ C n'est pas un multiple entier de $e=1{,}6\\times10^{-19}$ C.",
"s": "La charge électrique"
},
{
"q": "Combien d'électrons un corps de charge $-1\\ \\mu$C a-t-il gagnés ?",
"c": [
"$1{,}6\\times10^{13}$",
"$6{,}25\\times10^{12}$",
"$6{,}25\\times10^{18}$",
"$1{,}6\\times10^{-13}$"
],
"a": 1,
"e": "$n=|q|/e=10^{-6}/1{,}6\\times10^{-19}=6{,}25\\times10^{12}$ électrons.",
"s": "La charge électrique"
},
{
"q": "Deux sphères conductrices identiques portant $+6\\ \\mu$C et $-2\\ \\mu$C sont mises en contact puis séparées. Chacune porte alors :",
"c": [
"$+4\\ \\mu$C",
"$+2\\ \\mu$C",
"$+3\\ \\mu$C et $-1\\ \\mu$C",
"$0$"
],
"a": 1,
"e": "La charge totale $+4\\ \\mu$C se partage également : $q'=\\dfrac{q_1+q_2}{2}=+2\\ \\mu$C.",
"s": "Électrisation de la matière"
},
{
"q": "Lors de l'électrisation par influence :",
"c": [
"il y a contact entre les corps",
"les charges se redistribuent sans contact",
"le corps influencé perd toujours des électrons",
"la charge totale n'est pas conservée"
],
"a": 1,
"e": "Le corps chargé approché attire ou repousse les charges mobiles du conducteur, qui se répartissent sans échange de charge.",
"s": "Électrisation de la matière"
},
{
"q": "Dans un conducteur métallique :",
"c": [
"aucune charge ne peut se déplacer",
"des électrons libres peuvent se déplacer",
"les protons se déplacent",
"les charges restent là où on les dépose"
],
"a": 1,
"e": "Les électrons libres des métaux se déplacent dans tout le volume ; dans un isolant, les charges restent localisées.",
"s": "Électrisation de la matière"
},
{
"q": "Un fil de longueur $L$ porte une densité linéique uniforme $\\lambda$. Sa charge totale vaut :",
"c": [
"$\\lambda/L$",
"$\\lambda L$",
"$\\lambda L^2$",
"$\\lambda$"
],
"a": 1,
"e": "$Q=\\int\\lambda\\,\\dd\\ell=\\lambda L$ pour une répartition uniforme.",
"s": "Distributions de charges"
},
{
"q": "La force de Coulomb entre deux charges ponctuelles est :",
"c": [
"proportionnelle à $r$",
"proportionnelle à $1/r$",
"proportionnelle à $1/r^2$",
"indépendante de $r$"
],
"a": 2,
"e": "$F=K\\dfrac{|q_1q_2|}{r^2}$ avec $K=\\dfrac{1}{4\\pi\\varepsilon_0}=9\\times10^9$ SI.",
"s": "Force électrostatique : loi de Coulomb"
},
{
"q": "On divise par $3$ la distance entre deux charges. La force est :",
"c": [
"divisée par $3$",
"multipliée par $3$",
"multipliée par $9$",
"divisée par $9$"
],
"a": 2,
"e": "$F\\propto1/r^2$ : si $r$ est divisé par $3$, $r^2$ est divisé par $9$ et $F$ est multipliée par $9$.",
"s": "Force électrostatique : loi de Coulomb"
},
{
"q": "Deux charges de même signe :",
"c": [
"s'attirent",
"se repoussent",
"n'interagissent pas",
"s'attirent si elles sont proches"
],
"a": 1,
"e": "Charges de même signe : répulsion ; de signes contraires : attraction.",
"s": "Force électrostatique : loi de Coulomb"
},
{
"q": "La force exercée par plusieurs charges sur une charge $q$ s'obtient :",
"c": [
"en additionnant les intensités",
"en additionnant vectoriellement les forces dues à chaque charge",
"en prenant la plus grande force",
"en multipliant les forces"
],
"a": 1,
"e": "Principe de superposition : $\\vec F=\\sum\\vec F_i$ ; on additionne les composantes, pas les intensités.",
"s": "Principe de superposition"
}
]
},
"elec2": {
"course": "Électricité 1",
"title": "Chapitre 2 — Champ et potentiel",
"qs": [
{
"q": "Le champ électrostatique créé par une charge ponctuelle positive est :",
"c": [
"dirigé vers la charge",
"dirigé en s'éloignant de la charge",
"perpendiculaire à la droite charge–point",
"nul"
],
"a": 1,
"e": "$\\vec E=K\\dfrac{q}{r^2}\\,\\vec u$, avec $\\vec u$ dirigé de la charge vers le point : pour $q>0$, le champ « sort » de la charge.",
"s": "Le champ électrostatique"
},
{
"q": "Le potentiel créé à $9$ cm d'une charge $q=1$ nC vaut :",
"c": [
"$1$ V",
"$100$ V",
"$1000$ V",
"$11$ V"
],
"a": 1,
"e": "$V=K\\dfrac qr=\\dfrac{9\\times10^9\\times10^{-9}}{0{,}09}=100$ V.",
"s": "Le potentiel électrostatique"
},
{
"q": "La relation entre champ et potentiel est :",
"c": [
"$\\vec E=\\overrightarrow{\\text{grad}}\\,V$",
"$\\vec E=-\\overrightarrow{\\text{grad}}\\,V$",
"$V=-\\overrightarrow{\\text{grad}}\\,\\vec E$",
"$\\vec E=V\\,\\vec u$"
],
"a": 1,
"e": "$\\vec E=-\\overrightarrow{\\text{grad}}\\,V$ : le champ est dirigé vers les potentiels décroissants.",
"s": "Le potentiel électrostatique"
},
{
"q": "Les surfaces équipotentielles sont :",
"c": [
"parallèles aux lignes de champ",
"perpendiculaires aux lignes de champ",
"confondues avec les lignes de champ",
"sans lien avec les lignes de champ"
],
"a": 1,
"e": "Sur une équipotentielle $\\dd V=-\\vec E\\cdot\\vec{\\dd\\ell}=0$ : tout déplacement sur elle est perpendiculaire à $\\vec E$.",
"s": "Propriétés du champ et du potentiel"
},
{
"q": "Le travail de la force électrique sur une charge $q$ allant de $A$ à $B$ vaut :",
"c": [
"$q(V_B-V_A)$",
"$q(V_A-V_B)$",
"$qE\\,AB$ dans tous les cas",
"$0$"
],
"a": 1,
"e": "$W_{A\\to B}=q(V_A-V_B)$ : il ne dépend que des potentiels de départ et d'arrivée.",
"s": "Le potentiel électrostatique"
},
{
"q": "Au milieu de deux charges égales $+q$, on a :",
"c": [
"$\\vec E=\\vec0$ et $V=0$",
"$\\vec E=\\vec0$ et $V\\neq0$",
"$\\vec E\\neq\\vec0$ et $V=0$",
"$\\vec E\\neq\\vec0$ et $V\\neq0$"
],
"a": 1,
"e": "Les deux champs sont opposés et s'annulent, mais les potentiels (scalaires positifs) s'ajoutent : $V=2Kq/d\\neq0$.",
"s": "Champ et potentiel créés par plusieurs charges ponctuelles"
},
{
"q": "L'angle solide sous lequel on voit tout l'espace depuis un point vaut :",
"c": [
"$2\\pi$ sr",
"$4\\pi$ sr",
"$\\pi$ sr",
"$360$ sr"
],
"a": 1,
"e": "C'est l'aire de la sphère unité : $4\\pi\\times1^2=4\\pi$ sr.",
"s": "Angle solide"
},
{
"q": "Le théorème de Gauss s'écrit :",
"c": [
"$\\oint\\vec E\\cdot\\vec{\\dd S}=Q_{\\text{int}}\\,\\varepsilon_0$",
"$\\oint\\vec E\\cdot\\vec{\\dd S}=\\dfrac{Q_{\\text{int}}}{\\varepsilon_0}$",
"$\\oint\\vec E\\cdot\\vec{\\dd S}=\\dfrac{Q_{\\text{tot}}}{\\varepsilon_0}$",
"$\\oint\\vec E\\cdot\\vec{\\dd S}=0$"
],
"a": 1,
"e": "Le flux sortant d'une surface fermée est égal à la charge intérieure divisée par $\\varepsilon_0$ ; les charges extérieures ne contribuent pas au flux.",
"s": "Flux du champ et théorème de Gauss"
},
{
"q": "Pour une boule uniformément chargée, à l'intérieur ($r<R$), le champ :",
"c": [
"est nul",
"est proportionnel à $r$",
"est proportionnel à $1/r^2$",
"est constant"
],
"a": 1,
"e": "La charge intérieure vaut $Q\\,r^3/R^3$ et le théorème de Gauss donne $E=\\dfrac{\\rho\\,r}{3\\varepsilon_0}$ (voir le TD, exercice 10).",
"s": "Flux du champ et théorème de Gauss"
},
{
"q": "La forme locale du théorème de Gauss est :",
"c": [
"$\\text{div}\\,\\vec E=\\rho\\,\\varepsilon_0$",
"$\\text{div}\\,\\vec E=\\dfrac{\\rho}{\\varepsilon_0}$",
"$\\Delta V=\\dfrac{\\rho}{\\varepsilon_0}$",
"$\\overrightarrow{\\text{grad}}\\,V=\\rho$"
],
"a": 1,
"e": "$\\text{div}\\,\\vec E=\\dfrac{\\rho}{\\varepsilon_0}$ ; avec $\\vec E=-\\overrightarrow{\\text{grad}}\\,V$, on obtient l'équation de Poisson $\\Delta V+\\dfrac{\\rho}{\\varepsilon_0}=0$.",
"s": "Forme locale : équations de Poisson et de Laplace"
}
]
},
"elec3": {
"course": "Électricité 1",
"title": "Chapitre 3 — Le dipôle électrostatique",
"qs": [
{
"q": "Le moment dipolaire $\\vec p$ d'un dipôle $(-q\\text{ en }A\\,;\\,+q\\text{ en }B)$ est :",
"c": [
"$\\vec p=q\\,\\vec{BA}$",
"$\\vec p=q\\,\\vec{AB}$, dirigé de $-q$ vers $+q$",
"$\\vec p=2q\\,\\vec{AB}$",
"un scalaire égal à $q/a$"
],
"a": 1,
"e": "$\\vec p=q\\,\\vec{AB}$ : il va de la charge négative vers la charge positive.",
"s": "Définitions"
},
{
"q": "Dans le Système international, le moment dipolaire s'exprime en :",
"c": [
"C/m",
"C·m",
"V·m",
"N·m"
],
"a": 1,
"e": "$p=q\\,a$ : coulomb × mètre.",
"s": "Définitions"
},
{
"q": "À grande distance, le potentiel d'un dipôle varie comme :",
"c": [
"$1/\\rho$",
"$1/\\rho^2$",
"$1/\\rho^3$",
"$\\rho$"
],
"a": 1,
"e": "$V=\\dfrac{p\\cos\\theta}{4\\pi\\varepsilon_0\\rho^2}$ : les deux charges opposées se compensent presque, d'où une décroissance plus rapide qu'en $1/\\rho$.",
"s": "Potentiel créé à grande distance"
},
{
"q": "À grande distance, l'intensité du champ d'un dipôle varie comme :",
"c": [
"$1/\\rho$",
"$1/\\rho^2$",
"$1/\\rho^3$",
"$1/\\rho^4$"
],
"a": 2,
"e": "$E=\\dfrac{p\\sqrt{1+3\\cos^2\\theta}}{4\\pi\\varepsilon_0\\rho^3}$.",
"s": "Champ créé à grande distance"
},
{
"q": "Dans le plan médiateur du dipôle ($\\theta=\\pi/2$) :",
"c": [
"$V=0$ et $E=0$",
"$V=0$ mais $E\\neq0$",
"$V\\neq0$ et $E=0$",
"$V$ est maximal"
],
"a": 1,
"e": "$\\cos\\theta=0$ donne $V=0$, mais $E_\\theta=\\dfrac{p}{4\\pi\\varepsilon_0\\rho^3}\\neq0$.",
"s": "Positions principales de Gauss"
},
{
"q": "Les composantes polaires du champ d'un dipôle sont :",
"c": [
"$E_\\rho=\\dfrac{p\\sin\\theta}{4\\pi\\varepsilon_0\\rho^3}$, $E_\\theta=\\dfrac{2p\\cos\\theta}{4\\pi\\varepsilon_0\\rho^3}$",
"$E_\\rho=\\dfrac{2p\\cos\\theta}{4\\pi\\varepsilon_0\\rho^3}$, $E_\\theta=\\dfrac{p\\sin\\theta}{4\\pi\\varepsilon_0\\rho^3}$",
"$E_\\rho=\\dfrac{p\\cos\\theta}{4\\pi\\varepsilon_0\\rho^2}$, $E_\\theta=0$",
"$E_\\rho=E_\\theta$"
],
"a": 1,
"e": "$E_\\rho=-\\dfrac{\\partial V}{\\partial\\rho}$ et $E_\\theta=-\\dfrac1\\rho\\dfrac{\\partial V}{\\partial\\theta}$.",
"s": "Champ créé à grande distance"
},
{
"q": "Sur l'axe du dipôle (première position de Gauss), à la distance $\\rho$, le champ vaut :",
"c": [
"$-\\dfrac{\\vec p}{4\\pi\\varepsilon_0\\rho^3}$",
"$\\dfrac{2\\vec p}{4\\pi\\varepsilon_0\\rho^3}$",
"$\\dfrac{\\vec p}{4\\pi\\varepsilon_0\\rho^2}$",
"$\\vec 0$"
],
"a": 1,
"e": "Pour $\\theta=0$ ou $\\pi$, $E_\\theta=0$ et $\\vec E=\\dfrac{2\\vec p}{4\\pi\\varepsilon_0\\rho^3}$ (même sens que $\\vec p$).",
"s": "Positions principales de Gauss"
},
{
"q": "L'angle $\\varphi$ entre $\\vec E$ et $\\vec{OM}$ vérifie :",
"c": [
"$\\tan\\varphi=2\\tan\\theta$",
"$\\tan\\varphi=\\tfrac12\\tan\\theta$",
"$\\varphi=\\theta$",
"$\\varphi=\\pi/2$"
],
"a": 1,
"e": "$\\tan\\varphi=\\dfrac{E_\\theta}{E_\\rho}=\\dfrac{\\sin\\theta}{2\\cos\\theta}$.",
"s": "Champ créé à grande distance"
},
{
"q": "Un dipôle placé dans un champ uniforme $\\vec E$ subit :",
"c": [
"une force $q\\vec E$",
"un couple de moment $\\vec C=\\vec p\\wedge\\vec E$ et une résultante nulle",
"une force $\\vec p\\cdot\\vec E$",
"aucune action"
],
"a": 1,
"e": "Les forces $-q\\vec E$ et $+q\\vec E$ sont opposées : résultante nulle, mais elles forment un couple $\\vec p\\wedge\\vec E$.",
"s": "Action d'un champ extérieur"
},
{
"q": "Dans un champ uniforme, la position d'équilibre stable du dipôle est :",
"c": [
"$\\vec p$ perpendiculaire à $\\vec E$",
"$\\vec p$ de même sens que $\\vec E$",
"$\\vec p$ de sens opposé à $\\vec E$",
"n'importe quelle orientation"
],
"a": 1,
"e": "$E_p=-\\vec p\\cdot\\vec E$ est minimale quand $\\vec p$ et $\\vec E$ ont le même sens.",
"s": "Action d'un champ extérieur"
}
]
}
};

/* ===================== OPTIQUE ===================== */
Object.assign(window.QUIZ, {
"opt1": {
"course": "Optique 1",
"title": "Chapitre 1 — Lois fondamentales de l'optique géométrique",
"qs": [
{
"q": "Dans un verre d'indice $n=1{,}5$, la lumière se propage à la vitesse :",
"c": [
"$4{,}5\\times10^8$ m/s",
"$2{,}0\\times10^8$ m/s",
"$3{,}0\\times10^8$ m/s",
"$1{,}5\\times10^8$ m/s"
],
"a": 1,
"e": "$v=\\dfrac cn=\\dfrac{3{,}0\\times10^8}{1{,}5}=2{,}0\\times10^8$ m/s : la lumière est plus lente dans un milieu plus réfringent.",
"s": "Indice de réfraction"
},
{
"q": "Une radiation de longueur d'onde $\\lambda_0=600$ nm dans le vide entre dans l'eau ($n=1{,}33$). Sa longueur d'onde dans l'eau vaut :",
"c": [
"$798$ nm",
"$600$ nm",
"$451$ nm",
"$300$ nm"
],
"a": 2,
"e": "La fréquence ne change pas ; la vitesse est divisée par $n$, donc $\\lambda=\\dfrac{\\lambda_0}{n}=\\dfrac{600}{1{,}33}\\approx451$ nm.",
"s": "Indice de réfraction"
},
{
"q": "Quand la lumière passe de l'air dans l'eau, ce qui ne change pas est :",
"c": [
"la vitesse",
"la longueur d'onde",
"la fréquence",
"la direction de propagation (quelle que soit l'incidence)"
],
"a": 2,
"e": "La fréquence est imposée par la source ; vitesse et longueur d'onde sont divisées par l'indice.",
"s": "Indice de réfraction"
},
{
"q": "Un rayon passe de l'air dans un verre d'indice $1{,}5$ sous l'incidence $i_1=30^\\circ$. L'angle de réfraction vaut environ :",
"c": [
"$45^\\circ$",
"$19{,}5^\\circ$",
"$30^\\circ$",
"$20^\\circ$ exactement"
],
"a": 1,
"e": "$\\sin i_2=\\dfrac{\\sin30^\\circ}{1{,}5}=0{,}333$, d'où $i_2\\approx19{,}5^\\circ$ : le rayon se rapproche de la normale.",
"s": "Lois de Snell-Descartes"
},
{
"q": "L'angle critique (réflexion totale) pour le dioptre verre ($n=1{,}5$) – air vaut environ :",
"c": [
"$41{,}8^\\circ$",
"$48{,}6^\\circ$",
"$30^\\circ$",
"$90^\\circ$"
],
"a": 0,
"e": "$\\sin\\lambda=\\dfrac{n_2}{n_1}=\\dfrac1{1{,}5}$, d'où $\\lambda\\approx41{,}8^\\circ$.",
"s": "Réflexion totale"
},
{
"q": "La réflexion totale se produit lorsque :",
"c": [
"$n_1<n_2$ et $i_1>\\lambda$",
"$n_1>n_2$ et $i_1>\\lambda$",
"$n_1>n_2$ et $i_1<\\lambda$",
"$i_1=0$"
],
"a": 1,
"e": "Il faut passer vers un milieu moins réfringent ($n_1>n_2$) sous une incidence supérieure à l'angle critique $\\lambda$.",
"s": "Réflexion totale"
},
{
"q": "Le chemin optique d'un rayon qui traverse $2$ cm de verre ($n=1{,}5$) vaut :",
"c": [
"$2$ cm",
"$1{,}33$ cm",
"$3$ cm",
"$0{,}75$ cm"
],
"a": 2,
"e": "$L=n\\,d=1{,}5\\times2=3$ cm : c'est la distance que la lumière parcourrait dans le vide pendant la même durée.",
"s": "Chemin optique et Fermat"
},
{
"q": "D'après le principe de Fermat, le trajet suivi par la lumière entre deux points rend le chemin optique :",
"c": [
"maximal",
"stationnaire (en général minimal)",
"égal à la distance géométrique",
"nul"
],
"a": 1,
"e": "Le chemin optique est stationnaire : une petite variation du trajet ne le modifie pas au premier ordre (il est le plus souvent minimal).",
"s": "Chemin optique et Fermat"
},
{
"q": "Dans un prisme de verre, la radiation la plus déviée est :",
"c": [
"le rouge",
"le vert",
"le violet",
"elles sont toutes déviées de la même façon"
],
"a": 2,
"e": "L'indice du verre est plus grand pour le violet ($n$ décroît avec $\\lambda$) : le violet est le plus dévié.",
"s": "Dispersion"
},
{
"q": "Une fibre optique a un cœur d'indice $1{,}48$ et une gaine d'indice $1{,}46$. Son ouverture numérique $\\sqrt{n_c^2-n_g^2}$ vaut environ :",
"c": [
"$0{,}02$",
"$0{,}24$",
"$1{,}0$",
"$0{,}5$"
],
"a": 1,
"e": "$ON=\\sqrt{1{,}48^2-1{,}46^2}=\\sqrt{0{,}0588}\\approx0{,}24$ : l'angle d'acceptance vaut $\\arcsin0{,}24\\approx14^\\circ$.",
"s": "Fibre optique"
}
]
},
"opt2": {
"course": "Optique 1",
"title": "Chapitre 2 — Formation des images et systèmes plans",
"qs": [
{
"q": "Une image est réelle lorsque :",
"c": [
"les rayons émergents divergent",
"les rayons émergents convergent réellement en $A'$ : on peut la recueillir sur un écran",
"elle est droite",
"elle est plus grande que l'objet"
],
"a": 1,
"e": "Image réelle : les rayons émergents passent réellement par $A'$. Image virtuelle : seuls leurs prolongements y passent.",
"s": "Objet et image"
},
{
"q": "Le seul système rigoureusement stigmatique pour tous les points de l'espace est :",
"c": [
"la lentille mince",
"le dioptre plan",
"le miroir plan",
"le miroir sphérique"
],
"a": 2,
"e": "L'image d'un point par un miroir plan est son symétrique : tous les rayons réfléchis semblent venir exactement de ce point.",
"s": "Stigmatisme"
},
{
"q": "Les conditions de Gauss imposent des rayons :",
"c": [
"parallèles à l'axe uniquement",
"peu inclinés et proches de l'axe (paraxiaux)",
"très inclinés",
"passant tous par le foyer"
],
"a": 1,
"e": "Rayons paraxiaux : stigmatisme et aplanétisme approchés, et approximation $\\sin\\theta\\approx\\tan\\theta\\approx\\theta$.",
"s": "Conditions de Gauss"
},
{
"q": "Une personne se tient à $2$ m d'un miroir plan. La distance entre la personne et son image vaut :",
"c": [
"$2$ m",
"$1$ m",
"$4$ m",
"$0$ m"
],
"a": 2,
"e": "$\\overline{HA'}=-\\overline{HA}$ : l'image est à $2$ m derrière le miroir, donc à $4$ m de la personne.",
"s": "Miroir plan"
},
{
"q": "Le grandissement transversal d'un miroir plan vaut :",
"c": [
"$-1$",
"$+1$",
"$0$",
"$+2$"
],
"a": 1,
"e": "L'image est symétrique de l'objet : même taille, même sens, $\\gamma=+1$ (mais inversion gauche-droite).",
"s": "Miroir plan"
},
{
"q": "Un caillou est à $1{,}20$ m au fond d'une eau calme ($n=1{,}33$). Vu presque à la verticale, il paraît à la profondeur :",
"c": [
"$1{,}60$ m",
"$1{,}20$ m",
"$0{,}90$ m",
"$0{,}60$ m"
],
"a": 2,
"e": "Dioptre plan dans les conditions de Gauss : $h'=\\dfrac hn=\\dfrac{1{,}20}{1{,}33}\\approx0{,}90$ m.",
"s": "Dioptre plan"
},
{
"q": "Une lentille de distance focale image $f'=25$ cm a pour vergence :",
"c": [
"$0{,}25$ δ",
"$25$ δ",
"$4$ δ",
"$-4$ δ"
],
"a": 2,
"e": "$V=\\dfrac1{f'}=\\dfrac1{0{,}25\\ \\text{m}}=4$ δ (dioptries).",
"s": "Foyers et vergence"
},
{
"q": "Pour se voir en entier dans un miroir plan vertical, une personne de $1{,}80$ m a besoin d'un miroir d'au moins :",
"c": [
"$1{,}80$ m",
"$0{,}90$ m",
"$0{,}60$ m",
"cela dépend de sa distance au miroir"
],
"a": 1,
"e": "Les points de réflexion utiles sont à mi-hauteur entre l'œil et chaque extrémité du corps : la moitié de la taille, quelle que soit la distance.",
"s": "Miroir plan"
},
{
"q": "La relation de conjugaison du dioptre plan dans les conditions de Gauss s'écrit :",
"c": [
"$n_1\\,\\overline{HA'}=n_2\\,\\overline{HA}$",
"$\\dfrac{\\overline{HA'}}{n_2}=\\dfrac{\\overline{HA}}{n_1}$",
"$\\overline{HA'}=-\\overline{HA}$",
"$\\overline{HA'}=\\overline{HA}$"
],
"a": 1,
"e": "$\\dfrac{\\overline{HA'}}{n_2}=\\dfrac{\\overline{HA}}{n_1}$, $n_1$ étant l'indice du milieu de l'objet.",
"s": "Dioptre plan"
},
{
"q": "Une image virtuelle :",
"c": [
"ne peut pas être vue",
"peut être vue à l'œil mais pas recueillie sur un écran",
"se forme toujours sur l'écran",
"est toujours renversée"
],
"a": 1,
"e": "L'œil reçoit des rayons qui semblent venir de $A'$ et la voit ; aucun rayon ne passe réellement par $A'$, donc pas d'image sur un écran.",
"s": "Objet et image"
}
]
},
"opt3": {
"course": "Optique 1",
"title": "Chapitre 3 — Prisme et lame à faces parallèles",
"qs": [
{
"q": "Dans un prisme d'angle $A$, les angles de réfraction intérieurs vérifient :",
"c": [
"$A=r-r'$",
"$A=r+r'$",
"$A=r\\,r'$",
"$A=2r$ toujours"
],
"a": 1,
"e": "Dans le quadrilatère formé par l'arête et les normales, on obtient $r+r'=A$.",
"s": "Formules du prisme"
},
{
"q": "La déviation d'un rayon par un prisme vaut :",
"c": [
"$D=i+i'+A$",
"$D=i-i'$",
"$D=i+i'-A$",
"$D=(n-1)i$"
],
"a": 2,
"e": "$D=(i-r)+(i'-r')=i+i'-(r+r')=i+i'-A$.",
"s": "Formules du prisme"
},
{
"q": "Au minimum de déviation :",
"c": [
"$i=0$",
"la marche du rayon est symétrique : $i=i'$ et $r=r'=A/2$",
"$i'=90^\\circ$",
"$r=0$"
],
"a": 1,
"e": "La déviation est minimale pour une marche symétrique : $i=i'=i_m$, $r=r'=\\dfrac A2$, $D_m=2i_m-A$.",
"s": "Minimum de déviation"
},
{
"q": "Un prisme d'angle $A=60^\\circ$ présente une déviation minimale $D_m=37{,}2^\\circ$. Son indice vaut :",
"c": [
"$1{,}33$",
"$1{,}50$",
"$1{,}62$",
"$1{,}20$"
],
"a": 1,
"e": "$n=\\dfrac{\\sin\\frac{A+D_m}2}{\\sin\\frac A2}=\\dfrac{\\sin48{,}6^\\circ}{\\sin30^\\circ}=\\dfrac{0{,}750}{0{,}500}=1{,}50$.",
"s": "Minimum de déviation"
},
{
"q": "Un prisme mince d'angle $A=4^\\circ$ et d'indice $1{,}5$ dévie la lumière de :",
"c": [
"$6^\\circ$",
"$4^\\circ$",
"$2^\\circ$",
"$1{,}5^\\circ$"
],
"a": 2,
"e": "Pour un prisme mince : $D\\approx(n-1)A=0{,}5\\times4^\\circ=2^\\circ$, quelle que soit l'incidence (faible).",
"s": "Prisme mince"
},
{
"q": "Aucun rayon ne peut traverser un prisme si :",
"c": [
"$A>2\\lambda$ ($\\lambda$ : angle critique)",
"$A<\\lambda$",
"$n<1$",
"$A=60^\\circ$"
],
"a": 0,
"e": "Il faut $r'=A-r\\le\\lambda$ avec $r\\le\\lambda$ : c'est impossible si $A>2\\lambda$.",
"s": "Conditions d'émergence"
},
{
"q": "Dans l'air, un prisme dévie toujours la lumière :",
"c": [
"vers son arête",
"vers sa base",
"parallèlement à sa base",
"cela dépend de la couleur"
],
"a": 1,
"e": "À l'entrée le rayon se rapproche de la normale, à la sortie il s'en écarte : les deux rotations se font vers la base.",
"s": "Formules du prisme"
},
{
"q": "Un rayon qui traverse une lame à faces parallèles ressort :",
"c": [
"dévié de l'angle $A$",
"parallèle au rayon incident, simplement décalé",
"perpendiculaire à la lame",
"confondu avec le rayon incident"
],
"a": 1,
"e": "Les deux faces sont parallèles : $i'=i$. Le rayon est seulement déplacé latéralement de $d=e\\,\\dfrac{\\sin(i-r)}{\\cos r}$.",
"s": "Lame à faces parallèles"
},
{
"q": "Un bloc de verre ($n=1{,}5$) d'épaisseur $3$ cm rapproche l'image d'un objet (conditions de Gauss) de :",
"c": [
"$3$ cm",
"$2$ cm",
"$1$ cm",
"$4{,}5$ cm"
],
"a": 2,
"e": "$\\overline{AA'}=e\\left(1-\\dfrac1n\\right)=3\\times\\left(1-\\dfrac1{1{,}5}\\right)=1$ cm.",
"s": "Lame à faces parallèles"
},
{
"q": "Un prisme décompose la lumière blanche parce que :",
"c": [
"il réfléchit les couleurs différemment",
"l'indice du verre dépend de la longueur d'onde",
"il absorbe certaines couleurs",
"la lumière blanche est polarisée"
],
"a": 1,
"e": "$n$ dépend de $\\lambda$ (loi de Cauchy) : chaque radiation est déviée d'un angle différent.",
"s": "Dispersion"
}
]
},
"opt4": {
"course": "Optique 1",
"title": "Chapitre 4 — Miroirs et dioptres sphériques",
"qs": [
{
"q": "Pour un miroir concave de rayon $|R|=40$ cm, la distance focale $\\overline{SF}$ vaut :",
"c": [
"$-40$ cm",
"$-20$ cm",
"$+20$ cm",
"$-80$ cm"
],
"a": 1,
"e": "$\\overline{SF}=\\dfrac{\\overline{SC}}2=\\dfrac{-40}2=-20$ cm : le foyer est réel, au milieu de $[SC]$.",
"s": "Miroir sphérique"
},
{
"q": "La relation de conjugaison du miroir sphérique (origine au sommet) s'écrit :",
"c": [
"$\\dfrac1{\\overline{SA'}}-\\dfrac1{\\overline{SA}}=\\dfrac2{\\overline{SC}}$",
"$\\dfrac1{\\overline{SA'}}+\\dfrac1{\\overline{SA}}=\\dfrac2{\\overline{SC}}$",
"$\\overline{SA'}=-\\overline{SA}$",
"$\\dfrac1{\\overline{SA'}}+\\dfrac1{\\overline{SA}}=\\dfrac1{\\overline{SC}}$"
],
"a": 1,
"e": "$\\dfrac1{\\overline{SA'}}+\\dfrac1{\\overline{SA}}=\\dfrac2{\\overline{SC}}=\\dfrac1{\\overline{SF}}$.",
"s": "Miroir sphérique"
},
{
"q": "Un miroir convexe donne d'un objet réel une image :",
"c": [
"réelle et renversée",
"virtuelle, droite et réduite",
"virtuelle, droite et agrandie",
"réelle et agrandie"
],
"a": 1,
"e": "Le miroir convexe est divergent : l'image d'un objet réel est toujours virtuelle, droite et réduite (rétroviseurs).",
"s": "Miroir sphérique"
},
{
"q": "Miroir concave ($\\overline{SC}=-40$ cm), objet en $\\overline{SA}=-60$ cm. L'image est en :",
"c": [
"$\\overline{SA'}=-30$ cm",
"$\\overline{SA'}=+30$ cm",
"$\\overline{SA'}=-120$ cm",
"$\\overline{SA'}=-24$ cm"
],
"a": 0,
"e": "$\\dfrac1{\\overline{SA'}}=\\dfrac2{-40}-\\dfrac1{-60}=-\\dfrac1{30}$, donc $\\overline{SA'}=-30$ cm : image réelle, devant le miroir.",
"s": "Miroir sphérique"
},
{
"q": "Le grandissement d'un miroir sphérique vaut :",
"c": [
"$\\gamma=\\dfrac{\\overline{SA'}}{\\overline{SA}}$",
"$\\gamma=-\\dfrac{\\overline{SA'}}{\\overline{SA}}$",
"$\\gamma=\\dfrac{\\overline{SA}}{\\overline{SA'}}$",
"$\\gamma=+1$"
],
"a": 1,
"e": "Le rayon qui frappe le sommet se réfléchit symétriquement par rapport à l'axe, d'où $\\gamma=-\\dfrac{\\overline{SA'}}{\\overline{SA}}$.",
"s": "Grandissement"
},
{
"q": "La relation de conjugaison du dioptre sphérique s'écrit :",
"c": [
"$\\dfrac{n_2}{\\overline{SA'}}-\\dfrac{n_1}{\\overline{SA}}=\\dfrac{n_2-n_1}{\\overline{SC}}$",
"$\\dfrac{n_1}{\\overline{SA'}}-\\dfrac{n_2}{\\overline{SA}}=\\dfrac{n_2-n_1}{\\overline{SC}}$",
"$\\dfrac1{\\overline{SA'}}+\\dfrac1{\\overline{SA}}=\\dfrac2{\\overline{SC}}$",
"$\\dfrac{n_2}{\\overline{SA'}}=\\dfrac{n_1}{\\overline{SA}}$"
],
"a": 0,
"e": "Relation de Descartes du dioptre sphérique ; pour $\\overline{SC}\\to\\infty$ on retrouve le dioptre plan.",
"s": "Dioptre sphérique"
},
{
"q": "Un dioptre air → verre ($n=1{,}5$) a pour rayon $\\overline{SC}=+5$ cm. Sa vergence vaut :",
"c": [
"$+5$ δ",
"$+10$ δ",
"$-10$ δ",
"$+30$ δ"
],
"a": 1,
"e": "$V=\\dfrac{n_2-n_1}{\\overline{SC}}=\\dfrac{0{,}5}{0{,}05}=10$ δ : dioptre convergent.",
"s": "Dioptre sphérique"
},
{
"q": "Pour un miroir sphérique, un rayon incident passant par le centre $C$ :",
"c": [
"se réfléchit parallèlement à l'axe",
"revient sur lui-même",
"passe par le foyer",
"n'est pas réfléchi"
],
"a": 1,
"e": "Il arrive selon un rayon de la sphère, donc selon la normale : il est réfléchi sur lui-même.",
"s": "Construction des images"
},
{
"q": "La relation de Newton du miroir sphérique s'écrit :",
"c": [
"$\\overline{FA}\\cdot\\overline{FA'}=\\overline{SF}^{\\,2}$",
"$\\overline{FA}\\cdot\\overline{FA'}=-\\overline{SF}^{\\,2}$",
"$\\overline{FA}+\\overline{FA'}=\\overline{SC}$",
"$\\overline{FA}=\\overline{FA'}$"
],
"a": 0,
"e": "Avec origine au foyer (confondu pour $F$ et $F'$) : $\\overline{FA}\\cdot\\overline{FA'}=f^2$.",
"s": "Miroir sphérique"
},
{
"q": "On utilise des miroirs convexes comme rétroviseurs parce qu'ils :",
"c": [
"grossissent les objets",
"donnent un large champ de vision",
"donnent des images réelles",
"suppriment les reflets"
],
"a": 1,
"e": "L'image est réduite : on voit une plus grande portion de la route (mais les objets paraissent plus loin qu'ils ne sont).",
"s": "Miroir sphérique"
}
]
},
"opt5": {
"course": "Optique 1",
"title": "Chapitre 5 — Les lentilles minces",
"qs": [
{
"q": "Une lentille à bords minces, dans l'air, est :",
"c": [
"divergente",
"convergente",
"afocale",
"cela dépend de l'objet"
],
"a": 1,
"e": "Bords minces (plus épaisse au centre) : convergente. Bords épais : divergente.",
"s": "Formes des lentilles"
},
{
"q": "La relation de conjugaison d'une lentille mince s'écrit :",
"c": [
"$\\dfrac1{\\overline{OA'}}+\\dfrac1{\\overline{OA}}=\\dfrac1{f'}$",
"$\\dfrac1{\\overline{OA'}}-\\dfrac1{\\overline{OA}}=\\dfrac1{f'}$",
"$\\overline{OA'}-\\overline{OA}=f'$",
"$\\overline{OA}\\cdot\\overline{OA'}=f'^2$"
],
"a": 1,
"e": "Relation de Descartes : $\\dfrac1{\\overline{OA'}}-\\dfrac1{\\overline{OA}}=\\dfrac1{f'}=V$.",
"s": "Relations de conjugaison"
},
{
"q": "Le grandissement d'une lentille mince vaut :",
"c": [
"$\\gamma=\\dfrac{\\overline{OA}}{\\overline{OA'}}$",
"$\\gamma=\\dfrac{\\overline{OA'}}{\\overline{OA}}$",
"$\\gamma=-\\dfrac{\\overline{OA'}}{\\overline{OA}}$",
"$\\gamma=\\dfrac{f'}{\\overline{OA'}}$"
],
"a": 1,
"e": "Le rayon passant par $O$ n'est pas dévié : triangles semblables, $\\gamma=\\dfrac{\\overline{OA'}}{\\overline{OA}}$.",
"s": "Relations de conjugaison"
},
{
"q": "Lentille convergente $f'=20$ cm, objet en $\\overline{OA}=-60$ cm. L'image est en :",
"c": [
"$\\overline{OA'}=+15$ cm",
"$\\overline{OA'}=+30$ cm",
"$\\overline{OA'}=-30$ cm",
"$\\overline{OA'}=+60$ cm"
],
"a": 1,
"e": "$\\dfrac1{\\overline{OA'}}=\\dfrac1{20}+\\dfrac1{-60}=\\dfrac1{30}$, d'où $\\overline{OA'}=30$ cm (image réelle, $\\gamma=-0{,}5$).",
"s": "Relations de conjugaison"
},
{
"q": "Une lentille convergente fonctionne en loupe lorsque l'objet est placé :",
"c": [
"au-delà de $2f'$",
"entre $F$ et $O$",
"exactement en $F$",
"en $2F$"
],
"a": 1,
"e": "Objet entre le foyer objet et la lentille : image virtuelle, droite et agrandie.",
"s": "Construction des images"
},
{
"q": "Deux lentilles accolées de vergences $+5$ δ et $-2$ δ équivalent à une lentille de vergence :",
"c": [
"$+7$ δ",
"$+3$ δ",
"$-10$ δ",
"$+2{,}5$ δ"
],
"a": 1,
"e": "Théorème des vergences : $V=V_1+V_2=5-2=+3$ δ, soit $f'\\approx33$ cm.",
"s": "Associations"
},
{
"q": "Une lentille biconvexe en verre ($n=1{,}5$) a $R_1=+20$ cm et $R_2=-20$ cm. Sa vergence vaut :",
"c": [
"$+2{,}5$ δ",
"$+5$ δ",
"$+10$ δ",
"$0$ δ"
],
"a": 1,
"e": "$V=(n-1)\\left(\\dfrac1{R_1}-\\dfrac1{R_2}\\right)=0{,}5\\times(5+5)=5$ δ.",
"s": "Formule des opticiens"
},
{
"q": "Un rayon passant par le centre optique d'une lentille mince :",
"c": [
"passe par $F'$",
"n'est pas dévié",
"ressort parallèle à l'axe",
"est réfléchi"
],
"a": 1,
"e": "Près du centre, la lentille se comporte comme une lame à faces parallèles d'épaisseur négligeable : pas de déviation.",
"s": "Construction des images"
},
{
"q": "Une lentille divergente donne d'un objet réel une image :",
"c": [
"réelle et renversée",
"virtuelle, droite et réduite",
"virtuelle et agrandie",
"à l'infini"
],
"a": 1,
"e": "Pour une lentille divergente et un objet réel, l'image est toujours virtuelle, droite et réduite, entre $F'$ et $O$.",
"s": "Construction des images"
},
{
"q": "On corrige l'aberration chromatique d'un objectif :",
"c": [
"avec un diaphragme",
"en accolant une lentille convergente en crown et une lentille divergente en flint (doublet achromatique)",
"en augmentant la focale",
"en utilisant de la lumière blanche"
],
"a": 1,
"e": "Les dispersions des deux verres se compensent alors que les vergences ne s'annulent pas.",
"s": "Aberrations"
}
]
}
});

/* ===================== ÉLECTRICITÉ 1 (ch. 4) ET ÉLECTRICITÉ 2 (ch. 1) ===================== */
Object.assign(window.QUIZ, {
"elec4": {
"course": "Électricité 1",
"title": "Chapitre 4 — Électrocinétique",
"qs": [
{
"q": "Une charge de $6$ C traverse une section d'un conducteur en $3$ s, à débit constant. L'intensité du courant vaut :",
"c": [
"$0{,}5$ A",
"$2$ A",
"$18$ A",
"$3$ A"
],
"a": 1,
"e": "$I=\\dfrac{\\Delta q}{\\Delta t}=\\dfrac{6}{3}=2$ A : l'ampère est un coulomb par seconde.",
"s": "Courant et tension en régime continu"
},
{
"q": "Deux résistances $R_1=6\\ \\Omega$ et $R_2=3\\ \\Omega$ sont associées en parallèle. La résistance équivalente vaut :",
"c": [
"$9\\ \\Omega$",
"$4{,}5\\ \\Omega$",
"$2\\ \\Omega$",
"$0{,}5\\ \\Omega$"
],
"a": 2,
"e": "$R=\\dfrac{R_1R_2}{R_1+R_2}=\\dfrac{18}{9}=2\\ \\Omega$ : elle est plus petite que la plus petite des deux.",
"s": "Dipôles passifs et dipôles actifs"
},
{
"q": "Un générateur de f.é.m. $e=12$ V et de résistance interne $r=1\\ \\Omega$ débite $I=2$ A. La tension à ses bornes vaut :",
"c": [
"$14$ V",
"$12$ V",
"$10$ V",
"$24$ V"
],
"a": 2,
"e": "En convention générateur, $U=e-rI=12-1\\times2=10$ V : une partie de la f.é.m. est « perdue » dans la résistance interne.",
"s": "Dipôles passifs et dipôles actifs"
},
{
"q": "Un réseau comporte $b=5$ branches et $n=3$ nœuds. Le nombre de mailles indépendantes est :",
"c": [
"$2$",
"$3$",
"$5$",
"$8$"
],
"a": 1,
"e": "$m=b-n+1=5-3+1=3$. Avec les $n-1=2$ équations de nœuds, on obtient bien $5$ équations pour $5$ courants inconnus.",
"s": "Réseaux électriques linéaires"
},
{
"q": "La loi des nœuds traduit :",
"c": [
"la conservation de l'énergie",
"la conservation de la charge électrique",
"la loi d'Ohm",
"l'additivité des tensions"
],
"a": 1,
"e": "En régime permanent, la charge ne s'accumule pas en un nœud : ce qui arrive est égal à ce qui repart. La loi des mailles, elle, traduit l'additivité des tensions.",
"s": "Les lois de Kirchhoff"
},
{
"q": "Le théorème de superposition NE s'applique PAS au calcul :",
"c": [
"des intensités",
"des tensions",
"des potentiels",
"des puissances"
],
"a": 3,
"e": "La puissance $RI^2$ est quadratique : $(I'+I'')^2\\ne I'^2+I''^2$. On superpose d'abord les courants, puis on calcule la puissance.",
"s": "Théorème de superposition"
},
{
"q": "Pour obtenir la résistance de Thévenin $R_{Th}$ d'un réseau vu entre $A$ et $B$, on :",
"c": [
"mesure la tension à vide entre $A$ et $B$",
"calcule la résistance vue entre $A$ et $B$, sources de tension remplacées par des courts-circuits",
"court-circuite $A$ et $B$",
"additionne toutes les résistances du réseau"
],
"a": 1,
"e": "On éteint les sources (une source de tension idéale devient un fil) et on calcule la résistance vue des bornes. La tension à vide donne $E_{Th}$.",
"s": "Théorèmes de Thévenin et de Norton"
},
{
"q": "Deux branches arrivent au nœud $N$ : $(12\\ \\text{V},\\ 2\\ \\Omega)$ et une résistance seule de $2\\ \\Omega$ reliée à la masse. Le théorème de Millman donne $V_N=$",
"c": [
"$12$ V",
"$6$ V",
"$3$ V",
"$24$ V"
],
"a": 1,
"e": "$V_N=\\dfrac{12/2+0/2}{1/2+1/2}=6$ V (c'est ici un simple diviseur de tension).",
"s": "Théorème de Millman"
},
{
"q": "Un triangle de trois résistances identiques $R=30\\ \\Omega$ est équivalent à une étoile de trois résistances de :",
"c": [
"$90\\ \\Omega$",
"$30\\ \\Omega$",
"$15\\ \\Omega$",
"$10\\ \\Omega$"
],
"a": 3,
"e": "$R_A=\\dfrac{R_{AB}R_{AC}}{R_{AB}+R_{BC}+R_{CA}}=\\dfrac{30\\times30}{90}=10\\ \\Omega$ : pour des résistances égales, $R_Y=R_\\Delta/3$.",
"s": "Transformation triangle–étoile (Kennelly)"
},
{
"q": "En régime permanent continu, un condensateur se comporte comme :",
"c": [
"un fil (court-circuit)",
"un interrupteur ouvert",
"une résistance nulle",
"un générateur de tension"
],
"a": 1,
"e": "$i=C\\,\\dfrac{\\dd u}{\\dd t}=0$ quand la tension est constante : aucun courant ne traverse le condensateur. Une bobine idéale se comporte au contraire comme un fil.",
"s": "Introduction aux régimes variables"
}
]
},
"elec21": {
"course": "Électricité 2",
"title": "Chapitre 1 — Le champ magnétique",
"qs": [
{
"q": "Dans le Système international, le champ magnétique s'exprime en :",
"c": [
"weber (Wb)",
"tesla (T)",
"henry (H)",
"gauss (G)"
],
"a": 1,
"e": "Le tesla ; le gauss ($1\\ \\text{G}=10^{-4}$ T) est une ancienne unité. Le weber mesure un flux, le henry une inductance.",
"s": "Le champ magnétique : généralités"
},
{
"q": "La loi de Biot et Savart pour un élément de courant s'écrit :",
"c": [
"$\\vec{\\dd B}=\\dfrac{\\mu_0}{4\\pi}\\dfrac{I\\,\\vec{\\dd\\ell}\\cdot\\vec u}{r^2}$",
"$\\vec{\\dd B}=\\dfrac{\\mu_0}{4\\pi}\\dfrac{I\\,\\vec{\\dd\\ell}\\wedge\\vec u}{r^2}$",
"$\\vec{\\dd B}=\\dfrac{\\mu_0}{4\\pi}\\dfrac{I\\,\\vec{\\dd\\ell}\\wedge\\vec u}{r}$",
"$\\vec{\\dd B}=\\dfrac{1}{4\\pi\\varepsilon_0}\\dfrac{I\\,\\dd\\ell}{r^2}\\,\\vec u$"
],
"a": 1,
"e": "Le produit vectoriel rend $\\vec{\\dd B}$ perpendiculaire à $\\vec{\\dd\\ell}$ et à $\\vec u=\\vec{PM}/PM$ ; l'intensité décroît en $1/r^2$.",
"s": "Loi de Biot et Savart"
},
{
"q": "Si un plan est un plan de symétrie de la distribution de courants, le champ magnétique en un point de ce plan est :",
"c": [
"contenu dans le plan",
"perpendiculaire au plan",
"nul",
"quelconque"
],
"a": 1,
"e": "$\\vec B$ est un pseudo-vecteur : il est perpendiculaire aux plans de symétrie des courants et contenu dans leurs plans d'antisymétrie (c'est l'inverse de $\\vec E$).",
"s": "Loi de Biot et Savart"
},
{
"q": "Un fil rectiligne infini est parcouru par $I=10$ A. À $d=2$ cm du fil, le champ vaut ($\\mu_0=4\\pi\\times10^{-7}$ H/m) :",
"c": [
"$10^{-4}$ T",
"$2\\times10^{-4}$ T",
"$10^{-2}$ T",
"$6{,}3\\times10^{-4}$ T"
],
"a": 0,
"e": "$B=\\dfrac{\\mu_0I}{2\\pi d}=\\dfrac{2\\times10^{-7}\\times10}{0{,}02}=10^{-4}$ T.",
"s": "Applications de la loi de Biot et Savart"
},
{
"q": "Un solénoïde très long comporte $n=1000$ spires par mètre parcourues par $I=2$ A. Le champ intérieur vaut environ :",
"c": [
"$1{,}3\\times10^{-3}$ T",
"$2{,}5\\times10^{-3}$ T",
"$2\\times10^{-4}$ T",
"$2{,}5$ T"
],
"a": 1,
"e": "$B=\\mu_0nI=4\\pi\\times10^{-7}\\times1000\\times2\\approx2{,}5\\times10^{-3}$ T, uniforme à l'intérieur.",
"s": "Applications de la loi de Biot et Savart"
},
{
"q": "Le flux du champ magnétique à travers une surface fermée est :",
"c": [
"égal à $\\mu_0$ fois le courant intérieur",
"toujours nul",
"égal à la charge intérieure divisée par $\\varepsilon_0$",
"positif"
],
"a": 1,
"e": "$\\oiint\\vec B\\cdot\\vec{\\dd S}=0$ ($\\operatorname{div}\\vec B=0$) : il n'existe pas de « charge magnétique », les lignes de champ se referment sur elles-mêmes.",
"s": "Flux magnétique et potentiel vecteur"
},
{
"q": "Un contour fermé enlace un courant $I_1=3$ A dans le sens positif et un courant $I_2=1$ A dans le sens opposé. La circulation de $\\vec B$ sur ce contour vaut :",
"c": [
"$4\\mu_0$",
"$2\\mu_0$",
"$3\\mu_0$",
"$0$"
],
"a": 1,
"e": "Théorème d'Ampère : $\\oint\\vec B\\cdot\\vec{\\dd\\ell}=\\mu_0\\sum I_{\\text{enlacés}}=\\mu_0(3-1)=2\\mu_0$ (en SI).",
"s": "Théorème d'Ampère"
},
{
"q": "Une particule chargée se déplace dans un champ magnétique seul. Son énergie cinétique :",
"c": [
"augmente",
"diminue",
"reste constante",
"oscille"
],
"a": 2,
"e": "La force $q\\vec v\\wedge\\vec B$ est perpendiculaire à la vitesse : elle ne travaille pas. Seule la direction de $\\vec v$ change.",
"s": "Forces magnétiques"
},
{
"q": "Deux fils rectilignes parallèles parcourus par des courants de même sens :",
"c": [
"s'attirent",
"se repoussent",
"n'exercent aucune force l'un sur l'autre",
"subissent un couple"
],
"a": 0,
"e": "Chaque fil est placé dans le champ de l'autre ; la force de Laplace par unité de longueur vaut $\\dfrac{\\mu_0I_1I_2}{2\\pi d}$, attractive pour des courants de même sens.",
"s": "Forces magnétiques"
},
{
"q": "Un circuit de moment magnétique $\\vec{\\mathcal M}$ placé dans un champ uniforme $\\vec B$ subit :",
"c": [
"une force $\\vec{\\mathcal M}\\wedge\\vec B$",
"un couple $\\vec\\Gamma=\\vec{\\mathcal M}\\wedge\\vec B$ et une résultante nulle",
"un couple $\\vec\\Gamma=\\vec B\\wedge\\vec{\\mathcal M}$",
"aucune action"
],
"a": 1,
"e": "La résultante des forces de Laplace est nulle en champ uniforme ; le couple $\\vec{\\mathcal M}\\wedge\\vec B$ tend à aligner $\\vec{\\mathcal M}$ sur $\\vec B$ (équilibre stable, $E_p=-\\vec{\\mathcal M}\\cdot\\vec B$ minimale).",
"s": "Circuit dans un champ uniforme ; dipôle magnétique"
}
]
}
});
