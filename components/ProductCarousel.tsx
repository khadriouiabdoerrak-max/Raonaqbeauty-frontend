"use client";

import { useRef } from "react";
import Link from "next/link";
import { products, productCoverClass, type Product } from "../lib/products";

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
    root.scrollBy({ left: step * amount, behavior: "smooth" });
  };

  return (
    <div className="relative z-[1]">
      <div className="mb-4 flex items-center justify-between gap-3 px-1">
        <p className="text-[12px] font-medium text-[#1C1412]/45 md:text-sm">Faites glisser</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1C1412]/12 bg-white text-[#1C1412]"
            aria-label="Précédent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1C1412]/12 bg-white text-[#1C1412]"
            aria-label="Suivant"
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
            className="relative z-[1] flex w-[min(78vw,280px)] shrink-0 snap-start flex-col overflow-hidden bg-white md:w-[240px] lg:w-[280px] xl:w-[300px]"
          >
            <Link href={`/products/${product.slug}`} className="block">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F7F1EC]">
                {product.tag && (
                  <span className="absolute left-3 top-3 z-10 bg-[#1C1412] px-3 py-1.5 text-[10px] font-medium tracking-wide text-white">
                    {product.tag}
                  </span>
                )}
                <img
                  src={product.heroImage}
                  alt={product.name}
                  draggable={false}
                  className={`pointer-events-none h-full w-full ${productCoverClass(product.heroImage, product.slug)}`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="px-4 pb-1 text-left">
                <h3 className="font-display text-2xl font-semibold tracking-wide text-[#1C1412]">{product.name}</h3>
                <p className="mt-0.5 text-[11px] font-medium tracking-wide text-[#C4A484]">{product.nameFr}</p>
                <p className="mt-1 text-sm text-[#1C1412]/55">{product.tagline}</p>
                <p className="mt-3 text-lg font-semibold text-[#C45B6A]">{product.price1} Dhs</p>
              </div>
            </Link>
            <div className="mt-auto px-4 pb-4">
              <button
                type="button"
                onClick={() => onAdd(product)}
                className="btn btn-primary btn-block h-12 whitespace-nowrap px-4 text-[13px] md:h-[52px] md:text-sm"
              >
                Ajouter — {product.price1} Dhs
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
