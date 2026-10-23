/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* =====================================================================
   VIDÉOS (YouTube et simulations 3D) — fichier à compléter
   ---------------------------------------------------------------------
   Une liste par chapitre. Pour chaque vidéo :
     titre : intitulé affiché
     url   : lien YouTube (https://www.youtube.com/watch?v=… ou https://youtu.be/…)
     duree : facultatif, ex. "12 min"
     note  : facultatif, ex. "Démonstration du théorème de Gauss"
   Vidéo hébergée sur le site : fichier (au lieu de url) + image (aperçu)
   Les chapitres sans vidéo n'affichent rien.
   ===================================================================== */
window.VIDEOS = {
  meca1: [
    { titre: "Produit vectoriel", fichier: "videos/3d/produit_vectoriel.mp4", image: "videos/3d/produit_vectoriel.jpg", duree: "24 s", note: "V₁ ∧ V₂ perpendiculaire au plan, norme = aire, anticommutativité", type: "3d" },
    { titre: "Moment d'un vecteur", fichier: "videos/3d/moment.mp4", image: "videos/3d/moment.jpg", duree: "24 s", note: "M_O = OA ∧ AB, bras de levier, glissement sur la droite d'action", type: "3d" }
  ],   // Mécanique — Ch. 1 Calcul vectoriel
  meca2: [
    { titre: "Base de Frenet", fichier: "videos/3d/frenet.mp4", image: "videos/3d/frenet.jpg", duree: "24 s", note: "Mouvement circulaire qui accélère, uniforme, puis freine : γ_T et γ_N", type: "3d" },
    { titre: "Coordonnées cylindriques", fichier: "videos/3d/cylindriques.mp4", image: "videos/3d/cylindriques.jpg", duree: "24 s", note: "Mouvement hélicoïdal : OM = ρ u_ρ + z u_z, base locale, vitesse", type: "3d" }
  ],   // Mécanique — Ch. 2 Cinématique
  meca3: [
    { titre: "Plan incliné avec frottement", fichier: "videos/3d/plan_incline.mp4", image: "videos/3d/plan_incline.jpg", duree: "24 s", note: "Le bloc démarre quand tan α > µ_s, puis a = g(sin α − µ_d cos α)", type: "3d" },
    { titre: "Force centrale et loi des aires", fichier: "videos/3d/force_centrale.mp4", image: "videos/3d/force_centrale.jpg", duree: "24 s", note: "Moment cinétique constant, mouvement plan, aires égales", type: "3d" }
  ],   // Mécanique — Ch. 3 Dynamique
  meca4: [
    { titre: "Travail du poids", fichier: "videos/3d/travail_poids.mp4", image: "videos/3d/travail_poids.jpg", duree: "24 s", note: "Trois chemins de A à B, même travail : force conservative", type: "3d" },
    { titre: "Équilibre et stabilité", fichier: "videos/3d/stabilite.mp4", image: "videos/3d/stabilite.jpg", duree: "24 s", note: "Bille sur une surface E_p : énergies E_c, E_p, E_m", type: "3d" }
  ],   // Mécanique — Ch. 4 Travail et énergie
  elec1: [
    { titre: "Loi de Coulomb", fichier: "videos/3d/coulomb.mp4", image: "videos/3d/coulomb.jpg", duree: "24 s", note: "Répulsion, attraction, F_A/B = −F_B/A, variation en 1/r²", type: "3d" },
    { titre: "Principe de superposition", fichier: "videos/3d/superposition.mp4", image: "videos/3d/superposition.jpg", duree: "24 s", note: "Forces de trois charges sur q et leur somme vectorielle", type: "3d" }
  ],   // Électricité — Ch. 1 Généralités sur l'électrostatique
  elec2: [
    // Électricité — Ch. 2 Champ et potentiel
    { titre: "Sphère chargée en volume", url: "https://www.youtube.com/watch?v=hVLKwntLCM0",
      note: "Exercice : application du théorème de Gauss (TD n°1, exercice 10)" },
    { titre: "Champ d'une charge ponctuelle", fichier: "videos/3d/champ_charge.mp4", image: "videos/3d/champ_charge.jpg", duree: "24 s", note: "Champ radial, divisé par 4 quand r double, F = q₀ E", type: "3d" },
    { titre: "Théorème de Gauss", fichier: "videos/3d/gauss.mp4", image: "videos/3d/gauss.jpg", duree: "24 s", note: "Flux à travers une sphère : charge intérieure, puis extérieure (Φ = 0)", type: "3d" }
  ],
  elec3: [
    { titre: "Lignes de champ du dipôle", fichier: "videos/3d/dipole_lignes.mp4", image: "videos/3d/dipole_lignes.jpg", duree: "24 s", note: "Lignes dans un plan méridien, puis symétrie de révolution", type: "3d" },
    { titre: "Dipôle dans un champ uniforme", fichier: "videos/3d/dipole_couple.mp4", image: "videos/3d/dipole_couple.jpg", duree: "24 s", note: "Couple C = p ∧ E : le dipôle oscille puis s'aligne", type: "3d" }
  ]    // Électricité — Ch. 3 Le dipôle électrostatique
  /* Exemple de ligne :
  elec2: [ { titre: "Le théorème de Gauss expliqué", url: "https://www.youtube.com/watch?v=XXXXXXXXXXX", duree: "15 min" } ]
  */
};
