"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CartItem } from "../../context/CartContext";

type CustomerData = {
  name: string;
  phone: string;
  cart: CartItem[];
  total: number;
};

type OrderItem = {
  product_name: string;
  quantity: number;
  price: number;
};

function readCustomerData(): CustomerData | null {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem("temp_customer_data");
  if (!data) return null;

  try {
    return JSON.parse(data) as CustomerData;
  } catch {
    return null;
  }
}

export default function UpsellPage() {
  const router = useRouter();
  const [customerData] = useState<CustomerData | null>(() => readCustomerData());
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!customerData) {
      router.push("/");
    }
  }, [customerData, router]);

  const submitOrder = async (acceptedUpsell: boolean) => {
    if (!customerData || isProcessing) return;
    setIsProcessing(true);
    setError("");

    const items: OrderItem[] = customerData.cart.map((item) => ({
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    if (acceptedUpsell) {
      items.push({
        product_name: "سيروم العناية بالشعر — Upsell",
        quantity: 1,
        price: 99,
      });
    }

    const payload = {
      customer_name: customerData.name,
      customer_phone: customerData.phone,
      total_price: acceptedUpsell ? customerData.total + 99 : customerData.total,
      accepted_upsell: acceptedUpsell,
      items,
    };

    try {
      const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || "").trim();
      const apiUrl =
        rawApiUrl && !rawApiUrl.includes("easypanel.host")
          ? rawApiUrl.replace(/\/$/, "")
          : "https://Api.raonaqbeauty.com";
      const res = await fetch(`${apiUrl}/api/v1/orders/webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const details = await res.text();
        throw new Error(details || "فشل إرسال الطلب");
      }

      localStorage.removeItem("temp_customer_data");
      router.push("/thank-you");
    } catch (err) {
      console.error("Order submission error:", err);
      setError("ما تسجلاتش الطلبية. عاود المحاولة أو تواصل معنا عبر واتساب.");
      setIsProcessing(false);
    }
  };

  if (!customerData) return null;

  return (
    <div className="min-h-screen bg-[#F7F1EC] flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Top banner */}
        <div className="bg-[#C45B6A] text-white text-center py-3 px-4">
          <p className="font-bold text-sm animate-pulse">⏳ هذا العرض الحصري يختفي بعد إغلاق هذه الصفحة!</p>
        </div>

        <div className="p-6 md:p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1C1412] mb-2">
            تم استلام طلبك يا {customerData.name}! 🎉
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            قبل تأكيد الشحن، لدينا عرض خاص وحصري لك — لمرة واحدة فقط!
          </p>

          {/* Video */}
          <div className="w-full aspect-video bg-[#1C1412] rounded-xl overflow-hidden mb-8 relative shadow-lg">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              src="https://www.w3schools.com/html/mov_bbb.mp4"
            />
            <div className="absolute top-4 right-4 bg-[#C45B6A] text-white px-4 py-1 rounded-full font-bold text-sm animate-pulse">
              حصري — مرة واحدة فقط
            </div>
          </div>

          <div className="bg-[#F7F1EC] rounded-2xl p-6 mb-8 text-right">
            <h2 className="text-xl font-extrabold text-[#1C1412] mb-2">
              أضيفي سيروم العناية بالشعر لطلبك الآن!
            </h2>
            <p className="text-gray-500 text-sm mb-3">
              سيروم مركّز بالكيراتين الطبيعي يُثبّت التصفيف ويُضيف لمعاناً يدوم طوال اليوم.
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#C45B6A]">99 درهم</span>
              <span className="text-gray-400 line-through text-lg">199 درهم</span>
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">توفير 50%</span>
            </div>
          </div>

          {error && (
            <div className="bg-orange-50 text-orange-700 p-3 rounded-xl mb-4 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => submitOrder(true)}
              disabled={isProcessing}
              className="w-full bg-green-500 text-white py-4 rounded-xl font-extrabold text-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-200 disabled:opacity-70"
            >
              {isProcessing ? "جاري تأكيد الطلب..." : "نعم! أضيفي السيروم بـ 99 درهم فقط"}
            </button>

            <button
              onClick={() => submitOrder(false)}
              disabled={isProcessing}
              className="w-full text-gray-400 py-3 font-medium hover:text-gray-600 transition-colors underline text-sm"
            >
              لا شكراً، أكملي طلبي بدون هذا العرض
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
