import { NextResponse } from "next/server";

function clean(raw: string | undefined): string {
  const id = (raw || "").trim();
  if (!id || /^your[_-]/i.test(id) || /pixel_id/i.test(id)) return "";
  if (!/^[A-Za-z0-9._-]+$/.test(id)) return "";
  return id;
}

/** Runtime pixel IDs for EasyPanel (not baked at build). */
export async function GET() {
  return NextResponse.json(
    {
      facebook: clean(process.env.FB_PIXEL_ID || process.env.NEXT_PUBLIC_FB_PIXEL_ID),
      tiktok: clean(process.env.TIKTOK_PIXEL_ID || process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID),
      snap: clean(process.env.SNAP_PIXEL_ID || process.env.NEXT_PUBLIC_SNAPCHAT_PIXEL_ID),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
