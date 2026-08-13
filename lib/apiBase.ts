/** أصل الـ API بدون /api/v1 في الآخر — الوثائق القديمة كانت كتحط المسار مرتين. */
export function normalizeApiBase(raw: string): string {
  return raw.trim().replace(/\/+$/, "").replace(/\/api\/v1$/i, "");
}

export function getPublicApiBase(): string {
  return normalizeApiBase(
    process.env.NEXT_PUBLIC_API_URL || "https://api.raonaqbeauty.com"
  );
}

export function getServerApiBases(): string[] {
  const bases = [
    process.env.API_INTERNAL_URL,
    process.env.API_URL,
    process.env.NEXT_PUBLIC_API_URL,
    "https://api.raonaqbeauty.com",
  ]
    .filter((value): value is string => Boolean(value && value.trim()))
    .map(normalizeApiBase);

  return [...new Set(bases)];
}

export function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = 20000
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...init, signal: controller.signal, cache: "no-store" }).finally(
    () => clearTimeout(timer)
  );
}

export function shouldTryNextEndpoint(status: number): boolean {
  return [404, 405, 502, 503, 504].includes(status);
}
