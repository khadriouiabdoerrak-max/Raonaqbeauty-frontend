/** روابط الموقع والسوشيال — من env إلا كانت معيّنة */

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
  name: "رونق",
  nameEn: "Raonaq",
  fullName: "رونق — Raonaq Beauty",
  domain: "raonaqbeauty.com",
  email: "contact@raonaqbeauty.com",
  city: "الدار البيضاء، المغرب",
  hours: "الإثنين – السبت · 9 صباحاً – 7 مساءً",
  /** وعد العلامة المختصر */
  tagline: "نتيجة صالون فدارك — حجم، نعومة، ولمعان بلا موعد",
  /** وصف الفوتر والميتا */
  description:
    "أدوات رونق كتعطي نتيجة احترافية مع حماية الشعر — حجم، نعومة، ولمعان بلا موعد وبلا صالون. توصيل مجاني وخلصي غير ملي تقلبي السلعة.",
  /** التموضع الاستراتيجي */
  positioning:
    "أدوات رونق — نتيجة صالون في المنزل. للمرأة المغربية اللي باغية حضور احترافي بلا صالون: مجموعة مختارة، حماية للشعر، وثقة من الباب.",
} as const;

/** لوحة الألوان الرسمية — Pearl Blush · Rosewood · Champagne · Warm Black */
export const BRAND_COLORS = {
  pearlBlush: "#F7F1EC",
  rosewood: "#C45B6A",
  champagne: "#C4A484",
  warmBlack: "#1C1412",
} as const;
