"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Header */}
      <div className="bg-[#F7F1EC] py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-[#1C1412] mb-3">اتصلي بنا</h1>
        <p className="text-gray-500 text-lg">فريقنا جاهز للمساعدة من الإثنين إلى السبت</p>
      </div>

      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-8">
          <h2 className="text-2xl font-black text-[#1C1412]">تواصلي معنا</h2>
          <p className="text-gray-600 leading-relaxed">
            لديك سؤال عن منتجاتنا؟ تريدين تتبع طلبك؟ أو تحتاجين إلى المساعدة في الاختيار؟ نحن هنا من أجلك.
          </p>

          <div className="space-y-5">
            {[
              { icon: "📞", title: "الهاتف / واتساب", value: "+212 600 000 000" },
              { icon: "📧", title: "البريد الإلكتروني", value: "contact@raonaqbeauty.com" },
              { icon: "📍", title: "المقر", value: "الدار البيضاء، المغرب" },
              { icon: "🕐", title: "أوقات العمل", value: "الإثنين – السبت: 9 صباحاً – 7 مساءً" },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-[#F7F1EC] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-[#1C1412]">{item.title}</p>
                  <p className="text-gray-600">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#F7F1EC] rounded-2xl p-8">
          {submitted ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-2xl font-black text-[#1C1412] mb-2">تم إرسال رسالتك!</h3>
              <p className="text-gray-600">سنتواصل معك في أقرب وقت ممكن.</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-[#1C1412] mb-6">أرسلي رسالة</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#C45B6A] outline-none"
                    placeholder="اسمك الكامل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#C45B6A] outline-none text-left"
                    placeholder="0612345678"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">الرسالة</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#C45B6A] outline-none resize-none"
                    placeholder="كيف يمكننا مساعدتك؟"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#C45B6A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#a64d5a] transition-colors"
                >
                  إرسال الرسالة
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
