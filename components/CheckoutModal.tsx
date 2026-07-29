"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { MOROCCO_CITIES } from "../lib/contact";
import { trackInitiateCheckout } from "../lib/pixels";

type CheckoutCustomerData = {
  name: string;
  phone: string;
  city: string;
  address: string;
};

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customerData: CheckoutCustomerData) => void;
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

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess({
        name: name.trim(),
        phone: phone.replace(/\s/g, ""),
        city,
        address: address.trim(),
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto" dir="rtl">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-warm-black mb-2 text-center">إتمام الطلب</h2>
          <p className="text-sm text-gray-500 text-center mb-6">الدفع عند الاستلام — الشحن مجاني لجميع مدن المغرب</p>

          <div className="bg-pearl-blush text-warm-black p-3 rounded-lg mb-6 text-sm font-medium text-center border border-champagne/30">
            خلصي عند الباب بعد ما تقلبي السلعة — توصيل مجاني
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="الاسم والنسب"
                autoComplete="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rosewood focus:border-rosewood outline-none transition-all text-right"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 0612345678"
                autoComplete="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rosewood focus:border-rosewood outline-none transition-all text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المدينة</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rosewood focus:border-rosewood outline-none transition-all text-right bg-white"
              >
                <option value="">اختاري مدينتك</option>
                {MOROCCO_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">العنوان الكامل</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="الحي، الشارع، رقم المنزل أو أقرب معلم"
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rosewood focus:border-rosewood outline-none transition-all text-right resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <div className="border-t border-gray-100 pt-4 mt-2">
              <div className="flex justify-between items-center mb-4 text-lg font-bold">
                <span>المجموع الإجمالي:</span>
                <span className="text-rosewood">{cartTotal} درهم</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-rosewood text-white py-4 rounded-xl font-bold text-lg hover:bg-rosewood-deep transition-colors disabled:opacity-70 shadow-lg shadow-rosewood/20"
              >
                {isSubmitting ? "جاري التأكيد..." : "تأكيد الطلب الآن"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
