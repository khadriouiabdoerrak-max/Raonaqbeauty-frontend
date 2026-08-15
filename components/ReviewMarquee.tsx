import type { ProductReview } from "../lib/products";

const STAR =
  "M10 1.6 12.2 7l5.8.5-4.4 3.8 1.4 5.7L10 14.2 4.99 17l1.4-5.7L2 7.5 7.8 7 10 1.6Z";

function MiniStars({ rating }: { rating: number }) {
  const n = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <span className="inline-flex flex-nowrap items-center gap-px" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3 w-3 shrink-0">
          <path fill={i < n ? "#E8C547" : "#E8C54733"} d={STAR} />
        </svg>
      ))}
    </span>
  );
}

function Card({ item }: { item: ProductReview }) {
  return (
    <blockquote className="w-[230px] shrink-0 rounded-[1.15rem] border border-[#1C1412]/8 bg-[#F7F1EC] px-4 py-3.5">
      <div className="flex flex-nowrap items-center gap-1.5">
        <MiniStars rating={item.rating ?? 5} />
        <span className="font-display text-[12px] font-semibold text-[#1C1412]/65">
          ({(item.rating ?? 5).toFixed(1)})
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-5 text-[#1C1412]/75">« {item.text} »</p>
      <footer className="mt-2.5 text-[12px] font-medium text-[#1C1412]">
        {item.name}
        <span className="font-normal text-[#C45B6A]"> · {item.city}</span>
      </footer>
    </blockquote>
  );
}

export default function ReviewMarquee({ items }: { items: ProductReview[] }) {
  if (items.length === 0) return null;
  const loop = [...items, ...items];

  return (
    <div className="mt-5">
      <p className="mb-2.5 text-[11px] font-medium tracking-[0.22em] text-[#C4A484]">ELLES ONT ESSAYÉ</p>
      <div className="overflow-hidden">
        <div className="raonaq-review-track flex gap-3">
          {loop.map((item, i) => (
            <Card key={`${item.name}-${item.city}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
