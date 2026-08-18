import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const limited = rateLimit(request, "admin-login", 8, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { detail: "Trop de tentatives. Réessaie dans une minute." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfter) },
      }
    );
  }

  try {
    const body = await request.text();
    if (body.length > 4_000) {
      return NextResponse.json({ detail: "Payload trop grand" }, { status: 413 });
    }
    const response = await fetch(`${getBackendUrl()}/api/v1/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body || "{}",
      cache: "no-store",
    });
    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { detail: "تعذر الاتصال بالخادم." },
      { status: 502 }
    );
  }
}
