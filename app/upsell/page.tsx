"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  attachUpsell,
  clearPendingOrder,
  readPendingOrder,
  toLastPurchase,
  type PendingOrder,
} from "../../lib/orders";
import { UPSELL } from "../../lib/products";

export default function UpsellPage() {
  const router = useRouter();
  const [pending] = useState<PendingOrder | null>(() => readPendingOrder());
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pending) router.push("/");
  }, [pending, router]);

  const finish = (acceptedUpsell: boolean, total: number, contents = pending?.cart.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  })) ?? []) => {
    if (!pending) return;

    const finalContents = [...contents];
    if (acceptedUpsell) {
      finalContents.push({
        id: UPSELL.id,
        name: UPSELL.name,
        price: UPSELL.price,
        quantity: 1,
      });
    }

    sessionStorage.setItem(
      "last_purchase",
      JSON.stringify(
        toLastPurchase({
          orderId: pending.orderId,
          eventId: pending.eventId,
          total,
          contents: finalContents,
        })
      )
    );
    clearPendingOrder();
    router.push("/thank-you");
  };

  const continueWithoutUpsell = () => {
    if (!pending || isProcessing) return;
    finish(false, pending.total);
  };

  const acceptUpsell = async () => {
    if (!pending || isProcessing) return;
    setIsProcessing(true);
    setError("");

    try {
      await attachUpsell(pending.orderId, {
        id: UPSELL.id,
        name: UPSELL.name,
        price: UPSELL.price,
      });
      finish(true, pending.total + UPSELL.price);
    } catch (err) {
      console.error(err);
      // الطلب الأصلي أصلاً مسجّل — كمّلي شكراً بلا upsell
      setError("العرض ما تزادش، ولكن طلبك الأصلي مسجّل. غادي نكمّلو.");
      setTimeout(() => finish(false, pending.total), 1200);
    }
  };

  if (!pending) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-pearl-blush p-4" dir="rtl">
      <div className="w-full max-w-2xl overflow-hidden border border-champagne/25 bg-white">
        <div className="bg-warm-black px-4 py-3 text-center text-white">
          <p className="text-sm font-bold">
            طلبك رقم {pending.orderId} تسجّل — عرض إضافي لمرة واحدة
          </p>
        </div>

        <div className="p-6 text-center md:p-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rosewood text-xl font-black text-white">
            ✓
          </div>

          <p className="text-sm font-black tracking-[0.2em] text-champagne">رونق</p>
          <h1 className="mt-2 text-2xl font-black text-warm-black md:text-3xl">
            شكراً {pending.name}
          </h1>
          <p className="mt-3 leading-relaxed text-warm-black/55">
            طلبك لـ {pending.city} مسجّل. قبل الشحن، تقدري تضيفي رونق لمعان باش تثبّتي
            اللمعان.
          </p>

          <div className="relative mb-8 mt-8 aspect-[16/10] overflow-hidden bg-pearl-blush">
            <img src={UPSELL.image} alt={UPSELL.name} className="h-full w-full object-cover" />
          </div>

          <div className="mb-8 bg-pearl-blush p-6 text-right">
            <p className="text-lg font-black text-champagne">رونق</p>
            <h2 className="mt-1 text-xl font-black text-warm-black">{UPSELL.name}</h2>
            <p className="mt-2 text-sm text-warm-black/55">{UPSELL.description}</p>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-rosewood">{UPSELL.price} د.م</span>
              <span className="text-lg text-warm-black/35 line-through">{UPSELL.compareAt} د.م</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rosewood/25 bg-pearl-blush p-3 text-sm font-medium text-rosewood">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={acceptUpsell}
              disabled={isProcessing}
              className="btn btn-primary btn-block btn-lg disabled:opacity-70"
            >
              {isProcessing ? "جاري الإضافة..." : `أضيفي رونق لمعان بـ ${UPSELL.price} د.م`}
            </button>

            <button
              type="button"
              onClick={continueWithoutUpsell}
              disabled={isProcessing}
              className="w-full py-3 text-sm font-medium text-warm-black/45 underline transition-colors hover:text-warm-black"
            >
              كمّلي بدون العرض — الطلب أصلاً مسجّل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
