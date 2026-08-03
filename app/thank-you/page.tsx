"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";
import { trackPurchase, type LastPurchase, type PixelContent } from "../../lib/pixels";
import { getWhatsAppLink } from "../../lib/contact";
import { clearPendingOrder } from "../../lib/orders";

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
    <div className="flex min-h-[80vh] items-center justify-center bg-pearl-blush p-4" dir="rtl">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rosewood text-3xl font-black text-white">
          ✓
        </div>

        <p className="mb-2 text-xl font-black text-champagne">رونق</p>
        <h1 className="mb-2 text-3xl font-black text-warm-black">تم تأكيد طلبك</h1>
        {orderId && (
          <p className="mb-4 text-sm font-black text-rosewood">رقم الطلب: {orderId}</p>
        )}
        <p className="mb-8 leading-relaxed text-warm-black/55">
          شكراً لثقتك فـ رونق. فريقنا غادي يتصل بيك قريباً باش نأكدو التوصيل.
          <br />
          <span className="font-bold text-warm-black">خلي الهاتف مفتوح.</span>
        </p>

        <div className="mb-8 border border-champagne/25 bg-white p-6 text-right">
          <h3 className="mb-4 text-lg font-black text-warm-black">شنو غادي يوقع؟</h3>
          <ul className="space-y-4 text-sm text-warm-black/60">
            <li className="flex gap-3">
              <span className="font-black text-rosewood">1</span>
              <span>اتصال قصير لتأكيد الطلب والعنوان</span>
            </li>
            <li className="flex gap-3">
              <span className="font-black text-rosewood">2</span>
              <span>تجهيز وشحن نفس اليوم أو الغد</span>
            </li>
            <li className="flex gap-3">
              <span className="font-black text-rosewood">3</span>
              <span>توصيل مجاني غالباً خلال 24–48 ساعة</span>
            </li>
            <li className="flex gap-3">
              <span className="font-black text-rosewood">4</span>
              <span>تقلبي السلعة قدام الليفور، عاد تخلصي</span>
            </li>
          </ul>
        </div>

        {whatsapp && (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-block btn-lg mb-4 bg-whatsapp text-white hover:brightness-95"
          >
            تواصلي معنا على واتساب
          </a>
        )}

        <Link href="/" className="btn btn-primary btn-block btn-lg">
          رجوع للرئيسية
        </Link>
      </div>
    </div>
  );
}
