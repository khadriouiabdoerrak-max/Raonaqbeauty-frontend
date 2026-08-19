"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

function pixelId(raw: string | undefined | null): string | null {
  const id = (raw || "").trim();
  if (!id) return null;
  if (/^your[_-]/i.test(id) || /pixel_id/i.test(id)) return null;
  if (!/^[A-Za-z0-9._-]+$/.test(id)) return null;
  return id;
}

type Props = {
  /** Optional SSR/build fallback — runtime /api/pixels wins when present */
  facebookId?: string;
  tiktokId?: string;
  snapId?: string;
};

/**
 * Loads Meta / TikTok / Snap pixels.
 * IDs are fetched from /api/pixels at runtime so EasyPanel env works
 * even when NEXT_PUBLIC_* was empty at Docker build time.
 */
export default function Pixels({ facebookId, tiktokId, snapId }: Props) {
  const [facebook, setFacebook] = useState(() => pixelId(facebookId));
  const [tiktok, setTiktok] = useState(() => pixelId(tiktokId));
  const [snap, setSnap] = useState(() => pixelId(snapId));

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/pixels", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { facebook?: string; tiktok?: string; snap?: string } | null) => {
        if (cancelled || !data) return;
        const fb = pixelId(data.facebook);
        const tt = pixelId(data.tiktok);
        const sn = pixelId(data.snap);
        if (fb) setFacebook(fb);
        if (tt) setTiktok(tt);
        if (sn) setSnap(sn);
      })
      .catch(() => {
        /* keep props fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {facebook ? (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${facebook}');
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}

      {tiktok ? (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('${tiktok}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      ) : null}

      {snap ? (
        <Script id="snap-pixel" strategy="afterInteractive">
          {`
            (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
            {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
            a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
            r.src=n;var u=t.getElementsByTagName(s)[0];
            u.parentNode.insertBefore(r,u);})(window,document,
            'https://sc-static.net/scevent.min.js');
            snaptr('init', '${snap}');
            snaptr('track', 'PAGE_VIEW');
          `}
        </Script>
      ) : null}
    </>
  );
}
