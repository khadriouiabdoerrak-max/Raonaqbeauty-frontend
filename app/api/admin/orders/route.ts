import { NextResponse } from 'next/server';
import { getBackendUrl } from '@/lib/backend';

function adminTokenFrom(request: Request): string {
  return (
    request.headers.get('x-admin-token') ||
    new URL(request.url).searchParams.get('token') ||
    ''
  );
}

export async function GET(request: Request) {
  const token = adminTokenFrom(request);
  if (!token) {
    return NextResponse.json({ detail: 'رمز الدخول مطلوب' }, { status: 401 });
  }

  const status = new URL(request.url).searchParams.get('status');
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';

  try {
    const response = await fetch(`${getBackendUrl()}/api/v1/admin/orders${qs}`, {
      headers: { 'X-Admin-Token': token },
      cache: 'no-store',
    });
    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return NextResponse.json(
      { detail: 'تعذر الاتصال بالخادم.' },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const token = adminTokenFrom(request);
  if (!token) {
    return NextResponse.json({ detail: 'رمز الدخول مطلوب' }, { status: 401 });
  }

  try {
    const body = await request.text();
    const response = await fetch(`${getBackendUrl()}/api/v1/admin/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': token,
      },
      body: body || '{}',
      cache: 'no-store',
    });
    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return NextResponse.json(
      { detail: 'تعذر الاتصال بالخادم.' },
      { status: 502 },
    );
  }
}
