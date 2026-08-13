import Link from "next/link";
import { getWhatsAppDisplay, getWhatsAppLink } from "../lib/contact";
import { getSocialLinks, SITE } from "../lib/site";

const nav = [
  { href: "/", label: "Accueil" },
  { href: "/collection", label: "Collection" },
  { href: "/about", label: "La maison" },
  { href: "/contact", label: "Contact" },
] as const;

const trust = [
  "Paiement à la livraison, après inspection",
  "Livraison gratuite dans tout le Maroc",
  "Généralement 24–48 h",
] as const;

export default function Footer() {
  const social = getSocialLinks();
  const whatsapp = getWhatsAppLink();
  const whatsappDisplay = getWhatsAppDisplay();
  const hasSocial = Boolean(social.instagram || social.facebook || social.tiktok);

  return (
    <footer className="bg-[#1C1412] text-white">
      <div className="h-px bg-gradient-to-r from-transparent via-[#C4A484]/50 to-transparent" />

      <div className="container mx-auto px-4 py-14 md:py-20">
        <div className="max-w-xl">
          <p className="text-[11px] font-medium tracking-[0.42em] text-[#C4A484]">RAONAQ</p>
          <p className="font-display mt-3 text-3xl font-semibold leading-tight md:text-4xl">{SITE.fullName}</p>
          <p className="mt-4 max-w-md text-sm font-medium leading-7 text-white/55 md:text-[15px]">
            {SITE.description}
          </p>
        </div>

        <div className="mt-12 grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
          <div>
            <p className="text-[11px] font-medium tracking-[0.28em] text-[#C4A484]">Maison</p>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm font-medium text-white/70 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium tracking-[0.28em] text-[#C4A484]">Confiance</p>
            <ul className="mt-5 space-y-3">
              {trust.map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm font-medium leading-6 text-white/70">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#C4A484]" />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium tracking-[0.28em] text-[#C4A484]">Contact</p>
            <div className="mt-5 space-y-3 text-sm font-medium">
              <a href={`mailto:${SITE.email}`} className="block text-white/70 transition-colors hover:text-white">
                {SITE.email}
              </a>
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="block text-white/70 transition-colors hover:text-white">
                  WhatsApp {whatsappDisplay}
                </a>
              )}
              <p className="text-white/45">{SITE.city}</p>
            </div>
            {hasSocial && (
              <div className="mt-6 flex gap-2">
                {social.instagram && (
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/70 hover:border-[#C4A484] hover:text-white" aria-label="Instagram">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  </a>
                )}
                {social.facebook && (
                  <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/70 hover:border-[#C4A484] hover:text-white" aria-label="Facebook">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </a>
                )}
                {social.tiktok && (
                  <a href={social.tiktok} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/70 hover:border-[#C4A484] hover:text-white" aria-label="TikTok">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.79a8.18 8.18 0 004.78 1.52V6.85a4.85 4.85 0 01-1.01-.16z" /></svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col gap-2 px-4 py-5 text-[12px] font-medium text-white/35 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Raonaq Beauty. Tous droits réservés.</p>
          <p className="tracking-wide">{SITE.domain}</p>
        </div>
      </div>
    </footer>
  );
}
