import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import Header from "../components/Header";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal";
import Footer from "../components/Footer";
import Pixels from "../components/Pixels";
import WhatsAppButton from "../components/WhatsAppButton";
import { SITE } from "../lib/site";

const outfit = localFont({
  src: [
    { path: "./fonts/outfit-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/outfit-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/outfit-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/outfit-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-sans",
});

const display = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://raonaqbeauty.com"),
  title: {
    default: "Raonaq Beauty — Le salon, chez vous · Maroc",
    template: "%s | Raonaq",
  },
  description: SITE.description,
  openGraph: {
    title: "Raonaq Beauty",
    description: SITE.tagline,
    url: "https://raonaqbeauty.com",
    siteName: SITE.fullName,
    locale: "fr_MA",
    type: "website",
    images: [{ url: "/images/raonaq-logo.png", alt: "Raonaq Beauty" }],
  },
  icons: {
    icon: "/images/raonaq-logo.png",
    apple: "/images/raonaq-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" dir="ltr">
      <body
        className={`${outfit.className} ${outfit.variable} ${display.variable} bg-pearl-blush text-warm-black min-h-screen flex flex-col`}
      >
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <CheckoutModal />
          <WhatsAppButton />
        </CartProvider>
        <Pixels />
      </body>
    </html>
  );
}
