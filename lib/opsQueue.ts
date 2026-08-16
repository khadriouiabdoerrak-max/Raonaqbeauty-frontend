import type { AdminOrder } from '@/lib/admin';

export const CONFIRM_STATUSES = [
  {
    id: 'CONFIRMED',
    label: 'Confirmé',
    group: 'result',
    soft: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    bar: 'bg-emerald-500',
    btn: 'bg-emerald-600 text-white border-emerald-700',
    btnOn: 'bg-emerald-700 text-white border-emerald-800',
  },
  {
    id: 'CANCELLED',
    label: 'Annulé',
    group: 'result',
    soft: 'bg-red-50 text-red-900 border-red-200',
    bar: 'bg-red-500',
    btn: 'bg-red-600 text-white border-red-700',
    btnOn: 'bg-red-700 text-white border-red-800',
  },
  {
    id: 'PENDING_CONFIRMATION',
    label: 'En Attente',
    group: 'result',
    soft: 'bg-[#F7F1EC] text-[#1C1412] border-[#E5D5C5]',
    bar: 'bg-[#C4A484]',
    btn: 'bg-[#C4A484] text-[#1C1412] border-[#a88b6a]',
    btnOn: 'bg-[#b8956f] text-[#1C1412] border-[#8a6f52]',
  },
  {
    id: 'APPEL_1',
    label: 'Appel 1',
    group: 'appel',
    soft: 'bg-amber-50 text-amber-950 border-amber-200',
    bar: 'bg-amber-300',
    btn: 'bg-amber-200 text-amber-950 border-amber-400',
    btnOn: 'bg-amber-300 text-amber-950 border-amber-500',
  },
  {
    id: 'APPEL_2',
    label: 'Appel 2',
    group: 'appel',
    soft: 'bg-amber-100 text-amber-950 border-amber-300',
    bar: 'bg-amber-400',
    btn: 'bg-amber-300 text-amber-950 border-amber-500',
    btnOn: 'bg-amber-400 text-amber-950 border-amber-600',
  },
  {
    id: 'APPEL_3',
    label: 'Appel 3',
    group: 'appel',
    soft: 'bg-orange-50 text-orange-950 border-orange-200',
    bar: 'bg-orange-400',
    btn: 'bg-orange-300 text-orange-950 border-orange-500',
    btnOn: 'bg-orange-400 text-orange-950 border-orange-600',
  },
  {
    id: 'APPEL_4',
    label: 'Appel 4',
    group: 'appel',
    soft: 'bg-orange-100 text-orange-950 border-orange-300',
    bar: 'bg-orange-500',
    btn: 'bg-orange-400 text-white border-orange-600',
    btnOn: 'bg-orange-500 text-white border-orange-700',
  },
  {
    id: 'APPEL_5',
    label: 'Appel 5',
    group: 'appel',
    soft: 'bg-[#FCECEE] text-[#6B2A35] border-[#F0C4CB]',
    bar: 'bg-[#E07A88]',
    btn: 'bg-[#E8A0AA] text-[#1C1412] border-[#C45B6A]',
    btnOn: 'bg-[#C45B6A] text-white border-[#a34452]',
  },
  {
    id: 'APPEL_6',
    label: 'Appel 6',
    group: 'appel',
    soft: 'bg-[#F8E8EB] text-[#6B2A35] border-[#E8B0B8]',
    bar: 'bg-[#C45B6A]',
    btn: 'bg-[#C45B6A] text-white border-[#a34452]',
    btnOn: 'bg-[#a34452] text-white border-[#7a2f3b]',
  },
  {
    id: 'APPEL_7',
    label: 'Appel 7',
    group: 'appel',
    soft: 'bg-[#F3D5DB] text-[#4A1820] border-[#C45B6A]',
    bar: 'bg-[#7a2f3b]',
    btn: 'bg-[#7a2f3b] text-white border-[#5c2029]',
    btnOn: 'bg-[#5c2029] text-white border-[#3d1218]',
  },
  {
    id: 'FAUX_NM',
    label: 'FAUX NM',
    group: 'issue',
    soft: 'bg-stone-100 text-stone-800 border-stone-300',
    bar: 'bg-stone-500',
    btn: 'bg-stone-500 text-white border-stone-700',
    btnOn: 'bg-stone-700 text-white border-stone-800',
  },
  {
    id: 'DOUBLE',
    label: 'Double',
    group: 'issue',
    soft: 'bg-slate-100 text-slate-800 border-slate-300',
    bar: 'bg-slate-500',
    btn: 'bg-slate-600 text-white border-slate-800',
    btnOn: 'bg-slate-800 text-white border-black',
  },
  {
    id: 'BOITE_VOCALE',
    label: 'Boîte vocale',
    group: 'issue',
    soft: 'bg-violet-50 text-violet-900 border-violet-200',
    bar: 'bg-violet-500',
    btn: 'bg-violet-400 text-violet-950 border-violet-600',
    btnOn: 'bg-violet-600 text-white border-violet-800',
  },
  {
    id: 'APPEL_WHATSAPP',
    label: 'Appel + msg WhatsApp',
    group: 'issue',
    soft: 'bg-[#E8F8EF] text-[#075E54] border-[#A7E9C5]',
    bar: 'bg-[#25D366]',
    btn: 'bg-[#25D366] text-white border-[#128C7E]',
    btnOn: 'bg-[#128C7E] text-white border-[#075E54]',
  },
  {
    id: 'INJOIGNABLE',
    label: 'Injoignable',
    group: 'issue',
    soft: 'bg-zinc-100 text-zinc-800 border-zinc-300',
    bar: 'bg-zinc-700',
    btn: 'bg-zinc-700 text-white border-zinc-900',
    btnOn: 'bg-zinc-900 text-white border-black',
  },
] as const;

