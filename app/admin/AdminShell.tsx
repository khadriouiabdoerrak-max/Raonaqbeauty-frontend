'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  ADMIN_TOKEN_KEY,
  adminLogin,
  adminLogout,
  fetchAdminStats,
  type AdminStats,
} from '@/lib/admin';
import StoreInsightsPanel from './StoreInsightsPanel';

const OpsDesk = dynamic(() => import('./OpsDesk'), {
  ssr: false,
  loading: () => (
    <div
      dir="rtl"
      className="min-h-[50dvh] flex items-center justify-center text-muted-brown"
    >
      جاري فتح المكتب…
    </div>
  ),
});

/** تأكيد | شحن | حساب */
type Tab = 'confirm' | 'ship' | 'overview';

function parseTab(raw: string | null): Tab {
  if (raw === 'ship' || raw === 'shipping') return 'ship';
  if (
    raw === 'overview' ||
    raw === 'dashboard' ||
    raw === 'board' ||
    raw === 'stats' ||
    raw === 'hesab' ||
    raw === 'account'
  )
    return 'overview';
  if (
    raw === 'confirm' ||
    raw === 'orders' ||
    raw === 'ops' ||
    raw === 'preview' ||
    raw === 'list' ||
    raw === 'catalog' ||
    raw === 'sales' ||
    raw === 'monitor' ||
    raw === 'all' ||
    !raw
  )
    return 'confirm';
  return 'confirm';
}

