import { NextResponse } from "next/server";
import {
  fetchWithTimeout,
  getServerApiBases,
  shouldTryNextEndpoint,
} from "../../../lib/apiBase";

export async function GET() {
  return NextResponse.json({ ok: true, proxy: "orders" });
}

export async function POST(request: Request) {
  const payload = await request.text();
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
