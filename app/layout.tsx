import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import Header from "../components/Header";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";
import Pixels from "../components/Pixels";
import WhatsAppButton from "../components/WhatsAppButton";

const notoKufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Raonaq Beauty | رونق — أدوات تصفيف الشعر الاحترافية في المغرب",
  description:
    "اكتشفي مجموعة أدوات تصفيف الشعر الاحترافية من رونق بيوتي. توصيل مجاني والدفع عند الاستلام في جميع أنحاء المغرب.",
  openGraph: {
    title: "Raonaq Beauty | رونق بيوتي",
    description: "أدوات تصفيف الشعر الاحترافية — توصيل مجاني والدفع عند الاستلام",
    url: "https://raonaqbeauty.com",
    siteName: "Raonaq Beauty",
    locale: "ar_MA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${notoKufi.className} bg-white text-[#1C1412] min-h-screen flex flex-col`}>
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
