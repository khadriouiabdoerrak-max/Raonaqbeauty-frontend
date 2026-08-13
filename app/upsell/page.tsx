"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** العرض الإضافي تحيّد — أي زيارة قديمة كتمشي لصفحة التأكيد */
export default function UpsellRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/thank-you");
  }, [router]);

  return null;
}
