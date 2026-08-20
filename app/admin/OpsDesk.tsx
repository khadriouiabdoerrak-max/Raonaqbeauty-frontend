'use client';

/**
 * Raonaq Ops — confirmation + shipping (COD Maroc)
 * جديد · مكالمة 1/2/3 · مؤجل · مؤكد · ملغى
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  Lock,
  Link2,
  LogOut,
  MessageCircle,
  Phone,
  PhoneMissed,
  RefreshCw,
  RotateCcw,
  Truck,
  X,
} from 'lucide-react';
import {
  buildCallCenterConfirmMessage,
  buildConfirmedWhatsAppMessage,
  buildDeliveredWhatsAppMessage,
  buildNoResponseWhatsAppMessage,
  buildShippedWhatsAppMessage,
  buildWhatsAppForOrder,
  customerWhatsAppHref,
  isOzonNoResponseStatus,
  openCustomerWhatsApp,
  resolveWhatsAppStage,
  whatsAppButtonLabel,
} from '@/lib/whatsapp';
import {
  ADMIN_TOKEN_KEY,
  CANCEL_REASONS,
  COURIER_PREF_KEY,
  AdminOrder,
  AdminStats,
  buildCourierCopyLine,
  copyText,
  fetchAdminOrders,
  fetchAdminStats,
  statsFingerprint,
  fetchOrderAudit,
  formatAdminDate,
  hasRealTracking,
  orderDateParts,
  patchAdminOrder,
  purgeAllAdminOrders,
  shipAdminOrder,
  shipAdminOrdersBatch,
  syncOzonExpress,
  saveOzonExpressConfig,
  createAdminOrder,
  telHref,
  timeAgo,
} from '@/lib/admin';
import { mergeTopCities } from '@/lib/cityNormalize';
import {
  buildCourierBatchText,
  CONFIRM_STATUSES,
  CONFIRM_STATUS_GROUPS,
  confirmStatusStyle,
  isCallTodayQueue,
  nextAppelStatus,
  printCourierList,
  todayConfirmedForCourier,
} from '@/lib/opsQueue';
import { CitySelect } from '@/components/ui/CitySelect';
import { STALE_SHIP_DAYS } from '@/lib/cities';
import { products, UPSELL } from '@/lib/products';
import { formatStoreProductLine } from '@/lib/productLabels';
import StoreInsightsPanel from './StoreInsightsPanel';
import AdminDateCalendar, {
  datePartsToIso,
  isoToDateParts,
} from './AdminDateCalendar';

/** نفس أسماء الستور فالسلة: «Raonaq DUO»، «Raonaq TRIO»… */
const WA_CATALOG: { name: string; label: string; price: number }[] = [
  ...[...products]
    .sort((a, b) => {
      if (a.name === 'DUO') return -1;
      if (b.name === 'DUO') return 1;
      return 0;
    })
    .map((p) => ({
      name: `Raonaq ${p.name}`,
      label: `Raonaq ${p.name} — ${p.nameFr}`,
      price: p.price1,
    })),
  {
    name: `Raonaq ${UPSELL.name}`,
    label: UPSELL.nameFr,
    price: UPSELL.price,
  },
];

type Mode = 'board' | 'orders' | 'ship';

type PipeFilter =
  | 'all'
  | 'call_today'
  | 'en_attente'
  | 'appel_1'
  | 'appel_2'
  | 'appel_3'
  | 'reporte'
  | 'confirmed'
  | 'shipped'
  | 'stale'
  | 'delivered'
  | 'returned'
  | 'cancelled';

type AuditEvent = {
  operator: string;
  action: string;
  detail: string;
  created_at: string;
};

const MODES: { id: Mode; label: string }[] = [
  { id: 'orders', label: 'تأكيد' },
  { id: 'ship', label: 'شحن' },
];

const COURIERS = [
  { id: 'generic', label: 'عام' },
  { id: 'cathedis', label: 'Cathedis' },
  { id: 'ozone', label: 'Ozone' },
];

function playChime() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    const beep = (at: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, at);
      gain.gain.exponentialRampToValueAtTime(0.001, at + 0.2);
      osc.start(at);
      osc.stop(at + 0.22);
    };
    const t0 = ctx.currentTime;
    beep(t0, 880);
    beep(t0 + 0.24, 988);
    beep(t0 + 0.48, 1175);
    setTimeout(() => void ctx.close(), 900);
  } catch {
    /* ignore */
  }
}

function minsWaiting(iso: string) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 0;
  return Math.floor((Date.now() - t) / 60000);
}

function urgency(o: AdminOrder) {
  let s = minsWaiting(o.created_at);
  if (o.status === 'APPEL_3' || o.status === 'APPEL_2') s += 120;
  if (o.status === 'APPEL_1' || o.status === 'NO_ANSWER') s += 80;
  if (o.status === 'REPORTE') s += 40;
  if ((o.days_open ?? 0) >= 2) s += 50;
  if (o.total_amount >= 500) s += 30;
  return s;
}

function isConfirmQueue(o: AdminOrder) {
  return [
    'PENDING_CONFIRMATION',
    'APPEL_1',
    'APPEL_2',
    'APPEL_3',
    'APPEL_4',
    'APPEL_5',
    'APPEL_6',
    'APPEL_7',
    'APPEL_WHATSAPP',
    'FAUX_NM',
    'DOUBLE',
    'BOITE_VOCALE',
    'INJOIGNABLE',
    'REPORTE',
    'NO_ANSWER',
  ].includes(o.status);
}

function canPickConfirmStatut(o: AdminOrder) {
  return !['SHIPPED', 'DELIVERED', 'RETURNED'].includes(o.status);
}

function canSendToOzon(o: AdminOrder) {
  return (
    (o.status === 'CONFIRMED' || o.status === 'READY_TO_SHIP') &&
    !hasRealTracking(o) &&
    (o.city || '').trim().length >= 2 &&
    (o.address || '').trim().length >= 8
  );
}

function isShipQueue(o: AdminOrder) {
  return (
    o.status === 'CONFIRMED' ||
    o.status === 'READY_TO_SHIP' ||
    o.status === 'SHIPPED' ||
    o.status === 'DELIVERED' ||
    o.status === 'RETURNED'
  );
}

function isStaleShip(o: AdminOrder) {
  if (o.status !== 'SHIPPED') return false;
  const base = o.shipped_at || o.created_at;
  const days = Math.floor(
    (Date.now() - new Date(base).getTime()) / 86400000,
  );
  return days >= STALE_SHIP_DAYS;
}

function stageOf(o: AdminOrder): PipeFilter {
  switch (o.status) {
    case 'CANCELLED':
      return 'cancelled';
    case 'RETURNED':
      return 'returned';
    case 'DELIVERED':
      return 'delivered';
    case 'SHIPPED':
      return 'shipped';
    case 'CONFIRMED':
    case 'READY_TO_SHIP':
      return 'confirmed';
    case 'REPORTE':
      return 'reporte';
    case 'APPEL_3':
      return 'appel_3';
    case 'APPEL_2':
      return 'appel_2';
    case 'APPEL_1':
    case 'NO_ANSWER':
      return 'appel_1';
    default:
      return 'en_attente';
  }
}

function rowStageClass(o: AdminOrder): string {
  const s = o.status;
  const base = 'border-s-4 transition-colors';

  // Livré / retour — final
  if (s === 'DELIVERED')
    return `${base} bg-emerald-50/90 border-s-emerald-400`;
  if (s === 'RETURNED')
    return `${base} bg-orange-50/90 border-s-orange-300`;

  // Chez le livreur / Ozone (tracking ou SHIPPED)
  if (s === 'SHIPPED' || hasRealTracking(o)) {
    if (isOzonNoResponseStatus(o.courier_status)) {
      return `${base} bg-amber-50/95 border-s-amber-400`;
    }
    return `${base} bg-sky-50/95 border-s-sky-400`;
  }

  // Confirmé — prêt à envoyer à la société
  if (s === 'CONFIRMED' || s === 'READY_TO_SHIP') {
    return `${base} bg-teal-50/90 border-s-teal-400`;
  }

  // Annulé / faux / double
  if (
    s === 'CANCELLED' ||
    s === 'FAUX_NM' ||
    s === 'DOUBLE' ||
    s === 'INJOIGNABLE'
  ) {
    return `${base} bg-stone-100/90 border-s-stone-300`;
  }

  if (s === 'BOITE_VOCALE' || s === 'APPEL_WHATSAPP') {
    return `${base} bg-violet-50/80 border-s-violet-300`;
  }
  if (s === 'REPORTE') return `${base} bg-sky-50/80 border-s-sky-300`;

  // Relances — rose plus marqué plus on avance
  if (s === 'APPEL_7' || s === 'APPEL_6') {
    return `${base} bg-[#F8E4E8] border-s-[#C45B6A]/80`;
  }
  if (s === 'APPEL_5' || s === 'APPEL_4' || s === 'APPEL_3') {
    return `${base} bg-[#FBEFF1] border-s-[#C45B6A]/55`;
  }
  if (s === 'APPEL_2' || s === 'APPEL_1' || s === 'NO_ANSWER') {
    return `${base} bg-amber-50/90 border-s-amber-300`;
  }

  // Nouveau — en attente de confirmation
  if (s === 'PENDING_CONFIRMATION') {
    return `${base} bg-[#F7F1EC] border-s-[#C4A484]`;
  }

  return `${base} bg-white border-s-transparent`;
}

