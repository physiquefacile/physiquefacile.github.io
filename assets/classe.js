/* © 2026 Papa Touty Traoré — tous droits réservés.
   Plateforme « Physique Facile » / « Labo Virtuel de Physique-Chimie ». Reproduction, modification ou diffusion interdites sans autorisation écrite de l'auteur. */
/* =====================================================================
   CLASSE VIRTUELLE — fichier à mettre à jour
   ---------------------------------------------------------------------
   outil : nom affiché de l'outil de visioconférence ("Microsoft Teams")
   SALLES : une salle permanente par EC (le lien ne change pas d'une séance à l'autre).
     ec        : intitulé de l'EC          formation : "L1 PCI", "L1 BCG", "L2 PCI"…
     lien      : lien de la réunion Teams de l'EC (Teams > Calendrier > réunion > « Copier le lien »)
     code      : ID de réunion et code secret Teams, s'il y en a un (facultatif)
   SEANCES : séances programmées.
     date  : "AAAA-MM-JJ"   heure : "10:00"   duree : en minutes (90 par défaut)
     ec    : même intitulé que dans SALLES (le lien de la salle est repris)
     titre : sujet de la séance           lien : autre adresse (facultatif)
     enregistrement : lien vers l'enregistrement, ajouté après la séance (facultatif)
     annulee : true si la séance est annulée
   Pour passer à BigBlueButton : changer « outil » et les liens des SALLES, rien d'autre.
   ===================================================================== */
window.CLASSE = {
  outil: "Microsoft Teams",
  SALLES: [
    // { ec: "Mécanique 1", formation: "L1 PCI", lien: "https://teams.microsoft.com/l/meetup-join/…" },
  ],
  SEANCES: [
    // { date: "2026-11-10", heure: "10:00", duree: 90, ec: "Mécanique 1", titre: "Chapitre 2 — Cinématique : correction du TD" },
  ]
};
