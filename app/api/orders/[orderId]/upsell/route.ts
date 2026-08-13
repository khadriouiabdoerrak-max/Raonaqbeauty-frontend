import { NextResponse } from "next/server";
import {
  fetchWithTimeout,
  getServerApiBases,
  shouldTryNextEndpoint,
} from "../../../../lib/apiBase";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const payload = await request.text();
  const headers = { "Content-Type": "application/json" };
  let lastError = "Failed to attach upsell";

  for (const base of getServerApiBases()) {
    try {
      const upstream = await fetchWithTimeout(
        `${base}/api/v1/orders/${orderId}/upsell`,
        {
          method: "POST",
          headers,
          body: payload,
        }
      );
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
      console.error("Upsell proxy error:", base, error);
      lastError = error instanceof Error ? error.message : lastError;
    }
  }

  return NextResponse.json({ detail: lastError }, { status: 502 });
}
