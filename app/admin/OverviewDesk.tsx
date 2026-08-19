'use client';

/**
 * حساب رونق — لوحة COD للأحجام الكبيرة
 * عمل الآن = شنو خاصو خدمة
 * الحساب = الفلوس
 * التحليل = القمع والنسب
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
import AdminDateCalendar from './AdminDateCalendar';

type View = 'work' | 'money' | 'analyze';
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

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function mad(n: number | null | undefined) {
  return `${Number(n || 0).toLocaleString('fr-MA', {
    maximumFractionDigits: 0,
  })} DH`;
}

function pct(n: number | null | undefined) {
  return `${Number(n || 0)}%`;
}

function n(v: number | null | undefined) {
  return Number(v || 0);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, [token, period, calendarParam]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

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
  const entered = Math.max(1, n(funnel?.entered));

  const confirmQueue = n(stats?.pending);
  const shipReady = n(stats?.confirmed) + n(stats?.ready_to_ship);
  const shipped = n(stats?.shipped);
  const stale = n(stats?.stale_shipped);
  const reporteDue = n(stats?.reporte_due ?? stats?.reporte);
  const workTotal = confirmQueue + shipReady + stale + reporteDue;

  const views: { id: View; label: string; hint: string }[] = [
    { id: 'work', label: 'عمل الآن', hint: 'شنو خاصو خدمة' },
    { id: 'money', label: 'الحساب', hint: 'فلوس COD' },
    { id: 'analyze', label: 'التحليل', hint: 'قمع · نسب' },
  ];

  return (
    <div className={`space-y-6 ${loading ? 'opacity-75' : ''}`} dir="rtl">
      {/* رأس ثابت الفهم */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#C4A484]">
            RAONAQ · OPERATIONS
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#1C1412]">مكتب الحساب</h2>
          <p className="mt-1 text-sm text-[#6a5648]">
            {workTotal > 0
              ? `${workTotal.toLocaleString('fr-MA')} طلب يستاهل خدمة دابا`
              : 'ما كاينش ضغط فالطابور دابا'}
            {data?.period_label ? ` · تحليل: ${data.period_label}` : ''}
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
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#e6d9cc] bg-white text-sm font-bold disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-sm font-bold text-red-800 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      ) : null}

      {/* تبصير سريع دائم */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <Mini
          label="طابور العمل"
          value={String(workTotal)}
          tone={workTotal > 0 ? 'warn' : 'ok'}
          onClick={() => setView('work')}
        />
        <Mini
          label="محصّل (الفترة)"
          value={mad(store?.earnings)}
          tone="dark"
          onClick={() => setView('money')}
        />
        <Mini
          label="تأكيد %"
          value={pct(store?.confirm_rate)}
          onClick={() => setView('analyze')}
        />
        <Mini
          label="رجوع %"
          value={pct(store?.return_rate)}
          tone={n(store?.return_rate) >= 20 ? 'warn' : 'ok'}
          onClick={() => setView('analyze')}
        />
      </div>

      {/* تبويبات داخلية */}
      <div className="flex gap-1 p-1 rounded-2xl bg-[#eee4d8]">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v.id)}
            className={`flex-1 rounded-xl px-3 py-3 text-center transition ${
              view === v.id
                ? 'bg-[#1C1412] text-white shadow-sm'
                : 'text-[#5c4a3c] hover:bg-white/60'
            }`}
          >
            <p className="text-sm font-bold">{v.label}</p>
            <p
              className={`text-[10px] mt-0.5 ${
                view === v.id ? 'text-white/65' : 'text-[#8a7464]'
              }`}
            >
              {v.hint}
            </p>
          </button>
        ))}
      </div>

      {view === 'work' ? (
        <WorkView
          confirmQueue={confirmQueue}
          shipReady={shipReady}
          shipped={shipped}
          stale={stale}
          reporteDue={reporteDue}
          today={n(stats?.today)}
          todayDelivered={n(stats?.today_delivered)}
          todayReturned={n(stats?.today_returned)}
          todayCancelled={n(stats?.today_cancelled)}
          sheetErrors={n(stats?.sheet_errors)}
          onGoDesk={onGoDesk}
        />
      ) : null}

      {view === 'money' ? (
        <MoneyView
          period={period}
          setPeriod={setPeriod}
          store={store}
          earnings={data?.earnings}
          periodLabel={data?.period_label}
        />
      ) : null}

      {view === 'analyze' ? (
        <AnalyzeView
          period={period}
          setPeriod={setPeriod}
          store={store}
          funnel={funnel}
          entered={entered}
          onGoDesk={onGoDesk}
        />
      ) : null}
    </div>
  );
}

