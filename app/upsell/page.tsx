"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CartItem } from "../../context/CartContext";
import type { LastPurchase } from "../../lib/pixels";
import { UPSELL } from "../../lib/products";

type CustomerData = {
  name: string;
  phone: string;
  city: string;
  address: string;
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
    if (!customerData) router.push("/");
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
        product_name: UPSELL.name,
        quantity: 1,
        price: UPSELL.price,
      });
    }

    const totalPrice = acceptedUpsell ? customerData.total + UPSELL.price : customerData.total;
    const eventId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `order_${Date.now()}`;

    const payload = {
      customer_name: customerData.name,
      customer_phone: customerData.phone,
      customer_city: customerData.city,
      customer_address: customerData.address,
      total_price: totalPrice,
      accepted_upsell: acceptedUpsell,
      event_id: eventId,
      items,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://Api.raonaqbeauty.com";
      const res = await fetch(`${apiUrl}/api/v1/orders/webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const details = await res.text();
        throw new Error(details || "فشل إرسال الطلب");
      }

      const order = (await res.json()) as { id: number };
      const contents = [
        ...customerData.cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      ];
      if (acceptedUpsell) {
        contents.push({
          id: UPSELL.id,
          name: UPSELL.name,
          price: UPSELL.price,
          quantity: 1,
        });
      }

      const lastPurchase: LastPurchase = {
        orderId: order.id,
        value: totalPrice,
        eventId: eventId || `order_${order.id}`,
        contents,
      };
      sessionStorage.setItem("last_purchase", JSON.stringify(lastPurchase));
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
    <div className="min-h-screen bg-pearl-blush flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-2xl w-full bg-white overflow-hidden border border-champagne/20">
        <div className="bg-warm-black text-white text-center py-3 px-4">
          <p className="font-bold text-sm">طلبك تسجّل — عرض إضافي لمرة واحدة مع هاد الطلب</p>
        </div>

        <div className="p-6 md:p-10 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-warm-black mb-2">
            شكراً {customerData.name}
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            قبل ما نجهّزو الشحن لـ {customerData.city}، تقدري تضيفي رونق لمعان باش تثبّتي اللمعان وتحمي التصفيفة.
          </p>

          <div className="w-full aspect-[16/10] bg-pearl-blush overflow-hidden mb-8 relative">
            <img src={UPSELL.image} alt={UPSELL.name} className="w-full h-full object-cover" />
          </div>

          <div className="bg-pearl-blush p-6 mb-8 text-right">
            <p className="text-champagne font-black text-lg mb-1">رونق</p>
            <h2 className="text-xl font-extrabold text-warm-black mb-2">{UPSELL.name}</h2>
            <p className="text-gray-500 text-sm mb-4">{UPSELL.description}</p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-rosewood">{UPSELL.price} درهم</span>
              <span className="text-gray-400 line-through text-lg">{UPSELL.compareAt} درهم</span>
            </div>
          </div>

          {error && (
            <div className="bg-orange-50 text-orange-700 p-3 rounded-xl mb-4 text-sm font-medium">{error}</div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => submitOrder(true)}
              disabled={isProcessing}
              className="w-full bg-rosewood text-white py-4 rounded-xl font-extrabold text-lg hover:bg-rosewood-deep transition-colors disabled:opacity-70"
            >
              {isProcessing ? "جاري تأكيد الطلب..." : `أضيفي رونق لمعان بـ ${UPSELL.price} درهم`}
            </button>

            <button
              onClick={() => submitOrder(false)}
              disabled={isProcessing}
              className="w-full text-gray-400 py-3 font-medium hover:text-gray-600 transition-colors underline text-sm"
            >
              كمّلي الطلب بدون العرض
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
