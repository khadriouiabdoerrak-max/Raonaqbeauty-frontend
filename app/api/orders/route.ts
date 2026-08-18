import { NextResponse } from "next/server";
import {
  fetchWithTimeout,
  getServerApiBases,
  shouldTryNextEndpoint,
} from "../../../lib/apiBase";
import { rateLimit } from "../../../lib/rateLimit";

export async function GET() {
  return NextResponse.json({ ok: true, proxy: "orders" });
}

export async function POST(request: Request) {
  const limited = rateLimit(request, "orders", 12, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { detail: "Trop de commandes. Réessaie dans un instant." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfter) },
      }
    );
  }

  const payload = await request.text();
  if (payload.length > 32_000) {
    return NextResponse.json({ detail: "Payload trop grand" }, { status: 413 });
  }

  const headers = { "Content-Type": "application/json" };
  let lastError = "Failed to submit order";

  for (const base of getServerApiBases()) {
    try {
      const upstream = await fetchWithTimeout(`${base}/api/v1/orders/webhook`, {
        method: "POST",
        headers,
        body: payload,
      });
      const body = await upstream.text();

      if (upstream.ok || !shouldTryNextEndpoint(upstream.status)) {
        return new NextResponse(body, {
          status: upstream.status,
          headers: {
            "Content-Type": upstream.headers.get("Content-Type") || "application/json",
          },
        });
      }

      lastError = body || lastError;
    } catch (error) {
      console.error("Order proxy error:", base, error);
      lastError = error instanceof Error ? error.message : lastError;
    }
  }

  return NextResponse.json({ detail: lastError }, { status: 502 });
}