export type ConfirmStatusId = (typeof CONFIRM_STATUSES)[number]['id'];

export const CONFIRM_STATUS_GROUPS: {
  id: 'result' | 'appel' | 'issue';
  title: string;
}[] = [
  { id: 'result', title: 'Résultat' },
  { id: 'appel', title: 'Appels' },
  { id: 'issue', title: 'Autres' },
];

export function confirmStatusStyle(status: string): {
  btn: string;
  btnOn: string;
  soft: string;
  bar: string;
  label: string;
} {
  const hit = CONFIRM_STATUSES.find(
    (s) => s.id === status || (s.id === 'APPEL_1' && status === 'NO_ANSWER'),
  );
  if (hit)
    return {
      btn: hit.btn,
      btnOn: hit.btnOn,
      soft: hit.soft,
      bar: hit.bar,
      label: hit.label,
    };
  return {
    btn: 'bg-white text-[#2a1810] border-[#e6d9cc]',
    btnOn: 'bg-[#2a1810] text-white border-[#2a1810]',
    soft: 'bg-white text-[#2a1810] border-[#e6d9cc]',
    bar: 'bg-[#C4A484]',
    label: status,
  };
}

const OPEN_CONFIRM = new Set<string>([
  'PENDING_CONFIRMATION',
  'APPEL_1',
  'APPEL_2',
  'APPEL_3',
  'APPEL_4',
  'APPEL_5',
  'APPEL_6',
  'APPEL_7',
  'APPEL_WHATSAPP',
  'NO_ANSWER',
  'REPORTE',
  'BOITE_VOCALE',
  'CONFIRMED',
  'READY_TO_SHIP',
]);

const APPEL_CHAIN = [
  'APPEL_1',
  'APPEL_2',
  'APPEL_3',
  'APPEL_4',
  'APPEL_5',
  'APPEL_6',
  'APPEL_7',
] as const;

export function nextAppelStatus(
  current: string,
): (typeof APPEL_CHAIN)[number] {
  if (current === 'NO_ANSWER' || current === 'PENDING_CONFIRMATION') return 'APPEL_1';
  const idx = APPEL_CHAIN.indexOf(current as (typeof APPEL_CHAIN)[number]);
  if (idx >= 0 && idx < APPEL_CHAIN.length - 1) return APPEL_CHAIN[idx + 1];
  if (idx === APPEL_CHAIN.length - 1) return 'APPEL_7';
  return 'APPEL_1';
}

export function isReporteDue(o: AdminOrder): boolean {
  if (o.status !== 'REPORTE' || !o.follow_up_at) return false;
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return new Date(o.follow_up_at).getTime() <= end.getTime();
}

/** طابور الاتصال اليوم: انتظار + محاولات + مؤجّل حان وقته */
export function isCallTodayQueue(o: AdminOrder): boolean {
  if (
    [
      'PENDING_CONFIRMATION',
      'APPEL_1',
      'APPEL_2',
      'APPEL_3',
      'APPEL_4',
      'APPEL_5',
      'APPEL_6',
      'APPEL_7',
      'APPEL_WHATSAPP',
      'BOITE_VOCALE',
      'NO_ANSWER',
    ].includes(o.status)
  ) {
    return true;
  }
  return isReporteDue(o);
}

export function phoneRiskInfo(orders: AdminOrder[], phone: string, excludeId?: string) {
  const same = orders.filter(
    (o) => o.phone === phone && o.order_number !== excludeId,
  );
  const cancelled = same.filter((o) => o.status === 'CANCELLED').length;
  const returned = same.filter((o) => o.status === 'RETURNED').length;
  const openDupes = same.filter((o) => OPEN_CONFIRM.has(o.status));
  return {
    cancelled,
    returned,
    openDupes,
    risky: cancelled + returned >= 2 || openDupes.length > 0,
    duplicate: openDupes.length > 0,
  };
}

export function todayConfirmedForCourier(orders: AdminOrder[]): AdminOrder[] {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return orders.filter((o) => {
    if (o.status !== 'CONFIRMED' && o.status !== 'READY_TO_SHIP') return false;
    const t = o.confirmed_at || o.created_at;
    return new Date(t).getTime() >= start.getTime();
  });
}

export function buildCourierBatchText(orders: AdminOrder[]): string {
  return orders
    .map(
      (o, i) =>
        `${i + 1}. ${o.order_number} | ${o.customer_name} | ${o.phone} | ${o.city} | ${o.address} | ${o.products} | ${o.total_amount} DH`,
    )
    .join('\n');
}

export function printCourierList(orders: AdminOrder[]) {
  const rows = orders
    .map(
      (o) =>
        `<tr><td>${o.order_number}</td><td>${o.customer_name}</td><td dir="ltr">${o.phone}</td><td>${o.city}</td><td>${o.address}</td><td>${o.products}</td><td>${o.total_amount}</td></tr>`,
    )
    .join('');
  const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"/><title>Expédition</title>
  <style>body{font-family:sans-serif;padding:16px}table{border-collapse:collapse;width:100%;font-size:12px}
  th,td{border:1px solid #333;padding:6px;text-align:right}th{background:#eee}</style></head><body>
  <h1>قائمة الشحن — ${new Date().toLocaleDateString('ar-MA')}</h1>
  <table><thead><tr><th>N°</th><th>Client</th><th>Tél</th><th>Ville</th><th>Adresse</th><th>Produits</th><th>COD</th></tr></thead>
  <tbody>${rows || '<tr><td colspan="7">لا طلبات</td></tr>'}</tbody></table>
  <script>window.onload=()=>window.print()</script></body></html>`;
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(html);
  w.document.close();
}
