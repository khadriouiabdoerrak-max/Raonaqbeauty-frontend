import type { Metadata } from "next";
import { Suspense } from "react";
import AdminShell from "./AdminShell";

export const metadata: Metadata = {
  title: "مكتب رونق",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div
          dir="rtl"
          className="flex min-h-[100dvh] items-center justify-center bg-[#F7F1EC] text-[#6B5E58]"
        >
          جاري الفتح…
        </div>
      }
    >
      <AdminShell />
    </Suspense>
  );
}
