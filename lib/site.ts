export function getSocialLinks() {
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || "";
  const facebook = process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim() || "";
  const tiktok = process.env.NEXT_PUBLIC_TIKTOK_URL?.trim() || "";
  return {
    instagram: instagram || null,
    facebook: facebook || null,
    tiktok: tiktok || null,
  };
}

export const SITE = {
  name: "Raonaq",
  nameEn: "Raonaq",
  fullName: "Raonaq Beauty",
  domain: "raonaqbeauty.com",
  email: "contact@raonaqbeauty.com",
  city: "Casablanca, Maroc",
  hours: "Lundi – samedi · 9h – 19h",
  tagline: "Le salon, chez vous — volume, lisse, brillance.",
  description:
    "Raonaq crée des outils de coiffage pour un résultat salon à la maison, avec protection du cheveu. Livraison gratuite au Maroc. Ouvrez, inspectez, puis payez.",
  positioning:
    "Maison marocaine de coiffage. Une collection courte. Confiance à la porte : vous inspectez avant de payer.",
} as const;

export const BRAND_COLORS = {
  pearlBlush: "#F7F1EC",
  rosewood: "#C45B6A",
  champagne: "#C4A484",
  warmBlack: "#1C1412",
} as const;
