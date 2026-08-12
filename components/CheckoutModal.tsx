"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { MOROCCO_CITIES } from "../lib/contact";
import { trackInitiateCheckout } from "../lib/pixels";
import { createOrder, type CreatedOrder } from "../lib/orders";

type CheckoutCustomerData = {
  name: string;
  phone: string;
  city: string;
  address: string;
};

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customerData: CheckoutCustomerData, order: CreatedOrder) => void;
};

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { cart, cartTotal } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const checkoutTracked = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      checkoutTracked.current = false;
      return;
    }
    if (checkoutTracked.current || cart.length === 0) return;
    checkoutTracked.current = true;
    trackInitiateCheckout(
      cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      cartTotal
    );
  }, [isOpen, cart, cartTotal]);

  if (!isOpen) return null;

  const validatePhone = (phoneNum: string) => {
    const regex = /^(?:(?:\+|00)212|0)[67]\d{8}$/;
    return regex.test(phoneNum.replace(/\s/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("الرجاء إدخال الاسم الكامل");
      return;
    }

    if (!validatePhone(phone)) {
      setError("الرجاء إدخال رقم هاتف مغربي صحيح (مثال: 0612345678)");
      return;
    }

    if (!city) {
      setError("الرجاء اختيار المدينة");
      return;
    }

    if (address.trim().length < 5) {
      setError("الرجاء إدخال العنوان الكامل للتوصيل");
      return;
    }

    if (cart.length === 0) {
      setError("السلة فارغة");
      return;
    }

    setIsSubmitting(true);

    try {
      const customer = {
        name: name.trim(),
        phone: phone.replace(/\s/g, ""),
        city,
        address: address.trim(),
      };

      const order = await createOrder({
        ...customer,
        cart,
        total: cartTotal,
        acceptedUpsell: false,
      });

      onSuccess(customer, order);
    } catch (err) {
      console.error(err);
      setError("ما تسجلاتش الطلبية. عاودي المحاولة أو تواصلي معنا عبر واتساب.");
      setIsSubmitting(false);
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-[#1C1412]/12 bg-white px-4 py-3 text-right outline-none transition-all focus:border-rosewood focus:ring-2 focus:ring-rosewood/25";

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-[#1C1412]/55 sm:p-4 backdrop-blur-sm">
      <div
        className="relative max-h-[92vh] sm:max-h-[90vh] w-full sm:max-w-md overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-champagne/25 bg-white shadow-2xl"
        dir="rtl"
      >
        {/* مقبض السحب — موبايل فقط */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-[#1C1412]/20" />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 z-10 rounded-xl bg-pearl-blush p-2 text-warm-black/50 transition-colors hover:text-warm-black"
          aria-label="إغلاق"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <p className="text-center text-sm font-black tracking-[0.2em] text-champagne">رونق</p>
          <h2 className="mt-1 text-center text-2xl font-black text-warm-black">إتمام الطلب</h2>
          <p className="mt-2 text-center text-sm font-medium text-warm-black/55">
            خلصي عند الباب بعد ما تقلبي · توصيل مجاني
          </p>

          {/* ملخص السلة */}
          <div className="mt-5 space-y-2 rounded-xl border border-champagne/25 bg-pearl-blush p-3">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1 text-right">
                  <p className="truncate text-sm font-black text-warm-black">{item.name}</p>
                  <p className="text-[11px] font-bold text-warm-black/45">× {item.quantity}</p>
                </div>
                <p className="shrink-0 text-sm font-black text-rosewood">
                  {item.price * item.quantity} د.م
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            <div>
              <label className="mb-1 block text-sm font-bold text-warm-black">الاسم الكامل</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="الاسم والنسب"
                autoComplete="name"
                className={fieldClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-warm-black">رقم الهاتف</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 0612345678"
                autoComplete="tel"
                className={`${fieldClass} text-left`}
                dir="ltr"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-warm-black">المدينة</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className={fieldClass}>
                <option value="">اختاري مدينتك</option>
                {MOROCCO_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-warm-black">العنوان الكامل</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="الحي، الشارع، رقم المنزل أو أقرب معلم"
                rows={2}
                className={`${fieldClass} resize-none`}
              />
            </div>

            {error && (
              <p className="rounded-xl border border-rosewood/30 bg-pearl-blush px-3 py-2 text-sm font-bold text-rosewood">
                {error}
              </p>
            )}

            <div className="border-t border-[#1C1412]/08 pt-4">
              <div className="mb-4 flex items-center justify-between text-lg font-black">
                <span className="text-warm-black">المجموع</span>
                <span className="text-rosewood">{cartTotal} د.م</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-block btn-lg disabled:opacity-70"
              >
                {isSubmitting ? "جاري تسجيل الطلب..." : "أكّدي الطلب — خلصي عند الباب"}
              </button>
              <p className="mt-3 text-center text-[11px] font-medium text-warm-black/45">
                الطلب كيتسجّل دابا · الليفور كيستنى حتى تقلبي
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
