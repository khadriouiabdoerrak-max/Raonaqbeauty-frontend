/** Fenêtre d’appel confirmation COD — Afrique/Casablanca */

export type CallWindow = {
  inHours: boolean;
  headline: string;
  detail: string;
  badge: string;
};

/** Minutes depuis minuit, fuseau Africa/Casablanca */
function moroccoMinutesNow(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Casablanca",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());

  let hour = Number(parts.find((p) => p.type === "hour")?.value ?? "12");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  if (hour === 24) hour = 0;
  return hour * 60 + minute;
}

/** 9h00 – 21h00 (heure Maroc) */
export function getCallWindow(): CallWindow {
  const minutes = moroccoMinutesNow();
  const open = 9 * 60;
  const close = 21 * 60;
  const inHours = minutes >= open && minutes < close;

  if (inHours) {
    return {
      inHours: true,
      badge: "Appel sous 10 min",
      headline: "Gardez votre téléphone à portée",
      detail:
        "Un conseiller Raonaq vous appelle sous 10 minutes pour confirmer votre adresse avant l’expédition. Le numéro peut être inconnu — répondez : c’est nous.",
    };
  }

  return {
    inHours: false,
    badge: "Appel demain matin",
    headline: "Nous vous appelons dès 9h",
    detail:
      "Votre commande est bien enregistrée. Hors de nos horaires (9h–21h), l’appel de confirmation arrive demain matin dès 9h (heure du Maroc). Numéro inconnu ? Répondez quand même.",
  };
}
