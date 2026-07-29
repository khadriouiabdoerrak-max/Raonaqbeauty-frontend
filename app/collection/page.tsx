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
      <div className="bg-pearl-blush py-14 text-center" dir="rtl">
        <p className="text-champagne text-xl font-black mb-2">رونق</p>
        <h1 className="text-4xl md:text-5xl font-black text-warm-black mb-3">المجموعة</h1>
        <p className="text-gray-500 text-lg max-w-lg mx-auto">
          أدوات مختارة لنتيجة احترافية مع حماية الشعر — اختاري حسب الحجم، النعومة، أو اللمعان
        </p>
      </div>

      <div className="container mx-auto px-4 py-8" dir="rtl">
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 text-sm font-bold transition-colors ${
                filter === f.id
                  ? "bg-warm-black text-white"
                  : "bg-pearl-blush text-warm-black hover:bg-champagne/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {list.map((product) => (
            <div
              key={product.id}
              className="group border border-gray-100 hover:border-champagne/50 transition-colors overflow-hidden"
            >
              <div className="grid md:grid-cols-2">
                <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-pearl-blush block">
                  {product.tag && (
                    <span className="absolute top-4 right-4 bg-rosewood text-white text-xs font-bold px-3 py-1.5 z-10">
                      {product.tag}
                    </span>
                  )}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="p-6 text-right flex flex-col justify-between" dir="rtl">
                  <div>
                    <p className="text-xs font-bold text-rosewood mb-1">{product.bestFor}</p>
                    <h2 className="font-black text-xl text-warm-black mb-2 leading-snug">{product.name}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{product.tagline}</p>
                    <ul className="space-y-1 mb-4">
                      {product.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex gap-2 items-center text-sm text-gray-600">
                          <span className="text-rosewood">·</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
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
                      className="w-full flex justify-between items-center p-3 border-2 border-gray-200 hover:border-rosewood hover:bg-pearl-blush transition-colors"
                    >
                      <span className="font-medium">قطعة واحدة</span>
                      <span className="font-bold text-rosewood text-lg">{product.price1} د.م</span>
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
                      className="w-full flex justify-between items-center p-3 bg-warm-black text-white hover:bg-rosewood transition-colors"
                    >
                      <span className="font-bold">قطعتين</span>
                      <span className="font-bold text-lg">{product.price2} د.م</span>
                    </button>
                    <Link
                      href={`/products/${product.slug}`}
                      className="block text-center text-sm text-rosewood font-bold py-1 hover:text-warm-black"
                    >
                      التفاصيل الكاملة
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
