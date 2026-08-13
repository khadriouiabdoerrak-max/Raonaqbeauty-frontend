"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import AnnouncementBar from "./AnnouncementBar";
import BrandLogo from "./BrandLogo";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/collection", label: "Collection" },
  { href: "/about", label: "La maison" },
  { href: "/contact", label: "Contact" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const { cart, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = cart.reduce((t, i) => t + i.quantity, 0);

  const isHome = pathname === "/";
  const overHero = isHome && !scrolled && !mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const linkClass = (href: string) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    if (overHero) {
      return active
        ? "text-white font-semibold"
        : "text-white/75 font-medium hover:text-white transition-colors";
    }
    return active
      ? "text-rosewood font-semibold"
      : "text-warm-black font-medium hover:text-rosewood transition-colors";
  };

  return (
    <div className="sticky top-0 z-50">
      <AnnouncementBar />

      <header
        className={`w-full transition-all duration-300 ${
          overHero
            ? "bg-[#1C1412]/35 backdrop-blur-md border-b border-white/10"
            : "bg-pearl-blush/95 backdrop-blur-xl border-b border-champagne/25"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 md:h-[96px]">
          <Link href="/" className="flex h-12 shrink-0 items-center md:h-[76px]" aria-label="Raonaq — accueil">
            <BrandLogo variant={overHero ? "white" : "color"} />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`text-sm tracking-wide ${linkClass(l.href)}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/collection"
              className={`hidden items-center px-4 py-2 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors md:inline-flex ${
                overHero
                  ? "bg-white text-warm-black hover:bg-[#C4A484]"
                  : "bg-warm-black text-white hover:bg-rosewood"
              }`}
            >
              Shop
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative rounded-full p-2.5 transition-colors ${
                overHero
                  ? "bg-white/15 text-white hover:bg-rosewood"
                  : "bg-warm-black text-white hover:bg-rosewood"
              }`}
              aria-label="Panier"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rosewood text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 md:hidden ${overHero ? "text-white" : "text-warm-black"}`}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="space-y-1 border-t border-champagne/20 bg-pearl-blush px-6 py-5 md:hidden">
            {links.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block border-b border-champagne/15 py-3 text-lg ${
                    active ? "font-semibold text-rosewood" : "font-medium text-warm-black hover:text-rosewood"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link href="/collection" onClick={() => setMobileOpen(false)} className="btn btn-primary btn-block btn-md mt-4">
              Voir la collection
            </Link>
          </div>
        )}
      </header>
    </div>
  );
}
