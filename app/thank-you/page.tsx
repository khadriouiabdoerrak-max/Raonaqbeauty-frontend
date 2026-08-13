"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";
import { trackPurchase, type LastPurchase, type PixelContent } from "../../lib/pixels";
import { getWhatsAppLink } from "../../lib/contact";
import { clearPendingOrder } from "../../lib/orders";
import BrandLogo from "../../components/BrandLogo";

const steps = [
  {
    n: "01",
    title: "تأكيد الطلب",
    text: "غادي نتصلو بيك أو نصيفطو واتساب باش نأكدو الاسم، التيليفون، والعنوان.",
  },
  {
    n: "02",
    title: "التجهيز والشحن",
    text: "كنجهّزو الطلبية نفس اليوم أو الغد، ونصيفطوها لمدينتك.",
  },
  {
    n: "03",
    title: "التوصيل",
    text: "توصيل مجاني لجميع مدن المغرب. غالباً بين 24 و 48 ساعة.",
  },
  {
    n: "04",
    title: "التفقد والدفع",
    text: "الليفور كيستنى عند الباب. تفتحي، تقلبي السلعة، وعاد تخلصي. ما كاين حتى دفع مسبق.",
  },
];

export default function ThankYouPage() {
  const { clearCart } = useCart();
  const tracked = useRef(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    clearCart();
    clearPendingOrder();

    try {
      const raw = sessionStorage.getItem("last_purchase");
      if (!raw) return;
      const purchase = JSON.parse(raw) as LastPurchase;
      setOrderId(purchase.orderId);

      if (tracked.current) return;
      tracked.current = true;

      trackPurchase({
        orderId: purchase.orderId,
        value: purchase.value,
        eventId: purchase.eventId,
        contents: purchase.contents as PixelContent[],
      });
      sessionStorage.removeItem("last_purchase");
    } catch {
      // ignore
    }
  }, [clearCart]);

  const whatsapp = getWhatsAppLink(
    orderId
      ? `مرحباً، بغيت نتأكد من طلبي رقم ${orderId} عند رونق`
      : "مرحباً، بغيت نتأكد من طلبي عند رونق"
  );

  return (
    <div className="bg-pearl-blush" dir="rtl">
      <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
        <div className="mx-auto mb-8 flex h-20 justify-center md:h-24">
          <BrandLogo />
        </div>

        <div className="border border-champagne/25 bg-white px-5 py-10 text-center md:px-10 md:py-12">
          <p className="text-[11px] font-black tracking-[0.28em] text-champagne">RAONAQ BEAUTY</p>
          <h1 className="mt-3 text-3xl font-black leading-tight text-warm-black md:text-4xl">
            طلبك تسجّل
          </h1>
          {orderId && (
            <p className="mt-4 inline-block border border-rosewood/20 bg-pearl-blush px-4 py-2 text-sm font-black text-rosewood">
              رقم التأكيد: {orderId}
            </p>
          )}
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-warm-black/60">
            شكراً لثقتك فـ رونق. هادي خطوات التوصيل — خلي التيليفون مفتوح باش نأكدو معاك.
          </p>
        </div>

        <div className="mt-6 border border-champagne/25 bg-white p-6 md:p-8">
          <h2 className="mb-6 text-right text-lg font-black text-warm-black">شنو غادي يوقع دابا؟</h2>
          <ol className="space-y-5">
            {steps.map((step) => (
              <li key={step.n} className="flex gap-4 text-right">
                <span className="mt-0.5 w-10 shrink-0 text-sm font-black tracking-widest text-rosewood">
                  {step.n}
                </span>
                <div>
                  <p className="font-black text-warm-black">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-warm-black/55">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 border border-champagne/25 bg-warm-black px-6 py-5 text-center text-white">
          <p className="text-sm font-black">تقلبي السلعة قدام الليفور، عاد تخلصي</p>
          <p className="mt-1 text-xs font-medium text-white/55">توصيل مجاني · المغرب كامل</p>
        </div>

        <div className="mt-6 space-y-3">
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-block btn-lg bg-whatsapp text-white hover:brightness-95"
            >
              أكّدي الطلب على واتساب
            </a>
          )}
          <Link href="/" className="btn btn-primary btn-block btn-lg">
            رجوع للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
