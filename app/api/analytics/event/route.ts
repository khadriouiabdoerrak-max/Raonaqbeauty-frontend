import { NextResponse } from 'next/server';
import { getBackendUrl } from '@/lib/backend';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  const limited = rateLimit(request, 'analytics', 120, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { detail: 'Too many events' },
      {
        status: 429,
        headers: { 'Retry-After': String(limited.retryAfter) },
      },
    );
  }

  const payload = await request.text();
  if (payload.length > 4_000) {
    return NextResponse.json({ detail: 'Payload trop grand' }, { status: 413 });
  }

  try {
    const upstream = await fetch(`${getBackendUrl()}/api/v1/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      cache: 'no-store',
    });
    const body = await upstream.text();
    return new NextResponse(body || '{"ok":true}', {
      status: upstream.status,
      headers: {
        'Content-Type':
          upstream.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
