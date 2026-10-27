/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* =====================================================================
   ANNONCES ET CALENDRIER — fichier à mettre à jour
   ---------------------------------------------------------------------
   ANNONCES : la plus récente marquée "important: true" s'affiche en
   bandeau sur la page d'accueil.
     date   : "AAAA-MM-JJ"
     titre  : texte court
     texte  : détail (facultatif)
     lien   : page du site (facultatif), ex. "entrainement.html"
     important : true pour l'afficher en bandeau
   CALENDRIER : séances et évaluations.
     date   : "AAAA-MM-JJ"     heure : "08:00" (facultatif)
     type   : "cours" | "td" | "controle" | "examen" | "autre"
     titre  : intitulé          lieu  : salle (facultatif)
     detail : consignes (facultatif)
   ===================================================================== */
window.ANNONCES = [
  { date: "2026-10-27", important: true,
    titre: "Électricité : électrocinétique et champ magnétique en ligne",
    texte: "Électricité 1, chapitre 4 « Électrocinétique : courant continu et réseaux linéaires » (Kirchhoff, mailles, superposition, Thévenin, Norton, Millman, Kennelly) et Électricité 2, chapitre 1 « Le champ magnétique » (Biot et Savart, Ampère, Lorentz, Laplace, dipôle magnétique) : supports avec démonstrations, diaporamas (en ligne et PowerPoint), séries de TD corrigées, quiz et exercices d'entraînement.",
    lien: "index.html#elec2" },
  { date: "2026-10-27", important: true,
    titre: "Trois nouveaux TP du semestre 2 : prisme, circuit RC, circuit RLC",
    texte: "Conformément au syllabus de l'EC TP de Physique 2 (LPCI1251) : TP 10 « Le prisme » (minimum de déviation, indice, loi de Cauchy), TP 11 « Charge et décharge d'un condensateur » (constante de temps τ = RC) et TP 12 « Circuit RLC série » (résonance, bande passante, facteur de qualité). Le fascicule de TP (72 pages) contient les trois nouveaux chapitres.",
    lien: "tp.html#prisme" },
  { date: "2026-10-19", important: true,
    titre: "Nouveau TP 9 : association de lentilles",
    texte: "Lentilles accolées et lentilles séparées : mesure la vergence d'une lentille convergente, déduis celle d'une lentille divergente en l'accolant (V = V₁ + V₂), puis étudie deux lentilles séparées et vérifie la formule de Gullstrand. Le chapitre TP 9 est ajouté au fascicule.",
    lien: "tp.html#assoc" },
  { date: "2026-10-17", important: true,
    titre: "Optique : exercices et quiz avec schémas",
    texte: "15 nouvelles questions de quiz s'appuient sur un schéma (rayon réfracté, réflexion totale, miroirs, prisme, lame, lentilles). En entraînement, 14 exercices d'optique sont désormais illustrés (repère ◩) : lecture d'angles, cuve d'eau, deux miroirs plans, minimum de déviation, constructions sur quadrillage pour le miroir concave et la lentille mince.",
    lien: "entrainement.html" },
  { date: "2026-10-17", important: true,
    titre: "Optique : quiz, exercices d'entraînement et simulations",
    texte: "Pour chacun des 5 chapitres d'optique : un quiz de 10 questions corrigées et 3 exercices d'entraînement à valeurs aléatoires avec correction détaillée. Quatre nouvelles simulations : réfraction et réflexion totale, prisme et dispersion, lentille mince, miroir sphérique.",
    lien: "simulations.html#refrac" },
  { date: "2026-10-17", important: true,
    titre: "TP n°6 : Mesures électriques (multimètre)",
    texte: "Le TP n°6 devient « Mesures électriques : utilisation du multimètre » : voltmètre, ampèremètre et ohmmètre, choix du calibre, branchement et incertitudes. Le fascicule de TP a été mis à jour.",
    lien: "tp.html#mesures" },
  { date: "2026-10-16", important: true,
    titre: "Optique géométrique complète : chapitre 5 en ligne",
    texte: "Les lentilles minces : formule des opticiens, relations de Descartes et de Newton, construction des images (loupe, projecteur), associations (lentilles accolées, microscope, lunette) et aberrations. Le cours d'optique compte désormais 5 chapitres, chacun avec support, diaporama et série de TD corrigée.",
    lien: "./#opt" },
  { date: "2026-10-16", important: true,
    titre: "Optique géométrique — chapitre 4 en ligne",
    texte: "Miroirs et dioptres sphériques : relations de conjugaison (sommet, centre, Newton), foyers, vergence, grandissement et construction des images. Support de cours, diaporama (en ligne et PowerPoint) et série de TD n°4 avec corrigé détaillé.",
    lien: "./#opt" },
  { date: "2026-10-16", important: true,
    titre: "Optique géométrique — chapitre 3 en ligne",
    texte: "Prisme et lame à faces parallèles : formules du prisme, conditions d'émergence, minimum de déviation et mesure d'un indice, dispersion, lame à faces parallèles. Support de cours, diaporama (en ligne et PowerPoint) et série de TD n°3 avec corrigé détaillé.",
    lien: "./#opt" },
  { date: "2026-10-16", important: true,
    titre: "Optique géométrique — chapitre 2 en ligne",
    texte: "Formation des images et systèmes plans : objets et images réels ou virtuels, stigmatisme, conditions de Gauss, foyers, vergence et grandissements, miroir plan et dioptre plan (profondeur apparente). Support de cours, diaporama (en ligne et PowerPoint) et série de TD n°2 avec corrigé détaillé.",
    lien: "./#opt" },
  { date: "2026-10-16", important: true,
    titre: "Nouveau cours : Optique géométrique — chapitre 1",
    texte: "Lois fondamentales de l'optique géométrique : nature de la lumière, indice, principe de Fermat, lois de Snell-Descartes démontrées pas à pas, réflexion totale et fibre optique. Support de cours, diaporama (en ligne et PowerPoint) et série de TD n°1 avec corrigé détaillé.",
    lien: "./#opt" },
  { date: "2026-10-15",
    titre: "TP 4 : câble toi-même ton circuit",
    texte: "Dans le TP de la loi d'Ohm, c'est maintenant toi qui réalises le montage : place les résistors, relie les bornes du générateur, de l'interrupteur, de l'ampèremètre et du voltmètre. Attention aux erreurs comme en salle : ampèremètre en dérivation (court-circuit), appareil branché à l'envers…",
    lien: "tp.html#ohm" },
  { date: "2026-10-14",
    titre: "Nouveau : le fascicule de travaux pratiques",
    texte: "Les TP réunis dans un PDF : rappels théoriques avec démonstrations, schémas de montage, protocoles, tableaux de mesures à remplir et questions d'exploitation. À lire avant chaque séance.",
    lien: "docs/Fascicule_TP_Physique_L1.pdf" },
  { date: "2026-10-14",
    titre: "Tous les diaporamas sont en ligne, aussi en PowerPoint",
    texte: "Nouveaux diaporamas pour les chapitres 1 et 2 d'électricité. Chaque chapitre de mécanique et d'électricité a maintenant son diaporama à consulter en ligne et à télécharger au format PowerPoint (bouton PPTX).",
    lien: "./#elec" },
  { date: "2026-10-14",
    titre: "Entraînement : 10 exercices avec schéma dans un repère orthonormé",
    texte: "Lecture de vecteurs, moment d'une force, tir d'un projectile, mouvement circulaire, plan incliné, équilibre de trois forces, travail sur deux chemins, forces de Coulomb, champ de deux charges et champ du dipôle : chaque schéma est redessiné avec les nouvelles valeurs. Les exercices illustrés sont marqués d'un petit carré orange.",
    lien: "entrainement.html" },
  { date: "2026-10-14",
    titre: "Nouveau : chapitre 3 d'électrostatique — Le dipôle",
    texte: "Support de cours complet (démonstrations pas à pas, figures, fiche de synthèse), diaporama de 33 diapositives (à consulter en ligne ou à télécharger au format PowerPoint), série de TD n°2 avec corrigé détaillé, quiz, exercices d'entraînement et une nouvelle simulation : le dipôle dans un champ uniforme.",
    lien: "./#elec" },
  { date: "2026-10-14",
    titre: "TP : connexion avec ton code personnel",
    texte: "Pour soumettre un compte rendu de TP, connecte-toi en haut de la page TP avec ton numéro de carte et le code personnel remis par ton enseignant. Chaque étudiant reçoit son propre matériel et ses propres questions : des mesures recopiées sont détectées automatiquement. Ne communique ton code à personne.",
    lien: "tp.html" },
  { date: "2026-10-13",
    titre: "Travaux pratiques : 8 TP simulés",
    texte: "Pendule simple, oscillateur harmonique, pendule de torsion, mesures de résistances, oscilloscope cathodique, mesures électriques (multimètre), lentilles et microscope : protocole détaillé, mesures simulées et compte rendu à remplir en ligne.",
    lien: "tp.html" },
  { date: "2026-10-13",
    titre: "Exercices d'entraînement en ligne",
    texte: "Des exercices dont les données changent à chaque essai, corrigés pas à pas, pour chaque chapitre.",
    lien: "entrainement.html" },
  { date: "2026-10-13",
    titre: "Le site fonctionne sans connexion",
    texte: "Après une première visite avec internet, les cours, les TD, les quiz et les simulations restent disponibles hors connexion. Le site peut aussi être installé comme une application sur le téléphone." },
  { date: "2026-10-13",
    titre: "Quiz et simulations en ligne",
    texte: "Un quiz de 10 questions par chapitre et cinq simulations interactives (champ électrostatique, théorème de Gauss, anneau chargé, base de Frenet, énergie potentielle).",
    lien: "simulations.html" },
  { date: "2026-10-10",
    titre: "Électricité : série de TD n°1 disponible",
    texte: "Série de 11 exercices sur les chapitres 1 et 2 (charges, champ, potentiel, théorème de Gauss), avec corrigé détaillé." }
];

