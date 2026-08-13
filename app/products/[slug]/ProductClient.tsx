"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../../context/CartContext";
import { trackViewContent } from "../../../lib/pixels";
import { getWhatsAppLink } from "../../../lib/contact";
import BeforeAfterSlider from "../../../components/BeforeAfterSlider";
import {
  products,
  productThumb,
  productCoverClass,
  productBeforeAfter,
  PDP_PROOF,
  type Product,
} from "../../../lib/products";

function imgClass(src?: string, slug?: string) {
  return productCoverClass(src ?? "", slug);
}

function IconCheck() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#C45B6A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function Fold({
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
        <p className="mb-4 text-[11px] font-medium tracking-[0.28em] text-[#C4A484]">VIDÉO</p>
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
    <section className="bg-[#F7F1EC] py-12 md:py-20">
      <div className="container mx-auto px-4">
        <p className="text-[11px] font-medium tracking-[0.32em] text-[#C4A484]">AVIS CLIENTES</p>
        <h2 className="font-display mt-3 text-3xl font-semibold text-[#1C1412] md:text-5xl">Ce qu’elles nous écrivent</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <blockquote key={`${r.name}-${r.city}`} className="bg-white p-6">
              {r.photo && <img src={r.photo} alt="" className="mb-4 aspect-[4/3] w-full object-cover" />}
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
}: {
  product: Product;
  onAdd: (price: number, qty: number) => void;
}) {
  const [fold, setFold] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const whatsapp = getWhatsAppLink(`Bonjour, j’aimerais des informations sur Raonaq ${product.name}`);
  const toggle = (id: string) => setFold((cur) => (cur === id ? null : id));

  return (
    <div>
      <p className="text-[11px] font-medium tracking-[0.28em] text-[#C4A484]">RAONAQ</p>
      <h1 className="font-display mt-1 text-4xl font-semibold leading-[1.05] tracking-wide text-[#1C1412] md:text-5xl">
        {product.name}
      </h1>
      <p className="mt-1.5 text-sm text-[#1C1412]/55">{product.nameFr}</p>

      <div className="mt-5 flex items-baseline gap-2">
        <p className="text-4xl font-semibold leading-none text-[#C45B6A]">
          {product.price1}
          <span className="ml-1.5 text-lg font-medium">Dhs</span>
        </p>
      </div>
      <p className="mt-1.5 text-[12px] text-[#1C1412]/45">Paiement à la livraison · inspectez d’abord</p>

      <ul className="mt-5 space-y-2.5 border-y border-[#1C1412]/8 py-4">
        {[
          { t: "Livraison rapide au Maroc", d: "Gratuite, généralement 24–48 h" },
          { t: "Paiement à la livraison", d: "Disponible — inspectez, puis payez" },
          { t: "Pièce Raonaq", d: "Écrin d’origine, confirmation par téléphone" },
          { t: "220–240 V", d: "Prises marocaines, sans adaptateur" },
        ].map((item) => (
          <li key={item.t} className="flex gap-2.5">
            <IconCheck />
            <span>
              <span className="block text-[13px] font-semibold text-[#1C1412]">{item.t}</span>
              <span className="block text-[12px] text-[#1C1412]/50">{item.d}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[11px] font-medium tracking-[0.2em] text-[#C4A484]">POURQUOI VOUS ALLEZ L’AIMER</p>
      <ul className="mt-3 space-y-2">
        {product.features.slice(0, 4).map((line) => (
          <li key={line} className="flex gap-2.5 text-[13px] leading-6 text-[#1C1412]/80">
            <IconCheck />
            {line}
          </li>
        ))}
      </ul>

      <div className="mt-5 border border-[#1C1412]/10 bg-[#F7F1EC] px-4 py-3.5">
        <p className="text-[11px] font-medium tracking-[0.18em] text-[#C45B6A]">LIVRAISON</p>
        <p className="mt-1 text-[15px] font-semibold text-[#1C1412]">Chez vous, généralement 24–48 h</p>
        <p className="mt-0.5 text-[12px] text-[#1C1412]/50">Tout le Maroc · gratuite · confirmation par téléphone</p>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-12 items-center border border-[#1C1412]/12">
          <button
            type="button"
            className="h-12 w-11 text-lg text-[#1C1412]/60"
            onClick={() => setQty((n) => Math.max(1, n - 1))}
            aria-label="Moins"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-semibold">{qty}</span>
          <button
            type="button"
            className="h-12 w-11 text-lg text-[#1C1412]/60"
            onClick={() => setQty((n) => Math.min(6, n + 1))}
            aria-label="Plus"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => onAdd(product.price1, qty)}
          className="btn btn-primary min-h-12 flex-1 px-4 text-[13px] sm:text-sm"
        >
          Acheter — {product.price1 * qty} Dhs
        </button>
      </div>
      <button
        type="button"
        onClick={() => onAdd(product.price2, 2)}
        className="btn btn-secondary btn-block mt-2 min-h-11 text-sm"
      >
        Deux pièces — {product.price2} Dhs
      </button>
      <p className="mt-2 text-center text-[12px] font-medium text-[#1C1412]/50">Paiement à la livraison</p>

      {whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center text-[12px] font-medium text-[#C45B6A] underline-offset-4 hover:underline"
        >
          Une question ? WhatsApp
        </a>
      )}

      <div className="mt-6">
        <Fold title="Description" open={fold === "desc"} onToggle={() => toggle("desc")}>
          <p>{product.description}</p>
          <p className="mt-2">{product.promise}</p>
        </Fold>
        <Fold title="Caractéristiques" open={fold === "specs"} onToggle={() => toggle("specs")}>
          <ul className="space-y-1.5">
            {product.specs.map((s) => (
              <li key={s.k}>
                <span className="font-semibold text-[#1C1412]">{s.k} — </span>
                {s.v}
              </li>
            ))}
          </ul>
        </Fold>
        <Fold title="Inclus dans l’écrin" open={fold === "box"} onToggle={() => toggle("box")}>
          <ul className="space-y-1">
            {product.inBox.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </Fold>
        <Fold title="Livraison & paiement" open={fold === "ship"} onToggle={() => toggle("ship")}>
          Gratuite dans tout le Maroc, généralement 24 à 48 h. Nous confirmons par téléphone. Le livreur attend : vous ouvrez, vous inspectez, puis vous payez. Un défaut se règle sur WhatsApp — nous remplaçons.
        </Fold>
      </div>
    </div>
  );
}

export default function ProductClient({ product }: { product: Product }) {
  const { addToCart, isCartOpen, isCheckoutOpen } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const others = products.filter((p) => p.id !== product.id).slice(0, 4);
  const beforeAfter = productBeforeAfter(product);
  const whatsapp = getWhatsAppLink(`Bonjour, j’aimerais des informations sur Raonaq ${product.name}`);

  useEffect(() => {
    trackViewContent({ id: product.id, name: `Raonaq ${product.name}`, price: product.price1 });
  }, [product.id, product.name, product.price1]);

  useEffect(() => {
    setSelectedImage(0);
    setOpenFaq(0);
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
      price: qty > 1 && price === product.price2 ? price / qty : product.price1,
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

      <div className="container mx-auto px-4 pt-3 lg:px-8 lg:pt-5">
        <nav className="text-[11px] font-medium text-[#1C1412]/40">
          <Link href="/collection" className="hover:text-[#C45B6A]">
            Collection
          </Link>
          <span className="mx-1.5">/</span>
          <span>{product.name}</span>
        </nav>
      </div>

      <section className="bg-white">
        <div className="container mx-auto grid items-start gap-6 px-0 py-3 md:grid-cols-2 md:gap-10 md:px-4 lg:gap-14 lg:px-8 lg:py-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="min-w-0">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#F7F1EC] md:aspect-auto md:h-[min(72vh,680px)]">
              <button type="button" onClick={() => setZoomOpen(true)} className="absolute inset-0 cursor-zoom-in" aria-label="Agrandir">
                <img
                  src={galleryShot?.src}
                  alt={`${product.name} — ${galleryShot?.label ?? ""}`}
                  className={`h-full w-full ${imgClass(galleryShot?.src, product.slug)}`}
                />
              </button>
            </div>
            <div className="mt-2 flex gap-1.5 overflow-x-auto px-3 pb-1 md:mt-3 md:flex-wrap md:gap-2 md:overflow-visible md:px-0">
              {product.gallery.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  aria-label={img.label}
                  className={`h-[72px] w-[72px] shrink-0 overflow-hidden border md:h-20 md:w-20 ${
                    selectedImage === i ? "border-[#C45B6A]" : "border-transparent"
                  }`}
                >
                  <img src={img.src} alt="" className={`h-full w-full ${imgClass(img.src, product.slug)}`} loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 md:sticky md:top-36 md:self-start md:px-0">
            <BuyPanel product={product} onAdd={add} />
          </div>
        </div>
      </section>

      <section className="bg-[#F7F1EC] py-12 md:py-20">
        <div className="container mx-auto px-4">
          <p className="text-[11px] font-medium tracking-[0.28em] text-[#C4A484]">RAONAQ {product.name}</p>
          <h2 className="font-display mt-2 max-w-xl text-3xl font-semibold leading-tight text-[#1C1412] md:text-[2.6rem]">
            {product.techTitle}
          </h2>
          <ul className="mt-7 max-w-2xl space-y-3.5">
            {product.techPoints.map((point) => (
              <li key={point} className="flex gap-3 text-[15px] leading-7 text-[#1C1412]/75">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C45B6A]" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-[#1C1412]/8 bg-white">
        <div className="container mx-auto grid sm:grid-cols-2 lg:grid-cols-4">
          {PDP_PROOF.map((item) => (
            <div key={item.t} className="border-[#1C1412]/8 px-5 py-7 sm:border-r sm:last:border-r-0 lg:[&:nth-child(2)]:border-r">
              <p className="text-[13px] font-semibold text-[#1C1412]">{item.t}</p>
              <p className="mt-1.5 text-[12px] leading-5 text-[#1C1412]/50">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-10 md:py-14">
        <div className="container mx-auto max-w-3xl px-4">
          <p className="text-[11px] font-medium tracking-[0.28em] text-[#C4A484]">AVANT / APRÈS</p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-[#1C1412] md:text-4xl">Glissez — la différence se voit</h2>
          <p className="mt-2 text-sm text-[#1C1412]/50">Le trait bouge avec votre doigt.</p>
          <div className="mt-6 overflow-hidden">
            <BeforeAfterSlider src={beforeAfter.src} />
          </div>
        </div>
      </section>

      <section className="bg-[#F7F1EC] py-12 md:py-20">
        <div className="container mx-auto px-4">
          <p className="text-[11px] font-medium tracking-[0.28em] text-[#C4A484]">VOTRE CHEVEU</p>
          <h2 className="font-display mt-2 max-w-xl text-3xl font-semibold text-[#1C1412] md:text-[2.6rem]">
            Quelle chaleur pour vos cheveux ?
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#1C1412]/55">
            Choisissez selon votre cheveu. En cas de doute, commencez toujours plus bas.
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {product.hairGuide.map((item) => (
              <article key={item.label} className="bg-white px-5 py-6">
                <h3 className="text-[15px] font-semibold text-[#1C1412]">{item.label}</h3>
                <p className="mt-3 font-display text-2xl font-semibold text-[#C45B6A]">{item.setting}</p>
                <p className="mt-2 text-[13px] leading-6 text-[#1C1412]/55">{item.note}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 max-w-2xl text-[13px] leading-6 text-[#1C1412]/50">{product.protectHow}</p>
        </div>
      </section>

      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <p className="text-[11px] font-medium tracking-[0.28em] text-[#C4A484]">LE GESTE</p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-[#1C1412] md:text-[2.6rem]">En quatre étapes</h2>
          <p className="mt-2 text-sm text-[#1C1412]/45">{product.styleTime}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {product.howTo.slice(0, 4).map((step, i) => (
              <article key={step} className="bg-[#F7F1EC] p-4">
                <p className="text-[11px] font-medium tracking-[0.2em] text-[#C4A484]">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-2 text-sm font-medium leading-6 text-[#1C1412]">{step}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ProductVideo product={product} />
      <ReviewsSlot product={product} />

      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <p className="text-[11px] font-medium tracking-[0.28em] text-[#C4A484]">QUESTIONS FRÉQUENTES</p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-[#1C1412]">Avant de commander</h2>
          <div className="mt-6 border-t border-[#1C1412]/10">
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
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-sm font-medium text-[#C45B6A]"
            >
              Une question ? WhatsApp
            </a>
          )}
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-[#1C1412]/8 bg-[#F7F1EC] py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-semibold text-[#1C1412] md:text-3xl">Compléter le rituel</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
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
        <div className="fixed inset-x-0 bottom-0 z-[45] border-t border-[#1C1412]/10 bg-white/95 px-3 pt-2.5 backdrop-blur md:hidden pb-[max(0.6rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold text-[#1C1412]">{product.name}</p>
              <p className="text-[13px] font-semibold text-[#C45B6A]">{product.price1} Dhs</p>
            </div>
            <button
              type="button"
              onClick={() => add(product.price1, 1)}
              className="btn btn-primary btn-md min-h-12 shrink-0 px-5"
            >
              Acheter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
