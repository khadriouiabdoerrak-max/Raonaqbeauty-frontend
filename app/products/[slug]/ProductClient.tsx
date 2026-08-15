"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../../context/CartContext";
import { trackViewContent } from "../../../lib/pixels";
import { getWhatsAppLink } from "../../../lib/contact";
import BeforeAfterSlider from "../../../components/BeforeAfterSlider";
import ErrorBoundary from "../../../components/ErrorBoundary";
import Price from "../../../components/Price";
import ProductShot from "../../../components/ProductShot";
import PdpGalleryBanner from "../../../components/PdpGalleryBanner";
import PdpTrustStrip from "../../../components/PdpTrustStrip";
import ReviewMarquee from "../../../components/ReviewMarquee";
import { products, productThumb, type Product, type ProductReview } from "../../../lib/products";

/** Preuve COD — langage froid TikTok / Snap (Maroc) */
const COLD_PROOF: ProductReview[] = [
  {
    name: "Salma",
    city: "Casablanca",
    rating: 5,
    text: "J’avais peur de payer avant. J’ai ouvert devant le livreur, tout était bon — puis j’ai payé.",
  },
  {
    name: "Imane",
    city: "Rabat",
    rating: 5,
    text: "Le numéro était inconnu. J’ai répondu : c’était Raonaq pour confirmer. Livraison le lendemain.",
  },
  {
    name: "Nour",
    city: "Marrakech",
    rating: 5,
    text: "Résultat salon chez moi. Pas d’avance, livraison gratuite. Je recommande.",
  },
  {
    name: "Sara",
    city: "Fès",
    rating: 5,
    text: "Confirmation rapide. À la porte j’ai inspecté l’écrin — tout nickel.",
  },
  {
    name: "Yasmine",
    city: "Tanger",
    rating: 5,
    text: "WhatsApp au cas où. Livraison gratuite, paiement à la livraison. Simple.",
  },
];

const COLD_FAQS = [
  {
    q: "Je dois payer avant ?",
    a: "Non. Aucun paiement d’avance. Vous ouvrez l’écrin devant le livreur, vous inspectez, puis vous payez — seulement si tout vous convient.",
  },
  {
    q: "Vous m’appelez d’un numéro inconnu ?",
    a: "Souvent oui. Un conseiller Raonaq confirme votre adresse avant l’expédition (9h–21h, souvent sous 10 minutes). Répondez : c’est nous.",
  },
  {
    q: "Et si ça ne me plaît pas à la porte ?",
    a: "Vous ne payez pas. Le livreur attend pendant l’inspection. C’est la promesse Raonaq.",
  },
  {
    q: "Ça marche au Maroc (220 V) ?",
    a: "Oui. 220–240 V, prises de la maison, sans adaptateur.",
  },
  {
    q: "Et en cas de défaut ?",
    a: "Photo sur WhatsApp — nous remplaçons. L’inspection à la porte vous protège aussi avant de payer.",
  },
];

