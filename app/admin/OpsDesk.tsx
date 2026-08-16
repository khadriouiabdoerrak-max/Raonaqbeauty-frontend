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
import {
  buildCourierBatchText,
  CONFIRM_STATUSES,
  CONFIRM_STATUS_GROUPS,
  confirmStatusStyle,
  isCallTodayQueue,
  nextAppelStatus,
  phoneRiskInfo,
  printCourierList,
  todayConfirmedForCourier,
} from '@/lib/opsQueue';
import { CitySelect } from '@/components/ui/CitySelect';
import { STALE_SHIP_DAYS } from '@/lib/cities';
import { products, UPSELL } from '@/lib/products';
import { formatStoreProductLine } from '@/lib/productLabels';
import StoreInsightsPanel from './StoreInsightsPanel';

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
    'CANCELLED',
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
    o.status === 'SHIPPED'
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
  if (s === 'CONFIRMED' || s === 'READY_TO_SHIP')
    return 'bg-emerald-50/80 border-s-4 border-s-emerald-600';
  if (s === 'CANCELLED' || s === 'FAUX_NM' || s === 'DOUBLE' || s === 'INJOIGNABLE')
    return 'bg-stone-100 border-s-4 border-s-stone-400';
  if (s === 'BOITE_VOCALE' || s === 'APPEL_WHATSAPP')
    return 'bg-violet-50 border-s-4 border-s-violet-500';
  if (s === 'REPORTE') return 'bg-sky-50 border-s-4 border-s-sky-500';
  if (s === 'APPEL_7' || s === 'APPEL_6')
    return 'bg-[#F3D5DB] border-s-4 border-s-[#C45B6A]';
  if (s === 'APPEL_5' || s === 'APPEL_4' || s === 'APPEL_3')
    return 'bg-[#F8E8EB] border-s-4 border-s-[#C45B6A]/70';
  if (s === 'APPEL_2' || s === 'APPEL_1' || s === 'NO_ANSWER')
    return 'bg-amber-50 border-s-4 border-s-amber-400';
  if (s === 'SHIPPED') return 'bg-white border-s-4 border-s-[#2a1810]/40';
  if (s === 'PENDING_CONFIRMATION')
    return 'bg-[#F7F1EC] border-s-4 border-s-[#C4A484]';
  return 'bg-white';
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
  if (tab === 'board') return 'board';
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
}: {
  embedded?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = parseMode(searchParams.get('tab'));

  const [token, setToken] = useState('');
  const [pin, setPin] = useState('');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [mode, setMode] = useState<Mode>(initial);
  const [pipe, setPipe] = useState<PipeFilter>(
    initial === 'ship' ? 'confirmed' : 'call_today',
  );
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

  const goMode = (m: Mode) => {
    setMode(m);
    setShowCancel(false);
    setShowReporte(false);
    setDetailOpen(false);
    if (m === 'ship') setPipe('confirmed');
    else if (m === 'orders') {
      setPipe('call_today');
      setNewOrderCount(0);
    }
    router.replace(`/admin?tab=${modeQuery(m)}`, { scroll: false });
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
      if (data.stats) setStats(data.stats);
      setToken(secret);
      sessionStorage.setItem(ADMIN_TOKEN_KEY, secret);
    } catch (err) {
      if (!silent) {
        setToken('');
        setOrders([]);
        setStats(null);
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      }
      setError(err instanceof Error ? err.message : 'خطأ');
    } finally {
      setLoading(false);
      setBooting(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    const pref = localStorage.getItem(COURIER_PREF_KEY);
    if (pref) setCourier(pref);
    else setCourier('ozone');
    if (saved) void load(saved);
    else setBooting(false);
  }, [load]);

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

  useEffect(() => {
    if (!token) return;
    const id = window.setInterval(() => void load(token, true), 20000);
    return () => window.clearInterval(id);
  }, [token, load]);

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
    return [...orders].sort((a, b) => {
      const ac = isConfirmQueue(a);
      const bc = isConfirmQueue(b);
      if (ac && bc) return urgency(b) - urgency(a);
      if (ac !== bc) return ac ? -1 : 1;
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [orders]);

  const dateOptions = useMemo(() => {
    const years = new Set<number>();
    const months = new Set<number>();
    const days = new Set<number>();
    for (const o of orders) {
      const p = orderDateParts(o.created_at);
      if (!p.year) continue;
      years.add(p.year);
      if (!filterYear || p.year === Number(filterYear)) {
        months.add(p.month);
        if (
          (!filterYear || p.year === Number(filterYear)) &&
          (!filterMonth || p.month === Number(filterMonth))
        ) {
          days.add(p.day);
        }
      }
    }
    return {
      years: [...years].sort((a, b) => b - a),
      months: [...months].sort((a, b) => a - b),
      days: [...days].sort((a, b) => a - b),
    };
  }, [orders, filterYear, filterMonth]);

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
      } else if (pipe === 'stale') {
        list = list.filter(isStaleShip);
      }
    } else if (pipe === 'call_today') {
      list = list
        .filter(isCallTodayQueue)
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime(),
        );
    } else if (pipe === 'stale') {
      list = list.filter(isStaleShip);
    } else if (pipe !== 'all') {
      list = list.filter((o) => stageOf(o) === pipe);
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
      } else if (body.status === 'DELIVERED') {
        openCustomerWhatsApp(
          updated.phone,
          buildDeliveredWhatsAppMessage(updated),
        );
      }
      if (closeAfter) closeDetail();
      void load(token, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ');
    } finally {
      setBusy(false);
      setShowCancel(false);
      setShowReporte(false);
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
      await load(token, true);
      setPipe('call_today');
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
      void load(token, true);
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

  const shippableInSheet = useMemo(
    () => sheetRows.filter(canSendToOzon),
    [sheetRows],
  );

  const allShippableSelected =
    shippableInSheet.length > 0 &&
    shippableInSheet.every((o) => selectedShip[o.order_number]);

  const runBatchOzonShip = async () => {
    if (!token || !selectedShipIds.length) return;
    const ok = window.confirm(
      `إرسال ${selectedShipIds.length} طلب إلى OzonExpress دفعة واحدة؟`,
    );
    if (!ok) return;
    setBusy(true);
    setError('');
    setBatchMsg('');
    try {
      const results = await shipAdminOrdersBatch(token, selectedShipIds);
      const okN = results.filter((r) => r.ok).length;
      const fail = results.filter((r) => !r.ok);
      setBatchMsg(
        fail.length
          ? `تم ${okN} · فشل ${fail.length}: ${fail
              .map((f) => `${f.order_number} (${f.error})`)
              .join(' · ')}`
          : `تم إرسال ${okN} طلب إلى OzonExpress`,
      );
      setSelectedShip({});
      await load(token, true);
      if (okN > 0) {
        try {
          await syncOzonExpress(token);
          await load(token, true);
        } catch {
          /* ignore */
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل الإرسال الجماعي');
    } finally {
      setBusy(false);
    }
  };

  if (booting) {
    return (
      <div className="min-h-[100dvh] bg-[#f5f0ea] flex items-center justify-center text-[#6a5648]">
        جاري الفتح…
      </div>
    );
  }

  if (!token) {
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

  const risk = active
    ? phoneRiskInfo(orders, active.phone, active.order_number)
    : null;
  const activeStage = active ? stageOf(active) : null;
  const shipAddrOk =
    shipCity.trim().length >= 2 && shipAddress.trim().length >= 8;

  const orderFilters: { id: PipeFilter; label: string }[] =
    mode === 'ship'
      ? [
          { id: 'confirmed', label: 'مؤكد' },
          { id: 'shipped', label: 'مرسل' },
          { id: 'stale', label: `متأخر +${STALE_SHIP_DAYS}j` },
          { id: 'all', label: 'كل الشحن' },
        ]
      : [
          { id: 'call_today', label: 'طابور اليوم' },
          { id: 'all', label: 'الكل' },
          { id: 'en_attente', label: 'جديد' },
          { id: 'appel_1', label: 'مكالمة 1' },
          { id: 'appel_2', label: 'مكالمة 2' },
          { id: 'appel_3', label: 'مكالمة 3' },
          { id: 'reporte', label: 'مؤجل' },
          { id: 'confirmed', label: 'مؤكد' },
          { id: 'shipped', label: 'مرسل' },
          { id: 'stale', label: 'متأخر' },
          { id: 'delivered', label: 'مسلم' },
          { id: 'returned', label: 'مرتجع' },
          { id: 'cancelled', label: 'ملغى' },
        ];

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
                onClick={() => {
                  setNewOrderCount(0);
                  setPipe('call_today');
                  setMode('orders');
                  setDetailOpen(false);
                  router.replace('/admin?tab=confirm', { scroll: false });
                }}
                className="text-sm bg-red-600 text-white rounded-full px-3 py-1 tabular-nums font-bold animate-pulse"
              >
                +{newOrderCount} جديد
              </button>
            ) : null}
            <span className="text-sm bg-white border border-[#e6d9cc] rounded-full px-3 py-1 tabular-nums">
              {stats?.today ?? 0} اليوم
            </span>
            <span className="text-sm bg-white border border-[#e6d9cc] rounded-full px-3 py-1 tabular-nums">
              {confirmWaiting} تأكيد
            </span>
            <span className="text-sm bg-white border border-[#e6d9cc] rounded-full px-3 py-1 tabular-nums">
              {shipReady} جاهز للشحن
            </span>
            {(stats?.sheet_errors ?? 0) > 0 ? (
              <span className="text-sm bg-amber-100 border border-amber-300 text-amber-900 rounded-full px-3 py-1 tabular-nums font-bold">
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
                  {m.id === 'ship' ? ` (${shipReady + pipeCounts.shipped})` : ''}
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
            onClick={() => {
              setNewOrderCount(0);
              setPipe('call_today');
              setMode('orders');
                  router.replace('/admin?tab=confirm', { scroll: false });
            }}
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
                  {stats.weekly.top_cities.slice(0, 5).map((c) => (
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
                onClick={() => {
                  setPipe(c.filter);
                  setMode(c.desk);
                  router.replace(`/admin?tab=${modeQuery(c.desk)}`, {
                    scroll: false,
                  });
                }}
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
              <select
                value={filterYear}
                onChange={(e) => {
                  setFilterYear(e.target.value);
                  setFilterMonth('');
                  setFilterDay('');
                }}
                className="p-2.5 rounded-xl border border-[#e6d9cc] bg-white text-sm"
                aria-label="السنة"
              >
                <option value="">سنة</option>
                {dateOptions.years.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
              <select
                value={filterMonth}
                onChange={(e) => {
                  setFilterMonth(e.target.value);
                  setFilterDay('');
                }}
                className="p-2.5 rounded-xl border border-[#e6d9cc] bg-white text-sm"
                aria-label="الشهر"
              >
                <option value="">شهر</option>
                {dateOptions.months.map((m) => (
                  <option key={m} value={String(m)}>
                    {String(m).padStart(2, '0')}
                  </option>
                ))}
              </select>
              <select
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                className="p-2.5 rounded-xl border border-[#e6d9cc] bg-white text-sm"
                aria-label="اليوم"
              >
                <option value="">يوم</option>
                {dateOptions.days.map((d) => (
                  <option key={d} value={String(d)}>
                    {String(d).padStart(2, '0')}
                  </option>
                ))}
              </select>
              {(filterYear || filterMonth || filterDay) && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterYear('');
                    setFilterMonth('');
                    setFilterDay('');
                  }}
                  className="px-2.5 py-2.5 rounded-xl border border-[#e6d9cc] bg-white text-xs font-bold"
                >
                  مسح التاريخ
                </button>
              )}
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
                    onClick={() => void runBatchOzonShip()}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#2a1810] text-white text-sm font-bold disabled:opacity-50"
                  >
                    <Truck className="w-4 h-4" />
                    إرسال المحدد ({selectedShipIds.length})
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
                          await load(token, true);
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
            <div className="rounded-xl border border-[#C4A484]/50 bg-[#F7F1EC] px-4 py-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-[#2a1810]">
                  طابور اليوم: {pipeCounts.call_today}
                </p>
                <p className="text-[11px] text-[#6a5648] mt-0.5">
                  واتساب أولاً · من بعد اتصال · حتى 3 أيام (مكالمة 1→2→3) · هدف تقريبي ~7
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                <span className="rounded-full bg-[#F7F1EC] border border-[#C4A484] px-2 py-1">
                  جديد
                </span>
                <span className="rounded-full bg-amber-50 border border-amber-400 px-2 py-1">
                  يوم 1
                </span>
                <span className="rounded-full bg-[#F8E8EB] border border-[#C45B6A]/70 px-2 py-1">
                  يوم 2
                </span>
                <span className="rounded-full bg-[#F3D5DB] border border-[#C45B6A] px-2 py-1">
                  يوم 3
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowWaIntake(true)}
                className="px-3.5 py-2 rounded-xl bg-[#25D366] text-white text-sm font-bold"
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
                  `${selectedShipIds.length} طلب محدد للإرسال إلى OzonExpress`}
              </p>
              {selectedShipIds.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setSelectedShip({})}
                  className="text-xs font-bold text-[#6a5648] underline"
                >
                  مسح التحديد
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            {orderFilters.map((f) => {
              const count =
                mode === 'ship' && f.id === 'all'
                  ? pipeCounts.confirmed + pipeCounts.shipped
                  : pipeCounts[f.id];
              const on = pipe === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setPipe(f.id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold border tabular-nums ${
                    on
                      ? 'bg-[#2a1810] text-white border-[#2a1810]'
                      : 'bg-white border-[#e6d9cc] text-[#5c4a3c]'
                  }`}
                >
                  {f.label} ({count})
                </button>
              );
            })}
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#b7c9b0] bg-white shadow-sm">
            <table className="w-full text-sm text-right min-w-[1180px] border-collapse">
              <thead>
                <tr className="bg-[#dfe9d8] text-[#243d22] border-b border-[#b7c9b0]">
                  {mode === 'ship' ? (
                    <th className="p-2.5 font-semibold border-l border-[#b7c9b0] w-10">
                      <input
                        type="checkbox"
                        checked={allShippableSelected}
                        onChange={() => {
                          if (allShippableSelected) {
                            setSelectedShip({});
                            return;
                          }
                          const next: Record<string, boolean> = {};
                          for (const o of shippableInSheet) {
                            next[o.order_number] = true;
                          }
                          setSelectedShip(next);
                        }}
                        aria-label="تحديد الكل"
                        className="h-4 w-4 accent-[#c45c26]"
                      />
                    </th>
                  ) : null}
                  <th className="p-2.5 font-semibold border-l border-[#b7c9b0]">
                    تاريخ
                  </th>
                  <th className="p-2.5 font-semibold border-l border-[#b7c9b0]">
                    أيام
                  </th>
                  <th className="p-2.5 font-semibold border-l border-[#b7c9b0]">
                    N°
                  </th>
                  <th className="p-2.5 font-semibold border-l border-[#b7c9b0]">
                    Client
                  </th>
                  <th className="p-2.5 font-semibold border-l border-[#b7c9b0]">
                    Tél
                  </th>
                  <th className="p-2.5 font-semibold border-l border-[#b7c9b0]">
                    Ville
                  </th>
                  <th className="p-2.5 font-semibold border-l border-[#b7c9b0] min-w-[120px]">
                    Produits
                  </th>
                  <th className="p-2.5 font-semibold border-l border-[#b7c9b0]">
                    COD
                  </th>
                  <th className="p-2.5 font-semibold border-l border-[#b7c9b0]">
                    Statut
                  </th>
                  <th className="p-2.5 font-semibold border-l border-[#b7c9b0]">
                    État Ozon
                  </th>
                  <th className="p-2.5 font-semibold">تفاصيل</th>
                </tr>
              </thead>
              <tbody>
                {sheetRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={mode === 'ship' ? 12 : 11}
                      className="p-12 text-center text-[#6a5648]"
                    >
                      Aucune commande dans ce filtre.
                    </td>
                  </tr>
                ) : (
                  sheetRows.map((o) => {
                    const ozoneOk = canSendToOzon(o);
                    return (
                      <tr
                        key={o.order_number}
                        className={`border-t border-[#dde8d8] ${rowStageClass(o)} hover:brightness-[0.98]`}
                      >
                        {mode === 'ship' ? (
                          <td className="p-2.5 border-l border-[#dde8d8] text-center">
                            <input
                              type="checkbox"
                              disabled={!ozoneOk}
                              checked={Boolean(selectedShip[o.order_number])}
                              onChange={(e) => {
                                const on = e.target.checked;
                                setSelectedShip((prev) => {
                                  const next = { ...prev };
                                  if (on) next[o.order_number] = true;
                                  else delete next[o.order_number];
                                  return next;
                                });
                              }}
                              aria-label={`تحديد ${o.order_number}`}
                              className="h-4 w-4 accent-[#c45c26] disabled:opacity-30"
                              title={
                                ozoneOk
                                  ? 'تحديد للإرسال إلى Ozon'
                                  : 'خاص يكون مؤكد + عنوان كامل (≥8) بدون تتبع'
                              }
                            />
                          </td>
                        ) : null}
                        <td className="p-2.5 text-xs text-[#6a5648] whitespace-nowrap border-l border-[#dde8d8]">
                          {(() => {
                            const p = orderDateParts(o.created_at);
                            if (!p.year) return formatAdminDate(o.created_at);
                            return (
                              <>
                                <div className="font-bold text-[#2a1810] tabular-nums">
                                  {p.year}
                                </div>
                                <div className="tabular-nums">
                                  {String(p.day).padStart(2, '0')}/
                                  {String(p.month).padStart(2, '0')} · {p.time}
                                </div>
                              </>
                            );
                          })()}
                          <div className="text-[11px]">
                            {timeAgo(o.created_at)}
                          </div>
                        </td>
                        <td className="p-2.5 text-xs font-bold tabular-nums border-l border-[#dde8d8] whitespace-nowrap">
                          {daysLabel(o)}
                        </td>
                        <td className="p-2.5 font-mono text-xs border-l border-[#dde8d8]">
                          {o.order_number}
                        </td>
                        <td className="p-2.5 font-medium border-l border-[#dde8d8]">
                          {o.customer_name}
                        </td>
                        <td className="p-2.5 dir-ltr text-left border-l border-[#dde8d8] whitespace-nowrap">
                          {o.phone}
                        </td>
                        <td className="p-2.5 border-l border-[#dde8d8] dir-ltr text-left text-xs">
                          {o.city}
                        </td>
                        <td
                          className="p-2.5 text-xs max-w-[200px] border-l border-[#dde8d8]"
                          title={o.products}
                        >
                          {formatStoreProductLine(o.products)}
                        </td>
                        <td className="p-2.5 font-bold tabular-nums border-l border-[#dde8d8]">
                          {o.total_amount}
                        </td>
                        <td className="p-2.5 text-xs font-bold border-l border-[#dde8d8]">
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
                            تفاصيل
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#6a5648] tabular-nums">
            {sheetRows.length} lignes
          </p>
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

              {risk?.risky ? (
                <div className="flex gap-2 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p>
                      Attention: annulations / retours / doublons sur ce numéro
                      ({risk.cancelled} annul. · {risk.returned} ret.).
                    </p>
                    {risk.openDupes.length > 0 ? (
                      <p className="mt-1 font-bold">
                        Ouverts:{' '}
                        {risk.openDupes.map((o) => o.order_number).join(', ')}
                      </p>
                    ) : null}
                  </div>
                </div>
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

              {canPickConfirmStatut(active) && !showCancel && !showReporte ? (
                <div className="rounded-2xl border border-[#e6d9cc]/80 bg-white shadow-sm overflow-hidden">
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
                            {CONFIRM_STATUSES.filter((s) => s.group === group.id).map(
                              (s) => {
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
                                      void (async () => {
                                        await patch(active.order_number, {
                                          status: s.id,
                                        });
                                        setShowStatutMenu(false);
                                        if (s.id === 'APPEL_WHATSAPP') {
                                          openCustomerWhatsApp(
                                            active.phone,
                                            buildCallCenterConfirmMessage(active),
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
                              },
                            )}
                          </div>
                        </div>
                      ))}
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

              {isConfirmQueue(active) && showCancel ? (
                <div className="space-y-3">
                  <p className="font-bold">سبب الإلغاء</p>
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
                    onClick={() => setShowCancel(false)}
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
