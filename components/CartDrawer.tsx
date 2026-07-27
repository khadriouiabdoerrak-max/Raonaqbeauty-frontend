"use client";

import { useCart, type CartItem } from "../context/CartContext";
import { useState } from "react";
import CheckoutModal from "./CheckoutModal";
import { useRouter } from "next/navigation";

type CheckoutCustomerData = {
  name: string;
  phone: string;
};

export type StoredCustomerData = CheckoutCustomerData & {
  cart: CartItem[];
  total: number;
};

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const router = useRouter();

  if (!isCartOpen) return null;

  const handleCheckoutSuccess = (customerData: CheckoutCustomerData) => {
    // إغلاق النوافذ
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    
    // حفظ بيانات العميل مؤقتاً في localStorage لاستخدامها في صفحة Upsell/Thank You
    const storedCustomerData: StoredCustomerData = {
      ...customerData,
      cart,
      total: cartTotal,
    };
    localStorage.setItem("temp_customer_data", JSON.stringify(storedCustomerData));

    // التوجيه إلى صفحة العرض الإضافي (Upsell)
    router.push("/upsell");
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div 
        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-[#1C1412]">سلة المشتريات</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-900 bg-gray-100 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="font-medium text-lg">السلة فارغة حالياً</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 bg-gray-50 p-3 rounded-xl">
                <div className="w-20 h-20 bg-white rounded-lg flex-shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[#1C1412] text-sm">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-3 bg-white rounded-lg px-2 py-1 border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-500 font-bold px-1"
                      >-</button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-500 font-bold px-1"
                      >+</button>
                    </div>
                    <p className="font-bold text-[#C45B6A]">{item.price * item.quantity} درهم</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-4 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">المجموع:</span>
              <span className="text-2xl font-bold text-[#1C1412]">{cartTotal} درهم</span>
            </div>
            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full bg-[#C45B6A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#a64d5a] transition-colors shadow-lg shadow-red-200"
            >
              إتمام الطلب والدفع عند الاستلام
            </button>
          </div>
        )}
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        onSuccess={handleCheckoutSuccess}
      />
    </>
  );
}
