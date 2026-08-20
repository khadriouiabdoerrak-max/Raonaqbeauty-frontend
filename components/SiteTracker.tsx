'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/track';

/** Fires page_view on store navigations (skips /admin). */
export default function SiteTracker() {
  const pathname = usePathname();
  const last = useRef('');

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    if (pathname === last.current) return;
    last.current = pathname;
    trackEvent('page_view', { path: pathname });
  }, [pathname]);

  return null;
}