window.CALENDRIER = [
  /* Dates PROVISOIRES (exemple) : remplacer par le vrai planning, puis retirer "provisoire: true". */
  { date: "2026-10-15", heure: "08:00", type: "cours", provisoire: true, titre: "Électricité : fin du chapitre 2 (théorème de Gauss)", lieu: "Amphi A" },
  { date: "2026-10-20", heure: "10:00", type: "td", provisoire: true, titre: "TD d'électricité n°1 : exercices 1 à 5", lieu: "Salle TD 2", detail: "Préparer les exercices 1 à 3 avant la séance." },
  { date: "2026-10-22", heure: "10:00", type: "td", provisoire: true, titre: "TD de mécanique n°4 : exercices 1 à 4", lieu: "Salle TD 2", detail: "Revoir le théorème de l'énergie cinétique." },
  { date: "2026-10-27", heure: "10:00", type: "td", provisoire: true, titre: "TD d'électricité n°1 : exercices 6 à 8 (fil, anneau, disque)", lieu: "Salle TD 2" },
  { date: "2026-10-29", heure: "10:00", type: "td", provisoire: true, titre: "TD de mécanique n°4 : exercices 5 à 8", lieu: "Salle TD 2" },
  { date: "2026-11-03", heure: "10:00", type: "td", provisoire: true, titre: "TD d'électricité n°1 : exercices 9 à 11 (théorème de Gauss)", lieu: "Salle TD 2" },
  { date: "2026-11-10", heure: "08:00", type: "controle", provisoire: true, titre: "Contrôle continu n°1 : électricité, chapitres 1 et 2", lieu: "Amphi A", detail: "Durée 1 h 30. Calculatrice autorisée, documents interdits." },
  { date: "2026-11-17", heure: "08:00", type: "controle", provisoire: true, titre: "Contrôle continu n°2 : mécanique, chapitres 3 et 4", lieu: "Amphi A", detail: "Durée 1 h 30. Calculatrice autorisée, documents interdits." },
  { date: "2026-12-14", heure: "08:00", type: "examen", provisoire: true, titre: "Examen de fin de semestre : Physique I (mécanique)", lieu: "Amphi A", detail: "Durée 3 h. Tous les chapitres de mécanique." },
  { date: "2026-12-16", heure: "08:00", type: "examen", provisoire: true, titre: "Examen de fin de semestre : électricité", lieu: "Amphi A", detail: "Durée 2 h. Chapitres 1 et 2." }
];
