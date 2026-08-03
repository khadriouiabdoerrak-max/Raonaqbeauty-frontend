"use client";

import { useState } from "react";
import { getWhatsAppDisplay, getWhatsAppLink, getWhatsAppNumber } from "../../lib/contact";
import { SITE } from "../../lib/site";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const whatsappDisplay = getWhatsAppDisplay();
  const whatsappHref = getWhatsAppLink("مرحباً، بغيت نتواصل مع رونق");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = getWhatsAppNumber();
    if (phone) {
      const text = `الاسم: ${form.name}\nالهاتف: ${form.phone}\nالرسالة: ${form.message}`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="bg-pearl-blush py-20 text-center">
        <p className="text-champagne text-xl font-black mb-2">رونق</p>
        <h1 className="text-4xl md:text-5xl font-black text-warm-black mb-3">اتصلي بنا</h1>
        <p className="text-gray-500 text-lg max-w-lg mx-auto">
          سؤال على النتيجة، الحماية، أو الطلب؟ فريقنا جاهز من الإثنين إلى السبت
        </p>
      </div>

      <div className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-16">
        <div className="space-y-8">
          <h2 className="text-2xl font-black text-warm-black">تواصلي معنا</h2>
          <p className="text-gray-600 leading-relaxed">
            سؤال على المنتجات؟ مساعدة فالاختيار بين الحجم والنعومة؟ تتبع طلب؟ حنا هنا — نفس وعد رونق:
            نتيجة احترافية، حماية للشعر، وثقة من الباب.
          </p>

          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-pearl-blush flex items-center justify-center text-sm font-black text-rosewood flex-shrink-0">
                WA
              </div>
              <div>
                <p className="font-bold text-warm-black">الهاتف / واتساب</p>
                {whatsappHref ? (
                  <a href={whatsappHref} className="text-rosewood hover:underline" target="_blank" rel="noopener noreferrer">
                    {whatsappDisplay}
                  </a>
                ) : (
                  <p className="text-gray-500 text-sm">عيّني الرقم فـ إعدادات الموقع (NEXT_PUBLIC_WHATSAPP_NUMBER)</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-pearl-blush flex items-center justify-center text-sm font-black text-rosewood flex-shrink-0">
                @
              </div>
              <div>
                <p className="font-bold text-warm-black">البريد</p>
                <a href={`mailto:${SITE.email}`} className="text-rosewood hover:underline">
                  {SITE.email}
                </a>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-pearl-blush flex items-center justify-center text-sm font-black text-rosewood flex-shrink-0">
                ◇
              </div>
              <div>
                <p className="font-bold text-warm-black">المقر</p>
                <p className="text-gray-600">{SITE.city}</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-pearl-blush flex items-center justify-center text-sm font-black text-rosewood flex-shrink-0">
                ◷
              </div>
              <div>
                <p className="font-bold text-warm-black">أوقات العمل</p>
                <p className="text-gray-600">{SITE.hours}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-pearl-blush p-8 border border-champagne/20">
          {submitted ? (
            <div className="text-center py-10">
              <h3 className="text-2xl font-black text-warm-black mb-2">توصلنا برسالتك</h3>
              <p className="text-gray-600">غادي نجاوبوك ف أقرب وقت — و إلا فتح واتساب كمّلي من تمّا.</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-warm-black mb-6">أرسلي رسالة</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 bg-white focus:ring-2 focus:ring-rosewood outline-none"
                    placeholder="اسمك الكامل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 bg-white focus:ring-2 focus:ring-rosewood outline-none text-left"
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
                    className="w-full px-4 py-3 border border-gray-200 bg-white focus:ring-2 focus:ring-rosewood outline-none resize-none"
                    placeholder="كيفاش نقدروا نعاونوك؟"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                >
                  {whatsappHref ? "إرسال عبر واتساب" : "إرسال الرسالة"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
