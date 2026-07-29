"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import { trackPurchase, type LastPurchase, type PixelContent } from "../../lib/pixels";
import { getWhatsAppLink } from "../../lib/contact";

export default function ThankYouPage() {
  const { clearCart } = useCart();
  const tracked = useRef(false);

  useEffect(() => {
    clearCart();
    localStorage.removeItem("temp_customer_data");

    if (tracked.current) return;
    tracked.current = true;

    try {
      const raw = sessionStorage.getItem("last_purchase");
      if (!raw) return;
      const purchase = JSON.parse(raw) as LastPurchase;
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

  const whatsapp = getWhatsAppLink("مرحباً، بغيت نتأكد من طلبي عند رونق");

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-pearl-blush" dir="rtl">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <p className="text-champagne text-xl font-black mb-2">رونق</p>
        <h1 className="text-3xl font-extrabold text-warm-black mb-3">تم تأكيد طلبك</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          شكراً لثقتك فـ رونق. غادي توصلك نتيجة احترافية مع حماية للشعر — وفريقنا غادي يتصل بيك قريباً باش نأكدو التوصيل.
          <br />
          <span className="font-medium text-warm-black">خلي الهاتف مفتوح.</span>
        </p>

        <div className="bg-white p-6 mb-8 text-right border border-champagne/20">
          <h3 className="font-extrabold text-warm-black text-lg mb-4">شنو غادي يوقع؟</h3>
          <ul className="space-y-4 text-sm text-gray-600">
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
            className="block mb-4 bg-whatsapp text-white px-8 py-4 rounded-xl font-bold text-lg hover:brightness-95 transition-colors w-full"
          >
            تواصلي معنا على واتساب
          </a>
        )}

        <Link
          href="/"
          className="block bg-rosewood text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-rosewood-deep transition-colors w-full"
        >
          رجوع للرئيسية
        </Link>
      </div>
    </div>
  );
}
