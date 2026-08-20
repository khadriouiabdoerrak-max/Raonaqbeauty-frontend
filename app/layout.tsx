import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import StoreShell from "../components/StoreShell";
import Pixels from "../components/Pixels";
import SiteTracker from "../components/SiteTracker";
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
    images: [{ url: "/images/raonaq-logo.webp", alt: "Raonaq Beauty" }],
  },
  icons: {
    icon: "/images/raonaq-logo.webp",
    apple: "/images/raonaq-logo.webp",
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
          <StoreShell>{children}</StoreShell>
          <SiteTracker />
        </CartProvider>
        <Pixels
          facebookId={process.env.FB_PIXEL_ID || process.env.NEXT_PUBLIC_FB_PIXEL_ID}
          tiktokId={process.env.TIKTOK_PIXEL_ID || process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID}
          snapId={process.env.SNAP_PIXEL_ID || process.env.NEXT_PUBLIC_SNAPCHAT_PIXEL_ID}
        />
      </body>
    </html>
  );
}
