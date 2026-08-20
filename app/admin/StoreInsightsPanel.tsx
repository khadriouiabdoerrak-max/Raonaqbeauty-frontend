'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  fetchAdminInsights,
  type InsightPeriod,
  type StoreInsights,
} from '@/lib/admin';
import { mergeTopCities } from '@/lib/cityNormalize';
import AdminDateCalendar from './AdminDateCalendar';

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
  const v = Number(n || 0);
  return `${v.toLocaleString('fr-MA', {
    maximumFractionDigits: 0,
  })} DH`;
}

function pct(n: number | null | undefined) {
  return `${Number(n || 0)}%`;
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-base font-bold text-[#1C1412]">{title}</h3>
        {subtitle ? (
          <p className="mt-0.5 text-[12px] text-[#6a5648]">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Kpi({
  label,
  value,
  hint,
  tone = 'default',
  onClick,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'dark' | 'teal' | 'sky' | 'amber' | 'rose';
  onClick?: () => void;
}) {
  const tones: Record<string, string> = {
    default: 'border-[#e6d9cc] bg-white text-[#1C1412]',
    dark: 'border-[#1C1412] bg-[#1C1412] text-white',
    teal: 'border-teal-200 bg-teal-50 text-[#1C1412]',
    sky: 'border-sky-200 bg-sky-50 text-[#1C1412]',
    amber: 'border-amber-200 bg-amber-50 text-[#1C1412]',
    rose: 'border-[#F3D5DB] bg-[#FBEFF1] text-[#1C1412]',
  };
  const hintTone =
    tone === 'dark' ? 'text-white/60' : 'text-[#6a5648]';
  const labelTone =
    tone === 'dark' ? 'text-white/70' : 'text-[#6a5648]';
  const className = `rounded-2xl border p-4 text-right ${tones[tone]} ${
    onClick ? 'hover:brightness-[0.98] transition' : ''
  }`;
  const body = (
    <>
      <p className={`text-[11px] font-bold tracking-wide ${labelTone}`}>
        {label}
      </p>
      <p className="mt-1.5 text-2xl sm:text-3xl font-bold tabular-nums tracking-tight">
        {value}
      </p>
      {hint ? (
        <p className={`mt-1.5 text-[11px] leading-snug ${hintTone}`}>{hint}</p>
      ) : null}
    </>
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`w-full ${className}`}>
        {body}
      </button>
    );
  }
  return <div className={className}>{body}</div>;
}

type DeskTarget = { desk: 'confirm' | 'ship'; pipe: string };

type Props = {
  token: string;
  onOpenConfirm?: () => void;
  onOpenShip?: () => void;
  onGoDesk?: (desk: 'confirm' | 'ship', pipe: string) => void;
};

export default function StoreInsightsPanel({
  token,
  onOpenConfirm,
  onOpenShip,
  onGoDesk,
}: Props) {
  const now = new Date();
  const [period, setPeriod] = useState<string>('today');
  const [calY, setCalY] = useState(now.getFullYear());
  const [calM, setCalM] = useState(now.getMonth() + 1);
  const [data, setData] = useState<StoreInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const calendarParam = `${calY}-${pad(calM)}`;
  const selectedDay = /^\d{4}-\d{2}-\d{2}$/.test(period) ? period : '';

  const load = useCallback(
    async (p: string, cal: string) => {
      if (!token) return;
      setLoading(true);
      setError('');
      try {
        const res = await fetchAdminInsights(token, p, cal);
        setData(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'فشل التحميل');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('جلسة غير متاحة');
      return;
    }
    void load(period, calendarParam);
  }, [load, period, calendarParam, token]);

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

  const go = (target?: DeskTarget) => {
    if (!target || !onGoDesk) return;
    onGoDesk(target.desk, target.pipe);
  };

  if (!token) {
    return (
      <p className="text-sm text-[#6a5648]">سجّل الدخول باش تشوف الحساب.</p>
    );
  }

  const store = data?.store;
  const funnel = store?.funnel;
  const periodLabel = data?.period_label || '';

  const pipeline: {
    key: keyof NonNullable<NonNullable<StoreInsights['store']>['funnel']>;
    label: string;
    hint: string;
    tone: 'default' | 'amber' | 'teal' | 'sky' | 'rose';
    target?: DeskTarget;
  }[] = [
    {
      key: 'entered',
      label: 'داخلة',
      hint: 'كل الطلبات',
      tone: 'default',
    },
    {
      key: 'pending',
      label: 'تأكيد',
      hint: 'كاتسنى المكالمة',
      tone: 'amber',
      target: { desk: 'confirm', pipe: 'call_today' },
    },
    {
      key: 'confirmed',
      label: 'مؤكد',
      hint: 'جاهز للشحن',
      tone: 'teal',
      target: { desk: 'ship', pipe: 'confirmed' },
    },
    {
      key: 'shipped',
      label: 'مرسل',
      hint: 'عند الشركة',
      tone: 'sky',
      target: { desk: 'ship', pipe: 'shipped' },
    },
    {
      key: 'delivered',
      label: 'مسلّم',
      hint: 'COD تسلاّم',
      tone: 'teal',
      target: { desk: 'ship', pipe: 'delivered' },
    },
    {
      key: 'returned',
      label: 'مرتجع',
      hint: 'رجع للمخزن',
      tone: 'amber',
      target: { desk: 'ship', pipe: 'returned' },
    },
    {
      key: 'cancelled',
      label: 'ملغى',
      hint: 'ما مشاتش',
      tone: 'rose',
      target: { desk: 'confirm', pipe: 'cancelled' },
    },
  ];

  return (
    <div className={`space-y-8 ${loading ? 'opacity-70' : ''}`} dir="rtl">
      {/* رأس */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#C4A484]">
            RAONAQ · حساب
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[#1C1412]">نظرة شاملة</h2>
          <p className="mt-1 text-sm text-[#6a5648]">
            طلبات · تأكيد · شحن · تسليم · فلوس COD
            {periodLabel ? ` · ${periodLabel}` : ''}
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
            onClick={() => void load(period, calendarParam)}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#e6d9cc] bg-white text-sm font-bold disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            تحديث
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl px-3 py-2 font-bold">
          {error}
        </p>
      ) : null}

      {/* اختيار الفترة */}
      <div className="flex flex-wrap gap-1.5">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPeriod(p.id)}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold border ${
              period === p.id
                ? 'bg-[#1C1412] text-white border-[#1C1412]'
                : 'bg-white border-[#e6d9cc] text-[#5c4a3c] hover:border-[#C4A484]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 1) الأرقام الأهم */}
      <Section
        title="الأهم دابا"
        subtitle="شحال دخل · شحال تأكد · شحال تسلاّم · شحال فلوس جات"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi
            label="طلبات داخلة"
            value={String(funnel?.entered ?? store?.orders ?? 0)}
            hint="كل الطلبات فالفترة"
          />
          <Kpi
            label="مؤكدة"
            value={String(funnel?.confirmed ?? 0)}
            hint="جاهزة أو خرجات للشحن"
            tone="teal"
            onClick={() => go({ desk: 'ship', pipe: 'confirmed' })}
          />
          <Kpi
            label="مسلّمة"
            value={String(funnel?.delivered ?? store?.delivered ?? 0)}
            hint="الزبون خلّص / استلم"
            tone="sky"
            onClick={() => go({ desk: 'ship', pipe: 'delivered' })}
          />
          <Kpi
            label="محصّل COD"
            value={mad(store?.earnings)}
            hint="فلوس اللي تسلاّمات فعلاً"
            tone="dark"
          />
        </div>
      </Section>

      {/* 2) مسار الطلب */}
      <Section
        title="مسار الطلب"
        subtitle="من الدخول حتى التسليم — كليكي باش تفتح الطابور"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {pipeline.map((step, i) => (
            <button
              key={step.key}
              type="button"
              disabled={!step.target || !onGoDesk}
              onClick={() => go(step.target)}
              className={`rounded-xl border px-3 py-3 text-center disabled:cursor-default ${
                step.tone === 'amber'
                  ? 'border-amber-200 bg-amber-50'
                  : step.tone === 'teal'
                    ? 'border-teal-200 bg-teal-50'
                    : step.tone === 'sky'
                      ? 'border-sky-200 bg-sky-50'
                      : step.tone === 'rose'
                        ? 'border-[#F3D5DB] bg-[#FBEFF1]'
                        : 'border-[#e6d9cc] bg-white'
              } ${step.target && onGoDesk ? 'hover:brightness-[0.98]' : ''}`}
            >
              <p className="text-[10px] font-bold text-[#8a7464]">
                {String(i + 1).padStart(2, '0')} · {step.label}
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[#1C1412]">
                {funnel?.[step.key] ?? 0}
              </p>
              <p className="mt-0.5 text-[10px] text-[#6a5648]">{step.hint}</p>
            </button>
          ))}
        </div>
      </Section>

      {/* 3) الفلوس */}
      <Section
        title="الحساب · الفلوس"
        subtitle="محصّل = تسلاّم. فريزو = باقي فالتوصيل. ماشي ربح صافي."
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi
            label="محصّل"
            value={mad(store?.earnings)}
            hint={`${store?.delivered ?? 0} مسلّم`}
            tone="dark"
          />
          <Kpi
            label="فريزو فالتوصيل"
            value={mad(store?.frozen)}
            hint={`${store?.frozen_count ?? 0} طرد مرسل`}
            tone="sky"
          />
          <Kpi
            label="قيمة المرتجع"
            value={mad(store?.returned_value)}
            hint="طلبات رجعات"
            tone="amber"
          />
          <Kpi
            label="متوسط الطلب"
            value={mad(store?.avg_order_value)}
            hint={`من ${store?.orders ?? 0} طلب (بلا ملغى)`}
          />
        </div>
        {(store?.cancelled_value ?? 0) > 0 ? (
          <p className="text-[12px] text-[#6a5648]">
            قيمة الملغى فالفترة: <b>{mad(store?.cancelled_value)}</b>
          </p>
        ) : null}
      </Section>

      {/* 4) النسب */}
      <Section
        title="الأداء"
        subtitle="نسب التأكيد والتسليم والرجوع — باش تعرف الجودة"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi
            label="نسبة التأكيد"
            value={pct(store?.confirm_rate)}
            hint="مؤكد فما فوق ÷ داخلة"
            tone="teal"
          />
          <Kpi
            label="نسبة التسليم"
            value={pct(store?.delivery_rate)}
            hint="مسلّم ÷ الشحنات"
            tone="sky"
          />
          <Kpi
            label="نسبة الرجوع"
            value={pct(store?.return_rate)}
            hint="مرتجع ÷ الشحنات"
            tone="amber"
          />
          <Kpi
            label="تحويل COD"
            value={pct(store?.conversion_rate)}
            hint="مسلّم ÷ كل الطلبات"
          />
        </div>
      </Section>

      {/* 5) منتجات + مدن */}
      <Section title="شنو كيتباع · فين" subtitle="أقوى المنتجات والمدن فالفترة">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4 space-y-3">
            <p className="text-xs font-bold text-[#6a5648]">أفضل المنتجات</p>
            {store?.top_products?.length ? (
              <ul className="space-y-2">
                {store.top_products.map((p, idx) => (
                  <li
                    key={p.name}
                    className="flex items-center justify-between gap-3 text-sm border-b border-[#f0e6dc] pb-2 last:border-0"
                  >
                    <span className="min-w-0 flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#C4A484] tabular-nums">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-[#1C1412] truncate">
                        {p.name}
                      </span>
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
                {mergeTopCities(store.top_cities, 8).map((c, idx) => (
                  <li
                    key={c.city}
                    className="flex items-center justify-between gap-3 text-sm border-b border-[#f0e6dc] pb-2 last:border-0"
                  >
                    <span className="min-w-0 flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#C4A484] tabular-nums">
                        {idx + 1}
                      </span>
                      <span className="font-medium truncate">{c.city}</span>
                    </span>
                    <span className="tabular-nums font-bold">{c.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#6a5648]">ما كاينش بيانات</p>
            )}
          </div>
        </div>
      </Section>

      {/* 6) تفصيل الحالات */}
      {store?.by_status && Object.keys(store.by_status).length > 0 ? (
        <Section
          title="تفصيل الحالات"
          subtitle="كل حالة بوحدها فالفترة المختارة"
        >
          <div className="flex flex-wrap gap-2">
            {Object.entries(store.by_status)
              .sort((a, b) => b[1] - a[1])
              .map(([status, count]) => (
                <span
                  key={status}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e6d9cc] bg-white px-3 py-1.5 text-xs font-bold text-[#1C1412]"
                >
                  {STATUS_AR[status] || status}
                  <span className="tabular-nums text-[#6a5648]">{count}</span>
                </span>
              ))}
          </div>
        </Section>
      ) : null}

      {/* اختصارات */}
      {(onOpenConfirm || onOpenShip) && (
        <div className="flex flex-wrap gap-2 border-t border-[#e6d9cc] pt-5">
          {onOpenConfirm ? (
            <button
              type="button"
              onClick={onOpenConfirm}
              className="px-4 py-2.5 rounded-xl bg-[#1C1412] text-white text-sm font-bold"
            >
              طابور التأكيد
            </button>
          ) : null}
          {onOpenShip ? (
            <button
              type="button"
              onClick={onOpenShip}
              className="px-4 py-2.5 rounded-xl border border-[#e6d9cc] bg-white text-sm font-bold text-[#1C1412]"
            >
              مكتب الشحن
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
