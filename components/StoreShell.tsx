"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import CartChrome from "./CartChrome";
import WhatsAppButton from "./WhatsAppButton";

/** Cache header/footer sur /thank-you (page marque immersive). */
export default function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare =
    pathname === "/thank-you" ||
    pathname?.startsWith("/thank-you/") ||
    pathname?.startsWith("/admin");

  return (
    <>
      {!bare ? <Header /> : null}
      <main className="flex-1">{children}</main>
      {!bare ? (
        <>
          <Footer />
          <CartChrome />
          <WhatsAppButton />
        </>
      ) : null}
    </>
  );
}
