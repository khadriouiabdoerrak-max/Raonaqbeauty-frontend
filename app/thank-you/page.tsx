"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";
import { trackPurchase, type LastPurchase, type PixelContent } from "../../lib/pixels";
import { getWhatsAppLink } from "../../lib/contact";
import { clearPendingOrder } from "../../lib/orders";
import { products, productThumb } from "../../lib/products";

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
    text: "الليفور كيستنى عند الباب. تفتحي، تقلبي السلعة، وعاد تخلصي.",
  },
];

function itemImage(id: string) {
  const product = products.find((p) => p.id === id);
  return product ? productThumb(product) : "";
}

export default function ThankYouPage() {
  const { finishOrder } = useCart();
  const tracked = useRef(false);
  const [purchase, setPurchase] = useState<LastPurchase | null>(null);

  useEffect(() => {
    finishOrder();
    clearPendingOrder();

    try {
      const raw = sessionStorage.getItem("last_purchase");
      if (!raw) return;
      const data = JSON.parse(raw) as LastPurchase;
      setPurchase(data);

      if (tracked.current) return;
      tracked.current = true;

      trackPurchase({
        orderId: data.orderId,
        value: data.value,
        eventId: data.eventId,
        contents: data.contents as PixelContent[],
      });
      sessionStorage.removeItem("last_purchase");
    } catch {
      // ignore
    }
  }, [finishOrder]);

  const whatsapp = getWhatsAppLink(
    purchase?.orderId
      ? `مرحباً، بغيت نتأكد من طلبي رقم ${purchase.orderId} عند رونق`
      : "مرحباً، بغيت نتأكد من طلبي عند رونق"
  );

  return (
    <div className="bg-[#F7F1EC]" dir="rtl">
      <section className="relative overflow-hidden bg-[#1C1412] text-white">
        <img
          src="/images/raonaq-lifestyle-home.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_20%] opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-[#1C1412]/85 to-[#1C1412]/60" />

        <div className="relative mx-auto max-w-2xl px-4 py-14 text-center md:py-20">
          <p className="text-[11px] font-black tracking-[0.42em] text-[#C4A484]">RAONAQ</p>
          <p className="mt-2 text-sm font-medium text-white/55">نتيجة صالون فدارك</p>

          <div className="mx-auto mt-7 flex h-16 w-16 items-center justify-center rounded-full border border-[#C4A484]/50 bg-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.4} stroke="currentColor" className="h-7 w-7 text-[#C4A484]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <h1 className="mt-6 text-4xl font-black leading-tight md:text-5xl">طلبك تسجّل</h1>
          {purchase?.orderId && (
            <p className="mt-5 inline-block border border-[#C4A484]/35 bg-white/8 px-5 py-2 text-sm font-black tracking-wide text-[#C4A484]">
              رقم التأكيد · {purchase.orderId}
            </p>
          )}
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/70">
            شكراً لثقتك فـ رونق. خلي التيليفون مفتوح باش نأكدو معاك قبل الشحن.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
        {purchase && purchase.contents.length > 0 && (
          <div className="border border-[#C4A484]/25 bg-white px-5 py-6 md:px-8 md:py-8">
            <p className="text-[11px] font-black tracking-[0.28em] text-[#C45B6A]">ملخص الطلب</p>
            <h2 className="mt-2 text-2xl font-black text-[#1C1412]">هاد الشي اللي غادي يوصلك</h2>

            <div className="mt-6 space-y-3">
              {purchase.contents.map((item) => (
                <div
                  key={`${item.id}-${item.name}`}
                  className="flex items-center gap-3 border border-[#C4A484]/20 bg-[#F7F1EC] p-3"
                >
                  {itemImage(item.id) && (
                    <div className="h-16 w-16 shrink-0 overflow-hidden bg-white">
                      <img src={itemImage(item.id)} alt="" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1 text-right">
                    <p className="truncate font-black text-[#1C1412]">{item.name}</p>
                    <p className="text-xs font-bold text-[#1C1412]/50">× {item.quantity}</p>
                  </div>
                  <p className="shrink-0 text-sm font-black text-[#C45B6A]">
                    {item.price * item.quantity} د.م
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#1C1412]/10 pt-4">
              <span className="text-sm font-bold text-[#1C1412]/55">المجموع · الدفع عند الباب</span>
              <span className="text-2xl font-black text-[#1C1412]">{purchase.value} د.م</span>
            </div>
          </div>
        )}

        <div className="mt-5 border border-[#C4A484]/25 bg-white px-5 py-8 md:px-8 md:py-10">
          <p className="text-[11px] font-black tracking-[0.28em] text-[#C45B6A]">شنو غادي يوقع دابا؟</p>
          <h2 className="mt-2 text-2xl font-black text-[#1C1412]">من التسجيل حتى الباب</h2>

          <ol className="relative mt-8">
            {steps.map((step, i) => (
              <li key={step.n} className="relative flex gap-4 pb-8 last:pb-0">
                {i < steps.length - 1 && (
                  <span className="absolute right-[15px] top-9 h-[calc(100%-12px)] w-px bg-[#C4A484]/30" />
                )}
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C4A484]/40 bg-[#F7F1EC] text-[11px] font-black text-[#C45B6A]">
                  {step.n}
                </span>
                <div>
                  <p className="font-black text-[#1C1412]">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#1C1412]/55">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-5 overflow-hidden bg-[#1C1412] px-6 py-8 text-center text-white">
          <p className="text-[11px] font-black tracking-[0.28em] text-[#C4A484]">وعد رونق</p>
          <p className="mt-3 text-xl font-black md:text-2xl">تفتحي · تقلبي · عاد تخلصي</p>
          <p className="mt-2 text-sm font-medium text-white/55">توصيل مجاني · ما كاين حتى دفع مسبق</p>
        </div>

        <div className="mt-8 space-y-3">
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