function IconCheck({ className = "mt-0.5 h-4 w-4 shrink-0 text-[#C45B6A]" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
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

function BuyPanel({
  product,
  onAdd,
  proofItems,
}: {
  product: Product;
  onAdd: (price: number, qty: number) => void;
  proofItems: ProductReview[];
}) {
  const [fold, setFold] = useState<string | null>("ship");
  const [qty, setQty] = useState(1);
  const whatsapp = getWhatsAppLink(
    `Bonjour Raonaq, je suis intéressée par ${product.name}. Pouvez-vous m’aider ?`,
  );
  const toggle = (id: string) => setFold((cur) => (cur === id ? null : id));

  return (
    <div>
      <p className="text-[11px] font-medium tracking-[0.28em] text-[#C45B6A]">RAONAQ · MAROC</p>
      <h1 className="font-display mt-1.5 text-4xl font-semibold leading-[1.05] tracking-wide text-[#1C1412] md:text-5xl">
        {product.name}
      </h1>
      <p className="font-display mt-2 text-xl leading-snug text-[#1C1412]/75 md:text-2xl">
        {product.nameFr}
      </p>

      {/* Pain → résultat — froid ads */}
      <p className="mt-4 text-[15px] font-semibold leading-snug text-[#1C1412]">
        {product.compareLine || product.result}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-[#1C1412]/55">
        {product.pain} — <span className="font-medium text-[#1C1412]">{product.promise}</span>
      </p>

      <div className="mt-5">
        <Price amount={product.price1} was={product.priceWas} size="lg" />
      </div>
      <p className="mt-1.5 text-[12px] font-medium text-[#C45B6A]">
        Paiement à la porte · ouvrez, inspectez, puis payez
      </p>

      {/* CTA d’abord — cold traffic */}
      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-stretch gap-2">
          <div className="flex h-14 shrink-0 items-center overflow-hidden border border-[#1C1412]/12">
            <button
              type="button"
              className="h-14 w-11 text-lg text-[#1C1412]/60"
              onClick={() => setQty((n) => Math.max(1, n - 1))}
              aria-label="Moins"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold">{qty}</span>
            <button
              type="button"
              className="h-14 w-11 text-lg text-[#1C1412]/60"
              onClick={() => setQty((n) => Math.min(6, n + 1))}
              aria-label="Plus"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => onAdd(product.price1, qty)}
            className="btn btn-primary min-h-14 flex-1 rounded-none px-3 text-[13px] font-semibold tracking-wide"
          >
            Commander
          </button>
        </div>
        <button
          type="button"
          onClick={() => onAdd(product.price2, 2)}
          className="btn btn-secondary btn-block min-h-12 rounded-none text-[13px]"
        >
          Deux pièces — {product.price2} Dhs
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-[#1C1412]/45">
        Confirmation par téléphone · livraison gratuite 24–48 h
      </p>

      {/* Objections COD */}
      <ul className="mt-5 space-y-3 border-y border-[#1C1412]/8 py-4">
        {[
          {
            t: "Zéro avance",
            d: "Vous payez à la porte, après inspection.",
          },
          {
            t: "On vous appelle",
            d: "Numéro parfois inconnu — répondez : c’est Raonaq.",
          },
          {
            t: "Livraison gratuite",
            d: "Tout le Maroc · généralement 24–48 h.",
          },
          {
            t: "220–240 V",
            d: "Prises marocaines, sans adaptateur.",
          },
        ].map((item) => (
          <li key={item.t} className="flex gap-2.5">
            <IconCheck />
            <span>
              <span className="block text-[13px] font-semibold text-[#1C1412]">{item.t}</span>
              <span className="block text-[12px] leading-snug text-[#1C1412]/50">{item.d}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[11px] font-medium tracking-[0.2em] text-[#C4A484]">CE QUI CHANGE</p>
      <ul className="mt-3 space-y-2">
        {product.features.slice(0, 4).map((line) => (
          <li key={line} className="flex gap-2.5 text-[13px] leading-6 text-[#1C1412]/80">
            <IconCheck />
            {line}
          </li>
        ))}
      </ul>

      {whatsapp && (
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block text-center text-[12px] font-semibold text-[#C45B6A] underline-offset-4 hover:underline"
        >
          Une question avant ? WhatsApp
        </a>
      )}

      <ReviewMarquee items={proofItems} />

      <div className="mt-6">
        <Fold title="Livraison & paiement" open={fold === "ship"} onToggle={() => toggle("ship")}>
          Gratuite dans tout le Maroc, généralement 24–48 h. Nous confirmons par téléphone (souvent sous
          10 min entre 9h et 21h). Le livreur attend : vous ouvrez, vous inspectez, puis vous payez. Un
          défaut se règle sur WhatsApp — remplacement.
        </Fold>
        <Fold title="Description" open={fold === "desc"} onToggle={() => toggle("desc")}>
          <p>{product.description}</p>
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
        <Fold title="Dans l’écrin" open={fold === "box"} onToggle={() => toggle("box")}>
          <ul className="space-y-1">
            {product.inBox.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </Fold>
      </div>
    </div>
  );
}

export default function ProductClient({ product }: { product: Product }) {
  const { addToCart, isCartOpen, isCheckoutOpen } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const others = products.filter((p) => p.id !== product.id).slice(0, 4);
  const whatsapp = getWhatsAppLink(
    `Bonjour Raonaq, je suis intéressée par ${product.name}. Pouvez-vous m’aider ?`,
  );

  const faqs = [
    ...COLD_FAQS,
    ...product.faqs.filter((f) => !COLD_FAQS.some((c) => c.q === f.q)),
  ].slice(0, 8);

  const voices: ProductReview[] = [
    ...(product.voice?.name && product.voice?.text
      ? [
          {
            name: product.voice.name,
            city: product.voice.city,
            text: product.voice.text,
            rating: 5,
          },
        ]
      : []),
    ...(product.reviews?.length ? product.reviews : []),
    ...COLD_PROOF,
  ];
  // unique by name+city
  const proofItems = voices.filter(
    (v, i, arr) => arr.findIndex((x) => x.name === v.name && x.city === v.city) === i,
  );

  useEffect(() => {
    trackViewContent({ id: product.id, name: `Raonaq ${product.name}`, price: product.price1 });
  }, [product.id, product.name, product.price1]);

  useEffect(() => {
    setSelectedImage(0);
    setOpenFaq(0);
  }, [product.id]);

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
      <div className="container mx-auto px-4 pt-2 md:pt-3 lg:px-8 lg:pt-5">
        <nav className="text-[11px] font-medium text-[#1C1412]/40">
          <Link href="/collection" className="hover:text-[#C45B6A]">
            Collection
          </Link>
          <span className="mx-1.5">/</span>
          <span>{product.name}</span>
        </nav>
      </div>

      {/* 1. Gallery + Buy — above the fold */}
      <section className="bg-white">
        <div className="container mx-auto grid max-w-full grid-cols-1 items-start gap-4 overflow-x-hidden px-0 pb-2 pt-2 md:grid-cols-2 md:gap-10 md:px-4 md:pb-0 md:pt-3 lg:gap-14 lg:px-8 lg:py-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="min-w-0 max-w-full overflow-hidden">
            <PdpGalleryBanner product={product} />
            <ProductShot
              src={galleryShot?.src ?? product.heroImage}
              alt={`${product.name} — ${galleryShot?.label ?? ""}`}
              variant="card"
              priority
            />
            <div className="flex max-w-full gap-1.5 overflow-x-auto px-3 py-2 md:mt-3 md:flex-wrap md:gap-2 md:overflow-visible md:px-0">
              {product.gallery.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  aria-label={img.label}
                  aria-current={selectedImage === i}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden border bg-white md:h-[88px] md:w-[88px] ${
                    selectedImage === i ? "border-[#C45B6A]" : "border-[#1C1412]/10"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 md:sticky md:top-36 md:self-start md:px-0">
            <BuyPanel product={product} onAdd={add} proofItems={proofItems} />
          </div>
        </div>
      </section>

      {/* Trust marquee — livraison, COD, retour, support */}
      <PdpTrustStrip />

      {/* 3. Résultat / émotion */}
      <section className="bg-[#F7F1EC] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <p className="text-[11px] font-medium tracking-[0.28em] text-[#C45B6A]">LE RÉSULTAT</p>
          <h2 className="font-display mt-2 max-w-xl text-3xl font-semibold leading-tight text-[#1C1412] md:text-4xl">
            {product.techTitle}
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#1C1412]/55">
            {product.promise}
          </p>
          <ul className="mt-7 max-w-2xl space-y-3.5">
            {product.techPoints.map((point) => (
              <li key={point} className="flex gap-3 text-[15px] leading-7 text-[#1C1412]/75">
                <IconCheck className="mt-1.5 h-4 w-4 shrink-0 text-[#C45B6A]" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Avant / après */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto max-w-lg px-4">
          <p className="text-[11px] font-medium tracking-[0.32em] text-[#C45B6A]">AVANT · APRÈS</p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-[#1C1412] md:text-4xl">
            Chez vous, ça se voit
          </h2>
          <div className="mt-8 overflow-hidden border border-[#C4A484]/25">
            <ErrorBoundary>
              <BeforeAfterSlider />
            </ErrorBoundary>
          </div>
        </div>
      </section>

      {/* 5. removed — avis déjà en marquee dans le buy panel */}

      {/* 6. Comment faire — simple */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <p className="text-[11px] font-medium tracking-[0.28em] text-[#C45B6A]">LE GESTE</p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-[#1C1412] md:text-4xl">
            En quelques étapes
          </h2>
          <p className="mt-2 text-sm text-[#1C1412]/45">{product.styleTime}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {product.howTo.slice(0, 4).map((step, i) => (
              <article key={step} className="bg-[#F7F1EC] p-5">
                <p className="font-display text-2xl font-semibold text-[#C4A484]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm font-medium leading-6 text-[#1C1412]">{step}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 max-w-2xl text-[13px] leading-6 text-[#1C1412]/50">{product.protectHow}</p>
        </div>
      </section>

      {/* 7. FAQ froid — objections ads */}
      <section className="border-t border-[#1C1412]/8 bg-[#F7F1EC] py-12 md:py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <p className="text-[11px] font-medium tracking-[0.28em] text-[#C45B6A]">AVANT DE COMMANDER</p>
          <h2 className="font-display mt-2 text-3xl font-semibold text-[#1C1412]">
            Les peurs, on les connaît
          </h2>
          <div className="mt-6 border-t border-[#1C1412]/10 bg-white px-4 md:px-6">
            {faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.q} className="border-b border-[#1C1412]/10 last:border-b-0">
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
              className="mt-6 inline-block text-sm font-semibold text-[#C45B6A]"
            >
              Encore une question ? WhatsApp
            </a>
          )}
        </div>
      </section>

      {/* 8. Parcours Raonaq — compact + CTA panier */}
      <section className="relative overflow-hidden bg-[#1C1412] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(196,164,132,0.22),transparent)]" />
        <div className="relative mx-auto max-w-2xl px-5 py-10 text-center md:py-12">
          <p className="font-display text-2xl font-semibold tracking-[0.1em] text-[#C4A484]">رونق</p>
          <h2 className="font-display mt-3 text-2xl font-semibold leading-tight md:text-3xl">
            De la commande à votre porte
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-white/50">
            Appel de confirmation · livraison gratuite · payez après inspection.
          </p>

          <ol className="mx-auto mt-6 w-full max-w-md space-y-3 text-left">
            {[
              { n: "01", t: "Commande", d: "Sans avance" },
              { n: "02", t: "Appel", d: "9h–21h" },
              { n: "03", t: "Livraison", d: "Puis payez" },
            ].map((s) => (
              <li
                key={s.n}
                className="flex w-full items-baseline justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex min-w-0 items-baseline gap-3">
                  <p className="font-display shrink-0 text-base font-semibold text-[#C4A484]">{s.n}</p>
                  <p className="text-[14px] font-semibold text-white">{s.t}</p>
                </div>
                <p className="shrink-0 text-[12px] text-white/40">{s.d}</p>
              </li>
            ))}
          </ol>

          <p className="mx-auto mt-4 w-full max-w-md text-left text-[12px] leading-snug text-white/35">
            Numéro inconnu ? <span className="text-white/60">Répondez — c’est Raonaq.</span>
          </p>

          <button
            type="button"
            onClick={() => add(product.price1, 1)}
            className="btn btn-primary btn-lg mt-7 min-w-[200px] rounded-none"
          >
            Commander
          </button>
          <p className="mt-2.5 text-[11px] text-white/35">
            {product.price1} Dhs · ouvrir · inspecter · payer
          </p>
        </div>
      </section>

      {/* 9. Cross-sell léger */}
      {others.length > 0 && (
        <section className="border-t border-[#1C1412]/8 bg-[#F7F1EC] py-12 md:py-16">
          <div className="container mx-auto px-4">
            <p className="text-[11px] font-medium tracking-[0.28em] text-[#C45B6A]">COLLECTION</p>
            <h2 className="font-display mt-2 text-2xl font-semibold text-[#1C1412] md:text-3xl">
              Autres outils Raonaq
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {others.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group block">
                  <ProductShot src={p.heroImage} alt={p.name} variant="card" />
                  <p className="mt-2 text-[11px] tracking-[0.18em] text-[#C4A484]">{p.nameFr}</p>
                  <p className="font-display text-lg font-semibold text-[#1C1412]">{p.name}</p>
                  <p className="text-xs font-medium text-[#C45B6A]">{p.price1} Dhs</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky mobile — cold CTA */}
      {showSticky && (
        <div className="fixed inset-x-0 bottom-0 z-[45] border-t border-[#1C1412]/10 bg-white/95 px-3 pt-2.5 backdrop-blur md:hidden pb-[max(0.65rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg font-semibold text-[#1C1412]">{product.name}</p>
              <p className="text-[11px] font-medium text-[#C45B6A]">À la porte · sans avance</p>
            </div>
            <button
              type="button"
              onClick={() => add(product.price1, 1)}
              className="btn btn-primary min-h-12 shrink-0 rounded-none px-5 text-sm font-semibold"
            >
              Commander
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
