'use client';

import { useMemo, useState } from 'react';
import { CHECKOUT_CITIES, cityLabel } from '@/lib/cities';

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  allowCustom?: boolean;
};

export function CitySelect({
  value,
  onChange,
  className = '',
  placeholder = 'اختاري المدينة (OzonExpress)',
  allowCustom = false,
}: Props) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) {
      const majors = CHECKOUT_CITIES.filter((c) =>
        [
          'casablanca',
          'rabat',
          'sale',
          'temara',
          'marrakech',
          'fes',
          'tanger',
          'agadir',
          'meknes',
          'kenitra',
          'oujda',
          'mohammedia',
        ].some((m) => c.value.toLowerCase().includes(m)),
      );
      return majors.length ? majors.slice(0, 80) : CHECKOUT_CITIES.slice(0, 80);
    }
    return CHECKOUT_CITIES.filter(
      (c) =>
        c.label.toLowerCase().includes(needle) ||
        c.value.toLowerCase().includes(needle) ||
        (c.group || '').toLowerCase().includes(needle),
    ).slice(0, 120);
  }, [q]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof CHECKOUT_CITIES>();
    for (const c of filtered) {
      const g = c.group || 'Maroc';
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(c);
    }
    return [...map.entries()];
  }, [filtered]);

  const display = value ? cityLabel(value) : '';

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full p-3.5 border rounded-btn bg-white text-right text-cocoa border-champagne/50"
      >
        {display || (
          <span className="text-muted-brown">{placeholder}</span>
        )}
      </button>
      {open ? (
        <div className="absolute z-50 mt-1 w-full max-h-72 overflow-hidden rounded-xl border border-champagne/40 bg-white shadow-lg">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="بحث — نفس أسماء OzonExpress…"
            className="w-full p-2.5 border-b border-champagne/30 text-right text-sm outline-none"
            dir="ltr"
          />
          <div className="max-h-56 overflow-y-auto text-right">
            {groups.map(([group, cities]) => (
              <div key={group}>
                <p className="px-3 py-1.5 text-[11px] font-bold text-muted-brown bg-[#faf6f1]">
                  {group}
                </p>
                {cities.map((c) => (
                  <button
                    key={`${c.group}-${c.value}`}
                    type="button"
                    onClick={() => {
                      onChange(c.value);
                      setOpen(false);
                      setQ('');
                    }}
                    className={`w-full px-3 py-2 text-sm text-left hover:bg-[#f5efe8] dir-ltr ${
                      value === c.value ? 'font-bold text-[#c45c26]' : ''
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            ))}
            {filtered.length === 0 ? (
              <p className="p-3 text-sm text-muted-brown">ما كايناش نتيجة</p>
            ) : null}
            {allowCustom && q.trim().length >= 2 ? (
              <button
                type="button"
                onClick={() => {
                  onChange(q.trim());
                  setOpen(false);
                  setQ('');
                }}
                className="w-full px-3 py-2 text-sm text-left border-t border-champagne/30 text-[#c45c26] font-bold dir-ltr"
              >
                استعملي «{q.trim()}»
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
