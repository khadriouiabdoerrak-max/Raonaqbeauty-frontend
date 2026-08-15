"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "../../context/CartContext";
import { trackPurchase, type LastPurchase, type PixelContent } from "../../lib/pixels";
import { getWhatsAppDisplay, getWhatsAppLink } from "../../lib/contact";
import { clearPendingOrder, consumePurchaseForTracking, readLastOrder } from "../../lib/orders";
import { products, productThumb } from "../../lib/products";
import { SITE, getSocialLinks } from "../../lib/site";

/**
 * Thank-you — pattern des marques DTC premium (Massima / Glossier / Mejuri),
 * adapté COD Maroc : 1 CTA = confirmer WhatsApp (équivalent « Track order »).
 *
 * Above the fold : succès + n° + CTA
 * Ensuite : reçu (adresse + articles) + timeline + pied marque
 */

const timeline = [
  { label: "Confirmée", detail: "WhatsApp ou appel" },
  { label: "Préparée", detail: "Depuis Casablanca" },
  { label: "Expédiée", detail: "Livraison gratuite" },
  { label: "Chez vous", detail: "Inspectez, puis payez" },
];

function itemImage(id: string) {
  const product = products.find((p) => p.id === id);
  return product ? productThumb(product) : "";
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

export default function ThankYouPage() {
  const { finishOrder } = useCart();
  const tracked = useRef(false);
  const [purchase, setPurchase] = useState<LastPurchase | null>(null);
  const social = getSocialLinks();
  const whatsappDisplay = getWhatsAppDisplay();

  useEffect(() => {
    finishOrder();
    clearPendingOrder();

    const data = readLastOrder();
    if (data) setPurchase(data);

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
  }, [finishOrder]);

  const customer = purchase?.customer;
  const greetName = firstName(customer?.name);
  const hasItems = Boolean(purchase && purchase.contents.length > 0);

  const whatsappBody = (() => {
    const lines = ["Bonjour Raonaq,"];
    if (purchase?.orderId) lines.push(`Je confirme ma commande N° ${purchase.orderId}.`);
    else lines.push("Je souhaite confirmer ma commande.");
    if (customer?.name) lines.push(`Nom : ${customer.name}`);
    if (customer?.phone) lines.push(`Téléphone : ${customer.phone}`);
    if (customer?.city) lines.push(`Ville : ${customer.city}`);
    if (customer?.address) lines.push(`Adresse : ${customer.address}`);
    lines.push("Merci de me recontacter pour valider la livraison.");
    return lines.join("\n");
  })();

  const whatsapp = getWhatsAppLink(whatsappBody);
  const whatsappFix = getWhatsAppLink(
    purchase?.orderId
      ? `Bonjour Raonaq,\nJe souhaite corriger les infos de ma commande N° ${purchase.orderId}.`
      : "Bonjour Raonaq,\nJe souhaite corriger les infos de ma commande.",
  );

  return (
    <div className="min-h-full bg-[#F7F1EC]">
      {/* 1. Confirmation header — calm, brand, like Mejuri / Massima */}
      <header className="border-b border-[#1C1412]/08 bg-[#F7F1EC]">
        <div className="mx-auto max-w-xl px-5 pt-10 pb-8 text-center md:pt-14 md:pb-10">
          <p className="font-display text-2xl font-semibold tracking-[0.12em] text-[#1C1412]">
            رونق
          </p>
          <p className="mt-1 text-[10px] font-medium tracking-[0.4em] text-[#1C1412]/40">RAONAQ</p>

          <div className="mx-auto mt-7 flex h-11 w-11 items-center justify-center rounded-full bg-[#1C1412]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5 text-[#C4A484]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <h1 className="font-display mt-5 text-3xl font-semibold leading-tight text-[#1C1412] md:text-4xl">
            {greetName ? `Merci, ${greetName}` : "Merci"}
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-[#1C1412]/55">
            Votre commande est enregistrée. Confirmez-la pour lancer la préparation.
          </p>

          {purchase?.orderId ? (
            <p className="mt-5 text-[13px] text-[#1C1412]/45">
              Commande{" "}
              <span className="font-semibold tracking-wide text-[#1C1412]">N° {purchase.orderId}</span>
            </p>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-xl px-5 py-8 md:py-10">
        {/* 2. Primary CTA — une seule action (pattern mondial) */}
        <div>
          <p className="text-[11px] font-medium tracking-[0.22em] text-[#C45B6A]">PROCHAINE ÉTAPE</p>
          <h2 className="font-display mt-1 text-2xl font-semibold text-[#1C1412]">
            Confirmer la commande
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-[#1C1412]/55">
            Sans confirmation, nous n’expédions pas. Un message WhatsApp suffit.
          </p>

          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-2.5 bg-[#25D366] px-5 py-4 text-[15px] font-semibold text-white transition hover:brightness-95"
            >
              <IconWhatsApp className="h-5 w-5 shrink-0" />
              Confirmer sur WhatsApp
            </a>
          ) : (
            <div className="mt-5 border border-[#C4A484]/30 bg-white px-5 py-4">
              <p className="text-sm font-semibold text-[#1C1412]">Nous vous contactons sous peu</p>
              <p className="mt-1 text-[13px] text-[#1C1412]/55">
                Gardez votre téléphone à portée — avant l’expédition.
              </p>
              <a
                href={`mailto:${SITE.email}?subject=${encodeURIComponent(
                  purchase?.orderId ? `Confirmation commande ${purchase.orderId}` : "Confirmation Raonaq",
                )}`}
                className="mt-2 inline-block text-[13px] font-semibold text-[#C45B6A] underline-offset-4 hover:underline"
              >
                {SITE.email}
              </a>
            </div>
          )}

          {whatsappDisplay ? (
            <p className="mt-2 text-center text-[12px] text-[#1C1412]/40" dir="ltr">
              {whatsappDisplay}
            </p>
          ) : null}
        </div>

        {/* 3. Timeline — “what happens next” (réduit WISMO) */}
        <div className="mt-10">
          <p className="text-[11px] font-medium tracking-[0.22em] text-[#C45B6A]">ENSUITE</p>
          <h2 className="font-display mt-1 text-xl font-semibold text-[#1C1412]">
            De la confirmation à la porte
          </h2>

          <ol className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 sm:gap-2">
            {timeline.map((step, i) => (
              <li key={step.label} className="relative text-left sm:text-center">
                <div className="flex items-center gap-2 sm:flex-col sm:gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center text-[12px] font-semibold sm:mx-auto ${
                      i === 0
                        ? "bg-[#1C1412] text-[#C4A484]"
                        : "border border-[#C4A484]/40 text-[#C45B6A]"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1C1412]">{step.label}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-[#1C1412]/45">{step.detail}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-6 text-[13px] leading-relaxed text-[#1C1412]/50">
            Livraison gratuite · généralement <span className="font-medium text-[#1C1412]">24–48 h</span> selon
            la ville · paiement à la porte après inspection.
          </p>
        </div>

        {/* 4. Reçu — adresse + articles (non-négociable chez les grandes marques) */}
        {(customer || hasItems) && (
          <div className="mt-10 border-t border-[#1C1412]/10 pt-8">
            <p className="text-[11px] font-medium tracking-[0.22em] text-[#C45B6A]">REÇU</p>
            <h2 className="font-display mt-1 text-xl font-semibold text-[#1C1412]">
              Récapitulatif
            </h2>

            {customer && (
              <div className="mt-6">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-[#1C1412]/35">
                  Livraison
                </p>
                <div className="mt-3 space-y-1 text-[14px] leading-relaxed text-[#1C1412]">
                  <p className="font-semibold">{customer.name}</p>
                  <p dir="ltr">{customer.phone}</p>
                  <p>
                    {customer.address}
                    {customer.city ? `, ${customer.city}` : ""}
                  </p>
                </div>
                {whatsappFix && (
                  <a
                    href={whatsappFix}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-[13px] font-medium text-[#C45B6A] underline-offset-4 hover:underline"
                  >
                    Modifier sur WhatsApp
                  </a>
                )}
              </div>
            )}

            {hasItems && purchase && (
              <div className={customer ? "mt-8" : "mt-6"}>
                <p className="text-[12px] font-semibold uppercase tracking-wider text-[#1C1412]/35">
                  Articles
                </p>
                <ul className="mt-4 space-y-4">
                  {purchase.contents.map((item) => (
                    <li key={`${item.id}-${item.name}`} className="flex gap-4">
                      {itemImage(item.id) ? (
                        <div className="h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={itemImage(item.id)} alt="" className="h-full w-full object-cover" />
                        </div>
                      ) : null}
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <p className="truncate font-semibold text-[#1C1412]">{item.name}</p>
                        <p className="text-[12px] text-[#1C1412]/45">Qté {item.quantity}</p>
                      </div>
                      <p className="shrink-0 self-center text-[14px] font-semibold text-[#1C1412]">
                        {item.price * item.quantity} Dhs
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 space-y-2 border-t border-[#1C1412]/10 pt-4 text-[14px]">
                  <div className="flex justify-between text-[#1C1412]/50">
                    <span>Livraison</span>
                    <span className="font-medium text-[#1C1412]">Gratuite</span>
                  </div>
                  <div className="flex justify-between text-[#1C1412]/50">
                    <span>Paiement</span>
                    <span className="font-medium text-[#1C1412]">À la porte · COD</span>
                  </div>
                  <div className="flex items-baseline justify-between pt-2">
                    <span className="font-semibold text-[#1C1412]">Total</span>
                    <span className="font-display text-2xl font-semibold text-[#1C1412]">
                      {purchase.value} Dhs
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. Pied marque — léger, pas une 2e landing */}
        <footer className="mt-12 border-t border-[#1C1412]/10 pt-8 text-center">
          <p className="font-display text-lg font-semibold text-[#1C1412]">
            Ouvrez · inspectez · puis payez
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-[#1C1412]/45">
            Maison marocaine · Casablanca · {SITE.hours}
          </p>

          {(social.instagram || social.tiktok || social.facebook) && (
            <p className="mt-4 text-[12px] text-[#1C1412]/40">
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
