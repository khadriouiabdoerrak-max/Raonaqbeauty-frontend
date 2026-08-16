/** WhatsApp helpers for admin ops desk (Raonaq) */

export function customerWhatsAppHref(phone: string, message: string): string {
  let digits = (phone || "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length === 10) {
    digits = `212${digits.slice(1)}`;
  } else if (digits.length === 9 && (digits.startsWith("6") || digits.startsWith("7"))) {
    digits = `212${digits}`;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function openCustomerWhatsApp(phone: string, message: string) {
  const href = customerWhatsAppHref(phone, message);
  if (typeof window !== "undefined") {
    window.open(href, "_blank", "noopener,noreferrer");
  }
  return href;
}

export function buildCallCenterConfirmMessage(order: {
  order_number: string;
  customer_name: string;
  products: string;
  total_amount: number;
}): string {
  return [
    `Bonjour ${order.customer_name},`,
    `Raonaq — confirmation de votre commande ${order.order_number}.`,
    `Produits: ${order.products}`,
    `Total: ${order.total_amount} Dhs — paiement à la livraison.`,
    `On peut confirmer l’adresse ?`,
    `نتيجة صالون فدارك — Raonaq.`,
  ].join("\n");
}

export function buildConfirmedWhatsAppMessage(order: {
  order_number: string;
  customer_name: string;
  total_amount: number;
}): string {
  return [
    `Bonjour ${order.customer_name},`,
    `Votre commande ${order.order_number} est confirmée.`,
    `Total: ${order.total_amount} Dhs — paiement à la livraison.`,
    `Expédition sous peu. Merci.`,
    `Raonaq — نتيجة صالون فدارك.`,
  ].join("\n");
}

export function buildShippedWhatsAppMessage(order: {
  order_number: string;
  customer_name: string;
  tracking_number?: string;
}): string {
  const track = (order.tracking_number || "").trim();
  const lines = [
    `Bonjour ${order.customer_name},`,
    `Votre commande ${order.order_number} est en route.`,
  ];
  if (track && !track.startsWith("MAN-")) {
    lines.push(`Suivi: ${track}`);
  }
  lines.push("Livraison gratuite · ouvrez, inspectez, puis payez.");
  lines.push("Raonaq — نتيجة صالون فدارك.");
  return lines.join("\n");
}

export function buildDeliveredWhatsAppMessage(order: {
  order_number: string;
  customer_name: string;
}): string {
  return [
    `Bonjour ${order.customer_name},`,
    `Merci pour votre commande ${order.order_number}.`,
    `Raonaq — نتيجة صالون فدارك.`,
  ].join("\n");
}
