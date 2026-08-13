"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "../../../context/CartContext";
import { trackViewContent } from "../../../lib/pixels";
import { getWhatsAppLink } from "../../../lib/contact";
import {
  products,
  productThumb,
  productCoverClass,
  productBeforeAfter,
  productStoryCards,
  PDP_TRUST,
  type Product,
} from "../../../lib/products";

function imgClass(src?: string, slug?: string) {
  return productCoverClass(src ?? "", slug);
}

function BuyFold({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#1C1412]/10">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 py-3.5 text-left"
        aria-expanded={open}
      >
        <span className="text-[13px] font-semibold text-[#1C1412]">{title}</span>
        <span className="text-sm font-semibold text-[#C4A484]">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="pb-4 text-[13px] leading-7 text-[#1C1412]/65">{children}</div>}
    </div>
  );
}

function ProductVideo({ product }: { product: Product }) {
  if (!product.video) return null;

  return (
    <section className="bg-[#1C1412] py-10 md:py-16">
      <div className="container mx-auto px-4">
        <video
          className="aspect-[16/9] w-full object-cover"
          poster={product.heroImage}
          controls
          playsInline
          preload="metadata"
        >
          <source src={product.video} />
        </video>
      </div>
    </section>
  );
}

function ReviewsSlot({ product }: { product: Product }) {
  const reviews = product.reviews ?? [];
  if (reviews.length === 0) return null;

  return (
    <section className="bg-[#F7F1EC] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <p className="text-[11px] font-medium tracking-[0.32em] text-[#C4A484]">AVIS CLIENTES</p>
        <h2 className="font-display mt-3 text-3xl font-semibold text-[#1C1412] md:text-5xl">La voix du Maroc</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <blockquote key={`${r.name}-${r.city}`} className="bg-white p-6">
              {r.photo && (
                <img src={r.photo} alt="" className="mb-4 aspect-[4/3] w-full object-cover" />
              )}
              <p className="text-[15px] leading-7 text-[#1C1412]/75">« {r.text} »</p>
              <footer className="mt-6">
                <p className="font-semibold text-[#1C1412]">{r.name}</p>
                <p className="text-sm text-[#C45B6A]">{r.city}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function BuyPanel({
  product,
  onAdd,
  ctaRef,
}: {
  product: Product;
  onAdd: (price: number, qty: number) => void;
  ctaRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const [fold, setFold] = useState<string | null>(null);
  const whatsapp = getWhatsAppLink(`Bonjour, j’aimerais des informations sur Raonaq ${product.name}`);
  const toggle = (id: string) => setFold((cur) => (cur === id ? null : id));

  return (
    <div>
      <p className="text-[11px] font-medium tracking-[0.32em] text-[#C4A484]">RAONAQ</p>
      <h1 className="font-display mt-2 text-[2.5rem] font-semibold tracking-wide text-[#1C1412] md:text-6xl">
        {product.name}
      </h1>
      <p className="mt-2 text-sm text-[#1C1412]/50">{product.nameFr}</p>
      <p className="mt-4 max-w-md text-[15px] leading-7 text-[#1C1412]/70">{product.tagline}</p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {product.chips.map((chip) => (
          <li key={chip} className="border border-[#1C1412]/10 px-3 py-1.5 text-[11px] font-medium tracking-wide text-[#1C1412]/70">
            {chip}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex items-end gap-3">
        <p className="text-4xl font-semibold leading-none text-[#C45B6A]">
          {product.price1}
          <span className="ml-1 text-base font-medium">Dhs</span>
        </p>
        <p className="pb-1 text-xs text-[#1C1412]/45">Paiement à la livraison</p>
      </div>

      <div ref={ctaRef} className="mt-6 space-y-2">
        <button type="button" onClick={() => onAdd(product.price1, 1)} className="btn btn-primary btn-block btn-lg min-h-14">
          Commander — {product.price1} Dhs
        </button>
        <button type="button" onClick={() => onAdd(product.price2, 2)} className="btn btn-secondary btn-block min-h-12 text-sm">
          Deux pièces — {product.price2} Dhs
        </button>
      </div>

      <div className="mt-7">
        <BuyFold title="Livraison" open={fold === "ship"} onToggle={() => toggle("ship")}>
          Gratuite dans tout le Maroc, généralement 24 à 48 h. Nous confirmons la commande par téléphone avant l’expédition.
        </BuyFold>
        <BuyFold title="Ouvrez, inspectez, puis payez" open={fold === "door"} onToggle={() => toggle("door")}>
          Le livreur attend. Si l’outil ne vous convient pas, vous ne payez pas. Un défaut de fabrication se règle sur WhatsApp : nous remplaçons.
        </BuyFold>
        <BuyFold title="Comment l’utiliser" open={fold === "how"} onToggle={() => toggle("how")}>
          <ol className="space-y-1.5">
            {product.howTo.map((step, i) => (
              <li key={step}>
                {i + 1}. {step}
              </li>
            ))}
          </ol>
          <p className="mt-2 text-[12px] text-[#1C1412]/45">{product.styleTime}</p>
        </BuyFold>
        <BuyFold title="Dans l’écrin" open={fold === "box"} onToggle={() => toggle("box")}>
          <ul className="space-y-1">
            {product.inBox.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </BuyFold>
      </div>

      {whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-[12px] font-medium text-[#1C1412]/40 underline-offset-4 hover:text-[#C45B6A] hover:underline"
        >
          Une question ? WhatsApp
        </a>
      )}
    </div>
  );
}

export default function ProductClient({ product }: { product: Product }) {
  const { addToCart, isCartOpen, isCheckoutOpen } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const others = products.filter((p) => p.id !== product.id).slice(0, 4);
  const beforeAfter = productBeforeAfter(product);
  const story = productStoryCards(product);
  const howImgs = [0, 3, 4, 1].map((i) => product.gallery[i] ?? product.gallery[0]);

  useEffect(() => {
    trackViewContent({ id: product.id, name: `Raonaq ${product.name}`, price: product.price1 });
  }, [product.id, product.name, product.price1]);

  useEffect(() => {
    setSelectedImage(0);
    setOpenFaq(null);
    setZoomOpen(false);
  }, [product.id]);

  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [zoomOpen]);

  const add = (price: number, qty: number) => {
    addToCart({
      id: product.id,
      name: `Raonaq ${product.name}`,
      price: qty > 1 ? price / qty : price,
      quantity: qty,
      image: productThumb(product),
    });
  };

  const galleryShot = product.gallery[selectedImage] ?? product.gallery[0];
  const showSticky = !isCartOpen && !isCheckoutOpen;

  return (
    <div className="min-h-screen overflow-x-hidden bg-white pb-28 md:pb-0">
      {zoomOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[80] flex cursor-zoom-out items-center justify-center bg-[#1C1412]/90 p-4"
          onClick={() => setZoomOpen(false)}
          aria-label="Fermer"
        >
          <img src={galleryShot?.src} alt="" className="max-h-[90vh] max-w-full object-contain" />
        </button>
      )}

      <div className="container mx-auto px-4 pt-4 lg:px-8 lg:pt-6">
        <nav className="text-[11px] font-medium text-[#1C1412]/40">
          <Link href="/collection" className="hover:text-[#C45B6A]">
            Collection
          </Link>
          <span className="mx-1.5">/</span>
          <span>{product.name}</span>
        </nav>
      </div>

      <section className="bg-white">
        <div className="container mx-auto grid items-start gap-6 px-4 py-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:px-8 lg:py-12">
          <div>
            <div className="aspect-[3/4] max-h-[52svh] overflow-hidden bg-[#F7F1EC] md:max-h-none md:aspect-[4/5]">
              <button type="button" onClick={() => setZoomOpen(true)} className="h-full w-full cursor-zoom-in" aria-label="Agrandir">
                <img
                  src={galleryShot?.src}
                  alt={`${product.name} — ${galleryShot?.label ?? ""}`}
                  className={`h-full w-full ${imgClass(galleryShot?.src, product.slug)}`}
                />
              </button>
            </div>
            <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
              {product.gallery.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  aria-label={img.label}
                  className={`h-14 w-14 shrink-0 overflow-hidden border md:h-16 md:w-16 lg:h-[72px] lg:w-[72px] ${
                    selectedImage === i ? "border-[#C45B6A]" : "border-transparent"
                  }`}
                >
                  <img src={img.src} alt="" className={`h-full w-full ${imgClass(img.src, product.slug)}`} loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <BuyPanel product={product} onAdd={add} ctaRef={ctaRef} />
          </div>
        </div>
      </section>

      <section className="border-y border-[#1C1412]/8 bg-[#F7F1EC]">
        <div className="container mx-auto grid grid-cols-2 gap-px md:grid-cols-4">
          {PDP_TRUST.map((item) => (
            <div key={item.t} className="bg-[#F7F1EC] px-3 py-4 text-center md:px-4 md:py-5">
              <p className="text-[11px] font-semibold leading-snug text-[#1C1412] md:text-[12px]">{item.t}</p>
              <p className="mt-1 text-[10px] text-[#1C1412]/45 md:text-[11px]">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-10 md:py-24">
        <div className="container mx-auto px-4">
          <p className="text-[11px] font-medium tracking-[0.32em] text-[#C4A484]">RAONAQ {product.name}</p>
          <h2 className="font-display mt-3 max-w-xl text-3xl font-semibold text-[#1C1412] md:text-5xl">{product.tagline}</h2>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {story.map((card) => (
              <article key={card.title} className="overflow-hidden bg-[#F7F1EC]">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={card.src} alt="" className={`h-full w-full ${imgClass(card.src, product.slug)}`} loading="lazy" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[#1C1412]">{card.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {beforeAfter && (
        <section className="bg-[#F7F1EC] py-10 md:py-24">
          <div className="container mx-auto max-w-3xl px-4">
            <p className="text-[11px] font-medium tracking-[0.32em] text-[#C4A484]">AVANT / APRÈS</p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-[#1C1412] md:text-5xl">La différence se voit</h2>
            <div className="mt-8 overflow-hidden bg-white">
              <img src={beforeAfter.src} alt={beforeAfter.label} className="w-full object-cover" loading="lazy" />
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-10 md:py-24">
        <div className="container mx-auto px-4">
          <p className="text-[11px] font-medium tracking-[0.32em] text-[#C4A484]">VOTRE CHEVEU</p>
          <h2 className="font-display mt-3 text-3xl font-semibold text-[#1C1412] md:text-5xl">La chaleur juste</h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {product.hairGuide.map((item) => (
              <article key={item.label} className="border border-[#1C1412]/8 p-5">
                <h3 className="text-base font-semibold text-[#1C1412]">{item.label}</h3>
                <p className="mt-2 text-sm font-medium text-[#C45B6A]">{item.setting}</p>
                <p className="mt-2 text-[13px] leading-6 text-[#1C1412]/55">{item.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F7F1EC] py-10 md:py-24">
        <div className="container mx-auto px-4">
          <p className="text-[11px] font-medium tracking-[0.32em] text-[#C4A484]">LE GESTE</p>
          <h2 className="font-display mt-3 text-3xl font-semibold text-[#1C1412] md:text-5xl">En quatre étapes</h2>
          <p className="mt-2 text-sm text-[#1C1412]/45">{product.styleTime}</p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {product.howTo.slice(0, 4).map((step, i) => (
              <article key={step} className="overflow-hidden bg-white">
                <div className="aspect-[4/5] overflow-hidden bg-[#F7F1EC]">
                  <img src={howImgs[i]?.src} alt="" className={`h-full w-full ${imgClass(howImgs[i]?.src, product.slug)}`} loading="lazy" />
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-medium tracking-[0.2em] text-[#C4A484]">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-2 text-sm font-medium leading-6 text-[#1C1412]">{step}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ProductVideo product={product} />

      <ReviewsSlot product={product} />

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <p className="text-[11px] font-medium tracking-[0.32em] text-[#C4A484]">AVANT DE COMMANDER</p>
          <h2 className="font-display mt-3 text-3xl font-semibold text-[#1C1412]">Questions</h2>
          <div className="mt-8 border-t border-[#1C1412]/10">
            {product.faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.q} className="border-b border-[#1C1412]/10">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    aria-expanded={open}
                  >
                    <span className="text-sm font-semibold text-[#1C1412]">{faq.q}</span>
                    <span className="text-[#C4A484]">{open ? "−" : "+"}</span>
                  </button>
                  {open && <p className="pb-4 text-sm leading-7 text-[#1C1412]/65">{faq.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-[#1C1412]/8 bg-[#F7F1EC] py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-semibold text-[#1C1412]">Compléter le rituel</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {others.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-white">
                    <img src={p.heroImage} alt={p.name} className={`h-full w-full ${imgClass(p.heroImage, p.slug)}`} loading="lazy" />
                  </div>
                  <p className="mt-2 text-[11px] tracking-[0.18em] text-[#C4A484]">{p.nameFr}</p>
                  <p className="font-display text-lg font-semibold text-[#1C1412]">{p.name}</p>
                  <p className="text-xs font-medium text-[#C45B6A]">{p.price1} Dhs</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {showSticky && (
        <div className="fixed inset-x-0 bottom-0 z-[45] border-t border-[#1C1412]/10 bg-white/95 px-4 pt-3 backdrop-blur md:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => add(product.price1, 1)}
            className="btn btn-primary btn-block btn-lg min-h-14 text-base"
          >
            Commander — {product.price1} Dhs
          </button>
        </div>
      )}
    </div>
  );
}
