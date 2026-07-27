"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";

type CheckoutCustomerData = {
  name: string;
  phone: string;
};

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customerData: CheckoutCustomerData) => void;
};

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { cartTotal } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validatePhone = (phoneNum: string) => {
    // Basic validation for Moroccan phone numbers:
    // Should start with 06, 07 or +212 followed by 8 or 9 digits
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

    setIsSubmitting(true);
    
    // Simulate API delay, actual API call will happen in Upsell/Thank You flow
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess({ name, phone: phone.replace(/\s/g, "") });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative" dir="rtl">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#1C1412] mb-2 text-center">إتمام الطلب</h2>
          <p className="text-sm text-gray-500 text-center mb-6">الدفع عند الاستلام - الشحن مجاني لجميع مدن المغرب</p>

          {/* Social Proof / Urgency */}
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm font-medium">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            أسرعي! العرض ينتهي قريباً والكمية محدودة جداً.
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="الاسم والنسب"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C45B6A] focus:border-[#C45B6A] outline-none transition-all text-right"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 0612345678"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C45B6A] focus:border-[#C45B6A] outline-none transition-all text-left"
                dir="ltr"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <div className="border-t border-gray-100 pt-4 mt-2">
              <div className="flex justify-between items-center mb-4 text-lg font-bold">
                <span>المجموع الإجمالي:</span>
                <span className="text-[#C45B6A]">{cartTotal} درهم</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C45B6A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#a64d5a] transition-colors disabled:opacity-70 shadow-lg shadow-red-200"
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
