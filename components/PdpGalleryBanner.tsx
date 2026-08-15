import { productGalleryBanner, type Product } from "../lib/products";

/**
 * Au-dessus des photos PDP : accroche froide (résultat / douleur) + offre réelle.
 */
export default function PdpGalleryBanner({ product }: { product: Product }) {
  const b = productGalleryBanner(product);

  return (
    <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-[#1C1412]/8 bg-[#F7F1EC] px-4 py-3.5 md:border-b-0 md:bg-transparent md:px-0 md:pb-3.5 md:pt-0">
      <div className="min-w-0 max-w-[20rem] md:max-w-sm">
        <p className="font-display text-[1.15rem] font-semibold leading-snug text-[#1C1412] md:text-[1.35rem]">
          {b.hook}
        </p>
        <p className="mt-1 text-[11px] leading-snug text-[#1C1412]/45 md:text-[12px]">
          Inspectez à la porte · puis payez
        </p>
      </div>
      {b.saveLabel ? (
        <span className="bg-[#C45B6A] px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-white">
          {b.saveLabel}
        </span>
      ) : b.accent ? (
        <span className="border border-[#C4A484]/55 px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-[#C45B6A]">
          {b.accent}
        </span>
      ) : (
        <span className="border border-[#C4A484]/55 px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-[#C45B6A]">
          COD Maroc
        </span>
      )}
    </div>
  );
}
