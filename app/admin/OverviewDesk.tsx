'use client';

/**
 * مكتب حساب رونق — COD + تحويل الموقع:
 * 1) KPIs فوق (تأكيد · رجوع · محصّل · مسلّم)
 * 2) عمل = طوابير
 * 3) حساب = فلوس COD
 * 4) تحويل = زوار · منتوج · واتساب · قمع COD
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  fetchAdminInsights,
  fetchAdminStats,
  type AdminStats,
  type InsightPeriod,
  type StoreInsights,
} from '@/lib/admin';
import { mergeTopCities } from '@/lib/cityNormalize';
import AdminDateCalendar from './AdminDateCalendar';

type View = 'work' | 'money' | 'convert';
type Desk = 'confirm' | 'ship';

const PERIODS: { id: InsightPeriod; label: string }[] = [
  { id: 'today', label: 'اليوم' },
  { id: 'yesterday', label: 'أمس' },
  { id: 'week', label: 'الأسبوع' },
  { id: 'month', label: 'الشهر' },
  { id: 'year', label: 'السنة' },
  { id: 'all', label: 'الكل' },
];

const STATUS_AR: Record<string, string> = {
  PENDING_CONFIRMATION: 'جديد',
  NO_ANSWER: 'ما جاوبش',
  APPEL_1: 'مكالمة 1',
  APPEL_2: 'مكالمة 2',
  APPEL_3: 'مكالمة 3',
  APPEL_4: 'مكالمة 4',
  APPEL_5: 'مكالمة 5',
  APPEL_6: 'مكالمة 6',
  APPEL_7: 'مكالمة 7',
  APPEL_WHATSAPP: 'واتساب',
  BOITE_VOCALE: 'علبة صوتية',
  REPORTE: 'مؤجل',
  CONFIRMED: 'مؤكد',
  READY_TO_SHIP: 'جاهز للشحن',
  SHIPPED: 'مرسل',
  DELIVERED: 'مسلّم',
  RETURNED: 'مرتجع',
  CANCELLED: 'ملغى',
  FAUX_NM: 'رقم غلط',
  DOUBLE: 'مكرر',
  INJOIGNABLE: 'ما كيتجاوبش',
};

/** أهداف COD المعتادة فالمغرب / MENA */
const TARGET = {
  confirmMin: 80,
  confirmWarn: 65,
  rtoMax: 15,
  rtoWarn: 25,
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}
function mad(v: number | null | undefined) {
  return `${Number(v || 0).toLocaleString('fr-MA', {
    maximumFractionDigits: 0,
  })} DH`;
}
function pct(v: number | null | undefined) {
  return `${Number(v || 0)}%`;
}
function num(v: number | null | undefined) {
  return Number(v || 0);
}
function fmt(v: number) {
  return v.toLocaleString('fr-MA');
}

function scoreConfirm(rate: number): 'good' | 'warn' | 'bad' {
  if (rate >= TARGET.confirmMin) return 'good';
  if (rate >= TARGET.confirmWarn) return 'warn';
  return 'bad';
}
function scoreRto(rate: number): 'good' | 'warn' | 'bad' {
  if (rate <= TARGET.rtoMax) return 'good';
  if (rate <= TARGET.rtoWarn) return 'warn';
  return 'bad';
}

type Props = {
  token: string;
  onGoDesk: (desk: Desk, pipe: string) => void;
};

