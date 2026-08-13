"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { products, productThumb } from "../lib/products";
import { useInView } from "../lib/useInView";
import ProductCarousel from "../components/ProductCarousel";

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function BeforeAfterResultVisual() {
  return (
    <div
      className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[36px] border border-white/70 bg-white p-3 shadow-[0_30px_80px_rgba(28,20,18,0.14)]"
      aria-label="Avant et après Raonaq"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#F7F1EC]">
        <img
          src="/raonaq-before-after-woman.png"
          alt="Avant et après Raonaq"
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412]/28 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-[#1C1412]/70 px-4 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur">
          Avant
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-semibold tracking-wide text-[#C45B6A] shadow-lg">
          Après
        </span>

        <div className="before-after-sweep absolute bottom-0 top-0 z-10 w-[3px] bg-white shadow-[0_0_22px_rgba(255,255,255,0.9)]" />
        <div className="before-after-sweep absolute top-1/2 z-20 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white text-lg font-semibold text-[#C45B6A] shadow-2xl">
          →
        </div>
      </div>
    </div>
  );
}

const heroImage = "/images/raonaq-hero-branded.png";
const heroMobileImage = "/images/raonaq-hero-mobile.png";
const lifestyleImage = "/images/raonaq-lifestyle-home.png";
const toolsImage = "/images/raonaq-tools-editorial.png";

const featured = products[0];
const homeReviews = products.flatMap((p) => p.reviews ?? []).slice(0, 6);

const looks = [
  {
    title: "Volume",
    en: "VOLUME",
    image: "/images/raonaq-hair-blowout.png",
    href: "/products/raonaq-volume",
    product: "VOLUME",
    line: "Du lift dès les racines",
  },
  {
    title: "Lisse",
    en: "SMOOTH",
    image: "/images/raonaq-hair-straight.png",
    href: "/products/raonaq-trio",
    product: "TRIO",
    line: "Fluide et brillant, chez vous",
  },
  {
    title: "Épais",
    en: "SOFT",
    image: "/images/raonaq-hair-curls.png",
    href: "/products/raonaq-air-soft",
    product: "SOFT",
    line: "Pour cheveux denses et bouclés",
  },
  {
    title: "Quotidien",
    en: "JOUR",
    image: "/images/raonaq-hair-waves.png",
    href: "/products/raonaq-air-pink",
    product: "JOUR",
    line: "Un look net avant de sortir",
  },
];

const faqs = [
  {
    q: "Puis-je inspecter avant de payer ?",
    a: "Oui. Le livreur attend à la porte. Vous ouvrez, vous vérifiez, puis vous payez. Aucun paiement d’avance.",
  },
  {
    q: "La livraison est-elle gratuite ? Combien de temps ?",
    a: "Gratuite dans tout le Maroc. Généralement 24 à 48 h selon la ville.",
  },
  {
    q: "Comment choisir l’outil ?",
    a: "VOLUME pour le volume, SOFT pour les cheveux épais, JOUR pour le quotidien, TRIO pour le coffret complet.",
  },
  {
    q: "Pourquoi Raonaq ?",
    a: "Une maison marocaine, une collection courte, une protection du cheveu — et la confiance à la porte.",
  },
];

export default function Home() {
  const { addToCart } = useCart();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const addOne = (id: string, name: string, price: number, image: string, qty = 1) => {
    addToCart({
      id,
      name,
      price: qty > 1 ? price / qty : price,
      quantity: qty,
      image,
    });
  };

  return (
    <div className="overflow-x-hidden bg-[#F7F1EC]">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[85svh] overflow-hidden bg-[#1C1412] md:min-h-[100svh]">
        <picture>
          <source srcSet={heroMobileImage} media="(max-width: 767px)" />
          <img
            src={heroImage}
            alt="Raonaq — le salon, chez vous"
            className="hero-media absolute inset-0 h-full w-full object-cover object-[center_top] md:object-[center_18%]"
            loading="eager"
            decoding="async"
          />
        </picture>
        {/* تدرج ناعم — الصورة هي البطلة */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-[#1C1412]/45 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#1C1412]/50 to-transparent md:h-36" />
        <div className="absolute inset-y-0 right-0 hidden w-[55%] bg-gradient-to-l from-[#1C1412]/70 via-[#1C1412]/20 to-transparent md:block" />

        <div className="relative z-10 flex min-h-[85svh] w-full items-end md:min-h-[100svh]">
          <div className="container mx-auto px-4 pb-8 pt-20 md:pb-28 md:pt-40">
            <div className="hero-copy me-auto max-w-lg text-left text-white">
              <h1 className="font-display text-4xl font-semibold leading-[1.12] text-white md:text-6xl">
                Le salon,
                <span className="text-[#C4A484]"> chez vous</span>
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75 md:text-base">
                Volume · lisse · brillance — avec protection, sans rendez-vous.
              </p>

              <div className="mt-8 flex w-full max-w-md flex-col gap-4">
                <Link
                  href="/collection"
                  className="btn btn-primary btn-lg flex w-full items-center justify-center py-4 text-center text-lg font-semibold shadow-[0_12px_40px_rgba(196,91,106,0.35)]"
                >
                  Commander · livraison gratuite
                </Link>
              </div>

              <div className="mt-5 flex flex-col gap-3 text-[13px] font-medium text-white/80 md:text-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C4A484]/20 text-[#C4A484]">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Paiement à la livraison — ouvrez, inspectez, puis payez
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C4A484]/20 text-[#C4A484]">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  Livraison 24–48 h dans tout le Maroc
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* وعد أنيق — ماشي بانر صاخب */}
      <section className="border-b border-[#C4A484]/20 bg-[#1C1412]">
        <div className="container mx-auto px-4 py-10 text-center md:py-12">
          <p className="text-[11px] font-medium tracking-[0.35em] text-[#C4A484]">LA PROMESSE</p>
          <p className="font-display mx-auto mt-3 max-w-xl text-3xl font-semibold leading-snug text-white md:text-4xl">
            Ouvrez · inspectez · puis payez
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm font-medium text-white/55">
            Aucun paiement d’avance — le livreur attend votre accord.
          </p>
        </div>
      </section>

      {/* ═══════════════ المنتج البطلة ═══════════════ */}
      <section className="relative overflow-hidden bg-[#F7F1EC]" id="featured">
        <div className="container mx-auto px-4 py-12 md:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-6">
            <FadeIn className="order-2 lg:order-1">
              <BeforeAfterResultVisual />
            </FadeIn>

            <FadeIn delay={120} className="order-1 space-y-6 text-left lg:order-2">
              <div>
                <p className="text-[11px] font-medium tracking-[0.3em] text-[#C45B6A]">LE COFFRET</p>
                <h2 className="font-display mt-2 text-4xl font-semibold leading-tight text-[#1C1412] md:text-5xl">
                  {featured.name}
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-[#1C1412]/65 md:text-lg">
                  {featured.tagline}
                </p>

                <ul className="mt-6 space-y-2.5 text-[#1C1412]/75">
                  {featured.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm font-medium md:text-base">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C45B6A]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════ النتيجة ═══════════════ */}
      <section className="relative min-h-[70vh] overflow-hidden bg-[#1C1412]" id="looks">
        <img
          src={lifestyleImage}
          alt="Coiffer chez soi avec Raonaq"
          className="absolute inset-0 h-full w-full object-cover object-[center_25%] opacity-50"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[#1C1412]/55" />
        <div className="relative z-10 flex min-h-[70vh] items-center">
          <div className="container mx-auto px-4 py-20">
            <FadeIn>
              <div className="max-w-lg text-left text-white">
                <p className="text-sm font-medium tracking-[0.25em] text-[#C4A484]">RAONAQ</p>
                <h2 className="font-display mt-4 text-4xl font-semibold leading-tight md:text-6xl">
                  Le salon
                  <br />
                  à la maison
                </h2>
                <p className="mt-5 text-lg text-white/75">
                  Volume, lisse et brillance — un résultat professionnel, sans rendez-vous.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════ اختاري الستايل ═══════════════ */}
      <section className="bg-white py-12 md:py-28">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="mb-12 max-w-xl text-left md:mb-16">
              <p className="text-sm font-medium tracking-[0.25em] text-[#C45B6A]">CHOISIR</p>
              <h2 className="font-display mt-3 text-4xl font-semibold text-[#1C1412] md:text-5xl">
                Quel résultat voulez-vous ?
              </h2>
              <p className="mt-4 text-lg text-[#1C1412]/60">
                Chaque outil a un rôle — volume, lisse ou quotidien.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {looks.map((look, i) => (
              <FadeIn key={look.en} delay={i * 70}>
                <Link href={look.href} className="group relative block aspect-[3/4] overflow-hidden">
                  <img
                    src={look.image}
                    alt={look.title}
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412]/80 via-[#1C1412]/10 to-transparent" />
                  <span
                    className="absolute left-2 top-6 hidden text-sm font-semibold tracking-[0.22em] text-white/90 sm:block md:left-4 md:top-10 md:text-xl"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    {look.en}
                  </span>
                  <div className="absolute inset-x-2 bottom-3 text-left md:inset-x-4 md:bottom-5">
                    <p className="text-base font-semibold text-white md:text-xl">{look.title}</p>
                    <p className="mt-0.5 text-[11px] font-medium text-white/80 md:mt-1 md:text-sm">{look.line}</p>
                    <p className="mt-1 text-[10px] font-semibold tracking-wide text-[#C4A484] md:mt-2 md:text-xs">
                      {look.product}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ المجموعة ═══════════════ */}
      <section id="shop" className="relative z-[1] bg-[#F7F1EC] py-12 md:py-28">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="mb-8 text-center md:mb-10">
              <p className="text-sm font-medium tracking-[0.25em] text-[#C45B6A]">COLLECTION</p>
              <h2 className="font-display mt-3 text-4xl font-semibold text-[#1C1412] md:text-5xl">
                L’outil qui vous ressemble
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#1C1412]/60">
                Une collection courte. Faites glisser pour tout voir.
              </p>
            </div>
          </FadeIn>

          <ProductCarousel
            onAdd={(product) =>
              addOne(product.id, `Raonaq ${product.name}`, product.price1, productThumb(product), 1)
            }
          />

          <div className="mt-8 text-center">
            <Link href="/collection" className="btn btn-secondary btn-lg">
              Voir toute la collection
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ الثقة ═══════════════ */}
      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[260px] md:min-h-[420px] overflow-hidden bg-[#1C1412]">
            <img
              src={toolsImage}
              alt="Outils Raonaq — résultat salon à la maison"
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="flex items-center bg-[#F7F1EC] px-6 py-16 md:px-14 md:py-24">
            <FadeIn>
              <div className="max-w-md space-y-6 text-left">
                <p className="text-sm font-medium tracking-[0.25em] text-[#C45B6A]">CONFIANCE</p>
                <h2 className="font-display text-4xl font-semibold leading-tight text-[#1C1412] md:text-5xl">
                  Vous ne payez
                  <br />
                  qu’après avoir vu
                </h2>
                <p className="text-lg leading-relaxed text-[#1C1412]/65">
                  La commande arrive chez vous. Vous ouvrez. Vous inspectez. Puis vous payez — seulement si tout vous convient.
                </p>
                <div className="space-y-3 pt-2 text-[#1C1412]/80">
                  {[
                    "Livraison gratuite jusqu’à la porte",
                    "Inspection devant le livreur",
                    "Paiement uniquement si vous gardez",
                  ].map((line) => (
                    <p key={line} className="flex items-center gap-3 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C45B6A]" />
                      {line}
                    </p>
                  ))}
                </div>
                <Link href="#shop" className="btn btn-dark btn-lg mt-4">
                  Commencer
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {homeReviews.length > 0 && (
        <section className="bg-[#F7F1EC] py-12 md:py-28">
          <div className="container mx-auto px-4">
            <FadeIn>
              <div className="mb-12 text-center">
                <p className="text-sm font-medium tracking-[0.25em] text-[#C45B6A]">AVIS</p>
                <h2 className="font-display mt-3 text-4xl font-semibold text-[#1C1412] md:text-5xl">Les voix du Maroc</h2>
              </div>
            </FadeIn>
            <div className="grid gap-4 md:grid-cols-3">
              {homeReviews.map((r) => (
                <blockquote key={`${r.name}-${r.city}-${r.text.slice(0, 24)}`} className="bg-white p-7">
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
      )}

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="bg-white py-12 md:py-28">
        <div className="container mx-auto max-w-3xl px-4">
          <FadeIn>
            <div className="mb-12 text-center">
              <p className="text-sm font-medium tracking-[0.25em] text-[#C45B6A]">QUESTIONS</p>
              <h2 className="font-display mt-3 text-4xl font-semibold text-[#1C1412] md:text-5xl">Avant de commander</h2>
            </div>
          </FadeIn>

          <div className="space-y-2">
            {faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <FadeIn key={faq.q} delay={i * 50}>
                  <div className={`border transition-colors ${open ? "border-[#C45B6A] bg-[#F7F1EC]/60" : "border-[#1C1412]/10"}`}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 p-5 text-left text-lg font-semibold text-[#1C1412]"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                    >
                      {faq.q}
                      <span className={`shrink-0 text-[#C45B6A] transition-transform ${open ? "rotate-180" : ""}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </span>
                    </button>
                    <div className={`overflow-hidden px-5 transition-all ${open ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                      <p className="leading-relaxed text-[#1C1412]/65">{faq.a}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ ختام ═══════════════ */}
      <section className="relative overflow-hidden bg-[#1C1412] py-24 text-center text-white md:py-32">
        <img
          src={heroImage}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_15%] opacity-25"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[#1C1412]/70" />
        <div className="relative z-10 container mx-auto max-w-xl px-4">
          <p className="font-display text-4xl font-semibold tracking-wide text-[#C4A484]">Raonaq</p>
          <h2 className="font-display mt-5 text-4xl font-semibold md:text-5xl">Le salon, chez vous</h2>
          <p className="mt-4 text-lg text-white/70">
            Volume · lisse · brillance, avec protection du cheveu
          </p>
          <Link href="/collection" className="btn btn-primary btn-lg mt-10">
            Voir la collection
          </Link>
        </div>
      </section>
    </div>
  );
}