function Mini({
  label,
  value,
  tone = 'default',
  onClick,
}: {
  label: string;
  value: string;
  tone?: 'default' | 'dark' | 'warn' | 'ok';
  onClick?: () => void;
}) {
  const cls =
    tone === 'dark'
      ? 'border-[#1C1412] bg-[#1C1412] text-white'
      : tone === 'warn'
        ? 'border-amber-300 bg-amber-50 text-[#1C1412]'
        : tone === 'ok'
          ? 'border-teal-200 bg-teal-50 text-[#1C1412]'
          : 'border-[#e6d9cc] bg-white text-[#1C1412]';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-3 text-right ${cls}`}
    >
      <p
        className={`text-[10px] font-bold ${
          tone === 'dark' ? 'text-white/65' : 'text-[#6a5648]'
        }`}
      >
        {label}
      </p>
      <p className="mt-1 text-lg font-bold tabular-nums">{value}</p>
    </button>
  );
}

function ActionCard({
  title,
  count,
  hint,
  cta,
  tone = 'default',
  onClick,
}: {
  title: string;
  count: number;
  hint: string;
  cta: string;
  tone?: 'default' | 'urgent' | 'ship' | 'ok';
  onClick: () => void;
}) {
  const wrap =
    tone === 'urgent'
      ? 'border-amber-400 bg-amber-50'
      : tone === 'ship'
        ? 'border-sky-300 bg-sky-50'
        : tone === 'ok'
          ? 'border-teal-300 bg-teal-50'
          : 'border-[#e6d9cc] bg-white';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-right transition hover:brightness-[0.98] ${wrap}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#1C1412]">{title}</p>
          <p className="mt-1 text-[12px] text-[#6a5648] leading-snug">{hint}</p>
        </div>
        <p className="text-3xl font-bold tabular-nums text-[#1C1412] shrink-0">
          {count.toLocaleString('fr-MA')}
        </p>
      </div>
      <p className="mt-3 text-[12px] font-bold text-[#C45B6A]">{cta} ←</p>
    </button>
  );
}

function WorkView({
  confirmQueue,
  shipReady,
  shipped,
  stale,
  reporteDue,
  today,
  todayDelivered,
  todayReturned,
  todayCancelled,
  sheetErrors,
  onGoDesk,
}: {
  confirmQueue: number;
  shipReady: number;
  shipped: number;
  stale: number;
  reporteDue: number;
  today: number;
  todayDelivered: number;
  todayReturned: number;
  todayCancelled: number;
  sheetErrors: number;
  onGoDesk: (desk: Desk, pipe: string) => void;
}) {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-[#1C1412]">أولوية الخدمة</h3>
          <p className="text-[12px] text-[#6a5648]">
            ابدأ من فوق لتحت — كل كارت كيفتح الطابور مباشرة
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ActionCard
            title="تأكيد · خاصو اتصال"
            count={confirmQueue}
            hint="جديد + مكالمات + ما جاوبش"
            cta="فتح طابور التأكيد"
            tone={confirmQueue > 0 ? 'urgent' : 'default'}
            onClick={() => onGoDesk('confirm', 'call_today')}
          />
          <ActionCard
            title="شحن · جاهز للإرسال"
            count={shipReady}
            hint="مؤكد / READY — صيفط لـ Ozone"
            cta="فتح جاهز للشحن"
            tone={shipReady > 0 ? 'ship' : 'default'}
            onClick={() => onGoDesk('ship', 'confirmed')}
          />
          <ActionCard
            title="متابعة · مرسل"
            count={shipped}
            hint="عند شركة التوصيل — زامن Ozone"
            cta="فتح المرسلين"
            tone="ship"
            onClick={() => onGoDesk('ship', 'shipped')}
          />
          <ActionCard
            title="انتباه · متأخر / مؤجل"
            count={stale + reporteDue}
            hint={`${stale} متأخر شحن · ${reporteDue} مؤجل حان`}
            cta="شوف المتأخرين"
            tone={stale + reporteDue > 0 ? 'urgent' : 'ok'}
            onClick={() =>
              onGoDesk('ship', stale > 0 ? 'stale' : 'shipped')
            }
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-bold text-[#1C1412]">نتائج اليوم</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <StatChip label="طلبات دخلات" value={today} />
          <StatChip
            label="مسلّم"
            value={todayDelivered}
            onClick={() => onGoDesk('ship', 'delivered')}
          />
          <StatChip
            label="مرتجع"
            value={todayReturned}
            onClick={() => onGoDesk('ship', 'returned')}
          />
          <StatChip
            label="ملغى"
            value={todayCancelled}
            onClick={() => onGoDesk('confirm', 'cancelled')}
          />
        </div>
        {sheetErrors > 0 ? (
          <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-950">
            ⚠ {sheetErrors} خطأ مزامنة Sheet — راجع الطلبات
          </p>
        ) : null}
      </section>
    </div>
  );
}

function StatChip({
  label,
  value,
  onClick,
}: {
  label: string;
  value: number;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <p className="text-[10px] font-bold text-[#6a5648]">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums">
        {value.toLocaleString('fr-MA')}
      </p>
    </>
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="rounded-xl border border-[#e6d9cc] bg-white px-3 py-3 text-right hover:border-[#C4A484]"
      >
        {inner}
      </button>
    );
  }
  return (
    <div className="rounded-xl border border-[#e6d9cc] bg-white px-3 py-3 text-right">
      {inner}
    </div>
  );
}

function PeriodBar({
  period,
  setPeriod,
}: {
  period: string;
  setPeriod: (p: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PERIODS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => setPeriod(p.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
            period === p.id
              ? 'bg-[#1C1412] text-white border-[#1C1412]'
              : 'bg-white border-[#e6d9cc] text-[#5c4a3c]'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function MoneyView({
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
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-[#1C1412]">فلوس COD</h3>
          <p className="text-[12px] text-[#6a5648]">
            {periodLabel || 'الفترة'} · محصّل ≠ ربح صافي
          </p>
        </div>
        <PeriodBar period={period} setPeriod={setPeriod} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[#1C1412] bg-[#1C1412] text-white p-5">
          <p className="text-[11px] font-bold text-white/65">محصّل</p>
          <p className="mt-2 text-3xl font-bold tabular-nums">
            {mad(store?.earnings)}
          </p>
          <p className="mt-2 text-[12px] text-white/55">
            {n(store?.delivered)} مسلّم · الفلوس اللي جات
          </p>
        </div>
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <p className="text-[11px] font-bold text-[#6a5648]">فريزو فالتوصيل</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-[#1C1412]">
            {mad(store?.frozen)}
          </p>
          <p className="mt-2 text-[12px] text-[#6a5648]">
            {n(store?.frozen_count)} طرد مرسل · باقي معلّق
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-[11px] font-bold text-[#6a5648]">مرتجع (قيمة)</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-[#1C1412]">
            {mad(store?.returned_value)}
          </p>
          <p className="mt-2 text-[12px] text-[#6a5648]">خسائر رجوع فالفترة</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="rounded-xl border border-[#e6d9cc] bg-white px-3 py-3 text-right">
          <p className="text-[10px] font-bold text-[#6a5648]">متوسط الطلب</p>
          <p className="mt-1 text-xl font-bold tabular-nums">
            {mad(store?.avg_order_value)}
          </p>
        </div>
        <div className="rounded-xl border border-[#e6d9cc] bg-white px-3 py-3 text-right">
          <p className="text-[10px] font-bold text-[#6a5648]">قيمة الملغى</p>
          <p className="mt-1 text-xl font-bold tabular-nums">
            {mad(store?.cancelled_value)}
          </p>
        </div>
        <div className="rounded-xl border border-[#e6d9cc] bg-white px-3 py-3 text-right">
          <p className="text-[10px] font-bold text-[#6a5648]">طلبات (بلا ملغى)</p>
          <p className="mt-1 text-xl font-bold tabular-nums">
            {n(store?.orders).toLocaleString('fr-MA')}
          </p>
        </div>
        <div className="rounded-xl border border-[#e6d9cc] bg-white px-3 py-3 text-right">
          <p className="text-[10px] font-bold text-[#6a5648]">مبيعات محتسبة</p>
          <p className="mt-1 text-xl font-bold tabular-nums">
            {mad(store?.sales)}
          </p>
        </div>
      </div>

      {earnings ? (
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#6a5648]">لمحة سريعة لكل فترة</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
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
                      on ? 'text-white/65' : 'text-[#6a5648]'
                    }`}
                  >
                    {p.label}
                  </p>
                  <p className="mt-1 text-sm font-bold tabular-nums">
                    {mad(row?.earnings)}
                  </p>
                  <p
                    className={`mt-0.5 text-[10px] tabular-nums ${
                      on ? 'text-white/50' : 'text-[#8a7464]'
                    }`}
                  >
                    {n(row?.delivered)} مسلّم
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

