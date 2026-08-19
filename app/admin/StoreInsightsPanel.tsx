'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  fetchAdminInsights,
  type InsightPeriod,
  type StoreInsights,
} from '@/lib/admin';
import AdminDateCalendar from './AdminDateCalendar';

const PERIODS: { id: InsightPeriod; label: string }[] = [
  { id: 'today', label: 'اليوم' },
  { id: 'yesterday', label: 'أمس' },
  { id: 'week', label: 'الأسبوع' },
  { id: 'month', label: 'الشهر' },
  { id: 'year', label: 'السنة' },
  { id: 'all', label: 'الكل' },
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function mad(n: number | null | undefined) {
  const v = Number(n || 0);
  return `${v.toLocaleString('fr-MA', {
    maximumFractionDigits: 0,
  })} DH`;
}

function StatTile({
  label,
  value,
  hint,
  emphasize,
}: {
  label: string;
  value: string;
  hint?: string;
  emphasize?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        emphasize
          ? 'border-[#1C1412] bg-[#1C1412] text-white'
          : 'border-[#e6d9cc] bg-white text-[#1C1412]'
      }`}
    >
      <p
        className={`text-xs font-medium ${
          emphasize ? 'text-white/70' : 'text-[#6a5648]'
        }`}
      >
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight">
        {value}
      </p>
      {hint ? (
        <p
          className={`mt-1 text-[11px] leading-snug ${
            emphasize ? 'text-white/60' : 'text-[#6a5648]'
          }`}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type Props = {
  token: string;
  onOpenConfirm?: () => void;
  onOpenShip?: () => void;
};

export default function StoreInsightsPanel({
  token,
  onOpenConfirm,
  onOpenShip,
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

  if (!token) {
    return (
      <p className="text-sm text-[#6a5648]">سجّل الدخول باش تشوف الحساب.</p>
    );
  }

  const store = data?.store;
  const funnel = store?.funnel;

  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#1C1412]">حساب رونق</h2>
          <p className="text-sm text-[#6a5648] mt-0.5">
            طلبات · فلوس COD · نسب · الدار البيضاء
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

      <div className="flex flex-wrap gap-1.5">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPeriod(p.id)}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold border ${
              period === p.id
                ? 'bg-[#1C1412] text-white border-[#1C1412]'
                : 'bg-white border-[#e6d9cc] text-[#5c4a3c]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {data?.earnings ? (
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-[#6a5648]">لمحة كل الفترات</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {PERIODS.map((p) => {
              const row = data.earnings?.[p.id];
              const on = period === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPeriod(p.id)}
                  className={`rounded-xl border px-3 py-3 text-right transition-colors ${
                    on
                      ? 'border-[#1C1412] bg-[#1C1412] text-white'
                      : 'border-[#e6d9cc] bg-white hover:border-[#C4A484]'
                  }`}
                >
                  <p
                    className={`text-[11px] font-medium ${
                      on ? 'text-white/70' : 'text-[#6a5648]'
                    }`}
                  >
                    {p.label}
                  </p>
                  <p className="mt-1 text-lg font-bold tabular-nums">
                    {mad(row?.earnings)}
                  </p>
                  <p
                    className={`mt-0.5 text-[11px] tabular-nums ${
                      on ? 'text-white/55' : 'text-[#6a5648]'
                    }`}
                  >
                    {row?.orders ?? 0} طلب · {row?.delivered ?? 0} مسلّم
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-[#6a5648]">
          الفلوس
          {data?.period_label ? ` · ${data.period_label}` : ''}
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatTile
            label="محصّل"
            value={mad(store?.earnings)}
            hint={`${store?.delivered ?? 0} مسلّم · فلوس وصلت`}
            emphasize
          />
          <StatTile
            label="فريزو (فالتوصيل)"
            value={mad(store?.frozen)}
            hint={`${store?.frozen_count ?? 0} مرسل · معلّق دابا`}
          />
          <StatTile
            label="مرتجع (قيمة)"
            value={mad(store?.returned_value)}
            hint="مجموع طلبات مرتجعة فالفترة"
          />
          <StatTile
            label="متوسط الطلب"
            value={mad(store?.avg_order_value)}
            hint={`من ${store?.orders ?? 0} طلب (بدون ملغى)`}
          />
        </div>
        <p className="text-[11px] text-[#6a5648] leading-relaxed">
          محصّل = COD اللي تسلاّم. فريزو = فلوس فالتوصيل دابا. هادا{' '}
          <b>ماشي ربح صافي</b> (ما كنحسبوش تكلفة البضاعة / شحن Ozon هنا).
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-[#6a5648]">القمع</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {(
            [
              { key: 'entered', label: 'داخلة' },
              { key: 'pending', label: 'قيد التأكيد' },
              { key: 'confirmed', label: 'مؤكد / جاهز' },
              { key: 'shipped', label: 'مرسل' },
              { key: 'delivered', label: 'مسلّم' },
              { key: 'returned', label: 'مرتجع' },
              { key: 'cancelled', label: 'ملغى' },
            ] as const
          ).map((row) => (
            <div
              key={row.key}
              className="rounded-xl border border-[#e6d9cc] bg-white px-3 py-3 text-center"
            >
              <p className="text-[11px] text-[#6a5648] font-medium">
                {row.label}
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums text-[#1C1412]">
                {funnel?.[row.key] ?? 0}
              </p>
            </div>
          ))}
        </div>
        {(store?.cancelled_value ?? 0) > 0 ? (
          <p className="text-[11px] text-[#6a5648]">
            قيمة الملغى فالفترة: {mad(store?.cancelled_value)}
          </p>
        ) : null}
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-[#6a5648]">النسب</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatTile
            label="نسبة التأكيد"
            value={`${store?.confirm_rate ?? 0} %`}
            hint="مؤكد فما فوق ÷ داخلة"
          />
          <StatTile
            label="نسبة التسليم"
            value={`${store?.delivery_rate ?? 0} %`}
            hint="مسلّم ÷ (مرسل+مسلّم+مرتجع)"
          />
          <StatTile
            label="نسبة الرجوع"
            value={`${store?.return_rate ?? 0} %`}
            hint="مرتجع ÷ الشحنات"
          />
          <StatTile
            label="تحويل COD"
            value={`${store?.conversion_rate ?? 0} %`}
            hint="مسلّم ÷ طلبات الفترة"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4 space-y-3">
          <p className="text-xs font-bold text-[#6a5648]">أفضل المنتجات</p>
          {store?.top_products?.length ? (
            <ul className="space-y-2">
              {store.top_products.map((p) => (
                <li
                  key={p.name}
                  className="flex items-center justify-between gap-3 text-sm border-b border-[#f0e6dc] pb-2 last:border-0"
                >
                  <span className="font-medium text-[#1C1412] truncate">
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
              {store.top_cities.map((c) => (
                <li
                  key={c.city}
                  className="flex items-center justify-between gap-3 text-sm border-b border-[#f0e6dc] pb-2 last:border-0"
                >
                  <span className="font-medium truncate">{c.city}</span>
                  <span className="tabular-nums font-bold">{c.count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#6a5648]">ما كاينش بيانات</p>
          )}
        </div>
      </div>

      {store?.by_status && Object.keys(store.by_status).length > 0 ? (
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-[#6a5648]">حسب الحالة</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(store.by_status)
              .sort((a, b) => b[1] - a[1])
              .map(([status, count]) => (
                <span
                  key={status}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e6d9cc] bg-white px-3 py-1.5 text-xs font-bold text-[#1C1412]"
                >
                  {status}
                  <span className="tabular-nums text-[#6a5648]">{count}</span>
                </span>
              ))}
          </div>
        </section>
      ) : null}

      {(onOpenConfirm || onOpenShip) && (
        <div className="flex flex-wrap gap-2">
          {onOpenConfirm ? (
            <button
              type="button"
              onClick={onOpenConfirm}
              className="px-4 py-2.5 rounded-xl border border-[#e6d9cc] bg-white text-sm font-bold text-[#1C1412]"
            >
              فتح طابور التأكيد
            </button>
          ) : null}
          {onOpenShip ? (
            <button
              type="button"
              onClick={onOpenShip}
              className="px-4 py-2.5 rounded-xl border border-[#e6d9cc] bg-white text-sm font-bold text-[#1C1412]"
            >
              فتح مكتب الشحن
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