export default function OverviewDesk({ token, onGoDesk }: Props) {
  const now = new Date();
  const [view, setView] = useState<View>('work');
  const [period, setPeriod] = useState<string>('today');
  const [calY, setCalY] = useState(now.getFullYear());
  const [calM, setCalM] = useState(now.getMonth() + 1);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [data, setData] = useState<StoreInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const calendarParam = `${calY}-${pad(calM)}`;
  const selectedDay = /^\d{4}-\d{2}-\d{2}$/.test(period) ? period : '';

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const [s, insights] = await Promise.all([
        fetchAdminStats(token),
        fetchAdminInsights(token, period, calendarParam),
      ]);
      setStats(s);
      setData(insights);
      setUpdatedAt(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, [token, period, calendarParam]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // تحديث تلقائي كل دقيقة — مهم ملي كيطلع الحجم
  useEffect(() => {
    if (!token) return;
    const id = window.setInterval(() => void refresh(), 60_000);
    return () => window.clearInterval(id);
  }, [token, refresh]);

  const dayCounts = useMemo(() => {
    const days = data?.calendar?.days || {};
    const map: Record<string, number> = {};
    for (const [iso, row] of Object.entries(days)) {
      map[iso] = row.orders || 0;
    }
    return map;
  }, [data?.calendar?.days]);

  const onCalendarChange = (iso: string) => {
    if (!iso) {
      setPeriod('today');
      return;
    }
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (m) {
      setCalY(Number(m[1]));
      setCalM(Number(m[2]));
      setPeriod(iso);
    }
  };

  const store = data?.store;
  const funnel = store?.funnel;
  const cr = num(store?.confirm_rate);
  const rto = num(store?.return_rate);
  const dr = num(store?.delivery_rate);

  const qConfirm = num(stats?.pending);
  const qShip = num(stats?.confirmed) + num(stats?.ready_to_ship);
  const qShipped = num(stats?.shipped);
  const qStale = num(stats?.stale_shipped);
  const qReporte = num(stats?.reporte_due ?? stats?.reporte);
  const workLoad = qConfirm + qShip + qStale + qReporte;

  const views: { id: View; label: string; sub: string }[] = [
    { id: 'work', label: 'عمل', sub: 'الطوابير' },
    { id: 'money', label: 'حساب', sub: 'فلوس COD' },
    { id: 'convert', label: 'تحويل', sub: 'موقع · واتساب' },
  ];

  return (
    <div className={`space-y-5 ${loading ? 'opacity-80' : ''}`} dir="rtl">
      {/* رأس */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold tracking-[0.22em] text-[#C4A484]">
            RAONAQ · COD DESK
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#1C1412]">مكتب القيادة</h2>
          <p className="mt-1 text-sm text-[#6a5648]">
            {workLoad > 0
              ? `${fmt(workLoad)} طلب فالطابور دابا`
              : 'الطابور هادئ'}
            {updatedAt
              ? ` · تحديث ${updatedAt.toLocaleTimeString('fr-MA', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`
              : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AdminDateCalendar
            value={selectedDay}
            onChange={onCalendarChange}
            dayCounts={dayCounts}
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => void refresh()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#e6d9cc] bg-white px-3 py-2.5 text-sm font-bold disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </button>
        </div>
      </header>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-800">
          {error}
        </p>
      ) : null}

      {/* North-star KPIs — دائماً فوق بحال eGrow */}
      <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <NorthStar
          label="طلبات داخلة"
          value={fmt(num(store?.orders ?? stats?.today))}
          hint={
            data?.period_label
              ? `${data.period_label} · اليوم ${fmt(num(stats?.today))}`
              : `اليوم ${fmt(num(stats?.today))}`
          }
          score="neutral"
          onClick={() => setView('work')}
        />
        <NorthStar
          label="نسبة التأكيد"
          value={pct(cr)}
          hint={`هدف ≥ ${TARGET.confirmMin}%`}
          score={scoreConfirm(cr)}
          onClick={() => setView('convert')}
        />
        <NorthStar
          label="نسبة الرجوع (RTO)"
          value={pct(rto)}
          hint={`هدف ≤ ${TARGET.rtoMax}%`}
          score={scoreRto(rto)}
          onClick={() => setView('convert')}
        />
        <NorthStar
          label="محصّل COD"
          value={mad(store?.earnings)}
          hint={data?.period_label || 'الفترة'}
          score="neutral"
          emphasize
          onClick={() => setView('money')}
        />
        <NorthStar
          label="مسلّم اليوم"
          value={fmt(num(stats?.today_delivered))}
          hint="تسليمات اليوم"
          score="neutral"
          onClick={() => onGoDesk('ship', 'delivered')}
        />
      </section>

      {/* تبويبات */}
      <nav className="flex gap-1 rounded-2xl bg-[#ebe3d8] p-1">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            className={`flex-1 rounded-xl px-2 py-2.5 text-center transition ${
              view === v.id
                ? 'bg-[#1C1412] text-white'
                : 'text-[#5c4a3c] hover:bg-white/70'
            }`}
          >
            <p className="text-sm font-bold">{v.label}</p>
            <p
              className={`text-[10px] ${
                view === v.id ? 'text-white/60' : 'text-[#8a7464]'
              }`}
            >
              {v.sub}
            </p>
          </button>
        ))}
      </nav>

      {view === 'work' ? (
        <WorkBoard
          qConfirm={qConfirm}
          qShip={qShip}
          qShipped={qShipped}
          qStale={qStale}
          qReporte={qReporte}
          today={num(stats?.today)}
          todayDelivered={num(stats?.today_delivered)}
          todayReturned={num(stats?.today_returned)}
          todayCancelled={num(stats?.today_cancelled)}
          sheetErrors={num(stats?.sheet_errors)}
          deliveryRate={dr}
          onGoDesk={onGoDesk}
        />
      ) : null}

      {view === 'money' ? (
        <MoneyBoard
          period={period}
          setPeriod={setPeriod}
          store={store}
          earnings={data?.earnings}
          periodLabel={data?.period_label}
        />
      ) : null}

      {view === 'convert' ? (
        <ConvertBoard
          period={period}
          setPeriod={setPeriod}
          store={store}
          funnel={funnel}
          onGoDesk={onGoDesk}
        />
      ) : null}
    </div>
  );
}

