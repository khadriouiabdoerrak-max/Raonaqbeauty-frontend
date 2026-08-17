"use client";

import Link from "next/link";
import { products } from "../../lib/products";
import Price from "../../components/Price";
import Stars from "../../components/Stars";
import ProductShot from "../../components/ProductShot";

const trustBadges = ["Livraison gratuite", "Paiement à la livraison", "Inspectez, puis payez"];

export default function CollectionPage() {
  const list = products;

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#1C1412] text-white">
        <div className="container mx-auto px-4 py-14 text-left md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="text-[11px] font-medium tracking-[0.32em] text-[#C4A484]">COLLECTION</p>
              <h1 className="font-display mt-4 max-w-xl text-4xl font-semibold leading-tight md:text-6xl">
                Six outils.
                <br />
                Un seul geste.
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-7 text-white/65 md:text-lg">
                Volume, lisse, brillance — avec protection. Vous ouvrez, vous inspectez, puis vous payez.
              </p>
              <div className="mt-8 flex flex-wrap gap-2 text-[11px] font-medium tracking-wide">
                {trustBadges.map((badge) => (
                  <span key={badge} className="border border-white/15 px-4 py-2 text-white/80">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#F7F1EC] lg:aspect-[5/6]">
                <img
                  src="/images/raonaq-lifestyle-home.webp"
                  alt="Raonaq — le salon, chez vous"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412]/70 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 bg-white/95 p-5 text-[#1C1412]">
                  <p className="text-[11px] font-medium tracking-[0.22em] text-[#C45B6A]">LA PROMESSE</p>
                  <p className="font-display mt-1 text-2xl font-semibold">Ouvrez · inspectez · payez</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-xl">
            <p className="text-[11px] font-medium tracking-[0.28em] text-[#C45B6A]">LES OUTILS</p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-[#1C1412] md:text-5xl">
              Choisissez le vôtre
            </h2>
          </div>

          <div className="grid min-w-0 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {list.map((product) => (
              <article key={product.id} className="group flex h-full min-w-0 flex-col">
                <Link href={`/products/${product.slug}`} className="relative block min-w-0 overflow-hidden">
                  {product.tag && (
                    <span className="absolute left-3 top-3 z-10 bg-[#1C1412] px-3 py-1.5 text-[10px] font-medium tracking-wide text-white">
                      {product.tag}
                    </span>
                  )}
                  <ProductShot
                    src={product.heroImage}
                    alt={product.name}
                    variant="card"
                  />
                </Link>

                <div className="flex flex-1 flex-col pt-4">
                  <p className="text-[12px] font-medium leading-snug text-[#1C1412]/70">{product.nameFr}</p>
                  <Link href={`/products/${product.slug}`}>
                    <h2 className="font-display mt-1 text-2xl font-semibold tracking-wide text-[#1C1412] md:text-3xl">
                      {product.name}
                    </h2>
                  </Link>
                  <Stars className="mt-1.5" />
                  <div className="mt-3">
                    <Price amount={product.price1} was={product.priceWas} />
                  </div>

                  <div className="mt-5 space-y-2">
                    <Link
                      href={`/products/${product.slug}`}
                      className="btn btn-primary btn-block min-h-14 px-5 py-4 text-base font-semibold md:min-h-16 md:text-lg"
                    >
                      Voir l’outil
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
