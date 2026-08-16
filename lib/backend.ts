import { normalizeApiBase } from "./apiBase";

/** Ancien host EasyPanel public — ne sert plus l’API FastAPI. */
function isDeadBackendHost(url: string): boolean {
  return /toxb9v\.easypanel\.host/i.test(url);
}

/**
 * URL backend pour les routes BFF admin (server-side).
 * Ignore l’ancien host EasyPanel mort pour éviter des 404 au login.
 */
export function getBackendUrl(): string {
  const candidates = [
    process.env.BACKEND_URL,
    process.env.API_INTERNAL_URL,
    process.env.API_URL,
    process.env.NEXT_PUBLIC_API_URL,
    "https://api.raonaqbeauty.com",
  ].filter((value): value is string => Boolean(value && value.trim()));

  for (const raw of candidates) {
    const base = normalizeApiBase(raw);
    if (!base || isDeadBackendHost(base)) continue;
    return base;
  }

  return "https://api.raonaqbeauty.com";
}
