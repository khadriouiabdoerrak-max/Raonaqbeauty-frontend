export type AdminOrder = {
  order_number: string;
  created_at: string;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  products: string;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  status: string;
  status_label: string;
  notes?: string;
  cancel_reason?: string;
  tracking_number?: string;
  courier_name?: string;
  courier_status?: string;
  courier_synced_at?: string | null;
  follow_up_at?: string | null;
  status_changed_at?: string | null;
  days_open?: number;
  days_in_status?: number;
  confirmed_at?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
  returned_at?: string | null;
  last_contacted_at?: string | null;
  last_operator?: string | null;
  sheet_sync_error?: string | null;
  sheet_synced_at?: string | null;
};

export type WeeklyStats = {
  orders: number;
  confirmed: number;
  cancelled: number;
  delivered: number;
  returned: number;
  confirm_rate: number;
  return_rate: number;
  top_cities: { city: string; count: number }[];
  cancel_reasons: Record<string, number>;
};

export type AdminStats = {
  today: number;
  today_confirmed?: number;
  today_shipped?: number;
  today_delivered?: number;
  today_returned?: number;
  today_cancelled?: number;
  en_attente?: number;
  appel_1?: number;
  appel_2?: number;
  appel_3?: number;
  reporte?: number;
  reporte_due?: number;
  pending: number;
  confirmed: number;
  ready_to_ship: number;
  shipped: number;
  stale_shipped?: number;
  delivered: number;
  returned: number;
  cancelled: number;
  cancel_reasons?: Record<string, number>;
  total: number;
  sheet_errors?: number;
  weekly?: WeeklyStats;
  operators?: string[];
};

export type InsightPeriod =
  | 'today'
  | 'yesterday'
  | 'week'
  | 'month'
  | 'year'
  | 'all';

export type StoreInsights = {
  currency: string;
  timezone: string;
  period: InsightPeriod | string;
  period_label: string;
  earnings: Record<
    string,
    {
      label: string;
      earnings: number;
      sales: number;
      orders: number;
      delivered: number;
      frozen?: number;
    }
  >;
  calendar?: {
    year: number;
    month: number;
    days: Record<
      string,
      { orders: number; delivered: number; earnings: number; sales: number }
    >;
  };
  store: {
    orders: number;
    sales: number;
    earnings: number;
    delivered: number;
    frozen?: number;
    frozen_count?: number;
    returned_value?: number;
    cancelled_value?: number;
    confirm_rate?: number;
    delivery_rate?: number;
    return_rate?: number;
    funnel?: {
      entered: number;
      pending: number;
      confirmed: number;
      shipped: number;
      delivered: number;
      returned: number;
      cancelled: number;
    };
    max_order_value: number;
    avg_order_value: number;
    min_order_value: number;
    conversion_rate: number;
    top_products: { name: string; quantity: number; revenue: number }[];
    top_cities: { city: string; count: number }[];
    by_status: Record<string, number>;
    traffic: {
      available: boolean;
      visitors: number | null;
      page_views: number | null;
      devices: null;
      whatsapp_clicks?: number | null;
      view_product?: number | null;
      add_to_cart?: number | null;
      begin_checkout?: number | null;
      has_data?: boolean;
      rates?: {
        visitor_to_order?: number;
        product_to_cart?: number;
        cart_to_checkout?: number;
        checkout_to_order?: number;
        visitor_to_whatsapp?: number;
      };
      message?: string;
    };
    top_pages: {
      available: boolean;
      items?: { path: string; views: number }[];
      message?: string;
    };
    checkout_funnel: {
      available: boolean;
      has_data?: boolean;
      steps?: { id: string; label: string; count: number }[];
      rates?: {
        visitor_to_order?: number;
        product_to_cart?: number;
        cart_to_checkout?: number;
        checkout_to_order?: number;
        visitor_to_whatsapp?: number;
      };
      whatsapp_by_source?: { source: string; count: number }[];
      top_viewed_products?: { product_id: string; views: number }[];
      message?: string;
    };
  };
};

