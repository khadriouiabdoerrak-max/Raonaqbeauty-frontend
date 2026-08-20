/** First-party Raonaq funnel tracking (site → product → cart → order / WhatsApp). */

export type TrackEventType =
  | 'page_view'
  | 'view_product'
  | 'add_to_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'whatsapp_click';

const SID_KEY = 'raonaq_sid';

function randomId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 32);
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

export function getAnalyticsSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let sid = sessionStorage.getItem(SID_KEY);
    if (!sid) {
      sid = randomId();
      sessionStorage.setItem(SID_KEY, sid);
    }
    return sid;
  } catch {
    return randomId();
  }
}

export function trackEvent(
  eventType: TrackEventType,
  opts?: {
    path?: string;
    productId?: string;
    source?: string;
  },
) {
  if (typeof window === 'undefined') return;
  const path = opts?.path || window.location.pathname || '/';
  if (path.startsWith('/admin')) return;

  const body = JSON.stringify({
    event_type: eventType,
    path: path.slice(0, 300),
    product_id: opts?.productId?.slice(0, 80) || undefined,
    source: opts?.source?.slice(0, 80) || undefined,
    session_id: getAnalyticsSessionId(),
    referrer: typeof document !== 'undefined' ? (document.referrer || '').slice(0, 500) : '',
  });

  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon('/api/analytics/event', blob)) return;
    }
  } catch {
    /* fall through */
  }

  void fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
    cache: 'no-store',
  }).catch(() => undefined);
}