/** ليجاند خفيف — تأكيد + شحن */
function StatusColorLegend({ mode }: { mode: Mode }) {
  const items =
    mode === 'ship'
      ? [
          { c: 'bg-teal-50 border-teal-300', t: 'مؤكد · جاهز' },
          { c: 'bg-sky-50 border-sky-300', t: 'مرسل للشركة' },
          { c: 'bg-amber-50 border-amber-300', t: 'ما جاوبش Ozone' },
          { c: 'bg-emerald-50 border-emerald-300', t: 'توصل' },
          { c: 'bg-orange-50 border-orange-300', t: 'راجع' },
        ]
      : [
          { c: 'bg-[#F7F1EC] border-[#C4A484]', t: 'جديد' },
          { c: 'bg-amber-50 border-amber-300', t: 'ما جاوبش' },
          { c: 'bg-sky-50 border-sky-300', t: 'مؤجل' },
          { c: 'bg-teal-50 border-teal-300', t: 'مؤكد' },
          { c: 'bg-stone-100 border-stone-300', t: 'ملغى' },
        ];

  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#6a5648]">
      <span className="font-bold text-[#8a7464]">ألوان:</span>
      {items.map((it) => (
        <span
          key={it.t}
          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 ${it.c}`}
        >
          {it.t}
        </span>
      ))}
    </div>
  );
}

function daysLabel(o: AdminOrder) {
  const open =
    typeof o.days_open === 'number'
      ? o.days_open
      : Math.max(
          0,
          Math.floor(
            (Date.now() - new Date(o.created_at).getTime()) / 86400000,
          ),
        );
  const inSt =
    typeof o.days_in_status === 'number'
      ? o.days_in_status
      : open;
  if (open <= 0 && inSt <= 0) return 'اليوم';
  if (open === inSt) return `${open} ي`;
  return `${open} ي · ${inSt} فالحالة`;
}

function parseMode(tab: string | null): Mode {
  if (tab === 'ship' || tab === 'shipping') return 'ship';
  if (
    tab === 'board' ||
    tab === 'overview' ||
    tab === 'dashboard' ||
    tab === 'stats'
  )
    return 'board';
  // confirm + legacy → طابور التأكيد
  return 'orders';
}

function modeQuery(m: Mode) {
  if (m === 'ship') return 'ship';
  if (m === 'board') return 'overview';
  return 'confirm';
}

function tomorrowLocalInput() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function OpsDesk({
  embedded = false,
  sessionToken = '',
}: {
  embedded?: boolean;
  /** Token من AdminShell — باش ما يبانش لوجين مزدوج */
  sessionToken?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const pipeParam = searchParams.get('pipe');
  const initial = parseMode(tabParam);

  const [token, setToken] = useState(sessionToken || '');
  const [pin, setPin] = useState('');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [mode, setMode] = useState<Mode>(initial);
  const [pipe, setPipe] = useState<PipeFilter>(() => {
    const fromUrl = pipeParam as PipeFilter | null;
    if (
      fromUrl &&
      [
        'all',
        'call_today',
        'en_attente',
        'appel_1',
        'appel_2',
        'appel_3',
        'reporte',
        'confirmed',
        'shipped',
        'stale',
        'delivered',
        'returned',
        'cancelled',
      ].includes(fromUrl)
    ) {
      return fromUrl;
    }
    return initial === 'ship' ? 'all' : 'call_today';
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notes, setNotes] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [showReporte, setShowReporte] = useState(false);
  const [followUpDate, setFollowUpDate] = useState(tomorrowLocalInput());
  const [courier, setCourier] = useState('ozone');
  const [tracking, setTracking] = useState('');
  const [shipCity, setShipCity] = useState('');
  const [shipAddress, setShipAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [ozoneReady, setOzoneReady] = useState(false);
  const [showOzoneConfig, setShowOzoneConfig] = useState(false);
  const [ozoneId, setOzoneId] = useState('');
  const [ozoneKey, setOzoneKey] = useState('');
  const [ozoneSaving, setOzoneSaving] = useState(false);
  const [shipConfirm, setShipConfirm] = useState(false);
  const [selectedShip, setSelectedShip] = useState<Record<string, boolean>>(
    {},
  );
  const [batchMsg, setBatchMsg] = useState('');
  const [query, setQuery] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [showWaIntake, setShowWaIntake] = useState(false);
  const [showStatutMenu, setShowStatutMenu] = useState(false);
  const [waSaving, setWaSaving] = useState(false);
  const [waForm, setWaForm] = useState({
    customer_name: '',
    phone: '',
    city: '',
    address: '',
    product_name: 'Raonaq DUO',
    unit_price: '599',
    notes: '',
  });

  const knownNew = useRef<Set<string>>(new Set());
  const primed = useRef(false);
  const statsFp = useRef('');
  const pollTick = useRef(0);

  const goPipe = (next: PipeFilter, desk: Mode = 'orders') => {
    setShowCancel(false);
    setShowReporte(false);
    setDetailOpen(false);
    setMode(desk);
    setPipe(next);
    if (desk === 'orders') setNewOrderCount(0);
    router.replace(`/admin?tab=${modeQuery(desk)}&pipe=${next}`, {
      scroll: false,
    });
  };

  const goMode = (m: Mode) => {
    if (m === 'ship') {
      goPipe('all', 'ship');
      return;
    }
    if (m === 'orders') {
      goPipe('call_today', 'orders');
      return;
    }
    setShowCancel(false);
    setShowReporte(false);
    setDetailOpen(false);
    setMode('board');
    router.replace('/admin?tab=overview', { scroll: false });
  };

  const openDetail = (id: string) => {
    setActiveId(id);
    setDetailOpen(true);
    setShowCancel(false);
    setShowReporte(false);
    setShowStatutMenu(false);
    setShipConfirm(false);
    setError('');
    const found = orders.find((o) => o.order_number === id);
    setShipCity(found?.city || '');
    setShipAddress(found?.address || '');
    setTracking(found?.tracking_number || '');
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setShowCancel(false);
    setShowReporte(false);
    setShipConfirm(false);
  };

  const load = useCallback(async (secret: string, silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const data = await fetchAdminOrders(secret);
      const next = data.orders || [];
      const freshIds = next
        .filter((o) => o.status === 'PENDING_CONFIRMATION')
        .map((o) => o.order_number);
      if (primed.current) {
        const brand = freshIds.filter((id) => !knownNew.current.has(id));
        if (brand.length) {
          playChime();
          setNewOrderCount((n) => n + brand.length);
        }
      } else primed.current = true;
      knownNew.current = new Set(freshIds);
      setOrders(next);
      if (data.stats) {
        setStats(data.stats);
        statsFp.current = statsFingerprint(data.stats);
      }
      setToken(secret);
      sessionStorage.setItem(ADMIN_TOKEN_KEY, secret);
    } catch (err) {
      if (!silent) {
        // فـ embedded: AdminShell هو اللي كيدير اللوجين — ما نمسّحوش الجلسة هنا
        if (!embedded) {
          setToken('');
          setOrders([]);
          setStats(null);
          sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        }
      }
      setError(err instanceof Error ? err.message : 'خطأ');
    } finally {
      setLoading(false);
      setBooting(false);
    }
  }, [embedded]);

  const refreshStats = useCallback(async (secret: string) => {
    try {
      const next = await fetchAdminStats(secret);
      setStats(next);
      return next;
    } catch {
      return null;
    }
  }, []);

  // مزامنة تاب URL ↔ mode + pipe
  useEffect(() => {
    const nextMode = parseMode(tabParam);
    setMode(nextMode);

    const allowed: PipeFilter[] = [
      'all',
      'call_today',
      'en_attente',
      'appel_1',
      'appel_2',
      'appel_3',
      'reporte',
      'confirmed',
      'shipped',
      'stale',
      'delivered',
      'returned',
      'cancelled',
    ];
    if (pipeParam && allowed.includes(pipeParam as PipeFilter)) {
      setPipe(pipeParam as PipeFilter);
      return;
    }
    // بلا pipe فـ URL → الافتراضي حسب المكتب
    setPipe(nextMode === 'ship' ? 'confirmed' : 'call_today');
  }, [tabParam, pipeParam]);

  useEffect(() => {
    const saved = sessionToken || sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
    const pref = localStorage.getItem(COURIER_PREF_KEY);
    if (pref) setCourier(pref);
    else setCourier('ozone');
    if (saved) void load(saved);
    else setBooting(false);
  }, [load, sessionToken]);

  useEffect(() => {
    if (!token) return;
    void (async () => {
      try {
        const res = await fetch('/api/admin/couriers', {
          headers: { 'X-Admin-Token': token },
          cache: 'no-store',
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          ozonexpress_configured?: boolean;
          ozonexpress_id?: string;
          default?: string;
        };
        setOzoneReady(Boolean(data.ozonexpress_configured));
        if (data.ozonexpress_id) setOzoneId(data.ozonexpress_id);
        if (!localStorage.getItem(COURIER_PREF_KEY) && data.default) {
          setCourier(data.default);
        }
      } catch {
        /* ignore */
      }
    })();
  }, [token]);

  useEffect(() => {
    if (mode !== 'ship') {
      setSelectedShip({});
      setBatchMsg('');
    }
  }, [mode]);

  // Poll: stats every 20s; full list only when fingerprint changes or every ~60s
  useEffect(() => {
    if (!token) return;
    const id = window.setInterval(() => {
      void (async () => {
        pollTick.current += 1;
        const next = await refreshStats(token);
        const fp = statsFingerprint(next);
        const changed = Boolean(fp && fp !== statsFp.current);
        if (changed) statsFp.current = fp;
        if (changed || pollTick.current % 3 === 0) {
          await load(token, true);
        }
      })();
    }, 20000);
    return () => window.clearInterval(id);
  }, [token, load, refreshStats]);

  const pipeCounts = useMemo(() => {
    const c: Record<PipeFilter, number> = {
      all: orders.length,
      call_today: 0,
      en_attente: 0,
      appel_1: 0,
      appel_2: 0,
      appel_3: 0,
      reporte: 0,
      confirmed: 0,
      shipped: 0,
      stale: 0,
      delivered: 0,
      returned: 0,
      cancelled: 0,
    };
    for (const o of orders) {
      c[stageOf(o)] += 1;
      if (isStaleShip(o)) c.stale += 1;
      if (isCallTodayQueue(o)) c.call_today += 1;
    }
    return c;
  }, [orders]);

  const sortedOrders = useMemo(() => {
    // ترتيب ثابت بتاريخ الإنشاء — الحالة ما تحرّكش الصف
    return [...orders].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [orders]);

  const sheetRows = useMemo(() => {
    let list = sortedOrders;
    if (mode === 'ship') {
      list = list.filter(isShipQueue);
      if (pipe === 'confirmed') {
        list = list.filter(
          (o) => o.status === 'CONFIRMED' || o.status === 'READY_TO_SHIP',
        );
      } else if (pipe === 'shipped') {
        list = list.filter((o) => o.status === 'SHIPPED');
      } else if (pipe === 'delivered') {
        list = list.filter((o) => o.status === 'DELIVERED');
      } else if (pipe === 'returned') {
        list = list.filter((o) => o.status === 'RETURNED');
      } else if (pipe === 'stale') {
        list = list.filter(isStaleShip);
      }
      // pipe === 'all' → كل طلبات الشحن فنفس الصفحة
      const shipRank = (o: AdminOrder) => {
        if (o.status === 'CONFIRMED' || o.status === 'READY_TO_SHIP') return 0;
        if (o.status === 'SHIPPED') return 1;
        if (o.status === 'DELIVERED') return 2;
        if (o.status === 'RETURNED') return 3;
        return 4;
      };
      list = [...list].sort((a, b) => {
        const d = shipRank(a) - shipRank(b);
        if (d !== 0) return d;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    } else {
      // طابور التأكيد: ترتيب ثابت بالأقدمية — ما كيقفزش الصف ملي كتبدّل الحالة
      if (pipe === 'cancelled') {
        list = list.filter(
          (o) =>
            o.status === 'CANCELLED' ||
            o.status === 'FAUX_NM' ||
            o.status === 'DOUBLE' ||
            o.status === 'INJOIGNABLE',
        );
      } else if (pipe === 'en_attente') {
        list = list.filter((o) => o.status === 'PENDING_CONFIRMATION');
      } else if (pipe === 'appel_1') {
        list = list.filter(
          (o) => o.status === 'APPEL_1' || o.status === 'NO_ANSWER',
        );
      } else if (pipe === 'appel_2') {
        list = list.filter((o) => o.status === 'APPEL_2');
      } else if (pipe === 'appel_3') {
        list = list.filter((o) =>
          ['APPEL_3', 'APPEL_4', 'APPEL_5', 'APPEL_6', 'APPEL_7'].includes(
            o.status,
          ),
        );
      } else if (pipe === 'reporte') {
        list = list.filter((o) => o.status === 'REPORTE');
      } else if (pipe === 'call_today') {
        list = list.filter(isCallTodayQueue);
      } else {
        list = list.filter(isConfirmQueue);
      }
      list = [...list].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }
    if (filterYear || filterMonth || filterDay) {
      list = list.filter((o) => {
        const p = orderDateParts(o.created_at);
        if (filterYear && p.year !== Number(filterYear)) return false;
        if (filterMonth && p.month !== Number(filterMonth)) return false;
        if (filterDay && p.day !== Number(filterDay)) return false;
        return true;
      });
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.customer_name.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.order_number.toLowerCase().includes(q) ||
          (o.status_label || '').toLowerCase().includes(q) ||
          (o.notes || '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [
    sortedOrders,
    mode,
    pipe,
    query,
    filterYear,
    filterMonth,
    filterDay,
  ]);

  useEffect(() => {
    setPage(1);
  }, [pipe, mode, query, filterYear, filterMonth, filterDay, pageSize]);

  const totalPages = Math.max(1, Math.ceil(sheetRows.length / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sheetRows.slice(start, start + pageSize);
  }, [sheetRows, safePage, pageSize]);
  const rangeFrom = sheetRows.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeTo = Math.min(safePage * pageSize, sheetRows.length);

  const confirmWaiting =
    pipeCounts.en_attente +
    pipeCounts.appel_1 +
    pipeCounts.appel_2 +
    pipeCounts.appel_3 +
    pipeCounts.reporte;
  const shipReady = pipeCounts.confirmed;

  useEffect(() => {
    if (!detailOpen || !activeId) return;
    if (!orders.some((o) => o.order_number === activeId)) {
      setDetailOpen(false);
      setActiveId(null);
    }
  }, [orders, activeId, detailOpen]);

  const active = useMemo(
    () => orders.find((o) => o.order_number === activeId) ?? null,
    [orders, activeId],
  );

  const cancelTop = useMemo(() => {
    const map = stats?.cancel_reasons || {};
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [stats]);

  useEffect(() => {
    setNotes(active?.notes || '');
    setTracking(active?.tracking_number || '');
    setShipCity(active?.city || '');
    setShipAddress(active?.address || '');
    setShowCancel(false);
    setShowReporte(false);
    setCopied(false);
    if (active?.follow_up_at) {
      try {
        const d = new Date(active.follow_up_at);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        setFollowUpDate(`${y}-${m}-${day}`);
      } catch {
        setFollowUpDate(tomorrowLocalInput());
      }
    } else {
      setFollowUpDate(tomorrowLocalInput());
    }
  }, [active?.order_number]);

  useEffect(() => {
    if (!detailOpen || !activeId || !token) {
      setAuditEvents([]);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const data = await fetchOrderAudit(token, activeId);
        if (!cancelled) setAuditEvents((data.events || []).slice(0, 5));
      } catch {
        if (!cancelled) setAuditEvents([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [detailOpen, activeId, token, active?.status, active?.notes]);

  const patch = async (
    id: string,
    body: Record<string, unknown>,
    closeAfter = false,
  ) => {
    if (!token) return;
    setBusy(true);
    setError('');
    const y = typeof window !== 'undefined' ? window.scrollY : 0;
    try {
      const updated = await patchAdminOrder(token, id, body);
      setOrders((prev) =>
        prev.map((o) => (o.order_number === id ? { ...o, ...updated } : o)),
      );
      if (body.status === 'CONFIRMED') {
        openCustomerWhatsApp(
          updated.phone,
          buildConfirmedWhatsAppMessage(updated),
        );
        closeDetail();
      } else if (body.status === 'CANCELLED') {
        closeDetail();
      } else if (body.status === 'DELIVERED') {
        openCustomerWhatsApp(
          updated.phone,
          buildDeliveredWhatsAppMessage(updated),
        );
      }
      if (closeAfter) closeDetail();
      void refreshStats(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ');
    } finally {
      setBusy(false);
      setShowCancel(false);
      setShowReporte(false);
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
        requestAnimationFrame(() => window.scrollTo(0, y));
      });
    }
  };

  const markNoAnswer = (o: AdminOrder) => {
    const next = nextAppelStatus(o.status);
    const stamp = new Date().toLocaleString('fr-MA');
    void patch(o.order_number, {
      status: next,
      append_note: `ما جاوبش · ${stamp}`,
      mark_contacted: true,
    });
    openCustomerWhatsApp(o.phone, buildCallCenterConfirmMessage(o));
  };

  const submitWaIntake = async () => {
    if (!token) return;
    setWaSaving(true);
    setError('');
    try {
      const created = await createAdminOrder(token, {
        customer_name: waForm.customer_name.trim(),
        phone: waForm.phone.trim(),
        city: waForm.city.trim(),
        address: waForm.address.trim(),
        product_name: waForm.product_name.trim(),
        quantity: 1,
        unit_price: Number(waForm.unit_price) || 0,
        notes: waForm.notes.trim() || undefined,
      });
      setShowWaIntake(false);
      setWaForm({
        customer_name: '',
        phone: '',
        city: '',
        address: '',
        product_name: 'Raonaq DUO',
        unit_price: '599',
        notes: '',
      });
      setOrders((prev) => [created, ...prev]);
      void refreshStats(token);
      goPipe('call_today', 'orders');
      openDetail(created.order_number);
      openCustomerWhatsApp(
        created.phone,
        buildCallCenterConfirmMessage(created),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل إنشاء الطلب');
    } finally {
      setWaSaving(false);
    }
  };

  const doShip = async (id: string, withProvider = false) => {
    if (!token) return;
    if (shipCity.trim().length < 2 || shipAddress.trim().length < 8) {
      setError('المدينة والعنوان ناقصين — المدينة ≥ 2 والعنوان ≥ 8 أحرف');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const updated = await shipAdminOrder(token, id, {
        courier_name: withProvider ? 'ozone' : courier,
        tracking_number: withProvider ? '' : tracking,
        create_with_provider: withProvider,
        city: shipCity.trim() || undefined,
        address: shipAddress.trim() || undefined,
      });
      setOrders((prev) =>
        prev.map((o) => (o.order_number === id ? { ...o, ...updated } : o)),
      );
      // Keep detail open so ops can send WhatsApp tracking message
      void refreshStats(token);
      if (withProvider && updated.tracking_number) {
        openCustomerWhatsApp(
          updated.phone,
          buildShippedWhatsAppMessage(updated),
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!detailOpen || !active || showCancel || showReporte || busy) return;
    const order = active;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDetail();
        return;
      }
      if (!isConfirmQueue(order)) return;
      if (e.key === '1') {
        e.preventDefault();
        markNoAnswer(order);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        void patch(order.order_number, { status: 'CONFIRMED' });
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setShowReporte(true);
      } else if (e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        setShowCancel(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [detailOpen, active, showCancel, showReporte, busy, token]);

  const selectedShipIds = useMemo(
    () => Object.keys(selectedShip).filter((id) => selectedShip[id]),
    [selectedShip],
  );

  const shipSelectableOnPage = useMemo(
    () => pagedRows.filter((o) => canSendToOzon(o)),
    [pagedRows],
  );

  const allShipPageSelected =
    shipSelectableOnPage.length > 0 &&
    shipSelectableOnPage.every((o) => selectedShip[o.order_number]);

  const toggleShipSelect = (id: string, on: boolean) => {
    setSelectedShip((prev) => {
      const next = { ...prev };
      if (on) next[id] = true;
      else delete next[id];
      return next;
    });
  };

  const toggleSelectAllShipPage = () => {
    setSelectedShip((prev) => {
      const next = { ...prev };
      if (allShipPageSelected) {
        for (const o of shipSelectableOnPage) delete next[o.order_number];
      } else {
        for (const o of shipSelectableOnPage) next[o.order_number] = true;
      }
      return next;
    });
  };

  const withPreservedScroll = async (fn: () => Promise<void>) => {
    const y = typeof window !== 'undefined' ? window.scrollY : 0;
    try {
      await fn();
    } finally {
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
        requestAnimationFrame(() => window.scrollTo(0, y));
      });
    }
  };

  const runSelectedOzonShip = async () => {
    if (!token || selectedShipIds.length === 0) return;
    const ids = [...selectedShipIds];
    const ok = window.confirm(
      ids.length === 1
        ? `إرسال الطلب ${ids[0]} إلى OzonExpress؟`
        : `إرسال ${ids.length} طلبات محددة إلى OzonExpress؟`,
    );
    if (!ok) return;
    setBusy(true);
    setError('');
    setBatchMsg('');
    try {
      const results = await shipAdminOrdersBatch(token, ids);
      const okRows = results.filter((r) => r.ok);
      const failRows = results.filter((r) => !r.ok);
      if (okRows.length) {
        setBatchMsg(
          okRows.length === 1
            ? `تم إرسال ${okRows[0].order_number} إلى OzonExpress`
            : `تم إرسال ${okRows.length} طلبات إلى OzonExpress`,
        );
        setSelectedShip((prev) => {
          const next = { ...prev };
          for (const r of okRows) delete next[r.order_number];
          return next;
        });
      }
      if (failRows.length) {
        setError(
          failRows
            .map((r) => `${r.order_number}: ${r.error || 'فشل'}`)
            .join(' · '),
        );
      }
      await withPreservedScroll(async () => {
        await load(token, true);
        try {
          await syncOzonExpress(token);
          await load(token, true);
        } catch {
          /* ignore */
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل الإرسال');
    } finally {
      setBusy(false);
    }
  };

  const dayOrderCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const o of orders) {
      const p = orderDateParts(o.created_at);
      if (!p.year) continue;
      const iso = `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
      map[iso] = (map[iso] || 0) + 1;
    }
    return map;
  }, [orders]);

  const filterDateIso = datePartsToIso(filterYear, filterMonth, filterDay);

  const setFilterFromIso = (iso: string) => {
    const parts = isoToDateParts(iso);
    setFilterYear(parts.year);
    setFilterMonth(parts.month);
    setFilterDay(parts.day);
  };

  if (booting) {
    return (
      <div className="min-h-[100dvh] bg-[#f5f0ea] flex items-center justify-center text-[#6a5648]">
        جاري الفتح…
      </div>
    );
  }

  if (!token) {
    if (embedded) {
      return (
        <div className="min-h-[40dvh] flex items-center justify-center text-[#6a5648] text-sm">
          جاري ربط الجلسة…
        </div>
      );
    }
    return (
      <div className="min-h-[100dvh] bg-[#f5f0ea] flex items-center justify-center px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void load(pin.trim());
          }}
          className="w-full max-w-sm bg-white border border-[#e6d9cc] rounded-2xl p-6 space-y-4"
        >
          <div className="text-center space-y-1">
            <Lock className="w-6 h-6 mx-auto text-[#2a1810]" />
            <h1 className="text-xl font-bold text-[#2a1810]">تشغيل رونق</h1>
            <p className="text-sm text-[#6a5648]">تأكيد · شحن</p>
          </div>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="رمز الدخول"
            className="w-full p-4 rounded-xl border border-[#e6d9cc] text-center text-lg bg-[#faf6f1]"
            autoFocus
          />
          {error ? (
            <p className="text-sm text-red-700 text-center">{error}</p>
          ) : null}
          <button
            type="submit"
            disabled={loading || !pin.trim()}
            className="w-full py-3.5 rounded-xl bg-[#2a1810] text-white font-bold disabled:opacity-50"
          >
            سير
          </button>
        </form>
      </div>
    );
  }

  const activeStage = active ? stageOf(active) : null;
  const shipAddrOk =
    shipCity.trim().length >= 2 && shipAddress.trim().length >= 8;

  const orderFilters: { id: PipeFilter; label: string }[] =
    mode === 'ship'
      ? [
          { id: 'all', label: 'الكل' },
          { id: 'confirmed', label: 'جاهز' },
          { id: 'shipped', label: 'مرسل' },
          { id: 'delivered', label: 'مسلّم' },
          { id: 'returned', label: 'مرتجع' },
          { id: 'stale', label: `متأخر +${STALE_SHIP_DAYS}j` },
        ]
      : [];

  const boardCards: {
    label: string;
    value: number;
    filter: PipeFilter;
    desk: Mode;
  }[] = [
    {
      label: 'جديد',
      value: pipeCounts.en_attente,
      filter: 'en_attente',
      desk: 'orders',
    },
    {
      label: 'مكالمة 1',
      value: pipeCounts.appel_1,
      filter: 'appel_1',
      desk: 'orders',
    },
    {
      label: 'مؤجل اليوم',
      value: stats?.reporte_due ?? pipeCounts.reporte,
      filter: 'reporte',
      desk: 'orders',
    },
    {
      label: 'مؤكد',
      value: pipeCounts.confirmed,
      filter: 'confirmed',
      desk: 'ship',
    },
    {
      label: 'مرسل',
      value: pipeCounts.shipped,
      filter: 'shipped',
      desk: 'ship',
    },
    {
      label: 'متأخر',
      value: stats?.stale_shipped ?? pipeCounts.stale,
      filter: 'stale',
      desk: 'ship',
    },
    {
      label: 'مسلم',
      value: pipeCounts.delivered,
      filter: 'delivered',
      desk: 'orders',
    },
    {
      label: 'ملغى',
      value: pipeCounts.cancelled,
      filter: 'cancelled',
      desk: 'orders',
    },
  ];

  return (
    <div
      dir="rtl"
      className={`${embedded ? 'min-h-[70dvh]' : 'min-h-[100dvh]'} bg-[#f5f0ea] text-[#2a1810]`}
    >
      <header className="sticky top-0 z-20 border-b border-[#e6d9cc] bg-[#f5f0ea]/95 backdrop-blur">
        <div className="mx-auto max-w-[1400px] px-3 py-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            <h1 className="font-bold text-lg shrink-0">
              {embedded
                ? mode === 'ship'
                  ? 'مكتب الشحن'
                  : 'طابور التأكيد'
                : 'تشغيل رونق'}
            </h1>
            {newOrderCount > 0 ? (
              <button
                type="button"
                onClick={() => goPipe('call_today', 'orders')}
                className="text-sm bg-red-600 text-white rounded-full px-3 py-1.5 tabular-nums font-bold animate-pulse"
              >
                +{newOrderCount} جديد
              </button>
            ) : null}
            {mode === 'ship' ? (
              <span className="text-sm bg-white border border-[#e6d9cc] rounded-full px-3.5 py-1.5 tabular-nums font-bold">
                جاهز {shipReady}
              </span>
            ) : null}
            {(stats?.sheet_errors ?? 0) > 0 ? (
              <span className="text-sm bg-amber-100 border border-amber-300 text-amber-900 rounded-full px-3 py-1.5 tabular-nums font-bold">
                Sheet ⚠ {stats?.sheet_errors}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void load(token)}
              className="p-2.5 rounded-xl border border-[#e6d9cc] bg-white"
              aria-label="تحديث"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            {!embedded ? (
              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
                  setToken('');
                  setOrders([]);
                  setStats(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e6d9cc] text-sm text-[#6a5648]"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </button>
            ) : null}
          </div>
        </div>

        {!embedded ? (
          <div className="mx-auto max-w-[1400px] px-3 pb-3">
            <div className="flex gap-1 p-1 rounded-xl bg-[#e8dfd5]">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => goMode(m.id)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold ${
                    mode === m.id
                      ? 'bg-[#2a1810] text-white'
                      : 'text-[#5c4a3c]'
                  }`}
                >
                  {m.label}
                  {m.id === 'orders' ? ` (${orders.length})` : ''}
                  {m.id === 'ship'
                    ? ` (${
                        shipReady +
                        pipeCounts.shipped +
                        pipeCounts.delivered +
                        pipeCounts.returned
                      })`
                    : ''}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      {error ? (
        <p className="mx-auto max-w-[1400px] px-3 pt-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {mode === 'board' && (
        <div className="mx-auto max-w-[1400px] px-3 py-6 space-y-8">
          <StoreInsightsPanel token={token} />

          <div>
            <h2 className="text-xl font-bold">مسار التأكيد</h2>
            <p className="text-sm text-[#6a5648] mt-1">
              جديد → مكالمة 1/2/3 → مؤجل / مؤكد / ملغى — من بعد
              الشحن والتتبع.
            </p>
          </div>

          <button
            type="button"
            onClick={() => goPipe('call_today', 'orders')}
            className="w-full text-right rounded-2xl border-2 border-[#2a1810] bg-[#2a1810] text-white p-5 hover:opacity-95"
          >
            <p className="text-sm opacity-80">ابدأ من هنا</p>
            <p className="text-2xl font-bold mt-1">طابور اليوم</p>
            <p className="text-4xl font-bold tabular-nums mt-2">
              {pipeCounts.call_today}
            </p>
          </button>

          {(stats?.sheet_errors ?? 0) > 0 ? (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 font-bold">
              أخطاء مزامنة Sheet: {stats?.sheet_errors} — راجع الطلبات ذات
              sheet_sync_error
            </div>
          ) : null}

          {stats?.weekly ? (
            <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4 space-y-3">
              <p className="text-sm font-bold">إحصائيات الأسبوع</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <p className="text-xs text-[#6a5648]">نسبة التأكيد</p>
                  <p className="text-2xl font-bold tabular-nums">
                    {stats.weekly.confirm_rate}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6a5648]">نسبة الإرجاع</p>
                  <p className="text-2xl font-bold tabular-nums">
                    {stats.weekly.return_rate}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6a5648]">مؤكد</p>
                  <p className="text-2xl font-bold tabular-nums">
                    {stats.weekly.confirmed}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6a5648]">طلبات</p>
                  <p className="text-2xl font-bold tabular-nums">
                    {stats.weekly.orders}
                  </p>
                </div>
              </div>
              {stats.weekly.top_cities?.length ? (
                <div className="flex flex-wrap gap-2">
                  {mergeTopCities(stats.weekly.top_cities, 5).map((c) => (
                    <span
                      key={c.city}
                      className="text-xs px-3 py-1.5 rounded-full bg-[#faf6f1] border border-[#e6d9cc]"
                    >
                      {c.city}: <b>{c.count}</b>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4">
              <p className="text-xs text-[#6a5648]">طلبات اليوم</p>
              <p className="text-3xl font-bold tabular-nums mt-1">
                {stats?.today ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4">
              <p className="text-xs text-[#6a5648]">مسلم اليوم</p>
              <p className="text-3xl font-bold tabular-nums mt-1 text-emerald-700">
                {stats?.today_delivered ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4">
              <p className="text-xs text-[#6a5648]">مرتجع اليوم</p>
              <p className="text-3xl font-bold tabular-nums mt-1 text-red-700">
                {stats?.today_returned ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4">
              <p className="text-xs text-[#6a5648]">ملغى اليوم</p>
              <p className="text-3xl font-bold tabular-nums mt-1">
                {stats?.today_cancelled ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4">
              <p className="text-xs text-[#6a5648]">À confirmer</p>
              <p className="text-3xl font-bold tabular-nums mt-1">
                {confirmWaiting}
              </p>
            </div>
            <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4">
              <p className="text-xs text-[#6a5648]">À expédier</p>
              <p className="text-3xl font-bold tabular-nums mt-1">{shipReady}</p>
            </div>
          </div>
          {cancelTop.length > 0 ? (
            <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4">
              <p className="text-sm font-bold mb-2">أسباب الإلغاء</p>
              <div className="flex flex-wrap gap-2">
                {cancelTop.map(([reason, count]) => (
                  <span
                    key={reason}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#faf6f1] border border-[#e6d9cc]"
                  >
                    {reason}: <b>{count}</b>
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {boardCards.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => goPipe(c.filter, c.desk)}
                className="text-right rounded-xl border border-[#e6d9cc] bg-white p-3 hover:border-[#2a1810]"
              >
                <p className="text-[11px] text-[#6a5648] leading-tight">
                  {c.label}
                </p>
                <p className="text-2xl font-bold tabular-nums mt-1">{c.value}</p>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goMode('orders')}
            className="px-5 py-3 rounded-xl bg-[#2a1810] text-white font-bold text-sm"
          >
            فتح جدول الطلبات
          </button>
        </div>
      )}

      {(mode === 'orders' || mode === 'ship') && (
        <div className="mx-auto max-w-[1400px] px-3 py-4 space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-bold text-lg">
                {mode === 'ship' ? 'Expédition & suivi' : 'طلبات'}
              </h2>
              <p className="text-sm text-[#6a5648]">
                فلتر الحالة · عمود الأيام ·{' '}
                <span className="font-bold text-[#2a1810]">تفاصيل</span> للتصرف.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <AdminDateCalendar
                value={filterDateIso}
                onChange={setFilterFromIso}
                dayCounts={dayOrderCounts}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="بحث…"
                className="min-w-[180px] flex-1 p-2.5 rounded-xl border border-[#e6d9cc] bg-white text-sm"
              />
              {mode === 'orders' && (
                <button
                  type="button"
                  disabled={busy || !orders.length}
                  onClick={() => {
                    if (!token) return;
                    const ok = window.confirm(
                      `غادي تمسح ${orders.length} طلب كاملين من قاعدة البيانات. متأكد؟`,
                    );
                    if (!ok) return;
                    const typed = window.prompt(
                      'كتب DELETE_ALL_ORDERS باش يتأكد المسح:',
                    );
                    if (typed !== 'DELETE_ALL_ORDERS') {
                      setError('تم الإلغاء — النص غير مطابق');
                      return;
                    }
                    void (async () => {
                      setBusy(true);
                      setError('');
                      try {
                        const res = await purgeAllAdminOrders(token);
                        setOrders([]);
                        await load(token, true);
                        window.alert(
                          `تم المسح: ${res.deleted_orders} طلب`,
                        );
                      } catch (err) {
                        setError(
                          err instanceof Error ? err.message : 'فشل المسح',
                        );
                      } finally {
                        setBusy(false);
                      }
                    })();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-red-300 bg-red-50 text-red-800 text-sm font-bold disabled:opacity-50"
                >
                  مسح الكل
                </button>
              )}
              {mode === 'ship' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowOzoneConfig((v) => !v)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-bold ${
                      ozoneReady
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                        : 'border-[#C45B6A]/40 bg-[#C45B6A]/10 text-[#7a2f3a]'
                    }`}
                  >
                    <Link2 className="w-4 h-4" />
                    {ozoneReady ? 'OzonExpress مربوط' : 'ربط OzonExpress'}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const batch = todayConfirmedForCourier(orders);
                      await copyText(buildCourierBatchText(batch));
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1200);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#e6d9cc] bg-white text-sm font-bold"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'تم النسخ' : 'نسخ مؤكدي اليوم'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      printCourierList(todayConfirmedForCourier(orders))
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#e6d9cc] bg-white text-sm font-bold"
                  >
                    طباعة
                  </button>
                  <button
                    type="button"
                    disabled={busy || !ozoneReady || selectedShipIds.length === 0}
                    onClick={() => void runSelectedOzonShip()}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#2a1810] text-white text-sm font-bold disabled:opacity-50"
                  >
                    <Truck className="w-4 h-4" />
                    إرسال لـ Ozon
                    {selectedShipIds.length
                      ? ` · ${selectedShipIds.length}`
                      : ''}
                  </button>
                  <button
                    type="button"
                    disabled={busy || !ozoneReady}
                    onClick={() => {
                      if (!token) return;
                      void (async () => {
                        setBusy(true);
                        setError('');
                        setBatchMsg('');
                        try {
                          const res = await syncOzonExpress(token);
                          const details = res.details || [];
                          const noResp = details.filter((d) =>
                            isOzonNoResponseStatus(d.courier_status),
                          );
                          const delivered = details.filter(
                            (d) => d.status === 'DELIVERED',
                          );
                          const parts = [
                            res.message ||
                              `مزامنة: ${res.checked ?? 0} تتبع · ${res.updated ?? 0} تحديث`,
                          ];
                          if (delivered.length) {
                            parts.push(
                              `${delivered.length} livré — صيفطي ميساج الشكر من التفاصيل`,
                            );
                          }
                          if (noResp.length) {
                            parts.push(
                              `⚠ ${noResp.length} pas de réponse: ${noResp
                                .map((d) => d.order_number)
                                .join(', ')}`,
                            );
                          }
                          setBatchMsg(parts.join(' · '));
                          await withPreservedScroll(async () => {
                            await load(token, true);
                          });
                        } catch (err) {
                          setError(
                            err instanceof Error ? err.message : 'فشل المزامنة',
                          );
                        } finally {
                          setBusy(false);
                        }
                      })();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#c45c26] text-white text-sm font-bold disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    تحديث حالات Ozone
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const qs = new URLSearchParams({
                        token,
                        template: courier,
                        status: 'CONFIRMED,READY_TO_SHIP',
                      });
                      window.location.href = `/api/admin/orders/export/courier?${qs}`;
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#e6d9cc] bg-white text-sm font-bold"
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `/api/admin/orders/csv?token=${encodeURIComponent(token)}`;
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#2a1810] text-white font-bold text-sm"
                >
                  <Download className="w-4 h-4" />
                  Excel
                </button>
              )}
            </div>
          </div>

          {mode === 'orders' ? (
            <div className="rounded-xl border border-[#C4A484]/40 bg-white px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold tabular-nums text-[#2a1810]">
                  {orders.filter(isConfirmQueue).length}
                </p>
                <div>
                  <p className="text-sm font-bold text-[#2a1810]">فـ الطابور</p>
                  <p className="text-[11px] text-[#6a5648]">واتساب · اتصال · تأكيد</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWaIntake(true)}
                className="px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold"
              >
                + طلب واتساب
              </button>
            </div>
          ) : null}

          {mode === 'ship' && showOzoneConfig ? (
            <div className="rounded-xl border border-[#e6d9cc] bg-white px-4 py-4 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-[#2a1810]">ربط OzonExpress</p>
                  <p className="text-xs text-[#6a5648] mt-0.5">
                    Customer ID + API Key من لوحة OzonExpress · كيتخزّنو فالسيرفر
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOzoneConfig(false)}
                  className="p-1.5 rounded-lg border border-[#e6d9cc] text-[#6a5648]"
                  aria-label="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-bold text-[#2a1810]">Customer ID</span>
                  <input
                    value={ozoneId}
                    onChange={(e) => setOzoneId(e.target.value)}
                    placeholder="مثلاً 12345"
                    autoComplete="off"
                    className="mt-1 w-full p-3 rounded-xl border border-[#e6d9cc] bg-[#faf6f1]"
                    dir="ltr"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-bold text-[#2a1810]">API Key</span>
                  <input
                    type="password"
                    value={ozoneKey}
                    onChange={(e) => setOzoneKey(e.target.value)}
                    placeholder="مفتاح API"
                    autoComplete="off"
                    className="mt-1 w-full p-3 rounded-xl border border-[#e6d9cc] bg-[#faf6f1]"
                    dir="ltr"
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={
                    ozoneSaving || !token || !ozoneId.trim() || !ozoneKey.trim()
                  }
                  onClick={() => {
                    if (!token) return;
                    void (async () => {
                      setOzoneSaving(true);
                      setError('');
                      try {
                        const res = await saveOzonExpressConfig(token, {
                          customer_id: ozoneId.trim(),
                          api_key: ozoneKey.trim(),
                        });
                        setOzoneReady(Boolean(res.ok));
                        setOzoneKey('');
                        if (res.ok) {
                          setShowOzoneConfig(false);
                          window.alert(
                            res.message || 'تم الربط مع OzonExpress بنجاح',
                          );
                        } else {
                          setError(
                            res.message ||
                              'تم الحفظ لكن الاختبار فشل — تحقق من المفاتيح',
                          );
                        }
                      } catch (err) {
                        setError(
                          err instanceof Error
                            ? err.message
                            : 'فشل حفظ إعدادات OzonExpress',
                        );
                      } finally {
                        setOzoneSaving(false);
                      }
                    })();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2a1810] text-white text-sm font-bold disabled:opacity-50"
                >
                  <Link2 className="w-4 h-4" />
                  {ozoneSaving ? 'جاري الحفظ…' : 'حفظ واختبار'}
                </button>
                {ozoneReady ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4" />
                    مربوط حالياً
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm text-[#7a2f3a]">
                    <AlertTriangle className="w-4 h-4" />
                    غير مربوط
                  </span>
                )}
              </div>
            </div>
          ) : null}

          {mode === 'ship' && (batchMsg || selectedShipIds.length > 0) ? (
            <div className="rounded-xl border border-[#e6d9cc] bg-white px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
              <p className="text-[#2a1810] font-bold">
                {batchMsg ||
                  (selectedShipIds.length === 1
                    ? `محدد: ${selectedShipIds[0]} — جاهز للإرسال لـ OzonExpress`
                    : `محدد: ${selectedShipIds.length} طلبات — جاهزين للإرسال لـ OzonExpress`)}
              </p>
              {selectedShipIds.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setSelectedShip({})}
                  className="text-xs font-bold text-[#6a5648] underline"
                >
                  إلغاء التحديد
                </button>
              ) : null}
            </div>
          ) : null}

          {orderFilters.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {orderFilters.map((f) => {
                const count =
                  f.id === 'all'
                    ? pipeCounts.confirmed +
                      pipeCounts.shipped +
                      pipeCounts.delivered +
                      pipeCounts.returned
                    : pipeCounts[f.id];
                const on = pipe === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => goPipe(f.id, mode === 'ship' ? 'ship' : 'orders')}
                    className={`rounded-lg px-3.5 py-2 text-sm font-bold border tabular-nums ${
                      on
                        ? 'bg-[#2a1810] text-white border-[#2a1810]'
                        : 'bg-white border-[#e6d9cc] text-[#5c4a3c] hover:border-[#C4A484]'
                    }`}
                  >
                    {f.label}
                    <span className={`ms-1.5 ${on ? 'opacity-80' : 'opacity-55'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {(mode === 'orders' || mode === 'ship') && (
            <StatusColorLegend mode={mode} />
          )}

          {mode === 'orders' ? (
            <div className="rounded-xl border border-[#e6d9cc] bg-white overflow-hidden">
              {pagedRows.length === 0 ? (
                <p className="p-12 text-center text-[#6a5648]">
                  ما كاين حتى طلب فهاد الفلتر.
                </p>
              ) : (
                <ul className="divide-y divide-[#eee4d8]">
                  {pagedRows.map((o) => {
                    const st = confirmStatusStyle(o.status);
                    const canCallQueue = isCallTodayQueue(o);
                    return (
                      <li
                        key={o.order_number}
                        className={`px-3 py-3.5 sm:px-4 ${rowStageClass(o)}`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                          <button
                            type="button"
                            onClick={() => openDetail(o.order_number)}
                            className="min-w-0 flex-1 text-right"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${st.soft}`}
                              >
                                {o.status_label}
                              </span>
                              <span className="text-[11px] font-bold text-[#6a5648] tabular-nums">
                                {daysLabel(o)}
                              </span>
                              <span className="text-[11px] text-[#8a7464] tabular-nums">
                                {formatAdminDate(o.created_at)}
                              </span>
                            </div>
                            <p className="mt-1.5 text-base font-bold text-[#2a1810] truncate">
                              {o.customer_name}
                            </p>
                            <p className="mt-0.5 text-sm text-[#5c4a3c] truncate">
                              {o.city}
                              <span className="text-[#c4a484]"> · </span>
                              {formatStoreProductLine(o.products)}
                            </p>
                            <p className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-xs text-[#6a5648]">
                              <span className="font-mono">{o.order_number}</span>
                              <span className="font-bold tabular-nums text-[#2a1810] text-sm">
                                {o.total_amount} DH
                              </span>
                            </p>
                          </button>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <a
                              href={telHref(o.phone)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2a1810] px-3.5 py-2.5 text-sm font-bold text-white"
                              dir="ltr"
                            >
                              <Phone className="w-4 h-4" />
                              {o.phone}
                            </a>
                            <button
                              type="button"
                              onClick={() =>
                                openCustomerWhatsApp(
                                  o.phone,
                                  buildCallCenterConfirmMessage(o),
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2.5 text-sm font-bold text-white"
                              aria-label="واتساب"
                            >
                              <MessageCircle className="w-4 h-4" />
                              واتساب
                            </button>
                            {canCallQueue ? (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => markNoAnswer(o)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#e6d9cc] bg-white px-3 py-2.5 text-sm font-bold text-[#5c4a3c] disabled:opacity-50"
                              >
                                <PhoneMissed className="w-4 h-4" />
                                ما جاوبش
                              </button>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => openDetail(o.order_number)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-[#e6d9cc] bg-[#faf6f1] px-3 py-2.5 text-sm font-bold text-[#2a1810]"
                            >
                              <Eye className="w-4 h-4" />
                              فتح
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#b7c9b0] bg-white shadow-sm">
              <table className="w-full text-sm text-right border-collapse min-w-[1100px]">
                <thead>
                  <tr className="bg-[#dfe9d8] text-[#243d22] border-b border-[#b7c9b0]">
                    <th className="p-2.5 font-semibold border-l border-[#b7c9b0] w-10 text-center">
                      <input
                        type="checkbox"
                        checked={allShipPageSelected}
                        disabled={shipSelectableOnPage.length === 0}
                        onChange={toggleSelectAllShipPage}
                        aria-label="تحديد كل الجاهزين فهاد الصفحة"
                        className="h-4 w-4 accent-[#c45c26] disabled:opacity-30"
                        title="تحديد / إلغاء كل الطلبات الجاهزة فهاد الصفحة"
                      />
                    </th>
                    <th className="p-2.5 font-semibold border-l border-[#b7c9b0] whitespace-nowrap">
                      التاريخ
                    </th>
                    <th className="p-2.5 font-semibold border-l border-[#b7c9b0] whitespace-nowrap">
                      أيام
                    </th>
                    <th className="p-2.5 font-semibold border-l border-[#b7c9b0] whitespace-nowrap">
                      رقم
                    </th>
                    <th className="p-2.5 font-semibold border-l border-[#b7c9b0]">
                      الزبون
                    </th>
                    <th className="p-2.5 font-semibold border-l border-[#b7c9b0] whitespace-nowrap">
                      هاتف
                    </th>
                    <th className="p-2.5 font-semibold border-l border-[#b7c9b0]">
                      مدينة
                    </th>
                    <th className="p-2.5 font-semibold border-l border-[#b7c9b0] min-w-[100px]">
                      منتج
                    </th>
                    <th className="p-2.5 font-semibold border-l border-[#b7c9b0] whitespace-nowrap">
                      مبلغ
                    </th>
                    <th className="p-2.5 font-semibold border-l border-[#b7c9b0]">
                      حالة
                    </th>
                    <th className="p-2.5 font-semibold border-l border-[#b7c9b0]">
                      Ozon
                    </th>
                    <th className="p-2.5 font-semibold"> </th>
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={12}
                        className="p-12 text-center text-[#6a5648]"
                      >
                        ما كاين حتى طلب فهاد الفلتر.
                      </td>
                    </tr>
                  ) : (
                    pagedRows.map((o) => {
                      const ozoneOk = canSendToOzon(o);
                      return (
                        <tr
                          key={o.order_number}
                          className={`border-t border-[#dde8d8] ${rowStageClass(o)} hover:brightness-[0.98]`}
                        >
                          <td className="p-2.5 border-l border-[#dde8d8] text-center">
                            <input
                              type="checkbox"
                              disabled={!ozoneOk}
                              checked={Boolean(selectedShip[o.order_number])}
                              onChange={(e) =>
                                toggleShipSelect(
                                  o.order_number,
                                  e.target.checked,
                                )
                              }
                              aria-label={`اختيار ${o.order_number} للإرسال`}
                              className="h-4 w-4 accent-[#c45c26] disabled:opacity-30"
                              title={
                                ozoneOk
                                  ? 'اختيار هاد الطلب للإرسال إلى Ozon'
                                  : 'خاص يكون مؤكد + عنوان كامل (≥8) بدون تتبع'
                              }
                            />
                          </td>
                          <td className="p-2.5 text-xs text-[#2a1810] whitespace-nowrap border-l border-[#dde8d8] tabular-nums font-medium">
                            {formatAdminDate(o.created_at)}
                          </td>
                          <td className="p-2.5 text-xs font-bold tabular-nums border-l border-[#dde8d8] whitespace-nowrap text-[#6a5648]">
                            {daysLabel(o)}
                          </td>
                          <td className="p-2.5 font-mono text-xs border-l border-[#dde8d8] whitespace-nowrap">
                            {o.order_number}
                          </td>
                          <td
                            className="p-2.5 font-medium border-l border-[#dde8d8] max-w-[140px] truncate"
                            title={o.customer_name}
                          >
                            {o.customer_name}
                          </td>
                          <td className="p-2.5 dir-ltr text-left border-l border-[#dde8d8] whitespace-nowrap font-semibold tracking-wide">
                            {o.phone}
                          </td>
                          <td
                            className="p-2.5 border-l border-[#dde8d8] text-xs max-w-[100px] truncate"
                            title={o.city}
                          >
                            {o.city}
                          </td>
                          <td
                            className="p-2.5 text-xs max-w-[160px] truncate border-l border-[#dde8d8]"
                            title={o.products}
                          >
                            {formatStoreProductLine(o.products)}
                          </td>
                          <td className="p-2.5 font-bold tabular-nums border-l border-[#dde8d8] whitespace-nowrap">
                            {o.total_amount}
                          </td>
                          <td className="p-2.5 text-xs font-bold border-l border-[#dde8d8] whitespace-nowrap">
                            {o.status_label}
                          </td>
                          <td className="p-2.5 text-xs border-l border-[#dde8d8]">
                            {o.courier_status ? (
                              <div>
                                <p
                                  className={`font-bold ${
                                    isOzonNoResponseStatus(o.courier_status)
                                      ? 'text-amber-800'
                                      : 'text-[#c45c26]'
                                  }`}
                                >
                                  {o.courier_status}
                                </p>
                                {o.tracking_number ? (
                                  <p className="font-mono text-[11px] text-[#6a5648] mt-0.5">
                                    {o.tracking_number}
                                  </p>
                                ) : null}
                                {isOzonNoResponseStatus(o.courier_status) ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openCustomerWhatsApp(
                                        o.phone,
                                        buildNoResponseWhatsAppMessage(o),
                                      )
                                    }
                                    className="mt-1 text-[11px] font-bold text-[#25D366] underline"
                                  >
                                    تذكير واتساب
                                  </button>
                                ) : null}
                              </div>
                            ) : o.tracking_number ? (
                              <p className="font-mono text-[11px]">
                                {o.tracking_number}
                              </p>
                            ) : o.follow_up_at ? (
                              formatAdminDate(o.follow_up_at)
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="p-2">
                            <button
                              type="button"
                              onClick={() => openDetail(o.order_number)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2a1810] text-white text-xs font-bold"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              فتح
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between text-xs text-[#6a5648]">
            <label className="inline-flex items-center gap-2">
              <span>عرض</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded-lg border border-[#e6d9cc] bg-white px-2 py-1.5 text-sm font-semibold text-[#2a1810]"
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span>في الصفحة</span>
            </label>
            <p className="tabular-nums">
              {rangeFrom}–{rangeTo} من {sheetRows.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-[#e6d9cc] bg-white px-3 py-1.5 font-bold text-[#2a1810] disabled:opacity-35"
              >
                السابق
              </button>
              <span className="tabular-nums font-semibold text-[#2a1810]">
                {safePage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-[#e6d9cc] bg-white px-3 py-1.5 font-bold text-[#2a1810] disabled:opacity-35"
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      )}

      {detailOpen && active ? (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            aria-label="إغلاق"
            onClick={closeDetail}
          />
          <div className="relative z-10 h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl border-s border-[#e6d9cc]">
            <div className="sticky top-0 flex items-center justify-between gap-2 border-b border-[#e6d9cc] bg-white px-4 py-3">
              <div>
                <h3 className="font-bold">Fiche commande</h3>
                <p className="text-xs text-[#6a5648]">
                  {active.status_label} · {daysLabel(active)}
                </p>
              </div>
              <button
                type="button"
                onClick={closeDetail}
                className="p-2 rounded-lg border border-[#e6d9cc]"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-5">
              {error ? (
                <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl px-3 py-2 font-bold">
                  {error}
                </p>
              ) : null}

              {active.sheet_sync_error ? (
                <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl px-3 py-2 font-bold">
                  Sheet sync: {active.sheet_sync_error}
                </p>
              ) : null}

              <div>
                <p className="text-xs text-[#6a5648] font-mono">
                  {active.order_number} · {timeAgo(active.created_at)}
                </p>
                <h2 className="text-2xl font-bold mt-1">{active.customer_name}</h2>
                <p className="text-xl font-semibold mt-2 dir-ltr tracking-wide">
                  {active.phone}
                </p>
                <p className="text-2xl font-bold tabular-nums mt-3">
                  {active.total_amount}{' '}
                  <span className="text-sm text-[#6a5648]">DH COD</span>
                </p>
                {(active.last_contacted_at || active.last_operator) && (
                  <p className="text-xs text-[#6a5648] mt-2">
                    آخر اتصال:{' '}
                    {active.last_contacted_at
                      ? formatAdminDate(active.last_contacted_at)
                      : '—'}
                    {active.last_operator
                      ? ` · ${active.last_operator}`
                      : ''}
                  </p>
                )}
              </div>

              <div className="text-sm space-y-2 rounded-xl bg-[#faf6f1] border border-[#e6d9cc] p-3">
                <p>
                  <span className="text-[#6a5648]">المنتجات: </span>
                  {formatStoreProductLine(active.products)}
                </p>
                {active.follow_up_at ? (
                  <p>
                    <span className="text-[#6a5648]">موعد مؤجل: </span>
                    {formatAdminDate(active.follow_up_at)}
                  </p>
                ) : null}
                {active.tracking_number ? (
                  <p>
                    <span className="text-[#6a5648]">Tracking: </span>
                    {active.tracking_number}
                  </p>
                ) : null}
                {active.courier_status ? (
                  <p>
                    <span className="text-[#6a5648]">حالة Ozone: </span>
                    <span className="font-bold text-[#c45c26]">
                      {active.courier_status}
                    </span>
                  </p>
                ) : null}
                <label className="block">
                  <span className="text-[#6a5648] text-xs font-bold">
                    المدينة / الحي
                  </span>
                  <div className="mt-1">
                    <CitySelect
                      value={shipCity}
                      onChange={setShipCity}
                      allowCustom
                      className="text-sm"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-[#6a5648] text-xs font-bold">
                    العنوان
                  </span>
                  <textarea
                    value={shipAddress}
                    onChange={(e) => setShipAddress(e.target.value)}
                    rows={2}
                    className="mt-1 w-full p-2.5 rounded-lg border border-[#e6d9cc] bg-white resize-none"
                    placeholder="الحي، الشارع..."
                  />
                </label>
                <button
                  type="button"
                  disabled={
                    busy ||
                    (shipCity.trim() === (active.city || '') &&
                      shipAddress.trim() === (active.address || ''))
                  }
                  onClick={() =>
                    void patch(active.order_number, {
                      status: active.status,
                      city: shipCity.trim(),
                      address: shipAddress.trim(),
                    })
                  }
                  className="w-full py-2.5 rounded-lg border-2 border-[#2a1810] font-bold text-sm disabled:opacity-40"
                >
                  حفظ المدينة والعنوان
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={telHref(active.phone)}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#2a1810] text-white font-bold text-sm"
                >
                  <Phone className="w-4 h-4" />
                  اتصال
                </a>
                <a
                  href={customerWhatsAppHref(
                    active.phone,
                    buildWhatsAppForOrder(active),
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  {whatsAppButtonLabel(resolveWhatsAppStage(active))}
                </a>
              </div>

              {isOzonNoResponseStatus(active.courier_status) ? (
                <button
                  type="button"
                  onClick={() =>
                    openCustomerWhatsApp(
                      active.phone,
                      buildNoResponseWhatsAppMessage(active),
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-amber-500 bg-amber-50 text-amber-950 font-bold text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  تذكير — livreur ما لقاش الزبون
                </button>
              ) : null}

              {hasRealTracking(active) ? (
                <button
                  type="button"
                  onClick={async () => {
                    await copyText(active.tracking_number || '');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#c45c26] text-[#c45c26] font-bold text-sm"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'تم نسخ التتبع' : 'نسخ رقم التتبع'}
                </button>
              ) : null}

              {canPickConfirmStatut(active) ? (
                <div className="rounded-2xl border border-[#e6d9cc]/80 bg-white shadow-sm overflow-hidden">
                  {!showCancel && !showReporte ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowStatutMenu((v) => !v)}
                        className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-[#faf6f1] transition-colors"
                      >
                        <span
                          className={`h-10 w-1.5 shrink-0 rounded-full ${
                            confirmStatusStyle(active.status).bar
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6a5648]">
                            Statut
                          </p>
                          <p
                            className={`mt-1 inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${
                              confirmStatusStyle(active.status).soft
                            }`}
                          >
                            {active.status_label ||
                              confirmStatusStyle(active.status).label}
                          </p>
                        </div>
                        <span className="text-[#6a5648] text-sm font-bold shrink-0">
                          {showStatutMenu ? 'Fermer' : 'Changer'}
                        </span>
                      </button>

                      {showStatutMenu ? (
                        <div className="border-t border-[#e6d9cc] bg-[#F7F1EC]/50 px-3 py-3 space-y-4 max-h-[55dvh] overflow-y-auto">
                          {CONFIRM_STATUS_GROUPS.map((group) => (
                            <div key={group.id} className="space-y-1.5">
                              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6a5648] px-1">
                                {group.title}
                              </p>
                              <div className="space-y-1.5">
                                {CONFIRM_STATUSES.filter(
                                  (s) => s.group === group.id,
                                ).map((s) => {
                                  const on =
                                    active.status === s.id ||
                                    (s.id === 'APPEL_1' &&
                                      active.status === 'NO_ANSWER');
                                  return (
                                    <button
                                      key={s.id}
                                      type="button"
                                      disabled={busy || on}
                                      onClick={() => {
                                        if (s.id === 'CANCELLED') {
                                          setShowStatutMenu(false);
                                          setShowCancel(true);
                                          return;
                                        }
                                        void (async () => {
                                          await patch(active.order_number, {
                                            status: s.id,
                                          });
                                          setShowStatutMenu(false);
                                          if (s.id === 'APPEL_WHATSAPP') {
                                            openCustomerWhatsApp(
                                              active.phone,
                                              buildCallCenterConfirmMessage(
                                                active,
                                              ),
                                            );
                                          }
                                        })();
                                      }}
                                      className={`w-full flex items-center gap-3 rounded-xl border px-2.5 py-2.5 text-left transition-all disabled:opacity-100 ${
                                        on
                                          ? `${s.soft} border-transparent shadow-sm ring-2 ring-[#1C1412]/15`
                                          : `${s.soft} hover:brightness-[0.98]`
                                      }`}
                                    >
                                      <span
                                        className={`h-8 w-1.5 shrink-0 rounded-full ${s.bar}`}
                                      />
                                      <span className="flex-1 text-sm font-bold leading-tight">
                                        {s.label}
                                      </span>
                                      {on ? (
                                        <Check className="w-4 h-4 shrink-0 opacity-80" />
                                      ) : null}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </>
                  ) : null}

                  {showCancel ? (
                    <div className="px-3 py-3 space-y-3">
                      <p className="font-bold">Annulé — سبب الإلغاء</p>
                      <div className="flex flex-wrap gap-2">
                        {CANCEL_REASONS.map((r) => (
                          <button
                            key={r}
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              void patch(
                                active.order_number,
                                {
                                  status: 'CANCELLED',
                                  cancel_reason: r,
                                  notes: r,
                                },
                                true,
                              )
                            }
                            className="px-3 py-2 rounded-lg border border-[#e6d9cc] bg-[#faf6f1] text-sm"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCancel(false);
                          setShowStatutMenu(true);
                        }}
                        className="text-sm text-[#6a5648]"
                      >
                        رجوع
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {isConfirmQueue(active) && showReporte ? (
                <div className="space-y-3">
                  <p className="font-bold">مؤجل — يوم الاتصال</p>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-[#e6d9cc] bg-[#faf6f1]"
                  />
                  <button
                    type="button"
                    disabled={busy || !followUpDate}
                    onClick={() =>
                      void patch(
                        active.order_number,
                        {
                          status: 'REPORTE',
                          follow_up_at: `${followUpDate}T09:00:00`,
                          notes: notes || `مؤجل إلى ${followUpDate}`,
                        },
                        true,
                      )
                    }
                    className="w-full py-3.5 rounded-xl bg-sky-800 text-white font-bold"
                  >
                    حفظ التأجيل
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReporte(false)}
                    className="text-sm text-[#6a5648]"
                  >
                    رجوع
                  </button>
                </div>
              ) : null}

              {(active.status === 'CONFIRMED' ||
                active.status === 'READY_TO_SHIP') && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#6a5648]">Expédition</p>
                  {!ozoneReady ? (
                    <button
                      type="button"
                      onClick={() => {
                        setShowOzoneConfig(true);
                        closeDetail();
                      }}
                      className="w-full text-sm text-left text-[#7a2f3a] bg-[#C45B6A]/10 border border-[#C45B6A]/30 rounded-xl px-3 py-2 font-bold"
                    >
                      OzonExpress غير مربوط — كليكة باش تدخل المفاتيح
                    </button>
                  ) : null}
                  {!shipAddrOk ? (
                    <p className="text-sm text-amber-950 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                      العنوان خاصو يكون كامل (حي / زنقة — على الأقل 8 أحرف).
                      «Rabat» وحدها ما تكفيش.
                    </p>
                  ) : null}
                  <label className="block">
                    <span className="text-[#6a5648] text-xs font-bold">
                      مدينة الشحن
                    </span>
                    <div className="mt-1">
                      <CitySelect
                        value={shipCity}
                        onChange={setShipCity}
                        allowCustom
                        className="text-sm"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-[#6a5648] text-xs font-bold">
                      عنوان التسليم
                    </span>
                    <textarea
                      value={shipAddress}
                      onChange={(e) => setShipAddress(e.target.value)}
                      rows={2}
                      className={`mt-1 w-full p-2.5 rounded-lg border bg-white resize-none ${
                        shipAddrOk
                          ? 'border-[#e6d9cc]'
                          : 'border-amber-400 ring-2 ring-amber-200'
                      }`}
                      placeholder="مثال: Hay Riad, Rue 12 N°5"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COURIERS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCourier(c.id);
                          localStorage.setItem(COURIER_PREF_KEY, c.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm border ${
                          courier === c.id
                            ? 'bg-[#2a1810] text-white border-[#2a1810]'
                            : 'border-[#e6d9cc] bg-[#faf6f1]'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                  <input
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    placeholder="N° tracking (يدوي)"
                    className="w-full p-3 rounded-xl border border-[#e6d9cc] bg-[#faf6f1]"
                  />
                  {hasRealTracking(active) ? (
                    <p className="text-sm text-center text-[#c45c26] font-bold bg-[#fff7f0] border border-[#f0d0b8] rounded-xl p-3">
                      تصيفط من قبل — {active.tracking_number}
                    </p>
                  ) : (
                    <button
                      type="button"
                      disabled={busy || !ozoneReady}
                      onClick={() => {
                        if (!shipAddrOk) {
                          setError(
                            'كمّل العنوان (حي/زنقة — 8 أحرف على الأقل) قبل إرسال OzonExpress',
                          );
                          return;
                        }
                        setError('');
                        setShipConfirm(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#c45c26] text-white font-bold disabled:opacity-50"
                    >
                      <Truck className="w-4 h-4" />
                      {ozoneReady
                        ? 'إرسال إلى OzonExpress'
                        : 'OzonExpress غير مضبوط'}
                    </button>
                  )}
                  {shipConfirm ? (
                    <div className="rounded-xl border-2 border-[#c45c26] bg-[#fff7f0] p-3 space-y-2 text-sm">
                      <p className="font-bold">تأكيد الإرسال؟</p>
                      <p>
                        {active.customer_name} · {active.phone}
                      </p>
                      <p>
                        {shipCity || active.city} —{' '}
                        {shipAddress || active.address}
                      </p>
                      <p className="font-bold tabular-nums">
                        {active.total_amount} DH COD
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShipConfirm(false)}
                          className="py-2 rounded-lg border border-[#e6d9cc] font-bold"
                        >
                          إلغاء
                        </button>
                        <button
                          type="button"
                          disabled={busy || !shipAddrOk}
                          onClick={() => {
                            setShipConfirm(false);
                            void doShip(active.order_number, true);
                          }}
                          className="py-2 rounded-lg bg-[#c45c26] text-white font-bold disabled:opacity-50"
                        >
                          نعم، إرسال
                        </button>
                      </div>
                    </div>
                  ) : null}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      await copyText(buildCourierCopyLine(active));
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1200);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-[#2a1810] font-bold"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? 'Copié' : 'Copier pour transporteur'}
                  </button>
                  <button
                    type="button"
                    disabled={busy || !shipAddrOk}
                    onClick={() => void doShip(active.order_number, false)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#2a1810] text-white font-bold disabled:opacity-50"
                  >
                    <Truck className="w-4 h-4" />
                    Expédié يدوي (En cours)
                  </button>
                </div>
              )}

              {active.status === 'SHIPPED' && (
                <div className="space-y-2">
                  {hasRealTracking(active) ? (
                    <a
                      href={customerWhatsAppHref(
                        active.phone,
                        buildShippedWhatsAppMessage(active),
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      واتساب التتبع للزبونة
                    </a>
                  ) : null}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      void patch(
                        active.order_number,
                        { status: 'DELIVERED' },
                        true,
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-700 text-white font-bold"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    مسلم
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      void patch(
                        active.order_number,
                        { status: 'RETURNED' },
                        true,
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-red-600 text-red-700 font-bold"
                  >
                    <RotateCcw className="w-4 h-4" />
                    مرتجع
                  </button>
                </div>
              )}

              {(activeStage === 'delivered' ||
                activeStage === 'returned' ||
                activeStage === 'cancelled') && (
                <p className="text-sm text-[#6a5648] bg-[#faf6f1] border border-[#e6d9cc] rounded-xl px-3 py-3">
                  الطلب مغلق:{' '}
                  <span className="font-bold">{active.status_label}</span>
                </p>
              )}

              <div>
                <label className="text-xs text-[#6a5648]">ملاحظة</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="mt-1 w-full p-3 rounded-xl border border-[#e6d9cc] bg-[#faf6f1] text-sm"
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    void patch(active.order_number, {
                      status: active.status,
                      notes,
                    })
                  }
                  className="mt-1 text-sm text-[#6a5648] underline"
                >
                  حفظ الملاحظة
                </button>
              </div>

              {auditEvents.length > 0 ? (
                <div className="rounded-xl border border-[#e6d9cc] bg-[#faf6f1] p-3 space-y-2">
                  <p className="text-xs font-bold text-[#6a5648]">آخر الأحداث</p>
                  <ul className="space-y-1.5 text-xs">
                    {auditEvents.map((ev, i) => (
                      <li
                        key={`${ev.created_at}-${i}`}
                        className="border-b border-[#e6d9cc]/60 pb-1.5 last:border-0"
                      >
                        <span className="font-bold">{ev.action}</span>
                        {ev.operator ? ` · ${ev.operator}` : ''}
                        <span className="text-[#6a5648]">
                          {' '}
                          · {formatAdminDate(ev.created_at)}
                        </span>
                        {ev.detail ? (
                          <p className="text-[#6a5648] mt-0.5">{ev.detail}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {showWaIntake ? (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-3">
          <div
            dir="rtl"
            className="w-full max-w-md rounded-2xl bg-white border border-[#e6d9cc] shadow-2xl p-5 space-y-3 max-h-[90dvh] overflow-y-auto"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-[#2a1810]">طلب من واتساب</h2>
              <button
                type="button"
                onClick={() => setShowWaIntake(false)}
                className="p-2 rounded-lg border border-[#e6d9cc]"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#6a5648]">
              دخل الاسم والهاتف والعنوان — كيتسجل فنفس السيستام بحال طلب الموقع.
            </p>
            <input
              value={waForm.customer_name}
              onChange={(e) =>
                setWaForm((f) => ({ ...f, customer_name: e.target.value }))
              }
              placeholder="الاسم"
              className="w-full p-3 rounded-xl border border-[#e6d9cc] bg-[#faf6f1]"
            />
            <input
              value={waForm.phone}
              onChange={(e) =>
                setWaForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="الهاتف"
              dir="ltr"
              className="w-full p-3 rounded-xl border border-[#e6d9cc] bg-[#faf6f1] text-left"
            />
            <div>
              <CitySelect
                value={waForm.city}
                onChange={(city) => setWaForm((f) => ({ ...f, city }))}
                allowCustom
                className="text-sm"
              />
            </div>
            <textarea
              value={waForm.address}
              onChange={(e) =>
                setWaForm((f) => ({ ...f, address: e.target.value }))
              }
              placeholder="العنوان (الحي، الشارع…)"
              rows={2}
              className="w-full p-3 rounded-xl border border-[#e6d9cc] bg-[#faf6f1] resize-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={waForm.product_name}
                onChange={(e) => {
                  const name = e.target.value;
                  const hit = WA_CATALOG.find((p) => p.name === name);
                  setWaForm((f) => ({
                    ...f,
                    product_name: name,
                    unit_price: String(hit?.price ?? f.unit_price),
                  }));
                }}
                className="p-3 rounded-xl border border-[#e6d9cc] bg-[#faf6f1]"
              >
                {WA_CATALOG.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.label} · {p.price} DH
                  </option>
                ))}
                <option value="Autre">Autre / منتج حر</option>
              </select>
              <input
                value={waForm.unit_price}
                onChange={(e) =>
                  setWaForm((f) => ({ ...f, unit_price: e.target.value }))
                }
                placeholder="الثمن"
                dir="ltr"
                className="p-3 rounded-xl border border-[#e6d9cc] bg-[#faf6f1] text-left"
              />
            </div>
            {waForm.product_name === 'Autre' ||
            !WA_CATALOG.some((p) => p.name === waForm.product_name) ? (
              <input
                value={
                  WA_CATALOG.some((p) => p.name === waForm.product_name)
                    ? ''
                    : waForm.product_name
                }
                onChange={(e) =>
                  setWaForm((f) => ({
                    ...f,
                    product_name: e.target.value || 'Autre',
                  }))
                }
                placeholder="اسم المنتج الحر"
                className="w-full p-3 rounded-xl border border-[#e6d9cc] bg-[#faf6f1]"
              />
            ) : null}
            <input
              value={waForm.notes}
              onChange={(e) =>
                setWaForm((f) => ({ ...f, notes: e.target.value }))
              }
              placeholder="ملاحظة (اختياري)"
              className="w-full p-3 rounded-xl border border-[#e6d9cc] bg-[#faf6f1]"
            />
            <button
              type="button"
              disabled={waSaving}
              onClick={() => void submitWaIntake()}
              className="w-full py-3.5 rounded-xl bg-[#2a1810] text-white font-bold disabled:opacity-50"
            >
              {waSaving ? 'جاري الحفظ…' : 'حفظ + واتساب تأكيد'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
