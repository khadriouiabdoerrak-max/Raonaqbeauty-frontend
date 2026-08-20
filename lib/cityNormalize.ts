/** Merge city spellings into Ozone metro hubs (Casablanca + all branches = 1). */

export type CityCount = { city: string; count: number };

/**
 * Big hubs — any Ozone quartier / suburb that mentions these
 * counts as ONE city in rankings (same idea as OzonExpress metro).
 * Longer keys first.
 */
const METROS: { keys: string[]; label: string }[] = [
  {
    keys: [
      'casablanca',
      'casa blanca',
      'الدار البيضاء',
      'دار البيضاء',
      'الدارالبيضاء',
      'دارالبيضاء',
      'الدار البيضا',
      'دار البيضا',
    ],
    label: 'Casablanca',
  },
  {
    keys: ['marrakech', 'marrakesh', 'مراكش'],
    label: 'Marrakech',
  },
  {
    keys: ['mohammedia', 'المحمدية', 'المحمديه'],
    label: 'Mohammedia',
  },
  {
    keys: ['beni mellal', 'beni-mellal', 'بني ملال'],
    label: 'Beni Mellal',
  },
  {
    keys: ['el jadida', 'الجديدة', 'الجديده'],
    label: 'El Jadida',
  },
  {
    keys: ['ksar el kebir', 'القصر الكبير'],
    label: 'Ksar El Kebir',
  },
  {
    keys: ['ouarzazate', 'ورزازات'],
    label: 'Ouarzazate',
  },
  {
    keys: ['khouribga', 'خريبكة', 'خريبكه'],
    label: 'Khouribga',
  },
  {
    keys: ['berrechid', 'برشيد'],
    label: 'Berrechid',
  },
  {
    keys: ['kenitra', 'kénitra', 'القنيطرة', 'القنيطره'],
    label: 'Kénitra',
  },
  {
    keys: ['tetouan', 'tétouan', 'تطوان'],
    label: 'Tétouan',
  },
  {
    keys: ['temara', 'témara', 'تمارة', 'تماره'],
    label: 'Témara',
  },
  {
    keys: ['larache', 'العرائش'],
    label: 'Larache',
  },
  {
    keys: ['rabat', 'الرباط'],
    label: 'Rabat',
  },
  {
    keys: ['tanger', 'tangier', 'طنجة'],
    label: 'Tanger',
  },
  {
    keys: ['agadir', 'أكادير', 'اكادير'],
    label: 'Agadir',
  },
  {
    keys: ['meknes', 'meknès', 'مكناس'],
    label: 'Meknès',
  },
  {
    keys: ['oujda', 'وجدة'],
    label: 'Oujda',
  },
  {
    keys: ['settat', 'سطات'],
    label: 'Settat',
  },
  {
    keys: ['nador', 'الناظور', 'الناضور'],
    label: 'Nador',
  },
  {
    keys: ['safi', 'آسفي', 'اسفي'],
    label: 'Safi',
  },
  {
    keys: ['fes', 'fez', 'fès', 'فاس'],
    label: 'Fès',
  },
  {
    keys: ['sale', 'salé', 'سلا'],
    label: 'Salé',
  },
  // short casa last (avoid false positives elsewhere)
  { keys: ['casa'], label: 'Casablanca' },
];

/** Extra suburb tokens that belong to Casablanca even without the word. */
const CASA_SUBURBS = [
  'bournazel',
  'lahraouyine',
  'tacharouk',
  'ain sebaa',
  'ain sbaa',
  'ain chock',
  'ain diab',
  'sidi moumen',
  'sidi maarouf',
  'sidi othmane',
  'hay hassani',
  'hay mohammadi',
  'bernoussi',
  'roches noires',
  'lissasfa',
  'maarif',
  'oulfa',
  'sbata',
  'anfa',
  'bourgogne',
  'californie',
  'derb sultan',
  'derb omar',
  '2 mars',
  'ain borja',
  'moulay rachid',
  'mediouna',
  'tit mellil',
  'nouaceur',
  'bouskoura',
  'dar bouazza',
];

function fold(text: string): string {
  return (text || '')
    .normalize('NFKC')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/ـ/g, '')
    .replace(/ة/g, 'ه')
    .replace(/[–—]/g, '-')
    .replace(/[\u200f\u200e]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function matchMetro(key: string): string | undefined {
  for (const metro of METROS) {
    for (const k of metro.keys) {
      const fk = fold(k);
      if (!fk) continue;
      if (key === fk) return metro.label;
      if (key.includes(fk)) return metro.label;
      // "quartier-casablanca" / "casablanca - maarif"
      if (key.endsWith(`-${fk}`) || key.startsWith(`${fk}-`) || key.startsWith(`${fk} `)) {
        return metro.label;
      }
    }
  }
  // Known Casa quartiers without the word Casablanca
  for (const sub of CASA_SUBURBS) {
    if (key === sub || key.includes(sub)) return 'Casablanca';
  }
  return undefined;
}

/**
 * Map any free-text / Ozone city name → one metro label for rankings.
 * Example: "Casablanca – Maarif", "Bournazel-casablanca", "الدار البيضاء" → Casablanca
 */
export function ozoneMetroLabel(raw: string | null | undefined): string {
  const s = (raw || '').replace(/\s+/g, ' ').trim();
  if (!s) return '—';
  const key = fold(s);
  const metro = matchMetro(key);
  if (metro) return metro;

  // "Something - ParentCity" where parent is unknown: keep left/right intelligently
  const dash = key.split(/\s*-\s*/).map((p) => p.trim()).filter(Boolean);
  if (dash.length >= 2) {
    const right = matchMetro(dash[dash.length - 1]);
    if (right) return right;
    const left = matchMetro(dash[0]);
    if (left) return left;
  }

  // Title-case latin free text
  if (/^[\x00-\x7F]+$/.test(s)) {
    return s
      .split(/[\s-]+/)
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(' ');
  }
  return s;
}

export function cityBucket(raw: string | null | undefined): [string, string] {
  const label = ozoneMetroLabel(raw);
  return [fold(label), label];
}

/** Merge duplicate / quartier rows into Ozone metros. */
export function mergeTopCities(
  rows: CityCount[] | null | undefined,
  limit = 8,
): CityCount[] {
  const map = new Map<string, { label: string; count: number }>();
  for (const row of rows || []) {
    const [key, label] = cityBucket(row.city);
    const n = Number(row.count) || 0;
    const prev = map.get(key);
    if (prev) prev.count += n;
    else map.set(key, { label, count: n });
  }
  return [...map.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((x) => ({ city: x.label, count: x.count }));
}
