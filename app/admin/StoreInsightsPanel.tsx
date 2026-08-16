'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  fetchAdminInsights,
  type InsightPeriod,
  type StoreInsights,
} from '@/lib/admin';

const PERIODS: { id: InsightPeriod; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
  { id: 'year', label: 'This year' },
  { id: 'all', label: 'All time' },
];

function mad(n: number | null | undefined) {
  const v = Number(n || 0);
  return `${v.toLocaleString('fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} MAD`;
}

function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4">
      <p className="text-xs text-[#6a5648] font-medium">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-[#1C1412] tracking-tight">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-[11px] text-[#6a5648] leading-snug">{hint}</p>
      ) : null}
    </div>
  );
}

export default function StoreInsightsPanel({ token }: { token: string }) {
  const [period, setPeriod] = useState<InsightPeriod>('today');
  const [data, setData] = useState<StoreInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(
    async (p: InsightPeriod) => {
      if (!token) return;
      setLoading(true);
      setError('');
      try {
        const res = await fetchAdminInsights(token, p);
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
    void load(period);
  }, [load, period]);

  return (
    <div className="space-y-6" dir="ltr">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#1C1412]">Store insights</h2>
          <p className="text-sm text-[#6a5648] mt-0.5">
            Earnings & sales · timezone Casablanca · COD Raonaq
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => void load(period)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e6d9cc] bg-white text-sm font-bold disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error ? (
        <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl px-3 py-2 font-bold">
          {error}
        </p>
      ) : null}

      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#6a5648]">
          Earnings
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PERIODS.map((p) => {
            const row = data?.earnings?.[p.id];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={`text-left rounded-2xl border p-4 transition-colors ${
                  period === p.id
                    ? 'border-[#1C1412] bg-[#1C1412] text-white'
                    : 'border-[#e6d9cc] bg-white hover:bg-[#F7F1EC]'
                }`}
              >
                <p
                  className={`text-xs font-medium ${
                    period === p.id ? 'text-white/70' : 'text-[#6a5648]'
                  }`}
                >
                  {p.label}
                </p>
                <p className="mt-1 text-lg sm:text-xl font-bold tabular-nums">
                  {mad(row?.earnings)}
                </p>
                <p
                  className={`mt-1 text-[10px] ${
                    period === p.id ? 'text-white/60' : 'text-[#6a5648]'
                  }`}
                >
                  Sales {mad(row?.sales)} · {row?.orders ?? 0} orders
                </p>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-[#6a5648]">
          Earnings = مبلغ الطلبات المسلّمة (DELIVERED). Sales = مجموع الطلبات
          (بدون ملغى / FAUX NM).
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#6a5648]">
            Store insights · {data?.period_label || period}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  period === p.id
                    ? 'bg-[#C45B6A] text-white border-[#C45B6A]'
                    : 'bg-white border-[#e6d9cc] text-[#5c4a3c]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatTile
            label="Max order value"
            value={mad(data?.store.max_order_value)}
          />
          <StatTile
            label="Average order value"
            value={mad(data?.store.avg_order_value)}
          />
          <StatTile
            label="Min order value"
            value={mad(data?.store.min_order_value)}
          />
          <StatTile
            label="Orders"
            value={String(data?.store.orders ?? 0)}
          />
          <StatTile label="Sales" value={mad(data?.store.sales)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6a5648]">
              Top products
            </p>
            {data?.store.top_products?.length ? (
              <ul className="space-y-2">
                {data.store.top_products.map((p) => (
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
              <p className="text-sm text-[#6a5648]">Unavailable</p>
            )}
          </div>

          <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6a5648]">
              Top cities
            </p>
            {data?.store.top_cities?.length ? (
              <ul className="space-y-2">
                {data.store.top_cities.map((c) => (
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
              <p className="text-sm text-[#6a5648]">Unavailable</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatTile
            label="Delivered earnings"
            value={mad(data?.store.earnings)}
            hint={`${data?.store.delivered ?? 0} livré`}
          />
          <StatTile
            label="Conversion rate"
            value={`${data?.store.conversion_rate ?? 0} %`}
            hint="Delivered ÷ orders (COD)"
          />
          <div className="rounded-2xl border border-[#e6d9cc] bg-[#F7F1EC] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6a5648]">
              Traffic
            </p>
            <p className="mt-2 text-sm text-[#6a5648]">
              {data?.store.traffic?.message || 'Unavailable'}
            </p>
            <p className="mt-3 text-xs text-[#6a5648]">
              Visitors / page views / devices · Top pages · Checkout funnel —
              Unavailable بدون Pixel analytics.
            </p>
          </div>
        </div>

        {data?.store.by_status &&
        Object.keys(data.store.by_status).length > 0 ? (
          <div className="rounded-2xl border border-[#e6d9cc] bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6a5648] mb-3">
              Orders by status
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(data.store.by_status)
                .sort((a, b) => b[1] - a[1])
                .map(([status, count]) => (
                  <span
                    key={status}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#faf6f1] border border-[#e6d9cc] tabular-nums"
                  >
                    {status}: <b>{count}</b>
                  </span>
                ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
