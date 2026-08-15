"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { trackInitiateCheckout } from "../lib/pixels";
import { createOrder, saveLastOrder, toLastPurchase } from "../lib/orders";

type FieldKey = "name" | "phone" | "city" | "address";
type FieldErrors = Partial<Record<FieldKey, string>>;

const emptyForm = {
  name: "",
  phone: "",
  city: "",
  address: "",
};

function validatePhone(phoneNum: string) {
  return /^(?:(?:\+|00)212|0)[67]\d{8}$/.test(phoneNum.replace(/\s/g, ""));
}

function validateForm(form: typeof emptyForm, cartLength: number): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = "Indiquez votre nom complet";
  if (!validatePhone(form.phone)) errors.phone = "Numéro marocain — ex. 0612345678";
  if (form.city.trim().length < 2) errors.city = "Indiquez votre ville";
  if (form.address.trim().length < 5) errors.address = "Indiquez l’adresse de livraison";
  if (cartLength === 0) errors.address = "Le panier est vide";
  return errors;
}

export default function CheckoutModal() {
  const {
    cart,
    cartTotal,
    isCheckoutOpen,
    closeCheckout,
    backToCart,
    finishOrder,
  } = useCart();
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const checkoutTracked = useRef(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const fieldRefs = {
    name: nameRef,
    phone: phoneRef,
    city: cityRef,
    address: addressRef,
  };

  useEffect(() => {
    if (!isCheckoutOpen) {
      checkoutTracked.current = false;
      setErrors({});
      setFormError("");
      setIsSubmitting(false);
      return;
    }
    if (checkoutTracked.current || cart.length === 0) return;
    checkoutTracked.current = true;
    trackInitiateCheckout(
      cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      cartTotal
    );
  }, [isCheckoutOpen, cart, cartTotal]);

  if (!isCheckoutOpen) return null;

  const setField = (key: FieldKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
    if (formError) setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validateForm(form, cart.length);
    setErrors(nextErrors);
    setFormError("");

    const firstInvalid = (["name", "phone", "city", "address"] as FieldKey[]).find(
      (key) => nextErrors[key]
    );
    if (firstInvalid) {
      fieldRefs[firstInvalid].current?.focus();
      fieldRefs[firstInvalid].current?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
      return;
    }

    setIsSubmitting(true);

    const customer = {
      name: form.name.trim(),
      phone: form.phone.replace(/\s/g, ""),
      city: form.city.trim(),
      address: form.address.trim(),
    };

    try {
      const order = await createOrder({
        ...customer,
        cart,
        total: cartTotal,
        acceptedUpsell: false,
      });

      try {
        saveLastOrder(
          toLastPurchase({
            orderId: order.orderId,
            eventId: order.eventId,
            total: order.total,
            contents: order.contents,
            customer,
          })
        );
      } catch (err) {
        console.error("Failed to save last purchase locally:", err);
      }

      setForm(emptyForm);
      router.push("/thank-you");
      finishOrder();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setFormError("Impossible d’enregistrer la commande. Réessayez.");
    }
  };

  const fieldClass = (key: FieldKey) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-left outline-none transition-all focus:ring-2 ${
      errors[key]
        ? "border-rosewood focus:border-rosewood focus:ring-rosewood/25"
        : "border-[#1C1412]/12 focus:border-rosewood focus:ring-rosewood/25"
    }`;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-[#1C1412]/55 sm:items-center sm:p-4"
      onClick={closeCheckout}
    >
      <div
        className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-champagne/25 bg-white shadow-2xl sm:max-h-[90vh] sm:max-w-md sm:rounded-2xl"
        dir="ltr"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-[#1C1412]/20" />
        </div>

        <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-2 sm:px-6 sm:pt-5">
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="text-sm font-medium tracking-[0.2em] text-champagne">RAONAQ</p>
            <h2 id="checkout-title" className="mt-1 text-2xl font-semibold text-warm-black">
              Finaliser
            </h2>
            <p className="mt-1 text-sm font-medium text-warm-black/55">
              Paiement à la livraison · livraison gratuite
            </p>
          </div>
          <button
            type="button"
            onClick={closeCheckout}
            className="shrink-0 rounded-xl bg-pearl-blush p-2 text-warm-black/50 transition-colors hover:text-warm-black"
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-3.5 overflow-y-auto px-5 pb-4 sm:px-6">
            <div className="space-y-2 rounded-xl border border-champagne/25 bg-pearl-blush p-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 text-right">
                    <p className="truncate text-sm font-black text-warm-black">{item.name}</p>
                    <p className="text-[11px] font-bold text-warm-black/45">× {item.quantity}</p>
                  </div>
                  <p className="shrink-0 text-sm font-black text-rosewood">
                    {item.price * item.quantity} Dhs
                  </p>
                </div>
              ))}
              <button
                type="button"
                onClick={backToCart}
                className="w-full pt-1 text-center text-[12px] font-black text-rosewood"
              >
                Modifier le panier
              </button>
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-warm-black" htmlFor="checkout-name">
                Nom complet
              </label>
              <input
                id="checkout-name"
                ref={nameRef}
                type="text"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Prénom et nom"
                autoComplete="name"
                enterKeyHint="next"
                className={fieldClass("name")}
              />
              {errors.name && (
                <p className="mt-1 text-xs font-bold text-rosewood">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-warm-black" htmlFor="checkout-phone">
                Téléphone
              </label>
              <input
                id="checkout-phone"
                ref={fieldRefs.phone}
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="Ex. 0612345678"
                autoComplete="tel"
                enterKeyHint="next"
                className={`${fieldClass("phone")} text-left`}
                dir="ltr"
              />
              {errors.phone && (
                <p className="mt-1 text-xs font-bold text-rosewood">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-warm-black" htmlFor="checkout-city">
                Ville
              </label>
              <input
                id="checkout-city"
                ref={fieldRefs.city}
                type="text"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                placeholder="Ex. Casablanca"
                autoComplete="address-level2"
                enterKeyHint="next"
                className={fieldClass("city")}
              />
              {errors.city && (
                <p className="mt-1 text-xs font-bold text-rosewood">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-bold text-warm-black" htmlFor="checkout-address">
                Adresse complète
              </label>
              <textarea
                id="checkout-address"
                ref={fieldRefs.address}
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
                placeholder="Quartier, rue, n° ou point de repère"
                rows={2}
                enterKeyHint="done"
                className={`${fieldClass("address")} resize-none`}
              />
              {errors.address && (
                <p className="mt-1 text-xs font-bold text-rosewood">{errors.address}</p>
              )}
            </div>

            {formError && (
              <p className="rounded-xl border border-rosewood/30 bg-pearl-blush px-3 py-2 text-sm font-bold text-rosewood">
                {formError}
              </p>
            )}
          </div>

          <div className="border-t border-[#1C1412]/08 bg-white px-5 py-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between text-lg font-black">
              <span className="text-warm-black">Total</span>
              <span className="text-rosewood">{cartTotal} Dhs</span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              onMouseDown={(e) => e.preventDefault()}
              className="btn btn-primary btn-block btn-lg disabled:opacity-70"
            >
              {isSubmitting ? "Enregistrement..." : "Confirmer — payer à la livraison"}
            </button>
            <p className="mt-3 text-center text-[11px] font-medium text-warm-black/45">
              La commande est enregistrée maintenant · inspection à la porte
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
