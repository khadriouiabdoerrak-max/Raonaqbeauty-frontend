/** أسماء قديمة فالـ DB → أسماء الستور الحالية (Raonaq DUO / TRIO…) */
const LEGACY_PRODUCT_ALIASES: [RegExp, string][] = [
  [/رونق\s*تريو|enzo\s*supercare|en-?3311|trio/i, 'Raonaq TRIO'],
  [/air\s*soft|يوجي|yugee|keratin.*brush|رونق\s*إير\s*سوفت|soft/i, 'Raonaq SOFT'],
  [/en-?8220|air\s*pink|إير\s*بينك|jour/i, 'Raonaq JOUR'],
  [/revlon|one-?step|فوليوم|volume/i, 'Raonaq VOLUME'],
  [/سيروم|serum|luma|upsell/i, 'Raonaq LUMA'],
  [/duo|2-?en-?1|لisse.*ondule/i, 'Raonaq DUO'],
  [/\bgo\b|mini\s*styler/i, 'Raonaq GO'],
];

/**
 * يعرض أسماء المنتجات بنفس شكل الستور، حتى للطلبات القديمة.
 * مثال: «رونق تريو — ENZO… x1» → «Raonaq TRIO x1»
 */
export function formatStoreProductLine(raw: string): string {
  if (!raw?.trim()) return '—';
  return raw
    .split('|')
    .map((part) => {
      const chunk = part.trim();
      if (!chunk) return '';
      const qtyMatch = chunk.match(/\s*x(\d+)\s*$/i);
      const qty = qtyMatch ? ` x${qtyMatch[1]}` : '';
      const base = qtyMatch ? chunk.slice(0, qtyMatch.index).trim() : chunk;

      if (/^Raonaq\s+/i.test(base)) {
        return `${base}${qty}`;
      }

      for (const [re, name] of LEGACY_PRODUCT_ALIASES) {
        if (re.test(base)) return `${name}${qty}`;
      }
      return `${base}${qty}`;
    })
    .filter(Boolean)
    .join(' | ');
}
