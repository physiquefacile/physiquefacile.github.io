/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* =====================================================================
   FICHES D'ACTIVITÉS — une feuille de route par chapitre, pour l'étudiant
   ---------------------------------------------------------------------
   Une seule source pour la page activites.html et pour la fiche PDF (générée par un script).
   Texte simple ; les formules sont écrites en LaTeX entre $…$.
   Clés d'un chapitre : ec, course (onglet du site), n, titre, support (nom du PDF), diapo (diapositive
   de la page 1 du contenu = décalage), td {e, c}, quiz, exos, duree, prerequis[], objectifs[],
   accroche {q, r}, etapes[{t, sec, duree, items[{k, t, d, doc, page, url, act}], acts[{n, q, r}], check[]}],
   bilan[{c, ou}].
   k (type d'activité) : lire, voir, faire, td, exos, quiz, tp.
   ===================================================================== */
window.ACTIVITES = {
  elec4: {
    ec: "Électricité 1 (LPCI1122)", course: "elec", n: 4,
    titre: "Électrocinétique : courant continu et réseaux linéaires",
    support: "Electricite_Chapitre_4_Electrocinetique", diapoOffset: 3,
    td: { n: 3, e: "TD_Electricite_3_enonces", c: "TD_Electricite_3_corrige" },
    quiz: "elec4", exos: "elec4", pdf: "Fiche_activites_Electricite_Chapitre_4",
    duree: "environ 10 h de travail personnel, sur 3 semaines",
    prerequis: [
      "Chapitres 1 et 2 : charge électrique, potentiel électrostatique",
      "Résoudre un système de 2 ou 3 équations linéaires (substitution, Cramer)",
      "Électricité du baccalauréat : loi d'Ohm, circuits série et parallèle"
    ],
    objectifs: [
      "Définir l'intensité, la tension et la puissance ; utiliser les conventions récepteur et générateur",
      "Associer des résistances ; utiliser les diviseurs de tension et de courant ; modéliser un générateur et un récepteur",
      "Écrire et résoudre les équations de Kirchhoff ; appliquer la méthode des mailles",
      "Utiliser les théorèmes de superposition, de Thévenin, de Norton et de Millman, et la transformation de Kennelly",
      "Décrire un condensateur et une bobine en régime continu ; distinguer régime transitoire et régime permanent"
    ],
    accroche: {
      q: "Quand on démarre une voiture, les phares baissent nettement pendant que le démarreur tourne. La batterie est pourtant la même. Pourquoi ? Note ton idée ici, puis vérifie-la à la fin de l'étape 1.",
      r: "Le démarreur appelle un courant très intense (une centaine d'ampères). La tension aux bornes de la batterie vaut $U=e-rI$ : la chute de tension $rI$ dans sa résistance interne devient importante, donc $U$ diminue et les phares, alimentés sous $U$, éclairent moins."
    },
    etapes: [
      {
        t: "Grandeurs électriques et dipôles", sec: "4.1 – 4.2", duree: "2 h 20",
        items: [
          { k: "lire", t: "Lire le support de cours, sections 4.1 et 4.2 (définitions, conventions, associations, diviseurs, générateurs)", doc: "support", page: 4, d: "45 min" },
          { k: "voir", t: "Revoir les diapositives des sections 4.1 et 4.2", doc: "diapo", page: 1, d: "20 min" },
          { k: "faire", t: "Faire l'activité 1 de cette fiche", act: 1, d: "15 min" },
          { k: "td", t: "Série de TD n°3 : exercices 1, 2 et 3 (préparer avant la séance de TD)", doc: "td", d: "1 h" },
          { k: "tp", t: "TP 4 « Loi d'Ohm » sur la plateforme, dès que ton enseignant ouvre la séance", url: "tp.html#ohm", d: "séance" }
        ],
        acts: [
          { n: 1, q: "Une pile de f.é.m. $e=4{,}5$ V et de résistance interne $r=1{,}5\\ \\Omega$ alimente un résistor $R=7{,}5\\ \\Omega$. Calcule l'intensité $I$, la tension $U$ aux bornes de la pile et la puissance reçue par le résistor.", r: "$I=\\dfrac{e}{r+R}=\\dfrac{4{,}5}{9}=0{,}50$ A ; $U=e-rI=4{,}5-0{,}75=3{,}75$ V (c'est aussi $RI$) ; $P=RI^2=1{,}875$ W." }
        ],
        check: [
          "Je sais orienter un courant et une tension en convention récepteur et en convention générateur",
          "Je sais calculer une résistance équivalente et appliquer les diviseurs de tension et de courant",
          "Je sais utiliser $U=e-rI$ (générateur) et $U=e'+r'I$ (récepteur)"
        ]
      },
      {
        t: "Lois de Kirchhoff et méthode des mailles", sec: "4.3 – 4.5", duree: "2 h 20",
        items: [
          { k: "lire", t: "Lire le support, sections 4.3 à 4.5 (réseaux, lois de Kirchhoff, méthode des mailles)", doc: "support", page: 8, d: "45 min" },
          { k: "faire", t: "Refaire seul, sans regarder, l'application au réseau de référence : tu dois trouver $I_1=2$ A, $I_2\\approx0{,}67$ A et $I\\approx1{,}33$ A", doc: "support", page: 9, d: "20 min" },
          { k: "faire", t: "Faire l'activité 2 de cette fiche", act: 2, d: "10 min" },
          { k: "td", t: "Série de TD n°3 : exercices 4 et 5", doc: "td", d: "50 min" },
          { k: "exos", t: "Exercice d'entraînement n°2 « Lois de Kirchhoff » (nouvelles valeurs à chaque essai, jusqu'à réussir 2 fois de suite)", ex: 2, d: "15 min" }
        ],
        acts: [
          { n: 2, q: "Un réseau comporte 4 nœuds et 6 branches. Combien d'équations de nœuds indépendantes, combien de mailles indépendantes et combien d'équations au total peut-on écrire ? Combien y a-t-il d'inconnues ?", r: "$n-1=3$ équations de nœuds, $m=b-n+1=3$ mailles indépendantes, soit 6 équations pour 6 intensités inconnues (une par branche)." }
        ],
        check: [
          "Je sais compter les nœuds, les branches et les mailles indépendantes d'un réseau",
          "Je sais écrire la loi des nœuds et la loi des mailles avec des signes corrects",
          "Je sais poser et résoudre le système de la méthode des mailles"
        ]
      },
      {
        t: "Théorèmes généraux", sec: "4.6 – 4.9", duree: "2 h 55",
        items: [
          { k: "lire", t: "Lire le support, sections 4.6 à 4.9 (superposition, Thévenin, Norton, Millman, Kennelly)", doc: "support", page: 11, d: "1 h" },
          { k: "faire", t: "Vérifier que Thévenin redonne le résultat de Kirchhoff sur le réseau de référence : $E_{Th}=9{,}6$ V, $R_{Th}=1{,}2\\ \\Omega$, donc $I=9{,}6/(1{,}2+6)\\approx1{,}33$ A", doc: "support", page: 12, d: "10 min" },
          { k: "faire", t: "Faire les activités 3 et 4 de cette fiche", act: 3, d: "15 min" },
          { k: "td", t: "Série de TD n°3 : exercices 6, 7 et 8", doc: "td", d: "1 h 15" },
          { k: "exos", t: "Exercice d'entraînement n°3 « Théorème de Thévenin »", ex: 3, d: "15 min" }
        ],
        acts: [
          { n: 3, q: "Une source idéale $E=12$ V alimente un diviseur $R_1=R_2=1$ k$\\Omega$. On branche une charge $R_c=500\\ \\Omega$ aux bornes de $R_2$. Donne le générateur de Thévenin vu par la charge, puis le courant dans la charge et le courant de Norton.", r: "$E_{Th}=E\\,\\dfrac{R_2}{R_1+R_2}=6$ V ; $R_{Th}=R_1\\parallel R_2=500\\ \\Omega$ ; $I=\\dfrac{6}{500+500}=6$ mA ; $I_N=\\dfrac{E_{Th}}{R_{Th}}=12$ mA." },
          { n: 4, q: "Trois résistances de $12\\ \\Omega$ sont montées en triangle. Par quelle étoile peut-on les remplacer ? Inversement, une étoile de trois résistances de $5\\ \\Omega$ équivaut à quel triangle ?", r: "Étoile de trois résistances de $12/3=4\\ \\Omega$. Triangle de trois résistances de $3\\times5=15\\ \\Omega$." }
        ],
        check: [
          "Je sais appliquer le théorème de superposition (et je sais qu'il ne s'applique pas aux puissances)",
          "Je sais déterminer $E_{Th}$ (tension à vide) et $R_{Th}$ (sources éteintes), puis passer au modèle de Norton",
          "Je sais utiliser le théorème de Millman et la transformation triangle–étoile"
        ]
      },
      {
        t: "Régimes variables et bilan du chapitre", sec: "4.10 – 4.11", duree: "1 h 40",
        items: [
          { k: "lire", t: "Lire le support, section 4.10 (condensateur, bobine, régimes) et la fiche « L'essentiel du chapitre »", doc: "support", page: 16, d: "30 min" },
          { k: "faire", t: "Faire l'activité 5 de cette fiche", act: 5, d: "10 min" },
          { k: "td", t: "Série de TD n°3 : exercice 9", doc: "td", d: "20 min" },
          { k: "quiz", t: "Quiz d'auto-évaluation du chapitre 4 : objectif 8/10 au moins (refaire jusqu'à l'atteindre)", d: "15 min" },
          { k: "exos", t: "Exercice d'entraînement n°1 « Générateur, résistor et moteur en série »", ex: 1, d: "15 min" },
          { k: "tp", t: "Pour aller plus loin (semestre 2) : TP 11 « Charge et décharge d'un condensateur » et TP 12 « Circuit RLC série »", url: "tp.html#rc", d: "—" }
        ],
        acts: [
          { n: 5, q: "Un condensateur $C=100\\ \\mu$F est chargé sous $12$ V ; une bobine $L=0{,}5$ H est parcourue par un courant constant de $2$ A. Calcule la charge du condensateur et l'énergie stockée dans chacun des deux dipôles. Lequel se comporte comme un interrupteur ouvert en régime continu ?", r: "$q=CU=1{,}2$ mC ; $W_C=\\frac12CU^2=7{,}2$ mJ ; $W_L=\\frac12LI^2=1$ J. En régime continu, le condensateur se comporte comme un interrupteur ouvert ($i=C\\,\\mathrm{d}u/\\mathrm{d}t=0$) ; la bobine idéale, comme un fil." }
        ],
        check: [
          "Je connais les relations $i=C\\,\\mathrm{d}u/\\mathrm{d}t$ et $u=ri+L\\,\\mathrm{d}i/\\mathrm{d}t$ et les énergies associées",
          "Je sais quelles grandeurs sont continues (tension du condensateur, courant de la bobine)",
          "J'ai obtenu au moins 8/10 au quiz du chapitre"
        ]
      }
    ],
    bilan: [
      { c: "Grandeurs, conventions et puissance", ou: "Support § 4.1 ; TD n°3, ex. 2" },
      { c: "Associations, diviseurs, générateurs et récepteurs", ou: "Support § 4.2 ; TD n°3, ex. 1 à 3" },
      { c: "Lois de Kirchhoff et méthode des mailles", ou: "Support § 4.4 – 4.5 ; TD n°3, ex. 4 et 5" },
      { c: "Superposition, Thévenin, Norton, Millman, Kennelly", ou: "Support § 4.6 – 4.9 ; TD n°3, ex. 6 à 8" },
      { c: "Condensateur et bobine en régime continu", ou: "Support § 4.10 ; TD n°3, ex. 9" }
    ]
  }
};
