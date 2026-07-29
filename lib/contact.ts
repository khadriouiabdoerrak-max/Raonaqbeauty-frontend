/** رقم واتساب من env — مثال: 2126XXXXXXXX بدون + أو مسافات */
export function getWhatsAppNumber(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  return raw.replace(/\D/g, "");
}

export function getWhatsAppDisplay(): string {
  const digits = getWhatsAppNumber();
  if (!digits) return "";
  if (digits.startsWith("212") && digits.length >= 12) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`.trim();
  }
  return `+${digits}`;
}

export function getWhatsAppLink(message?: string): string | null {
  const phone = getWhatsAppNumber();
  if (!phone) return null;
  const text = message || "مرحباً، بغيت نسول على منتجات رونق بيوتي";
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/** مدن مغربية شائعة للتوصيل COD */
export const MOROCCO_CITIES = [
  "الدار البيضاء",
  "الرباط",
  "سلا",
  "تمارة",
  "مراكش",
  "فاس",
  "طنجة",
  "أكادير",
  "مكناس",
  "وجدة",
  "القنيطرة",
  "تطوان",
  "الناظور",
  "آسفي",
  "المحمدية",
  "الجديدة",
  "خريبكة",
  "بني ملال",
  "تازة",
  "العرائش",
  "العيون",
  "الداخلة",
  "ورزازات",
  "إنزكان",
  "سطات",
  "برشيد",
  "مدينة أخرى",
] as const;