export async function fetchAdminInsights(
  token: string,
  period: InsightPeriod | string = 'today',
  calendarMonth?: string,
) {
  const qs = new URLSearchParams({ period: String(period) });
  if (calendarMonth) qs.set('calendar', calendarMonth);
  const res = await fetch(`/api/admin/insights?${qs}`, {
    headers: { 'X-Admin-Token': token },
    cache: 'no-store',
  });
  const text = await res.text();
  let data: StoreInsights & { detail?: string } = {} as StoreInsights;
  try {
    data = text ? JSON.parse(text) : ({} as StoreInsights);
  } catch {
    throw new Error(
      res.ok
        ? 'رد غير صالح من السيرفر'
        : `خطأ السيرفر (${res.status}) — Deploy للـ backend`,
    );
  }
  if (!res.ok) throw new Error(data?.detail || 'فشل تحميل الإحصائيات');
  if (!data.store || !data.earnings) {
    throw new Error('بيانات الإحصائيات ناقصة — Deploy للـ backend');
  }
  return data as StoreInsights;
}

export function hasRealTracking(order?: {
  tracking_number?: string | null;
} | null): boolean {
  const t = (order?.tracking_number || '').trim();
  return Boolean(t) && !t.toUpperCase().startsWith('MAN-');
}

export const ADMIN_TOKEN_KEY = 'raonaq-admin-token';
export const OPS_OPERATOR_KEY = 'raonaq-ops-operator';
export const COURIER_PREF_KEY = 'raonaq-default-courier';

export const CANCEL_REASONS = [
  'الزبونة رفضات',
  'رقم غلط',
  'الثمن غالي',
  'طلب مكرر',
  'خارج منطقة التوصيل',
  'سبب آخر',
] as const;

/**
 * الباك كي خزّن UTC بلا timezone (naive).
 * المتصفح كيقرّا ISO بلا Z كـ توقيت محلّي → نقص ساعة فالمغرب.
 * دابا: إلا ما كانش offset، كنحسبوها UTC.
 */
export function parseAdminInstant(iso: string): Date {
  const s = (iso || '').trim();
  if (!s) return new Date(NaN);
  if (/^\d{4}-\d{2}-\d{2}T/.test(s) && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(s)) {
    return new Date(`${s}Z`);
  }
  return new Date(s);
}

export function orderDateParts(iso: string) {
  const d = parseAdminInstant(iso);
  if (Number.isNaN(d.getTime())) {
    return { year: 0, month: 0, day: 0, time: '' };
  }
  const tz = 'Africa/Casablanca';
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value || '';
  return {
    year: Number(get('year')) || 0,
    month: Number(get('month')) || 0,
    day: Number(get('day')) || 0,
    time: `${get('hour')}:${get('minute')}`,
  };
}

/** توقيت المغرب: HH:mm DD/MM/YYYY */
export function formatAdminDate(iso: string) {
  try {
    const p = orderDateParts(iso);
    if (!p.year) return iso;
    const mm = String(p.month).padStart(2, '0');
    const dd = String(p.day).padStart(2, '0');
    return `${p.time} ${dd}/${mm}/${p.year}`;
  } catch {
    return iso;
  }
}

/** سطر زمن واضح لآخر الأحداث (توقيت المغرب) */
export function formatAdminDateMa(iso: string) {
  const s = formatAdminDate(iso);
  if (!s || s === iso) return iso;
  return `${s} · المغرب`;
}