function NorthStar({
  label,
  value,
  hint,
  score,
  emphasize,
  onClick,
}: {
  label: string;
  value: string;
  hint: string;
  score: 'good' | 'warn' | 'bad' | 'neutral';
  emphasize?: boolean;
  onClick?: () => void;
}) {
  const ring =
    score === 'good'
      ? 'border-teal-300 bg-teal-50'
      : score === 'warn'
        ? 'border-amber-300 bg-amber-50'
        : score === 'bad'
          ? 'border-[#C45B6A]/40 bg-[#FBEFF1]'
          : emphasize
            ? 'border-[#1C1412] bg-[#1C1412] text-white'
            : 'border-[#e6d9cc] bg-white';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-3.5 text-right transition hover:brightness-[0.98] ${ring}`}
    >
      <p
        className={`text-[10px] font-bold ${
          emphasize ? 'text-white/65' : 'text-[#6a5648]'
        }`}
      >
        {label}
      </p>
      <p className="mt-1 text-xl font-bold tabular-nums sm:text-2xl">{value}</p>
      <p
        className={`mt-1 text-[10px] leading-snug ${
          emphasize ? 'text-white/50' : 'text-[#8a7464]'
        }`}
      >
        {hint}
      </p>
    </button>
  );
}

function QueueCard({
  title,
  count,
  hint,
  cta,
  tone,
  onClick,
}: {
  title: string;
  count: number;
  hint: string;
  cta: string;
  tone: 'idle' | 'hot' | 'ship' | 'risk';
  onClick: () => void;
}) {
  const bg =
    tone === 'hot'
      ? 'border-amber-400 bg-amber-50'
      : tone === 'ship'
        ? 'border-sky-300 bg-sky-50'
        : tone === 'risk'
          ? 'border-[#C45B6A]/45 bg-[#FBEFF1]'
          : 'border-[#e6d9cc] bg-white';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full flex-col rounded-2xl border p-4 text-right transition hover:brightness-[0.98] ${bg}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#1C1412]">{title}</p>
          <p className="mt-1 text-[11px] leading-snug text-[#6a5648]">{hint}</p>
        </div>
        <p className="shrink-0 text-3xl font-bold tabular-nums text-[#1C1412]">
          {fmt(count)}
        </p>
      </div>
      <p className="mt-auto pt-3 text-[12px] font-bold text-[#C45B6A]">
        {cta} ←
      </p>
    </button>
  );
}

function WorkBoard({
  qConfirm,
  qShip,
  qShipped,
  qStale,
  qReporte,
  today,
  todayDelivered,
  todayReturned,
  todayCancelled,
  sheetErrors,
  deliveryRate,
  onGoDesk,
}: {
  qConfirm: number;
  qShip: number;
  qShipped: number;
  qStale: number;
  qReporte: number;
  today: number;
  todayDelivered: number;
  todayReturned: number;
  todayCancelled: number;
  sheetErrors: number;
  deliveryRate: number;
  onGoDesk: (desk: Desk, pipe: string) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-[12px] text-[#6a5648]">
        منطق COD: أكّد ← صيفط ← تابع ← حصّل. ابدأ من الكروت السخونة.
      </p>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-[#8a7464]">① تأكيد</p>
          <QueueCard
            title="كاتسنى الاتصال"
            count={qConfirm}
            hint="جديد · مكالمات · ما جاوبش"
            cta="طابور التأكيد"
            tone={qConfirm > 0 ? 'hot' : 'idle'}
            onClick={() => onGoDesk('confirm', 'call_today')}
          />
          <QueueCard
            title="مؤجل حان وقته"
            count={qReporte}
            hint="رجع اليوم للمكالمة"
            cta="شوف المؤجل"
            tone={qReporte > 0 ? 'hot' : 'idle'}
            onClick={() => onGoDesk('confirm', 'call_today')}
          />
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-bold text-[#8a7464]">② شحن</p>
          <QueueCard
            title="جاهز لـ Ozone"
            count={qShip}
            hint="مؤكد / READY — خاص الإرسال"
            cta="افتح الجاهزين"
            tone={qShip > 0 ? 'ship' : 'idle'}
            onClick={() => onGoDesk('ship', 'confirmed')}
          />
          <QueueCard
            title="عند الشركة"
            count={qShipped}
            hint="مرسل — زامن الحالات"
            cta="افتح المرسلين"
            tone="ship"
            onClick={() => onGoDesk('ship', 'shipped')}
          />
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-bold text-[#8a7464]">③ مخاطر</p>
          <QueueCard
            title="متأخر فالتتبع"
            count={qStale}
            hint="مرسل بزاف بلا تحديث"
            cta="افتح المتأخر"
            tone={qStale > 0 ? 'risk' : 'idle'}
            onClick={() => onGoDesk('ship', 'stale')}
          />
          <QueueCard
            title="مرتجع اليوم"
            count={todayReturned}
            hint="شوف المرتجعين — قلّل RTO"
            cta="افتح المرتجع"
            tone={todayReturned > 0 ? 'risk' : 'idle'}
            onClick={() => onGoDesk('ship', 'returned')}
          />
        </div>
      </div>

      <section className="rounded-2xl border border-[#e6d9cc] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-[#1C1412]">نبض اليوم</p>
            <p className="text-[11px] text-[#6a5648]">
              نسبة التسليم فالفترة: {pct(deliveryRate)}
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Pulse label="دخلات" value={today} />
          <Pulse
            label="مسلّم"
            value={todayDelivered}
            onClick={() => onGoDesk('ship', 'delivered')}
          />
          <Pulse
            label="مرتجع"
            value={todayReturned}
            onClick={() => onGoDesk('ship', 'returned')}
          />
          <Pulse
            label="ملغى"
            value={todayCancelled}
            onClick={() => onGoDesk('confirm', 'cancelled')}
          />
        </div>
        {sheetErrors > 0 ? (
          <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-950">
            ⚠ {sheetErrors} خطأ Sheet — راجع المزامنة
          </p>
        ) : null}
      </section>
    </div>
  );
}

function Pulse({
  label,
  value,
  onClick,
}: {
  label: string;
  value: number;
  onClick?: () => void;
}) {
  const body = (
    <>
      <p className="text-[10px] font-bold text-[#6a5648]">{label}</p>
      <p className="mt-0.5 text-lg font-bold tabular-nums">{fmt(value)}</p>
    </>
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="rounded-xl border border-[#eee4d8] bg-[#F7F1EC] px-3 py-2.5 text-right hover:border-[#C4A484]"
      >
        {body}
      </button>
    );
  }
  return (
    <div className="rounded-xl border border-[#eee4d8] bg-[#F7F1EC] px-3 py-2.5 text-right">
      {body}
    </div>
  );
}

function PeriodPills({
  period,
  setPeriod,
}: {
  period: string;
  setPeriod: (p: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {PERIODS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => setPeriod(p.id)}
          className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-bold ${
            period === p.id
              ? 'border-[#1C1412] bg-[#1C1412] text-white'
              : 'border-[#e6d9cc] bg-white text-[#5c4a3c]'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function MoneyBoard({
  period,
  setPeriod,
  store,
  earnings,
  periodLabel,
}: {
  period: string;
  setPeriod: (p: string) => void;
  store: StoreInsights['store'] | undefined;
  earnings: StoreInsights['earnings'] | undefined;
  periodLabel?: string;
}) {
  const collected = num(store?.earnings);
  const frozen = num(store?.frozen);
  const returned = num(store?.returned_value);
  const pipeline = collected + frozen;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-[#1C1412]">تحصيل COD</h3>
          <p className="text-[12px] text-[#6a5648]">
            {periodLabel || 'الفترة'} · ماشي ربح صافي (بلا تكلفة بضاعة / Ozon)
          </p>
        </div>
        <PeriodPills period={period} setPeriod={setPeriod} />
      </div>

      {/* مسار الفلوس */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#1C1412] bg-[#1C1412] p-5 text-white">
          <p className="text-[11px] font-bold text-white/60">① محصّل</p>
          <p className="mt-2 text-3xl font-bold tabular-nums">{mad(collected)}</p>
          <p className="mt-2 text-[11px] text-white/50">
            {fmt(num(store?.delivered))} مسلّم · الفلوس اللي وصلت
          </p>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-[11px] font-bold text-[#6a5648]">② فريزو</p>
          <p className="mt-2 text-3xl font-bold tabular-nums">{mad(frozen)}</p>
          <p className="mt-2 text-[11px] text-[#6a5648]">
            {fmt(num(store?.frozen_count))} طرد فالتوصيل · غادي يتحصّل ولا يرجع
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-[11px] font-bold text-[#6a5648]">③ مرتجع</p>
          <p className="mt-2 text-3xl font-bold tabular-nums">{mad(returned)}</p>
          <p className="mt-2 text-[11px] text-[#6a5648]">قيمة اللي رجعات · خسارة محتملة</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4">
        <p className="text-xs font-bold text-[#6a5648]">مجموع فالدورة (محصّل + فريزو)</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-[#1C1412]">
          {mad(pipeline)}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <MiniMoney label="متوسط الطلب" value={mad(store?.avg_order_value)} />
          <MiniMoney label="قيمة الملغى" value={mad(store?.cancelled_value)} />
          <MiniMoney
            label="طلبات محتسبة"
            value={fmt(num(store?.orders))}
          />
          <MiniMoney label="مبيعات محتسبة" value={mad(store?.sales)} />
        </div>
      </div>

      {earnings ? (
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#6a5648]">مقارنة الفترات</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {PERIODS.map((p) => {
              const row = earnings[p.id];
              const on = period === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPeriod(p.id)}
                  className={`rounded-xl border px-3 py-3 text-right ${
                    on
                      ? 'border-[#1C1412] bg-[#1C1412] text-white'
                      : 'border-[#e6d9cc] bg-white'
                  }`}
                >
                  <p
                    className={`text-[10px] font-bold ${
                      on ? 'text-white/60' : 'text-[#6a5648]'
                    }`}
                  >
                    {p.label}
                  </p>
                  <p className="mt-1 text-sm font-bold tabular-nums">
                    {mad(row?.earnings)}
                  </p>
                  <p
                    className={`mt-0.5 text-[10px] ${
                      on ? 'text-white/45' : 'text-[#8a7464]'
                    }`}
                  >
                    {fmt(num(row?.delivered))} مسلّم
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MiniMoney({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#F7F1EC] px-3 py-2.5">
      <p className="text-[10px] font-bold text-[#6a5648]">{label}</p>
      <p className="mt-0.5 text-sm font-bold tabular-nums text-[#1C1412]">
        {value}
      </p>
    </div>
  );
}

function ConvertBoard({
  period,
  setPeriod,
  store,
  funnel,
  onGoDesk,
}: {
  period: string;
  setPeriod: (p: string) => void;
  store: StoreInsights['store'] | undefined;
  funnel: StoreInsights['store']['funnel'] | undefined;
  onGoDesk: (desk: Desk, pipe: string) => void;
}) {
  const site = store?.checkout_funnel;
  const traffic = store?.traffic;
  const siteSteps = site?.steps || [];
  const siteBase = Math.max(
    1,
    num(traffic?.visitors) || num(siteSteps[0]?.count) || 1,
  );
  const rates = site?.rates || traffic?.rates;
  const entered = Math.max(1, num(funnel?.entered));
  const codSteps: {
    label: string;
    count: number;
    color: string;
    desk?: Desk;
    pipe?: string;
  }[] = [
    { label: 'داخلة', count: num(funnel?.entered), color: 'bg-[#C4A484]' },
    {
      label: 'قيد التأكيد',
      count: num(funnel?.pending),
      color: 'bg-amber-400',
      desk: 'confirm',
      pipe: 'call_today',
    },
    {
      label: 'مؤكد',
      count: num(funnel?.confirmed),
      color: 'bg-teal-500',
      desk: 'ship',
      pipe: 'confirmed',
    },
    {
      label: 'مرسل',
      count: num(funnel?.shipped),
      color: 'bg-sky-500',
      desk: 'ship',
      pipe: 'shipped',
    },
    {
      label: 'مسلّم',
      count: num(funnel?.delivered),
      color: 'bg-emerald-500',
      desk: 'ship',
      pipe: 'delivered',
    },
    {
      label: 'مرتجع',
      count: num(funnel?.returned),
      color: 'bg-orange-400',
      desk: 'ship',
      pipe: 'returned',
    },
    {
      label: 'ملغى',
      count: num(funnel?.cancelled),
      color: 'bg-[#C45B6A]',
      desk: 'confirm',
      pipe: 'cancelled',
    },
  ];

  const siteColors: Record<string, string> = {
    visitors: 'bg-[#C4A484]',
    view_product: 'bg-violet-400',
    add_to_cart: 'bg-amber-400',
    begin_checkout: 'bg-sky-500',
    orders: 'bg-teal-500',
    whatsapp: 'bg-emerald-500',
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-[#1C1412]">تحويل الموقع</h3>
          <p className="text-[12px] text-[#6a5648]">
            زوار → منتوج → سلة → كموند · وكليك واتساب
          </p>
        </div>
        <PeriodPills period={period} setPeriod={setPeriod} />
      </div>

      {!traffic?.has_data && !site?.has_data ? (
        <p className="rounded-xl border border-[#e6d9cc] bg-[#F7F1EC] px-3 py-2 text-sm text-[#5c4a3c]">
          {traffic?.message ||
            'مازال ما تجمعاتش بيانات التتبع — من بعد الـ deploy، الزيارات وكليك واتساب غادي يبانو هنا.'}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <RateCard
          label="زائر → كموند"
          value={pct(rates?.visitor_to_order)}
          score="neutral"
          target="تحويل الموقع"
        />
        <RateCard
          label="منتوج → سلة"
          value={pct(rates?.product_to_cart)}
          score="neutral"
          target="من PDP"
        />
        <RateCard
          label="Checkout → كموند"
          value={pct(rates?.checkout_to_order)}
          score="neutral"
          target="اكتمال الطلب"
        />
        <RateCard
          label="زائر → واتساب"
          value={pct(rates?.visitor_to_whatsapp)}
          score="neutral"
          target={`${fmt(num(traffic?.whatsapp_clicks))} كليك`}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Pulse label="زوار" value={num(traffic?.visitors)} />
        <Pulse label="مشاهدات" value={num(traffic?.page_views)} />
        <Pulse label="صفحات منتوج" value={num(traffic?.view_product)} />
        <Pulse label="واتساب" value={num(traffic?.whatsapp_clicks)} />
      </div>

      {siteSteps.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#6a5648]">قمع الموقع</p>
          {siteSteps.map((s) => {
            const w = Math.max(3, Math.round((s.count / siteBase) * 100));
            return (
              <div
                key={s.id}
                className="rounded-xl border border-[#e6d9cc] bg-white px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-bold text-[#1C1412]">{s.label}</span>
                  <span className="tabular-nums font-bold">
                    {fmt(s.count)}
                    <span className="ms-1 text-[11px] font-medium text-[#8a7464]">
                      {Math.round((s.count / siteBase) * 100)}%
                    </span>
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f0e6dc]">
                  <div
                    className={`h-full rounded-full ${siteColors[s.id] || 'bg-[#C4A484]'}`}
                    style={{ width: `${w}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-2">
        <ListCard
          title="أكثر الصفحات زيارة"
          empty="ما كاينش بعد"
          rows={(store?.top_pages?.items || []).slice(0, 8).map((p, i) => ({
            key: p.path,
            left: `${i + 1}. ${p.path}`,
            right: String(p.views),
          }))}
        />
        <ListCard
          title="واتساب حسب المصدر"
          empty="ما كاينش كليكات بعد"
          rows={(site?.whatsapp_by_source || []).slice(0, 8).map((w, i) => ({
            key: w.source,
            left: `${i + 1}. ${w.source}`,
            right: String(w.count),
          }))}
        />
      </div>

      <div className="border-t border-[#e6d9cc] pt-5">
        <div className="mb-3">
          <h3 className="text-base font-bold text-[#1C1412]">قمع COD</h3>
          <p className="text-[12px] text-[#6a5648]">
            بعد الكموند — فين كتضيع الطلبات
          </p>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
          <RateCard
            label="تأكيد"
            value={pct(store?.confirm_rate)}
            score={scoreConfirm(num(store?.confirm_rate))}
            target={`≥ ${TARGET.confirmMin}%`}
          />
          <RateCard
            label="تسليم"
            value={pct(store?.delivery_rate)}
            score={
              num(store?.delivery_rate) >= 75
                ? 'good'
                : num(store?.delivery_rate) >= 55
                  ? 'warn'
                  : 'bad'
            }
            target="≥ 75%"
          />
          <RateCard
            label="رجوع RTO"
            value={pct(store?.return_rate)}
            score={scoreRto(num(store?.return_rate))}
            target={`≤ ${TARGET.rtoMax}%`}
          />
          <RateCard
            label="تحويل COD"
            value={pct(store?.conversion_rate)}
            score="neutral"
            target="مسلّم ÷ داخلة"
          />
        </div>

        <div className="space-y-2">
          {codSteps.map((s) => {
            const w = Math.max(3, Math.round((s.count / entered) * 100));
            const row = (
              <>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-bold text-[#1C1412]">{s.label}</span>
                  <span className="tabular-nums font-bold">
                    {fmt(s.count)}
                    <span className="ms-1 text-[11px] font-medium text-[#8a7464]">
                      {Math.round((s.count / entered) * 100)}%
                    </span>
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f0e6dc]">
                  <div
                    className={`h-full rounded-full ${s.color}`}
                    style={{ width: `${w}%` }}
                  />
                </div>
              </>
            );
            if (s.desk && s.pipe) {
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => onGoDesk(s.desk!, s.pipe!)}
                  className="w-full rounded-xl border border-[#e6d9cc] bg-white px-4 py-3 text-right hover:border-[#C4A484]"
                >
                  {row}
                </button>
              );
            }
            return (
              <div
                key={s.label}
                className="rounded-xl border border-[#e6d9cc] bg-white px-4 py-3"
              >
                {row}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <ListCard
          title="أفضل المنتجات (مبيعات)"
          empty="ما كاينش بيانات"
          rows={(store?.top_products || []).slice(0, 8).map((p, i) => ({
            key: p.name,
            left: `${i + 1}. ${p.name}`,
            right: `×${p.quantity} · ${mad(p.revenue)}`,
          }))}
        />
        <ListCard
          title="أفضل المدن"
          empty="ما كاينش بيانات"
          rows={mergeTopCities(store?.top_cities, 8).map((c, i) => ({
            key: c.city,
            left: `${i + 1}. ${c.city}`,
            right: String(c.count),
          }))}
        />
      </div>

      {store?.by_status && Object.keys(store.by_status).length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#6a5648]">تفصيل الحالات</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(store.by_status)
              .sort((a, b) => b[1] - a[1])
              .map(([status, count]) => (
                <span
                  key={status}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e6d9cc] bg-white px-2.5 py-1 text-[11px] font-bold"
                >
                  {STATUS_AR[status] || status}
                  <span className="tabular-nums text-[#6a5648]">{count}</span>
                </span>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RateCard({
  label,
  value,
  target,
  score,
}: {
  label: string;
  value: string;
  target: string;
  score: 'good' | 'warn' | 'bad' | 'neutral';
}) {
  const bg =
    score === 'good'
      ? 'border-teal-200 bg-teal-50'
      : score === 'warn'
        ? 'border-amber-200 bg-amber-50'
        : score === 'bad'
          ? 'border-[#C45B6A]/35 bg-[#FBEFF1]'
          : 'border-[#e6d9cc] bg-white';
  return (
    <div className={`rounded-xl border px-3 py-3 ${bg}`}>
      <p className="text-[10px] font-bold text-[#6a5648]">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      <p className="mt-0.5 text-[10px] text-[#8a7464]">{target}</p>
    </div>
  );
}

function ListCard({
  title,
  empty,
  rows,
}: {
  title: string;
  empty: string;
  rows: { key: string; left: string; right: string }[];
}) {
  return (
    <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4 space-y-2">
      <p className="text-xs font-bold text-[#6a5648]">{title}</p>
      {rows.length ? (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li
              key={r.key}
              className="flex justify-between gap-3 border-b border-[#f0e6dc] pb-2 text-sm last:border-0"
            >
              <span className="truncate font-medium text-[#1C1412]">{r.left}</span>
              <span className="shrink-0 tabular-nums text-[#6a5648]">
                {r.right}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#6a5648]">{empty}</p>
      )}
    </div>
  );
}
