/** WhatsApp helpers for admin ops desk (Raonaq) */

export function customerWhatsAppHref(phone: string, message: string): string {
  let digits = (phone || '').replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0') && digits.length === 10) {
    digits = `212${digits.slice(1)}`;
  } else if (
    digits.length === 9 &&
    (digits.startsWith('6') || digits.startsWith('7'))
  ) {
    digits = `212${digits}`;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function openCustomerWhatsApp(phone: string, message: string) {
  const href = customerWhatsAppHref(phone, message);
  if (typeof window !== 'undefined') {
    window.open(href, '_blank', 'noopener,noreferrer');
  }
  return href;
}

type WaOrder = {
  order_number: string;
  customer_name: string;
  products?: string;
  total_amount?: number;
  tracking_number?: string;
  city?: string;
  courier_status?: string;
  status?: string;
};

function firstName(full: string) {
  const n = (full || '').trim().split(/\s+/)[0];
  return n || 'cliente';
}

/** Ozon / livreur: client ما جاوبش */
export function isOzonNoResponseStatus(label?: string | null): boolean {
  const s = (label || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
  if (!s) return false;
  const keys = [
    'pas de reponse',
    'pas de réponse',
    'aucune reponse',
    'injoignable',
    'ne repond',
    'ne répond',
    'no answer',
    'reporte',
    'reporté',
    'client absent',
    'absent',
    'tentative',
    '2eme tentative',
    '2ème tentative',
    'echec livraison',
    'échec livraison',
    'غير متصل',
    'ما جاوب',
    'ما رد',
  ];
  return keys.some((k) => s.includes(k.normalize('NFD').replace(/\p{M}/gu, '')));
}

/** أول اتصال / تأكيد العنوان */
export function buildCallCenterConfirmMessage(order: WaOrder): string {
  const name = firstName(order.customer_name);
  return [
    `Bonjour ${name} 👋`,
    ``,
    `Raonaq — on a bien reçu votre commande ${order.order_number}.`,
    order.products ? `Produit: ${order.products}` : null,
    order.total_amount != null
      ? `Total: ${order.total_amount} DH — paiement à la livraison (après ouverture).`
      : null,
    ``,
    `On peut confirmer votre adresse et le créneau de livraison ?`,
    ``,
    `نتيجة صالون فدارك — Raonaq`,
  ]
    .filter(Boolean)
    .join('\n');
}

/** بعد Confirmé */
export function buildConfirmedWhatsAppMessage(order: WaOrder): string {
  const name = firstName(order.customer_name);
  return [
    `Bonjour ${name},`,
    ``,
    `Votre commande ${order.order_number} est confirmée ✅`,
    order.total_amount != null
      ? `Total: ${order.total_amount} DH — COD à la livraison.`
      : null,
    ``,
    `On prépare l’envoi. Vous recevrez le suivi dès la prise en charge.`,
    ``,
    `Merci pour votre confiance.`,
    `Raonaq — نتيجة صالون فدارك`,
  ]
    .filter(Boolean)
    .join('\n');
}

/** بعد الإرسال لـ Ozon / في الطريق (suivi) */
export function buildShippedWhatsAppMessage(order: WaOrder): string {
  const name = firstName(order.customer_name);
  const track = (order.tracking_number || '').trim();
  const lines = [
    `Bonjour ${name},`,
    ``,
    `Bonne nouvelle — votre commande ${order.order_number} est en cours de livraison.`,
    `Préparez-vous: le livreur peut passer aujourd’hui. Gardez votre téléphone allumé svp.`,
  ];
  if (track && !track.startsWith('MAN-')) {
    lines.push(``, `Suivi OzonExpress: ${track}`);
  }
  if (order.city) {
    lines.push(`Ville: ${order.city}`);
  }
  lines.push(
    ``,
    `Livraison gratuite · ouvrez le colis, vérifiez, puis payez.`,
    ``,
    `Raonaq — نتيجة صالون فدارك`,
  );
  return lines.join('\n');
}

/** Alias clair لمرحلة “sortie livraison / suivi jour J” */
export function buildOutForDeliveryWhatsAppMessage(order: WaOrder): string {
  return buildShippedWhatsAppMessage(order);
}

/** بعد التسليم — شكراً على الثقة */
export function buildDeliveredWhatsAppMessage(order: WaOrder): string {
  const name = firstName(order.customer_name);
  return [
    `Bonjour ${name},`,
    ``,
    `Merci infiniment pour votre confiance 🙏`,
    `Votre commande ${order.order_number} a bien été livrée.`,
    ``,
    `On espère que Raonaq vous plaît. Pour toute question, écrivez-nous ici.`,
    ``,
    `نتيجة صالون فدارك — Raonaq`,
  ].join('\n');
}

/** Ozon: pas de réponse / tentative échouée */
export function buildNoResponseWhatsAppMessage(order: WaOrder): string {
  const name = firstName(order.customer_name);
  const track = (order.tracking_number || '').trim();
  const lines = [
    `Bonjour ${name},`,
    ``,
    `Le livreur a tenté de vous joindre pour la commande ${order.order_number}, sans réponse.`,
    `Merci de nous indiquer un créneau où vous êtes disponible, ou de rappeler le livreur.`,
  ];
  if (track && !track.startsWith('MAN-')) {
    lines.push(``, `Suivi: ${track}`);
  }
  lines.push(
    ``,
    `On reste à votre disposition.`,
    `Raonaq — نتيجة صالون فدارك`,
  );
  return lines.join('\n');
}

export type WhatsAppStage =
  | 'confirm_call'
  | 'confirmed'
  | 'shipped'
  | 'no_response'
  | 'delivered';

export function resolveWhatsAppStage(order: {
  status?: string;
  courier_status?: string;
  tracking_number?: string;
}): WhatsAppStage {
  const st = order.status || '';
  if (st === 'DELIVERED') return 'delivered';
  if (isOzonNoResponseStatus(order.courier_status)) return 'no_response';
  if (
    st === 'SHIPPED' ||
    (!!(order.tracking_number || '').trim() &&
      !(order.tracking_number || '').startsWith('MAN-'))
  ) {
    return 'shipped';
  }
  if (
    st === 'CONFIRMED' ||
    st === 'READY_TO_SHIP'
  ) {
    return 'confirmed';
  }
  return 'confirm_call';
}

export function buildWhatsAppForOrder(order: WaOrder): string {
  switch (resolveWhatsAppStage(order)) {
    case 'delivered':
      return buildDeliveredWhatsAppMessage(order);
    case 'no_response':
      return buildNoResponseWhatsAppMessage(order);
    case 'shipped':
      return buildShippedWhatsAppMessage(order);
    case 'confirmed':
      return buildConfirmedWhatsAppMessage(order);
    default:
      return buildCallCenterConfirmMessage(order);
  }
}

export function whatsAppButtonLabel(stage: WhatsAppStage): string {
  switch (stage) {
    case 'delivered':
      return 'واتساب · شكراً';
    case 'no_response':
      return 'واتساب · تذكير';
    case 'shipped':
      return 'واتساب · suivi';
    case 'confirmed':
      return 'واتساب · تأكيد';
    default:
      return 'واتساب';
  }
}
