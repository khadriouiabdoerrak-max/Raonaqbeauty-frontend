import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/backend";

export async function POST(request: Request) {
  const token =
    request.headers.get("x-admin-token") ||
    new URL(request.url).searchParams.get("token") ||
    "";

  if (!token) {
    return NextResponse.json({ detail: "Token requis" }, { status: 401 });
  }

  try {
    const body = await request.text();
    const response = await fetch(
      `${getBackendUrl()}/api/v1/admin/couriers/ozonexpress/config`,
      {
        method: "POST",
        headers: {
          "X-Admin-Token": token,
          "Content-Type": "application/json",
        },
        body: body || "{}",
        cache: "no-store",
      },
    );
    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json({ detail: "Backend injoignable." }, { status: 502 });
  }
}