export async function purgeAllAdminOrders(token: string) {
  const qs = new URLSearchParams({ confirm: 'DELETE_ALL_ORDERS' });
  const res = await fetch(`/api/admin/orders/purge?${qs}`, {
    method: 'DELETE',
    headers: { 'X-Admin-Token': token },
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || 'فشل المسح');
  return data as {
    ok: boolean;
    deleted_orders: number;
    deleted_items: number;
    message?: string;
  };
}

/** Relative time in Darija-friendly Arabic, e.g. "قبل 12 د" */
export function timeAgo(iso: string) {
  const then = parseAdminInstant(iso).getTime();
  if (Number.isNaN(then)) return '';
  const mins = Math.max(0, Math.floor((Date.now() - then) / 60000));
  if (mins < 1) return 'دابا';
  if (mins < 60) return `قبل ${mins} د`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `قبل ${hours} س`;
  const days = Math.floor(hours / 24);
  return `قبل ${days} ي`;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function copyText(text: string) {
  return navigator.clipboard.writeText(text);
}

export function buildCourierCopyLine(o: AdminOrder) {
  return [
    o.order_number,
    o.customer_name,
    o.phone,
    o.city,
    o.address,
    o.products,
    `${o.total_amount} DH`,
    o.notes || '',
  ].join(' | ');
}

function opsHeaders(token: string, operator?: string): HeadersInit {
  const h: Record<string, string> = { 'X-Admin-Token': token };
  if (operator?.trim()) h['X-Ops-Operator'] = operator.trim();
  return h;
}

export async function fetchAdminOrders(token: string, status?: string) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';
  const res = await fetch(`/api/admin/orders${qs}`, {
    headers: { 'X-Admin-Token': token },
    cache: 'no-store',
  });
  const text = await res.text();
  let data: {
    detail?: string;
    total?: number;
    orders?: AdminOrder[];
    stats?: AdminStats;
  } = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      res.ok
        ? 'رد غير صالح من السيرفر'
        : `خطأ السيرفر (${res.status}) — عاودي Déployer للـ backend`,
    );
  }
  if (!res.ok) throw new Error(data?.detail || 'فشل التحميل');
  return data as {
    total: number;
    orders: AdminOrder[];
    stats?: AdminStats;
  };
}

/** Lightweight poll / overview — no order rows */
export async function fetchAdminStats(token: string) {
  const res = await fetch('/api/admin/stats', {
    headers: { 'X-Admin-Token': token },
    cache: 'no-store',
  });
  const text = await res.text();
  let data: AdminStats & { detail?: string } = {
    today: 0,
    pending: 0,
    confirmed: 0,
    ready_to_ship: 0,
    shipped: 0,
    delivered: 0,
    returned: 0,
    cancelled: 0,
    total: 0,
  };
  try {
    data = text ? JSON.parse(text) : data;
  } catch {
    throw new Error(
      res.ok
        ? 'رد غير صالح من السيرفر'
        : `خطأ السيرفر (${res.status}) — عاودي Déployer للـ backend`,
    );
  }
  if (!res.ok) throw new Error(data?.detail || 'فشل التحميل');
  return data as AdminStats;
}

export function statsFingerprint(s: AdminStats | null | undefined): string {
  if (!s) return '';
  return [
    s.today,
    s.pending,
    s.confirmed,
    s.ready_to_ship,
    s.shipped,
    s.delivered,
    s.returned,
    s.cancelled,
    s.total,
    s.stale_shipped ?? 0,
    s.reporte_due ?? 0,
  ].join('|');
}

export async function createAdminOrder(
  token: string,
  body: {
    customer_name: string;
    phone: string;
    city: string;
    address: string;
    product_name: string;
    quantity?: number;
    unit_price: number;
    notes?: string;
    operator?: string;
  },
) {
  const res = await fetch('/api/admin/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': token,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || 'فشل إنشاء الطلب');
  return data as AdminOrder;
}