function MetricCard({
  label,
  value,
  hint,
  onClick,
}: {
  label: string;
  value: string;
  hint?: string;
  onClick?: () => void;
}) {
  const className =
    'rounded-2xl border border-champagne/40 bg-ivory p-5 shadow-card text-right w-full';
  const body = (
    <>
      <p className="text-xs font-medium text-muted-brown mb-2">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-cocoa tracking-tight tabular-nums">
        {value}
      </p>
      {hint ? (
        <p className="text-[11px] text-muted-brown mt-2 leading-relaxed">{hint}</p>
      ) : null}
    </>
  );
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${className} hover:border-cocoa/40 transition-colors`}
      >
        {body}
      </button>
    );
  }
  return <div className={className}>{body}</div>;
}

export default function AdminShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = parseTab(searchParams.get('tab'));

  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);

  const setTab = (next: Tab) => {
    if (next === 'ship') {
      router.replace('/admin?tab=ship&pipe=all', { scroll: false });
      return;
    }
    if (next === 'overview') {
      router.replace('/admin?tab=overview', { scroll: false });
      return;
    }
    router.replace('/admin?tab=confirm&pipe=call_today', { scroll: false });
  };

  const goDesk = (desk: 'confirm' | 'ship', pipe: string) => {
    router.replace(`/admin?tab=${desk}&pipe=${pipe}`, { scroll: false });
  };

  const loadOverview = useCallback(async (secret: string) => {
    try {
      const next = await fetchAdminStats(secret);
      setStats(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل تحميل الإحصائيات');
    }
  }, []);

  const bootstrap = useCallback(async (secret: string) => {
    setLoading(true);
    setError('');
    try {
      await fetchAdminStats(secret);
      setToken(secret);
      sessionStorage.setItem(ADMIN_TOKEN_KEY, secret);
    } catch (err) {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      setToken('');
      setError(err instanceof Error ? err.message : 'جلسة غير صالحة');
    } finally {
      setLoading(false);
      setBooting(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (saved) void bootstrap(saved);
    else setBooting(false);
  }, [bootstrap]);

  useEffect(() => {
    if (!token || tab !== 'overview') return;
    void loadOverview(token);
  }, [token, tab, loadOverview]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (tab === 'ship') document.title = 'شحن رونق';
    else if (tab === 'overview') document.title = 'حساب رونق';
    else document.title = 'تأكيد رونق';
  }, [tab]);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adminLogin(username.trim().toLowerCase(), password.trim());
      sessionStorage.setItem(ADMIN_TOKEN_KEY, res.token);
      setToken(res.token);
      setPassword('');
      router.replace('/admin?tab=confirm&pipe=call_today', { scroll: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    if (token) await adminLogout(token);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken('');
    setStats(null);
  };

  if (booting) {
    return (
      <div
        dir="rtl"
        className="min-h-[100dvh] bg-background flex items-center justify-center text-muted-brown"
      >
        جاري الفتح…
      </div>
    );
  }

  if (!token) {
    return (
      <div
        dir="rtl"
        className="min-h-[100dvh] bg-background flex items-center justify-center px-4"
      >
        <form
          onSubmit={onLogin}
          className="w-full max-w-sm bg-ivory border border-champagne/40 rounded-2xl p-7 space-y-4 shadow-card text-right"
        >
          <div className="space-y-1">
            <p className="text-xs font-bold tracking-wide text-gold">رونق · RAONAQ</p>
            <h1 className="text-xl font-bold text-cocoa">إدارة رونق</h1>
            <p className="text-sm text-muted-brown">تأكيد · شحن · حساب</p>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="اسم المستخدم"
            autoComplete="username"
            dir="ltr"
            className="w-full p-3.5 rounded-xl border border-champagne/50 bg-background text-cocoa text-left"
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            autoComplete="current-password"
            dir="ltr"
            className="w-full p-3.5 rounded-xl border border-champagne/50 bg-background text-cocoa text-left"
          />
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <button
            type="submit"
            disabled={loading || !username.trim() || !password}
            className="w-full py-3.5 rounded-xl bg-cocoa text-ivory font-bold disabled:opacity-50"
          >
            دخول
          </button>
        </form>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'confirm', label: 'تأكيد' },
    { id: 'ship', label: 'شحن' },
    { id: 'overview', label: 'حساب' },
  ];

  return (
    <div dir="rtl" className="min-h-[100dvh] bg-background">
      <header className="sticky top-0 z-30 border-b border-champagne/40 bg-ivory/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-gold">رونق</p>
            <h1 className="text-lg font-bold text-cocoa">مكتب العمليات</h1>
          </div>
          <nav className="flex flex-wrap gap-1.5">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
                  tab === t.id
                    ? 'bg-cocoa text-ivory'
                    : 'bg-background text-secondary hover:text-cocoa'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => void onLogout()}
            className="text-xs font-medium text-muted-brown hover:text-cocoa"
          >
            خروج
          </button>
        </div>
      </header>

      {error && tab === 'overview' ? (
        <p className="max-w-6xl mx-auto px-4 pt-3 text-sm text-error">{error}</p>
      ) : null}

      {(tab === 'confirm' || tab === 'ship') && (
        <OpsDesk key={tab} embedded sessionToken={token} />
      )}

      {tab === 'overview' && (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
          <StoreInsightsPanel
            token={token}
            onOpenConfirm={() => goDesk('confirm', 'call_today')}
            onOpenShip={() => goDesk('ship', 'all')}
            onGoDesk={goDesk}
          />

          <section className="space-y-4 border-t border-champagne/40 pt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-cocoa">طابور الآن</h2>
                <p className="text-sm text-muted-brown">
                  اللي خاصو خدمة دابا — ماشي غير إحصاء الفترة
                </p>
              </div>
              <button
                type="button"
                onClick={() => void loadOverview(token)}
                className="px-4 py-2.5 rounded-xl bg-cocoa text-ivory text-sm font-bold"
              >
                تحديث الطابور
              </button>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-bold text-muted-brown">تأكيد</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard
                  label="طلبات اليوم"
                  value={String(stats?.today ?? '—')}
                  onClick={() => goDesk('confirm', 'call_today')}
                />
                <MetricCard
                  label="قيد التأكيد"
                  value={String(stats?.pending ?? '—')}
                  hint="جديد + مكالمات"
                  onClick={() => goDesk('confirm', 'call_today')}
                />
                <MetricCard
                  label="ملغى (الكل)"
                  value={String(stats?.cancelled ?? '—')}
                  onClick={() => goDesk('confirm', 'cancelled')}
                />
                <MetricCard
                  label="مؤجل حان وقته"
                  value={String(stats?.reporte_due ?? stats?.reporte ?? '—')}
                  onClick={() => goDesk('confirm', 'call_today')}
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-bold text-muted-brown">شحن · توصيل</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard
                  label="جاهز للشحن"
                  value={String(
                    (stats?.confirmed ?? 0) + (stats?.ready_to_ship ?? 0),
                  )}
                  onClick={() => goDesk('ship', 'confirmed')}
                />
                <MetricCard
                  label="مرسل عند الشركة"
                  value={String(stats?.shipped ?? '—')}
                  onClick={() => goDesk('ship', 'shipped')}
                />
                <MetricCard
                  label="متأخر شحن"
                  value={String(stats?.stale_shipped ?? '—')}
                  hint="مرسل بزاف وما تبدّلاتش حالته"
                  onClick={() => goDesk('ship', 'stale')}
                />
                <MetricCard
                  label="مرتجع"
                  value={String(stats?.returned ?? '—')}
                  onClick={() => goDesk('ship', 'returned')}
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-bold text-muted-brown">نتائج اليوم</p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <MetricCard
                  label="مسلّم اليوم"
                  value={String(
                    stats?.today_delivered ?? stats?.delivered ?? '—',
                  )}
                  onClick={() => goDesk('ship', 'delivered')}
                />
                <MetricCard
                  label="مرتجع اليوم"
                  value={String(stats?.today_returned ?? '—')}
                  onClick={() => goDesk('ship', 'returned')}
                />
                <MetricCard
                  label="ملغى اليوم"
                  value={String(stats?.today_cancelled ?? '—')}
                  onClick={() => goDesk('confirm', 'cancelled')}
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
