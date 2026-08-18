import { NextResponse } from 'next/server';
import { getBackendUrl } from '@/lib/backend';

export async function GET(request: Request) {
  const token =
    request.headers.get('x-admin-token') ||
    new URL(request.url).searchParams.get('token') ||
    '';
  if (!token) {
    return NextResponse.json({ detail: 'رمز الدخول مطلوب' }, { status: 401 });
  }

  const period = new URL(request.url).searchParams.get('period') || 'today';
  const calendar = new URL(request.url).searchParams.get('calendar') || '';
  const qs = new URLSearchParams({ period });
  if (calendar) qs.set('calendar', calendar);

  try {
    const response = await fetch(
      `${getBackendUrl()}/api/v1/admin/insights?${qs}`,
      {
        headers: { 'X-Admin-Token': token },
        cache: 'no-store',
      },
    );
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
