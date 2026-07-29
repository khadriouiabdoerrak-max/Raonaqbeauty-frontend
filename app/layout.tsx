import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import Header from "../components/Header";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";
import Pixels from "../components/Pixels";
import WhatsAppButton from "../components/WhatsAppButton";
import { SITE } from "../lib/site";

const notoKufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "رونق | Raonaq — نتيجة صالون فدارك · المغرب",
    template: "%s | رونق",
  },
  description: SITE.description,
  openGraph: {
    title: "رونق | Raonaq Beauty",
    description: SITE.tagline,
    url: "https://raonaqbeauty.com",
    siteName: SITE.fullName,
    locale: "ar_MA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${notoKufi.className} bg-pearl-blush text-warm-black min-h-screen flex flex-col`}>
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
        </CartProvider>
        {/* Pixels loaded after page interaction for maximum performance */}
        <Pixels />
      </body>
    </html>
  );
}
