"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";
import { trackPurchase, type LastPurchase, type PixelContent } from "../../lib/pixels";
import { trackEvent } from "../../lib/track";
import { getWhatsAppLink } from "../../lib/contact";
import { clearPendingOrder, consumePurchaseForTracking, readLastOrder } from "../../lib/orders";
import { products, productThumb, type Product } from "../../lib/products";
import { SITE, getSocialLinks } from "../../lib/site";
import { getCallWindow, type CallWindow } from "../../lib/callWindow";

const PROOFS = [
  {
    name: "Salma",
    city: "Casablanca",
    text: "Ils m’ont appelée le jour même. À la porte j’ai ouvert, vérifié, puis payé. Simple.",
  },
  {
    name: "Imane",
    city: "Rabat",
    text: "Le numéro était inconnu — j’ai répondu. Commande confirmée en deux minutes.",
  },
  {
    name: "Nour",
    city: "Marrakech",
    text: "Livraison rapide. Résultat salon chez moi. Je recommande Raonaq.",
  },
];

function itemImage(id: string) {
  const product = products.find((p) => p.id === id);
  return product ? productThumb(product) : "";
}

function productById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

function IconWhatsApp({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function firstName(full?: string) {
  if (!full) return "";
  return full.trim().split(/\s+/)[0] || "";
}

function resultTease(boughtIds: string[]): { title: string; text: string } {
  const names = boughtIds
    .map((id) => productById(id)?.name)
    .filter(Boolean)
    .join(", ");
  if (boughtIds.includes("p1")) {
    return {
      title: "Trois looks, chez vous",
      text: "Lisse, ondulation, volume — TRIO arrive en écrin Raonaq. Après l’appel, la préparation part vite.",
    };
  }
  if (boughtIds.includes("p4")) {
    return {
      title: "Volume dès les racines",
      text: "VOLUME : effet salon sans rendez-vous. Répondez à l’appel — puis la livraison gratuite.",
    };
  }
  if (boughtIds.includes("p6")) {
    return {
      title: "Lisser et onduler",
      text: "DUO : un outil, deux gestes. Bientôt à votre porte — après un appel Raonaq.",
    };
  }
  return {
    title: names ? `Votre ${names}` : "Votre écrin Raonaq",
    text: "Résultat salon à la maison. On confirme, on prépare, on livre — vous inspectez, puis vous payez.",
  };
}

export default function ThankYouPage() {
  const { finishOrder } = useCart();
  const tracked = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [purchase, setPurchase] = useState<LastPurchase | null>(null);
  const [callWin, setCallWin] = useState<CallWindow | null>(null);
  const social = getSocialLinks();

  useEffect(() => {
    setMounted(true);
    finishOrder();
    clearPendingOrder();
    setCallWin(getCallWindow());

    const data = readLastOrder();
    if (data) {
      setPurchase(data);
    } else if (
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("demo") === "1"
    ) {
      setPurchase({
        orderId: 19,
        eventId: "demo",
        value: 249,
        contents: [
          { id: "p5", name: "Raonaq GO", price: 249, quantity: 1 },
        ],
        customer: {
          name: "Salma Test",
          phone: "0612345678",
          city: "Casablanca",
          address: "Hay Riad, Rue 12",
        },
      });
    }

    if (tracked.current) return;
    const forPixel = consumePurchaseForTracking();
    if (!forPixel) return;
    tracked.current = true;

    trackPurchase({
      orderId: forPixel.orderId,
      value: forPixel.value,
      eventId: forPixel.eventId,
      contents: forPixel.contents as PixelContent[],
    });
    trackEvent("purchase", {
      path: "/thank-you",
      source: `order_${forPixel.orderId}`,
      productId: forPixel.contents[0]?.id,
    });
  }, [finishOrder]);

  const customer = purchase?.customer;
  const hasCustomer = Boolean(customer?.name?.trim() && customer?.phone?.trim());
  const greetName = firstName(customer?.name);
  const hasItems = Boolean(purchase && purchase.contents.length > 0);
  const boughtIds = useMemo(() => purchase?.contents.map((c) => c.id) ?? [], [purchase]);
  const tease = useMemo(() => resultTease(boughtIds), [boughtIds]);

  const whatsappConfirm = getWhatsAppLink(
    (() => {
      const lines = ["Bonjour Raonaq,"];
      if (purchase?.orderId) lines.push(`Je confirme ma commande RQ-${purchase.orderId}.`);
      else lines.push("Je souhaite confirmer ma commande.");
      if (customer?.name) lines.push(`Nom : ${customer.name}`);
      if (customer?.phone) lines.push(`Téléphone : ${customer.phone}`);
      if (customer?.city) lines.push(`Ville : ${customer.city}`);
      if (customer?.address) lines.push(`Adresse : ${customer.address}`);
      lines.push("Je suis disponible pour l’appel de confirmation.");
      return lines.join("\n");
    })(),
  );

  const whatsappFix = getWhatsAppLink(
    purchase?.orderId
      ? `Bonjour Raonaq,\nJe souhaite corriger les infos de ma commande RQ-${purchase.orderId}.`
      : "Bonjour Raonaq,\nJe souhaite corriger les infos de ma commande.",
  );

  return (
    <div className="min-h-full bg-[#F7F1EC]">
      {/* Banner COD — après mount (évite hydration mismatch) */}
      {mounted && callWin ? (
        <div className="sticky top-0 z-40 border-b border-[#C4A484]/35 bg-[#F7F1EC]/95 text-[#1C1412] backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl flex-col gap-2.5 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-5 sm:px-6">
            <span className="inline-flex w-fit shrink-0 bg-[#C45B6A] px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-white">
              {callWin.badge}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold leading-snug text-[#1C1412]">{callWin.headline}</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-[#1C1412]/55">{callWin.detail}</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Hero marque — pearl / champagne */}
      <section className="relative overflow-hidden border-b border-[#C4A484]/25 bg-[#F7F1EC] text-[#1C1412]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-5%,rgba(196,164,132,0.4),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_95%_90%,rgba(196,91,106,0.1),transparent_55%)]" />
        <div className="relative mx-auto max-w-3xl px-5 py-12 text-center md:px-6 md:py-16">
          <p className="font-display text-4xl font-semibold tracking-[0.1em] text-[#C45B6A] md:text-5xl">
            رونق
          </p>
          <p className="mt-2 text-[10px] font-medium tracking-[0.48em] text-[#C4A484]">
            RAONAQ · MAISON MAROCAINE
          </p>
          <p className="mt-3 text-[13px] font-medium text-[#1C1412]/50">نتيجة صالون فدارك</p>

          <div className="mx-auto mt-8 h-px w-14 bg-[#C4A484]/60" />

          <h1 className="font-display mt-8 text-[2.4rem] leading-[1.08] font-semibold text-[#1C1412] md:text-5xl">
            {greetName ? (
              <>
                Merci,
                <br />
                <span className="text-[#C45B6A]">{greetName}</span>
              </>
            ) : (
              "Merci"
            )}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#1C1412]/55">
            Votre commande est enregistrée. Un appel Raonaq confirme l’adresse — puis l’écrin part vers vous.
          </p>

          {purchase?.orderId ? (
            <p className="mt-7 text-[13px] font-medium text-[#1C1412]/45">
              Référence{" "}
              <span className="font-display text-[1.35rem] font-semibold tracking-[0.04em] text-[#1C1412]">
                RQ-{purchase.orderId}
              </span>
            </p>
          ) : null}

          <a
            href={whatsappConfirm}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackEvent("whatsapp_click", {
                path: "/thank-you",
                source: "thankyou_confirm",
                productId: purchase?.contents[0]?.id,
              })
            }
            className="mt-8 inline-flex w-full max-w-sm items-center justify-center gap-2.5 bg-[#25D366] px-6 py-4 text-[15px] font-semibold text-white transition hover:brightness-95"
          >
            <IconWhatsApp className="h-5 w-5" />
            Confirmation via WhatsApp
          </a>
          <p className="mt-2.5 text-[12px] text-[#1C1412]/40">
            Un message suffit pour valider votre commande plus vite.
          </p>
        </div>
      </section>

      {/* Cadres Client + WhatsApp — pleine largeur, même colonne max-w-3xl */}
      <div className="w-full">
        {mounted && hasCustomer && customer ? (
          <section className="w-full bg-white">
            <div className="w-full bg-[#1C1412]">
              <div className="mx-auto flex max-w-3xl items-end justify-between gap-4 px-5 py-4 md:px-6">
                <div>
                  <p className="text-[10px] font-medium tracking-[0.32em] text-[#C4A484]">CLIENT RAONAQ</p>
                  <h2 className="font-display mt-1 text-xl font-semibold text-white md:text-2xl">
                    Vos informations
                  </h2>
                </div>
                {purchase?.orderId ? (
                  <p className="shrink-0 font-display text-[15px] font-semibold tracking-wide text-[#C4A484]">
                    RQ-{purchase.orderId}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mx-auto max-w-3xl px-5 py-6 md:px-6 md:py-8">
              <p className="text-[13px] leading-relaxed text-[#1C1412]/55">
                C’est sur ces coordonnées que nous appelons pour confirmer{" "}
                <span className="font-medium text-[#1C1412]">avant l’expédition</span>.
              </p>

              <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2 border-b border-[#1C1412]/06 pb-5">
                  <dt className="text-[10px] font-medium tracking-[0.24em] text-[#C45B6A]">NOM COMPLET</dt>
                  <dd className="font-display mt-1.5 break-words text-2xl font-semibold text-[#1C1412]">
                    {customer.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] font-medium tracking-[0.24em] text-[#C45B6A]">
                    TÉLÉPHONE · APPEL
                  </dt>
                  <dd className="mt-1.5 break-all text-xl font-semibold tracking-wide text-[#1C1412]" dir="ltr">
                    {customer.phone}
                  </dd>
                  <p className="mt-1 text-[12px] text-[#1C1412]/40">Le numéro qui sonnera</p>
                </div>
                <div>
                  <dt className="text-[10px] font-medium tracking-[0.24em] text-[#C45B6A]">VILLE</dt>
                  <dd className="mt-1.5 break-words text-xl font-semibold text-[#1C1412]">
                    {customer.city || "—"}
                  </dd>
                  <p className="mt-1 text-[12px] text-[#1C1412]/40">Livraison Maroc</p>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[10px] font-medium tracking-[0.24em] text-[#C45B6A]">
                    ADRESSE DE LIVRAISON
                  </dt>
                  <dd className="mt-1.5 break-words text-[15px] leading-relaxed text-[#1C1412]">
                    {customer.address || "—"}
                  </dd>
                </div>
              </dl>

              <div className="mt-7 grid gap-3 border-t border-[#1C1412]/08 pt-5 sm:grid-cols-2">
                <div className="bg-[#F7F1EC] px-4 py-3.5">
                  <p className="text-[12px] font-semibold text-[#1C1412]">Numéro inconnu ?</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#1C1412]/55">
                    Répondez — c’est un conseiller Raonaq.
                  </p>
                </div>
                <div className="bg-[#F7F1EC] px-4 py-3.5">
                  <p className="text-[12px] font-semibold text-[#1C1412]">Horaires d’appel</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#1C1412]/55">
                    9h–21h · souvent sous 10 minutes
                  </p>
                </div>
              </div>

              {whatsappFix && (
                <a
                  href={whatsappFix}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("whatsapp_click", {
                      path: "/thank-you",
                      source: "thankyou_fix",
                    })
                  }
                  className="mt-5 inline-block text-[13px] font-semibold text-[#C45B6A] underline-offset-4 hover:underline"
                >
                  Corriger mes informations
                </a>
              )}
            </div>
          </section>
        ) : null}
      </div>

      <div className="mx-auto max-w-3xl px-5 py-8 md:px-6 md:py-10">
        {/* Suite + émotion */}
        <section className="mt-10">
          <p className="text-[10px] font-medium tracking-[0.32em] text-[#C45B6A]">ENSUITE</p>
          <h2 className="font-display mt-1.5 text-2xl font-semibold text-[#1C1412]">{tease.title}</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-[#1C1412]/55">{tease.text}</p>

          <ol className="mt-7 space-y-0 border-t border-[#C4A484]/25">
            {[
              {
                t: "Vous répondez",
                d: "Appel Raonaq — parfois numéro inconnu. 1–2 min pour valider l’adresse.",
              },
              {
                t: "On prépare l’écrin",
                d: "Depuis Casablanca, souvent le jour même ou le lendemain.",
              },
              {
                t: "Chez vous · vous inspectez",
                d: "Livraison gratuite 24–48 h. Ouvrez, vérifiez, puis payez.",
              },
            ].map((s, i) => (
              <li
                key={s.t}
                className="flex gap-4 border-b border-[#C4A484]/25 py-5"
              >
                <span className="font-display text-2xl font-semibold text-[#C4A484]/70">
                  0{i + 1}
                </span>
                <div>
                  <p className="font-semibold text-[#1C1412]">{s.t}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#1C1412]/50">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Reçu aéré */}
        {hasItems && purchase && (
          <section className="mt-10 bg-white px-5 py-7 md:px-8 md:py-8">
            <div className="flex items-baseline justify-between gap-4 border-b border-[#1C1412]/08 pb-4">
              <div>
                <p className="text-[10px] font-medium tracking-[0.32em] text-[#C45B6A]">ÉCRIN</p>
                <h2 className="font-display mt-1 text-xl font-semibold text-[#1C1412]">
                  Votre commande
                </h2>
              </div>
              {purchase.orderId ? (
                <p className="font-display text-[15px] font-semibold text-[#1C1412]/45">
                  RQ-{purchase.orderId}
                </p>
              ) : null}
            </div>

            <ul className="divide-y divide-[#1C1412]/06">
              {purchase.contents.map((item) => (
                <li key={`${item.id}-${item.name}`} className="flex gap-5 py-6">
                  {itemImage(item.id) ? (
                    <div className="h-28 w-24 shrink-0 overflow-hidden bg-[#F7F1EC]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={itemImage(item.id)} alt="" className="h-full w-full object-cover" />
                    </div>
                  ) : null}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <p className="font-display text-xl font-semibold text-[#1C1412]">{item.name}</p>
                      <p className="mt-1 text-[12px] tracking-wide text-[#1C1412]/40">
                        Quantité {item.quantity}
                      </p>
                    </div>
                    <p className="mt-4 text-[16px] font-semibold tabular-nums text-[#1C1412]">
                      {item.price * item.quantity}
                      <span className="ml-1 text-[12px] font-medium text-[#1C1412]/40">Dhs</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-3 border-t border-[#1C1412]/08 pt-5">
              <div className="flex justify-between text-[13px] text-[#1C1412]/45">
                <span>Livraison</span>
                <span className="font-medium text-[#1C1412]">Gratuite</span>
              </div>
              <div className="flex justify-between text-[13px] text-[#1C1412]/45">
                <span>Paiement</span>
                <span className="font-medium text-[#1C1412]">À la porte · COD</span>
              </div>
              <div className="flex items-end justify-between pt-2">
                <span className="text-[13px] font-semibold tracking-wide text-[#1C1412]">
                  Total à la livraison
                </span>
                <span className="font-display text-3xl font-semibold tabular-nums text-[#1C1412]">
                  {purchase.value}
                  <span className="ml-1 text-base font-medium">Dhs</span>
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Preuve */}
        <section className="mt-10">
          <p className="text-[10px] font-medium tracking-[0.32em] text-[#C45B6A]">VOIX DU MAROC</p>
          <h2 className="font-display mt-1.5 text-2xl font-semibold text-[#1C1412]">
            Elles ont répondu à l’appel
          </h2>
          <div className="mt-6 space-y-4">
            {PROOFS.map((p) => (
              <blockquote
                key={p.name}
                className="border-l-[3px] border-[#C4A484] bg-white px-5 py-4"
              >
                <p className="text-[14px] leading-relaxed text-[#1C1412]/70">“{p.text}”</p>
                <footer className="mt-3 text-[12px] font-semibold tracking-wide text-[#1C1412]">
                  {p.name}
                  <span className="font-normal text-[#1C1412]/40"> · {p.city}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* Promesse brand */}
        <section className="relative mt-10 overflow-hidden border border-[#C4A484]/30 bg-[#F7F1EC] px-6 py-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,164,132,0.28),transparent_65%)]" />
          <div className="relative">
            <p className="font-display text-2xl font-semibold tracking-[0.08em] text-[#C45B6A]">رونق</p>
            <p className="font-display mt-4 text-2xl font-semibold leading-snug text-[#1C1412] md:text-3xl">
              Ouvrez · inspectez · puis payez
            </p>
            <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-[#1C1412]/50">
              Maison marocaine. Collection courte. Confiance à la porte — aucun paiement d’avance.
            </p>
          </div>
        </section>

        <footer className="mt-8 pb-8 text-center">
          <p className="text-[11px] tracking-wide text-[#1C1412]/35">
            {SITE.fullName} · Casablanca · Appels 9h–21h
          </p>
          {(social.instagram || social.tiktok || social.facebook) && (
            <p className="mt-2 text-[12px]">
              {social.instagram && (
                <a
                  href={social.instagram}
                  className="font-medium text-[#C45B6A] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              )}
              {social.tiktok && (
                <>
                  {social.instagram ? " · " : null}
                  <a
                    href={social.tiktok}
                    className="font-medium text-[#C45B6A] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TikTok
                  </a>
                </>
              )}
              {social.facebook && (
                <>
                  {social.instagram || social.tiktok ? " · " : null}
                  <a
                    href={social.facebook}
                    className="font-medium text-[#C45B6A] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                </>
              )}
            </p>
          )}
        </footer>
      </div>
    </div>
  );
}
