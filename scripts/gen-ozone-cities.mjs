import fs from 'fs';

const rows = JSON.parse(fs.readFileSync('lib/_ozone_raw.json', 'utf8'));
const lines = [];
lines.push(
  '/** Auto-generated from api.ozonexpress.ma/cities — exact OzonExpress NAME. */',
);
lines.push('export type OzoneCity = { id: number; name: string; ref: string };');
lines.push('');
lines.push('export const OZONE_CITIES: OzoneCity[] = [');
for (const c of rows) {
  lines.push(
    `  { id: ${c.id}, name: ${JSON.stringify(c.name)}, ref: ${JSON.stringify(c.ref)} },`,
  );
}
lines.push('];');
lines.push('');
lines.push(
  'export type CheckoutCity = { value: string; label: string; group?: string };',
);
lines.push('');
lines.push('function cityGroup(name: string): string {');
lines.push('  const n = name.toLowerCase();');
lines.push(
  '  if (n.includes("casablanca") || n.startsWith("casa ")) return "Casablanca";',
);
lines.push('  return "Maroc";');
lines.push('}');
lines.push('');
lines.push(
  '/** Same names as OzonExpress (value = exact NAME for shipping). */',
);
lines.push('export const CHECKOUT_CITIES: CheckoutCity[] = OZONE_CITIES.map((c) => ({');
lines.push('  value: c.name,');
lines.push('  label: c.name,');
lines.push('  group: cityGroup(c.name),');
lines.push('}));');
lines.push('');
lines.push('export function cityLabel(value: string): string {');
lines.push('  return value || "";');
lines.push('}');
lines.push('');
lines.push('export function ozoneTrackingUrl(tracking: string): string {');
lines.push('  const tn = (tracking || "").trim();');
lines.push('  if (!tn || tn.startsWith("MAN-")) return "";');
lines.push('  return "https://ozonexpress.ma/#tracking";');
lines.push('}');
lines.push('');
lines.push('export const STALE_SHIP_DAYS = 5;');
lines.push('');

fs.writeFileSync('lib/cities.ts', lines.join('\n'), 'utf8');
console.log('wrote lib/cities.ts with', rows.length, 'cities');
