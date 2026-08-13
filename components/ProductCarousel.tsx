"use client";

import { useRef } from "react";
import Link from "next/link";
import { products, type Product } from "../lib/products";

type ProductCarouselProps = {
  onAdd: (product: Product) => void;
};

export default function ProductCarousel({ onAdd }: ProductCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (step: number) => {
    const root = scrollerRef.current;
    if (!root) return;
    const card = root.querySelector<HTMLElement>("[data-product-card]");
    if (!card) return;
    const amount = card.getBoundingClientRect().width + 16;
    root.scrollBy({ left: -step * amount, behavior: "smooth" });
  };

  return (
    <div className="relative z-[1]" dir="rtl">
      <div className="mb-4 flex items-center justify-between gap-3 px-1">
        <p className="text-[12px] font-bold text-[#1C1412]/50 md:text-sm">
          مرّري من اليمين لليسار
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1C1412]/12 bg-white text-[#1C1412]"
            aria-label="المنتج التالي"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1C1412]/12 bg-white text-[#1C1412]"
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
        className="product-carousel -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-3 md:mx-0 md:gap-4 md:px-0"
      >
        {products.map((product) => (
          <article
            key={product.id}
            data-product-card
            className="relative z-[1] flex w-[min(82vw,300px)] shrink-0 snap-start flex-col overflow-hidden border border-[#C4A484]/25 bg-white md:w-[280px] lg:w-[300px]"
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
                  className={`pointer-events-none h-full w-full ${
                    product.heroImage.includes("-tool") || product.heroImage.includes("-box")
                      ? "object-contain p-8"
                      : product.slug === "raonaq-duo"
                        ? "object-cover object-center"
                        : "object-cover object-[center_18%]"
                  }`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="px-4 pb-1 text-right">
                <h3 className="text-xl font-black text-[#1C1412]">{product.name}</h3>
                <p className="mt-1 text-sm font-medium text-[#1C1412]/55">{product.tagline}</p>
                <p className="mt-3 text-lg font-black text-[#C45B6A]">{product.price1} د.م</p>
              </div>
            </Link>
            <div className="mt-auto px-4 pb-4">
              <button
                type="button"
                onClick={() => onAdd(product)}
                className="btn btn-primary btn-block h-12 whitespace-nowrap px-4 text-[13px] md:h-[52px] md:text-sm"
              >
                اطلبي دابا · {product.price1} د.م
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
