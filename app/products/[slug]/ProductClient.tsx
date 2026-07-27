"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "../../../context/CartContext";
import BeforeAfterSlider from "../../../components/BeforeAfterSlider";
import { useInView } from "../../../lib/useInView";
import type { Product } from "../../../lib/products";

function FadeIn({
  children,
  delay = 0,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      {...props}
      className={`transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const reviews = [
  {
    name: "أسماء، الدار البيضاء",
    text: "منتج رائع جداً، شعري أصبح ناعماً وهادئاً منذ أول استخدام! ما توقعتش هكذا.",
    stars: 5,
  },
  {
    name: "خديجة، فاس",
    text: "جودة احترافية بسعر معقول. الدفع عند الاستلام أعطاني ثقة كاملة. نوصي به!",
    stars: 5,
  },
  {
    name: "مريم، أكادير",
    text: "أفضل منتج شريتو على النت. التوصيل كان سريع جداً والتغليف فاخر كهدية.",
    stars: 5,
  },
];

const resultImage = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&q=90";

export default function ProductClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  const bundleOptions = [
    {
      label: "قطعة واحدة",
      sub: "الخيار الأساسي",
      price: product.price1,
      qty: 1,
      highlight: false,
    },
    {
      label: "قطعتين — الأكثر طلباً 🔥",
      sub: `وفري ${product.price1 * 2 - product.price2} درهم (هدية مثالية)`,
      price: product.price2,
      qty: 2,
      highlight: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ══ Product Hero ══ */}
      <section className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Images */}
          <div className="sticky top-24 space-y-3" dir="ltr">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#F7F1EC] shadow-lg">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-4 transition-all duration-500"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-[#C45B6A] scale-95"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="text-right space-y-6" dir="rtl">
            {product.tag && (
              <span className="inline-block bg-[#C45B6A] text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md shadow-red-200">
                {product.tag}
              </span>
            )}

            <div>
              <h1 className="text-3xl md:text-4xl font-black text-[#1C1412] leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-[#C4A484] font-semibold text-lg">{product.tagline}</p>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-yellow-400 text-2xl">{"★".repeat(product.stars)}</span>
              <span className="text-gray-500 text-sm">({product.reviewCount} تقييم)</span>
              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                ✅ موثق
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed text-base">{product.description}</p>

            {/* Features */}
            <div className="bg-[#F7F1EC] rounded-2xl p-5">
              <h3 className="font-black text-lg mb-4">مزايا المنتج</h3>
              <ul className="space-y-2.5">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-3 items-center text-gray-700 text-sm">
                    <span className="w-5 h-5 bg-[#C45B6A] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Urgency */}
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <span className="relative flex h-3 w-3 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
              </span>
              <p className="text-amber-800 font-bold text-sm">
                تبقى عدد محدود في المخزون — أكثر من 37 شخص يتصفح هذا المنتج الآن!
              </p>
            </div>

            {/* Bundle Picker */}
            <div ref={ctaRef} className="space-y-3">
              <h3 className="font-black text-xl text-[#1C1412]">اختاري عرضك:</h3>
              {bundleOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: opt.price,
                      quantity: opt.qty,
                      image: product.images[0],
                    })
                  }
                  className={`w-full text-right p-5 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden ${
                    opt.highlight
                      ? "border-[#1C1412] bg-[#1C1412] text-white hover:bg-[#C45B6A] hover:border-[#C45B6A]"
                      : "border-gray-200 hover:border-[#C45B6A] hover:bg-[#F7F1EC]"
                  }`}
                >
                  {opt.highlight && (
                    <span className="absolute top-0 left-0 bg-[#C45B6A] text-white text-[10px] font-black px-3 py-1 rounded-br-xl">
                      الأكثر طلباً
                    </span>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <div>
                      <p className={`font-black text-lg ${opt.highlight ? "text-white" : "text-[#1C1412]"}`}>
                        {opt.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${opt.highlight ? "text-white/70" : "text-gray-400"}`}>
                        {opt.sub}
                      </p>
                    </div>
                    <span className={`font-black text-2xl ${opt.highlight ? "text-white" : "text-[#C45B6A]"}`}>
                      {opt.price}{" "}
                      <span className="text-sm font-medium">د.م</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
              {[
                ["💵", "دفع عند الاستلام"],
                ["🚚", "توصيل مجاني"],
                ["🔒", "ضمان الجودة"],
              ].map(([icon, label]) => (
                <div key={label} className="text-center py-3 bg-gray-50 rounded-xl">
                  <p className="text-xl mb-1">{icon}</p>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ Before/After ══ */}
      <section className="bg-[#F7F1EC] py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <FadeIn className="space-y-6 text-right" dir="rtl">
            <span className="text-xs font-bold tracking-widest text-[#C45B6A] uppercase">
              التقنية وراء النتائج
            </span>
            <h2 className="text-3xl font-black text-[#1C1412]">العلم يتكلم. الشعر يتحدث.</h2>
            <p className="text-gray-600 leading-relaxed">
              تقنية الأيونات السلبية تعمل على تكسير جزيئات الماء لتغلغل عميق في ألياف الشعر،
              مما يقلل التجعد بنسبة 70% ويمنح لمعاناً طبيعياً يدوم طويلاً.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                ["70%", "تقليل التجعد"],
                ["60%", "توفير الوقت"],
                ["CMC", "معتمد رسمياً"],
              ].map(([v, l]) => (
                <div key={l} className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <p className="text-2xl font-black text-[#C45B6A]">{v}</p>
                  <p className="text-xs text-gray-500 mt-1">{l}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <BeforeAfterSlider
              src={resultImage}
              beforeLabel="قبل الاستخدام"
              afterLabel="بعد الاستخدام ✨"
            />
          </FadeIn>
        </div>
      </section>

      {/* ══ Reviews ══ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="flex justify-center gap-1 text-yellow-400 text-3xl mb-2">★★★★★</div>
              <h2 className="text-3xl font-black text-[#1C1412]">تجارب زبناؤنا الحقيقيون</h2>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <FadeIn key={r.name} delay={i * 100}>
                <div className="bg-[#F7F1EC] rounded-2xl p-6 text-right border border-gray-100">
                  <div className="text-yellow-400 text-xl mb-3">{"★".repeat(r.stars)}</div>
                  <p className="text-gray-700 mb-5">«{r.text}»</p>
                  <div className="flex items-center justify-end gap-3">
                    <div>
                      <p className="font-bold text-[#1C1412] text-sm">{r.name}</p>
                      <p className="text-xs text-green-600 font-medium">✅ عملية شراء مؤكدة</p>
                    </div>
                    <div className="w-9 h-9 bg-[#C45B6A]/20 rounded-full flex items-center justify-center text-[#C45B6A] font-black">
                      {r.name[0]}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Bottom CTA ══ */}
      <section className="py-16 bg-[#1C1412] text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black mb-3">جاهزة؟ الكمية محدودة 🔥</h2>
          <p className="text-gray-400 mb-8">
            الدفع عند الاستلام — لا مخاطرة، توصيل مجاني لكل المغرب
          </p>
          <button
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price1,
                quantity: 1,
                image: product.images[0],
              })
            }
            className="bg-[#C45B6A] text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-[#a64d5a] transition-all shadow-2xl shadow-red-900/30 hover:scale-105"
          >
            اطلبي الآن — {product.price1} درهم
          </button>
        </div>
      </section>

      {/* ══ Sticky CTA (mobile) ══ */}
      {isSticky && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white border-t border-gray-200 shadow-2xl md:hidden"
          dir="rtl"
        >
          <div className="flex gap-3 items-center">
            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price1,
                  quantity: 1,
                  image: product.images[0],
                })
              }
              className="flex-1 bg-[#C45B6A] text-white py-4 rounded-xl font-black text-lg hover:bg-[#a64d5a] transition-colors shadow-lg"
            >
              اطلبي الآن — {product.price1} د.م
            </button>
            <div className="text-right text-xs text-gray-500">
              <p className="font-bold text-[#1C1412]">توصيل مجاني</p>
              <p>دفع عند الاستلام</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
