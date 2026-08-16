'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';

type Props = {
  /** YYYY-MM-DD or empty */
  value: string;
  onChange: (isoDate: string) => void;
  /** Optional map YYYY-MM-DD → count for dots */
  dayCounts?: Record<string, number>;
  className?: string;
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function toIso(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

function parseIso(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  return {
    y: Number(m[1]),
    m: Number(m[2]),
    d: Number(m[3]),
  };
}

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function AdminDateCalendar({
  value,
  onChange,
  dayCounts = {},
  className = '',
}: Props) {
  const selected = parseIso(value);
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [viewY, setViewY] = useState(selected?.y ?? today.getFullYear());
  const [viewM, setViewM] = useState(selected?.m ?? today.getMonth() + 1);

  const cells = useMemo(() => {
    const first = new Date(viewY, viewM - 1, 1);
    // JS: 0=Sun … convert to Mon-first index 0
    const startPad = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(viewY, viewM, 0).getDate();
    const out: { day: number | null; iso: string | null }[] = [];
    for (let i = 0; i < startPad; i++) out.push({ day: null, iso: null });
    for (let d = 1; d <= daysInMonth; d++) {
      out.push({ day: d, iso: toIso(viewY, viewM, d) });
    }
    while (out.length % 7 !== 0) out.push({ day: null, iso: null });
    return out;
  }, [viewY, viewM]);

  const label = selected
    ? `${pad(selected.d)}/${pad(selected.m)}/${selected.y}`
    : 'Calendrier';

  const shiftMonth = (delta: number) => {
    const dt = new Date(viewY, viewM - 1 + delta, 1);
    setViewY(dt.getFullYear());
    setViewM(dt.getMonth() + 1);
  };

  const todayIso = toIso(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => {
          if (selected) {
            setViewY(selected.y);
            setViewM(selected.m);
          }
          setOpen((v) => !v);
        }}
        className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-bold ${
          value
            ? 'border-[#C45B6A]/50 bg-[#C45B6A]/10 text-[#7a2f3a]'
            : 'border-[#e6d9cc] bg-white text-[#2a1810]'
        }`}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <CalendarDays className="w-4 h-4" />
        {label}
      </button>

      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="ms-1 inline-flex p-2.5 rounded-xl border border-[#e6d9cc] bg-white text-[#6a5648]"
          aria-label="مسح التاريخ"
          title="مسح"
        >
          <X className="w-4 h-4" />
        </button>
      ) : null}

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="إغلاق"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute z-50 mt-2 end-0 w-[300px] rounded-2xl border border-[#e6d9cc] bg-white p-3 shadow-xl"
            role="dialog"
            aria-label="Calendrier"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="p-1.5 rounded-lg border border-[#e6d9cc]"
                aria-label="الشهر السابق"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <p className="text-sm font-bold tabular-nums text-[#1C1412]">
                {pad(viewM)} / {viewY}
              </p>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="p-1.5 rounded-lg border border-[#e6d9cc]"
                aria-label="الشهر الموالي"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map((w) => (
                <span
                  key={w}
                  className="text-center text-[10px] font-bold text-[#6a5648] py-1"
                >
                  {w}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((c, i) => {
                if (!c.day || !c.iso) {
                  return <span key={`e-${i}`} className="h-9" />;
                }
                const count = dayCounts[c.iso] || 0;
                const isSel = value === c.iso;
                const isToday = c.iso === todayIso;
                return (
                  <button
                    key={c.iso}
                    type="button"
                    onClick={() => {
                      onChange(c.iso!);
                      setOpen(false);
                    }}
                    className={`relative h-9 rounded-lg text-sm font-bold tabular-nums transition-colors ${
                      isSel
                        ? 'bg-[#1C1412] text-white'
                        : isToday
                          ? 'bg-[#F7F1EC] text-[#1C1412] ring-1 ring-[#C4A484]'
                          : 'hover:bg-[#faf6f1] text-[#1C1412]'
                    }`}
                  >
                    {c.day}
                    {count > 0 ? (
                      <span
                        className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                          isSel ? 'bg-white' : 'bg-[#C45B6A]'
                        }`}
                        title={`${count} طلب`}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onChange(todayIso);
                  setViewY(today.getFullYear());
                  setViewM(today.getMonth() + 1);
                  setOpen(false);
                }}
                className="flex-1 py-2 rounded-xl border border-[#e6d9cc] text-xs font-bold"
              >
                Aujourd’hui
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setOpen(false);
                }}
                className="flex-1 py-2 rounded-xl border border-[#e6d9cc] text-xs font-bold text-[#6a5648]"
              >
                Tout
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

/** Convert calendar ISO → year/month/day filter parts */
export function isoToDateParts(iso: string): {
  year: string;
  month: string;
  day: string;
} {
  const p = parseIso(iso);
  if (!p) return { year: '', month: '', day: '' };
  return {
    year: String(p.y),
    month: String(p.m),
    day: String(p.d),
  };
}

export function datePartsToIso(
  year: string,
  month: string,
  day: string,
): string {
  if (!year || !month || !day) return '';
  return toIso(Number(year), Number(month), Number(day));
}
