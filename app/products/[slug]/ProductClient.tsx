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
  const [openFaq, setOpenFaq] = useState<number | null>(0);
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
    setSelectedImage(0);
    setOpenFaq(0);
  }, [product.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (ctaRef.current) observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, [product.id]);

  const add = (price: number, qty: number) => {
    addToCart({
      id: product.id,
      name: product.name,
      price,
      quantity: qty,
      image: product.images[0],
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F1EC] pb-24 md:pb-0">
      {/* ═══ HERO — موبايل أولاً ═══ */}
      <section className="relative bg-[#1C1412]">
        <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[5/4] md:aspect-[16/9] md:max-h-[72vh]">
          <img
            src={product.heroImage}
            alt={`${product.name} — نتيجة صالون فدارك`}
            className="h-full w-full object-cover object-[center_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-[#1C1412]/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 pb-6 text-right text-white md:p-10" dir="rtl">
            {product.tag && (
              <span className="mb-3 inline-block bg-[#C45B6A] px-3 py-1 text-[11px] font-black">
                {product.tag}
              </span>
            )}
            <p className="text-lg font-black tracking-[0.12em] text-[#C4A484] md:text-2xl">رونق</p>
            <h1 className="mt-1 text-3xl font-black leading-tight md:text-5xl">{product.name}</h1>
            <p className="mt-2 max-w-md text-sm text-white/80 md:text-base">{product.tagline}</p>
          </div>
        </div>
      </section>

      {/* ═══ سعر + CTA أساسي ═══ */}
      <section className="border-b border-[#1C1412]/8 bg-white" dir="rtl">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black text-[#1C1412]/45">السعر</p>
              <p className="text-4xl font-black text-[#C45B6A]">
                {product.price1}
                <span className="mr-1 text-base font-bold">د.م</span>
              </p>
              <p className="mt-1 text-xs font-bold text-[#1C1412]/55">خلصي عند الباب بعد ما تقلبي</p>
            </div>
            <p className="max-w-[10rem] text-left text-[11px] font-bold leading-relaxed text-[#1C1412]/55 md:max-w-xs md:text-sm">
              {product.promise}
            </p>
          </div>

          <div ref={ctaRef} className="mt-4 space-y-2">
            <button
              onClick={() => add(product.price1, 1)}
              className="flex w-full items-center justify-center bg-[#C45B6A] px-6 py-4 text-base font-black text-white transition-colors hover:bg-[#a64d5a]"
            >
              طلبي {product.name} — {product.price1} د.م
            </button>
            <button
              onClick={() => add(product.price2, 2)}
              className="flex w-full items-center justify-center border border-[#C4A484]/50 bg-[#F7F1EC] px-6 py-3.5 text-sm font-black text-[#1C1412] transition-colors hover:border-[#C45B6A]"
            >
              عرض قطعتين بـ {product.price2} د.م — وفّري {save2} درهم
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              ["COD", "قلبي قبل الدفع"],
              ["مجاني", "توصيل المغرب"],
              ["24–48h", "غالباً"],
            ].map(([t, s]) => (
              <div key={t} className="border border-[#1C1412]/08 bg-[#F7F1EC] px-2 py-3">
                <p className="text-xs font-black text-[#C45B6A] md:text-sm">{t}</p>
                <p className="mt-0.5 text-[10px] font-bold text-[#1C1412]/55">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ألم → نتيجة ═══ */}
      <section className="container mx-auto px-4 py-10 md:py-14" dir="rtl">
        <FadeIn>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="bg-[#1C1412] p-5 text-white md:p-7">
              <p className="text-xs font-black tracking-[0.2em] text-[#C4A484]">قبل رونق</p>
              <p className="mt-3 text-base font-bold leading-relaxed md:text-lg">{product.pain}</p>
            </div>
            <div className="border border-[#C4A484]/35 bg-white p-5 md:p-7">
              <p className="text-xs font-black tracking-[0.2em] text-[#C45B6A]">بعد رونق</p>
              <p className="mt-3 text-base font-bold leading-relaxed text-[#1C1412] md:text-lg">
                {product.promise}
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══ لمن؟ + النتيجة ═══ */}
      <section className="bg-white py-10 md:py-14" dir="rtl">
        <div className="container mx-auto px-4">
          <FadeIn>
            <p className="text-sm font-black tracking-[0.2em] text-[#C45B6A]">اختاري بثقة</p>
            <h2 className="mt-2 text-3xl font-black text-[#1C1412] md:text-4xl">لمن هاد الأداة؟</h2>
            <p className="mt-3 max-w-xl text-[#1C1412]/60">{product.cardCopy}</p>
          </FadeIn>

          <div className="mt-6 space-y-2">
            {product.forWho.map((item, i) => (
              <FadeIn key={item} delay={i * 60}>
                <div className="flex items-start gap-3 border border-[#1C1412]/08 bg-[#F7F1EC] px-4 py-3.5">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#C45B6A]" />
                  <p className="text-sm font-bold text-[#1C1412] md:text-base">{item}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="bg-[#F7F1EC] p-4">
              <p className="text-xs font-black text-[#C45B6A]">الأحسن لـ</p>
              <p className="mt-1 text-sm font-black text-[#1C1412] md:text-base">{product.bestFor}</p>
            </div>
            <div className="bg-[#F7F1EC] p-4">
              <p className="text-xs font-black text-[#C45B6A]">النتيجة</p>
              <p className="mt-1 text-sm font-black text-[#1C1412] md:text-base">{product.result}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ معرض صور ═══ */}
      <section className="border-y border-[#1C1412]/8 bg-[#F7F1EC] py-10 md:py-14" dir="rtl">
        <div className="container mx-auto px-4">
          <FadeIn>
            <p className="text-sm font-black tracking-[0.2em] text-[#C45B6A]">شوفي</p>
            <h2 className="mt-2 text-3xl font-black text-[#1C1412]">الشكل والنتيجة</h2>
          </FadeIn>

          <div className="mt-5 overflow-hidden bg-white">
            <div className="aspect-[4/5] sm:aspect-[5/4] md:aspect-[16/10]">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1" dir="ltr">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setSelectedImage(i)}
                className={`h-16 w-16 shrink-0 overflow-hidden border-2 transition-colors md:h-20 md:w-20 ${
                  selectedImage === i ? "border-[#C45B6A]" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ مزايا تبيع ═══ */}
      <section className="bg-white py-10 md:py-14" dir="rtl">
        <div className="container mx-auto px-4">
          <FadeIn>
            <p className="text-sm font-black tracking-[0.2em] text-[#C45B6A]">علاش هادي؟</p>
            <h2 className="mt-2 text-3xl font-black text-[#1C1412]">مزايا كتبان فالنتيجة</h2>
            <p className="mt-3 max-w-xl text-[#1C1412]/60">{product.description}</p>
          </FadeIn>

          <ul className="mt-6 space-y-3">
            {product.features.map((f, i) => (
              <FadeIn key={f} delay={i * 50}>
                <li className="flex items-start gap-3 border-b border-[#1C1412]/08 pb-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center bg-[#C45B6A] text-xs font-black text-white">
                    ✓
                  </span>
                  <span className="text-sm font-bold text-[#1C1412] md:text-base">{f}</span>
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ كيفاش تستعملي + شنو فالصندوق ═══ */}
      <section className="bg-[#F7F1EC] py-10 md:py-14" dir="rtl">
        <div className="container mx-auto grid gap-10 px-4 md:grid-cols-2">
          <FadeIn>
            <h2 className="text-3xl font-black text-[#1C1412]">كيفاش تستعمليها؟</h2>
            <ol className="mt-5 space-y-4">
              {product.howTo.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#C45B6A] text-sm font-black text-white">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm font-medium text-[#1C1412]/80 md:text-base">{step}</p>
                </li>
              ))}
            </ol>
          </FadeIn>

          <FadeIn delay={100}>
            <h2 className="text-3xl font-black text-[#1C1412]">شنو فالصندوق؟</h2>
            <ul className="mt-5 space-y-2">
              {product.inBox.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 border border-[#C4A484]/25 bg-white px-4 py-3"
                >
                  <span className="text-[#C45B6A] font-black">·</span>
                  <span className="text-sm font-bold text-[#1C1412]">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs font-bold text-[#1C1412]/45">{product.modelNote}</p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ شهادة ═══ */}
      <section className="bg-white py-10 md:py-14" dir="rtl">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="border border-[#C4A484]/30 bg-[#F7F1EC] p-6 md:p-8">
              <p className="text-sm font-black tracking-[0.2em] text-[#C45B6A]">تجربة حقيقية</p>
              <p className="mt-4 text-lg font-bold leading-relaxed text-[#1C1412] md:text-xl">
                «{product.voice.text}»
              </p>
              <p className="mt-4 text-sm font-black text-[#1C1412]">
                {product.voice.name}
                <span className="mx-2 text-[#1C1412]/35">·</span>
                <span className="font-bold text-[#1C1412]/55">{product.voice.city}</span>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ عروض ═══ */}
      <section className="border-y border-[#1C1412]/8 bg-[#1C1412] py-10 text-white md:py-14" dir="rtl">
        <div className="container mx-auto px-4">
          <FadeIn>
            <p className="text-sm font-black tracking-[0.2em] text-[#C4A484]">اختاري عرضك</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">{product.name}</h2>
          </FadeIn>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => add(product.price1, 1)}
              className="flex w-full items-center justify-between border border-white/20 bg-white/5 px-5 py-5 text-right transition-colors hover:bg-white/10"
            >
              <div>
                <p className="text-lg font-black">قطعة واحدة</p>
                <p className="mt-1 text-xs text-white/60">الخيار الأساسي · خلصي عند الباب</p>
              </div>
              <p className="text-2xl font-black text-[#C4A484]">
                {product.price1}
                <span className="mr-1 text-sm">د.م</span>
              </p>
            </button>

            <button
              onClick={() => add(product.price2, 2)}
              className="flex w-full items-center justify-between bg-[#C45B6A] px-5 py-5 text-right transition-colors hover:bg-[#a64d5a]"
            >
              <div>
                <p className="text-lg font-black">قطعتين — الأكثر طلباً</p>
                <p className="mt-1 text-xs text-white/80">
                  وفّري {save2} درهم · مثالية ليك ولصاحبتك
                </p>
              </div>
              <p className="text-2xl font-black">
                {product.price2}
                <span className="mr-1 text-sm">د.م</span>
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* ═══ أسئلة ═══ */}
      <section className="bg-white py-10 md:py-14" dir="rtl">
        <div className="container mx-auto px-4">
          <FadeIn>
            <p className="text-sm font-black tracking-[0.2em] text-[#C45B6A]">قبل ما تطلبي</p>
            <h2 className="mt-2 text-3xl font-black text-[#1C1412]">أسئلة كتتردد</h2>
          </FadeIn>

          <div className="mt-6 space-y-2">
            {product.faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.q} className="border border-[#1C1412]/10">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-right"
                  >
                    <span className="text-sm font-black text-[#1C1412] md:text-base">{faq.q}</span>
                    <span className="text-lg font-black text-[#C45B6A]">{open ? "−" : "+"}</span>
                  </button>
                  {open && (
                    <p className="border-t border-[#1C1412]/08 px-4 py-4 text-sm leading-relaxed text-[#1C1412]/70">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ أدوات أخرى ═══ */}
      {others.length > 0 && (
        <section className="bg-[#F7F1EC] py-10 md:py-14" dir="rtl">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-black text-[#1C1412]">أدوات أخرى من رونق</h2>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {others.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group overflow-hidden border border-[#1C1412]/08 bg-white transition-colors hover:border-[#C45B6A]"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#F7F1EC]">
                    <img
                      src={p.heroImage}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-black text-[#1C1412]">{p.name}</p>
                    <p className="mt-1 text-xs font-bold text-[#1C1412]/50">{p.tagline}</p>
                    <p className="mt-2 font-black text-[#C45B6A]">{p.price1} د.م</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ ختام ═══ */}
      <section className="bg-[#1C1412] py-12 text-center text-white" dir="rtl">
        <div className="container mx-auto px-4">
          <p className="text-xl font-black text-[#C4A484]">رونق</p>
          <h2 className="mt-2 text-3xl font-black">{product.name}</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/65">
            نتيجة صالون فدارك · حماية للشعر · خلصي عند الباب بعد ما تقلبي
          </p>
          <button
            onClick={() => add(product.price1, 1)}
            className="mt-6 bg-[#C45B6A] px-10 py-4 text-base font-black transition-colors hover:bg-[#a64d5a]"
          >
            أضيفي للسلة — {product.price1} د.م
          </button>
        </div>
      </section>

      {/* ═══ Sticky CTA موبايل ═══ */}
      {isSticky && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#1C1412]/10 bg-white/95 p-3 backdrop-blur md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          dir="rtl"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => add(product.price1, 1)}
              className="flex-1 bg-[#C45B6A] py-3.5 text-base font-black text-white"
            >
              اطلبي — {product.price1} د.م
            </button>
            <div className="text-right text-[11px] leading-tight text-[#1C1412]/55">
              <p className="font-black text-[#1C1412]">توصيل مجاني</p>
              <p>قلبي قبل الدفع</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
