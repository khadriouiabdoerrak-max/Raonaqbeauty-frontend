"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "../../../context/CartContext";
import { trackViewContent } from "../../../lib/pixels";
import { products, type Product } from "../../../lib/products";
import { useInView } from "../../../lib/useInView";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function ProductClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const others = products.filter((p) => p.id !== product.id).slice(0, 3);
  const save2 = product.price1 * 2 - product.price2;

  useEffect(() => {
    trackViewContent({
      id: product.id,
      name: product.name,
      price: product.price1,
    });
  }, [product.id, product.name, product.price1]);

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
      label: "قطعتين",
      sub: `وفّري ${save2} درهم — مثالية ليك ولصاحبتك`,
      price: product.price2,
      qty: 2,
      highlight: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="sticky top-24 space-y-3" dir="ltr">
            <div className="aspect-square overflow-hidden bg-pearl-blush">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-4 transition-all duration-500"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square overflow-hidden border-2 transition-all ${
                    selectedImage === i ? "border-rosewood" : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          </div>

          <div className="text-right space-y-6" dir="rtl">
            {product.tag && (
              <span className="inline-block bg-rosewood text-white text-sm font-bold px-4 py-1.5">
                {product.tag}
              </span>
            )}

            <div>
              <p className="text-champagne font-black text-2xl mb-1">رونق</p>
              <h1 className="text-3xl md:text-4xl font-black text-warm-black leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-rosewood font-semibold text-lg">{product.tagline}</p>
              <p className="text-sm text-gray-400 mt-1">{product.modelNote}</p>
            </div>

            <div className="space-y-3">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              <p className="rounded-3xl bg-pearl-blush p-4 text-sm font-bold leading-relaxed text-warm-black/70">
                {product.cardCopy}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-pearl-blush p-4">
                <p className="text-xs font-black text-rosewood mb-1">الأحسن لـ</p>
                <p className="text-sm font-bold text-warm-black">{product.bestFor}</p>
              </div>
              <div className="bg-pearl-blush p-4">
                <p className="text-xs font-black text-rosewood mb-1">النتيجة</p>
                <p className="text-sm font-bold text-warm-black">{product.result}</p>
              </div>
            </div>

            <div className="bg-pearl-blush p-5">
              <h3 className="font-black text-lg mb-4">مزايا واضحة</h3>
              <ul className="space-y-2.5">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-3 items-center text-gray-700 text-sm">
                    <span className="w-5 h-5 bg-rosewood text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div ref={ctaRef} className="space-y-3">
              <h3 className="font-black text-xl text-warm-black">اختاري عرضك</h3>
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
                  className={`w-full rounded-3xl text-right p-5 border-2 transition-colors ${
                    opt.highlight
                      ? "border-rosewood bg-rosewood text-white hover:bg-rosewood-deep"
                      : "border-champagne/40 hover:border-rosewood hover:bg-pearl-blush"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-black text-lg ${opt.highlight ? "text-white" : "text-warm-black"}`}>
                        {opt.label}
                        {opt.highlight ? " — الأكثر طلباً" : ""}
                      </p>
                      <p className={`text-xs mt-0.5 ${opt.highlight ? "text-white/75" : "text-gray-400"}`}>
                        {opt.sub}
                      </p>
                    </div>
                    <span className={`font-black text-2xl ${opt.highlight ? "text-white" : "text-rosewood"}`}>
                      {opt.price} <span className="text-sm font-medium">د.م</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
              {[
                ["خلصي عند الباب", "بعد ما تقلبي"],
                ["توصيل مجاني", "لكل المغرب"],
                ["24–48 ساعة", "غالباً"],
              ].map(([title, sub]) => (
                <div key={title} className="text-center py-3 bg-gray-50">
                  <p className="text-xs font-black text-warm-black">{title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-pearl-blush py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12" dir="rtl">
          <FadeIn>
            <h2 className="text-3xl font-black text-warm-black mb-6">كيفاش تستعمليها؟</h2>
            <ol className="space-y-4">
              {product.howTo.map((step, i) => (
                <li key={step} className="flex gap-4 items-start">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-rosewood text-white font-black text-sm">
                    {i + 1}
                  </span>
                  <p className="text-gray-700 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </FadeIn>
          <FadeIn delay={120}>
            <h2 className="text-3xl font-black text-warm-black mb-6">شنو فالصندوق؟</h2>
            <ul className="space-y-3 mb-10">
              {product.inBox.map((item) => (
                <li key={item} className="flex gap-3 items-center bg-white p-4 border border-champagne/20">
                  <span className="text-rosewood font-black">·</span>
                  <span className="font-bold text-warm-black">{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-white p-6 border border-champagne/20">
              <p className="text-sm font-black text-rosewood mb-2">وعد رونق</p>
              <p className="text-gray-600 leading-relaxed">
                نتيجة احترافية مع حماية للشعر — كيوصلك الطلب، تقلبيه قدام الليفور، وعاد تخلصي. ما
                كاين حتى دفع مسبق.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {others.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4" dir="rtl">
            <h2 className="text-3xl font-black text-warm-black mb-8 text-center">أدوات أخرى من رونق</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {others.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group border border-champagne/20 hover:border-rosewood transition-colors"
                >
                  <div className="aspect-square bg-pearl-blush">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4 text-right">
                    <p className="font-black text-warm-black">{p.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{p.tagline}</p>
                    <p className="text-rosewood font-black mt-2">{p.price1} د.م</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-warm-black text-white text-center" dir="rtl">
        <div className="container mx-auto px-4">
          <p className="text-champagne text-xl font-black mb-2">رونق</p>
          <h2 className="text-3xl font-black mb-3">{product.name}</h2>
          <p className="text-gray-400 mb-8">
            نتيجة صالون فدارك · حماية للشعر · خلصي عند الباب
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
            className="bg-rosewood text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-rosewood-deep transition-colors"
          >
            أضيفي للسلة — {product.price1} د.م
          </button>
        </div>
      </section>

      {isSticky && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white border-t border-gray-200 md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]" dir="rtl">
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
              className="flex-1 bg-rosewood text-white py-3.5 rounded-xl font-black text-base hover:bg-rosewood-deep transition-colors"
            >
              اطلبي — {product.price1} د.م
            </button>
            <div className="text-right text-xs text-gray-500 leading-tight">
              <p className="font-bold text-warm-black">توصيل مجاني</p>
              <p>خلصي عند الباب</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
