"use client";

import { useState } from "react";
import Link from "next/link";
import { getWhatsAppDisplay, getWhatsAppLink, getWhatsAppNumber } from "../../lib/contact";
import { SITE } from "../../lib/site";

const topics = [
  "Choisir l’outil",
  "Suivre ma commande",
  "Livraison et paiement",
  "Autre",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", topic: topics[0], message: "" });
  const whatsappDisplay = getWhatsAppDisplay();
  const whatsappHref = getWhatsAppLink("Bonjour, j’aimerais contacter Raonaq");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = getWhatsAppNumber();
    if (phone) {
      const text = `Nom : ${form.name}\nTéléphone : ${form.phone}\nSujet : ${form.topic}\nMessage : ${form.message}`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
    }
    setSubmitted(true);
  };

  const fieldClass =
    "w-full rounded-xl border border-[#1C1412]/12 bg-white px-4 py-3 text-left outline-none transition-all focus:border-rosewood focus:ring-2 focus:ring-rosewood/25";

  return (
    <div className="bg-[#F7F1EC]">
      <section className="relative overflow-hidden bg-[#1C1412] text-white">
        <img
          src="/images/raonaq-tools-editorial.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1412] via-[#1C1412]/80 to-[#1C1412]/60" />
        <div className="relative container mx-auto max-w-3xl px-4 py-20 md:py-28">
          <p className="text-[11px] font-medium tracking-[0.42em] text-[#C4A484]">RAONAQ · Casablanca</p>
          <h1 className="font-display mt-4 text-4xl font-semibold leading-tight md:text-6xl">Nous sommes là</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/70 md:text-lg">
            Nous confirmons chaque commande avec vous. Choix de l’outil, livraison, suivi — la même promesse : vous inspectez, puis vous payez.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "WhatsApp", value: whatsappDisplay || "Numéro à configurer", href: whatsappHref },
            { label: "E-mail", value: SITE.email, href: `mailto:${SITE.email}` },
            { label: "Maison", value: SITE.city, href: null },
          ].map((item) => (
            <div key={item.label} className="border border-[#C4A484]/25 bg-white px-6 py-7">
              <p className="text-[11px] font-medium tracking-[0.22em] text-[#C4A484]">{item.label}</p>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="mt-3 block text-lg font-semibold text-[#1C1412] hover:text-[#C45B6A]"
                >
                  {item.value}
                </a>
              ) : (
                <p className="mt-3 text-lg font-semibold text-[#1C1412]">{item.value}</p>
              )}
            </div>
          ))}
        </div>
        <p className="mt-5 text-center text-sm font-medium text-[#1C1412]/45">{SITE.hours}</p>
      </section>

      <section className="container mx-auto grid gap-10 px-4 pb-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="text-[11px] font-medium tracking-[0.28em] text-[#C45B6A]">LIGNE DIRECTE</p>
          <h2 className="font-display mt-3 text-3xl font-semibold text-[#1C1412] md:text-4xl">WhatsApp est notre porte</h2>
          <p className="mt-4 text-[15px] leading-8 text-[#1C1412]/60">
            Au Maroc, la confiance passe par la voix. Écrivez-nous pour choisir l’outil, ou confirmer une commande — la même équipe suit l’expédition.
          </p>
          <ul className="mt-8 space-y-3 text-sm font-medium text-[#1C1412]/70">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C45B6A]" />
              Choisir entre volume, lisse et brillance
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C45B6A]" />
              Suivre la commande après confirmation
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C45B6A]" />
              Livraison gratuite et inspection à la porte
            </li>
          </ul>
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg mt-8 bg-whatsapp text-white hover:brightness-95"
            >
              Ouvrir WhatsApp
            </a>
          )}
          <Link href="/collection" className="mt-4 block text-sm font-semibold text-[#C45B6A]">
            Ou voir d’abord la collection
          </Link>
        </div>

        <div className="border border-[#C4A484]/25 bg-white p-6 md:p-9">
          {submitted ? (
            <div className="py-12 text-center">
              <p className="text-[11px] font-medium tracking-[0.28em] text-[#C4A484]">RAONAQ</p>
              <h3 className="font-display mt-4 text-2xl font-semibold text-[#1C1412]">Nous vous avons</h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#1C1412]/55">
                Si WhatsApp s’est ouvert, terminez le message là-bas. Sinon, vérifiez le numéro et réessayez.
              </p>
            </div>
          ) : (
            <>
              <p className="text-[11px] font-medium tracking-[0.28em] text-[#C45B6A]">MESSAGE</p>
              <h2 className="font-display mt-2 text-2xl font-semibold text-[#1C1412]">Écrivez-nous</h2>
              <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#1C1412]" htmlFor="contact-name">
                    Nom
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={fieldClass}
                    placeholder="Votre nom"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#1C1412]" htmlFor="contact-phone">
                    Téléphone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={fieldClass}
                    placeholder="0612345678"
                    dir="ltr"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-[#1C1412]">Le sujet</p>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setForm({ ...form, topic })}
                        className={`rounded-full px-3 py-2 text-[12px] font-medium ${
                          form.topic === topic
                            ? "bg-[#1C1412] text-white"
                            : "bg-[#F7F1EC] text-[#1C1412]/70"
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#1C1412]" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${fieldClass} resize-none`}
                    placeholder="Dites-nous ce dont vous avez besoin"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block h-12 text-sm">
                  {whatsappHref ? "Envoyer via WhatsApp" : "Envoyer"}
                </button>
                <p className="text-center text-[11px] font-medium text-[#1C1412]/40">
                  Nous confirmons les commandes par téléphone avant l’expédition
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
