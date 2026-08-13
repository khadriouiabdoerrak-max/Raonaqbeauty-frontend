"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { products, type Product } from "../lib/products";

type ProductCarouselProps = {
  onAdd: (product: Product) => void;
};

export default function ProductCarousel({ onAdd }: ProductCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const cards = () =>
    Array.from(
      scrollerRef.current?.querySelectorAll<HTMLElement>("[data-product-card]") ?? []
    );

  const sync = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const list = cards();
    if (list.length === 0) return;

    const parent = el.getBoundingClientRect();
    let best = 0;
    let bestDist = Infinity;
    list.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().right - parent.right);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
    setCanPrev(best > 0);
    setCanNext(best < list.length - 1);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const goTo = (index: number) => {
    const list = cards();
    const card = list[Math.max(0, Math.min(index, list.length - 1))];
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <div className="relative" dir="rtl">
      <div className="mb-4 flex items-center justify-between gap-3 px-1">
        <p className="text-[12px] font-bold text-[#1C1412]/50 md:text-sm">
          مرّري من اليمين لليسار — تشوفي كل الأدوات
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={!canNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1C1412]/12 bg-white text-[#1C1412] transition-colors hover:border-rosewood hover:text-rosewood disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="المنتج التالي"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={!canPrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1C1412]/12 bg-white text-[#1C1412] transition-colors hover:border-rosewood hover:text-rosewood disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="المنتج السابق"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="product-carousel -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 md:-mx-0 md:gap-4 md:px-0"
        style={{ scrollbarWidth: "none", touchAction: "pan-x" }}
      >
        {products.map((product) => (
          <article
            key={product.id}
            data-product-card
            className="group flex w-[min(78vw,320px)] shrink-0 snap-start flex-col overflow-hidden border border-[#C4A484]/25 bg-white md:w-[300px] lg:w-[320px]"
          >
            <Link href={`/products/${product.slug}`} className="block">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F7F1EC]">
                {product.tag && (
                  <span className="absolute right-3 top-3 z-10 bg-[#1C1412] px-3 py-1.5 text-[10px] font-black text-white">
                    {product.tag}
                  </span>
                )}
                <img
                  src={product.heroImage}
                  alt={product.name}
                  draggable={false}
                  className={`h-full w-full transition-transform duration-700 group-hover:scale-105 ${
                    product.heroImage.includes("-tool")
                      ? "object-contain p-8"
                      : "object-cover object-[center_18%]"
                  }`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-5 text-right">
                <h3 className="text-xl font-black text-[#1C1412]">{product.name}</h3>
                <p className="mt-1 text-sm font-medium text-[#1C1412]/55">{product.tagline}</p>
                <p className="mt-3 text-lg font-black text-[#C45B6A]">{product.price1} د.م</p>
              </div>
            </Link>
            <div className="mt-auto px-5 pb-5">
              <button
                type="button"
                onClick={() => onAdd(product)}
                className="btn btn-primary btn-block"
              >
                اطلبي دابا
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 flex justify-center gap-1.5">
        {products.map((product, i) => (
          <button
            key={product.id}
            type="button"
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-6 bg-rosewood" : "w-1.5 bg-[#1C1412]/18"
            }`}
            aria-label={product.name}
          />
        ))}
      </div>
    </div>
  );
}
