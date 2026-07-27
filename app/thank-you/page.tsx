"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "../../context/CartContext";

type PixelWindow = Window & {
  fbq?: (event: string, name: string) => void;
  ttq?: { track: (event: string) => void };
};

export default function ThankYouPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    localStorage.removeItem("temp_customer_data");
    const pixelWindow = window as PixelWindow;

    // FB Pixel Purchase event
    if (pixelWindow.fbq) {
      pixelWindow.fbq("track", "Purchase");
    }
    // TikTok Pixel
    if (pixelWindow.ttq) {
      pixelWindow.ttq.track("PlaceAnOrder");
    }
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F7F1EC]" dir="rtl">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-[#1C1412] mb-3">
          تم تأكيد طلبك بنجاح! 🎉
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          شكراً لثقتك في Raonaq. سيتصل بك فريقنا قريباً لتأكيد التوصيل.
          <br />
          <span className="font-medium text-[#1C1412]">يرجى إبقاء هاتفك مفتوحاً.</span>
        </p>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl p-6 mb-8 text-right border border-gray-100 shadow-sm">
          <h3 className="font-extrabold text-[#1C1412] text-lg mb-4">ماذا سيحدث بعد ذلك؟</h3>
          <ul className="space-y-4">
            {[
              { icon: "📞", text: "سيتصل بك أحد ممثلينا خلال ساعات لتأكيد الطلب" },
              { icon: "📦", text: "يتم تجهيز طلبك وشحنه في نفس اليوم أو الغد" },
              { icon: "🚚", text: "التوصيل مجاني إلى باب منزلك خلال 24-48 ساعة" },
              { icon: "💳", text: "تدفعين فقط حين تستلمين المنتج وتتأكدين منه" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="text-xl shrink-0">{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/"
          className="block bg-[#C45B6A] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#a64d5a] transition-colors w-full shadow-lg shadow-[#C45B6A]/20"
        >
          العودة للصفحة الرئيسية
        </Link>

        <p className="text-xs text-gray-400 mt-4">
          Raonaq Beauty — رونق © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
