"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "../../../context/CartContext";
import { trackViewContent } from "../../../lib/pixels";
import { products, productThumb, type Product } from "../../../lib/products";
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
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function productImageClass(src?: string) {
  const shouldContain = src?.includes("-tool") || src?.includes("-box");
  if (shouldContain) return "bg-white object-contain p-4";
  if (src?.includes("raonaq-duo")) return "object-cover object-center";
  return "object-cover object-[center_18%]";
}

function BuyPanel({
  product,
  save2,
  onAdd,
  ctaRef,
}: {
  product: Product;
  save2: number;
  onAdd: (price: number, qty: number) => void;
  ctaRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div dir="rtl">
      {product.tag && (
        <p className="text-[11px] font-black tracking-[0.18em] text-[#C45B6A]">{product.tag}</p>
      )}
      <p className="mt-2 text-sm font-black tracking-[0.2em] text-[#C4A484]">رونق · RAONAQ</p>
      <h1 className="mt-2 text-3xl font-black leading-tight text-[#1C1412] md:text-4xl">
        {product.name}
      </h1>
      <p className="mt-2 text-base font-bold text-[#1C1412]/65">{product.tagline}</p>

      <div className="mt-5 flex items-end gap-3">
        <p className="text-4xl font-black leading-none text-[#C45B6A]">
          {product.price1}
          <span className="mr-1 text-base font-bold">د.م</span>
        </p>
        <p className="pb-1 text-xs font-bold text-[#1C1412]/45">خلاص عند الباب بعد التفقد</p>
      </div>

      <p className="mt-4 text-sm font-medium leading-relaxed text-[#1C1412]/70">{product.promise}</p>

      <div ref={ctaRef} className="mt-6 space-y-2.5">
        <button
          type="button"
          onClick={() => onAdd(product.price1, 1)}
          className="btn btn-primary btn-block btn-lg text-[15px]"
        >
          اطلبي الآن — {product.price1} د.م
        </button>
        <button
          type="button"
          onClick={() => onAdd(product.price2, 2)}
          className="btn btn-secondary btn-block justify-between gap-3 px-5 py-3.5 text-right"
        >
          <span>
            <span className="block text-sm font-black text-[#1C1412]">عرض قطعتين</span>
            <span className="mt-0.5 block text-[11px] font-bold text-[#1C1412]/50">
              وفّري {save2} درهم
            </span>
          </span>
          <span className="shrink-0 text-lg font-black text-[#C45B6A]">{product.price2} د.م</span>
        </button>
      </div>

      <p className="mt-4 text-center text-[11px] font-bold leading-relaxed text-[#1C1412]/50">
        توصيل مجاني للمغرب · غالباً 24–48 ساعة · قلبي قبل ما تخلصي
      </p>
    </div>
  );
}