function FunnelBar({
  label,
  count,
  total,
  tone,
  onClick,
}: {
  label: string;
  count: number;
  total: number;
  tone: string;
  onClick?: () => void;
}) {
  const width = Math.max(4, Math.round((count / Math.max(total, 1)) * 100));
  const body = (
    <>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-bold text-[#1C1412]">{label}</span>
        <span className="tabular-nums font-bold text-[#1C1412]">
          {count.toLocaleString('fr-MA')}
          <span className="ms-1 text-[11px] font-medium text-[#8a7464]">
            {Math.round((count / Math.max(total, 1)) * 100)}%
          </span>
        </span>
      </div>
      <div className="mt-2 h-2.5 rounded-full bg-[#f0e6dc] overflow-hidden">
        <div
          className={`h-full rounded-full ${tone}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </>
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full rounded-xl border border-[#e6d9cc] bg-white px-4 py-3 text-right hover:border-[#C4A484]"
      >
        {body}
      </button>
    );
  }
  return (
    <div className="rounded-xl border border-[#e6d9cc] bg-white px-4 py-3">
      {body}
    </div>
  );
}

function AnalyzeView({
  period,
  setPeriod,
  store,
  funnel,
  entered,
  onGoDesk,
}: {
  period: string;
  setPeriod: (p: string) => void;
  store: StoreInsights['store'] | undefined;
  funnel: StoreInsights['store']['funnel'] | undefined;
  entered: number;
  onGoDesk: (desk: Desk, pipe: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-[#1C1412]">تحليل الأداء</h3>
          <p className="text-[12px] text-[#6a5648]">
            القمع والنسب — باش تعرف فين كتضيع الطلبات
          </p>
        </div>
        <PeriodBar period={period} setPeriod={setPeriod} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <div className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-3">
          <p className="text-[10px] font-bold text-[#6a5648]">نسبة التأكيد</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {pct(store?.confirm_rate)}
          </p>
        </div>
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-3">
          <p className="text-[10px] font-bold text-[#6a5648]">نسبة التسليم</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {pct(store?.delivery_rate)}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3">
          <p className="text-[10px] font-bold text-[#6a5648]">نسبة الرجوع</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {pct(store?.return_rate)}
          </p>
        </div>
        <div className="rounded-xl border border-[#e6d9cc] bg-white px-3 py-3">
          <p className="text-[10px] font-bold text-[#6a5648]">تحويل COD</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {pct(store?.conversion_rate)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-[#6a5648]">
          مسار الطلبات ({entered.toLocaleString('fr-MA')} داخلة)
        </p>
        <div className="space-y-2">
          <FunnelBar
            label="داخلة"
            count={n(funnel?.entered)}
            total={entered}
            tone="bg-[#C4A484]"
          />
          <FunnelBar
            label="قيد التأكيد"
            count={n(funnel?.pending)}
            total={entered}
            tone="bg-amber-400"
            onClick={() => onGoDesk('confirm', 'call_today')}
          />
          <FunnelBar
            label="مؤكد / جاهز"
            count={n(funnel?.confirmed)}
            total={entered}
            tone="bg-teal-500"
            onClick={() => onGoDesk('ship', 'confirmed')}
          />
          <FunnelBar
            label="مرسل"
            count={n(funnel?.shipped)}
            total={entered}
            tone="bg-sky-500"
            onClick={() => onGoDesk('ship', 'shipped')}
          />
          <FunnelBar
            label="مسلّم"
            count={n(funnel?.delivered)}
            total={entered}
            tone="bg-emerald-500"
            onClick={() => onGoDesk('ship', 'delivered')}
          />
          <FunnelBar
            label="مرتجع"
            count={n(funnel?.returned)}
            total={entered}
            tone="bg-orange-400"
            onClick={() => onGoDesk('ship', 'returned')}
          />
          <FunnelBar
            label="ملغى"
            count={n(funnel?.cancelled)}
            total={entered}
            tone="bg-[#C45B6A]"
            onClick={() => onGoDesk('confirm', 'cancelled')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4 space-y-3">
          <p className="text-xs font-bold text-[#6a5648]">أفضل المنتجات</p>
          {store?.top_products?.length ? (
            <ul className="space-y-2">
              {store.top_products.slice(0, 8).map((p, i) => (
                <li
                  key={p.name}
                  className="flex justify-between gap-3 text-sm border-b border-[#f0e6dc] pb-2 last:border-0"
                >
                  <span className="truncate">
                    <span className="text-[#C4A484] font-bold me-1">{i + 1}.</span>
                    {p.name}
                  </span>
                  <span className="shrink-0 tabular-nums text-[#6a5648]">
                    ×{p.quantity} · {mad(p.revenue)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#6a5648]">ما كاينش بيانات</p>
          )}
        </div>
        <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4 space-y-3">
          <p className="text-xs font-bold text-[#6a5648]">أفضل المدن</p>
          {store?.top_cities?.length ? (
            <ul className="space-y-2">
              {store.top_cities.slice(0, 8).map((c, i) => (
                <li
                  key={c.city}
                  className="flex justify-between gap-3 text-sm border-b border-[#f0e6dc] pb-2 last:border-0"
                >
                  <span className="truncate">
                    <span className="text-[#C4A484] font-bold me-1">{i + 1}.</span>
                    {c.city}
                  </span>
                  <span className="font-bold tabular-nums">{c.count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#6a5648]">ما كاينش بيانات</p>
          )}
        </div>
      </div>

      {store?.by_status && Object.keys(store.by_status).length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-bold text-[#6a5648]">تفصيل الحالات</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(store.by_status)
              .sort((a, b) => b[1] - a[1])
              .map(([status, count]) => (
                <span
                  key={status}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e6d9cc] bg-white px-3 py-1.5 text-xs font-bold"
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