export async function patchAdminOrder(
  token: string,
  orderNumber: string,
  body: Record<string, unknown>,
  operator?: string,
) {
  const res = await fetch(
    `/api/admin/orders/${encodeURIComponent(orderNumber)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...opsHeaders(token, operator),
      },
      body: JSON.stringify({
        ...body,
        ...(operator?.trim() ? { operator: operator.trim() } : {}),
      }),
      cache: 'no-store',
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || 'فشل تحديث الحالة');
  return data as AdminOrder;
}

export async function syncOzonExpress(token: string) {
  const res = await fetch('/api/admin/couriers/ozonexpress/sync', {
    method: 'POST',
    headers: { 'X-Admin-Token': token },
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || data?.message || 'فشل المزامنة');
  return data as {
    ok: boolean;
    message?: string;
    checked?: number;
    updated?: number;
    details?: {
      order_number: string;
      tracking_number?: string;
      courier_status?: string;
      status?: string;
    }[];
  };
}

export async function saveOzonExpressConfig(
  token: string,
  body: { customer_id: string; api_key: string },
) {
  const res = await fetch('/api/admin/couriers/ozonexpress/config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Token': token,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || data?.message || 'فشل حفظ إعدادات OzonExpress');
  return data as { ok: boolean; message?: string };
}

export async function shipAdminOrdersBatch(
  token: string,
  orderNumbers: string[],
  operator?: string,
) {
  const results: {
    order_number: string;
    ok: boolean;
    tracking_number?: string;
    error?: string;
  }[] = [];
  for (const orderNumber of orderNumbers) {
    try {
      const updated = await shipAdminOrder(
        token,
        orderNumber,
        { courier_name: 'ozone', create_with_provider: true },
        operator,
      );
      results.push({
        order_number: orderNumber,
        ok: true,
        tracking_number: updated.tracking_number || undefined,
      });
    } catch (err) {
      results.push({
        order_number: orderNumber,
        ok: false,
        error: err instanceof Error ? err.message : 'فشل الإرسال',
      });
    }
  }
  return results;
}

export async function shipAdminOrder(
  token: string,
  orderNumber: string,
  body: {
    courier_name?: string;
    tracking_number?: string;
    create_with_provider?: boolean;
    city?: string;
    address?: string;
  },
  operator?: string,
) {
  const res = await fetch(
    `/api/admin/orders/${encodeURIComponent(orderNumber)}/ship`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...opsHeaders(token, operator),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || 'فشل الشحن');
  return data as AdminOrder;
}

export async function fetchOrderAudit(token: string, orderNumber: string) {
  const res = await fetch(
    `/api/admin/orders/${encodeURIComponent(orderNumber)}/audit`,
    {
      headers: { 'X-Admin-Token': token },
      cache: 'no-store',
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || 'فشل السجل');
  return data as {
    events: {
      operator: string;
      action: string;
      detail: string;
      created_at: string;
    }[];
  };
}

export type AdminMetrics = {
  from: string;
  to: string;
  clicks_raw: number;
  clicks_counted: number;
  orders: number;
  conversion_rate: number;
  revenue: number;
  by_status: Record<string, number>;
  by_day: { date: string; clicks: number; orders: number }[];
  top_cities: { city: string; count: number }[];
  top_products: { name: string; quantity: number }[];
};

export type AdminOrderDetail = AdminOrder & {
  items?: { name: string; quantity: number; unit_price: number }[];
  audit?: {
    operator: string;
    action: string;
    detail: string;
    created_at: string;
  }[];
};

export async function adminLogin(username: string, password: string) {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || data?.message || 'فشل تسجيل الدخول');
  return data as { token: string; expires_at: string };
}

export async function adminLogout(token: string) {
  await fetch('/api/admin/logout', {
    method: 'POST',
    headers: { 'X-Admin-Token': token },
    cache: 'no-store',
  }).catch(() => undefined);
}

export async function fetchAdminMetrics(
  token: string,
  range?: { from?: string; to?: string },
) {
  const qs = new URLSearchParams();
  if (range?.from) qs.set('from', range.from);
  if (range?.to) qs.set('to', range.to);
  const q = qs.toString() ? `?${qs}` : '';
  const res = await fetch(`/api/admin/metrics${q}`, {
    headers: { 'X-Admin-Token': token },
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || 'فشل المقاييس');
  return data as AdminMetrics;
}

export async function fetchAdminOrderDetail(
  token: string,
  orderNumber: string,
) {
  const res = await fetch(
    `/api/admin/orders/${encodeURIComponent(orderNumber)}`,
    {
      headers: { 'X-Admin-Token': token },
      cache: 'no-store',
    },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail || 'فشل تفاصيل الطلب');
  return data as AdminOrderDetail;
}
