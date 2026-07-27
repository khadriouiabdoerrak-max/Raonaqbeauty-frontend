"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import AnnouncementBar from "./AnnouncementBar";

export default function Header() {
  const { cart, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = cart.reduce((t, i) => t + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      <AnnouncementBar />

      <header
        className={`w-full bg-white/95 backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "shadow-lg shadow-[#1C1412]/5" : "shadow-none border-b border-[#C4A484]/20"
        }`}
      >
        <div className="container mx-auto px-4 h-[72px] flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C45B6A] to-[#1C1412] text-white flex items-center justify-center font-black text-lg shadow-md shadow-[#C45B6A]/25">
              R
            </div>
            <div className="leading-tight">
              <p className="font-black text-[#1C1412] text-lg tracking-tight">Raonaq</p>
              <p className="text-[10px] text-[#C4A484] font-bold -mt-0.5 tracking-widest uppercase">رونق بيوتي</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "/", label: "الرئيسية" },
              { href: "/collection", label: "المنتجات" },
              { href: "/about", label: "من نحن" },
              { href: "/contact", label: "اتصل بنا" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[#1C1412] font-bold hover:text-[#C45B6A] transition-colors text-sm"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* CMC Badge */}
            <div className="hidden md:flex items-center gap-1.5 bg-[#F7F1EC] px-3 py-1.5 rounded-full border border-[#C4A484]/30">
              <span className="text-[#C4A484] text-xs">✦</span>
              <span className="text-[10px] font-bold text-[#1C1412] tracking-wide">توصيل سريع + COD</span>
            </div>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-[#1C1412] text-white rounded-full hover:bg-[#C45B6A] transition-colors shadow-lg shadow-[#1C1412]/10"
              aria-label="سلة المشتريات"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C45B6A] text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[#1C1412]"
              aria-label="القائمة"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 space-y-4" dir="rtl">
            {[
              { href: "/", label: "الرئيسية" },
              { href: "/collection", label: "المنتجات" },
              { href: "/about", label: "من نحن" },
              { href: "/contact", label: "اتصل بنا" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block text-[#1C1412] font-semibold text-lg py-2 border-b border-gray-50 hover:text-[#C45B6A]"
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}
