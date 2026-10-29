/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* Quiz d'auto-évaluation de la Licence BCG (département SVT) : Physique générale 1 (LBCG1121),
   Physique générale 2 (LBCG1221) et Biophysique (LBCG1223). 10 questions par chapitre.
   Clés : identifiant du cours sur l'accueil + numéro du chapitre (bcgpg11 = Physique générale 1, chapitre 1). */
window.QUIZ=Object.assign(window.QUIZ||{},{
"bcgpg11": {
"course": "Physique générale 1",
"title": "Chapitre 1 — Outils de base et cinématique du point",
"qs": [
{
"q": "Quelle est l'unité SI d'une force exprimée avec les unités de base ?",
"c": [
"$\\mathrm{kg\\cdot m\\cdot s^{-2}}$",
"$\\mathrm{kg\\cdot m\\cdot s^{-1}}$",
"$\\mathrm{kg\\cdot m^2\\cdot s^{-2}}$",
"$\\mathrm{kg\\cdot s^{-2}}$"
],
"a": 0,
"e": "D'après $F=ma$ : $[F]=\\mathrm{kg}\\times\\mathrm{m\\cdot s^{-2}}$. Cette unité est le newton (N).",
"s": "Unités SI et analyse dimensionnelle"
},
{
"q": "Quelle est la dimension d'une vitesse ?",
"c": [
"$\\mathrm{L\\cdot T}$",
"$\\mathrm{L\\cdot T^{-1}}$",
"$\\mathrm{L\\cdot T^{-2}}$",
"$\\mathrm{M\\cdot L\\cdot T^{-1}}$"
],
"a": 1,
"e": "Une vitesse est une longueur divisée par une durée : $[v]=\\mathrm{L\\cdot T^{-1}}$.",
"s": "Unités SI et analyse dimensionnelle"
},
{
"q": "Laquelle de ces formules donnant une distance $d$ est homogène ($a$ accélération, $v$ vitesse, $t$ durée) ?",
"c": [
"$d=at$",
"$d=v/t$",
"$d=\\frac12 at^2$",
"$d=vt^2$"
],
"a": 2,
"e": "$[at^2]=\\mathrm{L\\,T^{-2}}\\times\\mathrm{T^2}=\\mathrm{L}$ : seule $d=\\frac12 at^2$ est homogène à une longueur.",
"s": "Unités SI et analyse dimensionnelle"
},
{
"q": "Une vitesse de $72\\ \\mathrm{km/h}$ vaut :",
"c": [
"$7{,}2\\ \\mathrm{m/s}$",
"$20\\ \\mathrm{m/s}$",
"$259\\ \\mathrm{m/s}$",
"$2\\ \\mathrm{m/s}$"
],
"a": 1,
"e": "$72\\ \\mathrm{km/h}=\\dfrac{72\\,000\\ \\mathrm m}{3600\\ \\mathrm s}=20\\ \\mathrm{m/s}$ (on divise par 3,6).",
"s": "Unités SI et analyse dimensionnelle"
},
{
"q": "On calcule $3{,}25\\times 2{,}1$. Avec le bon nombre de chiffres significatifs, le résultat s'écrit :",
"c": [
"$6{,}825$",
"$6{,}83$",
"$6{,}8$",
"$7$"
],
"a": 2,
"e": "Le résultat garde autant de chiffres significatifs que la donnée la moins précise : $2{,}1$ en a deux, d'où $6{,}8$.",
"s": "Chiffres significatifs et incertitudes"
},
{
"q": "La norme du vecteur $\\vec u=(3\\,;\\,4)$ vaut :",
"c": [
"$7$",
"$5$",
"$12$",
"$25$"
],
"a": 1,
"e": "$\\|\\vec u\\|=\\sqrt{3^2+4^2}=\\sqrt{25}=5$.",
"s": "Vecteurs : composantes, produits scalaire et vectoriel"
},
{
"q": "Deux vecteurs non nuls dont le produit scalaire est nul sont :",
"c": [
"colinéaires",
"orthogonaux",
"de même norme",
"de sens opposés"
],
"a": 1,
"e": "$\\vec u\\cdot\\vec v=\\|\\vec u\\|\\|\\vec v\\|\\cos\\theta=0$ impose $\\cos\\theta=0$, soit $\\theta=90^\\circ$.",
"s": "Vecteurs : composantes, produits scalaire et vectoriel"
},
{
"q": "La position d'un point est $x(t)=2t^2+3$ (en m, $t$ en s). Sa vitesse à $t=2\\ \\mathrm s$ vaut :",
"c": [
"$11\\ \\mathrm{m/s}$",
"$4\\ \\mathrm{m/s}$",
"$8\\ \\mathrm{m/s}$",
"$16\\ \\mathrm{m/s}$"
],
"a": 2,
"e": "$v=\\dfrac{dx}{dt}=4t$, donc $v(2)=8\\ \\mathrm{m/s}$.",
"s": "Référentiel, vitesse et accélération"
},
{
"q": "Dans un mouvement circulaire uniforme de rayon $R$ à la vitesse $v$, l'accélération :",
"c": [
"est nulle",
"est tangente à la trajectoire",
"est dirigée vers le centre et vaut $v^2/R$",
"est dirigée vers l'extérieur et vaut $vR$"
],
"a": 2,
"e": "La vitesse garde sa norme mais change de direction : l'accélération est centripète, de norme $v^2/R$.",
"s": "Mouvements rectiligne, circulaire et parabolique"
},
{
"q": "Un animal saute ; on néglige les frottements de l'air. Pendant le saut, la composante horizontale de sa vitesse :",
"c": [
"reste constante",
"augmente",
"diminue jusqu'à s'annuler",
"change de signe au sommet"
],
"a": 0,
"e": "Seul le poids, vertical, agit : l'accélération horizontale est nulle, donc $v_x$ reste constante.",
"s": "Mouvements rectiligne, circulaire et parabolique"
}
]
},
"bcgpg12": {
"course": "Physique générale 1",
"title": "Chapitre 2 — Dynamique du point",
"qs": [
{
"q": "D'après le principe d'inertie, si la somme des forces appliquées à un corps est nulle, ce corps est :",
"c": [
"forcément immobile",
"immobile ou en mouvement rectiligne uniforme",
"en mouvement circulaire uniforme",
"en chute libre"
],
"a": 1,
"e": "Première loi de Newton : sans force résultante, la vitesse reste constante (éventuellement nulle).",
"s": "Les lois de Newton"
},
{
"q": "Une force résultante de $10\\ \\mathrm N$ s'applique à une masse de $2\\ \\mathrm{kg}$. Son accélération vaut :",
"c": [
"$20\\ \\mathrm{m/s^2}$",
"$5\\ \\mathrm{m/s^2}$",
"$0{,}2\\ \\mathrm{m/s^2}$",
"$12\\ \\mathrm{m/s^2}$"
],
"a": 1,
"e": "$a=F/m=10/2=5\\ \\mathrm{m/s^2}$.",
"s": "Les lois de Newton"
},
{
"q": "Le poids d'une personne de $50\\ \\mathrm{kg}$ ($g=9{,}8\\ \\mathrm{m/s^2}$) vaut :",
"c": [
"$50\\ \\mathrm N$",
"$5{,}1\\ \\mathrm N$",
"$490\\ \\mathrm N$",
"$4900\\ \\mathrm N$"
],
"a": 2,
"e": "$P=mg=50\\times9{,}8=490\\ \\mathrm N$. La masse s'exprime en kg, le poids (une force) en N.",
"s": "Forces usuelles : poids, réaction, tension, rappel"
},
{
"q": "Selon la troisième loi de Newton, les forces d'interaction entre deux corps A et B :",
"c": [
"s'annulent car elles s'appliquent au même corps",
"sont égales et opposées, et s'appliquent à deux corps différents",
"sont de même sens",
"n'existent que si les corps se touchent"
],
"a": 1,
"e": "$\\vec F_{A/B}=-\\vec F_{B/A}$ : elles ne s'annulent pas car chacune agit sur un corps différent.",
"s": "Les lois de Newton"
},
{
"q": "Un ressort de raideur $k=200\\ \\mathrm{N/m}$ est allongé de $5\\ \\mathrm{cm}$. La force de rappel vaut :",
"c": [
"$1000\\ \\mathrm N$",
"$40\\ \\mathrm N$",
"$10\\ \\mathrm N$",
"$4\\ \\mathrm N$"
],
"a": 2,
"e": "$F=k\\,\\Delta\\ell=200\\times0{,}05=10\\ \\mathrm N$ (l'allongement doit être en mètres).",
"s": "Forces usuelles : poids, réaction, tension, rappel"
},
{
"q": "Un objet glisse sans frottement sur un plan incliné d'un angle $\\alpha$. Son accélération vaut :",
"c": [
"$g$",
"$g\\cos\\alpha$",
"$g\\sin\\alpha$",
"$g\\tan\\alpha$"
],
"a": 2,
"e": "La réaction est perpendiculaire au plan ; seule la composante du poids parallèle au plan, $mg\\sin\\alpha$, accélère l'objet.",
"s": "Les lois de Newton"
},
{
"q": "La force de frottement de glissement entre deux solides a pour norme ($\\mu$ coefficient de frottement, $N$ réaction normale) :",
"c": [
"$f=\\mu N$",
"$f=N/\\mu$",
"$f=\\mu mg^2$",
"$f=\\mu v$"
],
"a": 0,
"e": "Loi de Coulomb du frottement solide : $f=\\mu N$, indépendante de la vitesse.",
"s": "Frottement solide"
},
{
"q": "La loi de Stokes donne la force de frottement fluide sur une petite sphère de rayon $r$ :",
"c": [
"$F=6\\pi\\eta r v$",
"$F=\\eta r^2 v^2$",
"$F=\\rho g V$",
"$F=\\frac12\\rho v^2$"
],
"a": 0,
"e": "$F=6\\pi\\eta r v$, proportionnelle à la viscosité $\\eta$, au rayon et à la vitesse (écoulement lent).",
"s": "Frottement fluide et vitesse limite (loi de Stokes)"
},
{
"q": "Une particule qui sédimente dans l'eau atteint sa vitesse limite lorsque :",
"c": [
"son poids s'annule",
"la somme des forces (poids, poussée d'Archimède, frottement) est nulle",
"la poussée d'Archimède dépasse le poids",
"sa vitesse devient infinie"
],
"a": 1,
"e": "À la vitesse limite, l'accélération est nulle : poids = poussée d'Archimède + frottement de Stokes.",
"s": "Sédimentation et centrifugation"
},
{
"q": "Dans une centrifugeuse, on double la vitesse de rotation $\\omega$ à rayon constant. L'accélération centripète est :",
"c": [
"doublée",
"inchangée",
"multipliée par 4",
"divisée par 2"
],
"a": 2,
"e": "$a=\\omega^2 r$ : doubler $\\omega$ multiplie l'accélération par $2^2=4$, ce qui accélère la sédimentation.",
"s": "Sédimentation et centrifugation"
}
]
},
"bcgpg13": {
"course": "Physique générale 1",
"title": "Chapitre 3 — Travail, énergie et puissance",
"qs": [
{
"q": "Le travail d'une force constante $\\vec F$ sur un déplacement rectiligne de longueur $d$, faisant un angle $\\theta$ avec $\\vec F$, vaut :",
"c": [
"$W=Fd\\sin\\theta$",
"$W=Fd\\cos\\theta$",
"$W=F/d$",
"$W=Fd$ quel que soit $\\theta$"
],
"a": 1,
"e": "$W=\\vec F\\cdot\\vec{AB}=Fd\\cos\\theta$.",
"s": "Travail d'une force et puissance"
},
{
"q": "Une force perpendiculaire au déplacement :",
"c": [
"a un travail maximal",
"a un travail nul",
"a un travail négatif",
"a un travail égal à $F\\times d$"
],
"a": 1,
"e": "$\\cos90^\\circ=0$ : la force ne travaille pas (exemple : la réaction d'un support horizontal).",
"s": "Travail d'une force et puissance"
},
{
"q": "La puissance est le travail fourni par unité de temps. Son unité est :",
"c": [
"le joule",
"le watt",
"le newton",
"le pascal"
],
"a": 1,
"e": "$P=W/\\Delta t$ s'exprime en watts : $1\\ \\mathrm W=1\\ \\mathrm{J/s}$.",
"s": "Travail d'une force et puissance"
},
{
"q": "L'énergie cinétique d'un animal de $2\\ \\mathrm{kg}$ courant à $3\\ \\mathrm{m/s}$ vaut :",
"c": [
"$6\\ \\mathrm J$",
"$9\\ \\mathrm J$",
"$18\\ \\mathrm J$",
"$3\\ \\mathrm J$"
],
"a": 1,
"e": "$E_c=\\frac12 mv^2=\\frac12\\times2\\times3^2=9\\ \\mathrm J$.",
"s": "Énergie cinétique et théorème de l'énergie cinétique"
},
{
"q": "Le théorème de l'énergie cinétique affirme que la variation $\\Delta E_c$ entre deux instants est égale à :",
"c": [
"la somme des travaux de toutes les forces appliquées",
"le travail du poids seulement",
"la variation de l'énergie potentielle",
"zéro"
],
"a": 0,
"e": "$\\Delta E_c=\\sum W(\\vec F)$, en comptant toutes les forces, conservatives ou non.",
"s": "Énergie cinétique et théorème de l'énergie cinétique"
},
{
"q": "L'énergie potentielle de pesanteur d'une masse de $1\\ \\mathrm{kg}$ à $10\\ \\mathrm m$ au-dessus du sol ($g=10\\ \\mathrm{m/s^2}$, origine au sol) vaut :",
"c": [
"$10\\ \\mathrm J$",
"$100\\ \\mathrm J$",
"$1\\ \\mathrm J$",
"$1000\\ \\mathrm J$"
],
"a": 1,
"e": "$E_p=mgh=1\\times10\\times10=100\\ \\mathrm J$.",
"s": "Énergies potentielles de pesanteur et élastique"
},
{
"q": "L'énergie potentielle élastique d'un ressort ($k=100\\ \\mathrm{N/m}$) allongé de $10\\ \\mathrm{cm}$ vaut :",
"c": [
"$10\\ \\mathrm J$",
"$5\\ \\mathrm J$",
"$0{,}5\\ \\mathrm J$",
"$1\\ \\mathrm J$"
],
"a": 2,
"e": "$E_p=\\frac12 kx^2=\\frac12\\times100\\times0{,}1^2=0{,}5\\ \\mathrm J$.",
"s": "Énergies potentielles de pesanteur et élastique"
},
{
"q": "Un fruit tombe sans vitesse initiale d'une hauteur de $5\\ \\mathrm m$ ($g=10\\ \\mathrm{m/s^2}$, frottements négligés). Sa vitesse au sol vaut :",
"c": [
"$5\\ \\mathrm{m/s}$",
"$50\\ \\mathrm{m/s}$",
"$10\\ \\mathrm{m/s}$",
"$25\\ \\mathrm{m/s}$"
],
"a": 2,
"e": "Conservation de l'énergie mécanique : $mgh=\\frac12mv^2$, d'où $v=\\sqrt{2gh}=\\sqrt{100}=10\\ \\mathrm{m/s}$.",
"s": "Conservation de l'énergie mécanique"
},
{
"q": "L'énergie mécanique d'un système se conserve lorsque :",
"c": [
"aucune force ne s'exerce",
"les forces non conservatives (frottements…) ne travaillent pas",
"la vitesse est constante",
"l'altitude est constante"
],
"a": 1,
"e": "$\\Delta E_m=W(\\text{forces non conservatives})$ : elle se conserve si ce travail est nul.",
"s": "Conservation de l'énergie mécanique"
},
{
"q": "Un muscle a un rendement de $25\\ \\%$. Pour $400\\ \\mathrm J$ d'énergie chimique consommée, il fournit un travail mécanique de :",
"c": [
"$100\\ \\mathrm J$",
"$25\\ \\mathrm J$",
"$300\\ \\mathrm J$",
"$1600\\ \\mathrm J$"
],
"a": 0,
"e": "$W=\\eta\\times E=0{,}25\\times400=100\\ \\mathrm J$ ; les $300\\ \\mathrm J$ restants sont dissipés en chaleur.",
"s": "Rendement musculaire"
}
]
},
"bcgpg14": {
"course": "Physique générale 1",
"title": "Chapitre 4 — Mécanique des fluides",
"qs": [
{
"q": "L'unité SI de la pression est le pascal, qui vaut :",
"c": [
"$1\\ \\mathrm{N\\cdot m}$",
"$1\\ \\mathrm{N/m^2}$",
"$1\\ \\mathrm{N/m}$",
"$1\\ \\mathrm{kg/m^3}$"
],
"a": 1,
"e": "$P=F/S$ : $1\\ \\mathrm{Pa}=1\\ \\mathrm{N/m^2}$. La pression atmosphérique vaut environ $10^5\\ \\mathrm{Pa}$.",
"s": "Pression et principe fondamental de l'hydrostatique"
},
{
"q": "Un plongeur descend à $10\\ \\mathrm m$ sous la surface de l'eau ($\\rho=1000\\ \\mathrm{kg/m^3}$, $g=10\\ \\mathrm{m/s^2}$). La pression augmente de :",
"c": [
"$10^3\\ \\mathrm{Pa}$",
"$10^4\\ \\mathrm{Pa}$",
"$10^5\\ \\mathrm{Pa}$",
"$10^6\\ \\mathrm{Pa}$"
],
"a": 2,
"e": "$\\Delta P=\\rho g h=1000\\times10\\times10=10^5\\ \\mathrm{Pa}$, soit environ une atmosphère de plus.",
"s": "Pression et principe fondamental de l'hydrostatique"
},
{
"q": "Le principe de Pascal énonce qu'une variation de pression appliquée à un fluide incompressible au repos :",
"c": [
"ne se transmet qu'à la surface",
"est transmise intégralement en tout point du fluide",
"diminue avec la profondeur",
"est absorbée par le fluide"
],
"a": 1,
"e": "C'est le principe des presses et freins hydrauliques.",
"s": "Principe de Pascal et poussée d'Archimède"
},
{
"q": "La poussée d'Archimède exercée sur un corps immergé est égale :",
"c": [
"au poids du corps",
"au poids du fluide déplacé",
"à la masse du fluide déplacé",
"à la pression au fond du récipient"
],
"a": 1,
"e": "$\\Pi=\\rho_{\\text{fluide}}\\,V_{\\text{immergé}}\\,g$, verticale vers le haut.",
"s": "Principe de Pascal et poussée d'Archimède"
},
{
"q": "Un corps lâché dans un liquide flotte si :",
"c": [
"sa masse est faible",
"sa masse volumique moyenne est inférieure à celle du liquide",
"son volume est grand",
"il est creux"
],
"a": 1,
"e": "Il flotte lorsque la poussée d'Archimède peut équilibrer son poids, c'est-à-dire si $\\rho_{\\text{corps}}<\\rho_{\\text{liquide}}$.",
"s": "Principe de Pascal et poussée d'Archimède"
},
{
"q": "Un iceberg ($\\rho_{\\text{glace}}=920\\ \\mathrm{kg/m^3}$) flotte dans l'eau de mer ($\\rho=1025\\ \\mathrm{kg/m^3}$). La fraction de son volume immergée vaut environ :",
"c": [
"$10\\ \\%$",
"$50\\ \\%$",
"$90\\ \\%$",
"$100\\ \\%$"
],
"a": 2,
"e": "À l'équilibre $\\rho_g V g=\\rho_e V_{\\text{im}} g$, donc $V_{\\text{im}}/V=920/1025\\approx0{,}90$. Le même raisonnement explique l'isostasie des continents.",
"s": "Principe de Pascal et poussée d'Archimède"
},
{
"q": "D'après la loi de Jurin, la hauteur d'ascension d'un liquide dans un tube capillaire est :",
"c": [
"proportionnelle au rayon du tube",
"inversement proportionnelle au rayon du tube",
"indépendante du rayon",
"proportionnelle au carré du rayon"
],
"a": 1,
"e": "$h=\\dfrac{2\\gamma\\cos\\theta}{\\rho g r}$ : plus le tube est fin, plus le liquide monte (sève, eau dans les sols).",
"s": "Tension superficielle et capillarité"
},
{
"q": "Un fluide incompressible s'écoule dans un tuyau dont la section est divisée par 2. Sa vitesse est :",
"c": [
"divisée par 2",
"inchangée",
"doublée",
"multipliée par 4"
],
"a": 2,
"e": "Équation de continuité : le débit $Q=Sv$ est conservé ; si $S$ est divisée par 2, $v$ double.",
"s": "Débit, équation de continuité et théorème de Bernoulli"
},
{
"q": "D'après le théorème de Bernoulli, dans un écoulement horizontal de fluide parfait, là où la vitesse augmente, la pression :",
"c": [
"augmente",
"diminue",
"reste constante",
"s'annule"
],
"a": 1,
"e": "$P+\\frac12\\rho v^2=\\text{cte}$ à altitude constante : une vitesse plus grande s'accompagne d'une pression plus faible.",
"s": "Débit, équation de continuité et théorème de Bernoulli"
},
{
"q": "D'après la loi de Poiseuille, si le rayon d'un vaisseau sanguin est divisé par 2 (même différence de pression), le débit est :",
"c": [
"divisé par 2",
"divisé par 4",
"divisé par 16",
"inchangé"
],
"a": 2,
"e": "$Q=\\dfrac{\\pi r^4\\Delta P}{8\\eta L}$ : le débit varie comme $r^4$, d'où une division par $2^4=16$. Un rétrécissement artériel a donc un effet considérable.",
"s": "Viscosité et loi de Poiseuille : la circulation sanguine"
}
]
},
"bcgpg15": {
"course": "Physique générale 1",
"title": "Chapitre 5 — Optique géométrique",
"qs": [
{
"q": "La loi de Snell-Descartes pour la réfraction s'écrit :",
"c": [
"$n_1\\cos i_1=n_2\\cos i_2$",
"$n_1\\sin i_1=n_2\\sin i_2$",
"$n_1 i_2=n_2 i_1$",
"$\\sin i_1=\\sin i_2$"
],
"a": 1,
"e": "$n_1\\sin i_1=n_2\\sin i_2$, les angles étant mesurés par rapport à la normale.",
"s": "Lois de Snell-Descartes et réflexion totale"
},
{
"q": "La réflexion totale peut se produire lorsque la lumière passe :",
"c": [
"d'un milieu moins réfringent vers un milieu plus réfringent",
"d'un milieu plus réfringent vers un milieu moins réfringent, sous une incidence assez grande",
"perpendiculairement à la surface",
"dans le vide uniquement"
],
"a": 1,
"e": "Il faut $n_1>n_2$ et $i_1$ supérieur à l'angle limite. C'est le principe de la fibre optique et de l'endoscope.",
"s": "Lois de Snell-Descartes et réflexion totale"
},
{
"q": "L'angle limite de réfraction du verre ($n=1{,}5$) vers l'air vaut environ :",
"c": [
"$30^\\circ$",
"$42^\\circ$",
"$56^\\circ$",
"$90^\\circ$"
],
"a": 1,
"e": "$\\sin i_\\ell=n_2/n_1=1/1{,}5\\approx0{,}67$, d'où $i_\\ell\\approx42^\\circ$.",
"s": "Lois de Snell-Descartes et réflexion totale"
},
{
"q": "L'image d'un objet donnée par un miroir plan est :",
"c": [
"réelle et renversée",
"virtuelle, droite et symétrique de l'objet par rapport au miroir",
"réelle et agrandie",
"virtuelle et réduite"
],
"a": 1,
"e": "Le miroir plan donne de tout objet réel une image virtuelle, de même taille, symétrique par rapport au plan du miroir.",
"s": "Miroirs et dioptres"
},
{
"q": "La vergence d'une lentille de distance focale $f'=20\\ \\mathrm{cm}$ vaut :",
"c": [
"$20\\ \\delta$",
"$0{,}2\\ \\delta$",
"$5\\ \\delta$",
"$2\\ \\delta$"
],
"a": 2,
"e": "$V=1/f'=1/0{,}20\\ \\mathrm m=5\\ \\delta$ (la distance focale doit être en mètres).",
"s": "Lentilles minces : conjugaison et grandissement"
},
{
"q": "Un objet est placé à $30\\ \\mathrm{cm}$ devant une lentille convergente de distance focale $10\\ \\mathrm{cm}$ ($\\overline{OA}=-30\\ \\mathrm{cm}$). L'image se forme à :",
"c": [
"$\\overline{OA'}=15\\ \\mathrm{cm}$",
"$\\overline{OA'}=-15\\ \\mathrm{cm}$",
"$\\overline{OA'}=7{,}5\\ \\mathrm{cm}$",
"$\\overline{OA'}=30\\ \\mathrm{cm}$"
],
"a": 0,
"e": "$\\dfrac1{\\overline{OA'}}=\\dfrac1{f'}+\\dfrac1{\\overline{OA}}=\\dfrac1{10}-\\dfrac1{30}=\\dfrac2{30}$, donc $\\overline{OA'}=15\\ \\mathrm{cm}$ : image réelle.",
"s": "Lentilles minces : conjugaison et grandissement"
},
{
"q": "Dans la situation précédente ($\\overline{OA}=-30\\ \\mathrm{cm}$, $\\overline{OA'}=15\\ \\mathrm{cm}$), l'image est :",
"c": [
"droite et deux fois plus grande",
"renversée et deux fois plus petite",
"droite et de même taille",
"renversée et deux fois plus grande"
],
"a": 1,
"e": "$\\gamma=\\overline{OA'}/\\overline{OA}=15/(-30)=-0{,}5$ : $\\gamma<0$ (renversée) et $|\\gamma|=0{,}5$.",
"s": "Lentilles minces : conjugaison et grandissement"
},
{
"q": "Un œil myope se corrige avec :",
"c": [
"une lentille convergente",
"une lentille divergente",
"un prisme",
"un miroir"
],
"a": 1,
"e": "L'œil myope est trop convergent : l'image d'un objet lointain se forme avant la rétine. Une lentille divergente compense cet excès.",
"s": "L'œil et ses défauts"
},
{
"q": "Pour voir un objet proche net, l'œil accommode : le cristallin",
"c": [
"devient moins convergent",
"devient plus convergent",
"s'éloigne de la rétine",
"ne change pas"
],
"a": 1,
"e": "Les muscles ciliaires bombent le cristallin : sa vergence augmente pour ramener l'image sur la rétine. La presbytie est la perte de cette capacité.",
"s": "L'œil et ses défauts"
},
{
"q": "Un microscope possède un objectif de grandissement $40$ (en valeur absolue) et un oculaire de grossissement $10$. Son grossissement commercial vaut :",
"c": [
"$50$",
"$4$",
"$400$",
"$30$"
],
"a": 2,
"e": "Le grossissement du microscope est le produit $|\\gamma_{\\text{obj}}|\\times G_{\\text{oc}}=40\\times10=400$.",
"s": "La loupe et le microscope"
}
]
},
"bcgpg21": {
"course": "Physique générale 2",
"title": "Chapitre 1 — Température et chaleur",
"qs": [
{
"q": "Quelle énergie faut-il pour chauffer $1\\ \\mathrm{kg}$ d'eau de $20$ à $30\\ ^\\circ\\mathrm C$ ($c=4180\\ \\mathrm{J\\cdot kg^{-1}\\cdot K^{-1}}$) ?",
"c": [
"$4{,}18\\ \\mathrm{kJ}$",
"$41{,}8\\ \\mathrm{kJ}$",
"$418\\ \\mathrm{kJ}$",
"$125\\ \\mathrm{kJ}$"
],
"a": 1,
"e": "$Q=mc\\,\\Delta T=1\\times4180\\times10=41\\,800\\ \\mathrm J=41{,}8\\ \\mathrm{kJ}$.",
"s": "Capacité thermique et chaleur latente"
},
{
"q": "L'unité de la capacité thermique massique est :",
"c": [
"$\\mathrm{J\\cdot kg^{-1}\\cdot K^{-1}}$",
"$\\mathrm{J\\cdot K}$",
"$\\mathrm{W\\cdot kg}$",
"$\\mathrm{J\\cdot kg}$"
],
"a": 0,
"e": "$c=\\dfrac{Q}{m\\,\\Delta T}$ s'exprime en $\\mathrm{J\\cdot kg^{-1}\\cdot K^{-1}}$.",
"s": "Capacité thermique et chaleur latente"
},
{
"q": "Pendant la fusion de la glace sous pression constante, la température du mélange eau-glace :",
"c": [
"augmente régulièrement",
"reste constante",
"diminue",
"oscille"
],
"a": 1,
"e": "La chaleur reçue sert à changer d'état (chaleur latente), pas à élever la température : elle reste à $0\\ ^\\circ\\mathrm C$.",
"s": "Capacité thermique et chaleur latente"
},
{
"q": "Quelle énergie faut-il pour faire fondre $100\\ \\mathrm g$ de glace à $0\\ ^\\circ\\mathrm C$ ($L_f=334\\ \\mathrm{kJ/kg}$) ?",
"c": [
"$334\\ \\mathrm{kJ}$",
"$33{,}4\\ \\mathrm{kJ}$",
"$3{,}34\\ \\mathrm{kJ}$",
"$3340\\ \\mathrm{kJ}$"
],
"a": 1,
"e": "$Q=mL_f=0{,}1\\times334=33{,}4\\ \\mathrm{kJ}$.",
"s": "Capacité thermique et chaleur latente"
},
{
"q": "Dans un calorimètre parfaitement isolé, la somme des quantités de chaleur échangées entre les corps :",
"c": [
"est positive",
"est nulle",
"est négative",
"dépend de la température"
],
"a": 1,
"e": "Aucune chaleur ne sort : ce que cèdent les corps chauds est reçu par les corps froids, $\\sum Q_i=0$.",
"s": "Calorimétrie"
},
{
"q": "On mélange $1\\ \\mathrm{kg}$ d'eau à $20\\ ^\\circ\\mathrm C$ et $1\\ \\mathrm{kg}$ d'eau à $60\\ ^\\circ\\mathrm C$ dans un calorimètre parfait. La température finale vaut :",
"c": [
"$30\\ ^\\circ\\mathrm C$",
"$40\\ ^\\circ\\mathrm C$",
"$50\\ ^\\circ\\mathrm C$",
"$80\\ ^\\circ\\mathrm C$"
],
"a": 1,
"e": "$mc(\\theta_f-20)+mc(\\theta_f-60)=0$, d'où $\\theta_f=40\\ ^\\circ\\mathrm C$ (moyenne, masses égales).",
"s": "Calorimétrie"
},
{
"q": "Quel mode de transfert thermique ne nécessite aucun support matériel ?",
"c": [
"la conduction",
"la convection",
"le rayonnement",
"aucun"
],
"a": 2,
"e": "Le rayonnement électromagnétique se propage dans le vide : c'est ainsi que l'énergie du Soleil nous parvient.",
"s": "Conduction, convection et rayonnement"
},
{
"q": "Le transfert thermique accompagné d'un déplacement de matière dans un fluide s'appelle :",
"c": [
"la conduction",
"la convection",
"le rayonnement",
"la diffusion"
],
"a": 1,
"e": "La convection : le fluide chauffé, moins dense, monte et transporte l'énergie (courants dans l'atmosphère, le manteau terrestre).",
"s": "Conduction, convection et rayonnement"
},
{
"q": "La transpiration refroidit le corps parce que :",
"c": [
"la sueur est froide",
"l'évaporation de la sueur absorbe de la chaleur prise à la peau",
"la sueur réfléchit le rayonnement",
"elle réduit la convection"
],
"a": 1,
"e": "Passer de l'état liquide à l'état vapeur demande la chaleur latente de vaporisation, prélevée sur la peau.",
"s": "Thermorégulation et flux géothermique"
},
{
"q": "Dans la croûte terrestre, le gradient géothermique moyen est d'environ $30\\ ^\\circ\\mathrm C/\\mathrm{km}$. En descendant de $100\\ \\mathrm m$, la température augmente d'environ :",
"c": [
"$0{,}3\\ ^\\circ\\mathrm C$",
"$3\\ ^\\circ\\mathrm C$",
"$30\\ ^\\circ\\mathrm C$",
"$300\\ ^\\circ\\mathrm C$"
],
"a": 1,
"e": "$30\\ ^\\circ\\mathrm C$ pour $1000\\ \\mathrm m$, donc $3\\ ^\\circ\\mathrm C$ pour $100\\ \\mathrm m$.",
"s": "Thermorégulation et flux géothermique"
}
]
},
"bcgpg22": {
"course": "Physique générale 2",
"title": "Chapitre 2 — Gaz parfait et premier principe",
"qs": [
{
"q": "L'équation d'état du gaz parfait s'écrit :",
"c": [
"$PV=nRT$",
"$P=nRTV$",
"$PT=nRV$",
"$PV=RT/n$"
],
"a": 0,
"e": "$PV=nRT$ avec $P$ en Pa, $V$ en $\\mathrm{m^3}$, $T$ en K et $R=8{,}31\\ \\mathrm{J\\cdot mol^{-1}\\cdot K^{-1}}$.",
"s": "Variables d'état et équation d'état"
},
{
"q": "Une température de $27\\ ^\\circ\\mathrm C$ correspond à :",
"c": [
"$27\\ \\mathrm K$",
"$246\\ \\mathrm K$",
"$300\\ \\mathrm K$",
"$327\\ \\mathrm K$"
],
"a": 2,
"e": "$T(\\mathrm K)=\\theta(^\\circ\\mathrm C)+273$, soit $300\\ \\mathrm K$.",
"s": "Variables d'état et équation d'état"
},
{
"q": "Le volume d'une mole de gaz parfait à $0\\ ^\\circ\\mathrm C$ et $1{,}013\\times10^5\\ \\mathrm{Pa}$ vaut environ :",
"c": [
"$1\\ \\mathrm L$",
"$22{,}4\\ \\mathrm L$",
"$24{,}0\\ \\mathrm{m^3}$",
"$224\\ \\mathrm L$"
],
"a": 1,
"e": "$V=\\dfrac{nRT}{P}=\\dfrac{8{,}31\\times273}{1{,}013\\times10^5}\\approx2{,}24\\times10^{-2}\\ \\mathrm{m^3}=22{,}4\\ \\mathrm L$.",
"s": "Variables d'état et équation d'état"
},
{
"q": "À température constante, on divise par 2 le volume d'un gaz parfait (n constant). Sa pression est :",
"c": [
"divisée par 2",
"inchangée",
"doublée",
"multipliée par 4"
],
"a": 2,
"e": "Loi de Boyle-Mariotte : $PV=\\text{cte}$ à $T$ constante, donc $P$ double.",
"s": "Transformations usuelles"
},
{
"q": "Lors d'une transformation à pression extérieure constante $P$, le travail reçu par le gaz vaut :",
"c": [
"$W=P\\,\\Delta V$",
"$W=-P\\,\\Delta V$",
"$W=0$",
"$W=nRT$"
],
"a": 1,
"e": "$W=-P\\,\\Delta V$ : un gaz qui se détend ($\\Delta V>0$) fournit du travail ($W<0$).",
"s": "Travail et chaleur"
},
{
"q": "Le premier principe de la thermodynamique s'écrit, pour un système fermé au repos :",
"c": [
"$\\Delta U=W+Q$",
"$\\Delta U=W-Q$",
"$\\Delta U=0$",
"$W=Q$"
],
"a": 0,
"e": "La variation d'énergie interne est égale à la somme du travail et de la chaleur reçus.",
"s": "Énergie interne et premier principe"
},
{
"q": "Un gaz reçoit $500\\ \\mathrm J$ de chaleur et fournit $200\\ \\mathrm J$ de travail. Son énergie interne varie de :",
"c": [
"$700\\ \\mathrm J$",
"$300\\ \\mathrm J$",
"$-300\\ \\mathrm J$",
"$2{,}5\\ \\mathrm J$"
],
"a": 1,
"e": "$Q=+500\\ \\mathrm J$ et $W=-200\\ \\mathrm J$ (travail fourni), donc $\\Delta U=500-200=300\\ \\mathrm J$.",
"s": "Énergie interne et premier principe"
},
{
"q": "Au cours d'une transformation isochore, le travail échangé est :",
"c": [
"maximal",
"nul",
"égal à la chaleur reçue",
"négatif"
],
"a": 1,
"e": "Isochore = volume constant : $\\Delta V=0$, donc $W=0$ et $\\Delta U=Q$.",
"s": "Transformations usuelles"
},
{
"q": "Une transformation adiabatique est une transformation :",
"c": [
"à température constante",
"à pression constante",
"sans échange de chaleur",
"à volume constant"
],
"a": 2,
"e": "Adiabatique : $Q=0$, donc $\\Delta U=W$.",
"s": "Transformations usuelles"
},
{
"q": "L'énergie interne d'un gaz parfait ne dépend que de :",
"c": [
"sa pression",
"son volume",
"sa température",
"sa masse volumique"
],
"a": 2,
"e": "Première loi de Joule : $U$ ne dépend que de $T$. Lors d'une transformation isotherme d'un gaz parfait, $\\Delta U=0$.",
"s": "Énergie interne et premier principe"
}
]
},
"bcgpg23": {
"course": "Physique générale 2",
"title": "Chapitre 3 — Électrostatique",
"qs": [
{
"q": "La charge élémentaire vaut :",
"c": [
"$1{,}6\\times10^{-19}\\ \\mathrm C$",
"$9{,}1\\times10^{-31}\\ \\mathrm C$",
"$6{,}02\\times10^{23}\\ \\mathrm C$",
"$1\\ \\mathrm C$"
],
"a": 0,
"e": "$e=1{,}6\\times10^{-19}\\ \\mathrm C$ ; toute charge est un multiple entier de $e$.",
"s": "Charge électrique et loi de Coulomb"
},
{
"q": "Deux charges ponctuelles de même signe :",
"c": [
"s'attirent",
"se repoussent",
"n'interagissent pas",
"s'attirent puis se repoussent"
],
"a": 1,
"e": "Charges de même signe : répulsion ; de signes contraires : attraction.",
"s": "Charge électrique et loi de Coulomb"
},
{
"q": "On double la distance entre deux charges ponctuelles. La force de Coulomb est :",
"c": [
"doublée",
"divisée par 2",
"divisée par 4",
"inchangée"
],
"a": 2,
"e": "$F=k\\dfrac{|q_1q_2|}{r^2}$ : la force varie comme $1/r^2$.",
"s": "Charge électrique et loi de Coulomb"
},
{
"q": "Deux charges de $1\\ \\mathrm{\\mu C}$ sont à $1\\ \\mathrm m$ l'une de l'autre ($k=9\\times10^9\\ \\mathrm{N\\cdot m^2\\cdot C^{-2}}$). La force qu'elles exercent l'une sur l'autre vaut :",
"c": [
"$9\\times10^{-3}\\ \\mathrm N$",
"$9\\times10^{9}\\ \\mathrm N$",
"$9\\ \\mathrm N$",
"$10^{-12}\\ \\mathrm N$"
],
"a": 0,
"e": "$F=9\\times10^9\\times\\dfrac{(10^{-6})^2}{1^2}=9\\times10^{-3}\\ \\mathrm N$.",
"s": "Charge électrique et loi de Coulomb"
},
{
"q": "La norme du champ électrostatique créé par une charge ponctuelle $q$ à la distance $r$ vaut :",
"c": [
"$k|q|/r$",
"$k|q|/r^2$",
"$k|q|r$",
"$k q^2/r^2$"
],
"a": 1,
"e": "$E=k\\dfrac{|q|}{r^2}$, radial, dirigé vers l'extérieur si $q>0$.",
"s": "Champ électrostatique"
},
{
"q": "Un électron est placé dans un champ électrostatique $\\vec E$. La force qu'il subit est :",
"c": [
"de même sens que $\\vec E$",
"de sens opposé à $\\vec E$",
"perpendiculaire à $\\vec E$",
"nulle"
],
"a": 1,
"e": "$\\vec F=q\\vec E$ avec $q=-e<0$ : la force est opposée au champ.",
"s": "Champ électrostatique"
},
{
"q": "Une unité possible du champ électrostatique est :",
"c": [
"$\\mathrm{V/m}$",
"$\\mathrm{V\\cdot m}$",
"$\\mathrm{C/m}$",
"$\\mathrm{J}$"
],
"a": 0,
"e": "$E$ s'exprime en $\\mathrm{V/m}$, ou de façon équivalente en $\\mathrm{N/C}$.",
"s": "Champ électrostatique"
},
{
"q": "Le potentiel électrostatique créé par une charge ponctuelle $q$ à la distance $r$ (nul à l'infini) vaut :",
"c": [
"$kq/r$",
"$kq/r^2$",
"$kqr$",
"$k/(qr)$"
],
"a": 0,
"e": "$V=k\\dfrac{q}{r}$ ; il décroît en $1/r$, plus lentement que le champ.",
"s": "Potentiel et énergie potentielle électrique"
},
{
"q": "Le champ électrostatique est toujours dirigé :",
"c": [
"vers les potentiels croissants",
"vers les potentiels décroissants",
"parallèlement aux équipotentielles",
"vers les charges positives"
],
"a": 1,
"e": "$\\vec E=-\\overrightarrow{\\mathrm{grad}}\\,V$ : il pointe vers les potentiels décroissants, perpendiculairement aux équipotentielles.",
"s": "Potentiel et énergie potentielle électrique"
},
{
"q": "L'énergie potentielle électrique d'une charge $q$ placée en un point de potentiel $V$ vaut :",
"c": [
"$E_p=qV$",
"$E_p=q/V$",
"$E_p=\\frac12qV^2$",
"$E_p=V/q$"
],
"a": 0,
"e": "$E_p=qV$. Un ion qui traverse la membrane d'une cellule échange ainsi l'énergie $q\\,\\Delta V$.",
"s": "Potentiel et énergie potentielle électrique"
}
]
},
"bcgpg24": {
"course": "Physique générale 2",
"title": "Chapitre 4 — Électrocinétique",
"qs": [
{
"q": "Un conducteur ohmique de $100\\ \\Omega$ est traversé par un courant de $50\\ \\mathrm{mA}$. La tension à ses bornes vaut :",
"c": [
"$2\\ \\mathrm V$",
"$5\\ \\mathrm V$",
"$5000\\ \\mathrm V$",
"$0{,}5\\ \\mathrm V$"
],
"a": 1,
"e": "$U=RI=100\\times0{,}05=5\\ \\mathrm V$.",
"s": "Courant, tension et loi d'Ohm"
},
{
"q": "Deux résistances de $100\\ \\Omega$ et $200\\ \\Omega$ sont montées en série. La résistance équivalente vaut :",
"c": [
"$66{,}7\\ \\Omega$",
"$150\\ \\Omega$",
"$300\\ \\Omega$",
"$20\\,000\\ \\Omega$"
],
"a": 2,
"e": "En série, les résistances s'additionnent : $100+200=300\\ \\Omega$.",
"s": "Courant, tension et loi d'Ohm"
},
{
"q": "Deux résistances de $100\\ \\Omega$ sont montées en parallèle. La résistance équivalente vaut :",
"c": [
"$200\\ \\Omega$",
"$100\\ \\Omega$",
"$50\\ \\Omega$",
"$25\\ \\Omega$"
],
"a": 2,
"e": "$\\dfrac1{R}=\\dfrac1{100}+\\dfrac1{100}$, d'où $R=50\\ \\Omega$.",
"s": "Courant, tension et loi d'Ohm"
},
{
"q": "La loi des nœuds exprime :",
"c": [
"la conservation de la charge : somme des courants entrants = somme des courants sortants",
"la conservation de l'énergie dans une maille",
"la proportionnalité entre $U$ et $I$",
"l'égalité des tensions en parallèle"
],
"a": 0,
"e": "Les charges ne s'accumulent pas en un nœud : ce qui entre ressort.",
"s": "Lois de Kirchhoff et puissance"
},
{
"q": "La loi des mailles affirme que, le long d'une maille :",
"c": [
"la somme des courants est nulle",
"la somme algébrique des tensions est nulle",
"toutes les tensions sont égales",
"la puissance est constante"
],
"a": 1,
"e": "En parcourant une maille fermée, on revient au même potentiel : $\\sum \\pm U_k=0$.",
"s": "Lois de Kirchhoff et puissance"
},
{
"q": "Une résistance de $10\\ \\Omega$ est traversée par un courant de $2\\ \\mathrm A$. Elle dissipe une puissance de :",
"c": [
"$20\\ \\mathrm W$",
"$40\\ \\mathrm W$",
"$5\\ \\mathrm W$",
"$200\\ \\mathrm W$"
],
"a": 1,
"e": "Effet Joule : $P=RI^2=10\\times2^2=40\\ \\mathrm W$.",
"s": "Lois de Kirchhoff et puissance"
},
{
"q": "La charge $q$ d'un condensateur de capacité $C$ sous la tension $u$ vaut :",
"c": [
"$q=C/u$",
"$q=Cu$",
"$q=u/C$",
"$q=Cu^2$"
],
"a": 1,
"e": "$q=Cu$, avec $C$ en farads.",
"s": "Condensateur et circuit RC"
},
{
"q": "La constante de temps d'un circuit RC avec $R=1\\ \\mathrm{k\\Omega}$ et $C=1\\ \\mathrm{\\mu F}$ vaut :",
"c": [
"$1\\ \\mathrm s$",
"$1\\ \\mathrm{ms}$",
"$1\\ \\mathrm{\\mu s}$",
"$1000\\ \\mathrm s$"
],
"a": 1,
"e": "$\\tau=RC=10^3\\times10^{-6}=10^{-3}\\ \\mathrm s=1\\ \\mathrm{ms}$.",
"s": "Condensateur et circuit RC"
},
{
"q": "Lors de la charge d'un condensateur sous une tension $E$, à l'instant $t=\\tau$, la tension $u_C$ atteint environ :",
"c": [
"$37\\ \\%$ de $E$",
"$50\\ \\%$ de $E$",
"$63\\ \\%$ de $E$",
"$100\\ \\%$ de $E$"
],
"a": 2,
"e": "$u_C(\\tau)=E(1-e^{-1})\\approx0{,}63\\,E$.",
"s": "Condensateur et circuit RC"
},
{
"q": "Dans le modèle électrique de la membrane cellulaire, la bicouche lipidique isolante est représentée par :",
"c": [
"une résistance seule",
"un condensateur",
"un générateur seul",
"un fil conducteur"
],
"a": 1,
"e": "Deux milieux conducteurs (intra et extracellulaires) séparés par un isolant forment un condensateur ; les canaux ioniques ajoutent des résistances en parallèle.",
"s": "Modèle électrique de la membrane cellulaire"
}
]
},
"bcgpg25": {
"course": "Physique générale 2",
"title": "Chapitre 5 — Oscillations et ondes mécaniques",
"qs": [
{
"q": "La période propre d'un oscillateur masse-ressort vaut :",
"c": [
"$T=2\\pi\\sqrt{k/m}$",
"$T=2\\pi\\sqrt{m/k}$",
"$T=2\\pi mk$",
"$T=\\sqrt{mk}$"
],
"a": 1,
"e": "$T_0=2\\pi\\sqrt{m/k}$ : plus la masse est grande, plus l'oscillateur est lent.",
"s": "Oscillateur harmonique"
},
{
"q": "On multiplie par 4 la masse accrochée à un ressort. La période des oscillations est :",
"c": [
"multipliée par 4",
"multipliée par 2",
"divisée par 2",
"inchangée"
],
"a": 1,
"e": "$T\\propto\\sqrt m$ : $\\sqrt4=2$.",
"s": "Oscillateur harmonique"
},
{
"q": "La longueur d'onde $\\lambda$, la célérité $v$ et la fréquence $f$ d'une onde sont liées par :",
"c": [
"$\\lambda=vf$",
"$\\lambda=v/f$",
"$\\lambda=f/v$",
"$\\lambda=v+f$"
],
"a": 1,
"e": "$\\lambda=vT=v/f$ : distance parcourue par l'onde pendant une période.",
"s": "Ondes progressives et célérité"
},
{
"q": "Un son de fréquence $340\\ \\mathrm{Hz}$ se propage dans l'air à $340\\ \\mathrm{m/s}$. Sa longueur d'onde vaut :",
"c": [
"$1\\ \\mathrm m$",
"$340\\ \\mathrm m$",
"$0{,}5\\ \\mathrm m$",
"$115\\ \\mathrm{km}$"
],
"a": 0,
"e": "$\\lambda=v/f=340/340=1\\ \\mathrm m$.",
"s": "Ondes progressives et célérité"
},
{
"q": "Une onde mécanique progressive transporte :",
"c": [
"de la matière",
"de l'énergie, sans transport global de matière",
"de la matière et de l'énergie",
"rien"
],
"a": 1,
"e": "Les points du milieu oscillent autour de leur position : seule l'énergie se propage.",
"s": "Ondes progressives et célérité"
},
{
"q": "Le son ne peut pas se propager :",
"c": [
"dans l'eau",
"dans l'air",
"dans le vide",
"dans les roches"
],
"a": 2,
"e": "Une onde mécanique a besoin d'un milieu matériel ; le son se propage même mieux dans l'eau et les solides que dans l'air.",
"s": "Le son : intensité et niveau sonore"
},
{
"q": "Le niveau sonore vaut $L=10\\log(I/I_0)$. Si l'intensité sonore est multipliée par 10, le niveau :",
"c": [
"est multiplié par 10",
"augmente de $10\\ \\mathrm{dB}$",
"augmente de $1\\ \\mathrm{dB}$",
"double"
],
"a": 1,
"e": "$10\\log(10I/I_0)=10\\log(I/I_0)+10$.",
"s": "Le son : intensité et niveau sonore"
},
{
"q": "L'oreille humaine perçoit les sons dont la fréquence est comprise environ entre :",
"c": [
"$2\\ \\mathrm{Hz}$ et $2\\ \\mathrm{kHz}$",
"$20\\ \\mathrm{Hz}$ et $20\\ \\mathrm{kHz}$",
"$200\\ \\mathrm{Hz}$ et $200\\ \\mathrm{kHz}$",
"$20\\ \\mathrm{kHz}$ et $2\\ \\mathrm{MHz}$"
],
"a": 1,
"e": "En dessous : infrasons (éléphants, séismes) ; au-dessus : ultrasons (chauves-souris, échographie).",
"s": "Le son : intensité et niveau sonore"
},
{
"q": "Lors d'un séisme, les ondes P :",
"c": [
"sont transversales et arrivent en dernier",
"sont longitudinales et arrivent en premier",
"ne se propagent qu'en surface",
"ne traversent pas les roches"
],
"a": 1,
"e": "Les ondes P (primaires) sont des ondes de compression, plus rapides que les ondes S : elles sont enregistrées en premier.",
"s": "Ondes sismiques P et S"
},
{
"q": "Les ondes S ne traversent pas le noyau externe de la Terre. On en déduit que celui-ci est :",
"c": [
"solide",
"liquide",
"gazeux",
"vide"
],
"a": 1,
"e": "Les ondes S (de cisaillement) ne se propagent pas dans les liquides : leur zone d'ombre révèle le noyau externe liquide.",
"s": "Ondes sismiques P et S"
}
]
},
"bcgbio1": {
"course": "Biophysique",
"title": "Chapitre 1 — Phénomènes de transport",
"qs": [
{
"q": "Par diffusion, un soluté se déplace spontanément :",
"c": [
"des régions peu concentrées vers les régions concentrées",
"des régions concentrées vers les régions peu concentrées",
"toujours vers le haut",
"seulement si on agite"
],
"a": 1,
"e": "La diffusion tend à uniformiser la concentration : le flux va dans le sens des concentrations décroissantes.",
"s": "Diffusion et loi de Fick"
},
{
"q": "La première loi de Fick s'écrit ($J$ flux, $D$ coefficient de diffusion, $C$ concentration) :",
"c": [
"$J=-D\\,\\dfrac{dC}{dx}$",
"$J=D\\,C$",
"$J=-\\dfrac{C}{D}$",
"$J=D\\,\\dfrac{dx}{dC}$"
],
"a": 0,
"e": "Le flux est proportionnel au gradient de concentration ; le signe moins indique qu'il va vers les concentrations décroissantes.",
"s": "Diffusion et loi de Fick"
},
{
"q": "L'unité SI du coefficient de diffusion $D$ est :",
"c": [
"$\\mathrm{m/s}$",
"$\\mathrm{m^2/s}$",
"$\\mathrm{mol/m^3}$",
"$\\mathrm{s/m^2}$"
],
"a": 1,
"e": "$D$ s'exprime en $\\mathrm{m^2\\cdot s^{-1}}$ ; pour une petite molécule dans l'eau, $D\\sim10^{-9}\\ \\mathrm{m^2/s}$.",
"s": "Diffusion et loi de Fick"
},
{
"q": "Le temps de diffusion varie comme le carré de la distance. Pour diffuser sur une distance 10 fois plus grande, il faut un temps :",
"c": [
"10 fois plus long",
"100 fois plus long",
"identique",
"10 fois plus court"
],
"a": 1,
"e": "$t\\sim x^2/(2D)$ : la diffusion est efficace à l'échelle de la cellule, très lente à l'échelle d'un organe, d'où la nécessité de la circulation.",
"s": "Diffusion et loi de Fick"
},
{
"q": "Une membrane semi-perméable :",
"c": [
"laisse passer toutes les molécules",
"laisse passer le solvant mais pas certains solutés",
"ne laisse passer que les solutés",
"est imperméable à l'eau"
],
"a": 1,
"e": "Elle est perméable à l'eau et imperméable à certains solutés : c'est la condition de l'osmose.",
"s": "Membranes semi-perméables"
},
{
"q": "Lors de l'osmose, l'eau traverse la membrane :",
"c": [
"du milieu le plus concentré vers le moins concentré",
"du milieu le moins concentré vers le plus concentré",
"dans les deux sens de façon égale",
"seulement si la température augmente"
],
"a": 1,
"e": "L'eau se déplace du milieu hypotonique vers le milieu hypertonique, ce qui tend à égaliser les concentrations.",
"s": "Osmose et pression osmotique (van 't Hoff)"
},
{
"q": "La loi de van 't Hoff donne la pression osmotique d'une solution diluée d'osmolarité $C$ :",
"c": [
"$\\Pi=CRT$",
"$\\Pi=C/RT$",
"$\\Pi=RT/C$",
"$\\Pi=CR/T$"
],
"a": 0,
"e": "$\\Pi=CRT$, de la même forme que l'équation du gaz parfait ($C$ en $\\mathrm{osmol/m^3}$).",
"s": "Osmose et pression osmotique (van 't Hoff)"
},
{
"q": "Une solution de NaCl à $0{,}15\\ \\mathrm{mol/L}$, totalement dissocié, a une osmolarité de :",
"c": [
"$0{,}075\\ \\mathrm{osmol/L}$",
"$0{,}15\\ \\mathrm{osmol/L}$",
"$0{,}30\\ \\mathrm{osmol/L}$",
"$0{,}45\\ \\mathrm{osmol/L}$"
],
"a": 2,
"e": "Chaque NaCl donne deux ions (Na$^+$ et Cl$^-$) : $2\\times0{,}15=0{,}30\\ \\mathrm{osmol/L}$, valeur proche de celle du plasma.",
"s": "Osmose et pression osmotique (van 't Hoff)"
},
{
"q": "La pression osmotique d'une solution à $300\\ \\mathrm{osmol/m^3}$ à $310\\ \\mathrm K$ ($R=8{,}31$ SI) vaut environ :",
"c": [
"$7{,}7\\times10^{3}\\ \\mathrm{Pa}$",
"$7{,}7\\times10^{5}\\ \\mathrm{Pa}$",
"$7{,}7\\times10^{7}\\ \\mathrm{Pa}$",
"$93\\ \\mathrm{Pa}$"
],
"a": 1,
"e": "$\\Pi=300\\times8{,}31\\times310\\approx7{,}7\\times10^5\\ \\mathrm{Pa}$, soit près de 8 fois la pression atmosphérique.",
"s": "Osmose et pression osmotique (van 't Hoff)"
},
{
"q": "Un globule rouge placé dans de l'eau pure :",
"c": [
"se ratatine",
"ne change pas",
"gonfle et peut éclater (hémolyse)",
"se divise"
],
"a": 2,
"e": "L'eau pure est hypotonique : l'eau entre par osmose dans la cellule, qui gonfle jusqu'à la rupture de sa membrane.",
"s": "Applications cellulaires"
}
]
},
"bcgbio2": {
"course": "Biophysique",
"title": "Chapitre 2 — Bioélectricité",
"qs": [
{
"q": "Le potentiel de repos d'un neurone vaut environ :",
"c": [
"$+70\\ \\mathrm{mV}$",
"$-70\\ \\mathrm{mV}$",
"$0\\ \\mathrm{mV}$",
"$-7\\ \\mathrm V$"
],
"a": 1,
"e": "L'intérieur de la cellule est négatif par rapport à l'extérieur : $V_{\\text{int}}-V_{\\text{ext}}\\approx-70\\ \\mathrm{mV}$.",
"s": "Potentiel de repos et équation de Nernst"
},
{
"q": "L'équation de Nernst donne le potentiel d'équilibre d'un ion de valence $z$ :",
"c": [
"$E=\\dfrac{RT}{zF}\\ln\\dfrac{C_{\\text{ext}}}{C_{\\text{int}}}$",
"$E=RTzF\\,C$",
"$E=\\dfrac{zF}{RT}\\,C_{\\text{ext}}$",
"$E=\\dfrac{C_{\\text{int}}}{C_{\\text{ext}}}$"
],
"a": 0,
"e": "$E_{\\text{ion}}=\\dfrac{RT}{zF}\\ln\\dfrac{C_{\\text{ext}}}{C_{\\text{int}}}$ (potentiel intérieur moins extérieur).",
"s": "Potentiel de repos et équation de Nernst"
},
{
"q": "À $37\\ ^\\circ\\mathrm C$, $\\frac{RT}{F}\\ln10\\approx61\\ \\mathrm{mV}$. Pour l'ion K$^+$ dix fois plus concentré à l'intérieur qu'à l'extérieur, le potentiel d'équilibre vaut environ :",
"c": [
"$+61\\ \\mathrm{mV}$",
"$-61\\ \\mathrm{mV}$",
"$-6{,}1\\ \\mathrm{mV}$",
"$0$"
],
"a": 1,
"e": "$E_K=61\\log(1/10)=-61\\ \\mathrm{mV}$ : le potentiel de repos est proche de $E_K$.",
"s": "Potentiel de repos et équation de Nernst"
},
{
"q": "L'équilibre de Donnan apparaît lorsque :",
"c": [
"la membrane est imperméable à l'eau",
"des ions non diffusibles (protéines chargées) sont présents d'un seul côté de la membrane",
"la température est très basse",
"tous les ions traversent librement"
],
"a": 1,
"e": "Les protéines intracellulaires, qui ne traversent pas la membrane, imposent une répartition inégale des ions diffusibles et une différence de potentiel.",
"s": "Équilibre de Donnan"
},
{
"q": "La pompe Na$^+$/K$^+$ :",
"c": [
"fait entrer 3 Na$^+$ et sortir 2 K$^+$ sans énergie",
"fait sortir 3 Na$^+$ et entrer 2 K$^+$ en consommant de l'ATP",
"laisse passer passivement les ions",
"ne transporte que le chlore"
],
"a": 1,
"e": "Transport actif contre les gradients : elle maintient Na$^+$ concentré à l'extérieur et K$^+$ à l'intérieur.",
"s": "Potentiel de repos et équation de Nernst"
},
{
"q": "La phase de dépolarisation du potentiel d'action est due principalement à :",
"c": [
"la sortie de K$^+$",
"l'entrée de Na$^+$",
"l'entrée de Cl$^-$",
"l'arrêt de la pompe Na$^+$/K$^+$"
],
"a": 1,
"e": "L'ouverture des canaux Na$^+$ voltage-dépendants laisse entrer Na$^+$ : le potentiel monte vers $+30\\ \\mathrm{mV}$.",
"s": "Potentiel d'action"
},
{
"q": "La repolarisation qui suit est due principalement à :",
"c": [
"la sortie de K$^+$",
"l'entrée de Na$^+$",
"l'entrée de Ca$^{2+}$",
"la diffusion des protéines"
],
"a": 0,
"e": "Les canaux Na$^+$ s'inactivent et les canaux K$^+$ s'ouvrent : la sortie de K$^+$ ramène le potentiel vers sa valeur de repos.",
"s": "Potentiel d'action"
},
{
"q": "La loi du « tout ou rien » signifie que, une fois le seuil atteint, le potentiel d'action :",
"c": [
"a une amplitude proportionnelle à l'intensité du stimulus",
"a toujours la même amplitude",
"ne se propage pas",
"change de signe"
],
"a": 1,
"e": "L'information est codée par la fréquence des potentiels d'action, pas par leur amplitude.",
"s": "Potentiel d'action"
},
{
"q": "La gaine de myéline :",
"c": [
"ralentit l'influx nerveux",
"permet une conduction saltatoire plus rapide",
"empêche tout potentiel d'action",
"ne joue aucun rôle électrique"
],
"a": 1,
"e": "Isolante, elle oblige l'influx à sauter d'un nœud de Ranvier au suivant : la conduction est beaucoup plus rapide.",
"s": "Conduction de l'influx nerveux"
},
{
"q": "L'influx nerveux se propage à $100\\ \\mathrm{m/s}$ dans une fibre myélinisée. Le temps pour parcourir $1\\ \\mathrm m$ vaut :",
"c": [
"$1\\ \\mathrm{ms}$",
"$10\\ \\mathrm{ms}$",
"$100\\ \\mathrm{ms}$",
"$1\\ \\mathrm s$"
],
"a": 1,
"e": "$t=d/v=1/100=0{,}01\\ \\mathrm s=10\\ \\mathrm{ms}$.",
"s": "Conduction de l'influx nerveux"
}
]
},
"bcgbio3": {
"course": "Biophysique",
"title": "Chapitre 3 — Rayonnements électromagnétiques",
"qs": [
{
"q": "L'énergie d'un photon de fréquence $\\nu$ et de longueur d'onde $\\lambda$ vaut :",
"c": [
"$E=h\\nu=\\dfrac{hc}{\\lambda}$",
"$E=h\\lambda$",
"$E=\\dfrac{h}{\\nu}$",
"$E=mc^2\\nu$"
],
"a": 0,
"e": "$E=h\\nu=hc/\\lambda$ avec $h=6{,}63\\times10^{-34}\\ \\mathrm{J\\cdot s}$.",
"s": "Spectre électromagnétique et photon"
},
{
"q": "Parmi ces rayonnements, lequel transporte les photons les plus énergétiques ?",
"c": [
"l'infrarouge",
"la lumière visible",
"l'ultraviolet",
"les micro-ondes"
],
"a": 2,
"e": "L'énergie croît quand $\\lambda$ diminue : l'UV a la plus courte longueur d'onde des quatre (d'où son effet sur l'ADN).",
"s": "Spectre électromagnétique et photon"
},
{
"q": "Le domaine visible s'étend environ de :",
"c": [
"$40$ à $80\\ \\mathrm{nm}$",
"$400$ à $800\\ \\mathrm{nm}$",
"$4$ à $8\\ \\mathrm{\\mu m}$",
"$400$ à $800\\ \\mathrm{mm}$"
],
"a": 1,
"e": "Du violet ($\\approx400\\ \\mathrm{nm}$) au rouge ($\\approx800\\ \\mathrm{nm}$).",
"s": "Spectre électromagnétique et photon"
},
{
"q": "Dans le vide, toutes les ondes électromagnétiques se propagent à :",
"c": [
"$340\\ \\mathrm{m/s}$",
"$3\\times10^{5}\\ \\mathrm{m/s}$",
"$3\\times10^{8}\\ \\mathrm{m/s}$",
"une vitesse qui dépend de leur fréquence"
],
"a": 2,
"e": "$c=3{,}00\\times10^8\\ \\mathrm{m/s}$, quelle que soit la fréquence.",
"s": "Spectre électromagnétique et photon"
},
{
"q": "L'énergie d'un photon de longueur d'onde $500\\ \\mathrm{nm}$ ($h=6{,}63\\times10^{-34}\\ \\mathrm{J\\cdot s}$, $c=3\\times10^8\\ \\mathrm{m/s}$) vaut environ :",
"c": [
"$4\\times10^{-19}\\ \\mathrm J$",
"$4\\times10^{-28}\\ \\mathrm J$",
"$1\\times10^{-15}\\ \\mathrm J$",
"$3\\times10^{-26}\\ \\mathrm J$"
],
"a": 0,
"e": "$E=\\dfrac{6{,}63\\times10^{-34}\\times3\\times10^8}{5\\times10^{-7}}\\approx4{,}0\\times10^{-19}\\ \\mathrm J$ (environ $2{,}5\\ \\mathrm{eV}$).",
"s": "Spectre électromagnétique et photon"
},
{
"q": "La loi de Beer-Lambert s'écrit ($A$ absorbance, $\\varepsilon$ coefficient d'absorption molaire, $\\ell$ épaisseur, $c$ concentration) :",
"c": [
"$A=\\varepsilon\\ell c$",
"$A=\\varepsilon\\ell/c$",
"$A=\\varepsilon c/\\ell$",
"$A=\\ell c/\\varepsilon$"
],
"a": 0,
"e": "$A=\\varepsilon\\ell c$ : l'absorbance est proportionnelle à la concentration, ce qui permet les dosages.",
"s": "Loi de Beer-Lambert et spectrophotométrie"
},
{
"q": "On double la concentration d'une solution colorée (même cuve, même longueur d'onde). Son absorbance est :",
"c": [
"divisée par 2",
"inchangée",
"doublée",
"multipliée par 4"
],
"a": 2,
"e": "$A$ est proportionnelle à $c$.",
"s": "Loi de Beer-Lambert et spectrophotométrie"
},
{
"q": "Une solution ne transmet que $10\\ \\%$ de la lumière incidente. Son absorbance $A=\\log(I_0/I)$ vaut :",
"c": [
"$0{,}1$",
"$1$",
"$10$",
"$2$"
],
"a": 1,
"e": "$A=\\log(1/0{,}1)=\\log10=1$.",
"s": "Absorption de la lumière"
},
{
"q": "Les feuilles paraissent vertes parce que la chlorophylle :",
"c": [
"absorbe surtout le vert",
"absorbe surtout le bleu et le rouge, et diffuse le vert",
"émet de la lumière verte",
"absorbe toute la lumière"
],
"a": 1,
"e": "La couleur perçue correspond à la lumière non absorbée ; la photosynthèse utilise surtout le bleu et le rouge.",
"s": "Absorption de la lumière"
},
{
"q": "Pour doser une espèce par spectrophotométrie, on règle généralement l'appareil sur la longueur d'onde :",
"c": [
"où l'absorbance est minimale",
"du maximum d'absorption de l'espèce",
"de $800\\ \\mathrm{nm}$ quelle que soit l'espèce",
"de la lumière blanche"
],
"a": 1,
"e": "Au maximum d'absorption, la mesure est la plus sensible et la moins affectée par une petite erreur de réglage.",
"s": "Loi de Beer-Lambert et spectrophotométrie"
}
]
},
"bcgbio4": {
"course": "Biophysique",
"title": "Chapitre 4 — Radioactivité",
"qs": [
{
"q": "Une particule $\\alpha$ est :",
"c": [
"un électron",
"un noyau d'hélium $^4_2\\mathrm{He}$",
"un photon",
"un neutron"
],
"a": 1,
"e": "La particule $\\alpha$ est un noyau d'hélium : 2 protons et 2 neutrons.",
"s": "Désintégrations α, β et γ"
},
{
"q": "Lors d'une désintégration $\\beta^-$, le numéro atomique $Z$ du noyau :",
"c": [
"diminue de 2",
"diminue de 1",
"augmente de 1",
"ne change pas"
],
"a": 2,
"e": "Un neutron se transforme en proton avec émission d'un électron (et d'un antineutrino) : $Z\\to Z+1$, $A$ inchangé.",
"s": "Désintégrations α, β et γ"
},
{
"q": "Le rayonnement $\\gamma$ :",
"c": [
"modifie $A$ et $Z$",
"est un rayonnement électromagnétique de haute énergie qui ne modifie ni $A$ ni $Z$",
"est formé de protons",
"est arrêté par une feuille de papier"
],
"a": 1,
"e": "Il accompagne la désexcitation du noyau ; c'est le plus pénétrant des trois rayonnements.",
"s": "Désintégrations α, β et γ"
},
{
"q": "La loi de décroissance radioactive s'écrit :",
"c": [
"$N(t)=N_0e^{-\\lambda t}$",
"$N(t)=N_0-\\lambda t$",
"$N(t)=N_0e^{\\lambda t}$",
"$N(t)=N_0/(\\lambda t)$"
],
"a": 0,
"e": "Le nombre de noyaux restants décroît exponentiellement, avec la constante radioactive $\\lambda$.",
"s": "Loi de décroissance et activité"
},
{
"q": "La demi-vie $t_{1/2}$ est liée à la constante radioactive $\\lambda$ par :",
"c": [
"$t_{1/2}=\\lambda\\ln2$",
"$t_{1/2}=\\dfrac{\\ln2}{\\lambda}$",
"$t_{1/2}=\\dfrac1{2\\lambda}$",
"$t_{1/2}=2\\lambda$"
],
"a": 1,
"e": "$N(t_{1/2})=N_0/2$ donne $e^{-\\lambda t_{1/2}}=1/2$, soit $t_{1/2}=\\ln2/\\lambda$.",
"s": "Loi de décroissance et activité"
},
{
"q": "Après trois demi-vies, la fraction de noyaux radioactifs restants vaut :",
"c": [
"$1/3$",
"$1/6$",
"$1/8$",
"$1/9$"
],
"a": 2,
"e": "Chaque demi-vie divise le nombre par 2 : $(1/2)^3=1/8$.",
"s": "Loi de décroissance et activité"
},
{
"q": "L'activité d'un échantillon radioactif s'exprime en becquerels. $1\\ \\mathrm{Bq}$ correspond à :",
"c": [
"un noyau",
"une désintégration par seconde",
"un gramme de matière radioactive",
"une dose absorbée de $1\\ \\mathrm J/\\mathrm{kg}$"
],
"a": 1,
"e": "$A(t)=\\lambda N(t)$, en désintégrations par seconde.",
"s": "Loi de décroissance et activité"
},
{
"q": "Un fragment de bois ne contient plus que le quart de son carbone 14 initial ($t_{1/2}\\approx5730$ ans). Son âge est d'environ :",
"c": [
"$1430$ ans",
"$5730$ ans",
"$11\\,460$ ans",
"$22\\,920$ ans"
],
"a": 2,
"e": "Un quart = deux demi-vies : $2\\times5730=11\\,460$ ans.",
"s": "Datation : carbone 14, potassium-argon"
},
{
"q": "Pour dater une roche volcanique de plusieurs millions d'années, on utilise plutôt :",
"c": [
"le carbone 14",
"le couple potassium-argon",
"le tritium",
"l'iode 131"
],
"a": 1,
"e": "La demi-vie du $^{40}\\mathrm K$ (environ $1{,}25$ milliard d'années) convient aux temps géologiques ; le carbone 14 ne date que jusqu'à environ $50\\,000$ ans.",
"s": "Datation : carbone 14, potassium-argon"
},
{
"q": "Les trois règles de base de la radioprotection consistent à :",
"c": [
"réduire la durée d'exposition, augmenter la distance, interposer un écran",
"augmenter la durée, réduire la distance, supprimer l'écran",
"chauffer la source, l'agiter, la diluer",
"porter des lunettes de soleil, des gants et un masque"
],
"a": 0,
"e": "Temps, distance, écran : la dose reçue diminue avec la durée, avec le carré de la distance et avec l'épaisseur du blindage.",
"s": "Effets biologiques et radioprotection"
}
]
},
"bcgbio5": {
"course": "Biophysique",
"title": "Chapitre 5 — Ultrasons",
"qs": [
{
"q": "Les ultrasons sont des ondes sonores de fréquence :",
"c": [
"inférieure à $20\\ \\mathrm{Hz}$",
"comprise entre $20\\ \\mathrm{Hz}$ et $20\\ \\mathrm{kHz}$",
"supérieure à $20\\ \\mathrm{kHz}$",
"supérieure à $10^{15}\\ \\mathrm{Hz}$"
],
"a": 2,
"e": "Au-delà de $20\\ \\mathrm{kHz}$, l'oreille humaine ne perçoit plus le son ; l'échographie utilise des fréquences de quelques MHz.",
"s": "Propagation et impédance acoustique"
},
{
"q": "L'impédance acoustique d'un milieu de masse volumique $\\rho$ dans lequel le son se propage à la célérité $c$ vaut :",
"c": [
"$Z=\\rho c$",
"$Z=\\rho/c$",
"$Z=c/\\rho$",
"$Z=\\rho c^2$"
],
"a": 0,
"e": "$Z=\\rho c$, en $\\mathrm{kg\\cdot m^{-2}\\cdot s^{-1}}$.",
"s": "Propagation et impédance acoustique"
},
{
"q": "Dans les tissus mous du corps humain, les ultrasons se propagent à environ :",
"c": [
"$340\\ \\mathrm{m/s}$",
"$1540\\ \\mathrm{m/s}$",
"$3\\times10^8\\ \\mathrm{m/s}$",
"$15\\ \\mathrm{m/s}$"
],
"a": 1,
"e": "Valeur proche de celle de l'eau ; les échographes sont étalonnés sur $1540\\ \\mathrm{m/s}$.",
"s": "Propagation et impédance acoustique"
},
{
"q": "À l'interface entre deux milieux d'impédances $Z_1$ et $Z_2$, le coefficient de réflexion en intensité vaut :",
"c": [
"$R=\\left(\\dfrac{Z_2-Z_1}{Z_2+Z_1}\\right)^2$",
"$R=\\dfrac{Z_1}{Z_2}$",
"$R=Z_1Z_2$",
"$R=Z_2-Z_1$"
],
"a": 0,
"e": "Plus les impédances sont différentes, plus l'onde est réfléchie.",
"s": "Réflexion à une interface"
},
{
"q": "On place un gel entre la sonde d'échographie et la peau pour :",
"c": [
"refroidir la peau",
"supprimer la couche d'air, dont l'impédance très différente renverrait presque toute l'onde",
"désinfecter la sonde",
"augmenter la fréquence"
],
"a": 1,
"e": "L'impédance de l'air est plusieurs milliers de fois plus faible que celle des tissus : sans gel, la réflexion serait quasi totale.",
"s": "Réflexion à une interface"
},
{
"q": "Un écho revient $130\\ \\mathrm{\\mu s}$ après l'émission ($c=1540\\ \\mathrm{m/s}$). L'interface réfléchissante se trouve à une profondeur d'environ :",
"c": [
"$5\\ \\mathrm{cm}$",
"$10\\ \\mathrm{cm}$",
"$20\\ \\mathrm{cm}$",
"$2\\ \\mathrm{mm}$"
],
"a": 1,
"e": "Aller-retour : $2d=c\\,\\Delta t$, donc $d=\\dfrac{1540\\times130\\times10^{-6}}{2}\\approx0{,}10\\ \\mathrm m$.",
"s": "Principe de l'échographie"
},
{
"q": "En échographie, augmenter la fréquence des ultrasons :",
"c": [
"améliore la résolution mais réduit la profondeur explorée",
"augmente la profondeur explorée",
"n'a aucun effet",
"rend les ultrasons audibles"
],
"a": 0,
"e": "Une longueur d'onde plus courte distingue des détails plus fins, mais l'atténuation dans les tissus augmente avec la fréquence.",
"s": "Principe de l'échographie"
},
{
"q": "Lorsqu'une source sonore se rapproche de l'observateur, la fréquence perçue est :",
"c": [
"plus faible que la fréquence émise",
"égale à la fréquence émise",
"plus élevée que la fréquence émise",
"nulle"
],
"a": 2,
"e": "Effet Doppler : les fronts d'onde sont resserrés devant la source.",
"s": "Effet Doppler"
},
{
"q": "En médecine, l'échographie Doppler permet surtout de mesurer :",
"c": [
"la température d'un organe",
"la vitesse d'écoulement du sang",
"la concentration en glucose",
"la masse d'un organe"
],
"a": 1,
"e": "Le décalage de fréquence de l'onde réfléchie par les globules rouges donne leur vitesse.",
"s": "Effet Doppler"
},
{
"q": "Contrairement aux rayons X, les ultrasons utilisés en échographie :",
"c": [
"sont ionisants",
"ne sont pas ionisants",
"sont des ondes électromagnétiques",
"se propagent dans le vide"
],
"a": 1,
"e": "Ce sont des ondes mécaniques de faible énergie : l'échographie est sans danger connu, même pendant la grossesse.",
"s": "Effet Doppler"
}
]
}
});