export default function ProductClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isSticky, setIsSticky] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const suggestedOrder = ["p5", "p6", "p1", "p2", "p3", "p4"];
  const others = suggestedOrder
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p && p.id !== product.id))
    .slice(0, 3);
  const save2 = product.price1 * 2 - product.price2;
  const shot = product.gallery[selectedImage] ?? product.gallery[0];

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
      // السعر للوحدة — عرض قطعتين كيدوز price2 كمجموع
      price: qty > 1 ? price / qty : price,
      quantity: qty,
      image: productThumb(product),
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F7F1EC] pb-28 md:pb-0">
      {/* موبايل: صور المنتج أولاً */}
      <section className="bg-white lg:hidden" dir="rtl">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F7F1EC]">
          <img
            src={shot?.src ?? product.heroImage}
            alt={`${product.name} — ${shot?.label ?? "رونق"}`}
            className={`h-full w-full ${productImageClass(shot?.src ?? product.heroImage)}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-[#1C1412]/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 pb-6 text-right text-white" dir="rtl">
            <h1 className="text-[1.75rem] font-black leading-tight">{product.name}</h1>
            <p className="mt-1.5 text-sm text-white/80">{shot?.label ?? product.tagline}</p>
          </div>
        </div>

        <div className="border-b border-[#1C1412]/8 px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1" dir="ltr">
            {product.gallery.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setSelectedImage(i)}
                aria-label={img.label}
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-[#F7F1EC] transition-colors ${
                  selectedImage === i ? "border-[#C45B6A]" : "border-[#1C1412]/10"
                }`}
              >
                <img src={img.src} alt="" className={`h-full w-full ${productImageClass(img.src)}`} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
          <p className="mt-2 text-center text-xs font-black text-[#1C1412]/60">
            قلبي الصور وشوفي المنتج من كل جهة
          </p>
        </div>
      </section>

      {/* موبايل: شراء */}
      <section className="border-b border-[#1C1412]/8 bg-white px-4 py-6 lg:hidden">
        <BuyPanel product={product} save2={save2} onAdd={add} ctaRef={ctaRef} />
      </section>

      {/* ديسكتوب: معرض + شراء جنب جنب */}
      <section className="hidden bg-white lg:block" dir="rtl">
        <div className="container mx-auto grid gap-10 px-6 py-12 xl:grid-cols-[1.15fr_0.85fr] xl:gap-14 xl:px-8 xl:py-16">
          <div>
            <div className="overflow-hidden bg-[#F7F1EC]">
              <div className="aspect-[4/5]">
                <img
                  src={shot?.src ?? product.heroImage}
                  alt={`${product.name} — ${shot?.label ?? ""}`}
                  className={`h-full w-full ${productImageClass(shot?.src ?? product.heroImage)}`}
                />
              </div>
            </div>
            {shot && (
              <p className="mt-3 text-center text-sm font-black text-[#1C1412]/55">{shot.label}</p>
            )}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1" dir="ltr">
              {product.gallery.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  aria-label={img.label}
                  className={`h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border transition-colors ${
                    selectedImage === i ? "border-[#C45B6A]" : "border-[#1C1412]/10"
                  }`}
                >
                <img src={img.src} alt="" className={`h-full w-full ${productImageClass(img.src)}`} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>

          <div className="xl:sticky xl:top-28 xl:self-start">
            <BuyPanel product={product} save2={save2} onAdd={add} ctaRef={ctaRef} />
          </div>
        </div>
      </section>

      {/* قبل / بعد */}
      <section className="px-4 py-10 md:py-14" dir="rtl">
        <div className="container mx-auto">
          <FadeIn>
            <div className="grid gap-px overflow-hidden bg-[#C4A484]/25 md:grid-cols-2">
              <div className="bg-[#1C1412] p-6 text-white md:p-8">
                <p className="text-[11px] font-black tracking-[0.22em] text-[#C4A484]">قبل رونق</p>
                <p className="mt-3 text-base font-bold leading-relaxed md:text-lg">{product.pain}</p>
              </div>
              <div className="bg-white p-6 md:p-8">
                <p className="text-[11px] font-black tracking-[0.22em] text-[#C45B6A]">بعد رونق</p>
                <p className="mt-3 text-base font-bold leading-relaxed text-[#1C1412] md:text-lg">
                  {product.promise}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* لمن */}
      <section className="bg-white py-10 md:py-14" dir="rtl">
        <div className="container mx-auto px-4">
          <FadeIn>
            <p className="text-[11px] font-black tracking-[0.2em] text-[#C45B6A]">اختاري بثقة</p>
            <h2 className="mt-2 text-3xl font-black text-[#1C1412]">لمن هاد الأداة؟</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#1C1412]/60 md:text-base">
              {product.cardCopy}
            </p>
          </FadeIn>

          <ul className="mt-7 space-y-0 border-t border-[#1C1412]/10">
            {product.forWho.map((item, i) => (
              <FadeIn key={item} delay={i * 50}>
                <li className="flex items-start gap-3 border-b border-[#1C1412]/10 py-4">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C45B6A]" />
                  <p className="text-sm font-bold text-[#1C1412] md:text-base">{item}</p>
                </li>
              </FadeIn>
            ))}
          </ul>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-black tracking-[0.18em] text-[#C45B6A]">الأحسن لـ</p>
              <p className="mt-2 text-base font-black text-[#1C1412]">{product.bestFor}</p>
            </div>
            <div>
              <p className="text-[11px] font-black tracking-[0.18em] text-[#C45B6A]">النتيجة</p>
              <p className="mt-2 text-base font-black text-[#1C1412]">{product.result}</p>
            </div>
          </div>
        </div>
      </section>

      {/* مزايا */}
      <section className="border-y border-[#1C1412]/8 bg-[#F7F1EC] py-10 md:py-14" dir="rtl">
        <div className="container mx-auto px-4">
          <FadeIn>
            <p className="text-[11px] font-black tracking-[0.2em] text-[#C45B6A]">علاش هادي؟</p>
            <h2 className="mt-2 text-3xl font-black text-[#1C1412]">مزايا كتبان فالنتيجة</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#1C1412]/60 md:text-base">
              {product.description}
            </p>
          </FadeIn>

          <ul className="mt-8 space-y-0">
            {product.features.map((f, i) => (
              <FadeIn key={f} delay={i * 40}>
                <li className="flex items-start gap-3 border-b border-[#1C1412]/10 py-3.5">
                  <span className="mt-0.5 text-sm font-black text-[#C45B6A]">✓</span>
                  <span className="text-sm font-bold text-[#1C1412] md:text-base">{f}</span>
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      {/* استعمال + صندوق */}
      <section className="bg-white py-10 md:py-14" dir="rtl">
        <div className="container mx-auto grid gap-12 px-4 md:grid-cols-2 md:gap-16">
          <FadeIn>
            <h2 className="text-3xl font-black text-[#1C1412]">كيفاش تستعمليها؟</h2>
            <ol className="mt-6 space-y-5">
              {product.howTo.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#1C1412] text-sm font-black text-white">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm font-medium leading-relaxed text-[#1C1412]/75 md:text-base">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </FadeIn>

          <FadeIn delay={80}>
            <h2 className="text-3xl font-black text-[#1C1412]">شنو فالصندوق؟</h2>
            <ul className="mt-6 space-y-0 border-t border-[#1C1412]/10">
              {product.inBox.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 border-b border-[#1C1412]/10 py-3.5"
                >
                  <span className="text-[#C45B6A]">·</span>
                  <span className="text-sm font-bold text-[#1C1412]">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs font-bold text-[#1C1412]/40">{product.modelNote}</p>
          </FadeIn>
        </div>
      </section>

      {/* شهادة */}
      <section className="bg-[#F7F1EC] py-10 md:py-14" dir="rtl">
        <div className="container mx-auto max-w-3xl px-4">
          <FadeIn>
            <p className="text-[11px] font-black tracking-[0.2em] text-[#C45B6A]">تجربة حقيقية</p>
            <p className="mt-5 text-xl font-bold leading-relaxed text-[#1C1412] md:text-2xl">
              «{product.voice.text}»
            </p>
            <p className="mt-5 text-sm font-black text-[#1C1412]">
              {product.voice.name}
              <span className="mx-2 text-[#1C1412]/30">·</span>
              <span className="font-bold text-[#1C1412]/50">{product.voice.city}</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* عرض أخير */}
      <section className="bg-[#1C1412] py-12 text-white md:py-16" dir="rtl">
        <div className="container mx-auto max-w-xl px-4 text-center">
          <FadeIn>
            <p className="text-lg font-black tracking-[0.16em] text-[#C4A484]">رونق</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">{product.name}</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm text-white/60">
              نتيجة صالون فدارك · خلصي غير ملي تقلبي السلعة
            </p>
            <button
              type="button"
              onClick={() => add(product.price1, 1)}
              className="btn btn-primary btn-lg mt-7 w-full sm:w-auto"
            >
              اطلبي — {product.price1} د.م
            </button>
            <button
              type="button"
              onClick={() => add(product.price2, 2)}
              className="mt-3 block w-full text-sm font-bold text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline sm:inline-block sm:w-auto sm:px-4"
            >
              أو قطعتين بـ {product.price2} د.م (وفّري {save2})
            </button>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-10 md:py-14" dir="rtl">
        <div className="container mx-auto max-w-3xl px-4">
          <FadeIn>
            <p className="text-[11px] font-black tracking-[0.2em] text-[#C45B6A]">قبل ما تطلبي</p>
            <h2 className="mt-2 text-3xl font-black text-[#1C1412]">أسئلة كتتردد</h2>
          </FadeIn>

          <div className="mt-7 space-y-0 border-t border-[#1C1412]/10">
            {product.faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.q} className="border-b border-[#1C1412]/10">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-right"
                    aria-expanded={open}
                  >
                    <span className="text-sm font-black text-[#1C1412] md:text-base">{faq.q}</span>
                    <span className="shrink-0 text-lg font-black text-[#C45B6A]">{open ? "−" : "+"}</span>
                  </button>
                  {open && (
                    <p className="pb-4 text-sm leading-relaxed text-[#1C1412]/65">{faq.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* منتجات أخرى */}
      {others.length > 0 && (
        <section className="border-t border-[#1C1412]/8 bg-[#F7F1EC] py-10 md:py-14" dir="rtl">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-black text-[#1C1412] md:text-3xl">أدوات أخرى من رونق</h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-3 sm:gap-4">
              {others.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group flex overflow-hidden rounded-2xl bg-white transition-opacity hover:opacity-90 sm:block sm:rounded-none"
                >
                  <div className="aspect-square w-28 shrink-0 overflow-hidden bg-[#F7F1EC] sm:w-auto sm:aspect-[4/5]">
                    <img
                      src={p.heroImage}
                      alt={p.name}
                      className={`h-full w-full transition-transform duration-700 group-hover:scale-[1.03] ${productImageClass(p.heroImage)}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center p-3 text-right sm:block sm:p-4">
                    <p className="text-sm font-black leading-tight text-[#1C1412] sm:text-base">{p.name}</p>
                    <p className="mt-1 hidden text-xs font-bold text-[#1C1412]/45 sm:block">{p.tagline}</p>
                    <p className="mt-2 text-sm font-black text-[#C45B6A] sm:text-base">{p.price1} د.م</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky CTA موبايل */}
      {isSticky && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#1C1412]/10 bg-white/95 px-3 pt-3 backdrop-blur md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          dir="rtl"
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-[#1C1412]">{product.name}</p>
              <p className="text-[11px] font-bold text-[#1C1412]/45">قلبي قبل الدفع · توصيل مجاني</p>
            </div>
            <button
              type="button"
              onClick={() => add(product.price1, 1)}
              className="btn btn-primary btn-md shrink-0"
            >
              {product.price1} د.م
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
