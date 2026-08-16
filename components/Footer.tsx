"use client";

import { usePathname } from "next/navigation";
import FooterInner from "./FooterInner";

/** Hide store footer on admin desk */
export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <FooterInner />;
}
