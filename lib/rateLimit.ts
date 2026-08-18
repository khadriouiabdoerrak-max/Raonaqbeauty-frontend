/**
 * Rate limit in-memory (Edge/Node) — protège le BFF sous rafale.
 * Pas partagé entre replicas : le vrai plafond reste aussi côté API.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function clientIp(request: Request): string {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function rateLimit(
  request: Request,
  key: string,
  limit: number,
  windowMs: number
): { ok: true } | { ok: false; retryAfter: number } {
  const ip = clientIp(request);
  const id = `${key}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(id);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(id, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true };
}

/** Évite une Map infinie en mémoire */
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of buckets) {
    if (now >= v.resetAt) buckets.delete(k);
  }
}, 60_000).unref?.();
