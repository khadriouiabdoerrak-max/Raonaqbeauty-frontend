"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import { products } from "../../lib/products";

const filters = [
  { id: "all", label: "الكل" },
  { id: "volume", label: "حجم", match: "raonaq-volume" },
  { id: "soft", label: "نعومة", match: "raonaq-air-soft" },
  { id: "daily", label: "يومي", match: "raonaq-air-pink" },
  { id: "set", label: "طقم", match: "raonaq-trio" },
] as const;

export default function CollectionPage() {
  const { addToCart } = useCart();
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");

  const list = useMemo(() => {
    if (filter === "all") return products;
    const f = filters.find((x) => x.id === filter);
    if (!f || f.id === "all" || !("match" in f)) return products;
    return products.filter((p) => p.slug === f.match);
  }, [filter]);

  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden bg-[#1C1412] text-white" dir="rtl">
        <img
          src="/images/raonaq-tools-editorial.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-[#1C1412]/75 to-[#1C1412]/35" />
        <div className="relative container mx-auto px-4 py-16 text-right md:py-24">
          <p className="text-sm font-black tracking-[0.28em] text-[#C4A484]">مجموعة رونق</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight md:text-6xl">
            اختاري الأداة اللي غادي تبدّل روتين شعرك
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            أربع أدوات مختارة بعناية للشعر المغربي: حجم، نعومة، ترتيب يومي، أو طقم كامل. خلصي غير ملي توصلك وتشوفيها بيدك.
          </p>
          <div className="mt-7 flex flex-wrap gap-2 text-xs font-black text-white/85">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">توصيل مجاني</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">الدفع عند الاستلام</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">نتيجة صالون فدارك</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-14" dir="rtl">
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 md:mb-12 md:flex-wrap md:justify-center">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full px-5 py-3 text-sm font-black transition-colors ${
                filter === f.id
                  ? "bg-warm-black text-white shadow-[0_10px_28px_rgba(28,20,18,0.16)]"
                  : "bg-pearl-blush text-warm-black hover:bg-champagne/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {list.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden border border-[#C4A484]/25 bg-white shadow-[0_18px_55px_rgba(28,20,18,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(28,20,18,0.12)]"
            >
              <div className="grid md:grid-cols-[0.92fr_1.08fr]">
                <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-gradient-to-b from-pearl-blush to-white md:aspect-auto">
                  {product.tag && (
                    <span className="absolute right-4 top-4 z-10 bg-warm-black px-3 py-1.5 text-[11px] font-black text-white shadow-lg">
                      {product.tag}
                    </span>
                  )}
                  <span className="absolute bottom-4 left-4 z-10 bg-white/90 px-3 py-1.5 text-xs font-black text-rosewood shadow-lg backdrop-blur">
                    {product.price1} د.م
                  </span>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-contain p-5 transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>

                <div className="flex flex-col justify-between p-5 text-right md:p-6" dir="rtl">
                  <div>
                    <p className="mb-1 text-[11px] font-black tracking-wide text-rosewood">{product.bestFor}</p>
                    <Link href={`/products/${product.slug}`} className="block">
                      <h2 className="text-2xl font-black leading-snug text-warm-black">{product.name}</h2>
                      <p className="mt-2 text-base font-black text-warm-black/80">{product.tagline}</p>
                      <p className="mt-3 text-sm leading-relaxed text-warm-black/60">{product.cardCopy}</p>
                    </Link>
                    <ul className="mt-5 space-y-2">
                      {product.features.slice(0, 3).map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm font-medium text-warm-black/65">
                          <span className="h-1.5 w-1.5 rounded-full bg-rosewood" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 space-y-2">
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
                      className="flex w-full items-center justify-between rounded-full border border-warm-black/12 bg-white px-5 py-3 transition-colors hover:border-rosewood hover:bg-pearl-blush"
                    >
                      <span className="font-black text-warm-black">طلبي قطعة</span>
                      <span className="text-lg font-black text-rosewood">{product.price1} د.م</span>
                    </button>
                    <button
                      onClick={() =>
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price2,
                          quantity: 2,
                          image: product.images[0],
                        })
                      }
                      className="flex w-full items-center justify-between rounded-full bg-warm-black px-5 py-3 text-white shadow-[0_12px_30px_rgba(28,20,18,0.18)] transition-colors hover:bg-rosewood"
                    >
                      <span>
                        <span className="block font-black">عرض قطعتين</span>
                        <span className="block text-[10px] font-bold text-white/65">
                          وفري {product.price1 * 2 - product.price2} درهم
                        </span>
                      </span>
                      <span className="text-lg font-black">{product.price2} د.م</span>
                    </button>
                    <Link
                      href={`/products/${product.slug}`}
                      className="block pt-2 text-center text-sm font-black text-rosewood hover:text-warm-black"
                    >
                      شوفي التفاصيل الكاملة
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
