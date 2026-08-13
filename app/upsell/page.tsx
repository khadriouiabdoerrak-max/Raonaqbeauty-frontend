"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

/** العرض الإضافي تحيّد — أي زيارة قديمة كتمشي لصفحة التأكيد */
export default function UpsellRedirectPage() {
  const router = useRouter();
  const { closeOverlays } = useCart();

  useEffect(() => {
    closeOverlays();
    router.replace("/thank-you");
  }, [closeOverlays, router]);

  return null;
}
