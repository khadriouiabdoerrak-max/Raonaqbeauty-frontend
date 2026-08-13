/** WhatsApp depuis l’env — ex. 2126XXXXXXXX sans + ni espaces */
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
  const text = message || "Bonjour, j’aimerais des informations sur Raonaq Beauty";
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/** Villes marocaines fréquentes pour le COD */
export const MOROCCO_CITIES = [
  "Casablanca",
  "Rabat",
  "Salé",
  "Témara",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
  "Nador",
  "Safi",
  "Mohammedia",
  "El Jadida",
  "Khouribga",
  "Béni Mellal",
  "Taza",
  "Larache",
  "Laâyoune",
  "Dakhla",
  "Ouarzazate",
  "Inzegane",
  "Settat",
  "Berrechid",
  "Autre ville",
] as const;
